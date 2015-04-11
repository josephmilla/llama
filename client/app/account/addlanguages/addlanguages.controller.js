'use strict';

angular.module('llamaApp')
  .controller('addlanguagesCtrl', function ($scope, $http, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.addRegister = function() {
      if($scope.nativeLang === '' || $scope.learningLang === '') {
        return;
      }
      $http.post('/api/register', { user: Auth.getCurrentUser()._id, from: $scope.nativeLang, to: $scope.learningLang });
      $scope.nativeLang = '';
      $scope.learningLang = '';
      $window.location.href = '/chat'
    };

  });