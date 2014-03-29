var app = angular.module('app', [])
.controller('linkController', function($scope, $http) {
  $http({
    method: "GET",
    url: "/links"
  }).then(function(data) {
    return $scope.links = data.data;
  });
})
.controller('navController', function($scope){
  $scope.headers = [
    {'class': 'index', text: 'All Links', actions: function($scope, $http){
      console.log('Hitting the index click function');
      $http({
        method: "GET",
        url: "/links"
      }).then(function(data) {
        $scope.links = data.data;
      });
    }},
    {'class': 'create', text: 'Shorten', actions: function(){

    }},
    {'class': 'logout', text: 'Logout', actions: function(){

    }}
  ];
});
