/***************************************** 
 * Declare application reference.
 *****************************************/
// Inject routing service and controller reference.
var emailApp = angular.module('emailApp', ['ngRoute', 'myControllers'])
  /****************************************** 
   * Decided to use the latest snapshot and routing broke:
   *  https://stackoverflow.com/questions/41211875/angularjs-1-6-0-latest-now-routes-not-working
   ******************************************/
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }])
  /***************************************** 
   * Define routes.
   *****************************************/  
  .config(function ($routeProvider) {

    // For the 'email' page.
    $routeProvider.when("/email", {
        templateUrl: 'views/email.html',
        controller: 'EmailCtrl'
    })
    // For the 'contact list' page.
    .when("/email/list", {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl'
    })
    // For the 'contacts' page.
    .when("/email/contacts", {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsCtrl'
    })                         
    // For the 'contact details' page.
    .when('/email/first/:firstName/last/:lastName', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl'
    })
    // For the 'about' page.
    .when('/email/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
    })                         
    // For the 'default' page.
    .otherwise({ redirectTo: '/email' });
});
