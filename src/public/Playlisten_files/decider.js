var _fc_browser = bowser.getParser(window.navigator.userAgent);
var _fc_stage = window.location.href.startsWith('file://') || window.location.href.startsWith('http://') ? "local" : "prod";
var _fc_captchaScore = -1; // starts as unknown
var _fc_ge = false; // must be overridden by score call
var _fc_defaultstyle = `
.fc123-promoclass {
	background:#3717C7;
	padding:10px;
	text-align:center;
}
.fc123-promoclass * {
	font-family: 'Nunito', sans-serif;
	color: white;
}
.fc123-promoclass .fc123-button {
	background:rgb(255, 0, 70);
	display: inline-block;
	padding:10px 30px;
	border-radius:8px;
	font-weight:bold;
	transition: all 0.2s ease-in-out;
	cursor: pointer;
	margin-top: 10px;
}
.fc123-promoclass .fc123-button:hover {
	background:#357DED;
}
.fc123-promoclass h1 {
	font-size:2em;
	margin: 0;
}
.fc123-promoclass h2 {
	font-size:1.2em;
	margin: 0;
}

@media only screen and (max-width: 600px) {
	.fc123-promoclass h1 {
		font-size:1.25em;
	}	
	.fc123-promoclass .fc123-button {
		padding:5px 24px;
		border-radius: 4px;
		font-size: 0.9em;
	}
	.fc123-pr {
		text-align:center;
	}
	.fc123-promoclass h2 {
		font-size:0.9em;
	}
}
`;

function _fc_dlog(identifier) {
	console.log("Logging identifier:", identifier);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", 'https://v4s77pzm9j.execute-api.us-east-1.amazonaws.com/' + _fc_stage + '/impression', true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send(JSON.stringify({
		action: identifier,
		source: btoa(window.location.href),
		score: _fc_captchaScore,
	}));
}

function _fc_createlink(action, url) {
	var params = {
		action,
		url: btoa(url),
		source: btoa(window.location.href),
		score: _fc_captchaScore,
	};
	var queryString = Object.keys(params).map(function (key) {
		return key + '=' + params[key]
	}).join('&');

	return "https://v4s77pzm9j.execute-api.us-east-1.amazonaws.com/" + _fc_stage + "/click?" + queryString;
}

function _fc_showGeneric(elem) {
	var action = 'appadaynewsletter';

	var style = document.createElement('style');
	style.innerHTML = _fc_defaultstyle;
	document.head.appendChild(style);

	var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);

	var html = '<div class="fc123-promoclass" onclick="window.location.href=\''+_fc_createlink(action, "http://bit.ly/appadaynewsletter")+'\'">';
	html += '<h1>App-A-Day Newsletter</h1>';
	html += '<h2>Awesome free apps to your inbox daily.</h2>';
	html += '<div class="fc123-button">Subscribe now!</div>';
	html += '</div>';
	elem.innerHTML = html + elem.innerHTML;

	elem.style.display = 'block';

	_fc_dlog(action);
}

function _fc_showOurlist(elem) {
	var action = 'ourlist';

	var style = document.createElement('style');
	style.innerHTML = _fc_defaultstyle;
	document.head.appendChild(style);

	var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);

	var html = '<div class="fc123-promoclass" onclick="window.location.href=\''+_fc_createlink(action, "http://bit.ly/OurlistFC")+'\'">';
	html += '<h1>Get OurList for iOS</h1>';
	html += '<h2>Better lists. Perfect for sharing.</h2>';
	html += '<div class="fc123-button">Download FREE!</div>';
	html += '</div>';
	elem.innerHTML = html + elem.innerHTML;

	elem.style.display = 'block';

	_fc_dlog(action);
}

function _fc_showg(elem) {
	var html = '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7841493567155718" data-ad-slot="4671721417" data-ad-format="auto" data-full-width-responsive="true"></ins>'
	elem.style.display = 'block';
	elem.innerHTML = html + elem.innerHTML;
	(adsbygoogle = window.adsbygoogle || []).push({});
	_fc_dlog("g");
}

function _fc_getscore(token) {
	return new Promise((resolve, reject) => {

		var slug = null;
		try {
			slug = /:\/\/([^\/]+)/.exec(window.location.href)[1].split('.')[0];

			// it's a path-based domain
			if(slug == 'flycricket') {
				slug = window.location.pathname.split('/')[1];
			}

		} catch {}

		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'https://v4s77pzm9j.execute-api.us-east-1.amazonaws.com/' + _fc_stage + '/captcha', true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				try {
					var respObj = JSON.parse(xhr.response);
					_fc_captchaScore = respObj.score;
					_fc_ge = respObj.ge;
				} catch { }
				resolve(xhr.response);
			}
		}
		xhr.send(JSON.stringify({ token, slug }));
	});
}

window.addEventListener("load", function () {
	grecaptcha.ready(function () {
		grecaptcha.execute('6LcCjdIUAAAAABUwmc_osOtOJ5tBAY_uS6BeyrkB', { action: '/privacy' }).then(function (token) {
			_fc_getscore(token).then(() => {
				if(document.getElementById('preloader')) {
					document.getElementById('preloader').style.display = 'none';
				}

				var elem = document.getElementById('fc123-promo');
				if (elem) {

					if(_fc_captchaScore == 0.9 && _fc_ge) {
						return _fc_showg(elem)
					}

					else if (_fc_browser.getOSName(true) == "ios") {
						// show ourlist
						return _fc_showOurlist(elem);
						// } else if (_fc_browser.getOSName(true) == "android") {
						// 	// show another test
					} else {
						// get screen size and show mobile vs desktop
	
						// check if US
	
						return _fc_showGeneric(elem);
					}
				}	
			}).catch(() => {
				if(document.getElementById('preloader')) {
					document.getElementById('preloader').style.display = 'none';
				}
			});
		})
	});
});


