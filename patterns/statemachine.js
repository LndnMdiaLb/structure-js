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
		this.goTo('XXXX');
*/

})(window.app || (window.app ={})) ;