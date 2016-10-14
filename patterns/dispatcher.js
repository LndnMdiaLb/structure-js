// dependency : collection.js

(function(app) {

    app.Dispatcher = (function(){

        // All instances of this classes share / update the same var
        var GLOBALCHANNELS = new app.Map;

        // Dispatcher contsructor
        function Dispatcher(_private){

            //////////////////////
            // private channel
            //////////////////////

            var
                // if private create private CHANNELS OBJECT else reference GLOBALCHANNELS
                CHANNELS = (_private) ? new app.Map : GLOBALCHANNELS ;

            this.register = function(ev, callback) {
                CHANNELS.add(ev, callback);
                return this ;
            };

            this.unregister = function(ev, callback) {
                CHANNELS.remove(ev, callback);
                return this ;
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

            // helper method for easily applying compostion

            this.through = function(obj){
                obj.register = this.register.bind(this) ;
                obj.unregister = this.unregister.bind(this) ;
                obj.emit = this.emit.bind(this) ;
            }

        };

        return Dispatcher ;

    })();


})(window.app || (window.app = {}));
