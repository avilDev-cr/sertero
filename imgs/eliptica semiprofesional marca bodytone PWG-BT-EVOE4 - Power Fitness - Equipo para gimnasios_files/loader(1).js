(function () {
  document.currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();
  var allAttrs = document.currentScript.attributes;
  var cdnURL = allAttrs['data-cdn-url'] && allAttrs['data-cdn-url'].value;
  var widgetId = allAttrs['data-widget-id'] && allAttrs['data-widget-id'].value;
  var locationID = allAttrs['data-location-id'] && allAttrs['data-location-id'].value;
  if (!allAttrs['data-resources-url']) {
    var indexOfLastPath = document.currentScript.src.lastIndexOf('/');
    var sourceURL = document.currentScript.src.substring(0, indexOfLastPath);
    document.currentScript.setAttribute('data-resources-url', sourceURL + '/chat-widget/loader.js');
  }

  if (!cdnURL) {
    if (document.currentScript.src) {
      var lastPathIndex = document.currentScript.src.lastIndexOf('/');
      cdnURL = document.currentScript.src.substring(0, lastPathIndex);
    } else {
      cdnURL = window.location.origin;
    }
  }

  function loadScript(moduleScript, plainScript, gCaptchScript) {
    document.head.appendChild(moduleScript);
    document.head.appendChild(plainScript);
    document.head.appendChild(gCaptchScript);
  }

  function getConfigAndLoadWidget(chatWidgetElement, widgetId) {
    //fetch widget Config
    const serviceURL = chatWidgetElement.getAttribute('marketplace-u-r-l') || 'https://services.leadconnectorhq.com';
    fetch(`${serviceURL}/chat-widget/public/config/${widgetId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'widget-id': widgetId,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (!!data) {
          if (data.status && data.status !== 200) {
            throw new Error(data.message);
          }
          var chatWidgetconfig = data.config;
          for (var key in chatWidgetconfig) {
            if (chatWidgetconfig.hasOwnProperty(key)) {
              chatWidgetElement.setAttribute(key, chatWidgetconfig[key]);
            }
          }
          document.body.appendChild(chatWidgetElement);
        }
      })
      .catch(error => {
        console.error('Error: fail to load the chat-widget', error);
        //don load if we fail to fetch the data from server
        chatWidgetElement.remove();
        return;
      });
  }
  function loadWidget() {
    var moduleScript = document.createElement('script');
    moduleScript.type = 'module';
    moduleScript.src = cdnURL + `/chat-widget/chat-widget.esm.js?v=${new Date().getTime()}`;

    var plainScript = document.createElement('script');
    plainScript.noModule = true;

    plainScript.src = cdnURL + '/chat-widget/chat-widget.js';
    plainScript.setAttribute('data-resources-url', cdnURL + '/chat-widget/chat-widget.js');
    plainScript.setAttribute('data-stencil-namespace', cdnURL + 'chat-widget');

    var gCaptchScript = document.createElement('script');
    gCaptchScript.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    gCaptchScript.setAttribute('defer', '');
    gCaptchScript.setAttribute('async', '');

    var nonCustomElement = document.querySelector('div[data-chat-widget]');
    var chatWidgetElement = document.getElementsByTagName('chat-widget');

    if (nonCustomElement !== null && chatWidgetElement.length === 0) {
      allAttrs = nonCustomElement.attributes;
      locationID = allAttrs['data-location-id'];
      try {
        if (!!nonCustomElement.remove) nonCustomElement.remove();
        else nonCustomElement.parentNode.removeChild(nonCustomElement);
      } catch (error) {}
    }
    var textWidget = null;
    if (!!locationID || (chatWidgetElement.length === 0 && !nonCustomElement && !!widgetId)) {
      textWidget = document.createElement('chat-widget');
      for (var attrIndex = allAttrs.length - 1; attrIndex >= 0; attrIndex--) {
        var attributeName = allAttrs[attrIndex].name;
        var attributeValue = allAttrs[attrIndex].value;
        try {
          attributeName = attributeName.replace('data-', '');
        } catch (e) {
          console.log(e, 'Fail to load widget');
        }

        textWidget.setAttribute(attributeName, attributeValue);
      }
    }

    if (textWidget) {
      //there are two posible cases
      //1. new widget id based script code
      //2. old location id based script code, this is deprecated long back but still for backward compatibility

      var chatWidgetId = textWidget.getAttribute('widget-id');
      if (!!chatWidgetId) {
        getConfigAndLoadWidget(textWidget, chatWidgetId);
      } else {
        var widgetLocationID = textWidget.getAttribute('location-id');
        //ideally we shoulf throw not load widget if location id is missing
        if (!widgetLocationID) console.error('Error: location-id is missing');
        document.body.appendChild(textWidget);
      }
      loadScript(moduleScript, plainScript, gCaptchScript);
      return;
    }
    chatWidgetElement = document.getElementsByTagName('chat-widget');
    if (!chatWidgetElement || chatWidgetElement.length === 0) console.warn('chat-widget element not found');

    if (chatWidgetElement.length > 1) console.warn('Multiple chat-widget elements found.');

    loadScript(moduleScript, plainScript, gCaptchScript);
  }

  if (document.readyState !== 'loading') {
    setTimeout(function () {
      loadWidget();
    }, 0);
  } else {
    //somehow window.addEventListener not working with rocket loader
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(function () {
        loadWidget();
      }, 0);
    });
  }
})();
