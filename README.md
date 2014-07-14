angular-ink
==================

Directive for filepicker.io
requires scripts from filepicker.io

Basic use:

    <input type="filepicker" ng-model="images" />

Advanced use:

    <filemanager ng-model="$parent.$parent.response.images"
                 ink-options="inkOptions"
                 class="form-control">
      <picks width="34"
             height="34"
             fit="crop"></picks>
      <button type="button" 
              class="btn btn-default"
              picker>Pick images</button>
    </filemanager>