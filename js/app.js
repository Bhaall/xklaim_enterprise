'use strict';

var okd = angular.module('okd', ['ngRoute', 'ngResource', 'ngAnimate', 'ngCookies', 'ngSanitize', 'ngTouch', 'ui.mask', 'xeditable', 'ngTable', 'bootstrap.tpls', 'dialogs.main', 'localytics.directives']);

okd.constant('uploadServiceUrl', 'api/index.php');

okd.run(function(startTime){
	startTime.setTime((new Date()).getTime());
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

okd.run(function(editableOptions) {
	editableOptions.theme = 'bs3';
});

okd.run(function ($rootScope, $window) {
	angular.element($window).bind('resize', function () {
		$rootScope.$emit('resizeMsg');
	});
});

okd.run(function($rootScope, $location, $anchorScroll, $routeParams, $timeout) {
	$rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		$location.hash($routeParams.scrollTo);
		$timeout(function(){
			$anchorScroll();
		},300); 
	});
});

okd.config(function($provide, MILLIS_IN_SECONDS ){
	$provide.value("startTime", new Date());	
});

okd.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
}]);

okd.value('uiMaskConfig', {
	'maskDefinitions': {
		'9': /\d/,
		'A': /[a-zA-Z]/,
		'*': /[a-zA-Z0-9]/
	}
});

okd.constant("MILLIS_IN_SECONDS", 1000);

okd.constant('googleChartApiConfig', {
	version: '1',
	optionalSettings: {
		packages: ['corechart']
	}
});

okd.constant('toasterConfig', {
	'tap-to-dismiss': true,
	'newest-on-top': true,
	'time-out': 5000,
	'icon-classes': {
		error: 'toast-error',
		info: 'toast-info',
		success: 'toast-success',
		warning: 'toast-warning'
	},
	'icon-class': 'toast-info',
	'position-class': 'toast-bottom-full-width',
	'title-class': 'toast-title',
	'message-class': 'toast-message'
});



okd.config(function ($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);//.hashPrefix('!');
	
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



okd.run(['$templateCache',function($templateCache){
	$templateCache.put('/dialogs/invite.html','<form class="form-horizontal" role="form" name="inviteMemberForm" id="inviteMemberForm" novalidate><div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true" tabindex="6"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-user"></i> Invite a new team member</h4></div><div class="modal-body"><div class="form-group"><label class="col-xs-2 control-label" for="name" ng-class="{error: inviteMemberForm.name.$invalid && inviteMemberForm.name.$dirty}">Name</label><div class="col-xs-9"><div class="input-group"><span class="input-group-addon"><i class="fa fa-user"></i></span><input tabindex="1" type="text" name="name" id="name" placeholder="First and Last Name" class="form-control" ng-model="invitation.name" required focus-me /></div><div class="error" ng-show="inviteMemberForm.name.$dirty && inviteMemberForm.name.$invalid"><small class="error" ng-show="inviteMemberForm.name.$error.required">Name is required.</small></div></div></div><div class="form-group"><label class="col-xs-2 control-label" for="email" ng-class="{error: inviteMemberForm.email.$invalid && inviteMemberForm.email.$dirty}">Email</label><div class="col-xs-9"><div class="input-group"><span class="input-group-addon"><i class="fa fa-envelope"></i></span><input tabindex="2" type="email" name="email" id="email" placeholder="Email Address" class="form-control" required ng-pattern="/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/" ng-model="invitation.email" auto-fillable-field  /></div><div class="error" ng-show="inviteMemberForm.email.$dirty && inviteMemberForm.email.$invalid"><small class="error" ng-show="inviteMemberForm.email.$error.required">Email is required.</small></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()" tabindex="4">Cancel</button><button type="submit" class="btn turquoise" ng-click="submitInvite()" ng-disabled="inviteMemberForm.$invalid" tabindex="3"><i class="fa fa-envelope"></i> Send Invitation</button></div></ng-form>');
	$templateCache.put('/dialogs/edit-member.html','<form class="form-horizontal" role="form" name="editMemberForm" id="editMemberForm" novalidate><div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true" tabindex="5"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-pencil-square-o"></i> Edit Team Member</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-sm-12"><div class="form-group"><label class="col-xs-2 control-label" for="editName" ng-class="{error: editMemberForm.editName.$invalid && editMemberForm.editName.$dirty}">Name</label><div class="col-xs-9"><div class="input-group"><span class="input-group-addon"><i class="fa fa-user"></i></span><input tabindex="1" type="text" name="editName" id="editName" placeholder="First and Last Name" class="form-control" ng-model="data.val.name" required focus-me /></div><div class="error" ng-show="editMemberForm.editName.$dirty && editMemberForm.editName.$invalid"><small class="error" ng-show="editMemberForm.editName.$error.required">Name is required.</small></div></div></div><div class="form-group"><label class="col-xs-2 control-label" for="editEmail" ng-class="{error: editMemberForm.editEmail.$invalid && editMemberForm.editEmail.$dirty}">Email</label><div class="col-xs-9"><div class="input-group"><span class="input-group-addon"><i class="fa fa-envelope"></i></span><input tabindex="2" type="email" name="editEmail" id="editEmail" placeholder="Email Address" class="form-control" ng-model="data.val.email" required ng-pattern="/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/" /></div><div class="error" ng-show="editMemberForm.editEmail.$dirty && editMemberForm.editEmail.$invalid"><small class="error" ng-show="editMemberForm.editEmail.$error.required">Email address is required.</small></div></div></div></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()" tabindex="4">Cancel</button><button tabindex="3" type="submit" class="btn turquoise" ng-click="editMember(data)" ng-disabled="editMemberForm.$invalid"><i class="fa fa-floppy-o"></i> Save and update</button></div></form>');
	$templateCache.put('/dialogs/location-set-map.html','<div class="modal-header" ng-init="initialize()"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-map-marker"></i> Locations for {{data.val.location_bundle_name || data.val.title}}</h3></div><div class="modal-body"><div id="map"></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Close</button></div>');
	$templateCache.put('/dialogs/delete-payment-method.html','<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-check"></i> Please Confirm</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-sm-12"><p>Please confirm the payment method to delete:<br /><br /><strong>{{data.val.payment_method_name}}</strong>&nbsp;&nbsp;({{data.val.type}} {{data.val.card_number || data.val.account_number}})</p></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Cancel</button><button type="submit" class="btn turquoise" ng-click="deletePaymentMethod(data.payment_id)" focus-me>Delete</button></div>');
	$templateCache.put('/dialogs/add-payment-method.html','<form class="form-horizontal" id="addPaymentMethod" name="addPaymentMethod" ng-submit="submit()" role="form" novalidate><div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-credit-card"></i> Add a Payment Method</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-sm-12"><div class="form-group"><label class="col-sm-4 control-label" for="payment_method_name">Name in Xklaim</label><div class="col-sm-6"><div class="input full-width"><input type="text" name="payment_method_name" id="payment_method_name" placeholder="For display in Xklaim" class="form-control" required ng-model="method.payment_method_name" focus-me /></div><div class="error" ng-show="addPaymentMethod.payment_method_name.$dirty && addPaymentMethod.payment_method_name.$invalid"><small class="error" ng-show="addPaymentMethod.payment_method_name.$error.required">Name of account is required.</small></div></div></div><div class="form-group"><label for="paymentType" class="col-sm-4 control-label">Payment type</label><div class="col-sm-6"><select data-style="white" bs-select title="Select a payment type" class="form-control" name="paymentType" id="paymentType" ng-model="data.val.payment_type_name" ng-options="paymentType.payment_type_name for paymentType in data.val" ng-change="paymentTypePartial()" required></select><div class="error" ng-show="addPaymentMethod.paymentType.$dirty && addPaymentMethod.paymentType.$invalid"><small class="error" ng-show="addPaymentMethod.paymentType.$error.required">Payment type is required.</small></div></div></div><div ng-include="paymentTypePartialPath" class="reveal-animation"></div></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Cancel</button><button type="submit" class="btn turquoise" ng-disabled="addPaymentMethod.$invalid"><i class="fa fa-floppy-o"></i> Save</button></div></form>');
	$templateCache.put('/dialogs/view-payment-method.html','<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-credit-card"></i>&nbsp;{{data.val.payment_method_name}}</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-sm-12"><dl class="dl-horizontal"><dt>Name:</dt><dd>{{data.val.payment_method_name}}</dd><dt>Type:</dt><dd>{{data.val.type}}</dd><dt ng-hide="data.val.paypal">{{data.val.card_number && "Card Number ends in:" || "Routing Number:"}}</dt><dd ng-hide="data.val.paypal">{{data.val.card_number || data.val.routing_number}}</dd><dt ng-hide="data.val.paypal">{{data.val.account_number && "Account Number:" || "Expiration date:"}}</dt><dd ng-hide="data.val.paypal">{{data.val.account_number || data.val.expiry_display}}</dd><dt ng-hide="data.val.paypal">Balance:</dt><dd ng-hide="data.val.paypal">{{data.val.balance | currency}}</dd><dt ng-hide="data.val.paypal">First Name on Account:</dt><dd ng-hide="data.val.paypal">{{data.val.first_name | uppercase}}</dd><dt ng-hide="data.val.paypal">Last Name on Account:</dt><dd ng-hide="data.val.paypal">{{data.val.last_name | uppercase}}</dd><dt ng-hide="data.val.paypal">Billing address:</dt><dd ng-hide="data.val.paypal">{{data.val.address}},<br /> {{data.val.city}}, {{data.val.state}} {{data.val.zip_code}}</dd></dl></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Close</button></div>');
	$templateCache.put('/dialogs/add-balance.html','<form class="form-horizontal" id="addBalanceForm" name="addBalanceForm" ng-submit="submit()" role="form" novalidate ng-init="max = 50"><div class="modal-content"><div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-adjust"></i> Add balance: {{data.val.account_name}}</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-sm-12"><div class="form-group"><label for="paymentMethod" ng-class="{error:addBalanceForm.paymentMethod.$invalid && addBalanceForm.submitted}" class="col-sm-4 control-label">Payment method</label><div class="col-sm-6"><div class="input full-width"><select class="form-control" name="paymentMethodAdd" id="paymentMethodAdd" ng-model="data.val.paymentMethod" data-style="white" bs-select title="Select a payment method" ng-options="method.payment_id as method.payment_method_name for method in data.val.methods" required focus-me tabindex="1"></select><div class="error" ng-show="addBalanceForm.paymentMethod.$invalid && addBalanceForm.submitted"><small class="error" ng-show="addBalanceForm.submitted && addBalanceForm.paymentMethod.$error.required">Payment method is required.</small></div></div></div></div><div class="form-group"><label ng-class="{error: addBalanceForm.balance.$invalid && addBalanceForm.submitted}" class="col-sm-4 control-label" for="payment_method_name">Amount</label><div class="col-sm-6"><div class="input-group"><span class="input-group-addon"><i class="fa fa-usd"></i></span><input type="text" placeholder="Amount" class="form-control" id="balance" name="balance" ng-model="balance" money min="1" ng-max="10000" required tabindex="2" /></div><div class="error" ng-show="addBalanceForm.balance.$dirty && addBalanceForm.balance.$invalid"><small class="error" ng-show="addBalanceForm.balance.$invalid">Amount cannot be larger than $10,000.</small></div></div></div></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()" tabindex="4">Cancel</button><button type="submit" class="btn turquoise" ng-disabled="addBalanceForm.$invalid" tabindex="3">Submit</button></div></div></form>');
	$templateCache.put('/dialogs/return-balance.html','<form id="returnBalanceForm" name="returnBalanceForm" ng-submit="submit()" role="form" novalidate><div class="modal-content"><div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-adjust"></i> Return balance: {{data.val.account_name}}</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-sm-12"><div class="form-group clearfix"><span class="title">Available balance:</span> <span>{{data.val.balance | currency}}</span></div><checkbox-group min-required="1"><div class="form-group clearfix" ng-repeat="method in data.val.methods"><label for="{{method.payment_id}}" class="col-sm-5 control-label">{{method.payment_method_name}}</label><div class="col-sm-7"><div class="checkbox"><label for="{{method.payment_id}}"><input type="checkbox" name="selectedMethods[]" value="{{method.payment_id}}" ng-checked="selection.indexOf(method.payment_id) > -1" ng-click="toggleSelection(method.payment_id)" ng-model="selectedMethods" id="{{method.payment_id}}" ng-disabled="method.balance==0" /> {{method.balance | currency}}</label></div></div></div></checkbox-group></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Cancel</button><button type="submit" class="btn turquoise" data-dismiss="modal" ng-disabled="returnBalanceForm.$invalid">Submit</button></div></div></form>');
	$templateCache.put('/dialogs/upload-csv.html','<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-upload"></i> Upload locations</h3></div><div class="modal-body"><p>Select a CSV file containing the addresses and optional merchant IDs for geocoding the cards. The CSV needs to contain the following columns:</p><table class="table"><thead><tr><th>busname</th><th>street</th><th>city</th><th>state</th><th>zip</th><th>merchid</th></tr></thead><tbody><tr><td>Business Name,</td><td>3119 Stanley Blvd,</td><td>Lafayette,</td><td>CA,</td><td>94549,</td><td>01234567890</td></tr></tbody></table></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Cancel</button><span class="btn btn-file turquoise"><span class="">Upload CSV file</span><input type="file" id="csvFileInput" onchange="angular.element(this).scope().handleFiles(this.files)" accept=".csv" /></span></div>');
	$templateCache.put('/dialogs/preview-offer-image.html','<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-picture-o"></i> Offer Image</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-lg-12"><div class="preview"><img data-ng-src="{{data.val}}" alt="" /></div></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Close</button></div>');
	$templateCache.put('/dialogs/confirm-channel.html','<form class="form-horizontal" name="confirmChannelForm" id="confirmChannelForm" novalidate ng-submit="submitConfirm()"><div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title">Confirm Channel</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-lg-12"><div class="form-group"><table class="table table-striped"><thead><tr><th>Select</th><th>Name</th></tr></thead><tbody><tr data-ng-repeat="fbpage in data.val"><td><input type="radio" ng-model="fbdata.select" value="{{$index + 1}}" required></td><td style="width: 80%"><div ng-model="fbdata.network_name">{{fbpage.name}}</div></td><td ng-hide="true"><input type="text" name="id" id="id" class="form-control" ng-model="fbdata.network_id" />{{fbpage.id}}</td><td ng-hide="true"><input type="text" name="token" id="token" class="form-control" ng-model="fbdata.network_access_token" />{{fbpage.access_token}}</td></tr></tbody></table></div></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Cancel</button><button type="submit" class="btn turquoise" ng-disabled="confirmChannelForm.$invalid"><i class="fa fa-floppy-o"></i> Confirm</button></div></form>');
	$templateCache.put('/dialogs/claims-spend-report.html','<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><span class="claims badge">&nbsp;</span> Offers Claimed Report</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-lg-12"><div>Start date: {{data.usage_start | date:\'short\'}}</div><div>End Date: {{data.usage_end | date:\'short\'}}</div><table class="table table-striped" role="grid" ng-table="spendTableParams" template-pagination="custom/pager"><tbody><tr ng-repeat="list in $data"><td data-title="\'Offer Name\'">{{data.title}}</td><td class="right" data-title="\'Offer Value\'">{{data.value | currency}}</td><td data-title="\'Customer\'">{{list.name}}</td><td data-title="\'Phone\'">{{list.telephone | tel}}</td><td data-title="\'Email\'">{{list.email}}</td><td data-title="\'Time of Claim\'" sortable="\'claim_time\'">{{list.claim_time | date:\'short\'}}</td><td data-title="\'Time of Activation\'" sortable="\'activation_time\'">{{list.activation_time | date:\'short\'}}</td><td data-title="\'Time of Use\'" sortable="\'use_time\'">{{list.use_time | date:\'short\'}}</td><td data-title="\'Revenue location\'" sortable="\'location\'">{{list.location}}</td><td class="right" data-title="\'Revenue\'" sortable="\'revenue\'">{{list.revenue | currency}}</td></tr><tr data-ng-show="$data.length==0"><td colspan=10><div>No usage data available.</div></td></tr></tbody></table></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Close</button><a class="btn turquoise" ng-click="downloadReport()" data-ng-hide="data.data_list.length==0"><i class="fa fa-download"></i> Download Report</a></div><script type="text/ng-template" id="custom/pager"><ul class="pagination ng-table-pagination pull-right ng-cloak"><li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo; Prev</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">Next &raquo;</a></li></ul></script>');
	$templateCache.put('/dialogs/activation-spend-report.html','<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><span class="activates badge">&nbsp;</span> Offers Activated Report</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-lg-12"><div>Start date: {{data.usage_start | date:\'short\'}}</div><div>End Date: {{data.usage_end | date:\'short\'}}</div><table class="table table-striped" role="grid" ng-table="spendTableParams" template-pagination="custom/pager"><tbody><tr ng-repeat="list in $data"><td data-title="\'Offer Name\'">{{data.title}}</td><td class="right" data-title="\'Offer Value\'">{{data.value | currency}}</td><td data-title="\'Customer\'">{{list.name}}</td><td data-title="\'Phone\'">{{list.telephone | tel}}</td><td data-title="\'Email\'">{{list.email}}</td><td data-title="\'Time of Claim\'" sortable="\'claim_time\'">{{list.claim_time | date:\'short\'}}</td><td data-title="\'Time of Activation\'" sortable="\'activation_time\'">{{list.activation_time | date:\'short\'}}</td><td data-title="\'Time of Use\'" sortable="\'use_time\'">{{list.use_time | date:\'short\'}}</td><td data-title="\'Revenue location\'" sortable="\'location\'">{{list.location}}</td><td class="right" data-title="\'Revenue\'" sortable="\'revenue\'">{{list.revenue | currency}}</td></tr><tr data-ng-show="$data.length==0"><td colspan=10><div>No usage data available.</div></td></tr></tbody></table></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Close</button><a class="btn turquoise" ng-click="downloadReport()" data-ng-hide="data.data_list.length==0"><i class="fa fa-download"></i> Download Report</a></div><script type="text/ng-template" id="custom/pager"><ul class="pagination ng-table-pagination pull-right ng-cloak"><li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo; Prev</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">Next &raquo;</a></li></ul></script>');
	$templateCache.put('/dialogs/used-spend-report.html','<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><span class="uses badge">&nbsp;</span> Offers Used Report</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-lg-12"><div>Start date: {{data.usage_start | date:\'short\'}}</div><div>End Date: {{data.usage_end | date:\'short\'}}</div><table class="table table-striped" role="grid" ng-table="spendTableParams" template-pagination="custom/pager"><tbody><tr ng-repeat="list in $data"><td data-title="\'Offer Name\'">{{data.title}}</td><td class="right" data-title="\'Offer Value\'">{{data.value | currency}}</td><td data-title="\'Customer\'">{{list.name}}</td><td data-title="\'Phone\'">{{list.telephone | tel}}</td><td data-title="\'Email\'">{{list.email}}</td><td data-title="\'Time of Claim\'" sortable="\'claim_time\'">{{list.claim_time | date:\'short\'}}</td><td data-title="\'Time of Activation\'" sortable="\'activation_time\'">{{list.activation_time | date:\'short\'}}</td><td data-title="\'Time of Use\'" sortable="\'use_time\'">{{list.use_time | date:\'short\'}}</td><td data-title="\'Revenue location\'" sortable="\'location\'">{{list.location}}</td><td class="right" data-title="\'Revenue\'" sortable="\'revenue\'">{{list.revenue | currency}}</td></tr><tr data-ng-show="$data.length==0"><td colspan=10><div>No usage data available.</div></td></tr></tbody></table></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Close</button><a class="btn turquoise" ng-click="downloadReport()" data-ng-hide="data.data_list.length==0"><i class="fa fa-download"></i> Download Report</a></div><script type="text/ng-template" id="custom/pager"><ul class="pagination ng-table-pagination pull-right ng-cloak"><li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo; Prev</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">Next &raquo;</a></li></ul></script>');
	$templateCache.put('/dialogs/open-preview.html','<div class="modal-header"><button type="button" class="close" ng-click="cancel()" aria-hidden="true"><i class="fa fa-times"></i></button><h3 class="modal-title"><i class="fa fa-search"></i> Preview Offer</h3></div><div class="modal-body"><div class="container"><div class="row"><div class="col-sm-12"><p>Click the link below to view the preview:<br /><br /><a ng-href={{data.val}} target=\'_blank\' ng-click="cancel()">Click to preview offer</a></p></div></div></div></div><div class="modal-footer"><button type="button" class="btn white" ng-click="cancel()">Close</button></div>');
}]);