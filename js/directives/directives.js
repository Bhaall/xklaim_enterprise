'use strict';

okd.directive('sidebarToggle', function () {
	return {
		link: function (scope, element, attrs) {
			$(element).click(function () {
				scope.boolChangeClass = !scope.boolChangeClass;
				scope.$apply();
				
				scope.$parent.boolChangeClass = !scope.$parent.boolChangeClass;
				scope.$parent.$apply();
			});
		}
	};	
});

okd.directive('charLimit', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var limit = attrs.charLimit;
			element.bind('keypress', function(event){
				if (element.val().length >= limit){
					if (event.keyCode != 8){
						event.preventDefault();
					}
				}
			});
		}
	};
});

okd.directive("passwordVerify", function() {
	return {
		require: "ngModel",
		scope: {
			passwordVerify: '='
		},
		link: function(scope, element, attrs, ctrl) {
			scope.$watch(function() {
				var combined;
				if (scope.passwordVerify || ctrl.$viewValue) {
					combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
				}                    
				return combined;
			}, function(value) {
				if (value) {
					ctrl.$parsers.unshift(function(viewValue) {
						var origin = scope.passwordVerify;
						if (origin !== viewValue) {
							ctrl.$setValidity("passwordVerify", false);
							return undefined;
						} else {
							ctrl.$setValidity("passwordVerify", true);
							return viewValue;
						}
					});
				}
			});
		}
	};
});

okd.directive('validRouting',function(){
	return {
		require: "ngModel",
		link: function(scope, elm, attrs, ctrl) {

			var validator = function(value) {
				var i, n, t, c;
				t = "";
				
				if(value) {
					for (i = 0; i < value.length; i++) {
						c = parseInt(value.charAt(i), 10);
						if (c >= 0 && c <= 9)
							t = t + c;
					}

					if (t.length != 9) {
						return false;
					}

					n = 0;
					for (i = 0; i < t.length; i += 3) {
						n += parseInt(t.charAt(i),     10) * 3
						+  parseInt(t.charAt(i + 1), 10) * 7
						+  parseInt(t.charAt(i + 2), 10);
					}

					if (n != 0 && n % 10 == 0) {
						ctrl.$setValidity('validRouting', true);
						return value;
					}
					else {
						ctrl.$setValidity('validRouting', false);
						return false;
					}
				}

			};

			ctrl.$parsers.unshift(validator);
			ctrl.$formatters.unshift(validator);
		}
	};
});



okd.directive('equals', function() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, elem, attrs, ngModel) {
			if(!ngModel) return;
			scope.$watch(attrs.ngModel, function() {
				validate();
			});

			attrs.$observe('equals', function (val) {
				validate();
			});

			var validate = function() {
				var val1 = ngModel.$viewValue;
				var val2 = attrs.equals;

				ngModel.$setValidity('equals', val1 === val2);
			};
		}
	}
});

okd.directive("disableField", function(){
	return {
		require:"ngModel",
		link: function(scope, element, attr, ngModel){
			scope.$watch('disabled', function() {
				if (scope.disabled==true) {
					element.prop('disabled',true);
				}
				else {
					element.prop('disabled',false)
				}
			});
		}
	}
});

okd.directive('file', function(){
	return {
		scope: {
			file: '='
		},
		link: function(scope, el, attrs){
			el.bind('change', function(event){
				var files = event.target.files;
				//right now we are supporting only single file upload
				var file = files[0];
				//scope.file = file ? file.name : undefined;
				//scope.$apply();
				scope.$emit("fileSelected", { file: files[0] });
			});
		}
	};
});

okd.directive("fileupload", function() {
	return {
		restrict: "A",
		scope: {
			done: "&",
			progress: "&",
			fail: "&",
			uploadurl: "=",
			customdata: "&",
			file: "="
		},
		link: function(scope, elem, attrs) {
			var uploadOptions;
			elem.bind('change', function(event){
				var files = event.target.files;
				var file = files[0];
				scope.$emit("fileSelected", { file: files[0] });
			});
			uploadOptions = {
				url: scope.uploadurl,
				maxFileSize: 1000,
				acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
				dataType: "json"
			};
			if (scope.done) {
				uploadOptions.done = function(e, data) {
					return scope.$apply(function() {
						return scope.done({
							e: e,
							data: data
						});
					});
				};
			}
			if (scope.fail) {
				uploadOptions.fail = function(e, data) {
					return scope.$apply(function() {
						return scope.fail({
							e: e,
							data: data
						});
					});
				};
			}
			if (scope.progress) {
				uploadOptions.progress = function(e, data) {
					return scope.$apply(function() {
						return scope.progress({
							e: e,
							data: data
						});
					});
				};
			}
			return elem.fileupload(uploadOptions).bind("fileuploadsubmit", function(e, data) {
				return data.formData = {
					params: JSON.stringify(scope.customdata())
				};
			});
		}
	};
});

// focus
okd.directive('focusMe', function($timeout) {
	return {
		restrict:'EA',
		link: function(scope, element) {
			$timeout(function() {
				element.focus();
			}, 100);
		}
  	};
});

// stop event propagation
okd.directive('stopEvent', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			element.bind(attr.stopEvent, function (e) {
				e.stopPropagation();
			});
		}
	};
});

okd.directive('noClick', function () {
	return {
		restrict: 'A',
		link: function (scope, element) {
			element.click(function (eventObject) {
				eventObject.preventDefault();
			});
		}
	};
});

okd.directive('focusIf', ['$timeout', function ($timeout) {
	return function focusIf(scope, element, attr) {
		scope.$watch(attr.focusIf, function (newVal) {
			if (newVal) {
				scope.$evalAsync(function() {
					$timeout(function(){
						element[0].focus();
					},2000);
				});
			}
		});
	}
}]);


okd.directive('focusNow', ['$timeout', function ($timeout) {
	return function focusNow(scope, element, attr) {
		scope.$watch(attr.focusNow, function (newVal) {
			if (newVal) {
				$timeout(function(){
					element.focus();
				},500);
			}
		});
	}
}]);

okd.directive('focusLocationsInput', function($timeout) {
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				$timeout(function() {
					element.parents().find('table:first').find('tr:last').find('input')[0].focus();
				});
			});
		}
	};
});

okd.directive('focusDeleteLocationsInput', function($timeout, $document) {
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				$timeout(function() {
					$document.find('table:first').find('tr:last').find('input')[0].focus();
				}, 100, true);
			});
		}
	};
});

okd.directive('focusBeaconsInput', function($timeout) {
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				$timeout(function() {					
					element.parents().find('table.beacons').find('tr:last').find('input')[0].focus();
				});
			});
		}
	};
});

okd.directive('focusDeleteBeaconsInput', function($timeout, $document) {
	return {
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				$timeout(function() {
					$document.find('table.beacons').find('tr:last').find('input')[0].focus();
				}, 100, true);
			});
		}
	};
});

okd.directive('autoFillableField', function() {
	return {
		restrict: "A",
		require: "?ngModel",
		link: function(scope, element, attrs, ngModel) {
			setInterval(function() {
				var prev_val = '';
				if (!angular.isUndefined(attrs.xAutoFillPrevVal)) {
					prev_val = attrs.xAutoFillPrevVal;
				}
				if (element.val()!=prev_val) {
					if (!angular.isUndefined(ngModel)) {
						if (!(element.val()=='' && ngModel.$pristine)) {
							attrs.xAutoFillPrevVal = element.val();
							scope.$apply(function() {
								ngModel.$setViewValue(element.val());
							});
						}
					}
					else {
						element.trigger('input');
						element.trigger('change');
						element.trigger('keyup');
						attrs.xAutoFillPrevVal = element.val();
					}
				}
			}, 300);
		}
	};
});

okd.directive('dateRange', function ($compile, $parse, $log) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function ($scope, $element, $attributes, ngModel) {
			if ($attributes.type !== 'daterange') return;
			var d = new Date();
			var x = 1;
			d.setDate(d.getDate() - x);
			var options = {};
			options.format = $attributes.format || 'YYYY-MM-DD h:mm A';
			options.separator = $attributes.separator || ' - ';
			options.timePicker = $attributes.timepicker;
			if ($attributes.timepicker == 'true') {
				options.timePicker = true;
			}
			else if ($attributes.timepicker == 'false') {
				options.timePicker = false;
			}
			options.timePickerIncrement = 15;
			if ($attributes.minDate) {
				options.minDate = $attributes.minDate && moment($attributes.minDate);
			}
			else {
				options.minDate = d;
			}
			options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
			options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) { return index === 0 && parseInt(elem, 10) || elem; }) );
			options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);

			function format(date) {
				return date.format(options.format);
			}

			function formatted(dates) {
				return [format(dates.startDate), format(dates.endDate)].join(options.separator);
			}

			ngModel.$formatters.unshift(function (modelValue) {
				if (!modelValue) return '';
				return modelValue;
			});

			ngModel.$parsers.unshift(function (viewValue) {
				return viewValue;
			});

			ngModel.$render = function () {
				if (!ngModel.$viewValue || !ngModel.$viewValue.startDate) return;
				$element.val(formatted(ngModel.$viewValue));
			};

			$scope.$watch($attributes.ngModel, function (modelValue) {
				if (!modelValue || (!modelValue.startDate)) {
					ngModel.$setViewValue({ startDate: moment().startOf('day'), endDate: moment().startOf('day') });
					return;
				}
				$element.data('daterangepicker').startDate = modelValue.startDate;
				$element.data('daterangepicker').endDate = modelValue.endDate;				
				$element.data('daterangepicker').updateInputText();
				$element.data('daterangepicker').updateView();
				$element.data('daterangepicker').updateCalendars();
			});

			$element.daterangepicker(options, function(start, end) {
				$scope.$apply(function () {
					ngModel.$setViewValue({ startDate: start, endDate: end });
					ngModel.$render();
				});
			});			
		}
	};
});

okd.directive('bsSelect', [
	'$timeout',
	function ($timeout) {
		var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function postLink(scope, element, attrs, controller) {
				var options = scope.$eval(attrs.bsSelect) || {};
				$timeout(function () {
					element.selectpicker(options);
					element.next().removeClass('ng-scope');
				});
				if (controller) {
					scope.$watch(attrs.ngModel, function (newValue, oldValue) {
						if (newValue !== oldValue) {
							element.selectpicker('refresh');
						}
					});
				}
			}
		};
	}
]);

okd.directive('bsSelectnew', ['$timeout', '$parse', function ($timeout, $parse) {
	return {
		restrict: 'A',
		require: '?ngModel',
		priority: 1001,
		compile: function (tElement, tAttrs, transclude) {
			tElement.selectpicker($parse(tAttrs.selectpicker)());
			return function (scope, element, attrs, ngModel) {
				if (angular.isUndefined(ngModel)){
					return;
				}

				scope.$watch(attrs.ngModel, function () {
					$timeout(function () {
						element.selectpicker('val', element.val());
						element.selectpicker('refresh');
					});
				});

				ngModel.$render = function () {
					$timeout(function () {
						element.selectpicker('val', ngModel.$viewValue || '');
						element.selectpicker('refresh');
					});
				};

				ngModel.$viewValue = element.val();
			};
		}
        
	};
}]);

okd.directive('viewOffers', function ($location) {
	return {
		link: function (scope, element, attrs) {
			$(element).click(function () {			
				var link = element.attr("data-url");
				$location.path(link).replace();
			});
		}
	};	
});

okd.directive('navMenu', function($location) {
	return function(scope, element, attrs) {
		var links = element.find('a'),
			onClass = attrs.navMenu || 'active',
			routePattern,
			link,
			url,
			currentLink,
			urlMap = {},
			i;

		if (!$location.$$html5) {
			routePattern = /^#[^/]*/;
		}

		for (i = 0; i < links.length; i++) {
			link = angular.element(links[i]);
			url = link.attr('href');

			if ($location.$$html5) {
				urlMap[url] = link;
			} else {
				urlMap[url.replace(routePattern, '')] = link;
			}
		}

		scope.$on('$routeChangeStart', function() {
			var pathLink = urlMap[$location.path()];
			if (pathLink) {
				if (currentLink) {
					currentLink.removeClass(onClass);
				}
				currentLink = pathLink;
				currentLink.addClass(onClass);
			}
		});
	};
});

okd.constant('buttonConfig', {
	activeClass: 'active',
	toggleEvent: 'click'
});


okd.directive('btnRadio', function () {
	return {
		require: ['btnRadio', 'ngModel'],
		controller: 'ButtonsController',
		link: function (scope, element, attrs, ctrls) {
			var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

			//model -> UI
			ngModelCtrl.$render = function () {
				element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
			};

			//ui->model
			element.bind(buttonsCtrl.toggleEvent, function () {
				if (!element.hasClass(buttonsCtrl.activeClass)) {
					scope.$apply(function () {
						ngModelCtrl.$setViewValue(scope.$eval(attrs.btnRadio));
						ngModelCtrl.$render();
					});
				}
			});
		}
	};
});

// dependency: moment.js
okd.directive('year', function() {
	return {
		restrict: 'E',
		link: function (scope, el, at) {
			scope.$watch(at.datetime, function () {
				el.text((moment()).format("YYYY"));
			});
		}
	};
});

okd.directive('classToggle', function () {
	return {
		link: function (scope, element, attrs) {
			var classes = attrs.toggler.split(',');
			$(element).click(function () {
				angular.forEach(classes, function (value) {
					(element.hasClass(value)) ? element.removeClass(value) : element.addClass(value);
				});
			});
		}
	};	
});



// popover and tooltips
okd.directive( 'popoverPopup', function () {
	return {
		restrict: 'EA',
		replace: true,
		scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
		templateUrl: 'partials/popover.html'
	};
});

okd.directive( 'popover', [ '$tooltip', function ( $tooltip ) {
	return $tooltip( 'popover', 'popover', 'click' );
}]);

okd.directive( 'popoverTemplatePopup', function () {
	return {
		restrict: 'EA',
		replace: true,
		scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&', template: '@' },
		templateUrl: 'template/popover/popover-template.html'
	};
});

okd.directive( 'popoverTemplate', [ '$tooltip', function ( $tooltip ) {
	return $tooltip( 'popoverTemplate', 'popover', 'click' );
}]);

okd.provider( '$tooltip', function () {
	var defaultOptions = {
		placement: 'top',
		animation: true,
		popupDelay: 0
	};

	var triggerMap = {
		'mouseenter': 'mouseleave',
		'click': 'click',
		'focus': 'blur'
	};

	var globalOptions = {};
  
	this.options = function( value ) {
		angular.extend( globalOptions, value );
	};

	function snake_case(name){
		var regexp = /[A-Z]/g;
		var separator = '-';
		return name.replace(regexp, function(letter, pos) {
			return (pos ? separator : '') + letter.toLowerCase();
		});
	}

	this.$get = [ '$window', '$compile', '$timeout', '$parse', '$document', '$position', function ( $window, $compile, $timeout, $parse, $document, $position ) {
		return function $tooltip ( type, prefix, defaultTriggerShow ) {
			var options = angular.extend( {}, defaultOptions, globalOptions );

			function setTriggers ( trigger ) {
				var show, hide;
				show = trigger || options.trigger || defaultTriggerShow;
				if ( angular.isDefined ( options.trigger ) ) {
					hide = triggerMap[options.trigger] || show;
				} else {
					hide = triggerMap[show] || show;
				}

				return {
					show: show,
					hide: hide
				};
			}

			var directiveName = snake_case( type );
			var triggers = setTriggers( undefined );

			var template = 
				'<'+ directiveName +'-popup '+
				'title="{{tt_title}}" '+
				'content="{{tt_content}}" '+
				'placement="{{tt_placement}}" '+
				'animation="tt_animation()" '+
				'is-open="tt_isOpen" '+
				'template="{{tt_template}}"'+
				'>'+
				'</'+ directiveName +'-popup>';

			return {
				restrict: 'EA',
				scope: true,
				link: function link ( scope, element, attrs ) {
					var tooltip = $compile( template )( scope );
					var transitionTimeout;
					var popupTimeout;
					var $body;

					scope.tt_isOpen = false;

					function toggleTooltipBind () {
						if ( ! scope.tt_isOpen ) {
							showTooltipBind();
						} else {
							hideTooltipBind();
						}
					}

					function showTooltipBind() {
						if ( scope.tt_popupDelay ) {
							popupTimeout = $timeout( show, scope.tt_popupDelay );
						} else {
							scope.$apply( show );
						}
					}

					function hideTooltipBind () {
						scope.$apply(function () {
							hide();
						});
					}

					function show() {
						var position,
						ttWidth,
						ttHeight,
						ttPosition;

						if ( ! scope.tt_content ) {
							return;
						}

						if ( transitionTimeout ) {
							$timeout.cancel( transitionTimeout );
						}

						tooltip.css({ top: 0, left: 0, display: 'block' });
            
						if ( options.appendToBody ) {
							$body = $body || $document.find( 'body' );
							$body.append( tooltip );
						} else {
							element.after( tooltip );
						}

						position = $position.position( element );
						ttWidth = tooltip.prop( 'offsetWidth' );
						ttHeight = tooltip.prop( 'offsetHeight' );

						switch ( scope.tt_placement ) {
							case 'right':
								ttPosition = {
									top: (position.top + position.height / 2 - ttHeight / 2) + 'px',
									left: (position.left + position.width) + 'px'
								};
								break;
							case 'bottom':
								ttPosition = {
									top: (position.top + position.height) + 'px',
									left: (position.left + position.width / 2 - ttWidth / 2) + 'px'
								};
								break;
							case 'left':
								ttPosition = {
									top: (position.top + position.height / 2 - ttHeight / 2) + 'px',
									left: (position.left - ttWidth) + 'px'
								};
                						break;
							default:
								ttPosition = {
									top: (position.top - ttHeight) + 'px',
									left: (position.left + position.width / 2 - ttWidth / 2) + 'px'
								};
                						break;
            					}

							tooltip.css( ttPosition );
							scope.tt_isOpen = true;
						}

						function hide() {
							scope.tt_isOpen = false;
							$timeout.cancel( popupTimeout );
							if ( angular.isDefined( scope.tt_animation ) && scope.tt_animation() ) {
								transitionTimeout = $timeout( function () { tooltip.remove(); }, 500 );
							} else {
								tooltip.remove();
							}
						}

						attrs.$observe( type, function ( val ) {
							scope.tt_content = val;
						});

						attrs.$observe( prefix+'Title', function ( val ) {
							scope.tt_title = val;
						});

						attrs.$observe( prefix+'Placement', function ( val ) {
							scope.tt_placement = angular.isDefined( val ) ? val : options.placement;
						});

						attrs.$observe( prefix+'Animation', function ( val ) {
							scope.tt_animation = angular.isDefined( val ) ? $parse( val ) : function(){ return options.animation; };
						});

						attrs.$observe( prefix+'PopupDelay', function ( val ) {
							var delay = parseInt( val, 10 );
							scope.tt_popupDelay = ! isNaN(delay) ? delay : options.popupDelay;
						});

						attrs.$observe( prefix+'Trigger', function ( val ) {
							element.unbind( triggers.show );
							element.unbind( triggers.hide );
							triggers = setTriggers( val );

							if ( triggers.show === triggers.hide ) {
								element.bind( triggers.show, toggleTooltipBind );
							} else {
								element.bind( triggers.show, showTooltipBind );
								element.bind( triggers.hide, hideTooltipBind );
							}
						});

						attrs.$observe( prefix+'Template', function ( val ) {
							scope.tt_template = val;
						});
					}
				};
			};
		}];
	});
	
	okd.directive( 'tooltipPopup', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
			templateUrl: 'template/tooltip/tooltip-popup.html'
		};
	});

	okd.directive( 'tooltip', [ '$tooltip', function ( $tooltip ) {
		return $tooltip( 'tooltip', 'tooltip', 'mouseenter' );
	}]);

	okd.directive( 'tooltipHtmlUnsafePopup', function () {
		return {
			restrict: 'E',
			replace: true,
			scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
			templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
		};
	});

	okd.directive( 'tooltipHtmlUnsafe', [ '$tooltip', function ( $tooltip ) {
		return $tooltip( 'tooltipHtmlUnsafe', 'tooltip', 'mouseenter' );
	}]);

	okd.directive( 'ttLoadTemplateInSibling', [ '$http', '$templateCache', '$compile', function ( $http, $templateCache, $compile ) {
		return {
			link: function ( scope, element, attrs ) {
			var templateScope = scope.$parent.$new();

			attrs.$observe( 'ttLoadTemplateInSibling', function ( val ) {
				$http.get( val, { cache: $templateCache } )
					.then( function( response ) {
						element.html( response.data );
						$compile( element.contents() )( templateScope );
				});
			});
		}
	};
}]);

okd.directive('money', function () {
	'use strict';

	var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
	function isUndefined(value) {
		return typeof value == 'undefined';
	}
	function isEmpty(value) {
		return isUndefined(value) || value === '' || value === null || value !== value;
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, el, attr, ctrl) {
			function round(num) { 
				return Math.round(num * 100) / 100;
			}

			var min = parseFloat(attr.min) || 0;

			ctrl.$parsers.push(function(value) {
				if (value === '.') {
					ctrl.$setValidity('number', true);
					return 0;
				}

				if (value === '-') {
					ctrl.$setValidity('number', false);
					return (min < 0) ? -0 : NaN;
			  	}

				var empty = isEmpty(value);
				if (empty || NUMBER_REGEXP.test(value)) {
					ctrl.$setValidity('number', true);
					return value === '' ? null : (empty ? value : parseFloat(value));
				} else {
					ctrl.$setValidity('number', false);
					return NaN;
				}
			});

			ctrl.$formatters.push(function(value) {
				return isEmpty(value) ? '' : '' + value;
			});

			var minValidator = function(value) {
				if (!isEmpty(value) && value < min) {
					ctrl.$setValidity('min', false);
					return undefined;
				} else {
					ctrl.$setValidity('min', true);
					return value;
				}
			};

			ctrl.$parsers.push(minValidator);
			ctrl.$formatters.push(minValidator);

			if (attr.max) {
				var max = parseFloat(attr.max);
				var maxValidator = function(value) {
					if (!isEmpty(value) && value > max) {
						ctrl.$setValidity('max', false);
						return undefined;
					} else {
						ctrl.$setValidity('max', true);
						return value;
					}
				};

				ctrl.$parsers.push(maxValidator);
				ctrl.$formatters.push(maxValidator);
			}

			ctrl.$parsers.push(function (value) {
				return value ? round(value) : value;
			});
			ctrl.$formatters.push(function (value) {
				return value ? parseFloat(value).toFixed(2) : value;
			});

			el.bind('blur', function () {
				var value = ctrl.$modelValue;
				if (value) {
					ctrl.$viewValue = round(value).toFixed(2);
					ctrl.$render();
				}
			});
		}
	};
});

okd.directive('niceScroll', function() {
	return {
		restrict: 'A',
		link: function($scope, $elem, $attr) {
			$elem.niceScroll({
				touchbehavior:true,
				cursorcolor:"#464646"
			});
		}
	}
});

okd.directive(
	"bnSlideShow",
	function() {
		function link($scope, element, attributes) {
			var expression = attributes.bnSlideShow;
			var duration = (parseInt(attributes.slideShowDuration) || "fast" );

			if (!$scope.$eval(expression)) {
				element.hide();
			}

			$scope.$watch(
				expression,
				function(newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}

					if (newValue) {
						element
							.stop(true, true)
							.slideDown(duration);
					} else {
						element
							.stop(true, true)
							.slideUp(duration);
					}
				}
			);
		}
		return({
			link: link,
			restrict: "A"
		});
	}
);

okd.directive(
	'lowerThan', [
	function() {
		var link = function($scope, $element, $attrs, ctrl) {
			var validate = function(viewValue) {
				var comparisonModel = $attrs.lowerThan;
				if(!viewValue || !comparisonModel) {
					ctrl.$setValidity('lowerThan', true);
				}
				ctrl.$setValidity('lowerThan', parseFloat(viewValue) <= parseFloat(comparisonModel) );

				return viewValue;
			};
			ctrl.$parsers.unshift(validate);
			ctrl.$formatters.push(validate);

			$attrs.$observe('lowerThan', function(comparisonModel) {
				return validate(ctrl.$viewValue);
			});
		};
		return {
			require: 'ngModel',
			link: link
		};
	}
]);


// history modal for settings
// separated due to need for multiple tables on one page
okd.directive('openSettingsDialog', function () {
	return {
		link: function(scope, element, attrs) {
			attrs.$observe('openEvent', function(value) {
				var id = value;
				element.bind('click', function(event){
					event.preventDefault();
					openDialog(id);
				});
			});
			function openDialog(id) {
				var element = angular.element('#EventsModal');
				for (var i = 0; i < scope.account.history.length; i++) {
					if (scope.account.history[i].id === parseInt(id)) {
						scope.thisEvent = scope.account.history[i];
					}
				}
				var ctrl = element.controller();
				ctrl.setModel(scope.thisEvent.modal_vals);
				element.modal('show');
			}
		}
	};
});

// history for:
// offer details
// team members
// payment methods
// channels
// locations
okd.directive('historySection', function ($log) {
	return {
		restrict: 'A',
		templateUrl:'partials/history-table.html',
		transclude:true,
		link: function (scope, elem, attrs) {
			$log.info("Recognized the historySection directive usage");
		}
	};	
});

// history modal for:
// offer details
// team members
// payment methods
// channels
// locations
okd.directive('openHistoryDialog', function ($modalStack) {
	return {
		link: function(scope, element, attrs) {
			attrs.$observe('openEvent', function(value) {
				var id = value;
				element.bind('click', function(event){
					event.preventDefault();
					openDialog(id);
				});
			});
			function openDialog(id) {
				var element = angular.element('#EventsModal');
				if (scope.thisAccount != null && typeof scope.thisAccount != 'undefined') {
					for (var i = 0; i < scope.thisAccount.history.length; i++) {
						if (scope.thisAccount.history[i].id === parseInt(id)) {
							scope.thisEvent = scope.thisAccount.history[i];
						}
					}
				}
				else {
					for (var i = 0; i < scope.thisOffer.history.length; i++) {
						if (scope.thisOffer.history[i].id === parseInt(id)) {
							scope.thisEvent = scope.thisOffer.history[i];
						}
					}
				}
				
				var ctrl = element.controller();
				ctrl.setModel(scope.thisEvent.modal_vals);
				element.modal('show');
			}
		}
	};
});

okd.directive('bindHtmlUnsafe', function( $compile ) {
	return function( $scope, $element, $attrs ) {

		var compile = function( newHTML ) {
			newHTML = $compile(newHTML)($scope);
			$element.html('').append(newHTML);
		};

		var htmlName = $attrs.bindHtmlUnsafe;

		$scope.$watch(htmlName, function( newHTML ) { 
			if(!newHTML) return;
			compile(newHTML);
		});
	};
});

okd.directive('topLocationsTable', function ($log) {
	return {
		restrict: 'A',
		templateUrl:'partials/top-locations-table.html',
		transclude:true,
		link: function (scope, elem, attrs) {
			$log.info("Recognized the top locations table directive usage");
		}
	};	
});

okd.directive('transactionsTable', function ($log) {
	return {
		restrict: 'A',
		templateUrl:'partials/transactions-table.html',
		transclude:true,
		link: function (scope, elem, attrs) {
			$log.info("Recognized the transactionsTable directive usage");
		}
	};	
});

okd.directive('returnBalanceContent', function ($log) {
	return {
		restrict: 'A',
		templateUrl:'partials/return-balance-content.html',
		transclude:true,
		link: function (scope, elem, attrs) {
			$log.info("Recognized the returnBalanceContent directive usage");
		}
	};	
});

// validating checkbox groups
okd.directive('checkboxGroup', function() {
	return {
		restrict: 'E',
		controller: function($scope, $attrs) {
			var self = this;
			var ngModels = [];
			var minRequired;
			self.validate = function() {
				var checkedCount = 0;
				angular.forEach(ngModels, function(ngModel) {
					if ( ngModel.$modelValue ) {
						checkedCount++;
					}
				});
				var minRequiredValidity = checkedCount >= minRequired;
				angular.forEach(ngModels, function(ngModel) {
					ngModel.$setValidity('checkboxGroup-minRequired', minRequiredValidity, self);
				});
			};
      
			self.register = function(ngModel) {
				ngModels.push(ngModel);
			};
      
			self.deregister = function(ngModel) {
				if (this.ngModels) {
					var index = this.ngModels.indexOf(ngModel);
					if ( index != -1 ) {
						this.ngModels.splice(index, 1);
					}
				}
			};
        
			$scope.$watch($attrs.minRequired, function(value) {
				minRequired = parseInt(value, 10);
				self.validate();
			});
		}
	};
});

okd.directive('input', function() {
	return {
		restrict: 'E',
		require: ['?^checkboxGroup','?ngModel'],
		link: function(scope, element, attrs, controllers) {
			var checkboxGroup = controllers[0];
			var ngModel = controllers[1];
			if ( attrs.type=='checkbox' && checkboxGroup && ngModel ) {
				checkboxGroup.register(ngModel);
				scope.$watch(function() {return ngModel.$modelValue; }, checkboxGroup.validate);
				scope.$on('$destroy', function() {checkboxGroup.deregister(ngModel);});
			}
		}
	};
});

function isEmpty(value) {
  return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

okd.directive('ngMax', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attr, ctrl) {
			scope.$watch(attr.ngMax, function(){
				ctrl.$setViewValue(ctrl.$viewValue);
			});
			var maxValidator = function(value) {
				var max = scope.$eval(attr.ngMax) || Infinity;
				if (!isEmpty(value) && value > max) {
					ctrl.$setValidity('ngMax', false);
					return undefined;
				} else {
					ctrl.$setValidity('ngMax', true);
					return value;
				}
			};

			ctrl.$parsers.push(maxValidator);
			ctrl.$formatters.push(maxValidator);
		}
	};
});

okd.directive('syncFocusWith', function($timeout, $rootScope) {
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			focusValue: "=syncFocusWith"
		},
		link: function($scope, $element, attrs) {
			$scope.$watch("focusValue", function(currentValue, previousValue) {
				if (currentValue === true && !previousValue) {
					console.log($element[0]);
					$element[0].focus();
				}
				else if (currentValue === false && previousValue) {
					$scope.$parent.offer.code='';
					$element[0].blur();
				}
			})
		}
	}
});

okd.directive("percent", function($filter){
	var p = function(viewValue){
		var m = viewValue.match(/^(\d+)\/(\d+)/);
		if (m != null)
			return $filter('number')(parseInt(m[1])/parseInt(m[2]), 2);
		return $filter('number')(parseFloat(viewValue)/100, 2);
	};

	var f = function(modelValue){
		return $filter('number')(parseFloat(modelValue)*100, 2);
	};
    
	return {
		require: 'ngModel',
		link: function(scope, ele, attr, ctrl){
			ctrl.$parsers.unshift(p);
			ctrl.$formatters.unshift(f);
		}
	};
});

okd.directive('toasterContainer', ['$compile', '$timeout', 'toasterConfig', 'toaster', function ($compile, $timeout, toasterConfig, toaster) {
	return {
		replace: true,
		restrict: 'EA',
		link: function (scope, elm, attrs){
			var id = 0;
      
			var mergedConfig = toasterConfig;
			if (attrs.toasterOptions) {
				angular.extend(mergedConfig, scope.$eval(attrs.toasterOptions));
			}
      
			scope.config = {
				position: mergedConfig['position-class'],
				title: mergedConfig['title-class'],
				message: mergedConfig['message-class'],
				tap: mergedConfig['tap-to-dismiss']
			};
      
			function addToast (toast){
				toast.type = mergedConfig['icon-classes'][toast.type];
				if (!toast.type)
					toast.type = mergedConfig['icon-class'];
        
				id++;
				angular.extend(toast, { id: id });
        
				if (mergedConfig['time-out'] > 0)
					setTimeout(toast, mergedConfig['time-out']);
        
				if (mergedConfig['newest-on-top'] === true)
					scope.toasters.unshift(toast);
				else
					scope.toasters.push(toast);
			}
      
			function setTimeout(toast, time){
				toast.timeout= $timeout(function (){ 
					scope.removeToast(toast.id);
				}, time);
			}
      
			scope.toasters = [];
			scope.$on('toaster-newToast', function () {
				addToast(toaster.toast);
			});
		},
		controller: function($scope, $element, $attrs) {
      
			$scope.stopTimer = function(toast){
				if(toast.timeout)
					$timeout.cancel(toast.timeout);
			};
      
			$scope.removeToast = function (id){
				var i = 0;
				for (i; i < $scope.toasters.length; i++){
					if($scope.toasters[i].id === id)
						break;
				}
				$scope.toasters.splice(i, 1);
			};
      
			$scope.remove = function(id){
				if ($scope.config.tap === true){
					$scope.removeToast(id);
			}
		};
	},
	template:
		'<div  id="toast-container" ng-class="config.position">' +
		'<div ng-animate="\'animateToaster\'" ng-repeat="toaster in toasters">' +
		'<div class="toast" ng-class="toaster.type" ng-click="remove(toaster.id)" ng-mouseover="stopTimer(toaster)">' +
		'<div ng-class="config.title">{{toaster.title}}</div>' +
		'<div ng-class="config.message">{{toaster.body}}' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>'
	};
}]);

okd.directive('msgIcon2', function($log) {
	return {
		restrict:'EA',
		link: function(scope, element, attrs) {
			$log.info("Recognized the msgIcon directive usage");
			for (var i = 0; i < scope.messages.length; i++) {								
				var date = String(scope.messages[i].msg_date);
				scope.messages[i].formatted_date = Date.parse(date);
			
				var type = scope.messages[i].msg_type;

				if (scope.messages[i].msg_type=='system') {
					scope.messages[i].className = "emphasize";
					scope.messages[i].icon = "fa-exclamation-triangle";
				}
				else if (scope.messages[i].msg_type=='ended') {
					scope.messages[i].className = "emphasize";
					scope.messages[i].icon = "fa-exclamation-triangle";				
				}
				else if (scope.messages[i].msg_type=='published') {
					scope.messages[i].className = "";
					scope.messages[i].icon = "fa-certificate";				
				}				
				else if (scope.messages[i].msg_type=='message') {
					scope.messages[i].className = "";
					scope.messages[i].icon = "fa-comment";				
				}
				else {
					scope.messages[i].className = "";
					scope.messages[i].icon = "fa-comment";					
				}									
			}
		}
	};
});

okd.directive('msgIcon', function($log) {
	return {
		restrict:'EA',
		link: function(scope, element, attrs) {
			$log.info("Recognized the msgIcon directive usage");
			for (var i = 0; i < scope.messages.length; i++) {								
				var date = String(scope.messages[i].msg_date);								
				scope.messages[i].formatted_date = Date.parse(date);
				if (scope.messages[i].msg_text.indexOf("closed") !== -1 || scope.messages[i].msg_text.indexOf("Summary") !== -1) {
					scope.messages[i].className = "emphasize";
					scope.messages[i].icon = "fa-exclamation-triangle"
				}
				else {
					scope.messages[i].icon = "fa-comment"
				}									
			}
		}
	};
});

//EventSource Service 
okd.service('xklaimSSE' , function(){
	var xaccId = '';
	var x_source = false;
	return {
		getXSSE: function(accountId){
			if (xaccId != '' && xaccId == accountId ){
				if(x_source){
					console.log('found existing EventSource object ' + accountId );
					return x_source;
				}
				else{
					var eventURL = '/enterprise/api/v1/accounts/' + accountId + '/events/';
					x_source = new EventSource(eventURL);
					console.log('created new EventSource object ' + accountId);
					return x_source;
				}
			}
			else if ( xaccId != '' && xaccId != accountId ){
				if(x_source){
					x_source.close();
					console.log('closed EventSource for ' + xaccId );
					var eventURL = '/enterprise/api/v1/accounts/' + accountId + '/events/';
					x_source = new EventSource(eventURL);
					xaccId = accountId;
					console.log('created new EventSource object ' + accountId);
					return x_source;
				}
				else{
					var eventURL = '/enterprise/api/v1/accounts/' + accountId + '/events/';
					x_source = new EventSource(eventURL);
					xaccId = accountId;
					console.log('created new EventSource object ' + accountId);
					return x_source;
				}
				
			}
			else{
				var eventURL = '/enterprise/api/v1/accounts/' + accountId + '/events/';
				x_source = new EventSource(eventURL);
				xaccId = accountId;
				console.log('created new EventSource object ' + accountId);
				return x_source;
				
			}
		},
		closeXSSE: function (){
			if ((xaccId != '') && (x_source)){
				x_source.close();
				console.log('closed EventSource for ' + xaccId );
				xaccId = '';
				x_source = false;
			}
		}
	}
});

okd.directive('exportCsv', function($parse, toaster) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
			var data = '';
			var str = '';
			var csv = {
				stringify: function(str) {
					return '"' +
					str.replace(/^\s\s*/, '').replace(/\s*\s$/, '')
					.replace(/"/g,'""') +
					'"';
				},
				generate: function() {
					data = '';
					var csvArray = scope.csvArray;				
					var array = typeof csvArray != 'object' ? JSON.parse(csvArray) : csvArray;
					str = '';
					var line = '';
					var head = array[0];
					for (var index in array[0]) {
						var value = index + "";
						line += '"' + value.replace(/"/g, '""') + '",';
					}

					line = line.slice(0, -1);
					str += line + '\r\n';

					for (var i = 0; i < array.length; i++) {
						var line = '';
						for (var index in array[i]) {
							var value = array[i][index] + "";
							line += '"' + value.replace(/"/g, '""') + '",';
						}

						line = line.slice(0, -1);
						str += line + '\r\n';
					}

					return str;
				},
				link: function() {

					var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(str);
					//data:application/vnd.ms-excel
					
					// export
					document.getElementById('exportCSV').onclick = function () {
						// create form to submit csv
						var fname = this.getAttribute('download') || 'file.csv';
						var url = 'savecsv.php';
						var data = encodeURIComponent(str);
						var dataInput = document.createElement("input");
						dataInput.setAttribute("name", "csvdata");
						dataInput.setAttribute("value", data);
						dataInput.setAttribute("type", "hidden");

						var nameInput = document.createElement("input");
						nameInput.setAttribute("name", 'name');
						nameInput.setAttribute("value", fname);

						var myForm = document.createElement("form");
						myForm.method = 'post';
						myForm.action = url;
						myForm.appendChild(dataInput);
						myForm.appendChild(nameInput);

						document.body.appendChild(myForm);
						myForm.submit();
						document.body.removeChild(myForm);
						toaster.pop('success', "Success", "Download initiated");
					};
				}
			};
			$parse(attrs.exportCsv).assign(scope.$parent, csv);
		}
	};
});

okd.directive('googleChart', ['$timeout', '$window', '$rootScope', 'googleChartApiProxy', 'toaster', function ($timeout, $window, $rootScope, apiProxy, toaster) {
	return {
		restrict: 'A',
		scope: {
			chart: '=chart'
		},
		link: function ($scope, $elm, $attr) {
			$scope.$watch('chart', function () {
				draw();
			}, true);
 
			$rootScope.$on('resizeMsg', function (e) {
				$timeout(function () {
					if(typeof($scope.chartWrapper) != "undefined") {
						$scope.chartWrapper.draw();
					}
				});
			});

			function draw() {
				if (!draw.triggered && ($scope.chart != undefined)) {
					draw.triggered = true;
					$timeout(function () {
						draw.triggered = false;
						var dataTable = new google.visualization.DataTable($scope.chart.data, 0.5);

						var chartWrapperArgs = {
							chartType: $scope.chart.type,
							dataTable: dataTable,
							view: $scope.chart.view,
							options: $scope.chart.options,
							containerId: $elm[0]
						};

						if($scope.chartWrapper==null) {
							$scope.chartWrapper = new google.visualization.ChartWrapper(chartWrapperArgs);
							google.visualization.events.addListener($scope.chartWrapper, 'ready', function () {
								$scope.chart.displayed = true;
							});
							google.visualization.events.addListener($scope.chartWrapper, 'error', function (err) {
								console.log("Chart not displayed due to error: " + err.message);
							});
						}
						else {
							$scope.chartWrapper.setChartType($scope.chart.type);
							$scope.chartWrapper.setDataTable(dataTable);
							$scope.chartWrapper.setView($scope.chart.view);
							$scope.chartWrapper.setOptions($scope.chart.options);
						
							// export
							document.getElementById('toCSV').onclick = function () {
								var dt_rows = dataTable.getNumberOfRows();
								var dt_cols = dataTable.getNumberOfColumns();
								var csv_cols = [];
								var csv_out;
								for (var i=0; i<dt_cols; i++) {
									csv_cols.push(dataTable.getColumnLabel(i).replace(/,/g,""));
								}

								csv_out = csv_cols.join(",")+"\r\n";
								for (i=0; i<dt_rows; i++) {
									var raw_col = [];
									for (var j=0; j<dt_cols; j++) {
										raw_col.push(dataTable.getFormattedValue(i, j, 'label').replace(/,/g,""));
									}
									csv_out += raw_col.join(",")+"\r\n";
								}

								var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(csv_out);			

								// create form to submit csv
								var fname = this.getAttribute('download') || 'file.csv';
								var url = 'savecsv.php';
								var data = encodeURIComponent(csv_out);
								var dataInput = document.createElement("input");
								dataInput.setAttribute("name", "csvdata");
								dataInput.setAttribute("value", data);
								dataInput.setAttribute("type", "hidden");

								var nameInput = document.createElement("input");
								nameInput.setAttribute("name", 'name');
								nameInput.setAttribute("value", fname);

								var myForm = document.createElement("form");
								myForm.method = 'post';
								myForm.action = url;
								myForm.appendChild(dataInput);
								myForm.appendChild(nameInput);

								document.body.appendChild(myForm);
								myForm.submit();
								document.body.removeChild(myForm);
								toaster.pop('success', "Success", "Download initiated");
							};
						}
						$timeout(function () {
							$scope.chartWrapper.draw();
						});
					}, 0, true);			
				}
			}
			draw = apiProxy(draw, this);
		}
	};
}]);

okd.directive('progressBar', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(window).scroll(function () {
				var s = $(window).scrollTop(),
				d = $(document).height(),
				c = $(window).height(),
				scrollPercent = (s / (d-c)) * 100;
				var position = scrollPercent;

				element.attr('value', position);
			});
		}
	};
});