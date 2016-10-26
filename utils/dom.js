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

        if(time){
          (function(){
           var tm = setTimeout(
            function(){ 
              app.utils.addClass(el, value); }
                el.addtimers && el.addtimers.remove(value, tm) ;  
              , t ); 
            (el.addtimers || (utils.addtimers = new app.Map)) && utils.addtimers.add(value, tm) ; 
            })();
            return ;   
        }

        el.className += el.className ? ' ' + value : value ;
        // utility to keep track of class manipulation ( ex. banner reset )
        (utils.classMap || (utils.classMap = new app.Map)) && utils.classMap.add(value, el) ;        
      }



    /*

  //////////////////////////////////////////////////////////////////////////////////////////
  // IDEAL USAGE
  //////////////////////////////////////////////////////////////////////////////////////////


       utils
        .addClass(el, 'on', 1000)  // store timerID -- associate to 
        .addClass(el, 'on', 1000)
        .addClass.kill(el, 'on')
        .addClass.pause(el, 'on')
        ;


        function addTimer (el, key){
  
        }


  //////////////////////////////////////////////////////////////////////////////////////////
  // DATA STORAGE IDEAS
  //////////////////////////////////////////////////////////////////////////////////////////


      ///////////////////////////
      // concept 1:
      // idea for storing timerIDs in association to classes 
      ///////////////////////////  

      addMap =
              [

                {   
                  el: element, 
                  map: {
                    value:[timerID, timerID2],
                    value:[timerID3]
                  } 
                } ,

                {   
                  el: element, 
                  map: {
                    value:[timerID4, timerID6],
                    value:[timerID5]
                  } 
                } ,

                {   
                  el: element, 
                  map: {
                    value:[timerID4, timerID6],
                    value:[timerID5]
                  } 
                }

              ] ;

            {   
              el: element,            
              map: new app.Map
            }

      // usage

      addMap[x].el ;
      addMap[x].map[value][1] ; // == timers

       

      ///////////////////////////
      // concept 2:
      // store directly on elements in association to classes  
      ///////////////////////////        
      

      element
        .addtimers = {
            value:[timerID4, timerID6],
            value:[timerID5]
          }
        .removetimers = {
            value:[timerID4, timerID6],
            value:[timerID5]
          }            


      ///////////////////////////
      // example usage
      ///////////////////////////


      (function(){
       var tm = setTimeout(
        function(){ 
          app.utils.addClass(el, _class); }
            el.addtimers && el.addtimers.remove(_class, tm) ;  
          , t ); 
        (el.addtimers || (utils.addtimers = new app.Map)) && utils.addtimers.add(_class, tm) ; 
        })();    


      // kill the settimeout


      app.utils.addClassT.kill = function(domEl,value) {
        
        var tm = el.addtimers[domel][value] ;
        clearTimeout(tm) ;
        el.addtimers && el.addtimers.remove(_class, tm) ;  

        utils.timeclassMap.remove(el, utils.timeclassMap[el]) ;

      }



    */  

      (domEl instanceof Array)?
        domEl.forEach(add) :
        add(domEl) ;
  };

  utils.addClass.kill = function(domEl, value){
      
      var tm = el.addtimers[domel][value] ;

      tm.forEach(function(id){
        clearTimeout(id) ;
        domEl.addtimers && domEl.addtimers.remove(value, id) ;          
      })

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