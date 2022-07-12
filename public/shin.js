/*
 * @Author: strick
 * @Date: 2021-02-23 11:01:46
 * @LastEditTime: 2022-07-12 16:25:54
 * @LastEditors: strick
 * @Description: 前端监控 SDK
 * @FilePath: /strick/shin-admin/public/shin.js
 */
/* eslint-disable */
(function (window) {
  "use strict";

  /**
   * https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance
   */
  var performance =
    window.performance ||
    window.webkitPerformance ||
    window.msPerformance ||
    window.mozPerformance ||
    {};
  performance.now = (function () {
    return (
      performance.now ||
      performance.webkitNow ||
      performance.msNow ||
      performance.oNow ||
      performance.mozNow ||
      function () {
        return new Date().getTime();
      }
    );
  })();

  /**
   * 默认属性
   */
  var defaults = {
    refer: window.location.href,     //上一页地址
    firstScreen: 0,           //首屏时间 ms
    lcp: 0,                   // 最大内容可见的时间 ms
    setFirstScreen: function() {    //自定义首屏时间
      this.firstScreen = _calcCurrentTime();
    },
    //可自定义的参数
    param: {
      isDebug: false,   //默认是非调试环境，而在调试中时，将不会重写 console.log
      isCrash: false,   //是否监控页面奔溃
      validateCrash: function() {},    //自定义奔溃规则，例如页面白屏判断的条件，返回值包括 {success: true, prompt:'提示'}
      src: "//127.0.0.1:8000/api/ma.gif",     //请求发送数据的地址（监控）
      // swSrc: '/sw.js',                  //Web Worker地址，用于监控页面奔溃
      psrc: "//127.0.0.1:8000/api/pe.gif",    //请求发送数据的地址（性能）
      pkey: "",         //性能监控的项目key
      subdir: "",       //一个项目下的子目录
      rate: 5,          //随机采样率，用于性能搜集
    }
  };
  
  var shin = defaults;
  /**
   * 自定义参数
   */
  shin.setParam = function(params) {
    if (!params) {
      return;
    }
    // 默认值重置
    for (var key in params) {
      this.param[key] = params[key];
    }
    //为原生对象注入自定义行为
    injectConsole(this.param.isDebug);
  };

  /**
   * 基于 Web Worker 心跳的方案，监控页面奔溃情况
   */
  function monitorCrash(param) {
    var isCrash = param.isCrash,
      validateCrash = param.validateCrash;
    if(!isCrash || !window.Worker)
      return;
    // var worker = new Worker(param.swSrc);
    var HEARTBEAT_INTERVAL = 5 * 1000; // 每五秒发一次心跳
    // var sessionId = getIdentity();
    var heartbeat = function () {
      var result = validateCrash();
      if(result && !result.success) {
        // 符合自定义的奔溃规则
        handleError({
          type: ERROR_CRASH,
          desc: {
            prompt: result.prompt,
            url: window.location.href
          },
        });
        // 关闭定时器
        clearInterval(timer);
        // worker = null;
      }
      // worker && worker.postMessage({
      //   type: 'heartbeat',
      //   id: sessionId,
      //   data: {     //在页面奔溃时，上报数据，需要将上报地址一起传递
      //     src: param.src,
      //     m: _paramify({
      //       category: ACTION_ERROR,
      //       data: {
      //         type: ERROR_CRASH,
      //         desc: {
      //           url: location.href
      //         },
      //       }
      //     })
      //   }
      // });
    }
    // window.addEventListener("beforeunload", function() {
    //   worker.postMessage({
    //     type: 'unload',
    //     id: sessionId
    //   });
    // });
    var timer = setInterval(heartbeat, HEARTBEAT_INTERVAL);
    // heartbeat();
    // 5分钟后自动取消定时器
    setTimeout(function() {
      // 关闭定时器
      clearInterval(timer);
    }, 1000 * 300);
  }

  /**
   * 标记时间，单位毫秒
   * Date.now() 会受系统程序执行阻塞的影响
   * performance.now() 的时间是以恒定速率递增的，不受系统时间的影响（系统时间可被人为或软件调整）
   */
  shin.now = function () {
    return performance.now();
  };

  // ----------------------------------------性能采集----------------------------------------
  var firstScreenHeight = window.innerHeight;         //第一屏高度
  var doc = window.document;
  /**
   * 计算当前时间与 fetchStart 之间的差值
   */
  function _calcCurrentTime() {
    return _getTiming().now;
  }
  /**
   * 浏览器 LCP 计算
   * https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint
   */
  function getLCP() {
    if(!PerformanceObserver) return;
    var types = PerformanceObserver.supportedEntryTypes;
    var lcpType = 'largest-contentful-paint';
    // 浏览器兼容判断
    if(types.indexOf(lcpType) === -1) {
      return;
    }
    new PerformanceObserver(function(entryList) {
      var entries = entryList.getEntries();
      var lastEntry = entries[entries.length - 1];
      shin.lcp = lastEntry.renderTime || lastEntry.loadTime;
      // buffered 为 true 表示调用 observe() 之前的也算进来
    }).observe({type: lcpType, buffered: true});
  }
  getLCP();
  /**
   * 监控页面奔溃情况
   * 计算首屏时间
   * 记录首屏图片的载入时间
   * 用户在没有滚动时候看到的内容渲染完成并且可以交互的时间
   */
  doc.addEventListener("DOMContentLoaded", function () {
      // 监控页面奔溃情况
      monitorCrash(shin.param);
      var isFindLastImg = false,
        allFirsrImgsLoaded = false,
        firstScreenImgs = [];
      //用一个定时器差值页面中的图像元素
      var interval = setInterval(function() {
        //如果自定义了 firstScreen 的值，就销毁定时器
        if(shin.firstScreen) {
          clearInterval(interval);
          return;
        }
        if(isFindLastImg) {
          allFirsrImgsLoaded = firstScreenImgs.every(function(img) {
            return img.complete;
          });
          //当所有的首屏图像都载入后，关闭定时器并记录首屏时间
          if(allFirsrImgsLoaded) {
            shin.firstScreen = _calcCurrentTime();
            clearInterval(interval);
          }
          return;
        }
        var imgs = doc.querySelectorAll('img');
        imgs = [].slice.call(imgs);   //转换成数组
        //遍历页面中的图像
        imgs.forEach(function(img) {
          if(isFindLastImg)
            return;
          //当图像离顶部的距离超过屏幕宽度时，被认为找到了首屏的最后一张图
          var rect = img.getBoundingClientRect();
          if((rect.top + rect.height) > firstScreenHeight) {
            isFindLastImg = true;
		    		return;
		    	}
          //若未超过，则认为图像在首屏中
          firstScreenImgs.push(img);
        });
      }, 0);
    },
    false
  );

  /**
   * 读取 timing 对象，兼容新版和旧版
   */
  function _getTiming() {
    var timing = performance.getEntriesByType('navigation')[0] || performance.timing;
    var now = 0;
    if(!timing) {
      return { now: now };
    }
    var navigationStart;
    if(timing.startTime === undefined) {
      navigationStart = timing.navigationStart;
      /**
       * 之所以老版本的用 Date，是为了防止出现负数
       * 当 performance.now 是最新版本时，数值的位数要比 timing 中的少很多
       */
      now = new Date().getTime() - navigationStart;
    }else {
      navigationStart = timing.startTime;
      now = shin.now() - navigationStart;
    }
    return { timing: timing, navigationStart: navigationStart, now: _rounded(now) };
  }
  /**
	 * 请求时间统计
	 * https://github.com/addyosmani/timing.js
	 */
  shin.getTimes = function() {
    //出于对浏览器兼容性的考虑，仍然引入即将淘汰的 performance.timing
    var currentTiming = _getTiming();
    var timing = currentTiming.timing;
    // var timing = performance.timing;
    var api = {};   //时间单位 ms
    if(!timing) {
      return api;
    }
    var navigationStart = currentTiming.navigationStart;
    /**
     * http://javascript.ruanyifeng.com/bom/performance.html
     * 页面加载总时间，有可能为0，未触发load事件
     * 这几乎代表了用户等待页面可用的时间
     * loadEventEnd（加载结束）-navigationStart（导航开始）
     */
    api.loadTime = timing.loadEventEnd - navigationStart;
    
    /**
     * Unload事件耗时
     */
    api.unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart;

    /**
     * 执行 onload 回调函数的时间
     * 是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
     */
    api.loadEventTime = timing.loadEventEnd - timing.loadEventStart;

    /**
     * 首次可交互时间
     */
    api.interactiveTime = timing.domInteractive - timing.fetchStart;

    /**
     * 用户可操作时间（DOM Ready时间）
     */
    api.domReadyTime = timing.domContentLoadedEventEnd - timing.fetchStart;
    
    /**
     * 白屏时间
     */
    var paint = performance.getEntriesByType('paint');
    if(paint && timing.entryType && paint[0]) {
      api.firstPaint = paint[0].startTime - timing.fetchStart;
    }else {
      api.firstPaint = timing.responseEnd - timing.fetchStart;
    }

    /**
     * 解析 DOM 树结构的时间
     * 期间要加载内嵌资源
     * 反省下你的 DOM 树嵌套是不是太多了
     */
    api.parseDomTime = timing.domComplete - timing.domInteractive;

    /**
     * 请求完毕至DOM加载耗时
     */
    api.initDomTreeTime = timing.domInteractive - timing.responseEnd;

    /**
     * 准备新页面耗时
     */
    api.readyStart = timing.fetchStart - navigationStart;

    /**
     * 重定向次数（新）
     */
    api.redirectCount = timing.redirectCount || 0;

    /**
     * 传输内容压缩百分比（新）
     */
    api.compression = (1 - timing.encodedBodySize / timing.decodedBodySize) * 100 || 0;

    /**
     * 重定向的时间
     * 拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
     */
    api.redirectTime = timing.redirectEnd - timing.redirectStart;

    /**
     * DNS缓存耗时
     */
    api.appcacheTime = timing.domainLookupStart - timing.fetchStart;

    /**
     * DNS查询耗时
     * DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
     * 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
     */
    api.lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart;

    /**
     * SSL连接耗时
     */
    var sslTime = timing.secureConnectionStart;
    api.connectSslTime = sslTime > 0 ? timing.connectEnd - sslTime : 0;

    /**
     * TCP连接耗时
     */
    api.connectTime = timing.connectEnd - timing.connectStart;

    /**
     * 内容加载完成的时间
     * 页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
     */
    api.requestTime = timing.responseEnd - timing.requestStart;

    /**
     * 请求文档
     * 开始请求文档到开始接收文档
     */
    api.requestDocumentTime = timing.responseStart - timing.requestStart;

    /**
     * 接收文档（内容传输耗时）
     * 开始接收文档到文档接收完成
     */
    api.responseDocumentTime = timing.responseEnd - timing.responseStart;

    /**
     * 读取页面第一个字节的时间
     * 这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
     * TTFB 即 Time To First Byte 的意思
     * 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
     */
    api.TTFB = timing.responseStart - timing.fetchStart;

    /**
    * 仅用来记录当前 performance.now() 获取到的时间格式
    * 用于追溯计算
    */
    api.now = shin.now();
    
    //全部取整
    for (var key in api) {
      api[key] = _rounded(api[key]);
    }

    /**
     * 浏览器读取到的性能参数，用于排查，并保留两位小数
     */
    api.timing = {};
    for(key in timing) {
      var timingValue = timing[key];
      var type = typeof timingValue;
      if(type === "function")
        continue;
      api.timing[key] = timingValue;
      if(type === "number")
        api.timing[key] = _rounded(timingValue, 2);
    }
    return api;
  };
  /**
   * 组装性能变量
   */
  function _paramifyPerformance(obj) {
    obj.token = shin.param.token;
    obj.pkey = shin.param.pkey;
    obj.identity = getIdentity();
    obj.referer = window.location.href;    //来源地址
    // 若未定义或未计算到，则默认为用户可操作时间
    obj.firstScreen = shin.lcp || shin.firstScreen || obj.domReadyTime;
    // 静态资源列表
    var resources = performance.getEntriesByType('resource');
    var newResources = [];
    resources && resources.forEach(function(value) {
      // 过滤 fetch 请求
      if(value.initiatorType === 'fetch') return;
      // 只存储 1 分钟内的资源
      if(value.startTime > 60000) return;
      newResources.push({
        name: value.name,
        duration: Math.round(value.duration),
        startTime: Math.round(value.startTime),
      })
    });
    obj.resource = newResources;
    return JSON.stringify(obj);
  }

  /**
   * 均匀获得两个数字之间的随机数
   */
  function _randomNum(max, min){
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  /**
   * iOS 设备不支持 beforeunload 事件，需要使用 pagehide 事件
   * 在页面卸载之前，推送性能信息
   */
  var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  var eventName = isIOS ? "pagehide" : "beforeunload";
  window.addEventListener(eventName, function() {
    sendBeacon();
  }, false);

  var SHIN_PERFORMANCE_DATA = "shin_performance_data";
  var heartbeat;    //心跳定时器
  /**
   * 发送数据
   */
  function sendBeacon(existData) {
    // 如果传了数据就使用该数据，否则读取性能参数，并格式化为字符串
    var data = existData || _paramifyPerformance(shin.getTimes());
    var rate = _randomNum(10, 1); // 选取1~10之间的整数
    if(shin.param.rate >= rate && shin.param.pkey) {
      navigator.sendBeacon(shin.param.psrc, data);
    }
    clearTimeout(heartbeat);
    localStorage.removeItem(SHIN_PERFORMANCE_DATA); //移除性能缓存
  }
  /**
   * 发送已存在的性能数据
   */
  function sendExistData() {
    var exist = localStorage.getItem(SHIN_PERFORMANCE_DATA);
    if(!exist)
      return;
    setTimeout(function() {
      sendBeacon(exist);
    }, 0);
  }
  sendExistData();
  /**
   * 一个心跳回调函数，缓存性能参数
   * 适用于不能触发 pagehide 和 beforeunload 事件的浏览器
   */
  function intervalHeartbeat() {
    localStorage.setItem(SHIN_PERFORMANCE_DATA, _paramifyPerformance(shin.getTimes()));
  }
  heartbeat = setInterval(intervalHeartbeat, 200);

  // ----------------------------------------常量声明----------------------------------------
  // 定义行为类型
  var ACTION_ERROR = "error";
  var ACTION_AJAX = "ajax";
  var ACTION_EVENT = "event";
  var ACTION_PRINT = "console";
  var ACTION_REDIRECT = "redirect";
  // 定义的错误类型码
  var ERROR_RUNTIME = 'runtime';
  var ERROR_SCRIPT = 'script';
  var ERROR_STYLE = 'style';
  var ERROR_IMAGE = 'image';
  var ERROR_AUDIO = 'audio';
  var ERROR_VIDEO = 'video';
  var ERROR_PROMISE = 'promise';
  var ERROR_VUE = 'vue';
  var ERROR_REACT = 'react';
  var ERROR_CRASH = 'crash';
  var LOAD_ERROR_TYPE = {
    SCRIPT: ERROR_SCRIPT,
    LINK: ERROR_STYLE,
    IMG: ERROR_IMAGE,
    AUDIO: ERROR_AUDIO,
    VIDEO: ERROR_VIDEO
  };

  // ----------------------------------------错误采集----------------------------------------
  /**
   * 上报错误
   * @param  {Object} errorLog    错误日志
   */
  function handleError(errorLog) {
    // console.log(errorLog);
    shin.send({
      category: ACTION_ERROR,
      data: errorLog
    });
  }
  /**
   * 监控资源异常，即无法响应的资源
   */
   window.addEventListener(
    "load",
    function () {
      // 罗列资源列表，PerformanceResourceTiming类型
      var resources = performance.getEntriesByType("resource");
      // 映射initiatorType和错误类型
      var hashError = {
        script: ERROR_SCRIPT,
        link: ERROR_STYLE,
        // img: ERROR_IMAGE
      };
      resources && resources.forEach(function(value) {
        var type = hashError[value.initiatorType];
        /**
         * 非监控资源、响应时间在20秒内、监控资源是ma.gif或shin.js，则结束当前循环
         */
        if(!type ||                                   //非监控资源
          value.duration < 20000  ||                  //20秒内
          value.name.indexOf("ma.gif") >= 0 ||
          value.name.indexOf("shin.js") >= 0) {
          return;
        }
        // 若是CSS文件，则过滤脚本文件
        if(type === ERROR_STYLE && 
          value.name.indexOf(".js") >= 0) {
          return;
        }
        handleError({
          type: type,
          desc: handleNumber(value.toJSON()),
        });
      });
    },
    false
  );
  /**
   * 监控脚本异常
   * https://github.com/BetterJS/badjs-report
   */
  window.addEventListener(
    "error",
    function (event) {
      var errorTarget = event.target;
      // console.log("errorTarget", errorTarget.nodeName);
      // 过滤掉与业务无关或无意义的错误
      if(event.message === "Script error." ||
          !event.filename ||
          (event.colno === 0 && event.message === "SyntaxError: Unexpected token ','")) {
        return;
      }
      // 过滤 target 为 window 的异常
      if (
        errorTarget !== window &&
        errorTarget.nodeName &&
        LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()]
      ) {
        handleError(formatLoadError(errorTarget));
      } else {
        handleError(
          formatRuntimerError(
            event.message,
            event.filename,
            event.lineno,
            event.colno,
            event.error
          )
        );
      }
    },
    true    //捕获
  );
  /**
   * 监控未处理的Promise错误
   * 当 Promise 被 reject 且没有 reject 处理器时触发
   */
  window.addEventListener(
    "unhandledrejection",
    function (event) {
      //处理响应数据，只抽取重要信息
      var response = event.reason.response;
      //若无响应，则不监控
      if(!response) {
        return;
      }
      var desc = response.request.ajax;
      desc.status = event.reason.status || response.status;
      // console.log(event.reason.response, event.reason.status);
      handleError({
        type: ERROR_PROMISE,
        desc: desc,
        // stack: event.reason && (event.reason.stack || "no stack")
      });
    },
    true
  );
  /**
   * 生成 laod 错误日志
   * 需要加载资源的元素
   * @param  {Object} errorTarget
   */
  function formatLoadError(errorTarget) {
    return {
      type: LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()],
      desc: errorTarget.baseURI + "@" + (errorTarget.src || errorTarget.href),
      // stack: "no stack"
    };
  }
  /**
   * 生成 runtime 错误日志
   * @param {String}  message      错误信息
   * @param {String}  filename     出错文件的URL
   * @param {Long}    lineno       出错代码的行号
   * @param {Long}    colno        出错代码的列号
   * @param {Object}  error        错误信息Object
   * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error
   */
  function formatRuntimerError(message, filename, lineno, colno, error) {
    return {
      type: ERROR_RUNTIME,
      lineno: lineno,
      colno: colno,
      desc: message + " at " + filename + ":" + lineno + ":" + colno,
      // stack: error && (error.stack ? error.stack : "no stack") // IE <9, has no error stack
    };
  }

  // ----------------------------------------行为统计----------------------------------------
  /**
   * ajax监控
   * https://github.com/HubSpot/pace
   */
  var _XMLHttpRequest = window.XMLHttpRequest; //保存原生的XMLHttpRequest
  //覆盖XMLHttpRequest
  window.XMLHttpRequest = function (flags) {
    var req;
    req = new _XMLHttpRequest(flags); //调用原生的XMLHttpRequest
    monitorXHR(req); //埋入我们的“间谍”
    return req;
  };
  var monitorXHR = function (req) {
    req.ajax = {};
    //var _change = req.onreadystatechange;
    req.addEventListener(
      "readystatechange",
      function () {
        if (this.readyState === 4) {
          var end = shin.now();           //结束时间
          req.ajax.status = req.status;   //状态码
          if ((req.status >= 200 && req.status < 300) || req.status === 304) {
            //请求成功
            req.ajax.endBytes = _kb(req.responseText.length * 2) + "KB"; //KB
            //console.log('响应数据：'+ req.ajax.endBytes);//响应数据大小
          } else {
            //请求失败
            req.ajax.endBytes = 0;
          }
          req.ajax.interval = _rounded(end - start, 2) + "ms";   //单位毫秒
          req.ajax.network = shin.network();
          //只记录300个字符以内的响应
          req.responseText.length <= 300 && (req.ajax.response = req.responseText);
          if(req.status < 500 &&            //只传送500以内的通信
            req.ajax.url !== '/api/user'  //不需要监控后台身份通信
          )
            handleAction(ACTION_AJAX, req.ajax);
          //console.log('ajax响应时间：'+req.ajax.interval);
        }
      },
      false
    );

    // “间谍”又对open方法埋入了间谍
    var _open = req.open;
    req.open = function (type, url, async) {
      req.ajax.type = type; //埋点
      req.ajax.url = url; //埋点
      return _open.apply(req, arguments);
    };

    var _send = req.send;
    var start;    //请求开始时间
    req.send = function (data) {
      start = shin.now(); //埋点
      // var bytes = 0; //发送数据大小
      if (data) {
        req.ajax.startBytes = _kb(JSON.stringify(data).length * 2) + "KB";
        req.ajax.data = data;   //传递的参数
      }
      return _send.apply(req, arguments);
    };
  };

  /**
   * 计算KB值
   * http://stackoverflow.com/questions/1248302/javascript-object-size
   */
  function _kb(bytes) {
    return _rounded(bytes / 1024, 2); //四舍五入2位小数
  }

  /**
   * 四舍五入
   */
  function _rounded(number, decimal) {
    return parseFloat(number.toFixed(decimal));
  }

  /**
   * 递归的将数字四舍五入小数点后两位
   */
  function handleNumber(obj) {
    var type = typeof obj;
    if (type === "object" && type !== null) {
      for (var key in obj) {
        // 当key是只读属性时，就不能直接赋值了
        obj[key] = handleNumber(obj[key]);
      }
    }
    if (type === "number") {
      return _rounded(obj, 2);
    }
    return obj;
  }

  /**
   * 处理行为
   */
  function handleAction(type, data) {
    shin.send({ category: type, data: handleNumber(data) });
  }

  /**
   * 全局监听事件
   */
  var eventHandle = function(eventType, detect) {
    return function(e) {
      if(!detect(e)) {
        return;
      }
      handleAction(ACTION_EVENT, {
        type: eventType,
        desc: e.target.outerHTML
      });
    };
  }
  // 监听点击事件
  window.addEventListener("click", eventHandle("click", function(e) {
    var nodeName = e.target.nodeName.toLowerCase();
    // 白名单
    if(nodeName !== "a" &&
        nodeName !== "button") {
      return false;
    }
    // 过滤 a 元素
    if(nodeName === "a") {
      var href = e.target.getAttribute("href");
      if(!href || href !== "#" || href.toLowerCase() !== "javascript:void(0)") {
        return false;
      }
    }
    return true;
  }), false);

  /**
   * 全局监听打印
   * 重置 console.log 的动作
   */
  function injectConsole(isDebug) {
    (!isDebug) && ["log"].forEach(function(level) {
      var _oldConsole = console[level];
      console[level] = function() {
        var params = [].slice.call(arguments);  // 参数转换成数组
        _oldConsole.apply(this, params);        // 执行原先的 console 方法
        var seen = [];
        handleAction(ACTION_PRINT, {
          type: level,
          // 避免循环引用
          desc: JSON.stringify(params, function(key, value) {
            if (typeof value === "object" && value !== null) {
              if (seen.indexOf(value) >= 0) {
                return;
              }
              seen.push(value);
            }
            return value;
          })
        });
      };
    });
  }
  
  /**
   * 全局监听跳转
   */
  var _onPopState = window.onpopstate;
  window.onpopstate = function(args) {
    var href = window.location.href;
    handleAction(ACTION_REDIRECT, {
      refer: shin.refer,
      current: href
    });
    shin.refer = href;
    _onPopState && _onPopState.apply(this, args);
  }

  /**
   * 打印特性 key:value格式
   */
  shin.print = function (obj, left, right, filter) {
    var list = [];
    left = left || "";
    right = right || "";
    for (var key in obj) {
      if (filter) {
        if (filter(obj[key])) list.push(left + key + ":" + obj[key] + right);
      } else {
        list.push(left + key + ":" + obj[key] + right);
      }
    }
    return list;
  };

  /**
   * 网络状态
   * https://github.com/daniellmb/downlinkMax
   * http://stackoverflow.com/questions/5529718/how-to-detect-internet-speed-in-javascript
   */
  shin.network = function () {
    //2.2--4.3安卓机才可使用
    var connection =
        window.navigator.connection ||
        window.navigator.mozConnection ||
        window.navigator.webkitConnection;
    var effectiveType = connection && connection.effectiveType;
    if (effectiveType) {
      return { bandwidth: 0, type: effectiveType.toUpperCase() };
    }
    var types = "Unknown Ethernet WIFI 2G 3G 4G".split(" ");
    var info = { bandwidth: 0, type: "" };
    if (connection && connection.type) {
      info.type = types[connection.type];
    }
    return info;
  };

  /**
   * 身份标识
   */
  function getIdentity() {
    var key = "shin-monitor-identity";
    //页面级的缓存而非全站缓存
    var identity = sessionStorage.getItem(key);
    if(!identity) {
      //生成标识
      identity = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
      sessionStorage.setItem(key, identity);
    }
    return identity;
  }
  /**
   * 组装监控变量
   * https://github.com/appsignal/appsignal-frontend-monitoring
   */
  function _paramify(obj) {
    obj.token = shin.param.token;
    obj.subdir = shin.param.subdir;
    obj.identity = getIdentity();
    return encodeURIComponent(JSON.stringify(obj));
  }

  /**
   * 处理 React 错误（对外）
   */
  shin.reactError = function(err, info) {
    // console.log(typeof err, info);
    handleError({
      type: ERROR_REACT,
      desc: err.toString(),
      stack: info.componentStack
    });
  }
  /**
   * Vue.js 错误劫持（对外）
   */
  shin.vueError = function(vue) {
    var _vueConfigErrorHandler = vue.config.errorHandler;
    vue.config.errorHandler = function(err, vm, info) {
      handleError({
        type: ERROR_VUE,
        desc: err.toString(),   //描述
        stack: err.stack,       //堆栈
      });
      // 控制台打印错误
      if(typeof console !== "undefined" && typeof console.error !== "undefined") {
        console.error(err);
      }
      // 执行原始的错误处理程序
      if(typeof _vueConfigErrorHandler === "function") {
        _vueConfigErrorHandler.call(err, vm, info);
      }
    }
  }
  /**
   * 推送监控信息
   */
  shin.send = function (data) {
    var ts = new Date().getTime().toString();
    var img = new Image(0, 0);
    img.src = shin.param.src + "?m=" + _paramify(data) + "&ts=" + ts;
  };
  window.shin = shin;
})(this);
