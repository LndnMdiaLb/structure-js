
/////////////////////////////////////////
//
//  CONDITIONAL PATTERN for function that checks for conditions;
//  if condition is true, doSomething but condition will 'block' until another condition fires
//
//  USAGE:  update something once based on a continuous stream of information
//
/////////////////////////////////////////

    // EXTRA features:

    // blocking feature
    // unblocking feature
    // check feature
    // lastCondition feature
    // addCondition

(function(app){

    function Filter(){

        var conditionID,
            conditionGraph = {},
            interupt=false ;


        function isnot(id){
            return (conditionID == id) ? false :
                !!(conditionID = id) || true ; // set id and return true
        }

        function runfilter(args){
            var args = typeof args !='undefined'? args : null;
            // assume default will run
            runfilter._default = true;
            for (var cond in conditionGraph){
                // if a default condition (id is default or only has action specified) skip
                if(cond.toLowerCase()=='default' || !c.condition ) continue ;
                var c = conditionGraph[cond]
                if(c.condition.call(this,args)){
                    // do not call default action
                    runfilter._default = false ;
                    // if in not blocked via Filter.block() or is not last stored
                    if(!c.block && isnot(cond)){
                        // call action function
                        c.action.call(this,args) ;
                        break ;
                    }
                }
            }

            // default action ( runfilter._default == true )  how to capture if has no condition function
            if(runfilter._default && !conditionGraph['default'].block && isnot('default')){
                if(conditionGraph['default']) conditionGraph['default'].action.call(this);
            }
        }

        ////
        this.lastCondition = function(){
            return conditionID;
        }

        this.addCondition=function(id, ConditionObj){
            conditionGraph[id]=ConditionObj ;
            return this; // can be chained
        };

        ////

        // block condition from being available
        this.block = function(id){
            conditionGraph[id].block=true;
            return this; // can be chained  .block('id1').block('id2').run(inputdata)
        }

        // unblock block AND remove from conditionID
        this.unblock = function(id){
            if(conditionID === id) conditionID = "";
            delete conditionGraph[id].block;
            return this; // can be chained   .unblock('id1').block('id2').run(inputdata)
        }

        // emidiately check one conditional in conditionGraph
        this.check=function(id, args) {

            var c = conditionGraph[id] ;
            if(!c) return ;
            // interupt runfilter() in run() method;
            interupt = true;
            // make sure condition is available
            this.unblock(id);
            // run condition and reset conditionID if met
            if(c.condition && c.condition.call(this, args) && isnot(id)) c.action.call(this, args) ;
            // if it's default
            if(!c.condition || id=='default') runfilter(args);
            // uninterupt runfi. lter();
            interupt = false;
        }

        // check whole conditionGraph in run() method;
        this.run = function(args){
            if(interupt) return;
            runfilter(args);
        }

    }

    // submodule w/ loose augmentation ?
    //var filter = app.filter = app.filter || {};
    app.Filter = Filter;



})(window.app || (window.app = {}));
