'use strict';

var okd = angular.module('okd', ['ngRoute', 'ngCookies', 'xeditable']);

okd.constant('uploadServiceUrl', 'api/index.php5');

okd.run(function(startTime){
	startTime.setTime((new Date()).getTime());
});

okd.run(function($rootScope, $location, $anchorScroll, $routeParams, $timeout) {
	$rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		$location.hash($routeParams.scrollTo);
		$timeout(function(){
			$anchorScroll();
		},1500);
	});
});

okd.run(function(editableOptions) {
	editableOptions.theme = 'bs3';
});

okd.config(function($provide, MILLIS_IN_SECONDS ){
	$provide.value("startTime", new Date());	
});

okd.value('uiMaskConfig', {
	'maskDefinitions': {
		'9': /\d/,
		'A': /[a-zA-Z]/,
		'*': /[a-zA-Z0-9]/
	}
});

okd.constant("MILLIS_IN_SECONDS", 1000);

okd.config(function ($routeProvider, $locationProvider) {
	$routeProvider
        	.when('/home',
            	{
                		controller: 'homeCtrl',
                		templateUrl: 'partials/home.html',
                		title: 'Home'
            	})
        	.when('/logout',
            	{
                		controller: 'homeCtrl',
                		templateUrl: 'partials/home.html',
                		title: 'Home'
            	})
        	.when('/login-email/:token',
            	{
                		controller: 'loginEmailCtrl',
                		templateUrl: 'partials/login-via-email.html',
                		title: 'Login'
            	})
        	.when('/add-payment-method/:account_id',
            	{
                		controller: 'createAccountPaymentCtrl',
                		templateUrl: 'partials/add-payment-method.html',
                		title: 'New Account | Add Payment Method'
            	})
        	.when('/channels/:account_id',
            	{
                		controller: 'createAccountChannelCtrl',
                		templateUrl: 'partials/channels.html',
                		title: 'Add Social Network'
            	})
        	.when('/password',
            	{
                		controller: 'passwordCtrl',
                		templateUrl: 'partials/edit-password.html',
                		title: 'Change Password'
            	})
        	.when('/settings',
            	{
                		controller: 'settingsCtrl',
                		templateUrl: 'partials/settings.html',
                		title: 'Settings'
            	})
        	.when('/update-account-image/:account_id',
            	{
                		controller: 'accountImageCtrl',
                		templateUrl: 'partials/update-account-image.html',
                		title: 'Update Account Image'
            	})
        	.when('/members/:account_id',
            	{
                		controller: 'membersCtrl',
                		templateUrl: 'partials/members.html',
                		title: 'Team Members'
            	})
        	.when('/all-offers',
            	{
                		controller: 'allOffersCtrl',
                		templateUrl: 'partials/all-offers.html',
                		title: 'All Offers'
            	})
        	.when('/offers-group/:account_id/:filter',
            	{
                		controller: 'offersGroupCtrl',
                		templateUrl: 'partials/group-offers.html',
                		title: 'Offers'
            	})
        	.when('/offer-details/account/:account_id/offer/:offer_id',
            	{
                		controller: 'offerDetailsCtrl',
                		templateUrl: 'partials/offer-details.html',
                		title: 'Offer Details'
            	})
        	.when('/edit-offer/:offer_id/account/:account_id',
            	{
                		controller: 'editOfferCtrl',
                		templateUrl: 'partials/edit-offer.html',
                		title: 'Edit Offer'
            	})
        	.when('/copy-offer/:offer_id/account/:account_id',
            	{
                		controller: 'copyOfferCtrl',
                		templateUrl: 'partials/copy-offer.html',
                		title: 'Copy Offer'
            	})
        	.when('/methods/:account_id',
            	{
                		controller: 'methodsCtrl',
                		templateUrl: 'partials/payment-methods.html',
                		title: 'Payment Methods',
                		reloadOnSearch: false
            	})            	
        	.when('/new-offer/:account_id',
            	{
                		controller: 'newOfferCtrl',
                		templateUrl: 'partials/new-offer.html',
                		title: 'New Offer'
            	})
        	.when('/newaccount/:userid',
            	{
                		controller: 'newAccountCtrl',
                		templateUrl: 'partials/new-account.html',
                		title: 'New Account'
            	})
        	.when('/locations/:account_id',
            	{
                		controller: 'locationsCtrl',
                		templateUrl: 'partials/locations.html',
                		title: 'Locations'
            	})
        	.when('/edit-locations/:location_bundle_id/account/:account_id',
            	{
                		controller: 'editLocationsCtrl',
                		templateUrl: 'partials/edit-locations.html',
                		title: 'Edit Locations'
            	})
        	.when('/new-locations/:account_id',
            	{
                		controller: 'newLocationsCtrl',
                		templateUrl: 'partials/new-locations.html',
                		title: 'New Location Set'
            	})
        	.otherwise({ redirectTo: '/all-offers'
        });
});

okd.run(['$location', '$rootScope', function($location, $rootScope) {
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		if (current.$$route) {
			$rootScope.title = current.$$route.title;
		}
    });
}]);

okd.run(function($rootScope) {
	$rootScope.$on('$routeChangeSuccess', function(ev,data) {
		if (data.$$route && data.$$route.controller)
		$rootScope.controller = data.$$route.controller;
	})
});