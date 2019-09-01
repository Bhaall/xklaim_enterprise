'use strict';
/* Services */
okd.factory('okdService',function($http, $q){
	return {
		//test
		sendMessage: function(msg) {    
			return $http.get('something.json?msg=' + msg).then(function(result) {
				return result.data;
			});
		},
		exciteText: function(msg) {
			return msg + '!!!'
		},
		// account services
		getAllAccounts: function(){
			var deferred = $q.defer();
			$http.get('data/new/accounts.js').success(function(data){
			//$http.get('/enterprise/api/v1/accounts/').success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		getAccountByID: function(accountId){
			var deferred = $q.defer();
			$http.get('data/new/' + accountId + '/account.js').success(function(data){
			//$http.get('/enterprise/api/v1/accounts/' + account_id).success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		createAccount: function(loginInfo){
			var deferred = $q.defer();
			$http({
				method : 'POST',
				//url:'/enterprise/api/v1/user/create/',
				url : 'data/new/accounts.js',
				data : loginInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		updateAccount: function(accountId, accountInfo){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/edit/',
				data : accountInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		removeAccount: function(accountId){
			var deferred = $q.defer();
			$http({		
				method : 'DELETE',
				url : '/enterprise/api/v1/accounts/' + accountId + '/edit/',
				data : accountId
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;      	
		},
		// profile
		updateProfile: function(profile){
			var deferred = $q.defer();
			$http({
				method : 'POST',
				url : '/enterprise/api/v1/user/basic_info/',
				data : profile
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;		
		},
		updatePassword: function(profile){
			var deferred = $q.defer();
			$http({
				method : 'POST',
				url : '/enterprise/api/v1/user/basic_info/',
				data : profile
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;		
		},
		removeProfile: function(profileId){
			var deferred = $q.defer();
			$http({		
				method : 'DELETE',
				url : '/enterprise/api/v1/user/basic_info/' + profileId,
				data : profileId
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		// logout service
		logout: function(){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				//url : '/enterprise/api/v1/user/logout/'
				url : 'data/new/accounts.js'
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		// reset password
		resetPassword: function(userInfo){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/user/forgot_password/',
				data : userInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		// login service with token
		tokenLogin: function(token){
			var deferred = $q.defer();
			$http({		
				method : 'GET',
				//url : '/enterprise/api/v1/token/' + token,
				url : 'data/new/token/' + token + '.js',
				data : token
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		// login service from home page
		homeLogin: function(loginInfo){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				//url : '/enterprise/api/v1/user/login/',
				url : 'data/new/accounts.js',
				data : loginInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		// offer service
		createOfferOrg: function(offer){
			var deferred = $q.defer();
			$http({
				method : 'POST',
				url : '/enterprise/api/v1/offers/', 
				headers: { 'Content-Type': false },
				transformRequest: function (data) {
					var formData = new FormData();
					formData.append("model", angular.toJson(data.model));
					return formData;
				},
				data : {model: offer}
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		createOffer: function(offer){
			var deferred = $q.defer();
			if(offer.action_type) {
				var thisURL = 'data/new/new_offer_response.js';
			}
			else {
				var thisURL = 'data/new/' + offer.account_id + '/' + 'preview.js';
			}
			$http({
				method : 'GET',
				//url : 'data/new/' + offer.account_id + '/' + 'preview.js'
				url: thisURL
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		getOffer: function(account_id, offer_id){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/new/' + account_id + '/' + offer_id + '.js'
				// url : '/enterprise/api/v1/accounts/' + account_id + '/offers/' + offer_id
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		getAllOffers: function(){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/new/all-offers.js'
				//url : '/enterprise/api/v1/accounts/offers/'
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		getOffersByFilter: function(account_id, offerfilter){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/new/' + account_id + '/' + offerfilter + '.js'
				// url : '/enterprise/api/v1/accounts/' + account_id + '/offers/' + offerfilter
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		createPreview: function(offer){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/consumer/v1/offers/preview/' + offer.account_id,
				headers: { 'Content-Type': false },
				transformRequest: function (data) {
					var formData = new FormData();
					formData.append("model", angular.toJson(data.model));
					return formData;
				},
				data : {model: offer}
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		createPreview2: function(offer){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/new/' + offer.account_id + '/' + 'preview2.js'
				// url : '/enterprise/api/v1/accounts/' + account_id + '/offers/' + offerfilter
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		// location service
		getLocations: function(accountId){
			var deferred = $q.defer();
			$http.get('data/new/' + accountId + '/locations.js').success(function(data){
			//$http.get('/enterprise/api/v1/accounts/' + accountId + '/location_info/').success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		createLocations: function(accountId, locationInfo){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/location_info/' ,
				data : locationInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		updateLocations: function(accountId, locationInfo){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/location_info/' ,
				data : locationInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		removeLocations: function(accountId, locationInfo){
			var deferred = $q.defer();
			$http({		
				method : 'DELETE',
				url : '/enterprise/api/v1/accounts/' + accountId + '/location_info/' ,
				data : locationInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		getLocationsByOffer: function(account_id, offer_id){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/new/' + account_id + '/' + 'locations-for-offer.js'
				//url : '/enterprise/api/v1/accounts/' + account_id + '/offers/' + offer_id + '/getlocations/'
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		// payment services
		getPaymentTypes: function(){	
			var deferred = $q.defer();
			$http.get('data/payment-types.js').success(function(data){
			// '/enterprise/api/v1/accounts/payment_type/'
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		getPaymentMethods: function(accountId){
			var deferred = $q.defer();
			$http.get('data/new/' + accountId + '/methods.js').success(function(data){
			//$http.get('/enterprise/api/v1/accounts/'+ accountId + '/payment_info/').success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		createPaymentMethod: function(accountId, paymentInfo){
			console.log(accountId);
			console.log(paymentInfo);
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/payment_info/',
				data : paymentInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		updatePaymentMethod: function(accountId, paymentInfo){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/payment_info/',
				data : paymentInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		removePaymentMethod: function(accountId, paymentInfo){
			var deferred = $q.defer();
			$http({		
				method : 'DELETE',
				url : '/enterprise/api/v1/accounts/' + accountId + '/payment_info/',
				data : paymentInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		addBalance: function(paymentInfo){
			var deferred = $q.defer();
			$http({		
				method : 'GET',
				url : 'data/add-balance-response.js',
				data : paymentInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		returnBalance: function(paymentInfo){
			console.log(paymentInfo);
			var deferred = $q.defer();
			$http({		
				method : 'GET',
				url : 'data/return-balance-response.js',
				data : paymentInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		// channelService
		getChannels: function(accountId){
			var deferred = $q.defer();
			$http.get('data/new/' + accountId + '/channels.js').success(function(data){
			//$http.get('/enterprise/api/v1/accounts/' + accountId + '/channel_info/').success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		updateChannel: function(accountId, channelInfo){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/channel_info/',
				data : channelInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		removeChannel: function(accountId, channelInfo){
			var deferred = $q.defer();
			$http({		
				method : 'DELETE',
				url : '/enterprise/api/v1/accounts/' + accountId + '/channel_info/',
				data : channelInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		createChannelInfo: function(accountId, channelInfo){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/channel_info/',
				data : channelInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		//members
		getMembers: function(accountId){
			var deferred = $q.defer();
			$http.get('data/new/' + accountId + '/members.js').success(function(data){
			//$http.get('/enterprise/api/v1/accounts/' + accountId + '/members/').success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},
		createMembers: function(accountId, memberInfo){
			console.log(memberInfo);
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/members/',
				data : memberInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		updateMembers: function(accountId, memberInfo){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/mem-response.js'
			}).
			//$http({		
				//method : 'POST',
				//url : '/enterprise/api/v1/accounts/' + accountId + '/members/',
				//data : memberInfo
			//}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		removeMembers: function(accountId, memberInfo){
			var deferred = $q.defer();
			$http({		
				method : 'DELETE',
				url : '/enterprise/api/v1/accounts/' + accountId + '/members/',
				data : memberInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		resendInvite: function(accountId, memberInfo){
			var deferred = $q.defer();
			console.log(memberInfo);
			$http({		
				method : 'POST',
				url : '/enterprise/api/v1/accounts/' + accountId + '/members/',
				data : memberInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		//chat
		chat: function(){
			var deferred = $q.defer();
			$http.get('/enterprise/api/v1/offers/').success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		},		
		updateChat: function(offerId, message){
			var deferred = $q.defer();
			$http({
				method : 'POST',
				url : 'data/new/msg-response.js',
				//url : '/enterprise/api/v1/offers/' + offerId + '/activity/',
				data : message
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		refreshChart: function(account_id, offer_id, startDate, endDate){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/new/' + account_id + '/' + offer_id + '/' + startDate + '/' + endDate + '.js'
				// url : '/enterprise/api/v1/accounts/' + account_id + '/offers/' + offer_id + '/' + startDate + '/' + endDate
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		getRevenueData: function(account_id, offer_id, status_type){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/new/' + account_id + '/' + offer_id + '/' + status_type + '.js'
				// url : '/enterprise/api/v1/accounts/' + account_id + '/offers/' + offer_id + '/revenue_data/' + status_type + '/'
				// url : '/enterprise/api/v1/accounts/' + account_id + '/offers/' + offer_id + '/download_revenue_data/' + status_type + '/'
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		},
		downloadRevenueData: function(account_id, offer_id, status_type){
			var deferred = $q.defer();
			$http({
				method : 'GET',
				url : 'data/report-success.js'
				//url : '/enterprise/api/v1/accounts/' + account_id + '/offers/' + offer_id + '/download_revenue_data/' + status_type + '/?state=pre'
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		}
	}
});

// service to fetch the redirect url for redirecting user to the approval page
okd.factory('createApprovalURLService',function($http, $q){
	return{
		apiPath:'/enterprise/api/v1/accounts/paypal_init/',	
		create: function( paymentObj ){
			var deferred = $q.defer();
			$http.post('/enterprise/api/v1/accounts/paypal_init/' , paymentObj).success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		}
	}
});

//service to activate a paypal payment method
okd.factory('updatePaypalAccountStatusService',function($http, $q){
	return{
		apiPath:'/enterprise/api/v1/accounts/paypal_sync/',	
		update: function( paymentObj ){
			var deferred = $q.defer();
			$http.post('/enterprise/api/v1/accounts/paypal_sync/' , paymentObj).success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject("An error occured while fetching items");
			});
			return deferred.promise;
		}
	}
});

okd.service('uploadService', function(uploadServiceUrl, toaster, $rootScope) {
	var initializeFn, processFn;	
	initializeFn = function(e, data, process) {
		var upload;
		return upload = {
			message: '',
			uploadurl: uploadServiceUrl,
			status: false
		};
	};
	processFn = function(e, data, process) {
		var file, upload;
		upload = {};
		upload.successData = [];
		upload.status = true;
		upload.error = false;
		if (process === 'done') {
			upload.message = 'Upload Successful.';
			file = data.result.files[0];
			$rootScope.$broadcast('loadingFalse');
			upload.successData = {
				name: file.name,
				fullUrl: file.url,
				thumbUrl: file.thumbnail_url
			};
		} else if (process === 'progress') {
			upload.message = 'Uploading...';
			$rootScope.$broadcast('loadingTrue');
			upload.progress = data.progress();
		} else if (process === 'cancel') {
			upload.message = 'Image removed.';
			$rootScope.$broadcast('loadingFalse');
			upload.status = false;
			upload.error = false;
		} else {
			upload.error = true;
			upload.message = 'Upload Failed.';
			$rootScope.$broadcast('loadingFalse');
			toaster.pop('error', upload.message, data._response.errorThrown);
		}
		return upload;
	};	
	return {
		process: processFn,
		initialize: initializeFn
	};
});

// step #1 to associate a twitter service with the system
// because twitter has a very different oauth flow than that of facebook

okd.factory('twitterAddService',function($http, $q){
	return{
		create: function( accountId , twitterInfo ){
			var deferred = $q.defer();
			$http({		
				method : 'POST',
				url :    '/enterprise/api/v1/accounts/twitter_verify/' + accountId + '/' ,
				data :   twitterInfo
			}).
			success(function(data, status, headers, config){
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config){
				deferred.reject(status);
			});
			return deferred.promise;
		}	
	}
});

// elapsed time
okd.service("elapsedEstimator", ElapsedEstimator );

function ElapsedEstimator(startTime, MILLIS_IN_SECONDS ){
	this.elapsed = function(){
		var elapsedMilliSeconds = (new Date().getTime() - startTime.getTime());
		var elapsed = Math.round(elapsedMilliSeconds / MILLIS_IN_SECONDS);
		return elapsed;
	}
}

okd.service('sharedProperties', function() {
    var stringValue = '0';
    var objectValue = {
        data: 'test object value'
    };
    
    return {
        getString: function() {
            return stringValue;
        },
        setString: function(value) {
            stringValue = value;
        },
        getObject: function() {
            return objectValue;
        }
    }
});

// popover positioning
okd.factory('$position', ['$document', '$window', function ($document, $window) {

	function getStyle(el, cssprop) {
		if (el.currentStyle) {
			return el.currentStyle[cssprop];
		} else if ($window.getComputedStyle) {
			return $window.getComputedStyle(el)[cssprop];
		}
		return el.style[cssprop];
	}

	function isStaticPositioned(element) {
		return (getStyle(element, "position") || 'static' ) === 'static';
	}

	var parentOffsetEl = function (element) {
		var docDomEl = $document[0];
		var offsetParent = element.offsetParent || docDomEl;
		while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
			offsetParent = offsetParent.offsetParent;
		}
		return offsetParent || docDomEl;
	};

	return {

		position: function (element) {
			var elBCR = this.offset(element);
			var offsetParentBCR = { top: 0, left: 0 };
			var offsetParentEl = parentOffsetEl(element[0]);
			if (offsetParentEl != $document[0]) {
				offsetParentBCR = this.offset(angular.element(offsetParentEl));
				offsetParentBCR.top += offsetParentEl.clientTop;
				offsetParentBCR.left += offsetParentEl.clientLeft;
			}

		return {
			width: element.prop('offsetWidth'),
			height: element.prop('offsetHeight'),
			top: elBCR.top - offsetParentBCR.top,
			left: elBCR.left - offsetParentBCR.left
		};
	},

	offset: function (element) {
		var boundingClientRect = element[0].getBoundingClientRect();
			return {
				width: element.prop('offsetWidth'),
				height: element.prop('offsetHeight'),
				top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop),
				left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft)
			};
		}
	};
}]);

okd.service('filteredListService', function () {
	this.searched = function (valLists,toSearch) {
		return _.filter(valLists,
		function (i) {
			return searchUtil(i, toSearch);
		});
	};

	this.paged = function (valLists,pageSize) {
		console.log(valLists);
		var retVal = [];
		for (var i = 0; i < valLists.length; i++) {
			if (i % pageSize === 0) {
				retVal[Math.floor(i / pageSize)] = [valLists[i]];
			} else {
				retVal[Math.floor(i / pageSize)].push(valLists[i]);
			}
		}
		return retVal;
	};
});

okd.service('toaster', function ($rootScope) {
	this.pop = function (type, title, body) {
		this.toast = {
			type: type,
			title: title,
			body: body
		};
		$rootScope.$broadcast('toaster-newToast');
	};
});

okd.factory('googleChartApiProxy', ['$rootScope', '$q', 'googleChartApiConfig', function ($rootScope, $q, apiConfig) {
	var apiReady = $q.defer(),
	onLoad = function () {
		var settings = {
			callback: function () {
				var oldCb = apiConfig.optionalSettings.callback;
				$rootScope.$apply(function () {
					apiReady.resolve();
				});

				if (angular.isFunction(oldCb)) {
					oldCb.call(this);
				}
			}
		};
		settings = angular.extend({}, apiConfig.optionalSettings, settings);
		window.google.load('visualization', apiConfig.version, settings);
	};
            
	loadScript('http://www.google.com/jsapi', onLoad);

	return function (fn, context) {
		var args = Array.prototype.slice.call(arguments, 2);
		return function () {
			apiReady.promise.then(function () {
				fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
			});
		};
	};
}]);

function loadScript(url, callback) {
	var script = document.createElement('script');
	script.src = url;
	script.onload = callback;
	script.onerror = function () {
		throw Error('Error loading "' + url + '"');
	};

	document.getElementsByTagName('head')[0].appendChild(script);
}

okd.factory('UAService', function() {
    return {
        isChrome: /chrome/i.test(navigator.userAgent),
        isiOS: /(iPad|iPhone|iPod)/i.test(navigator.userAgent),
        isiPad: /(iPad)/i.test(navigator.userAgent),
        isiPhone: /(iPhone)/i.test(navigator.userAgent),
        isAndroid: /(Android)/i.test(navigator.userAgent),
        isFirefox: /(Firefox)/i.test(navigator.userAgent),
        isSilk: /(Silk)/i.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)
    };
});