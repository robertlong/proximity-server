function TabFormCtrl($scope) {
  $scope.tabs = [];
 
  $scope.addTab = function() {
    $scope.tabs.push({type:$scope.tabType});
  };
}