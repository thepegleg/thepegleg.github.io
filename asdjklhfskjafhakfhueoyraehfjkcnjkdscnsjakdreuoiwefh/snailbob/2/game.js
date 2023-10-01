var CRENDER_DEBUG = !1;
function ImagesPreloader() {
    function a() {
        var e = 0, f = 0, g;
        for (g in c.loadedImages)
            c.loadedImages[g].complete && e++, f++;
        e >= f ? c.endCallback && c.endCallback(c.loadedImages) : (c.processCallback && c.processCallback(Math.floor(e / f * c.maxProgressVal + c.minProgressVal)), setTimeout(a, 50))
    }
    var c = this;
    this.curItem = -1;
    this.loadedImages = {};
    this.processCallback = this.endCallback = this.data = null;
    this.minProgressVal = 0;
    this.maxProgressVal = 100;
    this.load = function(c, f, g) {
        this.data = c;
        this.endCallback = f;
        this.processCallback = g;
        for (c = 
        0; c < this.data.length; c++)
            f = this.data[c], g = new Image, g.src = f.src, this.loadedImages[f.name] = g;
        a()
    }
}
function SoundsPreloader(a, c, e) {
    this.sounds = a;
    this.endCallback = c;
    this.progressCallback = e;
    this.minProgressVal = this.loadedCount = 0;
    this.maxProgressVal = 100;
    var f = this;
    this.isMp3Support = function() {
        return "" != document.createElement("audio").canPlayType("audio/mpeg")
    };
    this.isWebAudio = function() {
        return window.AudioMixer && AudioMixer.isWebAudioSupport()
    };
    this.load = function() {
        if (!this.sounds || 1 > this.sounds.length)
            this.endCallback && this.endCallback();
        else
            for (var a = this.isMp3Support() ? "mp3" : "ogg", c, e, l = this.loadedCount = 
            0; l < this.sounds.length; l++)
                e = this.sounds[l] + "." + a, f.isWebAudio() ? (c = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"), c.open("GET", 
                e, !0),c.responseType = "arraybuffer", c.onreadystatechange = function() {
                    if (4 == this.readyState && 200 == this.status)
                        if (f.isWebAudio()) {
                            var a = this.soundSrc;
                            AudioMixer.waContext || (AudioMixer.waContext = new webkitAudioContext);
                            AudioMixer.waContext.decodeAudioData(this.response, function(c) {
                                AudioMixer.buffer[a] = c;
                                f.soundIsLoaded()
                            })
                        } else
                            f.soundIsLoaded()
                }, c.soundSrc = e, c.send()) : (c = document.createElement("audio"), c.src = e, c.type = "mp3" == a ? "audio/mpeg" : "audio/ogg", c.preload = "auto", c.load(), c.addEventListener("canplay", f.soundIsLoaded))
    };
    this.soundIsLoaded = function() {
        f.loadedCount++;
        f.progressCallback && f.progressCallback(Math.floor(f.loadedCount / f.sounds.length * f.maxProgressVal + f.minProgressVal));
        f.loadedCount >= f.sounds.length && f.endCallback && f.endCallback()
    }
}
var Utils = {touchScreen: "ontouchstart" in window,globalScale: 1,setCookie: function(a, c) {
        try {
            window.localStorage.setItem(a, c)
        } catch (e) {
            var f = new Date;
            f.setDate(f.getDate() + 3650);
            document.cookie = a + "=" + c + "; expires=" + f.toUTCString()
        }
    },getCookie: function(a) {
        var c;
        try {
            c = window.localStorage.getItem(a)
        } catch (e) {
            a += "=";
            c = document.cookie.indexOf(a);
            if (-1 == c)
                return null;
            var f = document.cookie.indexOf(";", c + a.length);
            -1 == f && (f = document.cookie.length);
            c = unescape(document.cookie.substring(c + a.length, f))
        }
        return c
    },
    bindEvent: function(a, c, e) {
        a.addEventListener ? a.addEventListener(c, e, !1) : a.attachEvent && a.attachEvent("on" + c, e)
    },getObjectLeft: function(a) {
        var c = a.offsetLeft;
        a.offsetParent && (c += Utils.getObjectLeft(a.offsetParent));
        return c
    },getObjectTop: function(a) {
        var c = a.offsetTop;
        a.offsetParent && (c += Utils.getObjectTop(a.offsetParent));
        return c
    },parseGet: function() {
        var a = {}, c = new String(window.location), e = c.indexOf("?");
        if (-1 != e)
            for (var c = c.substr(e + 1, c.length), e = c.split("&"), f = 0; f < e.length; f++)
                c = e[f].split("="), 
                a[c[0]] = c[1];
        return a
    },globalPixelScale: 1,getMouseCoord: function(a, c) {
        var e = a || window.event;
        e.touches && (e = e.touches[0]);
        if (!e)
            return {x: 0,y: 0};
        var f = 0, g = 0, h = 0, k = 0;
        c && (f = Utils.getObjectLeft(c), g = Utils.getObjectTop(c));
        if (e.pageX || e.pageY)
            h = e.pageX, k = e.pageY;
        else if (e.clientX || e.clientY)
            h = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft, k = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
        return {x: h - f,y: k - g}
    },extend: function(a, c) {
        var e = function() {
        };
        e.prototype = c.prototype;
        a.prototype = new e;
        a.prototype.constructor = a;
        a.superclass = c.prototype
    },removeFromArray: function(a, c) {
        for (var e = [], f = 0; f < a.length; f++)
            a[f] != c && e.push(a[f]);
        return e
    },showLoadProgress: function(a) {
        var c = Utils.globalScale, e;
        e = "Loading: " + a + "%<br><br>";
        e += '<div style="display: block; background: #000; width: ' + a * c * 2 + "px; height: " + 10 * c + 'px;">&nbsp;</div>';
        document.getElementById("progress").innerHTML = e
    },hideAddressBarLock: !1,
    mobileHideAddressBar: function() {
        Utils.hideAddressBarLock || window.scrollTo(0, 1)
    },mobileCheckIphone4: function() {
        return window.devicePixelRatio && -1 != navigator.userAgent.indexOf("iPhone") && 2 == window.devicePixelRatio ? !0 : !1
    },mobileCheckBrokenAndroid: function() {
        return window.devicePixelRatio && Utils.isAndroid() && !Utils.isChrome() && !Utils.isFirefox()
    },isChrome: function() {
        return 0 <= navigator.userAgent.toLowerCase().indexOf("chrome")
    },isAndroid: function() {
        return 0 <= navigator.userAgent.toLowerCase().indexOf("android")
    },
    isPlayFreeBrowser: function() {
        return 0 <= navigator.userAgent.toLowerCase().indexOf("playfreebrowser")
    },isFirefox: function() {
        return 0 <= navigator.userAgent.toLowerCase().indexOf("firefox")
    },checkSpilgamesEnvironment: function() {
        return "undefined" != typeof ExternalAPI && "Spilgames" == ExternalAPI.type && ExternalAPI.check()
    },mobileCorrectPixelRatio: function() {
        var a = document.createElement("meta");
        a.name = "viewport";
        var c = "target-densitydpi=device-dpi, user-scalable=0";
        Utils.isPlayFreeBrowser() && (c += ", width=device-width, height=device-height");
        var e = 1 / (window.devicePixelRatio ? window.devicePixelRatio : 1), e = e.toFixed(2);
        a.content = c + (", initial-scale=" + e + ", maximum-scale=" + e + ", minimum-scale=" + e);
        document.getElementsByTagName("head")[0].appendChild(a)
    },getMobileScreenResolution: function(a) {
        var c = 1, e = [{scale: 1,width: 320,height: 480}, {scale: 1.5,width: 480,height: 720}, {scale: 2,width: 640,height: 960}], f = {width: 0,height: 0}, g = "";
        Utils.touchScreen ? (f.width = Math.min(window.innerWidth, window.innerHeight), f.height = Math.max(window.innerWidth, window.innerHeight)) : 
        (f.width = window.innerWidth, f.height = window.innerHeight);
        for (var g = "height", h = Number.MAX_VALUE, k = 0; k < e.length; k++) {
            var l = Math.abs(f[g] - e[k][g]);
            h > l && (h = l, c = e[k].scale)
        }
        return Utils.getScaleScreenResolution(c, a)
    },getScaleScreenResolution: function(a, c) {
        var e, f;
        e = Math.round(320 * a);
        f = Math.round(480 * a);
        if (c) {
            var g = e;
            e = f;
            f = g
        }
        return {width: e,height: f,scale: a}
    },imagesRoot: "images",initialResolution: {width: 320,height: 480,scale: 1},createLayout: function(a, c, e, f) {
        var g = Utils.globalScale;
        Utils.initialResolution = 
        c;
        e = window.innerHeight;
        "orientation" in window ? e = 2048 : document.body.style.overflow = "hidden";
        g = "" + ('<div id="progress_container" align="center" style="width: 100%; height: ' + e + 'px; display: block; width: 100%; position: absolute; left: 0px; top: 0px;">') + ('<table cellspacing="0" cellpadding="0"><tr><td id="progress" align="center" valign="middle" style="width: ' + c.width + "px; height: " + c.height + "px; color: #000; background: #fff; font-weight: bold; font-family: Verdana; font-size: " + 12 * g + 'px; vertical-align: middle;"></td></tr></table>');
        g += "</div>";
        g += '<div id="screen_background_container" style="width: 100%; height: ' + e + 'px; position: absolute; left: 0px; top: 0px; display: none; z-index: 2;">';
        g += '<div id="screen_background_wrapper" style="width: ' + c.width + "px; height: " + c.height + 'px; position: relative; left: 0px;">';
        f || (g += '<canvas id="screen_background" width="' + c.width + '" height="' + c.height + '"></canvas>');
        g += "</div>";
        g += "</div>";
        g += '<div id="screen_container" style="width: 100%; height: ' + e + 'px; position: absolute; left: 0px; top: 0px; display: none; z-index: 3;">';
        g += '<div id="screen_wrapper" width="' + c.width + '" height="' + c.height + '" style="width: ' + c.width + "px; height: " + c.height + 'px; position: relative; left: 0px;">';
        f || (g += '<canvas id="screen" style="position: absolute; left: 0px; top: 0px; z-index: 1000000;" width="' + c.width + '" height="' + c.height + '">You browser does not support this application :(</canvas>');
        g += "</div>";
        g += "</div>";
        a.innerHTML = g;
        a = document.createElement("div");
        a.setAttribute("id", "p2l_container");
        a.setAttribute("align", "center");
        c = c.width;
        a.setAttribute("style", "width: 100%; height: " + e + "px; position: absolute; left: 0px; top: 0px; visibility: hidden; z-index: 1000; background: #fff;");
        c = (c - 240) / 2;
        Utils.isPlayFreeBrowser() && (c /= 8);
        a.innerHTML = '<img id="p2l" src="' + Utils.imagesRoot + '/p2l.jpg" style="padding-top: ' + Math.floor(c) + 'px" />';
        document.body.appendChild(a);
        c = document.createElement("div");
        c.setAttribute("id", "mark");
        c.style.position = "fixed";
        c.style.right = "0px";
        c.style.bottom = "0px";
        c.style.width = "1px";
        c.style.height = "1px";
        c.style.background = 
        "";
        c.style.zIndex = "100000";
        document.body.appendChild(c);
        Utils.fitLayoutToScreen()
    },preventEvent: function(a) {
        a.preventDefault();
        a.stopPropagation();
        a.cancelBubble = !0;
        return a.returnValue = !1
    },addMobileListeners: function(a, c) {
        !c && navigator.userAgent.match(/(iPad|iPhone|iPod).*CPU.*OS 7_\d/i) || Utils.bindEvent(document.body, "touchstart", Utils.preventEvent);
        Utils.isPlayFreeBrowser() || Utils.bindEvent(window, "scroll", function(a) {
            setTimeout(Utils.mobileHideAddressBar, 300)
        });
        setInterval("Utils.checkOrientation(" + 
        (a ? "true" : "false") + ")", 500);
        setTimeout(Utils.mobileHideAddressBar, 500)
    },getWindowRect: function() {
        var a = document.getElementById("mark");
        return Utils.isAndroid() && a ? {width: window.innerWidth,height: a.offsetTop + 1} : {width: window.innerWidth,height: window.innerHeight}
    },storeOrient: null,noCheckOrient: !1,checkOrientation: function(a) {
        if (Utils.touchScreen && document.getElementById("screen_container")) {
            var c = Utils.parseGet();
            Utils.noCheckOrient || 1 == c.nocheckorient || (c = Utils.getWindowRect(), c = c.width > c.height, 
            Utils.storeOrient !== c && (Utils.storeOrient = c, c != a ? (Utils.dispatchEvent("lockscreen"), document.getElementById("p2l_container").style.visibility = "visible", document.getElementById("screen_background_container").style.display = "none", document.getElementById("screen_container").style.display = "none") : (Utils.dispatchEvent("unlockscreen"), document.getElementById("p2l_container").style.visibility = "hidden", document.getElementById("screen_background_container").style.display = "block", document.getElementById("screen_container").style.display = 
            "block"), Utils.checkSpilgamesEnvironment() && (document.getElementById("p2l_container").style.display = "none"), setTimeout(Utils.mobileHideAddressBar, 900), setTimeout(Utils.fitLayoutToScreen, 1E3)))
        }
    },fitLayoutTimer: null,addFitLayoutListeners: function() {
        Utils.fitLayoutTimer = setInterval(Utils.fitLayoutToScreen, 500)
    },removeFitLayoutListeners: function() {
        clearInterval(Utils.fitLayoutTimer)
    },fitLayoutLock: !1,fitLayoutCorrectHeight: 0,fitLayoutToScreen: function(a) {
        if (!Utils.fitLayoutLock) {
            var c, e, f, g;
            "object" == 
            typeof a && a.width || (g = Utils.getWindowRect(), e = g.width, f = g.height, Utils.checkSpilgamesEnvironment() && (f -= 25), f += Utils.fitLayoutCorrectHeight, a = {width: e,height: f});
            if (c = document.getElementById("screen_wrapper")) {
                c.initWidth || (c.initWidth = Utils.initialResolution.width, c.initHeight = Utils.initialResolution.height);
                e = c.initWidth;
                f = c.initHeight;
                var h = 1, h = a.width / e;
                a = a.height / f;
                h = h < a ? h : a;
                Utils.globalPixelScale = h;
                e = Math.floor(e * h);
                f = Math.floor(f * h);
                if (c.lastWidth != e || c.lastHeight != f) {
                    c.lastWidth = e;
                    c.lastHeight = 
                    f;
                    Utils.resizeElement("screen", e, f);
                    Utils.resizeElement("screen_background", e, f);
                    if (c = document.getElementById("progress"))
                        c.style.width = ~~e + "px", c.style.height = ~~f + "px";
                    if (c = document.getElementById("screen_wrapper"))
                        c.style.width = ~~e + "px", c.style.height = ~~f + "px", c.style.left = Math.floor((g.width - e) / 2) + "px";
                    if (c = document.getElementById("screen_background_wrapper"))
                        c.style.width = ~~e + "px", c.style.height = ~~f + "px", c.style.left = Math.floor((g.width - e) / 2) + "px";
                    if (c = document.getElementById("p2l_container"))
                        c.style.width = 
                        ~~g.width + "px", c.style.height = "2048px";
                    if (c = document.getElementById("screen_container"))
                        c.style.width = ~~g.width + "px", c.style.height = ~~g.height + "px";
                    if (c = document.getElementById("screen_background_container"))
                        c.style.width = ~~g.width + "px", c.style.height = ~~g.height + "px";
                    Utils.dispatchEvent("fitlayout");
                    Utils.isPlayFreeBrowser() && window.scrollTo(1, 2);
                    setTimeout(Utils.mobileHideAddressBar, 10)
                }
            }
        }
    },resizeElement: function(a, c, e) {
        if (a = document.getElementById(a))
            a.setAttribute("width", c), a.setAttribute("height", 
            e), a.style.width = c + "px", a.style.height = e + "px"
    },drawIphoneLimiter: function(a, c) {
        c ? a.drawRectangle(240, 295, 480, 54, "#f00", !0, 0.5, !0) : a.drawRectangle(160, 448, 320, 64, "#f00", !0, 0.5, !0)
    },drawGrid: function(a, c, e) {
        "undefined" == typeof c && (c = !1);
        "undefined" == typeof e && (e = "#FFF");
        var f = 1 / Utils.globalScale / Utils.globalPixelScale, g = c ? 480 : 320;
        c = c ? 320 : 480;
        for (var h = 10; h < g; h += 10) {
            var k = 0.1 + (h - 10) / 10 % 10 * 0.1;
            a.drawLine(h, 0, h, c, f, e, k)
        }
        for (h = 10; h < c; h += 10)
            k = 0.1 + (h - 10) / 10 % 10 * 0.1, a.drawLine(0, h, g, h, f, e, k)
    },drawScaleFix: function(a, 
    c) {
        0.75 == Utils.globalScale && (c ? a.drawRectangle(507, 160, 54, 320, "#000", !0, 1, !0) : a.drawRectangle(160, 507, 320, 54, "#000", !0, 1, !0));
        1.5 == Utils.globalScale && (c ? a.drawRectangle(510, 160, 60, 320, "#000", !0, 1, !0) : a.drawRectangle(160, 510, 320, 60, "#000", !0, 1, !0))
    },grad2radian: function(a) {
        return a / (180 / Math.PI)
    },radian2grad: function(a) {
        return 180 / Math.PI * a
    },eventsListeners: [],onlockscreen: null,onunlockscreen: null,onfitlayout: null,addEventListener: function(a, c) {
        EventsManager.addEvent(Utils, a, c)
    },removeEventListener: function(a, 
    c) {
        EventsManager.removeEvent(Utils, a, c)
    },dispatchEvent: function(a, c) {
        return EventsManager.dispatchEvent(Utils, a, c)
    }}, EventsManager = {addEvent: function(a, c, e) {
        if (a.eventsListeners) {
            for (var f = 0; f < a.eventsListeners.length; f++)
                if (a.eventsListeners[f].type === c && a.eventsListeners[f].callback === e)
                    return;
            a.eventsListeners.push({type: c,callback: e})
        }
    },removeEvent: function(a, c, e) {
        if (a.eventsListeners)
            for (var f = 0; f < a.eventsListeners.length; f++)
                if (a.eventsListeners[f].type === c && a.eventsListeners[f].callback === 
                e) {
                    a.eventsListeners = Utils.removeFromArray(a.eventsListeners, a.eventsListeners[f]);
                    break
                }
    },dispatchEvent: function(a, c, e) {
        if (a.eventsListeners) {
            var f;
            if ("function" == typeof a["on" + c] && (f = a["on" + c](e), !1 === f))
                return !1;
            for (var g = 0; g < a.eventsListeners.length; g++)
                if (a.eventsListeners[g].type === c && (f = a.eventsListeners[g].callback(e), !1 === f))
                    return !1
        }
    }}, ANCHOR_ALIGN_LEFT = -1, ANCHOR_ALIGN_CENTER = 0, ANCHOR_ALIGN_RIGHT = 1, ANCHOR_VALIGN_TOP = -1, ANCHOR_VALIGN_MIDDLE = 0, ANCHOR_VALIGN_BOTTOM = 1;
function Sprite(a, c, e, f, g) {
    this.uid = 0;
    this.stage = null;
    this.y = this.x = 0;
    this.width = c;
    this.height = e;
    this.offset = {left: 0,top: 0};
    this.anchor = {x: 0,y: 0};
    this.scaleY = this.scaleX = 1;
    this.zIndex = this.rotation = 0;
    this.visible = !0;
    this.opacity = 1;
    this.ignoreViewport = this["static"] = !1;
    this.animated = !0;
    this.currentFrame = 0;
    this.totalFrames = Math.max(1, ~~f);
    1 >= this.totalFrames && (this.animated = !1);
    this.currentLayer = 0;
    this.totalLayers = Math.max(1, ~~g);
    this.bitmap = a;
    this.mask = null;
    this.destroy = this.fillColor = !1;
    this.animStep = 
    0;
    this.animDelay = 1;
    this.dragged = this.drawAlways = !1;
    this.dragY = this.dragX = 0;
    this.getX = function() {
        return Math.round(this.x * Utils.globalScale)
    };
    this.getY = function() {
        return Math.round(this.y * Utils.globalScale)
    };
    this.getWidth = function() {
        return this.width * Math.abs(this.scaleX) * Utils.globalScale
    };
    this.getHeight = function() {
        return this.height * Math.abs(this.scaleY) * Utils.globalScale
    };
    this.startDrag = function(a, c) {
        this.dragged = !0;
        this.dragX = a;
        this.dragY = c
    };
    this.stopDrag = function() {
        this.dragged = !1;
        this.dragY = 
        this.dragX = 0
    };
    this.play = function() {
        this.animated = !0
    };
    this.stop = function() {
        this.animated = !1
    };
    this.gotoAndStop = function(a) {
        this.currentFrame = a;
        this.stop()
    };
    this.gotoAndPlay = function(a) {
        this.currentFrame = a;
        this.play()
    };
    this.removeTweens = function() {
        this.stage && this.stage.clearObjectTweens(this)
    };
    this.addTween = function(a, c, e, f, g, p) {
        if (this.stage) {
            var q = this[a];
            if (!isNaN(q))
                return a = stage.createTween(this, a, q, c, e, f), a.onchange = p, a.onfinish = g, a
        }
    };
    this.moveTo = function(a, c, e, f, g, p) {
        e = ~~e;
        0 >= e ? this.setPosition(a, 
        c) : ((a = this.addTween("x", a, e, f, g, p)) && a.play(), (c = this.addTween("y", c, e, f, a ? null : g, a ? null : p)) && c.play());
        return this
    };
    this.moveBy = function(a, c, e, f, g, p) {
        return this.moveTo(this.x + a, this.y + c, e, f, g, p)
    };
    this.fadeTo = function(a, c, e, f, g) {
        c = ~~c;
        0 >= c ? this.opacity = a : (a = this.addTween("opacity", a, c, e, f, g)) && a.play();
        return this
    };
    this.fadeBy = function(a, c, e, f, g) {
        a = Math.max(0, Math.min(1, this.opacity + a));
        return this.fadeTo(a, c, e, f, g)
    };
    this.rotateTo = function(a, c, e, f, g) {
        c = ~~c;
        0 >= c ? this.rotation = a : (a = this.addTween("rotation", 
        a, c, e, f, g)) && a.play();
        return this
    };
    this.rotateBy = function(a, c, e, f, g) {
        return this.rotateTo(this.rotation + a, c, e, f, g)
    };
    this.scaleTo = function(a, c, e, f, g) {
        c = ~~c;
        if (0 >= c)
            this.scaleX = this.scaleY = a;
        else {
            var p = this.addTween("scaleX", a, c, e, f, g);
            p && p.play();
            (a = this.addTween("scaleY", a, c, e, p ? null : f, p ? null : g)) && a.play()
        }
        return this
    };
    this.nextFrame = function() {
        this.dispatchEvent("enterframe", {target: this});
        this.animated && (this.animStep++, this.animStep >= this.animDelay && (this.currentFrame++, this.animStep = 0), this.currentFrame >= 
        this.totalFrames && (this.currentFrame = 0))
    };
    this.eventsWhenInvisible = !1;
    this.onbox2dsync = this.onremove = this.onadd = this.onrender = this.onprerender = this.onenterframe = this.onmousemove = this.oncontextmenu = this.onclick = this.onmouseup = this.onmousedown = this.onmouseout = this.onmouseover = null;
    this.mouseOn = !1;
    this.getPosition = function() {
        return {x: this.x,y: this.y}
    };
    this.setPosition = function(a, c) {
        if ("undefined" == typeof c && "undefined" != typeof a.x && "undefined" != typeof a.y)
            return this.setPosition(a.x, a.y);
        this.x = parseFloat(a);
        this.y = parseFloat(c)
    };
    this.getAnchor = function() {
        return this.anchor
    };
    this.setAnchor = function(a, c) {
        if ("undefined" == typeof c && "undefined" != typeof a.x && "undefined" != typeof a.y)
            return this.setAnchor(a.x, a.y);
        this.anchor.x = parseFloat(a);
        this.anchor.y = parseFloat(c)
    };
    this.alignAnchor = function(a, c) {
        a = parseInt(a);
        isNaN(a) && (a = ANCHOR_ALIGN_CENTER);
        0 > a && (a = ANCHOR_ALIGN_LEFT);
        0 < a && (a = ANCHOR_ALIGN_RIGHT);
        c = parseInt(c);
        isNaN(c) && (c = ANCHOR_VALIGN_MIDDLE);
        0 > c && (c = ANCHOR_VALIGN_TOP);
        0 < c && (c = ANCHOR_VALIGN_BOTTOM);
        this.anchor.x = 
        this.width * a / 2;
        this.anchor.y = this.height * c / 2;
        return this.getAnchor()
    };
    this.getAbsoluteAnchor = function() {
        return this.getPosition()
    };
    this.getRelativeCenter = function() {
        var a = this.getAnchor();
        if (0 == a.x && 0 == a.y)
            return a;
        a = new Vector(-a.x * this.scaleX, -a.y * this.scaleY);
        a.rotate(-this.rotation);
        return a
    };
    this.getAbsoluteCenter = function() {
        var a = this.getRelativeCenter(), a = {x: a.x,y: a.y};
        a.x += this.x;
        a.y += this.y;
        return a
    };
    this.getCenter = function() {
        return this.getAbsoluteCenter()
    };
    this.getDrawRectangle = function() {
        var a = 
        this.getCenter(), c = new Rectangle(0, 0, this.width * Math.abs(this.scaleX), this.height * Math.abs(this.scaleY), this.rotation);
        c.move(a.x, a.y);
        return c
    };
    this.getAABBRectangle = function() {
        var a = this.getDrawRectangle(), c = a.AABB[1].x - a.AABB[0].x, e = a.AABB[1].y - a.AABB[0].y;
        return new Rectangle(a.AABB[0].x + c / 2, a.AABB[0].y + e / 2, c, e, 0)
    };
    this.localToGlobal = function(a, c) {
        var e = "object" == typeof a && "undefined" != typeof a.x && "undefined" != typeof a.y ? new Vector(a.x + 0, a.y + 0) : new Vector(a, c);
        e.rotate(this.rotation).add(this.getPosition());
        return e
    };
    this.globalToLocal = function(a, c) {
        var e = "object" == typeof a && "undefined" != typeof a.x && "undefined" != typeof a.y ? new Vector(a.x + 0, a.y + 0) : new Vector(a, c);
        e.subtract(this.getPosition()).rotate(-this.rotation);
        return e
    };
    this.allowDebugDrawing = !0;
    this.debugDraw = function() {
        if (this.visible && this.allowDebugDrawing) {
            var a = this.getPosition(), c = this.getCenter(), e = this.getDrawRectangle(), f = this.getAABBRectangle();
            stage.drawCircle(a.x, a.y, 1, 1, "rgba(255,0,0,0.9)");
            stage.drawCircle(c.x, c.y, 1, 1, "rgba(0,255,0,0.9)");
            stage.drawLine(a.x, a.y, c.x, c.y, 1, "rgba(255,255,255,0.5)");
            stage.drawPolygon(e.vertices, 0.5, "rgba(255,0,255,0.5)", 1);
            stage.drawLine(f.vertices[0].x, f.vertices[0].y, f.vertices[2].x, f.vertices[2].y, 0.1, "rgba(255,255,255,0.5)");
            stage.drawLine(f.vertices[2].x, f.vertices[0].y, f.vertices[0].x, f.vertices[2].y, 0.1, "rgba(255,255,255,0.5)");
            stage.drawPolygon(f.vertices, 0.5, "rgba(255,255,255,0.5)")
        }
    };
    this.setZIndex = function(a) {
        this.zIndex = ~~a;
        this.stage && this.stage.setZIndex(this, ~~a)
    };
    this.eventsListeners = [];
    this.addEventListener = function(a, c) {
        EventsManager.addEvent(this, a, c)
    };
    this.removeEventListener = function(a, c) {
        EventsManager.removeEvent(this, a, c)
    };
    this.dispatchEvent = function(a, c) {
        return EventsManager.dispatchEvent(this, a, c)
    };
    this.hitTestPoint = function(a, c, e, f, g) {
        return this.stage ? this.stage.hitTestPointObject(this, a, c, e, f, g) : !1
    }
}
function Tween(a, c, e, f, g, h) {
    var k = this;
    "object" != typeof a && (a = null);
    if (a) {
        if ("undefined" == typeof a[c])
            throw Error('Trying to tween undefined property "' + c + '"');
        if (isNaN(a[c]))
            throw Error("Tweened value can not be " + typeof a[c]);
    } else if (isNaN(c))
        throw Error("Tweened value can not be " + typeof c);
    "function" != typeof h && (h = Easing.linear.easeIn);
    this.obj = a;
    this.prop = c;
    this.onfinish = this.onchange = null;
    this.start = e;
    this.end = f;
    this.duration = ~~g;
    this.callback = h;
    this.playing = !1;
    this._pos = -1;
    this.play = function() {
        k.playing = 
        !0;
        k.tick()
    };
    this.pause = function() {
        k.playing = !1
    };
    this.rewind = function() {
        k._pos = -1
    };
    this.forward = function() {
        k._pos = this.duration
    };
    this.stop = function() {
        k.pause();
        k.rewind()
    };
    this.updateValue = function(a) {
        k.obj ? k.obj[k.prop] = a : k.prop = a
    };
    this.tick = function() {
        if (!k.playing)
            return !1;
        k._pos++;
        if (0 > k._pos)
            return !1;
        if (k._pos > k.duration)
            return k.finish();
        var a = k.callback, a = a(k._pos, k.start, k.end - k.start, k.duration);
        this.updateValue(a);
        k.dispatchEvent("change", {target: k,value: a});
        return !1
    };
    this.finish = function() {
        k.stop();
        k.updateValue(k.end);
        return k.dispatchEvent("finish", {target: k,value: k.end})
    };
    this.eventsListeners = [];
    this.addEventListener = function(a, c) {
        EventsManager.addEvent(this, a, c)
    };
    this.removeEventListener = function(a, c) {
        EventsManager.removeEvent(this, a, c)
    };
    this.dispatchEvent = function(a, c) {
        return EventsManager.dispatchEvent(this, a, c)
    }
}
var Easing = {back: {easeIn: function(a, c, e, f) {
            return e * (a /= f) * a * (2.70158 * a - 1.70158) + c
        },easeOut: function(a, c, e, f) {
            return e * ((a = a / f - 1) * a * (2.70158 * a + 1.70158) + 1) + c
        },easeInOut: function(a, c, e, f) {
            var g = 1.70158;
            return 1 > (a /= f / 2) ? e / 2 * a * a * (((g *= 1.525) + 1) * a - g) + c : e / 2 * ((a -= 2) * a * (((g *= 1.525) + 1) * a + g) + 2) + c
        }},bounce: {easeIn: function(a, c, e, f) {
            return e - Easing.bounce.easeOut(f - a, 0, e, f) + c
        },easeOut: function(a, c, e, f) {
            return (a /= f) < 1 / 2.75 ? 7.5625 * e * a * a + c : a < 2 / 2.75 ? e * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + c : a < 2.5 / 2.75 ? e * (7.5625 * (a -= 2.25 / 
            2.75) * a + 0.9375) + c : e * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + c
        },easeInOut: function(a, c, e, f) {
            return a < f / 2 ? 0.5 * Easing.bounce.easeIn(2 * a, 0, e, f) + c : 0.5 * Easing.bounce.easeOut(2 * a - f, 0, e, f) + 0.5 * e + c
        }},circular: {easeIn: function(a, c, e, f) {
            return -e * (Math.sqrt(1 - (a /= f) * a) - 1) + c
        },easeOut: function(a, c, e, f) {
            return e * Math.sqrt(1 - (a = a / f - 1) * a) + c
        },easeInOut: function(a, c, e, f) {
            return 1 > (a /= f / 2) ? -e / 2 * (Math.sqrt(1 - a * a) - 1) + c : e / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + c
        }},cubic: {easeIn: function(a, c, e, f) {
            return e * (a /= f) * a * a + c
        },easeOut: function(a, 
        c, e, f) {
            return e * ((a = a / f - 1) * a * a + 1) + c
        },easeInOut: function(a, c, e, f) {
            return 1 > (a /= f / 2) ? e / 2 * a * a * a + c : e / 2 * ((a -= 2) * a * a + 2) + c
        }},exponential: {easeIn: function(a, c, e, f) {
            return 0 == a ? c : e * Math.pow(2, 10 * (a / f - 1)) + c
        },easeOut: function(a, c, e, f) {
            return a == f ? c + e : e * (-Math.pow(2, -10 * a / f) + 1) + c
        },easeInOut: function(a, c, e, f) {
            return 0 == a ? c : a == f ? c + e : 1 > (a /= f / 2) ? e / 2 * Math.pow(2, 10 * (a - 1)) + c : e / 2 * (-Math.pow(2, -10 * --a) + 2) + c
        }},linear: {easeIn: function(a, c, e, f) {
            return e * a / f + c
        },easeOut: function(a, c, e, f) {
            return e * a / f + c
        },easeInOut: function(a, 
        c, e, f) {
            return e * a / f + c
        }},quadratic: {easeIn: function(a, c, e, f) {
            return e * (a /= f) * a + c
        },easeOut: function(a, c, e, f) {
            return -e * (a /= f) * (a - 2) + c
        },easeInOut: function(a, c, e, f) {
            return 1 > (a /= f / 2) ? e / 2 * a * a + c : -e / 2 * (--a * (a - 2) - 1) + c
        }},quartic: {easeIn: function(a, c, e, f) {
            return e * (a /= f) * a * a * a + c
        },easeOut: function(a, c, e, f) {
            return -e * ((a = a / f - 1) * a * a * a - 1) + c
        },easeInOut: function(a, c, e, f) {
            return 1 > (a /= f / 2) ? e / 2 * a * a * a * a + c : -e / 2 * ((a -= 2) * a * a * a - 2) + c
        }},quintic: {easeIn: function(a, c, e, f) {
            return e * (a /= f) * a * a * a * a + c
        },easeOut: function(a, c, e, f) {
            return e * 
            ((a = a / f - 1) * a * a * a * a + 1) + c
        },easeInOut: function(a, c, e, f) {
            return 1 > (a /= f / 2) ? e / 2 * a * a * a * a * a + c : e / 2 * ((a -= 2) * a * a * a * a + 2) + c
        }},sine: {easeIn: function(a, c, e, f) {
            return -e * Math.cos(a / f * (Math.PI / 2)) + e + c
        },easeOut: function(a, c, e, f) {
            return e * Math.sin(a / f * (Math.PI / 2)) + c
        },easeInOut: function(a, c, e, f) {
            return -e / 2 * (Math.cos(Math.PI * a / f) - 1) + c
        }}};
function StageTimer(a, c, e) {
    this.repeat = e;
    this.timeout = this.initialTimeout = c;
    this.callback = a;
    this.paused = !1;
    this.update = function() {
        if (!this.paused) {
            this.timeout--;
            if (0 >= this.timeout)
                if ("function" == typeof this.callback && this.callback(), "string" == typeof this.callback && eval(this.callback), this.repeat)
                    this.timeout = this.initialTimeout;
                else
                    return !0;
            return !1
        }
    };
    this.resume = function() {
        this.paused = !1
    };
    this.pause = function() {
        this.paused = !0
    }
}
function Stage(a, c, e) {
    function f() {
        h.lastFPS = h.fps;
        h.fps = 0;
        h.started && (h.tmFPS = setTimeout(f, 1E3))
    }
    function g() {
        clearTimeout(h.tmMain);
        var a = (new Date).getTime();
        h.updateTweens();
        h.updateTimers();
        h.dispatchEvent("pretick");
        h.drawScene(h.canvas, !1);
        h.showFPS && (h.setTextStyle("sans-serif", 10, "bold", "#fff", "#000"), h.drawText("FPS: " + h.lastFPS, 2, 10, 1, !0));
        h.dispatchEvent("posttick");
        a = (new Date).getTime() - a;
        a = h.delay - a - 1;
        1 > a && (a = 1);
        h.fps++;
        h.started && (h.tmMain = setTimeout(g, a))
    }
    var h = this;
    this.canvas = null;
    a && (this.canvas = document.getElementById(a), this.canvas.ctx = this.canvas.getContext("2d"));
    this.backBuffer = null;
    this.screenWidth = c;
    this.screenHeight = e;
    this.viewport = {x: 0,y: 0};
    this.objects = [];
    this.objectsCounter = 0;
    try {
        this.buffer = document.createElement("canvas"), this.buffer.width = c * Utils.globalScale, this.buffer.height = e * Utils.globalScale, this.buffer.ctx = this.buffer.getContext("2d")
    } catch (k) {
        this.buffer = this.canvas
    }
    this.delay = 40;
    this.started = this.fillColor = !1;
    this.lastFPS = this.fps = 0;
    this.ceilSizes = this.pixelMouseMoveEvent = 
    this.pixelMouseDownEvent = this.pixelMouseUpEvent = this.pixelClickEvent = this.showFPS = !1;
    this.tmMain;
    this.tmFPS;
    this.clearLock = !1;
    this.destroy = function() {
        clearTimeout(this.tmMain);
        clearTimeout(this.tmFPS);
        this.stop();
        this.clear();
        this.clearScreen(this.canvas)
    };
    this.clearScreen = function(a) {
        this.clearLock || a.ctx.clearRect(0, 0, this.screenWidth * Utils.globalScale * Utils.globalPixelScale, this.screenHeight * Utils.globalScale * Utils.globalPixelScale)
    };
    this.findMaxZIndex = function() {
        for (var a = -1, c = !1, e = 0; e < this.objects.length; e++)
            this.objects[e].zIndex > 
            a && (a = this.objects[e].zIndex, c = e);
        return {index: c,zIndex: a}
    };
    this.findMinZIndex = function() {
        for (var a = -1, c = !1, e = 0; e < this.objects.length; e++)
            0 == e && (a = this.objects[e].zIndex, c = 0), this.objects[e].zIndex < a && (a = this.objects[e].zIndex, c = e);
        return {index: c,zIndex: a}
    };
    this.addChild = function(a) {
        var c = this.findMaxZIndex(), e = a.zIndex;
        a.zIndex = !1 !== c.index ? c.zIndex + 1 : 0;
        this.objectsCounter++;
        a.uid = this.objectsCounter;
        a.stage = this;
        this.objects.push(a);
        0 != e && this.setZIndex(a, ~~e);
        a.dispatchEvent("add", {target: a});
        return a
    };
    this.removeChild = function(a) {
        a && (this.clearObjectTweens(a), a.dispatchEvent("remove", {target: a}), a.stage = null, this.objects = Utils.removeFromArray(this.objects, a))
    };
    this.setZIndex = function(a, c) {
        a.zIndex = c;
        this.objects = this.objects.sort(function(a, c) {
            return a.zIndex == c.zIndex ? a.uid > c.uid ? 1 : -1 : a.zIndex > c.zIndex ? 1 : -1
        })
    };
    this.hitTestPointObject = function(a, c, e, f, g, h) {
        var k, t, u, x, v, y;
        u = a.width * Math.abs(a.scaleX);
        x = a.height * Math.abs(a.scaleY);
        k = a.x - u / 2;
        t = a.y - x / 2;
        v = c;
        y = e;
        a.ignoreViewport || (v += this.viewport.x, 
        y += this.viewport.y);
        h = !1;
        0 == a.rotation ? k <= v && t <= y && k + u >= v && t + x >= y && (h = !0) : (k = a.getDrawRectangle(), k.hitTestPoint(new Vector(v, y)) && (h = !0));
        h && f && (this.buffer.width = this.screenWidth * Utils.globalScale * Utils.globalPixelScale, this.buffer.height = this.screenHeight * Utils.globalScale * Utils.globalPixelScale, this.clearScreen(this.buffer), this.renderObject(this.buffer, a), c = this.buffer.ctx.getImageData(Math.floor(c * Utils.globalScale * Utils.globalPixelScale), Math.floor(e * Utils.globalScale * Utils.globalPixelScale), 
        1, 1), 0 == c.data[3] && (h = !1));
        !h && g && a.dragged && (h = !0);
        return h
    };
    this.getObjectsStackByCoord = function(a, c, e, f, g) {
        for (var h, k = [], t = 0; t < this.objects.length; t++)
            if (this.objects[t].visible || this.objects[t].eventsWhenInvisible)
                h = this.objects[t], this.hitTestPointObject(h, a, c, e, f, g) && k.push(h);
        return k
    };
    this.getMaxZIndexInStack = function(a) {
        for (var c = -1, e = 0, f = 0; f < a.length; f++)
            a[f].zIndex > c && (c = a[f].zIndex, e = f);
        return e
    };
    this.sortStack = function(a, c) {
        for (var e = !0, f, g; e; )
            for (e = !1, g = 0; g < a.length - 1; g++)
                f = !1, a[g].zIndex < 
                a[g + 1].zIndex && !c && (f = !0), a[g].zIndex > a[g + 1].zIndex && c && (f = !0), f && (e = a[g], a[g] = a[g + 1], a[g + 1] = e, e = !0);
        return a
    };
    this.finalizeMouseCoords = function(a, c) {
        if (!a)
            return c;
        var e = this.prepareMouseCoord(c.x), f = this.prepareMouseCoord(c.y);
        a.ignoreViewport || (e += this.viewport.x, f += this.viewport.y);
        e -= a.x;
        f -= a.y;
        return {x: e,y: f}
    };
    this.prepareMouseCoord = function(a) {
        return a / Utils.globalScale / Utils.globalPixelScale
    };
    this.checkClick = function(a) {
        a = Utils.getMouseCoord(a, this.inputController);
        var c = this.getObjectsStackByCoord(this.prepareMouseCoord(a.x), 
        this.prepareMouseCoord(a.y), this.pixelClickEvent, !1, !0), e;
        if (0 < c.length)
            for (var c = this.sortStack(c), f = 0; f < c.length && (e = this.finalizeMouseCoords(c[f], a), e = c[f].dispatchEvent("click", {target: c[f],x: e.x,y: e.y}), !1 !== e); f++)
                ;
    };
    this.checkContextMenu = function(a) {
        a = Utils.getMouseCoord(a, this.inputController);
        var c = this.getObjectsStackByCoord(this.prepareMouseCoord(a.x), this.prepareMouseCoord(a.y), this.pixelClickEvent), e;
        if (0 < c.length)
            for (var c = this.sortStack(c), f = 0; f < c.length && (e = this.finalizeMouseCoords(c[f], 
            a), e = c[f].dispatchEvent("contextmenu", {target: c[f],x: e.x,y: e.y}), !1 !== e); f++)
                ;
    };
    this.checkMouseMove = function(a) {
        a = Utils.getMouseCoord(a, this.inputController);
        for (f = 0; f < this.objects.length; f++)
            if (this.objects[f].dragged) {
                var c = a.x / Utils.globalScale / Utils.globalPixelScale, e = a.y / Utils.globalScale / Utils.globalPixelScale;
                this.objects[f].ignoreViewport || (c += this.viewport.x, e += this.viewport.y);
                this.objects[f].x = c - this.objects[f].dragX;
                this.objects[f].y = e - this.objects[f].dragY
            }
        var c = this.getObjectsStackByCoord(this.prepareMouseCoord(a.x), 
        this.prepareMouseCoord(a.y), this.pixelMouseMoveEvent), f, g, h, e = [];
        if (0 < c.length) {
            c = this.sortStack(c);
            for (f = 0; f < c.length && (e.push(c[f]), h = this.finalizeMouseCoords(c[f], a), c[f].mouseOn || (g = c[f].dispatchEvent("mouseover", {target: c[f],x: h.x,y: h.y})), c[f].mouseOn = !0, !1 !== g); f++)
                ;
            for (f = 0; f < c.length && (h = this.finalizeMouseCoords(c[f], a), g = c[f].dispatchEvent("mousemove", {target: c[f],x: h.x,y: h.y}), !1 !== g); f++)
                ;
        }
        for (f = 0; f < this.objects.length; f++)
            if (this.objects[f].mouseOn) {
                h = !1;
                for (g = 0; g < e.length; g++)
                    e[g] == this.objects[f] && 
                    (h = !0);
                if (!h && (this.objects[f].mouseOn = !1, h = this.finalizeMouseCoords(c[f], a), g = this.objects[f].dispatchEvent("mouseout", {target: this.objects[f],x: h.x,y: h.y}), !1 === g))
                    break
            }
    };
    this.checkMouseDown = function(a) {
        a = Utils.getMouseCoord(a, this.inputController);
        var c = this.getObjectsStackByCoord(this.prepareMouseCoord(a.x), this.prepareMouseCoord(a.y), this.pixelMouseDownEvent), e;
        if (0 < c.length)
            for (var c = this.sortStack(c), f = 0; f < c.length && (e = this.finalizeMouseCoords(c[f], a), e = c[f].dispatchEvent("mousedown", {target: c[f],
                x: e.x,y: e.y}), !1 !== e); f++)
                ;
    };
    this.checkMouseUp = function(a) {
        a = Utils.getMouseCoord(a, this.inputController);
        var c = this.getObjectsStackByCoord(this.prepareMouseCoord(a.x), this.prepareMouseCoord(a.y), this.pixelMouseUpEvent, !0), e;
        if (0 < c.length)
            for (var c = this.sortStack(c), f = 0; f < c.length && (e = this.finalizeMouseCoords(c[f], a), e = c[f].dispatchEvent("mouseup", {target: c[f],x: e.x,y: e.y}), !1 !== e); f++)
                ;
    };
    this.clear = function() {
        for (var a = 0; a < this.objects.length; a++)
            this.objects[a].dispatchEvent("remove", {target: this.objects[a]});
        this.objects = [];
        this.tweens = [];
        this.timers = [];
        this.eventsListeners = [];
        this.objectsCounter = 0
    };
    this.hitTest = function(a, c) {
        if (0 == a.rotation && 0 == c.rotation) {
            var e = a.getX() - a.getWidth() / 2, f = a.getY() - a.getHeight() / 2, g = c.getX() - c.getWidth() / 2, h = c.getY() - c.getHeight() / 2, k = Math.max(f, h), t = Math.max(e, g), e = Math.min(e + a.getWidth(), g + c.getWidth()), f = Math.min(f + a.getHeight(), h + c.getHeight()) - k;
            return 0 < e - t && 0 < f ? !0 : !1
        }
        t = a.getDrawRectangle();
        f = c.getDrawRectangle();
        return t.hitTestRectangle(f)
    };
    this.drawRectangle = 
    function(a, c, e, f, g, h, k, t) {
        var u = this.canvas;
        u.ctx.globalAlpha = "undefined" != typeof k ? k : 1;
        u.ctx.fillStyle = g;
        u.ctx.strokeStyle = g;
        t || (a -= this.viewport.x, c -= this.viewport.y);
        a = a * Utils.globalScale * Utils.globalPixelScale;
        c = c * Utils.globalScale * Utils.globalPixelScale;
        e = e * Utils.globalScale * Utils.globalPixelScale;
        f = f * Utils.globalScale * Utils.globalPixelScale;
        h ? u.ctx.fillRect(a - e / 2, c - f / 2, e, f) : u.ctx.strokeRect(a - e / 2, c - f / 2, e, f)
    };
    this.drawCircle = function(a, c, e, f, g, h, k) {
        this.drawArc(a, c, e, 0, 2 * Math.PI, !1, f, g, h, k)
    };
    this.drawArc = function(a, c, e, f, g, h, k, t, u, x) {
        var v = this.canvas, y = v.ctx.lineWidth;
        "undefined" == typeof t && (t = "#000");
        v.ctx.strokeStyle = t;
        "undefined" == typeof k && (k = 1);
        v.ctx.lineWidth = k * Utils.globalScale * Utils.globalPixelScale;
        "undefined" == typeof u && (u = 1);
        v.ctx.globalAlpha = u;
        x || (a -= this.viewport.x, c -= this.viewport.y);
        a = a * Utils.globalScale * Utils.globalPixelScale;
        c = c * Utils.globalScale * Utils.globalPixelScale;
        e = e * Utils.globalScale * Utils.globalPixelScale;
        v.ctx.beginPath();
        v.ctx.arc(a, c, e, f, g, h);
        v.ctx.stroke();
        v.ctx.lineWidth = y
    };
    this.drawPolygon = function(a, c, e, f, g) {
        if ("object" == typeof a && a instanceof Array && !(2 > a.length)) {
            for (var h = 0; h < a.length - 1; h++)
                this.drawLine(a[h].x, a[h].y, a[h + 1].x, a[h + 1].y, c, e, f, g);
            this.drawLine(a[h].x, a[h].y, a[0].x, a[0].y, c, e, f, g)
        }
    };
    this.drawLine = function(a, c, e, f, g, h, k, t) {
        var u = this.canvas, x = u.ctx.lineWidth;
        u.ctx.strokeStyle = h ? h : "#000";
        u.ctx.lineWidth = g ? g * Utils.globalScale * Utils.globalPixelScale : 1 * Utils.globalScale * Utils.globalPixelScale;
        u.ctx.globalAlpha = k ? k : 1;
        t || (a -= this.viewport.x, 
        c -= this.viewport.y, e -= this.viewport.x, f -= this.viewport.y);
        a = a * Utils.globalScale * Utils.globalPixelScale;
        c = c * Utils.globalScale * Utils.globalPixelScale;
        e = e * Utils.globalScale * Utils.globalPixelScale;
        f = f * Utils.globalScale * Utils.globalPixelScale;
        u.ctx.beginPath();
        u.ctx.moveTo(a, c);
        u.ctx.lineTo(e, f);
        u.ctx.stroke();
        u.ctx.lineWidth = x
    };
    this.start = function() {
        this.started || (this.started = !0, f(), g())
    };
    this.forceRender = function() {
        this.started && g()
    };
    this.stop = function() {
        this.started = !1
    };
    this.setTextStyle = function(a, 
    c, e, f, g, h) {
        h = h ? h : this.canvas;
        h.ctx.fillStyle = f;
        h.ctx.strokeStyle = g;
        f = "";
        e && (f += e + " ");
        c && (f += Math.floor(c * Utils.globalScale * Utils.globalPixelScale) + "px ");
        a && (f += a);
        h.ctx.font = f
    };
    this.drawText = function(a, c, e, f, g, h, k) {
        k = k ? k : this.canvas;
        k.ctx.globalAlpha = "undefined" == typeof f ? 1 : f;
        g || (c -= this.viewport.x, e -= this.viewport.y);
        c = c * Utils.globalScale * Utils.globalPixelScale;
        e = e * Utils.globalScale * Utils.globalPixelScale;
        h && (c -= this.getTextWidth(a) / 2);
        k.ctx.fillText(a, c, e)
    };
    this.strokeText = function(a, c, e, f, g, 
    h, k) {
        k = k ? k : this.canvas;
        k.ctx.globalAlpha = "undefined" == typeof f ? 1 : f;
        g || (c -= this.viewport.x, e -= this.viewport.y);
        c = c * Utils.globalScale * Utils.globalPixelScale;
        e = e * Utils.globalScale * Utils.globalPixelScale;
        h && (c -= this.getTextWidth(a) / 2);
        k.ctx.strokeText(a, c, e)
    };
    this.getTextWidth = function(a, c) {
        return (c ? c : this.canvas).ctx.measureText(a).width
    };
    this.allowStaticDebugDrawing = this.allowDebugDrawing = !1;
    this.renderObject = function(a, c) {
        if (!1 !== c.dispatchEvent("prerender", {target: c,canvas: a})) {
            var e = c.getAbsoluteCenter();
            ow = c.width * Utils.globalScale;
            oh = c.height * Utils.globalScale;
            ox = e.x * Utils.globalPixelScale * Utils.globalScale - Math.floor(ow / 2);
            oy = e.y * Utils.globalPixelScale * Utils.globalScale - Math.floor(oh / 2);
            or = c.rotation;
            scX = c.scaleX * Utils.globalPixelScale;
            scY = c.scaleY * Utils.globalPixelScale;
            canvasMod = Boolean(0 != or || 1 != scX || 1 != scY);
            c.ignoreViewport || (ox -= this.viewport.x * Utils.globalPixelScale * Utils.globalScale, oy -= this.viewport.y * Utils.globalPixelScale * Utils.globalScale);
            canvasMod && (a.ctx.save(), a.ctx.translate(ox + 
            Math.floor(ow / 2), oy + Math.floor(oh / 2)), a.ctx.rotate(or), a.ctx.scale(scX, scY), ox = -Math.floor(ow / 2), oy = -Math.floor(oh / 2));
            a.ctx.globalAlpha = c.opacity;
            this.ceilSizes && (ow = Math.ceil(ow), oh = Math.ceil(oh));
            c.fillColor && (a.ctx.fillStyle = c.fillColor, a.ctx.strokeStyle = c.fillColor, a.ctx.fillRect(ox, oy, ow, oh));
            if (c.bitmap) {
                var e = c.bitmap.width, f = c.bitmap.height, g = c.currentLayer * ow + c.offset.left * Utils.globalScale, h = c.currentFrame * oh + c.offset.top * Utils.globalScale;
                if (g < e && h < f) {
                    var k = ow, t = oh, u = !1;
                    g + k > e && (k = e - g);
                    h + t > f && (t = f - h);
                    c.mask && (this.buffer.ctx.save(), this.buffer.ctx.clearRect(0, 0, k, t), this.buffer.ctx.drawImage(c.bitmap, g, h, k, t, 0, 0, k, t), this.buffer.ctx.globalCompositeOperation = "destination-in", this.buffer.ctx.drawImage(c.mask, 0, 0), h = g = 0, u = !0);
                    try {
                        a.ctx.drawImage(u ? this.buffer : c.bitmap, ~~g, ~~h, ~~k, ~~t, ~~ox, ~~oy, ~~ow, ~~oh)
                    } catch (x) {
                    }
                    u && this.buffer.ctx.restore()
                }
            }
            canvasMod && a.ctx.restore();
            this.allowDebugDrawing && c.allowDebugDrawing && (!this.allowStaticDebugDrawing && c.static || c.debugDraw());
            c.dispatchEvent("render", 
            {target: c,canvas: a})
        }
    };
    this.drawBackAlways = Utils.mobileCheckBrokenAndroid();
    this.drawBackBuffer = function(a, c) {
        !c && this.backBuffer && this.drawBackAlways && a.ctx.drawImage(this.backBuffer, 0, 0, a.width, a.height)
    };
    this.drawScene = function(a, c) {
        var e, f;
        a && !a.ctx && (a.ctx = a.getContext("2d"));
        this.fillColor ? (a.ctx.fillStyle = this.fillColor, a.ctx.fillRect(0, 0, this.screenWidth * Utils.globalScale * Utils.globalPixelScale, this.screenHeight * Utils.globalScale * Utils.globalPixelScale), this.drawBackBuffer(a, c)) : this.clearLock || 
        (this.clearScreen(a), this.drawBackBuffer(a, c));
        for (var g = 0; g < this.objects.length; g++)
            e = this.objects[g], f = !1, c || e["static"] || (f = !0), c && e["static"] && (f = !0), f && (e.destroy ? (this.removeChild(e), g--) : (e.nextFrame(), e.visible && this.renderObject(a, e)));
        c && (this.backBuffer = a)
    };
    this.tweens = [];
    this.createTween = function(a, c, e, f, g, k) {
        a = new Tween(a, c, e, f, g, k);
        h.tweens.push(a);
        return a
    };
    this.removeTween = function(a) {
        var c = null;
        if (isNaN(a))
            for (var e = 0; e < h.tweens.length; e++) {
                if (h.tweens[e] === a) {
                    c = e;
                    break
                }
            }
        else
            c = a;
        h.tweens[c].pause();
        h.tweens.splice(c, 1);
        return c
    };
    this.clearObjectTweens = function(a) {
        for (var c = 0; c < h.tweens.length; c++)
            h.tweens[c].obj === a && (c = h.removeTween(c), c--)
    };
    this.updateTweens = function() {
        for (var a = 0; a < h.tweens.length; a++)
            h.tweens[a].tick() && (a = h.removeTween(a))
    };
    this.timers = [];
    this.setTimeout = function(a, c) {
        var e = new StageTimer(a, c);
        this.timers.push(e);
        return e
    };
    this.clearTimeout = function(a) {
        this.timers = Utils.removeFromArray(this.timers, a)
    };
    this.setInterval = function(a, c) {
        var e = new StageTimer(a, 
        c, !0);
        this.timers.push(e);
        return e
    };
    this.clearInterval = function(a) {
        this.clearTimeout(a)
    };
    this.updateTimers = function() {
        for (var a = 0; a < this.timers.length; a++)
            this.timers[a].update() && (this.clearTimeout(this.timers[a]), a--)
    };
    this.box2dSync = function(a) {
        for (b = a.m_bodyList; b; b = b.m_next)
            b.sprite && (b.sprite.rotation = b.GetRotation(), a = b.GetPosition(), b.sprite.x = a.x, b.sprite.y = a.y, b.sprite.dispatchEvent("box2dsync", {target: b.sprite}))
    };
    this.processTouchEvent = function(a, c) {
        for (var e = 0; e < a.length; e++)
            h[c]({clientX: a[e].clientX,
                clientY: a[e].clientY})
    };
    this.inputController = null;
    this.addInputListeners = function(a) {
        -1 != navigator.userAgent.toLowerCase().indexOf("firefox") && navigator.userAgent.toLowerCase().indexOf("mobile");
        this.inputController = a;
        "ontouchstart" in a ? (a.ontouchstart = function(a) {
            h.processTouchEvent(a.touches, "checkMouseDown");
            h.processTouchEvent(a.touches, "checkClick")
        }, a.ontouchmove = function(a) {
            h.processTouchEvent(a.touches, "checkMouseMove")
        }, a.ontouchend = function(a) {
            h.processTouchEvent(a.changedTouches, "checkMouseUp")
        }) : 
        (a.onclick = function(a) {
            h.checkClick(a)
        }, a.onmousemove = function(a) {
            h.checkMouseMove(a)
        }, a.onmousedown = function(a) {
            0 == a.button && h.checkMouseDown(a)
        }, a.onmouseup = function(a) {
            0 == a.button && h.checkMouseUp(a)
        }, a.oncontextmenu = function(a) {
            h.checkContextMenu(a)
        })
    };
    this.canvas && this.addInputListeners(this.canvas);
    this.onposttick = this.onpretick = null;
    this.eventsListeners = [];
    this.addEventListener = function(a, c) {
        EventsManager.addEvent(this, a, c)
    };
    this.removeEventListener = function(a, c) {
        EventsManager.removeEvent(this, 
        a, c)
    };
    this.dispatchEvent = function(a, c) {
        return EventsManager.dispatchEvent(this, a, c)
    }
}
function Vector(a, c) {
    "undefined" == typeof a && (a = 0);
    this.x = a;
    "undefined" == typeof c && (c = 0);
    this.y = c;
    this.isZero = function() {
        return 0 == this.x && 0 == this.y
    };
    this.clone = function() {
        return new Vector(this.x, this.y)
    };
    this.add = function(a) {
        this.x += a.x;
        this.y += a.y;
        return this
    };
    this.subtract = function(a) {
        this.x -= a.x;
        this.y -= a.y;
        return this
    };
    this.mult = function(a) {
        this.x *= a;
        this.y *= a;
        return this
    };
    this.invert = function() {
        this.mult(-1);
        return this
    };
    this.rotate = function(a, c) {
        "undefined" == typeof c && (c = new Vector(0, 0));
        var g = 
        this.clone();
        g.subtract(c);
        g.x = this.x * Math.cos(a) + this.y * Math.sin(a);
        g.y = this.x * -Math.sin(a) + this.y * Math.cos(a);
        g.add(c);
        this.x = g.x;
        this.y = g.y;
        return this
    };
    this.normalize = function(a, c) {
        "undefined" == typeof c && (c = new Vector(0, 0));
        this.subtract(c);
        this.rotate(-a);
        return this
    };
    this.getLength = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    };
    this.distanceTo = function(a) {
        p2 = this.clone();
        p2.subtract(a);
        return p2.getLength()
    }
}
var Rectangle = function(a, c, e, f, g) {
    this.center = new Vector(a, c);
    this.width = e;
    this.height = f;
    this.angle = g;
    this.vertices = [];
    this.AABB = [];
    this.clone = function() {
        return new Rectangle(this.center.x, this.center.y, this.width, this.height, this.angle)
    };
    this.refreshVertices = function() {
        var a = this.width / 2, c = this.height / 2;
        this.vertices = [];
        this.vertices.push(new Vector(-a, c));
        this.vertices.push(new Vector(a, c));
        this.vertices.push(new Vector(a, -c));
        this.vertices.push(new Vector(-a, -c));
        this.AABB = [this.center.clone(), 
            this.center.clone()];
        for (a = 0; 4 > a; a++)
            this.vertices[a].rotate(-this.angle, this.center), this.vertices[a].x < this.AABB[0].x && (this.AABB[0].x = this.vertices[a].x), this.vertices[a].x > this.AABB[1].x && (this.AABB[1].x = this.vertices[a].x), this.vertices[a].y < this.AABB[0].y && (this.AABB[0].y = this.vertices[a].y), this.vertices[a].y > this.AABB[1].y && (this.AABB[1].y = this.vertices[a].y)
    };
    this.move = function(a, c) {
        this.center.add(new Vector(a, c));
        this.refreshVertices()
    };
    this.rotate = function(a) {
        this.angle += a;
        this.refreshVertices()
    };
    this.hitTestPoint = function(a) {
        a = a.clone();
        a.normalize(-this.angle, this.center);
        return Math.abs(a.x) <= this.width / 2 && Math.abs(a.y) <= this.height / 2
    };
    this.hitTestRectangle = function(a) {
        var c = this.clone();
        a = a.clone();
        var e, f, g;
        c.move(-this.center.x, -this.center.y);
        a.move(-this.center.x, -this.center.y);
        a.center.rotate(this.angle);
        c.rotate(-this.angle);
        a.rotate(-this.angle);
        e = Math.max(c.AABB[0].x, c.AABB[1].x, a.AABB[0].x, a.AABB[1].x) - Math.min(c.AABB[0].x, c.AABB[1].x, a.AABB[0].x, a.AABB[1].x);
        f = c.AABB[1].x - c.AABB[0].x;
        g = a.AABB[1].x - a.AABB[0].x;
        if (e > f + g)
            return !1;
        e = Math.max(c.AABB[0].y, c.AABB[1].y, a.AABB[0].y, a.AABB[1].y) - Math.min(c.AABB[0].y, c.AABB[1].y, a.AABB[0].y, a.AABB[1].y);
        f = c.AABB[1].y - c.AABB[0].y;
        g = a.AABB[1].y - a.AABB[0].y;
        if (e > f + g)
            return !1;
        c.move(-a.center.x, -a.center.y);
        a.move(-a.center.x, -a.center.y);
        c.center.rotate(a.angle);
        c.refreshVertices();
        c.rotate(-a.angle);
        a.rotate(-a.angle);
        e = Math.max(c.AABB[0].x, c.AABB[1].x, a.AABB[0].x, a.AABB[1].x) - Math.min(c.AABB[0].x, c.AABB[1].x, a.AABB[0].x, a.AABB[1].x);
        f = c.AABB[1].x - 
        c.AABB[0].x;
        g = a.AABB[1].x - a.AABB[0].x;
        if (e > f + g)
            return !1;
        e = Math.max(c.AABB[0].y, c.AABB[1].y, a.AABB[0].y, a.AABB[1].y) - Math.min(c.AABB[0].y, c.AABB[1].y, a.AABB[0].y, a.AABB[1].y);
        f = c.AABB[1].y - c.AABB[0].y;
        g = a.AABB[1].y - a.AABB[0].y;
        return e > f + g ? !1 : !0
    };
    this.refreshVertices()
}, Asset = function(a, c, e, f, g, h) {
    this.name = a + "";
    this.src = c + "";
    this.width = e;
    this.height = f;
    this.frames = g;
    this.layers = h;
    this.object = this.bitmap = null;
    this.ready = this.width && this.height;
    this.detectSize = function() {
        if (!this.bitmap)
            return !1;
        try {
            isNaN(this.width) && 
            (this.width = this.bitmap.width ? parseInt(this.bitmap.width) : 0), isNaN(this.height) && (this.height = this.bitmap.height ? parseInt(this.bitmap.height) : 0)
        } catch (a) {
            CRENDER_DEBUG && console.log(a)
        }
        return !isNaN(this.width) && !isNaN(this.height)
    };
    this.normalize = function(a) {
        if (!this.ready && this.detectSize()) {
            if (isNaN(this.frames) || 1 > this.frames)
                this.frames = 1;
            if (isNaN(this.layers) || 1 > this.layers)
                this.layers = 1;
            this.width = Math.ceil(this.width / this.layers / a);
            this.height = Math.ceil(this.height / this.frames / a);
            this.ready = 
            !0
        }
    }
}, AssetsLibrary = function(a, c, e) {
    var f = this;
    this.path = "images";
    this.scale = 1;
    this.items = {};
    this.bitmaps = {};
    this.loaded = !1;
    this.onloadprogress = this.onload = null;
    this.spriteClass = Sprite;
    this.init = function(a, c) {
        "undefined" != typeof a && (this.path = a + "");
        "undefined" != typeof c && (this.scale = parseFloat(c), isNaN(this.scale) && (this.scale = 1))
    };
    this.addAssets = function(a) {
        if ("undefined" != typeof a && "object" == typeof a)
            for (var c = 0; c < a.length; c++) {
                var e = a[c];
                e.noscale = "undefined" == typeof e.noscale ? !1 : e.noscale;
                e.noscale || 
                (e.src = "%SCALE%/" + e.src);
                this.addAsset(e.src, e.name, e.width, e.height, e.frames, e.layers)
            }
    };
    this.addAsset = function(a, c, e, f, m, n) {
        a = a.replace("%SCALE%", "%PATH%/" + this.scale);
        a = a.replace("%PATH%", this.path);
        "undefined" == typeof c && (c = a.split("/"), c = c.pop(), c = c.split("."), c = c.shift() + "");
        a = new Asset(c, a, e, f, m, n);
        return this.items[c] = a
    };
    this.addObject = function(a) {
        var c = this.addAsset("%SCALE%/" + a.image, a.name, a.width * this.scale, a.height * this.scale, a.frames, a.layers);
        c && (c.object = a);
        return c
    };
    this.load = function(a, 
    c) {
        this.onload = a;
        this.onloadprogress = c;
        var e = new ImagesPreloader, l = [], m;
        for (m in this.items)
            l.push(this.items[m]);
        e.load(l, f.onLoadHandler, f.onLoadProgressHandler)
    };
    this.onLoadProgressHandler = function(a) {
        if ("function" == typeof f.onloadprogress)
            f.onloadprogress(a)
    };
    this.onLoadHandler = function(a) {
        f.loaded = !0;
        for (var c in a) {
            var e = f.items[c];
            e.bitmap = a[c];
            e.normalize(f.scale)
        }
        if ("function" == typeof f.onload)
            f.onload(f.items)
    };
    this.getAsset = function(a, c) {
        var e = null;
        "undefined" != typeof this.items[a] && this.items[a].bitmap && 
        (e = "undefined" != typeof c && !c || this.items[a].ready ? this.items[a] : null);
        if (!e)
            throw Error('Trying to get undefined asset "' + a + '"');
        return e
    };
    this.getSprite = function(a, c) {
        var e = null;
        try {
            var f = this.getAsset(a, !0), e = new this.spriteClass(f.bitmap, f.width, f.height, f.frames, f.layers)
        } catch (m) {
            e = new this.spriteClass(null, 1, 1, 1, 1)
        }
        if ("object" == typeof c)
            for (var n in c)
                e[n] = c[n];
        return e
    };
    this.getBitmap = function(a) {
        try {
            return this.getAsset(a, !0).bitmap
        } catch (c) {
            return null
        }
    };
    this.init(a, c);
    this.addAssets(e)
};
"undefined" == typeof console && (console = {log: function() {
    }});
function box2DCreateWorld(a) {
    var c = new b2AABB;
    c.minVertex.Set(-1E3, -1E3);
    c.maxVertex.Set(1E3, 1E3);
    a = "undefined" != typeof a ? new b2Vec2(0, a) : new b2Vec2(0, 300);
    return new b2World(c, a, !0)
}
function box2DCreateGround(a, c, e) {
    var f = new b2BoxDef;
    f.extents.Set(1E4, 50);
    f.restitution = c ? c : 0.2;
    c = new b2BodyDef;
    c.AddShape(f);
    c.position.Set(-500, e ? e : 480);
    a = a.CreateBody(c);
    a.bodyDef = c;
    return a
}
function box2DCreateCircle(a, c, e, f, g, h, k, l, m) {
    "undefined" == typeof h && (h = !0);
    var n = new b2CircleDef;
    h || (n.density = k ? k : 0.8, n.restitution = l ? l : 0.1, n.friction = m ? m : 3);
    n.radius = f;
    f = new b2BodyDef;
    f.rotation = g;
    f.AddShape(n);
    f.position.Set(c, e);
    a = a.CreateBody(f);
    a.bodyDef = f;
    return a
}
function box2DCreateBox(a, c, e, f, g, h, k, l, m, n) {
    "undefined" == typeof k && (k = !0);
    var p = new b2BoxDef;
    k || (p.density = l ? l : 1, p.restitution = m ? m : 0.2, p.friction = n ? n : 0.3);
    p.extents.Set(f, g);
    f = new b2BodyDef;
    f.rotation = h;
    f.AddShape(p);
    f.position.Set(c, e);
    a = a.CreateBody(f);
    a.bodyDef = f;
    return a
}
function box2DCreatePoly(a, c, e, f, g, h, k, l, m) {
    var n = new b2BodyDef;
    n.rotation = g;
    for (g = 0; g < f.length; g++) {
        var p = f[g], q = new b2PolyDef;
        h || (q.density = k ? k : 1, q.restitution = l ? l : 0.2, q.friction = m ? m : 0.3);
        q.vertexCount = p.length;
        for (var r = 0; r < p.length; r++)
            q.vertices[r].Set(p[r][0], p[r][1]);
        n.AddShape(q)
    }
    n.position.Set(c, e);
    a = a.CreateBody(n);
    a.bodyDef = n;
    return a
}
function box2DCreateRevoluteJoint(a, c, e, f, g) {
    var h = new b2RevoluteJointDef;
    h.body1 = c;
    h.body2 = e;
    h.anchorPoint = f;
    h.collideConnected = !0;
    g && (h.motorSpeed = g, h.motorTorque = 5E8, h.enableMotor = !0);
    return a.CreateJoint(h)
}
function box2DCreateDistanceJoint(a, c, e, f, g) {
    var h = new b2DistanceJointDef;
    h.body1 = c;
    h.body2 = e;
    h.anchorPoint1 = f;
    h.anchorPoint2 = g;
    h.collideConnected = !0;
    return a.CreateJoint(h)
}
function box2DCreatePrismaticJoint(a, c, e, f, g) {
    var h = new b2PrismaticJointDef;
    h.anchorPoint.Set(f.x, f.y);
    h.body1 = c;
    h.body2 = e;
    h.axis.Set(0, 1);
    g && (h.motorSpeed = g, h.motorForce = 1E5, h.enableMotor = !0);
    return a.CreateJoint(h)
}
/*  Prototype JavaScript framework, version 1.7.2
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

var Prototype = {

  Version: '1.7.2',

  Browser: (function(){
    var ua = navigator.userAgent;
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE:             !!window.attachEvent && !isOpera,
      Opera:          isOpera,
      WebKit:         ua.indexOf('AppleWebKit/') > -1,
      Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari:   /Apple.*Mobile/.test(ua)
    }
  })(),

  BrowserFeatures: {
    XPath: !!document.evaluate,

    SelectorsAPI: !!document.querySelector,

    ElementExtensions: (function() {
      var constructor = window.Element || window.HTMLElement;
      return !!(constructor && constructor.prototype);
    })(),
    SpecificElementExtensions: (function() {
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

  emptyFunction: function() { },

  K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;
/* Based on Alex Arnell's inheritance implementation. */

var Class = (function() {

  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();

  function subclass() {};
  function create() {
    var parent = null, properties = $A(arguments);
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
    var ancestor   = this.superclass && this.superclass.prototype,
        properties = Object.keys(source);

    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && Object.isFunction(value) &&
          value.argumentNames()[0] == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property).wrap(method);

        value.valueOf = (function(method) {
          return function() { return method.valueOf.call(method); };
        })(method);

        value.toString = (function(method) {
          return function() { return method.toString.call(method); };
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
(function() {

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
      NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON &&
        typeof JSON.stringify === 'function' &&
        JSON.stringify(0) === '0' &&
        typeof JSON.stringify(Prototype.K) === 'undefined';



  var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf',
   'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();

  function Type(o) {
    switch(o) {
      case null: return NULL_TYPE;
      case (void 0): return UNDEFINED_TYPE;
    }
    var type = typeof o;
    switch(type) {
      case 'boolean': return BOOLEAN_TYPE;
      case 'number':  return NUMBER_TYPE;
      case 'string':  return STRING_TYPE;
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
    return Str('', { '': value }, []);
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
      case null: return 'null';
      case true: return 'true';
      case false: return 'false';
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
            var key = keys[i], str = Str(key, value, stack);
            if (typeof str !== "undefined") {
               partial.push(key.inspect(true)+ ':' + str);
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
    if (Type(object) !== OBJECT_TYPE) { throw new TypeError(); }
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
    return extend({ }, object);
  }

  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }

  function isArray(object) {
    return _toString.call(object) === ARRAY_CLASS;
  }

  var hasNativeIsArray = (typeof Array.isArray == 'function')
    && Array.isArray([]) && !Array.isArray({});

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
    extend:        extend,
    inspect:       inspect,
    toJSON:        NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,
    toQueryString: toQueryString,
    toHTML:        toHTML,
    keys:          Object.keys || keys,
    values:        values,
    clone:         clone,
    isElement:     isElement,
    isArray:       isArray,
    isHash:        isHash,
    isFunction:    isFunction,
    isString:      isString,
    isNumber:      isNumber,
    isDate:        isDate,
    isUndefined:   isUndefined
  });
})();
Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;

  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }


  function bind(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0]))
      return this;

    if (!Object.isFunction(this))
      throw new TypeError("The object is not callable.");

    var nop = function() {};
    var __method = this, args = slice.call(arguments, 1);

    var bound = function() {
      var a = merge(args, arguments);
      var c = this instanceof bound ? this : context;
      return __method.apply(c, a);
    };

    nop.prototype   = this.prototype;
    bound.prototype = new nop();

    return bound;
  }

  function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    }
  }

  function curry() {
    if (!arguments.length) return this;
    var __method = this, args = slice.call(arguments, 0);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    }
  }

  function delay(timeout) {
    var __method = this, args = slice.call(arguments, 1);
    timeout = timeout * 1000;
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  }

  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  function wrap(wrapper) {
    var __method = this;
    return function() {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    }
  }

  function methodize() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      var a = update([this], arguments);
      return __method.apply(null, a);
    };
  }

  var extensions = {
    argumentNames:       argumentNames,
    bindAsEventListener: bindAsEventListener,
    curry:               curry,
    delay:               delay,
    defer:               defer,
    wrap:                wrap,
    methodize:           methodize
  };

  if (!Function.prototype.bind)
    extensions.bind = bind;

  return extensions;
})());



(function(proto) {


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

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch(e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  }
});
Object.extend(String, {
  interpret: function(value) {
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

Object.extend(String.prototype, (function() {
  var NATIVE_JSON_PARSE_SUPPORT = window.JSON &&
    typeof JSON.parse === 'function' &&
    JSON.parse('{"test": true}').test;

  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) return replacement;
    var template = new Template(replacement);
    return function(match) { return template.evaluate(match) };
  }

  function isNonEmptyRegExp(regexp) {
    return regexp.source && regexp.source !== '(?:)';
  }


  function gsub(pattern, replacement) {
    var result = '', source = this, match;
    replacement = prepareReplacement(replacement);

    if (Object.isString(pattern))
      pattern = RegExp.escape(pattern);

    if (!(pattern.length || isNonEmptyRegExp(pattern))) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      match = source.match(pattern)
      if (match && match[0].length > 0) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  }

  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;

    return this.gsub(pattern, function(match) {
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
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
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
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  }

  function evalScripts() {
    return this.extractScripts().map(function(script) { return eval(script); });
  }

  function escapeHTML() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function unescapeHTML() {
    return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }


  function toQueryParams(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift()),
            value = pair.length > 1 ? pair.join('=') : pair[0];

        if (value != undefined) {
          value = value.gsub('+', ' ');
          value = decodeURIComponent(value);
        }

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
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
    return this.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }

  function underscore() {
    return this.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/-/g, '_')
               .toLowerCase();
  }

  function dasherize() {
    return this.replace(/_/g, '-');
  }

  function inspect(useDoubleQuotes) {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
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
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  }

  function parseJSON() {
    var json = this.unfilterJSON();
    return JSON.parse(json);
  }

  function include(pattern) {
    return this.indexOf(pattern) > -1;
  }

  function startsWith(pattern, position) {
    position = Object.isNumber(position) ? position : 0;
    return this.lastIndexOf(pattern, position) === position;
  }

  function endsWith(pattern, position) {
    pattern = String(pattern);
    position = Object.isNumber(position) ? position : this.length;
    if (position < 0) position = 0;
    if (position > this.length) position = this.length;
    var d = position - pattern.length;
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
    gsub:           gsub,
    sub:            sub,
    scan:           scan,
    truncate:       truncate,
    strip:          String.prototype.trim || strip,
    stripTags:      stripTags,
    stripScripts:   stripScripts,
    extractScripts: extractScripts,
    evalScripts:    evalScripts,
    escapeHTML:     escapeHTML,
    unescapeHTML:   unescapeHTML,
    toQueryParams:  toQueryParams,
    parseQuery:     toQueryParams,
    toArray:        toArray,
    succ:           succ,
    times:          times,
    camelize:       camelize,
    capitalize:     capitalize,
    underscore:     underscore,
    dasherize:      dasherize,
    inspect:        inspect,
    unfilterJSON:   unfilterJSON,
    isJSON:         isJSON,
    evalJSON:       NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
    include:        include,
    startsWith:     String.prototype.startsWith || startsWith,
    endsWith:       String.prototype.endsWith || endsWith,
    empty:          empty,
    blank:          blank,
    interpolate:    interpolate
  };
})());

var Template = Class.create({
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate: function(object) {
    if (object && Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, function(match) {
      if (object == null) return (match[1] + '');

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3],
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

var $break = { };

var Enumerable = (function() {
  function each(iterator, context) {
    try {
      this._each(iterator, context);
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  }

  function eachSlice(number, iterator, context) {
    var index = -number, slices = [], array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.collect(iterator, context);
  }

  function all(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = true;
    this.each(function(value, index) {
      result = result && !!iterator.call(context, value, index, this);
      if (!result) throw $break;
    }, this);
    return result;
  }

  function any(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = false;
    this.each(function(value, index) {
      if (result = !!iterator.call(context, value, index, this))
        throw $break;
    }, this);
    return result;
  }

  function collect(iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator.call(context, value, index, this));
    }, this);
    return results;
  }

  function detect(iterator, context) {
    var result;
    this.each(function(value, index) {
      if (iterator.call(context, value, index, this)) {
        result = value;
        throw $break;
      }
    }, this);
    return result;
  }

  function findAll(iterator, context) {
    var results = [];
    this.each(function(value, index) {
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

    this.each(function(value, index) {
      if (filter.match(value))
        results.push(iterator.call(context, value, index, this));
    }, this);
    return results;
  }

  function include(object) {
    if (Object.isFunction(this.indexOf) && this.indexOf(object) != -1)
      return true;

    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  }

  function inGroupsOf(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  }

  function inject(memo, iterator, context) {
    this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index, this);
    }, this);
    return memo;
  }

  function invoke(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  }

  function max(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index, this);
      if (result == null || value >= result)
        result = value;
    }, this);
    return result;
  }

  function min(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index, this);
      if (result == null || value < result)
        result = value;
    }, this);
    return result;
  }

  function partition(iterator, context) {
    iterator = iterator || Prototype.K;
    var trues = [], falses = [];
    this.each(function(value, index) {
      (iterator.call(context, value, index, this) ?
        trues : falses).push(value);
    }, this);
    return [trues, falses];
  }

  function pluck(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  }

  function reject(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator.call(context, value, index, this))
        results.push(value);
    }, this);
    return results;
  }

  function sortBy(iterator, context) {
    return this.map(function(value, index) {
      return {
        value: value,
        criteria: iterator.call(context, value, index, this)
      };
    }, this).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  }

  function toArray() {
    return this.map();
  }

  function zip() {
    var iterator = Prototype.K, args = $A(arguments);
    if (Object.isFunction(args.last()))
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
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
    each:       each,
    eachSlice:  eachSlice,
    all:        all,
    every:      all,
    any:        any,
    some:       any,
    collect:    collect,
    map:        collect,
    detect:     detect,
    findAll:    findAll,
    select:     findAll,
    filter:     findAll,
    grep:       grep,
    include:    include,
    member:     include,
    inGroupsOf: inGroupsOf,
    inject:     inject,
    invoke:     invoke,
    max:        max,
    min:        min,
    partition:  partition,
    pluck:      pluck,
    reject:     reject,
    sortBy:     sortBy,
    toArray:    toArray,
    entries:    toArray,
    zip:        zip,
    size:       size,
    inspect:    inspect,
    find:       detect
  };
})();

function $A(iterable) {
  if (!iterable) return [];
  if ('toArray' in Object(iterable)) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}


function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

Array.from = $A;


(function() {
  var arrayProto = Array.prototype,
      slice = arrayProto.slice,
      _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

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
    return this.select(function(value) {
      return value != null;
    });
  }

  function flatten() {
    return this.inject([], function(array, value) {
      if (Object.isArray(value))
        return array.concat(value.flatten());
      array.push(value);
      return array;
    });
  }

  function without() {
    var values = slice.call(arguments, 0);
    return this.select(function(value) {
      return !values.include(value);
    });
  }

  function reverse(inline) {
    return (inline === false ? this.toArray() : this)._reverse();
  }

  function uniq(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  }

  function intersect(array) {
    return this.uniq().findAll(function(item) {
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

    var array = Object(this), length = array.length >>> 0;
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

    var array = Object(this), length = array.length >>> 0;
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

    var k = i >= 0 ? Math.min(i, length - 1) :
     length - Math.abs(i);

    for (; k >= 0; k--)
      if (k in array && array[k] === item) return k;
    return -1;
  }

  function concat(_) {
    var array = [], items = slice.call(arguments, 0), item, n = 0;
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
    return function() {
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
    var results = [], context = arguments[1], n = 0;

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
    var results = [], context = arguments[1], value;

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
    _each:     _each,

    map:       map,
    collect:   map,
    select:    filter,
    filter:    filter,
    findAll:   filter,
    some:      some,
    any:       some,
    every:     every,
    all:       every,
    inject:    inject,

    clear:     clear,
    first:     first,
    last:      last,
    compact:   compact,
    flatten:   flatten,
    without:   without,
    reverse:   reverse,
    uniq:      uniq,
    intersect: intersect,
    clone:     clone,
    toArray:   clone,
    size:      size,
    inspect:   inspect
  });

  var CONCAT_ARGUMENTS_BUGGY = (function() {
    return [].concat(arguments)[0][0] !== 1;
  })(1,2);

  if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

  if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
  if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();
function $H(object) {
  return new Hash(object);
};

var Hash = Class.create(Enumerable, (function() {
  function initialize(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  }


  function _each(iterator, context) {
    var i = 0;
    for (var key in this._object) {
      var value = this._object[key], pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator.call(context, pair, i);
      i++;
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
    var match = this.detect(function(pair) {
      return pair.value === value;
    });
    return match && match.key;
  }

  function merge(object) {
    return this.clone().update(object);
  }

  function update(object) {
    return new Hash(object).inject(this, function(result, pair) {
      result.set(pair.key, pair.value);
      return result;
    });
  }

  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;

    value = String.interpret(value);

    value = value.gsub(/(\r)?\n/, '\r\n');
    value = encodeURIComponent(value);
    value = value.gsub(/%20/, '+');
    return key + '=' + value;
  }

  function toQueryString() {
    return this.inject([], function(results, pair) {
      var key = encodeURIComponent(pair.key), values = pair.value;

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
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }

  function clone() {
    return new Hash(this);
  }

  return {
    initialize:             initialize,
    _each:                  _each,
    set:                    set,
    get:                    get,
    unset:                  unset,
    toObject:               toObject,
    toTemplateReplacements: toObject,
    keys:                   keys,
    values:                 values,
    index:                  index,
    merge:                  merge,
    update:                 update,
    toQueryString:          toQueryString,
    inspect:                inspect,
    toJSON:                 toObject,
    clone:                  clone
  };
})());

Hash.from = $H;
Object.extend(Number.prototype, (function() {
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
    toColorPart:    toColorPart,
    succ:           succ,
    times:          times,
    toPaddedString: toPaddedString,
    abs:            abs,
    round:          round,
    ceil:           ceil,
    floor:          floor
  };
})());

function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(Enumerable, (function() {
  function initialize(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  }

  function _each(iterator, context) {
    var value = this.start, i;
    for (i = 0; this.include(value); i++) {
      iterator.call(context, value, i);
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
    _each:      _each,
    include:    include
  };
})());



var Abstract = { };


var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  activeRequestCount: 0
};

Ajax.Responders = {
  responders: [],

  _each: function(iterator, context) {
    this.responders._each(iterator, context);
  },

  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});
Ajax.Base = Class.create({
  initialize: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   '',
      evalJSON:     true,
      evalJS:       true
    };
    Object.extend(this.options, options || { });

    this.options.method = this.options.method.toLowerCase();

    if (Object.isHash(this.options.parameters))
      this.options.parameters = this.options.parameters.toObject();
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize: function($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.isString(this.options.parameters) ?
          this.options.parameters :
          Object.toQueryString(this.options.parameters);

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

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push))
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      if (headers[name] != null)
        this.transport.setRequestHeader(name, headers[name]);
  },

  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300) || status == 304;
  },

  getStatus: function() {
    try {
      if (this.transport.status === 1223) return 204;
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
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

  isSameOrigin: function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ':' + location.port : ''
    }));
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null; }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];








Ajax.Response = Class.create({
  initialize: function(request){
    this.request = request;
    var transport  = this.transport  = request.transport,
        readyState = this.readyState = transport.readyState;

    if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }

    if (readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status:      0,

  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText: function() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return '' }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },

  getResponseHeader: function(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;

    try {
      json = decodeURIComponent(escape(json));
    } catch(e) {
    }

    try {
      return json.evalJSON(this.request.options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };

    options = Object.clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});

(function(GLOBAL) {

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
      ELEMENT_NODE:                1,
      ATTRIBUTE_NODE:              2,
      TEXT_NODE:                   3,
      CDATA_SECTION_NODE:          4,
      ENTITY_REFERENCE_NODE:       5,
      ENTITY_NODE:                 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE:                8,
      DOCUMENT_NODE:               9,
      DOCUMENT_TYPE_NODE:         10,
      DOCUMENT_FRAGMENT_NODE:     11,
      NOTATION_NODE:              12
    });
  }

  var ELEMENT_CACHE = {};

  function shouldUseCreationCache(tagName, attributes) {
    if (tagName === 'select') return false;
    if ('type' in attributes) return false;
    return true;
  }

  var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function(){
    try {
      var el = document.createElement('<input name="x">');
      return el.tagName.toLowerCase() === 'input' && el.name === 'x';
    }
    catch(err) {
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

    var node = shouldUseCreationCache(tagName, attributes) ?
     ELEMENT_CACHE[tagName].cloneNode(false) : document.createElement(tagName);

    return Element.writeAttribute(node, attributes);
  }

  GLOBAL.Element = Element;

  Object.extend(GLOBAL.Element, oldElement || {});
  if (oldElement) GLOBAL.Element.prototype = oldElement.prototype;

  Element.Methods = { ByTag: {}, Simulated: {} };

  var methods = {};

  var INSPECT_ATTRIBUTES = { id: 'id', className: 'class' };
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
    toggle:  toggle,
    hide:    hide,
    show:    show
  });


  function remove(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  }

  var SELECT_ELEMENT_INNERHTML_BUGGY = (function(){
    var el = document.createElement("select"),
        isBuggy = true;
    el.innerHTML = "<option value=\"test\">test</option>";
    if (el.options && el.options[0]) {
      isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
    }
    el = null;
    return isBuggy;
  })();

  var TABLE_ELEMENT_INNERHTML_BUGGY = (function(){
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

  var LINK_ELEMENT_INNERHTML_BUGGY = (function() {
    try {
      var el = document.createElement('div');
      el.innerHTML = "<link />";
      var isBuggy = (el.childNodes.length === 0);
      el = null;
      return isBuggy;
    } catch(e) {
      return true;
    }
  })();

  var ANY_INNERHTML_BUGGY = SELECT_ELEMENT_INNERHTML_BUGGY ||
   TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;

  var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
    var s = document.createElement("script"),
        isBuggy = false;
    try {
      s.appendChild(document.createTextNode(""));
      isBuggy = !s.firstChild ||
        s.firstChild && s.firstChild.nodeType !== 3;
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

        var nodes = getContentFromAnonymousElement(tagName,
         content.stripScripts(), true);

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
    before: function(element, node) {
      element.parentNode.insertBefore(node, element);
    },
    top: function(element, node) {
      element.insertBefore(node, element.firstChild);
    },
    bottom: function(element, node) {
      element.appendChild(node);
    },
    after: function(element, node) {
      element.parentNode.insertBefore(node, element.nextSibling);
    },

    tags: {
      TABLE:  ['<table>',                '</table>',                   1],
      TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
      TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
      TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
      SELECT: ['<select>',               '</select>',                  1]
    }
  };

  var tags = INSERTION_TRANSLATIONS.tags;

  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH:    tags.TD
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
    var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

    if (tagName in INSERTION_TRANSLATIONS.tags) {
      var nextSibling = Element.next(element);
      var fragments = getContentFromAnonymousElement(
       tagName, content.stripScripts());

      parent.removeChild(element);

      var iterator;
      if (nextSibling)
        iterator = function(node) { parent.insertBefore(node, nextSibling) };
      else
        iterator = function(node) { parent.appendChild(node); }

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
    position   = position.toLowerCase();
    var method = INSERTION_TRANSLATIONS[position];

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      method(element, content);
      return element;
    }

    content = Object.toHTML(content);
    var tagName = ((position === 'before' || position === 'after') ?
     element.parentNode : element).tagName.toUpperCase();

    var childNodes = getContentFromAnonymousElement(tagName, content.stripScripts());

    if (position === 'top' || position === 'after') childNodes.reverse();

    for (var i = 0, node; node = childNodes[i]; i++)
      method(element, node);

    content.evalScripts.bind(content).defer();
  }

  function insert(element, insertions) {
    element = $(element);

    if (isContent(insertions))
      insertions = { bottom: insertions };

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
    var t = INSERTION_TRANSLATIONS.tags[tagName], div = DIV;

    var workaround = !!t;
    if (!workaround && force) {
      workaround = true;
      t = ['', '', 0];
    }

    if (workaround) {
      div.innerHTML = '&#160;' + t[0] + html + t[1];
      div.removeChild(div.firstChild);
      for (var i = t[2]; i--; )
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
    var i = elements.length, element, uid;
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
    remove:  remove,
    update:  update,
    replace: replace,
    insert:  insert,
    wrap:    wrap,
    cleanWhitespace: cleanWhitespace,
    empty:   empty,
    clone:   clone,
    purge:   purge
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
    var results = [], child = $(element).firstChild;

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
    if (arguments.length === 1) return firstDescendant(element);
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
    var siblings = Element.siblings(element), results = [];
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
    recursivelyCollect:   recursivelyCollect,
    ancestors:            ancestors,
    descendants:          descendants,
    firstDescendant:      firstDescendant,
    immediateDescendants: immediateDescendants,
    previousSiblings:     previousSiblings,
    nextSiblings:         nextSiblings,
    siblings:             siblings,
    match:                match,
    up:                   up,
    down:                 down,
    previous:             previous,
    next:                 next,
    select:               select,
    adjacent:             adjacent,
    descendantOf:         descendantOf,

    getElementsBySelector: select,

    childElements:         immediateDescendants
  });


  var idCounter = 1;
  function identify(element) {
    element = $(element);
    var id = Element.readAttribute(element, 'id');
    if (id) return id;

    do { id = 'anonymous_element_' + idCounter++ } while ($(id));

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

  var PROBLEMATIC_ATTRIBUTE_READING = (function() {
    DIV.setAttribute('onclick', []);
    var value = DIV.getAttribute('onclick');
    var isFunction = Object.isArray(value);
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
        name = table.values[attr](element, value) || name;
      if (value === false || value === null)
        element.removeAttribute(name);
      else if (value === true)
        element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }

    return element;
  }

  var PROBLEMATIC_HAS_ATTRIBUTE_WITH_CHECKBOXES = (function () {
    if (!HAS_EXTENDED_CREATE_ELEMENT_SYNTAX) {
      return false;
    }
    var checkbox = document.createElement('<input type="checkbox">');
    checkbox.checked = true;
    var node = checkbox.getAttributeNode('checked');
    return !node || !node.specified;
  })();

  function hasAttribute(element, attribute) {
    attribute = ATTRIBUTE_TRANSLATIONS.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  }

  function hasAttribute_IE(element, attribute) {
    if (attribute === 'checked') {
      return element.checked;
    }
    return hasAttribute(element, attribute);
  }

  GLOBAL.Element.Methods.Simulated.hasAttribute =
   PROBLEMATIC_HAS_ATTRIBUTE_WITH_CHECKBOXES ?
   hasAttribute_IE : hasAttribute;

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

    element.className = element.className.replace(
     getRegExpForClassName(className), ' ').strip();

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

  var classProp = 'className', forProp = 'for';

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
    _getEv = function(element, attribute) {
      var value = element.getAttribute(attribute);
      if (!value) return null;
      value = value.toString();
      value = value.split('{')[1];
      value = value.split('}')[0];
      return value.strip();
    };
  }
  else if (onclickValue === '') {
    _getEv = function(element, attribute) {
      var value = element.getAttribute(attribute);
      if (!value) return null;
      return value.strip();
    };
  }

  ATTRIBUTE_TRANSLATIONS.read = {
    names: {
      'class':     classProp,
      'className': classProp,
      'for':       forProp,
      'htmlFor':   forProp
    },

    values: {
      style: function(element) {
        return element.style.cssText.toLowerCase();
      },
      title: function(element) {
        return element.title;
      }
    }
  };

  ATTRIBUTE_TRANSLATIONS.write = {
    names: {
      className:   'class',
      htmlFor:     'for',
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    },

    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },

      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };

  ATTRIBUTE_TRANSLATIONS.has = { names: {} };

  Object.extend(ATTRIBUTE_TRANSLATIONS.write.names,
   ATTRIBUTE_TRANSLATIONS.read.names);

  var CAMEL_CASED_ATTRIBUTE_NAMES = $w('colSpan rowSpan vAlign dateTime ' +
   'accessKey tabIndex encType maxLength readOnly longDesc frameBorder');

  for (var i = 0, attr; attr = CAMEL_CASED_ATTRIBUTE_NAMES[i]; i++) {
    ATTRIBUTE_TRANSLATIONS.write.names[attr.toLowerCase()] = attr;
    ATTRIBUTE_TRANSLATIONS.has.names[attr.toLowerCase()]   = attr;
  }

  Object.extend(ATTRIBUTE_TRANSLATIONS.read.values, {
    href:        _getAttr2,
    src:         _getAttr2,
    type:        _getAttr,
    action:      _getAttrNode,
    disabled:    _getFlag,
    checked:     _getFlag,
    readonly:    _getFlag,
    multiple:    _getFlag,
    onload:      _getEv,
    onunload:    _getEv,
    onclick:     _getEv,
    ondblclick:  _getEv,
    onmousedown: _getEv,
    onmouseup:   _getEv,
    onmouseover: _getEv,
    onmousemove: _getEv,
    onmouseout:  _getEv,
    onfocus:     _getEv,
    onblur:      _getEv,
    onkeypress:  _getEv,
    onkeydown:   _getEv,
    onkeyup:     _getEv,
    onsubmit:    _getEv,
    onreset:     _getEv,
    onselect:    _getEv,
    onchange:    _getEv
  });


  Object.extend(methods, {
    identify:        identify,
    readAttribute:   readAttribute,
    writeAttribute:  writeAttribute,
    classNames:      classNames,
    hasClassName:    hasClassName,
    addClassName:    addClassName,
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
    var elementStyle = element.style, match;

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
          property = Object.isUndefined(elementStyle.styleFloat) ?
           'cssFloat' : 'styleFloat';
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
      case 'height': case 'width':
        if (!Element.visible(element)) return null;

        var dim = parseInt(getStyle(element, style), 10);

        if (dim !== element['offset' + style.capitalize()])
          return dim + 'px';

        return Element.measure(element, style);

      default: return getStyle(element, style);
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
    if (!element.currentStyle || !element.currentStyle.hasLayout)
      element.style.zoom = 1;
    return element;
  }

  var STANDARD_CSS_OPACITY_SUPPORTED = (function() {
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

    style.filter = stripAlphaFromFilter_IE(filter) +
     'alpha(opacity=' + (value * 100) + ')';

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
    if (match && match[1]) return parseFloat(match[1]) / 100;
    return 1.0;
  }


  Object.extend(methods, {
    setStyle:   setStyle,
    getStyle:   getStyle,
    setOpacity: setOpacity,
    getOpacity: getOpacity
  });

  if ('styleFloat' in DIV.style) {
    methods.getStyle = getStyle_IE;
    methods.setOpacity = setOpacity_IE;
    methods.getOpacity = getOpacity_IE;
  }

  var UID = 0;

  GLOBAL.Element.Storage = { UID: 1 };

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
    var storage = getStorage(element), value = storage.get(key);

    if (Object.isUndefined(value)) {
      storage.set(key, defaultValue);
      value = defaultValue;
    }

    return value;
  }


  Object.extend(methods, {
    getStorage: getStorage,
    store:      store,
    retrieve:   retrieve
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
    if (!HAS_EXTENDED_CREATE_ELEMENT_SYNTAX) return false;
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

  var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY =
   checkElementPrototypeDeficiency('object');

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
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
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

    var ELEMENT_PROTOTYPE = window.HTMLElement ? HTMLElement.prototype :
     Element.prototype;

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
    extend:     extend,
    addMethods: addMethods
  });

  if (extend === Prototype.K) {
    GLOBAL.Element.extend.refresh = Prototype.emptyFunction;
  } else {
    GLOBAL.Element.extend.refresh = function() {
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
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods),
      "BUTTON":   Object.clone(Form.Element.Methods)
    });
  }

  Element.addMethods(methods);

  function destroyCache_IE() {
    DIV = null;
    ELEMENT_CACHE = null;
  }

  if (window.attachEvent)
    window.attachEvent('onunload', destroyCache_IE);

})(this);
(function() {

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

    var bl = getPixelValue(element, 'borderLeftWidth',  context) || 0;
    var br = getPixelValue(element, 'borderRightWidth', context) || 0;
    var pl = getPixelValue(element, 'paddingLeft',      context) || 0;
    var pr = getPixelValue(element, 'paddingRight',     context) || 0;

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

    var isPercentage = value.include('%'), isViewport = (context === document.viewport);

    if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
      var style = element.style.left, rStyle = element.runtimeStyle.left;
      element.runtimeStyle.left = element.currentStyle.left;
      element.style.left = value || 0;
      value = element.style.pixelLeft;
      element.style.left = style;
      element.runtimeStyle.left = rStyle;

      return value;
    }

    if (element && isPercentage) {
      context = context || element.parentNode;
      var decimal = toDecimal(value), whole = null;

      var isHorizontal = property.include('left') || property.include('right') ||
       property.include('width');

      var isVertical   = property.include('top') || property.include('bottom') ||
        property.include('height');

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
    hasLayout = function(element) {
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
    initialize: function($super, element, preCompute) {
      $super();
      this.element = $(element);

      Element.Layout.PROPERTIES.each( function(property) {
        this._set(property, null);
      }, this);

      if (preCompute) {
        this._preComputing = true;
        this._begin();
        Element.Layout.PROPERTIES.each( this._compute, this );
        this._end();
        this._preComputing = false;
      }
    },

    _set: function(property, value) {
      return Hash.prototype.set.call(this, property, value);
    },

    set: function(property, value) {
      throw "Properties of Element.Layout are read-only.";
    },

    get: function($super, property) {
      var value = $super(property);
      return value === null ? this._compute(property) : value;
    },

    _begin: function() {
      if (this._isPrepared()) return;

      var element = this.element;
      if (isDisplayed(element)) {
        this._setPrepared(true);
        return;
      }


      var originalStyles = {
        position:   element.style.position   || '',
        width:      element.style.width      || '',
        visibility: element.style.visibility || '',
        display:    element.style.display    || ''
      };

      element.store('prototype_original_styles', originalStyles);

      var position = getRawStyle(element, 'position'), width = element.offsetWidth;

      if (width === 0 || width === null) {
        element.style.display = 'block';
        width = element.offsetWidth;
      }

      var context = (position === 'fixed') ? document.viewport :
       element.parentNode;

      var tempStyles = {
        visibility: 'hidden',
        display:    'block'
      };

      if (position !== 'fixed') tempStyles.position = 'absolute';

      element.setStyle(tempStyles);

      var positionedWidth = element.offsetWidth, newWidth;
      if (width && (positionedWidth === width)) {
        newWidth = getContentWidth(element, context);
      } else if (position === 'absolute' || position === 'fixed') {
        newWidth = getContentWidth(element, context);
      } else {
        var parent = element.parentNode, pLayout = $(parent).getLayout();

        newWidth = pLayout.get('width') -
         this.get('margin-left') -
         this.get('border-left') -
         this.get('padding-left') -
         this.get('padding-right') -
         this.get('border-right') -
         this.get('margin-right');
      }

      element.setStyle({ width: newWidth + 'px' });

      this._setPrepared(true);
    },

    _end: function() {
      var element = this.element;
      var originalStyles = element.retrieve('prototype_original_styles');
      element.store('prototype_original_styles', null);
      element.setStyle(originalStyles);
      this._setPrepared(false);
    },

    _compute: function(property) {
      var COMPUTATIONS = Element.Layout.COMPUTATIONS;
      if (!(property in COMPUTATIONS)) {
        throw "Property not found.";
      }

      return this._set(property, COMPUTATIONS[property].call(this, this.element));
    },

    _isPrepared: function() {
      return this.element.retrieve('prototype_element_layout_prepared', false);
    },

    _setPrepared: function(bool) {
      return this.element.store('prototype_element_layout_prepared', bool);
    },

    toObject: function() {
      var args = $A(arguments);
      var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
       args.join(' ').split(' ');
      var obj = {};
      keys.each( function(key) {
        if (!Element.Layout.PROPERTIES.include(key)) return;
        var value = this.get(key);
        if (value != null) obj[key] = value;
      }, this);
      return obj;
    },

    toHash: function() {
      var obj = this.toObject.apply(this, arguments);
      return new Hash(obj);
    },

    toCSS: function() {
      var args = $A(arguments);
      var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
       args.join(' ').split(' ');
      var css = {};

      keys.each( function(key) {
        if (!Element.Layout.PROPERTIES.include(key)) return;
        if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;

        var value = this.get(key);
        if (value != null) css[cssNameFor(key)] = value + 'px';
      }, this);
      return css;
    },

    inspect: function() {
      return "#<Element.Layout>";
    }
  });

  Object.extend(Element.Layout, {
    PROPERTIES: $w('height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'),

    COMPOSITE_PROPERTIES: $w('padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'),

    COMPUTATIONS: {
      'height': function(element) {
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

      'width': function(element) {
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

      'padding-box-height': function(element) {
        var height = this.get('height'),
         pTop = this.get('padding-top'),
         pBottom = this.get('padding-bottom');

        return height + pTop + pBottom;
      },

      'padding-box-width': function(element) {
        var width = this.get('width'),
         pLeft = this.get('padding-left'),
         pRight = this.get('padding-right');

        return width + pLeft + pRight;
      },

      'border-box-height': function(element) {
        if (!this._preComputing) this._begin();
        var height = element.offsetHeight;
        if (!this._preComputing) this._end();
        return height;
      },

      'border-box-width': function(element) {
        if (!this._preComputing) this._begin();
        var width = element.offsetWidth;
        if (!this._preComputing) this._end();
        return width;
      },

      'margin-box-height': function(element) {
        var bHeight = this.get('border-box-height'),
         mTop = this.get('margin-top'),
         mBottom = this.get('margin-bottom');

        if (bHeight <= 0) return 0;

        return bHeight + mTop + mBottom;
      },

      'margin-box-width': function(element) {
        var bWidth = this.get('border-box-width'),
         mLeft = this.get('margin-left'),
         mRight = this.get('margin-right');

        if (bWidth <= 0) return 0;

        return bWidth + mLeft + mRight;
      },

      'top': function(element) {
        var offset = element.positionedOffset();
        return offset.top;
      },

      'bottom': function(element) {
        var offset = element.positionedOffset(),
         parent = element.getOffsetParent(),
         pHeight = parent.measure('height');

        var mHeight = this.get('border-box-height');

        return pHeight - mHeight - offset.top;
      },

      'left': function(element) {
        var offset = element.positionedOffset();
        return offset.left;
      },

      'right': function(element) {
        var offset = element.positionedOffset(),
         parent = element.getOffsetParent(),
         pWidth = parent.measure('width');

        var mWidth = this.get('border-box-width');

        return pWidth - mWidth - offset.left;
      },

      'padding-top': function(element) {
        return getPixelValue(element, 'paddingTop');
      },

      'padding-bottom': function(element) {
        return getPixelValue(element, 'paddingBottom');
      },

      'padding-left': function(element) {
        return getPixelValue(element, 'paddingLeft');
      },

      'padding-right': function(element) {
        return getPixelValue(element, 'paddingRight');
      },

      'border-top': function(element) {
        return getPixelValue(element, 'borderTopWidth');
      },

      'border-bottom': function(element) {
        return getPixelValue(element, 'borderBottomWidth');
      },

      'border-left': function(element) {
        return getPixelValue(element, 'borderLeftWidth');
      },

      'border-right': function(element) {
        return getPixelValue(element, 'borderRightWidth');
      },

      'margin-top': function(element) {
        return getPixelValue(element, 'marginTop');
      },

      'margin-bottom': function(element) {
        return getPixelValue(element, 'marginBottom');
      },

      'margin-left': function(element) {
        return getPixelValue(element, 'marginLeft');
      },

      'margin-right': function(element) {
        return getPixelValue(element, 'marginRight');
      }
    }
  });

  if ('getBoundingClientRect' in document.documentElement) {
    Object.extend(Element.Layout.COMPUTATIONS, {
      'right': function(element) {
        var parent = hasLayout(element.getOffsetParent());
        var rect = element.getBoundingClientRect(),
         pRect = parent.getBoundingClientRect();

        return (pRect.right - rect.right).round();
      },

      'bottom': function(element) {
        var parent = hasLayout(element.getOffsetParent());
        var rect = element.getBoundingClientRect(),
         pRect = parent.getBoundingClientRect();

        return (pRect.bottom - rect.bottom).round();
      }
    });
  }

  Element.Offset = Class.create({
    initialize: function(left, top) {
      this.left = left.round();
      this.top  = top.round();

      this[0] = this.left;
      this[1] = this.top;
    },

    relativeTo: function(offset) {
      return new Element.Offset(
        this.left - offset.left,
        this.top  - offset.top
      );
    },

    inspect: function() {
      return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this);
    },

    toString: function() {
      return "[#{left}, #{top}]".interpolate(this);
    },

    toArray: function() {
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
      return { width: element.offsetWidth, height: element.offsetHeight };
    }

    var style = element.style;
    var originalStyles = {
      visibility: style.visibility,
      position:   style.position,
      display:    style.display
    };

    var newStyles = {
      visibility: 'hidden',
      display:    'block'
    };

    if (originalStyles.position !== 'fixed')
      newStyles.position = 'absolute';

    Element.setStyle(element, newStyles);

    var dimensions = {
      width:  element.offsetWidth,
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
    var valueT = 0, valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }
    return new Element.Offset(valueL, valueT);
  }

  function positionedOffset(element) {
    element = $(element);

    var layout = element.getLayout();

    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
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
    var valueT = 0, valueL = 0;
    do {
      if (element === document.body) {
        var bodyScrollNode = document.documentElement || document.body.parentNode || document.body;
        valueT += !Object.isUndefined(window.pageYOffset) ? window.pageYOffset : bodyScrollNode.scrollTop || 0;
        valueL += !Object.isUndefined(window.pageXOffset) ? window.pageXOffset : bodyScrollNode.scrollLeft || 0;
        break;
      } else {
        valueT += element.scrollTop  || 0;
        valueL += element.scrollLeft || 0;
        element = element.parentNode;
      }
    } while (element);
    return new Element.Offset(valueL, valueT);
  }

  function viewportOffset(forElement) {
    var valueT = 0, valueL = 0, docBody = document.body;

    forElement = $(forElement);
    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == docBody &&
        Element.getStyle(element, 'position') == 'absolute') break;
    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (element != docBody) {
        valueT -= element.scrollTop  || 0;
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
      position: element.getStyle('position'),
      left:     element.getStyle('left'),
      top:      element.getStyle('top'),
      width:    element.getStyle('width'),
      height:   element.getStyle('height')
    });

    element.setStyle({
      position: 'absolute',
      top:    offset.top + 'px',
      left:   offset.left + 'px',
      width:  layout.get('width') + 'px',
      height: layout.get('height') + 'px'
    });

    return element;
  }

  function relativize(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') === 'relative') {
      return element;
    }

    var originalStyles =
     element.retrieve('prototype_absolutize_original_styles');

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
    var position = Element.getStyle(element, 'position'), styles = {};
    if (position === 'static' || !position) {
      styles.position = 'relative';
      if (Prototype.Browser.Opera) {
        styles.top  = 0;
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
        top:      '',
        bottom:   '',
        left:     '',
        right:    ''
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
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, options || {});

    source  = $(source);
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
      styles.top  = (p[1] - delta[1] + options.offsetTop)  + 'px';

    if (options.setWidth)
      styles.width  = layout.get('border-box-width')  + 'px';
    if (options.setHeight)
      styles.height = layout.get('border-box-height') + 'px';

    return Element.setStyle(element, styles);
  }


  if (Prototype.Browser.IE) {
    getOffsetParent = getOffsetParent.wrap(
      function(proceed, element) {
        element = $(element);

        if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
          return $(document.body);

        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);

        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      }
    );

    positionedOffset = positionedOffset.wrap(function(proceed, element) {
      element = $(element);
      if (!element.parentNode) return new Element.Offset(0, 0);
      var position = element.getStyle('position');
      if (position !== 'static') return proceed(element);

      var offsetParent = element.getOffsetParent();
      if (offsetParent && offsetParent.getStyle('position') === 'fixed')
        hasLayout(offsetParent);

      element.setStyle({ position: 'relative' });
      var value = proceed(element);
      element.setStyle({ position: position });
      return value;
    });
  } else if (Prototype.Browser.Webkit) {
    cumulativeOffset = function(element) {
      element = $(element);
      var valueT = 0, valueL = 0;
      do {
        valueT += element.offsetTop  || 0;
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
    getLayout:              getLayout,
    measure:                measure,
    getWidth:               getWidth,
    getHeight:              getHeight,
    getDimensions:          getDimensions,
    getOffsetParent:        getOffsetParent,
    cumulativeOffset:       cumulativeOffset,
    positionedOffset:       positionedOffset,
    cumulativeScrollOffset: cumulativeScrollOffset,
    viewportOffset:         viewportOffset,
    absolutize:             absolutize,
    relativize:             relativize,
    scrollTo:               scrollTo,
    makePositioned:         makePositioned,
    undoPositioned:         undoPositioned,
    makeClipping:           makeClipping,
    undoClipping:           undoClipping,
    clonePosition:          clonePosition
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
    return element !== document.body &&
     !Element.descendantOf(element, document.body);
  }

  if ('getBoundingClientRect' in document.documentElement) {
    Element.addMethods({
      viewportOffset: function(element) {
        element = $(element);
        if (isDetached(element)) return new Element.Offset(0, 0);

        var rect = element.getBoundingClientRect(),
         docEl = document.documentElement;
        return new Element.Offset(rect.left - docEl.clientLeft,
         rect.top - docEl.clientTop);
      }
    });
  }


})();

(function() {

  var IS_OLD_OPERA = Prototype.Browser.Opera &&
   (window.parseFloat(window.opera.version()) < 9.5);
  var ROOT = null;
  function getRootElement() {
    if (ROOT) return ROOT;
    ROOT = IS_OLD_OPERA ? document.body : document.documentElement;
    return ROOT;
  }

  function getDimensions() {
    return { width: this.getWidth(), height: this.getHeight() };
  }

  function getWidth() {
    return getRootElement().clientWidth;
  }

  function getHeight() {
    return getRootElement().clientHeight;
  }

  function getScrollOffsets() {
    var x = window.pageXOffset || document.documentElement.scrollLeft ||
     document.body.scrollLeft;
    var y = window.pageYOffset || document.documentElement.scrollTop ||
     document.body.scrollTop;

    return new Element.Offset(x, y);
  }

  document.viewport = {
    getDimensions:    getDimensions,
    getWidth:         getWidth,
    getHeight:        getHeight,
    getScrollOffsets: getScrollOffsets
  };

})();
window.$$ = function() {
  var expression = $A(arguments).join(', ');
  return Prototype.Selector.select(expression, document);
};

Prototype.Selector = (function() {

  function select() {
    throw new Error('Method "Prototype.Selector.select" must be defined.');
  }

  function match() {
    throw new Error('Method "Prototype.Selector.match" must be defined.');
  }

  function find(elements, expression, index) {
    index = index || 0;
    var match = Prototype.Selector.match, length = elements.length, matchIndex = 0, i;

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
Prototype._original_property = window.Sizzle;
/*!
 * Sizzle CSS Selector Engine v@VERSION
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function( window ) {

var i,
    support,
    Expr,
    getText,
    isXML,
    compile,
    select,
    outermostContext,
    sortInput,
    hasDuplicate,

    setDocument,
    document,
    docElem,
    documentIsHTML,
    rbuggyQSA,
    rbuggyMatches,
    matches,
    contains,

    expando = "sizzle" + -(new Date()),
    preferredDoc = window.document,
    dirruns = 0,
    done = 0,
    classCache = createCache(),
    tokenCache = createCache(),
    compilerCache = createCache(),
    sortOrder = function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
        }
        return 0;
    },

    strundefined = typeof undefined,
    MAX_NEGATIVE = 1 << 31,

    hasOwn = ({}).hasOwnProperty,
    arr = [],
    pop = arr.pop,
    push_native = arr.push,
    push = arr.push,
    slice = arr.slice,
    indexOf = arr.indexOf || function( elem ) {
        var i = 0,
            len = this.length;
        for ( ; i < len; i++ ) {
            if ( this[i] === elem ) {
                return i;
            }
        }
        return -1;
    },

    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


    whitespace = "[\\x20\\t\\r\\n\\f]",
    characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

    identifier = characterEncoding.replace( "w", "w#" ),

    attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
        "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

    pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

    rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

    rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

    rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

    rpseudo = new RegExp( pseudos ),
    ridentifier = new RegExp( "^" + identifier + "$" ),

    matchExpr = {
        "ID": new RegExp( "^#(" + characterEncoding + ")" ),
        "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
        "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
        "ATTR": new RegExp( "^" + attributes ),
        "PSEUDO": new RegExp( "^" + pseudos ),
        "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
            "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
            "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
        "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
        "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    },

    rinputs = /^(?:input|select|textarea|button)$/i,
    rheader = /^h\d$/i,

    rnative = /^[^{]+\{\s*\[native \w/,

    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    rsibling = /[+~]/,
    rescape = /'|\\/g,

    runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
    funescape = function( _, escaped, escapedWhitespace ) {
        var high = "0x" + escaped - 0x10000;
        return high !== high || escapedWhitespace ?
            escaped :
            high < 0 ?
                String.fromCharCode( high + 0x10000 ) :
                String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    };

try {
    push.apply(
        (arr = slice.call( preferredDoc.childNodes )),
        preferredDoc.childNodes
    );
    arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
    push = { apply: arr.length ?

        function( target, els ) {
            push_native.apply( target, slice.call(els) );
        } :

        function( target, els ) {
            var j = target.length,
                i = 0;
            while ( (target[j++] = els[i++]) ) {}
            target.length = j - 1;
        }
    };
}

function Sizzle( selector, context, results, seed ) {
    var match, elem, m, nodeType,
        i, groups, old, nid, newContext, newSelector;

    if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
        setDocument( context );
    }

    context = context || document;
    results = results || [];

    if ( !selector || typeof selector !== "string" ) {
        return results;
    }

    if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
        return [];
    }

    if ( documentIsHTML && !seed ) {

        if ( (match = rquickExpr.exec( selector )) ) {
            if ( (m = match[1]) ) {
                if ( nodeType === 9 ) {
                    elem = context.getElementById( m );
                    if ( elem && elem.parentNode ) {
                        if ( elem.id === m ) {
                            results.push( elem );
                            return results;
                        }
                    } else {
                        return results;
                    }
                } else {
                    if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                        contains( context, elem ) && elem.id === m ) {
                        results.push( elem );
                        return results;
                    }
                }

            } else if ( match[2] ) {
                push.apply( results, context.getElementsByTagName( selector ) );
                return results;

            } else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
                push.apply( results, context.getElementsByClassName( m ) );
                return results;
            }
        }

        if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
            nid = old = expando;
            newContext = context;
            newSelector = nodeType === 9 && selector;

            if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                groups = tokenize( selector );

                if ( (old = context.getAttribute("id")) ) {
                    nid = old.replace( rescape, "\\$&" );
                } else {
                    context.setAttribute( "id", nid );
                }
                nid = "[id='" + nid + "'] ";

                i = groups.length;
                while ( i-- ) {
                    groups[i] = nid + toSelector( groups[i] );
                }
                newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
                newSelector = groups.join(",");
            }

            if ( newSelector ) {
                try {
                    push.apply( results,
                        newContext.querySelectorAll( newSelector )
                    );
                    return results;
                } catch(qsaError) {
                } finally {
                    if ( !old ) {
                        context.removeAttribute("id");
                    }
                }
            }
        }
    }

    return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *  deleting the oldest entry
 */
function createCache() {
    var keys = [];

    function cache( key, value ) {
        if ( keys.push( key + " " ) > Expr.cacheLength ) {
            delete cache[ keys.shift() ];
        }
        return (cache[ key + " " ] = value);
    }
    return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
    fn[ expando ] = true;
    return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
    var div = document.createElement("div");

    try {
        return !!fn( div );
    } catch (e) {
        return false;
    } finally {
        if ( div.parentNode ) {
            div.parentNode.removeChild( div );
        }
        div = null;
    }
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
    var arr = attrs.split("|"),
        i = attrs.length;

    while ( i-- ) {
        Expr.attrHandle[ arr[i] ] = handler;
    }
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
    var cur = b && a,
        diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
            ( ~b.sourceIndex || MAX_NEGATIVE ) -
            ( ~a.sourceIndex || MAX_NEGATIVE );

    if ( diff ) {
        return diff;
    }

    if ( cur ) {
        while ( (cur = cur.nextSibling) ) {
            if ( cur === b ) {
                return -1;
            }
        }
    }

    return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
    return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
    };
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
    return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
    };
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
    return markFunction(function( argument ) {
        argument = +argument;
        return markFunction(function( seed, matches ) {
            var j,
                matchIndexes = fn( [], seed.length, argument ),
                i = matchIndexes.length;

            while ( i-- ) {
                if ( seed[ (j = matchIndexes[i]) ] ) {
                    seed[j] = !(matches[j] = seed[j]);
                }
            }
        });
    });
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
    return context && typeof context.getElementsByTagName !== strundefined && context;
}

support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
    var hasCompare,
        doc = node ? node.ownerDocument || node : preferredDoc,
        parent = doc.defaultView;

    if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
        return document;
    }

    document = doc;
    docElem = doc.documentElement;

    documentIsHTML = !isXML( doc );

    if ( parent && parent !== parent.top ) {
        if ( parent.addEventListener ) {
            parent.addEventListener( "unload", function() {
                setDocument();
            }, false );
        } else if ( parent.attachEvent ) {
            parent.attachEvent( "onunload", function() {
                setDocument();
            });
        }
    }

    /* Attributes
    ---------------------------------------------------------------------- */

    support.attributes = assert(function( div ) {
        div.className = "i";
        return !div.getAttribute("className");
    });

    /* getElement(s)By*
    ---------------------------------------------------------------------- */

    support.getElementsByTagName = assert(function( div ) {
        div.appendChild( doc.createComment("") );
        return !div.getElementsByTagName("*").length;
    });

    support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
        div.innerHTML = "<div class='a'></div><div class='a i'></div>";

        div.firstChild.className = "i";
        return div.getElementsByClassName("i").length === 2;
    });

    support.getById = assert(function( div ) {
        docElem.appendChild( div ).id = expando;
        return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
    });

    if ( support.getById ) {
        Expr.find["ID"] = function( id, context ) {
            if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
                var m = context.getElementById( id );
                return m && m.parentNode ? [m] : [];
            }
        };
        Expr.filter["ID"] = function( id ) {
            var attrId = id.replace( runescape, funescape );
            return function( elem ) {
                return elem.getAttribute("id") === attrId;
            };
        };
    } else {
        delete Expr.find["ID"];

        Expr.filter["ID"] =  function( id ) {
            var attrId = id.replace( runescape, funescape );
            return function( elem ) {
                var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                return node && node.value === attrId;
            };
        };
    }

    Expr.find["TAG"] = support.getElementsByTagName ?
        function( tag, context ) {
            if ( typeof context.getElementsByTagName !== strundefined ) {
                return context.getElementsByTagName( tag );
            }
        } :
        function( tag, context ) {
            var elem,
                tmp = [],
                i = 0,
                results = context.getElementsByTagName( tag );

            if ( tag === "*" ) {
                while ( (elem = results[i++]) ) {
                    if ( elem.nodeType === 1 ) {
                        tmp.push( elem );
                    }
                }

                return tmp;
            }
            return results;
        };

    Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
        if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
            return context.getElementsByClassName( className );
        }
    };

    /* QSA/matchesSelector
    ---------------------------------------------------------------------- */


    rbuggyMatches = [];

    rbuggyQSA = [];

    if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
        assert(function( div ) {
            div.innerHTML = "<select t=''><option selected=''></option></select>";

            if ( div.querySelectorAll("[t^='']").length ) {
                rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
            }

            if ( !div.querySelectorAll("[selected]").length ) {
                rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
            }

            if ( !div.querySelectorAll(":checked").length ) {
                rbuggyQSA.push(":checked");
            }
        });

        assert(function( div ) {
            var input = doc.createElement("input");
            input.setAttribute( "type", "hidden" );
            div.appendChild( input ).setAttribute( "name", "D" );

            if ( div.querySelectorAll("[name=d]").length ) {
                rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
            }

            if ( !div.querySelectorAll(":enabled").length ) {
                rbuggyQSA.push( ":enabled", ":disabled" );
            }

            div.querySelectorAll("*,:x");
            rbuggyQSA.push(",.*:");
        });
    }

    if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector) )) ) {

        assert(function( div ) {
            support.disconnectedMatch = matches.call( div, "div" );

            matches.call( div, "[s!='']:x" );
            rbuggyMatches.push( "!=", pseudos );
        });
    }

    rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
    rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

    /* Contains
    ---------------------------------------------------------------------- */
    hasCompare = rnative.test( docElem.compareDocumentPosition );

    contains = hasCompare || rnative.test( docElem.contains ) ?
        function( a, b ) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a === bup || !!( bup && bup.nodeType === 1 && (
                adown.contains ?
                    adown.contains( bup ) :
                    a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
            ));
        } :
        function( a, b ) {
            if ( b ) {
                while ( (b = b.parentNode) ) {
                    if ( b === a ) {
                        return true;
                    }
                }
            }
            return false;
        };

    /* Sorting
    ---------------------------------------------------------------------- */

    sortOrder = hasCompare ?
    function( a, b ) {

        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if ( compare ) {
            return compare;
        }

        compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
            a.compareDocumentPosition( b ) :

            1;

        if ( compare & 1 ||
            (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

            if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
                return -1;
            }
            if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
                return 1;
            }

            return sortInput ?
                ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                0;
        }

        return compare & 4 ? -1 : 1;
    } :
    function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [ a ],
            bp = [ b ];

        if ( !aup || !bup ) {
            return a === doc ? -1 :
                b === doc ? 1 :
                aup ? -1 :
                bup ? 1 :
                sortInput ?
                ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                0;

        } else if ( aup === bup ) {
            return siblingCheck( a, b );
        }

        cur = a;
        while ( (cur = cur.parentNode) ) {
            ap.unshift( cur );
        }
        cur = b;
        while ( (cur = cur.parentNode) ) {
            bp.unshift( cur );
        }

        while ( ap[i] === bp[i] ) {
            i++;
        }

        return i ?
            siblingCheck( ap[i], bp[i] ) :

            ap[i] === preferredDoc ? -1 :
            bp[i] === preferredDoc ? 1 :
            0;
    };

    return doc;
};

Sizzle.matches = function( expr, elements ) {
    return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
    if ( ( elem.ownerDocument || elem ) !== document ) {
        setDocument( elem );
    }

    expr = expr.replace( rattributeQuotes, "='$1']" );

    if ( support.matchesSelector && documentIsHTML &&
        ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
        ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

        try {
            var ret = matches.call( elem, expr );

            if ( ret || support.disconnectedMatch ||
                    elem.document && elem.document.nodeType !== 11 ) {
                return ret;
            }
        } catch(e) {}
    }

    return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
    if ( ( context.ownerDocument || context ) !== document ) {
        setDocument( context );
    }
    return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
    if ( ( elem.ownerDocument || elem ) !== document ) {
        setDocument( elem );
    }

    var fn = Expr.attrHandle[ name.toLowerCase() ],
        val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
            fn( elem, name, !documentIsHTML ) :
            undefined;

    return val !== undefined ?
        val :
        support.attributes || !documentIsHTML ?
            elem.getAttribute( name ) :
            (val = elem.getAttributeNode(name)) && val.specified ?
                val.value :
                null;
};

Sizzle.error = function( msg ) {
    throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
    var elem,
        duplicates = [],
        j = 0,
        i = 0;

    hasDuplicate = !support.detectDuplicates;
    sortInput = !support.sortStable && results.slice( 0 );
    results.sort( sortOrder );

    if ( hasDuplicate ) {
        while ( (elem = results[i++]) ) {
            if ( elem === results[ i ] ) {
                j = duplicates.push( i );
            }
        }
        while ( j-- ) {
            results.splice( duplicates[ j ], 1 );
        }
    }

    sortInput = null;

    return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
    var node,
        ret = "",
        i = 0,
        nodeType = elem.nodeType;

    if ( !nodeType ) {
        while ( (node = elem[i++]) ) {
            ret += getText( node );
        }
    } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
        if ( typeof elem.textContent === "string" ) {
            return elem.textContent;
        } else {
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                ret += getText( elem );
            }
        }
    } else if ( nodeType === 3 || nodeType === 4 ) {
        return elem.nodeValue;
    }

    return ret;
};

Expr = Sizzle.selectors = {

    cacheLength: 50,

    createPseudo: markFunction,

    match: matchExpr,

    attrHandle: {},

    find: {},

    relative: {
        ">": { dir: "parentNode", first: true },
        " ": { dir: "parentNode" },
        "+": { dir: "previousSibling", first: true },
        "~": { dir: "previousSibling" }
    },

    preFilter: {
        "ATTR": function( match ) {
            match[1] = match[1].replace( runescape, funescape );

            match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

            if ( match[2] === "~=" ) {
                match[3] = " " + match[3] + " ";
            }

            return match.slice( 0, 4 );
        },

        "CHILD": function( match ) {
            /* matches from matchExpr["CHILD"]
                1 type (only|nth|...)
                2 what (child|of-type)
                3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                4 xn-component of xn+y argument ([+-]?\d*n|)
                5 sign of xn-component
                6 x of xn-component
                7 sign of y-component
                8 y of y-component
            */
            match[1] = match[1].toLowerCase();

            if ( match[1].slice( 0, 3 ) === "nth" ) {
                if ( !match[3] ) {
                    Sizzle.error( match[0] );
                }

                match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

            } else if ( match[3] ) {
                Sizzle.error( match[0] );
            }

            return match;
        },

        "PSEUDO": function( match ) {
            var excess,
                unquoted = !match[5] && match[2];

            if ( matchExpr["CHILD"].test( match[0] ) ) {
                return null;
            }

            if ( match[3] && match[4] !== undefined ) {
                match[2] = match[4];

            } else if ( unquoted && rpseudo.test( unquoted ) &&
                (excess = tokenize( unquoted, true )) &&
                (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                match[0] = match[0].slice( 0, excess );
                match[2] = unquoted.slice( 0, excess );
            }

            return match.slice( 0, 3 );
        }
    },

    filter: {

        "TAG": function( nodeNameSelector ) {
            var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
            return nodeNameSelector === "*" ?
                function() { return true; } :
                function( elem ) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                };
        },

        "CLASS": function( className ) {
            var pattern = classCache[ className + " " ];

            return pattern ||
                (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                classCache( className, function( elem ) {
                    return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
                });
        },

        "ATTR": function( name, operator, check ) {
            return function( elem ) {
                var result = Sizzle.attr( elem, name );

                if ( result == null ) {
                    return operator === "!=";
                }
                if ( !operator ) {
                    return true;
                }

                result += "";

                return operator === "=" ? result === check :
                    operator === "!=" ? result !== check :
                    operator === "^=" ? check && result.indexOf( check ) === 0 :
                    operator === "*=" ? check && result.indexOf( check ) > -1 :
                    operator === "$=" ? check && result.slice( -check.length ) === check :
                    operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                    operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                    false;
            };
        },

        "CHILD": function( type, what, argument, first, last ) {
            var simple = type.slice( 0, 3 ) !== "nth",
                forward = type.slice( -4 ) !== "last",
                ofType = what === "of-type";

            return first === 1 && last === 0 ?

                function( elem ) {
                    return !!elem.parentNode;
                } :

                function( elem, context, xml ) {
                    var cache, outerCache, node, diff, nodeIndex, start,
                        dir = simple !== forward ? "nextSibling" : "previousSibling",
                        parent = elem.parentNode,
                        name = ofType && elem.nodeName.toLowerCase(),
                        useCache = !xml && !ofType;

                    if ( parent ) {

                        if ( simple ) {
                            while ( dir ) {
                                node = elem;
                                while ( (node = node[ dir ]) ) {
                                    if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                                        return false;
                                    }
                                }
                                start = dir = type === "only" && !start && "nextSibling";
                            }
                            return true;
                        }

                        start = [ forward ? parent.firstChild : parent.lastChild ];

                        if ( forward && useCache ) {
                            outerCache = parent[ expando ] || (parent[ expando ] = {});
                            cache = outerCache[ type ] || [];
                            nodeIndex = cache[0] === dirruns && cache[1];
                            diff = cache[0] === dirruns && cache[2];
                            node = nodeIndex && parent.childNodes[ nodeIndex ];

                            while ( (node = ++nodeIndex && node && node[ dir ] ||

                                (diff = nodeIndex = 0) || start.pop()) ) {

                                if ( node.nodeType === 1 && ++diff && node === elem ) {
                                    outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                                    break;
                                }
                            }

                        } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
                            diff = cache[1];

                        } else {
                            while ( (node = ++nodeIndex && node && node[ dir ] ||
                                (diff = nodeIndex = 0) || start.pop()) ) {

                                if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                                    if ( useCache ) {
                                        (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                                    }

                                    if ( node === elem ) {
                                        break;
                                    }
                                }
                            }
                        }

                        diff -= last;
                        return diff === first || ( diff % first === 0 && diff / first >= 0 );
                    }
                };
        },

        "PSEUDO": function( pseudo, argument ) {
            var args,
                fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                    Sizzle.error( "unsupported pseudo: " + pseudo );

            if ( fn[ expando ] ) {
                return fn( argument );
            }

            if ( fn.length > 1 ) {
                args = [ pseudo, pseudo, "", argument ];
                return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                    markFunction(function( seed, matches ) {
                        var idx,
                            matched = fn( seed, argument ),
                            i = matched.length;
                        while ( i-- ) {
                            idx = indexOf.call( seed, matched[i] );
                            seed[ idx ] = !( matches[ idx ] = matched[i] );
                        }
                    }) :
                    function( elem ) {
                        return fn( elem, 0, args );
                    };
            }

            return fn;
        }
    },

    pseudos: {
        "not": markFunction(function( selector ) {
            var input = [],
                results = [],
                matcher = compile( selector.replace( rtrim, "$1" ) );

            return matcher[ expando ] ?
                markFunction(function( seed, matches, context, xml ) {
                    var elem,
                        unmatched = matcher( seed, null, xml, [] ),
                        i = seed.length;

                    while ( i-- ) {
                        if ( (elem = unmatched[i]) ) {
                            seed[i] = !(matches[i] = elem);
                        }
                    }
                }) :
                function( elem, context, xml ) {
                    input[0] = elem;
                    matcher( input, null, xml, results );
                    return !results.pop();
                };
        }),

        "has": markFunction(function( selector ) {
            return function( elem ) {
                return Sizzle( selector, elem ).length > 0;
            };
        }),

        "contains": markFunction(function( text ) {
            return function( elem ) {
                return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
            };
        }),

        "lang": markFunction( function( lang ) {
            if ( !ridentifier.test(lang || "") ) {
                Sizzle.error( "unsupported lang: " + lang );
            }
            lang = lang.replace( runescape, funescape ).toLowerCase();
            return function( elem ) {
                var elemLang;
                do {
                    if ( (elemLang = documentIsHTML ?
                        elem.lang :
                        elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

                        elemLang = elemLang.toLowerCase();
                        return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                    }
                } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                return false;
            };
        }),

        "target": function( elem ) {
            var hash = window.location && window.location.hash;
            return hash && hash.slice( 1 ) === elem.id;
        },

        "root": function( elem ) {
            return elem === docElem;
        },

        "focus": function( elem ) {
            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },

        "enabled": function( elem ) {
            return elem.disabled === false;
        },

        "disabled": function( elem ) {
            return elem.disabled === true;
        },

        "checked": function( elem ) {
            var nodeName = elem.nodeName.toLowerCase();
            return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
        },

        "selected": function( elem ) {
            if ( elem.parentNode ) {
                elem.parentNode.selectedIndex;
            }

            return elem.selected === true;
        },

        "empty": function( elem ) {
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                if ( elem.nodeType < 6 ) {
                    return false;
                }
            }
            return true;
        },

        "parent": function( elem ) {
            return !Expr.pseudos["empty"]( elem );
        },

        "header": function( elem ) {
            return rheader.test( elem.nodeName );
        },

        "input": function( elem ) {
            return rinputs.test( elem.nodeName );
        },

        "button": function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === "button" || name === "button";
        },

        "text": function( elem ) {
            var attr;
            return elem.nodeName.toLowerCase() === "input" &&
                elem.type === "text" &&

                ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
        },

        "first": createPositionalPseudo(function() {
            return [ 0 ];
        }),

        "last": createPositionalPseudo(function( matchIndexes, length ) {
            return [ length - 1 ];
        }),

        "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
            return [ argument < 0 ? argument + length : argument ];
        }),

        "even": createPositionalPseudo(function( matchIndexes, length ) {
            var i = 0;
            for ( ; i < length; i += 2 ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "odd": createPositionalPseudo(function( matchIndexes, length ) {
            var i = 1;
            for ( ; i < length; i += 2 ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
            var i = argument < 0 ? argument + length : argument;
            for ( ; --i >= 0; ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
            var i = argument < 0 ? argument + length : argument;
            for ( ; ++i < length; ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        })
    }
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
    Expr.pseudos[ i ] = createButtonPseudo( i );
}

function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
    var matched, match, tokens, type,
        soFar, groups, preFilters,
        cached = tokenCache[ selector + " " ];

    if ( cached ) {
        return parseOnly ? 0 : cached.slice( 0 );
    }

    soFar = selector;
    groups = [];
    preFilters = Expr.preFilter;

    while ( soFar ) {

        if ( !matched || (match = rcomma.exec( soFar )) ) {
            if ( match ) {
                soFar = soFar.slice( match[0].length ) || soFar;
            }
            groups.push( (tokens = []) );
        }

        matched = false;

        if ( (match = rcombinators.exec( soFar )) ) {
            matched = match.shift();
            tokens.push({
                value: matched,
                type: match[0].replace( rtrim, " " )
            });
            soFar = soFar.slice( matched.length );
        }

        for ( type in Expr.filter ) {
            if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                (match = preFilters[ type ]( match ))) ) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                });
                soFar = soFar.slice( matched.length );
            }
        }

        if ( !matched ) {
            break;
        }
    }

    return parseOnly ?
        soFar.length :
        soFar ?
            Sizzle.error( selector ) :
            tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
    var i = 0,
        len = tokens.length,
        selector = "";
    for ( ; i < len; i++ ) {
        selector += tokens[i].value;
    }
    return selector;
}

function addCombinator( matcher, combinator, base ) {
    var dir = combinator.dir,
        checkNonElements = base && dir === "parentNode",
        doneName = done++;

    return combinator.first ?
        function( elem, context, xml ) {
            while ( (elem = elem[ dir ]) ) {
                if ( elem.nodeType === 1 || checkNonElements ) {
                    return matcher( elem, context, xml );
                }
            }
        } :

        function( elem, context, xml ) {
            var oldCache, outerCache,
                newCache = [ dirruns, doneName ];

            if ( xml ) {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        if ( matcher( elem, context, xml ) ) {
                            return true;
                        }
                    }
                }
            } else {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        outerCache = elem[ expando ] || (elem[ expando ] = {});
                        if ( (oldCache = outerCache[ dir ]) &&
                            oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

                            return (newCache[ 2 ] = oldCache[ 2 ]);
                        } else {
                            outerCache[ dir ] = newCache;

                            if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
                                return true;
                            }
                        }
                    }
                }
            }
        };
}

function elementMatcher( matchers ) {
    return matchers.length > 1 ?
        function( elem, context, xml ) {
            var i = matchers.length;
            while ( i-- ) {
                if ( !matchers[i]( elem, context, xml ) ) {
                    return false;
                }
            }
            return true;
        } :
        matchers[0];
}

function multipleContexts( selector, contexts, results ) {
    var i = 0,
        len = contexts.length;
    for ( ; i < len; i++ ) {
        Sizzle( selector, contexts[i], results );
    }
    return results;
}

function condense( unmatched, map, filter, context, xml ) {
    var elem,
        newUnmatched = [],
        i = 0,
        len = unmatched.length,
        mapped = map != null;

    for ( ; i < len; i++ ) {
        if ( (elem = unmatched[i]) ) {
            if ( !filter || filter( elem, context, xml ) ) {
                newUnmatched.push( elem );
                if ( mapped ) {
                    map.push( i );
                }
            }
        }
    }

    return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    if ( postFilter && !postFilter[ expando ] ) {
        postFilter = setMatcher( postFilter );
    }
    if ( postFinder && !postFinder[ expando ] ) {
        postFinder = setMatcher( postFinder, postSelector );
    }
    return markFunction(function( seed, results, context, xml ) {
        var temp, i, elem,
            preMap = [],
            postMap = [],
            preexisting = results.length,

            elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

            matcherIn = preFilter && ( seed || !selector ) ?
                condense( elems, preMap, preFilter, context, xml ) :
                elems,

            matcherOut = matcher ?
                postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                    [] :

                    results :
                matcherIn;

        if ( matcher ) {
            matcher( matcherIn, matcherOut, context, xml );
        }

        if ( postFilter ) {
            temp = condense( matcherOut, postMap );
            postFilter( temp, [], context, xml );

            i = temp.length;
            while ( i-- ) {
                if ( (elem = temp[i]) ) {
                    matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                }
            }
        }

        if ( seed ) {
            if ( postFinder || preFilter ) {
                if ( postFinder ) {
                    temp = [];
                    i = matcherOut.length;
                    while ( i-- ) {
                        if ( (elem = matcherOut[i]) ) {
                            temp.push( (matcherIn[i] = elem) );
                        }
                    }
                    postFinder( null, (matcherOut = []), temp, xml );
                }

                i = matcherOut.length;
                while ( i-- ) {
                    if ( (elem = matcherOut[i]) &&
                        (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

                        seed[temp] = !(results[temp] = elem);
                    }
                }
            }

        } else {
            matcherOut = condense(
                matcherOut === results ?
                    matcherOut.splice( preexisting, matcherOut.length ) :
                    matcherOut
            );
            if ( postFinder ) {
                postFinder( null, results, matcherOut, xml );
            } else {
                push.apply( results, matcherOut );
            }
        }
    });
}

function matcherFromTokens( tokens ) {
    var checkContext, matcher, j,
        len = tokens.length,
        leadingRelative = Expr.relative[ tokens[0].type ],
        implicitRelative = leadingRelative || Expr.relative[" "],
        i = leadingRelative ? 1 : 0,

        matchContext = addCombinator( function( elem ) {
            return elem === checkContext;
        }, implicitRelative, true ),
        matchAnyContext = addCombinator( function( elem ) {
            return indexOf.call( checkContext, elem ) > -1;
        }, implicitRelative, true ),
        matchers = [ function( elem, context, xml ) {
            return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                (checkContext = context).nodeType ?
                    matchContext( elem, context, xml ) :
                    matchAnyContext( elem, context, xml ) );
        } ];

    for ( ; i < len; i++ ) {
        if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
            matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
        } else {
            matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

            if ( matcher[ expando ] ) {
                j = ++i;
                for ( ; j < len; j++ ) {
                    if ( Expr.relative[ tokens[j].type ] ) {
                        break;
                    }
                }
                return setMatcher(
                    i > 1 && elementMatcher( matchers ),
                    i > 1 && toSelector(
                        tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
                    ).replace( rtrim, "$1" ),
                    matcher,
                    i < j && matcherFromTokens( tokens.slice( i, j ) ),
                    j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                    j < len && toSelector( tokens )
                );
            }
            matchers.push( matcher );
        }
    }

    return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    var bySet = setMatchers.length > 0,
        byElement = elementMatchers.length > 0,
        superMatcher = function( seed, context, xml, results, outermost ) {
            var elem, j, matcher,
                matchedCount = 0,
                i = "0",
                unmatched = seed && [],
                setMatched = [],
                contextBackup = outermostContext,
                elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
                dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                len = elems.length;

            if ( outermost ) {
                outermostContext = context !== document && context;
            }

            for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
                if ( byElement && elem ) {
                    j = 0;
                    while ( (matcher = elementMatchers[j++]) ) {
                        if ( matcher( elem, context, xml ) ) {
                            results.push( elem );
                            break;
                        }
                    }
                    if ( outermost ) {
                        dirruns = dirrunsUnique;
                    }
                }

                if ( bySet ) {
                    if ( (elem = !matcher && elem) ) {
                        matchedCount--;
                    }

                    if ( seed ) {
                        unmatched.push( elem );
                    }
                }
            }

            matchedCount += i;
            if ( bySet && i !== matchedCount ) {
                j = 0;
                while ( (matcher = setMatchers[j++]) ) {
                    matcher( unmatched, setMatched, context, xml );
                }

                if ( seed ) {
                    if ( matchedCount > 0 ) {
                        while ( i-- ) {
                            if ( !(unmatched[i] || setMatched[i]) ) {
                                setMatched[i] = pop.call( results );
                            }
                        }
                    }

                    setMatched = condense( setMatched );
                }

                push.apply( results, setMatched );

                if ( outermost && !seed && setMatched.length > 0 &&
                    ( matchedCount + setMatchers.length ) > 1 ) {

                    Sizzle.uniqueSort( results );
                }
            }

            if ( outermost ) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
            }

            return unmatched;
        };

    return bySet ?
        markFunction( superMatcher ) :
        superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
    var i,
        setMatchers = [],
        elementMatchers = [],
        cached = compilerCache[ selector + " " ];

    if ( !cached ) {
        if ( !match ) {
            match = tokenize( selector );
        }
        i = match.length;
        while ( i-- ) {
            cached = matcherFromTokens( match[i] );
            if ( cached[ expando ] ) {
                setMatchers.push( cached );
            } else {
                elementMatchers.push( cached );
            }
        }

        cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

        cached.selector = selector;
    }
    return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
    var i, tokens, token, type, find,
        compiled = typeof selector === "function" && selector,
        match = !seed && tokenize( (selector = compiled.selector || selector) );

    results = results || [];

    if ( match.length === 1 ) {

        tokens = match[0] = match[0].slice( 0 );
        if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                support.getById && context.nodeType === 9 && documentIsHTML &&
                Expr.relative[ tokens[1].type ] ) {

            context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
            if ( !context ) {
                return results;

            } else if ( compiled ) {
                context = context.parentNode;
            }

            selector = selector.slice( tokens.shift().value.length );
        }

        i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
        while ( i-- ) {
            token = tokens[i];

            if ( Expr.relative[ (type = token.type) ] ) {
                break;
            }
            if ( (find = Expr.find[ type ]) ) {
                if ( (seed = find(
                    token.matches[0].replace( runescape, funescape ),
                    rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
                )) ) {

                    tokens.splice( i, 1 );
                    selector = seed.length && toSelector( tokens );
                    if ( !selector ) {
                        push.apply( results, seed );
                        return results;
                    }

                    break;
                }
            }
        }
    }

    ( compiled || compile( selector, match ) )(
        seed,
        context,
        !documentIsHTML,
        results,
        rsibling.test( selector ) && testContext( context.parentNode ) || context
    );
    return results;
};


support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

support.detectDuplicates = !!hasDuplicate;

setDocument();

support.sortDetached = assert(function( div1 ) {
    return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

if ( !assert(function( div ) {
    div.innerHTML = "<a href='#'></a>";
    return div.firstChild.getAttribute("href") === "#" ;
}) ) {
    addHandle( "type|href|height|width", function( elem, name, isXML ) {
        if ( !isXML ) {
            return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
        }
    });
}

if ( !support.attributes || !assert(function( div ) {
    div.innerHTML = "<input/>";
    div.firstChild.setAttribute( "value", "" );
    return div.firstChild.getAttribute( "value" ) === "";
}) ) {
    addHandle( "value", function( elem, name, isXML ) {
        if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
            return elem.defaultValue;
        }
    });
}

if ( !assert(function( div ) {
    return div.getAttribute("disabled") == null;
}) ) {
    addHandle( booleans, function( elem, name, isXML ) {
        var val;
        if ( !isXML ) {
            return elem[ name ] === true ? name.toLowerCase() :
                    (val = elem.getAttributeNode( name )) && val.specified ?
                    val.value :
                null;
        }
    });
}

if ( typeof define === "function" && define.amd ) {
    define(function() { return Sizzle; });
} else if ( typeof module !== "undefined" && module.exports ) {
    module.exports = Sizzle;
} else {
    window.Sizzle = Sizzle;
}

})( window );

;(function(engine) {
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
  reset: function(form) {
    form = $(form);
    form.reset();
    return form;
  },

  serializeElements: function(elements, options) {
    if (typeof options != 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    var key, value, submitted = false, submit = options.submit, accumulator, initial;

    if (options.hash) {
      initial = {};
      accumulator = function(result, key, value) {
        if (key in result) {
          if (!Object.isArray(result[key])) result[key] = [result[key]];
          result[key] = result[key].concat(value);
        } else result[key] = value;
        return result;
      };
    } else {
      initial = '';
      accumulator = function(result, key, values) {
        if (!Object.isArray(values)) {values = [values];}
        if (!values.length) {return result;}
        var encodedKey = encodeURIComponent(key).gsub(/%20/, '+');
        return result + (result ? "&" : "") + values.map(function (value) {
          value = value.gsub(/(\r)?\n/, '\r\n');
          value = encodeURIComponent(value);
          value = value.gsub(/%20/, '+');
          return encodedKey + "=" + value;
        }).join("&");
      };
    }

    return elements.inject(initial, function(result, element) {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          result = accumulator(result, key, value);
        }
      }
      return result;
    });
  }
};

Form.Methods = {
  serialize: function(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },


  getElements: function(form) {
    var elements = $(form).getElementsByTagName('*');
    var element, results = [], serializers = Form.Element.Serializers;

    for (var i = 0; element = elements[i]; i++) {
      if (serializers[element.tagName.toLowerCase()])
        results.push(Element.extend(element));
    }
    return results;
  },

  getInputs: function(form, typeName, name) {
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

  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement: function(form) {
    var elements = $(form).getElements().findAll(function(element) {
      return 'hidden' != element.type && !element.disabled;
    });
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
    }).sortBy(function(element) { return element.tabIndex }).first();

    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return /^(?:input|select|textarea)$/i.test(element.tagName);
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    var element = form.findFirstElement();
    if (element) element.activate();
    return form;
  },

  request: function(form, options) {
    form = $(form), options = Object.clone(options || { });

    var params = options.parameters, action = form.readAttribute('action') || '';
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

/*--------------------------------------------------------------------------*/


Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
};

Form.Element.Methods = {

  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue: function(element, value) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !(/^(?:button|reset|submit)$/i.test(element.type))))
        element.select();
    } catch (e) { }
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;

var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = (function() {
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
    else element.checked = !!value;
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
      }
      else opt.selected = value.include(currentValue);
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
    input:         input,
    inputSelector: inputSelector,
    textarea:      valueSelector,
    select:        select,
    selectOne:     selectOne,
    selectMany:    selectMany,
    optionValue:   optionValue,
    button:        valueSelector
  };
})();

/*--------------------------------------------------------------------------*/


Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element   = $(element);
    this.lastValue = this.getValue();
  },

  execute: function() {
    var value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value) ?
        this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },

  registerCallback: function(element) {
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
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
(function(GLOBAL) {
  var DIV = document.createElement('div');
  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
   && 'onmouseleave' in docEl;

  var Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45
  };


  var isIELegacyEvent = function(event) { return false; };

  if (window.attachEvent) {
    if (window.addEventListener) {
      isIELegacyEvent = function(event) {
        return !(event instanceof window.Event);
      };
    } else {
      isIELegacyEvent = function(event) { return true; };
    }
  }

  var _isButton;

  function _isButtonForDOMEvents(event, code) {
    return event.which ? (event.which === code + 1) : (event.button === code);
  }

  var legacyButtonMap = { 0: 1, 1: 4, 2: 2 };
  function _isButtonForLegacyEvents(event, code) {
    return event.button === legacyButtonMap[code];
  }

  function _isButtonForWebKit(event, code) {
    switch (code) {
      case 0: return event.which == 1 && !event.metaKey;
      case 1: return event.which == 2 || (event.which == 1 && event.metaKey);
      case 2: return event.which == 3;
      default: return false;
    }
  }

  if (window.attachEvent) {
    if (!window.addEventListener) {
      _isButton = _isButtonForLegacyEvents;
    } else {
      _isButton = function(event, code) {
        return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) :
         _isButtonForDOMEvents(event, code);
      }
    }
  } else if (Prototype.Browser.WebKit) {
    _isButton = _isButtonForWebKit;
  } else {
    _isButton = _isButtonForDOMEvents;
  }

  function isLeftClick(event)   { return _isButton(event, 0) }

  function isMiddleClick(event) { return _isButton(event, 1) }

  function isRightClick(event)  { return _isButton(event, 2) }

  function element(event) {
    return Element.extend(_element(event));
  }

  function _element(event) {
    event = Event.extend(event);

    var node = event.target, type = event.type,
     currentTarget = event.currentTarget;

    if (currentTarget && currentTarget.tagName) {
      if (type === 'load' || type === 'error' ||
        (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
          && currentTarget.type === 'radio'))
            node = currentTarget;
    }

    return node.nodeType == Node.TEXT_NODE ? node.parentNode : node;
  }

  function findElement(event, expression) {
    var element = _element(event), selector = Prototype.Selector;
    if (!expression) return Element.extend(element);
    while (element) {
      if (Object.isElement(element) && selector.match(element, expression))
        return Element.extend(element);
      element = element.parentNode;
    }
  }

  function pointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }

  function pointerX(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollLeft: 0 };

    return event.pageX || (event.clientX +
      (docElement.scrollLeft || body.scrollLeft) -
      (docElement.clientLeft || 0));
  }

  function pointerY(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollTop: 0 };

    return  event.pageY || (event.clientY +
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
    isLeftClick:   isLeftClick,
    isMiddleClick: isMiddleClick,
    isRightClick:  isRightClick,

    element:     element,
    findElement: findElement,

    pointer:  pointer,
    pointerX: pointerX,
    pointerY: pointerY,

    stop: stop
  };

  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
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
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return '[object Event]' }
    };

    Event.extend = function(event, element) {
      if (!event) return false;

      if (!isIELegacyEvent(event)) return event;

      if (event._extendedByPrototype) return event;
      event._extendedByPrototype = Prototype.emptyFunction;

      var pointer = Event.pointer(event);

      Object.extend(event, {
        target: event.srcElement || element,
        relatedTarget: _relatedTarget(event),
        pageX:  pointer.x,
        pageY:  pointer.y
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
    if (!CACHE[uid]) CACHE[uid] = { element: element };
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
      handler:   handler
    };

    entries.push(entry);
    return entry;
  }

  function unregister(element, eventName, handler) {
    var registry = getRegistryForElement(element);
    var entries = registry[eventName];
    if (!entries) return;

    var i = entries.length, entry;
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
      element.attachEvent('onlosecapture',   responder);
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
      element.detachEvent('onlosecapture',   responder);
    }
  }



  function stopObservingElement(element) {
    var uid = getUniqueElementID(element), registry = GLOBAL.Event.cache[uid];
    if (!registry) return;

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
    initialize: function(element, eventName, selector, callback) {
      this.element   = $(element);
      this.eventName = eventName;
      this.selector  = selector;
      this.callback  = callback;
      this.handler   = this.handleEvent.bind(this);
    },


    start: function() {
      Event.observe(this.element, this.eventName, this.handler);
      return this;
    },

    stop: function() {
      Event.stopObserving(this.element, this.eventName, this.handler);
      return this;
    },

    handleEvent: function(event) {
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
    fire:          fire,
    observe:       observe,
    stopObserving: stopObserving,
    on:            on
  });

  Element.addMethods({
    fire:          fire,

    observe:       observe,

    stopObserving: stopObserving,

    on:            on
  });

  Object.extend(document, {
    fire:          fire.methodize(),

    observe:       observe.methodize(),

    stopObserving: stopObserving.methodize(),

    on:            on.methodize(),

    loaded:        false
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

(function(GLOBAL) {
  /* Code for creating leak-free event responders is based on work by
   John-David Dalton. */

  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
    && 'onmouseleave' in docEl;

  function isSimulatedMouseEnterLeaveEvent(eventName) {
    return !MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
     (eventName === 'mouseenter' || eventName === 'mouseleave');
  }

  function createResponder(uid, eventName, handler) {
    if (Event._isCustomEvent(eventName))
      return createResponderForCustomEvent(uid, eventName, handler);
    if (isSimulatedMouseEnterLeaveEvent(eventName))
      return createMouseEnterLeaveResponder(uid, eventName, handler);

    return function(event) {
      if (!Event.cache) return;

      var element = Event.cache[uid].element;
      Event.extend(event, element);
      handler.call(element, event);
    };
  }

  function createResponderForCustomEvent(uid, eventName, handler) {
    return function(event) {
      var element = Event.cache[uid].element;

      if (Object.isUndefined(event.eventName))
        return false;

      if (event.eventName !== eventName)
        return false;

      Event.extend(event, element);
      handler.call(element, event);
    };
  }

  function createMouseEnterLeaveResponder(uid, eventName, handler) {
    return function(event) {
      var element = Event.cache[uid].element;

      Event.extend(event, element);
      var parent = event.relatedTarget;

      while (parent && parent !== element) {
        try { parent = parent.parentNode; }
        catch(e) { parent = element; }
      }

      if (parent === element) return;
      handler.call(element, event);
    }
  }

  GLOBAL.Event._createResponder = createResponder;
  docEl = null;
})(this);

(function(GLOBAL) {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */

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


  if (document.readyState === 'complete') {
    fireContentLoadedEvent();
    return;
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
/*------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

var Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

var Insertion = {
  Before: function(element, content) {
    return Element.insert(element, {before:content});
  },

  Top: function(element, content) {
    return Element.insert(element, {top:content});
  },

  Bottom: function(element, content) {
    return Element.insert(element, {bottom:content});
  },

  After: function(element, content) {
    return Element.insert(element, {after:content});
  }
};

var $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Position = {
  includeScrollOffsets: false,

  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },

  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },


  cumulativeOffset: Element.Methods.cumulativeOffset,

  positionedOffset: Element.Methods.positionedOffset,

  absolutize: function(element) {
    Position.prepare();
    return Element.absolutize(element);
  },

  relativize: function(element) {
    Position.prepare();
    return Element.relativize(element);
  },

  realOffset: Element.Methods.cumulativeScrollOffset,

  offsetParent: Element.Methods.getOffsetParent,

  page: Element.Methods.viewportOffset,

  clone: function(source, target, options) {
    options = options || { };
    return Element.clonePosition(target, source, options);
  }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
  function iter(name) {
    return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
  }

  instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
  function(element, className) {
    className = className.toString().strip();
    var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
    return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
  } : function(element, className) {
    className = className.toString().strip();
    var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
    if (!classNames && !className) return elements;

    var nodes = $(element).getElementsByTagName('*');
    className = ' ' + className + ' ';

    for (var i = 0, child, cn; child = nodes[i]; i++) {
      if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
          (classNames && classNames.all(function(name) {
            return !name.toString().blank() && cn.include(' ' + name + ' ');
          }))))
        elements.push(Element.extend(child));
    }
    return elements;
  };

  return function(className, parentElement) {
    return $(parentElement || document.body).getElementsByClassName(className);
  };
}(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator, context) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator, context);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString: function() {
    return $A(this).join(' ');
  }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/

(function() {
  window.Selector = Class.create({
    initialize: function(expression) {
      this.expression = expression.strip();
    },

    findElements: function(rootElement) {
      return Prototype.Selector.select(this.expression, rootElement);
    },

    match: function(element) {
      return Prototype.Selector.match(element, this.expression);
    },

    toString: function() {
      return this.expression;
    },

    inspect: function() {
      return "#<Selector: " + this.expression + ">";
    }
  });

  Object.extend(Selector, {
    matchElements: function(elements, expression) {
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

    findElement: function(elements, expression, index) {
      index = index || 0;
      var matchIndex = 0, element;
      for (var i = 0, length = elements.length; i < length; i++) {
        element = elements[i];
        if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
          return Element.extend(element);
        }
      }
    },

    findChildElements: function(element, expressions) {
      var selector = expressions.toArray().join(', ');
      return Prototype.Selector.select(selector, element || document);
    }
  });
})();
var b2Settings = Class.create();
b2Settings.prototype = {initialize: function() {
    }};
b2Settings.USHRT_MAX = 65535;
b2Settings.b2_pi = Math.PI;
b2Settings.b2_massUnitsPerKilogram = 1;
b2Settings.b2_timeUnitsPerSecond = 1;
b2Settings.b2_lengthUnitsPerMeter = 30;
b2Settings.b2_maxManifoldPoints = 2;
b2Settings.b2_maxShapesPerBody = 64;
b2Settings.b2_maxPolyVertices = 8;
b2Settings.b2_maxProxies = 1024;
b2Settings.b2_maxPairs = 8 * b2Settings.b2_maxProxies;
b2Settings.b2_linearSlop = 0.005 * b2Settings.b2_lengthUnitsPerMeter;
b2Settings.b2_angularSlop = 2 / 180 * b2Settings.b2_pi;
b2Settings.b2_velocityThreshold = 1 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_maxLinearCorrection = 0.2 * b2Settings.b2_lengthUnitsPerMeter;
b2Settings.b2_maxAngularCorrection = 8 / 180 * b2Settings.b2_pi;
b2Settings.b2_contactBaumgarte = 0.2;
b2Settings.b2_timeToSleep = 0.5 * b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_linearSleepTolerance = 0.01 * b2Settings.b2_lengthUnitsPerMeter / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2_angularSleepTolerance = 2 / 180 / b2Settings.b2_timeUnitsPerSecond;
b2Settings.b2Assert = function(a) {
    a || (void 0).x++
};
var b2Vec2 = Class.create();
b2Vec2.prototype = {initialize: function(a, c) {
        this.x = a;
        this.y = c
    },SetZero: function() {
        this.y = this.x = 0
    },Set: function(a, c) {
        this.x = a;
        this.y = c
    },SetV: function(a) {
        this.x = a.x;
        this.y = a.y
    },Negative: function() {
        return new b2Vec2(-this.x, -this.y)
    },Copy: function() {
        return new b2Vec2(this.x, this.y)
    },Add: function(a) {
        this.x += a.x;
        this.y += a.y
    },Subtract: function(a) {
        this.x -= a.x;
        this.y -= a.y
    },Multiply: function(a) {
        this.x *= a;
        this.y *= a
    },MulM: function(a) {
        var c = this.x;
        this.x = a.col1.x * c + a.col2.x * this.y;
        this.y = a.col1.y * c + a.col2.y * 
        this.y
    },MulTM: function(a) {
        var c = b2Math.b2Dot(this, a.col1);
        this.y = b2Math.b2Dot(this, a.col2);
        this.x = c
    },CrossVF: function(a) {
        var c = this.x;
        this.x = a * this.y;
        this.y = -a * c
    },CrossFV: function(a) {
        var c = this.x;
        this.x = -a * this.y;
        this.y = a * c
    },MinV: function(a) {
        this.x = this.x < a.x ? this.x : a.x;
        this.y = this.y < a.y ? this.y : a.y
    },MaxV: function(a) {
        this.x = this.x > a.x ? this.x : a.x;
        this.y = this.y > a.y ? this.y : a.y
    },Abs: function() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y)
    },Length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    Normalize: function() {
        var a = this.Length();
        if (a < Number.MIN_VALUE)
            return 0;
        var c = 1 / a;
        this.x *= c;
        this.y *= c;
        return a
    },IsValid: function() {
        return b2Math.b2IsValid(this.x) && b2Math.b2IsValid(this.y)
    },x: null,y: null};
b2Vec2.Make = function(a, c) {
    return new b2Vec2(a, c)
};
var b2Mat22 = Class.create();
b2Mat22.prototype = {initialize: function(a, c, e) {
        null == a && (a = 0);
        this.col1 = new b2Vec2;
        this.col2 = new b2Vec2;
        null != c && null != e ? (this.col1.SetV(c), this.col2.SetV(e)) : (c = Math.cos(a), a = Math.sin(a), this.col1.x = c, this.col2.x = -a, this.col1.y = a, this.col2.y = c)
    },Set: function(a) {
        var c = Math.cos(a);
        a = Math.sin(a);
        this.col1.x = c;
        this.col2.x = -a;
        this.col1.y = a;
        this.col2.y = c
    },SetVV: function(a, c) {
        this.col1.SetV(a);
        this.col2.SetV(c)
    },Copy: function() {
        return new b2Mat22(0, this.col1, this.col2)
    },SetM: function(a) {
        this.col1.SetV(a.col1);
        this.col2.SetV(a.col2)
    },AddM: function(a) {
        this.col1.x += a.col1.x;
        this.col1.y += a.col1.y;
        this.col2.x += a.col2.x;
        this.col2.y += a.col2.y
    },SetIdentity: function() {
        this.col1.x = 1;
        this.col2.x = 0;
        this.col1.y = 0;
        this.col2.y = 1
    },SetZero: function() {
        this.col1.x = 0;
        this.col2.x = 0;
        this.col1.y = 0;
        this.col2.y = 0
    },Invert: function(a) {
        var c = this.col1.x, e = this.col2.x, f = this.col1.y, g = this.col2.y, h;
        h = 1 / (c * g - e * f);
        a.col1.x = h * g;
        a.col2.x = -h * e;
        a.col1.y = -h * f;
        a.col2.y = h * c;
        return a
    },Solve: function(a, c, e) {
        var f = this.col1.x, g = this.col2.x, h = 
        this.col1.y, k = this.col2.y, l;
        l = 1 / (f * k - g * h);
        a.x = l * (k * c - g * e);
        a.y = l * (f * e - h * c);
        return a
    },Abs: function() {
        this.col1.Abs();
        this.col2.Abs()
    },col1: new b2Vec2,col2: new b2Vec2};
var b2Math = Class.create();
b2Math.prototype = {initialize: function() {
    }};
b2Math.b2IsValid = function(a) {
    return isFinite(a)
};
b2Math.b2Dot = function(a, c) {
    return a.x * c.x + a.y * c.y
};
b2Math.b2CrossVV = function(a, c) {
    return a.x * c.y - a.y * c.x
};
b2Math.b2CrossVF = function(a, c) {
    return new b2Vec2(c * a.y, -c * a.x)
};
b2Math.b2CrossFV = function(a, c) {
    return new b2Vec2(-a * c.y, a * c.x)
};
b2Math.b2MulMV = function(a, c) {
    return new b2Vec2(a.col1.x * c.x + a.col2.x * c.y, a.col1.y * c.x + a.col2.y * c.y)
};
b2Math.b2MulTMV = function(a, c) {
    return new b2Vec2(b2Math.b2Dot(c, a.col1), b2Math.b2Dot(c, a.col2))
};
b2Math.AddVV = function(a, c) {
    return new b2Vec2(a.x + c.x, a.y + c.y)
};
b2Math.SubtractVV = function(a, c) {
    return new b2Vec2(a.x - c.x, a.y - c.y)
};
b2Math.MulFV = function(a, c) {
    return new b2Vec2(a * c.x, a * c.y)
};
b2Math.AddMM = function(a, c) {
    return new b2Mat22(0, b2Math.AddVV(a.col1, c.col1), b2Math.AddVV(a.col2, c.col2))
};
b2Math.b2MulMM = function(a, c) {
    return new b2Mat22(0, b2Math.b2MulMV(a, c.col1), b2Math.b2MulMV(a, c.col2))
};
b2Math.b2MulTMM = function(a, c) {
    var e = new b2Vec2(b2Math.b2Dot(a.col1, c.col1), b2Math.b2Dot(a.col2, c.col1)), f = new b2Vec2(b2Math.b2Dot(a.col1, c.col2), b2Math.b2Dot(a.col2, c.col2));
    return new b2Mat22(0, e, f)
};
b2Math.b2Abs = function(a) {
    return 0 < a ? a : -a
};
b2Math.b2AbsV = function(a) {
    return new b2Vec2(b2Math.b2Abs(a.x), b2Math.b2Abs(a.y))
};
b2Math.b2AbsM = function(a) {
    return new b2Mat22(0, b2Math.b2AbsV(a.col1), b2Math.b2AbsV(a.col2))
};
b2Math.b2Min = function(a, c) {
    return a < c ? a : c
};
b2Math.b2MinV = function(a, c) {
    return new b2Vec2(b2Math.b2Min(a.x, c.x), b2Math.b2Min(a.y, c.y))
};
b2Math.b2Max = function(a, c) {
    return a > c ? a : c
};
b2Math.b2MaxV = function(a, c) {
    return new b2Vec2(b2Math.b2Max(a.x, c.x), b2Math.b2Max(a.y, c.y))
};
b2Math.b2Clamp = function(a, c, e) {
    return b2Math.b2Max(c, b2Math.b2Min(a, e))
};
b2Math.b2ClampV = function(a, c, e) {
    return b2Math.b2MaxV(c, b2Math.b2MinV(a, e))
};
b2Math.b2Swap = function(a, c) {
    var e = a[0];
    a[0] = c[0];
    c[0] = e
};
b2Math.b2Random = function() {
    return 2 * Math.random() - 1
};
b2Math.b2NextPowerOfTwo = function(a) {
    a |= a >> 1 & 2147483647;
    a |= a >> 2 & 1073741823;
    a |= a >> 4 & 268435455;
    a |= a >> 8 & 16777215;
    return (a | a >> 16 & 65535) + 1
};
b2Math.b2IsPowerOfTwo = function(a) {
    return 0 < a && 0 == (a & a - 1)
};
b2Math.tempVec2 = new b2Vec2;
b2Math.tempVec3 = new b2Vec2;
b2Math.tempVec4 = new b2Vec2;
b2Math.tempVec5 = new b2Vec2;
b2Math.tempMat = new b2Mat22;
var b2AABB = Class.create();
b2AABB.prototype = {IsValid: function() {
        var a = this.maxVertex.x, c = this.maxVertex.y, a = this.maxVertex.x, c = this.maxVertex.y, a = a - this.minVertex.x, c = c - this.minVertex.y;
        return a = 0 <= a && 0 <= c && this.minVertex.IsValid() && this.maxVertex.IsValid()
    },minVertex: new b2Vec2,maxVertex: new b2Vec2,initialize: function() {
        this.minVertex = new b2Vec2;
        this.maxVertex = new b2Vec2
    }};
var b2Bound = Class.create();
b2Bound.prototype = {IsLower: function() {
        return 0 == (this.value & 1)
    },IsUpper: function() {
        return 1 == (this.value & 1)
    },Swap: function(a) {
        var c = this.value, e = this.proxyId, f = this.stabbingCount;
        this.value = a.value;
        this.proxyId = a.proxyId;
        this.stabbingCount = a.stabbingCount;
        a.value = c;
        a.proxyId = e;
        a.stabbingCount = f
    },value: 0,proxyId: 0,stabbingCount: 0,initialize: function() {
    }};
var b2BoundValues = Class.create();
b2BoundValues.prototype = {lowerValues: [0, 0],upperValues: [0, 0],initialize: function() {
        this.lowerValues = [0, 0];
        this.upperValues = [0, 0]
    }};
var b2Pair = Class.create();
b2Pair.prototype = {SetBuffered: function() {
        this.status |= b2Pair.e_pairBuffered
    },ClearBuffered: function() {
        this.status &= ~b2Pair.e_pairBuffered
    },IsBuffered: function() {
        return (this.status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered
    },SetRemoved: function() {
        this.status |= b2Pair.e_pairRemoved
    },ClearRemoved: function() {
        this.status &= ~b2Pair.e_pairRemoved
    },IsRemoved: function() {
        return (this.status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved
    },SetFinal: function() {
        this.status |= b2Pair.e_pairFinal
    },IsFinal: function() {
        return (this.status & 
        b2Pair.e_pairFinal) == b2Pair.e_pairFinal
    },userData: null,proxyId1: 0,proxyId2: 0,next: 0,status: 0,initialize: function() {
    }};
b2Pair.b2_nullPair = b2Settings.USHRT_MAX;
b2Pair.b2_nullProxy = b2Settings.USHRT_MAX;
b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs;
b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1;
b2Pair.e_pairBuffered = 1;
b2Pair.e_pairRemoved = 2;
b2Pair.e_pairFinal = 4;
var b2PairCallback = Class.create();
b2PairCallback.prototype = {PairAdded: function(a, c) {
        return null
    },PairRemoved: function(a, c, e) {
    },initialize: function() {
    }};
var b2BufferedPair = Class.create();
b2BufferedPair.prototype = {proxyId1: 0,proxyId2: 0,initialize: function() {
    }};
var b2PairManager = Class.create();
b2PairManager.prototype = {initialize: function() {
        var a = 0;
        this.m_hashTable = Array(b2Pair.b2_tableCapacity);
        for (a = 0; a < b2Pair.b2_tableCapacity; ++a)
            this.m_hashTable[a] = b2Pair.b2_nullPair;
        this.m_pairs = Array(b2Settings.b2_maxPairs);
        for (a = 0; a < b2Settings.b2_maxPairs; ++a)
            this.m_pairs[a] = new b2Pair;
        this.m_pairBuffer = Array(b2Settings.b2_maxPairs);
        for (a = 0; a < b2Settings.b2_maxPairs; ++a)
            this.m_pairBuffer[a] = new b2BufferedPair;
        for (a = 0; a < b2Settings.b2_maxPairs; ++a)
            this.m_pairs[a].proxyId1 = b2Pair.b2_nullProxy, this.m_pairs[a].proxyId2 = 
            b2Pair.b2_nullProxy, this.m_pairs[a].userData = null, this.m_pairs[a].status = 0, this.m_pairs[a].next = a + 1;
        this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair;
        this.m_pairCount = 0
    },Initialize: function(a, c) {
        this.m_broadPhase = a;
        this.m_callback = c
    },AddBufferedPair: function(a, c) {
        var e = this.AddPair(a, c);
        !1 == e.IsBuffered() && (e.SetBuffered(), this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = e.proxyId1, this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = e.proxyId2, ++this.m_pairBufferCount);
        e.ClearRemoved();
        b2BroadPhase.s_validate && this.ValidateBuffer()
    },RemoveBufferedPair: function(a, c) {
        var e = this.Find(a, c);
        null != e && (!1 == e.IsBuffered() && (e.SetBuffered(), this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = e.proxyId1, this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = e.proxyId2, ++this.m_pairBufferCount), e.SetRemoved(), b2BroadPhase.s_validate && this.ValidateBuffer())
    },Commit: function() {
        for (var a = 0, c = 0, e = this.m_broadPhase.m_proxyPool, a = 0; a < this.m_pairBufferCount; ++a) {
            var f = this.Find(this.m_pairBuffer[a].proxyId1, 
            this.m_pairBuffer[a].proxyId2);
            f.ClearBuffered();
            var g = e[f.proxyId1], h = e[f.proxyId2];
            f.IsRemoved() ? (!0 == f.IsFinal() && this.m_callback.PairRemoved(g.userData, h.userData, f.userData), this.m_pairBuffer[c].proxyId1 = f.proxyId1, this.m_pairBuffer[c].proxyId2 = f.proxyId2, ++c) : !1 == f.IsFinal() && (f.userData = this.m_callback.PairAdded(g.userData, h.userData), f.SetFinal())
        }
        for (a = 0; a < c; ++a)
            this.RemovePair(this.m_pairBuffer[a].proxyId1, this.m_pairBuffer[a].proxyId2);
        this.m_pairBufferCount = 0;
        b2BroadPhase.s_validate && 
        this.ValidateTable()
    },AddPair: function(a, c) {
        if (a > c) {
            var e = a;
            a = c;
            c = e
        }
        var e = b2PairManager.Hash(a, c) & b2Pair.b2_tableMask, f = f = this.FindHash(a, c, e);
        if (null != f)
            return f;
        var g = this.m_freePair, f = this.m_pairs[g];
        this.m_freePair = f.next;
        f.proxyId1 = a;
        f.proxyId2 = c;
        f.status = 0;
        f.userData = null;
        f.next = this.m_hashTable[e];
        this.m_hashTable[e] = g;
        ++this.m_pairCount;
        return f
    },RemovePair: function(a, c) {
        if (a > c) {
            var e = a;
            a = c;
            c = e
        }
        for (var f = b2PairManager.Hash(a, c) & b2Pair.b2_tableMask, g = this.m_hashTable[f], h = null; g != b2Pair.b2_nullPair; ) {
            if (b2PairManager.Equals(this.m_pairs[g], 
            a, c))
                return e = g, h ? h.next = this.m_pairs[g].next : this.m_hashTable[f] = this.m_pairs[g].next, f = this.m_pairs[e], g = f.userData, f.next = this.m_freePair, f.proxyId1 = b2Pair.b2_nullProxy, f.proxyId2 = b2Pair.b2_nullProxy, f.userData = null, f.status = 0, this.m_freePair = e, --this.m_pairCount, g;
            h = this.m_pairs[g];
            g = h.next
        }
        return null
    },Find: function(a, c) {
        if (a > c) {
            var e = a;
            a = c;
            c = e
        }
        e = b2PairManager.Hash(a, c) & b2Pair.b2_tableMask;
        return this.FindHash(a, c, e)
    },FindHash: function(a, c, e) {
        for (e = this.m_hashTable[e]; e != b2Pair.b2_nullPair && 
        !1 == b2PairManager.Equals(this.m_pairs[e], a, c); )
            e = this.m_pairs[e].next;
        return e == b2Pair.b2_nullPair ? null : this.m_pairs[e]
    },ValidateBuffer: function() {
    },ValidateTable: function() {
    },m_broadPhase: null,m_callback: null,m_pairs: null,m_freePair: 0,m_pairCount: 0,m_pairBuffer: null,m_pairBufferCount: 0,m_hashTable: null};
b2PairManager.Hash = function(a, c) {
    var e = c << 16 & 4294901760 | a, e = ~e + (e << 15 & 4294934528), e = e ^ e >> 12 & 1048575, e = e + (e << 2 & 4294967292), e = 2057 * (e ^ e >> 4 & 268435455);
    return e ^= e >> 16 & 65535
};
b2PairManager.Equals = function(a, c, e) {
    return a.proxyId1 == c && a.proxyId2 == e
};
b2PairManager.EqualsPair = function(a, c) {
    return a.proxyId1 == c.proxyId1 && a.proxyId2 == c.proxyId2
};
var b2BroadPhase = Class.create();
b2BroadPhase.prototype = {initialize: function(a, c) {
        this.m_pairManager = new b2PairManager;
        this.m_proxyPool = Array(b2Settings.b2_maxPairs);
        this.m_bounds = Array(2 * b2Settings.b2_maxProxies);
        this.m_queryResults = Array(b2Settings.b2_maxProxies);
        this.m_quantizationFactor = new b2Vec2;
        var e = 0;
        this.m_pairManager.Initialize(this, c);
        this.m_worldAABB = a;
        for (e = this.m_proxyCount = 0; e < b2Settings.b2_maxProxies; e++)
            this.m_queryResults[e] = 0;
        this.m_bounds = Array(2);
        for (e = 0; 2 > e; e++) {
            this.m_bounds[e] = Array(2 * b2Settings.b2_maxProxies);
            for (var f = 0; f < 2 * b2Settings.b2_maxProxies; f++)
                this.m_bounds[e][f] = new b2Bound
        }
        e = a.maxVertex.x;
        f = a.maxVertex.y;
        e -= a.minVertex.x;
        f -= a.minVertex.y;
        this.m_quantizationFactor.x = b2Settings.USHRT_MAX / e;
        this.m_quantizationFactor.y = b2Settings.USHRT_MAX / f;
        for (e = 0; e < b2Settings.b2_maxProxies - 1; ++e)
            f = new b2Proxy, this.m_proxyPool[e] = f, f.SetNext(e + 1), f.timeStamp = 0, f.overlapCount = b2BroadPhase.b2_invalid, f.userData = null;
        f = new b2Proxy;
        this.m_proxyPool[b2Settings.b2_maxProxies - 1] = f;
        f.SetNext(b2Pair.b2_nullProxy);
        f.timeStamp = 
        0;
        f.overlapCount = b2BroadPhase.b2_invalid;
        f.userData = null;
        this.m_freeProxy = 0;
        this.m_timeStamp = 1;
        this.m_queryResultCount = 0
    },InRange: function(a) {
        var c, e, f, g;
        c = a.minVertex.x;
        e = a.minVertex.y;
        c -= this.m_worldAABB.maxVertex.x;
        e -= this.m_worldAABB.maxVertex.y;
        f = this.m_worldAABB.minVertex.x;
        g = this.m_worldAABB.minVertex.y;
        f -= a.maxVertex.x;
        g -= a.maxVertex.y;
        c = b2Math.b2Max(c, f);
        e = b2Math.b2Max(e, g);
        return 0 > b2Math.b2Max(c, e)
    },GetProxy: function(a) {
        return a == b2Pair.b2_nullProxy || !1 == this.m_proxyPool[a].IsValid() ? null : 
        this.m_proxyPool[a]
    },CreateProxy: function(a, c) {
        var e = 0, f, g = this.m_freeProxy;
        f = this.m_proxyPool[g];
        this.m_freeProxy = f.GetNext();
        f.overlapCount = 0;
        f.userData = c;
        f = 2 * this.m_proxyCount;
        var h = [], k = [];
        this.ComputeBounds(h, k, a);
        for (var l = 0; 2 > l; ++l) {
            var m = this.m_bounds[l], n = 0, p = 0, n = [n], p = [p];
            this.Query(n, p, h[l], k[l], m, f, l);
            for (var n = n[0], p = p[0], e = [], q = 0, r = f - p, s, t, q = 0; q < r; q++)
                e[q] = new b2Bound, s = e[q], t = m[p + q], s.value = t.value, s.proxyId = t.proxyId, s.stabbingCount = t.stabbingCount;
            for (var r = e.length, u = p + 2, q = 0; q < r; q++)
                t = 
                e[q], s = m[u + q], s.value = t.value, s.proxyId = t.proxyId, s.stabbingCount = t.stabbingCount;
            e = [];
            r = p - n;
            for (q = 0; q < r; q++)
                e[q] = new b2Bound, s = e[q], t = m[n + q], s.value = t.value, s.proxyId = t.proxyId, s.stabbingCount = t.stabbingCount;
            r = e.length;
            u = n + 1;
            for (q = 0; q < r; q++)
                t = e[q], s = m[u + q], s.value = t.value, s.proxyId = t.proxyId, s.stabbingCount = t.stabbingCount;
            ++p;
            m[n].value = h[l];
            m[n].proxyId = g;
            m[p].value = k[l];
            m[p].proxyId = g;
            m[n].stabbingCount = 0 == n ? 0 : m[n - 1].stabbingCount;
            m[p].stabbingCount = m[p - 1].stabbingCount;
            for (e = n; e < p; ++e)
                m[e].stabbingCount++;
            for (e = n; e < f + 2; ++e)
                n = this.m_proxyPool[m[e].proxyId], m[e].IsLower() ? n.lowerBounds[l] = e : n.upperBounds[l] = e
        }
        ++this.m_proxyCount;
        for (f = 0; f < this.m_queryResultCount; ++f)
            this.m_pairManager.AddBufferedPair(g, this.m_queryResults[f]);
        this.m_pairManager.Commit();
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        return g
    },DestroyProxy: function(a) {
        for (var c = this.m_proxyPool[a], e = 2 * this.m_proxyCount, f = 0; 2 > f; ++f) {
            for (var g = this.m_bounds[f], h = c.lowerBounds[f], k = c.upperBounds[f], l = g[h].value, m = g[k].value, n = [], p = 
            0, q = k - h - 1, r, s, p = 0; p < q; p++)
                n[p] = new b2Bound, r = n[p], s = g[h + 1 + p], r.value = s.value, r.proxyId = s.proxyId, r.stabbingCount = s.stabbingCount;
            for (var q = n.length, t = h, p = 0; p < q; p++)
                s = n[p], r = g[t + p], r.value = s.value, r.proxyId = s.proxyId, r.stabbingCount = s.stabbingCount;
            n = [];
            q = e - k - 1;
            for (p = 0; p < q; p++)
                n[p] = new b2Bound, r = n[p], s = g[k + 1 + p], r.value = s.value, r.proxyId = s.proxyId, r.stabbingCount = s.stabbingCount;
            q = n.length;
            t = k - 1;
            for (p = 0; p < q; p++)
                s = n[p], r = g[t + p], r.value = s.value, r.proxyId = s.proxyId, r.stabbingCount = s.stabbingCount;
            q = e - 
            2;
            for (n = h; n < q; ++n)
                p = this.m_proxyPool[g[n].proxyId], g[n].IsLower() ? p.lowerBounds[f] = n : p.upperBounds[f] = n;
            for (q = k - 1; h < q; ++h)
                g[h].stabbingCount--;
            this.Query([0], [0], l, m, g, e - 2, f)
        }
        for (e = 0; e < this.m_queryResultCount; ++e)
            this.m_pairManager.RemoveBufferedPair(a, this.m_queryResults[e]);
        this.m_pairManager.Commit();
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        c.userData = null;
        c.overlapCount = b2BroadPhase.b2_invalid;
        c.lowerBounds[0] = b2BroadPhase.b2_invalid;
        c.lowerBounds[1] = b2BroadPhase.b2_invalid;
        c.upperBounds[0] = 
        b2BroadPhase.b2_invalid;
        c.upperBounds[1] = b2BroadPhase.b2_invalid;
        c.SetNext(this.m_freeProxy);
        this.m_freeProxy = a;
        --this.m_proxyCount
    },MoveProxy: function(a, c) {
        var e = 0, f = 0, g, h, k = 0, l;
        if (!(a == b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= a) && !1 != c.IsValid()) {
            var m = 2 * this.m_proxyCount, n = this.m_proxyPool[a], p = new b2BoundValues;
            this.ComputeBounds(p.lowerValues, p.upperValues, c);
            for (var q = new b2BoundValues, e = 0; 2 > e; ++e)
                q.lowerValues[e] = this.m_bounds[e][n.lowerBounds[e]].value, q.upperValues[e] = this.m_bounds[e][n.upperBounds[e]].value;
            for (e = 0; 2 > e; ++e) {
                var r = this.m_bounds[e], s = n.lowerBounds[e], t = n.upperBounds[e], u = p.lowerValues[e], x = p.upperValues[e], v = u - r[s].value, y = x - r[t].value;
                r[s].value = u;
                r[t].value = x;
                if (0 > v)
                    for (f = s; 0 < f && u < r[f - 1].value; )
                        g = r[f], h = r[f - 1], k = h.proxyId, l = this.m_proxyPool[h.proxyId], h.stabbingCount++, !0 == h.IsUpper() ? (this.TestOverlap(p, l) && this.m_pairManager.AddBufferedPair(a, k), l.upperBounds[e]++, g.stabbingCount++) : (l.lowerBounds[e]++, g.stabbingCount--), n.lowerBounds[e]--, g.Swap(h), --f;
                if (0 < y)
                    for (f = t; f < m - 1 && r[f + 1].value <= 
                    x; )
                        g = r[f], h = r[f + 1], k = h.proxyId, l = this.m_proxyPool[k], h.stabbingCount++, !0 == h.IsLower() ? (this.TestOverlap(p, l) && this.m_pairManager.AddBufferedPair(a, k), l.lowerBounds[e]--, g.stabbingCount++) : (l.upperBounds[e]--, g.stabbingCount--), n.upperBounds[e]++, g.Swap(h), f++;
                if (0 < v)
                    for (f = s; f < m - 1 && r[f + 1].value <= u; )
                        g = r[f], h = r[f + 1], k = h.proxyId, l = this.m_proxyPool[k], h.stabbingCount--, h.IsUpper() ? (this.TestOverlap(q, l) && this.m_pairManager.RemoveBufferedPair(a, k), l.upperBounds[e]--, g.stabbingCount--) : (l.lowerBounds[e]--, 
                        g.stabbingCount++), n.lowerBounds[e]++, g.Swap(h), f++;
                if (0 > y)
                    for (f = t; 0 < f && x < r[f - 1].value; )
                        g = r[f], h = r[f - 1], k = h.proxyId, l = this.m_proxyPool[k], h.stabbingCount--, !0 == h.IsLower() ? (this.TestOverlap(q, l) && this.m_pairManager.RemoveBufferedPair(a, k), l.lowerBounds[e]++, g.stabbingCount--) : (l.upperBounds[e]++, g.stabbingCount++), n.upperBounds[e]--, g.Swap(h), f--
            }
        }
    },Commit: function() {
        this.m_pairManager.Commit()
    },QueryAABB: function(a, c, e) {
        var f = [], g = [];
        this.ComputeBounds(f, g, a);
        a = [0];
        var h = [0];
        this.Query(a, h, f[0], 
        g[0], this.m_bounds[0], 2 * this.m_proxyCount, 0);
        this.Query(a, h, f[1], g[1], this.m_bounds[1], 2 * this.m_proxyCount, 1);
        for (g = f = 0; g < this.m_queryResultCount && f < e; ++g, ++f)
            c[g] = this.m_proxyPool[this.m_queryResults[g]].userData;
        this.m_queryResultCount = 0;
        this.IncrementTimeStamp();
        return f
    },Validate: function() {
        for (var a = 0; 2 > a; ++a)
            for (var c = this.m_bounds[a], e = 2 * this.m_proxyCount, f = 0, g = 0; g < e; ++g)
                !0 == c[g].IsLower() ? f++ : f--
    },ComputeBounds: function(a, c, e) {
        var f = e.minVertex.x, g = e.minVertex.y, f = b2Math.b2Min(f, this.m_worldAABB.maxVertex.x), 
        g = b2Math.b2Min(g, this.m_worldAABB.maxVertex.y), f = b2Math.b2Max(f, this.m_worldAABB.minVertex.x), g = b2Math.b2Max(g, this.m_worldAABB.minVertex.y), h = e.maxVertex.x;
        e = e.maxVertex.y;
        h = b2Math.b2Min(h, this.m_worldAABB.maxVertex.x);
        e = b2Math.b2Min(e, this.m_worldAABB.maxVertex.y);
        h = b2Math.b2Max(h, this.m_worldAABB.minVertex.x);
        e = b2Math.b2Max(e, this.m_worldAABB.minVertex.y);
        a[0] = this.m_quantizationFactor.x * (f - this.m_worldAABB.minVertex.x) & b2Settings.USHRT_MAX - 1;
        c[0] = this.m_quantizationFactor.x * (h - this.m_worldAABB.minVertex.x) & 
        65535 | 1;
        a[1] = this.m_quantizationFactor.y * (g - this.m_worldAABB.minVertex.y) & b2Settings.USHRT_MAX - 1;
        c[1] = this.m_quantizationFactor.y * (e - this.m_worldAABB.minVertex.y) & 65535 | 1
    },TestOverlapValidate: function(a, c) {
        for (var e = 0; 2 > e; ++e) {
            var f = this.m_bounds[e];
            if (f[a.lowerBounds[e]].value > f[c.upperBounds[e]].value || f[a.upperBounds[e]].value < f[c.lowerBounds[e]].value)
                return !1
        }
        return !0
    },TestOverlap: function(a, c) {
        for (var e = 0; 2 > e; ++e) {
            var f = this.m_bounds[e];
            if (a.lowerValues[e] > f[c.upperBounds[e]].value || a.upperValues[e] < 
            f[c.lowerBounds[e]].value)
                return !1
        }
        return !0
    },Query: function(a, c, e, f, g, h, k) {
        e = b2BroadPhase.BinarySearch(g, h, e);
        f = b2BroadPhase.BinarySearch(g, h, f);
        for (h = e; h < f; ++h)
            g[h].IsLower() && this.IncrementOverlapCount(g[h].proxyId);
        if (0 < e) {
            h = e - 1;
            for (var l = g[h].stabbingCount; l; )
                g[h].IsLower() && e <= this.m_proxyPool[g[h].proxyId].upperBounds[k] && (this.IncrementOverlapCount(g[h].proxyId), --l), --h
        }
        a[0] = e;
        c[0] = f
    },IncrementOverlapCount: function(a) {
        var c = this.m_proxyPool[a];
        c.timeStamp < this.m_timeStamp ? (c.timeStamp = this.m_timeStamp, 
        c.overlapCount = 1) : (c.overlapCount = 2, this.m_queryResults[this.m_queryResultCount] = a, ++this.m_queryResultCount)
    },IncrementTimeStamp: function() {
        if (this.m_timeStamp == b2Settings.USHRT_MAX) {
            for (var a = 0; a < b2Settings.b2_maxProxies; ++a)
                this.m_proxyPool[a].timeStamp = 0;
            this.m_timeStamp = 1
        } else
            ++this.m_timeStamp
    },m_pairManager: new b2PairManager,m_proxyPool: Array(b2Settings.b2_maxPairs),m_freeProxy: 0,m_bounds: Array(2 * b2Settings.b2_maxProxies),m_queryResults: Array(b2Settings.b2_maxProxies),m_queryResultCount: 0,
    m_worldAABB: null,m_quantizationFactor: new b2Vec2,m_proxyCount: 0,m_timeStamp: 0};
b2BroadPhase.s_validate = !1;
b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX;
b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX;
b2BroadPhase.BinarySearch = function(a, c, e) {
    var f = 0;
    for (c -= 1; f <= c; ) {
        var g = Math.floor((f + c) / 2);
        if (a[g].value > e)
            c = g - 1;
        else if (a[g].value < e)
            f = g + 1;
        else
            return g
    }
    return f
};
var b2Collision = Class.create();
b2Collision.prototype = {initialize: function() {
    }};
b2Collision.b2_nullFeature = 255;
b2Collision.ClipSegmentToLine = function(a, c, e, f) {
    var g = 0, h = c[0].v, k = c[1].v, l = b2Math.b2Dot(e, c[0].v) - f;
    e = b2Math.b2Dot(e, c[1].v) - f;
    0 >= l && (a[g++] = c[0]);
    0 >= e && (a[g++] = c[1]);
    0 > l * e && (e = l / (l - e), f = a[g].v, f.x = h.x + e * (k.x - h.x), f.y = h.y + e * (k.y - h.y), a[g].id = 0 < l ? c[0].id : c[1].id, ++g);
    return g
};
b2Collision.EdgeSeparation = function(a, c, e) {
    for (var f = a.m_vertices, g = e.m_vertexCount, h = e.m_vertices, k = a.m_normals[c].x, l = a.m_normals[c].y, m = k, n = a.m_R, k = n.col1.x * m + n.col2.x * l, l = n.col1.y * m + n.col2.y * l, p = k, q = l, n = e.m_R, m = p * n.col1.x + q * n.col1.y, q = p * n.col2.x + q * n.col2.y, p = m, m = 0, n = Number.MAX_VALUE, r = 0; r < g; ++r) {
        var s = h[r], s = s.x * p + s.y * q;
        s < n && (n = s, m = r)
    }
    n = a.m_R;
    g = a.m_position.x + (n.col1.x * f[c].x + n.col2.x * f[c].y);
    a = a.m_position.y + (n.col1.y * f[c].x + n.col2.y * f[c].y);
    n = e.m_R;
    c = e.m_position.x + (n.col1.x * h[m].x + n.col2.x * 
    h[m].y);
    e = e.m_position.y + (n.col1.y * h[m].x + n.col2.y * h[m].y);
    return (c - g) * k + (e - a) * l
};
b2Collision.FindMaxSeparation = function(a, c, e, f) {
    for (var g = c.m_vertexCount, h = e.m_position.x - c.m_position.x, k = e.m_position.y - c.m_position.y, l = h * c.m_R.col1.x + k * c.m_R.col1.y, k = h * c.m_R.col2.x + k * c.m_R.col2.y, h = 0, m = -Number.MAX_VALUE, n = 0; n < g; ++n) {
        var p = c.m_normals[n].x * l + c.m_normals[n].y * k;
        p > m && (m = p, h = n)
    }
    l = b2Collision.EdgeSeparation(c, h, e);
    if (0 < l && !1 == f)
        return l;
    n = 0 <= h - 1 ? h - 1 : g - 1;
    p = b2Collision.EdgeSeparation(c, n, e);
    if (0 < p && !1 == f)
        return p;
    var q = h + 1 < g ? h + 1 : 0, r = b2Collision.EdgeSeparation(c, q, e);
    if (0 < r && !1 == f)
        return r;
    m = k = 0;
    if (p > l && p > r)
        m = -1, k = n, n = p;
    else if (r > l)
        m = 1, k = q, n = r;
    else
        return a[0] = h, l;
    for (; ; ) {
        h = -1 == m ? 0 <= k - 1 ? k - 1 : g - 1 : k + 1 < g ? k + 1 : 0;
        l = b2Collision.EdgeSeparation(c, h, e);
        if (0 < l && !1 == f)
            return l;
        if (l > n)
            k = h, n = l;
        else
            break
    }
    a[0] = k;
    return n
};
b2Collision.FindIncidentEdge = function(a, c, e, f) {
    var g = c.m_vertices, h = f.m_vertexCount, k = f.m_vertices, l = g[e + 1 == c.m_vertexCount ? 0 : e + 1], m = l.x, n = l.y, l = g[e], m = m - l.x, n = n - l.y, l = m, m = n, n = -l, l = 1 / Math.sqrt(m * m + n * n), m = m * l, n = n * l, l = m, g = c.m_R, m = g.col1.x * l + g.col2.x * n, n = g.col1.y * l + g.col2.y * n;
    c = m;
    g = f.m_R;
    l = c * g.col1.x + n * g.col1.y;
    n = c * g.col2.x + n * g.col2.y;
    c = l;
    for (var g = m = 0, p = Number.MAX_VALUE, q = 0; q < h; ++q) {
        var r = q, s = q + 1 < h ? q + 1 : 0, l = k[s], t = l.x, u = l.y, l = k[r], t = t - l.x, u = u - l.y, l = t, t = u, u = -l, l = 1 / Math.sqrt(t * t + u * u), t = t * l, u = u * l, l = t * c + 
        u * n;
        l < p && (p = l, m = r, g = s)
    }
    h = a[0];
    l = h.v;
    l.SetV(k[m]);
    l.MulM(f.m_R);
    l.Add(f.m_position);
    h.id.features.referenceFace = e;
    h.id.features.incidentEdge = m;
    h.id.features.incidentVertex = m;
    h = a[1];
    l = h.v;
    l.SetV(k[g]);
    l.MulM(f.m_R);
    l.Add(f.m_position);
    h.id.features.referenceFace = e;
    h.id.features.incidentEdge = m;
    h.id.features.incidentVertex = g
};
b2Collision.b2CollidePolyTempVec = new b2Vec2;
b2Collision.b2CollidePoly = function(a, c, e, f) {
    a.pointCount = 0;
    var g, h = [0], k = b2Collision.FindMaxSeparation(h, c, e, f);
    g = h[0];
    if (!(0 < k && !1 == f)) {
        var l, h = [0], m = b2Collision.FindMaxSeparation(h, e, c, f);
        l = h[0];
        if (!(0 < m && !1 == f)) {
            var n = 0, h = 0;
            m > 0.98 * k + 0.001 ? (k = e, n = l, h = 1) : (k = c, c = e, n = g, h = 0);
            e = [new ClipVertex, new ClipVertex];
            b2Collision.FindIncidentEdge(e, k, n, c);
            c = k.m_vertices;
            var p = c[n], q = n + 1 < k.m_vertexCount ? c[n + 1] : c[0];
            g = q.x - p.x;
            l = q.y - p.y;
            var r = g, s = k.m_R;
            g = s.col1.x * r + s.col2.x * l;
            l = s.col1.y * r + s.col2.y * l;
            n = 1 / Math.sqrt(g * 
            g + l * l);
            g *= n;
            l *= n;
            r = g;
            n = l;
            c = -r;
            var m = p.x, t = p.y, r = m, s = k.m_R, m = s.col1.x * r + s.col2.x * t, t = s.col1.y * r + s.col2.y * t, m = m + k.m_position.x, t = t + k.m_position.y, p = q.x, q = q.y, r = p, s = k.m_R, p = s.col1.x * r + s.col2.x * q, q = s.col1.y * r + s.col2.y * q, p = p + k.m_position.x, q = q + k.m_position.y, k = n * m + c * t, r = -(g * m + l * t), p = g * p + l * q, q = [new ClipVertex, new ClipVertex], m = [new ClipVertex, new ClipVertex], s = 0;
            b2Collision.b2CollidePolyTempVec.Set(-g, -l);
            s = b2Collision.ClipSegmentToLine(q, e, b2Collision.b2CollidePolyTempVec, r);
            if (!(2 > s || (b2Collision.b2CollidePolyTempVec.Set(g, 
            l), s = b2Collision.ClipSegmentToLine(m, q, b2Collision.b2CollidePolyTempVec, p), 2 > s))) {
                h ? a.normal.Set(-n, -c) : a.normal.Set(n, c);
                for (g = e = 0; g < b2Settings.b2_maxManifoldPoints; ++g)
                    if (l = m[g].v, l = n * l.x + c * l.y - k, 0 >= l || !0 == f)
                        p = a.points[e], p.separation = l, p.position.SetV(m[g].v), p.id.Set(m[g].id), p.id.features.flip = h, ++e;
                a.pointCount = e
            }
        }
    }
};
b2Collision.b2CollideCircle = function(a, c, e, f) {
    a.pointCount = 0;
    var g = e.m_position.x - c.m_position.x, h = e.m_position.y - c.m_position.y, k = g * g + h * h;
    c = c.m_radius + e.m_radius;
    k > c * c && !1 == f || (k < Number.MIN_VALUE ? (f = -c, a.normal.Set(0, 1)) : (k = Math.sqrt(k), f = k - c, k = 1 / k, a.normal.x = k * g, a.normal.y = k * h), a.pointCount = 1, g = a.points[0], g.id.set_key(0), g.separation = f, g.position.x = e.m_position.x - e.m_radius * a.normal.x, g.position.y = e.m_position.y - e.m_radius * a.normal.y)
};
b2Collision.b2CollidePolyAndCircle = function(a, c, e, f) {
    a.pointCount = 0;
    var g, h;
    h = e.m_position.x - c.m_position.x;
    var k = e.m_position.y - c.m_position.y;
    f = c.m_R;
    var l = h * f.col1.x + k * f.col1.y, k = h * f.col2.x + k * f.col2.y;
    h = l;
    var m = 0, n = -Number.MAX_VALUE, l = e.m_radius;
    for (g = 0; g < c.m_vertexCount; ++g) {
        var p = c.m_normals[g].x * (h - c.m_vertices[g].x) + c.m_normals[g].y * (k - c.m_vertices[g].y);
        if (p > l)
            return;
        p > n && (n = p, m = g)
    }
    if (n < Number.MIN_VALUE)
        a.pointCount = 1, c = c.m_normals[m], a.normal.x = f.col1.x * c.x + f.col2.x * c.y, a.normal.y = f.col1.y * 
        c.x + f.col2.y * c.y, g = a.points[0], g.id.features.incidentEdge = m, g.id.features.incidentVertex = b2Collision.b2_nullFeature, g.id.features.referenceFace = b2Collision.b2_nullFeature, g.id.features.flip = 0, g.position.x = e.m_position.x - l * a.normal.x, g.position.y = e.m_position.y - l * a.normal.y, g.separation = n - l;
    else {
        var n = m + 1 < c.m_vertexCount ? m + 1 : 0, q = c.m_vertices[n].x - c.m_vertices[m].x, p = c.m_vertices[n].y - c.m_vertices[m].y, r = Math.sqrt(q * q + p * p), q = q / r, p = p / r;
        if (r < Number.MIN_VALUE)
            h -= c.m_vertices[m].x, c = k - c.m_vertices[m].y, 
            k = Math.sqrt(h * h + c * c), h /= k, c /= k, k > l || (a.pointCount = 1, a.normal.Set(f.col1.x * h + f.col2.x * c, f.col1.y * h + f.col2.y * c), g = a.points[0], g.id.features.incidentEdge = b2Collision.b2_nullFeature, g.id.features.incidentVertex = m, g.id.features.referenceFace = b2Collision.b2_nullFeature, g.id.features.flip = 0, g.position.x = e.m_position.x - l * a.normal.x, g.position.y = e.m_position.y - l * a.normal.y, g.separation = k - l);
        else {
            var s = (h - c.m_vertices[m].x) * q + (k - c.m_vertices[m].y) * p;
            g = a.points[0];
            g.id.features.incidentEdge = b2Collision.b2_nullFeature;
            g.id.features.incidentVertex = b2Collision.b2_nullFeature;
            g.id.features.referenceFace = b2Collision.b2_nullFeature;
            g.id.features.flip = 0;
            0 >= s ? (q = c.m_vertices[m].x, c = c.m_vertices[m].y, g.id.features.incidentVertex = m) : s >= r ? (q = c.m_vertices[n].x, c = c.m_vertices[n].y, g.id.features.incidentVertex = n) : (q = q * s + c.m_vertices[m].x, c = p * s + c.m_vertices[m].y, g.id.features.incidentEdge = m);
            h -= q;
            c = k - c;
            k = Math.sqrt(h * h + c * c);
            h /= k;
            c /= k;
            k > l || (a.pointCount = 1, a.normal.Set(f.col1.x * h + f.col2.x * c, f.col1.y * h + f.col2.y * c), g.position.x = 
            e.m_position.x - l * a.normal.x, g.position.y = e.m_position.y - l * a.normal.y, g.separation = k - l)
        }
    }
};
b2Collision.b2TestOverlap = function(a, c) {
    var e = c.minVertex, f = a.maxVertex, g = e.x - f.x, h = e.y - f.y, e = a.minVertex, f = c.maxVertex, k = e.y - f.y;
    return 0 < g || 0 < h || 0 < e.x - f.x || 0 < k ? !1 : !0
};
var Features = Class.create();
Features.prototype = {set_referenceFace: function(a) {
        this._referenceFace = a;
        this._m_id._key = this._m_id._key & 4294967040 | this._referenceFace & 255
    },get_referenceFace: function() {
        return this._referenceFace
    },_referenceFace: 0,set_incidentEdge: function(a) {
        this._incidentEdge = a;
        this._m_id._key = this._m_id._key & 4294902015 | this._incidentEdge << 8 & 65280
    },get_incidentEdge: function() {
        return this._incidentEdge
    },_incidentEdge: 0,set_incidentVertex: function(a) {
        this._incidentVertex = a;
        this._m_id._key = this._m_id._key & 4278255615 | 
        this._incidentVertex << 16 & 16711680
    },get_incidentVertex: function() {
        return this._incidentVertex
    },_incidentVertex: 0,set_flip: function(a) {
        this._flip = a;
        this._m_id._key = this._m_id._key & 16777215 | this._flip << 24 & 4278190080
    },get_flip: function() {
        return this._flip
    },_flip: 0,_m_id: null,initialize: function() {
    }};
var b2ContactID = Class.create();
b2ContactID.prototype = {initialize: function() {
        this.features = new Features;
        this.features._m_id = this
    },Set: function(a) {
        this.set_key(a._key)
    },Copy: function() {
        var a = new b2ContactID;
        a.set_key(this._key);
        return a
    },get_key: function() {
        return this._key
    },set_key: function(a) {
        this._key = a;
        this.features._referenceFace = this._key & 255;
        this.features._incidentEdge = (this._key & 65280) >> 8 & 255;
        this.features._incidentVertex = (this._key & 16711680) >> 16 & 255;
        this.features._flip = (this._key & 4278190080) >> 24 & 255
    },features: new Features,
    _key: 0};
var b2ContactPoint = Class.create();
b2ContactPoint.prototype = {position: new b2Vec2,separation: null,normalImpulse: null,tangentImpulse: null,id: new b2ContactID,initialize: function() {
        this.position = new b2Vec2;
        this.id = new b2ContactID
    }};
var b2Distance = Class.create();
b2Distance.prototype = {initialize: function() {
    }};
b2Distance.ProcessTwo = function(a, c, e, f, g) {
    var h = -g[1].x, k = -g[1].y, l = g[0].x - g[1].x, m = g[0].y - g[1].y, n = Math.sqrt(l * l + m * m), h = l / n * h + m / n * k;
    if (0 >= h || n < Number.MIN_VALUE)
        return a.SetV(e[1]), c.SetV(f[1]), e[0].SetV(e[1]), f[0].SetV(f[1]), g[0].SetV(g[1]), 1;
    h /= n;
    a.x = e[1].x + h * (e[0].x - e[1].x);
    a.y = e[1].y + h * (e[0].y - e[1].y);
    c.x = f[1].x + h * (f[0].x - f[1].x);
    c.y = f[1].y + h * (f[0].y - f[1].y);
    return 2
};
b2Distance.ProcessThree = function(a, c, e, f, g) {
    var h = g[0].x, k = g[0].y, l = g[1].x, m = g[1].y, n = g[2].x, p = g[2].y, q = l - h, r = m - k, s = n - h, t = p - k, u = n - l, x = p - m, v = -(h * s + k * t), y = n * s + p * t, D = -(l * u + m * x), u = n * u + p * x;
    if (0 >= y && 0 >= u)
        return a.SetV(e[2]), c.SetV(f[2]), e[0].SetV(e[2]), f[0].SetV(f[2]), g[0].SetV(g[2]), 1;
    r = q * t - r * s;
    q = r * (h * m - k * l);
    l = r * (l * p - m * n);
    if (0 >= l && 0 <= D && 0 <= u)
        return v = D / (D + u), a.x = e[1].x + v * (e[2].x - e[1].x), a.y = e[1].y + v * (e[2].y - e[1].y), c.x = f[1].x + v * (f[2].x - f[1].x), c.y = f[1].y + v * (f[2].y - f[1].y), e[0].SetV(e[2]), f[0].SetV(f[2]), 
        g[0].SetV(g[2]), 2;
    h = r * (n * k - p * h);
    if (0 >= h && 0 <= v && 0 <= y)
        return v /= v + y, a.x = e[0].x + v * (e[2].x - e[0].x), a.y = e[0].y + v * (e[2].y - e[0].y), c.x = f[0].x + v * (f[2].x - f[0].x), c.y = f[0].y + v * (f[2].y - f[0].y), e[1].SetV(e[2]), f[1].SetV(f[2]), g[1].SetV(g[2]), 2;
    v = 1 / (l + h + q);
    g = l * v;
    v *= h;
    y = 1 - g - v;
    a.x = g * e[0].x + v * e[1].x + y * e[2].x;
    a.y = g * e[0].y + v * e[1].y + y * e[2].y;
    c.x = g * f[0].x + v * f[1].x + y * f[2].x;
    c.y = g * f[0].y + v * f[1].y + y * f[2].y;
    return 3
};
b2Distance.InPoinsts = function(a, c, e) {
    for (var f = 0; f < e; ++f)
        if (a.x == c[f].x && a.y == c[f].y)
            return !0;
    return !1
};
b2Distance.Distance = function(a, c, e, f) {
    var g = Array(3), h = Array(3), k = Array(3), l = 0;
    a.SetV(e.m_position);
    c.SetV(f.m_position);
    for (var m = 0, n = 0; 20 > n; ++n) {
        var p = c.x - a.x, q = c.y - a.y, r = e.Support(p, q), s = f.Support(-p, -q), m = p * p + q * q, t = s.x - r.x, u = s.y - r.y;
        if (m - b2Dot(p * t + q * u) <= 0.01 * m)
            return 0 == l && (a.SetV(r), c.SetV(s)), b2Distance.g_GJK_Iterations = n, Math.sqrt(m);
        switch (l) {
            case 0:
                g[0].SetV(r);
                h[0].SetV(s);
                k[0] = w;
                a.SetV(g[0]);
                c.SetV(h[0]);
                ++l;
                break;
            case 1:
                g[1].SetV(r);
                h[1].SetV(s);
                k[1].x = t;
                k[1].y = u;
                l = b2Distance.ProcessTwo(a, 
                c, g, h, k);
                break;
            case 2:
                g[2].SetV(r), h[2].SetV(s), k[2].x = t, k[2].y = u, l = b2Distance.ProcessThree(a, c, g, h, k)
        }
        if (3 == l)
            return b2Distance.g_GJK_Iterations = n, 0;
        p = -Number.MAX_VALUE;
        for (q = 0; q < l; ++q)
            p = b2Math.b2Max(p, k[q].x * k[q].x + k[q].y * k[q].y);
        if (3 == l || m <= 100 * Number.MIN_VALUE * p)
            return b2Distance.g_GJK_Iterations = n, Math.sqrt(m)
    }
    b2Distance.g_GJK_Iterations = 20;
    return Math.sqrt(m)
};
b2Distance.g_GJK_Iterations = 0;
var b2Manifold = Class.create();
b2Manifold.prototype = {initialize: function() {
        this.points = Array(b2Settings.b2_maxManifoldPoints);
        for (var a = 0; a < b2Settings.b2_maxManifoldPoints; a++)
            this.points[a] = new b2ContactPoint;
        this.normal = new b2Vec2
    },points: null,normal: null,pointCount: 0};
var b2OBB = Class.create();
b2OBB.prototype = {R: new b2Mat22,center: new b2Vec2,extents: new b2Vec2,initialize: function() {
        this.R = new b2Mat22;
        this.center = new b2Vec2;
        this.extents = new b2Vec2
    }};
var b2Proxy = Class.create();
b2Proxy.prototype = {GetNext: function() {
        return this.lowerBounds[0]
    },SetNext: function(a) {
        this.lowerBounds[0] = a
    },IsValid: function() {
        return this.overlapCount != b2BroadPhase.b2_invalid
    },lowerBounds: [0, 0],upperBounds: [0, 0],overlapCount: 0,timeStamp: 0,userData: null,initialize: function() {
        this.lowerBounds = [0, 0];
        this.upperBounds = [0, 0]
    }};
var ClipVertex = Class.create();
ClipVertex.prototype = {v: new b2Vec2,id: new b2ContactID,initialize: function() {
        this.v = new b2Vec2;
        this.id = new b2ContactID
    }};
var b2Shape = Class.create();
b2Shape.prototype = {TestPoint: function(a) {
        return !1
    },GetUserData: function() {
        return this.m_userData
    },GetType: function() {
        return this.m_type
    },GetBody: function() {
        return this.m_body
    },GetPosition: function() {
        return this.m_position
    },GetRotationMatrix: function() {
        return this.m_R
    },ResetProxy: function(a) {
    },GetNext: function() {
        return this.m_next
    },initialize: function(a, c) {
        this.m_R = new b2Mat22;
        this.m_position = new b2Vec2;
        this.m_userData = a.userData;
        this.m_friction = a.friction;
        this.m_restitution = a.restitution;
        this.m_body = 
        c;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius = 0;
        this.m_categoryBits = a.categoryBits;
        this.m_maskBits = a.maskBits;
        this.m_groupIndex = a.groupIndex
    },DestroyProxy: function() {
        this.m_proxyId != b2Pair.b2_nullProxy && (this.m_body.m_world.m_broadPhase.DestroyProxy(this.m_proxyId), this.m_proxyId = b2Pair.b2_nullProxy)
    },Synchronize: function(a, c, e, f) {
    },QuickSync: function(a, c) {
    },Support: function(a, c, e) {
    },GetMaxRadius: function() {
        return this.m_maxRadius
    },m_next: null,m_R: new b2Mat22,m_position: new b2Vec2,m_type: 0,
    m_userData: null,m_body: null,m_friction: null,m_restitution: null,m_maxRadius: null,m_proxyId: 0,m_categoryBits: 0,m_maskBits: 0,m_groupIndex: 0};
b2Shape.Create = function(a, c, e) {
    switch (a.type) {
        case b2Shape.e_circleShape:
            return new b2CircleShape(a, c, e);
        case b2Shape.e_boxShape:
        case b2Shape.e_polyShape:
            return new b2PolyShape(a, c, e)
    }
    return null
};
b2Shape.Destroy = function(a) {
    a.m_proxyId != b2Pair.b2_nullProxy && a.m_body.m_world.m_broadPhase.DestroyProxy(a.m_proxyId)
};
b2Shape.e_unknownShape = -1;
b2Shape.e_circleShape = 0;
b2Shape.e_boxShape = 1;
b2Shape.e_polyShape = 2;
b2Shape.e_meshShape = 3;
b2Shape.e_shapeTypeCount = 4;
b2Shape.PolyMass = function(a, c, e, f) {
    var g = new b2Vec2;
    g.SetZero();
    for (var h = 0, k = 0, l = new b2Vec2(0, 0), m = 1 / 3, n = 0; n < e; ++n) {
        var p = l, q = c[n], r = n + 1 < e ? c[n + 1] : c[0], s = b2Math.SubtractVV(q, p), t = b2Math.SubtractVV(r, p), u = b2Math.b2CrossVV(s, t), x = 0.5 * u, h = h + x, v = new b2Vec2;
        v.SetV(p);
        v.Add(q);
        v.Add(r);
        v.Multiply(m * x);
        g.Add(v);
        q = p.x;
        p = p.y;
        r = s.x;
        s = s.y;
        x = t.x;
        t = t.y;
        k += u * (m * (0.25 * (r * r + x * r + x * x) + (q * r + q * x)) + 0.5 * q * q + (m * (0.25 * (s * s + t * s + t * t) + (p * s + p * t)) + 0.5 * p * p))
    }
    a.mass = f * h;
    g.Multiply(1 / h);
    a.center = g;
    k = f * (k - h * b2Math.b2Dot(g, g));
    a.I = 
    k
};
b2Shape.PolyCentroid = function(a, c, e) {
    for (var f = 0, g = 0, h = 0, k = 1 / 3, l = 0; l < c; ++l)
        var m = a[l].x, n = a[l].y, p = l + 1 < c ? a[l + 1].x : a[0].x, q = l + 1 < c ? a[l + 1].y : a[0].y, r = 0.5 * ((m - 0) * (q - 0) - (n - 0) * (p - 0)), h = h + r, f = f + r * k * (0 + m + p), g = g + r * k * (0 + n + q);
    e.Set(1 / h * f, 1 / h * g)
};
var b2ShapeDef = Class.create();
b2ShapeDef.prototype = {initialize: function() {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0, 0);
        this.localRotation = 0;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0
    },ComputeMass: function(a) {
        a.center = new b2Vec2(0, 0);
        0 == this.density && (a.mass = 0, a.center.Set(0, 0), a.I = 0);
        switch (this.type) {
            case b2Shape.e_circleShape:
                a.mass = this.density * b2Settings.b2_pi * this.radius * this.radius;
                a.center.Set(0, 0);
                a.I = 0.5 * a.mass * 
                this.radius * this.radius;
                break;
            case b2Shape.e_boxShape:
                a.mass = 4 * this.density * this.extents.x * this.extents.y;
                a.center.Set(0, 0);
                a.I = a.mass / 3 * b2Math.b2Dot(this.extents, this.extents);
                break;
            case b2Shape.e_polyShape:
                b2Shape.PolyMass(a, this.vertices, this.vertexCount, this.density);
                break;
            default:
                a.mass = 0, a.center.Set(0, 0), a.I = 0
        }
    },type: 0,userData: null,localPosition: null,localRotation: null,friction: null,restitution: null,density: null,categoryBits: 0,maskBits: 0,groupIndex: 0};
var b2BoxDef = Class.create();
Object.extend(b2BoxDef.prototype, b2ShapeDef.prototype);
Object.extend(b2BoxDef.prototype, {initialize: function() {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0, 0);
        this.localRotation = 0;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0;
        this.type = b2Shape.e_boxShape;
        this.extents = new b2Vec2(1, 1)
    },extents: null});
var b2CircleDef = Class.create();
Object.extend(b2CircleDef.prototype, b2ShapeDef.prototype);
Object.extend(b2CircleDef.prototype, {initialize: function() {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0, 0);
        this.localRotation = 0;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0;
        this.type = b2Shape.e_circleShape;
        this.radius = 1
    },radius: null});
var b2CircleShape = Class.create();
Object.extend(b2CircleShape.prototype, b2Shape.prototype);
Object.extend(b2CircleShape.prototype, {TestPoint: function(a) {
        var c = new b2Vec2;
        c.SetV(a);
        c.Subtract(this.m_position);
        return b2Math.b2Dot(c, c) <= this.m_radius * this.m_radius
    },initialize: function(a, c, e) {
        this.m_R = new b2Mat22;
        this.m_position = new b2Vec2;
        this.m_userData = a.userData;
        this.m_friction = a.friction;
        this.m_restitution = a.restitution;
        this.m_body = c;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius = 0;
        this.m_categoryBits = a.categoryBits;
        this.m_maskBits = a.maskBits;
        this.m_groupIndex = a.groupIndex;
        this.m_localPosition = 
        new b2Vec2;
        this.m_localPosition.Set(a.localPosition.x - e.x, a.localPosition.y - e.y);
        this.m_type = b2Shape.e_circleShape;
        this.m_radius = a.radius;
        this.m_R.SetM(this.m_body.m_R);
        a = this.m_R.col1.x * this.m_localPosition.x + this.m_R.col2.x * this.m_localPosition.y;
        c = this.m_R.col1.y * this.m_localPosition.x + this.m_R.col2.y * this.m_localPosition.y;
        this.m_position.x = this.m_body.m_position.x + a;
        this.m_position.y = this.m_body.m_position.y + c;
        this.m_maxRadius = Math.sqrt(a * a + c * c) + this.m_radius;
        a = new b2AABB;
        a.minVertex.Set(this.m_position.x - 
        this.m_radius, this.m_position.y - this.m_radius);
        a.maxVertex.Set(this.m_position.x + this.m_radius, this.m_position.y + this.m_radius);
        c = this.m_body.m_world.m_broadPhase;
        c.InRange(a) ? this.m_proxyId = c.CreateProxy(a, this) : this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
    },Synchronize: function(a, c, e, f) {
        this.m_R.SetM(f);
        this.m_position.x = f.col1.x * this.m_localPosition.x + f.col2.x * this.m_localPosition.y + e.x;
        this.m_position.y = f.col1.y * this.m_localPosition.x + f.col2.y * this.m_localPosition.y + 
        e.y;
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            e = a.x + (c.col1.x * this.m_localPosition.x + c.col2.x * this.m_localPosition.y);
            f = a.y + (c.col1.y * this.m_localPosition.x + c.col2.y * this.m_localPosition.y);
            a = Math.min(e, this.m_position.x);
            c = Math.min(f, this.m_position.y);
            e = Math.max(e, this.m_position.x);
            var g = Math.max(f, this.m_position.y);
            f = new b2AABB;
            f.minVertex.Set(a - this.m_radius, c - this.m_radius);
            f.maxVertex.Set(e + this.m_radius, g + this.m_radius);
            a = this.m_body.m_world.m_broadPhase;
            a.InRange(f) ? a.MoveProxy(this.m_proxyId, 
            f) : this.m_body.Freeze()
        }
    },QuickSync: function(a, c) {
        this.m_R.SetM(c);
        this.m_position.x = c.col1.x * this.m_localPosition.x + c.col2.x * this.m_localPosition.y + a.x;
        this.m_position.y = c.col1.y * this.m_localPosition.x + c.col2.y * this.m_localPosition.y + a.y
    },ResetProxy: function(a) {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            a.GetProxy(this.m_proxyId);
            a.DestroyProxy(this.m_proxyId);
            var c = new b2AABB;
            c.minVertex.Set(this.m_position.x - this.m_radius, this.m_position.y - this.m_radius);
            c.maxVertex.Set(this.m_position.x + this.m_radius, 
            this.m_position.y + this.m_radius);
            a.InRange(c) ? this.m_proxyId = a.CreateProxy(c, this) : this.m_proxyId = b2Pair.b2_nullProxy;
            this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
        }
    },Support: function(a, c, e) {
        var f = Math.sqrt(a * a + c * c);
        e.Set(this.m_position.x + a / f * this.m_radius, this.m_position.y + c / f * this.m_radius)
    },m_localPosition: new b2Vec2,m_radius: null});
var b2MassData = Class.create();
b2MassData.prototype = {mass: 0,center: new b2Vec2(0, 0),I: 0,initialize: function() {
        this.center = new b2Vec2(0, 0)
    }};
var b2PolyDef = Class.create();
Object.extend(b2PolyDef.prototype, b2ShapeDef.prototype);
Object.extend(b2PolyDef.prototype, {initialize: function() {
        this.type = b2Shape.e_unknownShape;
        this.userData = null;
        this.localPosition = new b2Vec2(0, 0);
        this.localRotation = 0;
        this.friction = 0.2;
        this.density = this.restitution = 0;
        this.categoryBits = 1;
        this.maskBits = 65535;
        this.groupIndex = 0;
        this.vertices = Array(b2Settings.b2_maxPolyVertices);
        this.type = b2Shape.e_polyShape;
        for (var a = this.vertexCount = 0; a < b2Settings.b2_maxPolyVertices; a++)
            this.vertices[a] = new b2Vec2
    },vertices: Array(b2Settings.b2_maxPolyVertices),vertexCount: 0});
var b2PolyShape = Class.create();
Object.extend(b2PolyShape.prototype, b2Shape.prototype);
Object.extend(b2PolyShape.prototype, {TestPoint: function(a) {
        var c = new b2Vec2;
        c.SetV(a);
        c.Subtract(this.m_position);
        c.MulTM(this.m_R);
        for (a = 0; a < this.m_vertexCount; ++a) {
            var e = new b2Vec2;
            e.SetV(c);
            e.Subtract(this.m_vertices[a]);
            if (0 < b2Math.b2Dot(this.m_normals[a], e))
                return !1
        }
        return !0
    },initialize: function(a, c, e) {
        this.m_R = new b2Mat22;
        this.m_position = new b2Vec2;
        this.m_userData = a.userData;
        this.m_friction = a.friction;
        this.m_restitution = a.restitution;
        this.m_body = c;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_maxRadius = 
        0;
        this.m_categoryBits = a.categoryBits;
        this.m_maskBits = a.maskBits;
        this.m_groupIndex = a.groupIndex;
        this.syncAABB = new b2AABB;
        this.syncMat = new b2Mat22;
        this.m_localCentroid = new b2Vec2;
        this.m_localOBB = new b2OBB;
        var f = 0, g;
        c = new b2AABB;
        this.m_vertices = Array(b2Settings.b2_maxPolyVertices);
        this.m_coreVertices = Array(b2Settings.b2_maxPolyVertices);
        this.m_normals = Array(b2Settings.b2_maxPolyVertices);
        this.m_type = b2Shape.e_polyShape;
        var h = new b2Mat22(a.localRotation);
        if (a.type == b2Shape.e_boxShape) {
            this.m_localCentroid.x = 
            a.localPosition.x - e.x;
            this.m_localCentroid.y = a.localPosition.y - e.y;
            this.m_vertexCount = 4;
            e = a.extents.x;
            g = a.extents.y;
            a = Math.max(0, e - 2 * b2Settings.b2_linearSlop);
            var k = Math.max(0, g - 2 * b2Settings.b2_linearSlop), f = this.m_vertices[0] = new b2Vec2;
            f.x = h.col1.x * e + h.col2.x * g;
            f.y = h.col1.y * e + h.col2.y * g;
            f = this.m_vertices[1] = new b2Vec2;
            f.x = h.col1.x * -e + h.col2.x * g;
            f.y = h.col1.y * -e + h.col2.y * g;
            f = this.m_vertices[2] = new b2Vec2;
            f.x = h.col1.x * -e + h.col2.x * -g;
            f.y = h.col1.y * -e + h.col2.y * -g;
            f = this.m_vertices[3] = new b2Vec2;
            f.x = h.col1.x * 
            e + h.col2.x * -g;
            f.y = h.col1.y * e + h.col2.y * -g;
            f = this.m_coreVertices[0] = new b2Vec2;
            f.x = h.col1.x * a + h.col2.x * k;
            f.y = h.col1.y * a + h.col2.y * k;
            f = this.m_coreVertices[1] = new b2Vec2;
            f.x = h.col1.x * -a + h.col2.x * k;
            f.y = h.col1.y * -a + h.col2.y * k;
            f = this.m_coreVertices[2] = new b2Vec2;
            f.x = h.col1.x * -a + h.col2.x * -k;
            f.y = h.col1.y * -a + h.col2.y * -k;
            f = this.m_coreVertices[3] = new b2Vec2;
            f.x = h.col1.x * a + h.col2.x * -k;
            f.y = h.col1.y * a + h.col2.y * -k
        } else {
            this.m_vertexCount = a.vertexCount;
            b2Shape.PolyCentroid(a.vertices, a.vertexCount, b2PolyShape.tempVec);
            var k = b2PolyShape.tempVec.x, l = b2PolyShape.tempVec.y;
            this.m_localCentroid.x = a.localPosition.x + (h.col1.x * k + h.col2.x * l) - e.x;
            this.m_localCentroid.y = a.localPosition.y + (h.col1.y * k + h.col2.y * l) - e.y;
            for (f = 0; f < this.m_vertexCount; ++f) {
                this.m_vertices[f] = new b2Vec2;
                this.m_coreVertices[f] = new b2Vec2;
                e = a.vertices[f].x - k;
                g = a.vertices[f].y - l;
                this.m_vertices[f].x = h.col1.x * e + h.col2.x * g;
                this.m_vertices[f].y = h.col1.y * e + h.col2.y * g;
                e = this.m_vertices[f].x;
                g = this.m_vertices[f].y;
                var m = Math.sqrt(e * e + g * g);
                m > Number.MIN_VALUE && 
                (e *= 1 / m, g *= 1 / m);
                this.m_coreVertices[f].x = this.m_vertices[f].x - 2 * b2Settings.b2_linearSlop * e;
                this.m_coreVertices[f].y = this.m_vertices[f].y - 2 * b2Settings.b2_linearSlop * g
            }
        }
        a = h = Number.MAX_VALUE;
        e = -Number.MAX_VALUE;
        g = -Number.MAX_VALUE;
        for (f = this.m_maxRadius = 0; f < this.m_vertexCount; ++f)
            k = this.m_vertices[f], h = Math.min(h, k.x), a = Math.min(a, k.y), e = Math.max(e, k.x), g = Math.max(g, k.y), this.m_maxRadius = Math.max(this.m_maxRadius, k.Length());
        this.m_localOBB.R.SetIdentity();
        this.m_localOBB.center.Set(0.5 * (h + e), 0.5 * (a + 
        g));
        this.m_localOBB.extents.Set(0.5 * (e - h), 0.5 * (g - a));
        for (f = a = h = 0; f < this.m_vertexCount; ++f)
            this.m_normals[f] = new b2Vec2, h = f, a = f + 1 < this.m_vertexCount ? f + 1 : 0, this.m_normals[f].x = this.m_vertices[a].y - this.m_vertices[h].y, this.m_normals[f].y = -(this.m_vertices[a].x - this.m_vertices[h].x), this.m_normals[f].Normalize();
        for (f = 0; f < this.m_vertexCount; ++f)
            ;
        this.m_R.SetM(this.m_body.m_R);
        this.m_position.x = this.m_body.m_position.x + (this.m_R.col1.x * this.m_localCentroid.x + this.m_R.col2.x * this.m_localCentroid.y);
        this.m_position.y = 
        this.m_body.m_position.y + (this.m_R.col1.y * this.m_localCentroid.x + this.m_R.col2.y * this.m_localCentroid.y);
        b2PolyShape.tAbsR.col1.x = this.m_R.col1.x * this.m_localOBB.R.col1.x + this.m_R.col2.x * this.m_localOBB.R.col1.y;
        b2PolyShape.tAbsR.col1.y = this.m_R.col1.y * this.m_localOBB.R.col1.x + this.m_R.col2.y * this.m_localOBB.R.col1.y;
        b2PolyShape.tAbsR.col2.x = this.m_R.col1.x * this.m_localOBB.R.col2.x + this.m_R.col2.x * this.m_localOBB.R.col2.y;
        b2PolyShape.tAbsR.col2.y = this.m_R.col1.y * this.m_localOBB.R.col2.x + this.m_R.col2.y * 
        this.m_localOBB.R.col2.y;
        b2PolyShape.tAbsR.Abs();
        e = b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y;
        g = b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x + b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;
        f = this.m_position.x + (this.m_R.col1.x * this.m_localOBB.center.x + this.m_R.col2.x * this.m_localOBB.center.y);
        h = this.m_position.y + (this.m_R.col1.y * this.m_localOBB.center.x + this.m_R.col2.y * this.m_localOBB.center.y);
        c.minVertex.x = f - e;
        c.minVertex.y = h - g;
        c.maxVertex.x = f + e;
        c.maxVertex.y = h + g;
        f = this.m_body.m_world.m_broadPhase;
        f.InRange(c) ? this.m_proxyId = f.CreateProxy(c, this) : this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
    },syncAABB: new b2AABB,syncMat: new b2Mat22,Synchronize: function(a, c, e, f) {
        this.m_R.SetM(f);
        this.m_position.x = this.m_body.m_position.x + (f.col1.x * this.m_localCentroid.x + f.col2.x * this.m_localCentroid.y);
        this.m_position.y = this.m_body.m_position.y + (f.col1.y * this.m_localCentroid.x + f.col2.y * this.m_localCentroid.y);
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            var g, h;
            g = c.col1;
            h = c.col2;
            var k = this.m_localOBB.R.col1, l = this.m_localOBB.R.col2;
            this.syncMat.col1.x = g.x * k.x + h.x * k.y;
            this.syncMat.col1.y = g.y * k.x + h.y * k.y;
            this.syncMat.col2.x = g.x * l.x + h.x * l.y;
            this.syncMat.col2.y = g.y * l.x + h.y * l.y;
            this.syncMat.Abs();
            g = this.m_localCentroid.x + this.m_localOBB.center.x;
            h = this.m_localCentroid.y + this.m_localOBB.center.y;
            k = a.x + (c.col1.x * g + c.col2.x * h);
            a = a.y + (c.col1.y * g + c.col2.y * h);
            g = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * 
            this.m_localOBB.extents.y;
            h = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
            this.syncAABB.minVertex.x = k - g;
            this.syncAABB.minVertex.y = a - h;
            this.syncAABB.maxVertex.x = k + g;
            this.syncAABB.maxVertex.y = a + h;
            g = f.col1;
            h = f.col2;
            k = this.m_localOBB.R.col1;
            l = this.m_localOBB.R.col2;
            this.syncMat.col1.x = g.x * k.x + h.x * k.y;
            this.syncMat.col1.y = g.y * k.x + h.y * k.y;
            this.syncMat.col2.x = g.x * l.x + h.x * l.y;
            this.syncMat.col2.y = g.y * l.x + h.y * l.y;
            this.syncMat.Abs();
            g = this.m_localCentroid.x + this.m_localOBB.center.x;
            h = this.m_localCentroid.y + this.m_localOBB.center.y;
            k = e.x + (f.col1.x * g + f.col2.x * h);
            a = e.y + (f.col1.y * g + f.col2.y * h);
            g = this.syncMat.col1.x * this.m_localOBB.extents.x + this.syncMat.col2.x * this.m_localOBB.extents.y;
            h = this.syncMat.col1.y * this.m_localOBB.extents.x + this.syncMat.col2.y * this.m_localOBB.extents.y;
            this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, k - g);
            this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, a - h);
            this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, k + g);
            this.syncAABB.maxVertex.y = 
            Math.max(this.syncAABB.maxVertex.y, a + h);
            e = this.m_body.m_world.m_broadPhase;
            e.InRange(this.syncAABB) ? e.MoveProxy(this.m_proxyId, this.syncAABB) : this.m_body.Freeze()
        }
    },QuickSync: function(a, c) {
        this.m_R.SetM(c);
        this.m_position.x = a.x + (c.col1.x * this.m_localCentroid.x + c.col2.x * this.m_localCentroid.y);
        this.m_position.y = a.y + (c.col1.y * this.m_localCentroid.x + c.col2.y * this.m_localCentroid.y)
    },ResetProxy: function(a) {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            a.GetProxy(this.m_proxyId);
            a.DestroyProxy(this.m_proxyId);
            var c = b2Math.b2MulMM(this.m_R, this.m_localOBB.R), c = b2Math.b2AbsM(c), c = b2Math.b2MulMV(c, this.m_localOBB.extents), e = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
            e.Add(this.m_position);
            var f = new b2AABB;
            f.minVertex.SetV(e);
            f.minVertex.Subtract(c);
            f.maxVertex.SetV(e);
            f.maxVertex.Add(c);
            a.InRange(f) ? this.m_proxyId = a.CreateProxy(f, this) : this.m_proxyId = b2Pair.b2_nullProxy;
            this.m_proxyId == b2Pair.b2_nullProxy && this.m_body.Freeze()
        }
    },Support: function(a, c, e) {
        var f = a * this.m_R.col1.x + c * this.m_R.col1.y;
        a = a * this.m_R.col2.x + 
        c * this.m_R.col2.y;
        c = 0;
        for (var g = this.m_coreVertices[0].x * f + this.m_coreVertices[0].y * a, h = 1; h < this.m_vertexCount; ++h) {
            var k = this.m_coreVertices[h].x * f + this.m_coreVertices[h].y * a;
            k > g && (c = h, g = k)
        }
        e.Set(this.m_position.x + (this.m_R.col1.x * this.m_coreVertices[c].x + this.m_R.col2.x * this.m_coreVertices[c].y), this.m_position.y + (this.m_R.col1.y * this.m_coreVertices[c].x + this.m_R.col2.y * this.m_coreVertices[c].y))
    },m_localCentroid: new b2Vec2,m_localOBB: new b2OBB,m_vertices: null,m_coreVertices: null,m_vertexCount: 0,
    m_normals: null});
b2PolyShape.tempVec = new b2Vec2;
b2PolyShape.tAbsR = new b2Mat22;
var b2Body = Class.create();
b2Body.prototype = {SetOriginPosition: function(a, c) {
        if (!this.IsFrozen()) {
            this.m_rotation = c;
            this.m_R.Set(this.m_rotation);
            this.m_position = b2Math.AddVV(a, b2Math.b2MulMV(this.m_R, this.m_center));
            this.m_position0.SetV(this.m_position);
            this.m_rotation0 = this.m_rotation;
            for (var e = this.m_shapeList; null != e; e = e.m_next)
                e.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
            this.m_world.m_broadPhase.Commit()
        }
    },GetOriginPosition: function() {
        return b2Math.SubtractVV(this.m_position, b2Math.b2MulMV(this.m_R, 
        this.m_center))
    },SetCenterPosition: function(a, c) {
        if (!this.IsFrozen()) {
            this.m_rotation = c;
            this.m_R.Set(this.m_rotation);
            this.m_position.SetV(a);
            this.m_position0.SetV(this.m_position);
            this.m_rotation0 = this.m_rotation;
            for (var e = this.m_shapeList; null != e; e = e.m_next)
                e.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
            this.m_world.m_broadPhase.Commit()
        }
    },GetCenterPosition: function() {
        return this.m_position
    },GetPosition: function() {
        var a, c;
        a = this.m_position.x;
        c = this.m_position.y;
        if (0 != this.m_center.x || 
        0 != this.m_center.y)
            a -= this.m_center.x * Math.cos(-this.m_rotation) + this.m_center.y * Math.sin(-this.m_rotation), c -= this.m_center.x * -Math.sin(-this.m_rotation) + this.m_center.y * Math.cos(-this.m_rotation);
        return new b2Vec2(a, c)
    },GetRotation: function() {
        return this.m_rotation
    },GetRotationMatrix: function() {
        return this.m_R
    },SetLinearVelocity: function(a) {
        this.m_linearVelocity.SetV(a)
    },GetLinearVelocity: function() {
        return this.m_linearVelocity
    },SetAngularVelocity: function(a) {
        this.m_angularVelocity = a
    },GetAngularVelocity: function() {
        return this.m_angularVelocity
    },
    ApplyForce: function(a, c) {
        !1 == this.IsSleeping() && (this.m_force.Add(a), this.m_torque += b2Math.b2CrossVV(b2Math.SubtractVV(c, this.m_position), a))
    },ApplyTorque: function(a) {
        !1 == this.IsSleeping() && (this.m_torque += a)
    },ApplyImpulse: function(a, c) {
        !1 == this.IsSleeping() && (this.m_linearVelocity.Add(b2Math.MulFV(this.m_invMass, a)), this.m_angularVelocity += this.m_invI * b2Math.b2CrossVV(b2Math.SubtractVV(c, this.m_position), a))
    },GetMass: function() {
        return this.m_mass
    },GetInertia: function() {
        return this.m_I
    },GetWorldPoint: function(a) {
        return b2Math.AddVV(this.m_position, 
        b2Math.b2MulMV(this.m_R, a))
    },GetWorldVector: function(a) {
        return b2Math.b2MulMV(this.m_R, a)
    },GetLocalPoint: function(a) {
        return b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(a, this.m_position))
    },GetLocalVector: function(a) {
        return b2Math.b2MulTMV(this.m_R, a)
    },IsStatic: function() {
        return (this.m_flags & b2Body.e_staticFlag) == b2Body.e_staticFlag
    },IsFrozen: function() {
        return (this.m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag
    },IsSleeping: function() {
        return (this.m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag
    },AllowSleeping: function(a) {
        a ? 
        this.m_flags |= b2Body.e_allowSleepFlag : (this.m_flags &= ~b2Body.e_allowSleepFlag, this.WakeUp())
    },WakeUp: function() {
        this.m_flags &= ~b2Body.e_sleepFlag;
        this.m_sleepTime = 0
    },GoToSleep: function() {
        this.m_flags |= b2Body.e_sleepFlag;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0
    },GetShapeList: function() {
        return this.m_shapeList
    },GetContactList: function() {
        return this.m_contactList
    },GetJointList: function() {
        return this.m_jointList
    },GetNext: function() {
        return this.m_next
    },GetUserData: function() {
        return this.m_userData
    },
    initialize: function(a, c) {
        this.sMat0 = new b2Mat22;
        this.m_position = new b2Vec2;
        this.m_R = new b2Mat22(0);
        this.m_position0 = new b2Vec2;
        var e = 0, f, g;
        this.m_flags = 0;
        this.m_position.SetV(a.position);
        this.m_rotation = a.rotation;
        this.m_R.Set(this.m_rotation);
        this.m_position0.SetV(this.m_position);
        this.m_rotation0 = this.m_rotation;
        this.m_world = c;
        this.m_linearDamping = b2Math.b2Clamp(1 - a.linearDamping, 0, 1);
        this.m_angularDamping = b2Math.b2Clamp(1 - a.angularDamping, 0, 1);
        this.m_force = new b2Vec2(0, 0);
        this.m_mass = this.m_torque = 
        0;
        for (var h = Array(b2Settings.b2_maxShapesPerBody), e = 0; e < b2Settings.b2_maxShapesPerBody; e++)
            h[e] = new b2MassData;
        this.m_shapeCount = 0;
        this.m_center = new b2Vec2(0, 0);
        for (e = 0; e < b2Settings.b2_maxShapesPerBody; ++e) {
            f = a.shapes[e];
            if (null == f)
                break;
            g = h[e];
            f.ComputeMass(g);
            this.m_mass += g.mass;
            this.m_center.x += g.mass * (f.localPosition.x + g.center.x);
            this.m_center.y += g.mass * (f.localPosition.y + g.center.y);
            ++this.m_shapeCount
        }
        0 < this.m_mass ? (this.m_center.Multiply(1 / this.m_mass), this.m_position.Add(b2Math.b2MulMV(this.m_R, 
        this.m_center))) : this.m_flags |= b2Body.e_staticFlag;
        for (e = this.m_I = 0; e < this.m_shapeCount; ++e)
            f = a.shapes[e], g = h[e], this.m_I += g.I, f = b2Math.SubtractVV(b2Math.AddVV(f.localPosition, g.center), this.m_center), this.m_I += g.mass * b2Math.b2Dot(f, f);
        this.m_invMass = 0 < this.m_mass ? 1 / this.m_mass : 0;
        this.m_invI = 0 < this.m_I && !1 == a.preventRotation ? 1 / this.m_I : this.m_I = 0;
        this.m_linearVelocity = b2Math.AddVV(a.linearVelocity, b2Math.b2CrossFV(a.angularVelocity, this.m_center));
        this.m_angularVelocity = a.angularVelocity;
        this.m_shapeList = 
        this.m_next = this.m_prev = this.m_contactList = this.m_jointList = null;
        for (e = 0; e < this.m_shapeCount; ++e)
            f = a.shapes[e], g = b2Shape.Create(f, this, this.m_center), g.m_next = this.m_shapeList, this.m_shapeList = g;
        this.m_sleepTime = 0;
        a.allowSleep && (this.m_flags |= b2Body.e_allowSleepFlag);
        a.isSleeping && (this.m_flags |= b2Body.e_sleepFlag);
        if (this.m_flags & b2Body.e_sleepFlag || 0 == this.m_invMass)
            this.m_linearVelocity.Set(0, 0), this.m_angularVelocity = 0;
        this.m_userData = a.userData
    },Destroy: function() {
        for (var a = this.m_shapeList; a; ) {
            var c = 
            a, a = a.m_next;
            b2Shape.Destroy(c)
        }
    },sMat0: new b2Mat22,SynchronizeShapes: function() {
        this.sMat0.Set(this.m_rotation0);
        for (var a = this.m_shapeList; null != a; a = a.m_next)
            a.Synchronize(this.m_position0, this.sMat0, this.m_position, this.m_R)
    },QuickSyncShapes: function() {
        for (var a = this.m_shapeList; null != a; a = a.m_next)
            a.QuickSync(this.m_position, this.m_R)
    },IsConnected: function(a) {
        for (var c = this.m_jointList; null != c; c = c.next)
            if (c.other == a)
                return !1 == c.joint.m_collideConnected;
        return !1
    },Freeze: function() {
        this.m_flags |= 
        b2Body.e_frozenFlag;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0;
        for (var a = this.m_shapeList; null != a; a = a.m_next)
            a.DestroyProxy()
    },m_flags: 0,m_position: new b2Vec2,m_rotation: null,m_R: new b2Mat22(0),m_position0: new b2Vec2,m_rotation0: null,m_linearVelocity: null,m_angularVelocity: null,m_force: null,m_torque: null,m_center: null,m_world: null,m_prev: null,m_next: null,m_shapeList: null,m_shapeCount: 0,m_jointList: null,m_contactList: null,m_mass: null,m_invMass: null,m_I: null,m_invI: null,m_linearDamping: null,
    m_angularDamping: null,m_sleepTime: null,m_userData: null};
b2Body.e_staticFlag = 1;
b2Body.e_frozenFlag = 2;
b2Body.e_islandFlag = 4;
b2Body.e_sleepFlag = 8;
b2Body.e_allowSleepFlag = 16;
b2Body.e_destroyFlag = 32;
var b2BodyDef = Class.create();
b2BodyDef.prototype = {initialize: function() {
        this.shapes = [];
        this.userData = null;
        for (var a = 0; a < b2Settings.b2_maxShapesPerBody; a++)
            this.shapes[a] = null;
        this.position = new b2Vec2(0, 0);
        this.rotation = 0;
        this.linearVelocity = new b2Vec2(0, 0);
        this.angularDamping = this.linearDamping = this.angularVelocity = 0;
        this.allowSleep = !0;
        this.preventRotation = this.isSleeping = !1
    },userData: null,shapes: [],position: null,rotation: null,linearVelocity: null,angularVelocity: null,linearDamping: null,angularDamping: null,allowSleep: null,isSleeping: null,
    preventRotation: null,AddShape: function(a) {
        for (var c = 0; c < b2Settings.b2_maxShapesPerBody; ++c)
            if (null == this.shapes[c]) {
                this.shapes[c] = a;
                break
            }
    }};
var b2CollisionFilter = Class.create();
b2CollisionFilter.prototype = {ShouldCollide: function(a, c) {
        return a.m_groupIndex == c.m_groupIndex && 0 != a.m_groupIndex ? 0 < a.m_groupIndex : 0 != (a.m_maskBits & c.m_categoryBits) && 0 != (a.m_categoryBits & c.m_maskBits)
    },initialize: function() {
    }};
b2CollisionFilter.b2_defaultFilter = new b2CollisionFilter;
var b2Island = Class.create();
b2Island.prototype = {initialize: function(a, c, e, f) {
        var g = 0;
        this.m_bodyCapacity = a;
        this.m_contactCapacity = c;
        this.m_jointCapacity = e;
        this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
        this.m_bodies = Array(a);
        for (g = 0; g < a; g++)
            this.m_bodies[g] = null;
        this.m_contacts = Array(c);
        for (g = 0; g < c; g++)
            this.m_contacts[g] = null;
        this.m_joints = Array(e);
        for (g = 0; g < e; g++)
            this.m_joints[g] = null;
        this.m_allocator = f
    },Clear: function() {
        this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0
    },Solve: function(a, c) {
        for (var e = 0, f, e = 
        0; e < this.m_bodyCount; ++e)
            f = this.m_bodies[e], 0 != f.m_invMass && (f.m_linearVelocity.Add(b2Math.MulFV(a.dt, b2Math.AddVV(c, b2Math.MulFV(f.m_invMass, f.m_force)))), f.m_angularVelocity += a.dt * f.m_invI * f.m_torque, f.m_linearVelocity.Multiply(f.m_linearDamping), f.m_angularVelocity *= f.m_angularDamping, f.m_position0.SetV(f.m_position), f.m_rotation0 = f.m_rotation);
        var g = new b2ContactSolver(this.m_contacts, this.m_contactCount, this.m_allocator);
        g.PreSolve();
        for (e = 0; e < this.m_jointCount; ++e)
            this.m_joints[e].PrepareVelocitySolver();
        for (e = 0; e < a.iterations; ++e)
            for (g.SolveVelocityConstraints(), f = 0; f < this.m_jointCount; ++f)
                this.m_joints[f].SolveVelocityConstraints(a);
        for (e = 0; e < this.m_bodyCount; ++e)
            f = this.m_bodies[e], 0 != f.m_invMass && (f.m_position.x += a.dt * f.m_linearVelocity.x, f.m_position.y += a.dt * f.m_linearVelocity.y, f.m_rotation += a.dt * f.m_angularVelocity, f.m_R.Set(f.m_rotation));
        for (e = 0; e < this.m_jointCount; ++e)
            this.m_joints[e].PreparePositionSolver();
        if (b2World.s_enablePositionCorrection)
            for (b2Island.m_positionIterationCount = 0; b2Island.m_positionIterationCount < 
            a.iterations; ++b2Island.m_positionIterationCount) {
                f = g.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
                for (var h = !0, e = 0; e < this.m_jointCount; ++e)
                    var k = this.m_joints[e].SolvePositionConstraints(), h = h && k;
                if (f && h)
                    break
            }
        g.PostSolve();
        for (e = 0; e < this.m_bodyCount; ++e)
            f = this.m_bodies[e], 0 != f.m_invMass && (f.m_R.Set(f.m_rotation), f.SynchronizeShapes(), f.m_force.Set(0, 0), f.m_torque = 0)
    },UpdateSleep: function(a) {
        for (var c = 0, e, f = Number.MAX_VALUE, g = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance, 
        h = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance, c = 0; c < this.m_bodyCount; ++c)
            e = this.m_bodies[c], 0 != e.m_invMass && (0 == (e.m_flags & b2Body.e_allowSleepFlag) && (f = e.m_sleepTime = 0), 0 == (e.m_flags & b2Body.e_allowSleepFlag) || e.m_angularVelocity * e.m_angularVelocity > h || b2Math.b2Dot(e.m_linearVelocity, e.m_linearVelocity) > g ? f = e.m_sleepTime = 0 : (e.m_sleepTime += a, f = b2Math.b2Min(f, e.m_sleepTime)));
        if (f >= b2Settings.b2_timeToSleep)
            for (c = 0; c < this.m_bodyCount; ++c)
                e = this.m_bodies[c], e.m_flags |= b2Body.e_sleepFlag, 
                e.m_linearVelocity.SetZero(), e.m_angularVelocity = 0
    },AddBody: function(a) {
        this.m_bodies[this.m_bodyCount++] = a
    },AddContact: function(a) {
        this.m_contacts[this.m_contactCount++] = a
    },AddJoint: function(a) {
        this.m_joints[this.m_jointCount++] = a
    },m_allocator: null,m_bodies: null,m_contacts: null,m_joints: null,m_bodyCount: 0,m_jointCount: 0,m_contactCount: 0,m_bodyCapacity: 0,m_contactCapacity: 0,m_jointCapacity: 0,m_positionError: null};
b2Island.m_positionIterationCount = 0;
var b2TimeStep = Class.create();
b2TimeStep.prototype = {dt: null,inv_dt: null,iterations: 0,initialize: function() {
    }};
var b2ContactNode = Class.create();
b2ContactNode.prototype = {other: null,contact: null,prev: null,next: null,initialize: function() {
    }};
var b2Contact = Class.create();
b2Contact.prototype = {GetManifolds: function() {
        return null
    },GetManifoldCount: function() {
        return this.m_manifoldCount
    },GetNext: function() {
        return this.m_next
    },GetShape1: function() {
        return this.m_shape1
    },GetShape2: function() {
        return this.m_shape2
    },initialize: function(a, c) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        a && c ? (this.m_shape1 = a, this.m_shape2 = c, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, 
        this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null) : this.m_shape2 = this.m_shape1 = null
    },Evaluate: function() {
    },m_flags: 0,m_prev: null,m_next: null,m_node1: new b2ContactNode,m_node2: new b2ContactNode,m_shape1: null,m_shape2: null,m_manifoldCount: 0,m_friction: null,m_restitution: null};
b2Contact.e_islandFlag = 1;
b2Contact.e_destroyFlag = 2;
b2Contact.AddType = function(a, c, e, f) {
    b2Contact.s_registers[e][f].createFcn = a;
    b2Contact.s_registers[e][f].destroyFcn = c;
    b2Contact.s_registers[e][f].primary = !0;
    e != f && (b2Contact.s_registers[f][e].createFcn = a, b2Contact.s_registers[f][e].destroyFcn = c, b2Contact.s_registers[f][e].primary = !1)
};
b2Contact.InitializeRegisters = function() {
    b2Contact.s_registers = Array(b2Shape.e_shapeTypeCount);
    for (var a = 0; a < b2Shape.e_shapeTypeCount; a++) {
        b2Contact.s_registers[a] = Array(b2Shape.e_shapeTypeCount);
        for (var c = 0; c < b2Shape.e_shapeTypeCount; c++)
            b2Contact.s_registers[a][c] = new b2ContactRegister
    }
    b2Contact.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
    b2Contact.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polyShape, b2Shape.e_circleShape);
    b2Contact.AddType(b2PolyContact.Create, b2PolyContact.Destroy, b2Shape.e_polyShape, b2Shape.e_polyShape)
};
b2Contact.Create = function(a, c, e) {
    !1 == b2Contact.s_initialized && (b2Contact.InitializeRegisters(), b2Contact.s_initialized = !0);
    var f = a.m_type, g = c.m_type, h = b2Contact.s_registers[f][g].createFcn;
    if (h) {
        if (b2Contact.s_registers[f][g].primary)
            return h(a, c, e);
        a = h(c, a, e);
        for (c = 0; c < a.GetManifoldCount(); ++c)
            e = a.GetManifolds()[c], e.normal = e.normal.Negative();
        return a
    }
    return null
};
b2Contact.Destroy = function(a, c) {
    0 < a.GetManifoldCount() && (a.m_shape1.m_body.WakeUp(), a.m_shape2.m_body.WakeUp());
    var e = b2Contact.s_registers[a.m_shape1.m_type][a.m_shape2.m_type].destroyFcn;
    e(a, c)
};
b2Contact.s_registers = null;
b2Contact.s_initialized = !1;
var b2ContactConstraint = Class.create();
b2ContactConstraint.prototype = {initialize: function() {
        this.normal = new b2Vec2;
        this.points = Array(b2Settings.b2_maxManifoldPoints);
        for (var a = 0; a < b2Settings.b2_maxManifoldPoints; a++)
            this.points[a] = new b2ContactConstraintPoint
    },points: null,normal: new b2Vec2,manifold: null,body1: null,body2: null,friction: null,restitution: null,pointCount: 0};
var b2ContactConstraintPoint = Class.create();
b2ContactConstraintPoint.prototype = {localAnchor1: new b2Vec2,localAnchor2: new b2Vec2,normalImpulse: null,tangentImpulse: null,positionImpulse: null,normalMass: null,tangentMass: null,separation: null,velocityBias: null,initialize: function() {
        this.localAnchor1 = new b2Vec2;
        this.localAnchor2 = new b2Vec2
    }};
var b2ContactRegister = Class.create();
b2ContactRegister.prototype = {createFcn: null,destroyFcn: null,primary: null,initialize: function() {
    }};
var b2ContactSolver = Class.create();
b2ContactSolver.prototype = {initialize: function(a, c, e) {
        this.m_constraints = [];
        this.m_allocator = e;
        e = 0;
        var f, g;
        for (e = this.m_constraintCount = 0; e < c; ++e)
            this.m_constraintCount += a[e].GetManifoldCount();
        for (e = 0; e < this.m_constraintCount; e++)
            this.m_constraints[e] = new b2ContactConstraint;
        var h = 0;
        for (e = 0; e < c; ++e)
            for (var k = a[e], l = k.m_shape1.m_body, m = k.m_shape2.m_body, n = k.GetManifoldCount(), p = k.GetManifolds(), q = k.m_friction, k = k.m_restitution, r = l.m_linearVelocity.x, s = l.m_linearVelocity.y, t = m.m_linearVelocity.x, u = 
            m.m_linearVelocity.y, x = l.m_angularVelocity, v = m.m_angularVelocity, y = 0; y < n; ++y) {
                var D = p[y], B = D.normal.x, F = D.normal.y, C = this.m_constraints[h];
                C.body1 = l;
                C.body2 = m;
                C.manifold = D;
                C.normal.x = B;
                C.normal.y = F;
                C.pointCount = D.pointCount;
                C.friction = q;
                C.restitution = k;
                for (var G = 0; G < C.pointCount; ++G) {
                    var A = D.points[G], z = C.points[G];
                    z.normalImpulse = A.normalImpulse;
                    z.tangentImpulse = A.tangentImpulse;
                    z.separation = A.separation;
                    var E = A.position.x - l.m_position.x, H = A.position.y - l.m_position.y, J = A.position.x - m.m_position.x, 
                    A = A.position.y - m.m_position.y;
                    f = z.localAnchor1;
                    g = l.m_R;
                    f.x = E * g.col1.x + H * g.col1.y;
                    f.y = E * g.col2.x + H * g.col2.y;
                    f = z.localAnchor2;
                    g = m.m_R;
                    f.x = J * g.col1.x + A * g.col1.y;
                    f.y = J * g.col2.x + A * g.col2.y;
                    f = E * E + H * H;
                    g = J * J + A * A;
                    var I = E * B + H * F, L = J * B + A * F, K = l.m_invMass + m.m_invMass, K = K + (l.m_invI * (f - I * I) + m.m_invI * (g - L * L));
                    z.normalMass = 1 / K;
                    L = F;
                    K = -B;
                    I = E * L + H * K;
                    L = J * L + A * K;
                    K = l.m_invMass + m.m_invMass;
                    K += l.m_invI * (f - I * I) + m.m_invI * (g - L * L);
                    z.tangentMass = 1 / K;
                    z.velocityBias = 0;
                    0 < z.separation && (z.velocityBias = -60 * z.separation);
                    E = C.normal.x * 
                    (t + -v * A - r - -x * H) + C.normal.y * (u + v * J - s - x * E);
                    E < -b2Settings.b2_velocityThreshold && (z.velocityBias += -C.restitution * E)
                }
                ++h
            }
    },PreSolve: function() {
        for (var a, c, e = 0; e < this.m_constraintCount; ++e) {
            var f = this.m_constraints[e], g = f.body1, h = f.body2, k = g.m_invMass, l = g.m_invI, m = h.m_invMass, n = h.m_invI, p = f.normal.x, q = f.normal.y, r = q, s = -p, t = 0, u = 0;
            if (b2World.s_enableWarmStarting)
                for (u = f.pointCount, t = 0; t < u; ++t) {
                    var x = f.points[t], v = x.normalImpulse * p + x.tangentImpulse * r, y = x.normalImpulse * q + x.tangentImpulse * s;
                    c = g.m_R;
                    a = x.localAnchor1;
                    var D = c.col1.x * a.x + c.col2.x * a.y, B = c.col1.y * a.x + c.col2.y * a.y;
                    c = h.m_R;
                    a = x.localAnchor2;
                    var F = c.col1.x * a.x + c.col2.x * a.y;
                    a = c.col1.y * a.x + c.col2.y * a.y;
                    g.m_angularVelocity -= l * (D * y - B * v);
                    g.m_linearVelocity.x -= k * v;
                    g.m_linearVelocity.y -= k * y;
                    h.m_angularVelocity += n * (F * y - a * v);
                    h.m_linearVelocity.x += m * v;
                    h.m_linearVelocity.y += m * y;
                    x.positionImpulse = 0
                }
            else
                for (u = f.pointCount, t = 0; t < u; ++t)
                    g = f.points[t], g.normalImpulse = 0, g.tangentImpulse = 0, g.positionImpulse = 0
        }
    },SolveVelocityConstraints: function() {
        for (var a = 0, c, e, f, g, h, 
        k, l, m, n = 0; n < this.m_constraintCount; ++n) {
            for (var p = this.m_constraints[n], q = p.body1, r = p.body2, s = q.m_angularVelocity, t = q.m_linearVelocity, u = r.m_angularVelocity, x = r.m_linearVelocity, v = q.m_invMass, y = q.m_invI, D = r.m_invMass, B = r.m_invI, F = p.normal.x, C = p.normal.y, G = C, A = -F, z = p.pointCount, a = 0; a < z; ++a)
                c = p.points[a], h = q.m_R, k = c.localAnchor1, e = h.col1.x * k.x + h.col2.x * k.y, f = h.col1.y * k.x + h.col2.y * k.y, h = r.m_R, k = c.localAnchor2, g = h.col1.x * k.x + h.col2.x * k.y, h = h.col1.y * k.x + h.col2.y * k.y, k = x.x + -u * h - t.x - -s * f, l = x.y + u * g - t.y - 
                s * e, k = -c.normalMass * (k * F + l * C - c.velocityBias), l = b2Math.b2Max(c.normalImpulse + k, 0), k = l - c.normalImpulse, m = k * F, k *= C, t.x -= v * m, t.y -= v * k, s -= y * (e * k - f * m), x.x += D * m, x.y += D * k, u += B * (g * k - h * m), c.normalImpulse = l, k = x.x + -u * h - t.x - -s * f, l = x.y + u * g - t.y - s * e, k = c.tangentMass * -(k * G + l * A), l = p.friction * c.normalImpulse, l = b2Math.b2Clamp(c.tangentImpulse + k, -l, l), k = l - c.tangentImpulse, m = k * G, k *= A, t.x -= v * m, t.y -= v * k, s -= y * (e * k - f * m), x.x += D * m, x.y += D * k, u += B * (g * k - h * m), c.tangentImpulse = l;
            q.m_angularVelocity = s;
            r.m_angularVelocity = u
        }
    },SolvePositionConstraints: function(a) {
        for (var c = 
        0, e, f, g = 0; g < this.m_constraintCount; ++g) {
            for (var h = this.m_constraints[g], k = h.body1, l = h.body2, m = k.m_position, n = k.m_rotation, p = l.m_position, q = l.m_rotation, r = k.m_invMass, s = k.m_invI, t = l.m_invMass, u = l.m_invI, x = h.normal.x, v = h.normal.y, y = h.pointCount, D = 0; D < y; ++D) {
                var B = h.points[D];
                e = k.m_R;
                f = B.localAnchor1;
                var F = e.col1.x * f.x + e.col2.x * f.y, C = e.col1.y * f.x + e.col2.y * f.y;
                e = l.m_R;
                f = B.localAnchor2;
                var G = e.col1.x * f.x + e.col2.x * f.y;
                e = e.col1.y * f.x + e.col2.y * f.y;
                f = (p.x + G - (m.x + F)) * x + (p.y + e - (m.y + C)) * v + B.separation;
                c = b2Math.b2Min(c, 
                f);
                f = a * b2Math.b2Clamp(f + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0);
                f *= -B.normalMass;
                var A = B.positionImpulse;
                B.positionImpulse = b2Math.b2Max(A + f, 0);
                f = B.positionImpulse - A;
                B = f * x;
                f *= v;
                m.x -= r * B;
                m.y -= r * f;
                n -= s * (F * f - C * B);
                k.m_R.Set(n);
                p.x += t * B;
                p.y += t * f;
                q += u * (G * f - e * B);
                l.m_R.Set(q)
            }
            k.m_rotation = n;
            l.m_rotation = q
        }
        return c >= -b2Settings.b2_linearSlop
    },PostSolve: function() {
        for (var a = 0; a < this.m_constraintCount; ++a)
            for (var c = this.m_constraints[a], e = c.manifold, f = 0; f < c.pointCount; ++f) {
                var g = e.points[f], 
                h = c.points[f];
                g.normalImpulse = h.normalImpulse;
                g.tangentImpulse = h.tangentImpulse
            }
    },m_allocator: null,m_constraints: [],m_constraintCount: 0};
var b2CircleContact = Class.create();
Object.extend(b2CircleContact.prototype, b2Contact.prototype);
Object.extend(b2CircleContact.prototype, {initialize: function(a, c) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        a && c ? (this.m_shape1 = a, this.m_shape2 = c, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = 
        null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m_manifold = [new b2Manifold], this.m_manifold[0].pointCount = 0, this.m_manifold[0].points[0].normalImpulse = 0, this.m_manifold[0].points[0].tangentImpulse = 0) : this.m_shape2 = this.m_shape1 = null
    },Evaluate: function() {
        b2Collision.b2CollideCircle(this.m_manifold[0], this.m_shape1, this.m_shape2, !1);
        this.m_manifoldCount = 0 < this.m_manifold[0].pointCount ? 1 : 0
    },GetManifolds: function() {
        return this.m_manifold
    },m_manifold: [new b2Manifold]});
b2CircleContact.Create = function(a, c, e) {
    return new b2CircleContact(a, c)
};
b2CircleContact.Destroy = function(a, c) {
};
var b2Conservative = Class.create();
b2Conservative.prototype = {initialize: function() {
    }};
b2Conservative.R1 = new b2Mat22;
b2Conservative.R2 = new b2Mat22;
b2Conservative.x1 = new b2Vec2;
b2Conservative.x2 = new b2Vec2;
b2Conservative.Conservative = function(a, c) {
    var e = a.GetBody(), f = c.GetBody(), g = e.m_position.x - e.m_position0.x, h = e.m_position.y - e.m_position0.y, k = e.m_rotation - e.m_rotation0, l = f.m_position.x - f.m_position0.x, m = f.m_position.y - f.m_position0.y, n = f.m_rotation - f.m_rotation0, p = a.GetMaxRadius(), q = c.GetMaxRadius(), r = e.m_position0.x, s = e.m_position0.y, t = e.m_rotation0, u = f.m_position0.x, x = f.m_position0.y, v = f.m_rotation0, y = r, D = s, B = t, F = u, C = x, G = v;
    b2Conservative.R1.Set(B);
    b2Conservative.R2.Set(G);
    a.QuickSync(p1, b2Conservative.R1);
    c.QuickSync(p2, b2Conservative.R2);
    var A = 0, z, E;
    z = 0;
    for (var H = !0, J = 0; 10 > J; ++J) {
        var I = b2Distance.Distance(b2Conservative.x1, b2Conservative.x2, a, c);
        if (I < b2Settings.b2_linearSlop) {
            H = 0 == J ? !1 : !0;
            break
        }
        if (0 == J) {
            z = b2Conservative.x2.x - b2Conservative.x1.x;
            E = b2Conservative.x2.y - b2Conservative.x1.y;
            Math.sqrt(z * z + E * E);
            z = z * (g - l) + E * (h - m) + Math.abs(k) * p + Math.abs(n) * q;
            if (Math.abs(z) < Number.MIN_VALUE) {
                H = !1;
                break
            }
            z = 1 / z
        }
        I = A + I * z;
        if (0 > I || 1 < I) {
            H = !1;
            break
        }
        if (I < (1 + 100 * Number.MIN_VALUE) * A) {
            H = !0;
            break
        }
        A = I;
        y = r + A * v1.x;
        D = s + A * v1.y;
        B = t + A * k;
        F = u + A * v2.x;
        C = x + A * v2.y;
        G = v + A * n;
        b2Conservative.R1.Set(B);
        b2Conservative.R2.Set(G);
        a.QuickSync(p1, b2Conservative.R1);
        c.QuickSync(p2, b2Conservative.R2)
    }
    if (H)
        return z = b2Conservative.x2.x - b2Conservative.x1.x, E = b2Conservative.x2.y - b2Conservative.x1.y, g = Math.sqrt(z * z + E * E), g > FLT_EPSILON && (d *= b2_linearSlop / g), e.IsStatic() ? (e.m_position.x = y, e.m_position.y = D) : (e.m_position.x = y - z, e.m_position.y = D - E), e.m_rotation = B, e.m_R.Set(B), e.QuickSyncShapes(), f.IsStatic() ? (f.m_position.x = F, f.m_position.y = C) : (f.m_position.x = 
        F + z, f.m_position.y = C + E), f.m_position.x = F + z, f.m_position.y = C + E, f.m_rotation = G, f.m_R.Set(G), f.QuickSyncShapes(), !0;
    a.QuickSync(e.m_position, e.m_R);
    c.QuickSync(f.m_position, f.m_R);
    return !1
};
var b2NullContact = Class.create();
Object.extend(b2NullContact.prototype, b2Contact.prototype);
Object.extend(b2NullContact.prototype, {initialize: function(a, c) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        a && c ? (this.m_shape1 = a, this.m_shape2 = c, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = 
        null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null) : this.m_shape2 = this.m_shape1 = null
    },Evaluate: function() {
    },GetManifolds: function() {
        return null
    }});
var b2PolyAndCircleContact = Class.create();
Object.extend(b2PolyAndCircleContact.prototype, b2Contact.prototype);
Object.extend(b2PolyAndCircleContact.prototype, {initialize: function(a, c) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        a && c ? (this.m_shape1 = a, this.m_shape2 = c, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, 
        this.m_node2.contact = null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m_manifold = [new b2Manifold], b2Settings.b2Assert(this.m_shape1.m_type == b2Shape.e_polyShape), b2Settings.b2Assert(this.m_shape2.m_type == b2Shape.e_circleShape), this.m_manifold[0].pointCount = 0, this.m_manifold[0].points[0].normalImpulse = 0, this.m_manifold[0].points[0].tangentImpulse = 0) : this.m_shape2 = this.m_shape1 = null
    },Evaluate: function() {
        b2Collision.b2CollidePolyAndCircle(this.m_manifold[0], this.m_shape1, 
        this.m_shape2, !1);
        this.m_manifoldCount = 0 < this.m_manifold[0].pointCount ? 1 : 0
    },GetManifolds: function() {
        return this.m_manifold
    },m_manifold: [new b2Manifold]});
b2PolyAndCircleContact.Create = function(a, c, e) {
    return new b2PolyAndCircleContact(a, c)
};
b2PolyAndCircleContact.Destroy = function(a, c) {
};
var b2PolyContact = Class.create();
Object.extend(b2PolyContact.prototype, b2Contact.prototype);
Object.extend(b2PolyContact.prototype, {initialize: function(a, c) {
        this.m_node1 = new b2ContactNode;
        this.m_node2 = new b2ContactNode;
        this.m_flags = 0;
        a && c ? (this.m_shape1 = a, this.m_shape2 = c, this.m_manifoldCount = 0, this.m_friction = Math.sqrt(this.m_shape1.m_friction * this.m_shape2.m_friction), this.m_restitution = b2Math.b2Max(this.m_shape1.m_restitution, this.m_shape2.m_restitution), this.m_next = this.m_prev = null, this.m_node1.contact = null, this.m_node1.prev = null, this.m_node1.next = null, this.m_node1.other = null, this.m_node2.contact = 
        null, this.m_node2.prev = null, this.m_node2.next = null, this.m_node2.other = null, this.m0 = new b2Manifold, this.m_manifold = [new b2Manifold], this.m_manifold[0].pointCount = 0) : this.m_shape2 = this.m_shape1 = null
    },m0: new b2Manifold,Evaluate: function() {
        for (var a = this.m_manifold[0], c = this.m0.points, e = 0; e < a.pointCount; e++) {
            var f = c[e], g = a.points[e];
            f.normalImpulse = g.normalImpulse;
            f.tangentImpulse = g.tangentImpulse;
            f.id = g.id.Copy()
        }
        this.m0.pointCount = a.pointCount;
        b2Collision.b2CollidePoly(a, this.m_shape1, this.m_shape2, 
        !1);
        if (0 < a.pointCount) {
            c = [!1, !1];
            for (e = 0; e < a.pointCount; ++e) {
                f = a.points[e];
                f.normalImpulse = 0;
                f.tangentImpulse = 0;
                for (var g = f.id.key, h = 0; h < this.m0.pointCount; ++h)
                    if (!0 != c[h]) {
                        var k = this.m0.points[h];
                        if (k.id.key == g) {
                            c[h] = !0;
                            f.normalImpulse = k.normalImpulse;
                            f.tangentImpulse = k.tangentImpulse;
                            break
                        }
                    }
            }
            this.m_manifoldCount = 1
        } else
            this.m_manifoldCount = 0
    },GetManifolds: function() {
        return this.m_manifold
    },m_manifold: [new b2Manifold]});
b2PolyContact.Create = function(a, c, e) {
    return new b2PolyContact(a, c)
};
b2PolyContact.Destroy = function(a, c) {
};
var b2ContactManager = Class.create();
Object.extend(b2ContactManager.prototype, b2PairCallback.prototype);
Object.extend(b2ContactManager.prototype, {initialize: function() {
        this.m_nullContact = new b2NullContact;
        this.m_world = null;
        this.m_destroyImmediate = !1
    },PairAdded: function(a, c) {
        var e = a, f = c, g = e.m_body, h = f.m_body;
        if (g.IsStatic() && h.IsStatic() || e.m_body == f.m_body || h.IsConnected(g) || null != this.m_world.m_filter && !1 == this.m_world.m_filter.ShouldCollide(e, f))
            return this.m_nullContact;
        0 == h.m_invMass && (g = e, e = f, f = g);
        e = b2Contact.Create(e, f, this.m_world.m_blockAllocator);
        if (null == e)
            return this.m_nullContact;
        e.m_prev = 
        null;
        e.m_next = this.m_world.m_contactList;
        null != this.m_world.m_contactList && (this.m_world.m_contactList.m_prev = e);
        this.m_world.m_contactList = e;
        this.m_world.m_contactCount++;
        return e
    },PairRemoved: function(a, c, e) {
        null != e && e != this.m_nullContact && (!0 == this.m_destroyImmediate ? this.DestroyContact(e) : e.m_flags |= b2Contact.e_destroyFlag)
    },DestroyContact: function(a) {
        a.m_prev && (a.m_prev.m_next = a.m_next);
        a.m_next && (a.m_next.m_prev = a.m_prev);
        a == this.m_world.m_contactList && (this.m_world.m_contactList = a.m_next);
        if (0 < a.GetManifoldCount()) {
            var c = a.m_shape1.m_body, e = a.m_shape2.m_body, f = a.m_node1, g = a.m_node2;
            c.WakeUp();
            e.WakeUp();
            f.prev && (f.prev.next = f.next);
            f.next && (f.next.prev = f.prev);
            f == c.m_contactList && (c.m_contactList = f.next);
            f.prev = null;
            f.next = null;
            g.prev && (g.prev.next = g.next);
            g.next && (g.next.prev = g.prev);
            g == e.m_contactList && (e.m_contactList = g.next);
            g.prev = null;
            g.next = null
        }
        b2Contact.Destroy(a, this.m_world.m_blockAllocator);
        --this.m_world.m_contactCount
    },CleanContactList: function() {
        for (var a = this.m_world.m_contactList; null != 
        a; ) {
            var c = a, a = a.m_next;
            c.m_flags & b2Contact.e_destroyFlag && this.DestroyContact(c)
        }
    },Collide: function() {
        for (var a, c, e, f, g = this.m_world.m_contactList; null != g; g = g.m_next)
            g.m_shape1.m_body.IsSleeping() && g.m_shape2.m_body.IsSleeping() || (a = g.GetManifoldCount(), g.Evaluate(), c = g.GetManifoldCount(), 0 == a && 0 < c ? (a = g.m_shape1.m_body, c = g.m_shape2.m_body, e = g.m_node1, f = g.m_node2, e.contact = g, e.other = c, e.prev = null, e.next = a.m_contactList, null != e.next && (e.next.prev = g.m_node1), a.m_contactList = g.m_node1, f.contact = g, f.other = 
            a, f.prev = null, f.next = c.m_contactList, null != f.next && (f.next.prev = f), c.m_contactList = f) : 0 < a && 0 == c && (a = g.m_shape1.m_body, c = g.m_shape2.m_body, e = g.m_node1, f = g.m_node2, e.prev && (e.prev.next = e.next), e.next && (e.next.prev = e.prev), e == a.m_contactList && (a.m_contactList = e.next), e.prev = null, e.next = null, f.prev && (f.prev.next = f.next), f.next && (f.next.prev = f.prev), f == c.m_contactList && (c.m_contactList = f.next), f.prev = null, f.next = null))
    },m_world: null,m_nullContact: new b2NullContact,m_destroyImmediate: null});
var b2World = Class.create();
b2World.prototype = {initialize: function(a, c, e) {
        this.step = new b2TimeStep;
        this.m_contactManager = new b2ContactManager;
        this.m_listener = null;
        this.m_filter = b2CollisionFilter.b2_defaultFilter;
        this.m_jointList = this.m_contactList = this.m_bodyList = null;
        this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
        this.m_bodyDestroyList = null;
        this.m_allowSleep = e;
        this.m_gravity = c;
        this.m_contactManager.m_world = this;
        this.m_broadPhase = new b2BroadPhase(a, this.m_contactManager);
        a = new b2BodyDef;
        this.m_groundBody = this.CreateBody(a)
    },
    SetListener: function(a) {
        this.m_listener = a
    },SetFilter: function(a) {
        this.m_filter = a
    },CreateBody: function(a) {
        a = new b2Body(a, this);
        a.m_prev = null;
        if (a.m_next = this.m_bodyList)
            this.m_bodyList.m_prev = a;
        this.m_bodyList = a;
        ++this.m_bodyCount;
        return a
    },DestroyBody: function(a) {
        a.m_flags & b2Body.e_destroyFlag || (a.m_prev && (a.m_prev.m_next = a.m_next), a.m_next && (a.m_next.m_prev = a.m_prev), a == this.m_bodyList && (this.m_bodyList = a.m_next), a.m_flags |= b2Body.e_destroyFlag, --this.m_bodyCount, a.m_prev = null, a.m_next = this.m_bodyDestroyList, 
        this.m_bodyDestroyList = a)
    },CleanBodyList: function() {
        this.m_contactManager.m_destroyImmediate = !0;
        for (var a = this.m_bodyDestroyList; a; ) {
            for (var c = a, a = a.m_next, e = c.m_jointList; e; ) {
                var f = e, e = e.next;
                this.m_listener && this.m_listener.NotifyJointDestroyed(f.joint);
                this.DestroyJoint(f.joint)
            }
            c.Destroy()
        }
        this.m_bodyDestroyList = null;
        this.m_contactManager.m_destroyImmediate = !1
    },CreateJoint: function(a) {
        var c = b2Joint.Create(a, this.m_blockAllocator);
        c.m_prev = null;
        if (c.m_next = this.m_jointList)
            this.m_jointList.m_prev = 
            c;
        this.m_jointList = c;
        ++this.m_jointCount;
        c.m_node1.joint = c;
        c.m_node1.other = c.m_body2;
        c.m_node1.prev = null;
        if (c.m_node1.next = c.m_body1.m_jointList)
            c.m_body1.m_jointList.prev = c.m_node1;
        c.m_body1.m_jointList = c.m_node1;
        c.m_node2.joint = c;
        c.m_node2.other = c.m_body1;
        c.m_node2.prev = null;
        if (c.m_node2.next = c.m_body2.m_jointList)
            c.m_body2.m_jointList.prev = c.m_node2;
        c.m_body2.m_jointList = c.m_node2;
        if (!1 == a.collideConnected)
            for (a = (a.body1.m_shapeCount < a.body2.m_shapeCount ? a.body1 : a.body2).m_shapeList; a; a = a.m_next)
                a.ResetProxy(this.m_broadPhase);
        return c
    },DestroyJoint: function(a) {
        var c = a.m_collideConnected;
        a.m_prev && (a.m_prev.m_next = a.m_next);
        a.m_next && (a.m_next.m_prev = a.m_prev);
        a == this.m_jointList && (this.m_jointList = a.m_next);
        var e = a.m_body1, f = a.m_body2;
        e.WakeUp();
        f.WakeUp();
        a.m_node1.prev && (a.m_node1.prev.next = a.m_node1.next);
        a.m_node1.next && (a.m_node1.next.prev = a.m_node1.prev);
        a.m_node1 == e.m_jointList && (e.m_jointList = a.m_node1.next);
        a.m_node1.prev = null;
        a.m_node1.next = null;
        a.m_node2.prev && (a.m_node2.prev.next = a.m_node2.next);
        a.m_node2.next && 
        (a.m_node2.next.prev = a.m_node2.prev);
        a.m_node2 == f.m_jointList && (f.m_jointList = a.m_node2.next);
        a.m_node2.prev = null;
        a.m_node2.next = null;
        b2Joint.Destroy(a, this.m_blockAllocator);
        --this.m_jointCount;
        if (!1 == c)
            for (a = (e.m_shapeCount < f.m_shapeCount ? e : f).m_shapeList; a; a = a.m_next)
                a.ResetProxy(this.m_broadPhase)
    },GetGroundBody: function() {
        return this.m_groundBody
    },step: new b2TimeStep,Step: function(a, c) {
        var e, f;
        this.step.dt = a;
        this.step.iterations = c;
        this.step.inv_dt = 0 < a ? 1 / a : 0;
        this.m_positionIterationCount = 0;
        this.m_contactManager.CleanContactList();
        this.CleanBodyList();
        this.m_contactManager.Collide();
        var g = new b2Island(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator);
        for (e = this.m_bodyList; null != e; e = e.m_next)
            e.m_flags &= ~b2Body.e_islandFlag;
        for (var h = this.m_contactList; null != h; h = h.m_next)
            h.m_flags &= ~b2Contact.e_islandFlag;
        for (h = this.m_jointList; null != h; h = h.m_next)
            h.m_islandFlag = !1;
        for (var h = Array(this.m_bodyCount), k = 0; k < this.m_bodyCount; k++)
            h[k] = null;
        for (k = this.m_bodyList; null != k; k = k.m_next)
            if (!(k.m_flags & (b2Body.e_staticFlag | 
            b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag))) {
                g.Clear();
                var l = 0;
                h[l++] = k;
                for (k.m_flags |= b2Body.e_islandFlag; 0 < l; )
                    if (e = h[--l], g.AddBody(e), e.m_flags &= ~b2Body.e_sleepFlag, !(e.m_flags & b2Body.e_staticFlag)) {
                        for (var m = e.m_contactList; null != m; m = m.next)
                            m.contact.m_flags & b2Contact.e_islandFlag || (g.AddContact(m.contact), m.contact.m_flags |= b2Contact.e_islandFlag, f = m.other, f.m_flags & b2Body.e_islandFlag || (h[l++] = f, f.m_flags |= b2Body.e_islandFlag));
                        for (e = e.m_jointList; null != e; e = e.next)
                            !0 != e.joint.m_islandFlag && 
                            (g.AddJoint(e.joint), e.joint.m_islandFlag = !0, f = e.other, f.m_flags & b2Body.e_islandFlag || (h[l++] = f, f.m_flags |= b2Body.e_islandFlag))
                    }
                g.Solve(this.step, this.m_gravity);
                this.m_positionIterationCount = b2Math.b2Max(this.m_positionIterationCount, b2Island.m_positionIterationCount);
                this.m_allowSleep && g.UpdateSleep(a);
                for (f = 0; f < g.m_bodyCount; ++f)
                    e = g.m_bodies[f], e.m_flags & b2Body.e_staticFlag && (e.m_flags &= ~b2Body.e_islandFlag), e.IsFrozen() && this.m_listener && this.m_listener.NotifyBoundaryViolated(e) == b2WorldListener.b2_destroyBody && 
                    (this.DestroyBody(e), g.m_bodies[f] = null)
            }
        this.m_broadPhase.Commit()
    },Query: function(a, c, e) {
        var f = [];
        a = this.m_broadPhase.QueryAABB(a, f, e);
        for (e = 0; e < a; ++e)
            c[e] = f[e];
        return a
    },GetBodyList: function() {
        return this.m_bodyList
    },GetJointList: function() {
        return this.m_jointList
    },GetContactList: function() {
        return this.m_contactList
    },m_blockAllocator: null,m_stackAllocator: null,m_broadPhase: null,m_contactManager: new b2ContactManager,m_bodyList: null,m_contactList: null,m_jointList: null,m_bodyCount: 0,m_contactCount: 0,
    m_jointCount: 0,m_bodyDestroyList: null,m_gravity: null,m_allowSleep: null,m_groundBody: null,m_listener: null,m_filter: null,m_positionIterationCount: 0};
b2World.s_enablePositionCorrection = 1;
b2World.s_enableWarmStarting = 1;
var b2WorldListener = Class.create();
b2WorldListener.prototype = {NotifyJointDestroyed: function(a) {
    },NotifyBoundaryViolated: function(a) {
        return b2WorldListener.b2_freezeBody
    },initialize: function() {
    }};
b2WorldListener.b2_freezeBody = 0;
b2WorldListener.b2_destroyBody = 1;
var b2JointNode = Class.create();
b2JointNode.prototype = {other: null,joint: null,prev: null,next: null,initialize: function() {
    }};
var b2Joint = Class.create();
b2Joint.prototype = {GetType: function() {
        return this.m_type
    },GetAnchor1: function() {
        return null
    },GetAnchor2: function() {
        return null
    },GetReactionForce: function(a) {
        return null
    },GetReactionTorque: function(a) {
        return 0
    },GetBody1: function() {
        return this.m_body1
    },GetBody2: function() {
        return this.m_body2
    },GetNext: function() {
        return this.m_next
    },GetUserData: function() {
        return this.m_userData
    },initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = 
        null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData
    },PrepareVelocitySolver: function() {
    },SolveVelocityConstraints: function(a) {
    },PreparePositionSolver: function() {
    },SolvePositionConstraints: function() {
        return !1
    },m_type: 0,m_prev: null,m_next: null,m_node1: new b2JointNode,m_node2: new b2JointNode,m_body1: null,m_body2: null,m_islandFlag: null,m_collideConnected: null,m_userData: null};
b2Joint.Create = function(a, c) {
    var e = null;
    switch (a.type) {
        case b2Joint.e_distanceJoint:
            e = new b2DistanceJoint(a);
            break;
        case b2Joint.e_mouseJoint:
            e = new b2MouseJoint(a);
            break;
        case b2Joint.e_prismaticJoint:
            e = new b2PrismaticJoint(a);
            break;
        case b2Joint.e_revoluteJoint:
            e = new b2RevoluteJoint(a);
            break;
        case b2Joint.e_pulleyJoint:
            e = new b2PulleyJoint(a);
            break;
        case b2Joint.e_gearJoint:
            e = new b2GearJoint(a)
    }
    return e
};
b2Joint.Destroy = function(a, c) {
};
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
b2JointDef.prototype = {initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1
    },type: 0,userData: null,body1: null,body2: null,collideConnected: null};
var b2DistanceJoint = Class.create();
Object.extend(b2DistanceJoint.prototype, b2Joint.prototype);
Object.extend(b2DistanceJoint.prototype, {initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_u = new b2Vec2;
        var c, e, f;
        c = this.m_body1.m_R;
        e = a.anchorPoint1.x - this.m_body1.m_position.x;
        f = a.anchorPoint1.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = e * c.col1.x + f * c.col1.y;
        this.m_localAnchor1.y = e * c.col2.x + f * c.col2.y;
        c = this.m_body2.m_R;
        e = a.anchorPoint2.x - this.m_body2.m_position.x;
        f = a.anchorPoint2.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = e * c.col1.x + f * c.col1.y;
        this.m_localAnchor2.y = e * c.col2.x + f * c.col2.y;
        e = a.anchorPoint2.x - a.anchorPoint1.x;
        f = a.anchorPoint2.y - a.anchorPoint1.y;
        this.m_length = Math.sqrt(e * e + f * f);
        this.m_impulse = 0
    },PrepareVelocitySolver: function() {
        var a;
        a = this.m_body1.m_R;
        var c = a.col1.x * this.m_localAnchor1.x + 
        a.col2.x * this.m_localAnchor1.y, e = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        a = this.m_body2.m_R;
        var f = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        a = a.col1.y * this.m_localAnchor2.x + a.col2.y * this.m_localAnchor2.y;
        this.m_u.x = this.m_body2.m_position.x + f - this.m_body1.m_position.x - c;
        this.m_u.y = this.m_body2.m_position.y + a - this.m_body1.m_position.y - e;
        var g = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
        g > b2Settings.b2_linearSlop ? this.m_u.Multiply(1 / g) : this.m_u.SetZero();
        var g = c * this.m_u.y - e * this.m_u.x, h = f * this.m_u.y - a * this.m_u.x;
        this.m_mass = this.m_body1.m_invMass + this.m_body1.m_invI * g * g + this.m_body2.m_invMass + this.m_body2.m_invI * h * h;
        this.m_mass = 1 / this.m_mass;
        b2World.s_enableWarmStarting ? (g = this.m_impulse * this.m_u.x, h = this.m_impulse * this.m_u.y, this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * g, this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * h, this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (c * h - e * g), this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * 
        g, this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * h, this.m_body2.m_angularVelocity += this.m_body2.m_invI * (f * h - a * g)) : this.m_impulse = 0
    },SolveVelocityConstraints: function(a) {
        var c;
        c = this.m_body1.m_R;
        a = c.col1.x * this.m_localAnchor1.x + c.col2.x * this.m_localAnchor1.y;
        var e = c.col1.y * this.m_localAnchor1.x + c.col2.y * this.m_localAnchor1.y;
        c = this.m_body2.m_R;
        var f = c.col1.x * this.m_localAnchor2.x + c.col2.x * this.m_localAnchor2.y;
        c = c.col1.y * this.m_localAnchor2.x + c.col2.y * this.m_localAnchor2.y;
        var g = -this.m_mass * 
        (this.m_u.x * (this.m_body2.m_linearVelocity.x + -this.m_body2.m_angularVelocity * c - (this.m_body1.m_linearVelocity.x + -this.m_body1.m_angularVelocity * e)) + this.m_u.y * (this.m_body2.m_linearVelocity.y + this.m_body2.m_angularVelocity * f - (this.m_body1.m_linearVelocity.y + this.m_body1.m_angularVelocity * a)));
        this.m_impulse += g;
        var h = g * this.m_u.x, g = g * this.m_u.y;
        this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * h;
        this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * g;
        this.m_body1.m_angularVelocity -= this.m_body1.m_invI * 
        (a * g - e * h);
        this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * h;
        this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * g;
        this.m_body2.m_angularVelocity += this.m_body2.m_invI * (f * g - c * h)
    },SolvePositionConstraints: function() {
        var a;
        a = this.m_body1.m_R;
        var c = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y, e = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        a = this.m_body2.m_R;
        var f = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        a = a.col1.y * this.m_localAnchor2.x + 
        a.col2.y * this.m_localAnchor2.y;
        var g = this.m_body2.m_position.x + f - this.m_body1.m_position.x - c, h = this.m_body2.m_position.y + a - this.m_body1.m_position.y - e, k = Math.sqrt(g * g + h * h), g = g / k, h = h / k, k = k - this.m_length, k = b2Math.b2Clamp(k, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection), l = -this.m_mass * k;
        this.m_u.Set(g, h);
        g = l * this.m_u.x;
        h = l * this.m_u.y;
        this.m_body1.m_position.x -= this.m_body1.m_invMass * g;
        this.m_body1.m_position.y -= this.m_body1.m_invMass * h;
        this.m_body1.m_rotation -= this.m_body1.m_invI * 
        (c * h - e * g);
        this.m_body2.m_position.x += this.m_body2.m_invMass * g;
        this.m_body2.m_position.y += this.m_body2.m_invMass * h;
        this.m_body2.m_rotation += this.m_body2.m_invI * (f * h - a * g);
        this.m_body1.m_R.Set(this.m_body1.m_rotation);
        this.m_body2.m_R.Set(this.m_body2.m_rotation);
        return b2Math.b2Abs(k) < b2Settings.b2_linearSlop
    },GetAnchor1: function() {
        return b2Math.AddVV(this.m_body1.m_position, b2Math.b2MulMV(this.m_body1.m_R, this.m_localAnchor1))
    },GetAnchor2: function() {
        return b2Math.AddVV(this.m_body2.m_position, b2Math.b2MulMV(this.m_body2.m_R, 
        this.m_localAnchor2))
    },GetReactionForce: function(a) {
        var c = new b2Vec2;
        c.SetV(this.m_u);
        c.Multiply(this.m_impulse * a);
        return c
    },GetReactionTorque: function(a) {
        return 0
    },m_localAnchor1: new b2Vec2,m_localAnchor2: new b2Vec2,m_u: new b2Vec2,m_impulse: null,m_mass: null,m_length: null});
var b2DistanceJointDef = Class.create();
Object.extend(b2DistanceJointDef.prototype, b2JointDef.prototype);
Object.extend(b2DistanceJointDef.prototype, {initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.anchorPoint1 = new b2Vec2;
        this.anchorPoint2 = new b2Vec2;
        this.type = b2Joint.e_distanceJoint
    },anchorPoint1: new b2Vec2,anchorPoint2: new b2Vec2});
var b2Jacobian = Class.create();
b2Jacobian.prototype = {linear1: new b2Vec2,angular1: null,linear2: new b2Vec2,angular2: null,SetZero: function() {
        this.linear1.SetZero();
        this.angular1 = 0;
        this.linear2.SetZero();
        this.angular2 = 0
    },Set: function(a, c, e, f) {
        this.linear1.SetV(a);
        this.angular1 = c;
        this.linear2.SetV(e);
        this.angular2 = f
    },Compute: function(a, c, e, f) {
        return this.linear1.x * a.x + this.linear1.y * a.y + this.angular1 * c + (this.linear2.x * e.x + this.linear2.y * e.y) + this.angular2 * f
    },initialize: function() {
        this.linear1 = new b2Vec2;
        this.linear2 = new b2Vec2
    }};
var b2GearJoint = Class.create();
Object.extend(b2GearJoint.prototype, b2Joint.prototype);
Object.extend(b2GearJoint.prototype, {GetAnchor1: function() {
        var a = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y))
    },GetAnchor2: function() {
        var a = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (a.col1.y * this.m_localAnchor2.x + a.col2.y * 
        this.m_localAnchor2.y))
    },GetReactionForce: function(a) {
        return new b2Vec2
    },GetReactionTorque: function(a) {
        return 0
    },GetRatio: function() {
        return this.m_ratio
    },initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.m_groundAnchor1 = new b2Vec2;
        this.m_groundAnchor2 = new b2Vec2;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_J = new b2Jacobian;
        this.m_prismatic2 = this.m_revolute2 = this.m_prismatic1 = this.m_revolute1 = null;
        var c, e;
        this.m_ground1 = a.joint1.m_body1;
        this.m_body1 = a.joint1.m_body2;
        a.joint1.m_type == b2Joint.e_revoluteJoint ? (this.m_revolute1 = a.joint1, this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1), this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2), c = this.m_revolute1.GetJointAngle()) : (this.m_prismatic1 = a.joint1, this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1), 
        this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2), c = this.m_prismatic1.GetJointTranslation());
        this.m_ground2 = a.joint2.m_body1;
        this.m_body2 = a.joint2.m_body2;
        a.joint2.m_type == b2Joint.e_revoluteJoint ? (this.m_revolute2 = a.joint2, this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1), this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2), e = this.m_revolute2.GetJointAngle()) : (this.m_prismatic2 = a.joint2, this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1), this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2), 
        e = this.m_prismatic2.GetJointTranslation());
        this.m_ratio = a.ratio;
        this.m_constant = c + this.m_ratio * e;
        this.m_impulse = 0
    },PrepareVelocitySolver: function() {
        var a = this.m_ground1, c = this.m_ground2, e = this.m_body1, f = this.m_body2, g, h, k, l = 0;
        this.m_J.SetZero();
        this.m_revolute1 ? (this.m_J.angular1 = -1, l += e.m_invI) : (k = a.m_R, g = this.m_prismatic1.m_localXAxis1, a = k.col1.x * g.x + k.col2.x * g.y, g = k.col1.y * g.x + k.col2.y * g.y, k = e.m_R, h = k.col1.x * this.m_localAnchor1.x + k.col2.x * this.m_localAnchor1.y, k = k.col1.y * this.m_localAnchor1.x + 
        k.col2.y * this.m_localAnchor1.y, h = h * g - k * a, this.m_J.linear1.Set(-a, -g), this.m_J.angular1 = -h, l += e.m_invMass + e.m_invI * h * h);
        this.m_revolute2 ? (this.m_J.angular2 = -this.m_ratio, l += this.m_ratio * this.m_ratio * f.m_invI) : (k = c.m_R, g = this.m_prismatic2.m_localXAxis1, a = k.col1.x * g.x + k.col2.x * g.y, g = k.col1.y * g.x + k.col2.y * g.y, k = f.m_R, h = k.col1.x * this.m_localAnchor2.x + k.col2.x * this.m_localAnchor2.y, k = k.col1.y * this.m_localAnchor2.x + k.col2.y * this.m_localAnchor2.y, h = h * g - k * a, this.m_J.linear2.Set(-this.m_ratio * a, -this.m_ratio * 
        g), this.m_J.angular2 = -this.m_ratio * h, l += this.m_ratio * this.m_ratio * (f.m_invMass + f.m_invI * h * h));
        this.m_mass = 1 / l;
        e.m_linearVelocity.x += e.m_invMass * this.m_impulse * this.m_J.linear1.x;
        e.m_linearVelocity.y += e.m_invMass * this.m_impulse * this.m_J.linear1.y;
        e.m_angularVelocity += e.m_invI * this.m_impulse * this.m_J.angular1;
        f.m_linearVelocity.x += f.m_invMass * this.m_impulse * this.m_J.linear2.x;
        f.m_linearVelocity.y += f.m_invMass * this.m_impulse * this.m_J.linear2.y;
        f.m_angularVelocity += f.m_invI * this.m_impulse * this.m_J.angular2
    },
    SolveVelocityConstraints: function(a) {
        a = this.m_body1;
        var c = this.m_body2, e = this.m_J.Compute(a.m_linearVelocity, a.m_angularVelocity, c.m_linearVelocity, c.m_angularVelocity), e = -this.m_mass * e;
        this.m_impulse += e;
        a.m_linearVelocity.x += a.m_invMass * e * this.m_J.linear1.x;
        a.m_linearVelocity.y += a.m_invMass * e * this.m_J.linear1.y;
        a.m_angularVelocity += a.m_invI * e * this.m_J.angular1;
        c.m_linearVelocity.x += c.m_invMass * e * this.m_J.linear2.x;
        c.m_linearVelocity.y += c.m_invMass * e * this.m_J.linear2.y;
        c.m_angularVelocity += c.m_invI * 
        e * this.m_J.angular2
    },SolvePositionConstraints: function() {
        var a = this.m_body1, c = this.m_body2, e, f;
        e = this.m_revolute1 ? this.m_revolute1.GetJointAngle() : this.m_prismatic1.GetJointTranslation();
        f = this.m_revolute2 ? this.m_revolute2.GetJointAngle() : this.m_prismatic2.GetJointTranslation();
        e = -this.m_mass * (this.m_constant - (e + this.m_ratio * f));
        a.m_position.x += a.m_invMass * e * this.m_J.linear1.x;
        a.m_position.y += a.m_invMass * e * this.m_J.linear1.y;
        a.m_rotation += a.m_invI * e * this.m_J.angular1;
        c.m_position.x += c.m_invMass * e * 
        this.m_J.linear2.x;
        c.m_position.y += c.m_invMass * e * this.m_J.linear2.y;
        c.m_rotation += c.m_invI * e * this.m_J.angular2;
        a.m_R.Set(a.m_rotation);
        c.m_R.Set(c.m_rotation);
        return 0 < b2Settings.b2_linearSlop
    },m_ground1: null,m_ground2: null,m_revolute1: null,m_prismatic1: null,m_revolute2: null,m_prismatic2: null,m_groundAnchor1: new b2Vec2,m_groundAnchor2: new b2Vec2,m_localAnchor1: new b2Vec2,m_localAnchor2: new b2Vec2,m_J: new b2Jacobian,m_constant: null,m_ratio: null,m_mass: null,m_impulse: null});
var b2GearJointDef = Class.create();
Object.extend(b2GearJointDef.prototype, b2JointDef.prototype);
Object.extend(b2GearJointDef.prototype, {initialize: function() {
        this.type = b2Joint.e_gearJoint;
        this.joint2 = this.joint1 = null;
        this.ratio = 1
    },joint1: null,joint2: null,ratio: null});
var b2MouseJoint = Class.create();
Object.extend(b2MouseJoint.prototype, b2Joint.prototype);
Object.extend(b2MouseJoint.prototype, {GetAnchor1: function() {
        return this.m_target
    },GetAnchor2: function() {
        var a = b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor);
        a.Add(this.m_body2.m_position);
        return a
    },GetReactionForce: function(a) {
        var c = new b2Vec2;
        c.SetV(this.m_impulse);
        c.Multiply(a);
        return c
    },GetReactionTorque: function(a) {
        return 0
    },SetTarget: function(a) {
        this.m_body2.WakeUp();
        this.m_target = a
    },initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = 
        this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.K = new b2Mat22;
        this.K1 = new b2Mat22;
        this.K2 = new b2Mat22;
        this.m_localAnchor = new b2Vec2;
        this.m_target = new b2Vec2;
        this.m_impulse = new b2Vec2;
        this.m_ptpMass = new b2Mat22;
        this.m_C = new b2Vec2;
        this.m_target.SetV(a.target);
        var c = this.m_target.x - this.m_body2.m_position.x, e = this.m_target.y - this.m_body2.m_position.y;
        this.m_localAnchor.x = c * this.m_body2.m_R.col1.x + 
        e * this.m_body2.m_R.col1.y;
        this.m_localAnchor.y = c * this.m_body2.m_R.col2.x + e * this.m_body2.m_R.col2.y;
        this.m_maxForce = a.maxForce;
        this.m_impulse.SetZero();
        var e = this.m_body2.m_mass, f = 2 * b2Settings.b2_pi * a.frequencyHz, c = 2 * e * a.dampingRatio * f, e = e * f * f;
        this.m_gamma = 1 / (c + a.timeStep * e);
        this.m_beta = a.timeStep * e / (c + a.timeStep * e)
    },K: new b2Mat22,K1: new b2Mat22,K2: new b2Mat22,PrepareVelocitySolver: function() {
        var a = this.m_body2, c;
        c = a.m_R;
        var e = c.col1.x * this.m_localAnchor.x + c.col2.x * this.m_localAnchor.y;
        c = c.col1.y * 
        this.m_localAnchor.x + c.col2.y * this.m_localAnchor.y;
        var f = a.m_invMass, g = a.m_invI;
        this.K1.col1.x = f;
        this.K1.col2.x = 0;
        this.K1.col1.y = 0;
        this.K1.col2.y = f;
        this.K2.col1.x = g * c * c;
        this.K2.col2.x = -g * e * c;
        this.K2.col1.y = -g * e * c;
        this.K2.col2.y = g * e * e;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.col1.x += this.m_gamma;
        this.K.col2.y += this.m_gamma;
        this.K.Invert(this.m_ptpMass);
        this.m_C.x = a.m_position.x + e - this.m_target.x;
        this.m_C.y = a.m_position.y + c - this.m_target.y;
        a.m_angularVelocity *= 0.98;
        var h = this.m_impulse.x, k = 
        this.m_impulse.y;
        a.m_linearVelocity.x += f * h;
        a.m_linearVelocity.y += f * k;
        a.m_angularVelocity += g * (e * k - c * h)
    },SolveVelocityConstraints: function(a) {
        var c = this.m_body2, e;
        e = c.m_R;
        var f = e.col1.x * this.m_localAnchor.x + e.col2.x * this.m_localAnchor.y, g = e.col1.y * this.m_localAnchor.x + e.col2.y * this.m_localAnchor.y, h = c.m_linearVelocity.x + -c.m_angularVelocity * g, k = c.m_linearVelocity.y + c.m_angularVelocity * f;
        e = this.m_ptpMass;
        var h = h + this.m_beta * a.inv_dt * this.m_C.x + this.m_gamma * this.m_impulse.x, l = k + this.m_beta * a.inv_dt * this.m_C.y + 
        this.m_gamma * this.m_impulse.y, k = -(e.col1.x * h + e.col2.x * l), l = -(e.col1.y * h + e.col2.y * l);
        e = this.m_impulse.x;
        h = this.m_impulse.y;
        this.m_impulse.x += k;
        this.m_impulse.y += l;
        k = this.m_impulse.Length();
        k > a.dt * this.m_maxForce && this.m_impulse.Multiply(a.dt * this.m_maxForce / k);
        k = this.m_impulse.x - e;
        l = this.m_impulse.y - h;
        c.m_linearVelocity.x += c.m_invMass * k;
        c.m_linearVelocity.y += c.m_invMass * l;
        c.m_angularVelocity += c.m_invI * (f * l - g * k)
    },SolvePositionConstraints: function() {
        return !0
    },m_localAnchor: new b2Vec2,m_target: new b2Vec2,
    m_impulse: new b2Vec2,m_ptpMass: new b2Mat22,m_C: new b2Vec2,m_maxForce: null,m_beta: null,m_gamma: null});
var b2MouseJointDef = Class.create();
Object.extend(b2MouseJointDef.prototype, b2JointDef.prototype);
Object.extend(b2MouseJointDef.prototype, {initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.target = new b2Vec2;
        this.type = b2Joint.e_mouseJoint;
        this.maxForce = 0;
        this.frequencyHz = 5;
        this.dampingRatio = 0.7;
        this.timeStep = 1 / 60
    },target: new b2Vec2,maxForce: null,frequencyHz: null,dampingRatio: null,timeStep: null});
var b2PrismaticJoint = Class.create();
Object.extend(b2PrismaticJoint.prototype, b2Joint.prototype);
Object.extend(b2PrismaticJoint.prototype, {GetAnchor1: function() {
        var a = this.m_body1, c = new b2Vec2;
        c.SetV(this.m_localAnchor1);
        c.MulM(a.m_R);
        c.Add(a.m_position);
        return c
    },GetAnchor2: function() {
        var a = this.m_body2, c = new b2Vec2;
        c.SetV(this.m_localAnchor2);
        c.MulM(a.m_R);
        c.Add(a.m_position);
        return c
    },GetJointTranslation: function() {
        var a = this.m_body1, c = this.m_body2, e;
        e = a.m_R;
        var f = e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y, g = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
        e = c.m_R;
        f = c.m_position.x + (e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y) - (a.m_position.x + f);
        c = c.m_position.y + (e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y) - (a.m_position.y + g);
        e = a.m_R;
        return (e.col1.x * this.m_localXAxis1.x + e.col2.x * this.m_localXAxis1.y) * f + (e.col1.y * this.m_localXAxis1.x + e.col2.y * this.m_localXAxis1.y) * c
    },GetJointSpeed: function() {
        var a = this.m_body1, c = this.m_body2, e;
        e = a.m_R;
        var f = e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y, g = e.col1.y * this.m_localAnchor1.x + 
        e.col2.y * this.m_localAnchor1.y;
        e = c.m_R;
        var h = e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y, k = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y, l = c.m_position.x + h - (a.m_position.x + f), m = c.m_position.y + k - (a.m_position.y + g);
        e = a.m_R;
        var n = e.col1.x * this.m_localXAxis1.x + e.col2.x * this.m_localXAxis1.y;
        e = e.col1.y * this.m_localXAxis1.x + e.col2.y * this.m_localXAxis1.y;
        var p = a.m_linearVelocity, q = c.m_linearVelocity, a = a.m_angularVelocity, c = c.m_angularVelocity;
        return l * -a * e + m * a * n + (n * (q.x + 
        -c * k - p.x - -a * g) + e * (q.y + c * h - p.y - a * f))
    },GetMotorForce: function(a) {
        return a * this.m_motorImpulse
    },SetMotorSpeed: function(a) {
        this.m_motorSpeed = a
    },SetMotorForce: function(a) {
        this.m_maxMotorForce = a
    },GetReactionForce: function(a) {
        a *= this.m_limitImpulse;
        var c;
        c = this.m_body1.m_R;
        return new b2Vec2(a * (c.col1.x * this.m_localXAxis1.x + c.col2.x * this.m_localXAxis1.y) + a * (c.col1.x * this.m_localYAxis1.x + c.col2.x * this.m_localYAxis1.y), a * (c.col1.y * this.m_localXAxis1.x + c.col2.y * this.m_localXAxis1.y) + a * (c.col1.y * this.m_localYAxis1.x + 
        c.col2.y * this.m_localYAxis1.y))
    },GetReactionTorque: function(a) {
        return a * this.m_angularImpulse
    },initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_localXAxis1 = new b2Vec2;
        this.m_localYAxis1 = new b2Vec2;
        this.m_linearJacobian = 
        new b2Jacobian;
        this.m_motorJacobian = new b2Jacobian;
        var c, e, f;
        c = this.m_body1.m_R;
        e = a.anchorPoint.x - this.m_body1.m_position.x;
        f = a.anchorPoint.y - this.m_body1.m_position.y;
        this.m_localAnchor1.Set(e * c.col1.x + f * c.col1.y, e * c.col2.x + f * c.col2.y);
        c = this.m_body2.m_R;
        e = a.anchorPoint.x - this.m_body2.m_position.x;
        f = a.anchorPoint.y - this.m_body2.m_position.y;
        this.m_localAnchor2.Set(e * c.col1.x + f * c.col1.y, e * c.col2.x + f * c.col2.y);
        c = this.m_body1.m_R;
        e = a.axis.x;
        f = a.axis.y;
        this.m_localXAxis1.Set(e * c.col1.x + f * c.col1.y, e * 
        c.col2.x + f * c.col2.y);
        this.m_localYAxis1.x = -this.m_localXAxis1.y;
        this.m_localYAxis1.y = this.m_localXAxis1.x;
        this.m_initialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
        this.m_linearJacobian.SetZero();
        this.m_angularImpulse = this.m_angularMass = this.m_linearImpulse = this.m_linearMass = 0;
        this.m_motorJacobian.SetZero();
        this.m_limitPositionImpulse = this.m_limitImpulse = this.m_motorImpulse = this.m_motorMass = 0;
        this.m_lowerTranslation = a.lowerTranslation;
        this.m_upperTranslation = a.upperTranslation;
        this.m_maxMotorForce = 
        a.motorForce;
        this.m_motorSpeed = a.motorSpeed;
        this.m_enableLimit = a.enableLimit;
        this.m_enableMotor = a.enableMotor
    },PrepareVelocitySolver: function() {
        var a = this.m_body1, c = this.m_body2, e;
        e = a.m_R;
        var f = e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y, g = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
        e = c.m_R;
        var h = e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y, k = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y, l = a.m_invMass, m = c.m_invMass, n = a.m_invI, p = 
        c.m_invI;
        e = a.m_R;
        var q = e.col1.x * this.m_localYAxis1.x + e.col2.x * this.m_localYAxis1.y;
        e = e.col1.y * this.m_localYAxis1.x + e.col2.y * this.m_localYAxis1.y;
        var r = c.m_position.x + h - a.m_position.x, s = c.m_position.y + k - a.m_position.y;
        this.m_linearJacobian.linear1.x = -q;
        this.m_linearJacobian.linear1.y = -e;
        this.m_linearJacobian.linear2.x = q;
        this.m_linearJacobian.linear2.y = e;
        this.m_linearJacobian.angular1 = -(r * e - s * q);
        this.m_linearJacobian.angular2 = h * e - k * q;
        this.m_linearMass = l + n * this.m_linearJacobian.angular1 * this.m_linearJacobian.angular1 + 
        m + p * this.m_linearJacobian.angular2 * this.m_linearJacobian.angular2;
        this.m_linearMass = 1 / this.m_linearMass;
        this.m_angularMass = 1 / (n + p);
        if (this.m_enableLimit || this.m_enableMotor)
            e = a.m_R, q = e.col1.x * this.m_localXAxis1.x + e.col2.x * this.m_localXAxis1.y, e = e.col1.y * this.m_localXAxis1.x + e.col2.y * this.m_localXAxis1.y, this.m_motorJacobian.linear1.x = -q, this.m_motorJacobian.linear1.y = -e, this.m_motorJacobian.linear2.x = q, this.m_motorJacobian.linear2.y = e, this.m_motorJacobian.angular1 = -(r * e - s * q), this.m_motorJacobian.angular2 = 
            h * e - k * q, this.m_motorMass = l + n * this.m_motorJacobian.angular1 * this.m_motorJacobian.angular1 + m + p * this.m_motorJacobian.angular2 * this.m_motorJacobian.angular2, this.m_motorMass = 1 / this.m_motorMass, this.m_enableLimit && (f = q * (r - f) + e * (s - g), b2Math.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2Settings.b2_linearSlop ? this.m_limitState = b2Joint.e_equalLimits : f <= this.m_lowerTranslation ? (this.m_limitState != b2Joint.e_atLowerLimit && (this.m_limitImpulse = 0), this.m_limitState = b2Joint.e_atLowerLimit) : f >= this.m_upperTranslation ? 
            (this.m_limitState != b2Joint.e_atUpperLimit && (this.m_limitImpulse = 0), this.m_limitState = b2Joint.e_atUpperLimit) : (this.m_limitState = b2Joint.e_inactiveLimit, this.m_limitImpulse = 0));
        !1 == this.m_enableMotor && (this.m_motorImpulse = 0);
        !1 == this.m_enableLimit && (this.m_limitImpulse = 0);
        b2World.s_enableWarmStarting ? (f = this.m_linearImpulse * this.m_linearJacobian.linear1.y + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear1.y, g = this.m_linearImpulse * this.m_linearJacobian.linear2.x + (this.m_motorImpulse + 
        this.m_limitImpulse) * this.m_motorJacobian.linear2.x, h = this.m_linearImpulse * this.m_linearJacobian.linear2.y + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear2.y, k = this.m_linearImpulse * this.m_linearJacobian.angular1 - this.m_angularImpulse + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.angular1, r = this.m_linearImpulse * this.m_linearJacobian.angular2 + this.m_angularImpulse + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.angular2, a.m_linearVelocity.x += l * (this.m_linearImpulse * 
        this.m_linearJacobian.linear1.x + (this.m_motorImpulse + this.m_limitImpulse) * this.m_motorJacobian.linear1.x), a.m_linearVelocity.y += l * f, a.m_angularVelocity += n * k, c.m_linearVelocity.x += m * g, c.m_linearVelocity.y += m * h, c.m_angularVelocity += p * r) : this.m_motorImpulse = this.m_limitImpulse = this.m_angularImpulse = this.m_linearImpulse = 0;
        this.m_limitPositionImpulse = 0
    },SolveVelocityConstraints: function(a) {
        var c = this.m_body1, e = this.m_body2, f = c.m_invMass, g = e.m_invMass, h = c.m_invI, k = e.m_invI, l = this.m_linearJacobian.Compute(c.m_linearVelocity, 
        c.m_angularVelocity, e.m_linearVelocity, e.m_angularVelocity), l = -this.m_linearMass * l;
        this.m_linearImpulse += l;
        c.m_linearVelocity.x += f * l * this.m_linearJacobian.linear1.x;
        c.m_linearVelocity.y += f * l * this.m_linearJacobian.linear1.y;
        c.m_angularVelocity += h * l * this.m_linearJacobian.angular1;
        e.m_linearVelocity.x += g * l * this.m_linearJacobian.linear2.x;
        e.m_linearVelocity.y += g * l * this.m_linearJacobian.linear2.y;
        e.m_angularVelocity += k * l * this.m_linearJacobian.angular2;
        l = -this.m_angularMass * (e.m_angularVelocity - c.m_angularVelocity);
        this.m_angularImpulse += l;
        c.m_angularVelocity -= h * l;
        e.m_angularVelocity += k * l;
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            var l = this.m_motorJacobian.Compute(c.m_linearVelocity, c.m_angularVelocity, e.m_linearVelocity, e.m_angularVelocity) - this.m_motorSpeed, l = -this.m_motorMass * l, m = this.m_motorImpulse;
            this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + l, -a.dt * this.m_maxMotorForce, a.dt * this.m_maxMotorForce);
            l = this.m_motorImpulse - m;
            c.m_linearVelocity.x += f * l * this.m_motorJacobian.linear1.x;
            c.m_linearVelocity.y += f * l * this.m_motorJacobian.linear1.y;
            c.m_angularVelocity += h * l * this.m_motorJacobian.angular1;
            e.m_linearVelocity.x += g * l * this.m_motorJacobian.linear2.x;
            e.m_linearVelocity.y += g * l * this.m_motorJacobian.linear2.y;
            e.m_angularVelocity += k * l * this.m_motorJacobian.angular2
        }
        this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit && (a = this.m_motorJacobian.Compute(c.m_linearVelocity, c.m_angularVelocity, e.m_linearVelocity, e.m_angularVelocity), l = -this.m_motorMass * a, this.m_limitState == b2Joint.e_equalLimits ? 
        this.m_limitImpulse += l : this.m_limitState == b2Joint.e_atLowerLimit ? (a = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + l, 0), l = this.m_limitImpulse - a) : this.m_limitState == b2Joint.e_atUpperLimit && (a = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + l, 0), l = this.m_limitImpulse - a), c.m_linearVelocity.x += f * l * this.m_motorJacobian.linear1.x, c.m_linearVelocity.y += f * l * this.m_motorJacobian.linear1.y, c.m_angularVelocity += h * l * this.m_motorJacobian.angular1, e.m_linearVelocity.x += 
        g * l * this.m_motorJacobian.linear2.x, e.m_linearVelocity.y += g * l * this.m_motorJacobian.linear2.y, e.m_angularVelocity += k * l * this.m_motorJacobian.angular2)
    },SolvePositionConstraints: function() {
        var a, c, e = this.m_body1, f = this.m_body2, g = e.m_invMass, h = f.m_invMass, k = e.m_invI, l = f.m_invI;
        a = e.m_R;
        var m = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y, n = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        a = f.m_R;
        var p = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        a = a.col1.y * this.m_localAnchor2.x + 
        a.col2.y * this.m_localAnchor2.y;
        var m = e.m_position.x + m, n = e.m_position.y + n, p = f.m_position.x + p, q = f.m_position.y + a;
        a = e.m_R;
        var r = (a.col1.x * this.m_localYAxis1.x + a.col2.x * this.m_localYAxis1.y) * (p - m) + (a.col1.y * this.m_localYAxis1.x + a.col2.y * this.m_localYAxis1.y) * (q - n), r = b2Math.b2Clamp(r, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        c = -this.m_linearMass * r;
        e.m_position.x += g * c * this.m_linearJacobian.linear1.x;
        e.m_position.y += g * c * this.m_linearJacobian.linear1.y;
        e.m_rotation += k * c * this.m_linearJacobian.angular1;
        f.m_position.x += h * c * this.m_linearJacobian.linear2.x;
        f.m_position.y += h * c * this.m_linearJacobian.linear2.y;
        f.m_rotation += l * c * this.m_linearJacobian.angular2;
        r = b2Math.b2Abs(r);
        c = f.m_rotation - e.m_rotation - this.m_initialAngle;
        c = b2Math.b2Clamp(c, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
        var s = -this.m_angularMass * c;
        e.m_rotation -= e.m_invI * s;
        e.m_R.Set(e.m_rotation);
        f.m_rotation += f.m_invI * s;
        f.m_R.Set(f.m_rotation);
        s = b2Math.b2Abs(c);
        this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit && 
        (a = e.m_R, m = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y, n = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y, a = f.m_R, p = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y, a = a.col1.y * this.m_localAnchor2.x + a.col2.y * this.m_localAnchor2.y, m = e.m_position.x + m, n = e.m_position.y + n, p = f.m_position.x + p, q = f.m_position.y + a, a = e.m_R, m = (a.col1.x * this.m_localXAxis1.x + a.col2.x * this.m_localXAxis1.y) * (p - m) + (a.col1.y * this.m_localXAxis1.x + a.col2.y * this.m_localXAxis1.y) * (q - n), a = 0, this.m_limitState == 
        b2Joint.e_equalLimits ? (a = b2Math.b2Clamp(m, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection), a *= -this.m_motorMass, r = b2Math.b2Max(r, b2Math.b2Abs(c))) : this.m_limitState == b2Joint.e_atLowerLimit ? (a = m - this.m_lowerTranslation, r = b2Math.b2Max(r, -a), a = b2Math.b2Clamp(a + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), a *= -this.m_motorMass, c = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + a, 0), a = this.m_limitPositionImpulse - c) : this.m_limitState == 
        b2Joint.e_atUpperLimit && (a = m - this.m_upperTranslation, r = b2Math.b2Max(r, a), a = b2Math.b2Clamp(a - b2Settings.b2_linearSlop, 0, b2Settings.b2_maxLinearCorrection), a *= -this.m_motorMass, c = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + a, 0), a = this.m_limitPositionImpulse - c), e.m_position.x += g * a * this.m_motorJacobian.linear1.x, e.m_position.y += g * a * this.m_motorJacobian.linear1.y, e.m_rotation += k * a * this.m_motorJacobian.angular1, e.m_R.Set(e.m_rotation), f.m_position.x += 
        h * a * this.m_motorJacobian.linear2.x, f.m_position.y += h * a * this.m_motorJacobian.linear2.y, f.m_rotation += l * a * this.m_motorJacobian.angular2, f.m_R.Set(f.m_rotation));
        return r <= b2Settings.b2_linearSlop && s <= b2Settings.b2_angularSlop
    },m_localAnchor1: new b2Vec2,m_localAnchor2: new b2Vec2,m_localXAxis1: new b2Vec2,m_localYAxis1: new b2Vec2,m_initialAngle: null,m_linearJacobian: new b2Jacobian,m_linearMass: null,m_linearImpulse: null,m_angularMass: null,m_angularImpulse: null,m_motorJacobian: new b2Jacobian,m_motorMass: null,
    m_motorImpulse: null,m_limitImpulse: null,m_limitPositionImpulse: null,m_lowerTranslation: null,m_upperTranslation: null,m_maxMotorForce: null,m_motorSpeed: null,m_enableLimit: null,m_enableMotor: null,m_limitState: 0});
var b2PrismaticJointDef = Class.create();
Object.extend(b2PrismaticJointDef.prototype, b2JointDef.prototype);
Object.extend(b2PrismaticJointDef.prototype, {initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.type = b2Joint.e_prismaticJoint;
        this.anchorPoint = new b2Vec2(0, 0);
        this.axis = new b2Vec2(0, 0);
        this.motorSpeed = this.motorForce = this.upperTranslation = this.lowerTranslation = 0;
        this.enableMotor = this.enableLimit = !1
    },anchorPoint: null,axis: null,lowerTranslation: null,upperTranslation: null,motorForce: null,motorSpeed: null,enableLimit: null,enableMotor: null});
var b2PulleyJoint = Class.create();
Object.extend(b2PulleyJoint.prototype, b2Joint.prototype);
Object.extend(b2PulleyJoint.prototype, {GetAnchor1: function() {
        var a = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y))
    },GetAnchor2: function() {
        var a = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (a.col1.y * this.m_localAnchor2.x + a.col2.y * 
        this.m_localAnchor2.y))
    },GetGroundPoint1: function() {
        return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor1.x, this.m_ground.m_position.y + this.m_groundAnchor1.y)
    },GetGroundPoint2: function() {
        return new b2Vec2(this.m_ground.m_position.x + this.m_groundAnchor2.x, this.m_ground.m_position.y + this.m_groundAnchor2.y)
    },GetReactionForce: function(a) {
        return new b2Vec2
    },GetReactionTorque: function(a) {
        return 0
    },GetLength1: function() {
        var a;
        a = this.m_body1.m_R;
        var c = this.m_body1.m_position.x + (a.col1.x * this.m_localAnchor1.x + 
        a.col2.x * this.m_localAnchor1.y) - (this.m_ground.m_position.x + this.m_groundAnchor1.x);
        a = this.m_body1.m_position.y + (a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y) - (this.m_ground.m_position.y + this.m_groundAnchor1.y);
        return Math.sqrt(c * c + a * a)
    },GetLength2: function() {
        var a;
        a = this.m_body2.m_R;
        var c = this.m_body2.m_position.x + (a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y) - (this.m_ground.m_position.x + this.m_groundAnchor2.x);
        a = this.m_body2.m_position.y + (a.col1.y * this.m_localAnchor2.x + 
        a.col2.y * this.m_localAnchor2.y) - (this.m_ground.m_position.y + this.m_groundAnchor2.y);
        return Math.sqrt(c * c + a * a)
    },GetRatio: function() {
        return this.m_ratio
    },initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.m_groundAnchor1 = new b2Vec2;
        this.m_groundAnchor2 = new b2Vec2;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_u1 = new b2Vec2;
        this.m_u2 = new b2Vec2;
        var c, e, f;
        this.m_ground = this.m_body1.m_world.m_groundBody;
        this.m_groundAnchor1.x = a.groundPoint1.x - this.m_ground.m_position.x;
        this.m_groundAnchor1.y = a.groundPoint1.y - this.m_ground.m_position.y;
        this.m_groundAnchor2.x = a.groundPoint2.x - this.m_ground.m_position.x;
        this.m_groundAnchor2.y = a.groundPoint2.y - this.m_ground.m_position.y;
        c = this.m_body1.m_R;
        e = a.anchorPoint1.x - this.m_body1.m_position.x;
        f = a.anchorPoint1.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = e * c.col1.x + f * c.col1.y;
        this.m_localAnchor1.y = e * c.col2.x + f * c.col2.y;
        c = this.m_body2.m_R;
        e = a.anchorPoint2.x - this.m_body2.m_position.x;
        f = a.anchorPoint2.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = e * c.col1.x + f * c.col1.y;
        this.m_localAnchor2.y = e * c.col2.x + f * c.col2.y;
        this.m_ratio = a.ratio;
        e = a.groundPoint1.x - a.anchorPoint1.x;
        f = a.groundPoint1.y - a.anchorPoint1.y;
        c = Math.sqrt(e * e + f * f);
        e = a.groundPoint2.x - a.anchorPoint2.x;
        f = a.groundPoint2.y - a.anchorPoint2.y;
        e = Math.sqrt(e * e + f * f);
        f = b2Math.b2Max(0.5 * 
        b2PulleyJoint.b2_minPulleyLength, c);
        e = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, e);
        this.m_constant = f + this.m_ratio * e;
        this.m_maxLength1 = b2Math.b2Clamp(a.maxLength1, f, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
        this.m_maxLength2 = b2Math.b2Clamp(a.maxLength2, e, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
        this.m_limitImpulse2 = this.m_limitImpulse1 = this.m_pulleyImpulse = 0
    },PrepareVelocitySolver: function() {
        var a = this.m_body1, c = this.m_body2, e;
        e = a.m_R;
        var f = e.col1.x * 
        this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y, g = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
        e = c.m_R;
        var h = e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y;
        e = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y;
        var k = c.m_position.x + h, l = c.m_position.y + e, m = this.m_ground.m_position.x + this.m_groundAnchor2.x, n = this.m_ground.m_position.y + this.m_groundAnchor2.y;
        this.m_u1.Set(a.m_position.x + f - (this.m_ground.m_position.x + this.m_groundAnchor1.x), a.m_position.y + 
        g - (this.m_ground.m_position.y + this.m_groundAnchor1.y));
        this.m_u2.Set(k - m, l - n);
        k = this.m_u1.Length();
        l = this.m_u2.Length();
        k > b2Settings.b2_linearSlop ? this.m_u1.Multiply(1 / k) : this.m_u1.SetZero();
        l > b2Settings.b2_linearSlop ? this.m_u2.Multiply(1 / l) : this.m_u2.SetZero();
        k < this.m_maxLength1 ? (this.m_limitState1 = b2Joint.e_inactiveLimit, this.m_limitImpulse1 = 0) : (this.m_limitState1 = b2Joint.e_atUpperLimit, this.m_limitPositionImpulse1 = 0);
        l < this.m_maxLength2 ? (this.m_limitState2 = b2Joint.e_inactiveLimit, this.m_limitImpulse2 = 
        0) : (this.m_limitState2 = b2Joint.e_atUpperLimit, this.m_limitPositionImpulse2 = 0);
        k = f * this.m_u1.y - g * this.m_u1.x;
        l = h * this.m_u2.y - e * this.m_u2.x;
        this.m_limitMass1 = a.m_invMass + a.m_invI * k * k;
        this.m_limitMass2 = c.m_invMass + c.m_invI * l * l;
        this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
        this.m_limitMass1 = 1 / this.m_limitMass1;
        this.m_limitMass2 = 1 / this.m_limitMass2;
        this.m_pulleyMass = 1 / this.m_pulleyMass;
        k = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.x;
        l = (-this.m_pulleyImpulse - 
        this.m_limitImpulse1) * this.m_u1.y;
        m = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.x;
        n = (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) * this.m_u2.y;
        a.m_linearVelocity.x += a.m_invMass * k;
        a.m_linearVelocity.y += a.m_invMass * l;
        a.m_angularVelocity += a.m_invI * (f * l - g * k);
        c.m_linearVelocity.x += c.m_invMass * m;
        c.m_linearVelocity.y += c.m_invMass * n;
        c.m_angularVelocity += c.m_invI * (h * n - e * m)
    },SolveVelocityConstraints: function(a) {
        a = this.m_body1;
        var c = this.m_body2, e;
        e = a.m_R;
        var f = e.col1.x * this.m_localAnchor1.x + 
        e.col2.x * this.m_localAnchor1.y, g = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
        e = c.m_R;
        var h = e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y;
        e = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y;
        var k, l, m, n;
        k = a.m_linearVelocity.x + -a.m_angularVelocity * g;
        l = a.m_linearVelocity.y + a.m_angularVelocity * f;
        m = c.m_linearVelocity.x + -c.m_angularVelocity * e;
        n = c.m_linearVelocity.y + c.m_angularVelocity * h;
        k = -(this.m_u1.x * k + this.m_u1.y * l) - this.m_ratio * (this.m_u2.x * m + this.m_u2.y * 
        n);
        n = -this.m_pulleyMass * k;
        this.m_pulleyImpulse += n;
        k = -n * this.m_u1.x;
        l = -n * this.m_u1.y;
        m = -this.m_ratio * n * this.m_u2.x;
        n = -this.m_ratio * n * this.m_u2.y;
        a.m_linearVelocity.x += a.m_invMass * k;
        a.m_linearVelocity.y += a.m_invMass * l;
        a.m_angularVelocity += a.m_invI * (f * l - g * k);
        c.m_linearVelocity.x += c.m_invMass * m;
        c.m_linearVelocity.y += c.m_invMass * n;
        c.m_angularVelocity += c.m_invI * (h * n - e * m);
        this.m_limitState1 == b2Joint.e_atUpperLimit && (k = a.m_linearVelocity.x + -a.m_angularVelocity * g, l = a.m_linearVelocity.y + a.m_angularVelocity * 
        f, k = -(this.m_u1.x * k + this.m_u1.y * l), n = -this.m_limitMass1 * k, k = this.m_limitImpulse1, this.m_limitImpulse1 = b2Math.b2Max(0, this.m_limitImpulse1 + n), n = this.m_limitImpulse1 - k, k = -n * this.m_u1.x, l = -n * this.m_u1.y, a.m_linearVelocity.x += a.m_invMass * k, a.m_linearVelocity.y += a.m_invMass * l, a.m_angularVelocity += a.m_invI * (f * l - g * k));
        this.m_limitState2 == b2Joint.e_atUpperLimit && (m = c.m_linearVelocity.x + -c.m_angularVelocity * e, n = c.m_linearVelocity.y + c.m_angularVelocity * h, k = -(this.m_u2.x * m + this.m_u2.y * n), n = -this.m_limitMass2 * 
        k, k = this.m_limitImpulse2, this.m_limitImpulse2 = b2Math.b2Max(0, this.m_limitImpulse2 + n), n = this.m_limitImpulse2 - k, m = -n * this.m_u2.x, n = -n * this.m_u2.y, c.m_linearVelocity.x += c.m_invMass * m, c.m_linearVelocity.y += c.m_invMass * n, c.m_angularVelocity += c.m_invI * (h * n - e * m))
    },SolvePositionConstraints: function() {
        var a = this.m_body1, c = this.m_body2, e, f = this.m_ground.m_position.x + this.m_groundAnchor1.x, g = this.m_ground.m_position.y + this.m_groundAnchor1.y, h = this.m_ground.m_position.x + this.m_groundAnchor2.x, k = this.m_ground.m_position.y + 
        this.m_groundAnchor2.y, l, m, n, p, q, r, s, t = 0;
        e = a.m_R;
        l = e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y;
        m = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
        e = c.m_R;
        n = e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y;
        e = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y;
        p = a.m_position.x + l;
        q = a.m_position.y + m;
        r = c.m_position.x + n;
        s = c.m_position.y + e;
        this.m_u1.Set(p - f, q - g);
        this.m_u2.Set(r - h, s - k);
        p = this.m_u1.Length();
        q = this.m_u2.Length();
        p > b2Settings.b2_linearSlop ? 
        this.m_u1.Multiply(1 / p) : this.m_u1.SetZero();
        q > b2Settings.b2_linearSlop ? this.m_u2.Multiply(1 / q) : this.m_u2.SetZero();
        p = this.m_constant - p - this.m_ratio * q;
        t = b2Math.b2Max(t, Math.abs(p));
        p = b2Math.b2Clamp(p, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        s = -this.m_pulleyMass * p;
        p = -s * this.m_u1.x;
        q = -s * this.m_u1.y;
        r = -this.m_ratio * s * this.m_u2.x;
        s = -this.m_ratio * s * this.m_u2.y;
        a.m_position.x += a.m_invMass * p;
        a.m_position.y += a.m_invMass * q;
        a.m_rotation += a.m_invI * (l * q - m * p);
        c.m_position.x += c.m_invMass * 
        r;
        c.m_position.y += c.m_invMass * s;
        c.m_rotation += c.m_invI * (n * s - e * r);
        a.m_R.Set(a.m_rotation);
        c.m_R.Set(c.m_rotation);
        this.m_limitState1 == b2Joint.e_atUpperLimit && (e = a.m_R, l = e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y, m = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y, p = a.m_position.x + l, q = a.m_position.y + m, this.m_u1.Set(p - f, q - g), p = this.m_u1.Length(), p > b2Settings.b2_linearSlop ? (this.m_u1.x *= 1 / p, this.m_u1.y *= 1 / p) : this.m_u1.SetZero(), p = this.m_maxLength1 - p, t = b2Math.b2Max(t, -p), 
        p = b2Math.b2Clamp(p + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), s = -this.m_limitMass1 * p, f = this.m_limitPositionImpulse1, this.m_limitPositionImpulse1 = b2Math.b2Max(0, this.m_limitPositionImpulse1 + s), s = this.m_limitPositionImpulse1 - f, p = -s * this.m_u1.x, q = -s * this.m_u1.y, a.m_position.x += a.m_invMass * p, a.m_position.y += a.m_invMass * q, a.m_rotation += a.m_invI * (l * q - m * p), a.m_R.Set(a.m_rotation));
        this.m_limitState2 == b2Joint.e_atUpperLimit && (e = c.m_R, n = e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y, 
        e = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y, r = c.m_position.x + n, s = c.m_position.y + e, this.m_u2.Set(r - h, s - k), q = this.m_u2.Length(), q > b2Settings.b2_linearSlop ? (this.m_u2.x *= 1 / q, this.m_u2.y *= 1 / q) : this.m_u2.SetZero(), p = this.m_maxLength2 - q, t = b2Math.b2Max(t, -p), p = b2Math.b2Clamp(p + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0), s = -this.m_limitMass2 * p, f = this.m_limitPositionImpulse2, this.m_limitPositionImpulse2 = b2Math.b2Max(0, this.m_limitPositionImpulse2 + s), s = this.m_limitPositionImpulse2 - 
        f, r = -s * this.m_u2.x, s = -s * this.m_u2.y, c.m_position.x += c.m_invMass * r, c.m_position.y += c.m_invMass * s, c.m_rotation += c.m_invI * (n * s - e * r), c.m_R.Set(c.m_rotation));
        return t < b2Settings.b2_linearSlop
    },m_ground: null,m_groundAnchor1: new b2Vec2,m_groundAnchor2: new b2Vec2,m_localAnchor1: new b2Vec2,m_localAnchor2: new b2Vec2,m_u1: new b2Vec2,m_u2: new b2Vec2,m_constant: null,m_ratio: null,m_maxLength1: null,m_maxLength2: null,m_pulleyMass: null,m_limitMass1: null,m_limitMass2: null,m_pulleyImpulse: null,m_limitImpulse1: null,
    m_limitImpulse2: null,m_limitPositionImpulse1: null,m_limitPositionImpulse2: null,m_limitState1: 0,m_limitState2: 0});
b2PulleyJoint.b2_minPulleyLength = b2Settings.b2_lengthUnitsPerMeter;
var b2PulleyJointDef = Class.create();
Object.extend(b2PulleyJointDef.prototype, b2JointDef.prototype);
Object.extend(b2PulleyJointDef.prototype, {initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.groundPoint1 = new b2Vec2;
        this.groundPoint2 = new b2Vec2;
        this.anchorPoint1 = new b2Vec2;
        this.anchorPoint2 = new b2Vec2;
        this.type = b2Joint.e_pulleyJoint;
        this.groundPoint1.Set(-1, 1);
        this.groundPoint2.Set(1, 1);
        this.anchorPoint1.Set(-1, 0);
        this.anchorPoint2.Set(1, 0);
        this.maxLength1 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
        this.maxLength2 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
        this.ratio = 1;
        this.collideConnected = !0
    },groundPoint1: new b2Vec2,groundPoint2: new b2Vec2,anchorPoint1: new b2Vec2,anchorPoint2: new b2Vec2,maxLength1: null,maxLength2: null,ratio: null});
var b2RevoluteJoint = Class.create();
Object.extend(b2RevoluteJoint.prototype, b2Joint.prototype);
Object.extend(b2RevoluteJoint.prototype, {GetAnchor1: function() {
        var a = this.m_body1.m_R;
        return new b2Vec2(this.m_body1.m_position.x + (a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y), this.m_body1.m_position.y + (a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y))
    },GetAnchor2: function() {
        var a = this.m_body2.m_R;
        return new b2Vec2(this.m_body2.m_position.x + (a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y), this.m_body2.m_position.y + (a.col1.y * this.m_localAnchor2.x + a.col2.y * 
        this.m_localAnchor2.y))
    },GetJointAngle: function() {
        return this.m_body2.m_rotation - this.m_body1.m_rotation
    },GetJointSpeed: function() {
        return this.m_body2.m_angularVelocity - this.m_body1.m_angularVelocity
    },GetMotorTorque: function(a) {
        return a * this.m_motorImpulse
    },SetMotorSpeed: function(a) {
        this.m_motorSpeed = a
    },SetMotorTorque: function(a) {
        this.m_maxMotorTorque = a
    },GetReactionForce: function(a) {
        var c = this.m_ptpImpulse.Copy();
        c.Multiply(a);
        return c
    },GetReactionTorque: function(a) {
        return a * this.m_limitImpulse
    },
    initialize: function(a) {
        this.m_node1 = new b2JointNode;
        this.m_node2 = new b2JointNode;
        this.m_type = a.type;
        this.m_next = this.m_prev = null;
        this.m_body1 = a.body1;
        this.m_body2 = a.body2;
        this.m_collideConnected = a.collideConnected;
        this.m_islandFlag = !1;
        this.m_userData = a.userData;
        this.K = new b2Mat22;
        this.K1 = new b2Mat22;
        this.K2 = new b2Mat22;
        this.K3 = new b2Mat22;
        this.m_localAnchor1 = new b2Vec2;
        this.m_localAnchor2 = new b2Vec2;
        this.m_ptpImpulse = new b2Vec2;
        this.m_ptpMass = new b2Mat22;
        var c, e, f;
        c = this.m_body1.m_R;
        e = a.anchorPoint.x - 
        this.m_body1.m_position.x;
        f = a.anchorPoint.y - this.m_body1.m_position.y;
        this.m_localAnchor1.x = e * c.col1.x + f * c.col1.y;
        this.m_localAnchor1.y = e * c.col2.x + f * c.col2.y;
        c = this.m_body2.m_R;
        e = a.anchorPoint.x - this.m_body2.m_position.x;
        f = a.anchorPoint.y - this.m_body2.m_position.y;
        this.m_localAnchor2.x = e * c.col1.x + f * c.col1.y;
        this.m_localAnchor2.y = e * c.col2.x + f * c.col2.y;
        this.m_intialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
        this.m_ptpImpulse.Set(0, 0);
        this.m_limitPositionImpulse = this.m_limitImpulse = this.m_motorImpulse = 
        0;
        this.m_lowerAngle = a.lowerAngle;
        this.m_upperAngle = a.upperAngle;
        this.m_maxMotorTorque = a.motorTorque;
        this.m_motorSpeed = a.motorSpeed;
        this.m_enableLimit = a.enableLimit;
        this.m_enableMotor = a.enableMotor
    },K: new b2Mat22,K1: new b2Mat22,K2: new b2Mat22,K3: new b2Mat22,PrepareVelocitySolver: function() {
        var a = this.m_body1, c = this.m_body2, e;
        e = a.m_R;
        var f = e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y, g = e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
        e = c.m_R;
        var h = e.col1.x * this.m_localAnchor2.x + 
        e.col2.x * this.m_localAnchor2.y;
        e = e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y;
        var k = a.m_invMass, l = c.m_invMass, m = a.m_invI, n = c.m_invI;
        this.K1.col1.x = k + l;
        this.K1.col2.x = 0;
        this.K1.col1.y = 0;
        this.K1.col2.y = k + l;
        this.K2.col1.x = m * g * g;
        this.K2.col2.x = -m * f * g;
        this.K2.col1.y = -m * f * g;
        this.K2.col2.y = m * f * f;
        this.K3.col1.x = n * e * e;
        this.K3.col2.x = -n * h * e;
        this.K3.col1.y = -n * h * e;
        this.K3.col2.y = n * h * h;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        this.K.Invert(this.m_ptpMass);
        this.m_motorMass = 
        1 / (m + n);
        !1 == this.m_enableMotor && (this.m_motorImpulse = 0);
        if (this.m_enableLimit) {
            var p = c.m_rotation - a.m_rotation - this.m_intialAngle;
            b2Math.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * b2Settings.b2_angularSlop ? this.m_limitState = b2Joint.e_equalLimits : p <= this.m_lowerAngle ? (this.m_limitState != b2Joint.e_atLowerLimit && (this.m_limitImpulse = 0), this.m_limitState = b2Joint.e_atLowerLimit) : p >= this.m_upperAngle ? (this.m_limitState != b2Joint.e_atUpperLimit && (this.m_limitImpulse = 0), this.m_limitState = b2Joint.e_atUpperLimit) : 
            (this.m_limitState = b2Joint.e_inactiveLimit, this.m_limitImpulse = 0)
        } else
            this.m_limitImpulse = 0;
        b2World.s_enableWarmStarting ? (a.m_linearVelocity.x -= k * this.m_ptpImpulse.x, a.m_linearVelocity.y -= k * this.m_ptpImpulse.y, a.m_angularVelocity -= m * (f * this.m_ptpImpulse.y - g * this.m_ptpImpulse.x + this.m_motorImpulse + this.m_limitImpulse), c.m_linearVelocity.x += l * this.m_ptpImpulse.x, c.m_linearVelocity.y += l * this.m_ptpImpulse.y, c.m_angularVelocity += n * (h * this.m_ptpImpulse.y - e * this.m_ptpImpulse.x + this.m_motorImpulse + this.m_limitImpulse)) : 
        (this.m_ptpImpulse.SetZero(), this.m_limitImpulse = this.m_motorImpulse = 0);
        this.m_limitPositionImpulse = 0
    },SolveVelocityConstraints: function(a) {
        var c = this.m_body1, e = this.m_body2, f;
        f = c.m_R;
        var g = f.col1.x * this.m_localAnchor1.x + f.col2.x * this.m_localAnchor1.y, h = f.col1.y * this.m_localAnchor1.x + f.col2.y * this.m_localAnchor1.y;
        f = e.m_R;
        var k = f.col1.x * this.m_localAnchor2.x + f.col2.x * this.m_localAnchor2.y;
        f = f.col1.y * this.m_localAnchor2.x + f.col2.y * this.m_localAnchor2.y;
        var l = e.m_linearVelocity.x + -e.m_angularVelocity * 
        f - c.m_linearVelocity.x - -c.m_angularVelocity * h, m = e.m_linearVelocity.y + e.m_angularVelocity * k - c.m_linearVelocity.y - c.m_angularVelocity * g, n = -(this.m_ptpMass.col1.x * l + this.m_ptpMass.col2.x * m), l = -(this.m_ptpMass.col1.y * l + this.m_ptpMass.col2.y * m);
        this.m_ptpImpulse.x += n;
        this.m_ptpImpulse.y += l;
        c.m_linearVelocity.x -= c.m_invMass * n;
        c.m_linearVelocity.y -= c.m_invMass * l;
        c.m_angularVelocity -= c.m_invI * (g * l - h * n);
        e.m_linearVelocity.x += e.m_invMass * n;
        e.m_linearVelocity.y += e.m_invMass * l;
        e.m_angularVelocity += e.m_invI * 
        (k * l - f * n);
        this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits && (g = -this.m_motorMass * (e.m_angularVelocity - c.m_angularVelocity - this.m_motorSpeed), h = this.m_motorImpulse, this.m_motorImpulse = b2Math.b2Clamp(this.m_motorImpulse + g, -a.dt * this.m_maxMotorTorque, a.dt * this.m_maxMotorTorque), g = this.m_motorImpulse - h, c.m_angularVelocity -= c.m_invI * g, e.m_angularVelocity += e.m_invI * g);
        this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit && (g = -this.m_motorMass * (e.m_angularVelocity - c.m_angularVelocity), 
        this.m_limitState == b2Joint.e_equalLimits ? this.m_limitImpulse += g : this.m_limitState == b2Joint.e_atLowerLimit ? (a = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + g, 0), g = this.m_limitImpulse - a) : this.m_limitState == b2Joint.e_atUpperLimit && (a = this.m_limitImpulse, this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + g, 0), g = this.m_limitImpulse - a), c.m_angularVelocity -= c.m_invI * g, e.m_angularVelocity += e.m_invI * g)
    },SolvePositionConstraints: function() {
        var a, c = this.m_body1, e = this.m_body2, f = 
        0, f = c.m_R, g = f.col1.x * this.m_localAnchor1.x + f.col2.x * this.m_localAnchor1.y, h = f.col1.y * this.m_localAnchor1.x + f.col2.y * this.m_localAnchor1.y, f = e.m_R;
        a = f.col1.x * this.m_localAnchor2.x + f.col2.x * this.m_localAnchor2.y;
        var k = f.col1.y * this.m_localAnchor2.x + f.col2.y * this.m_localAnchor2.y, l = e.m_position.x + a - (c.m_position.x + g), m = e.m_position.y + k - (c.m_position.y + h), f = Math.sqrt(l * l + m * m), n = c.m_invMass, p = e.m_invMass, q = c.m_invI, r = e.m_invI;
        this.K1.col1.x = n + p;
        this.K1.col2.x = 0;
        this.K1.col1.y = 0;
        this.K1.col2.y = n + p;
        this.K2.col1.x = 
        q * h * h;
        this.K2.col2.x = -q * g * h;
        this.K2.col1.y = -q * g * h;
        this.K2.col2.y = q * g * g;
        this.K3.col1.x = r * k * k;
        this.K3.col2.x = -r * a * k;
        this.K3.col1.y = -r * a * k;
        this.K3.col2.y = r * a * a;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        this.K.Solve(b2RevoluteJoint.tImpulse, -l, -m);
        l = b2RevoluteJoint.tImpulse.x;
        m = b2RevoluteJoint.tImpulse.y;
        c.m_position.x -= c.m_invMass * l;
        c.m_position.y -= c.m_invMass * m;
        c.m_rotation -= c.m_invI * (g * m - h * l);
        c.m_R.Set(c.m_rotation);
        e.m_position.x += e.m_invMass * l;
        e.m_position.y += e.m_invMass * m;
        e.m_rotation += 
        e.m_invI * (a * m - k * l);
        e.m_R.Set(e.m_rotation);
        g = 0;
        this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit && (a = e.m_rotation - c.m_rotation - this.m_intialAngle, h = 0, this.m_limitState == b2Joint.e_equalLimits ? (a = b2Math.b2Clamp(a, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection), h = -this.m_motorMass * a, g = b2Math.b2Abs(a)) : this.m_limitState == b2Joint.e_atLowerLimit ? (a -= this.m_lowerAngle, g = b2Math.b2Max(0, -a), a = b2Math.b2Clamp(a + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 
        0), h = -this.m_motorMass * a, a = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + h, 0), h = this.m_limitPositionImpulse - a) : this.m_limitState == b2Joint.e_atUpperLimit && (a -= this.m_upperAngle, g = b2Math.b2Max(0, a), a = b2Math.b2Clamp(a - b2Settings.b2_angularSlop, 0, b2Settings.b2_maxAngularCorrection), h = -this.m_motorMass * a, a = this.m_limitPositionImpulse, this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + h, 0), h = this.m_limitPositionImpulse - a), c.m_rotation -= 
        c.m_invI * h, c.m_R.Set(c.m_rotation), e.m_rotation += e.m_invI * h, e.m_R.Set(e.m_rotation));
        return f <= b2Settings.b2_linearSlop && g <= b2Settings.b2_angularSlop
    },m_localAnchor1: new b2Vec2,m_localAnchor2: new b2Vec2,m_ptpImpulse: new b2Vec2,m_motorImpulse: null,m_limitImpulse: null,m_limitPositionImpulse: null,m_ptpMass: new b2Mat22,m_motorMass: null,m_intialAngle: null,m_lowerAngle: null,m_upperAngle: null,m_maxMotorTorque: null,m_motorSpeed: null,m_enableLimit: null,m_enableMotor: null,m_limitState: 0});
b2RevoluteJoint.tImpulse = new b2Vec2;
var b2RevoluteJointDef = Class.create();
Object.extend(b2RevoluteJointDef.prototype, b2JointDef.prototype);
Object.extend(b2RevoluteJointDef.prototype, {initialize: function() {
        this.type = b2Joint.e_unknownJoint;
        this.body2 = this.body1 = this.userData = null;
        this.collideConnected = !1;
        this.type = b2Joint.e_revoluteJoint;
        this.anchorPoint = new b2Vec2(0, 0);
        this.motorSpeed = this.motorTorque = this.upperAngle = this.lowerAngle = 0;
        this.enableMotor = this.enableLimit = !1
    },anchorPoint: null,lowerAngle: null,upperAngle: null,motorTorque: null,motorSpeed: null,enableLimit: null,enableMotor: null});
function drawWorld(a, c) {
    for (var e = a.m_jointList; e; e = e.m_next)
        drawJoint(a, e, c);
    for (e = a.m_bodyList; e; e = e.m_next)
        for (var f = e.GetShapeList(); null != f; f = f.GetNext())
            drawShape(f, c)
}
function drawJoint(a, c, e, f) {
    var g = c.m_body1, h = c.m_body2, k = g.m_position, l = h.m_position, m = c.GetAnchor1(), n = c.GetAnchor2();
    f || (f = "#00f");
    switch (c.m_type) {
        case b2Joint.e_distanceJoint:
            e.drawLine(m.x, m.y, n.x, n.y, 1, f);
            break;
        case b2Joint.e_pulleyJoint:
            break;
        default:
            g == a.m_groundBody ? e.drawLine(m.x, m.y, l.x, l.y, 1, f) : h == a.m_groundBody ? e.drawLine(m.x, m.y, k.x, k.y, 1, f) : (e.drawLine(k.x, k.y, m.x, m.y, 1, f), e.drawLine(m.x, m.y, l.x, l.y, 1, f), e.drawLine(l.x, l.y, n.x, n.y, 1, f))
    }
}
function drawShape(a, c) {
    switch (a.m_type) {
        case b2Shape.e_circleShape:
            for (var e = a.m_position, f = a.m_radius, g = 0, h = 2 * Math.PI / 16, k = e.x + f, l = e.y, m = 0; 16 > m; m++) {
                var n = new b2Vec2(f * Math.cos(g), f * Math.sin(g)), n = b2Math.AddVV(e, n);
                c.drawLine(k, l, n.x, n.y, 1, "#33f");
                k = n.x;
                l = n.y;
                g += h
            }
            c.drawLine(k, l, e.x + f, e.y, 1, "#33f");
            k = a.m_R.col1;
            f = new b2Vec2(e.x + f * k.x, e.y + f * k.y);
            c.drawLine(e.x, e.y, f.x, f.y, 1, "#33f");
            break;
        case b2Shape.e_polyShape:
            e = b2Math.AddVV(a.m_position, b2Math.b2MulMV(a.m_R, a.m_vertices[0]));
            k = e.x;
            l = e.y;
            for (m = 
            0; m < a.m_vertexCount; m++)
                n = b2Math.AddVV(a.m_position, b2Math.b2MulMV(a.m_R, a.m_vertices[m])), c.drawLine(k, l, n.x, n.y, 1, "#fff"), k = n.x, l = n.y;
            c.drawLine(k, l, e.x, e.y, 1, "#fff")
    }
}
function SimpleText(a, c, e) {
    this.ALIGN_LEFT = 0;
    this.ALIGN_RIGHT = 1;
    this.ALIGN_CENTER = 2;
    this.font = a;
    this.y = this.x = 0;
    this.width = c;
    this.height = e;
    this.align = this.ALIGN_LEFT;
    this.charSpacing = this.rotation = 0;
    this.scale = 1;
    this.static = !1;
    this.charMap = "0123456789".split("");
    this.charWidth = [];
    this.sprites = [];
    this.text = "";
    this.manageSprites = function(a) {
        var c, e = a.length, k = this.sprites.length;
        if (k < e)
            for (a = 0; a < e - k; a++)
                c = new Sprite(this.font, this.width, this.height, this.charMap.length), this.sprites.push(c), stage.addChild(c);
        if (k > e) {
            for (a = 0; a < k - e; a++)
                stage.removeChild(this.sprites[a]);
            this.sprites.splice(0, k - e)
        }
    };
    this.getCharIx = function(a) {
        for (var c = 0; c < this.charMap.length; c++)
            if (this.charMap[c] == a)
                return c;
        return -1
    };
    this.getCharWidth = function(a) {
        a = this.getCharIx(a);
        return 0 <= a ? this.charWidth[a] ? this.charWidth[a] : this.width : this.width
    };
    this.getWidth = function() {
        for (var a = 0, c = 0; c < this.text.length; c++)
            a += this.getCharWidth(this.text.substr(c, 1)) + this.charSpacing;
        return a
    };
    this.write = function(a) {
        var c, e, k, l;
        this.text = a += "";
        this.manageSprites(a);
        c = this.x;
        this.align == this.ALIGN_CENTER && (c = this.x - this.getWidth() / 2 * this.scale + this.getCharWidth(this.text.substr(0, 1)) / 2);
        this.align == this.ALIGN_RIGHT && (c = this.x - this.getWidth() * this.scale);
        k = new Vector(c - this.x, 0);
        k.rotate(-this.rotation);
        c = k.x + this.x;
        e = k.y + this.y;
        k = new Vector(0, 0);
        for (var m = 0; m < a.length; m++)
            if (this.sprites[m].visible = !0, l = this.charMap.indexOf(a.substr(m, 1)), 0 > l)
                this.sprites[m].visible = !1;
            else {
                var n = this.getCharWidth(this.text.substr(m, 1));
                this.sprites[m].scaleX = 
                this.sprites[m].scaleY = this.scale;
                this.sprites[m].gotoAndStop(l);
                l = k.clone();
                l.x *= this.scale;
                l.rotate(-this.rotation);
                this.sprites[m].x = l.x + ("," == this.text.substr(m, 1) ? c - n / 2 : c);
                this.sprites[m].y = l.y + e;
                this.sprites[m].rotation = this.rotation;
                this.sprites[m].static = this.static;
                k.x += n + this.charSpacing
            }
    };
    this.refresh = function() {
        this.write(this.text)
    };
    this.addToGroup = function(a) {
        for (var c = 0; c < this.sprites.length; c++)
            this.sprites[c].gx = this.sprites[c].x / 2, this.sprites[c].gy = this.sprites[c].y, a.addChild(this.sprites[c], 
            !1)
    }
}
function AudioPlayer() {
    var a = this;
    this.disabled = !1;
    this.basePath = "";
    this.mp3Support = !0;
    this.delayPlay = !1;
    this.audioWrapper = null;
    this.busy = this.locked = !1;
    this.startPlayTime = 0;
    this.onend = null;
    this.createNewAudio = function() {
        if (AudioMixer.isWebAudioSupport()) {
            var a = AudioMixer.waContext.createBufferSource();
            a.connect(AudioMixer.waContext.destination);
            return a
        }
        return document.createElement("audio")
    };
    this.init = function(a) {
        this.basePath = a ? a : "";
        this.delayPlay = "ontouchstart" in window;
        this.audioWrapper = this.createNewAudio();
        a = document.createElement("audio");
        a.canPlayType ? this.mp3Support = "" != a.canPlayType("audio/mpeg") : this.disabled = !0;
        return !this.disabled
    };
    this.play = function(a, e) {
        if (this.disabled)
            return !1;
        var f = this.basePath + "/" + a + (this.mp3Support ? ".mp3" : ".ogg");
        this.stop();
        this.audioWrapper = this.createNewAudio();
        this.audioWrapper.doLoop = e ? !0 : !1;
        this.audioWrapper.fileName = a;
        if (AudioMixer.isWebAudioSupport()) {
            var g = this;
            this.loadSound(f, function(a) {
                g.audioWrapper.buffer = a;
                try {
                    g.audioWrapper.noteOn(0);
                }
                catch(err) {
                    console.log(err);
                }
                g.startPlayTime = (new Date).getTime();
                g.audioWrapper.loop = e;
                g.waCheckInterval = setInterval(function() {
                    g.audioWrapper ? g.audioWrapper.playbackState == g.audioWrapper.FINISHED_STATE && g.controlPlay() : clearInterval(g.waCheckInterval)
                }, 100)
            })
        } else
            this.audioWrapper.src = f, this.audioWrapper.type = this.mp3Support ? "audio/mpeg" : "audio/ogg", this.audioWrapper.loop = !1, this.audioWrapper.preload = "auto", this.audioWrapper.load(), this.delayPlay ? this.audioWrapper.addEventListener("canplay", this.readyToPlay) : this.audioWrapper.play(), this.audioWrapper.addEventListener("ended", 
            this.controlPlay, !1);
        this.busy = !0;
        this.startPlayTime = (new Date).getTime()
    };
    this.loadSound = function(a, e) {
        if (AudioMixer.buffer[a])
            e && e(AudioMixer.buffer[a]);
        else {
            var f = new XMLHttpRequest;
            f.open("GET", a, !0);
            f.responseType = "arraybuffer";
            f.onload = function() {
                AudioMixer.waContext.decodeAudioData(this.response, function(f) {
                    AudioMixer.buffer[a] = f;
                    e && e(f)
                })
            };
            f.send()
        }
    };
    this.readyToPlay = function(a) {
        a.currentTarget.play()
    };
    this.stop = function() {
        this.busy = !1;
        try {
            AudioMixer.isWebAudioSupport() ? this.audioWrapper.noteOff(0) : 
            (this.audioWrapper.removeEventListener("canplay", this.readyToPlay), this.audioWrapper.pause(), this.audioWrapper.currentTime = 0), this.audioWrapper = null
        } catch (a) {
        }
    };
    this.pause = function() {
        AudioMixer.isWebAudioSupport() ? a.audioWrapper && a.audioWrapper.disconnect() : this.audioWrapper.pause()
    };
    this.resume = function() {
        AudioMixer.isWebAudioSupport() ? a.audioWrapper && a.audioWrapper.connect(AudioMixer.waContext.destination) : this.audioWrapper.play()
    };
    this.controlPlay = function() {
        if (a.audioWrapper.doLoop)
            AudioMixer.isWebAudioSupport() || 
            (a.stop(), a.play(a.audioWrapper.fileName, !0));
        else {
            a.busy = !1;
            if ("function" == typeof a.onend)
                a.onend();
            this.waCheckInterval && clearInterval(this.waCheckInterval)
        }
    };
    this.getPosition = function() {
        if (AudioMixer.isWebAudioSupport()) {
            if (!this.startPlayTime)
                return 0;
            var a = this.getDuration();
            if (!a)
                return 0;
            var e = ((new Date).getTime() - this.startPlayTime) / 1E3;
            return e <= a ? e : this.audioWrapper.doLoop ? e - Math.floor(e / a) * a : a
        }
        return this.audioWrapper.currentTime ? this.audioWrapper.currentTime : 0
    };
    this.getDuration = function() {
        return AudioMixer.isWebAudioSupport() ? 
        this.audioWrapper.buffer ? this.audioWrapper.buffer.duration : 0 : this.audioWrapper.duration ? this.audioWrapper.duration : 0
    }
}



function AudioMixer(a, c) {
    this.singleChannelMode = !1;
    this.channels = [];
    this.init = function(a, c) {
        if (AudioMixer.isWebAudioSupport()) {
            AudioMixer.waContext = new webkitAudioContext;
            var g = AudioMixer.waContext.createBuffer(1, 1, 22050);
            sound = AudioMixer.waContext.createBufferSource();
            sound.buffer = g;
            sound.connect(AudioMixer.waContext.destination);
            try {
                sound.noteOn(0);
            }
            catch(err) {
                console.log(err);
            }
        }
        AudioMixer.isWebAudioSupport() || -1 == navigator.userAgent.toLowerCase().indexOf("mac") || (this.singleChannelMode = !0, c = 1);
        this.path = a;
        this.channels = [];
        for (g = 
        0; g < c; g++)
            this.channels[g] = new AudioPlayer, this.channels[g].init(a);
        var h, k;
        "undefined" !== typeof document.hidden ? (h = "hidden", k = "visibilitychange") : "undefined" !== typeof document.mozHidden ? (h = "mozHidden", k = "mozvisibilitychange") : "undefined" !== typeof document.msHidden ? (h = "msHidden", k = "msvisibilitychange") : "undefined" !== typeof document.webkitHidden && (h = "webkitHidden", k = "webkitvisibilitychange");
        var l = this;
        document.addEventListener(k, function() {
            if (document[h])
                for (var a = 0; a < l.channels.length; a++)
                    l.channels[a].pause();
            else
                for (a = 0; a < l.channels.length; a++)
                    l.channels[a].resume()
        }, !1)
    };
    this.play = function(a, c, g, h) {
        var k = -1, k = "number" == typeof h ? h : this.getFreeChannel(g);
        0 <= k && k < this.channels.length && (this.channels[k].stop(), this.channels[k].play(a, c));
        return this.channels[k]
    };
    this.stop = function(a) {
        0 <= a && a < this.channels.length && this.channels[a].stop()
    };
    this.getFreeChannel = function(a) {
        for (var c = -1, g = [], h = -1, k = -1, l = 0, m = 0; m < this.channels.length; m++)
            this.channels[m].locked || (this.channels[m].busy ? (l = (new Date).getTime(), 
            l -= this.channels[m].startPlayTime, l > k && (k = l, h = m)) : g.push(m));
        0 == g.length ? !a && 0 <= h && (c = h) : c = g[0];
        return c
    };
    this.init(a, c)
}
AudioMixer.isWebAudioSupport = function() {
    return "webkitAudioContext" in window
};
AudioMixer.buffer = {};
AudioMixer.waContext = null;
function SpritesGroup(a) {
    var c = this;
    this.stage = a;
    this.rotation = this.y = this.x = 0;
    this.opacity = this.scaleY = this.scaleX = 1;
    this.sprites = [];
    this.addChild = function(a, c) {
        "undefined" == typeof a.gscaleX && (a.gscaleX = 1);
        "undefined" == typeof a.gscaleY && (a.gscaleY = 1);
        "undefined" == typeof a.grotation && (a.grotation = 0);
        "undefined" == typeof a.gopacity && (a.gopacity = 1);
        this.sprites.push(a);
        c && this.stage.addChild(a);
        this.update()
    };
    this.removeChild = function(a, c) {
        this.sprites = Utils.removeFromArray(this.sprites, a);
        c && (a.destroy = 
        !0)
    };
    this.remove = function() {
        for (var a = 0; a < this.sprites.length; a++)
            this.sprites[a].destroy = !0;
        this.sprites = []
    };
    this.update = function() {
        for (var a, f = 0; f < c.sprites.length; f++) {
            a = c.sprites[f];
            var g = a.gx, h = a.gy, k = new Vector(g, h);
            k.rotate(-c.rotation);
            g += k.x;
            h += k.y;
            g *= c.scaleX;
            h *= c.scaleY;
            g += c.x;
            h += c.y;
            a.x = g;
            a.y = h;
            a.scaleX = a.gscaleX * c.scaleX;
            a.scaleY = a.gscaleY * c.scaleY;
            a.rotation = a.grotation + c.rotation;
            a.opacity = a.gopacity * c.opacity
        }
    };
    a.addEventListener("pretick", this.update)
}
function TilesSprite(a, c, e, f, g, h) {
    TilesSprite.superclass.constructor.call(this, a, c, e, g, h);
    this.framesCount = f;
    this.currentFrameX = 0;
    this.gotoAndStop = function(a) {
        this.currentFrameX = a;
        this.stop()
    };
    this.gotoAndPlay = function(a) {
        this.currentFrameX = a;
        this.play()
    };
    this.changeStep = function(a) {
        a = a.target;
        a.animated && a.animStep + 1 >= a.animDelay && (a.currentFrameX++, a.currentFrameX >= a.framesCount && (a.currentFrameX = 0))
    };
    this.sync = function(a) {
        a = a.target;
        a.currentLayer = Math.floor(a.currentFrameX / a.totalFrames);
        a.currentFrame = 
        a.currentFrameX - a.currentLayer * a.totalFrames
    };
    this.addEventListener("enterframe", this.changeStep);
    this.addEventListener("prerender", this.sync)
}
Utils.extend(TilesSprite, Sprite);
var levels = [{objects: [{type: "tube1",x: 20,y: 197,rotation: 0}, {type: "tube2",x: 460,y: 197,rotation: 0}, {type: "invisible_wall_big",x: 62,y: 231,rotation: 0}, {type: "invisible_wall_big",x: 212,y: 231,rotation: 0}, {type: "invisible_wall_big",x: 215,y: 185,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 238,y: 112,rotation: 0}, {type: "invisible_wall_small",x: 266,y: 112,rotation: 0}, {type: "invisible_wall_small",x: 288,y: 137,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 363,y: 231,rotation: 0}, {type: "invisible_wall_small",
                x: 462,y: 231,rotation: 0}, {type: "invisible_wall_big",x: 169,y: 35,rotation: -0.39999999999999997,restitution: 0.4}, {type: "button_red",x: 173,y: 263,rotation: 0}, {type: "trap",x: 270,y: 208,rotation: 0}, {type: "earth_lvl1",x: 165,y: 225,rotation: 0}, {type: "fan",x: 173,y: 152,rotation: 0}, {type: "lever",x: 250,y: 167,rotation: 0}, {type: "tip1",x: 85,y: 112,rotation: 0}, {type: "tip2",x: 360,y: 50,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 29,y: 128,rotation: 0}, {type: "tube2",x: 460,y: 80,rotation: 0}, {type: "invisible_wall_big",
                x: 68,y: 161,rotation: 0}, {type: "invisible_wall_big",x: 500,y: 115,rotation: 0}, {type: "invisible_wall_big",x: 145,y: 161,rotation: 0}, {type: "invisible_wall_small",x: 313,y: 161,rotation: 0}, {type: "invisible_wall_small",x: 329,y: 161,rotation: 0}, {type: "invisible_wall_small",x: 208,y: 178,rotation: 0}, {type: "invisible_wall_small",x: 306,y: 178,rotation: 0}, {type: "invisible_wall_big",x: 404,y: 37,rotation: 0}, {type: "invisible_wall_big",x: 305,y: 37,rotation: 0}, {type: "invisible_wall_small",x: 239,y: 14,rotation: 1.5500000000000007}, 
            {type: "invisible_wall_big",x: 426,y: 190,rotation: 1.5708}, {type: "button_red",x: 449,y: 148,rotation: 0}, {type: "Lift",x: 391,y: 205,rotation: 0}, {type: "btn2",x: 257,y: 35,rotation: 0}, {type: "bridge_lvl2",x: 256,y: 68,rotation: 0}, {type: "ButtonSystem",x: 258,y: 55,rotation: 0}, {type: "bollMc",x: 472,y: 13,rotation: 0}, {type: "Fire",x: 259,y: 249,rotation: 0}, {type: "Neutral1",x: 216,y: 221,rotation: 0}, {type: "Neutral2",x: 293,y: 233,rotation: 0}, {type: "Lvl2_Hint1",x: 135,y: 55,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 153,y: 15,
                rotation: 1.5707963267948966}, {type: "tube2",x: 461,y: 123,rotation: 0}, {type: "invisible_wall_big",x: 83,y: 156,rotation: 0}, {type: "invisible_wall_big",x: 60,y: 142,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 301,y: 156,rotation: 0}, {type: "invisible_wall_big",x: 431,y: 156,rotation: 0}, {type: "invisible_wall_big",x: 156,y: 230,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 228,y: 231,rotation: 1.5707963267948966}, {type: "fence",x: 370,y: 123,rotation: 0}, {type: "btn",x: 80,y: 152,rotation: 0}, {type: "bridge_lvl3",
                x: 176,y: 161,rotation: 0,density: 0,custom: "bridge1"}, {type: "bridge_lvl3",x: 209,y: 161,rotation: 0,density: 0,custom: "bridge2"}, {type: "earth1_lvl3",x: 141,y: 160,rotation: 0}, {type: "earth2_lvl3",x: 242,y: 160,rotation: 0}, {type: "btn_lvl3_red",x: 121.5,y: 183.5,rotation: 0}, {type: "btn_lvl3_red",x: 140.5,y: 208.5,rotation: 0}, {type: "btn_lvl3_green",x: 121.5,y: 232.5,rotation: 0}, {type: "btn_lvl3_red",x: 137.5,y: 259.5,rotation: 0}, {type: "btn_lvl3_red",x: 262,y: 183,rotation: 0}, {type: "btn_lvl3_red",x: 243,y: 208.5,rotation: 0}, {type: "btn_lvl3_red",
                x: 262,y: 232,rotation: 0}, {type: "btn_lvl3_red",x: 246,y: 259,rotation: 0}, {type: "numbers_lvl3",x: 193,y: 221,rotation: 0}, {type: "doors_lvl3",x: 193,y: 222,rotation: 0}, {type: "exit",x: 393,y: 136,rotation: 0}, {type: "terminator_appear",x: 340,y: 141,rotation: 0}, {type: "lava_lvl3",x: 191.5,y: 274,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 19,y: 202,rotation: 0}, {type: "tube2",x: 468,y: 204,rotation: 0}, {type: "invisible_wall_big",x: 440,y: 237,rotation: 0}, {type: "invisible_wall_big",x: 33,y: 237,rotation: 0}, {type: "invisible_wall_big",
                x: 29,y: 114,rotation: 0}, {type: "invisible_wall_big",x: 178,y: 114,rotation: 0}, {type: "lever",x: 130,y: 75,rotation: 0,custom: "no_cover"}, {type: "invisible_wall_big",x: 453,y: 62,rotation: 0}, {type: "invisible_wall_big",x: 454,y: 113,rotation: 0}, {type: "invisible_wall_big",x: 455,y: 165,rotation: 0}, {type: "btn",x: 433,y: 58,rotation: 0}, {type: "btn",x: 433,y: 110,rotation: 0}, {type: "btn",x: 433,y: 162,rotation: 0}, {type: "earth_move",x: 134,y: 346,rotation: 0,custom: "earth1"}, {type: "earth_fixed",x: 186,y: 278,rotation: 0}, {type: "earth_move",
                x: 237,y: 277,rotation: 0,custom: "earth2"}, {type: "earth_fixed",x: 289,y: 278,rotation: 0}, {type: "earth_move",x: 339,y: 346,rotation: 0,custom: "earth3"}, {type: "bridge_lvl4",x: 313,y: 117,rotation: 0}, {type: "hose",x: 210,y: 30,rotation: 0}, {type: "antiant_anim",x: 217,y: 79,rotation: 0}, {type: "log_lvl4",x: 128,y: 139,rotation: 0,custom: 3}, {type: "btn3",x: 163,y: 133,rotation: 0,custom: 1}, {type: "btn3",x: 194,y: 133,rotation: 0,custom: 2}, {type: "btn3",x: 225,y: 133,rotation: 0,custom: 3}],joints: []}, {objects: [{type: "tube1",x: 23,y: 67,
                rotation: 0}, {type: "tube2",x: 456,y: 222,rotation: 0}, {type: "invisible_wall_big",x: 55,y: 101,rotation: 0}, {type: "invisible_wall_big",x: 100,y: 194,rotation: 0}, {type: "invisible_wall_big",x: 250,y: 194,rotation: 0}, {type: "invisible_wall_big",x: 442,y: 194,rotation: 0,custom: "cancelSpeed"}, {type: "invisible_wall_big",x: 447,y: 257,rotation: 0}, {type: "invisible_wall_big",x: 64,y: 190,rotation: 0.35}, {type: "fireball",x: 50,y: 150,rotation: 0}, {type: "moving_fence",x: 83,y: 188,rotation: 0}, {type: "earth2_lvl5",x: 78,y: 202,rotation: 0}, 
            {type: "btn2",x: 184,y: 190,rotation: 0}, {type: "bridge_lvl5",x: 292,y: 262,rotation: 0,density: 0}, {type: "earth1_lvl5",x: 284.5,y: 261,rotation: 0,density: 0}, {type: "lever",x: 286,y: 235,rotation: Math.PI,custom: "no_static"}, {type: "Lvl5_Hint1",x: 240,y: 55,rotation: 0}, {type: "arrow_hint5",x: 125,y: 40,rotation: 0.25}],joints: []}, {objects: [{type: "tube1",x: 15,y: 197,rotation: 0,custom: !0}, {type: "tube2",x: 474,y: 198,rotation: 0}, {type: "invisible_wall_big",x: 60,y: 231.5,rotation: 0}, {type: "invisible_wall_big",x: 135,y: 231.5,rotation: 0}, 
            {type: "invisible_wall_big",x: 132,y: 135.5,rotation: 0}, {type: "invisible_wall_small",x: 182,y: 140.5,rotation: 0}, {type: "invisible_wall_small",x: 182,y: 145.5,rotation: 0}, {type: "invisible_wall_small",x: 182,y: 150.5,rotation: 0}, {type: "invisible_wall_small",x: 303,y: 230,rotation: 0}, {type: "invisible_wall_small",x: 323,y: 230,rotation: 0}, {type: "invisible_wall_big",x: 470,y: 231,rotation: 0}, {type: "invisible_wall_big",x: 397,y: 305,rotation: Math.PI / 2}, {type: "lift_lvl6",x: 243,y: 329,rotation: 0}, {type: "spring_lvl6",x: 27,
                y: 98,rotation: Math.PI / 2}, {type: "btn2",x: 88,y: 135,rotation: 0}, {type: "lever",x: 182,y: 270,rotation: Math.PI / 2}, {type: "bridge_lvl6",x: 371,y: 235,rotation: 0}, {type: "earth_lvl6",x: 313,y: 238,rotation: 0}, {type: "button_red",x: 109,y: 71.5,rotation: 0}, {type: "indicator_lvl6",x: 90,y: 149,rotation: 0,custom: "indicator_left"}, {type: "indicator_lvl6",x: 333,y: 237,rotation: 0,custom: "indicator_right"}, {type: "caterpillar",x: 340,y: 202,rotation: 0}],joints: []}, {objects: [{type: "tube2",x: 460,y: 214,rotation: 0}, {type: "tube1",x: 21,
                y: 143,rotation: 0}, {type: "invisible_wall_small",x: 39,y: 177,rotation: 0}, {type: "invisible_wall_small",x: 61,y: 204,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 139,y: 221,rotation: 0}, {type: "invisible_wall_small",x: 238,y: 221,rotation: 0}, {type: "invisible_wall_big",x: 260,y: 294,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 347,y: 321,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 420,y: 248,rotation: 0}, {type: "lever",x: 387,y: 145,rotation: 1.5707963267948966}, {type: "button_red",
                x: 137,y: 40,rotation: 0}, {type: "magnet",x: 86,y: 76,rotation: 0}, {type: "stripes",x: 86,y: 90,rotation: -0.5}, {type: "stripes",x: 96,y: 86,rotation: -0.5}, {type: "wire_lvl7",x: 91,y: 34,rotation: 0}, {type: "bridge_lvl7",x: 354,y: 217,rotation: 0}, {type: "earth_lvl7",x: 354,y: 277,rotation: 0}, {type: "ball_holder",x: 225,y: 27,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 257,y: 10,rotation: 1.5707963267948966}, {type: "tube2",x: 466,y: 234,rotation: 0}, {type: "invisible_wall_big",x: 267,y: 95,rotation: 0}, {type: "invisible_wall_big",
                x: 438,y: 95,rotation: 0}, {type: "invisible_wall_big",x: 86,y: 206,rotation: 0}, {type: "invisible_wall_big",x: 39,y: 132,rotation: 1.5009831567151233}, {type: "invisible_wall_big",x: 260,y: 264,rotation: 0}, {type: "invisible_wall_big",x: 410,y: 264,rotation: 0}, {type: "invisible_wall_small",x: 205,y: 116,rotation: 1.0500000000000003}, {type: "skeleton",x: 325,y: 155,rotation: 0}, {type: "box_lvl8",x: 320,y: 150,rotation: 0}, {type: "spring_lvl8",x: 171,y: 225,rotation: 1.5707963267948966}, {type: "slider",x: 325,y: 34,rotation: 0}, {type: "Baraban",
                x: 325,y: 103,rotation: 0}, {type: "electricity_10",x: 400,y: 93,rotation: 0}, {type: "button_blue_down",x: 66,y: 86,rotation: 1.5707963267948966,custom: "button_left"}, {type: "button_blue_down",x: 108,y: 85,rotation: -1.5707963267948966,custom: "button_right"}, {type: "button_blue_mid",x: 87,y: 86,rotation: 0}, {type: "button_red",x: 130,y: 235,rotation: 0}, {type: "bridge2_lvl8",x: 118,y: 159,rotation: Math.PI / 6}, {type: "link_lvl8",x: 118,y: 159,rotation: 0}, {type: "bridge_lvl8",x: 204,y: 159,rotation: 0}, {type: "earth_lvl8",x: 210,y: 108,
                rotation: 0}, {type: "link_lvl8",x: 204,y: 122,rotation: 0}, {type: "btn2",x: 46,y: 171,rotation: 1.5707963267948966}],joints: []}, {objects: [{type: "tube1",x: 27,y: 120,rotation: 0}, {type: "tube2",x: 460,y: 169,rotation: 0}, {type: "trampoline",x: 143,y: 256,rotation: 0}, {type: "invisible_wall_big",x: 37,y: 155,rotation: 0}, {type: "invisible_wall_big",x: 111,y: 230,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 446,y: 204,rotation: 0}, {type: "invisible_wall_big",x: 372,y: 278,rotation: 1.5707963267948966}, {type: "lever",x: 282,
                y: 36,rotation: 0}, {type: "bbq",x: 214,y: 70,rotation: 0}, {type: "fly_lvl9",x: 248,y: 78,rotation: 0}, {type: "fly_lvl9",x: 181,y: 78,rotation: 0}, {type: "fire_lvl9",x: 215,y: 107,rotation: 0}, {type: "button_blue_down",x: 38,y: 233,rotation: 1.5707963267948966,custom: "button_left"}, {type: "button_blue_down",x: 79,y: 232,rotation: -1.5707963267948966,custom: "button_right"}, {type: "button_blue_mid",x: 58,y: 233,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 15,y: 105,rotation: 0}, {type: "tube2",x: 467,y: 78,rotation: 0}, {type: "invisible_wall_big",
                x: 60,y: 215,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 37,y: 141,rotation: 0}, {type: "invisible_wall_big",x: 136,y: 120,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 110,y: 45,rotation: 0.05000000000000002}, {type: "invisible_wall_small",x: 69,y: 60,rotation: -0.7500000000000001}, {type: "invisible_wall_small",x: 161,y: 249,rotation: 0}, {type: "invisible_wall_small",x: 179,y: 249,rotation: 0}, {type: "invisible_wall_small",x: 163,y: 193,rotation: 0}, {type: "invisible_wall_small",x: 184,y: 193,rotation: 0}, 
            {type: "invisible_wall_small",x: 184,y: 185,rotation: 0}, {type: "invisible_wall_big",x: 215,y: 100,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 282,y: 13,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 207,y: 23,rotation: 0}, {type: "invisible_wall_big",x: 360,y: 47,rotation: -0.5499999999999999}, {type: "invisible_wall_small",x: 303,y: 84,rotation: -0.05}, {type: "invisible_wall_big",x: 283,y: 238,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 315,y: 238,rotation: 1.5707963267948966}, {type: "invisible_wall_small",
                x: 288,y: 188,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 293,y: 188,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 298,y: 188,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 303,y: 188,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 308,y: 188,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 137,y: 250,rotation: 0}, {type: "invisible_wall_big",x: 286,y: 250,rotation: 0}, {type: "invisible_wall_small",x: 386,y: 250,rotation: 0}, {type: "invisible_wall_big",
                x: 393,y: 185,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 465,y: 113,rotation: 0}, {type: "fan_lvl10",x: 190,y: 10,rotation: 0}, {type: "earth_lvl10",x: 188,y: 15,rotation: 0}, {type: "fan",x: 98,y: 172,rotation: 0,custom: "fan1"}, {type: "fan",x: 245,y: 172,rotation: 0,custom: "fan2"}, {type: "fan",x: 355,y: 172,rotation: 0,custom: "fan3"}, {type: "fan",x: 289,y: 58,rotation: 1.5707963267948966,custom: "fan4"}, {type: "button_blue_down",x: 149,y: 110,rotation: 3.141592653589793,custom: "button_up_no_hint"}, {type: "button_blue_down",
                x: 149,y: 136,rotation: 0,custom: "button_down_no_hint"}, {type: "button_red",x: 30,y: 250,rotation: 0,custom: "button_fan1"}, {type: "button_red",x: 172,y: 272,rotation: 0,custom: "button_fan2"}, {type: "button_red",x: 356,y: 284,rotation: 0,custom: "button_fan3"}, {type: "button_red",x: 148,y: 167,rotation: 0,custom: "button_fan4"}],joints: []}, {objects: [{type: "danger",x: 278,y: 36,rotation: 0}, {type: "btn2",x: 246,y: 273,rotation: 0}, {type: "wall1",x: 14,y: 234,rotation: 0}, {type: "wall2",x: 479,y: 233,rotation: 0}, {type: "tube1",x: 31,y: 112,
                rotation: 0,custom: !0}, {type: "tube2",x: 450,y: 112,rotation: 0}, {type: "invisible_wall_big",x: 53,y: 147,rotation: 0}, {type: "invisible_wall_big",x: 151,y: 258,rotation: 0}, {type: "invisible_wall_small",x: 249,y: 274,rotation: 0}, {type: "invisible_wall_small",x: 224,y: 281,rotation: Math.PI / 2}, {type: "invisible_wall_small",x: 270,y: 281,rotation: Math.PI / 2}, {type: "invisible_wall_big",x: 343,y: 258,rotation: 0}, {type: "invisible_wall_big",x: 442,y: 147,rotation: 0}, {type: "dart",x: 145,y: 41,rotation: 0}, {type: "ant_lvl11",x: 101,y: 40,
                rotation: 0}, {type: "cannon",x: 134,y: 56,rotation: 0}, {type: "button_red",x: 123,y: 70,rotation: 0,custom: "dont_hint"}, {type: "flap",x: 123,y: 70,rotation: 0}, {type: "button_blue_down",x: 332,y: 73,rotation: 0,custom: "button_down"}, {type: "button_blue_down",x: 331,y: 32,rotation: 3.141592653589793,custom: "button_up"}, {type: "button_blue_mid",x: 332,y: 52,rotation: 1.5707963267948966}, {type: "earth_lvl11",x: 240,y: 232,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 21,y: 114,rotation: 0}, {type: "tube2",x: 449,y: 113,rotation: 0}, 
            {type: "invisible_wall_big",x: 45,y: 147,rotation: 0}, {type: "invisible_wall_big",x: 133,y: 269,rotation: 0}, {type: "invisible_wall_small",x: 191,y: 282,rotation: 0}, {type: "invisible_wall_small",x: 288,y: 282,rotation: 0}, {type: "invisible_wall_big",x: 345,y: 273,rotation: 0}, {type: "invisible_wall_big",x: 401,y: 145,rotation: 0}, {type: "invisible_wall_small",x: 452,y: 94,rotation: 0}, {type: "invisible_wall_big",x: 188,y: 53,rotation: 0}, {type: "invisible_wall_small",x: 267,y: 25,rotation: 1.5707963267948966}, {type: "invisible_wall_big",
                x: 344,y: 24,rotation: 0}, {type: "invisible_wall_small",x: 444,y: 24,rotation: 0}, {type: "invisible_wall_small",x: 451,y: 48,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 300,y: 200,rotation: 0}, {type: "invisible_wall_small",x: 328,y: 173,rotation: 1.5707963267948966}, {type: "trap",x: 90,y: 249,rotation: 0}, {type: "electricity_10",x: 290,y: 269,rotation: 0}, {type: "button_blue_left",x: 185,y: 38,rotation: 0,custom: "button_left"}, {type: "button_blue_down",x: 215,y: 38,rotation: 0}, {type: "button_blue_left",x: 243,y: 38,
                rotation: 0,custom: "button_right"}, {type: "lever",x: 81,y: 191,rotation: 0}, {type: "pump_up",x: 376,y: 215,rotation: 0}, {type: "pump_down",x: 377,y: 253,rotation: 0}, {type: "box_lvl12",x: 417,y: 55,rotation: 0}, {type: "crane",x: 417,y: 35,rotation: 0}, {type: "ball1",x: 240,y: 224,rotation: 0}, {type: "basket_invisible",x: 240,y: 273,rotation: 0}],joints: [{type: 0,point1: {x: 212,y: 266}}, {type: 0,point1: {x: 266,y: 266}}]}, {objects: [{type: "tube1",x: 14,y: 189,rotation: 0}, {type: "tube2",x: 470,y: 186,rotation: 0}, {type: "invisible_wall_big",
                x: 59,y: 223,rotation: 0}, {type: "invisible_wall_small",x: 109,y: 240,rotation: 0}, {type: "invisible_wall_small",x: 130,y: 288,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 153,y: 294,rotation: 0}, {type: "invisible_wall_small",x: 158,y: 249,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 178,y: 222,rotation: 0}, {type: "invisible_wall_small",x: 197,y: 222,rotation: 0}, {type: "invisible_wall_big",x: 220,y: 295,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 449,y: 221,rotation: 0}, {type: "invisible_wall_big",
                x: 378,y: 295,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: -50,y: 73,rotation: 0}, {type: "invisible_wall_big",x: 99,y: 73,rotation: 0}, {type: "invisible_wall_big",x: 268,y: 73,rotation: 0}, {type: "invisible_wall_big",x: 375,y: 73,rotation: 0}, {type: "invisible_wall_big",x: 445,y: 47,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 467,y: 119,rotation: 0}, {type: "invisible_wall_small",x: 172,y: 45,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 209,y: 45,rotation: 1.5707963267948966}, {type: "latch1",
                x: 195,y: 80,rotation: 0}, {type: "latch2",x: 123,y: 259,rotation: 0}, {type: "log_lvl13",x: 144,y: 209,rotation: 0}, {type: "btn2",x: 271,y: 76,rotation: 3.141592653589793}, {type: "trolley_play",x: 271,y: 65,rotation: 0}, {type: "button_red",x: 343,y: 53,rotation: 0,custom: "buttonBridge"}, {type: "button_red",x: 423,y: 53,rotation: 0,custom: "buttonSpring"}, {type: "spring_lvl8",x: 429,y: 87,rotation: -1.5707963267948966}, {type: "bridge_lvl13",x: 312,y: 40,rotation: 0}, {type: "trolley",x: 342,y: 230,rotation: 0}, {type: "trolley_play",x: 342,y: 228,
                rotation: 0}, {type: "earth_lvl13",x: 312,y: 39,rotation: 0}, {type: "beetle",x: -50,y: 90,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 26,y: 70,rotation: 0}, {type: "tube2",x: 449,y: 243,rotation: 0}, {type: "invisible_wall_big",x: 69,y: 101,rotation: 0}, {type: "invisible_wall_big",x: 115,y: 167,rotation: 0}, {type: "invisible_wall_big",x: -31,y: 167,rotation: 0}, {type: "invisible_wall_small",x: 262,y: 168,rotation: 0}, {type: "invisible_wall_big",x: 192,y: 245,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 239,y: 240,
                rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 213,y: 275,rotation: 0}, {type: "invisible_wall_big",x: 352,y: 277,rotation: 0}, {type: "invisible_wall_big",x: 277,y: 240,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 455,y: 277,rotation: 0}, {type: "invisible_wall_big",x: 472,y: 89,rotation: 0}, {type: "invisible_wall_small",x: 371,y: 167,rotation: 0}, {type: "invisible_wall_small",x: 348,y: 192,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 414,y: 140,rotation: 1.5707963267948966}, {type: "bridge_lvl14",
                x: 381,y: 175,rotation: 0}, {type: "earth_lvl14",x: 381.5,y: 175,rotation: 0}, {type: "lever",x: 369,y: 212,rotation: 0,custom: "no_static"}],joints: []}, {objects: [{type: "tube1",x: 294,y: 248,rotation: 0}, {type: "tube2",x: 470,y: 118,rotation: 0}, {type: "invisible_wall_big",x: 145,y: 283,rotation: 0}, {type: "invisible_wall_small",x: 236,y: 257,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 70,y: 257,rotation: 1.5707963267948966}, {type: "Lift",x: 369.5,y: 372,rotation: 0}, {type: "invisible_wall_small",x: 245,y: 283,rotation: 0}, 
            {type: "invisible_wall_small",x: 295,y: 283,rotation: 0}, {type: "invisible_wall_small",x: 310,y: 283,rotation: 0}, {type: "invisible_wall_big",x: 401,y: 223,rotation: 1.5707963267948966,custom: "wall"}, {type: "invisible_wall_big",x: 474,y: 151,rotation: 0}, {type: "wheel",x: 179,y: 92,rotation: 0}, {type: "toy3",x: 178,y: 55,rotation: 0}, {type: "toy4",x: 224.5,y: 83.5,rotation: 0}, {type: "toy2",x: 178.5,y: 135.5,rotation: 0}, {type: "toy1",x: 133,y: 93,rotation: 0}, {type: "lever",x: 79,y: 61,rotation: 3.141592653589793,custom: "no_static_no_cover"}, 
            {type: "button_blue_down",x: 78,y: 97,rotation: 3.141592653589793,custom: "button_up_no_hint"}, {type: "button_blue_down",x: 78,y: 123,rotation: 0,custom: "button_down_no_hint"}, {type: "button_red",x: 423.5,y: 184,rotation: 0}, {type: "hunter1",x: 61,y: 203,rotation: 0}, {type: "earth_lvl15",x: 261,y: 255,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 127,y: 240,rotation: 0}, {type: "tube2",x: 453,y: 239,rotation: 0}, {type: "invisible_wall_big",x: 168,y: 274,rotation: 0}, {type: "invisible_wall_big",x: 318,y: 274,rotation: 0}, {type: "invisible_wall_big",
                x: 468,y: 274,rotation: 0}, {type: "invisible_wall_big",x: 27,y: 126,rotation: 0}, {type: "lever",x: 195,y: 35,rotation: 1.5707963267948966}, {type: "bridge1_lvl16",x: 159,y: 60,rotation: 0}, {type: "cover_lvl16",x: 159,y: 2,rotation: 0}, {type: "button_red",x: 68,y: 164,rotation: 0}, {type: "bridge2_lvl16",x: 65,y: 132,rotation: 0}, {type: "earth_lvl16",x: 59,y: 134,rotation: 0}, {type: "extraterrestrial",x: 124,y: 186,rotation: 0}, {type: "invisible_wall_big",x: 182,y: 206,rotation: 0}, {type: "invisible_wall_small",x: 283,y: 209,rotation: 0.12217304763960307}, 
            {type: "ufo_light",x: 361,y: 198,rotation: 0}, {type: "teleport_orange",x: 227,y: 175,rotation: 0,custom: "teleport11"}, {type: "teleport_orange",x: 50,y: 60,rotation: -1.5707963267948966,custom: "teleport12"}, {type: "teleport_blue",x: 181,y: 100,rotation: 0,custom: "teleport21"}, {type: "teleport_blue",x: 285,y: 140,rotation: -1.5707963267948966,custom: "teleport22"}, {type: "back_orange1",x: 259,y: 174,rotation: 0}, {type: "back_orange2",x: 52,y: 47,rotation: 0}, {type: "back_blue1",x: 195,y: 100,rotation: 0}, {type: "back_blue2",x: 285,y: 123,
                rotation: 0}, {type: "ufo",x: 361,y: 104,rotation: 0}, {type: "invisible_wall_small",x: 198,y: 127,rotation: 0}],joints: []}, {objects: [{type: "tube1",x: 30,y: 134,rotation: 0}, {type: "tube2",x: 448,y: 94,rotation: 0}, {type: "invisible_wall_big",x: 139,y: 167,rotation: 0}, {type: "invisible_wall_big",x: -11,y: 167,rotation: 0}, {type: "invisible_wall_big",x: 356,y: 125,rotation: 0}, {type: "invisible_wall_big",x: 505,y: 125,rotation: 0}, {type: "invisible_wall_big",x: 139,y: 249,rotation: 0}, {type: "invisible_wall_big",x: -11,y: 249,rotation: 0}, 
            {type: "invisible_wall_small",x: 309,y: 249,rotation: 0}, {type: "Lift",x: 248,y: 337,rotation: 0}, {type: "invisible_wall_big",x: 469,y: 249,rotation: 0}, {type: "invisible_wall_small",x: 441,y: 190,rotation: 1.3}, {type: "invisible_wall_small",x: 473,y: 222,rotation: 0}, {type: "invisible_wall_small",x: 280,y: 153,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 280,y: 203,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 376,y: 157,rotation: 0}, {type: "shutter",x: 246,y: 36,rotation: 0}, {type: "shutter",x: 371,
                y: 36,rotation: 0}, {type: "holder",x: 250,y: -2,rotation: 0}, {type: "holder",x: 367,y: -2,rotation: 0}, {type: "bridge_lvl17",x: 288,y: 38,rotation: 0}, {type: "bridge_lvl17",x: 329,y: 38,rotation: 0}, {type: "button_red",x: 250,y: 37,rotation: 0,custom: "button0"}, {type: "button_red",x: 367,y: 37,rotation: 0,custom: "button1"}, {type: "btn2",x: 162,y: 164,rotation: 0}, {type: "btn2",x: 193,y: 251,rotation: 0}, {type: "button_green",x: 368,y: 162,rotation: 0}, {type: "spring_lvl17",x: 367,y: 259,rotation: 0}, {type: "button_red",x: 367,y: 278,rotation: 0,
                custom: "button_spring"}, {type: "thing_with_lamps",x: 310,y: 9,rotation: 0}, {type: "caterpillar",x: -50,y: 235,rotation: 0}],joints: []}, {objects: [{type: "entrance_lvl18",x: 107,y: 201,rotation: 0}, {type: "tube2",x: 448,y: 200,rotation: 0}, {type: "invisible_wall_big",x: 78,y: 233,rotation: 0}, {type: "invisible_wall_small",x: 153,y: 257,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 145,y: 262,rotation: 0,restitution: 0.5}, {type: "invisible_wall_big",x: 168,y: 336,rotation: 1.5707963267948966}, {type: "invisible_wall_big",
                x: 215,y: 348,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 248,y: 348,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 218,y: 298,rotation: 1.5}, {type: "invisible_wall_small",x: 246,y: 298,rotation: -1.5}, {type: "invisible_wall_small",x: 74,y: 137,rotation: 1.2000000000000004}, {type: "invisible_wall_small",x: 59,y: 98,rotation: 1.2000000000000004}, {type: "invisible_wall_big",x: 313,y: 305,rotation: 1.5707963267948966,friction: 0.01}, {type: "invisible_wall_big",x: 385,y: 233,rotation: 0}, {type: "invisible_wall_small",
                x: 485,y: 233,rotation: 0}, {type: "saw",x: 355,y: 145,rotation: 0}, {type: "log1_lvl18",x: 322,y: 80,rotation: -0.2}, {type: "locker",x: 75,y: 99,rotation: 0}, {type: "bollMc",x: 77,y: 93,rotation: 0,friction: 0.31}, {type: "tree",x: 148,y: 165,rotation: 0.56}, {type: "woodpecker",x: 181,y: 48,rotation: 0}, {type: "question_mark",x: 235,y: 20,rotation: 0}, {type: "bough",x: 146,y: 24,rotation: 0}, {type: "tree",x: 233,y: 337,rotation: Math.PI / 2}, {type: "tree",x: 218,y: 303,rotation: Math.PI / 2}, {type: "tree",x: 247,y: 303,rotation: Math.PI / 2}],joints: []}, 
    {objects: [{type: "tube1",x: 31,y: 178,rotation: 0,custom: "true"}, {type: "invisible_wall_big",x: 50,y: 211,rotation: 0}, {type: "invisible_wall_big",x: 448,y: 275,rotation: 0}, {type: "invisible_wall_small",x: 279,y: 82,rotation: 0}, {type: "invisible_wall_big",x: 323,y: 71,rotation: -0.33}, {type: "invisible_wall_big",x: 187,y: 283,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 199,y: 283,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 215,y: 296,rotation: 1.5707963267948966,custom: "sleep"}, {type: "invisible_wall_big",
                x: 205,y: 294,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 193,y: 283,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 123,y: 284,rotation: 1.5707963267948966}, {type: "invisible_wall_small",x: 380,y: 245,rotation: 1.5707963267948966,custom: "sleep"}, {type: "lift_lvl19",x: 135,y: 12,rotation: 0}, {type: "tube2_lvl19",x: 430,y: 125,rotation: 0}, {type: "tube1_lvl19",x: 435,y: 227,rotation: 0,custom: !0}, {type: "bridge_lvl19",x: 156,y: 215,rotation: 0,custom: "bridge1"}, {type: "bridge_lvl19",x: 225,y: 88,rotation: 0,
                custom: "bridge2"}, {type: "moving_fence_lvl19",x: 296,y: 73,rotation: 0}, {type: "earth2_lvl19",x: 297.5,y: 88,rotation: 0}, {type: "swamp",x: 303,y: 290,rotation: 0}, {type: "bubble",x: 230,y: 263,rotation: 0}, {type: "eyes",x: 243,y: 275,rotation: 0}, {type: "monster",x: 345,y: 236,rotation: 0}, {type: "button_red",x: 323,y: 89,rotation: 0}, {type: "lever",x: 273,y: 118,rotation: 0,custom: "no_static"}, {type: "earth1_lvl19",x: 240,y: 262.5,rotation: 0}, {type: "log_lvl19",x: 302,y: 176,rotation: 0}, {type: "barell",x: 314,y: 53,rotation: 0}, {type: "barell",
                x: 349,y: 42,rotation: 0,custom: "barell"}, {type: "earth3_lvl19",x: 140,y: 14.5,rotation: 0}, {type: "earth4_lvl19",x: 433,y: 15,rotation: 0}],joints: [{type: 0,point1: {x: 310,y: 176}}, {type: 2,point1: {x: 135,y: 109},point2: {x: 135,y: 8}}, {type: 2,point1: {x: 136,y: 109},point2: {x: 136,y: 8}}, {type: 2,point1: {x: 435,y: 227},point2: {x: 435,y: 2}}, {type: 2,point1: {x: 436,y: 227},point2: {x: 436,y: 2}}]}, {objects: [{type: "tube1",x: 30,y: 79,rotation: 0}, {type: "invisible_wall_big",x: 133,y: 112,rotation: 0}, {type: "invisible_wall_big",x: -17,y: 112,
                rotation: 0}, {type: "invisible_wall_big",x: 359,y: 112,rotation: 0}, {type: "invisible_wall_big",x: 509,y: 112,rotation: 0}, {type: "invisible_wall_big",x: 387,y: 246,rotation: 1.5707963267948966}, {type: "invisible_wall_big",x: 328,y: 325,rotation: 1.5707963267948966}, {type: "tube2",x: 464,y: 73,rotation: 0}, {type: "grandpa",x: 394,y: 91,rotation: 0}, {type: "conveyor",x: 72,y: 258,rotation: 0}, {type: "Lift",x: 246,y: 200,rotation: 0}, {type: "earth_lvl20",x: 246,y: 286.5,rotation: 0}, {type: "button_red",x: 176,y: 147,rotation: 0,custom: "button_catch"}, 
            {type: "catcher_lvl20",x: 130,y: 86,rotation: 0}, {type: "earth2_lvl20",x: 131,y: 73.5,rotation: 0}, {type: "spring_lvl20",x: 86,y: 163,rotation: 0,custom: "spring1"}, {type: "spring_lvl20",x: 428,y: 177,rotation: 3.141592653589793,custom: "spring2"}, {type: "spring_lvl8",x: 359,y: 254,rotation: 0,custom: "spring3"}, {type: "button_red",x: 61,y: 163,rotation: 0,custom: "button_spring1"}, {type: "button_red",x: 428,y: 177,rotation: 0,custom: "button_spring2"}, {type: "button_red",x: 405,y: 272,rotation: 0,custom: "button_spring3"}, {type: "button_red",
                x: 246,y: 270,rotation: 0,custom: "button_lift"}],joints: []}], NONE = 0, BOX = 1, CIRCLE = 2, POLY = 3, NORMAL = 0, BOB = 1, PLATFORM = 4;
function spritesSync(a, c, e) {
    c = new Vector(-a.target.syncX, -a.target.syncY);
    c.rotate(-a.target.rotation);
    a.target.x += c.x;
    a.target.y += c.y
}
var stone_density = 6, stone_restitution = 0, stone_friction = 1, platform_density = 3E6, platform_restitution = -10, platform_friction = 0, obstacle_density = 1E4, obstacle_restitution = 0, obstacle_friction = 0, BOB_density = 10, BOB_restitution = 0, BOB_friction = 0, objects = [{name: "tube1",image: "tube1.png",width: 67,height: 74,frames: 1,bodyType: NONE,info: "entrance"}, {name: "tube2",image: "tube2.png",width: 67,height: 74,frames: 1,bodyType: NONE,info: "destination"}, {name: "invisible_wall_small",image: "invisible_wall_small.png",type: PLATFORM,
        width: 50,height: 5,bodyWidth: 50,bodyHeight: 5,frames: 1,bodyType: BOX,bodyPosCorrect: {x: 0,y: 0},remove: !1,fixed: !0,info: "invisible",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "invisible_wall_big",image: "invisible_wall_big.png",type: PLATFORM,width: 150,height: 5,bodyWidth: 150,bodyHeight: 5,frames: 1,bodyType: BOX,bodyPosCorrect: {x: 0,y: 0},remove: !1,fixed: !0,info: "invisible",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "lever",
        image: "lever.png",width: 46,height: 46,frames: 6,bodyType: NONE,info: "lever"}, {name: "slider",image: "slider.png",width: 28,height: 28,bodyType: NONE,info: "slider"}, {name: "Baraban",image: "Baraban.png",type: BOX,width: 75,height: 30,bodyWidth: 75,bodyHeight: 30,frames: 14,bodyType: BOX,bodyPosCorrect: {x: 0,y: 3},remove: !1,fixed: !0,info: "Baraban",density: 0,restitution: 0,friction: 0}, {name: "button_blue_mid",image: "button_blue_mid.png",width: 15,height: 31,frames: 1,bodyType: NONE,info: "button_blue_mid"}, {name: "button_blue_down",
        image: "button_blue_down.png",width: 30,height: 32,frames: 3,bodyType: NONE,info: "button_blue_down"}, {name: "button_blue_left",image: "button_blue_left.png",width: 31,height: 30,frames: 3,bodyType: NONE,info: "button_blue_left"}, {name: "button_red",image: "button_red.png",width: 30,height: 30,frames: 3,bodyType: NONE,info: "button_red"}, {name: "lever_cover",image: "lever_cover.png",width: 29,height: 6,frames: 1,bodyType: NONE,info: "lever_cover"}, {name: "trap",image: "trap.png",width: 190,height: 52,frames: 9,bodyType: NONE,info: "trap"}, 
    {name: "btn",image: "btn.png",width: 37,height: 12,frames: 2,bodyType: NONE,info: "btn"}, {name: "btn2",image: "btn2.png",width: 43,height: 15,frames: 5,bodyType: NONE,info: "btn2"}, {name: "btn3",image: "btn3.png",width: 28,height: 28,frames: 2,bodyType: NONE,info: "btn3"}, {name: "Lift",image: "Lift.png",type: BOX,width: 67,height: 185,bodyWidth: 67,bodyHeight: 175,frames: 1,bodyType: BOX,bodyPosCorrect: {x: 0,y: -3},fixed: !0,info: "Lift",density: 1E3 * platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "electricity_10",
        image: "electricity_10.png",width: 44,height: 42,frames: 10,bodyType: NONE,info: "electricity_10"}, {name: "fan",image: "fan.png",width: 100,height: 226,frames: 8,rows: 4,columns: 2,bodyType: NONE,info: "fan_tiles"}, {name: "caterpillar",image: "caterpillar_move1.png",width: 62,height: 36,bodyHeight: 13,bodyWidth: 50,bodyPosCorrect: {x: 3,y: 7},bodyType: BOX,frames: 9,fixed: !1,info: "caterpillar",density: 11,restitution: BOB_restitution,friction: BOB_friction}, {name: "tip1",image: "hints/tip1.png",width: 135,height: 47,frames: 1,bodyType: NONE,
        info: "tip1"}, {name: "tip2",image: "hints/tip2.png",width: 143,height: 34,frames: 1,bodyType: NONE,info: "tip2"}, {name: "Lvl2_Hint1",image: "hints/Lvl2_Hint1.png",width: 187,height: 50,bodyType: NONE,info: "Lvl2_Hint1"}, {name: "Lvl2_Hint2",image: "hints/Lvl2_Hint2.png",width: 143,height: 30,bodyType: NONE,info: "Lvl2_Hint2"}, {name: "Lvl2_Hint3",image: "hints/Lvl2_Hint3.png",width: 120,height: 30,bodyType: NONE,info: "Lvl2_Hint3"}, {name: "Lvl3_Hint1",image: "hints/Lvl3_Hint1.png",width: 130,height: 47,bodyType: NONE,info: "Lvl3_Hint1"}, 
    {name: "Lvl5_Hint1",image: "hints/Lvl5_Hint1.png",width: 179,height: 25,bodyType: NONE,info: "Lvl5_Hint1"}, {name: "arrow_hint",image: "hints/arrow_hint.png",width: 22,height: 40,bodyType: NONE,info: "arrow_hint"}, {name: "arrow_hint5",image: "hints/arrow_hint5.png",width: 47,height: 25,bodyType: NONE,info: "arrow_hint5"}, {name: "question_mark",image: "hints/question_mark.png",width: 44,height: 22,bodyType: NONE,info: "question_mark"}, {name: "earth_lvl1",image: "levels/01/earth_lvl1.png",width: 129,height: 22,bodyType: NONE,info: "earth_lvl1"}, 
    {name: "bridge_lvl2",image: "levels/02/Bridge.png",width: 58,height: 21,bodyWidth: 61,bodyHeight: 17,bodyType: BOX,fixed: !1,info: "bridge_lvl2",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "ButtonSystem",image: "levels/02/ButtonSystem.png",type: BOX,width: 35,height: 32,frames: 6,bodyType: NONE,info: "ButtonSystem"}, {name: "bollMc",image: "levels/02/bollMc.png",type: BOX,width: 41,height: 40,bodyWidth: 35,bodyHeight: 35,frames: 1,bodyType: CIRCLE,bodyPosCorrect: {x: -1,y: -1},
        fixed: !1,info: "bollMc",density: 35,restitution: 0.1,friction: 0.5}, {name: "Fire",image: "levels/02/Fire.png",width: 35,height: 58,frames: 10,bodyType: BOX,bodyPosCorrect: {x: 0,y: -2},fixed: !0,info: "Fire",density: obstacle_density,restitution: obstacle_restitution,friction: obstacle_friction}, {name: "Neutral1",image: "levels/02/Neutral1.png",width: 58,height: 68,frames: 13,rows: 7,columns: 2,bodyType: NONE,info: "Enemy1_tiles"}, {name: "Neutral2",image: "levels/02/Neutral2.png",width: 72,height: 86,frames: 11,rows: 5,columns: 3,
        bodyType: NONE,info: "Enemy2_tiles"}, {name: "bridge_lvl3",image: "levels/03/bridge_lvl3.png",width: 33,height: 15,bodyHeight: 13,bodyType: BOX,fixed: !1,info: "bridge_lvl3",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "fence",image: "levels/03/fence.png",width: 238,height: 94,frames: 8,bodyType: NONE,info: "fence"}, {name: "earth1_lvl3",image: "levels/03/earth1_lvl3.png",width: 37,height: 17,bodyType: NONE,info: "earth1_lvl3"}, {name: "earth2_lvl3",image: "levels/03/earth2_lvl3.png",
        width: 38,height: 17,bodyType: NONE,info: "earth2_lvl3"}, {name: "terminator_appear",image: "levels/03/terminator_appear.png",width: 146,height: 106,bodyWidth: 35,bodyHeight: 39,frames: 18,rows: 9,columns: 2,bodyType: CIRCLE,bodyPosCorrect: {x: 0,y: -4},fixed: !1,density: BOB_density,restitution: BOB_restitution,friction: BOB_friction,info: "terminator_tiles"}, {name: "btn_lvl3_green",image: "levels/03/btn_lvl3_green.png",width: 28,height: 28,frames: 2,bodyType: NONE,info: "btn_lvl3_green"}, {name: "btn_lvl3_red",image: "levels/03/btn_lvl3_red.png",
        width: 28,height: 28,frames: 2,bodyType: NONE,info: "btn_lvl3_red"}, {name: "doors_lvl3",image: "levels/03/doors_lvl3.png",width: 268,height: 108,frames: 8,bodyType: NONE,info: "doors_lvl3"}, {name: "exit",image: "levels/03/exit.png",width: 38,height: 42,bodyType: NONE,info: "exit"}, {name: "numbers_lvl3",image: "levels/03/numbers_lvl3.png",width: 147,height: 84,bodyType: NONE,info: "numbers_lvl3"}, {name: "lava_lvl3",image: "levels/03/lava_lvl3.png",width: 66,height: 93,bodyType: NONE,info: "lava_lvl3"}, {name: "bridge_lvl4",image: "levels/04/bridge_lvl4.png",
        width: 138,height: 17,bodyType: BOX,fixed: !0,info: "bridge_lvl4",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "earth_fixed",image: "levels/04/earth_fixed.png",width: 50,height: 88,bodyType: BOX,fixed: !0,info: "earth_fixed",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "earth_move",image: "levels/04/earth_move.png",width: 57,height: 155,bodyType: BOX,fixed: !0,info: "earth_move",density: platform_density,restitution: platform_restitution,
        friction: platform_friction}, {name: "log_lvl4",image: "levels/04/log_lvl4.png",width: 256,height: 60,bodyType: NONE,info: "log_lvl4"}, {name: "hose",image: "levels/04/hose.png",width: 68,height: 52,frames: 9,bodyType: NONE,info: "hose"}, {name: "antiant_anim",image: "levels/04/antiant_anim.png",width: 54,height: 62,frames: 15,bodyType: NONE,info: "antiant_anim"}, {name: "ant",image: "levels/04/ant.png",width: 28,height: 28,bodyWidth: 18,frames: 9,bodyType: CIRCLE,bodyPosCorrect: {x: -5,y: 0},fixed: !1,density: platform_density,restitution: platform_restitution,
        friction: platform_friction,info: "ant"}, {name: "fireball",image: "levels/05/fireball.png",width: 50,height: 51,bodyHeight: 49,bodyWidth: 49,bodyType: CIRCLE,fixed: !1,density: obstacle_density,restitution: 0.3,friction: obstacle_friction,info: "fireball"}, {name: "earth1_lvl5",image: "levels/05/earth1_lvl5.png",width: 73,height: 33,bodyType: NONE,info: "earth1_lvl5"}, {name: "earth2_lvl5",image: "levels/05/earth2_lvl5.png",width: 64,height: 43,bodyType: NONE,info: "earth2_lvl5"}, {name: "bridge_lvl5",image: "levels/05/bridge_lvl5.png",
        width: 55,height: 15,bodyHeight: 14,bodyType: BOX,fixed: !0,info: "bridge_lvl5",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "moving_fence",image: "levels/05/moving_fence.png",width: 53,height: 37,frames: 6,bodyType: POLY,points: [[[-13, -18], [-5, 18], [-26, 3]]],fixed: !0,density: obstacle_density,restitution: obstacle_restitution,friction: obstacle_friction,info: "moving_fence"}, {name: "bridge_lvl6",image: "levels/06/bridge_lvl6.png",width: 47,height: 18,bodyHeight: 15,bodyType: BOX,
        fixed: !0,info: "bridge_lvl6",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "lift_lvl6",image: "levels/06/lift_lvl6.png",width: 68,height: 200,bodyType: POLY,points: [[[-34, -100], [34, -100], [34, -62], [-34, -62]], [[-32, -5], [32, -5], [32, 100], [-32, 100]]],fixed: !0,info: "lift_lvl6",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "spring_lvl6",image: "levels/06/spring_lvl6.png",width: 72,height: 96,bodyWidth: 45,bodyHeight: 55,frames: 7,
        bodyPosCorrect: {x: 3,y: 15},bodyType: BOX,fixed: !0,info: "spring_lvl6",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "earth_lvl6",image: "levels/06/earth_lvl6.png",width: 73,height: 26,bodyType: NONE,info: "earth_lvl6"}, {name: "indicator_lvl6",image: "levels/06/indicator_lvl6.png",width: 12,height: 12,frames: 2,bodyType: NONE,info: "indicator_lvl6"}, {name: "magnet",image: "levels/07/magnet.png",width: 56,height: 60,columns: 2,rows: 15,frames: 29,bodyType: NONE,info: "magnet_tiles"}, 
    {name: "stripes",image: "levels/07/stripes.png",width: 12,height: 28,frames: 5,bodyType: NONE,info: "stripes"}, {name: "wire_lvl7",image: "levels/07/wire_lvl7.png",width: 65,height: 72,frames: 10,bodyType: NONE,info: "wire_lvl7"}, {name: "ball_lvl7",image: "levels/07/ball_lvl7.png",width: 43,height: 46,bodyWidth: 40,bodyPosCorrect: {x: 0,y: 3},bodyType: CIRCLE,fixed: !1,density: 1E3,restitution: 0.1,friction: 0.4,info: "ball_lvl7"}, {name: "rope_lvl7",image: "levels/07/rope_lvl7.png",width: 4,height: 7,bodyType: BOX,fixed: !1,density: 9,
        restitution: 0.1,friction: 0.1,info: "rope_lvl7"}, {name: "bridge_lvl7",image: "levels/07/bridge_lvl7.png",width: 18,height: 61,bodyType: BOX,fixed: !0,info: "bridge_lvl7",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "earth_lvl7",image: "levels/07/earth_lvl7.png",width: 24,height: 63,bodyType: NONE,info: "earth_lvl7"}, {name: "ball_holder",image: "levels/07/ball_holder.png",width: 72,height: 55,bodyType: NONE,info: "ball_holder"}, {name: "skeleton",image: "levels/08/skeleton.png",
        width: 48,height: 52,bodyWidth: 38,bodyPosCorrect: {x: -9,y: -3},frames: 7,bodyType: CIRCLE,fixed: !1,density: 10,restitution: BOB_restitution,friction: BOB_friction,info: "skeleton"}, {name: "spring_lvl8",image: "levels/08/spring_lvl8.png",width: 56,height: 62,bodyWidth: 52,bodyHeight: 40,frames: 6,bodyPosCorrect: {x: 0,y: 13},bodyType: BOX,fixed: !0,info: "spring_lvl8",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "box_lvl8",image: "levels/08/box_lvl8.png",width: 73,height: 46,bodyType: NONE,
        info: "box_lvl8"}, {name: "link_lvl8",image: "levels/08/link_lvl8.png",width: 12,height: 12,bodyType: NONE,info: "link_lvl8"}, {name: "earth_lvl8",image: "levels/08/earth_lvl8.png",width: 33,height: 33,bodyType: NONE,info: "earth_lvl8"}, {name: "bridge_lvl8",image: "levels/08/bridge_lvl8.png",width: 19,height: 76,bodyType: BOX,fixed: !0,info: "bridge_lvl8",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "bridge2_lvl8",image: "levels/08/bridge2_lvl8.png",width: 148,height: 15,bodyType: BOX,
        fixed: !0,info: "bridge2_lvl8",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "trampoline",image: "levels/09/trampoline.png",width: 57,height: 38,bodyWidth: 52,bodyHeight: 32,frames: 6,bodyType: BOX,fixed: !0,info: "trampoline",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "fly_lvl9",image: "levels/09/fly_lvl9.png",width: 46,height: 36,frames: 11,bodyType: NONE,info: "fly_lvl9"}, {name: "fire_lvl9",image: "levels/09/fire_lvl9.png",
        width: 30,height: 90,frames: 9,bodyType: NONE,info: "fire_lvl9"}, {name: "bbq",image: "levels/09/bbq.png",width: 20,height: 144,bodyType: NONE,info: "bbq"}, {name: "earth_lvl10",image: "levels/10/earth_lvl10.png",width: 68,height: 30,bodyType: NONE,info: "earth_lvl10"}, {name: "fan_lvl10",image: "levels/10/fan_lvl10.png",width: 55,height: 168,bodyType: NONE,info: "fan_lvl10"}, {name: "ant_lvl11",image: "levels/11/ant_lvl11.png",width: 26,height: 28,frames: 12,bodyType: NONE,info: "ant_lvl11"}, {name: "cannon",image: "levels/11/cannon.png",
        width: 98,height: 60,frames: 7,bodyType: NONE,info: "cannon"}, {name: "catcher",image: "levels/11/catcher.png",width: 14,height: 9,bodyType: BOX,fixed: !1,density: 50,restitution: 0.1,friction: 0.1,info: "catcher"}, {name: "dart",image: "levels/11/dart.png",width: 51,height: 9,bodyType: NONE,info: "dart"}, {name: "flap",image: "levels/11/flap.png",width: 30,height: 28,frames: 10,bodyType: NONE,info: "flap"}, {name: "wall1",image: "levels/11/wall1.png",width: 228,height: 176,bodyHeight: 174,bodyType: BOX,fixed: !0,density: platform_density,
        restitution: platform_restitution,friction: platform_friction,info: "wall1"}, {name: "wall2",image: "levels/11/wall2.png",width: 228,height: 176,bodyWidth: 220,bodyHeight: 173,bodyType: BOX,fixed: !0,density: platform_density,restitution: platform_restitution,friction: platform_friction,info: "wall2"}, {name: "earth_lvl11",image: "levels/11/earth_lvl11.png",width: 480,height: 181,bodyType: NONE,info: "earth_lvl11"}, {name: "rope_lvl11",image: "levels/11/rope_lvl11.png",width: 8,height: 15,bodyWidth: 6,bodyType: BOX,fixed: !1,density: 9,
        restitution: 0.1,friction: 0.1,info: "rope_lvl11"}, {name: "danger",image: "levels/11/danger.png",width: 152,height: 72,bodyType: NONE,info: "danger"}, {name: "crane",image: "levels/12/crane.png",width: 66,height: 34,frames: 6,bodyType: NONE,info: "crane"}, {name: "pump_down",image: "levels/12/pump_down.png",width: 28,height: 41,bodyType: NONE,info: "pump_down"}, {name: "pump_up",image: "levels/12/pump_up.png",width: 31,height: 66,bodyType: NONE,info: "pump_up"}, {name: "box_lvl12",image: "levels/12/box_lvl12.png",width: 55,height: 55,
        bodyWidth: 52,bodyHeight: 52,bodyType: BOX,fixed: !1,info: "box_lvl12",density: 1E3,restitution: 0.1,friction: 0.5}, {name: "ball1",image: "levels/12/ball1.png",width: 68,height: 142,bodyWidth: 31,bodyHeight: 31,bodyPosCorrect: {x: 0,y: -31},frames: 7,bodyType: CIRCLE,fixed: !1,info: "ball",density: obstacle_density,restitution: 0.3,friction: 0.1}, {name: "basket_invisible",image: "levels/12/basket_invisible.png",width: 64,height: 17,bodyHeight: 11,bodyWidth: 55,frames: 1,bodyType: BOX,fixed: !1,info: "basket_invisible",density: obstacle_density,
        restitution: obstacle_restitution,friction: obstacle_friction}, {name: "beetle",image: "levels/13/beetle.png",width: 58,height: 48,bodyWidth: 43,frames: 9,bodyType: CIRCLE,fixed: !1,density: 1,restitution: 0.2,friction: 0.6,info: "beetle"}, {name: "bridge_lvl13",image: "levels/13/bridge_lvl13.png",width: 18,height: 62,bodyType: BOX,fixed: !0,info: "bridge_lvl13",density: obstacle_density,restitution: obstacle_restitution,friction: obstacle_friction}, {name: "trolley",image: "levels/13/trolley.png",width: 62,height: 24,bodyType: BOX,
        fixed: !0,info: "trolley",density: obstacle_density,restitution: obstacle_restitution,friction: obstacle_friction}, {name: "log_lvl13",image: "levels/13/log_lvl13.png",width: 17,height: 75,bodyHeight: 72,bodyPosCorrect: {x: 0,y: 2},bodyType: BOX,fixed: !1,info: "log_lvl13",density: 100,restitution: 0.2,friction: 0.01}, {name: "latch1",image: "levels/13/latch1.png",width: 38,height: 61,bodyType: POLY,points: [[[-18, -28], [11, -28], [11, -13], [-18, -13]], [[-18, -28], [-4, -28], [-4, 30], [-18, 30]]],fixed: !0,info: "latch1",density: 10,restitution: 0.2,
        friction: 0.5}, {name: "latch2",image: "levels/13/latch2.png",width: 61,height: 34,bodyType: POLY,points: [[[-30, -12], [30, -12], [30, 2], [-30, 2]], [[-30, -12], [-16, -12], [-16, 17], [-30, 17]]],fixed: !0,info: "latch2",density: 10,restitution: 0.2,friction: 0.01}, {name: "earth_lvl13",image: "levels/13/earth_lvl13.png",width: 38,height: 78,bodyType: NONE,info: "earth_lvl13"}, {name: "trolley_play",image: "levels/13/trolley_play.png",width: 6,height: 11,frames: 2,bodyType: NONE,info: "trolley_play"}, {name: "earth_lvl14",image: "levels/14/earth_lvl14.png",
        width: 76,height: 28,bodyType: NONE,info: "earth_lvl14"}, {name: "bridge_lvl14",image: "levels/14/bridge_lvl14.png",width: 67,height: 19,bodyHeight: 18,bodyType: BOX,fixed: !0,info: "bridge_lvl14",density: obstacle_density,restitution: obstacle_restitution,friction: obstacle_friction}, {name: "igor",image: "levels/14/igor1.png",width: 50,height: 46,bodyWidth: 36,frames: 8,bodyType: CIRCLE,bodyPosCorrect: {x: -4,y: -4},fixed: !1,density: BOB_density,restitution: BOB_restitution,friction: BOB_friction,info: "igor"}, {name: "dima",image: "levels/14/dima1.png",
        width: 52,height: 42,bodyWidth: 36,frames: 8,bodyType: CIRCLE,bodyPosCorrect: {x: -2,y: -3},fixed: !1,density: BOB_density,restitution: BOB_restitution,friction: BOB_friction,info: "dima"}, {name: "jeka",image: "levels/14/jeka1.png",width: 56,height: 48,bodyWidth: 37,frames: 8,bodyType: CIRCLE,bodyPosCorrect: {x: 4,y: 1},fixed: !1,density: BOB_density,restitution: BOB_restitution,friction: BOB_friction,info: "jeka"}, {name: "bullet",image: "levels/15/bullet.png",width: 50,height: 10,frames: 11,bodyType: NONE,info: "bullet"}, {name: "earth_lvl15",
        image: "levels/15/earth_lvl15.png",width: 63,height: 56,bodyType: NONE,info: "earth_lvl15"}, {name: "hunter1",image: "levels/15/hunter1.png",width: 70,height: 58,frames: 7,bodyType: NONE,info: "hunter1"}, {name: "toy1",image: "levels/15/toy1.png",width: 28,height: 43,bodyType: POLY,points: [[[-5, -20], [5, -20], [13.5, -12], [13.5, 12], [5, 20], [-5, 20], [-13.5, 12], [-13.5, -12]]],fixed: !1,info: "toy",density: 1,restitution: 0.01,friction: 0.2}, {name: "toy2",image: "levels/15/toy2.png",width: 49,height: 40,bodyType: NONE,points: [[[-24, -20], 
                [3, -20], [3, 8], [-24, 8]], [[-24, 8], [24, 8], [24, 20], [-24, 20]], [[15, -20], [24, -20], [24, 8], [15, 8]]],fixed: !1,info: "toy",density: 10,restitution: 0.01,friction: 0.2}, {name: "toy3",image: "levels/15/toy3.png",width: 48,height: 41,bodyType: POLY,points: [[[-24, -20], [-16, -20], [-16, -1], [-24, -1]], [[-16, -12], [-5, -12], [-5, -1], [-16, -1]], [[-5, -20], [24, -20], [24, -1], [-5, -1]], [[6, -1], [14, -1], [14, 16], [10, 21], [6, 16]]],fixed: !1,info: "toy",density: 10,restitution: 0.01,friction: 0.2}, {name: "toy4",image: "levels/15/toy4.png",width: 39,
        height: 39,bodyType: POLY,points: [[[-19, -13], [-14, -13], [-14, 12], [-19, 12]], [[-16, 12], [-8, 12], [-8, 19], [-16, 17]], [[-14, 5], [19, 5], [19, 12], [-14, 12]], [[13, -19], [19, -19], [19, 5], [13, 5]]],fixed: !1,info: "toy",density: 10,restitution: 0.01,friction: 0.2}, {name: "wheel",image: "levels/15/wheel.png",width: 100,height: 101,bodyWidth: 13,info: "wheel",bodyType: NONE}, {name: "bridge1_lvl16",image: "levels/16/bridge1_lvl16.png",width: 16,height: 118,bodyType: BOX,fixed: !0,info: "bridge1_lvl16",density: platform_density,restitution: platform_restitution,
        friction: platform_friction}, {name: "bridge2_lvl16",image: "levels/16/bridge2_lvl16.png",width: 84,height: 17,bodyType: BOX,fixed: !0,info: "bridge2_lvl16",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "cover_lvl16",image: "levels/16/cover_lvl16.png",width: 37,height: 6,bodyType: NONE,info: "cover_lvl16"}, {name: "earth_lvl16",image: "levels/16/earth_lvl16.png",width: 85,height: 24,bodyType: NONE,info: "earth_lvl16"}, {name: "ufo",image: "levels/16/ufo.png",width: 88,height: 74,
        bodyType: NONE,info: "ufo"}, {name: "back_blue1",image: "levels/16/back_blue1.png",width: 28,height: 74,bodyType: NONE,info: "back_blue1"}, {name: "back_blue2",image: "levels/16/back_blue2.png",width: 71,height: 40,bodyType: NONE,info: "back_blue2"}, {name: "back_orange1",image: "levels/16/back_orange1.png",width: 64,height: 74,bodyType: NONE,info: "back_orange1"}, {name: "back_orange2",image: "levels/16/back_orange2.png",width: 66,height: 27,bodyType: NONE,info: "back_orange2"}, {name: "ufo_light",image: "levels/16/ufo_light.png",
        width: 82,height: 158,frames: 28,rows: 6,columns: 5,bodyType: NONE,info: "ufo_light_tiles"}, {name: "teleport_orange",image: "levels/16/teleport_orange.png",width: 32,height: 108,frames: 18,rows: 9,columns: 2,bodyType: NONE,info: "teleport_tiles"}, {name: "teleport_blue",image: "levels/16/teleport_blue.png",width: 32,height: 108,frames: 18,rows: 9,columns: 2,bodyType: NONE,info: "teleport_tiles"}, {name: "extraterrestrial",image: "levels/16/extraterrestrial.png",width: 54,height: 42,bodyWidth: 36,frames: 8,bodyType: CIRCLE,bodyPosCorrect: {x: 0,
            y: 0},fixed: !1,density: BOB_density,restitution: BOB_restitution,friction: BOB_friction,info: "extraterrestrial"}, {name: "bridge_lvl17",image: "levels/17/bridge_lvl17.png",width: 18,height: 168,bodyType: BOX,fixed: !0,info: "bridge_lvl17",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "holder",image: "levels/17/holder.png",width: 33,height: 107,bodyType: NONE,info: "holder"}, {name: "shutter",image: "levels/17/shutter.png",width: 70,height: 72,frames: 8,bodyType: NONE,info: "shutter"}, 
    {name: "thing_with_lamps",image: "levels/17/thing_with_lamps.png",width: 72,height: 19,bodyType: NONE,info: "thing_with_lamps"}, {name: "button_green",image: "levels/17/button_green.png",width: 37,height: 14,frames: 10,bodyType: NONE,info: "button_green"}, {name: "spring_lvl17",image: "levels/17/spring_lvl17.png",width: 48,height: 62,bodyWidth: 54,bodyHeight: 43,frames: 12,rows: 6,columns: 2,bodyType: BOX,bodyPosCorrect: {x: 0,y: 9},fixed: !0,density: platform_density,restitution: platform_restitution,friction: platform_friction,
        info: "spring_lvl17_tiles"}, {name: "locker",image: "levels/18/locker.png",width: 43,height: 65,bodyType: NONE,info: "locker"}, {name: "saw",image: "levels/18/saw.png",width: 95,height: 24,bodyType: NONE,info: "saw"}, {name: "log2_lvl18",image: "levels/18/log2_lvl18.png",width: 18,height: 77,bodyHeight: 74,bodyType: BOX,fixed: !1,info: "log2_lvl18",density: 100,restitution: 0.01,friction: 0.15}, {name: "log1_lvl18",image: "levels/18/log1_lvl18.png",width: 19,height: 149,bodyHeight: 145,bodyWidth: 17,bodyType: BOX,fixed: !1,info: "log1_lvl18",
        density: 5,restitution: 0.01,friction: 0.01}, {name: "tree",image: "levels/18/tree.png",width: 30,height: 13,fixed: !0,bodyType: BOX,density: platform_density,restitution: 0.1,friction: 0.1,info: "tree_invisible"}, {name: "entrance_lvl18",image: "levels/18/tree.png",width: 30,height: 13,bodyType: NONE,info: "entrance_lvl18_invisible"}, {name: "bough",image: "levels/18/bough.png",width: 45,height: 54,bodyType: NONE,info: "bough"}, {name: "woodpecker",image: "levels/18/woodpecker1.png",width: 68,height: 110,frames: 23,rows: 8,columns: 3,
        bodyType: NONE,info: "woodpecker_tiles"}, {name: "bubble",image: "levels/19/bubble.png",width: 198,height: 14,frames: 54,bodyType: NONE,info: "bubble"}, {name: "monster",image: "levels/19/monster.png",width: 84,height: 68,frames: 11,bodyType: NONE,info: "monster"}, {name: "swamp",image: "levels/19/swamp.png",width: 338,height: 68,frames: 14,bodyType: NONE,info: "swamp"}, {name: "earth1_lvl19",image: "levels/19/earth1_lvl19.png",width: 480,height: 115,bodyType: NONE,info: "earth1_lvl19"}, {name: "earth2_lvl19",image: "levels/19/earth2_lvl19.png",
        width: 92,height: 37,bodyType: NONE,info: "earth2_lvl19"}, {name: "eyes",image: "levels/19/eyes.png",width: 146,height: 15,bodyType: NONE,info: "eyes"}, {name: "moving_fence_lvl19",image: "levels/19/moving_fence_lvl19.png",width: 22,height: 35,bodyType: POLY,points: [[[-9, -15], [-1, -16], [9, 5], [-7, 16]]],fixed: !0,info: "moving_fence_lvl19",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "bridge_lvl19",image: "levels/19/bridge_lvl19.png",width: 57,height: 15,bodyHeight: 13,bodyType: BOX,
        fixed: !0,info: "bridge_lvl19",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "barell",image: "levels/19/barell.png",width: 37,height: 36,bodyWidth: 36,bodyType: CIRCLE,fixed: !1,info: "barell",density: 8,restitution: 0.1,friction: 0.4}, {name: "log_lvl19",image: "levels/19/log_lvl19.png",width: 196,height: 78,bodyType: POLY,points: [[[-97, -27], [-93, -36], [78, 15], [73, 29]], [[78, 15], [98, 28], [91, 40], [71, 29]]],fixed: !1,info: "log_lvl19",density: 2,restitution: 0.01,friction: 0.5}, 
    {name: "lift_lvl19",image: "levels/19/lift_lvl19.png",width: 125,height: 208,bodyType: POLY,points: [[[-62, 89], [62, 89], [62, 104], [-62, 104]], [[-62, 69], [-50, 69], [-50, 89], [-62, 89]], [[50, 69], [62, 69], [62, 89], [50, 89]]],fixed: !1,info: "lift_lvl19",density: 5.4,restitution: 0.01,friction: 0.5}, {name: "tube1_lvl19",image: "levels/19/tube1_lvl19.png",width: 93,height: 93,bodyType: POLY,points: [[[-23, -35], [23, -35], [23, -28], [-23, -28]], [[-46, 31], [40, 31], [40, 46], [-46, 46]], [[-24, 17], [46, 17], [46, 31], [-24, 31]]],fixed: !1,info: "destination",
        density: 5,restitution: 0.2,friction: 0.5}, {name: "tube2_lvl19",image: "levels/19/tube2_lvl19.png",width: 57,height: 251,bodyType: NONE,info: "tube2_lvl19"}, {name: "earth3_lvl19",image: "levels/19/earth3_lvl19.png",width: 55,height: 29,bodyType: NONE,info: "earth3_lvl19"}, {name: "earth4_lvl19",image: "levels/19/earth4_lvl19.png",width: 56,height: 30,bodyType: NONE,info: "earth4_lvl19"}, {name: "conveyor",image: "levels/20/conveyormovie.png",width: 174,height: 22,bodyWidth: 160,bodyHeight: 18,frames: 13,bodyType: BOX,density: platform_density,
        restitution: platform_restitution,friction: platform_friction,info: "conveyor"}, {name: "present",image: "levels/20/present.png",width: 31,height: 39,bodyHeight: 31,bodyPosCorrect: {x: 0,y: 4},fixed: !1,bodyType: BOX,density: 1,restitution: 0.1,friction: 0.5,info: "present"}, {name: "grandpa",image: "levels/20/grandpa.png",width: 54,height: 50,frames: 20,bodyType: NONE,info: "grandpa"}, {name: "spring_lvl20",image: "levels/20/spring_lvl20.png",width: 84,height: 56,bodyWidth: 58,frames: 7,bodyPosCorrect: {x: -13,y: 0},bodyType: BOX,fixed: !0,
        info: "spring_lvl20",density: platform_density,restitution: platform_restitution,friction: platform_friction}, {name: "catcher_lvl20",image: "levels/20/catcher_lvl20.png",width: 21,height: 130,bodyType: NONE,info: "catcher_lvl20"}, {name: "earth_lvl20",image: "levels/20/earth_lvl20.png",width: 71,height: 67,bodyType: NONE,info: "earth_lvl20"}, {name: "earth2_lvl20",image: "levels/20/earth2_lvl20.png",width: 25,height: 124,bodyType: NONE,info: "earth2_lvl20"}, {name: "Bob",image: "Bob.png",width: 48,height: 39,bodyWidth: 35,bodyHeight: 39,
        frames: 1,bodyType: CIRCLE,bodyPosCorrect: {x: 0,y: -1},fixed: !1,info: "bob",density: BOB_density,restitution: BOB_restitution,friction: BOB_friction}], levelsScripts = [{init: function() {
            var a = levelsScripts[0];
            getObjectByInfo("tip1").setStatic(!0);
            getObjectByInfo("tip2").setStatic(!0);
            getObjectByInfo("button_red").onclick = a.switchFan;
            var c = getObjectByInfo("fan_tiles");
            a.fan = c;
            var c = getObjectByInfo("lever"), e = getObjectByInfo("trap");
            a.trap = e;
            trapHandler.call(c, e);
            addStateBobFly();
            addStateBobInTrap()
        },switchFan: function(a) {
            var c = 
            levelsScripts[0];
            a = a.target;
            isSoundOn && mixer.play("button");
            isSoundOn && mixer.play("fan_on");
            a.onclick = null;
            a.gotoAndStop(0);
            a.setStatic(!0);
            a.hint.removeHint();
            c.fan.play()
        },ifBobHitFan: function() {
            var a = field.bob, c = levelsScripts[0].fan;
            if (c.animated && stage.hitTest(c, a) && c.x + c.width / 2 > a.x) {
                var e = 7E6 * Math.sin(c.rotation), c = 7E6 * -Math.cos(c.rotation);
                a.box2dBody.ApplyForce(new b2Vec2(e, c), new b2Vec2(a.x, a.y));
                "fly" != a.state && (a.selectedState = a.state, a.blockClick = !0, a.changeState("fly"), a.fly.gotoAndPlay(0))
            } else
                "fly" == 
                a.state && 15 > a.fly.currentFrame && (a.fly.stopFly = !0)
        },ifBobHitTrap: function() {
            var a = levelsScripts[0].trap;
            stage.hitTest(a, field.bob) && field.bob.x > a.x && a.hitBobAction && a.hitBobAction()
        },pretick: function() {
            var a = levelsScripts[0];
            a.ifBobHitFan();
            a.ifBobHitTrap()
        }}, {init: function() {
            var a = levelsScripts[1], c = field.bob;
            a.BobIsCooked = !1;
            var e = new TilesSprite(bitmaps.cooked, 50, 56, 21, 8, 3);
            e.setPosition(c.x, c.y);
            e.animDelay = 2;
            e.visible = !1;
            e.gotoAndStop(0);
            e.onenterframe = function(a) {
                20 == a.target.currentFrameX && 
                (a.target.destroy = !0)
            };
            c.cooked = e;
            c.states.push(e);
            stage.addChild(e);
            var f = getObjectByInfo("bollMc");
            stage.setInterval(function() {
                f.box2dBody.m_linearVelocity.x = -25
            }, 1);
            a.ball = f;
            c = getObjectByInfo("btn2");
            a.button = c;
            c = getObjectByInfo("ButtonSystem");
            a.mech = c;
            c = getObjectByInfo("Fire");
            c.gotoAndPlay(0);
            a.fire = c;
            c = getObjectByInfo("bridge_lvl2");
            c.box2dBody.GoToSleep();
            a.bridge = c;
            c = getObjectByInfo("Lift");
            c.moveLift = moveLift;
            c.setStatic(!0);
            a.lift = c;
            e = new Sprite(bitmaps.Lift_Mask, 67, 41);
            e.setPosition(c.x + 
            1, c.y + 95);
            e.setStatic(!0);
            stage.addChild(e);
            c.cover = e;
            c = getObjectByInfo("Enemy1_tiles");
            c.play();
            a.animateEnemy1.call(c);
            c = getObjectByInfo("Enemy2_tiles");
            c.play();
            a.animateEnemy2.call(c);
            getObjectByInfo("button_red").onclick = a.moveLift;
            c = getObjectByInfo("Lvl2_Hint1");
            c.setStatic(!0);
            a.hint1 = c;
            a.createHint();
            deStaticCover("Walkthrough");
            deStaticCover("Lvl.png")
        },createHint: function() {
            var a = field.bob, c = levelsScripts[1].button, e = stage.setInterval(function() {
                0 !== c.currentFrame && stage.clearInterval(e);
                if (125 < a.x) {
                    var f = createObject({type: "Lvl2_Hint2",x: a.x,y: a.y - 75,rotation: 0}, findObject("Lvl2_Hint2")), g = a.y - 40, h = createObject({type: "arrow_hint",x: a.x,y: g,rotation: 0}, findObject("arrow_hint"));
                    h.onenterframe = function(c) {
                        c.target.x = a.x
                    };
                    f.onenterframe = function(c) {
                        var e = c.target;
                        e.x = a.x;
                        if (200 < a.x || a.blockClick)
                            e.fadeTo(0, fps / 2, Easing.linear.easeIn, function() {
                                e.destroy = !0
                            }), h.fadeTo(0, fps / 2, Easing.linear.easeIn, function() {
                                h.destroy = !0
                            })
                    };
                    f = stage.createTween(h, "y", g, g - 10, fps / 2, Easing.linear.easeIn);
                    g = stage.createTween(h, "y", g - 10, g, fps / 2, Easing.linear.easeIn);
                    f.onfinish = g.play;
                    g.onfinish = f.play;
                    f.play();
                    stage.clearInterval(e)
                }
            }, 1)
        },createHint2: function() {
            var a = field.bob, c = levelsScripts[1].hint1;
            c.setStatic(!1);
            stage.createTween(c, "y", c.y, -10, fps / 2, Easing.linear.easeIn, function() {
                c.destroy = !0
            }).play();
            stage.setTimeout(function() {
                if ("hide" === a.state) {
                    var c = createObject({type: "Lvl2_Hint3",x: a.x - 5,y: a.y - 85,rotation: 0}, findObject("Lvl2_Hint3")), f = a.y - 40, g = createObject({type: "arrow_hint",x: a.x - 5,y: f,
                        rotation: 0}, findObject("arrow_hint"));
                    g.onenterframe = function(c) {
                        c.target.x = a.x - 5
                    };
                    c.onenterframe = function(c) {
                        var e = c.target;
                        e.x = a.x - 5;
                        a.blockClick && (e.fadeTo(0, fps / 2, Easing.linear.easeIn, function() {
                            e.destroy = !0
                        }), g.fadeTo(0, fps / 2, Easing.linear.easeIn, function() {
                            g.destroy = !0
                        }))
                    };
                    c = stage.createTween(g, "y", f, f - 10, fps / 2, Easing.linear.easeIn);
                    f = stage.createTween(g, "y", f - 10, f, fps / 2, Easing.linear.easeIn);
                    c.onfinish = f.play;
                    f.onfinish = c.play;
                    c.play()
                }
            }, fps / 2)
        },checkButtonPressed: function() {
            var a = levelsScripts[1], 
            c = a.button;
            0 === c.currentFrame && c.x + 25 > a.ball.x && (a.createHint2(), isSoundOn && mixer.play("button"), a.button.static = !1, a.mech.static = !1, buildBackground(), a.button.gotoAndPlay(0), a.mech.gotoAndPlay(0), c.onenterframe = function(a) {
                2 == a.target.currentFrame && a.target.stop()
            }, a.mech.onenterframe = function(a) {
                5 == a.target.currentFrame && a.target.stop()
            }, a.bridge.box2dBody.WakeUp(), stage.setTimeout(function() {
                a.mech.static = a.button.static = a.bridge.static = a.ball.static = !0;
                buildBackground()
            }, fps))
        },checkBobOnFire: function() {
            var a = 
            levelsScripts[1], c = a.enemy1, e = a.enemy2;
            if (!a.BobIsCooked && stage.hitTest(a.fire, field.bob)) {
                field.bob.forceSleep();
                field.bob.speed = 0;
                isSoundOn && mixer.play("caterpillar_happy");
                stage.setTimeout(function() {
                    isSoundOn && mixer.play("lvl2_boiler");
                    isSoundOn && mixer.play("punch");
                    stage.setTimeout(function() {
                        isSoundOn && mixer.play("punch");
                        isSoundOn && mixer.play("bobOnFire")
                    }, Math.floor(fps / 3))
                }, Math.floor(fps / 6));
                var f = field.bob.box2dBody.GetCenterPosition();
                f.x = a.fire.x;
                f.y = a.fire.y - 50;
                field.bob.box2dBody.SetCenterPosition(f, 
                0);
                field.bob.box2dBody.Freeze();
                field.bob.changeState("cooked");
                field.bob.cooked.gotoAndPlay(0);
                a.BobIsCooked = !0;
                stage.clearInterval(a.int1);
                stage.clearInterval(a.int2);
                c.destroy = !0;
                e.destroy = !0;
                a = new TilesSprite(bitmaps.Glad1, 58, 68, 14, 7, 2);
                a.setPosition(c.x, c.y);
                c = a;
                c.animDelay = 1;
                c.gotoAndPlay(0);
                c.onenterframe = function(a) {
                    13 == a.target.currentFrameX && a.target.gotoAndStop(13)
                };
                stage.addChild(c);
                a = new TilesSprite(bitmaps.Glad2, 71, 86, 13, 6, 3);
                a.setPosition(e.x, e.y);
                e = a;
                e.animDelay = 1;
                e.gotoAndPlay(0);
                e.onenterframe = function(a) {
                    12 == a.target.currentFrameX && a.target.gotoAndStop(12)
                };
                stage.addChild(e);
                stage.setTimeout(function() {
                    showGameOverScreen()
                }, Math.floor(1.7 * fps))
            }
        },animateEnemy1: function() {
            var a = levelsScripts[1], c = this;
            a.enemy1 = c;
            a.int1 = stage.setInterval(function() {
                if (field.bob.x > getStageCenter() + 40) {
                    c.destroy = !0;
                    var e = new TilesSprite(bitmaps.Sad1, 53, 66, 22, 6, 4);
                    e.setPosition(c.x, c.y);
                    c = e;
                    c.animDelay = 2;
                    c.gotoAndPlay(0);
                    c.onenterframe = function(a) {
                        21 == a.target.currentFrameX && a.target.gotoAndPlay(12)
                    };
                    stage.addChild(c);
                    stage.clearInterval(a.int1)
                }
            }, 1)
        },animateEnemy2: function() {
            var a = levelsScripts[1], c = this;
            a.enemy2 = c;
            a.int2 = stage.setInterval(function() {
                if (field.bob.x > getStageCenter() + 40) {
                    isSoundOn && mixer.play("caterpillar_sad");
                    c.destroy = !0;
                    var e = new TilesSprite(bitmaps.Sad2, 72, 86, 28, 5, 6);
                    e.setPosition(c.x, c.y);
                    c = e;
                    c.animDelay = 2;
                    c.gotoAndPlay(0);
                    c.onenterframe = function(a) {
                        27 == a.target.currentFrameX && a.target.gotoAndPlay(9)
                    };
                    stage.addChild(c);
                    stage.clearInterval(a.int2)
                }
            }, 1)
        },moveLift: function() {
            var a = 
            levelsScripts[1].lift;
            isSoundOn && mixer.play("button");
            "down" == a.direction ? (a.moveLift("up"), a.direction = "up") : (a.moveLift("down"), a.direction = "down")
        },pretick: function() {
            var a = levelsScripts[1];
            a.checkButtonPressed();
            a.checkBobOnFire()
        }}, {init: function() {
            var a = levelsScripts[2];
            a.terminatorAppear = !1;
            a.btn = getObjectByInfo("btn");
            a.btn.setStatic(!0);
            var c = addBobState("look_at_terminator", 62, 48, 20);
            c.state = 0;
            c.onenterframe = a.bobChangeLookState;
            c = getObjectByInfo("terminator_tiles");
            c.gotoAndStop(17);
            c.scaleX = 
            -1;
            c.animDelay = 2;
            c.box2dBody.GoToSleep();
            c.onbox2dsync = function(a) {
                var c = new Vector(-a.target.syncX, -a.target.syncY);
                a.target.x += c.x;
                a.target.y += c.y;
                a.target.rotation = 0
            };
            a.terminator = c;
            var e = getObjectByInfo("exit"), c = getObjectByInfo("fence");
            c.setZIndex(1);
            c.animDelay = 2;
            c.onenterframe = function(a) {
                var c = a.target;
                7 == c.currentFrame && (c.stop(), stage.setTimeout(function() {
                    c.setStatic(!0);
                    e.setStatic(!0)
                }, 1))
            };
            a.fence = c;
            var c = getObjectByCustomInfo("bridge1"), f = getObjectByCustomInfo("bridge2");
            c.restrict = 
            [c.x - 33, c.x - 1];
            f.restrict = [f.x + 1, f.x + 33];
            c.setStatic(!0);
            f.setStatic(!0);
            a.bridge1 = c;
            a.bridge2 = f;
            a.earth1 = getObjectByInfo("earth1_lvl3");
            a.earth2 = getObjectByInfo("earth2_lvl3");
            a.earth1.setStatic(!0);
            c = getObjectByInfo("btn_lvl3_green");
            c.onclick = a.greenButtonAction;
            c.setStatic(!0);
            c = getObjectByInfo("btn_lvl3_red");
            for (f = 0; f < c.length; f++)
                c[f].onclick = a.redButtonClick, c[f].setStatic(!0);
            a.redButtons = c;
            getObjectByInfo("numbers_lvl3").setStatic(!0);
            c = getObjectByInfo("doors_lvl3");
            c.setStatic(!0);
            c.onenterframe = 
            function(a) {
                7 == a.target.currentFrame && (a.target.stop(), a.target.setStatic(!0))
            };
            a.doors = c;
            a.lava = getObjectByInfo("lava_lvl3");
            a.lava.setStatic(!0);
            deStaticCover("lvlMapIngame");
            deStaticCover("restartIngame");
            deStaticCover("score")
        },createHint: function() {
            createObject({type: "Lvl3_Hint1",x: 185,y: 85,rotation: 0}, findObject("Lvl3_Hint1")).setStatic(!0);
            var a = createObject({type: "arrow_hint5",x: 105,y: 65,rotation: 0.8}, findObject("arrow_hint5")), c = fps / 2, e = stage.createTween(a, "y", 65, 55, c, Easing.linear.easeIn), 
            f = stage.createTween(a, "y", 55, 65, c, Easing.linear.easeIn), g = stage.createTween(a, "x", 105, 100, c, Easing.linear.easeIn), a = stage.createTween(a, "x", 100, 105, c, Easing.linear.easeIn);
            e.onfinish = f.play;
            f.onfinish = e.play;
            g.onfinish = a.play;
            a.onfinish = g.play;
            g.play();
            e.play()
        },redButtonClick: function(a) {
            7 === levelsScripts[2].doors.currentFrame && (isSoundOn && mixer.play("button"), a.target.setStatic(!1), a.target.gotoAndStop(1), a.target.setStatic(!0), a.target.onclick = null)
        },bobChangeLookState: function(a) {
            a = a.target;
            var c = 
            field.bob;
            switch (a.state) {
                case 0:
                    9 == a.currentFrame && (a.state = 1, c.speed = -SPEED_WALK);
                    break;
                case 1:
                    5 == a.currentFrame && a.play();
                    9 == a.currentFrame && a.animated && a.rewindAndStop(9, 5);
                    c.speed -= 2;
                    break;
                case 2:
                    15 == a.currentFrame && a.animated && a.gotoAndPlay(11);
                    break;
                case 3:
                    19 == a.currentFrame && a.animated && (a.stop(), c.changeState(1 == c.selectedSpeed ? "walk" : "run"), c.forceWakeUp(), c.blockClick = !1);
                    break;
                default:
                    console.log("default state")
            }
        },greenButtonAction: function(a) {
            var c = levelsScripts[2];
            if (7 === c.doors.currentFrame) {
                isSoundOn && 
                mixer.play("lvl3_dzin");
                a.target.setStatic(!1);
                a.target.gotoAndStop(1);
                a.target.setStatic(!0);
                for (var e = 0; e < c.redButtons.length; e++) {
                    var f = c.redButtons[e];
                    f.setStatic(!1);
                    f.gotoAndStop(1);
                    f.setStatic(!0);
                    f.onclick = null
                }
                isSoundOn && mixer.play("bridge2");
                moveBridge(c.bridge1, "x", !1, 3, c.earth1);
                moveBridge(c.bridge2, "x", !0, 3);
                a.target.onclick = null
            }
        },checkAppiarTerminator: function() {
            var a = levelsScripts[2], c = field.bob;
            !a.terminatorAppear && 215 < c.x && (isSoundOn && mixer.play("lvl3_terminator_appear"), a.terminator.onenterframe = 
            function(a) {
                16 == a.target.currentFrameX && a.target.stop()
            }, a.terminator.play(), a.fence.play(), a.terminatorAppear = !0, stage.setTimeout(function() {
                c.box2dBody.GoToSleep();
                c.changeState("look_at_terminator");
                c.look_at_terminator.gotoAndPlay(0);
                stage.setTimeout(function() {
                    isSoundOn && mixer.play("bob_skeleton")
                }, 3 * c.look_at_terminator.animDelay);
                c.forceSleep();
                c.box2dBody.WakeUp();
                c.blockClick = !0;
                stage.setTimeout(function() {
                    var c = new Sprite(bitmaps.textOfTerminator, 64, 50, 5);
                    c.x = a.terminator.x - 60;
                    c.y = a.terminator.y - 
                    30;
                    c.scaleX = 0.1;
                    c.scaleY = 0.1;
                    stage.addChild(c);
                    a.text = c;
                    stage.createTween(c, "scaleX", 0.1, 1, fps / 2, Easing.linear.easeIn).play();
                    stage.createTween(c, "scaleY", 0.1, 1, fps / 2, Easing.linear.easeIn).play()
                }, Math.floor(fps))
            }, 9 * a.terminator.animDelay))
        },ifPressButton: function() {
            var a = field.bob, c = levelsScripts[2], e = c.terminator;
            0 == c.btn.currentFrame && stage.hitTest(a, c.btn) && (isSoundOn && mixer.play("button"), isSoundOn && mixer.play("lvl3_doors"), c.btn.setStatic(!1), c.btn.gotoAndStop(1), c.btn.setStatic(!0), a.look_at_terminator.state = 
            2, a.look_at_terminator.gotoAndPlay(11), stage.setTimeout(function() {
                a.speed = 0
            }, Math.floor(fps / 4)), e.syncX = 6, e.syncY = 0, e.y -= 4, e.animDelay = 1, c.changeTerminatorImage(bitmaps.terminator_move, 52, 42, 8, 8, 1), c.moveTerminator.call(e), stage.createTween(c.text, "scaleX", 1, 0.1, fps / 2, Easing.linear.easeIn).play(), e = stage.createTween(c.text, "scaleY", 1, 0.1, fps / 2, Easing.linear.easeIn), e.play(), e.onfinish = function() {
                c.text.destroy = !0
            }, c.doors.setStatic(!1), c.doors.play())
        },moveTerminator: function() {
            var a = this;
            a.box2dBody.WakeUp();
            a.int = stage.setInterval(function() {
                a.box2dBody.m_linearVelocity.x = -SPEED_WALK
            }, 1)
        },ifBobHitTerminator: function() {
            var a = levelsScripts[2], c = field.bob, e = a.terminator;
            -1 != e.bitmap.src.indexOf("move") && stage.hitTest(c, e) && (a.changeTerminatorImage(bitmaps.terminator_attack, 80, 44, 6, 6, 1), e.onenterframe = function(f) {
                f = f.target;
                5 == f.currentFrameX && -1 != f.bitmap.src.indexOf("attack") && (f.scaleX = 1, f.animDelay = 2, e.syncX = 34, e.syncY = 12, a.changeTerminatorImage(bitmaps.terminator_fight, 112, 91, 42, 11, 4), f.box2dBody.GoToSleep(), 
                c[c.state].opacity = 0, world.DestroyBody(c.box2dBody), stage.setTimeout(function() {
                    isSoundOn && mixer.play("terminator_fight")
                }, Math.floor(fps / 5)));
                41 == f.currentFrameX && (showGameOverScreen(), f.stop())
            })
        },ifTerminatorFall: function() {
            var a = levelsScripts[2], c = levelsScripts[2].terminator, e = field.bob;
            c.die || 208 > c.y || (c.die = !0, world.DestroyBody(c.box2dBody), a.lava.setStatic(!1), isSoundOn && mixer.play("lvl2_boiler"), stage.setTimeout(function() {
                c.y += 18;
                c.x += 3;
                c.scaleX = -0.9;
                c.scaleY = 0.9;
                stage.clearInterval(c.int);
                a.changeTerminatorImage(bitmaps.terminator_die, 62, 90, 16, 8, 2);
                c.onenterframe = function(c) {
                    14 == c.target.currentFrameX && (c.target.destroy = !0, e.look_at_terminator.state = 3, e.look_at_terminator.gotoAndPlay(16), isSoundOn && mixer.play("bridge1"), moveBridge(a.bridge1, "x", !0, 3, a.earth1), moveBridge(a.bridge2, "x", !1, 3), stage.setTimeout(a.createHint, fps))
                }
            }, 1))
        },changeTerminatorImage: function(a, c, e, f, g, h) {
            var k = levelsScripts[2].terminator;
            k.bitmap = a;
            k.width = c;
            k.height = e;
            k.framesCount = f;
            k.totalFrames = g;
            k.totalLayers = 
            h;
            spritesSync({target: k});
            k.gotoAndPlay(0)
        },pretick: function() {
            var a = levelsScripts[2];
            a.checkAppiarTerminator();
            a.ifPressButton();
            a.ifBobHitTerminator();
            a.ifTerminatorFall()
        }}, {init: function() {
            var a = levelsScripts[3], c = getObjectByInfo("lever");
            c.onenterframe = leverOnenterframe;
            c.onclick = a.leverAction;
            c = getObjectByInfo("antiant_anim");
            c.animDelay = 2;
            c.play();
            c.setZIndex(12);
            a.antiant = c;
            c = getObjectByInfo("hose");
            c.setStatic(!0);
            c.onenterframe = function(a) {
                8 == a.target.currentFrame && (a.target.gotoAndStop(0), 
                a.target.setStatic(!0))
            };
            a.hose = c;
            for (var c = getObjectByInfo("btn3"), e = 0; e < c.length; e++) {
                var f = c[e];
                2 !== f.custom ? addHint.call(f) : f.gotoAndStop(1);
                f.onclick = a.btn3Action
            }
            a.btns = c;
            a.btns_right = getObjectByInfo("btn");
            a.bridge = getObjectByInfo("bridge_lvl4");
            a.bridge.setStatic(!0);
            a.log = getObjectByInfo("log_lvl4");
            a.log.setStatic(!0);
            c = getObjectByInfo("earth_fixed");
            c[0].setStatic(!0);
            c[1].setStatic(!0);
            c = getObjectByCustomInfo("earth1");
            e = getObjectByCustomInfo("earth2");
            f = getObjectByCustomInfo("earth3");
            c.restrict = [c.y - 33, c.y];
            e.restrict = [e.y, e.y + 33];
            f.restrict = [f.y - 33, f.y];
            c.setStatic(!0);
            e.setStatic(!0);
            f.setStatic(!0);
            a.earth1 = c;
            a.earth2 = e;
            a.earth3 = f;
            a.earthNum = 1;
            a.createAnt();
            deStaticCover("lvlMapIngame");
            deStaticCover("restartIngame");
            deStaticCover("score")
        },btn3Action: function(a) {
            a = a.target;
            var c = levelsScripts[3], e = c.btns;
            if (1 != a.currentFrame) {
                for (var f = 0; f < e.length; f++) {
                    var g = e[f];
                    g.gotoAndStop(0);
                    g.hint && !g.hint.destroy || addHint.call(g)
                }
                isSoundOn && mixer.play("button3");
                a.gotoAndStop(1);
                a.hint.removeHint();
                c.changeStateOfBridge(a.custom)
            }
        },changeStateOfBridge: function(a) {
            var c, e, f, g, h = levelsScripts[3], k = h.bridge, l = k.box2dBody, m = {}, n = [];
            h.log.setStatic(!1);
            k.setStatic(!1);
            switch (a) {
                case 1:
                    c = 93;
                    e = -0.3665191429188092;
                    break;
                case 2:
                    c = 117;
                    e = 0;
                    break;
                case 3:
                    c = 141;
                    e = 0.3665191429188092;
                    break;
                default:
                    console.log("default state")
            }
            f = l.GetCenterPosition().x;
            g = l.GetCenterPosition().y;
            var p = (e - l.m_rotation) / 10;
            if (0 > p && !h.antiant.animated && (a = l.GetContactList())) {
                for (a; a; a = a.next)
                    if (a.other.sprite && "ant" == a.other.sprite.info && 
                    a.other.sprite.x < k.x + 60) {
                        var q = a.other, r = getDistance({x: 244,y: 109}, q.GetCenterPosition());
                        q.antDist = r * Math.tan(p);
                        n.push(q)
                    }
                a = l.GetContactList()
            }
            g = 117;
            var s = stage.setInterval(function() {
                var a = l.m_rotation + p, q = new Vector(-69, 0);
                q.rotate(-a);
                m.x = f;
                m.y = g - q.y;
                for (q = 0; q < n.length; q++)
                    if (n[q].antDist) {
                        var r = n[q].GetCenterPosition();
                        n[q].SetOriginPosition(new b2Vec2(r.x, r.y + n[q].antDist), 0)
                    }
                l.SetOriginPosition(m, a);
                if (0 < p && a > e || 0 > p && a < e)
                    stage.clearInterval(s), l.SetOriginPosition(new b2Vec2(313, c), e), stage.setTimeout(function() {
                        k.setStatic(!0);
                        h.log.setStatic(!0)
                    }, 1)
            }, 1)
        },createAnt: function() {
            var a = levelsScripts[3], c = createObject({type: "ant",x: -15,y: 105,rotation: 0}, findObject("ant"));
            c.onenterframe = function(c) {
                var f = c.target;
                f.box2dBody.m_linearVelocity.x = 1.5 * SPEED_WALK;
                f.x > a.antiant.x && a.antiant.animated && (world.DestroyBody(f.box2dBody), f.onenterframe = null, c = stage.createTween(f, "y", f.y, f.y - 30, Math.floor(fps / 5), Easing.linear.easeIn), c.play(), isSoundOn && mixer.play("lvl4_antiant"), c.onfinish = function(c) {
                    f.destroy = !0;
                    a.hose.setStatic(!1);
                    a.hose.gotoAndPlay(0)
                });
                500 < f.x && deleteObject(f)
            };
            c.onbox2dsync = a.antSync;
            stage.setTimeout(a.createAnt, 1.5 * fps)
        },antSync: function(a) {
            a.target.x += -a.target.syncX;
            a.target.y += -a.target.syncY;
            a.target.rotation = 0
        },leverAction: function(a) {
            a = a.target;
            var c = levelsScripts[3];
            0 === a.currentFrame && (isSoundOn && (mixer.play("lever"), mixer.play("fan_off")), a.setStatic(!1), a.play(), c.antiant.gotoAndStop(14), c.antiant.setStatic(!0))
        },checkHitAntWithBtn: function() {
            var a = levelsScripts[3], c = [];
            if (!(3 < a.earthNum)) {
                for (var e = 
                0; e < stage.objects.length; e++)
                    "ant" == stage.objects[e].info && c.push(stage.objects[e]);
                for (e = 0; e < a.btns_right.length; e++) {
                    var f = a.btns_right[e];
                    if (1 != f.currentFrame)
                        for (var g = 0; g < c.length; g++)
                            410 < c[g].x && stage.hitTest(f, c[g]) && (isSoundOn && (mixer.play("button2"), mixer.play("lvl4_bridges")), f.gotoAndStop(1), moveBridge(a["earth" + a.earthNum], "y", 2 == a.earthNum ? !0 : !1), a.earthNum++, function(a) {
                                stage.setTimeout(function() {
                                    a.setStatic(!0)
                                }, 1)
                            }(f))
                }
            }
        },pretick: function() {
            levelsScripts[3].checkHitAntWithBtn()
        }}, 
    {init: function() {
            var a = levelsScripts[4], c = getObjectByInfo("fireball");
            c.setZIndex(20);
            a.fireball = c;
            var e = new Sprite(bitmaps.fire_lvl5, 37, 52, 10);
            e.x = 50;
            e.y = 140;
            e.scaleX = 1.42;
            e.scaleY = 1.42;
            e.onenterframe = function(a) {
                var e = new Vector(1, -12);
                e.rotate(-a.target.rotation);
                a.target.x = c.x + e.x;
                a.target.y = c.y + e.y
            };
            stage.addChild(e);
            a.fire = e;
            a.cancelSpeed = getObjectByCustomInfo("cancelSpeed");
            e = getObjectByInfo("lever");
            e.onenterframe = leverOnenterframe;
            e.onclick = a.leverAction;
            e = getObjectByInfo("btn2");
            e.onenterframe = 
            function(a) {
                2 == a.target.currentFrame && a.target.animated && (a.target.stop(), a.target.setStatic(!0))
            };
            a.btn = e;
            fence = getObjectByInfo("moving_fence");
            fence.animDelay = 2;
            fence.onenterframe = function(c) {
                5 == c.target.currentFrame && (c.target.destroy = !0, stage.setTimeout(function() {
                    a.earth2.setStatic(!0)
                }, 1))
            };
            a.fence = fence;
            bridge = getObjectByInfo("bridge_lvl5");
            bridge.restrict = [bridge.x, bridge.x + 50];
            bridge.setStatic(!0);
            a.bridge = bridge;
            a.earth1 = getObjectByInfo("earth1_lvl5");
            a.earth2 = getObjectByInfo("earth2_lvl5");
            a.earth1.setStatic(!0);
            getObjectByInfo("Lvl5_Hint1").setStatic(!0);
            a.moveArrow(getObjectByInfo("arrow_hint5"));
            deStaticCover("PanelSpeed");
            deStaticCover("SpeedBob")
        },moveArrow: function(a) {
            var c = a.y, e = a.x, f = fps / 2, g = stage.createTween(a, "y", c, c - 4, f, Easing.linear.easeIn), c = stage.createTween(a, "y", c - 4, c, f, Easing.linear.easeIn), h = stage.createTween(a, "x", e, e - 10, f, Easing.linear.easeIn);
            a = stage.createTween(a, "x", e - 10, e, f, Easing.linear.easeIn);
            g.onfinish = c.play;
            c.onfinish = g.play;
            h.onfinish = a.play;
            a.onfinish = 
            h.play;
            h.play();
            g.play()
        },leverAction: function(a) {
            a = a.target;
            var c = levelsScripts[4].bridge;
            0 === a.currentFrame && (a.setStatic(!1), a.cover.setStatic(!1), a.play(), isSoundOn && (mixer.play("lever"), mixer.play("bridge2")), moveBridge(c, "x", !0, 5, levelsScripts[4].earth1))
        },ifPressButton: function() {
            var a = field.bob, c = levelsScripts[4], e = c.btn;
            !e.pressed && stage.hitTest(a, e) && (e.pressed = !0, stage.setTimeout(function() {
                isSoundOn && mixer.play("button2");
                e.play();
                world.DestroyBody(c.fence.box2dBody);
                c.fence.play();
                var f = 
                c.fire;
                stage.createTween(f, "rotation", 0, -0.5, fps / 2, Easing.linear.easeIn).play();
                stage.setTimeout(function() {
                    isSoundOn && mixer.play("lvl5_fireball", !0, !0, 1);
                    loopSound = "lvl5_fireball";
                    var e = stage.setInterval(function() {
                        c.fireball.box2dBody.m_linearVelocity.x = SPEED_RUN;
                        stage.hitTest(a, c.cancelSpeed) ? field.cancelSpeed = !0 : field.cancelSpeed = !1;
                        stage.hitTest(c.fireball, c.cancelSpeed) && (stage.createTween(f, "rotation", -0.5, 0, fps / 2, Easing.linear.easeIn).play(), loopSound = !1, mixer.stop(1), stage.clearInterval(e))
                    }, 
                    1)
                }, c.fence.animDelay)
            }, Math.floor(fps / 9)))
        },ifBobFalls: function() {
            260 < field.bob.y && bobFalls()
        },ifBobHitFireball: function() {
            var a = levelsScripts[4].fireball.box2dBody.GetContactList();
            for (a; a; a = a.next)
                a.other.sprite && -1 !== a.other.sprite.bitmap.src.indexOf("Bob") && bobBurns()
        },pretick: function() {
            var a = levelsScripts[4];
            a.ifPressButton();
            a.ifBobFalls();
            a.ifBobHitFireball()
        }}, {init: function() {
            var a = levelsScripts[5], c = getObjectByInfo("caterpillar");
            c.scaleX = -1;
            c.box2dBody.m_invI = 0;
            c.play();
            c.state = 1;
            c.setZIndex(16);
            a.caterpillar = c;
            c = getObjectByInfo("lever");
            c.onenterframe = leverOnenterframe;
            c.onclick = a.leverAction;
            c = getObjectByInfo("lift_lvl6");
            c.setStatic(!0);
            c.restrict = [c.y - 91, c.y];
            a.lift = c;
            c = getObjectByInfo("spring_lvl6");
            c.onenterframe = function(a) {
                6 == a.target.currentFrame && a.target.gotoAndStop(0)
            };
            a.spring = c;
            getObjectByInfo("button_red").onclick = a.punch;
            c = getObjectByInfo("btn2");
            c.onenterframe = function(a) {
                0 != a.target.currentFrame && 2 != a.target.currentFrame || a.target.stop()
            };
            c.scaleX = 0.85;
            c.scaleY = 0.85;
            a.btn = 
            c;
            a.indicator_left = getObjectByCustomInfo("indicator_left");
            a.indicator_right = getObjectByCustomInfo("indicator_right");
            a.earth = getObjectByInfo("earth_lvl6");
            a.earth.setStatic(!0);
            c = getObjectByInfo("bridge_lvl6");
            c.restrict = [c.x - 40, c.x - 10];
            c.setStatic(!0);
            a.bridge = c;
            deStaticCover("score")
        },punch: function(a) {
            a = levelsScripts[5];
            var c = a.caterpillar, e = c.box2dBody;
            0 === a.spring.currentFrame && (a.spring.play(), isSoundOn && mixer.play("spring"), stage.hitTest(a.spring, c) && (isSoundOn && mixer.play("punch"), a = (getDistance(a.spring, 
            c) - 35) / 7, stage.setTimeout(function() {
                e.ApplyImpulse(new b2Vec2(13E5, 0), e.GetCenterPosition());
                c.impulse = !0;
                if (4 > c.state) {
                    c.bitmap = bitmaps["caterpillar_blow" + c.state];
                    switch (c.state) {
                        case 1:
                            c.totalFrames = 9;
                            c.width = 64;
                            c.height = 38;
                            break;
                        case 2:
                            c.totalFrames = 8;
                            c.width = 65;
                            c.height = 36;
                            break;
                        case 3:
                            c.totalFrames = 9;
                            c.width = 68;
                            c.height = 36;
                            break;
                        default:
                            console.log("default")
                    }
                    c.state++;
                    c.gotoAndPlay(0)
                }
                var a = stage.setInterval(function() {
                    20 > e.GetLinearVelocity().Length() && (c.impulse = !1, stage.clearInterval(a))
                }, 
                1)
            }, Math.floor(a))))
        },leverAction: function(a) {
            var c = levelsScripts[5], e = a.target;
            a = c.lift;
            var f = c.caterpillar;
            0 === e.currentFrame && (isSoundOn && (mixer.play("lever"), mixer.play("bridge2")), e.setStatic(!1), e.cover.setStatic(!1), e.play(), moveBridge(a, "y", !1, 8), a.x + a.width / 2 > f.x - f.width / 2 && a.x - a.width / 2 < f.x + f.width / 2 - 5 && (e = c.caterpillar.box2dBody.GetCenterPosition(), c.caterpillar.box2dBody.WakeUp(), a.x + a.width / 2 > f.x - f.width / 2 + 15 ? (console.log("move up"), f.box2dBody.ApplyForce(new b2Vec2(0, -8E7), e)) : (f.box2dBody.ApplyForce(new b2Vec2(3E7, 
            -7E7), e), console.log("move diagonal"))))
        },moveCaterpillar: function() {
            var a = levelsScripts[5].caterpillar.box2dBody;
            a.GetContactList() && !a.sprite.impulse && (a.m_linearVelocity.x = -SPEED_WALK)
        },ifPressButton: function() {
            var a = levelsScripts[5], c = a.btn, e = a.caterpillar;
            stage.hitTest(c, e) && e.y < c.y && e.x - 28 < c.x ? 2 !== c.currentFrame && (isSoundOn && (mixer.play("button"), mixer.play("bridge2")), c.gotoAndPlay(1), a.indicator_left.gotoAndStop(1), a.indicator_right.gotoAndStop(1), moveBridge(a.bridge, "x", !1, 10, a.earth)) : 0 !== 
            c.currentFrame && (isSoundOn && (mixer.play("button2"), mixer.play("bridge1")), c.gotoAndPlay(4), a.indicator_left.gotoAndStop(0), a.indicator_right.gotoAndStop(0), moveBridge(a.bridge, "x", !0, 10, a.earth))
        },ifBobFalls: function() {
            260 < field.bob.y && bobFalls()
        },ifCaterpillarEatsBob: function() {
            var a = levelsScripts[5].caterpillar, c = field.bob;
            !a.eat && stage.hitTest(c, a) && c.x + c.width < a.x && c.y < a.y && (a.bitmap = bitmaps.caterpillar_eat2, a.totalFrames = 13, a.width = 108, a.height = 58, a.syncX = 25, a.syncY = 20, a.x -= 22, a.y -= 13, world.DestroyBody(c.box2dBody), 
            isSoundOn && mixer.play("caterpillar_eat"), stage.setTimeout(function() {
                c[c.state].visible = !1;
                c.blockClick = !0
            }, 4 * a.animDelay), a.onenterframe = function(c) {
                12 == c.target.currentFrame && (a.stop(), a.bitmap = bitmaps.caterpillar_move2, a.totalFrames = 12, a.width = 86, a.height = 38, a.animDelay = 2, a.syncX = 35, a.x -= 14, a.syncY = 9, a.y += 11, a.gotoAndPlay(6), a.onenterframe = function(a) {
                    10 == a.target.currentFrame && a.target.gotoAndPlay(6)
                }, stage.setTimeout(showGameOverScreen, fps))
            }, a.gotoAndPlay(0), a.eat = !0)
        },pretick: function() {
            var a = 
            levelsScripts[5];
            a.moveCaterpillar();
            a.ifPressButton();
            a.ifBobFalls();
            a.ifCaterpillarEatsBob()
        }}, {init: function() {
            var a = levelsScripts[6], c = getObjectByInfo("lever");
            c.onenterframe = leverOnenterframe;
            c.onclick = a.leverAction;
            c = getObjectByInfo("bridge_lvl7");
            c.setStatic(!0);
            c.restrict = [c.y, c.y + 55];
            a.bridge = c;
            c = getObjectByInfo("earth_lvl7");
            c.setStatic(!0);
            a.earth = c;
            a.magnet = getObjectByInfo("magnet_tiles");
            a.magnet.onenterframe = function(a) {
                27 === a.target.currentFrameX && a.target.gotoAndPlay(2)
            };
            a.wire = getObjectByInfo("wire_lvl7");
            a.wire.onenterframe = function(a) {
                9 == a.target.currentFrame && a.target.gotoAndPlay(1)
            };
            a.wire.gotoAndStop(0);
            c = getObjectByInfo("stripes");
            c[0].play();
            c[1].play();
            c[0].visible = !1;
            c[1].visible = !1;
            a.stripes = c;
            getObjectByInfo("button_red").onclick = a.buttonMagnetAction;
            c = createRope(23, {x: 225,y: 50}, 1E4).ropes;
            a.ball = a.createBall(c[c.length - 1]);
            deStaticCover("SpeedIndicatorMc");
            deStaticCover("SpeedFastBtn");
            deStaticCover("score")
        },createBall: function(a) {
            var c = createObject({type: "ball_lvl7",x: a.x,y: a.y + 20,rotation: 0}, 
            findObject("ball_lvl7"));
            box2DCreateRevoluteJoint(world, a.box2dBody, c.box2dBody, {x: a.x,y: a.y + 3});
            box2DCreateDistanceJoint(world, a.box2dBody, c.box2dBody, {x: a.x,y: a.y + 3}, {x: a.x,y: a.y + 3});
            return c
        },buttonMagnetAction: function() {
            var a = levelsScripts[6], c = a.magnet, e = a.ball, f = a.stripes;
            isSoundOn && mixer.play("button");
            f[0].visible = !f[0].visible;
            f[1].visible = !f[1].visible;
            c.animated ? (c.gotoAndStop(0), a.wire.gotoAndStop(0), stage.clearInterval(e.int)) : (isSoundOn && mixer.play("magnet_on"), c.play(), a.wire.play(), 
            e.int = stage.setInterval(function() {
                var a = e.box2dBody.GetCenterPosition().Copy(), a = new b2Vec2(c.x - a.x, c.y + 15 - a.y);
                a.Normalize();
                a.Multiply(2E9);
                var f = new Vector(-5, 20);
                f.rotate(-e.rotation);
                e.box2dBody.ApplyForce(new b2Vec2(a.x, a.y), new b2Vec2(e.x + f.x, e.y + f.y))
            }, 1))
        },ifFreezeBall: function() {
            var a = levelsScripts[6], c = a.ball, e = a.magnet;
            e.animated && stage.hitTest(e, c) && a.customFreeze(c.box2dBody)
        },customFreeze: function(a) {
            a.m_flags |= b2Body.e_frozenFlag;
            a.m_linearVelocity.SetZero();
            a.m_angularVelocity = 0
        },
        ifBobCancelSpeed: function(a) {
            stage.hitTest(levelsScripts[6].ball, field.bob) ? field.cancelSpeed = !0 : field.cancelSpeed = !1
        },leverAction: function(a) {
            var c = levelsScripts[6];
            a = a.target;
            0 === a.currentFrame && (isSoundOn && (mixer.play("lever"), mixer.play("bridge2")), a.setStatic(!1), a.cover.setStatic(!1), a.play(), moveBridge(c.bridge, "y", !0, 5, c.earth))
        },ifBobFalls: function() {
            250 < field.bob.y && bobFalls()
        },pretick: function() {
            var a = levelsScripts[6];
            a.ifBobFalls();
            a.ifBobCancelSpeed();
            a.ifFreezeBall()
        }}, {init: function() {
            var a = 
            levelsScripts[7], c = getObjectByInfo("skeleton");
            c.box2dBody.GoToSleep();
            a.skeleton = c;
            c = getObjectByInfo("btn2");
            c.scaleX = 0.7;
            c.scaleY = 0.7;
            c.onenterframe = function(a) {
                2 == a.target.currentFrame && a.target.stop()
            };
            a.btn = c;
            c = getObjectByInfo("slider");
            c.setStatic(!0);
            addHint.call(c);
            var e = getObjectByInfo("Baraban");
            e.animDelay = 2;
            processSlider.call(c, e);
            a.platform = e;
            c = getObjectByInfo("electricity_10");
            c.scaleX = 0.6;
            c.scaleY = 0.6;
            c.play();
            a.elec = c;
            c = getObjectByInfo("spring_lvl8");
            e = getObjectByInfo("button_red");
            punch.call(e, c, field.bob, new b2Vec2(485E4, 0));
            c = getObjectByInfo("bridge2_lvl8");
            c.setStatic(!0);
            a.bridge2 = c;
            field.cancelSpeed = !1;
            e = getObjectByInfo("bridge_lvl8");
            e.setStatic(!0);
            a.bridge = e;
            a = getObjectByCustomInfo("button_left");
            e = getObjectByCustomInfo("button_right");
            getObjectByInfo("button_blue_mid").setStatic(!0);
            rotateHandler.call(c.box2dBody, a, -Math.PI / 6);
            rotateHandler.call(c.box2dBody, e, Math.PI / 5);
            getObjectByInfo("box_lvl8");
            addStateBobShocked()
        },bobSlither: function() {
            var a = levelsScripts[7].bridge2, 
            c = field.bob;
            220 < c.y || (stage.hitTest(a, c) ? field.cancelSpeed = !0 : field.cancelSpeed = !1)
        },ifPressButton: function() {
            var a = levelsScripts[7], c = field.bob, e = a.btn, f = a.bridge;
            if (0 == e.currentFrame && stage.hitTest(c, e)) {
                isSoundOn && (mixer.play("button"), mixer.play("bridge2"));
                e.play();
                f.setStatic(!1);
                var g = f.box2dBody, h = g.m_position;
                h.y -= 38;
                var k = {}, l = stage.setInterval(function() {
                    var a = g.m_rotation - 0.03, c = new Vector(0, 38);
                    c.rotate(-a);
                    k.x = h.x + c.x;
                    k.y = h.y + c.y;
                    g.SetOriginPosition(k, a);
                    a < -Math.PI / 4 && (stage.clearInterval(l), 
                    stage.setTimeout(function() {
                        f.setStatic(!0)
                    }, 2))
                }, 1)
            }
        },ifAppearSkeleton: function() {
            var a = field.bob, c = levelsScripts[7].skeleton;
            if (!c.animated && a.x < c.x + c.width + 10 && a.x > c.x + c.width && 200 < a.y && 0 > a.box2dBody.m_linearVelocity.x) {
                isSoundOn && mixer.play("lvl8_skeleton");
                for (var e = createRope(10, {x: 318,y: 95}, 90), f = e.ropes, g = e.begin, e = 0; e < f.length; e++)
                    f[e].box2dBody.GoToSleep(), f[e].visible = !1;
                var e = f[f.length - 1], h = {x: e.x,y: e.y};
                box2DCreateRevoluteJoint(world, e.box2dBody, c.box2dBody, h);
                box2DCreateDistanceJoint(world, 
                e.box2dBody, c.box2dBody, h, h);
                c.play();
                stage.setTimeout(function() {
                    for (var a = 0; a < f.length; a++)
                        f[a].visible = !0
                }, Math.floor(fps / 1.5));
                var k = stage.setInterval(function() {
                    var a = g.GetCenterPosition();
                    a.y += 4;
                    g.SetOriginPosition(a, 0);
                    155 < a.y && stage.clearInterval(k)
                }, 1);
                stage.setTimeout(function() {
                    isSoundOn && mixer.play("bob_skeleton");
                    a[a.state].visible = !1;
                    a.state = null;
                    world.DestroyBody(a.box2dBody);
                    a.blockClick = !0;
                    var c = new Sprite(bitmaps.bobAfraid, 168, 50, 15);
                    c.x = a.x + (c.width / 2 - a.width / 2);
                    c.y = a.y - 4;
                    c.animDelay = 
                    2;
                    c.setZIndex(15);
                    c.onenterframe = function(a) {
                        14 == a.target.currentFrame && a.target.animated && (a.target.stop(), showWinScreen())
                    };
                    stage.addChild(c)
                }, Math.floor(fps / 1.7))
            }
        },pretick: function() {
            var a = levelsScripts[7];
            ifBobShocked(a.elec);
            a.bobSlither();
            a.ifPressButton();
            a.ifAppearSkeleton()
        }}, {init: function() {
            for (var a = levelsScripts[8], c = getObjectByInfo("fly_lvl9"), e = 0; e < c.length; e++)
                c[e].play(), c[e].animDelay = 2;
            c[1].scaleX = -1;
            a.flies = c;
            c = getObjectByInfo("fire_lvl9");
            c.play();
            c.animDelay = 2;
            a.fire = c;
            c = getObjectByInfo("bbq");
            c.setStatic(!0);
            a.bbq = c;
            c = getObjectByInfo("trampoline");
            c.onenterframe = function(a) {
                5 == a.target.currentFrame && a.target.gotoAndStop(0)
            };
            a.trampoline = c;
            var e = getObjectByCustomInfo("button_left"), f = getObjectByCustomInfo("button_right");
            moveBridgeMouseDown.call(c.box2dBody, e, 143);
            moveBridgeMouseDown.call(c.box2dBody, f, 340);
            getObjectByInfo("button_blue_mid").setStatic(!0);
            c = getObjectByInfo("lever");
            c.onenterframe = leverOnenterframe;
            c.onclick = a.leverAction;
            c.cover.scaleX = 0.75;
            c.cover.scaleY = 0.8;
            addStateBobFly();
            deStaticCover("lvlMapIngame");
            deStaticCover("restartIngame");
            deStaticCover("score")
        },leverAction: function(a) {
            var c = levelsScripts[8];
            a = a.target;
            0 === a.currentFrame && (isSoundOn && (mixer.play("lever"), mixer.play("bridge2"), mixer.play("fire", !1, !0, 3), stage.setTimeout(function() {
                mixer.stop(3)
            }, fps)), a.setStatic(!1), c.bbq.setStatic(!1), a.cover.setStatic(!1), a.play(), stage.createTween(c.fire, "y", c.fire.y, c.fire.y - 80, fps, Easing.quartic.easeOut).play(), stage.createTween(c.flies[0], "y", c.flies[0].y, c.flies[0].y - 
            80, fps, Easing.quartic.easeOut).play(), stage.createTween(c.flies[1], "y", c.flies[1].y, c.flies[1].y - 80, fps, Easing.quartic.easeOut).play(), stage.createTween(c.bbq, "y", c.bbq.y, c.bbq.y - 80, fps, Easing.quartic.easeOut).play(), field.bob.noFire = !0)
        },jumpOnTrampoline: function() {
            var a = field.bob, c = levelsScripts[8].trampoline;
            stage.hitTest(a, c) && !a.impulse && c.x + c.width / 2 > a.x - 5 && c.x - c.width / 2 < a.x + 5 && 30 < c.y - a.y && (a.impulse = !0, stage.setTimeout(function() {
                a.box2dBody.ApplyImpulse(new b2Vec2(0, -23E5), a.box2dBody.GetCenterPosition());
                a.impulse = !1;
                c.gotoAndPlay(0);
                isSoundOn && mixer.play("spring");
                "fly" != a.state && (a.selectedState = a.state, a.blockClick = !0, a.changeState("fly"), a.fly.gotoAndPlay(0))
            }, 2))
        },ifBobFalls: function() {
            250 < field.bob.y && bobFalls()
        },ifBobOnFire: function() {
            var a = levelsScripts[8].fire, c = field.bob;
            !c.noFire && stage.hitTest(c, a) && (c.noFire = !0, stage.setTimeout(function() {
                isSoundOn && mixer.play("bobOnFire");
                c[c.state].visible = 0;
                c.box2dBody.Freeze();
                var a = new TilesSprite(bitmaps.bobBurns_tiles, 50, 112, 16, 8, 2);
                a.animDelay = 
                2;
                a.x = c.x;
                a.y = c.y - 33;
                a.onenterframe = function(a) {
                    a = a.target;
                    if (15 == a.currentFrameX || 7 == a.currentFrameX)
                        a.gotoAndPlay(9), showGameOverScreen()
                };
                stage.addChild(a)
            }, Math.floor(fps / 3)))
        },ifCancelFly: function() {
            380 < field.bob.x && (field.bob.fly.stopFly = !0)
        },pretick: function() {
            var a = levelsScripts[8];
            a.jumpOnTrampoline();
            a.ifBobFalls();
            a.ifBobOnFire();
            a.ifCancelFly()
        }}, {init: function() {
            for (var a = levelsScripts[9], c = getObjectByInfo("button_red"), e = 0; e < c.length; e++) {
                var f = c[e];
                f.onclick = a.toggleFan;
                f.id = e
            }
            for (var g = 
            getObjectByInfo("fan_tiles"), e = 0; e < g.length; e++)
                3 !== e && 0 !== e && g[e].setStatic(!0);
            a.fans = g;
            g[0].play();
            a = getObjectByCustomInfo("button_down_no_hint");
            a.onmousedown = function(a) {
                a.target.gotoAndStop(2);
                a.target.int = stage.setInterval(function() {
                    145 > g[3].y && (g[3].y += 2, h.y += 2)
                }, 1)
            };
            a.onmouseup = function(a) {
                a.target.gotoAndStop(1);
                stage.clearInterval(a.target.int)
            };
            var h = getObjectByInfo("fan_lvl10"), a = getObjectByCustomInfo("button_up_no_hint");
            a.onmousedown = function(a) {
                a.target.gotoAndStop(2);
                a.target.int = 
                stage.setInterval(function() {
                    50 < g[3].y && (g[3].y -= 2, h.y -= 2)
                }, 1)
            };
            a.onmouseup = function(a) {
                a.target.gotoAndStop(1);
                stage.clearInterval(a.target.int)
            };
            a.scaleX = -1;
            addStateBobFly()
        },toggleFan: function(a) {
            var c = levelsScripts[9].fans[a.target.id];
            isSoundOn && mixer.play("button");
            c.animated ? (c.gotoAndStop(0), 3 !== a.target.id && c.setStatic(!0), isSoundOn && mixer.play("fan_off")) : (3 !== a.target.id && c.setStatic(!1), isSoundOn && mixer.play("fan_on"), c.play())
        },ifBobHitFan: function() {
            for (var a = field.bob, c = levelsScripts[9].fans, 
            e = 0; e < c.length; e++) {
                var f = c[e];
                if (f.animated && stage.hitTest(f, a)) {
                    if (3 !== e) {
                        if (f.x + f.width / 2 - 10 < a.x)
                            continue
                    } else if (280 < a.x || f.y + f.width / 2 < a.y)
                        continue;
                    var g = 3 !== e ? 0 : 3E6 * Math.sin(f.rotation), f = 3 !== e ? 7E6 * -Math.cos(f.rotation) : 0;
                    a.box2dBody.ApplyForce(new b2Vec2(g, f), new b2Vec2(a.x, a.y));
                    "fly" != a.state && (a.selectedState = a.state, a.blockClick = !0, a.changeState("fly"), a.fly.gotoAndPlay(0));
                    g = !0
                }
            }
            !g && "fly" == a.state && 15 > a.fly.currentFrame && (a.fly.stopFly = !0)
        },pretick: function() {
            levelsScripts[9].ifBobHitFan()
        }}, 
    {init: function() {
            var a = levelsScripts[10], c = createRope(16, {x: 240,y: -100}, 9E3);
            a.ropeBegin = c.begin;
            c = c.ropes;
            a.rope = c;
            var e = addBobState("bobSquashed", 46, 50, 11);
            e.onenterframe = function(a) {
                a = a.target;
                10 == a.currentFrame && (console.log("switch"), a.onenterframe = null, a.bitmap = bitmaps.bobSquashed2, a.totalFrames = 14, a.width = 22)
            };
            e.animDelay = 2;
            e = getObjectByInfo("ant_lvl11");
            e.animDelay = 2;
            e.play();
            e = getObjectByInfo("btn2");
            e.onenterframe = function(a) {
                2 == a.target.currentFrame && a.target.animated && (a.target.stop(), 
                a.target.setStatic(!0))
            };
            e.setStatic(!0);
            a.btn = e;
            var f = getObjectByInfo("button_red");
            f.blocked = !0;
            f.onclick = a.dartBtnAction;
            a.dartBtn = f;
            e = getObjectByInfo("dart");
            e.setStatic(!0);
            a.dart = e;
            e = getObjectByInfo("flap");
            e.onenterframe = function(a) {
                8 == a.target.currentFrame && (a.target.destroy = !0, addHint.call(f), f.blocked = !1)
            };
            a.flap = e;
            e = getObjectByInfo("wall1");
            e.setStatic(!0);
            e.restrict = [e.x, e.x + 119];
            a.wall1 = e;
            e = getObjectByInfo("wall2");
            e.setStatic(!0);
            e.restrict = [e.x - 119, e.x];
            a.wall2 = e;
            e = getObjectByInfo("earth_lvl11");
            e.setStatic(!0);
            a.earth = e;
            e = a.createCatcher(c[c.length - 1]);
            e.onenterframe = a.catching;
            c.push(e);
            a.catcher = e;
            c = getObjectByCustomInfo("button_down");
            e = getObjectByCustomInfo("button_up");
            a.catchHandler.call(c);
            a.catchHandler.call(e);
            deStaticCover("lvlMapIngame");
            deStaticCover("restartIngame");
            deStaticCover("score");
            deStaticCover("Walkthrough")
        },createCatcher: function(a) {
            var c = {x: a.x,y: a.y + 9}, e = createObject({type: "catcher",x: a.x,y: a.y + 10,rotation: 0}, findObject("catcher"));
            box2DCreateRevoluteJoint(world, 
            a.box2dBody, e.box2dBody, c);
            box2DCreateDistanceJoint(world, a.box2dBody, e.box2dBody, c, c);
            return e
        },catching: function(a) {
            var c = field.bob;
            a = a.target;
            if (!a.broken && !a.catching && 25 > getDistance(c, a)) {
                field.cancelSpeed = !0;
                a.catching = !0;
                console.log("catch!");
                var e = new b2Vec2(a.x - c.x, a.y - c.y);
                e.Normalize();
                e.Multiply(5);
                var f = c.box2dBody.GetCenterPosition();
                f.x += e.x;
                f.y += e.y;
                c.box2dBody.SetOriginPosition(f, 0);
                console.log(e);
                e = a.box2dBody.GetCenterPosition();
                c.joint = box2DCreateRevoluteJoint(world, a.box2dBody, 
                c.box2dBody, e);
                c.joint2 = box2DCreateDistanceJoint(world, a.box2dBody, c.box2dBody, e, e)
            }
        },catchHandler: function() {
            var a = levelsScripts[10], c = a.ropeBegin, e = a.catcher;
            this.onmouseout = function(a) {
                a.target.gotoAndStop(0);
                stage.clearInterval(a.target.int)
            };
            this.onmousedown = function(f) {
                f.target.gotoAndStop(2);
                f.target.int = stage.setInterval(function() {
                    var g = c.GetCenterPosition();
                    "button_down" == f.target.custom ? e.wallStopped ? -110 > g.y && (g.y += 2, a.moveRope(a.rope, !0, 2)) : 18 > g.y && (g.y += 2, a.moveRope(a.rope, !0, 2)) : -150 < 
                    g.y && (g.y -= 2, a.moveRope(a.rope, !1, 2));
                    c.SetOriginPosition(g, 0)
                }, 1)
            };
            this.onmouseup = function(a) {
                a.target.gotoAndStop(1);
                stage.clearInterval(a.target.int)
            }
        },moveRope: function(a, c, e) {
            for (var f = 0; f < a.length; f++) {
                var g = a[f].box2dBody, h = g.GetCenterPosition(), k = g.GetRotation();
                h.y = c ? h.y + e : h.y - e;
                g.SetOriginPosition(h, k)
            }
        },dartBtnAction: function() {
            var a = levelsScripts[10], c = a.dartBtn, e = a.dart;
            if (!c.blocked) {
                c.blocked = !0;
                isSoundOn && mixer.play("lvl11_dart");
                e.setStatic(!1);
                var f;
                e.moveTo(500, e.y + 50, fps / 2, Easing.linear.easeIn, 
                function() {
                    e.destroy = !0
                }, function() {
                    if (!f)
                        for (var c = a.rope, h = 0; h < c.length; h++) {
                            var k = c[h];
                            if (stage.hitTest(e, k)) {
                                deleteObject(k);
                                f = !0;
                                c.splice(h, 1);
                                c = c.splice(h, c.length - h);
                                for (h = 0; h < c.length; h++)
                                    (function(a) {
                                        a.fadeTo(0, Math.floor(fps / 2), Easing.linear.easeIn, function() {
                                            deleteObject(a)
                                        })
                                    })(c[h]);
                                break
                            }
                        }
                });
                stage.setTimeout(function() {
                    field.cancelSpeed = !1;
                    a.catcher.broken = !0;
                    field.bob.joint && (world.DestroyJoint(field.bob.joint), world.DestroyJoint(field.bob.joint2))
                }, Math.floor(fps / 4))
            }
        },ifPressButton: function() {
            var a = 
            field.bob, c = levelsScripts[10], e = c.wall1, f = c.wall2;
            !c.btn.pressed && stage.hitTest(a, c.btn) && (c.btn.pressed = !0, stage.setTimeout(function() {
                isSoundOn && (mixer.play("button2"), mixer.play("lvl3_doors"));
                c.btn.setStatic(!1);
                c.btn.play();
                c.flap.play();
                moveBridge(e, "x", !0, 0.45);
                moveBridge(f, "x", !1, 0.45, c.earth, function() {
                    c.catcher.wallStopped = !0
                });
                e.onenterframe = function(g) {
                    stage.hitTest(e, a) && stage.hitTest(f, a) && a.y > e.y - e.height / 2 && !a.squashed && (g.target.onenterframe = null, a.squashed = !0, stage.setTimeout(function() {
                        a.joint && 
                        (world.DestroyJoint(a.joint), world.DestroyJoint(a.joint2));
                        a.box2dBody.Freeze();
                        a.changeState("bobSquashed");
                        a.bobSquashed.gotoAndPlay(0);
                        isSoundOn && mixer.play("bobFlatten");
                        c.catcher.broken = !0;
                        stage.setTimeout(function() {
                            stage.clearInterval(e.int);
                            stage.clearInterval(f.int);
                            stage.setTimeout(showGameOverScreen, fps)
                        }, Math.floor(1.1 * fps))
                    }, fps / 2))
                }
            }, Math.floor(fps / 12)))
        },pretick: function() {
            levelsScripts[10].ifPressButton()
        }}, {init: function() {
            var a = levelsScripts[11], c = getObjectByInfo("lever"), e = getObjectByInfo("trap");
            a.trap = e;
            trapHandler.call(c, e);
            c = getObjectByInfo("electricity_10");
            c.scaleX = 0.6;
            c.scaleY = 0.6;
            c.play();
            a.elec = c;
            c = getObjectByCustomInfo("button_left");
            e = getObjectByCustomInfo("button_right");
            e.scaleX = -1;
            e.hint.x += 2;
            c.onclick = a.moveBox;
            e.onclick = a.moveBox;
            a.buttonLeft = c;
            a.buttonRight = e;
            c = getObjectByInfo("button_blue_down");
            a.buttonDown = c;
            c.onclick = a.buttonDownAction;
            c = getObjectByInfo("crane");
            c.pos = 2;
            c.block = !1;
            c.onenterframe = function(a) {
                a = a.target;
                a.animated && 5 == a.currentFrame && (a.stop(), a.setStatic(!0))
            };
            a.crane = c;
            var f = getObjectByInfo("pump_up");
            addHint.call(f, 0, -10);
            f.position = "up";
            f.onclick = a.pumpAction;
            var g = getObjectByInfo("pump_down"), c = getObjectByInfo("box_lvl12");
            c.box2dBody.GoToSleep();
            a.box = c;
            c = getObjectByInfo("ball");
            c.number = 1;
            c.scaleX = -0.85;
            c.scaleY = 0.8;
            c.setZIndex(14);
            c.box2dBody.m_invI = 0;
            c.onenterframe = function(c) {
                c = c.target;
                6 == c.currentFrame && (6 > c.number ? (c.bitmap = bitmaps["ball" + c.number], c.gotoAndStop(0)) : (c.animated && (f.setStatic(!0), g.setStatic(!0), c.stop()), a.flyBall()))
            };
            a.ball = 
            c;
            addStateBobShocked();
            addStateBobGrowl();
            addStateBobFlatten();
            addStateBobInTrap();
            deStaticCover("score")
        },flyBall: function() {
            var a = levelsScripts[11].ball, c = a.box2dBody.GetCenterPosition(), e = -60 < a.box2dBody.GetLinearVelocity().y ? -95E8 : 0;
            a.box2dBody.ApplyForce(new b2Vec2(0, e), new b2Vec2(c.x, c.y))
        },moveBox: function(a) {
            var c = levelsScripts[11];
            a = a.target;
            var e = c.crane;
            if (!e.block) {
                isSoundOn && mixer.play("lvl12_crane");
                if ("button_right" == a.custom) {
                    if (2 == e.pos)
                        return;
                    a = e.x + 59;
                    e.pos++
                } else {
                    if (0 == e.pos)
                        return;
                    a = e.x - 59;
                    e.pos--
                }
                e.block = !0;
                a = stage.createTween(e, "x", e.x, a, Math.floor(fps / 4), Easing.quintic.easeOut);
                a.play();
                a.onchange = function() {
                    c.box.box2dBody.SetOriginPosition(new b2Vec2(e.x, c.box.y), 0)
                };
                a.onfinish = function() {
                    e.boxLetGo ? c.boxLetGo() : e.block = !1
                }
            }
        },buttonDownAction: function(a) {
            a = levelsScripts[11];
            a.crane.boxLetGo = !0;
            a.crane.block || (isSoundOn && mixer.play("lvl12_crane"), a.boxLetGo())
        },boxLetGo: function() {
            var a = levelsScripts[11], c = field.bob, e = a.box;
            a.buttonDown.gotoAndStop(0);
            a.buttonRight.gotoAndStop(0);
            a.buttonLeft.gotoAndStop(0);
            a.buttonDown.setStatic(!0);
            a.buttonRight.setStatic(!0);
            a.buttonLeft.setStatic(!0);
            a.buttonDown.hint.removeHint();
            a.buttonRight.hint.removeHint();
            a.buttonLeft.hint.removeHint();
            a.crane.block = !0;
            e.box2dBody.WakeUp();
            a.crane.play();
            e.int = stage.setInterval(function() {
                !(e.crushedBob || 1 > e.box2dBody.GetLinearVelocity().Length()) && stage.hitTest(c, e) && e.y + e.height / 2 < c.y && e.x - 40 < c.x && (c.changeState("BobFlatten"), c.BobFlatten.gotoAndPlay(0), c.box2dBody.Freeze(), stage.setTimeout(function() {
                    e.box2dBody.Freeze()
                }, 
                Math.floor(fps / 6)), c.blockClick = !0, e.crushedBob = !0)
            }, 1)
        },pumpAction: function(a) {
            a = a.target;
            var c = levelsScripts[11];
            0 === c.ball.currentFrame && (isSoundOn && mixer.play("ball"), c.ball.play(), c.ball.number++, "up" == a.position ? (a.position = "down", a.y += 23, a.hint.y += 23) : (a.position = "up", a.y -= 23, a.hint.y -= 23))
        },ifBobHitTrap: function() {
            var a = levelsScripts[11].trap;
            stage.hitTest(a, field.bob) && field.bob.x > a.x && a.hitBobAction && a.hitBobAction()
        },ifBobFalls: function() {
            285 < field.bob.y && bobFalls()
        },ifBobInPit: function() {
            var a = 
            field.bob;
            !a.inPit && 170 < a.y && 185 > a.y && 300 < a.x && (a.changeState("BobGrowl"), a.BobGrowl.gotoAndPlay(0), a.inPit = !0)
        },pretick: function() {
            var a = levelsScripts[11];
            a.ifBobHitTrap();
            a.ifBobFalls();
            a.ifBobInPit();
            ifBobShocked(a.elec)
        }}, {init: function() {
            var a = levelsScripts[12], c = getObjectByInfo("beetle");
            c.scaleY = -1;
            c.onenterframe = a.moveBeetle;
            c.onbox2dsync = disableSpriteRotation;
            c.play();
            a.beetle = c;
            var e = getObjectByInfo("btn2");
            e.scaleX = 0.9;
            e.scaleY = 0.9;
            e.onenterframe = function(a) {
                a = a.target;
                1 == a.currentFrame && 
                a.gotoAndStop(2);
                4 == a.currentFrame && a.gotoAndStop(0)
            };
            a.btn = e;
            e = getObjectByInfo("spring_lvl8");
            e.scaleX = 0.85;
            e.scaleY = 0.85;
            var f = getObjectByCustomInfo("buttonSpring");
            punch.call(f, e, c, new b2Vec2(-6E5, 0));
            var g = getObjectByInfo("trolley");
            a.trolley = g;
            c = getObjectByInfo("latch1");
            c.setStatic(!0);
            c.position = "down";
            addHint.call(c, -3, -21);
            c.onclick = a.latch1Action;
            c = getObjectByInfo("latch2");
            c.setStatic(!0);
            addHint.call(c, -21, 2);
            c.onclick = a.latch2Action;
            c = getObjectByInfo("bridge_lvl13");
            c.up = !0;
            c.setStatic(!0);
            c.restrict = [c.y, c.y + c.height];
            a.bridge = c;
            c = getObjectByInfo("earth_lvl13");
            c.setStatic(!0);
            a.earth = c;
            getObjectByCustomInfo("buttonBridge").onclick = a.buttonBridgeAction;
            c = getObjectByInfo("trolley_play");
            c[0].gotoAndStop(1);
            c[1].gotoAndStop(1);
            c[1].onenterframe = function(a) {
                a.target.x = g.x
            };
            a.trolleyPlays = c;
            getObjectByInfo("log_lvl13").box2dBody.m_invI = 0;
            deStaticCover("score")
        },buttonBridgeAction: function(a) {
            var c = levelsScripts[12];
            a = c.bridge;
            c = c.earth;
            isSoundOn && mixer.play("button");
            a.up ? (moveBridge(a, 
            "y", !0, 5, c), a.up = !1, isSoundOn && mixer.play("bridge1")) : (moveBridge(a, "y", !1, 5, c), a.up = !0, isSoundOn && mixer.play("bridge2"))
        },latch1Action: function(a) {
            var c = a.target;
            a = c.box2dBody.GetCenterPosition();
            c.setStatic(!1);
            "up" == c.position ? (c.position = "down", c.hint.y += 35, a.y += 35) : (c.position = "up", c.hint.y -= 35, a.y -= 35);
            c.box2dBody.SetCenterPosition(a, 0);
            stage.setTimeout(function() {
                c.setStatic(!0)
            }, 2)
        },latch2Action: function(a) {
            var c = a.target;
            a = c.box2dBody.GetCenterPosition();
            c.setStatic(!1);
            c.hint.x -= 20;
            a.x -= 
            20;
            c.box2dBody.SetCenterPosition(a, 0);
            c.onclick = null;
            stage.setTimeout(function() {
                c.setStatic(!0)
            }, 2)
        },moveBeetle: function(a) {
            a = a.target.box2dBody;
            var c = 40 > a.GetLinearVelocity().x ? 1E6 : 0;
            a.ApplyForce(new b2Vec2(c, -12E5), a.GetCenterPosition())
        },moveTrolley: function() {
            var a = levelsScripts[12], c = a.btn, e = a.trolley, f = a.beetle, g = e.box2dBody.GetCenterPosition();
            f.x + f.width / 2 + 5 > c.x && f.x - f.width / 2 - 5 < c.x ? (0 === c.currentFrame && (c.play(), isSoundOn && mixer.play("button"), a.trolleyPlays[0].gotoAndStop(0), a.trolleyPlays[1].gotoAndStop(0)), 
            258 < g.x && (g.x--, e.box2dBody.SetOriginPosition(g, 0), a.controlBobSpeed(!1))) : (2 === c.currentFrame && (c.play(), isSoundOn && mixer.play("button2"), a.trolleyPlays[0].gotoAndStop(1), a.trolleyPlays[1].gotoAndStop(1)), 342 > g.x && (g.x++, e.box2dBody.SetOriginPosition(g, 0), a.controlBobSpeed(!0)))
        },controlBobSpeed: function(a) {
            var c = field.bob, e = levelsScripts[12].trolley;
            stage.hitTest(c, e) && c.x > e.x - e.width / 2 && (e = c.box2dBody.GetCenterPosition(), a ? e.x++ : e.x--, c.box2dBody.SetOriginPosition(e, 0))
        },ifBobFalls: function() {
            240 < 
            field.bob.y && bobFalls()
        },pretick: function() {
            var a = levelsScripts[12];
            a.moveTrolley();
            a.ifBobFalls()
        }}, {init: function() {
            var a = levelsScripts[13], c = getObjectByInfo("bridge_lvl14");
            c.setStatic(!0);
            c.restrict = [c.x - c.width, c.x];
            a.bridge = c;
            c = getObjectByInfo("earth_lvl14");
            c.setStatic(!0);
            a.earth = c;
            c = getObjectByInfo("lever");
            c.side = "left";
            c.onclick = a.leverAction;
            a.igor = a.createFriend("igor", {x: -20,y: 146}, SPEED_WALK);
            stage.setTimeout(function() {
                a.dima = a.createFriend("dima", {x: -20,y: 146}, SPEED_WALK)
            }, 2 * fps);
            stage.setTimeout(function() {
                a.jeka = a.createFriend("jeka", {x: 500,y: 65}, -SPEED_WALK);
                a.jeka.scaleX = -1
            }, 3 * fps);
            addStateBobGrowl();
            deStaticCover("PanelSpeed");
            deStaticCover("SpeedBob")
        },createFriend: function(a, c, e) {
            c = createObject({type: a,x: c.x,y: c.y,rotation: 0}, findObject(a));
            c.animDelay = 2;
            c.onenterframe = function(c) {
                c = c.target;
                c.box2dBody.m_linearVelocity.x = e;
                180 < c.y && 230 > c.x && 200 < c.x && (c.bitmap = bitmaps[a + 2], c.totalFrames = "jeka" == a ? 14 : 21, "igor" == a && (c.height = 44, c.width = 54, isSoundOn && mixer.play("igor"), 
                stage.setInterval(function() {
                    isSoundOn && mixer.play("igor")
                }, 3 * fps)), "jeka" == a && (c.width = 58), "dima" == a && (isSoundOn && mixer.play("dima"), stage.setInterval(function() {
                    isSoundOn && mixer.play("dima")
                }, 4 * fps)), c.onenterframe = null);
                "jeka" == a && 290 < c.x && 250 < c.y && (c.bitmap = bitmaps.jeka4, c.totalFrames = 19, c.width = 54, c.height = 50, c.onenterframe = null)
            };
            c.onbox2dsync = disableSpriteRotationWithCoords;
            return c
        },leverAction: function(a) {
            a = a.target;
            var c = levelsScripts[13];
            if (0 === a.currentFrame || 5 === a.currentFrame)
                isSoundOn && 
                mixer.play("lever"), "left" == a.side ? (a.side = "right", a.gotoAndPlay(0), a.onenterframe = function(a) {
                    5 == a.target.currentFrame && a.target.stop()
                }, moveBridge(c.bridge, "x", !1, 4, c.earth), isSoundOn && mixer.play("bridge2")) : (a.side = "left", a.rewindAndStop(5, 0), moveBridge(c.bridge, "x", !0, 4, c.earth), isSoundOn && mixer.play("bridge1"))
        },ifBobInPit: function() {
            var a = field.bob;
            !a.inPit && (180 < a.y && 230 > a.x && 210 < a.x || 150 > a.y && 370 < a.x) && (a.inPit = !0, stage.setTimeout(function() {
                a.changeState("BobGrowl");
                a.BobGrowl.gotoAndPlay(0)
            }, 
            fps / 2))
        },pretick: function() {
            levelsScripts[13].ifBobInPit()
        }}, {init: function() {
            var a = levelsScripts[14], c = getObjectByCustomInfo("button_down_no_hint");
            c.onclick = a.rotateWheel;
            c.scaleX = -1;
            getObjectByCustomInfo("button_up_no_hint").onclick = a.rotateWheel;
            getObjectByInfo("earth_lvl15").setZIndex(21);
            c = getObjectByInfo("Lift");
            c.up = !1;
            c.scaleX = 0.9;
            c.restrict = [c.y - 135, c.y - 4];
            a.lift = c;
            c = getObjectByInfo("button_red");
            c.onclick = a.liftButtonAction;
            a.liftButton = c;
            c = getObjectByInfo("hunter1");
            c.animDelay = 2;
            c.play();
            a.hunter = c;
            var e = new Sprite(null, 14, 1);
            e.setZIndex(1);
            e.fillColor = "#FF0000";
            stage.addChild(e);
            c.ray = e;
            c = getObjectByInfo("wheel");
            c.active = 2;
            a.wheel = c;
            var e = getObjectByInfo("toy"), f = a.createToy2Poly(e[2].x, e[2].y);
            f.sprite = e[2];
            e[2].box2dBody = f;
            e[0].correct = {x: 0.5,y: -9};
            e[1].correct = {x: -1,y: 8};
            e[2].correct = {x: -0.5,y: 2};
            e[3].correct = {x: -0.5,y: -1.5};
            for (f = 0; f < e.length; f++) {
                var g = e[f];
                g.box2dBody.GoToSleep();
                g.vec = {x: g.x - c.x + g.correct.x,y: g.y - c.y + g.correct.y}
            }
            a.toys = e;
            c = getObjectByInfo("lever");
            c.onclick = 
            a.leverAction;
            c.onenterframe = function(a) {
                a = a.target;
                5 == a.currentFrame && (a.stop(), a.rewindAndStop(4, 0))
            };
            a.wall = getObjectByCustomInfo("wall");
            deStaticCover("lvlMapIngame");
            deStaticCover("restartIngame");
            deStaticCover("Walkthrough")
        },setLaserRay: function() {
            var a = levelsScripts[14], c = a.toys, e = a.hunter;
            if (e.ray.visible) {
                var f = 480, g = new Sprite(null, 480, 2), f = new Vector(273, -15);
                f.rotate(-e.rotation);
                g.x = f.x + e.x;
                g.y = f.y + e.y;
                g.rotation = 0;
                for (var f = [], h = 0; h < c.length; h++)
                    f.push(c[h]);
                f.push(a.lift);
                f.push(a.wall);
                f.push(field.bob);
                c = [];
                for (h = 0; h < f.length; h++)
                    stage.hitTest(f[h], g) && c.push(f[h]);
                for (var f = 480, k = g = 0; k < c.length; k++)
                    h = c[k].x - e.x, h < f && (f = h, g = k);
                "bob" == c[g].info && (field.bob.onLaser = !0, e.ray.visible = !1, a.bobOnLaser());
                for (a = !0; a && 0 < f; )
                    f--, stage.hitTestPointObject(c[g], f + e.x, e.y + -15) || (a = !1);
                f -= 33;
                e.ray.x = f / 2 + 33 + e.x;
                e.ray.y = e.y + -15;
                e.ray.width = f;
                e.ray.rotation = e.rotation
            }
        },bobOnLaser: function() {
            var a = levelsScripts[14], c = a.hunter;
            isSoundOn && mixer.play("hunter_shot");
            c.bitmap = bitmaps.hunter2;
            c.totalFrames = 
            9;
            c.width = 124;
            c.height = 66;
            c.y -= 3;
            c.x += 18.5;
            c.animDelay = 1;
            c.gotoAndPlay(0);
            c.onenterframe = function(a) {
                a = a.target;
                6 == a.currentFrame && (a.bitmap = bitmaps.hunter3, a.totalFrames = 13, a.width = 82, a.height = 74, a.animDelay = 2, a.gotoAndPlay(1), a.y -= 4, a.x -= 23.5, a.onenterframe = function(a) {
                    a = a.target;
                    12 == a.currentFrame && a.gotoAndPlay(5)
                })
            };
            var e = createObject({type: "bullet",x: c.x,y: c.y - 6,rotation: 0}, findObject("bullet"));
            e.setZIndex(1);
            e.moveTo(e.x + 250, e.y, Math.floor(fps / 3), Easing.linear.easeIn, function() {
                isSoundOn && 
                mixer.play("bobWounded_15lvl");
                var c = field.bob;
                e.destroy = !0;
                c[c.state].visible = !1;
                c.blockClick = !0;
                stage.clearInterval(a.lift.int);
                var g = new TilesSprite(bitmaps.bobWounded, 100, 82, 15, 8, 2);
                g.x = c.x + 5;
                g.y = c.y - 7;
                g.scaleX = -1;
                g.animDelay = 2;
                g.onenterframe = function(a) {
                    14 == a.target.currentFrameX && (a.target.gotoAndPlay(9), showGameOverScreen())
                };
                stage.addChild(g)
            });
            a.liftButton.block = !0;
            a.liftButton.hint.removeHint();
            a.liftButton.gotoAndStop(0);
            a.liftButton.setStatic(!0)
        },createToy2Poly: function(a, c) {
            var e = new b2BodyDef;
            e.rotation = 0;
            for (var f = findObject("toy2"), g = 0; g < f.points.length; g++) {
                var h = f.points[g], k = new b2PolyDef;
                switch (g) {
                    case 0:
                        k.density = 1;
                        break;
                    case 1:
                        k.density = 50;
                        break;
                    case 2:
                        k.density = 4;
                        break;
                    default:
                        console.log("default")
                }
                k.restitution = f.restitution;
                k.friction = f.friction;
                k.vertexCount = h.length;
                for (var l = 0; l < h.length; l++)
                    k.vertices[l].Set(h[l][0], h[l][1]);
                e.AddShape(k)
            }
            e.position.Set(a, c);
            f = world.CreateBody(e);
            f.bodyDef = e;
            return f
        },leverAction: function(a) {
            a = a.target;
            var c = levelsScripts[14], e = c.toys, 
            c = c.wheel;
            c.block || (isSoundOn && mixer.play("lever"), a.play(), e[c.active].box2dBody.IsSleeping() && e[c.active].box2dBody.WakeUp())
        },rotateWheel: function(a) {
            var c = levelsScripts[14], e = c.wheel, f = c.toys;
            e.block || (isSoundOn && mixer.play("lvl15_rotate_wheel"), -1 !== a.target.custom.indexOf("up") ? (a = Math.PI / 2, 0 !== e.active ? e.active-- : e.active = 3) : (a = -Math.PI / 2, 3 !== e.active ? e.active++ : e.active = 0), e.block = !0, e.rotateBy(a, fps, Easing.linear.easeIn, function() {
                e.block = !1
            }, function() {
                for (var a = 0; a < f.length; a++) {
                    var c = 
                    f[a];
                    if (c.box2dBody.IsSleeping()) {
                        var k = new Vector(c.vec.x, c.vec.y);
                        k.rotate(-e.rotation);
                        c.box2dBody.SetOriginPosition({x: e.x + k.x - c.correct.x,y: e.y + k.y - c.correct.y}, 0)
                    }
                }
            }))
        },liftButtonAction: function(a) {
            var c = levelsScripts[14].lift;
            a.target.block || (isSoundOn && mixer.play("button"), moveBridge(c, "y", c.up, 2), c.up = !c.up)
        },pretick: function() {
            levelsScripts[14].setLaserRay()
        }}, {init: function() {
            var a = levelsScripts[15];
            addBobState("bobUfo", 48, 37, 1).setZIndex(1);
            a.ufo = getObjectByInfo("ufo");
            var c = getObjectByInfo("ufo_light_tiles");
            c.play();
            c.setZIndex(20);
            a.ufoLight = c;
            for (var c = getObjectByInfo("teleport_tiles"), e = 0; e < c.length; e++) {
                var f = c[e];
                f.play();
                f.setZIndex(1);
                f.scaleX = 0.7;
                f.scaleY = 0.7
            }
            c = getObjectByInfo("lever");
            c.onenterframe = leverOnenterframe;
            c.onclick = a.leverAction;
            c = getObjectByInfo("bridge1_lvl16");
            c.restrict = [c.y - 55, c.y];
            a.bridge1 = c;
            var g = getObjectByInfo("extraterrestrial");
            g.onbox2dsync = disableSpriteRotationWithCoords;
            g.play();
            a.extraterrestrial = g;
            g.int = stage.setInterval(function() {
                g.teleported || (g.box2dBody.m_linearVelocity.x = 
                SPEED_WALK)
            }, 1);
            c = getObjectByInfo("bridge2_lvl16");
            c.setStatic(!0);
            a.bridge2 = c;
            c = getObjectByInfo("earth_lvl16");
            c.setStatic(!0);
            a.earth = c;
            c = getObjectByInfo("button_red");
            c.onmousedown = a.buttonBridgeAction;
            c.onmouseup = a.buttonBridgeActionMouseUp;
            a.buttonBridge = c;
            a.teleport11 = getObjectByCustomInfo("teleport11");
            a.teleport12 = getObjectByCustomInfo("teleport12");
            a.teleport22 = getObjectByCustomInfo("teleport22");
            a.teleport21 = getObjectByCustomInfo("teleport21");
            a.back_orange1 = getObjectByInfo("back_orange1");
            deStaticCover("PanelSpeed");
            deStaticCover("SpeedBob");
            deStaticCover("lvlMapIngame");
            deStaticCover("restartIngame")
        },leverAction: function(a) {
            a = a.target;
            var c = levelsScripts[15];
            0 === a.currentFrame && (isSoundOn && (mixer.play("lever"), mixer.play("bridge2")), a.setStatic(!1), a.cover.setStatic(!1), a.play(), moveBridge(c.bridge1, "y", !1, 4))
        },buttonBridgeAction: function(a) {
            var c = levelsScripts[15], e = c.bridge2, f = e.box2dBody;
            gameState == STATE_GAME && (isSoundOn && mixer.play("button"), stage.clearInterval(e.int), a.target.gotoAndStop(2), 
            130 <= f.GetCenterPosition().x || (e.setStatic(!1), c.earth.setStatic(!1), e.int = stage.setInterval(function() {
                var a = f.GetCenterPosition();
                a.x += 5;
                f.SetOriginPosition(a, 0);
                130 <= a.x && stage.clearInterval(e.int)
            }, 1)))
        },buttonBridgeActionMouseUp: function(a) {
            var c = levelsScripts[15], e = c.bridge2, f = e.box2dBody;
            gameState == STATE_GAME && (isSoundOn && mixer.play("button"), stage.clearInterval(e.int), a.target.gotoAndStop(1), 60 >= f.GetCenterPosition().x || (e.int = stage.setInterval(function() {
                var a = f.GetCenterPosition();
                a.x -= 
                5;
                f.SetOriginPosition(a, 0);
                60 >= a.x && (stage.clearInterval(e.int), e.setStatic(!0), c.earth.setStatic(!0))
            }, 1)))
        },teleportation: function(a, c, e) {
            var f = levelsScripts[15], g = f.extraterrestrial;
            g.x > (e ? a.x - 7 : a.x + 3) && stage.hitTest(a, g) && !g.teleported && (g.teleported = !0, e && f.back_orange1.setZIndex(2), isSoundOn && mixer.play("teleport"), g.fadeTo(0, Math.floor(fps / 4), Easing.linear.easeIn, function() {
                g.box2dBody.SetLinearVelocity(new b2Vec2(0, 0));
                g.box2dBody.m_angularVelocity = 0;
                g.box2dBody.SetOriginPosition(new b2Vec2(c.x, 
                c.y), 0);
                g.opacity = 1;
                stage.setTimeout(function() {
                    g.teleported = !1
                }, Math.floor(fps / 2))
            }))
        },ufoTakesAway: function(a) {
            var c = levelsScripts[15], e = c.ufo;
            if (!e.take && a.x > c.ufoLight.x - 5) {
                e.take = !0;
                isSoundOn && mixer.play("ufo_takes");
                a == field.bob ? (a.changeState("bobUfo"), a.blockClick = !0) : stage.clearInterval(a.int);
                world.DestroyBody(a.box2dBody);
                var f = stage.createTween(a, "y", a.y, a.y - 150, 2 * fps, Easing.linear.easeIn);
                f.onfinish = function() {
                    a == field.bob ? a[a.state].destroy = !0 : a.destroy = !0;
                    c.ufoLight.fadeTo(0, fps / 2, 
                    Easing.linear.easeIn, function() {
                        c.ufoLight.destroy = !0;
                        var f = stage.createTween(e, "y", e.y, e.y - 150, 2 * fps, Easing.linear.easeIn);
                        a == field.bob && (f.onfinish = showGameOverScreen);
                        f.play();
                        isSoundOn && mixer.play("lvl16_ufo_bye_bye")
                    })
                };
                f.play()
            }
        },pretick: function() {
            var a = levelsScripts[15];
            a.ufoTakesAway(field.bob);
            a.ufoTakesAway(a.extraterrestrial);
            a.teleportation(a.teleport11, a.teleport12);
            a.teleportation(a.teleport21, a.teleport22, !0)
        }}, {init: function() {
            var a = levelsScripts[16], c = getObjectByInfo("caterpillar");
            c.box2dBody.m_invI = 0;
            c.play();
            c.syncX *= -1;
            c.state = 1;
            c.setZIndex(16);
            c.int = stage.setInterval(function() {
                var a = c.box2dBody;
                a.GetContactList() && (a.m_linearVelocity.x = SPEED_WALK)
            }, 1);
            a.caterpillar = c;
            getObjectByCustomInfo("button0").onclick = a.buttonAction;
            getObjectByCustomInfo("button1").onclick = a.buttonAction;
            var e = getObjectByInfo("spring_lvl17_tiles"), f = getObjectByInfo("button_green");
            f.onenterframe = function(a) {
                a = a.target;
                a.animated && 4 == a.currentFrame && (a.stop(), a.setStatic(!0))
            };
            a.buttonGreen = f;
            f = getObjectByInfo("Lift");
            f.restrict = [f.y - 125, f.y];
            f.setStatic(!0);
            a.lift = f;
            for (var f = getObjectByCustomInfo("button_spring"), g = getObjectByInfo("bridge_lvl17"), h = getObjectByInfo("btn2"), k = getObjectByInfo("shutter"), l = getObjectByInfo("holder"), m = 0; 2 > m; m++) {
                var n = g[m], p = h[m], q = k[m], r = l[m];
                n.restrict = [n.y - 50, n.y - 5];
                n.setStatic(!0);
                p.scaleX = 0.85;
                p.scaleY = 0.85;
                p.onenterframe = a.buttonPressOnenter;
                q.num = 0;
                q.onenterframe = a.shutterOnenter;
                1 == m && (q.scaleX = -1);
                a["bridge" + m] = n;
                a["buttonPress" + m] = p;
                a["shutter" + m] = q;
                a["holder" + m] = r
            }
            punch.call(f, 
            e, c, new b2Vec2(0, -2E6));
            deStaticCover("score")
        },shutterOnenter: function(a) {
            a = a.target;
            isSoundOn && 5 == a.currentFrame && mixer.play("lvl17_shutter");
            7 == a.currentFrame && (1 == a.num ? (a.num = 0, a.gotoAndStop(0)) : a.num++)
        },buttonAction: function(a) {
            var c = a.target, e = levelsScripts[16];
            a = -1 != c.custom.indexOf("0") ? 0 : 1;
            var f = e["buttonPress" + a], g = e["shutter" + a], h = e["bridge" + a], k = e["holder" + a];
            isSoundOn && mixer.play("button3");
            2 == f.currentFrame && (g.bitmap = bitmaps.shutter2, g.width = 94, g.x = 0 == a ? g.x + 12 : g.x - 12, g.totalFrames = 
            7, g.onenterframe = function(a) {
                var e = a.target;
                6 == e.currentFrame && e.animated && (e.stop(), stage.setTimeout(function() {
                    e.setStatic(!0);
                    h.setStatic(!0);
                    k.setStatic(!0);
                    c.gotoAndStop(0);
                    c.setStatic(!0)
                }, 1))
            }, h.fixed = !0, c.onclick = null, c.hint.removeHint());
            g.play()
        },buttonPressOnenter: function(a) {
            a = a.target;
            1 == a.currentFrame && a.gotoAndStop(2);
            4 == a.currentFrame && (a.gotoAndStop(0), a.setStatic(!0))
        },ifPressButton: function(a) {
            var c = levelsScripts[16], e = 0 == a ? field.bob : c.caterpillar, f = c["buttonPress" + a];
            a = c["bridge" + 
            a];
            e.x > f.x - 30 && e.x < f.x + 30 ? 0 === f.currentFrame && (f.play(), moveBridge(a, "y", !1, 10), isSoundOn && (mixer.play("button"), mixer.play("bridge2"))) : 2 === f.currentFrame && (f.play(), a.fixed || moveBridge(a, "y", !0, 10), isSoundOn && (mixer.play("button2"), mixer.play("bridge1")))
        },ifCaterpillarPressButton: function() {
            var a = levelsScripts[16], c = a.buttonGreen, e = a.lift;
            160 > a.caterpillar.y && 0 == c.currentFrame && (isSoundOn && mixer.play("button"), c.play(), moveBridge(e, "y", !1))
        },ifCaterpillarEatsBob: function() {
            function a() {
                isSoundOn && 
                mixer.play("lvl17_caterpillar")
            }
            var c = levelsScripts[16].caterpillar, e = field.bob;
            !c.eat && stage.hitTest(e, c) && e.x > c.x && e.y + 5 > c.y && (isSoundOn && mixer.play("caterpillar_eat"), c.bitmap = bitmaps.caterpillar_eat1, c.totalFrames = 14, c.width = 122, c.height = 62, c.syncX = -32, c.syncY = 20, c.x += 29, c.y -= 13, stage.clearInterval(c.int), e.blockClick = !0, world.DestroyBody(e.box2dBody), stage.setTimeout(function() {
                e[e.state].visible = !1
            }, 4 * c.animDelay), c.onenterframe = function(e) {
                13 == e.target.currentFrame && (c.bitmap = bitmaps.caterpillar_move2, 
                c.totalFrames = 12, c.width = 86, c.height = 38, c.syncX = -59, c.x += 27, c.syncY = 9, c.y += 11, c.animDelay = 2, c.gotoAndPlay(0), a(), stage.setTimeout(a, c.totalFrames * c.animDelay), stage.setTimeout(a, 2 * c.totalFrames * c.animDelay), stage.setTimeout(showGameOverScreen, 2 * fps))
            }, c.gotoAndPlay(0), c.eat = !0)
        },pretick: function() {
            var a = levelsScripts[16];
            a.ifPressButton(0);
            a.ifPressButton(1);
            a.ifCaterpillarPressButton();
            a.ifCaterpillarEatsBob()
        }}, {init: function() {
            var a = levelsScripts[17], c = getObjectByInfo("bollMc");
            c.scaleX = 0.9;
            c.scaleY = 
            0.9;
            c.box2dBody.GoToSleep();
            a.ball = c;
            c = getObjectByInfo("locker");
            addHint.call(c, 7, 24);
            c.onclick = a.lockerAction;
            a.locker = c;
            c = getObjectByInfo("saw");
            addHint.call(c, 35, 0);
            c.left = !1;
            c.onclick = a.sawAction;
            c = field.bob;
            c.changeState("hide");
            c.hide.gotoAndPlay(0);
            c.forceSleep();
            isSoundOn && mixer.play("bob_hideshell");
            c = getObjectByInfo("log1_lvl18");
            c.box2dBody.GoToSleep();
            a.logSaw = c;
            c = getObjectByInfo("bough");
            c.scaleX = 0.9;
            c.scaleY = 0.9;
            a.bough = c;
            c = getObjectByInfo("woodpecker_tiles");
            c.play();
            c.num = 2;
            c.onclick = 
            a.woodpeckerAction;
            c.onenterframe = a.woodpeckerOnenter;
            a.woodpecker = c;
            getObjectByInfo("question_mark").setStatic(!0);
            deStaticCover("score")
        },woodpeckerOnenter: function(a) {
            a = a.target;
            var c = levelsScripts[17];
            if (2 != a.num && a.currentFrameX == a.framesCount - 1)
                switch (a.num) {
                    case 3:
                        c.changeWoodpeckerImage(70, 110, 10, 5, 2, 0, -1);
                        isSoundOn && mixer.play("woodpecker");
                        break;
                    case 4:
                        c.changeWoodpeckerImage(70, 110, 10, 5, 2);
                        isSoundOn && mixer.play("woodpecker");
                        break;
                    case 5:
                        c.changeWoodpeckerImage(68, 110, 7, 7, 1, -1);
                        isSoundOn && 
                        mixer.play("woodpecker");
                        break;
                    case 6:
                        c.changeWoodpeckerImage(82, 86, 11, 11, 1, -4, -12);
                        var e = createObject({type: "log2_lvl18",x: 158,y: 65,rotation: 0}, findObject("log2_lvl18"));
                        stage.setTimeout(function() {
                            e.setZIndex(1)
                        }, 1);
                        break;
                    case 7:
                        c.changeWoodpeckerImage(78, 54, 11, 11, 1, -6, 19);
                        stage.setTimeout(function() {
                            c.bough.setStatic(!0)
                        }, 1);
                        break;
                    case 8:
                        a.gotoAndPlay(1);
                        break;
                    default:
                        console.log("default")
                }
        },woodpeckerAction: function(a) {
            levelsScripts[17].changeWoodpeckerImage(70, 110, 6, 6, 1, 1, 1);
            a.target.onclick = 
            null
        },changeWoodpeckerImage: function(a, c, e, f, g, h, k) {
            var l = levelsScripts[17].woodpecker;
            l.bitmap = bitmaps["woodpecker" + l.num];
            l.width = a;
            l.height = c;
            l.framesCount = e;
            l.totalFrames = f;
            l.totalLayers = g;
            h && (l.x += h);
            k && (l.y += k);
            l.gotoAndPlay(0);
            l.num++
        },sawAction: function(a) {
            var c = a.target, e = levelsScripts[17].logSaw.box2dBody, f = c.hint;
            if (!c.blocked && (a = fps / 3, c.left ? (stage.createTween(c, "x", 330, 355, a, Easing.linear.easeIn).play(), stage.createTween(f, "x", 365, 390, a, Easing.linear.easeIn).play()) : (stage.createTween(c, 
            "x", 355, 330, a, Easing.linear.easeIn).play(), stage.createTween(f, "x", 390, 365, a, Easing.linear.easeIn).play()), c.left = !c.left, !c.sawnOff)) {
                isSoundOn && (c.sound = mixer.play("saw", !1, !1, 2));
                c.blocked = !0;
                var g = e.GetRotation(), f = new Vector(-7.5, 72);
                f.rotate(-g);
                var h = e.GetCenterPosition(), k = h.x + f.x, l = h.y + f.y, m = {}, n = stage.setInterval(function() {
                    g -= 0.01;
                    var a = new Vector(7.5, -72);
                    a.rotate(-g);
                    m.x = k + a.x;
                    m.y = l + a.y;
                    e.SetOriginPosition(m, g)
                }, 1);
                stage.setTimeout(function() {
                    stage.clearInterval(n);
                    c.blocked = !1;
                    if (-0.9 > 
                    g) {
                        e.WakeUp();
                        var a = new Vector(0, -45);
                        a.rotate(-g);
                        e.ApplyImpulse(new b2Vec2(-32E4, 0), {x: m.x + a.x,y: m.y + a.y});
                        c.sawnOff = !0
                    }
                }, a)
            }
        },lockerAction: function(a) {
            var c = levelsScripts[17].ball.box2dBody, e = a.target;
            e.onclick = null;
            isSoundOn && (mixer.play("lever"), mixer.play("bridge2"));
            stage.setTimeout(function() {
                c.WakeUp()
            }, Math.floor(fps / 5));
            e.hint.removeHint();
            var f = e.x - 20, g = e.y - 24, h = stage.setInterval(function() {
                e.rotation -= 0.1;
                var a = new Vector(20, 24);
                a.rotate(-e.rotation);
                e.x = f + a.x;
                e.y = g + a.y;
                -1 > e.rotation && 
                (stage.clearInterval(h), e.setStatic(!0))
            }, 1)
        },ifBobFalls: function() {
            260 < field.bob.y && bobFalls()
        },pretick: function() {
            levelsScripts[17].ifBobFalls()
        }}, {init: function() {
            var a = levelsScripts[18], c = field.bob, e = new TilesSprite(bitmaps.bobSurprised, 58, 86, 14, 7, 2);
            e.setPosition(c.x, c.y);
            e.animDelay = 2;
            e.visible = !1;
            e.gotoAndStop(0);
            c.bobSurprised = e;
            c.states.push(e);
            stage.addChild(e);
            e.onenterframe = function(a) {
                13 == a.target.currentFrameX && a.target.animated && (a.target.stop(), c.changeState("hide"), c.hide.gotoAndPlay(0), 
                stage.setTimeout(function() {
                    c.blockClick = !1
                }, c.hide.animDelay * c.hide.totalFrames - 1))
            };
            e = getObjectByInfo("swamp");
            e.play();
            e.scaleX = 1.07;
            e.setZIndex(2);
            e.animDelay = 2;
            e = getObjectByInfo("bubble");
            e.play();
            e.setZIndex(3);
            e.animDelay = 3;
            getObjectByInfo("earth1_lvl19").setZIndex(4);
            e = getObjectByInfo("earth2_lvl19");
            a.earth2 = e;
            e = getObjectByCustomInfo("bridge1");
            e.setZIndex(3);
            e.setStatic(!0);
            e.restrict = [e.x - 50, e.x - 10];
            a.bridge1 = e;
            e = getObjectByCustomInfo("bridge2");
            e.setStatic(!0);
            e.restrict = [e.x + 10, e.x + 50];
            a.bridge2 = e;
            e = getObjectByInfo("monster");
            e.scaleX = -1;
            e.play();
            e.animDelay = 2;
            e = getObjectByInfo("lift_lvl19");
            e.setZIndex(1);
            a.lift = e;
            var f = getObjectByInfo("lever");
            f.side = "left";
            f.onclick = a.leverAction;
            f.onenterframe = function(a) {
                5 == a.target.currentFrame && a.target.stop()
            };
            a.log = getObjectByInfo("log_lvl19");
            f = getObjectByInfo("moving_fence_lvl19");
            a.fence = f;
            f = getObjectByCustomInfo("barell").box2dBody;
            f.GoToSleep();
            a.barell = f;
            f = getObjectByInfo("barell");
            f[0].setZIndex(1);
            f[1].setZIndex(1);
            a.barells = f;
            f = getObjectByInfo("button_red");
            f.onclick = a.buttonAction;
            f.num = 1;
            a.button = f;
            var g = getObjectByInfo("destination");
            a.tube = g;
            var f = g.box2dBody, e = e.box2dBody, h = e.GetCenterPosition(), k = f.GetCenterPosition(), l = new b2Vec2(h.x, h.y - 88), m = new b2Vec2(k.x, k.y - 235);
            a.createPulleyJoint(world, e, f, l, m, h, k, 200, 250);
            e = getObjectByInfo("tube2_lvl19");
            e.onenterframe = function(a) {
                a = a.target;
                a.x = g.x - 5;
                a.y = g.y - 102
            };
            a.tube2 = e;
            c.blockClick = !0;
            stage.setTimeout(function() {
                stage.setTimeout(function() {
                    isSoundOn && mixer.play("bob_skeleton")
                }, 
                5 * c.bobSurprised.animDelay);
                c.changeState("bobSurprised");
                c.bobSurprised.gotoAndPlay(0);
                c.forceSleep()
            }, 2 * fps);
            deStaticCover("lvlMapIngame");
            deStaticCover("restartIngame");
            deStaticCover("Lvl.png");
            deStaticCover("score");
            addStateBobFlatten()
        },createPulleyJoint: function(a, c, e, f, g, h, k, l, m) {
            var n = new b2PulleyJointDef;
            n.body1 = c;
            n.body2 = e;
            n.collideConnected = !0;
            n.groundPoint1 = f;
            n.groundPoint2 = g;
            n.anchorPoint1 = h;
            n.anchorPoint2 = k;
            n.maxLength1 = l;
            n.maxLength2 = m;
            n.ratio = 1;
            return a.CreateJoint(n)
        },buttonAction: function(a) {
            a = 
            a.target;
            var c = levelsScripts[18];
            a.block || (a.block = !0, isSoundOn && mixer.play("button3"), 2 !== a.num ? (a.num++, stage.setTimeout(function() {
                c.barell.WakeUp();
                c.rotateFence(!1)
            }, 1.5 * fps)) : (a.onclick = a.onmousedown = a.onmouseup = a.onmouseout = a.onmouseover = null, a.gotoAndStop(0), a.hint.removeHint()), c.rotateFence(!0))
        },rotateFence: function(a) {
            var c = levelsScripts[18], e = c.fence.box2dBody, f = e.GetRotation(), g = new Vector(9, 3);
            g.rotate(-f);
            var h = e.GetCenterPosition(), k = h.x + g.x, l = h.y + g.y, m = {}, n = stage.setInterval(function() {
                f = 
                a ? f - 0.2 : f + 0.2;
                var g = new Vector(-9, -3);
                g.rotate(-f);
                m.x = k + g.x;
                m.y = l + g.y;
                e.SetOriginPosition(m, f);
                if (a && -1.2 > f || !a && -0.2 < f)
                    stage.clearInterval(n), a || (c.button.block = !1)
            }, 1)
        },leverAction: function(a) {
            a = a.target;
            var c = levelsScripts[18];
            if (0 === a.currentFrame || 5 === a.currentFrame)
                isSoundOn && mixer.play("lever"), "left" == a.side ? (a.side = "right", a.gotoAndPlay(0), moveBridge(c.bridge1, "x", !1, 10), moveBridge(c.bridge2, "x", !0, 10), isSoundOn && mixer.play("bridge2")) : (a.side = "left", a.rewindAndStop(5, 0), moveBridge(c.bridge1, 
                "x", !0, 10), moveBridge(c.bridge2, "x", !1, 10), isSoundOn && mixer.play("bridge1"))
        },ifBobMonster: function() {
            var a = field.bob;
            if (!a.monster && 248 < a.y) {
                a.monster = !0;
                a.blockClick = !0;
                a[a.state].visible = !1;
                world.DestroyBody(a.box2dBody);
                isSoundOn && mixer.play("bobMonster");
                var c = new TilesSprite(bitmaps.bobMonster, 128, 98, 16, 8, 2);
                c.x = a.x;
                c.y = a.y;
                c.onenterframe = function(c) {
                    14 == c.target.currentFrameX && (c.target.destroy = !0, c = new Sprite(bitmaps.bobMonster2, 76, 56, 12), c.x = a.x, c.y = a.y - 11, c.animDelay = 2, stage.addChild(c), 
                    stage.setTimeout(showGameOverScreen, 2 * fps))
                };
                stage.addChild(c)
            }
        },ifLogGoToSleep: function() {
            var a = levelsScripts[18].log.box2dBody, c;
            if (c = a.GetContactList())
                for (c; c; c = c.next)
                    c.other.sprite && "sleep" == c.other.sprite.custom && a.GoToSleep()
        },ifBobFlatten: function() {
            var a = field.bob, c = levelsScripts[18], e = c.lift;
            stage.hitTest(a, e) && e.x + e.width / 2 + 16 > a.x && (stage.setTimeout(function() {
                e.box2dBody.GoToSleep();
                c.tube.box2dBody.GoToSleep()
            }, fps / 2), e.crushedBob || (e.crushedBob = !0, a.blockClick = !0, a.box2dBody.Freeze(), 
            stage.setTimeout(function() {
                a.changeState("BobFlatten");
                a.BobFlatten.gotoAndPlay(0)
            }, Math.floor(fps / 8))))
        },ifBobCancelSpeed: function() {
            var a = field.bob, c = levelsScripts[18].tube2;
            a.y - 80 < c.y && stage.hitTest(a, c) ? field.cancelSpeed = !0 : field.cancelSpeed = !1
        },ifBarelsFall: function() {
            for (var a = levelsScripts[18].barells, c = 0; c < a.length; c++) {
                var e = a[c];
                !e.fall && 240 < e.y && (e.fall = !0, isSoundOn && mixer.play("lvl19_water"))
            }
        },pretick: function() {
            var a = levelsScripts[18];
            a.ifBobMonster();
            a.ifLogGoToSleep();
            a.ifBobFlatten();
            a.ifBobCancelSpeed();
            a.ifBarelsFall()
        }}, {init: function() {
            var a = levelsScripts[19], c = field.bob, e = new TilesSprite(bitmaps.bobWinks, 50, 42, 38, 19, 2);
            e.setPosition(c.x, c.y);
            e.visible = !1;
            e.gotoAndStop(0);
            c.bobWinks = e;
            c.states.push(e);
            stage.addChild(e);
            e.onenterframe = function(a) {
                37 == a.target.currentFrameX && a.target.animated && (a.target.stop(), showWinScreen())
            };
            c = getObjectByInfo("grandpa");
            c.scaleX = -1;
            c.animDelay = 2;
            c.play();
            a.grandpa = c;
            c = getObjectByInfo("conveyor");
            c.play();
            a.conveyor = c;
            c = getObjectByInfo("Lift");
            c.up = !0;
            c.restrict = [c.y - 1, c.y + 135];
            c.setStatic(!0);
            a.lift = c;
            getObjectByCustomInfo("button_lift").onclick = a.buttonLiftAction;
            a.present = null;
            a.createPresent();
            for (c = 1; 3 >= c; c++) {
                var e = getObjectByCustomInfo("spring" + c), f = getObjectByCustomInfo("button_spring" + c);
                switch (c) {
                    case 1:
                        var g = new b2Vec2(3E5, 0);
                        break;
                    case 2:
                        g = new b2Vec2(-135E3, 0);
                        break;
                    case 3:
                        g = new b2Vec2(0, -195E3)
                }
                punch.call(f, e, a.present, g)
            }
            stage.setInterval(a.createPresent, fps);
            a.catcher = getObjectByInfo("catcher_lvl20");
            g = getObjectByCustomInfo("button_catch");
            g.onclick = a.buttonCatchAction;
            a.buttonCatch = g;
            deStaticCover("score")
        },buttonCatchAction: function(a) {
            var c = a.target;
            a = levelsScripts[19];
            var e = a.catcher, f = a.present;
            isSoundOn && mixer.play("button3");
            if (!c.block) {
                isSoundOn && mixer.play("lvl20_catcher");
                c.block = !0;
                a = e.y;
                var g = Easing.linear.easeIn, h = Math.floor(0.65 * fps), k = stage.createTween(e, "y", a, a + 68, h, g), l = stage.createTween(e, "y", a + 68, a, h, g);
                k.play();
                k.onfinish = function() {
                    f && f.x - f.width / 2 < e.x - 3 && f.x + f.width / 2 > e.x + 1 ? (f.catching = !0, f.vec = new Vector(f.x - 
                    e.x, f.y - e.y + 3), l.onchange = function() {
                        var a = {};
                        a.x = e.x + f.vec.x;
                        a.y = e.y + f.vec.y;
                        f.box2dBody.SetOriginPosition(a, 0);
                        f.box2dBody.GoToSleep()
                    }) : f.catching = !1;
                    l.play()
                };
                l.onfinish = function() {
                    f.catching || (c.block = !1)
                }
            }
        },createPresent: function() {
            var a = levelsScripts[19];
            if (!a.present) {
                var c = createObject({type: "present",x: -10,y: 230,rotation: 0}, findObject("present"));
                c.setZIndex(1);
                c.box2dBody.m_invI = 0;
                c.int = stage.setInterval(function() {
                    c.box2dBody.m_linearVelocity.x = 0.76 * SPEED_WALK;
                    stage.hitTest(a.conveyor, 
                    c) || (stage.clearInterval(c.int), c.int1 = stage.setInterval(function() {
                        350 < c.y && (stage.clearInterval(c.int1), c.destroy = !0, a.present = null)
                    }, 1))
                }, 1);
                a.present = c
            }
        },buttonLiftAction: function(a) {
            a = levelsScripts[19].lift;
            isSoundOn && mixer.play("button3");
            moveBridge(a, "y", a.up, 2);
            a.up = !a.up
        },ifGrandpaKicksBob: function() {
            var a = levelsScripts[19], c = a.grandpa, e = field.bob, f = e.box2dBody;
            stage.hitTest(e, c) && !e.kicked && (e.kicked = !0, isSoundOn && mixer.play("punch"), stage.setTimeout(function() {
                f.ApplyImpulse(new b2Vec2(-2E6, 
                -2E6), e);
                stage.setTimeout(function() {
                    e.kicked = !1
                }, fps / 2)
            }, 2 * c.animDelay), a.changeGrandpaImage(bitmaps.grandpaAngry, 80, 66, 9, -12.5, -1.5), c.onenterframe = function(e) {
                8 == e.target.currentFrame && (isSoundOn && mixer.play("lvl20_no"), a.changeGrandpaImage(bitmaps.grandpaAngry2, 66, 50, 7, 6, 1.5), c.onenterframe = function(e) {
                    6 == e.target.currentFrame && (a.changeGrandpaImage(bitmaps.grandpa, 54, 50, 20, 6.5), c.onenterframe = null, a.addPresentThoughts())
                })
            })
        },addPresentThoughts: function() {
            var a = levelsScripts[19].grandpa, c = new Sprite(bitmaps.present_thoughts, 
            64, 50, 5);
            c.x = a.x - 43;
            c.y = a.y - 30;
            c.scaleX = 0.5;
            c.scaleY = 0.5;
            c.opacity = 0.1;
            stage.addChild(c);
            var e = Math.floor(fps / 6);
            c.fadeTo(1, e, Easing.linear.easeIn);
            c.scaleTo(1, e, Easing.linear.easeIn, function() {
                stage.setTimeout(function() {
                    c.fadeTo(0.3, 2 * e, Easing.linear.easeIn);
                    c.scaleTo(0.3, 2 * e, Easing.linear.easeIn, function() {
                        c.destroy = !0
                    })
                }, 1.5 * fps)
            })
        },changeGrandpaImage: function(a, c, e, f, g, h) {
            var k = levelsScripts[19].grandpa;
            k.bitmap = a;
            k.width = c;
            k.height = e;
            k.totalFrames = f;
            g && (k.x += g);
            h && (k.y += h);
            k.gotoAndPlay(0)
        },
        ifBobFalls: function() {
            245 < field.bob.y && bobFalls()
        },ifPresentHitGrandpa: function() {
            var a = levelsScripts[19], c = a.grandpa, e = field.bob;
            a.present && !c.happy && stage.hitTest(a.present, c) && (c.happy = !0, isSoundOn && mixer.play("grandfather_gift", !1, !1, 3), a.changeGrandpaImage(bitmaps.grandpaHappy, 54, 56, 7), e.changeState("bobWinks"), e.bobWinks.gotoAndPlay(0), e.speed = SPEED_WALK / 2, stage.setTimeout(function() {
                e.speed = 0
            }, fps / 2), e.blockClick = !0)
        },pretick: function() {
            var a = levelsScripts[19];
            a.ifGrandpaKicksBob();
            a.ifBobFalls();
            a.ifPresentHitGrandpa()
        }}];
function getObjectByInfo(a) {
    for (var c = [], e = 0, f = stage.objects.length; e < f; e++)
        stage.objects[e].info == a && c.push(stage.objects[e]);
    return 1 == c.length ? c[0] : c
}
function getObjectByCustomInfo(a) {
    for (var c = 0, e = stage.objects.length; c < e; c++)
        if (stage.objects[c].custom == a)
            return stage.objects[c];
    return {}
}
function attachMouseEvents() {
    this.onmouseover = function(a) {
        gameState !== STATE_VICTORY && gameState !== STATE_GAME_OVER && a.target.gotoAndStop(1)
    };
    this.onmouseout = function(a) {
        gameState !== STATE_VICTORY && gameState !== STATE_GAME_OVER && a.target.gotoAndStop(0)
    };
    this.onmousedown = function(a) {
        gameState !== STATE_VICTORY && gameState !== STATE_GAME_OVER && a.target.gotoAndStop(2)
    };
    this.onmouseup = function(a) {
        gameState !== STATE_VICTORY && gameState !== STATE_GAME_OVER && a.target.gotoAndStop(1)
    }
}
function checkIfBobOnLift(a) {
    var c = field.bob;
    if (!stage.hitTest(c, a) || c.y > a.y)
        return !1;
    if (a.x - a.width / 2 <= c.x && a.x + a.width / 2 >= c.x)
        return !0
}
function turnBob(a) {
    var c = field.bob;
    stage.hitTest(c, a) && (c.blockClick = !0, "hide" != c.state && c.forceSleep(), c.direction = "right" == c.direction ? "left" : "right", "hide" == c.state ? (c.changeState("BobHideTurn"), c.BobHideTurn.gotoAndPlay(0)) : (c.changeState("BobTurns"), c.BobTurns.gotoAndPlay(0)))
}
function processSlider(a) {
    var c = field.bob, e = addBobState("BobTurns", 47, 561 / 14, 14);
    e.scaleX = -1;
    e.onenterframe = function(a) {
        13 == a.target.currentFrame && a.target.animated && (c.forceWakeUp(), a.target.stop(), setStateAfterTurn())
    };
    e = addBobState("BobHideTurn", 56, 36, 14);
    e.scaleX = -1;
    e.onenterframe = function(a) {
        13 == a.target.currentFrame && a.target.animated && (a.target.stop(), setStateAfterTurn())
    };
    var f = this;
    addHint.call(f, f.x, f.y);
    f.static = !0;
    f.onclick = function(e) {
        f.locked || "show" == c.state || c.blockClick || (isSoundOn && 
        mixer.play("baraban_turn"), f.locked = !0, "left" == c.direction ? (a.gotoAndPlay(0), a.onenterframe = function(c) {
            13 == c.target.currentFrame && (c.target.gotoAndStop(0), f.locked = !1, a.onenterframe = null)
        }) : (a.rewindAndStop(13), a.onenterframe = function(c) {
            0 == c.target.currentFrame && (c.target.stop(), f.locked = !1, a.onenterframe = null)
        }), turnBob(a))
    }
}
function setStateAfterTurn() {
    var a = field.bob;
    a.changeState("BobHideTurn" == a.state ? "hide" : 1 == a.selectedSpeed ? "walk" : "run");
    stage.setTimeout(function() {
        a.blockClick = !1
    }, Math.ceil(0.4 * fps))
}
function rotateHandler(a, c, e) {
    function f(a) {
        h && (stage.setTimeout(function() {
            g.sprite.setStatic(!0);
            e && e.setStatic(!0)
        }, 1), stage.clearInterval(l), h = !1)
    }
    var g = this, h, k, l, m = g.GetCenterPosition();
    a.onmousedown = function() {
        if (gameState == STATE_GAME && (a.gotoAndStop(2), -1 != a.custom.indexOf("left") && (k = !0), !h)) {
            var n = g.GetRotation();
            k && n <= c || !k && n >= c || (h = !0, g.sprite.setStatic(!1), e && e.setStatic(!1), l = stage.setInterval(function() {
                var a = g.GetRotation(), a = k ? a - 0.05 : a + 0.05;
                g.SetCenterPosition(m, a);
                (k && a <= c || !k && 
                a >= c) && f()
            }, 1))
        }
    };
    a.onmouseup = function(a) {
        gameState == STATE_GAME && (a.target.gotoAndStop(1), f())
    };
    a.onmouseout = function(a) {
        gameState == STATE_GAME && (a.target.gotoAndStop(0), f())
    }
}
function moveMechanism(a, c) {
    var e = this;
    e.onclick = function() {
        isSoundOn && mixer.play("snd_lever_double", !1);
        e.setStatic(!1);
        e.gotoAndPlay(0);
        e.onenterframe = function(a) {
            a = a.target;
            5 == a.currentFrame && (a.gotoAndStop(5), a.hint.removeHint(), a.setStatic(!0))
        };
        a.setStatic(!1);
        a.gotoAndPlay(0);
        c.box2dBody.WakeUp();
        e.onclick = null
    }
}
function moveBridgeMouseDown(a, c, e, f, g) {
    function h() {
        l && (g && stage.setTimeout(function() {
            k.sprite.setStatic(!0);
            e && e.setStatic(!0);
            f && f.setStatic(!0)
        }, 1), stage.clearInterval(n), l = !1)
    }
    var k = this, l, m, n;
    k.GetCenterPosition();
    a.onmousedown = function(p) {
        l || gameState != STATE_GAME || (p.target.gotoAndStop(2), -1 != a.custom.indexOf("left") && (m = !0), p = k.GetCenterPosition(), m && p.x <= c || !m && p.x >= c || (l = !0, g && (k.sprite.setStatic(!1), e && e.setStatic(!1), f && f.setStatic(!1)), n = stage.setInterval(function() {
            var a = k.GetCenterPosition();
            a.x = m ? a.x - 4 : a.x + 4;
            k.SetOriginPosition(a, 0);
            (m && a.x <= c || !m && a.x >= c) && h()
        }, 1)))
    };
    a.onmouseup = function(a) {
        gameState == STATE_GAME && (a.target.gotoAndStop(1), h())
    };
    a.onmouseout = function(a) {
        gameState == STATE_GAME && (a.target.gotoAndStop(0), h())
    }
}
function moveBridge(a, c, e, f, g, h) {
    var k = a.box2dBody, l = k.GetCenterPosition(), m = field.bob;
    !e && l[c] < a.restrict[0] || e && l[c] > a.restrict[1] || (stage.clearInterval(a.int), a.setStatic(!1), g && g.setStatic(!1), a.int = stage.setInterval(function() {
        var l = k.GetCenterPosition();
        l[c] = e ? l[c] + (f ? f : 2) : l[c] - (f ? f : 2);
        k.SetOriginPosition(l, 0);
        if ("y" == c && m.x > a.x - a.width / 2 && m.x < a.x + a.width / 2 && stage.hitTest(m, a)) {
            var p = m.box2dBody.GetCenterPosition();
            p.y = e ? p.y + (f ? f : 2) : p.y - (f ? f : 2);
            m.box2dBody.SetOriginPosition(p, 0)
        }
        if (!e && l[c] < 
        a.restrict[0] || e && l[c] > a.restrict[1])
            stage.setTimeout(function() {
                a.setStatic(!0);
                g && g.setStatic(!0);
                h && h()
            }, 2), stage.clearInterval(a.int)
    }, 1))
}
function trapHandler(a) {
    var c = this;
    c.scaleX = -1;
    c.onenterframe = leverOnenterframe;
    c.onclick = function(c) {
        c = c.target;
        c.setStatic(!1);
        c.cover.setStatic(!1);
        c.onclick = null;
        c.play();
        isSoundOn && mixer.play("lever");
        isSoundOn && mixer.play("bridge2");
        a.hitBobAction = null;
        c = stage.createTween(a, "x", a.x, a.x - 68, Math.floor(0.5 * fps), Easing.linear.easeIn);
        c.onfinish = function() {
            a.setStatic(!0)
        };
        c.play()
    };
    a.onenterframe = function(a) {
        a = a.target;
        8 == a.currentFrame && a.stop()
    };
    a.hitBobAction = function() {
        var e = field.bob;
        e.blockClick || 
        (e.blockClick = !0, c.onclick = null, c.hint.removeHint(), stage.setTimeout(function() {
            isSoundOn && mixer.play("trap");
            a.play();
            e.changeState("inTrap");
            e.inTrap.gotoAndPlay(0);
            e.box2dBody.SetCenterPosition(new b2Vec2(a.x + 60, a.y - 15), 0);
            e.box2dBody.Freeze()
        }, Math.floor(fps / 4)))
    }
}
function moveLift(a) {
    var c = this.box2dBody, e, f, g = field.bob.box2dBody, h = this;
    moveLift.int && stage.clearInterval(moveLift.int);
    this.setStatic(!1);
    this.cover.setStatic(!1);
    switch (a) {
        case "up":
            moveLift.int = stage.setInterval(function() {
                e = c.GetCenterPosition();
                e.y -= 2;
                c.SetCenterPosition(e, 0);
                checkIfBobOnLift(h) && (f = g.GetCenterPosition(), f.y -= 1, g.SetCenterPosition(f, 0));
                200 >= e.y && (stage.clearInterval(moveLift.int), stage.setTimeout(function() {
                    h.setStatic(!0);
                    h.cover.setStatic(!0)
                }, 1))
            }, 1);
            break;
        case "down":
            moveLift.int = 
            stage.setInterval(function() {
                e = c.GetCenterPosition();
                e.y += 2;
                c.SetCenterPosition(e, 0);
                246 <= e.y && (isSoundOn && mixer.play("lvl2_lift"), stage.clearInterval(moveLift.int), stage.setTimeout(function() {
                    h.setStatic(!0);
                    h.cover.setStatic(!0)
                }, 1))
            }, 1);
            break;
        default:
            console.log("unknown direction")
    }
}
function punch(a, c, e) {
    a.onenterframe = function(a) {
        a = a.target;
        a.currentFrame == a.totalFrames - 1 && a.gotoAndStop(0)
    };
    this.onclick = function(f) {
        if (0 === a.currentFrame) {
            a.play();
            isSoundOn && mixer.play("spring");
            if (20 == currentLevel) {
                c = levelsScripts[19].present;
                if (!c)
                    return;
                "button_spring1" == f.target.custom && (levelsScripts[19].buttonCatch.block = !1)
            }
            stage.hitTest(a, c) && (f = Math.ceil((getDistance(a, c) - 24) / 7), stage.setTimeout(function() {
                c.box2dBody.WakeUp();
                c.box2dBody.ApplyImpulse(e, c.box2dBody.GetCenterPosition());
                if (c == field.bob) {
                    field.cancelSpeed = !0;
                    var a = 10, f = stage.setInterval(function() {
                        var e = c.box2dBody.GetLinearVelocity();
                        20 > e.x ? (stage.clearInterval(f), field.cancelSpeed = !1) : (a += 1, e.x -= a)
                    }, 1)
                }
            }, f))
        }
    }
}
function ifBobShocked(a) {
    var c = field.bob;
    !c.isShocked && stage.hitTest(a, c) && (c.isShocked = !0, c.blockClick = !0, isSoundOn && mixer.play("bob_angel"), stage.setTimeout(function() {
        isSoundOn && mixer.play("electricity");
        c.forceSleep();
        c.speed = 0;
        var a = c.box2dBody.GetCenterPosition();
        a.y -= 20;
        c.box2dBody.SetCenterPosition(a, 0);
        c.box2dBody.Freeze();
        console.log("shock!!");
        c.changeState("shocked");
        c.shocked.gotoAndPlay(0)
    }, fps / 4))
}
function createRope(a, c, e) {
    var f = [], g = 11 != currentLevel ? findObject("rope_lvl7") : findObject("rope_lvl11");
    g.density = e;
    for (var h, k = 0; k < a; k++) {
        if (11 != currentLevel) {
            g.density -= e / 50;
            var l = createObject({type: "rope_lvl7",x: c.x,y: c.y + 4 * k,rotation: 0}, g), m = {x: l.x,y: l.y - 3}
        } else
            g.density -= e / 27, l = createObject({type: "rope_lvl11",x: c.x,y: c.y + 13 * k,rotation: 0}, g), m = {x: l.x,y: l.y - 6.5};
        l.setZIndex(1);
        f.push(l);
        if (0 == k) {
            var n = box2DCreateCircle(world, l.x, l.y - (11 != currentLevel ? 2 : 11), 1, 1, !0, 1, 0, 0);
            h = n
        } else
            n = f[k - 1].box2dBody;
        box2DCreateRevoluteJoint(world, n, l.box2dBody, m);
        box2DCreateDistanceJoint(world, n, l.box2dBody, {x: m.x,y: m.y - 1}, {x: m.x,y: m.y + 1})
    }
    return {ropes: f,begin: h}
}
function addStateBobGrowl() {
    var a = 0;
    addBobState("BobGrowl", 50, 42, 15).onenterframe = function(c) {
        var e = field.bob;
        isSoundOn && !e.soundPlayed && c.target.animated && (mixer.play("bobGrowl"), e.soundPlayed = !0);
        c.target.animated && (e.blockClick = !0);
        14 == c.target.currentFrame && c.target.animated && (1 > a ? (c.target.gotoAndPlay(0), a++) : (c.target.stop(), e.isAsleep && e.forceWakeUp(), c = 1 == e.selectedSpeed ? "walk" : "run", e.changeState(c), e[c].gotoAndPlay(0), e.soundPlayed = !1, e.blockClick = !1))
    }
}
function addStateBobFlatten() {
    var a = addBobState("BobFlatten", 78, 44, 16);
    a.onenterframe = function(a) {
        !field.bob.flatten && a.target.animated && (isSoundOn && mixer.play("bobFlatten"), field.bob.flatten = !0);
        15 == a.target.currentFrame && a.target.animated && (a.target.stop(), showGameOverScreen())
    };
    a.animDelay = 1;
    a.setZIndex(15)
}
function bobFalls() {
    if (!field.bob.falls) {
        isSoundOn && mixer.play("bobFalls");
        var a = field.bob;
        a[a.state].opacity = 0;
        a.falls = !0;
        var c = new Sprite(bitmaps.BobFall1, 50, 174, 5);
        c.x = a.x;
        c.y = a.y - 40;
        c.animDelay = 1;
        c.setZIndex(15);
        stage.addChild(c);
        stage.setTimeout(function() {
            c.bitmap = bitmaps.BobFall2;
            stage.setTimeout(function() {
                c.bitmap = bitmaps.BobFall3;
                stage.setTimeout(function() {
                    c.destroy = !0;
                    stage.setTimeout(showGameOverScreen, fps / 2)
                }, 4 * c.animDelay)
            }, 5 * c.animDelay - 1)
        }, 5 * c.animDelay - 1);
        stage.createTween(c, "y", 
        c.y, c.y + 170, 13 * c.animDelay, Easing.sine.easeIn).play()
    }
}
function addStateBobShocked() {
    var a = 0;
    addBobState("shocked", 94, 102, 4).onenterframe = function(c) {
        if (2 == c.target.currentFrame && (3 > a ? (a++, c.target.gotoAndPlay(1)) : c.target.gotoAndPlay(3), 3 == c.target.currentFrame)) {
            c.target.opacity = 0;
            c.target.stop();
            field.bob.changeState("shocked2");
            field.bob.shocked2.gotoAndPlay(0);
            c.target.onenterframe = null;
            var e = new Sprite(bitmaps.spirit, 75, 100);
            e.x = c.target.x;
            e.y = c.target.y;
            stage.addChild(e);
            c = stage.createTween(e, "y", c.target.y, -50, 1.5 * fps, Easing.linear.easeIn);
            c.play();
            c.onfinish = showGameOverScreen
        }
    };
    shocked2 = addBobState("shocked2", 94, 102, 7);
    shocked2.onenterframe = function(a) {
        6 == a.target.currentFrame && a.target.stop(0)
    };
    shocked2.animDelay = 3
}
function bobBurns(a) {
    var c = field.bob;
    if (!c.onFire) {
        isSoundOn && mixer.play("bobOnFire");
        c.onclick = null;
        c.onFire = !0;
        c.blockClick = !0;
        c[c.state].visible = !1;
        c.box2dBody.Freeze();
        var e = new Sprite(bitmaps.BobBurn, 50, 52, 7);
        e.setPosition(c.x, c.y - 7);
        e.animDelay = 2;
        e.setZIndex(15);
        e.onenterframe = function(c) {
            6 == c.target.currentFrame && c.target.animated && (c.target.stop(), a && stage.setTimeout(function() {
                a.destroy = !0
            }, 10))
        };
        stage.addChild(e);
        e = new Sprite(bitmaps.BobBurnAnimMc2, 60, 42, 15);
        e.x = c.x;
        e.y = c.y + 3;
        e.animDelay = 
        2;
        stage.addChild(e);
        c = stage.createTween(e, "x", e.x, 510, fps / 250 * (510 - e.x), Easing.linear.easeIn);
        stage.setTimeout(c.play, 2 * e.animDelay);
        c.onfinish = showGameOverScreen
    }
}
function addStateBobFly() {
    var a = field.bob, c = addBobState("fly", 50, 50, 18);
    c.animDelay = 1;
    c.setZIndex(15);
    c.onenterframe = function(e) {
        12 != e.target.currentFrame || c.stopFly || e.target.gotoAndPlay(5);
        17 == e.target.currentFrame && (e = "hide" == a.selectedState ? "hide" : 1 == a.selectedSpeed ? "walk" : "run", a.changeState(e), a[e].gotoAndPlay(0), "hide" == e && stage.setTimeout(function() {
            isSoundOn && mixer.play("bob_hideshell")
        }, 2 * a.hide.animDelay), a.blockClick = !1, c.stopFly = !1, c.gotoAndStop(0))
    }
}
function addStateBobInTrap() {
    var a = addBobState("inTrap", 52, 64, 13);
    a.animDelay = 1;
    a.setZIndex(1);
    a.onenterframe = function(a) {
        12 == a.target.currentFrame && (a.target.stop(), showGameOverScreen())
    }
}
var stage, world, GET, LANDSCAPE_MODE = !0, bitmaps, width = 480, height = 320, fps = 24, gameState, STATE_SPLASH = 0, STATE_GAME = 1, STATE_MENU = 2, STATE_SELECT_LEVEL = 3, STATE_GAME_LOGO = 4, STATE_VICTORY = 5, STATE_GAME_OVER = 6, STATE_COMICS = 7, STATE_FINAL = 8, STATE_CREDITS = 9, STATE_SPLASH_LOGO = 10, comics, field, currentLevel, screenWidthCoef, screenHeightCoef, gameScore, totalScore, SPEED_WALK = 1.5 * fps, SPEED_RUN = 3 * fps, MORE_GAMES_URL = "http://www.a10.com/", WALKTHROUGH_URL = "http://www.a10.com/walkthrough-games/snail-bob-mobile-walkthrough", mixer, 
isMusicOn, isSoundOn, loopSound, showDebugDraw = !1, firstLevel, console = {log: function() {
    }}, editorLevel = 7, isWebAudioSupport = AudioMixer.isWebAudioSupport();
window.onload = function() {
    GET = Utils.parseGet();
    Utils.addMobileListeners(LANDSCAPE_MODE);
    Utils.mobileCorrectPixelRatio();
    Utils.addFitLayoutListeners();
    setTimeout(startLoad, 600)
};
function startLoad() {
    var a = Utils.getMobileScreenResolution(LANDSCAPE_MODE);
    1 == GET.debug && (a = Utils.getScaleScreenResolution(1, LANDSCAPE_MODE));
    Utils.globalScale = a.scale;
    for (var c = [1.5], e = window.innerWidth > window.innerHeight ? window.innerWidth / window.innerHeight : window.innerHeight / window.innerWidth, f = 1E5, g = -1, h = 0; h < c.length - 1; h++)
        g = Math.abs(e - c[h]), g < f && (f = g, g = h);
    g = 0;
    screenWidthCoef = [1][g];
    screenHeightCoef = [1][g];
    screenWidthRatioPos = g;
    a.width = Math.round(a.width * screenWidthCoef);
    a.height = Math.round(a.height * 
    screenHeightCoef);
    Utils.createLayout(document.getElementById("main_container"), a);
    Utils.addEventListener("fitlayout", function() {
        stage && (stage.drawScene(document.getElementById("screen")), buildBackground())
    });
    Utils.addEventListener("lockscreen", function() {
        stage && stage.started && stage.stop()
    });
    Utils.addEventListener("unlockscreen", function() {
        stage && !stage.started && stage.start()
    });
    Utils.mobileHideAddressBar();
    1 != GET.debug && Utils.checkOrientation(LANDSCAPE_MODE);
    a = new ImagesPreloader;
    c = [];
    e = Utils.imagesRoot + 
    "/" + Utils.globalScale + "/";
    console.log("Scale = " + Utils.globalScale);
    for (h = 0; h < objects.length; h++)
        c.push({name: objects[h].name,src: e + objects[h].image});
    c.push({name: "hourglass",src: e + "hourglass.png"});
    c.push({name: "LevelsMap",src: e + "menu/LevelsMap.jpg"});
    c.push({name: "Lvl_locked",src: e + "menu/Lvl_locked.png"});
    c.push({name: "LvlN",src: e + "menu/LvlN.png"});
    c.push({name: "numb",src: e + "menu/numb.png"});
    c.push({name: "bobMenu",src: e + "menu/bobMenu.png"});
    c.push({name: "credits",src: e + "menu/credits.png"});
    c.push({name: "menuBack",
        src: e + "menu/menuBack.jpg"});
    c.push({name: "moreGames",src: e + "menu/moreGames.png"});
    c.push({name: "play",src: e + "menu/play.png"});
    c.push({name: "intro",src: e + "menu/intro.png"});
    c.push({name: "soundButton",src: e + "menu/soundButton.png"});
    c.push({name: "num_lvl_map_up",src: e + "menu/num_lvl_map_up.png"});
    c.push({name: "score_num",src: e + "menu/score_num.png"});
    c.push({name: "menu_btn",src: e + "menu/menu_btn.png"});
    c.push({name: "fly_menu",src: e + "menu/fly_menu.png"});
    c.push({name: "bob1",src: e + "menu/bob1.png"});
    c.push({name: "transporant",
        src: e + "menu/transporant.png"});
    c.push({name: "splashBack",src: e + "menu/splashBack.jpg"});
    c.push({name: "play_splash",src: e + "menu/play_splash.png"});
    //c.push({name: "logoMenu",src: e + "menu/logoMenu.png"});
    c.push({name: "auth1",src: e + "credits/auth1.png"});
    c.push({name: "auth2",src: e + "credits/auth2.png"});
    c.push({name: "close_credits",src: e + "credits/close_credits.png"});
    c.push({name: "credits_back",src: e + "credits/credits_back.png"});
    c.push({name: "play_credits",src: e + "credits/play_credits.png"});
    c.push({name: "lvl_numbs",
        src: e + "ingame/lvl_numbs.png"});
    c.push({name: "Lvl",src: e + "ingame/Lvl.png"});
    c.push({name: "SpeedBob",src: e + "ingame/SpeedBob.png"});
    c.push({name: "SpeedFastBtn",src: e + "ingame/SpeedFastBtn.png"});
    c.push({name: "SspeedStandardBtn",src: e + "ingame/SspeedStandardBtn.png"});
    c.push({name: "SpeedIndicatorMc",src: e + "ingame/SpeedIndicatorMc.png"});
    c.push({name: "PanelSpeed",src: e + "ingame/PanelSpeed.png"});
    c.push({name: "lvlMapIngame",src: e + "ingame/lvlMapIngame.png"});
    c.push({name: "restartIngame",src: e + "ingame/restartIngame.png"});
    c.push({name: "score",src: e + "ingame/score.png"});
    c.push({name: "score_num_ingame",src: e + "ingame/score_num_ingame.png"});
    c.push({name: "BobGo",src: e + "BobGo.png"});
    c.push({name: "BobRun",src: e + "BobRun.png"});
    c.push({name: "BobShow",src: e + "BobShow.png"});
    c.push({name: "BobHide",src: e + "BobHide.png"});
    c.push({name: "backTube1",src: e + "backTube1.png"});
    c.push({name: "backTube2",src: e + "backTube2.png"});
    c.push({name: "LVL_map",src: e + "LVL_map.png"});
    //c.push({name: "WalkthroughButton",src: e + "WalkthroughButton.png"});
    c.push({name: "NextLeveButton",
        src: e + "NextLeveButton.png"});
    c.push({name: "TryAgainButton",src: e + "TryAgainButton.png"});
    c.push({name: "PanelLevelComplete",src: e + "PanelLevelComplete.png"});
    c.push({name: "GameOver",src: e + "GameOver.png"});
    c.push({name: "hint",src: e + "Hint.png"});
    c.push({name: "fly",src: e + "fly.png"});
    c.push({name: "inTrap",src: e + "bobtrapmovie2.png"});
    c.push({name: "BobTurns",src: e + "BobTurns.png"});
    c.push({name: "BobHideTurn",src: e + "BobHideTurn.png"});
    c.push({name: "BobGrowl",src: e + "BobGrowl.png"});
    c.push({name: "BobFall1",src: e + 
        "BobFall1.png"});
    c.push({name: "BobFall2",src: e + "BobFall2.png"});
    c.push({name: "BobFall3",src: e + "BobFall3.png"});
    c.push({name: "BobFlatten",src: e + "BobFlattenAnimMc.png"});
    c.push({name: "BobBurn",src: e + "BobBurnAnimMc1.png"});
    c.push({name: "BobBurnAnimMc2",src: e + "BobBurnAnimMc2.png"});
    //c.push({name: "logoCleared",src: e + "logoCleared.png"});
    //c.push({name: "for_lvls",src: e + "for_lvls.png"});
    c.push({name: "btn",src: e + "btn.png"});
    c.push({name: "shocked",src: e + "electroshock1.png"});
    c.push({name: "shocked2",src: e + "electroshock2.png"});
    c.push({name: "spirit",src: e + "spirit.png"});
    c.push({name: "caterpillar_move2",src: e + "caterpillar_move2.png"});
    c.push({name: "levelCompleteNum",src: e + "levelCompleteNum.png"});
    c.push({name: "LevelCompleteBobs",src: e + "LevelCompleteBobs.png"});
    c.push({name: "tap_to_continue",src: e + "tap_to_continue.png"});
    c.push({name: "Splash_Image",src: e + "Splash_Image.png"});
    c.push({name: "SkipBtnMc",src: e + "comics/SkipBtnMc.png"});
    for (h = 1; 8 > h; h++)
        c.push({name: "comics" + h,src: e + "comics/comics" + h + ".jpg"});
    c.push({name: "finalBack",
        src: e + "final/finalBack.jpg"});
    c.push({name: "caterpilars_final",src: e + "final/caterpilars_final.png"});
    c.push({name: "dima_final",src: e + "final/dima_final.png"});
    c.push({name: "fedor_final",src: e + "final/fedor_final.png"});
    c.push({name: "fly_final",src: e + "final/fly_final.png"});
    c.push({name: "grandpa_final",src: e + "final/grandpa_final.png"});
    c.push({name: "igor_final",src: e + "final/igor_final.png"});
    c.push({name: "transporant_final",src: e + "final/transporant_final.png"});
    c.push({name: "woodpecker_final",src: e + 
        "final/woodpecker_final.png"});
    c.push({name: "ant_final",src: e + "final/ant_final.png"});
    c.push({name: "game_complete_final",src: e + "final/game_complete_final.png"});
    c.push({name: "thanks_final",src: e + "final/thanks_final.png"});
    c.push({name: "total_score_final",src: e + "final/total_score_final.png"});
    c.push({name: "numb_final",src: e + "final/numb_final.png"});
    for (h = 0; h < levels.length; h++)
        c.push({name: "Lvl" + (h + 1) + "_back",src: e + "levels/" + (10 > h + 1 ? "0" + (h + 1) : h + 1) + "/Lvl" + (h + 1) + "_back.jpg"});
    c.push({name: "cooked",src: e + 
        "levels/02/cooked.png"});
    c.push({name: "Lift_Mask",src: e + "levels/02/Lift_Mask.png"});
    c.push({name: "Glad1",src: e + "levels/02/Glad1.png"});
    c.push({name: "Glad2",src: e + "levels/02/Glad2.png"});
    c.push({name: "Sad1",src: e + "levels/02/Sad1.png"});
    c.push({name: "Sad2",src: e + "levels/02/Sad2.png"});
    c.push({name: "look_at_terminator",src: e + "levels/03/look_at_terminator.png"});
    c.push({name: "terminator_attack",src: e + "levels/03/terminator_attack.png"});
    c.push({name: "terminator_fight",src: e + "levels/03/terminator_fight.png"});
    c.push({name: "terminator_move",src: e + "levels/03/terminator_move.png"});
    c.push({name: "terminator_die",src: e + "levels/03/terminator_die.png"});
    c.push({name: "textOfTerminator",src: e + "levels/03/textOfTerminator.png"});
    c.push({name: "fire_anim_test",src: e + "levels/05/fire_anim_test.png"});
    c.push({name: "fire_lvl5",src: e + "levels/05/fire_lvl5.png"});
    c.push({name: "caterpillar_blow1",src: e + "levels/06/caterpillar_blow1.png"});
    c.push({name: "caterpillar_blow2",src: e + "levels/06/caterpillar_blow2.png"});
    c.push({name: "caterpillar_blow3",
        src: e + "levels/06/caterpillar_blow3.png"});
    c.push({name: "caterpillar_eat2",src: e + "levels/06/caterpillar_eat2.png"});
    c.push({name: "bobAfraid",src: e + "levels/08/bobAfraid.png"});
    c.push({name: "bobBurns_tiles",src: e + "levels/09/bobBurns_tiles.png"});
    c.push({name: "bobSquashed",src: e + "levels/11/bobSquashed.png"});
    c.push({name: "bobSquashed2",src: e + "levels/11/bobSquashed2.png"});
    c.push({name: "ball2",src: e + "levels/12/ball2.png"});
    c.push({name: "ball3",src: e + "levels/12/ball3.png"});
    c.push({name: "ball4",src: e + "levels/12/ball4.png"});
    c.push({name: "ball5",src: e + "levels/12/ball5.png"});
    c.push({name: "dima2",src: e + "levels/14/dima2.png"});
    c.push({name: "igor2",src: e + "levels/14/igor2.png"});
    c.push({name: "jeka2",src: e + "levels/14/jeka2.png"});
    c.push({name: "jeka3",src: e + "levels/14/jeka3.png"});
    c.push({name: "jeka4",src: e + "levels/14/jeka4.png"});
    c.push({name: "hunter2",src: e + "levels/15/hunter2.png"});
    c.push({name: "hunter3",src: e + "levels/15/hunter3.png"});
    c.push({name: "bobWounded",src: e + "levels/15/bobWounded.png"});
    c.push({name: "bobUfo",src: e + 
        "levels/16/bobUfo.png"});
    c.push({name: "shutter2",src: e + "levels/17/shutter2.png"});
    c.push({name: "caterpillar_eat1",src: e + "levels/17/caterpillar_eat1.png"});
    for (h = 2; 7 >= h; h++)
        c.push({name: "woodpecker" + h,src: e + "levels/18/woodpecker" + h + ".png"});
    c.push({name: "bobMonster",src: e + "levels/19/bobMonster.png"});
    c.push({name: "bobMonster2",src: e + "levels/19/bobMonster2.png"});
    c.push({name: "bobSurprised",src: e + "levels/19/bobSurprised.png"});
    c.push({name: "bobWinks",src: e + "levels/20/bobHappy.png"});
    c.push({name: "grandpaAngry",
        src: e + "levels/20/grandpaAngry.png"});
    c.push({name: "grandpaAngry2",src: e + "levels/20/grandpaAngry2.png"});
    c.push({name: "grandpaHappy",src: e + "levels/20/grandpaHappy.png"});
    c.push({name: "present_thoughts",src: e + "levels/20/present_thoughts.png"});
    a.maxProgressVal = 50;
    a.load(c, loadImagesEnd, Utils.showLoadProgress)
}
function loadImagesEnd(a) {
    bitmaps = a;
    a = [];
    a.push("Music/background_music");
    isWebAudioSupport && (a.push("Music/ball"), a.push("Music/baraban_turn"), a.push("Music/bob_angel"), a.push("Music/bobFalls"), a.push("Music/bobFlatten"), a.push("Music/bobGrowl"), a.push("Music/bobMonster"), a.push("Music/bobOnFire"), a.push("Music/bobWounded_15lvl"), a.push("Music/bridge1"), a.push("Music/bridge2"), a.push("Music/button"), a.push("Music/button2"), a.push("Music/button3"), a.push("Music/caterpillar_eat"), a.push("Music/dima"), 
    a.push("Music/electricity"), a.push("Music/fan_off"), a.push("Music/fan_on"), a.push("Music/game_victory"), a.push("Music/hunter_shot"), a.push("Music/igor"), a.push("Music/lever"), a.push("Music/lvl11_dart"), a.push("Music/lvl12_crane"), a.push("Music/lvl15_rotate_wheel"), a.push("Music/lvl16_ufo_bye_bye"), a.push("Music/lvl19_water"), a.push("Music/lvl2_boiler"), a.push("Music/lvl2_lift"), a.push("Music/lvl20_no"), a.push("Music/lvl3_dzin"), a.push("Music/lvl4_antiant"), a.push("Music/lvl4_bridges"), a.push("Music/lvl5_fireball"), 
    a.push("Music/lvl17_caterpillar"), a.push("Music/lvl17_shutter"), a.push("Music/lvl8_skeleton"), a.push("Music/lvl20_catcher"), a.push("Music/magnet_on"), a.push("Music/oops"), a.push("Music/punch"), a.push("Music/saw"), a.push("Music/speed1"), a.push("Music/speed2"), a.push("Music/spring"), a.push("Music/teleport"), a.push("Music/terminator_fight"), a.push("Music/trap"), a.push("Music/ufo_takes"), a.push("Music/woodpecker"), a.push("Music/lvl3_doors"), a.push("Music/lvl3_terminator_appear"), a.push("Music/fire"), 
    a.push("Music/bob_hideshell"), a.push("Music/bob_outshell"), a.push("Music/caterpillar_happy"), a.push("Music/caterpillar_sad"), a.push("Music/grandfather_gift"), a.push("Music/final"), a.push("Music/bob_skeleton"), a.push("Music/ComicsMusic1"));
    a = new SoundsPreloader(a, loadSoundsEnd, Utils.showLoadProgress);
    a.maxProgressVal = 50;
    a.minProgressVal = 50;
    a.load()
}
function loadSoundsEnd() {
    document.getElementById("progress_container").style.display = "none";
    document.getElementById("screen_container").style.display = "block";
    document.getElementById("screen_background_container").style.display = "block";
    getLevelsScores();
    isSoundOn = 2 == parseInt(Utils.getCookie("snail_bob_sound")) ? isMusicOn = !1 : isMusicOn = !0;
    isWebAudioSupport || (isSoundOn = !1);
    1 != GET.debug && (gameState = STATE_SPLASH_LOGO, createScene())
}
Sprite.prototype.rewindAndStop = function(a, c) {
    var e = this;
    this.animated = !1;
    this.currentFrame = a;
    var f = c ? c : 0, g = stage.setInterval(function() {
        e.prevFrame();
        (e.currentFrame == f || e.animated) && stage.clearInterval(g)
    }, this.animDelay)
};
Sprite.prototype.prevFrame = function() {
    this.dispatchEvent("enterframe", {target: this});
    this.history && !this.history.created && this.updateHistory();
    0 == this.currentFrame ? this.currentFrame = this.totalFrames - 1 : this.currentFrame--
};
Sprite.prototype.setStatic = function(a) {
    this.static != a && (this.static = a, field.rebuildBack = !0)
};
function showSplashLogo() {
    var a = new Sprite(null, 480, 320);
    a.x = 240;
    a.y = 160;
    a.fillColor = "#fff";
    a.static = !0;
    a.onclick = function(a) {
        a.target.onclick = null;
        c.static = !1;
        c.destroy = !0;
        buildBackground();
        var f = new Sprite(null, 1, 15);
        f.x = 105;
        f.y = 200;
        f.fillColor = "#bb4a00";
        stage.addChild(f);
        var g = stage.setInterval(function() {
            f.width += 4;
            f.x += 2;
            300 <= f.width && (stage.clearInterval(g), gameState = STATE_SPLASH, createScene())
        }, 1)
    };
    stage.addChild(a);
    a = new Sprite(bitmaps.Splash_Image, 351, 130);
    a.x = 240;
    a.y = 120;
    a.onclick = showMoreGames;
    a.static = !0;
    stage.addChild(a);
    var c = new Sprite(bitmaps.tap_to_continue, 175, 18);
    c.x = 240;
    c.y = 250;
    c.static = !0;
    stage.addChild(c)
}
function showSplash() {
    var a = new Sprite(bitmaps.splashBack, 480, 320);
    a.x = 240;
    a.y = 160;
    a.static = !0;
    stage.addChild(a);
    a = new Sprite(bitmaps.play_splash, 104, 38, 3);
    a.x = 230;
    a.y = 230;
    a.stop();
    a.onclick = function() {
        mixer = new AudioMixer("Music", 7);
        isMusicOn && mixer.play("background_music", !0, !0, 0);
        gameState = STATE_MENU;
        createScene()
    };
    stage.addChild(a);
    attachMouseEvents.call(a);
    a = new Sprite(bitmaps.bobMenu, 52, 58, 12);
    a.x = 230;
    a.y = 65;
    a.animDelay = 2;
    stage.addChild(a);
    
    /*
    a = new Sprite(bitmaps.bob1, 88, 95);
    a.x = 60;
    a.y = 260;
    stage.addChild(a);
    a = new Sprite(bitmaps.transporant, 120, 50, 19);
    a.x = 65;
    a.y = 195;
    stage.addChild(a)*/
    
    
    
}
function getStageCenter() {
    return stage.screenWidth / 2
}
function getStageHeightCenter() {
    return stage.screenHeight / 2
}
function createScene() {
    createStage();
    switch (gameState) {
        case STATE_SPLASH_LOGO:
            showSplashLogo();
            break;
        case STATE_SPLASH:
            showSplash();
            break;
        case STATE_MENU:
            showMenu();
            break;
        case STATE_SELECT_LEVEL:
            showLevelSelect();
            break;
        case STATE_COMICS:
            showComics()
    }
    buildBackground();
    stage.start()
}
function showFinalScreen() {
    function a() {
        var a = new Sprite(bitmaps.game_complete_final, 198, 37);
        a.x = -100;
        a.y = 30;
        stage.addChild(a);
        var c = stage.createTween(a, "x", a.x, 240, fps, Easing.quartic.easeOut), a = new Sprite(bitmaps.thanks_final, 220, 34);
        a.x = 590;
        a.y = 70;
        stage.addChild(a);
        var a = stage.createTween(a, "x", a.x, 240, fps, Easing.quartic.easeOut), e = new SpritesGroup(stage);
        e.x = -150;
        e.y = 110;
        var f = new Sprite(bitmaps.total_score_final, 263, 45);
        f.gx = 0;
        f.gy = 0;
        e.addChild(f, !0);
        var f = getTotalLevelsScores(), g = new SimpleText(bitmaps.numb_final, 
        22, 24);
        g.align = g.ALIGN_LEFT;
        g.x = 55;
        g.y = 1;
        g.write(f);
        g.addToGroup(e);
        var e = stage.createTween(e, "x", e.x, 240, fps, Easing.quartic.easeOut), h = new Sprite(bitmaps.menu_btn, 84, 50);
        h.x = 500;
        h.y = 300;
        h.rotation = -Math.PI / 2;
        h.onclick = function() {
            gameState = STATE_MENU;
            createScene();
            isMusicOn && (mixer.stop(0), mixer.play("background_music", !0, !0, 0))
        };
        stage.addChild(h);
        c.onfinish = a.play;
        a.onfinish = e.play;
        e.onfinish = function() {
            var a = stage.setInterval(function() {
                var c = new Vector(-130, -20);
                h.rotation += 0.1;
                c.rotate(-h.rotation);
                h.x = 470 + c.x;
                h.y = 170 + c.y;
                -0.1 <= h.rotation && stage.clearInterval(a)
            }, 1)
        };
        c.play()
    }
    function c(a, c, e, g, h, k) {
        a = new Sprite(bitmaps[a], c, e, g);
        a.gx = h;
        a.gy = k;
        a.animDelay = 2;
        f.addChild(a, !0);
        return a
    }
    function e(a, e, f) {
        a = c("fly_final", 22, 22, 6, a, e);
        a.animDelay = 1;
        f && (a.gscaleX = -1);
        f = stage.createTween(a, "gy", e, e + 2.5, 5 * m.animDelay, Easing.linear.easeIn);
        e = stage.createTween(a, "gy", e + 2.5, e, 6 * m.animDelay - 1, Easing.linear.easeIn);
        f.onfinish = e.play;
        e.onfinish = f.play;
        f.play()
    }
    isMusicOn && (mixer.stop(0), stage.setTimeout(function() {
        mixer.play("final", 
        !0, !0, 0)
    }, Math.floor(fps / 3)));
    var f = new SpritesGroup(stage);
    f.x = 240;
    f.y = -160;
    var g = new Sprite(bitmaps.finalBack, 480, 320);
    g.gx = 0;
    g.gy = 0;
    f.addChild(g, !0);
    var h = new TilesSprite(bitmaps.grandpa_final, 210, 114, 31, 8, 2);
    h.gx = 25;
    h.gy = 40;
    h.scaleX = -1;
    h.animDelay = 2;
    h.onenterframe = function(c) {
        c = c.target;
        30 == c.currentFrameX && (c.gotoAndPlay(19), c.tweensCreated || (c.tweensCreated = !0, a()))
    };
    h.stop();
    f.addChild(h, !0);
    var k = c("woodpecker_final", 50, 82, 11, -65, 35);
    k.gscaleX = -1;
    k.grotation = 0.3;
    var l = c("ant_final", 23, 32, 
    1, -33.5, 46.5);
    c("fedor_final", 72, 56, 12, -60, 52);
    c("caterpilars_final", 68, 56, 11, -80, 52);
    c("dima_final", 64, 52, 11, -100, 30);
    c("igor_final", 64, 54, 11, -105, 52);
    var m = c("transporant_final", 122, 32, 11, -23.5, 6);
    e(-53, -5);
    e(6.5, -1, !0);
    k = stage.createTween(f, "y", f.y, 160, fps, Easing.circular.easeOut);
    k.onfinish = function() {
        for (var a = 0; a < stage.objects.length; a++)
            -1 === stage.objects[a].bitmap.src.indexOf("final") && (stage.objects[a].destroy = !0);
        g.static = !0;
        l.static = !0;
        h.play();
        buildBackground()
    };
    k.play()
}
function showComics() {
    mixer.stop(0);
    isMusicOn && mixer.play("ComicsMusic1", !1, !0, 0);
    var a = new Sprite(null, 480, 320);
    a.x = 240;
    a.y = 160;
    a.fillColor = "#fff";
    a.static = !0;
    stage.addChild(a);
    createComix(1);
    a = new Sprite(bitmaps.SkipBtnMc, 86, 50);
    a.x = 440;
    a.y = 25;
    a.opacity = 0;
    a.onclick = skip;
    stage.addChild(a);
    a.fadeTo(1, 1.5 * fps, Easing.exponential.easeIn)
}
function skip() {
    mixer.stop(0);
    isMusicOn && mixer.play("background_music", !0, !0, 0);
    firstLevel ? (prepareLevel(), firstLevel = !1) : (gameState = STATE_MENU, createScene())
}
function createComix(a) {
    var c = new Sprite(bitmaps["comics" + a], 480, 320);
    c.x = 720;
    c.y = 160;
    c.setZIndex(1);
    stage.addChild(c);
    var e = Math.floor(2.7 * fps), f = stage.createTween(c, "x", 720, 240, e, Easing.exponential.easeOut), g = stage.createTween(c, "x", 240, -240, e, Easing.exponential.easeOut);
    f.play();
    f.onfinish = function() {
        a++;
        7 < a && stage.setTimeout(skip, 1.5 * fps);
        stage.setTimeout(function() {
            createComix(a);
            g.play()
        }, fps)
    };
    g.onfinish = function() {
        c.destroy = !0
    }
}
function debugDraw() {
    if (gameState != STATE_GAME || !showDebugDraw)
        return !1;
    world && drawWorld(world, stage)
}
function startLevel(a, c) {
    createStage();
    field = new GameField;
    field.init(a, c);
    buildBackground();
    stage.start()
}
function step() {
    field.bob.synchPosition();
    "fly" != field.bob.state && !field.cancelSpeed && field.bob.box2dBody.GetContactList() && (field.bob.box2dBody.m_linearVelocity.x = field.bob.speed);
    checkIfWin()
}
function mainLoop() {
    gameState == STATE_GAME && (field.rebuildBack && (field.rebuildBack = !1, buildBackground()), world.Step(1 / (2 * fps), 1), world.Step(1 / (2 * fps), 1), step(), stage.box2dSync(world))
}
function showLevelSelect() {
    
    
        console.log("trigger GameBreak");
        GameAPI.GameBreak.request(function(){}, function(){});  
    
    function a(a, c) {
        var e = new Sprite(0 > levelsScores[g - 1] ? bitmaps.Lvl_locked : bitmaps.LvlN, 37, 36);
        e.x = a;
        e.y = c;
        e.static = !0;
        e.index = g + 1;
        e.onmousedown = function(a) {
            if (0 == a.target.index - 1 || 0 <= levelsScores[a.target.index - 2])
                return currentLevel = a.target.index, 1 !== currentLevel ? stage.setTimeout(prepareLevel, Math.floor(fps / 4)) : (gameState = STATE_COMICS, createScene(), firstLevel = !0), !1
        };
        stage.addChild(e);
        if (0 <= levelsScores[g]) {
            var f = new SimpleText(bitmaps.num_lvl_map_up, 5, 6);
            f.align = f.ALIGN_CENTER;
            f.x = a;
            f.y = c - 10;
            f.static = !0;
            f.write(levelsScores[g])
        }
        if (0 == g || 0 <= levelsScores[g - 1])
            f = new SimpleText(bitmaps.numb, 15, 16), f.align = f.ALIGN_CENTER, f.x = e.x, f.y = e.y + 2, f.static = !0, f.write(g + 1);
        g == h && (f = new Sprite(bitmaps.present, 31, 39), f.x = e.x - 20, f.y = e.y + 10, f.scaleX = 0.5, f.scaleY = 0.5, f.static = !0, stage.addChild(f));
        g++
    }
    function c(a, c, e) {
        var f = new Sprite(bitmaps.fly_menu, 31, 30, 3);
        f.x = 2;
        f.y = c;
        f.scaleX = 0.6;
        f.scaleY = 0.6;
        var g = 0;
        f.onenterframe = function(f) {
            f = f.target;
            g = e ? g - 0.3 : g + 0.3;
            var h = new Vector(2, 0);
            h.rotate(-g);
            f.x = a + h.x;
            f.y = c + h.y
        };
        e && (f.scaleX *= -1);
        stage.addChild(f)
    }
    var e = new Sprite(bitmaps.LevelsMap, 480, 320);
    e.setPosition(getStageCenter(), getStageHeightCenter());
    e.static = !0;
    stage.addChild(e);
    var e = getTotalLevelsScores(), f = new SimpleText(bitmaps.score_num, 12, 16);
    f.align = f.ALIGN_CENTER;
    f.x = 296;
    f.y = 17;
    f.static = !0;
    f.write(e);
    for (var g = 0; g < levels.length; g++)
        if (0 > levelsScores[g] || g == levels.length - 1) {
            var h = g;
            break
        }
    g = 0;
    a(100, 70);
    a(145, 105);
    a(200, 128);
    a(250, 110);
    a(310, 95);
    a(415, 80);
    a(425, 165);
    a(325, 155);
    a(260, 
    175);
    a(180, 185);
    a(125, 165);
    a(70, 150);
    a(45, 190);
    a(60, 240);
    a(113, 255);
    a(165, 250);
    a(220, 250);
    a(270, 240);
    a(325, 215);
    a(365, 250);
    e = new Sprite(bitmaps.menu_btn, 84, 50);
    e.x = 38;
    e.y = 300;
    e.static = !0;
    e.onclick = function() {
        gameState = STATE_MENU;
        createScene()
    };
    stage.addChild(e);
    e = new Sprite(bitmaps.soundButton, 46, 46, 2);
    e.x = 421;
    e.y = 305;
    isMusicOn ? e.gotoAndStop(0) : e.gotoAndStop(1);
    e.onclick = toggleSound;
    stage.addChild(e);
    //e = new Sprite(bitmaps.logoMenu, 100, 31);
    //e.x = 425;
    //e.y = 17;
    //e.static = !0;
    //e.onclick = showMoreGames;
    //stage.addChild(e);
    c(123, 45);
    c(213, 90, !0);
    c(340, 60, !0)
}
function getLevelsScores() {
    levelsScores = [];
    var a = Utils.getCookie("snail_bob2_levels_scores") + "";
    "null" != a && (levelsScores = a.split(","));
    for (a = 0; a < levels.length; a++)
        levelsScores[a] || (levelsScores[a] = -1), levelsScores[a] *= 1
}
function saveLevelsScores() {
    Utils.setCookie("snail_bob2_levels_scores", levelsScores.join(","))
}
function getTotalLevelsScores() {
    for (var a = 0, c = 0; c < levels.length; c++)
        0 <= levelsScores[c] && (a += levelsScores[c]);
    return a
}
function showMenu() {
    var a = new Sprite(bitmaps.menuBack, 480, 320);
    a.setPosition(getStageCenter(), getStageHeightCenter());
    a.static = !0;
    stage.addChild(a);
    a = new Sprite(bitmaps.play, 94, 38, 3);
    a.x = 230;
    a.y = 135;
    a.stop();
    a.onclick = function() {
        gameState == STATE_MENU && (gameState = STATE_SELECT_LEVEL, createScene())
    };
    stage.addChild(a);
    attachMouseEvents.call(a);
    a = new Sprite(bitmaps.credits, 122, 43, 3);
    a.x = 230;
    a.y = 175;
    a.stop();
    a.onclick = showCredits;
    stage.addChild(a);
    attachMouseEvents.call(a);
    a = new Sprite(bitmaps.moreGames, 
    144, 44, 4);
    a.x = 230;
    a.y = 218;
    a.stop();
    a.onclick = function() {
        gameState == STATE_MENU && showMoreGames()
    };
    stage.addChild(a);
    attachMouseEvents.call(a);
    a = new Sprite(bitmaps.bobMenu, 52, 58, 12);
    a.x = 235;
    a.y = 78;
    a.animDelay = 2;
    stage.addChild(a);
    
    if(GameAPI && GameAPI.Branding){
        
        var crossObject = GameAPI.Branding.getLink("cross_promo_snail_bob_1");
        
          
        if(typeof(crossObject.image) != "undefined"){
             
            var img = new Image;
            img.src = crossObject.image;
            
            img.onload = function(){             
                a = new Sprite(img, 88, 95);
                a.x = 90;
                a.y = 250;
                a.onclick = function() {
                    crossObject.action();
                };
                stage.addChild(a);
                console.log(a);
            }
        }
        

        var logoData = GameAPI.Branding.getLogo();
        
        if(typeof(logoData.image) != "undefined" && logoData.image){
             
            var logoimg = new Image;
            logoimg.src = logoData.image;
            
            logoimg.onload = function(){             
                a = new Sprite(logoimg, 180, 50);
                a.x = 350;
                a.y = 270;
                a.onclick = function() {
                    logoData.action();
                };
                stage.addChild(a);
                console.log(a);
            }
        }
    }
    
    
    /*
    a = new Sprite(bitmaps.bob1, 88, 95);
    a.x = 90;
    a.y = 250;
    stage.addChild(a);
    
    a = new Sprite(bitmaps.transporant, 120, 50, 19);
    a.x = 95;
    a.y = 185;
    stage.addChild(a);
    */
    
    a = new Sprite(bitmaps.soundButton, 46, 46, 2);
    a.x = 240;
    a.y = 260;
    isMusicOn ? a.gotoAndStop(0) : a.gotoAndStop(1);
    a.onclick = toggleSound;
    stage.addChild(a);
    
    
    a = new Sprite(bitmaps.logoMenu, 100, 31);
    a.x = 400;
    a.y = 160;
    a.static = !0;
    a.onclick = showMoreGames;
    stage.addChild(a);
    a = new Sprite(bitmaps.intro, 78, 28, 3);
    a.x = 440;
    a.y = 15;
    a.stop();
    a.onclick = function() {
        gameState = STATE_COMICS;
        createScene()
    };
    stage.addChild(a);
    attachMouseEvents.call(a)
}
function showCredits() {
    function a() {
        f.remove();
        gameState = STATE_MENU;
        e.destroy = !0
    }
    function c(a) {
        a.target.gscaleX *= -1;
        k.visible = !k.visible;
        l.visible = !l.visible
    }
    if (gameState == STATE_MENU) {
        gameState = STATE_CREDITS;
        var e = new Sprite(null, 480, 320);
        e.x = 240;
        e.y = 160;
        e.fillColor = "#000";
        e.opacity = 0.3;
        e.onclick = function() {
            return !1
        };
        stage.addChild(e);
        var f = new SpritesGroup(stage);
        f.x = 240;
        f.y = 160;
        f.scaleX = 0;
        var g = stage.createTween(f, "scaleX", 1, 0, Math.floor(fps / 5), Easing.circular.easeOut);
        g.onfinish = a;
        var h = new Sprite(bitmaps.credits_back, 
        200, 171);
        h.gx = 0;
        h.gy = 0;
        f.addChild(h, !0);
        var k = new Sprite(bitmaps.auth1, 156, 128);
        k.gx = 0;
        k.gy = 0;
        f.addChild(k, !0);
        var l = new Sprite(bitmaps.auth2, 146, 120);
        l.gx = 0;
        l.gy = 0;
        l.visible = !1;
        f.addChild(l, !0);
        h = new Sprite(bitmaps.play_credits, 36, 35);
        h.gx = 23;
        h.gy = -30;
        h.onclick = c;
        f.addChild(h, !0);
        h = new Sprite(bitmaps.close_credits, 36, 35);
        h.gx = 38;
        h.gy = -30;
        h.onclick = g.play;
        f.addChild(h, !0);
        stage.createTween(f, "scaleX", 0, 1, Math.floor(fps / 5), Easing.circular.easeOut).play()
    }
}
function showMoreGames() {
    if(GameAPI && GameAPI.Branding){
        var b = GameAPI.Branding.getLink('more_games');
        if(b && b.action) b.action();
    }
    //window.open(MORE_GAMES_URL)
}
function showWalkthrough() {
    window.open(WALKTHROUGH_URL)
}
function checkIfWin() {
    stage.hitTest(field.bob, field.destination) && 17 > getDistance(field.bob, field.destination) && showWinScreen()
}
function showWinScreen() {
    if (gameState == STATE_GAME)
        
        
    
        if (mixer.stop(1), levelsScores[currentLevel - 1] < gameScore && (levelsScores[currentLevel - 1] = gameScore, saveLevelsScores()), isSoundOn && mixer.play("game_victory"), currentLevel == levels.length)
            gameState = STATE_FINAL, showFinalScreen();
        else {
            gameState = STATE_VICTORY;
            var a = new Sprite(null, stage.screenWidth, stage.screenHeight);
            a.setPosition(getStageCenter(), getStageHeightCenter());
            a.fillColor = "#000";
            a.opacity = 0.5;
            a.onclick = function() {
                return !1
            };
            stage.addChild(a);
            var c = 
            new SpritesGroup(stage);
            c.x = 240;
            c.y = 160;
            c.scaleX = 0.01;
            c.scaleY = 0.01;
            a = new Sprite(bitmaps.PanelLevelComplete, 250, 244);
            a.gx = 0;
            a.gy = 0;
            c.addChild(a, !0);
            a = new Sprite(bitmaps.LevelCompleteBobs, 88, 86, 9);
            a.gx = 38;
            a.gy = -38.5;
            var e = Math.ceil(8 * Math.random());
            a.gotoAndStop(e);
            c.addChild(a, !0);
            //a = new Sprite(bitmaps.logoCleared, 93, 30);
            //a.gx = -7;
            //a.gy = -42;
            //a.onclick = showMoreGames;
            c.addChild(a, !0);
            a = new SimpleText(bitmaps.levelCompleteNum, 16, 18);
            a.align = a.ALIGN_CENTER;
            a.x = 12;
            a.y = 7;
            a.write(gameScore);
            a.addToGroup(c);
            var f = 
            stage.setInterval(function() {
                c.scaleX += 0.06;
                c.scaleY += 0.06;
                1 <= c.scaleX && (c.scaleX = 1, c.scaleY = 1, g.opacity = h.opacity = 1, stage.clearInterval(f))
            }, 1), g = new Sprite(bitmaps.NextLeveButton, 108, 37);
            g.setPosition(290, 220);
            g.opacity = 0;
            g.onclick = function() {
                currentLevel != levels.length && levels[currentLevel].objects.length ? (currentLevel++, prepareLevel()) : (gameState = STATE_SELECT_LEVEL, createScene());
                return !1
            };
            stage.addChild(g);
            var h = new Sprite(bitmaps.LVL_map, 65, 44);
            h.setPosition(180, 220);
            h.onclick = function() {
                gameState = 
                STATE_SELECT_LEVEL;
                createScene();
                return !1
            };
            h.opacity = 0;
            stage.addChild(h)
        }
}
function showGameOverScreen() {
    stage.setTimeout(function() {
        if (gameState == STATE_GAME) {
            gameState = STATE_GAME_OVER;
            mixer.stop(1);
            console.log("game over");
            var a = new Sprite(null, stage.screenWidth, stage.screenHeight);
            a.setPosition(getStageCenter(), getStageHeightCenter());
            a.fillColor = "#FFFFFF";
            a.opacity = 0.5;
            a.onclick = function() {
                return !1
            };
            stage.addChild(a);
            a = new Sprite(bitmaps.GameOver, 251, 242);
            a.setPosition(getStageCenter(), getStageHeightCenter());
            stage.addChild(a);
            a = new Sprite(bitmaps.TryAgainButton, 101, 
            50);
            a.setPosition(getStageCenter() + 14, getStageHeightCenter() + 20);
            a.onclick = prepareLevel;
            stage.addChild(a);
            var c = new Sprite(bitmaps.WalkthroughButton, 91, 37);
            c.setPosition(a.x, a.y + 40);
            c.onclick = showWalkthrough;
            stage.addChild(c)
        }
    }, fps)
}
function buildBackground() {
    stage && stage.drawScene(document.getElementById("screen_background"), !0)
}
function findObject(a) {
    for (var c = 0; c < objects.length; c++)
        if (objects[c].name == a)
            return objects[c];
    return !1
}
function prepareLevel() {
    stage && (mc = new Sprite(bitmaps.hourglass, 100, 150, 1), mc.x = 240, mc.y = 130, stage.addChild(mc));
    setTimeout(function() {
        gameState = STATE_GAME;
        field = new GameField;
        field.init(currentLevel - 1)
    }, 1E3 / fps * 2)
}
function deleteObject(a) {
    a.destroy = !0;
    a.box2dBody && world.DestroyBody(a.box2dBody)
}
function disableSpriteRotation(a) {
    a.target.rotation = 0
}
function disableSpriteRotationWithCoords(a) {
    var c = new Vector(-a.target.syncX, -a.target.syncY);
    a.target.x += c.x;
    a.target.y += c.y;
    a.target.rotation = 0
}
var SnailBob = function() {
    var a = getBobLocation(), c = this.obj = createObject({type: "Bob",x: a.x,y: a.y,rotation: 0}, findObject("Bob"));
    c.states = [];
    c.onbox2dsync = disableSpriteRotation;
    c.speed = SPEED_WALK;
    c.selectedSpeed = 1;
    c.opacity = 0;
    c.direction = "right";
    c.state = "walk";
    a = new Sprite(bitmaps.BobGo, 50, 40, 17);
    a.setPosition(c.x, c.y);
    a.setZIndex(15);
    a.animDelay = 2;
    a.gotoAndPlay(3);
    a.onenterframe = function(a) {
        16 == a.target.currentFrame && a.target.gotoAndPlay(3)
    };
    c.walk = a;
    c.states.push(a);
    stage.addChild(a);
    a = new Sprite(bitmaps.BobRun, 
    57, 50, 19);
    a.setPosition(c.x, c.y);
    a.animDelay = 1;
    a.setZIndex(15);
    a.visible = !1;
    a.gotoAndPlay(3);
    a.onenterframe = function(a) {
        15 == a.target.currentFrame && a.target.gotoAndPlay(3)
    };
    c.run = a;
    c.states.push(a);
    stage.addChild(a);
    var e = new Sprite(bitmaps.BobHide, 57, 42, 11);
    e.setPosition(c.x, c.y);
    e.animDelay = 2;
    e.visible = !1;
    e.setZIndex(15);
    e.onenterframe = function(a) {
        10 == a.target.currentFrame && a.target.gotoAndStop(10)
    };
    c.hide = e;
    c.states.push(e);
    stage.addChild(e);
    var f = new Sprite(bitmaps.BobHide, 57, 42, 11);
    f.setPosition(c.x, 
    c.y);
    f.animDelay = 2;
    f.visible = !1;
    f.setZIndex(15);
    f.onenterframe = function(a) {
        0 == a.target.currentFrame && a.target.gotoAndStop(0)
    };
    c.show = f;
    c.states.push(f);
    stage.addChild(f);
    c.changeState = function(a) {
        c[a].scaleX = "left" != c.direction || c[a].forbidScale ? 1 : -1;
        var e = c.state;
        stage.setTimeout(function() {
            c[e].visible = !1
        }, 1);
        c[a].visible = !0;
        c.state = a
    };
    c.box2dBody.m_world.m_allowSleep = !1;
    c.forceSleep = function() {
        c.speed = 0;
        c.isAsleep = !0
    };
    c.forceWakeUp = function() {
        c.speed = 1 == c.selectedSpeed ? SPEED_WALK : SPEED_RUN;
        "left" == 
        c.direction && (c.speed *= -1);
        c.box2dBody.WakeUp();
        c.isAsleep = !1
    };
    c.onclick = function(a) {
        c.blockClick || (c.blockClick = !0, c.isAsleep ? (stage.setTimeout(function() {
            isSoundOn && mixer.play("bob_outshell")
        }, 4 * f.animDelay), a.target.changeState("show"), c.show.rewindAndStop(10), stage.setTimeout(function() {
            "show" == c.state && c[c.state].visible ? (a.target.changeState(1 == c.selectedSpeed ? "walk" : "run"), c.forceWakeUp(), c.blockClick = !1) : console.log("\u0442\u043e, \u0447\u0442\u043e \u0434\u043b\u044f 5-\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f")
        }, 
        12 * f.animDelay)) : (stage.setTimeout(function() {
            isSoundOn && mixer.play("bob_hideshell")
        }, 2 * f.animDelay), a.target.changeState("hide"), c.hide.gotoAndPlay(0), c.forceSleep(), stage.setTimeout(function() {
            c.blockClick = !1
        }, 12 * e.animDelay)))
    };
    c.synchPosition = function() {
        for (var a = 0, e = c.states.length; a < e; a++)
            c.states[a].setPosition(c.x, c.y);
        !c.isAsleep && c.box2dBody.IsSleeping() && (a = c.box2dBody.GetCenterPosition(), a.y -= 0.1, c.box2dBody.SetCenterPosition(a, 0), c.box2dBody.WakeUp())
    };
    return c
};
function addBobState(a, c, e, f, g) {
    var h = field.bob;
    c = new Sprite(bitmaps[a], c, e, f, g);
    c.setPosition(h.x, h.y);
    c.animDelay = 2;
    c.visible = !1;
    c.gotoAndStop(0);
    h[a] = c;
    h.states.push(c);
    stage.addChild(c);
    return c
}
function getBobLocation() {
    for (var a = 0, c = stage.objects.length; a < c; a++) {
        var e = stage.objects[a];
        if (e.info && -1 != e.info.indexOf("entrance")) {
            e.setZIndex(20);
            if (-1 == e.info.indexOf("invisible")) {
                a = new Vector(-2, 8);
                a.rotate(-e.rotation);
                var f = new Sprite(bitmaps.backTube1, 56, 55);
                f.setPosition(e.x + a.x, e.y + a.y);
                f.rotation = e.rotation;
                f.setZIndex(5);
                stage.addChild(f)
            }
            if (!e.custom)
                var g = stage.setInterval(function() {
                    stage.hitTest(field.bob, e) || (f && f.setStatic(!0), e.setStatic(!0), stage.clearInterval(g))
                }, fps);
            return {x: e.x - 
                7,y: e.y + 12}
        }
    }
}
var GameField = function() {
    var a = this;
    this.init = function(c, e) {
        world = box2DCreateWorld();
        b2Settings.b2_timeToSleep = 0.05;
        b2Settings.b2_linearSleepTolerance = 1;
        b2Settings.b2_angularSleepTolerance = 0.1;
        createStage();
        a.fillGameBackground();
        var f, g;
        e && (c = 0, levels = [e], gameState = STATE_GAME);
        f = levels[c].objects;
        g = levels[c].joints;
        if (levels[c]) {
            curLevel = c;
            for (var h, k, l = 0; l < f.length; l++)
                h = f[l], k = findObject(h.type), createObject(h, k);
            if (g)
                for (l = 0; l < g.length; l++)
                    f = g[l], h = getBodyByPoint(f.point1), k = getBodyByPoint(f.point2 ? f.point2 : 
                    f.point1, h), 0 == f.type && box2DCreateRevoluteJoint(world, h, k, f.point1, f.custom), 1 == f.type && box2DCreateDistanceJoint(world, h, k, f.point1, f.point2), 2 == f.type && box2DCreatePrismaticJoint(world, h, k, f.point2, f.custom);
            hideInvisibleImg();
            stopAnimations();
            a.setBobDestination();
            a.bob = new SnailBob;
            gameScore = 301;
            loopSound = !1;
            g = 1 != GET.debug ? levelsScripts[currentLevel - 1] : levelsScripts[editorLevel - 1];
            g.init();
            g.pretick && stage.addEventListener("pretick", g.pretick);
            g.posttick && stage.addEventListener("posttick", g.posttick);
            g = new SimpleText(bitmaps.lvl_numbs, 15, 14);
            g.align = g.ALIGN_CENTER;
            g.x = 461;
            g.y = 10;
            g.write(c + 1);
            g = new Sprite(bitmaps.soundButton, 46, 46, 2);
            g.x = 115;
            g.y = 297;
            isMusicOn ? g.gotoAndStop(0) : g.gotoAndStop(1);
            g.onclick = toggleSound;
            stage.addChild(g);
            buildBackground();
            stage.start();
            drawScore()
        }
    };
    this.fillGameBackground = function() {
        function c() {
            var c = field.bob;
            this.locked || (this.locked = !0, this === f ? (g.locked = !1, k.gotoAndStop(0), c.selectedSpeed = 1, "run" == c.state && c.changeState("walk"), isSoundOn && mixer.play("speed1"), 
            h.x = 56) : (f.locked = !1, k.gotoAndStop(1), c.selectedSpeed = 2, "walk" == c.state && c.changeState("run"), isSoundOn && mixer.play("speed2"), h.x = 85), c.isAsleep || (a.bob.speed = "right" == a.bob.direction ? this.value : -this.value), buildBackground())
        }
        var e = 1 != GET.debug ? new Sprite(bitmaps["Lvl" + currentLevel + "_back"], 480, 320) : new Sprite(bitmaps["Lvl" + editorLevel + "_back"], 480, 320);
        e.setPosition(getStageCenter(), getStageHeightCenter());
        e.static = !0;
        stage.addChild(e);
        var f = new Sprite(bitmaps.SspeedStandardBtn, 28, 28);
        f.setPosition(56.5, 
        21.5);
        f.value = SPEED_WALK;
        f.onclick = c;
        f.locked = !0;
        f.static = !0;
        a.speedHandler = f;
        stage.addChild(f);
        var g = new Sprite(bitmaps.SpeedFastBtn, 29, 30);
        g.setPosition(86.5, 22);
        g.value = SPEED_RUN;
        g.static = !0;
        g.onclick = c;
        stage.addChild(g);
        var h = new Sprite(bitmaps.SpeedIndicatorMc, 31, 37);
        h.x = 56;
        h.y = 16;
        h.static = !0;
        stage.addChild(h);
        e = new Sprite(bitmaps.PanelSpeed, 41, 52);
        e.x = 20.5;
        e.y = 26;
        e.static = !0;
        stage.addChild(e);
        var k = new Sprite(bitmaps.SpeedBob, 44, 34, 2);
        k.x = 16;
        k.y = 25;
        k.gotoAndStop(0);
        k.static = !0;
        stage.addChild(k);
        a.speedHandler = [f, g];
        e = new Sprite(bitmaps.Lvl, 81, 25);
        e.x = 440;
        e.y = 12;
        e.static = !0;
        stage.addChild(e);
        e = new Sprite(bitmaps.score, 114, 45);
        e.x = 240;
        e.y = 303;
        e.static = !0;
        stage.addChild(e);
        e = new Sprite(bitmaps.lvlMapIngame, 45, 45);
        e.x = 25;
        e.y = 297;
        e.onclick = function() {
            mixer.stop(1);
            gameState = STATE_SELECT_LEVEL;
            createScene();
            return !1
        };
        e.static = !0;
        stage.addChild(e);
        e = new Sprite(bitmaps.restartIngame, 45, 45);
        e.x = 70;
        e.y = 297;
        e.onclick = function() {
            mixer.stop(1);
            comics = !0;
            prepareLevel();
            comics = !1
        };
        e.static = !0;
        stage.addChild(e);
        //e = new Sprite(bitmaps.WalkthroughButton, 91, 37);
        //e.setPosition(stage.screenWidth - 45, stage.screenHeight - 16);
        //e.static = !0;
        //e.onclick = showWalkthrough;
        //stage.addChild(e)
    };
    this.setBobDestination = function() {
        for (var a = 0, e = stage.objects.length; a < e; a++) {
            var f = stage.objects[a];
            if ("destination" == f.info) {
                stage.setZIndex(f, 20);
                field.destination = f;
                if (f.custom)
                    break;
                a = new Vector(2, 8);
                a.rotate(-f.rotation);
                e = new Sprite(bitmaps.backTube2, 56, 55);
                e.setPosition(f.x + a.x, f.y + a.y);
                e.rotation = f.rotation;
                e.setZIndex(5);
                stage.addChild(e);
                break
            }
        }
    }
};
function getBodyByPoint(a, c) {
    var e = null;
    if (a && (stack = stage.getObjectsStackByCoord(a.x, a.y, !1), 0 < stack.length))
        for (var f = stack.length - 1; 0 <= f; f--)
            stack[f].box2dBody && stack[f].box2dBody != c && (e = stack[f].box2dBody);
    e || (e = box2DCreateCircle(world, a.x, a.y, 1, 1, !0, 1, 0, 0));
    return e
}
function createObject(a, c) {
    var e, f, g, h, k, l, m, n;
    mc = c.info && -1 == c.info.indexOf("tiles") ? new Sprite(bitmaps[c.name], c.width, c.height, c.frames) : new TilesSprite(bitmaps[c.name], c.width, c.height, c.frames, c.rows, c.columns);
    mc.x = a.x;
    mc.y = a.y;
    mc.setZIndex(10);
    mc.rotation = a.rotation;
    stage.addChild(mc);
    if (c.bodyType != NONE) {
        fixed = "undefined" != typeof a.fixed ? a.fixed : c.fixed;
        f = "undefined" != typeof a.density ? a.density : c.density;
        g = "undefined" != typeof a.restitution ? a.restitution : c.restitution;
        h = "undefined" != typeof a.friction ? 
        a.friction : c.friction;
        0 >= f && (fixed = !0);
        m = c.bodyWidth ? c.bodyWidth : c.width;
        n = c.bodyHeight ? c.bodyHeight : c.height;
        k = a.x;
        l = a.y;
        c.bodyPosCorrect && (k += c.bodyPosCorrect.x, l += c.bodyPosCorrect.y, mc.syncX = c.bodyPosCorrect.x, mc.syncY = c.bodyPosCorrect.y, mc.onbox2dsync = spritesSync);
        c.bodyType == BOX && (e = box2DCreateBox(world, k, l, m / 2, n / 2, a.rotation, fixed, f, g, h));
        c.bodyType == CIRCLE && (e = box2DCreateCircle(world, k, l, m / 2, a.rotation, fixed, f, g, h));
        c.bodyType == POLY && (e = box2DCreatePoly(world, k, l, c.points, a.rotation, fixed, f, 
        g, h));
        if (c.joints)
            for (f = 0; f < c.joints.length; f++)
                "pivot" == c.joints[f].type && (g = new Vector(c.joints[f].x, c.joints[f].y), 0 != a.rotation && g.rotate(-a.rotation), g.x += a.x, g.y += a.y, g = box2DCreateCircle(world, g.x, g.y, 1, 0, !0, 0.01, 0, 0), box2DCreateRevoluteJoint(world, g, e, g.GetCenterPosition()));
        e.sprite = mc;
        mc.box2dBody = e
    }
    mc.info = c.info;
    mc.custom = a.custom;
    if ("lever" == c.info) {
        if (!a.custom || -1 == a.custom.indexOf("no_cover")) {
            e = new Vector(0, -10);
            e.rotate(-mc.rotation);
            var p = new Sprite(bitmaps.lever_cover, 29, 6);
            p.rotation = 
            mc.rotation;
            p.x = mc.x + e.x;
            p.y = mc.y + e.y;
            p.setZIndex(11);
            stage.addChild(p);
            mc.cover = p
        }
        a.custom && -1 != a.custom.indexOf("no_static") || (p && (p.static = !0), mc.static = !0);
        p = new Vector(0, -5);
        p.rotate(-mc.rotation);
        addHint.call(mc, p.x, p.y)
    }
    "button_red" == c.info && (attachMouseEvents.call(mc), "dont_hint" != a.custom && addHint.call(mc));
    if ("button_blue_down" == c.info || "button_blue_left" == c.info)
        attachMouseEvents.call(mc), a.custom && -1 != a.custom.indexOf("no_hint") || (e = new Vector(-1, 0), e.rotate(-a.rotation), addHint.call(mc, 
        e.x, e.y));
    mc.obType = c.type;
    return mc
}
function stopAnimations() {
    for (var a = 0, c = stage.objects.length; a < c; a++) {
        var e = stage.objects[a];
        1 < e.totalFrames && e.gotoAndStop(0)
    }
}
function hideInvisibleImg() {
    for (var a = 0, c = stage.objects.length; a < c; a++) {
        var e = stage.objects[a];
        e.info && -1 != e.info.indexOf("invisible") && (e.visible = !1)
    }
}
function addHint(a, c) {
    var e = new Sprite(bitmaps.hint, 30, 30);
    e.x = a ? this.x + a : this.x;
    e.y = c ? this.y + c : this.y;
    e.info = "hint";
    e.setZIndex(13);
    stage.addChild(e);
    (function() {
        var a = this, c = stage.setInterval(function() {
            a.rotation += 0.05
        }, 1);
        this.removeHint = function() {
            stage.clearInterval(c);
            var e = stage.setInterval(function() {
                a.opacity -= 0.1;
                0 >= a.opacity && (stage.clearInterval(e), a.destroy = !0)
            }, 1)
        }
    }).call(e);
    this.hint = e
}
function getDistance(a, c) {
    return Math.sqrt((c.x - a.x) * (c.x - a.x) + (c.y - a.y) * (c.y - a.y))
}
var tmScore, scoreText;
function drawScore() {
    function a() {
        scoreText = new SimpleText(bitmaps.score_num_ingame, 8, 12);
        scoreText.align = scoreText.ALIGN_CENTER;
        scoreText.x = 265;
        scoreText.y = 305;
        scoreText.write(gameScore)
    }
    if (gameState != STATE_MENU && gameState != STATE_SELECT_LEVEL && gameState != STATE_FINAL)
        if (gameState == STATE_GAME) {
            clearTimeout(tmScore);
            gameScore--;
            0 > gameScore && (gameScore = 0);
            if (scoreText) {
                var c;
                for (c = 0; c < scoreText.sprites.length; c++)
                    scoreText.sprites[c] && (scoreText.sprites[c].destroy = !0)
            }
            a();
            tmScore = setTimeout(function() {
                if (scoreText) {
                    var a;
                    for (a = 0; a < scoreText.sprites.length; a++)
                        scoreText.sprites[a] && (scoreText.sprites[a].destroy = !0)
                }
                drawScore()
            }, 500)
        } else
            for (a(), c = 0; c < scoreText.sprites.length; c++)
                scoreText.sprites[c].setZIndex(36)
}
function toggleSound(a) {
    mixer && (isMusicOn ? (isMusicOn = isSoundOn = !1, mixer.stop(1), mixer.stop(0), a.target.gotoAndStop(1), Utils.setCookie("snail_bob_sound", 2)) : (isWebAudioSupport && (isSoundOn = !0), isMusicOn = !0, mixer.play("background_music", !0, !0, 0), loopSound && mixer.play(loopSound, !0, !0, 1), a.target.gotoAndStop(0), Utils.setCookie("snail_bob_sound", 1)))
}
function deStaticCover(a) {
    for (var c = 0; c < stage.objects.length; c++) {
        var e = stage.objects[c];
        if (e.bitmap && -1 != e.bitmap.src.indexOf(a)) {
            var f = stage.getMaxZIndexInStack(stage.objects);
            e.setZIndex(stage.objects[f].zIndex + 1);
            e.setStatic(!1)
        }
    }
}
function leverOnenterframe(a) {
    var c = a.target;
    5 == c.currentFrame && c.animated && (c.stop(), c.hint.removeHint(), c.custom || (c.setStatic(!0), stage.setTimeout(function() {
        c.cover.setStatic(!0)
    }, 1)))
}
function createStage() {
    stage && (stage.destroy(), stage.stop());
    stage = new Stage("screen", Math.round(480 * screenWidthCoef), Math.round(320 * screenHeightCoef));
    stage.delay = 1E3 / fps;
    stage.showFPS = !1;
    stage.onpretick = mainLoop;
    stage.onposttick = debugDraw
}
;
