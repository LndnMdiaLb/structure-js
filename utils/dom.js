  // dependency : collection.js

(function(app) {


  var utils = app.utils = app.utils || {};

  var MEMORY = (function(){

    var SINGLETON;

    function Memory(){

      var graph={};

      // add to data graph _type, divider, section , group
      this.add=function(el, group, key, value){
        //search for element in graph
        var g = (id = this.find(el)) ?
              graph[id] :
              graph[Math.random()] = {
                ref:el ,
                data:{}
                } ;

        (g.data[group] || (g.data[group] = new app.Map)) && g.data[group].add(key, value) ;

        return this ;
      } ;


      this.remove=function(el, group, key, value){
        var id = this.find(el) ;
          
        if(!id) return

        var g = graph[id] ;
        g.data[group] && g.data[group].remove(key, value) ;

        var counter = 0 ;
        for(keys in g.data[group]) counter ++
        if(!counter) delete g.data[group] ;
        for(groups in g.data) counter ++
        if(!counter) delete graph[id] ;

        return this ;
      } ;


      this.find=function(el){
        for (id in graph)
          if(graph[id].ref == el) return id ;
        return null ;
      } ;


      this.find2 = function( el, group, key, value ){
        
        var entry = null ;
        for (id in graph) if(graph[id].ref == el ) entry = graph[id] ;

        if ( arguments.length == 1 || !entry ) return entry ;
        if ( arguments.length == 2 && !!entry.data[group] ) return entry.data[group] ;
        if ( arguments.length == 3 && !!entry.data[group] && !!entry.data[group][key] ) return entry.data[group][key] ;
            
      } ;   

      /*
       find el entry
       if it doesn't exist return null
       if it does aexis  and l = 1 return it
       i
      */

      this.g = function() {
       console.log(graph) ;
      }

      return SINGLETON || (SINGLETON = this) ;

    };

    return Memory;

  })();

  var memory = utils.memory = new MEMORY ;


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
        // utility to keep track of class manipulation ( ex. banner reset )
        (utils.classMap || (utils.classMap = new app.Map)) && utils.classMap.add(value, el) ;       
      } 


      (domEl instanceof Array)?
        domEl.forEach(add) :
        add(domEl) ;

      return utils ;
  };

  utils.g = function(){
    m.g () ;
  }
  //////////////
  // timer kill
  //////////////  

  utils.addClass.kill = function(domEl, value, index){

      // utils.addClass.kill() --> kill all add timeouts on all els
      // utils.addClass.kill(el) --> kill all add timouts on this el
      // utils.addClass.kill(el, value) --> kill all add timouts on this el for this class
      // utils.addClass.kill(el, value, index) --> kill specific timout on this el for this class

      // var add = m.graph[m.find(domEl)].addtimers ;

      // if (!domEl.addtimers[value]) return utils ;

      // function kill(id){
      //   clearTimeout(id) ;
      //   memory.remove(domEl, 'addtimers', value, id) ;          
      // }

      // (index != undefined) ?
      //   kill(add[value][index]) :
      //   add[value].concat().forEach(kill)
      //   ;

      // return utils ;


      // m.graph[m.find(domEl)].addtimers[value] ;

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

})(window.app || (window.app = {}));