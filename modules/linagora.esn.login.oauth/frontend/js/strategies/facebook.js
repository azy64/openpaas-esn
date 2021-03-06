'use strict';

angular.module('linagora.esn.login.oauth')

  .run(function(dynamicDirectiveService) {
    dynamicDirectiveService.addInjection('esn-login-oauth', new dynamicDirectiveService.DynamicDirective(function() {
      return true;
    }, 'login-oauth-facebook-button'));
  })

  .directive('loginOauthFacebookButton', function() {
    return {
      restrict: 'E',
      templateUrl: '/login-oauth/views/buttons/facebook.html'
    };
  });
