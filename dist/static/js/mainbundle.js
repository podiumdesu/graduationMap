/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "bde4ce1b8d2af90fdb2f"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(8)(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.finalData = exports.finalName = undefined;

var _processData = __webpack_require__(1);

var upload = document.getElementById('uploadXLSX'); /*
                                                     FileReader共有4种读取方法：
                                                     1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
                                                     2.readAsBinaryString(file)：将文件读取为二进制字符串
                                                     3.readAsDataURL(file)：将文件读取为Data URL
                                                     4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
                                                     */

var finalName = exports.finalName = undefined;
var finalWorkBook;
var finalWorkSheet;

function process_data(wb) {
    finalWorkBook = wb;
    var firstSheetName = wb.SheetNames[0];
    finalWorkSheet = wb.Sheets[firstSheetName];
    exports.finalName = finalName = finalWorkSheet['A1'].v;
    console.log("The name of the sheet is " + finalName);
    console.log("The data of the sheet is:");
    exports.finalData = finalData = XLSX.utils.sheet_to_json(finalWorkSheet, { header: ["name", "job", "school", "location"], range: 2 });
    console.log(finalData);
    (0, _processData.processData)();
}
function handleFile(e) {
    var f = e.target.files[0];
    var reader = new FileReader(); //读取文件
    var name = f.name;
    console.log(name + ' is being read!');
    reader.onload = function (e) {
        //alert("onload ok!");
        var data = e.target.result;
        //console.log(data);
        var wb = XLSX.read(data, { type: 'binary' });
        //console.log(wb);
        process_data(wb); //处理数据
    };
    reader.readAsBinaryString(f);
}
if (upload.addEventListener) {
    upload.addEventListener('change', handleFile, false);
}

var finalData = exports.finalData = undefined;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isSameProvince = exports.allProvince = exports.jobStatistic = undefined;
exports.processData = processData;
exports.getAllGraduatorData = getAllGraduatorData;
exports.getAllTeacherData = getAllTeacherData;
exports.getAllOtherData = getAllOtherData;

var _importXLSX = __webpack_require__(0);

var _renderData = __webpack_require__(7);

var _renderData2 = _interopRequireDefault(_renderData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//用于获取所有录取学校的省份
/* locationOfSchool =
 */

//获取非老师、非毕业、毕业学生的数组序号
/* jobStatistic = {
    teacher: [1,2],
    graduation: [5,6,7],
    other: [4]
}
 */
//将在同一个省份的学生放进一个数组
/* inSameProvince = [
    {
        name: "shanghai",
        student: [];
     }
]*/

function processData() {
    var allData = _importXLSX.finalData.concat();
    allData.forEach(pushJobStatistic);
    //只获取毕业生（非出国）的省份
    var graduatorData = allData.filter(getAllGraduatorData);
    console.log("下面是毕业生的信息");
    console.log(graduatorData);
    graduatorData.forEach(getAllGraduatorProvince);
    console.log("所有的省份为：" + allProvince);
    allData.forEach(pushSameProvince);
    console.log("同一个省份的学生的编号");
    console.log(isSameProvince);
    console.log("老师的编号" + jobStatistic.teacher);
    console.log("毕业生的编号" + jobStatistic.graduator);
    console.log("其他学生的编号" + jobStatistic.other);
    (0, _renderData2.default)();
};
var jobStatistic = exports.jobStatistic = {
    teacher: [],
    graduator: [],
    other: []
};
function pushJobStatistic(element, index) {
    switch (element.job) {
        case "教师":
            jobStatistic.teacher.push(index);
            break;
        case "毕业":
            jobStatistic.graduator.push(index);
            break;
        default:
            jobStatistic.other.push(index);
    }
}

var allProvince = exports.allProvince = [];
var isSameProvince = exports.isSameProvince = [];

function getAllGraduatorProvince(element, index) {
    var newProvinceData = {};
    if (allProvince.indexOf(element.location) < 0) {
        allProvince.push(element.location);
        newProvinceData.name = element.location;
        newProvinceData.graduator = [];
        isSameProvince.push(newProvinceData);
    }
}
/*
module.exports = {
    getAllGraduatorData: getAllGraduatorData,
    getAllTeacherData: getAllTeacherData,
    getAllOtherData: getAllOtherData,

}
*/

function getAllGraduatorData(element, index) {
    return jobStatistic.graduator.indexOf(index) >= 0;
}
function getAllTeacherData(element, index) {
    return jobStatistic.teacher.indexOf(index) >= 0;
}
function getAllOtherData(element, index) {
    return jobStatistic.other.indexOf(index) >= 0;
}

function pushSameProvince(element, index) {
    //获得的是所有人的数据
    if (jobStatistic.graduator.indexOf(index) >= 0) {
        var length = isSameProvince.length;
        for (var i = 0; i < length; i++) {
            if (element.location === isSameProvince[i].name) {
                isSameProvince[i].graduator.push(index);
            }
        }
    }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "h4 {\n    text-align: center;\n}\n#map-title-container  {\n    text-align: center;\n    position: absolute;\n    top: 0;\n    margin: 0;\n    padding: 0;\n    width: 100%;\n}\n\n#map-title-container > h2 {\n    padding: 20px 0px;\n    margin-top: 0px;\n    font-size: 2rem;\n}\n#map-title {\n    margin: 0px;\n}\n\n#map-part {\n\n    width: 1100px;\n    position: relative;\n    margin: 0 auto;\n    border: 1px dashed darkcyan;\n    transition: all ease 0.5s;\n    margin-top:5px;\n}\n\n.toHide {\n    display: none;\n\n}\n\n.display-style {\n    width: 130px;\n    border: 1px solid black;\n    padding: 10px 5px;\n    font-size: 11px;\n    user-select: none;\n}\n\n.teacher-data-style {\n    position: absolute;\n    top: 10px;\n    left:10px;\n}\n.no-margin {\n    margin: 0px 0px 0px 0px;\n    padding-top: 3px;\n}\n\n.other-data-style {\n    position: absolute;\n    bottom: 10px;\n    left: 10px;\n\n}\n\n.student-data-style {\n    width: 130px;\n    position: absolute;\n    z-index: 2;\n    cursor: move;\n    top: 0px;\n    right: 0px;\n    border: 0px;\n    background-color: rgba(254,247,237,1);\n    border-top: 1px solid black;\n\n}\np.location-title {\n    z-index: 100;\n    left: 0px;\n    top: 5px;\n    padding-bottom: 5px;\n    font-weight: 600;\n    margin: 0px;\n}\n#display-visitors {\n    position: fixed;\n    width: 100%;\n    margin-top: 5px;\n}\n#display-visitors p{\n    margin: 0;\n    display: inline-block;\n}\n#display-visitors p  a{\n    text-decoration: none;\n    color: 0;\n}\n#display-visitors div {\n    margin-left: auto;\n    margin-right: auto;\n    width: 40%;\n    text-align: center;\n}\n\n#busuanzi_value_site_uv {\n    -webkit-animation: ddd 1.33s ease-in-out infinite;\n    animation: ddd 1.33s ease-in-out infinite;\n    color: lightpink;\n}\n.my-face {\n    -webkit-animation: move 5s infinite ease-in-out;\n    animation: move 5s infinite ease-in-out;\n    display: inline-block;\n    margin: 0 5px;\n    color: hotpink;\n}\n@keyframes ddd {\n    0% {\n        -webkit-transform: scale(1);\n        transform: scale(1);\n    }\n    50% {\n        -webkit-transform: scale(.8);\n        transform: scale(.8);\n    }\n    100% {\n        -webkit-transform: scale(1);\n        transform: scale(1);\n    }\n}\n@keyframes move {\n    2% {\n        -webkit-transform: translateY(1.5px) rotate(1.5deg);\n        transform: translateY(1.5px) rotate(1.5deg);\n    }\n\n    4% {\n        -webkit-transform: translateY(-1.5px) rotate(-.5deg);\n        transform: translateY(-1.5px) rotate(-.5deg);\n    }\n    6% {\n        -webkit-transform: translateY(1.5px) rotate(-1.5deg);\n        transform: translateY(1.5px) rotate(-1.5deg);\n    }\n    8% {\n        -webkit-transform: translateY(-1.5px) rotate(-1.5deg);\n        transform: translateY(-1.5px) rotate(-1.5deg);\n    }\n    10% {\n        -webkit-transform: translateY(2.5px) rotate(1.5deg);\n        transform: translateY(2.5px) rotate(1.5deg);\n    }\n    12% {\n        -webkit-transform: translateY(-.5px) rotate(1.5deg);\n        transform: translateY(-.5px) rotate(1.5deg);\n    }\n    14% {\n        -webkit-transform: translateY(-1.5px) rotate(1.5deg);\n        transform: translateY(-1.5px) rotate(1.5deg);\n    }\n    16% {\n        -webkit-transform: translateY(-.5px) rotate(-1.5deg);\n        transform: translateY(-.5px) rotate(-1.5deg);\n    }\n    18% {\n        -webkit-transform: translateY(.5px) rotate(-1.5deg);\n        transform: translateY(.5px) rotate(-1.5deg);\n    }\n    20% {\n        -webkit-transform: translateY(-1.5px) rotate(2.5deg);\n        transform: translateY(-1.5px) rotate(2.5deg);\n    }\n    22% {\n        -webkit-transform: translateY(.5px) rotate(-1.5deg);\n        transform: translateY(.5px) rotate(-1.5deg);\n    }\n    24% {\n        -webkit-transform: translateY(1.5px) rotate(1.5deg);\n        transform: translateY(1.5px) rotate(1.5deg);\n    }\n    26% {\n        -webkit-transform: translateY(.5px) rotate(.5deg);\n        transform: translateY(.5px) rotate(.5deg);\n    }\n    28% {\n        -webkit-transform: translateY(.5px) rotate(1.5deg);\n        transform: translateY(.5px) rotate(1.5deg);\n    }\n    30% {\n        -webkit-transform: translateY(-.5px) rotate(2.5deg);\n        transform: translateY(-.5px) rotate(2.5deg);\n    }\n    32% {\n        -webkit-transform: translateY(1.5px) rotate(-.5deg);\n        transform: translateY(1.5px) rotate(-.5deg);\n    }\n    34% {\n        -webkit-transform: translateY(1.5px) rotate(-.5deg);\n        transform: translateY(1.5px) rotate(-.5deg);\n    }\n    36% {\n        -webkit-transform: translateY(-1.5px) rotate(2.5deg);\n        transform: translateY(-1.5px) rotate(2.5deg);\n    }\n    38% {\n        -webkit-transform: translateY(1.5px) rotate(-1.5deg);\n        transform: translateY(1.5px) rotate(-1.5deg);\n    }\n    40% {\n        -webkit-transform: translateY(-.5px) rotate(2.5deg);\n        transform: translateY(-.5px) rotate(2.5deg);\n    }\n    42% {\n        -webkit-transform: translateY(2.5px) rotate(-1.5deg);\n        transform: translateY(2.5px) rotate(-1.5deg);\n    }\n    44% {\n        -webkit-transform: translateY(1.5px) rotate(.5deg);\n        transform: translateY(1.5px) rotate(.5deg);\n    }\n    46% {\n        -webkit-transform: translateY(-1.5px) rotate(2.5deg);\n        transform: translateY(-1.5px) rotate(2.5deg);\n    }\n    48% {\n        -webkit-transform: translateY(-.5px) rotate(.5deg);\n        transform: translateY(-.5px) rotate(.5deg);\n    }\n    50% {\n        -webkit-transform: translateY(.5px) rotate(.5deg);\n        transform: translateY(.5px) rotate(.5deg);\n    }\n    52% {\n        -webkit-transform: translateY(2.5px) rotate(2.5deg);\n        transform: translateY(2.5px) rotate(2.5deg);\n    }\n    54% {\n        -webkit-transform: translateY(-1.5px) rotate(1.5deg);\n        transform: translateY(-1.5px) rotate(1.5deg);\n    }\n    56% {\n        -webkit-transform: translateY(2.5px) rotate(2.5deg);\n        transform: translateY(2.5px) rotate(2.5deg);\n    }\n    58% {\n        -webkit-transform: translateY(.5px) rotate(2.5deg);\n        transform: translateY(.5px) rotate(2.5deg);\n    }\n    60% {\n        -webkit-transform: translateY(2.5px) rotate(2.5deg);\n        transform: translateY(2.5px) rotate(2.5deg);\n    }\n    62% {\n        -webkit-transform: translateY(-.5px) rotate(2.5deg);\n        transform: translateY(-.5px) rotate(2.5deg);\n    }\n    64% {\n        -webkit-transform: translateY(-.5px) rotate(1.5deg);\n        transform: translateY(-.5px) rotate(1.5deg);\n    }\n    66% {\n        -webkit-transform: translateY(1.5px) rotate(-.5deg);\n        transform: translateY(1.5px) rotate(-.5deg);\n    }\n    68% {\n        -webkit-transform: translateY(-1.5px) rotate(-.5deg);\n        transform: translateY(-1.5px) rotate(-.5deg);\n    }\n    70% {\n        -webkit-transform: translateY(1.5px) rotate(.5deg);\n        transform: translateY(1.5px) rotate(.5deg);\n    }\n    72% {\n        -webkit-transform: translateY(2.5px) rotate(1.5deg);\n        transform: translateY(2.5px) rotate(1.5deg);\n    }\n    74% {\n        -webkit-transform: translateY(-.5px) rotate(.5deg);\n        transform: translateY(-.5px) rotate(.5deg);\n    }\n    76% {\n        -webkit-transform: translateY(-.5px) rotate(2.5deg);\n        transform: translateY(-.5px) rotate(2.5deg);\n    }\n    78% {\n        -webkit-transform: translateY(-.5px) rotate(1.5deg);\n        transform: translateY(-.5px) rotate(1.5deg);\n    }\n    80% {\n        -webkit-transform: translateY(1.5px) rotate(1.5deg);\n        transform: translateY(1.5px) rotate(1.5deg);\n    }\n    82% {\n        -webkit-transform: translateY(-.5px) rotate(.5deg);\n        transform: translateY(-.5px) rotate(.5deg);\n    }\n    84% {\n        -webkit-transform: translateY(1.5px) rotate(2.5deg);\n        transform: translateY(1.5px) rotate(2.5deg);\n    }\n    86% {\n        -webkit-transform: translateY(-1.5px) rotate(-1.5deg);\n        transform: translateY(-1.5px) rotate(-1.5deg);\n    }\n    88% {\n        -webkit-transform: translateY(-.5px) rotate(2.5deg);\n        transform: translateY(-.5px) rotate(2.5deg);\n    }\n    90% {\n        -webkit-transform: translateY(2.5px) rotate(-.5deg);\n        transform: translateY(2.5px) rotate(-.5deg);\n    }\n    92% {\n        -webkit-transform: translateY(.5px) rotate(-.5deg);\n        transform: translateY(.5px) rotate(-.5deg);\n    }\n    94% {\n        -webkit-transform: translateY(2.5px) rotate(.5deg);\n        transform: translateY(2.5px) rotate(.5deg);\n    }\n    96% {\n        -webkit-transform: translateY(-.5px) rotate(1.5deg);\n        transform: translateY(-.5px) rotate(1.5deg);\n    }\n    98% {\n        -webkit-transform: translateY(-1.5px) rotate(-.5deg);\n        transform: translateY(-1.5px) rotate(-.5deg);\n    }\n\n    0%, 100% {\n        -webkit-transform: translate(0) rotate(0deg);\n        transform: translate(0) rotate(0deg);\n    }\n}", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(14);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "#xlsxstandard-img {\n    width: 90%;\n}\n\n#xlsx-standard {\n    text-align: center;\n    width:100%;\n    margin: 0 auto;\n\n}\n\n#xlsx-standard {\n    position: absolute;\n    top:0;\n    margin: 0 auto;\n}\n\n#standard-border {\n    width: 50%;\n    background-color: darkcyan;\n    margin: 0 auto;\n    margin-top: 10%;\n}\n\n#standard-border > div {\n    border: 15px solid darkcyan;\n    background-color: white;\n    border-bottom-right-radius: 30px;\n    border-top-left-radius: 30px;\n    position: relative;\n\n}\n#standard-discription {\n    margin-top: 10px;\n    margin-left: 5%;\n    margin-right: 5%;\n    text-align: left;\n}\n#xlsx-standard {\n    z-index: 200;\n}\n\n#closeStandard {\n    position: absolute;\n    top: 5%;\n    background-color: darkcyan;\n    right: 3%;\n    color: white;\n    font-size: 20px;\n    padding: 0px 10px;\n    border-radius: 21px;\n    text-align: center;\n    cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "#btn-container {\n    width: 1100px;\n    margin: 0 auto;\n    min-width: 400px;\n}\n\n#svg-container {\n    display: inline-block;\n}\n\n\n#showStandard {\n    font-size: 12px;\n    cursor: pointer;\n    color: rgba(0,0,0,0.5);\n    transition: all ease 1s;\n}\n\n#showStandard:hover {\n    color:  rgba(0,0,0,1);\n}\n\n#uploadXLSX {\n    padding: 10px 0 5px 0;\n    font-size: 15px;\n    margin: 0px;\n}\n\n#downloadPic {\n    border-radius: 20px;\n    padding: 5px 20px;\n    margin: 10px 0;\n    float: right;\n    transition: all ease .5s;\n    background-color: white;\n    border: 1px solid darkcyan;\n    color: darkcyan;\n}\n#downloadPic:hover {\n    background: darkcyan;\n    border: 1px solid darkcyan;\n    color: white;\n}\n#addString {\n    background: white;\n    color: darkcyan;\n    border: 1px solid darkcyan;\n    border-radius: 20px;\n    padding: 5px 20px;\n    float: right;\n    margin: 10px 10px;\n    transition: all ease .5s;\n}\n\n#addString:hover {\n    background-color: darkcyan;\n    color: white;\n}", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var targetNode = $("#map-part");
    console.log("This is render()");

    var otherData = _importXLSX.finalData.filter(_processData.getAllOtherData);
    var titleDiv = document.createElement("div");
    var titleH2 = document.createElement("h2");
    titleDiv.appendChild(titleH2);
    titleDiv.setAttribute("id", "map-title-container");
    titleH2.setAttribute("id", "map-title");
    targetNode.append(titleDiv);
    $("#map-title").html(_importXLSX.finalName);
    targetNode.append(renderTeacher(_importXLSX.finalData));
    targetNode.append(renderOther(_importXLSX.finalData));

    _processData.isSameProvince.forEach(renderGraduator);
    //console.log(graduatorData);
    //console.log(teacherData);
    console.log(otherData);

    function g(el) {
        return document.getElementsByClassName(el);
    }
    var icons = g('student-data-style');
    var instace = false; //存放当前移动对象信息
    for (var i = 0; i < icons.length; i++) {
        if (icons[i]) {
            icons[i].addEventListener('mousedown', function (e) {
                instace = {};
                var e = e || window.event;
                var el = e.toElement || e.target;
                console.log(e);
                instace.moveElement = el;
                //  获取鼠标的坐标
                var mouseX = e.pageX;
                var mouseY = e.pageY;
                //  获取元素左上角的坐标
                var elX = el.offsetLeft;
                var elY = el.offsetTop;
                //  计算出偏移量
                instace.offSetX = mouseX - elX;
                instace.offSetY = mouseY - elY;
                instace.moveElement.style.zIndex = 100;
            });
        }
    }
    document.onmouseup = function (e) {
        instace.moveElement.style.zIndex = 2;
        instace = false;
    };
    document.onmousemove = function (e) {
        if (instace) {
            //  获取当前鼠标坐标
            var mouseX = e.pageX;
            var mouseY = e.pageY;
            //  计算元素移动坐标
            var moveX = mouseX - instace.offSetX;
            var moveY = mouseY - instace.offSetY;
            //  计算最大移动坐标
            var maxX = document.documentElement.clientWidth - instace.moveElement.offsetWidth;
            var maxY = document.documentElement.clientHeight - instace.moveElement.offsetHeight;
            //  设置元素的坐标
            instace.moveElement.style.left = Math.max(0, Math.min(maxX, moveX)) + 'px';
            instace.moveElement.style.top = Math.max(0, Math.min(maxY, moveY)) + 'px';
        }
    };
};

var _processData = __webpack_require__(1);

var _importXLSX = __webpack_require__(0);

/*inSameProvince = [
{
    name:"shanghai",
    student:[],
}
*/
function renderGraduator(element) {
    var targetNode = $("#map-part");
    var divToInsert = document.createElement("div");
    var titleContainer = document.createElement("p");
    divToInsert.appendChild(titleContainer);
    titleContainer.className += 'location-title';
    var titleToInsert = document.createTextNode(element.name);
    titleContainer.append(titleToInsert);
    var studentNum = element.graduator.length;
    var studentInSameProvinceData = [];
    console.log("dddd" + studentNum);
    for (var i = 0; i < studentNum; i++) {
        studentInSameProvinceData.push(_importXLSX.finalData[element.graduator[i]]);
    }
    console.log(studentInSameProvinceData);
    renderProvinceData(studentInSameProvinceData, divToInsert);
    // element.graduator.forEach(renderListData);
    targetNode.append(divToInsert);
}

function renderProvinceData(studentData, divToInsert) {
    //将渲染出来的数据都append进div中
    divToInsert.className += ' display-style';
    divToInsert.className += ' student-data-style ';
    divToInsert.setAttribute("location", studentData[0].location);
    studentData.forEach(function (element) {
        var stringToInsert = document.createElement("p");
        stringToInsert.className += ' no-margin ';
        if (element.name.length === 2) {
            stringToInsert.innerHTML = element.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + element.school;
        } else {
            stringToInsert.innerHTML = element.name + '&nbsp;&nbsp;' + element.school;
        }
        divToInsert.appendChild(stringToInsert);
    });
    return divToInsert;
    /*    var teacherDiv = document.createElement("div");
        teacherDiv.setAttribute('city','teacher');
    
        teacherDiv.className += ' display-style ';
        teacherDiv.className += ' teacher-data-style ';
        teacherData.forEach(function(element) {
            var stringToInsert = document.createElement("p");
            stringToInsert.className += ' no-margin ';
            if (element.name.length === 2) {
                var textToInsert = document.createTextNode(element.name+'  '+element.school);
            } else {
                var textToInsert = document.createTextNode(element.name+'   '+element.school);
            }
            stringToInsert.appendChild(textToInsert);
            teacherDiv.appendChild(stringToInsert);
        });
        return teacherDiv;
        */
}

function renderListData(element) {
    var stringToInsert = document.createElement("p");
    var studentNum = element.length;
    var studentInSameProvinceData = [];
    for (var i = 0; i < studentNum; i++) {
        studentInSameProvinceData.push(_importXLSX.finalData[element[i]]);
    }

    // var textToInsert = document.createTextNode(element.name+' '+element.school);
}

function renderTeacher(finalData) {
    var teacherData = finalData.filter(_processData.getAllTeacherData);
    var teacherDiv = document.createElement("div");
    teacherDiv.setAttribute('city', 'teacher');

    teacherDiv.className += ' display-style ';
    teacherDiv.className += ' teacher-data-style ';
    teacherData.forEach(function (element) {
        var stringToInsert = document.createElement("p");
        stringToInsert.className += ' no-margin ';
        if (element.name.length === 2) {
            stringToInsert.innerHTML = element.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + element.school;
        } else {
            stringToInsert.innerHTML = element.name + '&nbsp;&nbsp;' + element.school;
        }
        teacherDiv.appendChild(stringToInsert);
    });
    return teacherDiv;
}

function renderOther(finalData) {
    var otherData = finalData.filter(_processData.getAllOtherData);
    var otherDiv = document.createElement("div");
    otherDiv.setAttribute('city', 'other');

    otherDiv.className += ' display-style ';
    otherDiv.className += ' other-data-style';
    otherData.forEach(function (element) {
        var stringToInsert = document.createElement('p');
        stringToInsert.className += ' no-margin ';
        if (element.name.length === 2) {
            stringToInsert.innerHTML = element.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + element.school;
        } else {
            stringToInsert.innerHTML = element.name + '&nbsp;&nbsp;' + element.school;
        }
        otherDiv.appendChild(stringToInsert);
    });
    return otherDiv;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//entry.js

console.log("hello,world!");
__webpack_require__(0);

__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(7);
__webpack_require__(13);
__webpack_require__(15);
__webpack_require__(16);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    console.log("pddddafqer");
    console.log("ddd" + _processData.allProvince);
    console.log(_processData.allProvince);
    console.log(_processData.jobStatistic.graduator);
};

var _processData = __webpack_require__(1);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(11);
$(document).mouseup(function (e) {
    var _area = $("#xlsx-standard");
    if (!_area.is(e.target) && _area.has(e.target).length === 0) {

        $("#xlsx-standard").fadeOut();
        $("#map-part").removeAttr("style", "filter:blur(10px)");
    }
});

$("#closeStandard").click(function () {
    $("#xlsx-standard").fadeOut();
    $("#map-part").removeAttr("style", "filter:blur(10px)");
});

$("#showStandard").click(function () {
    $("#xlsx-standard").fadeIn(1000);
    $("#map-part").attr("style", "filter:blur(10px)");
});

$("#addString").click(function () {
    var locationFrom = {
        "上海": [975, 528],
        "湖北": [824, 535],
        "北京": [882, 351],
        "天津": [882, 351],
        "新疆": [429, 300],
        "内蒙古": [784, 326],
        "黑龙江": [1041, 230],
        "吉林": [1041, 230],
        "辽宁": [995, 310],
        "河北": [882, 351],
        "陕西": [765, 460],
        "甘肃": [689, 437],
        "青海": [587, 422],
        "西藏": [418, 498],
        "山东": [914, 430],
        "四川": [654, 549],
        "山西": [834, 470],
        "江苏": [962, 487],
        "浙江": [962, 550],
        "福建": [962, 616],
        "广东": [852, 704],
        "广西": [768, 683],
        "云南": [617, 661],
        "海南": [794, 783],
        "台湾": [997, 676],
        "湖南": [815, 608],
        "安徽": [901, 512],
        "重庆": [741, 555],
        "贵州": [727, 618],
        "江西": [882, 616]
    };
    //var nowNode = $("#")
    var icons = $(".student-data-style");
    var svgNode = $("#svg-data");
    //console.log(icons);
    var svgDocument = svgNode[0].contentDocument;
    var paths = svgDocument.getElementById('path');
    //console.log(paths);
    while (paths) {
        var parent = paths.parentNode;
        parent.removeChild(paths);
        paths = svgDocument.getElementById('path');
    }
    //console.log(icons[0]);
    for (var i = 0; i < icons.length; ++i) {
        var location = $(icons[i]).attr('location');
        if (!(location in locationFrom)) continue;
        var width = locationFrom[location][0];
        var height = locationFrom[location][1];
        var pl = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        var pl2 = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        var left = $(icons[i]).css("left"),
            top = $(icons[i]).css("top");
        var X = parseInt(left.substr(0, left.length - 2)) / 0.7625,
            Y = (parseInt(top.substr(0, top.length - 2)) + $(icons[i]).height() / 2) / 0.7625;
        //console.log($(icons[i]).css("left"));
        //console.log(X, Y);
        if (X > width) {
            pl.attr('stroke', 'black');
            pl.attr('d', 'M' + width + ' ' + height + ',' + (X - 40) + ' ' + Y + ' Z');
            pl.attr('fill', 'none');
            pl.attr('id', 'path');
            pl.attr('stroke-width', '1');
            pl2.attr('stroke', 'black');
            pl2.attr('d', 'M' + (X - 40) + ' ' + Y + ',' + X + ' ' + Y + ' Z');
            pl2.attr('fill', 'none');
            pl2.attr('id', 'path');
            pl2.attr('stroke-width', '1');
        } else {
            pl.attr('stroke', 'black');
            pl.attr('d', 'M' + width + ' ' + height + ',' + (X + $(icons[i]).width() / 0.7625 + 40) + ' ' + Y + ' Z');
            pl.attr('fill', 'none');
            pl.attr('id', 'path');
            pl.attr('stroke-width', '1');
            pl2.attr('stroke', 'black');
            pl2.attr('d', 'M' + (X + $(icons[i]).width() / 0.7625 + 40) + ' ' + Y + ',' + X + ' ' + Y + ' Z');
            pl2.attr('fill', 'none');
            pl2.attr('id', 'path');
            pl2.attr('stroke-width', '1');
        }

        svgDocument.rootElement.appendChild(pl.get(0));
        svgDocument.rootElement.appendChild(pl2.get(0));
    }
});

$(function () {
    $("#downloadPic").click(function () {
        /*var svgImage = $('#svg-data')[0].contentDocument.childNodes[0];
        var str = (new XMLSerializer()).serializeToString(svgImage);
        str = str.replace(/xmlns=\"http:\/\/www\.w3\.org\/1999\/svg\"/, '');
        var $canvas = $('<canvas/>');
        $canvas.width($('#svg-data').width());
        $canvas.height($('#svg-data').height());
        $canvas[0].getcontext("2d").fillStyle = '#fff';
        $canvas[0].getcontext("2d").fillRect(0,0);
        $canvas.appendTo("#map-part");
        canvg($canvas.get(0), str); // convert SVG to canvas
        $('#svg-data').hide();
        $canvas.onload = function () {
            html2canvas($("#map-part"), {
                onrendered: function (canvas) {
                    var a = document.createElement('a');
                    a.href = canvas.toDataURL();
                    a.download = 'test2.png';
                    a.click();
                    $canvas.remove();
                }
            })
        };*/
        var svgObj = $("#svg-data");
        var svgString = new XMLSerializer().serializeToString(svgObj[0].contentDocument.childNodes[0]);
        var DOMURL = self.URL || self.webkitURL || self;
        var canvas2 = document.createElement("canvas");
        canvas2.setAttribute("class", "previewPic");
        canvas2.height = $(svgObj).height();
        canvas2.width = $(svgObj).width();
        var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        var url = DOMURL.createObjectURL(svg);
        var ctx = canvas2.getContext("2d");

        var img = new Image();

        img.onload = function () {
            ctx.drawImage(img, 0, 0);

            html2canvas($("#map-part"), {
                onrendered: function onrendered(canvas) {
                    //document.body.appendChild(canvas);
                    $(svgObj).show();
                    $(canvas2).remove();
                    var a = document.createElement('a');
                    a.href = canvas.toDataURL();
                    a.download = '毕业流向图.png';
                    a.click();
                    // Convert and download as image
                    //Canvas2Image.saveAsPNG(canvas);
                    //$("#img-out").append(canvas);
                    // Clean up
                    //document.getElementById('img-out').removeChild(canvas);
                }
                //height:canvas2.height,
                //width:canvas2.width,
            });
        };

        img.src = url;

        $(canvas2).insertAfter(svgObj);
        console.log(svgObj);
        $(svgObj).hide();
        //document.body.appendChild(canvas2);*/
    });
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
  html2canvas 0.5.0-beta3 <http://html2canvas.hertzen.com>
  Copyright (c) 2016 Niklas von Hertzen

  Released under  License
*/
!function (e) {
  if ("object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {
    var n;"undefined" != typeof window ? n = window : "undefined" != typeof global ? n = global : "undefined" != typeof self && (n = self), n.html2canvas = e();
  }
}(function () {
  var e;return function n(e, f, o) {
    function d(t, l) {
      if (!f[t]) {
        if (!e[t]) {
          var s = "function" == typeof require && require;if (!l && s) return require(t, !0);if (i) return i(t, !0);var u = new Error("Cannot find module '" + t + "'");throw u.code = "MODULE_NOT_FOUND", u;
        }var a = f[t] = { exports: {} };e[t][0].call(a.exports, function (n) {
          var f = e[t][1][n];return d(f ? f : n);
        }, a, a.exports, n, e, f, o);
      }return f[t].exports;
    }for (var i = "function" == typeof require && require, t = 0; t < o.length; t++) {
      d(o[t]);
    }return d;
  }({ 1: [function (n, f, o) {
      (function (n) {
        !function (d) {
          function i(e) {
            throw RangeError(I[e]);
          }function t(e, n) {
            for (var f = e.length; f--;) {
              e[f] = n(e[f]);
            }return e;
          }function l(e, n) {
            return t(e.split(H), n).join(".");
          }function s(e) {
            for (var n, f, o = [], d = 0, i = e.length; i > d;) {
              n = e.charCodeAt(d++), n >= 55296 && 56319 >= n && i > d ? (f = e.charCodeAt(d++), 56320 == (64512 & f) ? o.push(((1023 & n) << 10) + (1023 & f) + 65536) : (o.push(n), d--)) : o.push(n);
            }return o;
          }function u(e) {
            return t(e, function (e) {
              var n = "";return e > 65535 && (e -= 65536, n += L(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), n += L(e);
            }).join("");
          }function a(e) {
            return 10 > e - 48 ? e - 22 : 26 > e - 65 ? e - 65 : 26 > e - 97 ? e - 97 : k;
          }function p(e, n) {
            return e + 22 + 75 * (26 > e) - ((0 != n) << 5);
          }function c(e, n, f) {
            var o = 0;for (e = f ? K(e / B) : e >> 1, e += K(e / n); e > J * z >> 1; o += k) {
              e = K(e / J);
            }return K(o + (J + 1) * e / (e + A));
          }function y(e) {
            var n,
                f,
                o,
                d,
                t,
                l,
                s,
                p,
                y,
                m,
                r = [],
                v = e.length,
                w = 0,
                b = D,
                g = C;for (f = e.lastIndexOf(E), 0 > f && (f = 0), o = 0; f > o; ++o) {
              e.charCodeAt(o) >= 128 && i("not-basic"), r.push(e.charCodeAt(o));
            }for (d = f > 0 ? f + 1 : 0; v > d;) {
              for (t = w, l = 1, s = k; d >= v && i("invalid-input"), p = a(e.charCodeAt(d++)), (p >= k || p > K((j - w) / l)) && i("overflow"), w += p * l, y = g >= s ? q : s >= g + z ? z : s - g, !(y > p); s += k) {
                m = k - y, l > K(j / m) && i("overflow"), l *= m;
              }n = r.length + 1, g = c(w - t, n, 0 == t), K(w / n) > j - b && i("overflow"), b += K(w / n), w %= n, r.splice(w++, 0, b);
            }return u(r);
          }function m(e) {
            var n,
                f,
                o,
                d,
                t,
                l,
                u,
                a,
                y,
                m,
                r,
                v,
                w,
                b,
                g,
                h = [];for (e = s(e), v = e.length, n = D, f = 0, t = C, l = 0; v > l; ++l) {
              r = e[l], 128 > r && h.push(L(r));
            }for (o = d = h.length, d && h.push(E); v > o;) {
              for (u = j, l = 0; v > l; ++l) {
                r = e[l], r >= n && u > r && (u = r);
              }for (w = o + 1, u - n > K((j - f) / w) && i("overflow"), f += (u - n) * w, n = u, l = 0; v > l; ++l) {
                if (r = e[l], n > r && ++f > j && i("overflow"), r == n) {
                  for (a = f, y = k; m = t >= y ? q : y >= t + z ? z : y - t, !(m > a); y += k) {
                    g = a - m, b = k - m, h.push(L(p(m + g % b, 0))), a = K(g / b);
                  }h.push(L(p(a, 0))), t = c(f, w, o == d), f = 0, ++o;
                }
              }++f, ++n;
            }return h.join("");
          }function r(e) {
            return l(e, function (e) {
              return F.test(e) ? y(e.slice(4).toLowerCase()) : e;
            });
          }function v(e) {
            return l(e, function (e) {
              return G.test(e) ? "xn--" + m(e) : e;
            });
          }var w = "object" == (typeof o === "undefined" ? "undefined" : _typeof(o)) && o,
              b = "object" == (typeof f === "undefined" ? "undefined" : _typeof(f)) && f && f.exports == w && f,
              g = "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n;(g.global === g || g.window === g) && (d = g);var h,
              x,
              j = 2147483647,
              k = 36,
              q = 1,
              z = 26,
              A = 38,
              B = 700,
              C = 72,
              D = 128,
              E = "-",
              F = /^xn--/,
              G = /[^ -~]/,
              H = /\x2E|\u3002|\uFF0E|\uFF61/g,
              I = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" },
              J = k - q,
              K = Math.floor,
              L = String.fromCharCode;if (h = { version: "1.2.4", ucs2: { decode: s, encode: u }, decode: y, encode: m, toASCII: v, toUnicode: r }, "function" == typeof e && "object" == _typeof(e.amd) && e.amd) e("punycode", function () {
            return h;
          });else if (w && !w.nodeType) {
            if (b) b.exports = h;else for (x in h) {
              h.hasOwnProperty(x) && (w[x] = h[x]);
            }
          } else d.punycode = h;
        }(this);
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 2: [function (e, n) {
      function f(e, n, f) {
        !e.defaultView || n === e.defaultView.pageXOffset && f === e.defaultView.pageYOffset || e.defaultView.scrollTo(n, f);
      }function o(e, n) {
        try {
          n && (n.width = e.width, n.height = e.height, n.getContext("2d").putImageData(e.getContext("2d").getImageData(0, 0, e.width, e.height), 0, 0));
        } catch (f) {
          t("Unable to copy canvas content from", e, f);
        }
      }function d(e, n) {
        for (var f = 3 === e.nodeType ? document.createTextNode(e.nodeValue) : e.cloneNode(!1), i = e.firstChild; i;) {
          (n === !0 || 1 !== i.nodeType || "SCRIPT" !== i.nodeName) && f.appendChild(d(i, n)), i = i.nextSibling;
        }return 1 === e.nodeType && (f._scrollTop = e.scrollTop, f._scrollLeft = e.scrollLeft, "CANVAS" === e.nodeName ? o(e, f) : ("TEXTAREA" === e.nodeName || "SELECT" === e.nodeName) && (f.value = e.value)), f;
      }function i(e) {
        if (1 === e.nodeType) {
          e.scrollTop = e._scrollTop, e.scrollLeft = e._scrollLeft;for (var n = e.firstChild; n;) {
            i(n), n = n.nextSibling;
          }
        }
      }var t = e("./log");n.exports = function (e, n, o, t, l, s, u) {
        var a = d(e.documentElement, l.javascriptEnabled),
            p = n.createElement("iframe");return p.className = "html2canvas-container", p.style.visibility = "hidden", p.style.position = "fixed", p.style.left = "-10000px", p.style.top = "0px", p.style.border = "0", p.width = o, p.height = t, p.scrolling = "no", n.body.appendChild(p), new Promise(function (n) {
          var o = p.contentWindow.document;p.contentWindow.onload = p.onload = function () {
            var e = setInterval(function () {
              o.body.childNodes.length > 0 && (i(o.documentElement), clearInterval(e), "view" === l.type && (p.contentWindow.scrollTo(s, u), !/(iPad|iPhone|iPod)/g.test(navigator.userAgent) || p.contentWindow.scrollY === u && p.contentWindow.scrollX === s || (o.documentElement.style.top = -u + "px", o.documentElement.style.left = -s + "px", o.documentElement.style.position = "absolute")), n(p));
            }, 50);
          }, o.open(), o.write("<!DOCTYPE html><html></html>"), f(e, s, u), o.replaceChild(o.adoptNode(a), o.documentElement), o.close();
        });
      };
    }, { "./log": 13 }], 3: [function (e, n) {
      function f(e) {
        this.r = 0, this.g = 0, this.b = 0, this.a = null;this.fromArray(e) || this.namedColor(e) || this.rgb(e) || this.rgba(e) || this.hex6(e) || this.hex3(e);
      }f.prototype.darken = function (e) {
        var n = 1 - e;return new f([Math.round(this.r * n), Math.round(this.g * n), Math.round(this.b * n), this.a]);
      }, f.prototype.isTransparent = function () {
        return 0 === this.a;
      }, f.prototype.isBlack = function () {
        return 0 === this.r && 0 === this.g && 0 === this.b;
      }, f.prototype.fromArray = function (e) {
        return Array.isArray(e) && (this.r = Math.min(e[0], 255), this.g = Math.min(e[1], 255), this.b = Math.min(e[2], 255), e.length > 3 && (this.a = e[3])), Array.isArray(e);
      };var o = /^#([a-f0-9]{3})$/i;f.prototype.hex3 = function (e) {
        var n = null;return null !== (n = e.match(o)) && (this.r = parseInt(n[1][0] + n[1][0], 16), this.g = parseInt(n[1][1] + n[1][1], 16), this.b = parseInt(n[1][2] + n[1][2], 16)), null !== n;
      };var d = /^#([a-f0-9]{6})$/i;f.prototype.hex6 = function (e) {
        var n = null;return null !== (n = e.match(d)) && (this.r = parseInt(n[1].substring(0, 2), 16), this.g = parseInt(n[1].substring(2, 4), 16), this.b = parseInt(n[1].substring(4, 6), 16)), null !== n;
      };var i = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;f.prototype.rgb = function (e) {
        var n = null;return null !== (n = e.match(i)) && (this.r = Number(n[1]), this.g = Number(n[2]), this.b = Number(n[3])), null !== n;
      };var t = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;f.prototype.rgba = function (e) {
        var n = null;return null !== (n = e.match(t)) && (this.r = Number(n[1]), this.g = Number(n[2]), this.b = Number(n[3]), this.a = Number(n[4])), null !== n;
      }, f.prototype.toString = function () {
        return null !== this.a && 1 !== this.a ? "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")" : "rgb(" + [this.r, this.g, this.b].join(",") + ")";
      }, f.prototype.namedColor = function (e) {
        e = e.toLowerCase();var n = l[e];if (n) this.r = n[0], this.g = n[1], this.b = n[2];else if ("transparent" === e) return this.r = this.g = this.b = this.a = 0, !0;return !!n;
      }, f.prototype.isColor = !0;var l = { aliceblue: [240, 248, 255], antiquewhite: [250, 235, 215], aqua: [0, 255, 255], aquamarine: [127, 255, 212], azure: [240, 255, 255], beige: [245, 245, 220], bisque: [255, 228, 196], black: [0, 0, 0], blanchedalmond: [255, 235, 205], blue: [0, 0, 255], blueviolet: [138, 43, 226], brown: [165, 42, 42], burlywood: [222, 184, 135], cadetblue: [95, 158, 160], chartreuse: [127, 255, 0], chocolate: [210, 105, 30], coral: [255, 127, 80], cornflowerblue: [100, 149, 237], cornsilk: [255, 248, 220], crimson: [220, 20, 60], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgoldenrod: [184, 134, 11], darkgray: [169, 169, 169], darkgreen: [0, 100, 0], darkgrey: [169, 169, 169], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkseagreen: [143, 188, 143], darkslateblue: [72, 61, 139], darkslategray: [47, 79, 79], darkslategrey: [47, 79, 79], darkturquoise: [0, 206, 209], darkviolet: [148, 0, 211], deeppink: [255, 20, 147], deepskyblue: [0, 191, 255], dimgray: [105, 105, 105], dimgrey: [105, 105, 105], dodgerblue: [30, 144, 255], firebrick: [178, 34, 34], floralwhite: [255, 250, 240], forestgreen: [34, 139, 34], fuchsia: [255, 0, 255], gainsboro: [220, 220, 220], ghostwhite: [248, 248, 255], gold: [255, 215, 0], goldenrod: [218, 165, 32], gray: [128, 128, 128], green: [0, 128, 0], greenyellow: [173, 255, 47], grey: [128, 128, 128], honeydew: [240, 255, 240], hotpink: [255, 105, 180], indianred: [205, 92, 92], indigo: [75, 0, 130], ivory: [255, 255, 240], khaki: [240, 230, 140], lavender: [230, 230, 250], lavenderblush: [255, 240, 245], lawngreen: [124, 252, 0], lemonchiffon: [255, 250, 205], lightblue: [173, 216, 230], lightcoral: [240, 128, 128], lightcyan: [224, 255, 255], lightgoldenrodyellow: [250, 250, 210], lightgray: [211, 211, 211], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightsalmon: [255, 160, 122], lightseagreen: [32, 178, 170], lightskyblue: [135, 206, 250], lightslategray: [119, 136, 153], lightslategrey: [119, 136, 153], lightsteelblue: [176, 196, 222], lightyellow: [255, 255, 224], lime: [0, 255, 0], limegreen: [50, 205, 50], linen: [250, 240, 230], magenta: [255, 0, 255], maroon: [128, 0, 0], mediumaquamarine: [102, 205, 170], mediumblue: [0, 0, 205], mediumorchid: [186, 85, 211], mediumpurple: [147, 112, 219], mediumseagreen: [60, 179, 113], mediumslateblue: [123, 104, 238], mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204], mediumvioletred: [199, 21, 133], midnightblue: [25, 25, 112], mintcream: [245, 255, 250], mistyrose: [255, 228, 225], moccasin: [255, 228, 181], navajowhite: [255, 222, 173], navy: [0, 0, 128], oldlace: [253, 245, 230], olive: [128, 128, 0], olivedrab: [107, 142, 35], orange: [255, 165, 0], orangered: [255, 69, 0], orchid: [218, 112, 214], palegoldenrod: [238, 232, 170], palegreen: [152, 251, 152], paleturquoise: [175, 238, 238], palevioletred: [219, 112, 147], papayawhip: [255, 239, 213], peachpuff: [255, 218, 185], peru: [205, 133, 63], pink: [255, 192, 203], plum: [221, 160, 221], powderblue: [176, 224, 230], purple: [128, 0, 128], rebeccapurple: [102, 51, 153], red: [255, 0, 0], rosybrown: [188, 143, 143], royalblue: [65, 105, 225], saddlebrown: [139, 69, 19], salmon: [250, 128, 114], sandybrown: [244, 164, 96], seagreen: [46, 139, 87], seashell: [255, 245, 238], sienna: [160, 82, 45], silver: [192, 192, 192], skyblue: [135, 206, 235], slateblue: [106, 90, 205], slategray: [112, 128, 144], slategrey: [112, 128, 144], snow: [255, 250, 250], springgreen: [0, 255, 127], steelblue: [70, 130, 180], tan: [210, 180, 140], teal: [0, 128, 128], thistle: [216, 191, 216], tomato: [255, 99, 71], turquoise: [64, 224, 208], violet: [238, 130, 238], wheat: [245, 222, 179], white: [255, 255, 255], whitesmoke: [245, 245, 245], yellow: [255, 255, 0], yellowgreen: [154, 205, 50] };n.exports = f;
    }, {}], 4: [function (n, f) {
      function o(e, n) {
        var f = j++;if (n = n || {}, n.logging && (v.options.logging = !0, v.options.start = Date.now()), n.async = "undefined" == typeof n.async ? !0 : n.async, n.allowTaint = "undefined" == typeof n.allowTaint ? !1 : n.allowTaint, n.removeContainer = "undefined" == typeof n.removeContainer ? !0 : n.removeContainer, n.javascriptEnabled = "undefined" == typeof n.javascriptEnabled ? !1 : n.javascriptEnabled, n.imageTimeout = "undefined" == typeof n.imageTimeout ? 1e4 : n.imageTimeout, n.renderer = "function" == typeof n.renderer ? n.renderer : c, n.strict = !!n.strict, "string" == typeof e) {
          if ("string" != typeof n.proxy) return Promise.reject("Proxy must be used when rendering url");var o = null != n.width ? n.width : window.innerWidth,
              t = null != n.height ? n.height : window.innerHeight;return g(a(e), n.proxy, document, o, t, n).then(function (e) {
            return i(e.contentWindow.document.documentElement, e, n, o, t);
          });
        }var l = (void 0 === e ? [document.documentElement] : e.length ? e : [e])[0];return l.setAttribute(x + f, f), d(l.ownerDocument, n, l.ownerDocument.defaultView.innerWidth, l.ownerDocument.defaultView.innerHeight, f).then(function (e) {
          return "function" == typeof n.onrendered && (v("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas"), n.onrendered(e)), e;
        });
      }function d(e, n, f, o, d) {
        return b(e, e, f, o, n, e.defaultView.pageXOffset, e.defaultView.pageYOffset).then(function (t) {
          v("Document cloned");var l = x + d,
              s = "[" + l + "='" + d + "']";e.querySelector(s).removeAttribute(l);var u = t.contentWindow,
              a = u.document.querySelector(s),
              p = Promise.resolve("function" == typeof n.onclone ? n.onclone(u.document) : !0);return p.then(function () {
            return i(a, t, n, f, o);
          });
        });
      }function i(e, n, f, o, d) {
        var i = n.contentWindow,
            a = new p(i.document),
            c = new y(f, a),
            r = h(e),
            w = "view" === f.type ? o : s(i.document),
            b = "view" === f.type ? d : u(i.document),
            g = new f.renderer(w, b, c, f, document),
            x = new m(e, g, a, c, f);return x.ready.then(function () {
          v("Finished rendering");var o;return o = "view" === f.type ? l(g.canvas, { width: g.canvas.width, height: g.canvas.height, top: 0, left: 0, x: 0, y: 0 }) : e === i.document.body || e === i.document.documentElement || null != f.canvas ? g.canvas : l(g.canvas, { width: null != f.width ? f.width : r.width, height: null != f.height ? f.height : r.height, top: r.top, left: r.left, x: 0, y: 0 }), t(n, f), o;
        });
      }function t(e, n) {
        n.removeContainer && (e.parentNode.removeChild(e), v("Cleaned up container"));
      }function l(e, n) {
        var f = document.createElement("canvas"),
            o = Math.min(e.width - 1, Math.max(0, n.left)),
            d = Math.min(e.width, Math.max(1, n.left + n.width)),
            i = Math.min(e.height - 1, Math.max(0, n.top)),
            t = Math.min(e.height, Math.max(1, n.top + n.height));f.width = n.width, f.height = n.height;var l = d - o,
            s = t - i;return v("Cropping canvas at:", "left:", n.left, "top:", n.top, "width:", l, "height:", s), v("Resulting crop with width", n.width, "and height", n.height, "with x", o, "and y", i), f.getContext("2d").drawImage(e, o, i, l, s, n.x, n.y, l, s), f;
      }function s(e) {
        return Math.max(Math.max(e.body.scrollWidth, e.documentElement.scrollWidth), Math.max(e.body.offsetWidth, e.documentElement.offsetWidth), Math.max(e.body.clientWidth, e.documentElement.clientWidth));
      }function u(e) {
        return Math.max(Math.max(e.body.scrollHeight, e.documentElement.scrollHeight), Math.max(e.body.offsetHeight, e.documentElement.offsetHeight), Math.max(e.body.clientHeight, e.documentElement.clientHeight));
      }function a(e) {
        var n = document.createElement("a");return n.href = e, n.href = n.href, n;
      }var p = n("./support"),
          c = n("./renderers/canvas"),
          y = n("./imageloader"),
          m = n("./nodeparser"),
          r = n("./nodecontainer"),
          v = n("./log"),
          w = n("./utils"),
          b = n("./clone"),
          g = n("./proxy").loadUrlDocument,
          h = w.getBounds,
          x = "data-html2canvas-node",
          j = 0;o.CanvasRenderer = c, o.NodeContainer = r, o.log = v, o.utils = w;var k = "undefined" == typeof document || "function" != typeof Object.create || "function" != typeof document.createElement("canvas").getContext ? function () {
        return Promise.reject("No canvas support");
      } : o;f.exports = k, "function" == typeof e && e.amd && e("html2canvas", [], function () {
        return k;
      });
    }, { "./clone": 2, "./imageloader": 11, "./log": 13, "./nodecontainer": 14, "./nodeparser": 15, "./proxy": 16, "./renderers/canvas": 20, "./support": 22, "./utils": 26 }], 5: [function (e, n) {
      function f(e) {
        if (this.src = e, o("DummyImageContainer for", e), !this.promise || !this.image) {
          o("Initiating DummyImageContainer"), f.prototype.image = new Image();var n = this.image;f.prototype.promise = new Promise(function (e, f) {
            n.onload = e, n.onerror = f, n.src = d(), n.complete === !0 && e(n);
          });
        }
      }var o = e("./log"),
          d = e("./utils").smallImage;n.exports = f;
    }, { "./log": 13, "./utils": 26 }], 6: [function (e, n) {
      function f(e, n) {
        var f,
            d,
            i = document.createElement("div"),
            t = document.createElement("img"),
            l = document.createElement("span"),
            s = "Hidden Text";i.style.visibility = "hidden", i.style.fontFamily = e, i.style.fontSize = n, i.style.margin = 0, i.style.padding = 0, document.body.appendChild(i), t.src = o(), t.width = 1, t.height = 1, t.style.margin = 0, t.style.padding = 0, t.style.verticalAlign = "baseline", l.style.fontFamily = e, l.style.fontSize = n, l.style.margin = 0, l.style.padding = 0, l.appendChild(document.createTextNode(s)), i.appendChild(l), i.appendChild(t), f = t.offsetTop - l.offsetTop + 1, i.removeChild(l), i.appendChild(document.createTextNode(s)), i.style.lineHeight = "normal", t.style.verticalAlign = "super", d = t.offsetTop - i.offsetTop + 1, document.body.removeChild(i), this.baseline = f, this.lineWidth = 1, this.middle = d;
      }var o = e("./utils").smallImage;n.exports = f;
    }, { "./utils": 26 }], 7: [function (e, n) {
      function f() {
        this.data = {};
      }var o = e("./font");f.prototype.getMetrics = function (e, n) {
        return void 0 === this.data[e + "-" + n] && (this.data[e + "-" + n] = new o(e, n)), this.data[e + "-" + n];
      }, n.exports = f;
    }, { "./font": 6 }], 8: [function (e, n) {
      function f(n, f, o) {
        this.image = null, this.src = n;var i = this,
            t = d(n);this.promise = (f ? new Promise(function (e) {
          "about:blank" === n.contentWindow.document.URL || null == n.contentWindow.document.documentElement ? n.contentWindow.onload = n.onload = function () {
            e(n);
          } : e(n);
        }) : this.proxyLoad(o.proxy, t, o)).then(function (n) {
          var f = e("./core");return f(n.contentWindow.document.documentElement, { type: "view", width: n.width, height: n.height, proxy: o.proxy, javascriptEnabled: o.javascriptEnabled, removeContainer: o.removeContainer, allowTaint: o.allowTaint, imageTimeout: o.imageTimeout / 2 });
        }).then(function (e) {
          return i.image = e;
        });
      }var o = e("./utils"),
          d = o.getBounds,
          i = e("./proxy").loadUrlDocument;f.prototype.proxyLoad = function (e, n, f) {
        var o = this.src;return i(o.src, e, o.ownerDocument, n.width, n.height, f);
      }, n.exports = f;
    }, { "./core": 4, "./proxy": 16, "./utils": 26 }], 9: [function (e, n) {
      function f(e) {
        this.src = e.value, this.colorStops = [], this.type = null, this.x0 = .5, this.y0 = .5, this.x1 = .5, this.y1 = .5, this.promise = Promise.resolve(!0);
      }f.TYPES = { LINEAR: 1, RADIAL: 2 }, f.REGEXP_COLORSTOP = /^\s*(rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*[0-9\.]+)?\s*\)|[a-z]{3,20}|#[a-f0-9]{3,6})(?:\s+(\d{1,3}(?:\.\d+)?)(%|px)?)?(?:\s|$)/i, n.exports = f;
    }, {}], 10: [function (e, n) {
      function f(e, n) {
        this.src = e, this.image = new Image();var f = this;this.tainted = null, this.promise = new Promise(function (o, d) {
          f.image.onload = o, f.image.onerror = d, n && (f.image.crossOrigin = "anonymous"), f.image.src = e, f.image.complete === !0 && o(f.image);
        });
      }n.exports = f;
    }, {}], 11: [function (e, n) {
      function f(e, n) {
        this.link = null, this.options = e, this.support = n, this.origin = this.getOrigin(window.location.href);
      }var o = e("./log"),
          d = e("./imagecontainer"),
          i = e("./dummyimagecontainer"),
          t = e("./proxyimagecontainer"),
          l = e("./framecontainer"),
          s = e("./svgcontainer"),
          u = e("./svgnodecontainer"),
          a = e("./lineargradientcontainer"),
          p = e("./webkitgradientcontainer"),
          c = e("./utils").bind;f.prototype.findImages = function (e) {
        var n = [];return e.reduce(function (e, n) {
          switch (n.node.nodeName) {case "IMG":
              return e.concat([{ args: [n.node.src], method: "url" }]);case "svg":case "IFRAME":
              return e.concat([{ args: [n.node], method: n.node.nodeName }]);}return e;
        }, []).forEach(this.addImage(n, this.loadImage), this), n;
      }, f.prototype.findBackgroundImage = function (e, n) {
        return n.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(e, this.loadImage), this), e;
      }, f.prototype.addImage = function (e, n) {
        return function (f) {
          f.args.forEach(function (d) {
            this.imageExists(e, d) || (e.splice(0, 0, n.call(this, f)), o("Added image #" + e.length, "string" == typeof d ? d.substring(0, 100) : d));
          }, this);
        };
      }, f.prototype.hasImageBackground = function (e) {
        return "none" !== e.method;
      }, f.prototype.loadImage = function (e) {
        if ("url" === e.method) {
          var n = e.args[0];return !this.isSVG(n) || this.support.svg || this.options.allowTaint ? n.match(/data:image\/.*;base64,/i) ? new d(n.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, ""), !1) : this.isSameOrigin(n) || this.options.allowTaint === !0 || this.isSVG(n) ? new d(n, !1) : this.support.cors && !this.options.allowTaint && this.options.useCORS ? new d(n, !0) : this.options.proxy ? new t(n, this.options.proxy) : new i(n) : new s(n);
        }return "linear-gradient" === e.method ? new a(e) : "gradient" === e.method ? new p(e) : "svg" === e.method ? new u(e.args[0], this.support.svg) : "IFRAME" === e.method ? new l(e.args[0], this.isSameOrigin(e.args[0].src), this.options) : new i(e);
      }, f.prototype.isSVG = function (e) {
        return "svg" === e.substring(e.length - 3).toLowerCase() || s.prototype.isInline(e);
      }, f.prototype.imageExists = function (e, n) {
        return e.some(function (e) {
          return e.src === n;
        });
      }, f.prototype.isSameOrigin = function (e) {
        return this.getOrigin(e) === this.origin;
      }, f.prototype.getOrigin = function (e) {
        var n = this.link || (this.link = document.createElement("a"));return n.href = e, n.href = n.href, n.protocol + n.hostname + n.port;
      }, f.prototype.getPromise = function (e) {
        return this.timeout(e, this.options.imageTimeout)["catch"](function () {
          var n = new i(e.src);return n.promise.then(function (n) {
            e.image = n;
          });
        });
      }, f.prototype.get = function (e) {
        var n = null;return this.images.some(function (f) {
          return (n = f).src === e;
        }) ? n : null;
      }, f.prototype.fetch = function (e) {
        return this.images = e.reduce(c(this.findBackgroundImage, this), this.findImages(e)), this.images.forEach(function (e, n) {
          e.promise.then(function () {
            o("Succesfully loaded image #" + (n + 1), e);
          }, function (f) {
            o("Failed loading image #" + (n + 1), e, f);
          });
        }), this.ready = Promise.all(this.images.map(this.getPromise, this)), o("Finished searching images"), this;
      }, f.prototype.timeout = function (e, n) {
        var f,
            d = Promise.race([e.promise, new Promise(function (d, i) {
          f = setTimeout(function () {
            o("Timed out loading image", e), i(e);
          }, n);
        })]).then(function (e) {
          return clearTimeout(f), e;
        });return d["catch"](function () {
          clearTimeout(f);
        }), d;
      }, n.exports = f;
    }, { "./dummyimagecontainer": 5, "./framecontainer": 8, "./imagecontainer": 10, "./lineargradientcontainer": 12, "./log": 13, "./proxyimagecontainer": 17, "./svgcontainer": 23, "./svgnodecontainer": 24, "./utils": 26, "./webkitgradientcontainer": 27 }], 12: [function (e, n) {
      function f(e) {
        o.apply(this, arguments), this.type = o.TYPES.LINEAR;var n = f.REGEXP_DIRECTION.test(e.args[0]) || !o.REGEXP_COLORSTOP.test(e.args[0]);n ? e.args[0].split(/\s+/).reverse().forEach(function (e, n) {
          switch (e) {case "left":
              this.x0 = 0, this.x1 = 1;break;case "top":
              this.y0 = 0, this.y1 = 1;break;case "right":
              this.x0 = 1, this.x1 = 0;break;case "bottom":
              this.y0 = 1, this.y1 = 0;break;case "to":
              var f = this.y0,
                  o = this.x0;this.y0 = this.y1, this.x0 = this.x1, this.x1 = o, this.y1 = f;break;case "center":
              break;default:
              var d = .01 * parseFloat(e, 10);if (isNaN(d)) break;0 === n ? (this.y0 = d, this.y1 = 1 - this.y0) : (this.x0 = d, this.x1 = 1 - this.x0);}
        }, this) : (this.y0 = 0, this.y1 = 1), this.colorStops = e.args.slice(n ? 1 : 0).map(function (e) {
          var n = e.match(o.REGEXP_COLORSTOP),
              f = +n[2],
              i = 0 === f ? "%" : n[3];return { color: new d(n[1]), stop: "%" === i ? f / 100 : null };
        }), null === this.colorStops[0].stop && (this.colorStops[0].stop = 0), null === this.colorStops[this.colorStops.length - 1].stop && (this.colorStops[this.colorStops.length - 1].stop = 1), this.colorStops.forEach(function (e, n) {
          null === e.stop && this.colorStops.slice(n).some(function (f, o) {
            return null !== f.stop ? (e.stop = (f.stop - this.colorStops[n - 1].stop) / (o + 1) + this.colorStops[n - 1].stop, !0) : !1;
          }, this);
        }, this);
      }var o = e("./gradientcontainer"),
          d = e("./color");f.prototype = Object.create(o.prototype), f.REGEXP_DIRECTION = /^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i, n.exports = f;
    }, { "./color": 3, "./gradientcontainer": 9 }], 13: [function (e, n) {
      var f = function f() {
        f.options.logging && window.console && window.console.log && Function.prototype.bind.call(window.console.log, window.console).apply(window.console, [Date.now() - f.options.start + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)));
      };f.options = { logging: !1 }, n.exports = f;
    }, {}], 14: [function (e, n) {
      function f(e, n) {
        this.node = e, this.parent = n, this.stack = null, this.bounds = null, this.borders = null, this.clip = [], this.backgroundClip = [], this.offsetBounds = null, this.visible = null, this.computedStyles = null, this.colors = {}, this.styles = {}, this.backgroundImages = null, this.transformData = null, this.transformMatrix = null, this.isPseudoElement = !1, this.opacity = null;
      }function o(e) {
        var n = e.options[e.selectedIndex || 0];return n ? n.text || "" : "";
      }function d(e) {
        if (e && "matrix" === e[1]) return e[2].split(",").map(function (e) {
          return parseFloat(e.trim());
        });if (e && "matrix3d" === e[1]) {
          var n = e[2].split(",").map(function (e) {
            return parseFloat(e.trim());
          });return [n[0], n[1], n[4], n[5], n[12], n[13]];
        }
      }function i(e) {
        return -1 !== e.toString().indexOf("%");
      }function t(e) {
        return e.replace("px", "");
      }function l(e) {
        return parseFloat(e);
      }var s = e("./color"),
          u = e("./utils"),
          a = u.getBounds,
          p = u.parseBackgrounds,
          c = u.offsetBounds;f.prototype.cloneTo = function (e) {
        e.visible = this.visible, e.borders = this.borders, e.bounds = this.bounds, e.clip = this.clip, e.backgroundClip = this.backgroundClip, e.computedStyles = this.computedStyles, e.styles = this.styles, e.backgroundImages = this.backgroundImages, e.opacity = this.opacity;
      }, f.prototype.getOpacity = function () {
        return null === this.opacity ? this.opacity = this.cssFloat("opacity") : this.opacity;
      }, f.prototype.assignStack = function (e) {
        this.stack = e, e.children.push(this);
      }, f.prototype.isElementVisible = function () {
        return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : "none" !== this.css("display") && "hidden" !== this.css("visibility") && !this.node.hasAttribute("data-html2canvas-ignore") && ("INPUT" !== this.node.nodeName || "hidden" !== this.node.getAttribute("type"));
      }, f.prototype.css = function (e) {
        return this.computedStyles || (this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null)), this.styles[e] || (this.styles[e] = this.computedStyles[e]);
      }, f.prototype.prefixedCss = function (e) {
        var n = ["webkit", "moz", "ms", "o"],
            f = this.css(e);return void 0 === f && n.some(function (n) {
          return f = this.css(n + e.substr(0, 1).toUpperCase() + e.substr(1)), void 0 !== f;
        }, this), void 0 === f ? null : f;
      }, f.prototype.computedStyle = function (e) {
        return this.node.ownerDocument.defaultView.getComputedStyle(this.node, e);
      }, f.prototype.cssInt = function (e) {
        var n = parseInt(this.css(e), 10);return isNaN(n) ? 0 : n;
      }, f.prototype.color = function (e) {
        return this.colors[e] || (this.colors[e] = new s(this.css(e)));
      }, f.prototype.cssFloat = function (e) {
        var n = parseFloat(this.css(e));return isNaN(n) ? 0 : n;
      }, f.prototype.fontWeight = function () {
        var e = this.css("fontWeight");switch (parseInt(e, 10)) {case 401:
            e = "bold";break;case 400:
            e = "normal";}return e;
      }, f.prototype.parseClip = function () {
        var e = this.css("clip").match(this.CLIP);return e ? { top: parseInt(e[1], 10), right: parseInt(e[2], 10), bottom: parseInt(e[3], 10), left: parseInt(e[4], 10) } : null;
      }, f.prototype.parseBackgroundImages = function () {
        return this.backgroundImages || (this.backgroundImages = p(this.css("backgroundImage")));
      }, f.prototype.cssList = function (e, n) {
        var f = (this.css(e) || "").split(",");return f = f[n || 0] || f[0] || "auto", f = f.trim().split(" "), 1 === f.length && (f = [f[0], i(f[0]) ? "auto" : f[0]]), f;
      }, f.prototype.parseBackgroundSize = function (e, n, f) {
        var o,
            d,
            t = this.cssList("backgroundSize", f);if (i(t[0])) o = e.width * parseFloat(t[0]) / 100;else {
          if (/contain|cover/.test(t[0])) {
            var l = e.width / e.height,
                s = n.width / n.height;return s > l ^ "contain" === t[0] ? { width: e.height * s, height: e.height } : { width: e.width, height: e.width / s };
          }o = parseInt(t[0], 10);
        }return d = "auto" === t[0] && "auto" === t[1] ? n.height : "auto" === t[1] ? o / n.width * n.height : i(t[1]) ? e.height * parseFloat(t[1]) / 100 : parseInt(t[1], 10), "auto" === t[0] && (o = d / n.height * n.width), { width: o, height: d };
      }, f.prototype.parseBackgroundPosition = function (e, n, f, o) {
        var d,
            t,
            l = this.cssList("backgroundPosition", f);return d = i(l[0]) ? (e.width - (o || n).width) * (parseFloat(l[0]) / 100) : parseInt(l[0], 10), t = "auto" === l[1] ? d / n.width * n.height : i(l[1]) ? (e.height - (o || n).height) * parseFloat(l[1]) / 100 : parseInt(l[1], 10), "auto" === l[0] && (d = t / n.height * n.width), { left: d, top: t };
      }, f.prototype.parseBackgroundRepeat = function (e) {
        return this.cssList("backgroundRepeat", e)[0];
      }, f.prototype.parseTextShadows = function () {
        var e = this.css("textShadow"),
            n = [];if (e && "none" !== e) for (var f = e.match(this.TEXT_SHADOW_PROPERTY), o = 0; f && o < f.length; o++) {
          var d = f[o].match(this.TEXT_SHADOW_VALUES);n.push({ color: new s(d[0]), offsetX: d[1] ? parseFloat(d[1].replace("px", "")) : 0, offsetY: d[2] ? parseFloat(d[2].replace("px", "")) : 0, blur: d[3] ? d[3].replace("px", "") : 0 });
        }return n;
      }, f.prototype.parseTransform = function () {
        if (!this.transformData) if (this.hasTransform()) {
          var e = this.parseBounds(),
              n = this.prefixedCss("transformOrigin").split(" ").map(t).map(l);n[0] += e.left, n[1] += e.top, this.transformData = { origin: n, matrix: this.parseTransformMatrix() };
        } else this.transformData = { origin: [0, 0], matrix: [1, 0, 0, 1, 0, 0] };return this.transformData;
      }, f.prototype.parseTransformMatrix = function () {
        if (!this.transformMatrix) {
          var e = this.prefixedCss("transform"),
              n = e ? d(e.match(this.MATRIX_PROPERTY)) : null;this.transformMatrix = n ? n : [1, 0, 0, 1, 0, 0];
        }return this.transformMatrix;
      }, f.prototype.parseBounds = function () {
        return this.bounds || (this.bounds = this.hasTransform() ? c(this.node) : a(this.node));
      }, f.prototype.hasTransform = function () {
        return "1,0,0,1,0,0" !== this.parseTransformMatrix().join(",") || this.parent && this.parent.hasTransform();
      }, f.prototype.getValue = function () {
        var e = this.node.value || "";return "SELECT" === this.node.tagName ? e = o(this.node) : "password" === this.node.type && (e = Array(e.length + 1).join("•")), 0 === e.length ? this.node.placeholder || "" : e;
      }, f.prototype.MATRIX_PROPERTY = /(matrix|matrix3d)\((.+)\)/, f.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g, f.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g, f.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/, n.exports = f;
    }, { "./color": 3, "./utils": 26 }], 15: [function (e, n) {
      function f(e, n, f, o, d) {
        N("Starting NodeParser"), this.renderer = n, this.options = d, this.range = null, this.support = f, this.renderQueue = [], this.stack = new U(!0, 1, e.ownerDocument, null);var i = new P(e, null);if (d.background && n.rectangle(0, 0, n.width, n.height, new T(d.background)), e === e.ownerDocument.documentElement) {
          var t = new P(i.color("backgroundColor").isTransparent() ? e.ownerDocument.body : e.ownerDocument.documentElement, null);n.rectangle(0, 0, n.width, n.height, t.color("backgroundColor"));
        }i.visibile = i.isElementVisible(), this.createPseudoHideStyles(e.ownerDocument), this.disableAnimations(e.ownerDocument), this.nodes = I([i].concat(this.getChildren(i)).filter(function (e) {
          return e.visible = e.isElementVisible();
        }).map(this.getPseudoElements, this)), this.fontMetrics = new S(), N("Fetched nodes, total:", this.nodes.length), N("Calculate overflow clips"), this.calculateOverflowClips(), N("Start fetching images"), this.images = o.fetch(this.nodes.filter(A)), this.ready = this.images.ready.then(W(function () {
          return N("Images loaded, starting parsing"), N("Creating stacking contexts"), this.createStackingContexts(), N("Sorting stacking contexts"), this.sortStackingContexts(this.stack), this.parse(this.stack), N("Render queue created with " + this.renderQueue.length + " items"), new Promise(W(function (e) {
            d.async ? "function" == typeof d.async ? d.async.call(this, this.renderQueue, e) : this.renderQueue.length > 0 ? (this.renderIndex = 0, this.asyncRenderer(this.renderQueue, e)) : e() : (this.renderQueue.forEach(this.paint, this), e());
          }, this));
        }, this));
      }function o(e) {
        return e.parent && e.parent.clip.length;
      }function d(e) {
        return e.replace(/(\-[a-z])/g, function (e) {
          return e.toUpperCase().replace("-", "");
        });
      }function i() {}function t(e, n, f, o) {
        return e.map(function (d, i) {
          if (d.width > 0) {
            var t = n.left,
                l = n.top,
                s = n.width,
                u = n.height - e[2].width;switch (i) {case 0:
                u = e[0].width, d.args = a({ c1: [t, l], c2: [t + s, l], c3: [t + s - e[1].width, l + u], c4: [t + e[3].width, l + u] }, o[0], o[1], f.topLeftOuter, f.topLeftInner, f.topRightOuter, f.topRightInner);break;case 1:
                t = n.left + n.width - e[1].width, s = e[1].width, d.args = a({ c1: [t + s, l], c2: [t + s, l + u + e[2].width], c3: [t, l + u], c4: [t, l + e[0].width] }, o[1], o[2], f.topRightOuter, f.topRightInner, f.bottomRightOuter, f.bottomRightInner);break;case 2:
                l = l + n.height - e[2].width, u = e[2].width, d.args = a({ c1: [t + s, l + u], c2: [t, l + u], c3: [t + e[3].width, l], c4: [t + s - e[3].width, l] }, o[2], o[3], f.bottomRightOuter, f.bottomRightInner, f.bottomLeftOuter, f.bottomLeftInner);break;case 3:
                s = e[3].width, d.args = a({ c1: [t, l + u + e[2].width], c2: [t, l], c3: [t + s, l + e[0].width], c4: [t + s, l + u] }, o[3], o[0], f.bottomLeftOuter, f.bottomLeftInner, f.topLeftOuter, f.topLeftInner);}
          }return d;
        });
      }function l(e, n, f, o) {
        var d = 4 * ((Math.sqrt(2) - 1) / 3),
            i = f * d,
            t = o * d,
            l = e + f,
            s = n + o;return { topLeft: u({ x: e, y: s }, { x: e, y: s - t }, { x: l - i, y: n }, { x: l, y: n }), topRight: u({ x: e, y: n }, { x: e + i, y: n }, { x: l, y: s - t }, { x: l, y: s }), bottomRight: u({ x: l, y: n }, { x: l, y: n + t }, { x: e + i, y: s }, { x: e, y: s }), bottomLeft: u({ x: l, y: s }, { x: l - i, y: s }, { x: e, y: n + t }, { x: e, y: n }) };
      }function s(e, n, f) {
        var o = e.left,
            d = e.top,
            i = e.width,
            t = e.height,
            s = n[0][0] < i / 2 ? n[0][0] : i / 2,
            u = n[0][1] < t / 2 ? n[0][1] : t / 2,
            a = n[1][0] < i / 2 ? n[1][0] : i / 2,
            p = n[1][1] < t / 2 ? n[1][1] : t / 2,
            c = n[2][0] < i / 2 ? n[2][0] : i / 2,
            y = n[2][1] < t / 2 ? n[2][1] : t / 2,
            m = n[3][0] < i / 2 ? n[3][0] : i / 2,
            r = n[3][1] < t / 2 ? n[3][1] : t / 2,
            v = i - a,
            w = t - y,
            b = i - c,
            g = t - r;return { topLeftOuter: l(o, d, s, u).topLeft.subdivide(.5), topLeftInner: l(o + f[3].width, d + f[0].width, Math.max(0, s - f[3].width), Math.max(0, u - f[0].width)).topLeft.subdivide(.5), topRightOuter: l(o + v, d, a, p).topRight.subdivide(.5), topRightInner: l(o + Math.min(v, i + f[3].width), d + f[0].width, v > i + f[3].width ? 0 : a - f[3].width, p - f[0].width).topRight.subdivide(.5), bottomRightOuter: l(o + b, d + w, c, y).bottomRight.subdivide(.5), bottomRightInner: l(o + Math.min(b, i - f[3].width), d + Math.min(w, t + f[0].width), Math.max(0, c - f[1].width), y - f[2].width).bottomRight.subdivide(.5), bottomLeftOuter: l(o, d + g, m, r).bottomLeft.subdivide(.5), bottomLeftInner: l(o + f[3].width, d + g, Math.max(0, m - f[3].width), r - f[2].width).bottomLeft.subdivide(.5) };
      }function u(e, n, f, o) {
        var d = function d(e, n, f) {
          return { x: e.x + (n.x - e.x) * f, y: e.y + (n.y - e.y) * f };
        };return { start: e, startControl: n, endControl: f, end: o, subdivide: function subdivide(i) {
            var t = d(e, n, i),
                l = d(n, f, i),
                s = d(f, o, i),
                a = d(t, l, i),
                p = d(l, s, i),
                c = d(a, p, i);return [u(e, t, a, c), u(c, p, s, o)];
          }, curveTo: function curveTo(e) {
            e.push(["bezierCurve", n.x, n.y, f.x, f.y, o.x, o.y]);
          }, curveToReversed: function curveToReversed(o) {
            o.push(["bezierCurve", f.x, f.y, n.x, n.y, e.x, e.y]);
          } };
      }function a(e, n, f, o, d, i, t) {
        var l = [];return n[0] > 0 || n[1] > 0 ? (l.push(["line", o[1].start.x, o[1].start.y]), o[1].curveTo(l)) : l.push(["line", e.c1[0], e.c1[1]]), f[0] > 0 || f[1] > 0 ? (l.push(["line", i[0].start.x, i[0].start.y]), i[0].curveTo(l), l.push(["line", t[0].end.x, t[0].end.y]), t[0].curveToReversed(l)) : (l.push(["line", e.c2[0], e.c2[1]]), l.push(["line", e.c3[0], e.c3[1]])), n[0] > 0 || n[1] > 0 ? (l.push(["line", d[1].end.x, d[1].end.y]), d[1].curveToReversed(l)) : l.push(["line", e.c4[0], e.c4[1]]), l;
      }function p(e, n, f, o, d, i, t) {
        n[0] > 0 || n[1] > 0 ? (e.push(["line", o[0].start.x, o[0].start.y]), o[0].curveTo(e), o[1].curveTo(e)) : e.push(["line", i, t]), (f[0] > 0 || f[1] > 0) && e.push(["line", d[0].start.x, d[0].start.y]);
      }function c(e) {
        return e.cssInt("zIndex") < 0;
      }function y(e) {
        return e.cssInt("zIndex") > 0;
      }function m(e) {
        return 0 === e.cssInt("zIndex");
      }function r(e) {
        return -1 !== ["inline", "inline-block", "inline-table"].indexOf(e.css("display"));
      }function v(e) {
        return e instanceof U;
      }function w(e) {
        return e.node.data.trim().length > 0;
      }function b(e) {
        return (/^(normal|none|0px)$/.test(e.parent.css("letterSpacing"))
        );
      }function g(e) {
        return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function (n) {
          var f = e.css("border" + n + "Radius"),
              o = f.split(" ");return o.length <= 1 && (o[1] = o[0]), o.map(F);
        });
      }function h(e) {
        return e.nodeType === Node.TEXT_NODE || e.nodeType === Node.ELEMENT_NODE;
      }function x(e) {
        var n = e.css("position"),
            f = -1 !== ["absolute", "relative", "fixed"].indexOf(n) ? e.css("zIndex") : "auto";return "auto" !== f;
      }function j(e) {
        return "static" !== e.css("position");
      }function k(e) {
        return "none" !== e.css("float");
      }function q(e) {
        return -1 !== ["inline-block", "inline-table"].indexOf(e.css("display"));
      }function z(e) {
        var n = this;return function () {
          return !e.apply(n, arguments);
        };
      }function A(e) {
        return e.node.nodeType === Node.ELEMENT_NODE;
      }function B(e) {
        return e.isPseudoElement === !0;
      }function C(e) {
        return e.node.nodeType === Node.TEXT_NODE;
      }function D(e) {
        return function (n, f) {
          return n.cssInt("zIndex") + e.indexOf(n) / e.length - (f.cssInt("zIndex") + e.indexOf(f) / e.length);
        };
      }function E(e) {
        return e.getOpacity() < 1;
      }function F(e) {
        return parseInt(e, 10);
      }function G(e) {
        return e.width;
      }function H(e) {
        return e.node.nodeType !== Node.ELEMENT_NODE || -1 === ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(e.node.nodeName);
      }function I(e) {
        return [].concat.apply([], e);
      }function J(e) {
        var n = e.substr(0, 1);return n === e.substr(e.length - 1) && n.match(/'|"/) ? e.substr(1, e.length - 2) : e;
      }function K(e) {
        for (var n, f = [], o = 0, d = !1; e.length;) {
          L(e[o]) === d ? (n = e.splice(0, o), n.length && f.push(O.ucs2.encode(n)), d = !d, o = 0) : o++, o >= e.length && (n = e.splice(0, o), n.length && f.push(O.ucs2.encode(n)));
        }return f;
      }function L(e) {
        return -1 !== [32, 13, 10, 9, 45].indexOf(e);
      }function M(e) {
        return (/[^\u0000-\u00ff]/.test(e)
        );
      }var N = e("./log"),
          O = e("punycode"),
          P = e("./nodecontainer"),
          Q = e("./textcontainer"),
          R = e("./pseudoelementcontainer"),
          S = e("./fontmetrics"),
          T = e("./color"),
          U = e("./stackingcontext"),
          V = e("./utils"),
          W = V.bind,
          X = V.getBounds,
          Y = V.parseBackgrounds,
          Z = V.offsetBounds;f.prototype.calculateOverflowClips = function () {
        this.nodes.forEach(function (e) {
          if (A(e)) {
            B(e) && e.appendToDOM(), e.borders = this.parseBorders(e);var n = "hidden" === e.css("overflow") ? [e.borders.clip] : [],
                f = e.parseClip();f && -1 !== ["absolute", "fixed"].indexOf(e.css("position")) && n.push([["rect", e.bounds.left + f.left, e.bounds.top + f.top, f.right - f.left, f.bottom - f.top]]), e.clip = o(e) ? e.parent.clip.concat(n) : n, e.backgroundClip = "hidden" !== e.css("overflow") ? e.clip.concat([e.borders.clip]) : e.clip, B(e) && e.cleanDOM();
          } else C(e) && (e.clip = o(e) ? e.parent.clip : []);B(e) || (e.bounds = null);
        }, this);
      }, f.prototype.asyncRenderer = function (e, n, f) {
        f = f || Date.now(), this.paint(e[this.renderIndex++]), e.length === this.renderIndex ? n() : f + 20 > Date.now() ? this.asyncRenderer(e, n, f) : setTimeout(W(function () {
          this.asyncRenderer(e, n);
        }, this), 0);
      }, f.prototype.createPseudoHideStyles = function (e) {
        this.createStyles(e, "." + R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }.' + R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }');
      }, f.prototype.disableAnimations = function (e) {
        this.createStyles(e, "* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}");
      }, f.prototype.createStyles = function (e, n) {
        var f = e.createElement("style");f.innerHTML = n, e.body.appendChild(f);
      }, f.prototype.getPseudoElements = function (e) {
        var n = [[e]];if (e.node.nodeType === Node.ELEMENT_NODE) {
          var f = this.getPseudoElement(e, ":before"),
              o = this.getPseudoElement(e, ":after");f && n.push(f), o && n.push(o);
        }return I(n);
      }, f.prototype.getPseudoElement = function (e, n) {
        var f = e.computedStyle(n);if (!f || !f.content || "none" === f.content || "-moz-alt-content" === f.content || "none" === f.display) return null;for (var o = J(f.content), i = "url" === o.substr(0, 3), t = document.createElement(i ? "img" : "html2canvaspseudoelement"), l = new R(t, e, n), s = f.length - 1; s >= 0; s--) {
          var u = d(f.item(s));t.style[u] = f[u];
        }if (t.className = R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER, i) return t.src = Y(o)[0].args[0], [l];var a = document.createTextNode(o);return t.appendChild(a), [l, new Q(a, l)];
      }, f.prototype.getChildren = function (e) {
        return I([].filter.call(e.node.childNodes, h).map(function (n) {
          var f = [n.nodeType === Node.TEXT_NODE ? new Q(n, e) : new P(n, e)].filter(H);return n.nodeType === Node.ELEMENT_NODE && f.length && "TEXTAREA" !== n.tagName ? f[0].isElementVisible() ? f.concat(this.getChildren(f[0])) : [] : f;
        }, this));
      }, f.prototype.newStackingContext = function (e, n) {
        var f = new U(n, e.getOpacity(), e.node, e.parent);e.cloneTo(f);var o = n ? f.getParentStack(this) : f.parent.stack;o.contexts.push(f), e.stack = f;
      }, f.prototype.createStackingContexts = function () {
        this.nodes.forEach(function (e) {
          A(e) && (this.isRootElement(e) || E(e) || x(e) || this.isBodyWithTransparentRoot(e) || e.hasTransform()) ? this.newStackingContext(e, !0) : A(e) && (j(e) && m(e) || q(e) || k(e)) ? this.newStackingContext(e, !1) : e.assignStack(e.parent.stack);
        }, this);
      }, f.prototype.isBodyWithTransparentRoot = function (e) {
        return "BODY" === e.node.nodeName && e.parent.color("backgroundColor").isTransparent();
      }, f.prototype.isRootElement = function (e) {
        return null === e.parent;
      }, f.prototype.sortStackingContexts = function (e) {
        e.contexts.sort(D(e.contexts.slice(0))), e.contexts.forEach(this.sortStackingContexts, this);
      }, f.prototype.parseTextBounds = function (e) {
        return function (n, f, o) {
          if ("none" !== e.parent.css("textDecoration").substr(0, 4) || 0 !== n.trim().length) {
            if (this.support.rangeBounds && !e.parent.hasTransform()) {
              var d = o.slice(0, f).join("").length;return this.getRangeBounds(e.node, d, n.length);
            }if (e.node && "string" == typeof e.node.data) {
              var i = e.node.splitText(n.length),
                  t = this.getWrapperBounds(e.node, e.parent.hasTransform());return e.node = i, t;
            }
          } else (!this.support.rangeBounds || e.parent.hasTransform()) && (e.node = e.node.splitText(n.length));return {};
        };
      }, f.prototype.getWrapperBounds = function (e, n) {
        var f = e.ownerDocument.createElement("html2canvaswrapper"),
            o = e.parentNode,
            d = e.cloneNode(!0);f.appendChild(e.cloneNode(!0)), o.replaceChild(f, e);var i = n ? Z(f) : X(f);return o.replaceChild(d, f), i;
      }, f.prototype.getRangeBounds = function (e, n, f) {
        var o = this.range || (this.range = e.ownerDocument.createRange());return o.setStart(e, n), o.setEnd(e, n + f), o.getBoundingClientRect();
      }, f.prototype.parse = function (e) {
        var n = e.contexts.filter(c),
            f = e.children.filter(A),
            o = f.filter(z(k)),
            d = o.filter(z(j)).filter(z(r)),
            t = f.filter(z(j)).filter(k),
            l = o.filter(z(j)).filter(r),
            s = e.contexts.concat(o.filter(j)).filter(m),
            u = e.children.filter(C).filter(w),
            a = e.contexts.filter(y);n.concat(d).concat(t).concat(l).concat(s).concat(u).concat(a).forEach(function (e) {
          this.renderQueue.push(e), v(e) && (this.parse(e), this.renderQueue.push(new i()));
        }, this);
      }, f.prototype.paint = function (e) {
        try {
          e instanceof i ? this.renderer.ctx.restore() : C(e) ? (B(e.parent) && e.parent.appendToDOM(), this.paintText(e), B(e.parent) && e.parent.cleanDOM()) : this.paintNode(e);
        } catch (n) {
          if (N(n), this.options.strict) throw n;
        }
      }, f.prototype.paintNode = function (e) {
        v(e) && (this.renderer.setOpacity(e.opacity), this.renderer.ctx.save(), e.hasTransform() && this.renderer.setTransform(e.parseTransform())), "INPUT" === e.node.nodeName && "checkbox" === e.node.type ? this.paintCheckbox(e) : "INPUT" === e.node.nodeName && "radio" === e.node.type ? this.paintRadio(e) : this.paintElement(e);
      }, f.prototype.paintElement = function (e) {
        var n = e.parseBounds();this.renderer.clip(e.backgroundClip, function () {
          this.renderer.renderBackground(e, n, e.borders.borders.map(G));
        }, this), this.renderer.clip(e.clip, function () {
          this.renderer.renderBorders(e.borders.borders);
        }, this), this.renderer.clip(e.backgroundClip, function () {
          switch (e.node.nodeName) {case "svg":case "IFRAME":
              var f = this.images.get(e.node);f ? this.renderer.renderImage(e, n, e.borders, f) : N("Error loading <" + e.node.nodeName + ">", e.node);break;case "IMG":
              var o = this.images.get(e.node.src);o ? this.renderer.renderImage(e, n, e.borders, o) : N("Error loading <img>", e.node.src);break;case "CANVAS":
              this.renderer.renderImage(e, n, e.borders, { image: e.node });break;case "SELECT":case "INPUT":case "TEXTAREA":
              this.paintFormValue(e);}
        }, this);
      }, f.prototype.paintCheckbox = function (e) {
        var n = e.parseBounds(),
            f = Math.min(n.width, n.height),
            o = { width: f - 1, height: f - 1, top: n.top, left: n.left },
            d = [3, 3],
            i = [d, d, d, d],
            l = [1, 1, 1, 1].map(function (e) {
          return { color: new T("#A5A5A5"), width: e };
        }),
            u = s(o, i, l);this.renderer.clip(e.backgroundClip, function () {
          this.renderer.rectangle(o.left + 1, o.top + 1, o.width - 2, o.height - 2, new T("#DEDEDE")), this.renderer.renderBorders(t(l, o, u, i)), e.node.checked && (this.renderer.font(new T("#424242"), "normal", "normal", "bold", f - 3 + "px", "arial"), this.renderer.text("✔", o.left + f / 6, o.top + f - 1));
        }, this);
      }, f.prototype.paintRadio = function (e) {
        var n = e.parseBounds(),
            f = Math.min(n.width, n.height) - 2;this.renderer.clip(e.backgroundClip, function () {
          this.renderer.circleStroke(n.left + 1, n.top + 1, f, new T("#DEDEDE"), 1, new T("#A5A5A5")), e.node.checked && this.renderer.circle(Math.ceil(n.left + f / 4) + 1, Math.ceil(n.top + f / 4) + 1, Math.floor(f / 2), new T("#424242"));
        }, this);
      }, f.prototype.paintFormValue = function (e) {
        var n = e.getValue();if (n.length > 0) {
          var f = e.node.ownerDocument,
              o = f.createElement("html2canvaswrapper"),
              d = ["lineHeight", "textAlign", "fontFamily", "fontWeight", "fontSize", "color", "paddingLeft", "paddingTop", "paddingRight", "paddingBottom", "width", "height", "borderLeftStyle", "borderTopStyle", "borderLeftWidth", "borderTopWidth", "boxSizing", "whiteSpace", "wordWrap"];d.forEach(function (n) {
            try {
              o.style[n] = e.css(n);
            } catch (f) {
              N("html2canvas: Parse: Exception caught in renderFormValue: " + f.message);
            }
          });var i = e.parseBounds();o.style.position = "fixed", o.style.left = i.left + "px", o.style.top = i.top + "px", o.textContent = n, f.body.appendChild(o), this.paintText(new Q(o.firstChild, e)), f.body.removeChild(o);
        }
      }, f.prototype.paintText = function (e) {
        e.applyTextTransform();var n = O.ucs2.decode(e.node.data),
            f = this.options.letterRendering && !b(e) || M(e.node.data) ? n.map(function (e) {
          return O.ucs2.encode([e]);
        }) : K(n),
            o = e.parent.fontWeight(),
            d = e.parent.css("fontSize"),
            i = e.parent.css("fontFamily"),
            t = e.parent.parseTextShadows();this.renderer.font(e.parent.color("color"), e.parent.css("fontStyle"), e.parent.css("fontVariant"), o, d, i), t.length ? this.renderer.fontShadow(t[0].color, t[0].offsetX, t[0].offsetY, t[0].blur) : this.renderer.clearShadow(), this.renderer.clip(e.parent.clip, function () {
          f.map(this.parseTextBounds(e), this).forEach(function (n, o) {
            n && (this.renderer.text(f[o], n.left, n.bottom), this.renderTextDecoration(e.parent, n, this.fontMetrics.getMetrics(i, d)));
          }, this);
        }, this);
      }, f.prototype.renderTextDecoration = function (e, n, f) {
        switch (e.css("textDecoration").split(" ")[0]) {case "underline":
            this.renderer.rectangle(n.left, Math.round(n.top + f.baseline + f.lineWidth), n.width, 1, e.color("color"));break;case "overline":
            this.renderer.rectangle(n.left, Math.round(n.top), n.width, 1, e.color("color"));break;case "line-through":
            this.renderer.rectangle(n.left, Math.ceil(n.top + f.middle + f.lineWidth), n.width, 1, e.color("color"));}
      };var $ = { inset: [["darken", .6], ["darken", .1], ["darken", .1], ["darken", .6]] };f.prototype.parseBorders = function (e) {
        var n = e.parseBounds(),
            f = g(e),
            o = ["Top", "Right", "Bottom", "Left"].map(function (n, f) {
          var o = e.css("border" + n + "Style"),
              d = e.color("border" + n + "Color");"inset" === o && d.isBlack() && (d = new T([255, 255, 255, d.a]));var i = $[o] ? $[o][f] : null;return { width: e.cssInt("border" + n + "Width"), color: i ? d[i[0]](i[1]) : d, args: null };
        }),
            d = s(n, f, o);return { clip: this.parseBackgroundClip(e, d, o, f, n), borders: t(o, n, d, f) };
      }, f.prototype.parseBackgroundClip = function (e, n, f, o, d) {
        var i = e.css("backgroundClip"),
            t = [];switch (i) {case "content-box":case "padding-box":
            p(t, o[0], o[1], n.topLeftInner, n.topRightInner, d.left + f[3].width, d.top + f[0].width), p(t, o[1], o[2], n.topRightInner, n.bottomRightInner, d.left + d.width - f[1].width, d.top + f[0].width), p(t, o[2], o[3], n.bottomRightInner, n.bottomLeftInner, d.left + d.width - f[1].width, d.top + d.height - f[2].width), p(t, o[3], o[0], n.bottomLeftInner, n.topLeftInner, d.left + f[3].width, d.top + d.height - f[2].width);break;default:
            p(t, o[0], o[1], n.topLeftOuter, n.topRightOuter, d.left, d.top), p(t, o[1], o[2], n.topRightOuter, n.bottomRightOuter, d.left + d.width, d.top), p(t, o[2], o[3], n.bottomRightOuter, n.bottomLeftOuter, d.left + d.width, d.top + d.height), p(t, o[3], o[0], n.bottomLeftOuter, n.topLeftOuter, d.left, d.top + d.height);}return t;
      }, n.exports = f;
    }, { "./color": 3, "./fontmetrics": 7, "./log": 13, "./nodecontainer": 14, "./pseudoelementcontainer": 18, "./stackingcontext": 21, "./textcontainer": 25, "./utils": 26, punycode: 1 }], 16: [function (e, n, f) {
      function o(e, n, f) {
        var o = "withCredentials" in new XMLHttpRequest();if (!n) return Promise.reject("No proxy configured");var d = t(o),
            s = l(n, e, d);return o ? a(s) : i(f, s, d).then(function (e) {
          return m(e.content);
        });
      }function d(e, n, f) {
        var o = "crossOrigin" in new Image(),
            d = t(o),
            s = l(n, e, d);return o ? Promise.resolve(s) : i(f, s, d).then(function (e) {
          return "data:" + e.type + ";base64," + e.content;
        });
      }function i(e, n, f) {
        return new Promise(function (o, d) {
          var i = e.createElement("script"),
              t = function t() {
            delete window.html2canvas.proxy[f], e.body.removeChild(i);
          };window.html2canvas.proxy[f] = function (e) {
            t(), o(e);
          }, i.src = n, i.onerror = function (e) {
            t(), d(e);
          }, e.body.appendChild(i);
        });
      }function t(e) {
        return e ? "" : "html2canvas_" + Date.now() + "_" + ++r + "_" + Math.round(1e5 * Math.random());
      }function l(e, n, f) {
        return e + "?url=" + encodeURIComponent(n) + (f.length ? "&callback=html2canvas.proxy." + f : "");
      }function s(e) {
        return function (n) {
          var f,
              o = new DOMParser();try {
            f = o.parseFromString(n, "text/html");
          } catch (d) {
            c("DOMParser not supported, falling back to createHTMLDocument"), f = document.implementation.createHTMLDocument("");try {
              f.open(), f.write(n), f.close();
            } catch (i) {
              c("createHTMLDocument write not supported, falling back to document.body.innerHTML"), f.body.innerHTML = n;
            }
          }var t = f.querySelector("base");if (!t || !t.href.host) {
            var l = f.createElement("base");l.href = e, f.head.insertBefore(l, f.head.firstChild);
          }return f;
        };
      }function u(e, n, f, d, i, t) {
        return new o(e, n, window.document).then(s(e)).then(function (e) {
          return y(e, f, d, i, t, 0, 0);
        });
      }var a = e("./xhr"),
          p = e("./utils"),
          c = e("./log"),
          y = e("./clone"),
          m = p.decode64,
          r = 0;f.Proxy = o, f.ProxyURL = d, f.loadUrlDocument = u;
    }, { "./clone": 2, "./log": 13, "./utils": 26, "./xhr": 28 }], 17: [function (e, n) {
      function f(e, n) {
        var f = document.createElement("a");f.href = e, e = f.href, this.src = e, this.image = new Image();var d = this;this.promise = new Promise(function (f, i) {
          d.image.crossOrigin = "Anonymous", d.image.onload = f, d.image.onerror = i, new o(e, n, document).then(function (e) {
            d.image.src = e;
          })["catch"](i);
        });
      }var o = e("./proxy").ProxyURL;n.exports = f;
    }, { "./proxy": 16 }], 18: [function (e, n) {
      function f(e, n, f) {
        o.call(this, e, n), this.isPseudoElement = !0, this.before = ":before" === f;
      }var o = e("./nodecontainer");f.prototype.cloneTo = function (e) {
        f.prototype.cloneTo.call(this, e), e.isPseudoElement = !0, e.before = this.before;
      }, f.prototype = Object.create(o.prototype), f.prototype.appendToDOM = function () {
        this.before ? this.parent.node.insertBefore(this.node, this.parent.node.firstChild) : this.parent.node.appendChild(this.node), this.parent.node.className += " " + this.getHideClass();
      }, f.prototype.cleanDOM = function () {
        this.node.parentNode.removeChild(this.node), this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "");
      }, f.prototype.getHideClass = function () {
        return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")];
      }, f.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before", f.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after", n.exports = f;
    }, { "./nodecontainer": 14 }], 19: [function (e, n) {
      function f(e, n, f, o, d) {
        this.width = e, this.height = n, this.images = f, this.options = o, this.document = d;
      }var o = e("./log");f.prototype.renderImage = function (e, n, f, o) {
        var d = e.cssInt("paddingLeft"),
            i = e.cssInt("paddingTop"),
            t = e.cssInt("paddingRight"),
            l = e.cssInt("paddingBottom"),
            s = f.borders,
            u = n.width - (s[1].width + s[3].width + d + t),
            a = n.height - (s[0].width + s[2].width + i + l);this.drawImage(o, 0, 0, o.image.width || u, o.image.height || a, n.left + d + s[3].width, n.top + i + s[0].width, u, a);
      }, f.prototype.renderBackground = function (e, n, f) {
        n.height > 0 && n.width > 0 && (this.renderBackgroundColor(e, n), this.renderBackgroundImage(e, n, f));
      }, f.prototype.renderBackgroundColor = function (e, n) {
        var f = e.color("backgroundColor");f.isTransparent() || this.rectangle(n.left, n.top, n.width, n.height, f);
      }, f.prototype.renderBorders = function (e) {
        e.forEach(this.renderBorder, this);
      }, f.prototype.renderBorder = function (e) {
        e.color.isTransparent() || null === e.args || this.drawShape(e.args, e.color);
      }, f.prototype.renderBackgroundImage = function (e, n, f) {
        var d = e.parseBackgroundImages();d.reverse().forEach(function (d, i, t) {
          switch (d.method) {case "url":
              var l = this.images.get(d.args[0]);l ? this.renderBackgroundRepeating(e, n, l, t.length - (i + 1), f) : o("Error loading background-image", d.args[0]);break;case "linear-gradient":case "gradient":
              var s = this.images.get(d.value);s ? this.renderBackgroundGradient(s, n, f) : o("Error loading background-image", d.args[0]);break;case "none":
              break;default:
              o("Unknown background-image type", d.args[0]);}
        }, this);
      }, f.prototype.renderBackgroundRepeating = function (e, n, f, o, d) {
        var i = e.parseBackgroundSize(n, f.image, o),
            t = e.parseBackgroundPosition(n, f.image, o, i),
            l = e.parseBackgroundRepeat(o);switch (l) {case "repeat-x":case "repeat no-repeat":
            this.backgroundRepeatShape(f, t, i, n, n.left + d[3], n.top + t.top + d[0], 99999, i.height, d);break;case "repeat-y":case "no-repeat repeat":
            this.backgroundRepeatShape(f, t, i, n, n.left + t.left + d[3], n.top + d[0], i.width, 99999, d);break;case "no-repeat":
            this.backgroundRepeatShape(f, t, i, n, n.left + t.left + d[3], n.top + t.top + d[0], i.width, i.height, d);break;default:
            this.renderBackgroundRepeat(f, t, i, { top: n.top, left: n.left }, d[3], d[0]);}
      }, n.exports = f;
    }, { "./log": 13 }], 20: [function (e, n) {
      function f(e, n) {
        d.apply(this, arguments), this.canvas = this.options.canvas || this.document.createElement("canvas"), this.options.canvas || (this.canvas.width = e, this.canvas.height = n), this.ctx = this.canvas.getContext("2d"), this.taintCtx = this.document.createElement("canvas").getContext("2d"), this.ctx.textBaseline = "bottom", this.variables = {}, t("Initialized CanvasRenderer with size", e, "x", n);
      }function o(e) {
        return e.length > 0;
      }var d = e("../renderer"),
          i = e("../lineargradientcontainer"),
          t = e("../log");f.prototype = Object.create(d.prototype), f.prototype.setFillStyle = function (e) {
        return this.ctx.fillStyle = "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e.isColor ? e.toString() : e, this.ctx;
      }, f.prototype.rectangle = function (e, n, f, o, d) {
        this.setFillStyle(d).fillRect(e, n, f, o);
      }, f.prototype.circle = function (e, n, f, o) {
        this.setFillStyle(o), this.ctx.beginPath(), this.ctx.arc(e + f / 2, n + f / 2, f / 2, 0, 2 * Math.PI, !0), this.ctx.closePath(), this.ctx.fill();
      }, f.prototype.circleStroke = function (e, n, f, o, d, i) {
        this.circle(e, n, f, o), this.ctx.strokeStyle = i.toString(), this.ctx.stroke();
      }, f.prototype.drawShape = function (e, n) {
        this.shape(e), this.setFillStyle(n).fill();
      }, f.prototype.taints = function (e) {
        if (null === e.tainted) {
          this.taintCtx.drawImage(e.image, 0, 0);try {
            this.taintCtx.getImageData(0, 0, 1, 1), e.tainted = !1;
          } catch (n) {
            this.taintCtx = document.createElement("canvas").getContext("2d"), e.tainted = !0;
          }
        }return e.tainted;
      }, f.prototype.drawImage = function (e, n, f, o, d, i, t, l, s) {
        (!this.taints(e) || this.options.allowTaint) && this.ctx.drawImage(e.image, n, f, o, d, i, t, l, s);
      }, f.prototype.clip = function (e, n, f) {
        this.ctx.save(), e.filter(o).forEach(function (e) {
          this.shape(e).clip();
        }, this), n.call(f), this.ctx.restore();
      }, f.prototype.shape = function (e) {
        return this.ctx.beginPath(), e.forEach(function (e, n) {
          "rect" === e[0] ? this.ctx.rect.apply(this.ctx, e.slice(1)) : this.ctx[0 === n ? "moveTo" : e[0] + "To"].apply(this.ctx, e.slice(1));
        }, this), this.ctx.closePath(), this.ctx;
      }, f.prototype.font = function (e, n, f, o, d, i) {
        this.setFillStyle(e).font = [n, f, o, d, i].join(" ").split(",")[0];
      }, f.prototype.fontShadow = function (e, n, f, o) {
        this.setVariable("shadowColor", e.toString()).setVariable("shadowOffsetY", n).setVariable("shadowOffsetX", f).setVariable("shadowBlur", o);
      }, f.prototype.clearShadow = function () {
        this.setVariable("shadowColor", "rgba(0,0,0,0)");
      }, f.prototype.setOpacity = function (e) {
        this.ctx.globalAlpha = e;
      }, f.prototype.setTransform = function (e) {
        this.ctx.translate(e.origin[0], e.origin[1]), this.ctx.transform.apply(this.ctx, e.matrix), this.ctx.translate(-e.origin[0], -e.origin[1]);
      }, f.prototype.setVariable = function (e, n) {
        return this.variables[e] !== n && (this.variables[e] = this.ctx[e] = n), this;
      }, f.prototype.text = function (e, n, f) {
        this.ctx.fillText(e, n, f);
      }, f.prototype.backgroundRepeatShape = function (e, n, f, o, d, i, t, l, s) {
        var u = [["line", Math.round(d), Math.round(i)], ["line", Math.round(d + t), Math.round(i)], ["line", Math.round(d + t), Math.round(l + i)], ["line", Math.round(d), Math.round(l + i)]];this.clip([u], function () {
          this.renderBackgroundRepeat(e, n, f, o, s[3], s[0]);
        }, this);
      }, f.prototype.renderBackgroundRepeat = function (e, n, f, o, d, i) {
        var t = Math.round(o.left + n.left + d),
            l = Math.round(o.top + n.top + i);this.setFillStyle(this.ctx.createPattern(this.resizeImage(e, f), "repeat")), this.ctx.translate(t, l), this.ctx.fill(), this.ctx.translate(-t, -l);
      }, f.prototype.renderBackgroundGradient = function (e, n) {
        if (e instanceof i) {
          var f = this.ctx.createLinearGradient(n.left + n.width * e.x0, n.top + n.height * e.y0, n.left + n.width * e.x1, n.top + n.height * e.y1);e.colorStops.forEach(function (e) {
            f.addColorStop(e.stop, e.color.toString());
          }), this.rectangle(n.left, n.top, n.width, n.height, f);
        }
      }, f.prototype.resizeImage = function (e, n) {
        var f = e.image;if (f.width === n.width && f.height === n.height) return f;var o,
            d = document.createElement("canvas");return d.width = n.width, d.height = n.height, o = d.getContext("2d"), o.drawImage(f, 0, 0, f.width, f.height, 0, 0, n.width, n.height), d;
      }, n.exports = f;
    }, { "../lineargradientcontainer": 12, "../log": 13, "../renderer": 19 }], 21: [function (e, n) {
      function f(e, n, f, d) {
        o.call(this, f, d), this.ownStacking = e, this.contexts = [], this.children = [], this.opacity = (this.parent ? this.parent.stack.opacity : 1) * n;
      }var o = e("./nodecontainer");f.prototype = Object.create(o.prototype), f.prototype.getParentStack = function (e) {
        var n = this.parent ? this.parent.stack : null;return n ? n.ownStacking ? n : n.getParentStack(e) : e.stack;
      }, n.exports = f;
    }, { "./nodecontainer": 14 }], 22: [function (e, n) {
      function f(e) {
        this.rangeBounds = this.testRangeBounds(e), this.cors = this.testCORS(), this.svg = this.testSVG();
      }f.prototype.testRangeBounds = function (e) {
        var n,
            f,
            o,
            d,
            i = !1;return e.createRange && (n = e.createRange(), n.getBoundingClientRect && (f = e.createElement("boundtest"), f.style.height = "123px", f.style.display = "block", e.body.appendChild(f), n.selectNode(f), o = n.getBoundingClientRect(), d = o.height, 123 === d && (i = !0), e.body.removeChild(f))), i;
      }, f.prototype.testCORS = function () {
        return "undefined" != typeof new Image().crossOrigin;
      }, f.prototype.testSVG = function () {
        var e = new Image(),
            n = document.createElement("canvas"),
            f = n.getContext("2d");e.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try {
          f.drawImage(e, 0, 0), n.toDataURL();
        } catch (o) {
          return !1;
        }return !0;
      }, n.exports = f;
    }, {}], 23: [function (e, n) {
      function f(e) {
        this.src = e, this.image = null;var n = this;this.promise = this.hasFabric().then(function () {
          return n.isInline(e) ? Promise.resolve(n.inlineFormatting(e)) : o(e);
        }).then(function (e) {
          return new Promise(function (f) {
            window.html2canvas.svg.fabric.loadSVGFromString(e, n.createCanvas.call(n, f));
          });
        });
      }var o = e("./xhr"),
          d = e("./utils").decode64;f.prototype.hasFabric = function () {
        return window.html2canvas.svg && window.html2canvas.svg.fabric ? Promise.resolve() : Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg"));
      }, f.prototype.inlineFormatting = function (e) {
        return (/^data:image\/svg\+xml;base64,/.test(e) ? this.decode64(this.removeContentType(e)) : this.removeContentType(e)
        );
      }, f.prototype.removeContentType = function (e) {
        return e.replace(/^data:image\/svg\+xml(;base64)?,/, "");
      }, f.prototype.isInline = function (e) {
        return (/^data:image\/svg\+xml/i.test(e)
        );
      }, f.prototype.createCanvas = function (e) {
        var n = this;return function (f, o) {
          var d = new window.html2canvas.svg.fabric.StaticCanvas("c");n.image = d.lowerCanvasEl, d.setWidth(o.width).setHeight(o.height).add(window.html2canvas.svg.fabric.util.groupSVGElements(f, o)).renderAll(), e(d.lowerCanvasEl);
        };
      }, f.prototype.decode64 = function (e) {
        return "function" == typeof window.atob ? window.atob(e) : d(e);
      }, n.exports = f;
    }, { "./utils": 26, "./xhr": 28 }], 24: [function (e, n) {
      function f(e, n) {
        this.src = e, this.image = null;var f = this;this.promise = n ? new Promise(function (n, o) {
          f.image = new Image(), f.image.onload = n, f.image.onerror = o, f.image.src = "data:image/svg+xml," + new XMLSerializer().serializeToString(e), f.image.complete === !0 && n(f.image);
        }) : this.hasFabric().then(function () {
          return new Promise(function (n) {
            window.html2canvas.svg.fabric.parseSVGDocument(e, f.createCanvas.call(f, n));
          });
        });
      }var o = e("./svgcontainer");f.prototype = Object.create(o.prototype), n.exports = f;
    }, { "./svgcontainer": 23 }], 25: [function (e, n) {
      function f(e, n) {
        d.call(this, e, n);
      }function o(e, n, f) {
        return e.length > 0 ? n + f.toUpperCase() : void 0;
      }var d = e("./nodecontainer");f.prototype = Object.create(d.prototype), f.prototype.applyTextTransform = function () {
        this.node.data = this.transform(this.parent.css("textTransform"));
      }, f.prototype.transform = function (e) {
        var n = this.node.data;switch (e) {case "lowercase":
            return n.toLowerCase();case "capitalize":
            return n.replace(/(^|\s|:|-|\(|\))([a-z])/g, o);case "uppercase":
            return n.toUpperCase();default:
            return n;}
      }, n.exports = f;
    }, { "./nodecontainer": 14 }], 26: [function (e, n, f) {
      f.smallImage = function () {
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      }, f.bind = function (e, n) {
        return function () {
          return e.apply(n, arguments);
        };
      }, f.decode64 = function (e) {
        var n,
            f,
            o,
            d,
            i,
            t,
            l,
            s,
            u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            a = e.length,
            p = "";for (n = 0; a > n; n += 4) {
          f = u.indexOf(e[n]), o = u.indexOf(e[n + 1]), d = u.indexOf(e[n + 2]), i = u.indexOf(e[n + 3]), t = f << 2 | o >> 4, l = (15 & o) << 4 | d >> 2, s = (3 & d) << 6 | i, p += 64 === d ? String.fromCharCode(t) : 64 === i || -1 === i ? String.fromCharCode(t, l) : String.fromCharCode(t, l, s);
        }return p;
      }, f.getBounds = function (e) {
        if (e.getBoundingClientRect) {
          var n = e.getBoundingClientRect(),
              f = null == e.offsetWidth ? n.width : e.offsetWidth;return { top: n.top, bottom: n.bottom || n.top + n.height, right: n.left + f, left: n.left, width: f, height: null == e.offsetHeight ? n.height : e.offsetHeight };
        }return {};
      }, f.offsetBounds = function (e) {
        var n = e.offsetParent ? f.offsetBounds(e.offsetParent) : { top: 0, left: 0 };return { top: e.offsetTop + n.top, bottom: e.offsetTop + e.offsetHeight + n.top, right: e.offsetLeft + n.left + e.offsetWidth, left: e.offsetLeft + n.left, width: e.offsetWidth, height: e.offsetHeight };
      }, f.parseBackgrounds = function (e) {
        var n,
            f,
            o,
            d,
            i,
            t,
            l,
            s = " \r\n	",
            u = [],
            a = 0,
            p = 0,
            c = function c() {
          n && ('"' === f.substr(0, 1) && (f = f.substr(1, f.length - 2)), f && l.push(f), "-" === n.substr(0, 1) && (d = n.indexOf("-", 1) + 1) > 0 && (o = n.substr(0, d), n = n.substr(d)), u.push({ prefix: o, method: n.toLowerCase(), value: i, args: l, image: null })), l = [], n = o = f = i = "";
        };return l = [], n = o = f = i = "", e.split("").forEach(function (e) {
          if (!(0 === a && s.indexOf(e) > -1)) {
            switch (e) {case '"':
                t ? t === e && (t = null) : t = e;break;case "(":
                if (t) break;if (0 === a) return a = 1, void (i += e);p++;break;case ")":
                if (t) break;if (1 === a) {
                  if (0 === p) return a = 0, i += e, void c();p--;
                }break;case ",":
                if (t) break;if (0 === a) return void c();if (1 === a && 0 === p && !n.match(/^url$/i)) return l.push(f), f = "", void (i += e);}i += e, 0 === a ? n += e : f += e;
          }
        }), c(), u;
      };
    }, {}], 27: [function (e, n) {
      function f(e) {
        o.apply(this, arguments), this.type = "linear" === e.args[0] ? o.TYPES.LINEAR : o.TYPES.RADIAL;
      }var o = e("./gradientcontainer");f.prototype = Object.create(o.prototype), n.exports = f;
    }, { "./gradientcontainer": 9 }], 28: [function (e, n) {
      function f(e) {
        return new Promise(function (n, f) {
          var o = new XMLHttpRequest();o.open("GET", e), o.onload = function () {
            200 === o.status ? n(o.responseText) : f(new Error(o.statusText));
          }, o.onerror = function () {
            f(new Error("Network Error"));
          }, o.send();
        });
      }n.exports = f;
    }, {}] }, {}, [4])(4);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(2, function() {
			var newContent = __webpack_require__(2);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(5, function() {
			var newContent = __webpack_require__(5);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(6, function() {
			var newContent = __webpack_require__(6);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })
/******/ ]);