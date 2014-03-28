var app = angular.module('app', [])
.controller('linkController', function($scope, $http) {
  $http({
    method: "GET",
    url: "/links"
  }).then(function(data) {
    console.log("DATA---------",data);
    return $scope.links = data.data;
  });
});
