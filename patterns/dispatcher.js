
(function(app) {

    //////////////////////////////////////////////////////////////////
    //
    // Dispatcher as a class
    // with an encapsulated list of listeners available to all Instances
    //
    //////////////////////////////////////////////////////////////////


    app.Dispatcher = (function(){

        var GLOBALCHANNELS={};

        // Dispatcher contsructor
        function EventDispatcher(_private){

            var _g = GLOBALCHANNELS
            var CHANNELS = (_private)? {} : _g ;

            this.register = function(ev, callback) {
                if (typeof CHANNELS[ev] == 'undefined') CHANNELS[ev] = [];
                CHANNELS[ev].push(callback);
            };

            this.unregister = function(ev, callback) {
                if (CHANNELS.hasOwnProperty(ev))
                    for (var s=0; s<CHANNELS[ev].length; s++)
                        if (CHANNELS[ev][s] == callback) CHANNELS[ev].splice(s, 1) ;

                if(!CHANNELS[ev].length) delete CHANNELS[ev] ;
            };

            this.emit = function(ev, params, toglobal) {

                // toglobal gives the opportunity to communicate with global observers from a private observer
                var channels = (toglobal)? _g : CHANNELS ;

                if (typeof channels[ev] != 'undefined')
                    for (var i = 0, l = channels[ev].length; i < l; i++)
                        channels[ev][i].call(this, ev, params);

                if (toglobal && _private) this.emit(ev, params) ;
            };

        };

        return EventDispatcher ;

    })();



})(window.app || (window.app = {}));

