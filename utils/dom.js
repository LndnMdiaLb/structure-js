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

        //////////////
        // timer implementation
        //////////////

        if(time){
          (function(){
           var tm = setTimeout(
            function(){ 
                app.utils.addClass(el, value);
                el.addtimers && el.addtimers.remove(value, tm) ;  
                }
              , time ); 
            (el.addtimers || (el.addtimers = new app.Map)) && el.addtimers.add(value, tm) ; 
            })();
            return ;   
        }

        //////////////
        // timer implementation end
        //////////////        

        el.className += el.className ? ' ' + value : value ;
        // utility to keep track of class manipulation ( ex. banner reset )
        (utils.classMap || (utils.classMap = new app.Map)) && utils.classMap.add(value, el) ;       
      } 


      (domEl instanceof Array)?
        domEl.forEach(add) :
        add(domEl) ;

      return utils ;
  };

  //////////////
  // timer kill
  //////////////  

  utils.addClass.kill = function(domEl, value, index){
      if (!domEl.addtimers[value]) return utils ;

      function kill(id){
        clearTimeout(id) ;
        domEl.addtimers && domEl.addtimers.remove(value, id) ;          
      }

      (index != undefined) ?
        kill(domEl.addtimers[value][index]) :
        domEl.addtimers[value].concat().forEach(kill)
        ;

      return utils ;
  }

  /* accepts array */
  utils.removeClass= function(domEl,value, time){
      var bt = this;
      function remove(el,i,arr){

        //////////////
        // timer implementation
        //////////////  

        if(time){
          (function(){
           var tm = setTimeout(
            function(){ 
                app.utils.removeClass(el, value);
                el.remtimers && el.remtimers.remove(value, tm) ;  
                }
              , time ); 
            (el.remtimers || (el.remtimers = new app.Map)) && el.remtimers.add(value, tm) ; 
            })();
            return ;   
        }

        //////////////
        // timer implementation end
        //////////////          

        var rep = el.className.match(' '+value) ? ' '+value : value ;
        el.className = el.className.replace(rep,'') ;
        // utility to keep track of class manipulation ( ex. banner reset )
        utils.classMap && utils.classMap.remove(value, el) ;        
             
      }
      (domEl instanceof Array) ?
        domEl.forEach(remove) :
        remove(domEl) ;

      return utils ;        
  };

  //////////////
  // timer kill
  //////////////  

  utils.removeClass.kill = function(domEl, value, index){
      if (!domEl.remtimers[value]) return utils ;

      function kill(id){
        clearTimeout(id) ;
        domEl.remtimers && domEl.remtimers.remove(value, id) ;          
      }

      (index != undefined) ?
        kill(domEl.remtimers[value][index]) :
        domEl.remtimers[value].concat().forEach(kill)
        ;

      return utils ;
  }  

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
  
  utils.reset = function(value, time){
    
    if(time){
      setTimeout(function(){
        utils.reset(value) ;
      }, time ) ;
      return
    }

    function remove(value){
      if(app.utils.classMap[value])
          // using utils.removeClass on classMap directly causes errors because it is edited internally by utils.removeClass
          // to mask unintended results copy is passed to iterate over       
          app.utils.removeClass(app.utils.classMap[value].concat(), value) ;
    }

    if(!value) { 
      for (v in app.utils.classMap) remove(v);        
    } else {
      remove(value) ;
    }
    
    return utils ;

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