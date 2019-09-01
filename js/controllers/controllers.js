okd.controller('loginEmailCtrl', function loginEmailCtrl($scope, $rootScope, okdService, $routeParams, $location, $http, toaster) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.contentLoaded = false;
	function refresh(){
		okdService.tokenLogin($routeParams.token).then(function(data){
			if(data){
				if(data.meta.code==200){
					$scope.profile = data.response;
					$rootScope.contentLoaded = true;
					$scope.accountID = $scope.profile.account_id;	
					$scope.firsttime = $scope.profile.is_first_user;
				}
				else {
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}
	
			$scope.login = function(){
				$rootScope.setLoading(true);
				var basicInfoLoginObj = new Object();
				basicInfoLoginObj.first_name = $scope.profile.first_name;
				basicInfoLoginObj.last_name = $scope.profile.last_name;
				basicInfoLoginObj.email_id = $scope.profile.email_id;
				basicInfoLoginObj.password1 = $scope.profile.newPassword;
				basicInfoLoginObj.password2 = $scope.profile.verifyPassword;
				basicInfoLoginObj.account_id = $scope.accountID;
				var loginObj = new Object();
				loginObj.basic_info = basicInfoLoginObj
				
				okdService.createAccount(loginObj).then(function(data){
					if(data){						
						if(data.meta.code==200){
							$rootScope.setLoading(false);
							$location.path("/all-offers");
							//if($scope.profile.forgot_password == true) {
								//$location.path("/all-offers");
							//}
							//else {
								//if($scope.accountID === data.response.roles[0].account_id ) {
									//if ($scope.firsttime) {
										//$location.path("/add-payment-method/"+$scope.accountID).replace();
									//}
									//else {
										//$location.path("/all-offers");
									//}
								//} else {
									//$scope.newLoginForm.newPassword = '';
									//$scope.message = res.result;
								//}
							//}
						}
						else {
							$rootScope.setLoading(false);
							$scope.profile = data.response;
							toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);						
						}
					}
				},
				function(errorMessage){
					$scope.error=errorMessage;
					$rootScope.setLoading(false);
					toaster.pop('error', "Network failure.", "Please try again. If the problem persists, please contact our Support.");
				});
			};
		},
		function(errorMessage){
			$scope.error=errorMessage;
			$rootScope.setLoading(false);
			toaster.pop('error', "Network failure.", "Please try again. If the problem persists, please contact our Support.");
		});
	};
 
	refresh();
});

okd.controller('createAccountPaymentCtrl', function createAccountPaymentCtrl($scope, $rootScope, okdService, $routeParams, $location, toaster) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.contentLoaded = false;
	$scope.acctid = ($routeParams.account_id);
	function refresh(){
		$scope.setLoading(true);
		okdService.getAccountByID($scope.acctid).then(function(data){
			if(data){
				$rootScope.setLoading(false);				
				if(data.meta.code==200){
					$scope.profile = data.response;
					$rootScope.contentLoaded = true;
				}
				else {
					$scope.profile = data.response;
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);					
				}
			}
			
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
					$scope.account.draft = $scope.account.offer_count.draft;
					$scope.account.pending = $scope.account.offer_count.pending;
					$scope.account.approved = $scope.account.offer_count.approved;
					$scope.account.running = $scope.account.offer_count.running;
					$scope.account.completed = $scope.account.offer_count.completed;
					$scope.account.archived = $scope.account.offer_count.archived;
					if ($scope.profile.accounts[i].account_id === $scope.acctid) {
						$scope.thisAccount = $scope.profile.accounts[i];
					}
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
		
		// get payment method types
		okdService.getPaymentTypes().then(function(data){
			$scope.activePaymentTypes = [];
			$scope.paymentType = [];
			$scope.paymentTypes = data.response.payment_types;
			for (var i = 0; i < $scope.paymentTypes.length; i++) {
				$scope.activePaymentTypes.push($scope.paymentTypes[i]);	
			}
		},
		function(errorMessage){
			$scope.error=errorMessage;
		});
	};
 
	refresh();
	
	$scope.account = {};
	$scope.submit = function() {
		$scope.setLoading(true);
		var paymentInfo = new Object();
		paymentInfo.payment_method_name = $scope.account.payment_method_name;
		paymentInfo.payment_method_type = $scope.paymentType.payment_type;
		paymentInfo.authority = $scope.paymentType.payment_type_name;
		paymentInfo.card_number = $scope.account.ccn;
		paymentInfo.expiry = $scope.account.expiry;
		paymentInfo.cvv = $scope.account.cvv;
		paymentInfo.routing_number = $scope.account.routing_number;
		paymentInfo.account_number = $scope.account.account_number;
		paymentInfo.address = $scope.account.address;
		paymentInfo.city = $scope.account.city;
		paymentInfo.state = $scope.account.state;
		paymentInfo.zip_code = $scope.account.zip_code;
		paymentInfo.first_name = $scope.account.paymentCardFirstName;
		paymentInfo.last_name = $scope.account.paymentCardLastName;

		okdService.createPaymentMethod($routeParams.account_id, paymentInfo).then(function(data){
			if(data){
				$scope.setLoading(false);
				if(data.meta.code==200){
					$location.path("/channels/"+$scope.acctid ).replace();	
				}
				else {
					$scope.profile = data.response;
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);	
				}
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
		});
	};
	
	//partial for payment type
	$scope.paymentTypePartial = function() {
		//$scope.paymentId = $scope.payment_type_name;
		if ($scope.paymentType.payment_type != null && typeof $scope.paymentType.payment_type != 'undefined') {
			if ($scope.paymentType.payment_type === "CR") {
				$scope.paymentTypePartialPath = "partials/ccSectionAccount.html";
			}
			else if ($scope.paymentType.payment_type === "CH") {
				$scope.paymentTypePartialPath = "partials/baSectionAccount.html";
			}
			else if ($scope.paymentType.payment_type === "CP") {
				$scope.paymentTypePartialPath = "partials/ppSection.html";
			}
		}
		else {
			$scope.paymentTypePartialPath = "partials/empty.html";
		}
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('createAccountChannelCtrl', function createAccountChannelCtrl($scope, $rootScope, okdService, twitterAddService, $routeParams, $location, $timeout, $filter, toaster, dialogs) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.contentLoaded = false;
	$scope.acctid = ($routeParams.account_id);
	function refresh(){
		$rootScope.setLoading(true);
		okdService.getChannels($scope.acctid).then(function(data){
			if(data){
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$scope.profile = data.response;
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						$scope.account = $scope.profile.accounts[i];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;					
					}
					$rootScope.contentLoaded = true;
				}
				else {
					$rootScope.setLoading(false);
					$location.path("/home");
				}
			}
			//this variable will later be populated from the fb account of the user
			//at a later point
			$scope.fbpages = [];
			$scope.acctid = ($routeParams.account_id);
			$scope.channels = [];
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					if ($scope.profile.accounts[i].account_id === $scope.acctid) {
						$scope.thisAccount = $scope.profile.accounts[i];
						// hide account name in header if only one account per relag-104
						$scope.thisAccount.name = ($scope.profile.accounts.length == 1) ? '' : $scope.thisAccount.account_name + ":";
						//check first if there are any channels
						if ($scope.thisAccount.channel_info) {
							for (var j = 0; j < $scope.thisAccount.channel_info.length; j++) {
								$scope.channels.push($scope.thisAccount.channel_info[j]);
							}
						}
					}
				}
			}
			
			// at this level we need the twitter handling logic switch default was not getting invoked
			// TODO: need to revisit this and make the interactions more suitable for user in terms of usability of the system 
			// At this point we need to look for a twitter_status in the query param if is "success" 
			// meaning that backend was able to store the twitter access_token information successfully
			$scope.location = $location;
			$scope.$watch('location.search()', function() {
				//TODO This can be moved to a modular function
				$scope.twitter_int_status = ($location.search()).twitter_status;
				
				if ($scope.twitter_int_status == 'success'){
					// TODO: we need to revisit this later
					
					// continueModal removed per relag-104
					// at this point we will trigger the create offer modal for now
					// $scope.openContinueModal();
					// end
				}
				
			}, true);
			// end of twitter handling code

			// channel history							
			if ($scope.thisAccount.history.length > 0) {
				$scope.historyPartialPath = "partials/history-container.html";
				$scope.modalTitle = "Channel History Details";
				$scope.historyData = $filter('orderBy')($scope.thisAccount.history, "ts", reverse=true);
				for (var i = 0; i < $scope.historyData.length; i++) {
					if ($scope.historyData[i].has_modal) {
						$scope.historyData[i].event_with_details = '<a href="">' + $scope.historyData[i].event + '</a>';
						$scope.historyData[i].event = '';
					}
				}
				$scope.itemsPerPage = 5;
				$scope.pagedItems = [];
				$scope.currentPage = 0;

				$scope.groupToPages = function () {
					$scope.pagedItems = [];
					for (var i = 0; i < $scope.historyData.length; i++) {
						if (i % $scope.itemsPerPage === 0) {
							$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.historyData[i] ];
						} else {
							$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.historyData[i]);
						}
					}
				};

				$scope.groupToPages();
				$scope.range = function (start, end) {
					var ret = [];
					if (!end) {
						end = start;
						start = 0;
					}
					for (var i = start; i < end; i++) {
						ret.push(i);
					}
					return ret;
				};

				$scope.prevPage = function () {
					if ($scope.currentPage > 0) {
						$scope.currentPage--;
					}
				};

				$scope.nextPage = function () {
					if ($scope.currentPage < $scope.pagedItems.length - 1) {
						$scope.currentPage++;
					}
				};

				$scope.setPage = function () {
					$scope.currentPage = this.n;
				};
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
		});
	};
	refresh();
	$scope.account = {};
	$scope.fbdata = {};
	
	function saveChannelInfo (channelData){
		// start of facebook post handling
		if(channelData){
			$scope.setLoading(true);
			okdService.createChannelInfo($scope.acctid, channelData).then(function(data){
				if(data){
					if(data.meta.code==200){
						$scope.setLoading(false);
					}
					else {
						$scope.setLoading(false);
						$scope.profile = data.response;			
						toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
					}
				}
	  		},
	  		function(errorMessage){
	  			$scope.setLoading(false);
	  			$scope.error=errorMessage;
	  		});
	    	
	    	//End of facebook post handling
		}
		else {
			$scope.setLoading(false);
			console.log("channel data is not ready yet.")
		}
	};
	
	function loadFBData(data){
		facebookChannelInfo = new Object();
		//These are mandatory data
		facebookChannelInfo.network_type = $scope.account.network;
		facebookChannelInfo.channel_name = $scope.account.channel_name;
		facebookChannelInfo.network_id = data.id;
		facebookChannelInfo.network_handle = data.name;
		facebookChannelInfo.access_token = data.access_token;
		facebookChannelInfo.user_access_token = data.user_access_token;
		return facebookChannelInfo;
	};
	
	function prepFBData(data , userToken){
		var pages = [];
		for(i=0; i<data.length; i++) {
			var page = new Object();
			page.id = data[i].id;
			page.name = data[i].name;
			page.access_token = data[i].access_token;
			page.user_access_token = userToken;
			pages[i] = page;
		}
		return pages;
	};
	
	$scope.selectChannel = function() {
		$scope.setLoading(true);
		if ($scope.account.network == 'Facebook') {
			var userAccessToken = "";
			FB.getLoginStatus(function(response) {
				$scope.setLoading(false);
				if (response.status === 'connected') {
					userAccessToken = response.authResponse.accessToken;
					FB.api('/me/accounts', function(response) {
						//console.log(response)
						//TODO We need to invoke a modal at this point that will populate
						// all the page details which current user has admin rights to
						// based on users selection we need to populate the following 
						// at this point this is just to make things work.
						//$scope.channelData = loadFBData(response.data);
						//saveChannelInfo();
						//Update the scope so that data is refreshed
						$scope.$apply(function () {
							$scope.fbpages = prepFBData(response.data , userAccessToken );
							// $scope.fbpages is populated
							// handle confirmChannelModal trigger here
							if ($scope.fbpages.length === 0){
								toaster.pop('error', "Can't find FB page.", "FB Page is required for offers. Sign in to an account with an FB page.");
							}
							else {
								$scope.selectedPages = {
									val: $scope.fbpages
								};
								$scope.launch('confirm-channel');
							}
						});
					});
			      	
				} else if (response.status === 'not_authorized') {
					FB.login(function(response) {
						if (response.status === 'connected') {
				    	      	//console.log(response.authResponse.accessToken)
							//console.log('User logged in');
							userAccessToken = response.authResponse.accessToken;
							FB.api('/me/accounts', function(response) {
								//console.log(response)
								//$scope.channelData = loadFBData(response.data);
								//saveChannelInfo();
								//Update the scope so that data is refreshed
								$scope.$apply(function () {
									$scope.fbpages = prepFBData(response.data,userAccessToken);
									// handle confirmChannelModal trigger here
									if ($scope.fbpages.length === 0){
										toaster.pop('error', "Can't find FB page.","FB Page is required for offers. Sign in to an account with an FB page.");
									}
									else {
										$scope.selectedPages = {
											val: $scope.fbpages
										};
										$scope.launch('confirm-channel');
									}
								});

							});
						} else {
							console.log('User is not connected');
							$scope.resetSelect();
						}
					}, { scope: 'publish_stream,manage_pages' });
			      } else {
					FB.login(function(response) {
						console.log(response)
						if (response.status === 'connected') {
							//console.log(response.authResponse.accessToken)
							//console.log('User logged in');
							userAccessToken = response.authResponse.accessToken;
							FB.api('/me/accounts', function(response) {
								//Update the scope so that data is refreshed
								$scope.$apply(function () {
									$scope.fbpages = prepFBData(response.data , userAccessToken);
									// handle confirmChannelModal trigger here
									if ($scope.fbpages.length === 0){
										toaster.pop('error', "Can't find FB page.", "FB Page is required for offers. Sign in to an account with an FB page.");
									}
									else {
										$scope.selectedPages = {
											val: $scope.fbpages
										};
										$scope.launch('confirm-channel');
									}
								});
							});
						} else {
							$scope.setLoading(false);
							console.log('User is not connected');
							$scope.resetSelect();
						}
					}, { scope: 'publish_stream,manage_pages' });
				}
			});
			// facebook handler code ends here
		}
		if ($scope.account.network == 'Twitter') {
			console.log($scope.account.network);
			// at this point we need to call the backend service
			// twitter handler code goes here
			console.log('redirecting to the twitter auth page')
			twitterChannelInfo = new Object();
			//These are mandatory data
			twitterChannelInfo.network_type = $scope.account.network;
			twitterChannelInfo.channel_name = $scope.account.channel_name;
			twitterChannelInfo.flow = "channels";
			twitterAddService.create($scope.acctid , twitterChannelInfo ).then(function(data){
				$scope.setLoading(false);
				//TODO need error handling after demo. revisit this after demo.
				console.log("at this point we might have a valid url")
				$scope.twitterAuthURL = data.url;
				console.log("redirecting to " + $scope.twitterAuthURL)
				//redirect to twitter URL that will activate our call back.
				window.location = $scope.twitterAuthURL;
			},
			function(errorMessage){
				$scope.setLoading(false);
				$scope.error=errorMessage;
			});
			// end of that redirection logic.
		}
	};

	$scope.submitConfirm = function(){
		console.log($scope.fbdata.select)
		//Now lets we just need to read stuff back from the fb pages array
		var selectedIndex = 0;
		if ($scope.fbdata.select){
			selectedIndex = parseInt($scope.fbdata.select) - 1;
			channelInfoData = loadFBData($scope.fbpages[selectedIndex]);
			saveChannelInfo(channelInfoData);
		}		
	};
	
	// reset select menu for choosing a network
	$scope.resetSelect = function() {
		$scope.account.network = '';
	};
	
	// remove payment method
	$scope.deleteChannel = function(index) {
		$scope.setLoading(true);	
		var delChannel = $scope.channels[index];
		master_channels = $scope.channels;
		
		okdService.removeChannel($routeParams.account_id, delChannel).then(function(data){
			if(data.meta.code==200){
				refresh();
				$timeout(function(){
					toaster.pop('success', "Success", "Channel '" + data.response.channel_name + "' removed.");
					$scope.setLoading(false);
				},3000);
			}
			else {
				$scope.setLoading(false);
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);	
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to remove channel.", "An error occurred while removing the channel. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	$scope.launch = function(which){
		switch(which){
			// Confirm channel
			case 'confirm-channel':
				var dlg = dialogs.create('/dialogs/confirm-channel.html','confirmChannelController',$scope.selectedPages,{keyboard: true, backdrop: true});
				dlg.result.then(function(page){
					$scope.fbdata.select = page;
				},function(){
					$scope.fbdata.select = '';
				});
				break;
		};
	};
	
	$scope.confirmChannel = function() {
		$scope.selectedPages = {
			val: $scope.fbpages
		};
		$scope.launch('confirm-channel');
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('confirmChannelController',function confirmChannelController($scope, $rootScope, $modalInstance, data){
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	$scope.submitConfirm = function(){
		$modalInstance.close($scope.fbdata.select);
	};
});

okd.controller('homeCtrl', function homeCtrl($scope, $rootScope, okdService, $routeParams, $location, $cookies, $http, toaster) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$scope.login = {};
	$scope.submitted = false;
	$rootScope.contentLoaded = true;
	$scope.submit = function() {
		if ($scope.loginFrm.$valid) {
			$rootScope.setLoading(true);
			okdService.homeLogin($scope.login).then(function(data){
				$location.path("/all-offers");
				//if(data.meta.code==200){
					//$rootScope.setLoading(false);
					//$scope.profile = data.response;
					//$rootScope.contentLoaded = true;
					//$location.path("/all-offers");			
				//}
				//else {
					//$rootScope.setLoading(false);
					//toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				//}
			},
			function(errorMessage){
				$scope.error=errorMessage;
				$rootScope.setLoading(false);
				toaster.pop('error', "Failed to login.", "Please try again. If the problem persists, please contact our Support.");
			});
		} else {
			$scope.loginFrm.submitted = true;
			toaster.pop('error', "Failed to login.", "Please try again. If the problem persists, please contact our Support.");
		}
	};
	
	$scope.forgotPassword = function() {
		if (!$scope.login.email_id) {
			toaster.pop('warning', "User Name required.", "Please enter your User Name then try again.");
		}
		else {
			$rootScope.setLoading(true);
			okdService.resetPassword($scope.login.email_id).then(function(data){
				if(data.meta.code==200){
					$scope.setLoading(false);
					toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);		
				}
				else {
					$scope.setLoading(false);
					toaster.pop('warning', data.meta.message.title, data.meta.message.subtitle);
				}
			},
			function(errorMessage){
				$scope.error=errorMessage;
				$rootScope.setLoading(false);
				toaster.pop('error', "Network failure.", "Please try again. If the problem persists, please contact our Support.");
			});			
		}
	};
});

okd.controller('locationsCtrl', function locationsCtrl($scope, okdService, $rootScope, $routeParams, $location, $filter, ngTableParams, toaster, dialogs) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	var account_id = ($routeParams.account_id);
	$rootScope.setLoading(true);
	$rootScope.contentLoaded = false;
	function refresh(){
		$rootScope.setLoading(true);
		okdService.getLocations(account_id).then(function(data){
			if(data){
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$scope.profile = data.response;
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						$scope.account = $scope.profile.accounts[i];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;					
					}
				}
				else {
					$rootScope.setLoading(false);
					$scope.profile = data.response;			
					$location.path("/home");
				}
			}
			
			$scope.locations = [];
					
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					if ($scope.profile.accounts[i].account_id === account_id) {
						$scope.thisAccount = $scope.profile.accounts[i];
						for (var j = 0; j < $scope.thisAccount.location_info.length; j++) {
							$scope.locations.push($scope.thisAccount.location_info[j]);
						}				
						for (var h = 0; h < $scope.locations.length; h++) {
							$scope.locations[h].count = $scope.locations[h].locations.length;
						}
						
						// location table pagination
						//$scope.data = $scope.locations;
						//$scope.locationsTableParams = new ngTableParams({
							//page: 1,
							//count: 10,
							//sorting: {
								//location_bundle_name: 'asc'
							//}
						//}, {
							//total: function () { return getData().length; }, 
							//getData: function($defer, params) {
								//var orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
								//params.total($scope.data.length);
								//$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
							//},
							//$scope: { $data: {} }
						//});
						
						
						
						var data = $scope.locations;
						$scope.locationsTableParams = new ngTableParams({
							page: 1,
							count: $scope.locations.length,
							sorting: {
								location_bundle_name: 'asc'
							}
						}, {
							total: data.length,
							getData: function($defer, params) {
								var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
								$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
							},
							$scope: { $data: {} }
						});						
						
			
						
						// location set map data
						$scope.openMap = function(id) {
							for (var m = 0; m < $scope.locations.length; m++) {
								if ($scope.locations[m].location_bundle_id === id) {
									$scope.setLocations = {
										val: $scope.thisAccount.location_info[m]
									};
									$scope.launch('map');
								}
							}
						};

						// locations history							
						if ($scope.thisAccount.history.length > 0) {
							$scope.historyPartialPath = "partials/history-container.html";
							$scope.modalTitle = "Locations History Details";
							$scope.historyData = $filter('orderBy')($scope.thisAccount.history, "ts", reverse=true);
							for (var i = 0; i < $scope.historyData.length; i++) {
								if ($scope.historyData[i].has_modal) {
									$scope.historyData[i].event_with_details = '<a href="">' + $scope.historyData[i].event + '</a>';
									$scope.historyData[i].event = '';
								}
							}
							$scope.itemsPerPage = 5;
							$scope.pagedItems = [];
							$scope.currentPage = 0;

							$scope.groupToPages = function () {
								$scope.pagedItems = [];
								for (var i = 0; i < $scope.historyData.length; i++) {
									if (i % $scope.itemsPerPage === 0) {
										$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.historyData[i] ];
									} else {
										$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.historyData[i]);
									}
								}
							};

							$scope.groupToPages();
							$scope.range = function (start, end) {
								var ret = [];
								if (!end) {
									end = start;
									start = 0;
								}
								for (var i = start; i < end; i++) {
									ret.push(i);
								}
								return ret;
							};

							$scope.prevPage = function () {
								if ($scope.currentPage > 0) {
									$scope.currentPage--;
								}
							};

							$scope.nextPage = function () {
								if ($scope.currentPage < $scope.pagedItems.length - 1) {
									$scope.currentPage++;
								}
							};

							$scope.setPage = function () {
								$scope.currentPage = this.n;
							};
						}
					}
				}
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
		});
	};
 
	refresh();
	
	$rootScope.$on('loadingTrue', function (event) {
		$scope.setLoading(true);
	});
	
	$rootScope.$on('loadingFalse', function (event) {
		$scope.setLoading(false);
	});
	
	$scope.launch = function(which){
		switch(which){
			// Map
			case 'map':
				var dlg = dialogs.create('/dialogs/location-set-map.html','LocationSetMapController',$scope.setLocations,{keyboard: true, backdrop: true, windowClass:'dialog-map'});
				break;
		};
	};
	
	$scope.deleteLocationSet = function(id) {
		$scope.setLoading(true);
		for (var i = 0; i < $scope.locations.length; i++) {
			if ($scope.locations[i].location_bundle_id === id) {
				$scope.thisLocation = $scope.locations[i];
			}
		}
		var delLocation = new Object();
		delLocation.location_bundle_id = id;
		okdService.removeLocations(account_id, delLocation).then(function(data){
			$scope.setLoading(false);
			if(data.meta.code==200){
				toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
				$scope.locations.splice($scope.locations.indexOf($scope.thisLocation),1);
				$scope.locationsTableParams.reload();
				refresh();
			}
			else {
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to remove location set.", "An error occurred while removing the location set. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('LocationSetMapController',function LocationSetMapController($scope, $routeParams, $rootScope, okdService, $modalInstance, data, toaster, $timeout){
   	$scope.data = data;
	$rootScope.$emit('loadingTrue');

	// location set map
	var ib = new InfoBox({
		 disableAutoPan: false,
		 maxWidth: 150,
		 pixelOffset: new google.maps.Size(-140, 0),
		 zIndex: null,
		 boxStyle: {
			background: "url('img/tipbox.gif') no-repeat",
			opacity: 0.75,
			width: "300px"
		},
		closeBoxMargin: "12px 4px 2px 2px",
		closeBoxURL: "img/infobox-close.gif",
		infoBoxClearance: new google.maps.Size(1, 1)
	});

	$scope.initialize = function() {
		$timeout(function () {
			var mapOptions = {
				zoom: 3,
				center: new google.maps.LatLng(39.017105, -94.687215),
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			var map = new google.maps.Map(document.getElementById('map'), mapOptions);
			google.maps.event.trigger(map, 'resize');
			var lats = [], longs = [], myLatlng = [], errLatlng = [];
			var latlongerr = false;
			
			for(var i=0; i<$scope.data.val.locations.length; i++) {
				lats[i] = $scope.data.val.locations[i].latitude;
				longs[i] = $scope.data.val.locations[i].longitude;
				// if not null
				if (lats[i] && longs[i]) {
					myLatlng.push(new google.maps.LatLng(lats[i], longs[i]));
				}
				else {
					latlongerr = true;
					errLatlng.push(lats[i])
				}

				var bounds = new google.maps.LatLngBounds();
				
				for (var j = 0, LtLgLen = myLatlng.length; j < LtLgLen; j++) {
					bounds.extend (myLatlng[j]);
				}

				google.maps.event.addListener(map, "click", function() { ib.close() });

				infowindow = new google.maps.InfoWindow({
					content: "loading..."
				});
			}
			
			if(latlongerr == true) {
				$scope.msgExpiredTxt = "<h4>Unable to claim</h4> The offer you are trying to claim ended. Check back later for additional offers from <strong>" + $scope.name + "</strong>."
				
				if(errLatlng.length > 1) {
					$scope.msgErrorHdr = "Unable to add plot markers."
					$scope.msgErrorTxt = errLatlng.length + " locations could not be plotted due to unknown latitiude or longitude."
				}
				else {
					$scope.msgErrorHdr = "Unable to add plot marker."
					$scope.msgErrorTxt = errLatlng.length + " location could not be plotted due to unknown latitiude or longitude."
				}
				
				toaster.pop('warning', $scope.msgErrorHdr, $scope.msgErrorTxt);
			}
			
			if ($scope.data.val.locations.length < 50) {
				setMarkers(map, $scope.data.val.locations);
				map.fitBounds(bounds);
			}
			else {
				var allmarkers = [];

				for (var i=0; i<$scope.data.val.locations.length; i++) {
					if($scope.data.val.locations[i].latitude) {
						allmarkers.push(createMarker($scope.data.val.locations[i], map));
					}
				}
				//var markerCluster = new MarkerClusterer(map, allmarkers);
				
				mcOptions = {styles: [{
						height: 53,
						url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
						width: 53
					},
					{
						height: 56,
						url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m2.png",
						width: 56
					},
					{
						height: 66,
						url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m3.png",
						width: 66
					},
					{
						height: 78,
						url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m4.png",
						width: 78
					},
					{
						height: 90,
						url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m5.png",
						width: 90
					}
				]}
				var markerCluster = new MarkerClusterer(map, allmarkers, mcOptions);		
				map.fitBounds(bounds)
			}

		}, 1);
	}

	function createMarker(site, map){
		var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
		var image = 'img/MapMarker_Ball_Right_Red.png';
	    
		var marker = new google.maps.Marker({
			position: siteLatLng,
			map: map,
			title: site.busname,
			icon: image,
			zIndex: site.id,
			html: '<div id="popup-offer"><div id="content">' + site.busname + '</div><dl class="dl-horizontal">' +
			'<dt>Address: </dt>' +
			'<dd>' + site.street + '<br /> ' + site.city + ', ' + site.zip + '</dd>' +				  
			'</dl></div>'
		});
	    
		var boxText = document.createElement("div");
		boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
		boxText.innerHTML = marker.html;

		var myOptions = {
			content: boxText,
			disableAutoPan: false,
			maxWidth: 0,
			pixelOffset: new google.maps.Size(-140, 0),
			zIndex: null,
			boxStyle: {
				background: "url('img/tipbox.gif') no-repeat",
				opacity: 0.75,
				width: "300px"
			},
			closeBoxMargin: "10px 2px 2px 2px",
			closeBoxURL: "img/infobox-close.gif",
			infoBoxClearance: new google.maps.Size(1, 1),
			isHidden: false,
			pane: "floatPane",
			enableEventPropagation: false
		};

		google.maps.event.addListener(marker, "click", function (e) {
			ib.close();
			ib.setOptions(myOptions);
			ib.open(map, this);
		});
		return marker;
	}

	function setMarkers(map, markers) {
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].latitude) {
				createMarker(markers[i], map);
			}
		}
		google.maps.event.trigger(map, 'resize');
	}
	
	$scope.cancel = function(){
		google.maps.event.trigger(map, 'resize');
		$modalInstance.dismiss('canceled');
	};
	$rootScope.$emit('loadingFalse');
});

okd.controller('editLocationsCtrl', function editLocationsCtrl($scope, $rootScope, okdService, $routeParams, $location, $filter, toaster) {
	var account_id = ($routeParams.account_id);
	var location_bundle_id = ($routeParams.location_bundle_id);
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.setLoading(true);
	$rootScope.contentLoaded = false;
	function refresh(){
		okdService.getLocations(account_id).then(function(data){
			$rootScope.setLoading(true);
			if(data){
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$scope.profile = data.response;
				}
				else {
					$rootScope.setLoading(false);
					$scope.profile = data.response;			
					$location.path("/home");
				}
			}

			var location_bundle_id = $routeParams.location_bundle_id;
		
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
					$scope.account.draft = $scope.account.offer_count.draft;
					$scope.account.pending = $scope.account.offer_count.pending;
					$scope.account.approved = $scope.account.offer_count.approved;
					$scope.account.running = $scope.account.offer_count.running;
					$scope.account.completed = $scope.account.offer_count.completed;
					$scope.account.archived = $scope.account.offer_count.archived;

					if ($scope.profile.accounts[i].account_id === account_id) {
						$scope.thisAccount = $scope.profile.accounts[i];
						for (var j = 0; j < $scope.thisAccount.location_info.length; j++) {
							if ($scope.thisAccount.location_info[j].location_bundle_id === location_bundle_id) {
								$scope.location = $scope.thisAccount.location_info[j];
								$scope.locationName = $scope.thisAccount.location_info[j].location_bundle_name;
								$scope.locations = $filter('orderBy')($scope.location.locations, 'zip', false);
								$scope.itemsPerPage = 5;
								$scope.pagedItems = [];
								$scope.currentPage = 0;
								$scope.addressErr = false;
								
								// error alert if lat/long is null
								for (var i = 0; i < $scope.locations.length; i++) {
									if($scope.locations[i].latitude==null) {
										$scope.locations[i].mylat="problem";
										$scope.rowClass = function(location){
											return location.mylat;
										};
										$scope.addressErr = true;
									}
								}
								
								if ($scope.addressErr==true) {
									toaster.pop('error', "Problem with location(s).", "Locations indicated have problems with latitude and logitude.");
								}

								$scope.groupToPages = function () {
									$scope.pagedItems = [];
									for (var i = 0; i < $scope.locations.length; i++) {
										if (i % $scope.itemsPerPage === 0) {
											$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.locations[i] ];
										} else {
											$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.locations[i]);
										}
									}
									// location error state
									for (var arr=0; arr<$scope.pagedItems.length; arr++) {
										for (var x=0; x<$scope.pagedItems[arr].length; x++) {
											if($scope.pagedItems[arr][x].latitude==null && $scope.pagedItems[arr][x].busname) {
												$scope.pagedItems[arr].latErr = true;
											}
										}
									}
								};

								$scope.groupToPages();
								$scope.range = function (start, end) {
									var ret = [];
									if (!end) {
										end = start;
										start = 0;
									}
									for (var i = start; i < end; i++) {
										ret.push(i);
									}
									return ret;
								};

								$scope.prevPage = function () {
									if ($scope.currentPage > 0) {
										$scope.currentPage--;
									}
								};

								$scope.nextPage = function () {
									if ($scope.currentPage < $scope.pagedItems.length - 1) {
										$scope.currentPage++;
									}
								};

								$scope.setPage = function () {
									$scope.currentPage = this.n;
								};
							}
						}
					}
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
	};
 
	refresh();
	
	$scope.cancel = function() {
		$location.path("/locations/"+account_id);
	};

	$scope.locations = [{}];
	$scope.addLocation = function() {
		$scope.locations.push({});
		$scope.groupToPages();
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};

	$scope.removeLocation = function(location) {
		var index=$scope.locations.indexOf(location);		
		$scope.locations.splice(index, 1);
		// if deleting last row, add a new blank row
		if ($scope.locations.length < 1) {
			$scope.locations.push({});
		}
		$scope.groupToPages();
		if ($scope.currentPage > 0) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};	
	
	// get location set name and location table data
	$scope.editlocation = {};
	$scope.editlocation = {location_bundle_id: location_bundle_id, account_id: account_id};
	master_locations = $scope.locations;
	$scope.form = angular.copy(master_locations);
	
	// called from save locations button
	$scope.submitted = false;
	$scope.saveLocations = function() {
		if ($scope.editLocationsForm.$valid) {
			$scope.setLoading(true);
			var locationInfo = new Object();
			locationInfo.location_bundle_name = $scope.location.location_bundle_name;
			locationInfo.location_bundle_id = $routeParams.location_bundle_id;
			locationInfo.locations = $scope.locations;
			okdService.updateLocations($scope.editlocation.account_id, locationInfo).then(function(data){
				$scope.savedLocations = data.response;
				if(data.meta.code==200){
					$scope.setLoading(false);
					toaster.pop('success', "Success", "Location Set saved as '" + $scope.savedLocations.location_bundle_name +"'");
					refresh();
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			},
			function(errorMessage){
				$scope.error=errorMessage;
				$scope.setLoading(false);
				toaster.pop('error', "Unable to save location set.", "An error occurred while saving the location set. Please try again. If the problem persists, please contact our Support.");
				
			});
		} else {
			$scope.setLoading(false);
			$scope.editLocationsForm.submitted = true;
			toaster.pop('warning', "Required fields missing", "Please check for any required fields you may have missed.");
		}
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('newLocationsCtrl', function newLocationsCtrl($scope, $rootScope, okdService, $routeParams, $location, toaster, dialogs) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.setLoading(true);
	$rootScope.contentLoaded = false;
	var account_id = ($routeParams.account_id);
	function refresh(){
		$rootScope.setLoading(true);
		okdService.getAccountByID(account_id).then(function(data){
			if(data){
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$scope.profile = data.response;
				}
				else {
					$rootScope.setLoading(false);
					$scope.profile = data.response;
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}
			
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
					$scope.account.draft = $scope.account.offer_count.draft;
					$scope.account.pending = $scope.account.offer_count.pending;
					$scope.account.approved = $scope.account.offer_count.approved;
					$scope.account.running = $scope.account.offer_count.running;
					$scope.account.completed = $scope.account.offer_count.completed;
					$scope.account.archived = $scope.account.offer_count.archived;
					
					if ($scope.profile.accounts[i].account_id === account_id) {
						$scope.thisAccount = $scope.profile.accounts[i];
						$scope.savedlocations = $scope.thisAccount.location_info;
					}
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
	};
 
	refresh();
	
	$scope.launch = function(which){
		switch(which){
			// Upload Locations CSV
			case 'upload-csv':
				var dlg = dialogs.create('/dialogs/upload-csv.html','uploadCSVCtrl',{},{keyboard: true, backdrop: true});
				dlg.result.then(function(locations){
					$scope.locations = locations;
					$scope.groupToPages();
				},function(locations){
					$scope.locations = '';
				});
				break;
		};
	};
	
	$scope.cancel = function() {
		$location.path("/locations/"+account_id);
	};
	
	// get location set name and location table data
	$scope.location = {};
	$scope.location = {accountid: account_id};
	master_locations = $scope.locations;
	
	$scope.form = angular.copy(master_locations);

	// called from save locations button
	$scope.submitted = false;
	$scope.saveLocations = function() {
		if ($scope.addLocationsForm.$valid) {
			$scope.setLoading(true);
			var locationInfo = new Object();
			locationInfo.location_bundle_name = $scope.location.location_bundle_name;
			locationInfo.locations = $scope.locations;
			okdService.createLocations($scope.location.accountid, locationInfo).then(function(data){
				$scope.savedLocations = data.response;
				if(data.meta.code==200){
					$scope.setLoading(false);
					if (data.response.alteast_one_issue) {
						$location.path("/edit-locations/" + data.response.location_bundle_id + "/account/" + account_id);
					}
					else {
						$location.path("/locations/"+account_id);
					}
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			},
			function(errorMessage){
				$scope.error=errorMessage;
				$scope.setLoading(false);
				toaster.pop('error', "Unable to save location set.", "An error occurred while saving the location set. Please try again. If the problem persists, please contact our Support.");
			});
		} else {
			$scope.setLoading(false);
			$scope.addLocationsForm.submitted = true;
			toaster.pop('warning', "Required fields missing", "Please check for any required fields you may have missed.");
		}
	};	
	
	$scope.locations = [{}];
	$scope.itemsPerPage = 5;
	$scope.pagedItems = [];
	$scope.currentPage = 0;

	$scope.groupToPages = function () {
		$scope.pagedItems = [];
		for (var i = 0; i < $scope.locations.length; i++) {
			if (i % $scope.itemsPerPage === 0) {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.locations[i] ];
			} else {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.locations[i]);
			}
		}
	};

	$scope.groupToPages();
	$scope.range = function (start, end) {
		var ret = [];
		if (!end) {
			end = start;
			start = 0;
		}
		for (var i = start; i < end; i++) {
			ret.push(i);
		}
		return ret;
	};

	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			$scope.currentPage++;
		}
	};

	$scope.setPage = function () {
		$scope.currentPage = this.n;
	};	

	$scope.addLocation = function() {
		$scope.locations.push({});
		$scope.groupToPages();
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};

	$scope.removeLocation = function(location) {
		var index=$scope.locations.indexOf(location);		
		$scope.locations.splice(index, 1);
		// if deleting last row, add a new blank row
		if ($scope.locations.length < 1) {
			$scope.locations.push({});
		}
		$scope.groupToPages();
		if ($scope.currentPage > 0) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};
	
	// get saved location sets
	$scope.importSavedLocations = function(id) {
		$scope.locationId = id;
		for (var i = 0; i < $scope.profile.accounts.length; i++) {
			if ($scope.profile.accounts[i].account_id === account_id) {
				$scope.thisAccount = $scope.profile.accounts[i];
				for (var j = 0; j < $scope.thisAccount.location_info.length; j++) {
					if ($scope.thisAccount.location_info[j].location_bundle_id === $scope.locationId) {						
						$scope.locations = $scope.thisAccount.location_info[j].locations;
						$scope.location.location_bundle_name = $scope.thisAccount.location_info[j].location_bundle_name;
						$scope.groupToPages();
					}
				}
			}
		}
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('uploadCSVCtrl',function uploadCSVCtrl($scope, $rootScope, $modalInstance, data){	
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	
	// parse csv
	function parseCSVLine(line) {
		var message = "";
		var error = false;
		setMessage(message, error);
		line = line.split(',');
		for (var i = 0; i < line.length; i++) {
			var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
			
			var quote = "";
			if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
			if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";
			if (quote != "") {
				var j = i + 1;
				if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
				while (j < line.length && chunk.charAt(chunk.length - 1) != quote) {
					line[i] += ',' + line[j];
					line.splice(j, 1);
					chunk = line[j].replace(/[\s]*$/g, "");
				}
				if (j < line.length) {
					line[i] += ',' + line[j];
					line.splice(j, 1);
				}
			}
		}
		for (var i = 0; i < line.length; i++) {
			line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
			if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
			else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
		}
		return line;
	}

	$scope.fileToCsv = function(fileToRead) {
		var reader = new FileReader();   
		reader.readAsText(fileToRead);
		reader.onload = $scope.loadHandler;
		reader.onerror = $scope.errorHandler;
	};

	$scope.loadHandler = function(event) {
		var csv = event.target.result;
		$scope.processData(csv);
	};
	
	$scope.errorHandler = function(evt) {
		setMessage(message, error);
		if(evt.target.error.name == "NotReadableError") {
			error = true;
			message = "Cannot read file."
		}
	}
	
	$scope.processData = function(csv) {
		$scope.csvRows = [];
		$scope.objArr = [];
		var message = "";
		var error = false;
		var csvText = csv;
		setMessage(message, error);
		if (csvText == "") {
			error = true;
			message = "Select a CSV file please.";
		}
		if (!error) {
			benchmarkStart = new Date();
			$scope.csvRows = csvText.split(/[\r\n]/g);
			for (var i = 0; i < $scope.csvRows.length; i++) {
				if ($scope.csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "") {
					$scope.csvRows.splice(i, 1);
					i--;
				}
			}
			if ($scope.csvRows.length < 2) {
				error = true;
				message = "The CSV text MUST have a header row!";
			} else {
				$scope.objArr = [];
				for (var i = 0; i < $scope.csvRows.length; i++) {
					$scope.csvRows[i] = parseCSVLine($scope.csvRows[i]);
				}
				benchmarkParseEnd = new Date();
				for (var i = 1; i < $scope.csvRows.length; i++) {
					if ($scope.csvRows[i].length > 0) $scope.objArr.push({});
					for (var j = 0; j < $scope.csvRows[i].length; j++) {
						$scope.objArr[i - 1][$scope.csvRows[0][j]] = $scope.csvRows[i][j];
					}
				}
				$scope.locations = $scope.objArr;
				// send parsed data to callback and close modal
				$modalInstance.close($scope.locations);				
				benchmarkObjEnd = new Date();				
				benchmarkPopulateEnd = new Date();
				message = getBenchmarkResults();
			}
		}
		setMessage(message, error);
	};

	$scope.handleFiles = function(files) {
		if (window.FileReader) {
			$scope.fileToCsv(files[0]);
		} else {
			alert('FileReader are not supported in this browser.');
		}
	};
	
	function setMessage(message, error) {
		document.getElementById("message").innerHTML = '<p>' + message + '</p>';
		if (error)
			document.getElementById("message").className = "error";
		else
			document.getElementById("message").className = "";
	}
	
	function getBenchmarkResults() {
	    var message = "";
	    var totalTime = benchmarkPopulateEnd.getTime() - benchmarkStart.getTime();
	    var timeDiff = (benchmarkParseEnd.getTime() - benchmarkStart.getTime());
	    var mostTime = "parsing CSV text";
	    if ((benchmarkObjEnd.getTime() - benchmarkParseEnd.getTime()) > timeDiff) {
		  timeDiff = (benchmarkObjEnd.getTime() - benchmarkParseEnd.getTime());
		  mostTime = "converting to objects";
	    }
	    message += $scope.csvRows.length + " CSV line" + ($scope.csvRows.length > 1 ? 's' : "") + " converted into " + $scope.objArr.length + " item" + ($scope.objArr.length > 1 ? 's' : "") + " in " + (totalTime / 1000) + " seconds, with an average of " + ((totalTime / 1000) / $scope.csvRows.length) + " seconds per item.";
	    return message;
	}
});

okd.controller('allOffersCtrl', function allOffersCtrl($scope, $rootScope, okdService, $location, startTime, elapsedEstimator, sharedProperties, dialogs, $filter, $log, ngTableParams, $timeout, toaster) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.setLoading(true);
	function refresh(){
		okdService.getAllOffers().then(function(data){
			$scope.setLoading(true);
			if(data){				
				if(data.meta.code==200){
					$scope.setLoading(false);
					$scope.profile = data.response;
				}
				else {
					$scope.setLoading(false);
					$scope.profile = data.response;
					$location.path("/home");
				}

				// elapsed time
				$scope.startedTime = startTime;

				var intervalId;
				intervalId = setInterval(function(){
					$scope.$apply(function(){
						$scope.elapsed = elapsedEstimator.elapsed();
					});
				}, 2000);
			}
			
			$scope.allOffers = [];
			
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.offers = [];
					$scope.account = $scope.profile.accounts[i];
					$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
					$scope.account.draft = $scope.account.offer_count.draft;
					$scope.account.pending = $scope.account.offer_count.pending;
					$scope.account.approved = $scope.account.offer_count.approved;
					$scope.account.running = $scope.account.offer_count.running;
					$scope.account.completed = $scope.account.offer_count.completed;
					$scope.account.archived = $scope.account.offer_count.archived;

					for (var j = 0; j < $scope.account.offer_details.length; j++) {
						if ($scope.account.offer_details[j].status != "ARCHIVED") {
							$scope.offers.push($scope.account.offer_details[j]);
							$scope.checkMsg($scope.account.offer_details[j]);
							$scope.checkLocations($scope.account.offer_details[j]);
							
							for (z=0; z<$scope.offers.length; z++) {
								$scope.offers[z].account_id = $scope.account.account_id;
								$scope.offers[z].account_name = $scope.account.account_name;
							}

							for (var k = 0; k < $scope.offers.length; k++) {
								if ($scope.offers[k].network_type == "DIRECT") {
									$scope.offers[k].offerValue = $filter('currency')($scope.offers[k].value);
									$scope.recipients = $scope.offers[k].recipients_info;
									if ($scope.recipients.length == 1) {
										$scope.offers[k].offerCount = $scope.recipients.length + ' offer';
									}
									else {
										$scope.offers[k].offerCount = $scope.recipients.length + ' offers';
									}
								}
								else {
									if($scope.offers[k].offer_type == 'standard') {
										var total = Math.floor($scope.offers[k].total/$scope.offers[k].value);
										total == 1 ? $scope.offers[k].offerCount = total + ' offer' : $scope.offers[k].offerCount = total + ' offers';
										$scope.offers[k].offerValue = $filter('currency')($scope.offers[k].value);
									}
									else if($scope.offers[k].offer_type == 'sku') {
										$scope.offers[k].offerCount = '';
										switch($scope.offers[k].discount_info.type){
											case 'MINPURCHASED':
												$scope.offers[k].offerValue = $filter('currency')($scope.offers[k].discount_info.get_amount) + ' off';
												break;
											case 'MINPURCHASEP':
												$scope.offers[k].offerValue = $scope.offers[k].discount_info.get_percentage + '% off';
												break;
											case 'BXGX':
												if($scope.offers[k].discount_info.buy_quantity) {
													$scope.offers[k].offerValue = 'Buy ' + $scope.offers[k].discount_info.buy_quantity + ' Get ' + $scope.offers[k].discount_info.get_quantity + ' Free';
												}
												else {
													$scope.offers[k].offerValue = 'Get ' + $scope.offers[k].discount_info.get_quantity + ' Free';
												}
												break;
											case 'BUNDLE':
												$scope.offers[k].offerValue = $filter('currency')($scope.offers[k].discount_info.get_amount) + ' off Bundle';
												break;
										};
									}
								}
							}
							
							$scope.handleLocationsClick = function(account_id, offer_id) {
								$scope.setLoading(true);
								okdService.getLocationsByOffer(account_id, offer_id).then(function(data){
									if(data){
										$scope.setLoading(false);
										if(data.meta.code==200){
											$scope.mapdata = data.response;
											$scope.setLocations = {
												val: $scope.mapdata
											};
											$scope.launch('map');
										}
										else {
											toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
										}
									}
								},
								function(errorMessage){
									$scope.setLoading(false);
									toaster.pop('error', "Unable to get locations.", "An error occurred while getting the offer's locations. Please try again. If the problem persists, please contact our Support.");
								});
							};
						}
					}
				}
				
				for (var w = 0; w < $scope.profile.accounts.length; w++) {
					for (var j = 0; j < $scope.profile.accounts[w].offer_details.length; j++) {
						if ($scope.profile.accounts[w].offer_details[j].status != "ARCHIVED") {
							$scope.allOffers.push($scope.profile.accounts[w].offer_details[j]);
						}
					}
					if($scope.profile.accounts.length > 1) {
						$scope.topHeading = "Grouped by Account";
					}
					else {
						$scope.topHeading = $scope.profile.accounts[w].account_name;
					}
				}

				var data = $scope.allOffers;

				if($scope.profile.accounts.length > 1) {
					$scope.grouped = true;
					$scope.paginateGroups(data);
				}
				else {
					$scope.grouped = false;
					$scope.paginate(data);
				}
				
				$scope.getAllOffersInclude = function(){
					if($scope.profile.accounts.length > 1){
						return "partials/all-offers-table-grouped.html";
					}
					else {
						return "partials/all-offers-table.html";
					}
				    return "";
				}
				
				$rootScope.contentLoaded = true;
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
		});
	};
 
	$scope.stringValue = sharedProperties.getString;
	$scope.objectValue = sharedProperties.getObject();
	$scope.setString = function(newValue) {
		$scope.objectValue.data = newValue;
		sharedProperties.setString(newValue);
		$scope.menuActive = newValue;
	};

	$scope.menuActive = $scope.stringValue();
 
	refresh();
	
	$scope.launch = function(which){
		switch(which){
			case 'map':
				var dlg = dialogs.create('/dialogs/location-set-map.html','LocationSetMapController',$scope.setLocations,{keyboard: true, backdrop: true, windowClass:'dialog-map'});
				break;
		};
	};
	
	$scope.paginateGroups = function(data) {
		$scope.groupTableParams = new ngTableParams({
			page: 1,
			count: 10,
			sorting: {
				start_ts: 'desc'
			}
		}, {
			//groupBy: 'account_name',
			groupBy: function(item) {
				return item.account_name;
			},
			total: data.length,
			getData: function($defer, params) {
				var searchedData = searchData();
				var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});

		$scope.$watch("searchData", function () {
			if (this.last !== undefined) { 
				$scope.groupTableParams.reload();
				$scope.groupTableParams.$params.page = 1;
			} 
		});

		var searchData = function(){
		    if($scope.searchData)
			 return $filter('filter')(data, $scope.searchData);
		    return data;
		}
	};
	
	$scope.paginate = function(data) {
		$scope.tableParams = new ngTableParams({
			page: 1,
			count: 5,
			sorting: {
				start_ts: 'desc'
			}
		}, {
			total: function () { return getData().length; },
			getData: function($defer, params) {
				var searchedData = searchData();
				var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;			
				$scope.offers = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
				params.total(orderedData.length);
				$defer.resolve($scope.offers);
			},
			$scope: { $data: {} }
		});

		$scope.$watch("searchData", function () {
			if (this.last !== undefined) { 
				$scope.tableParams.reload();
				$scope.tableParams.$params.page = 1;
			} 
		});

		var searchData = function(){			
			if($scope.searchData) {
				return $filter('filter')(data, $scope.searchData);
			}
			return data;
		}	
	}
	
	$scope.checkMsg = function(offer) {
		if (offer.messages.length > 0) {
			for (var k = 0; k < offer.messages.length; k++) {
				var date = String(offer.messages[k].msg_date);							
				offer.messages[k].formatted_date = Date.parse(date);
			}
		}
		if (!$.isEmptyObject(offer.messages)) {
			offer.includeMsg = true;
		}	
	};
		
	// location status
	$scope.checkLocations = function(offer) {		
		offer.location_length > 0 ? offer.showLocationName = true : offer.showLocationName = false;
		offer.locationLength = offer.location_length;
		offer.locationLength == 1 ? offer.locationsLabel = offer.locationLength + ' location' : offer.locationsLabel = offer.locationLength + ' locations';
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('offersGroupCtrl', function offersGroupCtrl($scope, $rootScope, okdService, $routeParams, $filter, startTime, elapsedEstimator, $location, sharedProperties, ngTableParams, dialogs, toaster) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.setLoading(true);
	$rootScope.contentLoaded = false;
	//$scope.offerfilter = angular.uppercase($routeParams.filter);
	$scope.offerfilter = angular.lowercase($routeParams.filter);
	$scope.account_id = ($routeParams.account_id);
	filteredOffers = [];

	function refresh(){
		okdService.getOffersByFilter($scope.account_id, $scope.offerfilter).then(function(data){
			if(data){
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$scope.profile = data.response;
				}
				else {
					$rootScope.setLoading(false);
					$scope.profile = data.response;			
					$location.path("/home");
				}
			}
			
			if ($scope.profile && $scope.profile.accounts) {
				$scope.filteredOffers = filteredOffers;

				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
					$scope.account.draft = $scope.account.offer_count.draft;
					$scope.account.pending = $scope.account.offer_count.pending;
					$scope.account.approved = $scope.account.offer_count.approved;
					$scope.account.running = $scope.account.offer_count.running;
					$scope.account.completed = $scope.account.offer_count.completed;
					$scope.account.archived = $scope.account.offer_count.archived;

					if ($scope.profile.accounts[i].account_id === $scope.account_id) {
						$scope.thisAccount = $scope.profile.accounts[i];
						for (var j = 0; j < $scope.thisAccount.offer_details.length; j++) {
							$scope.filteredOffers.push($scope.profile.accounts[i].offer_details[j]);
							$scope.checkMsg($scope.account.offer_details[j]);				

							// elapsed time
							$scope.startedTime = startTime;

							var intervalId;
							intervalId = setInterval(function(){
								$scope.$apply(function(){
									$scope.elapsed = elapsedEstimator.elapsed();
								});
							}, 2000);
						}
					}
				}
				
				$scope.filteredOffers = filteredOffers;

				for (var i = 0; i < $scope.filteredOffers.length; i++) {
					// location status
					$scope.filteredOffers[i].location_length > 0 ? $scope.filteredOffers[i].showLocationName = true : $scope.filteredOffers[i].showLocationName = false;
					$scope.filteredOffers[i].locationLength = $scope.filteredOffers[i].location_length;
					$scope.filteredOffers[i].locationLength == 1 ? $scope.filteredOffers[i].locationsLabel = $scope.filteredOffers[i].locationLength + ' location' : $scope.filteredOffers[i].locationsLabel = $scope.filteredOffers[i].locationLength + ' locations';
					
					if ($scope.filteredOffers[i].network_type == "DIRECT") {
						$scope.filteredOffers[i].offerValue = $filter('currency')($scope.filteredOffers[i].value);
						$scope.recipients = $scope.filteredOffers[i].recipients_info;
						if ($scope.recipients.length == 1) {
							for (var a = 0; a < $scope.recipients.length; a++) {
								$scope.filteredOffers[i].offerCount = $scope.recipients.length + ' offer';
							}
						}
						else {
							$scope.filteredOffers[i].offerCount = $scope.recipients.length + ' offers';
						}
					}
					else {
						if($scope.filteredOffers[i].offer_type == 'standard') {
							$scope.filteredOffers[i].offerValue = $filter('currency')($scope.filteredOffers[i].value);
							var total = Math.floor($scope.filteredOffers[i].total/$scope.filteredOffers[i].value);
							total == 1 ? $scope.filteredOffers[i].offerCount = total + ' offer' : $scope.filteredOffers[i].offerCount = total + ' offers';
						}
						else if($scope.filteredOffers[i].offer_type == 'sku') {
							$scope.filteredOffers[i].offerCount = '';
							switch($scope.filteredOffers[i].discount_info.type){
								case 'MINPURCHASED':
									$scope.filteredOffers[i].offerValue = $filter('currency')($scope.filteredOffers[i].discount_info.get_amount) + ' off';
									break;
								case 'MINPURCHASEP':
									$scope.filteredOffers[i].offerValue = $scope.filteredOffers[i].discount_info.get_percentage + '% off';
									break;
								case 'BXGX':
									if ($scope.filteredOffers[i].discount_info.buy_quantity) {
										$scope.filteredOffers[i].offerValue = 'Buy ' + $scope.filteredOffers[i].discount_info.buy_quantity + ' Get ' + $scope.filteredOffers[i].discount_info.get_quantity + ' Free';
									}
									else {
										$scope.filteredOffers[i].offerValue = 'Get ' + $scope.filteredOffers[i].discount_info.get_quantity + ' Free';
									}
									break;
								case 'BUNDLE':
									$scope.filteredOffers[i].offerValue = $filter('currency')($scope.filteredOffers[i].discount_info.get_amount) + ' off Bundle';
									break;
							};
						}
					}
				}
				
				$scope.handleLocationsClick = function(account_id, offer_id) {
					$scope.setLoading(true);
					okdService.getLocationsByOffer(account_id, offer_id).then(function(data){
						if(data){
							$scope.setLoading(false);
							if(data.meta.code==200){
								$scope.mapdata = data.response;
								$scope.setLocations = {
									val: $scope.mapdata
								};
								$scope.launch('map');
							}
							else {
								toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
							}
						}
					},
					function(errorMessage){
						$scope.setLoading(false);
						toaster.pop('error', "Unable to get locations.", "An error occurred while getting the offer's locations. Please try again. If the problem persists, please contact our Support.");
					});
				};
				
				// new pagination
				var offersData = $scope.filteredOffers;
				$scope.tableParams = new ngTableParams({
					page: 1,
					count: 5,
					sorting: {
						start_ts: 'desc'
					}
				}, {
					total: function () { return getData().length; },
					getData: function($defer, params) {
						var searchedData = searchData();
						var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;			
						$scope.offers = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
						params.total(orderedData.length);
						$defer.resolve($scope.offers);
					},
					$scope: { $data: {} }
				});
				
				$scope.$watch("searchData", function () {
					if (this.last !== undefined) { 
						$scope.tableParams.reload();
						$scope.tableParams.$params.page = 1;
					} 
				});

				var searchData = function(){
					if($scope.searchData)
						return $filter('filter')(offersData, $scope.searchData);
					return offersData;
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
	};
 
	$scope.stringValue = sharedProperties.getString;
	$scope.objectValue = sharedProperties.getObject();
	$scope.setString = function(newValue) {
		$scope.objectValue.data = newValue;
		sharedProperties.setString(newValue);
		$scope.menuActive = newValue;
	};

	$scope.menuActive = $scope.stringValue();
 
	refresh();
	
	$scope.launch = function(which){
		switch(which){
			case 'map':
				var dlg = dialogs.create('/dialogs/location-set-map.html','LocationSetMapController',$scope.setLocations,{keyboard: true, backdrop: true, windowClass:'dialog-map'});
				break;
		};
	};

	$scope.checkMsg = function(offer) {
		if (!$.isEmptyObject(offer.messages)) {
			offer.includeMsg = true;
		}	
	};
	
	// location status
	$scope.checkLocations = function(offer) {
		for (var i = 0; i < offer.length; i++) {		
			offer[i].locations.length > 0 ? offer[i].showLocationName = true : offer[i].showLocationName = false
		}		
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('newOfferCtrl', function newOfferCtrl($scope, $rootScope, $routeParams, okdService, uploadService, $location, $timeout, sharedProperties, $filter, $log, toaster, dialogs) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$scope.setDisplayed = function(displayed) {
		$scope.isDisplayed = displayed;
	};
	$rootScope.contentLoaded = false;
	
	var account_id = ($routeParams.account_id);
	function refresh(){
		$scope.setLoading(true);
		okdService.getAccountByID(account_id).then(function(data){
			$rootScope.setLoading(true);
			if(data){
				if(data.meta.code==200){
					$scope.setLoading(false);
					$scope.profile = data.response;
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						$scope.account = $scope.profile.accounts[i];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;
						$scope.account.is_sku == true ? $scope.account.showOfferType = true : $scope.account.showOfferType = false;
					}
					$scope.distModel = 'URL';
					$scope.currentChannel();
				}
				else {
					$rootScope.setLoading(false);
					$scope.profile = data.response;				
					$location.path("/home");
				}
				
				moment.fn.roundMinutes = function () { return ~(this.minutes() / 15) * 15; }
			
				if ($scope.profile && $scope.profile.accounts) {
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						if ($scope.profile.accounts[i].account_id === account_id) {
							$scope.account = $scope.profile.accounts[i];
							$scope.methods = $scope.account.payment_info;
							$scope.channels = $scope.account.channel_info;
							$scope.locations = $scope.account.location_info;
							
							// account state
							$scope.account.is_approver_required == true ? $scope.approverRequired = true : $scope.approverRequired = false

							// approvers
							if ($scope.approverRequired == true) {
								$scope.approverPartialPath = "partials/approver-for-create-offer.html";
								$scope.approversList = $scope.account.approvers;								
							}

							// payment method
							selectPaymentMethod();
							
							// FB Channels
							$scope.fbChannels = [];
							for (var i = 0; i < $scope.channels.length; i++) {
								if ($scope.channels[i].network_type == "Facebook" && $scope.channels[i].status == "ACTIVE") {
									$scope.fbChannels.push($scope.channels[i]);
								}
							}						
							$scope.fbChannels.length == 0 ? $scope.disableFBSelect = true : $scope.disableFBSelect = false

							// Twitter Channels
							$scope.ttChannels = [];
							for (var i = 0; i < $scope.channels.length; i++) {
								if ($scope.channels[i].network_type == "Twitter" && $scope.channels[i].status == "ACTIVE") {
									$scope.ttChannels.push($scope.channels[i]);
								}
							}
							$scope.ttChannels.length == 0 ? $scope.disableTTSelect = true : $scope.disableTTSelect = false
						
							// saved locations selector
							$scope.offer.selectedLocations = '';

							// current locations
							$scope.currentLocations = $scope.offer.locations;

							if ($scope.offer.locations.length < 1) {
								$scope.offer.selectedLocations = '';
								$scope.offer.locations = [{}];
								$scope.location.location_bundle_name = '';
								$scope.location.location_bundle_id = '';
								$scope.locationsForm.$dirty = false;
								$scope.locationsForm.$invalid = true;
								$scope.locationsForm.location_bundle_name.$dirty = false;
								$scope.groupToPages();
							}
							else if ($scope.locations.length > 0) {
								$timeout(function () { 
									$scope.locationsForm.$dirty = true;
									$scope.locationsForm.$invalid = false;
									$scope.location.location_bundle_name = 'test';
									$scope.locationsForm.location_bundle_name.$dirty = true;

								},0);
								$scope.groupToPages();
							}							
							
							// locations status						
							if ($scope.locations.length > 0) {
								$scope.showLocations = true;
								$scope.saveImportedLocations = false;
							}
							else {
								$scope.showLocations = false;
								$scope.saveImportedLocations = true;
							}
							
							var minutes = moment().minute(),
							hours = moment().hour(),
							m = (parseInt((minutes + 7.5)/15) * 15) % 60,
							h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
							
							$scope.offer.offerdates = {startDate: moment().hour(h).minutes(m), endDate: moment().hour(h).minutes(m).add('minutes', 15)};
							
							// begin multi-select for recipients
							$scope.offer.recipients = [];
							$scope.recipientsList = $scope.account.recipients;
							// end multi-select for recipients
							
							// direct total budget
							$scope.$watch('[offer.value, offer.recipients]', function () { 
								$scope.offer.directBudget = ($scope.offer.value*$scope.offer.recipients.length) || 0;
							}, true);
						}
					}
					
					$rootScope.contentLoaded = true;
				};
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
  	};

	$scope.stringValue = sharedProperties.getString;
	$scope.objectValue = sharedProperties.getObject();
	$scope.setString = function(newValue) {
		$scope.objectValue.data = newValue;
		sharedProperties.setString(newValue);
		$scope.menuActive = newValue;
	};

	$scope.menuActive = $scope.stringValue();

	refresh();
	
	// if there is only one payment method, pre-select it
	function selectPaymentMethod(){
		if ($scope.methods.length == 1) {
			for (var p = 0; p < $scope.methods.length; p++) {
				$scope.method = $scope.methods[p];
			}
			$scope.offer.paymentMethod = $scope.method.payment_id;
		}
	};
	
	$rootScope.$on('loadingTrue', function (e, call) {
		$scope.setLoading(true);
	});
	
	$rootScope.$on('loadingFalse', function (e, call) {
		$scope.setLoading(false);
	});
	
	//publish
	$scope.offer = {};
	$scope.offer = {accountid: account_id};
	$scope.submitted = false;
	
	$scope.isFocused = false;
	$scope.focusInput = function() {
		$scope.isFocused = !$scope.isFocused;
	};

	$scope.$watch('[offer.value, offer.total]', function () {
		var tot = Math.floor($scope.offer.total/$scope.offer.value);
		if (tot != null && tot !== undefined && tot !== Infinity) {
			$scope.totalValue = tot || 0;
		}
	}, true);
	
	$scope.clearCode = function () {
		$scope.offer.code='';
		$timeout(function () {
			if ($('#code:enabled')) {$('#code').focus();}
		}, 100);
	};
	
	$scope.$on("fileSelected", function (event, args) {
		$scope.$apply(function () {            
			$scope.offer.file = args.file;
		});
	});
	
	function populateOfferData(actionType){
		var offerInfo = new Object();
		offerInfo.action_type = actionType;
		offerInfo.title = $scope.offer.title;
		offerInfo.value = $scope.offer.value;
		offerInfo.use_balance = $scope.offer.use_balance;
		offerInfo.enable_passbook = $scope.offer.enable_passbook;
		offerInfo.total = $scope.offer.total;
		offerInfo.count = Math.floor($scope.offer.total/$scope.offer.value);
		offerInfo.recipients = $scope.offer.recipients;
		offerInfo.payment_id = $scope.offer.paymentMethod;
		offerInfo.account_id = $scope.offer.accountid;
		offerInfo.locations = $scope.offer.locations;
		$scope.approverRequired ? offerInfo.approvers = $scope.offer.approvers_info : offerInfo.approvers = '';
		$scope.distModel=="URL" || $scope.distModel=="DIRECT" ? offerInfo.channel_id = $scope.distModel : offerInfo.channel_id = offerInfo.channel_id = $scope.offer.channel;
		offerInfo.post_text = $scope.offer.desc;
		offerInfo.start_ts = moment($scope.offer.offerdates.startDate).format();
		offerInfo.expiry_ts = moment($scope.offer.offerdates.endDate).format();
		if(typeof($scope.uploadReturn.successData) != "undefined") {
			offerInfo.image_name = $scope.uploadReturn.successData.name;
		}
		if($scope.offer.code){
			offerInfo.code = $scope.offer.code.toUpperCase();
			offerInfo.code_check = $scope.offer.code_check;
		}
		$scope.offer.instructions ? offerInfo.instructions = $scope.offer.instructions : offerInfo.instructions = '';
		
		offerInfo.ibeacons = $scope.offer.beacons;
		offerInfo.offer_type = $scope.typeModel;

		// discount info
		if($scope.typeModel=='sku') {
			offerInfo.discount_type = $scope.skuModel;
			if(offerInfo.discount_type == 'BUNDLE') {
				$scope.offer.buy_bundle = [];
				var buyinfo = {
				    buy_quantity: parseInt($scope.offer.buy_quantity),
				    buy_code: $scope.offer.buy_code
				};
				$scope.offer.buy_bundle.push(buyinfo);

				var getinfo = {
				    buy_quantity: $scope.offer.get_quantity,
				    buy_code: $scope.offer.get_code
				};				
				$scope.offer.buy_bundle.push(getinfo);
				offerInfo.discount_buy_bundle = $scope.offer.buy_bundle;
				offerInfo.discount_get_amount = $scope.offer.get_amount;
			}
			else {
				offerInfo.discount_buy_amount = $scope.offer.buy_amount;
				offerInfo.discount_buy_code = $scope.offer.buy_code;
				offerInfo.discount_get_amount = $scope.offer.get_amount;
				offerInfo.discount_get_percentage = $scope.offer.get_percentage;
				offerInfo.discount_buy_quantity = $scope.offer.buy_quantity;
				offerInfo.discount_get_quantity = $scope.offer.get_quantity;
			}
		}

		console.log(offerInfo);
		return offerInfo;
	};
	
	// preview offer
	$scope.previewOffer = function() {
		$scope.previewError = false;
		
		if($scope.typeModel=='standard') {
			if(!$scope.offer.value) {
				$scope.offerform.valueForm.value.$setValidity("preview", false);
				$scope.$watch('offer.value', function () {
					if ($scope.offer.value) {
						$scope.offerform.valueForm.value.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}

			if(!$scope.offer.desc) {
				$scope.offerform.createForm.offerDesc.$setValidity("preview", false);
				$scope.$watch('offer.desc', function () {
					if ($scope.offer.desc) {
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}

			if(!$scope.offer.title) {
				$scope.offerform.title.$setValidity("preview", false);
				$scope.$watch('offer.title', function () {
					if ($scope.offer.title) {
						$scope.offerform.title.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}

			if(!$scope.offer.total) {
				$scope.offerform.valueForm.total.$setValidity("preview", false);
				$scope.$watch('offer.total', function () {
					if ($scope.offer.total) {
						$scope.offerform.valueForm.total.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}

			if($scope.distModel=="Facebook" || $scope.distModel=="Twitter") {
				if(!$scope.offer.channel) {
					$scope.offerform.channel.$setValidity("preview", false);
					$scope.$watch('offer.channel', function () {
						if ($scope.offer.channel) {
							$timeout(function () {
								$scope.offerform.channel.$setValidity("preview", true);
							}, 500);
						}
					}, true);
					$scope.previewError = true;
				}
			}
		}
		
		else if ($scope.typeModel=='sku') {
			if(!$scope.offer.desc) {
				$scope.offerform.createForm.offerDesc.$setValidity("preview", false);
				$scope.$watch('offer.desc', function () {
					if ($scope.offer.desc) {
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}
			if(!$scope.offer.title) {
				$scope.offerform.title.$setValidity("preview", false);
				$scope.$watch('offer.title', function () {
					if ($scope.offer.title) {
						$scope.offerform.title.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}		
		
			if($scope.skuModel=='MINPURCHASED') {
				if($scope.distModel=='URL'){

					if(!$scope.offer.get_amount) {
						$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
						$scope.$watch('offer.get_amount', function () {
							if ($scope.offer.get_amount) {
								$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$timeout(function () {
									$scope.offerform.channel.$setValidity("preview", true);
								}, 500);
							}
						}, true);
						$scope.previewError = true;
					}
					if(!$scope.offer.get_amount) {
						$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
						$scope.$watch('offer.get_amount', function () {
							if ($scope.offer.get_amount) {
								$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
			}
			else if($scope.skuModel=='MINPURCHASEP') {
				if($scope.distModel=='URL'){
					if(!$scope.offer.get_percentage) {
						$scope.offerform.valueForm.get_percentage.$setValidity("preview", false);
						$scope.$watch('offer.get_percentage', function () {
							if ($scope.offer.get_percentage) {
								$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$scope.offerform.channel.$setValidity("preview", true);
							}
						}, true);
						$scope.previewError = true;
					}
					if(!$scope.offer.get_percentage) {
						$scope.offerform.valueForm.get_percentage.$setValidity("preview", false);
						$scope.$watch('offer.get_percentage', function () {
							if ($scope.offer.get_percentage) {
								$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
			}
			else if ($scope.skuModel=='BXGX') {
				if($scope.distModel=='URL'){
					if(!$scope.offer.get_quantity) {
						$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
						$scope.$watch('offer.get_quantity', function () {
							if ($scope.offer.get_quantity) {
								$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.get_quantity) {
						$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
						$scope.$watch('offer.get_quantity', function () {
							if ($scope.offer.get_quantity) {
								$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$scope.offerform.channel.$setValidity("preview", true);
							}
						}, true);
						$scope.previewError = true;
					}
				}
			}
			else if($scope.skuModel=='BUNDLE') {
				if(!$scope.offer.buy_quantity) {
					$scope.offerform.valueForm.buy_quantity.$setValidity("preview", false);
					$scope.$watch('offer.buy_quantity', function () {
						if ($scope.offer.buy_quantity) {
							$scope.offerform.valueForm.buy_quantity.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.buy_code) {
					$scope.offerform.valueForm.buy_code.$setValidity("preview", false);
					$scope.$watch('offer.buy_code', function () {
						if ($scope.offer.buy_code) {
							$scope.offerform.valueForm.buy_code.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_quantity) {
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
					$scope.$watch('offer.get_quantity', function () {
						if ($scope.offer.get_quantity) {
							$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_code) {
					$scope.offerform.valueForm.get_code.$setValidity("preview", false);
					$scope.$watch('offer.get_code', function () {
						if ($scope.offer.get_code) {
							$scope.offerform.valueForm.get_code.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_amount) {
					$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
					$scope.$watch('offer.get_amount', function () {
						if ($scope.offer.get_amount) {
							$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}
				
				if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$scope.offerform.channel.$setValidity("preview", true);
							}
						}, true);
						$scope.previewError = true;
					}				
				}
			}
		}
		
		if ($scope.previewError === true) {
			toaster.pop('warning', "Required fields missing", "Please check for any required fields you may have missed to preview this offer.");
		}
		else {
			submitPreview();
		}		
	
		function submitPreview(){
			$scope.setLoading(true);
			okdService.createPreview2(populateOfferData('Preview')).then(function(data){
				if(data.meta.code==200){
					$scope.setLoading(false);					
					$scope.previewLink = {
						val: data.response.preview_url
					};
					$scope.launch('preview-offer');
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			},
			function(errorMessage){
				$scope.setLoading(false);
				$scope.error=errorMessage;
				toaster.pop('error', "Failed to preview offer.", "An error occurred while previewing the offer. Please try again. If the problem persists, please contact our Support.");
			});
		}
	};
	
	// save offer
	$scope.submitOffer = function(actionType) {
		$scope.approversRequired = '';
		actionType=='Draft' ? $scope.approversRequired = 'false' : $scope.approversRequired = 'true';
		$timeout(function () {
			if ($scope.offerform.$valid) {
				$scope.setLoading(true);

				if ($scope.saveImportedLocations == true) {
					var locationInfo = new Object();
					locationInfo.location_bundle_name = $scope.location.location_bundle_name;
					locationInfo.locations = $scope.offer.locations;
					
					var beaconInfo = new Object();
					beaconInfo.beacons = $scope.offer.beacons;

					if (locationInfo.location_bundle_name) {
						okdService.createLocations($scope.location.accountid, locationInfo).then(function(data){
							$scope.savedLocations = data.response;
							if(data.meta.code==200){
								$scope.locationId = $scope.savedLocations.location_bundle_id;
								okdService.createOffer(populateOfferData(actionType)).then(function(data){
									if(data.meta.code==200){
										$scope.setLoading(false);
										$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
									}
									else {
										$scope.setLoading(false);
										toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
									}
								},
								function(errorMessage){
									$scope.setLoading(false);
									$scope.error=errorMessage;
									toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
								});
							}
							else {
								$scope.setLoading(false);
								toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
							}
						},
						function(errorMessage){
							$scope.setLoading(false);
							$scope.error=errorMessage;
							toaster.pop('error', "Unable to save location set.", "An error occurred while saving the location set. Please try again. If the problem persists, please contact our Support.");
						});
					}
					else {
						okdService.createOffer(populateOfferData(actionType)).then(function(data){
							console.log(data);
							if(data.meta) {
								if(data.meta.code==200){
									$scope.setLoading(false);
									$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
								}
								else {
									$scope.setLoading(false);
									toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
								}
							}
							else {
								$scope.setLoading(false);
								toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");						
							}
						},
						function(errorMessage){
							$scope.setLoading(false);
							$scope.error=errorMessage;
							toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
						});						
					}
				}
				else {
					okdService.createOffer(populateOfferData(actionType)).then(function(data){
						if(data.meta) {
							if(data.meta.code==200){
								$scope.setLoading(false);
								$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
							}
							else {
								$scope.setLoading(false);
								toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
							}
						}
						else {
							$scope.setLoading(false);
							toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");						
						}
					},
					function(errorMessage){
						$scope.setLoading(false);
						$scope.error=errorMessage;
						toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
					});
				}
			} else {
				$scope.setLoading(false);
				$scope.offerform.submitted = true;
				toaster.pop('warning', "Required fields missing", "Please check for any required fields you may have missed.");
			}
			
		}, 100);
	};

	// type selection - default is standard for new offer
	// standard || sku
	$scope.typeModel = 'standard';
	$scope.distributionSelectorPartialPath = "partials/distribution-selector.html";
	$scope.newTypeSelected = function(value) {
		if (value === 'standard') {
			formResets($scope.distModel, $scope.typeModel);
			if ($scope.distModel === 'URL' || $scope.distModel === 'Facebook' || $scope.distModel === 'Twitter') {
				$scope.valuePartialPath = "partials/value-for-new-offer.html";
			}
			else if ($scope.distModel === 'DIRECT') {
				$scope.valuePartialPath = "partials/value-direct-for-new-offer.html";
			}
		}
		else if (value === 'sku') {
			$scope.valuePartialPath = "partials/value-for-sku-offer.html";
			formResets($scope.distModel, $scope.typeModel);
		}
	};
	// end type selection
	
	// distribution selection
	// URL || Facebook || Twitter || Direct
	$scope.newChannelSelected = function(value) {
		if($scope.typeModel === 'sku') {
			$scope.valuePartialPath = "partials/value-for-sku-offer.html";
			formResets(value, $scope.typeModel);
		}
		if($scope.typeModel === 'standard') {
			if (value === 'URL' || value === 'Facebook' || value === 'Twitter') {
				$scope.valuePartialPath = "partials/value-for-new-offer.html";
			}
			else if (value === 'DIRECT') {
				$scope.valuePartialPath = "partials/value-direct-for-new-offer.html";
			}
			formResets(value, $scope.typeModel);
		}
	};
	// end distribution selection

	// selects partials based on current values
	$scope.currentChannel = function(value) {
		if ($scope.distModel === 'URL') {
			$scope.paymentTypePartialPath = "partials/channel-url-for-new-offer.html";
			$scope.valuePartialPath = "partials/value-for-new-offer.html";
			$scope.showPreview = true;
		}
		else if ($scope.distModel === 'Facebook') {
			$scope.paymentTypePartialPath = "partials/channel-fb-for-new-offer.html";
			$scope.valuePartialPath = "partials/value-for-new-offer.html";
			$scope.showPreview = true;
		}
		else if ($scope.distModel === 'Twitter') {
			$scope.paymentTypePartialPath = "partials/twitter-channel-for-new-offer.html";
			$scope.valuePartialPath = "partials/value-for-new-offer.html";
			$scope.showPreview = true;
		}
		else if ($scope.distModel === 'DIRECT') {
			$scope.paymentTypePartialPath = "partials/channel-direct-for-new-offer.html";
			$scope.valuePartialPath = "partials/value-direct-for-new-offer.html";
			$scope.showPreview = false;
		}
	};
	// end currentChannel
	
	// form resets
	// requires $scope.distModel (offer distribution selected) 
	// requires $scope.typeModel (offer type selected)
	// clears some preview error states
	// sets channel partial
	function formResets(distModel, typeModel) {
		switch(distModel){
			case 'URL':
				$scope.distModel = 'URL';
				$scope.paymentTypePartialPath = "partials/channel-url-for-new-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.paymentMethod = '';
					$scope.offer.buy_amount = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_amount = '';
					$scope.offer.get_percentage = '';
					$scope.offer.buy_quantity = '';
					$scope.offer.get_quantity = '';
					$scope.offer.get_code = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				break;
			case 'Facebook':
				$scope.distModel = 'Facebook';
				$scope.paymentTypePartialPath = "partials/channel-fb-for-new-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
						$scope.offerform.channel.$dirty = false;
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.paymentMethod = '';
					$scope.offer.buy_amount = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_amount = '';
					$scope.offer.get_percentage = '';
					$scope.offer.buy_quantity = '';
					$scope.offer.get_quantity = '';
					$scope.offer.get_code = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.channel.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				// select if only one fbChannel
				if ($scope.fbChannels.length == 1) {
					for (var i = 0; i < $scope.fbChannels.length; i++) {
						$scope.offer.channel = $scope.fbChannels[i].channel_id;
					}
				}
				break;
			case 'Twitter':
				$scope.distModel = 'Twitter';
				$scope.paymentTypePartialPath = "partials/channel-tt-for-new-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
						$scope.offerform.channel.$dirty = false;
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.paymentMethod = '';
					$scope.offer.buy_amount = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_amount = '';
					$scope.offer.get_percentage = '';
					$scope.offer.buy_quantity = '';
					$scope.offer.get_quantity = '';
					$scope.offer.get_code = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.channel.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				// select if only one ttChannel
				if ($scope.ttChannels.length == 1) {
					for (var i = 0; i < $scope.ttChannels.length; i++) {
						$scope.offer.channel = $scope.ttChannels[i].channel_id;
					}
				}
				break;
			case 'DIRECT':
				$scope.distModel = 'DIRECT';
				$scope.paymentTypePartialPath = "partials/channel-direct-for-new-offer.html";
				$scope.offer.channel = '';
				$scope.offer.title = '';
				$scope.offer.total = '';
				$scope.offer.value = '';
				$scope.showPreview = false;
				$scope.previewError = false;
				selectPaymentMethod();
				$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
				if(typeModel=='sku') {
					$scope.offer.value = '';
					$scope.offer.paymentMethod = '';
					$scope.offer.buy_amount = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_amount = '';
					$scope.offer.get_percentage = '';
					$scope.offer.buy_quantity = '';
					$scope.offer.get_quantity = '';
					$scope.offer.get_code = '';
				}
				$scope.offerform.$setPristine(true);
				break;		
		};
	};
	// end form resets
	
	// clears preview errors from sku form fields
	function clearAllPreview() {
		switch($scope.skuModel){
			case 'MINPURCHASED':
				$timeout(function () {
					$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
				}, 500);
				break;
			case 'MINPURCHASEP':
				$timeout(function () {
					$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
				}, 500);
				break;
			case 'BXGX':
				$timeout(function () {
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
				}, 500);
				break;
			case 'BUNDLE':
				$timeout(function () {
					$scope.offerform.valueForm.buy_quantity.$setValidity("preview", true);
					$scope.offerform.valueForm.buy_code.$setValidity("preview", true);
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
					$scope.offerform.valueForm.get_code.$setValidity("preview", true);
					$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
				}, 500);
				break;
		};	
	};
	// end clearAllPreview
	
	
	// sku tracking details section
	// default value is MINPURCHASED for new offer
	$scope.skuModel = 'MINPURCHASED';
	$scope.skuDetailsPartialPath = "partials/sku-minpurchased.html";
	$scope.newSkuSelected = function(value) {
		$scope.skuModel = value;

		// run formResets based on selections
		formResets($scope.distModel, $scope.typeModel);
		
		// get partial
		switch(value){
			case 'MINPURCHASED':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchased.html";
				break;
			case 'MINPURCHASEP':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchasep.html";
				break;
			case 'BXGX':
				$scope.skuDetailsPartialPath = "partials/sku-bxgx.html";
				break;
			case 'BUNDLE':
				$scope.skuDetailsPartialPath = "partials/sku-bundle.html";
				break;
		};
	};

	//locations
	$scope.offer.locations = [{}];

	// get location set name and location table data
	$scope.location = {};
	$scope.location = {accountid: account_id};
	master_locations = $scope.offer.locations;
	
	$scope.form = angular.copy(master_locations);
	
	$scope.isSaveDisabled = function() {
		if ($scope.locationsForm.$dirty && $scope.locationsForm.$invalid) {
			return true;
		}
		else if ($scope.locationsForm.$pristine) {
			return true;
		}
		else {
			return false;
		}
	};
	
	$scope.locationNameRequired = function() {
		if ($scope.showLocations == false) {
			for (var i = 0; i < $scope.offer.locations.length; i++) {
				if (typeof $scope.offer.locations[i].street != 'undefined') {
					return true;
				}
			}
		}
	};
	
	$scope.removeLocations = function () {
		$scope.offer.selectedLocations = '';
		$scope.location.location_bundle_name = '';
		$scope.location.location_bundle_id = '';
		$scope.locationsForm.$dirty = false;
		$scope.locationsForm.$invalid = true;
		$scope.locationsForm.location_bundle_name.$dirty = false;
		$scope.offer.locations = [{}];
		$scope.groupToPages();
		$scope.currentPage = 0;
	};
	
	$scope.itemsPerPage = 5;
	$scope.pagedItems = [];
	$scope.currentPage = 0;

	$scope.groupToPages = function () {
		$scope.pagedItems = [];
		for (var i = 0; i < $scope.offer.locations.length; i++) {
			if (i % $scope.itemsPerPage === 0) {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.offer.locations[i] ];
			} else {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.offer.locations[i]);
			}
		}
	};

	$scope.groupToPages();
	$scope.range = function (start, end) {
		var ret = [];
		if (!end) {
			end = start;
			start = 0;
		}
		for (var i = start; i < end; i++) {
			ret.push(i);
		}
		return ret;
	};

	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			$scope.currentPage++;
		}
	};

	$scope.setPage = function () {
		$scope.currentPage = this.n;
	};	

	$scope.addLocation = function() {
		$scope.offer.locations.push({});
		$scope.groupToPages();		
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};

	$scope.removeLocation = function(location) {
		$scope.offer.selectedLocations = '';
		var index=$scope.offer.locations.indexOf(location);
		$scope.offer.locations.splice(index, 1);
		if ($scope.offer.locations.length < 1) {
			$scope.offer.locations.push({});
		}
		$scope.groupToPages();
		if ($scope.currentPage > 0) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};
	
	// get saved location sets
	$scope.importSavedLocations = function(id) {
		$scope.thisLocations = [{}];
		var selectedId = [];
		if (selectedId != undefined) {
			for (var t = 0; t < id.length; t++) {
				selectedId.push(id[t]);
				$scope.thisLocations = [];
			}
		}
		else {
			selectedId = [];
		}
		for (var i = 0; i < $scope.profile.accounts.length; i++) {
			if ($scope.profile.accounts[i].account_id === account_id) {
				$scope.thisAccount = $scope.profile.accounts[i];
			}
		}
		for (var j = 0; j < selectedId.length; j++) {
			for (var h = 0; h < $scope.thisAccount.location_info.length; h++) {
				if ($scope.thisAccount.location_info[h].location_bundle_id === selectedId[j]) {
					$scope.thisAccount.locations = $scope.thisAccount.location_info[h].locations;
				}
			}
			angular.forEach($scope.thisAccount.locations,function(item) {
			    $scope.thisLocations.push(item);
			});
		}
		if ($scope.thisLocations.length > 0) {
			$scope.offer.locations = $scope.thisLocations;
			$scope.disable_removeLocation = false;
		}
		$scope.groupToPages();
		$scope.currentPage = 0;
	};
	
	//ibeacons
	$scope.offer.beacons = [{}];

	$scope.beacons = {};
	$scope.beacons = {accountid: account_id};
	master_beacons = $scope.offer.beacons;
	
	$scope.beaconsform = angular.copy(master_beacons);
	
	$scope.beaconsPerPage = 5;
	$scope.pagedBeacons = [];
	$scope.currentBeaconPage = 0;

	$scope.groupBeaconsToPages = function () {
		$scope.pagedBeacons = [];
		for (var i = 0; i < $scope.offer.beacons.length; i++) {
			if (i % $scope.beaconsPerPage === 0) {
				$scope.pagedBeacons[Math.floor(i / $scope.beaconsPerPage)] = [ $scope.offer.beacons[i] ];
			} else {
				$scope.pagedBeacons[Math.floor(i / $scope.beaconsPerPage)].push($scope.offer.beacons[i]);
			}
		}
	};

	$scope.groupBeaconsToPages();
	
	$scope.prevBeaconPage = function () {
		if ($scope.currentBeaconPage > 0) {
			$scope.currentBeaconPage--;
		}
	};

	$scope.nextBeaconPage = function () {
		if ($scope.currentBeaconPage < $scope.pagedBeacons.length - 1) {
			$scope.currentBeaconPage++;
		}
	};

	$scope.setBeaconPage = function () {
		$scope.currentBeaconPage = this.n;
	};
	
	$scope.addBeacon = function() {
		$scope.offer.beacons.push({});
		$scope.groupBeaconsToPages();		
		if ($scope.currentBeaconPage < $scope.pagedBeacons.length - 1) {
			var page = $scope.pagedBeacons.length - 1;
			$scope.currentBeaconPage = page;
		}
	};

	$scope.removeBeacon = function(beacon) {
		var index=$scope.offer.beacons.indexOf(beacon);		
		$scope.offer.beacons.splice(index, 1);
		if ($scope.offer.beacons.length < 1) {
			$scope.offer.beacons.push({});
		}
		$scope.groupBeaconsToPages();
		if ($scope.currentBeaconPage > 0) {
			var page = $scope.pagedBeacons.length - 1;
			$scope.currentBeaconPage = page;
		}
	};
	
	$scope.previewImage = function() {
		$scope.selectedImage = {
			val: $scope.uploadReturn.successData.fullUrl
		};
		$scope.launch('preview-image');
	};
	
	$scope.launch = function(which){
		switch(which){
			// Upload Locations CSV
			case 'upload-csv':
				var dlg = dialogs.create('/dialogs/upload-csv.html','uploadCSVCtrl',{},{keyboard: true, backdrop: true});
				dlg.result.then(function(locations){
					$scope.offer.locations = locations;
					$scope.groupToPages();
				},function(locations){
					$scope.offer.locations = '';
				});
				break;
			// preview image
			case 'preview-image':
				var dlg = dialogs.create('/dialogs/preview-offer-image.html','previewImageCtrl',$scope.selectedImage,{keyboard: true, backdrop: true});
				break;
			// preview offer
			case 'preview-offer':
				var dlg = dialogs.create('/dialogs/open-preview.html','previewOfferCtrl',$scope.previewLink,{keyboard: true, backdrop: true});
				break;
		};
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};

	//upload image
	$scope.uploadLayer = function(e, data, process) {
		return $scope.uploadReturn = uploadService.process(e, data, process);
	};
	return $scope.uploadReturn = uploadService.initialize();
});

okd.controller('editOfferCtrl', function editOfferCtrl($scope, $rootScope, $routeParams, okdService, uploadService, $location, $timeout, $filter, $log, toaster, dialogs) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$scope.setDisplayed = function(displayed) {
		$scope.isDisplayed = displayed;
	};
	$rootScope.contentLoaded = false;
	var offer_id = $routeParams.offer_id;
	var account_id = $routeParams.account_id;

	function refresh(){
		$rootScope.setLoading(true);
		okdService.getOffer(account_id, offer_id).then(function(data){
			$scope.setLoading(true);
			if(data){
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$scope.profile = data.response;
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						$scope.account = $scope.profile.accounts[i];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;
						$scope.account.is_sku == true ? $scope.account.showOfferType = true : $scope.account.showOfferType = false;
					}
				}
				else {
					$rootScope.setLoading(false);
					$location.path("/home");
				}
			}

			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					if ($scope.profile.accounts[i].account_id === account_id) {
						$scope.account = $scope.profile.accounts[i];
						for (var j = 0; j < $scope.account.offer_details.length; j++) {
							if ($scope.account.offer_details[j].offer_id === offer_id) {
								$scope.offer = $scope.account.offer_details[j];
								
								$scope.account_name = $scope.account.account_name;
								$scope.methods = $scope.account.payment_info;
								selectPaymentMethod();
								$scope.channels = $scope.account.channel_info;
								for (var k = 0; k < $scope.offer.channel_info.length; k++) {
									$scope.offer.channel = $scope.offer.channel_info[k].channel_id;
									$scope.network_handle = $scope.offer.channel_info[k].network_handle;
									$scope.channel_url = $scope.offer.channel_info[k].url;
									$scope.network_type = $scope.offer.channel_info[k].network_type;
								}
								$scope.locations = $scope.account.location_info;
								$scope.accountID = $scope.account.account_id;
								$scope.offer.offerdates = {startDate: moment($scope.offer.start_ts), endDate: moment($scope.offer.expiry_ts)};

								// account state
								$scope.account.is_approver_required == true ? $scope.approverRequired = true : $scope.approverRequired = false;
								
								
								
								// approvers
								if ($scope.approverRequired == true) {
									$scope.approverPartialPath = "partials/approver-for-create-offer.html";
									$scope.approversList = $scope.account.approvers;								
								}

								// type
								$scope.typeModel = $scope.offer.offer_type;
								if($scope.offer.discount_info) {
									$scope.skuModel = $scope.offer.discount_info.type;
									$scope.orgSku = $scope.offer.discount_info.type;
								}
								
								if($scope.typeModel=='sku') {
									if($scope.skuModel == 'BUNDLE') {
										for (var s = 0; s < $scope.offer.discount_info.buy_bundle.length; s++) {
											$scope.offer.buy_quantity = $scope.offer.discount_info.buy_bundle[0].buy_quantity;
											$scope.offer.buy_code = $scope.offer.discount_info.buy_bundle[0].buy_code;
											$scope.offer.get_quantity = $scope.offer.discount_info.buy_bundle[1].buy_quantity;
											$scope.offer.get_code = $scope.offer.discount_info.buy_bundle[1].buy_code;
										}
										$scope.offer.get_amount = $scope.offer.discount_info.get_amount;
									}
									else {
										$scope.offer.buy_amount = $scope.offer.discount_info.buy_amount;
										$scope.offer.buy_code = $scope.offer.discount_info.buy_code;
										$scope.offer.get_amount = $scope.offer.discount_info.get_amount;
										$scope.offer.get_percentage = $scope.offer.discount_info.get_percentage;
										$scope.offer.buy_quantity = $scope.offer.discount_info.buy_quantity;
										$scope.offer.get_quantity = $scope.offer.discount_info.get_quantity;
									}
								}
								// if no sku tracking type, give it a default
								if(!$scope.skuModel){
									$scope.skuModel = "MINPURCHASED";
								}
								$scope.currentSkuSelected();

								//channels						
								$scope.distModel = $scope.network_type;
								$scope.currentChannel();

								$scope.fbChannels = [];
								for (var a = 0; a < $scope.channels.length; a++) {
									if ($scope.channels[a].network_type == "Facebook" && $scope.channels[a].status == "ACTIVE") {
										$scope.fbChannels.push($scope.channels[a]);
									}
								}
								$scope.fbChannels.length == 0 ? $scope.disableFBSelect = true : $scope.disableFBSelect = false

								$scope.ttChannels = [];
								for (var b = 0; b < $scope.channels.length; b++) {
									if ($scope.channels[b].network_type == "Twitter" && $scope.channels[b].status == "ACTIVE") {
										$scope.ttChannels.push($scope.channels[b]);
									}
								}
								$scope.ttChannels.length == 0 ? $scope.disableTTSelect = true : $scope.disableTTSelect = false

								// saved locations selector
								$scope.offer.selectedLocations = '';
								
								// current locations
								$scope.currentLocations = $scope.offer.locations;
								$scope.groupToPages();
								
								if ($scope.offer.locations.length < 1) {
									$scope.offer.selectedLocations = '';
									$scope.location.location_bundle_name = '';
									$scope.location.location_bundle_id = '';
									$scope.locationsForm.$dirty = false;
									$scope.locationsForm.$invalid = true;
									$scope.locationsForm.location_bundle_name.$dirty = false;
									$scope.offer.locations = [{}];
									$scope.groupToPages();
								}
								else if ($scope.locations.length > 0) {
									$timeout(function () { 
										$scope.locationsForm.$dirty = true;
										$scope.locationsForm.$invalid = false;
										$scope.location.location_bundle_name = 'test';
										$scope.locationsForm.location_bundle_name.$dirty = true;
									},0);

									$scope.groupToPages();
								}

								// locations status
								if ($scope.locations.length > 0) {
									$scope.showLocations = true;
									$scope.saveImportedLocations = false;
								}
								else {
									$scope.showLocations = false;
									$scope.saveImportedLocations = true;
								}

								// determine state based on start date
								var now = moment().format('YYYY-MM-DD HH:mm');
								var start = moment($scope.offer.start_ts).format('YYYY-MM-DD HH:mm');

								if ($scope.offer.status=="RUNNING") {
									$scope.disable_offertype = true;
									if (moment(now).isBefore(start)) {
										$scope.running = false;
										$scope.imagePartialPath = "partials/dropzone-offer.html";
										$('.calendar.left').removeClass('disabled').css('display', 'block');
									}
									else {
										$scope.running = true;
										$scope.imagePartialPath = "partials/image-offer.html";
										$('.calendar.left').addClass('disabled').css('display', 'none');
									}
								}

								if ($scope.offer.status=="APPROVED") {
									$scope.disable_offertype = true;
									if (moment(now).isBefore(start)) {
										$scope.approved = false;
										$scope.completed = false;
										$scope.imagePartialPath = "partials/dropzone-offer.html";
									}
									else {
										$scope.approved = true;
										$scope.completed = true;
										$scope.imagePartialPath = "partials/image-offer.html";
									}
								}

								if ($scope.offer.status=="ARCHIVED" || $scope.offer.status=="COMPLETED") {
									$scope.completed = true;
									$scope.disable_offertype = true;
									$scope.imagePartialPath = "partials/image-offer.html";
								}

								if ($scope.offer.status=="PENDING") {
									$scope.imagePartialPath = "partials/dropzone-offer.html";
								}

								if ($scope.offer.status=="DRAFT") {
									$scope.draft = true;
									$scope.imagePartialPath = "partials/dropzone-offer.html";
								}

								// begin multi-select for recipients
								$scope.offer.recipients = [];
								// get current recipients for direct offers to filter recipientList
								$scope.selectedRecipients = [];
								if ($scope.offer.recipients_info) {
									for (var t = 0; t < $scope.offer.recipients_info.length; t++) {
										$scope.selectedRecipients.push($scope.offer.recipients_info[t].id);
									}
								}
								var selectRecipients = function() {
									$scope.offer.recipients = _.filter($scope.recipientsList, function(item) {
										return _.contains($scope.selectedRecipients, item.id);
									});
								}
								$scope.recipientsList = $scope.account.recipients;
								selectRecipients();
								// end multi-select for recipients

								// title treatment for direct offers
								if ($scope.network_type == "DIRECT") {
									$scope.recipients = $scope.offer.recipients_info;
									for (var s = 0; s < $scope.recipients.length; s++) {
										if ($scope.recipients.length == 1) {
											$scope.offer.offerTitle = 'Direct: ' + $scope.recipients[s].name;
										}
										else {
											$scope.offer.offerTitle = 'Direct: Multiple';
										}
									}
								}
								else {
									$scope.offer.offerTitle = $scope.offer.title;
								}

								// paginate ibeacons
								if ($scope.offer.ibeacon_info.length < 1) {
									$scope.offer.beacons = [{}];
									$scope.groupBeaconsToPages();								
								}
								else {
									$scope.offer.beacons = $scope.offer.ibeacon_info;
									$scope.groupBeaconsToPages();
								}
								
								// direct total budget
								$scope.$watch('[offer.value, offer.recipients]', function () { 
									$scope.offer.directBudget = ($scope.offer.value*$scope.offer.recipients.length) || 0;
								}, true);
								
								$scope.tempcode = $scope.offer.code;
							}
						}
					}
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
	};

	refresh();
	
	$rootScope.$on('loadingTrue', function (e, call) {
		$scope.setLoading(true);
	});
	
	$rootScope.$on('loadingFalse', function (e, call) {
		$scope.setLoading(false);
	});
	
	// if pre-edited offer is sku, there should not be a payment method on the model
	// if pre-edited offer is standard, there should be a payment method on the model
	// when switching between standard and sku, determine if there is already a payment method on model
	// if no method on model, and if there is only one payment method for the account, pre-select it
	function selectPaymentMethod(){
		if ($scope.offer.payment_info != null && $scope.offer.payment_info !== undefined) {
			$scope.offer.method = $scope.offer.payment_info;
		}
		else {
			if ($scope.methods.length == 1) {
				for (var p = 0; p < $scope.methods.length; p++) {
					$scope.method = $scope.methods[p];
				}
				$scope.offer.method = $scope.method.payment_id;
			}
		}
	};

	// type selection
	// standard || sku
	$scope.distributionSelectorPartialPath = "partials/distribution-selector.html";
	$scope.newTypeSelected = function(value) {
		if (value === 'standard') {
			if ($scope.distModel === 'URL' || $scope.distModel === 'Facebook' || $scope.distModel === 'Twitter') {
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
			}
			else if ($scope.distModel === 'DIRECT') {
				$scope.valuePartialPath = "partials/value-direct-for-edit-offer.html";
			}
			formResets($scope.distModel, $scope.typeModel);
		}
		else if (value === 'sku') {
			$scope.valuePartialPath = "partials/value-for-sku-offer.html";
			formResets($scope.distModel, $scope.typeModel);
		}
	};
	// end type selection
	
	// distribution selection
	// URL || Facebook || Twitter || Direct
	$scope.newChannelSelected = function(value) {
		if($scope.typeModel === 'sku') {
			$scope.valuePartialPath = "partials/value-for-sku-offer.html";
			formResets(value, $scope.typeModel);
		}
		if($scope.typeModel === 'standard') {
			if (value === 'URL' || value === 'Facebook' || value === 'Twitter') {
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
			}
			else if (value === 'DIRECT') {
				$scope.valuePartialPath = "partials/value-direct-for-edit-offer.html";
			}
			formResets(value, $scope.typeModel);
		}
	};
	// end distribution selection	

	// selects partials based on current values
	$scope.currentChannel = function(value) {
		if($scope.typeModel === 'sku') {
			$scope.valuePartialPath = "partials/value-for-sku-offer.html";
			if ($scope.distModel === 'URL') {
				$scope.paymentTypePartialPath = "partials/channel-url-for-edit-offer.html";
				$scope.showPreview = true;				
			}
			else if ($scope.distModel === 'Facebook') {
				$scope.paymentTypePartialPath = "partials/channel-fb-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'Twitter') {
				$scope.paymentTypePartialPath = "partials/channel-tt-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'DIRECT') {
				$scope.paymentTypePartialPath = "partials/channel-direct-for-edit-offer.html";
				$scope.showPreview = false;
			}
		}
		else {
			if ($scope.distModel === 'URL') {
				$scope.paymentTypePartialPath = "partials/channel-url-for-edit-offer.html";
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'Facebook') {
				$scope.paymentTypePartialPath = "partials/channel-fb-for-edit-offer.html";
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'Twitter') {
				$scope.paymentTypePartialPath = "partials/channel-tt-for-edit-offer.html";
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'DIRECT') {
				$scope.paymentTypePartialPath = "partials/channel-direct-for-edit-offer.html";
				$scope.valuePartialPath = "partials/value-direct-for-edit-offer.html";
				$scope.showPreview = false;
			}
		}
	}
	
	// sku tracking details section
	$scope.newSkuSelected = function(value) {
		console.log($scope.orgSku);
		$scope.skuModel = value;

		// run formResets based on selections
		formResets($scope.distModel, $scope.typeModel);

		$scope.skuDetailsPartialPath = "partials/sku-minpurchased.html";

		// get partial
		switch(value){
			case 'MINPURCHASED':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchased.html";
				$scope.offer.get_percentage = '';
				$scope.offer.buy_quantity = '';
				$scope.offer.get_quantity = '';
				$scope.offer.get_code = '';
				if($scope.orgSku == value) {
					$scope.offer.buy_amount = $scope.offer.discount_info.buy_amount;
					$scope.offer.buy_code = $scope.offer.discount_info.buy_code;
					$scope.offer.get_amount = $scope.offer.discount_info.get_amount;
				}
				else {
					$scope.offer.buy_amount = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_amount = '';	
				}
				break;
			case 'MINPURCHASEP':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchasep.html";
				$scope.offer.get_amount = '';
				$scope.offer.buy_quantity = '';
				$scope.offer.get_quantity = '';
				$scope.offer.get_code = '';	
				if($scope.orgSku == value) {
					$scope.offer.buy_amount = $scope.offer.discount_info.buy_amount;
					$scope.offer.buy_code = $scope.offer.discount_info.buy_code;
					$scope.offer.get_percentage = $scope.offer.discount_info.get_percentage;
				}
				else {
					$scope.offer.buy_amount = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_percentage = '';
				}
				break;
			case 'BXGX':
				$scope.skuDetailsPartialPath = "partials/sku-bxgx.html";
				$scope.offer.buy_amount = '';
				$scope.offer.get_amount = '';
				$scope.offer.get_percentage = '';
				$scope.offer.get_code = '';
				if($scope.orgSku == value) {
					$scope.offer.buy_quantity = $scope.offer.discount_info.buy_quantity;
					$scope.offer.get_quantity = $scope.offer.discount_info.get_quantity;
					$scope.offer.buy_code = $scope.offer.discount_info.buy_code;			
				}
				else {					
					$scope.offer.buy_quantity = '';
					$scope.offer.get_quantity = '';
					$scope.offer.buy_code = '';
				}
				break;
			case 'BUNDLE':
				$scope.skuDetailsPartialPath = "partials/sku-bundle.html";
				$scope.offer.get_percentage = '';				
				$scope.offer.buy_amount = '';
				if($scope.orgSku == value) {
					for (var s = 0; s < $scope.offer.discount_info.buy_bundle.length; s++) {
						$scope.offer.buy_quantity = $scope.offer.discount_info.buy_bundle[0].buy_quantity;
						$scope.offer.buy_code = $scope.offer.discount_info.buy_bundle[0].buy_code;
						$scope.offer.get_quantity = $scope.offer.discount_info.buy_bundle[1].buy_quantity;
						$scope.offer.get_code = $scope.offer.discount_info.buy_bundle[1].buy_code;
					}
					$scope.offer.get_amount = $scope.offer.discount_info.get_amount;			
				}
				else {
					$scope.offer.buy_quantity = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_quantity = '';
					$scope.offer.get_code = '';
					$scope.offer.get_amount = '';			
				}
				break;
		};
	};

	// selects partials based on current values
	$scope.currentSkuSelected = function() {
		switch($scope.skuModel){
			case 'MINPURCHASED':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchased.html";
				break;
			case 'MINPURCHASEP':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchasep.html";
				break;
			case 'BXGX':
				$scope.skuDetailsPartialPath = "partials/sku-bxgx.html";
				break;
			case 'BUNDLE':
				$scope.skuDetailsPartialPath = "partials/sku-bundle.html";
				break;
		};
	}
	//end currentSkuSelected

	// form resets
	// requires $scope.distModel (offer distribution selected) 
	// requires $scope.typeModel (offer type selected)
	// clears some preview error states
	// sets channel partial
	function formResets(distModel, typeModel) {
		switch(distModel){
			case 'URL':
				$scope.distModel = 'URL';
				$scope.paymentTypePartialPath = "partials/channel-url-for-edit-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.method = '';
					//$scope.offer.buy_amount = '';
					//$scope.offer.buy_code = '';
					//$scope.offer.get_amount = '';
					//$scope.offer.get_percentage = '';
					//$scope.offer.buy_quantity = '';
					//$scope.offer.get_quantity = '';
					//$scope.offer.get_code = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				break;
			case 'Facebook':
				$scope.distModel = 'Facebook';
				$scope.paymentTypePartialPath = "partials/channel-fb-for-edit-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
						$scope.offerform.channel.$dirty = false;
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.method = '';
					//$scope.offer.buy_amount = '';
					//$scope.offer.buy_code = '';
					//$scope.offer.get_amount = '';
					//$scope.offer.get_percentage = '';
					//$scope.offer.buy_quantity = '';
					//$scope.offer.get_quantity = '';
					//$scope.offer.get_code = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.channel.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				// select if only one fbChannel
				if ($scope.fbChannels.length == 1) {
					for (var i = 0; i < $scope.fbChannels.length; i++) {
						$scope.offer.channel = $scope.fbChannels[i].channel_id;
					}
				}
				break;
			case 'Twitter':
				$scope.distModel = 'Twitter';
				$scope.paymentTypePartialPath = "partials/channel-tt-for-edit-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
						$scope.offerform.channel.$dirty = false;
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.method = '';
					//$scope.offer.buy_amount = '';
					//$scope.offer.buy_code = '';
					//$scope.offer.get_amount = '';
					//$scope.offer.get_percentage = '';
					//$scope.offer.buy_quantity = '';
					//$scope.offer.get_quantity = '';
					//$scope.offer.get_code = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.channel.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				// select if only one ttChannel
				if ($scope.ttChannels.length == 1) {
					for (var i = 0; i < $scope.ttChannels.length; i++) {
						$scope.offer.channel = $scope.ttChannels[i].channel_id;
					}
				}
				break;
			case 'DIRECT':
				$scope.distModel = 'DIRECT';
				$scope.paymentTypePartialPath = "partials/channel-direct-for-edit-offer.html";
				$scope.offer.channel = '';
				$scope.offer.title = '';
				$scope.offer.total = '';
				$scope.offer.value = '';
				$scope.showPreview = false;
				$scope.previewError = false;
				selectPaymentMethod();
				$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
				if(typeModel=='sku') {
					$scope.offer.value = '';
					$scope.offer.method = '';
					//$scope.offer.buy_amount = '';
					//$scope.offer.buy_code = '';
					//$scope.offer.get_amount = '';
					//$scope.offer.get_percentage = '';
					//$scope.offer.buy_quantity = '';
					//$scope.offer.get_quantity = '';
					//$scope.offer.get_code = '';
				}
				$scope.offerform.$setPristine(true);
				break;		
		};
	};
	// end form resets
	
	function clearAllPreview() {
		switch($scope.skuModel){
			case 'MINPURCHASED':
				$timeout(function () {
					$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
				}, 500);
				break;
			case 'MINPURCHASEP':
				$timeout(function () {
					$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
				}, 500);
				break;
			case 'BXGX':
				$timeout(function () {
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
				}, 500);
				break;
			case 'BUNDLE':
				$timeout(function () {
					$scope.offerform.valueForm.buy_quantity.$setValidity("preview", true);
					$scope.offerform.valueForm.buy_code.$setValidity("preview", true);
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
					$scope.offerform.valueForm.get_code.$setValidity("preview", true);
					$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
				}, 500);
				break;
		};	
	}
	// end clearAllPreview

	//publish
	$scope.offer = {};
	$scope.offer = {offer_id: $routeParams.offer_id, account_id: account_id};
	$scope.modal = {};
	$scope.submitted = false;
	
	$scope.offer_id = $routeParams.offer_id;
	$scope.accountid = $routeParams.account_id;
	
	$scope.$watch('[offer.value, offer.total]', function () {
		var tot = Math.floor($scope.offer.total/$scope.offer.value);
		if (tot != null && tot !== undefined && tot !== Infinity) {
			$scope.totalValue = tot || 0;
		}
	}, true);
	
	$scope.cancel = function() {
		//$location.path("/all-offers");
		$location.path("/offer-details/account/"+$scope.accountid+"/offer/"+$scope.offer_id);
	};

	$scope.clearCode = function () {
		if($scope.offer.code_check == false) {
			$scope.offer.code='';
		}
		else if($scope.offer.code_check == true) {
			$scope.offer.code=$scope.tempcode;
			$timeout(function () {
				$('#code').focus();
			}, 100);
		}
	};
	
	// listen for the file selected event
	$scope.$on("fileSelected", function (event, args) {
		$scope.$apply(function () {            
			$scope.offer.file = args.file;
		});
	});

	$scope.ngObjFixHack = function(ngObj) {
	    var output;
	    output = angular.toJson(ngObj);
	    output = angular.fromJson(output);
	    return output;
	};

	function populateOfferData(actionType){
		var offerInfo = new Object();
		offerInfo.action_type = actionType;
		offerInfo.offer_id = $scope.offer_id;
		offerInfo.title = $scope.offer.title;
		offerInfo.value = $scope.offer.value;
		offerInfo.use_balance = $scope.offer.use_balance;
		offerInfo.enable_passbook = $scope.offer.enable_passbook;
		offerInfo.count = Math.floor($scope.offer.total/$scope.offer.value);
		offerInfo.total = $scope.offer.total;
		offerInfo.recipients = $scope.offer.recipients;
		offerInfo.payment_id = $scope.offer.method;
		offerInfo.account_id = $routeParams.account_id;
		$scope.approverRequired ? offerInfo.approvers = $scope.offer.approvers_info : offerInfo.approvers = '';
		//offerInfo.locations = $scope.ngObjFixHack($scope.offer.locations);
		//offerInfo.locations = _.uniq($scope.offer.locations);
		offerInfo.locations = $scope.offer.locations;
		$scope.distModel=="URL" || $scope.distModel=="DIRECT" ? offerInfo.channel_id = $scope.distModel : offerInfo.channel_id = offerInfo.channel_id = $scope.offer.channel
		offerInfo.post_text = $scope.offer.desc;
		if(typeof($scope.uploadReturn.successData) != "undefined") {
			offerInfo.image_name = $scope.uploadReturn.successData.name;
		}
		else {
			offerInfo.image_name = $scope.offer.image_name;
		}

		//date related info	
		offerInfo.start_ts = moment($scope.offer.offerdates.startDate).format();
		offerInfo.expiry_ts = moment($scope.offer.offerdates.endDate).format();
		
		//offer code
		if ($scope.offer.code){
			offerInfo.code = $scope.offer.code.toUpperCase();
			offerInfo.code_check = $scope.offer.code_check;
		}
		$scope.offer.instructions ? offerInfo.instructions = $scope.offer.instructions : offerInfo.instructions = '';
		offerInfo.ibeacons = $scope.offer.beacons;
		offerInfo.offer_type = $scope.typeModel;
		
		// discount info
		if($scope.typeModel=='sku') {
			offerInfo.discount_type = $scope.skuModel;
			if(offerInfo.discount_type == 'BUNDLE') {
				$scope.offer.buy_bundle = [];
				var buyinfo = {
				    buy_quantity: parseInt($scope.offer.buy_quantity),
				    buy_code: $scope.offer.buy_code
				};
				$scope.offer.buy_bundle.push(buyinfo);

				var getinfo = {
				    buy_quantity: $scope.offer.get_quantity,
				    buy_code: $scope.offer.get_code
				};				
				$scope.offer.buy_bundle.push(getinfo);
				offerInfo.discount_buy_bundle = $scope.offer.buy_bundle;
				offerInfo.discount_get_amount = $scope.offer.get_amount;
			}
			else {
				offerInfo.discount_buy_amount = $scope.offer.buy_amount;
				offerInfo.discount_buy_code = $scope.offer.buy_code;
				offerInfo.discount_get_amount = $scope.offer.get_amount;
				offerInfo.discount_get_percentage = $scope.offer.get_percentage;
				offerInfo.discount_buy_quantity = $scope.offer.buy_quantity;
				offerInfo.discount_get_quantity = $scope.offer.get_quantity;
			}
		}
		console.log(offerInfo);
		return offerInfo;
	};
	
	// preview offer
	$scope.previewOffer = function() {
		$scope.previewError = false;
		
		if($scope.typeModel=='standard') {
			if(!$scope.offer.value) {
				$scope.offerform.valueForm.value.$setValidity("preview", false);
				$scope.$watch('offer.value', function () {
					if ($scope.offer.value) {
						$scope.offerform.valueForm.value.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}

			if(!$scope.offer.desc) {
				$scope.offerform.createForm.offerDesc.$setValidity("preview", false);
				$scope.$watch('offer.desc', function () {
					if ($scope.offer.desc) {
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}

			if(!$scope.offer.title) {
				$scope.offerform.title.$setValidity("preview", false);
				$scope.$watch('offer.title', function () {
					if ($scope.offer.title) {
						$scope.offerform.title.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}

			if(!$scope.offer.total) {
				$scope.offerform.valueForm.total.$setValidity("preview", false);
				$scope.$watch('offer.total', function () {
					if ($scope.offer.total) {
						$scope.offerform.valueForm.total.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}

			if($scope.distModel=="Facebook" || $scope.distModel=="Twitter") {
				if(!$scope.offer.channel) {
					$scope.offerform.channel.$setValidity("preview", false);
					$scope.$watch('offer.channel', function () {
						if ($scope.offer.channel) {
							$scope.offerform.channel.$setValidity("preview", true);
						}
					}, true);
					$scope.previewError = true;
				}
			}
		}
		
		else if ($scope.typeModel=='sku') {
			if(!$scope.offer.desc) {
				$scope.offerform.createForm.offerDesc.$setValidity("preview", false);
				$scope.$watch('offer.desc', function () {
					if ($scope.offer.desc) {
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}
			if(!$scope.offer.title) {
				$scope.offerform.title.$setValidity("preview", false);
				$scope.$watch('offer.title', function () {
					if ($scope.offer.title) {
						$scope.offerform.title.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}		
		
			if($scope.skuModel=='MINPURCHASED') {
				if($scope.distModel=='URL'){

					if(!$scope.offer.get_amount) {
						$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
						$scope.$watch('offer.get_amount', function () {
							if ($scope.offer.get_amount) {
								$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$timeout(function () {
									$scope.offerform.channel.$setValidity("preview", true);
								}, 500);
							}
						}, true);
						$scope.previewError = true;
					}
					if(!$scope.offer.get_amount) {
						$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
						$scope.$watch('offer.get_amount', function () {
							if ($scope.offer.get_amount) {
								$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
			}
			else if($scope.skuModel=='MINPURCHASEP') {
				if($scope.distModel=='URL'){
					if(!$scope.offer.get_percentage) {
						$scope.offerform.valueForm.get_percentage.$setValidity("preview", false);
						$scope.$watch('offer.get_percentage', function () {
							if ($scope.offer.get_percentage) {
								$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$scope.offerform.channel.$setValidity("preview", true);
							}
						}, true);
						$scope.previewError = true;
					}
					if(!$scope.offer.get_percentage) {
						$scope.offerform.valueForm.get_percentage.$setValidity("preview", false);
						$scope.$watch('offer.get_percentage', function () {
							if ($scope.offer.get_percentage) {
								$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
			}
			else if ($scope.skuModel=='BXGX') {
				if($scope.distModel=='URL'){
					if(!$scope.offer.get_quantity) {
						$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
						$scope.$watch('offer.get_quantity', function () {
							if ($scope.offer.get_quantity) {
								$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.get_quantity) {
						$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
						$scope.$watch('offer.get_quantity', function () {
							if ($scope.offer.get_quantity) {
								$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$scope.offerform.channel.$setValidity("preview", true);
							}
						}, true);
						$scope.previewError = true;
					}
				}
			}
			else if($scope.skuModel=='BUNDLE') {
				if(!$scope.offer.buy_quantity) {
					$scope.offerform.valueForm.buy_quantity.$setValidity("preview", false);
					$scope.$watch('offer.buy_quantity', function () {
						if ($scope.offer.buy_quantity) {
							$scope.offerform.valueForm.buy_quantity.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.buy_code) {
					$scope.offerform.valueForm.buy_code.$setValidity("preview", false);
					$scope.$watch('offer.buy_code', function () {
						if ($scope.offer.buy_code) {
							$scope.offerform.valueForm.buy_code.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_quantity) {
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
					$scope.$watch('offer.get_quantity', function () {
						if ($scope.offer.get_quantity) {
							$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_code) {
					$scope.offerform.valueForm.get_code.$setValidity("preview", false);
					$scope.$watch('offer.get_code', function () {
						if ($scope.offer.get_code) {
							$scope.offerform.valueForm.get_code.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_amount) {
					$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
					$scope.$watch('offer.get_amount', function () {
						if ($scope.offer.get_amount) {
							$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}
				
				if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$scope.offerform.channel.$setValidity("preview", true);
							}
						}, true);
						$scope.previewError = true;
					}				
				}
			}
		}
		
		if ($scope.previewError === true) {
			toaster.pop('warning', "Required fields missing", "Please check for any required fields you may have missed to preview this offer.");
		}
		else {
			submitPreview();
		}		
	
		function submitPreview(){
			$scope.setLoading(true);
			okdService.createPreview2(populateOfferData('Preview')).then(function(data){
				if(data.meta.code==200){
					$scope.setLoading(false);					
					$scope.previewLink = {
						val: data.response.preview_url
					};
					$scope.launch('preview-offer');
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			},
			function(errorMessage){
				$scope.setLoading(false);
				$scope.error=errorMessage;
				toaster.pop('error', "Failed to preview offer.", "An error occurred while previewing the offer. Please try again. If the problem persists, please contact our Support.");
			});
		}
	};

	// save offer
	$scope.submitOffer = function(actionType) {
		$scope.approversRequired = '';
		actionType=='Draft' ? $scope.approversRequired = 'false' : $scope.approversRequired = 'true';
		$timeout(function () {
			if ($scope.offerform.$valid) {
				$scope.setLoading(true);

				if ($scope.saveImportedLocations == true) {
					var locationInfo = new Object();
					locationInfo.location_bundle_name = $scope.location.location_bundle_name;
					locationInfo.locations = $scope.offer.locations;
					
					var beaconInfo = new Object();
					beaconInfo.beacons = $scope.offer.beacons;

					if (locationInfo.location_bundle_name) {
						okdService.createLocations($scope.location.accountid, locationInfo).then(function(data){
							$scope.savedLocations = data.response;
							if(data.meta.code==200){
								$scope.locationId = $scope.savedLocations.location_bundle_id;
								okdService.createOffer(populateOfferData(actionType)).then(function(data){
									if(data.meta.code==200){
										$scope.setLoading(false);
										$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
									}
									else {
										$scope.setLoading(false);
										toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
									}
								},
								function(errorMessage){
									$scope.setLoading(false);
									$scope.error=errorMessage;
									toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
								});
							}
							else {
								$scope.setLoading(false);
								toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
							}
						},
						function(errorMessage){
							$scope.setLoading(false);
							$scope.error=errorMessage;
							toaster.pop('error', "Unable to save location set.", "An error occurred while saving the location set. Please try again. If the problem persists, please contact our Support.");
						});
					}
					else {
						okdService.createOffer(populateOfferData(actionType)).then(function(data){
							if(data.meta.code==200){
								$scope.setLoading(false);
								$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
							}
							else {
								$scope.setLoading(false);
								toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
							}
						},
						function(errorMessage){
							$scope.setLoading(false);
							$scope.error=errorMessage;
							toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
						});						
					}
				}
				else {
					okdService.createOffer(populateOfferData(actionType)).then(function(data){
						if(data.meta.code==200){
							$scope.setLoading(false);
							$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
						}
						else {
							$scope.setLoading(false);
							toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
						}
					},
					function(errorMessage){
						$scope.setLoading(false);
						$scope.error=errorMessage;
						toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
					});
				}
			} else {
				$scope.setLoading(false);
				$scope.offerform.submitted = true;
				toaster.pop('warning', "Required fields missing", "Please check for any required fields you may have missed.");
			}
			
		}, 100);
	};
	
	$scope.deleteOffer = function() {
		$scope.setLoading(true);
		okdService.createOffer(populateOfferData('delete')).then(function(data){
			if(data.meta.code==200){
				$scope.setLoading(false);
				$timeout(function(){
					$location.path("/all-offers");
				},100);
			}
			else {
				$scope.setLoading(false);
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to delete offer.", " An error occurred while deleting offer. Please try again. If the problem persists, please contact our Support.");
		});		
	};
		
	//locations
	$scope.offer.locations = [{}];

	// get location set name and location table data
	$scope.location = {};
	$scope.location = {accountid: $routeParams.account_id};
	master_locations = $scope.offer.locations;
	$scope.form = angular.copy(master_locations);

	$scope.isSaveDisabled = function() {
		return $scope.locationsForm.$invalid;
	};

	$scope.locationNameRequired = function() {
		if ($scope.showLocations == false) {
			for (var i = 0; i < $scope.offer.locations.length; i++) {
				if (typeof $scope.offer.locations[i].street != 'undefined') {
					return true;
				}
			}
		}
	};
	
	$scope.removeLocations = function () {
		$scope.currentLocations = '';
		$scope.offer.selectedLocations = '';
		$scope.offer.locations = [{}];
		$scope.location.location_bundle_name = '';
		$scope.location.location_bundle_id = '';
		$scope.locationsForm.$dirty = false;
		$scope.locationsForm.$invalid = true;
		$scope.locationsForm.location_bundle_name.$dirty = false;
		$scope.groupToPages();
		$scope.currentPage = 0;
	};
	
	$scope.itemsPerPage = 5;
	$scope.pagedItems = [];
	$scope.currentPage = 0;

	$scope.groupToPages = function () {
		$scope.pagedItems = [];
		for (var i = 0; i < $scope.offer.locations.length; i++) {
			if (i % $scope.itemsPerPage === 0) {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.offer.locations[i] ];
			} else {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.offer.locations[i]);
			}
		}
	};

	$scope.groupToPages();
	$scope.range = function (start, end) {
		var ret = [];
		if (!end) {
			end = start;
			start = 0;
		}
		for (var i = start; i < end; i++) {
			ret.push(i);
		}
		return ret;
	};

	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			$scope.currentPage++;
		}
	};

	$scope.setPage = function () {
		$scope.currentPage = this.n;
	};	

	$scope.addLocation = function() {
		$scope.offer.locations.push({});
		$scope.groupToPages();		
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};
	$scope.removeLocation = function(location) {
		$scope.offer.selectedLocations = '';
		var index=$scope.offer.locations.indexOf(location);		
		$scope.offer.locations.splice(index, 1);
		if ($scope.offer.locations.length < 1) {
			$scope.offer.locations.push({});
		}
		$scope.groupToPages();
		if ($scope.currentPage > 0) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};
	
	// get saved location sets
	$scope.importSavedLocations = function(id) {
		if ($scope.currentLocations.length > 0) {
			$scope.thisLocations = [];
		}
		else {
			$scope.thisLocations = [{}];
		}

		var selectedId = [];
		if (selectedId != undefined) {
			for (var t = 0; t < id.length; t++) {
				selectedId.push(id[t]);
				$scope.thisLocations = [];
			}
		}
		else {
			selectedId = [];
		}

		for (var i = 0; i < $scope.profile.accounts.length; i++) {
			if ($scope.profile.accounts[i].account_id === account_id) {
				$scope.thisAccount = $scope.profile.accounts[i];
			}
		}

		for (var j = 0; j < selectedId.length; j++) {
			for (var h = 0; h < $scope.thisAccount.location_info.length; h++) {
				if ($scope.thisAccount.location_info[h].location_bundle_id === selectedId[j]) {
					$scope.thisAccount.locations = $scope.thisAccount.location_info[h].locations;
				}
			}
			angular.forEach($scope.thisAccount.locations,function(item) {
			    $scope.thisLocations.push(item);
			});
			
			if ($scope.thisAccount.locations.length > 1) {
				$scope.disable_removeLocation = false;
			}
		}

		// add to current locations
		if ($scope.currentLocations.length > 0) {
			angular.forEach($scope.currentLocations,function(item) {
			   $scope.thisLocations.push(item);
			});
		}

		if ($scope.thisLocations.length > 0) {
		
			var uniques = _.map(_.groupBy($scope.thisLocations,function(doc){
				return doc.merchid;
			}),function(grouped){
				return grouped[0];
			});		
			$scope.offer.locations = uniques;
		}
		
		$scope.groupToPages();
		$scope.currentPage = 0;
	};

	//ibeacons
	$scope.offer.beacons = [{}];

	$scope.beacons = {};
	$scope.beacons = {accountid: account_id};
	master_beacons = $scope.offer.beacons;
	
	$scope.beaconsform = angular.copy(master_beacons);

	$scope.beaconsPerPage = 5;
	$scope.pagedBeacons = [];
	$scope.currentBeaconPage = 0;

	$scope.groupBeaconsToPages = function () {
		$scope.pagedBeacons = [];
		for (var i = 0; i < $scope.offer.beacons.length; i++) {
			if (i % $scope.beaconsPerPage === 0) {
				$scope.pagedBeacons[Math.floor(i / $scope.beaconsPerPage)] = [ $scope.offer.beacons[i] ];
			} else {
				$scope.pagedBeacons[Math.floor(i / $scope.beaconsPerPage)].push($scope.offer.beacons[i]);
			}
		}
	};

	$scope.groupBeaconsToPages();
	
	$scope.prevBeaconPage = function () {
		if ($scope.currentBeaconPage > 0) {
			$scope.currentBeaconPage--;
		}
	};

	$scope.nextBeaconPage = function () {
		if ($scope.currentBeaconPage < $scope.pagedBeacons.length - 1) {
			$scope.currentBeaconPage++;
		}
	};

	$scope.setBeaconPage = function () {
		$scope.currentBeaconPage = this.n;
	};
	
	$scope.addBeacon = function() {
		$scope.offer.beacons.push({});
		$scope.groupBeaconsToPages();		
		if ($scope.currentBeaconPage < $scope.pagedBeacons.length - 1) {
			var page = $scope.pagedBeacons.length - 1;
			$scope.currentBeaconPage = page;
		}
	};

	$scope.removeBeacon = function(beacon) {
		var index=$scope.offer.beacons.indexOf(beacon);		
		$scope.offer.beacons.splice(index, 1);
		if ($scope.offer.beacons.length < 1) {
			$scope.offer.beacons.push({});
		}
		$scope.groupBeaconsToPages();
		if ($scope.currentBeaconPage > 0) {
			var page = $scope.pagedBeacons.length - 1;
			$scope.currentBeaconPage = page;
		}
	};
	
	$scope.previewNewImage = function() {
		$scope.selectedImage = {
			val: $scope.uploadReturn.successData.fullUrl
		};
		$scope.launch('preview-new-image');
	};

	$scope.previewExistingImage = function() {
		$scope.selectedImage = {
			val: $scope.offer.image_url
		};
		$scope.launch('preview-existing-image');
	};

	$scope.launch = function(which){
		switch(which){
			// Upload Locations CSV
			case 'upload-csv':
				var dlg = dialogs.create('/dialogs/upload-csv.html','uploadCSVCtrl',{},{keyboard: true, backdrop: true});
				dlg.result.then(function(locations){
					$scope.offer.locations = locations;
					$scope.groupToPages();
				},function(locations){
					$scope.offer.locations = '';
				});
				break;
			// preview new image
			case 'preview-new-image':
				var dlg = dialogs.create('/dialogs/preview-offer-image.html','previewImageCtrl',$scope.selectedImage,{keyboard: true, backdrop: true});
				break;
			// preview existing image
			case 'preview-existing-image':
				var dlg = dialogs.create('/dialogs/preview-offer-image.html','previewImageCtrl',$scope.selectedImage,{keyboard: true, backdrop: true});
				break;
			// preview offer
			case 'preview-offer':
				var dlg = dialogs.create('/dialogs/open-preview.html','previewOfferCtrl',$scope.previewLink,{keyboard: true, backdrop: true});
				break;
		};
	};

	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};

	// upload image
	$scope.uploadLayer = function(e, data, process) {
		return $scope.uploadReturn = uploadService.process(e, data, process);
	};
	return $scope.uploadReturn = uploadService.initialize();
});

okd.controller('copyOfferCtrl', function copyOffer($scope, $rootScope, $routeParams, okdService, uploadService, $location, $timeout, $filter, toaster, dialogs) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$scope.setDisplayed = function(displayed) {
		$scope.isDisplayed = displayed;
	};
	$rootScope.contentLoaded = false;
	var offer_id = $routeParams.offer_id;
	var account_id = $routeParams.account_id;

	function refresh(){
		$rootScope.setLoading(true);
		okdService.getOffer(account_id, offer_id).then(function(data){
			$rootScope.setLoading(true);
			if(data){
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$scope.profile = data.response;
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						$scope.account = $scope.profile.accounts[i];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;
						$scope.account.is_sku == true ? $scope.account.showOfferType = true : $scope.account.showOfferType = false;
					}
				}
				else {
					$rootScope.setLoading(false);
					$scope.profile = data.response;			
					$location.path("/home");
				}
			}

			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					if ($scope.profile.accounts[i].account_id === account_id) {
						$scope.account = $scope.profile.accounts[i];
						for (var j = 0; j < $scope.account.offer_details.length; j++) {
							if ($scope.account.offer_details[j].offer_id === offer_id) {
								$scope.offer = $scope.account.offer_details[j];

								$scope.account = $scope.profile.accounts[i];
								$scope.account_id = $scope.account.account_id;
								$scope.methods = $scope.account.payment_info;
								selectPaymentMethod();
								$scope.channels = $scope.account.channel_info;
								for (var k = 0; k < $scope.offer.channel_info.length; k++) {
									$scope.offer.channel = $scope.offer.channel_info[k].channel_id;
									$scope.offer.network_type = $scope.offer.channel_info[k].network_type;
								}
								$scope.locations = $scope.account.location_info;
								$scope.accountID = $scope.account.account_id;

								// account state
								$scope.account.is_approver_required == true ? $scope.approverRequired = true : $scope.approverRequired = false

								// approvers
								if ($scope.approverRequired == true) {
									$scope.approverPartialPath = "partials/approver-for-create-offer.html";
									$scope.approversList = $scope.account.approvers;
								}

								// type
								$scope.typeModel = $scope.offer.offer_type;
								if($scope.offer.discount_info) {
									$scope.skuModel = $scope.offer.discount_info.type;
									$scope.orgSku = $scope.offer.discount_info.type;
								}
								
								if($scope.typeModel=='sku') {
									if($scope.skuModel == 'BUNDLE') {
										for (var s = 0; s < $scope.offer.discount_info.buy_bundle.length; s++) {
											$scope.offer.buy_quantity = $scope.offer.discount_info.buy_bundle[0].buy_quantity;
											$scope.offer.buy_code = $scope.offer.discount_info.buy_bundle[0].buy_code;
											$scope.offer.get_quantity = $scope.offer.discount_info.buy_bundle[1].buy_quantity;
											$scope.offer.get_code = $scope.offer.discount_info.buy_bundle[1].buy_code;
										}
										$scope.offer.get_amount = $scope.offer.discount_info.get_amount;
									}
									else {
										$scope.offer.buy_amount = $scope.offer.discount_info.buy_amount;
										$scope.offer.buy_code = $scope.offer.discount_info.buy_code;
										$scope.offer.get_amount = $scope.offer.discount_info.get_amount;
										$scope.offer.get_percentage = $scope.offer.discount_info.get_percentage;
										$scope.offer.buy_quantity = $scope.offer.discount_info.buy_quantity;
										$scope.offer.get_quantity = $scope.offer.discount_info.get_quantity;
									}
								}
								// if no sku tracking type, give it a default
								if(!$scope.skuModel){
									$scope.skuModel = "MINPURCHASED";
								}
								$scope.currentSkuSelected();

								// channels
								$scope.distModel = $scope.offer.network_type;
								$scope.currentChannel();

								$scope.fbChannels = [];
								for (var a = 0; a < $scope.channels.length; a++) {
									if ($scope.channels[a].network_type == "Facebook" && $scope.channels[a].status == "ACTIVE") {
										$scope.fbChannels.push($scope.channels[a]);
									}
								}
								$scope.fbChannels.length == 0 ? $scope.disableFBSelect = true : $scope.disableFBSelect = false

								$scope.ttChannels = [];
								for (var b = 0; b < $scope.channels.length; b++) {
									if ($scope.channels[b].network_type == "Twitter" && $scope.channels[b].status == "ACTIVE") {
										$scope.ttChannels.push($scope.channels[b]);
									}
								}
								$scope.ttChannels.length == 0 ? $scope.disableTTSelect = true : $scope.disableTTSelect = false

								// saved locations selector
								$scope.offer.selectedLocations = '';
								
								// current locations
								$scope.currentLocations = $scope.offer.locations;
								$scope.groupToPages();

								if ($scope.offer.locations.length < 1) {
									$scope.offer.selectedLocations = '';
									$scope.offer.locations = [{}];
									$scope.location.location_bundle_name = '';
									$scope.location.location_bundle_id = '';
									$scope.locationsForm.$dirty = false;
									$scope.locationsForm.$invalid = true;
									$scope.locationsForm.location_bundle_name.$dirty = false;
									$scope.groupToPages();
								}
								else if ($scope.locations.length > 0) {
									$timeout(function () { 
										$scope.locationsForm.$dirty = true;
										$scope.locationsForm.$invalid = false;
										$scope.location.location_bundle_name = 'test';
										$scope.locationsForm.location_bundle_name.$dirty = true;

									},0);
									$scope.groupToPages();
								}

								// locations status						
								if ($scope.locations.length > 0) {
									$scope.showLocations = true;
									$scope.saveImportedLocations = false;
								}
								else {
									$scope.showLocations = false;
									$scope.saveImportedLocations = true;
								}

								$scope.offer.offerdates = {startDate: moment($scope.offer.start_ts), endDate: moment($scope.offer.expiry_ts)};

								//clear the title
								$scope.offer.title = '';

								// begin multi-select for recipients
								$scope.offer.recipients = [];
								// get current recipients for direct offers to filter recipientList
								$scope.selectedRecipients = [];
								if ($scope.offer.recipients_info) {
									for (var t = 0; t < $scope.offer.recipients_info.length; t++) {
										$scope.selectedRecipients.push($scope.offer.recipients_info[t].id);
									}
								}
								var selectRecipients = function() {
									$scope.offer.recipients = _.filter($scope.recipientsList, function(item) {
										return _.contains($scope.selectedRecipients, item.id);
									});
								}
								$scope.recipientsList = $scope.account.recipients;
								selectRecipients();
								// end multi-select for recipients

								// inject Math into scope
								$scope.Math = window.Math;

								// title treatment for direct offers
								if ($scope.network_type == "DIRECT") {
									$scope.recipients = $scope.offer.recipients_info;
									for (var s = 0; s < $scope.recipients.length; s++) {
										if ($scope.recipients.length == 1) {
											$scope.offer.offerTitle = 'Direct: ' + $scope.recipients[s].name;
										}
										else {
											$scope.offer.offerTitle = 'Direct: Multiple';
										}
									}
								}
								else {
									$scope.offer.offerTitle = $scope.offer.title;
								}
								
								// paginate ibeacons
								if ($scope.offer.ibeacon_info.length < 1) {
									$scope.offer.beacons = [{}];
									$scope.groupBeaconsToPages();								
								}
								else {
									$scope.offer.beacons = $scope.offer.ibeacon_info;
									$scope.groupBeaconsToPages();
								}
								
								// direct total budget
								$scope.$watch('[offer.value, offer.recipients]', function () { 
									$scope.offer.directBudget = ($scope.offer.value*$scope.offer.recipients.length) || 0;
								}, true);
								
								$scope.tempcode = $scope.offer.code;
							}
						}
					}
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
	};
	
	refresh();
	
	$rootScope.$on('loadingTrue', function (e, call) {
		$scope.setLoading(true);
	});
	
	$rootScope.$on('loadingFalse', function (e, call) {
		$scope.setLoading(false);
	});
	
	// if pre-edited offer is sku, there should not be a payment method on the model
	// if pre-edited offer is standard, there should be a payment method on the model
	// when switching between standard and sku, determine if there is already a payment method on model
	// if no method on model, and if there is only one payment method for the account, pre-select it
	function selectPaymentMethod(){
		if ($scope.offer.payment_info != null && $scope.offer.payment_info !== undefined) {
			$scope.offer.method = $scope.offer.payment_info;
		}
		else {
			if ($scope.methods.length == 1) {
				for (var p = 0; p < $scope.methods.length; p++) {
					$scope.method = $scope.methods[p];
				}
				$scope.offer.method = $scope.method.payment_id;
			}
		}
	};
	
	// type selection
	// standard || sku
	$scope.distributionSelectorPartialPath = "partials/distribution-selector.html";
	$scope.newTypeSelected = function(value) {
		if (value === 'standard') {
			if ($scope.distModel === 'URL' || $scope.distModel === 'Facebook' || $scope.distModel === 'Twitter') {
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
			}
			else if ($scope.distModel === 'DIRECT') {
				$scope.valuePartialPath = "partials/value-direct-for-edit-offer.html";
			}
			formResets($scope.distModel, $scope.typeModel);
		}
		else if (value === 'sku') {
			$scope.valuePartialPath = "partials/value-for-sku-offer.html";
			formResets($scope.distModel, $scope.typeModel);
		}
	};
	// end type selection
	
	// distribution selection
	// URL || Facebook || Twitter || Direct
	$scope.newChannelSelected = function(value) {
		if($scope.typeModel === 'sku') {
			$scope.valuePartialPath = "partials/value-for-sku-offer.html";
			formResets(value, $scope.typeModel);
		}
		if($scope.typeModel === 'standard') {
			if (value === 'URL' || value === 'Facebook' || value === 'Twitter') {
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
			}
			else if (value === 'DIRECT') {
				$scope.valuePartialPath = "partials/value-direct-for-edit-offer.html";
			}
			formResets(value, $scope.typeModel);
		}
	};
	// end distribution selection	

	// selects partials based on current values
	$scope.currentChannel = function(value) {
		if($scope.typeModel === 'sku') {
			$scope.valuePartialPath = "partials/value-for-sku-offer.html";
			if ($scope.distModel === 'URL') {
				$scope.paymentTypePartialPath = "partials/channel-url-for-edit-offer.html";
				$scope.showPreview = true;				
			}
			else if ($scope.distModel === 'Facebook') {
				$scope.paymentTypePartialPath = "partials/channel-fb-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'Twitter') {
				$scope.paymentTypePartialPath = "partials/channel-tt-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'DIRECT') {
				$scope.paymentTypePartialPath = "partials/channel-direct-for-edit-offer.html";
				$scope.showPreview = false;
			}
		}
		else {
			if ($scope.distModel === 'URL') {
				$scope.paymentTypePartialPath = "partials/channel-url-for-edit-offer.html";
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'Facebook') {
				$scope.paymentTypePartialPath = "partials/channel-fb-for-edit-offer.html";
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'Twitter') {
				$scope.paymentTypePartialPath = "partials/channel-tt-for-edit-offer.html";
				$scope.valuePartialPath = "partials/value-for-edit-offer.html";
				$scope.showPreview = true;
			}
			else if ($scope.distModel === 'DIRECT') {
				$scope.paymentTypePartialPath = "partials/channel-direct-for-edit-offer.html";
				$scope.valuePartialPath = "partials/value-direct-for-edit-offer.html";
				$scope.showPreview = false;
			}
		}
	}
	
	// sku tracking details section
	$scope.newSkuSelected = function(value) {
		$scope.skuModel = value;

		// run formResets based on selections
		formResets($scope.distModel, $scope.typeModel);

		$scope.skuDetailsPartialPath = "partials/sku-minpurchased.html";

		// get partial
		switch(value){
			case 'MINPURCHASED':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchased.html";
				$scope.offer.get_percentage = '';
				$scope.offer.buy_quantity = '';
				$scope.offer.get_quantity = '';
				$scope.offer.get_code = '';
				if($scope.orgSku == value) {
					$scope.offer.buy_amount = $scope.offer.discount_info.buy_amount;
					$scope.offer.buy_code = $scope.offer.discount_info.buy_code;
					$scope.offer.get_amount = $scope.offer.discount_info.get_amount;
				}
				else {
					$scope.offer.buy_amount = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_amount = '';	
				}
				break;
			case 'MINPURCHASEP':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchasep.html";
				$scope.offer.get_amount = '';
				$scope.offer.buy_quantity = '';
				$scope.offer.get_quantity = '';
				$scope.offer.get_code = '';	
				if($scope.orgSku == value) {
					$scope.offer.buy_amount = $scope.offer.discount_info.buy_amount;
					$scope.offer.buy_code = $scope.offer.discount_info.buy_code;
					$scope.offer.get_percentage = $scope.offer.discount_info.get_percentage;
				}
				else {
					$scope.offer.buy_amount = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_percentage = '';
				}
				break;
			case 'BXGX':
				$scope.skuDetailsPartialPath = "partials/sku-bxgx.html";
				$scope.offer.buy_amount = '';
				$scope.offer.get_amount = '';
				$scope.offer.get_percentage = '';
				$scope.offer.get_code = '';
				if($scope.orgSku == value) {
					$scope.offer.buy_quantity = $scope.offer.discount_info.buy_quantity;
					$scope.offer.get_quantity = $scope.offer.discount_info.get_quantity;
					$scope.offer.buy_code = $scope.offer.discount_info.buy_code;			
				}
				else {					
					$scope.offer.buy_quantity = '';
					$scope.offer.get_quantity = '';
					$scope.offer.buy_code = '';
				}
				break;
			case 'BUNDLE':
				$scope.skuDetailsPartialPath = "partials/sku-bundle.html";
				$scope.offer.get_percentage = '';				
				$scope.offer.buy_amount = '';
				if($scope.orgSku == value) {
					for (var s = 0; s < $scope.offer.discount_info.buy_bundle.length; s++) {
						$scope.offer.buy_quantity = $scope.offer.discount_info.buy_bundle[0].buy_quantity;
						$scope.offer.buy_code = $scope.offer.discount_info.buy_bundle[0].buy_code;
						$scope.offer.get_quantity = $scope.offer.discount_info.buy_bundle[1].buy_quantity;
						$scope.offer.get_code = $scope.offer.discount_info.buy_bundle[1].buy_code;
					}
					$scope.offer.get_amount = $scope.offer.discount_info.get_amount;			
				}
				else {
					$scope.offer.buy_quantity = '';
					$scope.offer.buy_code = '';
					$scope.offer.get_quantity = '';
					$scope.offer.get_code = '';
					$scope.offer.get_amount = '';			
				}
				break;
		};
	};

	// selects partials based on current values
	$scope.currentSkuSelected = function() {
		switch($scope.skuModel){
			case 'MINPURCHASED':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchased.html";
				break;
			case 'MINPURCHASEP':
				$scope.skuDetailsPartialPath = "partials/sku-minpurchasep.html";
				break;
			case 'BXGX':
				$scope.skuDetailsPartialPath = "partials/sku-bxgx.html";
				break;
			case 'BUNDLE':
				$scope.skuDetailsPartialPath = "partials/sku-bundle.html";
				break;
		};
	}
	//end currentSkuSelected

	// form resets
	// requires $scope.distModel (offer distribution selected) 
	// requires $scope.typeModel (offer type selected)
	// clears some preview error states
	// sets channel partial
	function formResets(distModel, typeModel) {
		switch(distModel){
			case 'URL':
				$scope.distModel = 'URL';
				$scope.paymentTypePartialPath = "partials/channel-url-for-edit-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.method = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				break;
			case 'Facebook':
				$scope.distModel = 'Facebook';
				$scope.paymentTypePartialPath = "partials/channel-fb-for-edit-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
						$scope.offerform.channel.$dirty = false;
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.method = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.channel.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				// select if only one fbChannel
				if ($scope.fbChannels.length == 1) {
					for (var i = 0; i < $scope.fbChannels.length; i++) {
						$scope.offer.channel = $scope.fbChannels[i].channel_id;
					}
				}
				break;
			case 'Twitter':
				$scope.distModel = 'Twitter';
				$scope.paymentTypePartialPath = "partials/channel-tt-for-edit-offer.html";
				$scope.offer.channel = '';
				$scope.offer.recipients = [];
				$scope.previewError = false;
				$scope.showPreview = true;
				if(typeModel=='standard') {
					selectPaymentMethod();
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.valueForm.value.$setValidity("preview", true);
						$scope.offerform.valueForm.total.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
						$scope.offerform.channel.$dirty = false;
					}, 500);
				}
				else {
					$scope.offer.total = '';
					$scope.offer.value = '';
					$scope.offer.method = '';
					$timeout(function () {
						$scope.offerform.title.$setValidity("preview", true);
						$scope.offerform.channel.$setValidity("preview", true);
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}, 500);
					clearAllPreview();
				}
				$scope.offerform.$setPristine(true);
				// select if only one ttChannel
				if ($scope.ttChannels.length == 1) {
					for (var i = 0; i < $scope.ttChannels.length; i++) {
						$scope.offer.channel = $scope.ttChannels[i].channel_id;
					}
				}
				break;
			case 'DIRECT':
				$scope.distModel = 'DIRECT';
				$scope.paymentTypePartialPath = "partials/channel-direct-for-edit-offer.html";
				$scope.offer.channel = '';
				$scope.offer.title = '';
				$scope.offer.total = '';
				$scope.offer.value = '';
				$scope.showPreview = false;
				$scope.previewError = false;
				selectPaymentMethod();
				$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
				if(typeModel=='sku') {
					$scope.offer.value = '';
					$scope.offer.method = '';
				}
				$scope.offerform.$setPristine(true);
				break;		
		};
	};
	// end form resets
	
	function clearAllPreview() {
		switch($scope.skuModel){
			case 'MINPURCHASED':
				$timeout(function () {
					$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
				}, 500);
				break;
			case 'MINPURCHASEP':
				$timeout(function () {
					$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
				}, 500);
				break;
			case 'BXGX':
				$timeout(function () {
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
				}, 500);
				break;
			case 'BUNDLE':
				$timeout(function () {
					$scope.offerform.valueForm.buy_quantity.$setValidity("preview", true);
					$scope.offerform.valueForm.buy_code.$setValidity("preview", true);
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
					$scope.offerform.valueForm.get_code.$setValidity("preview", true);
					$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
				}, 500);
				break;
		};	
	}
	// end clearAllPreview

	//publish
	$scope.offer = {};
	$scope.offer = {accountid: $routeParams.account_id};
	$scope.modal = {};
	$scope.submitted = false;
	
	$scope.$watch('[offer.value, offer.total]', function () {
		var tot = Math.floor($scope.offer.total/$scope.offer.value);
		if (tot != null && tot !== undefined && tot !== Infinity) {
			$scope.totalValue = tot || 0;
		}
	}, true);

	$scope.clearCode = function () {
		if($scope.offer.code_check == false) {
			$scope.offer.code='';
		}
		else if($scope.offer.code_check == true) {
			$scope.offer.code=$scope.tempcode;
			$timeout(function () {
				$('#code').focus();
			}, 100);
		}
	};

	$scope.$on("fileSelected", function (event, args) {
		$scope.$apply(function () {
			$scope.offer.file = args.file;
		});
	});
	
	$scope.cancel = function() {
		$location.path("/offer-details/account/"+account_id+"/offer/"+offer_id);
	};
	
	function populateOfferData(actionType){
		var offerInfo = new Object();
		offerInfo.action_type = actionType;
		offerInfo.copy_from_offer = offer_id;
		offerInfo.title = $scope.offer.title;
		offerInfo.value = $scope.offer.value;
		offerInfo.use_balance = $scope.offer.use_balance;
		offerInfo.enable_passbook = $scope.offer.enable_passbook;
		offerInfo.count = Math.floor($scope.offer.total/$scope.offer.value);
		offerInfo.total = $scope.offer.total;
		offerInfo.recipients = $scope.offer.recipients;
		offerInfo.payment_id = $scope.offer.method;
		offerInfo.account_id = $routeParams.account_id;
		$scope.approverRequired ? offerInfo.approvers = $scope.offer.approvers_info : offerInfo.approvers = '';
		offerInfo.locations = $scope.offer.locations;
		$scope.distModel=="URL" || $scope.distModel=="DIRECT" ? offerInfo.channel_id = $scope.distModel : offerInfo.channel_id = offerInfo.channel_id = $scope.offer.channel
		offerInfo.post_text = $scope.offer.desc;
		if(typeof($scope.uploadReturn.successData) != "undefined") {
			offerInfo.image_name = $scope.uploadReturn.successData.name;
		}
		else {
			offerInfo.image_name = $scope.offer.image_name;
		}
		
		//date related info	
		offerInfo.start_ts = moment($scope.offer.offerdates.startDate).format();
		offerInfo.expiry_ts = moment($scope.offer.offerdates.endDate).format();
		
		//offer code
		if ($scope.offer.code){
			offerInfo.code = $scope.offer.code.toUpperCase();
			offerInfo.code_check = $scope.offer.code_check;
		}
		$scope.offer.instructions ? offerInfo.instructions = $scope.offer.instructions : offerInfo.instructions = '';
		
		offerInfo.ibeacons = $scope.offer.beacons;
		offerInfo.offer_type = $scope.typeModel;
		// discount info
		if($scope.typeModel=='sku') {
			offerInfo.discount_type = $scope.skuModel;
			if(offerInfo.discount_type == 'BUNDLE') {
				$scope.offer.buy_bundle = [];
				var buyinfo = {
				    buy_quantity: parseInt($scope.offer.buy_quantity),
				    buy_code: $scope.offer.buy_code
				};
				$scope.offer.buy_bundle.push(buyinfo);

				var getinfo = {
				    buy_quantity: $scope.offer.get_quantity,
				    buy_code: $scope.offer.get_code
				};				
				$scope.offer.buy_bundle.push(getinfo);
				offerInfo.discount_buy_bundle = $scope.offer.buy_bundle;
				offerInfo.discount_get_amount = $scope.offer.get_amount;
			}
			else {
				offerInfo.discount_buy_amount = $scope.offer.buy_amount;
				offerInfo.discount_buy_code = $scope.offer.buy_code;
				offerInfo.discount_get_amount = $scope.offer.get_amount;
				offerInfo.discount_get_percentage = $scope.offer.get_percentage;
				offerInfo.discount_buy_quantity = $scope.offer.buy_quantity;
				offerInfo.discount_get_quantity = $scope.offer.get_quantity;
			}
		}

		console.log(offerInfo);
		return offerInfo;
	};
	
	// preview offer
	$scope.previewOffer = function() {
		$scope.previewError = false;
		
		if($scope.typeModel=='standard') {
			if(!$scope.offer.value) {
				$scope.offerform.valueForm.value.$setValidity("preview", false);
				$scope.$watch('offer.value', function () {
					if ($scope.offer.value) {
						$scope.offerform.valueForm.value.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}

			if(!$scope.offer.desc) {
				$scope.offerform.createForm.offerDesc.$setValidity("preview", false);
				$scope.$watch('offer.desc', function () {
					if ($scope.offer.desc) {
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}

			if(!$scope.offer.title) {
				$scope.offerform.title.$setValidity("preview", false);
				$scope.$watch('offer.title', function () {
					if ($scope.offer.title) {
						$scope.offerform.title.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}

			if(!$scope.offer.total) {
				$scope.offerform.valueForm.total.$setValidity("preview", false);
				$scope.$watch('offer.total', function () {
					if ($scope.offer.total) {
						$scope.offerform.valueForm.total.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}

			if($scope.distModel=="Facebook" || $scope.distModel=="Twitter") {
				if(!$scope.offer.channel) {
					$scope.offerform.channel.$setValidity("preview", false);
					$scope.$watch('offer.channel', function () {
						if ($scope.offer.channel) {
							$scope.offerform.channel.$setValidity("preview", true);
						}
					}, true);
					$scope.previewError = true;
				}
			}
		}
		
		else if ($scope.typeModel=='sku') {
			if(!$scope.offer.desc) {
				$scope.offerform.createForm.offerDesc.$setValidity("preview", false);
				$scope.$watch('offer.desc', function () {
					if ($scope.offer.desc) {
						$scope.offerform.createForm.offerDesc.$setValidity("preview", true);
					}
				}, true);
				$scope.previewError = true;
			}
			if(!$scope.offer.title) {
				$scope.offerform.title.$setValidity("preview", false);
				$scope.$watch('offer.title', function () {
					if ($scope.offer.title) {
						$scope.offerform.title.$setValidity("preview", true);
					}
				}, true);

				$scope.previewError = true;
			}		
		
			if($scope.skuModel=='MINPURCHASED') {
				if($scope.distModel=='URL'){

					if(!$scope.offer.get_amount) {
						$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
						$scope.$watch('offer.get_amount', function () {
							if ($scope.offer.get_amount) {
								$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$timeout(function () {
									$scope.offerform.channel.$setValidity("preview", true);
								}, 500);
							}
						}, true);
						$scope.previewError = true;
					}
					if(!$scope.offer.get_amount) {
						$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
						$scope.$watch('offer.get_amount', function () {
							if ($scope.offer.get_amount) {
								$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
			}
			else if($scope.skuModel=='MINPURCHASEP') {
				if($scope.distModel=='URL'){
					if(!$scope.offer.get_percentage) {
						$scope.offerform.valueForm.get_percentage.$setValidity("preview", false);
						$scope.$watch('offer.get_percentage', function () {
							if ($scope.offer.get_percentage) {
								$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$scope.offerform.channel.$setValidity("preview", true);
							}
						}, true);
						$scope.previewError = true;
					}
					if(!$scope.offer.get_percentage) {
						$scope.offerform.valueForm.get_percentage.$setValidity("preview", false);
						$scope.$watch('offer.get_percentage', function () {
							if ($scope.offer.get_percentage) {
								$scope.offerform.valueForm.get_percentage.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
			}
			else if ($scope.skuModel=='BXGX') {
				if($scope.distModel=='URL'){
					if(!$scope.offer.get_quantity) {
						$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
						$scope.$watch('offer.get_quantity', function () {
							if ($scope.offer.get_quantity) {
								$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
				}
				else if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.get_quantity) {
						$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
						$scope.$watch('offer.get_quantity', function () {
							if ($scope.offer.get_quantity) {
								$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
							}
						}, true);

						$scope.previewError = true;
					}
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$scope.offerform.channel.$setValidity("preview", true);
							}
						}, true);
						$scope.previewError = true;
					}
				}
			}
			else if($scope.skuModel=='BUNDLE') {
				if(!$scope.offer.buy_quantity) {
					$scope.offerform.valueForm.buy_quantity.$setValidity("preview", false);
					$scope.$watch('offer.buy_quantity', function () {
						if ($scope.offer.buy_quantity) {
							$scope.offerform.valueForm.buy_quantity.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.buy_code) {
					$scope.offerform.valueForm.buy_code.$setValidity("preview", false);
					$scope.$watch('offer.buy_code', function () {
						if ($scope.offer.buy_code) {
							$scope.offerform.valueForm.buy_code.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_quantity) {
					$scope.offerform.valueForm.get_quantity.$setValidity("preview", false);
					$scope.$watch('offer.get_quantity', function () {
						if ($scope.offer.get_quantity) {
							$scope.offerform.valueForm.get_quantity.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_code) {
					$scope.offerform.valueForm.get_code.$setValidity("preview", false);
					$scope.$watch('offer.get_code', function () {
						if ($scope.offer.get_code) {
							$scope.offerform.valueForm.get_code.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}

				if(!$scope.offer.get_amount) {
					$scope.offerform.valueForm.get_amount.$setValidity("preview", false);
					$scope.$watch('offer.get_amount', function () {
						if ($scope.offer.get_amount) {
							$scope.offerform.valueForm.get_amount.$setValidity("preview", true);
						}
					}, true);

					$scope.previewError = true;
				}
				
				if($scope.distModel=='Facebook' || $scope.distModel=='Twitter') {
					if(!$scope.offer.channel) {
						$scope.offerform.channel.$setValidity("preview", false);
						$scope.$watch('offer.channel', function () {
							if ($scope.offer.channel) {
								$timeout(function () {
									$scope.offerform.channel.$setValidity("preview", true);
								}, 500);
							}
						}, true);
						$scope.previewError = true;
					}				
				}
			}
		}
		
		if ($scope.previewError === true) {
			toaster.pop('warning', "Required fields missing", "Please check for any required fields you may have missed to preview this offer.");
		}
		else {
			submitPreview();
		}		
	
		function submitPreview(){
			$scope.setLoading(true);
			okdService.createPreview2(populateOfferData('Preview')).then(function(data){
				if(data.meta.code==200){
					$scope.setLoading(false);					
					$scope.previewLink = {
						val: data.response.preview_url
					};
					$scope.launch('preview-offer');
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			},
			function(errorMessage){
				$scope.setLoading(false);
				$scope.error=errorMessage;
				toaster.pop('error', "Failed to preview offer.", "An error occurred while previewing the offer. Please try again. If the problem persists, please contact our Support.");
			});
		}
	};

	// save offer
	$scope.submitOffer = function(actionType) {
		$scope.approversRequired = '';
		actionType=='Draft' ? $scope.approversRequired = 'false' : $scope.approversRequired = 'true';
		$timeout(function () {
			if ($scope.offerform.$valid) {
				$scope.setLoading(true);

				if ($scope.saveImportedLocations == true) {
					var locationInfo = new Object();
					locationInfo.location_bundle_name = $scope.location.location_bundle_name;
					locationInfo.locations = $scope.offer.locations;
					
					var beaconInfo = new Object();
					beaconInfo.beacons = $scope.offer.beacons;

					if (locationInfo.location_bundle_name) {
						okdService.createLocations($scope.location.accountid, locationInfo).then(function(data){
							$scope.savedLocations = data.response;
							if(data.meta.code==200){
								$scope.locationId = $scope.savedLocations.location_bundle_id;
								okdService.createOffer(populateOfferData(actionType)).then(function(data){
									if(data.meta.code==200){
										$scope.setLoading(false);
										$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
									}
									else {
										$scope.setLoading(false);
										toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
									}
								},
								function(errorMessage){
									$scope.setLoading(false);
									$scope.error=errorMessage;
									toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
								});
							}
							else {
								$scope.setLoading(false);
								toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
							}
						},
						function(errorMessage){
							$scope.setLoading(false);
							$scope.error=errorMessage;
							toaster.pop('error', "Unable to save location set.", "An error occurred while saving the location set. Please try again. If the problem persists, please contact our Support.");
						});
					}
					else {
						okdService.createOffer(populateOfferData(actionType)).then(function(data){
							if(data.meta.code==200){
								$scope.setLoading(false);
								$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
							}
							else {
								$scope.setLoading(false);
								toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
							}
						},
						function(errorMessage){
							$scope.setLoading(false);
							$scope.error=errorMessage;
							toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
						});						
					}
				}
				else {
					okdService.createOffer(populateOfferData(actionType)).then(function(data){
						if(data.meta.code==200){
							$scope.setLoading(false);
							$location.path("/offer-details/account/" + account_id + "/offer/" + data.response.offer_id);
						}
						else {
							$scope.setLoading(false);
							toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
						}
					},
					function(errorMessage){
						$scope.setLoading(false);
						$scope.error=errorMessage;
						toaster.pop('error', "Failed to create offer.", "An error occurred while creating offer. Please try again. If the problem persists, please contact our Support.");
					});
				}
			} else {
				$scope.setLoading(false);
				$scope.offerform.submitted = true;
				toaster.pop('warning', "Required fields missing", "Please check for any required fields you may have missed.");
			}
			
		}, 100);
	};

	//locations
	$scope.offer.locations = [{}];

	// get location set name and location table data
	$scope.location = {};
	$scope.location = {accountid: $routeParams.account_id};
	master_locations = $scope.offer.locations;
	$scope.form = angular.copy(master_locations);

	$scope.isSaveDisabled = function() {
		return $scope.locationsForm.$invalid;
	};
	
	$scope.locationNameRequired = function() {
		if ($scope.showLocations == false) {
			for (var i = 0; i < $scope.offer.locations.length; i++) {
				if (typeof $scope.offer.locations[i].street != 'undefined') {
					return true;
				}
			}
		}
	};
	
	$scope.removeLocations = function () {
		$scope.currentLocations = '';
		$scope.offer.selectedLocations = '';
		$scope.offer.locations = [{}];
		$scope.location.location_bundle_name = '';
		$scope.location.location_bundle_id = '';
		$scope.locationsForm.$dirty = false;
		$scope.locationsForm.$invalid = true;
		$scope.locationsForm.location_bundle_name.$dirty = false;
		$scope.groupToPages();
		$scope.currentPage = 0;
	};
	
	$scope.itemsPerPage = 5;
	$scope.pagedItems = [];
	$scope.currentPage = 0;

	$scope.groupToPages = function () {
		$scope.pagedItems = [];
		for (var i = 0; i < $scope.offer.locations.length; i++) {
			if (i % $scope.itemsPerPage === 0) {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.offer.locations[i] ];
			} else {
				$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.offer.locations[i]);
			}
		}
	};

	$scope.currentPage = 0;
	$scope.groupToPages();
	$scope.range = function (start, end) {
		var ret = [];
		if (!end) {
			end = start;
			start = 0;
		}
		for (var i = start; i < end; i++) {
			ret.push(i);
		}
		return ret;
	};

	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	$scope.nextPage = function () {
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			$scope.currentPage++;
		}
	};

	$scope.setPage = function () {
		$scope.currentPage = this.n;
	};	

	$scope.addLocation = function() {
		$scope.offer.locations.push({});
		$scope.groupToPages();		
		if ($scope.currentPage < $scope.pagedItems.length - 1) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};

	$scope.removeLocation = function(location) {
		var index=$scope.offer.locations.indexOf(location);		
		$scope.offer.locations.splice(index, 1);
		if ($scope.offer.locations.length < 1) {
			$scope.offer.locations.push({});
		}
		$scope.groupToPages();
		if ($scope.currentPage > 0) {
			var page = $scope.pagedItems.length - 1;
			$scope.currentPage = page;
		}
	};

	// get saved location sets
	$scope.importSavedLocations = function(id) {
		if ($scope.currentLocations.length > 0) {
			$scope.thisLocations = [];
		}
		else {
			$scope.thisLocations = [{}];
		}

		var selectedId = [];
		if (selectedId != undefined) {
			for (var t = 0; t < id.length; t++) {
				selectedId.push(id[t]);
				$scope.thisLocations = [];
			}
		}
		else {
			selectedId = [];
		}

		for (var i = 0; i < $scope.profile.accounts.length; i++) {
			if ($scope.profile.accounts[i].account_id === account_id) {
				$scope.thisAccount = $scope.profile.accounts[i];
			}
		}

		for (var j = 0; j < selectedId.length; j++) {
			for (var h = 0; h < $scope.thisAccount.location_info.length; h++) {
				if ($scope.thisAccount.location_info[h].location_bundle_id === selectedId[j]) {
					$scope.thisAccount.locations = $scope.thisAccount.location_info[h].locations;
				}
			}
			angular.forEach($scope.thisAccount.locations,function(item) {
			    $scope.thisLocations.push(item);
			});
			
			if ($scope.thisAccount.locations.length > 1) {
				$scope.disable_removeLocation = false;
			}
		}

		// add to current locations
		if ($scope.currentLocations.length > 0) {
			angular.forEach($scope.currentLocations,function(item) {
			   $scope.thisLocations.push(item);
			});
		}

		if ($scope.thisLocations.length > 0) {
			$scope.offer.locations = _.uniq($scope.thisLocations);
		}
		
		$scope.groupToPages();
		$scope.currentPage = 0;
	};
	
	//ibeacons
	$scope.offer.beacons = [{}];

	$scope.beacons = {};
	$scope.beacons = {accountid: account_id};
	master_beacons = $scope.offer.beacons;
	
	$scope.beaconsform = angular.copy(master_beacons);

	$scope.beaconsPerPage = 5;
	$scope.pagedBeacons = [];
	$scope.currentBeaconPage = 0;

	$scope.groupBeaconsToPages = function () {
		$scope.pagedBeacons = [];
		for (var i = 0; i < $scope.offer.beacons.length; i++) {
			if (i % $scope.beaconsPerPage === 0) {
				$scope.pagedBeacons[Math.floor(i / $scope.beaconsPerPage)] = [ $scope.offer.beacons[i] ];
			} else {
				$scope.pagedBeacons[Math.floor(i / $scope.beaconsPerPage)].push($scope.offer.beacons[i]);
			}
		}
	};

	$scope.groupBeaconsToPages();
	
	$scope.prevBeaconPage = function () {
		if ($scope.currentBeaconPage > 0) {
			$scope.currentBeaconPage--;
		}
	};

	$scope.nextBeaconPage = function () {
		if ($scope.currentBeaconPage < $scope.pagedBeacons.length - 1) {
			$scope.currentBeaconPage++;
		}
	};

	$scope.setBeaconPage = function () {
		$scope.currentBeaconPage = this.n;
	};
	
	$scope.addBeacon = function() {
		$scope.offer.beacons.push({});
		$scope.groupBeaconsToPages();		
		if ($scope.currentBeaconPage < $scope.pagedBeacons.length - 1) {
			var page = $scope.pagedBeacons.length - 1;
			$scope.currentBeaconPage = page;
		}
	};

	$scope.removeBeacon = function(beacon) {
		var index=$scope.offer.beacons.indexOf(beacon);		
		$scope.offer.beacons.splice(index, 1);
		if ($scope.offer.beacons.length < 1) {
			$scope.offer.beacons.push({});
		}
		$scope.groupBeaconsToPages();
		if ($scope.currentBeaconPage > 0) {
			var page = $scope.pagedBeacons.length - 1;
			$scope.currentBeaconPage = page;
		}
	};
	
	$scope.previewNewImage = function() {
		$scope.selectedImage = {
			val: $scope.uploadReturn.successData.fullUrl
		};
		$scope.launch('preview-new-image');
	};

	$scope.previewExistingImage = function() {
		$scope.selectedImage = {
			val: $scope.offer.image_url
		};
		$scope.launch('preview-existing-image');
	};

	$scope.launch = function(which){
		switch(which){
			// Upload Locations CSV
			case 'upload-csv':
				var dlg = dialogs.create('/dialogs/upload-csv.html','uploadCSVCtrl',{},{keyboard: true, backdrop: true});
				dlg.result.then(function(locations){
					$scope.offer.locations = locations;
					$scope.groupToPages();
				},function(locations){
					$scope.offer.locations = '';
				});
				break;
			// preview new image
			case 'preview-new-image':
				var dlg = dialogs.create('/dialogs/preview-offer-image.html','previewImageCtrl',$scope.selectedImage,{keyboard: true, backdrop: true});
				break;
			// preview existing image
			case 'preview-existing-image':
				var dlg = dialogs.create('/dialogs/preview-offer-image.html','previewImageCtrl',$scope.selectedImage,{keyboard: true, backdrop: true});
				break;
			// preview offer
			case 'preview-offer':
				var dlg = dialogs.create('/dialogs/open-preview.html','previewOfferCtrl',$scope.previewLink,{keyboard: true, backdrop: true});
				break;
		};
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	// upload image
	$scope.uploadLayer = function(e, data, process) {
		return $scope.uploadReturn = uploadService.process(e, data, process);
	};
	return $scope.uploadReturn = uploadService.initialize();
});

okd.controller('offerDetailsCtrl', function offerDetailsCtrl($scope, $rootScope, okdService, $location, $routeParams, startTime, elapsedEstimator, $timeout, $filter, ngTableParams, toaster, dialogs) {
	//initialize a revision variable 
	$scope.revision = '0';
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.setLoading(true);
	$rootScope.contentLoaded = false;
	$scope.offer_id = $routeParams.offer_id;
	$scope.account_id = $routeParams.account_id;

	function refresh(){
		$scope.setLoading(true);
		okdService.getOffer($scope.account_id, $scope.offer_id).then(function(data){
			if(data){
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$scope.profile = data.response;
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						$scope.account = $scope.profile.accounts[i];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;					
					}
				}
				else {
					$rootScope.setLoading(false);	
					$location.path("/home");
				}
			}

			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					
					if ($scope.account.account_id === $scope.account_id) {
						for (var j = 0; j < $scope.account.offer_details.length; j++) {
							if ($scope.profile.accounts[i].offer_details[j].offer_id === $scope.offer_id) {
								$scope.thisOffer = $scope.profile.accounts[i].offer_details[j];
								$scope.approversList = $scope.account.approvers;
								$scope.account_id = $scope.account.account_id;

								// check if EventSource is supported
								// otherwise IE has JS error
								if ($scope.account_id && window.EventSource){
									//$scope.listen();
								}

								// APPROVAL PROCESS
								$scope.thisOffer.approver = $scope.thisOffer.approvers_info;

								// account state
								$scope.account.is_approver_required == true ? $scope.approverRequired = true : $scope.approverRequired = false

								//$scope.approversList = data.response.approvers;
								for (var k = 0; k < $scope.approversList.length; k++) {
									if ($scope.thisOffer.approver == $scope.approversList[k].id) {
										$scope.approverName = $scope.approversList[k].name;
									}
								}

								// offer state
								if ($scope.approverRequired == true) {						
									if ($scope.thisOffer.status == 'PENDING') {
										if ($scope.thisOffer.approvers_info != '') {
											$scope.pending = true;
										}
										$scope.thisOffer.is_approver == true ? $scope.isApprover = true : $scope.isApprover = false
									}
									// need to redeclare so alerts are hidden when offer is rejected, cancelled or archived
									else {
										$scope.isApprover = undefined;
									}
								}

								// messages and date formatting for elapsed time
								$scope.messages = $scope.thisOffer.messages;
								$scope.previewMsgImage = function(id) {
									for (var m = 0; m < $scope.messages.length; m++) {
										if ($scope.messages[m].msg_id === id) {
											$scope.selectedImage = {
												val: $scope.messages[m].image_url
											};
											$scope.launch('preview-image');
										}
									}
								};

								// offer channel links
								$scope.channels = $scope.account.channel_info;
								for (var k = 0; k < $scope.thisOffer.channel_info.length; k++) {
									$scope.channel_id = $scope.thisOffer.channel_info[k].channel_id;
									$scope.channelName = $scope.thisOffer.channel_info[k].network_type;
									$scope.landingUrl = $scope.thisOffer.channel_info[k].url;
									$scope.channelUrl = $scope.thisOffer.channel_info[k].channel_url;
									if ($scope.landingUrl && $scope.channelName && $scope.thisOffer.offer_type == 'standard') {
										$scope.pipe = '|';
									}
								}

								// location status
								$scope.thisOffer.location_length > 0 ? $scope.showLocationName = true : $scope.showLocationName = false;
								$scope.locationLength = $scope.thisOffer.location_length;
								$scope.locationLength == 1 ? $scope.locationsLabel = $scope.locationLength + ' location' : $scope.locationsLabel = $scope.locationLength + ' locations';
								
								// Total offers
								if($scope.thisOffer.offer_type == 'standard') {
									$scope.thisOffer.offercount = Math.floor($scope.thisOffer.total/$scope.thisOffer.value);
									$scope.thisOffer.offercount == 1 ? $scope.thisOffer.offercount = $scope.thisOffer.offercount + ' offer' : $scope.thisOffer.offercount = $scope.thisOffer.offercount + ' offers';
								}
								else {
									$scope.thisOffer.offercount = '';
								}
								
								// Offer value
								if($scope.thisOffer.offer_type == 'standard') {
									$scope.thisOffer.offervalue = $filter('currency')($scope.thisOffer.value);
								}
								else {
									switch($scope.thisOffer.discount_info.type){
										case 'MINPURCHASED':
											$scope.thisOffer.offervalue = $filter('currency')($scope.thisOffer.discount_info.get_amount) + ' off';
											break;
										case 'MINPURCHASEP':
											$scope.thisOffer.offervalue = $scope.thisOffer.discount_info.get_percentage + '% off';
											break;
										case 'BXGX':
											if($scope.thisOffer.discount_info.buy_quantity) {
												$scope.thisOffer.offervalue = 'Buy ' + $scope.thisOffer.discount_info.buy_quantity + ' Get ' + $scope.thisOffer.discount_info.get_quantity + ' Free';
											}
											else {
												$scope.thisOffer.offervalue = 'Get ' + $scope.thisOffer.discount_info.get_quantity + ' Free';
											}
											break;
										case 'BUNDLE':
											$scope.thisOffer.offervalue = $filter('currency')($scope.thisOffer.discount_info.get_amount) + ' off Bundle';
											break;
									};
								}

								// elapsed time
								$scope.startedTime = startTime;

								var intervalId;
								intervalId = setInterval(function(){
									$scope.$apply(function(){
										$scope.elapsed = elapsedEstimator.elapsed();
									});
								}, 2000);

								if ($scope.channelName=='URL' || !$scope.channelUrl || $scope.channelName=='DIRECT') {
									$scope.showViewStatus = false;
									$scope.showStatus = true;	
									if ($scope.thisOffer.status=="RUNNING" || $scope.thisOffer.status=="APPROVED") {
										$scope.isRunning = true;
										if($scope.landingUrl && $scope.thisOffer.offer_type == 'standard') {
											$scope.pipe = '|';
										}
									}
									else {
										$scope.isRunning = false;
									}
								}
								else if ($scope.thisOffer.status=="RUNNING") {
									$scope.isRunning = true;
									$scope.showViewStatus = true;
									$scope.showStatus = false;
								}
								else {
									$scope.isRunning = false;
									$scope.showViewStatus = false;
									$scope.showStatus = true;							
								}

								//recipients
								if ($scope.channelName=='DIRECT') {
									if($scope.thisOffer.recipients_info.length == 1) {
										for (var f = 0; f < $scope.thisOffer.recipients_info.length; f++) {
											$scope.recipientNames = $scope.thisOffer.recipients_info[f].name;
										}
										$scope.showOneRecipient = true;
										$scope.showMultipleRecipients = false;
									}
									else if ($scope.thisOffer.recipients_info.length > 1) {
										$scope.recipientNames = [];
										for (var f = 0; f < $scope.thisOffer.recipients_info.length; f++) {
											$scope.recipientNames.push($scope.thisOffer.recipients_info[f].name);
										}
										$scope.items = $scope.recipientNames;
										$scope.recipientsLength = $scope.items.length;
										$scope.listtitle = $scope.recipientsLength + " recipients";
										$scope.showOneRecipient = false;
										$scope.showMultipleRecipients = true;
									}

									$scope.showRecipientsStatus = true;
									$scope.showTotalValueStatus = false;
								}
								else {
									$scope.showRecipientsStatus = false;
									$scope.showTotalValueStatus = true;

								}
								
								// usage chart
								$scope.chartPartialPath = "partials/offer-usage-chart-container.html";

								// offer history					
								if ($scope.thisOffer.history.length > 0) {
									$scope.historyPartialPath = "partials/history-container.html";
									$scope.modalTitle = "Offer History Details";
									$scope.historyData = $filter('orderBy')($scope.thisOffer.history, "ts", reverse=true);
									for (var i = 0; i < $scope.historyData.length; i++) {
										if ($scope.historyData[i].has_modal) {
											$scope.historyData[i].event_with_details = '<a href="">' + $scope.historyData[i].event + '</a>';
											$scope.historyData[i].event = '';
										}
									}
									$scope.itemsPerPage = 5;
									$scope.pagedItems = [];
									$scope.currentPage = 0;

									$scope.groupToPages = function () {
										$scope.pagedItems = [];
										for (var i = 0; i < $scope.historyData.length; i++) {
											if (i % $scope.itemsPerPage === 0) {
												$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.historyData[i] ];
											} else {
												$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.historyData[i]);
											}
										}
									};

									$scope.groupToPages();
									$scope.range = function (start, end) {
										var ret = [];
										if (!end) {
											end = start;
											start = 0;
										}
										for (var i = start; i < end; i++) {
											ret.push(i);
										}
										return ret;
									};

									$scope.prevPage = function () {
										if ($scope.currentPage > 0) {
											$scope.currentPage--;
										}
									};

									$scope.nextPage = function () {
										if ($scope.currentPage < $scope.pagedItems.length - 1) {
											$scope.currentPage++;
										}
									};

									$scope.setPage = function () {
										$scope.currentPage = this.n;
									};
								}
								
								// top locations
								$scope.topLocationsPartialPath = "partials/offer-top-locations-container.html";
								$scope.locationsPartialPath = "partials/top-locations-table.html";
								
								var getData = function() {
									return $scope.thisOffer.top_locations;
								};

								// ngTable has a super bug that reload() doesnt seem to work unless count changes.
								$scope.locationsTableParams = new ngTableParams({
									page: 1,
									count: $scope.thisOffer.top_locations.length,
									sorting: {
										revenue: 'desc'
									}
								}, {
									total: function () { return getData().length; },
									getData: function($defer, params) {
										var data = getData();
										var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
										params.total(data.length);
										$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
									},
									$scope: { $data: {} }
								});
								
								$timeout(
									function(){
										$scope.$watch('thisOffer.top_locations', function () {
											if($scope.thisOffer.top_locations.length > 0) {
												$scope.locationsTableParams.reload();
											}
										});
									},
									300
								);

								// reload case 
								// now desperate to intercept top locations array change
								// hope is that this code will be migrated to watch
								if ($scope.topLocationsCount){
									if ($scope.thisOffer.top_locations.length > $scope.topLocationsCount){
										$scope.topLocationsCount = $scope.thisOffer.top_locations.length;
										if($scope.locationsTableParams){
											$timeout(function () { 
												//$scope.locationsTableParams.reload();
											},0);
										}
									}
								}
								else {
									if ($scope.topLocationsCount === 0){
										if ($scope.locationsTableParams){
											$timeout(function () { 
												//$scope.locationsTableParams.reload();
											},0);
										}
									}
									$scope.topLocationsCount = $scope.thisOffer.top_locations.length;
								}								
								
								// prep top locations data for export
								// creates a new array for exportCsv directive
								$scope.csvArray = [];									
								for (var i = 0; i < $scope.thisOffer.top_locations.length; i++) {
									 $scope.csvArray.push({Business_Name: $scope.thisOffer.top_locations[i].busname, City: $scope.thisOffer.top_locations[i].city, State: $scope.thisOffer.top_locations[i].state, Activations: $scope.thisOffer.top_locations[i].activations, Uses: $scope.thisOffer.top_locations[i].uses, Revenue: $filter('currency')($scope.thisOffer.top_locations[i].revenue)});
								}
								
								$scope.thisOffer.chartStartDate = $scope.thisOffer.usage_start;
								$scope.thisOffer.chartEndDate = $scope.thisOffer.usage_end;

								$scope.thisOffer.csvTitle = $scope.thisOffer.title.replace(/\s/g, '');								
								$scope.thisOffer.csvTitle = $scope.thisOffer.csvTitle.replace(":", "_");
								
								// preview offer image
								$scope.previewImage = function() {
									$scope.selectedImage = {
										val: $scope.thisOffer.image_url
									};
									$scope.launch('preview-image');
								};
								
								// location modal map data
								$scope.openLocationsMap = function() {
									$scope.setLocations = {
										val: $scope.thisOffer
									};
									$scope.launch('map');
								};
								
								$scope.launchReport = function(item) {
									$scope.selectedOffer = {
										val: $scope.thisOffer
									};
									$scope.launch(item+'-report');
								}
							}
						}
					}
				}
				
				$rootScope.contentLoaded = true;
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to open offer.", "An error occurred while opening the offer. You will now be redirected to the offers list...");
			$timeout(function(){
				$location.path("/all-offers");
			},1500);
		});
	};

	refresh();
	
	$rootScope.$on('loadingTrue', function (event) {
		$scope.setLoading(true);
	});
	
	$rootScope.$on('loadingFalse', function (event) {
		$scope.setLoading(false);
	});
	
	$scope.goto = function(selectedView) {
		window.open(selectedView,'_blank');
	}

	$scope.launch = function(which){
		switch(which){
			// preview image
			case 'preview-image':
				var dlg = dialogs.create('/dialogs/preview-offer-image.html','previewImageCtrl',$scope.selectedImage,{keyboard: true, backdrop: true});
				break;
			// Map
			case 'map':
				var dlg = dialogs.create('/dialogs/location-set-map.html','LocationSetMapController',$scope.setLocations,{keyboard: true, backdrop: true, windowClass:'dialog-map'});
				break;
			case 'claims-report':
				$scope.setLoading(true);
				var dlg = dialogs.create('/dialogs/claims-spend-report.html','ClaimsSpendReportController',$scope.selectedOffer,{keyboard: true, backdrop: true, windowClass:'modal-extralarge'});
				break;
			case 'activation-report':
				$scope.setLoading(true);
				var dlg = dialogs.create('/dialogs/activation-spend-report.html','ActivationSpendReportController',$scope.selectedOffer,{keyboard: true, backdrop: true, windowClass:'modal-extralarge'});
				break;
			case 'used-report':
				$scope.setLoading(true);
				var dlg = dialogs.create('/dialogs/used-spend-report.html','UsedSpendReportController',$scope.selectedOffer,{keyboard: true, backdrop: true, windowClass:'modal-extralarge'});
				break;
		};
	};

	// chart convert to png
	function getImgData(chartContainer) {
		chartArea = chartContainer.find('svg').parent();
		svg = chartArea.html();

		canvas = $('<canvas>', {
			width: chartArea.width(),
			height: chartArea.height()
		}).appendTo(document.body).css({
			position: 'absolute',
			top: (-chartArea.offsetHeight * 2) + 'px',
			left: (-chartArea.offsetWidth * 2) + 'px'
		})

		canvasElem = canvas.get(0);
		canvg(canvasElem, svg);

		imgData = canvasElem.toDataURL("image/png");

		canvas.remove();
		return imgData;
	}

	$scope.saveImg = function() {
		var url = 'saveimage.php';
		var fname = 'chart - ' + $scope.thisOffer.chartStartDate + ' to ' + $scope.thisOffer.chartEndDate;
		var chartContainer = $('#chart-container');
		//var data = canvasElem.toDataURL("image/png");
		var data = getImgData(chartContainer);
		data = data.substr(data.indexOf(',') + 1).toString();

		var dataInput = document.createElement("input");
		var content = "---base64image--";
		dataInput.setAttribute("name", "content");
		dataInput.setAttribute("value", content);
		
		dataInput.setAttribute("name", "imgdata");
		dataInput.setAttribute("value", data);
		dataInput.setAttribute("type", "hidden");

		var nameInput = document.createElement("input");
		nameInput.setAttribute("name", 'name');
		nameInput.setAttribute("value", fname + '.png');

		var typeInput = document.createElement("input"); 
		typeInput.setAttribute("name", 'type');
		typeInput.setAttribute("value", 'PNG');

		var myForm = document.createElement("form");
		myForm.method = 'post';
		myForm.action = url;
		myForm.appendChild(dataInput);
		myForm.appendChild(nameInput);
		myForm.appendChild(typeInput);

		document.body.appendChild(myForm);
		myForm.submit();
		document.body.removeChild(myForm);
		toaster.pop('success', "Success", "Download initiated");
	};
	// end chart convert to png

	// top locations toggle
	$scope.radioModel = 'table';
	$scope.selectedPartial = function(value) {
		if (value === 'table') {
			$scope.locationsPartialPath = "partials/top-locations-table.html";
			$scope.mapReady = false;
		}
		else if (value === 'map') {
			$scope.locationsPartialPath = "partials/top-locations-map.html";
			$scope.mapReady = true;
		}
	};
	
	// settings for show/hide
	$scope.active = true;
	$scope.toggle = function() {
		$scope.isVisible = ! $scope.isVisible;
		$scope.active = $scope.active === false ? true: false;
	};
	$scope.isVisible = true;
	
	// focus on msg input if routeParams.focusInput
	$scope.focusInput = $routeParams.focusInput;
	
	function populateOfferData(actionType){
		var offerInfo = new Object();
		offerInfo.action_type = actionType;
		offerInfo.offer_id = $routeParams.offer_id;
		return offerInfo;
	};
	
	$scope.approve = function() {
		$scope.setLoading(true);
		$('#approveModal').modal('hide');
		okdService.createOffer(populateOfferData('approve')).then(function(data){
			if(data.meta.code==200){
				$scope.setLoading(false);
				$timeout(function(){
					refresh();
					toaster.pop('success', "Success", "Offer has been approved.");
				},500);
			}
			else {
				$scope.setLoading(false);
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to approve offer.", "An error occurred while approving the offer. Please try again. If the problem persists, please contact our Support.");
		});
	};	

	$scope.rejectOffer = function() {
		$scope.setLoading(true);
		okdService.createOffer(populateOfferData('reject')).then(function(data){
			if(data.meta.code==200){
				$scope.setLoading(false);
				$timeout(function(){
					refresh();
					toaster.pop('success', "Success", "Offer has been rejected.");
				},500);
			}
			else {
				$scope.setLoading(false);
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to reject offer.", "An error occurred while rejecting the offer. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	$scope.cancelOffer = function() {
		$scope.setLoading(true);
	
		okdService.createOffer(populateOfferData('Cancel')).then(function(data){
			if(data.meta){
				if(data.meta.code==200){
					$scope.setLoading(false);
					toaster.pop('success', "Success", "Offer has been cancelled.");
					$timeout(function(){
						refresh();
					},500);
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}
			else {
				$scope.setLoading(false);
				toaster.pop('error', "Failed to cancel offer.", "An error occurred while cancelling the offer. Please try again. If the problem persists, please contact our Support.");
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to cancel offer.", "An error occurred while cancelling the offer. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	$scope.archiveOffer = function() {
		$scope.setLoading(true);
	
		okdService.createOffer(populateOfferData('Archive')).then(function(data){
			if(data.meta.code==200){
				$scope.setLoading(false);
				toaster.pop('success', "Success", "Offer has been archived.");
				$timeout(function(){
					refresh();
				},500);
			}
			else {
				$scope.setLoading(false);
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to archive offer.", "An error occurred while archiving the offer. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.revisionCallBack = function (e) {
		$scope.$apply(function () {
			if ($scope.revision === e.data){
				console.log("up to date")
			}
			else {
				refresh();
			}
			$scope.revision = e.data;
		});
	};

	$scope.listen = function () {
		if ($scope.account_id){
			if ($scope.x_source){
				console.log("event source obj already initiated")
			}
			else {
				var event_url = '/enterprise/api/v1/accounts/' + $scope.account_id + '/events/';
				$scope.x_source = new EventSource(event_url);
				$scope.x_source.addEventListener('revision', $scope.revisionCallBack , false);
			}
		}
	};
	
	$scope.canAdd = function () {
		return !($scope.msgText);
	}
	
	$scope.msg = {};
	$scope.addMsg = function() {
		// call message service
		$scope.setLoading(true);
		$scope.msg.msgText = $scope.msgText;
		okdService.updateChat($routeParams.offer_id, $scope.msg).then(function(data){
			$scope.setLoading(false);
			if(data){
				if(data.meta.code==200){			
					$scope.messages = data.response.messages;
					$scope.thisOffer.messages = data.response.messages;
					$scope.msgText = '';
				}
				else {
					$scope.msgText = '';
					toaster.pop('error', "Failed to send message.", "An error occurred while sending a message. Please try again. If the problem persists, please contact our Support.");
				}
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.msgText = '';
			toaster.pop('error', "Failed to send message.", "An error occurred while sending a message. Please try again. If the problem persists, please contact our Support.");
			$scope.error=errorMessage;
		});
	};	
});

okd.controller('previewImageCtrl',function previewImageCtrl($scope, $rootScope, $modalInstance, data){	
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
});

okd.controller('previewOfferCtrl',function previewOfferCtrl($scope, $rootScope, $modalInstance, data){	
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
});

okd.controller('ClaimsSpendReportController',function ClaimsSpendReportController($scope, $rootScope, $filter, $location, okdService, $routeParams, ngTableParams, $modalInstance, data, toaster){
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	$scope.offerTitle = $scope.data.val.title;
	$scope.offer_id = $routeParams.offer_id;
	$scope.account_id = $routeParams.account_id;
	
	okdService.getRevenueData($scope.account_id, $scope.offer_id, 'claim').then(function(data){
		$rootScope.$emit('loadingTrue');
		if(data){
			$rootScope.$emit('loadingFalse');
			if(data.meta.code==200){
				$scope.data = data.response;
				$scope.dataList = data.response.data_list;
				$scope.spendTableParams = new ngTableParams({
					page: 1,
					count: 100,
					sorting: {
						claim_time: 'desc'
					}
				}, {
					getData: function($defer, params) {
						var orderedData = params.sorting() ? $filter('orderBy')($scope.dataList, params.orderBy()) : $scope.dataList;
						params.total($scope.dataList.length);
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					},
					$scope: { $data: {} }
				});
				
			}
			else if (data.meta.code==28002) {
				$scope.cancel();
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				$location.path("/home");
			}
			else {
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		}		
	},
	function(errorMessage){
		$rootScope.$emit('loadingFalse');
		$scope.error=errorMessage;
		toaster.pop('error', "Failed to open data.", "An error occurred while opening the data.")
	});
	
	$scope.downloadReport = function() {
		$modalInstance.close($scope.data);
		okdService.downloadRevenueData($scope.account_id, $scope.offer_id, 'claim').then(function(data){
			if(data){
				$rootScope.$emit('loadingFalse');
				if(data.meta.code==200){
					var dwnElement = document.createElement('a');
					dwnElement.setAttribute('href', data.response.link);
					dwnElement.setAttribute('download', $scope.offerTitle + '_' + 'claims' + '_User Report.csv');
					document.body.appendChild(dwnElement);
					dwnElement.click();
					document.body.removeChild(dwnElement);
					toaster.pop('success', "Success", "Report download initiated");
				}
				else if (data.meta.code==28002) {
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
					$location.path("/home");
				}
				else {			
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}				
		},
		function(errorMessage){
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to download report.", "An error occurred while downloading the report.")
		});
	};
});

okd.controller('ActivationSpendReportController',function ActivationSpendReportController($scope, $rootScope, $filter, $location, okdService, $routeParams, ngTableParams, $modalInstance, data, toaster){
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	$scope.offerTitle = $scope.data.val.title;
	$scope.offer_id = $routeParams.offer_id;
	$scope.account_id = $routeParams.account_id;
	
	okdService.getRevenueData($scope.account_id, $scope.offer_id, 'activate').then(function(data){
		$rootScope.$emit('loadingTrue');
		if(data){
			$rootScope.$emit('loadingFalse');
			if(data.meta.code==200){
				$scope.data = data.response;
				$scope.dataList = data.response.data_list;

				$scope.spendTableParams = new ngTableParams({
					page: 1,
					count: 100,
					sorting: {
						activation_time: 'desc'
					}
				}, {
					getData: function($defer, params) {
						var orderedData = params.sorting() ? $filter('orderBy')($scope.dataList, params.orderBy()) : $scope.dataList;
						params.total($scope.dataList.length);
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					},
					$scope: { $data: {} }
				});
			}
			else if (data.meta.code==28002) {
				$scope.cancel();
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				$location.path("/home");
			}
			else {			
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		}		
	},
	function(errorMessage){
		$rootScope.$emit('loadingFalse');
		$scope.error=errorMessage;
		toaster.pop('error', "Failed to open data.", "An error occurred while opening the data.")
	});
	
	$scope.downloadReport = function() {
		$modalInstance.close($scope.data);
		okdService.downloadRevenueData($scope.account_id, $scope.offer_id, 'activate').then(function(data){
			if(data){
				$rootScope.$emit('loadingFalse');
				if(data.meta.code==200){
					var dwnElement = document.createElement('a');
					dwnElement.setAttribute('href', data.response.link);
					dwnElement.setAttribute('download', $scope.offerTitle + '_' + 'activate' + '_User Report.csv');
					document.body.appendChild(dwnElement);
					dwnElement.click();
					document.body.removeChild(dwnElement);
					toaster.pop('success', "Success", "Report download initiated");
				}
				else if (data.meta.code==28002) {
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
					$location.path("/home");
				}
				else {			
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}				
		},
		function(errorMessage){
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to download report.", "An error occurred while downloading the report.")
		});
	};
});

okd.controller('UsedSpendReportController',function UsedSpendReportController($scope, $rootScope, $filter, $location, okdService, $routeParams, ngTableParams, $modalInstance, data, toaster){
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	$scope.offerTitle = $scope.data.val.title;
	$scope.offer_id = $routeParams.offer_id;
	$scope.account_id = $routeParams.account_id;
	
	okdService.getRevenueData($scope.account_id, $scope.offer_id, 'used').then(function(data){
		$rootScope.$emit('loadingTrue');
		if(data){
			$rootScope.$emit('loadingFalse');
			if(data.meta.code==200){
				$scope.data = data.response;
				$scope.dataList = data.response.data_list;
				$scope.spendTableParams = new ngTableParams({
					page: 1,
					count: 100,
					sorting: {
						use_time: 'desc'
					}
				}, {
					getData: function($defer, params) {
						var orderedData = params.sorting() ? $filter('orderBy')($scope.dataList, params.orderBy()) : $scope.dataList;
						params.total($scope.dataList.length);
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					},
					$scope: { $data: {} }
				});
			}
			else if (data.meta.code==28002) {
				$scope.cancel();
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				$location.path("/home");
			}
			else {			
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		}		
	},
	function(errorMessage){
		$rootScope.$emit('loadingFalse');
		$scope.error=errorMessage;
		toaster.pop('error', "Failed to open data.", "An error occurred while opening the data.")
	});
	
	$scope.downloadReport = function() {
		$modalInstance.close($scope.data);
		okdService.downloadRevenueData($scope.account_id, $scope.offer_id, 'used').then(function(data){
			if(data){
				if(data.meta.code==200){
					var dwnElement = document.createElement('a');
					dwnElement.setAttribute('href', data.response.link);
					dwnElement.setAttribute('download', $scope.offerTitle + '_' + 'used' + '_User Report.csv');
					document.body.appendChild(dwnElement);
					dwnElement.click();
					document.body.removeChild(dwnElement);
					toaster.pop('success', "Success", "Report download initiated");
				}
				else if (data.meta.code==28002) {
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
					$location.path("/home");
				}
				else {			
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}				
		},
		function(errorMessage){
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to download report.", "An error occurred while downloading the report.")
		});
	};
});

okd.controller('TopLocationsMapController', function TopLocationsMapController($scope, $filter, toaster) {
	$scope.toplocations = $scope.thisOffer.top_locations;
	if ($scope.toplocations.length > 0) {
		var ib = new InfoBox({
			 disableAutoPan: false,
			 maxWidth: 150,
			 pixelOffset: new google.maps.Size(-140, 0),
			 zIndex: null,
			 boxStyle: {
				background: "url('img/tipbox.gif') no-repeat",
				opacity: 0.75,
				width: "300px"
			},
			closeBoxMargin: "12px 4px 2px 2px",
			closeBoxURL: "img/infobox-close.gif",
			infoBoxClearance: new google.maps.Size(1, 1)
		});
		
		$scope.init = function() {
			var mapOptions = {
				zoom: 5,
				center: new google.maps.LatLng(39.017105, -94.687215),
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
			
			var lats = [], longs = [], myLatlng = [];

			for(var i=0; i<$scope.toplocations.length; i++) {
				lats[i] = $scope.toplocations[i].latitude;
				longs[i] = $scope.toplocations[i].longitude;
				// if not null
				if (lats[i] && longs[i]) {
					myLatlng.push(new google.maps.LatLng(lats[i], longs[i]));
				}
				else {
					toaster.pop('warning', "Unable to add plot marker(s).", "One or more locations could not be plotted due to unknown latitiude or longitude.");
				}
				var bounds = new google.maps.LatLngBounds();
				for (var j = 0, LtLgLen = myLatlng.length; j < LtLgLen; j++) {
					bounds.extend (myLatlng[j]);
				}

				var circleOptions = {
					strokeColor: 'transparent',
					strokeOpacity: 0.8,
					strokeWeight: 1,
					fillColor: '#8b0218',
					fillOpacity: 0.50,
					map: map,
					center: new google.maps.LatLng($scope.toplocations[i].latitude, $scope.toplocations[i].longitude),
					radius: $scope.toplocations[i].revenue
				};

				var locationCircle = new google.maps.Circle(circleOptions);

				google.maps.event.addListener(map, "click", function() { ib.close() });

				setMarkers(map, $scope.toplocations);
					infowindow = new google.maps.InfoWindow({
					content: "loading..."
				});
			}
			map.fitBounds(bounds);
		}

		function createMarker(site, map){
		    var siteLatLng = new google.maps.LatLng(site.latitude, site.longitude);
		    var image = 'img/MapMarker_Ball_Right_Red.png';
		    var marker = new google.maps.Marker({
			  position: siteLatLng,
			  map: map,
			  title: site.busname,
			  icon: image,
			  //animation: google.maps.Animation.DROP,
			  zIndex: site.id,
			  html: '<div id="popup"><div id="content">' + site.busname + ', ' + site.city + ' ' + site.state + '</div>' + '<dl class="dl-horizontal">' +
							'<dt><strong>' + site.activations + '</strong></dt>' +
							'<dd>Activations</dd>' +
							'<dt><strong>' + site.uses + '</strong></dt>' +
							'<dd>Used</dd>' +
							'<dt><strong>' + $filter('currency')(site.revenue) + '</strong></dt>' +
							'<dd>Revenue</dd>' +
							'</dl></div>'
		    });

		    var boxText = document.createElement("div");
		    boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
		    boxText.innerHTML = marker.html;

		    var myOptions = {
				 content: boxText,
				 disableAutoPan: false,
				 maxWidth: 0,
				 pixelOffset: new google.maps.Size(-140, 0),
				 zIndex: null,
				 boxStyle: {
					background: "url('img/tipbox.gif') no-repeat",
					opacity: 0.75,
					width: "300px"
				},
				closeBoxMargin: "10px 2px 2px 2px",
				closeBoxURL: "img/infobox-close.gif",
				infoBoxClearance: new google.maps.Size(1, 1),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false
		    };

		    google.maps.event.addListener(marker, "click", function (e) {
				ib.close();
				ib.setOptions(myOptions);
				ib.open(map, this);
		    });
		    return marker;
		}

		function setMarkers(map, markers) {
			for (var i = 0; i < markers.length; i++) {
				createMarker(markers[i], map);
			};
		}
	}
});

okd.controller('methodsCtrl', function methodsCtrl($scope, $rootScope, okdService, createApprovalURLService, updatePaypalAccountStatusService, $routeParams, $location, $timeout, $filter, ngTableParams, toaster, dialogs) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.setLoading(true);
	$rootScope.contentLoaded = false;
	var account_id = ($routeParams.account_id);

	function refresh(){
		$rootScope.setLoading(true);
		
		var paypal_method_name = '';
		var paypal_method_status = '';
		// at this point we will have to check for payment_method_id and status param and 
		// based on the values we will have to make validate service call
		// we will have to do this before we load the profile json to reflect the updated account
		if (($location.search().payment_method_id) && ($location.search().status)){
			//validation service call
			var payment_acc_details = new Object();
			payment_acc_details.enterprise_id =  $routeParams.account_id;
			payment_acc_details.payment_method_id = $location.search().payment_method_id;
			payment_acc_details.status = $location.search().status;
			updatePaypalAccountStatusService.update(payment_acc_details).then(function(data){
				if(data){
					if(data.meta.code==200){
						if (data.response.status === 'approved'){
							toaster.pop('success', "Success", "successfully added payment method " + data.response.payment_method_name + ".");
						}
						else{
							toaster.pop('error', "Unable to save payment method.", "Failed to save payment method " + data.response.payment_method_name + " because you have cancelled approval.");
						}
						// at this point error handling is done and now its safe to wipe off the query string
						$location.search('');
					}
				}
			},
			function(errorMessage){
				$rootScope.setLoading(false);
				$scope.error=errorMessage;
			});
		}

		okdService.getPaymentMethods(account_id).then(function(data){
			if(data){
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$scope.setLoading(false);
					$scope.profile = data.response;
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						$scope.account = $scope.profile.accounts[i];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;					
					}
				}
				else {
					$scope.setLoading(false);
					$location.path("/home");
				}
			}
			
			$scope.methods = [];
			$scope.transactions = [];
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					
					if ($scope.profile.accounts[i].account_id === account_id) {
						$scope.thisAccount = $scope.profile.accounts[i];
					
						for (var j = 0; j < $scope.thisAccount.payment_info.length; j++) {
							$scope.methods.push($scope.thisAccount.payment_info[j]);

							// make card number display last 4 digits
							if ($scope.methods[j].card_number) {
								$scope.methods[j].card_number_display = $scope.methods[j].card_number.substr($scope.methods[j].card_number.length - 4);
							}
							
							// make expiry date look nicer
							if ($scope.methods[j].expiry) {
								var mm = $scope.methods[j].expiry.substr(0,2);
								var yy = $scope.methods[j].expiry.substr(2,2);
								$scope.methods[j].expiry_display = mm + '/' + yy;
							}

							//credit card
							if ($scope.methods[j].payment_method_type == 'CR') {
								$scope.methods[j].type = $scope.methods[j].authority;
								$scope.methods[j].paypal = false;
							}
							//paypal
							else if ($scope.methods[j].payment_method_type == 'CP') {
								$scope.methods[j].type = 'PayPal';
								$scope.methods[j].paypal = true;
							}
							//bank account
							else if ($scope.methods[j].payment_method_type == 'CH') {
								$scope.methods[j].type = 'Bank Account';
								$scope.methods[j].paypal = false;
							}
							
							$scope.thisAccount.methods = $scope.methods;
						}
					
						for (var m = 0; m < $scope.thisAccount.transaction_history.length; m++) {
							$scope.transactions.push($scope.thisAccount.transaction_history[m]);
						}
						
						if ($scope.transactions.length > 0) {
							$scope.transactionsPartialPath = "partials/methods-transactions-container.html";
							var data = $scope.transactions;
							if(!$scope.transactionsTableParams) {
								$scope.transactionsTableParams = new ngTableParams({
									page: 1,
									count: 10,
									sorting: {
										date: 'desc'
									}
								}, {
									getData: function($defer, params) {
										var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
										params.total(data.length);
										$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
									},
									$scope: { $data: {} }
								});
							}
							else {
								$scope.transactionsTableParams.reload();
							}
						}
						
						$scope.deleteMethod = function(id) {
							for (var i = 0; i < $scope.methods.length; i++) {
								if ($scope.methods[i].payment_id === id) {									
									$scope.selectedMethod = {
										val: $scope.methods[i]
									};
									$scope.launch('confirm-delete');
								}
							}
						};
						
						$scope.viewMethod = function(id) {
							for (var i = 0; i < $scope.methods.length; i++) {
								if ($scope.methods[i].payment_id === id) {									
									$scope.selectedMethod = {
										val: $scope.methods[i]
									};
									$scope.launch('view-method');
								}
							}						
						};
						
						$scope.addToBalance = function() {
							$scope.allMethods = {
								val: $scope.thisAccount
							};
							$scope.launch('add-balance');
						};
						
						$scope.returnToBalance = function() {
							$scope.allMethods = {
								val: $scope.thisAccount
							};
							$scope.launch('return-balance');
						};

						// methods history							
						if ($scope.thisAccount.history.length > 0) {
							$scope.historyData = $filter('orderBy')($scope.thisAccount.history, "ts", reverse=true);
							$scope.historyPartialPath = "partials/history-container.html";
							$scope.modalTitle = "Payment Methods History Details";
							for (var i = 0; i < $scope.historyData.length; i++) {
								if ($scope.historyData[i].has_modal) {
									$scope.historyData[i].event_with_details = '<a href="">' + $scope.historyData[i].event + '</a>';
									$scope.historyData[i].event = '';
								}
							}
							$scope.itemsPerPage = 5;
							$scope.pagedItems = [];
							$scope.currentPage = 0;

							$scope.groupToPages = function () {
								$scope.pagedItems = [];
								for (var i = 0; i < $scope.historyData.length; i++) {
									if (i % $scope.itemsPerPage === 0) {
										$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.historyData[i] ];
									} else {
										$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.historyData[i]);
									}
								}
							};

							$scope.groupToPages();
							$scope.range = function (start, end) {
								var ret = [];
								if (!end) {
									end = start;
									start = 0;
								}
								for (var i = start; i < end; i++) {
									ret.push(i);
								}
								return ret;
							};

							$scope.prevPage = function () {
								if ($scope.currentPage > 0) {
									$scope.currentPage--;
								}
							};

							$scope.nextPage = function () {
								if ($scope.currentPage < $scope.pagedItems.length - 1) {
									$scope.currentPage++;
								}
							};

							$scope.setPage = function () {
								$scope.currentPage = this.n;
							};
						}
					}
				}
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
		});

		// get payment method types
		okdService.getPaymentTypes().then(function(data){
			$scope.paymentTypes = {
				val: data.response.payment_types
			};
		},
		function(errorMessage){
			$scope.error=errorMessage;
		});
	};

	refresh();
	
	$rootScope.$on('refreshEvent', function (event) {
		refresh();
	});
	
	$rootScope.$on('loadingTrue', function (event) {
		$scope.setLoading(true);
	});
	
	$rootScope.$on('loadingFalse', function (event) {
		$scope.setLoading(false);
	});

	$scope.launch = function(which){
		switch(which){
			// delete payment method
			case 'confirm-delete':
				var dlg = dialogs.create('/dialogs/delete-payment-method.html','DeletePaymentMethodController',$scope.selectedMethod,{keyboard:true, backdrop: true, windowClass:'dialog-confirm'});
				break;
			// view payment method details
			case 'view-method':
				var dlg = dialogs.create('/dialogs/view-payment-method.html','ViewPaymentMethodController',$scope.selectedMethod,{keyboard:true, backdrop: true, windowClass:'dialog-view-method'});
				break;
			// add payment method
			case 'add-method':
				var dlg = dialogs.create('/dialogs/add-payment-method.html','AddPaymentMethodController',$scope.paymentTypes,{keyboard:true, backdrop: true});
				break;
			// add to balance
			case 'add-balance':
				var dlg = dialogs.create('/dialogs/add-balance.html','AddBalanceController',$scope.allMethods,{keyboard:true, backdrop: true});
				break;
			// return balance
			case 'return-balance':
				var dlg = dialogs.create('/dialogs/return-balance.html','ReturnBalanceController',$scope.allMethods,{keyboard:true, backdrop: true});
				break;
		};
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('AddPaymentMethodController',function AddPaymentMethodController($scope, $rootScope, $routeParams, okdService, $modalInstance, data, toaster){
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	$scope.method = {};
	$scope.submit = function() {
		$modalInstance.close($scope.data);
		$rootScope.$emit('loadingTrue');
		if ($scope.paymentId.payment_type === "CP"){
			var paymentInfo = new Object();
			paymentInfo.payment_method_name = $scope.method.payment_method_name;
			paymentInfo.payment_method_type = $scope.paymentId.payment_type;
			paymentInfo.enterprise_id = $routeParams.account_id;
			createApprovalURLService.create(paymentInfo).then(function(data){
				if(data){
					if(data.meta.code==200){
						$scope.paypal_preapproval_url = data.response.paypal_url;
						window.location = $scope.paypal_preapproval_url;
					}
					else {
						$rootScope.$emit('loadingFalse');
						toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
					}
				}
			},
			function(errorMessage){
				$rootScope.$emit('loadingFalse');
				$scope.error=errorMessage;
				toaster.pop('error', "Unable to save payment method.", "An error occurred while saving the payment method. Please try again. If the problem persists, please contact our Support.");
			});
		}
		else { 
			var paymentInfo = new Object();
			paymentInfo.payment_method_name = $scope.method.payment_method_name;
			paymentInfo.payment_method_type = $scope.paymentId.payment_type;
			paymentInfo.authority = $scope.paymentId.payment_type_name;
			paymentInfo.card_number = $scope.method.ccn;
			paymentInfo.routing_number = $scope.method.routing_number;
			paymentInfo.account_number = $scope.method.account_number;
			paymentInfo.expiry = $scope.method.expiry;
			paymentInfo.cvv = $scope.method.cvv;
			paymentInfo.address = $scope.method.address;
			paymentInfo.city = $scope.method.city;
			paymentInfo.state = $scope.method.state;
			paymentInfo.zip_code = $scope.method.zip_code;
			paymentInfo.first_name = $scope.method.paymentCardFirstName;
			paymentInfo.last_name = $scope.method.paymentCardLastName;
			okdService.createPaymentMethod($routeParams.account_id, paymentInfo).then(function(data){
				if(data){
					$rootScope.$emit('loadingFalse');
					if(data.meta.code==200){
						toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
						$rootScope.$emit('refreshEvent');
					}
					else {
						toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
					}
				}
			},
			function(errorMessage){
				$rootScope.$emit('loadingFalse');
				$scope.error=errorMessage;
				toaster.pop('error', "Unable to save payment method.", "An error occurred while saving the payment method. Please try again. If the problem persists, please contact our Support.");
			});
		}
	};
	
	//partial for payment type
	$scope.paymentTypePartial = function() {
		$scope.paymentId = data.val.payment_type_name;
		if ($scope.paymentId != null && typeof $scope.paymentId != 'undefined') {
			if ($scope.paymentId.payment_type === "CR") {
				$scope.paymentTypePartialPath = "partials/ccSection.html";
			}
			else if ($scope.paymentId.payment_type === "CH") {
				$scope.paymentTypePartialPath = "partials/baSection.html";
			}
			else if ($scope.paymentId.payment_type === "CP") {
				$scope.paymentTypePartialPath = "partials/empty.html";
			}
		}
		else {
			$scope.paymentTypePartialPath = "partials/empty.html";
		}
	};
});

okd.controller('ViewPaymentMethodController',function ViewPaymentMethodController($scope, $rootScope, $modalInstance, data){
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
});

okd.controller('AddBalanceController',function AddBalanceController($scope, $rootScope, $routeParams, $timeout, okdService, ngTableParams, $filter, $modalInstance, data, toaster){
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	$scope.thisAccount = {};

	$timeout(function(){
		$scope.$$childTail.addBalanceForm.$setPristine();
	},100);

	$scope.submit = function() {
		$rootScope.$emit('loadingTrue');
		$modalInstance.close($scope.data);
		var paymentInfo = new Object();
		paymentInfo.account_id = $routeParams.account_id;
		paymentInfo.payment_method_id = $scope.data.val.paymentMethod;
		paymentInfo.amount = $scope.$$childTail.balance;
		$scope.transactions = [];
		okdService.addBalance(paymentInfo).then(function(data){
			if(data.meta.code==200){
				$rootScope.$emit('loadingFalse');
				toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
				// reload parent page
				$rootScope.$emit('refreshEvent');
			}
			else {
				$rootScope.$emit('loadingFalse');
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$rootScope.$emit('loadingFalse');
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to add to balance.", "An error occurred while adding to balance. Please try again. If the problem persists, please contact our Support.");
		});
	};
});

okd.controller('ReturnBalanceController',function ReturnPaymentMethodController($scope, $rootScope, $routeParams, okdService, ngTableParams, $filter, $modalInstance, data, toaster){	
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	$scope.thisAccount = {};
	$scope.selection = [];
	$scope.transactions = [];

	// toggle selection
	$scope.toggleSelection = function toggleSelection(methodID) {
		var idx = $scope.selection.indexOf(methodID);
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
		}
		else {
			$scope.selection.push(methodID);
		}
	};

	$scope.submit = function() {
		$rootScope.$emit('loadingTrue');
		$modalInstance.close($scope.data);
		var paymentInfo = new Object();
		paymentInfo.account_id = $routeParams.account_id;
		paymentInfo.payment_methods = $scope.selection;
		
		okdService.returnBalance(paymentInfo).then(function(data){
			if(data.meta.code==200){
				$rootScope.$emit('loadingFalse');
				toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
				// reload parent page
				$rootScope.$emit('refreshEvent');
			}
			else {
				$rootScope.$emit('loadingFalse');
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$rootScope.$emit('loadingFalse');
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to return to balance.", "An error occurred while returning to balance. Please try again. If the problem persists, please contact our Support.");
		});
	};
});

okd.controller('DeletePaymentMethodController',function DeletePaymentMethodController($scope, $rootScope, $routeParams, okdService, $modalInstance, data, toaster){
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	var delMethod = $scope.data.val.payment_id;

	// remove payment method
	$scope.deletePaymentMethod = function(data) {
		$rootScope.$emit('loadingTrue');
		$modalInstance.close($scope.data);
		okdService.removePaymentMethod($routeParams.account_id, delMethod).then(function(data){
			if(data.meta.code==200){
				$rootScope.$emit('loadingFalse');
				toaster.pop('success', "Success", "Payment method '" + data.response.payment_method_name +"' removed.");
				$rootScope.$emit('refreshEvent');
			}
			else {
				$rootScope.$emit('loadingFalse');
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$rootScope.$emit('loadingFalse');
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to remove payment method.", "An error occurred while removing the payment method. Please try again. If the problem persists, please contact our Support.");
		});
	};
});

okd.controller('sortTable', function sortTable($scope) {
	$scope.orderProp = 'publishDate';
	$scope.direction = false;

	$scope.sort = function(column) {
		if ($scope.orderProp === column) {
			$scope.direction = !$scope.direction;
		} else {
			$scope.orderProp = column;
			$scope.direction = false;
		}
	}
});

okd.controller('editPayments', function editPayments($scope, okdService, $routeParams, $location) {
	function refresh(){
		okdService.getAllAccounts().then(function(data){
		
			if(data){
				if(data.meta.code==200){
					$scope.profile = data.response;
				}
				else {
					$scope.profile = data.response;				
					$location.path("/home");
				}
			}
			var account_id = ($routeParams.account_id);
			
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					if ($scope.profile.accounts[i].account_id === account_id) {
						$scope.thisAccount = $scope.profile.accounts[i];
					}
				}
			}			
		},
		function(errorMessage){
			$scope.error=errorMessage;
		});
	};
 
	refresh();
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('ModalCtrl', function ModalCtrl($scope, $rootScope, $modalStack) {
	this.setModel = function(data) {
		$scope.$apply( function() {
			$scope.data = data;
		});
	}
   	$scope.setModel = this.setModel;

	// remove all modals on route change
	$rootScope.$on('$routeChangeSuccess', function() {
		$modalStack.dismissAll('route change');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	});
});

okd.controller('settingsCtrl', function SettingsCtrl($scope, $rootScope, okdService, $location, $filter, toaster, sharedProperties) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.setLoading(true);
	$rootScope.contentLoaded = false;
	// set active menu in sidebar
	// when settings items are clicked
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};
	$scope.stringValue = sharedProperties.getString;
	$scope.objectValue = sharedProperties.getObject();
	$scope.setString = function(newValue) {
		$scope.objectValue.data = newValue;
		sharedProperties.setString(newValue);
		$scope.menuActive = newValue;
	};

	function refresh(){
		okdService.getAllAccounts().then(function(data){
			$rootScope.setLoading(false);
			if(data){
				if(data.meta.code==200){
					$scope.profile = data.response;
					$rootScope.contentLoaded = true;
					for (var s = 0; s < $scope.profile.accounts.length; s++) {
						$scope.account = $scope.profile.accounts[s];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;
						
						// settings history
						$scope.history = $filter('orderBy')($scope.account.history, "ts", reverse=true);

						// events modal
						for (var h = 0; h < $scope.history.length; h++) {
							if ($scope.history[h].has_modal) {
								$scope.history[h].event_with_details = '<a href="">' + $scope.history[h].event + '</a>';
								$scope.history[h].event = '';
							}
						}

						// old school pagination
						$scope.prevPage = function (account) {
							if (account.currentPage > 0) {
								account.currentPage--;
							}
						};

						$scope.nextPage = function (account) {
							if (account.currentPage < account.pagedItems.length - 1) {
								account.currentPage++;
							}
						};

						$scope.setPage = function (account) {
							account.currentPage = this.n;
						};

						$scope.account.itemsPerPage = 5;
						$scope.account.pagedItems = [];
						$scope.account.currentPage = 0;

						$scope.groupToPages = function () {
							$scope.account.pagedItems = [];
							for (var i = 0; i < $scope.history.length; i++) {
								if (i % $scope.account.itemsPerPage === 0) {
									$scope.account.pagedItems[Math.floor(i / $scope.account.itemsPerPage)] = [ $scope.history[i] ];
								} else {
									$scope.account.pagedItems[Math.floor(i / $scope.account.itemsPerPage)].push($scope.history[i]);
								}
							}
						};
						
						$scope.groupToPages();
					
						$scope.range = function (start, end) {
							var ret = [];
							if (!end) {
								end = start;
								start = 0;
							}
							for (var i = start; i < end; i++) {
								ret.push(i);
							}
							return ret;
						};
						// end pagination						
					}
				}
				else {
					$scope.profile = data.response;			
					$location.path("/home");
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to open accounts.", "An error occurred while opening the accounts. Please try again. If the problem persists, please contact our Support.");
		});
  	};
  	
	refresh();
	
	$scope.updateAccount = function(accountId, accountName) {
		$scope.setLoading(true);
		var accountInfo = new Object();
		accountInfo.account_name = accountName;
		okdService.updateAccount(accountId, accountInfo).then(function(data){
			$scope.setLoading(false);
			if(data){
				if(data.meta.code==200){
					toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
					refresh();
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to update account.", "An error occurred while updating the account. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	$scope.updateProfile = function(field, info) {
		$scope.setLoading(true);
		var profileInfo = new Object();
		profileInfo.action_type = 'Edit';
		var propName = field;
		profileInfo[propName] = info;
		okdService.updateProfile(profileInfo).then(function(data){
			$scope.setLoading(false);
			if(data){
				if(data.meta.code==200){
					toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
					refresh();
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to update profile.", "An error occurred while updating your profile. Please try again. If the problem persists, please contact our Support.");
		});;
	};
	
	$scope.logout = function() {
		okdService.logout().then(function(data){
			if(data.meta.code==200){
				$location.path("/home");
			}
			else {
				$location.path("/home");
			}
		},
		function(errorMessage){
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to logout.", "Please try again. If the problem persists, please contact our Support.");
		});	
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('passwordCtrl', function passwordCtrl($scope, $rootScope, $location, okdService, toaster) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.contentLoaded = false;
	$rootScope.setLoading(true);
	function refresh(){
		okdService.getAllAccounts().then(function(data){
			if(data){				
				if(data.meta.code==200){
					$rootScope.setLoading(false);
					$rootScope.contentLoaded = true;
					$scope.profile = data.response;
					for (var s = 0; s < $scope.profile.accounts.length; s++) {
						$scope.account = $scope.profile.accounts[s];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;
					}
				}
				else {
					$rootScope.setLoading(false);
					$scope.profile = data.response;
					$location.path("/home");
				}
			}
			
			for (var i = 0; i < $scope.profile.accounts.length; i++) {
				$scope.account = $scope.profile.accounts[i];
			}			
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
  	};
 
	refresh();

	function populateProfileData(actionType){
		var profileInfo = new Object();
		profileInfo.action_type = actionType;
		profileInfo.password = $scope.profile.currentPassword;
		profileInfo.newPassword = $scope.profile.newPassword;
		profileInfo.verifyPassword = $scope.profile.verifyPassword;
		return profileInfo;
	};

	$scope.submitted = false;
	$scope.submit = function() {
		if ($scope.passwordForm.$valid) {
			$scope.setLoading(true);
			okdService.updateProfile(populateProfileData('Edit')).then(function(data){
				if(data){
					if(data.meta.code==200){
						$scope.setLoading(false);
						toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
						refresh();
					}
					else {
						$scope.setLoading(false);
						toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
					}
				}
				else {
					$scope.setLoading(false);
					toaster.pop('error', "Unable to update profile.", "An error occurred while updating your profile. Please try again. If the problem persists, please contact our Support.");
				}
			},
			function(errorMessage){
				$scope.setLoading(false);
				$scope.error=errorMessage;
				toaster.pop('error', "Unable to update profile.", "An error occurred while updating your profile. Please try again. If the problem persists, please contact our Support.");
			});
		} else {
			$scope.passwordForm.submitted = true;
		}
	};
	
	$scope.cancel = function() {
		$location.path("/settings");
	};

	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('accountImageCtrl', function accountImageCtrl($scope, $rootScope, okdService, uploadService, $routeParams, $location, toaster) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.setLoading(true);
	$rootScope.contentLoaded = false;
	var accountId = ($routeParams.account_id);
	function refresh(){
		okdService.getAccountByID(accountId).then(function(data){
			$rootScope.setLoading(false);
			if(data){
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$scope.profile = data.response;
				}
				else {
					$scope.profile = data.response;	
					$location.path("/home");
				}
			}
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
					$scope.account.draft = $scope.account.offer_count.draft;
					$scope.account.pending = $scope.account.offer_count.pending;
					$scope.account.approved = $scope.account.offer_count.approved;
					$scope.account.running = $scope.account.offer_count.running;
					$scope.account.completed = $scope.account.offer_count.completed;
					$scope.account.archived = $scope.account.offer_count.archived;

					if ($scope.profile.accounts[i].account_id === accountId) {
						$scope.thisAccount = $scope.profile.accounts[i];
					}
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
		});
  	};
  	
	refresh();
	
	$scope.cancel = function() {
		$location.path("/settings");
	};

	$scope.updateImage = function() {
		$scope.setLoading(true);
		var imageInfo = new Object();
		if(typeof($scope.uploadReturn.successData) != "undefined") {
			imageInfo.image_name = $scope.uploadReturn.successData.name;
		}

		okdService.updateAccount(accountId, imageInfo).then(function(data){
			$scope.setLoading(false);
			if(data){
				if(data.meta.code==200){
					toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
					$location.path("/settings");
				}
				else {
					toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
				}
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to update account.", "An error occurred while updating the account. Please try again. If the problem persists, please contact our Support.");
		});
	};	
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	//upload image
	$scope.uploadLayer = function(e, data, process) {
		return $scope.uploadReturn = uploadService.process(e, data, process);
	};
	return $scope.uploadReturn = uploadService.initialize();

});

okd.controller('membersCtrl', function membersCtrl($scope, okdService, $rootScope, $routeParams, $location, $timeout, $filter, toaster, dialogs) {
	$rootScope.setLoading = function(loading) {
		$rootScope.isLoading = loading;
	}
	$rootScope.contentLoaded = false;
	var account_id = ($routeParams.account_id);
	function refresh(){
		$rootScope.setLoading(true);
		okdService.getMembers(account_id).then(function(data){
			if(data){
				$rootScope.setLoading(false);
				$rootScope.contentLoaded = true;
				if(data.meta.code==200){
					$scope.profile = data.response;
					for (var i = 0; i < $scope.profile.accounts.length; i++) {
						$scope.account = $scope.profile.accounts[i];
						$scope.account.is_approver_required == true ? $scope.account.approverRequired = true : $scope.account.approverRequired = false;
						$scope.account.draft = $scope.account.offer_count.draft;
						$scope.account.pending = $scope.account.offer_count.pending;
						$scope.account.approved = $scope.account.offer_count.approved;
						$scope.account.running = $scope.account.offer_count.running;
						$scope.account.completed = $scope.account.offer_count.completed;
						$scope.account.archived = $scope.account.offer_count.archived;					
					}
				}
				else {
					$scope.profile = data.response;
					$location.path("/home");
				}
			}

			$scope.members = [];
			$scope.pendingmembers = [];
			if ($scope.profile && $scope.profile.accounts) {
				for (var i = 0; i < $scope.profile.accounts.length; i++) {
					$scope.account = $scope.profile.accounts[i];
					if ($scope.profile.accounts[i].account_id === account_id) {
						$scope.thisAccount = $scope.profile.accounts[i];
						for (var j = 0; j < $scope.thisAccount.members.length; j++) {
							
							if($scope.thisAccount.members[j].status == 'ACTIVE') {
								$scope.members.push($scope.thisAccount.members[j]);
							}
							else if ($scope.thisAccount.members[j].status == 'PENDING') {
								$scope.pendingmembers.push($scope.thisAccount.members[j]);
							}
						}

						// members history							
						if ($scope.thisAccount.history.length > 0) {
							$scope.historyPartialPath = "partials/history-container.html";
							$scope.modalTitle = "Team Members History Details";
							$scope.historyData = $filter('orderBy')($scope.thisAccount.history, "ts", reverse=true);
							for (var i = 0; i < $scope.historyData.length; i++) {
								if ($scope.historyData[i].has_modal) {
									$scope.historyData[i].event_with_details = '<a href="">' + $scope.historyData[i].event + '</a>';
									$scope.historyData[i].event = '';
								}
							}
							$scope.itemsPerPage = 5;
							$scope.pagedItems = [];
							$scope.currentPage = 0;

							$scope.groupToPages = function () {
								$scope.pagedItems = [];
								for (var i = 0; i < $scope.historyData.length; i++) {
									if (i % $scope.itemsPerPage === 0) {
										$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.historyData[i] ];
									} else {
										$scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.historyData[i]);
									}
								}
							};

							$scope.groupToPages();
							$scope.range = function (start, end) {
								var ret = [];
								if (!end) {
									end = start;
									start = 0;
								}
								for (var i = start; i < end; i++) {
									ret.push(i);
								}
								return ret;
							};

							$scope.prevPage = function () {
								if ($scope.currentPage > 0) {
									$scope.currentPage--;
								}
							};

							$scope.nextPage = function () {
								if ($scope.currentPage < $scope.pagedItems.length - 1) {
									$scope.currentPage++;
								}
							};

							$scope.setPage = function () {
								$scope.currentPage = this.n;
							};
						}
						$scope.editMember = function(id) {
							for (var i = 0; i < $scope.thisAccount.members.length; i++) {
								if ($scope.thisAccount.members[i].member_id === id) {									
									$scope.selectedMember = {
										val: $scope.thisAccount.members[i]
									};

									$scope.launch('edit-member');
								}
							}
						};
					}
				}
			}
		},
		function(errorMessage){
			$rootScope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to get members data.", "Please try again. If the problem persists, please contact our Support.");
		});
	};
 
	refresh();
	
	$rootScope.$on('refreshEvent', function (event) {
		refresh();
	});
	
	$scope.launch = function(which){
		switch(which){
			// Invite
			case 'invite':
				var dlg = dialogs.create('/dialogs/invite.html','inviteCtrl',{},{keyboard: true, backdrop: true});
				break;
			// Edit Member
			case 'edit-member':
				var dlg = dialogs.create('/dialogs/edit-member.html','editTeamMemberCtrl',$scope.selectedMember,{keyboard: true, backdrop: true});
				break;
		};
	};
	
	// remove active member
	$scope.deleteMember = function(id) {
		$scope.setLoading(true);
		var memberInfo = new Object();
		memberInfo.member_id = id;
		okdService.removeMembers($routeParams.account_id, memberInfo).then(function(data){
			$scope.setLoading(false);
			if(data.meta.code==200){
				toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
				refresh();
			}
			else {
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to remove team member.", "An error occurred while removing the team member. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	// remove pending member
	$scope.deletePendingMember = function(id) {
		$scope.setLoading(true);
		var memberInfo = new Object();
		memberInfo.member_id = id;
		okdService.removeMembers($routeParams.account_id, memberInfo).then(function(data){
			$scope.setLoading(false);
			if(data.meta.code==200){
				toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
				refresh();
			}
			else {
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to remove team member.", "An error occurred while removing the team member. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	$scope.resendInvite = function(id) {
		$scope.setLoading(true);
		var memberInfo = new Object();
		memberInfo.member_id = id;
		okdService.resendInvite($routeParams.account_id, memberInfo).then(function(data){
			$scope.setLoading(false);
			if(data.meta.code==200){
				toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
				refresh();
			}
			else {
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to send invitation.", "An error occurred while resending the invitation. Please try again. If the problem persists, please contact our Support.");
		});
	};
	
	$scope.slideLeft = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
	
	$scope.slideRight = function() {
		$scope.boolChangeClass = !$scope.boolChangeClass;
		$scope.$parent.boolChangeClass = !$scope.$parent.boolChangeClass;
	};
});

okd.controller('inviteCtrl',function($scope, $rootScope, $routeParams, okdService, $modalInstance, data, toaster){
	$scope.setLoading = function(loading) {
		$scope.isLoading = loading;
	};
	$scope.invitation = {invitename : '', inviteemail : ''};
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	//submit invite
	$scope.invitation = {};
	$scope.submitInvite = function() {
		$scope.setLoading(true);
		$modalInstance.close($scope.invitation);
		var memberInfo = new Object();
		memberInfo.name = $scope.invitation.name;
		memberInfo.email = $scope.invitation.email;
		okdService.createMembers($routeParams.account_id, memberInfo).then(function(data){
			$scope.setLoading(false);
			if(data.meta.code==200){
				$timeout(function(){
					$rootScope.$emit('refreshEvent');
					toaster.pop('success', "Success", "Member invitation has been sent.");
				},100);
			}
			else {
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Failed to invite member.", "An error occurred while inviting member. Please try again. If the problem persists, please contact our Support.");
		});
	};
});

okd.controller('editTeamMemberCtrl',function editTeamMemberCtrl($scope, $rootScope, $routeParams, okdService, $modalInstance, data, toaster){
	$scope.setLoading = function(loading) {
		$scope.isLoading = loading;
	};
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	// saved edit
	$scope.editMember = function(data) {
		$scope.setLoading(true);
		$modalInstance.close($scope.data);
		var memberInfo = new Object();
		memberInfo.member_id = $scope.data.val.member_id;
		memberInfo.name = $scope.data.val.name;
		memberInfo.email = $scope.data.val.email;
		okdService.updateMembers($routeParams.account_id, memberInfo).then(function(data){
			$scope.setLoading(false);
			if(data.meta.code==200){
				$rootScope.$emit('refreshEvent');
				toaster.pop('success', data.meta.message.title, data.meta.message.subtitle);
			}
			else {
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to update team member.", "An error occurred while updating the team member. Please try again. If the problem persists, please contact our Support.");
		});
	};

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.data,null) || angular.equals($scope.data,'')))
			$scope.editMember();
	};
});

okd.controller('ButtonsController', ['buttonConfig', function(buttonConfig) {
	this.activeClass = buttonConfig.activeClass || 'active';
	this.toggleEvent = buttonConfig.toggleEvent || 'click';
}]);

okd.controller('SidebarController', function SidebarController($scope, $rootScope, $location, sharedProperties) {
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};
	$scope.stringValue = sharedProperties.getString;
	$scope.objectValue = sharedProperties.getObject();
	$scope.setString = function(newValue) {
		$scope.objectValue.data = newValue;
		sharedProperties.setString(newValue);
		$scope.menuActive = newValue;
	};
	
	$scope.menuActive = $scope.stringValue();
	
	$scope.filterArchived = function(offer) {
		return offer.status !== "ARCHIVED";
	};
});

okd.controller('historyModalCtrl',function historyModalCtrl($scope, $rootScope, $routeParams, okdService, $modalInstance, data, toaster){
	$scope.setLoading = function(loading) {
		$scope.isLoading = loading;
	};
	$scope.cancel = function(){
		$modalInstance.dismiss('canceled');
	};
	$scope.data = data;
	console.log(data);
});

okd.controller('UsageChartController', function UsageChartController($scope, okdService, $routeParams, $timeout, toaster) {
	// this function finds the maximum value from the chart data array
	// input to this function is $scope.rows 
	// this function will populate the ticks array as required by google charts api
	// this expects an integer input param vx to be an integer 
	
	function getTicks(data){
		// default value of the max(vx) is 10
		var vx = 10;
		if(data){
			for (var i = 0; i < data.length; i++){
				var row = data[i];
				if ( row.c){
					for (var j = 1; j < row.c.length; j++){
						if (row.c[j].v){
							thisv = row.c[j].v;
							thisnumber = parseInt(thisv);
							if ( thisnumber === 'NaN'){
								// nothing to be done but this case shouldn't arise
							}
							else{
								if (thisnumber > vx){
									vx = thisnumber
								}
							}
						}
					}
				}
			}
		}			
		var N = 1;
		var R = vx % 10;
		var plots = [];
		if (R === 0) {
			N = vx / 10;
		} else {
			N = vx / 10;
			N = N + 1;
		}
		for (var i = 0; i <= 10; i++) {
			plots[i] = N * i;
		}

		return plots;
	};
	// end of getTicks

	var chart1 = {};
	chart1.type = "ColumnChart";
	chart1.displayed = false;
	chart1.cssStyle = "height:500px; width:100%;";

	$scope.thisOffer.minDate = $scope.thisOffer.usage_start;
	$scope.thisOffer.maxDate = $scope.thisOffer.usage_end;
	$scope.chartdates = {startDate: moment($scope.thisOffer.usage_start), endDate: moment($scope.thisOffer.usage_end)};

	$scope.refreshChart = function() {
		$scope.$parent.setLoading(true);
		
		var newStartDate = moment($scope.chartdates.startDate).format('YYYY-MM-DD');
		var newEndDate = moment($scope.chartdates.endDate).format('YYYY-MM-DD');
		
		$scope.thisOffer.chartStartDate = newStartDate;
		$scope.thisOffer.chartEndDate = newEndDate;
	
		okdService.refreshChart($routeParams.account_id, $routeParams.offer_id, newStartDate, newEndDate).then(function(data){
			$scope.$parent.setLoading(false);
			if(data.meta.code==200){
				for (var i = 0; i < data.response.usage.length; i++) {
					$scope.rows = data.response.usage[i].rows;
				}
				chart1.data = {"cols": [
					{"id": "day", "label": "Day", "type": "string"},
					{"id": "claims-id", "label": "Claimed", "type": "number"},
					{"id": "loads-id", "label": "Activated", "type": "number"},
					{"id": "redeems-id", "label": "Used", "type": "number"},
					], "rows": $scope.rows
				};
			}
			else {
				$scope.$parent.setLoading(false);
				toaster.pop('error', data.meta.message.title, data.meta.message.subtitle);
			}
		},
		function(errorMessage){
			$scope.$parent.setLoading(false);
			$scope.error=errorMessage;
			toaster.pop('error', "Unable to refresh chart.", "An error occurred while refreshing the chart. Please try again. If the problem persists, please contact our Support.");
		});
	};

	for (var i = 0; i < $scope.thisOffer.usage.length; i++) {
		$scope.rows = $scope.thisOffer.usage[i].rows;
	}

	chart1.data = {"cols": [
		{"id": "day", "label": "Day", "type": "string"},
		{"id": "claims-id", "label": "Claimed", "type": "number"},
		{"id": "loads-id", "label": "Activated", "type": "number"},
		{"id": "redeems-id", "label": "Used", "type": "number"},
		], "rows": $scope.rows
	};

	chart1.options = {
			"title": "Usage per day",
			"pointSize": 3,
			"isStacked": "false",
			"fill": 20,
			"displayExactValues": true,
			"colors": ['#35bed4', '#bfe673', '#99cc33'],
			"tooltip": {showColorCode: true},
			"legend": {"position": "none"},
			"focusTarget": "category",
			"vAxis": {
				"format": '#',
				//"minorGridlines": {"count": 5},
				//"gridlines": {"count": 8},
				//"ticks": getTicks($scope.rows)
				"gridlines": {"count": -1}
			}
	};
	
	if ($scope.rows) {
		$scope.chart = chart1;
	}

});