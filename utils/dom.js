(function(app) {

  var utils = app.utils = app.utils || {};

  /* accepts array */
  utils.addClass= function(domElement,value){
      var bt = this;
      function add(el,i,arr){
        if(!bt.hasClass(el, value)) el.className += el.className ? ' '+value : value;
      }
      (domElement instanceof Array)?
        domElement.forEach(add):add(domElement);
  };

  /* accepts array */
  utils.removeClass= function(domElement,value){
      var bt = this;
      function remove(el,i,arr){
        var rep = el.className.match(' '+value) ? ' '+value : value;
        el.className = el.className.replace(rep,'');
      }
      (domElement instanceof Array)?
        domElement.forEach(remove):remove(domElement);
  };

  utils.hasClass= function(domElement,value){
      var found = false;
      var temparray = domElement.className.split(' ');
      for(var i=0;i<temparray.length;i++){
        if(temparray[i]==value){
          found = true;
        }
      }
      return found;
  };


  /* CSS RELATED */

  utils.getCompStyle = function(el, prop){
    return window.getComputedStyle(el, null ).getPropertyValue(prop)
  };


  utils.cssPrefix = function(cssProp){
        var prefixes = ['Moz','Khtml','Webkit','O','ms'],
            prop = cssProp,
            elem = document.createElement('div'),
            upper = camel(prop)//prop.charAt(0).toUpperCase() + prop.slice(1);

        function camel(string){
          var arr = string.split('-')
          for (var i in arr){
            arr[i]=arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
          };
          return arr.join('');
        }

        if (prop in elem.style) { return cssProp; }

        for (var len = prefixes.length; len--; ){
            if ((prefixes[len] + upper)  in elem.style) { return ('-' + prefixes[len].toLowerCase() + '-'+cssProp); }
        }
        return false;
    };


  /* VISIBILITY */

  utils.blockvisible = function(el, bool){

    function block(el, bool){
      (bool)?
        el.style['display']='block' :
        el.style['display']='none';
    }

    if (el instanceof Array){
      // JS
      Array.prototype.forEach.call(el,
        function(e,i,a){
         block(e, bool)
        })
      return;
    }

    block(el, bool);
  };

})(window.app || (window.app = {}));