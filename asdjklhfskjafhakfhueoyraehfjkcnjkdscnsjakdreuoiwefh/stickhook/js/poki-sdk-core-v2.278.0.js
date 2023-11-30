(()=>{
    var e = {
        564: (e,t,n)=>{
            var i, r, o;
            !function(n, a) {
                if (n) {
                    var s = {}
                      , d = n.TraceKit
                      , c = [].slice
                      , A = "?"
                      , l = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
                    s.noConflict = function() {
                        return n.TraceKit = d,
                        s
                    }
                    ,
                    s.wrap = function(e) {
                        return function() {
                            try {
                                return e.apply(this, arguments)
                            } catch (e) {
                                throw s.report(e),
                                e
                            }
                        }
                    }
                    ,
                    s.report = function() {
                        var e, t, i, r, o = [], a = null, d = null;
                        function c(e, t, n) {
                            var i = null;
                            if (!t || s.collectWindowErrors) {
                                for (var r in o)
                                    if (u(o, r))
                                        try {
                                            o[r](e, t, n)
                                        } catch (e) {
                                            i = e
                                        }
                                if (i)
                                    throw i
                            }
                        }
                        function A(t, n, i, r, o) {
                            if (d)
                                s.computeStackTrace.augmentStackTraceWithInitialElement(d, n, i, t),
                                h();
                            else if (o)
                                c(s.computeStackTrace(o), !0, o);
                            else {
                                var a, A = {
                                    url: n,
                                    line: i,
                                    column: r
                                }, u = t;
                                if ("[object String]" === {}.toString.call(t)) {
                                    var p = t.match(l);
                                    p && (a = p[1],
                                    u = p[2])
                                }
                                A.func = s.computeStackTrace.guessFunctionName(A.url, A.line),
                                A.context = s.computeStackTrace.gatherContext(A.url, A.line),
                                c({
                                    name: a,
                                    message: u,
                                    mode: "onerror",
                                    stack: [A]
                                }, !0, null)
                            }
                            return !!e && e.apply(this, arguments)
                        }
                        function p(e) {
                            c(s.computeStackTrace(e.reason), !0, e.reason)
                        }
                        function h() {
                            var e = d
                              , t = a;
                            d = null,
                            a = null,
                            c(e, !1, t)
                        }
                        function m(e) {
                            if (d) {
                                if (a === e)
                                    return;
                                h()
                            }
                            var t = s.computeStackTrace(e);
                            throw d = t,
                            a = e,
                            setTimeout((function() {
                                a === e && h()
                            }
                            ), t.incomplete ? 2e3 : 0),
                            e
                        }
                        return m.subscribe = function(a) {
                            !function() {
                                if (!0 === t)
                                    return;
                                e = n.onerror,
                                n.onerror = A,
                                t = !0
                            }(),
                            function() {
                                if (!0 === r)
                                    return;
                                i = n.onunhandledrejection,
                                n.onunhandledrejection = p,
                                r = !0
                            }(),
                            o.push(a)
                        }
                        ,
                        m.unsubscribe = function(a) {
                            for (var s = o.length - 1; s >= 0; --s)
                                o[s] === a && o.splice(s, 1);
                            0 === o.length && (t && (n.onerror = e,
                            t = !1),
                            r && (n.onunhandledrejection = i,
                            r = !1))
                        }
                        ,
                        m
                    }(),
                    s.computeStackTrace = function() {
                        var e = !1
                          , t = {};
                        function i(e) {
                            if ("string" != typeof e)
                                return [];
                            if (!u(t, e)) {
                                var i = ""
                                  , r = "";
                                try {
                                    r = n.document.domain
                                } catch (e) {}
                                var o = /(.*)\:\/\/([^:\/]+)([:\d]*)\/{0,1}([\s\S]*)/.exec(e);
                                o && o[2] === r && (i = function(e) {
                                    if (!s.remoteFetching)
                                        return "";
                                    try {
                                        var t = function() {
                                            try {
                                                return new n.XMLHttpRequest
                                            } catch (e) {
                                                return new n.ActiveXObject("Microsoft.XMLHTTP")
                                            }
                                        }();
                                        return t.open("GET", e, !1),
                                        t.send(""),
                                        t.responseText
                                    } catch (e) {
                                        return ""
                                    }
                                }(e)),
                                t[e] = i ? i.split("\n") : []
                            }
                            return t[e]
                        }
                        function r(e, t) {
                            var n, r = /function ([^(]*)\(([^)]*)\)/, o = /['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/, a = "", s = i(e);
                            if (!s.length)
                                return A;
                            for (var d = 0; d < 10; ++d)
                                if (!p(a = s[t - d] + a)) {
                                    if (n = o.exec(a))
                                        return n[1];
                                    if (n = r.exec(a))
                                        return n[1]
                                }
                            return A
                        }
                        function o(e, t) {
                            var n = i(e);
                            if (!n.length)
                                return null;
                            var r = []
                              , o = Math.floor(s.linesOfContext / 2)
                              , a = o + s.linesOfContext % 2
                              , d = Math.max(0, t - o - 1)
                              , c = Math.min(n.length, t + a - 1);
                            t -= 1;
                            for (var A = d; A < c; ++A)
                                p(n[A]) || r.push(n[A]);
                            return r.length > 0 ? r : null
                        }
                        function a(e) {
                            return e.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&")
                        }
                        function d(e) {
                            return a(e).replace("<", "(?:<|&lt;)").replace(">", "(?:>|&gt;)").replace("&", "(?:&|&amp;)").replace('"', '(?:"|&quot;)').replace(/\s+/g, "\\s+")
                        }
                        function c(e, t) {
                            for (var n, r, o = 0, a = t.length; o < a; ++o)
                                if ((n = i(t[o])).length && (n = n.join("\n"),
                                r = e.exec(n)))
                                    return {
                                        url: t[o],
                                        line: n.substring(0, r.index).split("\n").length,
                                        column: r.index - n.lastIndexOf("\n", r.index) - 1
                                    };
                            return null
                        }
                        function l(e, t, n) {
                            var r, o = i(t), s = new RegExp("\\b" + a(e) + "\\b");
                            return n -= 1,
                            o && o.length > n && (r = s.exec(o[n])) ? r.index : null
                        }
                        function h(e) {
                            if (!p(n && n.document)) {
                                for (var t, i, r, o, s = [n.location.href], A = n.document.getElementsByTagName("script"), l = "" + e, u = 0; u < A.length; ++u) {
                                    var h = A[u];
                                    h.src && s.push(h.src)
                                }
                                if (r = /^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/.exec(l)) {
                                    var m = r[1] ? "\\s+" + r[1] : ""
                                      , g = r[2].split(",").join("\\s*,\\s*");
                                    t = a(r[3]).replace(/;$/, ";?"),
                                    i = new RegExp("function" + m + "\\s*\\(\\s*" + g + "\\s*\\)\\s*{\\s*" + t + "\\s*}")
                                } else
                                    i = new RegExp(a(l).replace(/\s+/g, "\\s+"));
                                if (o = c(i, s))
                                    return o;
                                if (r = /^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/.exec(l)) {
                                    var f = r[1];
                                    if (t = d(r[2]),
                                    o = c(i = new RegExp("on" + f + "=[\\'\"]\\s*" + t + "\\s*[\\'\"]","i"), s[0]))
                                        return o;
                                    if (o = c(i = new RegExp(t), s))
                                        return o
                                }
                                return null
                            }
                        }
                        function m(e) {
                            if (!e.stack)
                                return null;
                            for (var t, n, i, a = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i, s = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i, d = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i, c = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i, u = /\((\S*)(?::(\d+))(?::(\d+))\)/, h = e.stack.split("\n"), m = [], g = /^(.*) is undefined$/.exec(e.message), f = 0, v = h.length; f < v; ++f) {
                                if (n = a.exec(h[f])) {
                                    var b = n[2] && 0 === n[2].indexOf("native");
                                    n[2] && 0 === n[2].indexOf("eval") && (t = u.exec(n[2])) && (n[2] = t[1],
                                    n[3] = t[2],
                                    n[4] = t[3]),
                                    i = {
                                        url: b ? null : n[2],
                                        func: n[1] || A,
                                        args: b ? [n[2]] : [],
                                        line: n[3] ? +n[3] : null,
                                        column: n[4] ? +n[4] : null
                                    }
                                } else if (n = d.exec(h[f]))
                                    i = {
                                        url: n[2],
                                        func: n[1] || A,
                                        args: [],
                                        line: +n[3],
                                        column: n[4] ? +n[4] : null
                                    };
                                else {
                                    if (!(n = s.exec(h[f])))
                                        continue;
                                    n[3] && n[3].indexOf(" > eval") > -1 && (t = c.exec(n[3])) ? (n[3] = t[1],
                                    n[4] = t[2],
                                    n[5] = null) : 0 !== f || n[5] || p(e.columnNumber) || (m[0].column = e.columnNumber + 1),
                                    i = {
                                        url: n[3],
                                        func: n[1] || A,
                                        args: n[2] ? n[2].split(",") : [],
                                        line: n[4] ? +n[4] : null,
                                        column: n[5] ? +n[5] : null
                                    }
                                }
                                !i.func && i.line && (i.func = r(i.url, i.line)),
                                i.context = i.line ? o(i.url, i.line) : null,
                                m.push(i)
                            }
                            return m.length ? (m[0] && m[0].line && !m[0].column && g && (m[0].column = l(g[1], m[0].url, m[0].line)),
                            {
                                mode: "stack",
                                name: e.name,
                                message: e.message,
                                stack: m
                            }) : null
                        }
                        function g(e, t, n, i) {
                            var a = {
                                url: t,
                                line: n
                            };
                            if (a.url && a.line) {
                                e.incomplete = !1,
                                a.func || (a.func = r(a.url, a.line)),
                                a.context || (a.context = o(a.url, a.line));
                                var s = / '([^']+)' /.exec(i);
                                if (s && (a.column = l(s[1], a.url, a.line)),
                                e.stack.length > 0 && e.stack[0].url === a.url) {
                                    if (e.stack[0].line === a.line)
                                        return !1;
                                    if (!e.stack[0].line && e.stack[0].func === a.func)
                                        return e.stack[0].line = a.line,
                                        e.stack[0].context = a.context,
                                        !1
                                }
                                return e.stack.unshift(a),
                                e.partial = !0,
                                !0
                            }
                            return e.incomplete = !0,
                            !1
                        }
                        function f(e, t) {
                            for (var n, i, o, a = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i, d = [], c = {}, u = !1, p = f.caller; p && !u; p = p.caller)
                                if (p !== v && p !== s.report) {
                                    if (i = {
                                        url: null,
                                        func: A,
                                        args: [],
                                        line: null,
                                        column: null
                                    },
                                    p.name ? i.func = p.name : (n = a.exec(p.toString())) && (i.func = n[1]),
                                    void 0 === i.func)
                                        try {
                                            i.func = n.input.substring(0, n.input.indexOf("{"))
                                        } catch (e) {}
                                    if (o = h(p)) {
                                        i.url = o.url,
                                        i.line = o.line,
                                        i.func === A && (i.func = r(i.url, i.line));
                                        var m = / '([^']+)' /.exec(e.message || e.description);
                                        m && (i.column = l(m[1], o.url, o.line))
                                    }
                                    c["" + p] ? u = !0 : c["" + p] = !0,
                                    d.push(i)
                                }
                            t && d.splice(0, t);
                            var b = {
                                mode: "callers",
                                name: e.name,
                                message: e.message,
                                stack: d
                            };
                            return g(b, e.sourceURL || e.fileName, e.line || e.lineNumber, e.message || e.description),
                            b
                        }
                        function v(t, a) {
                            var s = null;
                            a = null == a ? 0 : +a;
                            try {
                                if (s = function(e) {
                                    var t = e.stacktrace;
                                    if (t) {
                                        for (var n, i = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i, a = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\))? in (.*):\s*$/i, s = t.split("\n"), d = [], c = 0; c < s.length; c += 2) {
                                            var A = null;
                                            if ((n = i.exec(s[c])) ? A = {
                                                url: n[2],
                                                line: +n[1],
                                                column: null,
                                                func: n[3],
                                                args: []
                                            } : (n = a.exec(s[c])) && (A = {
                                                url: n[6],
                                                line: +n[1],
                                                column: +n[2],
                                                func: n[3] || n[4],
                                                args: n[5] ? n[5].split(",") : []
                                            }),
                                            A) {
                                                if (!A.func && A.line && (A.func = r(A.url, A.line)),
                                                A.line)
                                                    try {
                                                        A.context = o(A.url, A.line)
                                                    } catch (e) {}
                                                A.context || (A.context = [s[c + 1]]),
                                                d.push(A)
                                            }
                                        }
                                        return d.length ? {
                                            mode: "stacktrace",
                                            name: e.name,
                                            message: e.message,
                                            stack: d
                                        } : null
                                    }
                                }(t),
                                s)
                                    return s
                            } catch (t) {
                                e
                            }
                            try {
                                if (s = m(t))
                                    return s
                            } catch (t) {
                                e
                            }
                            try {
                                if (s = function(e) {
                                    var t = e.message.split("\n");
                                    if (t.length < 4)
                                        return null;
                                    var a, s = /^\s*Line (\d+) of linked script ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i, A = /^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?|blob)\S+)(?:: in function (\S+))?\s*$/i, l = /^\s*Line (\d+) of function script\s*$/i, p = [], h = n && n.document && n.document.getElementsByTagName("script"), m = [];
                                    for (var g in h)
                                        u(h, g) && !h[g].src && m.push(h[g]);
                                    for (var f = 2; f < t.length; f += 2) {
                                        var v = null;
                                        if (a = s.exec(t[f]))
                                            v = {
                                                url: a[2],
                                                func: a[3],
                                                args: [],
                                                line: +a[1],
                                                column: null
                                            };
                                        else if (a = A.exec(t[f])) {
                                            v = {
                                                url: a[3],
                                                func: a[4],
                                                args: [],
                                                line: +a[1],
                                                column: null
                                            };
                                            var b = +a[1]
                                              , y = m[a[2] - 1];
                                            if (y) {
                                                var k = i(v.url);
                                                if (k) {
                                                    var w = (k = k.join("\n")).indexOf(y.innerText);
                                                    w >= 0 && (v.line = b + k.substring(0, w).split("\n").length)
                                                }
                                            }
                                        } else if (a = l.exec(t[f])) {
                                            var E = n.location.href.replace(/#.*$/, "")
                                              , I = c(new RegExp(d(t[f + 1])), [E]);
                                            v = {
                                                url: E,
                                                func: "",
                                                args: [],
                                                line: I ? I.line : a[1],
                                                column: null
                                            }
                                        }
                                        if (v) {
                                            v.func || (v.func = r(v.url, v.line));
                                            var S = o(v.url, v.line)
                                              , x = S ? S[Math.floor(S.length / 2)] : null;
                                            S && x.replace(/^\s*/, "") === t[f + 1].replace(/^\s*/, "") ? v.context = S : v.context = [t[f + 1]],
                                            p.push(v)
                                        }
                                    }
                                    return p.length ? {
                                        mode: "multiline",
                                        name: e.name,
                                        message: t[0],
                                        stack: p
                                    } : null
                                }(t),
                                s)
                                    return s
                            } catch (t) {
                                e
                            }
                            try {
                                if (s = f(t, a + 1))
                                    return s
                            } catch (t) {
                                e
                            }
                            return {
                                name: t.name,
                                message: t.message,
                                mode: "failed"
                            }
                        }
                        return v.augmentStackTraceWithInitialElement = g,
                        v.computeStackTraceFromStackProp = m,
                        v.guessFunctionName = r,
                        v.gatherContext = o,
                        v.ofCaller = function(e) {
                            e = 1 + (null == e ? 0 : +e);
                            try {
                                throw new Error
                            } catch (t) {
                                return v(t, e + 1)
                            }
                        }
                        ,
                        v.getSource = i,
                        v
                    }(),
                    s.extendToAsynchronousCallbacks = function() {
                        var e = function(e) {
                            var t = n[e];
                            n[e] = function() {
                                var e = c.call(arguments)
                                  , n = e[0];
                                return "function" == typeof n && (e[0] = s.wrap(n)),
                                t.apply ? t.apply(this, e) : t(e[0], e[1])
                            }
                        };
                        e("setTimeout"),
                        e("setInterval")
                    }
                    ,
                    s.remoteFetching || (s.remoteFetching = !0),
                    s.collectWindowErrors || (s.collectWindowErrors = !0),
                    (!s.linesOfContext || s.linesOfContext < 1) && (s.linesOfContext = 11),
                    r = [],
                    void 0 === (o = "function" == typeof (i = s) ? i.apply(t, r) : i) || (e.exports = o)
                }
                function u(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t)
                }
                function p(e) {
                    return void 0 === e
                }
            }("undefined" != typeof window ? window : n.g)
        }
    }
      , t = {};
    function n(i) {
        if (t[i])
            return t[i].exports;
        var r = t[i] = {
            exports: {}
        };
        return e[i](r, r.exports, n),
        r.exports
    }
    n.n = e=>{
        var t = e && e.__esModule ? ()=>e.default : ()=>e;
        return n.d(t, {
            a: t
        }),
        t
    }
    ,
    n.d = (e,t)=>{
        for (var i in t)
            n.o(t, i) && !n.o(e, i) && Object.defineProperty(e, i, {
                enumerable: !0,
                get: t[i]
            })
    }
    ,
    n.g = function() {
        if ("object" == typeof globalThis)
            return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window)
                return window
        }
    }(),
    n.o = (e,t)=>Object.prototype.hasOwnProperty.call(e, t),
    (()=>{
        "use strict";
        var e = n(564)
          , t = n.n(e);
        const i = {
            ready: "pokiAppReady",
            adblocked: "pokiAppAdblocked",
            ads: {
                completed: "pokiAdsCompleted",
                error: "pokiAdsError",
                impression: "pokiAdsImpression",
                durationChange: "pokiAdsDurationChange",
                limit: "pokiAdsLimit",
                ready: "pokiAdsReady",
                requested: "pokiAdsRequested",
                prebidRequested: "pokiAdsPrebidRequested",
                skipped: "pokiAdsSkipped",
                started: "pokiAdsStarted",
                stopped: "pokiAdsStopped",
                busy: "pokiAdsBusy",
                position: {
                    preroll: "PP",
                    midroll: "PM",
                    rewarded: "PR",
                    display: "DP"
                },
                video: {
                    clicked: "pokiVideoAdsClicked",
                    firstQuartile: "pokiVideoAdsFirstQuartile",
                    midPoint: "pokiVideoAdsMidPoint",
                    thirdQuartile: "pokiVideoAdsThirdQuartile",
                    error: "pokiVideoAdsError",
                    loaderError: "pokiVideoAdsLoaderError",
                    paused: "pokiVideoAdsPauseTriggered",
                    resumed: "pokiVideoAdsResumedTriggered",
                    progress: "pokiVideoAdsProgress",
                    buffering: "pokiVideoAdsBuffering"
                }
            },
            info: {
                messages: {
                    timeLimit: "The ad-request was not processed, because of a time constraint",
                    prerollLimit: "The ad-request was cancelled, because we're not allowed to show a preroll",
                    disabled: "The ad-request was cancelled, because we've disabled this format for this specific configuration"
                }
            },
            message: {
                event: "pokiMessageEvent",
                sdkDetails: "pokiMessageSdkDetails",
                setPokiURLParams: "pokiMessageSetPokiURLParams",
                sendGameScreenshot: "pokiMessageSendScreenshot"
            },
            tracking: {
                custom: "pokiTrackingCustom",
                debugTrueInProduction: "pokiMessageDebugTrueProduction",
                screen: {
                    gameplayStart: "pokiTrackingScreenGameplayStart",
                    gameplayStop: "pokiTrackingScreenGameplayStop",
                    gameLoadingStarted: "pokiTrackingScreenGameLoadingStarted",
                    gameLoadingProgress: "pokiTrackingScreenGameLoadingProgress",
                    gameLoadingFinished: "pokiTrackingScreenGameLoadingFinished",
                    commercialBreak: "pokiTrackingScreenCommercialBreak",
                    rewardedBreak: "pokiTrackingScreenRewardedBreak",
                    firstRound: "pokiTrackingScreenFirstRound",
                    roundStart: "pokiTrackingScreenRoundStart",
                    roundEnd: "pokiTrackingScreenRoundEnd",
                    gameInteractive: "pokiTrackingScreenGameInteractive",
                    displayAd: "pokiTrackingScreenDisplayAdRequest",
                    destroyAd: "pokiTrackingScreenDisplayAdDestroy"
                },
                sdk: {
                    status: {
                        initialized: "pokiTrackingSdkStatusInitialized",
                        failed: "pokiTrackingSdkStatusFailed"
                    }
                },
                ads: {
                    status: {
                        busy: "pokiTrackingAdsStatusBusy",
                        completed: "pokiTrackingAdsStatusCompleted",
                        error: "pokiTrackingAdsStatusError",
                        displayError: "pokiTrackingAdsStatusDisplayError",
                        impression: "pokiTrackingAdsStatusImpression",
                        limit: "pokiTrackingAdsStatusLimit",
                        ready: "pokiTrackingAdsStatusReady",
                        requested: "pokiTrackingAdsStatusRequested",
                        prebidRequested: "pokiTrackingAdsStatusPrebidRequested",
                        skipped: "pokiTrackingAdsStatusSkipped",
                        started: "pokiTrackingAdsStatusStarted",
                        buffering: "pokiTrackingAdsStatusBuffering"
                    },
                    video: {
                        clicked: "pokiTrackingAdsVideoClicked",
                        error: "pokiTrackingAdsVideoError",
                        loaderError: "pokiTrackingAdsVideoLoaderError",
                        progress: "pokiTrackingAdsVideoProgress",
                        paused: "pokiTrackingAdsVideoPaused",
                        resumed: "pokiTrackingAdsVideoResumed"
                    },
                    display: {
                        requested: "pokiTrackingScreenDisplayAdRequested",
                        impression: "pokiTrackingScreenDisplayAdImpression"
                    }
                }
            }
        };
        const r = function() {
            function e() {}
            return e.debug = !1,
            e.log = !1,
            e
        }();
        var o = function() {
            return o = Object.assign || function(e) {
                for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var r in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                return e
            }
            ,
            o.apply(this, arguments)
        };
        const a = function() {
            function e() {}
            return e.clearEventListeners = function() {
                this.listeners = {}
            }
            ,
            e.removeEventListener = function(e, t) {
                if (Object.prototype.hasOwnProperty.call(this.listeners, e)) {
                    var n = this.listeners[e].indexOf(t);
                    -1 !== n && this.listeners[e].splice(n, 1)
                }
            }
            ,
            e.addEventListener = function(e, t, n) {
                var i = this;
                if (void 0 === n && (n = !1),
                n = !!n,
                Object.prototype.hasOwnProperty.call(this.listeners, e) || (this.listeners[e] = []),
                n) {
                    var r = function(n) {
                        i.removeEventListener.bind(i)(e, r),
                        t(n)
                    };
                    this.listeners[e].push(r)
                } else
                    this.listeners[e].push(t)
            }
            ,
            e.dispatchEvent = function(e, t) {
                void 0 === t && (t = {}),
                !r.debug || window.process && window.process.env && "test" === window.process.env.NODE_ENV || console.info(e, t);
                for (var n = Object.keys(this.listeners), i = 0; i < n.length; i++) {
                    var a = n[i];
                    if (e === a)
                        for (var s = this.listeners[a], d = 0; d < s.length; d++)
                            s[d](o(o({}, this.dataAnnotations), t))
                }
            }
            ,
            e.setDataAnnotations = function(e) {
                this.dataAnnotations = o(o({}, this.dataAnnotations), e)
            }
            ,
            e.getDataAnnotations = function() {
                return this.dataAnnotations
            }
            ,
            e.clearAnnotations = function() {
                this.dataAnnotations = {}
            }
            ,
            e.listeners = {},
            e.dataAnnotations = {},
            e
        }();
        const s = function(e, t) {
            var n = !1;
            return Object.keys(t).forEach((function(i) {
                t[i] === e && (n = !0)
            }
            )),
            n
        };
        const d = {
            adTagUrl: "//pubads.g.doubleclick.net/gampad/ads?sz=640x360|640x480&iu=/1053551/Pub-Poki-Generic&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url={url}&description_url={descriptionUrl}&correlator={timestamp}",
            adTiming: {
                preroll: !1,
                timeBetweenAds: 12e4,
                timePerTry: 7e3,
                startAdsAfter: 12e4
            },
            waterfallRetries: 2
        };
        const c = function(e) {
            return e instanceof Array ? e : [e]
        };
        const A = function() {
            function e(e) {
                void 0 === e && (e = {}),
                this.setTimings(e),
                this.timingIdx = {
                    timePerTry: 0
                },
                this.timers = {
                    timePerTry: void 0,
                    timeBetweenAds: void 0,
                    startAdsAfter: void 0
                },
                a.addEventListener(i.ads.requested, this.startTimeBetweenAdsTimer.bind(this)),
                a.addEventListener(i.ads.completed, this.startTimeBetweenAdsTimer.bind(this)),
                a.addEventListener(i.ads.stopped, this.startTimeBetweenAdsTimer.bind(this))
            }
            return e.prototype.setTimings = function(e) {
                var t = d.adTiming
                  , n = e.preroll
                  , i = void 0 === n ? t.preroll : n
                  , r = e.timePerTry
                  , o = void 0 === r ? t.timePerTry : r
                  , a = e.timeBetweenAds
                  , s = void 0 === a ? t.timeBetweenAds : a
                  , A = e.startAdsAfter
                  , l = void 0 === A ? t.startAdsAfter : A;
                this.timings = {
                    preroll: !1 !== i,
                    timePerTry: c(o),
                    timeBetweenAds: s,
                    startAdsAfter: l
                }
            }
            ,
            e.prototype.startTimeBetweenAdsTimer = function() {
                this.startTimer("timeBetweenAds")
            }
            ,
            e.prototype.startStartAdsAfterTimer = function() {
                this.startTimer("startAdsAfter")
            }
            ,
            e.prototype.requestPossible = function() {
                return !this.timers.timeBetweenAds && !this.timers.startAdsAfter
            }
            ,
            e.prototype.startWaterfallTimer = function(e) {
                this.startTimer("timePerTry", e)
            }
            ,
            e.prototype.stopWaterfallTimer = function() {
                this.stopTimer("timePerTry")
            }
            ,
            e.prototype.nextWaterfallTimer = function() {
                this.nextTiming("timePerTry")
            }
            ,
            e.prototype.resetWaterfallTimerIdx = function() {
                this.resetTimingIdx("timePerTry")
            }
            ,
            e.prototype.stopTimer = function(e) {
                this.timers[e] && (clearTimeout(this.timers[e]),
                this.timers[e] = void 0)
            }
            ,
            e.prototype.startTimer = function(e, t) {
                var n = this;
                void 0 === t && (t = function() {}
                ),
                this.getTiming(e) <= 0 ? t() : (this.timers[e] && clearTimeout(this.timers[e]),
                this.timers[e] = window.setTimeout((function() {
                    n.stopTimer(e),
                    t()
                }
                ), this.getTiming(e)))
            }
            ,
            e.prototype.getTiming = function(e) {
                var t = this.timings[e];
                return t instanceof Array ? t[this.timingIdx[e]] : t
            }
            ,
            e.prototype.nextTiming = function(e) {
                if (void 0 === this.timingIdx[e])
                    throw new Error("AdTimings Error: " + e + " does not have multiple timers");
                this.timingIdx[e] = (this.timingIdx[e] + 1) % this.timings[e].length
            }
            ,
            e.prototype.resetTimingIdx = function(e) {
                if (void 0 === this.timingIdx[e])
                    throw new Error("AdTimings Error: " + e + " does not have multiple timers");
                this.timingIdx[e] = 0
            }
            ,
            e.prototype.prerollPossible = function() {
                return this.timings.preroll
            }
            ,
            e
        }();
        var l = document.location.hostname;
        function u(e) {
            var t = new RegExp(e + "=([^;]+)(?:;|$)").exec(document.cookie);
            return t ? t[1] : ""
        }
        function p(e, t) {
            document.cookie = e + "=" + t + "; path=/; samesite=none; secure; max-age=15552000; domain=" + l
        }
        l.endsWith("poki-gdn.com") && (l = "poki-gdn.com");
        var h = function(e, t, n, i) {
            return new (n || (n = Promise))((function(r, o) {
                function a(e) {
                    try {
                        d(i.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function s(e) {
                    try {
                        d(i.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function d(e) {
                    var t;
                    e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function(e) {
                        e(t)
                    }
                    ))).then(a, s)
                }
                d((i = i.apply(e, t || [])).next())
            }
            ))
        }
          , m = function(e, t) {
            var n, i, r, o, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0])
                        throw r[1];
                    return r[1]
                },
                trys: [],
                ops: []
            };
            return o = {
                next: s(0),
                throw: s(1),
                return: s(2)
            },
            "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
            }
            ),
            o;
            function s(o) {
                return function(s) {
                    return function(o) {
                        if (n)
                            throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (n = 1,
                                i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i),
                                0) : i.next) && !(r = r.call(i, o[1])).done)
                                    return r;
                                switch (i = 0,
                                r && (o = [2 & o[0], r.value]),
                                o[0]) {
                                case 0:
                                case 1:
                                    r = o;
                                    break;
                                case 4:
                                    return a.label++,
                                    {
                                        value: o[1],
                                        done: !1
                                    };
                                case 5:
                                    a.label++,
                                    i = o[1],
                                    o = [0];
                                    continue;
                                case 7:
                                    o = a.ops.pop(),
                                    a.trys.pop();
                                    continue;
                                default:
                                    if (!(r = a.trys,
                                    (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                        a.label = o[1];
                                        break
                                    }
                                    if (6 === o[0] && a.label < r[1]) {
                                        a.label = r[1],
                                        r = o;
                                        break
                                    }
                                    if (r && a.label < r[2]) {
                                        a.label = r[2],
                                        a.ops.push(o);
                                        break
                                    }
                                    r[2] && a.ops.pop(),
                                    a.trys.pop();
                                    continue
                                }
                                o = t.call(e, a)
                            } catch (e) {
                                o = [6, e],
                                i = 0
                            } finally {
                                n = r = 0
                            }
                        if (5 & o[0])
                            throw o[1];
                        return {
                            value: o[0] ? o[1] : void 0,
                            done: !0
                        }
                    }([o, s])
                }
            }
        }
          , g = function(e, t, n) {
            if (n || 2 === arguments.length)
                for (var i, r = 0, o = t.length; r < o; r++)
                    !i && r in t || (i || (i = Array.prototype.slice.call(t, 0, r)),
                    i[r] = t[r]);
            return e.concat(i || Array.prototype.slice.call(t))
        }
          , f = "poki_gcuid"
          , v = u(f);
        const b = function() {
            function e() {}
            return e.collectAndLog = function() {
                return h(this, void 0, void 0, (function() {
                    var e, t, n, i, r;
                    return m(this, (function(o) {
                        switch (o.label) {
                        case 0:
                            return o.trys.push([0, 5, , 6]),
                            [4, window.cookieStore.getAll()];
                        case 1:
                            return e = o.sent(),
                            window.indexedDB.databases ? [4, window.indexedDB.databases()] : [3, 3];
                        case 2:
                            return n = o.sent(),
                            [3, 4];
                        case 3:
                            n = [],
                            o.label = 4;
                        case 4:
                            return t = n,
                            i = g(g(g([], e.map((function(e) {
                                return {
                                    name: e.name,
                                    expire_seconds: Math.round((e.expires - Date.now()) / 1e3),
                                    type: "cookie"
                                }
                            }
                            )), !0), Object.keys(window.localStorage).map((function(e) {
                                return {
                                    name: e,
                                    expire_seconds: 15552e3,
                                    type: "localStorage"
                                }
                            }
                            )), !0), t.map((function(e) {
                                return {
                                    name: e.name,
                                    expire_seconds: 0,
                                    type: "idb"
                                }
                            }
                            )), !0),
                            r = {
                                cookies: i,
                                p4d_game_id: et.gameId,
                                user_id: v
                            },
                            window.fetch("https://t.poki.io/game-cookies", {
                                method: "post",
                                body: JSON.stringify(r)
                            }).catch(),
                            [3, 6];
                        case 5:
                            return o.sent(),
                            [3, 6];
                        case 6:
                            return [2]
                        }
                    }
                    ))
                }
                ))
            }
            ,
            e.trackSavegames = function() {
                window.cookieStore && window.cookieStore.getAll && et.gameId && (Math.random() > .01 || navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") <= -1 || (v || (v = Math.random().toString(36).substr(2, 9),
                p(f, v)),
                e.collectAndLog(),
                setInterval(e.collectAndLog, 12e4)))
            }
            ,
            e
        }()
          , y = function() {
            return window.location.href
        }
          , k = function() {
            return "undefined" != typeof navigator && /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera\smini|avantgo|mobilesafari|docomo)/i.test(navigator.userAgent)
        }
          , w = function() {
            return "undefined" != typeof navigator && /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i.test(navigator.userAgent)
        }
          , E = function(e, t) {
            var n;
            if ("undefined" == typeof window && !t)
                return "";
            e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var i = new RegExp("(?:[\\?&]|^)" + e + "=([^&#]*)").exec(t || (null === (n = null === window || void 0 === window ? void 0 : window.location) || void 0 === n ? void 0 : n.search) || "");
            return null === i ? "" : decodeURIComponent(i[1].replace(/\+/g, " "))
        }
          , I = function() {
            return "undefined" != typeof navigator && /MSIE \\d|Trident.*rv:/i.test(navigator.userAgent)
        };
        var S = {
            1: "eNjDw1AVTr",
            2: "HkuQJaWnBa",
            3: "AfRKClvdYk",
            4: "Db7uYbsnlW",
            5: "UprdYKe74r",
            6: "tBCJC9E6Y4",
            7: "AfRKClvdYk",
            8: "tJ44vpLpuM",
            9: "mF5ASaga4A",
            10: "rKV8rMwiwk",
            11: "SvK8BH5qS5",
            12: "SpfIMxnWTS",
            13: "ysxIcmt3tW",
            14: "gLmtGS4aUq",
            15: "RU6ebIFLw9",
            16: "r9G4tVMYw7",
            17: "SgcDa5B8s1",
            18: "AfRKClvdYk",
            19: "DNZX8XdJXV",
            20: "39o4YUyZTX",
            21: "5sb2HFpz5a",
            22: "pgXzCJZipE",
            23: "Oani8EAGI9",
            24: "IzCeh7d7vW",
            25: "I5vRNtjoMr",
            26: "KpySvG7luq",
            27: "dK42J4rI14",
            28: "HuYorw3fRg",
            29: "mf84cGYc1h",
            30: "9ALgxEyGXU",
            31: "lBzSdVGY8F",
            32: "hKYgk9Wb8q",
            33: "xPBr8E54eE",
            34: "ZvIK2WKC7G",
            35: "7kiYi3zlIX",
            36: "VpygYMTDgm",
            37: "mis9Mt4np4",
            38: "AfRKClvdYk",
            41: "Fqmjp9Hit3",
            42: "lS2XGg058L",
            43: "AfRKClvdYk",
            46: "AfRKClvdYk",
            47: "21OybbiIdc",
            48: "AfRKClvdYk",
            49: "CMVoMvvEmu",
            50: "IoQrhRb3wU",
            52: "AfRKClvdYk",
            53: "AfRKClvdYk"
        };
        var x = ["AU", "CA", "IE", "NZ", "US", "GB"]
          , C = ["AT", "BE", "DK", "FI", "FR", "DE", "JA", "NO", "NL", "SA", "ES", "SE", "CH", "AE", "IT"]
          , T = ["BR", "CL", "CZ", "HU", "PL", "PT", "RU", "SK", "TH"]
          , _ = ["AR", "BG", "CO", "EC", "GR", "IN", "MX", "PE", "PH", "RO", "TR", "UY"];
        function B(e) {
            return x.includes(e) ? .13 : C.includes(e) ? .07 : T.includes(e) ? .04 : .02
        }
        function P(e) {
            return "US" === e ? 1.5 : x.includes(e) ? .5 : C.includes(e) ? .15 : T.includes(e) ? .08 : _.includes(e) ? .03 : .02
        }
        var D = function() {
            return D = Object.assign || function(e) {
                for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var r in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                return e
            }
            ,
            D.apply(this, arguments)
        };
        const j = function(e) {
            var t;
            if ("undefined" != typeof window && "undefined" != typeof fetch) {
                var n = a.getDataAnnotations()
                  , i = e.size;
                (null === (t = e.event) || void 0 === t ? void 0 : t.startsWith("video-")) && (i = "640x360v");
                var o = D(D({}, e), {
                    size: i,
                    opportunity_id: e.opportunityId || n.opportunityId,
                    ad_unit_path: e.adUnitPath || n.adUnitPath,
                    p4d_game_id: et.gameId,
                    p4d_version_id: et.versionId,
                    bidder: e.bidder || n.bidder,
                    bid: e.bid || n.bid || 0,
                    error_code: e.errorCode,
                    creative_id: e.creativeId || n.creativeId
                });
                r.debug ? console.log("PokiAdServer Tracking: ", o) : fetch("https://t.poki.io/adserver", {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(o)
                })
            }
        };
        function z() {
            var e = new URL("https://api.poki.com/ads/houseads/video/vast")
              , t = E("site_id");
            return e.searchParams.append("game_id", et.gameId),
            e.searchParams.append("site", t),
            e.href
        }
        var R = {
            v_k0treo: 2.5,
            v_qr1wxs: 7.5,
            v_9diccg: 19,
            v_13q0xkw: .25,
            v_dn33ls: 1,
            v_z07u2o: 1.5,
            v_1400iyo: 2.25,
            v_9w8kxs: 3,
            v_ufej9c: 3.5,
            v_10960ao: 4.25,
            v_1ksbym8: 4.75,
            v_1ag9340: 5.25,
            v_1tbhh4w: 5.75,
            v_jjcgzk: 6.5,
            v_brnu9s: 7,
            v_1wscef4: 7.75,
            v_q22xhc: 8.5,
            v_f8irk0: 9,
            v_1rik45c: 9.75,
            v_lxhyww: 10.5,
            v_a9z0u8: 11,
            v_1yhiww0: 11.75,
            v_10mwg74: 12.25,
            v_1ji4u80: 12.75,
            v_wm2c5c: 13.5,
            v_2na6tc: 14,
            v_1myzri8: 14.75,
            v_3pzm68: 6,
            v_16kerr4: 6.25,
            v_1mdrmkg: 6.75,
            v_1ga0k5c: 7.25,
            v_5iwz5s: 8,
            v_12tk934: 8.25,
            v_1hsybr4: 8.75,
            v_1cj61hc: 9.25,
            v_y3r5kw: 9.5,
            v_94ow0: 10,
            v_15woqgw: 10.25,
            v_1orx4hs: 10.75,
            v_1d4e6f4: 11.25,
            v_t57ev4: 11.5,
            v_783hmo: 12,
            v_m7hkao: 12.5,
            v_hmo9hc: 13,
            v_19djnr4: 13.25,
            v_1twpm2o: 13.75,
            v_17zlou8: 14.25,
            v_ign1mo: 14.5,
            v_ccvz7k: 15,
            v_1f7b4sg: 15.25,
            v_snq4g0: 15.5,
            v_5wnf28: 16,
            v_137aozk: 16.25,
            v_1j0njsw: 16.75,
            v_1b8yx34: 17.25,
            v_yhhlhc: 17.5,
            v_25swe8: 18,
            v_15081z4: 18.25,
            v_1pje0ao: 18.75,
            v_1eptudc: 19.25,
            v_1xl28e8: 19.75,
            v_gfliio: 21,
            v_3y3sao: 22,
            v_ixhuyo: 22.5,
            v_ro52io: 23.5,
            v_qa73ls: 24.5,
            v_emo5j4: 25,
            v_yq5fk: 26,
            v_aobxts: 27,
            v_6shmgw: 28,
            v_natgqo: 28.5,
            v_x0f94w: 29.5,
            v_d2hfr4: 31,
            v_dch14w: 33,
            v_1jyadc: 34,
            v_8p5tz4: 36,
            v_fwv9xc: 37,
            v_c60r9c: 39,
            v_58awow: 40,
            v_bbcow: 42,
            v_a0x534: 43,
            v_hdmdq8: 45,
            v_2e8b28: 46,
            v_5nljb4: 48,
            v_1wr0n4: 50,
            v_pam1og: .5,
            v_1ipf08w: .75,
            v_1axqdj4: 1.25,
            v_1qr38cg: 1.75,
            v_15ldds: 2,
            v_1q248w0: 2.75,
            v_1eelatc: 3.25,
            v_1x9tou8: 3.75,
            v_8iam0w: 4,
            v_nhooow: 4.5,
            v_fq01z4: 5,
            v_w0u77k: 5.5,
            v_1vi5a0w: 15.75,
            v_orvt34: 16.5,
            v_dybn5s: 17,
            v_1q8czr4: 17.75,
            v_l11af4: 18.5,
            v_uqn2tc: 19.5,
            v_7zkdfk: 20,
            v_o7a58g: 20.5,
            v_vezl6o: 21.5,
            v_b5t88w: 23,
            v_4x2d4w: 24,
            v_xhwjk0: 25.5,
            v_lhw3r4: 26.5,
            v_tjkbuo: 27.5,
            v_h72ebk: 29,
            v_31n3sw: 30,
            v_64rl6o: 32,
            v_9lmigw: 35,
            v_3fdjpc: 38,
            v_fapfcw: 41,
            v_7o0lc0: 44,
            v_clbdvk: 47,
            v_ee8qv4: 49
        }
          , M = {
            "11s3rwg": 2.49,
            "1uhxr0g": 2.87,
            qr1wxs: 7.5,
            "15xxon4": .01,
            o6no5c: .02,
            fb0nwg: .04,
            "1etkow0": .05,
            x2aoe8: .06,
            "1wkupds": .07,
            "11i46io": .09,
            jqu60w: .1,
            "1j9e70g": .11,
            "1adr6rk": .13,
            smh69s: .14,
            "1s5179c": .15,
            "8naeps": .16,
            qekf7k: .18,
            "1px4g74": .19,
            hixeyo: .2,
            za7fgg: .22,
            "1ysrgg0": .23,
            lyqx34: .26,
            "16hwveo": 1.13,
            "1fdjvnk": 1.17,
            "2jjcao": 1.2,
            "1jtdds0": 1.23,
            t6gd1c: 1.26,
            "65e29s": 1.28,
            "1nf83r4": 1.31,
            wsb30g: 1.34,
            jgukn4: 1.38,
            al7ke8: 1.4,
            "1a3rlds": 1.41,
            "8datc0": 1.44,
            "1pn4utc": 1.47,
            z07u2o: 1.5,
            "13g1c74": 1.53,
            ct4bgg: 1.56,
            ukeby8: 1.58,
            mspp8g: 1.62,
            "1dfmpz4": 1.65,
            lm6m8: 1.68,
            icw740: 1.7,
            "18zt7uo": 1.73,
            "79cfsw": 1.76,
            "1oj6ha8": 1.79,
            "1xethj4": 1.83,
            "12c2yo0": 1.85,
            bp5xxc: 1.88,
            "1syzzeo": 1.91,
            ncow00: 1.94,
            "1dzlwqo": 1.97,
            "15ldds": 2,
            "10o5edc": 2.009999,
            a18dmo: 2.04,
            "1rb2f40": 2.069999,
            pkln28: 2.1,
            "1g7insw": 2.13,
            "12w25fk": 2.17,
            c954ow: 2.2,
            "1brp5og": 2.21,
            "1400iyo": 2.25,
            v4dips: 2.3,
            hsx0cg: 2.34,
            "18fu134": 2.37,
            "167xa0w": 2.41,
            "1f3ka9s": 2.45,
            "1d5n4lc": 1.01,
            "1uwx534": 1.03,
            bml8g: 1.04,
            i2wlq8: 1.06,
            "979lhc": 1.08,
            "18ptmgw": 1.09,
            "1qh3myo": 1.11,
            "6zcuf4": 1.12,
            oqmuww: 1.14,
            fuzuo0: 1.16,
            xm9v5s: 1.18,
            "1x4tw5c": 1.19,
            "1223da8": 1.21,
            katcsg: 1.22,
            bf6cjk: 1.24,
            "1axqdj4": 1.25,
            "1sp0e0w": 1.27,
            "15ny39c": 1.29,
            nwo2rk: 1.3,
            f112io: 1.32,
            "1ejl3i8": 1.33,
            "1pkk5c": 1.36,
            "1184l4w": 1.37,
            "1izelmo": 1.39,
            schkw0: 1.42,
            "1rv1lvk": 1.43,
            "17vuubk": 1.45,
            q4ktts: 1.46,
            h8xtkw: 1.48,
            "1yirv28": 1.51,
            "3xhb7k": 1.52,
            lorbpc: 1.54,
            "1l7bcow": 1.55,
            "1cbocg0": 1.57,
            "1u2ycxs": 1.59,
            "51foqo": 1.6,
            "14jzpq8": 1.61,
            "1mb9q80": 1.63,
            dx2ozk: 1.64,
            vocphc: 1.66,
            "1v6wqgw": 1.67,
            "10467ls": 1.69,
            "1hvg83k": 1.71,
            "9h96v4": 1.72,
            r8j7cw: 1.74,
            "1qr38cg": 1.75,
            "16rwgsg": 1.77,
            p0mgao: 1.78,
            g4zg1s: 1.8,
            "1fnjh1c": 1.81,
            xw9gjk: 1.82,
            "2tixog": 1.84,
            kksy68: 1.86,
            "1k3cz5s": 1.87,
            "1b7pyww": 1.89,
            tgfyf4: 1.9,
            "5levi8": 1.92,
            "153ywhs": 1.93,
            "1mv8wzk": 1.95,
            eh1vr4: 1.96,
            w8bw8w: 1.98,
            iwvdvk: 2.02,
            "1iffev4": 2.029999,
            "19jsem8": 2.049999,
            rsie4g: 2.06,
            "7tbmkg": 2.08,
            "17bvnk0": 2.089999,
            "1p35o1s": 2.11,
            goymtc: 2.12,
            "1xysoao": 2.15,
            "3di4g0": 2.16,
            l4s4xs: 2.18,
            "1knc5xc": 2.19,
            u0f56o: 2.22,
            "1tiz668": 2.23,
            "4hghz4": 2.24,
            m8qigw: 2.26,
            dd3i80: 2.28,
            "1cvnj7k": 2.29,
            "1umxjpc": 2.31,
            "1mzuo": 2.32,
            zk70u8: 2.33,
            "1hbh1c0": 2.35,
            "8xa03k": 2.36,
            qok0lc: 2.38,
            "1q741kw": 2.39,
            "6pd91c": 2.4,
            ogn9j4: 2.42,
            "1wuuark": 2.47,
            k0treo: 2.5,
            "1jjdse8": 2.51,
            swgrnk: 2.54,
            "162xhc0": 2.57,
            fg0glc: 2.6,
            l11af4: 18.5,
            "9diccg": 19,
            "7zkdfk": 20,
            gfliio: 21,
            b5t88w: 23,
            "4x2d4w": 24,
            emo5j4: 25,
            aobxts: 27,
            "6shmgw": 28,
            "31n3sw": 30,
            "64rl6o": 32,
            dch14w: 33,
            "9lmigw": 35,
            "1yv9csg": 5.35,
            o42yo: 6.8,
            q22xhc: 8.5,
            d2hfr4: 31,
            "1np7p4w": .03,
            "1zk5j4": .08,
            av75s0: .12,
            "185ufpc": .17,
            "1h1hfy8": .21,
            "47gwlc": .24,
            d33wu8: .28,
            uudxc0: .3,
            "14tzb40": .33,
            e72adc: .36,
            "1vgwbuo": .39,
            "10e5szk": .41,
            "1i5fthc": .43,
            "1r12tq8": .47,
            pam1og: .5,
            gez1fk: .52,
            "1xot2ww": .55,
            kusjk0: .58,
            bz5jb4: .6,
            tqfjsw: .62,
            "5vegw0": .64,
            "1n58idc": .67,
            wibhmo: .7,
            "1fkyrk": .72,
            "1ipf08w": .75,
            s2hzi8: .78,
            pul8g0: .82,
            "1ghi96o": .85,
            "3nhpts": .88,
            lerqbk: .9,
            uaeqkg: .94,
            "14a04cg": .97,
            dn33ls: 1,
            ved43k: 1.02,
            zu6m80: 1.05,
            "1hlgmps": 1.07,
            qyjlz4: 1.1,
            "1lhay2o": .27,
            "1clnxts": .29,
            "1ucxybk": .31,
            "5bfa4g": .32,
            n2pam8: .34,
            "1ml9bls": .35,
            "1dpmbcw": .37,
            vycav4: .38,
            vls00: .4,
            imvshs: .42,
            "9r8s8w": .44,
            "199st8g": .45,
            "7jc16o": .48,
            "171w268": .49,
            "1ot62o0": .51,
            "1fxj2f4": .53,
            y691xc: .54,
            "33ij28": .56,
            "12m2k1s": .57,
            "1kdckjk": .59,
            "1t8zksg": .63,
            "15dyhvk": .65,
            nmohds: .66,
            er1h4w: .68,
            "1e9li4g": .69,
            "1w0vim8": .71,
            "10y4zr4": .73,
            j6uz9c: .74,
            ab7z0g: .76,
            "19ts000": .77,
            "1rl20hs": .79,
            "83b7y8": .8,
            "17lv8xs": .81,
            "1pd59fk": .83,
            gyy874: .84,
            yq88ow: .86,
            "1y8s9og": .87,
            "1361qtc": .89,
            "1kxbrb4": .91,
            "1c1or28": .93,
            "1tsyrk0": .95,
            "4rg3cw": .96,
            miq3uo: .98,
            "1m1a4u8": .99,
            "11x3klc": 5.05,
            "1nrplhc": 5.15,
            "1ag9340": 5.25,
            qh2bk0: 5.3,
            "14wh7gg": 5.45,
            w0u77k: 5.5,
            "7ltxj4": 5.6,
            kxafwg: 5.7,
            "1tbhh4w": 5.75,
            "110mw3k": 5.85,
            "1pfn5s0": 5.95,
            "3pzm68": 6,
            ml8074: 6.1,
            "1uzf1fk": 6.15,
            "16kerr4": 6.25,
            "1jvva4g": 6.35,
            "67vym8": 6.4,
            jjcgzk: 6.5,
            hbfpxc: 6.6,
            "13ij8jk": 6.65,
            "1mdrmkg": 6.75,
            p34cn4: 6.9,
            "1xhbdvk": 6.95,
            "1ihxb7k": 7.15,
            "1ga0k5c": 7.25,
            dflekg: 7.4,
            "1o1p6v4": 7.55,
            "2c1n9c": 7.6,
            "1wscef4": 7.75,
            zhp4hs: 7.9,
            "5iwz5s": 8,
            f8irk0: 9,
            y3r5kw: 9.5,
            lxhyww: 10.5,
            a9z0u8: 11,
            "783hmo": 12,
            m7hkao: 12.5,
            wm2c5c: 13.5,
            "2na6tc": 14,
            ign1mo: 14.5,
            snq4g0: 15.5,
            "5wnf28": 16,
            dybn5s: 17,
            yhhlhc: 17.5,
            testbid: 0,
            "1nz7aio": 2.43,
            xca9s0: 2.46,
            b56r5s: 2.52,
            obngu8: 2.58,
            "24jy80": 2.64,
            "1jedzpc": 2.67,
            "18au8e8": 2.73,
            hnx7nk: 2.76,
            "13v0q9s": 2.81,
            "10lkow": 2.96,
            "156gsu8": 7.05,
            "1tlh2io": 7.35,
            "1aq8ohs": 7.65,
            "1losn40": 7.95,
            "1sf0sn4": 2.55,
            "1eykhkw": 2.61,
            srgyyo: 2.7,
            "1yxr94w": 2.79,
            d83pj4: 2.84,
            n7p3b4: 2.9,
            "1dum41s": 2.93,
            "1iafm68": 2.99,
            "7vtiww": 7.2,
            b2outc: 7.8,
            "13q0xkw": .25,
            riisqo: .46,
            "1bhpkao": .61,
            cj4q2o: .92,
            "1o96vwg": 1.15,
            "1wav400": 1.35,
            "1grhukg": 1.49,
            "1vqvx8g": 1.99,
            yg8nb4: 2.14,
            "1lrajgg": 2.27,
            fl09a8: 2.44,
            "1h6h8n4": 2.77,
            "1m69xj4": 3.55,
            rdj01s: 4.3,
            "29jqww": 2.48,
            "1anqs5c": 2.53,
            "6kdgcg": 2.56,
            "1nu7hts": 2.59,
            "1wpui2o": 2.63,
            jvtyps: 2.66,
            "1sa0zy8": 2.71,
            "1q248w0": 2.75,
            "4cgpa8": 2.8,
            "1cqnqio": 2.85,
            "5gf2tc": 2.88,
            ec2328: 2.92,
            "1vlw4jk": 2.95,
            "9w8kxs": 3,
            "176vuv4": 3.05,
            "1kicd8g": 3.15,
            jbury8: 3.3,
            h3y0w0: 3.4,
            gmdxc: 3.6,
            ovmnls: 3.7,
            "15sxvy8": 3.85,
            "1j4eebk": 3.95,
            "1gwhn9c": 4.05,
            e22hog: 4.2,
            "1oo69z4": 4.35,
            nhooow: 4.5,
            "17gvg8w": 4.65,
            "1ksbym8": 4.75,
            hxwt1c: 4.9,
            t1gkcg: 5.1,
            "2221vk": 5.2,
            d5lt6o: 5.4,
            "1i7xpts": 5.55,
            "1g00yrk": 5.65,
            etjdhc: 5.8,
            s4zvuo: 5.9,
            "1c46neo": 6.05,
            "99rhts": 6.2,
            xorri8: 6.3,
            "1em2zuo": 6.45,
            "1rxji80": 6.55,
            umw8ao: 6.7,
            "192b474": 6.85,
            brnu9s: 7,
            x7ah34: 2.62,
            "11n3z7k": 2.65,
            b06ygw: 2.68,
            "1aiqzgg": 2.69,
            "8sa7eo": 2.72,
            qjk7wg: 2.74,
            zf785c: 2.78,
            m3qps0: 2.82,
            "1lmaqrk": 2.83,
            uzdq0w: 2.86,
            "14yz3sw": 2.89,
            "1mq94ao": 2.91,
            w3c3k0: 2.94,
            "10j5log": 2.97,
            irvl6o: 2.98,
            yb8um8: 3.1,
            "60e9kw": 3.2,
            "1eelatc": 3.25,
            "1rq1t6o": 3.35,
            "13b1ji8": 3.45,
            ufej9c: 3.5,
            "18utf5s": 3.65,
            "1x9tou8": 3.75,
            bk658g: 3.8,
            wxavpc: 3.9,
            "8iam0w": 4,
            ltr4e8: 4.099999,
            "1u7y5mo": 4.15,
            "10960ao": 4.25,
            "2yiqdc": 4.4,
            "1bcprls": 4.45,
            "1vvvpxc": 4.55,
            a686bk: 4.6,
            yl8g00: 4.7,
            "4mgao0": 4.8,
            "1d0nbwg": 4.85,
            "1qc3u9s": 4.95,
            fq01z4: 5,
            watslc: 7.1,
            l7a1a8: 7.3,
            zmox6o: 7.45,
            oe5d6o: 7.7,
            "18dc4qo": 7.85,
            "94ow0": 10,
            t57ev4: 11.5,
            hmo9hc: 13,
            ccvz7k: 15,
            orvt34: 16.5,
            "25swe8": 18,
            uqn2tc: 19.5,
            "3y3sao": 22,
            yq5fk: 26,
            h72ebk: 29,
            "1jyadc": 34,
            testBid: 50
        }
          , O = {
            hgfim8: "Amazon - DistrictM",
            qc2iv4: "Amazon - Magnite",
            "183cjcw": "Amazon - AppNexus",
            "8ksidc": "Amazon - OpenX",
            "1s2jaww": "Amazon - PubMatic",
            "1pumjuo": "Amazon - EMX",
            "12jknpc": "Amazon - Conversant UAM",
            "1kauo74": "Amazon - Amobee DSP",
            "15bglj4": "Amazon - PubMatic UAM APAC",
            "5swkjk": "Amazon - PubMatic UAM EU",
            "1d32f4": "Amazon - Simpli.fi",
            ksan7k: "Amazon - Index Exchange",
            urw0zk: "Amazon - Smaato",
            "1dn4f0g": "Amazon - AdGeneration",
            vvueio: "Amazon - DMX",
            "1veefi8": "Amazon - Yieldmo",
            "1i2xx4w": "Amazon - Yahoo Japan",
            rg0we8: "Amazon - UnrulyX_SSP_APS",
            y3r5kw: "Amazon - Verizon Media Group",
            "1xmb6kg": "Amazon - GumGum UAM",
            "1t6hog0": "Amazon - Acuity",
            "1n2qm0w": "Amazon - Sharethrough",
            j4d2ww: "Amazon - EMX UAM",
            "1imx3wg": "Amazon - LoopMe_UAM",
            z7pj40: "Amazon - Pulsepoint",
            p845c0: "Amazon - SmartRTB+"
        };
        var L = {
            skyscraper: {
                1: "eexq7SUa6daeQrPF6q1CaKZ0",
                10: "SSZzGHt3d4BrOdVUug1ypxji",
                11: "OXc0ZJDJIcRgGcIta8mTUQSZ",
                12: "ulACVGPjP002tSfhDGRApuub",
                13: "c7FldnCsd9Mtcr7PgBFGKWEQ",
                14: "KJouWQMjZwvE8fxw4mAvGopZ",
                15: "ilNkOqBMO6EGbQwrZtCMHzeJ",
                16: "Kg24ec1AyTvzJ6I3Cji8lqzx",
                17: "iqvpcyepSMCVCsJfKu4JQGwr",
                18: "es9ztDrPZDW883VHbK2gUfkQ",
                19: "pvXQE41GXKGsW5Li0OSQavwT",
                20: "MCy638sYvzVbsrvcPau6lABN",
                21: "NkJeV6CuMlt41iJWcgnmMSDN",
                22: "fjKznUvVWlp6TBxuSsEkQF8H",
                23: "5tJM2ZFmNf7gii6KVS6msGc4",
                24: "xZUYMFw1zGuRzFd6DRl88Pwk",
                3: "xNmhWWy88VtzOGfderrtgDBb",
                30: "KO0gUA5iJIsleK9a941H0pW1",
                31: "wo0KU1WR11jNFxoy121ciQj8",
                37: "areVtONg11YNRQin7R2sveKy",
                4: "nip2pDW2AbU4GM5HMJcouuIa",
                47: "uzLaOEe8yqB9eWZuxdnwyawr",
                49: "ZYaqiQw00NSTBGJ4HacifENM",
                5: "qe5Tc3N2MO3daALoTdIaTmSA",
                50: "NZv1ui2F1tlQ6PQQi7umnFht",
                6: "xbx8OLCAgjm0igkmFIBw8n6E",
                8: "4vYDfNOQagnuwg9REGNWGv83"
            },
            rectangle: {
                1: "Ka3KvQx9svu71CJoRtZlwFY9",
                10: "9o5dMBQZX9bi2OsvTpc5j0pO",
                11: "gwL6nB1Twy25gpWQyEP2cVMJ",
                12: "yYUjIY5L6w2ukD5FxCIVydgG",
                13: "PoqRXAEYHKTdqNY22lIFTXRp",
                14: "eAudypoJLJEtFZz3zzvKYoAu",
                15: "4b416MUjJEdZm5nDKwvn2ELO",
                16: "H6jadzxgw0uRVRHHadZ19Zvp",
                17: "5zG8Ioh6paBscdCgUQTQE0eu",
                18: "OgMX0PlDPabF3BHOgxDbeH2n",
                19: "uzK7eCjSVYDp4KvJEg6mC59r",
                20: "yapIY909O3cgcD8QDAEehtkb",
                21: "8KT1bEUCcvASfq0LXWN2nVe0",
                22: "3LKyDpL1Xt7YactKFGxFpJO7",
                23: "GMaOiZl6YeMzYckusbO4Cdh1",
                24: "5iZnMqviynz6ndlaikqhMy73",
                3: "lcpgaTLqkd6gRi8AVtVr0gLe",
                30: "xWGhFW6bvMf9LuGYqQOhoD2h",
                31: "GqMz69ka237zrG4H8bpMuYTy",
                37: "lYrk2xnelCQrhwmO43AtjErF",
                4: "wceshrwDAUvkTTLQZDgE1V5T",
                47: "PDA12fEHtYIVr6A12fZ86JQH",
                49: "RYn9wxADCbBgKeo8Lyxx1ZHE",
                5: "N3wOmgPMiK6RaGNYjeqOzuHU",
                50: "KwEXqYIZG8fOlJyePKTBiJFs",
                6: "fJMv7XtKbfsRbzkO42fkS3Dr",
                8: "915o8cwxF5rzfQsA1Op6hhQV"
            },
            leaderboard: {
                4: "fZ4M7Isi1rLz2cjAcBBLmQGI",
                16: "ZPwouCq7eD5kRnZjX5ct8ZIT",
                1: "sysnuL1RKPIEL98w2l6lPc1w",
                31: "FgHUFCWMZCCJaHKMF0LyIgSI",
                23: "eyGVQGQkrHwJRcLoBzepUHW2",
                14: "PeRnr3pCNPpCgJAOF3yuQCGg",
                37: "5DXFSCYcaAxAXBuZVpTHAx59",
                30: "MpHDUxZ178U65yD3l878z5m1",
                47: "oYQGytr0CbDDQqIooggCsNTO",
                18: "na3uJK58s0vgb7NyaPR6R5P8",
                50: "m3hskIBrmloAWHD7i27q2ZPN",
                3: "PIsUL8EJvXXA1thcFkCPWdhi",
                19: "cluKVL1thRZlb3bsK7oVadOZ",
                20: "8PPLwmi2mra9HNTdhftQOcC4",
                8: "cCQE4L5S1j9BmKeywuonM6hM",
                11: "uvkuS4QYv01YvuGoJvqa9xnz",
                12: "GyG0XHcaahKmsXbcjDlgtjCQ",
                17: "0ut5aHlZRj5dNfTKo9bM8nXj",
                10: "TzMO5iGdP4vt7BIOAQ2e3kpU",
                49: "f1vArQjoEfX9QdjK2TvBjnDv",
                22: "92kdBH3AxvPr1pqZ1h1TYkjN",
                13: "Y6Tl87JTAn9T1B8rq523UDeH",
                15: "B3HlKKIdq8mGyoMGkjT4m9RD",
                24: "nfS0DrtZtJ6eZVNqsWqyVVFS",
                5: "gr33qXeArxdqi0Sk4i50TmE3",
                6: "ACn0XyU2KP2l94N0HMf1vhlu",
                21: "o2PQGGTxXO92in2mASt624tn"
            },
            mobile_leaderboard: {
                4: "Ue573Dbj78H6RnJT1nlozaJY",
                16: "5X98AYdO2OAIb2m6ThLjCGR5",
                1: "nVDrFwfkiRg5Tb426duBnat4",
                31: "H8tpygATsgJwk7qJzh612B0I",
                23: "07iMij2dOIgPHzM7JFv5fYBN",
                14: "XCQLWETuRkKmiN9jCOu01NOp",
                37: "419OVNbGzLJn7wlh5jAiUFLA",
                30: "ErE9N4WozhjbawA6HFN2hC0V",
                47: "4aBsJtSPEivB07hrlV6nTgj7",
                18: "waksL4h4X7gn2TU88OgeZHHl",
                50: "Wi3BRMWcCUdKZO7leMhtCfdp",
                3: "KQ3P2qVndkjlesGkzM5Rknma",
                19: "OCsZIZrTXKyprJ8AKiI7e0Jl",
                20: "h2aMA8KeZ3tHtfRgwT2xCHUJ",
                8: "igvEPDF1ft8FBFQ2aVhCS0BG",
                11: "I1ZnJzEjRg75BZikcGMWxMTF",
                12: "ZrnW76G2qvB5pZx8VvOanqQQ",
                17: "B4f8YQfcg3WWl5k9pAnqVCfm",
                10: "cfNKknbTZxcxhNZCV2fWr4Ne",
                49: "ziBY1mSHWj9UTGcq9Tbzo5J4",
                22: "ImlLSALVeaqvi7y2e6qdBDkw",
                13: "NUx9OmJMlzbkv39hUX5FOnXv",
                15: "RxDq1opgeO5VXEQRPtdESHaX",
                24: "aswJxUjNpHyiEunaOUBGbajK",
                5: "1M1EIJhXdwEoJ8utYTDjj0DD",
                6: "gExvCBm9TEaw4jV6kRzEuDxq",
                21: "wNOOjIhadhe2s1jgq3LppWm0"
            },
            billboard: {
                4: "NO39pgf3BaqIgRZoZ5SvYMXf",
                16: "dr2IuY7Yb8POz9tbezoJUFey",
                1: "WhhFn8GL9nBEK2z9psbtD1SV",
                31: "JNfSIPKKAkfNgzkg3hrGlGEV",
                23: "xvsrS9J4xrRGjlus3pKkIatI",
                14: "4BL4a74RRMoiRu9D8jKAfdij",
                37: "f8B8j7tjb1YA6lAcnHSRBlfI",
                30: "vW1ODUqFt2jDk5laYsVh9PIF",
                47: "R7GldiHZEWYFwdJq936YnbZW",
                18: "83noJ3tAhRyFWDlS1iXKuRGa",
                50: "WNu1woAb2OHf3KncItSAnYnm",
                3: "Ydwhf5DPoJBinldgPdkD9okm",
                19: "3X7dNFFm484Xx6aD6nBF0k43",
                20: "qzLmNwSljh25A7s9HXQYVYtr",
                8: "tXWpZaKO291ytd8kfiy3NWlz",
                11: "0ePnxLUMZ8tKBxImFp2i1J4g",
                12: "Y1HuzbhxRv1UmUhd8dUtONQI",
                17: "lqSabVDWqYWy8jpJH57BK1vS",
                10: "zVEWUpJuNfEipDrTPGwniMP3",
                49: "B2srINo0hBkijyowlq4FQk7c",
                22: "Ljcylng1YDm5yAqEpiomGazZ",
                13: "hYTGyFgCiCUVtNOx56TkKexo",
                15: "5xkx65Y9eEhPen8gqIuOFQRZ",
                24: "ZH3Odxmz8QF49ZoZ16mPs08T",
                5: "Ax2noHPv7iRdW6DM26NxmtFT",
                6: "mZEu6Z0wDTq4UAHQoyUosm5y",
                21: "7bAgpwCip0dSf6bJXgBO6nY1"
            }
        }
          , G = [];
        function U(e, t) {
            var n, i, r;
            return (null === (i = null === (n = null == t ? void 0 : t.meta) || void 0 === n ? void 0 : n.advertiserDomains) || void 0 === i ? void 0 : i.length) > 0 && (null === (r = null == t ? void 0 : t.meta) || void 0 === r ? void 0 : r.advertiserDomains.find((function(e) {
                return function(e) {
                    return G.includes(e) || G.includes("www." + e) || e.includes("game")
                }(e)
            }
            ))) ? (console.warn("Blocked ad: ", t),
            0) : e
        }
        var q = function() {
            return q = Object.assign || function(e) {
                for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var r in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                return e
            }
            ,
            q.apply(this, arguments)
        }
          , Z = function(e, t, n) {
            if (n || 2 === arguments.length)
                for (var i, r = 0, o = t.length; r < o; r++)
                    !i && r in t || (i || (i = Array.prototype.slice.call(t, 0, r)),
                    i[r] = t[r]);
            return e.concat(i || Array.prototype.slice.call(t))
        }
          , F = parseInt(E("site_id"), 10) || 0
          , K = "desktop";
        k() ? K = "mobile" : w() && (K = "tablet");
        var Q = "rewarded"
          , N = "video"
          , X = {
            "728x90": "/21682198607/" + K + "_ingame_728x90/" + F + "_" + K + "_ingame_728x90",
            "300x250": "/21682198607/" + K + "_ingame_300x250/" + F + "_" + K + "_ingame_300x250",
            "970x250": "/21682198607/" + K + "_ingame_970x250/" + F + "_" + K + "_ingame_970x250",
            "160x600": "/21682198607/" + K + "_ingame_160x600/" + F + "_" + K + "_ingame_160x600",
            "320x50": "/21682198607/" + K + "_ingame_320x50/" + F + "_" + K + "_ingame_320x50",
            "728x90_external": "/21682198607/external_" + K + "_display_ingame/external_" + K + "_ingame_728x90",
            "300x250_external": "/21682198607/external_" + K + "_display_ingame/external_" + K + "_ingame_300x250",
            "970x250_external": "/21682198607/external_" + K + "_display_ingame/external_" + K + "_ingame_970x250",
            "160x600_external": "/21682198607/external_" + K + "_display_ingame/external_" + K + "_ingame_160x600",
            "320x50_external": "/21682198607/external_" + K + "_display_ingame/external_" + K + "_ingame_320x50"
        }
          , H = !1
          , V = function(e, t, n) {
            if (nt.prebidAvailable) {
                H = !0;
                var i = ["US", "CA", "AU"]
                  , r = function(e) {
                    var n, r = I() || k() || w() ? ["video/mp4", "application/javascript"] : ["video/mp4", "video/webm", "video/ogg", "application/javascript"], o = q(q({
                        mimes: r,
                        minduration: 0,
                        maxduration: 15,
                        protocols: [2, 3, 5, 6, 7, 8],
                        w: 640,
                        h: 480,
                        placement: 1,
                        linearity: 1
                    }, e ? {} : {
                        skip: 1,
                        skipafter: 5
                    }), {
                        boxingallowed: 1,
                        pos: 1,
                        api: [2]
                    });
                    return {
                        bids: Z(Z([{
                            bidder: "appnexus",
                            params: {
                                placementId: 13184250,
                                supplyType: "web"
                            }
                        }, {
                            bidder: "openx",
                            params: {
                                delDomain: "poki-d.openx.net",
                                unit: "540105196"
                            }
                        }, {
                            bidder: "spotx",
                            params: {
                                channel_id: "265590",
                                ad_unit: "instream",
                                secure: !0,
                                hide_skin: !0
                            }
                        }, {
                            bidder: "ix",
                            params: {
                                siteId: "436284",
                                video: {}
                            }
                        }, {
                            bidder: "richaudience",
                            params: {
                                pid: (n = F,
                                S[n] || "MP_gIE1VDieUi"),
                                supplyType: "site"
                            }
                        }, {
                            bidder: "onetag",
                            params: {
                                pubId: "6da09f566a9dc06"
                            }
                        }, {
                            bidder: "rubicon",
                            params: {
                                accountId: "18608",
                                siteId: "266914",
                                zoneId: "1322034",
                                position: "atf",
                                video: {
                                    size_id: 204
                                }
                            }
                        }, {
                            bidder: "pubmatic",
                            params: {
                                publisherId: "156838",
                                adSlot: "3607869@640x360"
                            }
                        }], i.includes(t) ? [{
                            bidder: "33across",
                            params: {
                                siteId: "aRJKVCig8r7ikZaKj0P0Le",
                                productId: "instream"
                            }
                        }] : [], !0), [{
                            bidder: "sharethrough",
                            params: {
                                pkey: "vRjLnZDA86biUVrjIKVGxq3x"
                            }
                        }, {
                            bidder: "triplelift",
                            params: {
                                inventoryCode: "Poki_Instream_Prebid",
                                video: q({}, o)
                            }
                        }], !1),
                        mediaTypes: {
                            video: q({
                                context: "instream",
                                playerSize: [640, 480]
                            }, o)
                        }
                    }
                }
                  , o = r(!0)
                  , a = r(!1)
                  , s = [{
                    code: N,
                    mediaTypes: a.mediaTypes,
                    bids: Z([], a.bids, !0)
                }, {
                    code: Q,
                    mediaTypes: o.mediaTypes,
                    bids: Z([], o.bids, !0)
                }, {
                    code: X["728x90"],
                    mediaTypes: {
                        banner: {
                            sizes: [[728, 90]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "12940427"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "539859872",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "268177",
                            size: [728, 90]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "1374895@728x90"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "204596",
                            zoneId: "1008080"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "1V6a2fgLvX",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.leaderboard[F] || L.leaderboard[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_HDX_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["300x250"],
                    mediaTypes: {
                        banner: {
                            sizes: [[300, 250]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "12935252"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "539859873",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "268178",
                            size: [300, 250]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "1374896@300x250"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "204596",
                            zoneId: "1008080"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "pKqNt5LyvF",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.skyscraper[F] || L.skyscraper[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_300x250_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["970x250"],
                    mediaTypes: {
                        banner: {
                            sizes: [[970, 250]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "20595278"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "543540497",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "597527",
                            size: [970, 250]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "3344351@970x250"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "yYyae7vnIh",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.rectangle[F] || L.rectangle[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_970x250_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["160x600"],
                    mediaTypes: {
                        banner: {
                            sizes: [[160, 600]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "12940425"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "539859871",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "268175",
                            size: [160, 600]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "1374893@160x600"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "204596",
                            zoneId: "1008080"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "rAEnPimPzC",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.billboard[F] || L.billboard[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_HDX_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["320x50"],
                    mediaTypes: {
                        banner: {
                            sizes: [[320, 50]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "20595224"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "543540495",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "597529",
                            size: [320, 50]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "3344350@320x50"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "204596",
                            zoneId: "1008080"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "1DP5EtcOip",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.skyscraper[F] || L.skyscraper[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_HDX_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["728x90_external"],
                    mediaTypes: {
                        banner: {
                            sizes: [[728, 90]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "20973406"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "543885656",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "268177",
                            placementId: "625562",
                            size: [728, 90]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "3457872"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "362566",
                            zoneId: "1962680-2"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "MP_gIE1VDieUi",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.billboard[F] || L.billboard[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_HDX_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["300x250_external"],
                    mediaTypes: {
                        banner: {
                            sizes: [[300, 250]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "20973408"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "543885657",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "625564",
                            size: [300, 250]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "3457874"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "362566",
                            zoneId: "1962680-15"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "MP_gIE1VDieUi",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.mobile_leaderboard[F] || L.mobile_leaderboard[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_300x250_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["970x250_external"],
                    mediaTypes: {
                        banner: {
                            sizes: [[970, 250]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "20973415"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "543885650",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "625560",
                            size: [970, 250]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "3457879"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "362566",
                            zoneId: "1962680-57"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "MP_gIE1VDieUi",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.leaderboard[F] || L.leaderboard[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_970x250_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["160x600_external"],
                    mediaTypes: {
                        banner: {
                            sizes: [[160, 600]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "20973407"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "543885653",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "625563",
                            size: [160, 600]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "3457877"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "362566",
                            zoneId: "1962680-9"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "MP_gIE1VDieUi",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.rectangle[F] || L.rectangle[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_HDX_Prebid"
                        }
                    }], !1)
                }, {
                    code: X["320x50_external"],
                    mediaTypes: {
                        banner: {
                            sizes: [[320, 50]]
                        }
                    },
                    bids: Z(Z([{
                        bidder: "appnexus",
                        params: {
                            placementId: "20973413"
                        }
                    }, {
                        bidder: "openx",
                        params: {
                            unit: "543885649",
                            delDomain: "poki-d.openx.net"
                        }
                    }, {
                        bidder: "ix",
                        params: {
                            siteId: "625559",
                            size: [320, 50]
                        }
                    }, {
                        bidder: "pubmatic",
                        params: {
                            publisherId: "156838",
                            adSlot: "3457875"
                        }
                    }, {
                        bidder: "rubicon",
                        params: {
                            accountId: "18608",
                            siteId: "362566",
                            zoneId: "1962680-43"
                        }
                    }, {
                        bidder: "onetag",
                        params: {
                            pubId: "6da09f566a9dc06"
                        }
                    }, {
                        bidder: "richaudience",
                        params: {
                            pid: "MP_gIE1VDieUi",
                            supplyType: "site"
                        }
                    }], i.includes(t) ? [{
                        bidder: "33across",
                        params: {
                            siteId: "aRJKVCig8r7ikZaKj0P0Le",
                            productId: "siab"
                        }
                    }] : [], !0), [{
                        bidder: "sharethrough",
                        params: {
                            pkey: L.mobile_leaderboard[F] || L.mobile_leaderboard[3]
                        }
                    }, {
                        bidder: "triplelift",
                        params: {
                            inventoryCode: "Poki_HDX_Prebid"
                        }
                    }], !1)
                }]
                  , d = {
                    debug: !1,
                    enableSendAllBids: !0,
                    usePrebidCache: !0,
                    bidderTimeout: 1500,
                    priceGranularity: {
                        buckets: [{
                            precision: 2,
                            min: .01,
                            max: 3,
                            increment: .01
                        }, {
                            precision: 2,
                            min: 3,
                            max: 8,
                            increment: .05
                        }, {
                            precision: 2,
                            min: 8,
                            max: 20,
                            increment: .5
                        }, {
                            precision: 2,
                            min: 20,
                            max: 45,
                            increment: 1
                        }]
                    },
                    currency: {
                        adServerCurrency: "EUR",
                        defaultRates: {
                            EUR: {
                                EUR: 1,
                                GBP: .86408,
                                USD: 1.2212
                            },
                            GBP: {
                                EUR: 1.157300249976854,
                                GBP: 1,
                                USD: 1.4132950652717342
                            },
                            USD: {
                                EUR: .8188666885031116,
                                GBP: .7075663282017687,
                                USD: 1
                            }
                        }
                    },
                    cache: {
                        url: "https://prebid.adnxs.com/pbc/v1/cache"
                    },
                    targetingControls: {
                        allowTargetingKeys: ["BIDDER", "AD_ID", "PRICE_BUCKET", "SIZE", "DEAL", "SOURCE", "FORMAT", "UUID", "CACHE_ID", "CACHE_HOST", "ADOMAIN"],
                        allowSendAllBidsTargetingKeys: ["BIDDER", "AD_ID", "PRICE_BUCKET", "SIZE", "DEAL", "SOURCE", "FORMAT", "UUID", "CACHE_ID", "CACHE_HOST", "ADOMAIN"]
                    },
                    userSync: {
                        filterSettings: {
                            all: {
                                bidders: "*",
                                filter: "include"
                            }
                        },
                        syncsPerBidder: 1e3,
                        syncDelay: 100,
                        userIds: [{
                            name: "pubCommonId",
                            storage: {
                                type: "cookie",
                                name: "poki_pubcid",
                                expires: 180
                            }
                        }]
                    }
                };
                window.pbjs.que.push((function() {
                    var i = q(q({
                        floors: {
                            data: {
                                currency: "EUR",
                                schema: {
                                    fields: ["mediaType"]
                                },
                                values: {
                                    banner: B(t),
                                    video: P(t)
                                }
                            }
                        }
                    }, d), e.config);
                    window.pbjs.addAdUnits(function(e, t, n) {
                        var i, r;
                        n = n.toUpperCase();
                        var o = null == t ? void 0 : t[n];
                        if (!o)
                            return e;
                        for (var a = 0; a <= e.length; a++)
                            for (var s = e[a], d = o[(null === (i = null == s ? void 0 : s.mediaTypes) || void 0 === i ? void 0 : i.video) ? "video" : "display"] || {}, c = (null === (r = null == s ? void 0 : s.bids) || void 0 === r ? void 0 : r.length) - 1; c >= 0; c--) {
                                var A = s.bids[c]
                                  , l = Math.random();
                                d[A.bidder] && l > d[A.bidder] && e[a].bids.splice(c, 1)
                            }
                        return e
                    }(e.adUnits || s, n, t)),
                    window.pbjs.setConfig(i);
                    var r = function(e, t) {
                        return 640 !== t.width && (e *= .95),
                        U(e, t)
                    };
                    window.pbjs.bidderSettings = {
                        appnexus: {
                            bidCpmAdjustment: U
                        },
                        openx: {
                            bidCpmAdjustment: U
                        },
                        spotx: {
                            bidCpmAdjustment: U
                        },
                        ix: {
                            bidCpmAdjustment: r
                        },
                        richaudience: {
                            bidCpmAdjustment: r
                        },
                        onetag: {
                            bidCpmAdjustment: U
                        },
                        rubicon: {
                            bidCpmAdjustment: U
                        },
                        pubmatic: {
                            bidCpmAdjustment: r
                        },
                        "33across": {
                            bidCpmAdjustment: U
                        },
                        sharethrough: {
                            bidCpmAdjustment: r
                        },
                        triplelift: {
                            bidCpmAdjustment: U
                        }
                    }
                }
                ))
            }
        }
          , W = !1
          , J = function(e, t, n, i) {
            if (window.apstag)
                try {
                    window.apstag.init(e.settings || q({
                        pubID: "e32f1423-28bc-43ed-8ab0-5ae6b4449cf8",
                        adServer: "googletag",
                        videoAdServer: "GAM"
                    }, n ? {
                        gdpr: {
                            cmpTimeout: 1e4
                        }
                    } : {}), (function() {
                        W = !function(e, t) {
                            var n, i;
                            t = t.toUpperCase();
                            var r = null === (i = null === (n = null == e ? void 0 : e[t]) || void 0 === n ? void 0 : n.video) || void 0 === i ? void 0 : i.amazon;
                            return !!r && Math.random() > r
                        }(i, t),
                        e.callback && e.callback()
                    }
                    ))
                } catch (e) {
                    window.apstag = void 0
                }
        }
          , Y = function() {
            !function() {
                if (!window.__tcfapi) {
                    var e = window.top
                      , t = {};
                    window.__tcfapi = function(n, i, r, o) {
                        var a = "" + Math.random()
                          , s = {
                            __tcfapiCall: {
                                command: n,
                                parameter: o,
                                version: i,
                                callId: a
                            }
                        };
                        t[a] = r,
                        e.postMessage(s, "*")
                    }
                    ,
                    window.addEventListener("message", (function(e) {
                        var n = {};
                        try {
                            n = "string" == typeof e.data ? JSON.parse(e.data) : e.data
                        } catch (e) {}
                        var i = n.__tcfapiReturn;
                        i && "function" == typeof t[i.callId] && (t[i.callId](i.returnValue, i.success),
                        t[i.callId] = null)
                    }
                    ), !1)
                }
            }(),
            window.pbjs.que.push((function() {
                window.pbjs.setConfig({
                    consentManagement: {
                        gdpr: {
                            cmpApi: "iab",
                            timeout: 8e3,
                            defaultGdprScope: !0
                        }
                    }
                })
            }
            ))
        }
          , $ = function() {
            !function() {
                if (!window.__uspapi) {
                    var e = window.top
                      , t = {};
                    window.__uspapi = function(n, i, r) {
                        var o = "" + Math.random()
                          , a = {
                            __uspapiCall: {
                                command: n,
                                version: i,
                                callId: o
                            }
                        };
                        t[o] = r,
                        e.postMessage(a, "*")
                    }
                    ,
                    window.addEventListener("message", (function(e) {
                        var n = e && e.data && e.data.__uspapiReturn;
                        n && n.callId && "function" == typeof t[n.callId] && (t[n.callId](n.returnValue, n.success),
                        t[n.callId] = null)
                    }
                    ), !1)
                }
            }(),
            window.pbjs.que.push((function() {
                window.pbjs.setConfig({
                    consentManagement: {
                        usp: {
                            cmpApi: "iab",
                            timeout: 8e3
                        }
                    }
                })
            }
            ))
        };
        function ee(e, t, n, r, o, s, d) {
            var c = s ? "nope" : t;
            if (window.pbjs && window.pbjs.que && window.pbjs.getConfig) {
                var A, l = y().split("?"), u = encodeURIComponent(l[0]), p = r ? Q : N, h = 0, m = function() {
                    var r, l, m, g;
                    if (!(--h > 0))
                        try {
                            a.dispatchEvent(i.ads.prebidRequested);
                            var f = window.pbjs.adUnits.filter((function(e) {
                                return e.code === p
                            }
                            ))[0];
                            if ("undefined" === f)
                                return console.error("Video-ad-unit not found, did you give it the adunit.code='video' value?"),
                                void e.requestAd(c);
                            var v = window.pbjs.adServers.dfp.buildVideoUrl({
                                adUnit: f,
                                params: {
                                    iu: E("iu", t),
                                    sz: "640x360|640x480",
                                    output: "vast",
                                    cust_params: n,
                                    description_url: u
                                }
                            })
                              , b = window.pbjs.getHighestCpmBids(p)
                              , y = void 0;
                            if (b.length > 0 && (y = b[0]),
                            window.pbjs.markWinningBidAsUsed({
                                adUnitCode: p
                            }),
                            A && (v = v.replace("cust_params=", "cust_params=" + A + "%26")),
                            y && (null === (l = null === (r = null == y ? void 0 : y.meta) || void 0 === r ? void 0 : r.advertiserDomains) || void 0 === l ? void 0 : l.length) > 0 && a.setDataAnnotations({
                                adDomain: y.meta.advertiserDomains.join(",")
                            }),
                            s) {
                                if (A) {
                                    var k = function(e) {
                                        var t = decodeURIComponent(e)
                                          , n = E("amznbid", t);
                                        if (!n)
                                            return null;
                                        var i = R[n];
                                        return i ? {
                                            bid: i,
                                            vast: "https://aax.amazon-adsystem.com/e/dtb/vast?b=" + E("amzniid", t) + "&rnd=" + Math.round(1e10 * Math.random()) + "&pp=" + n
                                        } : null
                                    }(A);
                                    k && (!y || !y.videoCacheKey || y.cpm < k.bid) && (y = {
                                        cpm: k.bid,
                                        vast: k.vast,
                                        bidder: "amazon",
                                        videoCacheKey: "amazon"
                                    })
                                }
                                if (1 !== d && (!y || !y.videoCacheKey || y.cpm < P(o))) {
                                    var w = 5;
                                    "ninja.io" !== (null === (m = null === window || void 0 === window ? void 0 : window.location) || void 0 === m ? void 0 : m.hostname) && "makeitmeme.com" !== (null === (g = null === window || void 0 === window ? void 0 : window.location) || void 0 === g ? void 0 : g.hostname) || (w = function(e) {
                                        return "US" === e ? 6.1 : x.includes(e) ? .5 : C.includes(e) ? .15 : T.includes(e) ? .08 : _.includes(e) ? .03 : .02
                                    }(o)),
                                    y = {
                                        cpm: w,
                                        vast: z(),
                                        bidder: "poki",
                                        videoCacheKey: "poki"
                                    }
                                }
                                if (!y || !y.videoCacheKey)
                                    return void a.dispatchEvent(1 === d ? i.ads.video.error : i.ads.completed);
                                switch (y.bidder) {
                                case "onetag":
                                    v = "https://onetag-sys.com/invocation/?key=" + y.videoCacheKey;
                                    break;
                                case "rubicon":
                                    v = "https://prebid-server.rubiconproject.com/cache?uuid=" + y.videoCacheKey;
                                    break;
                                case "spotx":
                                    v = "https://search.spotxchange.com/ad/vast.html?key=" + y.videoCacheKey;
                                    break;
                                case "amazon":
                                case "poki":
                                    v = y.vast;
                                    break;
                                default:
                                    v = "https://prebid.adnxs.com/pbc/v1/cache?uuid=" + y.videoCacheKey
                                }
                                j({
                                    event: "video-ready",
                                    bidder: null == y ? void 0 : y.bidder,
                                    bid: null == y ? void 0 : y.cpm
                                }),
                                a.setDataAnnotations({
                                    p4d_game_id: et.gameId,
                                    p4d_version_id: et.versionId,
                                    bidder: null == y ? void 0 : y.bidder,
                                    bid: null == y ? void 0 : y.cpm
                                })
                            }
                            a.setDataAnnotations({
                                pokiAdServer: s,
                                adTagUrl: v
                            }),
                            y ? a.setDataAnnotations({
                                prebidBidder: null == y ? void 0 : y.bidder,
                                prebidBid: null == y ? void 0 : y.cpm
                            }) : a.setDataAnnotations({
                                prebidBidder: void 0,
                                prebidBid: void 0
                            }),
                            e.requestAd(v)
                        } catch (t) {
                            e.requestAd(c)
                        }
                };
                if (W && h++,
                H && h++,
                W)
                    try {
                        window.apstag.fetchBids({
                            slots: [{
                                slotID: r ? "Rewarded" : "Midroll",
                                mediaType: "video"
                            }],
                            timeout: 1500
                        }, (function(e) {
                            e.length > 0 && (A = e[0].encodedQsParams),
                            m()
                        }
                        ))
                    } catch (e) {
                        m()
                    }
                s && j({
                    event: "video-request"
                }),
                H && window.pbjs.que.push((function() {
                    window.pbjs.requestBids({
                        adUnitCodes: [p],
                        bidsBackHandler: function() {
                            m()
                        }
                    })
                }
                ))
            } else
                e.requestAd(c)
        }
        function te() {
            var e, t = (null === (e = null === window || void 0 === window ? void 0 : window.location) || void 0 === e ? void 0 : e.hostname) || "";
            return "yes" === E("poki-ad-server") ? (console.log("DEBUG: Only running Poki-ad-server"),
            !0) : "localhost" !== t && "game-cdn.poki.com" !== t && !t.endsWith(".poki-gdn.com") && ("ninja.io" === t ? Math.random() <= .5 : "venge.io" === t && Math.random() <= .05)
        }
        var ne = function() {
            function e(e, t) {
                void 0 === t && (t = {}),
                this.retries = 0,
                this.running = !1,
                this.ima = e,
                this.siteID = t.siteID || 3,
                this.country = t.country || "ZZ",
                this.usePokiAdserver = te(),
                this.totalRetries = t.totalRetries || d.waterfallRetries || 1,
                this.timing = t.timing || new A(d.adTiming),
                a.addEventListener(i.ads.video.error, this.moveThroughWaterfall.bind(this)),
                a.addEventListener(i.ads.video.loaderError, this.moveThroughWaterfall.bind(this)),
                a.addEventListener(i.ads.ready, this.timing.stopWaterfallTimer.bind(this.timing)),
                a.addEventListener(i.ads.started, this.stopWaterfall.bind(this))
            }
            return e.prototype.moveThroughWaterfall = function() {
                if (this.runningBackfill)
                    return this.runningBackfill = !1,
                    void a.dispatchEvent(i.ads.error, {
                        message: "Backfilling failed",
                        rewardAllowed: !0
                    });
                if (!1 !== this.running) {
                    var e = this.totalRetries;
                    if (this.timing.stopWaterfallTimer(),
                    this.retries < e)
                        return this.timing.nextWaterfallTimer(),
                        void this.requestAd();
                    if (this.running = !1,
                    this.timing.resetWaterfallTimerIdx(),
                    this.rewarded) {
                        var t = z();
                        a.setDataAnnotations({
                            pokiAdServer: !0,
                            adTagUrl: t,
                            bidder: "poki",
                            bid: 0
                        }),
                        j({
                            event: "video-request"
                        }),
                        this.ima.requestAd(t),
                        this.runningBackfill = !0
                    } else
                        a.dispatchEvent(i.ads.error, {
                            message: "No ads",
                            rewardAllowed: !0
                        })
                }
            }
            ,
            e.prototype.cutOffWaterfall = function() {
                this.ima.tearDown(),
                this.moveThroughWaterfall()
            }
            ,
            e.prototype.buildAdUnitPaths = function(e) {
                if (E("noFill"))
                    return ["junk", "junk"];
                if (r.debug) {
                    var t = "/21682198607/debug-video/";
                    return e === i.ads.position.rewarded ? [t + "debug-video-rewarded"] : e === i.ads.position.preroll ? [t + "debug-video-preroll"] : [t + "debug-video-midroll"]
                }
                var n = "desktop"
                  , o = "midroll";
                k() ? n = "mobile" : w() && (n = "tablet"),
                e === i.ads.position.rewarded && (o = "rewarded");
                var a = "/21682198607/";
                return nt.GetIsPokiIFrame() ? ["" + a + n + "_ingame_" + o + "_1/" + this.siteID + "_" + n + "_ingame_" + o + "_1", "" + a + n + "_ingame_" + o + "_2/" + this.siteID + "_" + n + "_ingame_" + o + "_2"] : [a + "external_" + n + "_video_1/external_" + n + "_ingame_" + o + "_1", a + "external_" + n + "_video_2/external_" + n + "_ingame_" + o + "_2"]
            }
            ,
            e.prototype.start = function(e, t) {
                void 0 === e && (e = {}),
                this.running = !0,
                this.retries = 0,
                this.criteria = e,
                this.timing.resetWaterfallTimerIdx(),
                this.rewarded = t === i.ads.position.rewarded,
                this.adUnitPaths = this.buildAdUnitPaths(t),
                this.requestAd()
            }
            ,
            e.prototype.requestAd = function() {
                this.timing.startWaterfallTimer(this.cutOffWaterfall.bind(this)),
                this.retries++,
                this.criteria.waterfall = this.retries,
                this.runningBackfill = !1;
                var e = (this.retries - 1) % this.adUnitPaths.length
                  , t = this.adUnitPaths[e]
                  , n = "https://securepubads.g.doubleclick.net/gampad/ads?sz=640x360|640x480&iu=" + t + "&ciu_szs&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url={url}&description_url={descriptionUrl}&correlator={timestamp}";
                nt.consentString && nt.consentString.length > 0 && (this.criteria.consent_string = nt.consentString);
                var r = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) > 970;
                this.criteria.billboards_fit = r ? "yes" : "no";
                var o, s, d = function(e) {
                    var t = y().split("?")
                      , n = encodeURIComponent(t[0]);
                    return (e = e.split("{descriptionUrl}").join(n)).split("{timestamp}").join((new Date).getTime().toString())
                }(n) + (o = this.criteria,
                s = "",
                Object.keys(o).forEach((function(e) {
                    if (Object.prototype.hasOwnProperty.call(o, e)) {
                        var t = o[e];
                        Array.isArray(t) && (t = t.join()),
                        s += e + "=" + t + "&"
                    }
                }
                )),
                "&cust_params=" + (s = encodeURIComponent(s)) + "&");
                nt.childDirected && (d += "&tfcd=1"),
                nt.nonPersonalized && (d += "&npa=1"),
                a.setDataAnnotations({
                    adUnitPath: t,
                    adTagUrl: d,
                    waterfall: this.retries,
                    size: "640x360v"
                }),
                a.dispatchEvent(i.ads.requested),
                this.usePokiAdserver ? (console.debug("adRequest started with Prebid Video enabled (" + this.retries + "/" + this.totalRetries + ")"),
                ee(this.ima, d, this.criteria, this.rewarded, this.country, !0, this.retries)) : 1 === this.retries ? (console.debug("adRequest started with Prebid Video enabled (" + this.retries + "/" + this.totalRetries + ")"),
                ee(this.ima, d, this.criteria, this.rewarded, this.country, !1, this.retries)) : (console.debug("adRequest started in plain mode (" + this.retries + "/" + this.totalRetries + ")"),
                this.ima.requestAd(d))
            }
            ,
            e.prototype.isRunning = function() {
                return this.running
            }
            ,
            e.prototype.stopWaterfall = function() {
                this.running = !1,
                this.timing.stopWaterfallTimer(),
                this.timing.resetWaterfallTimerIdx()
            }
            ,
            e
        }();
        const ie = ne;
        var re = "pokiSdkContainer"
          , oe = "pokiSdkFixed"
          , ae = "pokiSdkOverlay"
          , se = "pokiSdkHidden"
          , de = "pokiSdkInsideContainer"
          , ce = "pokiSdkPauseButton"
          , Ae = "pokiSdkPauseButtonBG"
          , le = "pokiSdkStartAdButton"
          , ue = "pokiSdkProgressBar"
          , pe = "pokiSdkProgressContainer"
          , he = "pokiSdkSpinnerContainer"
          , me = "pokiSdkVideoContainer"
          , ge = "pokiSdkVisible"
          , fe = "pokiSDKAdContainer";
        var ve = function(e, t, n) {
            if (n || 2 === arguments.length)
                for (var i, r = 0, o = t.length; r < o; r++)
                    !i && r in t || (i || (i = Array.prototype.slice.call(t, 0, r)),
                    i[r] = t[r]);
            return e.concat(i || Array.prototype.slice.call(t))
        };
        const be = function() {
            function e(e) {
                var t = this;
                if (this.hideElement = function(e) {
                    e.classList.add(se),
                    e.classList.remove(ge)
                }
                ,
                this.showElement = function(e) {
                    e.classList.add(ge),
                    e.classList.remove(se)
                }
                ,
                this.progressFaker = new ye((function(e) {
                    return t.updateProgressBar(e)
                }
                )),
                this.progressFaker.queueFakeProgress(10, 1e3, i.ads.prebidRequested),
                this.progressFaker.queueFakeProgress(20, 2e3, i.ads.started),
                this.createElements(e.wrapper),
                "undefined" != typeof window && document) {
                    var n = document.createElement("style");
                    n.innerHTML = "\n.pokiSdkContainer {\n\toverflow: hidden;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 1000;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n}\n\n.pokiSdkContainer.pokiSdkFixed {\n\tposition: fixed;\n}\n\n.pokiSdkContainer.pokiSdkVisible {\n\tdisplay: block;\n}\n\n.pokiSdkContainer.pokiSdkHidden,\n.pokiSdkSpinnerContainer.pokiSdkHidden {\n\tdisplay: none;\n}\n\n.pokiSdkContainer.pokiSdkHidden,\n.pokiSdkSpinnerContainer {\n\tpointer-events: none;\n}\n\n.pokiSdkSpinnerContainer {\n\tz-index: 10;\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground: url('https://a.poki.com/images/thumb_anim_2x.gif') 50% 50% no-repeat;\n\tuser-select: none;\n}\n\n.pokiSdkInsideContainer {\n\tbackground: #000;\n\tposition: relative;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tdisplay: flex;\n\tflex-direction: column;\n\n\topacity: 0;\n\t-webkit-transition: opacity 0.5s ease-in-out;\n\t-moz-transition: opacity 0.5s ease-in-out;\n\t-ms-transition: opacity 0.5s ease-in-out;\n\t-o-transition: opacity 0.5s ease-in-out;\n\ttransition: opacity 0.5s ease-in-out;\n}\n\n.pokiSdkContainer.pokiSdkVisible .pokiSdkInsideContainer {\n\topacity: 1;\n}\n\n.pokiSDKAdContainer, .pokiSdkVideoContainer {\n\tposition: absolute;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.pokiSdkStartAdButton {\n\tposition: absolute;\n\tz-index: 9999;\n\ttop: 0;\n\n\tpadding-top: 10%;\n\twidth: 100%;\n\theight: 100%;\n\ttext-align: center;\n\tcolor: #FFF;\n\n\tfont: 700 15pt 'Arial', sans-serif;\n\tfont-weight: bold;\n\tletter-spacing: 1px;\n\ttransition: 0.1s ease-in-out;\n\tline-height: 1em;\n}\n\n.pokiSdkPauseButton {\n\tcursor:pointer;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    z-index: 1;\n}\n\n.pokiSdkPauseButton:before {\n\tcontent: '';\n\tposition: absolute;\n\twidth: 100px;\n\theight: 100px;\n\tdisplay: block;\n\tborder: 2px solid #fff;\n\tborder-radius: 50%;\n\tuser-select: none;\n\tbackground-color: rgba(0, 0, 0, 0.6);\n\ttransition: background-color 0.5s ease;\n\tanimation: 1s linear infinite pulse;\n}\n\n.pokiSdkPauseButton:after {\n\tcontent: '';\n\tposition: absolute;\n\tdisplay: block;\n\tbox-sizing: border-box;\n\tborder-color: transparent transparent transparent #fff;\n\tborder-style: solid;\n\tborder-width: 26px 0 26px 40px;\n\tpointer-events: none;\n\tanimation: 1s linear infinite pulse;\n\tleft: 6px;\n}\n.pokiSdkPauseButtonBG {\n    position: fixed;\n    top: 0;\n    left: 0;\n    display: block;\n    content: '';\n    background: rgba(0, 43, 80, 0.5);\n    width: 100%;\n    height: 100%;\n}\n\n.pokiSdkPauseButtonBG:hover{\n\tbackground: rgba(0, 43, 80, 0.7);\n}\n\n@keyframes pulse {\n\t0% {\n\t\ttransform: translate(-50%, -50%) scale(0.95);\n\t}\n\t70% {\n\t\ttransform: translate(-50%, -50%) scale(1.1);\n\t}\n\t100% {\n\t\ttransform: translate(-50%, -50%) scale(0.95);\n\t}\n}\n\n.pokiSdkProgressContainer {\n\tbackground: #B8C7DD;\n\twidth: 100%;\n\theight: 5px;\n\tposition: absolute;\n\tbottom: 0;\n\tz-index: 9999;\n}\n\n.pokiSdkProgressBar {\n\tposition:relative;\n\tbottom:0px;\n\tbackground: #FFDC00;\n\theight: 100%;\n\twidth: 0%;\n\ttransition: width 0.5s;\n\ttransition-timing-function: linear;\n}\n\n.pokiSdkProgressBar.pokiSdkVisible, .pokiSdkPauseButton.pokiSdkVisible, .pokiSdkStartAdButton.pokiSdkVisible {\n\tdisplay: block;\n\tpointer-events: auto;\n}\n\n.pokiSdkProgressBar.pokiSdkHidden, .pokiSdkPauseButton.pokiSdkHidden, .pokiSdkStartAdButton.pokiSdkHidden {\n\tdisplay: none;\n\tpointer-events: none;\n}\n",
                    document.head.appendChild(n)
                }
            }
            return e.prototype.updateProgressBar = function(e) {
                this.progressBar.style.width = e + "%"
            }
            ,
            e.prototype.setupEvents = function(e) {
                this.internalSDK = e
            }
            ,
            e.prototype.hide = function() {
                this.hideElement(this.containerDiv),
                this.hideElement(this.progressContainer),
                this.hidePauseButton(),
                this.hideElement(this.startAdButton),
                this.containerDiv.classList.remove(ae),
                this.progressBar.style.width = "0%",
                this.progressFaker.reset()
            }
            ,
            e.prototype.hideSpinner = function() {
                this.hideElement(this.spinnerContainer)
            }
            ,
            e.prototype.show = function() {
                this.containerDiv.classList.add(ae),
                this.showElement(this.containerDiv),
                this.showElement(this.spinnerContainer),
                this.showElement(this.progressContainer),
                this.progressFaker.start()
            }
            ,
            e.prototype.getVideoBounds = function() {
                return this.adContainer.getBoundingClientRect()
            }
            ,
            e.prototype.getAdContainer = function() {
                return this.adContainer
            }
            ,
            e.prototype.getVideoContainer = function() {
                return this.videoContainer
            }
            ,
            e.prototype.showPauseButton = function() {
                this.showElement(this.pauseButton),
                this.internalSDK && this.pauseButton.addEventListener("click", this.internalSDK.resumeAd.bind(this.internalSDK))
            }
            ,
            e.prototype.hidePauseButton = function() {
                this.hideElement(this.pauseButton),
                this.internalSDK && this.pauseButton.removeEventListener("click", this.internalSDK.resumeAd.bind(this.internalSDK))
            }
            ,
            e.prototype.showStartAdButton = function() {
                this.showElement(this.startAdButton),
                this.internalSDK && this.startAdButton.addEventListener("click", this.internalSDK.startAdClicked.bind(this.internalSDK))
            }
            ,
            e.prototype.hideStartAdButton = function() {
                this.hideElement(this.startAdButton),
                this.internalSDK && this.startAdButton.removeEventListener("click", this.internalSDK.startAdClicked.bind(this.internalSDK))
            }
            ,
            e.prototype.createElements = function(e) {
                var t = this;
                this.containerDiv = document.createElement("div"),
                this.insideContainer = document.createElement("div"),
                this.pauseButton = document.createElement("div"),
                this.pauseButtonBG = document.createElement("div"),
                this.startAdButton = document.createElement("div"),
                this.progressBar = document.createElement("div"),
                this.progressContainer = document.createElement("div"),
                this.spinnerContainer = document.createElement("div"),
                this.adContainer = document.createElement("div"),
                this.videoContainer = document.createElement("video"),
                this.adContainer.id = "pokiSDKAdContainer",
                this.videoContainer.id = "pokiSDKVideoContainer",
                this.containerDiv.className = re,
                this.insideContainer.className = de,
                this.pauseButton.className = ce,
                this.pauseButtonBG.className = Ae,
                this.pauseButton.appendChild(this.pauseButtonBG),
                this.startAdButton.className = le,
                this.startAdButton.innerHTML = "Tap anywhere to play ad",
                this.progressBar.className = ue,
                this.progressContainer.className = pe,
                this.spinnerContainer.className = he,
                this.adContainer.className = fe,
                this.videoContainer.className = me,
                this.hide(),
                this.videoContainer.setAttribute("playsinline", "playsinline"),
                this.videoContainer.setAttribute("muted", "muted"),
                this.containerDiv.appendChild(this.insideContainer),
                this.containerDiv.appendChild(this.spinnerContainer),
                this.insideContainer.appendChild(this.progressContainer),
                this.insideContainer.appendChild(this.videoContainer),
                this.insideContainer.appendChild(this.adContainer),
                this.containerDiv.appendChild(this.pauseButton),
                this.containerDiv.appendChild(this.startAdButton),
                this.progressContainer.appendChild(this.progressBar);
                var n = e || null
                  , i = function() {
                    if (n || (n = document.body),
                    n)
                        if (n.appendChild(t.containerDiv),
                        n === document.body)
                            t.containerDiv.classList.add(oe);
                        else {
                            var e = window.getComputedStyle(n).position;
                            e && -1 !== ["absolute", "fixed", "relative"].indexOf(e) || (n.style.position = "relative")
                        }
                    else
                        window.requestAnimationFrame(i)
                };
                !n || n instanceof HTMLElement || (n = null,
                console.error("POKI-SDK: wrapper is not a HTMLElement, falling back to document.body")),
                i()
            }
            ,
            e
        }();
        var ye = function() {
            function e(e) {
                var t = this;
                this.storedQueue = [],
                this.progressCallback = e,
                this.reset(),
                a.addEventListener(i.ads.video.progress, (function(e) {
                    var n = 100 - t.currentProgress
                      , i = e.currentTime / e.duration * n;
                    i < n && t.progressCallback(t.currentProgress + i)
                }
                )),
                this.initializeNoProgressFix()
            }
            return e.prototype.queueFakeProgress = function(e, t, n) {
                var i = this;
                this.storedQueue.push({
                    progressToFake: e,
                    duration: t,
                    stopEvent: n
                }),
                a.addEventListener(n, (function() {
                    i.eventWatcher[n] = !0,
                    i.currentProgress = i.startProgress + e,
                    i.startProgress = i.currentProgress,
                    i.progressCallback(i.currentProgress),
                    i.activeQueue.shift(),
                    i.activeQueue.length > 0 ? i.continue() : i.pause()
                }
                ))
            }
            ,
            e.prototype.fakeProgress = function(e, t, n) {
                this.activeQueue.push({
                    progressToFake: e,
                    duration: t,
                    stopEvent: n
                }),
                this.fakeProgressEvents = !0,
                this.continue()
            }
            ,
            e.prototype.start = function() {
                this.activeQueue.length > 0 || (this.activeQueue = ve([], this.storedQueue, !0),
                this.active = !0,
                this.continue())
            }
            ,
            e.prototype.continue = function() {
                if (this.activeQueue.length > 0 && !this.tickInterval) {
                    this.startTime = Date.now();
                    this.tickInterval = window.setInterval(this.tick.bind(this), 50),
                    this.active = !0
                }
            }
            ,
            e.prototype.pause = function() {
                this.clearInterval()
            }
            ,
            e.prototype.tick = function() {
                var e = this.activeQueue[0]
                  , t = Date.now() - this.startTime
                  , n = Math.min(t / e.duration, 1);
                this.currentProgress = this.startProgress + e.progressToFake * n,
                this.fakeProgressEvents && a.dispatchEvent(i.ads.video.progress, {
                    duration: e.duration / 1e3,
                    currentTime: t / 1e3
                }),
                this.progressCallback(this.currentProgress),
                (this.eventWatcher[e.stopEvent] || 1 === n) && this.pause()
            }
            ,
            e.prototype.clearInterval = function() {
                this.tickInterval && (clearInterval(this.tickInterval),
                this.tickInterval = 0)
            }
            ,
            e.prototype.initializeNoProgressFix = function() {
                var e = this;
                a.addEventListener(i.ads.started, (function(t) {
                    e.progressWatcherTimeout = window.setTimeout((function() {
                        if (e.active) {
                            var n = 100 - e.currentProgress
                              , r = 1e3 * t.duration - 1e3;
                            e.fakeProgress(n, r, i.ads.completed)
                        }
                    }
                    ), 1e3)
                }
                )),
                a.addEventListener(i.ads.video.progress, (function() {
                    e.progressWatcherTimeout && (clearTimeout(e.progressWatcherTimeout),
                    e.progressWatcherTimeout = 0)
                }
                ))
            }
            ,
            e.prototype.reset = function() {
                this.eventWatcher = {},
                this.startProgress = 0,
                this.startTime = 0,
                this.currentProgress = 0,
                this.activeQueue = [],
                this.active = !1,
                this.fakeProgressEvents = !1,
                this.clearInterval()
            }
            ,
            e
        }()
          , ke = !0
          , we = {};
        function Ee() {
            if (document.body && document.body.appendChild) {
                var e = document.createElement("iframe");
                e.style.display = "none",
                document.body.appendChild(e),
                e.contentWindow && (window.pokiKeysChanged = new Map,
                e.contentWindow.document.open(),
                e.contentWindow.document.write("<script>\nconst lsKey = 'poki_lsexpire';\nconst lifetime = 1000*60*60*24*30*6;\n\nwindow.addEventListener('storage', function(event) {\n\ttry {\n\t\tconst key = event.key;\n\n\t\t// key is null when localStorage.clear() is called.\n\t\tif (key === null) {\n\t\t\tlocalStorage.removeItem(lsKey);\n\t\t\treturn;\n\t\t}\n\n\t\tif (key === lsKey) return;\n\n\t\tconst updates = JSON.parse(localStorage.getItem(lsKey)) || {};\n\n\t\t// newValue is null when localStorage.removeItem() is called.\n\t\tif (event.newValue === null) {\n\t\t\tdelete updates[key];\n\n\t\t\t// window.parent is the game itself. This code is executed in\n\t\t\t// an iframe without src which makes it the same context as it's parent\n\t\t\t// which makes it save to access the parent's properties.\n\t\t\twindow.parent.pokiKeysChanged.set(key, 'remove');\n\t\t} else {\n\t\t\tupdates[key] = Date.now();\n\t\t\twindow.parent.pokiKeysChanged.set(key, 'set');\n\t\t}\n\t\tlocalStorage.setItem(lsKey, JSON.stringify(updates));\n\t} catch (e) {}\n});\n\nfunction expire() {\n\tconst updates = JSON.parse(localStorage.getItem(lsKey)) || {};\n\tconst expireBefore = Date.now() - lifetime;\n\tvar removed = false;\n\n\tObject.keys(updates).map(function(key) {\n\t\tif (updates[key] < expireBefore) {\n\t\t\tlocalStorage.removeItem(key);\n\t\t\tdelete updates[key];\n\t\t\tremoved = true;\n\t\t}\n\t});\n\n\tif (removed) {\n\t\tlocalStorage.setItem(lsKey, JSON.stringify(updates));\n\t}\n}\n\ntry {\n\texpire();\n} catch (e) {}\n<\/script>"),
                e.contentWindow.document.close())
            } else
                document.addEventListener("DOMContentLoaded", Ee)
        }
        var Ie = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO"];
        function Se(e) {
            return Ie.includes(e)
        }
        var xe = function(e, t, n, i) {
            return new (n || (n = Promise))((function(r, o) {
                function a(e) {
                    try {
                        d(i.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function s(e) {
                    try {
                        d(i.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function d(e) {
                    var t;
                    e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function(e) {
                        e(t)
                    }
                    ))).then(a, s)
                }
                d((i = i.apply(e, t || [])).next())
            }
            ))
        }
          , Ce = function(e, t) {
            var n, i, r, o, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0])
                        throw r[1];
                    return r[1]
                },
                trys: [],
                ops: []
            };
            return o = {
                next: s(0),
                throw: s(1),
                return: s(2)
            },
            "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
            }
            ),
            o;
            function s(o) {
                return function(s) {
                    return function(o) {
                        if (n)
                            throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (n = 1,
                                i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i),
                                0) : i.next) && !(r = r.call(i, o[1])).done)
                                    return r;
                                switch (i = 0,
                                r && (o = [2 & o[0], r.value]),
                                o[0]) {
                                case 0:
                                case 1:
                                    r = o;
                                    break;
                                case 4:
                                    return a.label++,
                                    {
                                        value: o[1],
                                        done: !1
                                    };
                                case 5:
                                    a.label++,
                                    i = o[1],
                                    o = [0];
                                    continue;
                                case 7:
                                    o = a.ops.pop(),
                                    a.trys.pop();
                                    continue;
                                default:
                                    if (!(r = a.trys,
                                    (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                        a.label = o[1];
                                        break
                                    }
                                    if (6 === o[0] && a.label < r[1]) {
                                        a.label = r[1],
                                        r = o;
                                        break
                                    }
                                    if (r && a.label < r[2]) {
                                        a.label = r[2],
                                        a.ops.push(o);
                                        break
                                    }
                                    r[2] && a.ops.pop(),
                                    a.trys.pop();
                                    continue
                                }
                                o = t.call(e, a)
                            } catch (e) {
                                o = [6, e],
                                i = 0
                            } finally {
                                n = r = 0
                            }
                        if (5 & o[0])
                            throw o[1];
                        return {
                            value: o[0] ? o[1] : void 0,
                            done: !0
                        }
                    }([o, s])
                }
            }
        };
        const Te = function() {
            function e(e) {
                var t = this;
                this.bannerTimeout = null,
                this.allowedToPlayAd = !1,
                this.runningAd = !1,
                this.completeOnce = !1,
                this.currentWidth = 640,
                this.currentHeight = 480,
                this.currentRequestIsMuted = !1,
                this.volume = 1,
                this.canWeAutoPlayWithSound = function() {
                    return xe(t, void 0, void 0, (function() {
                        return Ce(this, (function(e) {
                            switch (e.label) {
                            case 0:
                                if (!this.blankVideo)
                                    return [2, !1];
                                e.label = 1;
                            case 1:
                                return e.trys.push([1, 3, , 4]),
                                [4, this.blankVideo.play()];
                            case 2:
                                return e.sent(),
                                [2, !0];
                            case 3:
                                return e.sent(),
                                [2, !1];
                            case 4:
                                return [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                this.videoElement = document.getElementById("pokiSDKVideoContainer"),
                this.adsManager = null,
                this.volume = e,
                this.initAdDisplayContainer(),
                this.initBlankVideo(),
                this.initAdsLoader()
            }
            return e.prototype.initAdDisplayContainer = function() {
                this.adDisplayContainer || window.google && (this.adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById("pokiSDKAdContainer"),this.videoElement))
            }
            ,
            e.prototype.initBlankVideo = function() {
                this.blankVideo = document.createElement("video"),
                this.blankVideo.setAttribute("playsinline", "playsinline");
                var e = document.createElement("source");
                e.src = "data:video/mp4;base64, AAAAHGZ0eXBNNFYgAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARwAAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8mKAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4GSAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZvgL8DJIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACOAAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgCvAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6AnwMkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr3N0c2QAAAAAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+EAFWdCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAAAAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABCUAAARBAAAEXQAABHAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAAAFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAACAAAAAAAABDcAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAAAAAAPgbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZAAAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAAAAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFgICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAAAAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAAIAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgAAAAEAAAABAAAABwAAAAIAAAABAAAACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAAEAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAAAABAAAAEQAAAAEAAAABAAAAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAAIAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAAAGwAAAAIAAAABAAAAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAADMAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAAAAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAAAEZwAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTUuMzMuMTAw",
                this.blankVideo.appendChild(e)
            }
            ,
            e.prototype.initAdsLoader = function() {
                var e = this;
                this.adsLoader || window.google && (this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer),
                this.adsLoader.getSettings().setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE),
                this.adsLoader.getSettings().setDisableCustomPlaybackForIOS10Plus(!0),
                this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded, !1, this),
                this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdLoaderError, !1, this),
                this.videoElement.addEventListener("onended", (function() {
                    return e.adsLoader.contentComplete()
                }
                )))
            }
            ,
            e.prototype.requestAd = function(e) {
                return xe(this, void 0, void 0, (function() {
                    var t;
                    return Ce(this, (function(n) {
                        switch (n.label) {
                        case 0:
                            return this.runningAd ? [2] : (this.runningAd = !0,
                            this.completeOnce = !0,
                            this.adDisplayContainer.initialize(),
                            this.videoElement.src = "",
                            (t = new google.ima.AdsRequest).adTagUrl = e,
                            t.linearAdSlotWidth = this.currentWidth,
                            t.linearAdSlotHeight = this.currentHeight,
                            t.nonLinearAdSlotWidth = this.currentWidth,
                            t.nonLinearAdSlotHeight = this.currentHeight,
                            t.forceNonLinearFullSlot = !0,
                            [4, this.canWeAutoPlayWithSound()]);
                        case 1:
                            return n.sent() ? (t.setAdWillPlayMuted(!1),
                            this.currentRequestIsMuted = !1) : (t.setAdWillPlayMuted(!0),
                            this.currentRequestIsMuted = !0),
                            this.allowedToPlayAd = !0,
                            this.adsLoader.requestAds(t),
                            [2]
                        }
                    }
                    ))
                }
                ))
            }
            ,
            e.prototype.resize = function(e, t, n) {
                void 0 === n && (n = google.ima.ViewMode.NORMAL),
                this.currentWidth = e,
                this.currentHeight = t,
                this.adsManager && this.adsManager.resize(e, t, n)
            }
            ,
            e.prototype.onAdsManagerLoaded = function(e) {
                var t = new google.ima.AdsRenderingSettings;
                t.enablePreloading = !0,
                t.restoreCustomPlaybackStateOnAdBreakComplete = !0,
                t.mimeTypes = I() || k() || w() ? ["video/mp4"] : ["video/mp4", "video/webm", "video/ogg"],
                t.loadVideoTimeout = 8e3,
                this.adsManager = e.getAdsManager(this.videoElement, t),
                this.adsManager.setVolume(Math.max(0, Math.min(1, this.volume))),
                this.currentRequestIsMuted && this.adsManager.setVolume(0),
                this.allowedToPlayAd ? (this.attachAdEvents(),
                a.dispatchEvent(i.ads.ready)) : this.tearDown()
            }
            ,
            e.prototype.setVolume = function(e) {
                this.volume = e,
                this.adsManager && this.adsManager.setVolume(Math.max(0, Math.min(1, this.volume)))
            }
            ,
            e.prototype.startPlayback = function() {
                try {
                    this.adsManager.init(this.currentWidth, this.currentHeight, google.ima.ViewMode.NORMAL),
                    this.adsManager.start()
                } catch (e) {
                    this.videoElement.play()
                }
            }
            ,
            e.prototype.startIOSPlayback = function() {
                this.adsManager.start()
            }
            ,
            e.prototype.stopPlayback = function() {
                a.dispatchEvent(i.ads.stopped),
                this.tearDown()
            }
            ,
            e.prototype.resumeAd = function() {
                a.dispatchEvent(i.ads.video.resumed),
                this.adsManager && this.adsManager.resume()
            }
            ,
            e.prototype.tearDown = function() {
                this.adsManager && (this.adsManager.stop(),
                this.adsManager.destroy(),
                this.adsManager = null),
                null !== this.bannerTimeout && (clearTimeout(this.bannerTimeout),
                this.bannerTimeout = null),
                this.adsLoader && (this.adsLoader.contentComplete(),
                this.adsLoader.destroy(),
                this.adsLoader = null,
                this.initAdsLoader()),
                this.completeOnce = !1,
                this.runningAd = !1
            }
            ,
            e.prototype.attachAdEvents = function() {
                var e = this
                  , t = google.ima.AdEvent.Type;
                this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, !1, this),
                [t.AD_PROGRESS, t.ALL_ADS_COMPLETED, t.CLICK, t.COMPLETE, t.IMPRESSION, t.PAUSED, t.SKIPPED, t.STARTED, t.USER_CLOSE, t.AD_BUFFERING].forEach((function(t) {
                    e.adsManager.addEventListener(t, e.onAdEvent, !1, e)
                }
                ))
            }
            ,
            e.prototype.onAdEvent = function(e) {
                var t = this
                  , n = e.getAd();
                switch (e.type) {
                case google.ima.AdEvent.Type.AD_PROGRESS:
                    a.dispatchEvent(i.ads.video.progress, e.getAdData());
                    break;
                case google.ima.AdEvent.Type.STARTED:
                    e.remainingTime = this.adsManager.getRemainingTime(),
                    e.remainingTime <= 0 && (e.remainingTime = 15),
                    n.isLinear() || (this.bannerTimeout = window.setTimeout((function() {
                        t.completeOnce && (t.completeOnce = !1,
                        a.dispatchEvent(i.ads.completed, {
                            rewardAllowed: !!e.rewardAllowed
                        })),
                        t.tearDown()
                    }
                    ), 1e3 * (e.remainingTime + 1))),
                    a.setDataAnnotations({
                        creativeId: n.getCreativeId()
                    }),
                    a.dispatchEvent(i.ads.started, {
                        duration: n.getDuration()
                    });
                    break;
                case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                case google.ima.AdEvent.Type.COMPLETE:
                    this.completeOnce && (this.completeOnce = !1,
                    a.dispatchEvent(i.ads.completed, {
                        rewardAllowed: !0
                    })),
                    this.tearDown();
                    break;
                case google.ima.AdEvent.Type.USER_CLOSE:
                    this.completeOnce && (this.completeOnce = !1,
                    a.dispatchEvent(i.ads.completed, {
                        rewardAllowed: !1
                    })),
                    this.tearDown();
                    break;
                case google.ima.AdEvent.Type.PAUSED:
                    this.adsManager.pause(),
                    a.dispatchEvent(i.ads.video.paused);
                    break;
                case google.ima.AdEvent.Type.AD_BUFFERING:
                    a.dispatchEvent(i.ads.video.buffering);
                    break;
                case google.ima.AdEvent.Type.CLICK:
                    a.dispatchEvent(i.ads.video.clicked);
                    break;
                case google.ima.AdEvent.Type.SKIPPED:
                    a.dispatchEvent(i.ads.skipped),
                    this.completeOnce && (this.completeOnce = !1,
                    a.dispatchEvent(i.ads.completed, {
                        rewardAllowed: !0
                    })),
                    document.activeElement && document.activeElement.blur();
                    break;
                case google.ima.AdEvent.Type.IMPRESSION:
                    a.dispatchEvent(i.ads.impression, {
                        creativeId: n.getCreativeId()
                    })
                }
            }
            ,
            e.prototype.onAdLoaderError = function(e) {
                this.tearDown();
                var t = null == e ? void 0 : e.getError()
                  , n = (null == t ? void 0 : t.toString()) || "Unknown"
                  , r = (null == t ? void 0 : t.getErrorCode()) || 0;
                a.dispatchEvent(i.ads.video.loaderError, {
                    message: n,
                    errorCode: r
                })
            }
            ,
            e.prototype.onAdError = function(e) {
                this.tearDown();
                var t = null == e ? void 0 : e.getError()
                  , n = (null == t ? void 0 : t.toString()) || "Unknown"
                  , r = (null == t ? void 0 : t.getErrorCode()) || 0;
                a.dispatchEvent(i.ads.video.error, {
                    message: n,
                    errorCode: r
                })
            }
            ,
            e.prototype.muteAd = function() {
                void 0 !== this.adsManager && null != this.adsManager && this.adsManager.setVolume(0)
            }
            ,
            e.prototype.isAdRunning = function() {
                return this.runningAd
            }
            ,
            e
        }();
        const _e = function(e) {
            return new Promise((function(t, n) {
                var i = document.createElement("script");
                i.type = "text/javascript",
                i.async = !0,
                i.src = e;
                var r = function() {
                    i.readyState && "loaded" !== i.readyState && "complete" !== i.readyState || (t(),
                    i.onload = null,
                    i.onreadystatechange = null)
                };
                i.onload = r,
                i.onreadystatechange = r,
                i.onerror = n,
                document.head.appendChild(i)
            }
            ))
        };
        var Be = function(e, t, n, i) {
            return new (n || (n = Promise))((function(r, o) {
                function a(e) {
                    try {
                        d(i.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function s(e) {
                    try {
                        d(i.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function d(e) {
                    var t;
                    e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function(e) {
                        e(t)
                    }
                    ))).then(a, s)
                }
                d((i = i.apply(e, t || [])).next())
            }
            ))
        }
          , Pe = function(e, t) {
            var n, i, r, o, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0])
                        throw r[1];
                    return r[1]
                },
                trys: [],
                ops: []
            };
            return o = {
                next: s(0),
                throw: s(1),
                return: s(2)
            },
            "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
            }
            ),
            o;
            function s(o) {
                return function(s) {
                    return function(o) {
                        if (n)
                            throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (n = 1,
                                i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i),
                                0) : i.next) && !(r = r.call(i, o[1])).done)
                                    return r;
                                switch (i = 0,
                                r && (o = [2 & o[0], r.value]),
                                o[0]) {
                                case 0:
                                case 1:
                                    r = o;
                                    break;
                                case 4:
                                    return a.label++,
                                    {
                                        value: o[1],
                                        done: !1
                                    };
                                case 5:
                                    a.label++,
                                    i = o[1],
                                    o = [0];
                                    continue;
                                case 7:
                                    o = a.ops.pop(),
                                    a.trys.pop();
                                    continue;
                                default:
                                    if (!(r = a.trys,
                                    (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                        a.label = o[1];
                                        break
                                    }
                                    if (6 === o[0] && a.label < r[1]) {
                                        a.label = r[1],
                                        r = o;
                                        break
                                    }
                                    if (r && a.label < r[2]) {
                                        a.label = r[2],
                                        a.ops.push(o);
                                        break
                                    }
                                    r[2] && a.ops.pop(),
                                    a.trys.pop();
                                    continue
                                }
                                o = t.call(e, a)
                            } catch (e) {
                                o = [6, e],
                                i = 0
                            } finally {
                                n = r = 0
                            }
                        if (5 & o[0])
                            throw o[1];
                        return {
                            value: o[0] ? o[1] : void 0,
                            done: !0
                        }
                    }([o, s])
                }
            }
        };
        const De = function() {
            var e = window.location.pathname;
            "/" !== e[0] && (e = "/" + e);
            var t = encodeURIComponent(window.location.protocol + "//" + window.location.host + e + window.location.search)
              , n = encodeURIComponent(document.referrer);
            return fetch("json/null.json?https://devs-api.poki.com/gameinfo/@sdk?href=" + t + "&referrer=" + n, {
                method: "GET",
                headers: {
                    "Content-Type": "text/plain"
                }
            }).then((function(e) {
                return Be(void 0, void 0, void 0, (function() {
                    var t;
                    return Pe(this, (function(n) {
                        switch (n.label) {
                        case 0:
                            return e.status >= 200 && e.status < 400 ? [4, e.json()] : [3, 2];
                        case 1:
                            return (t = n.sent()).game_id ? [2, {
                                gameId: t.game_id,
                                adTiming: {
                                    preroll: t.ad_settings.preroll,
                                    timePerTry: t.ad_settings.time_per_try,
                                    timeBetweenAds: t.ad_settings.time_between_ads,
                                    startAdsAfter: t.ad_settings.start_ads_after
                                }
                            }] : [2, void 0];
                        case 2:
                            throw e
                        }
                    }
                    ))
                }
                ))
            }
            )).catch((function(e) {
                return function(e) {
                    return Be(this, void 0, void 0, (function() {
                        var t, n, i, r, o, a, s, d, c, A, l, u;
                        return Pe(this, (function(p) {
                            switch (p.label) {
                            case 0:
                                return p.trys.push([0, 3, , 4]),
                                "/" !== (t = window.location.pathname)[0] && (t = "/" + t),
                                r = (i = JSON).stringify,
                                A = {
                                    c: "sdk-p4d-error",
                                    ve: 7
                                },
                                l = {
                                    k: "error"
                                },
                                a = (o = JSON).stringify,
                                u = {
                                    status: e.status
                                },
                                (s = e.json) ? [4, e.json()] : [3, 2];
                            case 1:
                                s = p.sent(),
                                p.label = 2;
                            case 2:
                                if (n = r.apply(i, [(A.d = [(l.v = a.apply(o, [(u.json = s,
                                u.body = JSON.stringify({
                                    href: window.location.protocol + "//" + window.location.host + t + window.location.search
                                }),
                                u.name = e.name,
                                u.message = e.message,
                                u)]),
                                l)],
                                A)]),
                                d = "https://t.poki.io/l",
                                navigator.sendBeacon)
                                    navigator.sendBeacon(d, n);
                                else
                                    try {
                                        (c = new XMLHttpRequest).open("POST", d, !0),
                                        c.send(n)
                                    } catch (e) {}
                                return [3, 4];
                            case 3:
                                return p.sent(),
                                [3, 4];
                            case 4:
                                return [2]
                            }
                        }
                        ))
                    }
                    ))
                }(e)
            }
            ))
        };
        var je = function(e, t, n, i) {
            return new (n || (n = Promise))((function(r, o) {
                function a(e) {
                    try {
                        d(i.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function s(e) {
                    try {
                        d(i.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function d(e) {
                    var t;
                    e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function(e) {
                        e(t)
                    }
                    ))).then(a, s)
                }
                d((i = i.apply(e, t || [])).next())
            }
            ))
        }
          , ze = function(e, t) {
            var n, i, r, o, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0])
                        throw r[1];
                    return r[1]
                },
                trys: [],
                ops: []
            };
            return o = {
                next: s(0),
                throw: s(1),
                return: s(2)
            },
            "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
            }
            ),
            o;
            function s(o) {
                return function(s) {
                    return function(o) {
                        if (n)
                            throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (n = 1,
                                i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i),
                                0) : i.next) && !(r = r.call(i, o[1])).done)
                                    return r;
                                switch (i = 0,
                                r && (o = [2 & o[0], r.value]),
                                o[0]) {
                                case 0:
                                case 1:
                                    r = o;
                                    break;
                                case 4:
                                    return a.label++,
                                    {
                                        value: o[1],
                                        done: !1
                                    };
                                case 5:
                                    a.label++,
                                    i = o[1],
                                    o = [0];
                                    continue;
                                case 7:
                                    o = a.ops.pop(),
                                    a.trys.pop();
                                    continue;
                                default:
                                    if (!(r = a.trys,
                                    (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                        a.label = o[1];
                                        break
                                    }
                                    if (6 === o[0] && a.label < r[1]) {
                                        a.label = r[1],
                                        r = o;
                                        break
                                    }
                                    if (r && a.label < r[2]) {
                                        a.label = r[2],
                                        a.ops.push(o);
                                        break
                                    }
                                    r[2] && a.ops.pop(),
                                    a.trys.pop();
                                    continue
                                }
                                o = t.call(e, a)
                            } catch (e) {
                                o = [6, e],
                                i = 0
                            } finally {
                                n = r = 0
                            }
                        if (5 & o[0])
                            throw o[1];
                        return {
                            value: o[0] ? o[1] : void 0,
                            done: !0
                        }
                    }([o, s])
                }
            }
        };
        function Re() {
            return je(this, void 0, Promise, (function() {
                var e, t, n, i;
                return ze(this, (function(r) {
                    switch (r.label) {
                    case 0:
                        return r.trys.push([0, 3, , 4]),
                        [4, fetch("json/geo.json?https://geo.poki.io/", {
                            method: "GET",
                            headers: {
                                "Content-Type": "text/plain"
                            }
                        })];
                    case 1:
                        return [4, r.sent().json()];
                    case 2:
                        return e = r.sent(),
                        t = e.ISO,
                        n = e.ccpaApplies,
                        [2, {
                            ISO: t,
                            ccpaApplies: n
                        }];
                    case 3:
                        return i = r.sent(),
                        console.error(i),
                        [2, {
                            ISO: "ZZ",
                            ccpaApplies: !1
                        }];
                    case 4:
                        return [2]
                    }
                }
                ))
            }
            ))
        }
        var Me = function(e, t, n, i) {
            return new (n || (n = Promise))((function(r, o) {
                function a(e) {
                    try {
                        d(i.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function s(e) {
                    try {
                        d(i.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function d(e) {
                    var t;
                    e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function(e) {
                        e(t)
                    }
                    ))).then(a, s)
                }
                d((i = i.apply(e, t || [])).next())
            }
            ))
        }
          , Oe = function(e, t) {
            var n, i, r, o, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0])
                        throw r[1];
                    return r[1]
                },
                trys: [],
                ops: []
            };
            return o = {
                next: s(0),
                throw: s(1),
                return: s(2)
            },
            "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
            }
            ),
            o;
            function s(o) {
                return function(s) {
                    return function(o) {
                        if (n)
                            throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (n = 1,
                                i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i),
                                0) : i.next) && !(r = r.call(i, o[1])).done)
                                    return r;
                                switch (i = 0,
                                r && (o = [2 & o[0], r.value]),
                                o[0]) {
                                case 0:
                                case 1:
                                    r = o;
                                    break;
                                case 4:
                                    return a.label++,
                                    {
                                        value: o[1],
                                        done: !1
                                    };
                                case 5:
                                    a.label++,
                                    i = o[1],
                                    o = [0];
                                    continue;
                                case 7:
                                    o = a.ops.pop(),
                                    a.trys.pop();
                                    continue;
                                default:
                                    if (!(r = a.trys,
                                    (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                        a.label = o[1];
                                        break
                                    }
                                    if (6 === o[0] && a.label < r[1]) {
                                        a.label = r[1],
                                        r = o;
                                        break
                                    }
                                    if (r && a.label < r[2]) {
                                        a.label = r[2],
                                        a.ops.push(o);
                                        break
                                    }
                                    r[2] && a.ops.pop(),
                                    a.trys.pop();
                                    continue
                                }
                                o = t.call(e, a)
                            } catch (e) {
                                o = [6, e],
                                i = 0
                            } finally {
                                n = r = 0
                            }
                        if (5 & o[0])
                            throw o[1];
                        return {
                            value: o[0] ? o[1] : void 0,
                            done: !0
                        }
                    }([o, s])
                }
            }
        };
        function Le() {
            var e, t;
            return Me(this, void 0, Promise, (function() {
                var n, i, r, o, a;
                return Oe(this, (function(s) {
                    switch (s.label) {
                    case 0:
                        if ("undefined" == typeof window || "test" === (null === (t = null === (e = null === window || void 0 === window ? void 0 : window.process) || void 0 === e ? void 0 : e.env) || void 0 === t ? void 0 : t.NODE_ENV))
                            return [2, {
                                blocklist: [],
                                countryExclusion: [],
                                bidderLimitation: {}
                            }];
                        s.label = 1;
                    case 1:
                        return s.trys.push([1, 4, , 5]),
                        [4, fetch("json/settings.json?https://api.poki.com/ads/settings", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                    case 2:
                        return [4, s.sent().json()];
                    case 3:
                        return n = s.sent(),
                        i = n.blocklist,
                        r = n.country_exclusion,
                        o = n.bidder_limitation,
                        [2, {
                            blocklist: (null == i ? void 0 : i.split(/[\r\n]+/)) || [],
                            countryExclusion: (r.split(",") || []).map((function(e) {
                                return e.toUpperCase()
                            }
                            )),
                            bidderLimitation: JSON.parse(o || "{}")
                        }];
                    case 4:
                        return a = s.sent(),
                        console.error(a),
                        [2, {
                            blocklist: [],
                            countryExclusion: [],
                            bidderLimitation: {}
                        }];
                    case 5:
                        return [2]
                    }
                }
                ))
            }
            ))
        }
        var Ge = function(e, t, n, i) {
            return new (n || (n = Promise))((function(r, o) {
                function a(e) {
                    try {
                        d(i.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function s(e) {
                    try {
                        d(i.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function d(e) {
                    var t;
                    e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function(e) {
                        e(t)
                    }
                    ))).then(a, s)
                }
                d((i = i.apply(e, t || [])).next())
            }
            ))
        }
          , Ue = function(e, t) {
            var n, i, r, o, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0])
                        throw r[1];
                    return r[1]
                },
                trys: [],
                ops: []
            };
            return o = {
                next: s(0),
                throw: s(1),
                return: s(2)
            },
            "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
            }
            ),
            o;
            function s(o) {
                return function(s) {
                    return function(o) {
                        if (n)
                            throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (n = 1,
                                i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i),
                                0) : i.next) && !(r = r.call(i, o[1])).done)
                                    return r;
                                switch (i = 0,
                                r && (o = [2 & o[0], r.value]),
                                o[0]) {
                                case 0:
                                case 1:
                                    r = o;
                                    break;
                                case 4:
                                    return a.label++,
                                    {
                                        value: o[1],
                                        done: !1
                                    };
                                case 5:
                                    a.label++,
                                    i = o[1],
                                    o = [0];
                                    continue;
                                case 7:
                                    o = a.ops.pop(),
                                    a.trys.pop();
                                    continue;
                                default:
                                    if (!(r = a.trys,
                                    (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                        a.label = o[1];
                                        break
                                    }
                                    if (6 === o[0] && a.label < r[1]) {
                                        a.label = r[1],
                                        r = o;
                                        break
                                    }
                                    if (r && a.label < r[2]) {
                                        a.label = r[2],
                                        a.ops.push(o);
                                        break
                                    }
                                    r[2] && a.ops.pop(),
                                    a.trys.pop();
                                    continue
                                }
                                o = t.call(e, a)
                            } catch (e) {
                                o = [6, e],
                                i = 0
                            } finally {
                                n = r = 0
                            }
                        if (5 & o[0])
                            throw o[1];
                        return {
                            value: o[0] ? o[1] : void 0,
                            done: !0
                        }
                    }([o, s])
                }
            }
        }
          , qe = !1
          , Ze = function() {
            return Ge(void 0, void 0, void 0, (function() {
                var e, t, n;
                return Ue(this, (function(i) {
                    switch (i.label) {
                    case 0:
                        if (qe)
                            return [2];
                        i.label = 1;
                    case 1:
                        return i.trys.push([1, 4, , 5]),
                        [4, fetch("./touchControllerConfig.json")];
                    case 2:
                        return [4, i.sent().json()];
                    case 3:
                        return (e = i.sent()) && ((t = document.createElement("script")).src = "//game-cdn.poki.com/scripts/touchOverlayController.js",
                        t.onload = function() {
                            new window.OverlayController(document.body,e)
                        }
                        ,
                        document.head.appendChild(t),
                        qe = !0),
                        [3, 5];
                    case 4:
                        return n = i.sent(),
                        console.log(n),
                        [3, 5];
                    case 5:
                        return [2]
                    }
                }
                ))
            }
            ))
        };
        const Fe = function() {
            for (var e = Math.floor(Date.now() / 1e3), t = "", n = 0; n < 4; n++)
                t = String.fromCharCode(255 & e) + t,
                e >>= 8;
            if (window.crypto && crypto.getRandomValues && Uint32Array) {
                var i = new Uint32Array(12);
                crypto.getRandomValues(i);
                for (n = 0; n < 12; n++)
                    t += String.fromCharCode(255 & i[n])
            } else
                for (n = 0; n < 12; n++)
                    t += String.fromCharCode(Math.floor(256 * Math.random()));
            return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
        };
        var Ke = function() {
            function e() {
                this.slotMap = new Map
            }
            return e.prototype.waitUntilReady = function(e) {
                window.googletag.cmd.push((function() {
                    nt.prebidAvailable ? window.pbjs.que.push((function() {
                        e()
                    }
                    )) : e()
                }
                ))
            }
            ,
            e.prototype.enforceChildSafety = function() {
                googletag.cmd.push((function() {
                    googletag.pubads().setPrivacySettings({
                        underAgeOfConsent: !0,
                        childDirectedTreatment: !0,
                        restrictDataProcessing: !0
                    })
                }
                ))
            }
            ,
            e.prototype.callOnCanDestroy = function(e) {
                !e.onCanDestroyCalled && e.onCanDestroy && (e.onCanDestroyCalled = !0,
                e.onCanDestroy())
            }
            ,
            e.prototype.setupSlotRenderEndedListener = function() {
                var e = this;
                this.waitUntilReady((function() {
                    window.googletag.pubads().addEventListener("slotRenderEnded", (function(t) {
                        var n, r, o, a, s = t.slot.getSlotElementId(), d = e.slotMap.get(s);
                        if (d && d.gptSlot) {
                            var c = t.slot || {}
                              , A = (null === (n = c.getResponseInformation) || void 0 === n ? void 0 : n.call(c)) || {}
                              , l = A.isBackfill
                              , u = A.lineItemId
                              , p = A.campaignId
                              , h = function(e) {
                                if (!e || "function" != typeof e.indexOf)
                                    return null;
                                if (-1 !== e.indexOf("amazon-adsystem.com/aax2/apstag"))
                                    return null;
                                var t = new RegExp('(?:(?:pbjs\\.renderAd\\(document,|adId:*|hb_adid":\\[)|(?:pbadid=)|(?:adId=))[\'"](.*?)["\']',"gi")
                                  , n = e.replace(/ /g, "")
                                  , i = t.exec(n);
                                return i && i[1] || null
                            }(null === (o = (r = c).getHtml) || void 0 === o ? void 0 : o.call(r))
                              , m = !!h
                              , g = d.pbjsTargetting || {}
                              , f = g.hb_bidder
                              , v = g.hb_adomain
                              , b = function(e) {
                                var t, n = {
                                    cpm: 0
                                };
                                if (void 0 === window.pbjs || !nt.prebidAvailable)
                                    return n;
                                var i = window.pbjs.getAllWinningBids() || [];
                                return ((null === (t = window.pbjs.getBidResponsesForAdUnitCode(e)) || void 0 === t ? void 0 : t.bids) || []).forEach((function(e) {
                                    !i.find((function(t) {
                                        return t.adId === e.adId
                                    }
                                    )) && e.cpm > n.cpm && (n = e)
                                }
                                )),
                                n
                            }(d.adUnitPath)
                              , y = t.isEmpty
                              , k = parseFloat(g.hb_pb);
                            isNaN(k) && (k = void 0),
                            at.track(i.tracking.ads.display.impression, {
                                size: d.size,
                                opportunityId: d.opportunityId,
                                duringGameplay: null === (a = d.duringGameplayFn) || void 0 === a ? void 0 : a.call(d),
                                adUnitPath: d.adUnitPath,
                                prebidBid: k,
                                prebidBidder: f,
                                prebidWon: m,
                                prebidSecondBid: b.cpm > 0 ? b.cpm : void 0,
                                prebidSecondBidder: b.bidder,
                                dfpIsBackfill: l,
                                dfpLineItemId: u,
                                dfpCampaignId: p,
                                isEmpty: y,
                                adDomain: v
                            }),
                            y && e.callOnCanDestroy(d)
                        }
                    }
                    )),
                    window.googletag.pubads().addEventListener("impressionViewable", (function(t) {
                        var n = t.slot.getSlotElementId()
                          , i = e.slotMap.get(n);
                        i && setTimeout((function() {
                            e.callOnCanDestroy(i)
                        }
                        ), 1e3 * Math.random())
                    }
                    ))
                }
                ))
            }
            ,
            e.prototype.validateDisplaySettings = function(e) {
                return k() || w() ? ["320x50"].includes(e) : ["970x250", "300x250", "728x90", "160x600", "320x50"].includes(e)
            }
            ,
            e.prototype.getDisplaySlotConfig = function(e) {
                var t = e.split("x").map((function(e) {
                    return parseInt(e, 10)
                }
                ))
                  , n = "/21682198607/debug-display/debug-display-" + e
                  , i = "desktop";
                k() ? i = "mobile" : w() && (i = "tablet");
                var o = parseInt(E("site_id"), 10) || 0;
                return r.debug || (n = nt.GetIsPokiIFrame() ? "/21682198607/" + i + "_ingame_" + e + "/" + o + "_" + i + "_ingame_" + e : "/21682198607/external_" + i + "_display_ingame/external_" + i + "_ingame_" + e),
                {
                    id: "poki-" + Fe(),
                    adUnitPath: n,
                    size: e,
                    width: t[0],
                    height: t[1],
                    refresh: !1,
                    onCanDestroyCalled: !1
                }
            }
            ,
            e.prototype.renderIGDAd = function(e, t, n, i, r, o) {
                var a = this
                  , s = this.getIGDSlotID(e);
                s && this.slotMap.get(s) && (console.error("displayAd called with a container that already contains an ad"),
                this.clearIGDAd(e));
                var d = this.getDisplaySlotConfig(t);
                this.slotMap.set(d.id, d),
                d.opportunityId = i,
                d.duringGameplayFn = r,
                d.onCanDestroy = o,
                setTimeout((function() {
                    a.callOnCanDestroy(d)
                }
                ), 6e3);
                var c = document.createElement("div");
                c.id = d.id,
                c.className = "poki-ad-slot",
                c.style.width = d.width + "px",
                c.style.height = d.height + "px",
                c.style.overflow = "hidden",
                c.style.position = "relative",
                c.setAttribute("data-poki-ad-size", d.size),
                e.appendChild(c),
                e.setAttribute("data-poki-ad-id", d.id),
                d.intersectionObserver = new window.IntersectionObserver((function(e) {
                    var t;
                    e[0].isIntersecting && (null === (t = d.intersectionObserver) || void 0 === t || t.disconnect(),
                    a.waitUntilReady((function() {
                        var e = a.slotMap.get(d.id);
                        e && e.opportunityId === i && (a.setupGPT(d, n),
                        a.requestAd(d))
                    }
                    )))
                }
                ),{
                    threshold: 1
                }),
                d.intersectionObserver.observe(c)
            }
            ,
            e.prototype.setupGPT = function(e, t) {
                var n;
                e.gptSlot = window.googletag.defineSlot(e.adUnitPath, [e.width, e.height], e.id).addService(window.googletag.pubads()),
                window.googletag.enableServices(),
                null === (n = e.gptSlot) || void 0 === n || n.clearTargeting(),
                Object.keys(t).forEach((function(n) {
                    var i;
                    null === (i = e.gptSlot) || void 0 === i || i.setTargeting(n, t[n])
                }
                ))
            }
            ,
            e.prototype.requestAd = function(e) {
                var t;
                at.track(i.tracking.ads.display.requested, {
                    size: e.size,
                    opportunityId: e.opportunityId,
                    adUnitPath: e.adUnitPath,
                    refresh: e.refresh,
                    duringGameplay: null === (t = e.duringGameplayFn) || void 0 === t ? void 0 : t.call(e)
                });
                var n = 0
                  , r = function() {
                    --n > 0 || (window.apstag && window.apstag.setDisplayBids(),
                    nt.prebidAvailable && (window.pbjs.setTargetingForGPTAsync([e.adUnitPath]),
                    e.pbjsTargetting = window.pbjs.getAdserverTargetingForAdUnitCode([e.adUnitPath])),
                    window.googletag.display(e.id))
                };
                if (window.apstag && n++,
                nt.prebidAvailable && n++,
                window.apstag)
                    try {
                        window.apstag.fetchBids({
                            slots: [{
                                slotName: e.adUnitPath,
                                slotID: e.id,
                                sizes: [[e.width, e.height]]
                            }],
                            timeout: 1500
                        }, (function() {
                            r()
                        }
                        ))
                    } catch (e) {
                        r()
                    }
                nt.prebidAvailable && window.pbjs.requestBids({
                    adUnitCodes: [e.adUnitPath],
                    bidsBackHandler: function() {
                        r()
                    }
                }),
                window.apstag || nt.prebidAvailable || r()
            }
            ,
            e.prototype.clearIGDAd = function(e) {
                var t, n = this.getIGDSlotID(e);
                if (n) {
                    var r = this.slotMap.get(n) || null;
                    if (r) {
                        for (r.onCanDestroy && !r.onCanDestroyCalled && console.error("destroyAd called without waiting for onCanDestroy"),
                        at.track(i.tracking.screen.destroyAd, {
                            opportunityId: r.opportunityId,
                            okToDestroy: r.onCanDestroyCalled
                        }),
                        null === (t = r.intersectionObserver) || void 0 === t || t.disconnect(),
                        r.gptSlot && googletag.destroySlots([r.gptSlot]); e.lastChild; )
                            e.removeChild(e.lastChild);
                        e.removeAttribute("data-poki-ad-id"),
                        this.slotMap.delete(r.id)
                    }
                } else
                    console.error("destroyAd called on a container without ad")
            }
            ,
            e.prototype.getIGDSlotID = function(e) {
                if (!e)
                    return null;
                var t = e.getAttribute("data-poki-ad-id");
                return t || null
            }
            ,
            e
        }();
        const Qe = Ke;
        var Ne, Xe = (Ne = function(e, t) {
            return Ne = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var n in t)
                    Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
            }
            ,
            Ne(e, t)
        }
        ,
        function(e, t) {
            if ("function" != typeof t && null !== t)
                throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
            function n() {
                this.constructor = e
            }
            Ne(e, t),
            e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype,
            new n)
        }
        ), He = function(e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return Xe(t, e),
            t.prototype.waitUntilReady = function(e) {
                window.pbjs.que.push((function() {
                    e()
                }
                ))
            }
            ,
            t.prototype.requestAd = function(e) {
                var t = this;
                j({
                    event: "request",
                    size: e.size,
                    opportunityId: e.opportunityId,
                    adUnitPath: e.adUnitPath
                });
                var n = 1
                  , i = function() {
                    --n > 0 || t.allBidsBack(e.id)
                };
                if (window.apstag) {
                    n++;
                    try {
                        window.apstag.fetchBids({
                            slots: [{
                                slotName: e.adUnitPath,
                                slotID: e.id,
                                sizes: [[e.width, e.height]]
                            }],
                            timeout: 1500
                        }, (function(t) {
                            t && t.length > 0 && (e.amznTargetting = t[0]),
                            i()
                        }
                        ))
                    } catch (e) {
                        i()
                    }
                }
                window.pbjs.requestBids({
                    adUnitCodes: [e.adUnitPath],
                    bidsBackHandler: function() {
                        e.pbjsTargetting = window.pbjs.getAdserverTargetingForAdUnitCode([e.adUnitPath]),
                        i()
                    }
                })
            }
            ,
            t.prototype.allBidsBack = function(e) {
                var t, n, r, o, a = this, s = this.slotMap.get(e);
                if (s) {
                    var d = document.createElement("iframe");
                    d.setAttribute("frameborder", "0"),
                    d.setAttribute("scrolling", "no"),
                    d.setAttribute("marginheight", "0"),
                    d.setAttribute("marginwidth", "0"),
                    d.setAttribute("topmargin", "0"),
                    d.setAttribute("leftmargin", "0"),
                    d.setAttribute("allowtransparency", "true"),
                    d.setAttribute("width", "" + s.width),
                    d.setAttribute("height", "" + s.height);
                    var c = document.getElementById(s.id);
                    if (c) {
                        c.appendChild(d);
                        var A = null === (t = null == d ? void 0 : d.contentWindow) || void 0 === t ? void 0 : t.document;
                        if (!A)
                            return console.error("IGD error - iframe injection for ad failed", e),
                            void this.clearIGDAd(c.parentNode);
                        var l = !0
                          , u = s.pbjsTargetting.hb_bidder
                          , p = parseFloat(s.pbjsTargetting.hb_pb);
                        isNaN(p) && (p = 0);
                        var h, m, g = (h = null === (n = null == s ? void 0 : s.amznTargetting) || void 0 === n ? void 0 : n.amznbid,
                        M[h] || 0);
                        g > p ? (m = null === (r = null == s ? void 0 : s.amznTargetting) || void 0 === r ? void 0 : r.amnzp,
                        u = O[m] || "Amazon",
                        p = g,
                        l = !1,
                        this.renderAMZNAd(s.id, c, A)) : this.renderPrebidAd(s.id, c, A),
                        at.track(i.tracking.ads.display.impression, {
                            size: s.size,
                            opportunityId: s.opportunityId,
                            duringGameplay: null === (o = s.duringGameplayFn) || void 0 === o ? void 0 : o.call(s),
                            adUnitPath: s.adUnitPath,
                            prebidBid: p,
                            prebidBidder: u,
                            preBidWon: l,
                            dfpIsBackfill: !1,
                            dfpLineItemId: void 0,
                            dfpCampaignId: void 0,
                            adDomain: s.pbjsTargetting.hb_adomain
                        }),
                        j({
                            event: "impression",
                            size: s.size,
                            opportunityId: s.opportunityId,
                            adUnitPath: s.adUnitPath,
                            bidder: u,
                            bid: p
                        }),
                        s.intersectionObserver = new IntersectionObserver((function(e) {
                            e.forEach((function(e) {
                                e.isIntersecting ? s.intersectingTimer || (s.intersectingTimer = setTimeout((function() {
                                    var t;
                                    null === (t = s.intersectionObserver) || void 0 === t || t.unobserve(e.target),
                                    j({
                                        event: "viewable",
                                        size: s.size,
                                        opportunityId: s.opportunityId,
                                        adUnitPath: s.adUnitPath,
                                        bidder: u,
                                        bid: p
                                    }),
                                    a.callOnCanDestroy(s)
                                }
                                ), 1e3)) : s.intersectingTimer && (clearTimeout(s.intersectingTimer),
                                s.intersectingTimer = void 0)
                            }
                            ))
                        }
                        ),{
                            threshold: .5
                        }),
                        s.intersectionObserver.observe(c)
                    } else
                        console.error("IGD error - container not found", e)
                }
            }
            ,
            t.prototype.renderPrebidAd = function(e, t, n) {
                var i = this.slotMap.get(e);
                if (i)
                    return i.pbjsTargetting.hb_adid ? void window.pbjs.renderAd(n, i.pbjsTargetting.hb_adid) : (console.error("IGD info - prebid nothing to render", e, i.pbjsTargetting),
                    void this.clearIGDAd(t.parentNode))
            }
            ,
            t.prototype.renderAMZNAd = function(e, t, n) {
                var i, r, o = this.slotMap.get(e);
                if (o)
                    return (null === (i = null == o ? void 0 : o.amznTargetting) || void 0 === i ? void 0 : i.amzniid) ? void window.apstag.renderImp(n, null === (r = null == o ? void 0 : o.amznTargetting) || void 0 === r ? void 0 : r.amzniid) : (console.error("IGD info - amazon nothing to render", e, o.pbjsTargetting),
                    void this.clearIGDAd(t.parentNode))
            }
            ,
            t.prototype.setupGPT = function(e, t) {}
            ,
            t.prototype.setupSlotRenderEndedListener = function() {}
            ,
            t
        }(Qe);
        const Ve = He;
        var We = function() {
            return We = Object.assign || function(e) {
                for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var r in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                return e
            }
            ,
            We.apply(this, arguments)
        }
          , Je = function(e, t, n, i) {
            return new (n || (n = Promise))((function(r, o) {
                function a(e) {
                    try {
                        d(i.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function s(e) {
                    try {
                        d(i.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function d(e) {
                    var t;
                    e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function(e) {
                        e(t)
                    }
                    ))).then(a, s)
                }
                d((i = i.apply(e, t || [])).next())
            }
            ))
        }
          , Ye = function(e, t) {
            var n, i, r, o, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0])
                        throw r[1];
                    return r[1]
                },
                trys: [],
                ops: []
            };
            return o = {
                next: s(0),
                throw: s(1),
                return: s(2)
            },
            "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
            }
            ),
            o;
            function s(o) {
                return function(s) {
                    return function(o) {
                        if (n)
                            throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (n = 1,
                                i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i),
                                0) : i.next) && !(r = r.call(i, o[1])).done)
                                    return r;
                                switch (i = 0,
                                r && (o = [2 & o[0], r.value]),
                                o[0]) {
                                case 0:
                                case 1:
                                    r = o;
                                    break;
                                case 4:
                                    return a.label++,
                                    {
                                        value: o[1],
                                        done: !1
                                    };
                                case 5:
                                    a.label++,
                                    i = o[1],
                                    o = [0];
                                    continue;
                                case 7:
                                    o = a.ops.pop(),
                                    a.trys.pop();
                                    continue;
                                default:
                                    if (!(r = a.trys,
                                    (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                        a.label = o[1];
                                        break
                                    }
                                    if (6 === o[0] && a.label < r[1]) {
                                        a.label = r[1],
                                        r = o;
                                        break
                                    }
                                    if (r && a.label < r[2]) {
                                        a.label = r[2],
                                        a.ops.push(o);
                                        break
                                    }
                                    r[2] && a.ops.pop(),
                                    a.trys.pop();
                                    continue
                                }
                                o = t.call(e, a)
                            } catch (e) {
                                o = [6, e],
                                i = 0
                            } finally {
                                n = r = 0
                            }
                        if (5 & o[0])
                            throw o[1];
                        return {
                            value: o[0] ? o[1] : void 0,
                            done: !0
                        }
                    }([o, s])
                }
            }
        }
          , $e = function(e, t, n) {
            if (n || 2 === arguments.length)
                for (var i, r = 0, o = t.length; r < o; r++)
                    !i && r in t || (i || (i = Array.prototype.slice.call(t, 0, r)),
                    i[r] = t[r]);
            return e.concat(i || Array.prototype.slice.call(t))
        }
          , et = {
            gameId: E("game_id"),
            versionId: E("game_version_id")
        }
          , tt = function() {
            function e() {
                var e = this;
                this.autoStartOnReady = !1,
                this.criteria = {},
                this.debugIsOverwritten = !1,
                this.handlers = {},
                this.initializingPromise = null,
                this.isInitialized = !1,
                this.programmaticAdsEnabled = !0,
                this.sdkBooted = !1,
                this.startAdEnabled = !1,
                this.startStartAdsAfterTimerOnInit = !1,
                this.initOptions = {},
                this.installedTCFv2 = !1,
                this.installedUSP = !1,
                this.isBot = !1,
                this.adSettings = {
                    blocklist: [],
                    countryExclusion: [],
                    bidderLimitation: {}
                },
                this.adReady = !1,
                this.sdkImaError = !1,
                this.debugTouchOverlayController = !1,
                this.setPlayerAge = function(e) {
                    e && function(e, t) {
                        if (ke)
                            try {
                                localStorage.setItem(e, t)
                            } catch (n) {
                                ke = !1,
                                we[e] = t
                            }
                        else
                            we[e] = t
                    }("playerAge", e)
                }
                ,
                this.setLogging = function(e) {
                    r.log = e
                }
                ,
                this.sdkNotBootedButCalled = function() {
                    console.error("The Poki SDK has not yet been initialized")
                }
                ,
                this.screenshot = function(t, n) {
                    return void 0 === n && (n = null),
                    Je(e, void 0, void 0, (function() {
                        var e, i, r, o;
                        return Ye(this, (function(a) {
                            switch (a.label) {
                            case 0:
                                return e = function(e) {
                                    if (!e) {
                                        var t = Array.from(document.querySelectorAll("canvas"))
                                          , n = 0;
                                        if (t.forEach((function(t) {
                                            var i = getComputedStyle(t)
                                              , r = i.width
                                              , o = i.height
                                              , a = parseInt(r, 10) * parseInt(o, 10);
                                            a > n && (n = a,
                                            e = t)
                                        }
                                        )),
                                        !e)
                                            return null
                                    }
                                    var i = document.createElement("canvas").getContext("2d");
                                    i.canvas.width = e.width,
                                    i.canvas.height = e.height;
                                    var r = i.getImageData(0, 0, i.canvas.width, i.canvas.height);
                                    try {
                                        var o = document.createElement("canvas").getContext("webgl")
                                          , a = o.createTexture();
                                        o.bindTexture(o.TEXTURE_2D, a),
                                        o.texImage2D(o.TEXTURE_2D, 0, o.RGB, o.RGB, o.UNSIGNED_BYTE, e);
                                        var s = o.createFramebuffer();
                                        o.bindFramebuffer(o.FRAMEBUFFER, s),
                                        o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, a, 0),
                                        o.readPixels(0, 0, e.width, e.height, o.RGBA, o.UNSIGNED_BYTE, new Uint8Array(r.data.buffer)),
                                        i.putImageData(r, 0, 0)
                                    } catch (e) {
                                        return null
                                    }
                                    return i.canvas.toDataURL()
                                }(t),
                                e ? n ? [4, this.addScreenshotFrame(e, n)] : [3, 2] : [3, 8];
                            case 1:
                                e = a.sent(),
                                a.label = 2;
                            case 2:
                                return "https://api.poki.io/screenshot",
                                i = "https://poki-user-content.com/",
                                [4, fetch("https://api.poki.io/screenshot", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        data: e
                                    })
                                })];
                            case 3:
                                r = a.sent(),
                                a.label = 4;
                            case 4:
                                return a.trys.push([4, 7, , 8]),
                                200 !== r.status ? [3, 6] : [4, r.json()];
                            case 5:
                                return o = a.sent(),
                                [2, i + o.source];
                            case 6:
                                return [3, 8];
                            case 7:
                                return a.sent(),
                                [3, 8];
                            case 8:
                                return [2, null]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                this.addScreenshotFrame = function(t, n) {
                    return Je(e, void 0, Promise, (function() {
                        var e, i, r, o, a, s, d, c, A, l, u, p, h, m, g, f, v, b, y, k, w, E, I, S, x;
                        return Ye(this, (function(C) {
                            switch (C.label) {
                            case 0:
                                return e = n.title,
                                i = n.thumbnail,
                                (r = new Image).crossOrigin = "Anonymous",
                                o = new Promise((function(e) {
                                    r.onload = function() {
                                        return e(r)
                                    }
                                }
                                )),
                                r.src = t,
                                (a = new Image).crossOrigin = "Anonymous",
                                s = new Promise((function(e) {
                                    a.onload = function() {
                                        return e(a)
                                    }
                                }
                                )),
                                a.src = "https://a.poki.com/images/screenshot-frame.png",
                                (d = new Image).crossOrigin = "Anonymous",
                                c = new Promise((function(e) {
                                    d.onload = function() {
                                        return e(d)
                                    }
                                }
                                )),
                                128,
                                d.src = "thumbs.png?https://img.poki.com/cdn-cgi/image/quality=78,width=128,height=128,fit=cover,f=auto/" + i,
                                A = new FontFace("TorusBold","url(https://a.poki.com/fonts/torus-bold-latin.woff2)"),
                                l = A.load(),
                                [4, Promise.all([o, s, c, l])];
                            case 1:
                                return u = C.sent(),
                                p = u[0],
                                h = u[1],
                                m = u[2],
                                g = u[3],
                                (f = document.createElement("canvas")).width = p.width,
                                f.height = p.height,
                                (v = f.getContext("2d")).drawImage(p, 0, 0),
                                b = f.width / h.width,
                                y = h.height * b,
                                k = f.height - y,
                                v.drawImage(h, 0, k, f.width, y),
                                w = m.height * b,
                                E = 64 * b,
                                I = k + 20 * b,
                                this.drawRoundedImage(v, m, E, I, w, w, 24 * b),
                                document.fonts.add(g),
                                S = 226 * b,
                                x = k + 68 * b,
                                v.textAlign = "left",
                                v.textBaseline = "top",
                                v.fillStyle = "#002b50",
                                v.font = "700 " + 56 * b + "px TorusBold,sans-serif",
                                v.fillText(e, S, x),
                                [2, f.toDataURL()]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                this.drawRoundedImage = function(e, t, n, i, r, o, a) {
                    e.save(),
                    e.beginPath();
                    var s = n + r
                      , d = i + o;
                    e.moveTo(n + a, i),
                    e.lineTo(s - a, i),
                    e.quadraticCurveTo(s, i, s, i + a),
                    e.lineTo(s, d - a),
                    e.quadraticCurveTo(s, d, s - a, d),
                    e.lineTo(n + a, d),
                    e.quadraticCurveTo(n, d, n, d - a),
                    e.lineTo(n, i + a),
                    e.quadraticCurveTo(n, i, n + a, i),
                    e.closePath(),
                    e.clip(),
                    e.drawImage(t, n, i, r, o),
                    e.restore()
                }
                ,
                this.IGD = te() ? new Ve : new Qe;
                var t = E("pokiDebug");
                "" !== t && (this.setDebug("true" === t),
                this.debugIsOverwritten = !0),
                "" !== E("pokiLogging") && this.setLogging(!0)
            }
            return e.prototype.init = function(e) {
                if (void 0 === e && (e = {}),
                "undefined" != typeof window) {
                    var t = e.onReady
                      , n = void 0 === t ? null : t
                      , i = e.onAdblocked
                      , r = void 0 === i ? null : i;
                    return this.initOptions = e,
                    n && this.registerHandler("onReady", n),
                    r && this.registerHandler("onAdblocked", r),
                    this.registerScreenshotListener(),
                    this.isInitialized ? console.error("Poki SDK has already been initialized") : (this.initializingPromise || (this.initializingPromise = this.lazyLoadInit()),
                    this.initializingPromise)
                }
            }
            ,
            e.prototype.lazyLoadInit = function() {
                var t = this
                  , n = this.initOptions
                  , o = n.debug
                  , s = void 0 !== o && o
                  , c = n.prebid
                  , A = void 0 === c ? {} : c
                  , l = n.a9
                  , u = void 0 === l ? {} : l
                  , p = n.volume
                  , h = void 0 === p ? 1 : p
                  , m = n.waterfallRetries
                  , g = n.wrapper;
                window.googletag = window.googletag || {
                    cmd: []
                },
                window.pbjs = window.pbjs || {
                    que: []
                };
                var f = parseInt(E("site_id"), 10) || 0;
                this.isBot = "1" === E("bot"),
                this.setupDefaultEvents(),
                at.setupDefaultEvents(),
                e.GetIsPokiIFrame() && Ee(),
                setTimeout(b.trackSavegames, 1e4);
                var v = We({}, d)
                  , y = De;
                r.debug && (y = function() {
                    return Promise.resolve()
                }
                );
                var I = Re
                  , S = E("ccpaApplies")
                  , x = (this.initOptions.country || E("country")).toUpperCase()
                  , C = void 0 !== this.initOptions.isCCPA ? this.initOptions.isCCPA : "" !== S ? "1" === S : void 0;
                x && void 0 !== C && (I = function() {
                    return Promise.resolve({
                        ISO: x,
                        ccpaApplies: C
                    })
                }
                ),
                window.addEventListener("resize", this.resize.bind(this), !1),
                this.debugIsOverwritten || this.setDebug(r.debug || s),
                this.debugTouchOverlayController && (k() || w()) && Ze();
                var T = [y(), I()]
                  , _ = $e($e([], T, !0), [Le()], !1)
                  , B = (E("url_referrer") || "").includes("kiloo.com");
                this.isBot || (_.push(_e("js/null.js?https://imasdk.googleapis.com/js/sdkloader/ima3.js"), _e("js/null.js?https://securepubads.g.doubleclick.net/tag/js/gpt.js")),
                B ? (e.prebidAvailable = !1,
                e.childDirected = !0,
                e.nonPersonalized = !0,
                this.IGD.enforceChildSafety()) : _.push(_e("js/null.js?https://a.poki.com/prebid/prebid6.27.0.js"), _e("js/null.js?https://c.amazon-adsystem.com/aax2/apstag.js")));
                var P = function(e, n, o) {
                    if (void 0 === o && (o = !0),
                    t.country = (x || (null == n ? void 0 : n.ISO) || "ZZ").toUpperCase(),
                    t.isCCPA = void 0 === C ? (null == n ? void 0 : n.ccpaApplies) || !1 : C,
                    e) {
                        et.gameId || (et.gameId = e.gameId);
                        ["7fb1fd45-24ce-4ade-b5c4-9ee55ec99526"].includes(et.gameId) && (k() || w()) && Ze(),
                        v.adTiming = e.adTiming,
                        v.customCriteria = We(We({}, v.customCriteria), {
                            p4d_game_id: et.gameId
                        })
                    }
                    Se(t.country) && !r.debug && (Y(),
                    console.debug("GDPR - waiting for __tcfapi callback"),
                    window.__tcfapi("ping", 2, (function() {
                        console.debug("GDPR - __tcfapi callback received"),
                        t.installedTCFv2 = !0,
                        o && a.dispatchEvent(i.ready)
                    }
                    )),
                    setTimeout((function() {
                        t.installedTCFv2 || (console.error("GDPR - No __tcfapi callback after 2s, verify implementation!"),
                        o && a.dispatchEvent(i.ready))
                    }
                    ), 2e3)),
                    t.isCCPA && !r.debug && ($(),
                    console.debug("USPrivacy - waiting for __uspapi callback"),
                    window.__uspapi("uspPing", 1, (function() {
                        console.debug("USPrivacy - __uspapi callback received"),
                        t.installedUSP = !0,
                        o && a.dispatchEvent(i.ready)
                    }
                    )),
                    setTimeout((function() {
                        t.installedUSP || (console.error("USPrivacy - No __uspapi callback after 2s, verify implementation!"),
                        o && a.dispatchEvent(i.ready))
                    }
                    ), 2e3))
                };
                return Promise.all(_).catch((function() {
                    Promise.all(T).then((function(e) {
                        var t = e[0]
                          , n = e[1];
                        P(t, n, !1)
                    }
                    )),
                    a.dispatchEvent(i.adblocked)
                }
                )).then((function(e) {
                    var n, o, s, d;
                    if (void 0 !== e) {
                        var c = !1;
                        (null === (s = null === (o = null === (n = window.google) || void 0 === n ? void 0 : n.ima) || void 0 === o ? void 0 : o.AdEvent) || void 0 === s ? void 0 : s.Type) && (null === (d = window.pbjs) || void 0 === d ? void 0 : d.markWinningBidAsUsed) || B || (c = !0);
                        var l = e[0]
                          , p = e[1]
                          , b = e[2];
                        if (P(l, p, !c),
                        c)
                            a.dispatchEvent(i.adblocked);
                        else {
                            var y;
                            t.adSettings = b,
                            y = b.blocklist,
                            G = y || [],
                            V(A, t.country, b.bidderLimitation),
                            r.debug && (v.adTiming.startAdsAfter = 0);
                            var k = E("force_ad") || E("gd_force_ad") || !1;
                            k && (v.adTiming = {
                                preroll: !0,
                                timeBetweenAds: 12e4,
                                timePerTry: 7e3,
                                startAdsAfter: 0
                            },
                            v.customCriteria = We(We({}, v.customCriteria), {
                                force_ad: k
                            })),
                            t.enableSettings(v),
                            t.playerSkin = new be({
                                wrapper: g
                            }),
                            t.ima = new Te(h),
                            t.playerSkin.setupEvents(t),
                            t.startStartAdsAfterTimerOnInit && t.adTimings.startStartAdsAfterTimer(),
                            t.waterfall = new ie(t.ima,{
                                timing: t.adTimings,
                                totalRetries: m,
                                siteID: f,
                                country: t.country
                            }),
                            t.IGD.setupSlotRenderEndedListener();
                            var w = Se(t.country);
                            J(u, t.country, w, b.bidderLimitation),
                            t.setProxyWindow(),
                            t.isInitialized = !0,
                            t.isCCPA || w ? r.debug && a.dispatchEvent(i.ready) : a.dispatchEvent(i.ready)
                        }
                    }
                }
                ))
            }
            ,
            e.prototype.requestAd = function(e) {
                void 0 === e && (e = {});
                var t = e.autoStart
                  , n = void 0 === t || t
                  , o = e.onFinish
                  , d = void 0 === o ? null : o
                  , c = e.onStart
                  , A = void 0 === c ? null : c
                  , l = e.position
                  , u = void 0 === l ? null : l;
                if (this.autoStartOnReady = !1 !== n,
                d && this.registerHandler("onFinish", d),
                A && this.registerHandler("onStart", A),
                this.isBot)
                    d && d({});
                else {
                    if (!this.sdkBooted)
                        return a.dispatchEvent(i.ads.error, {
                            message: "Requesting ad on unbooted SDK"
                        }),
                        void this.sdkNotBootedButCalled();
                    if (this.sdkImaError)
                        a.dispatchEvent(i.ads.error, {
                            message: "Adblocker has been detected"
                        });
                    else if (!k() && !w() || u === i.ads.position.rewarded)
                        if (null !== u && s(u, i.ads.position))
                            if (!Se(this.country) || this.installedTCFv2 || r.debug)
                                if (!this.isCCPA || this.installedUSP)
                                    if (this.ima.isAdRunning() || this.waterfall.isRunning())
                                        a.dispatchEvent(i.ads.busy);
                                    else if (this.adReady)
                                        a.dispatchEvent(i.ads.ready);
                                    else if (u !== i.ads.position.preroll || this.adTimings.prerollPossible())
                                        if (u === i.ads.position.rewarded || this.adTimings.requestPossible())
                                            if (u !== i.ads.position.rewarded && this.adSettings.countryExclusion.includes(this.country))
                                                a.dispatchEvent(i.ads.limit, {
                                                    reason: i.info.messages.disabled
                                                });
                                            else {
                                                var p = We(We(We({}, this.genericCriteria()), this.criteria), {
                                                    position: u
                                                });
                                                this.playerSkin.show(),
                                                this.resize(),
                                                this.waterfall.start(p, u)
                                            }
                                        else
                                            a.dispatchEvent(i.ads.limit, {
                                                reason: i.info.messages.timeLimit
                                            });
                                    else
                                        a.dispatchEvent(i.ads.limit, {
                                            reason: i.info.messages.prerollLimit
                                        });
                                else
                                    a.dispatchEvent(i.ads.error, {
                                        message: "No USP detected, please contact developersupport@poki.com for more information"
                                    });
                            else
                                a.dispatchEvent(i.ads.error, {
                                    message: "No TCFv2 CMP detected, please contact developersupport@poki.com for more information"
                                });
                        else
                            console.error("POKI-SDK: Invalid position");
                    else
                        a.dispatchEvent(i.ads.error, {
                            reason: "Interstitials are disabled on mobile"
                        })
                }
            }
            ,
            e.prototype.displayAd = function(e, t, n, o, s) {
                if (!this.isBot) {
                    var d = i.ads.position.display;
                    if (!Se(this.country) || this.installedTCFv2 || r.debug)
                        if (!this.isCCPA || window.__uspapi)
                            if (t) {
                                if (!this.sdkBooted)
                                    return a.dispatchEvent(i.ads.error, {
                                        message: "Requesting ad on unbooted SDK",
                                        position: d
                                    }),
                                    void this.sdkNotBootedButCalled();
                                if (e)
                                    if (this.sdkImaError)
                                        a.dispatchEvent(i.ads.error, {
                                            message: "Adblocker has been detected",
                                            position: d
                                        });
                                    else if (this.adSettings.countryExclusion.includes(this.country))
                                        a.dispatchEvent(i.ads.limit, {
                                            reason: i.info.messages.disabled,
                                            position: d
                                        });
                                    else {
                                        if (!this.IGD.validateDisplaySettings(t))
                                            return a.dispatchEvent(i.ads.error, {
                                                reason: "Display size " + t + " is not supported on this device",
                                                position: d
                                            });
                                        var c = We(We({}, this.genericCriteria()), this.criteria);
                                        this.IGD.renderIGDAd(e, t, c, n, o, s)
                                    }
                                else
                                    a.dispatchEvent(i.ads.error, {
                                        message: "Provided container does not exist",
                                        position: d
                                    })
                            } else
                                a.dispatchEvent(i.ads.error, {
                                    message: "No ad size given, usage: displayAd(<container>, <size>)",
                                    position: d
                                });
                        else
                            a.dispatchEvent(i.ads.error, {
                                message: "No USP detected, please contact developersupport@poki.com for more information",
                                position: d
                            });
                    else
                        a.dispatchEvent(i.ads.error, {
                            message: "No TCFv2 CMP detected, please contact developersupport@poki.com for more information",
                            position: d
                        })
                }
            }
            ,
            e.prototype.destroyAd = function(e) {
                if (!this.sdkBooted)
                    return a.dispatchEvent(i.ads.displayError, {
                        message: "Attempting destroyAd on unbooted SDK"
                    }),
                    void this.sdkNotBootedButCalled();
                this.sdkImaError ? a.dispatchEvent(i.ads.displayError, {
                    message: "Adblocker has been detected"
                }) : this.adSettings.countryExclusion.includes(this.country) || (e = e || document.body,
                this.IGD.clearIGDAd(e))
            }
            ,
            e.prototype.startStartAdsAfterTimer = function() {
                this.sdkBooted && !this.sdkImaError ? this.adTimings.startStartAdsAfterTimer() : this.startStartAdsAfterTimerOnInit = !0
            }
            ,
            e.prototype.enableSettings = function(e) {
                this.criteria = We({}, e.customCriteria),
                this.adTimings = new A(e.adTiming)
            }
            ,
            e.prototype.setDebug = function(e) {
                this.debugIsOverwritten ? e && at.track(i.tracking.debugTrueInProduction) : r.debug = e
            }
            ,
            e.prototype.resize = function() {
                var e = this;
                if (!this.sdkBooted)
                    return this.sdkNotBootedButCalled();
                if (!this.sdkImaError) {
                    var t = this.playerSkin.getVideoBounds();
                    0 !== t.width && 0 !== t.height ? this.ima.resize(t.width, t.height) : setTimeout((function() {
                        e.resize()
                    }
                    ), 100)
                }
            }
            ,
            e.prototype.startAd = function() {
                if (!this.sdkBooted)
                    return this.sdkNotBootedButCalled();
                this.sdkImaError || (this.adReady ? (this.resize(),
                this.ima.startPlayback()) : a.dispatchEvent(i.ads.error, {
                    message: "No ads ready to start"
                }))
            }
            ,
            e.prototype.startAdClicked = function() {
                "undefined" != typeof navigator && /(iPad|iPhone|iPod)/gi.test(navigator.userAgent) && this.startAdEnabled && (this.startAdEnabled = !1,
                this.playerSkin.hideStartAdButton(),
                this.ima.startIOSPlayback())
            }
            ,
            e.prototype.stopAd = function() {
                if (!this.sdkBooted)
                    return this.sdkNotBootedButCalled();
                this.sdkImaError || (this.waterfall.stopWaterfall(),
                this.ima.stopPlayback(),
                this.playerSkin.hide())
            }
            ,
            e.prototype.resumeAd = function() {
                if (!this.sdkBooted)
                    return this.sdkNotBootedButCalled();
                this.sdkImaError || (this.playerSkin.hidePauseButton(),
                this.ima.resumeAd())
            }
            ,
            e.prototype.skipAd = function() {
                this.stopAd(),
                this.callHandler("onFinish", {
                    type: i.ads.completed,
                    rewardAllowed: !0
                })
            }
            ,
            e.prototype.muteAd = function() {
                if (!this.sdkBooted)
                    return this.sdkNotBootedButCalled();
                this.sdkImaError || this.ima.muteAd()
            }
            ,
            e.prototype.registerHandler = function(e, t) {
                this.handlers[e] = t
            }
            ,
            e.prototype.callHandler = function(e) {
                for (var t = [], n = 1; n < arguments.length; n++)
                    t[n - 1] = arguments[n];
                "function" == typeof this.handlers[e] && this.handlers[e](t)
            }
            ,
            e.prototype.setupDefaultEvents = function() {
                var e = this;
                a.addEventListener(i.ready, (function() {
                    e.sdkBooted = !0,
                    e.callHandler("onReady")
                }
                )),
                a.addEventListener(i.adblocked, (function() {
                    e.sdkBooted = !0,
                    e.sdkImaError = !0,
                    e.callHandler("onAdblocked")
                }
                )),
                a.addEventListener(i.ads.ready, (function() {
                    e.adReady = !0,
                    e.autoStartOnReady && e.startAd()
                }
                )),
                a.addEventListener(i.ads.started, (function() {
                    e.playerSkin.hideSpinner(),
                    e.callHandler("onStart", {
                        type: i.ads.limit
                    })
                }
                )),
                a.addEventListener(i.ads.video.paused, (function() {
                    e.playerSkin.showPauseButton()
                }
                )),
                a.addEventListener(i.ads.limit, (function() {
                    e.callHandler("onFinish", {
                        type: i.ads.limit,
                        rewardAllowed: !1
                    })
                }
                )),
                a.addEventListener(i.ads.stopped, (function() {
                    e.callHandler("onFinish", {
                        type: i.ads.stopped,
                        rewardAllowed: !1
                    })
                }
                )),
                a.addEventListener(i.ads.error, (function(t) {
                    e.callHandler("onFinish", {
                        type: i.ads.error,
                        rewardAllowed: !!t.rewardAllowed
                    })
                }
                )),
                a.addEventListener(i.ads.busy, (function() {
                    e.callHandler("onFinish", {
                        type: i.ads.busy,
                        rewardAllowed: !1
                    })
                }
                )),
                a.addEventListener(i.ads.completed, (function(t) {
                    e.callHandler("onFinish", {
                        type: i.ads.completed,
                        rewardAllowed: !!t.rewardAllowed
                    })
                }
                )),
                [i.ads.limit, i.ads.stopped, i.ads.error, i.ads.busy, i.ads.completed].forEach((function(t) {
                    a.addEventListener(t, (function() {
                        e.playerSkin && e.playerSkin.hide(),
                        e.adReady = !1
                    }
                    ))
                }
                ))
            }
            ,
            e.prototype.genericCriteria = function() {
                var e = {}
                  , t = encodeURIComponent(E("tag") || "")
                  , n = encodeURIComponent(E("site_id") || "")
                  , i = encodeURIComponent(E("experiment") || "")
                  , r = encodeURIComponent(E("categories") || "");
                return e.tag = t,
                e.tag_site = t + "|" + n,
                e.site_id = n,
                e.experiment = i,
                e.categories = r,
                this.programmaticAdsEnabled || (e.disable_programmatic = 1),
                e
            }
            ,
            e.prototype.setVolume = function(e) {
                this.ima && this.ima.setVolume(e)
            }
            ,
            e.prototype.setProxyWindow = function() {
                if (!r.debug) {
                    var e = window.alert
                      , t = window.confirm
                      , n = window.prompt;
                    window.alert = function(t) {
                        console.debug("Poki Tip: Don't use alert() it blocks the javascript event loop"),
                        e(t)
                    }
                    ,
                    window.confirm = function(e) {
                        return console.debug("Poki Tip: Don't use confirm() it blocks the javascript event loop"),
                        t(e)
                    }
                    ,
                    window.prompt = function(e) {
                        return console.debug("Poki Tip: Don't use prompt() it blocks the javascript event loop"),
                        n(e)
                    }
                }
            }
            ,
            e.prototype.registerScreenshotListener = function() {
                var e = this;
                window.addEventListener("message", (function(t) {
                    return Je(e, void 0, void 0, (function() {
                        var e, n, r, o, a;
                        return Ye(this, (function(s) {
                            switch (s.label) {
                            case 0:
                                return "pokiGenerateScreenshot" !== t.data.type ? [3, 5] : (e = t.data.hasFrame,
                                n = null,
                                e ? (r = t.data,
                                o = r.title,
                                a = r.thumbnail,
                                [4, this.screenshot(null, {
                                    title: o,
                                    thumbnail: a
                                })]) : [3, 2]);
                            case 1:
                                return n = s.sent(),
                                [3, 4];
                            case 2:
                                return [4, this.screenshot(null)];
                            case 3:
                                n = s.sent(),
                                s.label = 4;
                            case 4:
                                it.sendMessage(i.message.sendGameScreenshot, {
                                    data: {
                                        screenshot: n
                                    }
                                }),
                                s.label = 5;
                            case 5:
                                return [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ), !1)
            }
            ,
            e.GetIsPokiIFrame = function() {
                return (parseInt(E("site_id"), 10) || 0) > 0
            }
            ,
            e.childDirected = !1,
            e.nonPersonalized = !1,
            e.prebidAvailable = !0,
            e.consentString = "",
            e
        }();
        const nt = tt;
        const it = function() {
            function e() {}
            return e.sendMessage = function(e, t) {
                var n = window.parent;
                if (!s(e, i.message)) {
                    var r = Object.keys(i.message).map((function(e) {
                        return "poki.message." + e
                    }
                    ));
                    throw new TypeError("Argument 'type' must be one of " + r.join(", "))
                }
                var o = t || {};
                et.gameId && et.versionId && (o.pokifordevs = {
                    game_id: et.gameId,
                    game_version_id: et.versionId
                }),
                n.postMessage({
                    type: e,
                    content: o
                }, "*")
            }
            ,
            e
        }();
        var rt = function(e) {
            var t = new Array;
            return Object.keys(e).forEach((function(n) {
                "object" == typeof e[n] ? t = t.concat(rt(e[n])) : t.push(e[n])
            }
            )),
            t
        };
        var ot = rt(i.tracking);
        const at = function() {
            function e() {}
            return e.track = function(e, t) {
                if (void 0 === t && (t = {}),
                -1 === ot.indexOf(e))
                    throw new TypeError("Invalid 'event', must be one of " + ot.join(", "));
                if ("object" != typeof t)
                    throw new TypeError("Invalid data, must be an object");
                var n = a.getDataAnnotations();
                if (null == n ? void 0 : n.pokiAdServer)
                    switch (e) {
                    case i.tracking.ads.status.impression:
                        j({
                            event: "video-impression",
                            creativeId: null == t ? void 0 : t.creativeId
                        });
                        break;
                    case i.tracking.ads.video.error:
                        j({
                            event: "video-error",
                            errorCode: null == t ? void 0 : t.errorCode
                        });
                        break;
                    case i.tracking.ads.video.loaderError:
                        j({
                            event: "video-adsloader-error",
                            errorCode: null == t ? void 0 : t.errorCode
                        });
                        break;
                    case i.tracking.ads.status.completed:
                        j({
                            event: "video-complete"
                        })
                    }
                if (r.debug || r.log) {
                    if (window.process && window.process.env && "test" === window.process.env.NODE_ENV)
                        return;
                    Object.keys(t).length ? console.info("%cPOKI_TRACKER: %cTracked event '" + e + "' with data:", "font-weight: bold", "", t) : console.info("%cPOKI_TRACKER: %cTracked event '" + e + "'", "font-weight: bold", "")
                }
                it.sendMessage(i.message.event, {
                    event: e,
                    data: t
                })
            }
            ,
            e.setupDefaultEvents = function() {
                var t, n = ((t = {})[i.ready] = i.tracking.sdk.status.initialized,
                t[i.adblocked] = i.tracking.sdk.status.failed,
                t[i.ads.busy] = i.tracking.ads.status.busy,
                t[i.ads.completed] = i.tracking.ads.status.completed,
                t[i.ads.error] = i.tracking.ads.status.error,
                t[i.ads.displayError] = i.tracking.ads.status.displayError,
                t[i.ads.impression] = i.tracking.ads.status.impression,
                t[i.ads.limit] = i.tracking.ads.status.limit,
                t[i.ads.ready] = i.tracking.ads.status.ready,
                t[i.ads.requested] = i.tracking.ads.status.requested,
                t[i.ads.prebidRequested] = i.tracking.ads.status.prebidRequested,
                t[i.ads.skipped] = i.tracking.ads.status.skipped,
                t[i.ads.started] = i.tracking.ads.status.started,
                t[i.ads.video.clicked] = i.tracking.ads.video.clicked,
                t[i.ads.video.error] = i.tracking.ads.video.error,
                t[i.ads.video.loaderError] = i.tracking.ads.video.loaderError,
                t[i.ads.video.buffering] = i.tracking.ads.status.buffering,
                t[i.ads.video.progress] = i.tracking.ads.video.progress,
                t[i.ads.video.paused] = i.tracking.ads.video.paused,
                t[i.ads.video.resumed] = i.tracking.ads.video.resumed,
                t[i.tracking.screen.gameplayStart] = i.tracking.screen.gameplayStart,
                t[i.tracking.screen.gameplayStop] = i.tracking.screen.gameplayStop,
                t[i.tracking.screen.loadingProgress] = i.tracking.screen.loadingProgress,
                t[i.tracking.screen.commercialBreak] = i.tracking.screen.commercialBreak,
                t[i.tracking.screen.rewardedBreak] = i.tracking.screen.rewardedBreak,
                t);
                Object.keys(n).forEach((function(t) {
                    a.addEventListener(t, (function(i) {
                        e.track(n[t], i)
                    }
                    ))
                }
                ))
            }
            ,
            e
        }();
        function st(e) {
            switch (Object.prototype.toString.call(e)) {
            case "[object Error]":
            case "[object Exception]":
            case "[object DOMException]":
                return !0;
            default:
                return e instanceof Error
            }
        }
        var dt = "poki_erruid"
          , ct = Date.now()
          , At = u(dt);
        function lt() {
            return At || (At = Math.random().toString(36).substr(2, 9),
            p(dt, At)),
            At
        }
        function ut(e) {
            if (et.gameId && et.versionId) {
                if (!(Date.now() < ct))
                    try {
                        var t = JSON.stringify({
                            gid: et.gameId,
                            vid: et.versionId,
                            ve: 7,
                            n: e.name,
                            m: e.message,
                            s: JSON.stringify(e.stack),
                            ui: lt()
                        })
                          , n = "https://t.poki.io/ge";
                        if (navigator.sendBeacon)
                            navigator.sendBeacon(n, t);
                        else {
                            var i = new XMLHttpRequest;
                            i.open("POST", n, !0),
                            i.send(t)
                        }
                        ct = Date.now() + 100
                    } catch (e) {
                        console.error(e)
                    }
            } else
                console.log(e)
        }
        "undefined" != typeof window && (t().remoteFetching = !1,
        t().report.subscribe((function(e) {
            if ("Script error." === e.message && window.pokiLastCatch) {
                var n = window.pokiLastCatch;
                window.pokiLastCatch = null;
                try {
                    t().report(n)
                } catch (e) {}
            } else
                ut(e)
        }
        )),
        window.addEventListener("unhandledrejection", (function(e) {
            if (st(e.reason))
                try {
                    t().report(e.reason)
                } catch (e) {}
            else
                ut({
                    name: "unhandledrejection",
                    message: JSON.stringify(e.reason)
                })
        }
        )));
        var pt = function() {
            return pt = Object.assign || function(e) {
                for (var t, n = 1, i = arguments.length; n < i; n++)
                    for (var r in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                return e
            }
            ,
            pt.apply(this, arguments)
        }
          , ht = function(e, t, n, i) {
            return new (n || (n = Promise))((function(r, o) {
                function a(e) {
                    try {
                        d(i.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function s(e) {
                    try {
                        d(i.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function d(e) {
                    var t;
                    e.done ? r(e.value) : (t = e.value,
                    t instanceof n ? t : new n((function(e) {
                        e(t)
                    }
                    ))).then(a, s)
                }
                d((i = i.apply(e, t || [])).next())
            }
            ))
        }
          , mt = function(e, t) {
            var n, i, r, o, a = {
                label: 0,
                sent: function() {
                    if (1 & r[0])
                        throw r[1];
                    return r[1]
                },
                trys: [],
                ops: []
            };
            return o = {
                next: s(0),
                throw: s(1),
                return: s(2)
            },
            "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
            }
            ),
            o;
            function s(o) {
                return function(s) {
                    return function(o) {
                        if (n)
                            throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (n = 1,
                                i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i),
                                0) : i.next) && !(r = r.call(i, o[1])).done)
                                    return r;
                                switch (i = 0,
                                r && (o = [2 & o[0], r.value]),
                                o[0]) {
                                case 0:
                                case 1:
                                    r = o;
                                    break;
                                case 4:
                                    return a.label++,
                                    {
                                        value: o[1],
                                        done: !1
                                    };
                                case 5:
                                    a.label++,
                                    i = o[1],
                                    o = [0];
                                    continue;
                                case 7:
                                    o = a.ops.pop(),
                                    a.trys.pop();
                                    continue;
                                default:
                                    if (!(r = a.trys,
                                    (r = r.length > 0 && r[r.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
                                        a.label = o[1];
                                        break
                                    }
                                    if (6 === o[0] && a.label < r[1]) {
                                        a.label = r[1],
                                        r = o;
                                        break
                                    }
                                    if (r && a.label < r[2]) {
                                        a.label = r[2],
                                        a.ops.push(o);
                                        break
                                    }
                                    r[2] && a.ops.pop(),
                                    a.trys.pop();
                                    continue
                                }
                                o = t.call(e, a)
                            } catch (e) {
                                o = [6, e],
                                i = 0
                            } finally {
                                n = r = 0
                            }
                        if (5 & o[0])
                            throw o[1];
                        return {
                            value: o[0] ? o[1] : void 0,
                            done: !0
                        }
                    }([o, s])
                }
            }
        }
          , gt = function() {
            function t() {
                var t = this;
                this.gameStarted = !1,
                this.SDK = new nt,
                this.gameplayStartCounter = 0,
                this.gameplayStopCounter = 0,
                this.duringGameplay = !1,
                this.init = function(e) {
                    return void 0 === e && (e = {}),
                    new Promise((function(n, r) {
                        t.SDK.init(pt({
                            onReady: function() {
                                if (E("preroll")) {
                                    var e = t.SDK.adTimings.prerollPossible;
                                    t.SDK.adTimings.prerollPossible = function() {
                                        return !0
                                    }
                                    ,
                                    t.commercialBreak(),
                                    t.SDK.adTimings.prerollPossible = e
                                }
                                n()
                            },
                            onAdblocked: r
                        }, e)),
                        it.sendMessage(i.message.sdkDetails, {
                            version: "2.278.0"
                        })
                    }
                    ))
                }
                ,
                this.initWithVideoHB = function() {
                    return t.init()
                }
                ,
                this.gameLoadingProgress = function(e) {
                    var t = {};
                    void 0 !== e.percentageDone && (t.percentageDone = Number(e.percentageDone)),
                    void 0 !== e.kbLoaded && (t.kbLoaded = Number(e.kbLoaded)),
                    void 0 !== e.kbTotal && (t.kbTotal = Number(e.kbTotal)),
                    void 0 !== e.fileNameLoaded && (t.fileNameLoaded = String(e.fileNameLoaded)),
                    void 0 !== e.filesLoaded && (t.filesLoaded = Number(e.filesLoaded)),
                    void 0 !== e.filesTotal && (t.filesTotal = Number(e.filesTotal)),
                    at.track(i.tracking.screen.gameLoadingProgress, t)
                }
                ,
                this.gameLoadingStart = function() {}
                ,
                this.gameLoadingFinished = function() {
                    var e, t, n, r, o;
                    try {
                        n = performance.getEntriesByType("resource").map((function(e) {
                            return e.transferSize
                        }
                        )).reduce((function(e, t) {
                            return e + t
                        }
                        )),
                        n += performance.getEntriesByType("navigation")[0].transferSize
                    } catch (e) {}
                    at.track(i.tracking.screen.gameLoadingFinished, {
                        transferSize: n,
                        trackers: (r = window,
                        o = [],
                        "function" != typeof r.ga && "function" != typeof r.gtag || o.push("ga"),
                        r.mixpanel && "function" == typeof r.mixpanel.track && o.push("mixpanel"),
                        "function" == typeof r.GameAnalytics && o.push("gameanalytics"),
                        (r.kongregateAPI || r.kongregate) && o.push("kongregate"),
                        r.FlurryAgent && o.push("flurry"),
                        r.Countly && o.push("countly"),
                        r.amplitude && o.push("amplitude"),
                        o).join(","),
                        error_user_id: lt(),
                        now: Math.round(null === (t = null === (e = window.performance) || void 0 === e ? void 0 : e.now) || void 0 === t ? void 0 : t.call(e)) || void 0
                    })
                }
                ,
                this.gameplayStart = function(e) {
                    t.gameplayStartCounter++,
                    t.duringGameplay = !0,
                    t.gameStarted || (t.gameStarted = !0,
                    at.track(i.tracking.screen.firstRound),
                    t.SDK.startStartAdsAfterTimer()),
                    at.track(i.tracking.screen.gameplayStart, pt(pt({}, e), {
                        playId: t.gameplayStartCounter
                    }))
                }
                ,
                this.gameInteractive = function() {
                    at.track(i.tracking.screen.gameInteractive)
                }
                ,
                this.gameplayStop = function(e) {
                    t.gameplayStopCounter++,
                    t.duringGameplay = !1,
                    at.track(i.tracking.screen.gameplayStop, pt(pt({}, e), {
                        playId: t.gameplayStartCounter,
                        stopId: t.gameplayStopCounter
                    }))
                }
                ,
                this.roundStart = function(e) {
                    void 0 === e && (e = ""),
                    e = String(e),
                    at.track(i.tracking.screen.roundStart, {
                        identifier: e
                    })
                }
                ,
                this.roundEnd = function(e) {
                    void 0 === e && (e = ""),
                    e = String(e),
                    at.track(i.tracking.screen.roundEnd, {
                        identifier: e
                    })
                }
                ,
                this.customEvent = function(e, n, r) {
                    void 0 === r && (r = {}),
                    e && n ? (e = String(e),
                    n = String(n),
                    r = pt({}, r),
                    at.track(i.tracking.custom, {
                        eventNoun: e,
                        eventVerb: n,
                        eventData: r
                    })) : t.error("customEvent", "customEvent needs at least a noun and a verb")
                }
                ,
                this.commercialBreak = function(e) {
                    return new Promise((function(n) {
                        var r = t.gameStarted ? i.ads.position.midroll : i.ads.position.preroll;
                        a.clearAnnotations(),
                        a.setDataAnnotations({
                            opportunityId: Fe(),
                            position: r
                        }),
                        at.track(i.tracking.screen.commercialBreak),
                        t.SDK.requestAd({
                            position: r,
                            onFinish: n,
                            onStart: e
                        })
                    }
                    ))
                }
                ,
                this.rewardedBreak = function(e) {
                    return new Promise((function(n) {
                        var r = i.ads.position.rewarded;
                        a.clearAnnotations(),
                        a.setDataAnnotations({
                            opportunityId: Fe(),
                            position: r
                        }),
                        at.track(i.tracking.screen.rewardedBreak),
                        t.SDK.requestAd({
                            position: r,
                            onFinish: function(e) {
                                e.length > 0 ? n(e[0].rewardAllowed) : n(!1)
                            },
                            onStart: e
                        })
                    }
                    ))
                }
                ,
                this.happyTime = function() {}
                ,
                this.muteAd = function() {
                    t.SDK.muteAd()
                }
                ,
                this.setPlayerAge = function(e) {
                    e && t.SDK.setPlayerAge(e)
                }
                ,
                this.displayAd = function(e, n, r) {
                    a.clearAnnotations();
                    var o = Fe();
                    at.track(i.tracking.screen.displayAd, {
                        size: n,
                        opportunityId: o,
                        duringGameplay: t.duringGameplay
                    }),
                    t.SDK.displayAd(e, n, o, (function() {
                        return t.duringGameplay
                    }
                    ), r)
                }
                ,
                this.logError = function(e) {
                    t.captureError(e)
                }
                ,
                this.sendHighscore = function() {}
                ,
                this.setDebugTouchOverlayController = function(e) {
                    t.SDK.debugTouchOverlayController = e
                }
                ,
                this.getLeaderboard = function() {
                    return Promise.resolve([])
                }
                ,
                this.getIsoLanguage = function() {
                    return E("iso_lang")
                }
                ,
                this.shareableURL = function(e) {
                    return void 0 === e && (e = {}),
                    new Promise((function(t, n) {
                        var r = new URLSearchParams
                          , o = Object.keys(e);
                        if (nt.GetIsPokiIFrame()) {
                            var a = E("poki_url");
                            o.forEach((function(t) {
                                r.set("gd" + t, e[t])
                            }
                            )),
                            t(a + "?" + r.toString()),
                            it.sendMessage(i.message.setPokiURLParams, {
                                params: e
                            })
                        } else
                            window.self === window.top ? (o.forEach((function(t) {
                                r.set("" + t, e[t])
                            }
                            )),
                            t("" + window.location.origin + window.location.pathname + "?" + r.toString())) : n(new Error("shareableURL only works on Poki or a top level frame"))
                    }
                    ))
                }
                ,
                this.getURLParam = function(e) {
                    return E("gd" + e) || E(e)
                }
                ,
                this.isAdBlocked = function() {
                    return t.SDK.sdkImaError
                }
                ,
                this.captureError = function(t) {
                    try {
                        st(t) ? e.report(t) : e.report(new Error(t))
                    } catch (e) {}
                }
                ,
                this.getLanguage = function() {
                    return navigator.language.toLowerCase().split("-")[0]
                }
                ,
                this.generateScreenshot = function(e) {
                    return ht(t, void 0, Promise, (function() {
                        return mt(this, (function(t) {
                            return [2, this.SDK.screenshot(e)]
                        }
                        ))
                    }
                    ))
                }
                ,
                this.warning = function(e, t) {
                    console.warn("PokiSDK." + e + ": " + t)
                }
                ,
                this.error = function(e, t) {
                    console.error("PokiSDK." + e + ": " + t)
                }
            }
            return t.prototype.setDebug = function(e) {
                void 0 === e && (e = !0),
                this.SDK.setDebug(e)
            }
            ,
            t.prototype.destroyAd = function(e) {
                this.SDK.destroyAd(e)
            }
            ,
            t.prototype.setVolume = function(e) {
                this.SDK.setVolume(e)
            }
            ,
            t
        }();
        var ft = new gt;
        for (var vt in ft)
            window.PokiSDK[vt] = ft[vt]
    }
    )()
}
)();
