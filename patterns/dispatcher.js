
(function(app) {

    app.Dispatcher = (function(){

        //////////////////////////////////////////////////////////////////
        //
        // Dispatcher as a class
        // with an encapsulated list of listeners available to all Instances
        //
        //////////////////////////////////////////////////////////////////

        // All instances of these classes share / update the same vars
        var GLOBALCHANNELS={};

        // Dispatcher contsructor
        function Dispatcher(_private){

            //////////////////////
            // private channel
            //////////////////////

            var
                // if private create private CHANNELS OBJECT else reference GLOBALCHANNELS
                CHANNELS = (_private)? {} : GLOBALCHANNELS ;

            this.register = function(ev, callback) {
                if (typeof CHANNELS[ev] == 'undefined') CHANNELS[ev] = [];
                CHANNELS[ev].push(callback);
                /*
                //
                ( CHANNELS[ev] || ( CHANNELS[ev] = [] ) ) && CHANNELS[ev].push(callback) ;
                */
            };

            this.unregister = function(ev, callback) {
                if (CHANNELS.hasOwnProperty(ev))
                    for (var s=0; s<CHANNELS[ev].length; s++)
                        if (CHANNELS[ev][s] == callback) CHANNELS[ev].splice(s, 1) ;

                if(!CHANNELS[ev].length) delete CHANNELS[ev] ;

                /*  // using indexOf() does not work in < ie9

                var idx, c = CHANNELS ;
                if ( c.hasOwnProperty(ev) && (idx = c[ev].indexOf(callback) ) != -1 ) c[ev].splice(idx, 1) ;
                if ( !c[ev].length ) delete c[ev] ;
                */
            };

            this.emit = function(ev, params, toglobal) {

                // toglobal gives the opportunity to communicate with global observers from a private observer
                // if toglobal == true reference GLOBALCHANNELS during lifetime of method invokation
                var channels = (toglobal)? GLOBALCHANNELS : CHANNELS ;

                if (typeof channels[ev] != 'undefined')
                    for (var i = 0, l = channels[ev].length; i < l; i++)
                        channels[ev][i].call(this, ev, params);

                // if instance is _private and toglobal == true also emit to private channels (by omitting togloal param)
                if (toglobal && _private) this.emit(ev, params) ;
            };

        };

        return Dispatcher ;

    })();



})(window.app || (window.app = {}));