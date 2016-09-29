(function (app) {



	app.BasicStateMachine = function StateMachine(){

		var activeState;
		var stateGraph={};	// 'state graph?'

		this.setState = function (state){
			activeState = state ;
		};

		this.changeState = function (){
			//console.log(activeState)
			stateGraph[activeState]() ;
			// vs function call
			//this.activeState.call(this, args)

		};

		this.goTo=function(state){
			this.setState(state) ;
			this.changeState() ;
		}

		this.addState=function(state, func){
			stateGraph[state]=func ;
			return this ;
		};

	}



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
	}


/*  // subclass EventDispatcher requires tight augmentation
	app.StateMachine.prototype = Object.create(CREATVE.utils.EventDispatcher.prototype);
	app.StateMachine.prototype.constructor = app.StateMachine;
*/

	// implementation
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

})(window.app || (window.app = {})) ;