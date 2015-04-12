'use strict';

angular.module('llamaApp')
  .controller('ChatCtrl', function ($scope, $http, Auth) {
    $scope.user = {};
    $scope.errors = {};

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    // $scope.getLanguage = $http.get('/api/register/'+Auth.getCurrentUser().facebook.id);

  });
