var CRENDER_DEBUG = false;
if (typeof window.console == "undefined")
  window.console = { log: function () {} };
if (!window.Utils) window.Utils = {};
var Utils = Utils;
Utils.detectMobileBrowser = function () {
  return (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  );
};
Utils.getTouchStartEvent = function () {
  return Utils.isWindowsPhone() ? "MSPointerDown" : "touchstart";
};
Utils.getTouchMoveEvent = function () {
  return Utils.isWindowsPhone() ? "MSPointerMove" : "touchmove";
};
Utils.getTouchEndEvent = function () {
  return Utils.isWindowsPhone() ? "MSPointerUp" : "touchend";
};
Utils.touchScreen = Utils.detectMobileBrowser();
Utils.globalScale = 1;
Utils.globalPixelScale = 1;
Utils.isWindowHidden = false;
Utils.DOMMainContainerId = "main_container";
Utils.DOMProgressContainerId = "progress_container";
Utils.DOMProgressId = "progress";
Utils.DOMScreenBackgroundContainerId = "screen_background_container";
Utils.DOMScreenBackgroundWrapperId = "screen_background_wrapper";
Utils.DOMScreenBackgroundId = "screen_background";
Utils.DOMScreenContainerId = "screen_container";
Utils.DOMScreenWrapperId = "screen_wrapper";
Utils.DOMScreenId = "screen";
Utils.DOMP2lContainerId = "p2l_container";
Utils.DOMP2lId = "p2l";
Utils.DOMMarkId = "mark";
Utils.trace = function (ret) {
  var stack;
  try {
    throw new Error("");
  } catch (e) {
    stack = e.stack || "";
  }
  stack = stack.split("\n");
  stack.splice(0, 2);
  stack = stack.join("\n");
  if (!ret) console.log(stack);
  return stack;
};
Utils.setCookie = function (name, value) {
  try {
    window.localStorage.setItem(name, value);
  } catch (e) {
    var exp = new Date();
    exp.setDate(exp.getDate() + 365 * 10);
    document.cookie = name + "=" + value + "; expires=" + exp.toUTCString();
  }
};
Utils.getCookie = function (name) {
  var ret;
  try {
    ret = window.localStorage.getItem(name);
  } catch (e) {
    var prefix = name + "=";
    var cookieStartIndex = document.cookie.indexOf(prefix);
    if (cookieStartIndex == -1) return null;
    var cookieEndIndex = document.cookie.indexOf(
      ";",
      cookieStartIndex + prefix.length
    );
    if (cookieEndIndex == -1) cookieEndIndex = document.cookie.length;
    ret = unescape(
      document.cookie.substring(
        cookieStartIndex + prefix.length,
        cookieEndIndex
      )
    );
  }
  return ret;
};
Utils.bindEvent = function (el, eventName, eventHandler) {
  if (el.addEventListener) el.addEventListener(eventName, eventHandler, false);
  else if (el.attachEvent)
    el.attachEvent("on" + eventName.toLowerCase(), eventHandler);
};
Utils.unbindEvent = function (el, eventName, eventHandler) {
  if (el.removeEventListener)
    el.removeEventListener(eventName, eventHandler, false);
  else if (el.detachEvent) el.detachEvent("on" + eventName, eventHandler);
};
Utils.getObjectLeft = function (element) {
  var result = element.offsetLeft;
  if (element.offsetParent) result += Utils.getObjectLeft(element.offsetParent);
  return result;
};
Utils.getObjectTop = function (element) {
  var result = element.offsetTop;
  if (element.offsetParent) result += Utils.getObjectTop(element.offsetParent);
  return result;
};
Utils.parseGet = function () {
  var get = {};
  var s = window.location.toString();
  var p = window.location.toString().indexOf("?");
  var tmp, params;
  if (p >= 0) {
    s = s.substr(p + 1, s.length);
    params = s.split("&");
    for (var i = 0; i < params.length; i++) {
      tmp = params[i].split("=");
      get[tmp[0]] = tmp[1];
    }
  }
  return get;
};
Utils.getMouseCoord = function (event, object) {
  var e = event || window.event;
  if (e.touches) e = e.touches[0];
  if (!e) return { x: 0, y: 0 };
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
    mouseX =
      e.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft) -
      document.documentElement.clientLeft;
    mouseY =
      e.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop) -
      document.documentElement.clientTop;
  }
  var retX = mouseX - x;
  var retY = mouseY - y;
  return { x: retX, y: retY };
};
Utils.removeFromArray = function (arr, item) {
  var tmp = [];
  for (var i = 0; i < arr.length; i++) if (arr[i] != item) tmp.push(arr[i]);
  return tmp;
};
Utils.showLoadProgress = function (val) {
  var scl = Utils.globalScale;
  var s = "Loading: " + val + "%";
  s += "<br><br>";
  s +=
    '<div style="display: block; background: #000; width: ' +
    val * scl * 2 +
    "px; height: " +
    10 * scl +
    'px;">&nbsp;</div>';
  document.getElementById(Utils.DOMProgressId).innerHTML = s;
};
Utils.hideAddressBarLock = false;
Utils.mobileHideAddressBar = function () {
  if (Utils.hideAddressBarLock) return;
  window.scrollTo(0, 1);
};
Utils.mobileCheckIphone4 = function () {
  return (
    Utils.touchScreen &&
    navigator.userAgent.indexOf("iPhone") >= 0 &&
    window.devicePixelRatio == 2
  );
};
Utils.mobileCheckBrokenAndroid = function () {
  return (
    Utils.touchScreen &&
    Utils.isAndroid() &&
    !Utils.isChrome() &&
    !Utils.isFirefox()
  );
};
Utils.mobileCheckSlowDevice = function () {
  return (
    (Utils.mobileCheckBrokenAndroid() &&
      navigator.userAgent.toLowerCase().indexOf("sm-t310") >= 0) ||
    (Utils.touchScreen &&
      Utils.isAndroid() &&
      Utils.isFirefox() &&
      navigator.userAgent.toLowerCase().indexOf("sm-t310") >= 0)
  );
};
Utils.isChrome = function () {
  var ret = false;
  if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
    ret = true;
    if (Utils.isAndroid()) {
      var version =
        parseInt((/Chrome\/([0-9]+)/.exec(navigator.appVersion) || 0)[1], 10) ||
        0;
      if (version < 22) ret = false;
    }
  }
  return ret;
};
Utils.isAndroid = function () {
  return navigator.userAgent.toLowerCase().indexOf("android") >= 0;
};
Utils.isIOS = function () {
  return !Utils.isWindowsPhone() &&
    navigator.userAgent.toLowerCase().match(/(ipad|iphone|ipod)/g)
    ? true
    : false;
};
Utils.isPlayFreeBrowser = function () {
  return navigator.userAgent.toLowerCase().indexOf("playfreebrowser") >= 0;
};
Utils.isFirefox = function () {
  return navigator.userAgent.toLowerCase().indexOf("firefox") >= 0;
};
Utils.isIE = function () {
  return (
    navigator.userAgent.toLowerCase().indexOf("MSIE") >= 0 ||
    navigator.appName == "Microsoft Internet Explorer"
  );
};
Utils.isWindowsPhone = function () {
  return navigator.userAgent.toLowerCase().indexOf("windows phone") >= 0;
};
Utils.disableCorrectPixelRatio = false;
Utils.mobileCorrectPixelRatio = function () {
  if (Utils.isWindowsPhone()) return;
  var head = document.getElementsByTagName("head")[0];
  var list = head.getElementsByTagName("meta");
  var newTag = true,
    meta = null,
    content = "";
  for (var i = 0; i < list.length; i++)
    if (list[i].name == "viewport") {
      meta = list[i];
      newTag = false;
      break;
    }
  if (newTag) {
    meta = document.createElement("meta");
    meta.name = "viewport";
  }
  content += "width=device-width, user-scalable=no";
  var scale = 1 / (window.devicePixelRatio ? window.devicePixelRatio : 1);
  scale = scale.toFixed(2);
  if (Utils.disableCorrectPixelRatio) scale = 1;
  content +=
    ", initial-scale=" +
    scale +
    ", maximum-scale=" +
    scale +
    ", minimum-scale=" +
    scale;
  meta.content = content;
  if (newTag) document.getElementsByTagName("head")[0].appendChild(meta);
};
Utils.getMobileScreenResolution = function (landscape) {
  var scale = 1;
  var w = window.innerWidth;
  var h = window.innerHeight;
  if (!w || !h) {
    w = screen.width;
    h = screen.height;
  }
  var scale = 1;
  if (Utils.disableCorrectPixelRatio)
    scale = window.devicePixelRatio ? window.devicePixelRatio : 1;
  w *= scale;
  h *= scale;
  var scales = [
    { scale: 1, width: 320, height: 480 },
    { scale: 1.5, width: 480, height: 720 },
    { scale: 2, width: 640, height: 960 },
  ];
  var container = { width: 0, height: 0 };
  var prop = "";
  if (Utils.touchScreen) {
    container.width = Math.min(w, h);
    container.height = Math.max(w, h);
    prop = "height";
  } else {
    if (landscape)
      var scales = [
        { scale: 1, width: 480, height: 320 },
        { scale: 1.5, width: 720, height: 480 },
        { scale: 2, width: 960, height: 640 },
      ];
    container.width = w;
    container.height = h;
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
};
Utils.getScaleScreenResolution = function (scale, landscape) {
  var w = Math.round(320 * scale);
  var h = Math.round(480 * scale);
  return { width: landscape ? h : w, height: landscape ? w : h, scale: scale };
};
Utils.imagesRoot = "images";
Utils.initialResolution = { width: 320, height: 480, scale: 1 };
Utils.ignoreMobileHeightCorrection = false;
Utils.createLayout = function (container, resolution, debug, ignoreCanvas) {
  var scl = Utils.globalScale;
  Utils.initialResolution = resolution;
  var height = window.innerHeight;
  document.body.style.overflow = "hidden";
  var s = "";
  s +=
    '<div id="' +
    Utils.DOMProgressContainerId +
    '" align="center" style="width: 100%; height: ' +
    height +
    'px; display: block; width: 100%; position: absolute; left: 0px; top: 0px;">';
  s +=
    '<table cellspacing="0" cellpadding="0" border="0"><tr><td id="' +
    Utils.DOMProgressId +
    '" align="center" valign="middle" style="width: ' +
    resolution.width +
    "px; height: " +
    resolution.height +
    "px; color: #000; background: #fff; font-weight: bold; font-family: Verdana; font-size: " +
    12 * scl +
    'px; vertical-align: middle; box-sizing: border-box"></td></tr></table>';
  s += "</div>";
  s +=
    '<div id="' +
    Utils.DOMScreenBackgroundContainerId +
    '" style="width: 100%; height: ' +
    height +
    'px; position: absolute; left: 0px; top: 0px; display: none; z-index: 2;">';
  s +=
    '<div id="' +
    Utils.DOMScreenBackgroundWrapperId +
    '" style="width: ' +
    resolution.width +
    "px; height: " +
    resolution.height +
    'px; position: relative; left: 0px; overflow: hidden;">';
  if (!ignoreCanvas)
    s +=
      '<canvas id="' +
      Utils.DOMScreenBackgroundId +
      '" width="' +
      resolution.width +
      '" height="' +
      resolution.height +
      '" style="transform: translateZ(0)"></canvas>';
  s += "</div>";
  s += "</div>";
  s +=
    '<div id="' +
    Utils.DOMScreenContainerId +
    '" style="width: 100%; height: ' +
    height +
    'px; position: absolute; left: 0px; top: 0px; display: none; z-index: 3;">';
  s +=
    '<div id="' +
    Utils.DOMScreenWrapperId +
    '" width="' +
    resolution.width +
    '" height="' +
    resolution.height +
    '" style="width: ' +
    resolution.width +
    "px; height: " +
    resolution.height +
    'px; position: relative; left: 0px; overflow: hidden;">';
  if (!ignoreCanvas)
    s +=
      '<canvas id="' +
      Utils.DOMScreenId +
      '" style="position: absolute; left: 0px; top: 0px;" width="' +
      resolution.width +
      '" height="' +
      resolution.height +
      '">You browser does not support this application :(</canvas>';
  s += "</div>";
  s += "</div>";
  container.innerHTML = s;
  var p = document.createElement("div");
  p.setAttribute("id", Utils.DOMP2lContainerId);
  p.setAttribute("align", "center");
  var w = resolution.width;
  p.setAttribute(
    "style",
    "width: 100%; height: " +
      height +
      "px; position: absolute; left: 0px; top: 0px; visibility: hidden; z-index: 1000; background-color: #fff; background-image: url(" +
      Utils.imagesRoot +
      "/p2l.jpg); background-repeat: no-repeat; background-position: center center"
  );
  var img = document.createElement("img");
  img.setAttribute("id", Utils.DOMP2lId);
  img.width = 1;
  img.height = 1;
  img.style.display = "none";
  p.appendChild(img);
  document.body.appendChild(p);
  var m = document.createElement("div");
  m.setAttribute("id", Utils.DOMMarkId);
  m.style.position = "fixed";
  m.style.right = "0px";
  m.style.bottom = "0px";
  m.style.width = "1px";
  m.style.height = "1px";
  m.style.background = "";
  m.style.zIndex = "100000";
  document.body.appendChild(m);
  Utils.fitLayoutToScreen();
};
Utils.showMainLayoutContent = function () {
  document.getElementById(Utils.DOMProgressContainerId).style.display = "none";
  document.getElementById(Utils.DOMScreenContainerId).style.display = "block";
  document.getElementById(Utils.DOMScreenBackgroundContainerId).style.display =
    "block";
};
Utils.preventEvent = function (e) {
  e.preventDefault();
  e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
};
Utils.touchStartEventDisabled = false;
Utils.preventTouchStart = function () {
  if (!Utils.touchStartEventDisabled) return;
  Utils.bindEvent(
    document.body,
    Utils.getTouchStartEvent(),
    Utils.preventEvent
  );
};
Utils.removePreventTouchStart = function () {
  if (!Utils.touchStartEventDisabled) return;
  Utils.unbindEvent(
    document.body,
    Utils.getTouchStartEvent(),
    Utils.preventEvent
  );
};
Utils.addMobileListeners = function (landscape, ignoreIOS7) {
  if (
    ignoreIOS7 ||
    !navigator.userAgent.match(/(iPad|iPhone|iPod).*CPU.*OS 7_\d/i)
  ) {
    Utils.touchStartEventDisabled = true;
    Utils.preventTouchStart();
  }
  if (!Utils.isPlayFreeBrowser())
    Utils.bindEvent(window, "scroll", function (e) {
      setTimeout(Utils.mobileHideAddressBar, 300);
    });
  document.addEventListener(
    Utils.getVisibiltyProps().visibilityChange,
    Utils.handleVisibilityChange,
    false
  );
  setInterval(
    "Utils.checkOrientation(" + (landscape ? "true" : "false") + ")",
    500
  );
  setTimeout(Utils.mobileHideAddressBar, 500);
};
Utils.handleVisibilityChange = function () {
  Utils.isWindowHidden = document[Utils.getVisibiltyProps().hidden];
  Utils.dispatchEvent(Utils.isWindowHidden ? "hidewindow" : "showwindow");
};
Utils.getVisibiltyProps = function () {
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
  return { hidden: hidden, visibilityChange: visibilityChange };
};
Utils.staticWindowRect = null;
Utils.setWindowRect = function (width, height) {
  Utils.staticWindowRect = { width: width, height: height };
};
Utils.getWindowRect = function () {
  var d = document.getElementById(Utils.DOMMarkId);
  if (Utils.isAndroid() && d)
    return { width: window.innerWidth, height: d.offsetTop + 1 };
  return { width: window.innerWidth, height: window.innerHeight };
};
Utils.storeOrient = null;
Utils.noCheckOrient = false;
Utils.checkOrientation = function (landscape) {
  if (!Utils.touchScreen) return;
  if (!document.getElementById(Utils.DOMScreenContainerId)) return;
  if (Utils.noCheckOrient || Utils.parseGet().nocheckorient == 1) return;
  var rect = Utils.getWindowRect();
  var orient = rect.width > rect.height;
  if (Utils.storeOrient === orient) return;
  Utils.storeOrient = orient;
  var ok = orient == landscape;
  if (!ok) {
    Utils.dispatchEvent("lockscreen");
    document.getElementById(Utils.DOMP2lContainerId).style.visibility =
      "visible";
    document.getElementById(Utils.DOMProgressContainerId).style.visibility =
      "hidden";
    document.getElementById(
      Utils.DOMScreenBackgroundContainerId
    ).style.display = "none";
    document.getElementById(Utils.DOMScreenContainerId).style.display = "none";
  } else {
    Utils.dispatchEvent("unlockscreen");
    document.getElementById(Utils.DOMP2lContainerId).style.visibility =
      "hidden";
    document.getElementById(Utils.DOMProgressContainerId).style.visibility =
      "visible";
    document.getElementById(
      Utils.DOMScreenBackgroundContainerId
    ).style.display = "block";
    document.getElementById(Utils.DOMScreenContainerId).style.display = "block";
  }
  setTimeout(Utils.mobileHideAddressBar, 900);
  setTimeout(Utils.fitLayoutToScreen, 1e3);
};
Utils.fitLayoutTimer = null;
Utils.addFitLayoutListeners = function () {
  Utils.fitLayoutTimer = setInterval(Utils.fitLayoutToScreen, 500);
};
Utils.removeFitLayoutListeners = function () {
  clearInterval(Utils.fitLayoutTimer);
};
Utils.fitLayoutLock = false;
Utils.fitLayoutCorrectHeight = 0;
Utils.fitLayoutAlign = "center";
Utils.fitLayoutVerticalAlign = "top";
Utils.layoutMargin = { left: 0, right: 0, top: 0, bottom: 0 };
Utils.fitLayoutToScreen = function (container) {
  if (Utils.fitLayoutLock) return;
  var p, s, width, height, windowRect, realWindowRect;
  realWindowRect = Utils.getWindowRect();
  if (typeof container != "object" || !container.width) {
    windowRect = Utils.staticWindowRect
      ? Utils.staticWindowRect
      : realWindowRect;
    width = windowRect.width;
    height = windowRect.height;
    height += Utils.fitLayoutCorrectHeight;
    height -= Utils.layoutMargin.top;
    height -= Utils.layoutMargin.bottom;
    width -= Utils.layoutMargin.left;
    width -= Utils.layoutMargin.right;
    container = { width: width, height: height };
  }
  if (!container.width || !container.height) return;
  s = document.getElementById(Utils.DOMScreenWrapperId);
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
  scale = scaleX < scaleY ? scaleX : scaleY;
  Utils.globalPixelScale = scale;
  width = Math.floor(width * scale);
  height = Math.floor(height * scale);
  if (
    s.lastWidth == container.width &&
    s.lastHeight == container.height &&
    s.lastRealWidth == realWindowRect.width &&
    s.lastRealHeight == realWindowRect.height
  )
    return;
  s.lastWidth = container.width;
  s.lastHeight = container.height;
  s.lastRealWidth = realWindowRect.width;
  s.lastRealHeight = realWindowRect.height;
  Utils.resizeElement(Utils.DOMScreenId, width, height);
  Utils.resizeElement(Utils.DOMScreenBackgroundId, width, height);
  Utils.resizeElement(
    Utils.DOMProgressContainerId,
    windowRect.width,
    windowRect.height
  );
  Utils.resizeElement(Utils.DOMProgressId, width, height);
  s = Utils.resizeElement(Utils.DOMScreenWrapperId, width, height);
  Utils.alignElement(s, realWindowRect, width, height);
  s = Utils.resizeElement(Utils.DOMScreenBackgroundWrapperId, width, height);
  Utils.alignElement(s, realWindowRect, width, height);
  Utils.resizeElement(
    Utils.DOMP2lContainerId,
    windowRect.width,
    windowRect.height
  );
  Utils.resizeElement(
    Utils.DOMScreenContainerId,
    windowRect.width,
    windowRect.height
  );
  Utils.resizeElement(
    Utils.DOMScreenBackgroundContainerId,
    windowRect.width,
    windowRect.height
  );
  var sz = Math.floor(
    Math.min(realWindowRect.width, realWindowRect.height) / 2
  );
  s = document.getElementById(Utils.DOMP2lContainerId);
  if (s) s.style.backgroundSize = sz + "px " + sz + "px";
  Utils.dispatchEvent("fitlayout");
  if (Utils.isPlayFreeBrowser()) window.scrollTo(1, 2);
  setTimeout(Utils.mobileHideAddressBar, 10);
};
Utils.alignElement = function (s, windowRect, width, height) {
  if (!s) return;
  if (Utils.fitLayoutAlign == "left")
    s.style.left = Utils.layoutMargin.left + "px";
  else if (Utils.fitLayoutAlign == "right")
    s.style.left =
      Math.floor(windowRect.width - width - Utils.layoutMargin.right) + "px";
  else
    s.style.left =
      Math.floor(
        (windowRect.width -
          width -
          Utils.layoutMargin.left -
          Utils.layoutMargin.right) /
          2
      ) + "px";
  if (Utils.fitLayoutVerticalAlign == "top")
    s.style.top = Utils.layoutMargin.top + "px";
  else if (Utils.fitLayoutVerticalAlign == "bottom")
    s.style.top =
      Math.floor(windowRect.height - height - Utils.layoutMargin.bottom) + "px";
  else
    s.style.top =
      Math.floor(
        (windowRect.height -
          height -
          Utils.layoutMargin.top -
          Utils.layoutMargin.bottom) /
          2
      ) + "px";
};
Utils.resizeElement = function (id, width, height) {
  var s = document.getElementById(id);
  if (!s) return null;
  s.style.width = Math.floor(width) + "px";
  s.style.height = Math.floor(height) + "px";
  return s;
};
Utils.drawIphoneLimiter = function (stage, landscape) {
  if (landscape)
    stage.drawRectangle(240, 295, 480, 54, "#f00", true, 0.5, true);
  else stage.drawRectangle(160, 448, 320, 64, "#f00", true, 0.5, true);
};
Utils.drawGrid = function (stage, landscape, col) {
  if (typeof landscape == "undefined") landscape = false;
  var dx = 10;
  var dy = 10;
  if (typeof col == "undefined") col = "#FFF";
  var w = 1;
  var s = { w: landscape ? 480 : 320, h: landscape ? 320 : 480 };
  for (var x = dx; x < s.w; x += dx) {
    var o = 0.1 + 0.1 * (((x - dx) / dx) % 10);
    stage.drawLine(x, 0, x, s.h, w, col, o);
  }
  for (var y = dy; y < s.h; y += dy) {
    var o = 0.1 + 0.1 * (((y - dy) / dy) % 10);
    stage.drawLine(0, y, s.w, y, w, col, o);
  }
};
Utils.drawScaleFix = function (stage, landscape) {
  if (Utils.globalScale == 0.75)
    if (landscape)
      stage.drawRectangle(507, 160, 54, 320, "#000", true, 1, true);
    else stage.drawRectangle(160, 507, 320, 54, "#000", true, 1, true);
  if (Utils.globalScale == 1.5)
    if (landscape)
      stage.drawRectangle(510, 160, 60, 320, "#000", true, 1, true);
    else stage.drawRectangle(160, 510, 320, 60, "#000", true, 1, true);
};
Utils.grad2radian = function (val) {
  return val / (180 / Math.PI);
};
Utils.radian2grad = function (val) {
  return val * (180 / Math.PI);
};
Utils.eventsListeners = [];
Utils.onlockscreen = null;
Utils.onunlockscreen = null;
Utils.onhidewindow = null;
Utils.onshowwindow = null;
Utils.onfitlayout = null;
Utils.addEventListener = function (type, callback) {
  EventsManager.addEvent(Utils, type, callback);
};
Utils.removeEventListener = function (type, callback) {
  EventsManager.removeEvent(Utils, type, callback);
};
Utils.dispatchEvent = function (type, params) {
  return EventsManager.dispatchEvent(Utils, type, params);
};
Utils.isArray = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};
Utils.isPlainObject = function (obj) {
  if (!obj || !obj.constructor) return false;
  return obj.constructor === Object;
};
Utils.getFunctionArguments = function (arg, from) {
  if (typeof from == "undefined") from = 0;
  return [].slice.call(arg, from);
};
Utils.proxy = function (fn, context) {
  var p = function () {
    var args = [];
    for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
    return fn.apply(context || this, args);
  };
  return p;
};
Utils.extend = function (Child, Parent) {
  var F = function () {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.superclass = Parent.prototype;
};
Utils.callSuperConstructor = function (fn, context) {
  var args = [];
  for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);
  fn.superclass.constructor.apply(context, args);
};
Utils.callSuperMethod = function (fn, context, method) {
  var args = [];
  for (var i = 3; i < arguments.length; i++) args.push(arguments[i]);
  return fn.superclass[method].apply(context, args);
};
Utils.copyObjectProps = function (objFrom, objTo) {
  for (var i in objFrom) {
    if (!objFrom.hasOwnProperty(i)) continue;
    if (Utils.isArray(objFrom[i])) {
      objTo[i] = [];
      for (var n = 0; n < objFrom[i].length; n++) {
        if (typeof objFrom[i][n] == "object")
          objTo[i][n] = Utils.cloneEmptyObject(objFrom[i][n]);
        Utils.copyObjectProps(objFrom[i][n], objTo[i][n]);
      }
      continue;
    }
    if (Utils.isPlainObject(objFrom[i])) {
      objTo[i] = {};
      Utils.copyObjectProps(objFrom[i], objTo[i]);
      continue;
    }
    objTo[i] = objFrom[i];
  }
};
Utils.cloneEmptyObject = function (obj) {
  if (obj.constructor) return new obj.constructor();
  return {};
};
Utils.clone = function (obj) {
  if (!obj || typeof obj != "object") return obj;
  var clone = Utils.cloneEmptyObject(obj);
  Utils.copyObjectProps(obj, clone);
  return clone;
};
Utils.switchToTimeMode = function (delta) {
  Tween.STEP_TYPE = Tween.STEP_BY_TIME;
  StageTimer.TIMEOUT_TYPE = StageTimer.TIMEOUT_BY_TIME;
  Sprite.CHANGE_FRAME_TYPE = Sprite.CHANGE_FRAME_BY_TIME;
  Sprite.CHANGE_FRAME_DELAY = delta;
};
Utils.getGameID = function () {
  if (window.GAME_ID && window.GAME_ID != "my_game") return window.GAME_ID;
  var s = window.location.toString(),
    tmp = s.split("/"),
    id = "",
    name;
  while (!id) {
    id = tmp.pop();
    if (id.split(".").length > 1) id = "";
    if (tmp.length == 0) id = "my_game";
  }
  return id;
};
Utils.ajax = function (
  url,
  method,
  params,
  dataType,
  successCallback,
  failCallback
) {
  var xmlhttp,
    isXDomainRequest = false;
  function finalizeResponse(ret) {
    if (dataType == "json") ret = JSON.parse(ret);
    if (dataType == "xml") ret = Utils.parseXMLString(ret);
    if (successCallback) successCallback(ret, xmlhttp);
  }
  if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
  else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  if (Utils.isIE() && window.XDomainRequest && !document.addEventListener) {
    var a = document.createElement("a");
    a.href = url;
    if (
      window.location.hostname &&
      a.hostname &&
      window.location.hostname != a.hostname
    ) {
      xmlhttp = new XDomainRequest();
      isXDomainRequest = true;
    }
  }
  if (isXDomainRequest) {
    xmlhttp.onload = function () {
      finalizeResponse(xmlhttp.responseText);
    };
    xmlhttp.onerror = function () {
      if (failCallback) failCallback(1, xmlhttp);
    };
    xmlhttp.ontimeout = function () {
      if (failCallback) failCallback(0, xmlhttp);
    };
  } else
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        var ret = xmlhttp.responseText;
        if ((xmlhttp.status == 200 || xmlhttp.status == 0) && ret)
          finalizeResponse(ret);
        else if (failCallback) failCallback(xmlhttp.status, xmlhttp);
      }
    };
  if (params) {
    if (typeof params != "string") {
      var p = [];
      for (var i in params)
        p.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
      params = p.join("&");
    }
  } else params = "";
  if (!method) method = "GET";
  xmlhttp.open(method, url + (method == "GET" ? "?" + params : ""), true);
  if (method == "POST" && !isXDomainRequest)
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
  xmlhttp.send(method != "GET" ? params : null);
};
Utils.get = function (url, params, dataType, successCallback, failCallback) {
  Utils.ajax(url, "GET", params, dataType, successCallback, failCallback);
};
Utils.post = function (url, params, dataType, successCallback, failCallback) {
  Utils.ajax(url, "POST", params, dataType, successCallback, failCallback);
};
Utils.getBezierBasis = function (i, n, t) {
  function f(n) {
    return n <= 1 ? 1 : n * f(n - 1);
  }
  return (f(n) / (f(i) * f(n - i))) * Math.pow(t, i) * Math.pow(1 - t, n - i);
};
Utils.getBezierCurve = function (points, step) {
  if (typeof step == "undefined") step = 0.1;
  var res = [];
  step = step / points.length;
  for (var t = 0; t < 1 + step; t += step) {
    if (t > 1) t = 1;
    var ind = res.length;
    res[ind] = { x: 0, y: 0 };
    for (var i = 0; i < points.length; i++) {
      var b = Utils.getBezierBasis(i, points.length - 1, t);
      res[ind].x += points[i].x * b;
      res[ind].y += points[i].y * b;
    }
  }
  return res;
};
Utils.parseXMLString = function (data) {
  var xml = null;
  if (typeof window.DOMParser != "undefined")
    xml = new window.DOMParser().parseFromString(data, "text/xml");
  else if (
    typeof window.ActiveXObject != "undefined" &&
    new window.ActiveXObject("Microsoft.XMLDOM")
  ) {
    xml = new window.ActiveXObject("Microsoft.XMLDOM");
    xml.async = "false";
    xml.loadXML(data);
  } else throw new Error("No XML parser found");
  return xml;
};
Utils.gotoFullScreen = function () {
  var element = document.documentElement;
  if (element.requestFullscreen) element.requestFullscreen();
  if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
  if (element.mozRequestFullScreen) element.mozRequestFullScreen();
  if (element.msRequestFullscreen) element.msRequestFullscreen();
};
Utils.cancelFullScreen = function () {
  if (document.cancelFullScreen) document.cancelFullScreen();
  if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
  if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  if (document.msExitFullscreen) document.msExitFullscreen();
  if (document.exitFullscreen) document.exitFullscreen();
};
Utils.isFullScreen = function () {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};
Utils.isFullScreenEnabled = function () {
  return !!(
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
  );
};
Utils.toggleFullScreen = function () {
  if (Utils.isFullScreen()) Utils.cancelFullScreen();
  else Utils.gotoFullScreen();
};
Utils.sign = function (val) {
  if (val == 0) return 0;
  return val > 0 ? 1 : -1;
};
function ImagesPreloader() {
  this.curItem = -1;
  this.loadedImages = {};
  this.data = null;
  this.endCallback = null;
  this.processCallback = null;
  this.minProgressVal = 0;
  this.maxProgressVal = 100;
  this.wait = Utils.proxy(this.wait, this);
}
ImagesPreloader.prototype.load = function (data, endCallback, processCallback) {
  this.data = data;
  this.endCallback = endCallback;
  this.processCallback = processCallback;
  for (var i = 0; i < this.data.length; i++) {
    var item = this.data[i];
    var img = new Image();
    img.src = item.src;
    this.loadedImages[item.name] = img;
  }
  this.wait();
};
ImagesPreloader.prototype.wait = function () {
  var itemsLoaded = 0;
  var itemsTotal = 0;
  for (var key in this.loadedImages) {
    if (this.loadedImages[key].complete) itemsLoaded++;
    itemsTotal++;
  }
  if (itemsLoaded >= itemsTotal) {
    if (this.endCallback) this.endCallback(this.loadedImages);
    return;
  } else {
    if (this.processCallback)
      this.processCallback(
        Math.floor(
          (itemsLoaded / itemsTotal) * this.maxProgressVal + this.minProgressVal
        )
      );
    setTimeout(this.wait, 50);
  }
};
function SoundsPreloader(sounds, endCallback, progressCallback) {
  this.sounds = sounds;
  this.endCallback = endCallback;
  this.progressCallback = progressCallback;
  this.loadedCount = 0;
  this.minProgressVal = 0;
  this.maxProgressVal = 100;
}
SoundsPreloader.prototype.isMp3Support = function () {
  return document.createElement("audio").canPlayType("audio/mpeg") != "";
};
SoundsPreloader.prototype.isWebAudio = function () {
  return Boolean(window.AudioMixer) && AudioMixer.isWebAudioSupport();
};
SoundsPreloader.prototype.load = function (
  sounds,
  endCallback,
  progressCallback
) {
  if (sounds) this.sounds = sounds;
  if (endCallback) this.endCallback = endCallback;
  if (progressCallback) this.progressCallback = progressCallback;
  if (!this.sounds || this.sounds.length < 1 || !this.isWebAudio()) {
    if (this.endCallback) this.endCallback();
    return;
  }
  var ext = this.isMp3Support() ? "mp3" : "ogg";
  var xmlhttp, src, wrapper;
  this.loadedCount = 0;
  var self = this;
  for (var i = 0; i < this.sounds.length; i++) {
    src = this.sounds[i] + "." + ext;
    if (this.isWebAudio()) {
      if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
      else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      xmlhttp.open("GET", src, true);
      xmlhttp.responseType = "arraybuffer";
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
          var url = this.soundSrc;
          if (!AudioMixer.waContext) AudioMixer.waContext = new AudioContext();
          AudioMixer.waContext.decodeAudioData(
            this.response,
            function (buffer) {
              AudioMixer.buffer[url] = buffer;
              self.soundIsLoaded(null, self);
            },
            function (err) {
              self.soundIsLoaded(null, self);
            }
          );
        }
        if (this.readyState == 4 && this.status == 404)
          self.soundIsLoaded(null, self);
      };
      xmlhttp.soundSrc = src;
      xmlhttp.send();
    } else {
      wrapper = document.createElement("audio");
      wrapper.src = src;
      wrapper.type = ext == "mp3" ? "audio/mpeg" : "audio/ogg";
      wrapper.preload = "auto";
      wrapper.load();
      wrapper.addEventListener(
        "canplay",
        Utils.proxy(this.soundIsLoaded, wrapper, this)
      );
      wrapper.addEventListener(
        "canplaythrough",
        Utils.proxy(this.soundIsLoaded, wrapper, this)
      );
    }
  }
};
SoundsPreloader.prototype.soundIsLoaded = function (e, self) {
  if (this.nodeName && this.nodeName.toLowerCase() == "audio") {
    if (this.alreadyLoaded) return;
    this.alreadyLoaded = true;
  }
  self.loadedCount++;
  if (self.progressCallback)
    self.progressCallback(
      Math.floor(
        (self.loadedCount / self.sounds.length) * self.maxProgressVal +
          self.minProgressVal
      )
    );
  if (self.loadedCount >= self.sounds.length)
    if (self.endCallback) self.endCallback();
};
function Asset(name, src, w, h, f, l) {
  this.name = name + "";
  this.src = src + "";
  this.width = w;
  this.height = h;
  this.frames = f;
  this.layers = l;
  this.bitmap = null;
  this.object = null;
  this.ready = !!(this.width && this.height);
  this.spriteClass = null;
}
Asset.prototype.detectSize = function () {
  if (!this.bitmap) return false;
  try {
    if (isNaN(this.width))
      this.width = this.bitmap.width ? parseInt(this.bitmap.width) : 0;
    if (isNaN(this.height))
      this.height = this.bitmap.height ? parseInt(this.bitmap.height) : 0;
  } catch (e) {
    if (CRENDER_DEBUG) console.log(e);
  }
  return !isNaN(this.width) && !isNaN(this.height);
};
Asset.prototype.normalize = function (scale) {
  if (this.ready) return;
  if (!this.detectSize()) return;
  if (isNaN(this.frames) || this.frames < 1) this.frames = 1;
  if (isNaN(this.layers) || this.layers < 1) this.layers = 1;
  this.width = Math.ceil(this.width / this.layers / scale);
  this.height = Math.ceil(this.height / this.frames / scale);
  this.ready = true;
};
function AssetsLibrary(path, scale, assets) {
  this.path = "images";
  this.scale = 1;
  this.items = {};
  this.bitmaps = {};
  this.loaded = false;
  this.onload = null;
  this.onloadprogress = null;
  this.spriteClass = Sprite;
  this.onLoadHandler = Utils.proxy(this.onLoadHandler, this);
  this.onLoadProgressHandler = Utils.proxy(this.onLoadProgressHandler, this);
  this.init(path, scale);
  this.addAssets(assets);
}
AssetsLibrary.prototype.init = function (path, scale) {
  if (typeof path != "undefined") this.path = path + "";
  if (typeof scale != "undefined") {
    this.scale = parseFloat(scale);
    if (isNaN(this.scale)) this.scale = 1;
  }
};
AssetsLibrary.prototype.load = function (
  onload,
  onloadprogress,
  minProgressVal,
  maxProgressVal
) {
  this.onload = onload;
  this.onloadprogress = onloadprogress;
  var preloader = new ImagesPreloader();
  var data = [];
  for (var n in this.items) data.push(this.items[n]);
  if (typeof minProgressVal != "undefined")
    preloader.minProgressVal = minProgressVal;
  if (typeof maxProgressVal != "undefined")
    preloader.maxProgressVal = maxProgressVal;
  preloader.load(data, this.onLoadHandler, this.onLoadProgressHandler);
};
AssetsLibrary.prototype.onLoadProgressHandler = function (val) {
  if (typeof this.onloadprogress == "function") this.onloadprogress(val);
};
AssetsLibrary.prototype.onLoadHandler = function (data) {
  this.loaded = true;
  for (var n in data) {
    var bmp = data[n];
    var asset = this.items[n];
    asset.bitmap = bmp;
    asset.normalize(this.scale);
  }
  if (typeof this.onload == "function") this.onload(this.items);
};
AssetsLibrary.prototype.addAssets = function (data) {
  if (typeof data == "undefined") return;
  if (typeof data != "object") return;
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    item.noscale = typeof item.noscale == "undefined" ? false : item.noscale;
    if (!item.noscale) item.src = "%SCALE%/" + item.src;
    this.addAsset(item);
  }
};
AssetsLibrary.prototype.addAsset = function (src, name, w, h, f, l) {
  function src2name(src) {
    var name = src.split("/");
    name = name.pop();
    name = name.split(".");
    name = name.shift() + "";
    return name;
  }
  var spriteClass = null,
    properties = null;
  if (typeof src == "object" && arguments.length == 1) {
    name = src.name;
    w = src.width || NaN;
    h = src.height || NaN;
    f = src.frames || 1;
    l = src.layers || 1;
    spriteClass = src.spriteClass || null;
    properties = src.properties || null;
    src = src.src;
  }
  src = src.replace("%SCALE%", "%PATH%/" + this.scale);
  src = src.replace("%PATH%", this.path);
  if (typeof name == "undefined") name = src2name(src);
  var asset = new Asset(name, src, w, h, f, l);
  asset.spriteClass = spriteClass;
  if (properties)
    for (var prop in properties)
      if (typeof asset[prop] == "undefined") asset[prop] = properties[prop];
  this.items[name] = asset;
  return asset;
};
AssetsLibrary.prototype.addObject = function (obj) {
  var asset = this.addAsset(
    "%SCALE%/" + obj.image,
    obj.name,
    obj.width * this.scale,
    obj.height * this.scale,
    obj.frames,
    obj.layers
  );
  if (asset) asset.object = obj;
  return asset;
};
AssetsLibrary.prototype.getAsset = function (name, checkLoad) {
  var asset = null;
  if (typeof this.items[name] != "undefined" && this.items[name].bitmap) {
    checkLoad = typeof checkLoad == "undefined" ? true : checkLoad;
    asset = !checkLoad || this.items[name].ready ? this.items[name] : null;
  }
  if (!asset) throw new Error('Trying to get undefined asset "' + name + '"');
  return asset;
};
AssetsLibrary.prototype.getSprite = function (name, params, spriteClass) {
  var mc = null,
    asset = null;
  try {
    asset = this.getAsset(name, true);
  } catch (e) {
    asset = new Asset();
  }
  spriteClass =
    spriteClass || asset.spriteClass || this.spriteClass || window.Sprite;
  if (
    (spriteClass && typeof spriteClass == "function") ||
    typeof window[spriteClass] == "function"
  )
    spriteClass =
      typeof spriteClass == "function" ? spriteClass : window[spriteClass];
  if (spriteClass.create && typeof spriteClass.create == "function")
    mc = spriteClass.create(asset, this);
  else
    mc = new spriteClass(
      asset.bitmap,
      asset.width,
      asset.height,
      asset.frames,
      asset.layers
    );
  if (params && typeof params == "object")
    for (var prop in params) mc[prop] = params[prop];
  return mc;
};
AssetsLibrary.prototype.getBitmap = function (name) {
  try {
    var asset = this.getAsset(name, true);
    return asset.bitmap;
  } catch (e) {
    return null;
  }
};
function Vector(x, y) {
  if (typeof x == "undefined") x = 0;
  this.x = x;
  if (typeof y == "undefined") y = 0;
  this.y = y;
}
Vector.prototype.isZero = function () {
  return this.x == 0 && this.y == 0;
};
Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};
Vector.prototype.add = function (p) {
  this.x += p.x;
  this.y += p.y;
  return this;
};
Vector.prototype.subtract = function (p) {
  this.x -= p.x;
  this.y -= p.y;
  return this;
};
Vector.prototype.mult = function (n) {
  this.x *= n;
  this.y *= n;
  return this;
};
Vector.prototype.invert = function () {
  this.mult(-1);
  return this;
};
Vector.prototype.rotate = function (angle, offset) {
  if (typeof offset == "undefined") offset = new Vector(0, 0);
  var r = this.clone();
  r.subtract(offset);
  r.x = this.x * Math.cos(angle) + this.y * Math.sin(angle);
  r.y = this.x * -Math.sin(angle) + this.y * Math.cos(angle);
  r.add(offset);
  this.x = r.x;
  this.y = r.y;
  return this;
};
Vector.prototype.normalize = function (angle, offset) {
  if (typeof offset == "undefined") offset = new Vector(0, 0);
  this.subtract(offset);
  this.rotate(-angle);
  return this;
};
Vector.prototype.getLength = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector.prototype.distanceTo = function (p) {
  p2 = this.clone();
  p2.subtract(p);
  return p2.getLength();
};
function Rectangle(x, y, w, h, angle) {
  this.center = new Vector(x, y);
  this.width = w;
  this.height = h;
  this.angle = angle;
  this.vertices = [];
  this.AABB = [];
  this.refreshVertices();
}
Rectangle.prototype.clone = function () {
  return new Rectangle(
    this.center.x,
    this.center.y,
    this.width,
    this.height,
    this.angle
  );
};
Rectangle.prototype.refreshVertices = function () {
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
    if (this.vertices[i].x < this.AABB[0].x)
      this.AABB[0].x = this.vertices[i].x;
    if (this.vertices[i].x > this.AABB[1].x)
      this.AABB[1].x = this.vertices[i].x;
    if (this.vertices[i].y < this.AABB[0].y)
      this.AABB[0].y = this.vertices[i].y;
    if (this.vertices[i].y > this.AABB[1].y)
      this.AABB[1].y = this.vertices[i].y;
  }
};
Rectangle.prototype.move = function (x, y) {
  this.center.add(new Vector(x, y));
  this.refreshVertices();
};
Rectangle.prototype.rotate = function (angle) {
  this.angle += angle;
  this.refreshVertices();
};
Rectangle.prototype.hitTestPoint = function (point) {
  var p = point.clone();
  p.normalize(-this.angle, this.center);
  return Math.abs(p.x) <= this.width / 2 && Math.abs(p.y) <= this.height / 2;
};
Rectangle.prototype.hitTestRectangle = function (rect) {
  var r1 = this.clone();
  var r2 = rect.clone();
  var len, len1, len2;
  r1.move(-this.center.x, -this.center.y);
  r2.move(-this.center.x, -this.center.y);
  r2.center.rotate(this.angle);
  r1.rotate(-this.angle);
  r2.rotate(-this.angle);
  len =
    Math.max(r1.AABB[0].x, r1.AABB[1].x, r2.AABB[0].x, r2.AABB[1].x) -
    Math.min(r1.AABB[0].x, r1.AABB[1].x, r2.AABB[0].x, r2.AABB[1].x);
  len1 = r1.AABB[1].x - r1.AABB[0].x;
  len2 = r2.AABB[1].x - r2.AABB[0].x;
  if (len > len1 + len2) return false;
  len =
    Math.max(r1.AABB[0].y, r1.AABB[1].y, r2.AABB[0].y, r2.AABB[1].y) -
    Math.min(r1.AABB[0].y, r1.AABB[1].y, r2.AABB[0].y, r2.AABB[1].y);
  len1 = r1.AABB[1].y - r1.AABB[0].y;
  len2 = r2.AABB[1].y - r2.AABB[0].y;
  if (len > len1 + len2) return false;
  r1.move(-r2.center.x, -r2.center.y);
  r2.move(-r2.center.x, -r2.center.y);
  r1.center.rotate(r2.angle);
  r1.refreshVertices();
  r1.rotate(-r2.angle);
  r2.rotate(-r2.angle);
  len =
    Math.max(r1.AABB[0].x, r1.AABB[1].x, r2.AABB[0].x, r2.AABB[1].x) -
    Math.min(r1.AABB[0].x, r1.AABB[1].x, r2.AABB[0].x, r2.AABB[1].x);
  len1 = r1.AABB[1].x - r1.AABB[0].x;
  len2 = r2.AABB[1].x - r2.AABB[0].x;
  if (len > len1 + len2) return false;
  len =
    Math.max(r1.AABB[0].y, r1.AABB[1].y, r2.AABB[0].y, r2.AABB[1].y) -
    Math.min(r1.AABB[0].y, r1.AABB[1].y, r2.AABB[0].y, r2.AABB[1].y);
  len1 = r1.AABB[1].y - r1.AABB[0].y;
  len2 = r2.AABB[1].y - r2.AABB[0].y;
  if (len > len1 + len2) return false;
  return true;
};
var EventsManager = {};
EventsManager.addEvent = function (obj, type, callback) {
  if (!obj.eventsListeners) return;
  for (var i = 0; i < obj.eventsListeners.length; i++)
    if (
      obj.eventsListeners[i].type === type &&
      obj.eventsListeners[i].callback === callback
    )
      return;
  obj.eventsListeners.push({ type: type, callback: callback });
};
EventsManager.removeEvent = function (obj, type, callback) {
  if (!obj.eventsListeners) return;
  if (obj["on" + type] == callback) obj["on" + type] = null;
  for (var i = 0; i < obj.eventsListeners.length; i++)
    if (
      obj.eventsListeners[i].type === type &&
      obj.eventsListeners[i].callback === callback
    ) {
      obj.eventsListeners = Utils.removeFromArray(
        obj.eventsListeners,
        obj.eventsListeners[i]
      );
      return;
    }
};
EventsManager.dispatchEvent = function (obj, type, params) {
  if (!obj.eventsListeners) return;
  var ret;
  if (typeof obj["on" + type] == "function") {
    ret = obj["on" + type](params);
    if (ret === false) return false;
  }
  for (var i = 0; i < obj.eventsListeners.length; i++)
    if (obj.eventsListeners[i].type === type) {
      ret = obj.eventsListeners[i].callback(params);
      if (ret === false) return false;
    }
};
EventsManager.hasEventListener = function (obj, type) {
  if (!obj.eventsListeners) return false;
  if (obj["on" + type]) return true;
  for (var i = 0; i < obj.eventsListeners.length; i++)
    if (obj.eventsListeners[i].type === type) return true;
  return false;
};
EventsManager.removeAllEventListeners = function (obj, type) {
  if (!obj.eventsListeners) return;
  if (typeof type == "undefined") obj.eventsListeners = [];
  else if (obj["on" + type]) obj["on" + type] = null;
  var result = [];
  for (var i = 0; i < obj.eventsListeners.length; i++)
    if (obj.eventsListeners[i].type !== type)
      result.push(obj.eventsListeners[i]);
  obj.eventsListeners = result;
};
function EventsProxy() {
  this.eventsListeners = [];
}
EventsProxy.prototype.addEventListener = function (type, callback) {
  EventsManager.addEvent(this, type, callback);
};
EventsProxy.prototype.removeEventListener = function (type, callback) {
  EventsManager.removeEvent(this, type, callback);
};
EventsProxy.prototype.dispatchEvent = function (type, params) {
  return EventsManager.dispatchEvent(this, type, params);
};
EventsProxy.prototype.hasEventListener = function (type) {
  return EventsManager.hasEventListener(this, type);
};
EventsProxy.prototype.removeAllEventListeners = function (type) {
  EventsManager.removeAllEventListeners(this, type);
};
var Easing = {};
Easing.back = {
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
    if ((t /= d / 2) < 1)
      return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
    return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  },
};
Easing.bounce = {
  easeIn: function (t, b, c, d) {
    return c - Easing.bounce.easeOut(d - t, 0, c, d) + b;
  },
  easeOut: function (t, b, c, d) {
    if ((t /= d) < 1 / 2.75) return c * (7.5625 * t * t) + b;
    else if (t < 2 / 2.75)
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    else if (t < 2.5 / 2.75)
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    else return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  },
  easeInOut: function (t, b, c, d) {
    if (t < d / 2) return Easing.bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
    else return Easing.bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
  },
};
Easing.circular = {
  easeIn: function (t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOut: function (t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOut: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
    return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
};
Easing.cubic = {
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOut: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOut: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  },
};
Easing.elastic = {
  easeIn: function (t, b, c, d) {
    if (c == 0) return b;
    var s = 1.70158,
      p = 0,
      a = c * 1;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
      a = c * 1;
      s = p / 4;
    } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
    return (
      -(
        a *
        Math.pow(2, 10 * (t -= 1)) *
        Math.sin(((t * d - s) * (2 * Math.PI)) / p)
      ) + b
    );
  },
  easeOut: function (t, b, c, d) {
    if (c == 0) return b;
    var s = 1.70158,
      p = 0,
      a = c * 1;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
      a = c * 1;
      s = p / 4;
    } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
    return (
      a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
      c +
      b
    );
  },
  easeInOut: function (t, b, c, d) {
    if (c == 0) return b;
    var s = 1.70158,
      p = 0,
      a = c * 1;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (!p) p = d * (0.3 * 1.5);
    if (a < Math.abs(c)) {
      a = c * 1;
      s = p / 4;
    } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
    return t < 1
      ? -0.5 *
          (a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
          b
      : a *
          Math.pow(2, -10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
          0.5 +
          c +
          b;
  },
};
Easing.exponential = {
  easeIn: function (t, b, c, d) {
    return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOut: function (t, b, c, d) {
    return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  },
  easeInOut: function (t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
    return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
  },
};
Easing.linear = {
  easeIn: function (t, b, c, d) {
    return (c * t) / d + b;
  },
  easeOut: function (t, b, c, d) {
    return (c * t) / d + b;
  },
  easeInOut: function (t, b, c, d) {
    return (c * t) / d + b;
  },
};
Easing.quadratic = {
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOut: function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOut: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
    return (-c / 2) * (--t * (t - 2) - 1) + b;
  },
};
Easing.quartic = {
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOut: function (t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOut: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  },
};
Easing.quintic = {
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOut: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOut: function (t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
  },
};
Easing.sine = {
  easeIn: function (t, b, c, d) {
    return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
  },
  easeOut: function (t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  },
  easeInOut: function (t, b, c, d) {
    return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
  },
};
Easing.smoothstep = {
  easeIn: function (t, b, c, d) {
    var mt = t / d / 2;
    return 2 * (mt * mt * (3 - 2 * mt)) * c + b;
  },
  easeOut: function (t, b, c, d) {
    var mt = (t / d + 1) / 2;
    return (2 * (mt * mt * (3 - 2 * mt)) - 1) * c + b;
  },
  easeInOut: function (t, b, c, d) {
    var mt = t / d;
    return mt * mt * (3 - 2 * mt) * c + b;
  },
};
function Tween(obj, prop, start, end, duration, callback) {
  Utils.callSuperConstructor(Tween, this);
  if (typeof obj != "object") obj = null;
  if (obj) {
    if (typeof obj[prop] == "undefined")
      throw new Error('Trying to tween undefined property "' + prop + '"');
    if (isNaN(obj[prop]))
      throw new Error("Tweened value can not be " + typeof obj[prop]);
  } else if (isNaN(prop))
    throw new Error("Tweened value can not be " + typeof prop);
  if (typeof callback != "function") callback = Easing.linear.easeIn;
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
  this.newly = true;
  this.eventsListeners = [];
}
Utils.extend(Tween, EventsProxy);
Tween.prototype.play = function () {
  this.playing = true;
  this.tick(0);
};
Tween.prototype.pause = function () {
  this.playing = false;
};
Tween.prototype.rewind = function () {
  this._pos = -1;
};
Tween.prototype.forward = function () {
  this._pos = this.duration;
};
Tween.prototype.stop = function () {
  this.pause();
  this.rewind();
};
Tween.prototype.updateValue = function (val) {
  if (this.obj) this.obj[this.prop] = val;
  else this.prop = val;
};
Tween.prototype.tick = function (delta) {
  if (!this.playing) return false;
  if (!delta) delta = 0;
  if (Tween.STEP_TYPE == Tween.STEP_BY_FRAME) this._pos++;
  else this._pos += delta;
  if (this._pos < 0) return false;
  if (this._pos > this.duration) return this.finish();
  var val =
    this.start == this.end
      ? this.start * 1
      : this.callback(
          this._pos,
          this.start,
          this.end - this.start,
          this.duration
        );
  this.updateValue(val);
  if (this.hasEventListener("change"))
    this.dispatchEvent("change", { target: this, value: val });
  return false;
};
Tween.prototype.finish = function () {
  this.stop();
  this.updateValue(this.end);
  if (
    this.hasEventListener("finish") &&
    this.dispatchEvent("finish", { target: this, value: this.end }) === false
  )
    return false;
  return true;
};
Tween.STEP_BY_FRAME = 0;
Tween.STEP_BY_TIME = 1;
Tween.STEP_TYPE = Tween.STEP_BY_FRAME;
function DisplayObjectContainer() {
  Utils.callSuperConstructor(DisplayObjectContainer, this);
  this.objects = [];
  this.anchor = { x: 0, y: 0 };
}
Utils.extend(DisplayObjectContainer, EventsProxy);
DisplayObjectContainer.prototype.objectsCounter = 0;
DisplayObjectContainer.prototype.scaleX = 1;
DisplayObjectContainer.prototype.scaleY = 1;
DisplayObjectContainer.prototype.opacity = 1;
DisplayObjectContainer.prototype.x = 0;
DisplayObjectContainer.prototype.y = 0;
DisplayObjectContainer.prototype.width = 0;
DisplayObjectContainer.prototype.height = 0;
DisplayObjectContainer.prototype.skewX = 0;
DisplayObjectContainer.prototype.skewY = 0;
DisplayObjectContainer.prototype.rotation = 0;
DisplayObjectContainer.prototype.parent = null;
DisplayObjectContainer.prototype.hitArea = null;
DisplayObjectContainer.prototype.fillColor = null;
DisplayObjectContainer.prototype.fillLinearGradient = null;
DisplayObjectContainer.prototype.fillRadialGradient = null;
DisplayObjectContainer.prototype.fillPattern = null;
DisplayObjectContainer.prototype.getAbsoluteRotation = function () {
  return this.rotation + (this.parent ? this.parent.getAbsoluteRotation() : 0);
};
DisplayObjectContainer.prototype.getAbsoluteOpacity = function () {
  return this.opacity * (this.parent ? this.parent.getAbsoluteOpacity() : 1);
};
DisplayObjectContainer.prototype.getAbsoluteScaleX = function () {
  return this.scaleX * (this.parent ? this.parent.getAbsoluteScaleX() : 1);
};
DisplayObjectContainer.prototype.getAbsoluteScaleY = function () {
  return this.scaleY * (this.parent ? this.parent.getAbsoluteScaleY() : 1);
};
DisplayObjectContainer.prototype.getAbsoluteSkewX = function () {
  return this.skewX + (this.parent ? this.parent.getAbsoluteSkewX() : 0);
};
DisplayObjectContainer.prototype.getAbsoluteSkewY = function () {
  return this.skewY + (this.parent ? this.parent.getAbsoluteSkewY() : 0);
};
DisplayObjectContainer.prototype.getTransformProps = function () {
  return {
    x: this.x,
    y: this.y,
    scaleX: this.scaleX,
    scaleY: this.scaleY,
    skewX: this.skewX,
    skewY: this.skewY,
    rotation: this.rotation,
  };
};
DisplayObjectContainer.prototype.setTransformProps = function (props) {
  for (var i in props) this[i] = props[i];
};
DisplayObjectContainer.prototype.prepareCanvas = function (cns) {
  cns.ctx.save();
  var ox = this.x,
    oy = this.y;
  if (!this.ignoreViewport && this.parent == this.stage) {
    ox -= this.stage.viewport.x;
    oy -= this.stage.viewport.y;
  }
  ox *= Utils.globalScale;
  oy *= Utils.globalScale;
  cns.ctx.transform(1, this.skewX, this.skewY, 1, ox, oy);
  cns.ctx.rotate(this.rotation);
  cns.ctx.scale(this.scaleX, this.scaleY);
  cns.ctx.globalAlpha = this.getAbsoluteOpacity();
};
DisplayObjectContainer.prototype.moveCanvasAnchor = function (cns, back) {
  var f = back ? 1 : -1;
  if (this.anchor.x != 0 || this.anchor.y != 0)
    cns.ctx.translate(
      this.anchor.x * Utils.globalScale * f,
      this.anchor.y * Utils.globalScale * f
    );
};
DisplayObjectContainer.prototype.restoreCanvas = function (cns) {
  cns.ctx.restore();
};
DisplayObjectContainer.prototype.prepareCanvasShadow = function (cns) {
  if (this.shadowColor) {
    cns.ctx.save();
    if (this.rotation != 0) {
      var l =
        Math.sqrt(
          this.shadowOffsetX * this.shadowOffsetX +
            this.shadowOffsetY +
            this.shadowOffsetY
        ) * Utils.globalScale;
      var a =
        Math.atan2(this.shadowOffsetY, this.shadowOffsetX) + this.rotation;
      cns.ctx.shadowOffsetX = Math.cos(a) * l;
      cns.ctx.shadowOffsetY = Math.sin(a) * l;
    } else {
      cns.ctx.shadowOffsetX = this.shadowOffsetX * Utils.globalScale;
      cns.ctx.shadowOffsetY = this.shadowOffsetY * Utils.globalScale;
    }
    cns.ctx.shadowColor = this.shadowColor;
    cns.ctx.shadowBlur = this.shadowBlur * Utils.globalScale;
  }
};
DisplayObjectContainer.prototype.restoreCanvasShadow = function (cns) {
  if (this.shadowColor) this.restoreCanvas(cns);
};
DisplayObjectContainer.prototype.render = function (cns, drawStatic, delta) {
  for (var i = 0; i < this.objects.length; i++) {
    obj = this.objects[i];
    if (obj.destroy) {
      this.removeChild(obj);
      i--;
    } else if (obj.visible) obj.render(cns, drawStatic, delta);
  }
};
DisplayObjectContainer.prototype.getX = function () {
  return Math.round(this.x * Utils.globalScale);
};
DisplayObjectContainer.prototype.getY = function () {
  return Math.round(this.y * Utils.globalScale);
};
DisplayObjectContainer.prototype.getWidth = function () {
  return this.width * Math.abs(this.getAbsoluteScaleX()) * Utils.globalScale;
};
DisplayObjectContainer.prototype.getHeight = function () {
  return this.height * Math.abs(this.getAbsoluteScaleY()) * Utils.globalScale;
};
DisplayObjectContainer.prototype.getPosition = function () {
  return { x: this.x, y: this.y };
};
DisplayObjectContainer.prototype.setPosition = function (x, y) {
  if (
    typeof y == "undefined" &&
    typeof x["x"] != "undefined" &&
    typeof x["y"] != "undefined"
  )
    return this.setPosition(x.x, x.y);
  this.x = parseFloat(x);
  this.y = parseFloat(y);
};
DisplayObjectContainer.prototype.setPropScale = function (scale) {
  this.scaleX = this.scaleY = scale * 1;
};
DisplayObjectContainer.prototype.getAnchor = function () {
  return this.anchor;
};
DisplayObjectContainer.prototype.setAnchor = function (x, y) {
  if (
    typeof y == "undefined" &&
    typeof x["x"] != "undefined" &&
    typeof x["y"] != "undefined"
  )
    return this.setAnchor(x.x, x.y);
  this.anchor.x = parseFloat(x);
  this.anchor.y = parseFloat(y);
};
DisplayObjectContainer.prototype.alignAnchor = function (h, v) {
  h = parseInt(h);
  if (isNaN(h)) h = DisplayObjectContainer.ANCHOR_ALIGN_CENTER;
  if (h < 0) h = DisplayObjectContainer.ANCHOR_ALIGN_LEFT;
  if (h > 0) h = DisplayObjectContainer.ANCHOR_ALIGN_RIGHT;
  v = parseInt(v);
  if (isNaN(v)) v = DisplayObjectContainer.ANCHOR_VALIGN_MIDDLE;
  if (v < 0) v = DisplayObjectContainer.ANCHOR_VALIGN_TOP;
  if (v > 0) v = DisplayObjectContainer.ANCHOR_VALIGN_BOTTOM;
  this.anchor.x = (this.width * h) / 2;
  this.anchor.y = (this.height * v) / 2;
  return this.getAnchor();
};
DisplayObjectContainer.prototype.getAbsoluteAnchor = function () {
  return this.getPosition();
};
DisplayObjectContainer.prototype.getRelativeCenter = function () {
  var anchor = this.getAnchor(),
    r = this.getAbsoluteRotation();
  var a = { x: anchor.x, y: anchor.y };
  if (r != 0 && (a.x != 0 || a.y != 0)) {
    a = new Vector(
      -a.x * this.getAbsoluteScaleX(),
      -a.y * this.getAbsoluteScaleY()
    );
    a.rotate(-r);
  } else {
    a.x = -(a.x * this.getAbsoluteScaleX());
    a.y = -(a.y * this.getAbsoluteScaleY());
  }
  return a;
};
DisplayObjectContainer.prototype.getAbsolutePosition = function () {
  var v = { x: this.x, y: this.y };
  if (this.parent) {
    var p = this.parent.getAbsolutePosition();
    var r = this.parent.getAbsoluteRotation();
    if (r != 0) {
      var a = new Vector(
        v.x * this.parent.getAbsoluteScaleX(),
        v.y * this.parent.getAbsoluteScaleY()
      );
      a.rotate(-r);
      v.x = p.x + a.x;
      v.y = p.y + a.y;
    } else {
      v.x = p.x + v.x * this.parent.getAbsoluteScaleX();
      v.y = p.y + v.y * this.parent.getAbsoluteScaleY();
    }
  }
  return v;
};
DisplayObjectContainer.prototype.getAbsoluteCenter = function () {
  var v = this.getAbsolutePosition();
  var c = this.getRelativeCenter();
  v.x += c.x;
  v.y += c.y;
  return v;
};
DisplayObjectContainer.prototype.getCenter = function () {
  return this.getAbsoluteCenter();
};
DisplayObjectContainer.prototype.getIgnoreViewport = function () {
  return (
    this.ignoreViewport || (this.parent && this.parent.getIgnoreViewport())
  );
};
DisplayObjectContainer.prototype.getHitAreaRectangle = function () {
  if (!this.hitArea) return this.getDrawRectangle();
  var rotation = this.getAbsoluteRotation(),
    scX = this.getAbsoluteScaleX(),
    scY = this.getAbsoluteScaleY();
  var c = this.getCenter(),
    r = new Rectangle(
      0,
      0,
      this.hitArea.width * Math.abs(scX),
      this.hitArea.height * Math.abs(scY),
      rotation
    );
  if (rotation != 0) {
    var p = new Vector(this.hitArea.x * scX, this.hitArea.y * scY);
    p.rotate(-rotation);
    r.move(c.x + p.x, c.y + p.y);
  } else r.move(c.x + this.hitArea.x * scX, c.y + this.hitArea.x * scY);
  return r;
};
DisplayObjectContainer.prototype.getDrawRectangle = function () {
  var c = this.getCenter(),
    r = new Rectangle(
      0,
      0,
      this.width * Math.abs(this.getAbsoluteScaleX()),
      this.height * Math.abs(this.getAbsoluteScaleY()),
      this.getAbsoluteRotation()
    );
  r.move(c.x, c.y);
  return r;
};
DisplayObjectContainer.prototype.getAABBRectangle = function () {
  var r = this.getDrawRectangle(),
    w = r.AABB[1].x - r.AABB[0].x,
    h = r.AABB[1].y - r.AABB[0].y;
  return new Rectangle(r.AABB[0].x + w / 2, r.AABB[0].y + h / 2, w, h, 0);
};
DisplayObjectContainer.prototype.getFullAABBRectangle = function () {
  var list = [this.getAABBRectangle()];
  for (var i = 0; i < this.objects.length; i++)
    list.push(this.objects[i].getFullAABBRectangle());
  var AABB = [
    { x: Number.MAX_VALUE, y: Number.MAX_VALUE },
    { x: Number.MIN_VALUE, y: Number.MIN_VALUE },
  ];
  for (i = 0; i < list.length; i++) {
    r = list[i];
    AABB[0].x = Math.min(AABB[0].x, r.AABB[0].x);
    AABB[0].y = Math.min(AABB[0].y, r.AABB[0].y);
    AABB[1].x = Math.max(AABB[1].x, r.AABB[1].x);
    AABB[1].y = Math.max(AABB[1].y, r.AABB[1].y);
  }
  var w = AABB[1].x - AABB[0].x;
  var h = AABB[1].y - AABB[0].y;
  return new Rectangle(AABB[0].x + w / 2, AABB[0].y + h / 2, w, h, 0);
};
DisplayObjectContainer.prototype.cacheAsBitmap = function () {
  var x = this.x,
    y = this.y,
    rotation = this.rotation,
    parent = this.parent;
  this.rotation = 0;
  this.parent = null;
  var rect = this.getAABBRectangle();
  var rectFull = this.getFullAABBRectangle();
  var center = this.getCenter();
  this.x =
    rect.AABB[0].x -
    rectFull.AABB[0].x +
    (this.width / 2 + this.anchor.x) * this.scaleX;
  this.y =
    rect.AABB[0].y -
    rectFull.AABB[0].y +
    (this.height / 2 + this.anchor.y) * this.scaleY;
  var cache = document.createElement("canvas");
  cache.width = rectFull.width * Utils.globalScale;
  cache.height = rectFull.height * Utils.globalScale;
  cache.ctx = cache.getContext("2d");
  this.render(cache, true, 0);
  this.render(cache, false, 0);
  this.parent = parent;
  this.x = x;
  this.y = y;
  this.rotation = rotation;
  return cache;
};
DisplayObjectContainer.prototype.localToGlobal = function (x, y) {
  var p =
    typeof x == "object" &&
    typeof x["x"] != "undefined" &&
    typeof x["y"] != "undefined"
      ? new Vector(x.x + 0, x.y + 0)
      : new Vector(x, y);
  p.rotate(this.getAbsoluteRotation()).add(this.getAbsolutePosition());
  return p;
};
DisplayObjectContainer.prototype.globalToLocal = function (x, y) {
  var p =
    typeof x == "object" &&
    typeof x["x"] != "undefined" &&
    typeof x["y"] != "undefined"
      ? new Vector(x.x + 0, x.y + 0)
      : new Vector(x, y);
  p.subtract(this.getAbsolutePosition()).rotate(this.getAbsoluteRotation());
  return p;
};
DisplayObjectContainer.prototype.localToLocal = function (x, y, target) {
  return target.globalToLocal(this.localToGlobal(x, y));
};
DisplayObjectContainer.prototype.swapChildren = function (item1, item2) {
  var ix = item1.zIndex;
  item1.setZIndex(item2.zIndex);
  item2.setZIndex(ix);
};
DisplayObjectContainer.prototype.findMaxZIndex = function () {
  var max = -1;
  var ix = false;
  for (var i = 0; i < this.objects.length; i++)
    if (this.objects[i].zIndex > max) {
      max = this.objects[i].zIndex;
      ix = i;
    }
  return { index: ix, zIndex: max };
};
DisplayObjectContainer.prototype.findMinZIndex = function () {
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
  return { index: ix, zIndex: min };
};
DisplayObjectContainer.prototype.addChild = function (item) {
  var f = this.findMaxZIndex();
  var z = item.zIndex;
  if (f.index !== false) item.zIndex = f.zIndex + 1;
  else item.zIndex = 0;
  this.objectsCounter++;
  item.uid = this.objectsCounter;
  item.parent = this;
  item.setStage(this.stage);
  this.objects.push(item);
  if (z != 0) this.setChildZIndex(item, ~~z);
  if (item.hasEventListener("add")) item.dispatchEvent("add", { target: item });
  return item;
};
DisplayObjectContainer.prototype.addChildAt = function (item, index) {
  this.addChild(item);
  this.setChildZIndex(item, ~~index);
  return item;
};
DisplayObjectContainer.prototype.contains = function (item, recursive) {
  for (var i = 0; i < this.objects.length; i++) {
    if (this.objects[i] == item) return true;
    if (recursive && this.objects[i].contains(item, recursive)) return true;
  }
  return false;
};
DisplayObjectContainer.prototype.setStage = function (stage) {
  this.stage = stage;
  for (var i = 0; i < this.objects.length; i++) this.objects[i].setStage(stage);
};
DisplayObjectContainer.prototype.removeChild = function (item) {
  if (item && this.objects.indexOf(item) >= 0) {
    if (item.stage) item.stage.clearObjectTweens(item);
    item.clear();
    if (item.hasEventListener("remove"))
      item.dispatchEvent("remove", { target: item });
    item.removeAllEventListeners();
    item.parent = null;
    item.stage = null;
    this.objects = Utils.removeFromArray(this.objects, item);
  }
};
DisplayObjectContainer.prototype.setChildZIndex = function (item, index) {
  item.zIndex = index;
  this.objects = this.objects.sort(function (obj1, obj2) {
    if (obj1.zIndex == obj2.zIndex) return obj1.uid > obj2.uid ? 1 : -1;
    else return obj1.zIndex > obj2.zIndex ? 1 : -1;
  });
};
DisplayObjectContainer.prototype.getHitArea = function () {
  return this.hitArea
    ? this.hitArea
    : { x: 0, y: 0, width: this.width, height: this.height };
};
DisplayObjectContainer.prototype.hitTest = function (obj1, obj2) {
  if (!obj2) obj2 = this;
  if (obj1.getAbsoluteRotation() == 0 && obj2.getAbsoluteRotation() == 0) {
    var c1 = obj1.getCenter();
    var c2 = obj2.getCenter();
    var cW1 = obj1.width * Math.abs(obj1.getAbsoluteScaleX());
    var cH1 = obj1.height * Math.abs(obj1.getAbsoluteScaleY());
    var cW2 = obj2.width * Math.abs(obj2.getAbsoluteScaleX());
    var cH2 = obj2.height * Math.abs(obj2.getAbsoluteScaleY());
    var cX1 = c1.x - cW1 / 2;
    var cY1 = c1.y - cH1 / 2;
    var cX2 = c2.x - cW2 / 2;
    var cY2 = c2.y - cH2 / 2;
    var top = Math.max(cY1, cY2);
    var left = Math.max(cX1, cX2);
    var right = Math.min(cX1 + cW1, cX2 + cW2);
    var bottom = Math.min(cY1 + cH1, cY2 + cH2);
    var width = right - left;
    var height = bottom - top;
    return width > 0 && height > 0;
  } else {
    var r1 = obj1.getDrawRectangle(),
      r2 = obj2.getDrawRectangle();
    return r1.hitTestRectangle(r2);
  }
};
DisplayObjectContainer.prototype.hitTestPointObject = function (
  obj,
  x,
  y,
  pixelCheck,
  includeDragged
) {
  var cX, cY, cW, cH, mX, mY, r, present, imageData;
  if (typeof obj.pixelCheck == "boolean") pixelCheck = obj.pixelCheck;
  var hitArea = obj.getHitArea();
  cW = hitArea.width * Math.abs(obj.getAbsoluteScaleX());
  cH = hitArea.height * Math.abs(obj.getAbsoluteScaleY());
  var c = obj.getAbsoluteCenter();
  cX = c.x + hitArea.x - cW / 2;
  cY = c.y + hitArea.y - cH / 2;
  mX = x;
  mY = y;
  if (!obj.ignoreViewport) {
    mX += this.stage.viewport.x;
    mY += this.stage.viewport.y;
  }
  present = false;
  if (obj.getAbsoluteRotation() == 0) {
    if (cX <= mX && cY <= mY && cX + cW >= mX && cY + cH >= mY) present = true;
  } else {
    r = obj.getHitAreaRectangle();
    if (r.hitTestPoint(new Vector(mX, mY))) present = true;
  }
  if (present && pixelCheck) {
    this.stage.buffer.width = this.stage.canvas.width;
    this.stage.buffer.height = this.stage.canvas.height;
    this.stage.clearScreen(this.stage.buffer);
    var props = obj.getTransformProps();
    var parent = obj.parent;
    var pos = obj.getAbsolutePosition();
    obj.x = pos.x;
    obj.y = pos.y;
    obj.scaleX = obj.getAbsoluteScaleX();
    obj.scaleY = obj.getAbsoluteScaleY();
    obj.skewX = obj.getAbsoluteSkewX();
    obj.skewY = obj.getAbsoluteSkewY();
    obj.rotation = obj.getAbsoluteRotation();
    obj.parent = null;
    obj.render(this.stage.buffer, obj.static, 0);
    var pX = Math.floor(x * Utils.globalScale);
    var pY = Math.floor(y * Utils.globalScale);
    imageData = this.stage.buffer.ctx.getImageData(pX, pY, 1, 1);
    if (imageData.data[3] == 0) present = false;
    obj.setTransformProps(props);
    obj.parent = parent;
  }
  if (!present && includeDragged && obj.dragged) present = true;
  return present;
};
DisplayObjectContainer.prototype.getObjectsStackByCoord = function (
  x,
  y,
  pixelCheck,
  includeDragged
) {
  var obj;
  var tmp = [];
  for (var i = this.objects.length - 1; i >= 0; i--)
    if (this.objects[i].visible) {
      obj = this.objects[i];
      if (obj.objects && obj.objects.length)
        tmp = tmp.concat(
          obj.getObjectsStackByCoord(x, y, pixelCheck, includeDragged)
        );
      if (this.hitTestPointObject(obj, x, y, pixelCheck, includeDragged))
        tmp.push(obj);
    }
  return tmp;
};
DisplayObjectContainer.prototype.getObjectsUnderPoint = function (
  x,
  y,
  pixelCheck
) {
  var p = this.getAbsolutePosition();
  return this.getObjectsStackByCoord(p.x + x, p.y + y, !!pixelCheck);
};
DisplayObjectContainer.prototype.getObjectUnderPoint = function (
  x,
  y,
  pixelCheck
) {
  var stack = this.getObjectsUnderPoint(x, y, pixelCheck);
  return stack[0];
};
DisplayObjectContainer.prototype.doDrag = function (dX, dY) {
  for (var i = 0; i < this.objects.length; i++) this.objects[i].doDrag(dX, dY);
  if (this.dragged) {
    var eX = dX;
    var eY = dY;
    if (!this.ignoreViewport) {
      eX += this.stage.viewport.x;
      eY += this.stage.viewport.y;
    }
    eX -= this.dragX;
    eY -= this.dragY;
    var p = this.parent.globalToLocal(eX, eY);
    this.x = p.x;
    this.y = p.y;
  }
};
DisplayObjectContainer.prototype.checkMouseOut = function (
  overStack,
  mouseCoords
) {
  for (var i = this.objects.length - 1; i >= 0; i--)
    if (this.objects[i].checkMouseOut(overStack, mouseCoords) === false) return;
  if (this.mouseOn && overStack.indexOf(this) < 0) {
    this.mouseOn = false;
    var f = this.stage.finalizeMouseCoords(this, mouseCoords);
    return this.dispatchEvent("mouseout", { target: this, x: f.x, y: f.y });
  }
};
DisplayObjectContainer.prototype.getMaxZIndexInStack = function (stack) {
  var max = -1;
  var ix = 0;
  for (var i = 0; i < stack.length; i++)
    if (stack[i].zIndex > max) {
      max = stack[i].zIndex;
      ix = i;
    }
  return ix;
};
DisplayObjectContainer.prototype.sortStack = function (stack, revert) {
  return stack.sort(function (obj1, obj2) {
    if (obj1.zIndex == obj2.zIndex)
      if (revert) obj1.uid < obj2.uid ? 1 : -1;
      else obj1.uid > obj2.uid ? 1 : -1;
    else if (revert) obj1.zIndex < obj2.zIndex ? 1 : -1;
    else obj1.zIndex > obj2.zIndex ? 1 : -1;
  });
};
DisplayObjectContainer.prototype.clear = function () {
  while (this.objects.length) this.removeChild(this.objects[0]);
};
DisplayObjectContainer.prototype.getFillStyle = function (cns) {
  var fill = null;
  if (this.fillLinearGradient) {
    var gradient = cns.ctx.createLinearGradient(
      this.fillLinearGradient.x0 * Utils.globalScale,
      this.fillLinearGradient.y0 * Utils.globalScale,
      this.fillLinearGradient.x1 * Utils.globalScale,
      this.fillLinearGradient.y1 * Utils.globalScale
    );
    for (var i = 0; i < this.fillLinearGradient.points.length; i++)
      gradient.addColorStop(
        this.fillLinearGradient.points[i].point,
        this.fillLinearGradient.points[i].color
      );
    fill = gradient;
  } else if (this.fillRadialGradient) {
    var gradient = cns.ctx.createRadialGradient(
      this.fillRadialGradient.x0 * Utils.globalScale,
      this.fillRadialGradient.y0 * Utils.globalScale,
      this.fillRadialGradient.r0 * Utils.globalScale,
      this.fillRadialGradient.x1 * Utils.globalScale,
      this.fillRadialGradient.y1 * Utils.globalScale,
      this.fillRadialGradient.r1 * Utils.globalScale
    );
    for (var i = 0; i < this.fillRadialGradient.points.length; i++)
      gradient.addColorStop(
        this.fillRadialGradient.points[i].point,
        this.fillRadialGradient.points[i].color
      );
    fill = gradient;
  } else if (this.fillPattern) {
    var pattern = cns.ctx.createPattern(
      this.fillPattern.img,
      this.fillPattern.repeat
    );
    fill = pattern;
  } else fill = this.fillColor;
  return fill;
};
DisplayObjectContainer.prototype.set = function (props) {
  for (var p in props) this[p] = props[p];
};
DisplayObjectContainer.ANCHOR_ALIGN_LEFT = -1;
DisplayObjectContainer.ANCHOR_ALIGN_CENTER = 0;
DisplayObjectContainer.ANCHOR_ALIGN_RIGHT = 1;
DisplayObjectContainer.ANCHOR_VALIGN_TOP = -1;
DisplayObjectContainer.ANCHOR_VALIGN_MIDDLE = 0;
DisplayObjectContainer.ANCHOR_VALIGN_BOTTOM = 1;
var ANCHOR_ALIGN_LEFT = DisplayObjectContainer.ANCHOR_ALIGN_LEFT;
var ANCHOR_ALIGN_CENTER = DisplayObjectContainer.ANCHOR_ALIGN_CENTER;
var ANCHOR_ALIGN_RIGHT = DisplayObjectContainer.ANCHOR_ALIGN_RIGHT;
var ANCHOR_VALIGN_TOP = DisplayObjectContainer.ANCHOR_VALIGN_TOP;
var ANCHOR_VALIGN_MIDDLE = DisplayObjectContainer.ANCHOR_VALIGN_MIDDLE;
var ANCHOR_VALIGN_BOTTOM = DisplayObjectContainer.ANCHOR_VALIGN_BOTTOM;
function DisplayObject() {
  Utils.callSuperConstructor(DisplayObject, this);
}
Utils.extend(DisplayObject, DisplayObjectContainer);
DisplayObject.prototype.uid = 0;
DisplayObject.prototype.stage = null;
DisplayObject.prototype.shadowColor = null;
DisplayObject.prototype.shadowOffsetX = 0;
DisplayObject.prototype.shadowOffsetY = 0;
DisplayObject.prototype.shadowBlur = 0;
DisplayObject.prototype.zIndex = 0;
DisplayObject.prototype.visible = true;
DisplayObject.prototype.static = false;
DisplayObject.prototype.ignoreViewport = false;
DisplayObject.prototype.destroy = false;
DisplayObject.prototype.dragged = false;
DisplayObject.prototype.dragX = 0;
DisplayObject.prototype.dragY = 0;
DisplayObject.prototype.mouseOn = false;
DisplayObject.prototype.allowDebugDrawing = true;
DisplayObject.prototype.pixelCheck = null;
DisplayObject.prototype.onmouseover = null;
DisplayObject.prototype.onmouseout = null;
DisplayObject.prototype.onmousedown = null;
DisplayObject.prototype.onmouseup = null;
DisplayObject.prototype.onclick = null;
DisplayObject.prototype.oncontextmenu = null;
DisplayObject.prototype.onmousemove = null;
DisplayObject.prototype.onprerender = null;
DisplayObject.prototype.onenterframe = null;
DisplayObject.prototype.onrender = null;
DisplayObject.prototype.onadd = null;
DisplayObject.prototype.onremove = null;
DisplayObject.prototype.onbox2dsync = null;
DisplayObject.prototype.setStatic = function (val, skipChildren) {
  val = Boolean(val);
  if (!skipChildren)
    for (var i = 0; i < this.objects.length; i++)
      this.objects[i].setStatic(val);
  if (this.static != val) {
    this.static = val;
    if (this.stage) this.stage.refreshBackground();
    return true;
  }
  return false;
};
DisplayObject.prototype.startDrag = function (x, y) {
  this.dragged = true;
  this.dragX = x;
  this.dragY = y;
};
DisplayObject.prototype.stopDrag = function () {
  this.dragged = false;
  this.dragX = 0;
  this.dragY = 0;
};
DisplayObject.prototype.removeTweens = function () {
  if (!this.stage) return;
  this.stage.clearObjectTweens(this);
};
DisplayObject.prototype.addTween = function (
  prop,
  end,
  duration,
  ease,
  onfinish,
  onchange
) {
  if (!this.stage) return;
  var val = this[prop];
  if (isNaN(val)) return;
  var t = this.stage.createTween(this, prop, val, end, duration, ease);
  t.onchange = onchange;
  t.onfinish = onfinish;
  return t;
};
DisplayObject.prototype.moveTo = function (
  x,
  y,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  if (duration <= 0) {
    this.setPosition(x, y);
    if (onfinish)
      onfinish({ target: new Tween(this, "y", y, y, duration, ease) });
    return this;
  }
  var t = [];
  if (this.x != x) {
    var tween = this.addTween("x", x, duration, ease);
    if (tween) t.push(tween);
  }
  if (this.y != y) {
    var tween = this.addTween("y", y, duration, ease);
    if (tween) t.push(tween);
  }
  var len = t.length;
  if (len > 0) {
    t[len - 1].onchange = onchange;
    t[len - 1].onfinish = onfinish;
    for (var i = 0; i < len; i++) t[i].play();
  } else if (onfinish)
    onfinish({ target: new Tween(this, "y", y, y, duration, ease) });
  return this;
};
DisplayObject.prototype.moveBy = function (
  x,
  y,
  duration,
  ease,
  onfinish,
  onchange
) {
  return this.moveTo(
    this.x + x,
    this.y + y,
    duration,
    ease,
    onfinish,
    onchange
  );
};
DisplayObject.prototype.fadeTo = function (
  opacity,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  var t = null;
  if (duration <= 0) this.opacity = opacity;
  else if (this.opacity != opacity) {
    t = this.addTween("opacity", opacity, duration, ease, onfinish, onchange);
    if (t) t.play();
  }
  if (!t && onfinish)
    onfinish({
      target: new Tween(this, "opacity", opacity, opacity, duration, ease),
    });
  return this;
};
DisplayObject.prototype.fadeBy = function (
  opacity,
  duration,
  ease,
  onfinish,
  onchange
) {
  var val = Math.max(0, Math.min(1, this.opacity + opacity));
  return this.fadeTo(val, duration, ease, onfinish, onchange);
};
DisplayObject.prototype.rotateTo = function (
  rotation,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  t = null;
  if (duration <= 0) this.rotation = rotation;
  else {
    t = this.addTween("rotation", rotation, duration, ease, onfinish, onchange);
    if (t) t.play();
  }
  if (!t && onfinish)
    onfinish({
      target: new Tween(this, "rotation", rotation, rotation, duration, ease),
    });
  return this;
};
DisplayObject.prototype.rotateBy = function (
  rotation,
  duration,
  ease,
  onfinish,
  onchange
) {
  return this.rotateTo(
    this.rotation + rotation,
    duration,
    ease,
    onfinish,
    onchange
  );
};
DisplayObject.prototype.skewXTo = function (
  skew,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  var t = null;
  if (duration <= 0) this.skewX = skew;
  else {
    t = this.addTween("skewX", skew, duration, ease, onfinish, onchange);
    if (t) t.play();
  }
  if (!t && onfinish)
    onfinish({ target: new Tween(this, "skewX", skew, skew, duration, ease) });
  return this;
};
DisplayObject.prototype.skewXBy = function (
  skew,
  duration,
  ease,
  onfinish,
  onchange
) {
  return this.skewXTo(this.skewX + skew, duration, ease, onfinish, onchange);
};
DisplayObject.prototype.skewYTo = function (
  skew,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  var t = null;
  if (duration <= 0) this.skewY = skew;
  else {
    t = this.addTween("skewY", skew, duration, ease, onfinish, onchange);
    if (t) t.play();
  }
  if (!t && onfinish)
    onfinish({ target: new Tween(this, "skewY", skew, skew, duration, ease) });
  return this;
};
DisplayObject.prototype.skewYBy = function (
  skew,
  duration,
  ease,
  onfinish,
  onchange
) {
  return this.skewYTo(this.skewY + skew, duration, ease, onfinish, onchange);
};
DisplayObject.prototype.scaleTo = function (
  scale,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  if (duration <= 0) {
    this.scaleX = this.scaleY = scale;
    if (onfinish)
      onfinish({
        target: new Tween(this, "scaleY", scale, scale, duration, ease),
      });
    return this;
  }
  var t = [];
  if (this.scaleX != scale) {
    var tween = this.addTween("scaleX", scale, duration, ease);
    if (tween) t.push(tween);
  }
  if (this.scaleY != scale) {
    var tween = this.addTween("scaleY", scale, duration, ease);
    if (tween) t.push(tween);
  }
  var len = t.length;
  if (len > 0) {
    t[len - 1].onchange = onchange;
    t[len - 1].onfinish = onfinish;
    for (var i = 0; i < len; i++) t[i].play();
  } else if (onfinish)
    onfinish({
      target: new Tween(this, "scaleY", scale, scale, duration, ease),
    });
  return this;
};
DisplayObject.prototype.setZIndex = function (z) {
  this.zIndex = ~~z;
  if (!this.parent) return;
  this.parent.setChildZIndex(this, this.zIndex);
};
DisplayObject.prototype.hitTestPoint = function (
  x,
  y,
  checkPixel,
  checkDragged,
  debug
) {
  if (!this.stage) return false;
  return this.stage.hitTestPointObject(
    this,
    x,
    y,
    checkPixel,
    checkDragged,
    debug
  );
};
DisplayObject.prototype.setRelativePosition = function (
  x,
  y,
  leftAnchor,
  topAnchor
) {
  x = x || 0;
  y = y || 0;
  switch (leftAnchor) {
    case "right":
      x = this.stage.screenWidth - x;
      break;
    case "left":
      break;
    default:
      x = this.stage.screenWidth / 2 + x;
      break;
  }
  switch (topAnchor) {
    case "bottom":
      y = this.stage.screenHeight - y;
      break;
    case "top":
      break;
    default:
      y = this.stage.screenHeight / 2 + y;
      break;
  }
  this.setPosition(x, y);
};
DisplayObject.prototype.debugDraw = function () {
  if (!this.visible) return;
  if (!this.allowDebugDrawing) return;
  var a = this.getAbsolutePosition(),
    c = this.getCenter(),
    r = this.getDrawRectangle(),
    aabb = this.getAABBRectangle();
  stage.drawCircle(a.x, a.y, 1, 1, "rgba(255,0,0,0.9)");
  stage.drawCircle(c.x, c.y, 1, 1, "rgba(0,255,0,0.9)");
  stage.drawLine(a.x, a.y, c.x, c.y, 1, "rgba(255,255,255,0.5)");
  stage.drawPolygon(r.vertices, 0.5, "rgba(255,0,255,0.5)", 1);
  stage.drawLine(
    aabb.vertices[0].x,
    aabb.vertices[0].y,
    aabb.vertices[2].x,
    aabb.vertices[2].y,
    1,
    "rgba(255,255,255,0.5)"
  );
  stage.drawLine(
    aabb.vertices[2].x,
    aabb.vertices[0].y,
    aabb.vertices[0].x,
    aabb.vertices[2].y,
    1,
    "rgba(255,255,255,0.5)"
  );
  stage.drawPolygon(aabb.vertices, 0.5, "rgba(255,255,255,0.5)");
};
DisplayObject.prototype.fixChildrenParent = function (parent) {
  for (var i = 0; i < this.objects.length; i++) {
    this.objects[i].parent = this;
    this.objects[i].fixChildrenParent();
  }
};
DisplayObject.prototype.clone = function () {
  var clone = Utils.clone(this);
  clone.fixChildrenParent();
  return clone;
};
function Graphics() {
  Utils.callSuperConstructor(Graphics, this);
}
Utils.extend(Graphics, DisplayObject);
Graphics.prototype.x = 0;
Graphics.prototype.y = 0;
Graphics.prototype.color = "#000";
Graphics.prototype.lineWidth = 1;
Graphics.prototype.lineDash = null;
Graphics.prototype.render = function (cns, drawStatic, delta) {
  if (!!this.static == !!drawStatic && this.hasEventListener("render"))
    this.dispatchEvent("render", { target: this, canvas: cns, delta: delta });
  Utils.callSuperMethod(Graphics, this, "render", cns, drawStatic, delta);
};
Graphics.prototype.preparePath = function (cns) {
  this.moveCanvasAnchor(cns);
  this.prepareCanvasShadow(cns);
  cns.ctx.beginPath();
  cns.ctx.strokeStyle = this.lineWidth > 0 ? this.color : "transparent";
  cns.ctx.lineWidth = this.lineWidth * Utils.globalScale;
  cns.ctx.globalAlpha = this.getAbsoluteOpacity();
  cns.ctx.fillStyle = this.getFillStyle(cns);
  if (this.lineDash && cns.ctx.setLineDash) {
    var p = [];
    for (var i = 0; i < this.lineDash.length; i++)
      p.push(this.lineDash[i] * Utils.globalScale);
    cns.ctx.setLineDash(p);
  }
};
Graphics.prototype.finalizeCanvas = function (cns) {
  if (
    this.fillColor ||
    this.fillLinearGradient ||
    this.fillRadialGradient ||
    this.fillPattern
  )
    cns.ctx.fill();
  cns.ctx.stroke();
  this.restoreCanvasShadow(cns);
  this.moveCanvasAnchor(cns, true);
};
Graphics.prototype.resetView = function () {
  this.color = "transparent";
  this.fillColor = null;
  this.fillLinearGradient = null;
  this.fillRadialGradient = null;
  this.fillPattern = null;
};
Graphics.circle = function (x, y, radius) {
  Utils.callSuperConstructor(Graphics.circle, this);
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.width = radius * 2;
  this.height = radius * 2;
};
Utils.extend(Graphics.circle, Graphics);
Graphics.circle.prototype.render = function (cns, drawStatic, delta) {
  this.prepareCanvas(cns);
  if (!!this.static == !!drawStatic && this.opacity != 0) {
    this.preparePath(cns);
    cns.ctx.arc(0, 0, this.radius * Utils.globalScale, 0, Math.PI * 2);
    this.finalizeCanvas(cns);
  }
  Utils.callSuperMethod(
    Graphics.circle,
    this,
    "render",
    cns,
    drawStatic,
    delta
  );
  this.restoreCanvas(cns);
};
Graphics.line = function (x1, y1, x2, y2) {
  Utils.callSuperConstructor(Graphics.line, this);
  this.x1 = x1;
  this.x2 = x2;
  this.y1 = y1;
  this.y2 = y2;
};
Utils.extend(Graphics.line, Graphics);
Graphics.line.prototype.render = function (cns, drawStatic, delta) {
  this.prepareCanvas(cns);
  if (!!this.static == !!drawStatic && this.opacity != 0) {
    this.preparePath(cns);
    cns.ctx.moveTo(this.x1 * Utils.globalScale, this.y1 * Utils.globalScale);
    cns.ctx.lineTo(this.x2 * Utils.globalScale, this.y2 * Utils.globalScale);
    this.finalizeCanvas(cns);
  }
  Utils.callSuperMethod(Graphics.line, this, "render", cns, drawStatic, delta);
  this.restoreCanvas(cns);
};
Graphics.rectangle = function (x, y, width, height) {
  Utils.callSuperConstructor(Graphics.rectangle, this);
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
};
Utils.extend(Graphics.rectangle, Graphics);
Graphics.rectangle.prototype.render = function (cns, drawStatic, delta) {
  this.prepareCanvas(cns);
  if (!!this.static == !!drawStatic && this.opacity != 0) {
    this.preparePath(cns);
    cns.ctx.rect(
      (-this.width / 2) * Utils.globalScale,
      (-this.height / 2) * Utils.globalScale,
      this.width * Utils.globalScale,
      this.height * Utils.globalScale
    );
    this.finalizeCanvas(cns);
  }
  Utils.callSuperMethod(
    Graphics.rectangle,
    this,
    "render",
    cns,
    drawStatic,
    delta
  );
  this.restoreCanvas(cns);
};
Graphics.arc = function (x, y, radius, startAngle, endAngle, antiClockWise) {
  Utils.callSuperConstructor(Graphics.arc, this);
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.startAngle = startAngle;
  this.endAngle = endAngle;
  this.antiClockWise = antiClockWise;
  this.width = radius * 2;
  this.height = radius * 2;
};
Utils.extend(Graphics.arc, Graphics);
Graphics.arc.prototype.render = function (cns, drawStatic, delta) {
  this.prepareCanvas(cns);
  if (!!this.static == !!drawStatic && this.opacity != 0) {
    this.preparePath(cns);
    cns.ctx.arc(
      0,
      0,
      this.radius * Utils.globalScale,
      this.startAngle,
      this.endAngle,
      this.antiClockWise
    );
    this.finalizeCanvas(cns);
  }
  Utils.callSuperMethod(Graphics.arc, this, "render", cns, drawStatic, delta);
  this.restoreCanvas(cns);
};
Graphics.polygon = function (points) {
  if (!points || points.length < 2) throw Error("Invalid parameters");
  Utils.callSuperConstructor(Graphics.polygon, this);
  this.points = points;
  var minX = Number.MAX_VALUE;
  var minY = Number.MAX_VALUE;
  var maxX = Number.MIN_VALUE;
  var maxY = Number.MIN_VALUE;
  for (var i = 0; i < points.length; i++) {
    if (points[i].x < minX) minX = points[i].x;
    if (points[i].y < minY) minY = points[i].y;
    if (points[i].x > maxX) maxX = points[i].x;
    if (points[i].y > maxY) maxY = points[i].y;
  }
  this.width = maxX - minX;
  this.height = maxY - minY;
};
Utils.extend(Graphics.polygon, Graphics);
Graphics.polygon.prototype.render = function (cns, drawStatic, delta) {
  this.prepareCanvas(cns);
  if (!!this.static == !!drawStatic && this.opacity != 0) {
    this.preparePath(cns);
    cns.ctx.moveTo(
      this.points[0].x * Utils.globalScale,
      this.points[0].y * Utils.globalScale
    );
    for (var i = 1; i < this.points.length; i++)
      cns.ctx.lineTo(
        this.points[i].x * Utils.globalScale,
        this.points[i].y * Utils.globalScale
      );
    cns.ctx.lineTo(
      this.points[0].x * Utils.globalScale,
      this.points[0].y * Utils.globalScale
    );
    this.finalizeCanvas(cns);
  }
  Utils.callSuperMethod(
    Graphics.polygon,
    this,
    "render",
    cns,
    drawStatic,
    delta
  );
  this.restoreCanvas(cns);
};
Graphics.text = function (x, y, text) {
  Utils.callSuperConstructor(Graphics.text, this);
  this.x = x;
  this.y = y;
  this.text = text;
  this.align = Graphics.text.ALIGN_LEFT;
  this.valign = Graphics.text.VALIGN_MIDDLE;
  this.style = "normal";
  this.size = 10;
  this.font = "sans-serif";
};
Utils.extend(Graphics.text, Graphics);
Graphics.text.ALIGN_LEFT = "left";
Graphics.text.ALIGN_CENTER = "center";
Graphics.text.ALIGN_RIGHT = "right";
Graphics.text.VALIGN_TOP = "top";
Graphics.text.VALIGN_MIDDLE = "middle";
Graphics.text.VALIGN_BOTTOM = "bottom";
Graphics.text.prototype.getRect = function (cns) {
  return cns.ctx.measureText(this.text);
};
Graphics.text.prototype.render = function (cns, drawStatic, delta) {
  this.prepareCanvas(cns);
  if (!!this.static == !!drawStatic && this.opacity != 0) {
    this.preparePath(cns);
    cns.ctx.font =
      this.style +
      " " +
      Math.floor(this.size * Utils.globalScale) +
      "px " +
      this.font;
    cns.ctx.textAlign = this.align;
    cns.ctx.textBaseline = this.valign;
    if (this.fillColor) cns.ctx.fillText(this.text, 0, 0);
    cns.ctx.strokeText(this.text, 0, 0);
    this.finalizeCanvas(cns);
  }
  Utils.callSuperMethod(Graphics.text, this, "render", cns, drawStatic, delta);
  this.restoreCanvas(cns);
};
Graphics.free = function () {
  this.commands = [];
  Utils.callSuperConstructor(Graphics.free, this);
};
Utils.extend(Graphics.free, Graphics);
Graphics.free.prototype.clear = function () {
  this.commands = [];
  Utils.callSuperMethod(Graphics.free, this, "clear");
};
Graphics.free.prototype.beginPath = function () {
  this.commands.push({ command: "beginPath" });
  return this;
};
Graphics.free.prototype.stroke = function () {
  this.commands.push({ command: "stroke" });
  return this;
};
Graphics.free.prototype.setStrokeStyle = function (style) {
  this.commands.push({ command: "setStrokeStyle", style: style });
  return this;
};
Graphics.free.prototype.setFillStyle = function (style) {
  this.commands.push({ command: "setFillStyle", style: style });
  return this;
};
Graphics.free.prototype.fill = function () {
  this.commands.push({ command: "fill" });
  return this;
};
Graphics.free.prototype.moveTo = function (x, y) {
  this.commands.push({ command: "moveTo", x: x, y: y });
  return this;
};
Graphics.free.prototype.lineTo = function (x, y) {
  this.commands.push({ command: "lineTo", x: x, y: y });
  return this;
};
Graphics.free.prototype.arc = function (
  x,
  y,
  radius,
  startAngle,
  endAngle,
  antiClockWise
) {
  this.commands.push({
    command: "arc",
    x: x,
    y: y,
    radius: radius,
    startAngle: startAngle,
    endAngle: endAngle,
    antiClockWise: antiClockWise,
  });
  return this;
};
Graphics.free.prototype.circle = function (x, y, radius) {
  this.commands.push({ command: "circle", x: x, y: y, radius: radius });
  return this;
};
Graphics.free.prototype.rect = function (x, y, width, height) {
  this.commands.push({
    command: "circle",
    x: x,
    y: y,
    width: width,
    height: height,
  });
  return this;
};
Graphics.free.prototype.polygon = function (points) {
  this.commands.push({ command: "polygon", points: points });
  return this;
};
Graphics.free.prototype.executeCommand = function (cns, c) {
  switch (c.command) {
    case "beginPath":
      cns.ctx.beginPath();
      break;
    case "stroke":
      cns.ctx.stroke();
      break;
    case "fill":
      cns.ctx.fill();
      break;
    case "setStrokeStyle":
      cns.ctx.strokeStyle = this.lineWidth > 0 ? c.style : "transparent";
      break;
    case "setFillStyle":
      cns.ctx.fillStyle = c.style;
      break;
    case "moveTo":
      cns.ctx.moveTo(c.x * Utils.globalScale, c.y * Utils.globalScale);
      break;
    case "lineTo":
      cns.ctx.lineTo(c.x * Utils.globalScale, c.y * Utils.globalScale);
      break;
    case "arc":
      cns.ctx.arc(
        c.x * Utils.globalScale,
        c.y * Utils.globalScale,
        c.radius * Utils.globalScale,
        c.startAngle,
        c.endAngle,
        c.antiClockWise
      );
      break;
    case "circle":
      cns.ctx.arc(
        c.x * Utils.globalScale,
        c.y * Utils.globalScale,
        c.radius * Utils.globalScale,
        0,
        Math.PI * 2
      );
      break;
    case "rect":
      cns.ctx.rect(
        (c.x - c.width / 2) * Utils.globalScale,
        (c.y - c.height / 2) * Utils.globalScale,
        c.width * Utils.globalScale,
        c.height * Utils.globalScale
      );
      break;
    case "polygon":
      cns.ctx.moveTo(
        c.points[0].x * Utils.globalScale,
        c.points[0].y * Utils.globalScale
      );
      for (var n = 1; n < c.points.length; n++)
        cns.ctx.lineTo(
          c.points[n].x * Utils.globalScale,
          c.points[n].y * Utils.globalScale
        );
      cns.ctx.lineTo(
        c.points[0].x * Utils.globalScale,
        c.points[0].y * Utils.globalScale
      );
      break;
  }
};
Graphics.free.prototype.executeCommands = function (cns) {
  for (var i = 0; i < this.commands.length; i++)
    this.executeCommand(cns, this.commands[i]);
};
Graphics.free.prototype.render = function (cns, drawStatic, delta) {
  this.prepareCanvas(cns);
  if (!!this.static == !!drawStatic && this.opacity != 0) {
    this.preparePath(cns);
    this.executeCommands(cns);
    this.finalizeCanvas(cns);
  }
  Utils.callSuperMethod(Graphics.free, this, "render", cns, drawStatic, delta);
  this.restoreCanvas(cns);
};
var BitmapsCache = {};
BitmapsCache.bitmaps = {};
BitmapsCache.cache = function (bitmap) {
  if (!bitmap || !(bitmap instanceof Image)) return bitmap;
  if (BitmapsCache.bitmaps[bitmap.src]) return BitmapsCache.bitmaps[bitmap.src];
  cns = document.createElement("canvas");
  cns.width = bitmap.width;
  cns.height = bitmap.height;
  ctx = cns.getContext("2d");
  ctx.drawImage(
    bitmap,
    0,
    0,
    bitmap.width,
    bitmap.height,
    0,
    0,
    bitmap.width,
    bitmap.height
  );
  BitmapsCache.bitmaps[bitmap.src] = cns;
  return cns;
};
function Sprite(img, w, h, f, l) {
  Utils.callSuperConstructor(Sprite, this);
  this.offset = { left: 0, top: 0 };
  this.width = w;
  this.height = h;
  this.totalFrames = Math.max(1, ~~f);
  if (this.totalFrames <= 1) this.animated = false;
  this.totalLayers = Math.max(1, ~~l);
  this.bitmap = img;
  this.changeFrameDelay = Sprite.CHANGE_FRAME_DELAY;
  this.cacheBitmap = Sprite.CACHE_BITMAPS;
}
Utils.extend(Sprite, DisplayObject);
Sprite.prototype.animated = true;
Sprite.prototype.animDirection = 1;
Sprite.prototype.currentFrame = 0;
Sprite.prototype.totalFrames = 1;
Sprite.prototype.currentLayer = 0;
Sprite.prototype.totalLayers = 1;
Sprite.prototype.bitmap = null;
Sprite.prototype.mask = null;
Sprite.prototype.isMask = false;
Sprite.prototype.maskParent = null;
Sprite.prototype.maskInvert = false;
Sprite.prototype.animStep = 0;
Sprite.prototype.animDelay = 1;
Sprite.prototype.changeFrameDelay = 1e3 / 24;
Sprite.prototype.changeFrameTime = 0;
Sprite.prototype.onchangeframe = null;
Sprite.prototype.cacheBitmap = false;
Sprite.create = function (asset, library) {
  if (typeof asset == "string") {
    library = library || window["library"];
    if (!library)
      throw new Error(
        "Could not create sprite from asset '%s'. Library not found.",
        asset
      );
    asset = library.getAsset(asset);
  }
  return new Sprite(
    asset.bitmap,
    asset.width || 1,
    asset.height || 1,
    asset.frames || 1,
    asset.layers || 1
  );
};
Sprite.prototype.play = function () {
  this.animated = true;
};
Sprite.prototype.stop = function () {
  this.animated = false;
};
Sprite.prototype.gotoAndStop = function (frame) {
  this.currentFrame = frame;
  this.stop();
};
Sprite.prototype.gotoAndPlay = function (frame) {
  this.currentFrame = frame;
  this.play();
};
Sprite.prototype.nextFrame = function (delta) {
  if (this.hasEventListener("enterframe"))
    this.dispatchEvent("enterframe", { target: this, delta: delta });
  var changeFramesCount = 1;
  if (Sprite.CHANGE_FRAME_TYPE == Sprite.CHANGE_FRAME_BY_TIME) {
    this.changeFrameTime += delta;
    if (this.changeFrameTime >= this.changeFrameDelay * this.animDelay) {
      changeFramesCount = Math.floor(
        this.changeFrameTime / (this.changeFrameDelay * this.animDelay)
      );
      this.changeFrameTime -=
        Math.abs(changeFramesCount) * this.changeFrameDelay * this.animDelay;
    } else return;
  } else this.animStep++;
  if (
    this.animStep >= this.animDelay ||
    Sprite.CHANGE_FRAME_TYPE == Sprite.CHANGE_FRAME_BY_TIME
  ) {
    for (var i = 0; i < changeFramesCount; i++) {
      if (this.animated) this.currentFrame += this.animDirection;
      if (this.animDirection > 0 && this.currentFrame >= this.totalFrames)
        this.currentFrame = 0;
      if (this.animDirection < 0 && this.currentFrame < 0)
        this.currentFrame = this.totalFrames - 1;
      if (this.hasEventListener("changeframe"))
        this.dispatchEvent("changeframe", { target: this, delta: delta });
    }
    this.animStep = 0;
  }
};
Sprite.prototype.setMask = function (mask) {
  this.mask = mask;
  this.mask.isMask = true;
  this.mask.stage = this.stage;
  this.mask.maskParent = this;
};
Sprite.prototype.renderBack = function (cns, fill, w, h) {
  if (fill) {
    cns.ctx.save();
    cns.ctx.translate(-(w / 2), -(h / 2));
    cns.ctx.fillStyle = fill;
    cns.ctx.strokeStyle = fill;
    cns.ctx.fillRect(0, 0, w, h);
    cns.ctx.restore();
  }
};
Sprite.prototype.renderBitmap = function (cns, w, h, getRect) {
  if (this.bitmap) {
    var iw = this.bitmap.width,
      ih = this.bitmap.height;
    var fx = this.currentLayer * w + this.offset.left * Utils.globalScale,
      fy = this.currentFrame * h + this.offset.top * Utils.globalScale;
    if (fx < 0) fx = 0;
    if (fy < 0) fy = 0;
    if (fx < iw && fy < ih) {
      var fw = w,
        fh = h;
      if (fx + fw > iw) fw = iw - fx;
      if (fy + fh > ih) fh = ih - fy;
      if (Sprite.FLOOR_VALUES_ON_RENDER) {
        fx = ~~fx;
        fy = ~~fy;
        fw = ~~fw;
        fh = ~~fh;
        w = ~~w;
        h = ~~h;
      }
      if (fw > 0 && fh > 0 && w > 0 && h > 0)
        cns.ctx.drawImage(
          this.cacheBitmap ? BitmapsCache.cache(this.bitmap) : this.bitmap,
          fx,
          fy,
          fw,
          fh,
          -w / 2,
          -h / 2,
          w,
          h
        );
      if (getRect) return { x: fx, y: fy, width: fw, height: fh };
    }
  }
  if (getRect) return { x: 0, y: 0, width: w, height: h };
};
Sprite.prototype.render = function (cns, drawStatic, delta, drawMask) {
  if (this.isMask && !drawMask) return;
  if (!delta) delta = 0;
  var isRender = !!this.static == !!drawStatic;
  if (isRender) this.nextFrame(delta);
  if (!this.stage) return;
  this.prepareCanvas(cns);
  if (isRender)
    if (this.visible && this.opacity != 0)
      if (
        !this.hasEventListener("prerender") ||
        this.dispatchEvent("prerender", {
          target: this,
          canvas: cns,
          delta: delta,
        }) !== false
      ) {
        this.moveCanvasAnchor(cns);
        var ow = this.width * Utils.globalScale,
          oh = this.height * Utils.globalScale,
          fill = this.getFillStyle(cns);
        this.prepareCanvasShadow(cns);
        if (this.ceilSizes) {
          ow = Math.ceil(ow);
          oh = Math.ceil(oh);
        }
        if (this.mask) {
          this.stage.buffer.width = this.stage.buffer.width;
          this.stage.buffer.ctx.save();
          this.stage.buffer.ctx.translate(ow / 2, oh / 2);
          this.renderBack(this.stage.buffer, fill, ow, oh);
          var rect = this.renderBitmap(this.stage.buffer, ow, oh, true);
          this.stage.buffer.ctx.globalCompositeOperation = this.maskInvert
            ? "destination-out"
            : "destination-in";
          if (this.mask.render)
            this.mask.render(this.stage.buffer, drawStatic, delta, true);
          else
            this.stage.buffer.ctx.drawImage(
              this.mask,
              this.mask.x ? this.mask.x : 0,
              this.mask.y ? this.mask.y : 0
            );
          if (Sprite.FLOOR_VALUES_ON_RENDER)
            cns.ctx.drawImage(
              this.stage.buffer,
              0,
              0,
              rect.width,
              rect.height,
              -Math.floor(ow / 2),
              -Math.floor(oh / 2),
              ~~ow,
              ~~oh
            );
          else
            cns.ctx.drawImage(
              this.stage.buffer,
              0,
              0,
              rect.width,
              rect.height,
              ox,
              oy,
              ow,
              oh
            );
          this.stage.buffer.ctx.restore();
        } else {
          this.renderBack(cns, fill, ow, oh);
          this.renderBitmap(cns, ow, oh);
        }
        if (this.stage.allowDebugDrawing && this.allowDebugDrawing)
          if (this.stage.allowStaticDebugDrawing || !this.static)
            this.debugDraw();
        if (this.hasEventListener("render"))
          this.dispatchEvent("render", {
            target: this,
            canvas: cns,
            delta: delta,
          });
        this.restoreCanvasShadow(cns);
        this.moveCanvasAnchor(cns, true);
      }
  Utils.callSuperMethod(Sprite, this, "render", cns, drawStatic, delta);
  this.restoreCanvas(cns);
};
Sprite.prototype.resetView = function () {
  this.bitmap = null;
  this.fillColor = null;
  this.fillLinearGradient = null;
  this.fillRadialGradient = null;
  this.fillPattern = null;
  for (var i = 0; i < this.objects.length; i++)
    if (this.objects[i].resetView) this.objects[i].resetView();
};
Sprite.CHANGE_FRAME_BY_FRAME = 0;
Sprite.CHANGE_FRAME_BY_TIME = 1;
Sprite.CHANGE_FRAME_DELAY = 1e3 / 24;
Sprite.CHANGE_FRAME_TYPE = Sprite.CHANGE_FRAME_BY_FRAME;
Sprite.FLOOR_VALUES_ON_RENDER = true;
Sprite.CACHE_BITMAPS = false;
function StageTimer(onend, timeout, repeat) {
  Utils.callSuperConstructor(StageTimer, this);
  this.repeat = repeat;
  this.initialTimeout = timeout;
  this.timeout = timeout;
  this.onend = onend;
  this.ontick = null;
  this.destroy = false;
  this.newly = true;
  this.paused = false;
}
Utils.extend(StageTimer, EventsProxy);
StageTimer.prototype.update = function (delta) {
  if (this.destroy) return true;
  if (this.paused) return false;
  if (StageTimer.TIMEOUT_TYPE == StageTimer.TIMEOUT_BY_FRAME) this.timeout--;
  else this.timeout -= delta;
  if (this.timeout <= 0) {
    if (typeof this.onend == "string") eval(this.onend);
    else if (this.hasEventListener("end"))
      this.dispatchEvent("end", { target: this });
    if (this.repeat) this.rewind();
    else return true;
  }
  if (this.hasEventListener("tick"))
    this.dispatchEvent("tick", { target: this, delta: delta });
  return false;
};
StageTimer.prototype.rewind = function () {
  this.timeout = this.initialTimeout;
};
StageTimer.prototype.resume = function () {
  this.paused = false;
};
StageTimer.prototype.pause = function () {
  this.paused = true;
};
StageTimer.TIMEOUT_BY_FRAME = 0;
StageTimer.TIMEOUT_BY_TIME = 1;
StageTimer.TIMEOUT_TYPE = StageTimer.TIMEOUT_BY_FRAME;
function Stage(canvas, w, h) {
  Utils.callSuperConstructor(Stage, this);
  this.canvas = null;
  if (canvas) {
    this.canvas =
      typeof canvas == "string" ? document.getElementById(canvas) : canvas;
    this.canvas.ctx = this.canvas.getContext("2d");
  }
  this.backgroundCanvas = null;
  this.needToRebuildBack = false;
  this.screenWidth = w;
  this.screenHeight = h;
  this.viewport = { x: 0, y: 0 };
  this.buffer = null;
  try {
    this.buffer = document.createElement("canvas");
    this.buffer.width = w * Utils.globalScale;
    this.buffer.height = h * Utils.globalScale;
    this.buffer.ctx = this.buffer.getContext("2d");
  } catch (e) {
    this.buffer = this.canvas;
  }
  this.delay = 40;
  this.started = false;
  this.fps = 0;
  this.lastFPS = 0;
  this.showFPS = false;
  this.pixelClickEvent = false;
  this.pixelMouseUpEvent = false;
  this.pixelMouseDownEvent = false;
  this.pixelMouseMoveEvent = false;
  this.ceilSizes = false;
  this.tmMain = null;
  this.tmFPS = null;
  this.clearLock = false;
  this.allowDebugDrawing = false;
  this.allowStaticDebugDrawing = false;
  this.drawBackAlways = Utils.mobileCheckBrokenAndroid();
  this.tweens = [];
  this.timers = [];
  this.eventsListeners = [];
  this.lastTick = 0;
  this.inputController = null;
  this.inputListeners = null;
  this.onpretick = null;
  this.prerender = null;
  this.onposttick = null;
  this.onmousedown = null;
  this.onmouseup = null;
  this.onclick = null;
  this.oncontextmenu = null;
  this.onmousemove = null;
  if (this.canvas) this.addInputListeners(this.canvas);
  this.tick = Utils.proxy(this.tick, this);
  this.clearFPS = Utils.proxy(this.clearFPS, this);
  this.stage = this;
  this.drawScene = this.render;
}
Utils.extend(Stage, DisplayObjectContainer);
Stage.prototype.refreshBackground = function () {
  this.needToRebuildBack = true;
};
Stage.prototype.setBackgroundCanvas = function (canvas) {
  if (canvas) {
    this.backgroundCanvas =
      typeof canvas == "string" ? document.getElementById(canvas) : canvas;
    this.backgroundCanvas.ctx = this.backgroundCanvas.getContext("2d");
  }
};
Stage.prototype.destroy = function () {
  clearTimeout(this.tmMain);
  clearTimeout(this.tmFPS);
  this.stop();
  this.clear();
  this.clearScreen(this.canvas);
  if (this.backgroundCanvas) this.clearScreen(this.backgroundCanvas);
  this.removeInputListeners(this.stage);
};
Stage.prototype.clearScreen = function (canvas) {
  if (!this.clearLock)
    canvas.ctx.clearRect(
      0,
      0,
      Math.floor(canvas.width),
      Math.floor(canvas.height)
    );
};
Stage.prototype.addChild = function (item) {
  item.stage = this;
  return Utils.callSuperMethod(Stage, this, "addChild", item);
};
Stage.prototype.setZIndex = function (item, index) {
  this.setChildZIndex(item, index);
};
Stage.prototype.finalizeMouseCoords = function (obj, m) {
  if (!obj) return m;
  var eX = this.prepareMouseCoord(m.x);
  var eY = this.prepareMouseCoord(m.y);
  if (!obj.getIgnoreViewport()) {
    eX += this.viewport.x;
    eY += this.viewport.y;
  }
  var p = obj.getAbsolutePosition();
  eX = eX - p.x;
  eY = eY - p.y;
  return { x: eX, y: eY };
};
Stage.prototype.prepareMouseCoord = function (val) {
  return val / Utils.globalScale / Utils.globalPixelScale;
};
Stage.prototype.processMouseEvent = function (event, type, pixelCheck) {
  var m = Utils.getMouseCoord(event, this.inputController);
  var stack = this.getObjectsStackByCoord(
    this.prepareMouseCoord(m.x),
    this.prepareMouseCoord(m.y),
    pixelCheck,
    false
  );
  var ret, f;
  for (var i = 0; i < stack.length; i++) {
    f = this.finalizeMouseCoords(stack[i], m);
    if (stack[i].hasEventListener(type))
      ret = stack[i].dispatchEvent(type, { target: stack[i], x: f.x, y: f.y });
    if (ret === false) return;
  }
  if (this.hasEventListener(type))
    this.dispatchEvent(type, {
      target: this,
      x: Math.floor(this.prepareMouseCoord(m.x)),
      y: Math.floor(this.prepareMouseCoord(m.y)),
    });
};
Stage.prototype.checkClick = function (event) {
  this.processMouseEvent(event, "click", this.pixelClickEvent);
};
Stage.prototype.checkContextMenu = function (event) {
  this.processMouseEvent(event, "contextmenu", this.pixelClickEvent);
};
Stage.prototype.checkMouseMove = function (event) {
  var m = Utils.getMouseCoord(event, this.inputController);
  this.doDrag(this.prepareMouseCoord(m.x), this.prepareMouseCoord(m.y));
  var stack = this.getObjectsStackByCoord(
    this.prepareMouseCoord(m.x),
    this.prepareMouseCoord(m.y),
    this.pixelMouseMoveEvent
  );
  var i,
    n,
    ret,
    bOk,
    f,
    overStack = [];
  if (stack.length > 0) {
    for (i = 0; i < stack.length; i++) {
      overStack.push(stack[i]);
      f = this.finalizeMouseCoords(stack[i], m);
      if (stack[i].hasEventListener("mousemove"))
        ret = stack[i].dispatchEvent("mousemove", {
          target: stack[i],
          x: f.x,
          y: f.y,
        });
      if (ret === false) break;
    }
    if (ret !== false && this.hasEventListener("mousemove"))
      this.dispatchEvent("mousemove", {
        target: this,
        x: Math.floor(this.prepareMouseCoord(m.x)),
        y: Math.floor(this.prepareMouseCoord(m.y)),
      });
    ret = true;
    for (i = 0; i < overStack.length; i++) {
      f = this.finalizeMouseCoords(overStack[i], m);
      if (!overStack[i].mouseOn && overStack[i].hasEventListener("mouseover"))
        ret = overStack[i].dispatchEvent("mouseover", {
          target: overStack[i],
          x: f.x,
          y: f.y,
        });
      overStack[i].mouseOn = true;
      if (ret === false) {
        overStack = overStack.slice(0, i + 1);
        break;
      }
    }
  }
  this.checkMouseOut(overStack, m);
};
Stage.prototype.checkMouseDown = function (event) {
  this.processMouseEvent(event, "mousedown", this.pixelMouseDownEvent);
};
Stage.prototype.checkMouseUp = function (event) {
  this.processMouseEvent(event, "mouseup", this.pixelMouseUpEvent);
};
Stage.prototype.clear = function () {
  this.tweens = [];
  this.timers = [];
  this.eventsListeners = [];
  this.objectsCounter = 0;
  Utils.callSuperMethod(Stage, this, "clear");
};
Stage.prototype.getCenter = function () {
  return { x: this.screenWidth / 2, y: this.screenHeight / 2 };
};
Stage.prototype.prepareCanvasToGraph = function (cns) {
  cns.ctx.save();
  cns.ctx.setTransform(1, 0, 0, 1, 0, 0);
  cns.ctx.globalAlpha = 1;
};
Stage.prototype.drawRectangle = function (
  x,
  y,
  width,
  height,
  color,
  fill,
  opacity,
  ignoreViewport
) {
  var cns = this.canvas;
  this.prepareCanvasToGraph(cns);
  if (typeof opacity != "undefined") cns.ctx.globalAlpha = opacity;
  else cns.ctx.globalAlpha = 1;
  cns.ctx.fillStyle = color;
  cns.ctx.strokeStyle = color;
  if (!ignoreViewport) {
    x -= this.viewport.x;
    y -= this.viewport.y;
  }
  x = x * Utils.globalScale;
  y = y * Utils.globalScale;
  width = width * Utils.globalScale;
  height = height * Utils.globalScale;
  if (fill) cns.ctx.fillRect(x - width / 2, y - height / 2, width, height);
  else cns.ctx.strokeRect(x - width / 2, y - height / 2, width, height);
  cns.ctx.restore();
};
Stage.prototype.drawCircle = function (
  x,
  y,
  radius,
  width,
  color,
  opacity,
  ignoreViewport
) {
  this.drawArc(
    x,
    y,
    radius,
    0,
    Math.PI * 2,
    false,
    width,
    color,
    opacity,
    ignoreViewport
  );
};
Stage.prototype.drawArc = function (
  x,
  y,
  radius,
  startAngle,
  endAngle,
  anticlockwise,
  width,
  color,
  opacity,
  ignoreViewport
) {
  var cns = this.canvas;
  this.prepareCanvasToGraph(cns);
  var oldLW = cns.ctx.lineWidth;
  if (typeof color == "undefined") color = "#000";
  cns.ctx.strokeStyle = color;
  if (typeof width == "undefined") width = 1;
  cns.ctx.lineWidth = width * Utils.globalScale;
  if (typeof opacity == "undefined") opacity = 1;
  cns.ctx.globalAlpha = opacity;
  if (!ignoreViewport) {
    x -= this.viewport.x;
    y -= this.viewport.y;
  }
  x = x * Utils.globalScale;
  y = y * Utils.globalScale;
  radius = radius * Utils.globalScale;
  cns.ctx.beginPath();
  cns.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  cns.ctx.stroke();
  cns.ctx.lineWidth = oldLW;
  cns.ctx.restore();
};
Stage.prototype.drawPolygon = function (
  points,
  width,
  color,
  opacity,
  ignoreViewport
) {
  if (
    typeof points != "object" ||
    !(points instanceof Array) ||
    points.length < 2
  )
    return;
  for (var i = 0; i < points.length - 1; i++)
    this.drawLine(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
      width,
      color,
      opacity,
      ignoreViewport
    );
  this.drawLine(
    points[i].x,
    points[i].y,
    points[0].x,
    points[0].y,
    width,
    color,
    opacity,
    ignoreViewport
  );
};
Stage.prototype.drawLine = function (
  x1,
  y1,
  x2,
  y2,
  width,
  color,
  opacity,
  ignoreViewport
) {
  var cns = this.canvas;
  this.prepareCanvasToGraph(cns);
  var oldLW = cns.ctx.lineWidth;
  if (color) cns.ctx.strokeStyle = color;
  else cns.ctx.strokeStyle = "#000";
  if (width) cns.ctx.lineWidth = width * Utils.globalScale;
  else cns.ctx.lineWidth = 1 * Utils.globalScale;
  if (opacity) cns.ctx.globalAlpha = opacity;
  else cns.ctx.globalAlpha = 1;
  if (!ignoreViewport) {
    x1 -= this.viewport.x;
    y1 -= this.viewport.y;
    x2 -= this.viewport.x;
    y2 -= this.viewport.y;
  }
  x1 = x1 * Utils.globalScale;
  y1 = y1 * Utils.globalScale;
  x2 = x2 * Utils.globalScale;
  y2 = y2 * Utils.globalScale;
  cns.ctx.beginPath();
  cns.ctx.moveTo(x1, y1);
  cns.ctx.lineTo(x2, y2);
  cns.ctx.stroke();
  cns.ctx.lineWidth = oldLW;
  cns.ctx.restore();
};
Stage.prototype.start = function () {
  if (this.started) return;
  this.started = true;
  this.clearFPS();
  this.tick();
};
Stage.prototype.forceRender = function () {
  if (this.started) this.tick();
};
Stage.prototype.stop = function () {
  this.started = false;
};
Stage.prototype.clearFPS = function () {
  this.lastFPS = this.fps;
  this.fps = 0;
  if (this.started) this.tmFPS = setTimeout(this.clearFPS, 1e3);
};
Stage.prototype.setTextStyle = function (
  font,
  size,
  style,
  color,
  borderColor,
  canvas
) {
  var cns = canvas ? canvas : this.canvas;
  cns.ctx.fillStyle = color;
  cns.ctx.strokeStyle = borderColor;
  var s = "";
  if (style) s += style + " ";
  if (size) s += Math.floor(size * Utils.globalScale) + "px ";
  if (font) s += font;
  cns.ctx.font = s;
};
Stage.prototype.drawText = function (
  text,
  x,
  y,
  opacity,
  ignoreViewport,
  alignCenter,
  canvas
) {
  var cns = canvas ? canvas : this.canvas;
  if (typeof opacity == "undefined") cns.ctx.globalAlpha = 1;
  else cns.ctx.globalAlpha = opacity;
  if (!ignoreViewport) {
    x -= this.viewport.x;
    y -= this.viewport.y;
  }
  x = x * Utils.globalScale;
  y = y * Utils.globalScale;
  if (alignCenter) x = x - this.getTextWidth(text) / 2;
  cns.ctx.fillText(text, x, y);
};
Stage.prototype.strokeText = function (
  text,
  x,
  y,
  opacity,
  ignoreViewport,
  alignCenter,
  canvas
) {
  var cns = canvas ? canvas : this.canvas;
  if (typeof opacity == "undefined") cns.ctx.globalAlpha = 1;
  else cns.ctx.globalAlpha = opacity;
  if (!ignoreViewport) {
    x -= this.viewport.x;
    y -= this.viewport.y;
  }
  x = x * Utils.globalScale;
  y = y * Utils.globalScale;
  if (alignCenter) x = x - this.getTextWidth(text) / 2;
  cns.ctx.strokeText(text, x, y);
};
Stage.prototype.getTextWidth = function (str, canvas) {
  var cns = canvas ? canvas : this.canvas;
  return cns.ctx.measureText(str).width;
};
Stage.prototype.render = function (cns, drawStatic, noClear, delta) {
  if (!cns) return;
  if (!delta) delta = 0;
  var obj, ok;
  if (cns && !cns.ctx) cns.ctx = cns.getContext("2d");
  if (!noClear) {
    var fill = this.getFillStyle(cns);
    if (!fill) {
      if (!this.clearLock) this.clearScreen(cns);
    } else {
      cns.ctx.fillStyle = fill;
      cns.ctx.fillRect(0, 0, cns.width, cns.height);
    }
  }
  Utils.callSuperMethod(Stage, this, "render", cns, drawStatic, delta);
};
Stage.prototype.createTween = function (obj, prop, start, end, duration, ease) {
  var t = new Tween(obj, prop, start, end, duration, ease);
  this.tweens.push(t);
  return t;
};
Stage.prototype.removeTween = function (t) {
  var id = null;
  if (isNaN(t))
    for (var i = 0; i < this.tweens.length; i++) {
      if (this.tweens[i] === t) {
        id = i;
        break;
      }
    }
  else id = t;
  if (!isNaN(id)) {
    if (this.tweens[id]) this.tweens[id].pause();
    this.tweens.splice(id, 1);
  }
  return id;
};
Stage.prototype.clearObjectTweens = function (obj) {
  for (var i = 0; i < this.tweens.length; i++)
    if (this.tweens[i].obj === obj) this.tweens[i].destroy = true;
};
Stage.prototype.updateTweens = function (delta) {
  var t;
  for (var i = 0; i < this.tweens.length; i++) {
    t = this.tweens[i];
    if (t.destroy) {
      i = this.removeTween(i);
      i--;
    }
  }
  for (var i = 0; i < this.tweens.length; i++) {
    t = this.tweens[i];
    if (!t.newly && t.tick(delta)) t.destroy = true;
    t.newly = false;
  }
};
Stage.prototype.setTimeout = function (callback, timeout) {
  var t = new StageTimer(callback, timeout);
  this.timers.push(t);
  return t;
};
Stage.prototype.clearTimeout = function (t) {
  if (t) t.destroy = true;
};
Stage.prototype.setInterval = function (callback, timeout) {
  var t = new StageTimer(callback, timeout, true);
  this.timers.push(t);
  return t;
};
Stage.prototype.clearInterval = function (t) {
  this.clearTimeout(t);
};
Stage.prototype.removeTimer = function (t) {
  this.timers = Utils.removeFromArray(this.timers, t);
};
Stage.prototype.updateTimers = function (delta) {
  var t;
  for (var i = 0; i < this.timers.length; i++) {
    t = this.timers[i];
    if (t.destroy) {
      this.removeTimer(t);
      i--;
    }
  }
  for (var i = 0; i < this.timers.length; i++) {
    t = this.timers[i];
    if (!t.newly && t.update(delta)) t.destroy = true;
    t.newly = false;
  }
};
Stage.prototype.tick = function () {
  clearTimeout(this.tmMain);
  var d;
  if (Utils.isWindowHidden) {
    this.lastTick = 0;
    d = this.delay;
  } else {
    var tmStart = new Date().getTime();
    var delta = Math.min(Stage.MIN_DELTA, tmStart - this.lastTick);
    this.lastTick = tmStart;
    if (this.hasEventListener("pretick"))
      this.dispatchEvent("pretick", { target: this, delta: delta });
    if (!this.started) {
      this.lastTick = 0;
      return;
    }
    this.updateTweens(delta);
    if (!this.started) {
      this.lastTick = 0;
      return;
    }
    this.updateTimers(delta);
    if (!this.started) {
      this.lastTick = 0;
      return;
    }
    if (this.hasEventListener("prerender"))
      this.dispatchEvent("prerender", { target: this, delta: delta });
    var noClear = false;
    if (this.drawBackAlways) {
      this.render(this.canvas, true, false, delta);
      noClear = true;
    } else if (this.needToRebuildBack) {
      this.needToRebuildBack = false;
      if (this.backgroundCanvas) this.render(this.backgroundCanvas, true);
    }
    this.render(this.canvas, false, noClear, delta);
    if (this.showFPS) {
      this.setTextStyle("sans-serif", 10, "bold", "#fff", "#000");
      this.drawText("FPS: " + this.lastFPS, 2, 10, 1, true);
    }
    if (this.hasEventListener("posttick"))
      this.dispatchEvent("posttick", { target: this, delta: delta });
    d = new Date().getTime() - tmStart;
    d = this.delay - d;
    if (d < 1) d = 1;
    this.fps++;
  }
  if (this.started) this.tmMain = setTimeout(this.tick, d);
  else this.lastTick = 0;
};
Stage.prototype.box2dSync = function (world) {
  var p;
  for (b = world.m_bodyList; b; b = b.m_next)
    if (b.sprite) {
      b.sprite.rotation = b.GetRotation();
      p = b.GetPosition();
      b.sprite.x = p.x;
      b.sprite.y = p.y;
      if (b.sprite.hasEventListener("box2dsync"))
        b.sprite.dispatchEvent("box2dsync", { target: b.sprite });
    }
};
Stage.prototype.processTouchEvent = function (touches, controller) {
  for (var i = 0; i < touches.length; i++) {
    var e = { clientX: touches[i].clientX, clientY: touches[i].clientY };
    this[controller](e);
  }
};
Stage.prototype.prepareEventTouches = function (event, type) {
  if (!event[type])
    event[type] = [{ clientX: event.clientX, clientY: event.clientY }];
  return event[type];
};
Stage.prototype.inputListeners = null;
Stage.prototype.addInputListeners = function (obj) {
  obj = obj || this.inputController || this.canvas;
  this.removeInputListeners();
  this.inputController = obj;
  if (!this.inputController) return false;
  this.inputListeners = {};
  if (Utils.touchScreen) {
    this.inputListeners[Utils.getTouchStartEvent()] = Utils.proxy(function (
      event
    ) {
      this.processTouchEvent(
        this.prepareEventTouches(event, "changedTouches"),
        "checkMouseDown"
      );
      this.processTouchEvent(
        this.prepareEventTouches(event, "changedTouches"),
        "checkClick"
      );
      return Utils.preventEvent(event);
    },
    this);
    this.inputListeners[Utils.getTouchMoveEvent()] = Utils.proxy(function (
      event
    ) {
      this.processTouchEvent(
        this.prepareEventTouches(event, "changedTouches"),
        "checkMouseMove"
      );
      return Utils.preventEvent(event);
    },
    this);
    this.inputListeners[Utils.getTouchEndEvent()] = Utils.proxy(function (
      event
    ) {
      this.processTouchEvent(
        this.prepareEventTouches(event, "changedTouches"),
        "checkMouseUp"
      );
      return Utils.preventEvent(event);
    },
    this);
  } else {
    this.inputListeners["click"] = Utils.proxy(function (event) {
      this.checkClick(event);
      return Utils.preventEvent(event);
    }, this);
    this.inputListeners["mousemove"] = Utils.proxy(function (event) {
      this.checkMouseMove(event);
      return Utils.preventEvent(event);
    }, this);
    this.inputListeners["mousedown"] = Utils.proxy(function (event) {
      if (event.button == 0) this.checkMouseDown(event);
      return Utils.preventEvent(event);
    }, this);
    this.inputListeners["mouseup"] = Utils.proxy(function (event) {
      if (event.button == 0) this.checkMouseUp(event);
      return Utils.preventEvent(event);
    }, this);
    this.inputListeners["contextmenu"] = Utils.proxy(function (event) {
      this.checkContextMenu(event);
      return Utils.preventEvent(event);
    }, this);
  }
  for (var prop in this.inputListeners)
    Utils.bindEvent(this.inputController, prop, this.inputListeners[prop]);
};
Stage.prototype.removeInputListeners = function () {
  if (this.inputController && this.inputListeners)
    for (var prop in this.inputListeners)
      Utils.unbindEvent(this.inputController, prop, this.inputListeners[prop]);
  this.inputListeners = null;
};
Stage.MIN_DELTA = 1e3 / 2;
function AudioPlayer() {
  this.disabled = false;
  this.basePath = "";
  this.mp3Support = true;
  this.delayPlay = false;
  this.audioWrapper = null;
  this.locked = false;
  this.busy = false;
  this.startPlayTime = 0;
  this.onend = null;
  this.controlPlay = Utils.proxy(this.controlPlay, this);
}
AudioPlayer.prototype.createNewAudio = function () {
  if (AudioMixer.isWebAudioSupport()) {
    var sound = AudioMixer.waContext.createBufferSource();
    sound.connect(AudioMixer.waContext.destination);
    return sound;
  } else return document.createElement("audio");
};
AudioPlayer.prototype.isMp3Support = function () {
  return document.createElement("audio").canPlayType("audio/mpeg") != "";
};
AudioPlayer.prototype.init = function (path) {
  this.basePath = path ? path : "";
  this.delayPlay = "ontouchstart" in window;
  this.audioWrapper = this.createNewAudio();
  this.mp3Support = this.isMp3Support();
  return true;
};
AudioPlayer.prototype.play = function (file, loop) {
  if (this.disabled) return false;
  var url = this.basePath + "/" + file + (this.mp3Support ? ".mp3" : ".ogg");
  this.stop();
  this.audioWrapper = this.createNewAudio();
  this.audioWrapper.doLoop = loop ? true : false;
  this.audioWrapper.fileName = file;
  if (AudioMixer.isWebAudioSupport()) {
    var self = this;
    this.loadSound(url, function (buffer) {
      self.audioWrapper.buffer = buffer;
      self.audioWrapper.noteOn
        ? self.audioWrapper.noteOn(0)
        : self.audioWrapper.start(0);
      self.startPlayTime = new Date().getTime();
      self.audioWrapper.loop = loop;
      if (typeof self.audioWrapper.playbackState != "undefined")
        self.waCheckInterval = setInterval(function () {
          if (!self.audioWrapper) {
            clearInterval(self.waCheckInterval);
            return;
          }
          if (
            self.audioWrapper.playbackState == self.audioWrapper.FINISHED_STATE
          )
            self.controlPlay();
        }, 100);
      else self.audioWrapper.onended = self.controlPlay;
    });
  } else {
    this.audioWrapper.src = url;
    this.audioWrapper.type = this.mp3Support ? "audio/mpeg" : "audio/ogg";
    this.audioWrapper.loop = false;
    this.audioWrapper.preload = "auto";
    this.audioWrapper.load();
    if (this.delayPlay) {
      this.audioWrapper.addEventListener("canplay", this.readyToPlay);
      this.audioWrapper.addEventListener("canplaythrough", this.readyToPlay);
    } else this.audioWrapper.play();
    this.audioWrapper.addEventListener("ended", this.controlPlay, false);
  }
  this.busy = true;
  this.startPlayTime = new Date().getTime();
};
AudioPlayer.prototype.loadSound = function (url, callback) {
  if (AudioMixer.buffer[url]) {
    if (callback) callback(AudioMixer.buffer[url]);
    return;
  }
  var xmlhttp = null;
  if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
  else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.open("GET", url, true);
  xmlhttp.responseType = "arraybuffer";
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && (this.status == 200 || this.status == 0))
      AudioMixer.waContext.decodeAudioData(this.response, function (buffer) {
        AudioMixer.buffer[url] = buffer;
        if (callback) callback(buffer);
      });
  };
  xmlhttp.send();
};
AudioPlayer.prototype.readyToPlay = function (e) {
  if (e.currentTarget.alreadyLoaded) return;
  e.currentTarget.alreadyLoaded = true;
  e.currentTarget.play();
};
AudioPlayer.prototype.stop = function () {
  this.busy = false;
  if (!this.audioWrapper) return;
  try {
    if (AudioMixer.isWebAudioSupport()) {
      this.audioWrapper.noteOff
        ? this.audioWrapper.noteOff(0)
        : this.audioWrapper.stop(0);
      this.audioWrapper = null;
    } else {
      this.audioWrapper.currentTime = 0;
      this.audioWrapper.pause();
      this.audioWrapper.removeEventListener("canplay", this.readyToPlay);
      this.audioWrapper.removeEventListener("canplaythrough", this.readyToPlay);
      this.audioWrapper = null;
    }
  } catch (e) {}
};
AudioPlayer.prototype.pause = function () {
  if (AudioMixer.isWebAudioSupport()) {
    if (this.audioWrapper) this.audioWrapper.disconnect();
  } else this.audioWrapper.pause();
};
AudioPlayer.prototype.resume = function () {
  if (AudioMixer.isWebAudioSupport()) {
    if (this.audioWrapper)
      try {
        this.audioWrapper.connect(AudioMixer.waContext.destination);
      } catch (e) {}
  } else this.audioWrapper.play();
};
AudioPlayer.prototype.controlPlay = function () {
  if (!this.audioWrapper) return;
  if (this.audioWrapper.doLoop) {
    if (!AudioMixer.isWebAudioSupport())
      if (Utils.isFirefox()) this.play(this.audioWrapper.fileName, true);
      else {
        this.audioWrapper.currentTime = 0;
        this.audioWrapper.play();
      }
  } else {
    this.busy = false;
    if (typeof this.onend == "function") this.onend();
    if (this.waCheckInterval) clearInterval(this.waCheckInterval);
  }
};
AudioPlayer.prototype.getPosition = function () {
  if (AudioMixer.isWebAudioSupport()) {
    if (!this.startPlayTime) return 0;
    var duration = this.getDuration();
    if (!duration) return 0;
    var position = (new Date().getTime() - this.startPlayTime) / 1e3;
    if (position <= duration) return position;
    if (!this.audioWrapper.doLoop) return duration;
    return position - Math.floor(position / duration) * duration;
  } else
    return this.audioWrapper.currentTime ? this.audioWrapper.currentTime : 0;
};
AudioPlayer.prototype.getDuration = function () {
  if (AudioMixer.isWebAudioSupport())
    return this.audioWrapper.buffer ? this.audioWrapper.buffer.duration : 0;
  else return this.audioWrapper.duration ? this.audioWrapper.duration : 0;
};
function AudioMixer(path, channelsCount) {
  this.singleChannelMode = false;
  this.channels = [];
  this.init(path, channelsCount);
}
AudioMixer.prototype.init = function (path, channelsCount) {
  if (AudioMixer.isWebAudioSupport()) {
    AudioMixer.waContext = new window.AudioContext();
    var buffer = AudioMixer.waContext.createBuffer(1, 1, 22050);
    var sound = AudioMixer.waContext.createBufferSource();
    sound.buffer = buffer;
    sound.connect(AudioMixer.waContext.destination);
    sound.noteOn ? sound.noteOn(0) : sound.start(0);
  }
  if (
    !AudioMixer.isWebAudioSupport() &&
    navigator.userAgent.toLowerCase().indexOf("mac") != -1
  ) {
    this.singleChannelMode = true;
    channelsCount = 1;
  }
  this.path = path;
  this.channels = [];
  for (var i = 0; i < channelsCount; i++) {
    this.channels[i] = new AudioPlayer();
    this.channels[i].init(path);
  }
  Utils.addEventListener("hidewindow", Utils.proxy(this.pauseOnHide, this));
  Utils.addEventListener("showwindow", Utils.proxy(this.resumeOnShow, this));
};
AudioMixer.prototype.pauseOnHide = function () {
  for (var i = 0; i < this.channels.length; i++) this.channels[i].pause();
};
AudioMixer.prototype.resumeOnShow = function () {
  for (var i = 0; i < this.channels.length; i++) this.channels[i].resume();
};
AudioMixer.prototype.play = function (file, loop, soft, channelID) {
  var cID = -1;
  if (typeof channelID == "number") cID = channelID;
  else cID = this.getFreeChannel(soft);
  if (cID >= 0 && cID < this.channels.length) {
    this.channels[cID].stop();
    this.channels[cID].play(file, loop);
  }
  return this.channels[cID];
};
AudioMixer.prototype.stop = function (cID) {
  if (cID >= 0 && cID < this.channels.length) this.channels[cID].stop();
};
AudioMixer.prototype.getFreeChannel = function (soft) {
  var cID = -1;
  var freeChannels = [];
  var maxID = -1;
  var max = -1;
  var t = 0;
  for (var i = 0; i < this.channels.length; i++)
    if (!this.channels[i].locked)
      if (!this.channels[i].busy) freeChannels.push(i);
      else {
        t = new Date().getTime();
        t -= this.channels[i].startPlayTime;
        if (t > max) {
          max = t;
          maxID = i;
        }
      }
  if (freeChannels.length == 0) {
    if (!soft && maxID >= 0) cID = maxID;
  } else cID = freeChannels[0];
  return cID;
};
AudioMixer.isWebAudioSupport = function () {
  return Boolean(window.AudioContext);
};
window.AudioContext = window.AudioContext || window.webkitAudioContext;
AudioMixer.buffer = {};
AudioMixer.waContext = null;
function SimpleText(font, width, height, ignoreViewport) {
  this.font = font;
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.align = SimpleText.ALIGN_LEFT;
  this.rotation = 0;
  this.charSpacing = 0;
  this.scale = 1;
  this.opacity = 1;
  this.static = false;
  this.charMap = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  this.charWidth = [];
  this.sprites = [];
  this.text = "";
  this.stage = window.stage;
  this.parent = window.stage;
  this.ALIGN_LEFT = SimpleText.ALIGN_LEFT;
  this.ALIGN_RIGHT = SimpleText.ALIGN_RIGHT;
  this.ALIGN_CENTER = SimpleText.ALIGN_CENTER;
  this.ignoreViewport = ignoreViewport;
}
SimpleText.prototype.manageSprites = function (text) {
  var i, char;
  var len = text.length;
  var sp_len = this.sprites.length;
  if (sp_len < len)
    for (i = 0; i < len - sp_len; i++) {
      char = new window[SimpleText.spriteClass](
        this.font,
        this.width,
        this.height,
        this.charMap.length
      );
      this.sprites.push(char);
      this.parent.addChild(char);
    }
  if (sp_len > len) {
    for (i = 0; i < sp_len - len; i++) this.parent.removeChild(this.sprites[i]);
    this.sprites.splice(0, sp_len - len);
  }
};
SimpleText.prototype.getCharIx = function (char) {
  for (var i = 0; i < this.charMap.length; i++)
    if (this.charMap[i] == char) return i;
  return -1;
};
SimpleText.prototype.getCharWidth = function (char) {
  var i = this.getCharIx(char);
  if (i >= 0) return this.charWidth[i] ? this.charWidth[i] : this.width;
  else return this.width;
};
SimpleText.prototype.getWidth = function () {
  var w = 0;
  for (var i = 0; i < this.text.length; i++)
    w += this.getCharWidth(this.text.substr(i, 1)) + this.charSpacing;
  return w;
};
SimpleText.prototype.write = function (text) {
  var curX, curY, p, p2, n;
  text = text + "";
  this.text = text;
  this.manageSprites(text);
  curX = this.x;
  curY = this.y;
  if (this.align == SimpleText.ALIGN_CENTER)
    curX =
      this.x -
      (this.getWidth() / 2) * this.scale +
      (this.getCharWidth(this.text.substr(0, 1)) / 2) * this.scale;
  if (this.align == SimpleText.ALIGN_RIGHT)
    curX = this.x - this.getWidth() * this.scale;
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
      this.sprites[i].x =
        p2.x + (this.text.substr(i, 1) == "," ? curX - chw / 2 : curX);
      this.sprites[i].y = p2.y + curY;
      this.sprites[i].rotation = this.rotation;
      this.sprites[i].static = this.static;
      this.sprites[i].opacity = this.opacity;
      this.sprites[i].ignoreViewport = this.ignoreViewport;
      this.sprites[i].gx = this.sprites[i].x;
      this.sprites[i].gy = this.sprites[i].y;
      this.sprites[i].gscaleX = this.sprites[i].scaleX;
      this.sprites[i].gscaleY = this.sprites[i].scaleY;
      this.sprites[i].grotation = this.sprites[i].rotation;
      this.sprites[i].gopacity = this.sprites[i].opacity;
      p.x += chw + this.charSpacing;
    }
  }
};
SimpleText.prototype.refresh = function () {
  this.write(this.text);
};
SimpleText.prototype.addToGroup = function (group) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].gx = this.sprites[i].x / 2;
    this.sprites[i].gy = this.sprites[i].y;
    group.addChild(this.sprites[i], false);
  }
};
SimpleText.prototype.putToGroup = function (group) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].gx = this.sprites[i].x;
    this.sprites[i].gy = this.sprites[i].y;
    group.addChild(this.sprites[i], false);
  }
};
SimpleText.prototype.refreshOnTween = function (e) {
  e.target.obj.refresh();
};
SimpleText.prototype.setPosition = function (x, y) {
  this.x = x;
  this.y = y;
  this.refresh();
};
SimpleText.prototype.removeTweens = function () {
  if (!this.stage) return;
  this.stage.clearObjectTweens(this);
};
SimpleText.prototype.addTween = function (
  prop,
  end,
  duration,
  ease,
  onfinish,
  onchange
) {
  if (!this.stage) return;
  var val = this[prop];
  if (isNaN(val)) return;
  var t = this.stage.createTween(this, prop, val, end, duration, ease);
  t.onchange = onchange;
  t.onfinish = onfinish;
  return t;
};
SimpleText.prototype.moveTo = function (
  x,
  y,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  if (duration <= 0) this.setPosition(x, y);
  else {
    var t1 = this.addTween("x", x, duration, ease, onfinish, onchange);
    if (t1) {
      t1.addEventListener("change", this.refreshOnTween);
      t1.addEventListener("finish", this.refreshOnTween);
      t1.play();
    }
    var t2 = this.addTween(
      "y",
      y,
      duration,
      ease,
      t1 ? null : onfinish,
      t1 ? null : onchange
    );
    if (t2) {
      t2.addEventListener("change", this.refreshOnTween);
      t2.addEventListener("finish", this.refreshOnTween);
      t2.play();
    }
  }
  return this;
};
SimpleText.prototype.moveBy = function (
  x,
  y,
  duration,
  ease,
  onfinish,
  onchange
) {
  return this.moveTo(
    this.x + x,
    this.y + y,
    duration,
    ease,
    onfinish,
    onchange
  );
};
SimpleText.prototype.fadeTo = function (
  opacity,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  if (duration <= 0) this.opacity = opacity;
  else {
    var t = this.addTween(
      "opacity",
      opacity,
      duration,
      ease,
      onfinish,
      onchange
    );
    if (t) {
      t.play();
      t.addEventListener("change", this.refreshOnTween);
      t.addEventListener("finish", this.refreshOnTween);
    }
  }
  return this;
};
SimpleText.prototype.fadeBy = function (
  opacity,
  duration,
  ease,
  onfinish,
  onchange
) {
  var val = Math.max(0, Math.min(1, this.opacity + opacity));
  return this.fadeTo(val, duration, ease, onfinish, onchange);
};
SimpleText.prototype.rotateTo = function (
  rotation,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  if (duration <= 0) this.rotation = rotation;
  else {
    var t = this.addTween(
      "rotation",
      rotation,
      duration,
      ease,
      onfinish,
      onchange
    );
    if (t) {
      t.play();
      t.addEventListener("change", this.refreshOnTween);
      t.addEventListener("finish", this.refreshOnTween);
    }
  }
  return this;
};
SimpleText.prototype.rotateBy = function (
  rotation,
  duration,
  ease,
  onfinish,
  onchange
) {
  return this.rotateTo(
    this.rotation + rotation,
    duration,
    ease,
    onfinish,
    onchange
  );
};
SimpleText.prototype.scaleTo = function (
  scale,
  duration,
  ease,
  onfinish,
  onchange
) {
  duration = ~~duration;
  if (duration <= 0) this.scale = scale;
  else {
    var t = this.addTween("scale", scale, duration, ease, onfinish, onchange);
    if (t) {
      t.play();
      t.addEventListener("change", this.refreshOnTween);
      t.addEventListener("finish", this.refreshOnTween);
    }
  }
  return this;
};
SimpleText.spriteClass = "Sprite";
SimpleText.ALIGN_LEFT = 0;
SimpleText.ALIGN_RIGHT = 1;
SimpleText.ALIGN_CENTER = 2;
function Animation(obj, sequence, callback) {
  this.obj = obj;
  this.sequence = sequence;
  this.currentAnimation = -1;
  this.currentTweens = [];
  this.ended = false;
  this.startTimer = null;
  this.endTimer = null;
  this.playNext = Utils.proxy(this.playNext, this);
  this.play = Utils.proxy(this.play, this);
  this.onfinish = callback;
}
Animation.prototype.play = function () {
  this.playNext();
};
Animation.prototype.playNext = function () {
  if (this.currentAnimation >= 0) {
    var oldAnimation = this.sequence[this.currentAnimation];
    if (oldAnimation.onfinish) oldAnimation.onfinish({ target: this });
    if (typeof oldAnimation.loop != "undefined" && oldAnimation.loop >= 0)
      this.currentAnimation = oldAnimation.loop - 1;
  }
  this.currentAnimation++;
  if (this.currentAnimation >= this.sequence.length) {
    this.ended = true;
    if (typeof this.onfinish == "function") this.onfinish({ target: this });
    return;
  }
  var animation = this.sequence[this.currentAnimation];
  var masterDuration, duration, tweens, tween, from, to, t, ease;
  tweens = animation.tweens;
  if (!Utils.isArray(tweens)) tweens = [tweens];
  masterDuration = animation.duration || 0;
  this.currentTweens = [];
  var finishTween = null;
  for (var n = 0; n < tweens.length; n++) {
    tween = tweens[n];
    duration = tween.duration;
    if (typeof duration == "undefined") duration = masterDuration;
    from = tween.from;
    if (typeof from == "undefined") from = this.obj[tween.prop];
    to = tween.to;
    if (typeof to == "undefined") to = this.obj[tween.prop];
    ease = tween.ease || animation.ease || null;
    t = Animation.stage.createTween(
      this.obj,
      tween.prop,
      from,
      to,
      duration,
      ease
    );
    if (typeof tween.onchange != "undefined") t.onchange = tween.onchange;
    if (typeof tween.onfinish != "undefined") t.onfinish = tween.onfinish;
    t.play();
    this.currentTweens.push(t);
    if (duration == masterDuration) finishTween = t;
  }
  if (finishTween) {
    var self = this,
      fn = finishTween.onfinish;
    finishTween.onfinish = function (e) {
      if (typeof fn == "function") fn(e);
      self.playNext();
    };
  } else
    this.endTimer = Animation.stage.setTimeout(this.playNext, masterDuration);
};
Animation.prototype.executeTweensMethod = function (method) {
  for (var i = 0; i < this.currentTweens.length; i++)
    this.currentTweens[i][method]();
};
Animation.prototype.clearTweens = function () {
  for (var i = 0; i < this.currentTweens.length; i++)
    this.currentTweens[i].destroy = true;
  this.currentTweens = [];
};
Animation.prototype.stop = function () {
  if (this.ended) return;
  this.executeTweensMethod("stop");
  if (this.startTimer) Animation.stage.clearTimeout(this.startTimer);
  if (this.endTimer) Animation.stage.clearTimeout(this.endTimer);
};
Animation.prototype.pause = function () {
  if (this.ended) return;
  this.executeTweensMethod("pause");
  if (this.startTimer) this.startTimer.pause();
  if (this.endTimer) this.endTimer.pause();
};
Animation.prototype.resume = function () {
  if (this.ended) return;
  this.executeTweensMethod("play");
  if (this.startTimer) this.startTimer.resume();
  if (this.endTimer) this.endTimer.resume();
};
Animation.stage = null;
Animation.play = function (obj, sequence, callback, delay) {
  if (!obj || !sequence) return;
  if (obj.stage) Animation.stage = obj.stage;
  if (!Animation.stage) Animation.stage = window.stage;
  var anim = new Animation(obj, sequence, callback);
  if (delay) anim.startTimer = Animation.stage.setTimeout(anim.play, delay);
  else anim.play();
  return anim;
};
function PathTween(obj, path, isBezierCurve, loop) {
  this.obj = obj;
  this.path = path;
  this.loop = !!loop;
  if (isBezierCurve) this.path = Utils.getBezierCurve(path);
  this.pathLen = this.getPathLen();
  this.position = 0;
  this.tween = null;
  this.startTimer = null;
}
PathTween.prototype.getPathLen = function () {
  var len = 0;
  for (var i = 1, n = this.path.length; i < n; i++)
    len += Math.sqrt(
      Math.pow(this.path[i].x - this.path[i - 1].x, 2) +
        Math.pow(this.path[i].y - this.path[i - 1].y, 2)
    );
  return len;
};
PathTween.prototype.getCurrentAngle = function () {
  return this.getAngle(this.position);
};
PathTween.prototype.getAngle = function (needLen) {
  var path = this.getSegment(needLen);
  if (!path || path.length < 2) return 0;
  var a = Math.atan2(path[1].y - path[0].y, path[1].x - path[0].x);
  return a;
};
PathTween.prototype.getCurrentSegment = function () {
  return this.getSegment(this.position);
};
PathTween.prototype.getSegment = function (needLen) {
  if (this.path.length <= 2) return this.path;
  var w,
    h,
    len = 0,
    pathLen = 0,
    ok = true,
    i = 0,
    cx = this.path[0].x,
    cy = this.path[0].y;
  var res = [];
  while (ok) {
    i++;
    if (i >= this.path.length)
      return [this.path[this.path.length - 2], this.path[this.path.length - 1]];
    else {
      w = cx - this.path[i].x;
      h = cy - this.path[i].y;
      len = Math.sqrt(w * w + h * h);
      if (pathLen + len >= needLen) return [this.path[i - 1], this.path[i]];
      else {
        pathLen += len;
        cx = this.path[i].x;
        cy = this.path[i].y;
      }
    }
  }
};
PathTween.prototype.getCurrentPoint = function () {
  return this.getPoint(this.position);
};
PathTween.prototype.getPoint = function (needLen) {
  var w,
    h,
    len = 0,
    pathLen = 0,
    ok = true,
    i = 0,
    cx = this.path[0].x,
    cy = this.path[0].y;
  while (ok) {
    i++;
    if (i >= this.path.length)
      return {
        x: this.path[this.path.length - 1].x,
        y: this.path[this.path.length - 1].y,
      };
    else {
      w = cx - this.path[i].x;
      h = cy - this.path[i].y;
      len = Math.sqrt(w * w + h * h);
      if (pathLen + len >= needLen) {
        var angle = Math.atan2(this.path[i].y - cy, this.path[i].x - cx);
        len = needLen - pathLen;
        cx += Math.cos(angle) * len;
        cy += Math.sin(angle) * len;
        return { x: cx, y: cy };
      } else {
        pathLen += len;
        cx = this.path[i].x;
        cy = this.path[i].y;
      }
    }
  }
};
PathTween.prototype.start = function (
  duration,
  ease,
  onfinish,
  onchange,
  delay
) {
  var self = this;
  function doStart() {
    self.position = 0;
    if (self.tween) {
      self.tween.stop();
      self.tween.destroy = true;
    }
    self.tween = self.obj.stage.createTween(
      self,
      "position",
      0,
      self.pathLen,
      duration,
      ease
    );
    self.tween.addEventListener("finish", self.updateOnFinish);
    self.tween.addEventListener("change", self.updateOnTween);
    if (onfinish) self.tween.addEventListener("finish", onfinish);
    if (onchange) self.tween.addEventListener("change", onchange);
    self.tween.play();
    self.startTimer = null;
  }
  if (delay) this.startTimer = this.obj.stage.setTimeout(doStart, delay);
  else doStart();
};
PathTween.prototype.pause = function () {
  if (this.tween) this.tween.pause();
  if (this.startTimer) this.startTimer.pause();
};
PathTween.prototype.play = function () {
  if (this.tween) this.tween.play();
  if (this.startTimer) this.startTimer.pause();
};
PathTween.prototype.rewind = function () {
  if (this.tween) this.tween.rewind();
  if (this.startTimer) this.startTimer.rewind();
};
PathTween.prototype.forward = function () {
  if (this.tween) this.tween.forward();
  if (this.startTimer) {
    this.startTimer.pause();
    this.startTimer.destroy = true;
  }
};
PathTween.prototype.stop = function () {
  if (this.tween) this.tween.stop();
  if (this.startTimer) {
    this.startTimer.pause();
    this.startTimer.destroy = true;
  }
};
PathTween.prototype.updateOnFinish = function (e) {
  var self = e.target.obj;
  var point = self.path[self.path.length - 1];
  self.obj.x = point.x;
  self.obj.y = point.y;
  if (self.loop) {
    self.rewind();
    self.play();
    return false;
  }
};
PathTween.prototype.updateOnTween = function (e) {
  var self = e.target.obj;
  var point = self.getCurrentPoint();
  self.obj.x = point.x;
  self.obj.y = point.y;
};
function TilesSprite(img, width, height, frames, rows, columns) {
  TilesSprite.superclass.constructor.call(
    this,
    img,
    width,
    height,
    rows,
    columns
  );
  this.framesCount = frames;
  this.animated = frames > 1;
  this.addEventListener("changeframe", TilesSprite.changeStep);
  this.addEventListener("prerender", TilesSprite.sync);
}
Utils.extend(TilesSprite, Sprite);
TilesSprite.prototype.currentFrameX = 0;
TilesSprite.create = function (asset, library) {
  if (typeof asset == "string") {
    library = library || window["library"];
    if (!library)
      throw new Error(
        "Could not create sprite from asset '%s'. Library not found.",
        asset
      );
    asset = library.getAsset(asset);
  }
  return new TilesSprite(
    asset.bitmap,
    asset.width || 1,
    asset.height || 1,
    asset.framesCount || (asset.frames || 1) * (asset.layers || 1),
    asset.frames || 1,
    asset.layers || 1
  );
};
TilesSprite.prototype.gotoAndStop = function (frame) {
  this.currentFrameX = frame;
  this.stop();
};
TilesSprite.prototype.gotoAndPlay = function (frame) {
  this.currentFrameX = frame;
  this.play();
};
TilesSprite.changeStep = function (e) {
  var self = e.target;
  if (self.animated) {
    self.currentFrameX += self.animDirection;
    if (self.animDirection > 0 && self.currentFrameX >= self.framesCount)
      self.currentFrameX = 0;
    if (self.animDirection < 0 && self.currentFrameX < 0)
      self.currentFrameX = self.framesCount - 1;
  }
};
TilesSprite.sync = function (e) {
  var self = e.target;
  self.currentLayer = Math.floor(self.currentFrameX / self.totalFrames);
  self.currentFrame = self.currentFrameX - self.currentLayer * self.totalFrames;
};
function JointsDrawer(world) {
  Utils.callSuperConstructor(JointsDrawer, this, null, 1, 1);
  this.world = world;
  this.ignoreList = [];
  this.revoluteColor = "#ff0000";
  this.distanceColor = "#264f05";
  this.prismaticColor = "#FF00FF";
  this.minJointLength = 20;
  this.addEventListener("render", Utils.proxy(this.draw, this));
}
Utils.extend(JointsDrawer, Sprite);
JointsDrawer.prototype.draw = function () {
  var ok = true;
  var world = this.world;
  var stage = this.stage;
  for (var j = world.GetJointList(); j; j = j.m_next) {
    var b1 = j.m_bodyA;
    var b2 = j.m_bodyB;
    var p1 = j.GetAnchorA();
    var p2 = j.GetAnchorB();
    if (this.ignoreList && this.ignoreList.indexOf(j) >= 0) continue;
    if (j.sprite) {
      j.sprite.x = p1.x;
      j.sprite.y = p1.y;
      continue;
    }
    if (j.m_type == Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint)
      stage.drawCircle(
        p1.x * box2d.SCALE,
        p1.y * box2d.SCALE,
        1,
        1,
        this.revoluteColor
      );
    if (j.m_type == Box2D.Dynamics.Joints.b2Joint.e_distanceJoint) {
      var lx = p1.x - p2.x;
      var ly = p1.y - p2.y;
      var len = Math.sqrt(lx * lx + ly * ly);
      if (len >= this.minJointLength / box2d.SCALE)
        stage.drawLine(
          p1.x * box2d.SCALE,
          p1.y * box2d.SCALE,
          p2.x * box2d.SCALE,
          p2.y * box2d.SCALE,
          1,
          this.distanceColor
        );
    }
  }
};
var Box2D = {};
(function (a2j, undefined) {
  if (
    !(Object.prototype.defineProperty instanceof Function) &&
    Object.prototype.__defineGetter__ instanceof Function &&
    Object.prototype.__defineSetter__ instanceof Function
  )
    Object.defineProperty = function (obj, p, cfg) {
      if (cfg.get instanceof Function) obj.__defineGetter__(p, cfg.get);
      if (cfg.set instanceof Function) obj.__defineSetter__(p, cfg.set);
    };
  function emptyFn() {}
  a2j.inherit = function (cls, base) {
    var tmpCtr = cls;
    emptyFn.prototype = base.prototype;
    cls.prototype = new emptyFn();
    cls.prototype.constructor = tmpCtr;
  };
  a2j.generateCallback = function generateCallback(context, cb) {
    return function () {
      cb.apply(context, arguments);
    };
  };
  a2j.NVector = function NVector(length) {
    if (length === undefined) length = 0;
    var tmp = new Array(length || 0);
    for (var i = 0; i < length; ++i) tmp[i] = 0;
    return tmp;
  };
  a2j.is = function is(o1, o2) {
    if (o1 === null) return false;
    if (o2 instanceof Function && o1 instanceof o2) return true;
    if (
      o1.constructor.__implements != undefined &&
      o1.constructor.__implements[o2]
    )
      return true;
    return false;
  };
  a2j.parseUInt = function (v) {
    return Math.abs(parseInt(v));
  };
})(Box2D);
var Vector2 = Array;
var Vector_a2j_Number = Box2D.NVector;
if (typeof Box2D === "undefined") Box2D = {};
if (typeof Box2D.Collision === "undefined") Box2D.Collision = {};
if (typeof Box2D.Collision.Shapes === "undefined") Box2D.Collision.Shapes = {};
if (typeof Box2D.Common === "undefined") Box2D.Common = {};
if (typeof Box2D.Common.Math === "undefined") Box2D.Common.Math = {};
if (typeof Box2D.Dynamics === "undefined") Box2D.Dynamics = {};
if (typeof Box2D.Dynamics.Contacts === "undefined")
  Box2D.Dynamics.Contacts = {};
if (typeof Box2D.Dynamics.Controllers === "undefined")
  Box2D.Dynamics.Controllers = {};
if (typeof Box2D.Dynamics.Joints === "undefined") Box2D.Dynamics.Joints = {};
(function () {
  Box2D.Collision.IBroadPhase = "Box2D.Collision.IBroadPhase";
  function b2AABB() {
    b2AABB.b2AABB.apply(this, arguments);
  }
  Box2D.Collision.b2AABB = b2AABB;
  function b2Bound() {
    b2Bound.b2Bound.apply(this, arguments);
  }
  Box2D.Collision.b2Bound = b2Bound;
  function b2BoundValues() {
    b2BoundValues.b2BoundValues.apply(this, arguments);
    if (this.constructor === b2BoundValues)
      this.b2BoundValues.apply(this, arguments);
  }
  Box2D.Collision.b2BoundValues = b2BoundValues;
  function b2Collision() {
    b2Collision.b2Collision.apply(this, arguments);
  }
  Box2D.Collision.b2Collision = b2Collision;
  function b2ContactID() {
    b2ContactID.b2ContactID.apply(this, arguments);
    if (this.constructor === b2ContactID)
      this.b2ContactID.apply(this, arguments);
  }
  Box2D.Collision.b2ContactID = b2ContactID;
  function b2ContactPoint() {
    b2ContactPoint.b2ContactPoint.apply(this, arguments);
  }
  Box2D.Collision.b2ContactPoint = b2ContactPoint;
  function b2Distance() {
    b2Distance.b2Distance.apply(this, arguments);
  }
  Box2D.Collision.b2Distance = b2Distance;
  function b2DistanceInput() {
    b2DistanceInput.b2DistanceInput.apply(this, arguments);
  }
  Box2D.Collision.b2DistanceInput = b2DistanceInput;
  function b2DistanceOutput() {
    b2DistanceOutput.b2DistanceOutput.apply(this, arguments);
  }
  Box2D.Collision.b2DistanceOutput = b2DistanceOutput;
  function b2DistanceProxy() {
    b2DistanceProxy.b2DistanceProxy.apply(this, arguments);
  }
  Box2D.Collision.b2DistanceProxy = b2DistanceProxy;
  function b2DynamicTree() {
    b2DynamicTree.b2DynamicTree.apply(this, arguments);
    if (this.constructor === b2DynamicTree)
      this.b2DynamicTree.apply(this, arguments);
  }
  Box2D.Collision.b2DynamicTree = b2DynamicTree;
  function b2DynamicTreeBroadPhase() {
    b2DynamicTreeBroadPhase.b2DynamicTreeBroadPhase.apply(this, arguments);
  }
  Box2D.Collision.b2DynamicTreeBroadPhase = b2DynamicTreeBroadPhase;
  function b2DynamicTreeNode() {
    b2DynamicTreeNode.b2DynamicTreeNode.apply(this, arguments);
  }
  Box2D.Collision.b2DynamicTreeNode = b2DynamicTreeNode;
  function b2DynamicTreePair() {
    b2DynamicTreePair.b2DynamicTreePair.apply(this, arguments);
  }
  Box2D.Collision.b2DynamicTreePair = b2DynamicTreePair;
  function b2Manifold() {
    b2Manifold.b2Manifold.apply(this, arguments);
    if (this.constructor === b2Manifold) this.b2Manifold.apply(this, arguments);
  }
  Box2D.Collision.b2Manifold = b2Manifold;
  function b2ManifoldPoint() {
    b2ManifoldPoint.b2ManifoldPoint.apply(this, arguments);
    if (this.constructor === b2ManifoldPoint)
      this.b2ManifoldPoint.apply(this, arguments);
  }
  Box2D.Collision.b2ManifoldPoint = b2ManifoldPoint;
  function b2Point() {
    b2Point.b2Point.apply(this, arguments);
  }
  Box2D.Collision.b2Point = b2Point;
  function b2RayCastInput() {
    b2RayCastInput.b2RayCastInput.apply(this, arguments);
    if (this.constructor === b2RayCastInput)
      this.b2RayCastInput.apply(this, arguments);
  }
  Box2D.Collision.b2RayCastInput = b2RayCastInput;
  function b2RayCastOutput() {
    b2RayCastOutput.b2RayCastOutput.apply(this, arguments);
  }
  Box2D.Collision.b2RayCastOutput = b2RayCastOutput;
  function b2Segment() {
    b2Segment.b2Segment.apply(this, arguments);
  }
  Box2D.Collision.b2Segment = b2Segment;
  function b2SeparationFunction() {
    b2SeparationFunction.b2SeparationFunction.apply(this, arguments);
  }
  Box2D.Collision.b2SeparationFunction = b2SeparationFunction;
  function b2Simplex() {
    b2Simplex.b2Simplex.apply(this, arguments);
    if (this.constructor === b2Simplex) this.b2Simplex.apply(this, arguments);
  }
  Box2D.Collision.b2Simplex = b2Simplex;
  function b2SimplexCache() {
    b2SimplexCache.b2SimplexCache.apply(this, arguments);
  }
  Box2D.Collision.b2SimplexCache = b2SimplexCache;
  function b2SimplexVertex() {
    b2SimplexVertex.b2SimplexVertex.apply(this, arguments);
  }
  Box2D.Collision.b2SimplexVertex = b2SimplexVertex;
  function b2TimeOfImpact() {
    b2TimeOfImpact.b2TimeOfImpact.apply(this, arguments);
  }
  Box2D.Collision.b2TimeOfImpact = b2TimeOfImpact;
  function b2TOIInput() {
    b2TOIInput.b2TOIInput.apply(this, arguments);
  }
  Box2D.Collision.b2TOIInput = b2TOIInput;
  function b2WorldManifold() {
    b2WorldManifold.b2WorldManifold.apply(this, arguments);
    if (this.constructor === b2WorldManifold)
      this.b2WorldManifold.apply(this, arguments);
  }
  Box2D.Collision.b2WorldManifold = b2WorldManifold;
  function ClipVertex() {
    ClipVertex.ClipVertex.apply(this, arguments);
  }
  Box2D.Collision.ClipVertex = ClipVertex;
  function Features() {
    Features.Features.apply(this, arguments);
  }
  Box2D.Collision.Features = Features;
  function b2CircleShape() {
    b2CircleShape.b2CircleShape.apply(this, arguments);
    if (this.constructor === b2CircleShape)
      this.b2CircleShape.apply(this, arguments);
  }
  Box2D.Collision.Shapes.b2CircleShape = b2CircleShape;
  function b2EdgeChainDef() {
    b2EdgeChainDef.b2EdgeChainDef.apply(this, arguments);
    if (this.constructor === b2EdgeChainDef)
      this.b2EdgeChainDef.apply(this, arguments);
  }
  Box2D.Collision.Shapes.b2EdgeChainDef = b2EdgeChainDef;
  function b2EdgeShape() {
    b2EdgeShape.b2EdgeShape.apply(this, arguments);
    if (this.constructor === b2EdgeShape)
      this.b2EdgeShape.apply(this, arguments);
  }
  Box2D.Collision.Shapes.b2EdgeShape = b2EdgeShape;
  function b2MassData() {
    b2MassData.b2MassData.apply(this, arguments);
  }
  Box2D.Collision.Shapes.b2MassData = b2MassData;
  function b2PolygonShape() {
    b2PolygonShape.b2PolygonShape.apply(this, arguments);
    if (this.constructor === b2PolygonShape)
      this.b2PolygonShape.apply(this, arguments);
  }
  Box2D.Collision.Shapes.b2PolygonShape = b2PolygonShape;
  function b2Shape() {
    b2Shape.b2Shape.apply(this, arguments);
    if (this.constructor === b2Shape) this.b2Shape.apply(this, arguments);
  }
  Box2D.Collision.Shapes.b2Shape = b2Shape;
  Box2D.Common.b2internal = "Box2D.Common.b2internal";
  function b2Color() {
    b2Color.b2Color.apply(this, arguments);
    if (this.constructor === b2Color) this.b2Color.apply(this, arguments);
  }
  Box2D.Common.b2Color = b2Color;
  function b2Settings() {
    b2Settings.b2Settings.apply(this, arguments);
  }
  Box2D.Common.b2Settings = b2Settings;
  function b2Mat22() {
    b2Mat22.b2Mat22.apply(this, arguments);
    if (this.constructor === b2Mat22) this.b2Mat22.apply(this, arguments);
  }
  Box2D.Common.Math.b2Mat22 = b2Mat22;
  function b2Mat33() {
    b2Mat33.b2Mat33.apply(this, arguments);
    if (this.constructor === b2Mat33) this.b2Mat33.apply(this, arguments);
  }
  Box2D.Common.Math.b2Mat33 = b2Mat33;
  function b2Math() {
    b2Math.b2Math.apply(this, arguments);
  }
  Box2D.Common.Math.b2Math = b2Math;
  function b2Sweep() {
    b2Sweep.b2Sweep.apply(this, arguments);
  }
  Box2D.Common.Math.b2Sweep = b2Sweep;
  function b2Transform() {
    b2Transform.b2Transform.apply(this, arguments);
    if (this.constructor === b2Transform)
      this.b2Transform.apply(this, arguments);
  }
  Box2D.Common.Math.b2Transform = b2Transform;
  function b2Vec2() {
    b2Vec2.b2Vec2.apply(this, arguments);
    if (this.constructor === b2Vec2) this.b2Vec2.apply(this, arguments);
  }
  Box2D.Common.Math.b2Vec2 = b2Vec2;
  function b2Vec3() {
    b2Vec3.b2Vec3.apply(this, arguments);
    if (this.constructor === b2Vec3) this.b2Vec3.apply(this, arguments);
  }
  Box2D.Common.Math.b2Vec3 = b2Vec3;
  function b2Body() {
    b2Body.b2Body.apply(this, arguments);
    if (this.constructor === b2Body) this.b2Body.apply(this, arguments);
  }
  Box2D.Dynamics.b2Body = b2Body;
  function b2BodyDef() {
    b2BodyDef.b2BodyDef.apply(this, arguments);
    if (this.constructor === b2BodyDef) this.b2BodyDef.apply(this, arguments);
  }
  Box2D.Dynamics.b2BodyDef = b2BodyDef;
  function b2ContactFilter() {
    b2ContactFilter.b2ContactFilter.apply(this, arguments);
  }
  Box2D.Dynamics.b2ContactFilter = b2ContactFilter;
  function b2ContactImpulse() {
    b2ContactImpulse.b2ContactImpulse.apply(this, arguments);
  }
  Box2D.Dynamics.b2ContactImpulse = b2ContactImpulse;
  function b2ContactListener() {
    b2ContactListener.b2ContactListener.apply(this, arguments);
  }
  Box2D.Dynamics.b2ContactListener = b2ContactListener;
  function b2ContactManager() {
    b2ContactManager.b2ContactManager.apply(this, arguments);
    if (this.constructor === b2ContactManager)
      this.b2ContactManager.apply(this, arguments);
  }
  Box2D.Dynamics.b2ContactManager = b2ContactManager;
  function b2DebugDraw() {
    b2DebugDraw.b2DebugDraw.apply(this, arguments);
    if (this.constructor === b2DebugDraw)
      this.b2DebugDraw.apply(this, arguments);
  }
  Box2D.Dynamics.b2DebugDraw = b2DebugDraw;
  function b2DestructionListener() {
    b2DestructionListener.b2DestructionListener.apply(this, arguments);
  }
  Box2D.Dynamics.b2DestructionListener = b2DestructionListener;
  function b2FilterData() {
    b2FilterData.b2FilterData.apply(this, arguments);
  }
  Box2D.Dynamics.b2FilterData = b2FilterData;
  function b2Fixture() {
    b2Fixture.b2Fixture.apply(this, arguments);
    if (this.constructor === b2Fixture) this.b2Fixture.apply(this, arguments);
  }
  Box2D.Dynamics.b2Fixture = b2Fixture;
  function b2FixtureDef() {
    b2FixtureDef.b2FixtureDef.apply(this, arguments);
    if (this.constructor === b2FixtureDef)
      this.b2FixtureDef.apply(this, arguments);
  }
  Box2D.Dynamics.b2FixtureDef = b2FixtureDef;
  function b2Island() {
    b2Island.b2Island.apply(this, arguments);
    if (this.constructor === b2Island) this.b2Island.apply(this, arguments);
  }
  Box2D.Dynamics.b2Island = b2Island;
  function b2TimeStep() {
    b2TimeStep.b2TimeStep.apply(this, arguments);
  }
  Box2D.Dynamics.b2TimeStep = b2TimeStep;
  function b2World() {
    b2World.b2World.apply(this, arguments);
    if (this.constructor === b2World) this.b2World.apply(this, arguments);
  }
  Box2D.Dynamics.b2World = b2World;
  function b2CircleContact() {
    b2CircleContact.b2CircleContact.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2CircleContact = b2CircleContact;
  function b2Contact() {
    b2Contact.b2Contact.apply(this, arguments);
    if (this.constructor === b2Contact) this.b2Contact.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2Contact = b2Contact;
  function b2ContactConstraint() {
    b2ContactConstraint.b2ContactConstraint.apply(this, arguments);
    if (this.constructor === b2ContactConstraint)
      this.b2ContactConstraint.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2ContactConstraint = b2ContactConstraint;
  function b2ContactConstraintPoint() {
    b2ContactConstraintPoint.b2ContactConstraintPoint.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2ContactConstraintPoint = b2ContactConstraintPoint;
  function b2ContactEdge() {
    b2ContactEdge.b2ContactEdge.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2ContactEdge = b2ContactEdge;
  function b2ContactFactory() {
    b2ContactFactory.b2ContactFactory.apply(this, arguments);
    if (this.constructor === b2ContactFactory)
      this.b2ContactFactory.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2ContactFactory = b2ContactFactory;
  function b2ContactRegister() {
    b2ContactRegister.b2ContactRegister.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2ContactRegister = b2ContactRegister;
  function b2ContactResult() {
    b2ContactResult.b2ContactResult.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2ContactResult = b2ContactResult;
  function b2ContactSolver() {
    b2ContactSolver.b2ContactSolver.apply(this, arguments);
    if (this.constructor === b2ContactSolver)
      this.b2ContactSolver.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2ContactSolver = b2ContactSolver;
  function b2EdgeAndCircleContact() {
    b2EdgeAndCircleContact.b2EdgeAndCircleContact.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = b2EdgeAndCircleContact;
  function b2NullContact() {
    b2NullContact.b2NullContact.apply(this, arguments);
    if (this.constructor === b2NullContact)
      this.b2NullContact.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2NullContact = b2NullContact;
  function b2PolyAndCircleContact() {
    b2PolyAndCircleContact.b2PolyAndCircleContact.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2PolyAndCircleContact = b2PolyAndCircleContact;
  function b2PolyAndEdgeContact() {
    b2PolyAndEdgeContact.b2PolyAndEdgeContact.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = b2PolyAndEdgeContact;
  function b2PolygonContact() {
    b2PolygonContact.b2PolygonContact.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2PolygonContact = b2PolygonContact;
  function b2PositionSolverManifold() {
    b2PositionSolverManifold.b2PositionSolverManifold.apply(this, arguments);
    if (this.constructor === b2PositionSolverManifold)
      this.b2PositionSolverManifold.apply(this, arguments);
  }
  Box2D.Dynamics.Contacts.b2PositionSolverManifold = b2PositionSolverManifold;
  function b2BuoyancyController() {
    b2BuoyancyController.b2BuoyancyController.apply(this, arguments);
  }
  Box2D.Dynamics.Controllers.b2BuoyancyController = b2BuoyancyController;
  function b2ConstantAccelController() {
    b2ConstantAccelController.b2ConstantAccelController.apply(this, arguments);
  }
  Box2D.Dynamics.Controllers.b2ConstantAccelController =
    b2ConstantAccelController;
  function b2ConstantForceController() {
    b2ConstantForceController.b2ConstantForceController.apply(this, arguments);
  }
  Box2D.Dynamics.Controllers.b2ConstantForceController =
    b2ConstantForceController;
  function b2Controller() {
    b2Controller.b2Controller.apply(this, arguments);
  }
  Box2D.Dynamics.Controllers.b2Controller = b2Controller;
  function b2ControllerEdge() {
    b2ControllerEdge.b2ControllerEdge.apply(this, arguments);
  }
  Box2D.Dynamics.Controllers.b2ControllerEdge = b2ControllerEdge;
  function b2GravityController() {
    b2GravityController.b2GravityController.apply(this, arguments);
  }
  Box2D.Dynamics.Controllers.b2GravityController = b2GravityController;
  function b2TensorDampingController() {
    b2TensorDampingController.b2TensorDampingController.apply(this, arguments);
  }
  Box2D.Dynamics.Controllers.b2TensorDampingController =
    b2TensorDampingController;
  function b2DistanceJoint() {
    b2DistanceJoint.b2DistanceJoint.apply(this, arguments);
    if (this.constructor === b2DistanceJoint)
      this.b2DistanceJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2DistanceJoint = b2DistanceJoint;
  function b2DistanceJointDef() {
    b2DistanceJointDef.b2DistanceJointDef.apply(this, arguments);
    if (this.constructor === b2DistanceJointDef)
      this.b2DistanceJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2DistanceJointDef = b2DistanceJointDef;
  function b2FrictionJoint() {
    b2FrictionJoint.b2FrictionJoint.apply(this, arguments);
    if (this.constructor === b2FrictionJoint)
      this.b2FrictionJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2FrictionJoint = b2FrictionJoint;
  function b2FrictionJointDef() {
    b2FrictionJointDef.b2FrictionJointDef.apply(this, arguments);
    if (this.constructor === b2FrictionJointDef)
      this.b2FrictionJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2FrictionJointDef = b2FrictionJointDef;
  function b2GearJoint() {
    b2GearJoint.b2GearJoint.apply(this, arguments);
    if (this.constructor === b2GearJoint)
      this.b2GearJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2GearJoint = b2GearJoint;
  function b2GearJointDef() {
    b2GearJointDef.b2GearJointDef.apply(this, arguments);
    if (this.constructor === b2GearJointDef)
      this.b2GearJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2GearJointDef = b2GearJointDef;
  function b2Jacobian() {
    b2Jacobian.b2Jacobian.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2Jacobian = b2Jacobian;
  function b2Joint() {
    b2Joint.b2Joint.apply(this, arguments);
    if (this.constructor === b2Joint) this.b2Joint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2Joint = b2Joint;
  function b2JointDef() {
    b2JointDef.b2JointDef.apply(this, arguments);
    if (this.constructor === b2JointDef) this.b2JointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2JointDef = b2JointDef;
  function b2JointEdge() {
    b2JointEdge.b2JointEdge.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2JointEdge = b2JointEdge;
  function b2LineJoint() {
    b2LineJoint.b2LineJoint.apply(this, arguments);
    if (this.constructor === b2LineJoint)
      this.b2LineJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2LineJoint = b2LineJoint;
  function b2LineJointDef() {
    b2LineJointDef.b2LineJointDef.apply(this, arguments);
    if (this.constructor === b2LineJointDef)
      this.b2LineJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2LineJointDef = b2LineJointDef;
  function b2MouseJoint() {
    b2MouseJoint.b2MouseJoint.apply(this, arguments);
    if (this.constructor === b2MouseJoint)
      this.b2MouseJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2MouseJoint = b2MouseJoint;
  function b2MouseJointDef() {
    b2MouseJointDef.b2MouseJointDef.apply(this, arguments);
    if (this.constructor === b2MouseJointDef)
      this.b2MouseJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2MouseJointDef = b2MouseJointDef;
  function b2PrismaticJoint() {
    b2PrismaticJoint.b2PrismaticJoint.apply(this, arguments);
    if (this.constructor === b2PrismaticJoint)
      this.b2PrismaticJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2PrismaticJoint = b2PrismaticJoint;
  function b2PrismaticJointDef() {
    b2PrismaticJointDef.b2PrismaticJointDef.apply(this, arguments);
    if (this.constructor === b2PrismaticJointDef)
      this.b2PrismaticJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2PrismaticJointDef = b2PrismaticJointDef;
  function b2PulleyJoint() {
    b2PulleyJoint.b2PulleyJoint.apply(this, arguments);
    if (this.constructor === b2PulleyJoint)
      this.b2PulleyJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2PulleyJoint = b2PulleyJoint;
  function b2PulleyJointDef() {
    b2PulleyJointDef.b2PulleyJointDef.apply(this, arguments);
    if (this.constructor === b2PulleyJointDef)
      this.b2PulleyJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2PulleyJointDef = b2PulleyJointDef;
  function b2RevoluteJoint() {
    b2RevoluteJoint.b2RevoluteJoint.apply(this, arguments);
    if (this.constructor === b2RevoluteJoint)
      this.b2RevoluteJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2RevoluteJoint = b2RevoluteJoint;
  function b2RevoluteJointDef() {
    b2RevoluteJointDef.b2RevoluteJointDef.apply(this, arguments);
    if (this.constructor === b2RevoluteJointDef)
      this.b2RevoluteJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2RevoluteJointDef = b2RevoluteJointDef;
  function b2WeldJoint() {
    b2WeldJoint.b2WeldJoint.apply(this, arguments);
    if (this.constructor === b2WeldJoint)
      this.b2WeldJoint.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2WeldJoint = b2WeldJoint;
  function b2WeldJointDef() {
    b2WeldJointDef.b2WeldJointDef.apply(this, arguments);
    if (this.constructor === b2WeldJointDef)
      this.b2WeldJointDef.apply(this, arguments);
  }
  Box2D.Dynamics.Joints.b2WeldJointDef = b2WeldJointDef;
})();
Box2D.postDefs = [];
(function () {
  var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2Shape = Box2D.Collision.Shapes.b2Shape,
    b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3,
    b2AABB = Box2D.Collision.b2AABB,
    b2Bound = Box2D.Collision.b2Bound,
    b2BoundValues = Box2D.Collision.b2BoundValues,
    b2Collision = Box2D.Collision.b2Collision,
    b2ContactID = Box2D.Collision.b2ContactID,
    b2ContactPoint = Box2D.Collision.b2ContactPoint,
    b2Distance = Box2D.Collision.b2Distance,
    b2DistanceInput = Box2D.Collision.b2DistanceInput,
    b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
    b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
    b2DynamicTree = Box2D.Collision.b2DynamicTree,
    b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
    b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
    b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
    b2Manifold = Box2D.Collision.b2Manifold,
    b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
    b2Point = Box2D.Collision.b2Point,
    b2RayCastInput = Box2D.Collision.b2RayCastInput,
    b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
    b2Segment = Box2D.Collision.b2Segment,
    b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
    b2Simplex = Box2D.Collision.b2Simplex,
    b2SimplexCache = Box2D.Collision.b2SimplexCache,
    b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
    b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
    b2TOIInput = Box2D.Collision.b2TOIInput,
    b2WorldManifold = Box2D.Collision.b2WorldManifold,
    ClipVertex = Box2D.Collision.ClipVertex,
    Features = Box2D.Collision.Features,
    IBroadPhase = Box2D.Collision.IBroadPhase;
  b2AABB.b2AABB = function () {
    this.lowerBound = new b2Vec2();
    this.upperBound = new b2Vec2();
  };
  b2AABB.prototype.IsValid = function () {
    var dX = this.upperBound.x - this.lowerBound.x;
    var dY = this.upperBound.y - this.lowerBound.y;
    var valid = dX >= 0 && dY >= 0;
    valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
    return valid;
  };
  b2AABB.prototype.GetCenter = function () {
    return new b2Vec2(
      (this.lowerBound.x + this.upperBound.x) / 2,
      (this.lowerBound.y + this.upperBound.y) / 2
    );
  };
  b2AABB.prototype.GetExtents = function () {
    return new b2Vec2(
      (this.upperBound.x - this.lowerBound.x) / 2,
      (this.upperBound.y - this.lowerBound.y) / 2
    );
  };
  b2AABB.prototype.Contains = function (aabb) {
    var result = true;
    result = result && this.lowerBound.x <= aabb.lowerBound.x;
    result = result && this.lowerBound.y <= aabb.lowerBound.y;
    result = result && aabb.upperBound.x <= this.upperBound.x;
    result = result && aabb.upperBound.y <= this.upperBound.y;
    return result;
  };
  b2AABB.prototype.RayCast = function (output, input) {
    var tmin = -Number.MAX_VALUE;
    var tmax = Number.MAX_VALUE;
    var pX = input.p1.x;
    var pY = input.p1.y;
    var dX = input.p2.x - input.p1.x;
    var dY = input.p2.y - input.p1.y;
    var absDX = Math.abs(dX);
    var absDY = Math.abs(dY);
    var normal = output.normal;
    var inv_d = 0;
    var t1 = 0;
    var t2 = 0;
    var t3 = 0;
    var s = 0;
    if (absDX < Number.MIN_VALUE) {
      if (pX < this.lowerBound.x || this.upperBound.x < pX) return false;
    } else {
      inv_d = 1 / dX;
      t1 = (this.lowerBound.x - pX) * inv_d;
      t2 = (this.upperBound.x - pX) * inv_d;
      s = -1;
      if (t1 > t2) {
        t3 = t1;
        t1 = t2;
        t2 = t3;
        s = 1;
      }
      if (t1 > tmin) {
        normal.x = s;
        normal.y = 0;
        tmin = t1;
      }
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return false;
    }
    if (absDY < Number.MIN_VALUE) {
      if (pY < this.lowerBound.y || this.upperBound.y < pY) return false;
    } else {
      inv_d = 1 / dY;
      t1 = (this.lowerBound.y - pY) * inv_d;
      t2 = (this.upperBound.y - pY) * inv_d;
      s = -1;
      if (t1 > t2) {
        t3 = t1;
        t1 = t2;
        t2 = t3;
        s = 1;
      }
      if (t1 > tmin) {
        normal.y = s;
        normal.x = 0;
        tmin = t1;
      }
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return false;
    }
    output.fraction = tmin;
    return true;
  };
  b2AABB.prototype.TestOverlap = function (other) {
    var d1X = other.lowerBound.x - this.upperBound.x;
    var d1Y = other.lowerBound.y - this.upperBound.y;
    var d2X = this.lowerBound.x - other.upperBound.x;
    var d2Y = this.lowerBound.y - other.upperBound.y;
    if (d1X > 0 || d1Y > 0) return false;
    if (d2X > 0 || d2Y > 0) return false;
    return true;
  };
  b2AABB.Combine = function (aabb1, aabb2) {
    var aabb = new b2AABB();
    aabb.Combine(aabb1, aabb2);
    return aabb;
  };
  b2AABB.prototype.Combine = function (aabb1, aabb2) {
    this.lowerBound.x = Math.min(aabb1.lowerBound.x, aabb2.lowerBound.x);
    this.lowerBound.y = Math.min(aabb1.lowerBound.y, aabb2.lowerBound.y);
    this.upperBound.x = Math.max(aabb1.upperBound.x, aabb2.upperBound.x);
    this.upperBound.y = Math.max(aabb1.upperBound.y, aabb2.upperBound.y);
  };
  b2Bound.b2Bound = function () {};
  b2Bound.prototype.IsLower = function () {
    return (this.value & 1) == 0;
  };
  b2Bound.prototype.IsUpper = function () {
    return (this.value & 1) == 1;
  };
  b2Bound.prototype.Swap = function (b) {
    var tempValue = this.value;
    var tempProxy = this.proxy;
    var tempStabbingCount = this.stabbingCount;
    this.value = b.value;
    this.proxy = b.proxy;
    this.stabbingCount = b.stabbingCount;
    b.value = tempValue;
    b.proxy = tempProxy;
    b.stabbingCount = tempStabbingCount;
  };
  b2BoundValues.b2BoundValues = function () {};
  b2BoundValues.prototype.b2BoundValues = function () {
    this.lowerValues = new Vector_a2j_Number();
    this.lowerValues[0] = 0;
    this.lowerValues[1] = 0;
    this.upperValues = new Vector_a2j_Number();
    this.upperValues[0] = 0;
    this.upperValues[1] = 0;
  };
  b2Collision.b2Collision = function () {};
  b2Collision.ClipSegmentToLine = function (vOut, vIn, normal, offset) {
    if (offset === undefined) offset = 0;
    var cv;
    var numOut = 0;
    cv = vIn[0];
    var vIn0 = cv.v;
    cv = vIn[1];
    var vIn1 = cv.v;
    var distance0 = normal.x * vIn0.x + normal.y * vIn0.y - offset;
    var distance1 = normal.x * vIn1.x + normal.y * vIn1.y - offset;
    if (distance0 <= 0) vOut[numOut++].Set(vIn[0]);
    if (distance1 <= 0) vOut[numOut++].Set(vIn[1]);
    if (distance0 * distance1 < 0) {
      var interp = distance0 / (distance0 - distance1);
      cv = vOut[numOut];
      var tVec = cv.v;
      tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
      tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
      cv = vOut[numOut];
      var cv2;
      if (distance0 > 0) {
        cv2 = vIn[0];
        cv.id = cv2.id;
      } else {
        cv2 = vIn[1];
        cv.id = cv2.id;
      }
      ++numOut;
    }
    return numOut;
  };
  b2Collision.EdgeSeparation = function (poly1, xf1, edge1, poly2, xf2) {
    if (edge1 === undefined) edge1 = 0;
    var count1 = parseInt(poly1.m_vertexCount);
    var vertices1 = poly1.m_vertices;
    var normals1 = poly1.m_normals;
    var count2 = parseInt(poly2.m_vertexCount);
    var vertices2 = poly2.m_vertices;
    var tMat;
    var tVec;
    tMat = xf1.R;
    tVec = normals1[edge1];
    var normal1WorldX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
    var normal1WorldY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
    tMat = xf2.R;
    var normal1X = tMat.col1.x * normal1WorldX + tMat.col1.y * normal1WorldY;
    var normal1Y = tMat.col2.x * normal1WorldX + tMat.col2.y * normal1WorldY;
    var index = 0;
    var minDot = Number.MAX_VALUE;
    for (var i = 0; i < count2; ++i) {
      tVec = vertices2[i];
      var dot = tVec.x * normal1X + tVec.y * normal1Y;
      if (dot < minDot) {
        minDot = dot;
        index = i;
      }
    }
    tVec = vertices1[edge1];
    tMat = xf1.R;
    var v1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    var v1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    tVec = vertices2[index];
    tMat = xf2.R;
    var v2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    var v2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    v2X -= v1X;
    v2Y -= v1Y;
    var separation = v2X * normal1WorldX + v2Y * normal1WorldY;
    return separation;
  };
  b2Collision.FindMaxSeparation = function (edgeIndex, poly1, xf1, poly2, xf2) {
    var count1 = parseInt(poly1.m_vertexCount);
    var normals1 = poly1.m_normals;
    var tVec;
    var tMat;
    tMat = xf2.R;
    tVec = poly2.m_centroid;
    var dX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    var dY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    tMat = xf1.R;
    tVec = poly1.m_centroid;
    dX -= xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    dY -= xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    var dLocal1X = dX * xf1.R.col1.x + dY * xf1.R.col1.y;
    var dLocal1Y = dX * xf1.R.col2.x + dY * xf1.R.col2.y;
    var edge = 0;
    var maxDot = -Number.MAX_VALUE;
    for (var i = 0; i < count1; ++i) {
      tVec = normals1[i];
      var dot = tVec.x * dLocal1X + tVec.y * dLocal1Y;
      if (dot > maxDot) {
        maxDot = dot;
        edge = i;
      }
    }
    var s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
    var prevEdge = parseInt(edge - 1 >= 0 ? edge - 1 : count1 - 1);
    var sPrev = b2Collision.EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
    var nextEdge = parseInt(edge + 1 < count1 ? edge + 1 : 0);
    var sNext = b2Collision.EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
    var bestEdge = 0;
    var bestSeparation = 0;
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
      if (increment == -1) edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
      else edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;
      s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
      if (s > bestSeparation) {
        bestEdge = edge;
        bestSeparation = s;
      } else break;
    }
    edgeIndex[0] = bestEdge;
    return bestSeparation;
  };
  b2Collision.FindIncidentEdge = function (c, poly1, xf1, edge1, poly2, xf2) {
    if (edge1 === undefined) edge1 = 0;
    var count1 = parseInt(poly1.m_vertexCount);
    var normals1 = poly1.m_normals;
    var count2 = parseInt(poly2.m_vertexCount);
    var vertices2 = poly2.m_vertices;
    var normals2 = poly2.m_normals;
    var tMat;
    var tVec;
    tMat = xf1.R;
    tVec = normals1[edge1];
    var normal1X = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
    var normal1Y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
    tMat = xf2.R;
    var tX = tMat.col1.x * normal1X + tMat.col1.y * normal1Y;
    normal1Y = tMat.col2.x * normal1X + tMat.col2.y * normal1Y;
    normal1X = tX;
    var index = 0;
    var minDot = Number.MAX_VALUE;
    for (var i = 0; i < count2; ++i) {
      tVec = normals2[i];
      var dot = normal1X * tVec.x + normal1Y * tVec.y;
      if (dot < minDot) {
        minDot = dot;
        index = i;
      }
    }
    var tClip;
    var i1 = parseInt(index);
    var i2 = parseInt(i1 + 1 < count2 ? i1 + 1 : 0);
    tClip = c[0];
    tVec = vertices2[i1];
    tMat = xf2.R;
    tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    tClip.id.features.referenceEdge = edge1;
    tClip.id.features.incidentEdge = i1;
    tClip.id.features.incidentVertex = 0;
    tClip = c[1];
    tVec = vertices2[i2];
    tMat = xf2.R;
    tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    tClip.id.features.referenceEdge = edge1;
    tClip.id.features.incidentEdge = i2;
    tClip.id.features.incidentVertex = 1;
  };
  b2Collision.MakeClipPointVector = function () {
    var r = new Vector2(2);
    r[0] = new ClipVertex();
    r[1] = new ClipVertex();
    return r;
  };
  b2Collision.CollidePolygons = function (manifold, polyA, xfA, polyB, xfB) {
    var cv;
    manifold.m_pointCount = 0;
    var totalRadius = polyA.m_radius + polyB.m_radius;
    var edgeA = 0;
    b2Collision.s_edgeAO[0] = edgeA;
    var separationA = b2Collision.FindMaxSeparation(
      b2Collision.s_edgeAO,
      polyA,
      xfA,
      polyB,
      xfB
    );
    edgeA = b2Collision.s_edgeAO[0];
    if (separationA > totalRadius) return;
    var edgeB = 0;
    b2Collision.s_edgeBO[0] = edgeB;
    var separationB = b2Collision.FindMaxSeparation(
      b2Collision.s_edgeBO,
      polyB,
      xfB,
      polyA,
      xfA
    );
    edgeB = b2Collision.s_edgeBO[0];
    if (separationB > totalRadius) return;
    var poly1;
    var poly2;
    var xf1;
    var xf2;
    var edge1 = 0;
    var flip = 0;
    var k_relativeTol = 0.98;
    var k_absoluteTol = 0.001;
    var tMat;
    if (separationB > k_relativeTol * separationA + k_absoluteTol) {
      poly1 = polyB;
      poly2 = polyA;
      xf1 = xfB;
      xf2 = xfA;
      edge1 = edgeB;
      manifold.m_type = b2Manifold.e_faceB;
      flip = 1;
    } else {
      poly1 = polyA;
      poly2 = polyB;
      xf1 = xfA;
      xf2 = xfB;
      edge1 = edgeA;
      manifold.m_type = b2Manifold.e_faceA;
      flip = 0;
    }
    var incidentEdge = b2Collision.s_incidentEdge;
    b2Collision.FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
    var count1 = parseInt(poly1.m_vertexCount);
    var vertices1 = poly1.m_vertices;
    var local_v11 = vertices1[edge1];
    var local_v12;
    if (edge1 + 1 < count1) local_v12 = vertices1[parseInt(edge1 + 1)];
    else local_v12 = vertices1[0];
    var localTangent = b2Collision.s_localTangent;
    localTangent.Set(local_v12.x - local_v11.x, local_v12.y - local_v11.y);
    localTangent.Normalize();
    var localNormal = b2Collision.s_localNormal;
    localNormal.x = localTangent.y;
    localNormal.y = -localTangent.x;
    var planePoint = b2Collision.s_planePoint;
    planePoint.Set(
      0.5 * (local_v11.x + local_v12.x),
      0.5 * (local_v11.y + local_v12.y)
    );
    var tangent = b2Collision.s_tangent;
    tMat = xf1.R;
    tangent.x = tMat.col1.x * localTangent.x + tMat.col2.x * localTangent.y;
    tangent.y = tMat.col1.y * localTangent.x + tMat.col2.y * localTangent.y;
    var tangent2 = b2Collision.s_tangent2;
    tangent2.x = -tangent.x;
    tangent2.y = -tangent.y;
    var normal = b2Collision.s_normal;
    normal.x = tangent.y;
    normal.y = -tangent.x;
    var v11 = b2Collision.s_v11;
    var v12 = b2Collision.s_v12;
    v11.x =
      xf1.position.x + (tMat.col1.x * local_v11.x + tMat.col2.x * local_v11.y);
    v11.y =
      xf1.position.y + (tMat.col1.y * local_v11.x + tMat.col2.y * local_v11.y);
    v12.x =
      xf1.position.x + (tMat.col1.x * local_v12.x + tMat.col2.x * local_v12.y);
    v12.y =
      xf1.position.y + (tMat.col1.y * local_v12.x + tMat.col2.y * local_v12.y);
    var frontOffset = normal.x * v11.x + normal.y * v11.y;
    var sideOffset1 = -tangent.x * v11.x - tangent.y * v11.y + totalRadius;
    var sideOffset2 = tangent.x * v12.x + tangent.y * v12.y + totalRadius;
    var clipPoints1 = b2Collision.s_clipPoints1;
    var clipPoints2 = b2Collision.s_clipPoints2;
    var np = 0;
    np = b2Collision.ClipSegmentToLine(
      clipPoints1,
      incidentEdge,
      tangent2,
      sideOffset1
    );
    if (np < 2) return;
    np = b2Collision.ClipSegmentToLine(
      clipPoints2,
      clipPoints1,
      tangent,
      sideOffset2
    );
    if (np < 2) return;
    manifold.m_localPlaneNormal.SetV(localNormal);
    manifold.m_localPoint.SetV(planePoint);
    var pointCount = 0;
    for (var i = 0; i < b2Settings.b2_maxManifoldPoints; ++i) {
      cv = clipPoints2[i];
      var separation = normal.x * cv.v.x + normal.y * cv.v.y - frontOffset;
      if (separation <= totalRadius) {
        var cp = manifold.m_points[pointCount];
        tMat = xf2.R;
        var tX = cv.v.x - xf2.position.x;
        var tY = cv.v.y - xf2.position.y;
        cp.m_localPoint.x = tX * tMat.col1.x + tY * tMat.col1.y;
        cp.m_localPoint.y = tX * tMat.col2.x + tY * tMat.col2.y;
        cp.m_id.Set(cv.id);
        cp.m_id.features.flip = flip;
        ++pointCount;
      }
    }
    manifold.m_pointCount = pointCount;
  };
  b2Collision.CollideCircles = function (manifold, circle1, xf1, circle2, xf2) {
    manifold.m_pointCount = 0;
    var tMat;
    var tVec;
    tMat = xf1.R;
    tVec = circle1.m_p;
    var p1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    var p1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    tMat = xf2.R;
    tVec = circle2.m_p;
    var p2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    var p2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    var dX = p2X - p1X;
    var dY = p2Y - p1Y;
    var distSqr = dX * dX + dY * dY;
    var radius = circle1.m_radius + circle2.m_radius;
    if (distSqr > radius * radius) return;
    manifold.m_type = b2Manifold.e_circles;
    manifold.m_localPoint.SetV(circle1.m_p);
    manifold.m_localPlaneNormal.SetZero();
    manifold.m_pointCount = 1;
    manifold.m_points[0].m_localPoint.SetV(circle2.m_p);
    manifold.m_points[0].m_id.key = 0;
  };
  b2Collision.CollidePolygonAndCircle = function (
    manifold,
    polygon,
    xf1,
    circle,
    xf2
  ) {
    manifold.m_pointCount = 0;
    var tPoint;
    var dX = 0;
    var dY = 0;
    var positionX = 0;
    var positionY = 0;
    var tVec;
    var tMat;
    tMat = xf2.R;
    tVec = circle.m_p;
    var cX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    var cY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    dX = cX - xf1.position.x;
    dY = cY - xf1.position.y;
    tMat = xf1.R;
    var cLocalX = dX * tMat.col1.x + dY * tMat.col1.y;
    var cLocalY = dX * tMat.col2.x + dY * tMat.col2.y;
    var dist = 0;
    var normalIndex = 0;
    var separation = -Number.MAX_VALUE;
    var radius = polygon.m_radius + circle.m_radius;
    var vertexCount = parseInt(polygon.m_vertexCount);
    var vertices = polygon.m_vertices;
    var normals = polygon.m_normals;
    for (var i = 0; i < vertexCount; ++i) {
      tVec = vertices[i];
      dX = cLocalX - tVec.x;
      dY = cLocalY - tVec.y;
      tVec = normals[i];
      var s = tVec.x * dX + tVec.y * dY;
      if (s > radius) return;
      if (s > separation) {
        separation = s;
        normalIndex = i;
      }
    }
    var vertIndex1 = parseInt(normalIndex);
    var vertIndex2 = parseInt(
      vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0
    );
    var v1 = vertices[vertIndex1];
    var v2 = vertices[vertIndex2];
    if (separation < Number.MIN_VALUE) {
      manifold.m_pointCount = 1;
      manifold.m_type = b2Manifold.e_faceA;
      manifold.m_localPlaneNormal.SetV(normals[normalIndex]);
      manifold.m_localPoint.x = 0.5 * (v1.x + v2.x);
      manifold.m_localPoint.y = 0.5 * (v1.y + v2.y);
      manifold.m_points[0].m_localPoint.SetV(circle.m_p);
      manifold.m_points[0].m_id.key = 0;
      return;
    }
    var u1 =
      (cLocalX - v1.x) * (v2.x - v1.x) + (cLocalY - v1.y) * (v2.y - v1.y);
    var u2 =
      (cLocalX - v2.x) * (v1.x - v2.x) + (cLocalY - v2.y) * (v1.y - v2.y);
    if (u1 <= 0) {
      if (
        (cLocalX - v1.x) * (cLocalX - v1.x) +
          (cLocalY - v1.y) * (cLocalY - v1.y) >
        radius * radius
      )
        return;
      manifold.m_pointCount = 1;
      manifold.m_type = b2Manifold.e_faceA;
      manifold.m_localPlaneNormal.x = cLocalX - v1.x;
      manifold.m_localPlaneNormal.y = cLocalY - v1.y;
      manifold.m_localPlaneNormal.Normalize();
      manifold.m_localPoint.SetV(v1);
      manifold.m_points[0].m_localPoint.SetV(circle.m_p);
      manifold.m_points[0].m_id.key = 0;
    } else if (u2 <= 0) {
      if (
        (cLocalX - v2.x) * (cLocalX - v2.x) +
          (cLocalY - v2.y) * (cLocalY - v2.y) >
        radius * radius
      )
        return;
      manifold.m_pointCount = 1;
      manifold.m_type = b2Manifold.e_faceA;
      manifold.m_localPlaneNormal.x = cLocalX - v2.x;
      manifold.m_localPlaneNormal.y = cLocalY - v2.y;
      manifold.m_localPlaneNormal.Normalize();
      manifold.m_localPoint.SetV(v2);
      manifold.m_points[0].m_localPoint.SetV(circle.m_p);
      manifold.m_points[0].m_id.key = 0;
    } else {
      var faceCenterX = 0.5 * (v1.x + v2.x);
      var faceCenterY = 0.5 * (v1.y + v2.y);
      separation =
        (cLocalX - faceCenterX) * normals[vertIndex1].x +
        (cLocalY - faceCenterY) * normals[vertIndex1].y;
      if (separation > radius) return;
      manifold.m_pointCount = 1;
      manifold.m_type = b2Manifold.e_faceA;
      manifold.m_localPlaneNormal.x = normals[vertIndex1].x;
      manifold.m_localPlaneNormal.y = normals[vertIndex1].y;
      manifold.m_localPlaneNormal.Normalize();
      manifold.m_localPoint.Set(faceCenterX, faceCenterY);
      manifold.m_points[0].m_localPoint.SetV(circle.m_p);
      manifold.m_points[0].m_id.key = 0;
    }
  };
  b2Collision.TestOverlap = function (a, b) {
    var t1 = b.lowerBound;
    var t2 = a.upperBound;
    var d1X = t1.x - t2.x;
    var d1Y = t1.y - t2.y;
    t1 = a.lowerBound;
    t2 = b.upperBound;
    var d2X = t1.x - t2.x;
    var d2Y = t1.y - t2.y;
    if (d1X > 0 || d1Y > 0) return false;
    if (d2X > 0 || d2Y > 0) return false;
    return true;
  };
  Box2D.postDefs.push(function () {
    Box2D.Collision.b2Collision.s_incidentEdge =
      b2Collision.MakeClipPointVector();
    Box2D.Collision.b2Collision.s_clipPoints1 =
      b2Collision.MakeClipPointVector();
    Box2D.Collision.b2Collision.s_clipPoints2 =
      b2Collision.MakeClipPointVector();
    Box2D.Collision.b2Collision.s_edgeAO = new Vector_a2j_Number(1);
    Box2D.Collision.b2Collision.s_edgeBO = new Vector_a2j_Number(1);
    Box2D.Collision.b2Collision.s_localTangent = new b2Vec2();
    Box2D.Collision.b2Collision.s_localNormal = new b2Vec2();
    Box2D.Collision.b2Collision.s_planePoint = new b2Vec2();
    Box2D.Collision.b2Collision.s_normal = new b2Vec2();
    Box2D.Collision.b2Collision.s_tangent = new b2Vec2();
    Box2D.Collision.b2Collision.s_tangent2 = new b2Vec2();
    Box2D.Collision.b2Collision.s_v11 = new b2Vec2();
    Box2D.Collision.b2Collision.s_v12 = new b2Vec2();
    Box2D.Collision.b2Collision.b2CollidePolyTempVec = new b2Vec2();
    Box2D.Collision.b2Collision.b2_nullFeature = 255;
  });
  b2ContactID.b2ContactID = function () {
    this.features = new Features();
  };
  b2ContactID.prototype.b2ContactID = function () {
    this.features._m_id = this;
  };
  b2ContactID.prototype.Set = function (id) {
    this.key = id._key;
  };
  b2ContactID.prototype.Copy = function () {
    var id = new b2ContactID();
    id.key = this.key;
    return id;
  };
  Object.defineProperty(b2ContactID.prototype, "key", {
    enumerable: false,
    configurable: true,
    get: function () {
      return this._key;
    },
  });
  Object.defineProperty(b2ContactID.prototype, "key", {
    enumerable: false,
    configurable: true,
    set: function (value) {
      if (value === undefined) value = 0;
      this._key = value;
      this.features._referenceEdge = this._key & 255;
      this.features._incidentEdge = ((this._key & 65280) >> 8) & 255;
      this.features._incidentVertex = ((this._key & 16711680) >> 16) & 255;
      this.features._flip = ((this._key & 4278190080) >> 24) & 255;
    },
  });
  b2ContactPoint.b2ContactPoint = function () {
    this.position = new b2Vec2();
    this.velocity = new b2Vec2();
    this.normal = new b2Vec2();
    this.id = new b2ContactID();
  };
  b2Distance.b2Distance = function () {};
  b2Distance.Distance = function (output, cache, input) {
    ++b2Distance.b2_gjkCalls;
    var proxyA = input.proxyA;
    var proxyB = input.proxyB;
    var transformA = input.transformA;
    var transformB = input.transformB;
    var simplex = b2Distance.s_simplex;
    simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
    var vertices = simplex.m_vertices;
    var k_maxIters = 20;
    var saveA = b2Distance.s_saveA;
    var saveB = b2Distance.s_saveB;
    var saveCount = 0;
    var closestPoint = simplex.GetClosestPoint();
    var distanceSqr1 = closestPoint.LengthSquared();
    var distanceSqr2 = distanceSqr1;
    var i = 0;
    var p;
    var iter = 0;
    while (iter < k_maxIters) {
      saveCount = simplex.m_count;
      for (i = 0; i < saveCount; i++) {
        saveA[i] = vertices[i].indexA;
        saveB[i] = vertices[i].indexB;
      }
      switch (simplex.m_count) {
        case 1:
          break;
        case 2:
          simplex.Solve2();
          break;
        case 3:
          simplex.Solve3();
          break;
        default:
          b2Settings.b2Assert(false);
      }
      if (simplex.m_count == 3) break;
      p = simplex.GetClosestPoint();
      distanceSqr2 = p.LengthSquared();
      if (distanceSqr2 > distanceSqr1);
      distanceSqr1 = distanceSqr2;
      var d = simplex.GetSearchDirection();
      if (d.LengthSquared() < Number.MIN_VALUE * Number.MIN_VALUE) break;
      var vertex = vertices[simplex.m_count];
      vertex.indexA = proxyA.GetSupport(
        b2Math.MulTMV(transformA.R, d.GetNegative())
      );
      vertex.wA = b2Math.MulX(transformA, proxyA.GetVertex(vertex.indexA));
      vertex.indexB = proxyB.GetSupport(b2Math.MulTMV(transformB.R, d));
      vertex.wB = b2Math.MulX(transformB, proxyB.GetVertex(vertex.indexB));
      vertex.w = b2Math.SubtractVV(vertex.wB, vertex.wA);
      ++iter;
      ++b2Distance.b2_gjkIters;
      var duplicate = false;
      for (i = 0; i < saveCount; i++)
        if (vertex.indexA == saveA[i] && vertex.indexB == saveB[i]) {
          duplicate = true;
          break;
        }
      if (duplicate) break;
      ++simplex.m_count;
    }
    b2Distance.b2_gjkMaxIters = b2Math.Max(b2Distance.b2_gjkMaxIters, iter);
    simplex.GetWitnessPoints(output.pointA, output.pointB);
    output.distance = b2Math.SubtractVV(output.pointA, output.pointB).Length();
    output.iterations = iter;
    simplex.WriteCache(cache);
    if (input.useRadii) {
      var rA = proxyA.m_radius;
      var rB = proxyB.m_radius;
      if (output.distance > rA + rB && output.distance > Number.MIN_VALUE) {
        output.distance -= rA + rB;
        var normal = b2Math.SubtractVV(output.pointB, output.pointA);
        normal.Normalize();
        output.pointA.x += rA * normal.x;
        output.pointA.y += rA * normal.y;
        output.pointB.x -= rB * normal.x;
        output.pointB.y -= rB * normal.y;
      } else {
        p = new b2Vec2();
        p.x = 0.5 * (output.pointA.x + output.pointB.x);
        p.y = 0.5 * (output.pointA.y + output.pointB.y);
        output.pointA.x = output.pointB.x = p.x;
        output.pointA.y = output.pointB.y = p.y;
        output.distance = 0;
      }
    }
  };
  Box2D.postDefs.push(function () {
    Box2D.Collision.b2Distance.s_simplex = new b2Simplex();
    Box2D.Collision.b2Distance.s_saveA = new Vector_a2j_Number(3);
    Box2D.Collision.b2Distance.s_saveB = new Vector_a2j_Number(3);
  });
  b2DistanceInput.b2DistanceInput = function () {};
  b2DistanceOutput.b2DistanceOutput = function () {
    this.pointA = new b2Vec2();
    this.pointB = new b2Vec2();
  };
  b2DistanceProxy.b2DistanceProxy = function () {};
  b2DistanceProxy.prototype.Set = function (shape) {
    switch (shape.GetType()) {
      case b2Shape.e_circleShape:
        var circle = shape instanceof b2CircleShape ? shape : null;
        this.m_vertices = new Vector2(1, true);
        this.m_vertices[0] = circle.m_p;
        this.m_count = 1;
        this.m_radius = circle.m_radius;
        break;
      case b2Shape.e_polygonShape:
        var polygon = shape instanceof b2PolygonShape ? shape : null;
        this.m_vertices = polygon.m_vertices;
        this.m_count = polygon.m_vertexCount;
        this.m_radius = polygon.m_radius;
        break;
      default:
        b2Settings.b2Assert(false);
    }
  };
  b2DistanceProxy.prototype.GetSupport = function (d) {
    var bestIndex = 0;
    var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
    for (var i = 1; i < this.m_count; ++i) {
      var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
      if (value > bestValue) {
        bestIndex = i;
        bestValue = value;
      }
    }
    return bestIndex;
  };
  b2DistanceProxy.prototype.GetSupportVertex = function (d) {
    var bestIndex = 0;
    var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
    for (var i = 1; i < this.m_count; ++i) {
      var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
      if (value > bestValue) {
        bestIndex = i;
        bestValue = value;
      }
    }
    return this.m_vertices[bestIndex];
  };
  b2DistanceProxy.prototype.GetVertexCount = function () {
    return this.m_count;
  };
  b2DistanceProxy.prototype.GetVertex = function (index) {
    if (index === undefined) index = 0;
    b2Settings.b2Assert(0 <= index && index < this.m_count);
    return this.m_vertices[index];
  };
  b2DynamicTree.b2DynamicTree = function () {};
  b2DynamicTree.prototype.b2DynamicTree = function () {
    this.m_root = null;
    this.m_freeList = null;
    this.m_path = 0;
    this.m_insertionCount = 0;
  };
  b2DynamicTree.prototype.CreateProxy = function (aabb, userData) {
    var node = this.AllocateNode();
    var extendX = b2Settings.b2_aabbExtension;
    var extendY = b2Settings.b2_aabbExtension;
    node.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
    node.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
    node.aabb.upperBound.x = aabb.upperBound.x + extendX;
    node.aabb.upperBound.y = aabb.upperBound.y + extendY;
    node.userData = userData;
    this.InsertLeaf(node);
    return node;
  };
  b2DynamicTree.prototype.DestroyProxy = function (proxy) {
    this.RemoveLeaf(proxy);
    this.FreeNode(proxy);
  };
  b2DynamicTree.prototype.MoveProxy = function (proxy, aabb, displacement) {
    b2Settings.b2Assert(proxy.IsLeaf());
    if (proxy.aabb.Contains(aabb)) return false;
    this.RemoveLeaf(proxy);
    var extendX =
      b2Settings.b2_aabbExtension +
      b2Settings.b2_aabbMultiplier *
        (displacement.x > 0 ? displacement.x : -displacement.x);
    var extendY =
      b2Settings.b2_aabbExtension +
      b2Settings.b2_aabbMultiplier *
        (displacement.y > 0 ? displacement.y : -displacement.y);
    proxy.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
    proxy.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
    proxy.aabb.upperBound.x = aabb.upperBound.x + extendX;
    proxy.aabb.upperBound.y = aabb.upperBound.y + extendY;
    this.InsertLeaf(proxy);
    return true;
  };
  b2DynamicTree.prototype.Rebalance = function (iterations) {
    if (iterations === undefined) iterations = 0;
    if (this.m_root == null) return;
    for (var i = 0; i < iterations; i++) {
      var node = this.m_root;
      var bit = 0;
      while (node.IsLeaf() == false) {
        node = (this.m_path >> bit) & 1 ? node.child2 : node.child1;
        bit = (bit + 1) & 31;
      }
      ++this.m_path;
      this.RemoveLeaf(node);
      this.InsertLeaf(node);
    }
  };
  b2DynamicTree.prototype.GetFatAABB = function (proxy) {
    return proxy.aabb;
  };
  b2DynamicTree.prototype.GetUserData = function (proxy) {
    return proxy.userData;
  };
  b2DynamicTree.prototype.Query = function (callback, aabb) {
    if (this.m_root == null) return;
    var stack = new Vector2();
    var count = 0;
    stack[count++] = this.m_root;
    while (count > 0) {
      var node = stack[--count];
      if (node.aabb.TestOverlap(aabb))
        if (node.IsLeaf()) {
          var proceed = callback(node);
          if (!proceed) return;
        } else {
          stack[count++] = node.child1;
          stack[count++] = node.child2;
        }
    }
  };
  b2DynamicTree.prototype.RayCast = function (callback, input) {
    if (this.m_root == null) return;
    var p1 = input.p1;
    var p2 = input.p2;
    var r = b2Math.SubtractVV(p1, p2);
    r.Normalize();
    var v = b2Math.CrossFV(1, r);
    var abs_v = b2Math.AbsV(v);
    var maxFraction = input.maxFraction;
    var segmentAABB = new b2AABB();
    var tX = 0;
    var tY = 0;
    tX = p1.x + maxFraction * (p2.x - p1.x);
    tY = p1.y + maxFraction * (p2.y - p1.y);
    segmentAABB.lowerBound.x = Math.min(p1.x, tX);
    segmentAABB.lowerBound.y = Math.min(p1.y, tY);
    segmentAABB.upperBound.x = Math.max(p1.x, tX);
    segmentAABB.upperBound.y = Math.max(p1.y, tY);
    var stack = new Vector2();
    var count = 0;
    stack[count++] = this.m_root;
    while (count > 0) {
      var node = stack[--count];
      if (node.aabb.TestOverlap(segmentAABB) == false) continue;
      var c = node.aabb.GetCenter();
      var h = node.aabb.GetExtents();
      var separation =
        Math.abs(v.x * (p1.x - c.x) + v.y * (p1.y - c.y)) -
        abs_v.x * h.x -
        abs_v.y * h.y;
      if (separation > 0) continue;
      if (node.IsLeaf()) {
        var subInput = new b2RayCastInput();
        subInput.p1 = input.p1;
        subInput.p2 = input.p2;
        subInput.maxFraction = input.maxFraction;
        maxFraction = callback(subInput, node);
        if (maxFraction == 0) return;
        if (maxFraction > 0) {
          tX = p1.x + maxFraction * (p2.x - p1.x);
          tY = p1.y + maxFraction * (p2.y - p1.y);
          segmentAABB.lowerBound.x = Math.min(p1.x, tX);
          segmentAABB.lowerBound.y = Math.min(p1.y, tY);
          segmentAABB.upperBound.x = Math.max(p1.x, tX);
          segmentAABB.upperBound.y = Math.max(p1.y, tY);
        }
      } else {
        stack[count++] = node.child1;
        stack[count++] = node.child2;
      }
    }
  };
  b2DynamicTree.prototype.AllocateNode = function () {
    if (this.m_freeList) {
      var node = this.m_freeList;
      this.m_freeList = node.parent;
      node.parent = null;
      node.child1 = null;
      node.child2 = null;
      return node;
    }
    return new b2DynamicTreeNode();
  };
  b2DynamicTree.prototype.FreeNode = function (node) {
    node.parent = this.m_freeList;
    this.m_freeList = node;
  };
  b2DynamicTree.prototype.InsertLeaf = function (leaf) {
    ++this.m_insertionCount;
    if (this.m_root == null) {
      this.m_root = leaf;
      this.m_root.parent = null;
      return;
    }
    var center = leaf.aabb.GetCenter();
    var sibling = this.m_root;
    if (sibling.IsLeaf() == false) {
      do {
        var child1 = sibling.child1;
        var child2 = sibling.child2;
        var norm1 =
          Math.abs(
            (child1.aabb.lowerBound.x + child1.aabb.upperBound.x) / 2 - center.x
          ) +
          Math.abs(
            (child1.aabb.lowerBound.y + child1.aabb.upperBound.y) / 2 - center.y
          );
        var norm2 =
          Math.abs(
            (child2.aabb.lowerBound.x + child2.aabb.upperBound.x) / 2 - center.x
          ) +
          Math.abs(
            (child2.aabb.lowerBound.y + child2.aabb.upperBound.y) / 2 - center.y
          );
        if (norm1 < norm2) sibling = child1;
        else sibling = child2;
      } while (sibling.IsLeaf() == false);
    }
    var node1 = sibling.parent;
    var node2 = this.AllocateNode();
    node2.parent = node1;
    node2.userData = null;
    node2.aabb.Combine(leaf.aabb, sibling.aabb);
    if (node1) {
      if (sibling.parent.child1 == sibling) node1.child1 = node2;
      else node1.child2 = node2;
      node2.child1 = sibling;
      node2.child2 = leaf;
      sibling.parent = node2;
      leaf.parent = node2;
      do {
        if (node1.aabb.Contains(node2.aabb)) break;
        node1.aabb.Combine(node1.child1.aabb, node1.child2.aabb);
        node2 = node1;
        node1 = node1.parent;
      } while (node1);
    } else {
      node2.child1 = sibling;
      node2.child2 = leaf;
      sibling.parent = node2;
      leaf.parent = node2;
      this.m_root = node2;
    }
  };
  b2DynamicTree.prototype.RemoveLeaf = function (leaf) {
    if (leaf == this.m_root) {
      this.m_root = null;
      return;
    }
    var node2 = leaf.parent;
    var node1 = node2.parent;
    var sibling;
    if (node2.child1 == leaf) sibling = node2.child2;
    else sibling = node2.child1;
    if (node1) {
      if (node1.child1 == node2) node1.child1 = sibling;
      else node1.child2 = sibling;
      sibling.parent = node1;
      this.FreeNode(node2);
      while (node1) {
        var oldAABB = node1.aabb;
        node1.aabb = b2AABB.Combine(node1.child1.aabb, node1.child2.aabb);
        if (oldAABB.Contains(node1.aabb)) break;
        node1 = node1.parent;
      }
    } else {
      this.m_root = sibling;
      sibling.parent = null;
      this.FreeNode(node2);
    }
  };
  b2DynamicTreeBroadPhase.b2DynamicTreeBroadPhase = function () {
    this.m_tree = new b2DynamicTree();
    this.m_moveBuffer = new Vector2();
    this.m_pairBuffer = new Vector2();
    this.m_pairCount = 0;
  };
  b2DynamicTreeBroadPhase.prototype.CreateProxy = function (aabb, userData) {
    var proxy = this.m_tree.CreateProxy(aabb, userData);
    ++this.m_proxyCount;
    this.BufferMove(proxy);
    return proxy;
  };
  b2DynamicTreeBroadPhase.prototype.DestroyProxy = function (proxy) {
    this.UnBufferMove(proxy);
    --this.m_proxyCount;
    this.m_tree.DestroyProxy(proxy);
  };
  b2DynamicTreeBroadPhase.prototype.MoveProxy = function (
    proxy,
    aabb,
    displacement
  ) {
    var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
    if (buffer) this.BufferMove(proxy);
  };
  b2DynamicTreeBroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
    var aabbA = this.m_tree.GetFatAABB(proxyA);
    var aabbB = this.m_tree.GetFatAABB(proxyB);
    return aabbA.TestOverlap(aabbB);
  };
  b2DynamicTreeBroadPhase.prototype.GetUserData = function (proxy) {
    return this.m_tree.GetUserData(proxy);
  };
  b2DynamicTreeBroadPhase.prototype.GetFatAABB = function (proxy) {
    return this.m_tree.GetFatAABB(proxy);
  };
  b2DynamicTreeBroadPhase.prototype.GetProxyCount = function () {
    return this.m_proxyCount;
  };
  b2DynamicTreeBroadPhase.prototype.UpdatePairs = function (callback) {
    var __this = this;
    __this.m_pairCount = 0;
    var i = 0,
      queryProxy;
    for (i = 0; i < __this.m_moveBuffer.length; ++i) {
      queryProxy = __this.m_moveBuffer[i];
      function QueryCallback(proxy) {
        if (proxy == queryProxy) return true;
        if (__this.m_pairCount == __this.m_pairBuffer.length)
          __this.m_pairBuffer[__this.m_pairCount] = new b2DynamicTreePair();
        var pair = __this.m_pairBuffer[__this.m_pairCount];
        pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
        pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;
        ++__this.m_pairCount;
        return true;
      }
      var fatAABB = __this.m_tree.GetFatAABB(queryProxy);
      __this.m_tree.Query(QueryCallback, fatAABB);
    }
    __this.m_moveBuffer.length = 0;
    for (var i = 0; i < __this.m_pairCount; ) {
      var primaryPair = __this.m_pairBuffer[i];
      var userDataA = __this.m_tree.GetUserData(primaryPair.proxyA);
      var userDataB = __this.m_tree.GetUserData(primaryPair.proxyB);
      callback(userDataA, userDataB);
      ++i;
      while (i < __this.m_pairCount) {
        var pair = __this.m_pairBuffer[i];
        if (
          pair.proxyA != primaryPair.proxyA ||
          pair.proxyB != primaryPair.proxyB
        )
          break;
        ++i;
      }
    }
  };
  b2DynamicTreeBroadPhase.prototype.Query = function (callback, aabb) {
    this.m_tree.Query(callback, aabb);
  };
  b2DynamicTreeBroadPhase.prototype.RayCast = function (callback, input) {
    this.m_tree.RayCast(callback, input);
  };
  b2DynamicTreeBroadPhase.prototype.Validate = function () {};
  b2DynamicTreeBroadPhase.prototype.Rebalance = function (iterations) {
    if (iterations === undefined) iterations = 0;
    this.m_tree.Rebalance(iterations);
  };
  b2DynamicTreeBroadPhase.prototype.BufferMove = function (proxy) {
    this.m_moveBuffer[this.m_moveBuffer.length] = proxy;
  };
  b2DynamicTreeBroadPhase.prototype.UnBufferMove = function (proxy) {
    var i = parseInt(this.m_moveBuffer.indexOf(proxy));
    this.m_moveBuffer.splice(i, 1);
  };
  b2DynamicTreeBroadPhase.prototype.ComparePairs = function (pair1, pair2) {
    return 0;
  };
  b2DynamicTreeBroadPhase.__implements = {};
  b2DynamicTreeBroadPhase.__implements[IBroadPhase] = true;
  b2DynamicTreeNode.b2DynamicTreeNode = function () {
    this.aabb = new b2AABB();
  };
  b2DynamicTreeNode.prototype.IsLeaf = function () {
    return this.child1 == null;
  };
  b2DynamicTreePair.b2DynamicTreePair = function () {};
  b2Manifold.b2Manifold = function () {
    this.m_pointCount = 0;
  };
  b2Manifold.prototype.b2Manifold = function () {
    this.m_points = new Vector2(b2Settings.b2_maxManifoldPoints);
    for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++)
      this.m_points[i] = new b2ManifoldPoint();
    this.m_localPlaneNormal = new b2Vec2();
    this.m_localPoint = new b2Vec2();
  };
  b2Manifold.prototype.Reset = function () {
    for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++)
      (this.m_points[i] instanceof b2ManifoldPoint
        ? this.m_points[i]
        : null
      ).Reset();
    this.m_localPlaneNormal.SetZero();
    this.m_localPoint.SetZero();
    this.m_type = 0;
    this.m_pointCount = 0;
  };
  b2Manifold.prototype.Set = function (m) {
    this.m_pointCount = m.m_pointCount;
    for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++)
      (this.m_points[i] instanceof b2ManifoldPoint
        ? this.m_points[i]
        : null
      ).Set(m.m_points[i]);
    this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
    this.m_localPoint.SetV(m.m_localPoint);
    this.m_type = m.m_type;
  };
  b2Manifold.prototype.Copy = function () {
    var copy = new b2Manifold();
    copy.Set(this);
    return copy;
  };
  Box2D.postDefs.push(function () {
    Box2D.Collision.b2Manifold.e_circles = 1;
    Box2D.Collision.b2Manifold.e_faceA = 2;
    Box2D.Collision.b2Manifold.e_faceB = 4;
  });
  b2ManifoldPoint.b2ManifoldPoint = function () {
    this.m_localPoint = new b2Vec2();
    this.m_id = new b2ContactID();
  };
  b2ManifoldPoint.prototype.b2ManifoldPoint = function () {
    this.Reset();
  };
  b2ManifoldPoint.prototype.Reset = function () {
    this.m_localPoint.SetZero();
    this.m_normalImpulse = 0;
    this.m_tangentImpulse = 0;
    this.m_id.key = 0;
  };
  b2ManifoldPoint.prototype.Set = function (m) {
    this.m_localPoint.SetV(m.m_localPoint);
    this.m_normalImpulse = m.m_normalImpulse;
    this.m_tangentImpulse = m.m_tangentImpulse;
    this.m_id.Set(m.m_id);
  };
  b2Point.b2Point = function () {
    this.p = new b2Vec2();
  };
  b2Point.prototype.Support = function (xf, vX, vY) {
    if (vX === undefined) vX = 0;
    if (vY === undefined) vY = 0;
    return this.p;
  };
  b2Point.prototype.GetFirstVertex = function (xf) {
    return this.p;
  };
  b2RayCastInput.b2RayCastInput = function () {
    this.p1 = new b2Vec2();
    this.p2 = new b2Vec2();
  };
  b2RayCastInput.prototype.b2RayCastInput = function (p1, p2, maxFraction) {
    if (p1 === undefined) p1 = null;
    if (p2 === undefined) p2 = null;
    if (maxFraction === undefined) maxFraction = 1;
    if (p1) this.p1.SetV(p1);
    if (p2) this.p2.SetV(p2);
    this.maxFraction = maxFraction;
  };
  b2RayCastOutput.b2RayCastOutput = function () {
    this.normal = new b2Vec2();
  };
  b2Segment.b2Segment = function () {
    this.p1 = new b2Vec2();
    this.p2 = new b2Vec2();
  };
  b2Segment.prototype.TestSegment = function (
    lambda,
    normal,
    segment,
    maxLambda
  ) {
    if (maxLambda === undefined) maxLambda = 0;
    var s = segment.p1;
    var rX = segment.p2.x - s.x;
    var rY = segment.p2.y - s.y;
    var dX = this.p2.x - this.p1.x;
    var dY = this.p2.y - this.p1.y;
    var nX = dY;
    var nY = -dX;
    var k_slop = 100 * Number.MIN_VALUE;
    var denom = -(rX * nX + rY * nY);
    if (denom > k_slop) {
      var bX = s.x - this.p1.x;
      var bY = s.y - this.p1.y;
      var a = bX * nX + bY * nY;
      if (0 <= a && a <= maxLambda * denom) {
        var mu2 = -rX * bY + rY * bX;
        if (-k_slop * denom <= mu2 && mu2 <= denom * (1 + k_slop)) {
          a /= denom;
          var nLen = Math.sqrt(nX * nX + nY * nY);
          nX /= nLen;
          nY /= nLen;
          lambda[0] = a;
          normal.Set(nX, nY);
          return true;
        }
      }
    }
    return false;
  };
  b2Segment.prototype.Extend = function (aabb) {
    this.ExtendForward(aabb);
    this.ExtendBackward(aabb);
  };
  b2Segment.prototype.ExtendForward = function (aabb) {
    var dX = this.p2.x - this.p1.x;
    var dY = this.p2.y - this.p1.y;
    var lambda = Math.min(
      dX > 0
        ? (aabb.upperBound.x - this.p1.x) / dX
        : dX < 0
        ? (aabb.lowerBound.x - this.p1.x) / dX
        : Number.POSITIVE_INFINITY,
      dY > 0
        ? (aabb.upperBound.y - this.p1.y) / dY
        : dY < 0
        ? (aabb.lowerBound.y - this.p1.y) / dY
        : Number.POSITIVE_INFINITY
    );
    this.p2.x = this.p1.x + dX * lambda;
    this.p2.y = this.p1.y + dY * lambda;
  };
  b2Segment.prototype.ExtendBackward = function (aabb) {
    var dX = -this.p2.x + this.p1.x;
    var dY = -this.p2.y + this.p1.y;
    var lambda = Math.min(
      dX > 0
        ? (aabb.upperBound.x - this.p2.x) / dX
        : dX < 0
        ? (aabb.lowerBound.x - this.p2.x) / dX
        : Number.POSITIVE_INFINITY,
      dY > 0
        ? (aabb.upperBound.y - this.p2.y) / dY
        : dY < 0
        ? (aabb.lowerBound.y - this.p2.y) / dY
        : Number.POSITIVE_INFINITY
    );
    this.p1.x = this.p2.x + dX * lambda;
    this.p1.y = this.p2.y + dY * lambda;
  };
  b2SeparationFunction.b2SeparationFunction = function () {
    this.m_localPoint = new b2Vec2();
    this.m_axis = new b2Vec2();
  };
  b2SeparationFunction.prototype.Initialize = function (
    cache,
    proxyA,
    transformA,
    proxyB,
    transformB
  ) {
    this.m_proxyA = proxyA;
    this.m_proxyB = proxyB;
    var count = parseInt(cache.count);
    b2Settings.b2Assert(0 < count && count < 3);
    var localPointA;
    var localPointA1;
    var localPointA2;
    var localPointB;
    var localPointB1;
    var localPointB2;
    var pointAX = 0;
    var pointAY = 0;
    var pointBX = 0;
    var pointBY = 0;
    var normalX = 0;
    var normalY = 0;
    var tMat;
    var tVec;
    var s = 0;
    var sgn = 0;
    if (count == 1) {
      this.m_type = b2SeparationFunction.e_points;
      localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
      localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
      tVec = localPointA;
      tMat = transformA.R;
      pointAX =
        transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      pointAY =
        transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tVec = localPointB;
      tMat = transformB.R;
      pointBX =
        transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      pointBY =
        transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      this.m_axis.x = pointBX - pointAX;
      this.m_axis.y = pointBY - pointAY;
      this.m_axis.Normalize();
    } else if (cache.indexB[0] == cache.indexB[1]) {
      this.m_type = b2SeparationFunction.e_faceA;
      localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
      localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
      localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
      this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);
      this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
      this.m_axis = b2Math.CrossVF(
        b2Math.SubtractVV(localPointA2, localPointA1),
        1
      );
      this.m_axis.Normalize();
      tVec = this.m_axis;
      tMat = transformA.R;
      normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
      normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
      tVec = this.m_localPoint;
      tMat = transformA.R;
      pointAX =
        transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      pointAY =
        transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tVec = localPointB;
      tMat = transformB.R;
      pointBX =
        transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      pointBY =
        transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      s = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
      if (s < 0) this.m_axis.NegativeSelf();
    } else if (cache.indexA[0] == cache.indexA[0]) {
      this.m_type = b2SeparationFunction.e_faceB;
      localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
      localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
      localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
      this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);
      this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
      this.m_axis = b2Math.CrossVF(
        b2Math.SubtractVV(localPointB2, localPointB1),
        1
      );
      this.m_axis.Normalize();
      tVec = this.m_axis;
      tMat = transformB.R;
      normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
      normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
      tVec = this.m_localPoint;
      tMat = transformB.R;
      pointBX =
        transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      pointBY =
        transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tVec = localPointA;
      tMat = transformA.R;
      pointAX =
        transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      pointAY =
        transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      s = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
      if (s < 0) this.m_axis.NegativeSelf();
    } else {
      localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
      localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
      localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
      localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
      var pA = b2Math.MulX(transformA, localPointA);
      var dA = b2Math.MulMV(
        transformA.R,
        b2Math.SubtractVV(localPointA2, localPointA1)
      );
      var pB = b2Math.MulX(transformB, localPointB);
      var dB = b2Math.MulMV(
        transformB.R,
        b2Math.SubtractVV(localPointB2, localPointB1)
      );
      var a = dA.x * dA.x + dA.y * dA.y;
      var e = dB.x * dB.x + dB.y * dB.y;
      var r = b2Math.SubtractVV(dB, dA);
      var c = dA.x * r.x + dA.y * r.y;
      var f = dB.x * r.x + dB.y * r.y;
      var b = dA.x * dB.x + dA.y * dB.y;
      var denom = a * e - b * b;
      s = 0;
      if (denom != 0) s = b2Math.Clamp((b * f - c * e) / denom, 0, 1);
      var t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = b2Math.Clamp((b - c) / a, 0, 1);
      }
      localPointA = new b2Vec2();
      localPointA.x = localPointA1.x + s * (localPointA2.x - localPointA1.x);
      localPointA.y = localPointA1.y + s * (localPointA2.y - localPointA1.y);
      localPointB = new b2Vec2();
      localPointB.x = localPointB1.x + s * (localPointB2.x - localPointB1.x);
      localPointB.y = localPointB1.y + s * (localPointB2.y - localPointB1.y);
      if (s == 0 || s == 1) {
        this.m_type = b2SeparationFunction.e_faceB;
        this.m_axis = b2Math.CrossVF(
          b2Math.SubtractVV(localPointB2, localPointB1),
          1
        );
        this.m_axis.Normalize();
        this.m_localPoint = localPointB;
        tVec = this.m_axis;
        tMat = transformB.R;
        normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tVec = this.m_localPoint;
        tMat = transformB.R;
        pointBX =
          transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        pointBY =
          transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        tVec = localPointA;
        tMat = transformA.R;
        pointAX =
          transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        pointAY =
          transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        sgn = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
        if (s < 0) this.m_axis.NegativeSelf();
      } else {
        this.m_type = b2SeparationFunction.e_faceA;
        this.m_axis = b2Math.CrossVF(
          b2Math.SubtractVV(localPointA2, localPointA1),
          1
        );
        this.m_localPoint = localPointA;
        tVec = this.m_axis;
        tMat = transformA.R;
        normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tVec = this.m_localPoint;
        tMat = transformA.R;
        pointAX =
          transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        pointAY =
          transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        tVec = localPointB;
        tMat = transformB.R;
        pointBX =
          transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        pointBY =
          transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        sgn = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
        if (s < 0) this.m_axis.NegativeSelf();
      }
    }
  };
  b2SeparationFunction.prototype.Evaluate = function (transformA, transformB) {
    var axisA;
    var axisB;
    var localPointA;
    var localPointB;
    var pointA;
    var pointB;
    var seperation = 0;
    var normal;
    switch (this.m_type) {
      case b2SeparationFunction.e_points:
        axisA = b2Math.MulTMV(transformA.R, this.m_axis);
        axisB = b2Math.MulTMV(transformB.R, this.m_axis.GetNegative());
        localPointA = this.m_proxyA.GetSupportVertex(axisA);
        localPointB = this.m_proxyB.GetSupportVertex(axisB);
        pointA = b2Math.MulX(transformA, localPointA);
        pointB = b2Math.MulX(transformB, localPointB);
        seperation =
          (pointB.x - pointA.x) * this.m_axis.x +
          (pointB.y - pointA.y) * this.m_axis.y;
        return seperation;
      case b2SeparationFunction.e_faceA:
        normal = b2Math.MulMV(transformA.R, this.m_axis);
        pointA = b2Math.MulX(transformA, this.m_localPoint);
        axisB = b2Math.MulTMV(transformB.R, normal.GetNegative());
        localPointB = this.m_proxyB.GetSupportVertex(axisB);
        pointB = b2Math.MulX(transformB, localPointB);
        seperation =
          (pointB.x - pointA.x) * normal.x + (pointB.y - pointA.y) * normal.y;
        return seperation;
      case b2SeparationFunction.e_faceB:
        normal = b2Math.MulMV(transformB.R, this.m_axis);
        pointB = b2Math.MulX(transformB, this.m_localPoint);
        axisA = b2Math.MulTMV(transformA.R, normal.GetNegative());
        localPointA = this.m_proxyA.GetSupportVertex(axisA);
        pointA = b2Math.MulX(transformA, localPointA);
        seperation =
          (pointA.x - pointB.x) * normal.x + (pointA.y - pointB.y) * normal.y;
        return seperation;
      default:
        b2Settings.b2Assert(false);
        return 0;
    }
  };
  Box2D.postDefs.push(function () {
    Box2D.Collision.b2SeparationFunction.e_points = 1;
    Box2D.Collision.b2SeparationFunction.e_faceA = 2;
    Box2D.Collision.b2SeparationFunction.e_faceB = 4;
  });
  b2Simplex.b2Simplex = function () {
    this.m_v1 = new b2SimplexVertex();
    this.m_v2 = new b2SimplexVertex();
    this.m_v3 = new b2SimplexVertex();
    this.m_vertices = new Vector2(3);
  };
  b2Simplex.prototype.b2Simplex = function () {
    this.m_vertices[0] = this.m_v1;
    this.m_vertices[1] = this.m_v2;
    this.m_vertices[2] = this.m_v3;
  };
  b2Simplex.prototype.ReadCache = function (
    cache,
    proxyA,
    transformA,
    proxyB,
    transformB
  ) {
    b2Settings.b2Assert(0 <= cache.count && cache.count <= 3);
    var wALocal;
    var wBLocal;
    this.m_count = cache.count;
    var vertices = this.m_vertices;
    for (var i = 0; i < this.m_count; i++) {
      var v = vertices[i];
      v.indexA = cache.indexA[i];
      v.indexB = cache.indexB[i];
      wALocal = proxyA.GetVertex(v.indexA);
      wBLocal = proxyB.GetVertex(v.indexB);
      v.wA = b2Math.MulX(transformA, wALocal);
      v.wB = b2Math.MulX(transformB, wBLocal);
      v.w = b2Math.SubtractVV(v.wB, v.wA);
      v.a = 0;
    }
    if (this.m_count > 1) {
      var metric1 = cache.metric;
      var metric2 = this.GetMetric();
      if (
        metric2 < 0.5 * metric1 ||
        2 * metric1 < metric2 ||
        metric2 < Number.MIN_VALUE
      )
        this.m_count = 0;
    }
    if (this.m_count == 0) {
      v = vertices[0];
      v.indexA = 0;
      v.indexB = 0;
      wALocal = proxyA.GetVertex(0);
      wBLocal = proxyB.GetVertex(0);
      v.wA = b2Math.MulX(transformA, wALocal);
      v.wB = b2Math.MulX(transformB, wBLocal);
      v.w = b2Math.SubtractVV(v.wB, v.wA);
      this.m_count = 1;
    }
  };
  b2Simplex.prototype.WriteCache = function (cache) {
    cache.metric = this.GetMetric();
    cache.count = Box2D.parseUInt(this.m_count);
    var vertices = this.m_vertices;
    for (var i = 0; i < this.m_count; i++) {
      cache.indexA[i] = Box2D.parseUInt(vertices[i].indexA);
      cache.indexB[i] = Box2D.parseUInt(vertices[i].indexB);
    }
  };
  b2Simplex.prototype.GetSearchDirection = function () {
    switch (this.m_count) {
      case 1:
        return this.m_v1.w.GetNegative();
      case 2:
        var e12 = b2Math.SubtractVV(this.m_v2.w, this.m_v1.w);
        var sgn = b2Math.CrossVV(e12, this.m_v1.w.GetNegative());
        if (sgn > 0) return b2Math.CrossFV(1, e12);
        else return b2Math.CrossVF(e12, 1);
      default:
        b2Settings.b2Assert(false);
        return new b2Vec2();
    }
  };
  b2Simplex.prototype.GetClosestPoint = function () {
    switch (this.m_count) {
      case 0:
        b2Settings.b2Assert(false);
        return new b2Vec2();
      case 1:
        return this.m_v1.w;
      case 2:
        return new b2Vec2(
          this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x,
          this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y
        );
      default:
        b2Settings.b2Assert(false);
        return new b2Vec2();
    }
  };
  b2Simplex.prototype.GetWitnessPoints = function (pA, pB) {
    switch (this.m_count) {
      case 0:
        b2Settings.b2Assert(false);
        break;
      case 1:
        pA.SetV(this.m_v1.wA);
        pB.SetV(this.m_v1.wB);
        break;
      case 2:
        pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
        pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
        pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
        pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
        break;
      case 3:
        pB.x = pA.x =
          this.m_v1.a * this.m_v1.wA.x +
          this.m_v2.a * this.m_v2.wA.x +
          this.m_v3.a * this.m_v3.wA.x;
        pB.y = pA.y =
          this.m_v1.a * this.m_v1.wA.y +
          this.m_v2.a * this.m_v2.wA.y +
          this.m_v3.a * this.m_v3.wA.y;
        break;
      default:
        b2Settings.b2Assert(false);
        break;
    }
  };
  b2Simplex.prototype.GetMetric = function () {
    switch (this.m_count) {
      case 0:
        b2Settings.b2Assert(false);
        return 0;
      case 1:
        return 0;
      case 2:
        return b2Math.SubtractVV(this.m_v1.w, this.m_v2.w).Length();
      case 3:
        return b2Math.CrossVV(
          b2Math.SubtractVV(this.m_v2.w, this.m_v1.w),
          b2Math.SubtractVV(this.m_v3.w, this.m_v1.w)
        );
      default:
        b2Settings.b2Assert(false);
        return 0;
    }
  };
  b2Simplex.prototype.Solve2 = function () {
    var w1 = this.m_v1.w;
    var w2 = this.m_v2.w;
    var e12 = b2Math.SubtractVV(w2, w1);
    var d12_2 = -(w1.x * e12.x + w1.y * e12.y);
    if (d12_2 <= 0) {
      this.m_v1.a = 1;
      this.m_count = 1;
      return;
    }
    var d12_1 = w2.x * e12.x + w2.y * e12.y;
    if (d12_1 <= 0) {
      this.m_v2.a = 1;
      this.m_count = 1;
      this.m_v1.Set(this.m_v2);
      return;
    }
    var inv_d12 = 1 / (d12_1 + d12_2);
    this.m_v1.a = d12_1 * inv_d12;
    this.m_v2.a = d12_2 * inv_d12;
    this.m_count = 2;
  };
  b2Simplex.prototype.Solve3 = function () {
    var w1 = this.m_v1.w;
    var w2 = this.m_v2.w;
    var w3 = this.m_v3.w;
    var e12 = b2Math.SubtractVV(w2, w1);
    var w1e12 = b2Math.Dot(w1, e12);
    var w2e12 = b2Math.Dot(w2, e12);
    var d12_1 = w2e12;
    var d12_2 = -w1e12;
    var e13 = b2Math.SubtractVV(w3, w1);
    var w1e13 = b2Math.Dot(w1, e13);
    var w3e13 = b2Math.Dot(w3, e13);
    var d13_1 = w3e13;
    var d13_2 = -w1e13;
    var e23 = b2Math.SubtractVV(w3, w2);
    var w2e23 = b2Math.Dot(w2, e23);
    var w3e23 = b2Math.Dot(w3, e23);
    var d23_1 = w3e23;
    var d23_2 = -w2e23;
    var n123 = b2Math.CrossVV(e12, e13);
    var d123_1 = n123 * b2Math.CrossVV(w2, w3);
    var d123_2 = n123 * b2Math.CrossVV(w3, w1);
    var d123_3 = n123 * b2Math.CrossVV(w1, w2);
    if (d12_2 <= 0 && d13_2 <= 0) {
      this.m_v1.a = 1;
      this.m_count = 1;
      return;
    }
    if (d12_1 > 0 && d12_2 > 0 && d123_3 <= 0) {
      var inv_d12 = 1 / (d12_1 + d12_2);
      this.m_v1.a = d12_1 * inv_d12;
      this.m_v2.a = d12_2 * inv_d12;
      this.m_count = 2;
      return;
    }
    if (d13_1 > 0 && d13_2 > 0 && d123_2 <= 0) {
      var inv_d13 = 1 / (d13_1 + d13_2);
      this.m_v1.a = d13_1 * inv_d13;
      this.m_v3.a = d13_2 * inv_d13;
      this.m_count = 2;
      this.m_v2.Set(this.m_v3);
      return;
    }
    if (d12_1 <= 0 && d23_2 <= 0) {
      this.m_v2.a = 1;
      this.m_count = 1;
      this.m_v1.Set(this.m_v2);
      return;
    }
    if (d13_1 <= 0 && d23_1 <= 0) {
      this.m_v3.a = 1;
      this.m_count = 1;
      this.m_v1.Set(this.m_v3);
      return;
    }
    if (d23_1 > 0 && d23_2 > 0 && d123_1 <= 0) {
      var inv_d23 = 1 / (d23_1 + d23_2);
      this.m_v2.a = d23_1 * inv_d23;
      this.m_v3.a = d23_2 * inv_d23;
      this.m_count = 2;
      this.m_v1.Set(this.m_v3);
      return;
    }
    var inv_d123 = 1 / (d123_1 + d123_2 + d123_3);
    this.m_v1.a = d123_1 * inv_d123;
    this.m_v2.a = d123_2 * inv_d123;
    this.m_v3.a = d123_3 * inv_d123;
    this.m_count = 3;
  };
  b2SimplexCache.b2SimplexCache = function () {
    this.indexA = new Vector_a2j_Number(3);
    this.indexB = new Vector_a2j_Number(3);
  };
  b2SimplexVertex.b2SimplexVertex = function () {};
  b2SimplexVertex.prototype.Set = function (other) {
    this.wA.SetV(other.wA);
    this.wB.SetV(other.wB);
    this.w.SetV(other.w);
    this.a = other.a;
    this.indexA = other.indexA;
    this.indexB = other.indexB;
  };
  b2TimeOfImpact.b2TimeOfImpact = function () {};
  b2TimeOfImpact.TimeOfImpact = function (input) {
    ++b2TimeOfImpact.b2_toiCalls;
    var proxyA = input.proxyA;
    var proxyB = input.proxyB;
    var sweepA = input.sweepA;
    var sweepB = input.sweepB;
    b2Settings.b2Assert(sweepA.t0 == sweepB.t0);
    b2Settings.b2Assert(1 - sweepA.t0 > Number.MIN_VALUE);
    var radius = proxyA.m_radius + proxyB.m_radius;
    var tolerance = input.tolerance;
    var alpha = 0;
    var k_maxIterations = 1e3;
    var iter = 0;
    var target = 0;
    b2TimeOfImpact.s_cache.count = 0;
    b2TimeOfImpact.s_distanceInput.useRadii = false;
    for (;;) {
      sweepA.GetTransform(b2TimeOfImpact.s_xfA, alpha);
      sweepB.GetTransform(b2TimeOfImpact.s_xfB, alpha);
      b2TimeOfImpact.s_distanceInput.proxyA = proxyA;
      b2TimeOfImpact.s_distanceInput.proxyB = proxyB;
      b2TimeOfImpact.s_distanceInput.transformA = b2TimeOfImpact.s_xfA;
      b2TimeOfImpact.s_distanceInput.transformB = b2TimeOfImpact.s_xfB;
      b2Distance.Distance(
        b2TimeOfImpact.s_distanceOutput,
        b2TimeOfImpact.s_cache,
        b2TimeOfImpact.s_distanceInput
      );
      if (b2TimeOfImpact.s_distanceOutput.distance <= 0) {
        alpha = 1;
        break;
      }
      b2TimeOfImpact.s_fcn.Initialize(
        b2TimeOfImpact.s_cache,
        proxyA,
        b2TimeOfImpact.s_xfA,
        proxyB,
        b2TimeOfImpact.s_xfB
      );
      var separation = b2TimeOfImpact.s_fcn.Evaluate(
        b2TimeOfImpact.s_xfA,
        b2TimeOfImpact.s_xfB
      );
      if (separation <= 0) {
        alpha = 1;
        break;
      }
      if (iter == 0)
        if (separation > radius)
          target = b2Math.Max(radius - tolerance, 0.75 * radius);
        else target = b2Math.Max(separation - tolerance, 0.02 * radius);
      if (separation - target < 0.5 * tolerance) {
        if (iter == 0) {
          alpha = 1;
          break;
        }
        break;
      }
      var newAlpha = alpha;
      var x1 = alpha;
      var x2 = 1;
      var f1 = separation;
      sweepA.GetTransform(b2TimeOfImpact.s_xfA, x2);
      sweepB.GetTransform(b2TimeOfImpact.s_xfB, x2);
      var f2 = b2TimeOfImpact.s_fcn.Evaluate(
        b2TimeOfImpact.s_xfA,
        b2TimeOfImpact.s_xfB
      );
      if (f2 >= target) {
        alpha = 1;
        break;
      }
      var rootIterCount = 0;
      for (;;) {
        var x = 0;
        if (rootIterCount & 1) x = x1 + ((target - f1) * (x2 - x1)) / (f2 - f1);
        else x = 0.5 * (x1 + x2);
        sweepA.GetTransform(b2TimeOfImpact.s_xfA, x);
        sweepB.GetTransform(b2TimeOfImpact.s_xfB, x);
        var f = b2TimeOfImpact.s_fcn.Evaluate(
          b2TimeOfImpact.s_xfA,
          b2TimeOfImpact.s_xfB
        );
        if (b2Math.Abs(f - target) < 0.025 * tolerance) {
          newAlpha = x;
          break;
        }
        if (f > target) {
          x1 = x;
          f1 = f;
        } else {
          x2 = x;
          f2 = f;
        }
        ++rootIterCount;
        ++b2TimeOfImpact.b2_toiRootIters;
        if (rootIterCount == 50) break;
      }
      b2TimeOfImpact.b2_toiMaxRootIters = b2Math.Max(
        b2TimeOfImpact.b2_toiMaxRootIters,
        rootIterCount
      );
      if (newAlpha < (1 + 100 * Number.MIN_VALUE) * alpha) break;
      alpha = newAlpha;
      iter++;
      ++b2TimeOfImpact.b2_toiIters;
      if (iter == k_maxIterations) break;
    }
    b2TimeOfImpact.b2_toiMaxIters = b2Math.Max(
      b2TimeOfImpact.b2_toiMaxIters,
      iter
    );
    return alpha;
  };
  Box2D.postDefs.push(function () {
    Box2D.Collision.b2TimeOfImpact.b2_toiCalls = 0;
    Box2D.Collision.b2TimeOfImpact.b2_toiIters = 0;
    Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = 0;
    Box2D.Collision.b2TimeOfImpact.b2_toiRootIters = 0;
    Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = 0;
    Box2D.Collision.b2TimeOfImpact.s_cache = new b2SimplexCache();
    Box2D.Collision.b2TimeOfImpact.s_distanceInput = new b2DistanceInput();
    Box2D.Collision.b2TimeOfImpact.s_xfA = new b2Transform();
    Box2D.Collision.b2TimeOfImpact.s_xfB = new b2Transform();
    Box2D.Collision.b2TimeOfImpact.s_fcn = new b2SeparationFunction();
    Box2D.Collision.b2TimeOfImpact.s_distanceOutput = new b2DistanceOutput();
  });
  b2TOIInput.b2TOIInput = function () {
    this.proxyA = new b2DistanceProxy();
    this.proxyB = new b2DistanceProxy();
    this.sweepA = new b2Sweep();
    this.sweepB = new b2Sweep();
  };
  b2WorldManifold.b2WorldManifold = function () {
    this.m_normal = new b2Vec2();
  };
  b2WorldManifold.prototype.b2WorldManifold = function () {
    this.m_points = new Vector2(b2Settings.b2_maxManifoldPoints);
    for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++)
      this.m_points[i] = new b2Vec2();
  };
  b2WorldManifold.prototype.Initialize = function (
    manifold,
    xfA,
    radiusA,
    xfB,
    radiusB
  ) {
    if (radiusA === undefined) radiusA = 0;
    if (radiusB === undefined) radiusB = 0;
    if (manifold.m_pointCount == 0) return;
    var i = 0;
    var tVec;
    var tMat;
    var normalX = 0;
    var normalY = 0;
    var planePointX = 0;
    var planePointY = 0;
    var clipPointX = 0;
    var clipPointY = 0;
    switch (manifold.m_type) {
      case b2Manifold.e_circles:
        tMat = xfA.R;
        tVec = manifold.m_localPoint;
        var pointAX =
          xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        var pointAY =
          xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = xfB.R;
        tVec = manifold.m_points[0].m_localPoint;
        var pointBX =
          xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        var pointBY =
          xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        var dX = pointBX - pointAX;
        var dY = pointBY - pointAY;
        var d2 = dX * dX + dY * dY;
        if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
          var d = Math.sqrt(d2);
          this.m_normal.x = dX / d;
          this.m_normal.y = dY / d;
        } else {
          this.m_normal.x = 1;
          this.m_normal.y = 0;
        }
        var cAX = pointAX + radiusA * this.m_normal.x;
        var cAY = pointAY + radiusA * this.m_normal.y;
        var cBX = pointBX - radiusB * this.m_normal.x;
        var cBY = pointBY - radiusB * this.m_normal.y;
        this.m_points[0].x = 0.5 * (cAX + cBX);
        this.m_points[0].y = 0.5 * (cAY + cBY);
        break;
      case b2Manifold.e_faceA:
        tMat = xfA.R;
        tVec = manifold.m_localPlaneNormal;
        normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = xfA.R;
        tVec = manifold.m_localPoint;
        planePointX =
          xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        planePointY =
          xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        this.m_normal.x = normalX;
        this.m_normal.y = normalY;
        for (i = 0; i < manifold.m_pointCount; i++) {
          tMat = xfB.R;
          tVec = manifold.m_points[i].m_localPoint;
          clipPointX =
            xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
          clipPointY =
            xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
          this.m_points[i].x =
            clipPointX +
            0.5 *
              (radiusA -
                (clipPointX - planePointX) * normalX -
                (clipPointY - planePointY) * normalY -
                radiusB) *
              normalX;
          this.m_points[i].y =
            clipPointY +
            0.5 *
              (radiusA -
                (clipPointX - planePointX) * normalX -
                (clipPointY - planePointY) * normalY -
                radiusB) *
              normalY;
        }
        break;
      case b2Manifold.e_faceB:
        tMat = xfB.R;
        tVec = manifold.m_localPlaneNormal;
        normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = xfB.R;
        tVec = manifold.m_localPoint;
        planePointX =
          xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        planePointY =
          xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        this.m_normal.x = -normalX;
        this.m_normal.y = -normalY;
        for (i = 0; i < manifold.m_pointCount; i++) {
          tMat = xfA.R;
          tVec = manifold.m_points[i].m_localPoint;
          clipPointX =
            xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
          clipPointY =
            xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
          this.m_points[i].x =
            clipPointX +
            0.5 *
              (radiusB -
                (clipPointX - planePointX) * normalX -
                (clipPointY - planePointY) * normalY -
                radiusA) *
              normalX;
          this.m_points[i].y =
            clipPointY +
            0.5 *
              (radiusB -
                (clipPointX - planePointX) * normalX -
                (clipPointY - planePointY) * normalY -
                radiusA) *
              normalY;
        }
        break;
    }
  };
  ClipVertex.ClipVertex = function () {
    this.v = new b2Vec2();
    this.id = new b2ContactID();
  };
  ClipVertex.prototype.Set = function (other) {
    this.v.SetV(other.v);
    this.id.Set(other.id);
  };
  Features.Features = function () {};
  Object.defineProperty(Features.prototype, "referenceEdge", {
    enumerable: false,
    configurable: true,
    get: function () {
      return this._referenceEdge;
    },
  });
  Object.defineProperty(Features.prototype, "referenceEdge", {
    enumerable: false,
    configurable: true,
    set: function (value) {
      if (value === undefined) value = 0;
      this._referenceEdge = value;
      this._m_id._key =
        (this._m_id._key & 4294967040) | (this._referenceEdge & 255);
    },
  });
  Object.defineProperty(Features.prototype, "incidentEdge", {
    enumerable: false,
    configurable: true,
    get: function () {
      return this._incidentEdge;
    },
  });
  Object.defineProperty(Features.prototype, "incidentEdge", {
    enumerable: false,
    configurable: true,
    set: function (value) {
      if (value === undefined) value = 0;
      this._incidentEdge = value;
      this._m_id._key =
        (this._m_id._key & 4294902015) | ((this._incidentEdge << 8) & 65280);
    },
  });
  Object.defineProperty(Features.prototype, "incidentVertex", {
    enumerable: false,
    configurable: true,
    get: function () {
      return this._incidentVertex;
    },
  });
  Object.defineProperty(Features.prototype, "incidentVertex", {
    enumerable: false,
    configurable: true,
    set: function (value) {
      if (value === undefined) value = 0;
      this._incidentVertex = value;
      this._m_id._key =
        (this._m_id._key & 4278255615) |
        ((this._incidentVertex << 16) & 16711680);
    },
  });
  Object.defineProperty(Features.prototype, "flip", {
    enumerable: false,
    configurable: true,
    get: function () {
      return this._flip;
    },
  });
  Object.defineProperty(Features.prototype, "flip", {
    enumerable: false,
    configurable: true,
    set: function (value) {
      if (value === undefined) value = 0;
      this._flip = value;
      this._m_id._key =
        (this._m_id._key & 16777215) | ((this._flip << 24) & 4278190080);
    },
  });
})();
(function () {
  var b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2Shape = Box2D.Collision.Shapes.b2Shape,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3,
    b2Body = Box2D.Dynamics.b2Body,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
    b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2ContactManager = Box2D.Dynamics.b2ContactManager,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
    b2FilterData = Box2D.Dynamics.b2FilterData,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Island = Box2D.Dynamics.b2Island,
    b2TimeStep = Box2D.Dynamics.b2TimeStep,
    b2World = Box2D.Dynamics.b2World,
    b2AABB = Box2D.Collision.b2AABB,
    b2Bound = Box2D.Collision.b2Bound,
    b2BoundValues = Box2D.Collision.b2BoundValues,
    b2Collision = Box2D.Collision.b2Collision,
    b2ContactID = Box2D.Collision.b2ContactID,
    b2ContactPoint = Box2D.Collision.b2ContactPoint,
    b2Distance = Box2D.Collision.b2Distance,
    b2DistanceInput = Box2D.Collision.b2DistanceInput,
    b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
    b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
    b2DynamicTree = Box2D.Collision.b2DynamicTree,
    b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
    b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
    b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
    b2Manifold = Box2D.Collision.b2Manifold,
    b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
    b2Point = Box2D.Collision.b2Point,
    b2RayCastInput = Box2D.Collision.b2RayCastInput,
    b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
    b2Segment = Box2D.Collision.b2Segment,
    b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
    b2Simplex = Box2D.Collision.b2Simplex,
    b2SimplexCache = Box2D.Collision.b2SimplexCache,
    b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
    b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
    b2TOIInput = Box2D.Collision.b2TOIInput,
    b2WorldManifold = Box2D.Collision.b2WorldManifold,
    ClipVertex = Box2D.Collision.ClipVertex,
    Features = Box2D.Collision.Features,
    IBroadPhase = Box2D.Collision.IBroadPhase;
  Box2D.inherit(b2CircleShape, Box2D.Collision.Shapes.b2Shape);
  b2CircleShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
  b2CircleShape.b2CircleShape = function () {
    Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
    this.m_p = new b2Vec2();
  };
  b2CircleShape.prototype.Copy = function () {
    var s = new b2CircleShape();
    s.Set(this);
    return s;
  };
  b2CircleShape.prototype.Set = function (other) {
    this.__super.Set.call(this, other);
    if (Box2D.is(other, b2CircleShape)) {
      var other2 = other instanceof b2CircleShape ? other : null;
      this.m_p.SetV(other2.m_p);
    }
  };
  b2CircleShape.prototype.TestPoint = function (transform, p) {
    var tMat = transform.R;
    var dX =
      transform.position.x +
      (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
    var dY =
      transform.position.y +
      (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
    dX = p.x - dX;
    dY = p.y - dY;
    return dX * dX + dY * dY <= this.m_radius * this.m_radius;
  };
  b2CircleShape.prototype.RayCast = function (output, input, transform) {
    var tMat = transform.R;
    var positionX =
      transform.position.x +
      (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
    var positionY =
      transform.position.y +
      (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
    var sX = input.p1.x - positionX;
    var sY = input.p1.y - positionY;
    var b = sX * sX + sY * sY - this.m_radius * this.m_radius;
    var rX = input.p2.x - input.p1.x;
    var rY = input.p2.y - input.p1.y;
    var c = sX * rX + sY * rY;
    var rr = rX * rX + rY * rY;
    var sigma = c * c - rr * b;
    if (sigma < 0 || rr < Number.MIN_VALUE) return false;
    var a = -(c + Math.sqrt(sigma));
    if (0 <= a && a <= input.maxFraction * rr) {
      a /= rr;
      output.fraction = a;
      output.normal.x = sX + a * rX;
      output.normal.y = sY + a * rY;
      output.normal.Normalize();
      return true;
    }
    return false;
  };
  b2CircleShape.prototype.ComputeAABB = function (aabb, transform) {
    var tMat = transform.R;
    var pX =
      transform.position.x +
      (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
    var pY =
      transform.position.y +
      (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
    aabb.lowerBound.Set(pX - this.m_radius, pY - this.m_radius);
    aabb.upperBound.Set(pX + this.m_radius, pY + this.m_radius);
  };
  b2CircleShape.prototype.ComputeMass = function (massData, density) {
    if (density === undefined) density = 0;
    massData.mass = density * b2Settings.b2_pi * this.m_radius * this.m_radius;
    massData.center.SetV(this.m_p);
    massData.I =
      massData.mass *
      (0.5 * this.m_radius * this.m_radius +
        (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
  };
  b2CircleShape.prototype.ComputeSubmergedArea = function (
    normal,
    offset,
    xf,
    c
  ) {
    if (offset === undefined) offset = 0;
    var p = b2Math.MulX(xf, this.m_p);
    var l = -(b2Math.Dot(normal, p) - offset);
    if (l < -this.m_radius + Number.MIN_VALUE) return 0;
    if (l > this.m_radius) {
      c.SetV(p);
      return Math.PI * this.m_radius * this.m_radius;
    }
    var r2 = this.m_radius * this.m_radius;
    var l2 = l * l;
    var area =
      r2 * (Math.asin(l / this.m_radius) + Math.PI / 2) +
      l * Math.sqrt(r2 - l2);
    var com = ((-2 / 3) * Math.pow(r2 - l2, 1.5)) / area;
    c.x = p.x + normal.x * com;
    c.y = p.y + normal.y * com;
    return area;
  };
  b2CircleShape.prototype.GetLocalPosition = function () {
    return this.m_p;
  };
  b2CircleShape.prototype.SetLocalPosition = function (position) {
    this.m_p.SetV(position);
  };
  b2CircleShape.prototype.GetRadius = function () {
    return this.m_radius;
  };
  b2CircleShape.prototype.SetRadius = function (radius) {
    if (radius === undefined) radius = 0;
    this.m_radius = radius;
  };
  b2CircleShape.prototype.b2CircleShape = function (radius) {
    if (radius === undefined) radius = 0;
    this.__super.b2Shape.call(this);
    this.m_type = b2Shape.e_circleShape;
    this.m_radius = radius;
  };
  b2EdgeChainDef.b2EdgeChainDef = function () {};
  b2EdgeChainDef.prototype.b2EdgeChainDef = function () {
    this.vertexCount = 0;
    this.isALoop = true;
    this.vertices = [];
  };
  Box2D.inherit(b2EdgeShape, Box2D.Collision.Shapes.b2Shape);
  b2EdgeShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
  b2EdgeShape.b2EdgeShape = function () {
    Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
    this.s_supportVec = new b2Vec2();
    this.m_v1 = new b2Vec2();
    this.m_v2 = new b2Vec2();
    this.m_coreV1 = new b2Vec2();
    this.m_coreV2 = new b2Vec2();
    this.m_normal = new b2Vec2();
    this.m_direction = new b2Vec2();
    this.m_cornerDir1 = new b2Vec2();
    this.m_cornerDir2 = new b2Vec2();
  };
  b2EdgeShape.prototype.TestPoint = function (transform, p) {
    return false;
  };
  b2EdgeShape.prototype.RayCast = function (output, input, transform) {
    var tMat;
    var rX = input.p2.x - input.p1.x;
    var rY = input.p2.y - input.p1.y;
    tMat = transform.R;
    var v1X =
      transform.position.x +
      (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
    var v1Y =
      transform.position.y +
      (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
    var nX =
      transform.position.y +
      (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y) -
      v1Y;
    var nY = -(
      transform.position.x +
      (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y) -
      v1X
    );
    var k_slop = 100 * Number.MIN_VALUE;
    var denom = -(rX * nX + rY * nY);
    if (denom > k_slop) {
      var bX = input.p1.x - v1X;
      var bY = input.p1.y - v1Y;
      var a = bX * nX + bY * nY;
      if (0 <= a && a <= input.maxFraction * denom) {
        var mu2 = -rX * bY + rY * bX;
        if (-k_slop * denom <= mu2 && mu2 <= denom * (1 + k_slop)) {
          a /= denom;
          output.fraction = a;
          var nLen = Math.sqrt(nX * nX + nY * nY);
          output.normal.x = nX / nLen;
          output.normal.y = nY / nLen;
          return true;
        }
      }
    }
    return false;
  };
  b2EdgeShape.prototype.ComputeAABB = function (aabb, transform) {
    var tMat = transform.R;
    var v1X =
      transform.position.x +
      (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
    var v1Y =
      transform.position.y +
      (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
    var v2X =
      transform.position.x +
      (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y);
    var v2Y =
      transform.position.y +
      (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
    if (v1X < v2X) {
      aabb.lowerBound.x = v1X;
      aabb.upperBound.x = v2X;
    } else {
      aabb.lowerBound.x = v2X;
      aabb.upperBound.x = v1X;
    }
    if (v1Y < v2Y) {
      aabb.lowerBound.y = v1Y;
      aabb.upperBound.y = v2Y;
    } else {
      aabb.lowerBound.y = v2Y;
      aabb.upperBound.y = v1Y;
    }
  };
  b2EdgeShape.prototype.ComputeMass = function (massData, density) {
    if (density === undefined) density = 0;
    massData.mass = 0;
    massData.center.SetV(this.m_v1);
    massData.I = 0;
  };
  b2EdgeShape.prototype.ComputeSubmergedArea = function (
    normal,
    offset,
    xf,
    c
  ) {
    if (offset === undefined) offset = 0;
    var v0 = new b2Vec2(normal.x * offset, normal.y * offset);
    var v1 = b2Math.MulX(xf, this.m_v1);
    var v2 = b2Math.MulX(xf, this.m_v2);
    var d1 = b2Math.Dot(normal, v1) - offset;
    var d2 = b2Math.Dot(normal, v2) - offset;
    if (d1 > 0)
      if (d2 > 0) return 0;
      else {
        v1.x = (-d2 / (d1 - d2)) * v1.x + (d1 / (d1 - d2)) * v2.x;
        v1.y = (-d2 / (d1 - d2)) * v1.y + (d1 / (d1 - d2)) * v2.y;
      }
    else if (d2 > 0) {
      v2.x = (-d2 / (d1 - d2)) * v1.x + (d1 / (d1 - d2)) * v2.x;
      v2.y = (-d2 / (d1 - d2)) * v1.y + (d1 / (d1 - d2)) * v2.y;
    } else;
    c.x = (v0.x + v1.x + v2.x) / 3;
    c.y = (v0.y + v1.y + v2.y) / 3;
    return (
      0.5 * ((v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x))
    );
  };
  b2EdgeShape.prototype.GetLength = function () {
    return this.m_length;
  };
  b2EdgeShape.prototype.GetVertex1 = function () {
    return this.m_v1;
  };
  b2EdgeShape.prototype.GetVertex2 = function () {
    return this.m_v2;
  };
  b2EdgeShape.prototype.GetCoreVertex1 = function () {
    return this.m_coreV1;
  };
  b2EdgeShape.prototype.GetCoreVertex2 = function () {
    return this.m_coreV2;
  };
  b2EdgeShape.prototype.GetNormalVector = function () {
    return this.m_normal;
  };
  b2EdgeShape.prototype.GetDirectionVector = function () {
    return this.m_direction;
  };
  b2EdgeShape.prototype.GetCorner1Vector = function () {
    return this.m_cornerDir1;
  };
  b2EdgeShape.prototype.GetCorner2Vector = function () {
    return this.m_cornerDir2;
  };
  b2EdgeShape.prototype.Corner1IsConvex = function () {
    return this.m_cornerConvex1;
  };
  b2EdgeShape.prototype.Corner2IsConvex = function () {
    return this.m_cornerConvex2;
  };
  b2EdgeShape.prototype.GetFirstVertex = function (xf) {
    var tMat = xf.R;
    return new b2Vec2(
      xf.position.x +
        (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y),
      xf.position.y +
        (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y)
    );
  };
  b2EdgeShape.prototype.GetNextEdge = function () {
    return this.m_nextEdge;
  };
  b2EdgeShape.prototype.GetPrevEdge = function () {
    return this.m_prevEdge;
  };
  b2EdgeShape.prototype.Support = function (xf, dX, dY) {
    if (dX === undefined) dX = 0;
    if (dY === undefined) dY = 0;
    var tMat = xf.R;
    var v1X =
      xf.position.x +
      (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y);
    var v1Y =
      xf.position.y +
      (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y);
    var v2X =
      xf.position.x +
      (tMat.col1.x * this.m_coreV2.x + tMat.col2.x * this.m_coreV2.y);
    var v2Y =
      xf.position.y +
      (tMat.col1.y * this.m_coreV2.x + tMat.col2.y * this.m_coreV2.y);
    if (v1X * dX + v1Y * dY > v2X * dX + v2Y * dY) {
      this.s_supportVec.x = v1X;
      this.s_supportVec.y = v1Y;
    } else {
      this.s_supportVec.x = v2X;
      this.s_supportVec.y = v2Y;
    }
    return this.s_supportVec;
  };
  b2EdgeShape.prototype.b2EdgeShape = function (v1, v2) {
    this.__super.b2Shape.call(this);
    this.m_type = b2Shape.e_edgeShape;
    this.m_prevEdge = null;
    this.m_nextEdge = null;
    this.m_v1 = v1;
    this.m_v2 = v2;
    this.m_direction.Set(this.m_v2.x - this.m_v1.x, this.m_v2.y - this.m_v1.y);
    this.m_length = this.m_direction.Normalize();
    this.m_normal.Set(this.m_direction.y, -this.m_direction.x);
    this.m_coreV1.Set(
      -b2Settings.b2_toiSlop * (this.m_normal.x - this.m_direction.x) +
        this.m_v1.x,
      -b2Settings.b2_toiSlop * (this.m_normal.y - this.m_direction.y) +
        this.m_v1.y
    );
    this.m_coreV2.Set(
      -b2Settings.b2_toiSlop * (this.m_normal.x + this.m_direction.x) +
        this.m_v2.x,
      -b2Settings.b2_toiSlop * (this.m_normal.y + this.m_direction.y) +
        this.m_v2.y
    );
    this.m_cornerDir1 = this.m_normal;
    this.m_cornerDir2.Set(-this.m_normal.x, -this.m_normal.y);
  };
  b2EdgeShape.prototype.SetPrevEdge = function (edge, core, cornerDir, convex) {
    this.m_prevEdge = edge;
    this.m_coreV1 = core;
    this.m_cornerDir1 = cornerDir;
    this.m_cornerConvex1 = convex;
  };
  b2EdgeShape.prototype.SetNextEdge = function (edge, core, cornerDir, convex) {
    this.m_nextEdge = edge;
    this.m_coreV2 = core;
    this.m_cornerDir2 = cornerDir;
    this.m_cornerConvex2 = convex;
  };
  b2MassData.b2MassData = function () {
    this.mass = 0;
    this.center = new b2Vec2(0, 0);
    this.I = 0;
  };
  Box2D.inherit(b2PolygonShape, Box2D.Collision.Shapes.b2Shape);
  b2PolygonShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
  b2PolygonShape.b2PolygonShape = function () {
    Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
  };
  b2PolygonShape.prototype.Copy = function () {
    var s = new b2PolygonShape();
    s.Set(this);
    return s;
  };
  b2PolygonShape.prototype.Set = function (other) {
    this.__super.Set.call(this, other);
    if (Box2D.is(other, b2PolygonShape)) {
      var other2 = other instanceof b2PolygonShape ? other : null;
      this.m_centroid.SetV(other2.m_centroid);
      this.m_vertexCount = other2.m_vertexCount;
      this.Reserve(this.m_vertexCount);
      for (var i = 0; i < this.m_vertexCount; i++) {
        this.m_vertices[i].SetV(other2.m_vertices[i]);
        this.m_normals[i].SetV(other2.m_normals[i]);
      }
    }
  };
  b2PolygonShape.prototype.SetAsArray = function (vertices, vertexCount) {
    if (vertexCount === undefined) vertexCount = 0;
    var v = new Vector2();
    var i = 0,
      tVec;
    for (i = 0; i < vertices.length; ++i) {
      tVec = vertices[i];
      v.push(tVec);
    }
    this.SetAsVector(v, vertexCount);
  };
  b2PolygonShape.AsArray = function (vertices, vertexCount) {
    if (vertexCount === undefined) vertexCount = 0;
    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsArray(vertices, vertexCount);
    return polygonShape;
  };
  b2PolygonShape.prototype.SetAsVector = function (vertices, vertexCount) {
    if (vertexCount === undefined) vertexCount = 0;
    if (vertexCount == 0) vertexCount = vertices.length;
    b2Settings.b2Assert(2 <= vertexCount);
    this.m_vertexCount = vertexCount;
    this.Reserve(vertexCount);
    var i = 0;
    for (i = 0; i < this.m_vertexCount; i++)
      this.m_vertices[i].SetV(vertices[i]);
    for (i = 0; i < this.m_vertexCount; ++i) {
      var i1 = parseInt(i);
      var i2 = parseInt(i + 1 < this.m_vertexCount ? i + 1 : 0);
      var edge = b2Math.SubtractVV(this.m_vertices[i2], this.m_vertices[i1]);
      b2Settings.b2Assert(edge.LengthSquared() > Number.MIN_VALUE);
      this.m_normals[i].SetV(b2Math.CrossVF(edge, 1));
      this.m_normals[i].Normalize();
    }
    this.m_centroid = b2PolygonShape.ComputeCentroid(
      this.m_vertices,
      this.m_vertexCount
    );
  };
  b2PolygonShape.AsVector = function (vertices, vertexCount) {
    if (vertexCount === undefined) vertexCount = 0;
    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsVector(vertices, vertexCount);
    return polygonShape;
  };
  b2PolygonShape.prototype.SetAsBox = function (hx, hy) {
    if (hx === undefined) hx = 0;
    if (hy === undefined) hy = 0;
    this.m_vertexCount = 4;
    this.Reserve(4);
    this.m_vertices[0].Set(-hx, -hy);
    this.m_vertices[1].Set(hx, -hy);
    this.m_vertices[2].Set(hx, hy);
    this.m_vertices[3].Set(-hx, hy);
    this.m_normals[0].Set(0, -1);
    this.m_normals[1].Set(1, 0);
    this.m_normals[2].Set(0, 1);
    this.m_normals[3].Set(-1, 0);
    this.m_centroid.SetZero();
  };
  b2PolygonShape.AsBox = function (hx, hy) {
    if (hx === undefined) hx = 0;
    if (hy === undefined) hy = 0;
    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsBox(hx, hy);
    return polygonShape;
  };
  b2PolygonShape.prototype.SetAsOrientedBox = function (hx, hy, center, angle) {
    if (hx === undefined) hx = 0;
    if (hy === undefined) hy = 0;
    if (center === undefined) center = null;
    if (angle === undefined) angle = 0;
    this.m_vertexCount = 4;
    this.Reserve(4);
    this.m_vertices[0].Set(-hx, -hy);
    this.m_vertices[1].Set(hx, -hy);
    this.m_vertices[2].Set(hx, hy);
    this.m_vertices[3].Set(-hx, hy);
    this.m_normals[0].Set(0, -1);
    this.m_normals[1].Set(1, 0);
    this.m_normals[2].Set(0, 1);
    this.m_normals[3].Set(-1, 0);
    this.m_centroid = center;
    var xf = new b2Transform();
    xf.position = center;
    xf.R.Set(angle);
    for (var i = 0; i < this.m_vertexCount; ++i) {
      this.m_vertices[i] = b2Math.MulX(xf, this.m_vertices[i]);
      this.m_normals[i] = b2Math.MulMV(xf.R, this.m_normals[i]);
    }
  };
  b2PolygonShape.AsOrientedBox = function (hx, hy, center, angle) {
    if (hx === undefined) hx = 0;
    if (hy === undefined) hy = 0;
    if (center === undefined) center = null;
    if (angle === undefined) angle = 0;
    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsOrientedBox(hx, hy, center, angle);
    return polygonShape;
  };
  b2PolygonShape.prototype.SetAsEdge = function (v1, v2) {
    this.m_vertexCount = 2;
    this.Reserve(2);
    this.m_vertices[0].SetV(v1);
    this.m_vertices[1].SetV(v2);
    this.m_centroid.x = 0.5 * (v1.x + v2.x);
    this.m_centroid.y = 0.5 * (v1.y + v2.y);
    this.m_normals[0] = b2Math.CrossVF(b2Math.SubtractVV(v2, v1), 1);
    this.m_normals[0].Normalize();
    this.m_normals[1].x = -this.m_normals[0].x;
    this.m_normals[1].y = -this.m_normals[0].y;
  };
  b2PolygonShape.AsEdge = function (v1, v2) {
    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsEdge(v1, v2);
    return polygonShape;
  };
  b2PolygonShape.prototype.TestPoint = function (xf, p) {
    var tVec;
    var tMat = xf.R;
    var tX = p.x - xf.position.x;
    var tY = p.y - xf.position.y;
    var pLocalX = tX * tMat.col1.x + tY * tMat.col1.y;
    var pLocalY = tX * tMat.col2.x + tY * tMat.col2.y;
    for (var i = 0; i < this.m_vertexCount; ++i) {
      tVec = this.m_vertices[i];
      tX = pLocalX - tVec.x;
      tY = pLocalY - tVec.y;
      tVec = this.m_normals[i];
      var dot = tVec.x * tX + tVec.y * tY;
      if (dot > 0) return false;
    }
    return true;
  };
  b2PolygonShape.prototype.RayCast = function (output, input, transform) {
    var lower = 0;
    var upper = input.maxFraction;
    var tX = 0;
    var tY = 0;
    var tMat;
    var tVec;
    tX = input.p1.x - transform.position.x;
    tY = input.p1.y - transform.position.y;
    tMat = transform.R;
    var p1X = tX * tMat.col1.x + tY * tMat.col1.y;
    var p1Y = tX * tMat.col2.x + tY * tMat.col2.y;
    tX = input.p2.x - transform.position.x;
    tY = input.p2.y - transform.position.y;
    tMat = transform.R;
    var p2X = tX * tMat.col1.x + tY * tMat.col1.y;
    var p2Y = tX * tMat.col2.x + tY * tMat.col2.y;
    var dX = p2X - p1X;
    var dY = p2Y - p1Y;
    var index = parseInt(-1);
    for (var i = 0; i < this.m_vertexCount; ++i) {
      tVec = this.m_vertices[i];
      tX = tVec.x - p1X;
      tY = tVec.y - p1Y;
      tVec = this.m_normals[i];
      var numerator = tVec.x * tX + tVec.y * tY;
      var denominator = tVec.x * dX + tVec.y * dY;
      if (denominator == 0) {
        if (numerator < 0) return false;
      } else if (denominator < 0 && numerator < lower * denominator) {
        lower = numerator / denominator;
        index = i;
      } else if (denominator > 0 && numerator < upper * denominator)
        upper = numerator / denominator;
      if (upper < lower - Number.MIN_VALUE) return false;
    }
    if (index >= 0) {
      output.fraction = lower;
      tMat = transform.R;
      tVec = this.m_normals[index];
      output.normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
      output.normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
      return true;
    }
    return false;
  };
  b2PolygonShape.prototype.ComputeAABB = function (aabb, xf) {
    var tMat = xf.R;
    var tVec = this.m_vertices[0];
    var lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    var lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    var upperX = lowerX;
    var upperY = lowerY;
    for (var i = 1; i < this.m_vertexCount; ++i) {
      tVec = this.m_vertices[i];
      var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      lowerX = lowerX < vX ? lowerX : vX;
      lowerY = lowerY < vY ? lowerY : vY;
      upperX = upperX > vX ? upperX : vX;
      upperY = upperY > vY ? upperY : vY;
    }
    aabb.lowerBound.x = lowerX - this.m_radius;
    aabb.lowerBound.y = lowerY - this.m_radius;
    aabb.upperBound.x = upperX + this.m_radius;
    aabb.upperBound.y = upperY + this.m_radius;
  };
  b2PolygonShape.prototype.ComputeMass = function (massData, density) {
    if (density === undefined) density = 0;
    if (this.m_vertexCount == 2) {
      massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
      massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
      massData.mass = 0;
      massData.I = 0;
      return;
    }
    var centerX = 0;
    var centerY = 0;
    var area = 0;
    var I = 0;
    var p1X = 0;
    var p1Y = 0;
    var k_inv3 = 1 / 3;
    for (var i = 0; i < this.m_vertexCount; ++i) {
      var p2 = this.m_vertices[i];
      var p3 =
        i + 1 < this.m_vertexCount
          ? this.m_vertices[parseInt(i + 1)]
          : this.m_vertices[0];
      var e1X = p2.x - p1X;
      var e1Y = p2.y - p1Y;
      var e2X = p3.x - p1X;
      var e2Y = p3.y - p1Y;
      var D = e1X * e2Y - e1Y * e2X;
      var triangleArea = 0.5 * D;
      area += triangleArea;
      centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
      centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
      var px = p1X;
      var py = p1Y;
      var ex1 = e1X;
      var ey1 = e1Y;
      var ex2 = e2X;
      var ey2 = e2Y;
      var intx2 =
        k_inv3 *
          (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) +
        0.5 * px * px;
      var inty2 =
        k_inv3 *
          (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) +
        0.5 * py * py;
      I += D * (intx2 + inty2);
    }
    massData.mass = density * area;
    centerX *= 1 / area;
    centerY *= 1 / area;
    massData.center.Set(centerX, centerY);
    massData.I = density * I;
  };
  b2PolygonShape.prototype.ComputeSubmergedArea = function (
    normal,
    offset,
    xf,
    c
  ) {
    if (offset === undefined) offset = 0;
    var normalL = b2Math.MulTMV(xf.R, normal);
    var offsetL = offset - b2Math.Dot(normal, xf.position);
    var depths = new Vector_a2j_Number();
    var diveCount = 0;
    var intoIndex = parseInt(-1);
    var outoIndex = parseInt(-1);
    var lastSubmerged = false;
    var i = 0;
    for (i = 0; i < this.m_vertexCount; ++i) {
      depths[i] = b2Math.Dot(normalL, this.m_vertices[i]) - offsetL;
      var isSubmerged = depths[i] < -Number.MIN_VALUE;
      if (i > 0)
        if (isSubmerged) {
          if (!lastSubmerged) {
            intoIndex = i - 1;
            diveCount++;
          }
        } else if (lastSubmerged) {
          outoIndex = i - 1;
          diveCount++;
        }
      lastSubmerged = isSubmerged;
    }
    switch (diveCount) {
      case 0:
        if (lastSubmerged) {
          var md = new b2MassData();
          this.ComputeMass(md, 1);
          c.SetV(b2Math.MulX(xf, md.center));
          return md.mass;
        } else return 0;
        break;
      case 1:
        if (intoIndex == -1) intoIndex = this.m_vertexCount - 1;
        else outoIndex = this.m_vertexCount - 1;
        break;
    }
    var intoIndex2 = parseInt((intoIndex + 1) % this.m_vertexCount);
    var outoIndex2 = parseInt((outoIndex + 1) % this.m_vertexCount);
    var intoLamdda =
      (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
    var outoLamdda =
      (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
    var intoVec = new b2Vec2(
      this.m_vertices[intoIndex].x * (1 - intoLamdda) +
        this.m_vertices[intoIndex2].x * intoLamdda,
      this.m_vertices[intoIndex].y * (1 - intoLamdda) +
        this.m_vertices[intoIndex2].y * intoLamdda
    );
    var outoVec = new b2Vec2(
      this.m_vertices[outoIndex].x * (1 - outoLamdda) +
        this.m_vertices[outoIndex2].x * outoLamdda,
      this.m_vertices[outoIndex].y * (1 - outoLamdda) +
        this.m_vertices[outoIndex2].y * outoLamdda
    );
    var area = 0;
    var center = new b2Vec2();
    var p2 = this.m_vertices[intoIndex2];
    var p3;
    i = intoIndex2;
    while (i != outoIndex2) {
      i = (i + 1) % this.m_vertexCount;
      if (i == outoIndex2) p3 = outoVec;
      else p3 = this.m_vertices[i];
      var triangleArea =
        0.5 *
        ((p2.x - intoVec.x) * (p3.y - intoVec.y) -
          (p2.y - intoVec.y) * (p3.x - intoVec.x));
      area += triangleArea;
      center.x += (triangleArea * (intoVec.x + p2.x + p3.x)) / 3;
      center.y += (triangleArea * (intoVec.y + p2.y + p3.y)) / 3;
      p2 = p3;
    }
    center.Multiply(1 / area);
    c.SetV(b2Math.MulX(xf, center));
    return area;
  };
  b2PolygonShape.prototype.GetVertexCount = function () {
    return this.m_vertexCount;
  };
  b2PolygonShape.prototype.GetVertices = function () {
    return this.m_vertices;
  };
  b2PolygonShape.prototype.GetNormals = function () {
    return this.m_normals;
  };
  b2PolygonShape.prototype.GetSupport = function (d) {
    var bestIndex = 0;
    var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
    for (var i = 1; i < this.m_vertexCount; ++i) {
      var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
      if (value > bestValue) {
        bestIndex = i;
        bestValue = value;
      }
    }
    return bestIndex;
  };
  b2PolygonShape.prototype.GetSupportVertex = function (d) {
    var bestIndex = 0;
    var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
    for (var i = 1; i < this.m_vertexCount; ++i) {
      var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
      if (value > bestValue) {
        bestIndex = i;
        bestValue = value;
      }
    }
    return this.m_vertices[bestIndex];
  };
  b2PolygonShape.prototype.Validate = function () {
    return false;
  };
  b2PolygonShape.prototype.b2PolygonShape = function () {
    this.__super.b2Shape.call(this);
    this.m_type = b2Shape.e_polygonShape;
    this.m_centroid = new b2Vec2();
    this.m_vertices = new Vector2();
    this.m_normals = new Vector2();
  };
  b2PolygonShape.prototype.Reserve = function (count) {
    if (count === undefined) count = 0;
    for (var i = parseInt(this.m_vertices.length); i < count; i++) {
      this.m_vertices[i] = new b2Vec2();
      this.m_normals[i] = new b2Vec2();
    }
  };
  b2PolygonShape.ComputeCentroid = function (vs, count) {
    if (count === undefined) count = 0;
    var c = new b2Vec2();
    var area = 0;
    var p1X = 0;
    var p1Y = 0;
    var inv3 = 1 / 3;
    for (var i = 0; i < count; ++i) {
      var p2 = vs[i];
      var p3 = i + 1 < count ? vs[parseInt(i + 1)] : vs[0];
      var e1X = p2.x - p1X;
      var e1Y = p2.y - p1Y;
      var e2X = p3.x - p1X;
      var e2Y = p3.y - p1Y;
      var D = e1X * e2Y - e1Y * e2X;
      var triangleArea = 0.5 * D;
      area += triangleArea;
      c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
      c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
    }
    c.x *= 1 / area;
    c.y *= 1 / area;
    return c;
  };
  b2PolygonShape.ComputeOBB = function (obb, vs, count) {
    if (count === undefined) count = 0;
    var i = 0;
    var p = new Vector2(count + 1);
    for (i = 0; i < count; ++i) p[i] = vs[i];
    p[count] = p[0];
    var minArea = Number.MAX_VALUE;
    for (i = 1; i <= count; ++i) {
      var root = p[parseInt(i - 1)];
      var uxX = p[i].x - root.x;
      var uxY = p[i].y - root.y;
      var length = Math.sqrt(uxX * uxX + uxY * uxY);
      uxX /= length;
      uxY /= length;
      var uyX = -uxY;
      var uyY = uxX;
      var lowerX = Number.MAX_VALUE;
      var lowerY = Number.MAX_VALUE;
      var upperX = -Number.MAX_VALUE;
      var upperY = -Number.MAX_VALUE;
      for (var j = 0; j < count; ++j) {
        var dX = p[j].x - root.x;
        var dY = p[j].y - root.y;
        var rX = uxX * dX + uxY * dY;
        var rY = uyX * dX + uyY * dY;
        if (rX < lowerX) lowerX = rX;
        if (rY < lowerY) lowerY = rY;
        if (rX > upperX) upperX = rX;
        if (rY > upperY) upperY = rY;
      }
      var area = (upperX - lowerX) * (upperY - lowerY);
      if (area < 0.95 * minArea) {
        minArea = area;
        obb.R.col1.x = uxX;
        obb.R.col1.y = uxY;
        obb.R.col2.x = uyX;
        obb.R.col2.y = uyY;
        var centerX = 0.5 * (lowerX + upperX);
        var centerY = 0.5 * (lowerY + upperY);
        var tMat = obb.R;
        obb.center.x = root.x + (tMat.col1.x * centerX + tMat.col2.x * centerY);
        obb.center.y = root.y + (tMat.col1.y * centerX + tMat.col2.y * centerY);
        obb.extents.x = 0.5 * (upperX - lowerX);
        obb.extents.y = 0.5 * (upperY - lowerY);
      }
    }
  };
  Box2D.postDefs.push(function () {
    Box2D.Collision.Shapes.b2PolygonShape.s_mat = new b2Mat22();
  });
  b2Shape.b2Shape = function () {};
  b2Shape.prototype.Copy = function () {
    return null;
  };
  b2Shape.prototype.Set = function (other) {
    this.m_radius = other.m_radius;
  };
  b2Shape.prototype.GetType = function () {
    return this.m_type;
  };
  b2Shape.prototype.TestPoint = function (xf, p) {
    return false;
  };
  b2Shape.prototype.RayCast = function (output, input, transform) {
    return false;
  };
  b2Shape.prototype.ComputeAABB = function (aabb, xf) {};
  b2Shape.prototype.ComputeMass = function (massData, density) {
    if (density === undefined) density = 0;
  };
  b2Shape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
    if (offset === undefined) offset = 0;
    return 0;
  };
  b2Shape.TestOverlap = function (shape1, transform1, shape2, transform2) {
    var input = new b2DistanceInput();
    input.proxyA = new b2DistanceProxy();
    input.proxyA.Set(shape1);
    input.proxyB = new b2DistanceProxy();
    input.proxyB.Set(shape2);
    input.transformA = transform1;
    input.transformB = transform2;
    input.useRadii = true;
    var simplexCache = new b2SimplexCache();
    simplexCache.count = 0;
    var output = new b2DistanceOutput();
    b2Distance.Distance(output, simplexCache, input);
    return output.distance < 10 * Number.MIN_VALUE;
  };
  b2Shape.prototype.b2Shape = function () {
    this.m_type = b2Shape.e_unknownShape;
    this.m_radius = b2Settings.b2_linearSlop;
  };
  Box2D.postDefs.push(function () {
    Box2D.Collision.Shapes.b2Shape.e_unknownShape = parseInt(-1);
    Box2D.Collision.Shapes.b2Shape.e_circleShape = 0;
    Box2D.Collision.Shapes.b2Shape.e_polygonShape = 1;
    Box2D.Collision.Shapes.b2Shape.e_edgeShape = 2;
    Box2D.Collision.Shapes.b2Shape.e_shapeTypeCount = 3;
    Box2D.Collision.Shapes.b2Shape.e_hitCollide = 1;
    Box2D.Collision.Shapes.b2Shape.e_missCollide = 0;
    Box2D.Collision.Shapes.b2Shape.e_startsInsideCollide = parseInt(-1);
  });
})();
(function () {
  var b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3;
  b2Color.b2Color = function () {
    this._r = 0;
    this._g = 0;
    this._b = 0;
  };
  b2Color.prototype.b2Color = function (rr, gg, bb) {
    if (rr === undefined) rr = 0;
    if (gg === undefined) gg = 0;
    if (bb === undefined) bb = 0;
    this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0, 1));
    this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0, 1));
    this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0, 1));
  };
  b2Color.prototype.Set = function (rr, gg, bb) {
    if (rr === undefined) rr = 0;
    if (gg === undefined) gg = 0;
    if (bb === undefined) bb = 0;
    this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0, 1));
    this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0, 1));
    this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0, 1));
  };
  Object.defineProperty(b2Color.prototype, "r", {
    enumerable: false,
    configurable: true,
    set: function (rr) {
      if (rr === undefined) rr = 0;
      this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0, 1));
    },
  });
  Object.defineProperty(b2Color.prototype, "g", {
    enumerable: false,
    configurable: true,
    set: function (gg) {
      if (gg === undefined) gg = 0;
      this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0, 1));
    },
  });
  Object.defineProperty(b2Color.prototype, "b", {
    enumerable: false,
    configurable: true,
    set: function (bb) {
      if (bb === undefined) bb = 0;
      this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0, 1));
    },
  });
  Object.defineProperty(b2Color.prototype, "color", {
    enumerable: false,
    configurable: true,
    get: function () {
      return (this._r << 16) | (this._g << 8) | this._b;
    },
  });
  b2Settings.b2Settings = function () {};
  b2Settings.b2MixFriction = function (friction1, friction2) {
    if (friction1 === undefined) friction1 = 0;
    if (friction2 === undefined) friction2 = 0;
    return Math.sqrt(friction1 * friction2);
  };
  b2Settings.b2MixRestitution = function (restitution1, restitution2) {
    if (restitution1 === undefined) restitution1 = 0;
    if (restitution2 === undefined) restitution2 = 0;
    return restitution1 > restitution2 ? restitution1 : restitution2;
  };
  b2Settings.b2Assert = function (a) {
    if (!a) throw "Assertion Failed";
  };
  Box2D.postDefs.push(function () {
    Box2D.Common.b2Settings.VERSION = "2.1alpha";
    Box2D.Common.b2Settings.USHRT_MAX = 65535;
    Box2D.Common.b2Settings.b2_pi = Math.PI;
    Box2D.Common.b2Settings.b2_maxManifoldPoints = 2;
    Box2D.Common.b2Settings.b2_aabbExtension = 0.1;
    Box2D.Common.b2Settings.b2_aabbMultiplier = 2;
    Box2D.Common.b2Settings.b2_polygonRadius = 2 * b2Settings.b2_linearSlop;
    Box2D.Common.b2Settings.b2_linearSlop = 0.005;
    Box2D.Common.b2Settings.b2_angularSlop = (2 / 180) * b2Settings.b2_pi;
    Box2D.Common.b2Settings.b2_toiSlop = 8 * b2Settings.b2_linearSlop;
    Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland = 32;
    Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland = 32;
    Box2D.Common.b2Settings.b2_velocityThreshold = 1;
    Box2D.Common.b2Settings.b2_maxLinearCorrection = 0.2;
    Box2D.Common.b2Settings.b2_maxAngularCorrection =
      (8 / 180) * b2Settings.b2_pi;
    Box2D.Common.b2Settings.b2_maxTranslation = 2;
    Box2D.Common.b2Settings.b2_maxTranslationSquared =
      b2Settings.b2_maxTranslation * b2Settings.b2_maxTranslation;
    Box2D.Common.b2Settings.b2_maxRotation = 0.5 * b2Settings.b2_pi;
    Box2D.Common.b2Settings.b2_maxRotationSquared =
      b2Settings.b2_maxRotation * b2Settings.b2_maxRotation;
    Box2D.Common.b2Settings.b2_contactBaumgarte = 0.2;
    Box2D.Common.b2Settings.b2_timeToSleep = 0.5;
    Box2D.Common.b2Settings.b2_linearSleepTolerance = 0.01;
    Box2D.Common.b2Settings.b2_angularSleepTolerance =
      (2 / 180) * b2Settings.b2_pi;
  });
})();
(function () {
  var b2AABB = Box2D.Collision.b2AABB,
    b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3;
  b2Mat22.b2Mat22 = function () {
    this.col1 = new b2Vec2();
    this.col2 = new b2Vec2();
  };
  b2Mat22.prototype.b2Mat22 = function () {
    this.SetIdentity();
  };
  b2Mat22.FromAngle = function (angle) {
    if (angle === undefined) angle = 0;
    var mat = new b2Mat22();
    mat.Set(angle);
    return mat;
  };
  b2Mat22.FromVV = function (c1, c2) {
    var mat = new b2Mat22();
    mat.SetVV(c1, c2);
    return mat;
  };
  b2Mat22.prototype.Set = function (angle) {
    if (angle === undefined) angle = 0;
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    this.col1.x = c;
    this.col2.x = -s;
    this.col1.y = s;
    this.col2.y = c;
  };
  b2Mat22.prototype.SetVV = function (c1, c2) {
    this.col1.SetV(c1);
    this.col2.SetV(c2);
  };
  b2Mat22.prototype.Copy = function () {
    var mat = new b2Mat22();
    mat.SetM(this);
    return mat;
  };
  b2Mat22.prototype.SetM = function (m) {
    this.col1.SetV(m.col1);
    this.col2.SetV(m.col2);
  };
  b2Mat22.prototype.AddM = function (m) {
    this.col1.x += m.col1.x;
    this.col1.y += m.col1.y;
    this.col2.x += m.col2.x;
    this.col2.y += m.col2.y;
  };
  b2Mat22.prototype.SetIdentity = function () {
    this.col1.x = 1;
    this.col2.x = 0;
    this.col1.y = 0;
    this.col2.y = 1;
  };
  b2Mat22.prototype.SetZero = function () {
    this.col1.x = 0;
    this.col2.x = 0;
    this.col1.y = 0;
    this.col2.y = 0;
  };
  b2Mat22.prototype.GetAngle = function () {
    return Math.atan2(this.col1.y, this.col1.x);
  };
  b2Mat22.prototype.GetInverse = function (out) {
    var a = this.col1.x;
    var b = this.col2.x;
    var c = this.col1.y;
    var d = this.col2.y;
    var det = a * d - b * c;
    if (det != 0) det = 1 / det;
    out.col1.x = det * d;
    out.col2.x = -det * b;
    out.col1.y = -det * c;
    out.col2.y = det * a;
    return out;
  };
  b2Mat22.prototype.Solve = function (out, bX, bY) {
    if (bX === undefined) bX = 0;
    if (bY === undefined) bY = 0;
    var a11 = this.col1.x;
    var a12 = this.col2.x;
    var a21 = this.col1.y;
    var a22 = this.col2.y;
    var det = a11 * a22 - a12 * a21;
    if (det != 0) det = 1 / det;
    out.x = det * (a22 * bX - a12 * bY);
    out.y = det * (a11 * bY - a21 * bX);
    return out;
  };
  b2Mat22.prototype.Abs = function () {
    this.col1.Abs();
    this.col2.Abs();
  };
  b2Mat33.b2Mat33 = function () {
    this.col1 = new b2Vec3();
    this.col2 = new b2Vec3();
    this.col3 = new b2Vec3();
  };
  b2Mat33.prototype.b2Mat33 = function (c1, c2, c3) {
    if (c1 === undefined) c1 = null;
    if (c2 === undefined) c2 = null;
    if (c3 === undefined) c3 = null;
    if (!c1 && !c2 && !c3) {
      this.col1.SetZero();
      this.col2.SetZero();
      this.col3.SetZero();
    } else {
      this.col1.SetV(c1);
      this.col2.SetV(c2);
      this.col3.SetV(c3);
    }
  };
  b2Mat33.prototype.SetVVV = function (c1, c2, c3) {
    this.col1.SetV(c1);
    this.col2.SetV(c2);
    this.col3.SetV(c3);
  };
  b2Mat33.prototype.Copy = function () {
    return new b2Mat33(this.col1, this.col2, this.col3);
  };
  b2Mat33.prototype.SetM = function (m) {
    this.col1.SetV(m.col1);
    this.col2.SetV(m.col2);
    this.col3.SetV(m.col3);
  };
  b2Mat33.prototype.AddM = function (m) {
    this.col1.x += m.col1.x;
    this.col1.y += m.col1.y;
    this.col1.z += m.col1.z;
    this.col2.x += m.col2.x;
    this.col2.y += m.col2.y;
    this.col2.z += m.col2.z;
    this.col3.x += m.col3.x;
    this.col3.y += m.col3.y;
    this.col3.z += m.col3.z;
  };
  b2Mat33.prototype.SetIdentity = function () {
    this.col1.x = 1;
    this.col2.x = 0;
    this.col3.x = 0;
    this.col1.y = 0;
    this.col2.y = 1;
    this.col3.y = 0;
    this.col1.z = 0;
    this.col2.z = 0;
    this.col3.z = 1;
  };
  b2Mat33.prototype.SetZero = function () {
    this.col1.x = 0;
    this.col2.x = 0;
    this.col3.x = 0;
    this.col1.y = 0;
    this.col2.y = 0;
    this.col3.y = 0;
    this.col1.z = 0;
    this.col2.z = 0;
    this.col3.z = 0;
  };
  b2Mat33.prototype.Solve22 = function (out, bX, bY) {
    if (bX === undefined) bX = 0;
    if (bY === undefined) bY = 0;
    var a11 = this.col1.x;
    var a12 = this.col2.x;
    var a21 = this.col1.y;
    var a22 = this.col2.y;
    var det = a11 * a22 - a12 * a21;
    if (det != 0) det = 1 / det;
    out.x = det * (a22 * bX - a12 * bY);
    out.y = det * (a11 * bY - a21 * bX);
    return out;
  };
  b2Mat33.prototype.Solve33 = function (out, bX, bY, bZ) {
    if (bX === undefined) bX = 0;
    if (bY === undefined) bY = 0;
    if (bZ === undefined) bZ = 0;
    var a11 = this.col1.x;
    var a21 = this.col1.y;
    var a31 = this.col1.z;
    var a12 = this.col2.x;
    var a22 = this.col2.y;
    var a32 = this.col2.z;
    var a13 = this.col3.x;
    var a23 = this.col3.y;
    var a33 = this.col3.z;
    var det =
      a11 * (a22 * a33 - a32 * a23) +
      a21 * (a32 * a13 - a12 * a33) +
      a31 * (a12 * a23 - a22 * a13);
    if (det != 0) det = 1 / det;
    out.x =
      det *
      (bX * (a22 * a33 - a32 * a23) +
        bY * (a32 * a13 - a12 * a33) +
        bZ * (a12 * a23 - a22 * a13));
    out.y =
      det *
      (a11 * (bY * a33 - bZ * a23) +
        a21 * (bZ * a13 - bX * a33) +
        a31 * (bX * a23 - bY * a13));
    out.z =
      det *
      (a11 * (a22 * bZ - a32 * bY) +
        a21 * (a32 * bX - a12 * bZ) +
        a31 * (a12 * bY - a22 * bX));
    return out;
  };
  b2Math.b2Math = function () {};
  b2Math.IsValid = function (x) {
    if (x === undefined) x = 0;
    return isFinite(x);
  };
  b2Math.Dot = function (a, b) {
    return a.x * b.x + a.y * b.y;
  };
  b2Math.CrossVV = function (a, b) {
    return a.x * b.y - a.y * b.x;
  };
  b2Math.CrossVF = function (a, s) {
    if (s === undefined) s = 0;
    var v = new b2Vec2(s * a.y, -s * a.x);
    return v;
  };
  b2Math.CrossFV = function (s, a) {
    if (s === undefined) s = 0;
    var v = new b2Vec2(-s * a.y, s * a.x);
    return v;
  };
  b2Math.MulMV = function (A, v) {
    var u = new b2Vec2(
      A.col1.x * v.x + A.col2.x * v.y,
      A.col1.y * v.x + A.col2.y * v.y
    );
    return u;
  };
  b2Math.MulTMV = function (A, v) {
    var u = new b2Vec2(b2Math.Dot(v, A.col1), b2Math.Dot(v, A.col2));
    return u;
  };
  b2Math.MulX = function (T, v) {
    var a = b2Math.MulMV(T.R, v);
    a.x += T.position.x;
    a.y += T.position.y;
    return a;
  };
  b2Math.MulXT = function (T, v) {
    var a = b2Math.SubtractVV(v, T.position);
    var tX = a.x * T.R.col1.x + a.y * T.R.col1.y;
    a.y = a.x * T.R.col2.x + a.y * T.R.col2.y;
    a.x = tX;
    return a;
  };
  b2Math.AddVV = function (a, b) {
    var v = new b2Vec2(a.x + b.x, a.y + b.y);
    return v;
  };
  b2Math.SubtractVV = function (a, b) {
    var v = new b2Vec2(a.x - b.x, a.y - b.y);
    return v;
  };
  b2Math.Distance = function (a, b) {
    var cX = a.x - b.x;
    var cY = a.y - b.y;
    return Math.sqrt(cX * cX + cY * cY);
  };
  b2Math.DistanceSquared = function (a, b) {
    var cX = a.x - b.x;
    var cY = a.y - b.y;
    return cX * cX + cY * cY;
  };
  b2Math.MulFV = function (s, a) {
    if (s === undefined) s = 0;
    var v = new b2Vec2(s * a.x, s * a.y);
    return v;
  };
  b2Math.AddMM = function (A, B) {
    var C = b2Mat22.FromVV(
      b2Math.AddVV(A.col1, B.col1),
      b2Math.AddVV(A.col2, B.col2)
    );
    return C;
  };
  b2Math.MulMM = function (A, B) {
    var C = b2Mat22.FromVV(b2Math.MulMV(A, B.col1), b2Math.MulMV(A, B.col2));
    return C;
  };
  b2Math.MulTMM = function (A, B) {
    var c1 = new b2Vec2(b2Math.Dot(A.col1, B.col1), b2Math.Dot(A.col2, B.col1));
    var c2 = new b2Vec2(b2Math.Dot(A.col1, B.col2), b2Math.Dot(A.col2, B.col2));
    var C = b2Mat22.FromVV(c1, c2);
    return C;
  };
  b2Math.Abs = function (a) {
    if (a === undefined) a = 0;
    return a > 0 ? a : -a;
  };
  b2Math.AbsV = function (a) {
    var b = new b2Vec2(b2Math.Abs(a.x), b2Math.Abs(a.y));
    return b;
  };
  b2Math.AbsM = function (A) {
    var B = b2Mat22.FromVV(b2Math.AbsV(A.col1), b2Math.AbsV(A.col2));
    return B;
  };
  b2Math.Min = function (a, b) {
    if (a === undefined) a = 0;
    if (b === undefined) b = 0;
    return a < b ? a : b;
  };
  b2Math.MinV = function (a, b) {
    var c = new b2Vec2(b2Math.Min(a.x, b.x), b2Math.Min(a.y, b.y));
    return c;
  };
  b2Math.Max = function (a, b) {
    if (a === undefined) a = 0;
    if (b === undefined) b = 0;
    return a > b ? a : b;
  };
  b2Math.MaxV = function (a, b) {
    var c = new b2Vec2(b2Math.Max(a.x, b.x), b2Math.Max(a.y, b.y));
    return c;
  };
  b2Math.Clamp = function (a, low, high) {
    if (a === undefined) a = 0;
    if (low === undefined) low = 0;
    if (high === undefined) high = 0;
    return a < low ? low : a > high ? high : a;
  };
  b2Math.ClampV = function (a, low, high) {
    return b2Math.MaxV(low, b2Math.MinV(a, high));
  };
  b2Math.Swap = function (a, b) {
    var tmp = a[0];
    a[0] = b[0];
    b[0] = tmp;
  };
  b2Math.Random = function () {
    return Math.random() * 2 - 1;
  };
  b2Math.RandomRange = function (lo, hi) {
    if (lo === undefined) lo = 0;
    if (hi === undefined) hi = 0;
    var r = Math.random();
    r = (hi - lo) * r + lo;
    return r;
  };
  b2Math.NextPowerOfTwo = function (x) {
    if (x === undefined) x = 0;
    x |= (x >> 1) & 2147483647;
    x |= (x >> 2) & 1073741823;
    x |= (x >> 4) & 268435455;
    x |= (x >> 8) & 16777215;
    x |= (x >> 16) & 65535;
    return x + 1;
  };
  b2Math.IsPowerOfTwo = function (x) {
    if (x === undefined) x = 0;
    var result = x > 0 && (x & (x - 1)) == 0;
    return result;
  };
  Box2D.postDefs.push(function () {
    Box2D.Common.Math.b2Math.b2Vec2_zero = new b2Vec2(0, 0);
    Box2D.Common.Math.b2Math.b2Mat22_identity = b2Mat22.FromVV(
      new b2Vec2(1, 0),
      new b2Vec2(0, 1)
    );
    Box2D.Common.Math.b2Math.b2Transform_identity = new b2Transform(
      b2Math.b2Vec2_zero,
      b2Math.b2Mat22_identity
    );
  });
  b2Sweep.b2Sweep = function () {
    this.localCenter = new b2Vec2();
    this.c0 = new b2Vec2();
    this.c = new b2Vec2();
  };
  b2Sweep.prototype.Set = function (other) {
    this.localCenter.SetV(other.localCenter);
    this.c0.SetV(other.c0);
    this.c.SetV(other.c);
    this.a0 = other.a0;
    this.a = other.a;
    this.t0 = other.t0;
  };
  b2Sweep.prototype.Copy = function () {
    var copy = new b2Sweep();
    copy.localCenter.SetV(this.localCenter);
    copy.c0.SetV(this.c0);
    copy.c.SetV(this.c);
    copy.a0 = this.a0;
    copy.a = this.a;
    copy.t0 = this.t0;
    return copy;
  };
  b2Sweep.prototype.GetTransform = function (xf, alpha) {
    if (alpha === undefined) alpha = 0;
    xf.position.x = (1 - alpha) * this.c0.x + alpha * this.c.x;
    xf.position.y = (1 - alpha) * this.c0.y + alpha * this.c.y;
    var angle = (1 - alpha) * this.a0 + alpha * this.a;
    xf.R.Set(angle);
    var tMat = xf.R;
    xf.position.x -=
      tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y;
    xf.position.y -=
      tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y;
  };
  b2Sweep.prototype.Advance = function (t) {
    if (t === undefined) t = 0;
    if (this.t0 < t && 1 - this.t0 > Number.MIN_VALUE) {
      var alpha = (t - this.t0) / (1 - this.t0);
      this.c0.x = (1 - alpha) * this.c0.x + alpha * this.c.x;
      this.c0.y = (1 - alpha) * this.c0.y + alpha * this.c.y;
      this.a0 = (1 - alpha) * this.a0 + alpha * this.a;
      this.t0 = t;
    }
  };
  b2Transform.b2Transform = function () {
    this.position = new b2Vec2();
    this.R = new b2Mat22();
  };
  b2Transform.prototype.b2Transform = function (pos, r) {
    if (pos === undefined) pos = null;
    if (r === undefined) r = null;
    if (pos) {
      this.position.SetV(pos);
      this.R.SetM(r);
    }
  };
  b2Transform.prototype.Initialize = function (pos, r) {
    this.position.SetV(pos);
    this.R.SetM(r);
  };
  b2Transform.prototype.SetIdentity = function () {
    this.position.SetZero();
    this.R.SetIdentity();
  };
  b2Transform.prototype.Set = function (x) {
    this.position.SetV(x.position);
    this.R.SetM(x.R);
  };
  b2Transform.prototype.GetAngle = function () {
    return Math.atan2(this.R.col1.y, this.R.col1.x);
  };
  b2Vec2.b2Vec2 = function () {};
  b2Vec2.prototype.b2Vec2 = function (x_, y_) {
    if (x_ === undefined) x_ = 0;
    if (y_ === undefined) y_ = 0;
    this.x = x_;
    this.y = y_;
  };
  b2Vec2.prototype.SetZero = function () {
    this.x = 0;
    this.y = 0;
  };
  b2Vec2.prototype.Set = function (x_, y_) {
    if (x_ === undefined) x_ = 0;
    if (y_ === undefined) y_ = 0;
    this.x = x_;
    this.y = y_;
  };
  b2Vec2.prototype.SetV = function (v) {
    this.x = v.x;
    this.y = v.y;
  };
  b2Vec2.prototype.GetNegative = function () {
    return new b2Vec2(-this.x, -this.y);
  };
  b2Vec2.prototype.NegativeSelf = function () {
    this.x = -this.x;
    this.y = -this.y;
  };
  b2Vec2.Make = function (x_, y_) {
    if (x_ === undefined) x_ = 0;
    if (y_ === undefined) y_ = 0;
    return new b2Vec2(x_, y_);
  };
  b2Vec2.prototype.Copy = function () {
    return new b2Vec2(this.x, this.y);
  };
  b2Vec2.prototype.Add = function (v) {
    this.x += v.x;
    this.y += v.y;
  };
  b2Vec2.prototype.Subtract = function (v) {
    this.x -= v.x;
    this.y -= v.y;
  };
  b2Vec2.prototype.Multiply = function (a) {
    if (a === undefined) a = 0;
    this.x *= a;
    this.y *= a;
  };
  b2Vec2.prototype.MulM = function (A) {
    var tX = this.x;
    this.x = A.col1.x * tX + A.col2.x * this.y;
    this.y = A.col1.y * tX + A.col2.y * this.y;
  };
  b2Vec2.prototype.MulTM = function (A) {
    var tX = b2Math.Dot(this, A.col1);
    this.y = b2Math.Dot(this, A.col2);
    this.x = tX;
  };
  b2Vec2.prototype.CrossVF = function (s) {
    if (s === undefined) s = 0;
    var tX = this.x;
    this.x = s * this.y;
    this.y = -s * tX;
  };
  b2Vec2.prototype.CrossFV = function (s) {
    if (s === undefined) s = 0;
    var tX = this.x;
    this.x = -s * this.y;
    this.y = s * tX;
  };
  b2Vec2.prototype.MinV = function (b) {
    this.x = this.x < b.x ? this.x : b.x;
    this.y = this.y < b.y ? this.y : b.y;
  };
  b2Vec2.prototype.MaxV = function (b) {
    this.x = this.x > b.x ? this.x : b.x;
    this.y = this.y > b.y ? this.y : b.y;
  };
  b2Vec2.prototype.Abs = function () {
    if (this.x < 0) this.x = -this.x;
    if (this.y < 0) this.y = -this.y;
  };
  b2Vec2.prototype.Length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  b2Vec2.prototype.LengthSquared = function () {
    return this.x * this.x + this.y * this.y;
  };
  b2Vec2.prototype.Normalize = function () {
    var length = Math.sqrt(this.x * this.x + this.y * this.y);
    if (length < Number.MIN_VALUE) return 0;
    var invLength = 1 / length;
    this.x *= invLength;
    this.y *= invLength;
    return length;
  };
  b2Vec2.prototype.IsValid = function () {
    return b2Math.IsValid(this.x) && b2Math.IsValid(this.y);
  };
  b2Vec3.b2Vec3 = function () {};
  b2Vec3.prototype.b2Vec3 = function (x, y, z) {
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;
    if (z === undefined) z = 0;
    this.x = x;
    this.y = y;
    this.z = z;
  };
  b2Vec3.prototype.SetZero = function () {
    this.x = this.y = this.z = 0;
  };
  b2Vec3.prototype.Set = function (x, y, z) {
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;
    if (z === undefined) z = 0;
    this.x = x;
    this.y = y;
    this.z = z;
  };
  b2Vec3.prototype.SetV = function (v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  };
  b2Vec3.prototype.GetNegative = function () {
    return new b2Vec3(-this.x, -this.y, -this.z);
  };
  b2Vec3.prototype.NegativeSelf = function () {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  };
  b2Vec3.prototype.Copy = function () {
    return new b2Vec3(this.x, this.y, this.z);
  };
  b2Vec3.prototype.Add = function (v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  };
  b2Vec3.prototype.Subtract = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  };
  b2Vec3.prototype.Multiply = function (a) {
    if (a === undefined) a = 0;
    this.x *= a;
    this.y *= a;
    this.z *= a;
  };
})();
(function () {
  var b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3,
    b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2AABB = Box2D.Collision.b2AABB,
    b2Bound = Box2D.Collision.b2Bound,
    b2BoundValues = Box2D.Collision.b2BoundValues,
    b2Collision = Box2D.Collision.b2Collision,
    b2ContactID = Box2D.Collision.b2ContactID,
    b2ContactPoint = Box2D.Collision.b2ContactPoint,
    b2Distance = Box2D.Collision.b2Distance,
    b2DistanceInput = Box2D.Collision.b2DistanceInput,
    b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
    b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
    b2DynamicTree = Box2D.Collision.b2DynamicTree,
    b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
    b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
    b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
    b2Manifold = Box2D.Collision.b2Manifold,
    b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
    b2Point = Box2D.Collision.b2Point,
    b2RayCastInput = Box2D.Collision.b2RayCastInput,
    b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
    b2Segment = Box2D.Collision.b2Segment,
    b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
    b2Simplex = Box2D.Collision.b2Simplex,
    b2SimplexCache = Box2D.Collision.b2SimplexCache,
    b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
    b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
    b2TOIInput = Box2D.Collision.b2TOIInput,
    b2WorldManifold = Box2D.Collision.b2WorldManifold,
    ClipVertex = Box2D.Collision.ClipVertex,
    Features = Box2D.Collision.Features,
    IBroadPhase = Box2D.Collision.IBroadPhase,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2Shape = Box2D.Collision.Shapes.b2Shape,
    b2Body = Box2D.Dynamics.b2Body,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
    b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2ContactManager = Box2D.Dynamics.b2ContactManager,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
    b2FilterData = Box2D.Dynamics.b2FilterData,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Island = Box2D.Dynamics.b2Island,
    b2TimeStep = Box2D.Dynamics.b2TimeStep,
    b2World = Box2D.Dynamics.b2World,
    b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
    b2Contact = Box2D.Dynamics.Contacts.b2Contact,
    b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
    b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
    b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
    b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
    b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
    b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
    b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
    b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
    b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
    b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
    b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
    b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
    b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
    b2Controller = Box2D.Dynamics.Controllers.b2Controller,
    b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
    b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
    b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
    b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
    b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
    b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
    b2Joint = Box2D.Dynamics.Joints.b2Joint,
    b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
    b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
    b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
    b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
    b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
    b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
    b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
    b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
    b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
    b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
    b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
    b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
    b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
  b2Body.b2Body = function () {
    this.m_xf = new b2Transform();
    this.m_sweep = new b2Sweep();
    this.m_linearVelocity = new b2Vec2();
    this.m_force = new b2Vec2();
  };
  b2Body.prototype.connectEdges = function (s1, s2, angle1) {
    if (angle1 === undefined) angle1 = 0;
    var angle2 = Math.atan2(
      s2.GetDirectionVector().y,
      s2.GetDirectionVector().x
    );
    var coreOffset = Math.tan((angle2 - angle1) * 0.5);
    var core = b2Math.MulFV(coreOffset, s2.GetDirectionVector());
    core = b2Math.SubtractVV(core, s2.GetNormalVector());
    core = b2Math.MulFV(b2Settings.b2_toiSlop, core);
    core = b2Math.AddVV(core, s2.GetVertex1());
    var cornerDir = b2Math.AddVV(
      s1.GetDirectionVector(),
      s2.GetDirectionVector()
    );
    cornerDir.Normalize();
    var convex = b2Math.Dot(s1.GetDirectionVector(), s2.GetNormalVector()) > 0;
    s1.SetNextEdge(s2, core, cornerDir, convex);
    s2.SetPrevEdge(s1, core, cornerDir, convex);
    return angle2;
  };
  b2Body.prototype.CreateFixture = function (def) {
    if (this.m_world.IsLocked() == true) return null;
    var fixture = new b2Fixture();
    fixture.Create(this, this.m_xf, def);
    if (this.m_flags & b2Body.e_activeFlag) {
      var broadPhase = this.m_world.m_contactManager.m_broadPhase;
      fixture.CreateProxy(broadPhase, this.m_xf);
    }
    fixture.m_next = this.m_fixtureList;
    this.m_fixtureList = fixture;
    ++this.m_fixtureCount;
    fixture.m_body = this;
    if (fixture.m_density > 0) this.ResetMassData();
    this.m_world.m_flags |= b2World.e_newFixture;
    return fixture;
  };
  b2Body.prototype.CreateFixture2 = function (shape, density) {
    if (density === undefined) density = 0;
    var def = new b2FixtureDef();
    def.shape = shape;
    def.density = density;
    return this.CreateFixture(def);
  };
  b2Body.prototype.DestroyFixture = function (fixture) {
    if (this.m_world.IsLocked() == true) return;
    var node = this.m_fixtureList;
    var ppF = null;
    var found = false;
    while (node != null) {
      if (node == fixture) {
        if (ppF) ppF.m_next = fixture.m_next;
        else this.m_fixtureList = fixture.m_next;
        found = true;
        break;
      }
      ppF = node;
      node = node.m_next;
    }
    var edge = this.m_contactList;
    while (edge) {
      var c = edge.contact;
      edge = edge.next;
      var fixtureA = c.GetFixtureA();
      var fixtureB = c.GetFixtureB();
      if (fixture == fixtureA || fixture == fixtureB)
        this.m_world.m_contactManager.Destroy(c);
    }
    if (this.m_flags & b2Body.e_activeFlag) {
      var broadPhase = this.m_world.m_contactManager.m_broadPhase;
      fixture.DestroyProxy(broadPhase);
    } else;
    fixture.Destroy();
    fixture.m_body = null;
    fixture.m_next = null;
    --this.m_fixtureCount;
    this.ResetMassData();
  };
  b2Body.prototype.SetPositionAndAngle = function (position, angle) {
    if (angle === undefined) angle = 0;
    var f;
    if (this.m_world.IsLocked() == true) return;
    this.m_xf.R.Set(angle);
    this.m_xf.position.SetV(position);
    var tMat = this.m_xf.R;
    var tVec = this.m_sweep.localCenter;
    this.m_sweep.c.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
    this.m_sweep.c.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
    this.m_sweep.c.x += this.m_xf.position.x;
    this.m_sweep.c.y += this.m_xf.position.y;
    this.m_sweep.c0.SetV(this.m_sweep.c);
    this.m_sweep.a0 = this.m_sweep.a = angle;
    var broadPhase = this.m_world.m_contactManager.m_broadPhase;
    for (f = this.m_fixtureList; f; f = f.m_next)
      f.Synchronize(broadPhase, this.m_xf, this.m_xf);
    this.m_world.m_contactManager.FindNewContacts();
  };
  b2Body.prototype.SetTransform = function (xf) {
    this.SetPositionAndAngle(xf.position, xf.GetAngle());
  };
  b2Body.prototype.GetTransform = function () {
    return this.m_xf;
  };
  b2Body.prototype.GetPosition = function () {
    return this.m_xf.position;
  };
  b2Body.prototype.SetPosition = function (position) {
    this.SetPositionAndAngle(position, this.GetAngle());
  };
  b2Body.prototype.GetAngle = function () {
    return this.m_sweep.a;
  };
  b2Body.prototype.SetAngle = function (angle) {
    if (angle === undefined) angle = 0;
    this.SetPositionAndAngle(this.GetPosition(), angle);
  };
  b2Body.prototype.GetWorldCenter = function () {
    return this.m_sweep.c;
  };
  b2Body.prototype.GetLocalCenter = function () {
    return this.m_sweep.localCenter;
  };
  b2Body.prototype.SetLinearVelocity = function (v) {
    if (this.m_type == b2Body.b2_staticBody) return;
    this.m_linearVelocity.SetV(v);
  };
  b2Body.prototype.GetLinearVelocity = function () {
    return this.m_linearVelocity;
  };
  b2Body.prototype.SetAngularVelocity = function (omega) {
    if (omega === undefined) omega = 0;
    if (this.m_type == b2Body.b2_staticBody) return;
    this.m_angularVelocity = omega;
  };
  b2Body.prototype.GetAngularVelocity = function () {
    return this.m_angularVelocity;
  };
  b2Body.prototype.GetDefinition = function () {
    var bd = new b2BodyDef();
    bd.type = this.GetType();
    bd.allowSleep =
      (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
    bd.angle = this.GetAngle();
    bd.angularDamping = this.m_angularDamping;
    bd.angularVelocity = this.m_angularVelocity;
    bd.fixedRotation =
      (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
    bd.bullet = (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
    bd.awake = (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
    bd.linearDamping = this.m_linearDamping;
    bd.linearVelocity.SetV(this.GetLinearVelocity());
    bd.position = this.GetPosition();
    bd.userData = this.GetUserData();
    return bd;
  };
  b2Body.prototype.ApplyForce = function (force, point) {
    if (this.m_type != b2Body.b2_dynamicBody) return;
    if (this.IsAwake() == false) this.SetAwake(true);
    this.m_force.x += force.x;
    this.m_force.y += force.y;
    this.m_torque +=
      (point.x - this.m_sweep.c.x) * force.y -
      (point.y - this.m_sweep.c.y) * force.x;
  };
  b2Body.prototype.ApplyTorque = function (torque) {
    if (torque === undefined) torque = 0;
    if (this.m_type != b2Body.b2_dynamicBody) return;
    if (this.IsAwake() == false) this.SetAwake(true);
    this.m_torque += torque;
  };
  b2Body.prototype.ApplyImpulse = function (impulse, point) {
    if (this.m_type != b2Body.b2_dynamicBody) return;
    if (this.IsAwake() == false) this.SetAwake(true);
    this.m_linearVelocity.x += this.m_invMass * impulse.x;
    this.m_linearVelocity.y += this.m_invMass * impulse.y;
    this.m_angularVelocity +=
      this.m_invI *
      ((point.x - this.m_sweep.c.x) * impulse.y -
        (point.y - this.m_sweep.c.y) * impulse.x);
  };
  b2Body.prototype.Split = function (callback) {
    var linearVelocity = this.GetLinearVelocity().Copy();
    var angularVelocity = this.GetAngularVelocity();
    var center = this.GetWorldCenter();
    var body1 = this;
    var body2 = this.m_world.CreateBody(this.GetDefinition());
    var prev;
    for (var f = body1.m_fixtureList; f; )
      if (callback(f)) {
        var next = f.m_next;
        if (prev) prev.m_next = next;
        else body1.m_fixtureList = next;
        body1.m_fixtureCount--;
        f.m_next = body2.m_fixtureList;
        body2.m_fixtureList = f;
        body2.m_fixtureCount++;
        f.m_body = body2;
        f = next;
      } else {
        prev = f;
        f = f.m_next;
      }
    body1.ResetMassData();
    body2.ResetMassData();
    var center1 = body1.GetWorldCenter();
    var center2 = body2.GetWorldCenter();
    var velocity1 = b2Math.AddVV(
      linearVelocity,
      b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center1, center))
    );
    var velocity2 = b2Math.AddVV(
      linearVelocity,
      b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center2, center))
    );
    body1.SetLinearVelocity(velocity1);
    body2.SetLinearVelocity(velocity2);
    body1.SetAngularVelocity(angularVelocity);
    body2.SetAngularVelocity(angularVelocity);
    body1.SynchronizeFixtures();
    body2.SynchronizeFixtures();
    return body2;
  };
  b2Body.prototype.Merge = function (other) {
    var f;
    for (f = other.m_fixtureList; f; ) {
      var next = f.m_next;
      other.m_fixtureCount--;
      f.m_next = this.m_fixtureList;
      this.m_fixtureList = f;
      this.m_fixtureCount++;
      f.m_body = body2;
      f = next;
    }
    body1.m_fixtureCount = 0;
    var body1 = this;
    var body2 = other;
    var center1 = body1.GetWorldCenter();
    var center2 = body2.GetWorldCenter();
    var velocity1 = body1.GetLinearVelocity().Copy();
    var velocity2 = body2.GetLinearVelocity().Copy();
    var angular1 = body1.GetAngularVelocity();
    var angular = body2.GetAngularVelocity();
    body1.ResetMassData();
    this.SynchronizeFixtures();
  };
  b2Body.prototype.GetMass = function () {
    return this.m_mass;
  };
  b2Body.prototype.GetInertia = function () {
    return this.m_I;
  };
  b2Body.prototype.GetMassData = function (data) {
    data.mass = this.m_mass;
    data.I = this.m_I;
    data.center.SetV(this.m_sweep.localCenter);
  };
  b2Body.prototype.SetMassData = function (massData) {
    b2Settings.b2Assert(this.m_world.IsLocked() == false);
    if (this.m_world.IsLocked() == true) return;
    if (this.m_type != b2Body.b2_dynamicBody) return;
    this.m_invMass = 0;
    this.m_I = 0;
    this.m_invI = 0;
    this.m_mass = massData.mass;
    if (this.m_mass <= 0) this.m_mass = 1;
    this.m_invMass = 1 / this.m_mass;
    if (massData.I > 0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
      this.m_I =
        massData.I -
        this.m_mass *
          (massData.center.x * massData.center.x +
            massData.center.y * massData.center.y);
      this.m_invI = 1 / this.m_I;
    }
    var oldCenter = this.m_sweep.c.Copy();
    this.m_sweep.localCenter.SetV(massData.center);
    this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
    this.m_sweep.c.SetV(this.m_sweep.c0);
    this.m_linearVelocity.x +=
      this.m_angularVelocity * -(this.m_sweep.c.y - oldCenter.y);
    this.m_linearVelocity.y +=
      this.m_angularVelocity * +(this.m_sweep.c.x - oldCenter.x);
  };
  b2Body.prototype.ResetMassData = function () {
    this.m_mass = 0;
    this.m_invMass = 0;
    this.m_I = 0;
    this.m_invI = 0;
    this.m_sweep.localCenter.SetZero();
    if (
      this.m_type == b2Body.b2_staticBody ||
      this.m_type == b2Body.b2_kinematicBody
    )
      return;
    var center = b2Vec2.Make(0, 0);
    for (var f = this.m_fixtureList; f; f = f.m_next) {
      if (f.m_density == 0) continue;
      var massData = f.GetMassData();
      this.m_mass += massData.mass;
      center.x += massData.center.x * massData.mass;
      center.y += massData.center.y * massData.mass;
      this.m_I += massData.I;
    }
    if (this.m_mass > 0) {
      this.m_invMass = 1 / this.m_mass;
      center.x *= this.m_invMass;
      center.y *= this.m_invMass;
    } else {
      this.m_mass = 1;
      this.m_invMass = 1;
    }
    if (this.m_I > 0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
      this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
      this.m_I *= this.m_inertiaScale;
      b2Settings.b2Assert(this.m_I > 0);
      this.m_invI = 1 / this.m_I;
    } else {
      this.m_I = 0;
      this.m_invI = 0;
    }
    var oldCenter = this.m_sweep.c.Copy();
    this.m_sweep.localCenter.SetV(center);
    this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
    this.m_sweep.c.SetV(this.m_sweep.c0);
    this.m_linearVelocity.x +=
      this.m_angularVelocity * -(this.m_sweep.c.y - oldCenter.y);
    this.m_linearVelocity.y +=
      this.m_angularVelocity * +(this.m_sweep.c.x - oldCenter.x);
  };
  b2Body.prototype.GetWorldPoint = function (localPoint) {
    var A = this.m_xf.R;
    var u = new b2Vec2(
      A.col1.x * localPoint.x + A.col2.x * localPoint.y,
      A.col1.y * localPoint.x + A.col2.y * localPoint.y
    );
    u.x += this.m_xf.position.x;
    u.y += this.m_xf.position.y;
    return u;
  };
  b2Body.prototype.GetWorldVector = function (localVector) {
    return b2Math.MulMV(this.m_xf.R, localVector);
  };
  b2Body.prototype.GetLocalPoint = function (worldPoint) {
    return b2Math.MulXT(this.m_xf, worldPoint);
  };
  b2Body.prototype.GetLocalVector = function (worldVector) {
    return b2Math.MulTMV(this.m_xf.R, worldVector);
  };
  b2Body.prototype.GetLinearVelocityFromWorldPoint = function (worldPoint) {
    return new b2Vec2(
      this.m_linearVelocity.x -
        this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y),
      this.m_linearVelocity.y +
        this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x)
    );
  };
  b2Body.prototype.GetLinearVelocityFromLocalPoint = function (localPoint) {
    var A = this.m_xf.R;
    var worldPoint = new b2Vec2(
      A.col1.x * localPoint.x + A.col2.x * localPoint.y,
      A.col1.y * localPoint.x + A.col2.y * localPoint.y
    );
    worldPoint.x += this.m_xf.position.x;
    worldPoint.y += this.m_xf.position.y;
    return new b2Vec2(
      this.m_linearVelocity.x -
        this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y),
      this.m_linearVelocity.y +
        this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x)
    );
  };
  b2Body.prototype.GetLinearDamping = function () {
    return this.m_linearDamping;
  };
  b2Body.prototype.SetLinearDamping = function (linearDamping) {
    if (linearDamping === undefined) linearDamping = 0;
    this.m_linearDamping = linearDamping;
  };
  b2Body.prototype.GetAngularDamping = function () {
    return this.m_angularDamping;
  };
  b2Body.prototype.SetAngularDamping = function (angularDamping) {
    if (angularDamping === undefined) angularDamping = 0;
    this.m_angularDamping = angularDamping;
  };
  b2Body.prototype.SetType = function (type) {
    if (type === undefined) type = 0;
    if (this.m_type == type) return;
    this.m_type = type;
    this.ResetMassData();
    if (this.m_type == b2Body.b2_staticBody) {
      this.m_linearVelocity.SetZero();
      this.m_angularVelocity = 0;
    }
    this.SetAwake(true);
    this.m_force.SetZero();
    this.m_torque = 0;
    for (var ce = this.m_contactList; ce; ce = ce.next)
      ce.contact.FlagForFiltering();
  };
  b2Body.prototype.GetType = function () {
    return this.m_type;
  };
  b2Body.prototype.SetBullet = function (flag) {
    if (flag) this.m_flags |= b2Body.e_bulletFlag;
    else this.m_flags &= ~b2Body.e_bulletFlag;
  };
  b2Body.prototype.IsBullet = function () {
    return (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
  };
  b2Body.prototype.SetSleepingAllowed = function (flag) {
    if (flag) this.m_flags |= b2Body.e_allowSleepFlag;
    else {
      this.m_flags &= ~b2Body.e_allowSleepFlag;
      this.SetAwake(true);
    }
  };
  b2Body.prototype.SetAwake = function (flag) {
    if (flag) {
      this.m_flags |= b2Body.e_awakeFlag;
      this.m_sleepTime = 0;
    } else {
      this.m_flags &= ~b2Body.e_awakeFlag;
      this.m_sleepTime = 0;
      this.m_linearVelocity.SetZero();
      this.m_angularVelocity = 0;
      this.m_force.SetZero();
      this.m_torque = 0;
    }
  };
  b2Body.prototype.IsAwake = function () {
    return (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
  };
  b2Body.prototype.SetFixedRotation = function (fixed) {
    if (fixed) this.m_flags |= b2Body.e_fixedRotationFlag;
    else this.m_flags &= ~b2Body.e_fixedRotationFlag;
    this.ResetMassData();
  };
  b2Body.prototype.IsFixedRotation = function () {
    return (
      (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag
    );
  };
  b2Body.prototype.SetActive = function (flag) {
    if (flag == this.IsActive()) return;
    var broadPhase;
    var f;
    if (flag) {
      this.m_flags |= b2Body.e_activeFlag;
      broadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (f = this.m_fixtureList; f; f = f.m_next)
        f.CreateProxy(broadPhase, this.m_xf);
    } else {
      this.m_flags &= ~b2Body.e_activeFlag;
      broadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (f = this.m_fixtureList; f; f = f.m_next) f.DestroyProxy(broadPhase);
      var ce = this.m_contactList;
      while (ce) {
        var ce0 = ce;
        ce = ce.next;
        this.m_world.m_contactManager.Destroy(ce0.contact);
      }
      this.m_contactList = null;
    }
  };
  b2Body.prototype.IsActive = function () {
    return (this.m_flags & b2Body.e_activeFlag) == b2Body.e_activeFlag;
  };
  b2Body.prototype.IsSleepingAllowed = function () {
    return (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
  };
  b2Body.prototype.GetFixtureList = function () {
    return this.m_fixtureList;
  };
  b2Body.prototype.GetJointList = function () {
    return this.m_jointList;
  };
  b2Body.prototype.GetControllerList = function () {
    return this.m_controllerList;
  };
  b2Body.prototype.GetContactList = function () {
    return this.m_contactList;
  };
  b2Body.prototype.GetNext = function () {
    return this.m_next;
  };
  b2Body.prototype.GetUserData = function () {
    return this.m_userData;
  };
  b2Body.prototype.SetUserData = function (data) {
    this.m_userData = data;
  };
  b2Body.prototype.GetWorld = function () {
    return this.m_world;
  };
  b2Body.prototype.b2Body = function (bd, world) {
    this.m_flags = 0;
    if (bd.bullet) this.m_flags |= b2Body.e_bulletFlag;
    if (bd.fixedRotation) this.m_flags |= b2Body.e_fixedRotationFlag;
    if (bd.allowSleep) this.m_flags |= b2Body.e_allowSleepFlag;
    if (bd.awake) this.m_flags |= b2Body.e_awakeFlag;
    if (bd.active) this.m_flags |= b2Body.e_activeFlag;
    this.m_world = world;
    this.m_xf.position.SetV(bd.position);
    this.m_xf.R.Set(bd.angle);
    this.m_sweep.localCenter.SetZero();
    this.m_sweep.t0 = 1;
    this.m_sweep.a0 = this.m_sweep.a = bd.angle;
    var tMat = this.m_xf.R;
    var tVec = this.m_sweep.localCenter;
    this.m_sweep.c.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
    this.m_sweep.c.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
    this.m_sweep.c.x += this.m_xf.position.x;
    this.m_sweep.c.y += this.m_xf.position.y;
    this.m_sweep.c0.SetV(this.m_sweep.c);
    this.m_jointList = null;
    this.m_controllerList = null;
    this.m_contactList = null;
    this.m_controllerCount = 0;
    this.m_prev = null;
    this.m_next = null;
    this.m_linearVelocity.SetV(bd.linearVelocity);
    this.m_angularVelocity = bd.angularVelocity;
    this.m_linearDamping = bd.linearDamping;
    this.m_angularDamping = bd.angularDamping;
    this.m_force.Set(0, 0);
    this.m_torque = 0;
    this.m_sleepTime = 0;
    this.m_type = bd.type;
    if (this.m_type == b2Body.b2_dynamicBody) {
      this.m_mass = 1;
      this.m_invMass = 1;
    } else {
      this.m_mass = 0;
      this.m_invMass = 0;
    }
    this.m_I = 0;
    this.m_invI = 0;
    this.m_inertiaScale = bd.inertiaScale;
    this.m_userData = bd.userData;
    this.m_fixtureList = null;
    this.m_fixtureCount = 0;
  };
  b2Body.prototype.SynchronizeFixtures = function () {
    var xf1 = b2Body.s_xf1;
    xf1.R.Set(this.m_sweep.a0);
    var tMat = xf1.R;
    var tVec = this.m_sweep.localCenter;
    xf1.position.x =
      this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    xf1.position.y =
      this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    var f;
    var broadPhase = this.m_world.m_contactManager.m_broadPhase;
    for (f = this.m_fixtureList; f; f = f.m_next)
      f.Synchronize(broadPhase, xf1, this.m_xf);
  };
  b2Body.prototype.SynchronizeTransform = function () {
    this.m_xf.R.Set(this.m_sweep.a);
    var tMat = this.m_xf.R;
    var tVec = this.m_sweep.localCenter;
    this.m_xf.position.x =
      this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
    this.m_xf.position.y =
      this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
  };
  b2Body.prototype.ShouldCollide = function (other) {
    if (
      this.m_type != b2Body.b2_dynamicBody &&
      other.m_type != b2Body.b2_dynamicBody
    )
      return false;
    for (var jn = this.m_jointList; jn; jn = jn.next)
      if (jn.other == other)
        if (jn.joint.m_collideConnected == false) return false;
    return true;
  };
  b2Body.prototype.Advance = function (t) {
    if (t === undefined) t = 0;
    this.m_sweep.Advance(t);
    this.m_sweep.c.SetV(this.m_sweep.c0);
    this.m_sweep.a = this.m_sweep.a0;
    this.SynchronizeTransform();
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.b2Body.s_xf1 = new b2Transform();
    Box2D.Dynamics.b2Body.e_islandFlag = 1;
    Box2D.Dynamics.b2Body.e_awakeFlag = 2;
    Box2D.Dynamics.b2Body.e_allowSleepFlag = 4;
    Box2D.Dynamics.b2Body.e_bulletFlag = 8;
    Box2D.Dynamics.b2Body.e_fixedRotationFlag = 16;
    Box2D.Dynamics.b2Body.e_activeFlag = 32;
    Box2D.Dynamics.b2Body.b2_staticBody = 0;
    Box2D.Dynamics.b2Body.b2_kinematicBody = 1;
    Box2D.Dynamics.b2Body.b2_dynamicBody = 2;
  });
  b2BodyDef.b2BodyDef = function () {
    this.position = new b2Vec2();
    this.linearVelocity = new b2Vec2();
  };
  b2BodyDef.prototype.b2BodyDef = function () {
    this.userData = null;
    this.position.Set(0, 0);
    this.angle = 0;
    this.linearVelocity.Set(0, 0);
    this.angularVelocity = 0;
    this.linearDamping = 0;
    this.angularDamping = 0;
    this.allowSleep = true;
    this.awake = true;
    this.fixedRotation = false;
    this.bullet = false;
    this.type = b2Body.b2_staticBody;
    this.active = true;
    this.inertiaScale = 1;
  };
  b2ContactFilter.b2ContactFilter = function () {};
  b2ContactFilter.prototype.ShouldCollide = function (fixtureA, fixtureB) {
    var filter1 = fixtureA.GetFilterData();
    var filter2 = fixtureB.GetFilterData();
    if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0)
      return filter1.groupIndex > 0;
    var collide =
      (filter1.maskBits & filter2.categoryBits) != 0 &&
      (filter1.categoryBits & filter2.maskBits) != 0;
    return collide;
  };
  b2ContactFilter.prototype.RayCollide = function (userData, fixture) {
    if (!userData) return true;
    return this.ShouldCollide(
      userData instanceof b2Fixture ? userData : null,
      fixture
    );
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
  });
  b2ContactImpulse.b2ContactImpulse = function () {
    this.normalImpulses = new Vector_a2j_Number(
      b2Settings.b2_maxManifoldPoints
    );
    this.tangentImpulses = new Vector_a2j_Number(
      b2Settings.b2_maxManifoldPoints
    );
  };
  b2ContactListener.b2ContactListener = function () {};
  b2ContactListener.prototype.BeginContact = function (contact) {};
  b2ContactListener.prototype.EndContact = function (contact) {};
  b2ContactListener.prototype.PreSolve = function (contact, oldManifold) {};
  b2ContactListener.prototype.PostSolve = function (contact, impulse) {};
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.b2ContactListener.b2_defaultListener =
      new b2ContactListener();
  });
  b2ContactManager.b2ContactManager = function () {};
  b2ContactManager.prototype.b2ContactManager = function () {
    this.m_world = null;
    this.m_contactCount = 0;
    this.m_contactFilter = b2ContactFilter.b2_defaultFilter;
    this.m_contactListener = b2ContactListener.b2_defaultListener;
    this.m_contactFactory = new b2ContactFactory(this.m_allocator);
    this.m_broadPhase = new b2DynamicTreeBroadPhase();
  };
  b2ContactManager.prototype.AddPair = function (
    proxyUserDataA,
    proxyUserDataB
  ) {
    var fixtureA = proxyUserDataA instanceof b2Fixture ? proxyUserDataA : null;
    var fixtureB = proxyUserDataB instanceof b2Fixture ? proxyUserDataB : null;
    var bodyA = fixtureA.GetBody();
    var bodyB = fixtureB.GetBody();
    if (bodyA == bodyB) return;
    var edge = bodyB.GetContactList();
    while (edge) {
      if (edge.other == bodyA) {
        var fA = edge.contact.GetFixtureA();
        var fB = edge.contact.GetFixtureB();
        if (fA == fixtureA && fB == fixtureB) return;
        if (fA == fixtureB && fB == fixtureA) return;
      }
      edge = edge.next;
    }
    if (bodyB.ShouldCollide(bodyA) == false) return;
    if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) return;
    var c = this.m_contactFactory.Create(fixtureA, fixtureB);
    fixtureA = c.GetFixtureA();
    fixtureB = c.GetFixtureB();
    bodyA = fixtureA.m_body;
    bodyB = fixtureB.m_body;
    c.m_prev = null;
    c.m_next = this.m_world.m_contactList;
    if (this.m_world.m_contactList != null)
      this.m_world.m_contactList.m_prev = c;
    this.m_world.m_contactList = c;
    c.m_nodeA.contact = c;
    c.m_nodeA.other = bodyB;
    c.m_nodeA.prev = null;
    c.m_nodeA.next = bodyA.m_contactList;
    if (bodyA.m_contactList != null) bodyA.m_contactList.prev = c.m_nodeA;
    bodyA.m_contactList = c.m_nodeA;
    c.m_nodeB.contact = c;
    c.m_nodeB.other = bodyA;
    c.m_nodeB.prev = null;
    c.m_nodeB.next = bodyB.m_contactList;
    if (bodyB.m_contactList != null) bodyB.m_contactList.prev = c.m_nodeB;
    bodyB.m_contactList = c.m_nodeB;
    ++this.m_world.m_contactCount;
    return;
  };
  b2ContactManager.prototype.FindNewContacts = function () {
    this.m_broadPhase.UpdatePairs(Box2D.generateCallback(this, this.AddPair));
  };
  b2ContactManager.prototype.Destroy = function (c) {
    var fixtureA = c.GetFixtureA();
    var fixtureB = c.GetFixtureB();
    var bodyA = fixtureA.GetBody();
    var bodyB = fixtureB.GetBody();
    if (c.IsTouching()) this.m_contactListener.EndContact(c);
    if (c.m_prev) c.m_prev.m_next = c.m_next;
    if (c.m_next) c.m_next.m_prev = c.m_prev;
    if (c == this.m_world.m_contactList) this.m_world.m_contactList = c.m_next;
    if (c.m_nodeA.prev) c.m_nodeA.prev.next = c.m_nodeA.next;
    if (c.m_nodeA.next) c.m_nodeA.next.prev = c.m_nodeA.prev;
    if (c.m_nodeA == bodyA.m_contactList) bodyA.m_contactList = c.m_nodeA.next;
    if (c.m_nodeB.prev) c.m_nodeB.prev.next = c.m_nodeB.next;
    if (c.m_nodeB.next) c.m_nodeB.next.prev = c.m_nodeB.prev;
    if (c.m_nodeB == bodyB.m_contactList) bodyB.m_contactList = c.m_nodeB.next;
    this.m_contactFactory.Destroy(c);
    --this.m_contactCount;
  };
  b2ContactManager.prototype.Collide = function () {
    var c = this.m_world.m_contactList;
    while (c) {
      var fixtureA = c.GetFixtureA();
      var fixtureB = c.GetFixtureB();
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (bodyA.IsAwake() == false && bodyB.IsAwake() == false) {
        c = c.GetNext();
        continue;
      }
      if (c.m_flags & b2Contact.e_filterFlag) {
        if (bodyB.ShouldCollide(bodyA) == false) {
          var cNuke = c;
          c = cNuke.GetNext();
          this.Destroy(cNuke);
          continue;
        }
        if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
          cNuke = c;
          c = cNuke.GetNext();
          this.Destroy(cNuke);
          continue;
        }
        c.m_flags &= ~b2Contact.e_filterFlag;
      }
      var proxyA = fixtureA.m_proxy;
      var proxyB = fixtureB.m_proxy;
      var overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
      if (overlap == false) {
        cNuke = c;
        c = cNuke.GetNext();
        this.Destroy(cNuke);
        continue;
      }
      c.Update(this.m_contactListener);
      c = c.GetNext();
    }
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.b2ContactManager.s_evalCP = new b2ContactPoint();
  });
  b2DebugDraw.b2DebugDraw = function () {};
  b2DebugDraw.prototype.b2DebugDraw = function () {};
  b2DebugDraw.prototype.SetFlags = function (flags) {
    if (flags === undefined) flags = 0;
  };
  b2DebugDraw.prototype.GetFlags = function () {};
  b2DebugDraw.prototype.AppendFlags = function (flags) {
    if (flags === undefined) flags = 0;
  };
  b2DebugDraw.prototype.ClearFlags = function (flags) {
    if (flags === undefined) flags = 0;
  };
  b2DebugDraw.prototype.SetSprite = function (sprite) {};
  b2DebugDraw.prototype.GetSprite = function () {};
  b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
    if (drawScale === undefined) drawScale = 0;
  };
  b2DebugDraw.prototype.GetDrawScale = function () {};
  b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
    if (lineThickness === undefined) lineThickness = 0;
  };
  b2DebugDraw.prototype.GetLineThickness = function () {};
  b2DebugDraw.prototype.SetAlpha = function (alpha) {
    if (alpha === undefined) alpha = 0;
  };
  b2DebugDraw.prototype.GetAlpha = function () {};
  b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
    if (alpha === undefined) alpha = 0;
  };
  b2DebugDraw.prototype.GetFillAlpha = function () {};
  b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
    if (xformScale === undefined) xformScale = 0;
  };
  b2DebugDraw.prototype.GetXFormScale = function () {};
  b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
    if (vertexCount === undefined) vertexCount = 0;
  };
  b2DebugDraw.prototype.DrawSolidPolygon = function (
    vertices,
    vertexCount,
    color
  ) {
    if (vertexCount === undefined) vertexCount = 0;
  };
  b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
    if (radius === undefined) radius = 0;
  };
  b2DebugDraw.prototype.DrawSolidCircle = function (
    center,
    radius,
    axis,
    color
  ) {
    if (radius === undefined) radius = 0;
  };
  b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {};
  b2DebugDraw.prototype.DrawTransform = function (xf) {};
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.b2DebugDraw.e_shapeBit = 1;
    Box2D.Dynamics.b2DebugDraw.e_jointBit = 2;
    Box2D.Dynamics.b2DebugDraw.e_aabbBit = 4;
    Box2D.Dynamics.b2DebugDraw.e_pairBit = 8;
    Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit = 16;
    Box2D.Dynamics.b2DebugDraw.e_controllerBit = 32;
  });
  b2DestructionListener.b2DestructionListener = function () {};
  b2DestructionListener.prototype.SayGoodbyeJoint = function (joint) {};
  b2DestructionListener.prototype.SayGoodbyeFixture = function (fixture) {};
  b2FilterData.b2FilterData = function () {
    this.categoryBits = 1;
    this.maskBits = 65535;
    this.groupIndex = 0;
  };
  b2FilterData.prototype.Copy = function () {
    var copy = new b2FilterData();
    copy.categoryBits = this.categoryBits;
    copy.maskBits = this.maskBits;
    copy.groupIndex = this.groupIndex;
    return copy;
  };
  b2Fixture.b2Fixture = function () {
    this.m_filter = new b2FilterData();
  };
  b2Fixture.prototype.GetType = function () {
    return this.m_shape.GetType();
  };
  b2Fixture.prototype.GetShape = function () {
    return this.m_shape;
  };
  b2Fixture.prototype.SetSensor = function (sensor) {
    if (this.m_isSensor == sensor) return;
    this.m_isSensor = sensor;
    if (this.m_body == null) return;
    var edge = this.m_body.GetContactList();
    while (edge) {
      var contact = edge.contact;
      var fixtureA = contact.GetFixtureA();
      var fixtureB = contact.GetFixtureB();
      if (fixtureA == this || fixtureB == this)
        contact.SetSensor(fixtureA.IsSensor() || fixtureB.IsSensor());
      edge = edge.next;
    }
  };
  b2Fixture.prototype.IsSensor = function () {
    return this.m_isSensor;
  };
  b2Fixture.prototype.SetFilterData = function (filter) {
    this.m_filter = filter.Copy();
    if (this.m_body) return;
    var edge = this.m_body.GetContactList();
    while (edge) {
      var contact = edge.contact;
      var fixtureA = contact.GetFixtureA();
      var fixtureB = contact.GetFixtureB();
      if (fixtureA == this || fixtureB == this) contact.FlagForFiltering();
      edge = edge.next;
    }
  };
  b2Fixture.prototype.GetFilterData = function () {
    return this.m_filter.Copy();
  };
  b2Fixture.prototype.GetBody = function () {
    return this.m_body;
  };
  b2Fixture.prototype.GetNext = function () {
    return this.m_next;
  };
  b2Fixture.prototype.GetUserData = function () {
    return this.m_userData;
  };
  b2Fixture.prototype.SetUserData = function (data) {
    this.m_userData = data;
  };
  b2Fixture.prototype.TestPoint = function (p) {
    return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
  };
  b2Fixture.prototype.RayCast = function (output, input) {
    return this.m_shape.RayCast(output, input, this.m_body.GetTransform());
  };
  b2Fixture.prototype.GetMassData = function (massData) {
    if (massData === undefined) massData = null;
    if (massData == null) massData = new b2MassData();
    this.m_shape.ComputeMass(massData, this.m_density);
    return massData;
  };
  b2Fixture.prototype.SetDensity = function (density) {
    if (density === undefined) density = 0;
    this.m_density = density;
  };
  b2Fixture.prototype.GetDensity = function () {
    return this.m_density;
  };
  b2Fixture.prototype.GetFriction = function () {
    return this.m_friction;
  };
  b2Fixture.prototype.SetFriction = function (friction) {
    if (friction === undefined) friction = 0;
    this.m_friction = friction;
  };
  b2Fixture.prototype.GetRestitution = function () {
    return this.m_restitution;
  };
  b2Fixture.prototype.SetRestitution = function (restitution) {
    if (restitution === undefined) restitution = 0;
    this.m_restitution = restitution;
  };
  b2Fixture.prototype.GetAABB = function () {
    return this.m_aabb;
  };
  b2Fixture.prototype.b2Fixture = function () {
    this.m_aabb = new b2AABB();
    this.m_userData = null;
    this.m_body = null;
    this.m_next = null;
    this.m_shape = null;
    this.m_density = 0;
    this.m_friction = 0;
    this.m_restitution = 0;
  };
  b2Fixture.prototype.Create = function (body, xf, def) {
    this.m_userData = def.userData;
    this.m_friction = def.friction;
    this.m_restitution = def.restitution;
    this.m_body = body;
    this.m_next = null;
    this.m_filter = def.filter.Copy();
    this.m_isSensor = def.isSensor;
    this.m_shape = def.shape.Copy();
    this.m_density = def.density;
  };
  b2Fixture.prototype.Destroy = function () {
    this.m_shape = null;
  };
  b2Fixture.prototype.CreateProxy = function (broadPhase, xf) {
    this.m_shape.ComputeAABB(this.m_aabb, xf);
    this.m_proxy = broadPhase.CreateProxy(this.m_aabb, this);
  };
  b2Fixture.prototype.DestroyProxy = function (broadPhase) {
    if (this.m_proxy == null) return;
    broadPhase.DestroyProxy(this.m_proxy);
    this.m_proxy = null;
  };
  b2Fixture.prototype.Synchronize = function (
    broadPhase,
    transform1,
    transform2
  ) {
    if (!this.m_proxy) return;
    var aabb1 = new b2AABB();
    var aabb2 = new b2AABB();
    this.m_shape.ComputeAABB(aabb1, transform1);
    this.m_shape.ComputeAABB(aabb2, transform2);
    this.m_aabb.Combine(aabb1, aabb2);
    var displacement = b2Math.SubtractVV(
      transform2.position,
      transform1.position
    );
    broadPhase.MoveProxy(this.m_proxy, this.m_aabb, displacement);
  };
  b2FixtureDef.b2FixtureDef = function () {
    this.filter = new b2FilterData();
  };
  b2FixtureDef.prototype.b2FixtureDef = function () {
    this.shape = null;
    this.userData = null;
    this.friction = 0.2;
    this.restitution = 0;
    this.density = 0;
    this.filter.categoryBits = 1;
    this.filter.maskBits = 65535;
    this.filter.groupIndex = 0;
    this.isSensor = false;
  };
  b2Island.b2Island = function () {};
  b2Island.prototype.b2Island = function () {
    this.m_bodies = new Vector2();
    this.m_contacts = new Vector2();
    this.m_joints = new Vector2();
  };
  b2Island.prototype.Initialize = function (
    bodyCapacity,
    contactCapacity,
    jointCapacity,
    allocator,
    listener,
    contactSolver
  ) {
    if (bodyCapacity === undefined) bodyCapacity = 0;
    if (contactCapacity === undefined) contactCapacity = 0;
    if (jointCapacity === undefined) jointCapacity = 0;
    var i = 0;
    this.m_bodyCapacity = bodyCapacity;
    this.m_contactCapacity = contactCapacity;
    this.m_jointCapacity = jointCapacity;
    this.m_bodyCount = 0;
    this.m_contactCount = 0;
    this.m_jointCount = 0;
    this.m_allocator = allocator;
    this.m_listener = listener;
    this.m_contactSolver = contactSolver;
    for (i = this.m_bodies.length; i < bodyCapacity; i++)
      this.m_bodies[i] = null;
    for (i = this.m_contacts.length; i < contactCapacity; i++)
      this.m_contacts[i] = null;
    for (i = this.m_joints.length; i < jointCapacity; i++)
      this.m_joints[i] = null;
  };
  b2Island.prototype.Clear = function () {
    this.m_bodyCount = 0;
    this.m_contactCount = 0;
    this.m_jointCount = 0;
  };
  b2Island.prototype.Solve = function (step, gravity, allowSleep) {
    var i = 0;
    var j = 0;
    var b;
    var joint;
    for (i = 0; i < this.m_bodyCount; ++i) {
      b = this.m_bodies[i];
      if (b.GetType() != b2Body.b2_dynamicBody) continue;
      b.m_linearVelocity.x += step.dt * (gravity.x + b.m_invMass * b.m_force.x);
      b.m_linearVelocity.y += step.dt * (gravity.y + b.m_invMass * b.m_force.y);
      b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
      b.m_linearVelocity.Multiply(
        b2Math.Clamp(1 - step.dt * b.m_linearDamping, 0, 1)
      );
      b.m_angularVelocity *= b2Math.Clamp(
        1 - step.dt * b.m_angularDamping,
        0,
        1
      );
    }
    this.m_contactSolver.Initialize(
      step,
      this.m_contacts,
      this.m_contactCount,
      this.m_allocator
    );
    var contactSolver = this.m_contactSolver;
    contactSolver.InitVelocityConstraints(step);
    for (i = 0; i < this.m_jointCount; ++i) {
      joint = this.m_joints[i];
      joint.InitVelocityConstraints(step);
    }
    for (i = 0; i < step.velocityIterations; ++i) {
      for (j = 0; j < this.m_jointCount; ++j) {
        joint = this.m_joints[j];
        joint.SolveVelocityConstraints(step);
      }
      contactSolver.SolveVelocityConstraints();
    }
    for (i = 0; i < this.m_jointCount; ++i) {
      joint = this.m_joints[i];
      joint.FinalizeVelocityConstraints();
    }
    contactSolver.FinalizeVelocityConstraints();
    for (i = 0; i < this.m_bodyCount; ++i) {
      b = this.m_bodies[i];
      if (b.GetType() == b2Body.b2_staticBody) continue;
      var translationX = step.dt * b.m_linearVelocity.x;
      var translationY = step.dt * b.m_linearVelocity.y;
      if (
        translationX * translationX + translationY * translationY >
        b2Settings.b2_maxTranslationSquared
      ) {
        b.m_linearVelocity.Normalize();
        b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * step.inv_dt;
        b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * step.inv_dt;
      }
      var rotation = step.dt * b.m_angularVelocity;
      if (rotation * rotation > b2Settings.b2_maxRotationSquared)
        if (b.m_angularVelocity < 0)
          b.m_angularVelocity = -b2Settings.b2_maxRotation * step.inv_dt;
        else b.m_angularVelocity = b2Settings.b2_maxRotation * step.inv_dt;
      b.m_sweep.c0.SetV(b.m_sweep.c);
      b.m_sweep.a0 = b.m_sweep.a;
      b.m_sweep.c.x += step.dt * b.m_linearVelocity.x;
      b.m_sweep.c.y += step.dt * b.m_linearVelocity.y;
      b.m_sweep.a += step.dt * b.m_angularVelocity;
      b.SynchronizeTransform();
    }
    for (i = 0; i < step.positionIterations; ++i) {
      var contactsOkay = contactSolver.SolvePositionConstraints(
        b2Settings.b2_contactBaumgarte
      );
      var jointsOkay = true;
      for (j = 0; j < this.m_jointCount; ++j) {
        joint = this.m_joints[j];
        var jointOkay = joint.SolvePositionConstraints(
          b2Settings.b2_contactBaumgarte
        );
        jointsOkay = jointsOkay && jointOkay;
      }
      if (contactsOkay && jointsOkay) break;
    }
    this.Report(contactSolver.m_constraints);
    if (allowSleep) {
      var minSleepTime = Number.MAX_VALUE;
      var linTolSqr =
        b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
      var angTolSqr =
        b2Settings.b2_angularSleepTolerance *
        b2Settings.b2_angularSleepTolerance;
      for (i = 0; i < this.m_bodyCount; ++i) {
        b = this.m_bodies[i];
        if (b.GetType() == b2Body.b2_staticBody) continue;
        if ((b.m_flags & b2Body.e_allowSleepFlag) == 0) {
          b.m_sleepTime = 0;
          minSleepTime = 0;
        }
        if (
          (b.m_flags & b2Body.e_allowSleepFlag) == 0 ||
          b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
          b2Math.Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr
        ) {
          b.m_sleepTime = 0;
          minSleepTime = 0;
        } else {
          b.m_sleepTime += step.dt;
          minSleepTime = b2Math.Min(minSleepTime, b.m_sleepTime);
        }
      }
      if (minSleepTime >= b2Settings.b2_timeToSleep)
        for (i = 0; i < this.m_bodyCount; ++i) {
          b = this.m_bodies[i];
          b.SetAwake(false);
        }
    }
  };
  b2Island.prototype.SolveTOI = function (subStep) {
    var i = 0;
    var j = 0;
    this.m_contactSolver.Initialize(
      subStep,
      this.m_contacts,
      this.m_contactCount,
      this.m_allocator
    );
    var contactSolver = this.m_contactSolver;
    for (i = 0; i < this.m_jointCount; ++i)
      this.m_joints[i].InitVelocityConstraints(subStep);
    for (i = 0; i < subStep.velocityIterations; ++i) {
      contactSolver.SolveVelocityConstraints();
      for (j = 0; j < this.m_jointCount; ++j)
        this.m_joints[j].SolveVelocityConstraints(subStep);
    }
    for (i = 0; i < this.m_bodyCount; ++i) {
      var b = this.m_bodies[i];
      if (b.GetType() == b2Body.b2_staticBody) continue;
      var translationX = subStep.dt * b.m_linearVelocity.x;
      var translationY = subStep.dt * b.m_linearVelocity.y;
      if (
        translationX * translationX + translationY * translationY >
        b2Settings.b2_maxTranslationSquared
      ) {
        b.m_linearVelocity.Normalize();
        b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * subStep.inv_dt;
        b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * subStep.inv_dt;
      }
      var rotation = subStep.dt * b.m_angularVelocity;
      if (rotation * rotation > b2Settings.b2_maxRotationSquared)
        if (b.m_angularVelocity < 0)
          b.m_angularVelocity = -b2Settings.b2_maxRotation * subStep.inv_dt;
        else b.m_angularVelocity = b2Settings.b2_maxRotation * subStep.inv_dt;
      b.m_sweep.c0.SetV(b.m_sweep.c);
      b.m_sweep.a0 = b.m_sweep.a;
      b.m_sweep.c.x += subStep.dt * b.m_linearVelocity.x;
      b.m_sweep.c.y += subStep.dt * b.m_linearVelocity.y;
      b.m_sweep.a += subStep.dt * b.m_angularVelocity;
      b.SynchronizeTransform();
    }
    var k_toiBaumgarte = 0.75;
    for (i = 0; i < subStep.positionIterations; ++i) {
      var contactsOkay = contactSolver.SolvePositionConstraints(k_toiBaumgarte);
      var jointsOkay = true;
      for (j = 0; j < this.m_jointCount; ++j) {
        var jointOkay = this.m_joints[j].SolvePositionConstraints(
          b2Settings.b2_contactBaumgarte
        );
        jointsOkay = jointsOkay && jointOkay;
      }
      if (contactsOkay && jointsOkay) break;
    }
    this.Report(contactSolver.m_constraints);
  };
  b2Island.prototype.Report = function (constraints) {
    if (this.m_listener == null) return;
    for (var i = 0; i < this.m_contactCount; ++i) {
      var c = this.m_contacts[i];
      var cc = constraints[i];
      for (var j = 0; j < cc.pointCount; ++j) {
        b2Island.s_impulse.normalImpulses[j] = cc.points[j].normalImpulse;
        b2Island.s_impulse.tangentImpulses[j] = cc.points[j].tangentImpulse;
      }
      this.m_listener.PostSolve(c, b2Island.s_impulse);
    }
  };
  b2Island.prototype.AddBody = function (body) {
    body.m_islandIndex = this.m_bodyCount;
    this.m_bodies[this.m_bodyCount++] = body;
  };
  b2Island.prototype.AddContact = function (contact) {
    this.m_contacts[this.m_contactCount++] = contact;
  };
  b2Island.prototype.AddJoint = function (joint) {
    this.m_joints[this.m_jointCount++] = joint;
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.b2Island.s_impulse = new b2ContactImpulse();
  });
  b2TimeStep.b2TimeStep = function () {};
  b2TimeStep.prototype.Set = function (step) {
    this.dt = step.dt;
    this.inv_dt = step.inv_dt;
    this.positionIterations = step.positionIterations;
    this.velocityIterations = step.velocityIterations;
    this.warmStarting = step.warmStarting;
  };
  b2World.b2World = function () {
    this.s_stack = new Vector2();
    this.m_contactManager = new b2ContactManager();
    this.m_contactSolver = new b2ContactSolver();
    this.m_island = new b2Island();
  };
  b2World.prototype.b2World = function (gravity, doSleep) {
    this.m_destructionListener = null;
    this.m_debugDraw = null;
    this.m_bodyList = null;
    this.m_contactList = null;
    this.m_jointList = null;
    this.m_controllerList = null;
    this.m_bodyCount = 0;
    this.m_contactCount = 0;
    this.m_jointCount = 0;
    this.m_controllerCount = 0;
    b2World.m_warmStarting = true;
    b2World.m_continuousPhysics = true;
    this.m_allowSleep = doSleep;
    this.m_gravity = gravity;
    this.m_inv_dt0 = 0;
    this.m_contactManager.m_world = this;
    var bd = new b2BodyDef();
    this.m_groundBody = this.CreateBody(bd);
  };
  b2World.prototype.SetDestructionListener = function (listener) {
    this.m_destructionListener = listener;
  };
  b2World.prototype.SetContactFilter = function (filter) {
    this.m_contactManager.m_contactFilter = filter;
  };
  b2World.prototype.SetContactListener = function (listener) {
    this.m_contactManager.m_contactListener = listener;
  };
  b2World.prototype.SetDebugDraw = function (debugDraw) {
    this.m_debugDraw = debugDraw;
  };
  b2World.prototype.SetBroadPhase = function (broadPhase) {
    var oldBroadPhase = this.m_contactManager.m_broadPhase;
    this.m_contactManager.m_broadPhase = broadPhase;
    for (var b = this.m_bodyList; b; b = b.m_next)
      for (var f = b.m_fixtureList; f; f = f.m_next)
        f.m_proxy = broadPhase.CreateProxy(
          oldBroadPhase.GetFatAABB(f.m_proxy),
          f
        );
  };
  b2World.prototype.Validate = function () {
    this.m_contactManager.m_broadPhase.Validate();
  };
  b2World.prototype.GetProxyCount = function () {
    return this.m_contactManager.m_broadPhase.GetProxyCount();
  };
  b2World.prototype.CreateBody = function (def) {
    if (this.IsLocked() == true) return null;
    var b = new b2Body(def, this);
    b.m_prev = null;
    b.m_next = this.m_bodyList;
    if (this.m_bodyList) this.m_bodyList.m_prev = b;
    this.m_bodyList = b;
    ++this.m_bodyCount;
    return b;
  };
  b2World.prototype.DestroyBody = function (b) {
    if (this.IsLocked() == true) return;
    var jn = b.m_jointList;
    while (jn) {
      var jn0 = jn;
      jn = jn.next;
      if (this.m_destructionListener)
        this.m_destructionListener.SayGoodbyeJoint(jn0.joint);
      this.DestroyJoint(jn0.joint);
    }
    var coe = b.m_controllerList;
    while (coe) {
      var coe0 = coe;
      coe = coe.nextController;
      coe0.controller.RemoveBody(b);
    }
    var ce = b.m_contactList;
    while (ce) {
      var ce0 = ce;
      ce = ce.next;
      this.m_contactManager.Destroy(ce0.contact);
    }
    b.m_contactList = null;
    var f = b.m_fixtureList;
    while (f) {
      var f0 = f;
      f = f.m_next;
      if (this.m_destructionListener)
        this.m_destructionListener.SayGoodbyeFixture(f0);
      f0.DestroyProxy(this.m_contactManager.m_broadPhase);
      f0.Destroy();
    }
    b.m_fixtureList = null;
    b.m_fixtureCount = 0;
    if (b.m_prev) b.m_prev.m_next = b.m_next;
    if (b.m_next) b.m_next.m_prev = b.m_prev;
    if (b == this.m_bodyList) this.m_bodyList = b.m_next;
    --this.m_bodyCount;
  };
  b2World.prototype.CreateJoint = function (def) {
    var j = b2Joint.Create(def, null);
    j.m_prev = null;
    j.m_next = this.m_jointList;
    if (this.m_jointList) this.m_jointList.m_prev = j;
    this.m_jointList = j;
    ++this.m_jointCount;
    j.m_edgeA.joint = j;
    j.m_edgeA.other = j.m_bodyB;
    j.m_edgeA.prev = null;
    j.m_edgeA.next = j.m_bodyA.m_jointList;
    if (j.m_bodyA.m_jointList) j.m_bodyA.m_jointList.prev = j.m_edgeA;
    j.m_bodyA.m_jointList = j.m_edgeA;
    j.m_edgeB.joint = j;
    j.m_edgeB.other = j.m_bodyA;
    j.m_edgeB.prev = null;
    j.m_edgeB.next = j.m_bodyB.m_jointList;
    if (j.m_bodyB.m_jointList) j.m_bodyB.m_jointList.prev = j.m_edgeB;
    j.m_bodyB.m_jointList = j.m_edgeB;
    var bodyA = def.bodyA;
    var bodyB = def.bodyB;
    if (def.collideConnected == false) {
      var edge = bodyB.GetContactList();
      while (edge) {
        if (edge.other == bodyA) edge.contact.FlagForFiltering();
        edge = edge.next;
      }
    }
    return j;
  };
  b2World.prototype.DestroyJoint = function (j) {
    var collideConnected = j.m_collideConnected;
    if (j.m_prev) j.m_prev.m_next = j.m_next;
    if (j.m_next) j.m_next.m_prev = j.m_prev;
    if (j == this.m_jointList) this.m_jointList = j.m_next;
    var bodyA = j.m_bodyA;
    var bodyB = j.m_bodyB;
    bodyA.SetAwake(true);
    bodyB.SetAwake(true);
    if (j.m_edgeA.prev) j.m_edgeA.prev.next = j.m_edgeA.next;
    if (j.m_edgeA.next) j.m_edgeA.next.prev = j.m_edgeA.prev;
    if (j.m_edgeA == bodyA.m_jointList) bodyA.m_jointList = j.m_edgeA.next;
    j.m_edgeA.prev = null;
    j.m_edgeA.next = null;
    if (j.m_edgeB.prev) j.m_edgeB.prev.next = j.m_edgeB.next;
    if (j.m_edgeB.next) j.m_edgeB.next.prev = j.m_edgeB.prev;
    if (j.m_edgeB == bodyB.m_jointList) bodyB.m_jointList = j.m_edgeB.next;
    j.m_edgeB.prev = null;
    j.m_edgeB.next = null;
    b2Joint.Destroy(j, null);
    --this.m_jointCount;
    if (collideConnected == false) {
      var edge = bodyB.GetContactList();
      while (edge) {
        if (edge.other == bodyA) edge.contact.FlagForFiltering();
        edge = edge.next;
      }
    }
  };
  b2World.prototype.AddController = function (c) {
    c.m_next = this.m_controllerList;
    c.m_prev = null;
    this.m_controllerList = c;
    c.m_world = this;
    this.m_controllerCount++;
    return c;
  };
  b2World.prototype.RemoveController = function (c) {
    if (c.m_prev) c.m_prev.m_next = c.m_next;
    if (c.m_next) c.m_next.m_prev = c.m_prev;
    if (this.m_controllerList == c) this.m_controllerList = c.m_next;
    this.m_controllerCount--;
  };
  b2World.prototype.CreateController = function (controller) {
    if (controller.m_world != this)
      throw new Error("Controller can only be a member of one world");
    controller.m_next = this.m_controllerList;
    controller.m_prev = null;
    if (this.m_controllerList) this.m_controllerList.m_prev = controller;
    this.m_controllerList = controller;
    ++this.m_controllerCount;
    controller.m_world = this;
    return controller;
  };
  b2World.prototype.DestroyController = function (controller) {
    controller.Clear();
    if (controller.m_next) controller.m_next.m_prev = controller.m_prev;
    if (controller.m_prev) controller.m_prev.m_next = controller.m_next;
    if (controller == this.m_controllerList)
      this.m_controllerList = controller.m_next;
    --this.m_controllerCount;
  };
  b2World.prototype.SetWarmStarting = function (flag) {
    b2World.m_warmStarting = flag;
  };
  b2World.prototype.SetContinuousPhysics = function (flag) {
    b2World.m_continuousPhysics = flag;
  };
  b2World.prototype.GetBodyCount = function () {
    return this.m_bodyCount;
  };
  b2World.prototype.GetJointCount = function () {
    return this.m_jointCount;
  };
  b2World.prototype.GetContactCount = function () {
    return this.m_contactCount;
  };
  b2World.prototype.SetGravity = function (gravity) {
    this.m_gravity = gravity;
  };
  b2World.prototype.GetGravity = function () {
    return this.m_gravity;
  };
  b2World.prototype.GetGroundBody = function () {
    return this.m_groundBody;
  };
  b2World.prototype.Step = function (
    dt,
    velocityIterations,
    positionIterations
  ) {
    if (dt === undefined) dt = 0;
    if (velocityIterations === undefined) velocityIterations = 0;
    if (positionIterations === undefined) positionIterations = 0;
    if (this.m_flags & b2World.e_newFixture) {
      this.m_contactManager.FindNewContacts();
      this.m_flags &= ~b2World.e_newFixture;
    }
    this.m_flags |= b2World.e_locked;
    var step = b2World.s_timestep2;
    step.dt = dt;
    step.velocityIterations = velocityIterations;
    step.positionIterations = positionIterations;
    if (dt > 0) step.inv_dt = 1 / dt;
    else step.inv_dt = 0;
    step.dtRatio = this.m_inv_dt0 * dt;
    step.warmStarting = b2World.m_warmStarting;
    this.m_contactManager.Collide();
    if (step.dt > 0) this.Solve(step);
    if (b2World.m_continuousPhysics && step.dt > 0) this.SolveTOI(step);
    if (step.dt > 0) this.m_inv_dt0 = step.inv_dt;
    this.m_flags &= ~b2World.e_locked;
  };
  b2World.prototype.ClearForces = function () {
    for (var body = this.m_bodyList; body; body = body.m_next) {
      body.m_force.SetZero();
      body.m_torque = 0;
    }
  };
  b2World.prototype.DrawDebugData = function () {
    if (this.m_debugDraw == null) return;
    var flags = this.m_debugDraw.GetFlags();
    var i = 0;
    var b;
    var f;
    var s;
    var j;
    var bp;
    var invQ = new b2Vec2();
    var x1 = new b2Vec2();
    var x2 = new b2Vec2();
    var xf;
    var b1 = new b2AABB();
    var b2 = new b2AABB();
    var vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
    var color = new b2Color(0, 0, 0);
    if (flags & b2DebugDraw.e_shapeBit)
      for (b = this.m_bodyList; b; b = b.m_next) {
        xf = b.m_xf;
        for (f = b.GetFixtureList(); f; f = f.m_next) {
          s = f.GetShape();
          if (b.IsActive() == false) {
            color.Set(0.5, 0.5, 0.3);
            this.DrawShape(s, xf, color);
          } else if (b.GetType() == b2Body.b2_staticBody) {
            color.Set(0.5, 0.9, 0.5);
            this.DrawShape(s, xf, color);
          } else if (b.GetType() == b2Body.b2_kinematicBody) {
            color.Set(0.5, 0.5, 0.9);
            this.DrawShape(s, xf, color);
          } else if (b.IsAwake() == false) {
            color.Set(0.6, 0.6, 0.6);
            this.DrawShape(s, xf, color);
          } else {
            color.Set(0.9, 0.7, 0.7);
            this.DrawShape(s, xf, color);
          }
        }
      }
    if (flags & b2DebugDraw.e_jointBit)
      for (j = this.m_jointList; j; j = j.m_next) this.DrawJoint(j);
    if (flags & b2DebugDraw.e_controllerBit)
      for (var c = this.m_controllerList; c; c = c.m_next)
        c.Draw(this.m_debugDraw);
    if (flags & b2DebugDraw.e_pairBit) {
      color.Set(0.3, 0.9, 0.9);
      for (
        var contact = this.m_contactManager.m_contactList;
        contact;
        contact = contact.GetNext()
      ) {
        var fixtureA = contact.GetFixtureA();
        var fixtureB = contact.GetFixtureB();
        var cA = fixtureA.GetAABB().GetCenter();
        var cB = fixtureB.GetAABB().GetCenter();
        this.m_debugDraw.DrawSegment(cA, cB, color);
      }
    }
    if (flags & b2DebugDraw.e_aabbBit) {
      bp = this.m_contactManager.m_broadPhase;
      vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
      for (b = this.m_bodyList; b; b = b.GetNext()) {
        if (b.IsActive() == false) continue;
        for (f = b.GetFixtureList(); f; f = f.GetNext()) {
          var aabb = bp.GetFatAABB(f.m_proxy);
          vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
          vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
          vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
          vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
          this.m_debugDraw.DrawPolygon(vs, 4, color);
        }
      }
    }
    if (flags & b2DebugDraw.e_centerOfMassBit)
      for (b = this.m_bodyList; b; b = b.m_next) {
        xf = b2World.s_xf;
        xf.R = b.m_xf.R;
        xf.position = b.GetWorldCenter();
        this.m_debugDraw.DrawTransform(xf);
      }
  };
  b2World.prototype.QueryAABB = function (callback, aabb) {
    var __this = this;
    var broadPhase = __this.m_contactManager.m_broadPhase;
    function WorldQueryWrapper(proxy) {
      return callback(broadPhase.GetUserData(proxy));
    }
    broadPhase.Query(WorldQueryWrapper, aabb);
  };
  b2World.prototype.QueryShape = function (callback, shape, transform) {
    var __this = this;
    if (transform === undefined) transform = null;
    if (transform == null) {
      transform = new b2Transform();
      transform.SetIdentity();
    }
    var broadPhase = __this.m_contactManager.m_broadPhase;
    function WorldQueryWrapper(proxy) {
      var fixture =
        broadPhase.GetUserData(proxy) instanceof b2Fixture
          ? broadPhase.GetUserData(proxy)
          : null;
      if (
        b2Shape.TestOverlap(
          shape,
          transform,
          fixture.GetShape(),
          fixture.GetBody().GetTransform()
        )
      )
        return callback(fixture);
      return true;
    }
    var aabb = new b2AABB();
    shape.ComputeAABB(aabb, transform);
    broadPhase.Query(WorldQueryWrapper, aabb);
  };
  b2World.prototype.QueryPoint = function (callback, p) {
    var __this = this;
    var broadPhase = __this.m_contactManager.m_broadPhase;
    function WorldQueryWrapper(proxy) {
      var fixture =
        broadPhase.GetUserData(proxy) instanceof b2Fixture
          ? broadPhase.GetUserData(proxy)
          : null;
      if (fixture.TestPoint(p)) return callback(fixture);
      return true;
    }
    var aabb = new b2AABB();
    aabb.lowerBound.Set(
      p.x - b2Settings.b2_linearSlop,
      p.y - b2Settings.b2_linearSlop
    );
    aabb.upperBound.Set(
      p.x + b2Settings.b2_linearSlop,
      p.y + b2Settings.b2_linearSlop
    );
    broadPhase.Query(WorldQueryWrapper, aabb);
  };
  b2World.prototype.RayCast = function (callback, point1, point2) {
    var __this = this;
    var broadPhase = __this.m_contactManager.m_broadPhase;
    var output = new b2RayCastOutput();
    function RayCastWrapper(input, proxy) {
      var userData = broadPhase.GetUserData(proxy);
      var fixture = userData instanceof b2Fixture ? userData : null;
      var hit = fixture.RayCast(output, input);
      if (hit) {
        var fraction = output.fraction;
        var point = new b2Vec2(
          (1 - fraction) * point1.x + fraction * point2.x,
          (1 - fraction) * point1.y + fraction * point2.y
        );
        return callback(fixture, point, output.normal, fraction);
      }
      return input.maxFraction;
    }
    var input = new b2RayCastInput(point1, point2);
    broadPhase.RayCast(RayCastWrapper, input);
  };
  b2World.prototype.RayCastOne = function (point1, point2) {
    var __this = this;
    var result;
    function RayCastOneWrapper(fixture, point, normal, fraction) {
      if (fraction === undefined) fraction = 0;
      result = fixture;
      return fraction;
    }
    __this.RayCast(RayCastOneWrapper, point1, point2);
    return result;
  };
  b2World.prototype.RayCastAll = function (point1, point2) {
    var __this = this;
    var result = new Vector2();
    function RayCastAllWrapper(fixture, point, normal, fraction) {
      if (fraction === undefined) fraction = 0;
      result[result.length] = fixture;
      return 1;
    }
    __this.RayCast(RayCastAllWrapper, point1, point2);
    return result;
  };
  b2World.prototype.GetBodyList = function () {
    return this.m_bodyList;
  };
  b2World.prototype.GetJointList = function () {
    return this.m_jointList;
  };
  b2World.prototype.GetContactList = function () {
    return this.m_contactList;
  };
  b2World.prototype.IsLocked = function () {
    return (this.m_flags & b2World.e_locked) > 0;
  };
  b2World.prototype.Solve = function (step) {
    var b;
    for (
      var controller = this.m_controllerList;
      controller;
      controller = controller.m_next
    )
      controller.Step(step);
    var island = this.m_island;
    island.Initialize(
      this.m_bodyCount,
      this.m_contactCount,
      this.m_jointCount,
      null,
      this.m_contactManager.m_contactListener,
      this.m_contactSolver
    );
    for (b = this.m_bodyList; b; b = b.m_next)
      b.m_flags &= ~b2Body.e_islandFlag;
    for (var c = this.m_contactList; c; c = c.m_next)
      c.m_flags &= ~b2Contact.e_islandFlag;
    for (var j = this.m_jointList; j; j = j.m_next) j.m_islandFlag = false;
    var stackSize = parseInt(this.m_bodyCount);
    var stack = this.s_stack;
    for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
      if (seed.m_flags & b2Body.e_islandFlag) continue;
      if (seed.IsAwake() == false || seed.IsActive() == false) continue;
      if (seed.GetType() == b2Body.b2_staticBody) continue;
      island.Clear();
      var stackCount = 0;
      stack[stackCount++] = seed;
      seed.m_flags |= b2Body.e_islandFlag;
      while (stackCount > 0) {
        b = stack[--stackCount];
        island.AddBody(b);
        if (b.IsAwake() == false) b.SetAwake(true);
        if (b.GetType() == b2Body.b2_staticBody) continue;
        var other;
        for (var ce = b.m_contactList; ce; ce = ce.next) {
          if (ce.contact.m_flags & b2Contact.e_islandFlag) continue;
          if (
            ce.contact.IsSensor() == true ||
            ce.contact.IsEnabled() == false ||
            ce.contact.IsTouching() == false
          )
            continue;
          island.AddContact(ce.contact);
          ce.contact.m_flags |= b2Contact.e_islandFlag;
          other = ce.other;
          if (other.m_flags & b2Body.e_islandFlag) continue;
          stack[stackCount++] = other;
          other.m_flags |= b2Body.e_islandFlag;
        }
        for (var jn = b.m_jointList; jn; jn = jn.next) {
          if (jn.joint.m_islandFlag == true) continue;
          other = jn.other;
          if (other.IsActive() == false) continue;
          island.AddJoint(jn.joint);
          jn.joint.m_islandFlag = true;
          if (other.m_flags & b2Body.e_islandFlag) continue;
          stack[stackCount++] = other;
          other.m_flags |= b2Body.e_islandFlag;
        }
      }
      island.Solve(step, this.m_gravity, this.m_allowSleep);
      for (var i = 0; i < island.m_bodyCount; ++i) {
        b = island.m_bodies[i];
        if (b.GetType() == b2Body.b2_staticBody)
          b.m_flags &= ~b2Body.e_islandFlag;
      }
    }
    for (i = 0; i < stack.length; ++i) {
      if (!stack[i]) break;
      stack[i] = null;
    }
    for (b = this.m_bodyList; b; b = b.m_next) {
      if (b.IsAwake() == false || b.IsActive() == false) continue;
      if (b.GetType() == b2Body.b2_staticBody) continue;
      b.SynchronizeFixtures();
    }
    this.m_contactManager.FindNewContacts();
  };
  b2World.prototype.SolveTOI = function (step) {
    var b;
    var fA;
    var fB;
    var bA;
    var bB;
    var cEdge;
    var j;
    var island = this.m_island;
    island.Initialize(
      this.m_bodyCount,
      b2Settings.b2_maxTOIContactsPerIsland,
      b2Settings.b2_maxTOIJointsPerIsland,
      null,
      this.m_contactManager.m_contactListener,
      this.m_contactSolver
    );
    var queue = b2World.s_queue;
    for (b = this.m_bodyList; b; b = b.m_next) {
      b.m_flags &= ~b2Body.e_islandFlag;
      b.m_sweep.t0 = 0;
    }
    var c;
    for (c = this.m_contactList; c; c = c.m_next)
      c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
    for (j = this.m_jointList; j; j = j.m_next) j.m_islandFlag = false;
    for (;;) {
      var minContact = null;
      var minTOI = 1;
      for (c = this.m_contactList; c; c = c.m_next) {
        if (
          c.IsSensor() == true ||
          c.IsEnabled() == false ||
          c.IsContinuous() == false
        )
          continue;
        var toi = 1;
        if (c.m_flags & b2Contact.e_toiFlag) toi = c.m_toi;
        else {
          fA = c.m_fixtureA;
          fB = c.m_fixtureB;
          bA = fA.m_body;
          bB = fB.m_body;
          if (
            (bA.GetType() != b2Body.b2_dynamicBody || bA.IsAwake() == false) &&
            (bB.GetType() != b2Body.b2_dynamicBody || bB.IsAwake() == false)
          )
            continue;
          var t0 = bA.m_sweep.t0;
          if (bA.m_sweep.t0 < bB.m_sweep.t0) {
            t0 = bB.m_sweep.t0;
            bA.m_sweep.Advance(t0);
          } else if (bB.m_sweep.t0 < bA.m_sweep.t0) {
            t0 = bA.m_sweep.t0;
            bB.m_sweep.Advance(t0);
          }
          toi = c.ComputeTOI(bA.m_sweep, bB.m_sweep);
          b2Settings.b2Assert(0 <= toi && toi <= 1);
          if (toi > 0 && toi < 1) {
            toi = (1 - toi) * t0 + toi;
            if (toi > 1) toi = 1;
          }
          c.m_toi = toi;
          c.m_flags |= b2Contact.e_toiFlag;
        }
        if (Number.MIN_VALUE < toi && toi < minTOI) {
          minContact = c;
          minTOI = toi;
        }
      }
      if (minContact == null || 1 - 100 * Number.MIN_VALUE < minTOI) break;
      fA = minContact.m_fixtureA;
      fB = minContact.m_fixtureB;
      bA = fA.m_body;
      bB = fB.m_body;
      b2World.s_backupA.Set(bA.m_sweep);
      b2World.s_backupB.Set(bB.m_sweep);
      bA.Advance(minTOI);
      bB.Advance(minTOI);
      minContact.Update(this.m_contactManager.m_contactListener);
      minContact.m_flags &= ~b2Contact.e_toiFlag;
      if (minContact.IsSensor() == true || minContact.IsEnabled() == false) {
        bA.m_sweep.Set(b2World.s_backupA);
        bB.m_sweep.Set(b2World.s_backupB);
        bA.SynchronizeTransform();
        bB.SynchronizeTransform();
        continue;
      }
      if (minContact.IsTouching() == false) continue;
      var seed = bA;
      if (seed.GetType() != b2Body.b2_dynamicBody) seed = bB;
      island.Clear();
      var queueStart = 0;
      var queueSize = 0;
      queue[queueStart + queueSize++] = seed;
      seed.m_flags |= b2Body.e_islandFlag;
      while (queueSize > 0) {
        b = queue[queueStart++];
        --queueSize;
        island.AddBody(b);
        if (b.IsAwake() == false) b.SetAwake(true);
        if (b.GetType() != b2Body.b2_dynamicBody) continue;
        for (cEdge = b.m_contactList; cEdge; cEdge = cEdge.next) {
          if (island.m_contactCount == island.m_contactCapacity) break;
          if (cEdge.contact.m_flags & b2Contact.e_islandFlag) continue;
          if (
            cEdge.contact.IsSensor() == true ||
            cEdge.contact.IsEnabled() == false ||
            cEdge.contact.IsTouching() == false
          )
            continue;
          island.AddContact(cEdge.contact);
          cEdge.contact.m_flags |= b2Contact.e_islandFlag;
          var other = cEdge.other;
          if (other.m_flags & b2Body.e_islandFlag) continue;
          if (other.GetType() != b2Body.b2_staticBody) {
            other.Advance(minTOI);
            other.SetAwake(true);
          }
          queue[queueStart + queueSize] = other;
          ++queueSize;
          other.m_flags |= b2Body.e_islandFlag;
        }
        for (var jEdge = b.m_jointList; jEdge; jEdge = jEdge.next) {
          if (island.m_jointCount == island.m_jointCapacity) continue;
          if (jEdge.joint.m_islandFlag == true) continue;
          other = jEdge.other;
          if (other.IsActive() == false) continue;
          island.AddJoint(jEdge.joint);
          jEdge.joint.m_islandFlag = true;
          if (other.m_flags & b2Body.e_islandFlag) continue;
          if (other.GetType() != b2Body.b2_staticBody) {
            other.Advance(minTOI);
            other.SetAwake(true);
          }
          queue[queueStart + queueSize] = other;
          ++queueSize;
          other.m_flags |= b2Body.e_islandFlag;
        }
      }
      var subStep = b2World.s_timestep;
      subStep.warmStarting = false;
      subStep.dt = (1 - minTOI) * step.dt;
      subStep.inv_dt = 1 / subStep.dt;
      subStep.dtRatio = 0;
      subStep.velocityIterations = step.velocityIterations;
      subStep.positionIterations = step.positionIterations;
      island.SolveTOI(subStep);
      var i = 0;
      for (i = 0; i < island.m_bodyCount; ++i) {
        b = island.m_bodies[i];
        b.m_flags &= ~b2Body.e_islandFlag;
        if (b.IsAwake() == false) continue;
        if (b.GetType() != b2Body.b2_dynamicBody) continue;
        b.SynchronizeFixtures();
        for (cEdge = b.m_contactList; cEdge; cEdge = cEdge.next)
          cEdge.contact.m_flags &= ~b2Contact.e_toiFlag;
      }
      for (i = 0; i < island.m_contactCount; ++i) {
        c = island.m_contacts[i];
        c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
      }
      for (i = 0; i < island.m_jointCount; ++i) {
        j = island.m_joints[i];
        j.m_islandFlag = false;
      }
      this.m_contactManager.FindNewContacts();
    }
  };
  b2World.prototype.DrawJoint = function (joint) {
    var b1 = joint.GetBodyA();
    var b2 = joint.GetBodyB();
    var xf1 = b1.m_xf;
    var xf2 = b2.m_xf;
    var x1 = xf1.position;
    var x2 = xf2.position;
    var p1 = joint.GetAnchorA();
    var p2 = joint.GetAnchorB();
    var color = b2World.s_jointColor;
    switch (joint.m_type) {
      case b2Joint.e_distanceJoint:
        this.m_debugDraw.DrawSegment(p1, p2, color);
        break;
      case b2Joint.e_pulleyJoint:
        var pulley = joint instanceof b2PulleyJoint ? joint : null;
        var s1 = pulley.GetGroundAnchorA();
        var s2 = pulley.GetGroundAnchorB();
        this.m_debugDraw.DrawSegment(s1, p1, color);
        this.m_debugDraw.DrawSegment(s2, p2, color);
        this.m_debugDraw.DrawSegment(s1, s2, color);
        break;
      case b2Joint.e_mouseJoint:
        this.m_debugDraw.DrawSegment(p1, p2, color);
        break;
      default:
        if (b1 != this.m_groundBody)
          this.m_debugDraw.DrawSegment(x1, p1, color);
        this.m_debugDraw.DrawSegment(p1, p2, color);
        if (b2 != this.m_groundBody)
          this.m_debugDraw.DrawSegment(x2, p2, color);
    }
  };
  b2World.prototype.DrawShape = function (shape, xf, color) {
    switch (shape.m_type) {
      case b2Shape.e_circleShape:
        var circle = shape instanceof b2CircleShape ? shape : null;
        var center = b2Math.MulX(xf, circle.m_p);
        var radius = circle.m_radius;
        var axis = xf.R.col1;
        this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
        break;
      case b2Shape.e_polygonShape:
        var i = 0;
        var poly = shape instanceof b2PolygonShape ? shape : null;
        var vertexCount = parseInt(poly.GetVertexCount());
        var localVertices = poly.GetVertices();
        var vertices = new Vector2(vertexCount);
        for (i = 0; i < vertexCount; ++i)
          vertices[i] = b2Math.MulX(xf, localVertices[i]);
        this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
        break;
      case b2Shape.e_edgeShape:
        var edge = shape instanceof b2EdgeShape ? shape : null;
        this.m_debugDraw.DrawSegment(
          b2Math.MulX(xf, edge.GetVertex1()),
          b2Math.MulX(xf, edge.GetVertex2()),
          color
        );
        break;
    }
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.b2World.s_timestep2 = new b2TimeStep();
    Box2D.Dynamics.b2World.s_xf = new b2Transform();
    Box2D.Dynamics.b2World.s_backupA = new b2Sweep();
    Box2D.Dynamics.b2World.s_backupB = new b2Sweep();
    Box2D.Dynamics.b2World.s_timestep = new b2TimeStep();
    Box2D.Dynamics.b2World.s_queue = new Vector2();
    Box2D.Dynamics.b2World.s_jointColor = new b2Color(0.5, 0.8, 0.8);
    Box2D.Dynamics.b2World.e_newFixture = 1;
    Box2D.Dynamics.b2World.e_locked = 2;
  });
})();
(function () {
  var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2Shape = Box2D.Collision.Shapes.b2Shape,
    b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
    b2Contact = Box2D.Dynamics.Contacts.b2Contact,
    b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
    b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
    b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
    b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
    b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
    b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
    b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
    b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
    b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
    b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
    b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
    b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
    b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
    b2Body = Box2D.Dynamics.b2Body,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
    b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2ContactManager = Box2D.Dynamics.b2ContactManager,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
    b2FilterData = Box2D.Dynamics.b2FilterData,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Island = Box2D.Dynamics.b2Island,
    b2TimeStep = Box2D.Dynamics.b2TimeStep,
    b2World = Box2D.Dynamics.b2World,
    b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3,
    b2AABB = Box2D.Collision.b2AABB,
    b2Bound = Box2D.Collision.b2Bound,
    b2BoundValues = Box2D.Collision.b2BoundValues,
    b2Collision = Box2D.Collision.b2Collision,
    b2ContactID = Box2D.Collision.b2ContactID,
    b2ContactPoint = Box2D.Collision.b2ContactPoint,
    b2Distance = Box2D.Collision.b2Distance,
    b2DistanceInput = Box2D.Collision.b2DistanceInput,
    b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
    b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
    b2DynamicTree = Box2D.Collision.b2DynamicTree,
    b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
    b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
    b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
    b2Manifold = Box2D.Collision.b2Manifold,
    b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
    b2Point = Box2D.Collision.b2Point,
    b2RayCastInput = Box2D.Collision.b2RayCastInput,
    b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
    b2Segment = Box2D.Collision.b2Segment,
    b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
    b2Simplex = Box2D.Collision.b2Simplex,
    b2SimplexCache = Box2D.Collision.b2SimplexCache,
    b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
    b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
    b2TOIInput = Box2D.Collision.b2TOIInput,
    b2WorldManifold = Box2D.Collision.b2WorldManifold,
    ClipVertex = Box2D.Collision.ClipVertex,
    Features = Box2D.Collision.Features,
    IBroadPhase = Box2D.Collision.IBroadPhase;
  Box2D.inherit(b2CircleContact, Box2D.Dynamics.Contacts.b2Contact);
  b2CircleContact.prototype.__super =
    Box2D.Dynamics.Contacts.b2Contact.prototype;
  b2CircleContact.b2CircleContact = function () {
    Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
  };
  b2CircleContact.Create = function (allocator) {
    return new b2CircleContact();
  };
  b2CircleContact.Destroy = function (contact, allocator) {};
  b2CircleContact.prototype.Reset = function (fixtureA, fixtureB) {
    this.__super.Reset.call(this, fixtureA, fixtureB);
  };
  b2CircleContact.prototype.Evaluate = function () {
    var bA = this.m_fixtureA.GetBody();
    var bB = this.m_fixtureB.GetBody();
    b2Collision.CollideCircles(
      this.m_manifold,
      this.m_fixtureA.GetShape() instanceof b2CircleShape
        ? this.m_fixtureA.GetShape()
        : null,
      bA.m_xf,
      this.m_fixtureB.GetShape() instanceof b2CircleShape
        ? this.m_fixtureB.GetShape()
        : null,
      bB.m_xf
    );
  };
  b2Contact.b2Contact = function () {
    this.m_nodeA = new b2ContactEdge();
    this.m_nodeB = new b2ContactEdge();
    this.m_manifold = new b2Manifold();
    this.m_oldManifold = new b2Manifold();
  };
  b2Contact.prototype.GetManifold = function () {
    return this.m_manifold;
  };
  b2Contact.prototype.GetWorldManifold = function (worldManifold) {
    var bodyA = this.m_fixtureA.GetBody();
    var bodyB = this.m_fixtureB.GetBody();
    var shapeA = this.m_fixtureA.GetShape();
    var shapeB = this.m_fixtureB.GetShape();
    worldManifold.Initialize(
      this.m_manifold,
      bodyA.GetTransform(),
      shapeA.m_radius,
      bodyB.GetTransform(),
      shapeB.m_radius
    );
  };
  b2Contact.prototype.IsTouching = function () {
    return (
      (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag
    );
  };
  b2Contact.prototype.IsContinuous = function () {
    return (
      (this.m_flags & b2Contact.e_continuousFlag) == b2Contact.e_continuousFlag
    );
  };
  b2Contact.prototype.SetSensor = function (sensor) {
    if (sensor) this.m_flags |= b2Contact.e_sensorFlag;
    else this.m_flags &= ~b2Contact.e_sensorFlag;
  };
  b2Contact.prototype.IsSensor = function () {
    return (this.m_flags & b2Contact.e_sensorFlag) == b2Contact.e_sensorFlag;
  };
  b2Contact.prototype.SetEnabled = function (flag) {
    if (flag) this.m_flags |= b2Contact.e_enabledFlag;
    else this.m_flags &= ~b2Contact.e_enabledFlag;
  };
  b2Contact.prototype.IsEnabled = function () {
    return (this.m_flags & b2Contact.e_enabledFlag) == b2Contact.e_enabledFlag;
  };
  b2Contact.prototype.GetNext = function () {
    return this.m_next;
  };
  b2Contact.prototype.GetFixtureA = function () {
    return this.m_fixtureA;
  };
  b2Contact.prototype.GetFixtureB = function () {
    return this.m_fixtureB;
  };
  b2Contact.prototype.FlagForFiltering = function () {
    this.m_flags |= b2Contact.e_filterFlag;
  };
  b2Contact.prototype.b2Contact = function () {};
  b2Contact.prototype.Reset = function (fixtureA, fixtureB) {
    if (fixtureA === undefined) fixtureA = null;
    if (fixtureB === undefined) fixtureB = null;
    this.m_flags = b2Contact.e_enabledFlag;
    if (!fixtureA || !fixtureB) {
      this.m_fixtureA = null;
      this.m_fixtureB = null;
      return;
    }
    if (fixtureA.IsSensor() || fixtureB.IsSensor())
      this.m_flags |= b2Contact.e_sensorFlag;
    var bodyA = fixtureA.GetBody();
    var bodyB = fixtureB.GetBody();
    if (
      bodyA.GetType() != b2Body.b2_dynamicBody ||
      bodyA.IsBullet() ||
      bodyB.GetType() != b2Body.b2_dynamicBody ||
      bodyB.IsBullet()
    )
      this.m_flags |= b2Contact.e_continuousFlag;
    this.m_fixtureA = fixtureA;
    this.m_fixtureB = fixtureB;
    this.m_manifold.m_pointCount = 0;
    this.m_prev = null;
    this.m_next = null;
    this.m_nodeA.contact = null;
    this.m_nodeA.prev = null;
    this.m_nodeA.next = null;
    this.m_nodeA.other = null;
    this.m_nodeB.contact = null;
    this.m_nodeB.prev = null;
    this.m_nodeB.next = null;
    this.m_nodeB.other = null;
  };
  b2Contact.prototype.Update = function (listener) {
    var tManifold = this.m_oldManifold;
    this.m_oldManifold = this.m_manifold;
    this.m_manifold = tManifold;
    this.m_flags |= b2Contact.e_enabledFlag;
    var touching = false;
    var wasTouching =
      (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
    var bodyA = this.m_fixtureA.m_body;
    var bodyB = this.m_fixtureB.m_body;
    var aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(
      this.m_fixtureB.m_aabb
    );
    if (this.m_flags & b2Contact.e_sensorFlag) {
      if (aabbOverlap) {
        var shapeA = this.m_fixtureA.GetShape();
        var shapeB = this.m_fixtureB.GetShape();
        var xfA = bodyA.GetTransform();
        var xfB = bodyB.GetTransform();
        touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
      }
      this.m_manifold.m_pointCount = 0;
    } else {
      if (
        bodyA.GetType() != b2Body.b2_dynamicBody ||
        bodyA.IsBullet() ||
        bodyB.GetType() != b2Body.b2_dynamicBody ||
        bodyB.IsBullet()
      )
        this.m_flags |= b2Contact.e_continuousFlag;
      else this.m_flags &= ~b2Contact.e_continuousFlag;
      if (aabbOverlap) {
        this.Evaluate();
        touching = this.m_manifold.m_pointCount > 0;
        for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
          var mp2 = this.m_manifold.m_points[i];
          mp2.m_normalImpulse = 0;
          mp2.m_tangentImpulse = 0;
          var id2 = mp2.m_id;
          for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
            var mp1 = this.m_oldManifold.m_points[j];
            if (mp1.m_id.key == id2.key) {
              mp2.m_normalImpulse = mp1.m_normalImpulse;
              mp2.m_tangentImpulse = mp1.m_tangentImpulse;
              break;
            }
          }
        }
      } else this.m_manifold.m_pointCount = 0;
      if (touching != wasTouching) {
        bodyA.SetAwake(true);
        bodyB.SetAwake(true);
      }
    }
    if (touching) this.m_flags |= b2Contact.e_touchingFlag;
    else this.m_flags &= ~b2Contact.e_touchingFlag;
    if (wasTouching == false && touching == true) listener.BeginContact(this);
    if (wasTouching == true && touching == false) listener.EndContact(this);
    if ((this.m_flags & b2Contact.e_sensorFlag) == 0)
      listener.PreSolve(this, this.m_oldManifold);
  };
  b2Contact.prototype.Evaluate = function () {};
  b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
    b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
    b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
    b2Contact.s_input.sweepA = sweepA;
    b2Contact.s_input.sweepB = sweepB;
    b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
    return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.Contacts.b2Contact.e_sensorFlag = 1;
    Box2D.Dynamics.Contacts.b2Contact.e_continuousFlag = 2;
    Box2D.Dynamics.Contacts.b2Contact.e_islandFlag = 4;
    Box2D.Dynamics.Contacts.b2Contact.e_toiFlag = 8;
    Box2D.Dynamics.Contacts.b2Contact.e_touchingFlag = 16;
    Box2D.Dynamics.Contacts.b2Contact.e_enabledFlag = 32;
    Box2D.Dynamics.Contacts.b2Contact.e_filterFlag = 64;
    Box2D.Dynamics.Contacts.b2Contact.s_input = new b2TOIInput();
  });
  b2ContactConstraint.b2ContactConstraint = function () {
    this.localPlaneNormal = new b2Vec2();
    this.localPoint = new b2Vec2();
    this.normal = new b2Vec2();
    this.normalMass = new b2Mat22();
    this.K = new b2Mat22();
  };
  b2ContactConstraint.prototype.b2ContactConstraint = function () {
    this.points = new Vector2(b2Settings.b2_maxManifoldPoints);
    for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++)
      this.points[i] = new b2ContactConstraintPoint();
  };
  b2ContactConstraintPoint.b2ContactConstraintPoint = function () {
    this.localPoint = new b2Vec2();
    this.rA = new b2Vec2();
    this.rB = new b2Vec2();
  };
  b2ContactEdge.b2ContactEdge = function () {};
  b2ContactFactory.b2ContactFactory = function () {};
  b2ContactFactory.prototype.b2ContactFactory = function (allocator) {
    this.m_allocator = allocator;
    this.InitializeRegisters();
  };
  b2ContactFactory.prototype.AddType = function (
    createFcn,
    destroyFcn,
    type1,
    type2
  ) {
    if (type1 === undefined) type1 = 0;
    if (type2 === undefined) type2 = 0;
    this.m_registers[type1][type2].createFcn = createFcn;
    this.m_registers[type1][type2].destroyFcn = destroyFcn;
    this.m_registers[type1][type2].primary = true;
    if (type1 != type2) {
      this.m_registers[type2][type1].createFcn = createFcn;
      this.m_registers[type2][type1].destroyFcn = destroyFcn;
      this.m_registers[type2][type1].primary = false;
    }
  };
  b2ContactFactory.prototype.InitializeRegisters = function () {
    this.m_registers = new Vector2(b2Shape.e_shapeTypeCount);
    for (var i = 0; i < b2Shape.e_shapeTypeCount; i++) {
      this.m_registers[i] = new Vector2(b2Shape.e_shapeTypeCount);
      for (var j = 0; j < b2Shape.e_shapeTypeCount; j++)
        this.m_registers[i][j] = new b2ContactRegister();
    }
    this.AddType(
      b2CircleContact.Create,
      b2CircleContact.Destroy,
      b2Shape.e_circleShape,
      b2Shape.e_circleShape
    );
    this.AddType(
      b2PolyAndCircleContact.Create,
      b2PolyAndCircleContact.Destroy,
      b2Shape.e_polygonShape,
      b2Shape.e_circleShape
    );
    this.AddType(
      b2PolygonContact.Create,
      b2PolygonContact.Destroy,
      b2Shape.e_polygonShape,
      b2Shape.e_polygonShape
    );
    this.AddType(
      b2EdgeAndCircleContact.Create,
      b2EdgeAndCircleContact.Destroy,
      b2Shape.e_edgeShape,
      b2Shape.e_circleShape
    );
    this.AddType(
      b2PolyAndEdgeContact.Create,
      b2PolyAndEdgeContact.Destroy,
      b2Shape.e_polygonShape,
      b2Shape.e_edgeShape
    );
  };
  b2ContactFactory.prototype.Create = function (fixtureA, fixtureB) {
    var type1 = parseInt(fixtureA.GetType());
    var type2 = parseInt(fixtureB.GetType());
    var reg = this.m_registers[type1][type2];
    var c;
    if (reg.pool) {
      c = reg.pool;
      reg.pool = c.m_next;
      reg.poolCount--;
      c.Reset(fixtureA, fixtureB);
      return c;
    }
    var createFcn = reg.createFcn;
    if (createFcn != null)
      if (reg.primary) {
        c = createFcn(this.m_allocator);
        c.Reset(fixtureA, fixtureB);
        return c;
      } else {
        c = createFcn(this.m_allocator);
        c.Reset(fixtureB, fixtureA);
        return c;
      }
    else return null;
  };
  b2ContactFactory.prototype.Destroy = function (contact) {
    if (contact.m_manifold.m_pointCount > 0) {
      contact.m_fixtureA.m_body.SetAwake(true);
      contact.m_fixtureB.m_body.SetAwake(true);
    }
    var type1 = parseInt(contact.m_fixtureA.GetType());
    var type2 = parseInt(contact.m_fixtureB.GetType());
    var reg = this.m_registers[type1][type2];
    if (true) {
      reg.poolCount++;
      contact.m_next = reg.pool;
      reg.pool = contact;
    }
    var destroyFcn = reg.destroyFcn;
    destroyFcn(contact, this.m_allocator);
  };
  b2ContactRegister.b2ContactRegister = function () {};
  b2ContactResult.b2ContactResult = function () {
    this.position = new b2Vec2();
    this.normal = new b2Vec2();
    this.id = new b2ContactID();
  };
  b2ContactSolver.b2ContactSolver = function () {
    this.m_step = new b2TimeStep();
    this.m_constraints = new Vector2();
  };
  b2ContactSolver.prototype.b2ContactSolver = function () {};
  b2ContactSolver.prototype.Initialize = function (
    step,
    contacts,
    contactCount,
    allocator
  ) {
    if (contactCount === undefined) contactCount = 0;
    var contact;
    this.m_step.Set(step);
    this.m_allocator = allocator;
    var i = 0;
    var tVec;
    var tMat;
    this.m_constraintCount = contactCount;
    while (this.m_constraints.length < this.m_constraintCount)
      this.m_constraints[this.m_constraints.length] = new b2ContactConstraint();
    for (i = 0; i < contactCount; ++i) {
      contact = contacts[i];
      var fixtureA = contact.m_fixtureA;
      var fixtureB = contact.m_fixtureB;
      var shapeA = fixtureA.m_shape;
      var shapeB = fixtureB.m_shape;
      var radiusA = shapeA.m_radius;
      var radiusB = shapeB.m_radius;
      var bodyA = fixtureA.m_body;
      var bodyB = fixtureB.m_body;
      var manifold = contact.GetManifold();
      var friction = b2Settings.b2MixFriction(
        fixtureA.GetFriction(),
        fixtureB.GetFriction()
      );
      var restitution = b2Settings.b2MixRestitution(
        fixtureA.GetRestitution(),
        fixtureB.GetRestitution()
      );
      var vAX = bodyA.m_linearVelocity.x;
      var vAY = bodyA.m_linearVelocity.y;
      var vBX = bodyB.m_linearVelocity.x;
      var vBY = bodyB.m_linearVelocity.y;
      var wA = bodyA.m_angularVelocity;
      var wB = bodyB.m_angularVelocity;
      b2Settings.b2Assert(manifold.m_pointCount > 0);
      b2ContactSolver.s_worldManifold.Initialize(
        manifold,
        bodyA.m_xf,
        radiusA,
        bodyB.m_xf,
        radiusB
      );
      var normalX = b2ContactSolver.s_worldManifold.m_normal.x;
      var normalY = b2ContactSolver.s_worldManifold.m_normal.y;
      var cc = this.m_constraints[i];
      cc.bodyA = bodyA;
      cc.bodyB = bodyB;
      cc.manifold = manifold;
      cc.normal.x = normalX;
      cc.normal.y = normalY;
      cc.pointCount = manifold.m_pointCount;
      cc.friction = friction;
      cc.restitution = restitution;
      cc.localPlaneNormal.x = manifold.m_localPlaneNormal.x;
      cc.localPlaneNormal.y = manifold.m_localPlaneNormal.y;
      cc.localPoint.x = manifold.m_localPoint.x;
      cc.localPoint.y = manifold.m_localPoint.y;
      cc.radius = radiusA + radiusB;
      cc.type = manifold.m_type;
      for (var k = 0; k < cc.pointCount; ++k) {
        var cp = manifold.m_points[k];
        var ccp = cc.points[k];
        ccp.normalImpulse = cp.m_normalImpulse;
        ccp.tangentImpulse = cp.m_tangentImpulse;
        ccp.localPoint.SetV(cp.m_localPoint);
        var rAX = (ccp.rA.x =
          b2ContactSolver.s_worldManifold.m_points[k].x - bodyA.m_sweep.c.x);
        var rAY = (ccp.rA.y =
          b2ContactSolver.s_worldManifold.m_points[k].y - bodyA.m_sweep.c.y);
        var rBX = (ccp.rB.x =
          b2ContactSolver.s_worldManifold.m_points[k].x - bodyB.m_sweep.c.x);
        var rBY = (ccp.rB.y =
          b2ContactSolver.s_worldManifold.m_points[k].y - bodyB.m_sweep.c.y);
        var rnA = rAX * normalY - rAY * normalX;
        var rnB = rBX * normalY - rBY * normalX;
        rnA *= rnA;
        rnB *= rnB;
        var kNormal =
          bodyA.m_invMass +
          bodyB.m_invMass +
          bodyA.m_invI * rnA +
          bodyB.m_invI * rnB;
        ccp.normalMass = 1 / kNormal;
        var kEqualized =
          bodyA.m_mass * bodyA.m_invMass + bodyB.m_mass * bodyB.m_invMass;
        kEqualized +=
          bodyA.m_mass * bodyA.m_invI * rnA + bodyB.m_mass * bodyB.m_invI * rnB;
        ccp.equalizedMass = 1 / kEqualized;
        var tangentX = normalY;
        var tangentY = -normalX;
        var rtA = rAX * tangentY - rAY * tangentX;
        var rtB = rBX * tangentY - rBY * tangentX;
        rtA *= rtA;
        rtB *= rtB;
        var kTangent =
          bodyA.m_invMass +
          bodyB.m_invMass +
          bodyA.m_invI * rtA +
          bodyB.m_invI * rtB;
        ccp.tangentMass = 1 / kTangent;
        ccp.velocityBias = 0;
        var tX = vBX + -wB * rBY - vAX - -wA * rAY;
        var tY = vBY + wB * rBX - vAY - wA * rAX;
        var vRel = cc.normal.x * tX + cc.normal.y * tY;
        if (vRel < -b2Settings.b2_velocityThreshold)
          ccp.velocityBias += -cc.restitution * vRel;
      }
      if (cc.pointCount == 2) {
        var ccp1 = cc.points[0];
        var ccp2 = cc.points[1];
        var invMassA = bodyA.m_invMass;
        var invIA = bodyA.m_invI;
        var invMassB = bodyB.m_invMass;
        var invIB = bodyB.m_invI;
        var rn1A = ccp1.rA.x * normalY - ccp1.rA.y * normalX;
        var rn1B = ccp1.rB.x * normalY - ccp1.rB.y * normalX;
        var rn2A = ccp2.rA.x * normalY - ccp2.rA.y * normalX;
        var rn2B = ccp2.rB.x * normalY - ccp2.rB.y * normalX;
        var k11 =
          invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B;
        var k22 =
          invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B;
        var k12 =
          invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B;
        var k_maxConditionNumber = 100;
        if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
          cc.K.col1.Set(k11, k12);
          cc.K.col2.Set(k12, k22);
          cc.K.GetInverse(cc.normalMass);
        } else cc.pointCount = 1;
      }
    }
  };
  b2ContactSolver.prototype.InitVelocityConstraints = function (step) {
    var tVec;
    var tVec2;
    var tMat;
    for (var i = 0; i < this.m_constraintCount; ++i) {
      var c = this.m_constraints[i];
      var bodyA = c.bodyA;
      var bodyB = c.bodyB;
      var invMassA = bodyA.m_invMass;
      var invIA = bodyA.m_invI;
      var invMassB = bodyB.m_invMass;
      var invIB = bodyB.m_invI;
      var normalX = c.normal.x;
      var normalY = c.normal.y;
      var tangentX = normalY;
      var tangentY = -normalX;
      var tX = 0;
      var j = 0;
      var tCount = 0;
      if (step.warmStarting) {
        tCount = c.pointCount;
        for (j = 0; j < tCount; ++j) {
          var ccp = c.points[j];
          ccp.normalImpulse *= step.dtRatio;
          ccp.tangentImpulse *= step.dtRatio;
          var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
          var PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
          bodyA.m_angularVelocity -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
          bodyA.m_linearVelocity.x -= invMassA * PX;
          bodyA.m_linearVelocity.y -= invMassA * PY;
          bodyB.m_angularVelocity += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
          bodyB.m_linearVelocity.x += invMassB * PX;
          bodyB.m_linearVelocity.y += invMassB * PY;
        }
      } else {
        tCount = c.pointCount;
        for (j = 0; j < tCount; ++j) {
          var ccp2 = c.points[j];
          ccp2.normalImpulse = 0;
          ccp2.tangentImpulse = 0;
        }
      }
    }
  };
  b2ContactSolver.prototype.SolveVelocityConstraints = function () {
    var j = 0;
    var ccp;
    var rAX = 0;
    var rAY = 0;
    var rBX = 0;
    var rBY = 0;
    var dvX = 0;
    var dvY = 0;
    var vn = 0;
    var vt = 0;
    var lambda = 0;
    var maxFriction = 0;
    var newImpulse = 0;
    var PX = 0;
    var PY = 0;
    var dX = 0;
    var dY = 0;
    var P1X = 0;
    var P1Y = 0;
    var P2X = 0;
    var P2Y = 0;
    var tMat;
    var tVec;
    for (var i = 0; i < this.m_constraintCount; ++i) {
      var c = this.m_constraints[i];
      var bodyA = c.bodyA;
      var bodyB = c.bodyB;
      var wA = bodyA.m_angularVelocity;
      var wB = bodyB.m_angularVelocity;
      var vA = bodyA.m_linearVelocity;
      var vB = bodyB.m_linearVelocity;
      var invMassA = bodyA.m_invMass;
      var invIA = bodyA.m_invI;
      var invMassB = bodyB.m_invMass;
      var invIB = bodyB.m_invI;
      var normalX = c.normal.x;
      var normalY = c.normal.y;
      var tangentX = normalY;
      var tangentY = -normalX;
      var friction = c.friction;
      var tX = 0;
      for (j = 0; j < c.pointCount; j++) {
        ccp = c.points[j];
        dvX = vB.x - wB * ccp.rB.y - vA.x + wA * ccp.rA.y;
        dvY = vB.y + wB * ccp.rB.x - vA.y - wA * ccp.rA.x;
        vt = dvX * tangentX + dvY * tangentY;
        lambda = ccp.tangentMass * -vt;
        maxFriction = friction * ccp.normalImpulse;
        newImpulse = b2Math.Clamp(
          ccp.tangentImpulse + lambda,
          -maxFriction,
          maxFriction
        );
        lambda = newImpulse - ccp.tangentImpulse;
        PX = lambda * tangentX;
        PY = lambda * tangentY;
        vA.x -= invMassA * PX;
        vA.y -= invMassA * PY;
        wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
        vB.x += invMassB * PX;
        vB.y += invMassB * PY;
        wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
        ccp.tangentImpulse = newImpulse;
      }
      var tCount = parseInt(c.pointCount);
      if (c.pointCount == 1) {
        ccp = c.points[0];
        dvX = vB.x + -wB * ccp.rB.y - vA.x - -wA * ccp.rA.y;
        dvY = vB.y + wB * ccp.rB.x - vA.y - wA * ccp.rA.x;
        vn = dvX * normalX + dvY * normalY;
        lambda = -ccp.normalMass * (vn - ccp.velocityBias);
        newImpulse = ccp.normalImpulse + lambda;
        newImpulse = newImpulse > 0 ? newImpulse : 0;
        lambda = newImpulse - ccp.normalImpulse;
        PX = lambda * normalX;
        PY = lambda * normalY;
        vA.x -= invMassA * PX;
        vA.y -= invMassA * PY;
        wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
        vB.x += invMassB * PX;
        vB.y += invMassB * PY;
        wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
        ccp.normalImpulse = newImpulse;
      } else {
        var cp1 = c.points[0];
        var cp2 = c.points[1];
        var aX = cp1.normalImpulse;
        var aY = cp2.normalImpulse;
        var dv1X = vB.x - wB * cp1.rB.y - vA.x + wA * cp1.rA.y;
        var dv1Y = vB.y + wB * cp1.rB.x - vA.y - wA * cp1.rA.x;
        var dv2X = vB.x - wB * cp2.rB.y - vA.x + wA * cp2.rA.y;
        var dv2Y = vB.y + wB * cp2.rB.x - vA.y - wA * cp2.rA.x;
        var vn1 = dv1X * normalX + dv1Y * normalY;
        var vn2 = dv2X * normalX + dv2Y * normalY;
        var bX = vn1 - cp1.velocityBias;
        var bY = vn2 - cp2.velocityBias;
        tMat = c.K;
        bX -= tMat.col1.x * aX + tMat.col2.x * aY;
        bY -= tMat.col1.y * aX + tMat.col2.y * aY;
        var k_errorTol = 0.001;
        for (;;) {
          tMat = c.normalMass;
          var xX = -(tMat.col1.x * bX + tMat.col2.x * bY);
          var xY = -(tMat.col1.y * bX + tMat.col2.y * bY);
          if (xX >= 0 && xY >= 0) {
            dX = xX - aX;
            dY = xY - aY;
            P1X = dX * normalX;
            P1Y = dX * normalY;
            P2X = dY * normalX;
            P2Y = dY * normalY;
            vA.x -= invMassA * (P1X + P2X);
            vA.y -= invMassA * (P1Y + P2Y);
            wA -=
              invIA *
              (cp1.rA.x * P1Y -
                cp1.rA.y * P1X +
                cp2.rA.x * P2Y -
                cp2.rA.y * P2X);
            vB.x += invMassB * (P1X + P2X);
            vB.y += invMassB * (P1Y + P2Y);
            wB +=
              invIB *
              (cp1.rB.x * P1Y -
                cp1.rB.y * P1X +
                cp2.rB.x * P2Y -
                cp2.rB.y * P2X);
            cp1.normalImpulse = xX;
            cp2.normalImpulse = xY;
            break;
          }
          xX = -cp1.normalMass * bX;
          xY = 0;
          vn1 = 0;
          vn2 = c.K.col1.y * xX + bY;
          if (xX >= 0 && vn2 >= 0) {
            dX = xX - aX;
            dY = xY - aY;
            P1X = dX * normalX;
            P1Y = dX * normalY;
            P2X = dY * normalX;
            P2Y = dY * normalY;
            vA.x -= invMassA * (P1X + P2X);
            vA.y -= invMassA * (P1Y + P2Y);
            wA -=
              invIA *
              (cp1.rA.x * P1Y -
                cp1.rA.y * P1X +
                cp2.rA.x * P2Y -
                cp2.rA.y * P2X);
            vB.x += invMassB * (P1X + P2X);
            vB.y += invMassB * (P1Y + P2Y);
            wB +=
              invIB *
              (cp1.rB.x * P1Y -
                cp1.rB.y * P1X +
                cp2.rB.x * P2Y -
                cp2.rB.y * P2X);
            cp1.normalImpulse = xX;
            cp2.normalImpulse = xY;
            break;
          }
          xX = 0;
          xY = -cp2.normalMass * bY;
          vn1 = c.K.col2.x * xY + bX;
          vn2 = 0;
          if (xY >= 0 && vn1 >= 0) {
            dX = xX - aX;
            dY = xY - aY;
            P1X = dX * normalX;
            P1Y = dX * normalY;
            P2X = dY * normalX;
            P2Y = dY * normalY;
            vA.x -= invMassA * (P1X + P2X);
            vA.y -= invMassA * (P1Y + P2Y);
            wA -=
              invIA *
              (cp1.rA.x * P1Y -
                cp1.rA.y * P1X +
                cp2.rA.x * P2Y -
                cp2.rA.y * P2X);
            vB.x += invMassB * (P1X + P2X);
            vB.y += invMassB * (P1Y + P2Y);
            wB +=
              invIB *
              (cp1.rB.x * P1Y -
                cp1.rB.y * P1X +
                cp2.rB.x * P2Y -
                cp2.rB.y * P2X);
            cp1.normalImpulse = xX;
            cp2.normalImpulse = xY;
            break;
          }
          xX = 0;
          xY = 0;
          vn1 = bX;
          vn2 = bY;
          if (vn1 >= 0 && vn2 >= 0) {
            dX = xX - aX;
            dY = xY - aY;
            P1X = dX * normalX;
            P1Y = dX * normalY;
            P2X = dY * normalX;
            P2Y = dY * normalY;
            vA.x -= invMassA * (P1X + P2X);
            vA.y -= invMassA * (P1Y + P2Y);
            wA -=
              invIA *
              (cp1.rA.x * P1Y -
                cp1.rA.y * P1X +
                cp2.rA.x * P2Y -
                cp2.rA.y * P2X);
            vB.x += invMassB * (P1X + P2X);
            vB.y += invMassB * (P1Y + P2Y);
            wB +=
              invIB *
              (cp1.rB.x * P1Y -
                cp1.rB.y * P1X +
                cp2.rB.x * P2Y -
                cp2.rB.y * P2X);
            cp1.normalImpulse = xX;
            cp2.normalImpulse = xY;
            break;
          }
          break;
        }
      }
      bodyA.m_angularVelocity = wA;
      bodyB.m_angularVelocity = wB;
    }
  };
  b2ContactSolver.prototype.FinalizeVelocityConstraints = function () {
    for (var i = 0; i < this.m_constraintCount; ++i) {
      var c = this.m_constraints[i];
      var m = c.manifold;
      for (var j = 0; j < c.pointCount; ++j) {
        var point1 = m.m_points[j];
        var point2 = c.points[j];
        point1.m_normalImpulse = point2.normalImpulse;
        point1.m_tangentImpulse = point2.tangentImpulse;
      }
    }
  };
  b2ContactSolver.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    var minSeparation = 0;
    for (var i = 0; i < this.m_constraintCount; i++) {
      var c = this.m_constraints[i];
      var bodyA = c.bodyA;
      var bodyB = c.bodyB;
      var invMassA = bodyA.m_mass * bodyA.m_invMass;
      var invIA = bodyA.m_mass * bodyA.m_invI;
      var invMassB = bodyB.m_mass * bodyB.m_invMass;
      var invIB = bodyB.m_mass * bodyB.m_invI;
      b2ContactSolver.s_psm.Initialize(c);
      var normal = b2ContactSolver.s_psm.m_normal;
      for (var j = 0; j < c.pointCount; j++) {
        var ccp = c.points[j];
        var point = b2ContactSolver.s_psm.m_points[j];
        var separation = b2ContactSolver.s_psm.m_separations[j];
        var rAX = point.x - bodyA.m_sweep.c.x;
        var rAY = point.y - bodyA.m_sweep.c.y;
        var rBX = point.x - bodyB.m_sweep.c.x;
        var rBY = point.y - bodyB.m_sweep.c.y;
        minSeparation = minSeparation < separation ? minSeparation : separation;
        var C = b2Math.Clamp(
          baumgarte * (separation + b2Settings.b2_linearSlop),
          -b2Settings.b2_maxLinearCorrection,
          0
        );
        var impulse = -ccp.equalizedMass * C;
        var PX = impulse * normal.x;
        var PY = impulse * normal.y;
        bodyA.m_sweep.c.x -= invMassA * PX;
        bodyA.m_sweep.c.y -= invMassA * PY;
        bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
        bodyA.SynchronizeTransform();
        bodyB.m_sweep.c.x += invMassB * PX;
        bodyB.m_sweep.c.y += invMassB * PY;
        bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
        bodyB.SynchronizeTransform();
      }
    }
    return minSeparation > -1.5 * b2Settings.b2_linearSlop;
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold =
      new b2WorldManifold();
    Box2D.Dynamics.Contacts.b2ContactSolver.s_psm =
      new b2PositionSolverManifold();
  });
  Box2D.inherit(b2EdgeAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
  b2EdgeAndCircleContact.prototype.__super =
    Box2D.Dynamics.Contacts.b2Contact.prototype;
  b2EdgeAndCircleContact.b2EdgeAndCircleContact = function () {
    Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
  };
  b2EdgeAndCircleContact.Create = function (allocator) {
    return new b2EdgeAndCircleContact();
  };
  b2EdgeAndCircleContact.Destroy = function (contact, allocator) {};
  b2EdgeAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
    this.__super.Reset.call(this, fixtureA, fixtureB);
  };
  b2EdgeAndCircleContact.prototype.Evaluate = function () {
    var bA = this.m_fixtureA.GetBody();
    var bB = this.m_fixtureB.GetBody();
    this.b2CollideEdgeAndCircle(
      this.m_manifold,
      this.m_fixtureA.GetShape() instanceof b2EdgeShape
        ? this.m_fixtureA.GetShape()
        : null,
      bA.m_xf,
      this.m_fixtureB.GetShape() instanceof b2CircleShape
        ? this.m_fixtureB.GetShape()
        : null,
      bB.m_xf
    );
  };
  b2EdgeAndCircleContact.prototype.b2CollideEdgeAndCircle = function (
    manifold,
    edge,
    xf1,
    circle,
    xf2
  ) {};
  Box2D.inherit(b2NullContact, Box2D.Dynamics.Contacts.b2Contact);
  b2NullContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
  b2NullContact.b2NullContact = function () {
    Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
  };
  b2NullContact.prototype.b2NullContact = function () {
    this.__super.b2Contact.call(this);
  };
  b2NullContact.prototype.Evaluate = function () {};
  Box2D.inherit(b2PolyAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
  b2PolyAndCircleContact.prototype.__super =
    Box2D.Dynamics.Contacts.b2Contact.prototype;
  b2PolyAndCircleContact.b2PolyAndCircleContact = function () {
    Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
  };
  b2PolyAndCircleContact.Create = function (allocator) {
    return new b2PolyAndCircleContact();
  };
  b2PolyAndCircleContact.Destroy = function (contact, allocator) {};
  b2PolyAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
    this.__super.Reset.call(this, fixtureA, fixtureB);
    b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
    b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_circleShape);
  };
  b2PolyAndCircleContact.prototype.Evaluate = function () {
    var bA = this.m_fixtureA.m_body;
    var bB = this.m_fixtureB.m_body;
    b2Collision.CollidePolygonAndCircle(
      this.m_manifold,
      this.m_fixtureA.GetShape() instanceof b2PolygonShape
        ? this.m_fixtureA.GetShape()
        : null,
      bA.m_xf,
      this.m_fixtureB.GetShape() instanceof b2CircleShape
        ? this.m_fixtureB.GetShape()
        : null,
      bB.m_xf
    );
  };
  Box2D.inherit(b2PolyAndEdgeContact, Box2D.Dynamics.Contacts.b2Contact);
  b2PolyAndEdgeContact.prototype.__super =
    Box2D.Dynamics.Contacts.b2Contact.prototype;
  b2PolyAndEdgeContact.b2PolyAndEdgeContact = function () {
    Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
  };
  b2PolyAndEdgeContact.Create = function (allocator) {
    return new b2PolyAndEdgeContact();
  };
  b2PolyAndEdgeContact.Destroy = function (contact, allocator) {};
  b2PolyAndEdgeContact.prototype.Reset = function (fixtureA, fixtureB) {
    this.__super.Reset.call(this, fixtureA, fixtureB);
    b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
    b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_edgeShape);
  };
  b2PolyAndEdgeContact.prototype.Evaluate = function () {
    var bA = this.m_fixtureA.GetBody();
    var bB = this.m_fixtureB.GetBody();
    this.b2CollidePolyAndEdge(
      this.m_manifold,
      this.m_fixtureA.GetShape() instanceof b2PolygonShape
        ? this.m_fixtureA.GetShape()
        : null,
      bA.m_xf,
      this.m_fixtureB.GetShape() instanceof b2EdgeShape
        ? this.m_fixtureB.GetShape()
        : null,
      bB.m_xf
    );
  };
  b2PolyAndEdgeContact.prototype.b2CollidePolyAndEdge = function (
    manifold,
    polygon,
    xf1,
    edge,
    xf2
  ) {};
  Box2D.inherit(b2PolygonContact, Box2D.Dynamics.Contacts.b2Contact);
  b2PolygonContact.prototype.__super =
    Box2D.Dynamics.Contacts.b2Contact.prototype;
  b2PolygonContact.b2PolygonContact = function () {
    Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
  };
  b2PolygonContact.Create = function (allocator) {
    return new b2PolygonContact();
  };
  b2PolygonContact.Destroy = function (contact, allocator) {};
  b2PolygonContact.prototype.Reset = function (fixtureA, fixtureB) {
    this.__super.Reset.call(this, fixtureA, fixtureB);
  };
  b2PolygonContact.prototype.Evaluate = function () {
    var bA = this.m_fixtureA.GetBody();
    var bB = this.m_fixtureB.GetBody();
    b2Collision.CollidePolygons(
      this.m_manifold,
      this.m_fixtureA.GetShape() instanceof b2PolygonShape
        ? this.m_fixtureA.GetShape()
        : null,
      bA.m_xf,
      this.m_fixtureB.GetShape() instanceof b2PolygonShape
        ? this.m_fixtureB.GetShape()
        : null,
      bB.m_xf
    );
  };
  b2PositionSolverManifold.b2PositionSolverManifold = function () {};
  b2PositionSolverManifold.prototype.b2PositionSolverManifold = function () {
    this.m_normal = new b2Vec2();
    this.m_separations = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
    this.m_points = new Vector2(b2Settings.b2_maxManifoldPoints);
    for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++)
      this.m_points[i] = new b2Vec2();
  };
  b2PositionSolverManifold.prototype.Initialize = function (cc) {
    b2Settings.b2Assert(cc.pointCount > 0);
    var i = 0;
    var clipPointX = 0;
    var clipPointY = 0;
    var tMat;
    var tVec;
    var planePointX = 0;
    var planePointY = 0;
    switch (cc.type) {
      case b2Manifold.e_circles:
        tMat = cc.bodyA.m_xf.R;
        tVec = cc.localPoint;
        var pointAX =
          cc.bodyA.m_xf.position.x +
          (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        var pointAY =
          cc.bodyA.m_xf.position.y +
          (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        tMat = cc.bodyB.m_xf.R;
        tVec = cc.points[0].localPoint;
        var pointBX =
          cc.bodyB.m_xf.position.x +
          (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        var pointBY =
          cc.bodyB.m_xf.position.y +
          (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        var dX = pointBX - pointAX;
        var dY = pointBY - pointAY;
        var d2 = dX * dX + dY * dY;
        if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
          var d = Math.sqrt(d2);
          this.m_normal.x = dX / d;
          this.m_normal.y = dY / d;
        } else {
          this.m_normal.x = 1;
          this.m_normal.y = 0;
        }
        this.m_points[0].x = 0.5 * (pointAX + pointBX);
        this.m_points[0].y = 0.5 * (pointAY + pointBY);
        this.m_separations[0] =
          dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
        break;
      case b2Manifold.e_faceA:
        tMat = cc.bodyA.m_xf.R;
        tVec = cc.localPlaneNormal;
        this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = cc.bodyA.m_xf.R;
        tVec = cc.localPoint;
        planePointX =
          cc.bodyA.m_xf.position.x +
          (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        planePointY =
          cc.bodyA.m_xf.position.y +
          (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        tMat = cc.bodyB.m_xf.R;
        for (i = 0; i < cc.pointCount; ++i) {
          tVec = cc.points[i].localPoint;
          clipPointX =
            cc.bodyB.m_xf.position.x +
            (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
          clipPointY =
            cc.bodyB.m_xf.position.y +
            (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
          this.m_separations[i] =
            (clipPointX - planePointX) * this.m_normal.x +
            (clipPointY - planePointY) * this.m_normal.y -
            cc.radius;
          this.m_points[i].x = clipPointX;
          this.m_points[i].y = clipPointY;
        }
        break;
      case b2Manifold.e_faceB:
        tMat = cc.bodyB.m_xf.R;
        tVec = cc.localPlaneNormal;
        this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
        this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
        tMat = cc.bodyB.m_xf.R;
        tVec = cc.localPoint;
        planePointX =
          cc.bodyB.m_xf.position.x +
          (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        planePointY =
          cc.bodyB.m_xf.position.y +
          (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        tMat = cc.bodyA.m_xf.R;
        for (i = 0; i < cc.pointCount; ++i) {
          tVec = cc.points[i].localPoint;
          clipPointX =
            cc.bodyA.m_xf.position.x +
            (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
          clipPointY =
            cc.bodyA.m_xf.position.y +
            (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
          this.m_separations[i] =
            (clipPointX - planePointX) * this.m_normal.x +
            (clipPointY - planePointY) * this.m_normal.y -
            cc.radius;
          this.m_points[i].Set(clipPointX, clipPointY);
        }
        this.m_normal.x *= -1;
        this.m_normal.y *= -1;
        break;
    }
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointA =
      new b2Vec2();
    Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointB =
      new b2Vec2();
  });
})();
(function () {
  var b2Body = Box2D.Dynamics.b2Body,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
    b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2ContactManager = Box2D.Dynamics.b2ContactManager,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
    b2FilterData = Box2D.Dynamics.b2FilterData,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Island = Box2D.Dynamics.b2Island,
    b2TimeStep = Box2D.Dynamics.b2TimeStep,
    b2World = Box2D.Dynamics.b2World,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3,
    b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
    b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2Shape = Box2D.Collision.Shapes.b2Shape,
    b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController,
    b2ConstantAccelController =
      Box2D.Dynamics.Controllers.b2ConstantAccelController,
    b2ConstantForceController =
      Box2D.Dynamics.Controllers.b2ConstantForceController,
    b2Controller = Box2D.Dynamics.Controllers.b2Controller,
    b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
    b2GravityController = Box2D.Dynamics.Controllers.b2GravityController,
    b2TensorDampingController =
      Box2D.Dynamics.Controllers.b2TensorDampingController;
  Box2D.inherit(b2BuoyancyController, Box2D.Dynamics.Controllers.b2Controller);
  b2BuoyancyController.prototype.__super =
    Box2D.Dynamics.Controllers.b2Controller.prototype;
  b2BuoyancyController.b2BuoyancyController = function () {
    Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
    this.normal = new b2Vec2(0, -1);
    this.offset = 0;
    this.density = 0;
    this.velocity = new b2Vec2(0, 0);
    this.linearDrag = 2;
    this.angularDrag = 1;
    this.useDensity = false;
    this.useWorldGravity = true;
    this.gravity = null;
  };
  b2BuoyancyController.prototype.Step = function (step) {
    if (!this.m_bodyList) return;
    if (this.useWorldGravity)
      this.gravity = this.GetWorld().GetGravity().Copy();
    for (var i = this.m_bodyList; i; i = i.nextBody) {
      var body = i.body;
      if (body.IsAwake() == false) continue;
      var areac = new b2Vec2();
      var massc = new b2Vec2();
      var area = 0;
      var mass = 0;
      for (
        var fixture = body.GetFixtureList();
        fixture;
        fixture = fixture.GetNext()
      ) {
        var sc = new b2Vec2();
        var sarea = fixture
          .GetShape()
          .ComputeSubmergedArea(
            this.normal,
            this.offset,
            body.GetTransform(),
            sc
          );
        area += sarea;
        areac.x += sarea * sc.x;
        areac.y += sarea * sc.y;
        var shapeDensity = 0;
        if (this.useDensity) shapeDensity = 1;
        else shapeDensity = 1;
        mass += sarea * shapeDensity;
        massc.x += sarea * sc.x * shapeDensity;
        massc.y += sarea * sc.y * shapeDensity;
      }
      areac.x /= area;
      areac.y /= area;
      massc.x /= mass;
      massc.y /= mass;
      if (area < Number.MIN_VALUE) continue;
      var buoyancyForce = this.gravity.GetNegative();
      buoyancyForce.Multiply(this.density * area);
      body.ApplyForce(buoyancyForce, massc);
      var dragForce = body.GetLinearVelocityFromWorldPoint(areac);
      dragForce.Subtract(this.velocity);
      dragForce.Multiply(-this.linearDrag * area);
      body.ApplyForce(dragForce, areac);
      body.ApplyTorque(
        (-body.GetInertia() / body.GetMass()) *
          area *
          body.GetAngularVelocity() *
          this.angularDrag
      );
    }
  };
  b2BuoyancyController.prototype.Draw = function (debugDraw) {
    var r = 1e3;
    var p1 = new b2Vec2();
    var p2 = new b2Vec2();
    p1.x = this.normal.x * this.offset + this.normal.y * r;
    p1.y = this.normal.y * this.offset - this.normal.x * r;
    p2.x = this.normal.x * this.offset - this.normal.y * r;
    p2.y = this.normal.y * this.offset + this.normal.x * r;
    var color = new b2Color(0, 0, 1);
    debugDraw.DrawSegment(p1, p2, color);
  };
  Box2D.inherit(
    b2ConstantAccelController,
    Box2D.Dynamics.Controllers.b2Controller
  );
  b2ConstantAccelController.prototype.__super =
    Box2D.Dynamics.Controllers.b2Controller.prototype;
  b2ConstantAccelController.b2ConstantAccelController = function () {
    Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
    this.A = new b2Vec2(0, 0);
  };
  b2ConstantAccelController.prototype.Step = function (step) {
    var smallA = new b2Vec2(this.A.x * step.dt, this.A.y * step.dt);
    for (var i = this.m_bodyList; i; i = i.nextBody) {
      var body = i.body;
      if (!body.IsAwake()) continue;
      body.SetLinearVelocity(
        new b2Vec2(
          body.GetLinearVelocity().x + smallA.x,
          body.GetLinearVelocity().y + smallA.y
        )
      );
    }
  };
  Box2D.inherit(
    b2ConstantForceController,
    Box2D.Dynamics.Controllers.b2Controller
  );
  b2ConstantForceController.prototype.__super =
    Box2D.Dynamics.Controllers.b2Controller.prototype;
  b2ConstantForceController.b2ConstantForceController = function () {
    Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
    this.F = new b2Vec2(0, 0);
  };
  b2ConstantForceController.prototype.Step = function (step) {
    for (var i = this.m_bodyList; i; i = i.nextBody) {
      var body = i.body;
      if (!body.IsAwake()) continue;
      body.ApplyForce(this.F, body.GetWorldCenter());
    }
  };
  b2Controller.b2Controller = function () {};
  b2Controller.prototype.Step = function (step) {};
  b2Controller.prototype.Draw = function (debugDraw) {};
  b2Controller.prototype.AddBody = function (body) {
    var edge = new b2ControllerEdge();
    edge.controller = this;
    edge.body = body;
    edge.nextBody = this.m_bodyList;
    edge.prevBody = null;
    this.m_bodyList = edge;
    if (edge.nextBody) edge.nextBody.prevBody = edge;
    this.m_bodyCount++;
    edge.nextController = body.m_controllerList;
    edge.prevController = null;
    body.m_controllerList = edge;
    if (edge.nextController) edge.nextController.prevController = edge;
    body.m_controllerCount++;
  };
  b2Controller.prototype.RemoveBody = function (body) {
    var edge = body.m_controllerList;
    while (edge && edge.controller != this) edge = edge.nextController;
    if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
    if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
    if (edge.nextController)
      edge.nextController.prevController = edge.prevController;
    if (edge.prevController)
      edge.prevController.nextController = edge.nextController;
    if (this.m_bodyList == edge) this.m_bodyList = edge.nextBody;
    if (body.m_controllerList == edge)
      body.m_controllerList = edge.nextController;
    body.m_controllerCount--;
    this.m_bodyCount--;
  };
  b2Controller.prototype.Clear = function () {
    while (this.m_bodyList) this.RemoveBody(this.m_bodyList.body);
  };
  b2Controller.prototype.GetNext = function () {
    return this.m_next;
  };
  b2Controller.prototype.GetWorld = function () {
    return this.m_world;
  };
  b2Controller.prototype.GetBodyList = function () {
    return this.m_bodyList;
  };
  b2ControllerEdge.b2ControllerEdge = function () {};
  Box2D.inherit(b2GravityController, Box2D.Dynamics.Controllers.b2Controller);
  b2GravityController.prototype.__super =
    Box2D.Dynamics.Controllers.b2Controller.prototype;
  b2GravityController.b2GravityController = function () {
    Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
    this.G = 1;
    this.invSqr = true;
  };
  b2GravityController.prototype.Step = function (step) {
    var i = null;
    var body1 = null;
    var p1 = null;
    var mass1 = 0;
    var j = null;
    var body2 = null;
    var p2 = null;
    var dx = 0;
    var dy = 0;
    var r2 = 0;
    var f = null;
    if (this.invSqr)
      for (i = this.m_bodyList; i; i = i.nextBody) {
        body1 = i.body;
        p1 = body1.GetWorldCenter();
        mass1 = body1.GetMass();
        for (j = this.m_bodyList; j != i; j = j.nextBody) {
          body2 = j.body;
          p2 = body2.GetWorldCenter();
          dx = p2.x - p1.x;
          dy = p2.y - p1.y;
          r2 = dx * dx + dy * dy;
          if (r2 < Number.MIN_VALUE) continue;
          f = new b2Vec2(dx, dy);
          f.Multiply((this.G / r2 / Math.sqrt(r2)) * mass1 * body2.GetMass());
          if (body1.IsAwake()) body1.ApplyForce(f, p1);
          f.Multiply(-1);
          if (body2.IsAwake()) body2.ApplyForce(f, p2);
        }
      }
    else
      for (i = this.m_bodyList; i; i = i.nextBody) {
        body1 = i.body;
        p1 = body1.GetWorldCenter();
        mass1 = body1.GetMass();
        for (j = this.m_bodyList; j != i; j = j.nextBody) {
          body2 = j.body;
          p2 = body2.GetWorldCenter();
          dx = p2.x - p1.x;
          dy = p2.y - p1.y;
          r2 = dx * dx + dy * dy;
          if (r2 < Number.MIN_VALUE) continue;
          f = new b2Vec2(dx, dy);
          f.Multiply((this.G / r2) * mass1 * body2.GetMass());
          if (body1.IsAwake()) body1.ApplyForce(f, p1);
          f.Multiply(-1);
          if (body2.IsAwake()) body2.ApplyForce(f, p2);
        }
      }
  };
  Box2D.inherit(
    b2TensorDampingController,
    Box2D.Dynamics.Controllers.b2Controller
  );
  b2TensorDampingController.prototype.__super =
    Box2D.Dynamics.Controllers.b2Controller.prototype;
  b2TensorDampingController.b2TensorDampingController = function () {
    Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
    this.T = new b2Mat22();
    this.maxTimestep = 0;
  };
  b2TensorDampingController.prototype.SetAxisAligned = function (
    xDamping,
    yDamping
  ) {
    if (xDamping === undefined) xDamping = 0;
    if (yDamping === undefined) yDamping = 0;
    this.T.col1.x = -xDamping;
    this.T.col1.y = 0;
    this.T.col2.x = 0;
    this.T.col2.y = -yDamping;
    if (xDamping > 0 || yDamping > 0)
      this.maxTimestep = 1 / Math.max(xDamping, yDamping);
    else this.maxTimestep = 0;
  };
  b2TensorDampingController.prototype.Step = function (step) {
    var timestep = step.dt;
    if (timestep <= Number.MIN_VALUE) return;
    if (timestep > this.maxTimestep && this.maxTimestep > 0)
      timestep = this.maxTimestep;
    for (var i = this.m_bodyList; i; i = i.nextBody) {
      var body = i.body;
      if (!body.IsAwake()) continue;
      var damping = body.GetWorldVector(
        b2Math.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity()))
      );
      body.SetLinearVelocity(
        new b2Vec2(
          body.GetLinearVelocity().x + damping.x * timestep,
          body.GetLinearVelocity().y + damping.y * timestep
        )
      );
    }
  };
})();
(function () {
  var b2Color = Box2D.Common.b2Color,
    b2internal = Box2D.Common.b2internal,
    b2Settings = Box2D.Common.b2Settings,
    b2Mat22 = Box2D.Common.Math.b2Mat22,
    b2Mat33 = Box2D.Common.Math.b2Mat33,
    b2Math = Box2D.Common.Math.b2Math,
    b2Sweep = Box2D.Common.Math.b2Sweep,
    b2Transform = Box2D.Common.Math.b2Transform,
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2Vec3 = Box2D.Common.Math.b2Vec3,
    b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
    b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
    b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
    b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
    b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
    b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
    b2Joint = Box2D.Dynamics.Joints.b2Joint,
    b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
    b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
    b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
    b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
    b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
    b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
    b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
    b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
    b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
    b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
    b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
    b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
    b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
    b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2ContactManager = Box2D.Dynamics.b2ContactManager,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
    b2FilterData = Box2D.Dynamics.b2FilterData,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Island = Box2D.Dynamics.b2Island,
    b2TimeStep = Box2D.Dynamics.b2TimeStep,
    b2World = Box2D.Dynamics.b2World;
  Box2D.inherit(b2DistanceJoint, Box2D.Dynamics.Joints.b2Joint);
  b2DistanceJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2DistanceJoint.b2DistanceJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.m_localAnchor1 = new b2Vec2();
    this.m_localAnchor2 = new b2Vec2();
    this.m_u = new b2Vec2();
  };
  b2DistanceJoint.prototype.GetAnchorA = function () {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
  };
  b2DistanceJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
  };
  b2DistanceJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(
      inv_dt * this.m_impulse * this.m_u.x,
      inv_dt * this.m_impulse * this.m_u.y
    );
  };
  b2DistanceJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return 0;
  };
  b2DistanceJoint.prototype.GetLength = function () {
    return this.m_length;
  };
  b2DistanceJoint.prototype.SetLength = function (length) {
    if (length === undefined) length = 0;
    this.m_length = length;
  };
  b2DistanceJoint.prototype.GetFrequency = function () {
    return this.m_frequencyHz;
  };
  b2DistanceJoint.prototype.SetFrequency = function (hz) {
    if (hz === undefined) hz = 0;
    this.m_frequencyHz = hz;
  };
  b2DistanceJoint.prototype.GetDampingRatio = function () {
    return this.m_dampingRatio;
  };
  b2DistanceJoint.prototype.SetDampingRatio = function (ratio) {
    if (ratio === undefined) ratio = 0;
    this.m_dampingRatio = ratio;
  };
  b2DistanceJoint.prototype.b2DistanceJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    var tMat;
    var tX = 0;
    var tY = 0;
    this.m_localAnchor1.SetV(def.localAnchorA);
    this.m_localAnchor2.SetV(def.localAnchorB);
    this.m_length = def.length;
    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;
    this.m_impulse = 0;
    this.m_gamma = 0;
    this.m_bias = 0;
  };
  b2DistanceJoint.prototype.InitVelocityConstraints = function (step) {
    var tMat;
    var tX = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
    this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
    var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
    if (length > b2Settings.b2_linearSlop) this.m_u.Multiply(1 / length);
    else this.m_u.SetZero();
    var cr1u = r1X * this.m_u.y - r1Y * this.m_u.x;
    var cr2u = r2X * this.m_u.y - r2Y * this.m_u.x;
    var invMass =
      bA.m_invMass +
      bA.m_invI * cr1u * cr1u +
      bB.m_invMass +
      bB.m_invI * cr2u * cr2u;
    this.m_mass = invMass != 0 ? 1 / invMass : 0;
    if (this.m_frequencyHz > 0) {
      var C = length - this.m_length;
      var omega = 2 * Math.PI * this.m_frequencyHz;
      var d = 2 * this.m_mass * this.m_dampingRatio * omega;
      var k = this.m_mass * omega * omega;
      this.m_gamma = step.dt * (d + step.dt * k);
      this.m_gamma = this.m_gamma != 0 ? 1 / this.m_gamma : 0;
      this.m_bias = C * step.dt * k * this.m_gamma;
      this.m_mass = invMass + this.m_gamma;
      this.m_mass = this.m_mass != 0 ? 1 / this.m_mass : 0;
    }
    if (step.warmStarting) {
      this.m_impulse *= step.dtRatio;
      var PX = this.m_impulse * this.m_u.x;
      var PY = this.m_impulse * this.m_u.y;
      bA.m_linearVelocity.x -= bA.m_invMass * PX;
      bA.m_linearVelocity.y -= bA.m_invMass * PY;
      bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_linearVelocity.x += bB.m_invMass * PX;
      bB.m_linearVelocity.y += bB.m_invMass * PY;
      bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
    } else this.m_impulse = 0;
  };
  b2DistanceJoint.prototype.SolveVelocityConstraints = function (step) {
    var tMat;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    var tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var v1X = bA.m_linearVelocity.x + -bA.m_angularVelocity * r1Y;
    var v1Y = bA.m_linearVelocity.y + bA.m_angularVelocity * r1X;
    var v2X = bB.m_linearVelocity.x + -bB.m_angularVelocity * r2Y;
    var v2Y = bB.m_linearVelocity.y + bB.m_angularVelocity * r2X;
    var Cdot = this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y);
    var impulse =
      -this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
    this.m_impulse += impulse;
    var PX = impulse * this.m_u.x;
    var PY = impulse * this.m_u.y;
    bA.m_linearVelocity.x -= bA.m_invMass * PX;
    bA.m_linearVelocity.y -= bA.m_invMass * PY;
    bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
    bB.m_linearVelocity.x += bB.m_invMass * PX;
    bB.m_linearVelocity.y += bB.m_invMass * PY;
    bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
  };
  b2DistanceJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    var tMat;
    if (this.m_frequencyHz > 0) return true;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    var tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
    var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
    var length = Math.sqrt(dX * dX + dY * dY);
    dX /= length;
    dY /= length;
    var C = length - this.m_length;
    C = b2Math.Clamp(
      C,
      -b2Settings.b2_maxLinearCorrection,
      b2Settings.b2_maxLinearCorrection
    );
    var impulse = -this.m_mass * C;
    this.m_u.Set(dX, dY);
    var PX = impulse * this.m_u.x;
    var PY = impulse * this.m_u.y;
    bA.m_sweep.c.x -= bA.m_invMass * PX;
    bA.m_sweep.c.y -= bA.m_invMass * PY;
    bA.m_sweep.a -= bA.m_invI * (r1X * PY - r1Y * PX);
    bB.m_sweep.c.x += bB.m_invMass * PX;
    bB.m_sweep.c.y += bB.m_invMass * PY;
    bB.m_sweep.a += bB.m_invI * (r2X * PY - r2Y * PX);
    bA.SynchronizeTransform();
    bB.SynchronizeTransform();
    return b2Math.Abs(C) < b2Settings.b2_linearSlop;
  };
  Box2D.inherit(b2DistanceJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2DistanceJointDef.prototype.__super =
    Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2DistanceJointDef.b2DistanceJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
  };
  b2DistanceJointDef.prototype.b2DistanceJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_distanceJoint;
    this.length = 1;
    this.frequencyHz = 0;
    this.dampingRatio = 0;
  };
  b2DistanceJointDef.prototype.Initialize = function (
    bA,
    bB,
    anchorA,
    anchorB
  ) {
    this.bodyA = bA;
    this.bodyB = bB;
    this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchorA));
    this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchorB));
    var dX = anchorB.x - anchorA.x;
    var dY = anchorB.y - anchorA.y;
    this.length = Math.sqrt(dX * dX + dY * dY);
    this.frequencyHz = 0;
    this.dampingRatio = 0;
  };
  Box2D.inherit(b2FrictionJoint, Box2D.Dynamics.Joints.b2Joint);
  b2FrictionJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2FrictionJoint.b2FrictionJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.m_localAnchorA = new b2Vec2();
    this.m_localAnchorB = new b2Vec2();
    this.m_linearMass = new b2Mat22();
    this.m_linearImpulse = new b2Vec2();
  };
  b2FrictionJoint.prototype.GetAnchorA = function () {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
  };
  b2FrictionJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
  };
  b2FrictionJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(
      inv_dt * this.m_linearImpulse.x,
      inv_dt * this.m_linearImpulse.y
    );
  };
  b2FrictionJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return inv_dt * this.m_angularImpulse;
  };
  b2FrictionJoint.prototype.SetMaxForce = function (force) {
    if (force === undefined) force = 0;
    this.m_maxForce = force;
  };
  b2FrictionJoint.prototype.GetMaxForce = function () {
    return this.m_maxForce;
  };
  b2FrictionJoint.prototype.SetMaxTorque = function (torque) {
    if (torque === undefined) torque = 0;
    this.m_maxTorque = torque;
  };
  b2FrictionJoint.prototype.GetMaxTorque = function () {
    return this.m_maxTorque;
  };
  b2FrictionJoint.prototype.b2FrictionJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    this.m_localAnchorA.SetV(def.localAnchorA);
    this.m_localAnchorB.SetV(def.localAnchorB);
    this.m_linearMass.SetZero();
    this.m_angularMass = 0;
    this.m_linearImpulse.SetZero();
    this.m_angularImpulse = 0;
    this.m_maxForce = def.maxForce;
    this.m_maxTorque = def.maxTorque;
  };
  b2FrictionJoint.prototype.InitVelocityConstraints = function (step) {
    var tMat;
    var tX = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    tMat = bA.m_xf.R;
    var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
    var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
    tX = tMat.col1.x * rAX + tMat.col2.x * rAY;
    rAY = tMat.col1.y * rAX + tMat.col2.y * rAY;
    rAX = tX;
    tMat = bB.m_xf.R;
    var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
    var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * rBX + tMat.col2.x * rBY;
    rBY = tMat.col1.y * rBX + tMat.col2.y * rBY;
    rBX = tX;
    var mA = bA.m_invMass;
    var mB = bB.m_invMass;
    var iA = bA.m_invI;
    var iB = bB.m_invI;
    var K = new b2Mat22();
    K.col1.x = mA + mB;
    K.col2.x = 0;
    K.col1.y = 0;
    K.col2.y = mA + mB;
    K.col1.x += iA * rAY * rAY;
    K.col2.x += -iA * rAX * rAY;
    K.col1.y += -iA * rAX * rAY;
    K.col2.y += iA * rAX * rAX;
    K.col1.x += iB * rBY * rBY;
    K.col2.x += -iB * rBX * rBY;
    K.col1.y += -iB * rBX * rBY;
    K.col2.y += iB * rBX * rBX;
    K.GetInverse(this.m_linearMass);
    this.m_angularMass = iA + iB;
    if (this.m_angularMass > 0) this.m_angularMass = 1 / this.m_angularMass;
    if (step.warmStarting) {
      this.m_linearImpulse.x *= step.dtRatio;
      this.m_linearImpulse.y *= step.dtRatio;
      this.m_angularImpulse *= step.dtRatio;
      var P = this.m_linearImpulse;
      bA.m_linearVelocity.x -= mA * P.x;
      bA.m_linearVelocity.y -= mA * P.y;
      bA.m_angularVelocity -=
        iA * (rAX * P.y - rAY * P.x + this.m_angularImpulse);
      bB.m_linearVelocity.x += mB * P.x;
      bB.m_linearVelocity.y += mB * P.y;
      bB.m_angularVelocity +=
        iB * (rBX * P.y - rBY * P.x + this.m_angularImpulse);
    } else {
      this.m_linearImpulse.SetZero();
      this.m_angularImpulse = 0;
    }
  };
  b2FrictionJoint.prototype.SolveVelocityConstraints = function (step) {
    var tMat;
    var tX = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var vA = bA.m_linearVelocity;
    var wA = bA.m_angularVelocity;
    var vB = bB.m_linearVelocity;
    var wB = bB.m_angularVelocity;
    var mA = bA.m_invMass;
    var mB = bB.m_invMass;
    var iA = bA.m_invI;
    var iB = bB.m_invI;
    tMat = bA.m_xf.R;
    var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
    var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
    tX = tMat.col1.x * rAX + tMat.col2.x * rAY;
    rAY = tMat.col1.y * rAX + tMat.col2.y * rAY;
    rAX = tX;
    tMat = bB.m_xf.R;
    var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
    var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * rBX + tMat.col2.x * rBY;
    rBY = tMat.col1.y * rBX + tMat.col2.y * rBY;
    rBX = tX;
    var maxImpulse = 0;
    var Cdot = wB - wA;
    var impulse = -this.m_angularMass * Cdot;
    var oldImpulse = this.m_angularImpulse;
    maxImpulse = step.dt * this.m_maxTorque;
    this.m_angularImpulse = b2Math.Clamp(
      this.m_angularImpulse + impulse,
      -maxImpulse,
      maxImpulse
    );
    impulse = this.m_angularImpulse - oldImpulse;
    wA -= iA * impulse;
    wB += iB * impulse;
    var CdotX = vB.x - wB * rBY - vA.x + wA * rAY;
    var CdotY = vB.y + wB * rBX - vA.y - wA * rAX;
    var impulseV = b2Math.MulMV(this.m_linearMass, new b2Vec2(-CdotX, -CdotY));
    var oldImpulseV = this.m_linearImpulse.Copy();
    this.m_linearImpulse.Add(impulseV);
    maxImpulse = step.dt * this.m_maxForce;
    if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
      this.m_linearImpulse.Normalize();
      this.m_linearImpulse.Multiply(maxImpulse);
    }
    impulseV = b2Math.SubtractVV(this.m_linearImpulse, oldImpulseV);
    vA.x -= mA * impulseV.x;
    vA.y -= mA * impulseV.y;
    wA -= iA * (rAX * impulseV.y - rAY * impulseV.x);
    vB.x += mB * impulseV.x;
    vB.y += mB * impulseV.y;
    wB += iB * (rBX * impulseV.y - rBY * impulseV.x);
    bA.m_angularVelocity = wA;
    bB.m_angularVelocity = wB;
  };
  b2FrictionJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    return true;
  };
  Box2D.inherit(b2FrictionJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2FrictionJointDef.prototype.__super =
    Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2FrictionJointDef.b2FrictionJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
  };
  b2FrictionJointDef.prototype.b2FrictionJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_frictionJoint;
    this.maxForce = 0;
    this.maxTorque = 0;
  };
  b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
    this.bodyA = bA;
    this.bodyB = bB;
    this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
    this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
  };
  Box2D.inherit(b2GearJoint, Box2D.Dynamics.Joints.b2Joint);
  b2GearJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2GearJoint.b2GearJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.m_groundAnchor1 = new b2Vec2();
    this.m_groundAnchor2 = new b2Vec2();
    this.m_localAnchor1 = new b2Vec2();
    this.m_localAnchor2 = new b2Vec2();
    this.m_J = new b2Jacobian();
  };
  b2GearJoint.prototype.GetAnchorA = function () {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
  };
  b2GearJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
  };
  b2GearJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(
      inv_dt * this.m_impulse * this.m_J.linearB.x,
      inv_dt * this.m_impulse * this.m_J.linearB.y
    );
  };
  b2GearJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    var tMat = this.m_bodyB.m_xf.R;
    var rX = this.m_localAnchor1.x - this.m_bodyB.m_sweep.localCenter.x;
    var rY = this.m_localAnchor1.y - this.m_bodyB.m_sweep.localCenter.y;
    var tX = tMat.col1.x * rX + tMat.col2.x * rY;
    rY = tMat.col1.y * rX + tMat.col2.y * rY;
    rX = tX;
    var PX = this.m_impulse * this.m_J.linearB.x;
    var PY = this.m_impulse * this.m_J.linearB.y;
    return inv_dt * (this.m_impulse * this.m_J.angularB - rX * PY + rY * PX);
  };
  b2GearJoint.prototype.GetRatio = function () {
    return this.m_ratio;
  };
  b2GearJoint.prototype.SetRatio = function (ratio) {
    if (ratio === undefined) ratio = 0;
    this.m_ratio = ratio;
  };
  b2GearJoint.prototype.b2GearJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    var type1 = parseInt(def.joint1.m_type);
    var type2 = parseInt(def.joint2.m_type);
    this.m_revolute1 = null;
    this.m_prismatic1 = null;
    this.m_revolute2 = null;
    this.m_prismatic2 = null;
    var coordinate1 = 0;
    var coordinate2 = 0;
    this.m_ground1 = def.joint1.GetBodyA();
    this.m_bodyA = def.joint1.GetBodyB();
    if (type1 == b2Joint.e_revoluteJoint) {
      this.m_revolute1 =
        def.joint1 instanceof b2RevoluteJoint ? def.joint1 : null;
      this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
      this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
      coordinate1 = this.m_revolute1.GetJointAngle();
    } else {
      this.m_prismatic1 =
        def.joint1 instanceof b2PrismaticJoint ? def.joint1 : null;
      this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
      this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
      coordinate1 = this.m_prismatic1.GetJointTranslation();
    }
    this.m_ground2 = def.joint2.GetBodyA();
    this.m_bodyB = def.joint2.GetBodyB();
    if (type2 == b2Joint.e_revoluteJoint) {
      this.m_revolute2 =
        def.joint2 instanceof b2RevoluteJoint ? def.joint2 : null;
      this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
      this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
      coordinate2 = this.m_revolute2.GetJointAngle();
    } else {
      this.m_prismatic2 =
        def.joint2 instanceof b2PrismaticJoint ? def.joint2 : null;
      this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
      this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
      coordinate2 = this.m_prismatic2.GetJointTranslation();
    }
    this.m_ratio = def.ratio;
    this.m_constant = coordinate1 + this.m_ratio * coordinate2;
    this.m_impulse = 0;
  };
  b2GearJoint.prototype.InitVelocityConstraints = function (step) {
    var g1 = this.m_ground1;
    var g2 = this.m_ground2;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var ugX = 0;
    var ugY = 0;
    var rX = 0;
    var rY = 0;
    var tMat;
    var tVec;
    var crug = 0;
    var tX = 0;
    var K = 0;
    this.m_J.SetZero();
    if (this.m_revolute1) {
      this.m_J.angularA = -1;
      K += bA.m_invI;
    } else {
      tMat = g1.m_xf.R;
      tVec = this.m_prismatic1.m_localXAxis1;
      ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
      ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
      tMat = bA.m_xf.R;
      rX = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      rY = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = tMat.col1.x * rX + tMat.col2.x * rY;
      rY = tMat.col1.y * rX + tMat.col2.y * rY;
      rX = tX;
      crug = rX * ugY - rY * ugX;
      this.m_J.linearA.Set(-ugX, -ugY);
      this.m_J.angularA = -crug;
      K += bA.m_invMass + bA.m_invI * crug * crug;
    }
    if (this.m_revolute2) {
      this.m_J.angularB = -this.m_ratio;
      K += this.m_ratio * this.m_ratio * bB.m_invI;
    } else {
      tMat = g2.m_xf.R;
      tVec = this.m_prismatic2.m_localXAxis1;
      ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
      ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
      tMat = bB.m_xf.R;
      rX = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      rY = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = tMat.col1.x * rX + tMat.col2.x * rY;
      rY = tMat.col1.y * rX + tMat.col2.y * rY;
      rX = tX;
      crug = rX * ugY - rY * ugX;
      this.m_J.linearB.Set(-this.m_ratio * ugX, -this.m_ratio * ugY);
      this.m_J.angularB = -this.m_ratio * crug;
      K +=
        this.m_ratio * this.m_ratio * (bB.m_invMass + bB.m_invI * crug * crug);
    }
    this.m_mass = K > 0 ? 1 / K : 0;
    if (step.warmStarting) {
      bA.m_linearVelocity.x +=
        bA.m_invMass * this.m_impulse * this.m_J.linearA.x;
      bA.m_linearVelocity.y +=
        bA.m_invMass * this.m_impulse * this.m_J.linearA.y;
      bA.m_angularVelocity += bA.m_invI * this.m_impulse * this.m_J.angularA;
      bB.m_linearVelocity.x +=
        bB.m_invMass * this.m_impulse * this.m_J.linearB.x;
      bB.m_linearVelocity.y +=
        bB.m_invMass * this.m_impulse * this.m_J.linearB.y;
      bB.m_angularVelocity += bB.m_invI * this.m_impulse * this.m_J.angularB;
    } else this.m_impulse = 0;
  };
  b2GearJoint.prototype.SolveVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var Cdot = this.m_J.Compute(
      bA.m_linearVelocity,
      bA.m_angularVelocity,
      bB.m_linearVelocity,
      bB.m_angularVelocity
    );
    var impulse = -this.m_mass * Cdot;
    this.m_impulse += impulse;
    bA.m_linearVelocity.x += bA.m_invMass * impulse * this.m_J.linearA.x;
    bA.m_linearVelocity.y += bA.m_invMass * impulse * this.m_J.linearA.y;
    bA.m_angularVelocity += bA.m_invI * impulse * this.m_J.angularA;
    bB.m_linearVelocity.x += bB.m_invMass * impulse * this.m_J.linearB.x;
    bB.m_linearVelocity.y += bB.m_invMass * impulse * this.m_J.linearB.y;
    bB.m_angularVelocity += bB.m_invI * impulse * this.m_J.angularB;
  };
  b2GearJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    var linearError = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var coordinate1 = 0;
    var coordinate2 = 0;
    if (this.m_revolute1) coordinate1 = this.m_revolute1.GetJointAngle();
    else coordinate1 = this.m_prismatic1.GetJointTranslation();
    if (this.m_revolute2) coordinate2 = this.m_revolute2.GetJointAngle();
    else coordinate2 = this.m_prismatic2.GetJointTranslation();
    var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);
    var impulse = -this.m_mass * C;
    bA.m_sweep.c.x += bA.m_invMass * impulse * this.m_J.linearA.x;
    bA.m_sweep.c.y += bA.m_invMass * impulse * this.m_J.linearA.y;
    bA.m_sweep.a += bA.m_invI * impulse * this.m_J.angularA;
    bB.m_sweep.c.x += bB.m_invMass * impulse * this.m_J.linearB.x;
    bB.m_sweep.c.y += bB.m_invMass * impulse * this.m_J.linearB.y;
    bB.m_sweep.a += bB.m_invI * impulse * this.m_J.angularB;
    bA.SynchronizeTransform();
    bB.SynchronizeTransform();
    return linearError < b2Settings.b2_linearSlop;
  };
  Box2D.inherit(b2GearJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2GearJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2GearJointDef.b2GearJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
  };
  b2GearJointDef.prototype.b2GearJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_gearJoint;
    this.joint1 = null;
    this.joint2 = null;
    this.ratio = 1;
  };
  b2Jacobian.b2Jacobian = function () {
    this.linearA = new b2Vec2();
    this.linearB = new b2Vec2();
  };
  b2Jacobian.prototype.SetZero = function () {
    this.linearA.SetZero();
    this.angularA = 0;
    this.linearB.SetZero();
    this.angularB = 0;
  };
  b2Jacobian.prototype.Set = function (x1, a1, x2, a2) {
    if (a1 === undefined) a1 = 0;
    if (a2 === undefined) a2 = 0;
    this.linearA.SetV(x1);
    this.angularA = a1;
    this.linearB.SetV(x2);
    this.angularB = a2;
  };
  b2Jacobian.prototype.Compute = function (x1, a1, x2, a2) {
    if (a1 === undefined) a1 = 0;
    if (a2 === undefined) a2 = 0;
    return (
      this.linearA.x * x1.x +
      this.linearA.y * x1.y +
      this.angularA * a1 +
      (this.linearB.x * x2.x + this.linearB.y * x2.y) +
      this.angularB * a2
    );
  };
  b2Joint.b2Joint = function () {
    this.m_edgeA = new b2JointEdge();
    this.m_edgeB = new b2JointEdge();
    this.m_localCenterA = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
  };
  b2Joint.prototype.GetType = function () {
    return this.m_type;
  };
  b2Joint.prototype.GetAnchorA = function () {
    return null;
  };
  b2Joint.prototype.GetAnchorB = function () {
    return null;
  };
  b2Joint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return null;
  };
  b2Joint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return 0;
  };
  b2Joint.prototype.GetBodyA = function () {
    return this.m_bodyA;
  };
  b2Joint.prototype.GetBodyB = function () {
    return this.m_bodyB;
  };
  b2Joint.prototype.GetNext = function () {
    return this.m_next;
  };
  b2Joint.prototype.GetUserData = function () {
    return this.m_userData;
  };
  b2Joint.prototype.SetUserData = function (data) {
    this.m_userData = data;
  };
  b2Joint.prototype.IsActive = function () {
    return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
  };
  b2Joint.Create = function (def, allocator) {
    var joint = null;
    switch (def.type) {
      case b2Joint.e_distanceJoint:
        joint = new b2DistanceJoint(
          def instanceof b2DistanceJointDef ? def : null
        );
        break;
      case b2Joint.e_mouseJoint:
        joint = new b2MouseJoint(def instanceof b2MouseJointDef ? def : null);
        break;
      case b2Joint.e_prismaticJoint:
        joint = new b2PrismaticJoint(
          def instanceof b2PrismaticJointDef ? def : null
        );
        break;
      case b2Joint.e_revoluteJoint:
        joint = new b2RevoluteJoint(
          def instanceof b2RevoluteJointDef ? def : null
        );
        break;
      case b2Joint.e_pulleyJoint:
        joint = new b2PulleyJoint(def instanceof b2PulleyJointDef ? def : null);
        break;
      case b2Joint.e_gearJoint:
        joint = new b2GearJoint(def instanceof b2GearJointDef ? def : null);
        break;
      case b2Joint.e_lineJoint:
        joint = new b2LineJoint(def instanceof b2LineJointDef ? def : null);
        break;
      case b2Joint.e_weldJoint:
        joint = new b2WeldJoint(def instanceof b2WeldJointDef ? def : null);
        break;
      case b2Joint.e_frictionJoint:
        joint = new b2FrictionJoint(
          def instanceof b2FrictionJointDef ? def : null
        );
        break;
      default:
        break;
    }
    return joint;
  };
  b2Joint.Destroy = function (joint, allocator) {};
  b2Joint.prototype.b2Joint = function (def) {
    b2Settings.b2Assert(def.bodyA != def.bodyB);
    this.m_type = def.type;
    this.m_prev = null;
    this.m_next = null;
    this.m_bodyA = def.bodyA;
    this.m_bodyB = def.bodyB;
    this.m_collideConnected = def.collideConnected;
    this.m_islandFlag = false;
    this.m_userData = def.userData;
  };
  b2Joint.prototype.InitVelocityConstraints = function (step) {};
  b2Joint.prototype.SolveVelocityConstraints = function (step) {};
  b2Joint.prototype.FinalizeVelocityConstraints = function () {};
  b2Joint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    return false;
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.Joints.b2Joint.e_unknownJoint = 0;
    Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint = 1;
    Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint = 2;
    Box2D.Dynamics.Joints.b2Joint.e_distanceJoint = 3;
    Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint = 4;
    Box2D.Dynamics.Joints.b2Joint.e_mouseJoint = 5;
    Box2D.Dynamics.Joints.b2Joint.e_gearJoint = 6;
    Box2D.Dynamics.Joints.b2Joint.e_lineJoint = 7;
    Box2D.Dynamics.Joints.b2Joint.e_weldJoint = 8;
    Box2D.Dynamics.Joints.b2Joint.e_frictionJoint = 9;
    Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit = 0;
    Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit = 1;
    Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit = 2;
    Box2D.Dynamics.Joints.b2Joint.e_equalLimits = 3;
  });
  b2JointDef.b2JointDef = function () {};
  b2JointDef.prototype.b2JointDef = function () {
    this.type = b2Joint.e_unknownJoint;
    this.userData = null;
    this.bodyA = null;
    this.bodyB = null;
    this.collideConnected = false;
  };
  b2JointEdge.b2JointEdge = function () {};
  Box2D.inherit(b2LineJoint, Box2D.Dynamics.Joints.b2Joint);
  b2LineJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2LineJoint.b2LineJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.m_localAnchor1 = new b2Vec2();
    this.m_localAnchor2 = new b2Vec2();
    this.m_localXAxis1 = new b2Vec2();
    this.m_localYAxis1 = new b2Vec2();
    this.m_axis = new b2Vec2();
    this.m_perp = new b2Vec2();
    this.m_K = new b2Mat22();
    this.m_impulse = new b2Vec2();
  };
  b2LineJoint.prototype.GetAnchorA = function () {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
  };
  b2LineJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
  };
  b2LineJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(
      inv_dt *
        (this.m_impulse.x * this.m_perp.x +
          (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x),
      inv_dt *
        (this.m_impulse.x * this.m_perp.y +
          (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y)
    );
  };
  b2LineJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return inv_dt * this.m_impulse.y;
  };
  b2LineJoint.prototype.GetJointTranslation = function () {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    var p1 = bA.GetWorldPoint(this.m_localAnchor1);
    var p2 = bB.GetWorldPoint(this.m_localAnchor2);
    var dX = p2.x - p1.x;
    var dY = p2.y - p1.y;
    var axis = bA.GetWorldVector(this.m_localXAxis1);
    var translation = axis.x * dX + axis.y * dY;
    return translation;
  };
  b2LineJoint.prototype.GetJointSpeed = function () {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    var tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var p1X = bA.m_sweep.c.x + r1X;
    var p1Y = bA.m_sweep.c.y + r1Y;
    var p2X = bB.m_sweep.c.x + r2X;
    var p2Y = bB.m_sweep.c.y + r2Y;
    var dX = p2X - p1X;
    var dY = p2Y - p1Y;
    var axis = bA.GetWorldVector(this.m_localXAxis1);
    var v1 = bA.m_linearVelocity;
    var v2 = bB.m_linearVelocity;
    var w1 = bA.m_angularVelocity;
    var w2 = bB.m_angularVelocity;
    var speed =
      dX * (-w1 * axis.y) +
      dY * (w1 * axis.x) +
      (axis.x * (v2.x + -w2 * r2Y - v1.x - -w1 * r1Y) +
        axis.y * (v2.y + w2 * r2X - v1.y - w1 * r1X));
    return speed;
  };
  b2LineJoint.prototype.IsLimitEnabled = function () {
    return this.m_enableLimit;
  };
  b2LineJoint.prototype.EnableLimit = function (flag) {
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_enableLimit = flag;
  };
  b2LineJoint.prototype.GetLowerLimit = function () {
    return this.m_lowerTranslation;
  };
  b2LineJoint.prototype.GetUpperLimit = function () {
    return this.m_upperTranslation;
  };
  b2LineJoint.prototype.SetLimits = function (lower, upper) {
    if (lower === undefined) lower = 0;
    if (upper === undefined) upper = 0;
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_lowerTranslation = lower;
    this.m_upperTranslation = upper;
  };
  b2LineJoint.prototype.IsMotorEnabled = function () {
    return this.m_enableMotor;
  };
  b2LineJoint.prototype.EnableMotor = function (flag) {
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_enableMotor = flag;
  };
  b2LineJoint.prototype.SetMotorSpeed = function (speed) {
    if (speed === undefined) speed = 0;
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_motorSpeed = speed;
  };
  b2LineJoint.prototype.GetMotorSpeed = function () {
    return this.m_motorSpeed;
  };
  b2LineJoint.prototype.SetMaxMotorForce = function (force) {
    if (force === undefined) force = 0;
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_maxMotorForce = force;
  };
  b2LineJoint.prototype.GetMaxMotorForce = function () {
    return this.m_maxMotorForce;
  };
  b2LineJoint.prototype.GetMotorForce = function () {
    return this.m_motorImpulse;
  };
  b2LineJoint.prototype.b2LineJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    var tMat;
    var tX = 0;
    var tY = 0;
    this.m_localAnchor1.SetV(def.localAnchorA);
    this.m_localAnchor2.SetV(def.localAnchorB);
    this.m_localXAxis1.SetV(def.localAxisA);
    this.m_localYAxis1.x = -this.m_localXAxis1.y;
    this.m_localYAxis1.y = this.m_localXAxis1.x;
    this.m_impulse.SetZero();
    this.m_motorMass = 0;
    this.m_motorImpulse = 0;
    this.m_lowerTranslation = def.lowerTranslation;
    this.m_upperTranslation = def.upperTranslation;
    this.m_maxMotorForce = def.maxMotorForce;
    this.m_motorSpeed = def.motorSpeed;
    this.m_enableLimit = def.enableLimit;
    this.m_enableMotor = def.enableMotor;
    this.m_limitState = b2Joint.e_inactiveLimit;
    this.m_axis.SetZero();
    this.m_perp.SetZero();
  };
  b2LineJoint.prototype.InitVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    var tX = 0;
    this.m_localCenterA.SetV(bA.GetLocalCenter());
    this.m_localCenterB.SetV(bB.GetLocalCenter());
    var xf1 = bA.GetTransform();
    var xf2 = bB.GetTransform();
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
    var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
    tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
    var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
    var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
    this.m_invMassA = bA.m_invMass;
    this.m_invMassB = bB.m_invMass;
    this.m_invIA = bA.m_invI;
    this.m_invIB = bB.m_invI;
    this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
    this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
    this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
    this.m_motorMass =
      this.m_invMassA +
      this.m_invMassB +
      this.m_invIA * this.m_a1 * this.m_a1 +
      this.m_invIB * this.m_a2 * this.m_a2;
    this.m_motorMass =
      this.m_motorMass > Number.MIN_VALUE ? 1 / this.m_motorMass : 0;
    this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
    this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
    this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
    var m1 = this.m_invMassA;
    var m2 = this.m_invMassB;
    var i1 = this.m_invIA;
    var i2 = this.m_invIB;
    this.m_K.col1.x =
      m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
    this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
    this.m_K.col2.x = this.m_K.col1.y;
    this.m_K.col2.y =
      m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
    if (this.m_enableLimit) {
      var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
      if (
        b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) <
        2 * b2Settings.b2_linearSlop
      )
        this.m_limitState = b2Joint.e_equalLimits;
      else if (jointTransition <= this.m_lowerTranslation) {
        if (this.m_limitState != b2Joint.e_atLowerLimit) {
          this.m_limitState = b2Joint.e_atLowerLimit;
          this.m_impulse.y = 0;
        }
      } else if (jointTransition >= this.m_upperTranslation) {
        if (this.m_limitState != b2Joint.e_atUpperLimit) {
          this.m_limitState = b2Joint.e_atUpperLimit;
          this.m_impulse.y = 0;
        }
      } else {
        this.m_limitState = b2Joint.e_inactiveLimit;
        this.m_impulse.y = 0;
      }
    } else this.m_limitState = b2Joint.e_inactiveLimit;
    if (this.m_enableMotor == false) this.m_motorImpulse = 0;
    if (step.warmStarting) {
      this.m_impulse.x *= step.dtRatio;
      this.m_impulse.y *= step.dtRatio;
      this.m_motorImpulse *= step.dtRatio;
      var PX =
        this.m_impulse.x * this.m_perp.x +
        (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x;
      var PY =
        this.m_impulse.x * this.m_perp.y +
        (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y;
      var L1 =
        this.m_impulse.x * this.m_s1 +
        (this.m_motorImpulse + this.m_impulse.y) * this.m_a1;
      var L2 =
        this.m_impulse.x * this.m_s2 +
        (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
      bA.m_linearVelocity.x -= this.m_invMassA * PX;
      bA.m_linearVelocity.y -= this.m_invMassA * PY;
      bA.m_angularVelocity -= this.m_invIA * L1;
      bB.m_linearVelocity.x += this.m_invMassB * PX;
      bB.m_linearVelocity.y += this.m_invMassB * PY;
      bB.m_angularVelocity += this.m_invIB * L2;
    } else {
      this.m_impulse.SetZero();
      this.m_motorImpulse = 0;
    }
  };
  b2LineJoint.prototype.SolveVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var v1 = bA.m_linearVelocity;
    var w1 = bA.m_angularVelocity;
    var v2 = bB.m_linearVelocity;
    var w2 = bB.m_angularVelocity;
    var PX = 0;
    var PY = 0;
    var L1 = 0;
    var L2 = 0;
    if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
      var Cdot =
        this.m_axis.x * (v2.x - v1.x) +
        this.m_axis.y * (v2.y - v1.y) +
        this.m_a2 * w2 -
        this.m_a1 * w1;
      var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
      var oldImpulse = this.m_motorImpulse;
      var maxImpulse = step.dt * this.m_maxMotorForce;
      this.m_motorImpulse = b2Math.Clamp(
        this.m_motorImpulse + impulse,
        -maxImpulse,
        maxImpulse
      );
      impulse = this.m_motorImpulse - oldImpulse;
      PX = impulse * this.m_axis.x;
      PY = impulse * this.m_axis.y;
      L1 = impulse * this.m_a1;
      L2 = impulse * this.m_a2;
      v1.x -= this.m_invMassA * PX;
      v1.y -= this.m_invMassA * PY;
      w1 -= this.m_invIA * L1;
      v2.x += this.m_invMassB * PX;
      v2.y += this.m_invMassB * PY;
      w2 += this.m_invIB * L2;
    }
    var Cdot1 =
      this.m_perp.x * (v2.x - v1.x) +
      this.m_perp.y * (v2.y - v1.y) +
      this.m_s2 * w2 -
      this.m_s1 * w1;
    if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
      var Cdot2 =
        this.m_axis.x * (v2.x - v1.x) +
        this.m_axis.y * (v2.y - v1.y) +
        this.m_a2 * w2 -
        this.m_a1 * w1;
      var f1 = this.m_impulse.Copy();
      var df = this.m_K.Solve(new b2Vec2(), -Cdot1, -Cdot2);
      this.m_impulse.Add(df);
      if (this.m_limitState == b2Joint.e_atLowerLimit)
        this.m_impulse.y = b2Math.Max(this.m_impulse.y, 0);
      else if (this.m_limitState == b2Joint.e_atUpperLimit)
        this.m_impulse.y = b2Math.Min(this.m_impulse.y, 0);
      var b = -Cdot1 - (this.m_impulse.y - f1.y) * this.m_K.col2.x;
      var f2r = 0;
      if (this.m_K.col1.x != 0) f2r = b / this.m_K.col1.x + f1.x;
      else f2r = f1.x;
      this.m_impulse.x = f2r;
      df.x = this.m_impulse.x - f1.x;
      df.y = this.m_impulse.y - f1.y;
      PX = df.x * this.m_perp.x + df.y * this.m_axis.x;
      PY = df.x * this.m_perp.y + df.y * this.m_axis.y;
      L1 = df.x * this.m_s1 + df.y * this.m_a1;
      L2 = df.x * this.m_s2 + df.y * this.m_a2;
      v1.x -= this.m_invMassA * PX;
      v1.y -= this.m_invMassA * PY;
      w1 -= this.m_invIA * L1;
      v2.x += this.m_invMassB * PX;
      v2.y += this.m_invMassB * PY;
      w2 += this.m_invIB * L2;
    } else {
      var df2 = 0;
      if (this.m_K.col1.x != 0) df2 = -Cdot1 / this.m_K.col1.x;
      else df2 = 0;
      this.m_impulse.x += df2;
      PX = df2 * this.m_perp.x;
      PY = df2 * this.m_perp.y;
      L1 = df2 * this.m_s1;
      L2 = df2 * this.m_s2;
      v1.x -= this.m_invMassA * PX;
      v1.y -= this.m_invMassA * PY;
      w1 -= this.m_invIA * L1;
      v2.x += this.m_invMassB * PX;
      v2.y += this.m_invMassB * PY;
      w2 += this.m_invIB * L2;
    }
    bA.m_linearVelocity.SetV(v1);
    bA.m_angularVelocity = w1;
    bB.m_linearVelocity.SetV(v2);
    bB.m_angularVelocity = w2;
  };
  b2LineJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    var limitC = 0;
    var oldLimitImpulse = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var c1 = bA.m_sweep.c;
    var a1 = bA.m_sweep.a;
    var c2 = bB.m_sweep.c;
    var a2 = bB.m_sweep.a;
    var tMat;
    var tX = 0;
    var m1 = 0;
    var m2 = 0;
    var i1 = 0;
    var i2 = 0;
    var linearError = 0;
    var angularError = 0;
    var active = false;
    var C2 = 0;
    var R1 = b2Mat22.FromAngle(a1);
    var R2 = b2Mat22.FromAngle(a2);
    tMat = R1;
    var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
    var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
    tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = R2;
    var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
    var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var dX = c2.x + r2X - c1.x - r1X;
    var dY = c2.y + r2Y - c1.y - r1Y;
    if (this.m_enableLimit) {
      this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
      this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
      this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
      var translation = this.m_axis.x * dX + this.m_axis.y * dY;
      if (
        b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) <
        2 * b2Settings.b2_linearSlop
      ) {
        C2 = b2Math.Clamp(
          translation,
          -b2Settings.b2_maxLinearCorrection,
          b2Settings.b2_maxLinearCorrection
        );
        linearError = b2Math.Abs(translation);
        active = true;
      } else if (translation <= this.m_lowerTranslation) {
        C2 = b2Math.Clamp(
          translation - this.m_lowerTranslation + b2Settings.b2_linearSlop,
          -b2Settings.b2_maxLinearCorrection,
          0
        );
        linearError = this.m_lowerTranslation - translation;
        active = true;
      } else if (translation >= this.m_upperTranslation) {
        C2 = b2Math.Clamp(
          translation - this.m_upperTranslation + b2Settings.b2_linearSlop,
          0,
          b2Settings.b2_maxLinearCorrection
        );
        linearError = translation - this.m_upperTranslation;
        active = true;
      }
    }
    this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
    this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
    this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
    var impulse = new b2Vec2();
    var C1 = this.m_perp.x * dX + this.m_perp.y * dY;
    linearError = b2Math.Max(linearError, b2Math.Abs(C1));
    angularError = 0;
    if (active) {
      m1 = this.m_invMassA;
      m2 = this.m_invMassB;
      i1 = this.m_invIA;
      i2 = this.m_invIB;
      this.m_K.col1.x =
        m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
      this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
      this.m_K.col2.x = this.m_K.col1.y;
      this.m_K.col2.y =
        m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      this.m_K.Solve(impulse, -C1, -C2);
    } else {
      m1 = this.m_invMassA;
      m2 = this.m_invMassB;
      i1 = this.m_invIA;
      i2 = this.m_invIB;
      var k11 =
        m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
      var impulse1 = 0;
      if (k11 != 0) impulse1 = -C1 / k11;
      else impulse1 = 0;
      impulse.x = impulse1;
      impulse.y = 0;
    }
    var PX = impulse.x * this.m_perp.x + impulse.y * this.m_axis.x;
    var PY = impulse.x * this.m_perp.y + impulse.y * this.m_axis.y;
    var L1 = impulse.x * this.m_s1 + impulse.y * this.m_a1;
    var L2 = impulse.x * this.m_s2 + impulse.y * this.m_a2;
    c1.x -= this.m_invMassA * PX;
    c1.y -= this.m_invMassA * PY;
    a1 -= this.m_invIA * L1;
    c2.x += this.m_invMassB * PX;
    c2.y += this.m_invMassB * PY;
    a2 += this.m_invIB * L2;
    bA.m_sweep.a = a1;
    bB.m_sweep.a = a2;
    bA.SynchronizeTransform();
    bB.SynchronizeTransform();
    return (
      linearError <= b2Settings.b2_linearSlop &&
      angularError <= b2Settings.b2_angularSlop
    );
  };
  Box2D.inherit(b2LineJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2LineJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2LineJointDef.b2LineJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
    this.localAxisA = new b2Vec2();
  };
  b2LineJointDef.prototype.b2LineJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_lineJoint;
    this.localAxisA.Set(1, 0);
    this.enableLimit = false;
    this.lowerTranslation = 0;
    this.upperTranslation = 0;
    this.enableMotor = false;
    this.maxMotorForce = 0;
    this.motorSpeed = 0;
  };
  b2LineJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
    this.bodyA = bA;
    this.bodyB = bB;
    this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
    this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
    this.localAxisA = this.bodyA.GetLocalVector(axis);
  };
  Box2D.inherit(b2MouseJoint, Box2D.Dynamics.Joints.b2Joint);
  b2MouseJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2MouseJoint.b2MouseJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.K = new b2Mat22();
    this.K1 = new b2Mat22();
    this.K2 = new b2Mat22();
    this.m_localAnchor = new b2Vec2();
    this.m_target = new b2Vec2();
    this.m_impulse = new b2Vec2();
    this.m_mass = new b2Mat22();
    this.m_C = new b2Vec2();
  };
  b2MouseJoint.prototype.GetAnchorA = function () {
    return this.m_target;
  };
  b2MouseJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchor);
  };
  b2MouseJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
  };
  b2MouseJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return 0;
  };
  b2MouseJoint.prototype.GetTarget = function () {
    return this.m_target;
  };
  b2MouseJoint.prototype.SetTarget = function (target) {
    if (this.m_bodyB.IsAwake() == false) this.m_bodyB.SetAwake(true);
    this.m_target = target;
  };
  b2MouseJoint.prototype.GetMaxForce = function () {
    return this.m_maxForce;
  };
  b2MouseJoint.prototype.SetMaxForce = function (maxForce) {
    if (maxForce === undefined) maxForce = 0;
    this.m_maxForce = maxForce;
  };
  b2MouseJoint.prototype.GetFrequency = function () {
    return this.m_frequencyHz;
  };
  b2MouseJoint.prototype.SetFrequency = function (hz) {
    if (hz === undefined) hz = 0;
    this.m_frequencyHz = hz;
  };
  b2MouseJoint.prototype.GetDampingRatio = function () {
    return this.m_dampingRatio;
  };
  b2MouseJoint.prototype.SetDampingRatio = function (ratio) {
    if (ratio === undefined) ratio = 0;
    this.m_dampingRatio = ratio;
  };
  b2MouseJoint.prototype.b2MouseJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    this.m_target.SetV(def.target);
    var tX = this.m_target.x - this.m_bodyB.m_xf.position.x;
    var tY = this.m_target.y - this.m_bodyB.m_xf.position.y;
    var tMat = this.m_bodyB.m_xf.R;
    this.m_localAnchor.x = tX * tMat.col1.x + tY * tMat.col1.y;
    this.m_localAnchor.y = tX * tMat.col2.x + tY * tMat.col2.y;
    this.m_maxForce = def.maxForce;
    this.m_impulse.SetZero();
    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;
    this.m_beta = 0;
    this.m_gamma = 0;
  };
  b2MouseJoint.prototype.InitVelocityConstraints = function (step) {
    var b = this.m_bodyB;
    var mass = b.GetMass();
    var omega = 2 * Math.PI * this.m_frequencyHz;
    var d = 2 * mass * this.m_dampingRatio * omega;
    var k = mass * omega * omega;
    this.m_gamma = step.dt * (d + step.dt * k);
    this.m_gamma = this.m_gamma != 0 ? 1 / this.m_gamma : 0;
    this.m_beta = step.dt * k * this.m_gamma;
    var tMat;
    tMat = b.m_xf.R;
    var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
    var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
    var tX = tMat.col1.x * rX + tMat.col2.x * rY;
    rY = tMat.col1.y * rX + tMat.col2.y * rY;
    rX = tX;
    var invMass = b.m_invMass;
    var invI = b.m_invI;
    this.K1.col1.x = invMass;
    this.K1.col2.x = 0;
    this.K1.col1.y = 0;
    this.K1.col2.y = invMass;
    this.K2.col1.x = invI * rY * rY;
    this.K2.col2.x = -invI * rX * rY;
    this.K2.col1.y = -invI * rX * rY;
    this.K2.col2.y = invI * rX * rX;
    this.K.SetM(this.K1);
    this.K.AddM(this.K2);
    this.K.col1.x += this.m_gamma;
    this.K.col2.y += this.m_gamma;
    this.K.GetInverse(this.m_mass);
    this.m_C.x = b.m_sweep.c.x + rX - this.m_target.x;
    this.m_C.y = b.m_sweep.c.y + rY - this.m_target.y;
    b.m_angularVelocity *= 0.98;
    this.m_impulse.x *= step.dtRatio;
    this.m_impulse.y *= step.dtRatio;
    b.m_linearVelocity.x += invMass * this.m_impulse.x;
    b.m_linearVelocity.y += invMass * this.m_impulse.y;
    b.m_angularVelocity +=
      invI * (rX * this.m_impulse.y - rY * this.m_impulse.x);
  };
  b2MouseJoint.prototype.SolveVelocityConstraints = function (step) {
    var b = this.m_bodyB;
    var tMat;
    var tX = 0;
    var tY = 0;
    tMat = b.m_xf.R;
    var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
    var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
    tX = tMat.col1.x * rX + tMat.col2.x * rY;
    rY = tMat.col1.y * rX + tMat.col2.y * rY;
    rX = tX;
    var CdotX = b.m_linearVelocity.x + -b.m_angularVelocity * rY;
    var CdotY = b.m_linearVelocity.y + b.m_angularVelocity * rX;
    tMat = this.m_mass;
    tX = CdotX + this.m_beta * this.m_C.x + this.m_gamma * this.m_impulse.x;
    tY = CdotY + this.m_beta * this.m_C.y + this.m_gamma * this.m_impulse.y;
    var impulseX = -(tMat.col1.x * tX + tMat.col2.x * tY);
    var impulseY = -(tMat.col1.y * tX + tMat.col2.y * tY);
    var oldImpulseX = this.m_impulse.x;
    var oldImpulseY = this.m_impulse.y;
    this.m_impulse.x += impulseX;
    this.m_impulse.y += impulseY;
    var maxImpulse = step.dt * this.m_maxForce;
    if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse)
      this.m_impulse.Multiply(maxImpulse / this.m_impulse.Length());
    impulseX = this.m_impulse.x - oldImpulseX;
    impulseY = this.m_impulse.y - oldImpulseY;
    b.m_linearVelocity.x += b.m_invMass * impulseX;
    b.m_linearVelocity.y += b.m_invMass * impulseY;
    b.m_angularVelocity += b.m_invI * (rX * impulseY - rY * impulseX);
  };
  b2MouseJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    return true;
  };
  Box2D.inherit(b2MouseJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2MouseJointDef.prototype.__super =
    Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2MouseJointDef.b2MouseJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
    this.target = new b2Vec2();
  };
  b2MouseJointDef.prototype.b2MouseJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_mouseJoint;
    this.maxForce = 0;
    this.frequencyHz = 5;
    this.dampingRatio = 0.7;
  };
  Box2D.inherit(b2PrismaticJoint, Box2D.Dynamics.Joints.b2Joint);
  b2PrismaticJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2PrismaticJoint.b2PrismaticJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.m_localAnchor1 = new b2Vec2();
    this.m_localAnchor2 = new b2Vec2();
    this.m_localXAxis1 = new b2Vec2();
    this.m_localYAxis1 = new b2Vec2();
    this.m_axis = new b2Vec2();
    this.m_perp = new b2Vec2();
    this.m_K = new b2Mat33();
    this.m_impulse = new b2Vec3();
  };
  b2PrismaticJoint.prototype.GetAnchorA = function () {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
  };
  b2PrismaticJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
  };
  b2PrismaticJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(
      inv_dt *
        (this.m_impulse.x * this.m_perp.x +
          (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x),
      inv_dt *
        (this.m_impulse.x * this.m_perp.y +
          (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y)
    );
  };
  b2PrismaticJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return inv_dt * this.m_impulse.y;
  };
  b2PrismaticJoint.prototype.GetJointTranslation = function () {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    var p1 = bA.GetWorldPoint(this.m_localAnchor1);
    var p2 = bB.GetWorldPoint(this.m_localAnchor2);
    var dX = p2.x - p1.x;
    var dY = p2.y - p1.y;
    var axis = bA.GetWorldVector(this.m_localXAxis1);
    var translation = axis.x * dX + axis.y * dY;
    return translation;
  };
  b2PrismaticJoint.prototype.GetJointSpeed = function () {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    var tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var p1X = bA.m_sweep.c.x + r1X;
    var p1Y = bA.m_sweep.c.y + r1Y;
    var p2X = bB.m_sweep.c.x + r2X;
    var p2Y = bB.m_sweep.c.y + r2Y;
    var dX = p2X - p1X;
    var dY = p2Y - p1Y;
    var axis = bA.GetWorldVector(this.m_localXAxis1);
    var v1 = bA.m_linearVelocity;
    var v2 = bB.m_linearVelocity;
    var w1 = bA.m_angularVelocity;
    var w2 = bB.m_angularVelocity;
    var speed =
      dX * (-w1 * axis.y) +
      dY * (w1 * axis.x) +
      (axis.x * (v2.x + -w2 * r2Y - v1.x - -w1 * r1Y) +
        axis.y * (v2.y + w2 * r2X - v1.y - w1 * r1X));
    return speed;
  };
  b2PrismaticJoint.prototype.IsLimitEnabled = function () {
    return this.m_enableLimit;
  };
  b2PrismaticJoint.prototype.EnableLimit = function (flag) {
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_enableLimit = flag;
  };
  b2PrismaticJoint.prototype.GetLowerLimit = function () {
    return this.m_lowerTranslation;
  };
  b2PrismaticJoint.prototype.GetUpperLimit = function () {
    return this.m_upperTranslation;
  };
  b2PrismaticJoint.prototype.SetLimits = function (lower, upper) {
    if (lower === undefined) lower = 0;
    if (upper === undefined) upper = 0;
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_lowerTranslation = lower;
    this.m_upperTranslation = upper;
  };
  b2PrismaticJoint.prototype.IsMotorEnabled = function () {
    return this.m_enableMotor;
  };
  b2PrismaticJoint.prototype.EnableMotor = function (flag) {
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_enableMotor = flag;
  };
  b2PrismaticJoint.prototype.SetMotorSpeed = function (speed) {
    if (speed === undefined) speed = 0;
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_motorSpeed = speed;
  };
  b2PrismaticJoint.prototype.GetMotorSpeed = function () {
    return this.m_motorSpeed;
  };
  b2PrismaticJoint.prototype.SetMaxMotorForce = function (force) {
    if (force === undefined) force = 0;
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_maxMotorForce = force;
  };
  b2PrismaticJoint.prototype.GetMotorForce = function () {
    return this.m_motorImpulse;
  };
  b2PrismaticJoint.prototype.b2PrismaticJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    var tMat;
    var tX = 0;
    var tY = 0;
    this.m_localAnchor1.SetV(def.localAnchorA);
    this.m_localAnchor2.SetV(def.localAnchorB);
    this.m_localXAxis1.SetV(def.localAxisA);
    this.m_localYAxis1.x = -this.m_localXAxis1.y;
    this.m_localYAxis1.y = this.m_localXAxis1.x;
    this.m_refAngle = def.referenceAngle;
    this.m_impulse.SetZero();
    this.m_motorMass = 0;
    this.m_motorImpulse = 0;
    this.m_lowerTranslation = def.lowerTranslation;
    this.m_upperTranslation = def.upperTranslation;
    this.m_maxMotorForce = def.maxMotorForce;
    this.m_motorSpeed = def.motorSpeed;
    this.m_enableLimit = def.enableLimit;
    this.m_enableMotor = def.enableMotor;
    this.m_limitState = b2Joint.e_inactiveLimit;
    this.m_axis.SetZero();
    this.m_perp.SetZero();
  };
  b2PrismaticJoint.prototype.InitVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    var tX = 0;
    this.m_localCenterA.SetV(bA.GetLocalCenter());
    this.m_localCenterB.SetV(bB.GetLocalCenter());
    var xf1 = bA.GetTransform();
    var xf2 = bB.GetTransform();
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
    var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
    tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
    var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
    var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
    this.m_invMassA = bA.m_invMass;
    this.m_invMassB = bB.m_invMass;
    this.m_invIA = bA.m_invI;
    this.m_invIB = bB.m_invI;
    this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
    this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
    this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
    this.m_motorMass =
      this.m_invMassA +
      this.m_invMassB +
      this.m_invIA * this.m_a1 * this.m_a1 +
      this.m_invIB * this.m_a2 * this.m_a2;
    if (this.m_motorMass > Number.MIN_VALUE)
      this.m_motorMass = 1 / this.m_motorMass;
    this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
    this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
    this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
    var m1 = this.m_invMassA;
    var m2 = this.m_invMassB;
    var i1 = this.m_invIA;
    var i2 = this.m_invIB;
    this.m_K.col1.x =
      m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
    this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
    this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
    this.m_K.col2.x = this.m_K.col1.y;
    this.m_K.col2.y = i1 + i2;
    this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
    this.m_K.col3.x = this.m_K.col1.z;
    this.m_K.col3.y = this.m_K.col2.z;
    this.m_K.col3.z =
      m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
    if (this.m_enableLimit) {
      var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
      if (
        b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) <
        2 * b2Settings.b2_linearSlop
      )
        this.m_limitState = b2Joint.e_equalLimits;
      else if (jointTransition <= this.m_lowerTranslation) {
        if (this.m_limitState != b2Joint.e_atLowerLimit) {
          this.m_limitState = b2Joint.e_atLowerLimit;
          this.m_impulse.z = 0;
        }
      } else if (jointTransition >= this.m_upperTranslation) {
        if (this.m_limitState != b2Joint.e_atUpperLimit) {
          this.m_limitState = b2Joint.e_atUpperLimit;
          this.m_impulse.z = 0;
        }
      } else {
        this.m_limitState = b2Joint.e_inactiveLimit;
        this.m_impulse.z = 0;
      }
    } else this.m_limitState = b2Joint.e_inactiveLimit;
    if (this.m_enableMotor == false) this.m_motorImpulse = 0;
    if (step.warmStarting) {
      this.m_impulse.x *= step.dtRatio;
      this.m_impulse.y *= step.dtRatio;
      this.m_motorImpulse *= step.dtRatio;
      var PX =
        this.m_impulse.x * this.m_perp.x +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x;
      var PY =
        this.m_impulse.x * this.m_perp.y +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y;
      var L1 =
        this.m_impulse.x * this.m_s1 +
        this.m_impulse.y +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
      var L2 =
        this.m_impulse.x * this.m_s2 +
        this.m_impulse.y +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
      bA.m_linearVelocity.x -= this.m_invMassA * PX;
      bA.m_linearVelocity.y -= this.m_invMassA * PY;
      bA.m_angularVelocity -= this.m_invIA * L1;
      bB.m_linearVelocity.x += this.m_invMassB * PX;
      bB.m_linearVelocity.y += this.m_invMassB * PY;
      bB.m_angularVelocity += this.m_invIB * L2;
    } else {
      this.m_impulse.SetZero();
      this.m_motorImpulse = 0;
    }
  };
  b2PrismaticJoint.prototype.SolveVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var v1 = bA.m_linearVelocity;
    var w1 = bA.m_angularVelocity;
    var v2 = bB.m_linearVelocity;
    var w2 = bB.m_angularVelocity;
    var PX = 0;
    var PY = 0;
    var L1 = 0;
    var L2 = 0;
    if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
      var Cdot =
        this.m_axis.x * (v2.x - v1.x) +
        this.m_axis.y * (v2.y - v1.y) +
        this.m_a2 * w2 -
        this.m_a1 * w1;
      var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
      var oldImpulse = this.m_motorImpulse;
      var maxImpulse = step.dt * this.m_maxMotorForce;
      this.m_motorImpulse = b2Math.Clamp(
        this.m_motorImpulse + impulse,
        -maxImpulse,
        maxImpulse
      );
      impulse = this.m_motorImpulse - oldImpulse;
      PX = impulse * this.m_axis.x;
      PY = impulse * this.m_axis.y;
      L1 = impulse * this.m_a1;
      L2 = impulse * this.m_a2;
      v1.x -= this.m_invMassA * PX;
      v1.y -= this.m_invMassA * PY;
      w1 -= this.m_invIA * L1;
      v2.x += this.m_invMassB * PX;
      v2.y += this.m_invMassB * PY;
      w2 += this.m_invIB * L2;
    }
    var Cdot1X =
      this.m_perp.x * (v2.x - v1.x) +
      this.m_perp.y * (v2.y - v1.y) +
      this.m_s2 * w2 -
      this.m_s1 * w1;
    var Cdot1Y = w2 - w1;
    if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
      var Cdot2 =
        this.m_axis.x * (v2.x - v1.x) +
        this.m_axis.y * (v2.y - v1.y) +
        this.m_a2 * w2 -
        this.m_a1 * w1;
      var f1 = this.m_impulse.Copy();
      var df = this.m_K.Solve33(new b2Vec3(), -Cdot1X, -Cdot1Y, -Cdot2);
      this.m_impulse.Add(df);
      if (this.m_limitState == b2Joint.e_atLowerLimit)
        this.m_impulse.z = b2Math.Max(this.m_impulse.z, 0);
      else if (this.m_limitState == b2Joint.e_atUpperLimit)
        this.m_impulse.z = b2Math.Min(this.m_impulse.z, 0);
      var bX = -Cdot1X - (this.m_impulse.z - f1.z) * this.m_K.col3.x;
      var bY = -Cdot1Y - (this.m_impulse.z - f1.z) * this.m_K.col3.y;
      var f2r = this.m_K.Solve22(new b2Vec2(), bX, bY);
      f2r.x += f1.x;
      f2r.y += f1.y;
      this.m_impulse.x = f2r.x;
      this.m_impulse.y = f2r.y;
      df.x = this.m_impulse.x - f1.x;
      df.y = this.m_impulse.y - f1.y;
      df.z = this.m_impulse.z - f1.z;
      PX = df.x * this.m_perp.x + df.z * this.m_axis.x;
      PY = df.x * this.m_perp.y + df.z * this.m_axis.y;
      L1 = df.x * this.m_s1 + df.y + df.z * this.m_a1;
      L2 = df.x * this.m_s2 + df.y + df.z * this.m_a2;
      v1.x -= this.m_invMassA * PX;
      v1.y -= this.m_invMassA * PY;
      w1 -= this.m_invIA * L1;
      v2.x += this.m_invMassB * PX;
      v2.y += this.m_invMassB * PY;
      w2 += this.m_invIB * L2;
    } else {
      var df2 = this.m_K.Solve22(new b2Vec2(), -Cdot1X, -Cdot1Y);
      this.m_impulse.x += df2.x;
      this.m_impulse.y += df2.y;
      PX = df2.x * this.m_perp.x;
      PY = df2.x * this.m_perp.y;
      L1 = df2.x * this.m_s1 + df2.y;
      L2 = df2.x * this.m_s2 + df2.y;
      v1.x -= this.m_invMassA * PX;
      v1.y -= this.m_invMassA * PY;
      w1 -= this.m_invIA * L1;
      v2.x += this.m_invMassB * PX;
      v2.y += this.m_invMassB * PY;
      w2 += this.m_invIB * L2;
    }
    bA.m_linearVelocity.SetV(v1);
    bA.m_angularVelocity = w1;
    bB.m_linearVelocity.SetV(v2);
    bB.m_angularVelocity = w2;
  };
  b2PrismaticJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    var limitC = 0;
    var oldLimitImpulse = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var c1 = bA.m_sweep.c;
    var a1 = bA.m_sweep.a;
    var c2 = bB.m_sweep.c;
    var a2 = bB.m_sweep.a;
    var tMat;
    var tX = 0;
    var m1 = 0;
    var m2 = 0;
    var i1 = 0;
    var i2 = 0;
    var linearError = 0;
    var angularError = 0;
    var active = false;
    var C2 = 0;
    var R1 = b2Mat22.FromAngle(a1);
    var R2 = b2Mat22.FromAngle(a2);
    tMat = R1;
    var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
    var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
    tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = R2;
    var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
    var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var dX = c2.x + r2X - c1.x - r1X;
    var dY = c2.y + r2Y - c1.y - r1Y;
    if (this.m_enableLimit) {
      this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
      this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
      this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
      var translation = this.m_axis.x * dX + this.m_axis.y * dY;
      if (
        b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) <
        2 * b2Settings.b2_linearSlop
      ) {
        C2 = b2Math.Clamp(
          translation,
          -b2Settings.b2_maxLinearCorrection,
          b2Settings.b2_maxLinearCorrection
        );
        linearError = b2Math.Abs(translation);
        active = true;
      } else if (translation <= this.m_lowerTranslation) {
        C2 = b2Math.Clamp(
          translation - this.m_lowerTranslation + b2Settings.b2_linearSlop,
          -b2Settings.b2_maxLinearCorrection,
          0
        );
        linearError = this.m_lowerTranslation - translation;
        active = true;
      } else if (translation >= this.m_upperTranslation) {
        C2 = b2Math.Clamp(
          translation - this.m_upperTranslation + b2Settings.b2_linearSlop,
          0,
          b2Settings.b2_maxLinearCorrection
        );
        linearError = translation - this.m_upperTranslation;
        active = true;
      }
    }
    this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
    this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
    this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
    var impulse = new b2Vec3();
    var C1X = this.m_perp.x * dX + this.m_perp.y * dY;
    var C1Y = a2 - a1 - this.m_refAngle;
    linearError = b2Math.Max(linearError, b2Math.Abs(C1X));
    angularError = b2Math.Abs(C1Y);
    if (active) {
      m1 = this.m_invMassA;
      m2 = this.m_invMassB;
      i1 = this.m_invIA;
      i2 = this.m_invIB;
      this.m_K.col1.x =
        m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
      this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
      this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
      this.m_K.col2.x = this.m_K.col1.y;
      this.m_K.col2.y = i1 + i2;
      this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
      this.m_K.col3.x = this.m_K.col1.z;
      this.m_K.col3.y = this.m_K.col2.z;
      this.m_K.col3.z =
        m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      this.m_K.Solve33(impulse, -C1X, -C1Y, -C2);
    } else {
      m1 = this.m_invMassA;
      m2 = this.m_invMassB;
      i1 = this.m_invIA;
      i2 = this.m_invIB;
      var k11 =
        m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
      var k12 = i1 * this.m_s1 + i2 * this.m_s2;
      var k22 = i1 + i2;
      this.m_K.col1.Set(k11, k12, 0);
      this.m_K.col2.Set(k12, k22, 0);
      var impulse1 = this.m_K.Solve22(new b2Vec2(), -C1X, -C1Y);
      impulse.x = impulse1.x;
      impulse.y = impulse1.y;
      impulse.z = 0;
    }
    var PX = impulse.x * this.m_perp.x + impulse.z * this.m_axis.x;
    var PY = impulse.x * this.m_perp.y + impulse.z * this.m_axis.y;
    var L1 = impulse.x * this.m_s1 + impulse.y + impulse.z * this.m_a1;
    var L2 = impulse.x * this.m_s2 + impulse.y + impulse.z * this.m_a2;
    c1.x -= this.m_invMassA * PX;
    c1.y -= this.m_invMassA * PY;
    a1 -= this.m_invIA * L1;
    c2.x += this.m_invMassB * PX;
    c2.y += this.m_invMassB * PY;
    a2 += this.m_invIB * L2;
    bA.m_sweep.a = a1;
    bB.m_sweep.a = a2;
    bA.SynchronizeTransform();
    bB.SynchronizeTransform();
    return (
      linearError <= b2Settings.b2_linearSlop &&
      angularError <= b2Settings.b2_angularSlop
    );
  };
  Box2D.inherit(b2PrismaticJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2PrismaticJointDef.prototype.__super =
    Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2PrismaticJointDef.b2PrismaticJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
    this.localAxisA = new b2Vec2();
  };
  b2PrismaticJointDef.prototype.b2PrismaticJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_prismaticJoint;
    this.localAxisA.Set(1, 0);
    this.referenceAngle = 0;
    this.enableLimit = false;
    this.lowerTranslation = 0;
    this.upperTranslation = 0;
    this.enableMotor = false;
    this.maxMotorForce = 0;
    this.motorSpeed = 0;
  };
  b2PrismaticJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
    this.bodyA = bA;
    this.bodyB = bB;
    this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
    this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
    this.localAxisA = this.bodyA.GetLocalVector(axis);
    this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
  };
  Box2D.inherit(b2PulleyJoint, Box2D.Dynamics.Joints.b2Joint);
  b2PulleyJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2PulleyJoint.b2PulleyJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.m_groundAnchor1 = new b2Vec2();
    this.m_groundAnchor2 = new b2Vec2();
    this.m_localAnchor1 = new b2Vec2();
    this.m_localAnchor2 = new b2Vec2();
    this.m_u1 = new b2Vec2();
    this.m_u2 = new b2Vec2();
  };
  b2PulleyJoint.prototype.GetAnchorA = function () {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
  };
  b2PulleyJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
  };
  b2PulleyJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(
      inv_dt * this.m_impulse * this.m_u2.x,
      inv_dt * this.m_impulse * this.m_u2.y
    );
  };
  b2PulleyJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return 0;
  };
  b2PulleyJoint.prototype.GetGroundAnchorA = function () {
    var a = this.m_ground.m_xf.position.Copy();
    a.Add(this.m_groundAnchor1);
    return a;
  };
  b2PulleyJoint.prototype.GetGroundAnchorB = function () {
    var a = this.m_ground.m_xf.position.Copy();
    a.Add(this.m_groundAnchor2);
    return a;
  };
  b2PulleyJoint.prototype.GetLength1 = function () {
    var p = this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
    var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
    var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
    var dX = p.x - sX;
    var dY = p.y - sY;
    return Math.sqrt(dX * dX + dY * dY);
  };
  b2PulleyJoint.prototype.GetLength2 = function () {
    var p = this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
    var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
    var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
    var dX = p.x - sX;
    var dY = p.y - sY;
    return Math.sqrt(dX * dX + dY * dY);
  };
  b2PulleyJoint.prototype.GetRatio = function () {
    return this.m_ratio;
  };
  b2PulleyJoint.prototype.b2PulleyJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    var tMat;
    var tX = 0;
    var tY = 0;
    this.m_ground = this.m_bodyA.m_world.m_groundBody;
    this.m_groundAnchor1.x =
      def.groundAnchorA.x - this.m_ground.m_xf.position.x;
    this.m_groundAnchor1.y =
      def.groundAnchorA.y - this.m_ground.m_xf.position.y;
    this.m_groundAnchor2.x =
      def.groundAnchorB.x - this.m_ground.m_xf.position.x;
    this.m_groundAnchor2.y =
      def.groundAnchorB.y - this.m_ground.m_xf.position.y;
    this.m_localAnchor1.SetV(def.localAnchorA);
    this.m_localAnchor2.SetV(def.localAnchorB);
    this.m_ratio = def.ratio;
    this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
    this.m_maxLength1 = b2Math.Min(
      def.maxLengthA,
      this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength
    );
    this.m_maxLength2 = b2Math.Min(
      def.maxLengthB,
      (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio
    );
    this.m_impulse = 0;
    this.m_limitImpulse1 = 0;
    this.m_limitImpulse2 = 0;
  };
  b2PulleyJoint.prototype.InitVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    var tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var p1X = bA.m_sweep.c.x + r1X;
    var p1Y = bA.m_sweep.c.y + r1Y;
    var p2X = bB.m_sweep.c.x + r2X;
    var p2Y = bB.m_sweep.c.y + r2Y;
    var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
    var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
    var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
    var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
    this.m_u1.Set(p1X - s1X, p1Y - s1Y);
    this.m_u2.Set(p2X - s2X, p2Y - s2Y);
    var length1 = this.m_u1.Length();
    var length2 = this.m_u2.Length();
    if (length1 > b2Settings.b2_linearSlop) this.m_u1.Multiply(1 / length1);
    else this.m_u1.SetZero();
    if (length2 > b2Settings.b2_linearSlop) this.m_u2.Multiply(1 / length2);
    else this.m_u2.SetZero();
    var C = this.m_constant - length1 - this.m_ratio * length2;
    if (C > 0) {
      this.m_state = b2Joint.e_inactiveLimit;
      this.m_impulse = 0;
    } else this.m_state = b2Joint.e_atUpperLimit;
    if (length1 < this.m_maxLength1) {
      this.m_limitState1 = b2Joint.e_inactiveLimit;
      this.m_limitImpulse1 = 0;
    } else this.m_limitState1 = b2Joint.e_atUpperLimit;
    if (length2 < this.m_maxLength2) {
      this.m_limitState2 = b2Joint.e_inactiveLimit;
      this.m_limitImpulse2 = 0;
    } else this.m_limitState2 = b2Joint.e_atUpperLimit;
    var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
    var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
    this.m_limitMass1 = bA.m_invMass + bA.m_invI * cr1u1 * cr1u1;
    this.m_limitMass2 = bB.m_invMass + bB.m_invI * cr2u2 * cr2u2;
    this.m_pulleyMass =
      this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
    this.m_limitMass1 = 1 / this.m_limitMass1;
    this.m_limitMass2 = 1 / this.m_limitMass2;
    this.m_pulleyMass = 1 / this.m_pulleyMass;
    if (step.warmStarting) {
      this.m_impulse *= step.dtRatio;
      this.m_limitImpulse1 *= step.dtRatio;
      this.m_limitImpulse2 *= step.dtRatio;
      var P1X = (-this.m_impulse - this.m_limitImpulse1) * this.m_u1.x;
      var P1Y = (-this.m_impulse - this.m_limitImpulse1) * this.m_u1.y;
      var P2X =
        (-this.m_ratio * this.m_impulse - this.m_limitImpulse2) * this.m_u2.x;
      var P2Y =
        (-this.m_ratio * this.m_impulse - this.m_limitImpulse2) * this.m_u2.y;
      bA.m_linearVelocity.x += bA.m_invMass * P1X;
      bA.m_linearVelocity.y += bA.m_invMass * P1Y;
      bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
      bB.m_linearVelocity.x += bB.m_invMass * P2X;
      bB.m_linearVelocity.y += bB.m_invMass * P2Y;
      bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
    } else {
      this.m_impulse = 0;
      this.m_limitImpulse1 = 0;
      this.m_limitImpulse2 = 0;
    }
  };
  b2PulleyJoint.prototype.SolveVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    var tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var v1X = 0;
    var v1Y = 0;
    var v2X = 0;
    var v2Y = 0;
    var P1X = 0;
    var P1Y = 0;
    var P2X = 0;
    var P2Y = 0;
    var Cdot = 0;
    var impulse = 0;
    var oldImpulse = 0;
    if (this.m_state == b2Joint.e_atUpperLimit) {
      v1X = bA.m_linearVelocity.x + -bA.m_angularVelocity * r1Y;
      v1Y = bA.m_linearVelocity.y + bA.m_angularVelocity * r1X;
      v2X = bB.m_linearVelocity.x + -bB.m_angularVelocity * r2Y;
      v2Y = bB.m_linearVelocity.y + bB.m_angularVelocity * r2X;
      Cdot =
        -(this.m_u1.x * v1X + this.m_u1.y * v1Y) -
        this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
      impulse = this.m_pulleyMass * -Cdot;
      oldImpulse = this.m_impulse;
      this.m_impulse = b2Math.Max(0, this.m_impulse + impulse);
      impulse = this.m_impulse - oldImpulse;
      P1X = -impulse * this.m_u1.x;
      P1Y = -impulse * this.m_u1.y;
      P2X = -this.m_ratio * impulse * this.m_u2.x;
      P2Y = -this.m_ratio * impulse * this.m_u2.y;
      bA.m_linearVelocity.x += bA.m_invMass * P1X;
      bA.m_linearVelocity.y += bA.m_invMass * P1Y;
      bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
      bB.m_linearVelocity.x += bB.m_invMass * P2X;
      bB.m_linearVelocity.y += bB.m_invMass * P2Y;
      bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
    }
    if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
      v1X = bA.m_linearVelocity.x + -bA.m_angularVelocity * r1Y;
      v1Y = bA.m_linearVelocity.y + bA.m_angularVelocity * r1X;
      Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y);
      impulse = -this.m_limitMass1 * Cdot;
      oldImpulse = this.m_limitImpulse1;
      this.m_limitImpulse1 = b2Math.Max(0, this.m_limitImpulse1 + impulse);
      impulse = this.m_limitImpulse1 - oldImpulse;
      P1X = -impulse * this.m_u1.x;
      P1Y = -impulse * this.m_u1.y;
      bA.m_linearVelocity.x += bA.m_invMass * P1X;
      bA.m_linearVelocity.y += bA.m_invMass * P1Y;
      bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
    }
    if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
      v2X = bB.m_linearVelocity.x + -bB.m_angularVelocity * r2Y;
      v2Y = bB.m_linearVelocity.y + bB.m_angularVelocity * r2X;
      Cdot = -(this.m_u2.x * v2X + this.m_u2.y * v2Y);
      impulse = -this.m_limitMass2 * Cdot;
      oldImpulse = this.m_limitImpulse2;
      this.m_limitImpulse2 = b2Math.Max(0, this.m_limitImpulse2 + impulse);
      impulse = this.m_limitImpulse2 - oldImpulse;
      P2X = -impulse * this.m_u2.x;
      P2Y = -impulse * this.m_u2.y;
      bB.m_linearVelocity.x += bB.m_invMass * P2X;
      bB.m_linearVelocity.y += bB.m_invMass * P2Y;
      bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
    }
  };
  b2PulleyJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
    var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
    var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
    var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
    var r1X = 0;
    var r1Y = 0;
    var r2X = 0;
    var r2Y = 0;
    var p1X = 0;
    var p1Y = 0;
    var p2X = 0;
    var p2Y = 0;
    var length1 = 0;
    var length2 = 0;
    var C = 0;
    var impulse = 0;
    var oldImpulse = 0;
    var oldLimitPositionImpulse = 0;
    var tX = 0;
    var linearError = 0;
    if (this.m_state == b2Joint.e_atUpperLimit) {
      tMat = bA.m_xf.R;
      r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
      r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
      r1X = tX;
      tMat = bB.m_xf.R;
      r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
      r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
      r2X = tX;
      p1X = bA.m_sweep.c.x + r1X;
      p1Y = bA.m_sweep.c.y + r1Y;
      p2X = bB.m_sweep.c.x + r2X;
      p2Y = bB.m_sweep.c.y + r2Y;
      this.m_u1.Set(p1X - s1X, p1Y - s1Y);
      this.m_u2.Set(p2X - s2X, p2Y - s2Y);
      length1 = this.m_u1.Length();
      length2 = this.m_u2.Length();
      if (length1 > b2Settings.b2_linearSlop) this.m_u1.Multiply(1 / length1);
      else this.m_u1.SetZero();
      if (length2 > b2Settings.b2_linearSlop) this.m_u2.Multiply(1 / length2);
      else this.m_u2.SetZero();
      C = this.m_constant - length1 - this.m_ratio * length2;
      linearError = b2Math.Max(linearError, -C);
      C = b2Math.Clamp(
        C + b2Settings.b2_linearSlop,
        -b2Settings.b2_maxLinearCorrection,
        0
      );
      impulse = -this.m_pulleyMass * C;
      p1X = -impulse * this.m_u1.x;
      p1Y = -impulse * this.m_u1.y;
      p2X = -this.m_ratio * impulse * this.m_u2.x;
      p2Y = -this.m_ratio * impulse * this.m_u2.y;
      bA.m_sweep.c.x += bA.m_invMass * p1X;
      bA.m_sweep.c.y += bA.m_invMass * p1Y;
      bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
      bB.m_sweep.c.x += bB.m_invMass * p2X;
      bB.m_sweep.c.y += bB.m_invMass * p2Y;
      bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
    }
    if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
      tMat = bA.m_xf.R;
      r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
      r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
      r1X = tX;
      p1X = bA.m_sweep.c.x + r1X;
      p1Y = bA.m_sweep.c.y + r1Y;
      this.m_u1.Set(p1X - s1X, p1Y - s1Y);
      length1 = this.m_u1.Length();
      if (length1 > b2Settings.b2_linearSlop) {
        this.m_u1.x *= 1 / length1;
        this.m_u1.y *= 1 / length1;
      } else this.m_u1.SetZero();
      C = this.m_maxLength1 - length1;
      linearError = b2Math.Max(linearError, -C);
      C = b2Math.Clamp(
        C + b2Settings.b2_linearSlop,
        -b2Settings.b2_maxLinearCorrection,
        0
      );
      impulse = -this.m_limitMass1 * C;
      p1X = -impulse * this.m_u1.x;
      p1Y = -impulse * this.m_u1.y;
      bA.m_sweep.c.x += bA.m_invMass * p1X;
      bA.m_sweep.c.y += bA.m_invMass * p1Y;
      bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
      bA.SynchronizeTransform();
    }
    if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
      tMat = bB.m_xf.R;
      r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
      r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
      r2X = tX;
      p2X = bB.m_sweep.c.x + r2X;
      p2Y = bB.m_sweep.c.y + r2Y;
      this.m_u2.Set(p2X - s2X, p2Y - s2Y);
      length2 = this.m_u2.Length();
      if (length2 > b2Settings.b2_linearSlop) {
        this.m_u2.x *= 1 / length2;
        this.m_u2.y *= 1 / length2;
      } else this.m_u2.SetZero();
      C = this.m_maxLength2 - length2;
      linearError = b2Math.Max(linearError, -C);
      C = b2Math.Clamp(
        C + b2Settings.b2_linearSlop,
        -b2Settings.b2_maxLinearCorrection,
        0
      );
      impulse = -this.m_limitMass2 * C;
      p2X = -impulse * this.m_u2.x;
      p2Y = -impulse * this.m_u2.y;
      bB.m_sweep.c.x += bB.m_invMass * p2X;
      bB.m_sweep.c.y += bB.m_invMass * p2Y;
      bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
      bB.SynchronizeTransform();
    }
    return linearError < b2Settings.b2_linearSlop;
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength = 2;
  });
  Box2D.inherit(b2PulleyJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2PulleyJointDef.prototype.__super =
    Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2PulleyJointDef.b2PulleyJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
    this.groundAnchorA = new b2Vec2();
    this.groundAnchorB = new b2Vec2();
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
  };
  b2PulleyJointDef.prototype.b2PulleyJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_pulleyJoint;
    this.groundAnchorA.Set(-1, 1);
    this.groundAnchorB.Set(1, 1);
    this.localAnchorA.Set(-1, 0);
    this.localAnchorB.Set(1, 0);
    this.lengthA = 0;
    this.maxLengthA = 0;
    this.lengthB = 0;
    this.maxLengthB = 0;
    this.ratio = 1;
    this.collideConnected = true;
  };
  b2PulleyJointDef.prototype.Initialize = function (
    bA,
    bB,
    gaA,
    gaB,
    anchorA,
    anchorB,
    r
  ) {
    if (r === undefined) r = 0;
    this.bodyA = bA;
    this.bodyB = bB;
    this.groundAnchorA.SetV(gaA);
    this.groundAnchorB.SetV(gaB);
    this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
    this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
    var d1X = anchorA.x - gaA.x;
    var d1Y = anchorA.y - gaA.y;
    this.lengthA = Math.sqrt(d1X * d1X + d1Y * d1Y);
    var d2X = anchorB.x - gaB.x;
    var d2Y = anchorB.y - gaB.y;
    this.lengthB = Math.sqrt(d2X * d2X + d2Y * d2Y);
    this.ratio = r;
    var C = this.lengthA + this.ratio * this.lengthB;
    this.maxLengthA = C - this.ratio * b2PulleyJoint.b2_minPulleyLength;
    this.maxLengthB = (C - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
  };
  Box2D.inherit(b2RevoluteJoint, Box2D.Dynamics.Joints.b2Joint);
  b2RevoluteJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2RevoluteJoint.b2RevoluteJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.K = new b2Mat22();
    this.K1 = new b2Mat22();
    this.K2 = new b2Mat22();
    this.K3 = new b2Mat22();
    this.impulse3 = new b2Vec3();
    this.impulse2 = new b2Vec2();
    this.reduced = new b2Vec2();
    this.m_localAnchor1 = new b2Vec2();
    this.m_localAnchor2 = new b2Vec2();
    this.m_impulse = new b2Vec3();
    this.m_mass = new b2Mat33();
  };
  b2RevoluteJoint.prototype.GetAnchorA = function () {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
  };
  b2RevoluteJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
  };
  b2RevoluteJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
  };
  b2RevoluteJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return inv_dt * this.m_impulse.z;
  };
  b2RevoluteJoint.prototype.GetJointAngle = function () {
    return (
      this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle
    );
  };
  b2RevoluteJoint.prototype.GetJointSpeed = function () {
    return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
  };
  b2RevoluteJoint.prototype.IsLimitEnabled = function () {
    return this.m_enableLimit;
  };
  b2RevoluteJoint.prototype.EnableLimit = function (flag) {
    this.m_enableLimit = flag;
  };
  b2RevoluteJoint.prototype.GetLowerLimit = function () {
    return this.m_lowerAngle;
  };
  b2RevoluteJoint.prototype.GetUpperLimit = function () {
    return this.m_upperAngle;
  };
  b2RevoluteJoint.prototype.SetLimits = function (lower, upper) {
    if (lower === undefined) lower = 0;
    if (upper === undefined) upper = 0;
    this.m_lowerAngle = lower;
    this.m_upperAngle = upper;
  };
  b2RevoluteJoint.prototype.IsMotorEnabled = function () {
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    return this.m_enableMotor;
  };
  b2RevoluteJoint.prototype.EnableMotor = function (flag) {
    this.m_enableMotor = flag;
  };
  b2RevoluteJoint.prototype.SetMotorSpeed = function (speed) {
    if (speed === undefined) speed = 0;
    this.m_bodyA.SetAwake(true);
    this.m_bodyB.SetAwake(true);
    this.m_motorSpeed = speed;
  };
  b2RevoluteJoint.prototype.GetMotorSpeed = function () {
    return this.m_motorSpeed;
  };
  b2RevoluteJoint.prototype.SetMaxMotorTorque = function (torque) {
    if (torque === undefined) torque = 0;
    this.m_maxMotorTorque = torque;
  };
  b2RevoluteJoint.prototype.GetMotorTorque = function () {
    return this.m_maxMotorTorque;
  };
  b2RevoluteJoint.prototype.b2RevoluteJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    this.m_localAnchor1.SetV(def.localAnchorA);
    this.m_localAnchor2.SetV(def.localAnchorB);
    this.m_referenceAngle = def.referenceAngle;
    this.m_impulse.SetZero();
    this.m_motorImpulse = 0;
    this.m_lowerAngle = def.lowerAngle;
    this.m_upperAngle = def.upperAngle;
    this.m_maxMotorTorque = def.maxMotorTorque;
    this.m_motorSpeed = def.motorSpeed;
    this.m_enableLimit = def.enableLimit;
    this.m_enableMotor = def.enableMotor;
    this.m_limitState = b2Joint.e_inactiveLimit;
  };
  b2RevoluteJoint.prototype.InitVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    var tX = 0;
    if (this.m_enableMotor || this.m_enableLimit);
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var m1 = bA.m_invMass;
    var m2 = bB.m_invMass;
    var i1 = bA.m_invI;
    var i2 = bB.m_invI;
    this.m_mass.col1.x = m1 + m2 + r1Y * r1Y * i1 + r2Y * r2Y * i2;
    this.m_mass.col2.x = -r1Y * r1X * i1 - r2Y * r2X * i2;
    this.m_mass.col3.x = -r1Y * i1 - r2Y * i2;
    this.m_mass.col1.y = this.m_mass.col2.x;
    this.m_mass.col2.y = m1 + m2 + r1X * r1X * i1 + r2X * r2X * i2;
    this.m_mass.col3.y = r1X * i1 + r2X * i2;
    this.m_mass.col1.z = this.m_mass.col3.x;
    this.m_mass.col2.z = this.m_mass.col3.y;
    this.m_mass.col3.z = i1 + i2;
    this.m_motorMass = 1 / (i1 + i2);
    if (this.m_enableMotor == false) this.m_motorImpulse = 0;
    if (this.m_enableLimit) {
      var jointAngle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
      if (
        b2Math.Abs(this.m_upperAngle - this.m_lowerAngle) <
        2 * b2Settings.b2_angularSlop
      )
        this.m_limitState = b2Joint.e_equalLimits;
      else if (jointAngle <= this.m_lowerAngle) {
        if (this.m_limitState != b2Joint.e_atLowerLimit) this.m_impulse.z = 0;
        this.m_limitState = b2Joint.e_atLowerLimit;
      } else if (jointAngle >= this.m_upperAngle) {
        if (this.m_limitState != b2Joint.e_atUpperLimit) this.m_impulse.z = 0;
        this.m_limitState = b2Joint.e_atUpperLimit;
      } else {
        this.m_limitState = b2Joint.e_inactiveLimit;
        this.m_impulse.z = 0;
      }
    } else this.m_limitState = b2Joint.e_inactiveLimit;
    if (step.warmStarting) {
      this.m_impulse.x *= step.dtRatio;
      this.m_impulse.y *= step.dtRatio;
      this.m_motorImpulse *= step.dtRatio;
      var PX = this.m_impulse.x;
      var PY = this.m_impulse.y;
      bA.m_linearVelocity.x -= m1 * PX;
      bA.m_linearVelocity.y -= m1 * PY;
      bA.m_angularVelocity -=
        i1 * (r1X * PY - r1Y * PX + this.m_motorImpulse + this.m_impulse.z);
      bB.m_linearVelocity.x += m2 * PX;
      bB.m_linearVelocity.y += m2 * PY;
      bB.m_angularVelocity +=
        i2 * (r2X * PY - r2Y * PX + this.m_motorImpulse + this.m_impulse.z);
    } else {
      this.m_impulse.SetZero();
      this.m_motorImpulse = 0;
    }
  };
  b2RevoluteJoint.prototype.SolveVelocityConstraints = function (step) {
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var tMat;
    var tX = 0;
    var newImpulse = 0;
    var r1X = 0;
    var r1Y = 0;
    var r2X = 0;
    var r2Y = 0;
    var v1 = bA.m_linearVelocity;
    var w1 = bA.m_angularVelocity;
    var v2 = bB.m_linearVelocity;
    var w2 = bB.m_angularVelocity;
    var m1 = bA.m_invMass;
    var m2 = bB.m_invMass;
    var i1 = bA.m_invI;
    var i2 = bB.m_invI;
    if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
      var Cdot = w2 - w1 - this.m_motorSpeed;
      var impulse = this.m_motorMass * -Cdot;
      var oldImpulse = this.m_motorImpulse;
      var maxImpulse = step.dt * this.m_maxMotorTorque;
      this.m_motorImpulse = b2Math.Clamp(
        this.m_motorImpulse + impulse,
        -maxImpulse,
        maxImpulse
      );
      impulse = this.m_motorImpulse - oldImpulse;
      w1 -= i1 * impulse;
      w2 += i2 * impulse;
    }
    if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
      tMat = bA.m_xf.R;
      r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
      r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
      r1X = tX;
      tMat = bB.m_xf.R;
      r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
      r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
      r2X = tX;
      var Cdot1X = v2.x + -w2 * r2Y - v1.x - -w1 * r1Y;
      var Cdot1Y = v2.y + w2 * r2X - v1.y - w1 * r1X;
      var Cdot2 = w2 - w1;
      this.m_mass.Solve33(this.impulse3, -Cdot1X, -Cdot1Y, -Cdot2);
      if (this.m_limitState == b2Joint.e_equalLimits)
        this.m_impulse.Add(this.impulse3);
      else if (this.m_limitState == b2Joint.e_atLowerLimit) {
        newImpulse = this.m_impulse.z + this.impulse3.z;
        if (newImpulse < 0) {
          this.m_mass.Solve22(this.reduced, -Cdot1X, -Cdot1Y);
          this.impulse3.x = this.reduced.x;
          this.impulse3.y = this.reduced.y;
          this.impulse3.z = -this.m_impulse.z;
          this.m_impulse.x += this.reduced.x;
          this.m_impulse.y += this.reduced.y;
          this.m_impulse.z = 0;
        }
      } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
        newImpulse = this.m_impulse.z + this.impulse3.z;
        if (newImpulse > 0) {
          this.m_mass.Solve22(this.reduced, -Cdot1X, -Cdot1Y);
          this.impulse3.x = this.reduced.x;
          this.impulse3.y = this.reduced.y;
          this.impulse3.z = -this.m_impulse.z;
          this.m_impulse.x += this.reduced.x;
          this.m_impulse.y += this.reduced.y;
          this.m_impulse.z = 0;
        }
      }
      v1.x -= m1 * this.impulse3.x;
      v1.y -= m1 * this.impulse3.y;
      w1 -=
        i1 * (r1X * this.impulse3.y - r1Y * this.impulse3.x + this.impulse3.z);
      v2.x += m2 * this.impulse3.x;
      v2.y += m2 * this.impulse3.y;
      w2 +=
        i2 * (r2X * this.impulse3.y - r2Y * this.impulse3.x + this.impulse3.z);
    } else {
      tMat = bA.m_xf.R;
      r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
      r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
      r1X = tX;
      tMat = bB.m_xf.R;
      r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
      r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
      r2X = tX;
      var CdotX = v2.x + -w2 * r2Y - v1.x - -w1 * r1Y;
      var CdotY = v2.y + w2 * r2X - v1.y - w1 * r1X;
      this.m_mass.Solve22(this.impulse2, -CdotX, -CdotY);
      this.m_impulse.x += this.impulse2.x;
      this.m_impulse.y += this.impulse2.y;
      v1.x -= m1 * this.impulse2.x;
      v1.y -= m1 * this.impulse2.y;
      w1 -= i1 * (r1X * this.impulse2.y - r1Y * this.impulse2.x);
      v2.x += m2 * this.impulse2.x;
      v2.y += m2 * this.impulse2.y;
      w2 += i2 * (r2X * this.impulse2.y - r2Y * this.impulse2.x);
    }
    bA.m_linearVelocity.SetV(v1);
    bA.m_angularVelocity = w1;
    bB.m_linearVelocity.SetV(v2);
    bB.m_angularVelocity = w2;
  };
  b2RevoluteJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    var oldLimitImpulse = 0;
    var C = 0;
    var tMat;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var angularError = 0;
    var positionError = 0;
    var tX = 0;
    var impulseX = 0;
    var impulseY = 0;
    if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
      var angle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
      var limitImpulse = 0;
      if (this.m_limitState == b2Joint.e_equalLimits) {
        C = b2Math.Clamp(
          angle - this.m_lowerAngle,
          -b2Settings.b2_maxAngularCorrection,
          b2Settings.b2_maxAngularCorrection
        );
        limitImpulse = -this.m_motorMass * C;
        angularError = b2Math.Abs(C);
      } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
        C = angle - this.m_lowerAngle;
        angularError = -C;
        C = b2Math.Clamp(
          C + b2Settings.b2_angularSlop,
          -b2Settings.b2_maxAngularCorrection,
          0
        );
        limitImpulse = -this.m_motorMass * C;
      } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
        C = angle - this.m_upperAngle;
        angularError = C;
        C = b2Math.Clamp(
          C - b2Settings.b2_angularSlop,
          0,
          b2Settings.b2_maxAngularCorrection
        );
        limitImpulse = -this.m_motorMass * C;
      }
      bA.m_sweep.a -= bA.m_invI * limitImpulse;
      bB.m_sweep.a += bB.m_invI * limitImpulse;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
    }
    tMat = bA.m_xf.R;
    var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
    var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
    tX = tMat.col1.x * r1X + tMat.col2.x * r1Y;
    r1Y = tMat.col1.y * r1X + tMat.col2.y * r1Y;
    r1X = tX;
    tMat = bB.m_xf.R;
    var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
    var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * r2X + tMat.col2.x * r2Y;
    r2Y = tMat.col1.y * r2X + tMat.col2.y * r2Y;
    r2X = tX;
    var CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
    var CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
    var CLengthSquared = CX * CX + CY * CY;
    var CLength = Math.sqrt(CLengthSquared);
    positionError = CLength;
    var invMass1 = bA.m_invMass;
    var invMass2 = bB.m_invMass;
    var invI1 = bA.m_invI;
    var invI2 = bB.m_invI;
    var k_allowedStretch = 10 * b2Settings.b2_linearSlop;
    if (CLengthSquared > k_allowedStretch * k_allowedStretch) {
      var uX = CX / CLength;
      var uY = CY / CLength;
      var k = invMass1 + invMass2;
      var m = 1 / k;
      impulseX = m * -CX;
      impulseY = m * -CY;
      var k_beta = 0.5;
      bA.m_sweep.c.x -= k_beta * invMass1 * impulseX;
      bA.m_sweep.c.y -= k_beta * invMass1 * impulseY;
      bB.m_sweep.c.x += k_beta * invMass2 * impulseX;
      bB.m_sweep.c.y += k_beta * invMass2 * impulseY;
      CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
    }
    this.K1.col1.x = invMass1 + invMass2;
    this.K1.col2.x = 0;
    this.K1.col1.y = 0;
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
    this.K.Solve(b2RevoluteJoint.tImpulse, -CX, -CY);
    impulseX = b2RevoluteJoint.tImpulse.x;
    impulseY = b2RevoluteJoint.tImpulse.y;
    bA.m_sweep.c.x -= bA.m_invMass * impulseX;
    bA.m_sweep.c.y -= bA.m_invMass * impulseY;
    bA.m_sweep.a -= bA.m_invI * (r1X * impulseY - r1Y * impulseX);
    bB.m_sweep.c.x += bB.m_invMass * impulseX;
    bB.m_sweep.c.y += bB.m_invMass * impulseY;
    bB.m_sweep.a += bB.m_invI * (r2X * impulseY - r2Y * impulseX);
    bA.SynchronizeTransform();
    bB.SynchronizeTransform();
    return (
      positionError <= b2Settings.b2_linearSlop &&
      angularError <= b2Settings.b2_angularSlop
    );
  };
  Box2D.postDefs.push(function () {
    Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse = new b2Vec2();
  });
  Box2D.inherit(b2RevoluteJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2RevoluteJointDef.prototype.__super =
    Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2RevoluteJointDef.b2RevoluteJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
  };
  b2RevoluteJointDef.prototype.b2RevoluteJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_revoluteJoint;
    this.localAnchorA.Set(0, 0);
    this.localAnchorB.Set(0, 0);
    this.referenceAngle = 0;
    this.lowerAngle = 0;
    this.upperAngle = 0;
    this.maxMotorTorque = 0;
    this.motorSpeed = 0;
    this.enableLimit = false;
    this.enableMotor = false;
  };
  b2RevoluteJointDef.prototype.Initialize = function (bA, bB, anchor) {
    this.bodyA = bA;
    this.bodyB = bB;
    this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
    this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
    this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
  };
  Box2D.inherit(b2WeldJoint, Box2D.Dynamics.Joints.b2Joint);
  b2WeldJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
  b2WeldJoint.b2WeldJoint = function () {
    Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
    this.m_localAnchorA = new b2Vec2();
    this.m_localAnchorB = new b2Vec2();
    this.m_impulse = new b2Vec3();
    this.m_mass = new b2Mat33();
  };
  b2WeldJoint.prototype.GetAnchorA = function () {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
  };
  b2WeldJoint.prototype.GetAnchorB = function () {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
  };
  b2WeldJoint.prototype.GetReactionForce = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
  };
  b2WeldJoint.prototype.GetReactionTorque = function (inv_dt) {
    if (inv_dt === undefined) inv_dt = 0;
    return inv_dt * this.m_impulse.z;
  };
  b2WeldJoint.prototype.b2WeldJoint = function (def) {
    this.__super.b2Joint.call(this, def);
    this.m_localAnchorA.SetV(def.localAnchorA);
    this.m_localAnchorB.SetV(def.localAnchorB);
    this.m_referenceAngle = def.referenceAngle;
    this.m_impulse.SetZero();
    this.m_mass = new b2Mat33();
  };
  b2WeldJoint.prototype.InitVelocityConstraints = function (step) {
    var tMat;
    var tX = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    tMat = bA.m_xf.R;
    var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
    var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
    tX = tMat.col1.x * rAX + tMat.col2.x * rAY;
    rAY = tMat.col1.y * rAX + tMat.col2.y * rAY;
    rAX = tX;
    tMat = bB.m_xf.R;
    var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
    var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * rBX + tMat.col2.x * rBY;
    rBY = tMat.col1.y * rBX + tMat.col2.y * rBY;
    rBX = tX;
    var mA = bA.m_invMass;
    var mB = bB.m_invMass;
    var iA = bA.m_invI;
    var iB = bB.m_invI;
    this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
    this.m_mass.col2.x = -rAY * rAX * iA - rBY * rBX * iB;
    this.m_mass.col3.x = -rAY * iA - rBY * iB;
    this.m_mass.col1.y = this.m_mass.col2.x;
    this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
    this.m_mass.col3.y = rAX * iA + rBX * iB;
    this.m_mass.col1.z = this.m_mass.col3.x;
    this.m_mass.col2.z = this.m_mass.col3.y;
    this.m_mass.col3.z = iA + iB;
    if (step.warmStarting) {
      this.m_impulse.x *= step.dtRatio;
      this.m_impulse.y *= step.dtRatio;
      this.m_impulse.z *= step.dtRatio;
      bA.m_linearVelocity.x -= mA * this.m_impulse.x;
      bA.m_linearVelocity.y -= mA * this.m_impulse.y;
      bA.m_angularVelocity -=
        iA *
        (rAX * this.m_impulse.y - rAY * this.m_impulse.x + this.m_impulse.z);
      bB.m_linearVelocity.x += mB * this.m_impulse.x;
      bB.m_linearVelocity.y += mB * this.m_impulse.y;
      bB.m_angularVelocity +=
        iB *
        (rBX * this.m_impulse.y - rBY * this.m_impulse.x + this.m_impulse.z);
    } else this.m_impulse.SetZero();
  };
  b2WeldJoint.prototype.SolveVelocityConstraints = function (step) {
    var tMat;
    var tX = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    var vA = bA.m_linearVelocity;
    var wA = bA.m_angularVelocity;
    var vB = bB.m_linearVelocity;
    var wB = bB.m_angularVelocity;
    var mA = bA.m_invMass;
    var mB = bB.m_invMass;
    var iA = bA.m_invI;
    var iB = bB.m_invI;
    tMat = bA.m_xf.R;
    var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
    var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
    tX = tMat.col1.x * rAX + tMat.col2.x * rAY;
    rAY = tMat.col1.y * rAX + tMat.col2.y * rAY;
    rAX = tX;
    tMat = bB.m_xf.R;
    var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
    var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * rBX + tMat.col2.x * rBY;
    rBY = tMat.col1.y * rBX + tMat.col2.y * rBY;
    rBX = tX;
    var Cdot1X = vB.x - wB * rBY - vA.x + wA * rAY;
    var Cdot1Y = vB.y + wB * rBX - vA.y - wA * rAX;
    var Cdot2 = wB - wA;
    var impulse = new b2Vec3();
    this.m_mass.Solve33(impulse, -Cdot1X, -Cdot1Y, -Cdot2);
    this.m_impulse.Add(impulse);
    vA.x -= mA * impulse.x;
    vA.y -= mA * impulse.y;
    wA -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
    vB.x += mB * impulse.x;
    vB.y += mB * impulse.y;
    wB += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
    bA.m_angularVelocity = wA;
    bB.m_angularVelocity = wB;
  };
  b2WeldJoint.prototype.SolvePositionConstraints = function (baumgarte) {
    if (baumgarte === undefined) baumgarte = 0;
    var tMat;
    var tX = 0;
    var bA = this.m_bodyA;
    var bB = this.m_bodyB;
    tMat = bA.m_xf.R;
    var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
    var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
    tX = tMat.col1.x * rAX + tMat.col2.x * rAY;
    rAY = tMat.col1.y * rAX + tMat.col2.y * rAY;
    rAX = tX;
    tMat = bB.m_xf.R;
    var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
    var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
    tX = tMat.col1.x * rBX + tMat.col2.x * rBY;
    rBY = tMat.col1.y * rBX + tMat.col2.y * rBY;
    rBX = tX;
    var mA = bA.m_invMass;
    var mB = bB.m_invMass;
    var iA = bA.m_invI;
    var iB = bB.m_invI;
    var C1X = bB.m_sweep.c.x + rBX - bA.m_sweep.c.x - rAX;
    var C1Y = bB.m_sweep.c.y + rBY - bA.m_sweep.c.y - rAY;
    var C2 = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
    var k_allowedStretch = 10 * b2Settings.b2_linearSlop;
    var positionError = Math.sqrt(C1X * C1X + C1Y * C1Y);
    var angularError = b2Math.Abs(C2);
    if (positionError > k_allowedStretch) {
      iA *= 1;
      iB *= 1;
    }
    this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
    this.m_mass.col2.x = -rAY * rAX * iA - rBY * rBX * iB;
    this.m_mass.col3.x = -rAY * iA - rBY * iB;
    this.m_mass.col1.y = this.m_mass.col2.x;
    this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
    this.m_mass.col3.y = rAX * iA + rBX * iB;
    this.m_mass.col1.z = this.m_mass.col3.x;
    this.m_mass.col2.z = this.m_mass.col3.y;
    this.m_mass.col3.z = iA + iB;
    var impulse = new b2Vec3();
    this.m_mass.Solve33(impulse, -C1X, -C1Y, -C2);
    bA.m_sweep.c.x -= mA * impulse.x;
    bA.m_sweep.c.y -= mA * impulse.y;
    bA.m_sweep.a -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
    bB.m_sweep.c.x += mB * impulse.x;
    bB.m_sweep.c.y += mB * impulse.y;
    bB.m_sweep.a += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
    bA.SynchronizeTransform();
    bB.SynchronizeTransform();
    return (
      positionError <= b2Settings.b2_linearSlop &&
      angularError <= b2Settings.b2_angularSlop
    );
  };
  Box2D.inherit(b2WeldJointDef, Box2D.Dynamics.Joints.b2JointDef);
  b2WeldJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
  b2WeldJointDef.b2WeldJointDef = function () {
    Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
    this.localAnchorA = new b2Vec2();
    this.localAnchorB = new b2Vec2();
  };
  b2WeldJointDef.prototype.b2WeldJointDef = function () {
    this.__super.b2JointDef.call(this);
    this.type = b2Joint.e_weldJoint;
    this.referenceAngle = 0;
  };
  b2WeldJointDef.prototype.Initialize = function (bA, bB, anchor) {
    this.bodyA = bA;
    this.bodyB = bB;
    this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
    this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
    this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
  };
})();
(function () {
  var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
  b2DebugDraw.b2DebugDraw = function () {
    this.m_drawScale = 1;
    this.m_lineThickness = 1;
    this.m_alpha = 1;
    this.m_fillAlpha = 1;
    this.m_xformScale = 1;
    var __this = this;
    this.m_sprite = {
      graphics: {
        clear: function () {
          __this.m_ctx.clearRect(
            0,
            0,
            __this.m_ctx.canvas.width,
            __this.m_ctx.canvas.height
          );
        },
      },
    };
  };
  b2DebugDraw.prototype._color = function (color, alpha) {
    return (
      "rgba(" +
      ((color & 16711680) >> 16) +
      "," +
      ((color & 65280) >> 8) +
      "," +
      (color & 255) +
      "," +
      alpha +
      ")"
    );
  };
  b2DebugDraw.prototype.b2DebugDraw = function () {
    this.m_drawFlags = 0;
  };
  b2DebugDraw.prototype.SetFlags = function (flags) {
    if (flags === undefined) flags = 0;
    this.m_drawFlags = flags;
  };
  b2DebugDraw.prototype.GetFlags = function () {
    return this.m_drawFlags;
  };
  b2DebugDraw.prototype.AppendFlags = function (flags) {
    if (flags === undefined) flags = 0;
    this.m_drawFlags |= flags;
  };
  b2DebugDraw.prototype.ClearFlags = function (flags) {
    if (flags === undefined) flags = 0;
    this.m_drawFlags &= ~flags;
  };
  b2DebugDraw.prototype.SetSprite = function (sprite) {
    this.m_ctx = sprite;
  };
  b2DebugDraw.prototype.GetSprite = function () {
    return this.m_ctx;
  };
  b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
    if (drawScale === undefined) drawScale = 0;
    this.m_drawScale = drawScale;
  };
  b2DebugDraw.prototype.GetDrawScale = function () {
    return this.m_drawScale;
  };
  b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
    if (lineThickness === undefined) lineThickness = 0;
    this.m_lineThickness = lineThickness;
    this.m_ctx.strokeWidth = lineThickness;
  };
  b2DebugDraw.prototype.GetLineThickness = function () {
    return this.m_lineThickness;
  };
  b2DebugDraw.prototype.SetAlpha = function (alpha) {
    if (alpha === undefined) alpha = 0;
    this.m_alpha = alpha;
  };
  b2DebugDraw.prototype.GetAlpha = function () {
    return this.m_alpha;
  };
  b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
    if (alpha === undefined) alpha = 0;
    this.m_fillAlpha = alpha;
  };
  b2DebugDraw.prototype.GetFillAlpha = function () {
    return this.m_fillAlpha;
  };
  b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
    if (xformScale === undefined) xformScale = 0;
    this.m_xformScale = xformScale;
  };
  b2DebugDraw.prototype.GetXFormScale = function () {
    return this.m_xformScale;
  };
  b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
    if (!vertexCount) return;
    var s = this.m_ctx;
    var drawScale = this.m_drawScale;
    s.beginPath();
    s.strokeStyle = this._color(color.color, this.m_alpha);
    s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
    for (var i = 1; i < vertexCount; i++)
      s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
    s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
    s.closePath();
    s.stroke();
  };
  b2DebugDraw.prototype.DrawSolidPolygon = function (
    vertices,
    vertexCount,
    color
  ) {
    if (!vertexCount) return;
    var s = this.m_ctx;
    var drawScale = this.m_drawScale;
    s.beginPath();
    s.strokeStyle = this._color(color.color, this.m_alpha);
    s.fillStyle = this._color(color.color, this.m_fillAlpha);
    s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
    for (var i = 1; i < vertexCount; i++)
      s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
    s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
    s.closePath();
    s.fill();
    s.stroke();
  };
  b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
    if (!radius) return;
    var s = this.m_ctx;
    var drawScale = this.m_drawScale;
    s.beginPath();
    s.strokeStyle = this._color(color.color, this.m_alpha);
    s.arc(
      center.x * drawScale,
      center.y * drawScale,
      radius * drawScale,
      0,
      Math.PI * 2,
      true
    );
    s.closePath();
    s.stroke();
  };
  b2DebugDraw.prototype.DrawSolidCircle = function (
    center,
    radius,
    axis,
    color
  ) {
    if (!radius) return;
    var s = this.m_ctx,
      drawScale = this.m_drawScale,
      cx = center.x * drawScale,
      cy = center.y * drawScale;
    s.moveTo(0, 0);
    s.beginPath();
    s.strokeStyle = this._color(color.color, this.m_alpha);
    s.fillStyle = this._color(color.color, this.m_fillAlpha);
    s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
    s.moveTo(cx, cy);
    s.lineTo(
      (center.x + axis.x * radius) * drawScale,
      (center.y + axis.y * radius) * drawScale
    );
    s.closePath();
    s.fill();
    s.stroke();
  };
  b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {
    var s = this.m_ctx,
      drawScale = this.m_drawScale;
    s.strokeStyle = this._color(color.color, this.m_alpha);
    s.beginPath();
    s.moveTo(p1.x * drawScale, p1.y * drawScale);
    s.lineTo(p2.x * drawScale, p2.y * drawScale);
    s.closePath();
    s.stroke();
  };
  b2DebugDraw.prototype.DrawTransform = function (xf) {
    var s = this.m_ctx,
      drawScale = this.m_drawScale;
    s.beginPath();
    s.strokeStyle = this._color(16711680, this.m_alpha);
    s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
    s.lineTo(
      (xf.position.x + this.m_xformScale * xf.R.col1.x) * drawScale,
      (xf.position.y + this.m_xformScale * xf.R.col1.y) * drawScale
    );
    s.strokeStyle = this._color(65280, this.m_alpha);
    s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
    s.lineTo(
      (xf.position.x + this.m_xformScale * xf.R.col2.x) * drawScale,
      (xf.position.y + this.m_xformScale * xf.R.col2.y) * drawScale
    );
    s.closePath();
    s.stroke();
  };
})();
var i;
for (i = 0; i < Box2D.postDefs.length; ++i) Box2D.postDefs[i]();
delete Box2D.postDefs;
var mathSin = Math.sin;
Math.sin = function (a) {
  if (a === 0) return 0;
  else return mathSin(a);
};
var mathCos = Math.cos;
Math.cos = function (a) {
  if (a === 0) return 1;
  else return mathCos(a);
};
var b2Vec2 = Box2D.Common.Math.b2Vec2,
  b2AABB = Box2D.Collision.b2AABB,
  b2BodyDef = Box2D.Dynamics.b2BodyDef,
  b2Body = Box2D.Dynamics.b2Body,
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
  b2Fixture = Box2D.Dynamics.b2Fixture,
  b2World = Box2D.Dynamics.b2World,
  b2MassData = Box2D.Collision.Shapes.b2MassData,
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
  b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
  b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
  b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
  b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
  b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
  b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
  b2ContactListener = Box2D.Dynamics.b2ContactListener,
  b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
  b2DestructionListener = Box2D.Dynamics.b2DestructionListener;
var box2d = {
  SCALE: 30,
  DEFAULT_DENSITY: 1,
  DEFAULT_RESTITUTION: 0.2,
  DEFAULT_FRICTION: 0.5,
  bodyType: {
    dynamic: b2Body.b2_dynamicBody,
    static: b2Body.b2_staticBody,
    kinematic: b2Body.b2_kinematicBody,
  },
  createWorld: function (gravity, allowSleep) {
    if (typeof gravity == "undefined") gravity = new b2Vec2(0, 10);
    if (typeof allowSleep == "undefined") allowSleep = true;
    return new b2World(gravity, allowSleep);
  },
  setDebugDraw: function (world, canvas) {
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(canvas.getContext("2d"));
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
    box2d.setDebugDrawScale(world);
  },
  setDebugDrawScale: function (world) {
    if (world && world.m_debugDraw)
      world.m_debugDraw.SetDrawScale(Utils.globalScale * box2d.SCALE);
  },
  prepareBodyOptions: function (options) {
    if (typeof options != "object") options = {};
    options.x = typeof options.x != "undefined" ? options.x : 0;
    options.y = typeof options.y != "undefined" ? options.y : 0;
    options.rotation =
      typeof options.rotation != "undefined" ? options.rotation : 0;
    options.bodyType =
      typeof options.bodyType != "undefined"
        ? options.bodyType
        : box2d.bodyType.dynamic;
    options.density =
      typeof options.density != "undefined"
        ? options.density
        : box2d.DEFAULT_DENSITY;
    options.restitution =
      typeof options.restitution != "undefined"
        ? options.restitution
        : box2d.DEFAULT_RESTITUTION;
    options.friction =
      typeof options.friction != "undefined"
        ? options.friction
        : box2d.DEFAULT_FRICTION;
    options.linearDamping =
      typeof options.linearDamping != "undefined" ? options.linearDamping : 0;
    options.angularDamping =
      typeof options.angularDamping != "undefined" ? options.angularDamping : 0;
    options.allowSleep =
      typeof options.allowSleep != "undefined" ? options.allowSleep : true;
    options.isSleeping =
      typeof options.isSleeping != "undefined" ? options.isSleeping : false;
    options.isBullet =
      typeof options.isBullet != "undefined" ? options.isBullet : false;
    options.fixedRotation =
      typeof options.fixedRotation != "undefined"
        ? options.fixedRotation
        : false;
    if (typeof options.filter == "undefined") options.filter = {};
    options.filter.categoryBits =
      typeof options.filter.categoryBits != "undefined"
        ? options.filter.categoryBits
        : 1;
    options.filter.groupIndex =
      typeof options.filter.groupIndex != "undefined"
        ? options.filter.groupIndex
        : 0;
    options.filter.maskBits =
      typeof options.filter.maskBits != "undefined"
        ? options.filter.maskBits
        : 65535;
    options.isSensor =
      typeof options.isSensor != "undefined" ? options.isSensor : false;
    return options;
  },
  fillFixtureDef: function (fixDef, options) {
    fixDef.density = options.density;
    fixDef.restitution = options.restitution;
    fixDef.friction = options.friction;
    fixDef.filter.categoryBits = options.filter.categoryBits;
    fixDef.filter.groupIndex = options.filter.groupIndex;
    fixDef.filter.maskBits = options.filter.maskBits;
    fixDef.isSensor = options.isSensor;
    return fixDef;
  },
  fillBodyDef: function (bodyDef, options) {
    bodyDef.type = options.bodyType;
    bodyDef.angle = options.rotation;
    bodyDef.position.Set(options.x / box2d.SCALE, options.y / box2d.SCALE);
    bodyDef.linearDamping = options.linearDamping;
    bodyDef.angularDamping = options.angularDamping;
    bodyDef.allowSleep = options.allowSleep;
    bodyDef.isSleeping = options.isSleeping;
    bodyDef.isBullet = options.isBullet;
    bodyDef.fixedRotation = options.fixedRotation;
    return bodyDef;
  },
  createCircle: function (world, options) {
    options = box2d.prepareBodyOptions(options);
    options.radius = typeof options.radius != "undefined" ? options.radius : 10;
    var fixDef = box2d.fillFixtureDef(new b2FixtureDef(), options);
    var bodyDef = box2d.fillBodyDef(new b2BodyDef(), options);
    fixDef.shape = new b2CircleShape(options.radius / box2d.SCALE);
    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    body.SetBullet(options.isBullet);
    return body;
  },
  createBox: function (world, options) {
    options = box2d.prepareBodyOptions(options);
    options.width = typeof options.width != "undefined" ? options.width : 20;
    options.height = typeof options.height != "undefined" ? options.height : 20;
    var fixDef = box2d.fillFixtureDef(new b2FixtureDef(), options);
    var bodyDef = box2d.fillBodyDef(new b2BodyDef(), options);
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(
      options.width / box2d.SCALE / 2,
      options.height / box2d.SCALE / 2
    );
    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    body.SetBullet(options.isBullet);
    return body;
  },
  createPoly: function (world, options) {
    options = box2d.prepareBodyOptions(options);
    options.points = typeof options.points != "undefined" ? options.points : [];
    var bodyDef = box2d.fillBodyDef(new b2BodyDef(), options);
    var body = world.CreateBody(bodyDef);
    var fixDef;
    for (var n = 0; n < options.points.length; n++) {
      var p = options.points[n];
      fixDef = box2d.fillFixtureDef(new b2FixtureDef(), options);
      fixDef.shape = new b2PolygonShape();
      var vertices = [];
      for (var i = 0; i < p.length; i++)
        vertices.push(new b2Vec2(p[i][0] / box2d.SCALE, p[i][1] / box2d.SCALE));
      fixDef.shape.SetAsVector(vertices, vertices.length);
      body.CreateFixture(fixDef);
    }
    body.SetBullet(options.isBullet);
    return body;
  },
  setBodyPosition: function (body, x, y) {
    var pos = body.GetPosition();
    if (typeof x == "undefined") x = pos.x * box2d.SCALE;
    if (typeof y == "undefined") y = pos.y * box2d.SCALE;
    body.SetPosition(new b2Vec2(x / box2d.SCALE, y / box2d.SCALE));
  },
  setBodyPositionAndRotation: function (body, x, y, rotation) {
    var pos = body.GetPosition();
    if (typeof x == "undefined") x = pos.x * box2d.SCALE;
    if (typeof y == "undefined") y = pos.y * box2d.SCALE;
    if (typeof rotation == "undefined") rotation = body.GetAngle();
    body.SetPositionAndAngle(
      new b2Vec2(x / box2d.SCALE, y / box2d.SCALE),
      rotation
    );
  },
  createDistanceJoint: function (world, options) {
    if (typeof options != "object") options = {};
    if (!options.body1 || !options.body2 || !options.point1 || !options.point2)
      return;
    options.collideConnected =
      typeof options.collideConnected != "undefined"
        ? options.collideConnected
        : false;
    var jointDef = new b2DistanceJointDef();
    jointDef.Initialize(
      options.body1,
      options.body2,
      new b2Vec2(
        options.point1.x / box2d.SCALE,
        options.point1.y / box2d.SCALE
      ),
      new b2Vec2(options.point2.x / box2d.SCALE, options.point2.y / box2d.SCALE)
    );
    jointDef.collideConnected = options.collideConnected;
    return world.CreateJoint(jointDef);
  },
  createRevoluteJoint: function (world, options) {
    if (typeof options != "object") options = {};
    if (!options.body1 || !options.body2 || !options.point) return;
    options.collideConnected =
      typeof options.collideConnected != "undefined"
        ? options.collideConnected
        : false;
    options.enableMotor =
      typeof options.enableMotor != "undefined" ? options.enableMotor : false;
    options.motorSpeed =
      typeof options.motorSpeed != "undefined" ? options.motorSpeed : 0;
    options.maxMotorTorque =
      typeof options.maxMotorTorque != "undefined"
        ? options.maxMotorTorque
        : NaN;
    options.enableLimit =
      typeof options.enableLimit != "undefined" ? options.enableLimit : false;
    options.lowerAngle =
      typeof options.lowerAngle != "undefined" ? options.lowerAngle : 0;
    options.upperAngle =
      typeof options.upperAngle != "undefined" ? options.upperAngle : 0;
    var jointDef = new b2RevoluteJointDef();
    jointDef.Initialize(
      options.body1,
      options.body2,
      new b2Vec2(options.point.x / box2d.SCALE, options.point.y / box2d.SCALE)
    );
    jointDef.collideConnected = options.collideConnected;
    jointDef.enableMotor = options.enableMotor;
    jointDef.motorSpeed = options.motorSpeed;
    jointDef.maxMotorTorque = options.maxMotorTorque;
    jointDef.enableLimit = options.enableLimit;
    jointDef.lowerAngle = options.lowerAngle;
    jointDef.upperAngle = options.upperAngle;
    var j = world.CreateJoint(jointDef);
    return j;
  },
  createPrismaticJoint: function (world, options) {
    if (typeof options != "object") options = {};
    if (!options.body1 || !options.body2 || !options.point || !options.axis)
      return;
    options.collideConnected =
      typeof options.collideConnected != "undefined"
        ? options.collideConnected
        : false;
    options.lowerTranslation =
      typeof options.lowerTranslation != "undefined"
        ? options.lowerTranslation
        : 0;
    options.upperTranslation =
      typeof options.upperTranslation != "undefined"
        ? options.upperTranslation
        : 0;
    options.enableLimit =
      typeof options.enableLimit != "undefined" ? options.enableLimit : false;
    options.motorForce =
      typeof options.motorForce != "undefined" ? options.motorForce : 0;
    options.motorSpeed =
      typeof options.motorSpeed != "undefined" ? options.motorSpeed : 0;
    options.enableMotor =
      typeof options.enableMotor != "undefined" ? options.enableMotor : false;
    var jointDef = new b2PrismaticJointDef();
    jointDef.Initialize(
      options.body1,
      options.body2,
      new b2Vec2(options.point.x / box2d.SCALE, options.point.y / box2d.SCALE),
      new b2Vec2(options.axis.x / box2d.SCALE, options.axis.y / box2d.SCALE)
    );
    jointDef.collideConnected = options.collideConnected;
    jointDef.lowerTranslation = options.lowerTranslation / box2d.SCALE;
    jointDef.upperTranslation = options.upperTranslation / box2d.SCALE;
    jointDef.enableLimit = options.enableLimit;
    jointDef.motorForce = options.motorForce;
    jointDef.motorSpeed = options.motorSpeed;
    jointDef.enableMotor = options.enableMotor;
    var j = world.CreateJoint(jointDef);
    return j;
  },
  createPulleyJoint: function (world, options) {
    if (typeof options != "object") options = {};
    if (
      !options.body1 ||
      !options.body2 ||
      !options.groundAnchor1 ||
      !options.groundAnchor2 ||
      !options.anchor1 ||
      !options.anchor2
    )
      return;
    options.collideConnected =
      typeof options.collideConnected != "undefined"
        ? options.collideConnected
        : false;
    options.ratio = typeof options.ratio != "undefined" ? options.ratio : 1;
    options.maxLength1 =
      typeof options.maxLength1 != "undefined" ? options.maxLength1 : 1;
    options.maxLength2 =
      typeof options.maxLength2 != "undefined" ? options.maxLength2 : 1;
    var jointDef = new b2PulleyJointDef();
    jointDef.Initialize(
      options.body1,
      options.body2,
      new b2Vec2(
        options.groundAnchor1.x / box2d.SCALE,
        options.groundAnchor1.y / box2d.SCALE
      ),
      new b2Vec2(
        options.groundAnchor2.x / box2d.SCALE,
        options.groundAnchor2.y / box2d.SCALE
      ),
      new b2Vec2(
        options.anchor1.x / box2d.SCALE,
        options.anchor1.y / box2d.SCALE
      ),
      new b2Vec2(
        options.anchor2.x / box2d.SCALE,
        options.anchor2.y / box2d.SCALE
      ),
      options.ratio
    );
    jointDef.collideConnected = options.collideConnected;
    jointDef.maxLength1 = options.maxLength1 / box2d.SCALE;
    jointDef.maxLength2 = options.maxLength2 / box2d.SCALE;
    var j = world.CreateJoint(jointDef);
    return j;
  },
  createGearJoint: function (world, options) {
    if (typeof options != "object") options = {};
    if (!options.body1 || !options.body2 || !options.joint1 || !options.joint2)
      return;
    options.ratio = typeof options.ratio != "undefined" ? options.ratio : 1;
    options.collideConnected =
      typeof options.collideConnected != "undefined"
        ? options.collideConnected
        : false;
    var jointDef = new b2GearJointDef();
    jointDef.bodyA = options.body1;
    jointDef.bodyB = options.body2;
    jointDef.joint1 = options.joint1;
    jointDef.joint2 = options.joint2;
    jointDef.ratio = options.ratio;
    jointDef.collideConnected = options.collideConnected;
    var j = world.CreateJoint(jointDef);
    return j;
  },
  setContactsListener: function (world, options) {
    if (!options) options = {};
    var listener = new b2ContactListener();
    if (options.beginContact) listener.BeginContact = options.beginContact;
    if (options.endContact) listener.EndContact = options.endContact;
    if (options.preSolve) listener.PreSolve = options.preSolve;
    if (options.postSolve) listener.PostSolve = options.postSolve;
    world.SetContactListener(listener);
  },
  setContactFilter: function (world, options) {
    if (!options) options = {};
    var filter = new b2ContactFilter();
    if (options.shouldCollide) filter.ShouldCollide = options.shouldCollide;
    world.SetContactFilter(filter);
  },
  setDestructionListener: function (world, options) {
    if (!options) options = {};
    var listener = new b2DestructionListener();
    if (options.sayGoodbyeFixture)
      listener.SayGoodbyeFixture = options.sayGoodbyeFixture;
    if (options.sayGoodbyeJoint)
      listener.SayGoodbyeJoint = options.sayGoodbyeJoint;
    world.SetDestructionListener(listener);
  },
  rayCast: function (world, callback, point1, point2) {
    world.RayCast(
      callback,
      new b2Vec2(point1.x / box2d.SCALE, point1.y / box2d.SCALE),
      new b2Vec2(point2.x / box2d.SCALE, point2.y / box2d.SCALE)
    );
  },
  syncStage: function (world) {
    var b = world.GetBodyList();
    var sprite, position;
    while (b) {
      sprite = b.GetUserData() || b.sprite;
      if (sprite) {
        position = b.GetPosition();
        sprite.x = position.x * box2d.SCALE;
        sprite.y = position.y * box2d.SCALE;
        sprite.rotation = b.GetAngle();
        sprite.dispatchEvent("box2dsync", { target: sprite });
      }
      b = b.GetNext();
    }
  },
  hitTest: function (b1, b2) {
    if (!b1 || !b2) return false;
    var c = b1.GetContactList();
    while (c) {
      if (c.contact.IsTouching() && c.other == b2) return true;
      c = c.next;
    }
    return false;
  },
};
var TTLoader = {
  endCallback: null,
  loadedData: null,
  landscapeMode: false,
  skipPlayButton: false,
  create: function (callback, landscape, skipButton, disableLogoLink) {
    TTLoader.endCallback = callback;
    TTLoader.landscapeMode = landscape;
    TTLoader.skipPlayButton = skipButton;
    document.getElementById("progress_container").style.background = "#fff";
    document.getElementById("progress_container").style.zIndex = "1000";
    var c = document.getElementById("progress");
    c.setAttribute("valign", "top");
    c.style.verticalAlign = "top";
    c.style.background = "#fff";
    var d = document.createElement("div");
    d.setAttribute("id", "tt_load_progress_cont");
    d.setAttribute("align", "left");
    d.setAttribute(
      "style",
      "padding: 1px; border: 2px solid #e44d26; background: #fff"
    );
    var d2 = document.createElement("div");
    d2.setAttribute("id", "tt_load_progress");
    d2.setAttribute("style", "width: 0px; background: #e44d26;");
    d2.innerHTML = "&nbsp;";
    d.appendChild(d2);
    c.appendChild(d);
    var d = document.createElement("div");
    d.setAttribute("id", "tt_load_play");
    var button = new Image();
    button.setAttribute("id", "tt_load_button");
    button.src = TTLoader.buttonDisabledSrc;
    button.style.visibility = TTLoader.skipPlayButton ? "hidden" : "visible";
    d.appendChild(button);
    c.appendChild(d);
    Utils.addEventListener("fitlayout", TTLoader.setSizes);
    TTLoader.setSizes();
  },
  setSizes: function () {
    var rect = Utils.getWindowRect();
    document.getElementById("progress_container").style.width =
      rect.width + "px";
    document.getElementById("progress_container").style.height =
      rect.height + "px";
    var c = Utils.globalScale * Utils.globalPixelScale;
    document.getElementById("progress").style.paddingTop =
      Math.floor(c * (TTLoader.landscapeMode ? 120 : 200)) + "px";
    document.getElementById("tt_load_progress_cont").style.width =
      Math.floor(c * 200) + "px";
    document.getElementById("tt_load_progress").style.height =
      Math.floor(c * 12) + "px";
    document.getElementById("tt_load_progress").style.width =
      c * TTLoader.progressVal * 2 + "px";
    document
      .getElementById("tt_load_button")
      .setAttribute("width", Math.floor(c * 65) + "px");
    document
      .getElementById("tt_load_button")
      .setAttribute("height", Math.floor(c * 29) + "px");
    document.getElementById("tt_load_button").style.marginTop =
      Math.floor(c * 30) + "px";
  },
  progressVal: 0,
  showLoadProgress: function (val) {
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    TTLoader.progressVal = val;
    TTLoader.setSizes();
  },
  loadComplete: function (data) {
    TTLoader.showLoadProgress(100);
    TTLoader.loadedData = data;
    var b = document.getElementById("tt_load_button");
    var event = "click";
    if (Utils.touchScreen && !Utils.isWindowsPhone())
      event = Utils.getTouchStartEvent();
    Utils.bindEvent(b, event, TTLoader.close);
    Utils.bindEvent(b, "click", TTLoader.close);
    b.style.cursor = "pointer";
    b.src = TTLoader.buttonSrc;
    b = document.getElementById("tt_load_progress");
    b.style.background = "transparent";
    b = document.getElementById("tt_load_progress_cont");
    b.style.border = "2px solid transparent";
    b.style.background = "transparent";
    document.getElementById("tt_load_button").style.display = "block";
    if (TTLoader.skipPlayButton) TTLoader.close();
  },
  close: function (e) {
    clearTimeout(TTLoader.animateTimeout);
    TTLoader.endCallback(TTLoader.loadedData);
  },
  buttonDisabledSrc:
    "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRGOTNDRkRBRDlFQjExRTNCODI2OTVDQ0I1QjQ3QTUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRGOTNDRkRCRDlFQjExRTNCODI2OTVDQ0I1QjQ3QTUzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEY5M0NGRDhEOUVCMTFFM0I4MjY5NUNDQjVCNDdBNTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEY5M0NGRDlEOUVCMTFFM0I4MjY5NUNDQjVCNDdBNTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCABQALQDAREAAhEBAxEB/8QAkgAAAQQDAQAAAAAAAAAAAAAABwAEBQgCAwYBAQEAAAAAAAAAAAAAAAAAAAAAEAABAwICBAYLCQwIBwAAAAABAgMEAAURBiExEgdBUXGRIhNhgTJSkpPTFFWFF6Gx0eFCIzMVRWJygqKyU7N0lMR1RsFDNGWVNidHwnMkVBYmVhEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AtTQc3mjPdrsTyYKW3LheXUdYzbI2Bc2McOsdWohDLf3ayBxY0HCz95ebnVq2X7fbknuWmm3JriewpxRZbP4IoGB3i5zH20z/AIePK0GPtGzp6ZZ/YB5WgyTvEzmftln9gHlaDajP2cla720PV6fLUG5Gds4q+3Wx6uT5agcIzZnBX8wNj1any1BvRmHOStWYmx6sT5ag2pvOdFfzG1/hg8tQZ/Wmdf8A6Rr/AAweWoMVXjOif5kaPqweWoNK8wZyTrzE2fVifLUGleas4J/mBs+rU+WoNC86ZwT9vNn1cny1BoXn3OSftto+r0+WoNKt4mcx9ss/sA8rQee0bOfpln9gHlaDY1vFzkFhRvEdQHyFwMEnlKXcaCete9e4sJ275Bakwk4l64WsrWWk987EcHXbI4VIKsKAiwJ8K4Q2psF9EmI+kLZfaUFIUk8IIoN9BAZ4zKvL9hclR0B64yFoi2yOdTkp47LYOrojuldgUAVlyDHD7ZfVIeeX1tynq+klP8K1fcjU0jUlPZxNBCv3FQJCOiOc89A1VcXfzh56DAXNZOAdOPFjQbEXB7Hu1c9A6auD2jpq56B8xcHdHzh56CRjzXtB2zz0EixNeGGK1aezQP2Zruj5xXPQOROcw+kVz0Gh2a7gfnFc9BHyLgsKCS7gpeOwkq0qw14DhwoI5+e9p+cVz0EdJuLiElSnSlOOG0TgMaBk9cHtOLiuegaOXB7v1c9BgLi7jh1hx4saDY3cngfpD26CSg3JaXEuIUW3UnFLiThp7Wqg7LJGYzZLywU4N2a7vpjz4w0Nx5zv0MhtI0IS+RsOJGjawPDQGagGO9WWs5gs0fHoRY82YBwdYEJZQeVIdVQCy4PHuQdWk8poIZ5w40Gdrjqm3WFDGkyJDTeH3ygKCz10yXlS6IKZ1qjO4/LCAhfF3aNlfu0A+zHuJYKVPZcmFpY0iFKO2g9hLgG0ntg8tAL7jbLraJyoNzjLiykf1a9Sh3yFDoqHZFBkw9gQTqGk8g00BbyFu4yvccrQbleIPnU+YlTrjq3HRoUo7ICUqSkDZw4KDlsx2622fN9yt9sZ82hMIj4MhSlDbWjbUrplRx00GDT+ig3+c6NdBqckDTicANJJ1ADXQStoyK9fMpXC+KQUXKQA5YQdCm2o52knTqL6scexhQcUuV1yEugbPWDHZ4laintK0UBD3WZSytdrMu6TmvP7ntORpLT+BbYOkbLTeoYoIO0dPFhQDTNthk5dvkm0vYqQydqI6f6yOo4oVyjUaCAccwxJOjhoDRu+3ZWO5ZHacvkTblT1qkNPAlDzSD0W9lQ7A2sDo7FALM1WyHZ8yTrXCkLkx4jnVh1wAK2gOkk4a9k6MaBtGdOIoJ1DhdtNwbxIPmrjiTwhbGDyFcoU2KA+/Wzn/in1ph855l5zh911PWUA/wB6xwzRB/hs38tqgFk46TQRbmugn93Mfr882VOGOxIS4fwOl/RQWeeX1bS194kq5hjQBjKu/CWzMVEzG2HoxcUlM5pOC0Da0baBoUB2NPLQE282TLucLIlD+xJiup24stojbQTqW2vgPGOegAGaMuXHLdzets3pdEqjSAMEutnEBQ7PGOOgsLlFkM5XtLQGGzFZH4goA/ntZRnu8Y/KLHMGU0EYh/s0GzzjRroHFptjt+u0WztkhMlWMpwfIjo0uHlV3I5aA9MMNMMtsMoDbLSQhtCdASlIwAHIKAD7ybCbJmV/q07MG44yo2GpKzoeR4XSoMN2WahZMzJafXs2+57LEjHUlwfROf8ACewaAi72MmG/2PzyIjG6W4KcZw1uN61t/wBI7PLQBvIOUnsz5iaiKSUwWCHZ69WCEnuOVR0UFhsx3iJl3LkmeQlDcRnBhvgKsNltAHLh2qCq7z7siQ5IeUVOvLU44o6ypRxJoN8c6RQTkUnzGf8Aqcn9CqgOeP8Apz6q/daDj96/+aIH8Nm/ltUAsm6zQRjms0HX7oGwvP0EnTsIcVzINBYuWMYjw421e8aCor4wkPJ4nFD3aAvbhU35SZrhdIsadCGVDEF48KOLRroJDfrOtqbXBhLQldxW51jS/lNt4YK8I+9QEHL2H1DbsP8AtmvyBQBnegjqc7zFag82yrmbAoOaS/2aDPzjRroCvuisnVW6Renk4PTT1UcnWGGzwffL96gb58zq7bs42eIy4pMeGsOzkJOAWHejsq+9TiaCb3l5dF9yw4uOAqXD/wCpiqGnEAdJI++TQV3cWeRQ5wRQWE3W5uF/y62h9eNwggMyAdagNCV9sa6DobRl+02hUtVvYDJnPKkSMOFauLiA4BQB3fZnET7gjL8RzGNDO3KI1Kd1Yfg0AwGugcx9YoJyL/YZ36nJ/QqoDn/tz6q/daDkN6/+aIH8NmfltUAsm6zQRjms0HZbmyBnyL/ynPyaCxbidptSe+BHOKCveXt1d5v95kuvAxLMmQvakq1uJCtOwKAm3fOWTsi2hFthlLjzCdlmG0QpRVxrI4+GgBV/zDcL7dHrlPXi64eij5KEg6Eigs1lZwOZctqxqMdv3EgUAp32xizmCHJwwS+xs49lJNAPUyE44A4niGk+5QPIkWXJnRofVrQ5KUlLYUkgkE4YigstbobNttjERGCWorSUaNXRGk0Fbc2XdVyzDcJmJO28rY5EnAc1AesgXcXbKUCQo7Sw31TnKjo+9QBHejlo2HM73VJ2YU3F6PxAnuk9qgmNw72zmmY3+cj+8QaAw5vny4GWLlMiKCJLLKlNqPAdWNBVVbzjzinnVFbrpKlqOsk0GI10DqPrFBORP7DO/U5P6FVAc/8Abn1X+60HIb1j/wC1W4H5Vumgcu00aAXzknE0EU6NNB1m6Nexn+AO/S4PxSaCyVBXfP2fs1OXy42huaY8CK8ppCGAGypIPCRQcISSoqUSpZ7pSjiTyk0Hisdg8hoLR7vZAkZLtLg/MJHNooPc0ZItGZXoq7ntqbi47DaDs4lXGaDO2ZHypbAPNbcylSdS1jbPOrGgZ3ax26Vm+zTEBBkRA4VJTh0UpGKSQOzooJHN8/zHLk18KCFlvq0KUcEhTnRGJ4tNAN7LuLcdSh68XLHb6Smo40Ha090aAj5dy/ZMtRU263ktodVtBta9olQGkgGghN6+Vvr3KzymUYzoPz8cjWdnSpPbFAL9xzmGdiNW3FXo7INAas6o28p3ZPHGc9wY0FVG+4HJQZigdxk6aCcjjZt89R1CHI91pQoDlh/p1h/dX7rQcvvogOIVabwnQ1HdXEkL4EJlpCW1q+5DqUg8tAMZKA8lSkjBSTg62daFDQQRQRLzBx1UEhlC5s2TM8C6yEqVHjLJeDYxVsqBGgcNAW5W/bLSAfN4cp9XANlKRzk0AYvUv6yvM64hstCY8p4NE4lIUdAJ4aBn1J4qDzqTxUBIypvcVl/LUW0C2KkvRgpIeLgSggkkaMCeGg8n7782v4iJGjxBwHAuH3aDmrjn3OtwxEi6vJQdaGcGx+LhQdHuvzpYMvKnvXlx9UyUpIQ6Ul0bCRx44440EnvQ3i2K/ZcTbbO+txx55JfBQpGy2nTjicOGg5t7evnVVtYgMPtxksthsvoRi4vZGG0SrHA0EPZs0XmDmSJfJMp6W6w4Ou6xRVtNK0LTgexQGm474skRmjsSHJiin6NltRxxGrpbIoBVlHM1mtGfXr4thyNany71bCBtqbDmrHsY8WqgKd13mZHuNjnMIuISt6O4lKFoWCSUkAYYUFfEMkJGI00GxLBx1UD6JGUVAAYnioJFTTkpoWyJ0pE9xEFvDSC4+cCORDYUpRoLFfV7X1L5lh8z1PVYfcbOx71B5mCyxLxapECW2HWJDam3WzwpUMCMfeoK95ky/cLDM82uDhbUOhDu6ui1IQNCUPq1NPpGg7XRXrxx1hDyE3Rr6VvHHSFFGgjjBGg0DUvSce4Hg0HnXSO8Hg0C66T3g8GgXXSe8Hg0C66T3g8GgXXSe8Hg0C66T3g8GgXXSe8Hg0C66T3g8GgXXSe8Hg0C66T3g8GgXXSe8Hg0C66R3ifBoF10nvB4NB510jhQnwaD3rpHeDwaDNDssnBLYJ+9oHZEpCEeeumM05oQ2E/OOE/JbaT03CeIdvCgKe7HIslEtu+XJgxltoU3boKiCphtzu3HSNBfdA6WHcp6NAV9kbOzwYYYUHtAwullgXJlbMlpLiFjBSVAKBHEQdBoOEmblrN1ilW51+3hRxLcV5bbfgYlI7QoGh3Lf3rP8efgoPPYqPSk7x/xUC9io9KTvH/FQL2Kj0pO8f8AFQL2Kj0pO8f8VAvYqPSk7x/xUC9io9KTvH/FQL2Kj0pO8efgoF7FR6UnePPwUC9io9KTvH/FQL2Kj0pO8efgoF7FR6Un+P8AioF7FU+lJ3jz8FAvYqPSk7x5+CgXsVHpSd4/4qBexUelJ/j/AIqDNG5dOPSuk8p4R5wR7woOiy7uwy5ZnfOGo6VSj3Ulwlx48riypXNQde22htISgBKRwCgyoP/Z",
  buttonSrc:
    "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ0MkY2NjRBRDlFQjExRTNBNzU1REY3NjZERUJEODBBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ0MkY2NjRCRDlFQjExRTNBNzU1REY3NjZERUJEODBBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDQyRjY2NDhEOUVCMTFFM0E3NTVERjc2NkRFQkQ4MEEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDQyRjY2NDlEOUVCMTFFM0E3NTVERjc2NkRFQkQ4MEEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCABQALQDAREAAhEBAxEB/8QAwwAAAQUBAQEAAAAAAAAAAAAABwADBAUGCAECAQABBQEBAAAAAAAAAAAAAAAGAAIDBAUBBxAAAQMCAgQFDggKCAcAAAAAAQIDBAAFEQYhMRIHQVGRIhNhcYHRMpJTk+MUFUVVF6FCUmJyI3SUsYKyM7OExIWVJvDBonMkNDZGwkNj0yVlFhEAAQMBAwYLBwQCAQUAAAAAAQACAwQREgUhMUFRkVJhcYGhscHhMhMVBvDRIkJyFBZigqJDIzQk8ZKyM2P/2gAMAwEAAhEDEQA/AOqaSSz+Zc62uyOohhDk67Op22bbHwLmxq6RxSiENN/PWQOKqlXWxU7b0hs6SrdNRvlyjI3X7Z1i5u8bNLilbDkCAk6m0IclrT1CsllB7Aoek9SPJ+BmThK24sDbZltPN71CO8DNw9aMfcfK1H+QT7jedT+Rxex7F57wc3+1GPuPla7+QT7jedd8ji9j2L0bwM3H1ox9x8rXPyCfcbzrnkcXsexOJz1m5XrVn7j5auH1FPuN5004LHq5+xPIznm1Xrdn7h5amH1JPuN2lMOER6v5dieRmvNqvXLX3Af96mn1NPuN2lRnCo9X8uxOpzFm9Wq9M/w/y1N/KJ9xu0ppw2PV/LsTgvmcT67Z/h/lq5+VT7jdqb5fHu/y7F9emM5e3GP4f5auflU+43aufYR7v8uxeG95xHrtj+H+Wrv5VPuN2rvl8e7/AC7E2rMOb0670z/D/LV38on3G7SnDDY93+XYmlZpzan1y0f1Dy1OHqafcbtKcMLj1fy7EyrOObU+t2T+oeWpw9ST7jdpTxhEer+XYmVZ5zcn1syf1Hy1OHqKfcbzp4waPVz9iaOf83D1ox9x8rTvyCfcbzp4wSP2PYvPeDm72ox9x8rXfyCfcbzpeRxex7E43vAzaFAm5xlAfFXCISeuQ9jXPyGfcbtXDgkfsexXVt3oTWQFXmEh6INLs+2la+iHynYyx0oSOFSNrCtCk9QRvN2QXDzbVn1GDFvdPIffm6FvoU2HOiNTIbyJEV9IWy+0oKQpJ1EEaK3wbVivYWmwiwp6upqo85ZhVYrG5KZQHpzykxrfHOpyS8dlsH5oPOV1AagqqhsMZe7M0KzSQeK8N0aeJB6Q8WA8lT5ffeV0txnK/OSXuFavmjU2jUlPZrz2WV87zI/OeYakb00AYBk7PbSdKqH7koEhHNHKeWpWxK82NRVXJ0YkuEAazjUvhBSCIak0i8JWcEP7SuLa08ld8MJ7qctzhPouD2Pdq5a4YlEYwpTVwd+WeWojGmOjCmsz3dHPPLUTo1C6MKwYlvYDnnlqFzAoXMCnNS3dGKzy1CWKEsCmNSnPlnlqIsURjCfEpeHdnlpl1M8Mak05Kc+WeWnBicIwoL84hSUF3Ba8dhBUAVYaTsjhwqVrFM2LTYoT0135Z5amaxStjCr5VyLSCtx7o0Y4bajgMTwYmpmxqdkNpsAtKhvXB4Y4rVy1M2NStjCiOXF7wh5akEQUgjCbFzc2tnpTtYY7OOnDjwp3hBO8IZ7E63cnse7PZppiCaYwrGFcVBaVpVsOA4pWnRp/qqtJEoXx5OBazJd/NmvDKRgiz3V4MTI40IYmuY9E+2kaEJfI2HEjRt4HhNbmA15a7wHnJ8vu9yHMVogW3hnGbi0jk0cCLtFqGEOt50lRvNnYx5kdmZMA/wColCWknsB1VDnqR58Jrd5y3sFjBJPCB1oZXB4jmjg0nrmh2JqL4wqV9041da1WgErewqbdIMIDHzqUy0RxgrGPwVKxlrgNZC6X3GufutceZdKXbJ2Vrs2UXC1xn8dG2WwlfYWnBQ5aLJKaN/eaF5rT4nUwm1j3DlybMywGYNxzQQp7Lc1TKxpEGYS40eolzu0dnGsyfCAcsZ5CiGk9T2mydv7m5DyjMeZDiZBudqnGBdIy4c1Onol6QoD4zaxzVp6orDmhcw2OFhRGx7JGX4yHs1jrGgp5h4AhStQ0nrDTVRwUbmonZE3d5YuOVoFzvEETLhNR07rrjjmpZJSkJCgkAJw4KKKDD4TE1zmgkobxbGqiKodHE66xmTIBo5FnL7bbdaM3XGBbGfNoTLUfBhKlKT0i0lSlDaJwOBFD+NRMZNdaLBYtSlnkmpmPkN55LsvAvW3qxS1ItTvT6KbdTbqbcfGkk4AaSTqAGs04NXQ1TbTkZ6/ZVuF8UnYuckBzLxVoUy1HO02ep5woEq+bhRdQ4UDSm8PieoKjFRT1LIc8bcknCXZ/+zRw2rKiWJDKHwNjpRiUHRsq1KSfoqBFDoZZkWo6O4S3V7dC2+67KmWbraVXie35/dtp2NJbkYFuMRoKGWu5AKSDtHnHjoswqlhMd6y12lYeO4hPDJ4UZuR5HAjO7hcePRmQ6zLZJOXb1Jsr20ptg7cF5X/MirP1Zx40dyayKqm8KQt0aEQUtS2pibM35u8NTtO3OFSOu4AlRwSBio9QVGArQCLu7/dnY7nkdl2/QguZcVqloeBKH2kL0NBCxgoYJ04aq3qOhY6H4hlOVC2L43LDVFsLvgYLpGdpOm0caGmZbdFs+ZJ9qhyVyo0NYbD7oAXtYYqQcMAdjVjWPURBj3NBtARHSymWFkjgGueLbBm4Dy6k3FeOIqk9qc4K8S4XLXOTjgRGW4k8S2MHUK64UgVTtLJGuGcOCzqllo5exHX0kv8A+d9IYc/zXp8Or0e3Xo97JagLw/8AJd4Vg955/mKB9gmflNUN+o+6z6upbuB6fqHWhlOJxNYkSLWKodOk1barAV3u+j+cZ5sqNYRI6U/iJJqxTC2Vg/UqmJvu0sp/TZtXSrithtS/kgnkFFrjYLV5m0WmxB3LG+yWzLXFzI2l2KXFpRPYTgptO0QOkbGsAcKawKbFnZ3i1p2hGld6ajcLYDddZ3TmPEdHKiTebJl7N1lS3I2JUV0dJFltEbSFHU40saj/AENa0kUdQzWDmKGqaqnopTZ8Lhkc06eAhAnM1guOXZ0i2zTtno1KjSQMEvNEEBY4lDUocdCVZTuicWu/6hHlHUx1DWyMzWi0bp1e5H7K7IYy3bGgMAiK0MPxBRfSCyJv0hef4g69UPP6j0oT50UUZ4vBPxvN+QMihDGMtS7k6EX4b/qR/u/8lAQ/1ayS1WS1OdPo11y6m3U7b7a7fLpGs7ZIRKVtS1j4kZGlzsq7gderuH0vjTBujOU2WcU8bpT8ub6jm2Z0b2WmmWkMtJCGm0hDaE6AEpGAA6wr0ACwWBALnFxJOcoIbwbGbLmSQG07MG5Yy42GpLh0PoHZwV2aEMVpvDmtGZ2X3o7wqq8enBPfZ8J4vlPUvjdzmYWXM6W3l7NvumyxIx1JeGhpz/hNPwyq8KSw913ToXcXovHp8nfjyji+Yda329PJyr9ZBLhoBu1uCnI/G42R9Y1+MNI6tbeJ03iMvDvNQ/gOIiCW48/45M/AdDvbQhBkbKruaMwNQyki3sEPXFZ0YNpOhv6SyMKw6SHxnhozZzxdqL8RrRSRF57+ZvHr4hnXQOYbvEy/l+VcFgIaiNfVNjUVAbLaAOvgKJqmYQxl2rN1Lz6ipnVM7WaXHL1lcvrfeffckPq2n31qddUeFSziaE8unOvTiAMgzDIOIKVFOkVC9RuV7HP+Bm/ZJH6JVUJM44x0qjUZtiNn+x/3d+z16J8nIgL+793WsjvQ/wBQwPsEz8pqh71H3WfV1LYwPT9Q60Mp2s1ixouYql3WattVgLV7pWwvPsIn4jbqv7NWKT/Yj4z0LLxx1lI/k6V0HJGMd0fMV+CiqTuniXnsfeHGuT3U7L7yeJxY/tGgqE/AOJernKizuLTfFJmr6Uixp0NsqGIL50lSOLRrrXwi/wCI4DuDP9XB1oV9TmKxto/y6/08PUp+++bbxaocNaEruC3C4yv4zbeGCu+1VzHpGkNZ8+U8Q7VB6Yjffc/5M3Gexb+x4ehoOHgG/wAgVtUhtiaf0hD1X/7XfUelCLeQnoc6S1ag60yrkRhQniw/5LuJvQjHBzbSt4C7pWfS/wBWs0tWgWr7840a65dXLqJm6uz9FAfvLqcHZp6NgnWGGzwfSXiaKMBp7GGTezcQ7UMY/U2vEQzNynjPuCYzvnB235ttERlwpjxFh2clJwCw7zAlX0UkqpuJYiY52tHdZldy9ikwvDhJTPcR8T8jeCzL05Fcbxcv+m8tOKjgKmQ/8TEUNOOyOckfSTV3FYPEhvNztyj24lRwar8Cex3dd8J6thQBdc2knWD8IIoYaARwFHzRYUet2eaxfsvtpfWDcIQDMkcKgNCV9ka6J8Lq/EZcd32c40FAeN0HgTWtHwPyjrCvrTYbVaVS1QGAyZrypEjD4zitfWHUq7DTsjtuiy8bVn1FZJNdvm24LBxIR7583CdPRYIi8Y0NW3LI1Kd4E/i1gYjVeLJdHcZzu7OlF/p6g8OPxXd5+b6e1DUa6ooiUuNrFRPUbleR/wDIzfskj9EqqEmccY6VRqM2xG7/AGP+7v2evQ/k5EBf3fu61kd6H+oYH2CZ+U1Q96j7rPq6lsYHp+odaGU7WaxY0XMVS7rNW2qwFrt0JAz1G/uXPhFS05sqI/qPQsnHf9R3GF0GtO0hSeMEctFzxaCF56DYUArBuwvF9vMpx4GJZ0yHNqQrunEhRxCBQZQwyTNDWZLM7jmHFrPMF6BWYzFAwfNJYMnvRIu2cMo5ItKLdEKXHWU7LMNohSirjWRx8Naxr4adnhQfG4bLdbnexQ3Dh9TXSeI/IDpPUglfcwT73cXrjOXi653KB3KEA6Eisd4c60uN5zs593ANCNaamZCwMZmC6Ry04HMv25Y1GO3+SKKcMfepmH9IXnFc2yd4/UUMN8bBZv0OThoeY2ceqkmsDF22VPGwdJRR6efbAW6nLBiUnHDaxPENJ+Cs1zbMpW7cUyLHkyZkeIG1ockqSlsKSQSCcMRURILTdNujlKje4NaXaAuiIERm325iK3glqM2lA4sEjSaPYIxDEG6GheczSGWQuOdxXPOabqq4364S8cdt1QR1k6E/AKCS7xSXn5yTyaOZeiUcPhxNbqCOGRbsLrlaDJJ2lhvonPpI5v4KKcIn8SnAPeb8J5OxA2KweFUOHDbtQY3mZeNjzK6G07MKbi9Hw1AnSpPLWBND4Uro9Ayt+k+4o0wir8eAE95uQq13HP4Znmt+Ej44dY41Zw42VTeFrlT9SN/44OpyLebJ0qBlu4zIqgmQyypTajwHjrbxSZ0dO5zch7bEJYfE2SdjXd0lcvqdceUp51RW66StxZ1kmhprQ0WDMF6dZZkCQ10klLjaxUT1G5Xkb/Izfskj9EqqEuccY6VRqM2xG7/Y/wC7v2evQ/k5EBf3fu61kd55/mS3D5UGaB19po0O+pO6z6upbGB5jxjrQ0nJOJrEiKLWKoeGk1carAWn3UubGfIA+WhwfBjT2myWM/8A0HOszGxbSOXRVGa86XP2es9ZpevlxtTc0x4MV4tIQwAgqT1SKCHPdOL0jiRafhzNyHUM/KvQcNw2BsTX3bXOFuXKsSdKipRKlnulqOKj1yaeAALBkC2V4snYVhxGujOkF0xkCQJGTrU4OFhI5NFbmButpgN0uGwrzbFmXal44V9ZmyZacxuxlXHbUiNiUtoOziTxmpK3DBUPDrxbYLMi5RYlJTAhlnxL7tuS8r20Axbe0lQ+OobR5VY02LB6ZmUtvHW429K5NidRJ3nFRLpZrdKzXaJaNgyIocKkpw0JA5pIHVrPqYopK2Lwy39QH6credTwVL2U0jTbY6xT82TvMsvzHgoIWUdGhSjgApfNGPLV/G6jwqVx0nJtVbD4r8zRw27EPLNuUddQh673HHb5ymo4wB2tPdGsmmwqaRoNrWMsyfMbOhEVR6kANkbdqIWX7DZcuxk26AS2lw7QbWvaJUBpIBrYo4YaZ1wPtkfrOU2cCHauqlqTffo4FS71MsenMsPKZTjNhfXxzw83uk9kVWxuGxomH9ef6Tn2Z1dwOt8GcA912QoablHv5zI1bcVejqg6RWbTG7UxHhcNrUS+om/8X9wRkzkjbyrdE8cdf4K2sb/1H8nSEHYabKhn1Ll9r82nrVglemnOvtI01wrimxUnEVC8qJyvGebbpyjqER/4WyKz5TlHGOlUpsuThCNuH8j4f+u/Z69F+VAP937utZbfBCcQi2XZOhEd5UZ9fAhMpIQhR6gdSgHr1jeoIC+C8M7De961cCmDXlp09SGz2zIbUtAwUklLzZ7pCxoKSOvQtE9GBaWGw8nCFVPxzjqq416ma5TcrT27NmSDdHkqLEZR6UIGKtlQw0CuvJIFmcOB2FQVsRmhcwZyipJ33ZfQk+bw5LyuAbISOUmtV2NykfDGBxu9wQqz01Ke85oQfuz5uF2m3DYLYlvKdDZ0lIOoE1lRC60N1IvgZ4cbWbosUXoDxU+8pbyXQHipXkryIOVt6jlgy7GtKbcqS7GBSHisBBGOI0a6kp6uaEObHduudbltyWofrcDFRMZC6wHQlO3zZsfxEWPHijgJxWf6q6+tqX55LPpAC7F6ep294lyzk/Oucp+IkXR1KT8RrBA+CqrmB3fLn/USVoxYdTx91gWg3a5wsmX1Tnru4+qXKUkJdILg2AOPr1NST/by3wy8LtmSwWZVn4xh8tQGiOy63kVjvLz/AGW+5fTbbS8tbjzqS+NlSdlCdOOJqetrzUuZ8Ja1lpy2ZTZYFWwbCpYJb8gzDIs89vOzmq3swWH0RkMoDZeQnFxWAwxJOqqgLwwMvu8MZgMmTVaMpWi3Bqa+XkWknkVTacw3iFmGJen5T0p1lY6bpFFW00rQsAatVRuiaB8ADXA2g8I4VbnpI3wujAABHOjDcN7mTmGiEOrlqUnS2ygnHEasTgK2pMcD2XRE42jLbYBw6+hB0WAVLjlAbxoX5UzBarRnl69rZcj2x4ubDKRtqb6TTpw4MeSseIuj8M94xm3jGocXOiiupJJqURWgvyZddiJ103kZMuFlmMNzwlbzC0pQtKgSSnQMMK0sQxZs8Dowx4c7WMm21DMGD1McrXFuQFAZqOoISCMDVMuR0XZU6iOcdVNL1wuVhDiqKgAMTxVXkeoXuU9SVSwm1Ree9OcRCBTpBW8ecPxGgpaqhpojNOxnDaeIKtUu8OMvdk0j24dC6C8zb9F+aYfVdH0eHzdnZ/BXodnwrzy/8dq+b3aYl1tsiDKbDseQhTbrZ+MlQwIpSMvCxKCUscHDQuf8z5buNim9FMdU0oc2JdzzWpCBoSh9Wpt9I0Ha5q9eONA1dhz6dxLBei1aW+8dC9AwzFWSMuvFrdWrs5wqOU7fmNDrQVxLLescYKdBqpHMw5itxkMD+6edQzcblj+aR3hqa+Nam+zi1navDcrj4JHeGu3gu/ZR6ztXnpK4+CR3hpXgl9lHrO1L0lcfBI7w0rwS+yj1nal6SuPgkd4aV4JfZR6ztS9JXHwSO8NK8Evso9Z2pekrj4JHeGleCX2Ues7UvSVx8EjvDSvBL7KPWdqXpK4+CR3hpXgl9lHrO1L0lcfBI7w0rw1pfZR6ztS9JXHwSO8NK8Evso9Z2pekrj4JHeGleCX2Ues7UvSVx8EjvDSvDWl9lHrO1L0lcfBI7w0rwS+yj1nal6RuHgkeLNK+NaX2Ues7V6LlcfBI7w0rw1pfZR6ztTjc+6KICWUE/wB2aaXjWmmkiGk7VO/8mUoE54xWXTglpCT0rh+S20n6xwniFVw++67GLzvbOdCqSSU8WUC8725AiruzyNIjvovNxY83dQgt2+CohSo7a8NtbqhoL7uA2sNCRzRw0W4Rhnggudle7OeocCB8YxQyktBt9tHAEUMBhhwaq3UOJUklEuFqhzmVNSG0rQsYKSoBQI4iDoNMfGHZ1LHM5htCxMvdBYisqgl6ACcSiK8tpHi8dkdgVmT4RDIbXNBWpHjEgz5VGO5+P7RnePPaqDyGn3ApvO3pe56P7Qm+PPapeQ0+6EvO3rz3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549L3PRvaE3x57VLyGn3Ql549e+56P7Qm+PPapeQ0+6EvO3r6TufjY4KuE4p4R5wofgwNIYDT7gXDjT1fWDd3l6zudPHjJ85PdSVkuPK67iypXw1pQ0bIxY0AKjPiMkmQlalCEoSEpGAHBVoBUCbV7XVxf//Z",
};
var ExternalAPI = {
  type: "Spilgames",
  init: function (params, callback) {
    GameAPI.loadAPI(function (apiInstance) {
      ExternalAPI.apiInstance = apiInstance;
      if (!params.noSplashScreen)
        apiInstance.Branding.displaySplashScreen(
          callback ? callback : function () {}
        );
      var logoData = apiInstance.Branding.getLogo();
      if (logoData.image) {
        ExternalAPI.logoImg = new Image();
        ExternalAPI.logoImg.src = logoData.image;
        ExternalAPI.logoAction = logoData.action;
      }
      var buttonProperties = apiInstance.Branding.getLink("more_games");
      ExternalAPI.spilMoreGames = buttonProperties.action;
      if (params.noSplashScreen && callback) callback();
    }, SpilData);
    return true;
  },
  exec: function () {
    var method = arguments[0];
    if (method == "exec" || typeof ExternalAPI[method] != "function") return;
    return ExternalAPI[method].apply(
      ExternalAPI,
      Utils.getFunctionArguments(arguments, 1)
    );
  },
  addLogo: function (x, y, noStatic, parent) {
    if (!ExternalAPI.logoAction) return;
    var img = ExternalAPI.logoImg;
    var mc = new Sprite(img, img.width, img.height);
    mc.x = x !== undefined ? x : 60;
    mc.y = y !== undefined ? y : 30;
    mc.setPropScale(0.5);
    mc.onclick = ExternalAPI.logoAction;
    mc.onmousedown = mc.onmouseup = function () {
      return false;
    };
    if (!noStatic) mc.setStatic(true);
    (parent || stage).addChild(mc);
    return mc;
  },
  getPreloaderURL: function () {
    return "";
  },
  customMoreGames: function () {
    ExternalAPI.spilMoreGames();
    return true;
  },
  showMoreGames: function () {
    return ExternalAPI.customMoreGames();
  },
  setMixer: function (mixer) {
    ExternalAPI.mixer = mixer;
  },
  showAds: function () {
    var mixer = ExternalAPI.mixer || window.mixer;
    GameAPI.GameBreak.request(_pauseGame, _resumeGame);
    function _pauseGame() {
      if (mixer)
        for (var i = 0; i < mixer.channels.length; i++)
          mixer.channels[i].pause();
    }
    function _resumeGame() {
      if (mixer)
        for (var i = 0; i < mixer.channels.length; i++)
          mixer.channels[i].resume();
    }
  },
  getLanguage: function () {
    var lang = (Utils.parseGet().lang || "").substr(0, 2).toLowerCase();
    if (lang && window.I18)
      if (I18.supportedLanguage.indexOf(lang) < 0) lang = I18.currentLocale;
    return lang;
  },
  submitAward: function (name) {
    GameAPI.Award.submit({ award: name });
  },
  submitScores: function (val) {
    GameAPI.Score.submit(val);
  },
};
function LevelSelect() {
  Utils.callSuperConstructor(LevelSelect, this, bitmaps.LevelsMap, 570, 320);
  this.eyes = [];
  this.onadd = this.init;
  this.setStatic(true);
  this.numOfLevel = 1;
  this.unlockLevelsForOlya = false;
  this.isSpilLogo = false;
}
Utils.extend(LevelSelect, Sprite);
LevelSelect.prototype.init = function () {
  this.addTopPanels();
  this.addBottomButtons();
  this.addAnimations();
  this.lastLevel = GU.getLastLevel();
  this.addLevel(-165, -96);
  this.addLevel(-108, -101);
  this.addLevel(-43, -95);
  this.addLevel(20, -99);
  this.addLevel(96, -106);
  this.addLevel(160, -95);
  this.addLevel(205, -51);
  this.addLevel(164, 4);
  this.addLevel(111, -36);
  this.addLevel(47, -47);
  this.addLevel(-9, -9);
  this.addLevel(-74, 8);
  this.addLevel(-117, -45);
  this.addLevel(-176, 3);
  this.addLevel(-132, 49);
  this.addLevel(-89, 98);
  this.addLevel(-20, 60);
  this.addLevel(43, 65);
  this.addLevel(109, 95);
  this.addLevel(174, 67);
};
LevelSelect.prototype.addTopPanels = function () {
  var p1 = GU.addSprite(stage, "panel1_lvlMap", 190, 42, 95, 21, true);
  GU.writeSimpleText(
    p1,
    "num1_lvlMap",
    14,
    22,
    50,
    -5,
    GU.getTotalScores(),
    true,
    { charSpacing: -7 }
  );
  var p2 = GU.addSprite(stage, "panel2_lvlMap", 90, 40, 45, 20, true);
  p2.setRelativePosition(45, 20, "right", "top");
  GU.writeSimpleText(
    p2,
    "num1_lvlMap",
    14,
    22,
    0,
    -5,
    GU.getTotalNumOfStars() + "/60",
    true,
    { charSpacing: -5 },
    "/"
  );
  GU.addSprite(p1, "noise_lvlMap", 176, 22, -2, -2, false, 25).animDelay = 4;
  GU.addSprite(p2, "noise2_lvlMap", 82, 22, 2, -2, false, 25).animDelay = 4;
};
LevelSelect.prototype.addAnimations = function () {
  GU.addTilesSprite(this, "bob_lvlMap", 102, 114, 40, 8, 5, -180, 120, 4);
  GU.addTilesSprite(
    this,
    "monster_lvlMap",
    70,
    80,
    40,
    10,
    4,
    this.isSpilLogo ? 105 : 150,
    140,
    4
  );
  this.eyes.push(GU.addSprite(this, "eye_lvlMap", 12, 12, 203, 62, false, 20));
  this.eyes.push(GU.addSprite(this, "eye_lvlMap", 12, 12, 219, 55, false, 20));
  this.eyes.forEach(LevelSelect.eyeProps);
  stage.setInterval(Utils.proxy(this.eyesInterval, this), 5e3);
};
LevelSelect.prototype.eyesInterval = function () {
  this.eyes[0].play();
  this.eyes[1].play();
};
LevelSelect.prototype.addBottomButtons = function () {
  var galleryBtn = GU.addButton(
    stage,
    "gallery_lvlMap",
    134,
    44,
    0,
    21,
    showGallery,
    { valign: "bottom" }
  );
  GU.addSprite(
    stage,
    "gallery_cover_lvlMap",
    28,
    32,
    galleryBtn.x - 70,
    galleryBtn.y + 5,
    true
  );
  GU.addSprite(
    stage,
    "gallery_cover_lvlMap",
    28,
    32,
    galleryBtn.x + 70,
    galleryBtn.y + 5,
    true
  ).scaleX = -1;
  var menuBtn = GU.addButton(stage, "menu_lvlMap", 52, 28, 40, 15, showMenu, {
    valign: "bottom",
    align: "left",
  });
  GU.addSprite(
    stage,
    "back_btn_cober_lvlMap",
    28,
    32,
    menuBtn.x - 34,
    menuBtn.y + 5,
    true
  );
  this.isSpilLogo = addSpilLogo(this, 190, 140, false, {
    scaleX: 0.8,
    scaleY: 0.8,
  });
};
LevelSelect.prototype.DebugPrint = function () {
  this.objects.forEach(function (obj) {
    if (obj.bitmap === bitmaps.lvlImage_lvlMap)
      console.log("this.addLevel(" + obj.x + ", " + obj.y + ");");
  });
};
LevelSelect.prototype.addLevel = function (x, y) {
  var lvlImage = GU.addSprite(this, "lvlImage_lvlMap", 50, 48, x, y, true, 4);
  lvlImage.index = this.numOfLevel;
  if (this.unlockLevelsForOlya) lvlImage.onclick = LevelSelect.startLevel;
  if (this.numOfLevel > this.lastLevel) lvlImage.gotoAndStop(3);
  else {
    if (this.numOfLevel <= this.lastLevel) lvlImage.gotoAndStop(0);
    if (!this.unlockLevelsForOlya) lvlImage.onclick = LevelSelect.startLevel;
    var numOfStars = ~~(gameSaves.scores[this.numOfLevel - 1] / 1e3);
    for (var j = 0; j < numOfStars; j++) {
      var star = GU.addSprite(
        lvlImage,
        "star_lvlMap",
        14,
        14,
        -16 + j * 11.7,
        13 + j * 1,
        true
      );
      star.setPropScale(0.8);
    }
    var numProps = {
      charSpacing: -2,
      scale: 0.8,
      align: SimpleText.ALIGN_CENTER,
    };
    GU.writeSimpleText(
      lvlImage,
      "num2_lvlMap",
      18,
      28,
      -1.5,
      -4,
      this.numOfLevel,
      false,
      numProps
    );
  }
  this.numOfLevel++;
};
LevelSelect.startLevel = function (e) {
  if (e.target.index === 1) showComics();
  else prepareLevel(e.target.index);
  return false;
};
LevelSelect.eyeProps = function (eye) {
  eye.changeFrameDelay = 25;
  eye.onchangeframe = function (e) {
    if (e.target.currentFrame === 19) e.target.gotoAndStop(0);
  };
};
function Gallery() {
  Utils.callSuperConstructor(Gallery, this, bitmaps.back_menu, 570, 320);
  this.onadd = this.init;
  this.countOfStars = 0;
  this.currentPageNum = 0;
  this.unlockedNum = 0;
  this.page = null;
  this.panel = null;
  this.pageMoving = false;
  this.changePage = Utils.proxy(this.changePage, this);
  this.unBlockMoving = Utils.proxy(this.unBlockMoving, this);
}
Utils.extend(Gallery, Sprite);
Gallery.prototype.init = function () {
  this.setStatic(true);
  this.setBackBtn();
  this.setNavigationPanel();
  this.setCountOfStars();
  this.setStartPage();
  addSpilLogo(
    stage,
    60,
    25,
    { align: "right", valign: "bottom" },
    { scaleX: 0.95, scaleY: 0.95 }
  );
};
Gallery.prototype.setNavigationPanel = function () {
  var panel = GU.addSprite(this, "navigator_gallery", 84, 19, 0, 137, true);
  GU.addButton(
    panel,
    "arrow_gallery",
    52,
    58,
    -50,
    12,
    this.changePage
  ).scaleX = -1;
  GU.addButton(panel, "arrow_gallery", 52, 58, 50, 12, this.changePage);
  for (var i = 0; i < 5; i++) {
    var box = GU.addSprite(
      panel,
      "box1_gallery",
      10,
      10,
      -30 + i * 15,
      -1,
      true
    );
    box.i = i;
    box.onclick = this.changePage;
  }
  this.panel = panel;
};
Gallery.prototype.changePage = function (e) {
  var btn = e.target;
  var nextPage;
  if (btn.bitmap === bitmaps.arrow_gallery)
    nextPage = this.currentPageNum + btn.scaleX;
  else nextPage = btn.i;
  if (this.pageMoving || nextPage < 0 || nextPage > 4) return;
  this.pageMoving = true;
  var destination = nextPage > this.currentPageNum ? -320 : 320;
  GU.startTween(
    this.page,
    "y",
    destination,
    1e3,
    Easing.back.easeIn,
    GU.destroyObjFromTween
  );
  this.currentPageNum = nextPage;
  this.setPage(-destination);
  return false;
};
Gallery.prototype.setStartPage = function () {
  this.unlockedNum = ~~(this.countOfStars / 3);
  this.currentPageNum = ~~((this.unlockedNum - 1) / 4);
  this.pageCounter = GU.addSprite(this.panel, "box2_gallery", 12, 12, 0, -1);
  this.setPage();
};
Gallery.prototype.setPage = function (y) {
  this.page = GU.addSprite(this, null, 1, 1, 0, y);
  this.pageCounter.x = -30 + this.currentPageNum * 15;
  for (var i = 0; i < 4; i++) this.setItem(i, this.page);
  if (y)
    GU.startTween(
      this.page,
      "y",
      0,
      1e3,
      Easing.back.easeIn,
      this.unBlockMoving
    );
};
Gallery.prototype.unBlockMoving = function () {
  this.pageMoving = false;
};
Gallery.prototype.setItem = function (i, parent) {
  var num = this.currentPageNum * 4 + i + 1;
  var holder = GU.addSprite(
    parent,
    null,
    1,
    1,
    (i % 2) * 260 - 130,
    ~~(i / 2) * 145 - 90
  );
  var item = GU.addSprite(holder, null, 150, 130);
  item.setZIndex(2);
  if (num > this.unlockedNum) {
    item.bitmap = bitmaps.pick_lock_gallery;
    GU.writeSimpleText(item, "num2_gallery", 14, 24, 0, -12, 3 * num, true, {
      align: SimpleText.ALIGN_CENTER,
      static: false,
    });
  } else {
    item.bitmap = bitmaps["pic" + num + "_gallery"];
    if (num === this.unlockedNum && prevState === STATE_VICTORY)
      GU.addSprite(holder, "new_gallery", 64, 52, 48, -56);
  }
  var left = GU.addSprite(
    holder,
    "effect_gallery",
    28,
    34,
    -65.5,
    3,
    false,
    12
  );
  left.setZIndex(1);
  var right = GU.addSprite(
    holder,
    "effect_gallery",
    28,
    34,
    65.5,
    3,
    false,
    12
  );
  right.scaleX = -1;
  right.setZIndex(1);
};
Gallery.prototype.setCountOfStars = function () {
  this.countOfStars = GU.getTotalNumOfStars();
  var panel = GU.addSprite(this, "panel_gallery", 82, 50, 0, -15, true);
  var num = this.countOfStars + "/60";
  GU.writeSimpleText(
    panel,
    "num1_gallery",
    12,
    22,
    7,
    0.5,
    num,
    true,
    { align: SimpleText.ALIGN_CENTER, charSpacing: -4 },
    "/"
  );
};
Gallery.prototype.setBackBtn = function () {
  var func = prevState === STATE_MENU ? showMenu : levelSelect;
  GU.addButton(stage, "back_gallery", 70, 38, 28, 308, func);
};
function Comics() {
  Utils.callSuperConstructor(Comics, this, bitmaps.back_menu, 570, 320);
  this.onadd = this.init;
  this.frameSpr = null;
  this.skipBtn = null;
  this.numOfPage = 1;
  this.changePage = Utils.proxy(this.changePage, this);
}
Utils.extend(Comics, Sprite);
Comics.prototype.init = function () {
  this.setStatic(true);
  mixer.channels[0].stop();
  this.showFrame();
  stage.setTimeout(Utils.proxy(this.addSkipBtn, this), 1e3);
};
Comics.prototype.addSkipBtn = function () {
  var skipBtn = GU.addButton(
    stage,
    "skip_comics",
    78,
    42,
    30,
    -20,
    Utils.proxy(this.exit, this),
    { align: "right", valign: "top" }
  );
  GU.startTween(skipBtn, "y", 20, 300, Easing.quadratic.easeOut);
  this.skipBtn = skipBtn;
};
Comics.prototype.showFrame = function () {
  var frameSpr = GU.addSprite(
    this,
    "frame_comics",
    392,
    276,
    stageProps.width,
    7
  );
  GU.startTween(frameSpr, "x", 0, 1e3);
  this.frameSpr = frameSpr;
  frameSpr.currentPage = GU.addSprite(
    frameSpr,
    "comics" + this.numOfPage,
    350,
    246,
    0,
    -2
  );
  frameSpr.currentPage.opacity = 0;
  frameSpr.currentPage.fadeTo(1, 800, Easing.quintic.easeIn);
  stage.setTimeout(this.changePage, 3e3);
};
Comics.prototype.changePage = function () {
  if (this.numOfPage < 6) {
    if (this.numOfPage === 1 && gameSaves.isMusicOn)
      mixer.play("MusicIntro", false, false, 0);
    var parent = this.frameSpr;
    parent.prevPage = parent.currentPage;
    this.numOfPage++;
    parent.currentPage = GU.addSprite(
      parent,
      "comics" + this.numOfPage,
      350,
      246,
      0,
      -2
    );
    parent.currentPage.opacity = 0;
    parent.currentPage.fadeTo(1, 200);
    parent.prevPage.fadeTo(0.9, 200, false, GU.destroyObjFromTween);
    stage.setTimeout(this.changePage, 4500);
  } else this.exit();
};
Comics.prototype.exit = function () {
  var finishFunc = prevState === STATE_MENU ? showMenu : Comics.startFirstLevel;
  this.frameSpr.currentPage.fadeTo(0, 200, false, GU.destroyObjFromTween);
  GU.startTween(this.frameSpr, "x", -stageProps.width, 1e3, false, finishFunc);
  GU.startTween(this.skipBtn, "y", -20, 300, Easing.quadratic.easeIn);
};
Comics.startFirstLevel = function () {
  prepareLevel(1);
};
function showCredits() {
  preloadScene("credits", function () {
    switchState(STATE_CREDITS);
    var mc = new Credits();
    stage.addChild(mc);
    mc.setRelativePosition(0, 0);
  });
}
function Credits() {
  Utils.callSuperConstructor(Credits, this, null, stageProps.width, 320);
  this.onclick = GU.returnFalse;
  this.onadd = this.init;
  this.blocker = null;
  this.popup = null;
}
Utils.extend(Credits, Sprite);
Credits.prototype.init = function () {
  this.setBlocker();
  this.setPopup();
  stage.setTimeout(Utils.proxy(this.showPopup, this), 500);
};
Credits.prototype.setBlocker = function () {
  var mc = GU.addSprite(this, null, stageProps.width, 320);
  mc.fillColor = "#000";
  mc.opacity = 0;
  mc.fadeTo(0.6, 500);
  this.blocker = mc;
};
Credits.prototype.setPopup = function () {
  this.popup = GU.addSprite(this, null, 1, 1, 0, -300);
  var part4 = GU.addSprite(this.popup, "part4_credits", 340, 130, 0, 61);
  part4.setZIndex(5);
  var hamster = GU.addButton(
    part4,
    "hamster_credits",
    162,
    78,
    0,
    20,
    Credits.openWindow
  );
  hamster.url = "http://hunter-hamster.com/";
  this.part4 = part4;
  var part1 = GU.addSprite(this.popup, "part1_credits", 364, 84, 0, -38);
  var fb = GU.addButton(
    part1,
    "facebook_credits",
    278,
    66,
    -25,
    0,
    Credits.openWindow
  );
  fb.url = "https://www.facebook.com/SnailBobGame";
  GU.addButton(
    part1,
    "close_credits",
    30,
    30,
    147,
    -15,
    Utils.proxy(this.close, this)
  );
  this.part1 = part1;
  var part3 = GU.addSprite(this.popup, "part3_credits", 344, 116);
  part3.setZIndex(1);
  part3.scaleX = 0.9;
  this.part3 = part3;
  var part2 = GU.addSprite(part3, "part2_credits", 366, 102);
  GU.addButton(part2, "kovalishin_credits", 178, 30, -85, -18);
  GU.addButton(part2, "ivanov_credits", 144, 30, 101, -18);
  GU.addButton(part2, "ahura_credits", 136, 28, -85, 35);
  GU.addButton(part2, "yurchenko_credits", 132, 30, 95, 35);
};
Credits.prototype.showPopup = function () {
  GU.startTween(
    this.popup,
    "y",
    -25,
    500,
    false,
    Utils.proxy(this.showAuthors, this)
  );
};
Credits.prototype.hidePopup = function () {
  GU.startTween(
    this.popup,
    "y",
    -300,
    500,
    false,
    Utils.proxy(this.exit, this)
  );
};
Credits.prototype.showAuthors = function () {
  var duration = 300;
  GU.startTween(this.part3, "scaleX", 1, duration);
  GU.startTween(this.part4, "y", 117, duration);
  GU.startTween(this.part1, "y", -93, duration);
};
Credits.prototype.hideAuthors = function () {
  var duration = 300;
  GU.startTween(this.part3, "scaleX", 0.9, duration);
  GU.startTween(this.part4, "y", 61, duration);
  GU.startTween(this.part1, "y", -38, duration);
};
Credits.prototype.close = function () {
  this.hideAuthors();
  stage.setTimeout(Utils.proxy(this.hidePopup, this), 300);
};
Credits.prototype.exit = function () {
  this.destroy = true;
  switchState(STATE_MENU);
};
Credits.openWindow = function (e) {
  if (ExternalAPI.type === "Spilgames") window.open(e.target.url, "_blank");
  else CocoonJS.App.openURL(e.target.url);
};
function EndOfLevel() {
  Utils.callSuperConstructor(EndOfLevel, this, null, stageProps.width, 320);
  this.onadd = this.init;
  this.onclick = GU.returnFalse;
  this.numBobEyes = 0;
  this.eyes = null;
}
Utils.extend(EndOfLevel, Sprite);
EndOfLevel.prototype.init = function () {
  stageSpr.setStatic(true);
  this.playSounds();
  this.hideBack();
};
EndOfLevel.prototype.hideBack = function () {
  var mc = GU.addSprite(this, null, stageProps.width, 320);
  mc.fillColor = "#1D022F";
  mc.opacity = 0;
  mc.fadeTo(0.5, 500);
};
EndOfLevel.prototype.addBobEyes = function () {
  this.eyes = GU.addSprite(this, "bob_victory", 92, 66, 0, 0, false, 14);
  this.eyes.stop();
  this.eyes.animDelay = 2;
  this.eyes.onchangeframe = function (e) {
    if (e.target.currentFrame === 13) e.target.gotoAndStop(0);
  };
  this.animateBobEyes();
};
EndOfLevel.prototype.animateBobEyes = function () {
  var rotation, x, y;
  var vec = new Vector(-75, 0);
  var pos = this.eyesProps[this.numBobEyes];
  x = pos.x;
  y = pos.y;
  rotation = pos.rotation;
  this.eyes.setPosition(x, y);
  this.eyes.rotation = rotation;
  this.eyes.setZIndex(1);
  this.eyes.play();
  vec.rotate(-rotation);
  this.eyes.play();
  var sequence = [
    {
      tweens: [
        { prop: "x", to: x + vec.x },
        { prop: "y", to: y + vec.y },
      ],
      duration: 500,
      onfinish: EndOfLevel.eyesPlay,
    },
    { tweens: [], duration: 1e3 },
    {
      tweens: [
        { prop: "x", to: x },
        { prop: "y", to: y },
      ],
      duration: 500,
    },
  ];
  Animation.play(this.eyes, sequence);
  if (this.numBobEyes < 4) this.numBobEyes++;
  else this.numBobEyes = 0;
  stage.setTimeout(this.animateBobEyes, 4500);
};
EndOfLevel.eyesPlay = function (e) {
  e.target.obj.play();
};
function showVictoryScreen() {
  if (gameState !== STATE_GAME) return;
  switchState(STATE_VICTORY);
  preloadScene("victory", function () {
    var mc = new VictoryScreen();
    stage.addChild(mc);
    mc.setRelativePosition(0, 0);
  });
}
function VictoryScreen() {
  Utils.callSuperConstructor(VictoryScreen, this, null, stageProps.width, 320);
  this.animateBobEyes = Utils.proxy(this.animateBobEyes, this);
  this.part1 = null;
  this.prevCountOfStars = 0;
  this.newCountOfStars = 0;
  this.galleryFrame = 24;
}
Utils.extend(VictoryScreen, EndOfLevel);
VictoryScreen.prototype.init = function () {
  this.setScores();
  ExternalAPI.exec("showAds");
  Utils.callSuperMethod(VictoryScreen, this, "init");
  this.showPart1();
};
VictoryScreen.prototype.setScores = function () {
  this.prevCountOfStars = GU.getTotalNumOfStars();
  GU.saveScores(gameScore);
  this.newCountOfStars = GU.getTotalNumOfStars();
  if (~~(this.newCountOfStars / 3) > ~~(this.prevCountOfStars / 3))
    this.galleryFrame = ~~(this.newCountOfStars / 3) - 1;
  if (this.newCountOfStars >= 20) GU.submitAward("Collect 20 stars");
  if (this.newCountOfStars === 60) GU.submitAward("Collect all 60 stars");
  if (currentLevel === 5) GU.submitAward("Level 5 Completed");
  ExternalAPI.exec("submitScores", gameScore);
};
VictoryScreen.prototype.showPart1 = function () {
  var part1 = GU.addSprite(this, "component1_victory", 206, 124, 0, 20);
  part1.setPropScale(0.2);
  part1.setZIndex(20);
  part1.scaleTo(1, 300, false, Utils.proxy(this.showPart2, this));
  var numOfStars = ~~(gameScore / 1e3);
  for (var i = 0; i < numOfStars; i++) VictoryScreen.addStar(part1, i);
  this.part1 = part1;
};
VictoryScreen.prototype.showPart2 = function () {
  var numHolder = GU.addSprite(this.part1, null, 1, 1, -1, 29);
  numHolder.opacity = 0;
  GU.writeSimpleText(numHolder, "num_victory", 22, 26, 0, 0, gameScore, false, {
    static: false,
    align: SimpleText.ALIGN_CENTER,
    charSpacing: -4,
  });
  numHolder.fadeTo(1, 200);
  var duration = 300;
  var top = GU.addSprite(this, "component2_victory", 132, 72, -40);
  top.setZIndex(19);
  top.moveTo(-50, -74, duration);
  addSpilLogo(top, 2, 0, false, { scaleX: 0.8, scaleY: 0.8 });
  var bottom = GU.addSprite(this, "component3_victory", 202, 80, 2, 30);
  bottom.setZIndex(19);
  GU.addButton(bottom, "restart_victory", 54, 50, -68, -3, restart);
  GU.addButton(bottom, "levels_map_victory", 54, 50, -10, -3, levelSelect);
  GU.addButton(bottom, "next_victory", 68, 52, 61, 8, startNextLevel);
  GU.startTween(bottom, "y", 105, duration);
  var galleryImg = GU.addTilesSprite(
    this,
    "galery_images_victory",
    100,
    94,
    25,
    9,
    3,
    30
  );
  galleryImg.gotoAndStop(this.galleryFrame);
  galleryImg.setZIndex(18);
  GU.addSprite(
    galleryImg,
    "noise_victory",
    74,
    86,
    9,
    -5,
    false,
    7
  ).animDelay = 3;
  galleryImg.moveTo(50, -70, duration);
  stage.setTimeout(Utils.proxy(this.showPart3, this), duration);
};
VictoryScreen.prototype.showPart3 = function () {
  var duration = 150;
  var countOfStars = GU.getTotalNumOfStars();
  if (this.galleryFrame !== 24) {
    var g = GU.addButton(this, "gallery_victory", 94, 56, 57, -90, showGallery);
    g.setZIndex(17);
    GU.startTween(g, "y", -130, 200);
  }
  var leftPart = GU.addSprite(this, "component4_victory", 22, 106, 75, 23);
  leftPart.setZIndex(18);
  GU.startTween(leftPart, "x", 90, duration);
  var rightPart = GU.addSprite(this, "component5_victory", 116, 22, -24, 120);
  rightPart.setZIndex(18);
  GU.startTween(rightPart, "y", 138, duration);
  var shadow = GU.addSprite(this, "shadow_victory", 214, 266, -1, 17);
  shadow.setZIndex(16);
  shadow.opacity = 0;
  shadow.fadeTo(1, duration);
  this.addBobEyes();
};
VictoryScreen.prototype.playSounds = function () {
  var victorySounds = [
    "l1_bob_yahoo",
    "l1_bob_levelfinish",
    "l1_bob_completejump",
  ];
  playSound(victorySounds.pickRandom());
};
VictoryScreen.prototype.eyesProps = [
  { rotation: -0.1, x: -50, y: 95 },
  { rotation: Math.PI + 0.1, x: 50, y: -80 },
  { rotation: 0.1, x: -55, y: -10 },
  { rotation: Math.PI / 2, x: -65, y: -55 },
  { rotation: -Math.PI + 0.1, x: 50, y: 100 },
];
VictoryScreen.addStar = function (parent, i) {
  var star = GU.addSprite(
    parent,
    "star_victory",
    40,
    40,
    -28 + i * 28,
    -27,
    false,
    23
  );
  star.animDelay = 3;
  star.onchangeframe = function (e) {
    if (e.target.currentFrame === 22) {
      e.target.stop();
      e.target.onchangeframe = null;
    }
  };
};
function showGameOverScreen() {
  if (gameState != STATE_GAME) return;
  switchState(STATE_GAME_OVER);
  preloadScene("gameOver", function () {
    var mc = new GameOver();
    stage.addChild(mc);
    mc.setRelativePosition(0, 0);
  });
}
function GameOver() {
  Utils.callSuperConstructor(GameOver, this, null, stageProps.width, 320);
  this.animateBobEyes = Utils.proxy(this.animateBobEyes, this);
}
Utils.extend(GameOver, EndOfLevel);
GameOver.prototype.init = function () {
  Utils.callSuperMethod(GameOver, this, "init");
  this.showPart1();
  ExternalAPI.exec("showAds");
};
GameOver.prototype.showPart1 = function () {
  var part1 = GU.addSprite(this, "component1_game_over", 184, 146, 0, -40);
  part1.setPropScale(0.2);
  part1.setZIndex(20);
  part1.scaleTo(1, 300, false, Utils.proxy(this.showPart2, this));
  GU.addTilesSprite(part1, "bob_game_over", 140, 78, 44, 11, 4, -7, -16, 4);
  GU.addSprite(part1, "text_game_over", 134, 22, 0, 45);
};
GameOver.prototype.showPart2 = function () {
  var restartBtn = GU.addButton(
    this,
    "try_again_game_over",
    96,
    36,
    0,
    20,
    restart
  );
  restartBtn.setZIndex(19);
  var sequence = [
    {
      tweens: [{ prop: "y", to: 50 }],
      duration: 150,
      onfinish: function (e) {
        e.target.obj.setZIndex(21);
      },
    },
    { tweens: [{ prop: "y", to: 40 }], duration: 75 },
  ];
  Animation.play(restartBtn, sequence);
  var part2 = GU.addSprite(this, "component2_game_over", 174, 82, -1, -10);
  part2.setZIndex(18);
  GU.startTween(part2, "y", 70, 250, false, Utils.proxy(this.showPart3, this));
};
GameOver.prototype.showPart3 = function () {
  var part3 = GU.addSprite(this, "component3_game_over", 15, 108, 70, 20);
  part3.setZIndex(17);
  GU.startTween(part3, "x", 84, 200);
  var part4 = GU.addSprite(this, "component4_game_over", 108, 14, 7, 90);
  part4.setZIndex(17);
  GU.startTween(part4, "y", 103, 200);
  stage.setTimeout(Utils.proxy(this.addBobEyes, this), 300);
};
GameOver.prototype.playSounds = function () {};
GameOver.prototype.eyesProps = [
  { rotation: -0.1, x: -30, y: 75 },
  { rotation: Math.PI + 0.1, x: 40, y: -80 },
  { rotation: 0.1, x: -45, y: -10 },
  { rotation: Math.PI / 2, x: -55, y: -55 },
  { rotation: -Math.PI + 0.1, x: 40, y: 67 },
];
function MainMenu() {
  Utils.callSuperConstructor(MainMenu, this, bitmaps.back_menu, 570, 320);
  this.onadd = this.init;
  this.numOfActor = GU.randInt(4, 1);
  this.showActor = Utils.proxy(this.showActor, this);
}
Utils.extend(MainMenu, Sprite);
MainMenu.prototype.init = function () {
  this.setStatic(true);
  this.setCovers();
  this.setButtons();
  this.setTitle();
  this.showActor();
  playSceneMusic();
};
MainMenu.prototype.setButtons = function () {
  var panel = GU.addSprite(stage, "panel_sound_menu", 48, 116);
  panel.setRelativePosition(23, 58, "right", "top");
  var soundBtn = GU.addSprite(panel, "sound_UI", 26, 28, 7, 20, false, 2);
  soundBtn.gotoAndStop(gameSaves.isMusicOn ? 0 : 1);
  soundBtn.onclick = toggleSounds;
  var galleryY;
  if (addSpilLogo(stage, 63, 28, { align: "left", valign: "bottom" }))
    galleryY = 110;
  else galleryY = 65;
  GU.addButton(stage, "galery_menu", 94, 120, 50, galleryY, showGallery, {
    align: "left",
    valign: "bottom",
  });
  GU.addButton(stage, "intro_menu", 70, 36, 20, 18, showComics, {
    align: "right",
    valign: "top",
  });
  var playBtn = GU.addButton(stage, "play_menu", 100, 48, 0, -40, levelSelect, {
    align: "center",
    valign: "center",
  });
  var creditsBtn = GU.addButton(
    stage,
    "credits_menu",
    94,
    42,
    0,
    10,
    showCredits,
    { align: "center", valign: "center" }
  );
  if (ExternalAPI.type === "Amazon") {
    var mg = GU.addSprite(stage, "amazon_more_games", 180, 155);
    mg.onclick = showMoreGames;
    mg.setRelativePosition(80, 60, "right", "bottom");
  } else {
    var bob1 = GU.addButton(
      stage,
      "bob3_menu",
      122,
      114,
      65,
      60,
      showThirdBob,
      { align: "right", valign: "bottom" },
      true
    );
    var bob2 = GU.addButton(
      stage,
      "bob2_menu",
      124,
      110,
      185,
      60,
      showSecondBob,
      { align: "right", valign: "bottom" },
      true
    );
    var bob3 = GU.addButton(
      stage,
      "bob1_menu",
      122,
      114,
      305,
      60,
      showFirstBob,
      { align: "right", valign: "bottom" },
      true
    );
    if (ExternalAPI.type === "Spilgames") {
      playBtn.y -= 13;
      creditsBtn.y -= 16;
      bob1.setPropScale(0.8);
      bob2.setPropScale(0.8);
      bob3.setPropScale(0.8);
      bob1.y += 10;
      bob2.y += 10;
      bob3.y += 10;
      var spilMG = GU.addSprite(stage, "more_games_menu", 144, 42);
      spilMG.setRelativePosition(0, 41);
      spilMG.onclick = showMoreGames;
    }
  }
};
MainMenu.prototype.setCovers = function () {
  GU.addSprite(this, "planet_menu", 468, 130, 0, -100, true);
  GU.addSprite(this, "light_menu", 154, 120, 0, -40, true);
};
MainMenu.prototype.setTitle = function () {
  var title = GU.addSprite(this, "title_menu", 292, 90, 0, -110);
  if (ExternalAPI.type === "Spilgames") title.y -= 10;
};
MainMenu.prototype.showActor = function () {
  this["showActor" + this.numOfActor]();
  var prev = this.numOfActor;
  while (prev === this.numOfActor) this.numOfActor = GU.randInt(4, 1);
};
MainMenu.prototype.showActor1 = function () {
  var duration = 12e3;
  var ufo = GU.addSprite(this, "ufo_menu", 74, 58, 310, -19);
  ufo.setZIndex(1);
  ufo.rotation = -0.7 * Math.PI;
  var t = new PathTween(
    ufo,
    [
      { x: 310, y: -19 },
      { x: 284.2146596858638, y: -18.429319371727757 },
      { x: 229.7643979057591, y: -15.172774869109958 },
      { x: 176.15183246073298, y: -5.052356020942426 },
      { x: 127.98429319371724, y: 22.078534031413596 },
      { x: 71.85863874345546, y: 47.79057591623035 },
      { x: 19.083769633507814, y: 63.86910994764395 },
      { x: -47.09424083769636, y: 75.40837696335078 },
      { x: -109.08376963350787, y: 50.95287958115182 },
      { x: -161.02094240837698, y: -10.094240837696333 },
      { x: -173.58638743455498, y: -60.34031413612566 },
      { x: -137.14659685863876, y: -103.06282722513089 },
      { x: -86.88481675392671, y: -130.77486910994764 },
      { x: -40.39267015706807, y: -149.9476439790576 },
      { x: 2.7486910994764457, y: -170.58115183246073 },
      { x: 10, y: -190 },
    ],
    true
  );
  t.start(duration);
  ufo.rotateTo(2.1 * Math.PI, duration, false, GU.destroyObjFromTween);
  stage.setTimeout(this.showActor, duration + 1e3);
};
MainMenu.prototype.showActor2 = function () {
  var duration = 5e3;
  var rocket = GU.addTilesSprite(
    this,
    "rocket_menu",
    72,
    162,
    9,
    5,
    2,
    stageProps.width / 2 + 100,
    -30,
    4
  );
  rocket.rotation = -Math.PI / 2 - 0.1;
  rocket.setPropScale(0.7);
  rocket.setZIndex(1);
  var vec = new Vector(0, -stageProps.width - 200);
  vec.rotate(-rocket.rotation);
  rocket.moveTo(rocket.x + vec.x, rocket.y + vec.y, duration);
  rocket.scaleTo(1, duration, false, GU.destroyObjFromTween);
  stage.setTimeout(this.showActor, duration + 1e3);
};
MainMenu.prototype.showActor3 = function () {
  var duration = 1e4;
  var alien = GU.addTilesSprite(
    this,
    "alien_menu",
    76,
    72,
    50,
    13,
    4,
    -315,
    -133,
    2
  );
  alien.setZIndex(1);
  alien.rotation = Math.PI / 3;
  var t = new PathTween(
    alien,
    [
      { x: -315, y: -133 },
      { x: -280.5, y: -133 },
      { x: -237, y: -103 },
      { x: -193.5, y: -43 },
      { x: -144, y: 13 },
      { x: -95.25, y: 60 },
      { x: -16.5, y: 70 },
      { x: 55.5, y: 58 },
      { x: 107.25, y: 25 },
      { x: 141.75, y: -4 },
      { x: 194.25, y: -25 },
      { x: 264.75, y: -34.75 },
      { x: 320, y: -40 },
    ],
    true
  );
  t.start(duration);
  alien.rotateTo(-6 * Math.PI, duration, false, GU.destroyObjFromTween);
  stage.setTimeout(this.showActor, duration + 1e3);
};
MainMenu.prototype.showActor4 = function () {
  var duration = 15e3;
  var bob = GU.addTilesSprite(
    this,
    "bob_menu",
    102,
    114,
    40,
    8,
    5,
    -340,
    -26,
    6
  );
  bob.setZIndex(1);
  bob.rotation = 0;
  var t = new PathTween(
    bob,
    [
      { x: -330, y: -26 },
      { x: -285, y: -26.51162790697674 },
      { x: -249.18604651162792, y: -24.65116279069767 },
      { x: -208.25581395348837, y: -7.441860465116264 },
      { x: -165.93023255813955, y: 29.302325581395365 },
      { x: -123.6046511627907, y: 44.23255813953489 },
      { x: -78.48837209302326, y: 25.232558139534888 },
      { x: -53.83720930232556, y: -5.465116279069747 },
      { x: 2.9069767441860677, y: -20.558139534883708 },
      { x: 72.2093023255814, y: 0.581395348837219 },
      { x: 112.67441860465118, y: 25.558139534883736 },
      { x: 166.6279069767442, y: 44.09302325581396 },
      { x: 213.13953488372096, y: 33.93023255813955 },
      { x: 245.69767441860472, y: 10.697674418604663 },
      { x: 270.81395348837214, y: -10 },
      { x: 283.8372093023256, y: -18 },
      { x: 315, y: -23 },
      { x: 330, y: -23 },
    ],
    true
  );
  t.start(duration);
  bob.rotateTo(4 * Math.PI, duration, false, GU.destroyObjFromTween);
  stage.setTimeout(this.showActor, duration + 1e3);
};
var FinalCartoon1 = function () {};
FinalCartoon1.prototype.init = function () {
  this.addBackground();
  this.addPlanet();
  this.addEarth();
  this.addUFO();
  this.setZIndexes();
  playSceneMusic();
};
FinalCartoon1.prototype.addBackground = function () {
  var back = new Sprite(bitmaps.final_scene1, 570, 320);
  stage.addChild(back);
  back.setRelativePosition(0, 0);
  back.setStatic(true);
};
FinalCartoon1.prototype.addPlanet = function () {
  var planet = new Sprite(bitmaps.planet, 92, 328);
  stage.addChild(planet);
  planet.setRelativePosition(planet.width / 2, 0, "left");
  planet.moveTo(planet.x - 100, planet.y - 50, 1e4);
  planet.rotateBy(-Math.PI / 4, 16e3);
  this.planet = planet;
};
FinalCartoon1.prototype.addEarth = function () {
  var earth = new Sprite(bitmaps.planet_earth, 156, 160);
  stage.addChild(earth);
  earth.setRelativePosition(-earth.width / 2 + 40, -50, "right");
  earth.moveTo(earth.x - 100, earth.y + 50, 9e3);
  earth.rotateBy(-Math.PI, 16e3);
  this.earth = earth;
};
FinalCartoon1.prototype.addUFO = function () {
  var self = this;
  this.ufo = new Sprite(bitmaps.bob_in_ufo, 84, 66, 14);
  stage.addChild(this.ufo);
  var flyPath = [
    { x: -50, y: 190 },
    { x: 100 + X_OFFSET, y: -50 },
    { x: 200 + X_OFFSET, y: 600 },
    { x: 300 + X_OFFSET, y: -100 },
    { x: 500 + X_OFFSET, y: 200 },
  ];
  var tween = new PathTween(this.ufo, flyPath, true);
  tween.start(6e3, null, Utils.proxy(this.finishUfoMove, this), function (e) {
    var twn = e.target.obj,
      angle = twn.getCurrentAngle(),
      spr = twn.obj;
    var rotationAngle = (angle - (spr.rotation - Math.PI / 2)) / 8;
    spr.rotation += rotationAngle;
  });
  stage.setTimeout(function () {
    tween.obj.scaleTo(0.1, 3e3);
  }, 3e3);
  stage.setInterval(function () {
    var ufo = self.ufo;
    if (!self.ufo) return;
    var smoke = new TilesSprite(bitmaps.effect_smoke, 80, 68, 34, 12, 3);
    smoke.onchangeframe = function (e) {
      var src = e.target;
      if (src.currentFrameX == src.framesCount - 1) {
        src.destroy = true;
        src.stop();
      }
    };
    smoke.animDelay = 1.5;
    smoke.rotation = ufo.rotation;
    smoke.setPropScale(ufo.scaleX);
    smoke.setZIndex(ufo.zIndex - 1);
    smoke.setPosition(ufo.x - 10, ufo.y);
    stage.addChild(smoke);
  }, 2e3);
};
FinalCartoon1.prototype.finishUfoMove = function () {
  this.ufo.destroy = true;
  this.ufo = null;
  this.addSparkle();
};
FinalCartoon1.prototype.setZIndexes = function () {
  this.planet.setZIndex(5);
  this.ufo.setZIndex(10);
  this.earth.setZIndex(15);
};
FinalCartoon1.prototype.addSparkle = function () {
  var animTime = 1500;
  var sparkle = new Sprite(bitmaps.planet_shine, 50, 44);
  stage.addChild(sparkle);
  sparkle.setPosition(this.earth.x - 50, this.earth.y + 25);
  sparkle.setPropScale(0);
  sparkle.rotateBy(Math.PI * 6, animTime);
  sparkle.scaleTo(1, animTime / 2, null, function () {
    sparkle.scaleTo(0, animTime / 2, null, showFinalCartoon2);
  });
};
function showFinalCartoon2() {
  createStage();
  field = new FinalCartoon2();
  field.init();
  stage.start();
}
var FinalCartoon2 = function () {};
FinalCartoon2.prototype.init = function () {
  this.addBackground();
  this.addHouse();
  this.addHens();
  this.addGrandpa();
  this.addUFO();
  this.setFallTimer();
  playSceneMusic();
};
FinalCartoon2.prototype.addBackground = function () {
  var back = new Sprite(bitmaps.final_scene2, 570, 320);
  stage.addChild(back);
  back.setRelativePosition(0, 0);
  back.setStatic(true);
};
FinalCartoon2.prototype.addHouse = function () {
  var house = new Sprite(bitmaps.final_house, 186, 204, 2);
  house.setPosition(350 + X_OFFSET, 148);
  house.setZIndex(10);
  this.house = stage.addChild(house);
  house.stop();
};
FinalCartoon2.prototype.addObstacles = function () {
  var house = this.house;
  var frame = new Sprite(bitmaps.final_frame, 54, 68);
  frame.setPosition(house.x - 24, house.y + 40);
  this.frame = stage.addChild(frame);
  var pipe = new Sprite(bitmaps.final_pipe, 38, 56);
  pipe.setPosition(house.x + 23, house.y - 73);
  this.pipe = stage.addChild(pipe);
  var roof1 = new Sprite(bitmaps.final_roof_1, 82, 80);
  roof1.setPosition(house.x + 53, house.y - 7);
  this.roof1 = stage.addChild(roof1);
  var roof2 = new Sprite(bitmaps.final_roof_2, 90, 90);
  roof2.setPosition(house.x - 51, house.y - 12);
  this.roof2 = stage.addChild(roof2);
  var horseshoe = new Sprite(bitmaps.horseshoe, 22, 28);
  horseshoe.setPosition(house.x - 54, house.y + 19);
  this.horseshoe = stage.addChild(horseshoe);
  [frame, pipe, roof1, roof2].forEach(function (s) {
    s.setZIndex(house.zIndex - 1);
  });
};
FinalCartoon2.prototype.addHens = function () {
  var hen1 = new TilesSprite(bitmaps.final_hen_1, 36, 44, 28, 14, 2);
  hen1.setPosition(this.house.x + 29, this.house.y + 7);
  hen1.animDelay = 3;
  this.hen1 = stage.addChild(hen1);
  var hen2 = new Sprite(bitmaps.final_hen_2, 36, 42, 20);
  hen2.setPosition(this.house.x - 52, this.house.y - 26);
  hen2.animDelay = 2;
  this.hen2 = stage.addChild(hen2);
  var hen3 = new Sprite(bitmaps.final_hen_3, 36, 44, 20);
  hen3.setPosition(this.house.x - 5, this.house.y - 24);
  hen3.animDelay = 3;
  hen3.scaleX = -1;
  this.hen3 = stage.addChild(hen3);
};
FinalCartoon2.prototype.addGrandpa = function () {
  var self = this;
  var s = new TilesSprite(bitmaps.final_grandpa1, 194, 100, 44, 9, 5);
  stage.addChild(s);
  s.setRelativePosition(-90, 57);
  s.animDelay = 2;
  s.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == 25) src.gotoAndPlay(0);
    if (src.currentFrameX == src.framesCount - 1) {
      src.stop();
      self.switchGrandpaState();
    }
  };
  s.scare = function () {
    this.gotoAndPlay(26);
  };
  this.grandpa = s;
};
FinalCartoon2.prototype.switchGrandpaState = function () {
  var self = this;
  var s = new TilesSprite(bitmaps.final_grandpa2, 194, 100, 44, 9, 5);
  stage.addChild(s);
  s.setPosition(this.grandpa.x, this.grandpa.y);
  s.animDelay = 3;
  s.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == 0) src.animDirection = 1;
    if (src.currentFrameX == 3) {
      src.animDirection = -1;
      src.animDelay = 4;
    }
    if (src.currentFrameX == src.framesCount - 1) {
      src.gotoAndPlay(22);
      src.animDelay = 4;
    }
  };
  s.save = function () {
    this.animDirection = 1;
    this.gotoAndPlay(4);
    stage.setTimeout(Utils.proxy(self.startDragging, self), 900);
    stage.setTimeout(Utils.proxy(self.animFinalText, self), 900);
  };
  this.grandpa.destroy = true;
  this.grandpa = s;
};
FinalCartoon2.prototype.addUFO = function () {
  var ufo = new TilesSprite(bitmaps.ufo_final_anim, 114, 88, 16, 8, 2);
  ufo.setPosition(this.house.x, this.house.y - 200);
  ufo.stop();
  ufo.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == src.framesCount - 1) src.stop();
  };
  ufo.setZIndex(this.house.zIndex - 1);
  this.ufo = stage.addChild(ufo);
};
FinalCartoon2.prototype.setFallTimer = function () {
  stage.setTimeout(Utils.proxy(this.dropUFO, this), 2e3);
  stage.setTimeout(Utils.proxy(this.breakHouse, this), 2500);
};
FinalCartoon2.prototype.dropUFO = function () {
  var ufo = this.ufo;
  ufo.moveTo(ufo.x, ufo.y + 250, 1e3, null, function () {
    ufo.setStatic(true);
    ufo.y += 10;
  });
};
FinalCartoon2.prototype.breakHouse = function () {
  this.addCloud();
  this.scareHens();
  this.ufo.play();
  var self = this;
  stage.setTimeout(function () {
    self.switchHouseState();
    self.addObstacles();
    self.grandpa.scare();
    self.dropObstacles();
    self.ufo.setPropScale(0.8);
    stage.setTimeout(Utils.proxy(self.showEyes, self), 1e3);
  }, 300);
};
FinalCartoon2.prototype.showEyes = function () {
  var eyes = new TilesSprite(bitmaps.bob_final_eyes, 36, 58, 60, 15, 4);
  eyes.setPosition(this.house.x, this.house.y + 72);
  eyes.setZIndex(this.house.zIndex - 1);
  eyes.animDelay = 3;
  eyes.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == 0) src.animDirection = 1;
    if (src.currentFrameX == src.framesCount - 1) src.animDirection = -1;
  };
  stage.addChild(eyes);
  var stars = new TilesSprite(bitmaps.final_stars, 48, 26, 45, 23, 2);
  stars.setPosition(0, -25);
  stars.animDelay = 4;
  eyes.addChild(stars);
  var self = this;
  _animate();
  function _animate() {
    eyes.opacity = 0;
    eyes.fadeTo(1, 1e3);
    eyes.moveTo(eyes.x, eyes.y - 18, 1e3, null, function () {
      eyes.anchor.y += 20;
      eyes.y += 20;
      stars.y -= 20;
      _rotateAnim();
      self.grandpa.save();
    });
  }
  function _rotateAnim() {
    var angle = eyes.rotation > 0 ? -Math.PI / 24 : Math.PI / 24;
    eyes.rotateTo(angle, 1200, null, arguments.callee);
  }
};
FinalCartoon2.prototype.switchHouseState = function () {
  this.house.gotoAndStop(1);
};
FinalCartoon2.prototype.addCloud = function () {
  var cloud = new TilesSprite(bitmaps.final_smoke, 176, 178, 15, 5, 3);
  cloud.setPosition(this.house.x, this.house.y);
  cloud.setZIndex(this.house.zIndex);
  cloud.animDelay = 3;
  cloud.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == src.framesCount - 1) {
      src.stop();
      src.destroy = true;
    }
  };
  stage.addChild(cloud);
};
FinalCartoon2.prototype.dropObstacles = function () {
  var horseshoe = this.horseshoe;
  horseshoe.rotation = Math.PI;
  horseshoe.moveTo(horseshoe.x, horseshoe.y + 75, 600, null);
  horseshoe.rotateBy(-Math.PI, 600, null, function () {
    horseshoe.moveTo(horseshoe.x - 40, horseshoe.y, 600);
    horseshoe.rotateBy(-1.5 * Math.PI, 600);
  });
  var frame = this.frame;
  frame.moveTo(frame.x + 15, frame.y + 15, 400);
  frame.rotateBy(Math.PI / 12, 400);
  var roof1 = this.roof1;
  roof1.moveTo(roof1.x + 25, roof1.y + 70, 500);
  roof1.rotateBy(Math.PI / 24, 500, null, function () {
    roof1.setStatic(true);
  });
  var roof2 = this.roof2;
  roof2.moveTo(roof2.x - 20, roof2.y + 100, 500);
  roof2.rotateBy(Math.PI / 4, 500);
  var pipe = this.pipe;
  pipe.anchor = { x: -5, y: 10 };
  pipe.x -= 5;
  pipe.y += 10;
  pipe.moveTo(pipe.x + 40, pipe.y + 100, 500);
  pipe.rotateBy(Math.PI / 4, 800);
};
FinalCartoon2.prototype.scareHens = function () {
  var self = this,
    h1 = this.hen1,
    h2 = this.hen2,
    h3 = this.hen3;
  var path1 = [
    { x: h1.x, y: h1.y },
    { x: h1.x + 50, y: h1.y - 60 },
    { x: h1.x + 200, y: h1.y + 80 },
  ];
  var tw1 = new PathTween(h1, path1, true);
  tw1.start(800, null, function () {
    h1.destroy = true;
    self.hen1 = null;
  });
  var path2 = [
    { x: h2.x, y: h2.y },
    { x: (h2.x + this.grandpa.x) / 2, y: h2.y - 30 },
    { x: this.grandpa.x - 40, y: this.grandpa.y },
  ];
  var tw2 = new PathTween(h2, path2, true);
  tw2.start(800, null, function () {
    h2.destroy = true;
    self.hen2 = null;
  });
  var path3 = [
    { x: h3.x, y: h3.y },
    { x: h3.x + 50, y: h3.y - 30 },
    { x: h3.x + 200, y: h3.y - 20 },
  ];
  var tw3 = new PathTween(h3, path3, true);
  tw3.start(800, null, function () {
    h3.destroy = true;
    self.hen3 = null;
  });
};
FinalCartoon2.prototype.startDragging = function () {
  var roof = this.roof2,
    frame = this.frame,
    pipe = this.pipe,
    roofRotation = roof.rotation;
  _moveRoof();
  _moveFrame();
  _movePipe();
  function _moveRoof() {
    var animTime = 2700;
    roof.rotation = roofRotation;
    roof.moveTo(roof.x - 10, roof.y, 1e3, null, function () {
      roof.rotateBy(Math.PI / 24, 350);
      roof.moveTo(roof.x + 10, roof.y, 350, null, _moveRoof);
    });
    roof.rotateBy(-Math.PI / 24, 1e3);
  }
  function _moveFrame() {
    frame.there = !frame.there;
    var angle = frame.there ? -Math.PI / 24 : Math.PI / 24;
    frame.rotateBy(angle, 1350, null, arguments.callee);
  }
  function _movePipe() {
    pipe.there = !pipe.there;
    var angle = pipe.there ? -Math.PI / 24 : Math.PI / 24;
    pipe.rotateBy(angle, 1350, null, arguments.callee);
  }
};
FinalCartoon2.prototype.animFinalText = function () {
  var txt1 = new Sprite(bitmaps.final_complete_txt, 152, 18);
  stage.addChild(txt1);
  txt1.setRelativePosition(0, -140);
  var txt2 = new Sprite(bitmaps.final_txt2, 194, 18);
  stage.addChild(txt2);
  txt2.setRelativePosition(0, -110);
  var txt3 = new Sprite(null, 1, 1);
  stage.addChild(txt3);
  txt3.setRelativePosition(0, -80);
  var scoreTxt = new Sprite(bitmaps.final_level_score, 124, 20);
  scoreTxt.setPosition(-35, 0);
  txt3.addChild(scoreTxt);
  var t = new SimpleText(bitmaps.final_num_score, 18, 24);
  t.align = t.ALIGN_RIGHT;
  t.parent = txt3;
  t.charSpacing = -5;
  t.x = scoreTxt.x + scoreTxt.width + 10;
  t.write(GU.getTotalScores());
  var btn = GU.addButton(stage, "but_menu_final", 64, 34, 0, -80, showMenu, {
    align: "center",
    valign: "center",
  });
  _animate();
  var self = this;
  function _animate() {
    var ease = Easing.back.easeOut;
    txt1.setPosition(-txt1.width, txt1.y);
    txt1.moveTo(240 + X_OFFSET, txt1.y, 1e3, ease);
    txt2.setPosition(480 + txt2.width, txt2.y);
    stage.setTimeout(function () {
      txt2.moveTo(240 + X_OFFSET, txt2.y, 1e3, ease);
    }, 1e3);
    txt3.setPosition(-1e3, txt3.y);
    stage.setTimeout(function () {
      txt3.moveTo(240 + X_OFFSET, txt3.y, 1e3, ease);
    }, 2e3);
    btn.opacity = 0;
    btn.setZIndex(txt3.zIndex - 1);
    stage.setTimeout(function () {
      btn.fadeTo(1, 1e3);
      btn.moveTo(btn.x, btn.y + 30, 1e3, null, function () {
        self.showGameButtons();
      });
    }, 3e3);
  }
};
FinalCartoon2.prototype.showGameButtons = function () {
  if (ExternalAPI.type === "Amazon") {
    var mg = GU.addSprite(stage, "amazon_more_games", 180, 155);
    mg.onclick = showMoreGames;
    mg.setRelativePosition(75, -60, "left", "bottom");
    GU.startTween(mg, "y", mg.y - 115, 1e3);
  } else {
    var btn1 = GU.addButton(
      stage,
      "but_bob1",
      108,
      52,
      -170,
      -30,
      showFirstBob,
      { align: "center", valign: "bottom" },
      true
    );
    var btn2 = GU.addButton(
      stage,
      "but_bob2",
      108,
      52,
      0,
      -30,
      showSecondBob,
      { align: "center", valign: "bottom" },
      true
    );
    var btn3 = GU.addButton(
      stage,
      "but_bob3",
      108,
      52,
      170,
      -30,
      showThirdBob,
      { align: "center", valign: "bottom" },
      true
    );
    btn1.moveTo(btn1.x, btn1.y - 60, 1e3);
    btn2.moveTo(btn2.x, btn2.y - 60, 1e3);
    btn3.moveTo(btn3.x, btn3.y - 60, 1e3);
  }
};
handlers = {};
handlers.applyObjectHandlers = function (spr) {
  switch (spr.info) {
    case "cover":
    case "lift":
    case "bridge":
      spr.setStatic(true);
      break;
    case "lamp":
      handlers.setLampHandler(spr);
      break;
    case "entrance":
      spr.setZIndex(16);
      break;
    case "gravity_button":
      handlers.addGravityHandlers(spr);
      break;
    case "star":
      handlers.starHandler.call(spr);
      break;
    case "star_doors":
      handlers.starDoorHandler.apply(spr);
      break;
    case "button":
      handlers.addButtonHandler(spr);
      break;
    case "lever":
      handlers.addLeverHandler(spr);
      break;
    case "lever2":
      handlers.addLever2Handler(spr);
      break;
    case "grandpa":
      handlers.setGrandpa(spr);
      break;
    case "slide_doors":
      handlers.setSlideDoors(spr);
      break;
    case "apple_of_the_eye":
      handlers.setAppleOfTheEye(spr);
      break;
    case "bubble_cover":
      handlers.setBubble(spr);
      break;
    case "electr_btn":
      handlers.setMagneticField(spr);
      break;
    case "green_door":
      handlers.setGreenDoorHandler(spr);
      break;
    case "bridge_accordion":
      handlers.setBridgeAccordionHandler(spr);
      break;
    case "alien":
      handlers.setAlienHandler(spr);
      break;
    case "alien_snail":
      handlers.setAlienSnailHandler(spr);
      break;
    case "alien_fly":
      handlers.setAlienFlyHandler(spr);
      break;
    case "portal":
      handlers.setPortalHandler(spr);
      break;
    case "lever3":
      handlers.setLeverHandler(spr);
      break;
    case "final_boss":
      handlers.setBossBehaviour(spr);
      break;
  }
  switch (spr.custom) {
    case "shock":
      handlers.addShockListener(spr);
      break;
    case "ray_inv":
      handlers.addRayListener(spr);
      break;
  }
};
handlers.setAppleOfTheEye = function (eye) {
  eye.anchor = { x: 2.5, y: 0 };
  eye.addEventListener("prerender", handlers.moveEye);
};
handlers.moveEye = function (e) {
  if (!bob) return;
  var eye = e.target;
  var dy = eye.y - bob.y;
  var dx = eye.x - bob.x;
  eye.rotation = Math.atan2(dy, dx);
};
handlers.setSlideDoors = function (spr) {
  spr.onclick = GU.returnFalse;
  spr.onchangeframe = function (e) {
    var obj = e.target;
    if (obj.currentFrame === 3) obj.onclick = null;
    if (obj.currentFrame === 8) {
      obj.stop();
      obj.setStatic(true);
    }
  };
};
handlers.addGravityHandlers = function (spr) {
  spr.onclick = handlers.changeGravity;
  spr.onchangeframe = function (e) {
    var btn = e.target;
    if (btn.currentFrame === btn.totalFrames - 1) {
      if (btn.down) btn.totalFrames = 19;
      else btn.totalFrames = 20;
      btn.bitmap = bitmaps["gravity_button_" + (btn.down ? "up" : "down")];
      btn.gotoAndStop(0);
      btn.down = !btn.down;
    }
  };
};
handlers.changeGravity = function (e) {
  var btn = e.target;
  if (btn.animated) return;
  btn.play();
  world.m_gravity.y *= -1;
  if (world.m_gravity.y < 0) {
    playSound("l1_ButtonGroundOn");
    playSound("l1_magnitnoe_pole_vkl2");
  } else {
    playSound("l1_ButtonGroundOff");
    playSound("l1_magnitnoe_pole_vykl2");
  }
  gameSaves.awards.flipCount++;
  saveGame();
  if (gameSaves.awards.flipCount === 100)
    GU.submitAward("Flip gravity 100 times");
};
handlers.setGrandpa = function (spr) {
  spr.changeFrameDelay = 50;
  spr.onchangeframe = function (e) {
    if (e.target.animated && e.target.currentFrame === 0) e.target.stop(0);
  };
  stage.setInterval(function () {
    spr.play();
  }, 3e3);
};
handlers.flipGrandpa = function (spr) {
  var gp = GU.getObjectByInfo("grandpa");
  if (gp) gp.scaleX *= -1;
};
handlers.buttonPress = function (action, obj, distance) {
  this.animDelay = 3;
  distance = distance || 28;
  this.onchangeframe = function (e) {
    var btn = e.target;
    if (btn.currentFrame === btn.totalFrames - 1) {
      btn.stop();
      btn.setStatic(true);
      btn.onchangeframe = null;
    }
  };
  this.onprerender = function () {
    if (Utils.isArray(obj))
      for (var i = 0; i < obj.length; i++) this.checkHit(obj[i]);
    else this.checkHit(obj || bob);
  };
  this.checkHit = function (obj) {
    var btn = this;
    if (obj && Math.abs(obj.x - btn.x) < distance && stage.hitTest(obj, btn)) {
      btn.setStatic(false);
      btn.onprerender = null;
      btn.play();
      if (action) action(this);
      playSound("Button");
    }
  };
};
handlers.addHint = function (bm, w, h, x, y) {
  var hint = GU.addSprite(stageSpr, bm, w, h, x, y);
  hint.opacity = 0;
  hint.fadeTo(1, 500);
  return hint;
};
handlers.addHintCircle = function (x, y, scale, parent) {
  var hint = GU.addSprite(parent || stageSpr, "hint", 50, 50, x, y);
  hint.onprerender = function (e) {
    e.target.rotation += 0.025;
  };
  if (scale) hint.setPropScale(scale);
  return hint;
};
handlers.addHintArrow = function (x, y, rotation, yellow) {
  var arrow = GU.addSprite(
    stageSpr,
    "arrow_" + (yellow ? "yellow" : "white"),
    20,
    30,
    x,
    y
  );
  arrow.rotation = rotation || 0;
  var distance = 10;
  var sequence = [
    {
      tweens: [
        { prop: "x", to: x + distance * Math.sin(rotation) },
        { prop: "y", to: y - distance * Math.cos(rotation) },
      ],
      duration: 750,
    },
    {
      tweens: [
        { prop: "x", to: x },
        { prop: "y", to: y },
      ],
      duration: 750,
      onfinish: function () {
        Animation.play(arrow, sequence);
      },
    },
  ];
  Animation.play(arrow, sequence);
  arrow.opacity = 0;
  arrow.fadeTo(1, 500);
  return arrow;
};
handlers.addTap = function (x, y, parent) {
  var tap;
  if (parent) tap = addToContainer(parent, "tap", 40, 60, x, y);
  else tap = addSprite("tap", 40, 60, x, y);
  tap.opacity = 0;
  tap.fadeTo(1, 1e3);
  return tap;
};
handlers.moveBridge = function (
  bridge,
  dir,
  finish,
  time,
  earth,
  ease,
  onfinish
) {
  var body = bridge.box2dBody,
    pos = box2d.getBodyPosition(body);
  bridge.setStatic(false);
  if (earth)
    if (!Utils.isArray(earth)) earth.setStatic(false);
    else for (var i = 0; i < earth.length; i++) earth[i].setStatic(false);
  bridge.removeTweens();
  bridge.posx = pos.x;
  bridge.posy = pos.y;
  var sequence = [
    {
      tweens: [
        {
          prop: "pos" + dir,
          to: finish,
          onchange: function (e) {
            box2d.setBodyPosition(body, bridge.posx, bridge.posy);
            if (dir === "y" && bridge.info === "lift" && bridge.y < finish)
              downBob();
          },
        },
      ],
      duration: time,
      ease: ease,
      onfinish: function () {
        var x = dir === "x" ? finish : bridge.posx;
        var y = dir === "y" ? finish : bridge.posy;
        box2d.setBodyPosition(body, x, y);
        stage.setTimeout(function () {
          bridge.setStatic(true);
          if (earth)
            if (!Utils.isArray(earth)) earth.setStatic(true);
            else
              for (var i = 0; i < earth.length; i++) earth[i].setStatic(true);
          if (onfinish) onfinish();
        }, 1);
      },
    },
  ];
  Animation.play(bridge, sequence);
  function downBob() {
    if (
      bob.x > bridge.x - bridge.width / 2 &&
      bob.x < bridge.x + bridge.width / 2 &&
      bob.y < bridge.y &&
      stage.hitTest(bob, bridge)
    ) {
      var bridgeUpBound = bridge.box2dBody.m_fixtureList.m_aabb.lowerBound.y;
      var pos = bob.box2dBody.GetPosition();
      pos.y = bridgeUpBound - 0.582;
      bob.box2dBody.SetPosition(pos);
    }
  }
};
handlers.starHandler = function () {
  this.setStatic(true);
  this.addEventListener("click", handlers.getStar);
};
handlers.getStar = function (e) {
  var star = e.target;
  if (star.collected) return;
  star.collected = true;
  star.bitmap = bitmaps.star1;
  star.width = 28;
  star.height = 27;
  star.gotoAndStop(0);
  star.setZIndex(stage.findMaxZIndex().zIndex + 1);
  star.setStatic(false);
  gameScore += 1e3;
  var finishX = -55.8 + field.starsCount * 27;
  if (field.starsCount === 2) finishX -= 0.8;
  field.starsCount++;
  playSound("l1_star" + field.starsCount);
  var sequence = [
    {
      tweens: [
        { prop: "y", to: star.y - 15 },
        { prop: "rotation", to: 0 },
      ],
      duration: 300,
      onfinish: function (e) {
        var obj = e.target.obj;
        GU.changeParent(obj, field.bottomUIBack, true);
      },
    },
    {
      tweens: [
        { prop: "y", to: 8.5 },
        {
          prop: "x",
          to: finishX,
          onchange: function (e) {
            var src = e.target.obj;
            var pos = src.getAbsolutePosition();
            handlers.addStarTrail(pos.x, pos.y, src.zIndex - 1);
          },
        },
        { prop: "rotation", to: Math.PI * 4 },
      ],
      duration: 500,
    },
    {
      tweens: [
        { prop: "scaleX", to: 0.8 },
        { prop: "scaleY", to: 0.8 },
        { prop: "rotation", to: Math.PI * 6 },
      ],
      duration: 500,
      onfinish: function () {
        star.bitmap = bitmaps.star_finish;
        star.height++;
        star.y++;
        star.totalFrames = 10;
        star.animDelay = 3;
        star.play();
        star.onchangeframe = function (e) {
          if (e.target.currentFrame === 9) e.target.gotoAndStop(0);
        };
      },
    },
  ];
  Animation.play(star, sequence);
  var anim = new TilesSprite(bitmaps.star_anim, 78, 78, 18, 9, 2);
  var pos = star.getAbsolutePosition();
  anim.x = pos.x - X_OFFSET;
  anim.y = pos.y;
  anim.animDelay = 4;
  anim.setZIndex(star.zIndex - 1);
  anim.onchangeframe = function (e) {
    if (e.target.currentFrameX === 16) e.target.destroy = true;
  };
  stageSpr.addChild(anim);
};
handlers.addStarTrail = function (x, y, zIndex) {
  var randX = GU.randInt(10, -10);
  randY = GU.randInt(10, -10);
  var star = GU.addSprite(stage, "star_trail", 13, 12, x + randX, y + randY);
  star.setZIndex(zIndex);
  star.scaleTo(0, 300, false, function () {
    star.destroy = true;
  });
};
handlers.ifBobFall = function (condition) {
  var fall;
  if (!bob || bob.state === "fall") return;
  switch (typeof condition) {
    case "number":
      if (bob.y > condition) fall = true;
      break;
    case "function":
      fall = condition();
      break;
    case "object":
      fall = true;
      if (condition.minY && bob.y < condition.minY) fall = false;
      if (condition.minX && bob.x < condition.minX) fall = false;
      break;
    default:
      console.log("default condition");
  }
  if (fall) bob.changeState("fall");
};
handlers.setBaraban = function (baraban, btn) {
  btn.onclick = function (e) {
    if (baraban.animated) return;
    turnBaraban();
    playSound("l3_TurnAround");
    if (
      stage.hitTest(bob, baraban) &&
      Math.abs(box2d.getBodyPosition(bob.box2dBody).x - baraban.x) < 33
    )
      bob.turn();
  };
  baraban.onchangeframe = function (e) {
    var obj = e.target;
    if (obj.animated && obj.currentFrame === 0) obj.stop();
  };
  function turnBaraban() {
    if (bob.direction == "right") baraban.animDirection = 1;
    else baraban.animDirection = -1;
    baraban.play();
  }
};
handlers.setFan = function (fan, btn, obj, force) {
  btn.onclick = action;
  obj = obj || bob;
  fan.anchor = { x: -15, y: -16 };
  fan.checkPoint = { x: fan.x + 5 * fan.scaleX, y: fan.y - 16 };
  force = force || new b2Vec2(-5 * fan.scaleX, -2);
  function action() {
    if (fan.rotation < -0.2) return;
    fan.removeTweens();
    var sequence = [
      {
        tweens: [{ prop: "rotation", to: (-Math.PI / 2) * fan.scaleX }],
        duration: 500,
        ease: Easing.exponential.easeOut,
      },
      {
        tweens: [{ prop: "rotation", to: 0 }],
        duration: 500,
        ease: Easing.exponential.easeOut,
      },
    ];
    Animation.play(fan, sequence);
    playSound("L1_S3_Turn_Head(SnailBob3)");
    stage.setTimeout(function () {
      switch (obj) {
        case "allBobs":
          for (var i = 0; i < field.bobs.length; i++) checkHit(field.bobs[i]);
          break;
        case "ball":
          checkHit(levelsScripts[GET.debug ? editorLevel : currentLevel].ball);
          break;
        default:
          checkHit(obj);
      }
    }, 50);
  }
  function checkHit(obj) {
    if (obj.hitTestPoint(fan.checkPoint.x, fan.checkPoint.y)) {
      var body = obj.box2dBody;
      if (obj === bob) {
        obj.cancelSpeed = true;
        var stopSpeed = fan.scaleX === 1 ? 0.4 : 1;
        stage.clearInterval(bob.returnSpeedInt);
        bob.returnSpeedInt = stage.setInterval(function () {
          var oldSpeed = body.GetLinearVelocity();
          oldSpeed.x += oldSpeed.x < 0 ? 0.02 : -0.02;
          body.SetLinearVelocity(oldSpeed);
          if (Math.abs(body.GetLinearVelocity().x) < stopSpeed) {
            obj.cancelSpeed = false;
            stage.clearInterval(bob.returnSpeedInt);
          }
        }, 1);
      }
      body.SetLinearVelocity(new b2Vec2(0, 0));
      body.ApplyImpulse(force, body.GetPosition());
    }
  }
};
handlers.moveFrogPlatform = function (platform, dur, ease) {
  var state;
  dur = dur || 500;
  this.onclick = function () {
    if (this.custom.indexOf("left") != -1) state = platform.state - 1;
    else state = platform.state + 1;
    if (state < 0 || state > platform.coords.length - 1) return;
    platform.state = state;
    platform.removeTweens();
    var fin = platform.coords[state];
    stage.createTween(platform, "x", platform.x, fin, dur, ease).play();
    playSound("l21_Crane");
  };
};
handlers.movePlatform = function (platform, fin, durByPixel) {
  durByPixel = durByPixel || 10;
  var body = platform.box2dBody;
  this.addEventListener("mousedown", onmousedown);
  this.addEventListener("click", GU.returnFalse);
  this.addEventListener("mouseup", onmouseup);
  this.addEventListener("mouseout", onmouseup);
  function onmousedown(e) {
    var increace;
    if (e.target.custom.indexOf("left") !== -1) increace = false;
    else increace = true;
    if ((increace && platform.x >= fin) || (!increace && platform.x <= fin))
      return;
    platform.posX = platform.x;
    var dur = Math.abs(platform.x - fin) * durByPixel;
    var tween = stage.createTween(platform, "posX", platform.x, fin, dur);
    tween.onchange = function (e) {
      var pos = body.GetPosition();
      var newPosX = platform.posX / box2d.SCALE;
      var change = newPosX - pos.x;
      pos.x = newPosX;
      body.SetPosition(pos);
      moveBob(change);
    };
    tween.play();
  }
  function onmouseup() {
    platform.removeTweens();
  }
  function moveBob(change) {
    if (
      bob.state === "hide" &&
      bob.y < platform.y &&
      stage.hitTest(bob, platform) &&
      bob.x > platform.x - platform.width / 2 &&
      bob.x < platform.x + platform.width / 2
    ) {
      var pos = bob.box2dBody.GetPosition();
      pos.x += change;
      bob.box2dBody.SetPosition(pos);
    }
  }
};
handlers.addButtonHandler = function (spr) {
  GU.attachMouseEvents.call(spr, true);
  if (spr.custom === "hint") spr.addHint();
};
handlers.addLeverHandler = function (spr) {
  spr.addEventListener("click", leverClick);
  spr.animDelay = 2;
  spr.animDirection = -1;
  spr.onchangeframe = function (e) {
    var lever = e.target;
    if (lever.animated)
      if (
        (lever.currentFrameX === 0 && lever.animDirection === -1) ||
        (lever.currentFrameX === 7 && lever.animDirection === 1)
      )
        lever.stop();
  };
};
handlers.addLever2Handler = function (spr) {
  spr.addEventListener("click", leverClick);
  spr.animDelay = 2;
  spr.animDirection = -1;
  spr.onchangeframe = function (e) {
    var lever = e.target;
    if (lever.animated)
      if (
        (lever.currentFrame === 0 && lever.animDirection === -1) ||
        (lever.currentFrame === 6 && lever.animDirection === 1)
      )
        lever.stop();
  };
};
handlers.leverClick = function (e) {
  var lever = e.target;
  lever.animDirection *= -1;
  lever.play();
  playSound("LeverDouble");
};
handlers.starDoorHandler = function () {
  this.onchangeframe = function (e) {
    if (e.target.currentFrameX === 7) {
      e.target.gotoAndStop(8);
      e.target.setStatic(true);
    }
  };
};
handlers.addShockListener = function (spr) {
  spr.dontStopAnimation = true;
  spr.addEventListener("prerender", function () {
    if (bob.isShocked) return;
    if (stage.hitTest(bob, spr)) {
      bob.isShocked = true;
      bob.changeState("shocked");
    }
  });
};
handlers.addRayListener = function (spr) {
  if (spr.box2dBody) world.DestroyBody(spr.box2dBody);
  spr.height = 1;
  var rect = spr.getAABBRectangle();
  stage.addEventListener("pretick", function () {
    if (bob.isDead || !stage.hitTest(bob, spr)) return;
    if (
      (bob.x + bob.width / 2 - 5 > rect.center.x - rect.width / 2 &&
        bob.x - bob.width / 2 + 5 < rect.center.x + rect.width / 2) ||
      (bob.y + bob.height / 2 - 3 > rect.center.y - rect.height / 2 &&
        bob.y - bob.height / 2 + 3 < rect.center.y + rect.height / 2)
    ) {
      bob.isDead = true;
      bob.changeState("bobOnRay");
    }
  });
};
handlers.setBubble = function (spr) {
  if (spr.custom) spr.setPropScale(spr.custom);
  _scaleThere();
  function _scaleThere() {
    var tw1 = stage.createTween(
      spr,
      "scaleX",
      spr.scaleX,
      spr.scaleX + 0.05,
      500
    );
    var tw2 = stage.createTween(
      spr,
      "scaleY",
      spr.scaleY,
      spr.scaleY - 0.05,
      500
    );
    tw2.onfinish = _scaleBack;
    tw1.play();
    tw2.play();
  }
  function _scaleBack() {
    var tw1 = stage.createTween(
      spr,
      "scaleX",
      spr.scaleX,
      spr.scaleX - 0.05,
      500
    );
    var tw2 = stage.createTween(
      spr,
      "scaleY",
      spr.scaleY,
      spr.scaleY + 0.05,
      500
    );
    tw2.onfinish = _scaleThere;
    tw1.play();
    tw2.play();
  }
  spr.onclick = function (e) {
    var src = e.target;
    if (src.isBlocked) return;
    src.bitmap = bitmaps.buble_explosion;
    src.width = 54;
    src.height = 50;
    src.x += 1;
    src.y -= 2;
    src.totalFrames = 9;
    src.play();
    src.animDelay = 2;
    src.onchangeframe = function (e) {
      var src = e.target;
      if (src.currentFrame == 8) src.destroy = true;
    };
    src.isBlocked = true;
    playSound("l7_GoodPop");
    return false;
  };
};
handlers.setGreenDoorHandler = function (spr) {
  spr.onclick = GU.returnFalse;
};
handlers.setMagneticField = function (spr) {
  var magneticDistance = 50;
  var timer;
  spr.setZIndex(10);
  spr.stop();
  spr.isOn = false;
  var magneticField = new TilesSprite(bitmaps.electr_field, 68, 68, 30, 10, 3);
  magneticField.setPosition(spr.x, spr.y);
  stageSpr.addChild(magneticField);
  magneticField.animDelay = 1;
  magneticField.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == 12) src.gotoAndPlay(10);
    if (src.currentFrameX == src.framesCount - 1) src.gotoAndStop(0);
  };
  magneticField.stop();
  GU.changeParent(spr, magneticField);
  spr.setPosition(0, 0);
  spr.onclick = _toggleField;
  function _toggleField(e) {
    var switcher = e.target;
    switcher.currentFrame = !switcher.currentFrame;
    switcher.isOn = !switcher.isOn;
    var mField = switcher.parent;
    if (switcher.isOn) {
      mField.gotoAndPlay(1);
      timer = stage.setInterval(_addLayer, 400);
      stage.addEventListener("pretick", _checkObjectsField);
      playSound("Whoosh3");
    } else {
      mField.gotoAndPlay(20);
      stage.clearInterval(timer);
      stage.removeEventListener("pretick", _checkObjectsField);
      _clearFieldLines();
      playSound("Whoosh3Revers");
    }
  }
  function _addLayer() {
    var m = new TilesSprite(bitmaps.electr_field, 68, 68, 30, 10, 3);
    m.setPosition(0, 0);
    m.setZIndex(1);
    m.gotoAndStop(13);
    magneticField.addChild(m);
    m.scaleTo(0.4, 600, null, function (e) {
      e.target.obj.destroy = true;
    });
  }
  function _checkObjectsField() {
    var sprites = stageSpr.objects;
    for (var i = 0, j = sprites.length; i < j; i++) {
      var s = sprites[i];
      if (s.box2dBody && GU.getDistance(magneticField, s) < magneticDistance)
        _addFieldLines(s);
    }
  }
  function _addFieldLines(pulledSpr) {
    var body = pulledSpr.box2dBody;
    if (pulledSpr.stunnedBy || body.GetType() != box2d.bodyType.dynamic) return;
    playSound("l7_elektro_zamikanie_7");
    pulledSpr.stunnedBy = spr;
    body.SetActive(false);
    body.SetLinearVelocity(new b2Vec2());
    body.SetAngularVelocity(0);
    var lines = new Sprite(bitmaps.electr_lines, 36, 42, 8);
    lines.setPosition(
      (magneticField.x + pulledSpr.x) / 2,
      (magneticField.y + pulledSpr.y) / 2
    );
    stageSpr.addChild(lines);
    var angle = GU.getAngle(magneticField, pulledSpr);
    lines.rotation = angle + Math.PI / 2;
    pulledSpr.stunLines = lines;
  }
  function _clearFieldLines() {
    var sprites = stageSpr.objects;
    for (var i = 0, j = sprites.length; i < j; i++) {
      var s = sprites[i];
      if (!s.stunnedBy || s.stunnedBy !== spr) continue;
      s.stunnedBy = null;
      s.box2dBody.SetActive(true);
      s.stunLines.destroy = true;
      s.stunLines = null;
    }
  }
};
handlers.setBridgeAccordionHandler = function (spr) {
  spr.setStatic(true);
  spr.typeFrame = spr instanceof TilesSprite ? "currentFrameX" : "currentFrame";
  spr.typeTotalFrame =
    spr instanceof TilesSprite ? "framesCount" : "totalFrames";
  if (spr.custom && spr.custom.indexOf("open") !== -1) {
    GU.setBodyGroupIndex(spr.box2dBody, -1);
    spr.gotoAndStop(spr[spr.typeTotalFrame] - 1);
  } else {
    spr.animDirection = -1;
    spr.shown = true;
  }
  spr.onchangeframe = function (e) {
    var obj = e.target;
    if (
      obj.animated &&
      (obj[obj.typeFrame] === obj[obj.typeTotalFrame] - 1 ||
        (obj[obj.typeFrame] === 0 && obj.animDirection === -1))
    ) {
      obj.stop();
      obj.setStatic(true);
    }
  };
  spr.toggle = function () {
    this.setStatic(false);
    this.animDirection *= -1;
    this.play();
    GU.setBodyGroupIndex(this.box2dBody, this.shown ? -1 : 0);
    var c = this.box2dBody.GetContactList();
    for (c; c; c = c.next) {
      c.other.SetActive(false);
      c.other.SetActive(true);
    }
    this.shown = !this.shown;
    if (this.shown) playSound("l3_DoorLeft");
    else playSound("l3_DoorRight");
  };
};
handlers.setAccordionButton = function (btn, accordion) {
  btn.addEventListener("click", Utils.proxy(accordion.toggle, accordion));
};
handlers.setAlienMove = function (alien, direction, distance, time) {
  stage.setTimeout(_moveAlien, 1e3);
  function _moveAlien() {
    var tw = stage.createTween(
      alien,
      direction,
      alien[direction],
      alien[direction] + distance,
      time
    );
    tw.onfinish = function () {
      distance *= -1;
      stage.setTimeout(_moveAlien, 1e3);
    };
    tw.play();
  }
};
handlers.setAlienHandler = function (alien) {
  alien.dontStopAnimation = true;
  alien.animDelay = 4;
  SnailBob.prototype.forbidSleep.call(alien);
  SnailBob.prototype.setBodyProps.call(alien);
  alien.onchangeframe = function (e) {
    var obj = e.target;
    if (!obj.animated) return;
    if (obj.currentFrameX === obj.framesCount - 1)
      switch (obj.bitmap) {
        case bitmaps.alien:
          if (Math.random() < 0.5) return;
          obj.bitmap = bitmaps.alien_blinks;
          obj.framesCount = 12;
          obj.totalFrames = 12;
          obj.totalLayers = 1;
          obj.gotoAndPlay(0);
          break;
        case bitmaps.alien_blinks:
          obj.bitmap = bitmaps.alien;
          obj.framesCount = 26;
          obj.totalFrames = 13;
          obj.totalLayers = 2;
          obj.gotoAndPlay(0);
          break;
        case bitmaps.alien_attacks:
          obj.stop();
          showGameOverScreen();
          break;
      }
    if (obj.currentFrameX === 11 && obj.bitmap === bitmaps.alien_attacks)
      obj.gotoAndPlay(2);
  };
  alien.addEventListener("prerender", handlers.ifAlienEatBob);
};
handlers.ifAlienEatBob = function (e) {
  var alien = e.target,
    moveTime = 150;
  if (!bob || GU.getDistance(bob, alien) > 38) return;
  alien.removeEventListener("prerender", handlers.ifAlienEatBob);
  alien.width = 68;
  alien.height = 70;
  alien.bitmap = bitmaps.alien_attacks;
  alien.framesCount = 66;
  alien.totalFrames = 14;
  alien.totalLayers = 5;
  alien.animDelay = 2;
  alien.gotoAndPlay(0);
  alien.scaleX = bob.scaleX;
  bob.blockClick = true;
  world.DestroyBody(bob.box2dBody);
  world.DestroyBody(alien.box2dBody);
  alien.moveTo(bob.x + 1, bob.y - 2, moveTime, false, function () {
    alien.gotoAndPlay(12);
    bob.visible = false;
    playSound("monstr_est_boba");
  });
  alien.rotation = alien.rotation % (2 * Math.PI);
  if (alien.rotation > 0)
    var angle = alien.rotation > Math.PI ? 2 * Math.PI : 0;
  else var angle = alien.rotation < -Math.PI ? -2 * Math.PI : 0;
  alien.rotateTo(angle, moveTime);
  playSound("l6_caterpillar_eatbob");
};
handlers.setAlienFlyHandler = function (alien) {
  alien.dontStopAnimation = true;
  alien.animDelay = 1;
  alien.addEventListener("prerender", handlers.ifAlienFlyEatBob);
  alien.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == src.framesCount - 1)
      if (Math.random() > 0.3) src.currentFrameX = 10;
  };
};
handlers.ifAlienFlyEatBob = function (e) {
  var alien = e.target;
  if (!bob || GU.getDistance(bob, alien) > 35) return;
  alien.removeEventListener("prerender", handlers.ifAlienFlyEatBob);
  alien.removeTweens();
  bob.blockClick = true;
  world.DestroyBody(bob.box2dBody);
  alien.moveTo(bob.x, bob.y, 150, false, function () {
    bob.visible = false;
    handlers.switchAlienToFlyState(alien);
    playSound("monstr_est_boba");
  });
  playSound("l6_caterpillar_eatbob");
};
handlers.switchAlienToFlyState = function (alien) {
  alien.removeTweens();
  alien.bitmap = bitmaps.alien_fly_attack;
  alien.width = 76;
  alien.height = 72;
  alien.framesCount = 66;
  alien.totalFrames = 13;
  alien.totalLayers = 7;
  alien.scaleX = bob.scaleX;
  alien.animDelay = 2;
  alien.gotoAndPlay(0);
  alien.onchangeframe = function (e) {
    var obj = e.target;
    if (!obj.animated) return;
    if (obj.currentFrameX == obj.framesCount - 1) {
      obj.stop();
      showGameOverScreen();
    }
  };
};
handlers.setAlienSnailHandler = function (alien) {
  alien.dontStopAnimation = true;
  alien.animDelay = 2;
  alien.speed = SnailBob.SPEED_WALK;
  alien.needContactCheck = true;
  alien.isContact = Utils.proxy(SnailBob.prototype.isContact, alien);
  alien.onbox2dsync = SnailBob.prototype.spritesSync;
  SnailBob.prototype.forbidSleep.call(alien);
  SnailBob.prototype.setBodyProps.call(alien);
  SnailBob.prototype.detectDirection.call(alien);
  alien.speed *= alien.scaleX;
  stage.addEventListener("pretick", Utils.proxy(SnailBob.prototype.go, alien));
};
handlers.setPortalHandler = function (spr) {
  spr.setZIndex(20);
  spr.animDelay = 2;
  spr.animCount = 0;
  spr.gotoAndStop(14);
  spr.lamps = GU.addSprite(spr, "portal_lamp", 34, 8, -0.5, 39.5, false, 20);
  spr.lamps.animDelay = 2;
  spr.onchangeframe = function (e) {
    var portal = e.target;
    if (portal.currentFrameX === 10)
      if (portal.animCount < 5) {
        portal.animCount++;
        portal.gotoAndPlay(5);
      }
    if (portal.currentFrameX === 13) {
      portal.gotoAndStop(14);
      portal.animCount = 0;
      portal.obj.cancelSpeed = false;
      portal.obj.box2dBody.SetActive(true);
    }
  };
};
handlers.setTeleports = function (obj) {
  var teleports = GU.getObjectByInfo("portal");
  var objects = [bob, obj];
  stage.addEventListener("pretick", _checkTeleportation);
  function _checkTeleportation() {
    for (var j = 0; j < objects.length; j++) {
      var o = objects[j];
      o.willTeleportation = false;
      for (var i = 0; i < teleports.length; i++) {
        var t = teleports[i];
        if (t.animated) continue;
        var dist = GU.getDistance(o, t);
        if (dist < 22 && o.y - t.y > 5) {
          o.willTeleportation = true;
          o.teleport = t;
        } else if (dist > 60 && o.teleport === t) t.wasTeleportation = false;
      }
    }
    if (bob.willTeleportation && obj.willTeleportation) {
      var t1 = obj.teleport;
      var t2 = bob.teleport;
      if (!t1.wasTeleportation || !t2.wasTeleportation) {
        _teleportation(bob, t1);
        _teleportation(obj, t2);
        playSound("l9_Ch3_L5_GenieHides");
      }
    }
  }
  function _teleportation(obj, destination) {
    obj.teleport.play();
    obj.teleport.obj = obj;
    obj.cancelSpeed = true;
    obj.teleport = destination;
    obj.box2dBody.SetActive(false);
    destination.wasTeleportation = true;
    stage.setTimeout(function () {
      var objPos = new b2Vec2(
        destination.x / box2d.SCALE,
        (destination.y + 11) / box2d.SCALE
      );
      obj.box2dBody.SetPosition(objPos);
    }, 100);
  }
};
handlers.setLampHandler = function (lamp) {
  lamp.toggle = function () {
    lamp.gotoAndStop(lamp.currentFrame === 0 ? 1 : 0);
  };
};
handlers.setLeverHandler = function (spr) {
  spr.addEventListener("click", _leverClick);
  spr.animDelay = 2;
  spr.animDirection = -1;
  spr.onchangeframe = function (e) {
    var lever = e.target;
    if (lever.animated)
      if (
        (lever.currentFrame === 0 && lever.animDirection === -1) ||
        (lever.currentFrame === 6 && lever.animDirection === 1)
      )
        lever.stop();
  };
  function _leverClick(e) {
    var lever = e.target;
    lever.animDirection *= -1;
    lever.play();
  }
};
handlers.setSpring = function (spring, button, force) {
  force = force || new b2Vec2(-10, 0);
  button.onclick = function () {
    spring.play();
  };
  spring.onchangeframe = function (e) {
    var obj = e.target;
    if (obj.currentFrame == 1) playSound("Spring");
    if (obj.currentFrame === 3 && obj.hitTest(bob)) {
      bob.cancelSpeed = true;
      var body = bob.box2dBody;
      body.ApplyImpulse(force, body.GetPosition());
      stage.setInterval(handlers.goAfterSpring, 1);
    }
    if (obj.currentFrame === 11) obj.gotoAndStop(0);
  };
};
handlers.goAfterSpring = function (e) {
  var vel = bob.box2dBody.GetLinearVelocity().x;
  if (vel <= 0 && vel > -0.5) {
    bob.cancelSpeed = false;
    stage.clearInterval(e.target);
  }
};
handlers.setBossBehaviour = function (boss) {
  boss.animDelay = 2;
  boss.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == 24) src.gotoAndPlay(0);
    if (src.currentFrameX == src.framesCount - 1) src.stop();
  };
  boss.kill = function () {
    this.gotoAndPlay(25);
    stage.setTimeout(function () {
      playSound("l25_BobFlatten");
    }, 400);
  };
};
var level = null;
var levelsScripts = {};
levelsScripts.Level1 = function () {
  this.cogwheelsShown = false;
  this.door = GU.getObjectByCustomInfo("door");
  this.coverDoor = GU.getObjectByCustomInfo("coverDoor");
  this.cogwheels = GU.getObjectByInfo("cogwheel_lvl1");
  this.gravityButton = GU.getObjectByInfo("gravity_button");
  this.hint1 = null;
  this.arrow1 = null;
  this.hintCircle1 = null;
  this.hint2 = null;
  this.arrow2 = null;
  this.hintCircle2 = null;
  this.hint3 = null;
  this.arrow3 = null;
  this.hintCircle3 = null;
};
levelsScripts.Level1.prototype.init = function () {
  this.setCogwheelProps();
  this.door.onclick = GU.returnFalse;
  GU.getObjectByInfo("gravity_button").addEventListener(
    "click",
    Utils.proxy(this.hideGravityHints, this)
  );
  GU.getObjectByCustomInfo("starBridge").addEventListener(
    "click",
    Utils.proxy(this.moveBridge, this)
  );
};
levelsScripts.Level1.prototype.hideGravityHints = function () {
  if (this.hint1 && !this.hint1.startHide) {
    this.hint1.startHide = true;
    GU.destroyByOpacity(this.hint1);
    GU.destroyByOpacity(this.arrow1);
    GU.destroyByOpacity(this.hintCircle1);
  }
  if (this.hint2 && !this.hint2.startHide) {
    this.hint2.startHide = true;
    GU.destroyByOpacity(this.hint2);
    GU.destroyByOpacity(this.arrow2);
    GU.destroyByOpacity(this.hintCircle2);
  }
};
levelsScripts.Level1.prototype.setCogwheelProps = function () {
  var cogwheels = this.cogwheels;
  for (var i = 0; i < cogwheels.length; i++) cogwheels[i].setStatic(true);
};
levelsScripts.Level1.prototype.ifShowCogwheels = function () {
  if (bob.x < 260 || this.cogwheelsShown) return;
  this.cogwheelsShown = true;
  this.door.setStatic(false);
  GU.startTween(this.door, "y", this.door.y - 80, 2e3);
  playSound("l1_PanelOpen");
  this.coverDoor.setStatic(false);
  this.hint3 = handlers.addHint("tips2_lvl1", 76, 24, 400, 150);
  this.arrow3 = handlers.addHintArrow(365, 128, -Math.PI / 3);
  this.hintCircle3 = handlers.addHintCircle(329, 116, 0.65);
  this.hintCircle3.setZIndex(1);
};
levelsScripts.Level1.prototype.showFirstHint = function () {
  if (bob.x < 90 || bob.x > 100 || this.hint1 || world.m_gravity.y < 0) return;
  this.hint1 = handlers.addHint("tips1_lvl1", 110, 24, 270, 110);
  this.arrow1 = handlers.addHintArrow(340, 110, Math.PI / 2);
  this.hintCircle1 = handlers.addHintCircle(387.5, 106);
};
levelsScripts.Level1.prototype.showSecondHint = function () {
  if (bob.x < 220 || bob.x > 230 || this.hint2 || world.m_gravity.y > 0) return;
  this.hint2 = handlers.addHint("tips3_lvl1", 92, 10, 270, 110);
  this.arrow2 = handlers.addHintArrow(340, 110, Math.PI / 2, true);
  this.hintCircle2 = handlers.addHintCircle(387.5, 106);
};
levelsScripts.Level1.prototype.moveBridge = function () {
  var bridge = GU.getObjectByInfo("bridge");
  var arr = this.cogwheels.slice(0);
  arr.push(this.coverDoor);
  arr.push(this.door);
  var angle = 3 * Math.PI,
    duration = 5e3;
  handlers.moveBridge(bridge, "y", 125, duration, arr);
  this.cogwheels[0].rotateBy(angle, duration);
  this.cogwheels[1].rotateBy(angle, duration);
  this.cogwheels[2].rotateBy(-angle, duration);
  this.setHintsForStars();
  playSound("l1_Conveyour");
};
levelsScripts.Level1.prototype.setHintsForStars = function () {
  GU.destroyByOpacity(this.hint3);
  GU.destroyByOpacity(this.arrow3);
  GU.destroyByOpacity(this.hintCircle3);
  var starTop = GU.getObjectByCustomInfo("starTop");
  var starBottom = GU.getObjectByCustomInfo("starBottom");
  if (starTop) {
    starTop.arrow = handlers.addHintArrow(
      starTop.x + 35,
      starTop.y,
      -Math.PI / 2
    );
    starTop.hint = handlers.addHintCircle(starTop.x, starTop.y, 0.65);
    starTop.onclick = levelsScripts.Level1.destroyStarHints;
  }
  if (starBottom) {
    starBottom.arrow = handlers.addHintArrow(
      starBottom.x - 35,
      starBottom.y,
      Math.PI / 2
    );
    starBottom.hint = handlers.addHintCircle(starBottom.x, starBottom.y, 0.65);
    starBottom.onclick = levelsScripts.Level1.destroyStarHints;
  }
};
levelsScripts.Level1.prototype.pretick = function () {
  this.ifShowCogwheels();
  this.showFirstHint();
  this.showSecondHint();
};
levelsScripts.Level1.destroyStarHints = function (e) {
  GU.destroyByOpacity(e.target.arrow);
  GU.destroyByOpacity(e.target.hint);
};
levelsScripts.Level2 = function () {
  this.btnPress = GU.getObjectByCustomInfo("btn_press");
  this.hint5 = handlers.addHint("tips5_lvl2", 102, 24, 193, 80);
  this.hint4 = handlers.addHint("tips4_lvl2", 80, 12, this.hint5.x, 100);
  this.arrow1 = handlers.addHintArrow(this.hint5.x, 120, Math.PI);
  this.wall1 = GU.getObjectByCustomInfo("shock_wall1");
  this.wall2 = GU.getObjectByCustomInfo("shock_wall2");
  this.wall1.play();
  this.wall2.play();
  this.cover1 = GU.getObjectByCustomInfo("cover1");
  this.cover2 = GU.getObjectByCustomInfo("cover2");
  this.wall1.scaleY = -1;
};
levelsScripts.Level2.prototype.init = function () {
  handlers.buttonPress.call(
    this.btnPress,
    Utils.proxy(this.processBtnPress, this)
  );
  handlers.flipGrandpa();
  this.addHint1Listener();
  this.addShockSprites();
};
levelsScripts.Level2.prototype.addShockSprites = function () {
  var shockSprite = new Sprite(null, 4, 76);
  shockSprite.isShock = true;
  shockSprite.setPosition(-4, 0);
  var s1 = this.wall1.addChild(shockSprite);
  var s2 = this.wall2.addChild(shockSprite.clone());
  handlers.addShockListener(s1);
  handlers.addShockListener(s2);
};
levelsScripts.Level2.prototype.processBtnPress = function () {
  var moveTime = 5e3;
  handlers.moveBridge(
    this.wall1,
    "y",
    this.wall1.y - 50,
    moveTime,
    this.cover1
  );
  handlers.moveBridge(
    this.wall2,
    "y",
    this.wall2.y + 50,
    moveTime + 500,
    this.cover2,
    null,
    Utils.proxy(this.checkHint2, this)
  );
  playSound("l1_PanelOpen");
};
levelsScripts.Level2.prototype.addHint1Listener = function () {
  var self = this;
  btn = this.btnPress;
  bob.addEventListener("click", _checkButtonPosition);
  function _checkButtonPosition() {
    if (GU.getDistance(bob, btn) < 35) {
      bob.removeEventListener("click", _checkButtonPosition);
      self.hint5.destroy = true;
      self.hint4.destroy = true;
      self.arrow1.destroy = true;
    }
  }
};
levelsScripts.Level2.prototype.checkHint2 = function () {
  if (bob.state != "hide") return;
  var hint6 = handlers.addHint("tips6_lvl2", 92, 24, 193, 90);
  var arrow = handlers.addHintArrow(hint6.x, 120, Math.PI);
  bob.addEventListener("click", _removeHints);
  function _removeHints() {
    bob.removeEventListener("click", _removeHints);
    hint6.destroy = true;
    arrow.destroy = true;
  }
};
levelsScripts.Level2.prototype.checkHint3 = function () {
  if (this.isHint3Shown) return;
  if (bob.x > 300 && bob.x < 345 && world.GetGravity().y > 0) {
    this.isHint3Shown = true;
    this.showHint3();
  }
};
levelsScripts.Level2.prototype.showHint3 = function () {
  var gb = GU.getObjectByInfo("gravity_button"),
    self = this;
  var hint3 = handlers.addHint("tips3_lvl2", 110, 24, gb.x - 110, gb.y);
  var arrow3 = handlers.addHintArrow(hint3.x + 70, hint3.y, Math.PI / 2);
  gb.addEventListener("click", _handleClick);
  function _handleClick() {
    gb.removeEventListener("click", _handleClick);
    hint3.destroy = true;
    arrow3.destroy = true;
    self.addHint4Listener();
  }
};
levelsScripts.Level2.prototype.addHint4Listener = function () {
  var self = this;
  stage.setTimeout(_checkGravity, 3e3);
  function _checkGravity() {
    if (world.GetGravity().y < 0) self.showHint5();
  }
};
levelsScripts.Level2.prototype.showHint5 = function () {
  var gb = GU.getObjectByInfo("gravity_button"),
    self = this;
  var hint2 = handlers.addHint("tips2_lvl2", 74, 10, gb.x - 100, gb.y);
  var arrow4 = handlers.addHintArrow(hint2.x + 60, hint2.y, Math.PI / 2);
  gb.addEventListener("click", _handleClick);
  function _handleClick() {
    gb.removeEventListener("click", _handleClick);
    hint2.destroy = true;
    arrow4.destroy = true;
    self.addHint4Listener();
  }
};
levelsScripts.Level2.prototype.checkStarHints = function () {
  if (bob.x < 360 || this.starHintShown) return;
  this.starHintShown = true;
  var stars = GU.getObjectByInfo("star");
  if (Utils.isArray(stars)) stars.forEach(_setEventsForStars);
  else _setEventsForStars(stars);
  function _setEventsForStars(s) {
    var arrow = _getMyArrow(s);
    s.addEventListener("click", function () {
      arrow.destroy = true;
    });
  }
  function _getMyArrow(star) {
    var prop = {};
    switch (star.custom) {
      case "star1":
      case "star3":
        prop = { x: star.x - 25, y: star.y + 15, angle: Math.PI / 4 };
        break;
      case "star2":
        prop = { x: star.x + 30, y: star.y, angle: -Math.PI / 2 };
        break;
    }
    return handlers.addHintArrow(prop.x, prop.y, prop.angle);
  }
};
levelsScripts.Level2.prototype.checkHint4 = function () {
  if (
    this.isHint4Shown ||
    bob.state == "hide" ||
    GU.getDistance(bob, this.btnPress) > 35
  )
    return;
  this.isHint4Shown = true;
  var sign = new Sprite(bitmaps.tips1_lvl2, 54, 12);
  sign.setPosition(-50, -10);
  bob.addChild(sign);
  var arrow = new Sprite(bitmaps.arrow_yellow, 20, 30);
  arrow.setPosition(-50, 5);
  arrow.rotation = Math.PI / 2;
  bob.addChild(arrow);
  var hintCircle = handlers.addHintCircle(0, 0);
  GU.changeParent(hintCircle, bob);
  bob.addEventListener("mousedown", _handleTap);
  function _handleTap() {
    bob.removeEventListener("mousedown", _handleTap);
    sign.destroy = true;
    arrow.destroy = true;
    hintCircle.destroy = true;
  }
};
levelsScripts.Level2.prototype.pretick = function () {
  this.checkHint3();
  this.checkHint4();
  this.checkStarHints();
};
levelsScripts.Level3 = function () {
  this.bridge = GU.getObjectByInfo("bridge");
  this.coverBridge = GU.getObjectByCustomInfo("coverBridge");
  this.hint = null;
};
levelsScripts.Level3.prototype.init = function () {
  handlers.buttonPress.call(
    GU.getObjectByInfo("btn"),
    Utils.proxy(this.moveBridge, this)
  );
  handlers.setBaraban(
    GU.getObjectByInfo("baraban"),
    GU.getObjectByInfo("button")
  );
};
levelsScripts.Level3.prototype.moveBridge = function () {
  handlers.moveBridge(
    this.bridge,
    "y",
    this.bridge.y + 78,
    1e3,
    this.coverBridge
  );
  playSound("l3_DoorLeft");
};
levelsScripts.Level3.prototype.ifCloseDoor = function () {
  if (bob.x > 135 || this.bridge.closed) return;
  this.bridge.closed = true;
  handlers.moveBridge(
    this.bridge,
    "y",
    this.bridge.y - 78,
    1e3,
    this.coverBridge
  );
  playSound("l3_DoorRight");
};
levelsScripts.Level3.prototype.ifShowHint = function () {
  if (bob.y > 65 || bob.x < 205 || this.hint) return;
  this.hint = handlers.addHint("tips_lvl3", 138, 43, 115 - X_OFFSET, 100);
  handlers.addHintCircle(12, -1, 0.7, field.speedIndicator);
  handlers.addHintArrow(65 - X_OFFSET, 60, -0.6);
};
levelsScripts.Level3.prototype.pretick = function () {
  this.ifCloseDoor();
  this.ifShowHint();
};
levelsScripts.Level4 = function () {
  this.shockLine1 = GU.getObjectByCustomInfo("shock1");
  this.shockLine2 = GU.getObjectByCustomInfo("shock2");
  this.rocket = GU.getObjectByCustomInfo("rocket");
  this.rocketWindow = GU.getObjectByCustomInfo("window");
  this.crane1 = GU.getObjectByCustomInfo("crane");
  this.lift = GU.getObjectByCustomInfo("lift");
};
levelsScripts.Level4.prototype.init = function () {
  this.setShockListeners();
  this.setWindowFix();
  this.addCrane();
  this.changeGravityForce();
  this.lift.setZIndex(11);
  bob.needContactCheck = false;
};
levelsScripts.Level4.prototype.setShockListeners = function () {
  this.shockLine1.play();
  this.shockLine2.play();
  var s1 = new Sprite(null, this.shockLine1.width, 1);
  s1.rotation = Math.PI / 14;
  this.shockLine1.addChild(s1);
  var s2 = new Sprite(null, this.shockLine2.width, 1);
  this.shockLine2.addChild(s2);
  handlers.addShockListener(s1);
  handlers.addShockListener(s2);
};
levelsScripts.Level4.prototype.changeGravityForce = function () {
  world.m_gravity.y = 5;
};
levelsScripts.Level4.prototype.setWindowFix = function () {
  var w = this.rocketWindow;
  var anchor = { x: -23, y: -5 };
  w.anchor = anchor;
  w.setPosition(w.x + anchor.x, w.y + anchor.y);
};
levelsScripts.Level4.prototype.addCrane = function () {
  var crane2 = this.crane1.clone();
  crane2.scaleX = -1;
  crane2.setPosition(this.crane1.x + 45, this.crane1.y);
  crane2.setZIndex(this.crane1.zIndex);
  this.crane2 = stageSpr.addChild(crane2);
};
levelsScripts.Level4.prototype.moveBobToLift = function () {
  bob.changeState("walk");
  world.DestroyBody(bob.box2dBody);
  bob.moveTo(
    this.lift.x,
    this.lift.y - this.lift.height / 2 - bob.height / 2 + 4,
    500,
    null,
    Utils.proxy(this.moveLift, this)
  );
};
levelsScripts.Level4.prototype.moveLift = function () {
  var time = 1500,
    dist = 50;
  handlers.moveBridge(
    this.lift,
    "y",
    this.lift.y - dist,
    time,
    null,
    null,
    Utils.proxy(this.turnBob, this)
  );
  bob.moveTo(bob.x, bob.y - dist, time);
  playSound("l1_PanelOpen");
};
levelsScripts.Level4.prototype.turnBob = function () {
  this.lift.setStatic(false);
  bob.changeState("beforeRocket");
  stage.setTimeout(Utils.proxy(this.prepareLaunch, this), 1e3);
};
levelsScripts.Level4.prototype.prepareLaunch = function () {
  var self = this;
  var door = this.rocketWindow;
  var rocket = this.rocket;
  GU.changeParent(bob, rocket, true);
  door.rotateBy((3 * Math.PI) / 4, 800, null, function () {
    GU.changeParent(door, rocket, true);
    door.setZIndex(20);
    self.addFire();
    stage.setTimeout(Utils.proxy(self.clearPath, self), 2e3);
  });
};
levelsScripts.Level4.prototype.clearPath = function () {
  var animTime = 1e3;
  world.DestroyBody(this.crane1.box2dBody);
  this.crane1.moveTo(this.crane1.x - 60, this.crane1.y, animTime);
  this.crane2.moveTo(this.crane2.x + 60, this.crane2.y, animTime);
  handlers.moveBridge(
    this.lift,
    "y",
    this.lift.y + 100,
    animTime,
    null,
    null,
    Utils.proxy(this.lauchRocket, this)
  );
  playSound("l1_PanelOpen");
};
levelsScripts.Level4.prototype.addFire = function () {
  var r = this.rocket;
  stage.setInterval(_addFlame, 150);
  function _addFlame() {
    var pos = { x: r.x, y: r.y + 65 };
    var fRed = new Graphics.circle(pos.x, pos.y, 7);
    fRed.setZIndex(r.zIndex - 1);
    fRed.color = fRed.fillColor = "#FF3300";
    var fYel = new Graphics.circle(0, 0, 7);
    fYel.color = fYel.fillColor = "#FFD83D";
    fRed.addChild(fYel);
    stageSpr.addChild(fRed);
    fYel.fadeTo(0, 300);
    fRed.scaleTo(0, 600, null, function () {
      fRed.destroy = true;
    });
    fRed.moveTo(fRed.x, fRed.y + 60, 1e3);
  }
};
levelsScripts.Level4.prototype.lauchRocket = function () {
  this.rocket.moveTo(
    this.rocket.x,
    -200,
    2500,
    Easing.exponential.easeIn,
    showVictoryScreen
  );
  playSound("l4_zapusk_rakety_new");
};
levelsScripts.Level4.prototype.checkLiftReached = function () {
  if (bob.x < 350 || bob.isOnLift) return;
  bob.isOnLift = true;
  this.moveBobToLift();
};
levelsScripts.Level4.prototype.pretick = function () {
  this.checkLiftReached();
};
levelsScripts.Level5 = function () {
  this.leftBattery = GU.getObjectByCustomInfo("leftBattery");
  this.rightBattery = GU.getObjectByCustomInfo("rightBattery");
  this.porthole = null;
  this.leftLeaf = null;
  this.coverGravityButton = null;
  this.moveBattery = Utils.proxy(this.moveBattery, this);
  this.checkBattery = Utils.proxy(this.checkBattery, this);
};
levelsScripts.Level5.prototype.init = function () {
  this.setLeafHandlers();
  this.setBatteryHandlers();
  this.startWelcomeMonster();
  handlers.setAccordionButton(
    GU.getObjectByInfo("button"),
    GU.getObjectByInfo("bridge_accordion")
  );
  if (prevState !== STATE_GAME) {
    this.fallOfRocket();
    this.setLeftLeaf();
    this.setCoverGravityButton();
  } else {
    this.setStaticRocket();
    this.createBob2();
  }
};
levelsScripts.Level5.prototype.setStaticRocket = function () {
  var rocket = GU.addSprite(stageSpr, "rocket_lvl5", 62, 112, 88, 163, true);
  GU.addSprite(rocket, "cover_rocket", 62, 22, 5, 53.5, true);
  var porthole = GU.addSprite(
    stageSpr,
    "porthole",
    40,
    40,
    46,
    195.25,
    true,
    2
  );
  porthole.gotoAndStop(1);
  porthole.rotation = -5.7;
};
levelsScripts.Level5.prototype.createBob2 = function () {
  var lo = { type: "Bob", x: 175, y: 198, rotation: 0 };
  var ob = findObject("Bob");
  ObjectManager.create(lo, ob, stageSpr);
  bob.init();
};
levelsScripts.Level5.prototype.setCoverGravityButton = function () {
  this.coverGravityButton = GU.addSprite(
    stageSpr,
    "cover_gravity_button_lvl5",
    52,
    52,
    311.5,
    256
  );
  this.coverGravityButton.onclick = GU.returnFalse;
};
levelsScripts.Level5.prototype.setLeftLeaf = function () {
  var lo = { type: "leaflet_lvl5", x: 69, y: 34, rotation: -1.1 };
  var ob = findObject("leaflet_lvl5");
  this.leftLeaf = createObject(lo, ob, stageSpr);
  stage.setTimeout(Utils.proxy(this.fallLeftLeaf, this), 2600);
};
levelsScripts.Level5.prototype.fallLeftLeaf = function () {
  var sequence = [
    {
      tweens: [
        { prop: "opacity", to: 0 },
        { prop: "rotation", to: 1.7 },
        { prop: "x", to: 120 },
        { prop: "y", to: 160 },
      ],
      duration: 3e3,
      onfinish: GU.destroyObjFromTween,
    },
  ];
  Animation.play(this.leftLeaf, sequence);
};
levelsScripts.Level5.prototype.fallOfRocket = function () {
  var duration = 3e3;
  var rocket = GU.addSprite(stageSpr, "rocket_lvl5", 62, 112, 30, -100);
  rocket.stop();
  rocket.moveTo(
    88,
    163,
    duration,
    Easing.exponential.easeIn,
    this.rocketExplosion
  );
  var porthole = GU.addSprite(rocket, "porthole", 40, 40, 2, 7, false, 2);
  porthole.rotation = -2;
  porthole.stop();
  this.porthole = porthole;
  stage.setTimeout(Utils.proxy(this.fallPorthole, this), duration * 0.98);
  stage.setTimeout(function () {
    playSound("l6_krushenie_rakety");
  }, duration / 2);
};
levelsScripts.Level5.prototype.breakPorthole = function (e) {
  var c = e.target.box2dBody.GetContactList();
  while (c) {
    if (c.contact.IsTouching()) {
      e.target.gotoAndStop(1);
      e.target.onprerender = null;
    }
    c = c.next;
  }
};
levelsScripts.Level5.prototype.fallPorthole = function () {
  var porthole = this.porthole;
  GU.changeParent(porthole, stageSpr, true);
  this.bobAnim(porthole.x, porthole.y + 10);
  var lo = {
    type: "porthole",
    x: porthole.x,
    y: porthole.y,
    rotation: porthole.rotation,
  };
  var ob = findObject("porthole");
  ObjectManager.createBody(lo, ob, porthole);
  var body = porthole.box2dBody;
  body.SetAngularVelocity(-4);
  body.SetLinearVelocity(new b2Vec2(-3, -1.2));
  body.SetLinearDamping(2);
  porthole.onprerender = this.breakPorthole;
};
levelsScripts.Level5.prototype.bobAnim = function (x, y) {
  var bobAnim = GU.addSprite(stageSpr, "BobHide", 35, 42, x, y, false, 11);
  bobAnim.gotoAndStop(10);
  bobAnim.scaleX = -1;
  bobAnim.anchor = { x: 0, y: 3 };
  var duration = 1300;
  bobAnim.rotateBy(
    Math.PI * 4 - Math.PI / 4,
    duration,
    false,
    GU.destroyObjFromTween
  );
  var t = new PathTween(
    bobAnim,
    [
      { x: 84, y: 152 },
      { x: 89, y: 143 },
      { x: 96, y: 134 },
      { x: 105, y: 130 },
      { x: 119, y: 126 },
      { x: 132, y: 133 },
      { x: 140, y: 153 },
      { x: 147, y: 175 },
      { x: 152, y: 198 },
    ],
    true
  );
  t.start(duration, false, Utils.proxy(this.createBob1, this));
};
levelsScripts.Level5.prototype.createBob1 = function () {
  var lo = { type: "Bob", x: 155, y: 198, rotation: 0, custom: "left" };
  var ob = findObject("Bob");
  ObjectManager.create(lo, ob, stageSpr);
  bob.init();
  bob.changeState("growl");
  bob.box2dBody.SetLinearVelocity(new b2Vec2(-0.7, -1.3));
  stage.setTimeout(levelsScripts.Level5.bobTurn, 800);
  stage.setTimeout(Utils.proxy(this.prepareForStart, this), 3500);
};
levelsScripts.Level5.prototype.prepareForStart = function () {
  world.DestroyBody(this.porthole.box2dBody);
  this.porthole.setStatic(true);
  GU.startTween(
    this.coverGravityButton,
    "y",
    350,
    500,
    false,
    GU.destroyObjFromTween
  );
  playSound("l1_PanelOpen");
};
levelsScripts.Level5.prototype.rocketExplosion = function (e) {
  var rocket = e.target.obj;
  GU.addSprite(rocket, "cover_rocket", 62, 22, 5, 53.5);
  var explosion = GU.addTilesSprite(
    rocket,
    "rocket_explosion",
    124,
    118,
    14,
    7,
    2,
    5,
    15
  );
  explosion.changeFrameDelay = 30;
  explosion.onchangeframe = function (e) {
    var obj = e.target;
    if (obj.currentFrameX === 12) {
      obj.destroy = true;
      obj.parent.setStatic(true);
    }
  };
};
levelsScripts.Level5.prototype.startWelcomeMonster = function () {
  var monster = GU.getObjectByInfo("welcome_monster");
  monster.changeFrameDelay = 50;
  monster.play();
};
levelsScripts.Level5.prototype.setLeafHandlers = function () {
  var leafs = GU.getObjectByInfo("leaflet_lvl5");
  for (var i = 0; i < leafs.length; i++)
    leafs[i].onclick = levelsScripts.Level5.fallLeaves;
};
levelsScripts.Level5.prototype.setBatteryHandlers = function () {
  this.leftBattery.finishX = this.leftBattery.x + 35;
  this.rightBattery.finishX = this.rightBattery.x - 35;
  this.leftBattery.onclick = this.rightBattery.onclick = this.moveBattery;
};
levelsScripts.Level5.prototype.moveBattery = function (e) {
  var battery = e.target;
  battery.setStatic(false);
  battery.onclick = null;
  GU.startTween(battery, "x", battery.finishX, 500, false, this.checkBattery);
  playSound("l3_DoorRight");
};
levelsScripts.Level5.prototype.checkBattery = function (e) {
  e.target.obj.moved = true;
  e.target.obj.setStatic(true);
  if (this.leftBattery.moved && this.rightBattery.moved) {
    GU.getObjectByInfo("slide_doors").play();
    var coverBattery = GU.addSprite(
      stageSpr,
      "battery_cover",
      66,
      34,
      171.5,
      248
    );
    coverBattery.opacity = 0;
    coverBattery.fadeTo(
      1,
      500,
      false,
      levelsScripts.Level5.setStaticAfterTween
    );
    playSound("l1_star2");
  }
};
levelsScripts.Level5.prototype.pretick = function () {};
levelsScripts.Level5.bobTurn = function (e) {
  bob.changeState("turn");
};
levelsScripts.Level5.setStaticAfterTween = function (e) {
  e.target.obj.setStatic(true);
};
levelsScripts.Level5.fallLeaves = function (e) {
  var leaf = e.target;
  leaf.onclick = null;
  var finishY = 160;
  var duration = finishY - leaf.y;
  var sequence = [
    {
      tweens: [
        { prop: "opacity", to: 0 },
        { prop: "rotation", to: 1.7 },
        { prop: "x", to: 120 },
        { prop: "y", to: finishY },
      ],
      duration: finishY * 7,
      onfinish: GU.destroyObjFromTween,
    },
  ];
  Animation.play(leaf, sequence);
  playSound("l6_LeafDrop");
  return false;
};
levelsScripts.Level6 = function () {
  this.alien = GU.getObjectByInfo("alien_snail");
  this.lamps = GU.getObjectByInfo("lamp");
  this.tentacles = null;
  this.tentaclesInt = null;
};
levelsScripts.Level6.prototype.init = function () {
  this.setBridgesHandlers();
  this.setTentacles();
  this.flowerSettings();
  handlers.setTeleports(this.alien);
  this.lamps[0].gotoAndStop(1);
  this.lamps[1].gotoAndStop(1);
};
levelsScripts.Level6.prototype.flowerSettings = function () {
  var flower = GU.getObjectByInfo("flower_lvl7");
  flower.setStatic(true);
  flower.animDelay = 3;
  flower.onchangeframe = levelsScripts.Level6.flowerChangeFrame;
  flower.onclick = function () {
    flower.setStatic(false);
    flower.play();
  };
};
levelsScripts.Level6.prototype.setTentacles = function () {
  GU.getObjectByInfo("entrance").onclick = GU.returnFalse;
  this.tentacles = GU.addSprite(stageSpr, "tentacles2_lvl7", 16, 62, 122, -20);
  this.tentacles.setZIndex(9);
  this.tentacles.hidden = true;
  var lo = { type: "star16", x: -2, y: +13, rotation: 0 };
  var ob = findObject(lo.type);
  var star = createObject(lo, ob, this.tentacles);
  star.setStatic(false);
  star.onclick = Utils.proxy(this.stopTentacles, this);
  GU.addSprite(this.tentacles, "tentacles1_lvl7", 12, 32, 2, 15);
  this.tentaclesInt = stage.setInterval(
    Utils.proxy(this.starAppearing, this),
    5e3
  );
};
levelsScripts.Level6.prototype.stopTentacles = function () {
  stage.clearInterval(this.tentaclesInt);
  this.tentacles.setStatic(true);
};
levelsScripts.Level6.prototype.starAppearing = function () {
  GU.startTween(this.tentacles, "y", this.tentacles.hidden ? 16 : -20, 500);
  this.tentacles.hidden = !this.tentacles.hidden;
};
levelsScripts.Level6.prototype.setBridgesHandlers = function () {
  var bridges = GU.getObjectByInfo("bridge_accordion");
  var button = GU.getObjectByInfo("button");
  for (var i = 0; i < bridges.length; i++)
    handlers.setAccordionButton(button, bridges[i]);
  button.addEventListener("click", Utils.proxy(this.toggleLamps, this));
};
levelsScripts.Level6.prototype.toggleLamps = function () {
  var lamps = this.lamps;
  for (var i = 0; i < lamps.length; i++) lamps[i].toggle();
};
levelsScripts.Level6.flowerChangeFrame = function (e) {
  var obj = e.target;
  if (!obj.animated) return;
  if (obj.currentFrameX === 7) {
    obj.gotoAndStop(8);
    obj.setStatic(true);
  }
  if (obj.currentFrameX === 16) {
    obj.gotoAndStop(17);
    var lo = { type: "star1", x: obj.x - 36, y: obj.y - 19, rotation: 0 };
    var ob = findObject(lo.type);
    var star = createObject(lo, ob, stageSpr);
    star.onclick = GU.returnFalse;
    star.setZIndex(1);
    obj.star = star;
    obj.setStatic(true);
  }
  if (obj.currentFrameX === 26) {
    obj.stop();
    obj.setStatic(true);
    obj.onclick = null;
    obj.star.onclick = null;
    obj.setStatic(true);
  }
};
levelsScripts.Level7 = function () {
  this.btnPress = GU.getObjectByCustomInfo("btn_red");
  this.door = GU.getObjectByCustomInfo("star_door");
};
levelsScripts.Level7.prototype.init = function () {
  handlers.buttonPress.call(
    this.btnPress,
    Utils.proxy(this.processBtnPress, this)
  );
  this.pushBob();
  this.setAlienKids();
};
levelsScripts.Level7.prototype.pushBob = function () {
  bob.changeState("hide");
  var body = bob.box2dBody;
  body.ApplyImpulse(new b2Vec2(6, 2), body.GetPosition());
};
levelsScripts.Level7.prototype.processBtnPress = function () {
  this.door.play();
};
levelsScripts.Level7.prototype.setAlienKids = function () {
  var kidsArr = GU.getObjectByInfo("alien_kid");
  kidsArr.forEach(function (k) {
    k.animDelay = 3;
    k.play();
  });
};
levelsScripts.Level7.prototype.pretick = function () {};
levelsScripts.Level8 = function () {
  this.btnGreen = GU.getObjectByCustomInfo("btn_green");
  this.starGate = GU.getObjectByCustomInfo("star_cover");
  this.alien = GU.getObjectByCustomInfo("alien");
  this.flipper1 = GU.getObjectByCustomInfo("flipper1");
  this.flipper2 = GU.getObjectByCustomInfo("flipper2");
  this.mouth = GU.getObjectByCustomInfo("mouth");
  this.door1 = GU.getObjectByCustomInfo("door1");
  this.door2 = GU.getObjectByCustomInfo("door2");
  this.btn1 = GU.getObjectByCustomInfo("btn1");
  this.btn2 = GU.getObjectByCustomInfo("btn2");
  this.b1 = GU.getObjectByCustomInfo("b1");
  this.b2 = GU.getObjectByCustomInfo("b2");
  this.b3 = GU.getObjectByCustomInfo("b3");
  this.l1_1 = GU.getObjectByCustomInfo("l1_1");
  this.l1_2 = GU.getObjectByCustomInfo("l1_2");
  this.l1_3 = GU.getObjectByCustomInfo("l1_3");
  this.l2_1 = GU.getObjectByCustomInfo("l2_1");
  this.l2_2 = GU.getObjectByCustomInfo("l2_2");
  this.l2_3 = GU.getObjectByCustomInfo("l2_3");
  this.b1.index = 1;
  this.b2.index = 2;
  this.b3.index = 3;
};
levelsScripts.Level8.prototype.init = function () {
  bob.needContactCheck = true;
  handlers.setBaraban(this.flipper1, this.btn1);
  handlers.setBaraban(this.flipper2, this.btn2);
  GU.getObjectByCustomInfo("star2").setStatic(true);
  GU.getObjectByCustomInfo("star_cover2").setStatic(true);
  this.btnGreen.onclick = Utils.proxy(this.openStarGate, this);
  handlers.buttonPress.call(this.b1, Utils.proxy(this.processBtnPress, this));
  handlers.buttonPress.call(this.b2, Utils.proxy(this.processBtnPress, this));
  handlers.buttonPress.call(this.b3, Utils.proxy(this.processBtnPress, this));
  this.door2.scaleX *= -1;
  this.mouth.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrame == 6) src.stop();
  };
  this.setAlienInterval();
};
levelsScripts.Level8.prototype.processBtnPress = function (btn) {
  var index = btn.index;
  this["l1_" + index].currentFrame = 1;
  this["l2_" + index].currentFrame = 1;
  btn.isPressed = true;
  this.checkDoorsOpen();
};
levelsScripts.Level8.prototype.checkDoorsOpen = function () {
  if (!this.b1.isPressed || !this.b2.isPressed || !this.b3.isPressed) return;
  world.DestroyBody(this.door1.box2dBody);
  world.DestroyBody(this.door2.box2dBody);
  var shift = 15;
  this.door1.anchor.x = -shift;
  this.door2.anchor.x = -shift;
  this.door1.x -= shift;
  this.door2.x += shift;
  this.door1.rotateBy(Math.PI / 2, 250);
  this.door2.rotateBy(Math.PI / 2, 250);
  playSound("l6_CorrectButton");
  playSound("l1_PanelOpen");
};
levelsScripts.Level8.prototype.openStarGate = function () {
  var gate = this.starGate;
  if (gate.isMoving) return;
  gate.isMoving = true;
  gate.moveTo(gate.x, gate.y - 45, 500, null, function () {
    stage.setTimeout(function () {
      gate.moveTo(gate.x, gate.y + 45, 500, null, function () {
        gate.isMoving = false;
      });
      playSound("l3_DoorLeft");
    }, 500);
  });
  playSound("l3_DoorLeft");
};
levelsScripts.Level8.prototype.checkIfMayCloseMouth = function () {
  if (this.isMouthClosed || bob.x < 90) return;
  this.isMouthClosed = true;
  this.mouth.play();
  ObjectManager.create(
    {
      type: "invisible_wall_small",
      x: this.mouth.x + 2,
      y: this.mouth.y,
      rotation: Math.PI / 2,
    },
    findObject("invisible_wall_small"),
    stageSpr
  );
  field.hideInvisibleImg();
};
levelsScripts.Level8.prototype.setAlienInterval = function () {
  handlers.setAlienMove(this.alien, "x", 250, 4e3);
};
levelsScripts.Level8.prototype.checkFall = function () {
  if (bob.y > 220) bob.speed = 0;
};
levelsScripts.Level8.prototype.checkWallSlide = function () {
  var slideWalls = [],
    objects = stageSpr.objects;
  for (var i = 0, j = objects.length; i < j; i++)
    if (objects[i].custom == "cancel_speed") slideWalls.push(objects[i]);
  var isTouch = false;
  for (var i = 0; i < slideWalls.length; i++)
    if (box2d.hitTest(bob.box2dBody, slideWalls[i].box2dBody)) isTouch = true;
  bob.cancelSpeed = isTouch;
};
levelsScripts.Level8.prototype.pretick = function () {
  this.checkIfMayCloseMouth();
  this.checkFall();
  this.checkWallSlide();
};
levelsScripts.Level9 = function () {
  this.rays = [];
  this.scans = [];
  this.alien = null;
  this.ufo = null;
  this.ufoInt = null;
  this.bridge1 = GU.getObjectByCustomInfo("bridge1");
  this.lamp1 = GU.getObjectByCustomInfo("lamp1");
  this.cover1 = GU.getObjectByCustomInfo("cover1");
  this.bridge2 = GU.getObjectByCustomInfo("bridge2");
  this.lamp2 = GU.getObjectByCustomInfo("lamp2");
  this.cover2 = GU.getObjectByCustomInfo("cover2");
  this.setAlien = Utils.proxy(this.setAlien, this);
  this.getAlien = Utils.proxy(this.getAlien, this);
  this.destroyScan = Utils.proxy(this.destroyScan, this);
  this.flowerHide = Utils.proxy(this.flowerHide, this);
  this.flowerAction = Utils.proxy(this.flowerAction, this);
};
levelsScripts.Level9.prototype.init = function () {
  this.setRays();
  this.setAlien();
  this.setUfo();
  GU.getObjectByInfo("button").onclick = Utils.proxy(this.buttonAction, this);
  var portal = GU.getObjectByInfo("portal_lvl9");
  portal.play();
  portal.animDelay = 3;
  this.setScan(44, 28);
  this.setScan(144.5, 31.5);
  this.cover1.setStatic(true);
  this.cover2.setStatic(true);
  this.lamp1.setStatic(true);
  this.lamp2.setStatic(true);
};
levelsScripts.Level9.prototype.setUfo = function () {
  this.ufo = GU.addSprite(stageSpr, null, 1, 1, -50 - X_OFFSET, 151);
  var lo = { type: "star1", x: 0, y: 0, rotation: 0 };
  var star = createObject(lo, findObject(lo.type), this.ufo);
  star.setStatic(false);
  star.onclick = Utils.proxy(this.stopShowUfo, this);
  this.ufoInt = stage.setInterval(Utils.proxy(this.ufoAppearing, this), 8e3);
  GU.addSprite(this.ufo, "ufo_lvl9", 54, 38);
};
levelsScripts.Level9.prototype.stopShowUfo = function () {
  stage.clearInterval(this.ufoInt);
};
levelsScripts.Level9.prototype.ufoAppearing = function () {
  var sequence = [
    {
      tweens: [{ prop: "x", to: 70 }],
      duration: 700,
      ease: Easing.quadratic.easeOut,
    },
    { tweens: [{ prop: "x", to: 70 }], duration: 1500 },
    { tweens: [{ prop: "x", to: -50 - X_OFFSET }], duration: 500 },
  ];
  Animation.play(this.ufo, sequence);
};
levelsScripts.Level9.prototype.buttonAction = function () {
  if (this.alien.speed == 0) playSound("l17_vspomogatelny_shar_poyavlenie");
  this.alien.speed = 1.8;
};
levelsScripts.Level9.prototype.setRays = function () {
  for (var i = 0, j = stageSpr.objects.length; i < j; i++)
    if (stageSpr.objects[i].custom === "ray")
      this.rays.push(stageSpr.objects[i]);
};
levelsScripts.Level9.prototype.setAlien = function () {
  var lo = { type: "alien_snail", x: 71, y: 86, rotation: 0 };
  var alien = createObject(lo, findObject(lo.type), stageSpr);
  alien.setZIndex(1);
  alien.needContactCheck = false;
  alien.speed = 0;
  alien.box2dBody.SetLinearDamping(7);
  alien.opacity = 0;
  alien.fadeTo(1, 400);
  this.alien = alien;
};
levelsScripts.Level9.prototype.alienDie = function () {
  var alien = this.alien;
  if (alien.died) return;
  alien.died = true;
  alien.bitmap = bitmaps.alien_snail_on_ray;
  alien.width = 76;
  alien.height = 68;
  alien.framesCount = 18;
  alien.totalFrames = 9;
  alien.gotoAndPlay(0);
  alien.box2dBody.SetActive(false);
  alien.setZIndex(15);
  alien.onchangeframe = function (e) {
    var obj = e.target;
    if (obj.currentFrameX === obj.framesCount - 2) GU.deleteObject(obj);
  };
  stage.setTimeout(this.setAlien, 1e3);
  playSound("l11_smert_ot_lucha");
};
levelsScripts.Level9.prototype.setScan = function (y, height) {
  var scan = GU.addSprite(stageSpr, null, 16, 66, 460, y);
  scan.light = GU.addSprite(scan, "scan_light_lvl9", 16, 66, 0, 0, false, 9);
  scan.light.gotoAndStop(8);
  scan.light.setZIndex(2);
  GU.addSprite(scan, "scan_lvl9", 160, 12, 72, -height);
  GU.addSprite(scan, "scan_lvl9", 160, 12, 72, height).scaleY = -1;
  scan.setStatic(true);
  this.scans.push(scan);
};
levelsScripts.Level9.prototype.getAlien = function () {
  var scan;
  var alien = this.alien;
  if (alien.y < 93) scan = this.scans[0];
  else scan = this.scans[1];
  playSound("l11_scanner");
  scan.setStatic(false);
  scan.light.totalFrames = 8;
  scan.light.gotoAndPlay(0);
  var sequence = [
    {
      tweens: [{ prop: "x", to: alien.x - 20 }],
      duration: 500,
      onfinish: function () {
        GU.changeParent(alien, scan, true);
        alien.setZIndex(1);
      },
    },
    {
      tweens: [{ prop: "x", to: 500 + X_OFFSET }],
      duration: 500,
      onfinish: this.destroyScan,
    },
  ];
  Animation.play(scan, sequence);
};
levelsScripts.Level9.prototype.destroyScan = function (e) {
  var scan = e.target.obj;
  scan.destroy = true;
  var ray = GU.addSprite(
    stageSpr,
    "ray_lvl9",
    8,
    74,
    399,
    scan.y === 44 ? 43.5 : 140.5,
    true
  );
  this.rays.push(ray);
  this.setAlien();
  var num = this.rays.length === 6 ? 1 : 2;
  var bridge = this["bridge" + num];
  var lamp = this["lamp" + num];
  var cover = this["cover" + num];
  lamp.setStatic(false);
  cover.setStatic(false);
  bridge.toggle();
  lamp.gotoAndStop(1);
  stage.setTimeout(function () {
    lamp.setStatic(true);
    cover.setStatic(true);
  }, 1e3);
  playSound("l6_CorrectButton");
};
levelsScripts.Level9.prototype.checkAlienOnRay = function () {
  var rays = this.rays;
  var alien = this.alien;
  if (alien.died) return;
  for (var i = 0; i < rays.length; i++) {
    if (!rays[i].hitTest(alien)) continue;
    var rect = rays[i].getAABBRectangle();
    if (
      (alien.x + alien.width / 2 - 5 > rect.center.x - rect.width / 2 &&
        alien.x - alien.width / 2 + 5 < rect.center.x + rect.width / 2) ||
      (alien.y + alien.height / 2 - 3 > rect.center.y - rect.height / 2 &&
        alien.y - alien.height / 2 + 3 < rect.center.y + rect.height / 2)
    )
      this.alienDie();
  }
};
levelsScripts.Level9.prototype.checkAlienGoAway = function () {
  var alien = this.alien;
  if (!alien.died && alien.x > 405) {
    alien.died = true;
    world.DestroyBody(alien.box2dBody);
    GU.startTween(
      alien,
      "y",
      alien.y > 93 ? 141 : 45,
      300,
      false,
      this.getAlien
    );
  }
};
levelsScripts.Level9.prototype.pretick = function () {
  this.checkAlienOnRay();
  this.checkAlienGoAway();
};
levelsScripts.Level10 = function () {
  this.starCover = GU.getObjectByCustomInfo("star_cover");
  this.starFrame = GU.getObjectByCustomInfo("star_frame");
  this.grass = GU.getObjectByCustomInfo("grass");
  this.btnFlip = GU.getObjectByCustomInfo("btn");
  this.flipper = GU.getObjectByCustomInfo("flipper");
  this.alien = GU.getObjectByCustomInfo("alien");
  this.btnRight = GU.getObjectByCustomInfo("btn_right");
  this.btnLeft = GU.getObjectByCustomInfo("btn_left");
  this.platform = GU.getObjectByCustomInfo("platform");
  this.blockRay = GU.getObjectByCustomInfo("block_ray");
};
levelsScripts.Level10.prototype.init = function () {
  this.addStarCoverHandler();
  this.addGrassHandler();
  this.setAlienInterval();
  this.addPlatformHandlers();
  this.hideBlockRay();
  this.setAlienStar();
  handlers.setBaraban(this.flipper, this.btnFlip);
};
levelsScripts.Level10.prototype.hideBlockRay = function () {
  this.blockRay.opacity = 0;
};
levelsScripts.Level10.prototype.setAlienInterval = function () {
  handlers.setAlienMove(this.alien, "y", -130, 2700);
};
levelsScripts.Level10.prototype.setAlienStar = function () {
  var alien = this.alien;
  var star = new Sprite(bitmaps.star3_lvl10, 30, 30);
  star.setZIndex(alien.zIndex - 1);
  handlers.starHandler.call(star);
  star.setStatic(false);
  stageSpr.addChild(star);
  star.addEventListener("prerender", function () {
    if (!star.collected) star.setPosition(alien.x, alien.y - 14);
  });
};
levelsScripts.Level10.prototype.addGrassHandler = function () {
  this.grass.onclick = function (e) {
    var src = e.target;
    src.play();
    src.onclick = null;
    playSound("l6_LeafDrop");
    return false;
  };
  this.grass.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrame == src.totalFrames - 1) src.stop();
  };
};
levelsScripts.Level10.prototype.addPlatformHandlers = function () {
  handlers.movePlatform.call(this.btnRight, this.platform, this.platform.x);
  handlers.movePlatform.call(this.btnLeft, this.platform, 165);
  this.btnLeft.addEventListener("mousedown", function () {
    playSound("l3_DoorLeft");
  });
  this.btnRight.addEventListener("mousedown", function () {
    playSound("l3_DoorRight");
  });
  this.btnRight.setPropScale(1.2);
  this.btnLeft.setPropScale(1.2);
};
levelsScripts.Level10.prototype.addStarCoverHandler = function () {
  var frame = this.starFrame;
  frame.onclick = GU.returnFalse;
  this.starCover.onclick = function (e) {
    var src = e.target;
    src.moveTo(src.x, src.y - 27, 350);
    src.onclick = null;
    frame.onclick = null;
    playSound("l3_DoorRight");
    return false;
  };
};
levelsScripts.Level10.prototype.checkIfNeedShowRay = function () {
  if (this.rayIsShown || bob.y < 160) return;
  var rayHeight = this.blockRay.height;
  this.rayIsShown = true;
  this.blockRay.fadeTo(1, 250);
  handlers.addRayListener(this.blockRay);
  this.blockRay.height = rayHeight;
  playSound("L8_S2_laser_in");
};
levelsScripts.Level10.prototype.pretick = function () {
  this.checkIfNeedShowRay();
  handlers.ifBobFall(220);
};
levelsScripts.Level11 = function () {
  this.isMouthClosed = false;
  this.mouth = GU.getObjectByInfo("teeth");
  this.alien = GU.getObjectByInfo("alien_snail");
  this.bridge1 = GU.getObjectByCustomInfo("bridge1_open");
  this.bridge2 = GU.getObjectByCustomInfo("bridge2_open");
  this.bridge3 = GU.getObjectByCustomInfo("bridge3");
  this.buttonBridge = GU.getObjectByCustomInfo("buttonBridge");
  this.actors = [bob, this.alien];
};
levelsScripts.Level11.prototype.init = function () {
  handlers.setTeleports(this.alien);
  handlers.buttonPress.call(
    this.buttonBridge,
    Utils.proxy(this.bridge3.toggle, this.bridge3),
    this.actors
  );
  this.setDoorsHandlers();
};
levelsScripts.Level11.prototype.setDoorsHandlers = function () {
  for (var i = 1; i <= 3; i++) {
    var button = GU.getObjectByCustomInfo("button" + i);
    var doors = GU.getObjectByCustomInfo("doors" + i);
    handlers.buttonPress.call(
      button,
      Utils.proxy(levelsScripts.Level11.openDoor, doors),
      this.actors,
      20
    );
  }
};
levelsScripts.Level11.prototype.ifMayCloseMouth = function () {
  if (this.isMouthClosed || bob.y < 50) return;
  this.isMouthClosed = true;
  this.mouth.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrame == 6) {
      src.stop();
      src.onchangeframe = null;
      src.setStatic(true);
      GU.getObjectByInfo("entrance").setStatic(true);
    }
  };
  this.mouth.play();
  var lo = { type: "invisible_wall_big", x: 42, y: 12, rotation: -0.05 };
  createObject(lo, findObject(lo.type), stageSpr).visible = false;
};
levelsScripts.Level11.prototype.ifCloseBridge1 = function () {
  if (this.bridge1.shown || bob.y < 80) return;
  this.bridge1.toggle();
};
levelsScripts.Level11.prototype.ifCloseBridge2 = function () {
  if (this.buttonBridge.currentFrame === 0 || this.bridge2.shown) return;
  if (
    GU.getDistance(bob, this.buttonBridge) > 50 &&
    GU.getDistance(this.alien, this.buttonBridge) > 50
  )
    this.bridge2.toggle();
};
levelsScripts.Level11.openDoor = function () {
  this.play();
  playSound("l3_DoorRight");
};
levelsScripts.Level11.prototype.pretick = function () {
  this.ifMayCloseMouth();
  this.ifCloseBridge1();
  this.ifCloseBridge2();
};
levelsScripts.Level12 = function () {
  this.gravityCover = GU.getObjectByCustomInfo("gravity_cover");
  this.hat = GU.getObjectByCustomInfo("hat");
  this.satellite = GU.getObjectByCustomInfo("satellite");
  this.laser = GU.getObjectByCustomInfo("shock");
  this.obstacle = GU.getObjectByCustomInfo("obstacle");
  this.light = GU.getObjectByCustomInfo("light");
  this.btnPress = GU.getObjectByCustomInfo("btn_press");
  this.btnRed = GU.getObjectByCustomInfo("btn_red");
  this.alien = GU.getObjectByCustomInfo("alien");
};
levelsScripts.Level12.prototype.init = function () {
  GU.getObjectByCustomInfo("eye1").setZIndex(20);
  GU.getObjectByCustomInfo("eye2").setZIndex(20);
  this.laser.play();
  this.gravityCover.onclick = GU.returnFalse;
  this.alien.box2dBody.SetLinearDamping(0);
  this.setHatHandler();
  this.setSatelliteMovement();
  this.setBtnHandler();
  this.setBtnPressHandler();
};
levelsScripts.Level12.prototype.setBtnHandler = function () {
  this.btnRed.onclick = Utils.proxy(this.processAlienBtnPress, this);
};
levelsScripts.Level12.prototype.setBtnPressHandler = function () {
  handlers.buttonPress.call(
    this.btnPress,
    Utils.proxy(this.processBtnPress, this),
    this.alien
  );
};
levelsScripts.Level12.prototype.processAlienBtnPress = function () {
  if (this.btnRed.isPressed) return;
  this.btnRed.isPressed = true;
  this.obstacle.toggle();
};
levelsScripts.Level12.prototype.setHatHandler = function () {
  var hat = this.hat;
  hat.isLocked = true;
  hat.onchangeframe = function (e) {
    var src = e.target;
    if (!src.animated) return;
    if (src.currentFrameX == src.framesCount - 1) {
      src.gotoAndStop(0);
      src.isLocked = true;
    }
    if (src.currentFrameX == 21) {
      src.stop();
      stage.setTimeout(function () {
        src.gotoAndPlay(22);
      }, 1e3);
    }
  };
  hat.onclick = function (e) {
    var src = e.target;
    if (!src.isLocked) return true;
    src.isLocked = false;
    src.play();
    playSound("l6_LeafDrop");
    return false;
  };
  var angle = Math.PI / 30;
  function _rotate() {
    hat.rotateBy(angle, 1500, null, _rotate);
    angle *= -1;
  }
  _rotate();
};
levelsScripts.Level12.prototype.setSatelliteMovement = function () {
  var satellite = this.satellite,
    stepTime = 1e3;
  _move1();
  function _move1() {
    satellite.moveTo(satellite.x - 5, satellite.y + 7, stepTime);
    satellite.rotateTo(Math.PI / 48, stepTime, null, _move2);
  }
  function _move2() {
    satellite.moveTo(satellite.x + 5, satellite.y + 5, stepTime);
    satellite.rotateTo((3 * Math.PI) / 48, stepTime, null, _move3);
  }
  function _move3() {
    satellite.moveTo(satellite.x + 3, satellite.y - 5, stepTime);
    satellite.rotateTo(-Math.PI / 48, stepTime, null, _move4);
  }
  function _move4() {
    satellite.moveTo(satellite.x - 3, satellite.y - 7, stepTime);
    satellite.rotateTo((-3 * Math.PI) / 48, stepTime, null, _move1);
  }
};
levelsScripts.Level12.prototype.processBtnPress = function () {
  var self = this;
  this.laser.fadeTo(0, 150, null, function (e) {
    e.target.obj.destroy = true;
    self.laser = null;
  });
  this.light.gotoAndStop(1);
  this.gravityCover.moveTo(
    this.gravityCover.x,
    this.gravityCover.y + 80,
    500,
    null,
    function () {
      self.gravityCover.destroy = true;
      self.gravityCover = null;
    }
  );
  playSound("l1_PanelOpen");
  playSound("l7_elektro_zamikanie_7");
};
levelsScripts.Level12.prototype.pretick = function () {};
levelsScripts.Level13 = function () {
  this.btnPress = GU.getObjectByCustomInfo("btn_press");
  this.light = GU.getObjectByCustomInfo("light");
  this.shocker = GU.getObjectByCustomInfo("shock");
  this.bridge = GU.getObjectByCustomInfo("bridge_open");
  this.btnBridge = GU.getObjectByCustomInfo("btn1");
  this.btnFlipp = GU.getObjectByCustomInfo("btn2");
  this.flipper = GU.getObjectByCustomInfo("flipper");
  this.exitSign = GU.getObjectByCustomInfo("exit");
  this.mouth = GU.getObjectByCustomInfo("mouth");
  this.stopWall = GU.getObjectByCustomInfo("stop_wall");
};
levelsScripts.Level13.prototype.init = function () {
  GU.getObjectByCustomInfo("eye1").setZIndex(20);
  GU.getObjectByCustomInfo("eye2").setZIndex(20);
  this.setBtnPressHandler();
  this.setBtnBridgeHandler();
  this.setFlipper();
  this.setExitMovement();
  this.mouth.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrame == 6) src.stop();
  };
};
levelsScripts.Level13.prototype.setBtnPressHandler = function () {
  handlers.buttonPress.call(
    this.btnPress,
    Utils.proxy(this.processBtnPress, this)
  );
};
levelsScripts.Level13.prototype.processBtnPress = function () {
  var shocker = this.shocker;
  shocker.fadeTo(0, 200, null, function () {
    shocker.destroy = true;
  });
  this.light.gotoAndStop(1);
  playSound("l7_elektro_zamikanie_7");
};
levelsScripts.Level13.prototype.setBtnBridgeHandler = function () {
  var bridge = this.bridge;
  this.btnBridge.onclick = function () {
    bridge.toggle();
  };
};
levelsScripts.Level13.prototype.setFlipper = function () {
  handlers.setBaraban(this.flipper, this.btnFlipp);
};
levelsScripts.Level13.prototype.setExitMovement = function () {
  var sign = this.exitSign,
    originalPos = sign.y,
    shiftDownLimit = 3,
    shiftUpLimit = 6;
  _moveThere();
  function _moveThere() {
    var distance = GU.randInt(shiftUpLimit, shiftDownLimit);
    sign.moveTo(sign.x, sign.y + distance, 500, null, function () {
      sign.moveTo(sign.x, sign.y - distance, 500, null, _moveThere);
    });
  }
};
levelsScripts.Level13.prototype.checkIfMayCloseMouth = function () {
  if (this.isMouthClosed || bob.x < 240) return;
  this.isMouthClosed = true;
  this.mouth.play();
  ObjectManager.create(
    {
      type: "invisible_wall_small",
      x: this.mouth.x + 2,
      y: this.mouth.y,
      rotation: Math.PI / 2,
    },
    findObject("invisible_wall_small"),
    stageSpr
  );
  field.hideInvisibleImg();
};
levelsScripts.Level13.prototype.checkAndFixVeticalFlight = function () {
  bob.cancelSpeed = box2d.hitTest(bob.box2dBody, this.stopWall.box2dBody);
};
levelsScripts.Level13.prototype.pretick = function () {
  this.checkIfMayCloseMouth();
  this.checkAndFixVeticalFlight();
};
levelsScripts.Level14 = function () {
  this.wheels = GU.getObjectByInfo("wheel_lvl15");
  this.wheelObj = GU.addSprite(stageSpr, null, 115, 10, 242, 125);
  this.alien = GU.getObjectByInfo("alien_snail");
  this.actors = [bob, this.alien];
};
levelsScripts.Level14.prototype.init = function () {
  handlers.setSpring(
    GU.getObjectByInfo("spring"),
    GU.getObjectByInfo("button")
  );
  this.setStarProps();
  this.wheelObj.opacity = 0;
  handlers.buttonPress.call(GU.getObjectByCustomInfo("btn2"), this.btn2Action);
  handlers.buttonPress.call(
    GU.getObjectByCustomInfo("btn1"),
    this.btn1Action,
    this.alien
  );
  this.setLampsStatic();
};
levelsScripts.Level14.prototype.setLampsStatic = function () {
  var lamps = GU.getObjectByInfo("lamp");
  for (var i = 0; i < lamps.length; i++) lamps[i].setStatic(true);
};
levelsScripts.Level14.prototype.btn2Action = function () {
  GU.getObjectByCustomInfo("bridge1").toggle();
  GU.getObjectByCustomInfo("bridge2").toggle();
  GU.getObjectByCustomInfo("bridge3_open").toggle();
  GU.getObjectByCustomInfo("lamp1").gotoAndStop(1);
  GU.getObjectByCustomInfo("lamp2").gotoAndStop(1);
  GU.getObjectByCustomInfo("lamp3").gotoAndStop(1);
  GU.getObjectByCustomInfo("lamp_btn2").gotoAndStop(1);
  stage.refreshBackground();
};
levelsScripts.Level14.prototype.btn1Action = function () {
  GU.getObjectByCustomInfo("bridge4").toggle();
  GU.getObjectByCustomInfo("lamp4").gotoAndStop(1);
  GU.getObjectByCustomInfo("lamp_btn1").gotoAndStop(1);
  stage.refreshBackground();
};
levelsScripts.Level14.prototype.setStarProps = function () {
  var star = GU.getObjectByCustomInfo("star");
  star.setStatic(false);
  star.onprerender = levelsScripts.Level14.rotateStar;
  star.onclick = levelsScripts.Level14.getStar;
};
levelsScripts.Level14.prototype.rotateWheels = function () {
  var wheels = this.wheels;
  var angle = wheels[0].box2dBody.GetAngle() + 0.3;
  for (var i = 0; i < wheels.length; i++) wheels[i].box2dBody.SetAngle(angle);
};
levelsScripts.Level14.prototype.ifActorOnWheels = function () {
  var actor;
  for (var i = 0; i < this.actors.length; i++) {
    actor = this.actors[i];
    if (actor.hitTest(this.wheelObj)) {
      if (actor.onWheels && actor.speed < 0) continue;
      if (actor.x > 165) {
        actor.cancelSpeed = false;
        actor.speed -= SnailBob.SPEED_WALK * 4;
        actor.onWheels = true;
      } else actor.box2dBody.m_linearVelocity.x = 0;
    } else if (actor.onWheels) {
      actor.onWheels = false;
      var tween = GU.startTween(actor, "speed", 0, 700);
      tween.onfinish = levelsScripts.Level14.setSpeedAfterWheels;
    }
  }
};
levelsScripts.Level14.prototype.pretick = function () {
  this.rotateWheels();
  this.ifActorOnWheels();
};
levelsScripts.Level14.setSpeedAfterWheels = function (e) {
  var actor = e.target.obj;
  if (actor === bob) actor.speed = SnailBob.states[actor.state].speed;
  else actor.speed = SnailBob.SPEED_WALK;
};
levelsScripts.Level14.getStar = function (e) {
  var star = e.target;
  star.rotation = 0;
  star.onprerender = null;
};
levelsScripts.Level14.rotateStar = function (e) {
  e.target.rotation += 0.3;
};
levelsScripts.Level15 = function () {
  this.mouth = GU.getObjectByCustomInfo("mouth");
  this.pressBtn1 = GU.getObjectByCustomInfo("press_btn1");
  this.pressBtn2 = GU.getObjectByCustomInfo("press_btn2");
  this.btnRed = GU.getObjectByCustomInfo("btn_red");
  this.bridge1 = GU.getObjectByCustomInfo("bridge1");
  this.bridge2 = GU.getObjectByCustomInfo("bridge2");
  this.bridge3 = GU.getObjectByCustomInfo("bridge3");
  this.bridge4 = GU.getObjectByCustomInfo("bridge4");
  this.light1 = GU.getObjectByCustomInfo("l1");
  this.light2 = GU.getObjectByCustomInfo("l2");
  this.light3 = GU.getObjectByCustomInfo("l3");
  this.light4 = GU.getObjectByCustomInfo("l4");
  this.light5 = GU.getObjectByCustomInfo("l5");
  this.light6 = GU.getObjectByCustomInfo("l6");
  this.alien = GU.getObjectByCustomInfo("alien");
  this.removePlatform = GU.getObjectByCustomInfo("remove_platform");
  this.spring = GU.getObjectByCustomInfo("spring");
};
levelsScripts.Level15.prototype.init = function () {
  GU.getObjectByCustomInfo("eye1").setZIndex(20);
  GU.getObjectByCustomInfo("eye2").setZIndex(20);
  this.alien.box2dBody.SetLinearDamping(0);
  handlers.buttonPress.call(
    this.pressBtn1,
    Utils.proxy(this.processBtnPress1, this),
    this.alien
  );
  handlers.buttonPress.call(
    this.pressBtn2,
    Utils.proxy(this.processBtnPress2, this)
  );
  this.mouth.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrame == 6) src.stop();
  };
  this.setSpringHandler();
};
levelsScripts.Level15.prototype.processBtnPress1 = function () {
  this.light1.gotoAndStop(1);
  this.light3.gotoAndStop(1);
  this.light6.gotoAndStop(1);
  this.bridge1.toggle();
  this.bridge3.toggle();
};
levelsScripts.Level15.prototype.processBtnPress2 = function () {
  this.light2.gotoAndStop(1);
  this.light4.gotoAndStop(1);
  this.light5.gotoAndStop(1);
  this.bridge2.toggle();
  this.bridge4.toggle();
};
levelsScripts.Level15.prototype.checkIfMayCloseMouth = function () {
  if (this.isMouthClosed || bob.x < 70) return;
  GU.deleteObject(this.removePlatform);
  this.isMouthClosed = true;
  this.mouth.play();
  ObjectManager.create(
    {
      type: "invisible_wall_small",
      x: this.mouth.x + 2,
      y: this.mouth.y,
      rotation: Math.PI / 2,
    },
    findObject("invisible_wall_small"),
    stageSpr
  );
  field.hideInvisibleImg();
};
levelsScripts.Level15.prototype.setSpringHandler = function () {
  handlers.setSpring(this.spring, this.btnRed);
};
levelsScripts.Level15.prototype.pretick = function () {
  this.checkIfMayCloseMouth();
};
levelsScripts.Level16 = function () {
  this.shock1 = GU.getObjectByInfo("electricity_lvl17");
  this.shock2 = GU.getObjectByInfo("electricity2_lvl17");
  this.hat = GU.getObjectByInfo("hat_lvl17");
  this.star = GU.getObjectByCustomInfo("star");
  this.wheels = GU.getObjectByInfo("wheel_lvl17");
  this.conveyor = GU.addSprite(stageSpr, null, 165, 10, 250, 14);
  this.lamps = GU.getObjectByInfo("lamp");
  this.slipperySprite = null;
  this.rotateHat1 = Utils.proxy(this.rotateHat1, this);
  this.rotateHat2 = Utils.proxy(this.rotateHat2, this);
  this.moveHat = Utils.proxy(this.moveHat, this);
  this.toggleConveyor = Utils.proxy(this.toggleConveyor, this);
  this.isConveyorOn = false;
};
levelsScripts.Level16.prototype.init = function () {
  GU.getObjectByCustomInfo("eye1").setZIndex(16);
  GU.getObjectByCustomInfo("eye2").setZIndex(21);
  GU.getObjectByInfo("button").onclick = this.toggleConveyor;
  this.lamps.forEach(function (item) {
    item.setStatic(true);
  });
  this.conveyor.opacity = 0;
  this.shockSettings();
  this.hatSettings();
  this.bobSettings();
  this.addSlipperySprite();
  handlers.buttonPress.call(
    GU.getObjectByInfo("btn"),
    Utils.proxy(this.moveBridge, this)
  );
};
levelsScripts.Level16.prototype.addSlipperySprite = function () {
  var mc = GU.addSprite(stageSpr, null, 255, 5, 212, 208);
  mc.rotation = 0.516;
  this.slipperySprite = mc;
};
levelsScripts.Level16.prototype.ifBobSlip = function () {
  if (bob.isBobOnConveyor || !bob.box2dBody.IsActive()) return;
  if (bob.hitTest(this.slipperySprite)) bob.speed += 0.035;
  else bob.speed = SnailBob.states[bob.state].speed || 0;
};
levelsScripts.Level16.prototype.moveBridge = function () {
  GU.getObjectByInfo("bridge_accordion").toggle();
  this.lamps.forEach(function (lamp) {
    lamp.gotoAndStop(1);
  });
  stage.refreshBackground();
};
levelsScripts.Level16.prototype.ifBobOnConveyor = function () {
  if (this.isConveyorOn && bob.hitTest(this.conveyor)) {
    if (!bob.isBobOnConveyor || bob.speed >= 0) {
      bob.isBobOnConveyor = true;
      bob.speed -= 4;
    }
  } else if (bob.isBobOnConveyor || bob.speed < 0) {
    bob.isBobOnConveyor = false;
    bob.speed = SnailBob.states[bob.state].speed;
  }
};
levelsScripts.Level16.prototype.rotateWheels = function () {
  if (!this.isConveyorOn) return;
  var wheels = this.wheels;
  var angle = wheels[0].box2dBody.GetAngle() + 0.3;
  for (var i = 0; i < wheels.length; i++) wheels[i].box2dBody.SetAngle(angle);
};
levelsScripts.Level16.prototype.toggleConveyor = function () {
  this.isConveyorOn = !this.isConveyorOn;
  if (this.isConveyorOn && gameSaves.isSoundOn)
    this.soundChannel = mixer.play("l1_Conveyour", true, false, 6);
  else if (this.soundChannel) this.soundChannel.stop();
};
levelsScripts.Level16.prototype.hatSettings = function () {
  var hat = this.hat;
  hat.animDelay = 2;
  hat.onchangeframe = levelsScripts.Level16.hatOnchangeframe;
  hat.anchor = { x: -5, y: 0 };
  this.rotateHat1();
  hat.onclick = GU.returnFalse;
  stage.setInterval(this.moveHat, 1e4);
};
levelsScripts.Level16.prototype.moveHat = function (e) {
  var hat = this.hat;
  if (e.target.repeat) {
    if (this.star.collected) {
      stage.clearInterval(e.target);
      return;
    }
    stage.setTimeout(this.moveHat, 2e3);
  }
  hat.play();
  hat.removeTweens();
  this["rotateHat" + (e.target.repeat ? 2 : 1)]();
};
levelsScripts.Level16.prototype.rotateHat1 = function () {
  var hat = this.hat;
  var sequence = [
    {
      tweens: [
        { prop: "rotation", to: -0.02 },
        { prop: "y", to: 48 },
      ],
      duration: 800,
    },
    {
      tweens: [
        { prop: "rotation", to: 0 },
        { prop: "y", to: 49 },
      ],
      duration: 800,
      onfinish: this.rotateHat1,
    },
  ];
  Animation.play(hat, sequence);
};
levelsScripts.Level16.prototype.rotateHat2 = function () {
  var hat = this.hat;
  var sequence = [
    { tweens: [{ prop: "rotation", to: -0.2 }], duration: 800 },
    {
      tweens: [{ prop: "rotation", to: 0.2 }],
      duration: 800,
      onfinish: this.rotateHat2,
    },
  ];
  Animation.play(hat, sequence);
};
levelsScripts.Level16.prototype.bobSettings = function () {
  bob.changeState("hide");
  var body = bob.box2dBody;
  body.ApplyImpulse(new b2Vec2(4, 0), body.GetPosition());
};
levelsScripts.Level16.prototype.shockSettings = function () {
  this.shock1.visible = false;
  stage.setInterval(Utils.proxy(this.shockInt, this), 5e3);
};
levelsScripts.Level16.prototype.shockInt = function () {
  var s1, s2;
  if (this.shock1.visible) {
    s1 = this.shock1;
    s2 = this.shock2;
  } else {
    s1 = this.shock2;
    s2 = this.shock1;
  }
  s1.fadeTo(0, 300, false, levelsScripts.Level16.setInvisible);
  s2.visible = true;
  s2.fadeTo(1, 300);
};
levelsScripts.Level16.prototype.pretick = function () {
  this.rotateWheels();
  this.ifBobOnConveyor();
  this.ifBobSlip();
};
levelsScripts.Level16.hatOnchangeframe = function (e) {
  var hat = e.target;
  if (hat.currentFrameX === 14) {
    hat.onclick = null;
    hat.gotoAndStop(15);
  }
  if (hat.currentFrameX === 30) {
    hat.onclick = GU.returnFalse;
    hat.gotoAndStop(0);
  }
};
levelsScripts.Level16.setInvisible = function (e) {
  e.target.obj.visible = !e.target.obj.visible;
};
levelsScripts.Level17 = function () {
  this.btnLeft = GU.getObjectByCustomInfo("crane_left");
  this.btnRight = GU.getObjectByCustomInfo("crane_right");
  this.starCover = GU.getObjectByCustomInfo("star_cover");
  this.crane = GU.getObjectByCustomInfo("crane");
  this.box = GU.getObjectByCustomInfo("star_box");
  this.door1 = GU.getObjectByCustomInfo("door1");
  this.door2 = GU.getObjectByCustomInfo("door2");
  this.flipper = GU.getObjectByCustomInfo("flipper");
  this.l1 = GU.getObjectByCustomInfo("l1");
  this.l2 = GU.getObjectByCustomInfo("l2");
  this.l3 = GU.getObjectByCustomInfo("l3");
  this.l4 = GU.getObjectByCustomInfo("l4");
  this.btn1 = GU.getObjectByCustomInfo("btn_1");
  this.btn2 = GU.getObjectByCustomInfo("btn_2");
  this.pressBtn1 = GU.getObjectByCustomInfo("press_btn1");
  this.pressBtn2 = GU.getObjectByCustomInfo("press_btn2");
  this.pressBtn3 = GU.getObjectByCustomInfo("press_btn3");
  this.spring = GU.getObjectByCustomInfo("spring");
};
levelsScripts.Level17.prototype.init = function () {
  this.btnLeft.scaleX *= -1;
  this.prepareStarCover();
  this.buildBox();
  this.addBoxSteelProperties();
  this.buildCrane();
  this.addArrowsHandlers();
  handlers.setSpring(this.spring, this.btn1);
  handlers.buttonPress.call(
    this.pressBtn1,
    Utils.proxy(this.openStarCover, this)
  );
  handlers.buttonPress.call(
    this.pressBtn2,
    Utils.proxy(this.processBtnPress2, this),
    this.box
  );
  handlers.buttonPress.call(
    this.pressBtn3,
    Utils.proxy(this.processBtnPress3, this)
  );
  handlers.setBaraban(this.flipper, this.btn2);
  handlers.setTeleports(this.box);
};
levelsScripts.Level17.prototype.prepareStarCover = function () {
  this.starCover.setZIndex(30);
  this.starCover.setStatic(false);
  this.starCover.onclick = GU.returnFalse;
};
levelsScripts.Level17.prototype.openStarCover = function () {
  var spr = this.starCover;
  spr.moveTo(spr.x, spr.y - 90, 3e3, null, function () {
    spr.destroy = true;
  });
};
levelsScripts.Level17.prototype.processBtnPress2 = function () {
  this.l2.gotoAndStop(1);
  this.l3.gotoAndStop(1);
  this.door2.toggle();
};
levelsScripts.Level17.prototype.processBtnPress3 = function () {
  this.l1.gotoAndStop(1);
  this.l4.gotoAndStop(1);
  this.door1.toggle();
};
levelsScripts.Level17.prototype.buildBox = function () {
  var star = ObjectManager.create(
    { type: "star1", x: 0, y: 0 },
    findObject("star1"),
    this.box
  );
  star.setStatic(false);
  star.addEventListener("click", function (e) {
    var src = e.target;
    if (src.isPicked) return;
    src.isPicked = true;
    stage.setTimeout(function () {
      cover.gotoAndPlay(10);
      playSound("l6_DoorOpeningShort");
    }, 1e3);
  });
  var cover = new Sprite(bitmaps.lvl18_box_question, 34, 32, 17);
  cover.animDelay = 2;
  cover.stop();
  cover.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrame == 9 || src.currentFrame == 16) src.stop();
  };
  cover.onclick = function (e) {
    var src = e.target;
    src.play();
    src.onclick = null;
    playSound("l6_DoorOpeningShort");
    return false;
  };
  this.box.addChild(cover);
};
levelsScripts.Level17.prototype.addBoxSteelProperties = function () {
  var self = this;
  this.box.onprerender = function (e) {
    var src = e.target;
    if (!self.lever.isOn) return;
    if (src.fixed) {
      var needPos = new b2Vec2(
        (self.magnet.x - 1) / box2d.SCALE,
        (self.magnet.y + 22) / box2d.SCALE
      );
      src.box2dBody.SetPosition(needPos);
    }
    if (!src.isPulled) self.addMagnetism();
  };
};
levelsScripts.Level17.prototype.buildCrane = function () {
  var crane = this.crane;
  this.lever = ObjectManager.create(
    { type: "lvl18_lever", x: 0, y: -41.5 },
    findObject("lvl18_lever"),
    crane
  );
  this.lever.onclick = Utils.proxy(this.toggleLever, this);
  var magnet = new TilesSprite(bitmaps.lvl18_magnet, 42, 54, 41, 14, 3);
  this.magnet = stageSpr.addChild(magnet);
  magnet.stop();
  magnet.setZIndex(crane.zIndex - 1);
  magnet.onprerender = function (e) {
    var src = e.target;
    src.setPosition(crane.x, crane.y + 40);
  };
  magnet.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrameX == 27) src.currentFrameX = 14;
    if (src.currentFrameX == src.framesCount - 1) src.gotoAndStop(0);
  };
};
levelsScripts.Level17.prototype.addArrowsHandlers = function () {
  var ease = Easing.sine.easeIn;
  this.crane.coords = [this.crane.x - 120, this.crane.x - 63, this.crane.x];
  this.crane.state = 2;
  handlers.moveFrogPlatform.call(this.btnLeft, this.crane, 500, ease);
  handlers.moveFrogPlatform.call(this.btnRight, this.crane, 500, ease);
  this.btnLeft.hitArea = {
    x: 0,
    y: 0,
    width: this.btnLeft.width * 2,
    height: this.btnLeft.height * 2,
  };
  this.btnRight.hitArea = {
    x: 0,
    y: 0,
    width: this.btnRight.width * 2,
    height: this.btnRight.height * 2,
  };
};
levelsScripts.Level17.prototype.toggleLever = function () {
  this.lever.isOn = !this.lever.isOn;
  if (this.lever.isOn) this.enableMagnet();
  else this.disableMagnet();
  playSound("LeverDouble");
};
levelsScripts.Level17.prototype.enableMagnet = function () {
  this.crane.gotoAndStop(1);
  this.magnet.gotoAndPlay(0);
  this.addMagnetism();
};
levelsScripts.Level17.prototype.disableMagnet = function () {
  this.crane.gotoAndStop(0);
  this.magnet.gotoAndPlay(28);
  this.removeMagnetism();
};
levelsScripts.Level17.prototype.addMagnetism = function () {
  var magnet = this.magnet,
    box = this.box,
    boxBody = box.box2dBody;
  if (box.isPulled) return;
  if (Math.abs(magnet.localToGlobal().x - box.x) > 50) return;
  box.isPulled = true;
  var boxRot = boxBody.GetAngle();
  var mod = boxRot % (Math.PI / 2);
  var r1 = boxRot - mod;
  var r2 = boxRot - mod + (boxRot > 0 ? Math.PI / 2 : -Math.PI / 2);
  var needRot;
  if (
    Math.abs(Math.abs(r1) - Math.abs(boxRot)) <
    Math.abs(Math.abs(r2) - Math.abs(boxRot))
  )
    needRot = r1;
  else needRot = r2;
  var rotDiff = needRot - boxRot;
  var boxPos = boxBody.GetPosition();
  var oldBoxPos = { x: boxPos.x, y: boxPos.y, rot: boxRot };
  box.pos = 0;
  var tween = stage.createTween(box, "pos", 0, 1, 500);
  tween.onchange = function () {
    var needPos = new b2Vec2(
      (magnet.x - 1) / box2d.SCALE,
      (magnet.y + 22) / box2d.SCALE
    );
    var xDiff = needPos.x - oldBoxPos.x;
    var yDiff = needPos.y - oldBoxPos.y;
    var boxPos = boxBody.GetPosition();
    boxPos.x = oldBoxPos.x + xDiff * box.pos;
    boxPos.y = oldBoxPos.y + yDiff * box.pos;
    var rot = oldBoxPos.rot + rotDiff * box.pos;
    boxBody.SetPositionAndAngle(boxPos, rot);
    console.log(boxPos);
  };
  tween.onfinish = function () {
    boxBody.SetAwake(false);
    var needPos = new b2Vec2(
      (magnet.x - 1) / box2d.SCALE,
      (magnet.y + 22) / box2d.SCALE
    );
    boxBody.SetPositionAndAngle(needPos, needRot);
    box.fixed = true;
  };
  tween.play();
};
levelsScripts.Level17.prototype.removeMagnetism = function () {
  var box = this.box;
  box.box2dBody.SetAwake(true);
  box.removeTweens();
  box.fixed = false;
  box.isPulled = false;
};
levelsScripts.Level17.prototype.pretick = function () {};
levelsScripts.Level18 = function () {
  this.ant = GU.getObjectByInfo("alien_snail");
  this.antRay = GU.getObjectByCustomInfo("ant_ray");
  this.btn = GU.getObjectByInfo("btn");
  this.lampBtn = GU.getObjectByCustomInfo("lamp_btn");
  this.bridge1 = GU.getObjectByCustomInfo("bridge1");
  this.bridge2 = GU.getObjectByCustomInfo("bridge2");
  this.lamp1 = GU.getObjectByCustomInfo("lamp_bridge1");
  this.lamp2 = GU.getObjectByCustomInfo("lamp_bridge2");
  this.cover1 = GU.getObjectByCustomInfo("cover1");
  this.cover2 = GU.getObjectByCustomInfo("cover2");
  this.isBridge1Shown = false;
};
levelsScripts.Level18.prototype.init = function () {
  handlers.setBaraban(
    GU.getObjectByInfo("baraban"),
    GU.getObjectByInfo("button")
  );
  GU.getObjectByCustomInfo("eye1").setZIndex(16);
  GU.getObjectByCustomInfo("eye2").setZIndex(16);
  this.antRay.opacity = 0;
  this.antOnchangeframe = Utils.proxy(this.antOnchangeframe, this);
  this.ant.speed = 1.3;
  stage.addEventListener("prerender", Utils.proxy(this.ifAntKilled, this));
  this.btn.onchangeframe = levelsScripts.Level18.btnOnchangeframe;
  this.lamp2.gotoAndStop(1);
  GU.getObjectByInfo("lamp").forEach(function (lamp) {
    lamp.setStatic(true);
  });
};
levelsScripts.Level18.prototype.moveBridges = function () {
  var bridgeHide, bridgeShow, arrHide, arrShow;
  if (this.isBridge1Shown) {
    bridgeHide = this.bridge1;
    bridgeShow = this.bridge2;
    arrHide = [this.lamp1, this.cover1];
    arrShow = [this.lamp2, this.cover2];
  } else {
    bridgeHide = this.bridge2;
    bridgeShow = this.bridge1;
    arrHide = [this.lamp2, this.cover2];
    arrShow = [this.lamp1, this.cover1];
  }
  handlers.moveBridge(bridgeShow, "x", 183, 500, arrShow);
  handlers.moveBridge(bridgeHide, "x", 46, 500, arrHide);
  arrShow[0].gotoAndStop(1);
  arrHide[0].gotoAndStop(0);
  this.isBridge1Shown = !this.isBridge1Shown;
  playSound("l3_DoorLeft");
};
levelsScripts.Level18.prototype.antOnchangeframe = function (e) {
  var ant = e.target;
  if (ant.currentFrame === 17)
    ant.box2dBody.SetPosition(new b2Vec2(32 / box2d.SCALE, 50 / box2d.SCALE));
  if (ant.currentFrame === 18) this.antGotoStart();
};
levelsScripts.Level18.prototype.ifAntKilled = function () {
  var ant = this.ant;
  if (ant.hitTest(this.antRay) && !ant.killed) {
    ant.bitmap = bitmaps.ant_killed;
    ant.totalFrames = 19;
    ant.width = 54;
    ant.height = 52;
    ant.animDelay = 1;
    ant.gotoAndPlay(0);
    ant.killed = true;
    ant.cancelSpeed = true;
    ant.box2dBody.SetLinearVelocity(new b2Vec2(0, 0));
    ant.box2dBody.SetAngularVelocity(0);
    ant.onchangeframe = this.antOnchangeframe;
    playSound("l11_smert_ot_lucha");
  }
};
levelsScripts.Level18.prototype.ifAntGoAway = function () {
  if (this.ant.y > 105 || this.ant.x > 445) {
    this.ant.box2dBody.SetPosition(
      new b2Vec2(32 / box2d.SCALE, 50 / box2d.SCALE)
    );
    this.antGotoStart();
  }
};
levelsScripts.Level18.prototype.antGotoStart = function () {
  var ant = this.ant;
  ant.bitmap = bitmaps.ant;
  ant.totalFrames = 17;
  ant.width = 42;
  ant.height = 44;
  ant.onchangeframe = null;
  ant.killed = false;
  ant.gotoAndPlay(0);
  ant.cancelSpeed = false;
  ant.animDelay = 2;
};
levelsScripts.Level18.prototype.ifAntPressBtn = function () {
  var btn = this.btn;
  if (GU.getDistance(this.ant, btn) < 25) {
    if (btn.currentFrame === 0) {
      btn.play();
      this.lampBtn.gotoAndStop(1);
      this.moveBridges();
      stage.refreshBackground();
      playSound("l1_ButtonGroundOn");
    }
  } else if (btn.currentFrame === 5) {
    btn.play();
    this.lampBtn.gotoAndStop(0);
    stage.refreshBackground();
    playSound("l1_ButtonGroundOff");
  }
};
levelsScripts.Level18.prototype.pretick = function () {
  this.ifAntGoAway();
  this.ifAntPressBtn();
};
levelsScripts.Level18.btnOnchangeframe = function (e) {
  var btn = e.target;
  if (btn.currentFrame === 4 && btn.animDirection === 1) {
    btn.gotoAndStop(5);
    btn.animDirection = -1;
  }
  if (btn.currentFrame === 1 && btn.animDirection === -1) {
    btn.gotoAndStop(0);
    btn.animDirection = 1;
  }
};
levelsScripts.Level19 = function () {
  this.platform1 = GU.getObjectByCustomInfo("platform1");
  this.platform2 = GU.getObjectByCustomInfo("platform2");
  this.doors2 = GU.getObjectByInfo("door_star_lvl13");
};
levelsScripts.Level19.prototype.init = function () {
  field.destination.scaleX = -1;
  GU.getObjectByCustomInfo("eye1").setZIndex(16);
  GU.getObjectByCustomInfo("eye2").setZIndex(20);
  GU.getObjectByInfo("button").forEach(function (btn) {
    btn.setPropScale(1.2);
  });
  this.platform2.onclick = GU.returnFalse;
  this.setAlienMove();
  this.setPlatformHandlers();
  this.setDoors2Props();
};
levelsScripts.Level19.prototype.setDoors2Props = function () {
  var doors = this.doors2;
  doors.animDelay = 3;
  doors.onclick = levelsScripts.Level19.setDoors2Action;
  doors.onchangeframe = levelsScripts.Level19.setDoors2Onchangeframe;
};
levelsScripts.Level19.prototype.setAlienMove = function () {
  handlers.setAlienMove(GU.getObjectByCustomInfo("alien1"), "x", -90, 3300);
  handlers.setAlienMove(GU.getObjectByCustomInfo("alien2"), "x", 165, 3300);
};
levelsScripts.Level19.prototype.setPlatformHandlers = function () {
  var platform1 = this.platform1,
    platform2 = this.platform2,
    btn1Left = GU.getObjectByCustomInfo("btn1_left"),
    btn1Right = GU.getObjectByCustomInfo("btn1_right"),
    btn2Left = GU.getObjectByCustomInfo("btn2_left"),
    btn2Right = GU.getObjectByCustomInfo("btn2_right");
  handlers.movePlatform.call(btn1Left, platform1, 217);
  handlers.movePlatform.call(btn1Right, platform1, 316);
  handlers.movePlatform.call(btn2Left, platform2, 137);
  handlers.movePlatform.call(btn2Right, platform2, 377);
  btn1Left.addEventListener("mousedown", function () {
    playSound("l3_DoorLeft");
  });
  btn2Left.addEventListener("mousedown", function () {
    playSound("l3_DoorLeft");
  });
  btn1Right.addEventListener("mousedown", function () {
    playSound("l3_DoorRight");
  });
  btn2Right.addEventListener("mousedown", function () {
    playSound("l3_DoorRight");
  });
};
levelsScripts.Level19.prototype.pretick = function () {
  handlers.ifBobFall(240);
};
levelsScripts.Level19.setDoors2Onchangeframe = function (e) {
  var doors = e.target;
  if (doors.currentFrameX === doors.framesCount - 2) {
    doors.destroy = true;
    doors.onclick = null;
  }
};
levelsScripts.Level19.setDoors2Action = function (e) {
  var doors = e.target;
  doors.play();
  stage.setTimeout(function () {
    playSound("l22_RockFalling");
  }, 800);
  return false;
};
levelsScripts.Level20 = function () {
  this.eye = GU.getObjectByCustomInfo("eye1");
  this.mouth = GU.getObjectByCustomInfo("mouth");
  this.gravityCover = GU.getObjectByCustomInfo("gravity_cover");
  this.cable1 = GU.getObjectByCustomInfo("c1");
  this.cable2 = GU.getObjectByCustomInfo("c2");
  this.cable3 = GU.getObjectByCustomInfo("c3");
  this.cable4 = GU.getObjectByCustomInfo("c4");
  this.light1 = GU.getObjectByCustomInfo("l1");
  this.light2 = GU.getObjectByCustomInfo("l2");
  this.light3 = GU.getObjectByCustomInfo("l3");
  this.light4 = GU.getObjectByCustomInfo("l4");
  this.btn1 = GU.getObjectByCustomInfo("b1");
  this.btn2 = GU.getObjectByCustomInfo("b2");
  this.btn3 = GU.getObjectByCustomInfo("b3");
  this.btn4 = GU.getObjectByCustomInfo("b4");
  this.lightUp = GU.getObjectByCustomInfo("l_up");
  this.lightDown = GU.getObjectByCustomInfo("l_down");
  this.ufo = GU.getObjectByCustomInfo("ship");
  this.cableCover = GU.getObjectByCustomInfo("cable_cover");
  this.stopWall = GU.getObjectByCustomInfo("stop_wall");
};
levelsScripts.Level20.prototype.init = function () {
  this.eye.setZIndex(20);
  this.cableCover.setZIndex(20);
  this.light1.setZIndex(20);
  this.light2.setZIndex(20);
  this.light3.setZIndex(20);
  this.light4.setZIndex(20);
  this.gravityCover.onclick = GU.returnFalse;
  this.buildUFO();
  this.addButtonsHandlers();
  if (prevState == STATE_GAME || prevState == STATE_GAME_OVER)
    this.initSecondPhase();
};
levelsScripts.Level20.prototype.buildUFO = function () {
  var hatch = new Sprite(bitmaps.lvl20_ufo_cover, 66, 42);
  hatch.setPosition(0, -14);
  hatch.setZIndex(10);
  this.ufo.addChild(hatch);
  this.ufo.hatch = hatch;
  hatch.x += 29;
  hatch.y += 14;
  hatch.anchor = { x: 29, y: 14 };
  var lights = new Sprite(bitmaps.lvl20_ufo_lamp, 76, 10, 14);
  lights.animDelay = 2;
  lights.setPosition(0, 11);
  this.ufo.addChild(lights);
};
levelsScripts.Level20.prototype.startPanic = function () {
  this.pickUFO();
  this.closeMouth();
  stage.setTimeout(Utils.proxy(this.addBoss, this), 2e3);
  stage.setTimeout(Utils.proxy(this.turnConveyorOn, this), 2e3);
  stage.setTimeout(Utils.proxy(this.prepareShockers, this), 3500);
  stage.setTimeout(Utils.proxy(this.removeCoverPanel, this), 3500);
};
levelsScripts.Level20.prototype.pickUFO = function () {
  var self = this;
  this.cable1.moveTo(this.cable1.x, this.cable1.y + 145, 800);
  this.cable2.moveTo(this.cable2.x, this.cable2.y + 145, 800);
  this.cable3.moveTo(this.cable3.x, this.cable3.y + 145, 800);
  this.cable4.moveTo(this.cable4.x, this.cable4.y + 145, 800, null, _moveBack);
  function _moveBack() {
    var ease = Easing.elastic.easeOut;
    GU.changeParent(self.cable1, self.ufo, true);
    GU.changeParent(self.cable2, self.ufo, true);
    GU.changeParent(self.cable3, self.ufo, true);
    GU.changeParent(self.cable4, self.ufo, true);
    self.ufo.moveTo(self.ufo.x, self.ufo.y - 115, 3e3, ease);
  }
  playSound("l25_verevki_hvataut_tarelku");
};
levelsScripts.Level20.prototype.closeMouth = function () {
  this.mouth.animDelay = 2;
  this.mouth.play();
  this.mouth.onchangeframe = function (e) {
    var src = e.target;
    if (src.currentFrame == 6) src.stop();
  };
  ObjectManager.create(
    {
      type: "invisible_wall_small",
      x: this.mouth.x + 2,
      y: this.mouth.y,
      rotation: Math.PI / 2,
    },
    findObject("invisible_wall_small"),
    stageSpr
  );
  field.hideInvisibleImg();
};
levelsScripts.Level20.prototype.addBoss = function () {
  this.boss = ObjectManager.create(
    { type: "lvl20_boss", x: 510, y: 160 },
    findObject("lvl20_boss"),
    stageSpr
  );
  var body = this.boss.box2dBody;
  body.ApplyImpulse(new b2Vec2(-55, -30), body.GetPosition());
  stage.setTimeout(function () {
    world.DestroyBody(body);
  }, 1e3);
  playSound("l25_SndSpace_Space_boss_appears2");
};
levelsScripts.Level20.prototype.removeCoverPanel = function (time) {
  var spr = this.gravityCover;
  time = isNaN(time) ? 400 : time;
  spr.moveTo(spr.x, spr.y + 50, time, null, function () {
    spr.setStatic(true);
  });
  playSound("l1_PanelOpen");
};
levelsScripts.Level20.prototype.addButtonsHandlers = function () {
  for (var i = 1; i <= 4; i++) {
    this["btn" + i].index = i;
    handlers.buttonPress.call(
      this["btn" + i],
      Utils.proxy(this.processBtnPress, this)
    );
  }
};
levelsScripts.Level20.prototype.processBtnPress = function (btn) {
  var index = btn.index;
  var cable = this["cable" + index];
  GU.changeParent(cable, stageSpr, true);
  cable.setZIndex(this.cableCover.zIndex - 1);
  cable.isRemoved = true;
  cable.moveTo(cable.x, cable.y - 100, 600, null, function () {
    cable.setStatic(true);
  });
  this["light" + index].gotoAndStop(1);
  this.checkCablesRemoved();
  playSound("l25_verevka_lopaetsa");
};
levelsScripts.Level20.prototype.checkCablesRemoved = function () {
  for (var i = 1; i <= 4; i++)
    if (!this["cable" + i].isRemoved) {
      this.shakeUFO();
      return false;
    }
  this.dropUFO();
};
levelsScripts.Level20.prototype.shakeUFO = function () {
  this.ufo.moveTo(this.ufo.x, this.ufo.y + 5, 1e3, Easing.elastic.easeOut);
};
levelsScripts.Level20.prototype.dropUFO = function () {
  this.ufo.setZIndex(30);
  this.ufo.moveTo(this.ufo.x, 187, 1e3, Easing.exponential.easeIn);
  stage.setTimeout(Utils.proxy(this.processLevelComplete, this), 500);
};
levelsScripts.Level20.prototype.processLevelComplete = function () {
  this.boss.kill();
  this.turnConveyorOff();
  GU.deleteObject(this.stopWall);
  this.stopShockers();
  this.showArrow();
  GU.submitAward("Defeat Boss in Level 20");
};
levelsScripts.Level20.prototype.showArrow = function () {
  var self = this;
  stage.setTimeout(function () {
    self.arrow = handlers.addHintArrow(self.ufo.x, 117, Math.PI);
  }, 1e3);
};
levelsScripts.Level20.prototype.prepareShockers = function () {
  this.shocker1 = new Sprite(bitmaps.lvl20_electro_stick, 12, 108);
  stageSpr.addChild(this.shocker1);
  this.shocker2 = this.shocker1.clone();
  this.shocker2.scaleY = -1;
  stageSpr.addChild(this.shocker2);
  var shockerH1 = this.shocker1.clone();
  shockerH1.scaleX = -1;
  var shockerH2 = this.shocker1.clone();
  shockerH2.scaleX = -1;
  this.shocker1.addChild(shockerH1);
  this.shocker2.addChild(shockerH2);
  this.shocker1.setPosition(324, -82);
  this.shocker2.setPosition(324, 362);
  shockerH1.setPosition(-276, 0);
  shockerH2.setPosition(-276, 0);
  this.shocker1.moveTo(this.shocker1.x, this.shocker1.y + 50, 300);
  this.shocker2.moveTo(
    this.shocker2.x,
    this.shocker2.y - 50,
    300,
    null,
    Utils.proxy(this.moveShockers, this)
  );
};
levelsScripts.Level20.prototype.moveShockers = function () {
  var moveTime = 5e3,
    s1 = this.shocker1,
    s2 = this.shocker2,
    l1 = this.lightUp,
    l2 = this.lightDown;
  _move(s1, 56);
  stage.setTimeout(function () {
    _move(s2, -60);
  }, moveTime);
  function _move(holder, shift) {
    var myPos = holder.y,
      light = myPos < 160 ? l1 : l2;
    light.gotoAndStop(1);
    var shocker = new Sprite(bitmaps.lvl20_shocker, 274, 8, 4);
    shocker.setPosition(-shocker.width / 2, 46);
    holder.addChild(shocker);
    handlers.addShockListener(shocker);
    holder.moveTo(holder.x, holder.y + shift, moveTime, null, function () {
      GU.destroyByOpacity(shocker, 300);
      light.gotoAndStop(0);
      holder.moveTo(holder.x, holder.y - shift, moveTime, null, function () {
        _move(holder, shift);
      });
    });
    playSound("Battery");
  }
};
levelsScripts.Level20.prototype.stopShockers = function () {
  var s1 = this.shocker1,
    s2 = this.shocker2;
  s1.removeTweens();
  s2.removeTweens();
  s1.moveTo(s1.x, s1.y - 100, 300);
  s2.moveTo(s2.x, s2.y + 100, 300);
};
levelsScripts.Level20.prototype.turnConveyorOn = function () {
  this.isConveyorOn = true;
  var wheels = GU.getObjectByInfo("lvl20_wheel");
  wheels.forEach(function (w) {
    w.onprerender = _rotate;
  });
  function _rotate(e) {
    var body = e.target.box2dBody;
    body.SetAngle(body.GetAngle() - 0.3);
  }
};
levelsScripts.Level20.prototype.turnConveyorOff = function () {
  this.isConveyorOn = false;
  var wheels = GU.getObjectByInfo("lvl20_wheel");
  wheels.forEach(function (w) {
    w.onprerender = null;
  });
};
levelsScripts.Level20.prototype.openHatch = function () {
  this.ufo.hatch.rotateBy((2 * Math.PI) / 3, 1600, Easing.elastic.easeOut);
};
levelsScripts.Level20.prototype.closeHatch = function () {
  this.ufo.hatch.rotateBy((-2 * Math.PI) / 3, 800, Easing.bounce.easeOut);
};
levelsScripts.Level20.prototype.processUFOEnter = function () {
  this.completed = true;
  this.openHatch();
  bob.changeState("finalState");
  var sequence = [
    { tweens: [{ prop: "x", to: bob.x + 30 }], duration: 850 },
    {
      tweens: [
        { prop: "x", to: this.ufo.x },
        { prop: "y", to: this.ufo.y - 20 },
      ],
      duration: 450,
    },
    {
      tweens: [{ prop: "y", to: this.ufo.y - 8 }],
      duration: 300,
      onfinish: Utils.proxy(this.flyAway, this),
    },
  ];
  Animation.play(bob, sequence);
  this.arrow.destroy = true;
  this.arrow = null;
};
levelsScripts.Level20.prototype.flyAway = function () {
  var ufo = this.ufo;
  GU.changeParent(bob, ufo, true);
  bob.setZIndex(5);
  this.closeHatch();
  stage.setTimeout(function () {
    ufo.moveTo(ufo.x, -50, 2e3, null, function () {
      GU.saveScores(gameScore);
      var newCountOfStars = GU.getTotalNumOfStars();
      if (newCountOfStars >= 20) GU.submitAward("Collect 20 stars");
      if (newCountOfStars === 60) GU.submitAward("Collect all 60 stars");
      ExternalAPI.exec("submitScores", gameScore);
      gameState = STATE_FINAL;
      createScene();
    });
    _rotate();
    playSound("l25_UFOFliesAway");
  }, 1e3);
  function _rotate() {
    var angle = ufo.rotation > 0 ? -Math.PI / 12 : Math.PI / 12;
    ufo.rotateTo(angle, 400, null, _rotate);
  }
};
levelsScripts.Level20.prototype.checkIfUFOReached = function () {
  if (this.completed || GU.getDistance(bob, this.ufo) > 70) return;
  this.processUFOEnter();
};
levelsScripts.Level20.prototype.isBobOnConveyor = function () {
  if (!this.isConveyorOn) return;
  var c = bob.box2dBody.GetContactList();
  for (c; c; c = c.next)
    if (c.other.sprite.info.indexOf("wheel") != -1) {
      bob.box2dBody.m_linearVelocity.x = -2;
      break;
    }
};
levelsScripts.Level20.prototype.checkPanicStart = function () {
  if (this.panicStarted || bob.x < 190) return;
  this.panicStarted = true;
  this.startPanic();
};
levelsScripts.Level20.prototype.initSecondPhase = function () {
  this.panicStarted = true;
  this.turnConveyorOn();
  this.closeMouth();
  this.removeCoverPanel(0);
  this.prepareShockers();
  box2d.setBodyPosition(bob.box2dBody, 230, bob.y);
  this.cable1.y += 145;
  this.cable2.y += 145;
  this.cable3.y += 145;
  this.cable4.y += 145;
  GU.changeParent(this.cable1, this.ufo, true);
  GU.changeParent(this.cable2, this.ufo, true);
  GU.changeParent(this.cable3, this.ufo, true);
  GU.changeParent(this.cable4, this.ufo, true);
  this.ufo.y -= 115;
  this.boss = ObjectManager.create(
    { type: "lvl20_boss", x: 510, y: 160 },
    findObject("lvl20_boss"),
    stageSpr
  );
  world.DestroyBody(this.boss.box2dBody);
  this.boss.setPosition(394, 191);
};
levelsScripts.Level20.prototype.pretick = function () {
  this.checkPanicStart();
  this.isBobOnConveyor();
  this.checkIfUFOReached();
};
var field;
var GameField = function () {};
GameField.prototype.init = function () {
  this.setBack();
  this.stopAnimations();
  this.setUI();
  this.hideInvisibleImg();
  this.setBackTube();
  this.setBobDestination();
  this.setScoreInterval();
  this.starsCount = 0;
  this.lasers = [];
  this.bobs = [bob];
  playSceneMusic();
  if (ExternalAPI.type !== "Spilgames")
    if (
      gameSaves.isMusicOn &&
      (!playingMusic ||
        playingMusic.getPosition() >= 8e7 ||
        playingMusic.getPosition() == 0)
    )
      playingMusic = mixer.play("bob_new_space", true, false, 0);
};
GameField.prototype.setBackTube = function () {
  var tubes = [],
    i,
    x,
    y,
    w,
    h,
    bm;
  for (i = 0; i < stage.objects.length; i++) {
    var obj = stage.objects[i];
    if (obj.info === "tube") tubes.push(obj);
  }
  for (i = 0; i < tubes.length; i++) {
    var tube = tubes[i];
    tube.setZIndex(20);
    switch (tube.bitmap) {
      case bitmaps.tube1:
        x = 35.5;
        y = 0;
        w = 8;
        h = 57;
        bm = "backTube1";
        break;
      case bitmaps.tube2:
        x = -35.5;
        y = 0;
        w = 8;
        h = 57;
        bm = "backTube2";
        break;
      case bitmaps.tube3:
        x = 0;
        y = 30;
        w = 56;
        h = 8;
        bm = "backTube3";
        (function (tube) {
          stage.setTimeout(function () {
            tube.setStatic(true);
          }, 500);
        })(tube);
        break;
      case bitmaps.tube4:
        x = 0;
        y = 0;
        w = 38;
        h = 42;
        bm = "backTube4";
        break;
      case bitmaps.tube5:
        x = 1;
        y = 28;
        w = 64;
        h = 8;
        bm = "backTube5";
        break;
      default:
        console.log("unknown bitmap");
    }
    var vec = new Vector(x, y);
    vec.rotate(-tube.rotation);
    tube.backTube = GU.addSprite(
      stage,
      bm,
      w,
      h,
      tube.x + vec.x,
      tube.y + vec.y,
      true
    );
    tube.backTube.rotation = tube.rotation;
  }
};
GameField.prototype.setBack = function () {
  var backBm =
    GET.debug != 1
      ? "Lvl" + currentLevel + "_back"
      : "Lvl" + editorLevel + "_back";
  var back = GU.addSprite(stage, backBm, 570, 320);
  back.setZIndex(1);
  back.setStatic(true);
  back.setRelativePosition(0, 0);
};
GameField.prototype.setUI = function () {
  this.speedIndicator = GU.addSprite(
    stage,
    "indicator",
    68,
    44,
    32,
    21.5,
    false,
    2,
    this.changeSpeed
  );
  this.speedIndicator.stop();
  var bottomUIBack = GU.addSprite(stage, "bottom_ui_back", 570, 50);
  bottomUIBack.setZIndex(16);
  bottomUIBack.setRelativePosition(0, 25, "center", "bottom");
  this.bottomUIBack = bottomUIBack;
  var levelMap = GU.addSprite(
    stage,
    "levelMap_ingame",
    60,
    40,
    30,
    302,
    false,
    3,
    levelSelect
  );
  var restartBtn = GU.addSprite(
    stage,
    "restart_ingame",
    80,
    46,
    96,
    307,
    false,
    3,
    restart
  );
  levelMap.hitArea = { x: 0, y: -4, width: 48, height: 34 };
  restartBtn.hitArea = { x: 0, y: -4, width: 68, height: 34 };
  GU.attachMouseEvents.call(levelMap);
  GU.attachMouseEvents.call(restartBtn);
  var soundBtn = GU.addSprite(stage, "sound_UI", 26, 28, 400, 306, false, 2);
  soundBtn.gotoAndStop(gameSaves.isMusicOn ? 0 : 1);
  soundBtn.onclick = toggleSounds;
  this.levelTitle = GU.addSprite(stage, "Lvl", 42, 20);
  this.levelTitle.setZIndex(20);
  this.levelTitle.setRelativePosition(40, 12, "right", "top");
  var t = new SimpleText(bitmaps.lvl_numbs, 18, 14);
  t.align = t.ALIGN_LEFT;
  t.parent = this.levelTitle;
  t.charSpacing = -10;
  t.x = 25;
  t.y = 0;
  t.write(currentLevel);
};
GameField.prototype.changeSpeed = function (e) {
  if (!bob) return;
  if (e.x > 0) {
    if (e.target.currentFrame === 0) {
      if (bob.state === "walk") bob.changeState("run");
      bob.selectedSpeed = 2;
      e.target.gotoAndStop(1);
      playSound("l1_SpeedFast");
    }
  } else if (e.x <= 0 && e.target.currentFrame === 1) {
    if (bob.state === "run") bob.changeState("walk");
    bob.selectedSpeed = 1;
    e.target.gotoAndStop(0);
    playSound("l1_SpeedStandard");
  }
};
GameField.prototype.setBobDestination = function () {
  this.destination = GU.getObjectByCustomInfo("destination");
  if (!this.destination) return;
  this.destination.setStatic(false);
  this.destination.setZIndex(20);
  stage.addEventListener("pretick", Utils.proxy(this.checkIfWin, this));
};
GameField.prototype.checkIfWin = function () {
  if (bob && GU.getDistance(bob, this.destination) < 13) showVictoryScreen();
};
GameField.prototype.stopAnimations = function () {
  for (var i = 0; i < stageSpr.objects.length; i++) {
    var obj = stageSpr.objects[i];
    if (obj.totalFrames > 1 && !obj.dontStopAnimation) obj.stop();
  }
};
GameField.prototype.hideInvisibleImg = function () {
  for (var i = 0; i < stageSpr.objects.length; i++) {
    var obj = stageSpr.objects[i];
    if (obj.info && obj.info.indexOf("invisible") != -1) obj.visible = false;
  }
};
GameField.prototype.deStaticCover = function (img, parent) {
  parent = parent || stageSpr;
  for (var i = 0; i < parent.objects.length; i++) {
    var obj = parent.objects[i];
    if (obj.bitmap && obj.bitmap.src.indexOf(img) !== -1) {
      var ix = parent.getMaxZIndexInStack(parent.objects);
      obj.setZIndex(parent.objects[ix].zIndex + 1);
      obj.setStatic(false);
    }
  }
};
GameField.prototype.setScoreInterval = function () {
  gameScore = 1e3;
  var gameScoreInt = stage.setInterval(function () {
    if (gameState === STATE_GAME && gameScore > 0) gameScore--;
    else stage.clearInterval(gameScoreInt);
  }, 1e3);
};
var SnailBob = function () {
  Utils.callSuperConstructor(SnailBob, this, bitmaps.Bob, 48, 39, 1, 1, 1);
  this.defaultZIndex = 15;
  this.speed = SnailBob.SPEED_WALK;
  this.cancelSpeed = false;
  this.blockClick = false;
  this.needContactCheck = true;
  this.go = Utils.proxy(this.go, this);
};
Utils.extend(SnailBob, TilesSprite);
SnailBob.SPEED_WALK = 1;
SnailBob.SPEED_RUN = 2;
SnailBob.prototype.init = function () {
  this.setZIndex(this.defaultZIndex);
  this.onbox2dsync = this.spritesSync;
  this.detectDirection();
  this.setDefaultState();
  this.forbidSleep();
  stage.addEventListener("pretick", this.go);
  this.onclick = this.onclickAction;
  this.setBodyProps();
};
SnailBob.prototype.detectDirection = function () {
  if (this.custom === "left") {
    this.direction = "left";
    this.scaleX = -1;
  } else {
    this.direction = "right";
    this.scaleX = 1;
  }
};
SnailBob.prototype.setDefaultState = function () {
  var state;
  if (field.speedIndicator.currentFrame === 0) {
    state = "walk";
    this.selectedSpeed = 1;
  } else {
    state = "run";
    this.selectedSpeed = 2;
  }
  this.changeState(state);
};
SnailBob.prototype.forbidSleep = function () {
  this.box2dBody.m_world.m_allowSleep = false;
};
SnailBob.prototype.setBodyProps = function () {
  this.box2dBody.SetAngularDamping(1);
  this.box2dBody.SetLinearDamping(2);
  GU.setBodyGroupIndex(this.box2dBody, -1);
};
SnailBob.prototype.spritesSync = function () {
  this.rotation = 0;
  this.x += this.syncX ? this.syncX : 0;
  this.y += this.syncY ? this.syncY : 0;
};
SnailBob.prototype.go = function () {
  if (this.cancelSpeed || !this.speed) return;
  if (this.needContactCheck && !this.isContact()) return;
  this.box2dBody.m_linearVelocity.x = this.speed;
};
SnailBob.prototype.isContact = function () {
  var c = this.box2dBody.GetContactList();
  while (c) {
    if (c.contact.IsTouching()) return true;
    c = c.next;
  }
  return false;
};
SnailBob.prototype.changeState = function (nameOfState) {
  if (this.isInFinalState()) return;
  var state = SnailBob.states[nameOfState];
  if (!state) console.log("unknown state");
  this.bitmap = bitmaps[state.bitmap];
  this.width = state.width;
  this.height = state.height;
  this.animDelay = state.animDelay;
  this.framesCount = state.frames || 1;
  this.totalLayers = state.columns || 1;
  this.totalFrames = state.rows || this.framesCount;
  this.speed = state.speed * this.scaleX;
  if (this.speed === 0) {
    this.box2dBody.SetAngularVelocity(0);
    this.box2dBody.SetLinearVelocity(new b2Vec2(0, 0));
  }
  if (this.syncX !== state.syncX * this.scaleX || this.syncY !== state.syncY) {
    var pos = box2d.getBodyPosition(this.box2dBody);
    state.syncX = state.syncX || 0;
    state.syncY = state.syncY || 0;
    pos.x += this.syncX - state.syncX * this.scaleX;
    pos.y += this.syncY - state.syncY;
    box2d.setBodyPosition(this.box2dBody, pos.x, pos.y);
    this.syncX = state.syncX * this.scaleX;
    this.syncY = state.syncY;
  }
  if (state.onchangeframe) this.onchangeframe = state.onchangeframe;
  else this.onchangeframe = null;
  this.previousState = this.state;
  this.state = nameOfState;
  if (state.init) state.init.call(this);
};
SnailBob.prototype.onclickAction = function () {
  if (this.blockClick) return;
  if (this.state === "hide") this.changeState("show");
  else this.changeState("hide");
};
SnailBob.prototype.turn = function () {
  if (this.state === "hide") this.changeState("hideTurn");
  else this.changeState("turn");
};
SnailBob.prototype.changeDirection = function () {
  this.scaleX *= -1;
  this.direction = this.direction === "left" ? "right" : "left";
};
SnailBob.prototype.isInFinalState = function () {
  return SnailBob.finalStates.indexOf(this.state) != -1;
};
SnailBob.finalStates = ["fall", "bobOnRay", "shocked2", "bob_final_state"];
SnailBob.states = {
  walk: {
    bitmap: "BobGo",
    width: 50,
    height: 40,
    frames: 17,
    animDelay: 3,
    speed: SnailBob.SPEED_WALK,
    init: function () {
      this.gotoAndPlay(3);
    },
    onchangeframe: function (e) {
      if (e.target.currentFrameX === 16) e.target.gotoAndPlay(3);
    },
  },
  run: {
    bitmap: "BobRun",
    width: 57,
    height: 50,
    frames: 19,
    animDelay: 2,
    syncY: 1,
    speed: SnailBob.SPEED_RUN,
    init: function () {
      this.gotoAndPlay(3);
    },
    onchangeframe: function (e) {
      if (e.target.currentFrameX === 15) e.target.gotoAndPlay(3);
    },
  },
  hide: {
    bitmap: "BobHide",
    width: 57,
    height: 42,
    frames: 11,
    animDelay: 2,
    syncX: 10,
    syncY: -1,
    speed: 0,
    init: function () {
      this.blockClick = true;
      this.gotoAndPlay(0);
      this.box2dBody.m_fixtureList.m_shape.m_radius = 0.513;
      playSound("bob_hideshel(SnailBob3)");
    },
    onchangeframe: function (e) {
      if (e.target.currentFrameX === 10 && e.target.animated) {
        e.target.gotoAndStop(10);
        e.target.blockClick = false;
      }
    },
  },
  show: {
    bitmap: "BobHide",
    width: 57,
    height: 42,
    frames: 11,
    animDelay: 2,
    speed: 0,
    init: function () {
      this.animDirection = -1;
      this.gotoAndPlay(10);
      this.blockClick = true;
      this.box2dBody.m_fixtureList.m_shape.m_radius = 0.583;
      playSound("bob_outshell(SnailBob3)");
    },
    onchangeframe: function (e) {
      var obj = e.target,
        state;
      if (obj.currentFrameX === 0 && obj.animated) {
        obj.animDirection = 1;
        obj.gotoAndStop(0);
        obj.blockClick = false;
        if (obj.selectedSpeed === 1) state = "walk";
        else state = "run";
        obj.changeState(state);
      }
    },
  },
  turn: {
    bitmap: "BobTurns",
    width: 47,
    height: 40,
    frames: 14,
    animDelay: 2,
    speed: 0,
    syncY: 0,
    init: function () {
      this.blockClick = true;
      this.gotoAndPlay(0);
      this.animDirection = 1;
    },
    onchangeframe: function (e) {
      var bob = e.target;
      if (bob.currentFrameX === 13) {
        bob.blockClick = false;
        var newState = bob.selectedSpeed === 1 ? "walk" : "run";
        bob.changeDirection();
        bob.changeState(newState);
      }
    },
  },
  hideTurn: {
    bitmap: "BobHideTurn",
    width: 56,
    height: 36,
    frames: 14,
    animDelay: 2,
    syncX: 0,
    syncY: 1,
    speed: 0,
    init: function () {
      this.blockClick = true;
      this.gotoAndPlay(0);
    },
    onchangeframe: function (e) {
      var bob = e.target;
      if (bob.currentFrameX === 13) {
        bob.changeDirection();
        bob.changeState("hide");
        bob.gotoAndStop(10);
        bob.blockClick = false;
      }
    },
  },
  fall: {
    bitmap: "BobFall",
    width: 50,
    height: 174,
    animDelay: 3,
    speed: 0,
    frames: 15,
    rows: 5,
    columns: 3,
    init: function () {
      field.bottomUIBack.setStatic(false);
      this.gotoAndPlay(0);
      this.blockClick = true;
      world.DestroyBody(this.box2dBody);
      this.y -= 40;
      var dur = (this.animDelay * this.framesCount * 1e3) / fps;
      stage
        .createTween(this, "y", this.y, this.y + 195, dur, Easing.sine.easeIn)
        .play();
      playSound("Fall");
    },
    onchangeframe: function (e) {
      var obj = e.target;
      if (obj.currentFrameX === 13) {
        obj.destroy = true;
        stage.setTimeout(showGameOverScreen, 1e3);
      }
    },
  },
  shocked: {
    bitmap: "shocked",
    width: 94,
    height: 102,
    animDelay: 4,
    speed: 0,
    frames: 4,
    init: function () {
      world.DestroyBody(this.box2dBody);
      this.gotoAndPlay(0);
      this.blockClick = true;
      this.y -= 15;
      playSound("l2_ElectroShock");
      playSound("l2_BobDieRadiation");
      stage.setTimeout(function () {
        bob.changeState("shocked2");
      }, 1500);
    },
    onchangeframe: function (e) {},
  },
  bobOnRay: {
    bitmap: "bob_ray_killed",
    width: 76,
    height: 68,
    rows: 9,
    columns: 2,
    animDelay: 2,
    speed: 0,
    frames: 18,
    init: function () {
      world.DestroyBody(this.box2dBody);
      this.gotoAndPlay(0);
      this.blockClick = true;
      playSound("l11_smert_ot_lucha");
    },
    onchangeframe: function (e) {
      var obj = e.target;
      if (obj.currentFrameX == obj.framesCount - 1) {
        obj.stop();
        obj.destroy = true;
        showGameOverScreen();
      }
    },
  },
  shocked2: {
    bitmap: "shocked2",
    width: 94,
    height: 102,
    animDelay: 6,
    speed: 0,
    frames: 7,
    init: function () {
      this.gotoAndPlay(0);
      this.blockClick = true;
      this.y -= 3;
      var soul = new TilesSprite(bitmaps.bob_spirit, 70, 72, 17, 9, 2);
      soul.setPosition(this.x, this.y - 10);
      stage.addChild(soul);
      soul.animDelay = 2;
      soul.moveTo(this.x, this.y - 150, 1e3, null, showGameOverScreen);
    },
    onchangeframe: function (e) {
      var obj = e.target;
      if (obj.currentFrame == obj.totalFrames - 1) obj.stop();
    },
  },
  beforeRocket: {
    bitmap: "bob_roket",
    width: 50,
    height: 42,
    animDelay: 4,
    speed: 0,
    frames: 17,
    init: function () {
      this.gotoAndPlay(0);
      this.blockClick = true;
      this.scaleX *= -1;
      this.y -= 2;
    },
    onchangeframe: function (e) {
      var obj = e.target;
      if (obj.currentFrame === obj.totalFrames - 1) obj.stop();
    },
  },
  finalState: {
    bitmap: "bob_final_state",
    width: 54,
    height: 44,
    animDelay: 3,
    speed: 0,
    frames: 44,
    rows: 22,
    columns: 2,
    init: function () {
      this.gotoAndPlay(0);
      this.blockClick = true;
      world.DestroyBody(this.box2dBody);
      this.setZIndex(50);
      playSound("l25_LevelCompleted");
    },
    onchangeframe: function (e) {
      var obj = e.target;
      if (obj.currentFrameX == obj.framesCount - 1) obj.stop();
    },
  },
  growl: {
    bitmap: "BobGrowl",
    width: 50,
    height: 42,
    frames: 15,
    animDelay: 4,
    init: function () {
      this.blockClick = true;
      this.gotoAndPlay(0);
      playSound("l6_BobGrowl");
    },
  },
};
var GU = {};
GU.addSprite = function (parent, bitmap, w, h, x, y, isStatic, f, onclick) {
  var mc = new Sprite(bitmap ? bitmaps[bitmap] : null, w, h, f);
  mc.x = x || 0;
  mc.y = y || 0;
  parent.addChild(mc);
  mc.onclick = onclick || null;
  mc.setStatic(isStatic);
  return mc;
};
GU.addTilesSprite = function (
  parent,
  bitmap,
  w,
  h,
  f,
  r,
  c,
  x,
  y,
  animDelay,
  onclick
) {
  var mc = new TilesSprite(bitmap ? bitmaps[bitmap] : null, w, h, f, r, c);
  mc.x = x || 0;
  mc.y = y || 0;
  parent.addChild(mc);
  mc.onclick = onclick || null;
  mc.animDelay = animDelay || 1;
  return mc;
};
GU.returnFalse = function () {
  return false;
};
GU.randInt = function (max, min) {
  max = max || 9;
  min = min || 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
GU.getDistance = function (obj1, obj2) {
  return Math.sqrt(
    (obj2.x - obj1.x) * (obj2.x - obj1.x) +
      (obj2.y - obj1.y) * (obj2.y - obj1.y)
  );
};
GU.addHint = function (obj, x, y) {
  x = x || 0;
  y = y || 0;
  obj.hint = addSprite("hint", 33, 33, obj.x + x, obj.y + y);
  obj.hint.setZIndex(13);
  obj.hint.onchangeframe = function (e) {
    e.target.rotation += 0.025;
  };
};
GU.removeHint = function (obj) {
  var tween = stage.createTween(obj.hint, "opacity", 1, 0, 1e3);
  tween.play();
  tween.onfinish = function () {
    obj.obj.destroy = true;
  };
};
GU.destroyByOpacity = function (obj, duration) {
  obj.setStatic(false);
  duration = duration || 1e3;
  obj.fadeTo(0, duration, false, GU.destroyObjFromTween);
};
GU.destroyObjFromTween = function (e) {
  e.target.obj.destroy = true;
};
GU.changeParent = function (obj, newParent, needUpdatePosition) {
  if (!obj.parent || !newParent) return;
  if (needUpdatePosition) GU.setNewRelativePosition(obj, newParent);
  obj.parent.objects = Utils.removeFromArray(obj.parent.objects, obj);
  newParent.addChild(obj);
  return obj;
};
GU.setNewRelativePosition = function (spr, futureParent) {
  var p = spr.getAbsolutePosition();
  var f = futureParent.getAbsolutePosition();
  spr.setPosition(p.x - f.x, p.y - f.y);
};
GU.getLastLevel = function () {
  return gameSaves.scores.length + 1;
};
GU.getObjectByInfo = function (info) {
  var arr = [];
  for (var i = 0, j = stageSpr.objects.length; i < j; i++)
    if (stageSpr.objects[i].info == info) arr.push(stageSpr.objects[i]);
  if (arr.length == 1) return arr[0];
  else return arr;
};
GU.getObjectByCustomInfo = function (info) {
  for (var i = 0, j = stageSpr.objects.length; i < j; i++)
    if (stageSpr.objects[i].custom == info) return stageSpr.objects[i];
  return false;
};
GU.startTween = function (obj, prop, end, duration, ease, callback) {
  var tween = stage.createTween(obj, prop, obj[prop] * 1, end, duration, ease);
  if (callback) tween.onfinish = callback;
  tween.play();
  return tween;
};
GU.setBodyGroupIndex = function (body, index) {
  body.m_fixtureList.m_filter.groupIndex = index;
};
GU.deleteObject = function (sprite) {
  sprite.destroy = true;
  if (sprite.box2dBody) world.DestroyBody(sprite.box2dBody);
};
function getGameDataId() {
  return "playtomax_" + GAME_ID + "_data";
}
GU.saveScores = function (val) {
  if (
    val > gameSaves.scores[currentLevel - 1] ||
    !gameSaves.scores[currentLevel - 1]
  ) {
    gameSaves.scores[currentLevel - 1] = val;
    saveGame();
  }
};
GU.getTotalScores = function () {
  var sum = 0;
  for (var i = 0; i < gameSaves.scores.length; i++) sum += gameSaves.scores[i];
  return sum;
};
GU.getTotalNumOfStars = function () {
  var sum = 0;
  for (var i = 0; i < gameSaves.scores.length; i++)
    sum += ~~(gameSaves.scores[i] / 1e3);
  return sum;
};
function findObject(name) {
  for (var i = 0; i < objects.length; i++)
    if (objects[i].name == name) return objects[i];
  return false;
}
GU.attachMouseEvents = function (var2) {
  this.stop();
  this.onmousedown = function (e) {
    if (gameState === STATE_VICTORY || gameState === STATE_GAME_OVER) return;
    if (var2) e.target.gotoAndStop(e.target.totalFrames - 1);
    else e.target.gotoAndStop(1);
  };
  this.onmouseup = function (e) {
    if (gameState === STATE_VICTORY || gameState === STATE_GAME_OVER) return;
    if (var2) e.target.gotoAndStop(0);
    else e.target.gotoAndStop(0);
  };
};
GU.addButton = function (
  parent,
  bitmap,
  w,
  h,
  x,
  y,
  onclick,
  relativePos,
  noEvents
) {
  var btn = GU.addSprite(parent, bitmap, w, h, x, y, false, 3, onclick);
  if (!noEvents) GU.attachMouseEvents.call(btn, true);
  else btn.gotoAndStop(0);
  if (relativePos)
    btn.setRelativePosition(x, y, relativePos.align, relativePos.valign);
  return btn;
};
function getBodyByPoint(point, presentBody) {
  var body = world.GetGroundBody();
  if (point) {
    stack = stage.getObjectsStackByCoord(point.x, point.y, false);
    if (stack.length > 0)
      for (var i = stack.length - 1; i >= 0; i--)
        if (stack[i].box2dBody && stack[i].box2dBody != presentBody)
          body = stack[i].box2dBody;
  }
  return body;
}
box2d.getBodyPosition = function (body) {
  var pos = body.GetPosition();
  return new b2Vec2(pos.x * box2d.SCALE, pos.y * box2d.SCALE);
};
GU.getAngle = function (obj1, obj2) {
  return Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
};
function destroyMe(s) {
  s.destroy = true;
}
function getTwoPointsObstacles(point1, point2) {
  var resultArr = [];
  box2d.rayCast(
    world,
    function (fixture) {
      resultArr.push(fixture.m_body.sprite);
    },
    point1,
    point2
  );
  return resultArr;
}
function showSpilLogo(x, y, parent, noStatic) {
  if (!spilLogoAction) return;
  var mc = new Sprite(bitmaps.SpilLogo, 93, 30);
  mc.x = x;
  mc.y = y;
  (parent || stage).addChild(mc);
  mc.onclick = spilLogoAction;
  mc.setStatic(!noStatic);
  return mc;
}
GU.writeSimpleText = function (
  parent,
  bm,
  w,
  h,
  x,
  y,
  num,
  isCache,
  props,
  push
) {
  var text = new SimpleText(bitmaps[bm], w, h);
  text.x = x;
  text.y = y;
  text.static = true;
  text.parent = parent;
  if (props && typeof props == "object")
    for (var prop in props) text[prop] = props[prop];
  if (push) text.charMap.push(push);
  text.write(num);
  if (isCache) {
    parent.bitmap = parent.cacheAsBitmap();
    text.write("");
  }
};
Array.prototype.pickRandom = function () {
  return this[~~(Math.random() * this.length)];
};
var DraggedItem = function (bitmap, w, h, f, c, r) {
  Utils.callSuperConstructor(DraggedItem, this, bitmap, w, h, f, c, r);
  var self = this;
  this.onmousedown = function () {
    self.dragged = true;
    return false;
  };
  this.onmouseup = function (e) {
    self.dragged = false;
    var pos = self.getAbsolutePosition();
    pos.x = ~~pos.x;
    pos.y = ~~pos.y;
    console.log(pos);
    return false;
  };
};
Utils.extend(DraggedItem, TilesSprite);
function addSpilLogo(parent, x, y, relative, props) {
  if (ExternalAPI.type !== "Spilgames" || !ExternalAPI.logoAction) return;
  var button = GU.addSprite(parent || stage, "button_empty", 124, 49, x, y);
  if (relative)
    button.setRelativePosition(x, y, relative.align, relative.valign);
  var logo = ExternalAPI.exec("addLogo", 0, 0, true, button);
  if (props && typeof props == "object")
    for (var prop in props) button[prop] = props[prop];
  if (!logo.bitmap.complete) {
    button.visible = false;
    return false;
  }
  return true;
}
GU.submitAward = function (name) {
  if (gameSaves.awards[name]) return;
  ExternalAPI.submitAward(name);
  gameSaves.awards[name] = true;
  saveGame();
  console.log(name);
};
var levels = [
  {
    objects: [
      { type: "Bob", x: 21, y: 213, rotation: 0 },
      { type: "invisible_wall_big", x: 75, y: 236, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 156,
        y: 220,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_very_small", x: 167, y: 147, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 178,
        y: 220,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 37, y: 173, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 60,
        y: 99,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 135,
        y: 39,
        rotation: -0.10000000000000002,
      },
      { type: "invisible_wall_small", x: 235, y: 29, rotation: -0.1 },
      {
        type: "invisible_wall_big",
        x: 257,
        y: 91,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 338, y: 164, rotation: 0 },
      { type: "invisible_wall_big", x: 486, y: 164, rotation: 0 },
      { type: "invisible_wall_big", x: 255, y: 236, rotation: 0 },
      { type: "invisible_wall_big", x: 406, y: 236, rotation: 0 },
      { type: "star2", x: 110, y: 16, rotation: 0.3, custom: "starTop" },
      { type: "cover_star_lvl1", x: 91.5, y: 17, rotation: 0 },
      { type: "cogwheel_lvl1", x: 311, y: 103, rotation: 0 },
      { type: "cogwheel_lvl1", x: 311, y: 131, rotation: 0 },
      { type: "cogwheel_lvl1", x: 291, y: 116, rotation: 0 },
      { type: "bridge_lvl1", x: 328.8, y: 152, rotation: 0 },
      { type: "star1", x: 330, y: 116, rotation: -0.25, custom: "starBridge" },
      { type: "door_lvl1", x: 310, y: 119, rotation: 0, custom: "door" },
      { type: "cover1_lvl1", x: 310, y: 84, rotation: 0, custom: "coverDoor" },
      { type: "star3", x: 416, y: 268, rotation: 0, custom: "starBottom" },
      { type: "cover3_lvl1", x: 3.5, y: 206, rotation: 0 },
      {
        type: "cover2_lvl1",
        x: 482,
        y: 206,
        rotation: 0,
        custom: "destination",
      },
      { type: "gravity_button_up", x: 387.5, y: 106, rotation: 0 },
      { type: "grandpa", x: 311, y: 40, rotation: 0 },
      { type: "control_center", x: 310, y: 32, rotation: 0 },
      { type: "invisible_wall_small", x: 456, y: 175, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      {
        type: "shock_door",
        x: 240,
        y: 215,
        rotation: 0,
        custom: "shock_wall2",
      },
      { type: "Bob", x: 22, y: 183, rotation: 0 },
      { type: "cover_entrance_lvl2", x: 1, y: 177, rotation: 0 },
      {
        type: "cover_exit_lvl2",
        x: 482.5,
        y: 84,
        rotation: 0,
        custom: "destination",
      },
      { type: "cover1_lvl2", x: 242, y: 258, rotation: 0, custom: "cover2" },
      {
        type: "shock_door",
        x: 240,
        y: 123,
        rotation: 0,
        custom: "shock_wall1",
      },
      { type: "star1", x: 190, y: 26, rotation: 0.35, custom: "star1" },
      { type: "cover2_lvl2", x: 242, y: 71, rotation: 0, custom: "cover1" },
      { type: "star_cover_lvl2", x: 200, y: 39, rotation: 0 },
      { type: "invisible_wall_big", x: 73, y: 208, rotation: 0 },
      { type: "invisible_wall_big", x: 219, y: 208, rotation: 0 },
      { type: "invisible_wall_big", x: 443, y: 113, rotation: 0 },
      { type: "btn2", x: 195, y: 207, rotation: 0, custom: "btn_press" },
      { type: "invisible_wall_big", x: 369, y: 208, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 151,
        y: 120,
        rotation: -1.3877787807814457e-17,
      },
      { type: "invisible_wall_small", x: 23, y: 150, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 51,
        y: 132,
        rotation: -0.44999999999999996,
      },
      { type: "invisible_wall_small", x: 231, y: 114, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 254,
        y: 37,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 369,
        y: 187,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 338,
        y: 23,
        rotation: -0.10000000000000002,
      },
      {
        type: "invisible_wall_small",
        x: 419,
        y: 24,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 494, y: 46, rotation: 0 },
      { type: "star8", x: 78, y: 265, rotation: 0, custom: "star2" },
      { type: "star8", x: 417, y: 162, rotation: 0, custom: "star3" },
      { type: "gravity_button_up", x: 396, y: 253, rotation: 0 },
      { type: "grandpa", x: 92, y: 86, rotation: 0 },
      { type: "control_center", x: 92, y: 77, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "Bob", x: 463, y: 167, rotation: 0, custom: "left" },
      { type: "invisible_wall_big", x: 506, y: 124, rotation: 0 },
      { type: "invisible_wall_big", x: 486, y: 185, rotation: 0 },
      { type: "invisible_wall_big", x: 337, y: 185, rotation: 0 },
      { type: "invisible_wall_big", x: 259, y: 103, rotation: 0 },
      { type: "invisible_wall_big", x: 260, y: 84, rotation: 0 },
      { type: "invisible_wall_big", x: 411, y: 84, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 265,
        y: 258,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 204,
        y: 258,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 234, y: 264, rotation: 0 },
      { type: "invisible_wall_big", x: 130, y: 185, rotation: 0 },
      { type: "invisible_wall_small", x: 30, y: 185, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 28,
        y: 107,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 90, y: 7, rotation: -0.25 },
      { type: "invisible_wall_big", x: 409, y: 103, rotation: 0 },
      { type: "invisible_wall_big", x: 172, y: 6, rotation: 0 },
      { type: "invisible_wall_big", x: 322, y: 6, rotation: 0 },
      { type: "invisible_wall_big", x: 472, y: 6, rotation: 0 },
      { type: "invisible_wall_big", x: 504, y: 30, rotation: 0.1 },
      { type: "button_red", x: 70.8, y: 224, rotation: 0 },
      { type: "baraban", x: 70.8, y: 190, rotation: 0 },
      { type: "bridge_lvl3", x: 193, y: 151, rotation: 0 },
      {
        type: "cover_bridge_lvl3",
        x: 193,
        y: 227.8,
        rotation: 0,
        custom: "coverBridge",
      },
      { type: "star12", x: 359, y: 96, rotation: 1.3877787807814457e-17 },
      { type: "cover3_lvl3", x: 357, y: 94.5, rotation: 0 },
      { type: "star15", x: 121, y: 251, rotation: 0 },
      { type: "cover2_lvl3", x: 108, y: 265.8, rotation: 0 },
      { type: "star14", x: 316, y: 34, rotation: 0 },
      { type: "cover1_lvl3", x: 317, y: 32, rotation: 0 },
      { type: "cover_entrance_lvl3", x: 482, y: 156, rotation: 0 },
      {
        type: "cover_exit_lvl3",
        x: 481.8,
        y: 56,
        rotation: 0,
        custom: "destination",
      },
      { type: "gravity_button_up", x: 356.5, y: 235, rotation: 0 },
      { type: "btn", x: 232, y: 260, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_big", x: 37, y: 155, rotation: 0 },
      { type: "Bob", x: 17, y: 132, rotation: 0 },
      { type: "grandpa", x: 298, y: 30, rotation: 0 },
      { type: "control_center", x: 298, y: 22, rotation: 0 },
      { type: "star2_lvl10", x: 376, y: 239, rotation: 0 },
      { type: "star1_lvl10", x: 418, y: 129, rotation: 0 },
      { type: "invisible_wall_big", x: -9, y: 95, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 51,
        y: 13,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 128, y: 31, rotation: 0.2 },
      {
        type: "invisible_wall_small",
        x: 226,
        y: 51,
        rotation: 0.19198621771937624,
      },
      { type: "invisible_wall_big", x: 317, y: 74, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 249,
        y: 236,
        rotation: -1.2500000000000004,
      },
      { type: "star14", x: 146, y: 207, rotation: 0.25 },
      { type: "invisible_wall_small", x: 285, y: 212, rotation: 0 },
      { type: "invisible_wall_small", x: 318, y: 212, rotation: 0 },
      { type: "star_cover_lvl4", x: 127, y: 223, rotation: 0 },
      { type: "gravity_button_up", x: 288, y: 255, rotation: 0 },
      { type: "flash1_lvl4", x: 118, y: 233, rotation: 0, custom: "shock2" },
      { type: "flash2_lvl4", x: 149, y: 42, rotation: 0, custom: "shock1" },
      { type: "rocket", x: 376, y: 141, rotation: 0, custom: "rocket" },
      { type: "door_lvl4", x: 423, y: 131, rotation: 0, custom: "window" },
      {
        type: "cover_in_lvl4",
        x: 6.5,
        y: 124,
        rotation: 0,
        custom: "entrance",
      },
      { type: "crane_1", x: 352, y: 120, rotation: 0, custom: "crane" },
      { type: "lift_lvl4", x: 376, y: 322, rotation: 0, custom: "lift" },
    ],
    joints: [],
  },
  {
    objects: [
      {
        type: "invisible_wall_big",
        x: 192,
        y: 148,
        rotation: -0.017453292519943295,
      },
      { type: "gravity_button_up", x: 312, y: 256, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 203,
        y: 212,
        rotation: 1.5707963267948966,
      },
      { type: "star1_lvl12", x: 58, y: 253, rotation: 0 },
      { type: "slide_doors", x: 57, y: 252, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 207,
        y: 213,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 126, y: 219, rotation: 0 },
      { type: "invisible_wall_big", x: 284, y: 219, rotation: 0 },
      { type: "invisible_wall_small", x: 385, y: 219, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 416,
        y: 145,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 490, y: 72, rotation: 0 },
      { type: "invisible_wall_big", x: 438, y: 13, rotation: 0 },
      { type: "invisible_wall_small", x: 459, y: 21, rotation: 0 },
      { type: "invisible_wall_very_small", x: 331, y: 150, rotation: 0 },
      { type: "invisible_wall_very_small", x: 350, y: 150, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 361,
        y: 74,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 294, y: 55, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 321,
        y: 73,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 266,
        y: 73,
        rotation: 1.5707963267948966,
      },
      { type: "star1_lvl12", x: 338, y: 13, rotation: 0 },
      { type: "welcome_monster", x: 331, y: 22, rotation: 0 },
      { type: "bridge_lvl5", x: 296, y: 140, rotation: 0, custom: "open" },
      { type: "button_red", x: 341.5, y: 114, rotation: 0 },
      { type: "battery_l", x: 120, y: 248, rotation: 0, custom: "leftBattery" },
      {
        type: "battery_r",
        x: 223,
        y: 248,
        rotation: 0,
        custom: "rightBattery",
      },
      { type: "star1_lvl16", x: 129, y: 52, rotation: 0 },
      { type: "cover_star_lvl5", x: 132, y: 60, rotation: 0 },
      { type: "leaflet_lvl5", x: 143, y: 6, rotation: 0.35 },
      { type: "leaflet_lvl5", x: 112, y: 18, rotation: 0 },
      { type: "leaflet_lvl5", x: 146, y: 40, rotation: -2.499999999999999 },
      { type: "leaflet_lvl5", x: 122, y: 22, rotation: -1.0500000000000003 },
      { type: "leaflet_lvl5", x: 94, y: 48, rotation: -2.1000000000000005 },
      { type: "leaflet_lvl5", x: 126, y: 48, rotation: -1.800000000000001 },
      { type: "leaflet_lvl5", x: 140, y: 53, rotation: 0.1000000000000001 },
      {
        type: "cover_exit_lvl5",
        x: 477,
        y: 45,
        rotation: 0,
        custom: "destination",
      },
      { type: "invisible_wall_small", x: 458, y: 68, rotation: 0 },
      { type: "apple_of_the_eye", x: 416.5, y: 18, rotation: 0 },
      { type: "apple_of_the_eye", x: 434, y: 8, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 71,
        y: 225,
        rotation: -1.5500000000000007,
      },
      { type: "invisible_wall_big", x: 69, y: 219, rotation: 0.05 },
      { type: "alien", x: 294, y: 190, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "cover_entrance_lvl7", x: 122, y: 8, rotation: 0 },
      { type: "Bob", x: 126, y: 23, rotation: 0 },
      { type: "button_red", x: 314.5, y: 148, rotation: 0 },
      { type: "apple_of_the_eye", x: 171, y: 147.5, rotation: 0 },
      { type: "apple_of_the_eye", x: 188, y: 137, rotation: 0 },
      { type: "bridge_lvl7", x: 76, y: 94, rotation: 0 },
      { type: "cover1_lvl7", x: 33, y: 93, rotation: 0 },
      { type: "bridge_lvl7", x: 406, y: 67, rotation: 0 },
      { type: "cover2_lvl7", x: 363, y: 67.8, rotation: 0 },
      { type: "bridge_lvl7", x: 406, y: 180.8, rotation: 0, custom: "open" },
      { type: "cover3_lvl7", x: 363, y: 180, rotation: 0 },
      { type: "flower_lvl7", x: 165, y: 265, rotation: 0 },
      {
        type: "cover_exit_lvl7",
        x: 213,
        y: 176.5,
        rotation: 0,
        custom: "destination",
      },
      { type: "star1", x: 304, y: 250, rotation: 0 },
      { type: "bubble_cover", x: 304, y: 251, rotation: 0 },
      { type: "bubble_cover", x: 304, y: 251, rotation: 0, custom: "1.2" },
      {
        type: "invisible_wall_big",
        x: 41,
        y: 118,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 118, y: 203, rotation: 0 },
      { type: "invisible_wall_small", x: 198, y: 198, rotation: -0.2 },
      { type: "invisible_wall_big", x: 188, y: 86, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 238,
        y: 58,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 262,
        y: 31,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 348, y: 57, rotation: 0 },
      { type: "invisible_wall_small", x: 298, y: 57, rotation: 0 },
      { type: "invisible_wall_small", x: 411, y: 267, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 371,
        y: 132,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 371,
        y: 282,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 448,
        y: 77,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 448,
        y: 227,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 111,
        y: 102,
        rotation: 1.5707963267948966,
      },
      { type: "alien_snail", x: 363, y: 18, rotation: 0, custom: "left" },
      { type: "portal", x: 207, y: 55, rotation: 0 },
      { type: "portal", x: 78.5, y: 170, rotation: 0 },
      { type: "portal", x: 295.5, y: 26, rotation: 0 },
      { type: "portal", x: 412.5, y: 235.5, rotation: 0 },
      { type: "violet_lamp", x: 31, y: 93, rotation: 0 },
      { type: "violet_lamp", x: 360.5, y: 66.5, rotation: 0 },
      { type: "blue_lamp2", x: 361, y: 181, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_big", x: 40, y: 226, rotation: 0 },
      { type: "Bob", x: 24, y: 198, rotation: 0 },
      { type: "invisible_wall_big", x: 190, y: 226, rotation: 0 },
      { type: "invisible_wall_big", x: 338, y: 226, rotation: 0 },
      { type: "invisible_wall_big", x: 487, y: 226, rotation: 0 },
      { type: "gravity_button_up", x: 249, y: 25, rotation: 0 },
      { type: "invisible_wall_big", x: 40, y: 53, rotation: 0 },
      { type: "invisible_wall_big", x: 190, y: 53, rotation: 0 },
      { type: "invisible_wall_big", x: 338, y: 53, rotation: 0 },
      { type: "invisible_wall_big", x: 487, y: 53, rotation: 0 },
      {
        type: "btn2",
        x: 407,
        y: 49,
        rotation: 3.141592653589793,
        custom: "btn_red",
      },
      { type: "star1_lvl12", x: 409, y: 27, rotation: 0 },
      { type: "star3_lvl8", x: 241, y: 221, rotation: 0.3 },
      { type: "star1_lvl12", x: 327, y: 265, rotation: 0 },
      { type: "alien_kid", x: 244, y: 259, rotation: 0 },
      { type: "cover_entrance_lvl6", x: 23, y: 198, rotation: 0 },
      {
        type: "cover_exit_lvl6",
        x: 459,
        y: 198,
        rotation: 0,
        custom: "destination",
      },
      { type: "alien_kid", x: 407, y: 261, rotation: 0 },
      { type: "bubble_cover", x: 327, y: 266, rotation: 0 },
      { type: "bubble_cover", x: 407, y: 261, rotation: 0 },
      { type: "invisible_wall_small", x: 26, y: 220, rotation: 0 },
      { type: "invisible_wall_small", x: 24, y: 176, rotation: 0 },
      { type: "electr_btn", x: 328, y: 36, rotation: 0 },
      { type: "electr_btn", x: 177, y: 248, rotation: 0 },
      { type: "slide_doors", x: 409, y: 27, rotation: 0, custom: "star_door" },
      { type: "star_cover", x: 242, y: 233, rotation: 0 },
      { type: "bubble_cover", x: 244, y: 260, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 434,
        y: 102,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 459, y: 174, rotation: 0 },
      { type: "invisible_wall_small", x: 453, y: 220, rotation: 0 },
      { type: "alien", x: 177, y: 202, rotation: 0 },
      { type: "alien", x: 328, y: 203, rotation: 0 },
      { type: "apple_of_the_eye", x: 55, y: 160, rotation: 0 },
      { type: "apple_of_the_eye", x: 73, y: 167, rotation: 0 },
      { type: "apple_of_the_eye", x: 413, y: 169, rotation: 0 },
      { type: "apple_of_the_eye", x: 430, y: 159, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_big", x: -10, y: 165, rotation: 0 },
      { type: "Bob", x: 34, y: 147, rotation: 0 },
      { type: "baraban", x: 101, y: 228, rotation: 0, custom: "flipper1" },
      { type: "baraban", x: 389, y: 228, rotation: 0, custom: "flipper2" },
      { type: "button_red", x: 102, y: 262, rotation: 0, custom: "btn1" },
      { type: "button_red", x: 388, y: 262, rotation: 0, custom: "btn2" },
      {
        type: "invisible_wall_small",
        x: 64,
        y: 192,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 158, y: 221, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 181,
        y: 250,
        rotation: 1.3707963267948964,
        friction: 0,
      },
      {
        type: "invisible_wall_small",
        x: 246,
        y: 250,
        rotation: 1.7207963267948967,
        friction: 0,
      },
      { type: "invisible_wall_small", x: 270, y: 221, rotation: 0 },
      { type: "invisible_wall_small", x: 325, y: 221, rotation: 0 },
      {
        type: "btn2",
        x: 247,
        y: 30,
        rotation: 3.141592653589793,
        custom: "b2",
      },
      {
        type: "btn2",
        x: 367,
        y: 30,
        rotation: 3.141592653589793,
        custom: "b3",
      },
      { type: "blue_lamp", x: 125, y: 24, rotation: 0, custom: "l1_1" },
      { type: "blue_lamp", x: 247, y: 24, rotation: 0, custom: "l1_2" },
      { type: "star3_lvl8", x: 151, y: 57, rotation: 0, custom: "star2" },
      {
        type: "star_cover3_lvl8",
        x: 152,
        y: 52,
        rotation: 0,
        custom: "star_cover2",
      },
      { type: "blue_lamp", x: 367, y: 24, rotation: 0, custom: "l1_3" },
      { type: "gravity_button_up", x: 305, y: 256, rotation: 0 },
      { type: "invisible_wall_big", x: -10, y: 113, rotation: 0 },
      { type: "invisible_wall_small", x: 86, y: 30, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 173,
        y: 41,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 424,
        y: 48,
        rotation: 1.5707963267948966,
        restitution: 0,
        friction: 0.5,
      },
      {
        type: "invisible_wall_big",
        x: 425,
        y: 147,
        rotation: 1.5707963267948966,
        friction: 0,
      },
      { type: "blue_lamp", x: 167, y: 235, rotation: 0, custom: "l2_1" },
      { type: "blue_lamp", x: 167, y: 248, rotation: 0, custom: "l2_2" },
      { type: "blue_lamp", x: 167, y: 262, rotation: 0, custom: "l2_3" },
      {
        type: "btn2",
        x: 125,
        y: 30,
        rotation: 3.141592653589793,
        custom: "b1",
      },
      { type: "door_lvl8", x: 193, y: 222, rotation: 0, custom: "door1" },
      { type: "door_lvl8", x: 234, y: 222, rotation: 0, custom: "door2" },
      { type: "star1_lvl8", x: 435, y: 31, rotation: 0 },
      { type: "star2_lvl8", x: 262, y: 94, rotation: 0 },
      { type: "star_cover2_lvl8", x: 259, y: 99, rotation: 0 },
      { type: "teeth", x: 61, y: 140, rotation: 0, custom: "mouth" },
      { type: "green_door", x: 436, y: 26, rotation: 0, custom: "star_cover" },
      { type: "button_green2", x: 46, y: 68, rotation: 0, custom: "btn_green" },
      { type: "entrance_cover_lvl8", x: 36, y: 138, rotation: 0 },
      {
        type: "exit_cover_lvl8",
        x: 214,
        y: 293,
        rotation: 0,
        custom: "destination",
      },
      { type: "invisible_wall_small", x: 395, y: 27, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 62,
        y: 36,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 78,
        y: 54,
        rotation: -0.9853981633974485,
        friction: 0,
        custom: "cancel_speed",
      },
      { type: "invisible_wall_very_small", x: 159, y: 29, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 200,
        y: 41,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 186,
        y: 59,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 295,
        y: 41,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 319,
        y: 41,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 307,
        y: 59,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_very_small", x: 217, y: 29, rotation: 0 },
      { type: "invisible_wall_very_small", x: 275, y: 29, rotation: 0 },
      { type: "invisible_wall_very_small", x: 338, y: 29, rotation: 0 },
      { type: "apple_of_the_eye", x: 60, y: 93, rotation: 0 },
      { type: "apple_of_the_eye", x: 82, y: 102, rotation: 0 },
      { type: "alien_fly", x: 127, y: 105, rotation: 0, custom: "alien" },
      {
        type: "invisible_wall_small",
        x: 410,
        y: 47,
        rotation: 0.9853981633974485,
        custom: "cancel_speed",
      },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "Bob", x: 17, y: 238, rotation: 0 },
      { type: "entrance_lvl9", x: 20, y: 237, rotation: 0 },
      { type: "invisible_wall_big", x: 70, y: 263, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 36,
        y: 259,
        rotation: 0.15000000000000002,
      },
      { type: "gravity_button_up", x: 421.5, y: 233, rotation: 0 },
      { type: "invisible_wall_small", x: 25, y: 212, rotation: 0 },
      { type: "invisible_wall_big", x: 75, y: 199, rotation: 0 },
      { type: "invisible_wall_big", x: 225, y: 199, rotation: 0 },
      { type: "invisible_wall_big", x: 375, y: 199, rotation: 0 },
      { type: "invisible_wall_small", x: 372, y: 212, rotation: 0 },
      { type: "invisible_wall_big", x: 220, y: 263, rotation: 0 },
      { type: "invisible_wall_big", x: 370, y: 263, rotation: 0 },
      {
        type: "exit_lvl9",
        x: 377,
        y: 236.5,
        rotation: 0,
        custom: "destination",
      },
      {
        type: "invisible_wall_small",
        x: 361,
        y: 259,
        rotation: -0.15000000000000002,
      },
      { type: "apple_of_the_eye", x: 47.5, y: 199, rotation: 0 },
      { type: "apple_of_the_eye", x: 65.5, y: 205.5, rotation: 0 },
      { type: "apple_of_the_eye", x: 331.5, y: 209, rotation: 0 },
      { type: "apple_of_the_eye", x: 348.5, y: 198, rotation: 0 },
      { type: "bridge_lvl9", x: 151, y: 228, rotation: 0, custom: "bridge1" },
      { type: "bridge_lvl9", x: 251, y: 228, rotation: 0, custom: "bridge2" },
      {
        type: "cover_bridge2_lvl9",
        x: 151,
        y: 192.5,
        rotation: 0,
        custom: "cover1",
      },
      {
        type: "cover_bridge1_lvl9",
        x: 251,
        y: 192,
        rotation: 0,
        custom: "cover2",
      },
      { type: "blue_lamp2", x: 151.5, y: 191, rotation: 0, custom: "lamp1" },
      { type: "blue_lamp2", x: 252.5, y: 191, rotation: 0, custom: "lamp2" },
      {
        type: "invisible_wall_big",
        x: 170,
        y: 178,
        rotation: 0,
        custom: "ray",
      },
      {
        type: "invisible_wall_big",
        x: 322,
        y: 178,
        rotation: 0,
        custom: "ray",
      },
      { type: "invisible_wall_big", x: 166, y: 5, rotation: 0, custom: "ray" },
      { type: "invisible_wall_big", x: 317, y: 5, rotation: 0, custom: "ray" },
      {
        type: "invisible_wall_very_small",
        x: 410,
        y: 93,
        rotation: 0,
        custom: "ray",
      },
      { type: "invisible_wall_small", x: 62, y: 107, rotation: 0 },
      { type: "cover_alien_lvl9", x: 46, y: 87, rotation: 0 },
      { type: "portal_lvl9", x: 83, y: 87, rotation: 0 },
      { type: "invisible_wall_small", x: 62, y: 60, rotation: 0 },
      { type: "button_red", x: 47, y: 89, rotation: 0 },
      { type: "star2_lvl12", x: 464, y: 233, rotation: 0 },
      { type: "star17", x: 332, y: 28, rotation: 0.1 },
      { type: "cover_star_lvl9", x: 317, y: 34, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_big", x: 73, y: 111, rotation: 0 },
      { type: "Bob", x: 24, y: 81, rotation: 0 },
      { type: "invisible_wall_small", x: 29, y: 103, rotation: 0 },
      { type: "gravity_button_up", x: 51, y: 255, rotation: 0 },
      { type: "invisible_wall_big", x: 69, y: 12, rotation: 0 },
      { type: "button_red", x: 400, y: 257, rotation: 0, custom: "btn" },
      { type: "baraban", x: 399, y: 224, rotation: 0, custom: "flipper" },
      { type: "invisible_wall_big", x: 220, y: 12, rotation: 0 },
      { type: "invisible_wall_big", x: 372, y: 12, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 441,
        y: 87,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 440,
        y: 190,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_very_small", x: 349, y: 216, rotation: 0 },
      { type: "invisible_wall_very_small", x: 338, y: 216, rotation: 0 },
      { type: "invisible_wall_big", x: 59, y: 217, rotation: 0 },
      { type: "invisible_wall_small", x: 37, y: 211, rotation: 0 },
      { type: "star2", x: 388, y: 76, rotation: 0 },
      { type: "cover_entrance_lvl10", x: 28, y: 82, rotation: 0 },
      {
        type: "cover_exit_lvl10",
        x: 27,
        y: 190,
        rotation: 0,
        custom: "destination",
      },
      {
        type: "platform_lvl10",
        x: 296,
        y: 233,
        rotation: 0,
        custom: "platform",
      },
      { type: "ray_lvl10", x: 389, y: 115, rotation: 0, custom: "block_ray" },
      {
        type: "invisible_wall_small",
        x: 429,
        y: 60,
        rotation: 1.5707963267948966,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_small",
        x: 305,
        y: 115,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_small",
        x: 179,
        y: 118,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "star_cover_lvl10",
        x: 388,
        y: 77,
        rotation: 0,
        custom: "star_frame",
      },
      {
        type: "star_cover_door_lvl10",
        x: 387,
        y: 77,
        rotation: 0,
        custom: "star_cover",
      },
      { type: "invisible_wall_small", x: 30, y: 56, rotation: 0 },
      { type: "invisible_wall_small", x: 26, y: 165, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 64,
        y: 142,
        rotation: -0.8353981633974483,
      },
      { type: "invisible_wall_small", x: 119, y: 127, rotation: 0 },
      { type: "star2_lvl10", x: 181, y: 277, rotation: 0 },
      {
        type: "star_cover_grass_lvl10",
        x: 180,
        y: 280,
        rotation: 0,
        custom: "grass",
      },
      { type: "apple_of_the_eye", x: 59, y: 44, rotation: 0 },
      { type: "apple_of_the_eye", x: 77, y: 51, rotation: 0 },
      { type: "apple_of_the_eye", x: 59, y: 151, rotation: 0 },
      { type: "apple_of_the_eye", x: 77, y: 162, rotation: 0 },
      {
        type: "button_green",
        x: 111,
        y: 254,
        rotation: -1.5707963267948966,
        custom: "btn_left",
      },
      {
        type: "button_green",
        x: 351,
        y: 254,
        rotation: 1.5707963267948966,
        custom: "btn_right",
      },
      { type: "alien_fly", x: 241, y: 180, rotation: 0, custom: "alien" },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "Bob", x: 41, y: 8, rotation: 0 },
      { type: "cover_entrance_lvl11", x: 43.5, y: 8, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 68,
        y: 5,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 23, y: 75, rotation: 0 },
      { type: "portal", x: 132.5, y: 152, rotation: 0 },
      { type: "portal", x: 63, y: 208, rotation: 0 },
      { type: "portal", x: 242, y: 66, rotation: 0 },
      { type: "portal", x: 220, y: 233, rotation: 0 },
      { type: "portal", x: 397, y: 233, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 1,
        y: 43,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 154, y: 6, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 169,
        y: 95,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 120, y: 183, rotation: 0 },
      { type: "invisible_wall_small", x: 163, y: 183, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 96,
        y: 98,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 90,
        y: 109,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 60, y: 99, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 26,
        y: 174,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 98,
        y: 214,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 62, y: 239, rotation: 0 },
      { type: "invisible_wall_big", x: 286, y: 26, rotation: 0 },
      { type: "invisible_wall_small", x: 331, y: 128, rotation: 0 },
      { type: "invisible_wall_big", x: 436, y: 26, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 206,
        y: 61,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 291, y: 98, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 364,
        y: 126,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 364,
        y: 172,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 336, y: 196, rotation: 0 },
      { type: "invisible_wall_very_small", x: 303, y: 195, rotation: 0 },
      { type: "invisible_wall_very_small", x: 308, y: 174, rotation: -0.25 },
      { type: "invisible_wall_small", x: 315, y: 178, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 432,
        y: 104,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 432,
        y: 254,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 263, y: 115, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 188,
        y: 194,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 263, y: 264, rotation: 0 },
      { type: "invisible_wall_big", x: 413, y: 264, rotation: 0 },
      { type: "star1", x: 456.5, y: 141, rotation: 0 },
      { type: "star1", x: 456.5, y: 188, rotation: 0 },
      { type: "star1", x: 456.5, y: 235.5, rotation: 0 },
      { type: "slide_doors", x: 456.5, y: 141, rotation: 0, custom: "doors1" },
      { type: "slide_doors", x: 456.5, y: 188, rotation: 0, custom: "doors2" },
      {
        type: "slide_doors",
        x: 456.5,
        y: 235.5,
        rotation: 0,
        custom: "doors3",
      },
      { type: "gravity_button_up", x: 142.5, y: 240, rotation: 0 },
      {
        type: "bridge1_lvl11",
        x: 88,
        y: 42,
        rotation: 0,
        custom: "bridge1_open",
      },
      {
        type: "bridge2_lvl11",
        x: 59,
        y: 115,
        rotation: 0,
        custom: "bridge2_open",
      },
      { type: "bridge3_lvl11", x: 397, y: 106, rotation: 0, custom: "bridge3" },
      {
        type: "cover_exit_lvl11",
        x: 337,
        y: 151,
        rotation: 0,
        custom: "destination",
      },
      {
        type: "btn",
        x: 57.5,
        y: 101,
        rotation: 3.141592653589793,
        custom: "buttonBridge",
      },
      {
        type: "btn_mini",
        x: 136,
        y: 12,
        rotation: 3.141592653589793,
        custom: "button1",
      },
      {
        type: "btn_mini",
        x: 193,
        y: 149,
        rotation: 1.5707963267948966,
        custom: "button3",
      },
      {
        type: "btn_mini",
        x: 328,
        y: 202,
        rotation: 3.141592653589793,
        custom: "button2",
      },
      { type: "teeth", x: 42.5, y: 14, rotation: -1.56 },
      { type: "apple_of_the_eye", x: 290, y: 126, rotation: 0 },
      { type: "apple_of_the_eye", x: 318.5, y: 108.5, rotation: 0 },
      { type: "alien_snail", x: 415, y: 76, rotation: 0, custom: "left" },
      { type: "invisible_wall_small", x: 149, y: 9, rotation: 0 },
      { type: "invisible_wall_very_small", x: 329, y: 200, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_big", x: 57, y: 242, rotation: 0 },
      { type: "Bob", x: 28, y: 217, rotation: 0 },
      { type: "invisible_wall_big", x: 208, y: 242, rotation: 0 },
      { type: "gravity_button_up", x: 377, y: 252, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 348,
        y: 201,
        rotation: -0.48539816339744807,
      },
      {
        type: "invisible_wall_small",
        x: 438,
        y: 154,
        rotation: -0.49999999999999994,
      },
      { type: "invisible_wall_big", x: 351, y: 114, rotation: 0 },
      { type: "invisible_wall_small", x: 453, y: 114, rotation: 0 },
      { type: "invisible_wall_big", x: 351, y: 96, rotation: 0 },
      { type: "invisible_wall_small", x: 453, y: 96, rotation: 0 },
      { type: "invisible_wall_small", x: 449, y: 90, rotation: 0 },
      { type: "invisible_wall_big", x: 351, y: 4, rotation: 0 },
      { type: "invisible_wall_small", x: 453, y: 45, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 432,
        y: 19,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 200, y: 4, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 76,
        y: 29,
        rotation: -0.23539816339744812,
      },
      {
        type: "invisible_wall_small",
        x: 390,
        y: 12,
        rotation: 0,
        custom: "ray_inv",
      },
      { type: "star1_lvl12", x: 59, y: 162, rotation: 0 },
      { type: "star2_lvl12", x: 90, y: 280, rotation: 0 },
      { type: "star3_lvl12", x: 239, y: 62, rotation: 0 },
      { type: "button_red", x: 420, y: 209, rotation: 0, custom: "btn_red" },
      { type: "invisible_wall_small", x: 38, y: 238, rotation: 0 },
      { type: "invisible_wall_small", x: 25, y: 191, rotation: 0 },
      {
        type: "btn2",
        x: 339,
        y: 205,
        rotation: -0.48539816339744807,
        custom: "btn_press",
      },
      { type: "blue_lamp", x: 343, y: 215, rotation: 0, custom: "light" },
      {
        type: "bridge_anim_lvl12",
        x: 366,
        y: 154,
        rotation: -0.49999999999999994,
        custom: "obstacle",
      },
      {
        type: "button_cover_lvl12",
        x: 377,
        y: 251,
        rotation: 0,
        custom: "gravity_cover",
      },
      {
        type: "electricity_anim_lvl12",
        x: 298,
        y: 173,
        rotation: 0,
        custom: "shock",
      },
      {
        type: "exit_cover_lvl12",
        x: 463,
        y: 67,
        rotation: 0,
        custom: "destination",
      },
      { type: "hat_anim_lvl12", x: 53, y: 154, rotation: 0, custom: "hat" },
      { type: "star_cover_lvl12", x: 244, y: 62, rotation: 0 },
      {
        type: "satellite_lvl12",
        x: 205,
        y: 76,
        rotation: 0,
        custom: "satellite",
      },
      { type: "electr_btn", x: 216, y: 257, rotation: 0 },
      { type: "alien", x: 408, y: 145, rotation: 0, custom: "alien" },
      { type: "start_cover1_lvl12", x: 38, y: 220, rotation: 0 },
      { type: "apple_of_the_eye", x: 56, y: 176, rotation: 0, custom: "eye1" },
      { type: "apple_of_the_eye", x: 74, y: 182, rotation: 0, custom: "eye2" },
      { type: "apple_of_the_eye", x: 429, y: 28, rotation: 0 },
      { type: "apple_of_the_eye", x: 412, y: 39, rotation: 0 },
      {
        type: "start_cover2_lvl12",
        x: 27,
        y: 214,
        rotation: 0,
        custom: "entrance",
      },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_big", x: 73, y: 276, rotation: 0 },
      { type: "Bob", x: 30, y: 251, rotation: 0 },
      { type: "invisible_wall_big", x: 224, y: 276, rotation: 0 },
      { type: "invisible_wall_small", x: 40, y: 271, rotation: 0 },
      { type: "gravity_button_up", x: 325, y: 225, rotation: 0 },
      { type: "invisible_wall_big", x: 223, y: 80, rotation: 0 },
      { type: "invisible_wall_big", x: 71, y: 80, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 98,
        y: 159,
        rotation: 1.8207963267948968,
      },
      {
        type: "btn2",
        x: 134,
        y: 116,
        rotation: 3.141592653589793,
        custom: "btn_press",
      },
      {
        type: "invisible_wall_small",
        x: 162,
        y: 145,
        rotation: 1.5207963267948965,
      },
      {
        type: "invisible_wall_small",
        x: 165,
        y: 190,
        rotation: 1.5207963267948965,
      },
      { type: "invisible_wall_very_small", x: 183, y: 213, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 198,
        y: 189,
        rotation: 1.6707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 200,
        y: 145,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 286, y: 185, rotation: 0 },
      { type: "invisible_wall_small", x: 328, y: 185, rotation: 0 },
      { type: "invisible_wall_small", x: 359, y: 185, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 382,
        y: 209,
        rotation: 1.5707963267948966,
        custom: "stop_wall",
      },
      { type: "button_red", x: 421, y: 256, rotation: 0, custom: "btn2" },
      { type: "baraban", x: 422, y: 223, rotation: 0, custom: "flipper" },
      { type: "invisible_wall_big", x: 224, y: 115, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 296,
        y: 98,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 360,
        y: 91,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 372,
        y: 91,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 372,
        y: 104,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 360,
        y: 104,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 263,
        y: 261,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 31, y: 225, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 64,
        y: 191,
        rotation: 0,
        custom: "ray_inv",
      },
      { type: "invisible_wall_big", x: 233, y: 9, rotation: 0 },
      { type: "invisible_wall_big", x: 384, y: 9, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 459,
        y: 206,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 97,
        y: 7,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_small",
        x: 130,
        y: 7,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_small",
        x: 265,
        y: 73,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_small",
        x: 249,
        y: 73,
        rotation: 0,
        custom: "ray_inv",
      },
      { type: "invisible_wall_small", x: 37, y: 74, rotation: 0 },
      { type: "button_red", x: 258, y: 100, rotation: 0, custom: "btn1" },
      { type: "blue_lamp", x: 134, y: 108, rotation: 0, custom: "light" },
      { type: "star1_lvl14", x: 95, y: 53, rotation: 0 },
      { type: "star2_lvl14", x: 186, y: 230, rotation: 0 },
      { type: "star3_lvl14", x: 12, y: 128, rotation: 0 },
      {
        type: "bridge_anim_lvl14",
        x: 330,
        y: 107,
        rotation: 0,
        custom: "bridge_open",
      },
      { type: "exit_sign_lvl14", x: 96, y: 52, rotation: 0, custom: "exit" },
      { type: "pipe_cover_lvl14", x: 35, y: 242, rotation: 0 },
      {
        type: "pipe_cover_lvl14",
        x: 38,
        y: 46,
        rotation: 0,
        custom: "destination",
      },
      { type: "star_cover_lvl14", x: 187, y: 230, rotation: 0 },
      {
        type: "electro_barrier_lvl14",
        x: 170,
        y: 245,
        rotation: 0,
        custom: "shock",
      },
      { type: "star_cover2_lvl14", x: 11, y: 135, rotation: 0 },
      { type: "apple_of_the_eye", x: 59, y: 211, rotation: 0, custom: "eye2" },
      { type: "apple_of_the_eye", x: 78, y: 218, rotation: 0 },
      { type: "apple_of_the_eye", x: 62, y: 15, rotation: 0, custom: "eye1" },
      { type: "apple_of_the_eye", x: 79, y: 24, rotation: 0 },
      { type: "alien", x: 328, y: 160, rotation: 0 },
      { type: "invisible_wall_small", x: 30, y: 30, rotation: 0 },
      { type: "teeth", x: 53, y: 251, rotation: 0, custom: "mouth" },
      {
        type: "invisible_wall_big",
        x: 459,
        y: 75,
        rotation: 1.5707963267948966,
        custom: "stop_wall",
      },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "Bob", x: 30, y: 60, rotation: 0 },
      { type: "entrance_lvl15", x: 26, y: 63, rotation: 0 },
      {
        type: "exit_lvl15",
        x: 457,
        y: 238,
        rotation: 0,
        custom: "destination",
      },
      { type: "gravity_button_up", x: 62, y: 231, rotation: 0 },
      { type: "invisible_wall_big", x: 125, y: 95, rotation: 0 },
      { type: "invisible_wall_small", x: 34, y: 88, rotation: 0 },
      { type: "invisible_wall_small", x: 33, y: 41, rotation: 0 },
      { type: "invisible_wall_big", x: 112, y: 21, rotation: 0 },
      { type: "invisible_wall_big", x: 242, y: 95, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 315,
        y: 107,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 87, y: 123, rotation: 0 },
      { type: "invisible_wall_big", x: 416, y: 265, rotation: 0 },
      { type: "invisible_wall_small", x: 454, y: 215, rotation: 0 },
      { type: "invisible_wall_small", x: 433, y: 259, rotation: -0.25 },
      { type: "invisible_wall_big", x: 262, y: 21, rotation: 0 },
      { type: "invisible_wall_big", x: 412, y: 21, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 456,
        y: 50,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 447, y: 80, rotation: 0 },
      { type: "spring", x: 371, y: 153, rotation: 0 },
      { type: "apple_of_the_eye", x: 73.5, y: 34, rotation: 0 },
      { type: "apple_of_the_eye", x: 52, y: 24, rotation: 0 },
      { type: "apple_of_the_eye", x: 416, y: 204.5, rotation: 0 },
      { type: "apple_of_the_eye", x: 438, y: 195, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 374,
        y: 104,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 232, y: 183, rotation: 0 },
      { type: "invisible_wall_big", x: 379, y: 183, rotation: 0 },
      { type: "invisible_wall_big", x: 23, y: 184, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 95,
        y: 261,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 266, y: 265, rotation: 0 },
      { type: "invisible_wall_big", x: 117, y: 265, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 157,
        y: 198,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 231, y: 213, rotation: 0 },
      { type: "invisible_wall_big", x: 381, y: 213, rotation: 0 },
      { type: "star2_lvl15", x: 93, y: 129, rotation: 0 },
      { type: "button_red", x: 415.5, y: 155, rotation: 0 },
      { type: "wheel_lvl15", x: 176.5, y: 122.5, rotation: 0 },
      { type: "wheel_lvl15", x: 192.5, y: 122.5, rotation: 0 },
      { type: "wheel_lvl15", x: 208.5, y: 122.5, rotation: 0 },
      { type: "wheel_lvl15", x: 225, y: 122.5, rotation: 0 },
      { type: "wheel_lvl15", x: 241, y: 122.5, rotation: 0 },
      { type: "wheel_lvl15", x: 258, y: 122.5, rotation: 0 },
      { type: "wheel_lvl15", x: 274.5, y: 122.5, rotation: 0 },
      { type: "wheel_lvl15", x: 291, y: 122.5, rotation: 0 },
      { type: "wheel_lvl15", x: 307, y: 122.5, rotation: 0 },
      {
        type: "bridge2_lvl15",
        x: 363.5,
        y: 239.5,
        rotation: 0,
        custom: "bridge4",
      },
      {
        type: "bridge1_lvl15",
        x: 79.5,
        y: 154,
        rotation: 0,
        custom: "bridge2",
      },
      {
        type: "bridge2_lvl15",
        x: 165.5,
        y: 239,
        rotation: 0,
        custom: "bridge3_open",
      },
      {
        type: "bridge1_lvl15",
        x: 381.5,
        y: 50,
        rotation: 0,
        custom: "bridge1",
      },
      { type: "btn", x: 421.5, y: 76, rotation: 0, custom: "btn1" },
      { type: "btn", x: 332, y: 261, rotation: 0, custom: "btn2" },
      {
        type: "invisible_wall_very_small",
        x: 174,
        y: 89,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_very_small",
        x: 277,
        y: 27,
        rotation: 0,
        custom: "ray_inv",
      },
      { type: "star3_lvl15", x: 225, y: 122.5, rotation: 0, custom: "star" },
      { type: "cover_star2_lvl15", x: 91.5, y: 117.5, rotation: 0 },
      { type: "star1_lvl15", x: 421, y: 25, rotation: 0 },
      { type: "cover_star1_lvl15", x: 421, y: 13, rotation: 0 },
      { type: "alien_snail", x: 2, y: 163, rotation: 0 },
      {
        type: "violet_lamp",
        x: 422.5,
        y: 89.5,
        rotation: 0,
        custom: "lamp_btn1",
      },
      {
        type: "blue_lamp2",
        x: 333.5,
        y: 274.5,
        rotation: 0,
        custom: "lamp_btn2",
      },
      { type: "blue_lamp2", x: 382.5, y: 9, rotation: 0, custom: "lamp1" },
      { type: "blue_lamp2", x: 80, y: 112.5, rotation: 0, custom: "lamp2" },
      { type: "blue_lamp2", x: 166, y: 201, rotation: 0, custom: "lamp3" },
      { type: "violet_lamp", x: 364, y: 201, rotation: 0, custom: "lamp4" },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_small", x: 30, y: 201, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 31,
        y: 196,
        rotation: 0,
        custom: "remove_platform",
      },
      { type: "invisible_wall_small", x: 21, y: 149, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 52,
        y: 276,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 129, y: 270, rotation: 0 },
      { type: "invisible_wall_small", x: 141, y: 203, rotation: 0 },
      { type: "invisible_wall_small", x: 178, y: 203, rotation: 0 },
      { type: "invisible_wall_small", x: 178, y: 216, rotation: 0 },
      { type: "invisible_wall_small", x: 141, y: 216, rotation: 0 },
      { type: "invisible_wall_small", x: 230, y: 270, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 258,
        y: 240,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 29, y: 132, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 53,
        y: 57,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 416, y: 269, rotation: 0 },
      { type: "invisible_wall_small", x: 449, y: 264, rotation: 0 },
      { type: "invisible_wall_small", x: 457, y: 215, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 432,
        y: 204,
        rotation: 0.44999999999999996,
      },
      {
        type: "invisible_wall_big",
        x: 418,
        y: 118,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 394, y: 32, rotation: 0.3 },
      { type: "invisible_wall_small", x: 346, y: 17, rotation: 0.3 },
      { type: "invisible_wall_big", x: 284, y: 16, rotation: 0.05 },
      { type: "invisible_wall_big", x: 134, y: 12, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 192,
        y: 82,
        rotation: -0.038397243543875255,
      },
      {
        type: "invisible_wall_small",
        x: 292,
        y: 78,
        rotation: -0.038397243543875255,
      },
      {
        type: "invisible_wall_big",
        x: 349,
        y: 193,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 348,
        y: 105,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_very_small", x: 333, y: 79, rotation: 0.1 },
      {
        type: "invisible_wall_very_small",
        x: 258,
        y: 208,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 120,
        y: 114,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 195, y: 141, rotation: 0, friction: 0 },
      {
        type: "invisible_wall_very_small",
        x: 281,
        y: 146,
        rotation: 0.44999999999999996,
      },
      { type: "electr_btn", x: 64, y: 260, rotation: 0 },
      { type: "gravity_button_up", x: 229.5, y: 116, rotation: 0 },
      {
        type: "cover_entrance_lvl16",
        x: 25,
        y: 160,
        rotation: 0,
        custom: "entrance",
      },
      {
        type: "cover_exit_lvl16",
        x: 453,
        y: 232,
        rotation: 0,
        custom: "destination",
      },
      { type: "apple_of_the_eye", x: 46, y: 127, rotation: 0, custom: "eye1" },
      { type: "apple_of_the_eye", x: 67, y: 136, rotation: 0 },
      { type: "apple_of_the_eye", x: 412, y: 212, rotation: 0 },
      { type: "apple_of_the_eye", x: 429, y: 201, rotation: 0, custom: "eye2" },
      { type: "Bob", x: 20, y: 176, rotation: 0 },
      { type: "teeth", x: 46, y: 173, rotation: 0, custom: "mouth" },
      { type: "alien", x: 381, y: 247, rotation: 0, custom: "alien" },
      {
        type: "button_red",
        x: 299.5,
        y: 173.5,
        rotation: 0,
        custom: "btn_red",
      },
      {
        type: "btn",
        x: 168,
        y: 20,
        rotation: 3.141592653589793,
        custom: "press_btn1",
      },
      {
        type: "btn",
        x: 253,
        y: 241,
        rotation: -1.5707963267948966,
        custom: "press_btn2",
      },
      { type: "blue_lamp", x: 167.5, y: 6.5, rotation: 0, custom: "l1" },
      { type: "violet_lamp", x: 268, y: 241, rotation: 0, custom: "l4" },
      { type: "violet_lamp", x: 131.5, y: 128, rotation: 0, custom: "l2" },
      { type: "star3_lvl16", x: 352, y: 127, rotation: 0 },
      { type: "violet_lamp", x: 429.5, y: 124, rotation: 0, custom: "l5" },
      {
        type: "bridge_anim1_lvl16",
        x: 132,
        y: 172,
        rotation: 0,
        custom: "bridge2",
      },
      {
        type: "bridge_anim3_lvl16",
        x: 130,
        y: 50,
        rotation: 0,
        custom: "bridge1",
      },
      {
        type: "bridge_anim2_lvl16",
        x: 382,
        y: 125,
        rotation: 0,
        custom: "bridge4",
      },
      { type: "star1_lvl16", x: 173, y: 197, rotation: 0 },
      {
        type: "bridge_anim4_lvl16",
        x: 230,
        y: 210,
        rotation: 0,
        custom: "bridge3",
      },
      { type: "blue_lamp", x: 273, y: 209, rotation: 0, custom: "l3" },
      { type: "star_cover1_lvl16", x: 174, y: 193, rotation: 0 },
      { type: "star_cover2_lvl16", x: 344, y: 122.5, rotation: 0 },
      { type: "star2_lvl16", x: 335, y: 278, rotation: -0.15000000000000002 },
      { type: "violet_lamp", x: 130, y: 7.5, rotation: 0, custom: "l6" },
      { type: "spring", x: 255, y: 173, rotation: 0, custom: "spring" },
      {
        type: "invisible_wall_small",
        x: 77,
        y: 248,
        rotation: 0.7353981633974482,
      },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "Bob", x: 24, y: 111, rotation: 0 },
      { type: "star1", x: 52, y: 66, rotation: 0, custom: "star" },
      { type: "hat_lvl17", x: 48, y: 49, rotation: 0 },
      { type: "cover_tube_lvl17", x: 30, y: 105, rotation: 0 },
      { type: "entrance_lvl17", x: 21, y: 105, rotation: 0 },
      { type: "exit_lvl17", x: 461, y: 94, rotation: 0, custom: "destination" },
      { type: "gravity_button_up", x: 65.5, y: 244, rotation: 0 },
      { type: "electr_btn", x: 148, y: 200, rotation: 0 },
      { type: "electr_btn", x: 281, y: 267, rotation: 0 },
      { type: "invisible_wall_small", x: 20, y: 90, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: -2,
        y: 58,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 11, y: 29, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 125,
        y: 84,
        rotation: 0.5235987755982988,
      },
      {
        type: "invisible_wall_small",
        x: 48,
        y: 39,
        rotation: 0.5235987755982988,
      },
      { type: "invisible_wall_small", x: 214, y: 121, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 240,
        y: 107,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 240,
        y: 89,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 216, y: 77, rotation: 0 },
      { type: "invisible_wall_small", x: 174, y: 77, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 156,
        y: 3,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 434, y: 1, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 432,
        y: 29,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 462, y: 78, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 436,
        y: 64,
        rotation: 1.3000000000000005,
      },
      { type: "invisible_wall_big", x: 444, y: 132, rotation: 0 },
      { type: "invisible_wall_small", x: 434, y: 127, rotation: -0.25 },
      { type: "invisible_wall_small", x: 341, y: 77, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 317,
        y: 104,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 320,
        y: 152,
        rotation: 1.4500000000000006,
      },
      {
        type: "invisible_wall_very_small",
        x: 322,
        y: 175,
        rotation: 1.5000000000000007,
      },
      { type: "invisible_wall_small", x: 347, y: 188, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 383,
        y: 182,
        rotation: -0.49999999999999994,
      },
      { type: "invisible_wall_big", x: 16, y: 140, rotation: 0 },
      { type: "invisible_wall_small", x: 24, y: 136, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 156,
        y: 177,
        rotation: 0.5148721293383272,
      },
      {
        type: "invisible_wall_big",
        x: 287,
        y: 251,
        rotation: 0.5148721293383272,
      },
      { type: "apple_of_the_eye", x: 65, y: 81, rotation: 0 },
      { type: "apple_of_the_eye", x: 47, y: 75, rotation: 0, custom: "eye1" },
      {
        type: "apple_of_the_eye",
        x: 435,
        y: 63.5,
        rotation: 0,
        custom: "eye2",
      },
      { type: "apple_of_the_eye", x: 418, y: 74.5, rotation: 0 },
      { type: "invisible_wall_small", x: 414, y: 179, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 419,
        y: 275,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_big",
        x: 445,
        y: 260,
        rotation: 1.5707963267948966,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_small",
        x: 365,
        y: 104,
        rotation: 1.5707963267948966,
      },
      {
        type: "electricity2_lvl17",
        x: 278,
        y: 110.5,
        rotation: 0,
        custom: "shock",
      },
      {
        type: "electricity_lvl17",
        x: 203,
        y: 162,
        rotation: 0,
        custom: "shock",
      },
      { type: "wheel_lvl17", x: 168, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 184, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 200, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 216.5, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 233, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 248.5, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 265.5, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 281.5, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 298.5, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 315.5, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 331, y: 10, rotation: 0 },
      { type: "wheel_lvl17", x: 348, y: 10, rotation: 0 },
      { type: "button_red", x: 137, y: 28.5, rotation: 0 },
      { type: "btn", x: 191, y: 73, rotation: 0 },
      { type: "bridge_lvl17", x: 356, y: 46, rotation: 3.141592653589793 },
      { type: "blue_lamp2", x: 192.5, y: 86, rotation: 0, custom: "lamp_btn" },
      {
        type: "blue_lamp2",
        x: 357.5,
        y: 85,
        rotation: 0,
        custom: "lamp_bridge",
      },
      { type: "star_lvl17", x: 203, y: 122, rotation: 0 },
      { type: "cover1_lvl17", x: 204, y: 111, rotation: 0 },
      { type: "star1_lvl15", x: 417, y: 252, rotation: -0.44999999999999996 },
      { type: "cover2_lvl17", x: 414, y: 256, rotation: 0 },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_big", x: 50, y: 183, rotation: 0 },
      { type: "Bob", x: 70, y: 86, rotation: 0 },
      { type: "invisible_wall_big", x: 75, y: 267, rotation: 0 },
      { type: "invisible_wall_big", x: 225, y: 267, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 293,
        y: 237,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 180,
        y: 141,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 191,
        y: 141,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 180,
        y: 184,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 268, y: 182, rotation: 0 },
      { type: "invisible_wall_small", x: 352, y: 182, rotation: 0 },
      { type: "baraban", x: 417, y: 189, rotation: 0, custom: "flipper" },
      { type: "button_red", x: 309, y: 237, rotation: 0, custom: "btn_1" },
      { type: "button_red", x: 416, y: 222, rotation: 0, custom: "btn_2" },
      { type: "invisible_wall_small", x: 27, y: 261, rotation: 0 },
      { type: "star1", x: 67, y: 45, rotation: 0 },
      { type: "blue_lamp2", x: 105, y: 193, rotation: 0, custom: "l1" },
      { type: "blue_lamp2", x: 456, y: 160, rotation: 0, custom: "l4" },
      { type: "violet_lamp", x: 192, y: 190, rotation: 0, custom: "l2" },
      { type: "violet_lamp", x: 345, y: 192, rotation: 0, custom: "l3" },
      {
        type: "invisible_wall_small",
        x: 46,
        y: 90,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 95,
        y: 90,
        rotation: 1.5707963267948966,
      },
      { type: "star_lvl18", x: 471, y: 99, rotation: -0.15000000000000002 },
      {
        type: "lvl18_anim_door1",
        x: 103,
        y: 235,
        rotation: 0,
        custom: "door1",
      },
      {
        type: "lvl18_anim_door2",
        x: 150,
        y: 191,
        rotation: 0,
        custom: "door2",
      },
      {
        type: "lvl18_exit_cover",
        x: 26,
        y: 240,
        rotation: 0,
        custom: "destination",
      },
      { type: "apple_of_the_eye", x: 54, y: 201, rotation: 0 },
      { type: "apple_of_the_eye", x: 72, y: 212, rotation: 0 },
      { type: "btn2", x: 344, y: 178, rotation: 0, custom: "press_btn2" },
      {
        type: "btn2",
        x: 444,
        y: 156,
        rotation: -1.5707963267948966,
        custom: "press_btn3",
      },
      { type: "btn_mini", x: 246, y: 261, rotation: 0, custom: "press_btn1" },
      { type: "portal", x: 281, y: 151, rotation: 0 },
      { type: "portal", x: 152, y: 238, rotation: 0 },
      { type: "lvl18_box", x: 223, y: 151, rotation: 0, custom: "star_box" },
      {
        type: "lvl18_btn_crane",
        x: 404,
        y: 28,
        rotation: 0,
        custom: "crane_right",
      },
      {
        type: "lvl18_btn_crane",
        x: 153,
        y: 28,
        rotation: 0,
        custom: "crane_left",
      },
      {
        type: "lvl18_crane_stats",
        x: 343,
        y: 64,
        rotation: 0,
        custom: "crane",
      },
      { type: "lvl18_star_cover", x: 465, y: 92, rotation: 0 },
      {
        type: "lvl18_start_cover",
        x: 71,
        y: 89,
        rotation: 0,
        custom: "entrance",
      },
      {
        type: "lvl18_star_cover2",
        x: 67,
        y: 42,
        rotation: 0,
        custom: "star_cover",
      },
      { type: "spring", x: 264, y: 237, rotation: 0, custom: "spring" },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "btn", x: 344, y: 14, rotation: 3.141592653589793 },
      { type: "ant", x: 32, y: 50, rotation: 0 },
      { type: "Bob", x: 17, y: 169, rotation: 0 },
      { type: "entrance_lvl19", x: -2.5, y: 163, rotation: 0 },
      { type: "exit_lvl19", x: -9, y: 235, rotation: 0, custom: "destination" },
      { type: "star1_lvl16", x: 439, y: 153, rotation: -0.5499999999999999 },
      { type: "cover2_lvl19", x: 439, y: 155.5, rotation: 0 },
      { type: "star_lvl19", x: 257, y: 270, rotation: 0 },
      { type: "cover1_lvl19", x: 259, y: 277, rotation: 0 },
      { type: "star2_lvl19", x: 251, y: 105, rotation: 0 },
      { type: "gravity_button_up", x: 420.5, y: 102, rotation: 0 },
      { type: "cover1_ant_lvl19", x: 33, y: 46, rotation: 0 },
      { type: "cover2_ant_lvl19", x: 156, y: 108, rotation: 0 },
      { type: "cover3_ant_lvl19", x: 446, y: 42, rotation: 0 },
      { type: "baraban", x: 408, y: 202, rotation: 0 },
      { type: "button_red", x: 407.5, y: 236.5, rotation: 0 },
      { type: "invisible_wall_big", x: 43, y: 190, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 39,
        y: 187,
        rotation: 0.15000000000000002,
      },
      { type: "invisible_wall_big", x: 332, y: 261, rotation: 0 },
      { type: "invisible_wall_big", x: 43, y: 261, rotation: 0 },
      { type: "invisible_wall_small", x: 24, y: 257, rotation: 0.25 },
      { type: "apple_of_the_eye", x: 43, y: 125.5, rotation: 0 },
      { type: "apple_of_the_eye", x: 61, y: 132, rotation: 0 },
      {
        type: "apple_of_the_eye",
        x: 20,
        y: 191.5,
        rotation: 0,
        custom: "eye1",
      },
      {
        type: "apple_of_the_eye",
        x: 42,
        y: 201.5,
        rotation: 0,
        custom: "eye2",
      },
      { type: "invisible_wall_small", x: 280, y: 191, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 308,
        y: 202,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 280, y: 212, rotation: 0 },
      { type: "invisible_wall_big", x: 36, y: 140, rotation: 0 },
      { type: "invisible_wall_very_small", x: 279, y: 139, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 367,
        y: 130,
        rotation: -0.10471975511965977,
      },
      {
        type: "invisible_wall_small",
        x: 446,
        y: 158,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 368,
        y: 234,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 54, y: 75, rotation: 0 },
      { type: "invisible_wall_small", x: 36, y: 70, rotation: 0 },
      { type: "invisible_wall_small", x: 37, y: 24, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 69,
        y: 17,
        rotation: -0.5235987755982988,
      },
      { type: "invisible_wall_big", x: 156, y: 8, rotation: 0 },
      { type: "invisible_wall_big", x: 307, y: 8, rotation: 0 },
      { type: "invisible_wall_small", x: 407, y: 13, rotation: 0.2 },
      {
        type: "invisible_wall_small",
        x: 132,
        y: 106,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 180,
        y: 105,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 260, y: 75, rotation: 0 },
      { type: "invisible_wall_small", x: 360, y: 75, rotation: 0 },
      { type: "invisible_wall_small", x: 390, y: 72, rotation: -0.2 },
      { type: "invisible_wall_small", x: 440, y: 65, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 188,
        y: 136,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_big",
        x: 187,
        y: 207,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_big",
        x: 187,
        y: 278,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_small",
        x: 256,
        y: 6,
        rotation: 0,
        custom: "ant_ray",
      },
      { type: "invisible_wall_small", x: 440, y: 23, rotation: 0.1 },
      {
        type: "bridge_lvl19",
        x: 183,
        y: 264.5,
        rotation: 0,
        custom: "bridge2",
      },
      {
        type: "cover_bridge2_lvl19",
        x: 46,
        y: 265,
        rotation: 0,
        custom: "cover1",
      },
      { type: "bridge_lvl19", x: 46, y: 194.5, rotation: 0, custom: "bridge1" },
      {
        type: "cover_bridge1_lvl19",
        x: 44.5,
        y: 195.5,
        rotation: 0,
        custom: "cover2",
      },
      { type: "blue_lamp2", x: 345, y: 2, rotation: 0, custom: "lamp_btn" },
      {
        type: "blue_lamp2",
        x: 96.5,
        y: 199.5,
        rotation: 0,
        custom: "lamp_bridge1",
      },
      {
        type: "blue_lamp2",
        x: 96,
        y: 270.5,
        rotation: 0,
        custom: "lamp_bridge2",
      },
      { type: "invisible_wall_small", x: 156, y: 134, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 473,
        y: 44,
        rotation: 1.5707963267948966,
      },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "Bob", x: 25, y: 217, rotation: 0 },
      {
        type: "entrance_lvl13",
        x: 452.5,
        y: 126,
        rotation: 0,
        custom: "destination",
      },
      { type: "entrance_lvl13", x: 30.5, y: 210, rotation: 0 },
      { type: "invisible_wall_big", x: 100, y: 243, rotation: 0 },
      { type: "invisible_wall_small", x: 42, y: 239, rotation: 0.2 },
      {
        type: "invisible_wall_big",
        x: 176,
        y: 320,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 417,
        y: 28,
        rotation: 1.5707963267948966,
      },
      { type: "gravity_button_up", x: 413, y: 204, rotation: 0 },
      { type: "invisible_wall_big", x: 495, y: 101, rotation: 0 },
      { type: "invisible_wall_small", x: 450, y: 112, rotation: 0 },
      { type: "invisible_wall_big", x: 422, y: 160, rotation: 0 },
      {
        type: "invisible_wall_small",
        x: 350,
        y: 197,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 349,
        y: 285,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_small",
        x: 358,
        y: 240,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 28, y: 196, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 28,
        y: 79,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_very_small",
        x: 99,
        y: 71,
        rotation: 1.5707963267948966,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_very_small",
        x: 99,
        y: 6,
        rotation: 1.5707963267948966,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_big",
        x: 178,
        y: 1,
        rotation: 0,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_big",
        x: 333,
        y: 1,
        rotation: 0,
        custom: "ray_inv",
      },
      { type: "apple_of_the_eye", x: 72, y: 185, rotation: 0 },
      { type: "apple_of_the_eye", x: 54, y: 179, rotation: 0, custom: "eye1" },
      { type: "apple_of_the_eye", x: 411, y: 106, rotation: 0 },
      { type: "apple_of_the_eye", x: 429, y: 96, rotation: 0, custom: "eye2" },
      { type: "invisible_wall_small", x: 436, y: 155, rotation: -0.2 },
      {
        type: "invisible_wall_big",
        x: 181,
        y: 173,
        rotation: 1.5707963267948966,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_small",
        x: 266,
        y: 81,
        rotation: 1.5707963267948966,
        custom: "ray_inv",
      },
      {
        type: "invisible_wall_very_small",
        x: 265,
        y: 171,
        rotation: 1.5707963267948966,
        custom: "ray_inv",
      },
      { type: "star1", x: 413, y: 253, rotation: 0 },
      { type: "star2_lvl12", x: 465, y: 67, rotation: 0 },
      { type: "alien_fly", x: 221, y: 134, rotation: 0, custom: "alien2" },
      { type: "alien_fly", x: 136, y: 135, rotation: 0, custom: "alien1" },
      { type: "door_star_lvl13", x: 413, y: 273, rotation: 0 },
      {
        type: "button_green",
        x: 161,
        y: 268,
        rotation: -1.5707963267948966,
        custom: "btn1_left",
      },
      {
        type: "button_green",
        x: 366,
        y: 268,
        rotation: 1.5707963267948966,
        custom: "btn1_right",
      },
      {
        type: "button_green",
        x: 77,
        y: 28,
        rotation: -1.5707963267948966,
        custom: "btn2_left",
      },
      {
        type: "button_green",
        x: 432,
        y: 32,
        rotation: 1.5707963267948966,
        custom: "btn2_right",
      },
      { type: "star18", x: 242, y: 11, rotation: 0 },
      { type: "cover_star1_lvl13", x: 243, y: 8, rotation: 0 },
      {
        type: "platform_lvl13",
        x: 268,
        y: 264,
        rotation: 0,
        custom: "platform1",
      },
      {
        type: "platform_lvl13",
        x: 264,
        y: 18,
        rotation: 3.141592653589793,
        custom: "platform2",
      },
    ],
    joints: [],
  },
  {
    objects: [
      { type: "invisible_wall_small", x: 40, y: 222, rotation: 0 },
      { type: "invisible_wall_small", x: 24, y: 219, rotation: 0 },
      { type: "lvl20_wheel", x: 76, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 92, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 109, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 125, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 141, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 157, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 173, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 189, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 206, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 222, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 238, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 255, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 272, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 288, y: 224, rotation: 0 },
      { type: "lvl20_wheel", x: 304, y: 224, rotation: 0 },
      { type: "invisible_wall_big", x: 389, y: 220, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 45,
        y: 91,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_big", x: 118, y: 42, rotation: 0 },
      { type: "invisible_wall_big", x: 264, y: 42, rotation: 0 },
      {
        type: "invisible_wall_big",
        x: 336,
        y: 75,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_big",
        x: 327,
        y: 75,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_small", x: 139, y: 155, rotation: 0 },
      { type: "invisible_wall_small", x: 139, y: 119, rotation: 0 },
      { type: "invisible_wall_small", x: 236, y: 119, rotation: 0 },
      { type: "invisible_wall_small", x: 236, y: 134, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 181,
        y: 111,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 196,
        y: 111,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 189,
        y: 111,
        rotation: 1.5707963267948966,
      },
      {
        type: "invisible_wall_very_small",
        x: 178,
        y: 145,
        rotation: 1.5707963267948966,
      },
      { type: "invisible_wall_very_small", x: 163, y: 156, rotation: 0 },
      { type: "invisible_wall_very_small", x: 166, y: 118, rotation: 0 },
      { type: "invisible_wall_very_small", x: 207, y: 118, rotation: 0 },
      { type: "invisible_wall_very_small", x: 195, y: 134, rotation: 0 },
      {
        type: "invisible_wall_very_small",
        x: 117,
        y: 137,
        rotation: 1.5707963267948966,
      },
      { type: "gravity_button_up", x: 369, y: 254, rotation: 0 },
      { type: "lvl20_ufo", x: 403, y: 187, rotation: 0, custom: "ship" },
      { type: "lvl20_star1", x: 186, y: 139, rotation: 0 },
      { type: "lvl20_star2", x: 427, y: 245, rotation: 0 },
      { type: "lvl20_star3", x: 380, y: 35, rotation: 0 },
      { type: "apple_of_the_eye", x: 44, y: 150, rotation: 0, custom: "eye1" },
      { type: "apple_of_the_eye", x: 66, y: 159, rotation: 0 },
      { type: "Bob", x: 24, y: 197, rotation: 0 },
      { type: "violet_lamp", x: 183, y: 254, rotation: 0, custom: "l_down" },
      { type: "violet_lamp", x: 185, y: 26, rotation: 0, custom: "l_up" },
      { type: "teeth", x: 45, y: 194, rotation: 0, custom: "mouth" },
      {
        type: "lvl20_entrance_cover",
        x: 23,
        y: 184,
        rotation: 0,
        custom: "entrance",
      },
      { type: "lvl20_star_cover", x: 188, y: 141, rotation: 0 },
      {
        type: "lvl20_gravitation_cover",
        x: 369,
        y: 252,
        rotation: 0,
        custom: "gravity_cover",
      },
      { type: "lvl20_cable", x: 371, y: -58, rotation: 0, custom: "c1" },
      { type: "lvl20_cable", x: 391, y: -58, rotation: 0, custom: "c2" },
      { type: "lvl20_cable", x: 412, y: -58, rotation: 0, custom: "c3" },
      { type: "lvl20_cable", x: 432, y: -58, rotation: 0, custom: "c4" },
      {
        type: "lvl20_panel",
        x: 400,
        y: 17,
        rotation: 0,
        custom: "cable_cover",
      },
      { type: "blue_lamp2", x: 371, y: 23, rotation: 0, custom: "l1" },
      { type: "blue_lamp2", x: 391, y: 23, rotation: 0, custom: "l2" },
      { type: "blue_lamp2", x: 412, y: 23, rotation: 0, custom: "l3" },
      { type: "blue_lamp2", x: 432, y: 23, rotation: 0, custom: "l4" },
      { type: "btn", x: 300, y: 49, rotation: 3.141592653589793, custom: "b1" },
      { type: "btn", x: 138, y: 115, rotation: 0, custom: "b4" },
      {
        type: "btn",
        x: 238,
        y: 137,
        rotation: 3.141592653589793,
        custom: "b3",
      },
      {
        type: "btn",
        x: 146,
        y: 158,
        rotation: 3.141592653589793,
        custom: "b2",
      },
      {
        type: "invisible_wall_small",
        x: 329,
        y: 185,
        rotation: 1.5707963267948966,
        custom: "stop_wall",
      },
    ],
    joints: [],
  },
];
function preloadScene(scene, callback) {
  if (ExternalAPI.type !== "Spilgames") {
    callback();
    return;
  }
  if (stage) {
    var hourglass = GU.addSprite(stage, "hourglass", 100, 150);
    hourglass.setRelativePosition();
  }
  var data = isNaN(scene)
    ? addImagesToQueue(scene)
    : addCurrentLevelImagesToQueue(scene);
  var preloader = new ImagesPreloader();
  preloader.load(data, _pushInBitmaps);
  function _pushInBitmaps(data) {
    for (var obj in data) bitmaps[obj] = data[obj];
    if (hourglass) hourglass.destroy = true;
    callback();
  }
}
function addImagesToQueue(scene, arr) {
  arr = arr || [];
  var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
  var imgArr = loadData[scene];
  for (i = 0; i < imgArr.length; i++) {
    var im = imgArr[i];
    arr.push({ name: im[0], src: path + im[1] });
  }
  return arr;
}
function addCurrentLevelImagesToQueue(num) {
  var arr = [];
  var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
  for (var i = 0; i < objects.length; i++) {
    var str = objects[i].image;
    if (str.indexOf("levels/") !== -1 && parseInt(str.substring(7, 9)) === num)
      arr.push({ name: objects[i].name, src: path + objects[i].image });
  }
  var imgArr = loadData.levelImages;
  for (i = 0; i < imgArr.length; i++) {
    var im = imgArr[i];
    if (parseInt(im[1].substring(7, 9)) === num)
      arr.push({ name: im[0], src: path + im[1] });
  }
  arr.push({
    name: "Lvl" + num + "_back",
    src:
      path +
      "levels/" +
      (num < 10 ? "0" + num : num) +
      "/Lvl" +
      num +
      "_back.jpg",
  });
  return arr;
}
function addGeneralObjectsToQueue(arr) {
  var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
  for (var i = 0; i < objects.length; i++) {
    var str = objects[i].image;
    if (str.indexOf("levels/") === -1)
      arr.push({ name: objects[i].name, src: path + objects[i].image });
  }
}
function addLevelObjectsToQueue(arr) {
  arr = arr || [];
  var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
  for (var i = 0; i < objects.length; i++)
    arr.push({ name: objects[i].name, src: path + objects[i].image });
}
function addGeneralImagesToQueue(arr) {
  arr = arr || [];
  var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
  var imgArr = loadData.generalImages;
  for (i = 0; i < imgArr.length; i++) {
    var im = imgArr[i];
    arr.push({ name: im[0], src: path + im[1] });
  }
  return arr;
}
function addLevelImagesToQueue(arr) {
  arr = arr || [];
  var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
  var imgArr = loadData.levelImages;
  for (i = 0; i < imgArr.length; i++) {
    var im = imgArr[i];
    arr.push({ name: im[0], src: path + im[1] });
  }
  return arr;
}
function addBackgroundsToQueue(arr) {
  arr = arr || [];
  var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
  for (var i = 1; i <= levels.length; i++)
    arr.push({
      name: "Lvl" + i + "_back",
      src: path + "levels/" + (i < 10 ? "0" + i : i) + "/Lvl" + i + "_back.jpg",
    });
  return arr;
}
var loadData = {};
loadData.generalImages = [
  ["gravity_button_down", "general/gravity_button_down.png"],
  ["portal_lamp", "general/portal_lamp.png"],
  ["arrow_white", "general/arrow_white.png"],
  ["arrow_yellow", "general/arrow_yellow.png"],
  ["GameOver", "general/GameOver.png"],
  ["levelCompleteNum", "general/levelCompleteNum.png"],
  ["LevelCompleteBobs", "general/LevelCompleteBobs.png"],
  ["tap", "general/tap.png"],
  ["hint", "general/hint.png"],
  ["electr_field", "general/electr_field.png"],
  ["electr_lines", "general/electr_lines.png"],
  ["buble_explosion", "general/buble_explosion.png"],
  ["hourglass", "general/hourglass.png"],
  ["Splash_Image", "general/Splash_Image.png"],
  ["SpilLogo", "general/SpilLogo.png"],
  ["alien_blinks", "general/alien/alien_blinks.png"],
  ["alien_attacks", "general/alien/alien_attacks.png"],
  ["alien_fly_attack", "general/alien/alien_fly_attack.png"],
  ["more_games_menu", "menu/more_games_menu.png"],
  ["back_menu", "menu/back_menu.jpg"],
  ["bob1_menu", "menu/bob1_menu.png"],
  ["bob2_menu", "menu/bob2_menu.png"],
  ["bob3_menu", "menu/bob3_menu.png"],
  ["credits_menu", "menu/credits_menu.png"],
  ["galery_menu", "menu/galery_menu.png"],
  ["intro_menu", "menu/intro_menu.png"],
  ["light_menu", "menu/light_menu.png"],
  ["panel_sound_menu", "menu/panel_sound_menu.png"],
  ["planet_menu", "menu/planet_menu.png"],
  ["play_menu", "menu/play_menu.png"],
  ["rocket_menu", "menu/rocket_menu.png"],
  ["title_menu", "menu/title_menu.png"],
  ["ufo_menu", "menu/ufo_menu.png"],
  ["alien_menu", "general/alien/alien_fly.png"],
  ["bob_menu", "levelMap/bob_lvlMap.png"],
  ["lvl_numbs", "UI/lvl_numbs.png"],
  ["bottom_ui_back", "UI/bottom_ui_back.png"],
  ["Lvl", "UI/Lvl.png"],
  ["indicator", "UI/indicator.png"],
  ["levelMap_ingame", "UI/levelMap_ingame.png"],
  ["restart_ingame", "UI/restart_ingame.png"],
  ["sound_UI", "UI/sound_UI.png"],
  ["BobGo", "Bob/BobGo.png"],
  ["BobRun", "Bob/BobRun.png"],
  ["fly", "Bob/fly.png"],
  ["inTrap", "Bob/bobtrapmovie2.png"],
  ["BobTurns", "Bob/BobTurns.png"],
  ["BobHideTurn", "Bob/BobHideTurn.png"],
  ["BobHide", "Bob/BobHide.png"],
  ["BobGrowl", "Bob/BobGrowl.png"],
  ["BobFall", "Bob/BobFall.png"],
  ["shocked", "Bob/electroshock1.png"],
  ["shocked2", "Bob/electroshock2.png"],
  ["bob_spirit", "Bob/bob_spirit.png"],
  ["bob_roket", "Bob/bob_roket.png"],
  ["bob_ray_killed", "Bob/bob_ray_killed.png"],
  ["bob_final_state", "Bob/bob_final_state.png"],
  ["star_anim", "stars/star_anim.png"],
  ["star_trail", "stars/star_trail.png"],
  ["star_finish", "stars/star_finish.png"],
];
loadData.levelImages = [
  ["tips1_lvl1", "levels/01/tips1_lvl1.png"],
  ["tips2_lvl1", "levels/01/tips2_lvl1.png"],
  ["tips3_lvl1", "levels/01/tips3_lvl1.png"],
  ["tips1_lvl2", "levels/02/tips1_lvl2.png"],
  ["tips2_lvl2", "levels/02/tips2_lvl2.png"],
  ["tips3_lvl2", "levels/02/tips3_lvl2.png"],
  ["tips4_lvl2", "levels/02/tips4_lvl2.png"],
  ["tips5_lvl2", "levels/02/tips5_lvl2.png"],
  ["tips6_lvl2", "levels/02/tips6_lvl2.png"],
  ["tips_lvl3", "levels/03/tips_lvl3.png"],
  ["battery_cover", "levels/05/battery_cover.png"],
  ["cover_rocket", "levels/05/cover_rocket.png"],
  ["porthole", "levels/05/porthole.png"],
  ["rocket_explosion", "levels/05/rocket_explosion.png"],
  ["rocket_lvl5", "levels/05/rocket_lvl5.png"],
  ["cover_gravity_button_lvl5", "levels/05/cover_gravity_button_lvl5.png"],
  ["tentacles1_lvl7", "levels/06/tentacles1_lvl7.png"],
  ["tentacles2_lvl7", "levels/06/tentacles2_lvl7.png"],
  ["alien_snail_on_ray", "levels/09/alien_snail_on_ray.png"],
  ["lvl18_box_question", "levels/17/lvl18_box_question.png"],
  ["lvl18_magnet", "levels/17/lvl18_magnet.png"],
  ["ant_killed", "levels/18/ant_killed.png"],
  ["lvl20_arrow", "levels/20/lvl20_arrow.png"],
  ["lvl20_shocker", "levels/20/lvl20_shocker.png"],
  ["lvl20_smoke_effect", "levels/20/lvl20_smoke_effect.png"],
  ["lvl20_ufo_cover", "levels/20/lvl20_ufo_cover.png"],
  ["lvl20_ufo_effect", "levels/20/lvl20_ufo_effect.png"],
  ["lvl20_ufo_lamp", "levels/20/lvl20_ufo_lamp.png"],
];
loadData.victory = [
  ["bob_victory", "victory/bob_victory.png"],
  ["component1_victory", "victory/component1_victory.png"],
  ["component2_victory", "victory/component2_victory.png"],
  ["component3_victory", "victory/component3_victory.png"],
  ["component4_victory", "victory/component4_victory.png"],
  ["component5_victory", "victory/component5_victory.png"],
  ["galery_images_victory", "victory/galery_images_victory.png"],
  ["gallery_victory", "victory/gallery_victory.png"],
  ["levels_map_victory", "victory/levels_map_victory.png"],
  ["next_victory", "victory/next_victory.png"],
  ["noise_victory", "victory/noise_victory.png"],
  ["num_victory", "victory/num_victory.png"],
  ["restart_victory", "victory/restart_victory.png"],
  ["shadow_victory", "victory/shadow_victory.png"],
  ["star_victory", "victory/star_victory.png"],
];
loadData.gameOver = [
  ["bob_game_over", "game_over/bob_game_over.png"],
  ["component1_game_over", "game_over/component1_game_over.png"],
  ["component2_game_over", "game_over/component2_game_over.png"],
  ["component3_game_over", "game_over/component3_game_over.png"],
  ["component4_game_over", "game_over/component4_game_over.png"],
  ["text_game_over", "game_over/text_game_over.png"],
  ["try_again_game_over", "game_over/try_again_game_over.png"],
];
loadData.levelMap = [
  ["LevelsMap", "levelMap/LevelsMap.jpg"],
  ["lvlImage_lvlMap", "levelMap/lvlImage_lvlMap.png"],
  ["menu_lvlMap", "levelMap/menu_lvlMap.png"],
  ["num1_lvlMap", "levelMap/num1_lvlMap.png"],
  ["num2_lvlMap", "levelMap/num2_lvlMap.png"],
  ["star_lvlMap", "levelMap/star_lvlMap.png"],
  ["gallery_lvlMap", "levelMap/gallery_lvlMap.png"],
  ["gallery_cover_lvlMap", "levelMap/gallery_cover_lvlMap.png"],
  ["back_btn_cober_lvlMap", "levelMap/back_btn_cober_lvlMap.png"],
  ["bob_lvlMap", "levelMap/bob_lvlMap.png"],
  ["eye_lvlMap", "levelMap/eye_lvlMap.png"],
  ["monster_lvlMap", "levelMap/monster_lvlMap.png"],
  ["noise_lvlMap", "levelMap/noise_lvlMap.png"],
  ["noise2_lvlMap", "levelMap/noise2_lvlMap.png"],
  ["panel1_lvlMap", "levelMap/panel1_lvlMap.png"],
  ["panel2_lvlMap", "levelMap/panel2_lvlMap.png"],
];
loadData.credits = [
  ["ahura_credits", "credits/ahura_credits.png"],
  ["close_credits", "credits/close_credits.png"],
  ["facebook_credits", "credits/facebook_credits.png"],
  ["hamster_credits", "credits/hamster_credits.png"],
  ["ivanov_credits", "credits/ivanov_credits.png"],
  ["kovalishin_credits", "credits/kovalishin_credits.png"],
  ["part1_credits", "credits/part1_credits.png"],
  ["part2_credits", "credits/part2_credits.png"],
  ["part3_credits", "credits/part3_credits.png"],
  ["part4_credits", "credits/part4_credits.png"],
  ["yurchenko_credits", "credits/yurchenko_credits.png"],
];
loadData.comics = [
  ["comics1", "comics/comics1.png"],
  ["comics2", "comics/comics2.png"],
  ["comics3", "comics/comics3.png"],
  ["comics4", "comics/comics4.png"],
  ["comics5", "comics/comics5.png"],
  ["comics6", "comics/comics6.png"],
  ["frame_comics", "comics/frame_comics.png"],
  ["skip_comics", "comics/skip_comics.png"],
];
loadData.gallery = [
  ["arrow_gallery", "gallery/arrow_gallery.png"],
  ["back_gallery", "gallery/back_gallery.png"],
  ["box1_gallery", "gallery/box1_gallery.png"],
  ["box2_gallery", "gallery/box2_gallery.png"],
  ["navigator_gallery", "gallery/navigator_gallery.png"],
  ["effect_gallery", "gallery/effect_gallery.png"],
  ["new_gallery", "gallery/new_gallery.png"],
  ["num1_gallery", "gallery/num1_gallery.png"],
  ["num2_gallery", "gallery/num2_gallery.png"],
  ["panel_gallery", "gallery/panel_gallery.png"],
  ["pick_lock_gallery", "gallery/pick_lock_gallery.png"],
  ["pic1_gallery", "gallery/pic1_gallery.png"],
  ["pic2_gallery", "gallery/pic2_gallery.png"],
  ["pic3_gallery", "gallery/pic3_gallery.png"],
  ["pic4_gallery", "gallery/pic4_gallery.png"],
  ["pic5_gallery", "gallery/pic5_gallery.png"],
  ["pic6_gallery", "gallery/pic6_gallery.png"],
  ["pic7_gallery", "gallery/pic7_gallery.png"],
  ["pic8_gallery", "gallery/pic8_gallery.png"],
  ["pic9_gallery", "gallery/pic9_gallery.png"],
  ["pic10_gallery", "gallery/pic10_gallery.png"],
  ["pic11_gallery", "gallery/pic11_gallery.png"],
  ["pic12_gallery", "gallery/pic12_gallery.png"],
  ["pic13_gallery", "gallery/pic13_gallery.png"],
  ["pic14_gallery", "gallery/pic14_gallery.png"],
  ["pic15_gallery", "gallery/pic15_gallery.png"],
  ["pic16_gallery", "gallery/pic16_gallery.png"],
  ["pic17_gallery", "gallery/pic17_gallery.png"],
  ["pic18_gallery", "gallery/pic18_gallery.png"],
  ["pic19_gallery", "gallery/pic19_gallery.png"],
  ["pic20_gallery", "gallery/pic20_gallery.png"],
];
loadData.finalScene = [
  ["bob_in_ufo", "final_scene1/bob_in_ufo.png"],
  ["final_scene1", "final_scene1/final_scene1.jpg"],
  ["planet", "final_scene1/planet.png"],
  ["planet_earth", "final_scene1/planet_earth.png"],
  ["planet_shine", "final_scene1/planet_shine.png"],
  ["effect_smoke", "final_scene1/effect_smoke.png"],
  ["bob_final_eyes", "final_scene2/bob_final_eyes.png"],
  ["final_complete_txt", "final_scene2/final_complete_txt.png"],
  ["final_frame", "final_scene2/final_frame.png"],
  ["final_grandpa1", "final_scene2/final_grandpa1.png"],
  ["final_grandpa2", "final_scene2/final_grandpa2.png"],
  ["final_hen_1", "final_scene2/final_hen_1.png"],
  ["final_hen_2", "final_scene2/final_hen_2.png"],
  ["final_hen_3", "final_scene2/final_hen_3.png"],
  ["final_house", "final_scene2/final_house.png"],
  ["final_level_score", "final_scene2/final_level_score.png"],
  ["final_num_score", "final_scene2/final_num_score.png"],
  ["final_pipe", "final_scene2/final_pipe.png"],
  ["final_roof_1", "final_scene2/final_roof_1.png"],
  ["final_roof_2", "final_scene2/final_roof_2.png"],
  ["final_scene2", "final_scene2/final_scene2.jpg"],
  ["final_smoke", "final_scene2/final_smoke.png"],
  ["final_stars", "final_scene2/final_stars.png"],
  ["final_txt2", "final_scene2/final_txt2.png"],
  ["horseshoe", "final_scene2/horseshoe.png"],
  ["ufo_final_anim", "final_scene2/ufo_final_anim.png"],
  ["but_bob1", "final_scene2/but_bob1.png"],
  ["but_bob2", "final_scene2/but_bob2.png"],
  ["but_bob3", "final_scene2/but_bob3.png"],
  ["but_menu_final", "final_scene2/but_menu_final.png"],
];
loadData.sounds = ["bob_new_space"];
var ObjectManager = {
  create: function (lo, ob, parent) {
    var spr = this.getSprite(ob);
    this.setSprite(spr, lo, ob, parent);
    this.createBody(lo, ob, spr);
    handlers.applyObjectHandlers(spr);
    return spr;
  },
  getSprite: function (ob) {
    var spr;
    if (ob.name == "Bob") bob = spr = new SnailBob();
    else if (ob.columns)
      spr = new TilesSprite(
        bitmaps[ob.name],
        ob.width,
        ob.height,
        ob.frames,
        ob.rows,
        ob.columns
      );
    else spr = new Sprite(bitmaps[ob.name], ob.width, ob.height, ob.frames);
    return spr;
  },
  setSprite: function (spr, lo, ob, parent) {
    spr.setPosition(lo.x, lo.y);
    spr.rotation = lo.rotation || 0;
    spr.setZIndex(10);
    (parent || stage).addChild(spr);
    spr.info = ob.info;
    spr.custom = lo.custom;
    spr.obType = ob.type;
    return spr;
  },
  createBody: function (lo, ob, spr) {
    if (ob.bodyType == NONE) return;
    var params = this.getBodyParameters(lo, ob);
    this.applyBodyPosCorrection(ob, params, spr);
    var body;
    switch (ob.bodyType) {
      case BOX:
        body = this.createBox(params, lo);
        break;
      case CIRCLE:
        body = this.createCircle(params, lo);
        break;
      case POLY:
        body = this.createPoly(params, lo, ob);
        break;
    }
    body.sprite = spr;
    spr.box2dBody = body;
    return body;
  },
  getBodyParameters: function (lo, ob) {
    var parameters = {
      fixed: typeof lo.fixed != "undefined" ? lo.fixed : ob.fixed,
      density: typeof lo.density != "undefined" ? lo.density : ob.density,
      restitution:
        typeof lo.restitution != "undefined" ? lo.restitution : ob.restitution,
      friction: typeof lo.friction != "undefined" ? lo.friction : ob.friction,
      width: ob.bodyWidth ? ob.bodyWidth : ob.width,
      height: ob.bodyHeight ? ob.bodyHeight : ob.height,
      x: lo.x,
      y: lo.y,
    };
    if (parameters.density <= 0) parameters.fixed = true;
    return parameters;
  },
  applyBodyPosCorrection: function (ob, params, spr) {
    if (!ob.bodyPosCorrect) return;
    params.x += ob.bodyPosCorrect.x;
    params.y += ob.bodyPosCorrect.y;
    spr.syncX = ob.bodyPosCorrect.x;
    spr.syncY = ob.bodyPosCorrect.y;
    spr.onbox2dsync = spritesSync;
  },
  createBox: function (params, lo) {
    return box2d.createBox(world, {
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
      rotation: lo.rotation,
      bodyType: params.fixed ? box2d.bodyType.static : box2d.bodyType.dynamic,
      density: params.density,
      restitution: params.restitution,
      friction: params.friction,
    });
  },
  createCircle: function (params, lo) {
    return box2d.createCircle(world, {
      x: params.x,
      y: params.y,
      radius: params.width / 2,
      rotation: lo.rotation,
      bodyType: params.fixed ? box2d.bodyType.static : box2d.bodyType.dynamic,
      density: params.density,
      restitution: params.restitution,
      friction: params.friction,
    });
  },
  createPoly: function (params, lo, ob) {
    return box2d.createPoly(world, {
      x: params.x,
      y: params.y,
      points: ob.points,
      rotation: lo.rotation,
      bodyType: params.fixed ? box2d.bodyType.static : box2d.bodyType.dynamic,
      density: params.density,
      restitution: params.restitution,
      friction: params.friction,
    });
  },
};
var LevelManager = {
  start: function (levelNum, data) {
    var levelSetting = !data ? levels[levelNum - 1] : data;
    currentLevel = levelNum;
    this.prepareStage();
    this.createBox2dWorld();
    this.createParentSprite();
    this.createObjects(levelSetting);
    this.createJoints(levelSetting);
    this.prepareGameConditions();
    this.runLevelScript();
    this.startStage();
  },
  prepareStage: function () {
    clearGlobalScope();
    createStage();
  },
  createBox2dWorld: function () {
    world = box2d.createWorld();
    box2d.setDebugDraw(world, document.getElementById(Utils.DOMScreenId));
  },
  prepareGameConditions: function () {
    switchState(STATE_GAME);
    field = new GameField();
    field.init();
    if (bob) bob.init();
  },
  runLevelScript: function () {
    level =
      GET.debug != 1
        ? new levelsScripts["Level" + currentLevel]()
        : new levelsScripts["Level" + editorLevel]();
    level.init();
    if (level.pretick)
      stage.addEventListener("pretick", Utils.proxy(level.pretick, level));
    if (level.posttick)
      stage.addEventListener("posttick", Utils.proxy(level.posttick, level));
  },
  startStage: function () {
    stage.addEventListener("pretick", preTick);
    stage.addEventListener("posttick", postTick);
    stage.start();
    stage.refreshBackground();
  },
  createParentSprite: function () {
    stageSpr = GU.addSprite(stage, null, 1, 1, X_OFFSET, 0);
    stageSpr.setZIndex(2);
  },
  createObjects: function (setting) {
    var levelObjs = setting.objects;
    for (var i = 0; i < levelObjs.length; i++) {
      var lo = levelObjs[i];
      var ob = findObject(lo.type);
      createObject(lo, ob, stageSpr);
    }
    return true;
  },
  createJoints: function (setting) {
    var levelJoints = setting.joints;
    if (levelJoints) {
      var j, joint, stack, body1, body2;
      for (var i = 0; i < levelJoints.length; i++) {
        joint = levelJoints[i];
        body1 = getBodyByPoint(joint.point1);
        body2 = getBodyByPoint(
          joint.point2 ? joint.point2 : joint.point1,
          body1
        );
        if (joint.type === 0) {
          var options = { body1: body1, body2: body2, point: joint.point1 };
          if (typeof joint.custom != "undefined") {
            options.enableMotor = true;
            options.motorSpeed = joint.custom;
            options.maxMotorTorque = NaN;
          }
          j = box2d.createRevoluteJoint(world, options);
        }
        if (joint.type == 1)
          j = box2d.createDistanceJoint(world, {
            body1: body1,
            body2: body2,
            point1: joint.point1,
            point2: joint.point2,
          });
      }
    }
  },
};
var NONE = 0;
var BOX = 1;
var CIRCLE = 2;
var POLY = 3;
function spritesSync(e, x, y) {
  var p = new Vector(-e.target.syncX, -e.target.syncY);
  p.rotate(-e.target.rotation);
  e.target.x += p.x;
  e.target.y += p.y;
}
var platform_density = 0;
var platform_restitution = 0.01;
var platform_friction = 0.5;
var objects = [
  {
    name: "Bob",
    image: "Bob/Bob.png",
    width: 48,
    height: 39,
    bodyWidth: 35,
    bodyHeight: 39,
    frames: 1,
    bodyType: CIRCLE,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: false,
    info: "bob",
    density: 1,
    restitution: 0.4,
    friction: 1,
  },
  {
    name: "invisible_wall_very_small",
    image: "general/invisible_wall_very_small.png",
    width: 26,
    height: 4,
    bodyType: BOX,
    info: "invisible",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "invisible_wall_small",
    image: "general/invisible_wall_small.png",
    width: 50,
    height: 5,
    bodyType: BOX,
    info: "invisible",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "invisible_wall_big",
    image: "general/invisible_wall_big.png",
    width: 150,
    height: 5,
    bodyType: BOX,
    info: "invisible",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "gravity_button_up",
    image: "general/gravity_button_up.png",
    width: 46,
    height: 46,
    frames: 19,
    bodyType: NONE,
    info: "gravity_button",
  },
  {
    name: "spring",
    image: "general/spring.png",
    width: 50,
    height: 48,
    bodyWidth: 24,
    bodyHeight: 42,
    bodyPosCorrect: { x: 13, y: 0 },
    frames: 12,
    bodyType: BOX,
    info: "spring",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "baraban",
    image: "general/Baraban.png",
    type: BOX,
    width: 70,
    height: 26,
    bodyWidth: 70,
    bodyHeight: 21,
    frames: 28,
    bodyType: BOX,
    info: "baraban",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "bubble_cover",
    image: "general/bubble_cover.png",
    width: 36,
    height: 34,
    frames: 1,
    bodyType: NONE,
    info: "bubble_cover",
  },
  {
    name: "alien_kid",
    image: "general/alien_kid.png",
    width: 26,
    height: 26,
    frames: 22,
    bodyType: NONE,
    info: "alien_kid",
  },
  {
    name: "electr_btn",
    image: "general/electr_btn.png",
    width: 30,
    height: 30,
    frames: 2,
    bodyType: NONE,
    info: "electr_btn",
  },
  {
    name: "green_door",
    image: "general/green_door.png",
    width: 34,
    height: 50,
    frames: 1,
    bodyType: NONE,
    info: "green_door",
  },
  {
    name: "slide_doors",
    image: "general/slide_doors.png",
    width: 34,
    height: 34,
    frames: 9,
    bodyType: NONE,
    info: "slide_doors",
  },
  {
    name: "apple_of_the_eye",
    image: "general/apple_of_the_eye.png",
    width: 6,
    height: 6,
    bodyType: NONE,
    info: "apple_of_the_eye",
  },
  {
    name: "portal",
    image: "general/portal.png",
    width: 72,
    height: 66,
    frames: 15,
    rows: 7,
    columns: 3,
    bodyType: NONE,
    info: "portal",
  },
  {
    name: "teeth",
    image: "general/teeth.png",
    width: 12,
    height: 48,
    frames: 13,
    bodyType: NONE,
    info: "teeth",
  },
  {
    name: "btn2",
    image: "general/btn.png",
    width: 30,
    height: 12,
    bodyHeight: 5,
    frames: 6,
    bodyType: BOX,
    bodyPosCorrect: { x: 0, y: 3 },
    density: platform_density,
    restitution: 0.2,
    friction: 0.01,
    info: "btn2",
  },
  {
    name: "btn",
    image: "general/btn.png",
    width: 30,
    height: 12,
    frames: 6,
    bodyType: NONE,
    info: "btn",
  },
  {
    name: "btn_mini",
    image: "general/btn_mini.png",
    width: 22,
    height: 12,
    frames: 5,
    bodyType: NONE,
    info: "btn",
  },
  {
    name: "button_red",
    image: "general/button_red.png",
    width: 30,
    height: 30,
    frames: 3,
    bodyType: NONE,
    info: "button",
  },
  {
    name: "button_green2",
    image: "general/button_green2.png",
    width: 32,
    height: 32,
    frames: 3,
    bodyType: NONE,
    info: "button",
  },
  {
    name: "button_green",
    image: "general/button_green.png",
    width: 24,
    height: 24,
    frames: 2,
    bodyType: NONE,
    info: "button",
  },
  {
    name: "blue_lamp",
    image: "general/blue_lamp.png",
    width: 18,
    height: 18,
    frames: 2,
    bodyType: NONE,
    info: "lamp",
  },
  {
    name: "blue_lamp2",
    image: "general/blue_lamp2.png",
    width: 40,
    height: 40,
    frames: 2,
    bodyType: NONE,
    info: "lamp",
  },
  {
    name: "green_lamp",
    image: "general/green_lamp.png",
    width: 18,
    height: 18,
    frames: 2,
    bodyType: NONE,
    info: "lamp",
  },
  {
    name: "violet_lamp",
    image: "general/violet_lamp.png",
    width: 40,
    height: 40,
    frames: 2,
    bodyType: NONE,
    info: "lamp",
  },
  {
    name: "shock_door",
    image: "general/shock_door.png",
    width: 24,
    height: 92,
    frames: 4,
    bodyType: BOX,
    bodyWidth: 20,
    bodyHeight: 88,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "shock_door",
  },
  {
    name: "star1",
    image: "stars/star1.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star2",
    image: "stars/star2.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star3",
    image: "stars/star3.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star4",
    image: "stars/star4.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star5",
    image: "stars/star5.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star6",
    image: "stars/star6.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star7",
    image: "stars/star7.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star8",
    image: "stars/star8.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star9",
    image: "stars/star9.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star10",
    image: "stars/star10.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star11",
    image: "stars/star11.png",
    width: 28,
    height: 27,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star1_lvl8",
    image: "stars/star1_lvl8.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star2_lvl8",
    image: "stars/star2_lvl8.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star3_lvl8",
    image: "stars/star3_lvl8.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star1_lvl10",
    image: "stars/star1_lvl10.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star2_lvl10",
    image: "stars/star2_lvl10.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star3_lvl10",
    image: "stars/star3_lvl10.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star1_lvl12",
    image: "stars/star1_lvl12.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star2_lvl12",
    image: "stars/star2_lvl12.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star3_lvl12",
    image: "stars/star3_lvl12.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star1_lvl14",
    image: "stars/star1_lvl14.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star2_lvl14",
    image: "stars/star2_lvl14.png",
    width: 28,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star3_lvl14",
    image: "stars/star3_lvl14.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star1_lvl16",
    image: "stars/star1_lvl16.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star2_lvl16",
    image: "stars/star2_lvl16.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star3_lvl16",
    image: "stars/star3_lvl16.png",
    width: 30,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star12",
    image: "stars/star12.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star13",
    image: "stars/star13.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star14",
    image: "stars/star14.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star15",
    image: "stars/star15.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star16",
    image: "stars/star16.png",
    width: 28,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star17",
    image: "stars/star17.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star18",
    image: "stars/star18.png",
    width: 30,
    height: 28,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star1_lvl15",
    image: "stars/star1_lvl15.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star2_lvl15",
    image: "stars/star2_lvl15.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star3_lvl15",
    image: "stars/star3_lvl15.png",
    width: 22,
    height: 22,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star_lvl17",
    image: "stars/star_lvl17.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star_lvl18",
    image: "stars/star_lvl18.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star_lvl19",
    image: "stars/star_lvl19.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "star2_lvl19",
    image: "stars/star2_lvl19.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "lvl20_star1",
    image: "stars/lvl20_star1.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "lvl20_star2",
    image: "stars/lvl20_star2.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "lvl20_star3",
    image: "stars/lvl20_star3.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "star",
  },
  {
    name: "control_center",
    image: "general/control_center.png",
    width: 80,
    height: 72,
    bodyType: POLY,
    points: [
      [
        [-30, -30],
        [30, -30],
        [30, -25],
        [-30, -25],
      ],
      [
        [-30, 25],
        [30, 25],
        [30, 30],
        [-30, 30],
      ],
    ],
    info: "control_center",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "grandpa",
    image: "general/grandpa.png",
    width: 56,
    height: 52,
    bodyWidth: 40,
    bodyHeight: 40,
    bodyPosCorrect: { x: 0, y: -3 },
    frames: 2,
    bodyType: BOX,
    density: 1,
    restitution: 0.1,
    friction: 1,
    info: "grandpa",
  },
  {
    name: "alien",
    image: "general/alien/alien.png",
    width: 48,
    height: 46,
    bodyWidth: 40,
    frames: 26,
    rows: 13,
    columns: 2,
    bodyType: CIRCLE,
    density: 0.8,
    restitution: 0.1,
    friction: 1,
    info: "alien",
  },
  {
    name: "alien_snail",
    image: "general/alien_snail.png",
    width: 56,
    height: 42,
    bodyWidth: 35,
    frames: 22,
    rows: 11,
    columns: 2,
    bodyType: CIRCLE,
    density: 1,
    restitution: 0.4,
    friction: 1,
    info: "alien_snail",
  },
  {
    name: "alien_fly",
    image: "general/alien/alien_fly.png",
    width: 76,
    height: 72,
    frames: 50,
    rows: 13,
    columns: 4,
    bodyType: NONE,
    info: "alien_fly",
  },
  {
    name: "bridge_lvl1",
    image: "levels/01/bridge_lvl1.png",
    width: 20,
    height: 166,
    bodyHeight: 80,
    bodyPosCorrect: { x: 0, y: 42 },
    bodyType: BOX,
    info: "bridge",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "cogwheel_lvl1",
    image: "levels/01/cogwheel_lvl1.png",
    width: 30,
    height: 30,
    bodyType: NONE,
    info: "cogwheel_lvl1",
  },
  {
    name: "door_lvl1",
    image: "levels/01/door_lvl1.png",
    width: 86,
    height: 84,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover_star_lvl1",
    image: "levels/01/cover_star_lvl1.png",
    width: 24,
    height: 36,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover1_lvl1",
    image: "levels/01/cover1_lvl1.png",
    width: 92,
    height: 168,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover2_lvl1",
    image: "levels/01/cover2_lvl1.png",
    width: 88,
    height: 62,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover3_lvl1",
    image: "levels/01/cover3_lvl1.png",
    width: 98,
    height: 62,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_entrance_lvl2",
    image: "levels/02/cover_entrance_lvl2.png",
    width: 92,
    height: 62,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_exit_lvl2",
    image: "levels/02/cover_exit_lvl2.png",
    width: 86,
    height: 62,
    frames: 1,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover1_lvl2",
    image: "levels/02/cover1_lvl2.png",
    width: 28,
    height: 100,
    frames: 1,
    bodyType: NONE,
    info: "cover1",
  },
  {
    name: "cover2_lvl2",
    image: "levels/02/cover2_lvl2.png",
    width: 32,
    height: 88,
    frames: 1,
    bodyType: NONE,
    info: "cover2",
  },
  {
    name: "star_cover_lvl2",
    image: "levels/02/star_cover_lvl2.png",
    width: 52,
    height: 48,
    frames: 1,
    bodyType: NONE,
    info: "star_cover",
  },
  {
    name: "bridge_lvl3",
    image: "levels/03/bridge_lvl3.png",
    width: 20,
    height: 88,
    bodyType: BOX,
    info: "bridge",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "cover_bridge_lvl3",
    image: "levels/03/cover_bridge_lvl3.png",
    width: 22,
    height: 92,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover_entrance_lvl3",
    image: "levels/03/cover_entrance_lvl3.png",
    width: 86,
    height: 62,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_exit_lvl3",
    image: "levels/03/cover_exit_lvl3.png",
    width: 88,
    height: 62,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover1_lvl3",
    image: "levels/03/cover1_lvl3.png",
    width: 38,
    height: 30,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover2_lvl3",
    image: "levels/03/cover2_lvl3.png",
    width: 26,
    height: 26,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover3_lvl3",
    image: "levels/03/cover3_lvl3.png",
    width: 30,
    height: 34,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover_in_lvl4",
    image: "levels/04/cover_in_lvl4.png",
    width: 104,
    height: 62,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "crane_1",
    image: "levels/04/crane_1.png",
    width: 44,
    height: 122,
    frames: 1,
    bodyType: BOX,
    bodyWidth: 4,
    bodyHeight: 100,
    bodyPosCorrect: { x: -16, y: -3 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "crane_1",
  },
  {
    name: "door_lvl4",
    image: "levels/04/door_lvl4.png",
    width: 56,
    height: 50,
    frames: 1,
    bodyType: NONE,
    info: "door_lvl4",
  },
  {
    name: "flash1_lvl4",
    image: "levels/04/flash1_lvl4.png",
    width: 258,
    height: 16,
    frames: 4,
    bodyType: NONE,
    info: "flash1_lvl4",
  },
  {
    name: "flash2_lvl4",
    image: "levels/04/flash2_lvl4.png",
    width: 184,
    height: 46,
    frames: 4,
    bodyType: NONE,
    info: "flash2_lvl4",
  },
  {
    name: "lift_lvl4",
    image: "levels/04/lift_lvl4.png",
    width: 62,
    height: 226,
    frames: 1,
    bodyType: BOX,
    bodyWidth: 60,
    bodyHeight: 222,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "lift_lvl4",
  },
  {
    name: "rocket",
    image: "levels/04/rocket.png",
    width: 72,
    height: 138,
    frames: 1,
    bodyType: NONE,
    info: "rocket",
  },
  {
    name: "star_cover_lvl4",
    image: "levels/04/star_cover_lvl4.png",
    width: 32,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star_cover_lvl4",
  },
  {
    name: "battery_l",
    image: "levels/05/battery_l.png",
    width: 46,
    height: 40,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "battery_r",
    image: "levels/05/battery_r.png",
    width: 46,
    height: 40,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "bridge_lvl5",
    image: "levels/05/bridge_lvl5.png",
    width: 66,
    height: 26,
    bodyHeight: 18,
    frames: 20,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "cover_exit_lvl5",
    image: "levels/05/cover_exit_lvl5.png",
    width: 72,
    height: 60,
    bodyType: NONE,
    info: "cover_exit_lvl5",
  },
  {
    name: "cover_star_lvl5",
    image: "levels/05/cover_star_lvl5.png",
    width: 56,
    height: 26,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "leaflet_lvl5",
    image: "levels/05/leaflet_lvl5.png",
    width: 30,
    height: 34,
    bodyType: NONE,
    info: "leaflet_lvl5",
  },
  {
    name: "welcome_monster",
    image: "levels/05/welcome_monster.png",
    width: 64,
    height: 72,
    frames: 50,
    rows: 13,
    columns: 4,
    bodyType: NONE,
    info: "welcome_monster",
  },
  {
    name: "porthole",
    image: "levels/05/porthole.png",
    width: 40,
    height: 40,
    frames: 2,
    bodyType: CIRCLE,
    info: "porthole",
    density: 1,
    restitution: 0.2,
    friction: 0.1,
  },
  {
    name: "bridge_lvl7",
    image: "levels/06/bridge_lvl7.png",
    width: 80,
    height: 28,
    bodyHeight: 19,
    frames: 15,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "cover_entrance_lvl7",
    image: "levels/06/cover_entrance_lvl7.png",
    width: 44,
    height: 16,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_exit_lvl7",
    image: "levels/06/cover_exit_lvl7.png",
    width: 42,
    height: 60,
    bodyType: NONE,
    info: "cover_exit_lvl7",
  },
  {
    name: "cover1_lvl7",
    image: "levels/06/cover1_lvl7.png",
    width: 24,
    height: 28,
    bodyType: NONE,
    info: "cover1_lvl7",
  },
  {
    name: "cover2_lvl7",
    image: "levels/06/cover2_lvl7.png",
    width: 26,
    height: 30,
    bodyType: NONE,
    info: "cover2_lvl7",
  },
  {
    name: "cover3_lvl7",
    image: "levels/06/cover3_lvl7.png",
    width: 26,
    height: 28,
    bodyType: NONE,
    info: "cover3_lvl7",
  },
  {
    name: "flash1_lvl7",
    image: "levels/06/flash1_lvl7.png",
    width: 82,
    height: 8,
    frames: 4,
    bodyType: NONE,
    info: "flash1_lvl7",
  },
  {
    name: "flower_lvl7",
    image: "levels/06/flower_lvl7.png",
    width: 118,
    height: 98,
    frames: 27,
    rows: 9,
    columns: 3,
    bodyType: NONE,
    info: "flower_lvl7",
  },
  {
    name: "cover_entrance_lvl6",
    image: "levels/07/cover_entrance_lvl6.png",
    width: 48,
    height: 60,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_exit_lvl6",
    image: "levels/07/cover_exit_lvl6.png",
    width: 44,
    height: 62,
    frames: 1,
    bodyType: NONE,
    info: "cover_exit_lvl6",
  },
  {
    name: "star_cover",
    image: "levels/07/star_cover.png",
    width: 40,
    height: 24,
    frames: 1,
    bodyType: NONE,
    info: "star_cover",
  },
  {
    name: "door_lvl8",
    image: "levels/08/door_lvl8.png",
    width: 42,
    height: 12,
    frames: 1,
    bodyType: BOX,
    bodyWidth: 42,
    bodyHeight: 8,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "door_lvl8",
  },
  {
    name: "entrance_cover_lvl8",
    image: "levels/08/entrance_cover_lvl8.png",
    width: 54,
    height: 60,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "exit_cover_lvl8",
    image: "levels/08/exit_cover_lvl8.png",
    width: 64,
    height: 54,
    frames: 1,
    bodyType: NONE,
    info: "exit_cover_lvl8",
  },
  {
    name: "star_cover2_lvl8",
    image: "levels/08/star_cover2_lvl8.png",
    width: 38,
    height: 28,
    frames: 1,
    bodyType: NONE,
    info: "star_cover2_lvl8",
  },
  {
    name: "star_cover3_lvl8",
    image: "levels/08/star_cover3_lvl8.png",
    width: 42,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star_cover3_lvl8",
  },
  {
    name: "bridge_lvl9",
    image: "levels/09/bridge_lvl9.png",
    width: 28,
    height: 74,
    bodyHeight: 70,
    bodyWidth: 20,
    frames: 15,
    rows: 10,
    columns: 2,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "cover_alien_lvl9",
    image: "levels/09/cover_alien_lvl9.png",
    width: 70,
    height: 88,
    bodyType: NONE,
    info: "cover_alien_lvl9",
  },
  {
    name: "cover_bridge1_lvl9",
    image: "levels/09/cover_bridge1_lvl9.png",
    width: 28,
    height: 24,
    bodyType: NONE,
    info: "cover_bridge1_lvl9",
  },
  {
    name: "cover_bridge2_lvl9",
    image: "levels/09/cover_bridge2_lvl9.png",
    width: 28,
    height: 24,
    bodyType: NONE,
    info: "cover_bridge2_lvl9",
  },
  {
    name: "cover_flower_lvl9",
    image: "levels/09/cover_flower_lvl9.png",
    width: 62,
    height: 14,
    bodyType: NONE,
    info: "cover_flower_lvl9",
  },
  {
    name: "cover_star_lvl9",
    image: "levels/09/cover_star_lvl9.png",
    width: 54,
    height: 40,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "entrance_lvl9",
    image: "levels/09/entrance_lvl9.png",
    width: 52,
    height: 60,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "exit_lvl9",
    image: "levels/09/exit_lvl9.png",
    width: 46,
    height: 64,
    bodyType: NONE,
    info: "exit_lvl9",
  },
  {
    name: "portal_lvl9",
    image: "levels/09/portal_lvl9.png",
    width: 18,
    height: 62,
    frames: 15,
    bodyType: NONE,
    info: "portal_lvl9",
  },
  {
    name: "ray_lvl9",
    image: "levels/09/ray_lvl9.png",
    width: 8,
    height: 74,
    bodyType: NONE,
    info: "ray_lvl9",
  },
  {
    name: "scan_light_lvl9",
    image: "levels/09/scan_light_lvl9.png",
    width: 16,
    height: 66,
    frames: 8,
    bodyType: NONE,
    info: "scan_light_lvl9",
  },
  {
    name: "scan_lvl9",
    image: "levels/09/scan_lvl9.png",
    width: 16,
    height: 66,
    frames: 8,
    bodyType: NONE,
    info: "scan_lvl9",
  },
  {
    name: "ufo_lvl9",
    image: "levels/09/ufo_lvl9.png",
    width: 54,
    height: 38,
    bodyType: NONE,
    info: "ufo_lvl9",
  },
  {
    name: "cover_entrance_lvl10",
    image: "levels/10/cover_entrance_lvl10.png",
    width: 56,
    height: 60,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_exit_lvl10",
    image: "levels/10/cover_exit_lvl10.png",
    width: 56,
    height: 60,
    frames: 1,
    bodyType: NONE,
    info: "cover_exit_lvl10",
  },
  {
    name: "platform_lvl10",
    image: "levels/10/platform_lvl10.png",
    width: 76,
    height: 58,
    frames: 1,
    bodyType: BOX,
    bodyWidth: 60,
    bodyHeight: 40,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "platform_lvl10",
  },
  {
    name: "ray_lvl10",
    image: "levels/10/ray_lvl10.png",
    width: 106,
    height: 8,
    frames: 1,
    bodyType: NONE,
    info: "ray",
  },
  {
    name: "star_cover_door_lvl10",
    image: "levels/10/star_cover_door_lvl10.png",
    width: 30,
    height: 32,
    frames: 18,
    bodyType: NONE,
    info: "star_cover_door_lvl10",
  },
  {
    name: "star_cover_grass_lvl10",
    image: "levels/10/star_cover_grass_lvl10.png",
    width: 70,
    height: 38,
    frames: 18,
    bodyType: NONE,
    info: "star_cover_grass_lvl10",
  },
  {
    name: "star_cover_lvl10",
    image: "levels/10/star_cover_lvl10.png",
    width: 46,
    height: 48,
    frames: 1,
    bodyType: NONE,
    info: "star_cover_lvl10",
  },
  {
    name: "bridge1_lvl11",
    image: "levels/11/bridge1_lvl11.png",
    width: 22,
    height: 62,
    bodyHeight: 60,
    bodyWidth: 19,
    frames: 15,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "bridge2_lvl11",
    image: "levels/11/bridge2_lvl11.png",
    width: 62,
    height: 18,
    bodyHeight: 14,
    bodyWidth: 60,
    frames: 15,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "bridge3_lvl11",
    image: "levels/11/bridge3_lvl11.png",
    width: 66,
    height: 26,
    bodyHeight: 20,
    bodyWidth: 60,
    frames: 15,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "cover_entrance_lvl11",
    image: "levels/11/cover_entrance_lvl11.png",
    width: 62,
    height: 16,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_exit_lvl11",
    image: "levels/11/cover_exit_lvl11.png",
    width: 52,
    height: 60,
    bodyType: NONE,
    info: "cover_exit_lvl11",
  },
  {
    name: "bridge_anim_lvl12",
    image: "levels/12/bridge_anim_lvl12.png",
    width: 26,
    height: 54,
    frames: 15,
    rows: 15,
    columns: 2,
    bodyType: BOX,
    bodyWidth: 24,
    bodyHeight: 52,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "bridge_accordion",
  },
  {
    name: "button_cover_lvl12",
    image: "levels/12/button_cover_lvl12.png",
    width: 52,
    height: 52,
    frames: 1,
    bodyType: NONE,
    info: "button_cover_lvl12",
  },
  {
    name: "electricity_anim_lvl12",
    image: "levels/12/electricity_anim_lvl12.png",
    width: 8,
    height: 106,
    frames: 4,
    bodyType: NONE,
    info: "electricity_anim_lvl12",
  },
  {
    name: "exit_cover_lvl12",
    image: "levels/12/exit_cover_lvl12.png",
    width: 62,
    height: 60,
    frames: 1,
    bodyType: NONE,
    info: "exit_cover_lvl12",
  },
  {
    name: "hat_anim_lvl12",
    image: "levels/12/hat_anim_lvl12.png",
    width: 88,
    height: 68,
    frames: 40,
    rows: 14,
    columns: 3,
    bodyType: NONE,
    info: "hat_anim_lvl12",
  },
  {
    name: "satellite_lvl12",
    image: "levels/12/satellite_lvl12.png",
    width: 90,
    height: 48,
    frames: 1,
    bodyType: NONE,
    info: "satellite_lvl12",
  },
  {
    name: "star_cover_lvl12",
    image: "levels/12/star_cover_lvl12.png",
    width: 22,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star_cover_lvl12",
  },
  {
    name: "start_cover1_lvl12",
    image: "levels/12/start_cover1_lvl12.png",
    width: 82,
    height: 100,
    frames: 1,
    bodyType: NONE,
    info: "",
  },
  {
    name: "start_cover2_lvl12",
    image: "levels/12/start_cover2_lvl12.png",
    width: 52,
    height: 60,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "bridge_anim_lvl14",
    image: "levels/13/bridge_anim_lvl14.png",
    width: 66,
    height: 28,
    frames: 15,
    bodyType: BOX,
    bodyWidth: 66,
    bodyHeight: 20,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "bridge_accordion",
  },
  {
    name: "electro_barrier_lvl14",
    image: "levels/13/electro_barrier_lvl14.png",
    width: 8,
    height: 64,
    frames: 4,
    bodyType: NONE,
    info: "electro_barrier_lvl14",
  },
  {
    name: "exit_sign_lvl14",
    image: "levels/13/exit_sign_lvl14.png",
    width: 52,
    height: 30,
    frames: 55,
    bodyType: NONE,
    info: "exit_sign_lvl14",
  },
  {
    name: "pipe_cover_lvl14",
    image: "levels/13/pipe_cover_lvl14.png",
    width: 62,
    height: 76,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "star_cover_lvl14",
    image: "levels/13/star_cover_lvl14.png",
    width: 36,
    height: 28,
    frames: 1,
    bodyType: NONE,
    info: "star_cover_lvl14",
  },
  {
    name: "star_cover2_lvl14",
    image: "levels/13/star_cover2_lvl14.png",
    width: 28,
    height: 30,
    frames: 1,
    bodyType: NONE,
    info: "star_cover2_lvl14",
  },
  {
    name: "bridge1_lvl15",
    image: "levels/14/bridge1_lvl15.png",
    width: 28,
    height: 58,
    bodyHeight: 54,
    bodyWidth: 20,
    frames: 15,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "bridge2_lvl15",
    image: "levels/14/bridge2_lvl15.png",
    width: 28,
    height: 50,
    bodyHeight: 46,
    bodyWidth: 20,
    frames: 16,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "cover_star1_lvl15",
    image: "levels/14/cover_star1_lvl15.png",
    width: 50,
    height: 26,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover_star2_lvl15",
    image: "levels/14/cover_star2_lvl15.png",
    width: 38,
    height: 20,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "entrance_lvl15",
    image: "levels/14/entrance_lvl15.png",
    width: 54,
    height: 62,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "exit_lvl15",
    image: "levels/14/exit_lvl15.png",
    width: 52,
    height: 60,
    bodyType: NONE,
    info: "exit_lvl15",
  },
  {
    name: "wheel_lvl15",
    image: "levels/14/wheel_lvl15.png",
    width: 18,
    height: 18,
    bodyWidth: 17.5,
    bodyPosCorrect: { x: 0, y: -0.25 },
    bodyType: CIRCLE,
    info: "wheel_lvl15",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "bridge_anim1_lvl16",
    image: "levels/15/bridge_anim1_lvl16.png",
    width: 30,
    height: 60,
    frames: 15,
    bodyType: BOX,
    bodyWidth: 24,
    bodyHeight: 58,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "bridge_accordion",
  },
  {
    name: "bridge_anim2_lvl16",
    image: "levels/15/bridge_anim2_lvl16.png",
    width: 66,
    height: 28,
    frames: 15,
    bodyType: BOX,
    bodyWidth: 64,
    bodyHeight: 24,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "bridge_accordion",
  },
  {
    name: "bridge_anim3_lvl16",
    image: "levels/15/bridge_anim3_lvl16.png",
    width: 28,
    height: 66,
    frames: 15,
    bodyType: BOX,
    bodyWidth: 24,
    bodyHeight: 64,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "bridge_accordion",
  },
  {
    name: "bridge_anim4_lvl16",
    image: "levels/15/bridge_anim4_lvl16.png",
    width: 60,
    height: 28,
    frames: 15,
    bodyType: BOX,
    bodyWidth: 58,
    bodyHeight: 24,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "bridge_accordion",
  },
  {
    name: "cover_entrance_lvl16",
    image: "levels/15/cover_entrance_lvl16.png",
    width: 56,
    height: 80,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_exit_lvl16",
    image: "levels/15/cover_exit_lvl16.png",
    width: 62,
    height: 76,
    frames: 1,
    bodyType: NONE,
    info: "cover_exit_lvl16",
  },
  {
    name: "star_cover1_lvl16",
    image: "levels/15/star_cover1_lvl16.png",
    width: 40,
    height: 42,
    frames: 1,
    bodyType: NONE,
    info: "star_cover1_lvl16",
  },
  {
    name: "star_cover2_lvl16",
    image: "levels/15/star_cover2_lvl16.png",
    width: 36,
    height: 42,
    frames: 1,
    bodyType: NONE,
    info: "star_cover2_lvl16",
  },
  {
    name: "bridge_lvl17",
    image: "levels/16/bridge_lvl17.png",
    width: 28,
    height: 58,
    bodyHeight: 54,
    bodyWidth: 20,
    frames: 15,
    bodyType: BOX,
    info: "bridge_accordion",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "cover_tube_lvl17",
    image: "levels/16/cover_tube_lvl17.png",
    width: 82,
    height: 76,
    bodyType: NONE,
    info: "cover_tube_lvl17",
  },
  {
    name: "cover1_lvl17",
    image: "levels/16/cover1_lvl17.png",
    width: 46,
    height: 28,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover2_lvl17",
    image: "levels/16/cover2_lvl17.png",
    width: 42,
    height: 32,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "electricity_lvl17",
    image: "levels/16/electricity_lvl17.png",
    width: 8,
    height: 90,
    frames: 4,
    bodyType: NONE,
    info: "electricity_lvl17",
  },
  {
    name: "electricity2_lvl17",
    image: "levels/16/electricity2_lvl17.png",
    width: 80,
    height: 8,
    frames: 4,
    bodyType: NONE,
    info: "electricity2_lvl17",
  },
  {
    name: "entrance_lvl17",
    image: "levels/16/entrance_lvl17.png",
    width: 64,
    height: 76,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "exit_lvl17",
    image: "levels/16/exit_lvl17.png",
    width: 64,
    height: 76,
    bodyType: NONE,
    info: "exit_lvl17",
  },
  {
    name: "hat_lvl17",
    image: "levels/16/hat_lvl17.png",
    width: 50,
    height: 60,
    frames: 31,
    rows: 16,
    columns: 2,
    bodyType: NONE,
    info: "hat_lvl17",
  },
  {
    name: "wheel_lvl17",
    image: "levels/16/wheel_lvl17.png",
    width: 18,
    height: 18,
    bodyWidth: 17.5,
    bodyPosCorrect: { x: 0, y: -0.25 },
    bodyType: CIRCLE,
    info: "wheel_lvl17",
    density: platform_density,
    restitution: 0.01,
    friction: 0.01,
  },
  {
    name: "lvl18_anim_door1",
    image: "levels/17/lvl18_anim_door1.png",
    width: 22,
    height: 62,
    frames: 15,
    bodyType: BOX,
    bodyWidth: 16,
    bodyHeight: 56,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "bridge_accordion",
  },
  {
    name: "lvl18_anim_door2",
    image: "levels/17/lvl18_anim_door2.png",
    width: 58,
    height: 22,
    frames: 15,
    bodyType: BOX,
    bodyWidth: 56,
    bodyHeight: 16,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "bridge_accordion",
  },
  {
    name: "lvl18_box",
    image: "levels/17/lvl18_box.png",
    width: 42,
    height: 42,
    frames: 1,
    bodyType: BOX,
    bodyWidth: 40,
    bodyHeight: 40,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: false,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "lvl18_box",
  },
  {
    name: "lvl18_btn_crane",
    image: "levels/17/lvl18_btn_crane.png",
    width: 28,
    height: 30,
    frames: 3,
    bodyType: NONE,
    info: "button",
  },
  {
    name: "lvl18_crane_stats",
    image: "levels/17/lvl18_crane_stats.png",
    width: 66,
    height: 52,
    frames: 2,
    bodyType: NONE,
    info: "crane",
  },
  {
    name: "lvl18_exit_cover",
    image: "levels/17/lvl18_exit_cover.png",
    width: 52,
    height: 60,
    frames: 1,
    bodyType: NONE,
    info: "lvl18_exit_cover",
  },
  {
    name: "lvl18_star_cover",
    image: "levels/17/lvl18_star_cover.png",
    width: 56,
    height: 54,
    frames: 1,
    bodyType: NONE,
    info: "lvl18_star_cover",
  },
  {
    name: "lvl18_star_cover2",
    image: "levels/17/lvl18_star_cover2.png",
    width: 42,
    height: 86,
    frames: 1,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "lvl18_start_cover",
    image: "levels/17/lvl18_start_cover.png",
    width: 60,
    height: 56,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "lvl18_lever",
    image: "levels/17/lvl18_lever.png",
    width: 56,
    height: 38,
    frames: 7,
    bodyType: NONE,
    info: "lever3",
  },
  {
    name: "bridge_lvl19",
    image: "levels/18/bridge_lvl19.png",
    width: 146,
    height: 16,
    bodyHeight: 14,
    bodyType: BOX,
    info: "bridge",
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
  },
  {
    name: "ant",
    image: "levels/18/ant.png",
    width: 42,
    height: 44,
    bodyWidth: 30,
    frames: 17,
    bodyType: CIRCLE,
    info: "alien_snail",
    density: 1,
    restitution: 0.2,
    friction: 1,
  },
  {
    name: "exit_lvl19",
    image: "levels/18/exit_lvl19.png",
    width: 72,
    height: 60,
    bodyType: NONE,
    info: "exit_lvl19",
  },
  {
    name: "entrance_lvl19",
    image: "levels/18/entrance_lvl19.png",
    width: 86,
    height: 60,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "cover_bridge1_lvl19",
    image: "levels/18/cover_bridge1_lvl19.png",
    width: 152,
    height: 20,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover_bridge2_lvl19",
    image: "levels/18/cover_bridge2_lvl19.png",
    width: 148,
    height: 22,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover1_lvl19",
    image: "levels/18/cover1_lvl19.png",
    width: 46,
    height: 40,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover2_lvl19",
    image: "levels/18/cover2_lvl19.png",
    width: 44,
    height: 38,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "cover1_ant_lvl19",
    image: "levels/18/cover1_ant_lvl19.png",
    width: 54,
    height: 58,
    bodyType: NONE,
    info: "cover1_ant_lvl19",
  },
  {
    name: "cover2_ant_lvl19",
    image: "levels/18/cover2_ant_lvl19.png",
    width: 60,
    height: 56,
    bodyType: NONE,
    info: "cover2_ant_lvl19",
  },
  {
    name: "cover3_ant_lvl19",
    image: "levels/18/cover3_ant_lvl19.png",
    width: 60,
    height: 54,
    bodyType: NONE,
    info: "cover3_ant_lvl19",
  },
  {
    name: "cover_star1_lvl13",
    image: "levels/19/cover_star1_lvl13.png",
    width: 32,
    height: 18,
    bodyType: NONE,
    info: "cover",
  },
  {
    name: "entrance_lvl13",
    image: "levels/19/entrance_lvl13.png",
    width: 62,
    height: 76,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "door_star_lvl13",
    image: "levels/19/door_star_lvl13.png",
    width: 84,
    height: 80,
    frames: 32,
    rows: 11,
    columns: 3,
    bodyType: NONE,
    info: "door_star_lvl13",
  },
  {
    name: "platform_lvl13",
    image: "levels/19/platform_lvl13.png",
    width: 84,
    height: 66,
    bodyType: POLY,
    points: [
      [
        [-33, -14],
        [30, -14],
        [30, 25],
        [-33, 25],
      ],
      [
        [-33, -14],
        [-33, -32],
        [-28, -32],
        [-28, -14],
      ],
      [
        [30, -14],
        [25, -14],
        [25, -32],
        [30, -32],
      ],
    ],
    density: platform_density,
    restitution: platform_restitution,
    friction: platform_friction,
    info: "platform_lvl13",
  },
  {
    name: "lvl20_boss",
    image: "levels/20/lvl20_boss.png",
    width: 98,
    height: 70,
    frames: 50,
    rows: 13,
    columns: 4,
    bodyType: BOX,
    bodyWidth: 70,
    bodyHeight: 48,
    bodyPosCorrect: { x: 10, y: 2 },
    fixed: false,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "final_boss",
  },
  {
    name: "lvl20_cable",
    image: "levels/20/lvl20_cable.png",
    width: 8,
    height: 224,
    frames: 1,
    bodyType: NONE,
    info: "lvl20_cable",
  },
  {
    name: "lvl20_electro_stick",
    image: "levels/20/lvl20_electro_stick.png",
    width: 12,
    height: 108,
    frames: 1,
    bodyType: NONE,
    info: "lvl20_electro_stick",
  },
  {
    name: "lvl20_entrance_cover",
    image: "levels/20/lvl20_entrance_cover.png",
    width: 54,
    height: 82,
    frames: 1,
    bodyType: NONE,
    info: "entrance",
  },
  {
    name: "lvl20_gravitation_cover",
    image: "levels/20/lvl20_gravitation_cover.png",
    width: 52,
    height: 52,
    frames: 1,
    bodyType: NONE,
    info: "lvl20_gravitation_cover",
  },
  {
    name: "lvl20_panel",
    image: "levels/20/lvl20_panel.png",
    width: 98,
    height: 38,
    frames: 1,
    bodyType: NONE,
    info: "lvl20_panel",
  },
  {
    name: "lvl20_star_cover",
    image: "levels/20/lvl20_star_cover.png",
    width: 40,
    height: 38,
    frames: 1,
    bodyType: NONE,
    info: "lvl20_star_cover",
  },
  {
    name: "lvl20_ufo",
    image: "levels/20/lvl20_ufo.png",
    width: 86,
    height: 64,
    frames: 1,
    bodyType: NONE,
    info: "lvl20_ufo",
  },
  {
    name: "lvl20_wheel",
    image: "levels/20/lvl20_wheel.png",
    width: 18,
    height: 18,
    frames: 1,
    bodyType: CIRCLE,
    bodyWidth: 16,
    bodyHeight: 18,
    bodyPosCorrect: { x: 0, y: 0 },
    fixed: true,
    density: 3,
    restitution: 0.2,
    friction: 2,
    info: "lvl20_wheel",
  },
];
var GAME_ID = "SnailBob4";
var stage = null;
var world = null;
var fps = 60;
var bitmaps = {};
var GET = {};
var LANDSCAPE_MODE = true;
var STATE_SPLASH = 0,
  STATE_LOGO = 1,
  STATE_MENU = 2,
  STATE_GAME = 3,
  STATE_LEVEL_SELECT = 4,
  STATE_VICTORY = 5,
  STATE_GAME_OVER = 6,
  STATE_COMICS = 7,
  STATE_FINAL = 8,
  STATE_CREDITS = 9,
  STATE_GALLERY = 10;
var gameState, prevState;
var mixer;
var currentLevel = 13;
var editorLevel = currentLevel;
var showDebugDraw = false;
var spritesDrawing = false;
var bob;
var stageSpr;
var stageProps = { width: 480, height: 320 };
var X_OFFSET;
var console = { log: function () {} };
var playingMusic;
window.onload = function () {
  GET = Utils.parseGet();
  Sprite.FLOOR_VALUES_ON_RENDER = false;
  Sprite.CACHE_BITMAPS = Utils.isIOS();
  Utils.addMobileListeners(LANDSCAPE_MODE, true);
  Utils.mobileCorrectPixelRatio();
  Utils.addFitLayoutListeners();
  Utils.switchToTimeMode(1e3 / fps);
  if (ExternalAPI.exec("init", {}, startLoad) !== true)
    setTimeout(startLoad, 600);
};
function startLoad() {
  var resolution = Utils.getMobileScreenResolution(LANDSCAPE_MODE);
  if (GET.debug) resolution = Utils.getScaleScreenResolution(2, LANDSCAPE_MODE);
  if (Utils.mobileCheckSlowDevice())
    resolution = Utils.getScaleScreenResolution(1, LANDSCAPE_MODE);
  if (ExternalAPI.type !== "Spilgames")
    resolution = Utils.getScaleScreenResolution(
      ExternalAPI.scale,
      LANDSCAPE_MODE
    );
  Utils.globalScale = 2;
  console.log("Scale = " + Utils.globalScale);
  X_OFFSET = 0;
  var rect = Utils.getWindowRect();
  var c1 = stageProps.width / stageProps.height;
  var c2 = rect.width / rect.height;
  if (c2 > c1) {
    if (c2 > 1140 / 640) c2 = 1140 / 640;
    stageProps.width = Math.floor(stageProps.height * c2);
    resolution.width = Math.floor(resolution.height * c2);
    X_OFFSET = (stageProps.width - 480) / 2;
  }
  Utils.createLayout(
    document.getElementById(Utils.DOMMainContainerId),
    resolution
  );
  Utils.addEventListener("fitlayout", function () {
    if (stage) {
      stage.drawScene(stage.canvas);
      stage.drawScene(stage.backgroundCanvas, true);
    }
    if (world) box2d.setDebugDrawScale(world);
  });
  Utils.addEventListener("lockscreen", function () {
    if (stage && stage.started) stage.stop();
  });
  Utils.addEventListener("unlockscreen", function () {
    if (stage && !stage.started) stage.start();
  });
  Utils.mobileHideAddressBar();
  if (!GET.debug) Utils.checkOrientation(LANDSCAPE_MODE);
  var path = Utils.imagesRoot + "/" + Utils.globalScale + "/";
  var data = [];
  var preloader = new ImagesPreloader();
  if (ExternalAPI.type === "Spilgames") {
    addGeneralImagesToQueue(data);
    addGeneralObjectsToQueue(data);
    TTLoader.create(loadSoundsEnd);
    preloader.maxProgressVal = 50;
    preloader.load(data, loadImagesEnd, TTLoader.showLoadProgress);
  } else {
    addGeneralImagesToQueue(data);
    addBackgroundsToQueue(data);
    addLevelObjectsToQueue(data);
    addLevelImagesToQueue(data);
    addImagesToQueue("victory", data);
    addImagesToQueue("gameOver", data);
    addImagesToQueue("levelMap", data);
    addImagesToQueue("credits", data);
    addImagesToQueue("comics", data);
    addImagesToQueue("gallery", data);
    addImagesToQueue("finalScene", data);
    loadPreloaderBack(preloader, data, path);
  }
}
function loadImagesEnd(data) {
  bitmaps = data;
  loadSounds();
}
function loadSounds() {
  var sounds = [],
    namesArr = loadData.sounds,
    path = "sounds/";
  for (var i = 0; i < namesArr.length; sounds.push(path + namesArr[i++]));
  var soundsPreloader = new SoundsPreloader(
    sounds,
    TTLoader.loadComplete,
    TTLoader.showLoadProgress
  );
  soundsPreloader.maxProgressVal = 50;
  soundsPreloader.minProgressVal = 50;
  soundsPreloader.load();
}
function loadSoundsEnd() {
  Utils.showMainLayoutContent();
  if (ExternalAPI.type === "Spilgames") setOtherBobs();
  getSaves();
  mixer = new AudioMixer("sounds", 10);
  ExternalAPI.exec("setMixer", mixer);
  if (!GET.debug) showMenu();
}
var gameSaves = {
  isSoundOn: true,
  isMusicOn: true,
  scores: [],
  awards: { flipCount: 0 },
};
function getSaves() {
  var saves = Utils.getCookie(getGameDataId());
  if (!JSON.parse(saves)) return;
  gameSaves = JSON.parse(saves);
  if (!gameSaves.awards) gameSaves.awards = { flipCount: 0 };
}
function saveGame() {
  Utils.setCookie(getGameDataId(), JSON.stringify(gameSaves));
}
function showMenu() {
  switchState(STATE_MENU);
  createScene();
}
function levelSelect() {
  preloadScene("levelMap", function () {
    switchState(STATE_LEVEL_SELECT);
    createScene();
  });
}
function showComics() {
  preloadScene("comics", function () {
    switchState(STATE_COMICS);
    createScene();
  });
}
function showGallery() {
  preloadScene("gallery", _start);
  function _start() {
    switchState(STATE_GALLERY);
    createScene();
  }
}
function createStage() {
  if (stage) {
    stage.destroy();
    stage.stop();
  }
  stage = new Stage("screen", stageProps.width, stageProps.height, false);
  stage.setBackgroundCanvas("screen_background");
  stage.delay = 1e3 / fps;
  stage.allowDebugDrawing = spritesDrawing;
  stage.ceilSizes = true;
  stage.showFPS = false;
}
function clearGlobalScope() {
  bob = null;
  level = null;
  field = null;
  stageSpr = null;
}
function createScene() {
  clearGlobalScope();
  stopAllSounds();
  createStage();
  switch (gameState) {
    case STATE_MENU:
      var mc = new MainMenu();
      stage.addChild(mc);
      mc.setRelativePosition(0, 0);
      break;
    case STATE_LEVEL_SELECT:
      var mc = new LevelSelect();
      stage.addChild(mc);
      mc.setRelativePosition(0, 0);
      break;
    case STATE_COMICS:
      var mc = new Comics();
      stage.addChild(mc);
      mc.setRelativePosition(0, 0);
      break;
    case STATE_GALLERY:
      var mc = new Gallery();
      stage.addChild(mc);
      mc.setRelativePosition(0, 0);
      break;
    case STATE_FINAL:
      preloadScene("finalScene", function () {
        field = new FinalCartoon1();
        field.init();
      });
      break;
  }
  stage.start();
  stage.refreshBackground();
}
function restart() {
  prepareLevel(currentLevel);
}
function startNextLevel() {
  prepareLevel(currentLevel + 1);
}
function prepareLevel(levelNum) {
  preloadScene(levelNum, _start);
  stopAllSounds();
  function _start() {
    setTimeout(function () {
      LevelManager.start(levelNum);
    }, 30);
  }
}
function startLevel(id, data) {
  LevelManager.start(editorLevel, data);
}
function preTick(e) {
  if (gameState == STATE_GAME) {
    var delta = Math.min(e.delta / 1e3, 0.05);
    world.Step(delta, 10, 10);
    box2d.syncStage(world);
  }
}
function postTick() {
  if (world && showDebugDraw) world.DrawDebugData();
}
function createObject(lo, ob, parent) {
  return ObjectManager.create(lo, ob, parent);
}
function playMusic(theme) {
  var wrapper = mixer.channels[0].audioWrapper;
  if (wrapper && wrapper.fileName == theme) return;
  if (gameSaves.isMusicOn)
    if (theme === "bob_new_space") {
      playingMusic = mixer.play(theme, true, false, 0);
      return playingMusic;
    } else return mixer.play(theme, true, false, 0);
}
function playSound(sound) {
  if (gameSaves.isSoundOn)
    if (ExternalAPI.type === "Spilgames") {
      if (AudioMixer.isWebAudioSupport()) return mixer.play(sound, false, true);
    } else return mixer.play(sound, false, true);
}
function toggleSounds(e) {
  gameSaves.isSoundOn = !gameSaves.isSoundOn;
  gameSaves.isMusicOn = !gameSaves.isMusicOn;
  if (!gameSaves.isMusicOn) {
    e.target.gotoAndStop(1);
    mixer.channels.forEach(function (c) {
      c.stop();
    });
  } else {
    e.target.gotoAndStop(0);
    playSceneMusic();
  }
  saveGame();
}
function playSceneMusic() {
  switch (gameState) {
    case STATE_MENU:
    case STATE_GAME:
    case STATE_LEVEL_SELECT:
      playMusic("bob_new_space");
      break;
    case STATE_COMICS:
      playMusic("MusicIntro");
      break;
    case STATE_FINAL:
      playMusic("MusicFinal");
      break;
  }
}
function stopAllSounds() {
  for (var i = 1; i < mixer.channels.length; i++) mixer.channels[i].stop();
}
function switchState(newState) {
  prevState = gameState;
  gameState = newState;
}
