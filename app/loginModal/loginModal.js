angular.module('h54sLoginModal', ['sasAdapter'])

.controller('LoginModalCtrl', [
  '$scope',
  '$interval',
  'sasAdapter',
  function($scope, $interval, sasAdapter) {
    $scope.handleLogin = function() {
      //disable submit button based on loading property
      $scope.loading = true;

      var user = $scope.user;
      var pass = $scope.pass;

      $('#login-form').validator('validate');

      $scope.msg = 'Please wait.';
      $scope.error = false;

      var handler = $interval(function() {
        $scope.msg += '.';
      }, 300);

      sasAdapter.login(user, pass).then(function(status) {
        if(status === -1) {
          $scope.msg = 'Wrong credentials';
          $scope.error = true;
        } else if(status === 200) {
          $scope.error = false;
          $('#login-modal').modal('hide');
        } else {
          $scope.msg = 'Failed request. Please try again later.';
          $scope.error = true;
        }

        $scope.loading = false;
        $interval.cancel(handler);
      }, function(e) {
        $scope.msg = e.message;
        $scope.error = true;
        $scope.loading = false;
        $interval.cancel(handler);
      });
    };

    $scope.handleKeypress = function($event) {
      if($event.keyCode === 13 && !$scope.loading) {
        $scope.handleLogin();
      }
    };

    $scope.$watch('user', function() {
      $scope.msg = '';
      $scope.error = false;
    });
    $scope.$watch('pass', function() {
      $scope.msg = '';
      $scope.error = false;
    });
  }
]);
