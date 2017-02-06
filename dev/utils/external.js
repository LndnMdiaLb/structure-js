  // dependency : dispatcher.js
  // dependency : collections.js

(function(app) {

    var utils = app.utils = app.utils || {};


        // current usage:

        //     immediate
        //         load url
        //             emit global 'event' on completion
        //             emit private 'event' on completion
        //         load array of urls
        //             emit global 'event' on completion
        //             emit private 'event' on completion

        //     pause
        //         load url stored in key(s) .start()
        //             emit global 'event' on completion
        //             emit private 'event' on completion
        //         load url stored in all key .start()
        //             emit global 'event' on completion
        //             emit private 'event' on completion



    utils.IMGLoader = function IMGLoader (paused, _private){

        var loading = new app.Map ,
            dispatch = new app.Dispatcher(_private) ,
            paused = paused || false,
            defaultKey = 'images-loaded'
            ;

        // fast method to provide access to dispatcher api via composition
        dispatch.augment(this) ;

        // immutable default property
        Object.defineProperty(this, 'DEFAULT', {
            get:function(){
                return defaultKey ;
            }
        }) ;

        // method to block immediate load of images
        this.pause = function(){
            paused = true
        } ;

        //  load image(s)
        this.load = function(url, callback, emit) {
            // emitted sting on dispatch
            var key = emit || defaultKey

            function createimg(url){
                var im = new Image() ;
                // add image to Set in Map (at key)
                // this allows you to partition loads (on different keys passed via emit)
                loading.add(key, im) ;

                im.onload = function(e) {
                    // private callback past with each load function
                    if(callback) callback.call(app, e) ;
                    loading.remove(key, this) ;
                    // if emit string included and
                    if(!loading[key]) dispatch.emit(key) ;
                };
                // if paused prior to load methodcall temp store url
                // should this use utils.memory?
                (paused) ?
                    im._src = url :
                    im.src = url ;
            }

            (url instanceof Array)?
                url.forEach(createimg) :
                createimg(url)
                ;

            return dispatch ;
        }

        // remove
        this.start = function(){

            // remove temp stored src and apply to img attribute
            function src (im){
                im.src = im._src ;
                delete im._src ;
            }

            // load all images associated to all keys
            if (!arguments.length)
                for (key in loading)
                    loading[key].forEach(src)

            // // load images associated to specific keys
            if (!!arguments.length)
                Array.prototype.slice.call(arguments)
                    .forEach( function(key){
                        if(loading[key]) loading[key].forEach(src)
                    })
        }
    }


    /*
    create img
    on load
    */


    // Is or isn't localhost.

    utils.isLocalHost = function() {
        if (document.domain == 'localhost' || (document.domain.indexOf('10.91') != -1)) return true;
        return false;
    };

    // Json loader

    utils.loadJson = function(_url, handler) {

        var xmlhttp = new XMLHttpRequest();
        var url = _url;

        // contentType: "application/json; charset=utf-8",
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var json = JSON.parse(xmlhttp.responseText);
                handler(json);
            }
        };

        xmlhttp.open("GET", url, true);
         //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
        xmlhttp.send();

    };

})(window.app || (window.app = {}));
