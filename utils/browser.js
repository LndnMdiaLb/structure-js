(function(app) {

    var utils = app.utils = app.utils || {};

    /* RegEx TESTS */

    var mobileRegEx = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i ;
    var iOSRegEx = /(iPhone|iPad)/i ;

    var ismobile = mobileRegEx.test(navigator.userAgent);
    var iOS = iOSRegEx.test(navigator.userAgent);

    var supportsTouch = 'ontouchstart' in window && ismobile;

    utils.isMobile = function(){
      return ismobile;
    }

    utils.isupportsTouch = function(){
      return supportsTouch;
    }

    utils.isiOS = function(){
      return iOS;
    }

    utils.testua = function(regex){
      return regex.test(navigator.userAgent)
    }

})(window.app || (window.app = {}));