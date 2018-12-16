/**
 * Travail individuel pour langage web - Monsieur Olivier Gérard
 *
 * Main functions frontend
 *
 * @author ZHANG Zhao
 * @email  zo.zhang@gmail.com
 * @demo   langage-web.zhaozhang.fr
 */
;(function($){

window.ZoEngine = function(selector, all){
    return new _ZoEngine(selector, all);
}

// Extends functions regularity
function _ZoEngine(selector, all) {
    if ('undefined' === selector) {
        return this;
    }
    if (all) {

        this.elements = $.querySelectorAll(selector);
    } else {
        this.elements = $.querySelector(selector);
    }
    return this;
}

_ZoEngine.prototype = {
    langange : 'fr',
    version  : '0.1.0',
    constructor : _ZoEngine,
    addEvent: function (event, fn) {
        this.elements.addEventListener(event, fn);
        return this;
    },
    append: function (newElem) {
        this.elements.insertAdjacentHTML('beforeend', newElem);
        return this;
    },
    focus: function() {
        this.elements.focus();
        return this;
    },
    blur: function() {
        this.elements.focus();
        return this;
    },
    val: function(text) {
        if (text) {
            this.elements.value = text;
            return this;
        }
        return this.elements.value;
    },
    remove: function() {
        this.elements.remove();
        return this;
    },
    hasClass : function(name) {
        return !!this.elements.className.match( new RegExp( "(\\s|^)" + name + "(\\s|$)") );
    },
    addClass : function(name){
        if(!this.hasClass( name ) ){
            this.elements.className += " " + name;
        }
        return this;
    },
    removeClass : function(name) {
        if (this.hasClass(name)) {
            this.elements.className = this.elements.className.replace(new RegExp("(\\s|^)" + name + "(\\s|$)"), " ");
        }
        return this;
    },
    // get xmlhttp object
    getRequest: function() {
        var request;
        // ingonre error object request.
        if ("undefined" != typeof XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            var aVersions = ["Msxml2.XMLHttp.5.0", "Msxml2.XMLHttp.4.0",
                "Msxml2.XMLHttp.3.0", "Msxml2.XMLHttp", "Microsoft.XMLHttp"];
            for (var i = 0; i < aVersions.length; i++) {
                try {
                    request = new ActiveXObject(aVersions[i]);
                    break;
                } catch (e) {
                    console.debug(e);
                }
            }
        }

        return request;
    },
    // get ajax request
    Ajax: function(url, callback) {
        var request;

        this.url = url || false;

        try {
            request = this.getRequest();

            // ignore empty request url.
            if (false === this.url) {
                return;
            }

            // set callback function.
            request.onreadystatechange = function(){
                if (4 === request.readyState) {
                    return callback(request);
                }
            };

            // set request method and request path.
            request.open('GET', url, false);
            // disabling asynchronous is just to save the returned data as a global variable,
            // just use in the case of small data and test.

            // set request content type.
            request.setRequestHeader('Content-Type', 'application/json');

            request.send(null);

        } catch (e) {
            console.debug(e);
        }

        // return ajax object
        return this;
    }
}

})(document);