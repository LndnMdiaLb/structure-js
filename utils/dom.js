  // dependency : collection.js

(function(app) {


  var utils = app.utils = app.utils || {};



  //////////////////////////////////////////////////////////////////////////////////////////
  // UTILISING A CLASS MAP FOR MEMORY (RESETS IN BANNERS)
  //////////////////////////////////////////////////////////////////////////////////////////



  /* accepts array */
  utils.addClass= function(domEl,value, time){
      var has = this.hasClass ;
      function add(el){
        if(has(el, value)) return ;
        el.className += el.className ? ' ' + value : value ;
        // utility to keep track of class manipulation ( ex. banner reset )
        (utils.classMap || (utils.classMap = new app.Map)) && utils.classMap.add(value, el) ;        
      }


      /*

        ///////////////////////////
        // concept :  
        ///////////////////////////

      // add the capacity to  addClass at time

      app.utils.addClassT = function(el, _class, t){
        var tm = setTimeout(
          function(){ 
            app.utils.addClass(el, _class); }
            , t );
        (utils.timeclassMap || (utils.timeclassMap = new app.Map)) && utils.timeclassMap.add(el, tm) ; 
                    
      } 

      kill the settimeout

      app.utils.addClassT.kill = function(el){
        clearTimeout(utils.timeclassMap[el]);
        utils.timeclassMap.remove(el, utils.timeclassMap[el])
      }

      */
        


      var s = setTimeout(
              function (){ 
                utils.addClass(domEl, value) ; 
              }, 100) ;

      if(time)
        var tm = setTimeout( function(){ 
                    utils.addClass(domEl, value); 
                  }, time ) ;

      /*
      
        kill timer (domel-val)
        timeclassMap:{
          el:{
            timer-id: setTimeout ,
            timer-id-2: setTimeout ,
            timer-id-3: setTimeout
          }
        }

      */

        (utils.timers || (utils.timers = new app.Map)) && utils.timers.add(domEl, tm) ; 

      (domEl instanceof Array)?
        domEl.forEach(add) :
        add(domEl) ;
  };

  utils.addClass.kill = function(domEl){
    utils.timers && utils.classMap.remove(value, el)
  }

  /* accepts array */
  utils.removeClass= function(domEl,value){
      var bt = this;
      function remove(el,i,arr){
        var rep = el.className.match(' '+value) ? ' '+value : value ;
        el.className = el.className.replace(rep,'') ;
        // utility to keep track of class manipulation ( ex. banner reset )
        utils.classMap && utils.classMap.remove(value, el) ;             
      }
      (domEl instanceof Array) ?
        domEl.forEach(remove) :
        remove(domEl) ;
  };

  utils.hasClass= function(domEl,value){
      var found = false;
      var temparray = domEl.className.split(' ');
      for(var i=0;i<temparray.length;i++){
        if(temparray[i]==value){
          found = true ;
        }
      }
      return found;
  };

  ///////////////

  utils.reset = function(value){
    if(!value) {
      // using utils.removeClass on classMap directly causes errors because it is edited internally by utils.removeClass
      // to mask unintended results copy is passed to iterate over      
      for (v in app.utils.classMap)
        app.utils.removeClass(app.utils.classMap[v].concat(), v) ;        
    } else {
        if(app.utils.classMap[value]) 
          app.utils.removeClass(app.utils.classMap[value].concat(), value) ;
    }
  };


  //////////////////////////////////////////////////////////////////////////////////////////


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