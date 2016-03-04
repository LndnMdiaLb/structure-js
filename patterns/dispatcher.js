
(function(app) {

    //////////////////////////////////////////////////////////////////
    //
    // Dispatcher as a class
    // with an encapsulated list of listeners available to all Instances
    //
    //////////////////////////////////////////////////////////////////


    app.Mediator = (function(){

        var GLOBALCHANNELS={};

        function EventDispatcher(global){

            var CHANNELS = (global)? GLOBALCHANNELS : {};

            this.register = function(ev, callback) {
                if (typeof CHANNELS[ev] == 'undefined') CHANNELS[ev] = [];
                CHANNELS[ev].push(callback);
            };

            this.unregister = function(ev, callback) {
                if (typeof CHANNELS[ev] != 'undefined') {
                    //Array.prototype.
                }
            };
            this.emit = function(ev, params) {
                if (typeof CHANNELS[ev] != 'undefined')
                    for (var i = 0, l = CHANNELS[ev].length; i < l; i++)
                        CHANNELS[ev][i].call(this, ev, params);
            };

        };

        return EventDispatcher ;

    })();



})(window.app || (window.app = {}));