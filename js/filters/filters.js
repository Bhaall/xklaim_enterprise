okd.filter('runningOffers', function () {
    return function (offers) {
        //TODO: Return running offers
    };
});

okd.filter('characters', function () {
	return function (input, chars, breakOnWord) {
		if (isNaN(chars)) return input;
		if (chars <= 0) return '';
		if (input && input.length >= chars) {
			input = input.substring(0, chars);

			if (!breakOnWord) {
				var lastspace = input.lastIndexOf(' ');
				//get last space
				if (lastspace !== -1) {
					input = input.substr(0, lastspace);
				}
			}else{
				while(input.charAt(input.length-1) == ' '){
					input = input.substr(0, input.length -1);
				}
			}
			return input + '...';
		}
		return input;
	};
});

okd.filter('words', function () {
	return function (input, words) {
		if (isNaN(words)) return input;
		if (words <= 0) return '';
		if (input) {
			var inputWords = input.split(/\s+/);
				if (inputWords.length > words) {
					input = inputWords.slice(0, words).join(' ') + '...';
				}
			}
		return input;
	};
});

okd.filter('picker', function($filter) {
	return function(value, filterName, format) {
		if(filterName) {
			return $filter(filterName)(value, format);
		}
		else {
			return (value);
		}
	};
});

okd.filter('customCurrency', ["$filter", function ($filter) {       
	return function(amount, currencySymbol){
		var currency = $filter('currency');         
		if(amount.charAt(0) === "-"){
			return currency(amount, currencySymbol).replace("(", "-").replace(")", ""); 
		}
		return currency(amount, currencySymbol);
	};
}]);

okd.filter('orderObjectBy', function(){
	return function(input, attribute) {
		if (!angular.isObject(input)) return input;

		var array = [];
		for(var objectKey in input) {
			array.push(input[objectKey]);
		}

		array.sort(function(a, b){
			a = parseInt(a[attribute]);
			b = parseInt(b[attribute]);
			return a - b;
		});
		return array;
	}
});

okd.filter('percentage', function () {
	return function (input) {
		var rounded = Math.round(input*10000)/100;
		if (rounded == NaN) {
			return '';
		}
		if (rounded<0) {
			var percentage = '' + rounded + '%';
		}
		else {
			var percentage = '+' + rounded + '%';
		}
		return percentage;
	};
});

okd.filter('timeDistance', function () {
	var LESS_THAN = 'less than';
	var ABOUT = 'about';
	var ALMOST = 'almost';
	var OVER = 'over';
	var A = 'a';
	var MINUTE = ['minute ago', 'minutes ago'];
	var HOUR = ['hour ago', 'hours ago'];
	var DAY = ['day ago','days ago'];
	var MONTH = ['month ago','months ago'];
	var YEAR = ['year ago','years ago'];
	return function (toTime,fromTime) {
		var out = toTime;
		toTime = new Date(toTime);
		if (!isNaN(toTime)) {
			if (!angular.isDefined(fromTime)) {
				fromTime = new Date();
			}
			var distance = Math.abs(fromTime - toTime);
			var distanceInMinutes = Math.round(Math.abs(distance / 60000.0));
			var distanceInSeconds = Math.round(Math.abs(distance / 1000.0));
			if (distanceInMinutes <= 1) {
				if (distanceInMinutes === 0) {
					out = LESS_THAN + ' ' + A + ' ' + MINUTE[0];
				} else {
					out = distanceInMinutes + ' ' + MINUTE[0];
				}
			} else if (distanceInMinutes >= 2 && distanceInMinutes <= 45) {
				out = distanceInMinutes + ' ' + MINUTE[1];
			} else if (distanceInMinutes >= 46 && distanceInMinutes <= 1440) {
				var hours = Math.max(Math.round(distanceInMinutes/60.0),1);
				out = ABOUT + ' ' + hours + ' ' + HOUR[(hours <= 1 ? 0 : 1)];
			} else if (distanceInMinutes >= 1441 && distanceInMinutes <= 43200) {
				var days = Math.max(Math.round(distanceInMinutes/1440.0),1);
				out =  days + ' ' + DAY[(days <= 1 ? 0 : 1)];
			} else if (distanceInMinutes > 43201 && distanceInMinutes <= 86400) {
				var aboutMonths = Math.max(Math.round(distanceInMinutes/43200.0),1);
				out = ABOUT + ' ' + aboutMonths + ' ' + MONTH[(aboutMonths <= 1 ? 0 : 1)];
			} else if (distanceInMinutes > 86401 && distanceInMinutes <= 525600) {
				var months = Math.max(Math.round(distanceInMinutes/43200.0),1);
				out = months + ' ' + MONTH[(months <= 1 ? 0 : 1)];
			} else {
				var isLeapYear = function(year) {
					return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
				};
				var fromYear = fromTime.getFullYear();
				if (fromTime.getMonth() >= 2) {
					fromYear += 1;
				}
				var toYear = fromTime.getFullYear();
				if (toTime.getMonth() < 2) {
					toYear -= 1;
				}
				var minutesWithLeapOffset = distanceInMinutes;
				if (fromYear > toYear) {
					var leapYears = 0;
					for (var i = fromYear; i <= toYear; i++) {
						if (isLeapYear(i)) {
							leapYears++;
						}
					}
					minutesWithLeapOffset = distanceInMinutes - (leapYears * 1440);
				}
				var remainder = minutesWithLeapOffset % 525600;
				var years = Math.floor(minutesWithLeapOffset / 525600);
				if (remainder < 131400) {
					out = ABOUT + ' ' + years + ' ' + YEAR[(years <= 1 ? 0 : 1)];
				} else if (remainder < 394200) {
					out = OVER + ' ' + years + ' ' + YEAR[(years <= 1 ? 0 : 1)];
				} else {
					out = ALMOST + ' ' + years + ' ' + YEAR[(years <= 1 ? 0 : 1)];
				}
			}
		}
		return out;
	};
});

okd.filter('tel', function () {
	return function (tel) {
		if (!tel) { return ''; }
		var value = tel.toString().trim().replace(/^\+/, '');
		if (value.match(/[^0-9]/)) {
			return tel;
		}
		var country, city, number;
		switch (value.length) {
			case 10: // +1PPP####### -> C (PPP) ###-####
				country = 1;
				city = value.slice(0, 3);
				number = value.slice(3);
				break;
			case 11: // +CPPP####### -> CCC (PP) ###-####
				country = value[0];
				city = value.slice(1, 4);
				number = value.slice(4);
				break;
			case 12: // +CCCPP####### -> CCC (PP) ###-####
				country = value.slice(0, 3);
				city = value.slice(3, 5);
				number = value.slice(5);
				break;
			default:
				return tel;
		}
		if (country == 1) {
			country = "";
		}
		number = number.slice(0, 3) + '-' + number.slice(3);
		return (country + " (" + city + ") " + number).trim();
	};
});