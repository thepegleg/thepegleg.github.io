var CRENDER_DEBUG = false;

function ImagesPreloader() {
    var self = this;
    this.curItem = -1;
    this.loadedImages = {};
    this.data = null;
    this.endCallback = null;
    this.processCallback = null;
    this.load = function (data, endCallback, processCallback) {
        this.data = data;
        this.endCallback = endCallback;
        this.processCallback = processCallback;
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            var img = new Image();
            img.src = item.src;
            this.loadedImages[item.name] = img;
        }
        wait();
    };

    function wait() {
        var itemsLoaded = 0;
        var itemsTotal = 0;
        for (var key in self.loadedImages) {
            if (self.loadedImages[key].complete) itemsLoaded++;
            itemsTotal++;
        }
        if (itemsLoaded >= itemsTotal) {
            if (self.endCallback) self.endCallback(self.loadedImages);
            return;
        } else {
            if (self.processCallback) self.processCallback(Math.floor(itemsLoaded / itemsTotal * 100));
            setTimeout(wait, 50);
        }
    }
}
var Utils = {
    touchScreen: ("ontouchstart" in window),
    globalScale: 1,
    setCookie: function (name, value) {
        try {
            window.localStorage.setItem(name, value);
        } catch (e) {
            var exp = new Date();
            exp.setDate(exp.getDate() + 365 * 10);
            document.cookie = name + "=" + value + "; expires=" + exp.toUTCString();
        }
    },
    getCookie: function (name) {
        var ret;
        try {
            ret = window.localStorage.getItem(name);
        } catch (e) {
            var prefix = name + "=";
            var cookieStartIndex = document.cookie.indexOf(prefix);
            if (cookieStartIndex == -1) return null;
            var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
            if (cookieEndIndex == -1) cookieEndIndex = document.cookie.length;
            ret = unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
        }
        return ret;
    },
    bindEvent: function (el, eventName, eventHandler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, eventHandler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, eventHandler);
        }
    },
    getObjectLeft: function (element) {
        var result = element.offsetLeft;
        if (element.offsetParent) result += Utils.getObjectLeft(element.offsetParent);
        return result;
    },
    getObjectTop: function (element) {
        var result = element.offsetTop;
        if (element.offsetParent) result += Utils.getObjectTop(element.offsetParent);
        return result;
    },
    parseGet: function () {
        var get = {};
        var s = new String(window.location);
        var p = s.indexOf("?");
        var tmp, params;
        if (p != -1) {
            s = s.substr(p + 1, s.length);
            params = s.split("&");
            for (var i = 0; i < params.length; i++) {
                tmp = params[i].split("=");
                get[tmp[0]] = tmp[1];
            }
        }
        return get;
    },
    globalPixelScale: 1,
    getMouseCoord: function (event, object) {
        var e = event || window.event;
        if (e.touches) e = e.touches[0];
        if (!e) return {
            x: 0,
            y: 0
        };
        var x = 0;
        var y = 0;
        var mouseX = 0;
        var mouseY = 0;
        if (object) {
            x = Utils.getObjectLeft(object);
            y = Utils.getObjectTop(object);
        }
        if (e.pageX || e.pageY) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        } else if (e.clientX || e.clientY) {
            mouseX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
            mouseY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
        }
        var retX = (mouseX - x);
        var retY = (mouseY - y);
        return {
            x: retX,
            y: retY
        };
    },
    extend: function (Child, Parent) {
        var F = function () {};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.superclass = Parent.prototype;
    },
    removeFromArray: function (arr, item) {
        var tmp = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != item) tmp.push(arr[i]);
        }
        return tmp;
    },
    showLoadProgress: function (val) {
        var scl = Utils.globalScale;
        var s = 'Loading: ' + val + '%';
        s += '<br><br>';
        s += '<div style="display: block; background: #000; width: ' + (val * scl * 2) + 'px; height: ' + (10 * scl) + 'px;">&nbsp;</div>';
        document.getElementById('progress').innerHTML = s;
    },
    hideAddressBarLock: false,
    mobileHideAddressBar: function () {
        if (Utils.hideAddressBarLock) return;
        window.scrollTo(0, 1);
    },
    mobileCheckIphone4: function () {
        if (window.devicePixelRatio) {
            if (navigator.userAgent.indexOf('iPhone') != -1 && window.devicePixelRatio == 2) return true;
        }
        return false;
    },
    mobileCheckBrokenGalaxyPhones: function () {
        if (window.devicePixelRatio) {
            if (navigator.userAgent.indexOf('GT-I9300') != -1 || navigator.userAgent.indexOf('GT-I8190') != -1 || navigator.userAgent.indexOf('Android 4.') != -1) return true;
        }
        return false;
    },
    checkSpilgamesEnvironment: function () {
        return (typeof ExternalAPI != "undefined" && ExternalAPI.type == "Spilgames" && ExternalAPI.check());
    },
    mobileCorrectPixelRatio: function () {
        var meta = document.createElement('meta');
        meta.name = "viewport";
        var content = "target-densitydpi=device-dpi, user-scalable=0";
        if (Utils.checkSpilgamesEnvironment()) {
            if (window.devicePixelRatio > 1) content += ", initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5";
            else content += ", initial-scale=1, maximum-scale=1, minimum-scale=1";
        } else {
            if (Utils.mobileCheckIphone4()) content += ", initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5";
            else content += ", initial-scale=1, maximum-scale=1, minimum-scale=1";
        }
        meta.content = content;
        document.getElementsByTagName('head')[0].appendChild(meta);
    },
    getMobileScreenResolution: function (landscape) {
        var scale = 1;
        var w = 0;
        var h = 0;
        var scales = [{
            scale: 1,
            width: 320,
            height: 480
        }, {
            scale: 1.5,
            width: 480,
            height: 720
        }, {
            scale: 2,
            width: 640,
            height: 960
        }];
        var container = {
            width: 0,
            height: 0
        };
        var prop = "";
        if (Utils.touchScreen) {
            container.width = Math.min(window.innerWidth, window.innerHeight);
            container.height = Math.max(window.innerWidth, window.innerHeight);
            prop = "height";
        } else {
            container.width = window.innerWidth;
            container.height = window.innerHeight;
            prop = "height";
        }
        var min = Number.MAX_VALUE;
        for (var i = 0; i < scales.length; i++) {
            var diff = Math.abs(container[prop] - scales[i][prop]);
            if (min > diff) {
                min = diff;
                scale = scales[i].scale;
            }
        }
        return Utils.getScaleScreenResolution(scale, landscape);
    },
    getScaleScreenResolution: function (scale, landscape) {
        var w, h;
        w = Math.round(320 * scale);
        h = Math.round(480 * scale);
        if (landscape) {
            var tmp = w;
            w = h;
            h = tmp;
        }
        return {
            width: w,
            height: h,
            scale: scale
        };
    },
    imagesRoot: 'images',
    initialResolution: {
        width: 320,
        height: 480,
        scale: 1
    },
    createLayout: function (container, resolution, debug, ignoreCanvas) {
        var scl = Utils.globalScale;
        Utils.initialResolution = resolution;
        var height = window.innerHeight;
        if ("orientation" in window) height = 2048;
        else document.body.style.overflow = "hidden";
        var s = "";
        s += '<div id="progress_container" align="center" style="width: 100%; height: ' + height + 'px; display: block; width: 100%; position: absolute; left: 0px; top: 0px;">';
        s += '<table cellspacing="0" cellpadding="0"><tr><td id="progress" align="center" valign="middle" style="width: ' + resolution.width + 'px; height: ' + resolution.height + 'px; color: #000; background: #fff; font-weight: bold; font-family: Verdana; font-size: ' + (12 * scl) + 'px; vertical-align: middle;"></td></tr></table>';
        s += '</div>';
        s += '<div id="screen_background_container" align="center" style="width: 100%; height: ' + height + 'px; position: absolute; left: 0px; top: 0px; display: none; z-index: 2;">'
        s += '<div id="screen_background_wrapper" style="width: ' + resolution.width + 'px; height: ' + resolution.height + 'px; overflow: hidden; position: relative;">';
        if (!ignoreCanvas) s += '<canvas id="screen_background" width="' + resolution.width + '" height="' + resolution.height + '"></canvas>';
        s += '</div>';
        s += '</div>';
        s += '<div id="screen_container" align="center" style="width: 100%; height: ' + height + 'px; position: absolute; left: 0px; top: 0px; display: none; z-index: 3;">';
        s += '<div id="screen_wrapper" width="' + resolution.width + '" height="' + resolution.height + '" style="width: ' + resolution.width + 'px; height: ' + resolution.height + 'px; overflow: hidden; position: relative;">';
        if (!ignoreCanvas) s += '<canvas id="screen" style="position: absolute; left: 0px; top: 0px; z-index: 1000000;" width="' + resolution.width + '" height="' + resolution.height + '">You browser does not support this application :(</canvas>';
        s += '</div>';
        s += '</div>';
        container.innerHTML = s;
        var p = document.createElement("div");
        p.setAttribute("id", "p2l_container");
        p.setAttribute("align", "center");
        var w = resolution.width;
        p.setAttribute("style", "width: 100%; height: " + height + "px; position: absolute; left: 0px; top: 0px; display: none; z-index: 1000; background: #fff;");
        p.innerHTML = '<img id="p2l" src="' + Utils.imagesRoot + '/p2l.jpg" style="padding-top: ' + ((w - 240) / 2) + 'px" />';
        document.body.appendChild(p);
    },
    preventEvent: function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    },
    addMobileListeners: function (landscape, ignoreIOS7) {
        if (ignoreIOS7 || !navigator.userAgent.match(/(iPad|iPhone|iPod).*CPU.*OS 7_\d/i)) {
            Utils.bindEvent(document.body, "touchstart", Utils.preventEvent);
        }
        Utils.bindEvent(window, "scroll", function (e) {
            setTimeout(Utils.mobileHideAddressBar, 300);
        });
        setInterval("Utils.checkOrientation(" + (landscape ? "true" : "false") + ")", 500);
        setTimeout(Utils.mobileHideAddressBar, 500);
    },
    storeOrient: null,
    noCheckOrient: false,
    checkOrientation: function (landscape) {
        if (!Utils.touchScreen) return;
        if (!document.getElementById('screen_container')) return;
        var getParams = Utils.parseGet();
        if (Utils.noCheckOrient || getParams.nocheckorient == 1) return;
        var orient = false;
        if (window == window.parent) {
            orient = (window.innerWidth > window.innerHeight);
        } else {
            var longSide = Math.max(screen.width, screen.height);
            var shortSide = Math.min(screen.width, screen.height);
            var lc = Math.abs(window.innerWidth - longSide);
            var sc = Math.abs(window.innerWidth - shortSide);
            orient = (lc < sc);
        }
        if (Utils.storeOrient === orient) return;
        Utils.storeOrient = orient;
        var ok = (orient == landscape);
        if (!ok) {
            Utils.dispatchEvent("lockscreen");
            document.getElementById('p2l_container').style.display = 'none';
            document.getElementById('screen_background_container').style.display = 'block';
            document.getElementById('screen_container').style.display = 'block';
        } else {
            Utils.dispatchEvent("unlockscreen");
            document.getElementById('p2l_container').style.display = 'none';
            document.getElementById('screen_background_container').style.display = 'block';
            document.getElementById('screen_container').style.display = 'block';
        }
        if (Utils.checkSpilgamesEnvironment()) document.getElementById('p2l_container').style.display = 'none';
        setTimeout(Utils.mobileHideAddressBar, 1000);
        setTimeout(Utils.fitLayoutToScreen, 1000);
    },
    fitLayoutTimer: null,
    addFitLayoutListeners: function () {
        Utils.fitLayoutTimer = setInterval(Utils.fitLayoutToScreen, 500);
    },
    removeFitLayoutListeners: function () {
        clearInterval(Utils.fitLayoutTimer);
    },
    fitLayoutLock: false,
    fitLayoutCorrectHeight: 0,
    fitLayoutToScreen: function (container) {
        if (Utils.fitLayoutLock) return;
        var p, s, width, height;
        if (typeof container != "object" || !container.width) {
            width = window.innerWidth;
            height = window.innerHeight;
            if (Utils.checkSpilgamesEnvironment()) height -= 25;
            height += Utils.fitLayoutCorrectHeight;
            container = {
                width: width,
                height: height
            };
        }
        s = document.getElementById("screen_wrapper");
        if (!s) return;
        if (!s.initWidth) {
            s.initWidth = Utils.initialResolution.width;
            s.initHeight = Utils.initialResolution.height;
        }
        width = s.initWidth;
        height = s.initHeight;
        var scale = 1;
        var scaleX = container.width / width;
        var scaleY = container.height / height;
        scale = (scaleX < scaleY ? scaleX : scaleY);
        Utils.globalPixelScale = scale;
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
        if (s.lastWidth == width && s.lastHeight == height) return;
        s.lastWidth = width;
        s.lastHeight = height;
        Utils.resizeElement("screen", width, height);
        Utils.resizeElement("screen_background", width, height);
        s = document.getElementById("progress");
        if (s) {
            s.style.width = (~~width) + "px";
            s.style.height = (~~height) + "px";
        }
        s = document.getElementById("screen_wrapper");
        if (s) {
            s.style.width = (~~width) + "px";
            s.style.height = (~~height) + "px";
        }
        s = document.getElementById("screen_background_wrapper");
        if (s) {
            s.style.width = (~~width) + "px";
            s.style.height = (~~height) + "px";
        }
        s = document.getElementById("p2l_container");
        if (s) {
            s.style.width = (~~window.innerWidth) + "px";
            s.style.height = "2048px";
        }
        Utils.dispatchEvent("fitlayout");
        setTimeout(Utils.mobileHideAddressBar, 50);
    },
    resizeElement: function (id, width, height) {
        var s = document.getElementById(id);
        if (!s) return;
        s.setAttribute("width", width);
        s.setAttribute("height", height);
    },
    drawIphoneLimiter: function (stage, landscape) {
        if (landscape) stage.drawRectangle(240, 295, 480, 54, "#f00", true, 0.5, true);
        else stage.drawRectangle(160, 448, 320, 64, "#f00", true, 0.5, true);
    },
    drawGrid: function (stage, landscape, col) {
        if (typeof landscape == 'undefined') landscape = false;
        var dx = 10;
        var dy = 10;
        if (typeof col == 'undefined') col = '#FFF';
        var w = 1 / Utils.globalScale / Utils.globalPixelScale;
        var s = {
            w: (landscape ? 480 : 320),
            h: (landscape ? 320 : 480)
        }
        for (var x = dx; x < s.w; x += dx) {
            var o = 0.1 + 0.1 * (((x - dx) / dx) % 10);
            stage.drawLine(x, 0, x, s.h, w, col, o);
        }
        for (var y = dy; y < s.h; y += dy) {
            var o = 0.1 + 0.1 * (((y - dy) / dy) % 10);
            stage.drawLine(0, y, s.w, y, w, col, o);
        }
    },
    drawScaleFix: function (stage, landscape) {
        if (Utils.globalScale == 0.75) {
            if (landscape) stage.drawRectangle(507, 160, 54, 320, "#000", true, 1, true);
            else stage.drawRectangle(160, 507, 320, 54, "#000", true, 1, true);
        }
        if (Utils.globalScale == 1.5) {
            if (landscape) stage.drawRectangle(510, 160, 60, 320, "#000", true, 1, true);
            else stage.drawRectangle(160, 510, 320, 60, "#000", true, 1, true);
        }
    },
    grad2radian: function (val) {
        return val / (180 / Math.PI);
    },
    radian2grad: function (val) {
        return val * (180 / Math.PI);
    },
    eventsListeners: [],
    onlockscreen: null,
    onunlockscreen: null,
    onfitlayout: null,
    addEventListener: function (type, callback) {
        EventsManager.addEvent(Utils, type, callback);
    },
    removeEventListener: function (type, callback) {
        EventsManager.removeEvent(Utils, type, callback);
    },
    dispatchEvent: function (type, params) {
        return EventsManager.dispatchEvent(Utils, type, params);
    }
}
var EventsManager = {
    addEvent: function (obj, type, callback) {
        if (!obj.eventsListeners) return;
        for (var i = 0; i < obj.eventsListeners.length; i++) {
            if (obj.eventsListeners[i].type === type && obj.eventsListeners[i].callback === callback) return;
        }
        obj.eventsListeners.push({
            type: type,
            callback: callback
        });
    },
    removeEvent: function (obj, type, callback) {
        if (!obj.eventsListeners) return;
        for (var i = 0; i < obj.eventsListeners.length; i++) {
            if (obj.eventsListeners[i].type === type && obj.eventsListeners[i].callback === callback) {
                obj.eventsListeners = Utils.removeFromArray(obj.eventsListeners, obj.eventsListeners[i]);
                return;
            }
        }
    },
    dispatchEvent: function (obj, type, params) {
        if (!obj.eventsListeners) return;
        var ret;
        if (typeof obj["on" + type] == "function") {
            ret = obj["on" + type](params);
            if (ret === false) return false;
        }
        for (var i = 0; i < obj.eventsListeners.length; i++) {
            if (obj.eventsListeners[i].type === type) {
                ret = obj.eventsListeners[i].callback(params);
                if (ret === false) return false;
            }
        }
    }
}
var ANCHOR_ALIGN_LEFT = -1;
var ANCHOR_ALIGN_CENTER = 0;
var ANCHOR_ALIGN_RIGHT = 1;
var ANCHOR_VALIGN_TOP = -1;
var ANCHOR_VALIGN_MIDDLE = 0;
var ANCHOR_VALIGN_BOTTOM = 1;

function Sprite(img, w, h, f, l) {
    this.uid = 0;
    this.stage = null;
    this.x = 0;
    this.y = 0;
    this.width = w;
    this.height = h;
    this.offset = {
        left: 0,
        top: 0
    };
    this.anchor = {
        x: 0,
        y: 0
    };
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.zIndex = 0;
    this.visible = true;
    this.opacity = 1;
    this['static'] = false;
    this.ignoreViewport = false;
    this.animated = true;
    this.currentFrame = 0;
    this.totalFrames = Math.max(1, ~~f);
    if (this.totalFrames <= 1) this.animated = false;
    this.currentLayer = 0;
    this.totalLayers = Math.max(1, ~~l);
    this.bitmap = img;
    this.mask = null;
    this.fillColor = false;
    this.destroy = false;
    this.animStep = 0;
    this.animDelay = 1;
    this.drawAlways = false;
    this.dragged = false;
    this.dragX = 0;
    this.dragY = 0;
    this.getX = function () {
        return Math.round(this.x * Utils.globalScale);
    };
    this.getY = function () {
        return Math.round(this.y * Utils.globalScale);
    };
    this.getWidth = function () {
        return this.width * Math.abs(this.scaleX) * Utils.globalScale;
    };
    this.getHeight = function () {
        return this.height * Math.abs(this.scaleY) * Utils.globalScale;
    };
    this.startDrag = function (x, y) {
        this.dragged = true;
        this.dragX = x;
        this.dragY = y;
    }
    this.stopDrag = function () {
        this.dragged = false;
        this.dragX = 0;
        this.dragY = 0;
    }
    this.play = function () {
        this.animated = true;
    };
    this.stop = function () {
        this.animated = false;
    };
    this.gotoAndStop = function (frame) {
        this.currentFrame = frame;
        this.stop();
    };
    this.gotoAndPlay = function (frame) {
        this.currentFrame = frame;
        this.play();
    };
    this.removeTweens = function () {
        if (!this.stage) return;
        this.stage.clearObjectTweens(this);
    };
    this.addTween = function (prop, end, duration, ease, onfinish, onchange) {
        if (!this.stage) return;
        var val = this[prop];
        if (isNaN(val)) return;
        var t = stage.createTween(this, prop, val, end, duration, ease);
        t.onchange = onchange;
        t.onfinish = onfinish;
        return t;
    };
    this.moveTo = function (x, y, duration, ease, onfinish, onchange) {
        duration = ~~duration;
        if (duration <= 0) {
            this.setPosition(x, y);
        } else {
            var t1 = this.addTween('x', x, duration, ease, onfinish, onchange);
            if (t1) t1.play();
            var t2 = this.addTween('y', y, duration, ease, (t1 ? null : onfinish), (t1 ? null : onchange));
            if (t2) t2.play();
        }
        return this;
    }
    this.moveBy = function (x, y, duration, ease, onfinish, onchange) {
        return this.moveTo(this.x + x, this.y + y, duration, ease, onfinish, onchange);
    }
    this.fadeTo = function (opacity, duration, ease, onfinish, onchange) {
        duration = ~~duration;
        if (duration <= 0) {
            this.opacity = opacity;
        } else {
            var t = this.addTween('opacity', opacity, duration, ease, onfinish, onchange);
            if (t) t.play();
        }
        return this;
    }
    this.fadeBy = function (opacity, duration, ease, onfinish, onchange) {
        var val = Math.max(0, Math.min(1, this.opacity + opacity));
        return this.fadeTo(val, duration, ease, onfinish, onchange);
    }
    this.rotateTo = function (rotation, duration, ease, onfinish, onchange) {
        duration = ~~duration;
        if (duration <= 0) {
            this.rotation = rotation;
        } else {
            var t = this.addTween('rotation', rotation, duration, ease, onfinish, onchange);
            if (t) t.play();
        }
        return this;
    }
    this.rotateBy = function (rotation, duration, ease, onfinish, onchange) {
        return this.rotateTo(this.rotation + rotation, duration, ease, onfinish, onchange);
    }
    this.scaleTo = function (scale, duration, ease, onfinish, onchange) {
        duration = ~~duration;
        if (duration <= 0) {
            this.scaleX = this.scaleY = scale;
        } else {
            var t1 = this.addTween('scaleX', scale, duration, ease, onfinish, onchange);
            if (t1) t1.play();
            var t2 = this.addTween('scaleY', scale, duration, ease, (t1 ? null : onfinish), (t1 ? null : onchange));
            if (t2) t2.play();
        }
        return this;
    }
    this.nextFrame = function () {
        this.dispatchEvent("enterframe", {
            target: this
        });
        if (!this.animated) return;
        this.animStep++;
        if (this.animStep >= this.animDelay) {
            this.currentFrame++;
            this.animStep = 0;
        }
        if (this.currentFrame >= this.totalFrames) this.currentFrame = 0;
    };
    this.eventsWhenInvisible = false;
    this.onmouseover = null;
    this.onmouseout = null;
    this.onmousedown = null;
    this.onmouseup = null;
    this.onclick = null;
    this.oncontextmenu = null;
    this.onmousemove = null;
    this.onenterframe = null;
    this.onprerender = null;
    this.onrender = null;
    this.onadd = null;
    this.onremove = null;
    this.onbox2dsync = null;
    this.mouseOn = false;
    this.getPosition = function () {
        return {
            x: this.x,
            y: this.y
        }
    }
    this.setPosition = function (x, y) {
        if ((typeof y == 'undefined') && (typeof x['x'] != 'undefined') && (typeof x['y'] != 'undefined')) {
            return this.setPosition(x.x, x.y);
        }
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }
    this.getAnchor = function () {
        return this.anchor;
    }
    this.setAnchor = function (x, y) {
        if ((typeof y == 'undefined') && (typeof x['x'] != 'undefined') && (typeof x['y'] != 'undefined')) {
            return this.setAnchor(x.x, x.y);
        }
        this.anchor.x = parseFloat(x);
        this.anchor.y = parseFloat(y);
    }
    this.alignAnchor = function (h, v) {
        h = parseInt(h);
        if (isNaN(h)) h = ANCHOR_ALIGN_CENTER;
        if (h < 0) h = ANCHOR_ALIGN_LEFT;
        if (h > 0) h = ANCHOR_ALIGN_RIGHT;
        v = parseInt(v);
        if (isNaN(v)) v = ANCHOR_VALIGN_MIDDLE;
        if (v < 0) v = ANCHOR_VALIGN_TOP;
        if (v > 0) v = ANCHOR_VALIGN_BOTTOM;
        this.anchor.x = this.width * h / 2;
        this.anchor.y = this.height * v / 2;
        return this.getAnchor();
    }
    this.getAbsoluteAnchor = function () {
        return this.getPosition();
    }
    this.getRelativeCenter = function () {
        var a = this.getAnchor();
        if (a.x == 0 && a.y == 0) return a;
        var c = new Vector(-a.x * this.scaleX, -a.y * this.scaleY);
        c.rotate(-this.rotation);
        return c;
    }
    this.getAbsoluteCenter = function () {
        var c = this.getRelativeCenter();
        var v = {
            x: c.x,
            y: c.y
        };
        v.x += this.x;
        v.y += this.y;
        return v;
    }
    this.getCenter = function () {
        return this.getAbsoluteCenter();
    }
    this.getDrawRectangle = function () {
        var c = this.getCenter(),
            r = new Rectangle(0, 0, this.width * Math.abs(this.scaleX), this.height * Math.abs(this.scaleY), this.rotation);
        r.move(c.x, c.y);
        return r;
    }
    this.getAABBRectangle = function () {
        var r = this.getDrawRectangle(),
            w = r.AABB[1].x - r.AABB[0].x,
            h = r.AABB[1].y - r.AABB[0].y;
        return new Rectangle(r.AABB[0].x + (w / 2), r.AABB[0].y + (h / 2), w, h, 0);
    }
    this.localToGlobal = function (x, y) {
        var p = ((typeof x == 'object') && (typeof x['x'] != 'undefined') && (typeof x['y'] != 'undefined')) ? new Vector(x.x + 0, x.y + 0) : new Vector(x, y);
        p.rotate(this.rotation).add(this.getPosition());
        return p;
    }
    this.globalToLocal = function (x, y) {
        var p = ((typeof x == 'object') && (typeof x['x'] != 'undefined') && (typeof x['y'] != 'undefined')) ? new Vector(x.x + 0, x.y + 0) : new Vector(x, y);
        p.subtract(this.getPosition()).rotate(-this.rotation);
        return p;
    }
    this.allowDebugDrawing = true;
    this.debugDraw = function () {
        if (!this.visible) return;
        if (!this.allowDebugDrawing) return;
        var a = this.getPosition(),
            c = this.getCenter(),
            r = this.getDrawRectangle(),
            aabb = this.getAABBRectangle();
        stage.drawCircle(a.x, a.y, 1, 1, 'rgba(255,0,0,0.9)');
        stage.drawCircle(c.x, c.y, 1, 1, 'rgba(0,255,0,0.9)');
        stage.drawLine(a.x, a.y, c.x, c.y, 1, 'rgba(255,255,255,0.5)');
        stage.drawPolygon(r.vertices, 0.5, 'rgba(255,0,255,0.5)', 1);
        stage.drawLine(aabb.vertices[0].x, aabb.vertices[0].y, aabb.vertices[2].x, aabb.vertices[2].y, 0.1, 'rgba(255,255,255,0.5)');
        stage.drawLine(aabb.vertices[2].x, aabb.vertices[0].y, aabb.vertices[0].x, aabb.vertices[2].y, 0.1, 'rgba(255,255,255,0.5)');
        stage.drawPolygon(aabb.vertices, 0.5, 'rgba(255,255,255,0.5)');
    }
    this.setZIndex = function (z) {
        this.zIndex = ~~z;
        if (!this.stage) return;
        this.stage.setZIndex(this, ~~z);
    }
    this.eventsListeners = [];
    this.addEventListener = function (type, callback) {
        EventsManager.addEvent(this, type, callback);
    }
    this.removeEventListener = function (type, callback) {
        EventsManager.removeEvent(this, type, callback);
    }
    this.dispatchEvent = function (type, params) {
        return EventsManager.dispatchEvent(this, type, params);
    }
    this.hitTestPoint = function (x, y, checkPixel, checkDragged, debug) {
        if (!this.stage)
            return false;
        return this.stage.hitTestPointObject(this, x, y, checkPixel, checkDragged, debug);
    }
}

function Tween(obj, prop, start, end, duration, callback) {
    var self = this;
    if (typeof obj != 'object') obj = null;
    if (obj) {
        if (typeof obj[prop] == 'undefined') throw new Error('Trying to tween undefined property "' + prop + '"');
        if (isNaN(obj[prop])) throw new Error('Tweened value can not be ' + (typeof obj[prop]));
    } else {
        if (isNaN(prop)) throw new Error('Tweened value can not be ' + (typeof prop));
    }
    if (typeof callback != 'function') callback = Easing.linear.easeIn;
    this.obj = obj;
    this.prop = prop;
    this.onchange = null;
    this.onfinish = null;
    this.start = start;
    this.end = end;
    this.duration = ~~duration;
    this.callback = callback;
    this.playing = false;
    this._pos = -1;
    this.play = function () {
        self.playing = true;
        self.tick();
    }
    this.pause = function () {
        self.playing = false;
    }
    this.rewind = function () {
        self._pos = -1;
    }
    this.forward = function () {
        self._pos = this.duration;
    }
    this.stop = function () {
        self.pause();
        self.rewind();
    }
    this.updateValue = function (val) {
        if (self.obj) {
            self.obj[self.prop] = val;
        } else {
            self.prop = val;
        }
    }
    this.tick = function () {
        if (!self.playing) return false;
        self._pos++;
        if (self._pos < 0) return false;
        if (self._pos > self.duration) return self.finish();
        var func = self.callback;
        var val = func(self._pos, self.start, self.end - self.start, self.duration);
        this.updateValue(val);
        self.dispatchEvent("change", {
            target: self,
            value: val
        });
        return false;
    }
    this.finish = function () {
        self.stop();
        self.updateValue(self.end);
        return self.dispatchEvent("finish", {
            target: self,
            value: self.end
        });
    }
    this.eventsListeners = [];
    this.addEventListener = function (type, callback) {
        EventsManager.addEvent(this, type, callback);
    }
    this.removeEventListener = function (type, callback) {
        EventsManager.removeEvent(this, type, callback);
    }
    this.dispatchEvent = function (type, params) {
        return EventsManager.dispatchEvent(this, type, params);
    }
}
var Easing = {
    back: {
        easeIn: function (t, b, c, d) {
            var s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function (t, b, c, d) {
            var s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            var s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    bounce: {
        easeIn: function (t, b, c, d) {
            return c - Easing.bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
            else if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            else if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        },
        easeInOut: function (t, b, c, d) {
            if (t < d / 2) return Easing.bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
            else return Easing.bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },
    circular: {
        easeIn: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    cubic: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    },
    exponential: {
        easeIn: function (t, b, c, d) {
            return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function (t, b, c, d) {
            return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    linear: {
        easeIn: function (t, b, c, d) {
            return c * t / d + b;
        },
        easeOut: function (t, b, c, d) {
            return c * t / d + b;
        },
        easeInOut: function (t, b, c, d) {
            return c * t / d + b;
        }
    },
    quadratic: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    },
    quartic: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    quintic: {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    sine: {
        easeIn: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    }
}

    function StageTimer(callback, timeout, repeat) {
        this.repeat = repeat;
        this.initialTimeout = timeout;
        this.timeout = timeout;
        this.callback = callback;
        this.paused = false;
        this.update = function () {
            if (this.paused) return;
            this.timeout--;
            if (this.timeout <= 0) {
                if (typeof this.callback == "function") this.callback();
                if (typeof this.callback == "string") eval(this.callback);
                if (this.repeat) this.timeout = this.initialTimeout;
                else return true;
            }
            return false;
        };
        this.resume = function () {
            this.paused = false;
        };
        this.pause = function () {
            this.paused = true;
        };
    }

    function Stage(cnsId, w, h) {
        var self = this;
        this.canvas = null;
        if (cnsId) {
            this.canvas = document.getElementById(cnsId);
            this.canvas.ctx = this.canvas.getContext('2d');
        }
        this.backBuffer = null;
        this.screenWidth = w;
        this.screenHeight = h;
        this.viewport = {
            x: 0,
            y: 0
        };
        this.objects = [];
        this.objectsCounter = 0;
        try {
            this.buffer = document.createElement('canvas');
            this.buffer.width = w * Utils.globalScale;
            this.buffer.height = h * Utils.globalScale;
            this.buffer.ctx = this.buffer.getContext('2d');
        } catch (e) {
            this.buffer = this.canvas;
        }
        this.delay = 40;
        this.fillColor = false;
        this.started = false;
        this.fps = 0;
        this.lastFPS = 0;
        this.showFPS = false;
        this.pixelClickEvent = false;
        this.pixelMouseUpEvent = false;
        this.pixelMouseDownEvent = false;
        this.pixelMouseMoveEvent = false;
        this.ceilSizes = false;
        this.tmMain
        this.tmFPS
        this.clearLock = false;
        this.destroy = function () {
            clearTimeout(this.tmMain);
            clearTimeout(this.tmFPS);
            this.stop();
            this.clear();
            this.clearScreen(this.canvas);
        }
        this.clearScreen = function (canvas) {
            if (!this.clearLock) canvas.ctx.clearRect(0, 0, this.screenWidth * Utils.globalScale * Utils.globalPixelScale, this.screenHeight * Utils.globalScale * Utils.globalPixelScale);
        }
        this.findMaxZIndex = function () {
            var max = -1;
            var ix = false;
            for (var i = 0; i < this.objects.length; i++) {
                if (this.objects[i].zIndex > max) {
                    max = this.objects[i].zIndex;
                    ix = i;
                }
            }
            return {
                index: ix,
                zIndex: max
            };
        };
        this.findMinZIndex = function () {
            var min = -1;
            var ix = false;
            for (var i = 0; i < this.objects.length; i++) {
                if (i == 0) {
                    min = this.objects[i].zIndex;
                    ix = 0;
                }
                if (this.objects[i].zIndex < min) {
                    min = this.objects[i].zIndex;
                    ix = i;
                }
            }
            return {
                index: ix,
                zIndex: min
            };
        };
        this.addChild = function (item) {
            var f = this.findMaxZIndex();
            var z = item.zIndex;
            if (f.index !== false) item.zIndex = f.zIndex + 1;
            else item.zIndex = 0;
            this.objectsCounter++;
            item.uid = this.objectsCounter;
            item.stage = this;
            this.objects.push(item);
            if (z != 0) {
                this.setZIndex(item, ~~z);
            }
            item.dispatchEvent("add", {
                target: item
            });
            return item;
        };
        this.removeChild = function (item) {
            if (item) {
                this.clearObjectTweens(item);
                item.dispatchEvent("remove", {
                    target: item
                });
                item.stage = null;
                this.objects = Utils.removeFromArray(this.objects, item);
            }
        };
        this.setZIndex = function (item, index) {
            item.zIndex = index;
            this.objects = this.objects.sort(function (obj1, obj2) {
                if (obj1.zIndex == obj2.zIndex) {
                    return obj1.uid > obj2.uid ? 1 : -1;
                } else {
                    return obj1.zIndex > obj2.zIndex ? 1 : -1;
                }
            });
        }
        this.hitTestPointObject = function (obj, x, y, pixelCheck, includeDragged, debug) {
            var cX, cY, cW, cH, mX, mY, r, present, imageData;
            cW = obj.width * Math.abs(obj.scaleX);
            cH = obj.height * Math.abs(obj.scaleY);
            cX = obj.x - cW / 2;
            cY = obj.y - cH / 2;
            mX = x;
            mY = y;
            if (!obj.ignoreViewport) {
                mX += this.viewport.x;
                mY += this.viewport.y;
            }
            present = false;
            if (obj.rotation == 0) {
                if (cX <= mX && cY <= mY && cX + cW >= mX && cY + cH >= mY) present = true;
            } else {
                r = obj.getDrawRectangle();
                if (r.hitTestPoint(new Vector(mX, mY))) present = true;
            }
            if (present && pixelCheck) {
                this.buffer.width = this.screenWidth * Utils.globalScale * Utils.globalPixelScale;
                this.buffer.height = this.screenHeight * Utils.globalScale * Utils.globalPixelScale;
                this.clearScreen(this.buffer);
                this.renderObject(this.buffer, obj);
                var pX = Math.floor(x * Utils.globalScale * Utils.globalPixelScale);
                var pY = Math.floor(y * Utils.globalScale * Utils.globalPixelScale);
                imageData = this.buffer.ctx.getImageData(pX, pY, 1, 1);
                if (imageData.data[3] == 0) present = false;
            }
            if (!present && includeDragged && obj.dragged) present = true;
            return present;
        }
        this.getObjectsStackByCoord = function (x, y, pixelCheck, includeDragged, debug) {
            var obj;
            var tmp = [];
            for (var i = 0; i < this.objects.length; i++) {
                if (this.objects[i].visible || this.objects[i].eventsWhenInvisible) {
                    obj = this.objects[i];
                    if (this.hitTestPointObject(obj, x, y, pixelCheck, includeDragged, debug)) {
                        tmp.push(obj);
                    }
                }
            }
            return tmp;
        };
        this.getMaxZIndexInStack = function (stack) {
            var max = -1;
            var ix = 0;
            for (var i = 0; i < stack.length; i++) {
                if (stack[i].zIndex > max) {
                    max = stack[i].zIndex;
                    ix = i;
                }
            }
            return ix;
        };
        this.sortStack = function (stack, revert) {
            var bSort = true;
            var ok;
            var i, tmp;
            while (bSort) {
                bSort = false;
                for (i = 0; i < stack.length - 1; i++) {
                    ok = false;
                    if (stack[i].zIndex < stack[i + 1].zIndex && !revert) ok = true;
                    if (stack[i].zIndex > stack[i + 1].zIndex && revert) ok = true;
                    if (ok) {
                        tmp = stack[i];
                        stack[i] = stack[i + 1];
                        stack[i + 1] = tmp;
                        bSort = true;
                    }
                }
            }
            return stack;
        }
        this.finalizeMouseCoords = function (obj, m) {
            if (!obj) return m;
            var eX = this.prepareMouseCoord(m.x);
            var eY = this.prepareMouseCoord(m.y);
            if (!obj.ignoreViewport) {
                eX += this.viewport.x;
                eY += this.viewport.y;
            }
            eX = eX - obj.x;
            eY = eY - obj.y;
            return {
                x: eX,
                y: eY
            };
        }
        this.prepareMouseCoord = function (val) {
            return val / Utils.globalScale / Utils.globalPixelScale;
        }
        this.checkClick = function (event) {
            var m = Utils.getMouseCoord(event, this.inputController);
            var stack = this.getObjectsStackByCoord(this.prepareMouseCoord(m.x), this.prepareMouseCoord(m.y), this.pixelClickEvent, false, true);
            var ret, f;
            if (stack.length > 0) {
                stack = this.sortStack(stack);
                for (var i = 0; i < stack.length; i++) {
                    f = this.finalizeMouseCoords(stack[i], m);
                    ret = stack[i].dispatchEvent("click", {
                        target: stack[i],
                        x: f.x,
                        y: f.y
                    });
                    if (ret === false) return;
                }
            }
        };
        this.checkContextMenu = function (event) {
            var m = Utils.getMouseCoord(event, this.inputController);
            var stack = this.getObjectsStackByCoord(this.prepareMouseCoord(m.x), this.prepareMouseCoord(m.y), this.pixelClickEvent);
            var ret, f;
            if (stack.length > 0) {
                stack = this.sortStack(stack);
                for (var i = 0; i < stack.length; i++) {
                    f = this.finalizeMouseCoords(stack[i], m);
                    ret = stack[i].dispatchEvent("contextmenu", {
                        target: stack[i],
                        x: f.x,
                        y: f.y
                    });
                    if (ret === false) return;
                }
            }
        };
        this.checkMouseMove = function (event) {
            var m = Utils.getMouseCoord(event, this.inputController);
            for (i = 0; i < this.objects.length; i++) {
                if (this.objects[i].dragged) {
                    var eX = m.x / Utils.globalScale / Utils.globalPixelScale;
                    var eY = m.y / Utils.globalScale / Utils.globalPixelScale;
                    if (!this.objects[i].ignoreViewport) {
                        eX += this.viewport.x;
                        eY += this.viewport.y;
                    }
                    this.objects[i].x = eX - this.objects[i].dragX;
                    this.objects[i].y = eY - this.objects[i].dragY;
                }
            }
            var stack = this.getObjectsStackByCoord(this.prepareMouseCoord(m.x), this.prepareMouseCoord(m.y), this.pixelMouseMoveEvent);
            var i, n, ret, bOk, f;
            var overStack = [];
            if (stack.length > 0) {
                stack = this.sortStack(stack);
                for (i = 0; i < stack.length; i++) {
                    overStack.push(stack[i]);
                    f = this.finalizeMouseCoords(stack[i], m);
                    if (!stack[i].mouseOn) ret = stack[i].dispatchEvent("mouseover", {
                        target: stack[i],
                        x: f.x,
                        y: f.y
                    });
                    stack[i].mouseOn = true;
                    if (ret === false) break;
                }
                for (i = 0; i < stack.length; i++) {
                    f = this.finalizeMouseCoords(stack[i], m);
                    ret = stack[i].dispatchEvent("mousemove", {
                        target: stack[i],
                        x: f.x,
                        y: f.y
                    });
                    if (ret === false) break;
                }
            }
            for (i = 0; i < this.objects.length; i++) {
                if (this.objects[i].mouseOn) {
                    bOk = false;
                    for (n = 0; n < overStack.length; n++) {
                        if (overStack[n] == this.objects[i]) bOk = true;
                    }
                    if (!bOk) {
                        this.objects[i].mouseOn = false;
                        f = this.finalizeMouseCoords(stack[i], m);
                        ret = this.objects[i].dispatchEvent("mouseout", {
                            target: this.objects[i],
                            x: f.x,
                            y: f.y
                        });
                        if (ret === false) break;
                    }
                }
            }
        };
        this.checkMouseDown = function (event) {
            var m = Utils.getMouseCoord(event, this.inputController);
            var stack = this.getObjectsStackByCoord(this.prepareMouseCoord(m.x), this.prepareMouseCoord(m.y), this.pixelMouseDownEvent);
            var ret, f;
            if (stack.length > 0) {
                stack = this.sortStack(stack);
                for (var i = 0; i < stack.length; i++) {
                    f = this.finalizeMouseCoords(stack[i], m);
                    ret = stack[i].dispatchEvent("mousedown", {
                        target: stack[i],
                        x: f.x,
                        y: f.y
                    });
                    if (ret === false) return;
                }
            }
        };
        this.checkMouseUp = function (event) {
            var m = Utils.getMouseCoord(event, this.inputController);
            var stack = this.getObjectsStackByCoord(this.prepareMouseCoord(m.x), this.prepareMouseCoord(m.y), this.pixelMouseUpEvent, true);
            var ret, f;
            if (stack.length > 0) {
                stack = this.sortStack(stack);
                for (var i = 0; i < stack.length; i++) {
                    f = this.finalizeMouseCoords(stack[i], m);
                    ret = stack[i].dispatchEvent("mouseup", {
                        target: stack[i],
                        x: f.x,
                        y: f.y
                    });
                    if (ret === false) return;
                }
            }
        };
        this.clear = function () {
            for (var i = 0; i < this.objects.length; i++) {
                this.objects[i].dispatchEvent("remove", {
                    target: this.objects[i]
                });
            }
            this.objects = [];
            this.tweens = [];
            this.timers = [];
            this.eventsListeners = [];
            this.objectsCounter = 0;
        };
        this.hitTest = function (obj1, obj2) {
            if (obj1.rotation == 0 && obj2.rotation == 0) {
                var cX1 = obj1.getX() - obj1.getWidth() / 2;
                var cY1 = obj1.getY() - obj1.getHeight() / 2;
                var cX2 = obj2.getX() - obj2.getWidth() / 2;
                var cY2 = obj2.getY() - obj2.getHeight() / 2;
                var top = Math.max(cY1, cY2);
                var left = Math.max(cX1, cX2);
                var right = Math.min(cX1 + obj1.getWidth(), cX2 + obj2.getWidth());
                var bottom = Math.min(cY1 + obj1.getHeight(), cY2 + obj2.getHeight());
                var width = right - left;
                var height = bottom - top;
                if (width > 0 && height > 0) return true;
                else return false;
            } else {
                var r1 = obj1.getDrawRectangle(),
                    r2 = obj2.getDrawRectangle();
                return r1.hitTestRectangle(r2);
            }
        };
        this.drawRectangle = function (x, y, width, height, color, fill, opacity, ignoreViewport) {
            var cns = this.canvas;
            if (typeof opacity != 'undefined') cns.ctx.globalAlpha = opacity;
            else cns.ctx.globalAlpha = 1;
            cns.ctx.fillStyle = color;
            cns.ctx.strokeStyle = color;
            if (!ignoreViewport) {
                x -= this.viewport.x;
                y -= this.viewport.y;
            }
            x = x * Utils.globalScale * Utils.globalPixelScale;
            y = y * Utils.globalScale * Utils.globalPixelScale;
            width = width * Utils.globalScale * Utils.globalPixelScale;
            height = height * Utils.globalScale * Utils.globalPixelScale;
            if (fill) cns.ctx.fillRect(x - width / 2, y - height / 2, width, height);
            else cns.ctx.strokeRect(x - width / 2, y - height / 2, width, height);
        };
        this.drawCircle = function (x, y, radius, width, color, opacity, ignoreViewport) {
            this.drawArc(x, y, radius, 0, Math.PI * 2, false, width, color, opacity, ignoreViewport);
        };
        this.drawArc = function (x, y, radius, startAngle, endAngle, anticlockwise, width, color, opacity, ignoreViewport) {
            var cns = this.canvas;
            var oldLW = cns.ctx.lineWidth;
            if (typeof color == "undefined") color = "#000"
            cns.ctx.strokeStyle = color;
            if (typeof width == "undefined") width = 1;
            cns.ctx.lineWidth = width * Utils.globalScale * Utils.globalPixelScale;
            if (typeof opacity == "undefined") opacity = 1;
            cns.ctx.globalAlpha = opacity;
            if (!ignoreViewport) {
                x -= this.viewport.x;
                y -= this.viewport.y;
            }
            x = x * Utils.globalScale * Utils.globalPixelScale;
            y = y * Utils.globalScale * Utils.globalPixelScale;
            radius = radius * Utils.globalScale * Utils.globalPixelScale;
            cns.ctx.beginPath();
            cns.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            cns.ctx.stroke();
            cns.ctx.lineWidth = oldLW;
        };
        this.drawPolygon = function (points, width, color, opacity, ignoreViewport) {
            if ((typeof points != "object") || !(points instanceof Array) || points.length < 2) return;
            for (var i = 0; i < points.length - 1; i++) {
                this.drawLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, width, color, opacity, ignoreViewport);
            }
            this.drawLine(points[i].x, points[i].y, points[0].x, points[0].y, width, color, opacity, ignoreViewport);
        }
        this.drawLine = function (x1, y1, x2, y2, width, color, opacity, ignoreViewport) {
            var cns = this.canvas;
            var oldLW = cns.ctx.lineWidth;
            if (color) cns.ctx.strokeStyle = color;
            else cns.ctx.strokeStyle = '#000'; if (width) cns.ctx.lineWidth = width * Utils.globalScale * Utils.globalPixelScale;
            else cns.ctx.lineWidth = 1 * Utils.globalScale * Utils.globalPixelScale; if (opacity) cns.ctx.globalAlpha = opacity;
            else cns.ctx.globalAlpha = 1; if (!ignoreViewport) {
                x1 -= this.viewport.x;
                y1 -= this.viewport.y;
                x2 -= this.viewport.x;
                y2 -= this.viewport.y;
            }
            x1 = x1 * Utils.globalScale * Utils.globalPixelScale;
            y1 = y1 * Utils.globalScale * Utils.globalPixelScale;
            x2 = x2 * Utils.globalScale * Utils.globalPixelScale;
            y2 = y2 * Utils.globalScale * Utils.globalPixelScale;
            cns.ctx.beginPath();
            cns.ctx.moveTo(x1, y1);
            cns.ctx.lineTo(x2, y2);
            cns.ctx.stroke();
            cns.ctx.lineWidth = oldLW;
        };
        this.start = function () {
            if (this.started) return;
            this.started = true;
            clearFPS();
            render();
        }
        this.forceRender = function () {
            if (this.started) render();
        }
        this.stop = function () {
            this.started = false;
        }

        function clearFPS() {
            self.lastFPS = self.fps;
            self.fps = 0;
            if (self.started) self.tmFPS = setTimeout(clearFPS, 1000);
        }
        this.setTextStyle = function (font, size, style, color, borderColor, canvas) {
            var cns = (canvas ? canvas : this.canvas);
            cns.ctx.fillStyle = color;
            cns.ctx.strokeStyle = borderColor;
            var s = "";
            if (style) s += style + " ";
            if (size) s += Math.floor(size * Utils.globalScale * Utils.globalPixelScale) + "px ";
            if (font) s += font;
            cns.ctx.font = s;
        }
        this.drawText = function (text, x, y, opacity, ignoreViewport, alignCenter, canvas) {
            var cns = (canvas ? canvas : this.canvas);
            if (typeof opacity == "undefined") cns.ctx.globalAlpha = 1;
            else cns.ctx.globalAlpha = opacity; if (!ignoreViewport) {
                x -= this.viewport.x;
                y -= this.viewport.y;
            }
            x = x * Utils.globalScale * Utils.globalPixelScale;
            y = y * Utils.globalScale * Utils.globalPixelScale;
            if (alignCenter) x = x - this.getTextWidth(text) / 2;
            cns.ctx.fillText(text, x, y);
        }
        this.strokeText = function (text, x, y, opacity, ignoreViewport, alignCenter, canvas) {
            var cns = (canvas ? canvas : this.canvas);
            if (typeof opacity == "undefined") cns.ctx.globalAlpha = 1;
            else cns.ctx.globalAlpha = opacity; if (!ignoreViewport) {
                x -= this.viewport.x;
                y -= this.viewport.y;
            }
            x = x * Utils.globalScale * Utils.globalPixelScale;
            y = y * Utils.globalScale * Utils.globalPixelScale;
            if (alignCenter) x = x - this.getTextWidth(text) / 2;
            cns.ctx.strokeText(text, x, y);
        }
        this.getTextWidth = function (str, canvas) {
            var cns = (canvas ? canvas : this.canvas);
            return cns.ctx.measureText(str).width;
        }
        this.allowDebugDrawing = false;
        this.allowStaticDebugDrawing = false;
        this.renderObject = function (cns, obj) {
            if (obj.dispatchEvent("prerender", {
                target: obj,
                canvas: cns
            }) === false) return;
            var
            center = obj.getAbsoluteCenter();
            ow = obj.width * Utils.globalScale, oh = obj.height * Utils.globalScale, ox = center.x * Utils.globalPixelScale * Utils.globalScale - Math.floor(ow / 2), oy = center.y * Utils.globalPixelScale * Utils.globalScale - Math.floor(oh / 2), or = obj.rotation, scX = obj.scaleX * Utils.globalPixelScale, scY = obj.scaleY * Utils.globalPixelScale, canvasMod = Boolean(or != 0 || scX != 1 || scY != 1);
            if (!obj.ignoreViewport) {
                ox -= this.viewport.x * Utils.globalPixelScale * Utils.globalScale;
                oy -= this.viewport.y * Utils.globalPixelScale * Utils.globalScale;
            }
            if (canvasMod) {
                cns.ctx.save();
                cns.ctx.translate(ox + Math.floor(ow / 2), oy + Math.floor(oh / 2));
                cns.ctx.rotate(or);
                cns.ctx.scale(scX, scY);
                ox = -Math.floor(ow / 2);
                oy = -Math.floor(oh / 2);
            }
            cns.ctx.globalAlpha = obj.opacity;
            if (this.ceilSizes) {
                ow = Math.ceil(ow);
                oh = Math.ceil(oh);
            }
            if (obj.fillColor) {
                cns.ctx.fillStyle = obj.fillColor;
                cns.ctx.strokeStyle = obj.fillColor;
                cns.ctx.fillRect(ox, oy, ow, oh);
            }
            if (obj.bitmap) {
                var iw = obj.bitmap.width,
                    ih = obj.bitmap.height;
                var fx = obj.currentLayer * ow + obj.offset.left * Utils.globalScale,
                    fy = obj.currentFrame * oh + obj.offset.top * Utils.globalScale;
                if (fx < iw && fy < ih) {
                    var fw = ow,
                        fh = oh,
                        masked = false;
                    if (fx + fw > iw) fw = iw - fx;
                    if (fy + fh > ih) fh = ih - fy;
                    if (obj.mask) {
                        this.buffer.ctx.save();
                        this.buffer.ctx.clearRect(0, 0, fw, fh);
                        this.buffer.ctx.drawImage(obj.bitmap, fx, fy, fw, fh, 0, 0, fw, fh);
                        this.buffer.ctx.globalCompositeOperation = "destination-in";
                        this.buffer.ctx.drawImage(obj.mask, 0, 0);
                        fx = 0;
                        fy = 0;
                        masked = true;
                    }
                    try {
                        cns.ctx.drawImage((masked ? this.buffer : obj.bitmap), ~~fx, ~~fy, ~~fw, ~~fh, ~~ox, ~~oy, ~~ow, ~~oh);
                    } catch (e) {}
                    if (masked) this.buffer.ctx.restore();
                }
            }
            if (canvasMod) cns.ctx.restore();
            if (this.allowDebugDrawing && obj.allowDebugDrawing) {
                if (this.allowStaticDebugDrawing || !obj.static) {
                    obj.debugDraw();
                }
            }
            obj.dispatchEvent("render", {
                target: obj,
                canvas: cns
            });
        }
        this.drawBackAlways = Utils.mobileCheckBrokenGalaxyPhones();
        this.drawBackBuffer = function (cns, drawStatic) {
            if (!drawStatic && this.backBuffer && this.drawBackAlways) cns.ctx.drawImage(this.backBuffer, 0, 0, cns.width, cns.height);
        }
        this.drawScene = function (cns, drawStatic) {
            var obj, ok;
            if (cns && !cns.ctx) cns.ctx = cns.getContext("2d");
            if (!this.fillColor) {
                if (!this.clearLock) {
                    this.clearScreen(cns);
                    this.drawBackBuffer(cns, drawStatic);
                }
            } else {
                cns.ctx.fillStyle = this.fillColor;
                cns.ctx.fillRect(0, 0, this.screenWidth * Utils.globalScale * Utils.globalPixelScale, this.screenHeight * Utils.globalScale * Utils.globalPixelScale);
                this.drawBackBuffer(cns, drawStatic);
            }
            for (var i = 0; i < this.objects.length; i++) {
                obj = this.objects[i];
                ok = false;
                if (!drawStatic && !obj['static']) ok = true;
                if (drawStatic && obj['static']) ok = true;
                if (ok) {
                    if (obj.destroy) {
                        this.removeChild(obj);
                        i--;
                    } else {
                        obj.nextFrame();
                        if (obj.visible) this.renderObject(cns, obj);
                    }
                }
            }
            if (drawStatic) {
                this.backBuffer = cns;
            }
        };
        this.tweens = [];
        this.createTween = function (obj, prop, start, end, duration, ease) {
            var t = new Tween(obj, prop, start, end, duration, ease);
            self.tweens.push(t);
            return t;
        }
        this.removeTween = function (t) {
            var id = null;
            if (isNaN(t)) {
                for (var i = 0; i < self.tweens.length; i++) {
                    if (self.tweens[i] === t) {
                        id = i;
                        break;
                    }
                }
            } else id = t;
            self.tweens[id].pause();
            self.tweens.splice(id, 1);
            return id;
        }
        this.clearObjectTweens = function (obj) {
            for (var i = 0; i < self.tweens.length; i++) {
                if (self.tweens[i].obj === obj) {
                    i = self.removeTween(i);
                    i--;
                }
            }
        }
        this.updateTweens = function () {
            for (var i = 0; i < self.tweens.length; i++) {
                if (self.tweens[i].tick()) {
                    i = self.removeTween(i);
                }
            }
        }
        this.timers = [];
        this.setTimeout = function (callback, timeout) {
            var t = new StageTimer(callback, timeout);
            this.timers.push(t);
            return t;
        };
        this.clearTimeout = function (t) {
            this.timers = Utils.removeFromArray(this.timers, t);
        };
        this.setInterval = function (callback, timeout) {
            var t = new StageTimer(callback, timeout, true);
            this.timers.push(t);
            return t;
        };
        this.clearInterval = function (t) {
            this.clearTimeout(t);
        };
        this.updateTimers = function () {
            for (var i = 0; i < this.timers.length; i++) {
                if (this.timers[i].update()) {
                    this.clearTimeout(this.timers[i]);
                    i--;
                }
            }
        };

        function render() {
            clearTimeout(self.tmMain);
            var tm_start = new Date().getTime();
            self.updateTweens();
            self.updateTimers();
            self.dispatchEvent("pretick");
            self.drawScene(self.canvas, false);
            if (self.showFPS) {
                self.setTextStyle("sans-serif", 10, "bold", "#fff", "#000");
                self.drawText("FPS: " + self.lastFPS, 2, 10, 1, true);
            }
            self.dispatchEvent("posttick");
            var d = new Date().getTime() - tm_start;
            d = self.delay - d - 1;
            if (d < 1) d = 1;
            self.fps++;
            if (self.started) self.tmMain = setTimeout(render, d);
        };
        this.box2dSync = function (world) {
            var p;
            for (b = world.m_bodyList; b; b = b.m_next) {
                if (b.sprite) {
                    b.sprite.rotation = b.GetRotation();
                    p = b.GetPosition();
                    b.sprite.x = p.x;
                    b.sprite.y = p.y;
                    b.sprite.dispatchEvent("box2dsync", {
                        target: b.sprite
                    });
                }
            }
        }
        this.processTouchEvent = function (touches, controller) {
            for (var i = 0; i < touches.length; i++) {
                var e = {
                    clientX: touches[i].clientX,
                    clientY: touches[i].clientY
                };
                self[controller](e);
            }
        }
        this.inputController = null;
        this.addInputListeners = function (obj) {
            var ffOS = (navigator.userAgent.toLowerCase().indexOf("firefox") != -1 && navigator.userAgent.toLowerCase().indexOf("mobile") != -1);
            ffOS = false;
            this.inputController = obj;
            if (("ontouchstart" in obj) && !ffOS) {
                obj.ontouchstart = function (event) {
                    self.processTouchEvent(event.touches, "checkMouseDown");
                    self.processTouchEvent(event.touches, "checkClick");
                };
                obj.ontouchmove = function (event) {
                    self.processTouchEvent(event.touches, "checkMouseMove");
                };
                obj.ontouchend = function (event) {
                    self.processTouchEvent(event.changedTouches, "checkMouseUp");
                };
            } else {
                obj.onclick = function (event) {
                    self.checkClick(event);
                };
                obj.onmousemove = function (event) {
                    self.checkMouseMove(event);
                };
                obj.onmousedown = function (event) {
                    if (event.button == 0) self.checkMouseDown(event);
                };
                obj.onmouseup = function (event) {
                    if (event.button == 0) self.checkMouseUp(event);
                };
                obj.oncontextmenu = function (event) {
                    self.checkContextMenu(event);
                };
            }
        }
        if (this.canvas) this.addInputListeners(this.canvas);
        this.onpretick = null;
        this.onposttick = null;
        this.eventsListeners = [];
        this.addEventListener = function (type, callback) {
            EventsManager.addEvent(this, type, callback);
        }
        this.removeEventListener = function (type, callback) {
            EventsManager.removeEvent(this, type, callback);
        }
        this.dispatchEvent = function (type, params) {
            return EventsManager.dispatchEvent(this, type, params);
        }
    }

    function Vector(x, y) {
        if (typeof (x) == 'undefined') x = 0;
        this.x = x;
        if (typeof (y) == 'undefined') y = 0;
        this.y = y;
        this.isZero = function () {
            return this.x == 0 && this.y == 0;
        }
        this.clone = function () {
            return new Vector(this.x, this.y);
        }
        this.add = function (p) {
            this.x += p.x;
            this.y += p.y;
            return this;
        }
        this.subtract = function (p) {
            this.x -= p.x;
            this.y -= p.y;
            return this;
        }
        this.mult = function (n) {
            this.x *= n;
            this.y *= n;
            return this;
        }
        this.invert = function () {
            this.mult(-1);
            return this;
        }
        this.rotate = function (angle, offset) {
            if (typeof (offset) == 'undefined') offset = new Vector(0, 0);
            var r = this.clone();
            r.subtract(offset);
            r.x = this.x * Math.cos(angle) + this.y * Math.sin(angle);
            r.y = this.x * -Math.sin(angle) + this.y * Math.cos(angle);
            r.add(offset);
            this.x = r.x;
            this.y = r.y;
            return this;
        }
        this.normalize = function (angle, offset) {
            if (typeof (offset) == 'undefined') offset = new Vector(0, 0);
            this.subtract(offset);
            this.rotate(-angle);
            return this;
        }
        this.getLength = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        this.distanceTo = function (p) {
            p2 = this.clone();
            p2.subtract(p);
            return p2.getLength();
        }
    }
var Rectangle = function (x, y, w, h, angle) {
    this.center = new Vector(x, y);
    this.width = w;
    this.height = h;
    this.angle = angle;
    this.vertices = [];
    this.AABB = [];
    this.clone = function () {
        return new Rectangle(this.center.x, this.center.y, this.width, this.height, this.angle);
    }
    this.refreshVertices = function () {
        var w = this.width / 2;
        var h = this.height / 2;
        this.vertices = [];
        this.vertices.push(new Vector(-w, h));
        this.vertices.push(new Vector(w, h));
        this.vertices.push(new Vector(w, -h));
        this.vertices.push(new Vector(-w, -h));
        this.AABB = [this.center.clone(), this.center.clone()];
        for (var i = 0; i < 4; i++) {
            this.vertices[i].rotate(-this.angle, this.center);
            if (this.vertices[i].x < this.AABB[0].x) this.AABB[0].x = this.vertices[i].x;
            if (this.vertices[i].x > this.AABB[1].x) this.AABB[1].x = this.vertices[i].x;
            if (this.vertices[i].y < this.AABB[0].y) this.AABB[0].y = this.vertices[i].y;
            if (this.vertices[i].y > this.AABB[1].y) this.AABB[1].y = this.vertices[i].y;
        }
    }
    this.move = function (x, y) {
        this.center.add(new Vector(x, y));
        this.refreshVertices();
    }
    this.rotate = function (angle) {
        this.angle += angle;
        this.refreshVertices();
    }
    this.hitTestPoint = function (point) {
        var p = point.clone();
        p.normalize(-this.angle, this.center);
        return ((Math.abs(p.x) <= (this.width / 2)) && (Math.abs(p.y) <= (this.height / 2)));
    }
    this.hitTestRectangle = function (rect) {
        var r1 = this.clone();
        var r2 = rect.clone();
        var len, len1, len2;
        r1.move(-this.center.x, -this.center.y);
        r2.move(-this.center.x, -this.center.y);
        r2.center.rotate(this.angle);
        r1.rotate(-this.angle);
        r2.rotate(-this.angle);
        len = Math.max(r1.AABB[0].x, r1.AABB[1].x, r2.AABB[0].x, r2.AABB[1].x) - Math.min(r1.AABB[0].x, r1.AABB[1].x, r2.AABB[0].x, r2.AABB[1].x);
        len1 = r1.AABB[1].x - r1.AABB[0].x;
        len2 = r2.AABB[1].x - r2.AABB[0].x;
        if (len > len1 + len2) return false;
        len = Math.max(r1.AABB[0].y, r1.AABB[1].y, r2.AABB[0].y, r2.AABB[1].y) - Math.min(r1.AABB[0].y, r1.AABB[1].y, r2.AABB[0].y, r2.AABB[1].y);
        len1 = r1.AABB[1].y - r1.AABB[0].y;
        len2 = r2.AABB[1].y - r2.AABB[0].y;
        if (len > len1 + len2) return false;
        r1.move(-r2.center.x, -r2.center.y);
        r2.move(-r2.center.x, -r2.center.y);
        r1.center.rotate(r2.angle);
        r1.refreshVertices();
        r1.rotate(-r2.angle);
        r2.rotate(-r2.angle);
        len = Math.max(r1.AABB[0].x, r1.AABB[1].x, r2.AABB[0].x, r2.AABB[1].x) - Math.min(r1.AABB[0].x, r1.AABB[1].x, r2.AABB[0].x, r2.AABB[1].x);
        len1 = r1.AABB[1].x - r1.AABB[0].x;
        len2 = r2.AABB[1].x - r2.AABB[0].x;
        if (len > len1 + len2) return false;
        len = Math.max(r1.AABB[0].y, r1.AABB[1].y, r2.AABB[0].y, r2.AABB[1].y) - Math.min(r1.AABB[0].y, r1.AABB[1].y, r2.AABB[0].y, r2.AABB[1].y);
        len1 = r1.AABB[1].y - r1.AABB[0].y;
        len2 = r2.AABB[1].y - r2.AABB[0].y;
        if (len > len1 + len2) return false;
        return true;
    }
    this.refreshVertices();
}
var Asset = function (name, src, w, h, f, l) {
    this.name = name + '';
    this.src = src + '';
    this.width = w;
    this.height = h;
    this.frames = f;
    this.layers = l;
    this.bitmap = null;
    this.object = null;
    this.ready = (this.width && this.height);
    this.detectSize = function () {
        if (!this.bitmap) return false;
        try {
            if (isNaN(this.width)) {
                this.width = this.bitmap.width ? parseInt(this.bitmap.width) : 0;
            }
            if (isNaN(this.height)) {
                this.height = this.bitmap.height ? parseInt(this.bitmap.height) : 0;
            }
        } catch (e) {
            if (CRENDER_DEBUG) console.log(e);
        }
        return (!isNaN(this.width) && !isNaN(this.height));
    }
    this.normalize = function (scale) {
        if (this.ready) return;
        if (!this.detectSize()) return;
        if (isNaN(this.frames) || this.frames < 1) this.frames = 1;
        if (isNaN(this.layers) || this.layers < 1) this.layers = 1;
        this.width = Math.ceil((this.width / this.layers) / scale);
        this.height = Math.ceil((this.height / this.frames) / scale);
        this.ready = true;
    }
}
var AssetsLibrary = function (path, scale, assets) {
    var self = this;
    this.path = 'images';
    this.scale = 1;
    this.items = {};
    this.bitmaps = {};
    this.loaded = false;
    this.onload = null;
    this.onloadprogress = null;
    this.spriteClass = Sprite;
    this.init = function (path, scale) {
        if (typeof path != 'undefined') {
            this.path = path + '';
        }
        if (typeof scale != 'undefined') {
            this.scale = parseFloat(scale);
            if (isNaN(this.scale)) this.scale = 1;
        }
    }
    this.addAssets = function (data) {
        if (typeof data == 'undefined') return;
        if (typeof data != 'object') return;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            item.noscale = (typeof item.noscale == 'undefined') ? false : item.noscale;
            if (!item.noscale) item.src = '%SCALE%/' + item.src;
            this.addAsset(item.src, item.name, item.width, item.height, item.frames, item.layers);
        }
    }
    this.addAsset = function (src, name, w, h, f, l) {
        function src2name(src) {
            var name = src.split('/');
            name = name.pop();
            name = name.split('.');
            name = name.shift() + '';
            return name;
        }
        src = src.replace('%SCALE%', '%PATH%/' + this.scale);
        src = src.replace('%PATH%', this.path);
        if (typeof name == 'undefined') name = src2name(src);
        var asset = new Asset(name, src, w, h, f, l);
        this.items[name] = asset;
        return asset;
    }
    this.addObject = function (obj) {
        var asset = this.addAsset('%SCALE%/' + obj.image, obj.name, obj.width * this.scale, obj.height * this.scale, obj.frames, obj.layers);
        if (asset) asset.object = obj;
        return asset;
    }
    this.load = function (onload, onloadprogress) {
        this.onload = onload;
        this.onloadprogress = onloadprogress;
        var preloader = new ImagesPreloader();
        var data = [];
        for (var n in this.items)
            data.push(this.items[n]);
        preloader.load(data, self.onLoadHandler, self.onLoadProgressHandler);
    }
    this.onLoadProgressHandler = function (val) {
        if (typeof self.onloadprogress == 'function') {
            self.onloadprogress(val);
        }
    }
    this.onLoadHandler = function (data) {
        self.loaded = true;
        for (var n in data) {
            var bmp = data[n];
            var asset = self.items[n];
            asset.bitmap = bmp;
            asset.normalize(self.scale);
        }
        if (typeof self.onload == 'function') {
            self.onload(self.items);
        }
    }
    this.getAsset = function (name, checkLoad) {
        var asset = null;
        if ((typeof this.items[name] != 'undefined') && (this.items[name].bitmap)) {
            checkLoad = (typeof checkLoad == 'undefined') ? true : checkLoad;
            asset = (!checkLoad || this.items[name].ready) ? this.items[name] : null;
        }
        if (!asset) {
            throw new Error('Trying to get undefined asset "' + name + '"');
        }
        return asset;
    }
    this.getSprite = function (name, params) {
        var mc = null;
        try {
            var asset = this.getAsset(name, true);
            mc = new this.spriteClass(asset.bitmap, asset.width, asset.height, asset.frames, asset.layers);
        } catch (e) {
            mc = new this.spriteClass(null, 1, 1, 1, 1);
        }
        if (typeof params == 'object') {
            for (var prop in params) mc[prop] = params[prop];
        }
        return mc;
    }
    this.getBitmap = function (name) {
        try {
            var asset = this.getAsset(name, true);
            return asset.bitmap;
        } catch (e) {
            return null;
        }
    }
    this.init(path, scale);
    this.addAssets(assets);
}
if (typeof console == 'undefined') {
    console = {
        log: function () {}
    }
};

function box2DCreateWorld(gravity) {
    var g, s;
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000, -1000);
    worldAABB.maxVertex.Set(1000, 1000);
    if (typeof gravity != "undefined") g = new b2Vec2(0, gravity);
    else g = new b2Vec2(0, 300);
    return new b2World(worldAABB, g, true);
}

function box2DCreateGround(world, restitution, y) {
    var groundSd = new b2BoxDef();
    groundSd.extents.Set(10000, 50);
    groundSd.restitution = restitution ? restitution : 0.2;
    var groundBd = new b2BodyDef();
    groundBd.AddShape(groundSd);
    groundBd.position.Set(-500, y ? y : 480);
    var body = world.CreateBody(groundBd);
    body.bodyDef = groundBd;
    return body;
}

function box2DCreateCircle(world, x, y, radius, rotation, fixed, density, restitution, friction) {
    if (typeof (fixed) == 'undefined') fixed = true;
    var ballSd = new b2CircleDef();
    if (!fixed) {
        ballSd.density = density ? density : 0.8;
        ballSd.restitution = restitution ? restitution : 0.1;
        ballSd.friction = friction ? friction : 3;
    }
    ballSd.radius = radius;
    var ballBd = new b2BodyDef();
    ballBd.rotation = rotation;
    ballBd.AddShape(ballSd);
    ballBd.position.Set(x, y);
    var body = world.CreateBody(ballBd);
    body.bodyDef = ballBd;
    return body;
}

function box2DCreateBox(world, x, y, width, height, rotation, fixed, density, restitution, friction) {
    if (typeof (fixed) == 'undefined') fixed = true;
    var boxSd = new b2BoxDef();
    if (!fixed) {
        boxSd.density = density ? density : 1.0;
        boxSd.restitution = restitution ? restitution : 0.2;
        boxSd.friction = friction ? friction : 0.3;
    }
    boxSd.extents.Set(width, height);
    var boxBd = new b2BodyDef();
    boxBd.rotation = rotation;
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x, y);
    var body = world.CreateBody(boxBd);
    body.bodyDef = boxBd;
    return body;
}

function box2DCreatePoly(world, x, y, points, rotation, fixed, density, restitution, friction) {
    var polyBd = new b2BodyDef();
    polyBd.rotation = rotation;
    for (var n = 0; n < points.length; n++) {
        var p = points[n];
        var polySd = new b2PolyDef();
        if (!fixed) {
            polySd.density = density ? density : 1.0;
            polySd.restitution = restitution ? restitution : 0.2;
            polySd.friction = friction ? friction : 0.3;
        }
        polySd.vertexCount = p.length;
        for (var i = 0; i < p.length; i++) {
            polySd.vertices[i].Set(p[i][0], p[i][1]);
        }
        polyBd.AddShape(polySd);
    }
    polyBd.position.Set(x, y);
    var body = world.CreateBody(polyBd);
    body.bodyDef = polyBd;
    return body;
};

function box2DCreateRevoluteJoint(world, body1, body2, point, motor) {
    var jointDef = new b2RevoluteJointDef();
    jointDef.body1 = body1;
    jointDef.body2 = body2;
    jointDef.anchorPoint = point;
    jointDef.collideConnected = true;
    if (motor) {
        jointDef.motorSpeed = motor;
        jointDef.motorTorque = 500000000;
        jointDef.enableMotor = true;
    }
    return world.CreateJoint(jointDef);
};

function box2DCreateDistanceJoint(world, body1, body2, point1, point2) {
    var jointDef = new b2DistanceJointDef();
    jointDef.body1 = body1;
    jointDef.body2 = body2;
    jointDef.anchorPoint1 = point1;
    jointDef.anchorPoint2 = point2;
    jointDef.collideConnected = true;
    return world.CreateJoint(jointDef);
};

function box2DCreatePrismaticJoint(world, body1, body2, point, motor) {
    var jointDef = new b2PrismaticJointDef();
    jointDef.anchorPoint.Set(point.x, point.y);
    jointDef.body1 = body1;
    jointDef.body2 = body2;
    jointDef.axis.Set(0.0, 1.0);
    if (motor) {
        jointDef.motorSpeed = motor;
        jointDef.motorForce = 100000.0;
        jointDef.enableMotor = true;
    }
    return world.CreateJoint(jointDef);
};
var Prototype = {
    Version: '1.6.0.2',
    Browser: {
        IE: !! (window.attachEvent && !window.opera),
        Opera: !! window.opera,
        WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
        MobileSafari: !! navigator.userAgent.match(/Apple.*Mobile.*Safari/)
    },
    BrowserFeatures: {
        XPath: !! document.evaluate,
        ElementExtensions: !! window.HTMLElement,
        SpecificElementExtensions: document.createElement('div').__proto__ && document.createElement('div').__proto__ !== document.createElement('form').__proto__
    },
    ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function () {},
    K: function (x) {
        return x
    }
};
if (Prototype.Browser.MobileSafari) Prototype.BrowserFeatures.SpecificElementExtensions = false;
var Class = {
    create: function () {
        var parent = null,
            properties = $A(arguments);
        if (Object.isFunction(properties[0])) parent = properties.shift();

        function klass() {
            this.initialize.apply(this, arguments);
        }
        Object.extend(klass, Class.Methods);
        klass.superclass = parent;
        klass.subclasses = [];
        if (parent) {
            var subclass = function () {};
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }
        for (var i = 0; i < properties.length; i++) klass.addMethods(properties[i]);
        if (!klass.prototype.initialize) klass.prototype.initialize = Prototype.emptyFunction;
        klass.prototype.constructor = klass;
        return klass;
    }
};
Class.Methods = {
    addMethods: function (source) {
        var ancestor = this.superclass && this.superclass.prototype;
        var properties = Object.keys(source);
        if (!Object.keys({
            toString: true
        }).length) properties.push("toString", "valueOf");
        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i],
                value = source[property];
            if (ancestor && Object.isFunction(value) && value.argumentNames().first() == "$super") {
                var method = value;
                value = Object.extend((function (m) {
                    return function () {
                        return ancestor[m].apply(this, arguments)
                    };
                })(property).wrap(method), {
                    valueOf: function () {
                        return method
                    },
                    toString: function () {
                        return method.toString()
                    }
                });
            }
            this.prototype[property] = value;
        }
        return this;
    }
};
var Abstract = {};
Object.extend = function (destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
};
Object.extend(Object, {
    inspect: function (object) {
        try {
            if (Object.isUndefined(object)) return 'undefined';
            if (object === null) return 'null';
            return object.inspect ? object.inspect() : String(object);
        } catch (e) {
            if (e instanceof RangeError) return '...';
            throw e;
        }
    },
    /*toJSON: function (object) {
        var type = typeof object;
        switch (type) {
        case 'undefined':
        case 'function':
        case 'unknown':
            return;
        case 'boolean':
            return object.toString();
        }
        if (object === null) return 'null';
        if (object.toJSON) return object.toJSON();
        if (Object.isElement(object)) return;
        var results = [];
        for (var property in object) {
            var value = Object.toJSON(object[property]);
            if (!Object.isUndefined(value))
                results.push(property.toJSON() + ': ' + value);
        }
        return '{' + results.join(', ') + '}';
    },*/
    toQueryString: function (object) {
        return $H(object).toQueryString();
    },
    toHTML: function (object) {
        return object && object.toHTML ? object.toHTML() : String.interpret(object);
    },
    keys: function (object) {
        var keys = [];
        for (var property in object)
            keys.push(property);
        return keys;
    },
    values: function (object) {
        var values = [];
        for (var property in object)
            values.push(object[property]);
        return values;
    },
    clone: function (object) {
        return Object.extend({}, object);
    },
    isElement: function (object) {
        return object && object.nodeType == 1;
    },
    isArray: function (object) {
        return object != null && typeof object == "object" && 'splice' in object && 'join' in object;
    },
    isHash: function (object) {
        return object instanceof Hash;
    },
    isFunction: function (object) {
        return typeof object == "function";
    },
    isString: function (object) {
        return typeof object == "string";
    },
    isNumber: function (object) {
        return typeof object == "number";
    },
    isUndefined: function (object) {
        return typeof object == "undefined";
    }
});
Object.extend(Function.prototype, {
    argumentNames: function () {
        var names = this.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",").invoke("strip");
        return names.length == 1 && !names[0] ? [] : names;
    },
    bind: function () {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
        var __method = this,
            args = $A(arguments),
            object = args.shift();
        return function () {
            return __method.apply(object, args.concat($A(arguments)));
        }
    },
    bindAsEventListener: function () {
        var __method = this,
            args = $A(arguments),
            object = args.shift();
        return function (event) {
            return __method.apply(object, [event || window.event].concat(args));
        }
    },
    curry: function () {
        if (!arguments.length) return this;
        var __method = this,
            args = $A(arguments);
        return function () {
            return __method.apply(this, args.concat($A(arguments)));
        }
    },
    delay: function () {
        var __method = this,
            args = $A(arguments),
            timeout = args.shift() * 1000;
        return window.setTimeout(function () {
            return __method.apply(__method, args);
        }, timeout);
    },
    wrap: function (wrapper) {
        var __method = this;
        return function () {
            return wrapper.apply(this, [__method.bind(this)].concat($A(arguments)));
        }
    },
    methodize: function () {
        if (this._methodized) return this._methodized;
        var __method = this;
        return this._methodized = function () {
            return __method.apply(null, [this].concat($A(arguments)));
        };
    }
});
Function.prototype.defer = Function.prototype.delay.curry(0.01);
Object.extend(String, {
    interpret: function (value) {
        return value == null ? '' : String(value);
    },
    specialChar: {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '\\': '\\\\'
    }
});
Object.extend(String.prototype, {
    gsub: function (pattern, replacement) {
        var result = '',
            source = this,
            match;
        replacement = arguments.callee.prepareReplacement(replacement);
        while (source.length > 0) {
            if (match = source.match(pattern)) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length);
            } else result += source, source = '';
        }
        return result;
    },
    sub: function (pattern, replacement, count) {
        replacement = this.gsub.prepareReplacement(replacement);
        count = Object.isUndefined(count) ? 1 : count;
        return this.gsub(pattern, function (match) {
            if (--count < 0) return match[0];
            return replacement(match);
        });
    },
    scan: function (pattern, iterator) {
        this.gsub(pattern, iterator);
        return String(this);
    },
    truncate: function (length, truncation) {
        length = length || 30;
        truncation = Object.isUndefined(truncation) ? '...' : truncation;
        return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this);
    },
    strip: function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    },
    stripTags: function () {
        return this.replace(/<\/?[^>]+>/gi, '');
    },
    stripScripts: function () {
        return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
    },
    extractScripts: function () {
        var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
        var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
        return (this.match(matchAll) || []).map(function (scriptTag) {
            return (scriptTag.match(matchOne) || ['', ''])[1];
        });
    },
    evalScripts: function () {
        return this.extractScripts().map(function (script) {
            return eval(script)
        });
    },
    escapeHTML: function () {
        var self = arguments.callee;
        self.text.data = this;
        return self.div.innerHTML;
    },
    unescapeHTML: function () {
        var div = new Element('div');
        div.innerHTML = this.stripTags();
        return div.childNodes[0] ? (div.childNodes.length > 1 ? $A(div.childNodes).inject('', function (memo, node) {
            return memo + node.nodeValue
        }) : div.childNodes[0].nodeValue) : '';
    },
    toQueryParams: function (separator) {
        var match = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) return {};
        return match[1].split(separator || '&').inject({}, function (hash, pair) {
            if ((pair = pair.split('='))[0]) {
                var key = decodeURIComponent(pair.shift());
                var value = pair.length > 1 ? pair.join('=') : pair[0];
                if (value != undefined) value = decodeURIComponent(value);
                if (key in hash) {
                    if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
                    hash[key].push(value);
                } else hash[key] = value;
            }
            return hash;
        });
    },
    toArray: function () {
        return this.split('');
    },
    succ: function () {
        return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
    },
    times: function (count) {
        return count < 1 ? '' : new Array(count + 1).join(this);
    },
    camelize: function () {
        var parts = this.split('-'),
            len = parts.length;
        if (len == 1) return parts[0];
        var camelized = this.charAt(0) == '-' ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];
        for (var i = 1; i < len; i++) camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
        return camelized;
    },
    capitalize: function () {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    },
    underscore: function () {
        return this.gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/, '#{1}_#{2}').gsub(/([a-z\d])([A-Z])/, '#{1}_#{2}').gsub(/-/, '_').toLowerCase();
    },
    dasherize: function () {
        return this.gsub(/_/, '-');
    },
    inspect: function (useDoubleQuotes) {
        var escapedString = this.gsub(/[\x00-\x1f\\]/, function (match) {
            var character = String.specialChar[match[0]];
            return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
        });
        if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
        return "'" + escapedString.replace(/'/g, '\\\'') + "'";
    },
    /*toJSON: function () {
        return this.inspect(true);
    },*/
    unfilterJSON: function (filter) {
        return this.sub(filter || Prototype.JSONFilter, '#{1}');
    },
    isJSON: function () {
        var str = this;
        if (str.blank()) return false;
        str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
    },
    evalJSON: function (sanitize) {
        var json = this.unfilterJSON();
        try {
            if (!sanitize || json.isJSON()) return eval('(' + json + ')');
        } catch (e) {}
        throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
    },
    include: function (pattern) {
        return this.indexOf(pattern) > -1;
    },
    startsWith: function (pattern) {
        return this.indexOf(pattern) === 0;
    },
    endsWith: function (pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d;
    },
    empty: function () {
        return this == '';
    },
    blank: function () {
        return /^\s*$/.test(this);
    },
    interpolate: function (object, pattern) {
        return new Template(this, pattern).evaluate(object);
    }
});
if (Prototype.Browser.WebKit || Prototype.Browser.IE) Object.extend(String.prototype, {
    escapeHTML: function () {
        return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    unescapeHTML: function () {
        return this.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
});
String.prototype.gsub.prepareReplacement = function (replacement) {
    if (Object.isFunction(replacement)) return replacement;
    var template = new Template(replacement);
    return function (match) {
        return template.evaluate(match)
    };
};
String.prototype.parseQuery = String.prototype.toQueryParams;
Object.extend(String.prototype.escapeHTML, {
    div: document.createElement('div'),
    text: document.createTextNode('')
});
with(String.prototype.escapeHTML) div.appendChild(text);
var Template = Class.create({
    initialize: function (template, pattern) {
        this.template = template.toString();
        this.pattern = pattern || Template.Pattern;
    },
    evaluate: function (object) {
        if (Object.isFunction(object.toTemplateReplacements)) object = object.toTemplateReplacements();
        return this.template.gsub(this.pattern, function (match) {
            if (object == null) return '';
            var before = match[1] || '';
            if (before == '\\') return match[2];
            var ctx = object,
                expr = match[3];
            var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            match = pattern.exec(expr);
            if (match == null) return before;
            while (match != null) {
                var comp = match[1].startsWith('[') ? match[2].gsub('\\\\]', ']') : match[1];
                ctx = ctx[comp];
                if (null == ctx || '' == match[3]) break;
                expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
                match = pattern.exec(expr);
            }
            return before + String.interpret(ctx);
        });
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = {
    each: function (iterator, context) {
        var index = 0;
        iterator = iterator.bind(context);
        try {
            this._each(function (value) {
                iterator(value, index++);
            });
        } catch (e) {
            if (e != $break) throw e;
        }
        return this;
    },
    eachSlice: function (number, iterator, context) {
        iterator = iterator ? iterator.bind(context) : Prototype.K;
        var index = -number,
            slices = [],
            array = this.toArray();
        while ((index += number) < array.length)
            slices.push(array.slice(index, index + number));
        return slices.collect(iterator, context);
    },
    all: function (iterator, context) {
        iterator = iterator ? iterator.bind(context) : Prototype.K;
        var result = true;
        this.each(function (value, index) {
            result = result && !! iterator(value, index);
            if (!result) throw $break;
        });
        return result;
    },
    any: function (iterator, context) {
        iterator = iterator ? iterator.bind(context) : Prototype.K;
        var result = false;
        this.each(function (value, index) {
            if (result = !! iterator(value, index))
                throw $break;
        });
        return result;
    },
    collect: function (iterator, context) {
        iterator = iterator ? iterator.bind(context) : Prototype.K;
        var results = [];
        this.each(function (value, index) {
            results.push(iterator(value, index));
        });
        return results;
    },
    detect: function (iterator, context) {
        iterator = iterator.bind(context);
        var result;
        this.each(function (value, index) {
            if (iterator(value, index)) {
                result = value;
                throw $break;
            }
        });
        return result;
    },
    findAll: function (iterator, context) {
        iterator = iterator.bind(context);
        var results = [];
        this.each(function (value, index) {
            if (iterator(value, index))
                results.push(value);
        });
        return results;
    },
    grep: function (filter, iterator, context) {
        iterator = iterator ? iterator.bind(context) : Prototype.K;
        var results = [];
        if (Object.isString(filter))
            filter = new RegExp(filter);
        this.each(function (value, index) {
            if (filter.match(value))
                results.push(iterator(value, index));
        });
        return results;
    },
    include: function (object) {
        if (Object.isFunction(this.indexOf))
            if (this.indexOf(object) != -1) return true;
        var found = false;
        this.each(function (value) {
            if (value == object) {
                found = true;
                throw $break;
            }
        });
        return found;
    },
    inGroupsOf: function (number, fillWith) {
        fillWith = Object.isUndefined(fillWith) ? null : fillWith;
        return this.eachSlice(number, function (slice) {
            while (slice.length < number) slice.push(fillWith);
            return slice;
        });
    },
    inject: function (memo, iterator, context) {
        iterator = iterator.bind(context);
        this.each(function (value, index) {
            memo = iterator(memo, value, index);
        });
        return memo;
    },
    invoke: function (method) {
        var args = $A(arguments).slice(1);
        return this.map(function (value) {
            return value[method].apply(value, args);
        });
    },
    max: function (iterator, context) {
        iterator = iterator ? iterator.bind(context) : Prototype.K;
        var result;
        this.each(function (value, index) {
            value = iterator(value, index);
            if (result == null || value >= result) result = value;
        });
        return result;
    },
    min: function (iterator, context) {
        iterator = iterator ? iterator.bind(context) : Prototype.K;
        var result;
        this.each(function (value, index) {
            value = iterator(value, index);
            if (result == null || value < result) result = value;
        });
        return result;
    },
    partition: function (iterator, context) {
        iterator = iterator ? iterator.bind(context) : Prototype.K;
        var trues = [],
            falses = [];
        this.each(function (value, index) {
            (iterator(value, index) ? trues : falses).push(value);
        });
        return [trues, falses];
    },
    pluck: function (property) {
        var results = [];
        this.each(function (value) {
            results.push(value[property]);
        });
        return results;
    },
    reject: function (iterator, context) {
        iterator = iterator.bind(context);
        var results = [];
        this.each(function (value, index) {
            if (!iterator(value, index)) results.push(value);
        });
        return results;
    },
    sortBy: function (iterator, context) {
        iterator = iterator.bind(context);
        return this.map(function (value, index) {
            return {
                value: value,
                criteria: iterator(value, index)
            };
        }).sort(function (left, right) {
            var a = left.criteria,
                b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }).pluck('value');
    },
    toArray: function () {
        return this.map();
    },
    zip: function () {
        var iterator = Prototype.K,
            args = $A(arguments);
        if (Object.isFunction(args.last())) iterator = args.pop();
        var collections = [this].concat(args).map($A);
        return this.map(function (value, index) {
            return iterator(collections.pluck(index));
        });
    },
    size: function () {
        return this.toArray().length;
    },
    inspect: function () {
        return '#<Enumerable:' + this.toArray().inspect() + '>';
    }
};
Object.extend(Enumerable, {
    map: Enumerable.collect,
    find: Enumerable.detect,
    select: Enumerable.findAll,
    filter: Enumerable.findAll,
    member: Enumerable.include,
    entries: Enumerable.toArray,
    every: Enumerable.all,
    some: Enumerable.any
});

function $A(iterable) {
    if (!iterable) return [];
    if (iterable.toArray) return iterable.toArray();
    var length = iterable.length || 0,
        results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
}
if (Prototype.Browser.WebKit) {
    $A = function (iterable) {
        if (!iterable) return [];
        if (!(Object.isFunction(iterable) && iterable == '[object NodeList]') && iterable.toArray) return iterable.toArray();
        var length = iterable.length || 0,
            results = new Array(length);
        while (length--) results[length] = iterable[length];
        return results;
    };
}
Array.from = $A;
Object.extend(Array.prototype, Enumerable);
if (!Array.prototype._reverse) Array.prototype._reverse = Array.prototype.reverse;
Object.extend(Array.prototype, {
    _each: function (iterator) {
        for (var i = 0, length = this.length; i < length; i++) iterator(this[i]);
    },
    clear: function () {
        this.length = 0;
        return this;
    },
    first: function () {
        return this[0];
    },
    last: function () {
        return this[this.length - 1];
    },
    compact: function () {
        return this.select(function (value) {
            return value != null;
        });
    },
    flatten: function () {
        return this.inject([], function (array, value) {
            return array.concat(Object.isArray(value) ? value.flatten() : [value]);
        });
    },
    without: function () {
        var values = $A(arguments);
        return this.select(function (value) {
            return !values.include(value);
        });
    },
    reverse: function (inline) {
        return (inline !== false ? this : this.toArray())._reverse();
    },
    reduce: function () {
        return this.length > 1 ? this : this[0];
    },
    uniq: function (sorted) {
        return this.inject([], function (array, value, index) {
            if (0 == index || (sorted ? array.last() != value : !array.include(value))) array.push(value);
            return array;
        });
    },
    intersect: function (array) {
        return this.uniq().findAll(function (item) {
            return array.detect(function (value) {
                return item === value
            });
        });
    },
    clone: function () {
        return [].concat(this);
    },
    size: function () {
        return this.length;
    },
    inspect: function () {
        return '[' + this.map(Object.inspect).join(', ') + ']';
    },
    /*toJSON: function () {
        var results = [];
        this.each(function (object) {
            var value = Object.toJSON(object);
            if (!Object.isUndefined(value)) results.push(value);
        });
        return '[' + results.join(', ') + ']';
    }*/
});
if (Object.isFunction(Array.prototype.forEach)) Array.prototype._each = Array.prototype.forEach;
if (!Array.prototype.indexOf) Array.prototype.indexOf = function (item, i) {
    i || (i = 0);
    var length = this.length;
    if (i < 0) i = length + i;
    for (; i < length; i++)
        if (this[i] === item) return i;
    return -1;
};
if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = function (item, i) {
    i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
    var n = this.slice(0, i).reverse().indexOf(item);
    return (n < 0) ? n : i - n - 1;
};
Array.prototype.toArray = Array.prototype.clone;
var b2Settings = Class.create();
b2Settings.prototype = {
    initialize: function () {}
}
b2Settings.USHRT_MAX = 0x0000ffff;
b2Settings.b2_pi = Math.PI;
b2Settings.b2_massUnitsPerKilogram = 1.0;
b2Settings.b2_timeUnitsPerSecond = 1.0;
b2Settings.b2_lengthUnitsPerMeter = 30.0;
b2Settings.b2_maxManifoldPoints = 2;
b2Settings.b2_maxShapesPerBody = 64;
b2Settings.b2_maxPolyVertices = 8;
b2Settings.b2_maxProxies = 1024;
b2Settings.b2_maxPairs = 8 * b2Settings.b2_maxProxies;
b2Settings.b2_linearSlop = 0.005 * b2Settings.b2_lengthUnitsPerMeter;
b2Settings.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_velocityThreshold = 1.0 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_maxLinearCorrection = 0.2 * b2Settings.b2_lengthUnitsPerMeter;
b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_contactBaumgarte = 0.2;
b2Settings.b2_timeToSleep = 0.5 * b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_linearSleepTolerance = 0.01 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2Assert = function (a) {
    if (!a) {
        var nullVec;
        nullVec.x++;
    }
};
var b2Vec2 = Class.create();
b2Vec2.prototype = {
    initialize: function (x_, y_) {
        this.x = x_;
        this.y = y_;
    },
    SetZero: function () {
        this.x = 0.0;
        this.y = 0.0;
    },
    Set: function (x_, y_) {
        this.x = x_;
        this.y = y_;
    },
    SetV: function (v) {
        this.x = v.x;
        this.y = v.y;
    },
    Negative: function () {
        return new b2Vec2(-this.x, -this.y);
    },
    Copy: function () {
        return new b2Vec2(this.x, this.y);
    },
    Add: function (v) {
        this.x += v.x;
        this.y += v.y;
    },
    Subtract: function (v) {
        this.x -= v.x;
        this.y -= v.y;
    },
    Multiply: function (a) {
        this.x *= a;
        this.y *= a;
    },
    MulM: function (A) {
        var tX = this.x;
        this.x = A.col1.x * tX + A.col2.x * this.y;
        this.y = A.col1.y * tX + A.col2.y * this.y;
    },
    MulTM: function (A) {
        var tX = b2Math.b2Dot(this, A.col1);
        this.y = b2Math.b2Dot(this, A.col2);
        this.x = tX;
    },
    CrossVF: function (s) {
        var tX = this.x;
        this.x = s * this.y;
        this.y = -s * tX;
    },
    CrossFV: function (s) {
        var tX = this.x;
        this.x = -s * this.y;
        this.y = s * tX;
    },
    MinV: function (b) {
        this.x = this.x < b.x ? this.x : b.x;
        this.y = this.y < b.y ? this.y : b.y;
    },
    MaxV: function (b) {
        this.x = this.x > b.x ? this.x : b.x;
        this.y = this.y > b.y ? this.y : b.y;
    },
    Abs: function () {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
    },
    Length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    Normalize: function () {
        var length = this.Length();
        if (length < Number.MIN_VALUE) {
            return 0.0;
        }
        var invLength = 1.0 / length;
        this.x *= invLength;
        this.y *= invLength;
        return length;
    },
    IsValid: function () {
        return b2Math.b2IsValid(this.x) && b2Math.b2IsValid(this.y);
    },
    x: null,
    y: null
};
b2Vec2.Make = function (x_, y_) {
    return new b2Vec2(x_, y_);
};
var b2Mat22 = Class.create();
b2Mat22.prototype = {
    initialize: function (angle, c1, c2) {
        if (angle == null) angle = 0;
        this.col1 = new b2Vec2();
        this.col2 = new b2Vec2();
        if (c1 != null && c2 != null) {
            this.col1.SetV(c1);
            this.col2.SetV(c2);
        } else {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            this.col1.x = c;
            this.col2.x = -s;
            this.col1.y = s;
            this.col2.y = c;
        }
    },
    Set: function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.col1.x = c;
        this.col2.x = -s;
        this.col1.y = s;
        this.col2.y = c;
    },
    SetVV: function (c1, c2) {
        this.col1.SetV(c1);
        this.col2.SetV(c2);
    },
    Copy: function () {
        return new b2Mat22(0, this.col1, this.col2);
    },
    SetM: function (m) {
        this.col1.SetV(m.col1);
        this.col2.SetV(m.col2);
    },
    AddM: function (m) {
        this.col1.x += m.col1.x;
        this.col1.y += m.col1.y;
        this.col2.x += m.col2.x;
        this.col2.y += m.col2.y;
    },
    SetIdentity: function () {
        this.col1.x = 1.0;
        this.col2.x = 0.0;
        this.col1.y = 0.0;
        this.col2.y = 1.0;
    },
    SetZero: function () {
        this.col1.x = 0.0;
        this.col2.x = 0.0;
        this.col1.y = 0.0;
        this.col2.y = 0.0;
    },
    Invert: function (out) {
        var a = this.col1.x;
        var b = this.col2.x;
        var c = this.col1.y;
        var d = this.col2.y;
        var det = a * d - b * c;
        det = 1.0 / det;
        out.col1.x = det * d;
        out.col2.x = -det * b;
        out.col1.y = -det * c;
        out.col2.y = det * a;
        return out;
    },
    Solve: function (out, bX, bY) {
        var a11 = this.col1.x;
        var a12 = this.col2.x;
        var a21 = this.col1.y;
        var a22 = this.col2.y;
        var det = a11 * a22 - a12 * a21;
        det = 1.0 / det;
        out.x = det * (a22 * bX - a12 * bY);
        out.y = det * (a11 * bY - a21 * bX);
        return out;
    },
    Abs: function () {
        this.col1.Abs();
        this.col2.Abs();
    },
    col1: new b2Vec2(),
    col2: new b2Vec2()
};
var b2Math = Class.create();
b2Math.prototype = {
    initialize: function () {}
}
b2Math.b2IsValid = function (x) {
    return isFinite(x);
};
b2Math.b2Dot = function (a, b) {
    return a.x * b.x + a.y * b.y;
};
b2Math.b2CrossVV = function (a, b) {
    return a.x * b.y - a.y * b.x;
};
b2Math.b2CrossVF = function (a, s) {
    var v = new b2Vec2(s * a.y, -s * a.x);
    return v;
};
b2Math.b2CrossFV = function (s, a) {
    var v = new b2Vec2(-s * a.y, s * a.x);
    return v;
};
b2Math.b2MulMV = function (A, v) {
    var u = new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
    return u;
};
b2Math.b2MulTMV = function (A, v) {
    var u = new b2Vec2(b2Math.b2Dot(v, A.col1), b2Math.b2Dot(v, A.col2));
    return u;
};
b2Math.AddVV = function (a, b) {
    var v = new b2Vec2(a.x + b.x, a.y + b.y);
    return v;
};
b2Math.SubtractVV = function (a, b) {
    var v = new b2Vec2(a.x - b.x, a.y - b.y);
    return v;
};
b2Math.MulFV = function (s, a) {
    var v = new b2Vec2(s * a.x, s * a.y);
    return v;
};
b2Math.AddMM = function (A, B) {
    var C = new b2Mat22(0, b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2));
    return C;
};
b2Math.b2MulMM = function (A, B) {
    var C = new b2Mat22(0, b2Math.b2MulMV(A, B.col1), b2Math.b2MulMV(A, B.col2));
    return C;
};
b2Math.b2MulTMM = function (A, B) {
    var c1 = new b2Vec2(b2Math.b2Dot(A.col1, B.col1), b2Math.b2Dot(A.col2, B.col1));
    var c2 = new b2Vec2(b2Math.b2Dot(A.col1, B.col2), b2Math.b2Dot(A.col2, B.col2));
    var C = new b2Mat22(0, c1, c2);
    return C;
};
b2Math.b2Abs = function (a) {
    return a > 0.0 ? a : -a;
};
b2Math.b2AbsV = function (a) {
    var b = new b2Vec2(b2Math.b2Abs(a.x), b2Math.b2Abs(a.y));
    return b;
};
b2Math.b2AbsM = function (A) {
    var B = new b2Mat22(0, b2Math.b2AbsV(A.col1), b2Math.b2AbsV(A.col2));
    return B;
};
b2Math.b2Min = function (a, b) {
    return a < b ? a : b;
};
b2Math.b2MinV = function (a, b) {
    var c = new b2Vec2(b2Math.b2Min(a.x, b.x), b2Math.b2Min(a.y, b.y));
    return c;
};
b2Math.b2Max = function (a, b) {
    return a > b ? a : b;
};
b2Math.b2MaxV = function (a, b) {
    var c = new b2Vec2(b2Math.b2Max(a.x, b.x), b2Math.b2Max(a.y, b.y));
    return c;
};
b2Math.b2Clamp = function (a, low, high) {
    return b2Math.b2Max(low, b2Math.b2Min(a, high));
};
b2Math.b2ClampV = function (a, low, high) {
    return b2Math.b2MaxV(low, b2Math.b2MinV(a, high));
};
b2Math.b2Swap = function (a, b) {
    var tmp = a[0];
    a[0] = b[0];
    b[0] = tmp;
};
b2Math.b2Random = function () {
    return Math.random() * 2 - 1;
};
b2Math.b2NextPowerOfTwo = function (x) {
    x |= (x >> 1) & 0x7FFFFFFF;
    x |= (x >> 2) & 0x3FFFFFFF;
    x |= (x >> 4) & 0x0FFFFFFF;
    x |= (x >> 8) & 0x00FFFFFF;
    x |= (x >> 16) & 0x0000FFFF;
    return x + 1;
};
b2Math.b2IsPowerOfTwo = function (x) {
    var result = x > 0 && (x & (x - 1)) == 0;
    return result;
};
b2Math.tempVec2 = new b2Vec2();
b2Math.tempVec3 = new b2Vec2();
b2Math.tempVec4 = new b2Vec2();
b2Math.tempVec5 = new b2Vec2();
b2Math.tempMat = new b2Mat22();
var b2AABB = Class.create();
b2AABB.prototype = {
    IsValid: function () {
        var dX = this.maxVertex.x;
        var dY = this.maxVertex.y;
        dX = this.maxVertex.x;
        dY = this.maxVertex.y;
        dX -= this.minVertex.x;
        dY -= this.minVertex.y;
        var valid = dX >= 0.0 && dY >= 0.0;
        valid = valid && this.minVertex.IsValid() && this.maxVertex.IsValid();
        return valid;
    },
    minVertex: new b2Vec2(),
    maxVertex: new b2Vec2(),
    initialize: function () {
        this.minVertex = new b2Vec2();
        this.maxVertex = new b2Vec2();
    }
};
var b2Bound = Class.create();
b2Bound.prototype = {
    IsLower: function () {
        return (this.value & 1) == 0;
    },
    IsUpper: function () {
        return (this.value & 1) == 1;
    },
    Swap: function (b) {
        var tempValue = this.value;
        var tempProxyId = this.proxyId;
        var tempStabbingCount = this.stabbingCount;
        this.value = b.value;
        this.proxyId = b.proxyId;
        this.stabbingCount = b.stabbingCount;
        b.value = tempValue;
        b.proxyId = tempProxyId;
        b.stabbingCount = tempStabbingCount;
    },
    value: 0,
    proxyId: 0,
    stabbingCount: 0,
    initialize: function () {}
}
var b2BoundValues = Class.create();
b2BoundValues.prototype = {
    lowerValues: [0, 0],
    upperValues: [0, 0],
    initialize: function () {
        this.lowerValues = [0, 0];
        this.upperValues = [0, 0];
    }
}
var b2Pair = Class.create();
b2Pair.prototype = {
    SetBuffered: function () {
        this.status |= b2Pair.e_pairBuffered;
    },
    ClearBuffered: function () {
        this.status &= ~b2Pair.e_pairBuffered;
    },
    IsBuffered: function () {
        return (this.status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered;
    },
    SetRemoved: function () {
        this.status |= b2Pair.e_pairRemoved;
    },
    ClearRemoved: function () {
        this.status &= ~b2Pair.e_pairRemoved;
    },
    IsRemoved: function () {
        return (this.status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved;
    },
    SetFinal: function () {
        this.status |= b2Pair.e_pairFinal;
    },
    IsFinal: function () {
        return (this.status & b2Pair.e_pairFinal) == b2Pair.e_pairFinal;
    },
    userData: null,
    proxyId1: 0,
    proxyId2: 0,
    next: 0,
    status: 0,
    initialize: function () {}
};
b2Pair.b2_nullPair = b2Settings.USHRT_MAX;
b2Pair.b2_nullProxy = b2Settings.USHRT_MAX;
b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs;
b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1;
b2Pair.e_pairBuffered = 0x0001;
b2Pair.e_pairRemoved = 0x0002;
b2Pair.e_pairFinal = 0x0004;
var b2PairCallback = Class.create();
b2PairCallback.prototype = {
    PairAdded: function (proxyUserData1, proxyUserData2) {
        return null
    },
    PairRemoved: function (proxyUserData1, proxyUserData2, pairUserData) {},
    initialize: function () {}
};
var b2BufferedPair = Class.create();
b2BufferedPair.prototype = {
    proxyId1: 0,
    proxyId2: 0,
    initialize: function () {}
}
var b2PairManager = Class.create();
b2PairManager.prototype = {
    initialize: function () {
        var i = 0;
        this.m_hashTable = new Array(b2Pair.b2_tableCapacity);
        for (i = 0; i < b2Pair.b2_tableCapacity; ++i) {
            this.m_hashTable[i] = b2Pair.b2_nullPair;
        }
        this.m_pairs = new Array(b2Settings.b2_maxPairs);
        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairs[i] = new b2Pair();
        }
        this.m_pairBuffer = new Array(b2Settings.b2_maxPairs);
        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairBuffer[i] = new b2BufferedPair();
        }
        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairs[i].proxyId1 = b2Pair.b2_nullProxy;
            this.m_pairs[i].proxyId2 = b2Pair.b2_nullProxy;
            this.m_pairs[i].userData = null;
            this.m_pairs[i].status = 0;
            this.m_pairs[i].next = (i + 1);
        }
        this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair;
        this.m_pairCount = 0;
    },
    Initialize: function (broadPhase, callback) {
        this.m_broadPhase = broadPhase;
        this.m_callback = callback;
    },
    AddBufferedPair: function (proxyId1, proxyId2) {
        var pair = this.AddPair(proxyId1, proxyId2);
        if (pair.IsBuffered() == false) {
            pair.SetBuffered();
            this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
            this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
            ++this.m_pairBufferCount;
        }
        pair.ClearRemoved();
        if (b2BroadPhase.s_validate) {
            this.ValidateBuffer();
        }
    },
    RemoveBufferedPair: function (proxyId1, proxyId2) {
        var pair = this.Find(proxyId1, proxyId2);
        if (pair == null) {
            return;
        }
        if (pair.IsBuffered() == false) {
            pair.SetBuffered();
            this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = pair.proxyId1;
            this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = pair.proxyId2;
            ++this.m_pairBufferCount;
        }
        pair.SetRemoved();
        if (b2BroadPhase.s_validate) {
            this.ValidateBuffer();
        }
    },
    Commit: function () {
        var i = 0;
        var removeCount = 0;
        var proxies = this.m_broadPhase.m_proxyPool;
        for (i = 0; i < this.m_pairBufferCount; ++i) {
            var pair = this.Find(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
            pair.ClearBuffered();
            var proxy1 = proxies[pair.proxyId1];
            var proxy2 = proxies[pair.proxyId2];
            if (pair.IsRemoved()) {
                if (pair.IsFinal() == true) {
                    this.m_callback.PairRemoved(proxy1.userData, proxy2.userData, pair.userData);
                }
                this.m_pairBuffer[removeCount].proxyId1 = pair.proxyId1;
                this.m_pairBuffer[removeCount].proxyId2 = pair.proxyId2;
                ++removeCount;
            } else {
                if (pair.IsFinal() == false) {
                    pair.userData = this.m_callback.PairAdded(proxy1.userData, proxy2.userData);
                    pair.SetFinal();
                }
            }
        }
        for (i = 0; i < removeCount; ++i) {
            this.RemovePair(this.m_pairBuffer[i].proxyId1, this.m_pairBuffer[i].proxyId2);
        }
        this.m_pairBufferCount = 0;
        if (b2BroadPhase.s_validate) {
            this.ValidateTable();
        }
    },
    AddPair: function (proxyId1, proxyId2) {
        if (proxyId1 > proxyId2) {
            var temp = proxyId1;
            proxyId1 = proxyId2;
            proxyId2 = temp;
        }
        var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
        var pair = pair = this.FindHash(proxyId1, proxyId2, hash);
        if (pair != null) {
            return pair;
        }
        var pIndex = this.m_freePair;
        pair = this.m_pairs[pIndex];
        this.m_freePair = pair.next;
        pair.proxyId1 = proxyId1;
        pair.proxyId2 = proxyId2;
        pair.status = 0;
        pair.userData = null;
        pair.next = this.m_hashTable[hash];
        this.m_hashTable[hash] = pIndex;
        ++this.m_pairCount;
        return pair;
    },
    RemovePair: function (proxyId1, proxyId2) {
        if (proxyId1 > proxyId2) {
            var temp = proxyId1;
            proxyId1 = proxyId2;
            proxyId2 = temp;
        }
        var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
        var node = this.m_hashTable[hash];
        var pNode = null;
        while (node != b2Pair.b2_nullPair) {
            if (b2PairManager.Equals(this.m_pairs[node], proxyId1, proxyId2)) {
                var index = node;
                if (pNode) {
                    pNode.next = this.m_pairs[node].next;
                } else {
                    this.m_hashTable[hash] = this.m_pairs[node].next;
                }
                var pair = this.m_pairs[index];
                var userData = pair.userData;
                pair.next = this.m_freePair;
                pair.proxyId1 = b2Pair.b2_nullProxy;
                pair.proxyId2 = b2Pair.b2_nullProxy;
                pair.userData = null;
                pair.status = 0;
                this.m_freePair = index;
                --this.m_pairCount;
                return userData;
            } else {
                pNode = this.m_pairs[node];
                node = pNode.next;
            }
        }
        return null;
    },
    Find: function (proxyId1, proxyId2) {
        if (proxyId1 > proxyId2) {
            var temp = proxyId1;
            proxyId1 = proxyId2;
            proxyId2 = temp;
        }
        var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
        return this.FindHash(proxyId1, proxyId2, hash);
    },
    FindHash: function (proxyId1, proxyId2, hash) {
        var index = this.m_hashTable[hash];
        while (index != b2Pair.b2_nullPair && b2PairManager.Equals(this.m_pairs[index], proxyId1, proxyId2) == false) {
            index = this.m_pairs[index].next;
        }
        if (index == b2Pair.b2_nullPair) {
            return null;
        }
        return this.m_pairs[index];
    },
    ValidateBuffer: function () {},
    ValidateTable: function () {},
    m_broadPhase: null,
    m_callback: null,
    m_pairs: null,
    m_freePair: 0,
    m_pairCount: 0,
    m_pairBuffer: null,
    m_pairBufferCount: 0,
    m_hashTable: null
};
b2PairManager.Hash = function (proxyId1, proxyId2) {
    var key = ((proxyId2 << 16) & 0xffff0000) | proxyId1;
    key = ~key + ((key << 15) & 0xFFFF8000);
    key = key ^ ((key >> 12) & 0x000fffff);
    key = key + ((key << 2) & 0xFFFFFFFC);
    key = key ^ ((key >> 4) & 0x0fffffff);
    key = key * 2057;
    key = key ^ ((key >> 16) & 0x0000ffff);
    return key;
};
b2PairManager.Equals = function (pair, proxyId1, proxyId2) {
    return (pair.proxyId1 == proxyId1 && pair.proxyId2 == proxyId2);
};
b2PairManager.EqualsPair = function (pair1, pair2) {
    return pair1.proxyId1 == pair2.proxyId1 && pair1.proxyId2 == pair2.proxyId2;
};
var b2BroadPhase = Class.create();
b2BroadPhase.prototype = {
    initialize: function (worldAABB, callback) {
        this.m_pairManager = new b2PairManager();
        this.m_proxyPool = new Array(b2Settings.b2_maxPairs);
        this.m_bounds = new Array(2 * b2Settings.b2_maxProxies);
        this.m_queryResults = new Array(b2Settings.b2_maxProxies);
        this.m_quantizationFactor = new b2Vec2();
        var i = 0;
        this.m_pairManager.Initialize(this, callback);
        this.m_worldAABB = worldAABB;
        this.m_proxyCount = 0;
        for (i = 0; i < b2Settings.b2_maxProxies; i++) {
            this.m_queryResults[i] = 0;
        }
        this.m_bounds = new Array(2);
        for (i = 0; i < 2; i++) {
            this.m_bounds[i] = new Array(2 * b2Settings.b2_maxProxies);
            for (var j = 0; j < 2 * b2Settings.b2_maxProxies; j++) {
                this.m_bounds[i][j] = new b2Bound();
            }
        }
        var dX = worldAABB.maxVertex.x;
        var dY = worldAABB.maxVertex.y;
        dX -= worldAABB.minVertex.x;
        dY -= worldAABB.minVertex.y;
        this.m_quantizationFactor.x = b2Settings.USHRT_MAX / dX;
        this.m_quantizationFactor.y = b2Settings.USHRT_MAX / dY;
        var tProxy;
        for (i = 0; i < b2Settings.b2_maxProxies - 1; ++i) {
            tProxy = new b2Proxy();
            this.m_proxyPool[i] = tProxy;
            tProxy.SetNext(i + 1);
            tProxy.timeStamp = 0;
            tProxy.overlapCount = b2BroadPhase.b2_invalid;
            tProxy.userData = null;
        }
        tProxy = new b2Proxy();
        this.m_proxyPool[b2Settings.b2_maxProxies - 1] = tProxy;
        tProxy.SetNext(b2Pair.b2_nullProxy);
        tProxy.timeStamp = 0;
        tProxy.overlapCount = b2BroadPhase.b2_invalid;
        tProxy.userData = null;
        this.m_freeProxy = 0;
        this.m_timeStamp = 1;
        this.m_queryResultCount = 0;
    },
    InRange: function (aabb) {
        var dX;
        var dY;
        var d2X;
        var d2Y;
        dX = aabb.minVertex.x;
        dY = aabb.minVertex.y;
        dX -= this.m_worldAABB.maxVertex.x;
        dY -= this.m_worldAABB.maxVertex.y;
        d2X = this.m_worldAABB.minVertex.x;
        d2Y = this.m_worldAABB.minVertex.y;
        d2X -= aabb.maxVertex.x;
        d2Y -= aabb.maxVertex.y;
        dX = b2Math.b2Max(dX, d2X);
        dY = b2Math.b2Max(dY, d2Y);
        return b2Math.b2Max(dX, dY) < 0.0;
    },
    GetProxy: function (proxyId) {
        if (proxyId == b2Pair.b2_nullProxy || this.m_proxyPool[proxyId].IsValid() == false) {
            return null;
        }
        return this.m_proxyPool[proxyId];
    },
    CreateProxy: function (aabb, userData) {
        var index = 0;
        var proxy;
        var proxyId = this.m_freeProxy;
        proxy = this.m_proxyPool[proxyId];
        this.m_freeProxy = proxy.GetNext();
        proxy.overlapCount = 0;
        proxy.userData = userData;
        var boundCount = 2 * this.m_proxyCount;
        var lowerValues = new Array();
        var upperValues = new Array();
        this.ComputeBounds(lowerValues, upperValues, aabb);
        for (var axis = 0; axis < 2; ++axis) {
            var bounds = this.m_bounds[axis];
            var lowerIndex = 0;
            var upperIndex = 0;
            var lowerIndexOut = [lowerIndex];
            var upperIndexOut = [upperIndex];
            this.Query(lowerIndexOut, upperIndexOut, lowerValues[axis], upperValues[axis], bounds, boundCount, axis);
            lowerIndex = lowerIndexOut[0];
            upperIndex = upperIndexOut[0];
            var tArr = new Array();
            var j = 0;
            var tEnd = boundCount - upperIndex
            var tBound1;
            var tBound2;
            for (j = 0; j < tEnd; j++) {
                tArr[j] = new b2Bound();
                tBound1 = tArr[j];
                tBound2 = bounds[upperIndex + j];
                tBound1.value = tBound2.value;
                tBound1.proxyId = tBound2.proxyId;
                tBound1.stabbingCount = tBound2.stabbingCount;
            }
            tEnd = tArr.length;
            var tIndex = upperIndex + 2;
            for (j = 0; j < tEnd; j++) {
                tBound2 = tArr[j];
                tBound1 = bounds[tIndex + j]
                tBound1.value = tBound2.value;
                tBound1.proxyId = tBound2.proxyId;
                tBound1.stabbingCount = tBound2.stabbingCount;
            }
            tArr = new Array();
            tEnd = upperIndex - lowerIndex;
            for (j = 0; j < tEnd; j++) {
                tArr[j] = new b2Bound();
                tBound1 = tArr[j];
                tBound2 = bounds[lowerIndex + j];
                tBound1.value = tBound2.value;
                tBound1.proxyId = tBound2.proxyId;
                tBound1.stabbingCount = tBound2.stabbingCount;
            }
            tEnd = tArr.length;
            tIndex = lowerIndex + 1;
            for (j = 0; j < tEnd; j++) {
                tBound2 = tArr[j];
                tBound1 = bounds[tIndex + j]
                tBound1.value = tBound2.value;
                tBound1.proxyId = tBound2.proxyId;
                tBound1.stabbingCount = tBound2.stabbingCount;
            }
            ++upperIndex;
            bounds[lowerIndex].value = lowerValues[axis];
            bounds[lowerIndex].proxyId = proxyId;
            bounds[upperIndex].value = upperValues[axis];
            bounds[upperIndex].proxyId = proxyId;
            bounds[lowerIndex].stabbingCount = lowerIndex == 0 ? 0 : bounds[lowerIndex - 1].stabbingCount;
            bounds[upperIndex].stabbingCount = bounds[upperIndex - 1].stabbingCount;
            for (index = lowerIndex; index < upperIndex; ++index) {
                bounds[index].stabbingCount++;
            }
            for (index = lowerIndex; index < boundCount + 2; ++index) {
                var proxy2 = this.m_proxyPool[bounds[index].proxyId];
                if (bounds[index].IsLower()) {
                    proxy2.lowerBounds[axis] = index;
                } else {
                    proxy2.upperBounds[axis] = index;
                }
            }
        }
        ++this.m_proxyCount;
        for (var i = 0; i < this.m_queryResultCount; ++i) {
            this.m_pairManager.AddBufferedPair(proxyId, this.m_queryResults[i]);
        }
        this.m_pairManager.Commit();
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        return proxyId;
    },
    DestroyProxy: function (proxyId) {
        var proxy = this.m_proxyPool[proxyId];
        var boundCount = 2 * this.m_proxyCount;
        for (var axis = 0; axis < 2; ++axis) {
            var bounds = this.m_bounds[axis];
            var lowerIndex = proxy.lowerBounds[axis];
            var upperIndex = proxy.upperBounds[axis];
            var lowerValue = bounds[lowerIndex].value;
            var upperValue = bounds[upperIndex].value;
            var tArr = new Array();
            var j = 0;
            var tEnd = upperIndex - lowerIndex - 1;
            var tBound1;
            var tBound2;
            for (j = 0; j < tEnd; j++) {
                tArr[j] = new b2Bound();
                tBound1 = tArr[j];
                tBound2 = bounds[lowerIndex + 1 + j];
                tBound1.value = tBound2.value;
                tBound1.proxyId = tBound2.proxyId;
                tBound1.stabbingCount = tBound2.stabbingCount;
            }
            tEnd = tArr.length;
            var tIndex = lowerIndex;
            for (j = 0; j < tEnd; j++) {
                tBound2 = tArr[j];
                tBound1 = bounds[tIndex + j]
                tBound1.value = tBound2.value;
                tBound1.proxyId = tBound2.proxyId;
                tBound1.stabbingCount = tBound2.stabbingCount;
            }
            tArr = new Array();
            tEnd = boundCount - upperIndex - 1;
            for (j = 0; j < tEnd; j++) {
                tArr[j] = new b2Bound();
                tBound1 = tArr[j];
                tBound2 = bounds[upperIndex + 1 + j];
                tBound1.value = tBound2.value;
                tBound1.proxyId = tBound2.proxyId;
                tBound1.stabbingCount = tBound2.stabbingCount;
            }
            tEnd = tArr.length;
            tIndex = upperIndex - 1;
            for (j = 0; j < tEnd; j++) {
                tBound2 = tArr[j];
                tBound1 = bounds[tIndex + j]
                tBound1.value = tBound2.value;
                tBound1.proxyId = tBound2.proxyId;
                tBound1.stabbingCount = tBound2.stabbingCount;
            }
            tEnd = boundCount - 2;
            for (var index = lowerIndex; index < tEnd; ++index) {
                var proxy2 = this.m_proxyPool[bounds[index].proxyId];
                if (bounds[index].IsLower()) {
                    proxy2.lowerBounds[axis] = index;
                } else {
                    proxy2.upperBounds[axis] = index;
                }
            }
            tEnd = upperIndex - 1;
            for (var index2 = lowerIndex; index2 < tEnd; ++index2) {
                bounds[index2].stabbingCount--;
            }
            this.Query([0], [0], lowerValue, upperValue, bounds, boundCount - 2, axis);
        }
        for (var i = 0; i < this.m_queryResultCount; ++i) {
            this.m_pairManager.RemoveBufferedPair(proxyId, this.m_queryResults[i]);
        }
        this.m_pairManager.Commit();
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        proxy.userData = null;
        proxy.overlapCount = b2BroadPhase.b2_invalid;
        proxy.lowerBounds[0] = b2BroadPhase.b2_invalid;
        proxy.lowerBounds[1] = b2BroadPhase.b2_invalid;
        proxy.upperBounds[0] = b2BroadPhase.b2_invalid;
        proxy.upperBounds[1] = b2BroadPhase.b2_invalid;
        proxy.SetNext(this.m_freeProxy);
        this.m_freeProxy = proxyId;
        --this.m_proxyCount;
    },
    MoveProxy: function (proxyId, aabb) {
        var axis = 0;
        var index = 0;
        var bound;
        var prevBound
        var nextBound
        var nextProxyId = 0;
        var nextProxy;
        if (proxyId == b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= proxyId) {
            return;
        }
        if (aabb.IsValid() == false) {
            return;
        }
        var boundCount = 2 * this.m_proxyCount;
        var proxy = this.m_proxyPool[proxyId];
        var newValues = new b2BoundValues();
        this.ComputeBounds(newValues.lowerValues, newValues.upperValues, aabb);
        var oldValues = new b2BoundValues();
        for (axis = 0; axis < 2; ++axis) {
            oldValues.lowerValues[axis] = this.m_bounds[axis][proxy.lowerBounds[axis]].value;
            oldValues.upperValues[axis] = this.m_bounds[axis][proxy.upperBounds[axis]].value;
        }
        for (axis = 0; axis < 2; ++axis) {
            var bounds = this.m_bounds[axis];
            var lowerIndex = proxy.lowerBounds[axis];
            var upperIndex = proxy.upperBounds[axis];
            var lowerValue = newValues.lowerValues[axis];
            var upperValue = newValues.upperValues[axis];
            var deltaLower = lowerValue - bounds[lowerIndex].value;
            var deltaUpper = upperValue - bounds[upperIndex].value;
            bounds[lowerIndex].value = lowerValue;
            bounds[upperIndex].value = upperValue;
            if (deltaLower < 0) {
                index = lowerIndex;
                while (index > 0 && lowerValue < bounds[index - 1].value) {
                    bound = bounds[index];
                    prevBound = bounds[index - 1];
                    var prevProxyId = prevBound.proxyId;
                    var prevProxy = this.m_proxyPool[prevBound.proxyId];
                    prevBound.stabbingCount++;
                    if (prevBound.IsUpper() == true) {
                        if (this.TestOverlap(newValues, prevProxy)) {
                            this.m_pairManager.AddBufferedPair(proxyId, prevProxyId);
                        }
                        prevProxy.upperBounds[axis]++;
                        bound.stabbingCount++;
                    } else {
                        prevProxy.lowerBounds[axis]++;
                        bound.stabbingCount--;
                    }
                    proxy.lowerBounds[axis]--;
                    bound.Swap(prevBound);
                    --index;
                }
            }
            if (deltaUpper > 0) {
                index = upperIndex;
                while (index < boundCount - 1 && bounds[index + 1].value <= upperValue) {
                    bound = bounds[index];
                    nextBound = bounds[index + 1];
                    nextProxyId = nextBound.proxyId;
                    nextProxy = this.m_proxyPool[nextProxyId];
                    nextBound.stabbingCount++;
                    if (nextBound.IsLower() == true) {
                        if (this.TestOverlap(newValues, nextProxy)) {
                            this.m_pairManager.AddBufferedPair(proxyId, nextProxyId);
                        }
                        nextProxy.lowerBounds[axis]--;
                        bound.stabbingCount++;
                    } else {
                        nextProxy.upperBounds[axis]--;
                        bound.stabbingCount--;
                    }
                    proxy.upperBounds[axis]++;
                    bound.Swap(nextBound);
                    index++;
                }
            }
            if (deltaLower > 0) {
                index = lowerIndex;
                while (index < boundCount - 1 && bounds[index + 1].value <= lowerValue) {
                    bound = bounds[index];
                    nextBound = bounds[index + 1];
                    nextProxyId = nextBound.proxyId;
                    nextProxy = this.m_proxyPool[nextProxyId];
                    nextBound.stabbingCount--;
                    if (nextBound.IsUpper()) {
                        if (this.TestOverlap(oldValues, nextProxy)) {
                            this.m_pairManager.RemoveBufferedPair(proxyId, nextProxyId);
                        }
                        nextProxy.upperBounds[axis]--;
                        bound.stabbingCount--;
                    } else {
                        nextProxy.lowerBounds[axis]--;
                        bound.stabbingCount++;
                    }
                    proxy.lowerBounds[axis]++;
                    bound.Swap(nextBound);
                    index++;
                }
            }
            if (deltaUpper < 0) {
                index = upperIndex;
                while (index > 0 && upperValue < bounds[index - 1].value) {
                    bound = bounds[index];
                    prevBound = bounds[index - 1];
                    prevProxyId = prevBound.proxyId;
                    prevProxy = this.m_proxyPool[prevProxyId];
                    prevBound.stabbingCount--;
                    if (prevBound.IsLower() == true) {
                        if (this.TestOverlap(oldValues, prevProxy)) {
                            this.m_pairManager.RemoveBufferedPair(proxyId, prevProxyId);
                        }
                        prevProxy.lowerBounds[axis]++;
                        bound.stabbingCount--;
                    } else {
                        prevProxy.upperBounds[axis]++;
                        bound.stabbingCount++;
                    }
                    proxy.upperBounds[axis]--;
                    bound.Swap(prevBound);
                    index--;
                }
            }
        }
    },
    Commit: function () {
        this.m_pairManager.Commit();
    },
    QueryAABB: function (aabb, userData, maxCount) {
        var lowerValues = new Array();
        var upperValues = new Array();
        this.ComputeBounds(lowerValues, upperValues, aabb);
        var lowerIndex = 0;
        var upperIndex = 0;
        var lowerIndexOut = [lowerIndex];
        var upperIndexOut = [upperIndex];
        this.Query(lowerIndexOut, upperIndexOut, lowerValues[0], upperValues[0], this.m_bounds[0], 2 * this.m_proxyCount, 0);
        this.Query(lowerIndexOut, upperIndexOut, lowerValues[1], upperValues[1], this.m_bounds[1], 2 * this.m_proxyCount, 1);
        var count = 0;
        for (var i = 0; i < this.m_queryResultCount && count < maxCount; ++i, ++count) {
            var proxy = this.m_proxyPool[this.m_queryResults[i]];
            userData[i] = proxy.userData;
        }
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        return count;
    },
    Validate: function () {
        var pair;
        var proxy1;
        var proxy2;
        var overlap;
        for (var axis = 0; axis < 2; ++axis) {
            var bounds = this.m_bounds[axis];
            var boundCount = 2 * this.m_proxyCount;
            var stabbingCount = 0;
            for (var i = 0; i < boundCount; ++i) {
                var bound = bounds[i];
                if (bound.IsLower() == true) {
                    stabbingCount++;
                } else {
                    stabbingCount--;
                }
            }
        }
    },
    ComputeBounds: function (lowerValues, upperValues, aabb) {
        var minVertexX = aabb.minVertex.x;
        var minVertexY = aabb.minVertex.y;
        minVertexX = b2Math.b2Min(minVertexX, this.m_worldAABB.maxVertex.x);
        minVertexY = b2Math.b2Min(minVertexY, this.m_worldAABB.maxVertex.y);
        minVertexX = b2Math.b2Max(minVertexX, this.m_worldAABB.minVertex.x);
        minVertexY = b2Math.b2Max(minVertexY, this.m_worldAABB.minVertex.y);
        var maxVertexX = aabb.maxVertex.x;
        var maxVertexY = aabb.maxVertex.y;
        maxVertexX = b2Math.b2Min(maxVertexX, this.m_worldAABB.maxVertex.x);
        maxVertexY = b2Math.b2Min(maxVertexY, this.m_worldAABB.maxVertex.y);
        maxVertexX = b2Math.b2Max(maxVertexX, this.m_worldAABB.minVertex.x);
        maxVertexY = b2Math.b2Max(maxVertexY, this.m_worldAABB.minVertex.y);
        lowerValues[0] = (this.m_quantizationFactor.x * (minVertexX - this.m_worldAABB.minVertex.x)) & (b2Settings.USHRT_MAX - 1);
        upperValues[0] = ((this.m_quantizationFactor.x * (maxVertexX - this.m_worldAABB.minVertex.x)) & 0x0000ffff) | 1;
        lowerValues[1] = (this.m_quantizationFactor.y * (minVertexY - this.m_worldAABB.minVertex.y)) & (b2Settings.USHRT_MAX - 1);
        upperValues[1] = ((this.m_quantizationFactor.y * (maxVertexY - this.m_worldAABB.minVertex.y)) & 0x0000ffff) | 1;
    },
    TestOverlapValidate: function (p1, p2) {
        for (var axis = 0; axis < 2; ++axis) {
            var bounds = this.m_bounds[axis];
            if (bounds[p1.lowerBounds[axis]].value > bounds[p2.upperBounds[axis]].value)
                return false;
            if (bounds[p1.upperBounds[axis]].value < bounds[p2.lowerBounds[axis]].value)
                return false;
        }
        return true;
    },
    TestOverlap: function (b, p) {
        for (var axis = 0; axis < 2; ++axis) {
            var bounds = this.m_bounds[axis];
            if (b.lowerValues[axis] > bounds[p.upperBounds[axis]].value)
                return false;
            if (b.upperValues[axis] < bounds[p.lowerBounds[axis]].value)
                return false;
        }
        return true;
    },
    Query: function (lowerQueryOut, upperQueryOut, lowerValue, upperValue, bounds, boundCount, axis) {
        var lowerQuery = b2BroadPhase.BinarySearch(bounds, boundCount, lowerValue);
        var upperQuery = b2BroadPhase.BinarySearch(bounds, boundCount, upperValue);
        for (var j = lowerQuery; j < upperQuery; ++j) {
            if (bounds[j].IsLower()) {
                this.IncrementOverlapCount(bounds[j].proxyId);
            }
        }
        if (lowerQuery > 0) {
            var i = lowerQuery - 1;
            var s = bounds[i].stabbingCount;
            while (s) {
                if (bounds[i].IsLower()) {
                    var proxy = this.m_proxyPool[bounds[i].proxyId];
                    if (lowerQuery <= proxy.upperBounds[axis]) {
                        this.IncrementOverlapCount(bounds[i].proxyId);
                        --s;
                    }
                }
                --i;
            }
        }
        lowerQueryOut[0] = lowerQuery;
        upperQueryOut[0] = upperQuery;
    },
    IncrementOverlapCount: function (proxyId) {
        var proxy = this.m_proxyPool[proxyId];
        if (proxy.timeStamp < this.m_timeStamp) {
            proxy.timeStamp = this.m_timeStamp;
            proxy.overlapCount = 1;
        } else {
            proxy.overlapCount = 2;
            this.m_queryResults[this.m_queryResultCount] = proxyId;
            ++this.m_queryResultCount;
        }
    },
    IncrementTimeStamp: function () {
        if (this.m_timeStamp == b2Settings.USHRT_MAX) {
            for (var i = 0; i < b2Settings.b2_maxProxies; ++i) {
                this.m_proxyPool[i].timeStamp = 0;
            }
            this.m_timeStamp = 1;
        } else {
            ++this.m_timeStamp;
        }
    },
    m_pairManager: new b2PairManager(),
    m_proxyPool: new Array(b2Settings.b2_maxPairs),
    m_freeProxy: 0,
    m_bounds: new Array(2 * b2Settings.b2_maxProxies),
    m_queryResults: new Array(b2Settings.b2_maxProxies),
    m_queryResultCount: 0,
    m_worldAABB: null,
    m_quantizationFactor: new b2Vec2(),
    m_proxyCount: 0,
    m_timeStamp: 0
};
b2BroadPhase.s_validate = false;
b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX;
b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX;
b2BroadPhase.BinarySearch = function (bounds, count, value) {
    var low = 0;
    var high = count - 1;
    while (low <= high) {
        var mid = Math.floor((low + high) / 2);
        if (bounds[mid].value > value) {
            high = mid - 1;
        } else if (bounds[mid].value < value) {
            low = mid + 1;
        } else {
            return (mid);
        }
    }
    return (low);
};
var b2Collision = Class.create();
b2Collision.prototype = {
    initialize: function () {}
}
b2Collision.b2_nullFeature = 0x000000ff;
b2Collision.ClipSegmentToLine = function (vOut, vIn, normal, offset) {
    var numOut = 0;
    var vIn0 = vIn[0].v;
    var vIn1 = vIn[1].v;
    var distance0 = b2Math.b2Dot(normal, vIn[0].v) - offset;
    var distance1 = b2Math.b2Dot(normal, vIn[1].v) - offset;
    if (distance0 <= 0.0) vOut[numOut++] = vIn[0];
    if (distance1 <= 0.0) vOut[numOut++] = vIn[1];
    if (distance0 * distance1 < 0.0) {
        var interp = distance0 / (distance0 - distance1);
        var tVec = vOut[numOut].v;
        tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
        tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
        if (distance0 > 0.0) {
            vOut[numOut].id = vIn[0].id;
        } else {
            vOut[numOut].id = vIn[1].id;
        }
        ++numOut;
    }
    return numOut;
};
b2Collision.EdgeSeparation = function (poly1, edge1, poly2) {
    var vert1s = poly1.m_vertices;
    var count2 = poly2.m_vertexCount;
    var vert2s = poly2.m_vertices;
    var normalX = poly1.m_normals[edge1].x;
    var normalY = poly1.m_normals[edge1].y;
    var tX = normalX;
    var tMat = poly1.m_R;
    normalX = tMat.col1.x * tX + tMat.col2.x * normalY;
    normalY = tMat.col1.y * tX + tMat.col2.y * normalY;
    var normalLocal2X = normalX;
    var normalLocal2Y = normalY;
    tMat = poly2.m_R;
    tX = normalLocal2X * tMat.col1.x + normalLocal2Y * tMat.col1.y;
    normalLocal2Y = normalLocal2X * tMat.col2.x + normalLocal2Y * tMat.col2.y;
    normalLocal2X = tX;
    var vertexIndex2 = 0;
    var minDot = Number.MAX_VALUE;
    for (var i = 0; i < count2; ++i) {
        var tVec = vert2s[i];
        var dot = tVec.x * normalLocal2X + tVec.y * normalLocal2Y;
        if (dot < minDot) {
            minDot = dot;
            vertexIndex2 = i;
        }
    }
    tMat = poly1.m_R;
    var v1X = poly1.m_position.x + (tMat.col1.x * vert1s[edge1].x + tMat.col2.x * vert1s[edge1].y)
    var v1Y = poly1.m_position.y + (tMat.col1.y * vert1s[edge1].x + tMat.col2.y * vert1s[edge1].y)
    tMat = poly2.m_R;
    var v2X = poly2.m_position.x + (tMat.col1.x * vert2s[vertexIndex2].x + tMat.col2.x * vert2s[vertexIndex2].y)
    var v2Y = poly2.m_position.y + (tMat.col1.y * vert2s[vertexIndex2].x + tMat.col2.y * vert2s[vertexIndex2].y)
    v2X -= v1X;
    v2Y -= v1Y;
    var separation = v2X * normalX + v2Y * normalY;
    return separation;
};
b2Collision.FindMaxSeparation = function (edgeIndex, poly1, poly2, conservative) {
    var count1 = poly1.m_vertexCount;
    var dX = poly2.m_position.x - poly1.m_position.x;
    var dY = poly2.m_position.y - poly1.m_position.y;
    var dLocal1X = (dX * poly1.m_R.col1.x + dY * poly1.m_R.col1.y);
    var dLocal1Y = (dX * poly1.m_R.col2.x + dY * poly1.m_R.col2.y);
    var edge = 0;
    var maxDot = -Number.MAX_VALUE;
    for (var i = 0; i < count1; ++i) {
        var dot = (poly1.m_normals[i].x * dLocal1X + poly1.m_normals[i].y * dLocal1Y);
        if (dot > maxDot) {
            maxDot = dot;
            edge = i;
        }
    }
    var s = b2Collision.EdgeSeparation(poly1, edge, poly2);
    if (s > 0.0 && conservative == false) {
        return s;
    }
    var prevEdge = edge - 1 >= 0 ? edge - 1 : count1 - 1;
    var sPrev = b2Collision.EdgeSeparation(poly1, prevEdge, poly2);
    if (sPrev > 0.0 && conservative == false) {
        return sPrev;
    }
    var nextEdge = edge + 1 < count1 ? edge + 1 : 0;
    var sNext = b2Collision.EdgeSeparation(poly1, nextEdge, poly2);
    if (sNext > 0.0 && conservative == false) {
        return sNext;
    }
    var bestEdge = 0;
    var bestSeparation;
    var increment = 0;
    if (sPrev > s && sPrev > sNext) {
        increment = -1;
        bestEdge = prevEdge;
        bestSeparation = sPrev;
    } else if (sNext > s) {
        increment = 1;
        bestEdge = nextEdge;
        bestSeparation = sNext;
    } else {
        edgeIndex[0] = edge;
        return s;
    }
    while (true) {
        if (increment == -1)
            edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
        else
            edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;
        s = b2Collision.EdgeSeparation(poly1, edge, poly2);
        if (s > 0.0 && conservative == false) {
            return s;
        }
        if (s > bestSeparation) {
            bestEdge = edge;
            bestSeparation = s;
        } else {
            break;
        }
    }
    edgeIndex[0] = bestEdge;
    return bestSeparation;
};
b2Collision.FindIncidentEdge = function (c, poly1, edge1, poly2) {
    var count1 = poly1.m_vertexCount;
    var vert1s = poly1.m_vertices;
    var count2 = poly2.m_vertexCount;
    var vert2s = poly2.m_vertices;
    var vertex11 = edge1;
    var vertex12 = edge1 + 1 == count1 ? 0 : edge1 + 1;
    var tVec = vert1s[vertex12];
    var normal1Local1X = tVec.x;
    var normal1Local1Y = tVec.y;
    tVec = vert1s[vertex11];
    normal1Local1X -= tVec.x;
    normal1Local1Y -= tVec.y;
    var tX = normal1Local1X;
    normal1Local1X = normal1Local1Y;
    normal1Local1Y = -tX;
    var invLength = 1.0 / Math.sqrt(normal1Local1X * normal1Local1X + normal1Local1Y * normal1Local1Y);
    normal1Local1X *= invLength;
    normal1Local1Y *= invLength;
    var normal1X = normal1Local1X;
    var normal1Y = normal1Local1Y;
    tX = normal1X;
    var tMat = poly1.m_R;
    normal1X = tMat.col1.x * tX + tMat.col2.x * normal1Y;
    normal1Y = tMat.col1.y * tX + tMat.col2.y * normal1Y;
    var normal1Local2X = normal1X;
    var normal1Local2Y = normal1Y;
    tMat = poly2.m_R;
    tX = normal1Local2X * tMat.col1.x + normal1Local2Y * tMat.col1.y;
    normal1Local2Y = normal1Local2X * tMat.col2.x + normal1Local2Y * tMat.col2.y;
    normal1Local2X = tX;
    var vertex21 = 0;
    var vertex22 = 0;
    var minDot = Number.MAX_VALUE;
    for (var i = 0; i < count2; ++i) {
        var i1 = i;
        var i2 = i + 1 < count2 ? i + 1 : 0;
        tVec = vert2s[i2];
        var normal2Local2X = tVec.x;
        var normal2Local2Y = tVec.y;
        tVec = vert2s[i1];
        normal2Local2X -= tVec.x;
        normal2Local2Y -= tVec.y;
        tX = normal2Local2X;
        normal2Local2X = normal2Local2Y;
        normal2Local2Y = -tX;
        invLength = 1.0 / Math.sqrt(normal2Local2X * normal2Local2X + normal2Local2Y * normal2Local2Y);
        normal2Local2X *= invLength;
        normal2Local2Y *= invLength;
        var dot = normal2Local2X * normal1Local2X + normal2Local2Y * normal1Local2Y;
        if (dot < minDot) {
            minDot = dot;
            vertex21 = i1;
            vertex22 = i2;
        }
    }
    var tClip;
    tClip = c[0];
    tVec = tClip.v;
    tVec.SetV(vert2s[vertex21]);
    tVec.MulM(poly2.m_R);
    tVec.Add(poly2.m_position);
    tClip.id.features.referenceFace = edge1;
    tClip.id.features.incidentEdge = vertex21;
    tClip.id.features.incidentVertex = vertex21;
    tClip = c[1];
    tVec = tClip.v;
    tVec.SetV(vert2s[vertex22]);
    tVec.MulM(poly2.m_R);
    tVec.Add(poly2.m_position);
    tClip.id.features.referenceFace = edge1;
    tClip.id.features.incidentEdge = vertex21;
    tClip.id.features.incidentVertex = vertex22;
};
b2Collision.b2CollidePolyTempVec = new b2Vec2();
b2Collision.b2CollidePoly = function (manifold, polyA, polyB, conservative) {
    manifold.pointCount = 0;
    var edgeA = 0;
    var edgeAOut = [edgeA];
    var separationA = b2Collision.FindMaxSeparation(edgeAOut, polyA, polyB, conservative);
    edgeA = edgeAOut[0];
    if (separationA > 0.0 && conservative == false)
        return;
    var edgeB = 0;
    var edgeBOut = [edgeB];
    var separationB = b2Collision.FindMaxSeparation(edgeBOut, polyB, polyA, conservative);
    edgeB = edgeBOut[0];
    if (separationB > 0.0 && conservative == false)
        return;
    var poly1;
    var poly2;
    var edge1 = 0;
    var flip = 0;
    var k_relativeTol = 0.98;
    var k_absoluteTol = 0.001;
    if (separationB > k_relativeTol * separationA + k_absoluteTol) {
        poly1 = polyB;
        poly2 = polyA;
        edge1 = edgeB;
        flip = 1;
    } else {
        poly1 = polyA;
        poly2 = polyB;
        edge1 = edgeA;
        flip = 0;
    }
    var incidentEdge = [new ClipVertex(), new ClipVertex()];
    b2Collision.FindIncidentEdge(incidentEdge, poly1, edge1, poly2);
    var count1 = poly1.m_vertexCount;
    var vert1s = poly1.m_vertices;
    var v11 = vert1s[edge1];
    var v12 = edge1 + 1 < count1 ? vert1s[edge1 + 1] : vert1s[0];
    var dvX = v12.x - v11.x;
    var dvY = v12.y - v11.y;
    var sideNormalX = v12.x - v11.x;
    var sideNormalY = v12.y - v11.y;
    var tX = sideNormalX;
    var tMat = poly1.m_R;
    sideNormalX = tMat.col1.x * tX + tMat.col2.x * sideNormalY;
    sideNormalY = tMat.col1.y * tX + tMat.col2.y * sideNormalY;
    var invLength = 1.0 / Math.sqrt(sideNormalX * sideNormalX + sideNormalY * sideNormalY);
    sideNormalX *= invLength;
    sideNormalY *= invLength;
    var frontNormalX = sideNormalX;
    var frontNormalY = sideNormalY;
    tX = frontNormalX;
    frontNormalX = frontNormalY;
    frontNormalY = -tX;
    var v11X = v11.x;
    var v11Y = v11.y;
    tX = v11X;
    tMat = poly1.m_R;
    v11X = tMat.col1.x * tX + tMat.col2.x * v11Y;
    v11Y = tMat.col1.y * tX + tMat.col2.y * v11Y;
    v11X += poly1.m_position.x;
    v11Y += poly1.m_position.y;
    var v12X = v12.x;
    var v12Y = v12.y;
    tX = v12X;
    tMat = poly1.m_R;
    v12X = tMat.col1.x * tX + tMat.col2.x * v12Y;
    v12Y = tMat.col1.y * tX + tMat.col2.y * v12Y;
    v12X += poly1.m_position.x;
    v12Y += poly1.m_position.y;
    var frontOffset = frontNormalX * v11X + frontNormalY * v11Y;
    var sideOffset1 = -(sideNormalX * v11X + sideNormalY * v11Y);
    var sideOffset2 = sideNormalX * v12X + sideNormalY * v12Y;
    var clipPoints1 = [new ClipVertex(), new ClipVertex()];
    var clipPoints2 = [new ClipVertex(), new ClipVertex()];
    var np = 0;
    b2Collision.b2CollidePolyTempVec.Set(-sideNormalX, -sideNormalY);
    np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, b2Collision.b2CollidePolyTempVec, sideOffset1);
    if (np < 2)
        return;
    b2Collision.b2CollidePolyTempVec.Set(sideNormalX, sideNormalY);
    np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1, b2Collision.b2CollidePolyTempVec, sideOffset2);
    if (np < 2)
        return;
    if (flip) {
        manifold.normal.Set(-frontNormalX, -frontNormalY);
    } else {
        manifold.normal.Set(frontNormalX, frontNormalY);
    }
    var pointCount = 0;
    for (var i = 0; i < b2Settings.b2_maxManifoldPoints; ++i) {
        var tVec = clipPoints2[i].v;
        var separation = (frontNormalX * tVec.x + frontNormalY * tVec.y) - frontOffset;
        if (separation <= 0.0 || conservative == true) {
            var cp = manifold.points[pointCount];
            cp.separation = separation;
            cp.position.SetV(clipPoints2[i].v);
            cp.id.Set(clipPoints2[i].id);
            cp.id.features.flip = flip;
            ++pointCount;
        }
    }
    manifold.pointCount = pointCount;
};
b2Collision.b2CollideCircle = function (manifold, circle1, circle2, conservative) {
    manifold.pointCount = 0;
    var dX = circle2.m_position.x - circle1.m_position.x;
    var dY = circle2.m_position.y - circle1.m_position.y;
    var distSqr = dX * dX + dY * dY;
    var radiusSum = circle1.m_radius + circle2.m_radius;
    if (distSqr > radiusSum * radiusSum && conservative == false) {
        return;
    }
    var separation;
    if (distSqr < Number.MIN_VALUE) {
        separation = -radiusSum;
        manifold.normal.Set(0.0, 1.0);
    } else {
        var dist = Math.sqrt(distSqr);
        separation = dist - radiusSum;
        var a = 1.0 / dist;
        manifold.normal.x = a * dX;
        manifold.normal.y = a * dY;
    }
    manifold.pointCount = 1;
    var tPoint = manifold.points[0];
    tPoint.id.set_key(0);
    tPoint.separation = separation;
    tPoint.position.x = circle2.m_position.x - (circle2.m_radius * manifold.normal.x);
    tPoint.position.y = circle2.m_position.y - (circle2.m_radius * manifold.normal.y);
};
b2Collision.b2CollidePolyAndCircle = function (manifold, poly, circle, conservative) {
    manifold.pointCount = 0;
    var tPoint;
    var dX;
    var dY;
    var xLocalX = circle.m_position.x - poly.m_position.x;
    var xLocalY = circle.m_position.y - poly.m_position.y;
    var tMat = poly.m_R;
    var tX = xLocalX * tMat.col1.x + xLocalY * tMat.col1.y;
    xLocalY = xLocalX * tMat.col2.x + xLocalY * tMat.col2.y;
    xLocalX = tX;
    var dist;
    var normalIndex = 0;
    var separation = -Number.MAX_VALUE;
    var radius = circle.m_radius;
    for (var i = 0; i < poly.m_vertexCount; ++i) {
        var s = poly.m_normals[i].x * (xLocalX - poly.m_vertices[i].x) + poly.m_normals[i].y * (xLocalY - poly.m_vertices[i].y);
        if (s > radius) {
            return;
        }
        if (s > separation) {
            separation = s;
            normalIndex = i;
        }
    }
    if (separation < Number.MIN_VALUE) {
        manifold.pointCount = 1;
        var tVec = poly.m_normals[normalIndex];
        manifold.normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        manifold.normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tPoint = manifold.points[0];
        tPoint.id.features.incidentEdge = normalIndex;
        tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature;
        tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
        tPoint.id.features.flip = 0;
        tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
        tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
        tPoint.separation = separation - radius;
        return;
    }
    var vertIndex1 = normalIndex;
    var vertIndex2 = vertIndex1 + 1 < poly.m_vertexCount ? vertIndex1 + 1 : 0;
    var eX = poly.m_vertices[vertIndex2].x - poly.m_vertices[vertIndex1].x;
    var eY = poly.m_vertices[vertIndex2].y - poly.m_vertices[vertIndex1].y;
    var length = Math.sqrt(eX * eX + eY * eY);
    eX /= length;
    eY /= length;
    if (length < Number.MIN_VALUE) {
        dX = xLocalX - poly.m_vertices[vertIndex1].x;
        dY = xLocalY - poly.m_vertices[vertIndex1].y;
        dist = Math.sqrt(dX * dX + dY * dY);
        dX /= dist;
        dY /= dist;
        if (dist > radius) {
            return;
        }
        manifold.pointCount = 1;
        manifold.normal.Set(tMat.col1.x * dX + tMat.col2.x * dY, tMat.col1.y * dX + tMat.col2.y * dY);
        tPoint = manifold.points[0];
        tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature;
        tPoint.id.features.incidentVertex = vertIndex1;
        tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
        tPoint.id.features.flip = 0;
        tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
        tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
        tPoint.separation = dist - radius;
        return;
    }
    var u = (xLocalX - poly.m_vertices[vertIndex1].x) * eX + (xLocalY - poly.m_vertices[vertIndex1].y) * eY;
    tPoint = manifold.points[0];
    tPoint.id.features.incidentEdge = b2Collision.b2_nullFeature;
    tPoint.id.features.incidentVertex = b2Collision.b2_nullFeature;
    tPoint.id.features.referenceFace = b2Collision.b2_nullFeature;
    tPoint.id.features.flip = 0;
    var pX, pY;
    if (u <= 0.0) {
        pX = poly.m_vertices[vertIndex1].x;
        pY = poly.m_vertices[vertIndex1].y;
        tPoint.id.features.incidentVertex = vertIndex1;
    } else if (u >= length) {
        pX = poly.m_vertices[vertIndex2].x;
        pY = poly.m_vertices[vertIndex2].y;
        tPoint.id.features.incidentVertex = vertIndex2;
    } else {
        pX = eX * u + poly.m_vertices[vertIndex1].x;
        pY = eY * u + poly.m_vertices[vertIndex1].y;
        tPoint.id.features.incidentEdge = vertIndex1;
    }
    dX = xLocalX - pX;
    dY = xLocalY - pY;
    dist = Math.sqrt(dX * dX + dY * dY);
    dX /= dist;
    dY /= dist;
    if (dist > radius) {
        return;
    }
    manifold.pointCount = 1;
    manifold.normal.Set(tMat.col1.x * dX + tMat.col2.x * dY, tMat.col1.y * dX + tMat.col2.y * dY);
    tPoint.position.x = circle.m_position.x - radius * manifold.normal.x;
    tPoint.position.y = circle.m_position.y - radius * manifold.normal.y;
    tPoint.separation = dist - radius;
};
b2Collision.b2TestOverlap = function (a, b) {
    var t1 = b.minVertex;
    var t2 = a.maxVertex;
    var d1X = t1.x - t2.x;
    var d1Y = t1.y - t2.y;
    t1 = a.minVertex;
    t2 = b.maxVertex;
    var d2X = t1.x - t2.x;
    var d2Y = t1.y - t2.y;
    if (d1X > 0.0 || d1Y > 0.0)
        return false;
    if (d2X > 0.0 || d2Y > 0.0)
        return false;
    return true;
};
var Features = Class.create();
Features.prototype = {
    set_referenceFace: function (value) {
        this._referenceFace = value;
        this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceFace & 0x000000ff)
    },
    get_referenceFace: function () {
        return this._referenceFace;
    },
    _referenceFace: 0,
    set_incidentEdge: function (value) {
        this._incidentEdge = value;
        this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00)
    },
    get_incidentEdge: function () {
        return this._incidentEdge;
    },
    _incidentEdge: 0,
    set_incidentVertex: function (value) {
        this._incidentVertex = value;
        this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000)
    },
    get_incidentVertex: function () {
        return this._incidentVertex;
    },
    _incidentVertex: 0,
    set_flip: function (value) {
        this._flip = value;
        this._m_id._key = (this._m_id._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000)
    },
    get_flip: function () {
        return this._flip;
    },
    _flip: 0,
    _m_id: null,
    initialize: function () {}
};
var b2ContactID = Class.create();
b2ContactID.prototype = {
    initialize: function () {
        this.features = new Features();
        this.features._m_id = this;
    },
    Set: function (id) {
        this.set_key(id._key);
    },
    Copy: function () {
        var id = new b2ContactID();
        id.set_key(this._key);
        return id;
    },
    get_key: function () {
        return this._key;
    },
    set_key: function (value) {
        this._key = value;
        this.features._referenceFace = this._key & 0x000000ff;
        this.features._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
        this.features._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
        this.features._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
    },
    features: new Features(),
    _key: 0
};
var b2ContactPoint = Class.create();
b2ContactPoint.prototype = {
    position: new b2Vec2(),
    separation: null,
    normalImpulse: null,
    tangentImpulse: null,
    id: new b2ContactID(),
    initialize: function () {
        this.position = new b2Vec2();
        this.id = new b2ContactID();
    }
};
var b2Distance = Class.create();
b2Distance.prototype = {
    initialize: function () {}
};
b2Distance.ProcessTwo = function (p1Out, p2Out, p1s, p2s, points) {
    var rX = -points[1].x;
    var rY = -points[1].y;
    var dX = points[0].x - points[1].x;
    var dY = points[0].y - points[1].y;
    var length = Math.sqrt(dX * dX + dY * dY);
    dX /= length;
    dY /= length;
    var lambda = rX * dX + rY * dY;
    if (lambda <= 0.0 || length < Number.MIN_VALUE) {
        p1Out.SetV(p1s[1]);
        p2Out.SetV(p2s[1]);
        p1s[0].SetV(p1s[1]);
        p2s[0].SetV(p2s[1]);
        points[0].SetV(points[1]);
        return 1;
    }
    lambda /= length;
    p1Out.x = p1s[1].x + lambda * (p1s[0].x - p1s[1].x);
    p1Out.y = p1s[1].y + lambda * (p1s[0].y - p1s[1].y);
    p2Out.x = p2s[1].x + lambda * (p2s[0].x - p2s[1].x);
    p2Out.y = p2s[1].y + lambda * (p2s[0].y - p2s[1].y);
    return 2;
};
b2Distance.ProcessThree = function (p1Out, p2Out, p1s, p2s, points) {
    var aX = points[0].x;
    var aY = points[0].y;
    var bX = points[1].x;
    var bY = points[1].y;
    var cX = points[2].x;
    var cY = points[2].y;
    var abX = bX - aX;
    var abY = bY - aY;
    var acX = cX - aX;
    var acY = cY - aY;
    var bcX = cX - bX;
    var bcY = cY - bY;
    var sn = -(aX * abX + aY * abY);
    var sd = (bX * abX + bY * abY);
    var tn = -(aX * acX + aY * acY);
    var td = (cX * acX + cY * acY);
    var un = -(bX * bcX + bY * bcY);
    var ud = (cX * bcX + cY * bcY);
    if (td <= 0.0 && ud <= 0.0) {
        p1Out.SetV(p1s[2]);
        p2Out.SetV(p2s[2]);
        p1s[0].SetV(p1s[2]);
        p2s[0].SetV(p2s[2]);
        points[0].SetV(points[2]);
        return 1;
    }
    var n = abX * acY - abY * acX;
    var vc = n * (aX * bY - aY * bX);
    var va = n * (bX * cY - bY * cX);
    if (va <= 0.0 && un >= 0.0 && ud >= 0.0) {
        var lambda = un / (un + ud);
        p1Out.x = p1s[1].x + lambda * (p1s[2].x - p1s[1].x);
        p1Out.y = p1s[1].y + lambda * (p1s[2].y - p1s[1].y);
        p2Out.x = p2s[1].x + lambda * (p2s[2].x - p2s[1].x);
        p2Out.y = p2s[1].y + lambda * (p2s[2].y - p2s[1].y);
        p1s[0].SetV(p1s[2]);
        p2s[0].SetV(p2s[2]);
        points[0].SetV(points[2]);
        return 2;
    }
    var vb = n * (cX * aY - cY * aX);
    if (vb <= 0.0 && tn >= 0.0 && td >= 0.0) {
        var lambda = tn / (tn + td);
        p1Out.x = p1s[0].x + lambda * (p1s[2].x - p1s[0].x);
        p1Out.y = p1s[0].y + lambda * (p1s[2].y - p1s[0].y);
        p2Out.x = p2s[0].x + lambda * (p2s[2].x - p2s[0].x);
        p2Out.y = p2s[0].y + lambda * (p2s[2].y - p2s[0].y);
        p1s[1].SetV(p1s[2]);
        p2s[1].SetV(p2s[2]);
        points[1].SetV(points[2]);
        return 2;
    }
    var denom = va + vb + vc;
    denom = 1.0 / denom;
    var u = va * denom;
    var v = vb * denom;
    var w = 1.0 - u - v;
    p1Out.x = u * p1s[0].x + v * p1s[1].x + w * p1s[2].x;
    p1Out.y = u * p1s[0].y + v * p1s[1].y + w * p1s[2].y;
    p2Out.x = u * p2s[0].x + v * p2s[1].x + w * p2s[2].x;
    p2Out.y = u * p2s[0].y + v * p2s[1].y + w * p2s[2].y;
    return 3;
};
b2Distance.InPoinsts = function (w, points, pointCount) {
    for (var i = 0; i < pointCount; ++i) {
        if (w.x == points[i].x && w.y == points[i].y) {
            return true;
        }
    }
    return false;
};
b2Distance.Distance = function (p1Out, p2Out, shape1, shape2) {
    var p1s = new Array(3);
    var p2s = new Array(3);
    var points = new Array(3);
    var pointCount = 0;
    p1Out.SetV(shape1.m_position);
    p2Out.SetV(shape2.m_position);
    var vSqr = 0.0;
    var maxIterations = 20;
    for (var iter = 0; iter < maxIterations; ++iter) {
        var vX = p2Out.x - p1Out.x;
        var vY = p2Out.y - p1Out.y;
        var w1 = shape1.Support(vX, vY);
        var w2 = shape2.Support(-vX, -vY);
        vSqr = (vX * vX + vY * vY);
        var wX = w2.x - w1.x;
        var wY = w2.y - w1.y;
        var vw = (vX * wX + vY * wY);
        if (vSqr - b2Dot(vX * wX + vY * wY) <= 0.01 * vSqr) {
            if (pointCount == 0) {
                p1Out.SetV(w1);
                p2Out.SetV(w2);
            }
            b2Distance.g_GJK_Iterations = iter;
            return Math.sqrt(vSqr);
        }
        switch (pointCount) {
        case 0:
            p1s[0].SetV(w1);
            p2s[0].SetV(w2);
            points[0] = w;
            p1Out.SetV(p1s[0]);
            p2Out.SetV(p2s[0]);
            ++pointCount;
            break;
        case 1:
            p1s[1].SetV(w1);
            p2s[1].SetV(w2);
            points[1].x = wX;
            points[1].y = wY;
            pointCount = b2Distance.ProcessTwo(p1Out, p2Out, p1s, p2s, points);
            break;
        case 2:
            p1s[2].SetV(w1);
            p2s[2].SetV(w2);
            points[2].x = wX;
            points[2].y = wY;
            pointCount = b2Distance.ProcessThree(p1Out, p2Out, p1s, p2s, points);
            break;
        }
        if (pointCount == 3) {
            b2Distance.g_GJK_Iterations = iter;
            return 0.0;
        }
        var maxSqr = -Number.MAX_VALUE;
        for (var i = 0; i < pointCount; ++i) {
            maxSqr = b2Math.b2Max(maxSqr, (points[i].x * points[i].x + points[i].y * points[i].y));
        }
        if (pointCount == 3 || vSqr <= 100.0 * Number.MIN_VALUE * maxSqr) {
            b2Distance.g_GJK_Iterations = iter;
            return Math.sqrt(vSqr);
        }
    }
    b2Distance.g_GJK_Iterations = maxIterations;
    return Math.sqrt(vSqr);
};
b2Distance.g_GJK_Iterations = 0;
var b2Manifold = Class.create();
b2Manifold.prototype = {
    initialize: function () {
        this.points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.points[i] = new b2ContactPoint();
        }
        this.normal = new b2Vec2();
    },
    points: null,
    normal: null,
    pointCount: 0
};
var b2OBB = Class.create();
b2OBB.prototype = {
    R: new b2Mat22(),
    center: new b2Vec2(),
    extents: new b2Vec2(),
    initialize: function () {
        this.R = new b2Mat22();
        this.center = new b2Vec2();
        this.extents = new b2Vec2();
    }
};
var b2Proxy = Class.create();
b2Proxy.prototype = {
    GetNext: function () {
        return this.lowerBounds[0];
    },
    SetNext: function (next) {
        this.lowerBounds[0] = next;
    },
    IsValid: function () {
        return this.overlapCount != b2BroadPhase.b2_invalid;
    },
    lowerBounds: [(0), (0)],
    upperBounds: [(0), (0)],
    overlapCount: 0,
    timeStamp: 0,
    userData: null,
    initialize: function () {
        this.lowerBounds = [(0), (0)];
        this.upperBounds = [(0), (0)];
    }
}
var ClipVertex = Class.create();
ClipVertex.prototype = {
    v: new b2Vec2(),
    id: new b2ContactID(),
    initialize: function () {
        this.v = new b2Vec2();
        this.id = new b2ContactID();
    }
};
var b2Shape = Class.create();
b2Shape.prototype = {
    TestPoint: function (p) {
        return false
    },
    GetUserData: function () {
        return this.m_userData;
    },
    GetType: function () {
        return this.m_type;
    },
    GetBody: function () {
        return this.m_body;
    },
    GetPosition: function () {
        return this.m_position;
    },
    GetRotationMatrix: function () {
        return this.m_R;
    },
    ResetProxy: function (broadPhase) {},
    GetNext: function () {
        return this.m_next;
    },
    initialize: function (def, body) {
        this.m_R = new b2Mat22();
        this.m_position = new b2Vec2();
        this.m_userData = def.userData;
        this.m_friction = def.friction;
        this.m_restitution = def.restitution;
        this.m_body = body;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius = 0.0;
        this.m_categoryBits = def.categoryBits;
        this.m_maskBits = def.maskBits;
        this.m_groupIndex = def.groupIndex;
    },
    DestroyProxy: function () {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            this.m_body.m_world.m_broadPhase.DestroyProxy(this.m_proxyId);
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
    },
    Synchronize: function (position1, R1, position2, R2) {},
    QuickSync: function (position, R) {},
    Support: function (dX, dY, out) {},
    GetMaxRadius: function () {
        return this.m_maxRadius;
    },
    m_next: null,
    m_R: new b2Mat22(),
    m_position: new b2Vec2(),
    m_type: 0,
    m_userData: null,
    m_body: null,
    m_friction: null,
    m_restitution: null,
    m_maxRadius: null,
    m_proxyId: 0,
    m_categoryBits: 0,
    m_maskBits: 0,
    m_groupIndex: 0
};
b2Shape.Create = function (def, body, center) {
    switch (def.type) {
    case b2Shape.e_circleShape:
        {
            return new b2CircleShape(def, body, center);
        }
    case b2Shape.e_boxShape:
    case b2Shape.e_polyShape:
        {
            return new b2PolyShape(def, body, center);
        }
    }
    return null;
};
b2Shape.Destroy = function (shape) {
    if (shape.m_proxyId != b2Pair.b2_nullProxy)
        shape.m_body.m_world.m_broadPhase.DestroyProxy(shape.m_proxyId);
};
b2Shape.e_unknownShape = -1;
b2Shape.e_circleShape = 0;
b2Shape.e_boxShape = 1;
b2Shape.e_polyShape = 2;
b2Shape.e_meshShape = 3;
b2Shape.e_shapeTypeCount = 4;
b2Shape.PolyMass = function (massData, vs, count, rho) {
    var center = new b2Vec2();
    center.SetZero();
    var area = 0.0;
    var I = 0.0;
    var pRef = new b2Vec2(0.0, 0.0);
    var inv3 = 1.0 / 3.0;
    for (var i = 0; i < count; ++i) {
        var p1 = pRef;
        var p2 = vs[i];
        var p3 = i + 1 < count ? vs[i + 1] : vs[0];
        var e1 = b2Math.SubtractVV(p2, p1);
        var e2 = b2Math.SubtractVV(p3, p1);
        var D = b2Math.b2CrossVV(e1, e2);
        var triangleArea = 0.5 * D;
        area += triangleArea;
        var tVec = new b2Vec2();
        tVec.SetV(p1);
        tVec.Add(p2);
        tVec.Add(p3);
        tVec.Multiply(inv3 * triangleArea);
        center.Add(tVec);
        var px = p1.x;
        var py = p1.y;
        var ex1 = e1.x;
        var ey1 = e1.y;
        var ex2 = e2.x;
        var ey2 = e2.y;
        var intx2 = inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
        var inty2 = inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;
        I += D * (intx2 + inty2);
    }
    massData.mass = rho * area;
    center.Multiply(1.0 / area);
    massData.center = center;
    I = rho * (I - area * b2Math.b2Dot(center, center));
    massData.I = I;
};
b2Shape.PolyCentroid = function (vs, count, out) {
    var cX = 0.0;
    var cY = 0.0;
    var area = 0.0;
    var pRefX = 0.0;
    var pRefY = 0.0;
    var inv3 = 1.0 / 3.0;
    for (var i = 0; i < count; ++i) {
        var p1X = pRefX;
        var p1Y = pRefY;
        var p2X = vs[i].x;
        var p2Y = vs[i].y;
        var p3X = i + 1 < count ? vs[i + 1].x : vs[0].x;
        var p3Y = i + 1 < count ? vs[i + 1].y : vs[0].y;
        var e1X = p2X - p1X;
        var e1Y = p2Y - p1Y;
        var e2X = p3X - p1X;
        var e2Y = p3Y - p1Y;
        var D = (e1X * e2Y - e1Y * e2X);
        var triangleArea = 0.5 * D;
        area += triangleArea;
        cX += triangleArea * inv3 * (p1X + p2X + p3X);
        cY += triangleArea * inv3 * (p1Y + p2Y + p3Y);
    }
    cX *= 1.0 / area;
    cY *= 1.0 / area;
    out.Set(cX, cY);
};
var b2ShapeDef = Class.create();
b2ShapeDef.prototype = {
    initialize: function () {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0.0, 0.0);
        this.localRotation = 0.0;
        this.friction = 0.2;
        this.restitution = 0.0;
        this.density = 0.0;
        this.categoryBits = 0x0001;
        this.maskBits = 0xFFFF;
        this.groupIndex = 0;
    },
    ComputeMass: function (massData) {
        massData.center = new b2Vec2(0.0, 0.0)
        if (this.density == 0.0) {
            massData.mass = 0.0;
            massData.center.Set(0.0, 0.0);
            massData.I = 0.0;
        };
        switch (this.type) {
        case b2Shape.e_circleShape:
            {
                var circle = this;
                massData.mass = this.density * b2Settings.b2_pi * circle.radius * circle.radius;
                massData.center.Set(0.0, 0.0);
                massData.I = 0.5 * (massData.mass) * circle.radius * circle.radius;
            }
            break;
        case b2Shape.e_boxShape:
            {
                var box = this;
                massData.mass = 4.0 * this.density * box.extents.x * box.extents.y;
                massData.center.Set(0.0, 0.0);
                massData.I = massData.mass / 3.0 * b2Math.b2Dot(box.extents, box.extents);
            }
            break;
        case b2Shape.e_polyShape:
            {
                var poly = this;
                b2Shape.PolyMass(massData, poly.vertices, poly.vertexCount, this.density);
            }
            break;
        default:
            massData.mass = 0.0;
            massData.center.Set(0.0, 0.0);
            massData.I = 0.0;
            break;
        }
    },
    type: 0,
    userData: null,
    localPosition: null,
    localRotation: null,
    friction: null,
    restitution: null,
    density: null,
    categoryBits: 0,
    maskBits: 0,
    groupIndex: 0
};
var b2BoxDef = Class.create();
Object.extend(b2BoxDef.prototype, b2ShapeDef.prototype);
Object.extend(b2BoxDef.prototype, {
    initialize: function () {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0.0, 0.0);
        this.localRotation = 0.0;
        this.friction = 0.2;
        this.restitution = 0.0;
        this.density = 0.0;
        this.categoryBits = 0x0001;
        this.maskBits = 0xFFFF;
        this.groupIndex = 0;
        this.type = b2Shape.e_boxShape;
        this.extents = new b2Vec2(1.0, 1.0);
    },
    extents: null
});
var b2CircleDef = Class.create();
Object.extend(b2CircleDef.prototype, b2ShapeDef.prototype);
Object.extend(b2CircleDef.prototype, {
    initialize: function () {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0.0, 0.0);
        this.localRotation = 0.0;
        this.friction = 0.2;
        this.restitution = 0.0;
        this.density = 0.0;
        this.categoryBits = 0x0001;
        this.maskBits = 0xFFFF;
        this.groupIndex = 0;
        this.type = b2Shape.e_circleShape;
        this.radius = 1.0;
    },
    radius: null
});
var b2CircleShape = Class.create();
Object.extend(b2CircleShape.prototype, b2Shape.prototype);
Object.extend(b2CircleShape.prototype, {
    TestPoint: function (p) {
        var d = new b2Vec2();
        d.SetV(p);
        d.Subtract(this.m_position);
        return b2Math.b2Dot(d, d) <= this.m_radius * this.m_radius;
    },
    initialize: function (def, body, localCenter) {
        this.m_R = new b2Mat22();
        this.m_position = new b2Vec2();
        this.m_userData = def.userData;
        this.m_friction = def.friction;
        this.m_restitution = def.restitution;
        this.m_body = body;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius = 0.0;
        this.m_categoryBits = def.categoryBits;
        this.m_maskBits = def.maskBits;
        this.m_groupIndex = def.groupIndex;
        this.m_localPosition = new b2Vec2();
        var circle = def;
        this.m_localPosition.Set(def.localPosition.x - localCenter.x, def.localPosition.y - localCenter.y);
        this.m_type = b2Shape.e_circleShape;
        this.m_radius = circle.radius;
        this.m_R.SetM(this.m_body.m_R);
        var rX = this.m_R.col1.x * this.m_localPosition.x + this.m_R.col2.x * this.m_localPosition.y;
        var rY = this.m_R.col1.y * this.m_localPosition.x + this.m_R.col2.y * this.m_localPosition.y;
        this.m_position.x = this.m_body.m_position.x + rX;
        this.m_position.y = this.m_body.m_position.y + rY;
        this.m_maxRadius = Math.sqrt(rX * rX + rY * rY) + this.m_radius;
        var aabb = new b2AABB();
        aabb.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius);
        aabb.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
        var broadPhase = this.m_body.m_world.m_broadPhase;
        if (broadPhase.InRange(aabb)) {
            this.m_proxyId = broadPhase.CreateProxy(aabb, this);
        } else {
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            this.m_body.Freeze();
        }
    },
    Synchronize: function (position1, R1, position2, R2) {
        this.m_R.SetM(R2);
        this.m_position.x = (R2.col1.x * this.m_localPosition.x + R2.col2.x * this.m_localPosition.y) + position2.x;
        this.m_position.y = (R2.col1.y * this.m_localPosition.x + R2.col2.y * this.m_localPosition.y) + position2.y;
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            return;
        }
        var p1X = position1.x + (R1.col1.x * this.m_localPosition.x + R1.col2.x * this.m_localPosition.y);
        var p1Y = position1.y + (R1.col1.y * this.m_localPosition.x + R1.col2.y * this.m_localPosition.y);
        var lowerX = Math.min(p1X, this.m_position.x);
        var lowerY = Math.min(p1Y, this.m_position.y);
        var upperX = Math.max(p1X, this.m_position.x);
        var upperY = Math.max(p1Y, this.m_position.y);
        var aabb = new b2AABB();
        aabb.minVertex.Set(lowerX - this.m_radius, lowerY - this.m_radius);
        aabb.maxVertex.Set(upperX + this.m_radius, upperY + this.m_radius);
        var broadPhase = this.m_body.m_world.m_broadPhase;
        if (broadPhase.InRange(aabb)) {
            broadPhase.MoveProxy(this.m_proxyId, aabb);
        } else {
            this.m_body.Freeze();
        }
    },
    QuickSync: function (position, R) {
        this.m_R.SetM(R);
        this.m_position.x = (R.col1.x * this.m_localPosition.x + R.col2.x * this.m_localPosition.y) + position.x;
        this.m_position.y = (R.col1.y * this.m_localPosition.x + R.col2.y * this.m_localPosition.y) + position.y;
    },
    ResetProxy: function (broadPhase) {
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            return;
        }
        var proxy = broadPhase.GetProxy(this.m_proxyId);
        broadPhase.DestroyProxy(this.m_proxyId);
        proxy = null;
        var aabb = new b2AABB();
        aabb.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius);
        aabb.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
        if (broadPhase.InRange(aabb)) {
            this.m_proxyId = broadPhase.CreateProxy(aabb, this);
        } else {
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            this.m_body.Freeze();
        }
    },
    Support: function (dX, dY, out) {
        var len = Math.sqrt(dX * dX + dY * dY);
        dX /= len;
        dY /= len;
        out.Set(this.m_position.x + this.m_radius * dX, this.m_position.y + this.m_radius * dY);
    },
    m_localPosition: new b2Vec2(),
    m_radius: null
});
var b2MassData = Class.create();
b2MassData.prototype = {
    mass: 0.0,
    center: new b2Vec2(0, 0),
    I: 0.0,
    initialize: function () {
        this.center = new b2Vec2(0, 0);
    }
}
var b2PolyDef = Class.create();
Object.extend(b2PolyDef.prototype, b2ShapeDef.prototype);
Object.extend(b2PolyDef.prototype, {
    initialize: function () {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0.0, 0.0);
        this.localRotation = 0.0;
        this.friction = 0.2;
        this.restitution = 0.0;
        this.density = 0.0;
        this.categoryBits = 0x0001;
        this.maskBits = 0xFFFF;
        this.groupIndex = 0;
        this.vertices = new Array(b2Settings.b2_maxPolyVertices);
        this.type = b2Shape.e_polyShape;
        this.vertexCount = 0;
        for (var i = 0; i < b2Settings.b2_maxPolyVertices; i++) {
            this.vertices[i] = new b2Vec2();
        }
    },
    vertices: new Array(b2Settings.b2_maxPolyVertices),
    vertexCount: 0
});
var b2PolyShape = Class.create();
Object.extend(b2PolyShape.prototype, b2Shape.prototype);
Object.extend(b2PolyShape.prototype, {
    TestPoint: function (p) {
        var pLocal = new b2Vec2();
        pLocal.SetV(p);
        pLocal.Subtract(this.m_position);
        pLocal.MulTM(this.m_R);
        for (var i = 0; i < this.m_vertexCount; ++i) {
            var tVec = new b2Vec2();
            tVec.SetV(pLocal);
            tVec.Subtract(this.m_vertices[i]);
            var dot = b2Math.b2Dot(this.m_normals[i], tVec);
            if (dot > 0.0) {
                return false;
            }
        }
        return true;
    },
    initialize: function (def, body, newOrigin) {
        this.m_R = new b2Mat22();
        this.m_position = new b2Vec2();
        this.m_userData = def.userData;
        this.m_friction = def.friction;
        this.m_restitution = def.restitution;
        this.m_body = body;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius = 0.0;
        this.m_categoryBits = def.categoryBits;
        this.m_maskBits = def.maskBits;
        this.m_groupIndex = def.groupIndex;
        this.syncAABB = new b2AABB();
        this.syncMat = new b2Mat22();
        this.m_localCentroid = new b2Vec2();
        this.m_localOBB = new b2OBB();
        var i = 0;
        var hX;
        var hY;
        var tVec;
        var aabb = new b2AABB();
        this.m_vertices = new Array(b2Settings.b2_maxPolyVertices);
        this.m_coreVertices = new Array(b2Settings.b2_maxPolyVertices);
        this.m_normals = new Array(b2Settings.b2_maxPolyVertices);
        this.m_type = b2Shape.e_polyShape;
        var localR = new b2Mat22(def.localRotation);
        if (def.type == b2Shape.e_boxShape) {
            this.m_localCentroid.x = def.localPosition.x - newOrigin.x;
            this.m_localCentroid.y = def.localPosition.y - newOrigin.y;
            var box = def;
            this.m_vertexCount = 4;
            hX = box.extents.x;
            hY = box.extents.y;
            var hcX = Math.max(0.0, hX - 2.0 * b2Settings.b2_linearSlop);
            var hcY = Math.max(0.0, hY - 2.0 * b2Settings.b2_linearSlop);
            tVec = this.m_vertices[0] = new b2Vec2();
            tVec.x = localR.col1.x * hX + localR.col2.x * hY;
            tVec.y = localR.col1.y * hX + localR.col2.y * hY;
            tVec = this.m_vertices[1] = new b2Vec2();
            tVec.x = localR.col1.x * -hX + localR.col2.x * hY;
            tVec.y = localR.col1.y * -hX + localR.col2.y * hY;
            tVec = this.m_vertices[2] = new b2Vec2();
            tVec.x = localR.col1.x * -hX + localR.col2.x * -hY;
            tVec.y = localR.col1.y * -hX + localR.col2.y * -hY;
            tVec = this.m_vertices[3] = new b2Vec2();
            tVec.x = localR.col1.x * hX + localR.col2.x * -hY;
            tVec.y = localR.col1.y * hX + localR.col2.y * -hY;
            tVec = this.m_coreVertices[0] = new b2Vec2();
            tVec.x = localR.col1.x * hcX + localR.col2.x * hcY;
            tVec.y = localR.col1.y * hcX + localR.col2.y * hcY;
            tVec = this.m_coreVertices[1] = new b2Vec2();
            tVec.x = localR.col1.x * -hcX + localR.col2.x * hcY;
            tVec.y = localR.col1.y * -hcX + localR.col2.y * hcY;
            tVec = this.m_coreVertices[2] = new b2Vec2();
            tVec.x = localR.col1.x * -hcX + localR.col2.x * -hcY;
            tVec.y = localR.col1.y * -hcX + localR.col2.y * -hcY;
            tVec = this.m_coreVertices[3] = new b2Vec2();
            tVec.x = localR.col1.x * hcX + localR.col2.x * -hcY;
            tVec.y = localR.col1.y * hcX + localR.col2.y * -hcY;
        } else {
            var poly = def;
            this.m_vertexCount = poly.vertexCount;
            b2Shape.PolyCentroid(poly.vertices, poly.vertexCount, b2PolyShape.tempVec);
            var centroidX = b2PolyShape.tempVec.x;
            var centroidY = b2PolyShape.tempVec.y;
            this.m_localCentroid.x = def.localPosition.x + (localR.col1.x * centroidX + localR.col2.x * centroidY) - newOrigin.x;
            this.m_localCentroid.y = def.localPosition.y + (localR.col1.y * centroidX + localR.col2.y * centroidY) - newOrigin.y;
            for (i = 0; i < this.m_vertexCount; ++i) {
                this.m_vertices[i] = new b2Vec2();
                this.m_coreVertices[i] = new b2Vec2();
                hX = poly.vertices[i].x - centroidX;
                hY = poly.vertices[i].y - centroidY;
                this.m_vertices[i].x = localR.col1.x * hX + localR.col2.x * hY;
                this.m_vertices[i].y = localR.col1.y * hX + localR.col2.y * hY;
                var uX = this.m_vertices[i].x;
                var uY = this.m_vertices[i].y;
                var length = Math.sqrt(uX * uX + uY * uY);
                if (length > Number.MIN_VALUE) {
                    uX *= 1.0 / length;
                    uY *= 1.0 / length;
                }
                this.m_coreVertices[i].x = this.m_vertices[i].x - 2.0 * b2Settings.b2_linearSlop * uX;
                this.m_coreVertices[i].y = this.m_vertices[i].y - 2.0 * b2Settings.b2_linearSlop * uY;
            }
        }
        var minVertexX = Number.MAX_VALUE;
        var minVertexY = Number.MAX_VALUE;
        var maxVertexX = -Number.MAX_VALUE;
        var maxVertexY = -Number.MAX_VALUE;
        this.m_maxRadius = 0.0;
        for (i = 0; i < this.m_vertexCount; ++i) {
            var v = this.m_vertices[i];
            minVertexX = Math.min(minVertexX, v.x);
            minVertexY = Math.min(minVertexY, v.y);
            maxVertexX = Math.max(maxVertexX, v.x);
            maxVertexY = Math.max(maxVertexY, v.y);
            this.m_maxRadius = Math.max(this.m_maxRadius, v.Length());
        }
        this.m_localOBB.R.SetIdentity();
        this.m_localOBB.center.Set((minVertexX + maxVertexX) * 0.5, (minVertexY + maxVertexY) * 0.5);
        this.m_localOBB.extents.Set((maxVertexX - minVertexX) * 0.5, (maxVertexY - minVertexY) * 0.5);
        var i1 = 0;
        var i2 = 0;
        for (i = 0; i < this.m_vertexCount; ++i) {
            this.m_normals[i] = new b2Vec2();
            i1 = i;
            i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
            this.m_normals[i].x = this.m_vertices[i2].y - this.m_vertices[i1].y;
            this.m_normals[i].y = -(this.m_vertices[i2].x - this.m_vertices[i1].x);
            this.m_normals[i].Normalize();
        }
        for (i = 0; i < this.m_vertexCount; ++i) {
            i1 = i;
            i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
        }
        this.m_R.SetM(this.m_body.m_R);
        this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y);
        this.m_position.y = this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y);
        b2PolyShape.tAbsR.col1.x = this.m_R.col1.x * this.m_localOBB.R.col1.x + this.m_R.col2.x * this.m_localOBB.R.col1.y;
        b2PolyShape.tAbsR.col1.y = this.m_R.col1.y * this.m_localOBB.R.col1.x + this.m_R.col2.y * this.m_localOBB.R.col1.y;
        b2PolyShape.tAbsR.col2.x = this.m_R.col1.x * this.m_localOBB.R.col2.x + this.m_R.col2.x * this.m_localOBB.R.col2.y;
        b2PolyShape.tAbsR.col2.y = this.m_R.col1.y * this.m_localOBB.R.col2.x + this.m_R.col2.y * this.m_localOBB.R.col2.y;
        b2PolyShape.tAbsR.Abs()
        hX = b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y;
        hY = b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;
        var positionX = this.m_position.x + (this.m_R.col1.x * this.m_localOBB.center.x + this.m_R.col2.x * this.m_localOBB.center.y);
        var positionY = this.m_position.y + (this.m_R.col1.y * this.m_localOBB.center.x + this.m_R.col2.y * this.m_localOBB.center.y);
        aabb.minVertex.x = positionX - hX;
        aabb.minVertex.y = positionY - hY;
        aabb.maxVertex.x = positionX + hX;
        aabb.maxVertex.y = positionY + hY;
        var broadPhase = this.m_body.m_world.m_broadPhase;
        if (broadPhase.InRange(aabb)) {
            this.m_proxyId = broadPhase.CreateProxy(aabb, this);
        } else {
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            this.m_body.Freeze();
        }
    },
    syncAABB: new b2AABB(),
    syncMat: new b2Mat22(),
    Synchronize: function (position1, R1, position2, R2) {
        this.m_R.SetM(R2);
        this.m_position.x = this.m_body.m_position.x + (R2.col1.x * this.m_localCentroid.x + R2.col2.x * this.m_localCentroid.y);
        this.m_position.y = this.m_body.m_position.y + (R2.col1.y * this.m_localCentroid.x + R2.col2.y * this.m_localCentroid.y);
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            return;
        }
        var hX;
        var hY;
        var v1 = R1.col1;
        var v2 = R1.col2;
        var v3 = this.m_localOBB.R.col1;
        var v4 = this.m_localOBB.R.col2;
        this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
        this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
        this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
        this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
        this.syncMat.Abs();
        hX = this.m_localCentroid.x + this.m_localOBB.center.x;
        hY = this.m_localCentroid.y + this.m_localOBB.center.y;
        var centerX = position1.x + (R1.col1.x * hX + R1.col2.x * hY);
        var centerY = position1.y + (R1.col1.y * hX + R1.col2.y * hY);
        hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
        hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
        this.syncAABB.minVertex.x = centerX - hX;
        this.syncAABB.minVertex.y = centerY - hY;
        this.syncAABB.maxVertex.x = centerX + hX;
        this.syncAABB.maxVertex.y = centerY + hY;
        v1 = R2.col1;
        v2 = R2.col2;
        v3 = this.m_localOBB.R.col1;
        v4 = this.m_localOBB.R.col2;
        this.syncMat.col1.x = v1.x * v3.x + v2.x * v3.y;
        this.syncMat.col1.y = v1.y * v3.x + v2.y * v3.y;
        this.syncMat.col2.x = v1.x * v4.x + v2.x * v4.y;
        this.syncMat.col2.y = v1.y * v4.x + v2.y * v4.y;
        this.syncMat.Abs();
        hX = this.m_localCentroid.x + this.m_localOBB.center.x;
        hY = this.m_localCentroid.y + this.m_localOBB.center.y;
        centerX = position2.x + (R2.col1.x * hX + R2.col2.x * hY);
        centerY = position2.y + (R2.col1.y * hX + R2.col2.y * hY);
        hX = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
        hY = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
        this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, centerX - hX);
        this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, centerY - hY);
        this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, centerX + hX);
        this.syncAABB.maxVertex.y = Math.max(this.syncAABB.maxVertex.y, centerY + hY);
        var broadPhase = this.m_body.m_world.m_broadPhase;
        if (broadPhase.InRange(this.syncAABB)) {
            broadPhase.MoveProxy(this.m_proxyId, this.syncAABB);
        } else {
            this.m_body.Freeze();
        }
    },
    QuickSync: function (position, R) {
        this.m_R.SetM(R);
        this.m_position.x = position.x + (R.col1.x * this.m_localCentroid.x + R.col2.x * this.m_localCentroid.y);
        this.m_position.y = position.y + (R.col1.y * this.m_localCentroid.x + R.col2.y * this.m_localCentroid.y);
    },
    ResetProxy: function (broadPhase) {
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            return;
        }
        var proxy = broadPhase.GetProxy(this.m_proxyId);
        broadPhase.DestroyProxy(this.m_proxyId);
        proxy = null;
        var R = b2Math.b2MulMM(this.m_R, this.m_localOBB.R);
        var absR = b2Math.b2AbsM(R);
        var h = b2Math.b2MulMV(absR, this.m_localOBB.extents);
        var position = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
        position.Add(this.m_position);
        var aabb = new b2AABB();
        aabb.minVertex.SetV(position);
        aabb.minVertex.Subtract(h);
        aabb.maxVertex.SetV(position);
        aabb.maxVertex.Add(h);
        if (broadPhase.InRange(aabb)) {
            this.m_proxyId = broadPhase.CreateProxy(aabb, this);
        } else {
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            this.m_body.Freeze();
        }
    },
    Support: function (dX, dY, out) {
        var dLocalX = (dX * this.m_R.col1.x + dY * this.m_R.col1.y);
        var dLocalY = (dX * this.m_R.col2.x + dY * this.m_R.col2.y);
        var bestIndex = 0;
        var bestValue = (this.m_coreVertices[0].x * dLocalX + this.m_coreVertices[0].y * dLocalY);
        for (var i = 1; i < this.m_vertexCount; ++i) {
            var value = (this.m_coreVertices[i].x * dLocalX + this.m_coreVertices[i].y * dLocalY);
            if (value > bestValue) {
                bestIndex = i;
                bestValue = value;
            }
        }
        out.Set(this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[bestIndex].x + this.m_R.col2.x * this.m_coreVertices[bestIndex].y), this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[bestIndex].x + this.m_R.col2.y * this.m_coreVertices[bestIndex].y));
    },
    m_localCentroid: new b2Vec2(),
    m_localOBB: new b2OBB(),
    m_vertices: null,
    m_coreVertices: null,
    m_vertexCount: 0,
    m_normals: null
});
b2PolyShape.tempVec = new b2Vec2();
b2PolyShape.tAbsR = new b2Mat22();
var b2Body = Class.create();
b2Body.prototype = {
    SetOriginPosition: function (position, rotation) {
        if (this.IsFrozen()) {
            return;
        }
        this.m_rotation = rotation;
        this.m_R.Set(this.m_rotation);
        this.m_position = b2Math.AddVV(position, b2Math.b2MulMV(this.m_R, this.m_center));
        this.m_position0.SetV(this.m_position);
        this.m_rotation0 = this.m_rotation;
        for (var s = this.m_shapeList; s != null; s = s.m_next) {
            s.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
        }
        this.m_world.m_broadPhase.Commit();
    },
    GetOriginPosition: function () {
        return b2Math.SubtractVV(this.m_position, b2Math.b2MulMV(this.m_R, this.m_center));
    },
    SetCenterPosition: function (position, rotation) {
        if (this.IsFrozen()) {
            return;
        }
        this.m_rotation = rotation;
        this.m_R.Set(this.m_rotation);
        this.m_position.SetV(position);
        this.m_position0.SetV(this.m_position);
        this.m_rotation0 = this.m_rotation;
        for (var s = this.m_shapeList; s != null; s = s.m_next) {
            s.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
        }
        this.m_world.m_broadPhase.Commit();
    },
    GetCenterPosition: function () {
        return this.m_position;
    },
    GetPosition: function () {
        var x, y;
        x = this.m_position.x;
        y = this.m_position.y;
        if ((this.m_center.x != 0 || this.m_center.y != 0)) {
            x -= this.m_center.x * Math.cos(-this.m_rotation) + this.m_center.y * Math.sin(-this.m_rotation);
            y -= this.m_center.x * -Math.sin(-this.m_rotation) + this.m_center.y * Math.cos(-this.m_rotation);
        }
        return new b2Vec2(x, y);
    },
    GetRotation: function () {
        return this.m_rotation;
    },
    GetRotationMatrix: function () {
        return this.m_R;
    },
    SetLinearVelocity: function (v) {
        this.m_linearVelocity.SetV(v);
    },
    GetLinearVelocity: function () {
        return this.m_linearVelocity;
    },
    SetAngularVelocity: function (w) {
        this.m_angularVelocity = w;
    },
    GetAngularVelocity: function () {
        return this.m_angularVelocity;
    },
    ApplyForce: function (force, point) {
        if (this.IsSleeping() == false) {
            this.m_force.Add(force);
            this.m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(point, this.m_position), force);
        }
    },
    ApplyTorque: function (torque) {
        if (this.IsSleeping() == false) {
            this.m_torque += torque;
        }
    },
    ApplyImpulse: function (impulse, point) {
        if (this.IsSleeping() == false) {
            this.m_linearVelocity.Add(b2Math.MulFV(this.m_invMass, impulse));
            this.m_angularVelocity += (this.m_invI * b2Math.b2CrossVV(b2Math.SubtractVV(point, this.m_position), impulse));
        }
    },
    GetMass: function () {
        return this.m_mass;
    },
    GetInertia: function () {
        return this.m_I;
    },
    GetWorldPoint: function (localPoint) {
        return b2Math.AddVV(this.m_position, b2Math.b2MulMV(this.m_R, localPoint));
    },
    GetWorldVector: function (localVector) {
        return b2Math.b2MulMV(this.m_R, localVector);
    },
    GetLocalPoint: function (worldPoint) {
        return b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(worldPoint, this.m_position));
    },
    GetLocalVector: function (worldVector) {
        return b2Math.b2MulTMV(this.m_R, worldVector);
    },
    IsStatic: function () {
        return (this.m_flags & b2Body.e_staticFlag) == b2Body.e_staticFlag;
    },
    IsFrozen: function () {
        return (this.m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag;
    },
    IsSleeping: function () {
        return (this.m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag;
    },
    AllowSleeping: function (flag) {
        if (flag) {
            this.m_flags |= b2Body.e_allowSleepFlag;
        } else {
            this.m_flags &= ~b2Body.e_allowSleepFlag;
            this.WakeUp();
        }
    },
    WakeUp: function () {
        this.m_flags &= ~b2Body.e_sleepFlag;
        this.m_sleepTime = 0.0;
    },
    GoToSleep: function () {
        this.m_flags |= b2Body.e_sleepFlag;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0.0;
    },
    GetShapeList: function () {
        return this.m_shapeList;
    },
    GetContactList: function () {
        return this.m_contactList;
    },
    GetJointList: function () {
        return this.m_jointList;
    },
    GetNext: function () {
        return this.m_next;
    },
    GetUserData: function () {
        return this.m_userData;
    },
    initialize: function (bd, world) {
        this.sMat0 = new b2Mat22();
        this.m_position = new b2Vec2();
        this.m_R = new b2Mat22(0);
        this.m_position0 = new b2Vec2();
        var i = 0;
        var sd;
        var massData;
        this.m_flags = 0;
        this.m_position.SetV(bd.position);
        this.m_rotation = bd.rotation;
        this.m_R.Set(this.m_rotation);
        this.m_position0.SetV(this.m_position);
        this.m_rotation0 = this.m_rotation;
        this.m_world = world;
        this.m_linearDamping = b2Math.b2Clamp(1.0 - bd.linearDamping, 0.0, 1.0);
        this.m_angularDamping = b2Math.b2Clamp(1.0 - bd.angularDamping, 0.0, 1.0);
        this.m_force = new b2Vec2(0.0, 0.0);
        this.m_torque = 0.0;
        this.m_mass = 0.0;
        var massDatas = new Array(b2Settings.b2_maxShapesPerBody);
        for (i = 0; i < b2Settings.b2_maxShapesPerBody; i++) {
            massDatas[i] = new b2MassData();
        }
        this.m_shapeCount = 0;
        this.m_center = new b2Vec2(0.0, 0.0);
        for (i = 0; i < b2Settings.b2_maxShapesPerBody; ++i) {
            sd = bd.shapes[i];
            if (sd == null) break;
            massData = massDatas[i];
            sd.ComputeMass(massData);
            this.m_mass += massData.mass;
            this.m_center.x += massData.mass * (sd.localPosition.x + massData.center.x);
            this.m_center.y += massData.mass * (sd.localPosition.y + massData.center.y);
            ++this.m_shapeCount;
        }
        if (this.m_mass > 0.0) {
            this.m_center.Multiply(1.0 / this.m_mass);
            this.m_position.Add(b2Math.b2MulMV(this.m_R, this.m_center));
        } else {
            this.m_flags |= b2Body.e_staticFlag;
        }
        this.m_I = 0.0;
        for (i = 0; i < this.m_shapeCount; ++i) {
            sd = bd.shapes[i];
            massData = massDatas[i];
            this.m_I += massData.I;
            var r = b2Math.SubtractVV(b2Math.AddVV(sd.localPosition, massData.center), this.m_center);
            this.m_I += massData.mass * b2Math.b2Dot(r, r);
        }
        if (this.m_mass > 0.0) {
            this.m_invMass = 1.0 / this.m_mass;
        } else {
            this.m_invMass = 0.0;
        }
        if (this.m_I > 0.0 && bd.preventRotation == false) {
            this.m_invI = 1.0 / this.m_I;
        } else {
            this.m_I = 0.0;
            this.m_invI = 0.0;
        }
        this.m_linearVelocity = b2Math.AddVV(bd.linearVelocity, b2Math.b2CrossFV(bd.angularVelocity, this.m_center));
        this.m_angularVelocity = bd.angularVelocity;
        this.m_jointList = null;
        this.m_contactList = null;
        this.m_prev = null;
        this.m_next = null;
        this.m_shapeList = null;
        for (i = 0; i < this.m_shapeCount; ++i) {
            sd = bd.shapes[i];
            var shape = b2Shape.Create(sd, this, this.m_center);
            shape.m_next = this.m_shapeList;
            this.m_shapeList = shape;
        }
        this.m_sleepTime = 0.0;
        if (bd.allowSleep) {
            this.m_flags |= b2Body.e_allowSleepFlag;
        }
        if (bd.isSleeping) {
            this.m_flags |= b2Body.e_sleepFlag;
        }
        if ((this.m_flags & b2Body.e_sleepFlag) || this.m_invMass == 0.0) {
            this.m_linearVelocity.Set(0.0, 0.0);
            this.m_angularVelocity = 0.0;
        }
        this.m_userData = bd.userData;
    },
    Destroy: function () {
        var s = this.m_shapeList;
        while (s) {
            var s0 = s;
            s = s.m_next;
            b2Shape.Destroy(s0);
        }
    },
    sMat0: new b2Mat22(),
    SynchronizeShapes: function () {
        this.sMat0.Set(this.m_rotation0);
        for (var s = this.m_shapeList; s != null; s = s.m_next) {
            s.Synchronize(this.m_position0, this.sMat0, this.m_position, this.m_R);
        }
    },
    QuickSyncShapes: function () {
        for (var s = this.m_shapeList; s != null; s = s.m_next) {
            s.QuickSync(this.m_position, this.m_R);
        }
    },
    IsConnected: function (other) {
        for (var jn = this.m_jointList; jn != null; jn = jn.next) {
            if (jn.other == other)
                return jn.joint.m_collideConnected == false;
        }
        return false;
    },
    Freeze: function () {
        this.m_flags |= b2Body.e_frozenFlag;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0.0;
        for (var s = this.m_shapeList; s != null; s = s.m_next) {
            s.DestroyProxy();
        }
    },
    m_flags: 0,
    m_position: new b2Vec2(),
    m_rotation: null,
    m_R: new b2Mat22(0),
    m_position0: new b2Vec2(),
    m_rotation0: null,
    m_linearVelocity: null,
    m_angularVelocity: null,
    m_force: null,
    m_torque: null,
    m_center: null,
    m_world: null,
    m_prev: null,
    m_next: null,
    m_shapeList: null,
    m_shapeCount: 0,
    m_jointList: null,
    m_contactList: null,
    m_mass: null,
    m_invMass: null,
    m_I: null,
    m_invI: null,
    m_linearDamping: null,
    m_angularDamping: null,
    m_sleepTime: null,
    m_userData: null
};
b2Body.e_staticFlag = 0x0001;
b2Body.e_frozenFlag = 0x0002;
b2Body.e_islandFlag = 0x0004;
b2Body.e_sleepFlag = 0x0008;
b2Body.e_allowSleepFlag = 0x0010;
b2Body.e_destroyFlag = 0x0020;
var b2BodyDef = Class.create();
b2BodyDef.prototype = {
    initialize: function () {
        this.shapes = new Array();
        this.userData = null;
        for (var i = 0; i < b2Settings.b2_maxShapesPerBody; i++) {
            this.shapes[i] = null;
        }
        this.position = new b2Vec2(0.0, 0.0);
        this.rotation = 0.0;
        this.linearVelocity = new b2Vec2(0.0, 0.0);
        this.angularVelocity = 0.0;
        this.linearDamping = 0.0;
        this.angularDamping = 0.0;
        this.allowSleep = true;
        this.isSleeping = false;
        this.preventRotation = false;
    },
    userData: null,
    shapes: new Array(),
    position: null,
    rotation: null,
    linearVelocity: null,
    angularVelocity: null,
    linearDamping: null,
    angularDamping: null,
    allowSleep: null,
    isSleeping: null,
    preventRotation: null,
    AddShape: function (shape) {
        for (var i = 0; i < b2Settings.b2_maxShapesPerBody; ++i) {
            if (this.shapes[i] == null) {
                this.shapes[i] = shape;
                break;
            }
        }
    }
};
var b2CollisionFilter = Class.create();
b2CollisionFilter.prototype = {
    ShouldCollide: function (shape1, shape2) {
        if (shape1.m_groupIndex == shape2.m_groupIndex && shape1.m_groupIndex != 0) {
            return shape1.m_groupIndex > 0;
        }
        var collide = (shape1.m_maskBits & shape2.m_categoryBits) != 0 && (shape1.m_categoryBits & shape2.m_maskBits) != 0;
        return collide;
    },
    initialize: function () {}
};
b2CollisionFilter.b2_defaultFilter = new b2CollisionFilter;
var b2Island = Class.create();
b2Island.prototype = {
    initialize: function (bodyCapacity, contactCapacity, jointCapacity, allocator) {
        var i = 0;
        this.m_bodyCapacity = bodyCapacity;
        this.m_contactCapacity = contactCapacity;
        this.m_jointCapacity = jointCapacity;
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
        this.m_bodies = new Array(bodyCapacity);
        for (i = 0; i < bodyCapacity; i++)
            this.m_bodies[i] = null;
        this.m_contacts = new Array(contactCapacity);
        for (i = 0; i < contactCapacity; i++)
            this.m_contacts[i] = null;
        this.m_joints = new Array(jointCapacity);
        for (i = 0; i < jointCapacity; i++)
            this.m_joints[i] = null;
        this.m_allocator = allocator;
    },
    Clear: function () {
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
    },
    Solve: function (step, gravity) {
        var i = 0;
        var b;
        for (i = 0; i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.m_invMass == 0.0)
                continue;
            b.m_linearVelocity.Add(b2Math.MulFV(step.dt, b2Math.AddVV(gravity, b2Math.MulFV(b.m_invMass, b.m_force))));
            b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
            b.m_linearVelocity.Multiply(b.m_linearDamping);
            b.m_angularVelocity *= b.m_angularDamping;
            b.m_position0.SetV(b.m_position);
            b.m_rotation0 = b.m_rotation;
        }
        var contactSolver = new b2ContactSolver(this.m_contacts, this.m_contactCount, this.m_allocator);
        contactSolver.PreSolve();
        for (i = 0; i < this.m_jointCount; ++i) {
            this.m_joints[i].PrepareVelocitySolver();
        }
        for (i = 0; i < step.iterations; ++i) {
            contactSolver.SolveVelocityConstraints();
            for (var j = 0; j < this.m_jointCount; ++j) {
                this.m_joints[j].SolveVelocityConstraints(step);
            }
        }
        for (i = 0; i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.m_invMass == 0.0)
                continue;
            b.m_position.x += step.dt * b.m_linearVelocity.x;
            b.m_position.y += step.dt * b.m_linearVelocity.y;
            b.m_rotation += step.dt * b.m_angularVelocity;
            b.m_R.Set(b.m_rotation);
        }
        for (i = 0; i < this.m_jointCount; ++i) {
            this.m_joints[i].PreparePositionSolver();
        }
        if (b2World.s_enablePositionCorrection) {
            for (b2Island.m_positionIterationCount = 0; b2Island.m_positionIterationCount < step.iterations; ++b2Island.m_positionIterationCount) {
                var contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
                var jointsOkay = true;
                for (i = 0; i < this.m_jointCount; ++i) {
                    var jointOkay = this.m_joints[i].SolvePositionConstraints();
                    jointsOkay = jointsOkay && jointOkay;
                }
                if (contactsOkay && jointsOkay) {
                    break;
                }
            }
        }
        contactSolver.PostSolve();
        for (i = 0; i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.m_invMass == 0.0)
                continue;
            b.m_R.Set(b.m_rotation);
            b.SynchronizeShapes();
            b.m_force.Set(0.0, 0.0);
            b.m_torque = 0.0;
        }
    },
    UpdateSleep: function (dt) {
        var i = 0;
        var b;
        var minSleepTime = Number.MAX_VALUE;
        var linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
        var angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
        for (i = 0; i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.m_invMass == 0.0) {
                continue;
            }
            if ((b.m_flags & b2Body.e_allowSleepFlag) == 0) {
                b.m_sleepTime = 0.0;
                minSleepTime = 0.0;
            }
            if ((b.m_flags & b2Body.e_allowSleepFlag) == 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2Math.b2Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
                b.m_sleepTime = 0.0;
                minSleepTime = 0.0;
            } else {
                b.m_sleepTime += dt;
                minSleepTime = b2Math.b2Min(minSleepTime, b.m_sleepTime);
            }
        }
        if (minSleepTime >= b2Settings.b2_timeToSleep) {
            for (i = 0; i < this.m_bodyCount; ++i) {
                b = this.m_bodies[i];
                b.m_flags |= b2Body.e_sleepFlag;
                b.m_linearVelocity.SetZero();
                b.m_angularVelocity = 0.0;
            }
        }
    },
    AddBody: function (body) {
        this.m_bodies[this.m_bodyCount++] = body;
    },
    AddContact: function (contact) {
        this.m_contacts[this.m_contactCount++] = contact;
    },
    AddJoint: function (joint) {
        this.m_joints[this.m_jointCount++] = joint;
    },
    m_allocator: null,
    m_bodies: null,
    m_contacts: null,
    m_joints: null,
    m_bodyCount: 0,
    m_jointCount: 0,
    m_contactCount: 0,
    m_bodyCapacity: 0,
    m_contactCapacity: 0,
    m_jointCapacity: 0,
    m_positionError: null
};
b2Island.m_positionIterationCount = 0;
var b2TimeStep = Class.create();
b2TimeStep.prototype = {
    dt: null,
    inv_dt: null,
    iterations: 0,
    initialize: function () {}
};
var b2ContactNode = Class.create();
b2ContactNode.prototype = {
    other: null,
    contact: null,
    prev: null,
    next: null,
    initialize: function () {}
};
var b2Contact = Class.create();
b2Contact.prototype = {
    GetManifolds: function () {
        return null
    },
    GetManifoldCount: function () {
        return this.m_manifoldCount;
    },
    GetNext: function () {
        return this.m_next;
    },
    GetShape1: function () {
        return this.m_shape1;
    },
    GetShape2: function () {
        return this.m_shape2;
    },
    initialize: function (s1, s2) {
        this.m_node1 = new b2ContactNode();
        this.m_node2 = new b2ContactNode();
        this.m_flags = 0;
        if (!s1 || !s2) {
            this.m_shape1 = null;
            this.m_shape2 = null;
            return;
        }
        this.m_shape1 = s1;
        this.m_shape2 = s2;
        this.m_manifoldCount = 0;
        this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
        this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);
        this.m_prev = null;
        this.m_next = null;
        this.m_node1.contact = null;
        this.m_node1.prev = null;
        this.m_node1.next = null;
        this.m_node1.other = null;
        this.m_node2.contact = null;
        this.m_node2.prev = null;
        this.m_node2.next = null;
        this.m_node2.other = null;
    },
    Evaluate: function () {},
    m_flags: 0,
    m_prev: null,
    m_next: null,
    m_node1: new b2ContactNode(),
    m_node2: new b2ContactNode(),
    m_shape1: null,
    m_shape2: null,
    m_manifoldCount: 0,
    m_friction: null,
    m_restitution: null
};
b2Contact.e_islandFlag = 0x0001;
b2Contact.e_destroyFlag = 0x0002;
b2Contact.AddType = function (createFcn, destroyFcn, type1, type2) {
    b2Contact.s_registers[type1][type2].createFcn = createFcn;
    b2Contact.s_registers[type1][type2].destroyFcn = destroyFcn;
    b2Contact.s_registers[type1][type2].primary = true;
    if (type1 != type2) {
        b2Contact.s_registers[type2][type1].createFcn = createFcn;
        b2Contact.s_registers[type2][type1].destroyFcn = destroyFcn;
        b2Contact.s_registers[type2][type1].primary = false;
    }
};
b2Contact.InitializeRegisters = function () {
    b2Contact.s_registers = new Array(b2Shape.e_shapeTypeCount);
    for (var i = 0; i < b2Shape.e_shapeTypeCount; i++) {
        b2Contact.s_registers[i] = new Array(b2Shape.e_shapeTypeCount);
        for (var j = 0; j < b2Shape.e_shapeTypeCount; j++) {
            b2Contact.s_registers[i][j] = new b2ContactRegister();
        }
    }
    b2Contact.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
    b2Contact.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polyShape, b2Shape.e_circleShape);
    b2Contact.AddType(b2PolyContact.Create, b2PolyContact.Destroy, b2Shape.e_polyShape, b2Shape.e_polyShape);
};
b2Contact.Create = function (shape1, shape2, allocator) {
    if (b2Contact.s_initialized == false) {
        b2Contact.InitializeRegisters();
        b2Contact.s_initialized = true;
    }
    var type1 = shape1.m_type;
    var type2 = shape2.m_type;
    var createFcn = b2Contact.s_registers[type1][type2].createFcn;
    if (createFcn) {
        if (b2Contact.s_registers[type1][type2].primary) {
            return createFcn(shape1, shape2, allocator);
        } else {
            var c = createFcn(shape2, shape1, allocator);
            for (var i = 0; i < c.GetManifoldCount(); ++i) {
                var m = c.GetManifolds()[i];
                m.normal = m.normal.Negative();
            }
            return c;
        }
    } else {
        return null;
    }
};
b2Contact.Destroy = function (contact, allocator) {
    if (contact.GetManifoldCount() > 0) {
        contact.m_shape1.m_body.WakeUp();
        contact.m_shape2.m_body.WakeUp();
    }
    var type1 = contact.m_shape1.m_type;
    var type2 = contact.m_shape2.m_type;
    var destroyFcn = b2Contact.s_registers[type1][type2].destroyFcn;
    destroyFcn(contact, allocator);
};
b2Contact.s_registers = null;
b2Contact.s_initialized = false;
var b2ContactConstraint = Class.create();
b2ContactConstraint.prototype = {
    initialize: function () {
        this.normal = new b2Vec2();
        this.points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.points[i] = new b2ContactConstraintPoint();
        }
    },
    points: null,
    normal: new b2Vec2(),
    manifold: null,
    body1: null,
    body2: null,
    friction: null,
    restitution: null,
    pointCount: 0
};
var b2ContactConstraintPoint = Class.create();
b2ContactConstraintPoint.prototype = {
    localAnchor1: new b2Vec2(),
    localAnchor2: new b2Vec2(),
    normalImpulse: null,
    tangentImpulse: null,
    positionImpulse: null,
    normalMass: null,
    tangentMass: null,
    separation: null,
    velocityBias: null,
    initialize: function () {
        this.localAnchor1 = new b2Vec2();
        this.localAnchor2 = new b2Vec2();
    }
};
var b2ContactRegister = Class.create();
b2ContactRegister.prototype = {
    createFcn: null,
    destroyFcn: null,
    primary: null,
    initialize: function () {}
};
var b2ContactSolver = Class.create();
b2ContactSolver.prototype = {
    initialize: function (contacts, contactCount, allocator) {
        this.m_constraints = new Array();
        this.m_allocator = allocator;
        var i = 0;
        var tVec;
        var tMat;
        this.m_constraintCount = 0;
        for (i = 0; i < contactCount; ++i) {
            this.m_constraintCount += contacts[i].GetManifoldCount();
        }
        for (i = 0; i < this.m_constraintCount; i++) {
            this.m_constraints[i] = new b2ContactConstraint();
        }
        var count = 0;
        for (i = 0; i < contactCount; ++i) {
            var contact = contacts[i];
            var b1 = contact.m_shape1.m_body;
            var b2 = contact.m_shape2.m_body;
            var manifoldCount = contact.GetManifoldCount();
            var manifolds = contact.GetManifolds();
            var friction = contact.m_friction;
            var restitution = contact.m_restitution;
            var v1X = b1.m_linearVelocity.x;
            var v1Y = b1.m_linearVelocity.y;
            var v2X = b2.m_linearVelocity.x;
            var v2Y = b2.m_linearVelocity.y;
            var w1 = b1.m_angularVelocity;
            var w2 = b2.m_angularVelocity;
            for (var j = 0; j < manifoldCount; ++j) {
                var manifold = manifolds[j];
                var normalX = manifold.normal.x;
                var normalY = manifold.normal.y;
                var c = this.m_constraints[count];
                c.body1 = b1;
                c.body2 = b2;
                c.manifold = manifold;
                c.normal.x = normalX;
                c.normal.y = normalY;
                c.pointCount = manifold.pointCount;
                c.friction = friction;
                c.restitution = restitution;
                for (var k = 0; k < c.pointCount; ++k) {
                    var cp = manifold.points[k];
                    var ccp = c.points[k];
                    ccp.normalImpulse = cp.normalImpulse;
                    ccp.tangentImpulse = cp.tangentImpulse;
                    ccp.separation = cp.separation;
                    var r1X = cp.position.x - b1.m_position.x;
                    var r1Y = cp.position.y - b1.m_position.y;
                    var r2X = cp.position.x - b2.m_position.x;
                    var r2Y = cp.position.y - b2.m_position.y;
                    tVec = ccp.localAnchor1;
                    tMat = b1.m_R;
                    tVec.x = r1X * tMat.col1.x + r1Y * tMat.col1.y;
                    tVec.y = r1X * tMat.col2.x + r1Y * tMat.col2.y;
                    tVec = ccp.localAnchor2;
                    tMat = b2.m_R;
                    tVec.x = r2X * tMat.col1.x + r2Y * tMat.col1.y;
                    tVec.y = r2X * tMat.col2.x + r2Y * tMat.col2.y;
                    var r1Sqr = r1X * r1X + r1Y * r1Y;
                    var r2Sqr = r2X * r2X + r2Y * r2Y;
                    var rn1 = r1X * normalX + r1Y * normalY;
                    var rn2 = r2X * normalX + r2Y * normalY;
                    var kNormal = b1.m_invMass + b2.m_invMass;
                    kNormal += b1.m_invI * (r1Sqr - rn1 * rn1) + b2.m_invI * (r2Sqr - rn2 * rn2);
                    ccp.normalMass = 1.0 / kNormal;
                    var tangentX = normalY
                    var tangentY = -normalX;
                    var rt1 = r1X * tangentX + r1Y * tangentY;
                    var rt2 = r2X * tangentX + r2Y * tangentY;
                    var kTangent = b1.m_invMass + b2.m_invMass;
                    kTangent += b1.m_invI * (r1Sqr - rt1 * rt1) + b2.m_invI * (r2Sqr - rt2 * rt2);
                    ccp.tangentMass = 1.0 / kTangent;
                    ccp.velocityBias = 0.0;
                    if (ccp.separation > 0.0) {
                        ccp.velocityBias = -60.0 * ccp.separation;
                    }
                    var tX = v2X + (-w2 * r2Y) - v1X - (-w1 * r1Y);
                    var tY = v2Y + (w2 * r2X) - v1Y - (w1 * r1X);
                    var vRel = c.normal.x * tX + c.normal.y * tY;
                    if (vRel < -b2Settings.b2_velocityThreshold) {
                        ccp.velocityBias += -c.restitution * vRel;
                    }
                }
                ++count;
            }
        }
    },
    PreSolve: function () {
        var tVec;
        var tVec2;
        var tMat;
        for (var i = 0; i < this.m_constraintCount; ++i) {
            var c = this.m_constraints[i];
            var b1 = c.body1;
            var b2 = c.body2;
            var invMass1 = b1.m_invMass;
            var invI1 = b1.m_invI;
            var invMass2 = b2.m_invMass;
            var invI2 = b2.m_invI;
            var normalX = c.normal.x;
            var normalY = c.normal.y;
            var tangentX = normalY;
            var tangentY = -normalX;
            var j = 0;
            var tCount = 0;
            if (b2World.s_enableWarmStarting) {
                tCount = c.pointCount;
                for (j = 0; j < tCount; ++j) {
                    var ccp = c.points[j];
                    var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
                    var PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
                    tMat = b1.m_R;
                    tVec = ccp.localAnchor1;
                    var r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    var r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    tMat = b2.m_R;
                    tVec = ccp.localAnchor2;
                    var r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    var r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    b1.m_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
                    b1.m_linearVelocity.x -= invMass1 * PX;
                    b1.m_linearVelocity.y -= invMass1 * PY;
                    b2.m_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
                    b2.m_linearVelocity.x += invMass2 * PX;
                    b2.m_linearVelocity.y += invMass2 * PY;
                    ccp.positionImpulse = 0.0;
                }
            } else {
                tCount = c.pointCount;
                for (j = 0; j < tCount; ++j) {
                    var ccp2 = c.points[j];
                    ccp2.normalImpulse = 0.0;
                    ccp2.tangentImpulse = 0.0;
                    ccp2.positionImpulse = 0.0;
                }
            }
        }
    },
    SolveVelocityConstraints: function () {
        var j = 0;
        var ccp;
        var r1X;
        var r1Y;
        var r2X;
        var r2Y;
        var dvX;
        var dvY;
        var lambda;
        var newImpulse;
        var PX;
        var PY;
        var tMat;
        var tVec;
        for (var i = 0; i < this.m_constraintCount; ++i) {
            var c = this.m_constraints[i];
            var b1 = c.body1;
            var b2 = c.body2;
            var b1_angularVelocity = b1.m_angularVelocity;
            var b1_linearVelocity = b1.m_linearVelocity;
            var b2_angularVelocity = b2.m_angularVelocity;
            var b2_linearVelocity = b2.m_linearVelocity;
            var invMass1 = b1.m_invMass;
            var invI1 = b1.m_invI;
            var invMass2 = b2.m_invMass;
            var invI2 = b2.m_invI;
            var normalX = c.normal.x;
            var normalY = c.normal.y;
            var tangentX = normalY;
            var tangentY = -normalX;
            var tCount = c.pointCount;
            for (j = 0; j < tCount; ++j) {
                ccp = c.points[j];
                tMat = b1.m_R;
                tVec = ccp.localAnchor1;
                r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
                r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y
                tMat = b2.m_R;
                tVec = ccp.localAnchor2;
                r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
                r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y
                dvX = b2_linearVelocity.x + (-b2_angularVelocity * r2Y) - b1_linearVelocity.x - (-b1_angularVelocity * r1Y);
                dvY = b2_linearVelocity.y + (b2_angularVelocity * r2X) - b1_linearVelocity.y - (b1_angularVelocity * r1X);
                var vn = dvX * normalX + dvY * normalY;
                lambda = -ccp.normalMass * (vn - ccp.velocityBias);
                newImpulse = b2Math.b2Max(ccp.normalImpulse + lambda, 0.0);
                lambda = newImpulse - ccp.normalImpulse;
                PX = lambda * normalX;
                PY = lambda * normalY;
                b1_linearVelocity.x -= invMass1 * PX;
                b1_linearVelocity.y -= invMass1 * PY;
                b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
                b2_linearVelocity.x += invMass2 * PX;
                b2_linearVelocity.y += invMass2 * PY;
                b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
                ccp.normalImpulse = newImpulse;
                dvX = b2_linearVelocity.x + (-b2_angularVelocity * r2Y) - b1_linearVelocity.x - (-b1_angularVelocity * r1Y);
                dvY = b2_linearVelocity.y + (b2_angularVelocity * r2X) - b1_linearVelocity.y - (b1_angularVelocity * r1X);
                var vt = dvX * tangentX + dvY * tangentY;
                lambda = ccp.tangentMass * (-vt);
                var maxFriction = c.friction * ccp.normalImpulse;
                newImpulse = b2Math.b2Clamp(ccp.tangentImpulse + lambda, -maxFriction, maxFriction);
                lambda = newImpulse - ccp.tangentImpulse;
                PX = lambda * tangentX;
                PY = lambda * tangentY;
                b1_linearVelocity.x -= invMass1 * PX;
                b1_linearVelocity.y -= invMass1 * PY;
                b1_angularVelocity -= invI1 * (r1X * PY - r1Y * PX);
                b2_linearVelocity.x += invMass2 * PX;
                b2_linearVelocity.y += invMass2 * PY;
                b2_angularVelocity += invI2 * (r2X * PY - r2Y * PX);
                ccp.tangentImpulse = newImpulse;
            }
            b1.m_angularVelocity = b1_angularVelocity;
            b2.m_angularVelocity = b2_angularVelocity;
        }
    },
    SolvePositionConstraints: function (beta) {
        var minSeparation = 0.0;
        var tMat;
        var tVec;
        for (var i = 0; i < this.m_constraintCount; ++i) {
            var c = this.m_constraints[i];
            var b1 = c.body1;
            var b2 = c.body2;
            var b1_position = b1.m_position;
            var b1_rotation = b1.m_rotation;
            var b2_position = b2.m_position;
            var b2_rotation = b2.m_rotation;
            var invMass1 = b1.m_invMass;
            var invI1 = b1.m_invI;
            var invMass2 = b2.m_invMass;
            var invI2 = b2.m_invI;
            var normalX = c.normal.x;
            var normalY = c.normal.y;
            var tangentX = normalY;
            var tangentY = -normalX;
            var tCount = c.pointCount;
            for (var j = 0; j < tCount; ++j) {
                var ccp = c.points[j];
                tMat = b1.m_R;
                tVec = ccp.localAnchor1;
                var r1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
                var r1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y
                tMat = b2.m_R;
                tVec = ccp.localAnchor2;
                var r2X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y
                var r2Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y
                var p1X = b1_position.x + r1X;
                var p1Y = b1_position.y + r1Y;
                var p2X = b2_position.x + r2X;
                var p2Y = b2_position.y + r2Y;
                var dpX = p2X - p1X;
                var dpY = p2Y - p1Y;
                var separation = (dpX * normalX + dpY * normalY) + ccp.separation;
                minSeparation = b2Math.b2Min(minSeparation, separation);
                var C = beta * b2Math.b2Clamp(separation + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
                var dImpulse = -ccp.normalMass * C;
                var impulse0 = ccp.positionImpulse;
                ccp.positionImpulse = b2Math.b2Max(impulse0 + dImpulse, 0.0);
                dImpulse = ccp.positionImpulse - impulse0;
                var impulseX = dImpulse * normalX;
                var impulseY = dImpulse * normalY;
                b1_position.x -= invMass1 * impulseX;
                b1_position.y -= invMass1 * impulseY;
                b1_rotation -= invI1 * (r1X * impulseY - r1Y * impulseX);
                b1.m_R.Set(b1_rotation);
                b2_position.x += invMass2 * impulseX;
                b2_position.y += invMass2 * impulseY;
                b2_rotation += invI2 * (r2X * impulseY - r2Y * impulseX);
                b2.m_R.Set(b2_rotation);
            }
            b1.m_rotation = b1_rotation;
            b2.m_rotation = b2_rotation;
        }
        return minSeparation >= -b2Settings.b2_linearSlop;
    },
    PostSolve: function () {
        for (var i = 0; i < this.m_constraintCount; ++i) {
            var c = this.m_constraints[i];
            var m = c.manifold;
            for (var j = 0; j < c.pointCount; ++j) {
                var mPoint = m.points[j];
                var cPoint = c.points[j];
                mPoint.normalImpulse = cPoint.normalImpulse;
                mPoint.tangentImpulse = cPoint.tangentImpulse;
            }
        }
    },
    m_allocator: null,
    m_constraints: new Array(),
    m_constraintCount: 0
};
var b2CircleContact = Class.create();
Object.extend(b2CircleContact.prototype, b2Contact.prototype);
Object.extend(b2CircleContact.prototype, {
    initialize: function (s1, s2) {
        this.m_node1 = new b2ContactNode();
        this.m_node2 = new b2ContactNode();
        this.m_flags = 0;
        if (!s1 || !s2) {
            this.m_shape1 = null;
            this.m_shape2 = null;
            return;
        }
        this.m_shape1 = s1;
        this.m_shape2 = s2;
        this.m_manifoldCount = 0;
        this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
        this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);
        this.m_prev = null;
        this.m_next = null;
        this.m_node1.contact = null;
        this.m_node1.prev = null;
        this.m_node1.next = null;
        this.m_node1.other = null;
        this.m_node2.contact = null;
        this.m_node2.prev = null;
        this.m_node2.next = null;
        this.m_node2.other = null;
        this.m_manifold = [new b2Manifold()];
        this.m_manifold[0].pointCount = 0;
        this.m_manifold[0].points[0].normalImpulse = 0.0;
        this.m_manifold[0].points[0].tangentImpulse = 0.0;
    },
    Evaluate: function () {
        b2Collision.b2CollideCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
        if (this.m_manifold[0].pointCount > 0) {
            this.m_manifoldCount = 1;
        } else {
            this.m_manifoldCount = 0;
        }
    },
    GetManifolds: function () {
        return this.m_manifold;
    },
    m_manifold: [new b2Manifold()]
});
b2CircleContact.Create = function (shape1, shape2, allocator) {
    return new b2CircleContact(shape1, shape2);
};
b2CircleContact.Destroy = function (contact, allocator) {};
var b2Conservative = Class.create();
b2Conservative.prototype = {
    initialize: function () {}
}
b2Conservative.R1 = new b2Mat22();
b2Conservative.R2 = new b2Mat22();
b2Conservative.x1 = new b2Vec2();
b2Conservative.x2 = new b2Vec2();
b2Conservative.Conservative = function (shape1, shape2) {
    var body1 = shape1.GetBody();
    var body2 = shape2.GetBody();
    var v1X = body1.m_position.x - body1.m_position0.x;
    var v1Y = body1.m_position.y - body1.m_position0.y;
    var omega1 = body1.m_rotation - body1.m_rotation0;
    var v2X = body2.m_position.x - body2.m_position0.x;
    var v2Y = body2.m_position.y - body2.m_position0.y;
    var omega2 = body2.m_rotation - body2.m_rotation0;
    var r1 = shape1.GetMaxRadius();
    var r2 = shape2.GetMaxRadius();
    var p1StartX = body1.m_position0.x;
    var p1StartY = body1.m_position0.y;
    var a1Start = body1.m_rotation0;
    var p2StartX = body2.m_position0.x;
    var p2StartY = body2.m_position0.y;
    var a2Start = body2.m_rotation0;
    var p1X = p1StartX;
    var p1Y = p1StartY;
    var a1 = a1Start;
    var p2X = p2StartX;
    var p2Y = p2StartY;
    var a2 = a2Start;
    b2Conservative.R1.Set(a1);
    b2Conservative.R2.Set(a2);
    shape1.QuickSync(p1, b2Conservative.R1);
    shape2.QuickSync(p2, b2Conservative.R2);
    var s1 = 0.0;
    var maxIterations = 10;
    var dX;
    var dY;
    var invRelativeVelocity = 0.0;
    var hit = true;
    for (var iter = 0; iter < maxIterations; ++iter) {
        var distance = b2Distance.Distance(b2Conservative.x1, b2Conservative.x2, shape1, shape2);
        if (distance < b2Settings.b2_linearSlop) {
            if (iter == 0) {
                hit = false;
            } else {
                hit = true;
            }
            break;
        }
        if (iter == 0) {
            dX = b2Conservative.x2.x - b2Conservative.x1.x;
            dY = b2Conservative.x2.y - b2Conservative.x1.y;
            var dLen = Math.sqrt(dX * dX + dY * dY);
            var relativeVelocity = (dX * (v1X - v2X) + dY * (v1Y - v2Y)) + Math.abs(omega1) * r1 + Math.abs(omega2) * r2;
            if (Math.abs(relativeVelocity) < Number.MIN_VALUE) {
                hit = false;
                break;
            }
            invRelativeVelocity = 1.0 / relativeVelocity;
        }
        var ds = distance * invRelativeVelocity;
        var s2 = s1 + ds;
        if (s2 < 0.0 || 1.0 < s2) {
            hit = false;
            break;
        }
        if (s2 < (1.0 + 100.0 * Number.MIN_VALUE) * s1) {
            hit = true;
            break;
        }
        s1 = s2;
        p1X = p1StartX + s1 * v1.x;
        p1Y = p1StartY + s1 * v1.y;
        a1 = a1Start + s1 * omega1;
        p2X = p2StartX + s1 * v2.x;
        p2Y = p2StartY + s1 * v2.y;
        a2 = a2Start + s1 * omega2;
        b2Conservative.R1.Set(a1);
        b2Conservative.R2.Set(a2);
        shape1.QuickSync(p1, b2Conservative.R1);
        shape2.QuickSync(p2, b2Conservative.R2);
    }
    if (hit) {
        dX = b2Conservative.x2.x - b2Conservative.x1.x;
        dY = b2Conservative.x2.y - b2Conservative.x1.y;
        var length = Math.sqrt(dX * dX + dY * dY);
        if (length > FLT_EPSILON) {
            d *= b2_linearSlop / length;
        }
        if (body1.IsStatic()) {
            body1.m_position.x = p1X;
            body1.m_position.y = p1Y;
        } else {
            body1.m_position.x = p1X - dX;
            body1.m_position.y = p1Y - dY;
        }
        body1.m_rotation = a1;
        body1.m_R.Set(a1);
        body1.QuickSyncShapes();
        if (body2.IsStatic()) {
            body2.m_position.x = p2X;
            body2.m_position.y = p2Y;
        } else {
            body2.m_position.x = p2X + dX;
            body2.m_position.y = p2Y + dY;
        }
        body2.m_position.x = p2X + dX;
        body2.m_position.y = p2Y + dY;
        body2.m_rotation = a2;
        body2.m_R.Set(a2);
        body2.QuickSyncShapes();
        return true;
    }
    shape1.QuickSync(body1.m_position, body1.m_R);
    shape2.QuickSync(body2.m_position, body2.m_R);
    return false;
};
var b2NullContact = Class.create();
Object.extend(b2NullContact.prototype, b2Contact.prototype);
Object.extend(b2NullContact.prototype, {
    initialize: function (s1, s2) {
        this.m_node1 = new b2ContactNode();
        this.m_node2 = new b2ContactNode();
        this.m_flags = 0;
        if (!s1 || !s2) {
            this.m_shape1 = null;
            this.m_shape2 = null;
            return;
        }
        this.m_shape1 = s1;
        this.m_shape2 = s2;
        this.m_manifoldCount = 0;
        this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
        this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);
        this.m_prev = null;
        this.m_next = null;
        this.m_node1.contact = null;
        this.m_node1.prev = null;
        this.m_node1.next = null;
        this.m_node1.other = null;
        this.m_node2.contact = null;
        this.m_node2.prev = null;
        this.m_node2.next = null;
        this.m_node2.other = null;
    },
    Evaluate: function () {},
    GetManifolds: function () {
        return null;
    }
});
var b2PolyAndCircleContact = Class.create();
Object.extend(b2PolyAndCircleContact.prototype, b2Contact.prototype);
Object.extend(b2PolyAndCircleContact.prototype, {
    initialize: function (s1, s2) {
        this.m_node1 = new b2ContactNode();
        this.m_node2 = new b2ContactNode();
        this.m_flags = 0;
        if (!s1 || !s2) {
            this.m_shape1 = null;
            this.m_shape2 = null;
            return;
        }
        this.m_shape1 = s1;
        this.m_shape2 = s2;
        this.m_manifoldCount = 0;
        this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
        this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);
        this.m_prev = null;
        this.m_next = null;
        this.m_node1.contact = null;
        this.m_node1.prev = null;
        this.m_node1.next = null;
        this.m_node1.other = null;
        this.m_node2.contact = null;
        this.m_node2.prev = null;
        this.m_node2.next = null;
        this.m_node2.other = null;
        this.m_manifold = [new b2Manifold()];
        b2Settings.b2Assert(this.m_shape1.m_type == b2Shape.e_polyShape);
        b2Settings.b2Assert(this.m_shape2.m_type == b2Shape.e_circleShape);
        this.m_manifold[0].pointCount = 0;
        this.m_manifold[0].points[0].normalImpulse = 0.0;
        this.m_manifold[0].points[0].tangentImpulse = 0.0;
    },
    Evaluate: function () {
        b2Collision.b2CollidePolyAndCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, false);
        if (this.m_manifold[0].pointCount > 0) {
            this.m_manifoldCount = 1;
        } else {
            this.m_manifoldCount = 0;
        }
    },
    GetManifolds: function () {
        return this.m_manifold;
    },
    m_manifold: [new b2Manifold()]
})
b2PolyAndCircleContact.Create = function (shape1, shape2, allocator) {
    return new b2PolyAndCircleContact(shape1, shape2);
};
b2PolyAndCircleContact.Destroy = function (contact, allocator) {};
var b2PolyContact = Class.create();
Object.extend(b2PolyContact.prototype, b2Contact.prototype);
Object.extend(b2PolyContact.prototype, {
    initialize: function (s1, s2) {
        this.m_node1 = new b2ContactNode();
        this.m_node2 = new b2ContactNode();
        this.m_flags = 0;
        if (!s1 || !s2) {
            this.m_shape1 = null;
            this.m_shape2 = null;
            return;
        }
        this.m_shape1 = s1;
        this.m_shape2 = s2;
        this.m_manifoldCount = 0;
        this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction);
        this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution);
        this.m_prev = null;
        this.m_next = null;
        this.m_node1.contact = null;
        this.m_node1.prev = null;
        this.m_node1.next = null;
        this.m_node1.other = null;
        this.m_node2.contact = null;
        this.m_node2.prev = null;
        this.m_node2.next = null;
        this.m_node2.other = null;
        this.m0 = new b2Manifold();
        this.m_manifold = [new b2Manifold()];
        this.m_manifold[0].pointCount = 0;
    },
    m0: new b2Manifold(),
    Evaluate: function () {
        var tMani = this.m_manifold[0];
        var tPoints = this.m0.points;
        for (var k = 0; k < tMani.pointCount; k++) {
            var tPoint = tPoints[k];
            var tPoint0 = tMani.points[k];
            tPoint.normalImpulse = tPoint0.normalImpulse;
            tPoint.tangentImpulse = tPoint0.tangentImpulse;
            tPoint.id = tPoint0.id.Copy();
        }
        this.m0.pointCount = tMani.pointCount;
        b2Collision.b2CollidePoly(tMani, this.m_shape1, this.m_shape2, false);
        if (tMani.pointCount > 0) {
            var match = [false, false];
            for (var i = 0; i < tMani.pointCount; ++i) {
                var cp = tMani.points[i];
                cp.normalImpulse = 0.0;
                cp.tangentImpulse = 0.0;
                var idKey = cp.id.key;
                for (var j = 0; j < this.m0.pointCount; ++j) {
                    if (match[j] == true)
                        continue;
                    var cp0 = this.m0.points[j];
                    var id0 = cp0.id;
                    if (id0.key == idKey) {
                        match[j] = true;
                        cp.normalImpulse = cp0.normalImpulse;
                        cp.tangentImpulse = cp0.tangentImpulse;
                        break;
                    }
                }
            }
            this.m_manifoldCount = 1;
        } else {
            this.m_manifoldCount = 0;
        }
    },
    GetManifolds: function () {
        return this.m_manifold;
    },
    m_manifold: [new b2Manifold()]
});
b2PolyContact.Create = function (shape1, shape2, allocator) {
    return new b2PolyContact(shape1, shape2);
};
b2PolyContact.Destroy = function (contact, allocator) {};
var b2ContactManager = Class.create();
Object.extend(b2ContactManager.prototype, b2PairCallback.prototype);
Object.extend(b2ContactManager.prototype, {
    initialize: function () {
        this.m_nullContact = new b2NullContact();
        this.m_world = null;
        this.m_destroyImmediate = false;
    },
    PairAdded: function (proxyUserData1, proxyUserData2) {
        var shape1 = proxyUserData1;
        var shape2 = proxyUserData2;
        var body1 = shape1.m_body;
        var body2 = shape2.m_body;
        if (body1.IsStatic() && body2.IsStatic()) {
            return this.m_nullContact;
        }
        if (shape1.m_body == shape2.m_body) {
            return this.m_nullContact;
        }
        if (body2.IsConnected(body1)) {
            return this.m_nullContact;
        }
        if (this.m_world.m_filter != null && this.m_world.m_filter.ShouldCollide(shape1, shape2) == false) {
            return this.m_nullContact;
        }
        if (body2.m_invMass == 0.0) {
            var tempShape = shape1;
            shape1 = shape2;
            shape2 = tempShape;
            var tempBody = body1;
            body1 = body2;
            body2 = tempBody;
        }
        var contact = b2Contact.Create(shape1, shape2, this.m_world.m_blockAllocator);
        if (contact == null) {
            return this.m_nullContact;
        } else {
            contact.m_prev = null;
            contact.m_next = this.m_world.m_contactList;
            if (this.m_world.m_contactList != null) {
                this.m_world.m_contactList.m_prev = contact;
            }
            this.m_world.m_contactList = contact;
            this.m_world.m_contactCount++;
        }
        return contact;
    },
    PairRemoved: function (proxyUserData1, proxyUserData2, pairUserData) {
        if (pairUserData == null) {
            return;
        }
        var c = pairUserData;
        if (c != this.m_nullContact) {
            if (this.m_destroyImmediate == true) {
                this.DestroyContact(c);
                c = null;
            } else {
                c.m_flags |= b2Contact.e_destroyFlag;
            }
        }
    },
    DestroyContact: function (c) {
        if (c.m_prev) {
            c.m_prev.m_next = c.m_next;
        }
        if (c.m_next) {
            c.m_next.m_prev = c.m_prev;
        }
        if (c == this.m_world.m_contactList) {
            this.m_world.m_contactList = c.m_next;
        }
        if (c.GetManifoldCount() > 0) {
            var body1 = c.m_shape1.m_body;
            var body2 = c.m_shape2.m_body;
            var node1 = c.m_node1;
            var node2 = c.m_node2;
            body1.WakeUp();
            body2.WakeUp();
            if (node1.prev) {
                node1.prev.next = node1.next;
            }
            if (node1.next) {
                node1.next.prev = node1.prev;
            }
            if (node1 == body1.m_contactList) {
                body1.m_contactList = node1.next;
            }
            node1.prev = null;
            node1.next = null;
            if (node2.prev) {
                node2.prev.next = node2.next;
            }
            if (node2.next) {
                node2.next.prev = node2.prev;
            }
            if (node2 == body2.m_contactList) {
                body2.m_contactList = node2.next;
            }
            node2.prev = null;
            node2.next = null;
        }
        b2Contact.Destroy(c, this.m_world.m_blockAllocator);
        --this.m_world.m_contactCount;
    },
    CleanContactList: function () {
        var c = this.m_world.m_contactList;
        while (c != null) {
            var c0 = c;
            c = c.m_next;
            if (c0.m_flags & b2Contact.e_destroyFlag) {
                this.DestroyContact(c0);
                c0 = null;
            }
        }
    },
    Collide: function () {
        var body1;
        var body2;
        var node1;
        var node2;
        for (var c = this.m_world.m_contactList; c != null; c = c.m_next) {
            if (c.m_shape1.m_body.IsSleeping() && c.m_shape2.m_body.IsSleeping()) {
                continue;
            }
            var oldCount = c.GetManifoldCount();
            c.Evaluate();
            var newCount = c.GetManifoldCount();
            if (oldCount == 0 && newCount > 0) {
                body1 = c.m_shape1.m_body;
                body2 = c.m_shape2.m_body;
                node1 = c.m_node1;
                node2 = c.m_node2;
                node1.contact = c;
                node1.other = body2;
                node1.prev = null;
                node1.next = body1.m_contactList;
                if (node1.next != null) {
                    node1.next.prev = c.m_node1;
                }
                body1.m_contactList = c.m_node1;
                node2.contact = c;
                node2.other = body1;
                node2.prev = null;
                node2.next = body2.m_contactList;
                if (node2.next != null) {
                    node2.next.prev = node2;
                }
                body2.m_contactList = node2;
            } else if (oldCount > 0 && newCount == 0) {
                body1 = c.m_shape1.m_body;
                body2 = c.m_shape2.m_body;
                node1 = c.m_node1;
                node2 = c.m_node2;
                if (node1.prev) {
                    node1.prev.next = node1.next;
                }
                if (node1.next) {
                    node1.next.prev = node1.prev;
                }
                if (node1 == body1.m_contactList) {
                    body1.m_contactList = node1.next;
                }
                node1.prev = null;
                node1.next = null;
                if (node2.prev) {
                    node2.prev.next = node2.next;
                }
                if (node2.next) {
                    node2.next.prev = node2.prev;
                }
                if (node2 == body2.m_contactList) {
                    body2.m_contactList = node2.next;
                }
                node2.prev = null;
                node2.next = null;
            }
        }
    },
    m_world: null,
    m_nullContact: new b2NullContact(),
    m_destroyImmediate: null
});
var b2World = Class.create();
b2World.prototype = {
    initialize: function (worldAABB, gravity, doSleep) {
        this.step = new b2TimeStep();
        this.m_contactManager = new b2ContactManager();
        this.m_listener = null;
        this.m_filter = b2CollisionFilter.b2_defaultFilter;
        this.m_bodyList = null;
        this.m_contactList = null;
        this.m_jointList = null;
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
        this.m_bodyDestroyList = null;
        this.m_allowSleep = doSleep;
        this.m_gravity = gravity;
        this.m_contactManager.m_world = this;
        this.m_broadPhase = new b2BroadPhase(worldAABB, this.m_contactManager);
        var bd = new b2BodyDef();
        this.m_groundBody = this.CreateBody(bd);
    },
    SetListener: function (listener) {
        this.m_listener = listener;
    },
    SetFilter: function (filter) {
        this.m_filter = filter;
    },
    CreateBody: function (def) {
        var b = new b2Body(def, this);
        b.m_prev = null;
        b.m_next = this.m_bodyList;
        if (this.m_bodyList) {
            this.m_bodyList.m_prev = b;
        }
        this.m_bodyList = b;
        ++this.m_bodyCount;
        return b;
    },
    DestroyBody: function (b) {
        if (b.m_flags & b2Body.e_destroyFlag) {
            return;
        }
        if (b.m_prev) {
            b.m_prev.m_next = b.m_next;
        }
        if (b.m_next) {
            b.m_next.m_prev = b.m_prev;
        }
        if (b == this.m_bodyList) {
            this.m_bodyList = b.m_next;
        }
        b.m_flags |= b2Body.e_destroyFlag;
        --this.m_bodyCount;
        b.m_prev = null;
        b.m_next = this.m_bodyDestroyList;
        this.m_bodyDestroyList = b;
    },
    CleanBodyList: function () {
        this.m_contactManager.m_destroyImmediate = true;
        var b = this.m_bodyDestroyList;
        while (b) {
            var b0 = b;
            b = b.m_next;
            var jn = b0.m_jointList;
            while (jn) {
                var jn0 = jn;
                jn = jn.next;
                if (this.m_listener) {
                    this.m_listener.NotifyJointDestroyed(jn0.joint);
                }
                this.DestroyJoint(jn0.joint);
            }
            b0.Destroy();
        }
        this.m_bodyDestroyList = null;
        this.m_contactManager.m_destroyImmediate = false;
    },
    CreateJoint: function (def) {
        var j = b2Joint.Create(def, this.m_blockAllocator);
        j.m_prev = null;
        j.m_next = this.m_jointList;
        if (this.m_jointList) {
            this.m_jointList.m_prev = j;
        }
        this.m_jointList = j;
        ++this.m_jointCount;
        j.m_node1.joint = j;
        j.m_node1.other = j.m_body2;
        j.m_node1.prev = null;
        j.m_node1.next = j.m_body1.m_jointList;
        if (j.m_body1.m_jointList) j.m_body1.m_jointList.prev = j.m_node1;
        j.m_body1.m_jointList = j.m_node1;
        j.m_node2.joint = j;
        j.m_node2.other = j.m_body1;
        j.m_node2.prev = null;
        j.m_node2.next = j.m_body2.m_jointList;
        if (j.m_body2.m_jointList) j.m_body2.m_jointList.prev = j.m_node2;
        j.m_body2.m_jointList = j.m_node2;
        if (def.collideConnected == false) {
            var b = def.body1.m_shapeCount < def.body2.m_shapeCount ? def.body1 : def.body2;
            for (var s = b.m_shapeList; s; s = s.m_next) {
                s.ResetProxy(this.m_broadPhase);
            }
        }
        return j;
    },
    DestroyJoint: function (j) {
        var collideConnected = j.m_collideConnected;
        if (j.m_prev) {
            j.m_prev.m_next = j.m_next;
        }
        if (j.m_next) {
            j.m_next.m_prev = j.m_prev;
        }
        if (j == this.m_jointList) {
            this.m_jointList = j.m_next;
        }
        var body1 = j.m_body1;
        var body2 = j.m_body2;
        body1.WakeUp();
        body2.WakeUp();
        if (j.m_node1.prev) {
            j.m_node1.prev.next = j.m_node1.next;
        }
        if (j.m_node1.next) {
            j.m_node1.next.prev = j.m_node1.prev;
        }
        if (j.m_node1 == body1.m_jointList) {
            body1.m_jointList = j.m_node1.next;
        }
        j.m_node1.prev = null;
        j.m_node1.next = null;
        if (j.m_node2.prev) {
            j.m_node2.prev.next = j.m_node2.next;
        }
        if (j.m_node2.next) {
            j.m_node2.next.prev = j.m_node2.prev;
        }
        if (j.m_node2 == body2.m_jointList) {
            body2.m_jointList = j.m_node2.next;
        }
        j.m_node2.prev = null;
        j.m_node2.next = null;
        b2Joint.Destroy(j, this.m_blockAllocator);
        --this.m_jointCount;
        if (collideConnected == false) {
            var b = body1.m_shapeCount < body2.m_shapeCount ? body1 : body2;
            for (var s = b.m_shapeList; s; s = s.m_next) {
                s.ResetProxy(this.m_broadPhase);
            }
        }
    },
    GetGroundBody: function () {
        return this.m_groundBody;
    },
    step: new b2TimeStep(),
    Step: function (dt, iterations) {
        var b;
        var other;
        this.step.dt = dt;
        this.step.iterations = iterations;
        if (dt > 0.0) {
            this.step.inv_dt = 1.0 / dt;
        } else {
            this.step.inv_dt = 0.0;
        }
        this.m_positionIterationCount = 0;
        this.m_contactManager.CleanContactList();
        this.CleanBodyList();
        this.m_contactManager.Collide();
        var island = new b2Island(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator);
        for (b = this.m_bodyList; b != null; b = b.m_next) {
            b.m_flags &= ~b2Body.e_islandFlag;
        }
        for (var c = this.m_contactList; c != null; c = c.m_next) {
            c.m_flags &= ~b2Contact.e_islandFlag;
        }
        for (var j = this.m_jointList; j != null; j = j.m_next) {
            j.m_islandFlag = false;
        }
        var stackSize = this.m_bodyCount;
        var stack = new Array(this.m_bodyCount);
        for (var k = 0; k < this.m_bodyCount; k++)
            stack[k] = null;
        for (var seed = this.m_bodyList; seed != null; seed = seed.m_next) {
            if (seed.m_flags & (b2Body.e_staticFlag | b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag)) {
                continue;
            }
            island.Clear();
            var stackCount = 0;
            stack[stackCount++] = seed;
            seed.m_flags |= b2Body.e_islandFlag;;
            while (stackCount > 0) {
                b = stack[--stackCount];
                island.AddBody(b);
                b.m_flags &= ~b2Body.e_sleepFlag;
                if (b.m_flags & b2Body.e_staticFlag) {
                    continue;
                }
                for (var cn = b.m_contactList; cn != null; cn = cn.next) {
                    if (cn.contact.m_flags & b2Contact.e_islandFlag) {
                        continue;
                    }
                    island.AddContact(cn.contact);
                    cn.contact.m_flags |= b2Contact.e_islandFlag;
                    other = cn.other;
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
                for (var jn = b.m_jointList; jn != null; jn = jn.next) {
                    if (jn.joint.m_islandFlag == true) {
                        continue;
                    }
                    island.AddJoint(jn.joint);
                    jn.joint.m_islandFlag = true;
                    other = jn.other;
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
            }
            island.Solve(this.step, this.m_gravity);
            this.m_positionIterationCount = b2Math.b2Max(this.m_positionIterationCount, b2Island.m_positionIterationCount);
            if (this.m_allowSleep) {
                island.UpdateSleep(dt);
            }
            for (var i = 0; i < island.m_bodyCount; ++i) {
                b = island.m_bodies[i];
                if (b.m_flags & b2Body.e_staticFlag) {
                    b.m_flags &= ~b2Body.e_islandFlag;
                }
                if (b.IsFrozen() && this.m_listener) {
                    var response = this.m_listener.NotifyBoundaryViolated(b);
                    if (response == b2WorldListener.b2_destroyBody) {
                        this.DestroyBody(b);
                        b = null;
                        island.m_bodies[i] = null;
                    }
                }
            }
        }
        this.m_broadPhase.Commit();
    },
    Query: function (aabb, shapes, maxCount) {
        var results = new Array();
        var count = this.m_broadPhase.QueryAABB(aabb, results, maxCount);
        for (var i = 0; i < count; ++i) {
            shapes[i] = results[i];
        }
        return count;
    },
    GetBodyList: function () {
        return this.m_bodyList;
    },
    GetJointList: function () {
        return this.m_jointList;
    },
    GetContactList: function () {
        return this.m_contactList;
    },
    m_blockAllocator: null,
    m_stackAllocator: null,
    m_broadPhase: null,
    m_contactManager: new b2ContactManager(),
    m_bodyList: null,
    m_contactList: null,
    m_jointList: null,
    m_bodyCount: 0,
    m_contactCount: 0,
    m_jointCount: 0,
    m_bodyDestroyList: null,
    m_gravity: null,
    m_allowSleep: null,
    m_groundBody: null,
    m_listener: null,
    m_filter: null,
    m_positionIterationCount: 0
};
b2World.s_enablePositionCorrection = 1;
b2World.s_enableWarmStarting = 1;
var b2WorldListener = Class.create();
b2WorldListener.prototype = {
    NotifyJointDestroyed: function (joint) {},
    NotifyBoundaryViolated: function (body) {
        return b2WorldListener.b2_freezeBody;
    },
    initialize: function () {}
};
b2WorldListener.b2_freezeBody = 0;
b2WorldListener.b2_destroyBody = 1;
var b2JointNode = Class.create();
b2JointNode.prototype = {
    other: null,
    joint: null,
    prev: null,
    next: null,
    initialize: function () {}
}
var b2Joint = Class.create();
b2Joint.prototype = {
    GetType: function () {
        return this.m_type;
    },
    GetAnchor1: function () {
        return null
    },
    GetAnchor2: function () {
        return null
    },
    GetReactionForce: function (invTimeStep) {
        return null
    },
    GetReactionTorque: function (invTimeStep) {
        return 0.0
    },
    GetBody1: function () {
        return this.m_body1;
    },
    GetBody2: function () {
        return this.m_body2;
    },
    GetNext: function () {
        return this.m_next;
    },
    GetUserData: function () {
        return this.m_userData;
    },
    initialize: function (def) {
        this.m_node1 = new b2JointNode();
        this.m_node2 = new b2JointNode();
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = def.body1;
        this.m_body2 = def.body2;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
    },
    PrepareVelocitySolver: function () {},
    SolveVelocityConstraints: function (step) {},
    PreparePositionSolver: function () {},
    SolvePositionConstraints: function () {
        return false
    },
    m_type: 0,
    m_prev: null,
    m_next: null,
    m_node1: new b2JointNode(),
    m_node2: new b2JointNode(),
    m_body1: null,
    m_body2: null,
    m_islandFlag: null,
    m_collideConnected: null,
    m_userData: null
};
b2Joint.Create = function (def, allocator) {
    var joint = null;
    switch (def.type) {
    case b2Joint.e_distanceJoint:
        {
            joint = new b2DistanceJoint(def);
        }
        break;
    case b2Joint.e_mouseJoint:
        {
            joint = new b2MouseJoint(def);
        }
        break;
    case b2Joint.e_prismaticJoint:
        {
            joint = new b2PrismaticJoint(def);
        }
        break;
    case b2Joint.e_revoluteJoint:
        {
            joint = new b2RevoluteJoint(def);
        }
        break;
    case b2Joint.e_pulleyJoint:
        {
            joint = new b2PulleyJoint(def);
        }
        break;
    case b2Joint.e_gearJoint:
        {
            joint = new b2GearJoint(def);
        }
        break;
    default:
        break;
    }
    return joint;
};
b2Joint.Destroy = function (joint, allocator) {};
b2Joint.e_unknownJoint = 0;
b2Joint.e_revoluteJoint = 1;
b2Joint.e_prismaticJoint = 2;
b2Joint.e_distanceJoint = 3;
b2Joint.e_pulleyJoint = 4;
b2Joint.e_mouseJoint = 5;
b2Joint.e_gearJoint = 6;
b2Joint.e_inactiveLimit = 0;
b2Joint.e_atLowerLimit = 1;
b2Joint.e_atUpperLimit = 2;
b2Joint.e_equalLimits = 3;
var b2JointDef = Class.create();
b2JointDef.prototype = {
    initialize: function () {
        this.type = b2Joint.e_unknownJoint;
        this.userData = null;
        this.body1 = null;
        this.body2 = null;
        this.collideConnected = false;
    },
    type: 0,
    userData: null,
    body1: null,
    body2: null,
    collideConnected: null
}
var b2DistanceJoint = Class.create();
Object.extend(b2DistanceJoint.prototype, b2Joint.prototype);
Object.extend(b2DistanceJoint.prototype, {
    initialize: function (def) {
        this.m_node1 = new b2JointNode();
        this.m_node2 = new b2JointNode();
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = def.body1;
        this.m_body2 = def.body2;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
        this.m_localAnchor1 = new b2Vec2();
        this.m_localAnchor2 = new b2Vec2();
        this.m_u = new b2Vec2();
        var tMat;
        var tX;
        var tY;
        tMat = this.m_body1.m_R;
        tX = def.anchorPoint1.x - this.m_body1.m_position.x;
        tY = def.anchorPoint1.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y;
        this.m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y;
        tMat = this.m_body2.m_R;
        tX = def.anchorPoint2.x - this.m_body2.m_position.x;
        tY = def.anchorPoint2.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y;
        this.m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y;
        tX = def.anchorPoint2.x - def.anchorPoint1.x;
        tY = def.anchorPoint2.y - def.anchorPoint1.y;
        this.m_length = Math.sqrt(tX * tX + tY * tY);
        this.m_impulse = 0.0;
    },
    PrepareVelocitySolver: function () {
        var tMat;
        tMat = this.m_body1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = this.m_body2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        this.m_u.x = this.m_body2.m_position.x + r2X - this.m_body1.m_position.x - r1X;
        this.m_u.y = this.m_body2.m_position.y + r2Y - this.m_body1.m_position.y - r1Y;
        var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
        if (length > b2Settings.b2_linearSlop) {
            this.m_u.Multiply(1.0 / length);
        } else {
            this.m_u.SetZero();
        }
        var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
        var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
        this.m_mass = this.m_body1.m_invMass + this.m_body1.m_invI * cr1u * cr1u + this.m_body2.m_invMass + this.m_body2.m_invI * cr2u * cr2u;
        this.m_mass = 1.0 / this.m_mass;
        if (b2World.s_enableWarmStarting) {
            var PX = this.m_impulse * this.m_u.x;
            var PY = this.m_impulse * this.m_u.y;
            this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * PX;
            this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * PY;
            this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
            this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * PX;
            this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * PY;
            this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
        } else {
            this.m_impulse = 0.0;
        }
    },
    SolveVelocityConstraints: function (step) {
        var tMat;
        tMat = this.m_body1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = this.m_body2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var v1X = this.m_body1.m_linearVelocity.x + (-this.m_body1.m_angularVelocity * r1Y);
        var v1Y = this.m_body1.m_linearVelocity.y + (this.m_body1.m_angularVelocity * r1X);
        var v2X = this.m_body2.m_linearVelocity.x + (-this.m_body2.m_angularVelocity * r2Y);
        var v2Y = this.m_body2.m_linearVelocity.y + (this.m_body2.m_angularVelocity * r2X);
        var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
        var impulse = -this.m_mass * Cdot;
        this.m_impulse += impulse;
        var PX = impulse * this.m_u.x;
        var PY = impulse * this.m_u.y;
        this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * PX;
        this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * PY;
        this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
        this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * PX;
        this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * PY;
        this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
    },
    SolvePositionConstraints: function () {
        var tMat;
        tMat = this.m_body1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = this.m_body2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var dX = this.m_body2.m_position.x + r2X - this.m_body1.m_position.x - r1X;
        var dY = this.m_body2.m_position.y + r2Y - this.m_body1.m_position.y - r1Y;
        var length = Math.sqrt(dX * dX + dY * dY);
        dX /= length;
        dY /= length;
        var C = length - this.m_length;
        C = b2Math.b2Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        var impulse = -this.m_mass * C;
        this.m_u.Set(dX, dY);
        var PX = impulse * this.m_u.x;
        var PY = impulse * this.m_u.y;
        this.m_body1.m_position.x -= this.m_body1.m_invMass * PX;
        this.m_body1.m_position.y -= this.m_body1.m_invMass * PY;
        this.m_body1.m_rotation -= this.m_body1.m_invI * (r1X * PY - r1Y * PX);
        this.m_body2.m_position.x += this.m_body2.m_invMass * PX;
        this.m_body2.m_position.y += this.m_body2.m_invMass * PY;
        this.m_body2.m_rotation += this.m_body2.m_invI * (r2X * PY - r2Y * PX);
        this.m_body1.m_R.Set(this.m_body1.m_rotation);
        this.m_body2.m_R.Set(this.m_body2.m_rotation);
        return b2Math.b2Abs(C) < b2Settings.b2_linearSlop;
    },
    GetAnchor1: function () {
        return b2Math.AddVV(this.m_body1.m_position, b2Math.b2MulMV(this.m_body1.m_R, this.m_localAnchor1));
    },
    GetAnchor2: function () {
        return b2Math.AddVV(this.m_body2.m_position, b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor2));
    },
    GetReactionForce: function (invTimeStep) {
        var F = new b2Vec2();
        F.SetV(this.m_u);
        F.Multiply(this.m_impulse * invTimeStep);
        return F;
    },
    GetReactionTorque: function (invTimeStep) {
        return 0.0;
    },
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_u: new b2Vec2(),
    m_impulse: null,
    m_mass: null,
    m_length: null
});
var b2DistanceJointDef = Class.create();
Object.extend(b2DistanceJointDef.prototype, b2JointDef.prototype);
Object.extend(b2DistanceJointDef.prototype, {
    initialize: function () {
        this.type = b2Joint.e_unknownJoint;
        this.userData = null;
        this.body1 = null;
        this.body2 = null;
        this.collideConnected = false;
        this.anchorPoint1 = new b2Vec2();
        this.anchorPoint2 = new b2Vec2();
        this.type = b2Joint.e_distanceJoint;
    },
    anchorPoint1: new b2Vec2(),
    anchorPoint2: new b2Vec2()
});
var b2Jacobian = Class.create();
b2Jacobian.prototype = {
    linear1: new b2Vec2(),
    angular1: null,
    linear2: new b2Vec2(),
    angular2: null,
    SetZero: function () {
        this.linear1.SetZero();
        this.angular1 = 0.0;
        this.linear2.SetZero();
        this.angular2 = 0.0;
    },
    Set: function (x1, a1, x2, a2) {
        this.linear1.SetV(x1);
        this.angular1 = a1;
        this.linear2.SetV(x2);
        this.angular2 = a2;
    },
    Compute: function (x1, a1, x2, a2) {
        return (this.linear1.x * x1.x + this.linear1.y * x1.y) + this.angular1 * a1 + (this.linear2.x * x2.x + this.linear2.y * x2.y) + this.angular2 * a2;
    },
    initialize: function () {
        this.linear1 = new b2Vec2();
        this.linear2 = new b2Vec2();
    }
};
var b2GearJoint = Class.create();
Object.extend(b2GearJoint.prototype, b2Joint.prototype);
Object.extend(b2GearJoint.prototype, {
    GetAnchor1: function () {
        var tMat = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y));
    },
    GetAnchor2: function () {
        var tMat = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y));
    },
    GetReactionForce: function (invTimeStep) {
        return new b2Vec2();
    },
    GetReactionTorque: function (invTimeStep) {
        return 0.0;
    },
    GetRatio: function () {
        return this.m_ratio;
    },
    initialize: function (def) {
        this.m_node1 = new b2JointNode();
        this.m_node2 = new b2JointNode();
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = def.body1;
        this.m_body2 = def.body2;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
        this.m_groundAnchor1 = new b2Vec2();
        this.m_groundAnchor2 = new b2Vec2();
        this.m_localAnchor1 = new b2Vec2();
        this.m_localAnchor2 = new b2Vec2();
        this.m_J = new b2Jacobian();
        this.m_revolute1 = null;
        this.m_prismatic1 = null;
        this.m_revolute2 = null;
        this.m_prismatic2 = null;
        var coordinate1;
        var coordinate2;
        this.m_ground1 = def.joint1.m_body1;
        this.m_body1 = def.joint1.m_body2;
        if (def.joint1.m_type == b2Joint.e_revoluteJoint) {
            this.m_revolute1 = def.joint1;
            this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
            this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
            coordinate1 = this.m_revolute1.GetJointAngle();
        } else {
            this.m_prismatic1 = def.joint1;
            this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
            this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
            coordinate1 = this.m_prismatic1.GetJointTranslation();
        }
        this.m_ground2 = def.joint2.m_body1;
        this.m_body2 = def.joint2.m_body2;
        if (def.joint2.m_type == b2Joint.e_revoluteJoint) {
            this.m_revolute2 = def.joint2;
            this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
            this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
            coordinate2 = this.m_revolute2.GetJointAngle();
        } else {
            this.m_prismatic2 = def.joint2;
            this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
            this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
            coordinate2 = this.m_prismatic2.GetJointTranslation();
        }
        this.m_ratio = def.ratio;
        this.m_constant = coordinate1 + this.m_ratio * coordinate2;
        this.m_impulse = 0.0;
    },
    PrepareVelocitySolver: function () {
        var g1 = this.m_ground1;
        var g2 = this.m_ground2;
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var ugX;
        var ugY;
        var rX;
        var rY;
        var tMat;
        var tVec;
        var crug;
        var K = 0.0;
        this.m_J.SetZero();
        if (this.m_revolute1) {
            this.m_J.angular1 = -1.0;
            K += b1.m_invI;
        } else {
            tMat = g1.m_R;
            tVec = this.m_prismatic1.m_localXAxis1;
            ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = b1.m_R;
            rX = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
            rY = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
            crug = rX * ugY - rY * ugX;
            this.m_J.linear1.Set(-ugX, -ugY);
            this.m_J.angular1 = -crug;
            K += b1.m_invMass + b1.m_invI * crug * crug;
        }
        if (this.m_revolute2) {
            this.m_J.angular2 = -this.m_ratio;
            K += this.m_ratio * this.m_ratio * b2.m_invI;
        } else {
            tMat = g2.m_R;
            tVec = this.m_prismatic2.m_localXAxis1;
            ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = b2.m_R;
            rX = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
            rY = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
            crug = rX * ugY - rY * ugX;
            this.m_J.linear2.Set(-this.m_ratio * ugX, -this.m_ratio * ugY);
            this.m_J.angular2 = -this.m_ratio * crug;
            K += this.m_ratio * this.m_ratio * (b2.m_invMass + b2.m_invI * crug * crug);
        }
        this.m_mass = 1.0 / K;
        b1.m_linearVelocity.x += b1.m_invMass * this.m_impulse * this.m_J.linear1.x;
        b1.m_linearVelocity.y += b1.m_invMass * this.m_impulse * this.m_J.linear1.y;
        b1.m_angularVelocity += b1.m_invI * this.m_impulse * this.m_J.angular1;
        b2.m_linearVelocity.x += b2.m_invMass * this.m_impulse * this.m_J.linear2.x;
        b2.m_linearVelocity.y += b2.m_invMass * this.m_impulse * this.m_J.linear2.y;
        b2.m_angularVelocity += b2.m_invI * this.m_impulse * this.m_J.angular2;
    },
    SolveVelocityConstraints: function (step) {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var Cdot = this.m_J.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity);
        var impulse = -this.m_mass * Cdot;
        this.m_impulse += impulse;
        b1.m_linearVelocity.x += b1.m_invMass * impulse * this.m_J.linear1.x;
        b1.m_linearVelocity.y += b1.m_invMass * impulse * this.m_J.linear1.y;
        b1.m_angularVelocity += b1.m_invI * impulse * this.m_J.angular1;
        b2.m_linearVelocity.x += b2.m_invMass * impulse * this.m_J.linear2.x;
        b2.m_linearVelocity.y += b2.m_invMass * impulse * this.m_J.linear2.y;
        b2.m_angularVelocity += b2.m_invI * impulse * this.m_J.angular2;
    },
    SolvePositionConstraints: function () {
        var linearError = 0.0;
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var coordinate1;
        var coordinate2;
        if (this.m_revolute1) {
            coordinate1 = this.m_revolute1.GetJointAngle();
        } else {
            coordinate1 = this.m_prismatic1.GetJointTranslation();
        }
        if (this.m_revolute2) {
            coordinate2 = this.m_revolute2.GetJointAngle();
        } else {
            coordinate2 = this.m_prismatic2.GetJointTranslation();
        }
        var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);
        var impulse = -this.m_mass * C;
        b1.m_position.x += b1.m_invMass * impulse * this.m_J.linear1.x;
        b1.m_position.y += b1.m_invMass * impulse * this.m_J.linear1.y;
        b1.m_rotation += b1.m_invI * impulse * this.m_J.angular1;
        b2.m_position.x += b2.m_invMass * impulse * this.m_J.linear2.x;
        b2.m_position.y += b2.m_invMass * impulse * this.m_J.linear2.y;
        b2.m_rotation += b2.m_invI * impulse * this.m_J.angular2;
        b1.m_R.Set(b1.m_rotation);
        b2.m_R.Set(b2.m_rotation);
        return linearError < b2Settings.b2_linearSlop;
    },
    m_ground1: null,
    m_ground2: null,
    m_revolute1: null,
    m_prismatic1: null,
    m_revolute2: null,
    m_prismatic2: null,
    m_groundAnchor1: new b2Vec2(),
    m_groundAnchor2: new b2Vec2(),
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_J: new b2Jacobian(),
    m_constant: null,
    m_ratio: null,
    m_mass: null,
    m_impulse: null
});
var b2GearJointDef = Class.create();
Object.extend(b2GearJointDef.prototype, b2JointDef.prototype);
Object.extend(b2GearJointDef.prototype, {
    initialize: function () {
        this.type = b2Joint.e_gearJoint;
        this.joint1 = null;
        this.joint2 = null;
        this.ratio = 1.0;
    },
    joint1: null,
    joint2: null,
    ratio: null
});
var b2MouseJoint = Class.create();
Object.extend(b2MouseJoint.prototype, b2Joint.prototype);
Object.extend(b2MouseJoint.prototype, {
    GetAnchor1: function () {
        return this.m_target;
    },
    GetAnchor2: function () {
        var tVec = b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor);
        tVec.Add(this.m_body2.m_position);
        return tVec;
    },
    GetReactionForce: function (invTimeStep) {
        var F = new b2Vec2();
        F.SetV(this.m_impulse);
        F.Multiply(invTimeStep);
        return F;
    },
    GetReactionTorque: function (invTimeStep) {
        return 0.0;
    },
    SetTarget: function (target) {
        this.m_body2.WakeUp();
        this.m_target = target;
    },
    initialize: function (def) {
        this.m_node1 = new b2JointNode();
        this.m_node2 = new b2JointNode();
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = def.body1;
        this.m_body2 = def.body2;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
        this.K = new b2Mat22();
        this.K1 = new b2Mat22();
        this.K2 = new b2Mat22();
        this.m_localAnchor = new b2Vec2();
        this.m_target = new b2Vec2();
        this.m_impulse = new b2Vec2();
        this.m_ptpMass = new b2Mat22();
        this.m_C = new b2Vec2();
        this.m_target.SetV(def.target);
        var tX = this.m_target.x - this.m_body2.m_position.x;
        var tY = this.m_target.y - this.m_body2.m_position.y;
        this.m_localAnchor.x = (tX * this.m_body2.m_R.col1.x + tY * this.m_body2.m_R.col1.y);
        this.m_localAnchor.y = (tX * this.m_body2.m_R.col2.x + tY * this.m_body2.m_R.col2.y);
        this.m_maxForce = def.maxForce;
        this.m_impulse.SetZero();
        var mass = this.m_body2.m_mass;
        var omega = 2.0 * b2Settings.b2_pi * def.frequencyHz;
        var d = 2.0 * mass * def.dampingRatio * omega;
        var k = mass * omega * omega;
        this.m_gamma = 1.0 / (d + def.timeStep * k);
        this.m_beta = def.timeStep * k / (d + def.timeStep * k);
    },
    K: new b2Mat22(),
    K1: new b2Mat22(),
    K2: new b2Mat22(),
    PrepareVelocitySolver: function () {
        var b = this.m_body2;
        var tMat;
        tMat = b.m_R;
        var rX = tMat.col1.x * this.m_localAnchor.x + tMat.col2.x * this.m_localAnchor.y;
        var rY = tMat.col1.y * this.m_localAnchor.x + tMat.col2.y * this.m_localAnchor.y;
        var invMass = b.m_invMass;
        var invI = b.m_invI;
        this.K1.col1.x = invMass;
        this.K1.col2.x = 0.0;
        this.K1.col1.y = 0.0;
        this.K1.col2.y = invMass;
        this.K2.col1.x = invI * rY * rY;
        this.K2.col2.x = -invI * rX * rY;
        this.K2.col1.y = -invI * rX * rY;
        this.K2.col2.y = invI * rX * rX;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.col1.x += this.m_gamma;
        this.K.col2.y += this.m_gamma;
        this.K.Invert(this.m_ptpMass);
        this.m_C.x = b.m_position.x + rX - this.m_target.x;
        this.m_C.y = b.m_position.y + rY - this.m_target.y;
        b.m_angularVelocity *= 0.98;
        var PX = this.m_impulse.x;
        var PY = this.m_impulse.y;
        b.m_linearVelocity.x += invMass * PX;
        b.m_linearVelocity.y += invMass * PY;
        b.m_angularVelocity += invI * (rX * PY - rY * PX);
    },
    SolveVelocityConstraints: function (step) {
        var body = this.m_body2;
        var tMat;
        tMat = body.m_R;
        var rX = tMat.col1.x * this.m_localAnchor.x + tMat.col2.x * this.m_localAnchor.y;
        var rY = tMat.col1.y * this.m_localAnchor.x + tMat.col2.y * this.m_localAnchor.y;
        var CdotX = body.m_linearVelocity.x + (-body.m_angularVelocity * rY);
        var CdotY = body.m_linearVelocity.y + (body.m_angularVelocity * rX);
        tMat = this.m_ptpMass;
        var tX = CdotX + (this.m_beta * step.inv_dt) * this.m_C.x + this.m_gamma * this.m_impulse.x;
        var tY = CdotY + (this.m_beta * step.inv_dt) * this.m_C.y + this.m_gamma * this.m_impulse.y;
        var impulseX = -(tMat.col1.x * tX + tMat.col2.x * tY);
        var impulseY = -(tMat.col1.y * tX + tMat.col2.y * tY);
        var oldImpulseX = this.m_impulse.x;
        var oldImpulseY = this.m_impulse.y;
        this.m_impulse.x += impulseX;
        this.m_impulse.y += impulseY;
        var length = this.m_impulse.Length();
        if (length > step.dt * this.m_maxForce) {
            this.m_impulse.Multiply(step.dt * this.m_maxForce / length);
        }
        impulseX = this.m_impulse.x - oldImpulseX;
        impulseY = this.m_impulse.y - oldImpulseY;
        body.m_linearVelocity.x += body.m_invMass * impulseX;
        body.m_linearVelocity.y += body.m_invMass * impulseY;
        body.m_angularVelocity += body.m_invI * (rX * impulseY - rY * impulseX);
    },
    SolvePositionConstraints: function () {
        return true;
    },
    m_localAnchor: new b2Vec2(),
    m_target: new b2Vec2(),
    m_impulse: new b2Vec2(),
    m_ptpMass: new b2Mat22(),
    m_C: new b2Vec2(),
    m_maxForce: null,
    m_beta: null,
    m_gamma: null
});
var b2MouseJointDef = Class.create();
Object.extend(b2MouseJointDef.prototype, b2JointDef.prototype);
Object.extend(b2MouseJointDef.prototype, {
    initialize: function () {
        this.type = b2Joint.e_unknownJoint;
        this.userData = null;
        this.body1 = null;
        this.body2 = null;
        this.collideConnected = false;
        this.target = new b2Vec2();
        this.type = b2Joint.e_mouseJoint;
        this.maxForce = 0.0;
        this.frequencyHz = 5.0;
        this.dampingRatio = 0.7;
        this.timeStep = 1.0 / 60.0;
    },
    target: new b2Vec2(),
    maxForce: null,
    frequencyHz: null,
    dampingRatio: null,
    timeStep: null
});
var b2PrismaticJoint = Class.create();
Object.extend(b2PrismaticJoint.prototype, b2Joint.prototype);
Object.extend(b2PrismaticJoint.prototype, {
    GetAnchor1: function () {
        var b1 = this.m_body1;
        var tVec = new b2Vec2();
        tVec.SetV(this.m_localAnchor1);
        tVec.MulM(b1.m_R);
        tVec.Add(b1.m_position);
        return tVec;
    },
    GetAnchor2: function () {
        var b2 = this.m_body2;
        var tVec = new b2Vec2();
        tVec.SetV(this.m_localAnchor2);
        tVec.MulM(b2.m_R);
        tVec.Add(b2.m_position);
        return tVec;
    },
    GetJointTranslation: function () {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var p1X = b1.m_position.x + r1X;
        var p1Y = b1.m_position.y + r1Y;
        var p2X = b2.m_position.x + r2X;
        var p2Y = b2.m_position.y + r2Y;
        var dX = p2X - p1X;
        var dY = p2Y - p1Y;
        tMat = b1.m_R;
        var ax1X = tMat.col1.x * this.m_localXAxis1.x + tMat.col2.x * this.m_localXAxis1.y;
        var ax1Y = tMat.col1.y * this.m_localXAxis1.x + tMat.col2.y * this.m_localXAxis1.y;
        var translation = ax1X * dX + ax1Y * dY;
        return translation;
    },
    GetJointSpeed: function () {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var p1X = b1.m_position.x + r1X;
        var p1Y = b1.m_position.y + r1Y;
        var p2X = b2.m_position.x + r2X;
        var p2Y = b2.m_position.y + r2Y;
        var dX = p2X - p1X;
        var dY = p2Y - p1Y;
        tMat = b1.m_R;
        var ax1X = tMat.col1.x * this.m_localXAxis1.x + tMat.col2.x * this.m_localXAxis1.y;
        var ax1Y = tMat.col1.y * this.m_localXAxis1.x + tMat.col2.y * this.m_localXAxis1.y;
        var v1 = b1.m_linearVelocity;
        var v2 = b2.m_linearVelocity;
        var w1 = b1.m_angularVelocity;
        var w2 = b2.m_angularVelocity;
        var speed = (dX * (-w1 * ax1Y) + dY * (w1 * ax1X)) + (ax1X * (((v2.x + (-w2 * r2Y)) - v1.x) - (-w1 * r1Y)) + ax1Y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
        return speed;
    },
    GetMotorForce: function (invTimeStep) {
        return invTimeStep * this.m_motorImpulse;
    },
    SetMotorSpeed: function (speed) {
        this.m_motorSpeed = speed;
    },
    SetMotorForce: function (force) {
        this.m_maxMotorForce = force;
    },
    GetReactionForce: function (invTimeStep) {
        var tImp = invTimeStep * this.m_limitImpulse;
        var tMat;
        tMat = this.m_body1.m_R;
        var ax1X = tImp * (tMat.col1.x * this.m_localXAxis1.x + tMat.col2.x * this.m_localXAxis1.y);
        var ax1Y = tImp * (tMat.col1.y * this.m_localXAxis1.x + tMat.col2.y * this.m_localXAxis1.y);
        var ay1X = tImp * (tMat.col1.x * this.m_localYAxis1.x + tMat.col2.x * this.m_localYAxis1.y);
        var ay1Y = tImp * (tMat.col1.y * this.m_localYAxis1.x + tMat.col2.y * this.m_localYAxis1.y);
        return new b2Vec2(ax1X + ay1X, ax1Y + ay1Y);
    },
    GetReactionTorque: function (invTimeStep) {
        return invTimeStep * this.m_angularImpulse;
    },
    initialize: function (def) {
        this.m_node1 = new b2JointNode();
        this.m_node2 = new b2JointNode();
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = def.body1;
        this.m_body2 = def.body2;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
        this.m_localAnchor1 = new b2Vec2();
        this.m_localAnchor2 = new b2Vec2();
        this.m_localXAxis1 = new b2Vec2();
        this.m_localYAxis1 = new b2Vec2();
        this.m_linearJacobian = new b2Jacobian();
        this.m_motorJacobian = new b2Jacobian();
        var tMat;
        var tX;
        var tY;
        tMat = this.m_body1.m_R;
        tX = (def.anchorPoint.x - this.m_body1.m_position.x);
        tY = (def.anchorPoint.y - this.m_body1.m_position.y);
        this.m_localAnchor1.Set((tX * tMat.col1.x + tY * tMat.col1.y), (tX * tMat.col2.x + tY * tMat.col2.y));
        tMat = this.m_body2.m_R;
        tX = (def.anchorPoint.x - this.m_body2.m_position.x);
        tY = (def.anchorPoint.y - this.m_body2.m_position.y);
        this.m_localAnchor2.Set((tX * tMat.col1.x + tY * tMat.col1.y), (tX * tMat.col2.x + tY * tMat.col2.y));
        tMat = this.m_body1.m_R;
        tX = def.axis.x;
        tY = def.axis.y;
        this.m_localXAxis1.Set((tX * tMat.col1.x + tY * tMat.col1.y), (tX * tMat.col2.x + tY * tMat.col2.y));
        this.m_localYAxis1.x = -this.m_localXAxis1.y;
        this.m_localYAxis1.y = this.m_localXAxis1.x;
        this.m_initialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
        this.m_linearJacobian.SetZero();
        this.m_linearMass = 0.0;
        this.m_linearImpulse = 0.0;
        this.m_angularMass = 0.0;
        this.m_angularImpulse = 0.0;
        this.m_motorJacobian.SetZero();
        this.m_motorMass = 0.0;
        this.m_motorImpulse = 0.0;
        this.m_limitImpulse = 0.0;
        this.m_limitPositionImpulse = 0.0;
        this.m_lowerTranslation = def.lowerTranslation;
        this.m_upperTranslation = def.upperTranslation;
        this.m_maxMotorForce = def.motorForce;
        this.m_motorSpeed = def.motorSpeed;
        this.m_enableLimit = def.enableLimit;
        this.m_enableMotor = def.enableMotor;
    },
    PrepareVelocitySolver: function () {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var invMass1 = b1.m_invMass;
        var invMass2 = b2.m_invMass;
        var invI1 = b1.m_invI;
        var invI2 = b2.m_invI;
        tMat = b1.m_R;
        var ay1X = tMat.col1.x * this.m_localYAxis1.x + tMat.col2.x * this.m_localYAxis1.y;
        var ay1Y = tMat.col1.y * this.m_localYAxis1.x + tMat.col2.y * this.m_localYAxis1.y;
        var eX = b2.m_position.x + r2X - b1.m_position.x;
        var eY = b2.m_position.y + r2Y - b1.m_position.y;
        this.m_linearJacobian.linear1.x = -ay1X;
        this.m_linearJacobian.linear1.y = -ay1Y;
        this.m_linearJacobian.linear2.x = ay1X;
        this.m_linearJacobian.linear2.y = ay1Y;
        this.m_linearJacobian.angular1 = -(eX * ay1Y - eY * ay1X);
        this.m_linearJacobian.angular2 = r2X * ay1Y - r2Y * ay1X;
        this.m_linearMass = invMass1 + invI1 * this.m_linearJacobian.angular1 * this.m_linearJacobian.angular1 +
            invMass2 + invI2 * this.m_linearJacobian.angular2 * this.m_linearJacobian.angular2;
        this.m_linearMass = 1.0 / this.m_linearMass;
        this.m_angularMass = 1.0 / (invI1 + invI2);
        if (this.m_enableLimit || this.m_enableMotor) {
            tMat = b1.m_R;
            var ax1X = tMat.col1.x * this.m_localXAxis1.x + tMat.col2.x * this.m_localXAxis1.y;
            var ax1Y = tMat.col1.y * this.m_localXAxis1.x + tMat.col2.y * this.m_localXAxis1.y;
            this.m_motorJacobian.linear1.x = -ax1X;
            this.m_motorJacobian.linear1.y = -ax1Y;
            this.m_motorJacobian.linear2.x = ax1X;
            this.m_motorJacobian.linear2.y = ax1Y;
            this.m_motorJacobian.angular1 = -(eX * ax1Y - eY * ax1X);
            this.m_motorJacobian.angular2 = r2X * ax1Y - r2Y * ax1X;
            this.m_motorMass = invMass1 + invI1 * this.m_motorJacobian.angular1 * this.m_motorJacobian.angular1 +
                invMass2 + invI2 * this.m_motorJacobian.angular2 * this.m_motorJacobian.angular2;
            this.m_motorMass = 1.0 / this.m_motorMass;
            if (this.m_enableLimit) {
                var dX = eX - r1X;
                var dY = eY - r1Y;
                var jointTranslation = ax1X * dX + ax1Y * dY;
                if (b2Math.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
                    this.m_limitState = b2Joint.e_equalLimits;
                } else if (jointTranslation <= this.m_lowerTranslation) {
                    if (this.m_limitState != b2Joint.e_atLowerLimit) {
                        this.m_limitImpulse = 0.0;
                    }
                    this.m_limitState = b2Joint.e_atLowerLimit;
                } else if (jointTranslation >= this.m_upperTranslation) {
                    if (this.m_limitState != b2Joint.e_atUpperLimit) {
                        this.m_limitImpulse = 0.0;
                    }
                    this.m_limitState = b2Joint.e_atUpperLimit;
                } else {
                    this.m_limitState = b2Joint.e_inactiveLimit;
                    this.m_limitImpulse = 0.0;
                }
            }
        }
        if (this.m_enableMotor == false) {
            this.m_motorImpulse = 0.0;
        }
        if (this.m_enableLimit == false) {
            this.m_limitImpulse = 0.0;
        }
        if (b2World.s_enableWarmStarting) {
            var P1X = this.m_linearImpulse * this.m_linearJacobian.linear1.x + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear1.x;
            var P1Y = this.m_linearImpulse * this.m_linearJacobian.linear1.y + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear1.y;
            var P2X = this.m_linearImpulse * this.m_linearJacobian.linear2.x + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear2.x;
            var P2Y = this.m_linearImpulse * this.m_linearJacobian.linear2.y + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear2.y;
            var L1 = this.m_linearImpulse * this.m_linearJacobian.angular1 - this.m_angularImpulse + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.angular1;
            var L2 = this.m_linearImpulse * this.m_linearJacobian.angular2 + this.m_angularImpulse + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.angular2;
            b1.m_linearVelocity.x += invMass1 * P1X;
            b1.m_linearVelocity.y += invMass1 * P1Y;
            b1.m_angularVelocity += invI1 * L1;
            b2.m_linearVelocity.x += invMass2 * P2X;
            b2.m_linearVelocity.y += invMass2 * P2Y;
            b2.m_angularVelocity += invI2 * L2;
        } else {
            this.m_linearImpulse = 0.0;
            this.m_angularImpulse = 0.0;
            this.m_limitImpulse = 0.0;
            this.m_motorImpulse = 0.0;
        }
        this.m_limitPositionImpulse = 0.0;
    },
    SolveVelocityConstraints: function (step) {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var invMass1 = b1.m_invMass;
        var invMass2 = b2.m_invMass;
        var invI1 = b1.m_invI;
        var invI2 = b2.m_invI;
        var oldLimitImpulse;
        var linearCdot = this.m_linearJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity);
        var linearImpulse = -this.m_linearMass * linearCdot;
        this.m_linearImpulse += linearImpulse;
        b1.m_linearVelocity.x += (invMass1 * linearImpulse) * this.m_linearJacobian.linear1.x;
        b1.m_linearVelocity.y += (invMass1 * linearImpulse) * this.m_linearJacobian.linear1.y;
        b1.m_angularVelocity += invI1 * linearImpulse * this.m_linearJacobian.angular1;
        b2.m_linearVelocity.x += (invMass2 * linearImpulse) * this.m_linearJacobian.linear2.x;
        b2.m_linearVelocity.y += (invMass2 * linearImpulse) * this.m_linearJacobian.linear2.y;
        b2.m_angularVelocity += invI2 * linearImpulse * this.m_linearJacobian.angular2;
        var angularCdot = b2.m_angularVelocity - b1.m_angularVelocity;
        var angularImpulse = -this.m_angularMass * angularCdot;
        this.m_angularImpulse += angularImpulse;
        b1.m_angularVelocity -= invI1 * angularImpulse;
        b2.m_angularVelocity += invI2 * angularImpulse;
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            var motorCdot = this.m_motorJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity) - this.m_motorSpeed;
            var motorImpulse = -this.m_motorMass * motorCdot;
            var oldMotorImpulse = this.m_motorImpulse;
            this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + motorImpulse, -step.dt * this.m_maxMotorForce, step.dt * this.m_maxMotorForce);
            motorImpulse = this.m_motorImpulse - oldMotorImpulse;
            b1.m_linearVelocity.x += (invMass1 * motorImpulse) * this.m_motorJacobian.linear1.x;
            b1.m_linearVelocity.y += (invMass1 * motorImpulse) * this.m_motorJacobian.linear1.y;
            b1.m_angularVelocity += invI1 * motorImpulse * this.m_motorJacobian.angular1;
            b2.m_linearVelocity.x += (invMass2 * motorImpulse) * this.m_motorJacobian.linear2.x;
            b2.m_linearVelocity.y += (invMass2 * motorImpulse) * this.m_motorJacobian.linear2.y;
            b2.m_angularVelocity += invI2 * motorImpulse * this.m_motorJacobian.angular2;
        }
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            var limitCdot = this.m_motorJacobian.Compute(b1.m_linearVelocity, b1.m_angularVelocity, b2.m_linearVelocity, b2.m_angularVelocity);
            var limitImpulse = -this.m_motorMass * limitCdot;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                this.m_limitImpulse += limitImpulse;
            } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                oldLimitImpulse = this.m_limitImpulse;
                this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitImpulse - oldLimitImpulse;
            } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                oldLimitImpulse = this.m_limitImpulse;
                this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitImpulse - oldLimitImpulse;
            }
            b1.m_linearVelocity.x += (invMass1 * limitImpulse) * this.m_motorJacobian.linear1.x;
            b1.m_linearVelocity.y += (invMass1 * limitImpulse) * this.m_motorJacobian.linear1.y;
            b1.m_angularVelocity += invI1 * limitImpulse * this.m_motorJacobian.angular1;
            b2.m_linearVelocity.x += (invMass2 * limitImpulse) * this.m_motorJacobian.linear2.x;
            b2.m_linearVelocity.y += (invMass2 * limitImpulse) * this.m_motorJacobian.linear2.y;
            b2.m_angularVelocity += invI2 * limitImpulse * this.m_motorJacobian.angular2;
        }
    },
    SolvePositionConstraints: function () {
        var limitC;
        var oldLimitImpulse;
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var invMass1 = b1.m_invMass;
        var invMass2 = b2.m_invMass;
        var invI1 = b1.m_invI;
        var invI2 = b2.m_invI;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var p1X = b1.m_position.x + r1X;
        var p1Y = b1.m_position.y + r1Y;
        var p2X = b2.m_position.x + r2X;
        var p2Y = b2.m_position.y + r2Y;
        var dX = p2X - p1X;
        var dY = p2Y - p1Y;
        tMat = b1.m_R;
        var ay1X = tMat.col1.x * this.m_localYAxis1.x + tMat.col2.x * this.m_localYAxis1.y;
        var ay1Y = tMat.col1.y * this.m_localYAxis1.x + tMat.col2.y * this.m_localYAxis1.y;
        var linearC = ay1X * dX + ay1Y * dY;
        linearC = b2Math.b2Clamp(linearC, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        var linearImpulse = -this.m_linearMass * linearC;
        b1.m_position.x += (invMass1 * linearImpulse) * this.m_linearJacobian.linear1.x;
        b1.m_position.y += (invMass1 * linearImpulse) * this.m_linearJacobian.linear1.y;
        b1.m_rotation += invI1 * linearImpulse * this.m_linearJacobian.angular1;
        b2.m_position.x += (invMass2 * linearImpulse) * this.m_linearJacobian.linear2.x;
        b2.m_position.y += (invMass2 * linearImpulse) * this.m_linearJacobian.linear2.y;
        b2.m_rotation += invI2 * linearImpulse * this.m_linearJacobian.angular2;
        var positionError = b2Math.b2Abs(linearC);
        var angularC = b2.m_rotation - b1.m_rotation - this.m_initialAngle;
        angularC = b2Math.b2Clamp(angularC, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
        var angularImpulse = -this.m_angularMass * angularC;
        b1.m_rotation -= b1.m_invI * angularImpulse;
        b1.m_R.Set(b1.m_rotation);
        b2.m_rotation += b2.m_invI * angularImpulse;
        b2.m_R.Set(b2.m_rotation);
        var angularError = b2Math.b2Abs(angularC);
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            tMat = b1.m_R;
            r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
            r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
            tMat = b2.m_R;
            r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
            r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
            p1X = b1.m_position.x + r1X;
            p1Y = b1.m_position.y + r1Y;
            p2X = b2.m_position.x + r2X;
            p2Y = b2.m_position.y + r2Y;
            dX = p2X - p1X;
            dY = p2Y - p1Y;
            tMat = b1.m_R;
            var ax1X = tMat.col1.x * this.m_localXAxis1.x + tMat.col2.x * this.m_localXAxis1.y;
            var ax1Y = tMat.col1.y * this.m_localXAxis1.x + tMat.col2.y * this.m_localXAxis1.y;
            var translation = (ax1X * dX + ax1Y * dY);
            var limitImpulse = 0.0;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                limitC = b2Math.b2Clamp(translation, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
                limitImpulse = -this.m_motorMass * limitC;
                positionError = b2Math.b2Max(positionError, b2Math.b2Abs(angularC));
            } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                limitC = translation - this.m_lowerTranslation;
                positionError = b2Math.b2Max(positionError, -limitC);
                limitC = b2Math.b2Clamp(limitC + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
                limitImpulse = -this.m_motorMass * limitC;
                oldLimitImpulse = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitPositionImpulse - oldLimitImpulse;
            } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                limitC = translation - this.m_upperTranslation;
                positionError = b2Math.b2Max(positionError, limitC);
                limitC = b2Math.b2Clamp(limitC - b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
                limitImpulse = -this.m_motorMass * limitC;
                oldLimitImpulse = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitPositionImpulse - oldLimitImpulse;
            }
            b1.m_position.x += (invMass1 * limitImpulse) * this.m_motorJacobian.linear1.x;
            b1.m_position.y += (invMass1 * limitImpulse) * this.m_motorJacobian.linear1.y;
            b1.m_rotation += invI1 * limitImpulse * this.m_motorJacobian.angular1;
            b1.m_R.Set(b1.m_rotation);
            b2.m_position.x += (invMass2 * limitImpulse) * this.m_motorJacobian.linear2.x;
            b2.m_position.y += (invMass2 * limitImpulse) * this.m_motorJacobian.linear2.y;
            b2.m_rotation += invI2 * limitImpulse * this.m_motorJacobian.angular2;
            b2.m_R.Set(b2.m_rotation);
        }
        return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
    },
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_localXAxis1: new b2Vec2(),
    m_localYAxis1: new b2Vec2(),
    m_initialAngle: null,
    m_linearJacobian: new b2Jacobian(),
    m_linearMass: null,
    m_linearImpulse: null,
    m_angularMass: null,
    m_angularImpulse: null,
    m_motorJacobian: new b2Jacobian(),
    m_motorMass: null,
    m_motorImpulse: null,
    m_limitImpulse: null,
    m_limitPositionImpulse: null,
    m_lowerTranslation: null,
    m_upperTranslation: null,
    m_maxMotorForce: null,
    m_motorSpeed: null,
    m_enableLimit: null,
    m_enableMotor: null,
    m_limitState: 0
});
var b2PrismaticJointDef = Class.create();
Object.extend(b2PrismaticJointDef.prototype, b2JointDef.prototype);
Object.extend(b2PrismaticJointDef.prototype, {
    initialize: function () {
        this.type = b2Joint.e_unknownJoint;
        this.userData = null;
        this.body1 = null;
        this.body2 = null;
        this.collideConnected = false;
        this.type = b2Joint.e_prismaticJoint;
        this.anchorPoint = new b2Vec2(0.0, 0.0);
        this.axis = new b2Vec2(0.0, 0.0);
        this.lowerTranslation = 0.0;
        this.upperTranslation = 0.0;
        this.motorForce = 0.0;
        this.motorSpeed = 0.0;
        this.enableLimit = false;
        this.enableMotor = false;
    },
    anchorPoint: null,
    axis: null,
    lowerTranslation: null,
    upperTranslation: null,
    motorForce: null,
    motorSpeed: null,
    enableLimit: null,
    enableMotor: null
});
var b2PulleyJoint = Class.create();
Object.extend(b2PulleyJoint.prototype, b2Joint.prototype);
Object.extend(b2PulleyJoint.prototype, {
    GetAnchor1: function () {
        var tMat = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y));
    },
    GetAnchor2: function () {
        var tMat = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y));
    },
    GetGroundPoint1: function () {
        return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor1.x, this.m_ground.m_position.y + this.m_groundAnchor1.y);
    },
    GetGroundPoint2: function () {
        return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor2.x, this.m_ground.m_position.y + this.m_groundAnchor2.y);
    },
    GetReactionForce: function (invTimeStep) {
        return new b2Vec2();
    },
    GetReactionTorque: function (invTimeStep) {
        return 0.0;
    },
    GetLength1: function () {
        var tMat;
        tMat = this.m_body1.m_R;
        var pX = this.m_body1.m_position.x + (tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y);
        var pY = this.m_body1.m_position.y + (tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y);
        var dX = pX - (this.m_ground.m_position.x + this.m_groundAnchor1.x);
        var dY = pY - (this.m_ground.m_position.y + this.m_groundAnchor1.y);
        return Math.sqrt(dX * dX + dY * dY);
    },
    GetLength2: function () {
        var tMat;
        tMat = this.m_body2.m_R;
        var pX = this.m_body2.m_position.x + (tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y);
        var pY = this.m_body2.m_position.y + (tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y);
        var dX = pX - (this.m_ground.m_position.x + this.m_groundAnchor2.x);
        var dY = pY - (this.m_ground.m_position.y + this.m_groundAnchor2.y);
        return Math.sqrt(dX * dX + dY * dY);
    },
    GetRatio: function () {
        return this.m_ratio;
    },
    initialize: function (def) {
        this.m_node1 = new b2JointNode();
        this.m_node2 = new b2JointNode();
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = def.body1;
        this.m_body2 = def.body2;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
        this.m_groundAnchor1 = new b2Vec2();
        this.m_groundAnchor2 = new b2Vec2();
        this.m_localAnchor1 = new b2Vec2();
        this.m_localAnchor2 = new b2Vec2();
        this.m_u1 = new b2Vec2();
        this.m_u2 = new b2Vec2();
        var tMat;
        var tX;
        var tY;
        this.m_ground = this.m_body1.m_world.m_groundBody;
        this.m_groundAnchor1.x = def.groundPoint1.x - this.m_ground.m_position.x;
        this.m_groundAnchor1.y = def.groundPoint1.y - this.m_ground.m_position.y;
        this.m_groundAnchor2.x = def.groundPoint2.x - this.m_ground.m_position.x;
        this.m_groundAnchor2.y = def.groundPoint2.y - this.m_ground.m_position.y;
        tMat = this.m_body1.m_R;
        tX = def.anchorPoint1.x - this.m_body1.m_position.x;
        tY = def.anchorPoint1.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y;
        this.m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y;
        tMat = this.m_body2.m_R;
        tX = def.anchorPoint2.x - this.m_body2.m_position.x;
        tY = def.anchorPoint2.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y;
        this.m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y;
        this.m_ratio = def.ratio;
        tX = def.groundPoint1.x - def.anchorPoint1.x;
        tY = def.groundPoint1.y - def.anchorPoint1.y;
        var d1Len = Math.sqrt(tX * tX + tY * tY);
        tX = def.groundPoint2.x - def.anchorPoint2.x;
        tY = def.groundPoint2.y - def.anchorPoint2.y;
        var d2Len = Math.sqrt(tX * tX + tY * tY);
        var length1 = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, d1Len);
        var length2 = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, d2Len);
        this.m_constant = length1 + this.m_ratio * length2;
        this.m_maxLength1 = b2Math.b2Clamp(def.maxLength1, length1, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
        this.m_maxLength2 = b2Math.b2Clamp(def.maxLength2, length2, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
        this.m_pulleyImpulse = 0.0;
        this.m_limitImpulse1 = 0.0;
        this.m_limitImpulse2 = 0.0;
    },
    PrepareVelocitySolver: function () {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var p1X = b1.m_position.x + r1X;
        var p1Y = b1.m_position.y + r1Y;
        var p2X = b2.m_position.x + r2X;
        var p2Y = b2.m_position.y + r2Y;
        var s1X = this.m_ground.m_position.x + this.m_groundAnchor1.x;
        var s1Y = this.m_ground.m_position.y + this.m_groundAnchor1.y;
        var s2X = this.m_ground.m_position.x + this.m_groundAnchor2.x;
        var s2Y = this.m_ground.m_position.y + this.m_groundAnchor2.y;
        this.m_u1.Set(p1X - s1X, p1Y - s1Y);
        this.m_u2.Set(p2X - s2X, p2Y - s2Y);
        var length1 = this.m_u1.Length();
        var length2 = this.m_u2.Length();
        if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.Multiply(1.0 / length1);
        } else {
            this.m_u1.SetZero();
        }
        if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.Multiply(1.0 / length2);
        } else {
            this.m_u2.SetZero();
        }
        if (length1 < this.m_maxLength1) {
            this.m_limitState1 = b2Joint.e_inactiveLimit;
            this.m_limitImpulse1 = 0.0;
        } else {
            this.m_limitState1 = b2Joint.e_atUpperLimit;
            this.m_limitPositionImpulse1 = 0.0;
        }
        if (length2 < this.m_maxLength2) {
            this.m_limitState2 = b2Joint.e_inactiveLimit;
            this.m_limitImpulse2 = 0.0;
        } else {
            this.m_limitState2 = b2Joint.e_atUpperLimit;
            this.m_limitPositionImpulse2 = 0.0;
        }
        var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
        var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
        this.m_limitMass1 = b1.m_invMass + b1.m_invI * cr1u1 * cr1u1;
        this.m_limitMass2 = b2.m_invMass + b2.m_invI * cr2u2 * cr2u2;
        this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
        this.m_limitMass1 = 1.0 / this.m_limitMass1;
        this.m_limitMass2 = 1.0 / this.m_limitMass2;
        this.m_pulleyMass = 1.0 / this.m_pulleyMass;
        var P1X = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.x;
        var P1Y = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.y;
        var P2X = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.x;
        var P2Y = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.y;
        b1.m_linearVelocity.x += b1.m_invMass * P1X;
        b1.m_linearVelocity.y += b1.m_invMass * P1Y;
        b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
        b2.m_linearVelocity.x += b2.m_invMass * P2X;
        b2.m_linearVelocity.y += b2.m_invMass * P2Y;
        b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
    },
    SolveVelocityConstraints: function (step) {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var v1X;
        var v1Y;
        var v2X;
        var v2Y;
        var P1X;
        var P1Y;
        var P2X;
        var P2Y;
        var Cdot;
        var impulse;
        var oldLimitImpulse;
        v1X = b1.m_linearVelocity.x + (-b1.m_angularVelocity * r1Y);
        v1Y = b1.m_linearVelocity.y + (b1.m_angularVelocity * r1X);
        v2X = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y);
        v2Y = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X);
        Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
        impulse = -this.m_pulleyMass * Cdot;
        this.m_pulleyImpulse += impulse;
        P1X = -impulse * this.m_u1.x;
        P1Y = -impulse * this.m_u1.y;
        P2X = -this.m_ratio * impulse * this.m_u2.x;
        P2Y = -this.m_ratio * impulse * this.m_u2.y;
        b1.m_linearVelocity.x += b1.m_invMass * P1X;
        b1.m_linearVelocity.y += b1.m_invMass * P1Y;
        b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
        b2.m_linearVelocity.x += b2.m_invMass * P2X;
        b2.m_linearVelocity.y += b2.m_invMass * P2Y;
        b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
        if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
            v1X = b1.m_linearVelocity.x + (-b1.m_angularVelocity * r1Y);
            v1Y = b1.m_linearVelocity.y + (b1.m_angularVelocity * r1X);
            Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y);
            impulse = -this.m_limitMass1 * Cdot;
            oldLimitImpulse = this.m_limitImpulse1;
            this.m_limitImpulse1 = b2Math.b2Max(0.0, this.m_limitImpulse1 + impulse);
            impulse = this.m_limitImpulse1 - oldLimitImpulse;
            P1X = -impulse * this.m_u1.x;
            P1Y = -impulse * this.m_u1.y;
            b1.m_linearVelocity.x += b1.m_invMass * P1X;
            b1.m_linearVelocity.y += b1.m_invMass * P1Y;
            b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
        }
        if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
            v2X = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y);
            v2Y = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X);
            Cdot = -(this.m_u2.x * v2X + this.m_u2.y * v2Y);
            impulse = -this.m_limitMass2 * Cdot;
            oldLimitImpulse = this.m_limitImpulse2;
            this.m_limitImpulse2 = b2Math.b2Max(0.0, this.m_limitImpulse2 + impulse);
            impulse = this.m_limitImpulse2 - oldLimitImpulse;
            P2X = -impulse * this.m_u2.x;
            P2Y = -impulse * this.m_u2.y;
            b2.m_linearVelocity.x += b2.m_invMass * P2X;
            b2.m_linearVelocity.y += b2.m_invMass * P2Y;
            b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
        }
    },
    SolvePositionConstraints: function () {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        var s1X = this.m_ground.m_position.x + this.m_groundAnchor1.x;
        var s1Y = this.m_ground.m_position.y + this.m_groundAnchor1.y;
        var s2X = this.m_ground.m_position.x + this.m_groundAnchor2.x;
        var s2Y = this.m_ground.m_position.y + this.m_groundAnchor2.y;
        var r1X;
        var r1Y;
        var r2X;
        var r2Y;
        var p1X;
        var p1Y;
        var p2X;
        var p2Y;
        var length1;
        var length2;
        var C;
        var impulse;
        var oldLimitPositionImpulse;
        var linearError = 0.0; {
            tMat = b1.m_R;
            r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
            r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
            tMat = b2.m_R;
            r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
            r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
            p1X = b1.m_position.x + r1X;
            p1Y = b1.m_position.y + r1Y;
            p2X = b2.m_position.x + r2X;
            p2Y = b2.m_position.y + r2Y;
            this.m_u1.Set(p1X - s1X, p1Y - s1Y);
            this.m_u2.Set(p2X - s2X, p2Y - s2Y);
            length1 = this.m_u1.Length();
            length2 = this.m_u2.Length();
            if (length1 > b2Settings.b2_linearSlop) {
                this.m_u1.Multiply(1.0 / length1);
            } else {
                this.m_u1.SetZero();
            }
            if (length2 > b2Settings.b2_linearSlop) {
                this.m_u2.Multiply(1.0 / length2);
            } else {
                this.m_u2.SetZero();
            }
            C = this.m_constant - length1 - this.m_ratio * length2;
            linearError = b2Math.b2Max(linearError, Math.abs(C));
            C = b2Math.b2Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
            impulse = -this.m_pulleyMass * C;
            p1X = -impulse * this.m_u1.x;
            p1Y = -impulse * this.m_u1.y;
            p2X = -this.m_ratio * impulse * this.m_u2.x;
            p2Y = -this.m_ratio * impulse * this.m_u2.y;
            b1.m_position.x += b1.m_invMass * p1X;
            b1.m_position.y += b1.m_invMass * p1Y;
            b1.m_rotation += b1.m_invI * (r1X * p1Y - r1Y * p1X);
            b2.m_position.x += b2.m_invMass * p2X;
            b2.m_position.y += b2.m_invMass * p2Y;
            b2.m_rotation += b2.m_invI * (r2X * p2Y - r2Y * p2X);
            b1.m_R.Set(b1.m_rotation);
            b2.m_R.Set(b2.m_rotation);
        }
        if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
            tMat = b1.m_R;
            r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
            r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
            p1X = b1.m_position.x + r1X;
            p1Y = b1.m_position.y + r1Y;
            this.m_u1.Set(p1X - s1X, p1Y - s1Y);
            length1 = this.m_u1.Length();
            if (length1 > b2Settings.b2_linearSlop) {
                this.m_u1.x *= 1.0 / length1;
                this.m_u1.y *= 1.0 / length1;
            } else {
                this.m_u1.SetZero();
            }
            C = this.m_maxLength1 - length1;
            linearError = b2Math.b2Max(linearError, -C);
            C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
            impulse = -this.m_limitMass1 * C;
            oldLimitPositionImpulse = this.m_limitPositionImpulse1;
            this.m_limitPositionImpulse1 = b2Math.b2Max(0.0, this.m_limitPositionImpulse1 + impulse);
            impulse = this.m_limitPositionImpulse1 - oldLimitPositionImpulse;
            p1X = -impulse * this.m_u1.x;
            p1Y = -impulse * this.m_u1.y;
            b1.m_position.x += b1.m_invMass * p1X;
            b1.m_position.y += b1.m_invMass * p1Y;
            b1.m_rotation += b1.m_invI * (r1X * p1Y - r1Y * p1X);
            b1.m_R.Set(b1.m_rotation);
        }
        if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
            tMat = b2.m_R;
            r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
            r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
            p2X = b2.m_position.x + r2X;
            p2Y = b2.m_position.y + r2Y;
            this.m_u2.Set(p2X - s2X, p2Y - s2Y);
            length2 = this.m_u2.Length();
            if (length2 > b2Settings.b2_linearSlop) {
                this.m_u2.x *= 1.0 / length2;
                this.m_u2.y *= 1.0 / length2;
            } else {
                this.m_u2.SetZero();
            }
            C = this.m_maxLength2 - length2;
            linearError = b2Math.b2Max(linearError, -C);
            C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
            impulse = -this.m_limitMass2 * C;
            oldLimitPositionImpulse = this.m_limitPositionImpulse2;
            this.m_limitPositionImpulse2 = b2Math.b2Max(0.0, this.m_limitPositionImpulse2 + impulse);
            impulse = this.m_limitPositionImpulse2 - oldLimitPositionImpulse;
            p2X = -impulse * this.m_u2.x;
            p2Y = -impulse * this.m_u2.y;
            b2.m_position.x += b2.m_invMass * p2X;
            b2.m_position.y += b2.m_invMass * p2Y;
            b2.m_rotation += b2.m_invI * (r2X * p2Y - r2Y * p2X);
            b2.m_R.Set(b2.m_rotation);
        }
        return linearError < b2Settings.b2_linearSlop;
    },
    m_ground: null,
    m_groundAnchor1: new b2Vec2(),
    m_groundAnchor2: new b2Vec2(),
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_u1: new b2Vec2(),
    m_u2: new b2Vec2(),
    m_constant: null,
    m_ratio: null,
    m_maxLength1: null,
    m_maxLength2: null,
    m_pulleyMass: null,
    m_limitMass1: null,
    m_limitMass2: null,
    m_pulleyImpulse: null,
    m_limitImpulse1: null,
    m_limitImpulse2: null,
    m_limitPositionImpulse1: null,
    m_limitPositionImpulse2: null,
    m_limitState1: 0,
    m_limitState2: 0
});
b2PulleyJoint.b2_minPulleyLength = b2Settings.b2_lengthUnitsPerMeter;
var b2PulleyJointDef = Class.create();
Object.extend(b2PulleyJointDef.prototype, b2JointDef.prototype);
Object.extend(b2PulleyJointDef.prototype, {
    initialize: function () {
        this.type = b2Joint.e_unknownJoint;
        this.userData = null;
        this.body1 = null;
        this.body2 = null;
        this.collideConnected = false;
        this.groundPoint1 = new b2Vec2();
        this.groundPoint2 = new b2Vec2();
        this.anchorPoint1 = new b2Vec2();
        this.anchorPoint2 = new b2Vec2();
        this.type = b2Joint.e_pulleyJoint;
        this.groundPoint1.Set(-1.0, 1.0);
        this.groundPoint2.Set(1.0, 1.0);
        this.anchorPoint1.Set(-1.0, 0.0);
        this.anchorPoint2.Set(1.0, 0.0);
        this.maxLength1 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
        this.maxLength2 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
        this.ratio = 1.0;
        this.collideConnected = true;
    },
    groundPoint1: new b2Vec2(),
    groundPoint2: new b2Vec2(),
    anchorPoint1: new b2Vec2(),
    anchorPoint2: new b2Vec2(),
    maxLength1: null,
    maxLength2: null,
    ratio: null
});
var b2RevoluteJoint = Class.create();
Object.extend(b2RevoluteJoint.prototype, b2Joint.prototype);
Object.extend(b2RevoluteJoint.prototype, {
    GetAnchor1: function () {
        var tMat = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y));
    },
    GetAnchor2: function () {
        var tMat = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y));
    },
    GetJointAngle: function () {
        return this.m_body2.m_rotation - this.m_body1.m_rotation;
    },
    GetJointSpeed: function () {
        return this.m_body2.m_angularVelocity - this.m_body1.m_angularVelocity;
    },
    GetMotorTorque: function (invTimeStep) {
        return invTimeStep * this.m_motorImpulse;
    },
    SetMotorSpeed: function (speed) {
        this.m_motorSpeed = speed;
    },
    SetMotorTorque: function (torque) {
        this.m_maxMotorTorque = torque;
    },
    GetReactionForce: function (invTimeStep) {
        var tVec = this.m_ptpImpulse.Copy();
        tVec.Multiply(invTimeStep);
        return tVec;
    },
    GetReactionTorque: function (invTimeStep) {
        return invTimeStep * this.m_limitImpulse;
    },
    initialize: function (def) {
        this.m_node1 = new b2JointNode();
        this.m_node2 = new b2JointNode();
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = def.body1;
        this.m_body2 = def.body2;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
        this.K = new b2Mat22();
        this.K1 = new b2Mat22();
        this.K2 = new b2Mat22();
        this.K3 = new b2Mat22();
        this.m_localAnchor1 = new b2Vec2();
        this.m_localAnchor2 = new b2Vec2();
        this.m_ptpImpulse = new b2Vec2();
        this.m_ptpMass = new b2Mat22();
        var tMat;
        var tX;
        var tY;
        tMat = this.m_body1.m_R;
        tX = def.anchorPoint.x - this.m_body1.m_position.x;
        tY = def.anchorPoint.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = tX * tMat.col1.x + tY * tMat.col1.y;
        this.m_localAnchor1.y = tX * tMat.col2.x + tY * tMat.col2.y;
        tMat = this.m_body2.m_R;
        tX = def.anchorPoint.x - this.m_body2.m_position.x;
        tY = def.anchorPoint.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = tX * tMat.col1.x + tY * tMat.col1.y;
        this.m_localAnchor2.y = tX * tMat.col2.x + tY * tMat.col2.y;
        this.m_intialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
        this.m_ptpImpulse.Set(0.0, 0.0);
        this.m_motorImpulse = 0.0;
        this.m_limitImpulse = 0.0;
        this.m_limitPositionImpulse = 0.0;
        this.m_lowerAngle = def.lowerAngle;
        this.m_upperAngle = def.upperAngle;
        this.m_maxMotorTorque = def.motorTorque;
        this.m_motorSpeed = def.motorSpeed;
        this.m_enableLimit = def.enableLimit;
        this.m_enableMotor = def.enableMotor;
    },
    K: new b2Mat22(),
    K1: new b2Mat22(),
    K2: new b2Mat22(),
    K3: new b2Mat22(),
    PrepareVelocitySolver: function () {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var invMass1 = b1.m_invMass;
        var invMass2 = b2.m_invMass;
        var invI1 = b1.m_invI;
        var invI2 = b2.m_invI;
        this.K1.col1.x = invMass1 + invMass2;
        this.K1.col2.x = 0.0;
        this.K1.col1.y = 0.0;
        this.K1.col2.y = invMass1 + invMass2;
        this.K2.col1.x = invI1 * r1Y * r1Y;
        this.K2.col2.x = -invI1 * r1X * r1Y;
        this.K2.col1.y = -invI1 * r1X * r1Y;
        this.K2.col2.y = invI1 * r1X * r1X;
        this.K3.col1.x = invI2 * r2Y * r2Y;
        this.K3.col2.x = -invI2 * r2X * r2Y;
        this.K3.col1.y = -invI2 * r2X * r2Y;
        this.K3.col2.y = invI2 * r2X * r2X;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        this.K.Invert(this.m_ptpMass);
        this.m_motorMass = 1.0 / (invI1 + invI2);
        if (this.m_enableMotor == false) {
            this.m_motorImpulse = 0.0;
        }
        if (this.m_enableLimit) {
            var jointAngle = b2.m_rotation - b1.m_rotation - this.m_intialAngle;
            if (b2Math.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop) {
                this.m_limitState = b2Joint.e_equalLimits;
            } else if (jointAngle <= this.m_lowerAngle) {
                if (this.m_limitState != b2Joint.e_atLowerLimit) {
                    this.m_limitImpulse = 0.0;
                }
                this.m_limitState = b2Joint.e_atLowerLimit;
            } else if (jointAngle >= this.m_upperAngle) {
                if (this.m_limitState != b2Joint.e_atUpperLimit) {
                    this.m_limitImpulse = 0.0;
                }
                this.m_limitState = b2Joint.e_atUpperLimit;
            } else {
                this.m_limitState = b2Joint.e_inactiveLimit;
                this.m_limitImpulse = 0.0;
            }
        } else {
            this.m_limitImpulse = 0.0;
        }
        if (b2World.s_enableWarmStarting) {
            b1.m_linearVelocity.x -= invMass1 * this.m_ptpImpulse.x;
            b1.m_linearVelocity.y -= invMass1 * this.m_ptpImpulse.y;
            b1.m_angularVelocity -= invI1 * ((r1X * this.m_ptpImpulse.y - r1Y * this.m_ptpImpulse.x) + this.m_motorImpulse + this.m_limitImpulse);
            b2.m_linearVelocity.x += invMass2 * this.m_ptpImpulse.x;
            b2.m_linearVelocity.y += invMass2 * this.m_ptpImpulse.y;
            b2.m_angularVelocity += invI2 * ((r2X * this.m_ptpImpulse.y - r2Y * this.m_ptpImpulse.x) + this.m_motorImpulse + this.m_limitImpulse);
        } else {
            this.m_ptpImpulse.SetZero();
            this.m_motorImpulse = 0.0;
            this.m_limitImpulse = 0.0;
        }
        this.m_limitPositionImpulse = 0.0;
    },
    SolveVelocityConstraints: function (step) {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var oldLimitImpulse;
        var ptpCdotX = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y) - b1.m_linearVelocity.x - (-b1.m_angularVelocity * r1Y);
        var ptpCdotY = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X) - b1.m_linearVelocity.y - (b1.m_angularVelocity * r1X);
        var ptpImpulseX = -(this.m_ptpMass.col1.x * ptpCdotX + this.m_ptpMass.col2.x * ptpCdotY);
        var ptpImpulseY = -(this.m_ptpMass.col1.y * ptpCdotX + this.m_ptpMass.col2.y * ptpCdotY);
        this.m_ptpImpulse.x += ptpImpulseX;
        this.m_ptpImpulse.y += ptpImpulseY;
        b1.m_linearVelocity.x -= b1.m_invMass * ptpImpulseX;
        b1.m_linearVelocity.y -= b1.m_invMass * ptpImpulseY;
        b1.m_angularVelocity -= b1.m_invI * (r1X * ptpImpulseY - r1Y * ptpImpulseX);
        b2.m_linearVelocity.x += b2.m_invMass * ptpImpulseX;
        b2.m_linearVelocity.y += b2.m_invMass * ptpImpulseY;
        b2.m_angularVelocity += b2.m_invI * (r2X * ptpImpulseY - r2Y * ptpImpulseX);
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            var motorCdot = b2.m_angularVelocity - b1.m_angularVelocity - this.m_motorSpeed;
            var motorImpulse = -this.m_motorMass * motorCdot;
            var oldMotorImpulse = this.m_motorImpulse;
            this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + motorImpulse, -step.dt * this.m_maxMotorTorque, step.dt * this.m_maxMotorTorque);
            motorImpulse = this.m_motorImpulse - oldMotorImpulse;
            b1.m_angularVelocity -= b1.m_invI * motorImpulse;
            b2.m_angularVelocity += b2.m_invI * motorImpulse;
        }
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            var limitCdot = b2.m_angularVelocity - b1.m_angularVelocity;
            var limitImpulse = -this.m_motorMass * limitCdot;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                this.m_limitImpulse += limitImpulse;
            } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                oldLimitImpulse = this.m_limitImpulse;
                this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitImpulse - oldLimitImpulse;
            } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                oldLimitImpulse = this.m_limitImpulse;
                this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitImpulse - oldLimitImpulse;
            }
            b1.m_angularVelocity -= b1.m_invI * limitImpulse;
            b2.m_angularVelocity += b2.m_invI * limitImpulse;
        }
    },
    SolvePositionConstraints: function () {
        var oldLimitImpulse;
        var limitC;
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var positionError = 0.0;
        var tMat;
        tMat = b1.m_R;
        var r1X = tMat.col1.x * this.m_localAnchor1.x + tMat.col2.x * this.m_localAnchor1.y;
        var r1Y = tMat.col1.y * this.m_localAnchor1.x + tMat.col2.y * this.m_localAnchor1.y;
        tMat = b2.m_R;
        var r2X = tMat.col1.x * this.m_localAnchor2.x + tMat.col2.x * this.m_localAnchor2.y;
        var r2Y = tMat.col1.y * this.m_localAnchor2.x + tMat.col2.y * this.m_localAnchor2.y;
        var p1X = b1.m_position.x + r1X;
        var p1Y = b1.m_position.y + r1Y;
        var p2X = b2.m_position.x + r2X;
        var p2Y = b2.m_position.y + r2Y;
        var ptpCX = p2X - p1X;
        var ptpCY = p2Y - p1Y;
        positionError = Math.sqrt(ptpCX * ptpCX + ptpCY * ptpCY);
        var invMass1 = b1.m_invMass;
        var invMass2 = b2.m_invMass;
        var invI1 = b1.m_invI;
        var invI2 = b2.m_invI;
        this.K1.col1.x = invMass1 + invMass2;
        this.K1.col2.x = 0.0;
        this.K1.col1.y = 0.0;
        this.K1.col2.y = invMass1 + invMass2;
        this.K2.col1.x = invI1 * r1Y * r1Y;
        this.K2.col2.x = -invI1 * r1X * r1Y;
        this.K2.col1.y = -invI1 * r1X * r1Y;
        this.K2.col2.y = invI1 * r1X * r1X;
        this.K3.col1.x = invI2 * r2Y * r2Y;
        this.K3.col2.x = -invI2 * r2X * r2Y;
        this.K3.col1.y = -invI2 * r2X * r2Y;
        this.K3.col2.y = invI2 * r2X * r2X;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        this.K.Solve(b2RevoluteJoint.tImpulse, -ptpCX, -ptpCY);
        var impulseX = b2RevoluteJoint.tImpulse.x;
        var impulseY = b2RevoluteJoint.tImpulse.y;
        b1.m_position.x -= b1.m_invMass * impulseX;
        b1.m_position.y -= b1.m_invMass * impulseY;
        b1.m_rotation -= b1.m_invI * (r1X * impulseY - r1Y * impulseX);
        b1.m_R.Set(b1.m_rotation);
        b2.m_position.x += b2.m_invMass * impulseX;
        b2.m_position.y += b2.m_invMass * impulseY;
        b2.m_rotation += b2.m_invI * (r2X * impulseY - r2Y * impulseX);
        b2.m_R.Set(b2.m_rotation);
        var angularError = 0.0;
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            var angle = b2.m_rotation - b1.m_rotation - this.m_intialAngle;
            var limitImpulse = 0.0;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                limitC = b2Math.b2Clamp(angle, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
                limitImpulse = -this.m_motorMass * limitC;
                angularError = b2Math.b2Abs(limitC);
            } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                limitC = angle - this.m_lowerAngle;
                angularError = b2Math.b2Max(0.0, -limitC);
                limitC = b2Math.b2Clamp(limitC + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 0.0);
                limitImpulse = -this.m_motorMass * limitC;
                oldLimitImpulse = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitPositionImpulse - oldLimitImpulse;
            } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                limitC = angle - this.m_upperAngle;
                angularError = b2Math.b2Max(0.0, limitC);
                limitC = b2Math.b2Clamp(limitC - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection);
                limitImpulse = -this.m_motorMass * limitC;
                oldLimitImpulse = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitPositionImpulse - oldLimitImpulse;
            }
            b1.m_rotation -= b1.m_invI * limitImpulse;
            b1.m_R.Set(b1.m_rotation);
            b2.m_rotation += b2.m_invI * limitImpulse;
            b2.m_R.Set(b2.m_rotation);
        }
        return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
    },
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_ptpImpulse: new b2Vec2(),
    m_motorImpulse: null,
    m_limitImpulse: null,
    m_limitPositionImpulse: null,
    m_ptpMass: new b2Mat22(),
    m_motorMass: null,
    m_intialAngle: null,
    m_lowerAngle: null,
    m_upperAngle: null,
    m_maxMotorTorque: null,
    m_motorSpeed: null,
    m_enableLimit: null,
    m_enableMotor: null,
    m_limitState: 0
});
b2RevoluteJoint.tImpulse = new b2Vec2();
var b2RevoluteJointDef = Class.create();
Object.extend(b2RevoluteJointDef.prototype, b2JointDef.prototype);
Object.extend(b2RevoluteJointDef.prototype, {
    initialize: function () {
        this.type = b2Joint.e_unknownJoint;
        this.userData = null;
        this.body1 = null;
        this.body2 = null;
        this.collideConnected = false;
        this.type = b2Joint.e_revoluteJoint;
        this.anchorPoint = new b2Vec2(0.0, 0.0);
        this.lowerAngle = 0.0;
        this.upperAngle = 0.0;
        this.motorTorque = 0.0;
        this.motorSpeed = 0.0;
        this.enableLimit = false;
        this.enableMotor = false;
    },
    anchorPoint: null,
    lowerAngle: null,
    upperAngle: null,
    motorTorque: null,
    motorSpeed: null,
    enableLimit: null,
    enableMotor: null
});

function drawWorld(world, stage) {
    for (var j = world.m_jointList; j; j = j.m_next) drawJoint(world, j, stage);
    for (var b = world.m_bodyList; b; b = b.m_next) {
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) drawShape(s, stage);
    }
}

function drawJoint(world, joint, stage, color) {
    var b1 = joint.m_body1;
    var b2 = joint.m_body2;
    var x1 = b1.m_position;
    var x2 = b2.m_position;
    var p1 = joint.GetAnchor1();
    var p2 = joint.GetAnchor2();
    if (!color) color = '#00f';
    switch (joint.m_type) {
    case b2Joint.e_distanceJoint:
        stage.drawLine(p1.x, p1.y, p2.x, p2.y, 1, color);
        break;
    case b2Joint.e_pulleyJoint:
        break;
    default:
        if (b1 == world.m_groundBody) {
            stage.drawLine(p1.x, p1.y, x2.x, x2.y, 1, color);
        } else if (b2 == world.m_groundBody) {
            stage.drawLine(p1.x, p1.y, x1.x, x1.y, 1, color);
        } else {
            stage.drawLine(x1.x, x1.y, p1.x, p1.y, 1, color);
            stage.drawLine(p1.x, p1.y, x2.x, x2.y, 1, color);
            stage.drawLine(x2.x, x2.y, p2.x, p2.y, 1, color);
        }
        break;
    }
}

function drawShape(shape, stage) {
    switch (shape.m_type) {
    case b2Shape.e_circleShape:
        {
            var color = "#33f";
            var circle = shape;
            var pos = circle.m_position;
            var r = circle.m_radius;
            var segments = 16.0;
            var theta = 0.0;
            var dtheta = 2.0 * Math.PI / segments;
            var x = pos.x + r;
            var y = pos.y;
            for (var i = 0; i < segments; i++) {
                var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                var v = b2Math.AddVV(pos, d);
                stage.drawLine(x, y, v.x, v.y, 1, color);
                x = v.x;
                y = v.y;
                theta += dtheta;
            }
            stage.drawLine(x, y, pos.x + r, pos.y, 1, color);
            var ax = circle.m_R.col1;
            var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
            stage.drawLine(pos.x, pos.y, pos2.x, pos2.y, 1, color);
        }
        break;
    case b2Shape.e_polyShape:
        {
            var poly = shape;
            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
            var x = tV.x;
            var y = tV.y;
            for (var i = 0; i < poly.m_vertexCount; i++) {
                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                stage.drawLine(x, y, v.x, v.y, 1, "#fff");
                x = v.x;
                y = v.y;
            }
            stage.drawLine(x, y, tV.x, tV.y, 1, "#fff");
        }
        break;
    }
};

function SimpleText(font, width, height) {
    this.ALIGN_LEFT = 0;
    this.ALIGN_RIGHT = 1;
    this.ALIGN_CENTER = 2;
    this.font = font;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.align = this.ALIGN_LEFT;
    this.rotation = 0;
    this.charSpacing = 0;
    this.scale = 1;
    this.static = false;
    this.charMap = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.charWidth = [];
    this.sprites = [];
    this.text = "";
    this.manageSprites = function (text) {
        var i, char;
        var len = text.length;
        var sp_len = this.sprites.length;
        if (sp_len < len) {
            for (i = 0; i < len - sp_len; i++) {
                char = new Sprite(this.font, this.width, this.height, this.charMap.length);
                this.sprites.push(char);
                stage.addChild(char);
            }
        }
        if (sp_len > len) {
            for (i = 0; i < sp_len - len; i++) stage.removeChild(this.sprites[i]);
            this.sprites.splice(0, sp_len - len);
        }
    }
    this.getCharIx = function (char) {
        for (var i = 0; i < this.charMap.length; i++) {
            if (this.charMap[i] == char) return i;
        }
        return -1;
    }
    this.getCharWidth = function (char) {
        var i = this.getCharIx(char);
        if (i >= 0) return this.charWidth[i] ? this.charWidth[i] : this.width;
        else return this.width;
    }
    this.getWidth = function () {
        var w = 0;
        for (var i = 0; i < this.text.length; i++) {
            w += this.getCharWidth(this.text.substr(i, 1)) + this.charSpacing;
        }
        return w;
    }
    this.write = function (text) {
        var curX, curY, p, p2, n;
        text = text + "";
        this.text = text;
        this.manageSprites(text);
        curX = this.x;
        curY = this.y;
        if (this.align == this.ALIGN_CENTER) curX = this.x - this.getWidth() / 2 * this.scale + (this.getCharWidth(this.text.substr(0, 1)) / 2);
        if (this.align == this.ALIGN_RIGHT) curX = this.x - this.getWidth() * this.scale;
        p = new Vector(curX - this.x, 0);
        p.rotate(-this.rotation);
        curX = p.x + this.x;
        curY = p.y + this.y;
        p = new Vector(0, 0);
        for (var i = 0; i < text.length; i++) {
            this.sprites[i].visible = true;
            n = this.charMap.indexOf(text.substr(i, 1));
            if (n < 0) this.sprites[i].visible = false;
            else {
                var chw = this.getCharWidth(this.text.substr(i, 1));
                this.sprites[i].scaleX = this.sprites[i].scaleY = this.scale;
                this.sprites[i].gotoAndStop(n);
                p2 = p.clone();
                p2.x *= this.scale;
                p2.rotate(-this.rotation);
                this.sprites[i].x = p2.x + (this.text.substr(i, 1) == ',' ? curX - (chw / 2) : curX);
                this.sprites[i].y = p2.y + curY;
                this.sprites[i].rotation = this.rotation;
                this.sprites[i].static = this.static;
                p.x += chw + this.charSpacing;
            }
        }
    }
    this.refresh = function () {
        this.write(this.text);
    }
    this.addToGroup = function (group) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].gx = this.sprites[i].x / 2;
            this.sprites[i].gy = this.sprites[i].y;
            group.addChild(this.sprites[i], false);
        }
    }
};

function AudioPlayer() {
    var self = this;
    this.disabled = false;
    this.basePath = "";
    this.mp3Support = true;
    this.delayPlay = false;
    this.audioWrapper = null;
    this.locked = false;
    this.busy = false;
    this.startPlayTime = 0;
    this.onend = null;
    this.createNewAudio = function () {
        if (AudioMixer.isWebAudioSupport()) {
            var sound = AudioMixer.waContext.createBufferSource();
            sound.connect(AudioMixer.waContext.destination);
            return sound;
        } else {
            return document.createElement('audio');
        }
    };
    this.init = function (path) {
        this.basePath = path ? path : "";
        this.delayPlay = ("ontouchstart" in window);
        this.audioWrapper = this.createNewAudio();
        var test = document.createElement('audio');
        if (test.canPlayType) this.mp3Support = test.canPlayType('audio/mpeg') != "";
        else this.disabled = true;
        return !this.disabled;
    };
    this.play = function (file, loop) {
        if (this.disabled) return false;
        var url = this.basePath + "/" + file + (this.mp3Support ? ".mp3" : ".ogg");
        this.stop();
        this.audioWrapper = this.createNewAudio();
        this.audioWrapper.doLoop = (loop ? true : false);
        if (AudioMixer.isWebAudioSupport()) {
            var self = this;
            this.loadSound(url, function (buffer) {
                self.audioWrapper.buffer = buffer;
                self.audioWrapper.sountOn ? self.audioWrapper.noteOn(0) : self.audioWrapper.start(0)
                self.startPlayTime = new Date().getTime();
                self.audioWrapper.loop = loop;
                self.waCheckInterval = setInterval(function () {
                    if (!self.audioWrapper) {
                        clearInterval(self.waCheckInterval);
                        return;
                    }
                    if (self.audioWrapper.playbackState == self.audioWrapper.FINISHED_STATE) {
                        self.controlPlay();
                    }
                }, 100);
            });
        } else {
            this.audioWrapper.src = url;
            this.audioWrapper.type = (this.mp3Support ? "audio/mpeg" : "audio/ogg");
            this.audioWrapper.loop = false;
            this.audioWrapper.preload = "auto";
            this.audioWrapper.load();
            if (this.delayPlay) this.audioWrapper.addEventListener("canplay", this.readyToPlay);
            else this.audioWrapper.play();
            this.audioWrapper.addEventListener("ended", this.controlPlay, false);
        }
        this.busy = true;
        this.startPlayTime = new Date().getTime();
    };
    this.loadSound = function (url, callback) {
        if (AudioMixer.buffer[url]) {
            if (callback) callback(AudioMixer.buffer[url]);
            return;
        }
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            AudioMixer.waContext.decodeAudioData(this.response, function (buffer) {
                AudioMixer.buffer[url] = buffer;
                if (callback) callback(buffer);
            });
        }
        request.send();
    }
    this.readyToPlay = function (e) {
        e.currentTarget.play();
    }
    this.stop = function () {
        this.busy = false;
        try {
            if (AudioMixer.isWebAudioSupport()) {
                this.audioWrapper.noteOff(0);
                this.audioWrapper = null;
            } else {
                this.audioWrapper.removeEventListener("canplay", this.readyToPlay);
                this.audioWrapper.pause();
                this.audioWrapper.currentTime = 0.0;
                this.audioWrapper = null;
            }
        } catch (e) {};
    };
    this.pause = function () {
        if (AudioMixer.isWebAudioSupport()) {
            if (self.audioWrapper) self.audioWrapper.disconnect();
        } else {
            this.audioWrapper.pause();
        }
    }
    this.resume = function () {
        if (AudioMixer.isWebAudioSupport()) {
            if (self.audioWrapper) self.audioWrapper.connect(AudioMixer.waContext.destination);
        } else {
            this.audioWrapper.play();
        }
    }
    this.controlPlay = function () {
        if (self.audioWrapper.doLoop) {
            if (!AudioMixer.isWebAudioSupport()) {
                self.audioWrapper.pause();
                self.audioWrapper.currentTime = 0.0;
                self.audioWrapper.play();
            }
        } else {
            self.busy = false;
            if (typeof self.onend == "function") self.onend();
            if (this.waCheckInterval) {
                clearInterval(this.waCheckInterval);
            }
        }
    }
    this.getPosition = function () {
        if (AudioMixer.isWebAudioSupport()) {
            if (!this.startPlayTime) return 0;
            var duration = this.getDuration();
            if (!duration) return 0;
            var position = ((new Date().getTime()) - this.startPlayTime) / 1000;
            if (position <= duration) return position;
            if (!this.audioWrapper.doLoop) return duration;
            return position - Math.floor(position / duration) * duration;
        } else {
            return this.audioWrapper.currentTime ? this.audioWrapper.currentTime : 0;
        }
    }
    this.getDuration = function () {
        if (AudioMixer.isWebAudioSupport()) {
            return this.audioWrapper.buffer ? this.audioWrapper.buffer.duration : 0;
        } else {
            return this.audioWrapper.duration ? this.audioWrapper.duration : 0;
        }
    }
}

function AudioMixer(path, channelsCount) {
    this.singleChannelMode = false;
    this.channels = [];
    this.init = function (path, channelsCount) {
        if (AudioMixer.isWebAudioSupport()) {
            AudioMixer.waContext = new webkitAudioContext();
            var buffer = AudioMixer.waContext.createBuffer(1, 1, 22050);
            sound = AudioMixer.waContext.createBufferSource();
            sound.buffer = buffer;
            sound.connect(AudioMixer.waContext.destination);
            sound.noteOn ? sound.noteOn(0) : sound.start(0);
        }
        if (!AudioMixer.isWebAudioSupport() && navigator.userAgent.toLowerCase().indexOf("mac") != -1) {
            this.singleChannelMode = true;
            channelsCount = 1;
        }
        this.path = path;
        this.channels = [];
        for (var i = 0; i < channelsCount; i++) {
            this.channels[i] = new AudioPlayer();
            this.channels[i].init(path);
        }
        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }
        var self = this;

        function handleVisibilityChange() {
            if (document[hidden]) {
                for (var i = 0; i < self.channels.length; i++) {
                    self.channels[i].pause();
                }
            } else {
                for (var i = 0; i < self.channels.length; i++) {
                    self.channels[i].resume();
                }
            }
        }
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    };
    this.play = function (file, loop, soft, channelID) {
        var cID = -1;
        if (typeof channelID == "number") cID = channelID;
        else cID = this.getFreeChannel(soft); if (cID >= 0 && cID < this.channels.length) {
            this.channels[cID].stop();
            this.channels[cID].play(file, loop);
        }
        return this.channels[cID];
    };
    this.stop = function (cID) {
        if (cID >= 0 && cID < this.channels.length) this.channels[cID].stop();
    };
    this.getFreeChannel = function (soft) {
        var cID = -1;
        var freeChannels = [];
        var maxID = -1;
        var max = -1;
        var t = 0;
        for (var i = 0; i < this.channels.length; i++) {
            if (!this.channels[i].locked) {
                if (!this.channels[i].busy) freeChannels.push(i);
                else {
                    t = new Date().getTime();
                    t -= this.channels[i].startPlayTime;
                    if (t > max) {
                        max = t;
                        maxID = i;
                    }
                }
            }
        }
        if (freeChannels.length == 0) {
            if (!soft && maxID >= 0) cID = maxID;
        } else cID = freeChannels[0];
        return cID;
    };
    this.init(path, channelsCount);
}
AudioMixer.isWebAudioSupport = function () {
    return ("webkitAudioContext" in window);
}
AudioMixer.buffer = {};
AudioMixer.waContext = null;;

function SpritesGroup(stage) {
    var self = this;
    this.stage = stage;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.opacity = 1;
    this.sprites = [];
    this.addChild = function (obj, add) {
        if (typeof obj.gscaleX == "undefined") obj.gscaleX = 1;
        if (typeof obj.gscaleY == "undefined") obj.gscaleY = 1;
        if (typeof obj.grotation == "undefined") obj.grotation = 0;
        if (typeof obj.gopacity == "undefined") obj.gopacity = 1;
        this.sprites.push(obj);
        if (add) this.stage.addChild(obj);
        this.update();
    }
    this.removeChild = function (obj, destroy) {
        this.sprites = Utils.removeFromArray(this.sprites, obj);
        if (destroy) obj.destroy = true;
    }
    this.remove = function () {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].destroy = true;
        }
        this.sprites = [];
    }
    this.update = function () {
        var obj;
        for (var i = 0; i < self.sprites.length; i++) {
            obj = self.sprites[i];
            var x = obj.gx;
            var y = obj.gy;
            var p = new Vector(x, y);
            p.rotate(-self.rotation);
            x += p.x;
            y += p.y;
            x *= self.scaleX;
            y *= self.scaleY;
            x += self.x;
            y += self.y;
            obj.x = x;
            obj.y = y;
            obj.scaleX = obj.gscaleX * self.scaleX;
            obj.scaleY = obj.gscaleY * self.scaleY;
            obj.rotation = obj.grotation + self.rotation;
            obj.opacity = obj.gopacity * self.opacity;
        }
    }
    stage.addEventListener("pretick", this.update);
};

function TilesSprite(img, width, height, frames, rows, columns) {
    TilesSprite.superclass.constructor.call(this, img, width, height, rows, columns);
    this.framesCount = frames;
    this.currentFrameX = 0;
    this.gotoAndStop = function (frame) {
        this.currentFrameX = frame;
        this.stop();
    };
    this.gotoAndPlay = function (frame) {
        this.currentFrameX = frame;
        this.play();
    };
    this.changeStep = function (e) {
        var self = e.target;
        if (self.animated && self.animStep + 1 >= self.animDelay) {
            self.currentFrameX++;
            if (self.currentFrameX >= self.framesCount) self.currentFrameX = 0;
        }
    };
    this.sync = function (e) {
        var self = e.target;
        self.currentLayer = Math.floor(self.currentFrameX / self.totalFrames);
        self.currentFrame = self.currentFrameX - self.currentLayer * self.totalFrames;
    };
    this.addEventListener("enterframe", this.changeStep);
    this.addEventListener("prerender", this.sync);
}
Utils.extend(TilesSprite, Sprite);;
var levels = [{
    objects: [{
        type: "invisible_wall_big",
        x: 50,
        y: 213,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 170,
        y: 213,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 390,
        y: 137,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 450,
        y: 138,
        rotation: 0
    }, {
        type: "tube1",
        x: -5,
        y: 192,
        rotation: 0
    }, {
        type: "tube2",
        x: 483,
        y: 115,
        rotation: 0
    }, {
        type: "Spring",
        x: 289,
        y: 219,
        rotation: 0
    }, {
        type: "Lever1",
        x: 88,
        y: 102,
        rotation: 0
    }, {
        type: "DoorLevel01",
        x: 115,
        y: 41,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 275,
        y: 221,
        rotation: 0.2
    }, {
        type: "invisible_wall_small",
        x: 313,
        y: 161,
        rotation: 1.73
    }, {
        type: "invisible_wall_small",
        x: 305,
        y: 210,
        rotation: 1.73,
        custom: "stop"
    }, {
        type: "yellow_element",
        x: 114,
        y: 9,
        rotation: 0
    }, {
        type: "button_red",
        x: 328,
        y: 250,
        rotation: 0
    }, {
        type: "Hint1_Level10001",
        x: 220,
        y: 25,
        rotation: 0
    }, {
        type: "Hint2_Level10001",
        x: 220,
        y: 75,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: 29,
        y: 95,
        rotation: 0
    }, {
        type: "btn02",
        x: 193,
        y: 113,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 73,
        y: 116,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 74,
        y: 277,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 225,
        y: 277,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 376,
        y: 277,
        rotation: 0
    }, {
        type: "tube2",
        x: 447,
        y: 255,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 179,
        y: 116,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 293,
        y: 150,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 462,
        y: 184,
        rotation: 1.5707963267948966
    }, {
        type: "conveyor",
        x: 321,
        y: 218,
        rotation: 0
    }, {
        type: "Lever2",
        x: 441,
        y: 100,
        rotation: 0
    }, {
        type: "crossbar",
        x: 340,
        y: 84,
        rotation: 1.5707963267948966
    }, {
        type: "electric_detail",
        x: 347,
        y: 131,
        rotation: 0
    }, {
        type: "electricity_10",
        x: 290,
        y: 145,
        rotation: 0
    }, {
        type: "HintMc1_Level20001",
        x: 193,
        y: 25,
        rotation: 0
    }, {
        type: "ArrowAnim0001",
        x: 193,
        y: 55,
        rotation: 0
    }, {
        type: "HintMc3_Level20001",
        x: 193,
        y: -50,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: 15,
        y: 73,
        rotation: 0
    }, {
        type: "tube2",
        x: 13,
        y: 258,
        rotation: Math.PI
    }, {
        type: "Baraban",
        x: 404,
        y: 133,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 93,
        y: 94,
        rotation: 0
    }, {
        type: "button_blue_down",
        x: 91,
        y: 200,
        rotation: 0
    }, {
        type: "button_blue_mid_lvl3",
        x: 91,
        y: 179,
        rotation: 0
    }, {
        type: "button_blue_up",
        x: 91,
        y: 158,
        rotation: 0
    }, {
        type: "Lift_lv3",
        x: 224,
        y: 170,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 89,
        y: 280,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 285,
        y: 196,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 313,
        y: 123,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 339,
        y: 123,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 453,
        y: 97,
        rotation: 1.5707963267948966
    }, {
        type: "slider",
        x: 424,
        y: 196,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 164,
        y: 116,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 164,
        y: 165,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 164,
        y: 194,
        rotation: 1.5707963267948966
    }, {
        type: "Hint1_Level30001",
        x: 350,
        y: 170,
        rotation: 0
    }, {
        type: "HoldText0001",
        x: 50,
        y: 179,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: 5,
        y: 172,
        rotation: 0
    }, {
        type: "tube2",
        x: 476,
        y: 169,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 53,
        y: 193,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 419,
        y: 191,
        rotation: 0
    }, {
        type: "Latch_lvl4",
        x: 102,
        y: 207,
        rotation: 0
    }, {
        type: "wooden_cross_lvl4",
        x: 236,
        y: 195,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 98,
        y: 220,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 98,
        y: 197,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 71,
        y: 221,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 120,
        y: 233,
        rotation: 1.5707963267948966
    }, {
        type: "stone_lvl4",
        x: 303,
        y: 18,
        rotation: 0
    }, {
        type: "mechanism",
        x: 303,
        y: 43,
        rotation: 0
    }, {
        type: "Lever4",
        x: 257,
        y: 24,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 346,
        y: 214,
        rotation: 1.5707963267948966
    }, ],
    joints: [{
        type: 0,
        point1: {
            x: 237,
            y: 195
        }
    }, ]
}, {
    objects: [{
        type: "tube2",
        x: 495,
        y: 207,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 15,
        y: 191,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 281,
        y: 246,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 58,
        y: 202,
        rotation: 0.44999999999999996
    }, {
        type: "invisible_wall_small",
        x: 121,
        y: 222,
        rotation: 0.2
    }, {
        type: "invisible_wall_big",
        x: 458,
        y: 229,
        rotation: 0
    }, {
        type: "Lever1",
        x: 259,
        y: 51,
        rotation: 0
    }, {
        type: "tube5",
        x: 33,
        y: 35,
        rotation: 1.5707963267948966
    }, {
        type: "BackTube",
        x: 33,
        y: 72,
        rotation: 1.5707963267948966
    }, {
        type: "entrance_lvl7",
        x: 34,
        y: 77,
        rotation: 0
    }, {
        type: "button_blue_left",
        x: 167,
        y: 146,
        rotation: 0
    }, {
        type: "button_blue_right",
        x: 208,
        y: 146,
        rotation: 0
    }, {
        type: "button_blue_mid",
        x: 187,
        y: 146,
        rotation: 0
    }, {
        type: "Bridge_lvl5",
        x: 216,
        y: 235,
        rotation: -1.5707963267948966,
        restitution: 0
    }, {
        type: "invisible_wall_small",
        x: 87,
        y: 214,
        rotation: 0.3
    }, {
        type: "invisible_wall_small",
        x: 385,
        y: 254,
        rotation: 1.5500000000000007,
        restitution: -10
    }, {
        type: "invisible_wall_big",
        x: 350,
        y: 273,
        rotation: 0,
        custom: 'pit'
    }, {
        type: "wagon_lvl5",
        x: 31,
        y: 160,
        rotation: 0,
        density: 10
    }, {
        type: "invisible_wall_big",
        x: 142,
        y: 301,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 295,
        y: 253,
        rotation: 1.5500000000000007
    }, {
        type: "invisible_wall_small",
        x: 300,
        y: 253,
        rotation: 1.5500000000000007
    }, {
        type: "invisible_wall_small",
        x: 305,
        y: 253,
        rotation: 1.5500000000000007
    }, {
        type: "invisible_wall_small",
        x: 310,
        y: 253,
        rotation: 1.5500000000000007
    }, {
        type: "invisible_wall_small",
        x: 315,
        y: 253,
        rotation: 1.5500000000000007
    }, {
        type: "invisible_wall_small",
        x: 320,
        y: 253,
        rotation: 1.5500000000000007
    }, {
        type: "lever_cover_up",
        x: 259,
        y: 41,
        rotation: 0
    }, {
        type: "wood_on_rope_lvl5",
        x: 87,
        y: 100,
        rotation: 0,
        restitution: 0.1,
        friction: 0.6,
        custom: "leftWood"
    }, {
        type: "wood_on_rope_lvl5",
        x: 437,
        y: 49,
        rotation: 0,
        custom: "rightWood"
    }, {
        type: "wagon_whel_lvl5",
        x: 18,
        y: 180,
        rotation: 0,
        density: 20,
        friction: 0.01
    }, {
        type: "wagon_whel_lvl5",
        x: 45,
        y: 180,
        rotation: 0,
        density: 15,
        friction: 0.01
    }, {
        type: "peregorodka_lvl5",
        x: 87,
        y: 15.5,
        rotation: 0
    }, {
        type: "peregorodka_lvl5",
        x: 437,
        y: 15.5,
        rotation: 0
    }, ],
    joints: [{
        type: 0,
        point1: {
            x: 18,
            y: 180
        }
    }, {
        type: 0,
        point1: {
            x: 45,
            y: 180
        }
    }, ]
}, {
    objects: [{
        type: "tube1",
        x: 27,
        y: 62,
        rotation: 0
    }, {
        type: "tube2",
        x: 452,
        y: 61,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 96,
        y: 83,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 247,
        y: 83,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 396,
        y: 83,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 13,
        y: 226,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: -10,
        y: 153,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 41,
        y: 263,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 60,
        y: 274,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 79,
        y: 274,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 70,
        y: 224,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 405,
        y: 257,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 368,
        y: 273,
        rotation: 0
    }, {
        type: "ball_falls_lvl6",
        x: 387,
        y: 117,
        rotation: 0
    }, {
        type: "button_red",
        x: 431,
        y: 208,
        rotation: 0
    }, {
        type: "button_blue",
        x: 410,
        y: 114,
        rotation: 0
    }, {
        type: "mechanism",
        x: 387,
        y: 141,
        rotation: 0
    }, {
        type: "spring",
        x: 396,
        y: 251,
        rotation: 0
    }, {
        type: "btn_lvl6",
        x: 37,
        y: 263,
        rotation: 0
    }, {
        type: "brig",
        x: 295,
        y: 283,
        rotation: 0.2,
        restitution: 0
    }, {
        type: "tube_lvl6",
        x: 240,
        y: 35,
        rotation: 0
    }, {
        type: "earth_lvl6",
        x: 400,
        y: 324,
        rotation: 0
    }, {
        type: "cable_lvl6",
        x: 295,
        y: 224,
        rotation: 0
    }, {
        type: "button_blue_left",
        x: 271,
        y: 145,
        rotation: 0
    }, {
        type: "button_blue_right",
        x: 311,
        y: 145,
        rotation: 0
    }, {
        type: "button_blue_mid",
        x: 291,
        y: 145,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube2",
        x: 454,
        y: 91,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 421,
        y: 50,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 281,
        y: 50,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 136,
        y: 50,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 6,
        y: 50,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 227,
        y: 115,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 251,
        y: 115,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 470,
        y: 113,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 174,
        y: 199,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 254,
        y: 199,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 95,
        y: 226,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 20,
        y: 128,
        rotation: 1.5500000000000007
    }, {
        type: "invisible_wall_big",
        x: 19,
        y: 176,
        rotation: 1.5500000000000007
    }, {
        type: "invisible_wall_small",
        x: 101,
        y: 223,
        rotation: -1.5500000000000007
    }, {
        type: "entrance_lvl7",
        x: 236,
        y: 90,
        rotation: 0
    }, {
        type: "Baraban",
        x: 61,
        y: 209,
        rotation: 0
    }, {
        type: "Girlfriend",
        x: 419,
        y: 19,
        rotation: 0
    }, {
        type: "Stove",
        x: 170,
        y: 182,
        rotation: 0
    }, {
        type: "oven_lever",
        x: 167,
        y: 260,
        rotation: 0
    }, {
        type: "fence",
        x: 437,
        y: 24,
        rotation: 0
    }, {
        type: "slider",
        x: 43,
        y: 268,
        rotation: 0
    }, {
        type: "Lift_lv7",
        x: 362,
        y: 235,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 394,
        y: 187,
        rotation: 1.6000000000000008
    }, {
        type: "invisible_wall_small",
        x: 366,
        y: 281,
        rotation: 0
    }, {
        type: "Btn_lv7",
        x: 346,
        y: 275,
        rotation: 0
    }, {
        type: "Btn_lv7",
        x: 376,
        y: 275,
        rotation: 0
    }, {
        type: "ice",
        x: 167,
        y: 174,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: 1,
        y: 130,
        rotation: 0
    }, {
        type: "tube2",
        x: 483,
        y: 126,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 52,
        y: 151,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 193,
        y: 90,
        rotation: 1.5707963267948966,
        custom: 'cancelSpeed'
    }, {
        type: "invisible_wall_small",
        x: 217,
        y: 247,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 259,
        y: 247,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 355,
        y: 240,
        rotation: 1.5707963267948966,
        custom: 'cancelSpeed2'
    }, {
        type: "invisible_wall_big",
        x: 437,
        y: 150,
        rotation: 0
    }, {
        type: "button_red",
        x: 382,
        y: 211,
        rotation: 0
    }, {
        type: "Lever2",
        x: 246,
        y: 129,
        rotation: 0
    }, {
        type: "lever_cover_down",
        x: 246,
        y: 140,
        rotation: 0
    }, {
        type: "latch_lvl8",
        x: 83,
        y: 256,
        rotation: 0
    }, {
        type: "bridge_lvl8",
        x: 159,
        y: 156,
        rotation: 0
    }, {
        type: "before_bridge_lvl8",
        x: 245,
        y: 154,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 318,
        y: 256,
        rotation: 0
    }, {
        type: "spring_up",
        x: 318,
        y: 245,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 273,
        y: 167,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: -4,
        y: 112,
        rotation: 0
    }, {
        type: "tube2",
        x: 494,
        y: 110,
        rotation: 0
    }, {
        type: "bridge_lvl9",
        x: 255,
        y: 137,
        rotation: 0,
        custom: 'bridge2'
    }, {
        type: "bridge_lvl9",
        x: 440,
        y: 137,
        rotation: 0,
        custom: 'bridge4'
    }, {
        type: "bridge_lvl9",
        x: 162,
        y: 137,
        rotation: 0,
        custom: 'bridge1'
    }, {
        type: "bridge_lvl9",
        x: 348,
        y: 137,
        rotation: 0,
        custom: 'bridge3'
    }, {
        type: "earth2_lvl9",
        x: 261,
        y: 149,
        rotation: 0
    }, {
        type: "earth4_lvl9",
        x: 449,
        y: 165,
        rotation: 0
    }, {
        type: "earth1_lvl9",
        x: 168,
        y: 153,
        rotation: 0
    }, {
        type: "earth3_lvl9",
        x: 353,
        y: 152,
        rotation: 0
    }, {
        type: "lamp",
        x: 82,
        y: 218,
        rotation: 0,
        custom: 'lamp1'
    }, {
        type: "lamp",
        x: 174,
        y: 218,
        rotation: 0,
        custom: 'lamp2'
    }, {
        type: "lamp",
        x: 265,
        y: 218,
        rotation: 0,
        custom: 'lamp3'
    }, {
        type: "lamp",
        x: 356,
        y: 218,
        rotation: 0,
        custom: 'lamp4'
    }, {
        type: "wire",
        x: 251,
        y: 217,
        rotation: 0
    }, {
        type: "button_lvl9",
        x: 79,
        y: 265,
        rotation: 0,
        custom: 'but1'
    }, {
        type: "button_lvl9",
        x: 172,
        y: 266,
        rotation: 0,
        custom: 'but2'
    }, {
        type: "button_lvl9",
        x: 263,
        y: 267,
        rotation: 0,
        custom: 'but3'
    }, {
        type: "button_lvl9",
        x: 355,
        y: 266,
        rotation: 0,
        custom: 'but4'
    }, {
        type: "invisible_wall_big",
        x: 23,
        y: 133,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: 18,
        y: 263,
        rotation: 0
    }, {
        type: "tube2",
        x: 479,
        y: 239,
        rotation: -0.2007128639793479
    }, {
        type: "invisible_wall_big",
        x: 444,
        y: 270,
        rotation: -0.3419862177193762
    }, {
        type: "invisible_wall_big",
        x: 337,
        y: 284,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 188,
        y: 284,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 65,
        y: 284,
        rotation: 0
    }, {
        type: "button_lvl11",
        x: 57,
        y: 129,
        rotation: 0,
        custom: 'button1'
    }, {
        type: "button_lvl11",
        x: 99,
        y: 129,
        rotation: 0,
        custom: 'button2'
    }, {
        type: "button_lvl11",
        x: 139,
        y: 129,
        rotation: 0,
        custom: 'button3'
    }, {
        type: "lever_cover_down",
        x: 79,
        y: 110,
        rotation: 0
    }, {
        type: "smoke1_lvl11",
        x: 310,
        y: 226,
        rotation: 0
    }, {
        type: "smoke2_lvl11",
        x: 310,
        y: 226,
        rotation: 0
    }, {
        type: "smoke1_lvl11",
        x: 390,
        y: 226,
        rotation: 0
    }, {
        type: "smoke2_lvl11",
        x: 390,
        y: 226,
        rotation: 0
    }, {
        type: "rope_lvl11",
        x: 185,
        y: -18,
        rotation: 0
    }, {
        type: "tube_lvl11",
        x: 185,
        y: 8,
        rotation: 0
    }, {
        type: "pliers_down",
        x: 187,
        y: 110,
        rotation: 0
    }, {
        type: "bridge_lvl11",
        x: 106,
        y: 224,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 307,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 304,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 331,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 328,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 337,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 286,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 301,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 334,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 310,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 340,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 292,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 319,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 289,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 295,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 325,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 280,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 316,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 283,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 349,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 298,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 346,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 313,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 322,
        y: 81,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 343,
        y: 81,
        rotation: 0
    }, {
        type: "block_lvl11",
        x: 186,
        y: 228,
        rotation: 0
    }, {
        type: "fire_lvl11",
        x: 320,
        y: 81,
        rotation: 0
    }, {
        type: "button_blue_left",
        x: 370,
        y: 193,
        rotation: 0
    }, {
        type: "button_blue_right",
        x: 410,
        y: 193,
        rotation: 0
    }, {
        type: "button_blue_mid",
        x: 390,
        y: 193,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: 24,
        y: 104,
        rotation: 0
    }, {
        type: "tube2",
        x: 464,
        y: 104,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 26,
        y: 125,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 464,
        y: 126,
        rotation: 0
    }, {
        type: "prop_lvl12",
        x: 58,
        y: 173,
        rotation: 0
    }, {
        type: "button_lvl12",
        x: 258,
        y: 258,
        rotation: 0
    }, {
        type: "bridge_lvl12",
        x: 172,
        y: 130,
        rotation: 0
    }, {
        type: "bridge_lvl12",
        x: 312,
        y: 130,
        rotation: 0
    }, {
        type: "circle_lvl12",
        x: 172,
        y: 130,
        rotation: 0
    }, {
        type: "circle_lvl12",
        x: 312,
        y: 130,
        rotation: 0
    }, ],
    joints: [{
        type: 0,
        point1: {
            x: 312,
            y: 130
        }
    }, {
        type: 0,
        point1: {
            x: 172,
            y: 130
        }
    }, ]
}, {
    objects: [{
        type: "tube1",
        x: 7,
        y: 155,
        rotation: 0
    }, {
        type: "tube2",
        x: 486,
        y: 201,
        rotation: 0
    }, {
        type: "sticks",
        x: 192.5,
        y: 67,
        rotation: 0
    }, {
        type: "sticks",
        x: 192.5,
        y: 96,
        rotation: 0,
        custom: 'downSticks'
    }, {
        type: "rope2",
        x: 193,
        y: 79,
        rotation: 0
    }, {
        type: "rope3",
        x: 194.5,
        y: 97,
        rotation: 0
    }, {
        type: "rope4",
        x: 196,
        y: 113,
        rotation: 0
    }, {
        type: "rope5",
        x: 191,
        y: 126,
        rotation: 0
    }, {
        type: "rope6",
        x: 190,
        y: 137,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 54,
        y: 175,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 181,
        y: 175,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 202,
        y: 175,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 280,
        y: 174,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 302,
        y: 174,
        rotation: 0
    }, {
        type: "prop_lvl13",
        x: 143,
        y: 215,
        rotation: 0,
        custom: 'propLeft'
    }, {
        type: "prop_lvl13",
        x: 240,
        y: 215,
        rotation: 0,
        custom: 'propRight'
    }, {
        type: "button_lvl13",
        x: 277,
        y: 231,
        rotation: 0,
        custom: 'buttonRight_prop'
    }, {
        type: "bridge_lvl13",
        x: 383,
        y: 181,
        rotation: 1.5707963267948966
    }, {
        type: "button_blue_left",
        x: 371,
        y: 38,
        rotation: 0
    }, {
        type: "button_blue_right",
        x: 411,
        y: 38,
        rotation: 0
    }, {
        type: "button_blue_mid",
        x: 391,
        y: 36,
        rotation: 0
    }, {
        type: "press",
        x: 192,
        y: 65,
        rotation: 0
    }, {
        type: "button_lvl13",
        x: 108,
        y: 231,
        rotation: 0,
        custom: 'buttonLeft_prop'
    }, {
        type: "invisible_wall_small",
        x: 322,
        y: 203,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 495,
        y: 225,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: -9,
        y: 245,
        rotation: 0
    }, {
        type: "tube2",
        x: 458,
        y: 115,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 4,
        y: 266,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 150,
        y: 310,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 160,
        y: 310,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 239,
        y: 251,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 250,
        y: 251,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 248,
        y: 27,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 238,
        y: 27,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 159,
        y: 93,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 149,
        y: 93,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 327,
        y: 127,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 338,
        y: 127,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 326,
        y: 287,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 339,
        y: 287,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 411,
        y: 217,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 433,
        y: 137,
        rotation: -0.2
    }, {
        type: "carriage1_lvl14",
        x: 114,
        y: 192,
        rotation: 0
    }, {
        type: "carriage2_lvl14",
        x: 198,
        y: 57,
        rotation: 0
    }, {
        type: "carriage3_lvl14",
        x: 288,
        y: 65,
        rotation: 0
    }, {
        type: "carriage4_lvl14",
        x: 375,
        y: 160,
        rotation: 0
    }, {
        type: "pc1",
        x: 107,
        y: 57,
        rotation: 0
    }, {
        type: "pc2",
        x: 195,
        y: 33.5,
        rotation: 0
    }, {
        type: "pc3",
        x: 286,
        y: 57.5,
        rotation: 0
    }, {
        type: "pc4",
        x: 365,
        y: 35,
        rotation: 0
    }, {
        type: "circle_lvl14",
        x: 113,
        y: 111,
        rotation: 0
    }, {
        type: "circle_lvl14",
        x: 198,
        y: 63,
        rotation: 0
    }, {
        type: "circle_lvl14",
        x: 289,
        y: 111,
        rotation: 0
    }, {
        type: "button_blue_left",
        x: 88,
        y: 85,
        rotation: 0,
        custom: 'button_left_down'
    }, {
        type: "button_blue_right",
        x: 128,
        y: 85,
        rotation: 0,
        custom: 'button_left_up'
    }, {
        type: "button_blue_mid",
        x: 108,
        y: 85,
        rotation: 0
    }, {
        type: "button_blue_left",
        x: 270,
        y: 62,
        rotation: 0,
        custom: 'button_right_down'
    }, {
        type: "button_blue_right",
        x: 310,
        y: 62,
        rotation: 0,
        custom: 'button_right_up'
    }, {
        type: "button_blue_mid",
        x: 290,
        y: 62,
        rotation: 0
    }, {
        type: "circle_exit",
        x: 375,
        y: 86,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "mechanism_lvl15",
        x: 269.5,
        y: 253,
        rotation: 0
    }, {
        type: "tube1",
        x: 16,
        y: 224,
        rotation: 0
    }, {
        type: "tube2",
        x: 472,
        y: 224,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 123,
        y: 247,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 421,
        y: 247,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 234,
        y: 31,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 311,
        y: 43,
        rotation: 1.5707963267948966
    }, {
        type: "bridge_lvl15",
        x: 224,
        y: 117,
        rotation: 0
    }, {
        type: "circle_lvl15",
        x: 420,
        y: 116,
        rotation: 0
    }, {
        type: "button_blue_left",
        x: 352,
        y: 93,
        rotation: 0
    }, {
        type: "button_blue_right",
        x: 392,
        y: 93,
        rotation: 0
    }, {
        type: "button_blue_mid",
        x: 372,
        y: 93,
        rotation: 0
    }, {
        type: "Lever4",
        x: 331,
        y: 282,
        rotation: 0
    }, {
        type: "lever_cover_left",
        x: 342,
        y: 284,
        rotation: 0
    }, {
        type: "prop_lvl15",
        x: 320,
        y: 60,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 270,
        y: 251,
        rotation: 0,
        custom: 'mechanismBody'
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: -11,
        y: 260,
        rotation: 0
    }, {
        type: "tube2",
        x: 479,
        y: 253,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 31,
        y: 281,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 103,
        y: 295,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: -10,
        y: 193,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 445,
        y: 33,
        rotation: 0
    }, {
        type: "latch_lvl16",
        x: 429,
        y: 44,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 398,
        y: 97,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 398,
        y: 146,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 428,
        y: 173,
        rotation: 0
    }, {
        type: "pump_up",
        x: 51,
        y: 121,
        rotation: 0
    }, {
        type: "pump_down",
        x: 74,
        y: 172,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 391,
        y: 276,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 391,
        y: 281,
        rotation: 0
    }, {
        type: "button_blue_left",
        x: 52,
        y: 61,
        rotation: 0,
        custom: "button1_left"
    }, {
        type: "button_blue_right",
        x: 93,
        y: 61,
        rotation: 0,
        custom: "button1_right"
    }, {
        type: "button_blue_left",
        x: 177,
        y: 31,
        rotation: 0,
        custom: "button2_left"
    }, {
        type: "button_blue_right",
        x: 218,
        y: 31,
        rotation: 0,
        custom: "button2_right"
    }, {
        type: "bridge_lvl16",
        x: 158,
        y: 104,
        rotation: 0.8000000000000002,
        custom: "bridge1"
    }, {
        type: "circle_lvl16",
        x: 158,
        y: 104,
        rotation: 0
    }, {
        type: "bridge_lvl16",
        x: 260,
        y: 75,
        rotation: 1.5707963267948966,
        custom: "bridge2"
    }, {
        type: "circle_lvl16",
        x: 260,
        y: 75,
        rotation: 0
    }, {
        type: "ball1",
        x: 143,
        y: 223,
        rotation: 0
    }, {
        type: "basket_invisible",
        x: 143,
        y: 285,
        rotation: 0
    }, ],
    joints: [{
        type: 0,
        point1: {
            x: 116,
            y: 280
        }
    }, {
        type: 0,
        point1: {
            x: 169,
            y: 280
        }
    }, ]
}, {
    objects: [{
        type: "tube1",
        x: 5,
        y: 266,
        rotation: 0
    }, {
        type: "tube2",
        x: 470,
        y: 246,
        rotation: -0.2
    }, {
        type: "invisible_wall_big",
        x: 414.5,
        y: 281.5,
        rotation: -0.25
    }, {
        type: "invisible_wall_big",
        x: 376.5,
        y: 287,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 225.5,
        y: 287,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 74.5,
        y: 287,
        rotation: 0
    }, {
        type: "bridge_lvl17",
        x: 151,
        y: 176,
        rotation: 0
    }, {
        type: "button_blue_left",
        x: 163,
        y: 99,
        rotation: 0
    }, {
        type: "button_blue_right",
        x: 203,
        y: 99,
        rotation: 0
    }, {
        type: "button_blue_mid",
        x: 183,
        y: 99,
        rotation: 0
    }, {
        type: "FireTimeAnim",
        x: 346,
        y: 126,
        rotation: 0
    }, {
        type: "btn_Fire",
        x: 129,
        y: 219,
        rotation: 0,
        custom: 'leftButton'
    }, {
        type: "btn_Fire",
        x: 238,
        y: 219,
        rotation: 0,
        custom: 'rightButton'
    }, {
        type: "earth_lvl17",
        x: 366.5,
        y: 172.5,
        rotation: 0
    }, {
        type: "fire_lvl17",
        x: 131,
        y: 217,
        rotation: 0,
        custom: 'leftFire'
    }, {
        type: "fire_lvl17",
        x: 240,
        y: 217,
        rotation: 0,
        custom: 'middleFire'
    }, {
        type: "fire_lvl17",
        x: 346,
        y: 216,
        rotation: 0,
        custom: 'rightFire'
    }, {
        type: "fire_small",
        x: 132,
        y: 172,
        rotation: 0,
        custom: 'leftSmallFire'
    }, {
        type: "fire_small",
        x: 241,
        y: 172,
        rotation: 0,
        custom: 'middleSmallFire'
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube2",
        x: 485,
        y: 148,
        rotation: 0
    }, {
        type: "tube1",
        x: -7,
        y: 150,
        rotation: 0
    }, {
        type: "barrier_lvl10",
        x: 409,
        y: 84,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 74,
        y: 173,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 170,
        y: 173,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 193,
        y: 197,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 202,
        y: 259,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 265,
        y: 250,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 420,
        y: 170,
        rotation: 0
    }, {
        type: "energy_box",
        x: 153,
        y: 35,
        rotation: 0
    }, {
        type: "Lever4",
        x: 115,
        y: 27,
        rotation: 0,
        custom: "Lever1"
    }, {
        type: "mechanism",
        x: 153,
        y: 55,
        rotation: 0
    }, {
        type: "up_cover_lvl10",
        x: 125,
        y: 29,
        rotation: 0
    }, {
        type: "small_tube_lvl10",
        x: 410,
        y: 12,
        rotation: 0
    }, {
        type: "lantern",
        x: 410,
        y: 5,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 235,
        y: 270,
        rotation: 0
    }, {
        type: "button_red",
        x: 92,
        y: 243,
        rotation: 0
    }, {
        type: "bridge_lvl10",
        x: 236,
        y: 177,
        rotation: 0
    }, {
        type: "pillar_lvl10",
        x: 272,
        y: 196,
        rotation: 0
    }, {
        type: "Lever4",
        x: 293,
        y: 197,
        rotation: 0,
        custom: "Lever2"
    }, {
        type: "lever_cover_right",
        x: 283,
        y: 198,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 348,
        y: 245,
        rotation: 1.5707963267948966
    }, {
        type: "minus_plus",
        x: 238,
        y: 277,
        rotation: 0
    }, {
        type: "radiationAnim1",
        x: 92,
        y: 282,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube1",
        x: -3,
        y: 217,
        rotation: 0
    }, {
        type: "tube2",
        x: 6,
        y: 116,
        rotation: 3.141592653589793
    }, {
        type: "bridge2_lvl18",
        x: 207,
        y: 144,
        rotation: 0
    }, {
        type: "bridge1_lvl18",
        x: 175,
        y: 242,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 16,
        y: 237,
        rotation: 0
    }, {
        type: "lift_lvl18",
        x: 345,
        y: 229,
        rotation: 0
    }, {
        type: "Baraban",
        x: 416,
        y: 242,
        rotation: 0
    }, {
        type: "slider",
        x: 416,
        y: 274,
        rotation: 0
    }, {
        type: "zemlaUp",
        x: 197,
        y: 134,
        rotation: 0
    }, {
        type: "trans1",
        x: 158,
        y: 24,
        rotation: 0
    }, {
        type: "earth_lvl18",
        x: 233,
        y: 267,
        rotation: 0
    }, {
        type: "btnForTrans",
        x: 208,
        y: 42,
        rotation: 0,
        custom: 'btnLeft'
    }, {
        type: "btnForTrans",
        x: 232,
        y: 42,
        rotation: 0,
        custom: 'btnMiddle'
    }, {
        type: "btnForTrans",
        x: 257,
        y: 42,
        rotation: 0,
        custom: 'btnRight'
    }, {
        type: "lantern_lvl18",
        x: 158,
        y: 244,
        rotation: 0,
        custom: 'lanternLeft'
    }, {
        type: "lantern_lvl18",
        x: 309,
        y: 287,
        rotation: 0,
        custom: 'lanternMiddle'
    }, {
        type: "lantern_lvl18",
        x: 234,
        y: 144,
        rotation: 0,
        custom: 'lanternRight'
    }, {
        type: "red_lvl18",
        x: 206,
        y: 63,
        rotation: 0,
        custom: 'redLeft'
    }, {
        type: "red_lvl18",
        x: 231,
        y: 63,
        rotation: 0,
        custom: 'redMiddle'
    }, {
        type: "red_lvl18",
        x: 256,
        y: 63,
        rotation: 0,
        custom: 'redRight'
    }, {
        type: "green_lvl18",
        x: 256,
        y: 22,
        rotation: 0,
        custom: 'greenRight'
    }, {
        type: "green_lvl18",
        x: 231,
        y: 22,
        rotation: 0,
        custom: 'greenMiddle'
    }, {
        type: "green_lvl18",
        x: 207,
        y: 22,
        rotation: 0,
        custom: 'greenLeft'
    }, {
        type: "invisible_wall_big",
        x: 222,
        y: 237,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 291,
        y: 237,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 466,
        y: 219,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 169,
        y: 138,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 19,
        y: 138,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 149,
        y: 310,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 89,
        y: 310,
        rotation: 1.5707963267948966
    }, {
        type: "current_lvl18",
        x: 226,
        y: 225,
        rotation: 0,
        custom: 'currentDown'
    }, {
        type: "current_lvl18",
        x: 166,
        y: 57,
        rotation: 0,
        custom: 'currentUp'
    }, {
        type: "smoke1_lvl11",
        x: 161,
        y: 10,
        rotation: 0
    }, {
        type: "smoke2_lvl11",
        x: 161,
        y: 10,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube2",
        x: 448,
        y: 48,
        rotation: 0
    }, {
        type: "entrance_lvl7",
        x: 338,
        y: 75,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 136,
        y: 139,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 185,
        y: 139,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 216,
        y: 139,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 434,
        y: 70,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 388,
        y: 73,
        rotation: -0.15000000000000002
    }, {
        type: "invisible_wall_small",
        x: 320,
        y: 167,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 393,
        y: 140,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 51,
        y: 210,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 51,
        y: 60,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 249.5,
        y: 214,
        rotation: -0.2792526803190927,
        custom: 'slip'
    }, {
        type: "invisible_wall_small",
        x: 157,
        y: 241,
        rotation: -0.2792526803190927,
        custom: 'slip2'
    }, {
        type: "spring_up",
        x: 81,
        y: 251,
        rotation: 0,
        custom: 'springDown'
    }, {
        type: "spring",
        x: 426,
        y: 110,
        rotation: 0,
        custom: 'springRight'
    }, {
        type: "spring_up",
        x: 58,
        y: 104,
        rotation: 1.5707963267948966,
        custom: 'springLeft'
    }, {
        type: "foundation2",
        x: 25,
        y: 104,
        rotation: 1.5707963267948966
    }, {
        type: "foundation2",
        x: 80,
        y: 287,
        rotation: 0
    }, {
        type: "foundation",
        x: 455,
        y: 109,
        rotation: 0
    }, {
        type: "cover_lvl19",
        x: 121,
        y: 212,
        rotation: 0
    }, {
        type: "bridge_lvl19",
        x: 268,
        y: 123,
        rotation: -0.55
    }, {
        type: "circle_lvl19",
        x: 234,
        y: 145,
        rotation: 0
    }, {
        type: "button_red",
        x: 29,
        y: 173,
        rotation: 0,
        custom: 'buttonLeft'
    }, {
        type: "button_red",
        x: 29,
        y: 261,
        rotation: 0,
        custom: 'buttonDown'
    }, {
        type: "button_red",
        x: 437,
        y: 166,
        rotation: 0,
        custom: 'buttonRight'
    }, {
        type: "button_red",
        x: 151,
        y: 153,
        rotation: 0,
        custom: 'buttonBridge'
    }, {
        type: "invisible_wall_small",
        x: 436,
        y: 111,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 80,
        y: 261,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 115,
        y: 162,
        rotation: Math.PI / 2
    }, {
        type: "btn02",
        x: 280,
        y: 201,
        rotation: -0.2792526803190927
    }, {
        type: "earth_lvl19",
        x: 120.5,
        y: 281.5,
        rotation: 0
    }, ],
    joints: []
}, {
    objects: [{
        type: "tube2",
        x: 459,
        y: 93,
        rotation: 0
    }, {
        type: "tube1",
        x: 10,
        y: 165,
        rotation: 0,
        custom: true
    }, {
        type: "bridgeDown_lvl20",
        x: 112,
        y: 194,
        rotation: 0
    }, {
        type: "earthDown_lvl20",
        x: 40,
        y: 192.5,
        rotation: 0
    }, {
        type: "lift_lvl20",
        x: 258,
        y: 303,
        rotation: 0
    }, {
        type: "lift_cover1",
        x: 262,
        y: 260,
        rotation: 0
    }, {
        type: "button_red",
        x: 258,
        y: 236,
        rotation: 0,
        custom: 'buttonLift'
    }, {
        type: "lift_cover2",
        x: 258,
        y: 263,
        rotation: 0
    }, {
        type: "bridgeUp_lvl20",
        x: 190,
        y: 118,
        rotation: 0
    }, {
        type: "Baraban",
        x: 188,
        y: 196,
        rotation: 0,
        custom: 'leftBaraban'
    }, {
        type: "Baraban",
        x: 331,
        y: 196,
        rotation: 0,
        custom: 'rightBaraban'
    }, {
        type: "invisible_wall_big",
        x: 115,
        y: 260,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 71,
        y: 232,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 152,
        y: 234,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_small",
        x: 50,
        y: 188,
        rotation: 0
    }, {
        type: "earthUp_lvl20",
        x: 164,
        y: 124,
        rotation: 0
    }, {
        type: "mechanism",
        x: 255,
        y: 64,
        rotation: 0
    }, {
        type: "button_red",
        x: 194,
        y: 37,
        rotation: 0,
        custom: 'buttonMechanism'
    }, {
        type: "invisible_wall_small",
        x: 372,
        y: 237,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 389,
        y: 267,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 461,
        y: 239,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 147,
        y: 114,
        rotation: 0
    }, {
        type: "invisible_wall_big",
        x: 25,
        y: 114,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 1,
        y: 89,
        rotation: 1.5707963267948966
    }, {
        type: "invisible_wall_big",
        x: 367,
        y: 114,
        rotation: 0
    }, {
        type: "invisible_wall_small",
        x: 460,
        y: 114,
        rotation: 0
    }, {
        type: "boxRed",
        x: 255,
        y: 7,
        rotation: 0
    }, {
        type: "boxGreen",
        x: 255,
        y: 42,
        rotation: 0
    }, {
        type: "turnBtn_lvl18",
        x: 188,
        y: 227,
        rotation: 0,
        custom: 'turnBtnLeft'
    }, {
        type: "turnBtn_lvl18",
        x: 331,
        y: 227,
        rotation: 0,
        custom: 'turnBtnRight'
    }, {
        type: "lantern_lvl18",
        x: 69,
        y: 194,
        rotation: 0,
        custom: 'lanternDown'
    }, {
        type: "lantern_lvl18",
        x: 201,
        y: 120,
        rotation: 0,
        custom: 'lanternUp'
    }, {
        type: "Lever2",
        x: 102,
        y: 97,
        rotation: 0
    }, {
        type: "lever_cover_down",
        x: 101,
        y: 110,
        rotation: 0
    }, {
        type: "minus_plus_red",
        x: 111,
        y: 268,
        rotation: 0
    }, {
        type: "minus_plus_green",
        x: 415,
        y: 276,
        rotation: 0
    }, ],
    joints: []
}];;
var NONE = 0;
var BOX = 1;
var CIRCLE = 2;
var POLY = 3;
var NORMAL = 0;
var BOB = 1;
var PLATFORM = 4;

function spritesSync(e, x, y) {
    var p = new Vector(-e.target.syncX, -e.target.syncY);
    p.rotate(-e.target.rotation);
    e.target.x += p.x;
    e.target.y += p.y;
}
var stone_density = 6.0;
var stone_restitution = 0;
var stone_friction = 1;
var platform_density = 300.0 * 10000;
var platform_restitution = -10;
var platform_friction = 0;
var obstacle_density = 10000.0;
var obstacle_restitution = 0;
var obstacle_friction = 0;
var BOB_density = 10;
var BOB_restitution = 0;
var BOB_friction = 0;
var objects = [{
    name: "Bob",
    image: "Bob.png",
    type: BOX,
    width: 48,
    height: 39,
    bodyWidth: 35,
    bodyHeight: 39,
    frames: 1,
    bodyType: CIRCLE,
    bodyPosCorrect: {
        x: 0,
        y: -1
    },
    remove: false,
    fixed: false,
    density: BOB_density,
    restitution: BOB_restitution,
    friction: BOB_friction
}, {
    name: "tube1",
    image: "tube1.png",
    type: BOX,
    width: 74,
    height: 47,
    bodyWidth: 55,
    bodyHeight: 5,
    frames: 1,
    bodyType: BOX,
    bodyPosCorrect: {
        x: 8,
        y: 20
    },
    remove: false,
    fixed: true,
    info: 'entrance',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "tube2",
    image: "tube2.png",
    type: BOX,
    width: 74,
    height: 47,
    bodyWidth: 55,
    bodyHeight: 5,
    frames: 1,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 24.5
    },
    remove: false,
    fixed: true,
    info: 'destination',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "BackTube",
    image: "BackTube.png",
    type: BOX,
    width: 4,
    height: 47,
    bodyWidth: 4,
    bodyHeight: 47,
    frames: 1,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 22
    },
    remove: false,
    fixed: true,
    info: 'BackTube',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "TubeCoverMc",
    image: "TubeCoverMc.png",
    type: BOX,
    width: 8,
    height: 47,
    bodyWidth: 8,
    bodyHeight: 46,
    frames: 1,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 25
    },
    remove: false,
    fixed: true,
    info: 'TubeCoverMc',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "invisible_wall_small",
    image: "invisible_wall_small.png",
    type: PLATFORM,
    width: 50,
    height: 5,
    bodyWidth: 50,
    bodyHeight: 5,
    frames: 1,
    bodyType: BOX,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'invisible',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "invisible_wall_big",
    image: "invisible_wall_big.png",
    type: PLATFORM,
    width: 150,
    height: 5,
    bodyWidth: 150,
    bodyHeight: 5,
    frames: 1,
    bodyType: BOX,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'invisible',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "Hint",
    image: "Hint.png",
    type: CIRCLE,
    width: 30,
    height: 30,
    bodyWidth: 30,
    bodyHeight: 30,
    frames: 1,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'hint',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "slider",
    image: 'slider.png',
    type: BOX,
    width: 24,
    height: 23,
    bodyWidth: 24,
    bodyHeight: 23,
    frames: 1,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'slider',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "Baraban",
    image: 'Baraban.png',
    type: BOX,
    width: 75,
    height: 30,
    bodyWidth: 75,
    bodyHeight: 30,
    frames: 14,
    bodyType: BOX,
    bodyPosCorrect: {
        x: 0,
        y: 3
    },
    remove: false,
    fixed: true,
    info: 'Baraban',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "button_blue_left",
    image: 'button_blue_left.png',
    width: 28,
    height: 26,
    frames: 1,
    bodyType: NONE,
    info: 'button_blue_left',
}, {
    name: "button_blue_mid",
    image: 'button_blue_mid.png',
    width: 15,
    height: 31,
    frames: 1,
    bodyType: NONE,
    info: 'button_blue_mid',
}, {
    name: "button_blue_right",
    image: 'button_blue_right.png',
    width: 28,
    height: 26,
    frames: 1,
    bodyType: NONE,
    info: 'button_blue_right',
}, {
    name: "button_blue_down",
    image: 'button_blue_down.png',
    width: 26,
    height: 28,
    frames: 1,
    bodyType: NONE,
    info: 'button_blue_down',
}, {
    name: "button_blue_up",
    image: 'button_blue_up.png',
    width: 26,
    height: 28,
    frames: 1,
    bodyType: NONE,
    info: 'button_blue_up',
}, {
    name: "button_red",
    image: "button_red.png",
    width: 25,
    height: 25,
    frames: 3,
    bodyType: NONE,
    info: 'button_red',
}, {
    name: "button_blue",
    image: "button_blue.png",
    width: 24,
    height: 24,
    frames: 1,
    bodyType: NONE,
    info: 'button_blue',
}, {
    name: "lever_cover_down",
    image: "lever_cover_down.png",
    width: 29,
    height: 6,
    frames: 1,
    bodyType: NONE,
    info: 'lever_cover_down',
}, {
    name: "lever_cover_up",
    image: "lever_cover_up.png",
    width: 29,
    height: 6,
    frames: 1,
    bodyType: NONE,
    info: 'lever_cover_up',
}, {
    name: "lever_cover_left",
    image: "lever_cover_left.png",
    width: 6,
    height: 29,
    frames: 1,
    bodyType: NONE,
    info: 'lever_cover_left',
}, {
    name: "lever_cover_right",
    image: "lever_cover_right.png",
    width: 6,
    height: 29,
    frames: 1,
    bodyType: NONE,
    info: 'lever_cover_right',
}, {
    name: "mechanism",
    image: 'mechanism.png',
    width: 116,
    height: 12,
    frames: 8,
    bodyType: NONE,
    info: 'mechanism',
}, {
    name: "DoorLevel01",
    image: "levels/01/DoorLevel01.png",
    type: PLATFORM,
    width: 18,
    height: 340,
    bodyWidth: 18,
    bodyHeight: 340,
    frames: 1,
    bodyType: BOX,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'DoorLevel01',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "yellow_element",
    image: "levels/01/yellow_element.png",
    type: PLATFORM,
    width: 23,
    height: 19,
    bodyWidth: 23,
    bodyHeight: 19,
    frames: 1,
    bodyType: BOX,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'yellow_element',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "Lever1",
    image: "levels/01/Lever1.png",
    type: BOX,
    width: 40,
    height: 39,
    bodyWidth: 40,
    bodyHeight: 39,
    frames: 6,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'Lever1',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "Spring",
    image: "levels/01/Spring.png",
    type: BOX,
    width: 94,
    height: 80,
    bodyWidth: 50,
    bodyHeight: 10,
    frames: 9,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'Spring',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "Hint1_Level10001",
    image: 'levels/01/Hint1_Level10001.png',
    width: 125,
    height: 7,
    frames: 1,
    bodyType: NONE,
    info: 'Hint1_Level10001',
}, {
    name: "Hint2_Level10001",
    image: 'levels/01/Hint2_Level10001.png',
    width: 125,
    height: 34,
    frames: 1,
    bodyType: NONE,
    info: 'Hint2_Level10001',
}, {
    name: "Lever2",
    image: "levels/02/Lever2.png",
    type: BOX,
    width: 40,
    height: 39,
    bodyWidth: 40,
    bodyHeight: 39,
    frames: 6,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'Lever2',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "crossbar",
    image: "levels/02/perekladina.png",
    width: 95,
    height: 13,
    bodyWidth: 95,
    bodyHeight: 10,
    frames: 1,
    bodyType: BOX,
    remove: false,
    fixed: true,
    info: 'crossbar',
    density: 0.1,
    restitution: 0,
    friction: 0
}, {
    name: "conveyor",
    image: 'levels/02/conveyor.png',
    width: 364,
    height: 20,
    bodyWidth: 354,
    bodyHeight: 14,
    frames: 13,
    bodyType: BOX,
    remove: false,
    fixed: true,
    info: 'conveyor',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "electric_detail",
    image: 'levels/02/electric_detail.png',
    width: 32,
    height: 36,
    bodyHeight: 32,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'electric_detail',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "electricity_10",
    image: 'levels/02/electricity_10.png',
    width: 44,
    height: 42,
    frames: 10,
    bodyType: NONE,
    info: 'electricity_10'
}, {
    name: "btn02",
    image: 'levels/02/btn.png',
    width: 37,
    height: 12,
    frames: 2,
    bodyType: NONE,
    info: 'btn02'
}, {
    name: "ArrowAnim_yellow0001",
    image: 'levels/02/ArrowAnim_yellow0001.png',
    width: 29,
    height: 16,
    frames: 1,
    bodyType: NONE,
    info: 'ArrowAnim_yellow0001',
}, {
    name: "ArrowAnim0001",
    image: 'levels/02/ArrowAnim0001.png',
    width: 20,
    height: 33,
    frames: 1,
    bodyType: NONE,
    info: 'ArrowAnim0001',
}, {
    name: "HintClickBob_Level20001",
    image: 'levels/02/HintClickBob_Level20001.png',
    width: 45,
    height: 8,
    frames: 1,
    bodyType: NONE,
    info: 'HintClickBob_Level20001',
}, {
    name: "HintMc1_Level20001",
    image: 'levels/02/HintMc1_Level20001.png',
    width: 130,
    height: 16,
    frames: 1,
    bodyType: NONE,
    info: 'HintMc1_Level20001',
}, {
    name: "HintMc2_Level20001",
    image: 'levels/02/HintMc2_Level20001.png',
    width: 80,
    height: 17,
    frames: 1,
    bodyType: NONE,
    info: 'HintMc2_Level20001',
}, {
    name: "HintMc3_Level20001",
    image: 'levels/02/HintMc3_Level20001.png',
    width: 100,
    height: 38,
    frames: 1,
    bodyType: NONE,
    info: 'HintMc3_Level20001',
}, {
    name: "button_blue_mid_lvl3",
    image: 'levels/03/button-blue-mid-lvl3.png',
    width: 31,
    height: 15,
    frames: 1,
    bodyType: NONE,
    info: 'button_blue_mid_lvl3',
}, {
    name: "Lift_lv3",
    image: 'levels/03/Lift_lv3.png',
    type: BOX,
    width: 111,
    height: 24,
    bodyWidth: 100,
    bodyHeight: 20,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'Lift_lv3',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "Hint1_Level30001",
    image: 'levels/03/Hint1_Level30001.png',
    width: 114,
    height: 22,
    frames: 1,
    bodyType: NONE,
    info: 'Hint1_Level30001',
}, {
    name: "HoldText0001",
    image: 'levels/03/HoldText0001.png',
    width: 37,
    height: 14,
    frames: 1,
    bodyType: NONE,
    info: 'HoldText0001',
}, {
    name: "Latch_lvl4",
    image: 'levels/04/Latch_lvl4.png',
    width: 56,
    height: 19,
    frames: 1,
    bodyType: POLY,
    info: 'Latch_lvl4',
    fixed: false,
    density: 10,
    restitution: 0.1,
    friction: 1,
    points: [
        [
            [-28, -9],
            [28, -9],
            [28, -3],
            [-28, -3]
        ],
        [
            [-28, -3],
            [-7, -3],
            [-7, 9],
            [-28, 9]
        ]
    ]
}, {
    name: "wooden_cross_lvl4",
    image: 'levels/04/wooden_cross_lvl4.png',
    width: 209,
    height: 210,
    frames: 1,
    bodyType: POLY,
    info: 'wooden_cross_lvl4',
    fixed: false,
    density: 4,
    restitution: 0.1,
    friction: 0.6,
    points: [
        [
            [-104, -5],
            [104, -5],
            [104, 5],
            [-104, 5]
        ],
        [
            [-3, -104],
            [7, -104],
            [7, 104],
            [-3, 104]
        ]
    ]
}, {
    name: "stone_lvl4",
    image: 'levels/04/stone_lvl4.png',
    width: 38,
    height: 38,
    frames: 1,
    bodyType: CIRCLE,
    info: 'stone_lvl4',
    fixed: false,
    density: 5.5,
    restitution: 0.1,
    friction: 5
}, {
    name: "Lever4",
    image: "levels/04/Lever4.png",
    type: BOX,
    width: 40,
    height: 41,
    frames: 6,
    bodyType: NONE,
    fixed: true,
    info: 'Lever4',
}, {
    name: "Bridge_lvl5",
    image: 'levels/05/Bridge_lvl5.png',
    type: BOX,
    width: 134,
    height: 19,
    bodyWidth: 130,
    bodyHeight: 15,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'Bridge_lvl5',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "wagon_whel_lvl5",
    image: 'levels/05/wagon_whel_lvl5.png',
    type: BOX,
    width: 19,
    height: 19,
    frames: 1,
    bodyType: CIRCLE,
    fixed: false,
    info: 'wagon_whel_lvl5',
    density: 10,
    restitution: 0.1,
    friction: 0.6
}, {
    name: "wagon_lvl5",
    image: 'levels/05/wagon_lvl5.png',
    type: BOX,
    width: 59,
    height: 46,
    frames: 1,
    bodyType: POLY,
    fixed: false,
    info: 'wagon_lvl5',
    density: 10,
    restitution: 0.1,
    friction: 0.6,
    points: [
        [
            [-29, -23],
            [-25, -23],
            [-13, -6],
            [-21, 6]
        ],
        [
            [25, -23],
            [29, -23],
            [21, 6],
            [13, -6]
        ],
        [
            [-21, -8],
            [21, -8],
            [21, 9.5],
            [-21, 9.5]
        ]
    ]
}, {
    name: "wood_on_rope_lvl5",
    image: "levels/05/wood_on_rope_lvl5.png",
    type: PLATFORM,
    width: 23,
    height: 204,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'wood_on_rope_lvl5',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "tube5",
    image: "tube1.png",
    width: 74,
    height: 47,
    frames: 1,
    bodyType: NONE,
    info: 'tube5',
}, {
    name: "peregorodka_lvl5",
    image: "levels/05/peregorodka_lvl5.png",
    width: 15,
    height: 31,
    frames: 1,
    bodyType: NONE,
    info: 'peregorodka_lvl5',
}, {
    name: "btn_lvl6",
    image: "levels/06/btn_lvl6.png",
    width: 42,
    height: 14,
    frames: 4,
    bodyType: NONE,
    info: 'btn_lvl6',
}, {
    name: "cable_lvl6",
    image: "levels/06/cable_lvl6.png",
    width: 19,
    height: 136,
    frames: 1,
    bodyType: NONE,
    info: 'cable_lvl6',
}, {
    name: "earth_lvl6",
    image: "levels/06/earth_lvl6.png",
    width: 210,
    height: 108,
    frames: 1,
    bodyType: NONE,
    info: 'earth_lvl6',
}, {
    name: "spring",
    image: "levels/06/spring.png",
    width: 46,
    height: 38,
    frames: 12,
    bodyType: NONE,
    info: 'spring',
}, {
    name: "ball_falls_lvl6",
    image: "levels/06/ball_falls_lvl6.png",
    width: 90,
    height: 36,
    frames: 1,
    bodyType: NONE,
    info: 'ball_falls_lvl6',
}, {
    name: "tube_lvl6",
    image: "levels/06/tube_lvl6.png",
    type: PLATFORM,
    width: 15,
    height: 86,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'tube_lvl6',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "brig",
    image: "levels/06/brig.png",
    type: PLATFORM,
    width: 210,
    height: 25,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'brig',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "stone_lvl6",
    image: 'levels/06/stone_lvl6.png',
    width: 26,
    height: 26,
    frames: 1,
    bodyType: CIRCLE,
    info: 'stone_lvl6',
    fixed: false,
    density: 0.6,
    restitution: 0,
    friction: 0
}, {
    name: "entrance_lvl7",
    image: 'invisible_wall_small.png',
    type: BOX,
    width: 66,
    height: 41,
    bodyWidth: 50,
    bodyHeight: 5,
    frames: 1,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 5,
        y: 5
    },
    remove: false,
    fixed: true,
    info: 'invisible_entrance',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "fence",
    image: 'levels/07/fence.png',
    type: BOX,
    width: 88,
    height: 52,
    bodyWidth: 88,
    bodyHeight: 52,
    frames: 1,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'fence',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "Girlfriend",
    image: 'levels/07/Girlfriend.png',
    type: BOX,
    width: 52,
    height: 43.5,
    bodyWidth: 30,
    bodyHeight: 30,
    frames: 14,
    bodyType: CIRCLE,
    bodyPosCorrect: {
        x: 0,
        y: 3
    },
    remove: false,
    fixed: false,
    info: 'Girlfriend',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "ice",
    image: 'levels/07/ice.png',
    type: BOX,
    width: 79,
    height: 66,
    bodyWidth: 24,
    bodyHeight: 55,
    frames: 10,
    bodyType: BOX,
    bodyPosCorrect: {
        x: 2,
        y: -5
    },
    remove: false,
    fixed: false,
    info: 'ice',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "Stove",
    image: 'levels/07/Stove.png',
    type: BOX,
    width: 96,
    height: 144 / 3,
    bodyWidth: 96,
    bodyHeight: 143 / 3,
    frames: 3,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'Stove',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "oven_lever",
    image: 'levels/07/oven_lever.png',
    type: BOX,
    width: 42,
    height: 38,
    bodyWidth: 42,
    bodyHeight: 38,
    frames: 1,
    bodyType: NONE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'oven_lever',
    density: 0,
    restitution: 0,
    friction: 0
}, {
    name: "Lift_lv7",
    image: "levels/07/Lift_lv7.png",
    type: BOX,
    width: 67,
    height: 30,
    bodyWidth: 67,
    bodyHeight: 12,
    frames: 1,
    bodyType: BOX,
    bodyPosCorrect: {
        x: 0,
        y: -5
    },
    remove: false,
    fixed: true,
    info: 'Lift_lv7',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "Btn_lv7",
    image: "levels/07/Btn_lv7.png",
    type: BOX,
    width: 25,
    height: 24,
    bodyWidth: 25,
    bodyHeight: 24,
    frames: 2,
    bodyType: CIRCLE,
    bodyPosCorrect: {
        x: 0,
        y: 0
    },
    remove: false,
    fixed: true,
    info: 'Btn_lv7',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "latch_lvl8",
    image: 'levels/08/latch_lvl8.png',
    width: 96,
    height: 26,
    frames: 1,
    bodyType: POLY,
    info: 'latch_lvl8',
    fixed: true,
    density: 10,
    restitution: 0.1,
    friction: 1,
    points: [
        [
            [-47, -12],
            [47, -12],
            [47, 0],
            [-47, 0]
        ],
        [
            [-47, 0],
            [-29, 0],
            [-29, 12],
            [-47, 12]
        ]
    ]
}, {
    name: "before_bridge_lvl8",
    image: "levels/08/before_bridge_lvl8.png",
    width: 112,
    height: 33,
    frames: 1,
    bodyType: NONE,
    info: 'before_bridge_lvl8',
}, {
    name: "bridge_lvl8",
    image: "levels/08/bridge_lvl8.png",
    type: PLATFORM,
    width: 61,
    height: 22,
    bodyHeight: 18,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge_lvl8',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "spring_up",
    image: "levels/08/spring_up.png",
    width: 64,
    height: 60,
    frames: 12,
    bodyType: NONE,
    info: 'spring_up',
}, {
    name: "button_lvl9",
    image: "levels/09/button_lvl9.png",
    width: 28,
    height: 28,
    frames: 3,
    bodyType: NONE,
    info: 'button_lvl9',
}, {
    name: "bridge_lvl9",
    image: "levels/09/bridge_lvl9.png",
    type: PLATFORM,
    width: 39,
    height: 17,
    bodyHeight: 14,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge_lvl9',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "earth1_lvl9",
    image: "levels/09/earth1_lvl9.png",
    width: 57,
    height: 48,
    bodyWidth: 51,
    frames: 1,
    bodyType: BOX,
    info: 'earth_lvl9',
    fixed: true,
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "earth2_lvl9",
    image: "levels/09/earth2_lvl9.png",
    width: 57,
    height: 40,
    bodyWidth: 51,
    frames: 1,
    bodyType: BOX,
    info: 'earth_lvl9',
    fixed: true,
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "earth3_lvl9",
    image: "levels/09/earth3_lvl9.png",
    width: 56,
    height: 46,
    bodyWidth: 50,
    frames: 1,
    bodyType: BOX,
    info: 'earth_lvl9',
    fixed: true,
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "earth4_lvl9",
    image: "levels/09/earth4_lvl9.png",
    width: 64,
    height: 75,
    bodyWidth: 58,
    bodyHeight: 71,
    frames: 1,
    bodyType: BOX,
    info: 'earth_lvl9',
    fixed: true,
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "lamp",
    image: "levels/09/lamp.png",
    width: 76,
    height: 58,
    frames: 1,
    bodyType: NONE,
    info: 'lamp',
}, {
    name: "wire",
    image: "levels/09/wire.png",
    width: 376,
    height: 166,
    frames: 1,
    bodyType: NONE,
    info: 'wire',
}, {
    name: "energy_box",
    image: 'levels/10/energy_box.png',
    type: BOX,
    width: 29,
    height: 27,
    frames: 1,
    bodyType: BOX,
    fixed: false,
    info: 'energy_box',
    density: 5,
    restitution: 0,
    friction: 0.6
}, {
    name: "lantern",
    image: "levels/10/lantern.png",
    width: 18,
    height: 14,
    frames: 2,
    bodyType: NONE,
    info: 'lantern',
}, {
    name: "pillar_lvl10",
    image: "levels/10/pillar_lvl10.png",
    width: 18,
    height: 54,
    frames: 1,
    bodyType: NONE,
    info: 'pillar_lvl10',
}, {
    name: "small_tube_lvl10",
    image: "levels/10/small_tube_lvl10.png",
    width: 18,
    height: 17,
    frames: 1,
    bodyType: NONE,
    info: 'small_tube_lvl10',
}, {
    name: "up_cover_lvl10",
    image: "levels/10/up_cover_lvl10.png",
    width: 2,
    height: 18,
    frames: 1,
    bodyType: NONE,
    info: 'up_cover_lvl10',
}, {
    name: "radiationAnim1",
    image: "levels/10/radiationAnim1.png",
    width: 172,
    height: 100,
    frames: 6,
    bodyType: NONE,
    info: 'radiationAnim1',
}, {
    name: "bridge_lvl10",
    image: 'levels/10/bridge_lvl10.png',
    width: 76,
    height: 12,
    bodyHeight: 10,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge_lvl10',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "barrier_lvl10",
    image: "levels/10/barrier_lvl10.png",
    type: PLATFORM,
    width: 16,
    height: 167,
    bodyWidth: 12,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'barrier_lvl10',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "minus_plus",
    image: "levels/10/minus_plus.png",
    width: 41,
    height: 22,
    frames: 2,
    bodyType: NONE,
    info: 'minus_plus',
}, {
    name: "block_lvl11",
    image: 'levels/11/block_lvl11.png',
    width: 25,
    height: 108,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'block_lvl11',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "bridge_lvl11",
    image: "levels/11/bridge_lvl11.png",
    width: 70,
    height: 17,
    frames: 1,
    bodyType: BOX,
    info: 'bridge_lvl11',
    fixed: true,
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "button_lvl11",
    image: "levels/11/button_lvl11.png",
    width: 30,
    height: 30,
    frames: 2,
    bodyType: NONE,
    info: 'button_lvl11',
}, {
    name: "fire_lvl11",
    image: "levels/11/fire_lvl11.png",
    width: 12,
    height: 16,
    frames: 11,
    bodyType: NONE,
    info: 'fire_lvl11',
}, {
    name: "fire_small",
    image: "levels/11/fire_small.png",
    width: 52,
    height: 32,
    frames: 24,
    bodyType: NONE,
    info: 'fire_small',
}, {
    name: "lava",
    image: "levels/11/lava.png",
    width: 6,
    height: 9,
    frames: 1,
    bodyType: CIRCLE,
    fixed: false,
    info: 'lava',
    density: 10,
    restitution: 0.1,
    friction: 0.5
}, {
    name: "pliers_down",
    image: "levels/11/pliers_down.png",
    width: 60,
    height: 36,
    frames: 6,
    bodyType: NONE,
    info: 'pliers_down',
}, {
    name: "rope_lvl11",
    image: "levels/11/rope_lvl11.png",
    width: 12,
    height: 232,
    frames: 1,
    bodyType: NONE,
    info: 'rope_lvl11',
}, {
    name: "smoke1_lvl11",
    image: "levels/11/smoke1_lvl11.png",
    width: 50,
    height: 110,
    frames: 9,
    bodyType: NONE,
    info: 'smoke',
}, {
    name: "smoke2_lvl11",
    image: "levels/11/smoke2_lvl11.png",
    width: 50,
    height: 110,
    frames: 9,
    bodyType: NONE,
    info: 'smoke',
}, {
    name: "tube_lvl11",
    image: "levels/11/tube_lvl11.png",
    width: 25,
    height: 17,
    frames: 6,
    bodyType: NONE,
    info: 'tube_lvl11',
}, {
    name: "circle_lvl12",
    image: "levels/12/circle_lvl12.png",
    width: 16,
    height: 16,
    frames: 1,
    bodyType: NONE,
    info: 'circle_lvl12',
}, {
    name: "button_lvl12",
    image: "levels/12/button_lvl12.png",
    width: 34,
    height: 30,
    frames: 3,
    bodyType: NONE,
    info: 'button_lvl12',
}, {
    name: "bridge_lvl12",
    image: "levels/12/bridge_lvl12.png",
    width: 134,
    height: 16,
    bodyHeight: 12,
    frames: 1,
    bodyType: BOX,
    fixed: false,
    info: 'bridge_lvl12',
    density: 10,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "prop_lvl12",
    image: "levels/12/prop_lvl12.png",
    width: 37,
    height: 73,
    bodyWidth: 22,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'prop_lvl12',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "bridge_lvl13",
    image: "levels/13/bridge_lvl13.png",
    width: 105,
    height: 15,
    bodyWidth: 101,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge_lvl13',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "button_lvl13",
    image: "levels/13/button_lvl13.png",
    width: 26,
    height: 26,
    frames: 2,
    bodyType: NONE,
    info: 'button_lvl13',
}, {
    name: "press",
    image: "levels/13/press.png",
    width: 128,
    height: 55,
    bodyHeight: 25,
    bodyPosCorrect: {
        x: 0,
        y: 15
    },
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'press',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "sticks",
    image: "levels/13/sticks.png",
    width: 109,
    height: 45,
    frames: 1,
    bodyType: NONE,
    info: 'sticks',
}, {
    name: "rope",
    image: "levels/13/rope.png",
    width: 13,
    height: 64,
    frames: 1,
    bodyType: NONE,
    info: 'rope',
}, {
    name: "rope1",
    image: "levels/13/rope1.png",
    width: 6,
    height: 13,
    frames: 1,
    bodyType: NONE,
    info: 'rope1',
}, {
    name: "rope2",
    image: "levels/13/rope2.png",
    width: 10,
    height: 18,
    frames: 1,
    bodyType: NONE,
    info: 'rope2',
}, {
    name: "rope3",
    image: "levels/13/rope3.png",
    width: 13,
    height: 19,
    frames: 1,
    bodyType: NONE,
    info: 'rope3',
}, {
    name: "rope4",
    image: "levels/13/rope4.png",
    width: 9,
    height: 14,
    frames: 1,
    bodyType: NONE,
    info: 'rope4',
}, {
    name: "rope5",
    image: "levels/13/rope5.png",
    width: 8,
    height: 12,
    frames: 1,
    bodyType: NONE,
    info: 'rope5',
}, {
    name: "rope6",
    image: "levels/13/rope6.png",
    width: 7,
    height: 13,
    frames: 1,
    bodyType: NONE,
    info: 'rope6',
}, {
    name: "prop_lvl13",
    image: "levels/13/prop_lvl13.png",
    width: 19,
    height: 84,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'prop_lvl13',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "circle_exit",
    image: "levels/14/circle_exit.png",
    width: 46,
    height: 66,
    frames: 1,
    bodyType: NONE,
    info: 'circle_exit',
}, {
    name: "circle_lvl14",
    image: "levels/14/circle_lvl14.png",
    width: 19,
    height: 19,
    frames: 1,
    bodyType: NONE,
    info: 'circle_lvl14',
}, {
    name: "pc1",
    image: "levels/14/pc1.png",
    width: 28,
    height: 114,
    frames: 1,
    bodyType: NONE,
    info: 'pc1',
}, {
    name: "pc2",
    image: "levels/14/pc2.png",
    width: 29,
    height: 67,
    frames: 1,
    bodyType: NONE,
    info: 'pc2',
}, {
    name: "pc3",
    image: "levels/14/pc3.png",
    width: 49,
    height: 115,
    frames: 1,
    bodyType: NONE,
    info: 'pc3',
}, {
    name: "pc4",
    image: "levels/14/pc4.png",
    width: 36,
    height: 65,
    frames: 1,
    bodyType: NONE,
    info: 'pc4',
}, {
    name: "carriage1_lvl14",
    image: "levels/14/carriage1_lvl14.png",
    type: PLATFORM,
    width: 64,
    height: 178,
    bodyWidth: 60,
    bodyHeight: 10,
    bodyPosCorrect: {
        x: 0,
        y: 78
    },
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'carriage1_lvl14',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "carriage2_lvl14",
    image: "levels/14/carriage2_lvl14.png",
    type: PLATFORM,
    width: 64,
    height: 209,
    bodyWidth: 60,
    bodyHeight: 10,
    bodyPosCorrect: {
        x: 0,
        y: 93.5
    },
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'carriage2_lvl14',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "carriage3_lvl14",
    image: "levels/14/carriage3_lvl14.png",
    type: PLATFORM,
    width: 65,
    height: 191,
    bodyWidth: 60,
    bodyHeight: 10,
    bodyPosCorrect: {
        x: 0,
        y: 84.5
    },
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'carriage3_lvl14',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "carriage4_lvl14",
    image: "levels/14/carriage4_lvl14.png",
    type: PLATFORM,
    width: 63,
    height: 232,
    bodyWidth: 60,
    bodyHeight: 10,
    bodyPosCorrect: {
        x: 0,
        y: 104
    },
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'carriage4_lvl14',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "box_lvl15",
    image: "levels/15/box_lvl15.png",
    type: PLATFORM,
    width: 44,
    height: 43,
    frames: 1,
    bodyType: BOX,
    fixed: false,
    info: 'box_lvl15',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "bridge_lvl15",
    image: "levels/15/bridge_lvl15.png",
    type: PLATFORM,
    width: 320,
    height: 17,
    bodyWidth: 86,
    bodyPosCorrect: {
        x: -117,
        y: 0
    },
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge_lvl15',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "circle_lvl15",
    image: "levels/15/circle_lvl15.png",
    width: 120,
    height: 25,
    frames: 1,
    bodyType: NONE,
    info: 'circle_lvl15',
}, {
    name: "earth1_lvl15",
    image: "levels/15/earth1_lvl15.png",
    width: 51,
    height: 66,
    frames: 1,
    bodyType: NONE,
    info: 'earth1_lvl15',
}, {
    name: "earth2_lvl15",
    image: "levels/15/earth2_lvl15.png",
    width: 51,
    height: 66,
    frames: 1,
    bodyType: NONE,
    info: 'earth2_lvl15',
}, {
    name: "prop_lvl15",
    image: "levels/15/prop_lvl15.png",
    width: 30,
    height: 131,
    frames: 1,
    bodyType: NONE,
    info: 'prop_lvl15',
}, {
    name: "mechanism_lvl15",
    image: 'levels/15/mechanism_lvl15.png',
    width: 132,
    height: 14,
    frames: 9,
    bodyType: NONE,
    info: 'mechanism_lvl15',
}, {
    name: "latch_lvl16",
    image: "levels/16/latch_lvl16.png",
    type: PLATFORM,
    width: 73,
    height: 26,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'latch_lvl16',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "bridge_lvl16",
    image: "levels/16/bridge_lvl16.png",
    type: PLATFORM,
    width: 96,
    height: 15,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge_lvl16',
    density: obstacle_density,
    restitution: 0.3,
    friction: 0.1
}, {
    name: "pump_down",
    image: 'levels/16/pump_down.png',
    width: 78,
    height: 54,
    frames: 1,
    bodyType: NONE,
    info: 'pump_down',
}, {
    name: "pump_up",
    image: 'levels/16/pump_up.png',
    width: 45,
    height: 60,
    frames: 1,
    bodyType: NONE,
    info: 'pump_up',
}, {
    name: "circle_lvl16",
    image: 'levels/16/circle_lvl16.png',
    width: 14,
    height: 13,
    frames: 1,
    bodyType: NONE,
    info: 'circle_lvl16',
}, {
    name: "ball1",
    image: "levels/16/ball1.png",
    width: 68,
    height: 142,
    bodyWidth: 42,
    bodyHeight: 42,
    bodyPosCorrect: {
        x: 0,
        y: -37
    },
    frames: 7,
    bodyType: CIRCLE,
    fixed: false,
    info: 'ball',
    density: obstacle_density,
    restitution: 0.3,
    friction: 0.1
}, {
    name: "baloon_1",
    image: "levels/16/baloon_1.png",
    width: 68,
    height: 142,
    bodyWidth: 42,
    bodyHeight: 42,
    bodyPosCorrect: {
        x: 0,
        y: -43
    },
    frames: 7,
    bodyType: CIRCLE,
    fixed: true,
    info: 'baloon_1',
    density: obstacle_density,
    restitution: 0.3,
    friction: 0.1
}, {
    name: "basket_invisible",
    image: "levels/16/basket_invisible.png",
    width: 64,
    height: 17,
    bodyHeight: 14,
    frames: 1,
    bodyType: BOX,
    fixed: false,
    info: 'basket_invisible',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "bridge_lvl17",
    image: "levels/17/bridge_lvl17.png",
    width: 227,
    height: 15,
    bodyWidth: 44,
    bodyPosCorrect: {
        x: -91,
        y: 0
    },
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge_lvl17',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "btn_Fire",
    image: 'levels/17/btn_Fire.png',
    width: 30,
    height: 134,
    frames: 2,
    bodyType: NONE,
    info: 'btn_Fire',
}, {
    name: "FireTimeAnim",
    image: 'levels/17/FireTimeAnim.png',
    width: 16,
    height: 18,
    frames: 4,
    bodyType: NONE,
    info: 'FireTimeAnim',
}, {
    name: "fire_lvl17",
    image: 'levels/17/fire_lvl17.png',
    width: 30,
    height: 122,
    frames: 21,
    rows: 7,
    columns: 3,
    bodyType: NONE,
    info: 'fire_lvl17',
}, {
    name: "earth_lvl17",
    image: 'levels/17/earth_lvl17.png',
    width: 224,
    height: 24,
    frames: 1,
    bodyType: NONE,
    info: 'earth_lvl17',
}, {
    name: "bridge1_lvl18",
    image: "levels/18/bridge1_lvl18.png",
    width: 53,
    height: 16,
    bodyHeight: 14,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge1_lvl18',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "bridge2_lvl18",
    image: "levels/18/bridge2_lvl18.png",
    width: 75,
    height: 18,
    bodyHeight: 16,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge2_lvl18',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "btnForTrans",
    image: 'levels/18/btnForTrans.png',
    width: 26,
    height: 50,
    frames: 2,
    bodyType: NONE,
    info: 'btnForTrans',
}, {
    name: "current_lvl18",
    image: 'levels/18/current_lvl18.png',
    width: 26,
    height: 46,
    frames: 20,
    bodyType: NONE,
    info: 'current_lvl18',
}, {
    name: "earth_lvl18",
    image: 'levels/18/earth_lvl18.png',
    width: 176,
    height: 106,
    frames: 1,
    bodyType: NONE,
    info: 'earth_lvl18',
}, {
    name: "green_lvl18",
    image: 'levels/18/green_lvl18.png',
    width: 14,
    height: 8,
    frames: 2,
    bodyType: NONE,
    info: 'green_lvl18',
}, {
    name: "lantern_lvl18",
    image: 'levels/18/lantern_lvl18.png',
    width: 14,
    height: 22,
    frames: 3,
    bodyType: NONE,
    info: 'lantern_lvl18',
}, {
    name: "lift_lvl18",
    image: "levels/18/lift_lvl18.png",
    width: 51,
    height: 186,
    bodyHeight: 184,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'lift_lvl18',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "red_lvl18",
    image: 'levels/18/red_lvl18.png',
    width: 14,
    height: 8,
    frames: 2,
    bodyType: NONE,
    info: 'red_lvl18',
}, {
    name: "trans1",
    image: 'levels/18/trans1.png',
    width: 245,
    height: 114,
    frames: 8,
    bodyType: NONE,
    info: 'trans1',
}, {
    name: "turnBtn_lvl18",
    image: 'levels/18/turnBtn_lvl18.png',
    width: 27,
    height: 25,
    frames: 1,
    bodyType: NONE,
    info: 'turnBtn_lvl18',
}, {
    name: "zemlaUp",
    image: 'levels/18/zemlaUp.png',
    width: 134,
    height: 162,
    frames: 1,
    bodyType: NONE,
    info: 'zemlaUp',
}, {
    name: "bridge_lvl19",
    image: "levels/19/bridge_lvl19.png",
    width: 81,
    height: 17,
    bodyHeight: 15,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridge_lvl19',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "circle_lvl19",
    image: 'levels/19/circle_lvl19.png',
    width: 20,
    height: 20,
    frames: 1,
    bodyType: NONE,
    info: 'circle_lvl19',
}, {
    name: "cover_lvl19",
    image: "levels/19/cover_lvl19.png",
    width: 20,
    height: 65,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'cover_lvl19',
    density: obstacle_density,
    restitution: obstacle_restitution,
    friction: obstacle_friction
}, {
    name: "earth_lvl19",
    image: 'levels/19/earth_lvl19.png',
    width: 22,
    height: 77,
    frames: 1,
    bodyType: NONE,
    info: 'earth_lvl19',
}, {
    name: "foundation",
    image: 'levels/19/foundation.png',
    width: 16,
    height: 48,
    frames: 1,
    bodyType: NONE,
    info: 'foundation',
}, {
    name: "foundation2",
    image: 'levels/19/foundation2.png',
    width: 60,
    height: 20,
    frames: 1,
    bodyType: NONE,
    info: 'foundation2',
}, {
    name: "boxGreen",
    image: 'levels/20/boxGreen.png',
    type: BOX,
    width: 34,
    height: 34,
    frames: 1,
    bodyType: BOX,
    fixed: false,
    info: 'boxGreen',
    density: 5,
    restitution: 0,
    friction: 0.6
}, {
    name: "boxRed",
    image: 'levels/20/boxRed.png',
    type: BOX,
    width: 34,
    height: 34,
    frames: 1,
    bodyType: BOX,
    fixed: false,
    info: 'boxRed',
    density: 5,
    restitution: 0,
    friction: 0.6
}, {
    name: "bridgeDown_lvl20",
    image: 'levels/20/bridgeDown_lvl20.png',
    width: 75,
    height: 19,
    bodyHeight: 17,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridgeDown_lvl20',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "bridgeUp_lvl20",
    image: 'levels/20/bridgeUp_lvl20.png',
    width: 68,
    height: 15,
    bodyHeight: 13,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'bridgeUp_lvl20',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "earthDown_lvl20",
    image: 'levels/20/earthDown_lvl20.png',
    width: 80,
    height: 23,
    frames: 1,
    bodyType: NONE,
    info: 'earthDown_lvl20',
}, {
    name: "earthUp_lvl20",
    image: 'levels/20/earthUp_lvl20.png',
    width: 117,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: 'earthUp_lvl20',
}, {
    name: "lift_cover1",
    image: 'levels/20/lift_cover1.png',
    width: 268,
    height: 92,
    frames: 1,
    bodyType: NONE,
    info: 'lift_cover1',
}, {
    name: "lift_cover2",
    image: 'levels/20/lift_cover2.png',
    width: 35,
    height: 88,
    frames: 1,
    bodyType: NONE,
    info: 'lift_cover2',
}, {
    name: "lift_lvl20",
    image: 'levels/20/lift_lvl20.png',
    width: 65,
    height: 240,
    bodyHeight: 238,
    frames: 1,
    bodyType: BOX,
    fixed: true,
    info: 'lift_lvl20',
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction
}, {
    name: "minus_plus_green",
    image: 'levels/20/minus_plus_green.png',
    width: 48,
    height: 26,
    frames: 2,
    bodyType: NONE,
    info: 'minus_plus_green',
}, {
    name: "minus_plus_red",
    image: 'levels/20/minus_plus_red.png',
    width: 48,
    height: 26,
    frames: 2,
    bodyType: NONE,
    info: 'minus_plus_red',
}, {
    name: "tube_cover_lvl20",
    image: 'levels/20/tube_cover_lvl20.png',
    width: 10,
    height: 60,
    frames: 1,
    bodyType: BOX,
    fixed: false,
    info: 'tube_cover_lvl20',
    density: 5,
    restitution: 0,
    friction: 0.6
}, ];;
var levelsScripts = [{
    init: function () {
        var self = levelsScripts[0];
        var fly = addBobState('fly', 50, 900 / 18, 18);
        fly.animDelay = 1;
        fly.setZIndex(15);
        fly.gotoAndPlay(0);
        fly.onenterframe = function (e) {
            if (e.target.currentFrame == 14) {
                e.target.gotoAndPlay(3);
            }
        };
        var lever = getObjectByInfo('Lever1');
        addHint.call(lever, lever.x, lever.y - 7);
        lever.onclick = self.lever1Action;
        self.yellow_element = getObjectByInfo('yellow_element');
        self.DoorLevel01 = getObjectByInfo('DoorLevel01');
        self.spring = getObjectByInfo('Spring');
        var button = getObjectByInfo('button_red');
        attachMouseEvents.call(button);
        addHint.call(button, button.x, button.y);
        button.onclick = self.buttonHandler;
        self.stopWall = getObjectByCustomInfo('stop');
        getObjectByInfo('Hint1_Level10001').setStatic(true);
        getObjectByInfo('Hint2_Level10001').setStatic(true);
    },
    lever1Action: function (e) {
        var obj = e.target;
        if (isSoundOn) mixer.play('snd_lever_double', false);
        if (isSoundOn) mixer.play('snd_door_left', false);
        obj.gotoAndPlay(0);
        obj.onenterframe = function (e) {
            var obj = e.target;
            if (obj.currentFrame == 5) {
                obj.gotoAndStop(5);
                obj.hint.removeHint();
                obj.setStatic(true);
            }
        }
        var door = levelsScripts[0].DoorLevel01;
        world.DestroyBody(door.box2dBody);
        door.moveTo(door.x, door.y - 100, Math.floor(fps * 0.8), Math.floor(fps * 0.8), function () {
            levelsScripts[0].yellow_element.setStatic(true);
            door.setStatic(true);
        });
        obj.onclick = null;
    },
    buttonHandler: function () {
        var self = levelsScripts[0],
            spr = self.spring,
            ANGLE = -1.4835,
            IMPULSE = 4500000 * 1.2 * 0.55;
        if (isSoundOn) mixer.play('snd_spring', false);
        spr.gotoAndPlay(0);
        spr.onenterframe = function (e) {
            if (e.target.currentFrame == 8) {
                e.target.gotoAndStop(0);
            }
        }
        var bob = field.bob;
        if (stage.hitTest(bob, self.spring)) {
            if (bob.state != 'hide') {
                bob.selectedState = bob.state;
                bob.changeState('fly');
                field.turning = true;
                if (bob.isAsleep) {
                    bob.forceWakeUp();
                }
            };
            bob.box2dBody.ApplyImpulse(new b2Vec2(Math.cos(ANGLE) * IMPULSE, Math.sin(ANGLE) * IMPULSE), new b2Vec2(bob.x, bob.y));
            if (isSoundOn) stage.setTimeout(function () {
                mixer.play('bob_flying');
            }, Math.floor(fps / 4));
            var int1 = stage.setInterval(function () {
                if (bob.box2dBody.m_linearVelocity.y > 0) {
                    var int2 = stage.setInterval(function () {
                        if (bob.box2dBody.m_linearVelocity.y < 0) {
                            if (bob.selectedState) bob.changeState(bob.selectedState);
                            field.turning = false;
                            stage.clearInterval(int2);
                        }
                    }, 1);
                    stage.clearInterval(int1);
                }
            }, 1);
        }
    },
    ifCancelSpeed: function () {
        var self = levelsScripts[0];
        if (stage.hitTest(field.bob, self.stopWall)) field.cancelSpeed = true;
        else field.cancelSpeed = false;
    },
    pretick: function () {
        var self = levelsScripts[0];
        self.ifCancelSpeed();
    }
}, {
    init: function () {
        var self = levelsScripts[1],
            shocked, shocked2;
        self.bobIsShocked = false;
        addStateBobShocked();
        self.conveyor = getObjectByInfo('conveyor');
        self.conveyor.setStatic(true);
        self.crossbar = getObjectByInfo('crossbar');
        self.elec = getObjectByInfo('electricity_10');
        self.elec.play();
        self.btn = getObjectByInfo('btn02');
        var lever = getObjectByInfo('Lever2');
        lever.setStatic(true);
        addHint.call(lever, lever.x, lever.y + 7);
        lever.onclick = self.lever2Action;
        self.hint1 = getObjectByInfo('HintMc1_Level20001');
        var arrow1 = getObjectByInfo('ArrowAnim0001');
        var tween1 = stage.createTween(arrow1, "y", 55, 70, Math.floor(fps * 0.8), Easing.linear.easeIn);
        var tween2 = stage.createTween(arrow1, "y", 70, 55, Math.floor(fps * 0.8), Easing.linear.easeIn);
        tween1.play();
        tween1.onfinish = tween2.play;
        tween2.onfinish = tween1.play;
        self.arrow1 = arrow1;
        self.hint3 = getObjectByInfo('HintMc3_Level20001');
    },
    lever2Action: function (e) {
        if (isSoundOn) mixer.play('snd_lever_double', false);
        if (isSoundOn) {
            mixer.play('snd_conveyor', true, true, 1);
        } else loopSound = 'snd_conveyor';
        var obj = e.target;
        obj.setStatic(false);
        obj.gotoAndPlay(0);
        obj.onenterframe = function (e) {
            var obj = e.target;
            if (obj.currentFrame == 5) {
                obj.gotoAndStop(5);
                obj.hint.removeHint();
                obj.setStatic(true);
            }
        }
        var conveyor = levelsScripts[1].conveyor;
        conveyor.gotoAndPlay(0);
        conveyor.enabled = true;
        obj.onclick = null;
    },
    checkIfBobOnConveyer: function () {
        var bob = field.bob,
            self = levelsScripts[1],
            conveyor = self.conveyor,
            conveyor_speed = -fps * 4.5;
        if (stage.hitTest(bob, conveyor)) {
            if (!self.arrow1.disappear) {
                self.arrow1.disappear = true;
                self.hint1.fadeTo(0, fps, Easing.linear.easeIn, function () {
                    self.hint1.destroy = true
                });
                self.arrow1.fadeTo(0, fps, Easing.linear.easeIn, function () {
                    self.arrow1.destroy = true
                });
            }
            if (conveyor.enabled) {
                switch (bob.state) {
                case 'walk':
                    bob.box2dBody.m_linearVelocity.x = SPEED_WALK + conveyor_speed;
                    break;
                case 'run':
                    bob.box2dBody.m_linearVelocity.x = SPEED_RUN + conveyor_speed;
                    break;
                case 'hide':
                case 'show':
                    bob.box2dBody.m_linearVelocity.x = conveyor_speed;
                    break;
                }
            };
        }
    },
    ifBobPressBtn: function () {
        var bob = field.bob,
            self = levelsScripts[1],
            btn = self.btn;
        if (!stage.hitTest(bob, btn) || bob.x < btn.x - 25 || bob.x > btn.x + 25) {
            if (btn.groundOn) {
                btn.gotoAndStop(0);
                btn.groundOn = false;
                if (isSoundOn) mixer.play('snd_button_ground_on', false);
            } else return;
        }
        if (!btn.press) {
            var hint2 = createObject({
                type: "HintClickBob_Level20001",
                x: bob.x - 90,
                y: bob.y - 15,
                rotation: 0
            });
            var arrow2 = createObject({
                type: "ArrowAnim_yellow0001",
                x: bob.x - 50,
                y: bob.y - 8,
                rotation: -0.1
            });
            arrow2.c = 0;

            function inc() {
                arrow2.c++;
            }

            function dec() {
                arrow2.c--;
            }
            var func = inc;
            var hintInt = stage.setInterval(function () {
                if (arrow2.c > 10) func = dec;
                if (arrow2.c < 0) func = inc;
                func();
                arrow2.x = bob.x - 50 + arrow2.c;
                hint2.x = bob.x - 90;
                if (bob.state == 'hide' || btn.currentFrame == 0) {
                    var duration = Math.floor(fps / 4);
                    hint2.fadeTo(0, duration, Easing.linear.easeIn, function () {
                        hint2.destroy = true
                    });
                    arrow2.fadeTo(0, duration, Easing.linear.easeIn, function () {
                        arrow2.destroy = true
                    });
                    stage.clearInterval(hintInt);
                }
            }, 1);
            btn.gotoAndStop(1);
            if (isSoundOn) mixer.play('snd_button', false);
            var body = self.crossbar.box2dBody;
            var oldPos = body.m_position;
            oldPos.y += 35;
            var newPos = {};
            var int = stage.setInterval(function () {
                var rot = body.m_rotation - 0.015;
                var vec = new Vector(-35, 0);
                vec.rotate(-rot);
                newPos.x = oldPos.x + vec.x;
                newPos.y = oldPos.y + vec.y;
                body.SetOriginPosition(newPos, rot);
                if (rot <= 0 || btn.currentFrame == 0) {
                    if (rot <= 0 && bob.state == 'hide') {
                        var duration = Math.floor(fps / 4);
                        self.hint1.moveTo(self.hint1.x, self.hint1.y - 50, duration, Easing.linear.easeIn, function () {
                            self.hint1 = createObject({
                                type: "HintMc2_Level20001",
                                x: self.hint1.x,
                                y: -20,
                                rotation: 0
                            });
                            self.hint1.moveTo(self.hint1.x, self.hint1.y + 45, duration, Easing.linear.easeIn);
                        })
                    };
                    stage.clearInterval(int);
                    stage.setTimeout(function () {
                        self.crossbar.setStatic(true);
                        getObjectByInfo('electric_detail').setStatic(true);
                    }, 2)
                }
            }, 1);
            btn.press = true;
            btn.groundOn = true;
        }
    },
    ifBobShocked: function () {
        var self = levelsScripts[1];
        if (!self.bobIsShocked && stage.hitTest(self.elec, field.bob)) {
            self.bobIsShocked = true;
            if (isSoundOn) mixer.play('snd_bob_die_radiation', false);
            stage.setTimeout(function () {
                if (isSoundOn) mixer.play('snd_electro_shock', false);
                field.bob.forceSleep();
                field.bob.speed = 0;
                var pos = field.bob.box2dBody.GetCenterPosition();
                pos.y = pos.y - 20;
                field.bob.box2dBody.SetCenterPosition(pos, 0);
                field.bob.box2dBody.Freeze();
                field.bob.changeState('shocked');
                field.bob.shocked.gotoAndPlay(0);
                field.bob.onclick = null;
            }, fps / 4);
        }
    },
    checkIfAddLastHint: function () {
        var self = levelsScripts[1];
        if (field.bob.y < 220 || self.hint3.appeared) return;
        self.hint3.appeared = true;
        self.hint3.moveTo(self.hint3.x, self.hint3.y + 100, fps, Easing.linear.easeIn, function () {
            self.hint3.setStatic(true);
            var arrow3 = createObject({
                type: "ArrowAnim0001",
                x: 135,
                y: 50,
                rotation: 2.15
            });
            var duration = Math.floor(fps * 0.8);
            var tween3_1 = stage.createTween(arrow3, "y", 50, 38, duration, Easing.linear.easeIn);
            var tween3_3 = stage.createTween(arrow3, "x", 135, 115, duration, Easing.linear.easeIn);
            var tween3_2 = stage.createTween(arrow3, "y", 38, 50, duration, Easing.linear.easeIn);
            var tween3_4 = stage.createTween(arrow3, "x", 115, 135, duration, Easing.linear.easeIn);
            tween3_1.onfinish = function () {
                tween3_2.play();
                tween3_4.play();
            };
            tween3_2.onfinish = function () {
                tween3_1.play();
                tween3_3.play();
            };
            tween3_1.play();
            tween3_3.play();
        });
    },
    pretick: function () {
        var self = levelsScripts[1];
        self.checkIfBobOnConveyer();
        self.ifBobPressBtn();
        self.ifBobShocked();
        self.checkIfAddLastHint();
    },
}, {
    init: function () {
        var self = levelsScripts[2],
            bob = field.bob;
        var platform = getObjectByInfo('Baraban');
        platform.animDelay = 2;
        self.platform = platform;
        var slider = getObjectByInfo('slider');
        processSlider.call(slider, platform);
        var lift = getObjectByInfo('Lift_lv3').box2dBody;
        var buttonDown = getObjectByInfo('button_blue_down');
        addHint.call(buttonDown, buttonDown.x, buttonDown.y + 1);
        var buttonUp = getObjectByInfo('button_blue_up');
        addHint.call(buttonUp, buttonUp.x, buttonUp.y - 1);
        var buttonMid = getObjectByInfo('button_blue_mid_lvl3');
        buttonDown.setStatic(true);
        buttonUp.setStatic(true);
        buttonMid.setStatic(true);
        slider.setStatic(true);
        getObjectByInfo('Hint1_Level30001').setStatic(true);
        getObjectByInfo('HoldText0001').setStatic(true);
        self.liftHandler.call(lift, buttonDown, 290);
        self.liftHandler.call(lift, buttonUp, 130);
    },
    liftHandler: function (but, restriction) {
        var lift = this,
            bob = field.bob,
            block, up, int;
        but.onmousedown = function () {
            if (block) return;
            if (but.info.indexOf('up') != -1) up = true;
            if (up) {
                if (lift.GetCenterPosition().y <= restriction) return;
            } else {
                if (lift.GetCenterPosition().y >= restriction) return;
            }
            block = true;
            var oldPos = lift.GetCenterPosition().y;
            var bob_pos;
            int = stage.setInterval(function () {
                var pos = lift.GetCenterPosition();
                if (up) pos.y -= 2;
                else pos.y += 2;
                lift.SetCenterPosition(pos, 0);
                if (checkIfBobOnLift(lift.sprite)) {
                    bob_pos = bob.box2dBody.GetCenterPosition();
                    if (up) bob_pos.y -= 2;
                    else bob_pos.y += 2;
                    bob.box2dBody.SetCenterPosition(bob_pos, 0);
                }
                if ((up && pos.y <= restriction) || (!up && pos.y >= restriction)) stopMove();
            }, 1);
        }
        but.onmouseup = stopMove;
        but.onmouseout = stopMove;

        function stopMove() {
            stage.clearInterval(int);
            block = false;
        }
    },
}, {
    init: function () {
        var self = levelsScripts[3];
        var lever = getObjectByInfo('Lever4');
        addHint.call(lever, lever.x + 6, lever.y + 1);
        lever.setStatic(true);
        var stone = getObjectByInfo('stone_lvl4');
        stone.box2dBody.GoToSleep();
        var mechanism = getObjectByInfo('mechanism');
        mechanism.onenterframe = function (e) {
            if (e.target.currentFrame == 7) {
                e.target.stop();
                e.target.setStatic(true);
            };
        };
        var latch = getObjectByInfo('Latch_lvl4');
        addHint.call(latch, latch.x - 17, latch.y + 2);
        latch.position = 'left';
        latchMove.call(latch, 22);
        moveMechanism.call(lever, mechanism, stone);
    },
    ifBobFalls: function () {
        if (field.bob.y > 210) {
            bobFalls();
        }
    },
    bobDontTurnWoodenCross: function () {
        if (field.bob.x > 215 && field.bob.x < 219 && field.bob.y > 160) {
            field.bob.box2dBody.m_linearVelocity.x = Math.floor(field.bob.speed / 9);
        }
    },
    pretick: function () {
        var self = levelsScripts[3];
        self.ifBobFalls();
        self.bobDontTurnWoodenCross();
    },
}, {
    init: function () {
        var self = levelsScripts[4];
        var buttonLeft = getObjectByInfo('button_blue_left');
        buttonLeft.setStatic(true);
        addHint.call(buttonLeft, buttonLeft.x, buttonLeft.y);
        var buttonRight = getObjectByInfo('button_blue_right');
        buttonRight.setStatic(true);
        addHint.call(buttonRight, buttonRight.x, buttonRight.y);
        var buttonMid = getObjectByInfo('button_blue_mid');
        buttonMid.setStatic(true);
        var lever = getObjectByInfo('Lever1');
        lever.side = 'left';
        var wagon = getObjectByInfo('wagon_lvl5');
        wagon.setZIndex(16);
        self.wagon = wagon;
        var wagonWhel = getObjectByInfo('wagon_whel_lvl5');
        wagonWhel[0].setZIndex(17);
        wagonWhel[1].setZIndex(17);
        self.leftWood = getObjectByCustomInfo('leftWood');
        self.rightWood = getObjectByCustomInfo('rightWood');
        self.leftWood.setStatic(true);
        self.leftWood.setZIndex(1);
        self.rightWood.setStatic(true);
        self.block = false;
        addHint.call(lever, lever.x, lever.y - 5);
        lever.onclick = self.lever5Action;
        var bridge = getObjectByInfo('Bridge_lvl5').box2dBody;
        bridge.sprite.setStatic(true);
        self.bridge = bridge;
        rotateHandler.call(bridge, buttonLeft, -2.05);
        rotateHandler.call(bridge, buttonRight, 0);
        self.pit = getObjectByCustomInfo('pit');
        addStateBobGrowl();
        var tube = getObjectByInfo('tube5');
        var BackTube = getObjectByInfo('BackTube');
        tube.setZIndex(16);
        tube.setStatic(false);
        stage.setTimeout(function () {
            tube.setStatic(true);
            BackTube.setStatic(true);
        }, fps);
    },
    lever5Action: function (e) {
        var self = levelsScripts[4];
        var obj = e.target;
        if (self.block) return;
        if (isSoundOn) mixer.play('snd_lever_double', false);
        self.block = true;
        if (obj.side == 'left') {
            if (isSoundOn) mixer.play('snd_door_left', false);
            obj.side = 'right';
            obj.gotoAndPlay(0);
            obj.onenterframe = function (ev) {
                var obj = ev.target;
                if (obj.currentFrame == 5) {
                    obj.stop();
                }
            }
            self.moveWood(self.leftWood.box2dBody, true);
            self.moveWood(self.rightWood.box2dBody, false);
        } else {
            if (isSoundOn) mixer.play('snd_door_right', false);
            obj.side = 'left';
            obj.rewindAndStop(5);
            self.moveWood(self.leftWood.box2dBody, false);
            self.moveWood(self.rightWood.box2dBody, true);
        }
    },
    moveWood: function (wood, up) {
        var self = levelsScripts[4];
        wood.sprite.setStatic(false);
        var oldPos = wood.GetCenterPosition();
        var int1 = stage.setInterval(function () {
            var pos = wood.GetCenterPosition();
            if (up) pos.y -= 3;
            else pos.y += 3;
            wood.SetOriginPosition(pos, 0);
            if (Math.abs(oldPos.y - pos.y) >= 75) {
                stage.setTimeout(function () {
                    wood.sprite.setStatic(true);
                }, 1);
                stage.clearInterval(int1);
                self.block = false;
            }
        }, 1);
    },
    ifCancelSpeed: function () {
        var self = levelsScripts[4];
        if (getDistance(field.bob, self.wagon) < 35 || (stage.hitTest(field.bob, self.bridge.sprite) && self.bridge.sprite.rotation < -Math.PI / 4)) {
            field.cancelSpeed = true;
        } else field.cancelSpeed = false;
    },
    ifBobFalls: function () {
        if (field.bob.y > 260 && field.bob.x < 300) bobFalls();
    },
    ifBobInPit: function () {
        if (!field.bob.inPit && stage.hitTest(field.bob, levelsScripts[4].pit)) {
            field.bob.changeState('BobGrowl');
            field.bob.BobGrowl.gotoAndPlay(0);
            field.bob.inPit = true;
        };
    },
    pretick: function () {
        var self = levelsScripts[4];
        self.ifCancelSpeed();
        self.ifBobFalls();
        self.ifBobInPit();
    }
}, {
    init: function () {
        var self = levelsScripts[5];
        var button_red = getObjectByInfo('button_red');
        button_red.onclick = self.buttonRedAction;
        attachMouseEvents.call(button_red);
        addHint.call(button_red, button_red.x, button_red.y);
        var button_blue = getObjectByInfo('button_blue');
        button_blue.onclick = self.buttonBlueAction;
        addHint.call(button_blue, button_blue.x, button_blue.y);
        var buttonLeft = getObjectByInfo('button_blue_left');
        addHint.call(buttonLeft, buttonLeft.x - 1, buttonLeft.y);
        buttonLeft.setStatic(true);
        var buttonRight = getObjectByInfo('button_blue_right');
        addHint.call(buttonRight, buttonRight.x + 1, buttonRight.y);
        buttonRight.setStatic(true);
        var brig = getObjectByInfo('brig').box2dBody;
        brig.sprite.setStatic(true);
        var earth = getObjectByInfo('earth_lvl6');
        earth.setStatic(true);
        rotateHandler.call(brig, buttonLeft, 0.01, earth);
        rotateHandler.call(brig, buttonRight, Math.PI / 2 - 0.01, earth);
        self.spring = getObjectByInfo('spring');
        self.spring.onenterframe = function (e) {
            if (e.target.currentFrame == 11) {
                e.target.gotoAndStop(0);
            };
        };
        var mechanism = getObjectByInfo('mechanism');
        mechanism.onenterframe = function (e) {
            if (e.target.currentFrame == 7) {
                e.target.stop();
                e.target.rewindAndStop(6);
            };
        };
        self.mechanism = mechanism;
        self.tube = getObjectByInfo('tube_lvl6');
        self.tube.setStatic(true);
        self.btn = getObjectByInfo('btn_lvl6');
        self.btn.setZIndex(1);
        self.btn.onenterframe = function (e) {
            if (e.target.currentFrame == 3) {
                e.target.stop();
                e.target.setStatic(true);
            };
        };
        for (var i = 0; i < stage.objects.length; i++) {
            if (stage.objects[i].wlk) stage.objects[i].setStatic(false);
        }
        self.stone = undefined;
    },
    buttonRedAction: function () {
        var self = levelsScripts[5];
        if (self.spring.currentFrame != 0) return;
        self.spring.play();
        if (isSoundOn) mixer.play('snd_spring');
        if (self.stone && stage.hitTest(self.stone, self.spring)) {
            stage.setTimeout(function () {
                self.stone.box2dBody.ApplyImpulse(new b2Vec2(-200000, -20000), self.stone.box2dBody.GetCenterPosition());
            }, 2);
        };
    },
    buttonBlueAction: function () {
        var self = levelsScripts[5];
        if (self.mechanism.currentFrame != 0) return;
        self.mechanism.gotoAndPlay(0);
        if (isSoundOn) mixer.play('snd_bridge');
        if (self.stone) {
            var mc = new Sprite(bitmaps.BasketballDestroying, 60, 60, 11);
            mc.x = self.stone.x;
            mc.y = self.stone.y;
            mc.onenterframe = function (e) {
                if (e.target.currentFrame == 9) e.target.destroy = true;
            };
            stage.addChild(mc);
            self.stone.destroy = true;
            world.DestroyBody(self.stone.box2dBody);
        };
        self.stone = createObject({
            type: "stone_lvl6",
            x: 387,
            y: 116,
            rotation: 0
        });
        self.stone.setZIndex(2);
    },
    ifBtnPress: function () {
        var self = levelsScripts[5];
        if (!self.stone || self.btn.pressed) return;
        if (stage.hitTest(self.stone, self.btn)) {
            if (isSoundOn) mixer.play('snd_lever_double');
            var tube = self.tube.box2dBody;
            stage.setTimeout(function () {
                self.btn.play();
                if (isSoundOn) mixer.play('snd_door_right');
                var int = stage.setInterval(function () {
                    var pos = tube.GetCenterPosition();
                    pos.y -= 2;
                    tube.SetOriginPosition(pos, 0);
                    if (pos.y <= -43) {
                        tube.sprite.destroy = true;
                        world.DestroyBody(tube);
                        stage.clearInterval(int);
                    }
                }, 1);
            }, 2);
            self.btn.pressed = true;
        }
    },
    pretick: function () {
        var self = levelsScripts[5];
        self.ifBtnPress();
    }
}, {
    init: function () {
        var self = levelsScripts[6],
            chick_speed = -fps * 2,
            bob = field.bob,
            temp_bob_handler = bob.onclick,
            buttonsArr = [];
        bob.onclick = null;
        field.speedHandler.forEach(function (el) {
            el.locked = true;
        });
        var BobFallsInLove = new TilesSprite(bitmaps.BobFallsInLove, 72, 68, 20, 5, 4);
        BobFallsInLove.setPosition(bob.x, bob.y);
        BobFallsInLove.animDelay = 2;
        BobFallsInLove.opacity = 0;
        BobFallsInLove.gotoAndStop(0);
        bob.BobFallsInLove = BobFallsInLove;
        bob.states.push(BobFallsInLove);
        stage.addChild(BobFallsInLove);
        BobFallsInLove.onenterframe = function (e) {
            if (e.target.currentFrameX == 19 && e.target.animated) {
                e.target.stop();
                bob.changeState('inLove');
                bob.inLove.gotoAndPlay(0);
                bob.forceWakeUp();
                bob.speed = chick_speed;
                bob.direction = 'left';
            }
        };
        var BobFalls = addBobState('BobFalls', 64, 568 / 7, 7);
        BobFalls.forbidScale = true;
        BobFalls.onenterframe = function (e) {
            if (e.target.currentFrame == 6 && e.target.animated) {
                bob.changeState('walk');
                bob.onclick = temp_bob_handler;
                field.speedHandler[1].locked = false;
                e.target.stop();
                field.bob.speed = -SPEED_WALK;
            }
        };
        var inLove = addBobState('inLove', 64, 254 / 5, 5);
        inLove.animDelay = 3;
        var chick = getObjectByInfo('Girlfriend');
        chick.box2dBody.m_invI = 0;
        chick.animDelay = 3;
        chick.gotoAndPlay(0);
        chick.setZIndex(0);
        stage.setInterval(function () {
            chick.box2dBody.m_linearVelocity.x = chick_speed;
        }, 1);
        self.chick = chick;
        var lift = getObjectByInfo('Lift_lv7').box2dBody;
        var buttonsArr = getObjectByInfo('Btn_lv7');
        if (buttonsArr.length == 2) {
            addLiftHandlers.call(lift, buttonsArr);
        }
        self.fence = getObjectByInfo('fence');
        var platform = getObjectByInfo('Baraban');
        platform.animDelay = 2;
        self.platform = platform;
        self.stove = getObjectByInfo('Stove');
        var oven_lever = getObjectByInfo('oven_lever');
        self.ovenHandler.call(oven_lever);
        var ice = getObjectByInfo('ice');
        ice.animDelay = 4;
        ice.onenterframe = function (e) {
            if (e.target.currentFrame == 9) {
                deleteObject(ice);
            }
        }
        self.ice = ice;
        var slider = getObjectByInfo('slider');
        processSlider.call(slider, platform);
        for (var i = 0; i < stage.objects.length; i++) {
            if (stage.objects[i].lvlNum) {
                self.level = stage.objects[i];
                self.level.static = false;
            }
        };
        addStateBobGrowl();
    },
    ovenHandler: function () {
        var self = levelsScripts[6],
            ANGLE = 3.3161,
            IMPULSE = 2000000,
            oven_int, bob = field.bob,
            burnt = false;
        this.anchor.x += 2;
        this.anchor.y += 1;
        this.isOff = true;
        this.rotateTo(5, 1, 1);
        this.static = true;
        this.onclick = function (e) {
            if (e.target.locked) return;
            e.target.locked = true;
            e.target.setStatic(false);
            if (!e.target.isOff) {
                if (isSoundOn) mixer.play('snd_button');
                var int1 = stage.setInterval(function () {
                    e.target.rotation -= 0.53;
                    if (e.target.rotation <= 5) {
                        stage.clearInterval(int1);
                        self.stove.gotoAndStop(0);
                        e.target.setStatic(true);
                        e.target.locked = false;
                        self.ice.gotoAndStop(self.ice.currentFrame);
                    }
                }, 1);
                stage.clearInterval(oven_int);
                e.target.isOff = true;
            } else {
                if (isSoundOn) mixer.play('snd_button_ground_on');
                var int2 = stage.setInterval(function () {
                    e.target.rotation += 0.53;
                    if (e.target.rotation >= 8) {
                        stage.clearInterval(int2);
                        self.stove.gotoAndStop(2);
                        e.target.setStatic(true);
                        e.target.locked = false;
                        self.ice.gotoAndPlay(self.ice.currentFrame);
                    }
                }, 1);
                oven_int = stage.setInterval(function () {
                    if ((bob.x - self.stove.x) < 20 && (bob.x - self.stove.x) > -20 && stage.hitTest(bob, self.stove) && !burnt) {
                        burnt = true;
                        bob.forceSleep();
                        field.bob.changeState('BobGrowl');
                        field.bob.BobGrowl.gotoAndPlay(0);
                        bob.box2dBody.ApplyImpulse(new b2Vec2(Math.cos(ANGLE) * IMPULSE, Math.sin(ANGLE) * IMPULSE), new b2Vec2(bob.x, bob.y));
                        stage.setTimeout(function () {
                            burnt = false;
                        }, 30);
                    }
                }, 1);
                e.target.isOff = false;
            }
        }
    },
    ifBobInLove: function () {
        var bob = field.bob,
            self = levelsScripts[6];
        if (!bob.isInLove && bob.x >= self.chick.x) {
            bob.isInLove = true;
            bob.forceSleep();
            bob.changeState('BobFallsInLove');
            bob.BobFallsInLove.gotoAndPlay(0);
            if (isSoundOn) mixer.play('snd_whistle_to_girl');
        }
    },
    ifNeedFall: function () {
        var bob = field.bob,
            self = levelsScripts[6];
        if (!bob.hasFallen && bob.x <= 130) {
            bob.changeState('BobFalls');
            bob.BobFalls.gotoAndPlay(0);
            bob.hasFallen = true;
        }
    },
    pretick: function () {
        var self = levelsScripts[6];
        self.ifBobInLove();
        self.ifNeedFall();
    }
}, {
    init: function () {
        var self = levelsScripts[7];
        var latch = getObjectByInfo('latch_lvl8');
        addHint.call(latch, latch.x - 35, latch.y);
        latch.position = 'left';
        latchMove.call(latch, 60);
        var lever = getObjectByInfo('Lever2');
        addHint.call(lever, lever.x, lever.y + 5);
        lever.side = 'left';
        lever.onclick = self.lever8Action;
        self.lever = lever;
        self.bridge = getObjectByInfo('bridge_lvl8').box2dBody;
        var button_red = getObjectByInfo('button_red');
        button_red.onclick = self.buttonRedAction;
        attachMouseEvents.call(button_red);
        addHint.call(button_red, button_red.x, button_red.y);
        self.spring = getObjectByInfo('spring_up');
        self.spring.onenterframe = function (e) {
            if (e.target.currentFrame == 11) {
                e.target.gotoAndStop(0);
            };
        };
        self.cS = getObjectByCustomInfo('cancelSpeed');
        self.cS2 = getObjectByCustomInfo('cancelSpeed2');
    },
    lever8Action: function (e) {
        var self = levelsScripts[7];
        var obj = e.target;
        if (self.block) return;
        if (isSoundOn) mixer.play('snd_lever_double');
        self.block = true;
        if (obj.side == 'left') {
            if (isSoundOn) mixer.play('snd_door_left');
            obj.side = 'right';
            obj.gotoAndPlay(0);
            obj.onenterframe = function (e) {
                if (e.target.currentFrame == 5) e.target.stop();
            }
            self.moveBridge(true);
        } else {
            if (isSoundOn) mixer.play('snd_door_right');
            obj.side = 'left';
            obj.rewindAndStop(5);
            self.moveBridge(false);
        }
    },
    moveBridge: function (toRight) {
        var self = levelsScripts[7],
            bridge = self.bridge;
        bridge.sprite.setStatic(false);
        var oldPos = bridge.GetCenterPosition();
        var int1 = stage.setInterval(function () {
            var pos = bridge.GetCenterPosition();
            if (toRight) pos.x += 15.5;
            else pos.x -= 15.5;
            bridge.SetOriginPosition(pos, 0);
            if (Math.abs(oldPos.x - pos.x) > 151) {
                stage.setTimeout(function () {
                    bridge.sprite.setStatic(true);
                }, 1);
                stage.clearInterval(int1);
                self.block = false;
            }
        }, 1);
    },
    buttonRedAction: function () {
        var self = levelsScripts[7];
        if (self.spring.currentFrame != 0) return;
        self.spring.play();
        if (isSoundOn) mixer.play('snd_spring');
        if (stage.hitTest(field.bob, self.spring)) {
            stage.setTimeout(function () {
                field.bob.box2dBody.ApplyImpulse(new b2Vec2(0, -3200000), field.bob.box2dBody.GetCenterPosition());
            }, 1);
        };
    },
    ifCancelSpeed: function () {
        var self = levelsScripts[7];
        if (stage.hitTest(field.bob, self.cS) || stage.hitTest(field.bob, self.cS2)) {
            field.bob.box2dBody.m_linearVelocity.x = 0;
        }
    },
    ifBobFalls: function () {
        if (field.bob.y > 250) bobFalls();
    },
    pretick: function () {
        var self = levelsScripts[7];
        self.ifBobFalls();
        self.ifCancelSpeed();
    },
}, {
    init: function () {
        var self = levelsScripts[8];
        var bridges = getObjectByInfo('bridge_lvl9');
        var lamps = getObjectByInfo('lamp');
        var buts = getObjectByInfo('button_lvl9');
        var earths = getObjectByInfo('earth_lvl9');
        self.bridges = bridges;
        self.lamps = lamps;
        self.buts = buts;
        self.earths = earths;
        self.wire = getObjectByInfo('wire');
        self.wire.setStatic(true);
        for (var i = 0; i < 4; i++) {
            lamps[i].gotoAndStop(1);
            buts[i].gotoAndStop(2);
            addHint.call(buts[i], buts[i].x, buts[i].y);
            self.buttonHandler.call(buts[i]);
            bridges[i].setZIndex(3);
            earths[i].setZIndex(4);
            bridges[i].setStatic(true);
            earths[i].setStatic(true);
            lamps[i].setStatic(true);
        };
    },
    buttonHandler: function () {
        var self = levelsScripts[8];
        this.onmousedown = function () {
            if (self.block) return;
            for (var i = 0; i < 4; i++) {
                if (self.buts[i] == this) {
                    if (!self.bridges[i].show) {
                        self.lamps[i].gotoAndStop(0);
                        self.buts[i].gotoAndStop(1);
                        self.moveBridge(self.bridges[i], self.earths[i], true);
                    }
                } else {
                    if (self.bridges[i].show) {
                        self.moveBridge(self.bridges[i], self.earths[i], false);
                        self.lamps[i].gotoAndStop(1);
                        self.buts[i].gotoAndStop(2);
                    }
                }
            };
        }
        this.onmouseup = function (e) {
            e.target.gotoAndStop(0);
        }
    },
    moveBridge: function (bridge, earth, show) {
        var self = levelsScripts[8];
        if (show) {
            bridge.show = true;
            if (isSoundOn) mixer.play('snd_button_ground_on');
        } else {
            bridge.show = false;
            if (isSoundOn) mixer.play('snd_button_ground_off');
        }
        self.block = true;
        bridge.setStatic(false);
        earth.setStatic(false);
        self.wire.setStatic(false);
        var oldPos = bridge.box2dBody.GetCenterPosition();
        var int1 = stage.setInterval(function () {
            var pos = bridge.box2dBody.GetCenterPosition();
            if (show) pos.x -= 8;
            else pos.x += 8;
            bridge.box2dBody.SetOriginPosition(pos, 0);
            if (Math.abs(oldPos.x - pos.x) >= bridge.width - 8) {
                stage.setTimeout(function () {
                    bridge.setStatic(true);
                    earth.setStatic(true);
                    self.wire.setStatic(true);
                    self.block = false;
                }, 2);
                stage.clearInterval(int1);
            }
        }, 1);
    },
    ifBobFalls: function () {
        if (field.bob.y > 220) bobFalls();
    },
    pretick: function () {
        var self = levelsScripts[8];
        self.ifBobFalls();
    }
}, {
    init: function () {
        var self = levelsScripts[9];
        getObjectByInfo('lever_cover_down').setStatic(true);
        self.int = stage.setInterval(self.createLava, Math.floor(fps / 8));
        var bridge = getObjectByInfo('bridge_lvl11');
        self.bridge = bridge;
        var smokes = getObjectByInfo('smoke');
        for (var i = 0; i < smokes.length; i++) {
            smokes[i].animDelay = 2;
            smokes[i].play();
        }
        var fire = getObjectByInfo('fire_lvl11');
        for (var f = 0; f < fire.length; f++) {
            (function (ff) {
                stage.setTimeout(function () {
                    fire[ff].play();
                }, ff);
            })(f);
        }
        var buttonLeft = getObjectByInfo('button_blue_left');
        addHint.call(buttonLeft, buttonLeft.x, buttonLeft.y);
        var buttonRight = getObjectByInfo('button_blue_right');
        addHint.call(buttonRight, buttonRight.x, buttonRight.y);
        self.buttonRight = buttonRight;
        var buttonMid = getObjectByInfo('button_blue_mid');
        var button1 = getObjectByCustomInfo('button1');
        var button2 = getObjectByCustomInfo('button2');
        var button3 = getObjectByCustomInfo('button3');
        addHint.call(button1, button1.x, button1.y);
        addHint.call(button2, button2.x, button2.y);
        addHint.call(button3, button3.x, button3.y);
        button1.onmousedown = self.onButtonDown;
        button2.onmousedown = self.onButtonDown;
        button3.onmousedown = self.onButtonDown;
        button1.onmouseup = self.onButtonUp;
        button3.onmouseup = self.onButtonUp;
        button2.onmouseup = self.onButton2Up;
        self.button1 = button1;
        self.button2 = button2;
        self.button3 = button3;
        moveBridge.call(bridge.box2dBody, buttonLeft, 87);
        moveBridge.call(bridge.box2dBody, buttonRight, 138);
        var pliers = getObjectByInfo('pliers_down');
        pliers.animDelay = 1;
        pliers.onenterframe = function (e) {
            if (e.target.currentFrame == 5) e.target.stop();
        }
        self.pliers = pliers;
        pliers.setStatic(true);
        self.rope = getObjectByInfo('rope_lvl11');
        self.rope.setStatic(true);
        self.cover = getObjectByInfo('block_lvl11');
        self.tube = getObjectByInfo('tube_lvl11');
        self.tube.setStatic(true);
        if (isSoundOn) mixer.play('snd_boil');
        stage.setInterval(function () {
            if (isSoundOn) mixer.play('snd_boil');
        }, fps * 6);
    },
    onButtonDown: function (e) {
        if (e.target.currentFrame != 1) {
            e.target.gotoAndStop(1);
            if (isSoundOn) mixer.play('snd_crane');
        };
    },
    onButtonUp: function (e) {
        e.target.gotoAndStop(0);
    },
    onButton1Up: function (e) {
        var self = levelsScripts[9],
            pliers = self.pliers;
        e.target.hint.removeHint();
        pliers.setStatic(false);
        pliers.bitmap = bitmaps.pliers_catch;
        pliers.totalFrames = 3;
        pliers.onenterframe = function (e) {
            if (e.target.currentFrame == 2) {
                e.target.stop();
                e.target.setStatic(true);
            };
        }
        pliers.gotoAndPlay(0);
        self.button1.onmouseup = null;
        self.button2.onmouseup = null;
        self.button3.onmouseup = self.onButton3Up2;
        self.button1.setStatic(true);
        self.button2.setStatic(true);
    },
    onButton2Up: function (e) {
        var self = levelsScripts[9];
        e.target.hint.removeHint();
        self.movePliers(true, 170);
        self.pliers.play();
        self.button1.onmouseup = self.onButton1Up;
        self.button3.onmouseup = self.onButton3Up;
    },
    onButton3Up: function (e) {
        var self = levelsScripts[9];
        addHint.call(self.button2, self.button2.x, self.button2.y);
        e.target.gotoAndStop(0);
        self.button2.gotoAndStop(0);
        self.movePliers(false, 110);
        self.pliers.rewindAndStop(5);
        self.button1.onmouseup = self.onButtonUp;
        self.button3.onmouseup = self.onButtonUp;
    },
    onButton3Up2: function (e) {
        var self = levelsScripts[9];
        e.target.hint.removeHint();
        e.target.setStatic(true);
        self.movePliers(false, 90, self.cover.box2dBody);
        self.button1.onmouseup = null;
        self.button2.onmouseup = null;
        self.button3.onmouseup = null;
        moveBridge.call(self.bridge.box2dBody, self.buttonRight, 370);
    },
    createLava: function () {
        var rand = Math.random() * 185 + 219;
        var mc = createObject({
            type: "lava",
            x: rand,
            y: 35,
            rotation: 0
        });
        mc.onenterframe = lavaOnEnter;
        mc.setZIndex(5);
        if (gameState != STATE_GAME) stage.clearInterval(levelsScripts[9].int);

        function lavaOnEnter(e) {
            var c = e.target.box2dBody.GetContactList();
            if (c && c.other.sprite.info != 'lava') {
                if (c.other.sprite.state) bobBurns();
                e.target.destroy = true;
                world.DestroyBody(e.target.box2dBody);
            }
        }
    },
    movePliers: function (down, restriction, cover) {
        var self = levelsScripts[9];
        if ((down && self.pliers.y >= restriction) || (!down && self.pliers.y <= restriction)) return;
        self.tube.setStatic(false);
        self.rope.setStatic(false);
        self.pliers.setStatic(false);
        if (cover) self.cover.setStatic(false);
        var int = stage.setInterval(function () {
            if (down) {
                self.rope.y += 6;
                self.pliers.y += 6;
            } else {
                self.rope.y -= 6;
                self.pliers.y -= 6;
            }
            if (cover) {
                var pos = cover.GetCenterPosition();
                if (down) pos.y += 6;
                else pos.y -= 6;
                cover.SetOriginPosition(pos, 0);
            }
            if ((down && self.pliers.y >= restriction) || (!down && self.pliers.y <= restriction)) {
                stage.clearInterval(int);
                stage.setTimeout(function () {
                    self.tube.setStatic(true);
                    self.rope.setStatic(true);
                    self.pliers.setStatic(true);
                    if (cover) self.cover.setStatic(true);
                }, 2);
            }
        }, 1);
    },
    pretick: function () {}
}, {
    init: function () {
        var self = levelsScripts[10];
        var button = getObjectByInfo('button_lvl12');
        self.prop = getObjectByInfo('prop_lvl12');
        self.buttonAction.call(button);
        addHint.call(button, button.x, button.y);
    },
    buttonAction: function () {
        var but = this,
            prop = levelsScripts[10].prop.box2dBody,
            int;
        but.onmousedown = function (e) {
            e.target.gotoAndStop(2);
            int = stage.setInterval(function () {
                pos = prop.GetCenterPosition();
                pos.x += 4;
                prop.SetOriginPosition(pos, 0);
                if (pos.x > 440) stopMove();
            }, 1);
        }
        but.onmouseup = function (e) {
            e.target.gotoAndStop(1);
            stopMove();
        }
        but.onmouseout = function (e) {
            e.target.gotoAndStop(0);
            stopMove();
        }
        but.onmouseover = function (e) {
            e.target.gotoAndStop(1);
        }

        function stopMove() {
            stage.clearInterval(int);
        }
    },
    ifBobFalls: function () {
        if (field.bob.y > 230) bobFalls();
    },
    pretick: function () {
        var self = levelsScripts[10];
        self.ifBobFalls();
    },
}, {
    init: function () {
        var self = levelsScripts[11];
        var press = getObjectByInfo('press');
        press.up = true;
        self.press = press;
        var buttonLeft = getObjectByInfo('button_blue_left');
        buttonLeft.setStatic(true);
        addHint.call(buttonLeft, buttonLeft.x, buttonLeft.y);
        var buttonRight = getObjectByInfo('button_blue_right');
        buttonRight.setStatic(true);
        addHint.call(buttonRight, buttonRight.x, buttonRight.y);
        var buttonMid = getObjectByInfo('button_blue_mid');
        buttonMid.setStatic(true);
        var bridge = getObjectByInfo('bridge_lvl13');
        bridge.setStatic(true);
        self.bridge = bridge;
        rotateHandler.call(bridge.box2dBody, buttonLeft);
        rotateHandler.call(bridge.box2dBody, buttonRight);
        var propLeft = getObjectByCustomInfo('propLeft');
        propLeft.position = 'down';
        var buttonLeft_prop = getObjectByCustomInfo('buttonLeft_prop');
        addHint.call(buttonLeft_prop, buttonLeft_prop.x, buttonLeft_prop.y);
        self.moveProp.call(buttonLeft_prop, propLeft.box2dBody);
        var propRight = getObjectByCustomInfo('propRight');
        propRight.position = 'down';
        var buttonRight_prop = getObjectByCustomInfo('buttonRight_prop');
        addHint.call(buttonRight_prop, buttonRight_prop.x, buttonRight_prop.y);
        self.moveProp.call(buttonRight_prop, propRight.box2dBody);
        self.buttonRight_prop = buttonRight_prop;
        self.buttonLeft_prop = buttonLeft_prop;
        self.propRight = propRight;
        self.propLeft = propLeft;
        self.downSticks = getObjectByCustomInfo('downSticks');
        self.downSticks.visible = false;
        self.rope2 = getObjectByInfo('rope2');
        self.rope2.visible = false;
        self.rope3 = getObjectByInfo('rope3');
        self.rope3.visible = false;
        self.rope4 = getObjectByInfo('rope4');
        self.rope4.visible = false;
        self.rope5 = getObjectByInfo('rope5');
        self.rope5.visible = false;
        self.rope6 = getObjectByInfo('rope6');
        self.rope6.visible = false;
        addStateBobFlatten();
        self.movePress();
    },
    movePress: function () {
        var self = levelsScripts[11],
            body = self.press.box2dBody;
        stage.setTimeout(self.movePress, fps * 2.5);
        if (self.propRight.position == 'up' || self.propLeft.position == 'up') return;
        self.buttonRight_prop.gotoAndStop(1);
        self.buttonLeft_prop.gotoAndStop(1);
        move(true);

        function move(down) {
            if (field.bob.gameOver) return;
            var oldPos = body.GetCenterPosition();
            var int = stage.setInterval(function () {
                var pos = body.GetCenterPosition();
                if (down) pos.y += 8;
                else pos.y -= 8;
                changeVisible(pos, self.downSticks);
                changeVisible(pos, self.rope2);
                changeVisible(pos, self.rope3);
                changeVisible(pos, self.rope4);
                changeVisible(pos, self.rope5);
                changeVisible(pos, self.rope6);
                body.SetOriginPosition(pos, 0);
                if (down) self.ifBobFlatten();
                if (Math.abs(oldPos.y - pos.y) > 70) {
                    console.log('stop!');
                    stage.clearInterval(int);
                    if (down) {
                        if (isSoundOn) mixer.play('snd_press');
                        var mc = new Sprite(bitmaps.smoke_lvl13, 220, 56, 11);
                        mc.x = 192;
                        mc.y = 150;
                        mc.onenterframe = function (e) {
                            if (e.target.currentFrame == 9) e.target.destroy = true;
                        }
                        stage.addChild(mc);
                        stage.setTimeout(function () {
                            move(false)
                        }, Math.floor(fps * 0.6));
                    } else {
                        self.buttonRight_prop.gotoAndStop(0);
                        self.buttonLeft_prop.gotoAndStop(0);
                    }
                }
            }, 1);

            function changeVisible(pos, elem) {
                if (pos.y > elem.y) {
                    if (!elem.visible) elem.visible = true;
                } else {
                    if (elem.visible) elem.visible = false;
                }
            };
        };
    },
    moveProp: function (prop) {
        var self = levelsScripts[11],
            but = this;
        but.onclick = function () {
            if (but.block || but.currentFrame == 1) return;
            if (prop.sprite.position == 'up') {
                prop.sprite.position = 'down';
                var up = false;
            } else {
                prop.sprite.position = 'up';
                var up = true;
            }
            but.block = true;
            prop.sprite.setStatic(false);
            var oldPos = prop.GetCenterPosition();
            var int1 = stage.setInterval(function () {
                var pos = prop.GetCenterPosition();
                if (up) pos.y -= 8;
                else pos.y += 8;
                prop.SetOriginPosition(pos, 0);
                if (Math.abs(oldPos.y - pos.y) > 70) {
                    stage.setTimeout(function () {
                        prop.sprite.setStatic(true);
                        but.block = false;
                    }, 2);
                    stage.clearInterval(int1);
                }
            }, 1);
        }
    },
    ifBobFlatten: function () {
        var press = levelsScripts[11].press,
            bob = field.bob;
        if (!press.crushedBob && stage.hitTest(bob, press)) {
            bob.changeState('BobFlatten');
            bob.BobFlatten.gotoAndPlay(0);
            bob.box2dBody.Freeze();
            stage.setTimeout(function () {
                bob.gameOver = true;
            }, fps);
            bob.onclick = null;
            press.crushedBob = true;
        };
    },
    ifBobFalls: function () {
        if (field.bob.y > 210) bobFalls();
    },
    pretick: function () {
        var self = levelsScripts[11];
        self.ifBobFalls();
    },
    posttick: function () {}
}, {
    init: function () {
        var self = levelsScripts[12];
        var carriage1 = getObjectByInfo('carriage1_lvl14');
        var carriage2 = getObjectByInfo('carriage2_lvl14');
        var carriage3 = getObjectByInfo('carriage3_lvl14');
        var carriage4 = getObjectByInfo('carriage4_lvl14');
        var button_left_down = getObjectByCustomInfo('button_left_down');
        addHint.call(button_left_down, button_left_down.x, button_left_down.y);
        var button_left_up = getObjectByCustomInfo('button_left_up');
        addHint.call(button_left_up, button_left_up.x, button_left_up.y);
        var button_right_down = getObjectByCustomInfo('button_right_down');
        addHint.call(button_right_down, button_right_down.x, button_right_down.y);
        var button_right_up = getObjectByCustomInfo('button_right_up');
        addHint.call(button_right_up, button_right_up.x, button_right_up.y);
        self.moveCarriage.call(button_left_down, carriage3, carriage1, 143);
        self.moveCarriage.call(button_left_up, carriage1, carriage3, 143);
        self.moveCarriage.call(button_right_down, carriage4, carriage2, 145);
        self.moveCarriage.call(button_right_up, carriage2, carriage4, 133);
    },
    moveCarriage: function (carUp, carDown, minHeight) {
        var but = this,
            int, bob = field.bob;
        but.onmousedown = function (e) {
            if (carUp.box2dBody.GetCenterPosition().y < minHeight) return;
            int = stage.setInterval(function () {
                var posUp = carUp.box2dBody.GetCenterPosition();
                posUp.y -= 4;
                var posDown = carDown.box2dBody.GetCenterPosition();
                posDown.y += 4;
                if (carUp.box2dBody.GetContactList()) {
                    var bob_pos = field.bob.box2dBody.GetCenterPosition();
                    bob_pos.y -= 4;
                    field.bob.box2dBody.SetOriginPosition(bob_pos, 0);
                }
                if (carDown.box2dBody.GetContactList()) {
                    var bob_pos = field.bob.box2dBody.GetCenterPosition();
                    bob_pos.y += 4;
                    field.bob.box2dBody.SetOriginPosition(bob_pos, 0);
                }
                carUp.box2dBody.SetOriginPosition(posUp, 0);
                carDown.box2dBody.SetOriginPosition(posDown, 0);
                if (posUp.y < minHeight) stopMove();
            }, 1);
        }
        but.onmouseup = stopMove;
        but.onmouseout = stopMove;

        function stopMove() {
            stage.clearInterval(int);
        }
    },
    ifBobFalls: function () {
        if (field.bob.y > 267) bobFalls();
    },
    pretick: function () {
        var self = levelsScripts[12];
        self.ifBobFalls();
    },
    posttick: function () {}
}, {
    init: function () {
        var self = levelsScripts[13];
        var buttonLeft = getObjectByInfo('button_blue_left');
        addHint.call(buttonLeft, buttonLeft.x, buttonLeft.y);
        var buttonRight = getObjectByInfo('button_blue_right');
        addHint.call(buttonRight, buttonRight.x, buttonRight.y);
        var lever = getObjectByInfo('Lever4');
        lever.onenterframe = function (e) {
            if (e.target.currentFrame == 5) {
                e.target.stop();
            };
        }
        lever.side = 'up';
        var bridge = getObjectByInfo('bridge_lvl15');
        bridge.setStatic(true);
        addHint.call(lever, lever.x + 6, lever.y + 1);
        var mechanism = getObjectByInfo('mechanism_lvl15');
        mechanism.onenterframe = function (e) {
            if (e.target.currentFrame == 8) e.target.stop();
        };
        self.mechanism = mechanism;
        self.mechanismBody = getObjectByCustomInfo('mechanismBody').box2dBody;
        lever.onclick = self.leverAction;
        var circle = getObjectByInfo('circle_lvl15');
        circle.setStatic(true);
        var prop = getObjectByInfo('prop_lvl15');
        prop.setStatic(true);
        moveBridge.call(bridge.box2dBody, buttonLeft, 85, circle, prop, true);
        moveBridge.call(bridge.box2dBody, buttonRight, 268, circle, prop, true);
        self.box = null;
        self.addBox();
        addStateBobFlatten();
    },
    leverAction: function (e) {
        var obj = e.target,
            self = levelsScripts[13];
        if (self.mechanism.block) return;
        self.mechanism.block = true;
        var pos = self.mechanismBody.GetCenterPosition();
        if (isSoundOn) mixer.play('snd_lever_double');
        if (obj.side == 'up') {
            if (isSoundOn) mixer.play('snd_door_left');
            obj.side = 'down';
            obj.gotoAndPlay(0);
            self.mechanism.gotoAndPlay(0);
            pos.x -= 150;
        } else {
            if (isSoundOn) mixer.play('snd_door_right');
            obj.side = 'up';
            obj.rewindAndStop(5);
            self.mechanism.rewindAndStop(8);
            pos.x += 150;
        }
        stage.setTimeout(function () {
            self.mechanismBody.SetOriginPosition(pos, 0);
            stage.setTimeout(function () {
                self.mechanism.block = false
            }, Math.floor(fps / 8));
        }, Math.floor(fps / 4));
    },
    addBox: function () {
        var self = levelsScripts[13];
        stage.setInterval(function () {
            if (!self.box) {
                self.box = createObject({
                    type: "box_lvl15",
                    x: 270,
                    y: -16,
                    rotation: 0
                });
                self.box.setZIndex(14);
            };
        }, fps);
    },
    destroyBox: function () {
        var self = levelsScripts[13];
        if (self.box && self.box.y > 350) {
            self.box.destroy = true;
            world.DestroyBody(self.box.box2dBody);
            self.box = null;
        };
    },
    ifBobFalls: function () {
        if (field.bob.y > 260) bobFalls();
    },
    ifBobFlatten: function () {
        var box = levelsScripts[13].box,
            bob = field.bob;
        if (box && !box.crushedBob && stage.hitTest(bob, box) && (box.y + box.height / 2) < bob.y) {
            bob.changeState('BobFlatten');
            bob.BobFlatten.gotoAndPlay(0);
            bob.box2dBody.Freeze();
            stage.setTimeout(function () {
                box.box2dBody.Freeze();
            }, 3);
            bob.onclick = null;
            box.crushedBob = true;
        };
    },
    ifBoxLetSmoke: function () {
        var self = levelsScripts[13],
            box = self.box;
        if (!box || box.letSmoke) return;
        var c = box.box2dBody.GetContactList();
        if (c && c.other.sprite.custom == 'mechanismBody') {
            if (isSoundOn) mixer.play('snd_box_dropped');
            var mc = new Sprite(bitmaps.smoke_lvl15, 117, 30, 22);
            mc.x = box.x;
            mc.y = box.y;
            mc.onenterframe = function (e) {
                if (e.target.currentFrame == 21) e.target.destroy = true;
            }
            stage.addChild(mc);
            box.letSmoke = true;
        };
    },
    pretick: function () {
        var self = levelsScripts[13];
        self.destroyBox();
        self.ifBobFalls();
        self.ifBobFlatten();
        self.ifBoxLetSmoke();
    }
}, {
    init: function () {
        var self = levelsScripts[14];
        var bridge1 = getObjectByCustomInfo('bridge1');
        bridge1.setStatic(true);
        var bridge2 = getObjectByCustomInfo('bridge2');
        bridge2.setStatic(true);
        var button1_left = getObjectByCustomInfo('button1_left');
        var button1_right = getObjectByCustomInfo('button1_right');
        var button2_left = getObjectByCustomInfo('button2_left');
        var button2_right = getObjectByCustomInfo('button2_right');
        addHint.call(button1_left, button1_left.x, button1_left.y);
        addHint.call(button1_right, button1_right.x, button1_right.y);
        addHint.call(button2_left, button2_left.x, button2_left.y);
        addHint.call(button2_right, button2_right.x, button2_right.y);
        rotateHandler.call(bridge1.box2dBody, button1_left);
        rotateHandler.call(bridge1.box2dBody, button1_right);
        rotateHandler.call(bridge2.box2dBody, button2_left);
        rotateHandler.call(bridge2.box2dBody, button2_right);
        var latch = getObjectByInfo('latch_lvl16');
        addHint.call(latch, latch.x + 25, latch.y + 2);
        latch.position = 'right';
        latchMove.call(latch, 32);
        self.latch = latch;
        var pump = getObjectByInfo('pump_up');
        addHint.call(pump, pump.x, pump.y - 6);
        pump.position = 'up';
        pump.onclick = self.pumpAction;
        var ball = getObjectByInfo('ball');
        ball.number = 1;
        ball.setZIndex(14);
        ball.box2dBody.m_invI = 0;
        ball.onenterframe = function (e) {
            var obj = e.target;
            if (obj.currentFrame == 6) {
                if (obj.number < 6) {
                    obj.bitmap = bitmaps['ball' + obj.number];
                    obj.gotoAndStop(0);
                } else {
                    obj.stop();
                    if (obj.number == 6) self.flyBall();
                }
            }
            if (obj.number == 7 && obj.currentFrame == 5) {
                obj.bitmap = bitmaps.ball7;
                obj.totalFrames = 7;
                obj.number++;
                obj.gotoAndPlay(0);
            }
        }
        self.ball = ball;
        self.basket = getObjectByInfo('basket_invisible');
    },
    flyBall: function () {
        var body = levelsScripts[14].ball.box2dBody,
            pos = body.GetCenterPosition(),
            force = -1600000 * obstacle_density;
        if (!body.sprite.burst) body.ApplyForce(new b2Vec2(0, force), new b2Vec2(pos.x, pos.y));
    },
    pumpAction: function (e) {
        var obj = e.target,
            self = levelsScripts[14];
        if (self.ball.currentFrame !== 0) return;
        if (isSoundOn) mixer.play('snd_pump');
        self.ball.play();
        self.ball.number++;
        if (obj.position == 'up') {
            obj.position = 'down';
            obj.y += 23;
            obj.hint.y += 23;
        } else {
            obj.position = 'up';
            obj.y -= 23;
            obj.hint.y -= 23;
        }
    },
    ifBobFalls: function () {
        var x = field.bob.x,
            y = field.bob.y;
        if (y > 270) bobFalls();
        if ((y < -50 || x < -50 || x > 530) && !field.bob.gameOver) {
            field.bob.gameOver = true;
            showGameOverScreen();
        }
    },
    controlBobSpeed: function () {
        var bob = field.bob,
            basket = levelsScripts[14].basket;
        if (stage.hitTest(bob, basket)) {
            bob.box2dBody.m_linearVelocity.x = bob.speed +
                basket.box2dBody.m_linearVelocity.x;
        }
    },
    ifBallBurst: function () {
        var self = levelsScripts[14],
            latch = self.latch,
            ball = self.ball,
            basket = self.basket,
            bob = field.bob;
        if (latch.position == 'left' && stage.hitTest(ball, latch) && !ball.burst1) {
            ball.burst1 = true;
            stage.setTimeout(function () {
                if (isSoundOn) mixer.play('snd_baloon_pop');
                ball.burst = true;
                ball.bitmap = bitmaps['ball' + ball.number];
                ball.totalFrames = 6;
                ball.number++;
                ball.gotoAndPlay(0);
            }, Math.floor(fps / 5));
            stage.setInterval(function () {
                console.log('dsgj');
                if (bob.box2dBody.m_linearVelocity.y < 0 && bob.box2dBody.m_linearVelocity.y < basket.box2dBody.m_linearVelocity.y) {
                    bob.box2dBody.m_linearVelocity.y = basket.box2dBody.m_linearVelocity.y;
                }
            }, 1);
        };
    },
    pretick: function () {
        var self = levelsScripts[14];
        self.ifBobFalls();
        self.controlBobSpeed();
        self.ifBallBurst();
    }
}, {
    init: function () {
        var self = levelsScripts[15];
        var buttonLeft = getObjectByInfo('button_blue_left');
        buttonLeft.setStatic(true);
        addHint.call(buttonLeft, buttonLeft.x, buttonLeft.y);
        var buttonRight = getObjectByInfo('button_blue_right');
        buttonRight.setStatic(true);
        addHint.call(buttonRight, buttonRight.x, buttonRight.y);
        var buttonMid = getObjectByInfo('button_blue_mid');
        buttonMid.setStatic(true);
        var leftFire = getObjectByCustomInfo('leftFire');
        var middleFire = getObjectByCustomInfo('middleFire');
        var rightFire = getObjectByCustomInfo('rightFire');
        leftFire.visible = false;
        middleFire.visible = false;
        rightFire.visible = false;
        leftFire.setZIndex(16);
        middleFire.setZIndex(16);
        rightFire.setZIndex(16);
        leftFire.play();
        middleFire.play();
        rightFire.play();
        self.leftFire = leftFire;
        self.middleFire = middleFire;
        self.rightFire = rightFire;
        var leftSmallFire = getObjectByCustomInfo('leftSmallFire');
        var middleSmallFire = getObjectByCustomInfo('middleSmallFire');
        leftSmallFire.visible = false;
        middleSmallFire.visible = false;
        leftSmallFire.play();
        middleSmallFire.play();
        self.leftSmallFire = leftSmallFire;
        self.middleSmallFire = middleSmallFire;
        self.fires = getObjectByInfo('fire_lvl17');
        var fireTimeAnim = getObjectByInfo('FireTimeAnim');
        fireTimeAnim.animDelay = Math.floor(2.2 * fps);
        fireTimeAnim.onenterframe = function (e) {
            if (e.target.currentFrame == 3 && !e.target.fire) {
                e.target.fire = true;
                rightFire.visible = true;
                if (isSoundOn && gameState == STATE_GAME) {
                    mixer.play('snd_fire_gas', false, false, 3);
                }
                e.target.stop();
                stage.setTimeout(function () {
                    e.target.gotoAndPlay(0);
                    e.target.fire = false;
                    rightFire.visible = false;
                }, Math.floor(2.5 * fps));
            };
        }
        fireTimeAnim.play();
        self.fireTimeAnim = fireTimeAnim;
        var bridge = getObjectByInfo('bridge_lvl17');
        self.bridge = bridge;
        moveBridge.call(bridge.box2dBody, buttonLeft, 55);
        moveBridge.call(bridge.box2dBody, buttonRight, 237);
        self.leftButton = getObjectByCustomInfo('leftButton');
        self.rightButton = getObjectByCustomInfo('rightButton');
    },
    buttonPress: function (but, fire, smallFire) {
        var bob = field.bob,
            self = levelsScripts[15];
        if (bob.x < but.x + 25 && bob.x > but.x - 20) {
            if (but.currentFrame === 0) {
                if (isSoundOn) mixer.play('snd_button_ground_on');
                but.gotoAndStop(1);
            }
            if (isSoundOn && !fire.soundPlayed) {
                mixer.play('snd_fire_gas', false, false, 4);
                fire.soundPlayed = true;
            }
            var bridgeX = self.bridge.box2dBody.GetCenterPosition().x;
            if (bridgeX + 22 < fire.x || bridgeX - 22 > fire.x) {
                fire.visible = true;
                smallFire.visible = false;
            } else {
                fire.visible = false;
                smallFire.visible = true;
            };
        } else {
            if (but.currentFrame == 1) {
                mixer.stop(4);
                if (isSoundOn) mixer.play('snd_button_ground_off');
                but.gotoAndStop(0);
            }
            fire.visible = false;
            smallFire.visible = false;
        };
    },
    bobOnFire: function (fire) {
        var bob = field.bob;
        if (!fire.visible || !stage.hitTest(bob, fire)) return;
        bobBurns(fire);
    },
    checkIfBobOnFire: function () {
        var fires = levelsScripts[15].fires;
        for (var i = 0; i < fires.length; i++) {
            levelsScripts[15].bobOnFire(fires[i]);
        };
    },
    pretick: function () {
        var self = levelsScripts[15];
        self.buttonPress(self.leftButton, self.leftFire, self.leftSmallFire);
        self.buttonPress(self.rightButton, self.middleFire, self.middleSmallFire);
        self.checkIfBobOnFire();
    },
    posttick: function () {}
}, {
    init: function () {
        var self = levelsScripts[16];
        var lever1 = getObjectByCustomInfo('Lever1');
        addHint.call(lever1, lever1.x + 6, lever1.y + 1);
        lever1.setStatic(true);
        var lever2 = getObjectByCustomInfo('Lever2');
        lever2.scaleX = -1;
        addHint.call(lever2, lever2.x - 6, lever2.y + 1);
        lever2.side = 'up';
        lever2.onclick = self.lever2Action;
        self.lever2 = lever2;
        var energy_box = getObjectByInfo('energy_box');
        energy_box.box2dBody.GoToSleep();
        self.energy_box = energy_box;
        self.minus_plus = getObjectByInfo('minus_plus');
        self.minus_plus.setStatic(true);
        var mechanism = getObjectByInfo('mechanism');
        mechanism.onenterframe = function (e) {
            if (e.target.currentFrame == 7) {
                e.target.stop();
                e.target.setStatic(true);
            };
        };
        var button = getObjectByInfo('button_red');
        attachMouseEvents.call(button);
        button.onclick = self.buttonAction;
        self.bridge = getObjectByInfo('bridge_lvl10');
        self.pillar = getObjectByInfo('pillar_lvl10');
        self.bridge.setStatic(true);
        self.pillar.setStatic(true);
        self.barrier = getObjectByInfo('barrier_lvl10');
        self.barrier.setStatic(true);
        self.lantern = getObjectByInfo('lantern');
        self.lantern.gotoAndStop(1);
        self.lantern.setStatic(true);
        self.small_tube = getObjectByInfo('small_tube_lvl10');
        self.small_tube.setStatic(true);
        self.radiationAnim = getObjectByInfo('radiationAnim1');
        moveMechanism.call(lever1, mechanism, energy_box);
        addStateBobGrowl();
    },
    lever2Action: function () {
        var self = levelsScripts[16],
            obj = self.lever2;
        if (obj.block) return;
        obj.block = true;
        if (isSoundOn) mixer.play('snd_lever_double');
        if (obj.side == 'up') {
            obj.side = 'down';
            obj.gotoAndPlay(0);
            obj.onenterframe = function (e) {
                if (e.target.currentFrame == 5) e.target.stop();
            }
            self.moveBridge(true);
        } else {
            obj.side = 'up';
            obj.rewindAndStop(5);
            self.moveBridge(false);
        }
    },
    moveBridge: function (up) {
        var self = levelsScripts[16],
            body = self.bridge.box2dBody,
            oldPos, newPos = {};
        if (isSoundOn) mixer.play('snd_bridge');
        self.pillar.setStatic(false);
        self.bridge.setStatic(false);
        oldPos = {
            x: body.GetCenterPosition().x,
            y: body.GetCenterPosition().y
        };
        if (up) oldPos.x += 35;
        else oldPos.y += 35;
        var int = stage.setInterval(function () {
            var rot, vec;
            if (up) {
                self.flip(field.bob.box2dBody, oldPos);
                self.flip(self.energy_box.box2dBody, oldPos);
            }
            vec = new Vector(35, 0);
            if (up) rot = body.m_rotation + 0.1;
            else rot = body.m_rotation - 0.1;
            vec.rotate(-rot);
            newPos.x = oldPos.x - vec.x;
            newPos.y = oldPos.y - vec.y;
            body.SetOriginPosition(newPos, rot);
            if ((up && rot >= Math.PI / 2) || (!up && rot <= 0)) {
                stage.clearInterval(int);
                if (!up) body.SetOriginPosition(new b2Vec2(236, 177), 0);
                stage.setTimeout(function () {
                    self.bridge.setStatic(true);
                    self.pillar.setStatic(true);
                    self.lever2.block = false;
                }, 2)
            }
        }, 1);
    },
    flip: function (body, d) {
        if (body.sprite.x < 195 || !stage.hitTest(levelsScripts[16].bridge, body.sprite)) return;
        var force = body.m_mass * getDistance(body.sprite, d) / 3.2;
        if (body.sprite.info == "energy_box") {
            body.ApplyImpulse(new b2Vec2(force * 0.7, -force * 1.3), body.GetCenterPosition());
        } else {
            stage.setTimeout(function () {
                if (!stage.hitTest(levelsScripts[16].bridge, body.sprite)) return;
                body.ApplyImpulse(new b2Vec2(force * 0.6, -force * 1.4), body.GetCenterPosition());
            }, Math.floor(fps / 10));
        }
    },
    ifCancelSpeed: function () {
        var self = levelsScripts[16];
        if ((stage.hitTest(field.bob, self.bridge) && self.lever2.block)) {
            field.cancelSpeed = true;
        } else field.cancelSpeed = false;
    },
    ifBobFalls: function () {
        if (field.bob.y < 190 || field.bob.inPit) return;
        if (field.bob.x > 272) {
            bobFalls();
        } else {
            field.bob.inPit = true;
            stage.setTimeout(function () {
                field.bob.changeState('BobGrowl');
                field.bob.BobGrowl.gotoAndPlay(0);
            }, Math.floor(fps / 3));
        };
    },
    switchOnElectricity: function () {
        var self = levelsScripts[16];
        if (self.minus_plus.currentFrame == 1 || !stage.hitTest(self.energy_box, self.minus_plus)) return;
        if (isSoundOn) mixer.play('snd_battery');
        if (isSoundOn) stage.setTimeout(function () {
            mixer.play('snd_door_left');
        }, Math.floor(fps / 4));
        self.lantern.setStatic(false);
        self.small_tube.setStatic(false);
        self.barrier.setStatic(false);
        self.minus_plus.gotoAndStop(1)
        self.lantern.gotoAndStop(0);
        var int = stage.setInterval(function () {
            var pos = self.barrier.box2dBody.GetCenterPosition();
            pos.y -= 1;
            self.barrier.box2dBody.SetOriginPosition(pos, 0);
            if (pos.y < 20) {
                stage.clearInterval(int);
                stage.setTimeout(function () {
                    self.lantern.setStatic(true);
                    self.small_tube.setStatic(true);
                    self.barrier.setStatic(true);
                }, 1)
            }
        }, 1);
    },
    buttonAction: function (e) {
        if (e.target.done) return;
        e.target.done = true;
        var bob = field.bob;
        var radiationAnim = levelsScripts[16].radiationAnim;
        if (isSoundOn) mixer.play('snd_button');
        if (isSoundOn) mixer.play('snd_gas_hiss');
        if (isSoundOn) mixer.play('snd_bob_die_radiation');
        bob[bob.state].opacity = 0;
        field.bob.forceSleep();
        bob.onclick = null;
        var mc = new Sprite(bitmaps.Radiation1, 94, 66, 11);
        mc.x = bob.x - 5;
        mc.y = bob.y - 5;
        mc.animDelay = 2;
        mc.setZIndex(1);
        mc.onenterframe = function (e) {
            if (e.target.currentFrame == 10) {
                e.target.destroy = true;
                var mc = new Sprite(bitmaps.Radiation2, 94, 66, 8);
                mc.x = e.target.x;
                mc.y = e.target.y;
                mc.animDelay = 2;
                mc.setZIndex(1);
                mc.onenterframe = function (e) {
                    if (e.target.currentFrame == 7 && !e.target.block) {
                        e.target.stop();
                        e.target.block = true;
                        var mc = new Sprite(bitmaps.spirit, 75, 100);
                        mc.x = e.target.x;
                        mc.y = e.target.y;
                        mc.setZIndex(1);
                        stage.addChild(mc);
                        var tween = stage.createTween(mc, "y", e.target.y, -50, fps * 1.5, Easing.linear.easeIn);
                        tween.play();
                        tween.onfinish = showGameOverScreen;
                    }
                }
                stage.addChild(mc);
            }
        }
        stage.addChild(mc);
        radiationAnim.setStatic(false);
        radiationAnim.num = 1;
        radiationAnim.animDelay = 1;
        radiationAnim.onenterframe = function (e) {
            var obj = e.target;
            if (gameState != STATE_GAME) obj.stop();
            if (obj.currentFrame == 5) {
                if (obj.num < 3) obj.num++;
                else obj.num = 1;
                obj.bitmap = bitmaps['radiationAnim' + obj.num];
                obj.gotoAndPlay(0);
            }
        }
        radiationAnim.play();
    },
    pretick: function () {
        var self = levelsScripts[16];
        self.ifCancelSpeed();
        self.ifBobFalls();
        self.switchOnElectricity();
    }
}, {
    init: function () {
        var self = levelsScripts[17],
            bob = field.bob;
        addStateBobShocked();
        var platform = getObjectByInfo('Baraban');
        platform.animDelay = 2;
        var slider = getObjectByInfo('slider');
        processSlider.call(slider, platform);
        var current = getObjectByCustomInfo('currentDown');
        current.visible = false;
        self.current = current;
        self.bobIsShocked = false;
        var currentTrans = getObjectByCustomInfo('currentUp');
        currentTrans.visible = false;
        currentTrans.scaleX = 0.5;
        currentTrans.scaleY = 0.5;
        var smoke = getObjectByInfo('smoke');
        for (var i = 0; i < smoke.length; i++) {
            smoke[i].visible = false;
            smoke[i].animDelay = i + 2;
            smoke[i].scaleY = 0.7;
            smoke[i].scaleX = 0.7;
            smoke[i].play();
        };
        var lift = getObjectByInfo('lift_lvl18').box2dBody;
        lift.sprite.setStatic(true);
        lift.restrict = [231, 323];
        var btnLeft = getObjectByCustomInfo('btnLeft');
        var btnMiddle = getObjectByCustomInfo('btnMiddle');
        btnMiddle.gotoAndStop(1);
        var btnRight = getObjectByCustomInfo('btnRight');
        var redLeft = getObjectByCustomInfo('redLeft');
        var redMiddle = getObjectByCustomInfo('redMiddle');
        var redRight = getObjectByCustomInfo('redRight');
        redLeft.gotoAndStop(1);
        redMiddle.gotoAndStop(1);
        redRight.gotoAndStop(1);
        var greenLeft = getObjectByCustomInfo('greenLeft');
        var greenMiddle = getObjectByCustomInfo('greenMiddle');
        var greenRight = getObjectByCustomInfo('greenRight');
        greenLeft.gotoAndStop(1);
        greenMiddle.gotoAndStop(1);
        greenRight.gotoAndStop(1);
        var lanternLeft = getObjectByCustomInfo('lanternLeft');
        var lanternMiddle = getObjectByCustomInfo('lanternMiddle');
        var lanternRight = getObjectByCustomInfo('lanternRight');
        lanternLeft.gotoAndStop(2);
        lanternMiddle.gotoAndStop(2);
        lanternRight.gotoAndStop(2);
        var bridgeLeft = getObjectByInfo('bridge1_lvl18').box2dBody;
        bridgeLeft.restrict = [121, 175];
        var bridgeRight = getObjectByInfo('bridge2_lvl18').box2dBody;
        bridgeRight.restrict = [207, 280];
        self.buttonAction.call(btnLeft, greenLeft, redLeft, lanternLeft, self.moveBridge, bridgeLeft);
        self.buttonAction.call(btnMiddle, greenMiddle, redMiddle, lanternMiddle, self.moveLift, lift, current);
        self.buttonAction.call(btnRight, greenRight, redRight, lanternRight, self.moveBridge, bridgeRight);
        var trans = getObjectByInfo('trans1');
        addHint.call(trans, trans.x - 29, trans.y + 27);
        trans.onclick = function (e) {
            var obj = e.target;
            var cp = new Vector(e.x + obj.x, e.y + obj.y);
            var rect1 = new Rectangle(obj.x - 27, obj.y + 27, 36, 30, 0);
            if (!rect1.hitTestPoint(cp)) return;
            obj.play();
            obj.hint.removeHint();
            self.moveLift(lift, true);
            current.visible = true;
            current.play();
            greenMiddle.gotoAndStop(0);
            redLeft.gotoAndStop(0);
            redRight.gotoAndStop(0);
            lanternLeft.gotoAndStop(1);
            lanternMiddle.gotoAndStop(0);
            lanternRight.gotoAndStop(1);
            delete obj.onclick;
        };
        trans.num = 1;
        trans.onenterframe = function (e) {
            var obj = e.target;
            if (obj.currentFrame == 7) {
                if (obj.num == 3) {
                    currentTrans.play();
                    currentTrans.visible = true;
                    smoke[1].visible = true;
                };
                if (obj.num == 4) {
                    smoke[0].visible = true;
                    obj.stop();
                    return;
                }
                obj.num++;
                obj.bitmap = bitmaps['trans' + obj.num];
                obj.gotoAndPlay(0);
            }
        };
        self.trans = trans;
        var func = bob.onclick;
        delete bob.onclick;
        stage.setTimeout(function () {
            bob.changeState('hide');
            bob.hide.gotoAndPlay(0);
            bob.forceSleep();
            stage.setTimeout(function () {
                bob.onclick = func;
                var wall = createObject({
                    type: "invisible_wall_small",
                    x: 36,
                    y: 216,
                    rotation: Math.PI / 2
                });
                wall.visible = false;
            }, 3 * 12);
        }, 2 * fps);
    },
    buttonAction: function (green, red, lantern, func, bridge, current) {
        var btn = this,
            self = levelsScripts[17];
        btn.onclick = btnOnClick;

        function btnOnClick() {
            if (self.trans.num == 1) return;
            if (btn.currentFrame == 0) {
                btn.gotoAndStop(1);
                green.gotoAndStop(0);
                red.gotoAndStop(1);
                lantern.gotoAndStop(0);
                func(bridge, true);
                if (current) current.visible = true;
            } else {
                btn.gotoAndStop(0);
                green.gotoAndStop(1);
                red.gotoAndStop(0);
                lantern.gotoAndStop(1);
                func(bridge, false);
                if (current) current.visible = false;
            }
            return false;
        }
    },
    moveLift: function (lift, down) {
        stage.clearInterval(lift.int);
        lift.sprite.setStatic(false);
        if (isSoundOn) {
            if (down) mixer.play('snd_door_left');
            else mixer.play('snd_door_right');
        };
        lift.int = stage.setInterval(function () {
            var pos = lift.GetCenterPosition();
            if (down) pos.y += 2;
            else pos.y -= 2;
            lift.SetOriginPosition(pos, 0);
            if ((down && (pos.y > lift.restrict[1])) || (!down && (pos.y < lift.restrict[0]))) {
                stage.setTimeout(function () {
                    lift.sprite.setStatic(true);
                }, 2);
                stage.clearInterval(lift.int);
            }
        }, 1);
    },
    moveBridge: function (bridge, toLeft) {
        stage.clearInterval(bridge.int);
        bridge.sprite.setStatic(false);
        if (isSoundOn) {
            if (toLeft) mixer.play('snd_door_left');
            else mixer.play('snd_door_right');
        };
        if (bridge.sprite.info == 'bridge2_lvl18') toLeft = !toLeft;
        bridge.int = stage.setInterval(function () {
            var pos = bridge.GetCenterPosition();
            if (toLeft) pos.x -= 2;
            else pos.x += 2;
            bridge.SetOriginPosition(pos, 0);
            if ((toLeft && (pos.x < bridge.restrict[0])) || (!toLeft && (pos.x > bridge.restrict[1]))) {
                stage.setTimeout(function () {
                    bridge.sprite.setStatic(true);
                }, 2);
                stage.clearInterval(bridge.int);
            }
        }, 1);
    },
    ifBobShocked: function () {
        var self = levelsScripts[17];
        if (!self.bobIsShocked && self.current.visible && stage.hitTest(self.current, field.bob)) {
            self.bobIsShocked = true;
            if (isSoundOn) mixer.play('snd_bob_die_radiation', false);
            stage.setTimeout(function () {
                if (isSoundOn) mixer.play('snd_electro_shock', false);
                field.bob.forceSleep();
                field.bob.speed = 0;
                var pos = field.bob.box2dBody.GetCenterPosition();
                pos.y = pos.y - 20;
                field.bob.box2dBody.SetCenterPosition(pos, 0);
                field.bob.box2dBody.Freeze();
                field.bob.changeState('shocked');
                field.bob.shocked.gotoAndPlay(0);
                field.bob.onclick = null;
            }, Math.floor(fps / 4));
        }
    },
    ifBobFalls: function () {
        if (field.bob.y > 240) {
            bobFalls();
        }
    },
    pretick: function () {
        var self = levelsScripts[17];
        self.ifBobShocked();
        self.ifBobFalls();
    },
    posttick: function () {}
}, {
    init: function () {
        var self = levelsScripts[18];
        var foundation = getObjectByInfo('foundation');
        foundation.scaleY = -1;
        var buttonLeft = getObjectByCustomInfo('buttonLeft');
        attachMouseEvents.call(buttonLeft);
        addHint.call(buttonLeft, buttonLeft.x, buttonLeft.y);
        var buttonDown = getObjectByCustomInfo('buttonDown');
        attachMouseEvents.call(buttonDown);
        addHint.call(buttonDown, buttonDown.x, buttonDown.y);
        var buttonRight = getObjectByCustomInfo('buttonRight');
        attachMouseEvents.call(buttonRight);
        addHint.call(buttonRight, buttonRight.x, buttonRight.y);
        var springLeft = getObjectByCustomInfo('springLeft');
        var springDown = getObjectByCustomInfo('springDown');
        var springRight = getObjectByCustomInfo('springRight');
        springLeft.onenterframe = springOnEnterFrame;
        springDown.onenterframe = springOnEnterFrame;
        springRight.onenterframe = springOnEnterFrame;
        self.bridge = getObjectByInfo('bridge_lvl19');
        self.bridge.setStatic(true);
        self.circle = getObjectByInfo('circle_lvl19');
        self.circle.setStatic(true);
        var buttonBridge = getObjectByCustomInfo('buttonBridge');
        addHint.call(buttonBridge, buttonBridge.x, buttonBridge.y);
        attachMouseEvents.call(buttonBridge);
        buttonBridge.onclick = self.moveBridge;
        self.btn = getObjectByInfo('btn02');
        self.btn.setStatic(true);
        self.cover = getObjectByInfo('cover_lvl19');
        self.cover.setStatic(true);
        self.earth = getObjectByInfo('earth_lvl19');
        self.earth.setStatic(true);
        self.slip = getObjectByCustomInfo('slip');
        self.slip2 = getObjectByCustomInfo('slip2');
        self.buttonRedAction.call(buttonRight, springRight, new b2Vec2(-2500000, 0));
        self.buttonRedAction.call(buttonLeft, springLeft, new b2Vec2(4500000, 0));
        self.buttonRedAction.call(buttonDown, springDown, new b2Vec2(0, -3000000));

        function springOnEnterFrame(e) {
            if (e.target.currentFrame == 11) e.target.gotoAndStop(0);
        };
    },
    moveBridge: function (e) {
        var bridge = levelsScripts[18].bridge,
            circle = levelsScripts[18].circle;
        if (isSoundOn) mixer.play('snd_button');
        bridge.setStatic(false);
        circle.setStatic(false);
        stage.setTimeout(function () {
            if (bridge.up) {
                bridge.up = false;
                bridge.box2dBody.SetOriginPosition(new b2Vec2(268, 123), -0.55);
            } else {
                bridge.up = true;
                bridge.box2dBody.SetOriginPosition(new b2Vec2(234.5, 104.5), -Math.PI / 2);
            }
            stage.setTimeout(function () {
                circle.setStatic(true);
                bridge.setStatic(true);
            }, 2);
        }, 1);
    },
    ifBobPressBtn: function () {
        var self = levelsScripts[18];
        if (self.btn.currentFrame == 1 || !stage.hitTest(field.bob, self.btn)) return;
        if (isSoundOn) mixer.play('snd_door_left');
        self.cover.setStatic(false);
        self.earth.setStatic(false);
        self.btn.gotoAndStop(1);
        var pos = self.cover.box2dBody.GetCenterPosition();
        var int = stage.setInterval(function () {
            pos.y += 2;
            self.cover.box2dBody.SetOriginPosition(pos, 0);
            if (pos.y > 276) {
                self.cover.setStatic(true);
                self.earth.setStatic(true);
                stage.clearInterval(int);
            }
        }, 1);
    },
    buttonRedAction: function (spring, vec) {
        var self = levelsScripts[18],
            but = this,
            int;
        but.onclick = function () {
            if (spring.currentFrame !== 0) return;
            spring.play();
            if (isSoundOn) mixer.play('snd_spring');
            if (stage.hitTest(field.bob, spring)) {
                field.bob.inertia = true;
                stage.clearTimeout(field.bob.timeout);
                field.bob.timeout = stage.setTimeout(function () {
                    field.bob.inertia = false;
                }, Math.floor(fps * 0.8));
                stage.setTimeout(function () {
                    field.bob.box2dBody.ApplyImpulse(vec, field.bob.box2dBody.GetCenterPosition());
                }, 2);
            };
        }
    },
    ifCancelSpeed: function () {
        var self = levelsScripts[18],
            bob = field.bob;
        var c = bob.box2dBody.GetContactList();
        if ((bob.state == 'hide' && (stage.hitTest(self.slip, bob) || stage.hitTest(self.slip2, bob))) || bob.inertia || stage.hitTest(self.cover, bob) || (c && c.other.sprite.info == 'bridge_lvl19' && c.other.m_rotation < -Math.PI / 4)) {
            field.cancelSpeed = true;
        } else field.cancelSpeed = false;
    },
    pretick: function () {
        var self = levelsScripts[18];
        self.ifBobPressBtn();
        self.ifCancelSpeed();
    }
}, {
    init: function () {
        var self = levelsScripts[19];
        var boxRed = getObjectByInfo('boxRed');
        boxRed.box2dBody.GoToSleep();
        self.boxRed = boxRed;
        var boxGreen = getObjectByInfo('boxGreen');
        boxGreen.box2dBody.GoToSleep();
        self.boxGreen = boxGreen;
        var mechanism = getObjectByInfo('mechanism');
        mechanism.onenterframe = function (e) {
            var obj = e.target;
            if (obj.currentFrame == 7) {
                obj.stop();
                obj.rewindAndStop(6);
                stage.setTimeout(function () {
                    obj.setStatic(true);
                }, 6 * obj.animDelay + 1);
            };
        };
        self.mechanism = mechanism;
        mechanism.setStatic(true);
        var buttonMechanism = getObjectByCustomInfo('buttonMechanism');
        attachMouseEvents.call(buttonMechanism);
        addHint.call(buttonMechanism, buttonMechanism.x, buttonMechanism.y);
        buttonMechanism.onclick = self.buttonMechanismHandler;
        buttonMechanism.num = 0;
        var leftBaraban = getObjectByCustomInfo('leftBaraban');
        leftBaraban.animDelay = 2;
        self.leftBaraban = leftBaraban;
        var turnBtnLeft = getObjectByCustomInfo('turnBtnLeft');
        processSlider.call(turnBtnLeft, leftBaraban);
        var rightBaraban = getObjectByCustomInfo('rightBaraban');
        rightBaraban.animDelay = 2;
        self.rightBaraban = rightBaraban;
        var turnBtnRight = getObjectByCustomInfo('turnBtnRight');
        processSlider.call(turnBtnRight, rightBaraban);
        var lever = getObjectByInfo('Lever2');
        addHint.call(lever, lever.x, lever.y + 3);
        lever.side = 'left';
        lever.onclick = self.lever19Action;
        self.lever = lever;
        self.lanternDown = getObjectByCustomInfo('lanternDown');
        self.lanternUp = getObjectByCustomInfo('lanternUp');
        self.lanternUp.gotoAndStop(1);
        self.lanternDown.setStatic(true);
        self.lanternDown.setStatic(true);
        self.bridgeUp = getObjectByInfo('bridgeUp_lvl20');
        self.bridgeUp.setStatic(true);
        self.bridgeDown = getObjectByInfo('bridgeDown_lvl20');
        self.bridgeDown.setStatic(true);
        self.bridgeDown.setZIndex(3);
        self.minus_plus_red = getObjectByInfo('minus_plus_red');
        self.minus_plus_red.setStatic(true);
        self.minus_plus_green = getObjectByInfo('minus_plus_green');
        self.minus_plus_green.setStatic(true);
        self.lift_cover1 = getObjectByInfo('lift_cover1');
        self.lift_cover1.setStatic(true);
        self.lift_cover2 = getObjectByInfo('lift_cover2');
        self.lift_cover2.setStatic(true);
        self.buttonLift = getObjectByCustomInfo('buttonLift');
        self.buttonLift.setStatic(true);
        self.lift = getObjectByInfo('lift_lvl20');
        self.lift.setStatic(true);
        self.lift.position = 'down';
        self.earthUp = getObjectByInfo('earthUp_lvl20');
        self.earthUp.setStatic(true);
        self.earthDown = getObjectByInfo('earthDown_lvl20');
        self.earthDown.setStatic(true);
        self.earthDown.setZIndex(4);
        addStateBobGrowl();
        var tube = getObjectByInfo('entrance');
        var int = stage.setInterval(function () {
            if (!stage.hitTest(tube, field.bob)) {
                var wall = createObject({
                    type: "invisible_wall_small",
                    x: 45,
                    y: 166,
                    rotation: Math.PI / 2
                });
                wall.visible = false;
                stage.clearInterval(int);
            }
        }, fps);
    },
    lever19Action: function (e) {
        var self = levelsScripts[19];
        var obj = e.target;
        if (self.block) return;
        self.block = true;
        self.lanternUp.setStatic(false);
        self.lanternDown.setStatic(false);
        if (isSoundOn) mixer.play('snd_lever_double');
        if (obj.side == 'left') {
            if (isSoundOn) mixer.play('snd_door_left');
            obj.side = 'right';
            obj.gotoAndPlay(0);
            obj.onenterframe = function (e) {
                if (e.target.currentFrame == 5) e.target.stop();
            }
            self.moveBridge(true, self.bridgeUp.box2dBody, 44, self.earthUp, self.lanternUp);
            self.moveBridge(false, self.bridgeDown.box2dBody, 66, self.earthDown, self.lanternDown);
            self.lanternUp.gotoAndStop(0);
            self.lanternDown.gotoAndStop(1);
        } else {
            if (isSoundOn) mixer.play('snd_door_right');
            obj.side = 'left';
            obj.rewindAndStop(5);
            self.moveBridge(false, self.bridgeUp.box2dBody, 44, self.earthUp, self.lanternUp);
            self.moveBridge(true, self.bridgeDown.box2dBody, 66, self.earthDown, self.lanternDown);
            self.lanternUp.gotoAndStop(1);
            self.lanternDown.gotoAndStop(0);
        }
    },
    moveBridge: function (toRight, bridge, distance, earth, lantern) {
        bridge.sprite.setStatic(false);
        earth.setStatic(false);
        var oldPos = bridge.GetCenterPosition();
        var int1 = stage.setInterval(function () {
            var pos = bridge.GetCenterPosition();
            if (toRight) pos.x += 11;
            else pos.x -= 11;
            bridge.SetOriginPosition(pos, 0);
            if (Math.abs(oldPos.x - pos.x) > distance) {
                stage.setTimeout(function () {
                    bridge.sprite.setStatic(true);
                    earth.setStatic(true);
                    lantern.setStatic(true);
                    if (bridge.sprite.info == 'bridgeDown_lvl20') {
                        levelsScripts[19].block = false;
                    }
                }, 2);
                stage.clearInterval(int1);
            }
        }, 1);
    },
    buttonMechanismHandler: function (e) {
        var self = levelsScripts[19];
        if (self.mechanism.currentFrame !== 0) return;
        if (isSoundOn) mixer.play('snd_lever_double');
        self.mechanism.setStatic(false);
        self.mechanism.play();
        var but = e.target;
        if (but.num === 0) {
            but.num++;
            self.boxGreen.box2dBody.WakeUp();
            var oldPos = self.boxRed.box2dBody.m_position.y;
            stage.setTimeout(function () {
                var int = stage.setInterval(function () {
                    var pos = self.boxRed.box2dBody.GetCenterPosition();
                    pos.y += 2;
                    self.boxRed.box2dBody.SetOriginPosition(pos, 0);
                    if ((pos.y - oldPos) > 33) stage.clearInterval(int);
                }, 1);
            }, Math.floor(fps / 4));
        } else {
            self.boxRed.box2dBody.WakeUp();
            but.onclick = null;
            but.hint.removeHint();
            but.gotoAndStop(0);
            but.setStatic(true);
        }
    },
    ifBobInPit: function () {
        if (!field.bob.inPit && ((field.bob.y > 210) || (field.bob.y < 100 && field.bob.x < 70))) {
            field.bob.changeState('BobGrowl');
            field.bob.BobGrowl.gotoAndPlay(0);
            field.bob.inPit = true;
        };
    },
    turnOnElectricity: function () {
        var self = levelsScripts[19];
        if (self.minus_plus_red.currentFrame != 1 && stage.hitTest(self.boxRed, self.minus_plus_red)) {
            if (isSoundOn) mixer.play('snd_battery');
            self.minus_plus_red.setStatic(false);
            self.minus_plus_red.gotoAndStop(1);
        }
        if (self.minus_plus_green.currentFrame != 1 && stage.hitTest(self.boxGreen, self.minus_plus_green)) {
            if (isSoundOn) mixer.play('snd_battery');
            self.minus_plus_green.setStatic(false);
            self.minus_plus_green.gotoAndStop(1);
        }
        if (self.lift_cover2.position != 'down' && self.minus_plus_red.currentFrame == 1 && self.minus_plus_green.currentFrame == 1) {
            if (isSoundOn) mixer.play('snd_beep');
            self.lift_cover2.position = 'down';
            self.lift_cover2.setStatic(false);
            var int = stage.setInterval(function () {
                self.lift_cover2.y += 4;
                if (self.lift_cover2.y >= 330) {
                    self.lift.setStatic(false);
                    self.lift_cover1.setStatic(false);
                    self.buttonLift.setStatic(false);
                    stage.clearInterval(int);
                    addHint.call(self.buttonLift, self.buttonLift.x, self.buttonLift.y);
                    attachMouseEvents.call(self.buttonLift);
                    self.buttonLift.onclick = self.buttonLiftAction;
                }
            }, 1);
        }
    },
    buttonLiftAction: function () {
        var self = levelsScripts[19],
            down;
        if (self.lift.position == 'down') {
            self.lift.position = 'up';
            self.moveLift(false);
        } else {
            self.lift.position = 'down';
            self.moveLift(true);
        }
    },
    moveLift: function (down) {
        var self = levelsScripts[19];
        stage.clearInterval(self.lift.int);
        self.lift.int = stage.setInterval(function () {
            var pos = self.lift.box2dBody.GetCenterPosition();
            if (down) pos.y += 4;
            else pos.y -= 4;
            self.lift.box2dBody.SetOriginPosition(pos, 0);
            if (checkIfBobOnLift(self.lift)) {
                var bob_pos = field.bob.box2dBody.GetCenterPosition();
                if (down) bob_pos.y += 4;
                else bob_pos.y -= 4;
                field.bob.box2dBody.SetCenterPosition(bob_pos, 0);
            }
            if (pos.y < 235 || (self.lever.side == 'right' && stage.hitTest(field.bob, self.bridgeUp)) || pos.y > 300) stage.clearInterval(self.lift.int);
        }, 1);
    },
    pretick: function () {
        var self = levelsScripts[19];
        self.ifBobInPit();
        self.turnOnElectricity();
    },
}, ];;
var stage;
var world;
var GET;
var LANDSCAPE_MODE = true;
var bitmaps;
var width = 480;
var height = 320;
var fps = 24;
var gameState = 0;
var STATE_GAME = 1;
var STATE_MENU = 2;
var STATE_SELECT_LEVEL = 3;
var STATE_GAME_LOGO = 4;
var STATE_ABOUT = 5;
var STATE_SPLASH = 6;
var STATE_VICTORY = 7;
var STATE_GAME_OVER = 8;
var STATE_COMICS = 9;
var STATE_FINAL = 10;
var STATE_CREDITS = 11;
var comics;
var field;
var pause = false;
var currentLevel;
var screenWidthCoef;
var screenHeightCoef;
var gameScore, totalScore;
var SPEED_WALK = fps * 1.5;
var SPEED_RUN = fps * 3;
var MORE_GAMES_URL = '#';
var WALKTHROUGH_URL = 'http://www.a10.com/walkthrough-games/snail-bob-mobile-walkthrough';
var mixer;
var isMusicOn;
var isSoundOn, loopSound;
var editorLevel = 13;
var android = navigator.userAgent.match(/Android/i);
window.onload = function () {
    GET = Utils.parseGet();
    Utils.addMobileListeners(LANDSCAPE_MODE);
    Utils.mobileCorrectPixelRatio();
    Utils.addFitLayoutListeners();
    setTimeout(startLoad, 600);
}

function startLoad() {
    var resolution = Utils.getMobileScreenResolution(LANDSCAPE_MODE);
    if (GET["debug"] == 1) resolution = Utils.getScaleScreenResolution(1, LANDSCAPE_MODE);
    Utils.globalScale = resolution.scale;
    var ratioCoefs = [1.5];
    var ratioWidth = [1];
    var ratioHeight = [1];
    if (window.innerWidth > window.innerHeight) var coef = window.innerWidth / window.innerHeight;
    else var coef = window.innerHeight / window.innerWidth;
    var min = 100000,
        minPos = -1,
        diff;
    for (var i = 0; i < ratioCoefs.length - 1; i++) {
        diff = Math.abs(coef - ratioCoefs[i]);
        if (diff < min) {
            min = diff;
            minPos = i;
        }
    }
    minPos = 0;
    screenWidthCoef = ratioWidth[minPos];
    screenHeightCoef = ratioHeight[minPos];
    screenWidthRatioPos = minPos;
    resolution.width = Math.round(resolution.width * screenWidthCoef);
    resolution.height = Math.round(resolution.height * screenHeightCoef);
    Utils.createLayout(document.getElementById("main_container"), resolution);
    Utils.addEventListener("fitlayout", function () {
        if (stage) {
            stage.drawScene(document.getElementById("screen"));
            buildBackground();
        }
    });
    Utils.addEventListener("lockscreen", function () {
        if (stage && stage.started) stage.stop();
    });
    Utils.addEventListener("unlockscreen", function () {
        if (stage && !stage.started) stage.start();
    });
    Utils.mobileHideAddressBar();
    if (GET["debug"] != 1) Utils.checkOrientation(LANDSCAPE_MODE);
    var preloader = new ImagesPreloader();
    var data = [];
    var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
    console.log('Scale = ' + Utils.globalScale);
    data.push({
        name: "hourglass",
        src: path + "hourglass.png"
    });
    data.push({
        name: 'LevelsMap',
        src: path + 'menu/' + 'LevelsMap.jpg'
    });
    data.push({
        name: 'Lvl_locked',
        src: path + 'menu/' + 'Lvl_locked.png'
    });
    data.push({
        name: 'LvlN',
        src: path + 'menu/' + 'LvlN.png'
    });
    data.push({
        name: 'numb',
        src: path + 'menu/' + 'numb.png'
    });
    data.push({
        name: 'addToWebsite',
        src: path + 'menu/' + 'addToWebsite.png'
    });
    data.push({
        name: 'bobMenu1',
        src: path + 'menu/' + 'bobMenu1.png'
    });
    data.push({
        name: 'bobMenu2',
        src: path + 'menu/' + 'bobMenu2.png'
    });
    data.push({
        name: 'bobMenu3',
        src: path + 'menu/' + 'bobMenu3.png'
    });
    data.push({
        name: 'bobMenu4',
        src: path + 'menu/' + 'bobMenu4.png'
    });
    data.push({
        name: 'credits',
        src: path + 'menu/' + 'credits.png'
    });
    data.push({
        name: 'highscores',
        src: path + 'menu/' + 'highscores.png'
    });
    data.push({
        name: 'menuBack',
        src: path + 'menu/' + 'menuBack.jpg'
    });
    data.push({
        name: 'moreGames',
        src: path + 'menu/' + 'moreGames.png'
    });
    data.push({
        name: 'play',
        src: path + 'menu/' + 'play.png'
    });
    data.push({
        name: 'soundButton',
        src: path + 'menu/' + 'soundButton.png'
    });
    data.push({
        name: 'num_lvl_map_up',
        src: path + 'menu/' + 'num_lvl_map_up.png'
    });
    data.push({
        name: 'lvl_numbs',
        src: path + 'menu/' + 'lvl_numbs.png'
    });
    data.push({
        name: 'score_num',
        src: path + 'menu/' + 'score_num.png'
    });
    data.push({
        name: 'menu_btn',
        src: path + 'menu/' + 'menu_btn.png'
    });
    for (var i = 1; i < 21; i++) {
        data.push({
            name: 'smallLvl' + i,
            src: path + 'menu/' + 'smallLvl' + i + '.png'
        });
    }
    data.push({
        name: 'logoMenu',
        src: path + 'menu/' + 'logoMenu.png'
    });
    data.push({
        name: 'creditsBack',
        src: path + 'credits/' + 'creditsBack.png'
    });
    data.push({
        name: 'Facebook',
        src: path + 'credits/' + 'Facebook.png'
    });
    data.push({
        name: 'logo',
        src: path + 'credits/' + 'logo.png'
    });
    data.push({
        name: 'x0001',
        src: path + 'credits/' + 'x0001.png'
    });
    data.push({
        name: 'Bob',
        src: path + 'Bob.png'
    });
    data.push({
        name: 'BobGo',
        src: path + 'BobGo.png'
    });
    data.push({
        name: 'BobRun',
        src: path + 'BobRun.png'
    });
    data.push({
        name: 'BobShow',
        src: path + 'BobShow.png'
    });
    data.push({
        name: 'BobHide',
        src: path + 'BobHide.png'
    });
    data.push({
        name: 'tube1',
        src: path + 'tube1.png'
    });
    data.push({
        name: 'tube2',
        src: path + 'tube2.png'
    });
    data.push({
        name: 'invisible_wall_small',
        src: path + 'invisible_wall_small.png'
    });
    data.push({
        name: 'invisible_wall_big',
        src: path + 'invisible_wall_big.png'
    });
    data.push({
        name: 'BackTube',
        src: path + 'BackTube.png'
    });
    data.push({
        name: 'TubeCoverMc',
        src: path + 'TubeCoverMc.png'
    });
    data.push({
        name: 'SpeedBob',
        src: path + 'SpeedBob.png'
    });
    data.push({
        name: 'SspeedStandardBtn',
        src: path + 'SspeedStandardBtn.png'
    });
    data.push({
        name: 'SpeedFastBtn',
        src: path + 'SpeedFastBtn.png'
    });
    data.push({
        name: 'SpeedIndicatorMc',
        src: path + 'SpeedIndicatorMc.png'
    });
    data.push({
        name: 'Lvl',
        src: path + 'Lvl.png'
    });
    data.push({
        name: 'LVL_map',
        src: path + 'LVL_map.png'
    });
    data.push({
        name: 'restart',
        src: path + 'restart.png'
    });
    data.push({
        name: 'score',
        src: path + 'score.png'
    });
    data.push({
        name: 'WalkthroughButton',
        src: path + 'WalkthroughButton.png'
    });
    data.push({
        name: 'NextLeveButton',
        src: path + 'NextLeveButton.png'
    });
    data.push({
        name: 'TryAgainButton',
        src: path + 'TryAgainButton.png'
    });
    data.push({
        name: 'PanelLevelComplete',
        src: path + 'PanelLevelComplete.png'
    });
    data.push({
        name: 'GameOver',
        src: path + 'GameOver.png'
    });
    data.push({
        name: 'Hint',
        src: path + 'Hint.png'
    });
    data.push({
        name: 'LVL_map_new',
        src: path + 'LVL_map_new.png'
    });
    data.push({
        name: 'Baraban',
        src: path + 'Baraban.png'
    });
    data.push({
        name: 'slider',
        src: path + 'slider.png'
    });
    data.push({
        name: 'BobTurns',
        src: path + 'BobTurns.png'
    });
    data.push({
        name: 'BobHideTurn',
        src: path + 'BobHideTurn.png'
    });
    data.push({
        name: 'button_blue_left',
        src: path + 'button_blue_left.png'
    });
    data.push({
        name: 'button_blue_mid',
        src: path + 'button_blue_mid.png'
    });
    data.push({
        name: 'button_blue_right',
        src: path + 'button_blue_right.png'
    });
    data.push({
        name: 'button_red',
        src: path + 'button_red.png'
    });
    data.push({
        name: 'button_blue',
        src: path + 'button_blue.png'
    });
    data.push({
        name: 'BobGrowl',
        src: path + 'BobGrowl.png'
    });
    data.push({
        name: 'BobFall1',
        src: path + 'BobFall1.png'
    });
    data.push({
        name: 'BobFall2',
        src: path + 'BobFall2.png'
    });
    data.push({
        name: 'BobFall3',
        src: path + 'BobFall3.png'
    });
    data.push({
        name: 'lever_cover_down',
        src: path + 'lever_cover_down.png'
    });
    data.push({
        name: 'lever_cover_left',
        src: path + 'lever_cover_left.png'
    });
    data.push({
        name: 'lever_cover_right',
        src: path + 'lever_cover_right.png'
    });
    data.push({
        name: 'lever_cover_up',
        src: path + 'lever_cover_up.png'
    });
    data.push({
        name: 'mechanism',
        src: path + 'mechanism.png'
    });
    data.push({
        name: 'button_blue_down',
        src: path + 'button_blue_down.png'
    });
    data.push({
        name: 'button_blue_up',
        src: path + 'button_blue_up.png'
    });
    data.push({
        name: 'BobFlatten',
        src: path + 'BobFlattenAnimMc.png'
    });
    data.push({
        name: 'BobBurn',
        src: path + 'BobBurnAnimMc1.png'
    });
    data.push({
        name: 'BobBurnAnimMc2',
        src: path + 'BobBurnAnimMc2.png'
    });
    data.push({
        name: 'logoCleared',
        src: path + 'logoCleared.png'
    });
    data.push({
        name: 'Splash_Image',
        src: path + 'Splash_Image.png'
    });
    data.push({
        name: 'tap_to_continue',
        src: path + 'tap_to_continue.png'
    });
    data.push({
        name: 'for_lvls',
        src: path + 'for_lvls.png'
    });
    data.push({
        name: 'Skip_btn',
        src: path + 'comics/' + 'Skip_btn.png'
    });
    for (var i = 1; i < 9; i++) {
        data.push({
            name: 'comics' + i,
            src: path + 'comics/comics' + i + '.jpg'
        });
    };
    data.push({
        name: 'Bob_on_the_beach',
        src: path + 'final/' + 'Bob_on_the_beach.png'
    });
    data.push({
        name: 'BobFoundHouse',
        src: path + 'final/' + 'BobFoundHouse.png'
    });
    data.push({
        name: 'final_screen',
        src: path + 'final/' + 'final_screen.png'
    });
    data.push({
        name: 'nicely_dine',
        src: path + 'final/' + 'nicely_dine.png'
    });
    data.push({
        name: 'TotalScoreTextLocaliz0001',
        src: path + 'final/' + 'TotalScoreTextLocaliz0001.png'
    });
    data.push({
        name: 'Lvl1_back',
        src: path + 'levels/01/' + 'Lvl1_back.jpg'
    });
    data.push({
        name: 'fly',
        src: path + 'levels/01/' + 'fly.png'
    });
    data.push({
        name: 'DoorLevel01',
        src: path + 'levels/01/' + 'DoorLevel01.png'
    });
    data.push({
        name: 'Lever1',
        src: path + 'levels/01/' + 'Lever1.png'
    });
    data.push({
        name: 'Spring',
        src: path + 'levels/01/' + 'Spring.png'
    });
    data.push({
        name: 'yellow_element',
        src: path + 'levels/01/' + 'yellow_element.png'
    });
    data.push({
        name: 'Hint1_Level10001',
        src: path + 'levels/01/' + 'Hint1_Level10001.png'
    });
    data.push({
        name: 'Hint2_Level10001',
        src: path + 'levels/01/' + 'Hint2_Level10001.png'
    });
    data.push({
        name: 'Lvl2_back',
        src: path + 'levels/02/' + 'Lvl2_back.jpg'
    });
    data.push({
        name: 'conveyor',
        src: path + 'levels/02/' + 'conveyor.png'
    });
    data.push({
        name: 'crossbar',
        src: path + 'levels/02/' + 'perekladina.png'
    });
    data.push({
        name: 'Lever2',
        src: path + 'levels/02/' + 'Lever2.png'
    });
    data.push({
        name: 'electric_detail',
        src: path + 'levels/02/' + 'electric_detail.png'
    });
    data.push({
        name: 'btn02',
        src: path + 'levels/02/' + 'btn.png'
    });
    data.push({
        name: 'electricity_10',
        src: path + 'levels/02/' + 'electricity_10.png'
    });
    data.push({
        name: 'shocked',
        src: path + 'levels/02/' + 'electroshock1.png'
    });
    data.push({
        name: 'shocked2',
        src: path + 'levels/02/' + 'electroshock2.png'
    });
    data.push({
        name: 'spirit',
        src: path + 'levels/02/' + 'spirit.png'
    });
    data.push({
        name: 'ArrowAnim_yellow0001',
        src: path + 'levels/02/' + 'ArrowAnim_yellow0001.png'
    });
    data.push({
        name: 'ArrowAnim0001',
        src: path + 'levels/02/' + 'ArrowAnim0001.png'
    });
    data.push({
        name: 'HintClickBob_Level20001',
        src: path + 'levels/02/' + 'HintClickBob_Level20001.png'
    });
    data.push({
        name: 'HintMc1_Level20001',
        src: path + 'levels/02/' + 'HintMc1_Level20001.png'
    });
    data.push({
        name: 'HintMc2_Level20001',
        src: path + 'levels/02/' + 'HintMc2_Level20001.png'
    });
    data.push({
        name: 'HintMc3_Level20001',
        src: path + 'levels/02/' + 'HintMc3_Level20001.png'
    });
    data.push({
        name: 'Lvl3_back',
        src: path + 'levels/03/' + 'Lvl3_back.jpg'
    });
    data.push({
        name: 'button_blue_mid_lvl3',
        src: path + 'levels/03/' + 'button-blue-mid-lvl3.png'
    });
    data.push({
        name: 'Lift_lv3',
        src: path + 'levels/03/' + 'Lift_lv3.png'
    });
    data.push({
        name: 'Hint1_Level30001',
        src: path + 'levels/03/' + 'Hint1_Level30001.png'
    });
    data.push({
        name: 'HoldText0001',
        src: path + 'levels/03/' + 'HoldText0001.png'
    });
    data.push({
        name: 'Lvl4_back',
        src: path + 'levels/04/' + 'Lvl4_back.jpg'
    });
    data.push({
        name: 'Latch_lvl4',
        src: path + 'levels/04/' + 'Latch_lvl4.png'
    });
    data.push({
        name: 'stone_lvl4',
        src: path + 'levels/04/' + 'stone_lvl4.png'
    });
    data.push({
        name: 'wooden_cross_lvl4',
        src: path + 'levels/04/' + 'wooden_cross_lvl4.png'
    });
    data.push({
        name: 'Lever4',
        src: path + 'levels/04/' + 'Lever4.png'
    });
    data.push({
        name: 'Lvl5_back',
        src: path + 'levels/05/' + 'Lvl5_back.jpg'
    });
    data.push({
        name: 'Bridge_lvl5',
        src: path + 'levels/05/' + 'Bridge_lvl5.png'
    });
    data.push({
        name: 'wagon_lvl5',
        src: path + 'levels/05/' + 'wagon_lvl5.png'
    });
    data.push({
        name: 'wagon_whel_lvl5',
        src: path + 'levels/05/' + 'wagon_whel_lvl5.png'
    });
    data.push({
        name: 'wood_on_rope_lvl5',
        src: path + 'levels/05/' + 'wood_on_rope_lvl5.png'
    });
    data.push({
        name: 'tube5',
        src: path + 'tube1.png'
    });
    data.push({
        name: 'peregorodka_lvl5',
        src: path + 'levels/05/' + 'peregorodka_lvl5.png'
    });
    data.push({
        name: 'Lvl6_back',
        src: path + 'levels/06/' + 'Lvl6_back.jpg'
    });
    data.push({
        name: 'brig',
        src: path + 'levels/06/' + 'brig.png'
    });
    data.push({
        name: 'btn_lvl6',
        src: path + 'levels/06/' + 'btn_lvl6.png'
    });
    data.push({
        name: 'cable_lvl6',
        src: path + 'levels/06/' + 'cable_lvl6.png'
    });
    data.push({
        name: 'spring',
        src: path + 'levels/06/' + 'spring.png'
    });
    data.push({
        name: 'tube_lvl6',
        src: path + 'levels/06/' + 'tube_lvl6.png'
    });
    data.push({
        name: 'BasketballDestroying',
        src: path + 'levels/06/' + 'BasketballDestroying.png'
    });
    data.push({
        name: 'stone_lvl6',
        src: path + 'levels/06/' + 'stone_lvl6.png'
    });
    data.push({
        name: 'ball_falls_lvl6',
        src: path + 'levels/06/' + 'ball_falls_lvl6.png'
    });
    data.push({
        name: 'earth_lvl6',
        src: path + 'levels/06/' + 'earth_lvl6.png'
    });
    data.push({
        name: 'Lvl7_back',
        src: path + 'levels/07/' + 'Lvl7_back.jpg'
    });
    data.push({
        name: 'BobFallsInLove',
        src: path + 'levels/07/' + 'BobFallsInLove.png'
    });
    data.push({
        name: 'inLove',
        src: path + 'levels/07/' + 'inLove.png'
    });
    data.push({
        name: 'BobFalls',
        src: path + 'levels/07/' + 'BobFalls.png'
    });
    data.push({
        name: 'fence',
        src: path + 'levels/07/' + 'fence.png'
    });
    data.push({
        name: 'Girlfriend',
        src: path + 'levels/07/' + 'Girlfriend.png'
    });
    data.push({
        name: 'Stove',
        src: path + 'levels/07/' + 'Stove.png'
    });
    data.push({
        name: 'ice',
        src: path + 'levels/07/' + 'ice.png'
    });
    data.push({
        name: 'oven_lever',
        src: path + 'levels/07/' + 'oven_lever.png'
    });
    data.push({
        name: 'Lift_lv7',
        src: path + 'levels/07/' + 'Lift_lv7.png'
    });
    data.push({
        name: 'Btn_lv7',
        src: path + 'levels/07/' + 'Btn_lv7.png'
    });
    data.push({
        name: 'Lvl8_back',
        src: path + 'levels/08/' + 'Lvl8_back.jpg'
    });
    data.push({
        name: 'before_bridge_lvl8',
        src: path + 'levels/08/' + 'before_bridge_lvl8.png'
    });
    data.push({
        name: 'bridge_lvl8',
        src: path + 'levels/08/' + 'bridge_lvl8.png'
    });
    data.push({
        name: 'latch_lvl8',
        src: path + 'levels/08/' + 'latch_lvl8.png'
    });
    data.push({
        name: 'spring_up',
        src: path + 'levels/08/' + 'spring_up.png'
    });
    data.push({
        name: 'Lvl9_back',
        src: path + 'levels/09/' + 'Lvl9_back.jpg'
    });
    data.push({
        name: 'button_lvl9',
        src: path + 'levels/09/' + 'button_lvl9.png'
    });
    data.push({
        name: 'earth1_lvl9',
        src: path + 'levels/09/' + 'earth1_lvl9.png'
    });
    data.push({
        name: 'earth2_lvl9',
        src: path + 'levels/09/' + 'earth2_lvl9.png'
    });
    data.push({
        name: 'earth3_lvl9',
        src: path + 'levels/09/' + 'earth3_lvl9.png'
    });
    data.push({
        name: 'earth4_lvl9',
        src: path + 'levels/09/' + 'earth4_lvl9.png'
    });
    data.push({
        name: 'lamp',
        src: path + 'levels/09/' + 'lamp.png'
    });
    data.push({
        name: 'wire',
        src: path + 'levels/09/' + 'wire.png'
    });
    data.push({
        name: 'bridge_lvl9',
        src: path + 'levels/09/' + 'bridge_lvl9.png'
    });
    data.push({
        name: 'Lvl17_back',
        src: path + 'levels/10/' + 'Lvl10_back.jpg'
    });
    data.push({
        name: 'energy_box',
        src: path + 'levels/10/' + 'energy_box.png'
    });
    data.push({
        name: 'lantern',
        src: path + 'levels/10/' + 'lantern.png'
    });
    data.push({
        name: 'pillar_lvl10',
        src: path + 'levels/10/' + 'pillar_lvl10.png'
    });
    data.push({
        name: 'Radiation1',
        src: path + 'levels/10/' + 'Radiation1.png'
    });
    data.push({
        name: 'Radiation2',
        src: path + 'levels/10/' + 'Radiation2.png'
    });
    data.push({
        name: 'small_tube_lvl10',
        src: path + 'levels/10/' + 'small_tube_lvl10.png'
    });
    data.push({
        name: 'up_cover_lvl10',
        src: path + 'levels/10/' + 'up_cover_lvl10.png'
    });
    data.push({
        name: 'bridge_lvl10',
        src: path + 'levels/10/' + 'bridge_lvl10.png'
    });
    data.push({
        name: 'barrier_lvl10',
        src: path + 'levels/10/' + 'barrier_lvl10.png'
    });
    data.push({
        name: 'minus_plus',
        src: path + 'levels/10/' + 'minus_plus.png'
    });
    data.push({
        name: 'radiationAnim1',
        src: path + 'levels/10/' + 'radiationAnim1.png'
    });
    data.push({
        name: 'radiationAnim2',
        src: path + 'levels/10/' + 'radiationAnim2.png'
    });
    data.push({
        name: 'radiationAnim3',
        src: path + 'levels/10/' + 'radiationAnim3.png'
    });
    data.push({
        name: 'Lvl10_back',
        src: path + 'levels/11/' + 'Lvl11_back.jpg'
    });
    data.push({
        name: 'bridge_lvl11',
        src: path + 'levels/11/' + 'bridge_lvl11.png'
    });
    data.push({
        name: 'button_lvl11',
        src: path + 'levels/11/' + 'button_lvl11.png'
    });
    data.push({
        name: 'fire_lvl11',
        src: path + 'levels/11/' + 'fire_lvl11.png'
    });
    data.push({
        name: 'lava',
        src: path + 'levels/11/' + 'lava.png'
    });
    data.push({
        name: 'pliers_catch',
        src: path + 'levels/11/' + 'pliers_catch.png'
    });
    data.push({
        name: 'pliers_down',
        src: path + 'levels/11/' + 'pliers_down.png'
    });
    data.push({
        name: 'rope_lvl11',
        src: path + 'levels/11/' + 'rope_lvl11.png'
    });
    data.push({
        name: 'smoke1_lvl11',
        src: path + 'levels/11/' + 'smoke1_lvl11.png'
    });
    data.push({
        name: 'smoke2_lvl11',
        src: path + 'levels/11/' + 'smoke2_lvl11.png'
    });
    data.push({
        name: 'tube_lvl11',
        src: path + 'levels/11/' + 'tube_lvl11.png'
    });
    data.push({
        name: 'block_lvl11',
        src: path + 'levels/11/' + 'block_lvl11.png'
    });
    data.push({
        name: 'Lvl11_back',
        src: path + 'levels/12/' + 'Lvl12_back.jpg'
    });
    data.push({
        name: 'bridge_lvl12',
        src: path + 'levels/12/' + 'bridge_lvl12.png'
    });
    data.push({
        name: 'button_lvl12',
        src: path + 'levels/12/' + 'button_lvl12.png'
    });
    data.push({
        name: 'circle_lvl12',
        src: path + 'levels/12/' + 'circle_lvl12.png'
    });
    data.push({
        name: 'prop_lvl12',
        src: path + 'levels/12/' + 'prop_lvl12.png'
    });
    data.push({
        name: 'Lvl12_back',
        src: path + 'levels/13/' + 'Lvl13_back.jpg'
    });
    data.push({
        name: 'bridge_lvl13',
        src: path + 'levels/13/' + 'bridge_lvl13.png'
    });
    data.push({
        name: 'button_lvl13',
        src: path + 'levels/13/' + 'button_lvl13.png'
    });
    data.push({
        name: 'press',
        src: path + 'levels/13/' + 'press.png'
    });
    data.push({
        name: 'prop_lvl13',
        src: path + 'levels/13/' + 'prop_lvl13.png'
    });
    data.push({
        name: 'sticks',
        src: path + 'levels/13/' + 'sticks.png'
    });
    data.push({
        name: 'rope2',
        src: path + 'levels/13/' + 'rope2.png'
    });
    data.push({
        name: 'rope3',
        src: path + 'levels/13/' + 'rope3.png'
    });
    data.push({
        name: 'rope4',
        src: path + 'levels/13/' + 'rope4.png'
    });
    data.push({
        name: 'rope5',
        src: path + 'levels/13/' + 'rope5.png'
    });
    data.push({
        name: 'rope6',
        src: path + 'levels/13/' + 'rope6.png'
    });
    data.push({
        name: 'smoke_lvl13',
        src: path + 'levels/13/' + 'smoke_lvl13.png'
    });
    data.push({
        name: 'Lvl13_back',
        src: path + 'levels/14/' + 'Lvl14_back.jpg'
    });
    data.push({
        name: 'carriage1_lvl14',
        src: path + 'levels/14/' + 'carriage1_lvl14.png'
    });
    data.push({
        name: 'carriage2_lvl14',
        src: path + 'levels/14/' + 'carriage2_lvl14.png'
    });
    data.push({
        name: 'carriage3_lvl14',
        src: path + 'levels/14/' + 'carriage3_lvl14.png'
    });
    data.push({
        name: 'carriage4_lvl14',
        src: path + 'levels/14/' + 'carriage4_lvl14.png'
    });
    data.push({
        name: 'circle_exit',
        src: path + 'levels/14/' + 'circle_exit.png'
    });
    data.push({
        name: 'circle_lvl14',
        src: path + 'levels/14/' + 'circle_lvl14.png'
    });
    data.push({
        name: 'pc1',
        src: path + 'levels/14/' + 'pc1.png'
    });
    data.push({
        name: 'pc2',
        src: path + 'levels/14/' + 'pc2.png'
    });
    data.push({
        name: 'pc3',
        src: path + 'levels/14/' + 'pc3.png'
    });
    data.push({
        name: 'pc4',
        src: path + 'levels/14/' + 'pc4.png'
    });
    data.push({
        name: 'Lvl14_back',
        src: path + 'levels/15/' + 'Lvl15_back.jpg'
    });
    data.push({
        name: 'box_lvl15',
        src: path + 'levels/15/' + 'box_lvl15.png'
    });
    data.push({
        name: 'bridge_lvl15',
        src: path + 'levels/15/' + 'bridge_lvl15.png'
    });
    data.push({
        name: 'circle_lvl15',
        src: path + 'levels/15/' + 'circle_lvl15.png'
    });
    data.push({
        name: 'earth1_lvl15',
        src: path + 'levels/15/' + 'earth1_lvl15.png'
    });
    data.push({
        name: 'earth2_lvl15',
        src: path + 'levels/15/' + 'earth2_lvl15.png'
    });
    data.push({
        name: 'prop_lvl15',
        src: path + 'levels/15/' + 'prop_lvl15.png'
    });
    data.push({
        name: 'mechanism_lvl15',
        src: path + 'levels/15/' + 'mechanism_lvl15.png'
    });
    data.push({
        name: 'smoke_lvl15',
        src: path + 'levels/15/' + 'smoke_lvl15.png'
    });
    data.push({
        name: 'Lvl15_back',
        src: path + 'levels/16/' + 'Lvl16_back.jpg'
    });
    data.push({
        name: 'bridge_lvl16',
        src: path + 'levels/16/' + 'bridge_lvl16.png'
    });
    data.push({
        name: 'latch_lvl16',
        src: path + 'levels/16/' + 'latch_lvl16.png'
    });
    data.push({
        name: 'pump_down',
        src: path + 'levels/16/' + 'pump_down.png'
    });
    data.push({
        name: 'pump_up',
        src: path + 'levels/16/' + 'pump_up.png'
    });
    data.push({
        name: 'ball1',
        src: path + 'levels/16/' + 'ball1.png'
    });
    data.push({
        name: 'ball2',
        src: path + 'levels/16/' + 'ball2.png'
    });
    data.push({
        name: 'ball3',
        src: path + 'levels/16/' + 'ball3.png'
    });
    data.push({
        name: 'ball4',
        src: path + 'levels/16/' + 'ball4.png'
    });
    data.push({
        name: 'ball5',
        src: path + 'levels/16/' + 'ball5.png'
    });
    data.push({
        name: 'ball6',
        src: path + 'levels/16/' + 'ball6.png'
    });
    data.push({
        name: 'ball7',
        src: path + 'levels/16/' + 'ball7.png'
    });
    data.push({
        name: 'circle_lvl16',
        src: path + 'levels/16/' + 'circle_lvl16.png'
    });
    data.push({
        name: 'Lvl16_back',
        src: path + 'levels/17/' + 'Lvl17_back.jpg'
    });
    data.push({
        name: 'bridge_lvl17',
        src: path + 'levels/17/' + 'bridge_lvl17.png'
    });
    data.push({
        name: 'btn_Fire',
        src: path + 'levels/17/' + 'btn_Fire.png'
    });
    data.push({
        name: 'FireTimeAnim',
        src: path + 'levels/17/' + 'FireTimeAnim.png'
    });
    data.push({
        name: 'earth_lvl17',
        src: path + 'levels/17/' + 'earth_lvl17.png'
    });
    data.push({
        name: 'fire_lvl17',
        src: path + 'levels/17/' + 'fire_lvl17.png'
    });
    data.push({
        name: 'fire_small',
        src: path + 'levels/17/' + 'fire_small.png'
    });
    data.push({
        name: 'Lvl18_back',
        src: path + 'levels/18/' + 'Lvl18_back.jpg'
    });
    data.push({
        name: 'bridge1_lvl18',
        src: path + 'levels/18/' + 'bridge1_lvl18.png'
    });
    data.push({
        name: 'bridge2_lvl18',
        src: path + 'levels/18/' + 'bridge2_lvl18.png'
    });
    data.push({
        name: 'btnForTrans',
        src: path + 'levels/18/' + 'btnForTrans.png'
    });
    data.push({
        name: 'current_lvl18',
        src: path + 'levels/18/' + 'current_lvl18.png'
    });
    data.push({
        name: 'earth_lvl18',
        src: path + 'levels/18/' + 'earth_lvl18.png'
    });
    data.push({
        name: 'green_lvl18',
        src: path + 'levels/18/' + 'green_lvl18.png'
    });
    data.push({
        name: 'lantern_lvl18',
        src: path + 'levels/18/' + 'lantern_lvl18.png'
    });
    data.push({
        name: 'lift_lvl18',
        src: path + 'levels/18/' + 'lift_lvl18.png'
    });
    data.push({
        name: 'red_lvl18',
        src: path + 'levels/18/' + 'red_lvl18.png'
    });
    data.push({
        name: 'trans1',
        src: path + 'levels/18/' + 'trans1.png'
    });
    data.push({
        name: 'trans2',
        src: path + 'levels/18/' + 'trans2.png'
    });
    data.push({
        name: 'trans3',
        src: path + 'levels/18/' + 'trans3.png'
    });
    data.push({
        name: 'trans4',
        src: path + 'levels/18/' + 'trans4.png'
    });
    data.push({
        name: 'turnBtn_lvl18',
        src: path + 'levels/18/' + 'turnBtn_lvl18.png'
    });
    data.push({
        name: 'zemlaUp',
        src: path + 'levels/18/' + 'zemlaUp.png'
    });
    data.push({
        name: 'Lvl19_back',
        src: path + 'levels/19/' + 'Lvl19_back.jpg'
    });
    data.push({
        name: 'bridge_lvl19',
        src: path + 'levels/19/' + 'bridge_lvl19.png'
    });
    data.push({
        name: 'circle_lvl19',
        src: path + 'levels/19/' + 'circle_lvl19.png'
    });
    data.push({
        name: 'cover_lvl19',
        src: path + 'levels/19/' + 'cover_lvl19.png'
    });
    data.push({
        name: 'earth_lvl19',
        src: path + 'levels/19/' + 'earth_lvl19.png'
    });
    data.push({
        name: 'foundation',
        src: path + 'levels/19/' + 'foundation.png'
    });
    data.push({
        name: 'foundation2',
        src: path + 'levels/19/' + 'foundation2.png'
    });
    data.push({
        name: 'Lvl20_back',
        src: path + 'levels/20/' + 'Lvl20_back.jpg'
    });
    data.push({
        name: 'boxGreen',
        src: path + 'levels/20/' + 'boxGreen.png'
    });
    data.push({
        name: 'boxRed',
        src: path + 'levels/20/' + 'boxRed.png'
    });
    data.push({
        name: 'bridgeDown_lvl20',
        src: path + 'levels/20/' + 'bridgeDown_lvl20.png'
    });
    data.push({
        name: 'bridgeUp_lvl20',
        src: path + 'levels/20/' + 'bridgeUp_lvl20.png'
    });
    data.push({
        name: 'earthDown_lvl20',
        src: path + 'levels/20/' + 'earthDown_lvl20.png'
    });
    data.push({
        name: 'earthUp_lvl20',
        src: path + 'levels/20/' + 'earthUp_lvl20.png'
    });
    data.push({
        name: 'lift_cover1',
        src: path + 'levels/20/' + 'lift_cover1.png'
    });
    data.push({
        name: 'lift_cover2',
        src: path + 'levels/20/' + 'lift_cover2.png'
    });
    data.push({
        name: 'lift_lvl20',
        src: path + 'levels/20/' + 'lift_lvl20.png'
    });
    data.push({
        name: 'minus_plus_green',
        src: path + 'levels/20/' + 'minus_plus_green.png'
    });
    data.push({
        name: 'minus_plus_red',
        src: path + 'levels/20/' + 'minus_plus_red.png'
    });
    data.push({
        name: 'tube_cover_lvl20',
        src: path + 'levels/20/' + 'tube_cover_lvl20.png'
    });
    preloader.load(data, loadImagesEnd, Utils.showLoadProgress);
}

function loadImagesEnd(data) {
    document.getElementById('progress_container').style.display = 'none';
    document.getElementById('screen_container').style.display = 'block';
    document.getElementById('screen_background_container').style.display = 'block';
    bitmaps = data;
    getLevelsScores();
    if (parseInt(Utils.getCookie("snail_bob_sound")) == 2) {
        isMusicOn = false;
        isSoundOn = false;
    } else {
        isMusicOn = true;
        isSoundOn = true;
    }
    if (android) isSoundOn = false;
    if (GET["debug"] != 1) {
        gameState = STATE_SPLASH;
        createScene();
    }
}
Sprite.prototype.rewindAndStop = function (frame) {
    var self = this;
    this.currentFrame = frame;
    var int = stage.setInterval(function () {
        self.prevFrame();
        if (self.currentFrame == 0) {
            self.stop();
            stage.clearInterval(int);
        }
    }, this.animDelay);
}
Sprite.prototype.prevFrame = function () {
    this.dispatchEvent("enterframe", {
        target: this
    });
    if (this.history && !this.history.created) this.updateHistory();
    if (this.currentFrame == 0) {
        this.currentFrame = this.totalFrames - 1;
    } else {
        this.currentFrame--;
    }
};
Sprite.prototype.setStatic = function (value) {
    this.static = value;
    field.rebuildBack = true;
}

function showSplash() {
    /*var tapSprite = new Sprite(null, 480, 320);
    tapSprite.x = 240;
    tapSprite.y = 160;
    tapSprite.fillColor = '#fff'
    tapSprite.static = true;
    tapSprite.onclick = tapToContinue;
    stage.addChild(tapSprite);
    var logo = new Sprite(bitmaps.Splash_Image, 351, 130);
    logo.x = 240;
    logo.y = 120;
    logo.onclick = showMoreGames;
    logo.static = true;
    stage.addChild(logo);
    var tap = new Sprite(bitmaps.tap_to_continue, 175, 18);
    tap.x = 240;
    tap.y = 250;
    tap.static = true;
    stage.addChild(tap);
*/
    //function tapToContinue(e) {
        mixer = new AudioMixer("Music", 5);
        //e.target.onclick = null;
        //tap.static = false;
        //tap.destroy = true;
        buildBackground();
        var spr = new Sprite(null, 1, 15);
        spr.x = 105;
        spr.y = 200;
        spr.fillColor = '#bb4a00';
        stage.addChild(spr);
        var int = stage.setInterval(function () {
            spr.width += 2;
            spr.x += 1;
            if (spr.width >= 300) {
                stage.clearInterval(int);
                if (isMusicOn) mixer.play('game_music1', true, true, 0);
                gameState = STATE_MENU;
                createScene();
            }
        }, 1);
    //}
}

function getStageWidth() {
    return Math.floor(480 * screenWidthCoef);
}

function getStageHeight() {
    return Math.floor(320 * screenHeightCoef);
}

function getStageCenter() {
    return getStageWidth() / 2;
}

function getStageHeightCenter() {
    return getStageHeight() / 2;
}

function createScene() {
    createStage();
    if (gameState == STATE_SPLASH) {
        showSplash();
    };
    if (gameState == STATE_MENU) {
        showMenu();
    }
    if (gameState == STATE_SELECT_LEVEL) {
        showLevelSelect();
    }
    if (gameState == STATE_GAME) {
        field = new GameField();
        field.init(currentLevel - 1);
    }
    if (gameState == STATE_COMICS) {
        showComics();
    }
    buildBackground();
    stage.start();
}

function showFinalScreen() {
    if (isMusicOn) mixer.play('snd_final', true, true, 0);
    var bg = new SpritesGroup(stage);
    bg.x = 240;
    bg.y = -160;
    var back = new Sprite(bitmaps.final_screen, 480, 320);
    back.gx = 0;
    back.gy = 0;
    bg.addChild(back, true);
    var mc = new TilesSprite(bitmaps.Bob_on_the_beach, 281, 106, 11, 6, 2);
    mc.gx = 49;
    mc.gy = 32;
    mc.animDelay = 3;
    bg.addChild(mc, true);
    /*var mc = new Sprite(bitmaps.for_lvls, 74, 23);
    mc.gx = 0;
    mc.gy = 74;
    mc.onclick = showMoreGames;
    */
    bg.addChild(mc, true);
    var tween = stage.createTween(bg, 'y', bg.y, 160, fps, Easing.circular.easeOut);
    tween.onfinish = function () {
        tween1.play();
    };
    tween.play();
    mc = new Sprite(bitmaps.BobFoundHouse, 323, 53);
    mc.x = -150;
    mc.y = 30;
    stage.addChild(mc);
    var tween1 = stage.createTween(mc, 'x', mc.x, 240, fps, Easing.quartic.easeOut);
    tween1.onfinish = function () {
        tween2.play();
    };
    mc = new Sprite(bitmaps.nicely_dine, 202, 64);
    mc.x = 550;
    mc.y = 65;
    stage.addChild(mc);
    var tween2 = stage.createTween(mc, 'x', mc.x, 240, fps, Easing.quartic.easeOut);
    tween2.onfinish = function () {
        tween3.play();
    };
    var group = new SpritesGroup(stage);
    group.x = -150;
    group.y = 110;
    var back = new Sprite(bitmaps.TotalScoreTextLocaliz0001, 162, 29);
    back.gx = 0;
    back.gy = 0;
    group.addChild(back, true);
    var totalscore = getTotalLevelsScores();
    var levelScoreText = new SimpleText(bitmaps.score_num, 8, 12);
    levelScoreText.align = levelScoreText.ALIGN_LEFT;
    levelScoreText.x = 26;
    levelScoreText.y = 0;
    levelScoreText.write(totalscore);
    levelScoreText.addToGroup(group);
    var tween3 = stage.createTween(group, 'x', group.x, 240, fps, Easing.quartic.easeOut);
    var mc = new Sprite(bitmaps.menu_btn, 84, 45);
    mc.x = 500;
    mc.y = 300;
    mc.rotation = -Math.PI / 2;
    mc.onclick = function () {
        if (isMusicOn) mixer.play('game_music1', true, true, 0);
        gameState = STATE_MENU;
        createScene();
    }
    var btnMoreGames = new Sprite(bitmaps.moreGames, 140, 30, 4);
    btnMoreGames.x = 380;
    btnMoreGames.y = 340;
    btnMoreGames.stop();
    btnMoreGames.onclick = showMoreGames;
    stage.addChild(btnMoreGames);
    tween3.onfinish = function () {
        var int = stage.setInterval(function () {
            var vec = new Vector(-130, -20);
            mc.rotation += 0.1;
            vec.rotate(-mc.rotation);
            mc.x = 470 + vec.x;
            mc.y = 160 + vec.y;
            if (mc.rotation >= -0.1) {
                stage.clearInterval(int);
                stage.createTween(btnMoreGames, 'y', btnMoreGames.y, 190, fps, Easing.quartic.easeOut).play();
            }
        }, 1);
    };
    stage.addChild(mc);
}

function showComics() {
    if (isMusicOn) mixer.play('snd_intro', true, true, 0);
    var back = new Sprite(null, 480, 320);
    back.x = 240;
    back.y = 160;
    back.fillColor = '#fff';
    back.static = true;
    stage.addChild(back);
    createComix(1);
    var skipBtn = new Sprite(bitmaps.Skip_btn, 70, 32);
    skipBtn.x = 440;
    skipBtn.y = 300;
    skipBtn.onclick = function () {
        if (isMusicOn) mixer.play('game_music1', true, true, 0);
        prepareLevel();
        comics = false;
    }
    stage.addChild(skipBtn);
}

function createComix(num) {
    console.log(stage.objects.length);
    var mc = new Sprite(bitmaps['comics' + num], 480, 320);
    mc.x = 720;
    mc.y = 160;
    mc.setZIndex(1);
    stage.addChild(mc);
    var tween = stage.createTween(mc, "x", 720, 240, fps * 2, Easing.exponential.easeOut);
    var tween2 = stage.createTween(mc, "x", 240, -240, fps * 2, Easing.exponential.easeOut);
    tween.play();
    tween.onfinish = function () {
        num++;
        if (num > 8) stage.setTimeout(function () {
            if (isMusicOn) mixer.play('game_music1', true, true, 0);
            prepareLevel();
            comics = false;
        }, fps * 1.5);
        stage.setTimeout(function () {
            createComix(num);
            tween2.play();
        }, fps);
    };
    tween2.onfinish = function () {
        mc.destroy = true;
    }
}

function createStage() {
    if (stage) {
        stage.destroy();
        stage.stop();
    }
    stage = new Stage('screen', Math.round(480 * screenWidthCoef), Math.round(320 * screenHeightCoef));
    stage.delay = 1000 / fps;
    stage.showFPS = false;
    stage.onpretick = mainLoop;
}

function step() {
    if (field.locked) return;
    field.bob.synchPosition();
    if (field.bob.state != 'fly' && !field.cancelSpeed && field.bob.box2dBody.GetContactList()) {
        field.bob.box2dBody.m_linearVelocity.x = field.bob.speed;
    }
    checkIfWin();
}

function mainLoop() {
    if (gameState != STATE_GAME) return;
    if (pause && field.locked) return false;
    if (field.rebuildBack) {
        field.rebuildBack = false;
        buildBackground();
    }
    world.Step(1 / (fps * 2), 1);
    world.Step(1 / (fps * 2), 1);
    step();
    stage.box2dSync(world);
}

function showLevelSelect() {
    var back = new Sprite(bitmaps.LevelsMap, 525, 350);
    back.setPosition(getStageCenter(), getStageHeightCenter());
    back.static = true;
    stage.addChild(back);
    var totalscore = getTotalLevelsScores();
    var levelScoreText = new SimpleText(bitmaps.score_num, 8, 12);
    levelScoreText.align = levelScoreText.ALIGN_LEFT;
    levelScoreText.x = 252;
    levelScoreText.y = 10;
    levelScoreText.static = true;
    levelScoreText.write(totalscore);
    for (var i = 0; i < levels.length; i++) {
        if (levelsScores[i - 1] < 0) var bm = bitmaps.Lvl_locked;
        else var bm = bitmaps.LvlN;
        var lvl_img = new Sprite(bm, 57, 46);
        var n = Math.floor(i / 4);
        lvl_img.x = (i - n * 4) * 60 + 60;
        lvl_img.y = n * 51 + 70;
        lvl_img.static = true;
        lvl_img.index = i + 1;
        lvl_img.onmousedown = function (e) {
            if (e.target.index - 1 == 0 || levelsScores[e.target.index - 2] >= 0) {
                currentLevel = e.target.index;
                smallLvl.bitmap = bitmaps['smallLvl' + currentLevel];
                stage.setTimeout(prepareLevel, Math.floor(fps / 4));
                return false;
            }
        }
        stage.addChild(lvl_img);
        if (levelsScores[i] >= 0) {
            var levelScoreText = new SimpleText(bitmaps.num_lvl_map_up, 8, 10);
            levelScoreText.align = levelScoreText.ALIGN_LEFT;
            levelScoreText.x = (i - n * 4) * 60 + 40;;
            levelScoreText.y = n * 51 + 50;
            levelScoreText.static = true;
            levelScoreText.write(levelsScores[i]);
        }
        if (i == 0 || levelsScores[i - 1] >= 0) {
            var t = new SimpleText(bitmaps.numb, 23, 20);
            t.align = t.ALIGN_CENTER;
            t.x = lvl_img.x;
            t.y = lvl_img.y + 1;
            t.static = true;
            t.write(i + 1);
        };
    }
    for (var i = 0; i < levels.length; i++) {
        if (levelsScores[i] < 0 || i == levels.length - 1) {
            var lastLevel = i + 1;
            break;
        }
    };
    var mc = new Sprite(bitmaps.menu_btn, 84, 45);
    mc.x = 45;
    mc.y = 25;
    mc.onclick = function () {
        gameState = STATE_MENU;
        createScene();
    }
    stage.addChild(mc);
    var smallLvl = new Sprite(bitmaps['smallLvl' + lastLevel], 133, 104);
    smallLvl.x = 395;
    smallLvl.y = 160;
    stage.addChild(smallLvl);
    /*mc = new Sprite(bitmaps.soundButton, 45, 45, 2);
    mc.x = 315;
    mc.y = 295;
    if (isMusicOn) mc.gotoAndStop(0);
    else mc.gotoAndStop(1);
    mc.onclick = toggleSound;
    stage.addChild(mc);
    mc = new Sprite(bitmaps.logoMenu, 100, 31);
    mc.x = 425;
    mc.y = 17;
    mc.static = true;
    mc.onclick = showMoreGames;
    stage.addChild(mc);*/
}

function getLevelsScores() {
    levelsScores = [];
    var s = Utils.getCookie('snail_bob_levels_scores') + "";
    if (s != "null") levelsScores = s.split(',');
    for (var i = 0; i < levels.length; i++) {
        if (!levelsScores[i]) levelsScores[i] = -1;
        levelsScores[i] *= 1;
    }
}

function saveLevelsScores() {
    Utils.setCookie('snail_bob_levels_scores', levelsScores.join(","));
}

function getTotalLevelsScores() {
    var sum = 0;
    for (var i = 0; i < levels.length; i++) {
        if (levelsScores[i] >= 0) sum += levelsScores[i];
    }
    return sum;
}

function showMenu() {
    var back = new Sprite(bitmaps.menuBack, 480, 320);
    back.setPosition(getStageCenter(), getStageHeightCenter());
    back.static = true;
    stage.addChild(back);
    var playBtn = new Sprite(bitmaps.play, 88, 30, 4);
    playBtn.x = 133;
    playBtn.y = 80;
    playBtn.rotation = -0.1;
    playBtn.stop();
    playBtn.onclick = function () {
    	adRequest();
        if (gameState != STATE_MENU) return;
        gameState = STATE_SELECT_LEVEL;
        createScene();
    }
    stage.addChild(playBtn);
    attachMouseEvents.call(playBtn);
    var mc = new Sprite(bitmaps.credits, 98, 30, 4);
    mc.x = 150;
    mc.y = 130;
    mc.rotation = -0.06;
    mc.stop();
    mc.onclick = showCredits;
    stage.addChild(mc);
    attachMouseEvents.call(mc);
    var mc = new Sprite(bitmaps.moreGames, 140, 30, 4);
    mc.x = 175;
    mc.y = 180;
    mc.rotation = -0.02;
    mc.stop();
    mc.onclick = function () {
        if (gameState != STATE_MENU) return;
        showMoreGames();
    }
    stage.addChild(mc);
    attachMouseEvents.call(mc);
    var mc = new Sprite(bitmaps.bobMenu1, 80, 72, 13);
    mc.x = 93;
    mc.y = 255;
    mc.animDelay = 2;
    mc.num = 2;
    mc.onenterframe = function (e) {
        var obj = e.target;
        if (obj.currentFrame == 12) {
            obj.bitmap = bitmaps['bobMenu' + obj.num];
            obj.gotoAndPlay(0);
            if (obj.num != 4) obj.num++;
            else obj.num = 1;
        }
    };
    stage.addChild(mc);
    /*var mc = new Sprite(bitmaps.soundButton, 45, 45, 2);
    mc.x = 353;
    mc.y = 175;
    if (isMusicOn) mc.gotoAndStop(0);
    else mc.gotoAndStop(1);
    mc.onclick = toggleSound;
    stage.addChild(mc);
    mc = new Sprite(bitmaps.logoMenu, 100, 31);
    mc.x = 400;
    mc.y = 242;
    mc.static = true;
    mc.onclick = showMoreGames;
    stage.addChild(mc);
    */
}

function showCredits() {
    if (gameState != STATE_MENU) return;
    gameState = STATE_CREDITS;
    var credits = new SpritesGroup(stage);
    credits.x = 93;
    credits.y = 255;
    credits.scaleX = 0.01;
    credits.scaleY = 0.01;
    var back = new Sprite(bitmaps.creditsBack, 250, 250);
    back.gx = 0;
    back.gy = 0;
    credits.addChild(back, true);
    var logo = new Sprite(bitmaps.logo, 150, 62);
    logo.gx = 10;
    logo.gy = -12;
    logo.onclick = function () {
        window.open('http://hunter-hamster.com/');
    };
    credits.addChild(logo, true);
    var fb = new Sprite(bitmaps.Facebook, 150, 24);
    fb.gx = 10;
    fb.gy = 27;
    fb.onclick = function () {
        window.open('https://www.facebook.com/SnailBobGame');
    };
    credits.addChild(fb, true);
    var exit = new Sprite(bitmaps.x0001, 31, 30);
    exit.gx = 52;
    exit.gy = -50;
    exit.onclick = function () {
        stage.createTween(credits, 'scaleX', credits.scaleX, 0, fps, Easing.quartic.easeOut).play();
        stage.createTween(credits, 'scaleY', credits.scaleY, 0, fps, Easing.quartic.easeOut).play();
        stage.createTween(credits, 'x', credits.x, 93, fps, Easing.quartic.easeOut).play();
        stage.createTween(credits, 'y', credits.y, 255, fps, Easing.quartic.easeOut).play();
        gameState = STATE_MENU;
    };
    credits.addChild(exit, true);
    stage.createTween(credits, 'scaleX', 0.01, 1, fps, Easing.quartic.easeIn).play();
    stage.createTween(credits, 'scaleY', 0.01, 1, fps, Easing.quartic.easeIn).play();
    stage.createTween(credits, 'x', credits.x, 240, fps, Easing.quartic.easeIn).play();
    stage.createTween(credits, 'y', credits.y, 160, fps, Easing.quartic.easeIn).play();
}

function showMoreGames() {
    //window.open(MORE_GAMES_URL);

    if(typeof GameAPI != 'undefined')GameAPI.Branding.getLink("more_games").action();
    

}

function showWalkthrough() {
    //window.open(WALKTHROUGH_URL);
    if(typeof GameAPI != 'undefined')GameAPI.Branding.getLink("walkthrough").action();
}

function checkIfWin() {
    if (stage.hitTest(field.bob, field.destination) && getDistance(field.bob, field.destination) < 15) {
        showWinScreen();
    }
}

function showWinScreen() {
	adRequest();
    if (gameState != STATE_GAME) return;
    mixer.stop(1);
    if (isSoundOn) mixer.play('snd_level_completed', false);
    if (levelsScores[currentLevel - 1] < gameScore) {
        levelsScores[currentLevel - 1] = gameScore;
        saveLevelsScores();
    }
    if (currentLevel == levels.length) {
        gameState = STATE_FINAL;
        showFinalScreen();
        return;
    }
    gameState = STATE_VICTORY;
    var back_mal = new Sprite(null, getStageWidth(), getStageHeight());
    back_mal.setPosition(getStageCenter(), getStageHeightCenter());
    back_mal.fillColor = '#FFFFFF';
    back_mal.opacity = 0.5;
    back_mal.onclick = function () {
        return false
    };
    stage.addChild(back_mal);
    var popup = new SpritesGroup(stage);
    popup.x = 240;
    popup.y = 160;
    popup.scaleX = 0.01;
    popup.scaleY = 0.01;
    var back = new Sprite(bitmaps.PanelLevelComplete, 250, 248);
    back.gx = 0;
    back.gy = 0;
    popup.addChild(back, true);
    var logoCleared = new Sprite(bitmaps.logoCleared, 93, 30);
    logoCleared.gx = -6;
    logoCleared.gy = -37;
    logoCleared.onclick = showMoreGames;
    popup.addChild(logoCleared, true);
    
    var levelScoreText = new SimpleText(bitmaps.numb, 23, 20);;
    levelScoreText.align = levelScoreText.ALIGN_LEFT;
    levelScoreText.x = 0;
    levelScoreText.y = 3;
    levelScoreText.write(gameScore);
    levelScoreText.addToGroup(popup);
    var int = stage.setInterval(function () {
        popup.scaleX += 0.06;
        popup.scaleY += 0.06;
        if (popup.scaleX >= 1) {
            popup.scaleX = 1;
            popup.scaleY = 1;
            next_btn.opacity = lvl_map.opacity = 1;
            stage.clearInterval(int);
        }
    }, 1);
    var next_btn = new Sprite(bitmaps.NextLeveButton, 136, 44);
    next_btn.setPosition(getStageCenter() + 30, getStageHeightCenter() + 55);
    next_btn.opacity = 0;
    next_btn.onclick = function () {
        if (currentLevel == levels.length || !levels[currentLevel].objects.length) {

            gameState = STATE_SELECT_LEVEL;
            createScene();
        } else {
            currentLevel++;
            prepareLevel();
        }
        return false;
    };
    stage.addChild(next_btn);
    var lvl_map = new Sprite(bitmaps.LVL_map, 40, 26);
    lvl_map.setPosition(getStageCenter() - 65, getStageHeightCenter() + 30);
    lvl_map.onclick = function () {
        gameState = STATE_SELECT_LEVEL;
        createScene();
        return false;
    };
    lvl_map.opacity = 0;
    stage.addChild(lvl_map);
}

function showGameOverScreen() {
    if (gameState != STATE_GAME) return;
    stage.setTimeout(function () {
        gameState = STATE_GAME_OVER;
        mixer.stop(1);
        var back_mal = new Sprite(null, getStageWidth(), getStageHeight());
        back_mal.setPosition(getStageCenter(), getStageHeightCenter());
        back_mal.fillColor = '#FFFFFF';
        back_mal.opacity = 0.5;
        back_mal.onclick = function () {
            return false
        };
        stage.addChild(back_mal);
        var back = new Sprite(bitmaps.GameOver, 251, 242);
        back.setPosition(getStageCenter(), getStageHeightCenter());
        stage.addChild(back);
        var try_btn = new Sprite(bitmaps.TryAgainButton, 83, 24);
        try_btn.setPosition(getStageCenter() + 14, getStageHeightCenter() + 20);
        try_btn.onclick = prepareLevel;
        stage.addChild(try_btn);
        var walkthrough_btn = new Sprite(bitmaps.WalkthroughButton, 91, 37);
        walkthrough_btn.setPosition(try_btn.x, try_btn.y + 40);
        walkthrough_btn.onclick = showWalkthrough;
        stage.addChild(walkthrough_btn);
    }, fps);
}

function buildBackground() {
    if (stage) stage.drawScene(document.getElementById("screen_background"), true);
}

function findObject(name) {
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].name == name) return objects[i];
    }
    return false;
}

function prepareLevel() {
    if (currentLevel == 1 && !comics) {
        comics = true;
        gameState = STATE_COMICS;
        createScene();
        return;
    }
    if (stage) {
        mc = new Sprite(bitmaps.hourglass, 100, 150, 1);
        mc.x = 240;
        mc.y = 130;
        stage.addChild(mc);
    }
    setTimeout(function () {
        gameState = STATE_GAME;
        createScene();
    }, (1000 / fps) * 2);
}

function deleteObject(sprite) {
    sprite.destroy = true;
    if (sprite.box2dBody) {
        world.DestroyBody(sprite.box2dBody);
    }
}

function debugDraw() {
    if (gameState != STATE_GAME || field.locked || pause) return false;
    if (world) drawWorld(world, stage);
}

function startLevel(n, data) {
    createStage();
    field = new GameField();
    field.init(n, data);
    buildBackground();
    stage.start();
}
var cY;

function disableSpriteRotation(e) {
    e.target.rotation = 0;
}
var SnailBob = function () {
    var self = this;
    var loc = getBobLocation();
    this.obj = createObject({
        type: "Bob",
        x: loc.x,
        y: loc.y,
        rotation: 0
    });
    var me = self.obj;
    me.states = [];
    me.onbox2dsync = disableSpriteRotation;
    me.speed = SPEED_WALK;
    me.opacity = 0;
    me.direction = 'right';
    me.state = 'walk';
    var walk = new Sprite(bitmaps.BobGo, 50, 40, 17);
    walk.setPosition(me.x, me.y);
    walk.setZIndex(15);
    walk.animDelay = 2;
    walk.gotoAndPlay(3);
    walk.onenterframe = function (e) {
        if (e.target.currentFrame == 16) {
            e.target.gotoAndPlay(3);
        }
    };
    me.walk = walk;
    me.states.push(walk);
    stage.addChild(walk);
    var run = new Sprite(bitmaps.BobRun, 57, 50, 19);
    run.setPosition(me.x, me.y);
    run.animDelay = 1;
    run.setZIndex(15);
    run.opacity = 0;
    run.gotoAndPlay(3);
    run.onenterframe = function (e) {
        if (e.target.currentFrame == 15) {
            e.target.gotoAndPlay(3);
        }
    };
    me.run = run;
    me.states.push(run);
    stage.addChild(run);
    var hide = new Sprite(bitmaps.BobHide, 57, 42, 11);
    hide.setPosition(me.x, me.y);
    hide.animDelay = 2;
    hide.opacity = 0;
    hide.setZIndex(15);
    hide.onenterframe = function (e) {
        if (e.target.currentFrame == 10) {
            e.target.gotoAndStop(10);
        }
    };
    me.hide = hide;
    me.states.push(hide);
    stage.addChild(hide);
    var show = new Sprite(bitmaps.BobHide, 57, 42, 11);
    show.setPosition(me.x, me.y);
    show.animDelay = 2;
    show.opacity = 0;
    show.setZIndex(15);
    show.onenterframe = function (e) {
        if (e.target.currentFrame == 0) {
            e.target.gotoAndStop(0);
        }
    };
    me.show = show;
    me.states.push(show);
    stage.addChild(show);
    me.changeState = function (state) {
        if (me.direction == 'left' && !me[state].forbidScale) {
            me[state].scaleX = -1;
        } else {
            me[state].scaleX = 1;
        }
        var currState = me.state;
        stage.setTimeout(function () {
            me[currState].opacity = 0;
        }, 1);
        me[state].opacity = 1;
        me.state = state;
    }
    me.box2dBody.m_world.m_allowSleep = false;
    me.forceSleep = function () {
        me.temp_speed = me.speed;
        me.speed = 0;
        me.isAsleep = true;
    }
    me.forceWakeUp = function () {
        me.speed = me.temp_speed;
        me.box2dBody.WakeUp();
        me.isAsleep = false;
    }
    me.onclick = function (e) {
        if (field.turning) return;
        var func = me.onclick;
        delete me.onclick;
        if (!me.isAsleep) {
            e.target.changeState('hide');
            me.hide.gotoAndPlay(0);
            me.forceSleep();
            stage.setTimeout(function () {
                me.onclick = func;
            }, hide.animDelay * 12);
        } else {
            e.target.changeState('show');
            me.show.rewindAndStop(10);
            stage.setTimeout(function () {
                var state = (Math.abs(me.temp_speed) == SPEED_WALK) ? 'walk' : 'run';
                e.target.changeState(state);
                me.forceWakeUp();
                me.onclick = func;
            }, show.animDelay * 12);
        }
    }
    me.switchState = function () {
        if (me.state == 'walk') {
            me.changeState('run');
        } else if (me.state == 'run') {
            me.changeState('walk');
        }
    }
    me.synchPosition = function () {
        for (var i = 0, j = me.states.length; i < j; i++) {
            me.states[i].setPosition(me.x, me.y)
        }
        if (!me.isAsleep && me.box2dBody.IsSleeping()) {
            var pos = me.box2dBody.GetCenterPosition();
            pos.y -= 0.1;
            me.box2dBody.SetCenterPosition(pos, 0);
            me.box2dBody.WakeUp();
        }
    }
    return me;
}

    function addBobState(name, w, h, f, l) {
        var me = field.bob;
        var state = new Sprite(bitmaps[name], w, h, f, l);
        state.setPosition(me.x, me.y);
        state.animDelay = 2;
        state.opacity = 0;
        state.gotoAndStop(0);
        me[name] = state;
        me.states.push(state);
        stage.addChild(state);
        return state;
    }

    function getBobLocation() {
        for (var i = 0, j = stage.objects.length; i < j; i++) {
            var obj = stage.objects[i];
            if (obj.info && obj.info.indexOf('entrance') != -1) {
                obj.setZIndex(20);
                if (obj.info.indexOf('invisible') == -1) {
                    var vec1 = new Vector(38, 0);
                    var vec2 = new Vector(39, 0);
                    vec1.rotate(-obj.rotation);
                    vec2.rotate(-obj.rotation);
                    var tubeCover = new Sprite(bitmaps.TubeCoverMc, 8, 47);
                    tubeCover.setPosition(obj.x + vec1.x, obj.y + vec1.y);
                    tubeCover.rotation = obj.rotation;
                    tubeCover.setZIndex(21);
                    stage.addChild(tubeCover);
                    var backTube = new Sprite(bitmaps.BackTube, 4, 47);
                    backTube.setPosition(obj.x + vec2.x, obj.y + vec2.y);
                    backTube.rotation = obj.rotation;
                    stage.addChild(backTube);
                    backTube.setZIndex(5);
                }
                if (!obj.custom) {
                    var int = stage.setInterval(function () {
                        if (!stage.hitTest(field.bob, obj)) {
                            if (tubeCover) tubeCover.setStatic(true);
                            if (backTube) backTube.setStatic(true);
                            obj.setStatic(true);
                            stage.clearInterval(int);
                        }
                    }, fps);
                }
                return {
                    x: obj.x,
                    y: obj.y
                };
            }
        }
    }
var GameField = function () {
    var self = this;
    this.init = function (id, data) {
        world = box2DCreateWorld();
        b2Settings.b2_timeToSleep = 0.05;
        b2Settings.b2_linearSleepTolerance = 1;
        b2Settings.b2_angularSleepTolerance = 0.1;
        createStage();
        pause = false;
        self.fillGameBackground();
        self.createLevelObjects(id, data);
        var levelJoints = levels[id].joints;
        if (levelJoints) {
            var j, joint, stack, body1, body2;
            for (var i = 0; i < levelJoints.length; i++) {
                joint = levelJoints[i];
                body1 = getBodyByPoint(joint.point1);
                body2 = getBodyByPoint((joint.point2 ? joint.point2 : joint.point1), body1);
                if (joint.type == 0) j = box2DCreateRevoluteJoint(world, body1, body2, joint.point1, joint.custom);
                if (joint.type == 1) j = box2DCreateDistanceJoint(world, body1, body2, joint.point1, joint.point2);
                if (joint.type == 2) j = box2DCreatePrismaticJoint(world, body1, body2, joint.point2, joint.custom);
            }
        }
        hideInvisibleImg();
        stopAnimations();
        self.setBobDestination();
        self.bob = new SnailBob();
        gameScore = 301;
        loopSound = false;
        var script = (GET["debug"] != 1) ? levelsScripts[currentLevel - 1] : levelsScripts[editorLevel - 1];
        script.init();
        if (script.pretick) stage.addEventListener("pretick", script.pretick);
        if (script.posttick) stage.addEventListener("posttick", script.posttick);
        var t = new SimpleText(bitmaps.lvl_numbs, 15, 14);
        t.align = t.ALIGN_CENTER;
        t.x = getStageWidth() - 18;
        t.y = 20;
        t.lvlNum = true;
        t.write(id + 1);
        var mc = new Sprite(bitmaps.soundButton, 45, 45, 2);
        mc.x = 115;
        mc.y = 295;
        if (isMusicOn) mc.gotoAndStop(0);
        else mc.gotoAndStop(1);
        mc.onclick = toggleSound;
        stage.addChild(mc);
        buildBackground();
        stage.start();
        drawScore();
    }
    this.fillGameBackground = function () {
        var background = (GET["debug"] != 1) ? new Sprite(bitmaps['Lvl' + currentLevel + '_back'], 480, 320) : new Sprite(bitmaps['Lvl' + editorLevel + '_back'], 480, 320);
        background.setPosition(getStageCenter(), getStageHeightCenter());
        background.static = true;
        stage.addChild(background);
        if (currentLevel != 7 && currentLevel != 9 && currentLevel != 14) {
            /*var logo = new Sprite(bitmaps.for_lvls, 74, 23);
            logo.x = 347;
            logo.y = 309;
            logo.setZIndex(60);
            logo.onclick = showMoreGames;
            stage.addChild(logo);
            */
        }
        var speed1 = new Sprite(bitmaps.SspeedStandardBtn, 30, 30);
        speed1.setPosition(60, 20);
        speed1.value = SPEED_WALK;
        speed1.onclick = speedHandler;
        speed1.locked = true;
        speed1.setZIndex(50);
        self.speedHandler = speed1;
        stage.addChild(speed1);
        var speed2 = new Sprite(bitmaps.SpeedFastBtn, 30, 30);
        speed2.setPosition(speed1.x + 30, speed1.y);
        speed2.value = SPEED_RUN;
        speed2.onclick = speedHandler;
        stage.addChild(speed2);
        var indicator = new Sprite(bitmaps.SpeedIndicatorMc, 33, 33);
        indicator.setPosition(speed1.x, speed1.y);
        stage.addChild(indicator);
        var speed_icon = new Sprite(bitmaps.SpeedBob, 37, 32, 2);
        speed_icon.setPosition(speed1.x - 35, speed1.y);
        speed_icon.gotoAndStop(0);
        stage.addChild(speed_icon);
        self.speedHandler = [speed1, speed2];

        function speedHandler() {
            if (this.locked || self.locked || field.turning) return;
            this.locked = true;
            if (this === speed1) {
                speed2.locked = false;
                speed_icon.gotoAndStop(0);
                if (isSoundOn) mixer.play('snd_speed_standard', false);
            } else {
                speed1.locked = false;
                speed_icon.gotoAndStop(1);
                if (isSoundOn) mixer.play('snd_speed_fast', false);
            }
            indicator.setPosition(this.x, this.y);
            if (!self.bob.isAsleep) {
                self.bob.switchState();
                self.bob.speed = (self.bob.direction == 'right') ? this.value : -this.value;
            } else {
                self.bob.temp_speed = (self.bob.direction == 'right') ? this.value : -this.value;
            }
        }
        var level = new Sprite(bitmaps.Lvl, 39, 29);
        level.setPosition(getStageWidth() - 18, 15);
        level.lvlNum = true;
        level.static = true;
        stage.addChild(level);
        var score_img = new Sprite(bitmaps.score, 90, 30);
        score_img.setPosition(getStageCenter() + 10, getStageHeight() - 14);
        score_img.setZIndex(35);
        score_img.score_img = true;
        stage.addChild(score_img);
        var lvl_map = new Sprite(bitmaps.LVL_map_new, 45, 45);
        lvl_map.setPosition(25, getStageHeight() - 25);
        lvl_map.onclick = function () {
            mixer.stop(1);
            gameState = STATE_SELECT_LEVEL;
            createScene();
            return false;
        }
        stage.addChild(lvl_map);
        var restart_btn = new Sprite(bitmaps.restart, 45, 45);
        restart_btn.setPosition(lvl_map.x + 45, getStageHeight() - 25);
        restart_btn.onclick = function () {
            mixer.stop(1);
            comics = true;
            prepareLevel();
            comics = false;
        };
        stage.addChild(restart_btn);
        var walkthrough_btn = new Sprite(bitmaps.WalkthroughButton, 91, 37);
        walkthrough_btn.setPosition(getStageWidth() - 45, getStageHeight() - 16);
        walkthrough_btn.static = true;
        walkthrough_btn.wlk = true;
        walkthrough_btn.onclick = showWalkthrough;
        stage.addChild(walkthrough_btn);
    }
    this.sleepToMoveBob = function (state) {
        self.bob.changeState('show');
        self.bob.show.gotoAndPlay(0);
        stage.setTimeout(function () {
            self.bob.forceWakeUp();
            self.bob.changeState(state);
        }, show.animDelay * 12);
    }
    this.createLevelObjects = function (id, data) {
        var levelObjs;
        if (data) {
            levelObjs = data.objects;
            levels = [data];
            gameState = STATE_GAME;
        } else levelObjs = levels[id].objects;
        for (var i = 0; i < levelObjs.length; i++) {
            createObject(levelObjs[i]);
        }
    }
    this.setBobDestination = function () {
        for (var i = 0, j = stage.objects.length; i < j; i++) {
            var obj = stage.objects[i];
            if (obj.info == 'destination') {
                stage.setZIndex(obj, 20);
                field.destination = obj;
                var vec1 = new Vector(-38, 0);
                var vec2 = new Vector(-39, 0);
                vec1.rotate(-obj.rotation);
                vec2.rotate(-obj.rotation);
                var tubeCover = new Sprite(bitmaps.TubeCoverMc, 8, 47);
                tubeCover.setPosition(obj.x + vec1.x, obj.y + vec1.y);
                tubeCover.rotation = obj.rotation;
                tubeCover.scaleX = -1;
                stage.addChild(tubeCover);
                var backTube = new Sprite(bitmaps.BackTube, 4, 47);
                backTube.setPosition(obj.x + vec2.x, obj.y + vec2.y);
                backTube.rotation = obj.rotation;
                stage.addChild(backTube);
                backTube.setZIndex(5);
                return;
            }
        }
    }
}

    function getBodyByPoint(point, presentBody) {
        var body = world.GetGroundBody();
        if (point) {
            stack = stage.getObjectsStackByCoord(point.x, point.y, false);
            if (stack.length > 0) {
                for (var i = stack.length - 1; i >= 0; i--) {
                    if (stack[i].box2dBody && stack[i].box2dBody != presentBody) body = stack[i].box2dBody;
                }
            }
        }
        return body;
    }

    function createObject(obj, relative) {
        var lo, ob, body, points, density, restitution, friction, x, y, width, height;
        lo = obj;
        ob = findObject(lo.type);
        mc = new Sprite(bitmaps[ob.name], ob.width, ob.height, ob.frames);
        if (ob.name == 'fire_lvl17') {
            mc = new TilesSprite(bitmaps[ob.name], ob.width, ob.height, ob.frames, ob.rows, ob.columns);
        }
        var cX = (relative) ? 0 : (getStageWidth() - 480) / 2;
        cY = (getStageHeight() - 320);
        mc.x = lo.x + cX;
        mc.y = getStageHeight() - 320 + lo.y;
        mc.custom = lo.custom;
        mc.rotation = lo.rotation;
        mc.setZIndex(10);
        stage.addChild(mc);
        density = lo.density ? lo.density : ob.density;
        restitution = lo.restitution ? lo.restitution : ob.restitution;
        friction = lo.friction ? lo.friction : ob.friction;
        width = ob.bodyWidth ? ob.bodyWidth : ob.width;
        height = ob.bodyHeight ? ob.bodyHeight : ob.height;
        x = lo.x + cX;
        y = lo.y + cY;
        if (ob.bodyPosCorrect) {
            x += ob.bodyPosCorrect.x;
            y += ob.bodyPosCorrect.y;
            mc.syncX = ob.bodyPosCorrect.x;
            mc.syncY = ob.bodyPosCorrect.y;
            mc.onbox2dsync = spritesSync;
        }
        if (ob.bodyType == BOX) body = box2DCreateBox(world, x, y, width / 2, height / 2, lo.rotation, ob.fixed, density, restitution, friction);
        if (ob.bodyType == CIRCLE) body = box2DCreateCircle(world, x, y, width / 2, lo.rotation, ob.fixed, density, restitution, friction);
        if (ob.bodyType == POLY) body = box2DCreatePoly(world, x, y, ob.points, lo.rotation, ob.fixed, density, restitution, friction);
        if (ob.joints) {
            for (var n = 0; n < ob.joints.length; n++) {
                if (ob.joints[n].type == "pivot") {
                    var point = new Vector(ob.joints[n].x, ob.joints[n].y);
                    if (lo.rotation != 0) point.rotate(-lo.rotation);
                    point.x += lo.x;
                    point.y += lo.y;
                    var pivot = box2DCreateCircle(world, point.x + cX, point.y + cY, 1, 0, true, 0.01, 0, 0);
                    box2DCreateRevoluteJoint(world, pivot, body, pivot.GetCenterPosition());
                }
            }
        }
        if (ob.info) {
            mc.info = ob.info;
        }
        if (body) body.sprite = mc;
        mc.box2dBody = body;
        mc.obType = ob.type;
        mc.grav = false;
        return mc;
    }

    function stopAnimations() {
        for (var i = 0, j = stage.objects.length; i < j; i++) {
            var obj = stage.objects[i];
            if (obj.totalFrames > 1) {
                obj.gotoAndStop(0);
            }
        }
    }

    function hideInvisibleImg() {
        for (var i = 0, j = stage.objects.length; i < j; i++) {
            var obj = stage.objects[i];
            if (obj.info && obj.info.indexOf('invisible') != -1) {
                obj.visible = false;
            }
        }
    }

    function addHint(x, y) {
        var self = this;
        var hint = new Sprite(bitmaps.Hint, 30, 30);
        hint.setPosition(x, y);
        hint.info = 'hint';
        hint.setZIndex(13);
        stage.addChild(hint);
        addRotation.call(hint);

        function addRotation() {
            var self = this;
            var int = stage.setInterval(function () {
                if (!field.locked) self.rotation += 0.05;
            }, 1);
            this.removeHint = function () {
                stage.clearInterval(int);
                var int2 = stage.setInterval(function () {
                    self.opacity -= 0.1;
                    if (self.opacity <= 0) {
                        stage.clearInterval(int2);
                        self.destroy = true;
                    }
                }, 1)
            }
        }
        this.hint = hint;
    }

    function enableHints() {
        for (var i = 0, j = stage.objects.length; i < j; i++) {
            var obj = stage.objects[i];
            if (obj.info && obj.info == 'hint') {
                addRotation.call(obj);
            }
        }
    }

    function getDistance(obj1, obj2) {
        return Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));
    }

    function setBackColor(color) {
        document.getElementById("screen_background_container").style.background = color;
        document.body.style.background = color;
    }

    function addStateBobGrowl() {
        var counter = 0;
        var BobGrowl = addBobState('BobGrowl', 50, 42, 15);
        BobGrowl.onenterframe = function (e) {
            var bob = field.bob;
            if (isSoundOn && !bob.soundPlayed && e.target.animated) {
                mixer.play('snd_bob_growl');
                bob.soundPlayed = true;
                field.turning = true;
            }
            if (e.target.currentFrame == 14 && e.target.animated) {
                if (counter < 1) {
                    e.target.gotoAndPlay(0);
                    counter++;
                } else {
                    e.target.stop();
                    if (bob.isAsleep) bob.forceWakeUp();
                    var state = (Math.abs(bob.speed) == SPEED_WALK) ? 'walk' : 'run';
                    bob.changeState(state);
                    bob[state].gotoAndPlay(0);
                    bob.soundPlayed = false;
                    field.turning = false;
                }
            }
        };
    };

function addStateBobFlatten() {
    var BobFlatten = addBobState('BobFlatten', 78, 44, 16);
    BobFlatten.onenterframe = function (e) {
        if (!field.bob.flatten && e.target.animated) {
            if (isSoundOn) mixer.play('snd_bob_flatten');
            field.bob.flatten = true;
        };
        if (e.target.currentFrame == 15 && e.target.animated) {
            e.target.stop();
            showGameOverScreen();
        }
    };
    BobFlatten.animDelay = 1;
    BobFlatten.setZIndex(15);
};

function bobFalls() {
    if (field.bob.falls) return;
    if (isSoundOn) mixer.play('snd_fall', false);
    var bob = field.bob;
    bob[bob.state].opacity = 0;
    bob.falls = true;
    var mc = new Sprite(bitmaps.BobFall1, 50, 174, 5);
    mc.x = bob.x;
    mc.y = bob.y - 40;
    mc.animDelay = 1;
    stage.addChild(mc);
    stage.setTimeout(function () {
        mc.bitmap = bitmaps.BobFall2;
        stage.setTimeout(function () {
            mc.bitmap = bitmaps.BobFall3;
            stage.setTimeout(function () {
                mc.destroy = true;
                stage.setTimeout(showGameOverScreen, fps / 2);
            }, mc.animDelay * 4);
        }, mc.animDelay * 5 - 1);
    }, mc.animDelay * 5 - 1);
    stage.createTween(mc, "y", mc.y, mc.y + 170, mc.animDelay * 13, Easing.sine.easeIn).play();
}

function addStateBobShocked() {
    var shocked = addBobState('shocked', 94, 102, 4);
    var counter = 0;
    shocked.onenterframe = function (e) {
        if (e.target.currentFrame == 2) {
            if (counter < 3) {
                counter++;
                e.target.gotoAndPlay(1);
            } else e.target.gotoAndPlay(3); if (e.target.currentFrame == 3) {
                e.target.opacity = 0;
                e.target.stop();
                field.bob.changeState('shocked2');
                field.bob.shocked2.gotoAndPlay(0);
                e.target.onenterframe = null;
                var mc = new Sprite(bitmaps.spirit, 75, 100);
                mc.x = e.target.x;
                mc.y = e.target.y;
                stage.addChild(mc);
                var tween = stage.createTween(mc, "y", e.target.y, -50, fps * 1.5, Easing.linear.easeIn);
                tween.play();
                tween.onfinish = showGameOverScreen;
            };
        }
    };
    shocked2 = addBobState('shocked2', 94, 102, 7);
    shocked2.onenterframe = function (e) {
        if (e.target.currentFrame == 6) e.target.stop(0);
    }
    shocked2.animDelay = 3;
}

function bobBurns(fire) {
    var bob = field.bob;
    if (bob.onFire) return;
    if (isSoundOn) mixer.play('snd_burn');
    bob.onclick = null;
    bob.onFire = true;
    bob[bob.state].opacity = 0;
    bob.box2dBody.Freeze();
    var BobBurn = new Sprite(bitmaps.BobBurn, 50, 52, 7);
    BobBurn.setPosition(bob.x, bob.y - 7);
    BobBurn.animDelay = 2;
    BobBurn.setZIndex(15);
    BobBurn.onenterframe = function (e) {
        if (e.target.currentFrame == 6 && e.target.animated) {
            e.target.stop();
            if (fire) {
                stage.setTimeout(function () {
                    fire.destroy = true;
                    mixer.stop(4);
                    mixer.stop(3);
                }, 10);
            }
        }
    };
    stage.addChild(BobBurn);
    var mc = new Sprite(bitmaps.BobBurnAnimMc2, 60, 42, 15);
    mc.x = bob.x;
    mc.y = bob.y + 3;
    mc.animDelay = 2;
    stage.addChild(mc);
    var tween = stage.createTween(mc, "x", mc.x, 510, (fps / 250) * (510 - mc.x), Easing.linear.easeIn);
    stage.setTimeout(tween.play, 2 * mc.animDelay);
    tween.onfinish = showGameOverScreen;
}
var tmScore;
var scoreText;

function drawScore() {
    if (gameState == STATE_MENU || gameState == STATE_SELECT_LEVEL || gameState == STATE_FINAL) return;
    if (gameState == STATE_GAME) {
        clearTimeout(tmScore);
        gameScore--;
        if (gameScore < 0) gameScore = 0;
        if (scoreText) {
            var ii;
            for (ii = 0; ii < scoreText.sprites.length; ii++) {
                if (scoreText.sprites[ii]) scoreText.sprites[ii].destroy = true;
            }
        }
        scoreText = new SimpleText(bitmaps.score_num, 8, 12);
        scoreText.align = scoreText.ALIGN_LEFT;
        scoreText.x = 265;
        scoreText.y = 305;
        scoreText.write(gameScore);
        tmScore = setTimeout(function () {
            if (scoreText) {
                var i;
                for (i = 0; i < scoreText.sprites.length; i++) {
                    if (scoreText.sprites[i]) scoreText.sprites[i].destroy = true;
                }
            }
            drawScore();
        }, 500);
    } else {
        scoreText = new SimpleText(bitmaps.score_num, 8, 12);
        scoreText.align = scoreText.ALIGN_LEFT;
        scoreText.x = 265;
        scoreText.y = 305;
        scoreText.write(gameScore);
        for (var j = 0; j < scoreText.sprites.length; j++) {
            scoreText.sprites[j].setZIndex(36);
        };
    }
}

function toggleSound(e) {
    if (!mixer || gameState == STATE_CREDITS) return;
    if (isMusicOn) {
        isSoundOn = false;
        isMusicOn = false;
        loopSound = false;
        mixer.stop(0);
        mixer.channels[1].pause();
        e.target.gotoAndStop(1);
        Utils.setCookie("snail_bob_sound", 2);
    } else {
        if (!android) isSoundOn = true;
        isMusicOn = true;
        mixer.channels[1].resume();
        mixer.play('game_music1', true, true, 0);
        if (loopSound) mixer.play(loopSound, true, true, 1);
        e.target.gotoAndStop(0);
        Utils.setCookie("snail_bob_sound", 1);
    }
};

function getObjectByInfo(info) {
    var arr = [];
    for (var i = 0, j = stage.objects.length; i < j; i++) {
        if (stage.objects[i].info == info) arr.push(stage.objects[i]);
    };
    if (arr.length == 1) return arr[0];
    else return arr;
}

function getObjectByCustomInfo(info) {
    for (var i = 0, j = stage.objects.length; i < j; i++) {
        if (stage.objects[i].custom == info) return stage.objects[i];
    };
    return {};
}

function attachMouseEvents() {
    this.onmouseover = function (e) {
        e.target.gotoAndStop(1);
    }
    this.onmouseout = function (e) {
        e.target.gotoAndStop(0);
    }
    this.onmousedown = function (e) {
        e.target.gotoAndStop(2);
    }
    this.onmouseup = function (e) {
        e.target.gotoAndStop(1);
    }
}

function addLiftHandlers(arr) {
    var lift = this,
        bob = field.bob;
    arr[0].gotoAndStop(0);
    arr[1].gotoAndStop(1);
    addHint.call(arr[0], arr[0].x, arr[0].y);
    arr[1].locked = true;
    arr.forEach(function (el) {
        el.onclick = function (e) {
            if (!e.target.locked) {
                e.target.gotoAndStop(1);
                e.target.locked = true;
                if (e.target === arr[0]) {
                    if (isSoundOn) mixer.play('snd_button');
                    arr[0].hint.removeHint();
                    addHint.call(arr[1], arr[1].x, arr[1].y);
                    arr[1].locked = false;
                    arr[1].gotoAndStop(0);
                } else {
                    if (isSoundOn) mixer.play('snd_button_ground_on');
                    arr[1].hint.removeHint();
                    addHint.call(arr[0], arr[0].x, arr[0].y);
                    arr[0].locked = false;
                    arr[0].gotoAndStop(0);
                }
                if (lift.GetCenterPosition().y <= 115) return;
                lift.sprite.setStatic(false);
                var limit = lift.GetCenterPosition().y - 13;
                var bob_pos;
                var int = stage.setInterval(function () {
                    pos = lift.GetCenterPosition();
                    pos.y -= 2;
                    lift.SetCenterPosition(pos, 0);
                    if (checkIfBobOnLift(lift.sprite)) {
                        bob_pos = bob.box2dBody.GetCenterPosition();
                        bob_pos.y -= 2;
                        bob.box2dBody.SetCenterPosition(bob_pos, 0);
                    }
                    if (pos.y <= limit) {
                        stage.clearInterval(int);
                        stage.setTimeout(function () {
                            lift.sprite.setStatic(true);
                        }, 1);
                    }
                }, 1);
            }
        };
    });
}

function moveLift(direction) {
    var b = this.box2dBody,
        pos, bob_pos, bob = field.bob.box2dBody,
        self = this;
    if (moveLift.int) stage.clearInterval(moveLift.int);
    this.setStatic(false);
    this.cover.setStatic(false);
    switch (direction) {
    case 'up':
        moveLift.int = stage.setInterval(function () {
            pos = b.GetCenterPosition();
            pos.y -= 1;
            b.SetCenterPosition(pos, 0);
            if (checkIfBobOnLift(self)) {
                bob_pos = bob.GetCenterPosition();
                bob_pos.y -= 1;
                bob.SetCenterPosition(bob_pos, 0);
            }
            if (pos.y == 200) {
                stage.clearInterval(moveLift.int);
                self.setStatic(true);
                self.cover.setStatic(true);
            }
        }, 1);
        break;
    case 'down':
        moveLift.int = stage.setInterval(function () {
            pos = b.GetCenterPosition();
            pos.y += 1;
            b.SetCenterPosition(pos, 0);
            if (pos.y == 247) {
                stage.clearInterval(moveLift.int);
                self.setStatic(true);
                self.cover.setStatic(true);
            }
        }, 1);
        break;
    default:
        console.log('unknown direction');
    }
}

function checkIfBobOnLift(lift) {
    var bob = field.bob;
    if (!stage.hitTest(bob, lift)) return false;
    if (bob.y > lift.y) return false;
    if ((lift.x - lift.width / 2) <= bob.x && (lift.x + lift.width / 2) >= bob.x) {
        return true;
    }
}

function turnBob(platform) {
    var bob = field.bob;
    if (stage.hitTest(bob, platform)) {
        field.turning = true;
        if (bob.state != 'hide') bob.forceSleep();
        bob.direction = (bob.direction == 'right') ? 'left' : 'right';
        if (bob.state == 'hide') {
            bob.changeState('BobHideTurn');
            bob.BobHideTurn.gotoAndPlay(0);
        } else {
            bob.changeState('BobTurns');
            bob.BobTurns.gotoAndPlay(0);
        }
    }
}

function processSlider(platform) {
    var bob = field.bob;
    var BobTurns = addBobState('BobTurns', 47, 561 / 14, 14);
    BobTurns.scaleX = -1;
    BobTurns.onenterframe = function (e) {
        if (e.target.currentFrame == 13 && e.target.animated) {
            bob.forceWakeUp();
            bob.speed *= -1;
            e.target.stop();
            setStateAfterTurn();
        }
    };
    var BobHideTurn = addBobState('BobHideTurn', 56, 504 / 14, 14);
    BobHideTurn.scaleX = -1;
    BobHideTurn.onenterframe = function (e) {
        if (e.target.currentFrame == 13 && e.target.animated) {
            bob.temp_speed *= -1;
            e.target.stop();
            setStateAfterTurn();
        }
    };
    var slider = this;
    addHint.call(slider, slider.x, slider.y);
    slider.static = true;
    slider.onclick = function (e) {
        if (slider.locked || bob.state == 'show' || field.turning) return;
        if (isSoundOn) mixer.play('snd_turn_around', false);
        slider.locked = true;
        if (bob.direction == 'left') {
            platform.gotoAndPlay(0);
            platform.onenterframe = function (e) {
                if (e.target.currentFrame == 13) {
                    e.target.gotoAndStop(0);
                    slider.locked = false;
                    platform.onenterframe = null;
                }
            }
            turnBob(platform);
        } else {
            platform.rewindAndStop(13);
            platform.onenterframe = function (e) {
                if (e.target.currentFrame == 0) {
                    e.target.stop();
                    slider.locked = false;
                    platform.onenterframe = null;
                }
            }
            turnBob(platform);
        }
    }
}

function setStateAfterTurn() {
    var bob = field.bob;
    switch (Math.abs(bob.speed)) {
    case SPEED_WALK:
        bob.changeState('walk');
        break;
    case SPEED_RUN:
        bob.changeState('run');
        break;
    case 0:
        bob.changeState('hide');
        break;
    default:
        console.log('bob.speed = ' + bob.speed);
        break;
    }
    stage.setTimeout(function () {
        field.turning = false;
    }, Math.ceil(fps * 0.4));
}

function rotateHandler(but, restriction, earth) {
    var bridge = this,
        bob = field.bob,
        block, left, int;
    var pos = bridge.GetCenterPosition();
    but.onmousedown = function () {
        if (but.info.indexOf('left') != -1) left = true;
        if (block) return;
        var oldRot = bridge.GetRotation();
        if ((left && oldRot <= restriction) || (!left && oldRot >= restriction)) return;
        block = true;
        bridge.sprite.setStatic(false);
        if (earth) earth.setStatic(false);
        int = stage.setInterval(function () {
            var rot = bridge.GetRotation();
            if (left) rot -= 0.05;
            else rot += 0.05;
            bridge.SetCenterPosition(pos, rot);
            if ((left && rot <= restriction) || (!left && rot >= restriction)) stopRotate();
        }, 1);
    }
    but.onmouseup = stopRotate;
    but.onmouseout = stopRotate;

    function stopRotate() {
        if (block) {
            stage.setTimeout(function () {
                bridge.sprite.setStatic(true);
                if (earth) earth.setStatic(true);
            }, 1);
            stage.clearInterval(int);
            block = false;
        }
    }
}

function latchMove(distance) {
    var obj = this,
        left, pos = obj.box2dBody.GetCenterPosition();
    obj.onclick = function (e) {
        var obj = e.target;
        if (obj.position == 'left') {
            obj.position = 'right';
            obj.hint.x += distance;
            pos.x += distance;
            obj.box2dBody.SetCenterPosition(pos, 0);
        } else {
            obj.position = 'left';
            obj.hint.x -= distance;
            pos.x -= distance;
            obj.box2dBody.SetCenterPosition(pos, 0);
        }
    }
};

function moveMechanism(mechanism, stone) {
    var obj = this;
    obj.onclick = function () {
        if (isSoundOn) mixer.play('snd_lever_double', false);
        obj.setStatic(false);
        obj.gotoAndPlay(0);
        obj.onenterframe = function (e) {
            var obj = e.target;
            if (obj.currentFrame == 5) {
                obj.gotoAndStop(5);
                obj.hint.removeHint();
                obj.setStatic(true);
            }
        }
        mechanism.setStatic(false);
        mechanism.gotoAndPlay(0);
        stone.box2dBody.WakeUp();
        obj.onclick = null;
    }
}

function moveBridge(but, restriction, earth, earth2, switchStatic) {
    var bridge = this,
        bob = field.bob,
        block, left, int;
    var pos = bridge.GetCenterPosition();
    but.onmousedown = function () {
        if (but.info.indexOf('left') != -1) left = true;
        if (block) return;
        var oldPos = bridge.GetCenterPosition();
        if ((left && oldPos.x <= restriction) || (!left && oldPos.x >= restriction)) return;
        block = true;
        if (switchStatic) {
            bridge.sprite.setStatic(false);
            if (earth) earth.setStatic(false);
            if (earth2) earth2.setStatic(false);
        };
        int = stage.setInterval(function () {
            var pos = bridge.GetCenterPosition();
            if (left) pos.x -= 4;
            else pos.x += 4;
            bridge.SetOriginPosition(pos, 0);
            if ((left && pos.x <= restriction) || (!left && pos.x >= restriction)) stopRotate();
        }, 1);
    }
    but.onmouseup = stopRotate;
    but.onmouseout = stopRotate;

    function stopRotate() {
        if (block) {
            if (switchStatic) {
                stage.setTimeout(function () {
                    bridge.sprite.setStatic(true);
                    if (earth) earth.setStatic(true);
                    if (earth2) earth2.setStatic(true);
                }, 1);
            };
            stage.clearInterval(int);
            block = false;
        }
    }
};
var Prototype = {
    Version: '1.7.1',
    Browser: (function () {
        var ua = navigator.userAgent;
        var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
        return {
            IE: !! window.attachEvent && !isOpera,
            Opera: isOpera,
            WebKit: ua.indexOf('AppleWebKit/') > -1,
            Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
            MobileSafari: /Apple.*Mobile/.test(ua)
        }
    })(),
    BrowserFeatures: {
        XPath: !! document.evaluate,
        SelectorsAPI: !! document.querySelector,
        ElementExtensions: (function () {
            var constructor = window.Element || window.HTMLElement;
            return !!(constructor && constructor.prototype);
        })(),
        SpecificElementExtensions: (function () {
            if (typeof window.HTMLDivElement !== 'undefined')
                return true;
            var div = document.createElement('div'),
                form = document.createElement('form'),
                isSupported = false;
            if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
                isSupported = true;
            }
            div = form = null;
            return isSupported;
        })()
    },
    ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script\\s*>',
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function () {},
    K: function (x) {
        return x
    }
};
if (Prototype.Browser.MobileSafari)
    Prototype.BrowserFeatures.SpecificElementExtensions = false;
var Class = (function () {
    var IS_DONTENUM_BUGGY = (function () {
        for (var p in {
            toString: 1
        }) {
            if (p === 'toString') return false;
        }
        return true;
    })();

    function subclass() {};

    function create() {
        var parent = null,
            properties = $A(arguments);
        if (Object.isFunction(properties[0]))
            parent = properties.shift();

        function klass() {
            this.initialize.apply(this, arguments);
        }
        Object.extend(klass, Class.Methods);
        klass.superclass = parent;
        klass.subclasses = [];
        if (parent) {
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }
        for (var i = 0, length = properties.length; i < length; i++)
            klass.addMethods(properties[i]);
        if (!klass.prototype.initialize)
            klass.prototype.initialize = Prototype.emptyFunction;
        klass.prototype.constructor = klass;
        return klass;
    }

    function addMethods(source) {
        var ancestor = this.superclass && this.superclass.prototype,
            properties = Object.keys(source);
        if (IS_DONTENUM_BUGGY) {
            if (source.toString != Object.prototype.toString)
                properties.push("toString");
            if (source.valueOf != Object.prototype.valueOf)
                properties.push("valueOf");
        }
        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i],
                value = source[property];
            if (ancestor && Object.isFunction(value) && value.argumentNames()[0] == "$super") {
                var method = value;
                value = (function (m) {
                    return function () {
                        return ancestor[m].apply(this, arguments);
                    };
                })(property).wrap(method);
                value.valueOf = (function (method) {
                    return function () {
                        return method.valueOf.call(method);
                    };
                })(method);
                value.toString = (function (method) {
                    return function () {
                        return method.toString.call(method);
                    };
                })(method);
            }
            this.prototype[property] = value;
        }
        return this;
    }
    return {
        create: create,
        Methods: {
            addMethods: addMethods
        }
    };
})();
(function () {
    var _toString = Object.prototype.toString,
        _hasOwnProperty = Object.prototype.hasOwnProperty,
        NULL_TYPE = 'Null',
        UNDEFINED_TYPE = 'Undefined',
        BOOLEAN_TYPE = 'Boolean',
        NUMBER_TYPE = 'Number',
        STRING_TYPE = 'String',
        OBJECT_TYPE = 'Object',
        FUNCTION_CLASS = '[object Function]',
        BOOLEAN_CLASS = '[object Boolean]',
        NUMBER_CLASS = '[object Number]',
        STRING_CLASS = '[object String]',
        ARRAY_CLASS = '[object Array]',
        DATE_CLASS = '[object Date]',
        NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON && typeof JSON.stringify === 'function' && JSON.stringify(0) === '0' && typeof JSON.stringify(Prototype.K) === 'undefined';
    var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
    var IS_DONTENUM_BUGGY = (function () {
        for (var p in {
            toString: 1
        }) {
            if (p === 'toString') return false;
        }
        return true;
    })();

    function Type(o) {
        switch (o) {
        case null:
            return NULL_TYPE;
        case (void 0):
            return UNDEFINED_TYPE;
        }
        var type = typeof o;
        switch (type) {
        case 'boolean':
            return BOOLEAN_TYPE;
        case 'number':
            return NUMBER_TYPE;
        case 'string':
            return STRING_TYPE;
        }
        return OBJECT_TYPE;
    }

    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }

    function inspect(object) {
        try {
            if (isUndefined(object)) return 'undefined';
            if (object === null) return 'null';
            return object.inspect ? object.inspect() : String(object);
        } catch (e) {
            if (e instanceof RangeError) return '...';
            throw e;
        }
    }

    function toJSON(value) {
        return Str('', {
            '': value
        }, []);
    }

    function Str(key, holder, stack) {
        var value = holder[key];
        if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        var _class = _toString.call(value);
        switch (_class) {
        case NUMBER_CLASS:
        case BOOLEAN_CLASS:
        case STRING_CLASS:
            value = value.valueOf();
        }
        switch (value) {
        case null:
            return 'null';
        case true:
            return 'true';
        case false:
            return 'false';
        }
        var type = typeof value;
        switch (type) {
        case 'string':
            return value.inspect(true);
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'object':
            for (var i = 0, length = stack.length; i < length; i++) {
                if (stack[i] === value) {
                    throw new TypeError("Cyclic reference to '" + value + "' in object");
                }
            }
            stack.push(value);
            var partial = [];
            if (_class === ARRAY_CLASS) {
                for (var i = 0, length = value.length; i < length; i++) {
                    var str = Str(i, value, stack);
                    partial.push(typeof str === 'undefined' ? 'null' : str);
                }
                partial = '[' + partial.join(',') + ']';
            } else {
                var keys = Object.keys(value);
                for (var i = 0, length = keys.length; i < length; i++) {
                    var key = keys[i],
                        str = Str(key, value, stack);
                    if (typeof str !== "undefined") {
                        partial.push(key.inspect(true) + ':' + str);
                    }
                }
                partial = '{' + partial.join(',') + '}';
            }
            stack.pop();
            return partial;
        }
    }

    function stringify(object) {
        return JSON.stringify(object);
    }

    function toQueryString(object) {
        return $H(object).toQueryString();
    }

    function toHTML(object) {
        return object && object.toHTML ? object.toHTML() : String.interpret(object);
    }

    function keys(object) {
        if (Type(object) !== OBJECT_TYPE) {
            throw new TypeError();
        }
        var results = [];
        for (var property in object) {
            if (_hasOwnProperty.call(object, property))
                results.push(property);
        }
        if (IS_DONTENUM_BUGGY) {
            for (var i = 0; property = DONT_ENUMS[i]; i++) {
                if (_hasOwnProperty.call(object, property))
                    results.push(property);
            }
        }
        return results;
    }

    function values(object) {
        var results = [];
        for (var property in object)
            results.push(object[property]);
        return results;
    }

    function clone(object) {
        return extend({}, object);
    }

    function isElement(object) {
        return !!(object && object.nodeType == 1);
    }

    function isArray(object) {
        return _toString.call(object) === ARRAY_CLASS;
    }
    var hasNativeIsArray = (typeof Array.isArray == 'function') && Array.isArray([]) && !Array.isArray({});
    if (hasNativeIsArray) {
        isArray = Array.isArray;
    }

    function isHash(object) {
        return object instanceof Hash;
    }

    function isFunction(object) {
        return _toString.call(object) === FUNCTION_CLASS;
    }

    function isString(object) {
        return _toString.call(object) === STRING_CLASS;
    }

    function isNumber(object) {
        return _toString.call(object) === NUMBER_CLASS;
    }

    function isDate(object) {
        return _toString.call(object) === DATE_CLASS;
    }

    function isUndefined(object) {
        return typeof object === "undefined";
    }
    extend(Object, {
        extend: extend,
        inspect: inspect,
        /*toJSON: NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,*/
        toQueryString: toQueryString,
        toHTML: toHTML,
        keys: Object.keys || keys,
        values: values,
        clone: clone,
        isElement: isElement,
        isArray: isArray,
        isHash: isHash,
        isFunction: isFunction,
        isString: isString,
        isNumber: isNumber,
        isDate: isDate,
        isUndefined: isUndefined
    });
})();
Object.extend(Function.prototype, (function () {
    var slice = Array.prototype.slice;

    function update(array, args) {
        var arrayLength = array.length,
            length = args.length;
        while (length--) array[arrayLength + length] = args[length];
        return array;
    }

    function merge(array, args) {
        array = slice.call(array, 0);
        return update(array, args);
    }

    function argumentNames() {
        var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '').replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    }

    function bind(context) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0]))
            return this;
        if (!Object.isFunction(this))
            throw new TypeError("The object is not callable.");
        var nop = function () {};
        var __method = this,
            args = slice.call(arguments, 1);
        var bound = function () {
            var a = merge(args, arguments),
                c = context;
            var c = this instanceof bound ? this : context;
            return __method.apply(c, a);
        };
        nop.prototype = this.prototype;
        bound.prototype = new nop();
        return bound;
    }

    function bindAsEventListener(context) {
        var __method = this,
            args = slice.call(arguments, 1);
        return function (event) {
            var a = update([event || window.event], args);
            return __method.apply(context, a);
        }
    }

    function curry() {
        if (!arguments.length) return this;
        var __method = this,
            args = slice.call(arguments, 0);
        return function () {
            var a = merge(args, arguments);
            return __method.apply(this, a);
        }
    }

    function delay(timeout) {
        var __method = this,
            args = slice.call(arguments, 1);
        timeout = timeout * 1000;
        return window.setTimeout(function () {
            return __method.apply(__method, args);
        }, timeout);
    }

    function defer() {
        var args = update([0.01], arguments);
        return this.delay.apply(this, args);
    }

    function wrap(wrapper) {
        var __method = this;
        return function () {
            var a = update([__method.bind(this)], arguments);
            return wrapper.apply(this, a);
        }
    }

    function methodize() {
        if (this._methodized) return this._methodized;
        var __method = this;
        return this._methodized = function () {
            var a = update([this], arguments);
            return __method.apply(null, a);
        };
    }
    var extensions = {
        argumentNames: argumentNames,
        bindAsEventListener: bindAsEventListener,
        curry: curry,
        delay: delay,
        defer: defer,
        wrap: wrap,
        methodize: methodize
    };
    if (!Function.prototype.bind)
        extensions.bind = bind;
    return extensions;
})());
(function (proto) {
    function toISOString() {
        return this.getUTCFullYear() + '-' +
            (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
            this.getUTCDate().toPaddedString(2) + 'T' +
            this.getUTCHours().toPaddedString(2) + ':' +
            this.getUTCMinutes().toPaddedString(2) + ':' +
            this.getUTCSeconds().toPaddedString(2) + 'Z';
    }

    function toJSON() {
        return this.toISOString();
    }
    if (!proto.toISOString) proto.toISOString = toISOString;
    if (!proto.toJSON) proto.toJSON = toJSON;
})(Date.prototype);
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function (str) {
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
    initialize: function (callback, frequency) {
        this.callback = callback;
        this.frequency = frequency;
        this.currentlyExecuting = false;
        this.registerCallback();
    },
    registerCallback: function () {
        this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
    },
    execute: function () {
        this.callback(this);
    },
    stop: function () {
        if (!this.timer) return;
        clearInterval(this.timer);
        this.timer = null;
    },
    onTimerEvent: function () {
        if (!this.currentlyExecuting) {
            try {
                this.currentlyExecuting = true;
                this.execute();
                this.currentlyExecuting = false;
            } catch (e) {
                this.currentlyExecuting = false;
                throw e;
            }
        }
    }
});
Object.extend(String, {
    interpret: function (value) {
        return value == null ? '' : String(value);
    },
    specialChar: {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '\\': '\\\\'
    }
});
Object.extend(String.prototype, (function () {
    var NATIVE_JSON_PARSE_SUPPORT = window.JSON && typeof JSON.parse === 'function' && JSON.parse('{"test": true}').test;

    function prepareReplacement(replacement) {
        if (Object.isFunction(replacement)) return replacement;
        var template = new Template(replacement);
        return function (match) {
            return template.evaluate(match)
        };
    }

    function gsub(pattern, replacement) {
        var result = '',
            source = this,
            match;
        replacement = prepareReplacement(replacement);
        if (Object.isString(pattern))
            pattern = RegExp.escape(pattern);
        if (!(pattern.length || pattern.source)) {
            replacement = replacement('');
            return replacement + source.split('').join(replacement) + replacement;
        }
        while (source.length > 0) {
            if (match = source.match(pattern)) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length);
            } else {
                result += source, source = '';
            }
        }
        return result;
    }

    function sub(pattern, replacement, count) {
        replacement = prepareReplacement(replacement);
        count = Object.isUndefined(count) ? 1 : count;
        return this.gsub(pattern, function (match) {
            if (--count < 0) return match[0];
            return replacement(match);
        });
    }

    function scan(pattern, iterator) {
        this.gsub(pattern, iterator);
        return String(this);
    }

    function truncate(length, truncation) {
        length = length || 30;
        truncation = Object.isUndefined(truncation) ? '...' : truncation;
        return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this);
    }

    function strip() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function stripTags() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }

    function stripScripts() {
        return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
    }

    function extractScripts() {
        var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
            matchOne = new RegExp(Prototype.ScriptFragment, 'im');
        return (this.match(matchAll) || []).map(function (scriptTag) {
            return (scriptTag.match(matchOne) || ['', ''])[1];
        });
    }

    function evalScripts() {
        return this.extractScripts().map(function (script) {
            return eval(script);
        });
    }

    function escapeHTML() {
        return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function unescapeHTML() {
        return this.stripTags().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }

    function toQueryParams(separator) {
        var match = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) return {};
        return match[1].split(separator || '&').inject({}, function (hash, pair) {
            if ((pair = pair.split('='))[0]) {
                var key = decodeURIComponent(pair.shift()),
                    value = pair.length > 1 ? pair.join('=') : pair[0];
                if (value != undefined) value = decodeURIComponent(value);
                if (key in hash) {
                    if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
                    hash[key].push(value);
                } else hash[key] = value;
            }
            return hash;
        });
    }

    function toArray() {
        return this.split('');
    }

    function succ() {
        return this.slice(0, this.length - 1) +
            String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
    }

    function times(count) {
        return count < 1 ? '' : new Array(count + 1).join(this);
    }

    function camelize() {
        return this.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

    function capitalize() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }

    function underscore() {
        return this.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
    }

    function dasherize() {
        return this.replace(/_/g, '-');
    }

    function inspect(useDoubleQuotes) {
        var escapedString = this.replace(/[\x00-\x1f\\]/g, function (character) {
            if (character in String.specialChar) {
                return String.specialChar[character];
            }
            return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
        });
        if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
        return "'" + escapedString.replace(/'/g, '\\\'') + "'";
    }

    function unfilterJSON(filter) {
        return this.replace(filter || Prototype.JSONFilter, '$1');
    }

    function isJSON() {
        var str = this;
        if (str.blank()) return false;
        str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
        str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        return (/^[\],:{}\s]*$/).test(str);
    }

    function evalJSON(sanitize) {
        var json = this.unfilterJSON(),
            cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        if (cx.test(json)) {
            json = json.replace(cx, function (a) {
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        try {
            if (!sanitize || json.isJSON()) return eval('(' + json + ')');
        } catch (e) {}
        throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
    }

    function parseJSON() {
        var json = this.unfilterJSON();
        return JSON.parse(json);
    }

    function include(pattern) {
        return this.indexOf(pattern) > -1;
    }

    function startsWith(pattern) {
        return this.lastIndexOf(pattern, 0) === 0;
    }

    function endsWith(pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.indexOf(pattern, d) === d;
    }

    function empty() {
        return this == '';
    }

    function blank() {
        return /^\s*$/.test(this);
    }

    function interpolate(object, pattern) {
        return new Template(this, pattern).evaluate(object);
    }
    return {
        gsub: gsub,
        sub: sub,
        scan: scan,
        truncate: truncate,
        strip: String.prototype.trim || strip,
        stripTags: stripTags,
        stripScripts: stripScripts,
        extractScripts: extractScripts,
        evalScripts: evalScripts,
        escapeHTML: escapeHTML,
        unescapeHTML: unescapeHTML,
        toQueryParams: toQueryParams,
        parseQuery: toQueryParams,
        toArray: toArray,
        succ: succ,
        times: times,
        camelize: camelize,
        capitalize: capitalize,
        underscore: underscore,
        dasherize: dasherize,
        inspect: inspect,
        unfilterJSON: unfilterJSON,
        isJSON: isJSON,
        evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
        include: include,
        startsWith: startsWith,
        endsWith: endsWith,
        empty: empty,
        blank: blank,
        interpolate: interpolate
    };
})());
var Template = Class.create({
    initialize: function (template, pattern) {
        this.template = template.toString();
        this.pattern = pattern || Template.Pattern;
    },
    evaluate: function (object) {
        if (object && Object.isFunction(object.toTemplateReplacements))
            object = object.toTemplateReplacements();
        return this.template.gsub(this.pattern, function (match) {
            if (object == null) return (match[1] + '');
            var before = match[1] || '';
            if (before == '\\') return match[2];
            var ctx = object,
                expr = match[3],
                pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            match = pattern.exec(expr);
            if (match == null) return before;
            while (match != null) {
                var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
                ctx = ctx[comp];
                if (null == ctx || '' == match[3]) break;
                expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
                match = pattern.exec(expr);
            }
            return before + String.interpret(ctx);
        });
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function () {
    function each(iterator, context) {
        try {
            this._each(iterator, context);
        } catch (e) {
            if (e != $break) throw e;
        }
        return this;
    }

    function eachSlice(number, iterator, context) {
        var index = -number,
            slices = [],
            array = this.toArray();
        if (number < 1) return array;
        while ((index += number) < array.length)
            slices.push(array.slice(index, index + number));
        return slices.collect(iterator, context);
    }

    function all(iterator, context) {
        iterator = iterator || Prototype.K;
        var result = true;
        this.each(function (value, index) {
            result = result && !! iterator.call(context, value, index, this);
            if (!result) throw $break;
        }, this);
        return result;
    }

    function any(iterator, context) {
        iterator = iterator || Prototype.K;
        var result = false;
        this.each(function (value, index) {
            if (result = !! iterator.call(context, value, index, this))
                throw $break;
        }, this);
        return result;
    }

    function collect(iterator, context) {
        iterator = iterator || Prototype.K;
        var results = [];
        this.each(function (value, index) {
            results.push(iterator.call(context, value, index, this));
        }, this);
        return results;
    }

    function detect(iterator, context) {
        var result;
        this.each(function (value, index) {
            if (iterator.call(context, value, index, this)) {
                result = value;
                throw $break;
            }
        }, this);
        return result;
    }

    function findAll(iterator, context) {
        var results = [];
        this.each(function (value, index) {
            if (iterator.call(context, value, index, this))
                results.push(value);
        }, this);
        return results;
    }

    function grep(filter, iterator, context) {
        iterator = iterator || Prototype.K;
        var results = [];
        if (Object.isString(filter))
            filter = new RegExp(RegExp.escape(filter));
        this.each(function (value, index) {
            if (filter.match(value))
                results.push(iterator.call(context, value, index, this));
        }, this);
        return results;
    }

    function include(object) {
        if (Object.isFunction(this.indexOf))
            if (this.indexOf(object) != -1) return true;
        var found = false;
        this.each(function (value) {
            if (value == object) {
                found = true;
                throw $break;
            }
        });
        return found;
    }

    function inGroupsOf(number, fillWith) {
        fillWith = Object.isUndefined(fillWith) ? null : fillWith;
        return this.eachSlice(number, function (slice) {
            while (slice.length < number) slice.push(fillWith);
            return slice;
        });
    }

    function inject(memo, iterator, context) {
        this.each(function (value, index) {
            memo = iterator.call(context, memo, value, index, this);
        }, this);
        return memo;
    }

    function invoke(method) {
        var args = $A(arguments).slice(1);
        return this.map(function (value) {
            return value[method].apply(value, args);
        });
    }

    function max(iterator, context) {
        iterator = iterator || Prototype.K;
        var result;
        this.each(function (value, index) {
            value = iterator.call(context, value, index, this);
            if (result == null || value >= result)
                result = value;
        }, this);
        return result;
    }

    function min(iterator, context) {
        iterator = iterator || Prototype.K;
        var result;
        this.each(function (value, index) {
            value = iterator.call(context, value, index, this);
            if (result == null || value < result)
                result = value;
        }, this);
        return result;
    }

    function partition(iterator, context) {
        iterator = iterator || Prototype.K;
        var trues = [],
            falses = [];
        this.each(function (value, index) {
            (iterator.call(context, value, index, this) ? trues : falses).push(value);
        }, this);
        return [trues, falses];
    }

    function pluck(property) {
        var results = [];
        this.each(function (value) {
            results.push(value[property]);
        });
        return results;
    }

    function reject(iterator, context) {
        var results = [];
        this.each(function (value, index) {
            if (!iterator.call(context, value, index, this))
                results.push(value);
        }, this);
        return results;
    }

    function sortBy(iterator, context) {
        return this.map(function (value, index) {
            return {
                value: value,
                criteria: iterator.call(context, value, index, this)
            };
        }, this).sort(function (left, right) {
            var a = left.criteria,
                b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }).pluck('value');
    }

    function toArray() {
        return this.map();
    }

    function zip() {
        var iterator = Prototype.K,
            args = $A(arguments);
        if (Object.isFunction(args.last()))
            iterator = args.pop();
        var collections = [this].concat(args).map($A);
        return this.map(function (value, index) {
            return iterator(collections.pluck(index));
        });
    }

    function size() {
        return this.toArray().length;
    }

    function inspect() {
        return '#<Enumerable:' + this.toArray().inspect() + '>';
    }
    return {
        each: each,
        eachSlice: eachSlice,
        all: all,
        every: all,
        any: any,
        some: any,
        collect: collect,
        map: collect,
        detect: detect,
        findAll: findAll,
        select: findAll,
        filter: findAll,
        grep: grep,
        include: include,
        member: include,
        inGroupsOf: inGroupsOf,
        inject: inject,
        invoke: invoke,
        max: max,
        min: min,
        partition: partition,
        pluck: pluck,
        reject: reject,
        sortBy: sortBy,
        toArray: toArray,
        entries: toArray,
        zip: zip,
        size: size,
        inspect: inspect,
        find: detect
    };
})();

function $A(iterable) {
    if (!iterable) return [];
    if ('toArray' in Object(iterable)) return iterable.toArray();
    var length = iterable.length || 0,
        results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
}

function $w(string) {
    if (!Object.isString(string)) return [];
    string = string.strip();
    return string ? string.split(/\s+/) : [];
}
Array.from = $A;
(function () {
    var arrayProto = Array.prototype,
        slice = arrayProto.slice,
        _each = arrayProto.forEach;

    function each(iterator, context) {
        for (var i = 0, length = this.length >>> 0; i < length; i++) {
            if (i in this) iterator.call(context, this[i], i, this);
        }
    }
    if (!_each) _each = each;

    function clear() {
        this.length = 0;
        return this;
    }

    function first() {
        return this[0];
    }

    function last() {
        return this[this.length - 1];
    }

    function compact() {
        return this.select(function (value) {
            return value != null;
        });
    }

    function flatten() {
        return this.inject([], function (array, value) {
            if (Object.isArray(value))
                return array.concat(value.flatten());
            array.push(value);
            return array;
        });
    }

    function without() {
        var values = slice.call(arguments, 0);
        return this.select(function (value) {
            return !values.include(value);
        });
    }

    function reverse(inline) {
        return (inline === false ? this.toArray() : this)._reverse();
    }

    function uniq(sorted) {
        return this.inject([], function (array, value, index) {
            if (0 == index || (sorted ? array.last() != value : !array.include(value)))
                array.push(value);
            return array;
        });
    }

    function intersect(array) {
        return this.uniq().findAll(function (item) {
            return array.indexOf(item) !== -1;
        });
    }

    function clone() {
        return slice.call(this, 0);
    }

    function size() {
        return this.length;
    }

    function inspect() {
        return '[' + this.map(Object.inspect).join(', ') + ']';
    }

    function indexOf(item, i) {
        if (this == null) throw new TypeError();
        var array = Object(this),
            length = array.length >>> 0;
        if (length === 0) return -1;
        i = Number(i);
        if (isNaN(i)) {
            i = 0;
        } else if (i !== 0 && isFinite(i)) {
            i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
        }
        if (i > length) return -1;
        var k = i >= 0 ? i : Math.max(length - Math.abs(i), 0);
        for (; k < length; k++)
            if (k in array && array[k] === item) return k;
        return -1;
    }

    function lastIndexOf(item, i) {
        if (this == null) throw new TypeError();
        var array = Object(this),
            length = array.length >>> 0;
        if (length === 0) return -1;
        if (!Object.isUndefined(i)) {
            i = Number(i);
            if (isNaN(i)) {
                i = 0;
            } else if (i !== 0 && isFinite(i)) {
                i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
            }
        } else {
            i = length;
        }
        var k = i >= 0 ? Math.min(i, length - 1) : length - Math.abs(i);
        for (; k >= 0; k--)
            if (k in array && array[k] === item) return k;
        return -1;
    }

    function concat(_) {
        var array = [],
            items = slice.call(arguments, 0),
            item, n = 0;
        items.unshift(this);
        for (var i = 0, length = items.length; i < length; i++) {
            item = items[i];
            if (Object.isArray(item) && !('callee' in item)) {
                for (var j = 0, arrayLength = item.length; j < arrayLength; j++) {
                    if (j in item) array[n] = item[j];
                    n++;
                }
            } else {
                array[n++] = item;
            }
        }
        array.length = n;
        return array;
    }

    function wrapNative(method) {
        return function () {
            if (arguments.length === 0) {
                return method.call(this, Prototype.K);
            } else if (arguments[0] === undefined) {
                var args = slice.call(arguments, 1);
                args.unshift(Prototype.K);
                return method.apply(this, args);
            } else {
                return method.apply(this, arguments);
            }
        };
    }

    function map(iterator) {
        if (this == null) throw new TypeError();
        iterator = iterator || Prototype.K;
        var object = Object(this);
        var results = [],
            context = arguments[1],
            n = 0;
        for (var i = 0, length = object.length >>> 0; i < length; i++) {
            if (i in object) {
                results[n] = iterator.call(context, object[i], i, object);
            }
            n++;
        }
        results.length = n;
        return results;
    }
    if (arrayProto.map) {
        map = wrapNative(Array.prototype.map);
    }

    function filter(iterator) {
        if (this == null || !Object.isFunction(iterator))
            throw new TypeError();
        var object = Object(this);
        var results = [],
            context = arguments[1],
            value;
        for (var i = 0, length = object.length >>> 0; i < length; i++) {
            if (i in object) {
                value = object[i];
                if (iterator.call(context, value, i, object)) {
                    results.push(value);
                }
            }
        }
        return results;
    }
    if (arrayProto.filter) {
        filter = Array.prototype.filter;
    }

    function some(iterator) {
        if (this == null) throw new TypeError();
        iterator = iterator || Prototype.K;
        var context = arguments[1];
        var object = Object(this);
        for (var i = 0, length = object.length >>> 0; i < length; i++) {
            if (i in object && iterator.call(context, object[i], i, object)) {
                return true;
            }
        }
        return false;
    }
    if (arrayProto.some) {
        var some = wrapNative(Array.prototype.some);
    }

    function every(iterator) {
        if (this == null) throw new TypeError();
        iterator = iterator || Prototype.K;
        var context = arguments[1];
        var object = Object(this);
        for (var i = 0, length = object.length >>> 0; i < length; i++) {
            if (i in object && !iterator.call(context, object[i], i, object)) {
                return false;
            }
        }
        return true;
    }
    if (arrayProto.every) {
        var every = wrapNative(Array.prototype.every);
    }
    var _reduce = arrayProto.reduce;

    function inject(memo, iterator) {
        iterator = iterator || Prototype.K;
        var context = arguments[2];
        return _reduce.call(this, iterator.bind(context), memo);
    }
    if (!arrayProto.reduce) {
        var inject = Enumerable.inject;
    }
    Object.extend(arrayProto, Enumerable);
    if (!arrayProto._reverse)
        arrayProto._reverse = arrayProto.reverse;
    Object.extend(arrayProto, {
        _each: _each,
        map: map,
        collect: map,
        select: filter,
        filter: filter,
        findAll: filter,
        some: some,
        any: some,
        every: every,
        all: every,
        inject: inject,
        clear: clear,
        first: first,
        last: last,
        compact: compact,
        flatten: flatten,
        without: without,
        reverse: reverse,
        uniq: uniq,
        intersect: intersect,
        clone: clone,
        toArray: clone,
        size: size,
        inspect: inspect
    });
    var CONCAT_ARGUMENTS_BUGGY = (function () {
        return [].concat(arguments)[0][0] !== 1;
    })(1, 2);
    if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;
    if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
    if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();

function $H(object) {
    return new Hash(object);
};
var Hash = Class.create(Enumerable, (function () {
    function initialize(object) {
        this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
    }

    function _each(iterator, context) {
        for (var key in this._object) {
            var value = this._object[key],
                pair = [key, value];
            pair.key = key;
            pair.value = value;
            iterator.call(context, pair);
        }
    }

    function set(key, value) {
        return this._object[key] = value;
    }

    function get(key) {
        if (this._object[key] !== Object.prototype[key])
            return this._object[key];
    }

    function unset(key) {
        var value = this._object[key];
        delete this._object[key];
        return value;
    }

    function toObject() {
        return Object.clone(this._object);
    }

    function keys() {
        return this.pluck('key');
    }

    function values() {
        return this.pluck('value');
    }

    function index(value) {
        var match = this.detect(function (pair) {
            return pair.value === value;
        });
        return match && match.key;
    }

    function merge(object) {
        return this.clone().update(object);
    }

    function update(object) {
        return new Hash(object).inject(this, function (result, pair) {
            result.set(pair.key, pair.value);
            return result;
        });
    }

    function toQueryPair(key, value) {
        if (Object.isUndefined(value)) return key;
        var value = String.interpret(value);
        value = value.gsub(/(\r)?\n/, '\r\n');
        value = encodeURIComponent(value);
        value = value.gsub(/%20/, '+');
        return key + '=' + value;
    }

    function toQueryString() {
        return this.inject([], function (results, pair) {
            var key = encodeURIComponent(pair.key),
                values = pair.value;
            if (values && typeof values == 'object') {
                if (Object.isArray(values)) {
                    var queryValues = [];
                    for (var i = 0, len = values.length, value; i < len; i++) {
                        value = values[i];
                        queryValues.push(toQueryPair(key, value));
                    }
                    return results.concat(queryValues);
                }
            } else results.push(toQueryPair(key, values));
            return results;
        }).join('&');
    }

    function inspect() {
        return '#<Hash:{' + this.map(function (pair) {
            return pair.map(Object.inspect).join(': ');
        }).join(', ') + '}>';
    }

    function clone() {
        return new Hash(this);
    }
    return {
        initialize: initialize,
        _each: _each,
        set: set,
        get: get,
        unset: unset,
        toObject: toObject,
        toTemplateReplacements: toObject,
        keys: keys,
        values: values,
        index: index,
        merge: merge,
        update: update,
        toQueryString: toQueryString,
        inspect: inspect,
        toJSON: toObject,
        clone: clone
    };
})());
Hash.from = $H;
Object.extend(Number.prototype, (function () {
    function toColorPart() {
        return this.toPaddedString(2, 16);
    }

    function succ() {
        return this + 1;
    }

    function times(iterator, context) {
        $R(0, this, true).each(iterator, context);
        return this;
    }

    function toPaddedString(length, radix) {
        var string = this.toString(radix || 10);
        return '0'.times(length - string.length) + string;
    }

    function abs() {
        return Math.abs(this);
    }

    function round() {
        return Math.round(this);
    }

    function ceil() {
        return Math.ceil(this);
    }

    function floor() {
        return Math.floor(this);
    }
    return {
        toColorPart: toColorPart,
        succ: succ,
        times: times,
        toPaddedString: toPaddedString,
        abs: abs,
        round: round,
        ceil: ceil,
        floor: floor
    };
})());

function $R(start, end, exclusive) {
    return new ObjectRange(start, end, exclusive);
}
var ObjectRange = Class.create(Enumerable, (function () {
    function initialize(start, end, exclusive) {
        this.start = start;
        this.end = end;
        this.exclusive = exclusive;
    }

    function _each(iterator, context) {
        var value = this.start;
        while (this.include(value)) {
            iterator.call(context, value);
            value = value.succ();
        }
    }

    function include(value) {
        if (value < this.start)
            return false;
        if (this.exclusive)
            return value < this.end;
        return value <= this.end;
    }
    return {
        initialize: initialize,
        _each: _each,
        include: include
    };
})());
var Abstract = {};
var Try = {
    these: function () {
        var returnValue;
        for (var i = 0, length = arguments.length; i < length; i++) {
            var lambda = arguments[i];
            try {
                returnValue = lambda();
                break;
            } catch (e) {}
        }
        return returnValue;
    }
};
var Ajax = {
    getTransport: function () {
        return Try.these(function () {
            return new XMLHttpRequest()
        }, function () {
            return new ActiveXObject('Msxml2.XMLHTTP')
        }, function () {
            return new ActiveXObject('Microsoft.XMLHTTP')
        }) || false;
    },
    activeRequestCount: 0
};
Ajax.Responders = {
    responders: [],
    _each: function (iterator, context) {
        this.responders._each(iterator, context);
    },
    register: function (responder) {
        if (!this.include(responder))
            this.responders.push(responder);
    },
    unregister: function (responder) {
        this.responders = this.responders.without(responder);
    },
    dispatch: function (callback, request, transport, json) {
        this.each(function (responder) {
            if (Object.isFunction(responder[callback])) {
                try {
                    responder[callback].apply(responder, [request, transport, json]);
                } catch (e) {}
            }
        });
    }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
    onCreate: function () {
        Ajax.activeRequestCount++
    },
    onComplete: function () {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function (options) {
        this.options = {
            method: 'post',
            asynchronous: true,
            contentType: 'application/x-www-form-urlencoded',
            encoding: 'UTF-8',
            parameters: '',
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, options || {});
        this.options.method = this.options.method.toLowerCase();
        if (Object.isHash(this.options.parameters))
            this.options.parameters = this.options.parameters.toObject();
    }
});
Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
    initialize: function ($super, url, options) {
        $super(options);
        this.transport = Ajax.getTransport();
        this.request(url);
    },
    request: function (url) {
        this.url = url;
        this.method = this.options.method;
        var params = Object.isString(this.options.parameters) ? this.options.parameters : Object.toQueryString(this.options.parameters);
        if (!['get', 'post'].include(this.method)) {
            params += (params ? '&' : '') + "_method=" + this.method;
            this.method = 'post';
        }
        if (params && this.method === 'get') {
            this.url += (this.url.include('?') ? '&' : '?') + params;
        }
        this.parameters = params.toQueryParams();
        try {
            var response = new Ajax.Response(this);
            if (this.options.onCreate) this.options.onCreate(response);
            Ajax.Responders.dispatch('onCreate', this, response);
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();
            this.body = this.method == 'post' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);
            if (!this.options.asynchronous && this.transport.overrideMimeType)
                this.onStateChange();
        } catch (e) {
            this.dispatchException(e);
        }
    },
    onStateChange: function () {
        var readyState = this.transport.readyState;
        if (readyState > 1 && !((readyState == 4) && this._complete))
            this.respondToReadyState(this.transport.readyState);
    },
    setRequestHeaders: function () {
        var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Prototype-Version': Prototype.Version,
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        };
        if (this.method == 'post') {
            headers['Content-type'] = this.options.contentType +
                (this.options.encoding ? '; charset=' + this.options.encoding : '');
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005)
                headers['Connection'] = 'close';
        }
        if (typeof this.options.requestHeaders == 'object') {
            var extras = this.options.requestHeaders;
            if (Object.isFunction(extras.push))
                for (var i = 0, length = extras.length; i < length; i += 2)
                    headers[extras[i]] = extras[i + 1];
            else
                $H(extras).each(function (pair) {
                    headers[pair.key] = pair.value
                });
        }
        for (var name in headers)
            this.transport.setRequestHeader(name, headers[name]);
    },
    success: function () {
        var status = this.getStatus();
        return !status || (status >= 200 && status < 300) || status == 304;
    },
    getStatus: function () {
        try {
            if (this.transport.status === 1223) return 204;
            return this.transport.status || 0;
        } catch (e) {
            return 0
        }
    },
    respondToReadyState: function (readyState) {
        var state = Ajax.Request.Events[readyState],
            response = new Ajax.Response(this);
        if (state == 'Complete') {
            try {
                this._complete = true;
                (this.options['on' + response.status] || this.options['on' + (this.success() ? 'Success' : 'Failure')] || Prototype.emptyFunction)(response, response.headerJSON);
            } catch (e) {
                this.dispatchException(e);
            }
            var contentType = response.getHeader('Content-type');
            if (this.options.evalJS == 'force' || (this.options.evalJS && this.isSameOrigin() && contentType && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
                this.evalResponse();
        }
        try {
            (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
            Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
        } catch (e) {
            this.dispatchException(e);
        }
        if (state == 'Complete') {
            this.transport.onreadystatechange = Prototype.emptyFunction;
        }
    },
    isSameOrigin: function () {
        var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ':' + location.port : ''
        }));
    },
    getHeader: function (name) {
        try {
            return this.transport.getResponseHeader(name) || null;
        } catch (e) {
            return null;
        }
    },
    evalResponse: function () {
        try {
            return eval((this.transport.responseText || '').unfilterJSON());
        } catch (e) {
            this.dispatchException(e);
        }
    },
    dispatchException: function (exception) {
        (this.options.onException || Prototype.emptyFunction)(this, exception);
        Ajax.Responders.dispatch('onException', this, exception);
    }
});
Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
Ajax.Response = Class.create({
    initialize: function (request) {
        this.request = request;
        var transport = this.transport = request.transport,
            readyState = this.readyState = transport.readyState;
        if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = String.interpret(transport.responseText);
            this.headerJSON = this._getHeaderJSON();
        }
        if (readyState == 4) {
            var xml = transport.responseXML;
            this.responseXML = Object.isUndefined(xml) ? null : xml;
            this.responseJSON = this._getResponseJSON();
        }
    },
    status: 0,
    statusText: '',
    getStatus: Ajax.Request.prototype.getStatus,
    getStatusText: function () {
        try {
            return this.transport.statusText || '';
        } catch (e) {
            return ''
        }
    },
    getHeader: Ajax.Request.prototype.getHeader,
    getAllHeaders: function () {
        try {
            return this.getAllResponseHeaders();
        } catch (e) {
            return null
        }
    },
    getResponseHeader: function (name) {
        return this.transport.getResponseHeader(name);
    },
    getAllResponseHeaders: function () {
        return this.transport.getAllResponseHeaders();
    },
    _getHeaderJSON: function () {
        var json = this.getHeader('X-JSON');
        if (!json) return null;
        try {
            json = decodeURIComponent(escape(json));
        } catch (e) {}
        try {
            return json.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    },
    _getResponseJSON: function () {
        var options = this.request.options;
        if (!options.evalJSON || (options.evalJSON != 'force' && !(this.getHeader('Content-type') || '').include('application/json')) || this.responseText.blank())
            return null;
        try {
            return this.responseText.evalJSON(options.sanitizeJSON || !this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    }
});
Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function ($super, container, url, options) {
        this.container = {
            success: (container.success || container),
            failure: (container.failure || (container.success ? null : container))
        };
        options = Object.clone(options);
        var onComplete = options.onComplete;
        options.onComplete = (function (response, json) {
            this.updateContent(response.responseText);
            if (Object.isFunction(onComplete)) onComplete(response, json);
        }).bind(this);
        $super(url, options);
    },
    updateContent: function (responseText) {
        var receiver = this.container[this.success() ? 'success' : 'failure'],
            options = this.options;
        if (!options.evalScripts) responseText = responseText.stripScripts();
        if (receiver = $(receiver)) {
            if (options.insertion) {
                if (Object.isString(options.insertion)) {
                    var insertion = {};
                    insertion[options.insertion] = responseText;
                    receiver.insert(insertion);
                } else options.insertion(receiver, responseText);
            } else receiver.update(responseText);
        }
    }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function ($super, container, url, options) {
        $super(options);
        this.onComplete = this.options.onComplete;
        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);
        this.updater = {};
        this.container = container;
        this.url = url;
        this.start();
    },
    start: function () {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent();
    },
    stop: function () {
        this.updater.options.onComplete = undefined;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
    },
    updateComplete: function (response) {
        if (this.options.decay) {
            this.decay = (response.responseText == this.lastText ? this.decay * this.options.decay : 1);
            this.lastText = response.responseText;
        }
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
    },
    onTimerEvent: function () {
        this.updater = new Ajax.Updater(this.container, this.url, this.options);
    }
});
(function (GLOBAL) {
    var UNDEFINED;
    var SLICE = Array.prototype.slice;
    var DIV = document.createElement('div');

    function $(element) {
        if (arguments.length > 1) {
            for (var i = 0, elements = [], length = arguments.length; i < length; i++)
                elements.push($(arguments[i]));
            return elements;
        }
        if (Object.isString(element))
            element = document.getElementById(element);
        return Element.extend(element);
    }
    GLOBAL.$ = $;
    if (!GLOBAL.Node) GLOBAL.Node = {};
    if (!GLOBAL.Node.ELEMENT_NODE) {
        Object.extend(GLOBAL.Node, {
            ELEMENT_NODE: 1,
            ATTRIBUTE_NODE: 2,
            TEXT_NODE: 3,
            CDATA_SECTION_NODE: 4,
            ENTITY_REFERENCE_NODE: 5,
            ENTITY_NODE: 6,
            PROCESSING_INSTRUCTION_NODE: 7,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9,
            DOCUMENT_TYPE_NODE: 10,
            DOCUMENT_FRAGMENT_NODE: 11,
            NOTATION_NODE: 12
        });
    }
    var ELEMENT_CACHE = {};

    function shouldUseCreationCache(tagName, attributes) {
        if (tagName === 'select') return false;
        if ('type' in attributes) return false;
        return true;
    }
    var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function () {
        try {
            var el = document.createElement('<input name="x">');
            return el.tagName.toLowerCase() === 'input' && el.name === 'x';
        } catch (err) {
            return false;
        }
    })();
    var oldElement = GLOBAL.Element;

    function Element(tagName, attributes) {
        attributes = attributes || {};
        tagName = tagName.toLowerCase();
        if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
            tagName = '<' + tagName + ' name="' + attributes.name + '">';
            delete attributes.name;
            return Element.writeAttribute(document.createElement(tagName), attributes);
        }
        if (!ELEMENT_CACHE[tagName])
            ELEMENT_CACHE[tagName] = Element.extend(document.createElement(tagName));
        var node = shouldUseCreationCache(tagName, attributes) ? ELEMENT_CACHE[tagName].cloneNode(false) : document.createElement(tagName);
        return Element.writeAttribute(node, attributes);
    }
    GLOBAL.Element = Element;
    Object.extend(GLOBAL.Element, oldElement || {});
    if (oldElement) GLOBAL.Element.prototype = oldElement.prototype;
    Element.Methods = {
        ByTag: {},
        Simulated: {}
    };
    var methods = {};
    var INSPECT_ATTRIBUTES = {
        id: 'id',
        className: 'class'
    };

    function inspect(element) {
        element = $(element);
        var result = '<' + element.tagName.toLowerCase();
        var attribute, value;
        for (var property in INSPECT_ATTRIBUTES) {
            attribute = INSPECT_ATTRIBUTES[property];
            value = (element[property] || '').toString();
            if (value) result += ' ' + attribute + '=' + value.inspect(true);
        }
        return result + '>';
    }
    methods.inspect = inspect;

    function visible(element) {
        return $(element).style.display !== 'none';
    }

    function toggle(element, bool) {
        element = $(element);
        if (Object.isUndefined(bool))
            bool = !Element.visible(element);
        Element[bool ? 'show' : 'hide'](element);
        return element;
    }

    function hide(element) {
        element = $(element);
        element.style.display = 'none';
        return element;
    }

    function show(element) {
        element = $(element);
        element.style.display = '';
        return element;
    }
    Object.extend(methods, {
        visible: visible,
        toggle: toggle,
        hide: hide,
        show: show
    });

    function remove(element) {
        element = $(element);
        element.parentNode.removeChild(element);
        return element;
    }
    var SELECT_ELEMENT_INNERHTML_BUGGY = (function () {
        var el = document.createElement("select"),
            isBuggy = true;
        el.innerHTML = "<option value=\"test\">test</option>";
        if (el.options && el.options[0]) {
            isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
        }
        el = null;
        return isBuggy;
    })();
    var TABLE_ELEMENT_INNERHTML_BUGGY = (function () {
        try {
            var el = document.createElement("table");
            if (el && el.tBodies) {
                el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
                var isBuggy = typeof el.tBodies[0] == "undefined";
                el = null;
                return isBuggy;
            }
        } catch (e) {
            return true;
        }
    })();
    var LINK_ELEMENT_INNERHTML_BUGGY = (function () {
        try {
            var el = document.createElement('div');
            el.innerHTML = "<link />";
            var isBuggy = (el.childNodes.length === 0);
            el = null;
            return isBuggy;
        } catch (e) {
            return true;
        }
    })();
    var ANY_INNERHTML_BUGGY = SELECT_ELEMENT_INNERHTML_BUGGY || TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;
    var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
        var s = document.createElement("script"),
            isBuggy = false;
        try {
            s.appendChild(document.createTextNode(""));
            isBuggy = !s.firstChild || s.firstChild && s.firstChild.nodeType !== 3;
        } catch (e) {
            isBuggy = true;
        }
        s = null;
        return isBuggy;
    })();

    function update(element, content) {
        element = $(element);
        var descendants = element.getElementsByTagName('*'),
            i = descendants.length;
        while (i--) purgeElement(descendants[i]);
        if (content && content.toElement)
            content = content.toElement();
        if (Object.isElement(content))
            return element.update().insert(content);
        content = Object.toHTML(content);
        var tagName = element.tagName.toUpperCase();
        if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
            element.text = content;
            return element;
        }
        if (ANY_INNERHTML_BUGGY) {
            if (tagName in INSERTION_TRANSLATIONS.tags) {
                while (element.firstChild)
                    element.removeChild(element.firstChild);
                var nodes = getContentFromAnonymousElement(tagName, content.stripScripts());
                for (var i = 0, node; node = nodes[i]; i++)
                    element.appendChild(node);
            } else if (LINK_ELEMENT_INNERHTML_BUGGY && Object.isString(content) && content.indexOf('<link') > -1) {
                while (element.firstChild)
                    element.removeChild(element.firstChild);
                var nodes = getContentFromAnonymousElement(tagName, content.stripScripts(), true);
                for (var i = 0, node; node = nodes[i]; i++)
                    element.appendChild(node);
            } else {
                element.innerHTML = content.stripScripts();
            }
        } else {
            element.innerHTML = content.stripScripts();
        }
        content.evalScripts.bind(content).defer();
        return element;
    }

    function replace(element, content) {
        element = $(element);
        if (content && content.toElement) {
            content = content.toElement();
        } else if (!Object.isElement(content)) {
            content = Object.toHTML(content);
            var range = element.ownerDocument.createRange();
            range.selectNode(element);
            content.evalScripts.bind(content).defer();
            content = range.createContextualFragment(content.stripScripts());
        }
        element.parentNode.replaceChild(content, element);
        return element;
    }
    var INSERTION_TRANSLATIONS = {
        before: function (element, node) {
            element.parentNode.insertBefore(node, element);
        },
        top: function (element, node) {
            element.insertBefore(node, element.firstChild);
        },
        bottom: function (element, node) {
            element.appendChild(node);
        },
        after: function (element, node) {
            element.parentNode.insertBefore(node, element.nextSibling);
        },
        tags: {
            TABLE: ['<table>', '</table>', 1],
            TBODY: ['<table><tbody>', '</tbody></table>', 2],
            TR: ['<table><tbody><tr>', '</tr></tbody></table>', 3],
            TD: ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
            SELECT: ['<select>', '</select>', 1]
        }
    };
    var tags = INSERTION_TRANSLATIONS.tags;
    Object.extend(tags, {
        THEAD: tags.TBODY,
        TFOOT: tags.TBODY,
        TH: tags.TD
    });

    function replace_IE(element, content) {
        element = $(element);
        if (content && content.toElement)
            content = content.toElement();
        if (Object.isElement(content)) {
            element.parentNode.replaceChild(content, element);
            return element;
        }
        content = Object.toHTML(content);
        var parent = element.parentNode,
            tagName = parent.tagName.toUpperCase();
        if (tagName in INSERTION_TRANSLATIONS.tags) {
            var nextSibling = Element.next(element);
            var fragments = getContentFromAnonymousElement(tagName, content.stripScripts());
            parent.removeChild(element);
            var iterator;
            if (nextSibling)
                iterator = function (node) {
                    parent.insertBefore(node, nextSibling)
                };
            else
                iterator = function (node) {
                    parent.appendChild(node);
                }
            fragments.each(iterator);
        } else {
            element.outerHTML = content.stripScripts();
        }
        content.evalScripts.bind(content).defer();
        return element;
    }
    if ('outerHTML' in document.documentElement)
        replace = replace_IE;

    function isContent(content) {
        if (Object.isUndefined(content) || content === null) return false;
        if (Object.isString(content) || Object.isNumber(content)) return true;
        if (Object.isElement(content)) return true;
        if (content.toElement || content.toHTML) return true;
        return false;
    }

    function insertContentAt(element, content, position) {
        position = position.toLowerCase();
        var method = INSERTION_TRANSLATIONS[position];
        if (content && content.toElement) content = content.toElement();
        if (Object.isElement(content)) {
            method(element, content);
            return element;
        }
        content = Object.toHTML(content);
        var tagName = ((position === 'before' || position === 'after') ? element.parentNode : element).tagName.toUpperCase();
        var childNodes = getContentFromAnonymousElement(tagName, content.stripScripts());
        if (position === 'top' || position === 'after') childNodes.reverse();
        for (var i = 0, node; node = childNodes[i]; i++)
            method(element, node);
        content.evalScripts.bind(content).defer();
    }

    function insert(element, insertions) {
        element = $(element);
        if (isContent(insertions))
            insertions = {
                bottom: insertions
            };
        for (var position in insertions)
            insertContentAt(element, insertions[position], position);
        return element;
    }

    function wrap(element, wrapper, attributes) {
        element = $(element);
        if (Object.isElement(wrapper)) {
            $(wrapper).writeAttribute(attributes || {});
        } else if (Object.isString(wrapper)) {
            wrapper = new Element(wrapper, attributes);
        } else {
            wrapper = new Element('div', wrapper);
        }
        if (element.parentNode)
            element.parentNode.replaceChild(wrapper, element);
        wrapper.appendChild(element);
        return wrapper;
    }

    function cleanWhitespace(element) {
        element = $(element);
        var node = element.firstChild;
        while (node) {
            var nextNode = node.nextSibling;
            if (node.nodeType === Node.TEXT_NODE && !/\S/.test(node.nodeValue))
                element.removeChild(node);
            node = nextNode;
        }
        return element;
    }

    function empty(element) {
        return $(element).innerHTML.blank();
    }

    function getContentFromAnonymousElement(tagName, html, force) {
        var t = INSERTION_TRANSLATIONS.tags[tagName],
            div = DIV;
        var workaround = !! t;
        if (!workaround && force) {
            workaround = true;
            t = ['', '', 0];
        }
        if (workaround) {
            div.innerHTML = '&#160;' + t[0] + html + t[1];
            div.removeChild(div.firstChild);
            for (var i = t[2]; i--;)
                div = div.firstChild;
        } else {
            div.innerHTML = html;
        }
        return $A(div.childNodes);
    }

    function clone(element, deep) {
        if (!(element = $(element))) return;
        var clone = element.cloneNode(deep);
        if (!HAS_UNIQUE_ID_PROPERTY) {
            clone._prototypeUID = UNDEFINED;
            if (deep) {
                var descendants = Element.select(clone, '*'),
                    i = descendants.length;
                while (i--)
                    descendants[i]._prototypeUID = UNDEFINED;
            }
        }
        return Element.extend(clone);
    }

    function purgeElement(element) {
        var uid = getUniqueElementID(element);
        if (uid) {
            Element.stopObserving(element);
            if (!HAS_UNIQUE_ID_PROPERTY)
                element._prototypeUID = UNDEFINED;
            delete Element.Storage[uid];
        }
    }

    function purgeCollection(elements) {
        var i = elements.length;
        while (i--)
            purgeElement(elements[i]);
    }

    function purgeCollection_IE(elements) {
        var i = elements.length,
            element, uid;
        while (i--) {
            element = elements[i];
            uid = getUniqueElementID(element);
            delete Element.Storage[uid];
            delete Event.cache[uid];
        }
    }
    if (HAS_UNIQUE_ID_PROPERTY) {
        purgeCollection = purgeCollection_IE;
    }

    function purge(element) {
        if (!(element = $(element))) return;
        purgeElement(element);
        var descendants = element.getElementsByTagName('*'),
            i = descendants.length;
        while (i--) purgeElement(descendants[i]);
        return null;
    }
    Object.extend(methods, {
        remove: remove,
        update: update,
        replace: replace,
        insert: insert,
        wrap: wrap,
        cleanWhitespace: cleanWhitespace,
        empty: empty,
        clone: clone,
        purge: purge
    });

    function recursivelyCollect(element, property, maximumLength) {
        element = $(element);
        maximumLength = maximumLength || -1;
        var elements = [];
        while (element = element[property]) {
            if (element.nodeType === Node.ELEMENT_NODE)
                elements.push(Element.extend(element));
            if (elements.length === maximumLength) break;
        }
        return elements;
    }

    function ancestors(element) {
        return recursivelyCollect(element, 'parentNode');
    }

    function descendants(element) {
        return Element.select(element, '*');
    }

    function firstDescendant(element) {
        element = $(element).firstChild;
        while (element && element.nodeType !== Node.ELEMENT_NODE)
            element = element.nextSibling;
        return $(element);
    }

    function immediateDescendants(element) {
        var results = [],
            child = $(element).firstChild;
        while (child) {
            if (child.nodeType === Node.ELEMENT_NODE)
                results.push(Element.extend(child));
            child = child.nextSibling;
        }
        return results;
    }

    function previousSiblings(element) {
        return recursivelyCollect(element, 'previousSibling');
    }

    function nextSiblings(element) {
        return recursivelyCollect(element, 'nextSibling');
    }

    function siblings(element) {
        element = $(element);
        var previous = previousSiblings(element),
            next = nextSiblings(element);
        return previous.reverse().concat(next);
    }

    function match(element, selector) {
        element = $(element);
        if (Object.isString(selector))
            return Prototype.Selector.match(element, selector);
        return selector.match(element);
    }

    function _recursivelyFind(element, property, expression, index) {
        element = $(element), expression = expression || 0, index = index || 0;
        if (Object.isNumber(expression)) {
            index = expression, expression = null;
        }
        while (element = element[property]) {
            if (element.nodeType !== 1) continue;
            if (expression && !Prototype.Selector.match(element, expression))
                continue;
            if (--index >= 0) continue;
            return Element.extend(element);
        }
    }

    function up(element, expression, index) {
        element = $(element);
        if (arguments.length === 1) return $(element.parentNode);
        return _recursivelyFind(element, 'parentNode', expression, index);
    }

    function down(element, expression, index) {
        element = $(element), expression = expression || 0, index = index || 0;
        if (Object.isNumber(expression))
            index = expression, expression = '*';
        var node = Prototype.Selector.select(expression, element)[index];
        return Element.extend(node);
    }

    function previous(element, expression, index) {
        return _recursivelyFind(element, 'previousSibling', expression, index);
    }

    function next(element, expression, index) {
        return _recursivelyFind(element, 'nextSibling', expression, index);
    }

    function select(element) {
        element = $(element);
        var expressions = SLICE.call(arguments, 1).join(', ');
        return Prototype.Selector.select(expressions, element);
    }

    function adjacent(element) {
        element = $(element);
        var expressions = SLICE.call(arguments, 1).join(', ');
        var siblings = Element.siblings(element),
            results = [];
        for (var i = 0, sibling; sibling = siblings[i]; i++) {
            if (Prototype.Selector.match(sibling, expressions))
                results.push(sibling);
        }
        return results;
    }

    function descendantOf_DOM(element, ancestor) {
        element = $(element), ancestor = $(ancestor);
        while (element = element.parentNode)
            if (element === ancestor) return true;
        return false;
    }

    function descendantOf_contains(element, ancestor) {
        element = $(element), ancestor = $(ancestor);
        if (!ancestor.contains) return descendantOf_DOM(element, ancestor);
        return ancestor.contains(element) && ancestor !== element;
    }

    function descendantOf_compareDocumentPosition(element, ancestor) {
        element = $(element), ancestor = $(ancestor);
        return (element.compareDocumentPosition(ancestor) & 8) === 8;
    }
    var descendantOf;
    if (DIV.compareDocumentPosition) {
        descendantOf = descendantOf_compareDocumentPosition;
    } else if (DIV.contains) {
        descendantOf = descendantOf_contains;
    } else {
        descendantOf = descendantOf_DOM;
    }
    Object.extend(methods, {
        recursivelyCollect: recursivelyCollect,
        ancestors: ancestors,
        descendants: descendants,
        firstDescendant: firstDescendant,
        immediateDescendants: immediateDescendants,
        previousSiblings: previousSiblings,
        nextSiblings: nextSiblings,
        siblings: siblings,
        match: match,
        up: up,
        down: down,
        previous: previous,
        next: next,
        select: select,
        adjacent: adjacent,
        descendantOf: descendantOf,
        getElementsBySelector: select,
        childElements: immediateDescendants
    });
    var idCounter = 1;

    function identify(element) {
        element = $(element);
        var id = Element.readAttribute(element, 'id');
        if (id) return id;
        do {
            id = 'anonymous_element_' + idCounter++
        } while ($(id));
        Element.writeAttribute(element, 'id', id);
        return id;
    }

    function readAttribute(element, name) {
        return $(element).getAttribute(name);
    }

    function readAttribute_IE(element, name) {
        element = $(element);
        var table = ATTRIBUTE_TRANSLATIONS.read;
        if (table.values[name])
            return table.values[name](element, name);
        if (table.names[name]) name = table.names[name];
        if (name.include(':')) {
            if (!element.attributes || !element.attributes[name]) return null;
            return element.attributes[name].value;
        }
        return element.getAttribute(name);
    }

    function readAttribute_Opera(element, name) {
        if (name === 'title') return element.title;
        return element.getAttribute(name);
    }
    var PROBLEMATIC_ATTRIBUTE_READING = (function () {
        DIV.setAttribute('onclick', Prototype.emptyFunction);
        var value = DIV.getAttribute('onclick');
        var isFunction = (typeof value === 'function');
        DIV.removeAttribute('onclick');
        return isFunction;
    })();
    if (PROBLEMATIC_ATTRIBUTE_READING) {
        readAttribute = readAttribute_IE;
    } else if (Prototype.Browser.Opera) {
        readAttribute = readAttribute_Opera;
    }

    function writeAttribute(element, name, value) {
        element = $(element);
        var attributes = {}, table = ATTRIBUTE_TRANSLATIONS.write;
        if (typeof name === 'object') {
            attributes = name;
        } else {
            attributes[name] = Object.isUndefined(value) ? true : value;
        }
        for (var attr in attributes) {
            name = table.names[attr] || attr;
            value = attributes[attr];
            if (table.values[attr])
                name = table.values[attr](element, value);
            if (value === false || value === null)
                element.removeAttribute(name);
            else if (value === true)
                element.setAttribute(name, name);
            else element.setAttribute(name, value);
        }
        return element;
    }

    function hasAttribute(element, attribute) {
        attribute = ATTRIBUTE_TRANSLATIONS.has[attribute] || attribute;
        var node = $(element).getAttributeNode(attribute);
        return !!(node && node.specified);
    }
    GLOBAL.Element.Methods.Simulated.hasAttribute = hasAttribute;

    function classNames(element) {
        return new Element.ClassNames(element);
    }
    var regExpCache = {};

    function getRegExpForClassName(className) {
        if (regExpCache[className]) return regExpCache[className];
        var re = new RegExp("(^|\\s+)" + className + "(\\s+|$)");
        regExpCache[className] = re;
        return re;
    }

    function hasClassName(element, className) {
        if (!(element = $(element))) return;
        var elementClassName = element.className;
        if (elementClassName.length === 0) return false;
        if (elementClassName === className) return true;
        return getRegExpForClassName(className).test(elementClassName);
    }

    function addClassName(element, className) {
        if (!(element = $(element))) return;
        if (!hasClassName(element, className))
            element.className += (element.className ? ' ' : '') + className;
        return element;
    }

    function removeClassName(element, className) {
        if (!(element = $(element))) return;
        element.className = element.className.replace(getRegExpForClassName(className), ' ').strip();
        return element;
    }

    function toggleClassName(element, className, bool) {
        if (!(element = $(element))) return;
        if (Object.isUndefined(bool))
            bool = !hasClassName(element, className);
        var method = Element[bool ? 'addClassName' : 'removeClassName'];
        return method(element, className);
    }
    var ATTRIBUTE_TRANSLATIONS = {};
    var classProp = 'className',
        forProp = 'for';
    DIV.setAttribute(classProp, 'x');
    if (DIV.className !== 'x') {
        DIV.setAttribute('class', 'x');
        if (DIV.className === 'x')
            classProp = 'class';
    }
    var LABEL = document.createElement('label');
    LABEL.setAttribute(forProp, 'x');
    if (LABEL.htmlFor !== 'x') {
        LABEL.setAttribute('htmlFor', 'x');
        if (LABEL.htmlFor === 'x')
            forProp = 'htmlFor';
    }
    LABEL = null;

    function _getAttr(element, attribute) {
        return element.getAttribute(attribute);
    }

    function _getAttr2(element, attribute) {
        return element.getAttribute(attribute, 2);
    }

    function _getAttrNode(element, attribute) {
        var node = element.getAttributeNode(attribute);
        return node ? node.value : '';
    }

    function _getFlag(element, attribute) {
        return $(element).hasAttribute(attribute) ? attribute : null;
    }
    DIV.onclick = Prototype.emptyFunction;
    var onclickValue = DIV.getAttribute('onclick');
    var _getEv;
    if (String(onclickValue).indexOf('{') > -1) {
        _getEv = function (element, attribute) {
            var value = element.getAttribute(attribute);
            if (!value) return null;
            value = value.toString();
            value = value.split('{')[1];
            value = value.split('}')[0];
            return value.strip();
        };
    } else if (onclickValue === '') {
        _getEv = function (element, attribute) {
            var value = element.getAttribute(attribute);
            if (!value) return null;
            return value.strip();
        };
    }
    ATTRIBUTE_TRANSLATIONS.read = {
        names: {
            'class': classProp,
            'className': classProp,
            'for': forProp,
            'htmlFor': forProp
        },
        values: {
            style: function (element) {
                return element.style.cssText.toLowerCase();
            },
            title: function (element) {
                return element.title;
            }
        }
    };
    ATTRIBUTE_TRANSLATIONS.write = {
        names: {
            className: 'class',
            htmlFor: 'for',
            cellpadding: 'cellPadding',
            cellspacing: 'cellSpacing'
        },
        values: {
            checked: function (element, value) {
                element.checked = !! value;
            },
            style: function (element, value) {
                element.style.cssText = value ? value : '';
            }
        }
    };
    ATTRIBUTE_TRANSLATIONS.has = {
        names: {}
    };
    Object.extend(ATTRIBUTE_TRANSLATIONS.write.names, ATTRIBUTE_TRANSLATIONS.read.names);
    var CAMEL_CASED_ATTRIBUTE_NAMES = $w('colSpan rowSpan vAlign dateTime ' + 'accessKey tabIndex encType maxLength readOnly longDesc frameBorder');
    for (var i = 0, attr; attr = CAMEL_CASED_ATTRIBUTE_NAMES[i]; i++) {
        ATTRIBUTE_TRANSLATIONS.write.names[attr.toLowerCase()] = attr;
        ATTRIBUTE_TRANSLATIONS.has.names[attr.toLowerCase()] = attr;
    }
    Object.extend(ATTRIBUTE_TRANSLATIONS.read.values, {
        href: _getAttr2,
        src: _getAttr2,
        type: _getAttr,
        action: _getAttrNode,
        disabled: _getFlag,
        checked: _getFlag,
        readonly: _getFlag,
        multiple: _getFlag,
        onload: _getEv,
        onunload: _getEv,
        onclick: _getEv,
        ondblclick: _getEv,
        onmousedown: _getEv,
        onmouseup: _getEv,
        onmouseover: _getEv,
        onmousemove: _getEv,
        onmouseout: _getEv,
        onfocus: _getEv,
        onblur: _getEv,
        onkeypress: _getEv,
        onkeydown: _getEv,
        onkeyup: _getEv,
        onsubmit: _getEv,
        onreset: _getEv,
        onselect: _getEv,
        onchange: _getEv
    });
    Object.extend(methods, {
        identify: identify,
        readAttribute: readAttribute,
        writeAttribute: writeAttribute,
        classNames: classNames,
        hasClassName: hasClassName,
        addClassName: addClassName,
        removeClassName: removeClassName,
        toggleClassName: toggleClassName
    });

    function normalizeStyleName(style) {
        if (style === 'float' || style === 'styleFloat')
            return 'cssFloat';
        return style.camelize();
    }

    function normalizeStyleName_IE(style) {
        if (style === 'float' || style === 'cssFloat')
            return 'styleFloat';
        return style.camelize();
    }

    function setStyle(element, styles) {
        element = $(element);
        var elementStyle = element.style,
            match;
        if (Object.isString(styles)) {
            elementStyle.cssText += ';' + styles;
            if (styles.include('opacity')) {
                var opacity = styles.match(/opacity:\s*(\d?\.?\d*)/)[1];
                Element.setOpacity(element, opacity);
            }
            return element;
        }
        for (var property in styles) {
            if (property === 'opacity') {
                Element.setOpacity(element, styles[property]);
            } else {
                var value = styles[property];
                if (property === 'float' || property === 'cssFloat') {
                    property = Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat';
                }
                elementStyle[property] = value;
            }
        }
        return element;
    }

    function getStyle(element, style) {
        element = $(element);
        style = normalizeStyleName(style);
        var value = element.style[style];
        if (!value || value === 'auto') {
            var css = document.defaultView.getComputedStyle(element, null);
            value = css ? css[style] : null;
        }
        if (style === 'opacity') return value ? parseFloat(value) : 1.0;
        return value === 'auto' ? null : value;
    }

    function getStyle_Opera(element, style) {
        switch (style) {
        case 'height':
        case 'width':
            if (!Element.visible(element)) return null;
            var dim = parseInt(getStyle(element, style), 10);
            if (dim !== element['offset' + style.capitalize()])
                return dim + 'px';
            return Element.measure(element, style);
        default:
            return getStyle(element, style);
        }
    }

    function getStyle_IE(element, style) {
        element = $(element);
        style = normalizeStyleName_IE(style);
        var value = element.style[style];
        if (!value && element.currentStyle) {
            value = element.currentStyle[style];
        }
        if (style === 'opacity' && !STANDARD_CSS_OPACITY_SUPPORTED)
            return getOpacity_IE(element);
        if (value === 'auto') {
            if ((style === 'width' || style === 'height') && Element.visible(element))
                return Element.measure(element, style) + 'px';
            return null;
        }
        return value;
    }

    function stripAlphaFromFilter_IE(filter) {
        return (filter || '').replace(/alpha\([^\)]*\)/gi, '');
    }

    function hasLayout_IE(element) {
        if (!element.currentStyle.hasLayout)
            element.style.zoom = 1;
        return element;
    }
    var STANDARD_CSS_OPACITY_SUPPORTED = (function () {
        DIV.style.cssText = "opacity:.55";
        return /^0.55/.test(DIV.style.opacity);
    })();

    function setOpacity(element, value) {
        element = $(element);
        if (value == 1 || value === '') value = '';
        else if (value < 0.00001) value = 0;
        element.style.opacity = value;
        return element;
    }

    function setOpacity_IE(element, value) {
        if (STANDARD_CSS_OPACITY_SUPPORTED)
            return setOpacity(element, value);
        element = hasLayout_IE($(element));
        var filter = Element.getStyle(element, 'filter'),
            style = element.style;
        if (value == 1 || value === '') {
            filter = stripAlphaFromFilter_IE(filter);
            if (filter) style.filter = filter;
            else style.removeAttribute('filter');
            return element;
        }
        if (value < 0.00001) value = 0;
        style.filter = stripAlphaFromFilter_IE(filter) + 'alpha(opacity=' + (value * 100) + ')';
        return element;
    }

    function getOpacity(element) {
        return Element.getStyle(element, 'opacity');
    }

    function getOpacity_IE(element) {
        if (STANDARD_CSS_OPACITY_SUPPORTED)
            return getOpacity(element);
        var filter = Element.getStyle(element, 'filter');
        if (filter.length === 0) return 1.0;
        var match = (filter || '').match(/alpha\(opacity=(.*)\)/);
        if (match[1]) return parseFloat(match[1]) / 100;
        return 1.0;
    }
    Object.extend(methods, {
        setStyle: setStyle,
        getStyle: getStyle,
        setOpacity: setOpacity,
        getOpacity: getOpacity
    });
    if ('styleFloat' in DIV.style) {
        methods.getStyle = getStyle_IE;
        methods.setOpacity = setOpacity_IE;
        methods.getOpacity = getOpacity_IE;
    }
    var UID = 0;
    GLOBAL.Element.Storage = {
        UID: 1
    };

    function getUniqueElementID(element) {
        if (element === window) return 0;
        if (typeof element._prototypeUID === 'undefined')
            element._prototypeUID = Element.Storage.UID++;
        return element._prototypeUID;
    }

    function getUniqueElementID_IE(element) {
        if (element === window) return 0;
        if (element == document) return 1;
        return element.uniqueID;
    }
    var HAS_UNIQUE_ID_PROPERTY = ('uniqueID' in DIV);
    if (HAS_UNIQUE_ID_PROPERTY)
        getUniqueElementID = getUniqueElementID_IE;

    function getStorage(element) {
        if (!(element = $(element))) return;
        var uid = getUniqueElementID(element);
        if (!Element.Storage[uid])
            Element.Storage[uid] = $H();
        return Element.Storage[uid];
    }

    function store(element, key, value) {
        if (!(element = $(element))) return;
        var storage = getStorage(element);
        if (arguments.length === 2) {
            storage.update(key);
        } else {
            storage.set(key, value);
        }
        return element;
    }

    function retrieve(element, key, defaultValue) {
        if (!(element = $(element))) return;
        var storage = getStorage(element),
            value = storage.get(key);
        if (Object.isUndefined(value)) {
            storage.set(key, defaultValue);
            value = defaultValue;
        }
        return value;
    }
    Object.extend(methods, {
        getStorage: getStorage,
        store: store,
        retrieve: retrieve
    });
    var Methods = {}, ByTag = Element.Methods.ByTag,
        F = Prototype.BrowserFeatures;
    if (!F.ElementExtensions && ('__proto__' in DIV)) {
        GLOBAL.HTMLElement = {};
        GLOBAL.HTMLElement.prototype = DIV['__proto__'];
        F.ElementExtensions = true;
    }

    function checkElementPrototypeDeficiency(tagName) {
        if (typeof window.Element === 'undefined') return false;
        var proto = window.Element.prototype;
        if (proto) {
            var id = '_' + (Math.random() + '').slice(2),
                el = document.createElement(tagName);
            proto[id] = 'x';
            var isBuggy = (el[id] !== 'x');
            delete proto[id];
            el = null;
            return isBuggy;
        }
        return false;
    }
    var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = checkElementPrototypeDeficiency('object');

    function extendElementWith(element, methods) {
        for (var property in methods) {
            var value = methods[property];
            if (Object.isFunction(value) && !(property in element))
                element[property] = value.methodize();
        }
    }
    var EXTENDED = {};

    function elementIsExtended(element) {
        var uid = getUniqueElementID(element);
        return (uid in EXTENDED);
    }

    function extend(element) {
        if (!element || elementIsExtended(element)) return element;
        if (element.nodeType !== Node.ELEMENT_NODE || element == window)
            return element;
        var methods = Object.clone(Methods),
            tagName = element.tagName.toUpperCase();
        if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);
        extendElementWith(element, methods);
        EXTENDED[getUniqueElementID(element)] = true;
        return element;
    }

    function extend_IE8(element) {
        if (!element || elementIsExtended(element)) return element;
        var t = element.tagName;
        if (t && (/^(?:object|applet|embed)$/i.test(t))) {
            extendElementWith(element, Element.Methods);
            extendElementWith(element, Element.Methods.Simulated);
            extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
        }
        return element;
    }
    if (F.SpecificElementExtensions) {
        extend = HTMLOBJECTELEMENT_PROTOTYPE_BUGGY ? extend_IE8 : Prototype.K;
    }

    function addMethodsToTagName(tagName, methods) {
        tagName = tagName.toUpperCase();
        if (!ByTag[tagName]) ByTag[tagName] = {};
        Object.extend(ByTag[tagName], methods);
    }

    function mergeMethods(destination, methods, onlyIfAbsent) {
        if (Object.isUndefined(onlyIfAbsent)) onlyIfAbsent = false;
        for (var property in methods) {
            var value = methods[property];
            if (!Object.isFunction(value)) continue;
            if (!onlyIfAbsent || !(property in destination))
                destination[property] = value.methodize();
        }
    }

    function findDOMClass(tagName) {
        var klass;
        var trans = {
            "OPTGROUP": "OptGroup",
            "TEXTAREA": "TextArea",
            "P": "Paragraph",
            "FIELDSET": "FieldSet",
            "UL": "UList",
            "OL": "OList",
            "DL": "DList",
            "DIR": "Directory",
            "H1": "Heading",
            "H2": "Heading",
            "H3": "Heading",
            "H4": "Heading",
            "H5": "Heading",
            "H6": "Heading",
            "Q": "Quote",
            "INS": "Mod",
            "DEL": "Mod",
            "A": "Anchor",
            "IMG": "Image",
            "CAPTION": "TableCaption",
            "COL": "TableCol",
            "COLGROUP": "TableCol",
            "THEAD": "TableSection",
            "TFOOT": "TableSection",
            "TBODY": "TableSection",
            "TR": "TableRow",
            "TH": "TableCell",
            "TD": "TableCell",
            "FRAMESET": "FrameSet",
            "IFRAME": "IFrame"
        };
        if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
        if (window[klass]) return window[klass];
        klass = 'HTML' + tagName + 'Element';
        if (window[klass]) return window[klass];
        klass = 'HTML' + tagName.capitalize() + 'Element';
        if (window[klass]) return window[klass];
        var element = document.createElement(tagName),
            proto = element['__proto__'] || element.constructor.prototype;
        element = null;
        return proto;
    }

    function addMethods(methods) {
        if (arguments.length === 0) addFormMethods();
        if (arguments.length === 2) {
            var tagName = methods;
            methods = arguments[1];
        }
        if (!tagName) {
            Object.extend(Element.Methods, methods || {});
        } else {
            if (Object.isArray(tagName)) {
                for (var i = 0, tag; tag = tagName[i]; i++)
                    addMethodsToTagName(tag, methods);
            } else {
                addMethodsToTagName(tagName, methods);
            }
        }
        var ELEMENT_PROTOTYPE = window.HTMLElement ? HTMLElement.prototype : Element.prototype;
        if (F.ElementExtensions) {
            mergeMethods(ELEMENT_PROTOTYPE, Element.Methods);
            mergeMethods(ELEMENT_PROTOTYPE, Element.Methods.Simulated, true);
        }
        if (F.SpecificElementExtensions) {
            for (var tag in Element.Methods.ByTag) {
                var klass = findDOMClass(tag);
                if (Object.isUndefined(klass)) continue;
                mergeMethods(klass.prototype, ByTag[tag]);
            }
        }
        Object.extend(Element, Element.Methods);
        Object.extend(Element, Element.Methods.Simulated);
        delete Element.ByTag;
        delete Element.Simulated;
        Element.extend.refresh();
        ELEMENT_CACHE = {};
    }
    Object.extend(GLOBAL.Element, {
        extend: extend,
        addMethods: addMethods
    });
    if (extend === Prototype.K) {
        GLOBAL.Element.extend.refresh = Prototype.emptyFunction;
    } else {
        GLOBAL.Element.extend.refresh = function () {
            if (Prototype.BrowserFeatures.ElementExtensions) return;
            Object.extend(Methods, Element.Methods);
            Object.extend(Methods, Element.Methods.Simulated);
            EXTENDED = {};
        };
    }

    function addFormMethods() {
        Object.extend(Form, Form.Methods);
        Object.extend(Form.Element, Form.Element.Methods);
        Object.extend(Element.Methods.ByTag, {
            "FORM": Object.clone(Form.Methods),
            "INPUT": Object.clone(Form.Element.Methods),
            "SELECT": Object.clone(Form.Element.Methods),
            "TEXTAREA": Object.clone(Form.Element.Methods),
            "BUTTON": Object.clone(Form.Element.Methods)
        });
    }
    Element.addMethods(methods);
})(this);
(function () {
    function toDecimal(pctString) {
        var match = pctString.match(/^(\d+)%?$/i);
        if (!match) return null;
        return (Number(match[1]) / 100);
    }

    function getRawStyle(element, style) {
        element = $(element);
        var value = element.style[style];
        if (!value || value === 'auto') {
            var css = document.defaultView.getComputedStyle(element, null);
            value = css ? css[style] : null;
        }
        if (style === 'opacity') return value ? parseFloat(value) : 1.0;
        return value === 'auto' ? null : value;
    }

    function getRawStyle_IE(element, style) {
        var value = element.style[style];
        if (!value && element.currentStyle) {
            value = element.currentStyle[style];
        }
        return value;
    }

    function getContentWidth(element, context) {
        var boxWidth = element.offsetWidth;
        var bl = getPixelValue(element, 'borderLeftWidth', context) || 0;
        var br = getPixelValue(element, 'borderRightWidth', context) || 0;
        var pl = getPixelValue(element, 'paddingLeft', context) || 0;
        var pr = getPixelValue(element, 'paddingRight', context) || 0;
        return boxWidth - bl - br - pl - pr;
    }
    if ('currentStyle' in document.documentElement) {
        getRawStyle = getRawStyle_IE;
    }

    function getPixelValue(value, property, context) {
        var element = null;
        if (Object.isElement(value)) {
            element = value;
            value = getRawStyle(element, property);
        }
        if (value === null || Object.isUndefined(value)) {
            return null;
        }
        if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(value)) {
            return window.parseFloat(value);
        }
        var isPercentage = value.include('%'),
            isViewport = (context === document.viewport);
        if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
            var style = element.style.left,
                rStyle = element.runtimeStyle.left;
            element.runtimeStyle.left = element.currentStyle.left;
            element.style.left = value || 0;
            value = element.style.pixelLeft;
            element.style.left = style;
            element.runtimeStyle.left = rStyle;
            return value;
        }
        if (element && isPercentage) {
            context = context || element.parentNode;
            var decimal = toDecimal(value),
                whole = null;
            var isHorizontal = property.include('left') || property.include('right') || property.include('width');
            var isVertical = property.include('top') || property.include('bottom') || property.include('height');
            if (context === document.viewport) {
                if (isHorizontal) {
                    whole = document.viewport.getWidth();
                } else if (isVertical) {
                    whole = document.viewport.getHeight();
                }
            } else {
                if (isHorizontal) {
                    whole = $(context).measure('width');
                } else if (isVertical) {
                    whole = $(context).measure('height');
                }
            }
            return (whole === null) ? 0 : whole * decimal;
        }
        return 0;
    }

    function toCSSPixels(number) {
        if (Object.isString(number) && number.endsWith('px'))
            return number;
        return number + 'px';
    }

    function isDisplayed(element) {
        while (element && element.parentNode) {
            var display = element.getStyle('display');
            if (display === 'none') {
                return false;
            }
            element = $(element.parentNode);
        }
        return true;
    }
    var hasLayout = Prototype.K;
    if ('currentStyle' in document.documentElement) {
        hasLayout = function (element) {
            if (!element.currentStyle.hasLayout) {
                element.style.zoom = 1;
            }
            return element;
        };
    }

    function cssNameFor(key) {
        if (key.include('border')) key = key + '-width';
        return key.camelize();
    }
    Element.Layout = Class.create(Hash, {
        initialize: function ($super, element, preCompute) {
            $super();
            this.element = $(element);
            Element.Layout.PROPERTIES.each(function (property) {
                this._set(property, null);
            }, this);
            if (preCompute) {
                this._preComputing = true;
                this._begin();
                Element.Layout.PROPERTIES.each(this._compute, this);
                this._end();
                this._preComputing = false;
            }
        },
        _set: function (property, value) {
            return Hash.prototype.set.call(this, property, value);
        },
        set: function (property, value) {
            throw "Properties of Element.Layout are read-only.";
        },
        get: function ($super, property) {
            var value = $super(property);
            return value === null ? this._compute(property) : value;
        },
        _begin: function () {
            if (this._isPrepared()) return;
            var element = this.element;
            if (isDisplayed(element)) {
                this._setPrepared(true);
                return;
            }
            var originalStyles = {
                position: element.style.position || '',
                width: element.style.width || '',
                visibility: element.style.visibility || '',
                display: element.style.display || ''
            };
            element.store('prototype_original_styles', originalStyles);
            var position = getRawStyle(element, 'position'),
                width = element.offsetWidth;
            if (width === 0 || width === null) {
                element.style.display = 'block';
                width = element.offsetWidth;
            }
            var context = (position === 'fixed') ? document.viewport : element.parentNode;
            var tempStyles = {
                visibility: 'hidden',
                display: 'block'
            };
            if (position !== 'fixed') tempStyles.position = 'absolute';
            element.setStyle(tempStyles);
            var positionedWidth = element.offsetWidth,
                newWidth;
            if (width && (positionedWidth === width)) {
                newWidth = getContentWidth(element, context);
            } else if (position === 'absolute' || position === 'fixed') {
                newWidth = getContentWidth(element, context);
            } else {
                var parent = element.parentNode,
                    pLayout = $(parent).getLayout();
                newWidth = pLayout.get('width') -
                    this.get('margin-left') -
                    this.get('border-left') -
                    this.get('padding-left') -
                    this.get('padding-right') -
                    this.get('border-right') -
                    this.get('margin-right');
            }
            element.setStyle({
                width: newWidth + 'px'
            });
            this._setPrepared(true);
        },
        _end: function () {
            var element = this.element;
            var originalStyles = element.retrieve('prototype_original_styles');
            element.store('prototype_original_styles', null);
            element.setStyle(originalStyles);
            this._setPrepared(false);
        },
        _compute: function (property) {
            var COMPUTATIONS = Element.Layout.COMPUTATIONS;
            if (!(property in COMPUTATIONS)) {
                throw "Property not found.";
            }
            return this._set(property, COMPUTATIONS[property].call(this, this.element));
        },
        _isPrepared: function () {
            return this.element.retrieve('prototype_element_layout_prepared', false);
        },
        _setPrepared: function (bool) {
            return this.element.store('prototype_element_layout_prepared', bool);
        },
        toObject: function () {
            var args = $A(arguments);
            var keys = (args.length === 0) ? Element.Layout.PROPERTIES : args.join(' ').split(' ');
            var obj = {};
            keys.each(function (key) {
                if (!Element.Layout.PROPERTIES.include(key)) return;
                var value = this.get(key);
                if (value != null) obj[key] = value;
            }, this);
            return obj;
        },
        toHash: function () {
            var obj = this.toObject.apply(this, arguments);
            return new Hash(obj);
        },
        toCSS: function () {
            var args = $A(arguments);
            var keys = (args.length === 0) ? Element.Layout.PROPERTIES : args.join(' ').split(' ');
            var css = {};
            keys.each(function (key) {
                if (!Element.Layout.PROPERTIES.include(key)) return;
                if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;
                var value = this.get(key);
                if (value != null) css[cssNameFor(key)] = value + 'px';
            }, this);
            return css;
        },
        inspect: function () {
            return "#<Element.Layout>";
        }
    });
    Object.extend(Element.Layout, {
        PROPERTIES: $w('height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'),
        COMPOSITE_PROPERTIES: $w('padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'),
        COMPUTATIONS: {
            'height': function (element) {
                if (!this._preComputing) this._begin();
                var bHeight = this.get('border-box-height');
                if (bHeight <= 0) {
                    if (!this._preComputing) this._end();
                    return 0;
                }
                var bTop = this.get('border-top'),
                    bBottom = this.get('border-bottom');
                var pTop = this.get('padding-top'),
                    pBottom = this.get('padding-bottom');
                if (!this._preComputing) this._end();
                return bHeight - bTop - bBottom - pTop - pBottom;
            },
            'width': function (element) {
                if (!this._preComputing) this._begin();
                var bWidth = this.get('border-box-width');
                if (bWidth <= 0) {
                    if (!this._preComputing) this._end();
                    return 0;
                }
                var bLeft = this.get('border-left'),
                    bRight = this.get('border-right');
                var pLeft = this.get('padding-left'),
                    pRight = this.get('padding-right');
                if (!this._preComputing) this._end();
                return bWidth - bLeft - bRight - pLeft - pRight;
            },
            'padding-box-height': function (element) {
                var height = this.get('height'),
                    pTop = this.get('padding-top'),
                    pBottom = this.get('padding-bottom');
                return height + pTop + pBottom;
            },
            'padding-box-width': function (element) {
                var width = this.get('width'),
                    pLeft = this.get('padding-left'),
                    pRight = this.get('padding-right');
                return width + pLeft + pRight;
            },
            'border-box-height': function (element) {
                if (!this._preComputing) this._begin();
                var height = element.offsetHeight;
                if (!this._preComputing) this._end();
                return height;
            },
            'border-box-width': function (element) {
                if (!this._preComputing) this._begin();
                var width = element.offsetWidth;
                if (!this._preComputing) this._end();
                return width;
            },
            'margin-box-height': function (element) {
                var bHeight = this.get('border-box-height'),
                    mTop = this.get('margin-top'),
                    mBottom = this.get('margin-bottom');
                if (bHeight <= 0) return 0;
                return bHeight + mTop + mBottom;
            },
            'margin-box-width': function (element) {
                var bWidth = this.get('border-box-width'),
                    mLeft = this.get('margin-left'),
                    mRight = this.get('margin-right');
                if (bWidth <= 0) return 0;
                return bWidth + mLeft + mRight;
            },
            'top': function (element) {
                var offset = element.positionedOffset();
                return offset.top;
            },
            'bottom': function (element) {
                var offset = element.positionedOffset(),
                    parent = element.getOffsetParent(),
                    pHeight = parent.measure('height');
                var mHeight = this.get('border-box-height');
                return pHeight - mHeight - offset.top;
            },
            'left': function (element) {
                var offset = element.positionedOffset();
                return offset.left;
            },
            'right': function (element) {
                var offset = element.positionedOffset(),
                    parent = element.getOffsetParent(),
                    pWidth = parent.measure('width');
                var mWidth = this.get('border-box-width');
                return pWidth - mWidth - offset.left;
            },
            'padding-top': function (element) {
                return getPixelValue(element, 'paddingTop');
            },
            'padding-bottom': function (element) {
                return getPixelValue(element, 'paddingBottom');
            },
            'padding-left': function (element) {
                return getPixelValue(element, 'paddingLeft');
            },
            'padding-right': function (element) {
                return getPixelValue(element, 'paddingRight');
            },
            'border-top': function (element) {
                return getPixelValue(element, 'borderTopWidth');
            },
            'border-bottom': function (element) {
                return getPixelValue(element, 'borderBottomWidth');
            },
            'border-left': function (element) {
                return getPixelValue(element, 'borderLeftWidth');
            },
            'border-right': function (element) {
                return getPixelValue(element, 'borderRightWidth');
            },
            'margin-top': function (element) {
                return getPixelValue(element, 'marginTop');
            },
            'margin-bottom': function (element) {
                return getPixelValue(element, 'marginBottom');
            },
            'margin-left': function (element) {
                return getPixelValue(element, 'marginLeft');
            },
            'margin-right': function (element) {
                return getPixelValue(element, 'marginRight');
            }
        }
    });
    if ('getBoundingClientRect' in document.documentElement) {
        Object.extend(Element.Layout.COMPUTATIONS, {
            'right': function (element) {
                var parent = hasLayout(element.getOffsetParent());
                var rect = element.getBoundingClientRect(),
                    pRect = parent.getBoundingClientRect();
                return (pRect.right - rect.right).round();
            },
            'bottom': function (element) {
                var parent = hasLayout(element.getOffsetParent());
                var rect = element.getBoundingClientRect(),
                    pRect = parent.getBoundingClientRect();
                return (pRect.bottom - rect.bottom).round();
            }
        });
    }
    Element.Offset = Class.create({
        initialize: function (left, top) {
            this.left = left.round();
            this.top = top.round();
            this[0] = this.left;
            this[1] = this.top;
        },
        relativeTo: function (offset) {
            return new Element.Offset(this.left - offset.left, this.top - offset.top);
        },
        inspect: function () {
            return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this);
        },
        toString: function () {
            return "[#{left}, #{top}]".interpolate(this);
        },
        toArray: function () {
            return [this.left, this.top];
        }
    });

    function getLayout(element, preCompute) {
        return new Element.Layout(element, preCompute);
    }

    function measure(element, property) {
        return $(element).getLayout().get(property);
    }

    function getHeight(element) {
        return Element.getDimensions(element).height;
    }

    function getWidth(element) {
        return Element.getDimensions(element).width;
    }

    function getDimensions(element) {
        element = $(element);
        var display = Element.getStyle(element, 'display');
        if (display && display !== 'none') {
            return {
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        }
        var style = element.style;
        var originalStyles = {
            visibility: style.visibility,
            position: style.position,
            display: style.display
        };
        var newStyles = {
            visibility: 'hidden',
            display: 'block'
        };
        if (originalStyles.position !== 'fixed')
            newStyles.position = 'absolute';
        Element.setStyle(element, newStyles);
        var dimensions = {
            width: element.offsetWidth,
            height: element.offsetHeight
        };
        Element.setStyle(element, originalStyles);
        return dimensions;
    }

    function getOffsetParent(element) {
        element = $(element);
        if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
            return $(document.body);
        var isInline = (Element.getStyle(element, 'display') === 'inline');
        if (!isInline && element.offsetParent) return $(element.offsetParent);
        while ((element = element.parentNode) && element !== document.body) {
            if (Element.getStyle(element, 'position') !== 'static') {
                return isHtml(element) ? $(document.body) : $(element);
            }
        }
        return $(document.body);
    }

    function cumulativeOffset(element) {
        element = $(element);
        var valueT = 0,
            valueL = 0;
        if (element.parentNode) {
            do {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
        }
        return new Element.Offset(valueL, valueT);
    }

    function positionedOffset(element) {
        element = $(element);
        var layout = element.getLayout();
        var valueT = 0,
            valueL = 0;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            element = element.offsetParent;
            if (element) {
                if (isBody(element)) break;
                var p = Element.getStyle(element, 'position');
                if (p !== 'static') break;
            }
        } while (element);
        valueL -= layout.get('margin-top');
        valueT -= layout.get('margin-left');
        return new Element.Offset(valueL, valueT);
    }

    function cumulativeScrollOffset(element) {
        var valueT = 0,
            valueL = 0;
        do {
            valueT += element.scrollTop || 0;
            valueL += element.scrollLeft || 0;
            element = element.parentNode;
        } while (element);
        return new Element.Offset(valueL, valueT);
    }

    function viewportOffset(forElement) {
        var valueT = 0,
            valueL = 0,
            docBody = document.body;
        var element = $(forElement);
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            if (element.offsetParent == docBody && Element.getStyle(element, 'position') == 'absolute') break;
        } while (element = element.offsetParent);
        element = forElement;
        do {
            if (element != docBody) {
                valueT -= element.scrollTop || 0;
                valueL -= element.scrollLeft || 0;
            }
        } while (element = element.parentNode);
        return new Element.Offset(valueL, valueT);
    }

    function absolutize(element) {
        element = $(element);
        if (Element.getStyle(element, 'position') === 'absolute') {
            return element;
        }
        var offsetParent = getOffsetParent(element);
        var eOffset = element.viewportOffset(),
            pOffset = offsetParent.viewportOffset();
        var offset = eOffset.relativeTo(pOffset);
        var layout = element.getLayout();
        element.store('prototype_absolutize_original_styles', {
            left: element.getStyle('left'),
            top: element.getStyle('top'),
            width: element.getStyle('width'),
            height: element.getStyle('height')
        });
        element.setStyle({
            position: 'absolute',
            top: offset.top + 'px',
            left: offset.left + 'px',
            width: layout.get('width') + 'px',
            height: layout.get('height') + 'px'
        });
        return element;
    }

    function relativize(element) {
        element = $(element);
        if (Element.getStyle(element, 'position') === 'relative') {
            return element;
        }
        var originalStyles = element.retrieve('prototype_absolutize_original_styles');
        if (originalStyles) element.setStyle(originalStyles);
        return element;
    }

    function scrollTo(element) {
        element = $(element);
        var pos = Element.cumulativeOffset(element);
        window.scrollTo(pos.left, pos.top);
        return element;
    }

    function makePositioned(element) {
        element = $(element);
        var position = Element.getStyle(element, 'position'),
            styles = {};
        if (position === 'static' || !position) {
            styles.position = 'relative';
            if (Prototype.Browser.Opera) {
                styles.top = 0;
                styles.left = 0;
            }
            Element.setStyle(element, styles);
            Element.store(element, 'prototype_made_positioned', true);
        }
        return element;
    }

    function undoPositioned(element) {
        element = $(element);
        var storage = Element.getStorage(element),
            madePositioned = storage.get('prototype_made_positioned');
        if (madePositioned) {
            storage.unset('prototype_made_positioned');
            Element.setStyle(element, {
                position: '',
                top: '',
                bottom: '',
                left: '',
                right: ''
            });
        }
        return element;
    }

    function makeClipping(element) {
        element = $(element);
        var storage = Element.getStorage(element),
            madeClipping = storage.get('prototype_made_clipping');
        if (Object.isUndefined(madeClipping)) {
            var overflow = Element.getStyle(element, 'overflow');
            storage.set('prototype_made_clipping', overflow);
            if (overflow !== 'hidden')
                element.style.overflow = 'hidden';
        }
        return element;
    }

    function undoClipping(element) {
        element = $(element);
        var storage = Element.getStorage(element),
            overflow = storage.get('prototype_made_clipping');
        if (!Object.isUndefined(overflow)) {
            storage.unset('prototype_made_clipping');
            element.style.overflow = overflow || '';
        }
        return element;
    }

    function clonePosition(element, source, options) {
        options = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        }, options || {});
        source = $(source);
        element = $(element);
        var p, delta, layout, styles = {};
        if (options.setLeft || options.setTop) {
            p = Element.viewportOffset(source);
            delta = [0, 0];
            if (Element.getStyle(element, 'position') === 'absolute') {
                var parent = Element.getOffsetParent(element);
                if (parent !== document.body) delta = Element.viewportOffset(parent);
            }
        }
        if (options.setWidth || options.setHeight) {
            layout = Element.getLayout(source);
        }
        if (options.setLeft)
            styles.left = (p[0] - delta[0] + options.offsetLeft) + 'px';
        if (options.setTop)
            styles.top = (p[1] - delta[1] + options.offsetTop) + 'px';
        if (options.setWidth)
            styles.width = layout.get('border-box-width') + 'px';
        if (options.setHeight)
            styles.height = layout.get('border-box-height') + 'px';
        return Element.setStyle(element, styles);
    }
    if (Prototype.Browser.IE) {
        getOffsetParent = getOffsetParent.wrap(function (proceed, element) {
            element = $(element);
            if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
                return $(document.body);
            var position = element.getStyle('position');
            if (position !== 'static') return proceed(element);
            element.setStyle({
                position: 'relative'
            });
            var value = proceed(element);
            element.setStyle({
                position: position
            });
            return value;
        });
        positionedOffset = positionedOffset.wrap(function (proceed, element) {
            element = $(element);
            if (!element.parentNode) return new Element.Offset(0, 0);
            var position = element.getStyle('position');
            if (position !== 'static') return proceed(element);
            var offsetParent = element.getOffsetParent();
            if (offsetParent && offsetParent.getStyle('position') === 'fixed')
                hasLayout(offsetParent);
            element.setStyle({
                position: 'relative'
            });
            var value = proceed(element);
            element.setStyle({
                position: position
            });
            return value;
        });
    } else if (Prototype.Browser.Webkit) {
        cumulativeOffset = function (element) {
            element = $(element);
            var valueT = 0,
                valueL = 0;
            do {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                if (element.offsetParent == document.body) {
                    if (Element.getStyle(element, 'position') == 'absolute') break;
                }
                element = element.offsetParent;
            } while (element);
            return new Element.Offset(valueL, valueT);
        };
    }
    Element.addMethods({
        getLayout: getLayout,
        measure: measure,
        getWidth: getWidth,
        getHeight: getHeight,
        getDimensions: getDimensions,
        getOffsetParent: getOffsetParent,
        cumulativeOffset: cumulativeOffset,
        positionedOffset: positionedOffset,
        cumulativeScrollOffset: cumulativeScrollOffset,
        viewportOffset: viewportOffset,
        absolutize: absolutize,
        relativize: relativize,
        scrollTo: scrollTo,
        makePositioned: makePositioned,
        undoPositioned: undoPositioned,
        makeClipping: makeClipping,
        undoClipping: undoClipping,
        clonePosition: clonePosition
    });

    function isBody(element) {
        return element.nodeName.toUpperCase() === 'BODY';
    }

    function isHtml(element) {
        return element.nodeName.toUpperCase() === 'HTML';
    }

    function isDocument(element) {
        return element.nodeType === Node.DOCUMENT_NODE;
    }

    function isDetached(element) {
        return element !== document.body && !Element.descendantOf(element, document.body);
    }
    if ('getBoundingClientRect' in document.documentElement) {
        Element.addMethods({
            viewportOffset: function (element) {
                element = $(element);
                if (isDetached(element)) return new Element.Offset(0, 0);
                var rect = element.getBoundingClientRect(),
                    docEl = document.documentElement;
                return new Element.Offset(rect.left - docEl.clientLeft, rect.top - docEl.clientTop);
            }
        });
    }
})();
(function () {
    var IS_OLD_OPERA = Prototype.Browser.Opera && (window.parseFloat(window.opera.version()) < 9.5);
    var ROOT = null;

    function getRootElement() {
        if (ROOT) return ROOT;
        ROOT = IS_OLD_OPERA ? document.body : document.documentElement;
        return ROOT;
    }

    function getDimensions() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        };
    }

    function getWidth() {
        return getRootElement().clientWidth;
    }

    function getHeight() {
        return getRootElement().clientHeight;
    }

    function getScrollOffsets() {
        var x = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
        var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        return new Element.Offset(x, y);
    }
    document.viewport = {
        getDimensions: getDimensions,
        getWidth: getWidth,
        getHeight: getHeight,
        getScrollOffsets: getScrollOffsets
    };
})();
window.$$ = function () {
    var expression = $A(arguments).join(', ');
    return Prototype.Selector.select(expression, document);
};
Prototype.Selector = (function () {
    function select() {
        throw new Error('Method "Prototype.Selector.select" must be defined.');
    }

    function match() {
        throw new Error('Method "Prototype.Selector.match" must be defined.');
    }

    function find(elements, expression, index) {
        index = index || 0;
        var match = Prototype.Selector.match,
            length = elements.length,
            matchIndex = 0,
            i;
        for (i = 0; i < length; i++) {
            if (match(elements[i], expression) && index == matchIndex++) {
                return Element.extend(elements[i]);
            }
        }
    }

    function extendElements(elements) {
        for (var i = 0, length = elements.length; i < length; i++) {
            Element.extend(elements[i]);
        }
        return elements;
    }
    var K = Prototype.K;
    return {
        select: select,
        match: match,
        find: find,
        extendElements: (Element.extend === K) ? K : extendElements,
        extendElement: Element.extend
    };
})();
/*
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function () {
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        done = 0,
        toString = Object.prototype.toString,
        hasDuplicate = false,
        baseHasDuplicate = true,
        rBackslash = /\\/g,
        rNonWord = /\W/;
    [0, 0].sort(function () {
            baseHasDuplicate = false;
            return 0;
        });
    var Sizzle = function (selector, context, results, seed) {
        results = results || [];
        context = context || document;
        var origContext = context;
        if (context.nodeType !== 1 && context.nodeType !== 9) {
            return [];
        }
        if (!selector || typeof selector !== "string") {
            return results;
        }
        var m, set, checkSet, extra, ret, cur, pop, i, prune = true,
            contextXML = Sizzle.isXML(context),
            parts = [],
            soFar = selector;
        do {
            chunker.exec("");
            m = chunker.exec(soFar);
            if (m) {
                soFar = m[3];
                parts.push(m[1]);
                if (m[2]) {
                    extra = m[3];
                    break;
                }
            }
        } while (m);
        if (parts.length > 1 && origPOS.exec(selector)) {
            if (parts.length === 2 && Expr.relative[parts[0]]) {
                set = posProcess(parts[0] + parts[1], context);
            } else {
                set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);
                while (parts.length) {
                    selector = parts.shift();
                    if (Expr.relative[selector]) {
                        selector += parts.shift();
                    }
                    set = posProcess(selector, set);
                }
            }
        } else {
            if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                ret = Sizzle.find(parts.shift(), context, contextXML);
                context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
            }
            if (context) {
                ret = seed ? {
                    expr: parts.pop(),
                    set: makeArray(seed)
                } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
                set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
                if (parts.length > 0) {
                    checkSet = makeArray(set);
                } else {
                    prune = false;
                }
                while (parts.length) {
                    cur = parts.pop();
                    pop = cur;
                    if (!Expr.relative[cur]) {
                        cur = "";
                    } else {
                        pop = parts.pop();
                    }
                    if (pop == null) {
                        pop = context;
                    }
                    Expr.relative[cur](checkSet, pop, contextXML);
                }
            } else {
                checkSet = parts = [];
            }
        }
        if (!checkSet) {
            checkSet = set;
        }
        if (!checkSet) {
            Sizzle.error(cur || selector);
        }
        if (toString.call(checkSet) === "[object Array]") {
            if (!prune) {
                results.push.apply(results, checkSet);
            } else if (context && context.nodeType === 1) {
                for (i = 0; checkSet[i] != null; i++) {
                    if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                        results.push(set[i]);
                    }
                }
            } else {
                for (i = 0; checkSet[i] != null; i++) {
                    if (checkSet[i] && checkSet[i].nodeType === 1) {
                        results.push(set[i]);
                    }
                }
            }
        } else {
            makeArray(checkSet, results);
        }
        if (extra) {
            Sizzle(extra, origContext, results, seed);
            Sizzle.uniqueSort(results);
        }
        return results;
    };
    Sizzle.uniqueSort = function (results) {
        if (sortOrder) {
            hasDuplicate = baseHasDuplicate;
            results.sort(sortOrder);
            if (hasDuplicate) {
                for (var i = 1; i < results.length; i++) {
                    if (results[i] === results[i - 1]) {
                        results.splice(i--, 1);
                    }
                }
            }
        }
        return results;
    };
    Sizzle.matches = function (expr, set) {
        return Sizzle(expr, null, null, set);
    };
    Sizzle.matchesSelector = function (node, expr) {
        return Sizzle(expr, null, null, [node]).length > 0;
    };
    Sizzle.find = function (expr, context, isXML) {
        var set;
        if (!expr) {
            return [];
        }
        for (var i = 0, l = Expr.order.length; i < l; i++) {
            var match, type = Expr.order[i];
            if ((match = Expr.leftMatch[type].exec(expr))) {
                var left = match[1];
                match.splice(1, 1);
                if (left.substr(left.length - 1) !== "\\") {
                    match[1] = (match[1] || "").replace(rBackslash, "");
                    set = Expr.find[type](match, context, isXML);
                    if (set != null) {
                        expr = expr.replace(Expr.match[type], "");
                        break;
                    }
                }
            }
        }
        if (!set) {
            set = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName("*") : [];
        }
        return {
            set: set,
            expr: expr
        };
    };
    Sizzle.filter = function (expr, set, inplace, not) {
        var match, anyFound, old = expr,
            result = [],
            curLoop = set,
            isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);
        while (expr && set.length) {
            for (var type in Expr.filter) {
                if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                    var found, item, filter = Expr.filter[type],
                        left = match[1];
                    anyFound = false;
                    match.splice(1, 1);
                    if (left.substr(left.length - 1) === "\\") {
                        continue;
                    }
                    if (curLoop === result) {
                        result = [];
                    }
                    if (Expr.preFilter[type]) {
                        match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                        if (!match) {
                            anyFound = found = true;
                        } else if (match === true) {
                            continue;
                        }
                    }
                    if (match) {
                        for (var i = 0;
                            (item = curLoop[i]) != null; i++) {
                            if (item) {
                                found = filter(item, match, i, curLoop);
                                var pass = not ^ !! found;
                                if (inplace && found != null) {
                                    if (pass) {
                                        anyFound = true;
                                    } else {
                                        curLoop[i] = false;
                                    }
                                } else if (pass) {
                                    result.push(item);
                                    anyFound = true;
                                }
                            }
                        }
                    }
                    if (found !== undefined) {
                        if (!inplace) {
                            curLoop = result;
                        }
                        expr = expr.replace(Expr.match[type], "");
                        if (!anyFound) {
                            return [];
                        }
                        break;
                    }
                }
            }
            if (expr === old) {
                if (anyFound == null) {
                    Sizzle.error(expr);
                } else {
                    break;
                }
            }
            old = expr;
        }
        return curLoop;
    };
    Sizzle.error = function (msg) {
        throw "Syntax error, unrecognized expression: " + msg;
    };
    var Expr = Sizzle.selectors = {
        order: ["ID", "NAME", "TAG"],
        match: {
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
            CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
        },
        leftMatch: {},
        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },
        attrHandle: {
            href: function (elem) {
                return elem.getAttribute("href");
            },
            type: function (elem) {
                return elem.getAttribute("type");
            }
        },
        relative: {
            "+": function (checkSet, part) {
                var isPartStr = typeof part === "string",
                    isTag = isPartStr && !rNonWord.test(part),
                    isPartStrNotTag = isPartStr && !isTag;
                if (isTag) {
                    part = part.toLowerCase();
                }
                for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                    if ((elem = checkSet[i])) {
                        while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
                        checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
                    }
                }
                if (isPartStrNotTag) {
                    Sizzle.filter(part, checkSet, true);
                }
            },
            ">": function (checkSet, part) {
                var elem, isPartStr = typeof part === "string",
                    i = 0,
                    l = checkSet.length;
                if (isPartStr && !rNonWord.test(part)) {
                    part = part.toLowerCase();
                    for (; i < l; i++) {
                        elem = checkSet[i];
                        if (elem) {
                            var parent = elem.parentNode;
                            checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                        }
                    }
                } else {
                    for (; i < l; i++) {
                        elem = checkSet[i];
                        if (elem) {
                            checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                        }
                    }
                    if (isPartStr) {
                        Sizzle.filter(part, checkSet, true);
                    }
                }
            },
            "": function (checkSet, part, isXML) {
                var nodeCheck, doneName = done++,
                    checkFn = dirCheck;
                if (typeof part === "string" && !rNonWord.test(part)) {
                    part = part.toLowerCase();
                    nodeCheck = part;
                    checkFn = dirNodeCheck;
                }
                checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
            },
            "~": function (checkSet, part, isXML) {
                var nodeCheck, doneName = done++,
                    checkFn = dirCheck;
                if (typeof part === "string" && !rNonWord.test(part)) {
                    part = part.toLowerCase();
                    nodeCheck = part;
                    checkFn = dirNodeCheck;
                }
                checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
            }
        },
        find: {
            ID: function (match, context, isXML) {
                if (typeof context.getElementById !== "undefined" && !isXML) {
                    var m = context.getElementById(match[1]);
                    return m && m.parentNode ? [m] : [];
                }
            },
            NAME: function (match, context) {
                if (typeof context.getElementsByName !== "undefined") {
                    var ret = [],
                        results = context.getElementsByName(match[1]);
                    for (var i = 0, l = results.length; i < l; i++) {
                        if (results[i].getAttribute("name") === match[1]) {
                            ret.push(results[i]);
                        }
                    }
                    return ret.length === 0 ? null : ret;
                }
            },
            TAG: function (match, context) {
                if (typeof context.getElementsByTagName !== "undefined") {
                    return context.getElementsByTagName(match[1]);
                }
            }
        },
        preFilter: {
            CLASS: function (match, curLoop, inplace, result, not, isXML) {
                match = " " + match[1].replace(rBackslash, "") + " ";
                if (isXML) {
                    return match;
                }
                for (var i = 0, elem;
                    (elem = curLoop[i]) != null; i++) {
                    if (elem) {
                        if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
                            if (!inplace) {
                                result.push(elem);
                            }
                        } else if (inplace) {
                            curLoop[i] = false;
                        }
                    }
                }
                return false;
            },
            ID: function (match) {
                return match[1].replace(rBackslash, "");
            },
            TAG: function (match, curLoop) {
                return match[1].replace(rBackslash, "").toLowerCase();
            },
            CHILD: function (match) {
                if (match[1] === "nth") {
                    if (!match[2]) {
                        Sizzle.error(match[0]);
                    }
                    match[2] = match[2].replace(/^\+|\s*/g, '');
                    var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                    match[2] = (test[1] + (test[2] || 1)) - 0;
                    match[3] = test[3] - 0;
                } else if (match[2]) {
                    Sizzle.error(match[0]);
                }
                match[0] = done++;
                return match;
            },
            ATTR: function (match, curLoop, inplace, result, not, isXML) {
                var name = match[1] = match[1].replace(rBackslash, "");
                if (!isXML && Expr.attrMap[name]) {
                    match[1] = Expr.attrMap[name];
                }
                match[4] = (match[4] || match[5] || "").replace(rBackslash, "");
                if (match[2] === "~=") {
                    match[4] = " " + match[4] + " ";
                }
                return match;
            },
            PSEUDO: function (match, curLoop, inplace, result, not) {
                if (match[1] === "not") {
                    if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                        match[3] = Sizzle(match[3], null, null, curLoop);
                    } else {
                        var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                        if (!inplace) {
                            result.push.apply(result, ret);
                        }
                        return false;
                    }
                } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                    return true;
                }
                return match;
            },
            POS: function (match) {
                match.unshift(true);
                return match;
            }
        },
        filters: {
            enabled: function (elem) {
                return elem.disabled === false && elem.type !== "hidden";
            },
            disabled: function (elem) {
                return elem.disabled === true;
            },
            checked: function (elem) {
                return elem.checked === true;
            },
            selected: function (elem) {
                if (elem.parentNode) {
                    elem.parentNode.selectedIndex;
                }
                return elem.selected === true;
            },
            parent: function (elem) {
                return !!elem.firstChild;
            },
            empty: function (elem) {
                return !elem.firstChild;
            },
            has: function (elem, i, match) {
                return !!Sizzle(match[3], elem).length;
            },
            header: function (elem) {
                return (/h\d/i).test(elem.nodeName);
            },
            text: function (elem) {
                var attr = elem.getAttribute("type"),
                    type = elem.type;
                return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null);
            },
            radio: function (elem) {
                return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
            },
            checkbox: function (elem) {
                return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
            },
            file: function (elem) {
                return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
            },
            password: function (elem) {
                return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
            },
            submit: function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && "submit" === elem.type;
            },
            image: function (elem) {
                return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
            },
            reset: function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && "reset" === elem.type;
            },
            button: function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && "button" === elem.type || name === "button";
            },
            input: function (elem) {
                return (/input|select|textarea|button/i).test(elem.nodeName);
            },
            focus: function (elem) {
                return elem === elem.ownerDocument.activeElement;
            }
        },
        setFilters: {
            first: function (elem, i) {
                return i === 0;
            },
            last: function (elem, i, match, array) {
                return i === array.length - 1;
            },
            even: function (elem, i) {
                return i % 2 === 0;
            },
            odd: function (elem, i) {
                return i % 2 === 1;
            },
            lt: function (elem, i, match) {
                return i < match[3] - 0;
            },
            gt: function (elem, i, match) {
                return i > match[3] - 0;
            },
            nth: function (elem, i, match) {
                return match[3] - 0 === i;
            },
            eq: function (elem, i, match) {
                return match[3] - 0 === i;
            }
        },
        filter: {
            PSEUDO: function (elem, match, i, array) {
                var name = match[1],
                    filter = Expr.filters[name];
                if (filter) {
                    return filter(elem, i, match, array);
                } else if (name === "contains") {
                    return (elem.textContent || elem.innerText || Sizzle.getText([elem]) || "").indexOf(match[3]) >= 0;
                } else if (name === "not") {
                    var not = match[3];
                    for (var j = 0, l = not.length; j < l; j++) {
                        if (not[j] === elem) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    Sizzle.error(name);
                }
            },
            CHILD: function (elem, match) {
                var type = match[1],
                    node = elem;
                switch (type) {
                case "only":
                case "first":
                    while ((node = node.previousSibling)) {
                        if (node.nodeType === 1) {
                            return false;
                        }
                    }
                    if (type === "first") {
                        return true;
                    }
                    node = elem;
                case "last":
                    while ((node = node.nextSibling)) {
                        if (node.nodeType === 1) {
                            return false;
                        }
                    }
                    return true;
                case "nth":
                    var first = match[2],
                        last = match[3];
                    if (first === 1 && last === 0) {
                        return true;
                    }
                    var doneName = match[0],
                        parent = elem.parentNode;
                    if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                        var count = 0;
                        for (node = parent.firstChild; node; node = node.nextSibling) {
                            if (node.nodeType === 1) {
                                node.nodeIndex = ++count;
                            }
                        }
                        parent.sizcache = doneName;
                    }
                    var diff = elem.nodeIndex - last;
                    if (first === 0) {
                        return diff === 0;
                    } else {
                        return (diff % first === 0 && diff / first >= 0);
                    }
                }
            },
            ID: function (elem, match) {
                return elem.nodeType === 1 && elem.getAttribute("id") === match;
            },
            TAG: function (elem, match) {
                return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
            },
            CLASS: function (elem, match) {
                return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
            },
            ATTR: function (elem, match) {
                var name = match[1],
                    result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name),
                    value = result + "",
                    type = match[2],
                    check = match[4];
                return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
            },
            POS: function (elem, match, i, array) {
                var name = match[2],
                    filter = Expr.setFilters[name];
                if (filter) {
                    return filter(elem, i, match, array);
                }
            }
        }
    };
    var origPOS = Expr.match.POS,
        fescape = function (all, num) {
            return "\\" + (num - 0 + 1);
        };
    for (var type in Expr.match) {
        Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
        Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
    }
    var makeArray = function (array, results) {
        array = Array.prototype.slice.call(array, 0);
        if (results) {
            results.push.apply(results, array);
            return results;
        }
        return array;
    };
    try {
        Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
    } catch (e) {
        makeArray = function (array, results) {
            var i = 0,
                ret = results || [];
            if (toString.call(array) === "[object Array]") {
                Array.prototype.push.apply(ret, array);
            } else {
                if (typeof array.length === "number") {
                    for (var l = array.length; i < l; i++) {
                        ret.push(array[i]);
                    }
                } else {
                    for (; array[i]; i++) {
                        ret.push(array[i]);
                    }
                }
            }
            return ret;
        };
    }
    var sortOrder, siblingCheck;
    if (document.documentElement.compareDocumentPosition) {
        sortOrder = function (a, b) {
            if (a === b) {
                hasDuplicate = true;
                return 0;
            }
            if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                return a.compareDocumentPosition ? -1 : 1;
            }
            return a.compareDocumentPosition(b) & 4 ? -1 : 1;
        };
    } else {
        sortOrder = function (a, b) {
            if (a === b) {
                hasDuplicate = true;
                return 0;
            } else if (a.sourceIndex && b.sourceIndex) {
                return a.sourceIndex - b.sourceIndex;
            }
            var al, bl, ap = [],
                bp = [],
                aup = a.parentNode,
                bup = b.parentNode,
                cur = aup;
            if (aup === bup) {
                return siblingCheck(a, b);
            } else if (!aup) {
                return -1;
            } else if (!bup) {
                return 1;
            }
            while (cur) {
                ap.unshift(cur);
                cur = cur.parentNode;
            }
            cur = bup;
            while (cur) {
                bp.unshift(cur);
                cur = cur.parentNode;
            }
            al = ap.length;
            bl = bp.length;
            for (var i = 0; i < al && i < bl; i++) {
                if (ap[i] !== bp[i]) {
                    return siblingCheck(ap[i], bp[i]);
                }
            }
            return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
        };
        siblingCheck = function (a, b, ret) {
            if (a === b) {
                return ret;
            }
            var cur = a.nextSibling;
            while (cur) {
                if (cur === b) {
                    return -1;
                }
                cur = cur.nextSibling;
            }
            return 1;
        };
    }
    Sizzle.getText = function (elems) {
        var ret = "",
            elem;
        for (var i = 0; elems[i]; i++) {
            elem = elems[i];
            if (elem.nodeType === 3 || elem.nodeType === 4) {
                ret += elem.nodeValue;
            } else if (elem.nodeType !== 8) {
                ret += Sizzle.getText(elem.childNodes);
            }
        }
        return ret;
    };
    (function () {
        var form = document.createElement("div"),
            id = "script" + (new Date()).getTime(),
            root = document.documentElement;
        form.innerHTML = "<a name='" + id + "'/>";
        root.insertBefore(form, root.firstChild);
        if (document.getElementById(id)) {
            Expr.find.ID = function (match, context, isXML) {
                if (typeof context.getElementById !== "undefined" && !isXML) {
                    var m = context.getElementById(match[1]);
                    return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
                }
            };
            Expr.filter.ID = function (elem, match) {
                var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return elem.nodeType === 1 && node && node.nodeValue === match;
            };
        }
        root.removeChild(form);
        root = form = null;
    })();
    (function () {
        var div = document.createElement("div");
        div.appendChild(document.createComment(""));
        if (div.getElementsByTagName("*").length > 0) {
            Expr.find.TAG = function (match, context) {
                var results = context.getElementsByTagName(match[1]);
                if (match[1] === "*") {
                    var tmp = [];
                    for (var i = 0; results[i]; i++) {
                        if (results[i].nodeType === 1) {
                            tmp.push(results[i]);
                        }
                    }
                    results = tmp;
                }
                return results;
            };
        }
        div.innerHTML = "<a href='#'></a>";
        if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
            Expr.attrHandle.href = function (elem) {
                return elem.getAttribute("href", 2);
            };
        }
        div = null;
    })();
    if (document.querySelectorAll) {
        (function () {
            var oldSizzle = Sizzle,
                div = document.createElement("div"),
                id = "__sizzle__";
            div.innerHTML = "<p class='TEST'></p>";
            if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                return;
            }
            Sizzle = function (query, context, extra, seed) {
                context = context || document;
                if (!seed && !Sizzle.isXML(context)) {
                    var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);
                    if (match && (context.nodeType === 1 || context.nodeType === 9)) {
                        if (match[1]) {
                            return makeArray(context.getElementsByTagName(query), extra);
                        } else if (match[2] && Expr.find.CLASS && context.getElementsByClassName) {
                            return makeArray(context.getElementsByClassName(match[2]), extra);
                        }
                    }
                    if (context.nodeType === 9) {
                        if (query === "body" && context.body) {
                            return makeArray([context.body], extra);
                        } else if (match && match[3]) {
                            var elem = context.getElementById(match[3]);
                            if (elem && elem.parentNode) {
                                if (elem.id === match[3]) {
                                    return makeArray([elem], extra);
                                }
                            } else {
                                return makeArray([], extra);
                            }
                        }
                        try {
                            return makeArray(context.querySelectorAll(query), extra);
                        } catch (qsaError) {}
                    } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                        var oldContext = context,
                            old = context.getAttribute("id"),
                            nid = old || id,
                            hasParent = context.parentNode,
                            relativeHierarchySelector = /^\s*[+~]/.test(query);
                        if (!old) {
                            context.setAttribute("id", nid);
                        } else {
                            nid = nid.replace(/'/g, "\\$&");
                        }
                        if (relativeHierarchySelector && hasParent) {
                            context = context.parentNode;
                        }
                        try {
                            if (!relativeHierarchySelector || hasParent) {
                                return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
                            }
                        } catch (pseudoError) {} finally {
                            if (!old) {
                                oldContext.removeAttribute("id");
                            }
                        }
                    }
                }
                return oldSizzle(query, context, extra, seed);
            };
            for (var prop in oldSizzle) {
                Sizzle[prop] = oldSizzle[prop];
            }
            div = null;
        })();
    }
    (function () {
        var html = document.documentElement,
            matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;
        if (matches) {
            var disconnectedMatch = !matches.call(document.createElement("div"), "div"),
                pseudoWorks = false;
            try {
                matches.call(document.documentElement, "[test!='']:sizzle");
            } catch (pseudoError) {
                pseudoWorks = true;
            }
            Sizzle.matchesSelector = function (node, expr) {
                expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                if (!Sizzle.isXML(node)) {
                    try {
                        if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                            var ret = matches.call(node, expr);
                            if (ret || !disconnectedMatch || node.document && node.document.nodeType !== 11) {
                                return ret;
                            }
                        }
                    } catch (e) {}
                }
                return Sizzle(expr, null, null, [node]).length > 0;
            };
        }
    })();
    (function () {
        var div = document.createElement("div");
        div.innerHTML = "<div class='test e'></div><div class='test'></div>";
        if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
            return;
        }
        div.lastChild.className = "e";
        if (div.getElementsByClassName("e").length === 1) {
            return;
        }
        Expr.order.splice(1, 0, "CLASS");
        Expr.find.CLASS = function (match, context, isXML) {
            if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                return context.getElementsByClassName(match[1]);
            }
        };
        div = null;
    })();

    function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
        for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
                var match = false;
                elem = elem[dir];
                while (elem) {
                    if (elem.sizcache === doneName) {
                        match = checkSet[elem.sizset];
                        break;
                    }
                    if (elem.nodeType === 1 && !isXML) {
                        elem.sizcache = doneName;
                        elem.sizset = i;
                    }
                    if (elem.nodeName.toLowerCase() === cur) {
                        match = elem;
                        break;
                    }
                    elem = elem[dir];
                }
                checkSet[i] = match;
            }
        }
    }

    function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
        for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
                var match = false;
                elem = elem[dir];
                while (elem) {
                    if (elem.sizcache === doneName) {
                        match = checkSet[elem.sizset];
                        break;
                    }
                    if (elem.nodeType === 1) {
                        if (!isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }
                        if (typeof cur !== "string") {
                            if (elem === cur) {
                                match = true;
                                break;
                            }
                        } else if (Sizzle.filter(cur, [elem]).length > 0) {
                            match = elem;
                            break;
                        }
                    }
                    elem = elem[dir];
                }
                checkSet[i] = match;
            }
        }
    }
    if (document.documentElement.contains) {
        Sizzle.contains = function (a, b) {
            return a !== b && (a.contains ? a.contains(b) : true);
        };
    } else if (document.documentElement.compareDocumentPosition) {
        Sizzle.contains = function (a, b) {
            return !!(a.compareDocumentPosition(b) & 16);
        };
    } else {
        Sizzle.contains = function () {
            return false;
        };
    }
    Sizzle.isXML = function (elem) {
        var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    var posProcess = function (selector, context) {
        var match, tmpSet = [],
            later = "",
            root = context.nodeType ? [context] : context;
        while ((match = Expr.match.PSEUDO.exec(selector))) {
            later += match[0];
            selector = selector.replace(Expr.match.PSEUDO, "");
        }
        selector = Expr.relative[selector] ? selector + "*" : selector;
        for (var i = 0, l = root.length; i < l; i++) {
            Sizzle(selector, root[i], tmpSet);
        }
        return Sizzle.filter(later, tmpSet);
    };
    window.Sizzle = Sizzle;
})();
Prototype._original_property = window.Sizzle;;
(function (engine) {
    var extendElements = Prototype.Selector.extendElements;

    function select(selector, scope) {
        return extendElements(engine(selector, scope || document));
    }

    function match(element, selector) {
        return engine.matches(selector, [element]).length == 1;
    }
    Prototype.Selector.engine = engine;
    Prototype.Selector.select = select;
    Prototype.Selector.match = match;
})(Sizzle);
window.Sizzle = Prototype._original_property;
delete Prototype._original_property;
var Form = {
    reset: function (form) {
        form = $(form);
        form.reset();
        return form;
    },
    serializeElements: function (elements, options) {
        if (typeof options != 'object') options = {
            hash: !! options
        };
        else if (Object.isUndefined(options.hash)) options.hash = true;
        var key, value, submitted = false,
            submit = options.submit,
            accumulator, initial;
        if (options.hash) {
            initial = {};
            accumulator = function (result, key, value) {
                if (key in result) {
                    if (!Object.isArray(result[key])) result[key] = [result[key]];
                    result[key].push(value);
                } else result[key] = value;
                return result;
            };
        } else {
            initial = '';
            accumulator = function (result, key, value) {
                value = value.gsub(/(\r)?\n/, '\r\n');
                value = encodeURIComponent(value);
                value = value.gsub(/%20/, '+');
                return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
            }
        }
        return elements.inject(initial, function (result, element) {
            if (!element.disabled && element.name) {
                key = element.name;
                value = $(element).getValue();
                if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted && submit !== false && (!submit || key == submit) && (submitted = true)))) {
                    result = accumulator(result, key, value);
                }
            }
            return result;
        });
    }
};
Form.Methods = {
    serialize: function (form, options) {
        return Form.serializeElements(Form.getElements(form), options);
    },
    getElements: function (form) {
        var elements = $(form).getElementsByTagName('*');
        var element, results = [],
            serializers = Form.Element.Serializers;
        for (var i = 0; element = elements[i]; i++) {
            if (serializers[element.tagName.toLowerCase()])
                results.push(Element.extend(element));
        }
        return results;
    },
    getInputs: function (form, typeName, name) {
        form = $(form);
        var inputs = form.getElementsByTagName('input');
        if (!typeName && !name) return $A(inputs).map(Element.extend);
        for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
            var input = inputs[i];
            if ((typeName && input.type != typeName) || (name && input.name != name))
                continue;
            matchingInputs.push(Element.extend(input));
        }
        return matchingInputs;
    },
    disable: function (form) {
        form = $(form);
        Form.getElements(form).invoke('disable');
        return form;
    },
    enable: function (form) {
        form = $(form);
        Form.getElements(form).invoke('enable');
        return form;
    },
    findFirstElement: function (form) {
        var elements = $(form).getElements().findAll(function (element) {
            return 'hidden' != element.type && !element.disabled;
        });
        var firstByIndex = elements.findAll(function (element) {
            return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
        }).sortBy(function (element) {
            return element.tabIndex
        }).first();
        return firstByIndex ? firstByIndex : elements.find(function (element) {
            return /^(?:input|select|textarea)$/i.test(element.tagName);
        });
    },
    focusFirstElement: function (form) {
        form = $(form);
        var element = form.findFirstElement();
        if (element) element.activate();
        return form;
    },
    request: function (form, options) {
        form = $(form), options = Object.clone(options || {});
        var params = options.parameters,
            action = form.readAttribute('action') || '';
        if (action.blank()) action = window.location.href;
        options.parameters = form.serialize(true);
        if (params) {
            if (Object.isString(params)) params = params.toQueryParams();
            Object.extend(options.parameters, params);
        }
        if (form.hasAttribute('method') && !options.method)
            options.method = form.method;
        return new Ajax.Request(action, options);
    }
};
Form.Element = {
    focus: function (element) {
        $(element).focus();
        return element;
    },
    select: function (element) {
        $(element).select();
        return element;
    }
};
Form.Element.Methods = {
    serialize: function (element) {
        element = $(element);
        if (!element.disabled && element.name) {
            var value = element.getValue();
            if (value != undefined) {
                var pair = {};
                pair[element.name] = value;
                return Object.toQueryString(pair);
            }
        }
        return '';
    },
    getValue: function (element) {
        element = $(element);
        var method = element.tagName.toLowerCase();
        return Form.Element.Serializers[method](element);
    },
    setValue: function (element, value) {
        element = $(element);
        var method = element.tagName.toLowerCase();
        Form.Element.Serializers[method](element, value);
        return element;
    },
    clear: function (element) {
        $(element).value = '';
        return element;
    },
    present: function (element) {
        return $(element).value != '';
    },
    activate: function (element) {
        element = $(element);
        try {
            element.focus();
            if (element.select && (element.tagName.toLowerCase() != 'input' || !(/^(?:button|reset|submit)$/i.test(element.type))))
                element.select();
        } catch (e) {}
        return element;
    },
    disable: function (element) {
        element = $(element);
        element.disabled = true;
        return element;
    },
    enable: function (element) {
        element = $(element);
        element.disabled = false;
        return element;
    }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = (function () {
    function input(element, value) {
        switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
            return inputSelector(element, value);
        default:
            return valueSelector(element, value);
        }
    }

    function inputSelector(element, value) {
        if (Object.isUndefined(value))
            return element.checked ? element.value : null;
        else element.checked = !! value;
    }

    function valueSelector(element, value) {
        if (Object.isUndefined(value)) return element.value;
        else element.value = value;
    }

    function select(element, value) {
        if (Object.isUndefined(value))
            return (element.type === 'select-one' ? selectOne : selectMany)(element);
        var opt, currentValue, single = !Object.isArray(value);
        for (var i = 0, length = element.length; i < length; i++) {
            opt = element.options[i];
            currentValue = this.optionValue(opt);
            if (single) {
                if (currentValue == value) {
                    opt.selected = true;
                    return;
                }
            } else opt.selected = value.include(currentValue);
        }
    }

    function selectOne(element) {
        var index = element.selectedIndex;
        return index >= 0 ? optionValue(element.options[index]) : null;
    }

    function selectMany(element) {
        var values, length = element.length;
        if (!length) return null;
        for (var i = 0, values = []; i < length; i++) {
            var opt = element.options[i];
            if (opt.selected) values.push(optionValue(opt));
        }
        return values;
    }

    function optionValue(opt) {
        return Element.hasAttribute(opt, 'value') ? opt.value : opt.text;
    }
    return {
        input: input,
        inputSelector: inputSelector,
        textarea: valueSelector,
        select: select,
        selectOne: selectOne,
        selectMany: selectMany,
        optionValue: optionValue,
        button: valueSelector
    };
})();
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function ($super, element, frequency, callback) {
        $super(callback, frequency);
        this.element = $(element);
        this.lastValue = this.getValue();
    },
    execute: function () {
        var value = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(value) ? this.lastValue != value : String(this.lastValue) != String(value)) {
            this.callback(this.element, value);
            this.lastValue = value;
        }
    }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element);
    }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.serialize(this.element);
    }
});
Abstract.EventObserver = Class.create({
    initialize: function (element, callback) {
        this.element = $(element);
        this.callback = callback;
        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == 'form')
            this.registerFormCallbacks();
        else
            this.registerCallback(this.element);
    },
    onElementEvent: function () {
        var value = this.getValue();
        if (this.lastValue != value) {
            this.callback(this.element, value);
            this.lastValue = value;
        }
    },
    registerFormCallbacks: function () {
        Form.getElements(this.element).each(this.registerCallback, this);
    },
    registerCallback: function (element) {
        if (element.type) {
            switch (element.type.toLowerCase()) {
            case 'checkbox':
            case 'radio':
                Event.observe(element, 'click', this.onElementEvent.bind(this));
                break;
            default:
                Event.observe(element, 'change', this.onElementEvent.bind(this));
                break;
            }
        }
    }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element);
    }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.serialize(this.element);
    }
});
(function (GLOBAL) {
    var DIV = document.createElement('div');
    var docEl = document.documentElement;
    var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl && 'onmouseleave' in docEl;
    var Event = {
        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_RETURN: 13,
        KEY_ESC: 27,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_DELETE: 46,
        KEY_HOME: 36,
        KEY_END: 35,
        KEY_PAGEUP: 33,
        KEY_PAGEDOWN: 34,
        KEY_INSERT: 45
    };
    var isIELegacyEvent = function (event) {
        return false;
    };
    if (window.attachEvent) {
        if (window.addEventListener) {
            isIELegacyEvent = function (event) {
                return !(event instanceof window.Event);
            };
        } else {
            isIELegacyEvent = function (event) {
                return true;
            };
        }
    }
    var _isButton;

    function _isButtonForDOMEvents(event, code) {
        return event.which ? (event.which === code + 1) : (event.button === code);
    }
    var legacyButtonMap = {
        0: 1,
        1: 4,
        2: 2
    };

    function _isButtonForLegacyEvents(event, code) {
        return event.button === legacyButtonMap[code];
    }

    function _isButtonForWebKit(event, code) {
        switch (code) {
        case 0:
            return event.which == 1 && !event.metaKey;
        case 1:
            return event.which == 2 || (event.which == 1 && event.metaKey);
        case 2:
            return event.which == 3;
        default:
            return false;
        }
    }
    if (window.attachEvent) {
        if (!window.addEventListener) {
            _isButton = _isButtonForLegacyEvents;
        } else {
            _isButton = function (event, code) {
                return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) : _isButtonForDOMEvents(event, code);
            }
        }
    } else if (Prototype.Browser.WebKit) {
        _isButton = _isButtonForWebKit;
    } else {
        _isButton = _isButtonForDOMEvents;
    }

    function isLeftClick(event) {
        return _isButton(event, 0)
    }

    function isMiddleClick(event) {
        return _isButton(event, 1)
    }

    function isRightClick(event) {
        return _isButton(event, 2)
    }

    function element(event) {
        return Element.extend(_element(event));
    }

    function _element(event) {
        event = Event.extend(event);
        var node = event.target,
            type = event.type,
            currentTarget = event.currentTarget;
        if (currentTarget && currentTarget.tagName) {
            if (type === 'load' || type === 'error' || (type === 'click' && currentTarget.tagName.toLowerCase() === 'input' && currentTarget.type === 'radio'))
                node = currentTarget;
        }
        if (node.nodeType == Node.TEXT_NODE)
            node = node.parentNode;
        return Element.extend(node);
    }

    function findElement(event, expression) {
        var element = _element(event),
            match = Prototype.Selector.match;
        if (!expression) return Element.extend(element);
        while (element) {
            if (Object.isElement(element) && match(element, expression))
                return Element.extend(element);
            element = element.parentNode;
        }
    }

    function pointer(event) {
        return {
            x: pointerX(event),
            y: pointerY(event)
        };
    }

    function pointerX(event) {
        var docElement = document.documentElement,
            body = document.body || {
                scrollLeft: 0
            };
        return event.pageX || (event.clientX +
            (docElement.scrollLeft || body.scrollLeft) -
            (docElement.clientLeft || 0));
    }

    function pointerY(event) {
        var docElement = document.documentElement,
            body = document.body || {
                scrollTop: 0
            };
        return event.pageY || (event.clientY +
            (docElement.scrollTop || body.scrollTop) -
            (docElement.clientTop || 0));
    }

    function stop(event) {
        Event.extend(event);
        event.preventDefault();
        event.stopPropagation();
        event.stopped = true;
    }
    Event.Methods = {
        isLeftClick: isLeftClick,
        isMiddleClick: isMiddleClick,
        isRightClick: isRightClick,
        element: element,
        findElement: findElement,
        pointer: pointer,
        pointerX: pointerX,
        pointerY: pointerY,
        stop: stop
    };
    var methods = Object.keys(Event.Methods).inject({}, function (m, name) {
        m[name] = Event.Methods[name].methodize();
        return m;
    });
    if (window.attachEvent) {
        function _relatedTarget(event) {
            var element;
            switch (event.type) {
            case 'mouseover':
            case 'mouseenter':
                element = event.fromElement;
                break;
            case 'mouseout':
            case 'mouseleave':
                element = event.toElement;
                break;
            default:
                return null;
            }
            return Element.extend(element);
        }
        var additionalMethods = {
            stopPropagation: function () {
                this.cancelBubble = true
            },
            preventDefault: function () {
                this.returnValue = false
            },
            inspect: function () {
                return '[object Event]'
            }
        };
        Event.extend = function (event, element) {
            if (!event) return false;
            if (!isIELegacyEvent(event)) return event;
            if (event._extendedByPrototype) return event;
            event._extendedByPrototype = Prototype.emptyFunction;
            var pointer = Event.pointer(event);
            Object.extend(event, {
                target: event.srcElement || element,
                relatedTarget: _relatedTarget(event),
                pageX: pointer.x,
                pageY: pointer.y
            });
            Object.extend(event, methods);
            Object.extend(event, additionalMethods);
            return event;
        };
    } else {
        Event.extend = Prototype.K;
    }
    if (window.addEventListener) {
        Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
        Object.extend(Event.prototype, methods);
    }
    var EVENT_TRANSLATIONS = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
    };

    function getDOMEventName(eventName) {
        return EVENT_TRANSLATIONS[eventName] || eventName;
    }
    if (MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED)
        getDOMEventName = Prototype.K;

    function getUniqueElementID(element) {
        if (element === window) return 0;
        if (typeof element._prototypeUID === 'undefined')
            element._prototypeUID = Element.Storage.UID++;
        return element._prototypeUID;
    }

    function getUniqueElementID_IE(element) {
        if (element === window) return 0;
        if (element == document) return 1;
        return element.uniqueID;
    }
    if ('uniqueID' in DIV)
        getUniqueElementID = getUniqueElementID_IE;

    function isCustomEvent(eventName) {
        return eventName.include(':');
    }
    Event._isCustomEvent = isCustomEvent;

    function getRegistryForElement(element, uid) {
        var CACHE = GLOBAL.Event.cache;
        if (Object.isUndefined(uid))
            uid = getUniqueElementID(element);
        if (!CACHE[uid]) CACHE[uid] = {
            element: element
        };
        return CACHE[uid];
    }

    function destroyRegistryForElement(element, uid) {
        if (Object.isUndefined(uid))
            uid = getUniqueElementID(element);
        delete GLOBAL.Event.cache[uid];
    }

    function register(element, eventName, handler) {
        var registry = getRegistryForElement(element);
        if (!registry[eventName]) registry[eventName] = [];
        var entries = registry[eventName];
        var i = entries.length;
        while (i--)
            if (entries[i].handler === handler) return null;
        var uid = getUniqueElementID(element);
        var responder = GLOBAL.Event._createResponder(uid, eventName, handler);
        var entry = {
            responder: responder,
            handler: handler
        };
        entries.push(entry);
        return entry;
    }

    function unregister(element, eventName, handler) {
        var registry = getRegistryForElement(element);
        var entries = registry[eventName];
        if (!entries) return;
        var i = entries.length,
            entry;
        while (i--) {
            if (entries[i].handler === handler) {
                entry = entries[i];
                break;
            }
        }
        if (!entry) return;
        var index = entries.indexOf(entry);
        entries.splice(index, 1);
        return entry;
    }

    function observe(element, eventName, handler) {
        element = $(element);
        var entry = register(element, eventName, handler);
        if (entry === null) return element;
        var responder = entry.responder;
        if (isCustomEvent(eventName))
            observeCustomEvent(element, eventName, responder);
        else
            observeStandardEvent(element, eventName, responder);
        return element;
    }

    function observeStandardEvent(element, eventName, responder) {
        var actualEventName = getDOMEventName(eventName);
        if (element.addEventListener) {
            element.addEventListener(actualEventName, responder, false);
        } else {
            element.attachEvent('on' + actualEventName, responder);
        }
    }

    function observeCustomEvent(element, eventName, responder) {
        if (element.addEventListener) {
            element.addEventListener('dataavailable', responder, false);
        } else {
            element.attachEvent('ondataavailable', responder);
            element.attachEvent('onlosecapture', responder);
        }
    }

    function stopObserving(element, eventName, handler) {
        element = $(element);
        var handlerGiven = !Object.isUndefined(handler),
            eventNameGiven = !Object.isUndefined(eventName);
        if (!eventNameGiven && !handlerGiven) {
            stopObservingElement(element);
            return element;
        }
        if (!handlerGiven) {
            stopObservingEventName(element, eventName);
            return element;
        }
        var entry = unregister(element, eventName, handler);
        if (!entry) return element;
        removeEvent(element, eventName, entry.responder);
        return element;
    }

    function stopObservingStandardEvent(element, eventName, responder) {
        var actualEventName = getDOMEventName(eventName);
        if (element.removeEventListener) {
            element.removeEventListener(actualEventName, responder, false);
        } else {
            element.detachEvent('on' + actualEventName, responder);
        }
    }

    function stopObservingCustomEvent(element, eventName, responder) {
        if (element.removeEventListener) {
            element.removeEventListener('dataavailable', responder, false);
        } else {
            element.detachEvent('ondataavailable', responder);
            element.detachEvent('onlosecapture', responder);
        }
    }

    function stopObservingElement(element) {
        var uid = getUniqueElementID(element),
            registry = getRegistryForElement(element, uid);
        destroyRegistryForElement(element, uid);
        var entries, i;
        for (var eventName in registry) {
            if (eventName === 'element') continue;
            entries = registry[eventName];
            i = entries.length;
            while (i--)
                removeEvent(element, eventName, entries[i].responder);
        }
    }

    function stopObservingEventName(element, eventName) {
        var registry = getRegistryForElement(element);
        var entries = registry[eventName];
        if (!entries) return;
        delete registry[eventName];
        var i = entries.length;
        while (i--)
            removeEvent(element, eventName, entries[i].responder);
    }

    function removeEvent(element, eventName, handler) {
        if (isCustomEvent(eventName))
            stopObservingCustomEvent(element, eventName, handler);
        else
            stopObservingStandardEvent(element, eventName, handler);
    }

    function getFireTarget(element) {
        if (element !== document) return element;
        if (document.createEvent && !element.dispatchEvent)
            return document.documentElement;
        return element;
    }

    function fire(element, eventName, memo, bubble) {
        element = getFireTarget($(element));
        if (Object.isUndefined(bubble)) bubble = true;
        memo = memo || {};
        var event = fireEvent(element, eventName, memo, bubble);
        return Event.extend(event);
    }

    function fireEvent_DOM(element, eventName, memo, bubble) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('dataavailable', bubble, true);
        event.eventName = eventName;
        event.memo = memo;
        element.dispatchEvent(event);
        return event;
    }

    function fireEvent_IE(element, eventName, memo, bubble) {
        var event = document.createEventObject();
        event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';
        event.eventName = eventName;
        event.memo = memo;
        element.fireEvent(event.eventType, event);
        return event;
    }
    var fireEvent = document.createEvent ? fireEvent_DOM : fireEvent_IE;
    Event.Handler = Class.create({
        initialize: function (element, eventName, selector, callback) {
            this.element = $(element);
            this.eventName = eventName;
            this.selector = selector;
            this.callback = callback;
            this.handler = this.handleEvent.bind(this);
        },
        start: function () {
            Event.observe(this.element, this.eventName, this.handler);
            return this;
        },
        stop: function () {
            Event.stopObserving(this.element, this.eventName, this.handler);
            return this;
        },
        handleEvent: function (event) {
            var element = Event.findElement(event, this.selector);
            if (element) this.callback.call(this.element, event, element);
        }
    });

    function on(element, eventName, selector, callback) {
        element = $(element);
        if (Object.isFunction(selector) && Object.isUndefined(callback)) {
            callback = selector, selector = null;
        }
        return new Event.Handler(element, eventName, selector, callback).start();
    }
    Object.extend(Event, Event.Methods);
    Object.extend(Event, {
        fire: fire,
        observe: observe,
        stopObserving: stopObserving,
        on: on
    });
    Element.addMethods({
        fire: fire,
        observe: observe,
        stopObserving: stopObserving,
        on: on
    });
    Object.extend(document, {
        fire: fire.methodize(),
        observe: observe.methodize(),
        stopObserving: stopObserving.methodize(),
        on: on.methodize(),
        loaded: false
    });
    if (GLOBAL.Event) Object.extend(window.Event, Event);
    else GLOBAL.Event = Event;
    GLOBAL.Event.cache = {};

    function destroyCache_IE() {
        GLOBAL.Event.cache = null;
    }
    if (window.attachEvent)
        window.attachEvent('onunload', destroyCache_IE);
    DIV = null;
    docEl = null;
})(this);
(function (GLOBAL) {
    var docEl = document.documentElement;
    var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl && 'onmouseleave' in docEl;

    function isSimulatedMouseEnterLeaveEvent(eventName) {
        return !MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED && (eventName === 'mouseenter' || eventName === 'mouseleave');
    }

    function createResponder(uid, eventName, handler) {
        if (Event._isCustomEvent(eventName))
            return createResponderForCustomEvent(uid, eventName, handler);
        if (isSimulatedMouseEnterLeaveEvent(eventName))
            return createMouseEnterLeaveResponder(uid, eventName, handler);
        return function (event) {
            var cacheEntry = Event.cache[uid];
            var element = cacheEntry.element;
            Event.extend(event, element);
            handler.call(element, event);
        };
    }

    function createResponderForCustomEvent(uid, eventName, handler) {
        return function (event) {
            var cacheEntry = Event.cache[uid],
                element = cacheEntry.element;
            if (Object.isUndefined(event.eventName))
                return false;
            if (event.eventName !== eventName)
                return false;
            Event.extend(event, element);
            handler.call(element, event);
        };
    }

    function createMouseEnterLeaveResponder(uid, eventName, handler) {
        return function (event) {
            var cacheEntry = Event.cache[uid],
                element = cacheEntry.element;
            Event.extend(event, element);
            var parent = event.relatedTarget;
            while (parent && parent !== element) {
                try {
                    parent = parent.parentNode;
                } catch (e) {
                    parent = element;
                }
            }
            if (parent === element) return;
            handler.call(element, event);
        }
    }
    GLOBAL.Event._createResponder = createResponder;
    docEl = null;
})(this);
(function (GLOBAL) {
    var TIMER;

    function fireContentLoadedEvent() {
        if (document.loaded) return;
        if (TIMER) window.clearTimeout(TIMER);
        document.loaded = true;
        document.fire('dom:loaded');
    }

    function checkReadyState() {
        if (document.readyState === 'complete') {
            document.detachEvent('onreadystatechange', checkReadyState);
            fireContentLoadedEvent();
        }
    }

    function pollDoScroll() {
        try {
            document.documentElement.doScroll('left');
        } catch (e) {
            TIMER = pollDoScroll.defer();
            return;
        }
        fireContentLoadedEvent();
    }
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
    } else {
        document.attachEvent('onreadystatechange', checkReadyState);
        if (window == top) TIMER = pollDoScroll.defer();
    }
    Event.observe(window, 'load', fireContentLoadedEvent);
})(this);
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
    Before: function (element, content) {
        return Element.insert(element, {
            before: content
        });
    },
    Top: function (element, content) {
        return Element.insert(element, {
            top: content
        });
    },
    Bottom: function (element, content) {
        return Element.insert(element, {
            bottom: content
        });
    },
    After: function (element, content) {
        return Element.insert(element, {
            after: content
        });
    }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
    includeScrollOffsets: false,
    prepare: function () {
        this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    },
    within: function (element, x, y) {
        if (this.includeScrollOffsets)
            return this.withinIncludingScrolloffsets(element, x, y);
        this.xcomp = x;
        this.ycomp = y;
        this.offset = Element.cumulativeOffset(element);
        return (y >= this.offset[1] && y < this.offset[1] + element.offsetHeight && x >= this.offset[0] && x < this.offset[0] + element.offsetWidth);
    },
    withinIncludingScrolloffsets: function (element, x, y) {
        var offsetcache = Element.cumulativeScrollOffset(element);
        this.xcomp = x + offsetcache[0] - this.deltaX;
        this.ycomp = y + offsetcache[1] - this.deltaY;
        this.offset = Element.cumulativeOffset(element);
        return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + element.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + element.offsetWidth);
    },
    overlap: function (mode, element) {
        if (!mode) return 0;
        if (mode == 'vertical')
            return ((this.offset[1] + element.offsetHeight) - this.ycomp) / element.offsetHeight;
        if (mode == 'horizontal')
            return ((this.offset[0] + element.offsetWidth) - this.xcomp) / element.offsetWidth;
    },
    cumulativeOffset: Element.Methods.cumulativeOffset,
    positionedOffset: Element.Methods.positionedOffset,
    absolutize: function (element) {
        Position.prepare();
        return Element.absolutize(element);
    },
    relativize: function (element) {
        Position.prepare();
        return Element.relativize(element);
    },
    realOffset: Element.Methods.cumulativeScrollOffset,
    offsetParent: Element.Methods.getOffsetParent,
    page: Element.Methods.viewportOffset,
    clone: function (source, target, options) {
        options = options || {};
        return Element.clonePosition(target, source, options);
    }
};
if (!document.getElementsByClassName) document.getElementsByClassName = function (instanceMethods) {
    function iter(name) {
        return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
    }
    instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function (element, className) {
        className = className.toString().strip();
        var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
        return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
    } : function (element, className) {
        className = className.toString().strip();
        var elements = [],
            classNames = (/\s/.test(className) ? $w(className) : null);
        if (!classNames && !className) return elements;
        var nodes = $(element).getElementsByTagName('*');
        className = ' ' + className + ' ';
        for (var i = 0, child, cn; child = nodes[i]; i++) {
            if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) || (classNames && classNames.all(function (name) {
                return !name.toString().blank() && cn.include(' ' + name + ' ');
            }))))
                elements.push(Element.extend(child));
        }
        return elements;
    };
    return function (className, parentElement) {
        return $(parentElement || document.body).getElementsByClassName(className);
    };
}(Element.Methods);
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function (element) {
        this.element = $(element);
    },
    _each: function (iterator, context) {
        this.element.className.split(/\s+/).select(function (name) {
            return name.length > 0;
        })._each(iterator, context);
    },
    set: function (className) {
        this.element.className = className;
    },
    add: function (classNameToAdd) {
        if (this.include(classNameToAdd)) return;
        this.set($A(this).concat(classNameToAdd).join(' '));
    },
    remove: function (classNameToRemove) {
        if (!this.include(classNameToRemove)) return;
        this.set($A(this).without(classNameToRemove).join(' '));
    },
    toString: function () {
        return $A(this).join(' ');
    }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
(function () {
    window.Selector = Class.create({
        initialize: function (expression) {
            this.expression = expression.strip();
        },
        findElements: function (rootElement) {
            return Prototype.Selector.select(this.expression, rootElement);
        },
        match: function (element) {
            return Prototype.Selector.match(element, this.expression);
        },
        toString: function () {
            return this.expression;
        },
        inspect: function () {
            return "#<Selector: " + this.expression + ">";
        }
    });
    Object.extend(Selector, {
        matchElements: function (elements, expression) {
            var match = Prototype.Selector.match,
                results = [];
            for (var i = 0, length = elements.length; i < length; i++) {
                var element = elements[i];
                if (match(element, expression)) {
                    results.push(Element.extend(element));
                }
            }
            return results;
        },
        findElement: function (elements, expression, index) {
            index = index || 0;
            var matchIndex = 0,
                element;
            for (var i = 0, length = elements.length; i < length; i++) {
                element = elements[i];
                if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
                    return Element.extend(element);
                }
            }
        },
        findChildElements: function (element, expressions) {
            var selector = expressions.toArray().join(', ');
            return Prototype.Selector.select(selector, element || document);
        }
    });
})();;
        /*
* GAME API
*/
function adRequest(params) 
{
    if (typeof GameAPI === 'object' && GameAPI !== null)
    {
        
            GameAPI.GameBreak.request(fnPause,fnResume);
        
    }
}
function fnPause()
{
    console.log('Pause Game')
}
function fnResume()
{
    console.log('resume game')
}