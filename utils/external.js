(function(app) {

    var utils = app.utils = app.utils || {};

    // utils.loadDomImage = function(id, url, handler) {
    //     var im = new Image();
    //     var d = document.getElementById(id);
    //     im.onload = function() {
    //         d.appendChild(im);
    //         var myimg = document.getElementsByTagName('img')[0];
    //         handler(myimg);
    //     };
    //     im.src = url;
    //     im.id = "";
    // };

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