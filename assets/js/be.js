(function(g) {
	/* global require:false, define:false, jQuery:false, importScripts:false */
	var hasRequire, hasJquery, hasImport, apiKey, get,
	basePath = "http://www.behance.net/v2/",
	toString = Object.prototype.toString,
	isFunc = function(fn) { return toString.call(fn) === "[object Function]"; };

	function cachebuster() {
		cachebuster.prefix = cachebuster.prefix || 0;
		return (cachebuster.prefix++) + String(Math.random()).slice(2);
	}

	function parameterize(data) {
		var k, p = [];
		for (k in data) if (data.hasOwnProperty(k)) {
			p.push(k + '=' + data[k]);
		}
		return p;
	}

	function path(ext, param) {
		param.api_key = apiKey;
		return basePath + ext + '?' + parameterize(param).join('&');
	}

	/**
	 * Promise implementation from https://github.com/timjansen/PinkySwear.js
	 */
	function pinkySwear() {
		/* jshint eqnull:true */
		var state; // undefined/null = pending, true = fulfilled, false = rejected
		var values = []; // an array of values as arguments for the then() handlers
		var deferred = []; // functions to call when set() is invoked

		var set = function promise(newState, newValues) {
			if (state == null) {
				state = newState;
				values = newValues;
				setTimeout(function() {
					for (var i = 0; i < deferred.length; i++)
					deferred[i]();
				}, 0);
			}
		};
		set.then = function(onFulfilled, onRejected) {
			var newPromise = pinkySwear();
			var callCallbacks = function() {
				try {
					var f = (state ? onFulfilled : onRejected);
					if (isFunc(f)) {
						var r = f.apply(null, values);
						if (r && isFunc(r.then))
							r.then(function(value){newPromise(true,[value]);}, function(value){newPromise(false,[value]);});
						else
							newPromise(true, [r]);
					}
					else
						newPromise(state, values);
				}
				catch (e) {
					newPromise(false, [e]);
				}
			};
			if (state != null)
				setTimeout(callCallbacks, 0);
			else
				deferred.push(callCallbacks);
			return newPromise;
		};
		return set;
	}

	// Find an API key from global variables
	if ("behance_api_key" in g) {
		apiKey = g.behance_api_key;
	}

	////////////
	// JS API //
	////////////

	/**
	 * @exports be
	 */
	var be = function be(api) {
		if (typeof api === "string") {
			apiKey = api || apiKey;
		}
		return be;
	};

	/**
	 * Get the information and content of a project.
	 *
	 * @param {number} id Project ID
	 * @param {function} callback
	 */
	be.project = function(id, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		var ext = "projects/" + id;
		return get(ext, callback);
	};

	/**
	 * Get comments for a project.
	 *
	 * @param {number} id Project ID
	 * @param {object=} param Request parameters
	 * @param {function} callback
	 */
	be.project.comments = function(id, param, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		var ext = "projects/" + id + "/comments";
		return get(ext, param, callback);
	};

	/**
	 * Search for a project.
	 *
	 * @param {string|object} param Search parameters
	 * @param {function} callback
	 */
	be.project.search = function(param, callback) {
		param = typeof param === "object" ?
			param :
			{q: param};
		var ext = "projects";
		return get(ext, param, callback);
	};

	be.wip = function(id, rev, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		if (isFunc(rev)) {
			callback = rev;
		}
		var ext = "wips/" + id;
		if ((rev|=0) && rev > 0) {
			ext += '/' + rev;
		}
		return get(ext, callback);
	};

	be.wip.search = function(param, callback) {
		param = typeof param === "object" ?
			param :
			{q: param};
		var ext = "wips";
		return get(ext, param, callback);
	};

	be.fields = function(callback) {
		var ext = "fields";
		return get(ext, callback);
	};

	be.follow = function(param, callback) {
		var ext = "creativestofollow";
		return get(ext, param, callback);
	};

	be.collection = function(id, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		var ext = "collections/" + id;
		return get(ext, callback);
	};

	be.collection.search = function(param, callback) {
		param = typeof param === "object" ?
			param :
			{q: param};
		var ext = "collections";
		return get(ext, param, callback);
	};

	be.collection.projects = function(id, param, callback) {
		if (!(id|=0)||id<0) throw "Invalid id";
		var ext = "collection/" + id + "/projects";
		return get(ext, param, callback);
	};

	be.user = function(id, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id;
		return get(ext, callback);
	};

	be.user.projects = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/projects";
		return get(ext, param, callback);
	};

	be.user.wips = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/wips";
		return get(ext, param, callback);
	};

	be.user.appreciations = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/appreciations";
		return get(ext, param, callback);
	};

	be.user.collections = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/collections";
		return get(ext, param, callback);
	};

	be.user.stats = function(id, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/stats";
		return get(ext, callback);
	};

	be.user.followers = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
		var ext = "users/" + id + "/followers";
		return get(ext, param, callback);
	};

	be.user.following = function(id, param, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
			var ext = "users/" + id + "/following";
		return get(ext, param, callback);
	};

	be.user.workExperience = function(id, callback) {
		if (!(typeof id === "number" ||
			  typeof id === "string")) { throw "Invalid id"; }
			var ext = "users/" + id + "/work_experience";
		return get(ext, callback);
	};

	be.user.search = function(param, callback) {
		param = typeof param === "object" ?
			param :
			{q: param};
		var ext = "users";
		return get(ext, param, callback);
	};

	//////////////////////////
	// JSONP Implementation //
	//////////////////////////

	// Check that dynamic require/define pair exists (mostly for almond)
	hasRequire = (
		typeof require !== "undefined" &&
		typeof define !=="undefined" &&
		isFunc(define) &&
		isFunc(require) &&
		isFunc(require.toUrl) &&
		require.toUrl(basePath) === basePath
	);

	// Check for jQuery for its .ajax() method
	hasJquery = (
		typeof jQuery !== "undefined" &&
		isFunc(jQuery) &&
		isFunc(jQuery.ajax)
	);

	// Check for Web Worker context
	hasImport = (
		typeof importScripts !== "undefined" &&
		isFunc(importScripts)
	);

	// Normalize our JSONP methods (ext, param, callback)
	get = function get(ext, param, callback) {
		// Memoize the actual implementation
		get.raw = get.raw || (function() {
			if (hasRequire) {
				return function(ext, param, accept, reject) {
					param.callback = "define";
					param._ = cachebuster();
					require([path(ext, param)], accept, reject);
				};
			}
			if (hasJquery) {
				return function(ext, param, accept, reject) {
					jQuery.ajax({
						url: path(ext, param),
						dataType: "jsonp",
            timeout: 7000,
						success: accept,
						error: reject
					});
				};
			}
			if (hasImport) {
				return function(ext, param, accept, reject) {
					param._ = cachebuster();
					param.callback = 'b' + param._;
					g[param.callback] = function() {
						try { accept.apply(g, arguments); }
						catch(e) { reject(e); }
						finally {
							g[param.callback] = undefined;
						}
					};
					try { importScripts(path(ext, param)); }
					catch(e) { reject(e); }
				};
			}

			// Native implementation
			var head = document.getElementsByTagName("head")[0];
			return function(ext, param, accept, reject) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				param._ = cachebuster();
				param.callback = 'b' + param._;
				g[param.callback] = function() {
					try { accept.apply(g, arguments); }
					catch(e) { reject(e); }
					finally {
						head.removeChild(script);
						g[param.callback] = undefined;
					}
				};
				script.src = path(ext, param);
				script.onerror = reject;
				head.appendChild(script);
			};
		}());

		if (isFunc(param) && !isFunc(callback)) {
			callback = param;
		}
		if (typeof param !== "object") {
			param = {};
		}
		var promise = pinkySwear(),
		accept = function() { promise(true, arguments); },
		reject = function() { promise(false, arguments); };
		promise.then(callback);
		get.raw(ext, param, accept, reject);
		return promise;
	};

	// AMD shim
	if (typeof define === "function" && define.amd) {
		/** @module be */
		define(be);
	}
	else if (typeof exports === "object") {
		module.exports = be;
	}
	else {
		g.be = be;
	}
}(this));
