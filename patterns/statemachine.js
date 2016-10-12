(function (app) {

	app.StateMachine = function StateMachine(){

		var prevState, // the state that previously executed
			activeState, // the state that just execited / is executing / active
			nextState, // the next queued state to execute

			stateGraph={};	// 'state graph?'


		// last to execute - can be null if changeState hasn't been called
		this.prev = function(){ return prevState ; }

		this.state = function(){ return activeState ; }

		// next to execute - can be null if changeState hasn't been called
		this.next = function(){ return nextState ; }

		this.setNextState = function(state){
			nextState = state;
			return this;
		}

		this.changeState = function (args){

			// if a state has just executed store as previous
			if(activeState) prevState = activeState;
			// ready next state to be executed and store as active
			if(nextState) activeState = nextState;
			// empty next state
			nextState = null ;

			//////////////
			// EXECUTE
			//////////////
			if(!activeState) return this // thow error ??

			//stateGraph[activeState]()  // this == stateGraph
			stateGraph[activeState].apply(this, args?args:[]) ; // this == StateMachine

			return this;

		}

		this.goTo=function(state){
			return this.setNextState(state).changeState() ;
		}

		this.addState=function(state, func){
			stateGraph[state]=func ;
			return this ;
		}

		// helper method for easily applying compostion

        this.through = function(obj){
			obj.prev = this.prev.bind(this) ;
			obj.state = this.state.bind(this) ;
			obj.next = this.next.bind(this) ;
			obj.setNextState = this.setNextState.bind(this) ;
			obj.changeState = this.changeState.bind(this) ;
			obj.goTo = this.goTo.bind(this) ;
			obj.addState = this.addState.bind(this) ;       	
        }		
	}
//////////////////////
// implementation
//////////////////////

/*
	var sm = new StateMachine ;

		sm.addState('StateA',
			function(){
				// Transitions from previous state
				// Actions in current State
				console.log('do A') ;

				// set next state to execute in stateGraph
				sm.setState('StateB') ;
			});

		sm.changeState();
		sm.goTo('XXXX');
*/

/*  
	// subclass EventDispatcher requires tight augmentation
	app.StateMachine.prototype = Object.create(CREATVE.utils.EventDispatcher.prototype);
	app.StateMachine.prototype.constructor = app.StateMachine;
*/


})(window.app || (window.app = {})) ;
