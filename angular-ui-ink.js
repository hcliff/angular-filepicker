angular.module("ui.ink", [])
.directive("input", function(){
  return {
    restrict: "E",
    require: ['?ngModel'],
    link: function(scope, element, attrs, ctrls) {
      if(attrs.type == "filepicker" && ctrls[0]){
        filepicker.constructWidget(element[0]);
        // Our ng-model is an array of images
        ctrls[0].$parsers.push(function(value){
          if(angular.isString(value)){
            return value.split(",");
          }
          return value;
        });
      }
    }
  };
})
.directive("filemanager", function(){
  return {
    restrict: "E",
    scope: {
       ngModel: '=',
       inkOptions: '=',
    },
    link: function($scope, element, attrs){
      if($scope.inkOptions.apiKey)
        filepicker.setKey($scope.inkOptions.apiKey);
      $scope.picks = $scope.ngModel;
      $scope.$watch('picks', function(value){
        $scope.ngModel = value;
      });
    },
    controller: function($scope){
      this.scope = $scope;
      this.addPicks = function(picks){
        $scope.picks = $scope.picks.concat(picks);
      }
      this.removePick = function(pick){
        $scope.picks = _.without($scope.picks, pick);
      }
    }
  }
})
.directive("picker", function($timeout){
  return {
    require: '^filemanager',
    link: function(scope, element, attrs, fileManager){
      element.on('click', function(){
        filepicker.pickMultiple(scope.inkOptions, function(picks){
          scope.$apply(function(){
            fileManager.addPicks(_.pluck(picks, 'url'));
           });
        });
        return false
      });
    }
  }
})
.directive("pick", function(){
  return {
    require: '^filemanager',
    link: function(scope, element, attrs, fileManager){
      var pick = scope.$eval(attrs['pick']);
      element.on('click', function(){
        scope.$apply(function(){
          fileManager.removePick(pick);
        });
        return false
      });
    }
  }
})
.filter('thumbnail', function() {
  return function(input, width, height, fit) {
    var options = {
      'w': width,
      'h': height,
      'fit': fit
    };
    return input+'/convert?'+_.toQueryString(options);
  }
});