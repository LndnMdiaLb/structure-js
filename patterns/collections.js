(function(app) {

	//////////////////////////////
	//
	//  This structure lies at the heart of
		// (behavioral) Observer Pattern, the Mediator,
		// (structural) the Copmosite Pattern
	//
	//////////////////////////////


	//////////////////////////////
	//  Method Declaration
	//////////////////////////////
	//	THESE DO NOT WORK AS STANDALONE FUNCTIONS
	//	AND MUST BE ATTACHED TO A OBJ PROPERTY OF THE SAME NAME

	// add an Array or Element(s)
	function add(obj){
		// concatenate either contents of an array, or 1 or more objects passed as params to stack
		(obj instanceof Array) ?
			// add Array to end of stack
			Array.prototype.push.apply(this, obj) :
			// convert params to
			Array.prototype.push.apply(this,
				Array.prototype.slice.call(arguments));
			//_stack.concat(Array.prototype.slice.call(arguments)) ;
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
			    /*  // using indexOf() does not work in < ie9
			    var idx;
			    if ( (idx = this.indexOf(obj) ) != -1 ) this.splice(idx, 1) ;
			    */
		if (array.length) return this.remove(array) ;
		/**/
		return this ;
	}

	 function removeAt (idx){
		var array = (obj instanceof Array) ?
			obj.concat() :
			Array.prototype.slice.call(arguments) ,

			obj = array.shift() ;

			if( typeof idx == 'number' ) this.splice(obj, 1);

			if (array.length) return this.removeAt(array) ;

		return this ;
	}


	//////////////////////////////////////////////////////////////////////////////////////////
	// ARRAY PROTOTYPE AUGMENTATION
	//////////////////////////////////////////////////////////////////////////////////////////

	// augmenting Array.prototype - all Arrays will 'inherit' functionality

	function AugmentArray(){
		Array.prototype.add = add;
		Array.prototype.addAt = addAt
		Array.prototype.remove = remove;
		Array.prototype.removeAt = removeAt;
	}


	//////////////////////////////////////////////////////////////////////////////////////////
	// FACTORY METHOD - AUGMENT AN INSTANCE
	//////////////////////////////////////////////////////////////////////////////////////////

	// factory pattern
	// decorator pattern ( decorate an array insatnce)
	// must use Decorator pattern to subclass


	// Set or Collection ?
	var Set = app.Set = function Set(){
		var _stack =[] ;
		//////////////
		_stack.add = add;
		_stack.addAt = addAt;
		//////////////
		_stack.remove = remove;
		_stack.removeAt = removeAt;
		//////////////
		_stack.clear = function(){
			_stack=[] ;
		}
		return _stack;
	};


	// Map , Lookup Table or AssociativeMap ?
	var Map = app.Map = function Map(){
	    var map={} ;
	    map.add = function(id, obj) {
	    	if(id == 'add' || 'remove') ;// ad throw error thingy 'RESEVED'
	    	( map[id] || ( map[id] = new Set ) ) && map[id].add(obj) ;
	        return this;
	    }
	    map.remove = function(id, obj) {
			if (map.hasOwnProperty(id)) map[id].remove(obj) ;
			if(!map[id].length) delete map[id] ;
			return this;
	    }
	    return map ;
	};

})(window.app || (window.app = {}));