(()=>{
    var e = function(e) {
        var n = RegExp("[?&]" + e + "=([^&]*)").exec(window.location.search);
        return n && decodeURIComponent(n[1].replace(/\+/g, " "))
    }
      , n = "kids" === e("tag")
      , t = new (function() {
        function e() {
            var e = this;
            this.queue = [],
            this.init = function(n) {
                return void 0 === n && (n = {}),
                new Promise((function(t, o) {
                    e.enqueue("init", [n], t, o)
                }
                ))
            }
            ,
            this.rewardedBreak = function() {
                return new Promise((function(e) {
                    e(!1)
                }
                ))
            }
            ,
            this.commercialBreak = function(n) {
                return new Promise((function(t, o) {
                    e.enqueue("commercialBreak", [n], t, o)
                }
                ))
            }
            ,
            this.displayAd = function(e, n, t) {
                t && t()
            }
            ,
            this.withArguments = function(n) {
                return function() {
                    for (var t = [], o = 0; o < arguments.length; o++)
                        t[o] = arguments[o];
                    e.enqueue(n, t)
                }
            }
            ,
            this.handleAutoResolvePromise = function() {
                return new Promise((function(e) {
                    e()
                }
                ))
            }
            ,
            this.throwNotLoaded = function() {
                console.debug("PokiSDK is not loaded yet. Not all methods are available.")
            }
            ,
            this.doNothing = function() {}
        }
        return e.prototype.enqueue = function(e, t, o, i) {
            var r = {
                fn: e,
                args: t || [],
                resolveFn: o,
                rejectFn: i
            };
            n ? i && i() : this.queue.push(r)
        }
        ,
        e.prototype.dequeue = function() {
            for (var e = this, n = function() {
                var n, o, i = t.queue.shift(), r = i, u = r.fn, a = r.args;
                if ("function" == typeof window.PokiSDK[u])
                    if ((null == i ? void 0 : i.resolveFn) || (null == i ? void 0 : i.rejectFn)) {
                        var s = "init" === u;
                        if ((n = window.PokiSDK)[u].apply(n, a).catch((function() {
                            for (var n = [], t = 0; t < arguments.length; t++)
                                n[t] = arguments[t];
                            "function" == typeof i.rejectFn && i.rejectFn.apply(i, n),
                            s && setTimeout((function() {
                                e.dequeue()
                            }
                            ), 0)
                        }
                        )).then((function() {
                            for (var n = [], t = 0; t < arguments.length; t++)
                                n[t] = arguments[t];
                            "function" == typeof i.resolveFn && i.resolveFn.apply(i, n),
                            s && setTimeout((function() {
                                e.dequeue()
                            }
                            ), 0)
                        }
                        )),
                        s)
                            return "break"
                    } else
                        (o = window.PokiSDK)[u].apply(o, a);
                else
                    console.error("Cannot execute " + u)
            }, t = this; this.queue.length > 0; ) {
                if ("break" === n())
                    break
            }
        }
        ,
        e
    }());
    window.PokiSDK = {
        init: t.init,
        initWithVideoHB: t.init,
        commercialBreak: t.commercialBreak,
        rewardedBreak: t.rewardedBreak,
        displayAd: t.displayAd,
        destroyAd: t.doNothing,
        getLeaderboard: t.handleAutoResolvePromise,
        shareableURL: function() {
            return new Promise((function(e, n) {
                return n()
            }
            ))
        },
        getURLParam: function(n) {
            return e("gd" + n) || e(n) || ""
        },
        getLanguage: function() {
            return navigator.language.toLowerCase().split("-")[0]
        },
        isAdBlocked: function() {}
    },
    ["captureError", "customEvent", "gameInteractive", "gameLoadingFinished", "gameLoadingProgress", "gameLoadingStart", "gameplayStart", "gameplayStop", "happyTime", "logError", "muteAd", "roundEnd", "roundStart", "sendHighscore", "setDebug", "setDebugTouchOverlayController", "setPlayerAge"].forEach((function(e) {
        window.PokiSDK[e] = t.withArguments(e)
    }
    ));
    // var o, i = ((o = window.pokiSDKVersion) || (o = e("ab") || "v2.278.0"), // Edited
    var o, i = ((o = window.pokiSDKVersion) || (o = e("ab") || "v2.260.1"),
    "js/poki-sdk-" + (n ? "kids" : "core") + "-" + o + ".js"), r = document.createElement("script");
    r.setAttribute("src", i),
    r.setAttribute("type", "text/javascript"),
    r.setAttribute("crossOrigin", "anonymous"),
    r.onload = function() {
        return t.dequeue()
    }
    ,
    document.head.appendChild(r)
}
)();
