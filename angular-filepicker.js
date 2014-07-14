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
		require: ['?ngModel'],
		link: function($scope, element, attrs, ctrls){
			$scope.inkOptions = $scope.$eval(attrs.inkOptions);
			$scope.ngModel = $scope.$eval(attrs.ngModel);

			if($scope.inkOptions.apiKey)
				filepicker.setKey($scope.inkOptions.apiKey);
		},
		controller: function($scope){
			this.scope = $scope;

			this.addPicks = function(picks){
				$scope.ngModel = _.union($scope.ngModel, picks);
			};
			this.removePick = function(image){
				$scope.ngModel = _.without($scope.ngModel, image);
			};

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
.directive("picks", function(){
	return {
		restrict: "E",
		require: '^filemanager',
		template: "<img ng-src='{{pick|thumbnail:width:height:fit}}' ng-click='removePick(pick)' ng-repeat='pick in ngModel'/>",
		link: function(scope, element, attrs, ctrl){
			scope.removePick = ctrl.removePick;
			scope.width = scope.$eval(attrs.width);
			scope.height = scope.$eval(attrs.height);
			scope.fit = attrs.fit;
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