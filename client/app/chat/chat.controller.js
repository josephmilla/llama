'use strict';

angular.module('llamaApp')
  .controller('ChatCtrl', function ($scope, $http, Auth) {
    $scope.user = {};
    $scope.errors = {};

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    
    $scope.getLanguage = $http.get('/api/register/'+Auth.getCurrentUser().facebook.id);

  });
