/*
 * @Author: strick
 * @Date: 2021-02-23 11:01:46
 * @LastEditTime: 2022-12-26 14:40:10
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
    lcp: {
      time: 0,    // 时间
      url: '',    // 资源地址
      element: '' // 参照的元素
    },         // 最大内容可见的对象，time：时间 ms，url：参照的资源地址
    fid: 0,   // 用户第一次与页面交互（例如当他们单击链接、点按按钮等操作）直到浏览器对交互作出响应的时间
    setFirstScreen: function() {    //自定义首屏时间
      this.firstScreen = _calcCurrentTime();
    },
    //可自定义的参数
    param: {
      isRecord: true, // 是否打开错误
      isDebug: false,   //默认是非调试环境，而在调试中时，将不会重写 console.log
      isCrash: false,   //是否监控页面奔溃
      validateCrash: function() {},    //自定义奔溃规则，例如页面白屏判断的条件，返回值包括 {success: true, prompt:'提示'}
      src: "//127.0.0.1:8000/api/ma.gif",     //请求发送数据的地址（监控）
      // swSrc: '/sw.js',                  //Web Worker地址，用于监控页面奔溃
      psrc: "//127.0.0.1:8000/api/pe.gif",    //请求发送数据的地址（性能）
      pkey: "",         //性能监控的项目key
      subdir: "",       //一个项目下的子目录
      rate: 5,          //随机采样率，用于性能搜集
      version: '',  // 版本，便于追查出错源
      identity: '', //可自定义的身份信息字段
    }
  };
  
  var shin = defaults;

  /**
   * 判断是否在APP中
   */
   function isApp() {
    var reg = /xxx\s?\//i;
    return reg.test(navigator.userAgent);
  }
  /**
   * 在客户端中埋入可识别的身份信息，例如userId
   * 这段代码可自行修改
   */
  function injectIdentity(identity) {
    // 若不是热拉APP或已经指定身份信息，则返回
    if(!isApp() || identity) return;
    // 在JSBridge成功调用后的回调函数
    window.getMonitorUserSuccess = function(result) {
      try {
        var json = JSON.parse(result);
        shin.param.identity = json.data.userId;
      }catch(e) {
        // console.error(e.message);
      }
    };
    // 通过JSBridge读取用户信息
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'xxx://com.user/getInfo?callback=getMonitorUserSuccess';
    /**
     * 需要加个定时器，因为调用document.body时，DOM还未存在
     * Uncaught TypeError: Cannot read property 'appendChild' of null
     */
    setTimeout(() => {
      document.body.appendChild(iframe);
    }, 0); 
  }
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
    // 埋入身份信息
    injectIdentity(this.param.identity);
    // 记录用户行为
    recordPage(this.param.isRecord);
  };

  /**
   * 记录用户行为
   */
  var recordEventsMatrix = [[]];
  function recordPage(isRecord) {
     if (!isRecord) { return; }
     var script = document.createElement('script');
     script.src = '//cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js';
     // 开始监控页面行为
     script.onload = function() {
       rrweb.record({
         emit(event, isCheckout) {
           // isCheckout 是一个标识，告诉你重新制作了快照
           if (isCheckout) {
             // 最多保留 3 段行为记录
             var deleteCount = recordEventsMatrix.length - 2;
             deleteCount > 0 && recordEventsMatrix.splice(0, deleteCount);
             recordEventsMatrix.push([]);
           }
           var lastEvents = recordEventsMatrix[recordEventsMatrix.length - 1];
           lastEvents.push(event);
         },
         checkoutEveryNms: 10 * 1000, // 每 10 秒重新制作快照
       });
     };
     document.head.append(script);
   }
   /**
    * 读取最近 20 秒的行为记录
    */
  function getRecentRecord() {
     var len = recordEventsMatrix.length;
     if(len === 0) return '';
     var events;
     if(len.length >= 2) {
       events = recordEventsMatrix[len - 2].concat(recordEventsMatrix[len - 1]);
     }else {
       events = recordEventsMatrix[len - 1];
     }
     return JSON.stringify(events);
   }
  /**
   * 白屏计算规则
   */
  function _isWhiteScreen() {
    // 罗列 body 的子元素
    var children = [].slice.call(document.body.children);
    // 过滤出高度不为 0 的子元素
    var visibles = children.filter(function(element) {
      return element.clientHeight > 0;
    });
    return visibles.length === 0;
  }
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
    var crashHeartbeat = function () {
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
        // 兜底白屏算法，可根据自身业务定义
      } else if(_isWhiteScreen()) {
        // 查询第一个div
        var currentDiv = document.querySelector('div');
        // 增加 html 字段是为了验证是否出现了误报
        handleError({
          type: ERROR_CRASH,
          desc: {
            prompt: '页面没有高度',
            url: location.href,
            html: currentDiv ? currentDiv.innerHTML : ''
          },
        });
        clearInterval(timer);
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
    var timer = setInterval(crashHeartbeat, HEARTBEAT_INTERVAL);
    crashHeartbeat(); // 立即执行一次
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
   * 判断当前宿主环境是否支持 PerformanceObserver
   * 并且支持某个特定的类型
   */
   function checkSupportPerformanceObserver(type) {
    if(!PerformanceObserver) return false;
    var types = PerformanceObserver.supportedEntryTypes;
    // 浏览器兼容判断
    if(types.indexOf(type) === -1) {
      return false;
    }
    return true;
  }
  /**
   * 浏览器 LCP 计算
   * LCP（Largest Contentful Paint）最大内容在可视区域内变得可见的时间
   * https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint
   */
   function getLCP() {
    var lcpType = 'largest-contentful-paint';
    var isSupport = checkSupportPerformanceObserver(lcpType);
    // 浏览器兼容判断
    if(!isSupport) {
      return;
    }
    var po = new PerformanceObserver(function(entryList) {
      var entries = entryList.getEntries();
      var lastEntry = entries[entries.length - 1];
      shin.lcp = {
        time: _rounded(lastEntry.renderTime || lastEntry.loadTime), // 取整
        url: lastEntry.url,
        element: lastEntry.element ? lastEntry.element.outerHTML : ''
      };
    });
    // buffered 为 true 表示调用 observe() 之前的也算进来
    po.observe({type: lcpType, buffered: true});
    /**
     * 当有按键或点击（包括滚动）时，就停止 LCP 的采样
     * once 参数是指事件被调用一次后就会被移除
     */
    ['keydown', 'click'].forEach((type) => {
      window.addEventListener(type, function() {
        // 断开此观察者的连接
        po.disconnect();
      }, { once: true, capture: true });
    });
  }
  getLCP();

  /**
   * 浏览器 FID 计算
   * FID（First Input Delay）用户第一次与页面交互到浏览器对交互作出响应的时间
   * https://developer.mozilla.org/en-US/docs/Glossary/First_input_delay
   */
  function getFID() {
    var fidType = 'first-input';
    var isSupport = checkSupportPerformanceObserver(fidType);
    // 浏览器兼容判断
    if(!isSupport) {
      return;
    }
    new PerformanceObserver(function(entryList, obs) {
      const firstInput = entryList.getEntries()[0];
      // 测量第一个输入事件的延迟
      shin.fid = _rounded(firstInput.processingStart - firstInput.startTime);
      /**
       * 测量第一个输入事件的持续时间
       * 仅在处理程序中同步完成重要事件处理工作时使用
       */
      // const firstInputDuration = firstInput.duration;
      // 获取本次事件目标的一些信息，比如id。
      // const targetId = firstInput.target ? firstInput.target.id : 'unknown-target';
      // 处理第一个输入延迟，也许还有它的持续时间
      // 断开此观察者的连接，因为回调仅触发一次
      obs.disconnect();
    }).observe({type: fidType, buffered: true});
  }
  getFID();
  /**
   * 监控页面奔溃情况
   * 计算首屏时间
   * 记录首屏图片的载入时间
   * 用户在没有滚动时候看到的内容渲染完成并且可以交互的时间
   */
  doc.addEventListener("DOMContentLoaded", function () {
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
     * 在初始HTML文档已完全加载和解析时触发（无需等待图像和iframe完成加载）
     * 紧跟在DOMInteractive之后。
     * https://www.dareboost.com/en/doc/website-speed-test/metrics/dom-content-loaded-dcl
     */
    api.domReadyTime = timing.domContentLoadedEventEnd - timing.fetchStart;
    
    /**
     * 白屏时间
     */
    var paint = performance.getEntriesByType('paint');
    if(paint && timing.entryType && paint[0]) {
      api.firstPaint = paint[0].startTime - timing.fetchStart;
      api.firstPaintStart = paint[0].startTime;   // 记录白屏时间点
    }else {
      api.firstPaint = timing.responseEnd - timing.fetchStart;
    }

    /**
     * FCP（First Contentful Paint）首次有实际内容渲染的时间
     */
    if (paint && timing.entryType && paint[1]) {
      api.firstContentfulPaint = paint[1].startTime - timing.fetchStart;
      api.firstContentfulPaintStart = paint[1].startTime;   // 记录白屏时间点
    } else {
      api.firstContentfulPaint = 0;
    }

    /**
     * 解析DOM树结构的时间
     * DOM中的所有脚本，包括具有async属性的脚本，都已执行。加载 DOM 中定义的所有页面静态资源（图像、iframe等）
     * LoadEventStart紧跟在Complete之后。 在大多数情况下，这2个指标是相等的。
     * 在加载事件开始之前可能引入的唯一额外延迟将由onReadyStateChange的处理引起。
     * https://www.dareboost.com/en/doc/website-speed-test/metrics/dom-complete
     */
    api.parseDomTime = timing.domComplete - timing.domInteractive;

    /**
     * 请求完毕至DOM加载耗时
     * 在加载DOM并执行网页的阻塞脚本时触发
     * 在这个阶段，具有defer属性的脚本还没有执行，某些样式表加载可能仍在处理并阻止页面呈现
     * https://www.dareboost.com/en/doc/website-speed-test/metrics/dom-interactive
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
     * 读取页面第一个字节的时间，包含重定向时间
     * TTFB 即 Time To First Byte 的意思
     * 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
     */
    api.TTFB = timing.responseStart - timing.redirectStart;

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
    obj.firstScreen = shin.lcp.time || shin.firstScreen || obj.domReadyTime;
    obj.timing.lcp = shin.lcp;  //记录LCP对象
    obj.timing.fid = shin.fid;  //记录FID对象
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
  var isNeedHideEvent = true;   // 是否需要触发隐藏事件
  window.addEventListener(eventName, function() {
    isNeedHideEvent && sendBeacon();
  }, false);
  // 在 load 事件中，上报性能参数
  window.addEventListener('load', function() {
    /**
     * 监控页面奔溃情况
     * 原先是在 DOMContentLoaded 事件内触发，经测试发现，当因为脚本错误出现白屏时，两个事件的触发时机会很接近
     * 在线上监控时发现会有一些误报，HTML是有内容的，那很可能是 DOMContentLoaded 触发时，页面内容还没渲染好
     */
    monitorCrash(shin.param);
    // 加定时器是避免在上报性能参数时，loadEventEnd 为 0，因为事件还没执行完毕
    setTimeout(function() {
      sendBeacon();
    }, 0);
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
    isNeedHideEvent = false;
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
  //  window.addEventListener(
  //   "load",
  //   function () {
  //     // 罗列资源列表，PerformanceResourceTiming类型
  //     var resources = performance.getEntriesByType("resource");
  //     // 映射initiatorType和错误类型
  //     var hashError = {
  //       script: ERROR_SCRIPT,
  //       link: ERROR_STYLE,
  //       // img: ERROR_IMAGE
  //     };
  //     resources && resources.forEach(function(value) {
  //       var type = hashError[value.initiatorType];
  //       /**
  //        * 非监控资源、响应时间在20秒内、监控资源是ma.gif或shin.js，则结束当前循环
  //        */
  //       if(!type ||                                   //非监控资源
  //         value.duration < 20000  ||                  //20秒内
  //         value.name.indexOf("ma.gif") >= 0 ||
  //         value.name.indexOf("shin.js") >= 0) {
  //         return;
  //       }
  //       // 若是CSS文件，则过滤脚本文件
  //       if(type === ERROR_STYLE && 
  //         value.name.indexOf(".js") >= 0) {
  //         return;
  //       }
  //       handleError({
  //         type: type,
  //         desc: handleNumber(value.toJSON()),
  //       });
  //     });
  //   },
  //   false
  // );
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
        // 过滤无效错误
        event.message && handleError(
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
      // desc: `${errorTarget.baseURI}@${errorTarget.src || errorTarget.href}`,
      desc: {
        url: errorTarget.baseURI,
        src: errorTarget.src || errorTarget.href
      }
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
      desc: {
        prompt: (message + ' at ' + filename + ':' + lineno + ':' + colno),
        url: location.href
      },
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
          // 为监控的响应头添加 req-id 字段
          var reqId = req.getResponseHeader('req-id');
          if(reqId) {
            req.ajax.header ? (req.ajax.header['req-id'] = reqId) : (req.ajax.header = { 'req-id':reqId });
          }
          req.ajax.interval = _rounded(end - start, 2) + "ms";   //单位毫秒
          req.ajax.network = shin.network();
          // 只记录6000个字符以内的响应限制，以便让MySQL表中的message字段能成功存储
          req.responseText.length <= 6000 && (req.ajax.response = req.responseText);
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
    // 设置请求首部
    var _setRequestHeader = req.setRequestHeader;
    req.setRequestHeader = function (header, value) {
      if(header === 'Authorization') {  // 监控身份状态
        req.ajax.header = {
          [header]: value
        }
      }
      return _setRequestHeader.apply(req, arguments);
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
      // 生成标识
      identity = Number(Math.random().toString().substring(3, 6) + Date.now()).toString(36);
      // 与自定义的身份字段合并，自定义字段在前，便于使用 ES 的前缀查询
      shin.param.identity && (identity = shin.param.identity + '-' + identity);
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
    // return encodeURIComponent(JSON.stringify(obj));
    return JSON.stringify(obj);
  }

  /**
   * 处理 React 错误（对外）
   */
  shin.reactError = function(err, info) {
    // console.log(typeof err, info);
    handleError({
      type: ERROR_REACT,
      desc: {
        prompt: err.toString(),
        url: location.href
      },
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
        desc: {
          prompt: err.toString(), // 描述
          url: location.href
        },
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
    // var ts = new Date().getTime().toString();
    // var img = new Image(0, 0);
    // img.src = shin.param.src + "?m=" + _paramify(data) + "&ts=" + ts;
    var m = _paramify(data);
    // 大于8000的长度，就不在上报，废弃掉
    if(m.length >= 8000) {
      return;
    }
    var body = { m: m };
    var record;
    // 当前是一条错误日志，并且描述的是奔溃
    if(data.category === ACTION_ERROR && data.data.type === ERROR_CRASH) {
      // 读取行为记录
      record = getRecentRecord();
      // 只有当有内容时，才发送行为记录
      record.length > 0 && (body.r = record);
    }
    // 如果修改headers，就会多一次OPTIONS预检请求
    fetch(shin.param.src, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      body: JSON.stringify(body),
    });
  };
  window.shin = shin;
})(this);
