(function(app) {

	//////////////////////////////
	//
	//  This structure lies at the heart of
		// (behavioral) Observer Pattern, the Mediator,
		// (structural) the Copmosite Pattern
	//
	//////////////////////////////


	//////////////////////////////////////////////////////////////////////////////////////////
	//  Method Declaration
	//////////////////////////////////////////////////////////////////////////////////////////

	// 
	//	Methods for adding and removing objects from arrays
	//
	//	THESE DO NOT WORK AS STANDALONE FUNCTIONS
	//	AND MUST BE ATTACHED TO A OBJ PROPERTY OF THE SAME NAME
	//

	// add an Array or Element(s)
	function add(obj){
		// concatenate either contents of an array, or 1 or more objects passed as params to stack
		(obj instanceof Array) ?
			// add Array to end of stack
			Array.prototype.push.apply(this, obj) :
			// convert params to
			Array.prototype.push.apply(this,
				Array.prototype.slice.call(arguments)
				) ;
		return this ;
	}

	function addAt(obj, pos){
			// if pos is not supplied
			(pos == undefined) ?
				// use standard add
				this.add(obj) :
				// the following technique is used to pass an array of items to splice
				Array.prototype.splice.apply( this,
					(obj instanceof Array) ?
						// temp array obj.concat() is to not change obj with, pos + howmany added to front
						obj.concat().unshift(pos, 0) :
						[obj].unshift(pos, 0)
					) ;
			return this ;
	}

	function remove (obj){
		var array = (obj instanceof Array) ?
			obj.concat() :
			Array.prototype.slice.call(arguments) ,

			obj = array.shift() ;

		// remove object from list
		for (var o=0; o<this.length; o++)
			if (this[o]==obj)
				this.splice(o, 1) ;

		//	recursively remove from stack until array.length == 0
		if (array.length) return this.remove(array) ;
		
		return this ;
	}

	// ???? error - with every recursion array els move so numbers refer to unintented start pos in splice
	// try this.removeAt.val 

	function removeAt (idx){
		var array = (idx instanceof Array) ?
			idx.concat() :
			Array.prototype.slice.call(arguments) ,
			//this.removeAt.val = this.removeAt.val || 1 ,
			//this.removeAt.val = this.removeAt.val? this.removeAt.val++ : 1 ,

			idx = array.shift() ;

			if( typeof idx == 'number' ) this.splice(idx, 1);

			if (array.length) return this.removeAt(array) ;

		return this ;
	}


	//////////////////////////////////////////////////////////////////////////////////////////
	// SET & MAP objects
	//////////////////////////////////////////////////////////////////////////////////////////

	//
	// Set augments Array and adds methods for adding and removing objects.
	//
	//		 


	var Set = app.Set = function Set(){
		var _stack =[] ;
		
		// add
		_stack.add = add;
		_stack.addAt = addAt;
		
		// remove
		_stack.remove = remove;
		_stack.removeAt = removeAt;
		
		//
		_stack.clear = function(){
			_stack=[] ;
		}
		// factory pattern ?
		return _stack;
	};


	//
	// Map augments Object and adds methods for adding and removing objects to Sets associated by a name.
	//
	//		

	var Map = app.Map = function Map(){
	    var map={} ;
	    Object.defineProperties(map, {
	    	'add':{
	    		value:function(id, obj) {
			    	if (id == 'add' || 'remove') ;// ad throw error thingy 'RESEVED'
			    	( map[id] || ( map[id] = new Set ) ) && map[id].add(obj) ;
			        return this;
			    }
			    , writable: false			    
			    , enumerable:false
	    	} ,
	    	'remove':{
	    		value:function(id, obj) {
					if (map.hasOwnProperty(id)) map[id].remove(obj) ;
					if(!map[id].length) delete map[id] ;
					return this;
			    }
			    , writable: false
			    , enumerable:false
	    	}
	    })

	    return map ;
	};

})(window.app || (window.app = {}));
