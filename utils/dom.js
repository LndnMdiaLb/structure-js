  // dependency : collection.js

(function(app) {


  var utils = app.utils = app.utils || {};





  var MEMORY = (function(){

    var SINGLETON;

    function Memory(){
      
      var storage= new app.Set;

      // storage entry class - used to be able to easily identify with insatnceof and in console
      function Entry (element) {
        this.reference = element ;
        this.data={} ;
      }

      // find index of Entry in storage set or return null
      var searchfor=function(el){   
        for (var idx = 0; idx<storage.length; idx++)
          if(storage[idx].reference == el) return idx ;
        return null ;
      } ;

      ///////////
      // add data to storage Entry _type, key, value => associated to element
      ///////////

      this.add=function(el, type, key, value){

        //search for element in storage
        var idx = searchfor(el),
          s = (idx != null) ?
              // use pre existing
              storage[idx] :
              // create new, make association to element and create data 'container', push to storage and return from storage
              storage[ storage.add (new Entry(el) ).length -1] ;

        // create data type (app.Map class ) or populate pre existing key / value data
        (s.data[type] || (s.data[type] = new app.Map)) && s.data[type].add(key, value) ;

        return this ;
      } ;

      ///////////
      // remove data from storage Entry _type, key, value => associated to element
      /////////// 

      this.remove=function(el, type, key, value){
        // find element if element has data associated to it
        var idx = searchfor(el) ; 
        if(idx==null) return this // if not return
        var s = storage[idx] ;

        // remove key / data info from type (app.Map class)
        arguments.length >=4 && s.data[type] && s.data[type].remove(key, value) ;
        // nullify whole type group it will be delete in clean up bellow
        arguments.length ==2 && s.data[type] && (s.data[type] = {}) ;
        // nullify all data. whole Entry will be deleted in clean up bellow
        arguments.length ==1 && (s.data = {}) ;
        // arguments.length ==0 && storage = new Set ;
        
        // clean up
        if(s.data[type] && !Object.keys(s.data[type]).length) delete s.data[type] ;
        if(!Object.keys(s.data).length) storage.remove(storage[idx]) ;

        return this ;
      } ;

      ///////////
      // expose data associated to element
      ///////////   

      this.dataOf=function(el){
        for (var idx = 0; idx<storage.length; idx++)
          if(storage[idx].reference == el) return storage[idx].data ;
        return {} ;
      }

      this.g=function(){
        return storage;
      }     

      return SINGLETON || (SINGLETON = this)
    };

    return Memory ;

  })();

  var memory = utils.memory = new MEMORY ;


  //////////////////////////////////////////////////////////////////////////////////////////
  // UTILISING A CLASS MAP FOR MEMORY (RESETS IN BANNERS)
  //////////////////////////////////////////////////////////////////////////////////////////

  /* accepts array */
  utils.addClass= function(domEl, value, time){
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
                memory.remove(el, 'addtimers', value, tm)   ; 
                }
              , time ); 
            memory.add(el, 'addtimers', value, tm) ;
            })();
            return ;   
        }

        //////////////
        // timer implementation end
        //////////////        

        el.className += el.className ? ' ' + value : value ;

        //////////////    
        // utility to keep track of class manipulation ( ex. banner reset )
        // **** alternative ****
        // memory memory.add({generalReferenceObject}, 'classMap', value, el) ;
        //////////////  

        (utils.classMap || (utils.classMap = new app.Map)) && utils.classMap.add(value, el) ;       
      } 


      (domEl instanceof Array)?
        domEl.forEach(add) :
        add(domEl) ;

      return utils ;
  };

  utils.g = function(){
    console.log(memory.g ()) ;
  }
  //////////////
  // timer kill
  //////////////  

  utils.addClass.kill = function(domEl, value, id){

      // utils.addClass.kill() --> kill all add timeouts on all els
      // utils.addClass.kill(el) --> kill all add timouts on this el
      // utils.addClass.kill(el, value) --> kill all add timouts on this el for this class
      // utils.addClass.kill(el, value, id) --> kill specific timout on this el for this class

      var data = memory.dataOf(domEl),
          type = 'addtimers'
          ;
      // if it doesn't exist return
      if(!!data[type] && !!data[type][value]) return utils ;

      function kill(id){
        clearTimeout(id) ;
        data[type] && memory.remove(domEl, type, value, id) ;            
      }

      // ????? how can you know id of timer from outside
      // arguments.length == 3 && kill(data[type][value][id]) 

      // domEl.addtimers[value].concat() duplicate Set then manipulate original set
      arguments.length == 2 && data[type][value].concat().forEach(kill) ;

      //  remove all add timers on element
      if(arguments.length == 1)
        for (var value in data[type])
          data[type][value].concat().forEach(kill) ;

      // utils.addClass.kill() --> kill all add timeouts on all els

      return utils ;
  }

  /* accepts array */
  utils.removeClass = function(domEl,value, time){

      function remove(el,i,arr){

        //////////////
        // timer implementation
        ////////////// 

        if(time){
          (function(){
           var tm = setTimeout(
            function(){ 
                app.utils.removeClass(el, value);
                memory.remove(el, 'remtimers', value, tm)   ;  
                }
              , time ); 
            memory.add(el, 'remtimers', value, tm) ;
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

      // utils.addClass.kill() --> kill all add timeouts on all els
      // utils.addClass.kill(el) --> kill all add timouts on this el
      // utils.addClass.kill(el, value) --> kill all add timouts on this el for this class
      // utils.addClass.kill(el, value, id) --> kill specific timout on this el for this class

      var data = memory.dataOf(domEl),
          type = 'remtimers'
          ;
      // if it doesn't exist return

      if(!data[type] && !data[type][value]) return utils ;

      function kill(id){
        clearTimeout(id) ;
        data[type] && memory.remove(domEl, type, value, id) ;          
      }

      // ????? how can you know id of timer from outside
      // arguments.length == 3 && kill(data[type][value][id]) 

      // domEl.addtimers[value].concat() duplicate Set then manipulate original set
      // console.log(data[type][value].concat())
      arguments.length == 2 && data[type][value].concat().forEach(kill) ;

      //  remove all add timers on element
      if(arguments.length == 1)
        for (var value in data[type])
          data[type][value].concat().forEach(kill) ;

      // utils.removeClass.kill() --> kill all add timeouts on all els

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

})(window.app || (window.app = {}));