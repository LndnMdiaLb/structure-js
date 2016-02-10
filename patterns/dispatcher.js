
(function(app) {

    //////////////////////////////////////////////////////////////////
    //
    // Dispatcher as a class
    // with an encapsulated list of listeners available to all Instances
    //
    //////////////////////////////////////////////////////////////////


    app.MediatorFactory =  function(global){

        // %%ERROR%% this is not  working yet need to investigate
        var GLOBALCHANNELS={};

        return (function(global){

            // protected list of listeners
            // if global == true the instantiated Mediator shares CHANNEL with other Meidators
            console.log(global);
            var CHANNELS=(!!global)? GLOBALCHANNELS : {};

            function EventDispatcher(){};

            EventDispatcher.prototype.register = function(evt_name, callback) {
                if (typeof CHANNELS[evt_name] == 'undefined') {
                    CHANNELS[evt_name] = [];
                }
                CHANNELS[evt_name].push(callback);
            };

            EventDispatcher.prototype.unregister = function(evt_name, callback) {
                if (typeof CHANNELS[evt_name] != 'undefined') {
                    //Array.prototype.
                }
            };

            EventDispatcher.prototype.emit = function(evt_name, params) {
                if (typeof CHANNELS[evt_name] != 'undefined') {
                    for (var i = 0, l = CHANNELS[evt_name].length; i < l; i++) {
                        CHANNELS[evt_name][i].call(this, evt_name, params);
                    }
                }
            };

            return EventDispatcher ;

        })(global);
    };


    //////////////////////////////////////////////////////////////////


    app.EventDispatcher =  (function(){

        // protected list of listeners
        var listeners={};

        function EventDispatcher(){};

        EventDispatcher.prototype.register = function(evt_name, callback) {
            if (typeof listeners[evt_name] == 'undefined') {
                listeners[evt_name] = [];
            }
            listeners[evt_name].push(callback);
        };

        EventDispatcher.prototype.unregister = function(evt_name, callback) {
            if (typeof listeners[evt_name] != 'undefined') {
                //Array.prototype.
            }
        };

        EventDispatcher.prototype.emit = function(evt_name, params) {
            if (typeof listeners[evt_name] != 'undefined') {
                for (var i = 0, l = listeners[evt_name].length; i < l; i++) {
                    listeners[evt_name][i].call(this, evt_name, params);
                }
            }
        };

        return EventDispatcher ;

    })();

})(window.app || (window.app = {}));