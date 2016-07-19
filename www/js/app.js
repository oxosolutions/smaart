// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','LocalStorageModule','angular-cache'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: 'No Internet Connection',
          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
        })
        .then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('config', {
      text_login: 'Login Now',
      text_activation :'Activate Application',
      text_dashboard : 'Dashboard',
      text_startSuray : 'Start Survey',
      text_surveyList : 'Survey List',
      text_logout : 'Logout',
      text_survey : 'Survey',
      text_userLogin : 'User Login',
      text_next : 'Next',
      text_stop: 'Stop',
      text_prev: 'Prev',
      text_stop_survey_title: 'Stop Survey',
      text_stop_survey_template: 'Are you sure you want to stop that survey?',
      text_survey_yes: 'Yes',
      text_survey_no: 'No',
      text_activate_success: 'Activate Successfully!',
      text_fill_error: 'Please fill all fields',
      text_wrong_user: 'Wrong user details!',
      text_signout_success: 'Sign out successfully',
      text_select_answer: 'Please Select Answer',
      text_survel_list: 'Survey List'
    })
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
      .state('logout', {
        url: '/logout',
        controller: 'LogoutCtrl'
      })
      .state('login', {
      	cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/tab-dashboard.html',
      controller: 'HomeCtrl'
    })
    .state('survey', {
	    url: '/survey/:qid',
	    templateUrl: 'templates/tab-dash.html',
	    controller: 'SurveyCtrl'
	  })
    .state('survey-list',{
    	cache: false,
		url:'/survey',
		templateUrl: 'templates/servey-list.html',
		controller: 'ServeyListCtrl'
    })
      
  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
