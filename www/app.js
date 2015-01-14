(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/main.js":[function(require,module,exports){
/* application entry point */

window.m = require('mithril');

var play = require('./play');
var session = require('./session');

function main() {
  m.route(document.body, '/play', {
    '/play': play,
    '/play/:id': play
  });

  session.refresh();

  document.addEventListener('backbutton', function () {
    // todo
    window.navigator.app.exitApp();
  }, false);


  if (window.cordova) {
    setTimeout(function() {
      window.navigator.splashscreen.hide();
    }, 2000);
  }
}

window.document.addEventListener(window.cordova ? 'deviceready' : 'DOMContentLoaded', main, false);

},{"./play":"/Users/renaudbressand/Work/v2/lichobile/src/js/play/index.js","./session":"/Users/renaudbressand/Work/v2/lichobile/src/js/session.js","mithril":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mithril/mithril.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/node_modules/merge/merge.js":[function(require,module,exports){
/*!
 * @name JavaScript/NodeJS Merge v1.2.0
 * @author yeikos
 * @repository https://github.com/yeikos/js.merge

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function(isNode) {

	/**
	 * Merge one or more objects 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	var Public = function(clone) {

		return merge(clone === true, false, arguments);

	}, publicName = 'merge';

	/**
	 * Merge two or more objects recursively 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	Public.recursive = function(clone) {

		return merge(clone === true, true, arguments);

	};

	/**
	 * Clone the input removing any reference
	 * @param mixed input
	 * @return mixed
	 */

	Public.clone = function(input) {

		var output = input,
			type = typeOf(input),
			index, size;

		if (type === 'array') {

			output = [];
			size = input.length;

			for (index=0;index<size;++index)

				output[index] = Public.clone(input[index]);

		} else if (type === 'object') {

			output = {};

			for (index in input)

				output[index] = Public.clone(input[index]);

		}

		return output;

	};

	/**
	 * Merge two objects recursively
	 * @param mixed input
	 * @param mixed extend
	 * @return mixed
	 */

	function merge_recursive(base, extend) {

		if (typeOf(base) !== 'object')

			return extend;

		for (var key in extend) {

			if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

				base[key] = merge_recursive(base[key], extend[key]);

			} else {

				base[key] = extend[key];

			}

		}

		return base;

	}

	/**
	 * Merge two or more objects
	 * @param bool clone
	 * @param bool recursive
	 * @param array argv
	 * @return object
	 */

	function merge(clone, recursive, argv) {

		var result = argv[0],
			size = argv.length;

		if (clone || typeOf(result) !== 'object')

			result = {};

		for (var index=0;index<size;++index) {

			var item = argv[index],

				type = typeOf(item);

			if (type !== 'object') continue;

			for (var key in item) {

				var sitem = clone ? Public.clone(item[key]) : item[key];

				if (recursive) {

					result[key] = merge_recursive(result[key], sitem);

				} else {

					result[key] = sitem;

				}

			}

		}

		return result;

	}

	/**
	 * Get type of variable
	 * @param mixed input
	 * @return string
	 *
	 * @see http://jsperf.com/typeofvar
	 */

	function typeOf(input) {

		return ({}).toString.call(input).slice(8, -1).toLowerCase();

	}

	if (isNode) {

		module.exports = Public;

	} else {

		window[publicName] = Public;

	}

})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/anim.js":[function(require,module,exports){
var m = require('mithril');
var util = require('./util');

// https://gist.github.com/gre/1650294
var easing = {
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
};

function makePiece(k, piece, invert) {
  var key = invert ? util.invertKey(k) : k;
  return {
    key: key,
    pos: util.key2pos(key),
    role: piece.role,
    color: piece.color
  };
}

function samePiece(p1, p2) {
  return p1.role === p2.role && p1.color === p2.color;
}

function closer(piece, pieces) {
  return pieces.sort(function(p1, p2) {
    return util.distance(piece.pos, p1.pos) - util.distance(piece.pos, p2.pos);
  })[0];
}

function computePlan(prev, current) {
  var bounds = current.bounds(),
    width = bounds.width / 8,
    height = bounds.height / 8,
    anims = {},
    animedOrigs = [],
    fadings = [],
    missings = [],
    news = [],
    invert = prev.orientation !== current.orientation,
    prePieces = {},
    white = current.orientation === 'white';
  for (var k in prev.pieces) {
    var piece = makePiece(k, prev.pieces[k], invert);
    prePieces[piece.key] = piece;
  }
  util.allKeys.forEach(function(k) {
    if (k !== current.movable.dropped[1]) {
      var curP = current.pieces[k];
      var preP = prePieces[k];
      if (curP) {
        if (preP) {
          if (!samePiece(curP, preP)) {
            missings.push(preP);
            news.push(makePiece(k, curP, false));
          }
        } else
          news.push(makePiece(k, curP, false));
      } else if (preP)
        missings.push(preP);
    }
  });
  news.forEach(function(newP) {
    var preP = closer(newP, missings.filter(util.partial(samePiece, newP)));
    if (preP) {
      var orig = white ? preP.pos : newP.pos;
      var dest = white ? newP.pos : preP.pos;
      var vector = [(orig[0] - dest[0]) * width, (dest[1] - orig[1]) * height];
      anims[newP.key] = [vector, vector];
      animedOrigs.push(preP.key);
    }
  });
  missings.forEach(function(p) {
    if (p.key !== current.movable.dropped[0] && !util.containsX(animedOrigs, p.key)) {
      fadings.push({
        piece: {
          role: p.role,
          color: p.color
        },
        left: 12.5 * (white ? (p.pos[0] - 1) : (8 - p.pos[0])) + '%',
        bottom: 12.5 * (white ? (p.pos[1] - 1) : (8 - p.pos[1])) + '%',
        opacity: 1
      });
    }
  });

  return {
    anims: anims,
    fadings: fadings
  };
}

function roundBy(n, by) {
  return Math.round(n * by) / by;
}

function go(data) {
  if (!data.animation.current.start) return; // animation was canceled
  var rest = 1 - (new Date().getTime() - data.animation.current.start) / data.animation.current.duration;
  if (rest <= 0) {
    data.animation.current = {};
    data.render();
  } else {
    var ease = easing.easeInOutCubic(rest);
    for (var key in data.animation.current.anims) {
      var cfg = data.animation.current.anims[key];
      cfg[1] = [roundBy(cfg[0][0] * ease, 10), roundBy(cfg[0][1] * ease, 10)];
    }
    for (var i in data.animation.current.fadings) {
      data.animation.current.fadings[i].opacity = roundBy(ease, 100)
    }
    data.render();
    requestAnimationFrame(function() {
      go(data);
    });
  }
}

function animate(transformation, data) {
  // clone data
  var prev = {
    orientation: data.orientation,
    pieces: {}
  };
  // clone pieces
  for (var key in data.pieces) {
    prev.pieces[key] = {
      role: data.pieces[key].role,
      color: data.pieces[key].color
    };
  }
  var result = transformation();
  var plan = computePlan(prev, data);
  if (Object.keys(plan.anims).length > 0 || plan.fadings.length > 0) {
    var alreadyRunning = data.animation.current.start;
    data.animation.current = {
      start: new Date().getTime(),
      duration: data.animation.duration,
      anims: plan.anims,
      fadings: plan.fadings
    };
    if (!alreadyRunning) go(data);
  } else {
    // don't animate, just render right away
    data.renderRAF();
  }
  return result;
}

// transformation is a function
// accepts board data and any number of arguments,
// and mutates the board.
module.exports = function(transformation, data, skip) {
  return function() {
    var transformationArgs = [data].concat(Array.prototype.slice.call(arguments, 0));
    if (!data.render) return transformation.apply(null, transformationArgs);
    else if (data.animation.enabled && !skip)
      return animate(util.partialApply(transformation, transformationArgs), data);
    else {
      var result = transformation.apply(null, transformationArgs);
      data.renderRAF();
      return result;
    }
  };
};

},{"./util":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/util.js","mithril":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mithril/mithril.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/api.js":[function(require,module,exports){
var m = require('mithril');
var board = require('./board');

module.exports = function(controller) {

  return {
    set: controller.set,
    toggleOrientation: controller.toggleOrientation,
    getOrientation: function () {
      return controller.data.orientation;
    },
    getPieces: function() {
      return controller.data.pieces;
    },
    getMaterialDiff: function() {
      return board.getMaterialDiff(controller.data);
    },
    getFen: controller.getFen,
    dump: function() {
      return controller.data;
    },
    move: controller.apiMove,
    setPieces: controller.setPieces,
    setCheck: controller.setCheck,
    playPremove: controller.playPremove,
    cancelPremove: controller.cancelPremove,
    cancelMove: controller.cancelMove,
    stop: controller.stop
  };
};

},{"./board":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/board.js","mithril":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mithril/mithril.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/board.js":[function(require,module,exports){
var util = require('./util');
var premove = require('./premove');
var anim = require('./anim');
var hold = require('./hold');

function callUserFunction(f) {
  setTimeout(f, 1);
}

function toggleOrientation(data) {
  data.orientation = util.opposite(data.orientation);
}

function reset(data) {
  data.lastMove = null;
  setSelected(data, null);
  unsetPremove(data);
}

function setPieces(data, pieces) {
  Object.keys(pieces).forEach(function(key) {
    if (pieces[key]) data.pieces[key] = pieces[key];
    else delete data.pieces[key];
  });
  data.movable.dropped = [];
}

function setCheck(data, color) {
  var checkColor = color || data.turnColor;
  Object.keys(data.pieces).forEach(function(key) {
    if (data.pieces[key].color === checkColor && data.pieces[key].role === 'king') data.check = key;
  });
}

function setPremove(data, orig, dest) {
  data.premovable.current = [orig, dest];
  callUserFunction(util.partial(data.premovable.events.set, orig, dest));
}

function unsetPremove(data) {
  if (data.premovable.current) {
    data.premovable.current = null;
    callUserFunction(data.premovable.events.unset);
  }
}

function baseMove(data, orig, dest) {
  var success = anim(function() {
    if (orig === dest || !data.pieces[orig]) return false;
    if (data.pieces[dest]) callUserFunction(util.partial(data.events.capture, dest, data.pieces[dest]));
    data.pieces[dest] = data.pieces[orig];
    delete data.pieces[orig];
    data.lastMove = [orig, dest];
    data.check = null;
    callUserFunction(data.events.change);
    return true;
  }, data)();
  if (success) data.movable.dropped = [];
  return success;
}

function baseUserMove(data, orig, dest) {
  var result = baseMove(data, orig, dest);
  if (result) {
    data.movable.dests = {};
    data.turnColor = util.opposite(data.turnColor);
  }
  return result;
}

function apiMove(data, orig, dest) {
  return baseMove(data, orig, dest);
}

function userMove(data, orig, dest) {
  if (!dest) {
    setSelected(data, null);
    if (data.movable.dropOff === 'trash') {
      delete data.pieces[orig];
      callUserFunction(data.events.change);
    }
  } else if (canMove(data, orig, dest)) {
    if (baseUserMove(data, orig, dest)) {
      setSelected(data, null);
      callUserFunction(util.partial(data.movable.events.after, orig, dest, {
        premove: false,
        holdTime: hold.stop()
      }));
    }
  } else if (canPremove(data, orig, dest)) {
    setPremove(data, orig, dest);
    setSelected(data, null);
  } else if (isMovable(data, dest) || isPremovable(data, dest))
    setSelected(data, dest);
  else setSelected(data, null);
}

function selectSquare(data, key) {
  if (data.selected) {
    if (key) {
      if (data.selected !== key) userMove(data, data.selected, key);
    } else setSelected(data, null);
  } else if (isMovable(data, key) || isPremovable(data, key)) setSelected(data, key);
  if (key) callUserFunction(util.partial(data.events.select, key));
}

function setSelected(data, key) {
  data.selected = key;
  if (key && isPremovable(data, key))
    data.premovable.dests = premove(data.pieces, key);
  else
    data.premovable.dests = null;
}

function isMovable(data, orig) {
  var piece = data.pieces[orig];
  return piece && (
    data.movable.color === 'both' || (
      data.movable.color === piece.color &&
      data.turnColor === piece.color
    ));
}

function canMove(data, orig, dest) {
  return orig !== dest && isMovable(data, orig) && (
    data.movable.free || util.containsX(data.movable.dests[orig], dest)
  );
}

function isPremovable(data, orig) {
  var piece = data.pieces[orig];
  return piece && data.premovable.enabled &&
    data.movable.color === piece.color &&
    data.turnColor !== piece.color;
}

function canPremove(data, orig, dest) {
  return orig !== dest &&
    isPremovable(data, orig) &&
    util.containsX(premove(data.pieces, orig), dest);
}

function isDraggable(data, orig) {
  var piece = data.pieces[orig];
  return piece && data.draggable.enabled && (
    data.movable.color === 'both' || (
      data.movable.color === piece.color && (
        data.turnColor === piece.color || data.premovable.enabled
      )
    )
  );
}

function playPremove(data) {
  var move = data.premovable.current;
  if (!move) return;
  var orig = move[0],
    dest = move[1];
  if (canMove(data, orig, dest)) {
    if (baseUserMove(data, orig, dest)) {
      callUserFunction(util.partial(data.movable.events.after, orig, dest, {
        premove: true
      }));
    }
  }
  unsetPremove(data);
}

function cancelMove(data) {
  unsetPremove(data);
  selectSquare(data, null);
}

function stop(data) {
  data.movable.color = null;
  data.movable.dests = {};
  cancelMove(data);
}

function getKeyAtDomPos(data, pos, bounds) {
  if (!bounds && !data.bounds) return;
  bounds = bounds || data.bounds(); // use provided value, or compute it
  var file = Math.ceil(8 * ((pos[0] - bounds.left) / bounds.width));
  file = data.orientation === 'white' ? file : 9 - file;
  var rank = Math.ceil(8 - (8 * ((pos[1] - bounds.top) / bounds.height)));
  rank = data.orientation === 'white' ? rank : 9 - rank;
  if (file > 0 && file < 9 && rank > 0 && rank < 9) return util.pos2key([file, rank]);
}

// {white: {pawn: 3 queen: 1}, black: {bishop: 2}}
function getMaterialDiff(data) {
  var counts = {
    king: 0,
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    pawn: 0
  };
  for (var k in data.pieces) {
    var p = data.pieces[k];
    counts[p.role] += ((p.color === 'white') ? 1 : -1);
  }
  var diff = {
    white: {},
    black: {}
  }
  for (var role in counts) {
    var c = counts[role];
    if (c > 0) diff.white[role] = c;
    else if (c < 0) diff.black[role] = -c;
  }
  return diff;
}

module.exports = {
  reset: reset,
  toggleOrientation: toggleOrientation,
  setPieces: setPieces,
  setCheck: setCheck,
  selectSquare: selectSquare,
  setSelected: setSelected,
  isDraggable: isDraggable,
  canMove: canMove,
  userMove: userMove,
  apiMove: apiMove,
  playPremove: playPremove,
  unsetPremove: unsetPremove,
  cancelMove: cancelMove,
  stop: stop,
  getKeyAtDomPos: getKeyAtDomPos,
  getMaterialDiff: getMaterialDiff
};

},{"./anim":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/anim.js","./hold":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/hold.js","./premove":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/premove.js","./util":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/util.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/configure.js":[function(require,module,exports){
var merge = require('merge')
var board = require('./board');
var fen = require('./fen');

module.exports = function(data, config) {

  if (!config) return;

  // don't merge destinations. Just override.
  if (config.movable && config.movable.dests) delete data.movable.dests;

  merge.recursive(data, config);

  // if a fen was provided, replace the pieces
  if (data.fen) {
    data.pieces = fen.read(data.fen);
    data.check = config.check;
    delete data.fen;
  }

  if (data.check === true) board.setCheck(data);

  // forget about the last dropped piece
  data.movable.dropped = [];

  // fix move/premove dests
  if (data.selected) board.setSelected(data, data.selected);

  // no need for such short animations
  if (data.animation.duration < 10) data.animation.enabled = false;
};

},{"./board":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/board.js","./fen":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/fen.js","merge":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/node_modules/merge/merge.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/ctrl.js":[function(require,module,exports){
var board = require('./board');
var data = require('./data');
var fen = require('./fen');
var configure = require('./configure');
var anim = require('./anim');
var drag = require('./drag');

module.exports = function(cfg) {

  this.data = data(cfg);

  this.getFen = function() {
    return fen.write(this.data.pieces);
  }.bind(this);

  this.set = anim(configure, this.data);

  this.toggleOrientation = anim(board.toggleOrientation, this.data);

  this.setPieces = anim(board.setPieces, this.data);

  this.selectSquare = anim(board.selectSquare, this.data, true);

  this.apiMove = anim(board.apiMove, this.data);

  this.playPremove = anim(board.playPremove, this.data);

  this.cancelPremove = anim(board.unsetPremove, this.data, true);

  this.setCheck = anim(board.setCheck, this.data, true);

  this.cancelMove = anim(function(data) {
    board.cancelMove(data);
    drag.cancel(data);
  }.bind(this), this.data, true);

  this.stop = anim(function(data) {
    board.stop(data);
    drag.cancel(data);
  }.bind(this), this.data, true);
};

},{"./anim":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/anim.js","./board":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/board.js","./configure":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/configure.js","./data":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/data.js","./drag":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/drag.js","./fen":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/fen.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/data.js":[function(require,module,exports){
var fen = require('./fen');
var configure = require('./configure');

module.exports = function(cfg) {
  var defaults = {
    pieces: fen.read(fen.initial),
    orientation: 'white', // board orientation. white | black
    turnColor: 'white', // turn to play. white | black
    check: null, // square currently in check "a2" | null
    lastMove: null, // squares part of the last move ["c3", "c4"] | null
    selected: null, // square currently selected "a1" | null
    coordinates: true, // include coords attributes
    render: null, // function that rerenders the board
    renderRAF: null, // function that rerenders the board using requestAnimationFrame
    element: null, // DOM element of the board, required for drag piece centering
    bounds: null, // function that calculates the board bounds
    viewOnly: false, // don't bind events: the user will never be able to move pieces around
    minimalDom: false, // don't use square elements. Optimization to use only with viewOnly
    highlight: {
      lastMove: true, // add last-move class to squares
      check: true, // add check class to squares
      dragOver: true // add drag-over class to square when dragging over it
    },
    animation: {
      enabled: true,
      duration: 200,
      /*{ // current
       *  start: timestamp,
       *  duration: ms,
       *  anims: {
       *    a2: [
       *      [-30, 50], // animation goal
       *      [-20, 37]  // animation current status
       *    ], ...
       *  },
       *  fading: [
       *    {
       *      pos: [80, 120], // position relative to the board
       *      opacity: 0.34,
       *      role: 'rook',
       *      color: 'black'
       *    }
       *  }
       *}*/
      current: {}
    },
    movable: {
      free: true, // all moves are valid - board editor
      color: 'both', // color that can move. white | black | both | null
      dests: {}, // valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]} | null
      dropOff: 'revert', // when a piece is dropped outside the board. "revert" | "trash"
      dropped: [], // last dropped [orig, dest], not to be animated
      showDests: true, // whether to add the move-dest class on squares
      events: {
        after: function(orig, dest, metadata) {} // called after the move has been played
      }
    },
    premovable: {
      enabled: true, // allow premoves for color that can not move
      showDests: true, // whether to add the premove-dest class on squares
      dests: [], // premove destinations for the current selection
      current: null, // keys of the current saved premove ["e2" "e4"] | null
      events: {
        set: function(orig, dest) {}, // called after the premove has been set
        unset: function() {} // called after the premove has been unset
      }
    },
    draggable: {
      enabled: true, // allow moves & premoves to use drag'n drop
      distance: 3, // minimum distance to initiate a drag, in pixels
      squareTarget: false, // display big square target intended for mobile
      centerPiece: true, // center the piece on cursor at drag start
      showGhost: true, // show ghost of piece being dragged
      /*{ // current
       *  orig: "a2", // orig key of dragging piece
       *  rel: [100, 170] // x, y of the piece at original position
       *  pos: [20, -12] // relative current position
       *  dec: [4, -8] // piece center decay
       *  over: "b3" // square being moused over
       *  bounds: current cached board bounds
       *  started: whether the drag has started, as per the distance setting
       *}*/
      current: {}
    },
    events: {
      change: function() {}, // called after the situation changes on the board
      capture: function(key, piece) {}, // called when a piece has been captured
      select: function(key) {} // called when a square is selected
    }
  };

  configure(defaults, cfg || {});

  return defaults;
};

},{"./configure":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/configure.js","./fen":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/fen.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/drag.js":[function(require,module,exports){
var board = require('./board');
var util = require('./util');
var hold = require('./hold');
var m = require('mithril');

var originTarget;

function hashPiece(piece) {
  return piece ? piece.color + ' ' + piece.role : '';
}

function start(data, e) {
  if (e.button !== undefined && e.button !== 0) return; // only touch or left click
  if (e.touches && e.touches.length > 1) return; // support one finger touch only
  e.stopPropagation();
  e.preventDefault();
  originTarget = e.target;
  var previouslySelected = data.selected;
  var position = util.eventPosition(e);
  var bounds = data.bounds();
  var orig = board.getKeyAtDomPos(data, position, bounds);
  var hadPremove = !!data.premovable.current;
  board.selectSquare(data, orig);
  var stillSelected = data.selected === orig;
  if (data.pieces[orig] && stillSelected && board.isDraggable(data, orig)) {
    var pieceBounds = data.element.querySelector('.' + orig).getBoundingClientRect();
    data.draggable.current = {
      previouslySelected: previouslySelected,
      orig: orig,
      piece: hashPiece(data.pieces[orig]),
      rel: position,
      epos: position,
      pos: [0, 0],
      dec: data.draggable.centerPiece ? [
        position[0] - (pieceBounds.left + pieceBounds.width / 2),
        position[1] - (pieceBounds.top + pieceBounds.height / 2)
      ] : [0, 0],
      bounds: bounds,
      started: false
    };
    hold.start();
  } else if (hadPremove) board.unsetPremove(data);
  processDrag(data);
}

function processDrag(data) {
  requestAnimationFrame(function() {
    var cur = data.draggable.current;
    if (cur.orig) {
      // cancel animations while dragging
      if (data.animation.current.start &&
        Object.keys(data.animation.current.anims).indexOf(cur.orig) !== -1)
        data.animation.current = {};
      // if moving piece is gone, cancel
      if (hashPiece(data.pieces[cur.orig]) != cur.piece) cancel(data);
      else {
        if (!cur.started && util.distance(cur.epos, cur.rel) >= data.draggable.distance)
          cur.started = true;
        if (cur.started) {
          cur.pos = [
            cur.epos[0] - cur.rel[0],
            cur.epos[1] - cur.rel[1]
          ];
          cur.over = board.getKeyAtDomPos(data, cur.epos, cur.bounds);
        }
      }
    }
    data.render();
    if (cur.orig) processDrag(data);
  });
}

function move(data, e) {
  if (e.touches && e.touches.length > 1) return; // support one finger touch only

  if (data.draggable.current.orig)
    data.draggable.current.epos = util.eventPosition(e);
}

function end(data, e) {
  var draggable = data.draggable;
  var orig = draggable.current ? draggable.current.orig : null;
  if (!orig) return;
  // comparing with the origin target is an easy way to test that the end event
  // has the same touch origin
  if (e && e.type === "touchend" && originTarget !== e.target) return;
  board.unsetPremove(data);
  if (draggable.current.started) {
    dest = draggable.current.over;
    if (orig !== dest) data.movable.dropped = [orig, dest];
    board.userMove(data, orig, dest);
  } else if (draggable.current.previouslySelected === orig) board.setSelected(data, null);
  draggable.current = {};
}

function cancel(data) {
  if (data.draggable.current.orig) {
    data.draggable.current = {};
    board.selectSquare(data, null);
  }
}

module.exports = {
  start: start,
  move: move,
  end: end,
  cancel: cancel,
  processDrag: processDrag
};

},{"./board":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/board.js","./hold":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/hold.js","./util":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/util.js","mithril":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mithril/mithril.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/fen.js":[function(require,module,exports){
var util = require('./util');

var initial = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

var roles = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king"
};

var letters = {
  pawn: "p",
  rook: "r",
  knight: "n",
  bishop: "b",
  queen: "q",
  king: "k"
};

function read(fen) {
  if (fen === 'start') fen = initial;
  var pieces = {};
  fen.replace(/ .+$/, '').split('/').forEach(function(row, y) {
    var x = 0;
    row.split('').forEach(function(v) {
      var nb = parseInt(v);
      if (nb) x += nb;
      else {
        x++;
        pieces[util.pos2key([x, 8 - y])] = {
          role: roles[v.toLowerCase()],
          color: v === v.toLowerCase() ? 'black' : 'white'
        };
      }
    });
  });

  return pieces;
}

function write(pieces) {
  return [8, 7, 6, 5, 4, 3, 2].reduce(
    function(str, nb) {
      return str.replace(new RegExp(Array(nb + 1).join('1'), 'g'), nb);
    },
    util.invRanks.map(function(y) {
      return util.ranks.map(function(x) {
        var piece = pieces[util.pos2key([x, y])];
        if (piece) {
          var letter = letters[piece.role];
          return piece.color === 'white' ? letter.toUpperCase() : letter;
        } else return '1';
      }).join('')
    }).join('/'));
}

module.exports = {
  initial: initial,
  read: read,
  write: write
};

},{"./util":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/util.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/hold.js":[function(require,module,exports){
var startAt;

var start = function() {
  startAt = new Date();
}

var cancel = function() {
  startAt = null;
}

var stop = function() {
  if (!startAt) return 0;
  var time = new Date() - startAt;
  startAt = null;
  return time;
}

module.exports = {
  start: start,
  cancel: cancel,
  stop: stop
};

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/main.js":[function(require,module,exports){
var m = require('mithril');
var ctrl = require('./ctrl');
var view = require('./view');
var api = require('./api');

// for usage outside of mithril
function init(element, config) {

  var controller = new ctrl(config);

  m.render(element, view(controller));

  return api(controller);
}

module.exports = init;
module.exports.controller = ctrl;
module.exports.view = view;
module.exports.fen = require('./fen');
module.exports.util = require('./util');
module.exports.configure = require('./configure');
module.exports.anim = require('./anim');
module.exports.board = require('./board');
module.exports.drag = require('./drag');

},{"./anim":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/anim.js","./api":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/api.js","./board":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/board.js","./configure":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/configure.js","./ctrl":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/ctrl.js","./drag":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/drag.js","./fen":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/fen.js","./util":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/util.js","./view":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/view.js","mithril":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mithril/mithril.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/premove.js":[function(require,module,exports){
var util = require('./util');

function diff(a, b) {
  return Math.abs(a - b);
}

function pawn(color, x1, y1, x2, y2) {
  return diff(x1, x2) < 2 && (
    color === 'white' ? (
      y2 === y1 + 1 || (y1 === 2 && y2 === 4 && x1 === x2)
    ) : (
      y2 === y1 - 1 || (y1 === 7 && y2 === 5 && x1 === x2)
    )
  );
}

function knight(x1, y1, x2, y2) {
  var xd = diff(x1, x2);
  var yd = diff(y1, y2);
  return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
}

function bishop(x1, y1, x2, y2) {
  return diff(x1, x2) === diff(y1, y2);
}

function rook(x1, y1, x2, y2) {
  return x1 === x2 || y1 === y2;
}

function queen(x1, y1, x2, y2) {
  return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2);
}

function king(color, rookFiles, x1, y1, x2, y2) {
  return (
    diff(x1, x2) < 2 && diff(y1, y2) < 2
  ) || (
    y1 === y2 && y1 === (color === 'white' ? 1 : 8) && (
      (x1 === 5 && (x2 === 3 || x2 === 7)) || util.containsX(rookFiles, x2)
    )
  );
}

function rookFilesOf(pieces, color) {
  return Object.keys(pieces).filter(function(key) {
    var piece = pieces[key];
    return piece && piece.color === color && piece.role === 'rook';
  }).map(function(key) {
    return util.key2pos(key)[0];
  });
}

function compute(pieces, key) {
  var piece = pieces[key];
  var pos = util.key2pos(key);
  var mobility;
  switch (piece.role) {
    case 'pawn':
      mobility = pawn.bind(null, piece.color);
      break;
    case 'knight':
      mobility = knight
      break;
    case 'bishop':
      mobility = bishop
      break;
    case 'rook':
      mobility = rook
      break;
    case 'queen':
      mobility = queen
      break;
    case 'king':
      mobility = king.bind(null, piece.color, rookFilesOf(pieces, piece.color))
      break;
  }
  return util.allPos.filter(function(pos2) {
    return (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1]);
  }).map(util.pos2key);
}

module.exports = compute;

},{"./util":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/util.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/util.js":[function(require,module,exports){
var files = "abcdefgh".split('');
var ranks = [1, 2, 3, 4, 5, 6, 7, 8];
var invRanks = [8, 7, 6, 5, 4, 3, 2, 1];

function pos2key(pos) {
  return files[pos[0] - 1] + pos[1];
}

function key2pos(pos) {
  return [(files.indexOf(pos[0]) + 1), parseInt(pos[1])];
}

function invertKey(key) {
  return files[7 - files.indexOf(key[0])] + (9 - parseInt(key[1]));
}

var allPos = (function() {
  var ps = [];
  invRanks.forEach(function(y) {
    ranks.forEach(function(x) {
      ps.push([x, y]);
    });
  });
  return ps;
})();
var invPos = allPos.slice().reverse();
var allKeys = allPos.map(pos2key);

function classSet(classes) {
  var arr = [];
  for (var i in classes) {
    if (classes[i]) arr.push(i);
  }
  return arr.join(' ');
}

function opposite(color) {
  return color === 'white' ? 'black' : 'white';
}

function contains2(xs, x) {
  return xs && (xs[0] === x || xs[1] === x);
}

function containsX(xs, x) {
  return xs && xs.indexOf(x) !== -1;
}

function distance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
}

// this must be cached because of the access to document.body.style
var cachedTransformProp;

function transformProp() {
  if (!cachedTransformProp) cachedTransformProp = computeTransformProp();
  return cachedTransformProp;
}

function computeTransformProp() {
  return 'transform' in document.body.style?
    'transform': 'webkitTransform' in document.body.style?
    'webkitTransform': 'mozTransform' in document.body.style?
    'mozTransform': 'oTransform' in document.body.style?
    'oTransform': 'msTransform';
}

function translate(pos) {
  return 'translate3d(' + pos[0] + 'px,' + pos[1] + 'px,0)';
}

function eventPosition(e) {
  return e.touches ? [e.targetTouches[0].clientX, e.targetTouches[0].clientY] : [e.clientX, e.clientY];
}

function partialApply(fn, args) {
  return fn.bind.apply(fn, [null].concat(args));
}

function partial() {
  return partialApply(arguments[0], Array.prototype.slice.call(arguments, 1));
}

module.exports = {
  files: files,
  ranks: ranks,
  invRanks: invRanks,
  allPos: allPos,
  invPos: invPos,
  allKeys: allKeys,
  pos2key: pos2key,
  key2pos: key2pos,
  invertKey: invertKey,
  classSet: classSet,
  opposite: opposite,
  translate: translate,
  contains2: contains2,
  containsX: containsX,
  distance: distance,
  eventPosition: eventPosition,
  partialApply: partialApply,
  partial: partial,
  transformProp: transformProp
};

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/view.js":[function(require,module,exports){
var util = require('./util');
var board = require('./board');
var drag = require('./drag');
var util = require('./util');
var m = require('mithril');

function pieceClass(p) {
  return ['cg-piece', p.role, p.color].join(' ');
}

function renderPiece(ctrl, key, p) {
  var attrs = {
    style: {},
    class: pieceClass(p)
  };
  var draggable = ctrl.data.draggable.current;
  if (draggable.orig === key && (draggable.pos[0] !== 0 || draggable.pos[1] !== 0)) {
    attrs.style[util.transformProp()] = util.translate([
      draggable.pos[0] + draggable.dec[0],
      draggable.pos[1] + draggable.dec[1]
    ]);
    attrs.class += ' dragging';
  } else if (ctrl.data.animation.current.anims) {
    var animation = ctrl.data.animation.current.anims[key];
    if (animation) attrs.style[util.transformProp()] = util.translate(animation[1]);
  }
  return {
    tag: 'div',
    attrs: attrs
  };
}

function renderGhost(p) {
  return {
    tag: 'div',
    attrs: {
      class: pieceClass(p) + ' ghost'
    }
  };
}

function renderSquare(ctrl, pos, asWhite) {
  var file = util.files[pos[0] - 1];
  var rank = pos[1];
  var key = file + rank;
  var piece = ctrl.data.pieces[key];
  var isDragOver = ctrl.data.highlight.dragOver && ctrl.data.draggable.current.over === key;
  var attrs = {
    class: 'cg-square ' + key + ' ' + util.classSet({
      'selected': ctrl.data.selected === key,
      'check': ctrl.data.highlight.check && ctrl.data.check === key,
      'last-move': ctrl.data.highlight.lastMove && util.contains2(ctrl.data.lastMove, key),
      'move-dest': (isDragOver || ctrl.data.movable.showDests) && util.containsX(ctrl.data.movable.dests[ctrl.data.selected], key),
      'premove-dest': (isDragOver || ctrl.data.premovable.showDests) && util.containsX(ctrl.data.premovable.dests, key),
      'current-premove': util.contains2(ctrl.data.premovable.current, key),
      'drag-over': isDragOver,
      'occupied': !!piece
    }),
    style: {
      left: (asWhite ? pos[0] - 1 : 8 - pos[0]) * 12.5 + '%',
      bottom: (asWhite ? pos[1] - 1 : 8 - pos[1]) * 12.5 + '%'
    }
  };
  if (ctrl.data.coordinates) {
    if (pos[1] === (asWhite ? 1 : 8)) attrs['data-coord-x'] = file;
    if (pos[0] === (asWhite ? 8 : 1)) attrs['data-coord-y'] = rank;
  }
  var children = [];
  if (piece) {
    children.push(renderPiece(ctrl, key, piece));
    if (ctrl.data.draggable.current.orig === key && ctrl.data.draggable.showGhost) {
      children.push(renderGhost(piece));
    }
  }
  return {
    tag: 'div',
    attrs: attrs,
    children: children
  };
}

function renderSquareTarget(ctrl, cur) {
  var pos = util.key2pos(cur.over),
    x = ctrl.data.orientation === 'white' ? pos[0] : 9 - pos[0],
    y = ctrl.data.orientation === 'white' ? pos[1] : 9 - pos[1];
  return {
    tag: 'div',
    attrs: {
      id: 'cg-square-target',
      style: {
        width: cur.bounds.width / 4 + 'px',
        height: cur.bounds.height / 4 + 'px',
        left: (x - 1.5) * cur.bounds.width / 8 + 'px',
        top: (7.5 - y) * cur.bounds.height / 8 + 'px'
      }
    }
  };
}

function renderFading(cfg) {
  return {
    tag: 'div',
    attrs: {
      class: 'cg-square fading',
      style: {
        left: cfg.left,
        bottom: cfg.bottom,
        opacity: cfg.opacity
      }
    },
    children: [{
      tag: 'div',
      attrs: {
        class: pieceClass(cfg.piece)
      }
    }]
  };
}

function renderMinimalDom(ctrl, asWhite) {
  var children = [];
  if (ctrl.data.lastMove) ctrl.data.lastMove.forEach(function(key) {
    var pos = util.key2pos(key);
    children.push({
      tag: 'div',
      attrs: {
        class: 'cg-square last-move',
        style: {
          left: (asWhite ? pos[0] - 1 : 8 - pos[0]) * 12.5 + '%',
          bottom: (asWhite ? pos[1] - 1 : 8 - pos[1]) * 12.5 + '%'
        }
      }
    });
  });
  Object.keys(ctrl.data.pieces).forEach(function(key) {
    var pos = util.key2pos(key);
    var attrs = {
      style: {
        left: (asWhite ? pos[0] - 1 : 8 - pos[0]) * 12.5 + '%',
        bottom: (asWhite ? pos[1] - 1 : 8 - pos[1]) * 12.5 + '%'
      },
      class: pieceClass(ctrl.data.pieces[key])
    };
    if (ctrl.data.animation.current.anims) {
      var animation = ctrl.data.animation.current.anims[key];
      if (animation) attrs.style[util.transformProp()] = util.translate(animation[1]);
    }
    children.push({
      tag: 'div',
      attrs: attrs
    });
  });

  return children;
}

function renderContent(ctrl) {
  var asWhite = ctrl.data.orientation == 'white';
  if (ctrl.data.minimalDom) return renderMinimalDom(ctrl, asWhite);
  var children = (asWhite ? util.allPos : util.invPos).map(function(pos) {
    return renderSquare(ctrl, pos, asWhite);
  });
  if (ctrl.data.draggable.current.over && ctrl.data.draggable.squareTarget)
    children.push(renderSquareTarget(ctrl, ctrl.data.draggable.current));
  if (ctrl.data.animation.current.fadings)
    ctrl.data.animation.current.fadings.forEach(function(p) {
      children.push(renderFading(p));
    });
  return children;
}

function bindEvents(ctrl, el, context) {
  var onstart = util.partial(drag.start, ctrl.data);
  var onmove = util.partial(drag.move, ctrl.data);
  var onend = util.partial(drag.end, ctrl.data);
  var startEvents = ['touchstart', 'mousedown'];
  var moveEvents = ['touchmove', 'mousemove'];
  var endEvents = ['touchend', 'mouseup'];
  startEvents.forEach(function(ev) {
    el.addEventListener(ev, onstart);
  });
  moveEvents.forEach(function(ev) {
    document.addEventListener(ev, onmove);
  });
  endEvents.forEach(function(ev) {
    document.addEventListener(ev, onend);
  });
  context.onunload = function() {
    startEvents.forEach(function(ev) {
      el.removeEventListener(ev, onstart);
    });
    moveEvents.forEach(function(ev) {
      document.removeEventListener(ev, onmove);
    });
    endEvents.forEach(function(ev) {
      document.removeEventListener(ev, onend);
    });
  };
}

function renderBoard(ctrl) {
  return {
    tag: 'div',
    attrs: {
      class: 'cg-board orientation-' + ctrl.data.orientation,
      config: function(el, isUpdate, context) {
        if (isUpdate) return;
        if (!ctrl.data.viewOnly) bindEvents(ctrl, el, context);
        // this function only repaints the board itself.
        // it's called when dragging or animating pieces,
        // to prevent the full application embedding chessground
        // rendering on every animation frame
        ctrl.data.render = function() {
          m.render(el, renderContent(ctrl));
        };
        ctrl.data.renderRAF = function() {
          requestAnimationFrame(ctrl.data.render);
        };
        ctrl.data.bounds = el.getBoundingClientRect.bind(el);
        ctrl.data.element = el;
        ctrl.data.render();
      }
    },
    children: []
  };
}

module.exports = function(ctrl) {
  return {
    tag: 'div',
    attrs: {
      class: [
        'cg-board-wrap',
        ctrl.data.viewOnly ? 'view-only' : 'manipulable',
        ctrl.data.minimalDom ? 'minimal-dom' : 'full-dom'
      ].join(' ')
    },
    children: [renderBoard(ctrl)]
  };
};

},{"./board":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/board.js","./drag":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/drag.js","./util":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/util.js","mithril":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mithril/mithril.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessli.js/chess.js":[function(require,module,exports){
'use strict';
/*
 * Copyright (c) 2014, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

/* minified license below  */

/*! Copyright (c) 2014, Jeff Hlywa (jhlywa@gmail.com)
 *  Released under the BSD license
 *  https://github.com/jhlywa/chess.js/blob/master/LICENSE
 */

var Chess = function(fen, game_type) {

  /* jshint indent: false */

  var BLACK = 'b';
  var WHITE = 'w';

  var EMPTY = -1;

  var PAWN = 'p';
  var KNIGHT = 'n';
  var BISHOP = 'b';
  var ROOK = 'r';
  var QUEEN = 'q';
  var KING = 'k';

  var SYMBOLS = 'pnbrqkPNBRQK';

  var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];

  var GAME_STANDARD = 0;
  var GAME_960 = 1;

  var PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15]
  };

  var PIECE_OFFSETS = {
    n: [-18, -33, -31, -14,  18, 33, 31,  14],
    b: [-17, -15,  17,  15],
    r: [-16,   1,  16,  -1],
    q: [-17, -16, -15,   1,  17, 16, 15,  -1],
    k: [-17, -16, -15,   1,  17, 16, 15,  -1]
  };

  var ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
  ];

  var RAYS = [
     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
  ];

  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };

  var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q'
  };

  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64
  };

  var RANK_1 = 7;
  var RANK_2 = 6;
  var RANK_3 = 5;
  var RANK_4 = 4;
  var RANK_5 = 3;
  var RANK_6 = 2;
  var RANK_7 = 1;
  var RANK_8 = 0;

  var SQUARES = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };

  var ROOKS = {
    w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE}],
    b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE},
        {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE}]
  };

  var board = new Array(128);
  var kings = {w: EMPTY, b: EMPTY};
  var turn = WHITE;
  var castling = {w: 0, b: 0};
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {};
  game_type = game_type || GAME_STANDARD;

  /* if the user passes in a fen string, load it, else default to
   * starting position
   */
  if (typeof fen === 'undefined') {
    load(DEFAULT_POSITION);
  } else {
    load(fen);
  }

  function clear() {
    board = new Array(128);
    kings = {w: EMPTY, b: EMPTY};
    turn = WHITE;
    castling = {w: 0, b: 0};
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    header = {};

    ROOKS = {
      w: [{square: SQUARES.a1, flag: BITS.QSIDE_CASTLE},
          {square: SQUARES.h1, flag: BITS.KSIDE_CASTLE}],
      b: [{square: SQUARES.a8, flag: BITS.QSIDE_CASTLE},
          {square: SQUARES.h8, flag: BITS.KSIDE_CASTLE}]
    };

    update_setup(generate_fen());
  }

  function reset() {
    load(DEFAULT_POSITION);
  }

  function load(fen) {
    var tokens = fen.split(/\s+/);
    var position = tokens[0];
    var square = 0;
    var valid = SYMBOLS + '12345678/';

    clear();

    /* parse castling flags */
    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
    }


    /* parse FEN position */
    for (var i = 0; i < position.length; i++) {
      var piece = position.charAt(i);

      if (piece === '/') {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        var color = (piece < 'a') ? WHITE : BLACK;
        put({type: piece.toLowerCase(), color: color}, algebraic(square));

        /* keep track of the rook squares for 960 castling */
        if (board[square] && board[square].type == ROOK && game_type == GAME_960) {
          if ((color == 'b' && square < SQUARES.a7) || (color == 'w' && square > SQUARES.h2)) {
            if (castling[color] & BITS.QSIDE_CASTLE && kings[color] == EMPTY) {
              ROOKS[color][0] = {square: square, flag: BITS.QSIDE_CASTLE};
            }
            if (castling[color] & BITS.KSIDE_CASTLE && kings[color] != EMPTY) {
              ROOKS[color][1] = {square: square, flag: BITS.KSIDE_CASTLE};
            }
          }
        }
        square++;
      }
    }

    turn = tokens[1];

    if (tokens[2].indexOf('K') > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('Q') > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf('k') > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf('q') > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
    }

    ep_square = (tokens[3] === '-') ? EMPTY : SQUARES[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);

    update_setup(generate_fen());

    return true;
  }

  function generate_fen() {
    var empty = 0;
    var fen = '';

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        var color = board[i].color;
        var piece = board[i].type;

        fen += (color === WHITE) ?
                 piece.toUpperCase() : piece.toLowerCase();
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty;
        }

        if (i !== SQUARES.h1) {
          fen += '/';
        }

        empty = 0;
        i += 8;
      }
    }

    var cflags = '';
    if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; }

    /* do we have an empty castling flag? */
    cflags = cflags || '-';
    var epflags = (ep_square === EMPTY) ? '-' : algebraic(ep_square);

    return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
  }

  /* called when the initial board setup is changed with put() or remove().
   * modifies the SetUp and FEN properties of the header object.  if the FEN is
   * equal to the default position, the SetUp and FEN are deleted
   * the setup is only updated if history.length is zero, ie moves haven't been
   * made.
   */
  function update_setup(fen) {
    if (history.length > 0) return;

    if (fen !== DEFAULT_POSITION) {
      header['SetUp'] = '1';
      header['FEN'] = fen;
    } else {
      delete header['SetUp'];
      delete header['FEN'];
    }
  }

  function get(square) {
    var piece = board[SQUARES[square]];
    return (piece) ? {type: piece.type, color: piece.color} : null;
  }

  function put(piece, square) {
    /* check for valid piece object */
    if (!('type' in piece && 'color' in piece)) {
      return false;
    }

    /* check for piece */
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false;
    }

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false;
    }

    var sq = SQUARES[square];

    /* don't let the user place more than one king */
    if (piece.type == KING &&
        !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) {
      return false;
    }

    board[sq] = {type: piece.type, color: piece.color};
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }

    update_setup(generate_fen());

    return true;
  }

  function remove(square) {
    var piece = get(square);
    board[SQUARES[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
    }

    update_setup(generate_fen());

    return piece;
  }

  function build_move(board, from, to, flags, promotion) {
    var move = {
      color: turn,
      from: from,
      to: to,
      flags: flags,
      piece: board[from].type
    };

    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }

    if (board[to] && from !== to) {
      move.captured = board[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
        move.captured = PAWN;
    }
    return move;
  }

  function generate_moves(options) {
    function add_move(board, moves, from, to, flags) {
      /* if pawn promotion */
      if (board[from].type === PAWN &&
         (rank(to) === RANK_8 || rank(to) === RANK_1)) {
          var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
          for (var i = 0, len = pieces.length; i < len; i++) {
            moves.push(build_move(board, from, to, flags, pieces[i]));
          }
      } else {
       moves.push(build_move(board, from, to, flags));
      }
    }

    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = {b: RANK_7, w: RANK_2};

    var first_sq = SQUARES.a8;
    var last_sq = SQUARES.h1;
    var single_square = false;

    /* do we want legal moves? */
    var legal = (typeof options !== 'undefined' && 'legal' in options) ?
                options.legal : true;

    /* are we generating moves for a single square? */
    if (typeof options !== 'undefined' && 'square' in options) {
      if (options.square in SQUARES) {
        first_sq = last_sq = SQUARES[options.square];
        single_square = true;
      } else {
        /* invalid square */
        return [];
      }
    }

    for (var i = first_sq; i <= last_sq; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      var piece = board[i];
      if (piece == null || piece.color !== us) {
        continue;
      }

      if (piece.type === PAWN) {
        /* single square, non-capturing */
        var square = i + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
            add_move(board, moves, i, square, BITS.NORMAL);

          /* double square */
          var square = i + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i) && board[square] == null) {
            add_move(board, moves, i, square, BITS.BIG_PAWN);
          }
        }

        /* pawn captures */
        for (j = 2; j < 4; j++) {
          var square = i + PAWN_OFFSETS[us][j];
          if (square & 0x88) continue;

          if (board[square] != null &&
              board[square].color === them) {
              add_move(board, moves, i, square, BITS.CAPTURE);
          } else if (square === ep_square) {
              add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i;

          while (true) {
            square += offset;
            if (square & 0x88) break;

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break;
              add_move(board, moves, i, square, BITS.CAPTURE);
              break;
            }

            /* break, if knight or king */
            if (piece.type === 'n' || piece.type === 'k') break;
          }
        }
      }
    }

    /* check for castling if: a) we're generating all moves, or b) we're doing
     * single square move generation on the king's square
     */
    if ((!single_square) || last_sq === kings[us]) {
      /* king-side castling */
      if (castling[us] & BITS.KSIDE_CASTLE) {
        if (game_type == GAME_STANDARD) {
          var castling_from = kings[us];
          var castling_to = castling_from + 2;

          if (board[castling_from + 1] == null &&
              board[castling_to]       == null &&
              !attacked(them, kings[us]) &&
              !attacked(them, castling_from + 1) &&
              !attacked(them, castling_to)) {
              add_move(board, moves, kings[us] , castling_to,
                  BITS.KSIDE_CASTLE);
            }
        } else {
          /* king-side castling (CHESS 960) */
          var king_from = kings[us];
          var king_to = us == 'w' ? SQUARES.g1 : SQUARES.g8;
          var rook_from = ROOKS[us][1].square;
          var rook_to = us == 'w' ? SQUARES.f1 : SQUARES.f8;

          /* is there a clear shot between the king-side rook and its castling_to
          * square (ignoring the friendly)?
          */
          var rook_unimpeded = true;
          if (rook_from != rook_to) {
            var delta = (rook_from - rook_to > 0) ? -1 : 1;
            for (var i = rook_from + delta; i != (rook_to + delta); i += delta) {
              if (board[i] && i != kings[us]) {
                rook_unimpeded = false;
                break;
              }
            }
          }

          /* is there a clear shot between the king and its castling_to square
          * (ignoring the friendly king-side rook)?
          */
          var king_unimpeded = true;
          var checked = false;
          if (king_from == king_to) {
            checked = attacked(them, king_to);
          } else {
            var delta = (king_from - king_to > 0) ? -1 : 1;
            for (var i = king_from + delta; i != (king_to + delta); i += delta) {
              if (board[i] && i != ROOKS[us][1].square) {
                king_unimpeded = false;
                break;
              }
              if (attacked(them, i)) {
                checked = true;
                break;
              }
            }
          }

          if (rook_unimpeded && king_unimpeded && !checked) {
            add_move(board, moves, kings[us] , king_to, BITS.KSIDE_CASTLE);
          }
        }
      }

      /* queen-side castling */
      if (castling[us] & BITS.QSIDE_CASTLE) {
        var castling_from = kings[us];
        var castling_to = castling_from - 2;
        if (game_type == GAME_STANDARD) {
          if (board[castling_from - 1] == null &&
              board[castling_from - 2] == null &&
              board[castling_from - 3] == null &&
              !attacked(them, kings[us]) &&
              !attacked(them, castling_from - 1) &&
              !attacked(them, castling_to)) {
            add_move(board, moves, kings[us], castling_to,
                      BITS.QSIDE_CASTLE);
          }
        } else {
          /* queen-side castling (CHESS 960) */
          var king_from = kings[us];
          var king_to = (us == 'w') ? SQUARES.c1 : SQUARES.c8;
          var rook_from = ROOKS[us][0].square;
          var rook_to = (us == 'w') ? SQUARES.d1 : SQUARES.d8;

          /* is there a clear shot between the queen-side rook and its castling_to
          * square (ignoring the friendly king)?
          */
          var rook_unimpeded = true;
          if (rook_from != rook_to) {
            var delta = (rook_from - rook_to > 0) ? -1 : 1;
            for (var i = rook_from + delta; i != (rook_to + delta); i += delta) {
              if (board[i] && i != kings[us]) {
                rook_unimpeded = false;
                break;
              }
            }
          }

          /* is there a clear shot between the king and its castling_to square
          * (ignoring the friendly queen-side rook)?
          */
          var king_unimpeded = true;
          var checked = false;
          if (king_from == king_to) {
            checked = attacked(them, king_to);
          } else {
            var delta = (king_from - king_to > 0) ? -1 : 1;
            for (var i = king_from + delta; i != (king_to + delta); i += delta) {
              if (board[i] && i != ROOKS[us][0].square) {
                king_unimpeded = false;
                break;
              }
              if (attacked(them, i)) {
                checked = true;
                break;
              }
            }
          }

          if (rook_unimpeded && king_unimpeded && !checked) {
            add_move(board, moves, kings[us] , king_to, BITS.QSIDE_CASTLE);
          }
        }
      }
    }

    /* return all pseudo-legal moves (this includes moves that allow the king
     * to be captured)
     */
    if (!legal) {
      return moves;
    }

    /* filter out illegal moves */
    var legal_moves = [];
    for (var i = 0, len = moves.length; i < len; i++) {
      /* hack for chess960 castle - undo fucks it up */
      if (game_type == GAME_960 && (moves[i].flags & BITS.KSIDE_CASTLE || moves[i].flags & BITS.QSIDE_CASTLE)) legal_moves.push(moves[i]);
      else {
        make_move(moves[i]);
        if (!king_attacked(us)) {
          legal_moves.push(moves[i]);
        }
        undo_move();
      }
    }

    return legal_moves;
  }

  /* convert a move from 0x88 coordinates to Standard Algebraic Notation
   * (SAN)
   */
  function move_to_san(move, precomputedMoves) {
    var output = '';

    if (move.flags & BITS.KSIDE_CASTLE) {
      output = 'O-O';
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = 'O-O-O';
    } else {
      var disambiguator = get_disambiguator(move, precomputedMoves);

      if (move.piece !== PAWN) {
        output += move.piece.toUpperCase() + disambiguator;
      }

      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += 'x';
      }

      output += algebraic(move.to);

      if (move.flags & BITS.PROMOTION) {
        output += '=' + move.promotion.toUpperCase();
      }
    }

    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += '#';
      } else {
        output += '+';
      }
    }
    undo_move();

    return output;
  }

  function attacked(color, square) {
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) { i += 7; continue; }

      /* if empty square or wrong color */
      if (board[i] == null || board[i].color !== color) continue;

      var piece = board[i];
      var difference = i - square;
      var index = difference + 119;

      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
          } else {
            if (piece.color === BLACK) return true;
          }
          continue;
        }

        /* if the piece is a knight or a king */
        if (piece.type === 'n' || piece.type === 'k') return true;

        var offset = RAYS[index];
        var j = i + offset;

        var blocked = false;
        while (j !== square) {
          if (board[j] != null) { blocked = true; break; }
          j += offset;
        }

        if (!blocked) return true;
      }
    }

    return false;
  }

  function king_attacked(color) {
    return attacked(swap_color(color), kings[color]);
  }

  function in_check() {
    return king_attacked(turn);
  }

  function in_checkmate() {
    return in_check() && generate_moves().length === 0;
  }

  function push(move) {
    history.push({
      move: move,
      kings: {b: kings.b, w: kings.w},
      turn: turn,
      castling: {b: castling.b, w: castling.w},
      ep_square: ep_square,
      half_moves: half_moves,
      move_number: move_number
    });
  }

  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);

    /* 960 castling hack */
    if (move.to != move.from) {
      board[move.to] = board[move.from];
      board[move.from] = null;
    }

    /* if ep capture, remove the captured pawn */
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
      } else {
        board[move.to + 16] = null;
      }
    }

    /* if pawn promotion, replace with new piece */
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = {type: move.promotion, color: us};
    }

    /* if we moved the king */
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;

      /* if we castled, move the rook next to the king */
      if (move.flags & BITS.KSIDE_CASTLE) {
        var rook_to = (us == 'w') ? SQUARES.f1 : SQUARES.f8;
        var rook_from = ROOKS[us][1].square;
        board[rook_to] = {type: ROOK, color: us};
        if (rook_to != rook_from && board[rook_from].type == ROOK) { 
          board[rook_from] = null;
        }
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var rook_to = (us == 'w') ? SQUARES.d1 : SQUARES.d8;
        var rook_from = ROOKS[us][0].square;
        board[rook_to] = {type: ROOK, color: us};
        if (rook_to != rook_from && board[rook_from] && board[rook_from].type == ROOK) { 
          board[rook_from] = null;
        }
      }

      /* turn off castling */
      castling[us] = '';
    }

    /* turn off castling if we move a rook */
    if (castling[us]) {
      for (var i = 0, len = ROOKS[us].length; i < len; i++) {
        if (move.from === ROOKS[us][i].square &&
            castling[us] & ROOKS[us][i].flag) {
          castling[us] ^= ROOKS[us][i].flag;
          break;
        }
      }
    }

    /* turn off castling if we capture a rook */
    if (castling[them]) {
      for (var i = 0, len = ROOKS[them].length; i < len; i++) {
        if (move.to === ROOKS[them][i].square &&
            castling[them] & ROOKS[them][i].flag) {
          castling[them] ^= ROOKS[them][i].flag;
          break;
        }
      }
    }

    /* if big pawn move, update the en passant square */
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === 'b') {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }

    /* reset the 50 move counter if a pawn is moved or a piece is captured */
    if (move.piece === PAWN) {
      half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
    } else {
      half_moves++;
    }

    if (turn === BLACK) {
      move_number++;
    }
    turn = swap_color(turn);
  }

  function undo_move() {
    var old = history.pop();
    if (old == null) { return null; }

    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;
    half_moves = old.half_moves;
    move_number = old.move_number;

    var us = turn;
    var them = swap_color(turn);

    /* 960 castling hack */
    if (move.to != move.from) {
      board[move.from] = board[move.to];
      board[move.from].type = move.piece  // to undo any promotions
      board[move.to] = null;
    }

    if (move.flags & BITS.CAPTURE) {
      board[move.to] = {type: move.captured, color: them};
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = {type: PAWN, color: them};
    }


    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var rook_to, rook_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        rook_to = ROOKS[us][1].square;
        rook_from = (us == 'w') ? SQUARES.f1 : SQUARES.f8;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        rook_to = ROOKS[us][0].square;
        rook_from = (us == 'w') ? SQUARES.d1 : SQUARES.d8;
      }
      board[rook_to] = {type: ROOK, color: us};

      /* be sure rook_from isn't the king (in 960) */
      if (rook_to != rook_from && board[rook_from] && board[rook_from].type == ROOK) {
        board[rook_from] = null;
      }
    }

    return move;
  }

  /* this function is used to uniquely identify ambiguous moves */
  function get_disambiguator(move, precomputedMoves) {
    var moves = precomputedMoves || generate_moves();

    var from = move.from;
    var to = move.to;
    var piece = move.piece;

    var ambiguities = 0;
    var same_rank = 0;
    var same_file = 0;

    for (var i = 0, len = moves.length; i < len; i++) {
      var ambig_from = moves[i].from;
      var ambig_to = moves[i].to;
      var ambig_piece = moves[i].piece;

      /* if a move of the same piece type ends on the same to square, we'll
       * need to add a disambiguator to the algebraic notation
       */
      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
        ambiguities++;

        if (rank(from) === rank(ambig_from)) {
          same_rank++;
        }

        if (file(from) === file(ambig_from)) {
          same_file++;
        }
      }
    }

    if (ambiguities > 0) {
      /* if there exists a similar moving piece on the same rank and file as
       * the move in question, use the square as the disambiguator
       */
      if (same_rank > 0 && same_file > 0) {
        return algebraic(from);
      }
      /* if the moving piece rests on the same file, use the rank symbol as the
       * disambiguator
       */
      else if (same_file > 0) {
        return algebraic(from).charAt(1);
      }
      /* else use the file symbol */
      else {
        return algebraic(from).charAt(0);
      }
    }

    return '';
  }

  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
  function rank(i) {
    return i >> 4;
  }

  function file(i) {
    return i & 15;
  }

  function algebraic(i){
    var f = file(i), r = rank(i);
    return 'abcdefgh'.substring(f,f+1) + '87654321'.substring(r,r+1);
  }

  function swap_color(c) {
    return c === WHITE ? BLACK : WHITE;
  }

  function is_digit(c) {
    return '0123456789'.indexOf(c) !== -1;
  }

  /* pretty = external move object */
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.san = move_to_san(move);
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);

    var flags = '';

    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;

    return move;
  }

  function clone(obj) {
    var dupe = (obj instanceof Array) ? [] : {};

    for (var property in obj) {
      if (typeof property === 'object') {
        dupe[property] = clone(obj[property]);
      } else {
        dupe[property] = obj[property];
      }
    }

    return dupe;
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  return {
    /***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    WHITE: WHITE,
    BLACK: BLACK,
    PAWN: PAWN,
    KNIGHT: KNIGHT,
    BISHOP: BISHOP,
    ROOK: ROOK,
    QUEEN: QUEEN,
    KING: KING,
    SQUARES: (function() {
                /* from the ECMA-262 spec (section 12.6.4):
                 * "The mechanics of enumerating the properties ... is
                 * implementation dependent"
                 * so: for (var sq in SQUARES) { keys.push(sq); } might not be
                 * ordered correctly
                 */
                var keys = [];
                for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
                  if (i & 0x88) { i += 7; continue; }
                  keys.push(algebraic(i));
                }
                return keys;
              })(),
    FLAGS: FLAGS,
    GAME_TYPES: {
      STANDARD: GAME_STANDARD,
      CHESS960: GAME_960
    },

    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function(fen) {
      return load(fen);
    },

    reset: function() {
      return reset();
    },

    moves: function(options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      var ugly_moves = generate_moves(options);

      var moves = [];

      for (var i = 0, len = ugly_moves.length; i < len; i++) {

        if (typeof options !== 'undefined' && 'verbose' in options &&
            options.verbose) {
          moves.push(make_pretty(ugly_moves[i]));
        } else {
          moves.push(move_to_san(ugly_moves[i]));
        }
      }

      return moves;
    },

    dests: function() {
      var dests = {};
      generate_moves().forEach(function(move) {
        var m = [algebraic(move.from), algebraic(move.to)];
        if (dests[m[0]]) dests[m[0]].push(m[1]);
        else dests[m[0]] = [m[1]];
      });
      return dests;
    },

    in_check: function() {
      return in_check();
    },

    fen: function() {
      return generate_fen();
    },

    turn: function() {
      return turn;
    },

    remove_disambiguation: function(san) {
      var len = san.length;
      if (len < 4 || (san.indexOf('x') !== -1 && len < 5) || san[0] === san[0].toLowerCase()) return;
      var alt, alts = [];
      alt = san.replace(/^([NBRQ])[a-h]?[1-8]?(x?[a-h][1-8][\+\#]?)$/, '$1$2');
      if (alt && alt !== san) alts.push(alt);
      alt = san.replace(/^([NBRQ])([a-h])[1-8]?(x?[a-h][1-8][\+\#]?)$/, '$1$2$3');
      if (alt && alt !== san) alts.push(alt);
      alt = san.replace(/^([NBRQ])[a-h]?([1-8])(x?[a-h][1-8][\+\#]?)$/, '$1$2$3');
      if (alt && alt !== san) alts.push(alt);
      return alts;
    },

    move: function(move) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */
      var move_obj = null;
      var moves = generate_moves();

      if (typeof move === 'string') {
        /* convert the move string to a move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (move === move_to_san(moves[i], moves)) {
            move_obj = moves[i];
            break;
          }
        }
        if (!move_obj) {
          var alts = this.remove_disambiguation(move);
          if (alts && alts.length > 0) {
            for (var i = 0, len = moves.length; i < len; i++) {
              if (alts.indexOf(move_to_san(moves[i], moves)) !== -1) {
                move_obj = moves[i];
                break;
              }
            }
          }
        }
      } else if (typeof move === 'object') {
        /* convert the pretty move object to an ugly move object */
        for (var i = 0, len = moves.length; i < len; i++) {
          if (move.from === algebraic(moves[i].from) &&
              move.to === algebraic(moves[i].to) &&
              (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)) {
            move_obj = moves[i];
            break;
          }
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null;
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      var pretty_move = make_pretty(move_obj);

      make_move(move_obj);

      return pretty_move;
    },

    undo: function() {
      var move = undo_move();
      return (move) ? make_pretty(move) : null;
    },

    clear: function() {
      return clear();
    },

    put: function(piece, square) {
      return put(piece, square);
    },

    get: function(square) {
      return get(square);
    },

    remove: function(square) {
      return remove(square);
    },

    square_color: function(square) {
      if (square in SQUARES) {
        var sq_0x88 = SQUARES[square];
        return ((rank(sq_0x88) + file(sq_0x88)) % 2 === 0) ? 'light' : 'dark';
      }

      return null;
    },

    history: function(options) {
      var reversed_history = [];
      var move_history = [];
      var verbose = (typeof options !== 'undefined' && 'verbose' in options &&
                     options.verbose);

      while (history.length > 0) {
        reversed_history.push(undo_move());
      }

      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) {
          move_history.push(make_pretty(move));
        } else {
          move_history.push(move_to_san(move));
        }
        make_move(move);
      }

      return move_history;
    }

  };
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chess = Chess;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return Chess;  });

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/iscroll/build/iscroll.js":[function(require,module,exports){
/*! iScroll v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, document, Math) {
var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };

var utils = (function () {
	var me = {};

	var _elementStyle = document.createElement('div').style;
	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransform';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}

		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}

	me.getTime = Date.now || function getTime () { return new Date().getTime(); };

	me.extend = function (target, obj) {
		for ( var i in obj ) {
			target[i] = obj[i];
		}
	};

	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);
	};

	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};

	me.prefixPointerEvent = function (pointerEvent) {
		return window.MSPointerEvent ? 
			'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
			pointerEvent;
	};

	me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	// This should find all Android browsers lower than build 535.19 (both stock browser and webview)
	me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transitionDelay: _prefixStyle('transitionDelay'),
		transformOrigin: _prefixStyle('transformOrigin')
	});

	me.hasClass = function (e, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
		return re.test(e.className);
	};

	me.addClass = function (e, c) {
		if ( me.hasClass(e, c) ) {
			return;
		}

		var newclass = e.className.split(' ');
		newclass.push(c);
		e.className = newclass.join(' ');
	};

	me.removeClass = function (e, c) {
		if ( !me.hasClass(e, c) ) {
			return;
		}

		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
		e.className = e.className.replace(re, ' ');
	};

	me.offset = function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		// jshint -W084
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		// jshint +W084

		return {
			left: left,
			top: top
		};
	};

	me.preventDefaultException = function (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}

		return false;
	};

	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		pointerdown: 3,
		pointermove: 3,
		pointerup: 3,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});

	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function (k) {
				if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function (k) {
				var f = 0.22,
					e = 0.4;

				if ( k === 0 ) { return 0; }
				if ( k == 1 ) { return 1; }

				return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
			ev;

		if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
			ev = document.createEvent('MouseEvents');
			ev.initMouseEvent('click', true, true, e.view, 1,
				target.screenX, target.screenY, target.clientX, target.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				0, null);

			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	return me;
})();

function IScroll (el, options) {
	this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.scrollerStyle = this.scroller.style;		// cache style for better performance

	this.options = {

		resizeScrollbars: true,

		mouseWheelSpeed: 20,

		snapThreshold: 0.334,

// INSERT POINT: OPTIONS 

		startX: 0,
		startY: 0,
		scrollY: true,
		directionLockThreshold: 5,
		momentum: true,

		bounce: true,
		bounceTime: 600,
		bounceEasing: '',

		preventDefault: true,
		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

		HWCompositing: true,
		useTransition: true,
		useTransform: true
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	// Normalize options
	this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;

	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if ( this.options.tap === true ) {
		this.options.tap = 'tap';
	}

	if ( this.options.shrinkScrollbars == 'scale' ) {
		this.options.useTransition = false;
	}

	this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

// INSERT POINT: NORMALIZATION

	// Some defaults	
	this.x = 0;
	this.y = 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

// INSERT POINT: DEFAULTS

	this._init();
	this.refresh();

	this.scrollTo(this.options.startX, this.options.startY);
	this.enable();
}

IScroll.prototype = {
	version: '5.1.3',

	_init: function () {
		this._initEvents();

		if ( this.options.scrollbars || this.options.indicators ) {
			this._initIndicators();
		}

		if ( this.options.mouseWheel ) {
			this._initWheel();
		}

		if ( this.options.snap ) {
			this._initSnap();
		}

		if ( this.options.keyBindings ) {
			this._initKeys();
		}

// INSERT POINT: _init

	},

	destroy: function () {
		this._initEvents(true);

		this._execEvent('destroy');
	},

	_transitionEnd: function (e) {
		if ( e.target != this.scroller || !this.isInTransition ) {
			return;
		}

		this._transitionTime();
		if ( !this.resetPosition(this.options.bounceTime) ) {
			this.isInTransition = false;
			this._execEvent('scrollEnd');
		}
	},

	_start: function (e) {
		// React to left mouse button only
		if ( utils.eventType[e.type] != 1 ) {
			if ( e.button !== 0 ) {
				return;
			}
		}

		if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
			return;
		}

		if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,
			pos;

		this.initiated	= utils.eventType[e.type];
		this.moved		= false;
		this.distX		= 0;
		this.distY		= 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this._transitionTime();

		this.startTime = utils.getTime();

		if ( this.options.useTransition && this.isInTransition ) {
			this.isInTransition = false;
			pos = this.getComputedPosition();
			this._translate(Math.round(pos.x), Math.round(pos.y));
			this._execEvent('scrollEnd');
		} else if ( !this.options.useTransition && this.isAnimating ) {
			this.isAnimating = false;
			this._execEvent('scrollEnd');
		}

		this.startX    = this.x;
		this.startY    = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX    = point.pageX;
		this.pointY    = point.pageY;

		this._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault ) {	// increases performance on Android? TODO: check!
			e.preventDefault();
		}

		var point		= e.touches ? e.touches[0] : e,
			deltaX		= point.pageX - this.pointX,
			deltaY		= point.pageY - this.pointY,
			timestamp	= utils.getTime(),
			newX, newY,
			absDistX, absDistY;

		this.pointX		= point.pageX;
		this.pointY		= point.pageY;

		this.distX		+= deltaX;
		this.distY		+= deltaY;
		absDistX		= Math.abs(this.distX);
		absDistY		= Math.abs(this.distY);

		// We need to move at least 10 pixels for the scrolling to initiate
		if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// If you are scrolling in one direction lock the other
		if ( !this.directionLocked && !this.options.freeScroll ) {
			if ( absDistX > absDistY + this.options.directionLockThreshold ) {
				this.directionLocked = 'h';		// lock horizontally
			} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
				this.directionLocked = 'v';		// lock vertically
			} else {
				this.directionLocked = 'n';		// no lock
			}
		}

		if ( this.directionLocked == 'h' ) {
			if ( this.options.eventPassthrough == 'vertical' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'horizontal' ) {
				this.initiated = false;
				return;
			}

			deltaY = 0;
		} else if ( this.directionLocked == 'v' ) {
			if ( this.options.eventPassthrough == 'horizontal' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'vertical' ) {
				this.initiated = false;
				return;
			}

			deltaX = 0;
		}

		deltaX = this.hasHorizontalScroll ? deltaX : 0;
		deltaY = this.hasVerticalScroll ? deltaY : 0;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries
		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if ( !this.moved ) {
			this._execEvent('scrollStart');
		}

		this.moved = true;

		this._translate(newX, newY);

/* REPLACE START: _move */

		if ( timestamp - this.startTime > 300 ) {
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}

/* REPLACE END: _move */

	},

	_end: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.changedTouches ? e.changedTouches[0] : e,
			momentumX,
			momentumY,
			duration = utils.getTime() - this.startTime,
			newX = Math.round(this.x),
			newY = Math.round(this.y),
			distanceX = Math.abs(newX - this.startX),
			distanceY = Math.abs(newY - this.startY),
			time = 0,
			easing = '';

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();

		// reset if we are outside of the boundaries
		if ( this.resetPosition(this.options.bounceTime) ) {
			return;
		}

		this.scrollTo(newX, newY);	// ensures that the last position is rounded

		// we scrolled less than 10 pixels
		if ( !this.moved ) {
			if ( this.options.tap ) {
				utils.tap(e, this.options.tap);
			}

			if ( this.options.click ) {
				utils.click(e);
			}

			this._execEvent('scrollCancel');
			return;
		}

		if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
			this._execEvent('flick');
			return;
		}

		// start momentum animation if needed
		if ( this.options.momentum && duration < 300 ) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}


		if ( this.options.snap ) {
			var snap = this._nearestSnap(newX, newY);
			this.currentPage = snap;
			time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(newX - snap.x), 1000),
						Math.min(Math.abs(newY - snap.y), 1000)
					), 300);
			newX = snap.x;
			newY = snap.y;

			this.directionX = 0;
			this.directionY = 0;
			easing = this.options.bounceEasing;
		}

// INSERT POINT: _end

		if ( newX != this.x || newY != this.y ) {
			// change easing function when scroller goes out of the boundaries
			if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
				easing = utils.ease.quadratic;
			}

			this.scrollTo(newX, newY, time, easing);
			return;
		}

		this._execEvent('scrollEnd');
	},

	_resize: function () {
		var that = this;

		clearTimeout(this.resizeTimeout);

		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},

	resetPosition: function (time) {
		var x = this.x,
			y = this.y;

		time = time || 0;

		if ( !this.hasHorizontalScroll || this.x > 0 ) {
			x = 0;
		} else if ( this.x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( !this.hasVerticalScroll || this.y > 0 ) {
			y = 0;
		} else if ( this.y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		if ( x == this.x && y == this.y ) {
			return false;
		}

		this.scrollTo(x, y, time, this.options.bounceEasing);

		return true;
	},

	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},

	refresh: function () {
		var rf = this.wrapper.offsetHeight;		// Force reflow

		this.wrapperWidth	= this.wrapper.clientWidth;
		this.wrapperHeight	= this.wrapper.clientHeight;

/* REPLACE START: refresh */

		this.scrollerWidth	= this.scroller.offsetWidth;
		this.scrollerHeight	= this.scroller.offsetHeight;

		this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
		this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;

/* REPLACE END: refresh */

		this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

		if ( !this.hasHorizontalScroll ) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if ( !this.hasVerticalScroll ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		this.wrapperOffset = utils.offset(this.wrapper);

		this._execEvent('refresh');

		this.resetPosition();

// INSERT POINT: _refresh

	},

	on: function (type, fn) {
		if ( !this._events[type] ) {
			this._events[type] = [];
		}

		this._events[type].push(fn);
	},

	off: function (type, fn) {
		if ( !this._events[type] ) {
			return;
		}

		var index = this._events[type].indexOf(fn);

		if ( index > -1 ) {
			this._events[type].splice(index, 1);
		}
	},

	_execEvent: function (type) {
		if ( !this._events[type] ) {
			return;
		}

		var i = 0,
			l = this._events[type].length;

		if ( !l ) {
			return;
		}

		for ( ; i < l; i++ ) {
			this._events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	},

	scrollBy: function (x, y, time, easing) {
		x = this.x + x;
		y = this.y + y;
		time = time || 0;

		this.scrollTo(x, y, time, easing);
	},

	scrollTo: function (x, y, time, easing) {
		easing = easing || utils.ease.circular;

		this.isInTransition = this.options.useTransition && time > 0;

		if ( !time || (this.options.useTransition && easing.style) ) {
			this._transitionTimingFunction(easing.style);
			this._transitionTime(time);
			this._translate(x, y);
		} else {
			this._animate(x, y, time, easing.fn);
		}
	},

	scrollToElement: function (el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if ( !el ) {
			return;
		}

		var pos = utils.offset(el);

		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		if ( offsetX === true ) {
			offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
		}

		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;

		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},

	_transitionTime: function (time) {
		time = time || 0;

		this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
		}


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].transitionTime(time);
			}
		}


// INSERT POINT: _transitionTime

	},

	_transitionTimingFunction: function (easing) {
		this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].transitionTimingFunction(easing);
			}
		}


// INSERT POINT: _transitionTimingFunction

	},

	_translate: function (x, y) {
		if ( this.options.useTransform ) {

/* REPLACE START: _translate */

			this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

/* REPLACE END: _translate */

		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}

		this.x = x;
		this.y = y;


	if ( this.indicators ) {
		for ( var i = this.indicators.length; i--; ) {
			this.indicators[i].updatePosition();
		}
	}


// INSERT POINT: _translate

	},

	_initEvents: function (remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
			target = this.options.bindToWrapper ? this.wrapper : window;

		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if ( this.options.click ) {
			eventType(this.wrapper, 'click', this, true);
		}

		if ( !this.options.disableMouse ) {
			eventType(this.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if ( utils.hasPointer && !this.options.disablePointer ) {
			eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
			eventType(target, utils.prefixPointerEvent('pointermove'), this);
			eventType(target, utils.prefixPointerEvent('pointercancel'), this);
			eventType(target, utils.prefixPointerEvent('pointerup'), this);
		}

		if ( utils.hasTouch && !this.options.disableTouch ) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);
	},

	getComputedPosition: function () {
		var matrix = window.getComputedStyle(this.scroller, null),
			x, y;

		if ( this.options.useTransform ) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	},

	_initIndicators: function () {
		var interactive = this.options.interactiveScrollbars,
			customStyle = typeof this.options.scrollbars != 'string',
			indicators = [],
			indicator;

		var that = this;

		this.indicators = [];

		if ( this.options.scrollbars ) {
			// Vertical scrollbar
			if ( this.options.scrollY ) {
				indicator = {
					el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenX: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			// Horizontal scrollbar
			if ( this.options.scrollX ) {
				indicator = {
					el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenY: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}
		}

		if ( this.options.indicators ) {
			// TODO: check concat compatibility
			indicators = indicators.concat(this.options.indicators);
		}

		for ( var i = indicators.length; i--; ) {
			this.indicators.push( new Indicator(this, indicators[i]) );
		}

		// TODO: check if we can use array.map (wide compatibility and performance issues)
		function _indicatorsMap (fn) {
			for ( var i = that.indicators.length; i--; ) {
				fn.call(that.indicators[i]);
			}
		}

		if ( this.options.fadeScrollbars ) {
			this.on('scrollEnd', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollCancel', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1);
				});
			});

			this.on('beforeScrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1, true);
				});
			});
		}


		this.on('refresh', function () {
			_indicatorsMap(function () {
				this.refresh();
			});
		});

		this.on('destroy', function () {
			_indicatorsMap(function () {
				this.destroy();
			});

			delete this.indicators;
		});
	},

	_initWheel: function () {
		utils.addEvent(this.wrapper, 'wheel', this);
		utils.addEvent(this.wrapper, 'mousewheel', this);
		utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

		this.on('destroy', function () {
			utils.removeEvent(this.wrapper, 'wheel', this);
			utils.removeEvent(this.wrapper, 'mousewheel', this);
			utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
		});
	},

	_wheel: function (e) {
		if ( !this.enabled ) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		var wheelDeltaX, wheelDeltaY,
			newX, newY,
			that = this;

		if ( this.wheelTimeout === undefined ) {
			that._execEvent('scrollStart');
		}

		// Execute the scrollEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(function () {
			that._execEvent('scrollEnd');
			that.wheelTimeout = undefined;
		}, 400);

		if ( 'deltaX' in e ) {
			if (e.deltaMode === 1) {
				wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
				wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
			} else {
				wheelDeltaX = -e.deltaX;
				wheelDeltaY = -e.deltaY;
			}
		} else if ( 'wheelDeltaX' in e ) {
			wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
			wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
		} else if ( 'wheelDelta' in e ) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
		} else if ( 'detail' in e ) {
			wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
		} else {
			return;
		}

		wheelDeltaX *= this.options.invertWheelDirection;
		wheelDeltaY *= this.options.invertWheelDirection;

		if ( !this.hasVerticalScroll ) {
			wheelDeltaX = wheelDeltaY;
			wheelDeltaY = 0;
		}

		if ( this.options.snap ) {
			newX = this.currentPage.pageX;
			newY = this.currentPage.pageY;

			if ( wheelDeltaX > 0 ) {
				newX--;
			} else if ( wheelDeltaX < 0 ) {
				newX++;
			}

			if ( wheelDeltaY > 0 ) {
				newY--;
			} else if ( wheelDeltaY < 0 ) {
				newY++;
			}

			this.goToPage(newX, newY);

			return;
		}

		newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
		newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

		if ( newX > 0 ) {
			newX = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
		}

		if ( newY > 0 ) {
			newY = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
		}

		this.scrollTo(newX, newY, 0);

// INSERT POINT: _wheel
	},

	_initSnap: function () {
		this.currentPage = {};

		if ( typeof this.options.snap == 'string' ) {
			this.options.snap = this.scroller.querySelectorAll(this.options.snap);
		}

		this.on('refresh', function () {
			var i = 0, l,
				m = 0, n,
				cx, cy,
				x = 0, y,
				stepX = this.options.snapStepX || this.wrapperWidth,
				stepY = this.options.snapStepY || this.wrapperHeight,
				el;

			this.pages = [];

			if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
				return;
			}

			if ( this.options.snap === true ) {
				cx = Math.round( stepX / 2 );
				cy = Math.round( stepY / 2 );

				while ( x > -this.scrollerWidth ) {
					this.pages[i] = [];
					l = 0;
					y = 0;

					while ( y > -this.scrollerHeight ) {
						this.pages[i][l] = {
							x: Math.max(x, this.maxScrollX),
							y: Math.max(y, this.maxScrollY),
							width: stepX,
							height: stepY,
							cx: x - cx,
							cy: y - cy
						};

						y -= stepY;
						l++;
					}

					x -= stepX;
					i++;
				}
			} else {
				el = this.options.snap;
				l = el.length;
				n = -1;

				for ( ; i < l; i++ ) {
					if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
						m = 0;
						n++;
					}

					if ( !this.pages[m] ) {
						this.pages[m] = [];
					}

					x = Math.max(-el[i].offsetLeft, this.maxScrollX);
					y = Math.max(-el[i].offsetTop, this.maxScrollY);
					cx = x - Math.round(el[i].offsetWidth / 2);
					cy = y - Math.round(el[i].offsetHeight / 2);

					this.pages[m][n] = {
						x: x,
						y: y,
						width: el[i].offsetWidth,
						height: el[i].offsetHeight,
						cx: cx,
						cy: cy
					};

					if ( x > this.maxScrollX ) {
						m++;
					}
				}
			}

			this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

			// Update snap threshold if needed
			if ( this.options.snapThreshold % 1 === 0 ) {
				this.snapThresholdX = this.options.snapThreshold;
				this.snapThresholdY = this.options.snapThreshold;
			} else {
				this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
				this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
			}
		});

		this.on('flick', function () {
			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.x - this.startX), 1000),
						Math.min(Math.abs(this.y - this.startY), 1000)
					), 300);

			this.goToPage(
				this.currentPage.pageX + this.directionX,
				this.currentPage.pageY + this.directionY,
				time
			);
		});
	},

	_nearestSnap: function (x, y) {
		if ( !this.pages.length ) {
			return { x: 0, y: 0, pageX: 0, pageY: 0 };
		}

		var i = 0,
			l = this.pages.length,
			m = 0;

		// Check if we exceeded the snap threshold
		if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
			Math.abs(y - this.absStartY) < this.snapThresholdY ) {
			return this.currentPage;
		}

		if ( x > 0 ) {
			x = 0;
		} else if ( x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( y > 0 ) {
			y = 0;
		} else if ( y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		for ( ; i < l; i++ ) {
			if ( x >= this.pages[i][0].cx ) {
				x = this.pages[i][0].x;
				break;
			}
		}

		l = this.pages[i].length;

		for ( ; m < l; m++ ) {
			if ( y >= this.pages[0][m].cy ) {
				y = this.pages[0][m].y;
				break;
			}
		}

		if ( i == this.currentPage.pageX ) {
			i += this.directionX;

			if ( i < 0 ) {
				i = 0;
			} else if ( i >= this.pages.length ) {
				i = this.pages.length - 1;
			}

			x = this.pages[i][0].x;
		}

		if ( m == this.currentPage.pageY ) {
			m += this.directionY;

			if ( m < 0 ) {
				m = 0;
			} else if ( m >= this.pages[0].length ) {
				m = this.pages[0].length - 1;
			}

			y = this.pages[0][m].y;
		}

		return {
			x: x,
			y: y,
			pageX: i,
			pageY: m
		};
	},

	goToPage: function (x, y, time, easing) {
		easing = easing || this.options.bounceEasing;

		if ( x >= this.pages.length ) {
			x = this.pages.length - 1;
		} else if ( x < 0 ) {
			x = 0;
		}

		if ( y >= this.pages[x].length ) {
			y = this.pages[x].length - 1;
		} else if ( y < 0 ) {
			y = 0;
		}

		var posX = this.pages[x][y].x,
			posY = this.pages[x][y].y;

		time = time === undefined ? this.options.snapSpeed || Math.max(
			Math.max(
				Math.min(Math.abs(posX - this.x), 1000),
				Math.min(Math.abs(posY - this.y), 1000)
			), 300) : time;

		this.currentPage = {
			x: posX,
			y: posY,
			pageX: x,
			pageY: y
		};

		this.scrollTo(posX, posY, time, easing);
	},

	next: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x++;

		if ( x >= this.pages.length && this.hasVerticalScroll ) {
			x = 0;
			y++;
		}

		this.goToPage(x, y, time, easing);
	},

	prev: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x--;

		if ( x < 0 && this.hasVerticalScroll ) {
			x = 0;
			y--;
		}

		this.goToPage(x, y, time, easing);
	},

	_initKeys: function (e) {
		// default key bindings
		var keys = {
			pageUp: 33,
			pageDown: 34,
			end: 35,
			home: 36,
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		var i;

		// if you give me characters I give you keycode
		if ( typeof this.options.keyBindings == 'object' ) {
			for ( i in this.options.keyBindings ) {
				if ( typeof this.options.keyBindings[i] == 'string' ) {
					this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
				}
			}
		} else {
			this.options.keyBindings = {};
		}

		for ( i in keys ) {
			this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
		}

		utils.addEvent(window, 'keydown', this);

		this.on('destroy', function () {
			utils.removeEvent(window, 'keydown', this);
		});
	},

	_key: function (e) {
		if ( !this.enabled ) {
			return;
		}

		var snap = this.options.snap,	// we are using this alot, better to cache it
			newX = snap ? this.currentPage.pageX : this.x,
			newY = snap ? this.currentPage.pageY : this.y,
			now = utils.getTime(),
			prevTime = this.keyTime || 0,
			acceleration = 0.250,
			pos;

		if ( this.options.useTransition && this.isInTransition ) {
			pos = this.getComputedPosition();

			this._translate(Math.round(pos.x), Math.round(pos.y));
			this.isInTransition = false;
		}

		this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

		switch ( e.keyCode ) {
			case this.options.keyBindings.pageUp:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX += snap ? 1 : this.wrapperWidth;
				} else {
					newY += snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.pageDown:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX -= snap ? 1 : this.wrapperWidth;
				} else {
					newY -= snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.end:
				newX = snap ? this.pages.length-1 : this.maxScrollX;
				newY = snap ? this.pages[0].length-1 : this.maxScrollY;
				break;
			case this.options.keyBindings.home:
				newX = 0;
				newY = 0;
				break;
			case this.options.keyBindings.left:
				newX += snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.up:
				newY += snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.right:
				newX -= snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.down:
				newY -= snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			default:
				return;
		}

		if ( snap ) {
			this.goToPage(newX, newY);
			return;
		}

		if ( newX > 0 ) {
			newX = 0;
			this.keyAcceleration = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
			this.keyAcceleration = 0;
		}

		if ( newY > 0 ) {
			newY = 0;
			this.keyAcceleration = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
			this.keyAcceleration = 0;
		}

		this.scrollTo(newX, newY, 0);

		this.keyTime = now;
	},

	_animate: function (destX, destY, duration, easingFn) {
		var that = this,
			startX = this.x,
			startY = this.y,
			startTime = utils.getTime(),
			destTime = startTime + duration;

		function step () {
			var now = utils.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if ( !that.resetPosition(that.options.bounceTime) ) {
					that._execEvent('scrollEnd');
				}

				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that._translate(newX, newY);

			if ( that.isAnimating ) {
				rAF(step);
			}
		}

		this.isAnimating = true;
		step();
	},
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
			case 'click':
				if ( !e._constructed ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
	}
};
function createDefaultScrollbar (direction, interactive, type) {
	var scrollbar = document.createElement('div'),
		indicator = document.createElement('div');

	if ( type === true ) {
		scrollbar.style.cssText = 'position:absolute;z-index:9999';
		indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
	}

	indicator.className = 'iScrollIndicator';

	if ( direction == 'h' ) {
		if ( type === true ) {
			scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
			indicator.style.height = '100%';
		}
		scrollbar.className = 'iScrollHorizontalScrollbar';
	} else {
		if ( type === true ) {
			scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
			indicator.style.width = '100%';
		}
		scrollbar.className = 'iScrollVerticalScrollbar';
	}

	scrollbar.style.cssText += ';overflow:hidden';

	if ( !interactive ) {
		scrollbar.style.pointerEvents = 'none';
	}

	scrollbar.appendChild(indicator);

	return scrollbar;
}

function Indicator (scroller, options) {
	this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
	this.wrapperStyle = this.wrapper.style;
	this.indicator = this.wrapper.children[0];
	this.indicatorStyle = this.indicator.style;
	this.scroller = scroller;

	this.options = {
		listenX: true,
		listenY: true,
		interactive: false,
		resize: true,
		defaultScrollbars: false,
		shrink: false,
		fade: false,
		speedRatioX: 0,
		speedRatioY: 0
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	this.sizeRatioX = 1;
	this.sizeRatioY = 1;
	this.maxPosX = 0;
	this.maxPosY = 0;

	if ( this.options.interactive ) {
		if ( !this.options.disableTouch ) {
			utils.addEvent(this.indicator, 'touchstart', this);
			utils.addEvent(window, 'touchend', this);
		}
		if ( !this.options.disablePointer ) {
			utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
		}
		if ( !this.options.disableMouse ) {
			utils.addEvent(this.indicator, 'mousedown', this);
			utils.addEvent(window, 'mouseup', this);
		}
	}

	if ( this.options.fade ) {
		this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
		this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
		this.wrapperStyle.opacity = '0';
	}
}

Indicator.prototype = {
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
		}
	},

	destroy: function () {
		if ( this.options.interactive ) {
			utils.removeEvent(this.indicator, 'touchstart', this);
			utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.removeEvent(this.indicator, 'mousedown', this);

			utils.removeEvent(window, 'touchmove', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
			utils.removeEvent(window, 'mousemove', this);

			utils.removeEvent(window, 'touchend', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
			utils.removeEvent(window, 'mouseup', this);
		}

		if ( this.options.defaultScrollbars ) {
			this.wrapper.parentNode.removeChild(this.wrapper);
		}
	},

	_start: function (e) {
		var point = e.touches ? e.touches[0] : e;

		e.preventDefault();
		e.stopPropagation();

		this.transitionTime();

		this.initiated = true;
		this.moved = false;
		this.lastPointX	= point.pageX;
		this.lastPointY	= point.pageY;

		this.startTime	= utils.getTime();

		if ( !this.options.disableTouch ) {
			utils.addEvent(window, 'touchmove', this);
		}
		if ( !this.options.disablePointer ) {
			utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
		}
		if ( !this.options.disableMouse ) {
			utils.addEvent(window, 'mousemove', this);
		}

		this.scroller._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		var point = e.touches ? e.touches[0] : e,
			deltaX, deltaY,
			newX, newY,
			timestamp = utils.getTime();

		if ( !this.moved ) {
			this.scroller._execEvent('scrollStart');
		}

		this.moved = true;

		deltaX = point.pageX - this.lastPointX;
		this.lastPointX = point.pageX;

		deltaY = point.pageY - this.lastPointY;
		this.lastPointY = point.pageY;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		this._pos(newX, newY);

// INSERT POINT: indicator._move

		e.preventDefault();
		e.stopPropagation();
	},

	_end: function (e) {
		if ( !this.initiated ) {
			return;
		}

		this.initiated = false;

		e.preventDefault();
		e.stopPropagation();

		utils.removeEvent(window, 'touchmove', this);
		utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
		utils.removeEvent(window, 'mousemove', this);

		if ( this.scroller.options.snap ) {
			var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.scroller.x - snap.x), 1000),
						Math.min(Math.abs(this.scroller.y - snap.y), 1000)
					), 300);

			if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
				this.scroller.directionX = 0;
				this.scroller.directionY = 0;
				this.scroller.currentPage = snap;
				this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
			}
		}

		if ( this.moved ) {
			this.scroller._execEvent('scrollEnd');
		}
	},

	transitionTime: function (time) {
		time = time || 0;
		this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
		}
	},

	transitionTimingFunction: function (easing) {
		this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
	},

	refresh: function () {
		this.transitionTime();

		if ( this.options.listenX && !this.options.listenY ) {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
		} else if ( this.options.listenY && !this.options.listenX ) {
			this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
		} else {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
		}

		if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
			utils.addClass(this.wrapper, 'iScrollBothScrollbars');
			utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '8px';
				} else {
					this.wrapper.style.bottom = '8px';
				}
			}
		} else {
			utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
			utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '2px';
				} else {
					this.wrapper.style.bottom = '2px';
				}
			}
		}

		var r = this.wrapper.offsetHeight;	// force refresh

		if ( this.options.listenX ) {
			this.wrapperWidth = this.wrapper.clientWidth;
			if ( this.options.resize ) {
				this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
				this.indicatorStyle.width = this.indicatorWidth + 'px';
			} else {
				this.indicatorWidth = this.indicator.clientWidth;
			}

			this.maxPosX = this.wrapperWidth - this.indicatorWidth;

			if ( this.options.shrink == 'clip' ) {
				this.minBoundaryX = -this.indicatorWidth + 8;
				this.maxBoundaryX = this.wrapperWidth - 8;
			} else {
				this.minBoundaryX = 0;
				this.maxBoundaryX = this.maxPosX;
			}

			this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));	
		}

		if ( this.options.listenY ) {
			this.wrapperHeight = this.wrapper.clientHeight;
			if ( this.options.resize ) {
				this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
				this.indicatorStyle.height = this.indicatorHeight + 'px';
			} else {
				this.indicatorHeight = this.indicator.clientHeight;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;

			if ( this.options.shrink == 'clip' ) {
				this.minBoundaryY = -this.indicatorHeight + 8;
				this.maxBoundaryY = this.wrapperHeight - 8;
			} else {
				this.minBoundaryY = 0;
				this.maxBoundaryY = this.maxPosY;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;
			this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
		}

		this.updatePosition();
	},

	updatePosition: function () {
		var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
			y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

		if ( !this.options.ignoreBoundaries ) {
			if ( x < this.minBoundaryX ) {
				if ( this.options.shrink == 'scale' ) {
					this.width = Math.max(this.indicatorWidth + x, 8);
					this.indicatorStyle.width = this.width + 'px';
				}
				x = this.minBoundaryX;
			} else if ( x > this.maxBoundaryX ) {
				if ( this.options.shrink == 'scale' ) {
					this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
					this.indicatorStyle.width = this.width + 'px';
					x = this.maxPosX + this.indicatorWidth - this.width;
				} else {
					x = this.maxBoundaryX;
				}
			} else if ( this.options.shrink == 'scale' && this.width != this.indicatorWidth ) {
				this.width = this.indicatorWidth;
				this.indicatorStyle.width = this.width + 'px';
			}

			if ( y < this.minBoundaryY ) {
				if ( this.options.shrink == 'scale' ) {
					this.height = Math.max(this.indicatorHeight + y * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
				}
				y = this.minBoundaryY;
			} else if ( y > this.maxBoundaryY ) {
				if ( this.options.shrink == 'scale' ) {
					this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
					y = this.maxPosY + this.indicatorHeight - this.height;
				} else {
					y = this.maxBoundaryY;
				}
			} else if ( this.options.shrink == 'scale' && this.height != this.indicatorHeight ) {
				this.height = this.indicatorHeight;
				this.indicatorStyle.height = this.height + 'px';
			}
		}

		this.x = x;
		this.y = y;

		if ( this.scroller.options.useTransform ) {
			this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
		} else {
			this.indicatorStyle.left = x + 'px';
			this.indicatorStyle.top = y + 'px';
		}
	},

	_pos: function (x, y) {
		if ( x < 0 ) {
			x = 0;
		} else if ( x > this.maxPosX ) {
			x = this.maxPosX;
		}

		if ( y < 0 ) {
			y = 0;
		} else if ( y > this.maxPosY ) {
			y = this.maxPosY;
		}

		x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
		y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

		this.scroller.scrollTo(x, y);
	},

	fade: function (val, hold) {
		if ( hold && !this.visible ) {
			return;
		}

		clearTimeout(this.fadeTimeout);
		this.fadeTimeout = null;

		var time = val ? 250 : 500,
			delay = val ? 0 : 300;

		val = val ? '1' : '0';

		this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

		this.fadeTimeout = setTimeout((function (val) {
			this.wrapperStyle.opacity = val;
			this.visible = +val;
		}).bind(this, val), delay);
	}
};

IScroll.utils = utils;

if ( typeof module != 'undefined' && module.exports ) {
	module.exports = IScroll;
} else {
	window.IScroll = IScroll;
}

})(window, document, Math);
},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'compact': require('./arrays/compact'),
  'difference': require('./arrays/difference'),
  'drop': require('./arrays/rest'),
  'findIndex': require('./arrays/findIndex'),
  'findLastIndex': require('./arrays/findLastIndex'),
  'first': require('./arrays/first'),
  'flatten': require('./arrays/flatten'),
  'head': require('./arrays/first'),
  'indexOf': require('./arrays/indexOf'),
  'initial': require('./arrays/initial'),
  'intersection': require('./arrays/intersection'),
  'last': require('./arrays/last'),
  'lastIndexOf': require('./arrays/lastIndexOf'),
  'object': require('./arrays/zipObject'),
  'pull': require('./arrays/pull'),
  'range': require('./arrays/range'),
  'remove': require('./arrays/remove'),
  'rest': require('./arrays/rest'),
  'sortedIndex': require('./arrays/sortedIndex'),
  'tail': require('./arrays/rest'),
  'take': require('./arrays/first'),
  'union': require('./arrays/union'),
  'uniq': require('./arrays/uniq'),
  'unique': require('./arrays/uniq'),
  'unzip': require('./arrays/zip'),
  'without': require('./arrays/without'),
  'xor': require('./arrays/xor'),
  'zip': require('./arrays/zip'),
  'zipObject': require('./arrays/zipObject')
};

},{"./arrays/compact":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/compact.js","./arrays/difference":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/difference.js","./arrays/findIndex":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/findIndex.js","./arrays/findLastIndex":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/findLastIndex.js","./arrays/first":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/first.js","./arrays/flatten":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/flatten.js","./arrays/indexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/indexOf.js","./arrays/initial":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/initial.js","./arrays/intersection":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/intersection.js","./arrays/last":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/last.js","./arrays/lastIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/lastIndexOf.js","./arrays/pull":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/pull.js","./arrays/range":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/range.js","./arrays/remove":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/remove.js","./arrays/rest":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/rest.js","./arrays/sortedIndex":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/sortedIndex.js","./arrays/union":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/union.js","./arrays/uniq":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/uniq.js","./arrays/without":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/without.js","./arrays/xor":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/xor.js","./arrays/zip":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/zip.js","./arrays/zipObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/zipObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/compact.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are all falsey.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to compact.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array ? array.length : 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result.push(value);
    }
  }
  return result;
}

module.exports = compact;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/difference.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = require('../internals/baseDifference'),
    baseFlatten = require('../internals/baseFlatten');

/**
 * Creates an array excluding all values of the provided arrays using strict
 * equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to process.
 * @param {...Array} [values] The arrays of values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
 * // => [1, 3, 4]
 */
function difference(array) {
  return baseDifference(array, baseFlatten(arguments, true, true, 1));
}

module.exports = difference;

},{"../internals/baseDifference":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseDifference.js","../internals/baseFlatten":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseFlatten.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/findIndex.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback');

/**
 * This method is like `_.find` except that it returns the index of the first
 * element that passes the callback check, instead of the element itself.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': false },
 *   { 'name': 'fred',    'age': 40, 'blocked': true },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
 * ];
 *
 * _.findIndex(characters, function(chr) {
 *   return chr.age < 20;
 * });
 * // => 2
 *
 * // using "_.where" callback shorthand
 * _.findIndex(characters, { 'age': 36 });
 * // => 0
 *
 * // using "_.pluck" callback shorthand
 * _.findIndex(characters, 'blocked');
 * // => 1
 */
function findIndex(array, callback, thisArg) {
  var index = -1,
      length = array ? array.length : 0;

  callback = createCallback(callback, thisArg, 3);
  while (++index < length) {
    if (callback(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = findIndex;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/findLastIndex.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback');

/**
 * This method is like `_.findIndex` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': true },
 *   { 'name': 'fred',    'age': 40, 'blocked': false },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
 * ];
 *
 * _.findLastIndex(characters, function(chr) {
 *   return chr.age > 30;
 * });
 * // => 1
 *
 * // using "_.where" callback shorthand
 * _.findLastIndex(characters, { 'age': 36 });
 * // => 0
 *
 * // using "_.pluck" callback shorthand
 * _.findLastIndex(characters, 'blocked');
 * // => 2
 */
function findLastIndex(array, callback, thisArg) {
  var length = array ? array.length : 0;
  callback = createCallback(callback, thisArg, 3);
  while (length--) {
    if (callback(array[length], length, array)) {
      return length;
    }
  }
  return -1;
}

module.exports = findLastIndex;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/first.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    slice = require('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the first element or first `n` elements of an array. If a callback
 * is provided elements at the beginning of the array are returned as long
 * as the callback returns truey. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias head, take
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback] The function called
 *  per element or the number of elements to return. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the first element(s) of `array`.
 * @example
 *
 * _.first([1, 2, 3]);
 * // => 1
 *
 * _.first([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.first([1, 2, 3], function(num) {
 *   return num < 3;
 * });
 * // => [1, 2]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.first(characters, 'blocked');
 * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
 *
 * // using "_.where" callback shorthand
 * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
 * // => ['barney', 'fred']
 */
function first(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = -1;
    callback = createCallback(callback, thisArg, 3);
    while (++index < length && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = callback;
    if (n == null || thisArg) {
      return array ? array[0] : undefined;
    }
  }
  return slice(array, 0, nativeMin(nativeMax(0, n), length));
}

module.exports = first;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/flatten.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = require('../internals/baseFlatten'),
    map = require('../collections/map');

/**
 * Flattens a nested array (the nesting can be to any depth). If `isShallow`
 * is truey, the array will only be flattened a single level. If a callback
 * is provided each element of the array is passed through the callback before
 * flattening. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to flatten.
 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new flattened array.
 * @example
 *
 * _.flatten([1, [2], [3, [[4]]]]);
 * // => [1, 2, 3, 4];
 *
 * _.flatten([1, [2], [3, [[4]]]], true);
 * // => [1, 2, 3, [[4]]];
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.flatten(characters, 'pets');
 * // => ['hoppy', 'baby puss', 'dino']
 */
function flatten(array, isShallow, callback, thisArg) {
  // juggle arguments
  if (typeof isShallow != 'boolean' && isShallow != null) {
    thisArg = callback;
    callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
    isShallow = false;
  }
  if (callback != null) {
    array = map(array, callback, thisArg);
  }
  return baseFlatten(array, isShallow);
}

module.exports = flatten;

},{"../collections/map":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/map.js","../internals/baseFlatten":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseFlatten.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/indexOf.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('../internals/baseIndexOf'),
    sortedIndex = require('./sortedIndex');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Gets the index at which the first occurrence of `value` is found using
 * strict equality for comparisons, i.e. `===`. If the array is already sorted
 * providing `true` for `fromIndex` will run a faster binary search.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {boolean|number} [fromIndex=0] The index to search from or `true`
 *  to perform a binary search on a sorted array.
 * @returns {number} Returns the index of the matched value or `-1`.
 * @example
 *
 * _.indexOf([1, 2, 3, 1, 2, 3], 2);
 * // => 1
 *
 * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
 * // => 4
 *
 * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
 * // => 2
 */
function indexOf(array, value, fromIndex) {
  if (typeof fromIndex == 'number') {
    var length = array ? array.length : 0;
    fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
  } else if (fromIndex) {
    var index = sortedIndex(array, value);
    return array[index] === value ? index : -1;
  }
  return baseIndexOf(array, value, fromIndex);
}

module.exports = indexOf;

},{"../internals/baseIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIndexOf.js","./sortedIndex":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/sortedIndex.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/initial.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    slice = require('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets all but the last element or last `n` elements of an array. If a
 * callback is provided elements at the end of the array are excluded from
 * the result as long as the callback returns truey. The callback is bound
 * to `thisArg` and invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback=1] The function called
 *  per element or the number of elements to exclude. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 *
 * _.initial([1, 2, 3], 2);
 * // => [1]
 *
 * _.initial([1, 2, 3], function(num) {
 *   return num > 1;
 * });
 * // => [1]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.initial(characters, 'blocked');
 * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
 *
 * // using "_.where" callback shorthand
 * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
 * // => ['barney', 'fred']
 */
function initial(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = length;
    callback = createCallback(callback, thisArg, 3);
    while (index-- && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = (callback == null || thisArg) ? 1 : callback || n;
  }
  return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
}

module.exports = initial;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/intersection.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('../internals/baseIndexOf'),
    cacheIndexOf = require('../internals/cacheIndexOf'),
    createCache = require('../internals/createCache'),
    getArray = require('../internals/getArray'),
    isArguments = require('../objects/isArguments'),
    isArray = require('../objects/isArray'),
    largeArraySize = require('../internals/largeArraySize'),
    releaseArray = require('../internals/releaseArray'),
    releaseObject = require('../internals/releaseObject');

/**
 * Creates an array of unique values present in all provided arrays using
 * strict equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of shared values.
 * @example
 *
 * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
 * // => [1, 2]
 */
function intersection() {
  var args = [],
      argsIndex = -1,
      argsLength = arguments.length,
      caches = getArray(),
      indexOf = baseIndexOf,
      trustIndexOf = indexOf === baseIndexOf,
      seen = getArray();

  while (++argsIndex < argsLength) {
    var value = arguments[argsIndex];
    if (isArray(value) || isArguments(value)) {
      args.push(value);
      caches.push(trustIndexOf && value.length >= largeArraySize &&
        createCache(argsIndex ? args[argsIndex] : seen));
    }
  }
  var array = args[0],
      index = -1,
      length = array ? array.length : 0,
      result = [];

  outer:
  while (++index < length) {
    var cache = caches[0];
    value = array[index];

    if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
      argsIndex = argsLength;
      (cache || seen).push(value);
      while (--argsIndex) {
        cache = caches[argsIndex];
        if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
          continue outer;
        }
      }
      result.push(value);
    }
  }
  while (argsLength--) {
    cache = caches[argsLength];
    if (cache) {
      releaseObject(cache);
    }
  }
  releaseArray(caches);
  releaseArray(seen);
  return result;
}

module.exports = intersection;

},{"../internals/baseIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIndexOf.js","../internals/cacheIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/cacheIndexOf.js","../internals/createCache":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createCache.js","../internals/getArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getArray.js","../internals/largeArraySize":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/largeArraySize.js","../internals/releaseArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseArray.js","../internals/releaseObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseObject.js","../objects/isArguments":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArguments.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/last.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    slice = require('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Gets the last element or last `n` elements of an array. If a callback is
 * provided elements at the end of the array are returned as long as the
 * callback returns truey. The callback is bound to `thisArg` and invoked
 * with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback] The function called
 *  per element or the number of elements to return. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the last element(s) of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 *
 * _.last([1, 2, 3], 2);
 * // => [2, 3]
 *
 * _.last([1, 2, 3], function(num) {
 *   return num > 1;
 * });
 * // => [2, 3]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.pluck(_.last(characters, 'blocked'), 'name');
 * // => ['fred', 'pebbles']
 *
 * // using "_.where" callback shorthand
 * _.last(characters, { 'employer': 'na' });
 * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
 */
function last(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = length;
    callback = createCallback(callback, thisArg, 3);
    while (index-- && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = callback;
    if (n == null || thisArg) {
      return array ? array[length - 1] : undefined;
    }
  }
  return slice(array, nativeMax(0, length - n));
}

module.exports = last;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/lastIndexOf.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the index at which the last occurrence of `value` is found using strict
 * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
 * as the offset from the end of the collection.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value or `-1`.
 * @example
 *
 * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
 * // => 4
 *
 * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
 * // => 1
 */
function lastIndexOf(array, value, fromIndex) {
  var index = array ? array.length : 0;
  if (typeof fromIndex == 'number') {
    index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
  }
  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = lastIndexOf;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/pull.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var splice = arrayRef.splice;

/**
 * Removes all provided values from the given array using strict equality for
 * comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to modify.
 * @param {...*} [value] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3, 1, 2, 3];
 * _.pull(array, 2, 3);
 * console.log(array);
 * // => [1, 1]
 */
function pull(array) {
  var args = arguments,
      argsIndex = 0,
      argsLength = args.length,
      length = array ? array.length : 0;

  while (++argsIndex < argsLength) {
    var index = -1,
        value = args[argsIndex];
    while (++index < length) {
      if (array[index] === value) {
        splice.call(array, index--, 1);
        length--;
      }
    }
  }
  return array;
}

module.exports = pull;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/range.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Native method shortcuts */
var ceil = Math.ceil;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to but not including `end`. If `start` is less than `stop` a
 * zero-length range is created unless a negative `step` is specified.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns a new range array.
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
function range(start, end, step) {
  start = +start || 0;
  step = typeof step == 'number' ? step : (+step || 1);

  if (end == null) {
    end = start;
    start = 0;
  }
  // use `Array(length)` so engines like Chakra and V8 avoid slower modes
  // http://youtu.be/XAqIpGU8ZZk#t=17m25s
  var index = -1,
      length = nativeMax(0, ceil((end - start) / (step || 1))),
      result = Array(length);

  while (++index < length) {
    result[index] = start;
    start += step;
  }
  return result;
}

module.exports = range;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/remove.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var splice = arrayRef.splice;

/**
 * Removes all elements from an array that the callback returns truey for
 * and returns an array of removed elements. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to modify.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of removed elements.
 * @example
 *
 * var array = [1, 2, 3, 4, 5, 6];
 * var evens = _.remove(array, function(num) { return num % 2 == 0; });
 *
 * console.log(array);
 * // => [1, 3, 5]
 *
 * console.log(evens);
 * // => [2, 4, 6]
 */
function remove(array, callback, thisArg) {
  var index = -1,
      length = array ? array.length : 0,
      result = [];

  callback = createCallback(callback, thisArg, 3);
  while (++index < length) {
    var value = array[index];
    if (callback(value, index, array)) {
      result.push(value);
      splice.call(array, index--, 1);
      length--;
    }
  }
  return result;
}

module.exports = remove;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/rest.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    slice = require('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * The opposite of `_.initial` this method gets all but the first element or
 * first `n` elements of an array. If a callback function is provided elements
 * at the beginning of the array are excluded from the result as long as the
 * callback returns truey. The callback is bound to `thisArg` and invoked
 * with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias drop, tail
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback=1] The function called
 *  per element or the number of elements to exclude. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a slice of `array`.
 * @example
 *
 * _.rest([1, 2, 3]);
 * // => [2, 3]
 *
 * _.rest([1, 2, 3], 2);
 * // => [3]
 *
 * _.rest([1, 2, 3], function(num) {
 *   return num < 3;
 * });
 * // => [3]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.pluck(_.rest(characters, 'blocked'), 'name');
 * // => ['fred', 'pebbles']
 *
 * // using "_.where" callback shorthand
 * _.rest(characters, { 'employer': 'slate' });
 * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
 */
function rest(array, callback, thisArg) {
  if (typeof callback != 'number' && callback != null) {
    var n = 0,
        index = -1,
        length = array ? array.length : 0;

    callback = createCallback(callback, thisArg, 3);
    while (++index < length && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
  }
  return slice(array, n);
}

module.exports = rest;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/sortedIndex.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    identity = require('../utilities/identity');

/**
 * Uses a binary search to determine the smallest index at which a value
 * should be inserted into a given sorted array in order to maintain the sort
 * order of the array. If a callback is provided it will be executed for
 * `value` and each element of `array` to compute their sort ranking. The
 * callback is bound to `thisArg` and invoked with one argument; (value).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedIndex([20, 30, 50], 40);
 * // => 2
 *
 * // using "_.pluck" callback shorthand
 * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
 * // => 2
 *
 * var dict = {
 *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
 * };
 *
 * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
 *   return dict.wordToNumber[word];
 * });
 * // => 2
 *
 * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
 *   return this.wordToNumber[word];
 * }, dict);
 * // => 2
 */
function sortedIndex(array, value, callback, thisArg) {
  var low = 0,
      high = array ? array.length : low;

  // explicitly reference `identity` for better inlining in Firefox
  callback = callback ? createCallback(callback, thisArg, 1) : identity;
  value = callback(value);

  while (low < high) {
    var mid = (low + high) >>> 1;
    (callback(array[mid]) < value)
      ? low = mid + 1
      : high = mid;
  }
  return low;
}

module.exports = sortedIndex;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../utilities/identity":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/identity.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/union.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = require('../internals/baseFlatten'),
    baseUniq = require('../internals/baseUniq');

/**
 * Creates an array of unique values, in order, of the provided arrays using
 * strict equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of combined values.
 * @example
 *
 * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
 * // => [1, 2, 3, 5, 4]
 */
function union() {
  return baseUniq(baseFlatten(arguments, true, true));
}

module.exports = union;

},{"../internals/baseFlatten":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseFlatten.js","../internals/baseUniq":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseUniq.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/uniq.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseUniq = require('../internals/baseUniq'),
    createCallback = require('../functions/createCallback');

/**
 * Creates a duplicate-value-free version of an array using strict equality
 * for comparisons, i.e. `===`. If the array is sorted, providing
 * `true` for `isSorted` will use a faster algorithm. If a callback is provided
 * each element of `array` is passed through the callback before uniqueness
 * is computed. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias unique
 * @category Arrays
 * @param {Array} array The array to process.
 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a duplicate-value-free array.
 * @example
 *
 * _.uniq([1, 2, 1, 3, 1]);
 * // => [1, 2, 3]
 *
 * _.uniq([1, 1, 2, 2, 3], true);
 * // => [1, 2, 3]
 *
 * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
 * // => ['A', 'b', 'C']
 *
 * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
 * // => [1, 2.5, 3]
 *
 * // using "_.pluck" callback shorthand
 * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniq(array, isSorted, callback, thisArg) {
  // juggle arguments
  if (typeof isSorted != 'boolean' && isSorted != null) {
    thisArg = callback;
    callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
    isSorted = false;
  }
  if (callback != null) {
    callback = createCallback(callback, thisArg, 3);
  }
  return baseUniq(array, isSorted, callback);
}

module.exports = uniq;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/baseUniq":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseUniq.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/without.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = require('../internals/baseDifference'),
    slice = require('../internals/slice');

/**
 * Creates an array excluding all provided values using strict equality for
 * comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to filter.
 * @param {...*} [value] The values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
 * // => [2, 3, 4]
 */
function without(array) {
  return baseDifference(array, slice(arguments, 1));
}

module.exports = without;

},{"../internals/baseDifference":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseDifference.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/xor.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = require('../internals/baseDifference'),
    baseUniq = require('../internals/baseUniq'),
    isArguments = require('../objects/isArguments'),
    isArray = require('../objects/isArray');

/**
 * Creates an array that is the symmetric difference of the provided arrays.
 * See http://en.wikipedia.org/wiki/Symmetric_difference.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of values.
 * @example
 *
 * _.xor([1, 2, 3], [5, 2, 1, 4]);
 * // => [3, 5, 4]
 *
 * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
 * // => [1, 4, 5]
 */
function xor() {
  var index = -1,
      length = arguments.length;

  while (++index < length) {
    var array = arguments[index];
    if (isArray(array) || isArguments(array)) {
      var result = result
        ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
        : array;
    }
  }
  return result || [];
}

module.exports = xor;

},{"../internals/baseDifference":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseDifference.js","../internals/baseUniq":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseUniq.js","../objects/isArguments":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArguments.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/zip.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var max = require('../collections/max'),
    pluck = require('../collections/pluck');

/**
 * Creates an array of grouped elements, the first of which contains the first
 * elements of the given arrays, the second of which contains the second
 * elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @alias unzip
 * @category Arrays
 * @param {...Array} [array] Arrays to process.
 * @returns {Array} Returns a new array of grouped elements.
 * @example
 *
 * _.zip(['fred', 'barney'], [30, 40], [true, false]);
 * // => [['fred', 30, true], ['barney', 40, false]]
 */
function zip() {
  var array = arguments.length > 1 ? arguments : arguments[0],
      index = -1,
      length = array ? max(pluck(array, 'length')) : 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = pluck(array, index);
  }
  return result;
}

module.exports = zip;

},{"../collections/max":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/max.js","../collections/pluck":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/pluck.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays/zipObject.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isArray = require('../objects/isArray');

/**
 * Creates an object composed from arrays of `keys` and `values`. Provide
 * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
 * or two arrays, one of `keys` and one of corresponding `values`.
 *
 * @static
 * @memberOf _
 * @alias object
 * @category Arrays
 * @param {Array} keys The array of keys.
 * @param {Array} [values=[]] The array of values.
 * @returns {Object} Returns an object composed of the given keys and
 *  corresponding values.
 * @example
 *
 * _.zipObject(['fred', 'barney'], [30, 40]);
 * // => { 'fred': 30, 'barney': 40 }
 */
function zipObject(keys, values) {
  var index = -1,
      length = keys ? keys.length : 0,
      result = {};

  if (!values && length && !isArray(keys[0])) {
    values = [];
  }
  while (++index < length) {
    var key = keys[index];
    if (values) {
      result[key] = values[index];
    } else if (key) {
      result[key[0]] = key[1];
    }
  }
  return result;
}

module.exports = zipObject;

},{"../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'chain': require('./chaining/chain'),
  'tap': require('./chaining/tap'),
  'value': require('./chaining/wrapperValueOf'),
  'wrapperChain': require('./chaining/wrapperChain'),
  'wrapperToString': require('./chaining/wrapperToString'),
  'wrapperValueOf': require('./chaining/wrapperValueOf')
};

},{"./chaining/chain":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/chain.js","./chaining/tap":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/tap.js","./chaining/wrapperChain":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/wrapperChain.js","./chaining/wrapperToString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/wrapperToString.js","./chaining/wrapperValueOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/wrapperValueOf.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/chain.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var lodashWrapper = require('../internals/lodashWrapper');

/**
 * Creates a `lodash` object that wraps the given value with explicit
 * method chaining enabled.
 *
 * @static
 * @memberOf _
 * @category Chaining
 * @param {*} value The value to wrap.
 * @returns {Object} Returns the wrapper object.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36 },
 *   { 'name': 'fred',    'age': 40 },
 *   { 'name': 'pebbles', 'age': 1 }
 * ];
 *
 * var youngest = _.chain(characters)
 *     .sortBy('age')
 *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
 *     .first()
 *     .value();
 * // => 'pebbles is 1'
 */
function chain(value) {
  value = new lodashWrapper(value);
  value.__chain__ = true;
  return value;
}

module.exports = chain;

},{"../internals/lodashWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/lodashWrapper.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/tap.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Invokes `interceptor` with the `value` as the first argument and then
 * returns `value`. The purpose of this method is to "tap into" a method
 * chain in order to perform operations on intermediate results within
 * the chain.
 *
 * @static
 * @memberOf _
 * @category Chaining
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns `value`.
 * @example
 *
 * _([1, 2, 3, 4])
 *  .tap(function(array) { array.pop(); })
 *  .reverse()
 *  .value();
 * // => [3, 2, 1]
 */
function tap(value, interceptor) {
  interceptor(value);
  return value;
}

module.exports = tap;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/wrapperChain.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Enables explicit method chaining on the wrapper object.
 *
 * @name chain
 * @memberOf _
 * @category Chaining
 * @returns {*} Returns the wrapper object.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // without explicit chaining
 * _(characters).first();
 * // => { 'name': 'barney', 'age': 36 }
 *
 * // with explicit chaining
 * _(characters).chain()
 *   .first()
 *   .pick('age')
 *   .value();
 * // => { 'age': 36 }
 */
function wrapperChain() {
  this.__chain__ = true;
  return this;
}

module.exports = wrapperChain;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/wrapperToString.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Produces the `toString` result of the wrapped value.
 *
 * @name toString
 * @memberOf _
 * @category Chaining
 * @returns {string} Returns the string result.
 * @example
 *
 * _([1, 2, 3]).toString();
 * // => '1,2,3'
 */
function wrapperToString() {
  return String(this.__wrapped__);
}

module.exports = wrapperToString;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining/wrapperValueOf.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = require('../collections/forEach'),
    support = require('../support');

/**
 * Extracts the wrapped value.
 *
 * @name valueOf
 * @memberOf _
 * @alias value
 * @category Chaining
 * @returns {*} Returns the wrapped value.
 * @example
 *
 * _([1, 2, 3]).valueOf();
 * // => [1, 2, 3]
 */
function wrapperValueOf() {
  return this.__wrapped__;
}

module.exports = wrapperValueOf;

},{"../collections/forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js","../support":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/support.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'all': require('./collections/every'),
  'any': require('./collections/some'),
  'at': require('./collections/at'),
  'collect': require('./collections/map'),
  'contains': require('./collections/contains'),
  'countBy': require('./collections/countBy'),
  'detect': require('./collections/find'),
  'each': require('./collections/forEach'),
  'eachRight': require('./collections/forEachRight'),
  'every': require('./collections/every'),
  'filter': require('./collections/filter'),
  'find': require('./collections/find'),
  'findLast': require('./collections/findLast'),
  'findWhere': require('./collections/find'),
  'foldl': require('./collections/reduce'),
  'foldr': require('./collections/reduceRight'),
  'forEach': require('./collections/forEach'),
  'forEachRight': require('./collections/forEachRight'),
  'groupBy': require('./collections/groupBy'),
  'include': require('./collections/contains'),
  'indexBy': require('./collections/indexBy'),
  'inject': require('./collections/reduce'),
  'invoke': require('./collections/invoke'),
  'map': require('./collections/map'),
  'max': require('./collections/max'),
  'min': require('./collections/min'),
  'pluck': require('./collections/pluck'),
  'reduce': require('./collections/reduce'),
  'reduceRight': require('./collections/reduceRight'),
  'reject': require('./collections/reject'),
  'sample': require('./collections/sample'),
  'select': require('./collections/filter'),
  'shuffle': require('./collections/shuffle'),
  'size': require('./collections/size'),
  'some': require('./collections/some'),
  'sortBy': require('./collections/sortBy'),
  'toArray': require('./collections/toArray'),
  'where': require('./collections/where')
};

},{"./collections/at":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/at.js","./collections/contains":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/contains.js","./collections/countBy":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/countBy.js","./collections/every":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/every.js","./collections/filter":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/filter.js","./collections/find":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/find.js","./collections/findLast":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/findLast.js","./collections/forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js","./collections/forEachRight":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEachRight.js","./collections/groupBy":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/groupBy.js","./collections/indexBy":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/indexBy.js","./collections/invoke":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/invoke.js","./collections/map":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/map.js","./collections/max":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/max.js","./collections/min":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/min.js","./collections/pluck":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/pluck.js","./collections/reduce":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/reduce.js","./collections/reduceRight":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/reduceRight.js","./collections/reject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/reject.js","./collections/sample":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/sample.js","./collections/shuffle":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/shuffle.js","./collections/size":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/size.js","./collections/some":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/some.js","./collections/sortBy":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/sortBy.js","./collections/toArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/toArray.js","./collections/where":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/where.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/at.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = require('../internals/baseFlatten'),
    isString = require('../objects/isString');

/**
 * Creates an array of elements from the specified indexes, or keys, of the
 * `collection`. Indexes may be specified as individual arguments or as arrays
 * of indexes.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
 *   to retrieve, specified as individual indexes or arrays of indexes.
 * @returns {Array} Returns a new array of elements corresponding to the
 *  provided indexes.
 * @example
 *
 * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
 * // => ['a', 'c', 'e']
 *
 * _.at(['fred', 'barney', 'pebbles'], 0, 2);
 * // => ['fred', 'pebbles']
 */
function at(collection) {
  var args = arguments,
      index = -1,
      props = baseFlatten(args, true, false, 1),
      length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
      result = Array(length);

  while(++index < length) {
    result[index] = collection[props[index]];
  }
  return result;
}

module.exports = at;

},{"../internals/baseFlatten":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseFlatten.js","../objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/contains.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('../internals/baseIndexOf'),
    forOwn = require('../objects/forOwn'),
    isArray = require('../objects/isArray'),
    isString = require('../objects/isString');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Checks if a given value is present in a collection using strict equality
 * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
 * offset from the end of the collection.
 *
 * @static
 * @memberOf _
 * @alias include
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {*} target The value to check for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
 * @example
 *
 * _.contains([1, 2, 3], 1);
 * // => true
 *
 * _.contains([1, 2, 3], 1, 2);
 * // => false
 *
 * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
 * // => true
 *
 * _.contains('pebbles', 'eb');
 * // => true
 */
function contains(collection, target, fromIndex) {
  var index = -1,
      indexOf = baseIndexOf,
      length = collection ? collection.length : 0,
      result = false;

  fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
  if (isArray(collection)) {
    result = indexOf(collection, target, fromIndex) > -1;
  } else if (typeof length == 'number') {
    result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
  } else {
    forOwn(collection, function(value) {
      if (++index >= fromIndex) {
        return !(result = value === target);
      }
    });
  }
  return result;
}

module.exports = contains;

},{"../internals/baseIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIndexOf.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","../objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/countBy.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = require('../internals/createAggregator');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` through the callback. The corresponding value
 * of each key is the number of times the key was returned by the callback.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
 * // => { '4': 1, '6': 2 }
 *
 * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
 * // => { '4': 1, '6': 2 }
 *
 * _.countBy(['one', 'two', 'three'], 'length');
 * // => { '3': 2, '5': 1 }
 */
var countBy = createAggregator(function(result, value, key) {
  (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
});

module.exports = countBy;

},{"../internals/createAggregator":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createAggregator.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/every.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn');

/**
 * Checks if the given callback returns truey value for **all** elements of
 * a collection. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias all
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if all elements passed the callback check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes']);
 * // => false
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.every(characters, 'age');
 * // => true
 *
 * // using "_.where" callback shorthand
 * _.every(characters, { 'age': 36 });
 * // => false
 */
function every(collection, callback, thisArg) {
  var result = true;
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      if (!(result = !!callback(collection[index], index, collection))) {
        break;
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      return (result = !!callback(value, index, collection));
    });
  }
  return result;
}

module.exports = every;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/filter.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn');

/**
 * Iterates over elements of a collection, returning an array of all elements
 * the callback returns truey for. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias select
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of elements that passed the callback check.
 * @example
 *
 * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
 * // => [2, 4, 6]
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.filter(characters, 'blocked');
 * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
 *
 * // using "_.where" callback shorthand
 * _.filter(characters, { 'age': 36 });
 * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
 */
function filter(collection, callback, thisArg) {
  var result = [];
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      var value = collection[index];
      if (callback(value, index, collection)) {
        result.push(value);
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      if (callback(value, index, collection)) {
        result.push(value);
      }
    });
  }
  return result;
}

module.exports = filter;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/find.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn');

/**
 * Iterates over elements of a collection, returning the first element that
 * the callback returns truey for. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect, findWhere
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the found element, else `undefined`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': false },
 *   { 'name': 'fred',    'age': 40, 'blocked': true },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
 * ];
 *
 * _.find(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => { 'name': 'barney', 'age': 36, 'blocked': false }
 *
 * // using "_.where" callback shorthand
 * _.find(characters, { 'age': 1 });
 * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
 *
 * // using "_.pluck" callback shorthand
 * _.find(characters, 'blocked');
 * // => { 'name': 'fred', 'age': 40, 'blocked': true }
 */
function find(collection, callback, thisArg) {
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      var value = collection[index];
      if (callback(value, index, collection)) {
        return value;
      }
    }
  } else {
    var result;
    forOwn(collection, function(value, index, collection) {
      if (callback(value, index, collection)) {
        result = value;
        return false;
      }
    });
    return result;
  }
}

module.exports = find;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/findLast.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forEachRight = require('./forEachRight');

/**
 * This method is like `_.find` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the found element, else `undefined`.
 * @example
 *
 * _.findLast([1, 2, 3, 4], function(num) {
 *   return num % 2 == 1;
 * });
 * // => 3
 */
function findLast(collection, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forEachRight(collection, function(value, index, collection) {
    if (callback(value, index, collection)) {
      result = value;
      return false;
    }
  });
  return result;
}

module.exports = findLast;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","./forEachRight":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEachRight.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    forOwn = require('../objects/forOwn');

/**
 * Iterates over elements of a collection, executing the callback for each
 * element. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * Note: As with other "Collections" methods, objects with a `length` property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
 * // => logs each number and returns '1,2,3'
 *
 * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
 * // => logs each number and returns the object (property order is not guaranteed across environments)
 */
function forEach(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    while (++index < length) {
      if (callback(collection[index], index, collection) === false) {
        break;
      }
    }
  } else {
    forOwn(collection, callback);
  }
  return collection;
}

module.exports = forEach;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEachRight.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    forOwn = require('../objects/forOwn'),
    isArray = require('../objects/isArray'),
    isString = require('../objects/isString'),
    keys = require('../objects/keys');

/**
 * This method is like `_.forEach` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @alias eachRight
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
 * // => logs each number from right to left and returns '3,2,1'
 */
function forEachRight(collection, callback, thisArg) {
  var length = collection ? collection.length : 0;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    while (length--) {
      if (callback(collection[length], length, collection) === false) {
        break;
      }
    }
  } else {
    var props = keys(collection);
    length = props.length;
    forOwn(collection, function(value, key, collection) {
      key = props ? props[--length] : --length;
      return callback(collection[key], key, collection);
    });
  }
  return collection;
}

module.exports = forEachRight;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","../objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js","../objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/groupBy.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = require('../internals/createAggregator');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of a collection through the callback. The corresponding value
 * of each key is an array of the elements responsible for generating the key.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
 * // => { '4': [4.2], '6': [6.1, 6.4] }
 *
 * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
 * // => { '4': [4.2], '6': [6.1, 6.4] }
 *
 * // using "_.pluck" callback shorthand
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function(result, value, key) {
  (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
});

module.exports = groupBy;

},{"../internals/createAggregator":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createAggregator.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/indexBy.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = require('../internals/createAggregator');

/**
 * Creates an object composed of keys generated from the results of running
 * each element of the collection through the given callback. The corresponding
 * value of each key is the last element responsible for generating the key.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * var keys = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * _.indexBy(keys, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 *
 * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 *
 * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 */
var indexBy = createAggregator(function(result, value, key) {
  result[key] = value;
});

module.exports = indexBy;

},{"../internals/createAggregator":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createAggregator.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/invoke.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = require('./forEach'),
    slice = require('../internals/slice');

/**
 * Invokes the method named by `methodName` on each element in the `collection`
 * returning an array of the results of each invoked method. Additional arguments
 * will be provided to each invoked method. If `methodName` is a function it
 * will be invoked for, and `this` bound to, each element in the `collection`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|string} methodName The name of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [arg] Arguments to invoke the method with.
 * @returns {Array} Returns a new array of the results of each invoked method.
 * @example
 *
 * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invoke([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
function invoke(collection, methodName) {
  var args = slice(arguments, 2),
      index = -1,
      isFunc = typeof methodName == 'function',
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  forEach(collection, function(value) {
    result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
  });
  return result;
}

module.exports = invoke;

},{"../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js","./forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/map.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn');

/**
 * Creates an array of values by running each element in the collection
 * through the callback. The callback is bound to `thisArg` and invoked with
 * three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of the results of each `callback` execution.
 * @example
 *
 * _.map([1, 2, 3], function(num) { return num * 3; });
 * // => [3, 6, 9]
 *
 * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
 * // => [3, 6, 9] (property order is not guaranteed across environments)
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.map(characters, 'name');
 * // => ['barney', 'fred']
 */
function map(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = createCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    var result = Array(length);
    while (++index < length) {
      result[index] = callback(collection[index], index, collection);
    }
  } else {
    result = [];
    forOwn(collection, function(value, key, collection) {
      result[++index] = callback(value, key, collection);
    });
  }
  return result;
}

module.exports = map;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/max.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var charAtCallback = require('../internals/charAtCallback'),
    createCallback = require('../functions/createCallback'),
    forEach = require('./forEach'),
    forOwn = require('../objects/forOwn'),
    isArray = require('../objects/isArray'),
    isString = require('../objects/isString');

/**
 * Retrieves the maximum value of a collection. If the collection is empty or
 * falsey `-Infinity` is returned. If a callback is provided it will be executed
 * for each value in the collection to generate the criterion by which the value
 * is ranked. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.max(characters, function(chr) { return chr.age; });
 * // => { 'name': 'fred', 'age': 40 };
 *
 * // using "_.pluck" callback shorthand
 * _.max(characters, 'age');
 * // => { 'name': 'fred', 'age': 40 };
 */
function max(collection, callback, thisArg) {
  var computed = -Infinity,
      result = computed;

  // allows working with functions like `_.map` without using
  // their `index` argument as a callback
  if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
    callback = null;
  }
  if (callback == null && isArray(collection)) {
    var index = -1,
        length = collection.length;

    while (++index < length) {
      var value = collection[index];
      if (value > result) {
        result = value;
      }
    }
  } else {
    callback = (callback == null && isString(collection))
      ? charAtCallback
      : createCallback(callback, thisArg, 3);

    forEach(collection, function(value, index, collection) {
      var current = callback(value, index, collection);
      if (current > computed) {
        computed = current;
        result = value;
      }
    });
  }
  return result;
}

module.exports = max;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/charAtCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/charAtCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","../objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js","./forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/min.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var charAtCallback = require('../internals/charAtCallback'),
    createCallback = require('../functions/createCallback'),
    forEach = require('./forEach'),
    forOwn = require('../objects/forOwn'),
    isArray = require('../objects/isArray'),
    isString = require('../objects/isString');

/**
 * Retrieves the minimum value of a collection. If the collection is empty or
 * falsey `Infinity` is returned. If a callback is provided it will be executed
 * for each value in the collection to generate the criterion by which the value
 * is ranked. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.min(characters, function(chr) { return chr.age; });
 * // => { 'name': 'barney', 'age': 36 };
 *
 * // using "_.pluck" callback shorthand
 * _.min(characters, 'age');
 * // => { 'name': 'barney', 'age': 36 };
 */
function min(collection, callback, thisArg) {
  var computed = Infinity,
      result = computed;

  // allows working with functions like `_.map` without using
  // their `index` argument as a callback
  if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
    callback = null;
  }
  if (callback == null && isArray(collection)) {
    var index = -1,
        length = collection.length;

    while (++index < length) {
      var value = collection[index];
      if (value < result) {
        result = value;
      }
    }
  } else {
    callback = (callback == null && isString(collection))
      ? charAtCallback
      : createCallback(callback, thisArg, 3);

    forEach(collection, function(value, index, collection) {
      var current = callback(value, index, collection);
      if (current < computed) {
        computed = current;
        result = value;
      }
    });
  }
  return result;
}

module.exports = min;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/charAtCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/charAtCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","../objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js","./forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/pluck.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var map = require('./map');

/**
 * Retrieves the value of a specified property from all elements in the collection.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {string} property The name of the property to pluck.
 * @returns {Array} Returns a new array of property values.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.pluck(characters, 'name');
 * // => ['barney', 'fred']
 */
var pluck = map;

module.exports = pluck;

},{"./map":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/map.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/reduce.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn');

/**
 * Reduces a collection to a value which is the accumulated result of running
 * each element in the collection through the callback, where each successive
 * callback execution consumes the return value of the previous execution. If
 * `accumulator` is not provided the first element of the collection will be
 * used as the initial `accumulator` value. The callback is bound to `thisArg`
 * and invoked with four arguments; (accumulator, value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @alias foldl, inject
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] Initial value of the accumulator.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var sum = _.reduce([1, 2, 3], function(sum, num) {
 *   return sum + num;
 * });
 * // => 6
 *
 * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
 *   result[key] = num * 3;
 *   return result;
 * }, {});
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 */
function reduce(collection, callback, accumulator, thisArg) {
  if (!collection) return accumulator;
  var noaccum = arguments.length < 3;
  callback = createCallback(callback, thisArg, 4);

  var index = -1,
      length = collection.length;

  if (typeof length == 'number') {
    if (noaccum) {
      accumulator = collection[++index];
    }
    while (++index < length) {
      accumulator = callback(accumulator, collection[index], index, collection);
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      accumulator = noaccum
        ? (noaccum = false, value)
        : callback(accumulator, value, index, collection)
    });
  }
  return accumulator;
}

module.exports = reduce;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/reduceRight.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forEachRight = require('./forEachRight');

/**
 * This method is like `_.reduce` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @alias foldr
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] Initial value of the accumulator.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var list = [[0, 1], [2, 3], [4, 5]];
 * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
 * // => [4, 5, 2, 3, 0, 1]
 */
function reduceRight(collection, callback, accumulator, thisArg) {
  var noaccum = arguments.length < 3;
  callback = createCallback(callback, thisArg, 4);
  forEachRight(collection, function(value, index, collection) {
    accumulator = noaccum
      ? (noaccum = false, value)
      : callback(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = reduceRight;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","./forEachRight":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEachRight.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/reject.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    filter = require('./filter');

/**
 * The opposite of `_.filter` this method returns the elements of a
 * collection that the callback does **not** return truey for.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of elements that failed the callback check.
 * @example
 *
 * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
 * // => [1, 3, 5]
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.reject(characters, 'blocked');
 * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
 *
 * // using "_.where" callback shorthand
 * _.reject(characters, { 'age': 36 });
 * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
 */
function reject(collection, callback, thisArg) {
  callback = createCallback(callback, thisArg, 3);
  return filter(collection, function(value, index, collection) {
    return !callback(value, index, collection);
  });
}

module.exports = reject;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","./filter":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/filter.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/sample.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = require('../internals/baseRandom'),
    isString = require('../objects/isString'),
    shuffle = require('./shuffle'),
    values = require('../objects/values');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Retrieves a random element or `n` random elements from a collection.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to sample.
 * @param {number} [n] The number of elements to sample.
 * @param- {Object} [guard] Allows working with functions like `_.map`
 *  without using their `index` arguments as `n`.
 * @returns {Array} Returns the random sample(s) of `collection`.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 *
 * _.sample([1, 2, 3, 4], 2);
 * // => [3, 1]
 */
function sample(collection, n, guard) {
  if (collection && typeof collection.length != 'number') {
    collection = values(collection);
  }
  if (n == null || guard) {
    return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
  }
  var result = shuffle(collection);
  result.length = nativeMin(nativeMax(0, n), result.length);
  return result;
}

module.exports = sample;

},{"../internals/baseRandom":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseRandom.js","../objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js","../objects/values":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/values.js","./shuffle":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/shuffle.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/shuffle.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = require('../internals/baseRandom'),
    forEach = require('./forEach');

/**
 * Creates an array of shuffled values, using a version of the Fisher-Yates
 * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to shuffle.
 * @returns {Array} Returns a new shuffled collection.
 * @example
 *
 * _.shuffle([1, 2, 3, 4, 5, 6]);
 * // => [4, 1, 6, 3, 5, 2]
 */
function shuffle(collection) {
  var index = -1,
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  forEach(collection, function(value) {
    var rand = baseRandom(0, ++index);
    result[index] = result[rand];
    result[rand] = value;
  });
  return result;
}

module.exports = shuffle;

},{"../internals/baseRandom":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseRandom.js","./forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/size.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = require('../objects/keys');

/**
 * Gets the size of the `collection` by returning `collection.length` for arrays
 * and array-like objects or the number of own enumerable properties for objects.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns `collection.length` or number of own enumerable properties.
 * @example
 *
 * _.size([1, 2]);
 * // => 2
 *
 * _.size({ 'one': 1, 'two': 2, 'three': 3 });
 * // => 3
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  var length = collection ? collection.length : 0;
  return typeof length == 'number' ? length : keys(collection).length;
}

module.exports = size;

},{"../objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/some.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn'),
    isArray = require('../objects/isArray');

/**
 * Checks if the callback returns a truey value for **any** element of a
 * collection. The function returns as soon as it finds a passing value and
 * does not iterate over the entire collection. The callback is bound to
 * `thisArg` and invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias any
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if any element passed the callback check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.some(characters, 'blocked');
 * // => true
 *
 * // using "_.where" callback shorthand
 * _.some(characters, { 'age': 1 });
 * // => false
 */
function some(collection, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      if ((result = callback(collection[index], index, collection))) {
        break;
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      return !(result = callback(value, index, collection));
    });
  }
  return !!result;
}

module.exports = some;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/sortBy.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var compareAscending = require('../internals/compareAscending'),
    createCallback = require('../functions/createCallback'),
    forEach = require('./forEach'),
    getArray = require('../internals/getArray'),
    getObject = require('../internals/getObject'),
    isArray = require('../objects/isArray'),
    map = require('./map'),
    releaseArray = require('../internals/releaseArray'),
    releaseObject = require('../internals/releaseObject');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection through the callback. This method
 * performs a stable sort, that is, it will preserve the original sort order
 * of equal elements. The callback is bound to `thisArg` and invoked with
 * three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an array of property names is provided for `callback` the collection
 * will be sorted by each property value.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of sorted elements.
 * @example
 *
 * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
 * // => [3, 1, 2]
 *
 * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
 * // => [3, 1, 2]
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36 },
 *   { 'name': 'fred',    'age': 40 },
 *   { 'name': 'barney',  'age': 26 },
 *   { 'name': 'fred',    'age': 30 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.map(_.sortBy(characters, 'age'), _.values);
 * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
 *
 * // sorting by multiple properties
 * _.map(_.sortBy(characters, ['name', 'age']), _.values);
 * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
 */
function sortBy(collection, callback, thisArg) {
  var index = -1,
      isArr = isArray(callback),
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  if (!isArr) {
    callback = createCallback(callback, thisArg, 3);
  }
  forEach(collection, function(value, key, collection) {
    var object = result[++index] = getObject();
    if (isArr) {
      object.criteria = map(callback, function(key) { return value[key]; });
    } else {
      (object.criteria = getArray())[0] = callback(value, key, collection);
    }
    object.index = index;
    object.value = value;
  });

  length = result.length;
  result.sort(compareAscending);
  while (length--) {
    var object = result[length];
    result[length] = object.value;
    if (!isArr) {
      releaseArray(object.criteria);
    }
    releaseObject(object);
  }
  return result;
}

module.exports = sortBy;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/compareAscending":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/compareAscending.js","../internals/getArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getArray.js","../internals/getObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getObject.js","../internals/releaseArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseArray.js","../internals/releaseObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseObject.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","./forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js","./map":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/map.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/toArray.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isString = require('../objects/isString'),
    slice = require('../internals/slice'),
    values = require('../objects/values');

/**
 * Converts the `collection` to an array.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to convert.
 * @returns {Array} Returns the new converted array.
 * @example
 *
 * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
 * // => [2, 3, 4]
 */
function toArray(collection) {
  if (collection && typeof collection.length == 'number') {
    return slice(collection);
  }
  return values(collection);
}

module.exports = toArray;

},{"../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js","../objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js","../objects/values":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/values.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/where.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var filter = require('./filter');

/**
 * Performs a deep comparison of each element in a `collection` to the given
 * `properties` object, returning an array of all elements that have equivalent
 * property values.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Object} props The object of property values to filter by.
 * @returns {Array} Returns a new array of elements that have the given properties.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
 * ];
 *
 * _.where(characters, { 'age': 36 });
 * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
 *
 * _.where(characters, { 'pets': ['dino'] });
 * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
 */
var where = filter;

module.exports = where;

},{"./filter":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/filter.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'after': require('./functions/after'),
  'bind': require('./functions/bind'),
  'bindAll': require('./functions/bindAll'),
  'bindKey': require('./functions/bindKey'),
  'compose': require('./functions/compose'),
  'createCallback': require('./functions/createCallback'),
  'curry': require('./functions/curry'),
  'debounce': require('./functions/debounce'),
  'defer': require('./functions/defer'),
  'delay': require('./functions/delay'),
  'memoize': require('./functions/memoize'),
  'once': require('./functions/once'),
  'partial': require('./functions/partial'),
  'partialRight': require('./functions/partialRight'),
  'throttle': require('./functions/throttle'),
  'wrap': require('./functions/wrap')
};

},{"./functions/after":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/after.js","./functions/bind":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/bind.js","./functions/bindAll":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/bindAll.js","./functions/bindKey":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/bindKey.js","./functions/compose":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/compose.js","./functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","./functions/curry":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/curry.js","./functions/debounce":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/debounce.js","./functions/defer":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/defer.js","./functions/delay":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/delay.js","./functions/memoize":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/memoize.js","./functions/once":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/once.js","./functions/partial":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/partial.js","./functions/partialRight":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/partialRight.js","./functions/throttle":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/throttle.js","./functions/wrap":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/wrap.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/after.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('../objects/isFunction');

/**
 * Creates a function that executes `func`, with  the `this` binding and
 * arguments of the created function, only after being called `n` times.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {number} n The number of times the function must be called before
 *  `func` is executed.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var saves = ['profile', 'settings'];
 *
 * var done = _.after(saves.length, function() {
 *   console.log('Done saving!');
 * });
 *
 * _.forEach(saves, function(type) {
 *   asyncSave({ 'type': type, 'complete': done });
 * });
 * // => logs 'Done saving!', after all saves have completed
 */
function after(n, func) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
}

module.exports = after;

},{"../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/bind.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('../internals/createWrapper'),
    slice = require('../internals/slice');

/**
 * Creates a function that, when called, invokes `func` with the `this`
 * binding of `thisArg` and prepends any additional `bind` arguments to those
 * provided to the bound function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var func = function(greeting) {
 *   return greeting + ' ' + this.name;
 * };
 *
 * func = _.bind(func, { 'name': 'fred' }, 'hi');
 * func();
 * // => 'hi fred'
 */
function bind(func, thisArg) {
  return arguments.length > 2
    ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
    : createWrapper(func, 1, null, null, thisArg);
}

module.exports = bind;

},{"../internals/createWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createWrapper.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/bindAll.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = require('../internals/baseFlatten'),
    createWrapper = require('../internals/createWrapper'),
    functions = require('../objects/functions');

/**
 * Binds methods of an object to the object itself, overwriting the existing
 * method. Method names may be specified as individual arguments or as arrays
 * of method names. If no method names are provided all the function properties
 * of `object` will be bound.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Object} object The object to bind and assign the bound methods to.
 * @param {...string} [methodName] The object method names to
 *  bind, specified as individual method names or arrays of method names.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var view = {
 *   'label': 'docs',
 *   'onClick': function() { console.log('clicked ' + this.label); }
 * };
 *
 * _.bindAll(view);
 * jQuery('#docs').on('click', view.onClick);
 * // => logs 'clicked docs', when the button is clicked
 */
function bindAll(object) {
  var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
      index = -1,
      length = funcs.length;

  while (++index < length) {
    var key = funcs[index];
    object[key] = createWrapper(object[key], 1, null, null, object);
  }
  return object;
}

module.exports = bindAll;

},{"../internals/baseFlatten":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseFlatten.js","../internals/createWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createWrapper.js","../objects/functions":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/functions.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/bindKey.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('../internals/createWrapper'),
    slice = require('../internals/slice');

/**
 * Creates a function that, when called, invokes the method at `object[key]`
 * and prepends any additional `bindKey` arguments to those provided to the bound
 * function. This method differs from `_.bind` by allowing bound functions to
 * reference methods that will be redefined or don't yet exist.
 * See http://michaux.ca/articles/lazy-function-definition-pattern.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Object} object The object the method belongs to.
 * @param {string} key The key of the method.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var object = {
 *   'name': 'fred',
 *   'greet': function(greeting) {
 *     return greeting + ' ' + this.name;
 *   }
 * };
 *
 * var func = _.bindKey(object, 'greet', 'hi');
 * func();
 * // => 'hi fred'
 *
 * object.greet = function(greeting) {
 *   return greeting + 'ya ' + this.name + '!';
 * };
 *
 * func();
 * // => 'hiya fred!'
 */
function bindKey(object, key) {
  return arguments.length > 2
    ? createWrapper(key, 19, slice(arguments, 2), null, object)
    : createWrapper(key, 3, null, null, object);
}

module.exports = bindKey;

},{"../internals/createWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createWrapper.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/compose.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('../objects/isFunction');

/**
 * Creates a function that is the composition of the provided functions,
 * where each function consumes the return value of the function that follows.
 * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
 * Each function is executed with the `this` binding of the composed function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {...Function} [func] Functions to compose.
 * @returns {Function} Returns the new composed function.
 * @example
 *
 * var realNameMap = {
 *   'pebbles': 'penelope'
 * };
 *
 * var format = function(name) {
 *   name = realNameMap[name.toLowerCase()] || name;
 *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
 * };
 *
 * var greet = function(formatted) {
 *   return 'Hiya ' + formatted + '!';
 * };
 *
 * var welcome = _.compose(greet, format);
 * welcome('pebbles');
 * // => 'Hiya Penelope!'
 */
function compose() {
  var funcs = arguments,
      length = funcs.length;

  while (length--) {
    if (!isFunction(funcs[length])) {
      throw new TypeError;
    }
  }
  return function() {
    var args = arguments,
        length = funcs.length;

    while (length--) {
      args = [funcs[length].apply(this, args)];
    }
    return args[0];
  };
}

module.exports = compose;

},{"../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    baseIsEqual = require('../internals/baseIsEqual'),
    isObject = require('../objects/isObject'),
    keys = require('../objects/keys'),
    property = require('../utilities/property');

/**
 * Produces a callback bound to an optional `thisArg`. If `func` is a property
 * name the created callback will return the property value for a given element.
 * If `func` is an object the created callback will return `true` for elements
 * that contain the equivalent object properties, otherwise it will return `false`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // wrap to create custom callback shorthands
 * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
 *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
 *   return !match ? func(callback, thisArg) : function(object) {
 *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
 *   };
 * });
 *
 * _.filter(characters, 'age__gt38');
 * // => [{ 'name': 'fred', 'age': 40 }]
 */
function createCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (func == null || type == 'function') {
    return baseCreateCallback(func, thisArg, argCount);
  }
  // handle "_.pluck" style callback shorthands
  if (type != 'object') {
    return property(func);
  }
  var props = keys(func),
      key = props[0],
      a = func[key];

  // handle "_.where" style callback shorthands
  if (props.length == 1 && a === a && !isObject(a)) {
    // fast path the common case of providing an object with a single
    // property containing a primitive value
    return function(object) {
      var b = object[key];
      return a === b && (a !== 0 || (1 / a == 1 / b));
    };
  }
  return function(object) {
    var length = props.length,
        result = false;

    while (length--) {
      if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
        break;
      }
    }
    return result;
  };
}

module.exports = createCallback;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","../internals/baseIsEqual":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIsEqual.js","../objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js","../objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js","../utilities/property":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/property.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/curry.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('../internals/createWrapper');

/**
 * Creates a function which accepts one or more arguments of `func` that when
 * invoked either executes `func` returning its result, if all `func` arguments
 * have been provided, or returns a function that accepts one or more of the
 * remaining `func` arguments, and so on. The arity of `func` can be specified
 * if `func.length` is not sufficient.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var curried = _.curry(function(a, b, c) {
 *   console.log(a + b + c);
 * });
 *
 * curried(1)(2)(3);
 * // => 6
 *
 * curried(1, 2)(3);
 * // => 6
 *
 * curried(1, 2, 3);
 * // => 6
 */
function curry(func, arity) {
  arity = typeof arity == 'number' ? arity : (+arity || func.length);
  return createWrapper(func, 4, null, null, null, arity);
}

module.exports = curry;

},{"../internals/createWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createWrapper.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/debounce.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('../objects/isFunction'),
    isObject = require('../objects/isObject'),
    now = require('../utilities/now');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Creates a function that will delay the execution of `func` until after
 * `wait` milliseconds have elapsed since the last time it was invoked.
 * Provide an options object to indicate that `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
 * to the debounced function will return the result of the last `func` call.
 *
 * Note: If `leading` and `trailing` options are `true` `func` will be called
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * var lazyLayout = _.debounce(calculateLayout, 150);
 * jQuery(window).on('resize', lazyLayout);
 *
 * // execute `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * });
 *
 * // ensure `batchLog` is executed once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * source.addEventListener('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }, false);
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  wait = nativeMax(0, wait) || 0;
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = options.leading;
    maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
    trailing = 'trailing' in options ? options.trailing : trailing;
  }
  var delayed = function() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0) {
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
      }
      var isCalled = trailingCall;
      maxTimeoutId = timeoutId = trailingCall = undefined;
      if (isCalled) {
        lastCalled = now();
        result = func.apply(thisArg, args);
        if (!timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
      }
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  };

  var maxDelayed = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (trailing || (maxWait !== wait)) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = null;
      }
    }
  };

  return function() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = null;
    }
    return result;
  };
}

module.exports = debounce;

},{"../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js","../objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js","../utilities/now":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/now.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/defer.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('../objects/isFunction'),
    slice = require('../internals/slice');

/**
 * Defers executing the `func` function until the current call stack has cleared.
 * Additional arguments will be provided to `func` when it is invoked.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to defer.
 * @param {...*} [arg] Arguments to invoke the function with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.defer(function(text) { console.log(text); }, 'deferred');
 * // logs 'deferred' after one or more milliseconds
 */
function defer(func) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var args = slice(arguments, 1);
  return setTimeout(function() { func.apply(undefined, args); }, 1);
}

module.exports = defer;

},{"../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js","../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/delay.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('../objects/isFunction'),
    slice = require('../internals/slice');

/**
 * Executes the `func` function after `wait` milliseconds. Additional arguments
 * will be provided to `func` when it is invoked.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay execution.
 * @param {...*} [arg] Arguments to invoke the function with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.delay(function(text) { console.log(text); }, 1000, 'later');
 * // => logs 'later' after one second
 */
function delay(func, wait) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var args = slice(arguments, 2);
  return setTimeout(function() { func.apply(undefined, args); }, wait);
}

module.exports = delay;

},{"../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js","../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/memoize.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('../objects/isFunction'),
    keyPrefix = require('../internals/keyPrefix');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided it will be used to determine the cache key for storing the result
 * based on the arguments provided to the memoized function. By default, the
 * first argument provided to the memoized function is used as the cache key.
 * The `func` is executed with the `this` binding of the memoized function.
 * The result cache is exposed as the `cache` property on the memoized function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] A function used to resolve the cache key.
 * @returns {Function} Returns the new memoizing function.
 * @example
 *
 * var fibonacci = _.memoize(function(n) {
 *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 * });
 *
 * fibonacci(9)
 * // => 34
 *
 * var data = {
 *   'fred': { 'name': 'fred', 'age': 40 },
 *   'pebbles': { 'name': 'pebbles', 'age': 1 }
 * };
 *
 * // modifying the result cache
 * var get = _.memoize(function(name) { return data[name]; }, _.identity);
 * get('pebbles');
 * // => { 'name': 'pebbles', 'age': 1 }
 *
 * get.cache.pebbles.name = 'penelope';
 * get('pebbles');
 * // => { 'name': 'penelope', 'age': 1 }
 */
function memoize(func, resolver) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var memoized = function() {
    var cache = memoized.cache,
        key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

    return hasOwnProperty.call(cache, key)
      ? cache[key]
      : (cache[key] = func.apply(this, arguments));
  }
  memoized.cache = {};
  return memoized;
}

module.exports = memoize;

},{"../internals/keyPrefix":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/keyPrefix.js","../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/once.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('../objects/isFunction');

/**
 * Creates a function that is restricted to execute `func` once. Repeat calls to
 * the function will return the value of the first call. The `func` is executed
 * with the `this` binding of the created function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // `initialize` executes `createApplication` once
 */
function once(func) {
  var ran,
      result;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  return function() {
    if (ran) {
      return result;
    }
    ran = true;
    result = func.apply(this, arguments);

    // clear the `func` variable so the function may be garbage collected
    func = null;
    return result;
  };
}

module.exports = once;

},{"../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/partial.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('../internals/createWrapper'),
    slice = require('../internals/slice');

/**
 * Creates a function that, when called, invokes `func` with any additional
 * `partial` arguments prepended to those provided to the new function. This
 * method is similar to `_.bind` except it does **not** alter the `this` binding.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * var greet = function(greeting, name) { return greeting + ' ' + name; };
 * var hi = _.partial(greet, 'hi');
 * hi('fred');
 * // => 'hi fred'
 */
function partial(func) {
  return createWrapper(func, 16, slice(arguments, 1));
}

module.exports = partial;

},{"../internals/createWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createWrapper.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/partialRight.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('../internals/createWrapper'),
    slice = require('../internals/slice');

/**
 * This method is like `_.partial` except that `partial` arguments are
 * appended to those provided to the new function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * var defaultsDeep = _.partialRight(_.merge, _.defaults);
 *
 * var options = {
 *   'variable': 'data',
 *   'imports': { 'jq': $ }
 * };
 *
 * defaultsDeep(options, _.templateSettings);
 *
 * options.variable
 * // => 'data'
 *
 * options.imports
 * // => { '_': _, 'jq': $ }
 */
function partialRight(func) {
  return createWrapper(func, 32, null, slice(arguments, 1));
}

module.exports = partialRight;

},{"../internals/createWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createWrapper.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/throttle.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var debounce = require('./debounce'),
    isFunction = require('../objects/isFunction'),
    isObject = require('../objects/isObject');

/** Used as an internal `_.debounce` options object */
var debounceOptions = {
  'leading': false,
  'maxWait': 0,
  'trailing': false
};

/**
 * Creates a function that, when executed, will only call the `func` function
 * at most once per every `wait` milliseconds. Provide an options object to
 * indicate that `func` should be invoked on the leading and/or trailing edge
 * of the `wait` timeout. Subsequent calls to the throttled function will
 * return the result of the last `func` call.
 *
 * Note: If `leading` and `trailing` options are `true` `func` will be called
 * on the trailing edge of the timeout only if the the throttled function is
 * invoked more than once during the `wait` timeout.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to throttle.
 * @param {number} wait The number of milliseconds to throttle executions to.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // avoid excessively updating the position while scrolling
 * var throttled = _.throttle(updatePosition, 100);
 * jQuery(window).on('scroll', throttled);
 *
 * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
 * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
 *   'trailing': false
 * }));
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  if (options === false) {
    leading = false;
  } else if (isObject(options)) {
    leading = 'leading' in options ? options.leading : leading;
    trailing = 'trailing' in options ? options.trailing : trailing;
  }
  debounceOptions.leading = leading;
  debounceOptions.maxWait = wait;
  debounceOptions.trailing = trailing;

  return debounce(func, wait, debounceOptions);
}

module.exports = throttle;

},{"../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js","../objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js","./debounce":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/debounce.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/wrap.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('../internals/createWrapper');

/**
 * Creates a function that provides `value` to the wrapper function as its
 * first argument. Additional arguments provided to the function are appended
 * to those provided to the wrapper function. The wrapper is executed with
 * the `this` binding of the created function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {*} value The value to wrap.
 * @param {Function} wrapper The wrapper function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var p = _.wrap(_.escape, function(func, text) {
 *   return '<p>' + func(text) + '</p>';
 * });
 *
 * p('Fred, Wilma, & Pebbles');
 * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
 */
function wrap(value, wrapper) {
  return createWrapper(wrapper, 16, [value]);
}

module.exports = wrap;

},{"../internals/createWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createWrapper.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/index.js":[function(require,module,exports){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrays = require('./arrays'),
    chaining = require('./chaining'),
    collections = require('./collections'),
    functions = require('./functions'),
    objects = require('./objects'),
    utilities = require('./utilities'),
    forEach = require('./collections/forEach'),
    forOwn = require('./objects/forOwn'),
    isArray = require('./objects/isArray'),
    lodashWrapper = require('./internals/lodashWrapper'),
    mixin = require('./utilities/mixin'),
    support = require('./support'),
    templateSettings = require('./utilities/templateSettings');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps the given value to enable intuitive
 * method chaining.
 *
 * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
 * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
 * and `unshift`
 *
 * Chaining is supported in custom builds as long as the `value` method is
 * implicitly or explicitly included in the build.
 *
 * The chainable wrapper functions are:
 * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
 * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
 * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
 * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
 * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
 * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
 * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
 * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
 * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
 * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
 * and `zip`
 *
 * The non-chainable wrapper functions are:
 * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
 * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
 * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
 * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
 * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
 * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
 * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
 * `template`, `unescape`, `uniqueId`, and `value`
 *
 * The wrapper functions `first` and `last` return wrapped values when `n` is
 * provided, otherwise they return unwrapped values.
 *
 * Explicit chaining can be enabled by using the `_.chain` method.
 *
 * @name _
 * @constructor
 * @category Chaining
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns a `lodash` instance.
 * @example
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // returns an unwrapped value
 * wrapped.reduce(function(sum, num) {
 *   return sum + num;
 * });
 * // => 6
 *
 * // returns a wrapped value
 * var squares = wrapped.map(function(num) {
 *   return num * num;
 * });
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
  return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
   ? value
   : new lodashWrapper(value);
}
// ensure `new lodashWrapper` is an instance of `lodash`
lodashWrapper.prototype = lodash.prototype;

// wrap `_.mixin` so it works when provided only one argument
mixin = (function(fn) {
  var functions = objects.functions;
  return function(object, source, options) {
    if (!source || (!options && !functions(source).length)) {
      if (options == null) {
        options = source;
      }
      source = object;
      object = lodash;
    }
    return fn(object, source, options);
  };
}(mixin));

// add functions that return wrapped values when chaining
lodash.after = functions.after;
lodash.assign = objects.assign;
lodash.at = collections.at;
lodash.bind = functions.bind;
lodash.bindAll = functions.bindAll;
lodash.bindKey = functions.bindKey;
lodash.chain = chaining.chain;
lodash.compact = arrays.compact;
lodash.compose = functions.compose;
lodash.constant = utilities.constant;
lodash.countBy = collections.countBy;
lodash.create = objects.create;
lodash.createCallback = functions.createCallback;
lodash.curry = functions.curry;
lodash.debounce = functions.debounce;
lodash.defaults = objects.defaults;
lodash.defer = functions.defer;
lodash.delay = functions.delay;
lodash.difference = arrays.difference;
lodash.filter = collections.filter;
lodash.flatten = arrays.flatten;
lodash.forEach = forEach;
lodash.forEachRight = collections.forEachRight;
lodash.forIn = objects.forIn;
lodash.forInRight = objects.forInRight;
lodash.forOwn = forOwn;
lodash.forOwnRight = objects.forOwnRight;
lodash.functions = objects.functions;
lodash.groupBy = collections.groupBy;
lodash.indexBy = collections.indexBy;
lodash.initial = arrays.initial;
lodash.intersection = arrays.intersection;
lodash.invert = objects.invert;
lodash.invoke = collections.invoke;
lodash.keys = objects.keys;
lodash.map = collections.map;
lodash.mapValues = objects.mapValues;
lodash.max = collections.max;
lodash.memoize = functions.memoize;
lodash.merge = objects.merge;
lodash.min = collections.min;
lodash.omit = objects.omit;
lodash.once = functions.once;
lodash.pairs = objects.pairs;
lodash.partial = functions.partial;
lodash.partialRight = functions.partialRight;
lodash.pick = objects.pick;
lodash.pluck = collections.pluck;
lodash.property = utilities.property;
lodash.pull = arrays.pull;
lodash.range = arrays.range;
lodash.reject = collections.reject;
lodash.remove = arrays.remove;
lodash.rest = arrays.rest;
lodash.shuffle = collections.shuffle;
lodash.sortBy = collections.sortBy;
lodash.tap = chaining.tap;
lodash.throttle = functions.throttle;
lodash.times = utilities.times;
lodash.toArray = collections.toArray;
lodash.transform = objects.transform;
lodash.union = arrays.union;
lodash.uniq = arrays.uniq;
lodash.values = objects.values;
lodash.where = collections.where;
lodash.without = arrays.without;
lodash.wrap = functions.wrap;
lodash.xor = arrays.xor;
lodash.zip = arrays.zip;
lodash.zipObject = arrays.zipObject;

// add aliases
lodash.collect = collections.map;
lodash.drop = arrays.rest;
lodash.each = forEach;
lodash.eachRight = collections.forEachRight;
lodash.extend = objects.assign;
lodash.methods = objects.functions;
lodash.object = arrays.zipObject;
lodash.select = collections.filter;
lodash.tail = arrays.rest;
lodash.unique = arrays.uniq;
lodash.unzip = arrays.zip;

// add functions to `lodash.prototype`
mixin(lodash);

// add functions that return unwrapped values when chaining
lodash.clone = objects.clone;
lodash.cloneDeep = objects.cloneDeep;
lodash.contains = collections.contains;
lodash.escape = utilities.escape;
lodash.every = collections.every;
lodash.find = collections.find;
lodash.findIndex = arrays.findIndex;
lodash.findKey = objects.findKey;
lodash.findLast = collections.findLast;
lodash.findLastIndex = arrays.findLastIndex;
lodash.findLastKey = objects.findLastKey;
lodash.has = objects.has;
lodash.identity = utilities.identity;
lodash.indexOf = arrays.indexOf;
lodash.isArguments = objects.isArguments;
lodash.isArray = isArray;
lodash.isBoolean = objects.isBoolean;
lodash.isDate = objects.isDate;
lodash.isElement = objects.isElement;
lodash.isEmpty = objects.isEmpty;
lodash.isEqual = objects.isEqual;
lodash.isFinite = objects.isFinite;
lodash.isFunction = objects.isFunction;
lodash.isNaN = objects.isNaN;
lodash.isNull = objects.isNull;
lodash.isNumber = objects.isNumber;
lodash.isObject = objects.isObject;
lodash.isPlainObject = objects.isPlainObject;
lodash.isRegExp = objects.isRegExp;
lodash.isString = objects.isString;
lodash.isUndefined = objects.isUndefined;
lodash.lastIndexOf = arrays.lastIndexOf;
lodash.mixin = mixin;
lodash.noConflict = utilities.noConflict;
lodash.noop = utilities.noop;
lodash.now = utilities.now;
lodash.parseInt = utilities.parseInt;
lodash.random = utilities.random;
lodash.reduce = collections.reduce;
lodash.reduceRight = collections.reduceRight;
lodash.result = utilities.result;
lodash.size = collections.size;
lodash.some = collections.some;
lodash.sortedIndex = arrays.sortedIndex;
lodash.template = utilities.template;
lodash.unescape = utilities.unescape;
lodash.uniqueId = utilities.uniqueId;

// add aliases
lodash.all = collections.every;
lodash.any = collections.some;
lodash.detect = collections.find;
lodash.findWhere = collections.find;
lodash.foldl = collections.reduce;
lodash.foldr = collections.reduceRight;
lodash.include = collections.contains;
lodash.inject = collections.reduce;

mixin(function() {
  var source = {}
  forOwn(lodash, function(func, methodName) {
    if (!lodash.prototype[methodName]) {
      source[methodName] = func;
    }
  });
  return source;
}(), false);

// add functions capable of returning wrapped and unwrapped values when chaining
lodash.first = arrays.first;
lodash.last = arrays.last;
lodash.sample = collections.sample;

// add aliases
lodash.take = arrays.first;
lodash.head = arrays.first;

forOwn(lodash, function(func, methodName) {
  var callbackable = methodName !== 'sample';
  if (!lodash.prototype[methodName]) {
    lodash.prototype[methodName]= function(n, guard) {
      var chainAll = this.__chain__,
          result = func(this.__wrapped__, n, guard);

      return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
        ? result
        : new lodashWrapper(result, chainAll);
    };
  }
});

/**
 * The semantic version number.
 *
 * @static
 * @memberOf _
 * @type string
 */
lodash.VERSION = '2.4.1';

// add "Chaining" functions to the wrapper
lodash.prototype.chain = chaining.wrapperChain;
lodash.prototype.toString = chaining.wrapperToString;
lodash.prototype.value = chaining.wrapperValueOf;
lodash.prototype.valueOf = chaining.wrapperValueOf;

// add `Array` functions that return unwrapped values
forEach(['join', 'pop', 'shift'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    var chainAll = this.__chain__,
        result = func.apply(this.__wrapped__, arguments);

    return chainAll
      ? new lodashWrapper(result, chainAll)
      : result;
  };
});

// add `Array` functions that return the existing wrapped value
forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    func.apply(this.__wrapped__, arguments);
    return this;
  };
});

// add `Array` functions that return new wrapped values
forEach(['concat', 'slice', 'splice'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
  };
});

lodash.support = support;
(lodash.templateSettings = utilities.templateSettings).imports._ = lodash;
module.exports = lodash;

},{"./arrays":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/arrays.js","./chaining":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/chaining.js","./collections":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections.js","./collections/forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js","./functions":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions.js","./internals/lodashWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/lodashWrapper.js","./objects":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects.js","./objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","./objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","./support":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/support.js","./utilities":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities.js","./utilities/mixin":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/mixin.js","./utilities/templateSettings":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/templateSettings.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/arrayPool.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var arrayPool = [];

module.exports = arrayPool;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseBind.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('./baseCreate'),
    isObject = require('../objects/isObject'),
    setBindData = require('./setBindData'),
    slice = require('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `_.bind` that creates the bound function and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new bound function.
 */
function baseBind(bindData) {
  var func = bindData[0],
      partialArgs = bindData[2],
      thisArg = bindData[4];

  function bound() {
    // `Function#bind` spec
    // http://es5.github.io/#x15.3.4.5
    if (partialArgs) {
      // avoid `arguments` object deoptimizations by using `slice` instead
      // of `Array.prototype.slice.call` and not assigning `arguments` to a
      // variable as a ternary expression
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    // mimic the constructor's `return` behavior
    // http://es5.github.io/#x13.2.2
    if (this instanceof bound) {
      // ensure `new bound` is an instance of `func`
      var thisBinding = baseCreate(func.prototype),
          result = func.apply(thisBinding, args || arguments);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisArg, args || arguments);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseBind;

},{"../objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js","./baseCreate":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreate.js","./setBindData":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/setBindData.js","./slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseClone.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var assign = require('../objects/assign'),
    forEach = require('../collections/forEach'),
    forOwn = require('../objects/forOwn'),
    getArray = require('./getArray'),
    isArray = require('../objects/isArray'),
    isObject = require('../objects/isObject'),
    releaseArray = require('./releaseArray'),
    slice = require('./slice');

/** Used to match regexp flags from their coerced string values */
var reFlags = /\w*$/;

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    funcClass = '[object Function]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used to identify object classifications that `_.clone` supports */
var cloneableClasses = {};
cloneableClasses[funcClass] = false;
cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
cloneableClasses[boolClass] = cloneableClasses[dateClass] =
cloneableClasses[numberClass] = cloneableClasses[objectClass] =
cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to lookup a built-in constructor by [[Class]] */
var ctorByClass = {};
ctorByClass[arrayClass] = Array;
ctorByClass[boolClass] = Boolean;
ctorByClass[dateClass] = Date;
ctorByClass[funcClass] = Function;
ctorByClass[objectClass] = Object;
ctorByClass[numberClass] = Number;
ctorByClass[regexpClass] = RegExp;
ctorByClass[stringClass] = String;

/**
 * The base implementation of `_.clone` without argument juggling or support
 * for `thisArg` binding.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep=false] Specify a deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, callback, stackA, stackB) {
  if (callback) {
    var result = callback(value);
    if (typeof result != 'undefined') {
      return result;
    }
  }
  // inspect [[Class]]
  var isObj = isObject(value);
  if (isObj) {
    var className = toString.call(value);
    if (!cloneableClasses[className]) {
      return value;
    }
    var ctor = ctorByClass[className];
    switch (className) {
      case boolClass:
      case dateClass:
        return new ctor(+value);

      case numberClass:
      case stringClass:
        return new ctor(value);

      case regexpClass:
        result = ctor(value.source, reFlags.exec(value));
        result.lastIndex = value.lastIndex;
        return result;
    }
  } else {
    return value;
  }
  var isArr = isArray(value);
  if (isDeep) {
    // check for circular references and return corresponding clone
    var initedStack = !stackA;
    stackA || (stackA = getArray());
    stackB || (stackB = getArray());

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    result = isArr ? ctor(value.length) : {};
  }
  else {
    result = isArr ? slice(value) : assign({}, value);
  }
  // add array properties assigned by `RegExp#exec`
  if (isArr) {
    if (hasOwnProperty.call(value, 'index')) {
      result.index = value.index;
    }
    if (hasOwnProperty.call(value, 'input')) {
      result.input = value.input;
    }
  }
  // exit for shallow clone
  if (!isDeep) {
    return result;
  }
  // add the source value to the stack of traversed objects
  // and associate it with its clone
  stackA.push(value);
  stackB.push(result);

  // recursively populate clone (susceptible to call stack limits)
  (isArr ? forEach : forOwn)(value, function(objValue, key) {
    result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
  });

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseClone;

},{"../collections/forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js","../objects/assign":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/assign.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","../objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js","./getArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getArray.js","./releaseArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseArray.js","./slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreate.js":[function(require,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('./isNative'),
    isObject = require('../objects/isObject'),
    noop = require('../utilities/noop');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(prototype, properties) {
  return isObject(prototype) ? nativeCreate(prototype) : {};
}
// fallback for browsers without `Object.create`
if (!nativeCreate) {
  baseCreate = (function() {
    function Object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        Object.prototype = prototype;
        var result = new Object;
        Object.prototype = null;
      }
      return result || global.Object();
    };
  }());
}

module.exports = baseCreate;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js","../utilities/noop":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/noop.js","./isNative":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/isNative.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var bind = require('../functions/bind'),
    identity = require('../utilities/identity'),
    setBindData = require('./setBindData'),
    support = require('../support');

/** Used to detected named functions */
var reFuncName = /^\s*function[ \n\r\t]+\w/;

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/** Native method shortcuts */
var fnToString = Function.prototype.toString;

/**
 * The base implementation of `_.createCallback` without support for creating
 * "_.pluck" or "_.where" style callbacks.
 *
 * @private
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 */
function baseCreateCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  // exit early for no `thisArg` or already bound by `Function#bind`
  if (typeof thisArg == 'undefined' || !('prototype' in func)) {
    return func;
  }
  var bindData = func.__bindData__;
  if (typeof bindData == 'undefined') {
    if (support.funcNames) {
      bindData = !func.name;
    }
    bindData = bindData || !support.funcDecomp;
    if (!bindData) {
      var source = fnToString.call(func);
      if (!support.funcNames) {
        bindData = !reFuncName.test(source);
      }
      if (!bindData) {
        // checks if `func` references the `this` keyword and stores the result
        bindData = reThis.test(source);
        setBindData(func, bindData);
      }
    }
  }
  // exit early if there are no `this` references or `func` is bound
  if (bindData === false || (bindData !== true && bindData[1] & 1)) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 2: return function(a, b) {
      return func.call(thisArg, a, b);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
  }
  return bind(func, thisArg);
}

module.exports = baseCreateCallback;

},{"../functions/bind":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/bind.js","../support":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/support.js","../utilities/identity":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/identity.js","./setBindData":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/setBindData.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateWrapper.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('./baseCreate'),
    isObject = require('../objects/isObject'),
    setBindData = require('./setBindData'),
    slice = require('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `createWrapper` that creates the wrapper and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new function.
 */
function baseCreateWrapper(bindData) {
  var func = bindData[0],
      bitmask = bindData[1],
      partialArgs = bindData[2],
      partialRightArgs = bindData[3],
      thisArg = bindData[4],
      arity = bindData[5];

  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      key = func;

  function bound() {
    var thisBinding = isBind ? thisArg : this;
    if (partialArgs) {
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    if (partialRightArgs || isCurry) {
      args || (args = slice(arguments));
      if (partialRightArgs) {
        push.apply(args, partialRightArgs);
      }
      if (isCurry && args.length < arity) {
        bitmask |= 16 & ~32;
        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
      }
    }
    args || (args = arguments);
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (this instanceof bound) {
      thisBinding = baseCreate(func.prototype);
      var result = func.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisBinding, args);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseCreateWrapper;

},{"../objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js","./baseCreate":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreate.js","./setBindData":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/setBindData.js","./slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseDifference.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('./baseIndexOf'),
    cacheIndexOf = require('./cacheIndexOf'),
    createCache = require('./createCache'),
    largeArraySize = require('./largeArraySize'),
    releaseObject = require('./releaseObject');

/**
 * The base implementation of `_.difference` that accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to process.
 * @param {Array} [values] The array of values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 */
function baseDifference(array, values) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array ? array.length : 0,
      isLarge = length >= largeArraySize,
      result = [];

  if (isLarge) {
    var cache = createCache(values);
    if (cache) {
      indexOf = cacheIndexOf;
      values = cache;
    } else {
      isLarge = false;
    }
  }
  while (++index < length) {
    var value = array[index];
    if (indexOf(values, value) < 0) {
      result.push(value);
    }
  }
  if (isLarge) {
    releaseObject(values);
  }
  return result;
}

module.exports = baseDifference;

},{"./baseIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIndexOf.js","./cacheIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/cacheIndexOf.js","./createCache":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createCache.js","./largeArraySize":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/largeArraySize.js","./releaseObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseFlatten.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isArguments = require('../objects/isArguments'),
    isArray = require('../objects/isArray');

/**
 * The base implementation of `_.flatten` without support for callback
 * shorthands or `thisArg` binding.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
 * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
 * @param {number} [fromIndex=0] The index to start from.
 * @returns {Array} Returns a new flattened array.
 */
function baseFlatten(array, isShallow, isStrict, fromIndex) {
  var index = (fromIndex || 0) - 1,
      length = array ? array.length : 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (value && typeof value == 'object' && typeof value.length == 'number'
        && (isArray(value) || isArguments(value))) {
      // recursively flatten arrays (susceptible to call stack limits)
      if (!isShallow) {
        value = baseFlatten(value, isShallow, isStrict);
      }
      var valIndex = -1,
          valLength = value.length,
          resIndex = result.length;

      result.length += valLength;
      while (++valIndex < valLength) {
        result[resIndex++] = value[valIndex];
      }
    } else if (!isStrict) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../objects/isArguments":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArguments.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIndexOf.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * The base implementation of `_.indexOf` without support for binary searches
 * or `fromIndex` constraints.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value or `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  var index = (fromIndex || 0) - 1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIsEqual.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = require('../objects/forIn'),
    getArray = require('./getArray'),
    isFunction = require('../objects/isFunction'),
    objectTypes = require('./objectTypes'),
    releaseArray = require('./releaseArray');

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.isEqual`, without support for `thisArg` binding,
 * that allows partial "_.where" style comparisons.
 *
 * @private
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `a` objects.
 * @param {Array} [stackB=[]] Tracks traversed `b` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
  // used to indicate that when comparing objects, `a` has at least the properties of `b`
  if (callback) {
    var result = callback(a, b);
    if (typeof result != 'undefined') {
      return !!result;
    }
  }
  // exit early for identical values
  if (a === b) {
    // treat `+0` vs. `-0` as not equal
    return a !== 0 || (1 / a == 1 / b);
  }
  var type = typeof a,
      otherType = typeof b;

  // exit early for unlike primitive values
  if (a === a &&
      !(a && objectTypes[type]) &&
      !(b && objectTypes[otherType])) {
    return false;
  }
  // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
  // http://es5.github.io/#x15.3.4.4
  if (a == null || b == null) {
    return a === b;
  }
  // compare [[Class]] names
  var className = toString.call(a),
      otherClass = toString.call(b);

  if (className == argsClass) {
    className = objectClass;
  }
  if (otherClass == argsClass) {
    otherClass = objectClass;
  }
  if (className != otherClass) {
    return false;
  }
  switch (className) {
    case boolClass:
    case dateClass:
      // coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
      return +a == +b;

    case numberClass:
      // treat `NaN` vs. `NaN` as equal
      return (a != +a)
        ? b != +b
        // but treat `+0` vs. `-0` as not equal
        : (a == 0 ? (1 / a == 1 / b) : a == +b);

    case regexpClass:
    case stringClass:
      // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
      // treat string primitives and their corresponding object instances as equal
      return a == String(b);
  }
  var isArr = className == arrayClass;
  if (!isArr) {
    // unwrap any `lodash` wrapped values
    var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
        bWrapped = hasOwnProperty.call(b, '__wrapped__');

    if (aWrapped || bWrapped) {
      return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
    }
    // exit for functions and DOM nodes
    if (className != objectClass) {
      return false;
    }
    // in older versions of Opera, `arguments` objects have `Array` constructors
    var ctorA = a.constructor,
        ctorB = b.constructor;

    // non `Object` object instances with different constructors are not equal
    if (ctorA != ctorB &&
          !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
          ('constructor' in a && 'constructor' in b)
        ) {
      return false;
    }
  }
  // assume cyclic structures are equal
  // the algorithm for detecting cyclic structures is adapted from ES 5.1
  // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
  var initedStack = !stackA;
  stackA || (stackA = getArray());
  stackB || (stackB = getArray());

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == a) {
      return stackB[length] == b;
    }
  }
  var size = 0;
  result = true;

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  // recursively compare objects and arrays (susceptible to call stack limits)
  if (isArr) {
    // compare lengths to determine if a deep comparison is necessary
    length = a.length;
    size = b.length;
    result = size == length;

    if (result || isWhere) {
      // deep compare the contents, ignoring non-numeric properties
      while (size--) {
        var index = length,
            value = b[size];

        if (isWhere) {
          while (index--) {
            if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
          break;
        }
      }
    }
  }
  else {
    // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
    // which, in this case, is more costly
    forIn(b, function(value, key, b) {
      if (hasOwnProperty.call(b, key)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
      }
    });

    if (result && !isWhere) {
      // ensure both objects have the same number of properties
      forIn(a, function(value, key, a) {
        if (hasOwnProperty.call(a, key)) {
          // `size` will be `-1` if `a` has more properties than `b`
          return (result = --size > -1);
        }
      });
    }
  }
  stackA.pop();
  stackB.pop();

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseIsEqual;

},{"../objects/forIn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forIn.js","../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js","./getArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getArray.js","./objectTypes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectTypes.js","./releaseArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseArray.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseMerge.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = require('../collections/forEach'),
    forOwn = require('../objects/forOwn'),
    isArray = require('../objects/isArray'),
    isPlainObject = require('../objects/isPlainObject');

/**
 * The base implementation of `_.merge` without argument juggling or support
 * for `thisArg` binding.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} [callback] The function to customize merging properties.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 */
function baseMerge(object, source, callback, stackA, stackB) {
  (isArray(source) ? forEach : forOwn)(source, function(source, key) {
    var found,
        isArr,
        result = source,
        value = object[key];

    if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
      // avoid merging previously merged cyclic sources
      var stackLength = stackA.length;
      while (stackLength--) {
        if ((found = stackA[stackLength] == source)) {
          value = stackB[stackLength];
          break;
        }
      }
      if (!found) {
        var isShallow;
        if (callback) {
          result = callback(value, source);
          if ((isShallow = typeof result != 'undefined')) {
            value = result;
          }
        }
        if (!isShallow) {
          value = isArr
            ? (isArray(value) ? value : [])
            : (isPlainObject(value) ? value : {});
        }
        // add `source` and associated `value` to the stack of traversed objects
        stackA.push(source);
        stackB.push(value);

        // recursively merge objects and arrays (susceptible to call stack limits)
        if (!isShallow) {
          baseMerge(value, source, callback, stackA, stackB);
        }
      }
    }
    else {
      if (callback) {
        result = callback(value, source);
        if (typeof result == 'undefined') {
          result = source;
        }
      }
      if (typeof result != 'undefined') {
        value = result;
      }
    }
    object[key] = value;
  });
}

module.exports = baseMerge;

},{"../collections/forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","../objects/isPlainObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isPlainObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseRandom.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Native method shortcuts */
var floor = Math.floor;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeRandom = Math.random;

/**
 * The base implementation of `_.random` without argument juggling or support
 * for returning floating-point numbers.
 *
 * @private
 * @param {number} min The minimum possible value.
 * @param {number} max The maximum possible value.
 * @returns {number} Returns a random number.
 */
function baseRandom(min, max) {
  return min + floor(nativeRandom() * (max - min + 1));
}

module.exports = baseRandom;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseUniq.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('./baseIndexOf'),
    cacheIndexOf = require('./cacheIndexOf'),
    createCache = require('./createCache'),
    getArray = require('./getArray'),
    largeArraySize = require('./largeArraySize'),
    releaseArray = require('./releaseArray'),
    releaseObject = require('./releaseObject');

/**
 * The base implementation of `_.uniq` without support for callback shorthands
 * or `thisArg` binding.
 *
 * @private
 * @param {Array} array The array to process.
 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
 * @param {Function} [callback] The function called per iteration.
 * @returns {Array} Returns a duplicate-value-free array.
 */
function baseUniq(array, isSorted, callback) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array ? array.length : 0,
      result = [];

  var isLarge = !isSorted && length >= largeArraySize,
      seen = (callback || isLarge) ? getArray() : result;

  if (isLarge) {
    var cache = createCache(seen);
    indexOf = cacheIndexOf;
    seen = cache;
  }
  while (++index < length) {
    var value = array[index],
        computed = callback ? callback(value, index, array) : value;

    if (isSorted
          ? !index || seen[seen.length - 1] !== computed
          : indexOf(seen, computed) < 0
        ) {
      if (callback || isLarge) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  if (isLarge) {
    releaseArray(seen.array);
    releaseObject(seen);
  } else if (callback) {
    releaseArray(seen);
  }
  return result;
}

module.exports = baseUniq;

},{"./baseIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIndexOf.js","./cacheIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/cacheIndexOf.js","./createCache":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createCache.js","./getArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getArray.js","./largeArraySize":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/largeArraySize.js","./releaseArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseArray.js","./releaseObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/cacheIndexOf.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('./baseIndexOf'),
    keyPrefix = require('./keyPrefix');

/**
 * An implementation of `_.contains` for cache objects that mimics the return
 * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache object to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var type = typeof value;
  cache = cache.cache;

  if (type == 'boolean' || value == null) {
    return cache[value] ? 0 : -1;
  }
  if (type != 'number' && type != 'string') {
    type = 'object';
  }
  var key = type == 'number' ? value : keyPrefix + value;
  cache = (cache = cache[type]) && cache[key];

  return type == 'object'
    ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
    : (cache ? 0 : -1);
}

module.exports = cacheIndexOf;

},{"./baseIndexOf":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIndexOf.js","./keyPrefix":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/keyPrefix.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/cachePush.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keyPrefix = require('./keyPrefix');

/**
 * Adds a given value to the corresponding cache object.
 *
 * @private
 * @param {*} value The value to add to the cache.
 */
function cachePush(value) {
  var cache = this.cache,
      type = typeof value;

  if (type == 'boolean' || value == null) {
    cache[value] = true;
  } else {
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value,
        typeCache = cache[type] || (cache[type] = {});

    if (type == 'object') {
      (typeCache[key] || (typeCache[key] = [])).push(value);
    } else {
      typeCache[key] = true;
    }
  }
}

module.exports = cachePush;

},{"./keyPrefix":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/keyPrefix.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/charAtCallback.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used by `_.max` and `_.min` as the default callback when a given
 * collection is a string value.
 *
 * @private
 * @param {string} value The character to inspect.
 * @returns {number} Returns the code unit of given character.
 */
function charAtCallback(value) {
  return value.charCodeAt(0);
}

module.exports = charAtCallback;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/compareAscending.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used by `sortBy` to compare transformed `collection` elements, stable sorting
 * them in ascending order.
 *
 * @private
 * @param {Object} a The object to compare to `b`.
 * @param {Object} b The object to compare to `a`.
 * @returns {number} Returns the sort order indicator of `1` or `-1`.
 */
function compareAscending(a, b) {
  var ac = a.criteria,
      bc = b.criteria,
      index = -1,
      length = ac.length;

  while (++index < length) {
    var value = ac[index],
        other = bc[index];

    if (value !== other) {
      if (value > other || typeof value == 'undefined') {
        return 1;
      }
      if (value < other || typeof other == 'undefined') {
        return -1;
      }
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to return the same value for
  // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
  //
  // This also ensures a stable sort in V8 and other engines.
  // See http://code.google.com/p/v8/issues/detail?id=90
  return a.index - b.index;
}

module.exports = compareAscending;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createAggregator.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('../objects/forOwn'),
    isArray = require('../objects/isArray');

/**
 * Creates a function that aggregates a collection, creating an object composed
 * of keys generated from the results of running each element of the collection
 * through a callback. The given `setter` function sets the keys and values
 * of the composed object.
 *
 * @private
 * @param {Function} setter The setter function.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter) {
  return function(collection, callback, thisArg) {
    var result = {};
    callback = createCallback(callback, thisArg, 3);

    var index = -1,
        length = collection ? collection.length : 0;

    if (typeof length == 'number') {
      while (++index < length) {
        var value = collection[index];
        setter(result, value, callback(value, index, collection), collection);
      }
    } else {
      forOwn(collection, function(value, key, collection) {
        setter(result, value, callback(value, key, collection), collection);
      });
    }
    return result;
  };
}

module.exports = createAggregator;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","../objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createCache.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var cachePush = require('./cachePush'),
    getObject = require('./getObject'),
    releaseObject = require('./releaseObject');

/**
 * Creates a cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [array=[]] The array to search.
 * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
 */
function createCache(array) {
  var index = -1,
      length = array.length,
      first = array[0],
      mid = array[(length / 2) | 0],
      last = array[length - 1];

  if (first && typeof first == 'object' &&
      mid && typeof mid == 'object' && last && typeof last == 'object') {
    return false;
  }
  var cache = getObject();
  cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

  var result = getObject();
  result.array = array;
  result.cache = cache;
  result.push = cachePush;

  while (++index < length) {
    result.push(array[index]);
  }
  return result;
}

module.exports = createCache;

},{"./cachePush":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/cachePush.js","./getObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getObject.js","./releaseObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/createWrapper.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseBind = require('./baseBind'),
    baseCreateWrapper = require('./baseCreateWrapper'),
    isFunction = require('../objects/isFunction'),
    slice = require('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push,
    unshift = arrayRef.unshift;

/**
 * Creates a function that, when called, either curries or invokes `func`
 * with an optional `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of method flags to compose.
 *  The bitmask may be composed of the following flags:
 *  1 - `_.bind`
 *  2 - `_.bindKey`
 *  4 - `_.curry`
 *  8 - `_.curry` (bound)
 *  16 - `_.partial`
 *  32 - `_.partialRight`
 * @param {Array} [partialArgs] An array of arguments to prepend to those
 *  provided to the new function.
 * @param {Array} [partialRightArgs] An array of arguments to append to those
 *  provided to the new function.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new function.
 */
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      isPartial = bitmask & 16,
      isPartialRight = bitmask & 32;

  if (!isBindKey && !isFunction(func)) {
    throw new TypeError;
  }
  if (isPartial && !partialArgs.length) {
    bitmask &= ~16;
    isPartial = partialArgs = false;
  }
  if (isPartialRight && !partialRightArgs.length) {
    bitmask &= ~32;
    isPartialRight = partialRightArgs = false;
  }
  var bindData = func && func.__bindData__;
  if (bindData && bindData !== true) {
    // clone `bindData`
    bindData = slice(bindData);
    if (bindData[2]) {
      bindData[2] = slice(bindData[2]);
    }
    if (bindData[3]) {
      bindData[3] = slice(bindData[3]);
    }
    // set `thisBinding` is not previously bound
    if (isBind && !(bindData[1] & 1)) {
      bindData[4] = thisArg;
    }
    // set if previously bound but not currently (subsequent curried functions)
    if (!isBind && bindData[1] & 1) {
      bitmask |= 8;
    }
    // set curried arity if not yet set
    if (isCurry && !(bindData[1] & 4)) {
      bindData[5] = arity;
    }
    // append partial left arguments
    if (isPartial) {
      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
    }
    // append partial right arguments
    if (isPartialRight) {
      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
    }
    // merge flags
    bindData[1] |= bitmask;
    return createWrapper.apply(null, bindData);
  }
  // fast path for `_.bind`
  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
}

module.exports = createWrapper;

},{"../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js","./baseBind":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseBind.js","./baseCreateWrapper":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateWrapper.js","./slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/escapeHtmlChar.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = require('./htmlEscapes');

/**
 * Used by `escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} match The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeHtmlChar(match) {
  return htmlEscapes[match];
}

module.exports = escapeHtmlChar;

},{"./htmlEscapes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/htmlEscapes.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/escapeStringChar.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to escape characters for inclusion in compiled string literals */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\t': 't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/**
 * Used by `template` to escape characters for inclusion in compiled
 * string literals.
 *
 * @private
 * @param {string} match The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(match) {
  return '\\' + stringEscapes[match];
}

module.exports = escapeStringChar;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getArray.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = require('./arrayPool');

/**
 * Gets an array from the array pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Array} The array from the pool.
 */
function getArray() {
  return arrayPool.pop() || [];
}

module.exports = getArray;

},{"./arrayPool":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/arrayPool.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getObject.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectPool = require('./objectPool');

/**
 * Gets an object from the object pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Object} The object from the pool.
 */
function getObject() {
  return objectPool.pop() || {
    'array': null,
    'cache': null,
    'criteria': null,
    'false': false,
    'index': 0,
    'null': false,
    'number': null,
    'object': null,
    'push': null,
    'string': null,
    'true': false,
    'undefined': false,
    'value': null
  };
}

module.exports = getObject;

},{"./objectPool":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectPool.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/htmlEscapes.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used to convert characters to HTML entities:
 *
 * Though the `>` character is escaped for symmetry, characters like `>` and `/`
 * don't require escaping in HTML and have no special meaning unless they're part
 * of a tag or an unquoted attribute value.
 * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
 */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

module.exports = htmlEscapes;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/htmlUnescapes.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = require('./htmlEscapes'),
    invert = require('../objects/invert');

/** Used to convert HTML entities to characters */
var htmlUnescapes = invert(htmlEscapes);

module.exports = htmlUnescapes;

},{"../objects/invert":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/invert.js","./htmlEscapes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/htmlEscapes.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/isNative.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/keyPrefix.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
var keyPrefix = +new Date + '';

module.exports = keyPrefix;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/largeArraySize.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the size when optimizations are enabled for large arrays */
var largeArraySize = 75;

module.exports = largeArraySize;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/lodashWrapper.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A fast path for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap in a `lodash` instance.
 * @param {boolean} chainAll A flag to enable chaining for all methods
 * @returns {Object} Returns a `lodash` instance.
 */
function lodashWrapper(value, chainAll) {
  this.__chain__ = !!chainAll;
  this.__wrapped__ = value;
}

module.exports = lodashWrapper;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/maxPoolSize.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the max size of the `arrayPool` and `objectPool` */
var maxPoolSize = 40;

module.exports = maxPoolSize;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectPool.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var objectPool = [];

module.exports = objectPool;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectTypes.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/reEscapedHtml.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlUnescapes = require('./htmlUnescapes'),
    keys = require('../objects/keys');

/** Used to match HTML entities and HTML characters */
var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g');

module.exports = reEscapedHtml;

},{"../objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js","./htmlUnescapes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/htmlUnescapes.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/reInterpolate.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to match "interpolate" template delimiters */
var reInterpolate = /<%=([\s\S]+?)%>/g;

module.exports = reInterpolate;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/reUnescapedHtml.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = require('./htmlEscapes'),
    keys = require('../objects/keys');

/** Used to match HTML entities and HTML characters */
var reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

module.exports = reUnescapedHtml;

},{"../objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js","./htmlEscapes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/htmlEscapes.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseArray.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = require('./arrayPool'),
    maxPoolSize = require('./maxPoolSize');

/**
 * Releases the given array back to the array pool.
 *
 * @private
 * @param {Array} [array] The array to release.
 */
function releaseArray(array) {
  array.length = 0;
  if (arrayPool.length < maxPoolSize) {
    arrayPool.push(array);
  }
}

module.exports = releaseArray;

},{"./arrayPool":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/arrayPool.js","./maxPoolSize":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/maxPoolSize.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseObject.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var maxPoolSize = require('./maxPoolSize'),
    objectPool = require('./objectPool');

/**
 * Releases the given object back to the object pool.
 *
 * @private
 * @param {Object} [object] The object to release.
 */
function releaseObject(object) {
  var cache = object.cache;
  if (cache) {
    releaseObject(cache);
  }
  object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
  if (objectPool.length < maxPoolSize) {
    objectPool.push(object);
  }
}

module.exports = releaseObject;

},{"./maxPoolSize":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/maxPoolSize.js","./objectPool":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectPool.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/setBindData.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('./isNative'),
    noop = require('../utilities/noop');

/** Used as the property descriptor for `__bindData__` */
var descriptor = {
  'configurable': false,
  'enumerable': false,
  'value': null,
  'writable': false
};

/** Used to set meta data on functions */
var defineProperty = (function() {
  // IE 8 only accepts DOM elements
  try {
    var o = {},
        func = isNative(func = Object.defineProperty) && func,
        result = func(o, o, o) && func;
  } catch(e) { }
  return result;
}());

/**
 * Sets `this` binding data on a given function.
 *
 * @private
 * @param {Function} func The function to set data on.
 * @param {Array} value The data array to set.
 */
var setBindData = !defineProperty ? noop : function(func, value) {
  descriptor.value = value;
  defineProperty(func, '__bindData__', descriptor);
};

module.exports = setBindData;

},{"../utilities/noop":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/noop.js","./isNative":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/isNative.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/shimIsPlainObject.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = require('../objects/forIn'),
    isFunction = require('../objects/isFunction');

/** `Object#toString` result shortcuts */
var objectClass = '[object Object]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `isPlainObject` which checks if a given value
 * is an object created by the `Object` constructor, assuming objects created
 * by the `Object` constructor have no inherited enumerable properties and that
 * there are no `Object.prototype` extensions.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 */
function shimIsPlainObject(value) {
  var ctor,
      result;

  // avoid non Object objects, `arguments` objects, and DOM elements
  if (!(value && toString.call(value) == objectClass) ||
      (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
    return false;
  }
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  forIn(value, function(value, key) {
    result = key;
  });
  return typeof result == 'undefined' || hasOwnProperty.call(value, result);
}

module.exports = shimIsPlainObject;

},{"../objects/forIn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forIn.js","../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/shimKeys.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('./objectTypes');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which produces an array of the
 * given object's own enumerable property names.
 *
 * @private
 * @type Function
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 */
var shimKeys = function(object) {
  var index, iterable = object, result = [];
  if (!iterable) return result;
  if (!(objectTypes[typeof object])) return result;
    for (index in iterable) {
      if (hasOwnProperty.call(iterable, index)) {
        result.push(index);
      }
    }
  return result
};

module.exports = shimKeys;

},{"./objectTypes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectTypes.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Slices the `collection` from the `start` index up to, but not including,
 * the `end` index.
 *
 * Note: This function is used instead of `Array#slice` to support node lists
 * in IE < 9 and to ensure dense arrays are returned.
 *
 * @private
 * @param {Array|Object|string} collection The collection to slice.
 * @param {number} start The start index.
 * @param {number} end The end index.
 * @returns {Array} Returns the new array.
 */
function slice(array, start, end) {
  start || (start = 0);
  if (typeof end == 'undefined') {
    end = array ? array.length : 0;
  }
  var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = array[start + index];
  }
  return result;
}

module.exports = slice;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/unescapeHtmlChar.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlUnescapes = require('./htmlUnescapes');

/**
 * Used by `unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} match The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */
function unescapeHtmlChar(match) {
  return htmlUnescapes[match];
}

module.exports = unescapeHtmlChar;

},{"./htmlUnescapes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/htmlUnescapes.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'assign': require('./objects/assign'),
  'clone': require('./objects/clone'),
  'cloneDeep': require('./objects/cloneDeep'),
  'create': require('./objects/create'),
  'defaults': require('./objects/defaults'),
  'extend': require('./objects/assign'),
  'findKey': require('./objects/findKey'),
  'findLastKey': require('./objects/findLastKey'),
  'forIn': require('./objects/forIn'),
  'forInRight': require('./objects/forInRight'),
  'forOwn': require('./objects/forOwn'),
  'forOwnRight': require('./objects/forOwnRight'),
  'functions': require('./objects/functions'),
  'has': require('./objects/has'),
  'invert': require('./objects/invert'),
  'isArguments': require('./objects/isArguments'),
  'isArray': require('./objects/isArray'),
  'isBoolean': require('./objects/isBoolean'),
  'isDate': require('./objects/isDate'),
  'isElement': require('./objects/isElement'),
  'isEmpty': require('./objects/isEmpty'),
  'isEqual': require('./objects/isEqual'),
  'isFinite': require('./objects/isFinite'),
  'isFunction': require('./objects/isFunction'),
  'isNaN': require('./objects/isNaN'),
  'isNull': require('./objects/isNull'),
  'isNumber': require('./objects/isNumber'),
  'isObject': require('./objects/isObject'),
  'isPlainObject': require('./objects/isPlainObject'),
  'isRegExp': require('./objects/isRegExp'),
  'isString': require('./objects/isString'),
  'isUndefined': require('./objects/isUndefined'),
  'keys': require('./objects/keys'),
  'mapValues': require('./objects/mapValues'),
  'merge': require('./objects/merge'),
  'methods': require('./objects/functions'),
  'omit': require('./objects/omit'),
  'pairs': require('./objects/pairs'),
  'pick': require('./objects/pick'),
  'transform': require('./objects/transform'),
  'values': require('./objects/values')
};

},{"./objects/assign":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/assign.js","./objects/clone":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/clone.js","./objects/cloneDeep":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/cloneDeep.js","./objects/create":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/create.js","./objects/defaults":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/defaults.js","./objects/findKey":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/findKey.js","./objects/findLastKey":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/findLastKey.js","./objects/forIn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forIn.js","./objects/forInRight":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forInRight.js","./objects/forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","./objects/forOwnRight":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwnRight.js","./objects/functions":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/functions.js","./objects/has":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/has.js","./objects/invert":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/invert.js","./objects/isArguments":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArguments.js","./objects/isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js","./objects/isBoolean":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isBoolean.js","./objects/isDate":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isDate.js","./objects/isElement":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isElement.js","./objects/isEmpty":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isEmpty.js","./objects/isEqual":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isEqual.js","./objects/isFinite":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFinite.js","./objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js","./objects/isNaN":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isNaN.js","./objects/isNull":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isNull.js","./objects/isNumber":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isNumber.js","./objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js","./objects/isPlainObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isPlainObject.js","./objects/isRegExp":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isRegExp.js","./objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js","./objects/isUndefined":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isUndefined.js","./objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js","./objects/mapValues":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/mapValues.js","./objects/merge":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/merge.js","./objects/omit":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/omit.js","./objects/pairs":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/pairs.js","./objects/pick":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/pick.js","./objects/transform":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/transform.js","./objects/values":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/values.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/assign.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    keys = require('./keys'),
    objectTypes = require('../internals/objectTypes');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources will overwrite property assignments of previous
 * sources. If a callback is provided it will be executed to produce the
 * assigned values. The callback is bound to `thisArg` and invoked with two
 * arguments; (objectValue, sourceValue).
 *
 * @static
 * @memberOf _
 * @type Function
 * @alias extend
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param {Function} [callback] The function to customize assigning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
 * // => { 'name': 'fred', 'employer': 'slate' }
 *
 * var defaults = _.partialRight(_.assign, function(a, b) {
 *   return typeof a == 'undefined' ? b : a;
 * });
 *
 * var object = { 'name': 'barney' };
 * defaults(object, { 'name': 'fred', 'employer': 'slate' });
 * // => { 'name': 'barney', 'employer': 'slate' }
 */
var assign = function(object, source, guard) {
  var index, iterable = object, result = iterable;
  if (!iterable) return result;
  var args = arguments,
      argsIndex = 0,
      argsLength = typeof guard == 'number' ? 2 : args.length;
  if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
    var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
  } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
    callback = args[--argsLength];
  }
  while (++argsIndex < argsLength) {
    iterable = args[argsIndex];
    if (iterable && objectTypes[typeof iterable]) {
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
    }
    }
  }
  return result
};

module.exports = assign;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","../internals/objectTypes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectTypes.js","./keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/clone.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseClone = require('../internals/baseClone'),
    baseCreateCallback = require('../internals/baseCreateCallback');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
 * be cloned, otherwise they will be assigned by reference. If a callback
 * is provided it will be executed to produce the cloned values. If the
 * callback returns `undefined` cloning will be handled by the method instead.
 * The callback is bound to `thisArg` and invoked with one argument; (value).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep=false] Specify a deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * var shallow = _.clone(characters);
 * shallow[0] === characters[0];
 * // => true
 *
 * var deep = _.clone(characters, true);
 * deep[0] === characters[0];
 * // => false
 *
 * _.mixin({
 *   'clone': _.partialRight(_.clone, function(value) {
 *     return _.isElement(value) ? value.cloneNode(false) : undefined;
 *   })
 * });
 *
 * var clone = _.clone(document.body);
 * clone.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, callback, thisArg) {
  // allows working with "Collections" methods without using their `index`
  // and `collection` arguments for `isDeep` and `callback`
  if (typeof isDeep != 'boolean' && isDeep != null) {
    thisArg = callback;
    callback = isDeep;
    isDeep = false;
  }
  return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
}

module.exports = clone;

},{"../internals/baseClone":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseClone.js","../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/cloneDeep.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseClone = require('../internals/baseClone'),
    baseCreateCallback = require('../internals/baseCreateCallback');

/**
 * Creates a deep clone of `value`. If a callback is provided it will be
 * executed to produce the cloned values. If the callback returns `undefined`
 * cloning will be handled by the method instead. The callback is bound to
 * `thisArg` and invoked with one argument; (value).
 *
 * Note: This method is loosely based on the structured clone algorithm. Functions
 * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
 * objects created by constructors other than `Object` are cloned to plain `Object` objects.
 * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the deep cloned value.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * var deep = _.cloneDeep(characters);
 * deep[0] === characters[0];
 * // => false
 *
 * var view = {
 *   'label': 'docs',
 *   'node': element
 * };
 *
 * var clone = _.cloneDeep(view, function(value) {
 *   return _.isElement(value) ? value.cloneNode(true) : undefined;
 * });
 *
 * clone.node == view.node;
 * // => false
 */
function cloneDeep(value, callback, thisArg) {
  return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
}

module.exports = cloneDeep;

},{"../internals/baseClone":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseClone.js","../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/create.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var assign = require('./assign'),
    baseCreate = require('../internals/baseCreate');

/**
 * Creates an object that inherits from the given `prototype` object. If a
 * `properties` object is provided its own enumerable properties are assigned
 * to the created object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} prototype The object to inherit from.
 * @param {Object} [properties] The properties to assign to the object.
 * @returns {Object} Returns the new object.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * function Circle() {
 *   Shape.call(this);
 * }
 *
 * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
 *
 * var circle = new Circle;
 * circle instanceof Circle;
 * // => true
 *
 * circle instanceof Shape;
 * // => true
 */
function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties ? assign(result, properties) : result;
}

module.exports = create;

},{"../internals/baseCreate":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreate.js","./assign":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/assign.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/defaults.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = require('./keys'),
    objectTypes = require('../internals/objectTypes');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object for all destination properties that resolve to `undefined`. Once a
 * property is set, additional defaults of the same property will be ignored.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param- {Object} [guard] Allows working with `_.reduce` without using its
 *  `key` and `object` arguments as sources.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * var object = { 'name': 'barney' };
 * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
 * // => { 'name': 'barney', 'employer': 'slate' }
 */
var defaults = function(object, source, guard) {
  var index, iterable = object, result = iterable;
  if (!iterable) return result;
  var args = arguments,
      argsIndex = 0,
      argsLength = typeof guard == 'number' ? 2 : args.length;
  while (++argsIndex < argsLength) {
    iterable = args[argsIndex];
    if (iterable && objectTypes[typeof iterable]) {
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      if (typeof result[index] == 'undefined') result[index] = iterable[index];
    }
    }
  }
  return result
};

module.exports = defaults;

},{"../internals/objectTypes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectTypes.js","./keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/findKey.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('./forOwn');

/**
 * This method is like `_.findIndex` except that it returns the key of the
 * first element that passes the callback check, instead of the element itself.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to search.
 * @param {Function|Object|string} [callback=identity] The function called per
 *  iteration. If a property name or object is provided it will be used to
 *  create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {string|undefined} Returns the key of the found element, else `undefined`.
 * @example
 *
 * var characters = {
 *   'barney': {  'age': 36, 'blocked': false },
 *   'fred': {    'age': 40, 'blocked': true },
 *   'pebbles': { 'age': 1,  'blocked': false }
 * };
 *
 * _.findKey(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => 'barney' (property order is not guaranteed across environments)
 *
 * // using "_.where" callback shorthand
 * _.findKey(characters, { 'age': 1 });
 * // => 'pebbles'
 *
 * // using "_.pluck" callback shorthand
 * _.findKey(characters, 'blocked');
 * // => 'fred'
 */
function findKey(object, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forOwn(object, function(value, key, object) {
    if (callback(value, key, object)) {
      result = key;
      return false;
    }
  });
  return result;
}

module.exports = findKey;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","./forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/findLastKey.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwnRight = require('./forOwnRight');

/**
 * This method is like `_.findKey` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to search.
 * @param {Function|Object|string} [callback=identity] The function called per
 *  iteration. If a property name or object is provided it will be used to
 *  create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {string|undefined} Returns the key of the found element, else `undefined`.
 * @example
 *
 * var characters = {
 *   'barney': {  'age': 36, 'blocked': true },
 *   'fred': {    'age': 40, 'blocked': false },
 *   'pebbles': { 'age': 1,  'blocked': true }
 * };
 *
 * _.findLastKey(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => returns `pebbles`, assuming `_.findKey` returns `barney`
 *
 * // using "_.where" callback shorthand
 * _.findLastKey(characters, { 'age': 40 });
 * // => 'fred'
 *
 * // using "_.pluck" callback shorthand
 * _.findLastKey(characters, 'blocked');
 * // => 'pebbles'
 */
function findLastKey(object, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forOwnRight(object, function(value, key, object) {
    if (callback(value, key, object)) {
      result = key;
      return false;
    }
  });
  return result;
}

module.exports = findLastKey;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","./forOwnRight":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwnRight.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forIn.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    objectTypes = require('../internals/objectTypes');

/**
 * Iterates over own and inherited enumerable properties of an object,
 * executing the callback for each property. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, key, object). Callbacks may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forIn(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
 */
var forIn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    for (index in iterable) {
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forIn;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","../internals/objectTypes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectTypes.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forInRight.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    forIn = require('./forIn');

/**
 * This method is like `_.forIn` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forInRight(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
 */
function forInRight(object, callback, thisArg) {
  var pairs = [];

  forIn(object, function(value, key) {
    pairs.push(key, value);
  });

  var length = pairs.length;
  callback = baseCreateCallback(callback, thisArg, 3);
  while (length--) {
    if (callback(pairs[length--], pairs[length], object) === false) {
      break;
    }
  }
  return object;
}

module.exports = forInRight;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","./forIn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forIn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    keys = require('./keys'),
    objectTypes = require('../internals/objectTypes');

/**
 * Iterates over own enumerable properties of an object, executing the callback
 * for each property. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, key, object). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
 *   console.log(key);
 * });
 * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
 */
var forOwn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forOwn;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","../internals/objectTypes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectTypes.js","./keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwnRight.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    keys = require('./keys');

/**
 * This method is like `_.forOwn` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
 *   console.log(key);
 * });
 * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
 */
function forOwnRight(object, callback, thisArg) {
  var props = keys(object),
      length = props.length;

  callback = baseCreateCallback(callback, thisArg, 3);
  while (length--) {
    var key = props[length];
    if (callback(object[key], key, object) === false) {
      break;
    }
  }
  return object;
}

module.exports = forOwnRight;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","./keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/functions.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = require('./forIn'),
    isFunction = require('./isFunction');

/**
 * Creates a sorted array of property names of all enumerable properties,
 * own and inherited, of `object` that have function values.
 *
 * @static
 * @memberOf _
 * @alias methods
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names that have function values.
 * @example
 *
 * _.functions(_);
 * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
 */
function functions(object) {
  var result = [];
  forIn(object, function(value, key) {
    if (isFunction(value)) {
      result.push(key);
    }
  });
  return result.sort();
}

module.exports = functions;

},{"./forIn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forIn.js","./isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/has.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if the specified property name exists as a direct property of `object`,
 * instead of an inherited property.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @param {string} key The name of the property to check.
 * @returns {boolean} Returns `true` if key is a direct property, else `false`.
 * @example
 *
 * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
 * // => true
 */
function has(object, key) {
  return object ? hasOwnProperty.call(object, key) : false;
}

module.exports = has;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/invert.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = require('./keys');

/**
 * Creates an object composed of the inverted keys and values of the given object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to invert.
 * @returns {Object} Returns the created inverted object.
 * @example
 *
 * _.invert({ 'first': 'fred', 'second': 'barney' });
 * // => { 'fred': 'first', 'barney': 'second' }
 */
function invert(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index];
    result[object[key]] = key;
  }
  return result;
}

module.exports = invert;

},{"./keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArguments.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
 * @example
 *
 * (function() { return _.isArguments(arguments); })(1, 2, 3);
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == argsClass || false;
}

module.exports = isArguments;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('../internals/isNative');

/** `Object#toString` result shortcuts */
var arrayClass = '[object Array]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Checks if `value` is an array.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
 * @example
 *
 * (function() { return _.isArray(arguments); })();
 * // => false
 *
 * _.isArray([1, 2, 3]);
 * // => true
 */
var isArray = nativeIsArray || function(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == arrayClass || false;
};

module.exports = isArray;

},{"../internals/isNative":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/isNative.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isBoolean.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var boolClass = '[object Boolean]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a boolean value.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
 * @example
 *
 * _.isBoolean(null);
 * // => false
 */
function isBoolean(value) {
  return value === true || value === false ||
    value && typeof value == 'object' && toString.call(value) == boolClass || false;
}

module.exports = isBoolean;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isDate.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var dateClass = '[object Date]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a date.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 */
function isDate(value) {
  return value && typeof value == 'object' && toString.call(value) == dateClass || false;
}

module.exports = isDate;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isElement.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a DOM element.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 */
function isElement(value) {
  return value && value.nodeType === 1 || false;
}

module.exports = isElement;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isEmpty.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forOwn = require('./forOwn'),
    isFunction = require('./isFunction');

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    objectClass = '[object Object]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
 * length of `0` and objects with no own enumerable properties are considered
 * "empty".
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Array|Object|string} value The value to inspect.
 * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({});
 * // => true
 *
 * _.isEmpty('');
 * // => true
 */
function isEmpty(value) {
  var result = true;
  if (!value) {
    return result;
  }
  var className = toString.call(value),
      length = value.length;

  if ((className == arrayClass || className == stringClass || className == argsClass ) ||
      (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
    return !length;
  }
  forOwn(value, function() {
    return (result = false);
  });
  return result;
}

module.exports = isEmpty;

},{"./forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","./isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isEqual.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    baseIsEqual = require('../internals/baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent to each other. If a callback is provided it will be executed
 * to compare values. If the callback returns `undefined` comparisons will
 * be handled by the method instead. The callback is bound to `thisArg` and
 * invoked with two arguments; (a, b).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * var copy = { 'name': 'fred' };
 *
 * object == copy;
 * // => false
 *
 * _.isEqual(object, copy);
 * // => true
 *
 * var words = ['hello', 'goodbye'];
 * var otherWords = ['hi', 'goodbye'];
 *
 * _.isEqual(words, otherWords, function(a, b) {
 *   var reGreet = /^(?:hello|hi)$/i,
 *       aGreet = _.isString(a) && reGreet.test(a),
 *       bGreet = _.isString(b) && reGreet.test(b);
 *
 *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
 * });
 * // => true
 */
function isEqual(a, b, callback, thisArg) {
  return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
}

module.exports = isEqual;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","../internals/baseIsEqual":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseIsEqual.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFinite.js":[function(require,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeIsFinite = global.isFinite,
    nativeIsNaN = global.isNaN;

/**
 * Checks if `value` is, or can be coerced to, a finite number.
 *
 * Note: This is not the same as native `isFinite` which will return true for
 * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
 * @example
 *
 * _.isFinite(-101);
 * // => true
 *
 * _.isFinite('10');
 * // => true
 *
 * _.isFinite(true);
 * // => false
 *
 * _.isFinite('');
 * // => false
 *
 * _.isFinite(Infinity);
 * // => false
 */
function isFinite(value) {
  return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
}

module.exports = isFinite;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isNaN.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNumber = require('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * Note: This is not the same as native `isNaN` which will return `true` for
 * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // `NaN` as a primitive is the only value that is not equal to itself
  // (perform the [[Class]] check first to avoid errors with some host objects in IE)
  return isNumber(value) && value != +value;
}

module.exports = isNaN;

},{"./isNumber":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isNumber.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isNull.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(undefined);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isNumber.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var numberClass = '[object Number]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a number.
 *
 * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(8.4 * 5);
 * // => true
 */
function isNumber(value) {
  return typeof value == 'number' ||
    value && typeof value == 'object' && toString.call(value) == numberClass || false;
}

module.exports = isNumber;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('../internals/objectTypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"../internals/objectTypes":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/objectTypes.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isPlainObject.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('../internals/isNative'),
    shimIsPlainObject = require('../internals/shimIsPlainObject');

/** `Object#toString` result shortcuts */
var objectClass = '[object Object]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf;

/**
 * Checks if `value` is an object created by the `Object` constructor.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * _.isPlainObject(new Shape);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 */
var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
  if (!(value && toString.call(value) == objectClass)) {
    return false;
  }
  var valueOf = value.valueOf,
      objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

  return objProto
    ? (value == objProto || getPrototypeOf(value) == objProto)
    : shimIsPlainObject(value);
};

module.exports = isPlainObject;

},{"../internals/isNative":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/isNative.js","../internals/shimIsPlainObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/shimIsPlainObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isRegExp.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var regexpClass = '[object RegExp]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a regular expression.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
 * @example
 *
 * _.isRegExp(/fred/);
 * // => true
 */
function isRegExp(value) {
  return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
}

module.exports = isRegExp;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a string.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
 * @example
 *
 * _.isString('fred');
 * // => true
 */
function isString(value) {
  return typeof value == 'string' ||
    value && typeof value == 'object' && toString.call(value) == stringClass || false;
}

module.exports = isString;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isUndefined.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 */
function isUndefined(value) {
  return typeof value == 'undefined';
}

module.exports = isUndefined;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('../internals/isNative'),
    isObject = require('./isObject'),
    shimKeys = require('../internals/shimKeys');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array composed of the own enumerable property names of an object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 * @example
 *
 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (!isObject(object)) {
    return [];
  }
  return nativeKeys(object);
};

module.exports = keys;

},{"../internals/isNative":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/isNative.js","../internals/shimKeys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/shimKeys.js","./isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/mapValues.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = require('../functions/createCallback'),
    forOwn = require('./forOwn');

/**
 * Creates an object with the same keys as `object` and values generated by
 * running each own enumerable property of `object` through the callback.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new object with values of the results of each `callback` execution.
 * @example
 *
 * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 *
 * var characters = {
 *   'fred': { 'name': 'fred', 'age': 40 },
 *   'pebbles': { 'name': 'pebbles', 'age': 1 }
 * };
 *
 * // using "_.pluck" callback shorthand
 * _.mapValues(characters, 'age');
 * // => { 'fred': 40, 'pebbles': 1 }
 */
function mapValues(object, callback, thisArg) {
  var result = {};
  callback = createCallback(callback, thisArg, 3);

  forOwn(object, function(value, key, object) {
    result[key] = callback(value, key, object);
  });
  return result;
}

module.exports = mapValues;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","./forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/merge.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback'),
    baseMerge = require('../internals/baseMerge'),
    getArray = require('../internals/getArray'),
    isObject = require('./isObject'),
    releaseArray = require('../internals/releaseArray'),
    slice = require('../internals/slice');

/**
 * Recursively merges own enumerable properties of the source object(s), that
 * don't resolve to `undefined` into the destination object. Subsequent sources
 * will overwrite property assignments of previous sources. If a callback is
 * provided it will be executed to produce the merged values of the destination
 * and source properties. If the callback returns `undefined` merging will
 * be handled by the method instead. The callback is bound to `thisArg` and
 * invoked with two arguments; (objectValue, sourceValue).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param {Function} [callback] The function to customize merging properties.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * var names = {
 *   'characters': [
 *     { 'name': 'barney' },
 *     { 'name': 'fred' }
 *   ]
 * };
 *
 * var ages = {
 *   'characters': [
 *     { 'age': 36 },
 *     { 'age': 40 }
 *   ]
 * };
 *
 * _.merge(names, ages);
 * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
 *
 * var food = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var otherFood = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.merge(food, otherFood, function(a, b) {
 *   return _.isArray(a) ? a.concat(b) : undefined;
 * });
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
 */
function merge(object) {
  var args = arguments,
      length = 2;

  if (!isObject(object)) {
    return object;
  }
  // allows working with `_.reduce` and `_.reduceRight` without using
  // their `index` and `collection` arguments
  if (typeof args[2] != 'number') {
    length = args.length;
  }
  if (length > 3 && typeof args[length - 2] == 'function') {
    var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
  } else if (length > 2 && typeof args[length - 1] == 'function') {
    callback = args[--length];
  }
  var sources = slice(arguments, 1, length),
      index = -1,
      stackA = getArray(),
      stackB = getArray();

  while (++index < length) {
    baseMerge(object, sources[index], callback, stackA, stackB);
  }
  releaseArray(stackA);
  releaseArray(stackB);
  return object;
}

module.exports = merge;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js","../internals/baseMerge":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseMerge.js","../internals/getArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/getArray.js","../internals/releaseArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/releaseArray.js","../internals/slice":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/slice.js","./isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/omit.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = require('../internals/baseDifference'),
    baseFlatten = require('../internals/baseFlatten'),
    createCallback = require('../functions/createCallback'),
    forIn = require('./forIn');

/**
 * Creates a shallow clone of `object` excluding the specified properties.
 * Property names may be specified as individual arguments or as arrays of
 * property names. If a callback is provided it will be executed for each
 * property of `object` omitting the properties the callback returns truey
 * for. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The source object.
 * @param {Function|...string|string[]} [callback] The properties to omit or the
 *  function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns an object without the omitted properties.
 * @example
 *
 * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
 * // => { 'name': 'fred' }
 *
 * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
 *   return typeof value == 'number';
 * });
 * // => { 'name': 'fred' }
 */
function omit(object, callback, thisArg) {
  var result = {};
  if (typeof callback != 'function') {
    var props = [];
    forIn(object, function(value, key) {
      props.push(key);
    });
    props = baseDifference(props, baseFlatten(arguments, true, false, 1));

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      result[key] = object[key];
    }
  } else {
    callback = createCallback(callback, thisArg, 3);
    forIn(object, function(value, key, object) {
      if (!callback(value, key, object)) {
        result[key] = value;
      }
    });
  }
  return result;
}

module.exports = omit;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/baseDifference":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseDifference.js","../internals/baseFlatten":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseFlatten.js","./forIn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forIn.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/pairs.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = require('./keys');

/**
 * Creates a two dimensional array of an object's key-value pairs,
 * i.e. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
 */
function pairs(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"./keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/pick.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = require('../internals/baseFlatten'),
    createCallback = require('../functions/createCallback'),
    forIn = require('./forIn'),
    isObject = require('./isObject');

/**
 * Creates a shallow clone of `object` composed of the specified properties.
 * Property names may be specified as individual arguments or as arrays of
 * property names. If a callback is provided it will be executed for each
 * property of `object` picking the properties the callback returns truey
 * for. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The source object.
 * @param {Function|...string|string[]} [callback] The function called per
 *  iteration or property names to pick, specified as individual property
 *  names or arrays of property names.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns an object composed of the picked properties.
 * @example
 *
 * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
 * // => { 'name': 'fred' }
 *
 * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
 *   return key.charAt(0) != '_';
 * });
 * // => { 'name': 'fred' }
 */
function pick(object, callback, thisArg) {
  var result = {};
  if (typeof callback != 'function') {
    var index = -1,
        props = baseFlatten(arguments, true, false, 1),
        length = isObject(object) ? props.length : 0;

    while (++index < length) {
      var key = props[index];
      if (key in object) {
        result[key] = object[key];
      }
    }
  } else {
    callback = createCallback(callback, thisArg, 3);
    forIn(object, function(value, key, object) {
      if (callback(value, key, object)) {
        result[key] = value;
      }
    });
  }
  return result;
}

module.exports = pick;

},{"../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/baseFlatten":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseFlatten.js","./forIn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forIn.js","./isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/transform.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('../internals/baseCreate'),
    createCallback = require('../functions/createCallback'),
    forEach = require('../collections/forEach'),
    forOwn = require('./forOwn'),
    isArray = require('./isArray');

/**
 * An alternative to `_.reduce` this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable properties through a callback, with each callback execution
 * potentially mutating the `accumulator` object. The callback is bound to
 * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
 * Callbacks may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Array|Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
 *   num *= num;
 *   if (num % 2) {
 *     return result.push(num) < 3;
 *   }
 * });
 * // => [1, 9, 25]
 *
 * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
 *   result[key] = num * 3;
 * });
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 */
function transform(object, callback, accumulator, thisArg) {
  var isArr = isArray(object);
  if (accumulator == null) {
    if (isArr) {
      accumulator = [];
    } else {
      var ctor = object && object.constructor,
          proto = ctor && ctor.prototype;

      accumulator = baseCreate(proto);
    }
  }
  if (callback) {
    callback = createCallback(callback, thisArg, 4);
    (isArr ? forEach : forOwn)(object, function(value, index, object) {
      return callback(accumulator, value, index, object);
    });
  }
  return accumulator;
}

module.exports = transform;

},{"../collections/forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js","../functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","../internals/baseCreate":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreate.js","./forOwn":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/forOwn.js","./isArray":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isArray.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/values.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = require('./keys');

/**
 * Creates an array composed of the own enumerable property values of `object`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property values.
 * @example
 *
 * _.values({ 'one': 1, 'two': 2, 'three': 3 });
 * // => [1, 2, 3] (property order is not guaranteed across environments)
 */
function values(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

module.exports = values;

},{"./keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/support.js":[function(require,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('./internals/isNative');

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/**
 * An object used to flag environments features.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

/**
 * Detect if functions can be decompiled by `Function#toString`
 * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });

/**
 * Detect if `Function#name` is supported (all but IE).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcNames = typeof Function.name == 'string';

module.exports = support;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./internals/isNative":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/isNative.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'constant': require('./utilities/constant'),
  'createCallback': require('./functions/createCallback'),
  'escape': require('./utilities/escape'),
  'identity': require('./utilities/identity'),
  'mixin': require('./utilities/mixin'),
  'noConflict': require('./utilities/noConflict'),
  'noop': require('./utilities/noop'),
  'now': require('./utilities/now'),
  'parseInt': require('./utilities/parseInt'),
  'property': require('./utilities/property'),
  'random': require('./utilities/random'),
  'result': require('./utilities/result'),
  'template': require('./utilities/template'),
  'templateSettings': require('./utilities/templateSettings'),
  'times': require('./utilities/times'),
  'unescape': require('./utilities/unescape'),
  'uniqueId': require('./utilities/uniqueId')
};

},{"./functions/createCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/createCallback.js","./utilities/constant":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/constant.js","./utilities/escape":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/escape.js","./utilities/identity":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/identity.js","./utilities/mixin":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/mixin.js","./utilities/noConflict":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/noConflict.js","./utilities/noop":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/noop.js","./utilities/now":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/now.js","./utilities/parseInt":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/parseInt.js","./utilities/property":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/property.js","./utilities/random":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/random.js","./utilities/result":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/result.js","./utilities/template":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/template.js","./utilities/templateSettings":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/templateSettings.js","./utilities/times":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/times.js","./utilities/unescape":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/unescape.js","./utilities/uniqueId":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/uniqueId.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/constant.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'name': 'fred' };
 * var getter = _.constant(object);
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/escape.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var escapeHtmlChar = require('../internals/escapeHtmlChar'),
    keys = require('../objects/keys'),
    reUnescapedHtml = require('../internals/reUnescapedHtml');

/**
 * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
 * corresponding HTML entities.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} string The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('Fred, Wilma, & Pebbles');
 * // => 'Fred, Wilma, &amp; Pebbles'
 */
function escape(string) {
  return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
}

module.exports = escape;

},{"../internals/escapeHtmlChar":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/escapeHtmlChar.js","../internals/reUnescapedHtml":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/reUnescapedHtml.js","../objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/identity.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/mixin.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = require('../collections/forEach'),
    functions = require('../objects/functions'),
    isFunction = require('../objects/isFunction'),
    isObject = require('../objects/isObject');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * Adds function properties of a source object to the destination object.
 * If `object` is a function methods will be added to its prototype as well.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {Function|Object} [object=lodash] object The destination object.
 * @param {Object} source The object of functions to add.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
 * @example
 *
 * function capitalize(string) {
 *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
 * }
 *
 * _.mixin({ 'capitalize': capitalize });
 * _.capitalize('fred');
 * // => 'Fred'
 *
 * _('fred').capitalize().value();
 * // => 'Fred'
 *
 * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
 * _('fred').capitalize();
 * // => 'Fred'
 */
function mixin(object, source, options) {
  var chain = true,
      methodNames = source && functions(source);

  if (options === false) {
    chain = false;
  } else if (isObject(options) && 'chain' in options) {
    chain = options.chain;
  }
  var ctor = object,
      isFunc = isFunction(ctor);

  forEach(methodNames, function(methodName) {
    var func = object[methodName] = source[methodName];
    if (isFunc) {
      ctor.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            value = this.__wrapped__,
            args = [value];

        push.apply(args, arguments);
        var result = func.apply(object, args);
        if (chain || chainAll) {
          if (value === result && isObject(result)) {
            return this;
          }
          result = new ctor(result);
          result.__chain__ = chainAll;
        }
        return result;
      };
    }
  });
}

module.exports = mixin;

},{"../collections/forEach":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/collections/forEach.js","../objects/functions":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/functions.js","../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js","../objects/isObject":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isObject.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/noConflict.js":[function(require,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to restore the original `_` reference in `noConflict` */
var oldDash = global._;

/**
 * Reverts the '_' variable to its previous value and returns a reference to
 * the `lodash` function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @returns {Function} Returns the `lodash` function.
 * @example
 *
 * var lodash = _.noConflict();
 */
function noConflict() {
  global._ = oldDash;
  return this;
}

module.exports = noConflict;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/noop.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A no-operation function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // no operation performed
}

module.exports = noop;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/now.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('../internals/isNative');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var stamp = _.now();
 * _.defer(function() { console.log(_.now() - stamp); });
 * // => logs the number of milliseconds it took for the deferred function to be called
 */
var now = isNative(now = Date.now) && now || function() {
  return new Date().getTime();
};

module.exports = now;

},{"../internals/isNative":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/isNative.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/parseInt.js":[function(require,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isString = require('../objects/isString');

/** Used to detect and test whitespace */
var whitespace = (
  // whitespace
  ' \t\x0B\f\xA0\ufeff' +

  // line terminators
  '\n\r\u2028\u2029' +

  // unicode category "Zs" space separators
  '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
);

/** Used to match leading whitespace and zeros to be removed */
var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeParseInt = global.parseInt;

/**
 * Converts the given value into an integer of the specified radix.
 * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
 * `value` is a hexadecimal, in which case a `radix` of `16` is used.
 *
 * Note: This method avoids differences in native ES3 and ES5 `parseInt`
 * implementations. See http://es5.github.io/#E.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} value The value to parse.
 * @param {number} [radix] The radix used to interpret the value to parse.
 * @returns {number} Returns the new integer value.
 * @example
 *
 * _.parseInt('08');
 * // => 8
 */
var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
  // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
  return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
};

module.exports = parseInt;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objects/isString":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isString.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/property.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a "_.pluck" style function, which returns the `key` value of a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} key The name of the property to retrieve.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var characters = [
 *   { 'name': 'fred',   'age': 40 },
 *   { 'name': 'barney', 'age': 36 }
 * ];
 *
 * var getName = _.property('name');
 *
 * _.map(characters, getName);
 * // => ['barney', 'fred']
 *
 * _.sortBy(characters, getName);
 * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
 */
function property(key) {
  return function(object) {
    return object[key];
  };
}

module.exports = property;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/random.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = require('../internals/baseRandom');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMin = Math.min,
    nativeRandom = Math.random;

/**
 * Produces a random number between `min` and `max` (inclusive). If only one
 * argument is provided a number between `0` and the given number will be
 * returned. If `floating` is truey or either `min` or `max` are floats a
 * floating-point number will be returned instead of an integer.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {number} [min=0] The minimum possible value.
 * @param {number} [max=1] The maximum possible value.
 * @param {boolean} [floating=false] Specify returning a floating-point number.
 * @returns {number} Returns a random number.
 * @example
 *
 * _.random(0, 5);
 * // => an integer between 0 and 5
 *
 * _.random(5);
 * // => also an integer between 0 and 5
 *
 * _.random(5, true);
 * // => a floating-point number between 0 and 5
 *
 * _.random(1.2, 5.2);
 * // => a floating-point number between 1.2 and 5.2
 */
function random(min, max, floating) {
  var noMin = min == null,
      noMax = max == null;

  if (floating == null) {
    if (typeof min == 'boolean' && noMax) {
      floating = min;
      min = 1;
    }
    else if (!noMax && typeof max == 'boolean') {
      floating = max;
      noMax = true;
    }
  }
  if (noMin && noMax) {
    max = 1;
  }
  min = +min || 0;
  if (noMax) {
    max = min;
    min = 0;
  } else {
    max = +max || 0;
  }
  if (floating || min % 1 || max % 1) {
    var rand = nativeRandom();
    return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
  }
  return baseRandom(min, max);
}

module.exports = random;

},{"../internals/baseRandom":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseRandom.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/result.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('../objects/isFunction');

/**
 * Resolves the value of property `key` on `object`. If `key` is a function
 * it will be invoked with the `this` binding of `object` and its result returned,
 * else the property value is returned. If `object` is falsey then `undefined`
 * is returned.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {Object} object The object to inspect.
 * @param {string} key The name of the property to resolve.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = {
 *   'cheese': 'crumpets',
 *   'stuff': function() {
 *     return 'nonsense';
 *   }
 * };
 *
 * _.result(object, 'cheese');
 * // => 'crumpets'
 *
 * _.result(object, 'stuff');
 * // => 'nonsense'
 */
function result(object, key) {
  if (object) {
    var value = object[key];
    return isFunction(value) ? object[key]() : value;
  }
}

module.exports = result;

},{"../objects/isFunction":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/isFunction.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/template.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var defaults = require('../objects/defaults'),
    escape = require('./escape'),
    escapeStringChar = require('../internals/escapeStringChar'),
    keys = require('../objects/keys'),
    reInterpolate = require('../internals/reInterpolate'),
    templateSettings = require('./templateSettings'),
    values = require('../objects/values');

/** Used to match empty string literals in compiled template source */
var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match ES6 template delimiters
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to ensure capturing order of template delimiters */
var reNoMatch = /($^)/;

/** Used to match unescaped characters in compiled string literals */
var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

/**
 * A micro-templating method that handles arbitrary delimiters, preserves
 * whitespace, and correctly escapes quotes within interpolated code.
 *
 * Note: In the development build, `_.template` utilizes sourceURLs for easier
 * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
 *
 * For more information on precompiling templates see:
 * http://lodash.com/custom-builds
 *
 * For more information on Chrome extension sandboxes see:
 * http://developer.chrome.com/stable/extensions/sandboxingEval.html
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} text The template text.
 * @param {Object} data The data object used to populate the text.
 * @param {Object} [options] The options object.
 * @param {RegExp} [options.escape] The "escape" delimiter.
 * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
 * @param {Object} [options.imports] An object to import into the template as local variables.
 * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
 * @param {string} [sourceURL] The sourceURL of the template's compiled source.
 * @param {string} [variable] The data object variable name.
 * @returns {Function|string} Returns a compiled function when no `data` object
 *  is given, else it returns the interpolated text.
 * @example
 *
 * // using the "interpolate" delimiter to create a compiled template
 * var compiled = _.template('hello <%= name %>');
 * compiled({ 'name': 'fred' });
 * // => 'hello fred'
 *
 * // using the "escape" delimiter to escape HTML in data property values
 * _.template('<b><%- value %></b>', { 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // using the "evaluate" delimiter to generate HTML
 * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
 * _.template(list, { 'people': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
 * _.template('hello ${ name }', { 'name': 'pebbles' });
 * // => 'hello pebbles'
 *
 * // using the internal `print` function in "evaluate" delimiters
 * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
 * // => 'hello barney!'
 *
 * // using a custom template delimiters
 * _.templateSettings = {
 *   'interpolate': /{{([\s\S]+?)}}/g
 * };
 *
 * _.template('hello {{ name }}!', { 'name': 'mustache' });
 * // => 'hello mustache!'
 *
 * // using the `imports` option to import jQuery
 * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
 * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // using the `sourceURL` option to specify a custom sourceURL for the template
 * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
 *
 * // using the `variable` option to ensure a with-statement isn't used in the compiled template
 * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 *   var __t, __p = '', __e = _.escape;
 *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
 *   return __p;
 * }
 *
 * // using the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and a stack trace
 * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */
function template(text, data, options) {
  // based on John Resig's `tmpl` implementation
  // http://ejohn.org/blog/javascript-micro-templating/
  // and Laura Doktorova's doT.js
  // https://github.com/olado/doT
  var settings = templateSettings.imports._.templateSettings || templateSettings;
  text = String(text || '');

  // avoid missing dependencies when `iteratorTemplate` is not defined
  options = defaults({}, options, settings);

  var imports = defaults({}, options.imports, settings.imports),
      importsKeys = keys(imports),
      importsValues = values(imports);

  var isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '";

  // compile the regexp to match each delimiter
  var reDelimiters = RegExp(
    (options.escape || reNoMatch).source + '|' +
    interpolate.source + '|' +
    (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
    (options.evaluate || reNoMatch).source + '|$'
  , 'g');

  text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);

    // escape characters that cannot be included in string literals
    source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

    // replace delimiters with snippets
    if (escapeValue) {
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;

    // the JS engine embedded in Adobe products requires returning the `match`
    // string in order to produce the correct `offset` value
    return match;
  });

  source += "';\n";

  // if `variable` is not specified, wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain
  var variable = options.variable,
      hasVariable = variable;

  if (!hasVariable) {
    variable = 'obj';
    source = 'with (' + variable + ') {\n' + source + '\n}\n';
  }
  // cleanup code by stripping empty strings
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
    .replace(reEmptyStringMiddle, '$1')
    .replace(reEmptyStringTrailing, '$1;');

  // frame code as the function body
  source = 'function(' + variable + ') {\n' +
    (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
    "var __t, __p = '', __e = _.escape" +
    (isEvaluating
      ? ', __j = Array.prototype.join;\n' +
        "function print() { __p += __j.call(arguments, '') }\n"
      : ';\n'
    ) +
    source +
    'return __p\n}';

  try {
    var result = Function(importsKeys, 'return ' + source ).apply(undefined, importsValues);
  } catch(e) {
    e.source = source;
    throw e;
  }
  if (data) {
    return result(data);
  }
  // provide the compiled function's source by its `toString` method, in
  // supported environments, or the `source` property as a convenience for
  // inlining compiled templates during the build process
  result.source = source;
  return result;
}

module.exports = template;

},{"../internals/escapeStringChar":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/escapeStringChar.js","../internals/reInterpolate":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/reInterpolate.js","../objects/defaults":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/defaults.js","../objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js","../objects/values":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/values.js","./escape":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/escape.js","./templateSettings":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/templateSettings.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/templateSettings.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var escape = require('./escape'),
    reInterpolate = require('../internals/reInterpolate');

/**
 * By default, the template delimiters used by Lo-Dash are similar to those in
 * embedded Ruby (ERB). Change the following template settings to use alternative
 * delimiters.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var templateSettings = {

  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'escape': /<%-([\s\S]+?)%>/g,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'evaluate': /<%([\s\S]+?)%>/g,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type string
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type Object
   */
  'imports': {

    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type Function
     */
    '_': { 'escape': escape }
  }
};

module.exports = templateSettings;

},{"../internals/reInterpolate":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/reInterpolate.js","./escape":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/escape.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/times.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('../internals/baseCreateCallback');

/**
 * Executes the callback `n` times, returning an array of the results
 * of each callback execution. The callback is bound to `thisArg` and invoked
 * with one argument; (index).
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {number} n The number of times to execute the callback.
 * @param {Function} callback The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns an array of the results of each `callback` execution.
 * @example
 *
 * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
 * // => [3, 6, 4]
 *
 * _.times(3, function(n) { mage.castSpell(n); });
 * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
 *
 * _.times(3, function(n) { this.cast(n); }, mage);
 * // => also calls `mage.castSpell(n)` three times
 */
function times(n, callback, thisArg) {
  n = (n = +n) > -1 ? n : 0;
  var index = -1,
      result = Array(n);

  callback = baseCreateCallback(callback, thisArg, 1);
  while (++index < n) {
    result[index] = callback(index);
  }
  return result;
}

module.exports = times;

},{"../internals/baseCreateCallback":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/baseCreateCallback.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/unescape.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = require('../objects/keys'),
    reEscapedHtml = require('../internals/reEscapedHtml'),
    unescapeHtmlChar = require('../internals/unescapeHtmlChar');

/**
 * The inverse of `_.escape` this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
 * corresponding characters.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} string The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('Fred, Barney &amp; Pebbles');
 * // => 'Fred, Barney & Pebbles'
 */
function unescape(string) {
  return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
}

module.exports = unescape;

},{"../internals/reEscapedHtml":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/reEscapedHtml.js","../internals/unescapeHtmlChar":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/internals/unescapeHtmlChar.js","../objects/keys":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/keys.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/utilities/uniqueId.js":[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to generate unique IDs */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} [prefix] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return String(prefix == null ? '' : prefix) + id;
}

module.exports = uniqueId;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mithril/mithril.js":[function(require,module,exports){
var m = (function app(window, undefined) {
	var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window){
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);


	/*
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/*
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m() {
		var args = [].slice.call(arguments);
		var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1]) && !("subtree" in args[1]);
		var attrs = hasAttrs ? args[1] : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
		while (match = parser.exec(args[0])) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");


		var children = hasAttrs ? args[2] : args[1];
		if (type.call(children) === ARRAY) {
			cell.children = children
		}
		else {
			cell.children = hasAttrs ? args.slice(2) : args.slice(1)
		}

		for (var attrName in attrs) {
			if (attrName === classAttrName) cell.attrs[attrName] = (cell.attrs[attrName] || "") + " " + attrs[attrName];
			else cell.attrs[attrName] = attrs[attrName]
		}
		return cell
	}
	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element

		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		if (data == null || data.toString() == null) data = "";
		if (data.subtree === "retain") return cached;
		var cachedType = type.call(cached), dataType = type.call(data);
		if (cached == null || cachedType !== dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex;
					var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
				}
				else if (cached.nodes) clear(cached.nodes, cached)
			}
			cached = new data.constructor;
			if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
			cached.nodes = []
		}

		if (dataType === ARRAY) {
			//recursively flatten array
			for (var i = 0, len = data.length; i < len; i++) {
				if (type.call(data[i]) === ARRAY) {
					data = data.concat.apply([], data);
					i-- //check current index again and flatten until there are no more nested arrays at that index
				}
			}
			
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			//5) copy unkeyed items into their respective gaps
			var DELETION = 1, INSERTION = 2 , MOVE = 3;
			var existing = {}, unkeyed = [], shouldMaintainIdentities = false;
			for (var i = 0, len = cached.length; i < len; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true;
					existing[cached[i].attrs.key] = {action: DELETION, index: i}
				}
			}
			if (shouldMaintainIdentities) {
				if (data.indexOf(null) > -1) data = data.filter(function(x) {return x != null})
				for (var i = 0, len = data.length; i < len; i++) {
					if (data[i] && data[i].attrs) {
						if (data[i].attrs.key != null) {
							var key = data[i].attrs.key;
							if (!existing[key]) existing[key] = {action: INSERTION, index: i};
							else existing[key] = {
								action: MOVE,
								index: i,
								from: existing[key].index,
								element: parentElement.childNodes[existing[key].index] || $document.createElement("div")
							}
						}
						else unkeyed.push({index: i, element: parentElement.childNodes[i] || $document.createElement("div")})
					}
				}
				var actions = Object.keys(existing).map(function(key) {return existing[key]});
				var changes = actions.sort(function(a, b) {return a.action - b.action || a.index - b.index});
				var newCached = cached.slice();

				for (var i = 0, change; change = changes[i]; i++) {
					if (change.action === DELETION) {
						clear(cached[change.index].nodes, cached[change.index]);
						newCached.splice(change.index, 1)
					}
					if (change.action === INSERTION) {
						var dummy = $document.createElement("div");
						dummy.key = data[change.index].attrs.key;
						parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
						newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
					}

					if (change.action === MOVE) {
						if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
							parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
						}
						newCached[change.index] = cached[change.from]
					}
				}
				for (var i = 0, len = unkeyed.length; i < len; i++) {
					var change = unkeyed[i];
					parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null);
					newCached[change.index] = cached[change.index]
				}
				cached = newCached;
				cached.nodes = [];
				for (var i = 0, child; child = parentElement.childNodes[i]; i++) cached.nodes.push(child)
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
				if (item === undefined) continue;
				if (!item.nodes.intact) intact = false;
				if (item.$trusted) {
					//fix offset of next element if item was a trusted string w/ more than one html element
					//the first clause in the regexp matches elements
					//the second clause (after the pipe) matches text nodes
					subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || []).length
				}
				else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself
				
				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0, len = data.length; i < len; i++) {
					if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				if (data.length < cached.length) cached.length = data.length;
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType === OBJECT) {
			if (!data.attrs) data.attrs = {};
			if (!cached.attrs) cached.attrs = {};

			var dataAttrKeys = Object.keys(data.attrs);
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || dataAttrKeys.join() != Object.keys(cached.attrs).join() || data.attrs.id != cached.attrs.id) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
			}
			if (type.call(data.tag) != STRING) return;

			var node, isNew = cached.nodes.length === 0;
			if (data.attrs.xmlns) namespace = data.attrs.xmlns;
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
			if (isNew) {
				if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
				else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
				cached = {
					tag: data.tag,
					//set attributes first, then create children
					attrs: dataAttrKeys.length ? setAttributes(node, data.tag, data.attrs, {}, namespace) : {},
					children: data.children != null && data.children.length > 0 ?
						build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
						data.children,
					nodes: [node]
				};
				if (cached.children && !cached.children.nodes) cached.children.nodes = [];
				//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
				if (data.tag === "select" && data.attrs.value) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0];
				if (dataAttrKeys.length) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
				cached.nodes.intact = true;
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === FUNCTION) {
				var context = cached.configContext = cached.configContext || {};

				// bind
				var callback = function(data, args) {
					return function() {
						return data.attrs["config"].apply(data, args)
					}
				};
				configs.push(callback(data, [node, !isNew, context, cached]))
			}
		}
		else if (typeof dataType != FUNCTION) {
			//handle text nodes
			var nodes;
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [$document.createTextNode(data)];
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes;
				if (!editable || editable !== $document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached);
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data;
						else if (editable) editable.innerHTML = data;
						else {
							if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached);
								nodes = [$document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data);
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				try {
					//`config` isn't a real attributes, so ignore it
					//we don't ignore `key` because it must be unique and having it on the DOM helps debugging
					if (attrName === "config") continue;
					//hook event handlers to the auto-redrawing system
					else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
						node[attrName] = autoredraw(dataAttr, node)
					}
					//handle `style: {...}`
					else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
						for (var rule in dataAttr) {
							if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
						}
						for (var rule in cachedAttr) {
							if (!(rule in dataAttr)) node.style[rule] = ""
						}
					}
					//handle SVG
					else if (namespace != null) {
						if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
						else if (attrName === "className") node.setAttribute("class", dataAttr);
						else node.setAttribute(attrName, dataAttr)
					}
					//handle cases that are properties (but ignore cases where we should use setAttribute instead)
					//- list and form are typically used as strings, but are DOM element references in js
					//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
					else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type")) {
						//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
						if (attrName != "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
					}
					else node.setAttribute(attrName, dataAttr)
				}
				catch (e) {
					//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr
			}
		}
		return cachedAttrs
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {nodes[i].parentNode.removeChild(nodes[i])}
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0
	}
	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload();
		if (cached.children) {
			if (type.call(cached.children) === ARRAY) {
				for (var i = 0, child; child = cached.children[i]; i++) unload(child)
			}
			else if (cached.children.tag) unload(cached.children)
		}
	}
	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder)
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data)
		}
		else parentElement.insertAdjacentHTML("beforeend", data);
		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++
		}
		return nodes
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try {return callback.call(object, e)}
			finally {
				endFirstComputation()
			}
		}
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		for (var i = 0, len = configs.length; i < len; i++) configs[i]()
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store
		};

		prop.toJSON = function() {
			return store
		};

		return prop
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
			return propify(store)
		}

		return gettersetter(store)
	};

	var roots = [], modules = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePostRedrawHook = null, prevented = false, topModule;
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	m.module = function(root, module) {
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;
		var isPrevented = false;
		if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
			var event = {
				preventDefault: function() {isPrevented = true}
			};
			controllers[index].onunload(event)
		}
		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			var currentModule = topModule = module;
			var controller = new module.controller;
			//controllers may call m.module recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.module call is applied
			if (currentModule === topModule) {
				controllers[index] = controller;
				modules[index] = module
			}
			endFirstComputation();
			return controllers[index]
		}
	};
	m.redraw = function(force) {
		//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
		//lastRedrawID is null if it's the first redraw and not an event handler
		if (lastRedrawId && force !== true) {
			//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
			//when rAF: always reschedule redraw
			if (new Date - lastRedrawCallTime > FRAME_BUDGET || $requestAnimationFrame === window.requestAnimationFrame) {
				if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
				lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
			}
		}
		else {
			redraw();
			lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
		}
	};
	m.redraw.strategy = m.prop();
	function redraw() {
		var forceRedraw = m.redraw.strategy() === "all";
		for (var i = 0, root; root = roots[i]; i++) {
			if (controllers[i]) {
				m.render(root, modules[i].view(controllers[i]), forceRedraw)
			}
		}
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0;
	m.startComputation = function() {pendingRequests++};
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0);
		if (pendingRequests === 0) m.redraw()
	};
	var endFirstComputation = function() {
		if (m.redraw.strategy() == "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = function() {}, routeParams, currentRoute;
	m.route = function() {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, router, path)) {
					m.route(defaultRoute, true)
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				if (currentRoute != normalizeRoute($location[m.route.mode])) {
					redirect($location[m.route.mode])
				}
			};
			computePostRedrawHook = setScroll;
			window[listener]()
		}
		//config: m.route
		else if (arguments[0].addEventListener) {
			var element = arguments[0];
			var isInitialized = arguments[1];
			var context = arguments[2];
			element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + this.attrs.href;
			element.removeEventListener("click", routeUnobtrusive);
			element.addEventListener("click", routeUnobtrusive)
		}
		//m.route(route, params)
		else if (type.call(arguments[0]) === STRING) {
			currentRoute = arguments[0];
			var args = arguments[1] || {}
			var queryIndex = currentRoute.indexOf("?")
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
			for (var i in args) params[i] = args[i]
			var querystring = buildQueryString(params)
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true;

			if (window.history.pushState) {
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
					setScroll()
				};
				redirect(modes[m.route.mode] + currentRoute)
			}
			else $location[m.route.mode] = currentRoute
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
		return routeParams[key]
	};
	m.route.mode = "search";
	function normalizeRoute(route) {return route.slice(modes[m.route.mode].length)}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart)
		}

		for (var route in router) {
			if (route === path) {
				m.module(root, router[route]);
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.module(root, router[route])
				});
				return true
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;
		if (e.ctrlKey || e.metaKey || e.which === 2) return;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		var currentTarget = e.currentTarget || this;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
	}
	function setScroll() {
		if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0)
	}
	function buildQueryString(object, prefix) {
		var str = [];
		for(var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop, value = object[prop];
			str.push(value != null && type.call(value) === OBJECT ? buildQueryString(value, key) : encodeURIComponent(key) + "=" + encodeURIComponent(value))
		}
		return str.join("&")
	}
	function parseQueryString(str) {
		var pairs = str.split("&"), params = {};
		for (var i = 0, len = pairs.length; i < len; i++) {
			var pair = pairs[i].split("=");
			params[decodeSpace(pair[0])] = pair[1] ? decodeSpace(pair[1]) : ""
		}
		return params
	}
	function decodeSpace(string) {
		return decodeURIComponent(string.replace(/\+/g, " "))
	}
	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred
	};
	function propify(promise) {
		var prop = m.prop();
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject))
		};
		return prop
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self["promise"] = {};

		self["resolve"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire()
			}
			return this
		};

		self["reject"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire()
			}
			return this
		};

		self.promise["then"] = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback);
			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue)
			}
			else {
				next.push(deferred)
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
			})
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback()
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback()
					})
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback()
				}
			} else {
				notThennableCallback()
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire()
			}
			thennable(then, function() {
				state = RESOLVING;
				fire()
			}, function() {
				state = REJECTING;
				fire()
			}, function() {
				try {
					if (state === RESOLVING && typeof successCallback === FUNCTION) {
						promiseValue = successCallback(promiseValue)
					}
					else if (state === REJECTING && typeof failureCallback === "function") {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish()
				}
				else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
	};

	m.sync = function(args) {
		var method = "resolve";
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve([]);

		return deferred.promise
	};
	function identity(value) {return value}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				$document.body.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined
			};

			script.onerror = function(e) {
				$document.body.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({error: "Error making jsonp request"})
					}
				});
				window[callbackKey] = undefined;

				return false
			};

			script.onload = function(e) {
				return false
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script)
		}
		else {
			var xhr = new window.XMLHttpRequest;
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr})
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (typeof options.config === FUNCTION) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data
			if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
				throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
			}
			xhr.send(data);
			return xhr
		}
	}
	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				url = url.replace(tokens[i], data[key]);
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = m.deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		};
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)));
				if (e.type === "load") {
					if (type.call(response) === ARRAY && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type === "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		};
		ajax(xhrOptions);
		deferred.promise(xhrOptions.initialValue);
		return deferred.promise
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m
})(typeof window != "undefined" ? window : {});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() {return m});

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js":[function(require,module,exports){
/*
 * button.js - the base of all buttons
 *
 * All buttons share two elements: a function, the callback of the button
 * and a DOM element.
 *
 * If the callback function returns a promise, the button will
 * keep is active state until the promise is resolved;
 */

"use strict";

var lock = false;

var Button = function Button (options) {
    options = options || {};

    /* the callback function */
    this.f = null;
    /* the dom element representing the button */
    this.el = null;

    /* the state of the button */
    this.binded = false;
    this.active = false;
    this.monotouchable = false;

    /* whether to set active class or not */
    this.setActiveCls = true;
    /* default active css class*/
    this.activeCls = 'active';

    if(options.setActiveCls) this.setActiveCls = options.setActiveCls;
    if(typeof options.activeCls === 'string') this.activeCls = options.activeCls;
    if(options.el instanceof HTMLElement) this.el = options.el;
    if(typeof options.f === 'function') this.f = options.f;
    if(options.monotouchable) this.monotouchable = options.monotouchable;
    if(options.autobind !== false) this.bind();
};

Button.prototype.setEl = function (el) {
    if(this.active) throw new Error("Can't change dom element, button is active.");
    if(this.binded) this.unbind();
    if(el instanceof HTMLElement) {
        this.el = el;
        return this;
    }
    else {
        throw new Error("Button setEl method needs a dom element as argument.");
    }
};

Button.prototype._addCls = function () {
    if (!this.el.classList.contains(this.activeCls))
        this.el.classList.add(this.activeCls);
};

Button.prototype._removeCls = function () {
    if (this.el.classList.contains(this.activeCls))
        this.el.classList.remove(this.activeCls);
};

Button.prototype.setActive = function (active) {
    if (this.setActiveCls) {
        if (active) this._addCls();
        else this._removeCls();
    }
    this.active = active;
    return this;
};

Button.prototype.lock = function () {
    if(this.monotouchable) lock = true;
    return this;
};

Button.prototype.unlock = function () {
    if(this.monotouchable) lock = false;
    return this;
};

Button.prototype.isLocked = function () {
    return lock;
};

Button.prototype.setF = function (f) {
    if (typeof f !== 'function')
        throw new Error("Button setF method needs a f function as argument.");
    this.f = f;
    return this;
};

/* impl. not completed, a child will redefine the bind method, call this one and set this.binded to true*/
Button.prototype.bind = function () {
    if(!this.el || !this.f) throw new Error("Can't bind an uninitialized button.");
    if(this.binded) throw new Error("Can't bind an already binded button.");
    return this;
};

/* impl. not completed, a child will redefine the bind method, call this one and set this.binded to false*/
Button.prototype.unbind = function () {
    if(!this.el || !this.f) throw new Error("Can't unbind an uninitialized button.");
    if(!this.binded) throw new Error("Can't unbind a unbinded button.");
    return this;
};

module.exports = Button;

},{}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/index.js":[function(require,module,exports){
/*
 * index.js - mobile-button module
 */

"use strict";

var MousedownButton = require('./mouse/default/mousedown-button'),
    MouseupButton = require('./mouse/default/mouseup-button'),
    MouseupOnScrollableYButton = require('./mouse/scrollable-y/mouseup-button'),
    MouseupOnScrollableXButton = require('./mouse/scrollable-x/mouseup-button'),
    MousePushButton = require('./mouse/default/mouse-push-button'),

    TouchstartButton = require('./touch/default/touchstart-button'),
    TouchendButton = require('./touch/default/touchend-button'),
    TouchendOnScrollableYButton = require('./touch/scrollable-y/touchend-button'),
    TouchendOnScrollableXButton = require('./touch/scrollable-x/touchend-button'),
    TouchPushButton = require('./touch/default/touch-push-button'),

    PointerdownButton = require('./pointer/default/pointerdown-button'),
    PointerupButton = require('./pointer/default/pointerup-button'),
    PointerupOnScrollableYButton = require('./pointer/scrollable-y/pointerup-button'),
    PointerupOnScrollableXButton = require('./pointer/scrollable-x/pointerup-button'),
    PointerPushButton = require('./pointer/default/pointer-push-button'),

    touchable = 'ontouchstart' in window,
    pointable = !!window.MSPointerEvent || !!window.PointerEvent;

module.exports = {
    Touchstart : touchable ? TouchstartButton : (pointable ? PointerdownButton : MousedownButton),
    Touchend : touchable ? TouchendButton : (pointable ? PointerupButton : MouseupButton),
    ScrollableY : {
        Touchend : touchable ? TouchendOnScrollableYButton : (pointable ? PointerupOnScrollableYButton : MouseupOnScrollableYButton)
    },
    ScrollableX : {
        Touchend : touchable ? TouchendOnScrollableXButton : (pointable ? PointerupOnScrollableXButton : MouseupOnScrollableXButton)
    },
    Push : touchable ? TouchPushButton : (pointable ? PointerPushButton : MousePushButton)
};

},{"./mouse/default/mouse-push-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/default/mouse-push-button.js","./mouse/default/mousedown-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/default/mousedown-button.js","./mouse/default/mouseup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/default/mouseup-button.js","./mouse/scrollable-x/mouseup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/scrollable-x/mouseup-button.js","./mouse/scrollable-y/mouseup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/scrollable-y/mouseup-button.js","./pointer/default/pointer-push-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/default/pointer-push-button.js","./pointer/default/pointerdown-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/default/pointerdown-button.js","./pointer/default/pointerup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/default/pointerup-button.js","./pointer/scrollable-x/pointerup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/scrollable-x/pointerup-button.js","./pointer/scrollable-y/pointerup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/scrollable-y/pointerup-button.js","./touch/default/touch-push-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/default/touch-push-button.js","./touch/default/touchend-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/default/touchend-button.js","./touch/default/touchstart-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/default/touchstart-button.js","./touch/scrollable-x/touchend-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/scrollable-x/touchend-button.js","./touch/scrollable-y/touchend-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/scrollable-y/touchend-button.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/default/mouse-push-button.js":[function(require,module,exports){
/*
 * default/mouse-push-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var MousePushButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.delay = options.delay > 0 ? options.delay : 0;
    this.g = null;
    if(typeof options.g === 'function') this.g = options.g;
    this.promisef = null;
    this.boundaries = { minX : 0, maxX : 0, minY : 0, maxY : 0 };
    this.leftOrEnded = false;
};

MousePushButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

MousePushButton.prototype.constructor = MousePushButton;

MousePushButton.prototype.setG = function (g) {
    if (typeof g !== 'function')
        throw new Error("Button setG method needs a g function as argument.");
    this.g = g;
    return this;
};

MousePushButton.prototype._isInActiveZone = function (touch) {
    var x = touch.clientX,
        y = touch.clientY,
        b = this.boundaries;
    return x < b.maxX && x > b.minX && y < b.maxY && y > b.minY;
};

MousePushButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    this.el.addEventListener('mousedown', this, false);
    this.binded = true;
    return this;
};

MousePushButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    this.el.removeEventListener('mousedown', this, false);
    this.binded = false;
    return this;
};

MousePushButton.prototype.handleEvent = function (evt) {
    switch (evt.type) {
        case 'mousedown':
            this.onMousedown(evt);
            break;
        case 'mousemove':
            this.onMousemove(evt);
            break;
        case 'mouseup':
            this.onMouseup(evt);
            break;
    }
};

MousePushButton.prototype.onMousedown = function (evt) {
    if (!this.active) {
        if (evt.button === 0) {
            evt.preventDefault();
            this.setActive(true);
            var boundingRect = this.el.getBoundingClientRect();
            this.boundaries.minX = boundingRect.left;
            this.boundaries.maxX = boundingRect.left + boundingRect.width;
            this.boundaries.minY = boundingRect.top;
            this.boundaries.maxY = boundingRect.bottom;
            this.el.ownerDocument.addEventListener('mousemove', this, false);
            this.el.ownerDocument.addEventListener('mouseup', this, false);
            this.promisef = Q.delay(evt, this.delay).then(this.f);
        }
    }
};

MousePushButton.prototype.onMousemove = function (evt) {
    if(this.active && !this.leftOrEnded) {
        evt.preventDefault();
        if (!this._isInActiveZone(evt))
            this.onMouseup(evt);
    }
};

MousePushButton.prototype.onMouseup = function (evt) {
    if(this.active && !this.leftOrEnded) {
        this._removeCls();
        this.leftOrEnded = true;
        this.promisef
                .then(evt)
                .then(this.g)
                .finally(this._done(evt))
                .done();
    }
};

MousePushButton.prototype._done = function (evt) {
    var btn = this;
    return function () {
        btn.setActive(false);
        btn.leftOrEnded = false;
        btn.el.ownerDocument.removeEventListener('mousemove', btn, false);
        btn.el.ownerDocument.removeEventListener('mouseup', btn, false);
    };
};

module.exports = MousePushButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/default/mousedown-button.js":[function(require,module,exports){
/*
 * default/mousedown-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var MousedownButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.delay = options.delay > 0 ? options.delay : 0;
};

MousedownButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

MousedownButton.prototype.constructor = MousedownButton;

MousedownButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    this.el.addEventListener('mousedown', this, false);
    this.binded = true;
    return this;
};

MousedownButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    this.el.removeEventListener('mousedown', this, false);
    this.binded = false;
    return this;
};

MousedownButton.prototype.handleEvent = function (evt) {
    switch(evt.type) {
        case 'mousedown':
            this.onMousedown(evt);
            break;
    }
};

function _done(btn) {
    return function () { btn.setActive(false); };
};

MousedownButton.prototype.onMousedown = function (evt) {
    if (!this.active) {
        if (evt.button === 0) {
            var btn = this;
            btn.setActive(true);
            Q.delay(evt, btn.delay).then(btn.f).finally(_done(btn)).done();
        }
    }
};

module.exports = MousedownButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/default/mouseup-button.js":[function(require,module,exports){
/*
 * default/mouseup-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var MouseupButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.activeBorder = options.activeBorder || 50;
    this.boundaries = { minX : 0, maxX : 0, minY : 0, maxY : 0 };
    this.clicked = false;
};

MouseupButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

MouseupButton.prototype.constructor = MouseupButton;

MouseupButton.prototype.setActiveBorder = function (len) {
    this.activeBorder = len;
};

MouseupButton.prototype._isInActiveZone = function (evt) {
    var x = evt.clientX,
        y = evt.clientY,
        b = this.boundaries;
    return x < b.maxX && x > b.minX && y < b.maxY && y > b.minY;
};

MouseupButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    this.el.addEventListener('mousedown', this, false);
    this.binded = true;
    return this;
};

MouseupButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    this.el.removeEventListener('mousedown', this, false);
    this.binded = false;
    return this;
};

MouseupButton.prototype.handleEvent = function (evt) {
    switch (evt.type) {
        case 'mousedown':
            this.onMousedown(evt);
            break;
        case 'mousemove':
            this.onMousemove(evt);
            break;
        case 'mouseup':
            this.onMouseup(evt);
            break;
    }
};

MouseupButton.prototype.onMousedown = function (evt) {
    if (!this.active) {
        if (evt.button === 0) {
            evt.preventDefault();
            this.setActive(true);
            this.triggerOnMouseup = true;
            var boundingRect = this.el.getBoundingClientRect();
            this.boundaries.minX = boundingRect.left - this.activeBorder;
            this.boundaries.maxX = boundingRect.left + boundingRect.width + this.activeBorder;
            this.boundaries.minY = boundingRect.top - this.activeBorder;
            this.boundaries.maxY = boundingRect.bottom +  this.activeBorder;
            this.el.ownerDocument.addEventListener('mousemove', this, false);
            this.el.ownerDocument.addEventListener('mouseup', this, false);
        }
    }
};

MouseupButton.prototype.onMousemove = function (evt) {
    if (this.active && !this.clicked) {
        if (this._isInActiveZone(evt)) {
            this.triggerOnMouseup = true;
            this._addCls();
        } else {
            this.triggerOnMouseup = false;
            this._removeCls();
        }
    }
};

MouseupButton.prototype._done = function (evt) {
    var btn = this;
    return function () { btn.onMousecancel(evt); };
};

MouseupButton.prototype.onMouseup = function (evt) {
    if (this.active) {
        if (this.triggerOnMouseup) {
            var btn = this;
            btn._removeCls();
            btn.clicked = true;
            Q(evt).then(btn.f).finally(btn._done(evt)).done();
        } else {
            this.onMousecancel(evt);
        }
    }
};

MouseupButton.prototype.onMousecancel = function (evt) {
    this._removeCls();
    if (this.active) this.active = false;
    if (this.clicked) this.clicked = false;
    this.el.ownerDocument.removeEventListener('mousemove', this, false);
    this.el.ownerDocument.removeEventListener('mouseup', this, false);
};

module.exports = MouseupButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/scrollable-x/mouseup-button.js":[function(require,module,exports){
/*
 * scrollable-x/mouseup-button.js
 */

"use strict";

var MouseupButton = require('./../default/mouseup-button');

var MouseupOnScrollableXButton = function (options) {
    MouseupButton.prototype.constructor.call(this, options);
    this.tolerance = options.tolerance || 10;
};

MouseupOnScrollableXButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(MouseupButton.prototype);

MouseupOnScrollableXButton.prototype.constructor = MouseupOnScrollableXButton;

MouseupOnScrollableXButton.prototype.onMousedown = function (evt) {
    if (!this.active) this.startX = evt.clientX;
    MouseupButton.prototype.onMousedown.call(this, evt);
};

MouseupOnScrollableXButton.prototype._isInActiveZone = function (evt) {
    var y = evt.clientY,
        d = Math.abs(evt.clientX - this.startX),
        b = this.boundaries;
    return y < b.maxY && y > b.minY && d < this.tolerance;
};

MouseupOnScrollableXButton.prototype.onMousemove = function (evt) {
    if (this.active) {
        if (this._isInActiveZone(evt)) this._addCls();
        else this.onMousecancel.call(this, evt);
    }
};

module.exports = MouseupOnScrollableXButton;

},{"./../default/mouseup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/default/mouseup-button.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/scrollable-y/mouseup-button.js":[function(require,module,exports){
/*
 * scrollable-y/mouseup-button.js
 */

"use strict";

var MouseupButton = require('./../default/mouseup-button');

var MouseupOnScrollableYButton = function (options) {
    MouseupButton.prototype.constructor.call(this, options);
    this.tolerance = options.tolerance || 10;
};

MouseupOnScrollableYButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(MouseupButton.prototype);

MouseupOnScrollableYButton.prototype.constructor = MouseupOnScrollableYButton;

MouseupOnScrollableYButton.prototype.onMousedown = function (evt) {
    if (!this.active) this.startY = evt.clientY;
    MouseupButton.prototype.onMousedown.call(this, evt);
};

MouseupOnScrollableYButton.prototype._isInActiveZone = function (evt) {
    var x = evt.clientX,
        d = Math.abs(evt.clientY - this.startY),
        b = this.boundaries;
    return x < b.maxX && x > b.minX && d < this.tolerance;
};

MouseupOnScrollableYButton.prototype.onMousemove = function (evt) {
    if (this.active) {
        if (this._isInActiveZone(evt)) this._addCls();
        else this.onMousecancel.call(this, evt);
    }
};

module.exports = MouseupOnScrollableYButton;

},{"./../default/mouseup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/mouse/default/mouseup-button.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/default/pointer-push-button.js":[function(require,module,exports){
/*
 * default/pointer-push-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var PointerPushButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.delay = options.delay > 0 ? options.delay : 0;
    this.g = null;
    if(typeof options.g === 'function') this.g = options.g;
    this.promisef = null;
    this.boundaries = { minX : 0, maxX : 0, minY : 0, maxY : 0 };
    this.leftOrEnded = false;
    this.pointerId = null;
};

PointerPushButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

PointerPushButton.prototype.constructor = PointerPushButton;

PointerPushButton.prototype.setG = function (g) {
    if (typeof g !== 'function')
        throw new Error("Button setG method needs a g function as argument.");
    this.g = g;
    return this;
};

PointerPushButton.prototype._isDownPointerId = function (pointerId) {
    return this.pointerId === pointerId;
};

PointerPushButton.prototype._isInActiveZone = function (evt) {
    var x = evt.clientX,
        y = evt.clientY,
        b = this.boundaries;
    return x < b.maxX && x > b.minX && y < b.maxY && y > b.minY;
};

PointerPushButton.prototype._setPointerCapture = function (pointerId) {
    if (window.MSPointerEvent)
        this.el.msSetPointerCapture(pointerId);
    else
        this.el.setPointerCapture(pointerId);
};

PointerPushButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    if (window.MSPointerEvent) {
        this.el.addEventListener('MSPointerDown', this, false);
        this.el.addEventListener('MSPointerMove', this, false);
        this.el.addEventListener('MSPointerUp', this, false);
        this.el.addEventListener('MSPointerCancel', this, false);
    } else {
        this.el.addEventListener('pointerdown', this, false);
        this.el.addEventListener('pointermove', this, false);
        this.el.addEventListener('pointerup', this, false);
        this.el.addEventListener('pointercancel', this, false);
    }
    this.binded = true;
    return this;
};

PointerPushButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    if (window.MSPointerEvent) {
        this.el.removeEventListener('MSPointerDown', this, false);
        this.el.removeEventListener('MSPointerMove', this, false);
        this.el.removeEventListener('MSPointerUp', this, false);
        this.el.removeEventListener('MSPointerCancel', this, false);
    } else {
        this.el.removeEventListener('pointerdown', this, false);
        this.el.removeEventListener('pointermove', this, false);
        this.el.removeEventListener('pointerup', this, false);
        this.el.removeEventListener('pointercancel', this, false);
    }
    this.binded = false;
    return this;
};

PointerPushButton.prototype.handleEvent = function (evt) {
    switch (evt.type) {
        case 'MSPointerDown':
        case 'pointerdown':
            this.onPointerdown(evt);
            break;
        case 'MSPointerMove':
        case 'pointermove':
            this.onPointermove(evt);
            break;
        case 'MSPointerUp':
        case 'pointerup':
            this.onPointerup(evt);
            break;
        case 'MSPointerCancel':
        case 'pointercancel':
            this.onPointercancel(evt);
            break;
    }
};

PointerPushButton.prototype.onPointerdown = function (evt) {
    if(!this.active && (!this.monotouchable || !this.isLocked())) {
        if(this.monotouchable) this.lock();
        this.setActive(true);
        this.pointerId = evt.pointerId;
        this._setPointerCapture(evt.pointerId);
        var boundingRect = this.el.getBoundingClientRect();
        this.boundaries.minX = boundingRect.left;
        this.boundaries.maxX = boundingRect.left + boundingRect.width;
        this.boundaries.minY = boundingRect.top;
        this.boundaries.maxY = boundingRect.bottom;
        this.promisef = Q.delay(evt, this.delay).then(this.f);
    }
};

PointerPushButton.prototype.onPointermove = function (evt) {
    if (this.active && !this.leftOrEnded) {
        if (this._isDownPointerId(evt.pointerId)) {
            evt.preventDefault();
            if (!this._isInActiveZone(evt)) {
                this._removeCls();
                this.leftOrEnded = true;
                this.promisef
                        .then(evt)
                        .then(this.g)
                        .finally(this._done(evt))
                        .done();
            }
        }
    }
};

PointerPushButton.prototype._done = function (evt) {
    var btn = this;
    return function () {
        if(btn.monotouchable) btn.unlock();
        btn.onPointercancel(evt);
    };
};

PointerPushButton.prototype.onPointerup = function (evt) {
    if (this.active && !this.leftOrEnded) {
        if (this._isDownPointerId(evt.pointerId)) {
            this._removeCls();
            this.leftOrEnded = true;
            this.promisef
                    .then(evt)
                    .then(this.g)
                    .finally(this._done(evt))
                    .done();
        }
    }
};

PointerPushButton.prototype.onPointercancel = function (evt) {
    this.setActive(false);
    this.leftOrEnded = false;
};

module.exports = PointerPushButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/default/pointerdown-button.js":[function(require,module,exports){
/*
 * default/pointerdown-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var PointerdownButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.delay = options.delay > 0 ? options.delay : 0;
};

PointerdownButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

PointerdownButton.prototype.constructor = PointerdownButton;

PointerdownButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    if (window.MSPointerEvent)
        this.el.addEventListener('MSPointerDown', this, false);
    else
        this.el.addEventListener('pointerdown', this, false);;
    this.binded = true;
    return this;
};

PointerdownButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    if (window.MSPointerEvent)
        this.el.removeEventListener('MSPointerDown', this, false);
    else
        this.el.removeEventListener('pointerdown', this, false);;
    this.binded = false;
    return this;
};

PointerdownButton.prototype.handleEvent = function (evt) {
    switch(evt.type) {
        case 'MSPointerDown':
        case 'pointerdown':
            this.onPointerdown(evt);
            break;
    }
};

function _done(btn) {
    return function () {
        if(btn.monotouchable) btn.unlock();
        btn.setActive(false);
    };
};

PointerdownButton.prototype.onPointerdown = function (evt) {
    if (!this.active && (!this.monotouchable || !this.isLocked())) {
        var btn = this;
        if(btn.monotouchable) btn.lock();
        btn.setActive(true);
        Q.delay(evt, btn.delay).then(btn.f).finally(_done(btn)).done();
    }
};

module.exports = PointerdownButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/default/pointerup-button.js":[function(require,module,exports){
/*
 * default/pointerup-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var PointerupButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.activeBorder = options.activeBorder || 50;
    this.boundaries = { minX : 0, maxX : 0, minY : 0, maxY : 0 };
    this.pointerId = null;
};

PointerupButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

PointerupButton.prototype.constructor = PointerupButton;

PointerupButton.prototype.setActiveBorder = function (len) {
    this.activeBorder = len;
};

PointerupButton.prototype._isDownPointerId = function (pointerId) {
    return this.pointerId === pointerId;
};

PointerupButton.prototype._isInActiveZone = function (evt) {
    var x = evt.clientX,
        y = evt.clientY,
        b = this.boundaries;
    return x < b.maxX && x > b.minX && y < b.maxY && y > b.minY;
};

PointerupButton.prototype._setPointerCapture = function (pointerId) {
    if (window.MSPointerEvent)
        this.el.msSetPointerCapture(pointerId);
    else
        this.el.setPointerCapture(pointerId);
}

PointerupButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    if (window.MSPointerEvent) {
        this.el.addEventListener('MSPointerDown', this, false);
        this.el.addEventListener('MSPointerMove', this, false);
        this.el.addEventListener('MSPointerUp', this, false);
        this.el.addEventListener('MSPointerCancel', this, false);
    } else {
        this.el.addEventListener('pointerdown', this, false);
        this.el.addEventListener('pointermove', this, false);
        this.el.addEventListener('pointerup', this, false);
        this.el.addEventListener('pointercancel', this, false);
    }
    this.binded = true;
    return this;
};

PointerupButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    if (window.MSPointerEvent) {
        this.el.removeEventListener('MSPointerDown', this, false);
        this.el.removeEventListener('MSPointerMove', this, false);
        this.el.removeEventListener('MSPointerUp', this, false);
        this.el.removeEventListener('MSPointerCancel', this, false);
    } else {
        this.el.removeEventListener('pointerdown', this, false);
        this.el.removeEventListener('pointermove', this, false);
        this.el.removeEventListener('pointerup', this, false);
        this.el.removeEventListener('pointercancel', this, false);
    }
    this.binded = false;
    return this;
};

PointerupButton.prototype.handleEvent = function (evt) {
    switch (evt.type) {
        case 'MSPointerDown':
        case 'pointerdown':
            this.onPointerdown(evt);
            break;
        case 'MSPointerMove':
        case 'pointermove':
            this.onPointermove(evt);
            break;
        case 'MSPointerUp':
        case 'pointerup':
            this.onPointerup(evt);
            break;
        case 'MSPointerCancel':
        case 'pointercancel':
            this.onPointercancel(evt);
            break;
    }
};

PointerupButton.prototype.onPointerdown = function (evt) {
    if (!this.active  && (!this.monotouchable || !this.isLocked())) {
        if(this.monotouchable) this.lock();
        this.setActive(true);
        this.pointerId = evt.pointerId;
        this._setPointerCapture(evt.pointerId);
        this.triggerOnPointerup = true;
        var boundingRect = this.el.getBoundingClientRect();
        this.boundaries.minX = boundingRect.left - this.activeBorder;
        this.boundaries.maxX = boundingRect.left + boundingRect.width + this.activeBorder;
        this.boundaries.minY = boundingRect.top - this.activeBorder;
        this.boundaries.maxY = boundingRect.bottom +  this.activeBorder;
    }
};

PointerupButton.prototype.onPointermove = function (evt) {
    if (this.active) {
        if (this._isDownPointerId(evt.pointerId)) {
            evt.preventDefault();
            if (this._isInActiveZone(evt)) {
                this.triggerOnPointerup = true;
                this._addCls();
            } else {
                this.triggerOnPointerup = false;
                this._removeCls();
            }
        }
    }
};

PointerupButton.prototype._done = function (evt) {
    var btn = this;
    return function () {
        if(btn.monotouchable) btn.unlock();
        btn.onPointercancel(evt);
    };
};

PointerupButton.prototype.onPointerup = function (evt) {
    if (this.active) {
        if (this._isDownPointerId(evt.pointerId)) {
            if (this.triggerOnPointerup) {
                var btn = this;
                btn._removeCls();
                Q(evt).then(btn.f).finally(btn._done(evt)).done();
            } else {
                this._done(evt);
            }
        }
    }
};

PointerupButton.prototype.onPointercancel = function (evt) {
    this._removeCls();
    if (this.active) this.active = false;
};

module.exports = PointerupButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/scrollable-x/pointerup-button.js":[function(require,module,exports){
/*
 * scrollable-x/pointerup-button.js
 */

"use strict";

var PointerupButton = require('./../default/pointerup-button');

var PointerupOnScrollableXButton = function (options) {
    PointerupButton.prototype.constructor.call(this, options);
    this.tolerance = options.tolerance || 10;
};

PointerupOnScrollableXButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(PointerupButton.prototype);

PointerupOnScrollableXButton.prototype.constructor = PointerupOnScrollableXButton;

PointerupOnScrollableXButton.prototype.onPointerdown = function (evt) {
    if (!this.active && (!this.monotouchable || !this.isLocked()))
        this.startX = evt.clientX;
    PointerupButton.prototype.onPointerdown.call(this, evt);
};

PointerupOnScrollableXButton.prototype._isInActiveZone = function (evt) {
    var y = evt.clientY,
        d = Math.abs(evt.clientX - this.startX),
        b = this.boundaries;
    return y < b.maxY && y > b.minY && d < this.tolerance;
};

PointerupOnScrollableXButton.prototype.onPointermove = function (evt) {
    if (this.active) {
        if (this._isDownPointerId(evt.pointerId)) {
            evt.preventDefault();
            if (this._isInActiveZone(evt)) this._addCls();
            else this._done.call(this, evt)();
        }
    }
};

module.exports = PointerupOnScrollableXButton;

},{"./../default/pointerup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/default/pointerup-button.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/scrollable-y/pointerup-button.js":[function(require,module,exports){
/*
 * scrollable-y/pointerup-button.js
 */

"use strict";

var PointerupButton = require('./../default/pointerup-button');

var PointerupOnScrollableYButton = function (options) {
    PointerupButton.prototype.constructor.call(this, options);
    this.tolerance = options.tolerance || 10;
};

PointerupOnScrollableYButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(PointerupButton.prototype);

PointerupOnScrollableYButton.prototype.constructor = PointerupOnScrollableYButton;

PointerupOnScrollableYButton.prototype.onPointerdown = function (evt) {
    if (!this.active && (!this.monotouchable || !this.isLocked()))
        this.startY = evt.clientY;
    PointerupButton.prototype.onPointerdown.call(this, evt);
};

PointerupOnScrollableYButton.prototype._isInActiveZone = function (evt) {
    var x = evt.clientX,
        d = Math.abs(evt.clientY - this.startY),
        b = this.boundaries;
    return x < b.maxX && x > b.minX && d < this.tolerance;
};

PointerupOnScrollableYButton.prototype.onPointermove = function (evt) {
    if (this.active) {
        if (this._isDownPointerId(evt.pointerId)) {
            evt.preventDefault();
            if (this._isInActiveZone(evt)) this._addCls();
            else this._done.call(this, evt)();
        }
    }
};

module.exports = PointerupOnScrollableYButton;

},{"./../default/pointerup-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/pointer/default/pointerup-button.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/default/touch-push-button.js":[function(require,module,exports){
/*
 * default/touch-push-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var TouchPushButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.delay = options.delay > 0 ? options.delay : 0;
    this.g = null;
    if(typeof options.g === 'function') this.g = options.g;
    this.promisef = null;
    this.boundaries = { minX : 0, maxX : 0, minY : 0, maxY : 0 };
    this.leftOrEnded = false;
    this.identifier = null;
};

TouchPushButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

TouchPushButton.prototype.constructor = TouchPushButton;

TouchPushButton.prototype.setG = function (g) {
    if (typeof g !== 'function')
        throw new Error("Button setG method needs a g function as argument.");
    this.g = g;
    return this;
};

TouchPushButton.prototype._getTouch = function (changedTouches) {
    for (var i = 0; i < changedTouches.length; i++) {
        if (changedTouches[i].identifier === this.identifier) {
            return changedTouches[i];
        }
    }
    return null;
};

TouchPushButton.prototype._isInActiveZone = function (touch) {
    var x = touch.clientX,
        y = touch.clientY,
        b = this.boundaries;
    return x < b.maxX && x > b.minX && y < b.maxY && y > b.minY;
};

TouchPushButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    this.el.addEventListener('touchstart', this, false);
    this.el.addEventListener('touchmove', this, false);
    this.el.addEventListener('touchend', this, false);
    this.el.addEventListener('touchcancel', this, false);
    this.binded = true;
    return this;
};

TouchPushButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    this.el.removeEventListener('touchstart', this, false);
    this.el.removeEventListener('touchmove', this, false);
    this.el.removeEventListener('touchend', this, false);
    this.el.removeEventListener('touchcancel', this, false);
    this.binded = false;
    return this;
};

TouchPushButton.prototype.handleEvent = function (evt) {
    switch(evt.type) {
        case 'touchstart':
            this.onTouchstart(evt);
            break;
        case 'touchmove':
            this.onTouchmove(evt);
            break;
        case 'touchend':
            this.onTouchend(evt);
            break;
        case 'touchcancel':
            this.onTouchcancel(evt);
            break;
    }
};

TouchPushButton.prototype.onTouchstart = function (evt) {
    if(!this.active && (!this.monotouchable || !this.isLocked())) {
        if(this.monotouchable) this.lock();
        this.setActive(true);
        this.identifier = evt.changedTouches[0].identifier;
        var boundingRect = this.el.getBoundingClientRect();
        this.boundaries.minX = boundingRect.left;
        this.boundaries.maxX = boundingRect.left + boundingRect.width;
        this.boundaries.minY = boundingRect.top;
        this.boundaries.maxY = boundingRect.bottom;
        this.promisef = Q.delay(evt, this.delay).then(this.f);
    }
};

TouchPushButton.prototype.onTouchmove = function (evt) {
    if(this.active && !this.leftOrEnded) {
        var touch = this._getTouch(evt.changedTouches);
        if (touch) {
            evt.preventDefault();
            if(!this._isInActiveZone(touch)) {
                this._removeCls();
                this.leftOrEnded = true;
                this.promisef
                        .then(evt)
                        .then(this.g)
                        .finally(this._done(evt))
                        .done();
            }
        }
    }
};

TouchPushButton.prototype._done = function (evt) {
    var btn = this;
    return function () {
        if(btn.monotouchable) btn.unlock();
        btn.onTouchcancel(evt);
    };
};

TouchPushButton.prototype.onTouchend = function (evt) {
    if(this.active && !this.leftOrEnded) {
        if (this._getTouch(evt.changedTouches)) {
            this._removeCls();
            this.leftOrEnded = true;
            this.promisef
                    .then(evt)
                    .then(this.g)
                    .finally(this._done(evt))
                    .done();
        }
    }
};

TouchPushButton.prototype.onTouchcancel = function (evt) {
    this.setActive(false);
    this.leftOrEnded = false;
};

module.exports = TouchPushButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/default/touchend-button.js":[function(require,module,exports){
/*
 * default/touchend-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var TouchendButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.activeBorder = options.activeBorder || 50;
    this.boundaries = { minX : 0, maxX : 0, minY : 0, maxY : 0 };
    this.identifier = null;
};

TouchendButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

TouchendButton.prototype.constructor = TouchendButton;

TouchendButton.prototype.setActiveBorder = function (len) {
    this.activeBorder = len;
};

TouchendButton.prototype._getTouch = function (changedTouches) {
    for (var i = 0; i < changedTouches.length; i++) {
        if (changedTouches[i].identifier === this.identifier) {
            return changedTouches[i];
        }
    }
    return null;
};

TouchendButton.prototype._isInActiveZone = function (touch) {
    var x = touch.clientX,
        y = touch.clientY,
        b = this.boundaries;
    return x < b.maxX && x > b.minX && y < b.maxY && y > b.minY;
};

TouchendButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    this.el.addEventListener('touchstart', this, false);
    this.el.addEventListener('touchmove', this, false);
    this.el.addEventListener('touchend', this, false);
    this.el.addEventListener('touchcancel', this, false);
    this.binded = true;
    return this;
};

TouchendButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    this.el.removeEventListener('touchstart', this, false);
    this.el.removeEventListener('touchmove', this, false);
    this.el.removeEventListener('touchend', this, false);
    this.el.removeEventListener('touchcancel', this, false);
    this.binded = false;
    return this;
};

TouchendButton.prototype.handleEvent = function (evt) {
    switch(evt.type) {
        case 'touchstart':
            this.onTouchstart(evt);
            break;
        case 'touchmove':
            this.onTouchmove(evt);
            break;
        case 'touchend':
            this.onTouchend(evt);
            break;
        case 'touchcancel':
            this.onTouchcancel(evt);
            break;
    }
};

TouchendButton.prototype.onTouchstart = function (evt) {
    if(!this.active && (!this.monotouchable || !this.isLocked())) {
        if(this.monotouchable) this.lock();
        this.active = true;
        this.triggerOnTouchend = true;
        this.identifier = evt.changedTouches[0].identifier;
        var boundingRect = this.el.getBoundingClientRect();
        this.boundaries.minX = boundingRect.left - this.activeBorder;
        this.boundaries.maxX = boundingRect.left + boundingRect.width + this.activeBorder;
        this.boundaries.minY = boundingRect.top - this.activeBorder;
        this.boundaries.maxY = boundingRect.bottom +  this.activeBorder;
        this._addCls();
    }
};

TouchendButton.prototype.onTouchmove = function (evt) {
    if(this.active) {
        var touch = this._getTouch(evt.changedTouches);
        if (touch) {
            evt.preventDefault();
            if(this._isInActiveZone(touch)) {
                this.triggerOnTouchend = true;
                this._addCls();
            }
            else {
                this.triggerOnTouchend = false;
                this._removeCls();
            }
        }
    }
};

TouchendButton.prototype._done = function (evt) {
    var btn = this;
    return function () {
        if(btn.monotouchable) btn.unlock();
        btn.onTouchcancel(evt);
    };
};

TouchendButton.prototype.onTouchend = function (evt) {
    if(this.active) {
        if (this._getTouch(evt.changedTouches)) {
            if (this.triggerOnTouchend) {
                var btn = this;
                btn._removeCls();
                Q(evt).then(btn.f).finally(btn._done(evt)).done();
            }
            else {
                this._done(evt)();
            }
        }
    }
};

TouchendButton.prototype.onTouchcancel = function (evt) {
    this._removeCls();
    if(this.active) this.active = false;
};

module.exports = TouchendButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/default/touchstart-button.js":[function(require,module,exports){
/*
 * default/touchstart-button.js
 */

"use strict";

var Q = require('q'),
    Button = require('./../../button');

var TouchstartButton = function (options) {
    Button.prototype.constructor.call(this, options);
    this.delay = options.delay > 0 ? options.delay : 0;
};

TouchstartButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(Button.prototype);

TouchstartButton.prototype.constructor = TouchstartButton;

TouchstartButton.prototype.bind = function () {
    Button.prototype.bind.call(this);
    this.el.addEventListener('touchstart', this, false);
    this.binded = true;
    return this;
};

TouchstartButton.prototype.unbind = function () {
    Button.prototype.unbind.call(this);
    this.el.removeEventListener('touchstart', this, false);
    this.binded = false;
    return this;
};

TouchstartButton.prototype.handleEvent = function (evt) {
    switch(evt.type) {
        case 'touchstart':
            this.onTouchstart(evt);
            break;
    }
};

function _done(btn) {
    return function () {
        if(btn.monotouchable) btn.unlock();
        btn.setActive(false);
    };
};

TouchstartButton.prototype.onTouchstart = function (evt) {
    if (!this.active && (!this.monotouchable || !this.isLocked())) {
        var btn = this;
        if(btn.monotouchable) btn.lock();
        btn.setActive(true);
        Q.delay(evt, btn.delay).then(btn.f).finally(_done(btn)).done();
    }
};

module.exports = TouchstartButton;

},{"./../../button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/button.js","q":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/scrollable-x/touchend-button.js":[function(require,module,exports){
/*
 * scrollable-x/touchend-button.js
 */

"use strict";

var TouchendButton = require('./../default/touchend-button');

var ScrollableXTouchendButton = function (options) {
    TouchendButton.prototype.constructor.call(this, options);
    this.tolerance = options.tolerance || 10;
};

ScrollableXTouchendButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(TouchendButton.prototype);

ScrollableXTouchendButton.prototype.constructor = ScrollableXTouchendButton;

ScrollableXTouchendButton.prototype.onTouchstart = function (evt) {
    if(!this.active && (!this.monotouchable || !this.isLocked()))
        this.startX = evt.changedTouches[0].clientX;
    TouchendButton.prototype.onTouchstart.call(this, evt);
};

ScrollableXTouchendButton.prototype._isInActiveZone = function (touch) {
    var y = touch.clientY,
        d = Math.abs(touch.clientX - this.startX),
        b = this.boundaries;
    return y < b.maxY && y > b.minY && d < this.tolerance;
};

ScrollableXTouchendButton.prototype.onTouchmove = function (evt) {
    if(this.active) {
        var touch = this._getTouch(evt.changedTouches);
        if (touch) {
            evt.preventDefault();
            if(this._isInActiveZone(touch)) this._addCls();
            else this._done.call(this, evt)();
        }
    }
};

module.exports = ScrollableXTouchendButton;

},{"./../default/touchend-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/default/touchend-button.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/scrollable-y/touchend-button.js":[function(require,module,exports){
/*
 * scrollable-y/touchend-button.js
 */

"use strict";

var TouchendButton = require('./../default/touchend-button');

var ScrollableYTouchendButton = function (options) {
    TouchendButton.prototype.constructor.call(this, options);
    this.tolerance = options.tolerance || 10;
};

ScrollableYTouchendButton.prototype = (function (proto) {
    function F() {};
    F.prototype = proto;
    return new F();
})(TouchendButton.prototype);

ScrollableYTouchendButton.prototype.constructor = ScrollableYTouchendButton;

ScrollableYTouchendButton.prototype.onTouchstart = function (evt) {
    if(!this.active && (!this.monotouchable || !this.isLocked()))
        this.startY = evt.changedTouches[0].clientY;
    TouchendButton.prototype.onTouchstart.call(this, evt);
};

ScrollableYTouchendButton.prototype._isInActiveZone = function (touch) {
    var x = touch.clientX,
        d = Math.abs(touch.clientY - this.startY),
        b = this.boundaries;
    return x < b.maxX && x > b.minX && d < this.tolerance;
};

ScrollableYTouchendButton.prototype.onTouchmove = function (evt) {
    if(this.active) {
        var touch = this._getTouch(evt.changedTouches);
        if (touch) {
            evt.preventDefault();
            if(this._isInActiveZone(touch)) this._addCls();
            else this._done.call(this, evt)();
        }
    }
};

module.exports = ScrollableYTouchendButton;

},{"./../default/touchend-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/touch/default/touchend-button.js"}],"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/node_modules/q/q.js":[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof self !== "undefined") {
        self.Q = definition();

    } else {
        throw new Error("This environment was not anticiapted by Q. Please file a bug.");
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require('_process'))
},{"_process":"/Users/renaudbressand/Work/v2/lichobile/node_modules/browserify/node_modules/process/browser.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/StrongSocket.js":[function(require,module,exports){
'use strict';

var _ = require('lodash-node'),
    utils = require('./utils'),
    storage = require('./storage');

var lichessSri = utils.lichessSri;

var urlsPool = _.range(9021, 9030).map(function(e) {
  return window.socketEndPoint + ':' + e;
});
urlsPool.unshift(window.socketEndPoint);

var strongSocketDefaults = {
  events: {
  },
  params: {
    sri: lichessSri,
    mobile: 1
  },
  options: {
    name: 'unnamed',
    pingMaxLag: 7000, // time to wait for pong before reseting the connection
    pingDelay: 1000, // time between pong and ping
    autoReconnectDelay: 1000
  }
};

var StrongSocket = function(url, version, settings) {
  var self = this;
  self.settings = strongSocketDefaults;
  _.merge(self.settings, settings);
  self.url = url;
  self.version = version;
  self.options = self.settings.options;
  self.ws = null;
  self.pingSchedule = null;
  self.connectSchedule = null;
  self.ackableMessages = [];
  self.lastPingTime = self.now();
  self.currentLag = 0;
  self.averageLag = 0;
  self.autoReconnect = true;
  self.tryAnotherUrl = false;
  self.debug('Debug is enabled');
  self.connect();
  window.addEventListener('unload', function() {
    self.destroy();
  });
};

StrongSocket.prototype = {
  connect: function() {
    var self = this;
    self.destroy();
    self.autoReconnect = true;
    var fullUrl = 'ws://' + self.baseUrl() + self.url + '?' + utils.serializeQueryParameters(_.defaults(self.settings.params, {
      version: self.version
    }));
    self.debug('connection attempt to ' + fullUrl, true);
    try {
      if (window.WebSocket) self.ws = new window.WebSocket(fullUrl);
      else throw '[lila] no websockets available!';

      // if (self.options.debug) window.liws = self.ws;
      self.ws.onerror = function(e) {
        self.onError(e);
      };
      self.ws.onclose = function() {
        if (self.autoReconnect) {
          self.debug('Will autoreconnect in ' + self.options.autoReconnectDelay);
          self.scheduleConnect(self.options.autoReconnectDelay);
        }
      };
      self.ws.onopen = function() {
        self.debug('connected to ' + fullUrl, true);
        self.onSuccess();
        self.pingNow();
        var resend = self.ackableMessages;
        self.ackableMessages = [];
        resend.forEach(function(x) { self.send(x.t, x.d); });
      };
      self.ws.onmessage = function(e) {
        var m = JSON.parse(e.data);
        var mData = m.d || [];

        if (m.t === 'n')
          self.pong();
        else {
          self.debug(e.data);
          if (m.t === 'b') mData.forEach(function(x) { self.handle(x); });
          else self.handle(m);
        }
      };
    } catch (e) {
      self.onError(e);
    }
    self.scheduleConnect(self.options.pingMaxLag);
  },
  send: function(t, d, o) {
    var self = this;
    var data = d || {},
    options = o || {};
    if (options.ackable)
      self.ackableMessages.push({
        t: t,
        d: d
      });
    var message = JSON.stringify({
      t: t,
      d: data
    });
    self.debug("send " + message);
    try {
      self.ws.send(message);
    } catch (e) {
      self.debug(e);
    }
  },
  sendAckable: function(t, d) {
    this.send(t, d, { ackable: true });
  },
  scheduleConnect: function(delay) {
    var self = this;
    // self.debug('schedule connect ' + delay);
    clearTimeout(self.pingSchedule);
    clearTimeout(self.connectSchedule);
    self.connectSchedule = setTimeout(function() {
      self.tryAnotherUrl = true;
      self.connect();
    }, delay);
  },
  schedulePing: function(delay) {
    var self = this;
    clearTimeout(self.pingSchedule);
    self.pingSchedule = setTimeout(function() {
      self.pingNow();
    }, delay);
  },
  pingNow: function() {
    var self = this;
    clearTimeout(self.pingSchedule);
    clearTimeout(self.connectSchedule);
    try {
      self.ws.send(self.pingData());
      self.lastPingTime = self.now();
    } catch (e) {
      self.debug(e, true);
    }
    self.scheduleConnect(self.options.pingMaxLag);
  },
  pong: function() {
    var self = this;
    clearTimeout(self.connectSchedule);
    self.schedulePing(self.options.pingDelay);
    self.currentLag = self.now() - self.lastPingTime;
    if (!self.averageLag) self.averageLag = self.currentLag;
    else self.averageLag = 0.2 * (self.currentLag - self.averageLag) + self.averageLag;
  },
  pingData: function() {
    return JSON.stringify({
      t: "p",
      v: this.version
    });
  },
  handle: function(m) {
    var self = this;
    if (m.v) {
      if (m.v <= self.version) {
        self.debug("already has event " + m.v);
        return;
      }
      if (m.v > self.version + 1) {
        self.debug("event gap detected from " + self.version + " to " + m.v);
      }
      self.version = m.v;
    }
    switch (m.t || false) {
      case false:
        break;
      case 'ack':
        self.ackableMessages = [];
        break;
      default:
        if (!self.settings.receive || !self.settings.receive(m.t, m.d)) {
          var h = self.settings.events[m.t];
          if (h) h(m.d || null);
          else if (!self.options.ignoreUnknownMessages) {
            self.debug('Message not supported ' + JSON.stringify(m));
          }
        }
    }
  },
  now: function() {
    return new Date().getTime();
  },
  debug: function(msg, always) {
    if ((always || this.options.debug) && window.console && console.debug) {
      console.debug("[" + this.options.name + " " + lichessSri + "]", msg);
    }
  },
  destroy: function() {
    clearTimeout(this.pingSchedule);
    clearTimeout(this.connectSchedule);
    this.disconnect();
    this.ws = null;
  },
  disconnect: function() {
    if (this.ws) {
      this.debug("Disconnect", true);
      this.autoReconnect = false;
      this.ws.onerror = function() {};
      this.ws.onclose = function() {};
      this.ws.onopen = function() {};
      this.ws.onmessage = function() {};
      this.ws.close();
    }
  },
  onError: function(e) {
    var self = this;
    self.options.debug = true;
    self.debug('error: ' + JSON.stringify(e));
    self.tryAnotherUrl = true;
    clearTimeout(self.pingSchedule);
  },
  onSuccess: function() {
  },
  baseUrl: function() {
    if (window.socketEndPoint === 'socket.en.lichess.org') {
      var key = 'socket.baseUrl';
      var url = storage.get(key);
      if (!url) {
        url = urlsPool[0];
        storage.set(key, url);
      } else if (this.tryAnotherUrl) {
        this.tryAnotherUrl = false;
        url = urlsPool[(urlsPool.indexOf(url) + 1) % urlsPool.length];
        storage.set(key, url);
      }
      return url;
    }

    return window.socketEndPoint;
  },
  pingInterval: function() {
    return this.options.pingDelay + this.averageLag;
  }
};

module.exports = StrongSocket;

},{"./storage":"/Users/renaudbressand/Work/v2/lichobile/src/js/storage.js","./utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js","lodash-node":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/index.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/i18n.js":[function(require,module,exports){
// TODO
var messages = {"playWithAFriend":"Jouer avec un(e) ami(e)","playWithTheMachine":"Jouer contre l'ordinateur","toInviteSomeoneToPlayGiveThisUrl":"Pour inviter quelqu'un à jouer, donnez-lui ce lien","gameOver":"Partie terminée","waitingForOpponent":"En attente de l'adversaire","waiting":"En attente","yourTurn":"À votre tour","aiNameLevelAiLevel":"%s niveau %s","level":"Niveau","toggleTheChat":"Activer/Désactiver la discussion","toggleSound":"Activer/Désactiver le son","chat":"Discussion","resign":"Abandonner","checkmate":"Échec et mat","stalemate":"Pat","white":"Blanc","black":"Noir","randomColor":"Couleur aléatoire","createAGame":"Créer une partie","whiteIsVictorious":"Les blancs gagnent","blackIsVictorious":"Les noirs gagnent","playWithTheSameOpponentAgain":"Jouer une nouvelle partie avec le même adversaire","newOpponent":"Nouvel adversaire","playWithAnotherOpponent":"Jouer avec un autre adversaire","yourOpponentWantsToPlayANewGameWithYou":"Votre adversaire souhaite jouer une nouvelle partie avec vous","joinTheGame":"Rejoindre la partie","whitePlays":"Trait aux blancs","blackPlays":"Trait aux noirs","theOtherPlayerHasLeftTheGameYouCanForceResignationOrWaitForHim":"Votre adversaire a quitté la partie. Vous pouvez soit attendre son retour, soit forcer le nul ou l'abandon.","makeYourOpponentResign":"Forcer l'abandon de votre adversaire","forceResignation":"Forcer l'abandon","forceDraw":"Forcer le nul","talkInChat":"Parler à l'autre joueur","theFirstPersonToComeOnThisUrlWillPlayWithYou":"La première personne qui cliquera sur ce lien jouera avec vous.","whiteCreatesTheGame":"Les blancs créent la partie","blackCreatesTheGame":"Les noirs créent la partie","whiteJoinsTheGame":"Les blancs rejoignent la partie","blackJoinsTheGame":"Les noirs rejoignent la partie","whiteResigned":"Les blancs abandonnent","blackResigned":"Les noirs abandonnent","whiteLeftTheGame":"Les blancs ont quitté la partie","blackLeftTheGame":"Les noirs ont quitté la partie","shareThisUrlToLetSpectatorsSeeTheGame":"Partagez ce lien pour permettre à des spectateurs de voir la partie","youAreViewingThisGameAsASpectator":"Vous êtes spectateur de cette partie","replayAndAnalyse":"Revoir les coups joués et analyser la partie","computerAnalysisInProgress":"Analyse automatique en cours","theComputerAnalysisHasFailed":"L'analyse automatique a échoué","viewTheComputerAnalysis":"Voir l'analyse automatique","requestAComputerAnalysis":"Demander une analyse automatique","computerAnalysis":"Analyse de l'ordinateur","analysis":"Analyse","blunders":"Gaffes","mistakes":"Erreurs","inaccuracies":"Imprécisions","moveTimes":"Temps par coup","flipBoard":"Retourner l'échiquier","threefoldRepetition":"Triple répétition","claimADraw":"Déclarer la partie nulle","offerDraw":"Proposer le nul","draw":"Partie nulle","nbConnectedPlayers":"%s joueurs","gamesBeingPlayedRightNow":"Parties jouées en ce moment","viewAllNbGames":"Voir les %s parties","viewNbCheckmates":"Voir les %s mats","nbBookmarks":"%s favoris","nbPopularGames":"%s parties populaires","nbAnalysedGames":"%s parties analysées","bookmarkedByNbPlayers":"Mis en favoris par %s joueurs","viewInFullSize":"Agrandir","logOut":"Déconnexion","signIn":"Connexion","newToLichess":"Nouveau sur Lichess ?","youNeedAnAccountToDoThat":"Il vous faut un compte d'utilisateur pour faire cela","signUp":"Inscription","computersAreNotAllowedToPlay":"Les ordinateurs et les joueurs assistés par ordinateur ne sont pas autorisés à jouer. Veuillez ne pas vous aider de moteurs d'échecs, de bases de données ou d'autres joueurs quand vous êtes en train de jouer. Notez également qu'il est déconseillé de créer plusieurs comptes, le multi-compte excessif étant interdit.","games":"Parties","forum":"Forum","xPostedInForumY":"%s a posté dans le forum %s","latestForumPosts":"Derniers posts du forum","players":"Joueurs","minutesPerSide":"Minutes par joueur","variant":"Variante","timeControl":"Contrôle du temps","clock":"Horloge","correspondence":"Correspondance","daysPerTurn":"Jours par coup","oneDay":"Un jour","nbDays":"%s jours","nbHours":"%s heures","time":"Temps","username":"Pseudonyme","password":"Mot de passe","haveAnAccount":"Déjà inscrit ?","allYouNeedIsAUsernameAndAPassword":"Vous n'avez besoin que d'un pseudonyme et d'un mot de passe.","changePassword":"Changer le mot de passe","learnMoreAboutLichess":"En savoir plus sur Lichess","rank":"Classement","gamesPlayed":"Parties jouées","nbGamesWithYou":"%s parties avec vous","declineInvitation":"Décliner l'invitation","cancel":"Annuler","timeOut":"Temps écoulé","drawOfferSent":"Proposition de nul envoyée","drawOfferDeclined":"Proposition de nul refusée","drawOfferAccepted":"Proposition de nul acceptée","drawOfferCanceled":"Proposition de nul annulée","whiteOffersDraw":"Les Blancs offrent la nulle","blackOffersDraw":"Les Noirs offrent la nulle","whiteDeclinesDraw":"Les Blancs refusent la nulle","blackDeclinesDraw":"Les Noirs refusent la nulle","yourOpponentOffersADraw":"Votre adversaire propose le nul","accept":"Accepter","decline":"Refuser","playingRightNow":"Partie en cours","finished":"Terminé","abortGame":"Annuler la partie","gameAborted":"Partie annulée","standard":"Standard","unlimited":"Illimité","mode":"Mode","casual":"Amicale","rated":"Classée(s)","thisGameIsRated":"Cette partie est classée","rematch":"Revanche","rematchOfferSent":"Proposition de revanche envoyée","rematchOfferAccepted":"Proposition de revanche acceptée","rematchOfferCanceled":"Proposition de revanche annulée","rematchOfferDeclined":"Proposition de revanche déclinée","cancelRematchOffer":"Annuler la proposition de revanche","viewRematch":"Voir la revanche","play":"Jouer","inbox":"Boîte de réception","chatRoom":"Salon de discussion","spectatorRoom":"Salon des spectateurs","composeMessage":"Écrire un message","noNewMessages":"Aucun nouveau message","subject":"Sujet","recipient":"Destinataire","send":"Envoyer","incrementInSeconds":"Incrément en secondes","freeOnlineChess":"Jeu d'échecs gratuit en ligne","spectators":"Spectateurs :","nbWins":"%s victoires","nbLosses":"%s défaites","nbDraws":"%s nuls","exportGames":"Exporter les parties","ratingRange":"Classement","giveNbSeconds":"Donner %s secondes","premoveEnabledClickAnywhereToCancel":"Pré-coup activé – cliquez ailleurs pour annuler","thisPlayerUsesChessComputerAssistance":"Ce joueur utilise un programme d'échecs","opening":"Ouverture","takeback":"Annuler le coup","proposeATakeback":"Proposer l'annulation du coup","takebackPropositionSent":"Annulation du coup proposée","takebackPropositionDeclined":"Annulation du coup refusée","takebackPropositionAccepted":"Annulation du coup acceptée","takebackPropositionCanceled":"Annulation du coup annulée","yourOpponentProposesATakeback":"Votre adversaire propose l'annulation du coup","bookmarkThisGame":"Mettre cette partie en favoris","search":"Recherche","advancedSearch":"Recherche avancée","tournament":"Tournoi","tournaments":"Tournois","tournamentPoints":"Score de tournoi","viewTournament":"Voir le tournoi","backToTournament":"Retour au tournoi","freeOnlineChessGamePlayChessNowInACleanInterfaceNoRegistrationNoAdsNoPluginRequiredPlayChessWithComputerFriendsOrRandomOpponents":"Jeu d'échecs gratuit en ligne. Jouez aux échecs immédiatement avec une interface simple. Pas d'inscription obligatoire, pas de publicité, pas de plugin. Jouez aux échecs contre l'ordinateur, des amis ou des adversaires en ligne.","teams":"Équipes","nbMembers":"%s membres","allTeams":"Toutes les équipes","newTeam":"Nouvelle équipe","myTeams":"Mes équipes","noTeamFound":"Pas d'équipe trouvée","joinTeam":"Rejoindre l'équipe","quitTeam":"Quitter l'équipe","anyoneCanJoin":"Tout le monde peut rejoindre","aConfirmationIsRequiredToJoin":"Une confirmation est requise pour pouvoir rejoindre","joiningPolicy":"Politique pour rejoindre","teamLeader":"Chef d'équipe","teamBestPlayers":"Meilleurs joueurs de l'équipe","teamRecentMembers":"Membres récents de l'équipe","xJoinedTeamY":"%s a rejoint l'équipe %s","xCreatedTeamY":"%s a créé l'équipe %s","averageElo":"Classement moyen","location":"Localisation","settings":"Paramètres","filterGames":"Filtrer les parties","reset":"Réinitialiser","apply":"Appliquer","leaderboard":"Classement","pasteTheFenStringHere":"Coller le code FEN ici","pasteThePgnStringHere":"Coller le texte PGN ici","fromPosition":"Depuis une position","continueFromHere":"Continuer depuis cette position","importGame":"Importer une partie","nbImportedGames":"%s parties importées","thisIsAChessCaptcha":"Ceci est un CAPTCHA d'échecs.","clickOnTheBoardToMakeYourMove":"Cliquez sur le plateau pour jouer un coup, et prouvez que vous êtes humain.","notACheckmate":"Ce n'est pas un échec et mat","colorPlaysCheckmateInOne":"%s joue, mat en un coup","retry":"Réessayer","reconnecting":"Reconnexion en cours","onlineFriends":"Amis en ligne","noFriendsOnline":"Aucun ami en ligne","findFriends":"Trouver des amis","favoriteOpponents":"Adversaires préférés","follow":"Suivre","following":"Suivi","unfollow":"Ne plus suivre","block":"Bloquer","blocked":"Bloqué","unblock":"Débloquer","followsYou":"Vous suit","xStartedFollowingY":"%s a suivi %s","nbFollowers":"%s suiveurs","nbFollowing":"%s suivis","more":"Plus","memberSince":"Membre depuis","lastLogin":"Dernière connexion","challengeToPlay":"Défier ce joueur","player":"Joueur","list":"Liste","graph":"Graphique","lessThanNbMinutes":"Moins de %s minutes","xToYMinutes":"De %s à %s minutes","textIsTooShort":"Le texte est trop court.","textIsTooLong":"Le texte est trop long.","required":"Requis.","openTournaments":"Tournois ouverts","duration":"Durée","winner":"Vainqueur","standing":"Classement","createANewTournament":"Créer un nouveau tournoi","join":"Rejoindre","withdraw":"Renoncer","points":"Points","wins":"Victoires","losses":"Défaites","winStreak":"Série de victoires","createdBy":"Créé par","waitingForNbPlayers":"En attente de %s joueurs","tournamentIsStarting":"Le tournoi commence","membersOnly":"Membres seulement","boardEditor":"Éditeur de partie","startPosition":"Position de départ","clearBoard":"Initialiser l'échiquier","savePosition":"Enregistrer la position","loadPosition":"Charger une position","isPrivate":"Privé","reportXToModerators":"Signaler %s aux modérateurs","profile":"Profil","editProfile":"Éditer le profil","firstName":"Prénom","lastName":"Nom","biography":"Biographie","country":"Pays","preferences":"Préférences","watchLichessTV":"Regarder Lichess TV","previouslyOnLichessTV":"Précédemment sur Lichess TV","todaysLeaders":"Les meilleurs du jour","onlinePlayers":"Joueurs en ligne","progressToday":"Progression du jour","progressThisWeek":"Progression de la semaine","progressThisMonth":"Progression du mois","leaderboardThisWeek":"Meilleurs joueurs de la semaine","leaderboardThisMonth":"Meilleurs joueurs du mois","activeToday":"Actifs aujourd'hui","activeThisWeek":"Actifs cette semaine","activePlayers":"Joueurs actifs","bewareTheGameIsRatedButHasNoClock":"Attention, la partie est classée, mais sans limite de temps !","training":"Entraînement","yourPuzzleRatingX":"Votre classement à l'entrainement : %s","findTheBestMoveForWhite":"Trouvez le meilleur coup pour les blancs.","findTheBestMoveForBlack":"Trouvez le meilleur coup pour les noirs.","toTrackYourProgress":"Pour sauvegarder votre progression :","trainingSignupExplanation":"Lichess fournit des problèmes adaptés à votre niveau, pour de meilleures sessions d'entraînement.","recentlyPlayedPuzzles":"Problèmes joués récemment","puzzleId":"Problème %s","puzzleOfTheDay":"Problème du jour","clickToSolve":"Cliquez pour résoudre","goodMove":"Bon coup","butYouCanDoBetter":"Mais vous pouvez faire mieux.","bestMove":"Meilleur coup !","keepGoing":"Continuez…","puzzleFailed":"Problème échoué","butYouCanKeepTrying":"Mais vous pouvez réessayer.","victory":"Victoire !","giveUp":"Abandonner","puzzleSolvedInXSeconds":"Problème résolu en %s secondes.","wasThisPuzzleAnyGood":"Ce problème était-il intéressant ?","pleaseVotePuzzle":"Aidez Lichess à s'améliorer en votant grâce aux flèches :","thankYou":"Merci !","ratingX":"Classement : %s","playedXTimes":"Joué %s fois","fromGameLink":"Tiré de la partie %s","startTraining":"Commencer l'entraînement","continueTraining":"Continuer l'entraînement","retryThisPuzzle":"Réessayer ce problème","thisPuzzleIsCorrect":"Ce problème est correct et intéressant","thisPuzzleIsWrong":"Ce problème est erroné ou ennuyeux","youHaveNbSecondsToMakeYourFirstMove":"Vous avez %s secondes pour jouer votre premier coup !","nbGamesInPlay":"%s parties en cours"};

module.exports = function(str) {
  str = messages[arguments[0]];
  Array.prototype.slice.call(arguments, 1).forEach(function(arg) {
    str = str.replace('%s', arg);
  });
  return str;
};

},{}],"/Users/renaudbressand/Work/v2/lichobile/src/js/layout.js":[function(require,module,exports){
var utils = require('./utils');
var menu = require('./menu');

function headerHeight() {
  var d = utils.getViewportDims();
  return (d.vh - d.vw) / 2;
}

/**
 * Main layout function
 *
 * @param {Object} ctrl Module's controller instance
 * @param {function} headerView A function that returns an array of m()
 * @param {function} contentView A function that returns a m()
 * @param {function} footerView A function that returns an array of m()
 * @param {function} menuView A function that returns an array of m()
 * @param {function} overlayView A function that returns an array of m()
 */
module.exports = function(ctrl, headerView, contentView, footerView, menuView, overlayView) {
  return [
    m('main', { class: menu.isOpen ? 'out' : '' }, [
      m('header', { style: { height: headerHeight() + 'px' }}, headerView()),
      contentView(),
      m('footer', { style: { height: headerHeight() + 'px' }}, footerView())
    ]),
    m('aside', menuView()),
    overlayView()
  ];
};

},{"./menu":"/Users/renaudbressand/Work/v2/lichobile/src/js/menu.js","./utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/menu.js":[function(require,module,exports){
var session = require('./session');
var utils = require('./utils');

var menu = {};

menu.isOpen = false;

menu.toggle = function() {
  menu.isOpen = !menu.isOpen;
};

menu.view = function() {
  var userobj = session.get();
  var nav = userobj ? [
    m('h2', userobj.username),
    m('button', {
      config: utils.ontouchend(function() {
        session.logout();
      })
    }, 'Log out')
  ] : [
    m('h2', 'Not connected')
  ];
  return [
    m('header', [
      m('nav', nav)
    ]),
    m('div', [
      userobj ? null :
      m('form', {
        onsubmit: function(e) {
          e.preventDefault();
          var form = e.target;
          menu.toggle();
          session.login(form[0].value, form[1].value);
        }
      },[
        m('h3', 'Connection'),
        m('input#pseudo[type=text][placeholder=Pseudo]'),
        m('input#password[type=password][placeholder=Password]'),
        m('button#login', 'LOG IN')
      ])
    ])
  ];
};

module.exports = menu;

},{"./session":"/Users/renaudbressand/Work/v2/lichobile/src/js/session.js","./utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/play/index.js":[function(require,module,exports){
var ctrl = require('./playCtrl');
var view = require('./playView');

module.exports = {
  controller: ctrl,
  view: view
};

},{"./playCtrl":"/Users/renaudbressand/Work/v2/lichobile/src/js/play/playCtrl.js","./playView":"/Users/renaudbressand/Work/v2/lichobile/src/js/play/playView.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/play/playCtrl.js":[function(require,module,exports){
var xhr = require('./playXhr');
var roundCtrl = require('../round/roundCtrl');
var StrongSocket = require('../StrongSocket');
var Chessground = require('chessground');

function makeGameSocket(ctrl, data) {
  return new StrongSocket(
    data.url.socket,
    data.player.version,
    {
      options: { name: "game", debug: true },
      receive: function(t, d) { return ctrl.round.socket.receive(t, d); }
    }
  );
}

function makeLobbySocket(ctrl) {
  return new StrongSocket(
    '/lobby/socket/v1',
    0,
    {
      options: { name: 'lobby', pingDelay: 2000 },
      events: {
        redirect: function(data) {
          m.route('/play' + data.url);
          ctrl.lobbySocket.destroy();
        }
      }
    }
  );
}

function makeRound(ctrl, data) {
  return new roundCtrl(data, null, ctrl.gameSocket.send.bind(ctrl.gameSocket));
}

module.exports = function() {
  this.id = m.route.param('id');

  this.vm = {
    isSeekingGame: false
  };

  this.round = null;
  this.gameSocket = null;
  this.lobbySocket = null;

  this.playing = function () { return this.round; };

  this.chessground = new Chessground.controller({viewOnly: true});

  var resumeGame = function(id) {
    var self = this;
    xhr.game(id).then(function (data) {
      self.gameSocket = makeGameSocket(self, data);
      self.round = makeRound(self, data);
    });
  }.bind(this);

  this.joinGame = function(id) {
    m.route('/play/' + id);
  }.bind(this);

  this.startAIGame = function() {
    xhr.aiGame().then(function(data) {
      m.route('/play' + data.url.round);
    });
  }.bind(this);

  this.seekHumanGame = function() {
    this.vm.isSeekingGame = true;
    this.lobbySocket = makeLobbySocket(this);
    xhr.seekHuman().then(function() {
      console.log('hook sent...');
    });
  }.bind(this);

  this.onunload = function() {
    if (this.round) {
      this.round.onunload();
      this.round = null;
    }
    if (this.gameSocket) {
      this.gameSocket.destroy();
      this.gameSocket = null;
    }
  };

  if (this.id) resumeGame(this.id);
};

},{"../StrongSocket":"/Users/renaudbressand/Work/v2/lichobile/src/js/StrongSocket.js","../round/roundCtrl":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/roundCtrl.js","./playXhr":"/Users/renaudbressand/Work/v2/lichobile/src/js/play/playXhr.js","chessground":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/main.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/play/playMenu.js":[function(require,module,exports){
var utils = require('../utils');
var settings = require('../settings');
var iScroll = require('iscroll');
var session = require('../session');
var playMenu = {};

var isOpen = false;
var newGameCardSwapped = false;

playMenu.open = function() {
  isOpen = true;
};

playMenu.close = function() {
  isOpen = false;
};

function swapCard() {
  newGameCardSwapped = !newGameCardSwapped;
}

function renderRadio(label, name, value, settingsProp) {
  var isOn = settingsProp() === value;
  var id = name + value;
  return [
    m('input.radio[type=radio]', {
      name: name,
      id: id,
      'class': value,
      value: value,
      checked: isOn,
      onchange: function(e) {
        settingsProp(e.target.value);
      }
    }),
    m('label', { 'for': id }, label)
  ];
}

function renderOption(label, value, storedValue) {
  return m('option', {
    value: value,
    selected: storedValue === value
  }, label);
}

function renderSelect(label, name, options, settingsProp, isDisabled) {
  var storedValue = settingsProp();
  return [
    m('label', { 'for': name }, label),
    m('select', {
      name: name,
      disabled: isDisabled,
      onchange: function(e) { settingsProp(e.target.value); }
    }, options.map(function(e) {
      return renderOption(e[0], e[1], storedValue); })
    )
  ];
}

function tupleOf(x) {
  return [x, x];
}

function renderForm(action, settingsObj) {
  var timeMode = settingsObj.timeMode();
  var hasClock = timeMode === '1';
  var hasCorresp = timeMode === '2';

  var generalFieldset = [
    m('div.select_input',[
      renderSelect('Color:', 'color', [
        ['White', 'white'], ['Black', 'black'], ['Random', 'random']
      ], settingsObj.color),
    ]),
    m('div.select_input', [
      renderSelect('Variant:', 'variant', [
        ['Standard', '1'], ['Chess 960', '2'], ['King of the hill', '4']
      ], settingsObj.variant),
    ])
  ];
  if (settingsObj.level) {
    generalFieldset.push(m('div.select_input', [
      renderSelect('Level:', 'ailevel', [
        '1', '2', '3', '4', '5', '6', '7', '8'
        ].map(tupleOf), settingsObj.level)
    ]));
  }
  if (settingsObj.mode) {
    generalFieldset.push(m('div.select_input', [
      renderSelect('Mode:', 'mode', [
        ['Casual', '0'], ['Rated', '1']
      ], settingsObj.mode)
    ]));
  }

  var timeFieldset = [
    m('div.select_input', [
      renderSelect('Time mode:', 'timeMode', [
        ['Unlimited', '0'], ['Clock', '1'], ['Correspondance', '2']
      ], settingsObj.timeMode)
    ])
  ];
  if (settingsObj.time && settingsObj.increment && hasClock) {
    timeFieldset.push(
      m('div.select_input.inline', [
        renderSelect('Time:', 'time', [
          '2', '5', '10', '30', '60'
          ].map(tupleOf), settingsObj.time, false)
      ]),
      m('div.select_input.inline', [
        renderSelect('Increment:', 'increment', [
          '0', '1', '2', '3', '5', '10'
          ].map(tupleOf), settingsObj.increment, false)
      ])
    );
  }
  if (settingsObj.timePreset && hasClock) {
    timeFieldset.push(m('div.select_input', [
      renderSelect('Time|increment:', 'timepreset', [
        '3|0', '3|2', '5|0', '5|3', '10|0', '30|0'
        ].map(tupleOf), settingsObj.timePreset, false)
    ]));
  }
  if (hasCorresp) {
    timeFieldset.push(m('div.select_input', [
      renderSelect('Days per turn:', 'days', [
        '1', '2', '3', '5', '7', '10', '14'
        ].map(tupleOf), settingsObj.days, false)
    ]));
  }

  return m('form#new_game_form.form', {
    onsubmit: function(e) {
      e.preventDefault();
      playMenu.close();
      swapCard();
      action();
    }
  }, [
    m('fieldset', [
      m('div.nice-radio', renderRadio('Human', 'selected', 'human', settings.newGame.selected)),
      m('div.nice-radio', renderRadio('Computer', 'selected', 'computer', settings.newGame.selected))
    ]),
    m('fieldset', generalFieldset),
    m('fieldset#clock', timeFieldset),
    m('button', 'Valider')
  ]);
}

function renderAllGames(ctrl) {

  function cardDims() {
    var vp = utils.getViewportDims();
    var width = vp.vw * 85 / 100;
    var padding = vp.vw * 2.5 / 100;
    return {
      w: width + padding * 2,
      h: width + 144,
      innerW: width,
      padding: padding
    };
  }

  function renderViewOnlyBoard(fen, lastMove, color) {
    return m('div', { style: { height: cDim.innerW + 'px' }}, [
      utils.viewOnlyBoard(fen, lastMove, color)
    ]);
  }

  var nowPlaying = session.isConnected() ? session.get().nowPlaying : [];
  var cDim = cardDims();
  var cardStyle = {
    width: cDim.w + 'px',
    height: cDim.h + 'px',
    paddingLeft: cDim.padding + 'px',
    paddingRight: cDim.padding + 'px'
  };
  var nbCards = nowPlaying.length + 1;
  // scroller wrapper width
  // calcul is:
  // ((cardWidth + visible part of adjacent card) * nb of cards) +
  //   wrapper's marginLeft
  var wrapperWidth = ((cDim.w + cDim.padding * 2) * nbCards) +
    (cDim.padding * 2);

  var allGames = nowPlaying.map(function(g) {
    return m('div.card.standard', {
      style: cardStyle
    }, [
      renderViewOnlyBoard(g.fen, g.lastMove.match(/.{2}/g), g.color),
      m('div.infos', [
        m('div.icon-game.' + g.variant),
        m('div.description', [
          m('h2.title', g.variant),
          m('p', 'Contre ' + g.opponent.username),
          m('button', {
            config: utils.ontouchendScroll(function() {
              ctrl.joinGame(g.id);
              playMenu.close();
            })
          }, 'Reprendre la partie')
        ])
      ])
    ]);
  });

  var newGame = m('div.card.new-game', {
    class: newGameCardSwapped ? 'back_visible' : '',
    style: cardStyle,
  }, [
    m('div.container_flip', [
      m('div.front', [
        renderViewOnlyBoard(),
        m('div.infos',[
          m('div.description',[
            m('h2.title', 'New Game'),
            m('p', 'Lancer une nouvelle partie'),
            m('button', { config: utils.ontouchendScroll(swapCard) }, '+ Nouvelle partie')
          ])
        ])
      ]),
      m('div.back', [
        settings.newGame.selected() === 'human' ?
        renderForm(ctrl.seekHumanGame, settings.newGame.human) :
        renderForm(ctrl.startAIGame, settings.newGame.ai)
      ])
    ])
  ]);

  allGames.unshift(newGame);

  return m('div#all_games', {
    style: {
      width: wrapperWidth + 'px',
      marginLeft: (cDim.padding * 2) + 'px'
    }
  }, allGames);
}

playMenu.view = function(ctrl) {
  var children = [
    m('div.overlay-close',
      { config: utils.ontouchend(playMenu.close) },
    '+'),
    m('div#wrapper_games', {
      config:function(el, isUpdate, context) {
        var scroller = new iScroll(el, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: '.card',
          snapSpeed: 400,
          preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LABEL)$/
          }
        });

        context.onunload = function() {
          if (scroller) {
            scroller.destroy();
            scroller = null;
          }
        };
      }

    }, renderAllGames(ctrl))
  ];

  return m('div#game_menu.overlay.overlay-effect', {
    class: isOpen ? 'open' : '',
  }, children);
};

module.exports = playMenu;

},{"../session":"/Users/renaudbressand/Work/v2/lichobile/src/js/session.js","../settings":"/Users/renaudbressand/Work/v2/lichobile/src/js/settings.js","../utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js","iscroll":"/Users/renaudbressand/Work/v2/lichobile/node_modules/iscroll/build/iscroll.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/play/playView.js":[function(require,module,exports){
var roundView = require('../round/view/roundView');
var layout = require('../layout');
var menu = require('../menu');
var playMenu = require('./playMenu');
var utils = require('../utils');

module.exports = function(ctrl) {
  function header() {
    var children = [
      m('nav', [
        m('a.fa.fa-navicon', { config: utils.ontouchend(menu.toggle) }),
        ctrl.round ? m('h1.playing', ctrl.round.title) : m('h1', 'lichess.org'),
        m('a.fa.fa-star', {
          config: utils.ontouchend(playMenu.open)
        })
      ])
    ];

    if (ctrl.playing())
      children.push(roundView.renderHeader(ctrl.round));
    else {
      children.push(
        m('section.opponent', [
          m('div.infos', ctrl.vm.isSeekingGame ? [m('h2', 'Waiting for opponent...')] : null)
        ])
      );
    }

    return children;
  }

  function board() {
    if (ctrl.playing())
      return roundView.renderBoard(ctrl.round);
    else
      return roundView.renderBoard(ctrl);
  }

  function footer() {
    if (ctrl.playing()) return [roundView.renderFooter(ctrl.round)];
    else return [m('section.player', [m('div.infos')])];
  }

  return layout(ctrl, header, board, footer, menu.view, utils.partial(playMenu.view, ctrl));
};

},{"../layout":"/Users/renaudbressand/Work/v2/lichobile/src/js/layout.js","../menu":"/Users/renaudbressand/Work/v2/lichobile/src/js/menu.js","../round/view/roundView":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/view/roundView.js","../utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js","./playMenu":"/Users/renaudbressand/Work/v2/lichobile/src/js/play/playMenu.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/play/playXhr.js":[function(require,module,exports){
var utils = require('../utils');
var settings = require('../settings');

var baseUrl = window.apiEndPoint;

function aiGame() {
  var config = settings.newGame.ai;
  return m.request({
    url: baseUrl + '/setup/ai',
    method: 'POST',
    config: utils.xhrConfig,
    data: {
      variant: config.variant(),
      timeMode: config.timeMode(),
      days: config.days(),
      time: config.time(),
      increment: config.increment(),
      level: config.level(),
      color: config.color()
    }
  });
}

function seekHuman() {
  var config = settings.newGame.human;
  var preset = config.timePreset().split('|');
  return m.request({
    url: baseUrl + '/setup/hook/' + utils.lichessSri,
    method: 'POST',
    config: utils.xhrConfig,
    data: {
      variant: config.variant(),
      timeMode: config.timeMode(),
      days: config.days(),
      time: preset[0],
      increment: preset[1],
      color: config.color(),
      mode: config.mode()
    },
    deserialize: function(value) { return value; }
  });
}

function game(id) {
  return m.request({
    url: baseUrl + '/' + id,
    method: 'GET',
    config: utils.xhrConfig
  });
}

module.exports = {
  aiGame: aiGame,
  game: game,
  seekHuman: seekHuman
};

},{"../settings":"/Users/renaudbressand/Work/v2/lichobile/src/js/settings.js","../utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/clock/clockCtrl.js":[function(require,module,exports){
var formatClockTime = require('./clockView').formatClockTime;

module.exports = function(data, outOfTime) {
  var lastUpdate;
  var lastTick = {
    white: null,
    black: null
  };
  var clockEls = {
    white: null,
    black: null
  };

  function setLastUpdate() {
    lastUpdate = {
      white: data.white,
      black: data.black,
      at: new Date()
    };
  }
  setLastUpdate();

  this.data = data;

  this.update = function(white, black) {
    this.data.white = white;
    this.data.black = black;
    setLastUpdate();
  };

  this.tick = function(color) {
    this.data[color] = Math.max(0, lastUpdate[color] - (new Date() - lastUpdate.at) / 1000);
    // performance hack: we don't want to call m.redraw() on every clock tick
    var time = this.data[color] * 1000,
    el;
    if (clockEls[color])
      el = clockEls[color];
    else {
      el = document.getElementById('clock_' + color);
      clockEls[color] = el;
    }

    var oldSeconds = lastTick[color];
    var newSeconds = new Date(time).getSeconds();
    if ((oldSeconds !== newSeconds) || time < 10000) {
      el.innerHTML = formatClockTime(this, time);
    }
    lastTick[color] = newSeconds;

    if (this.data[color] === 0)
      outOfTime();
  }.bind(this);
};

},{"./clockView":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/clock/clockView.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/clock/clockView.js":[function(require,module,exports){
var classSet = require('chessground').util.classSet;

function prefixInteger(num, length) {
  return (num / Math.pow(10, length)).toFixed(length).substr(2);
}

function formatClockTime(ctrl, time) {
  var date = new Date(time);
  var minutes = prefixInteger(date.getUTCMinutes(), 2);
  var seconds = prefixInteger(date.getSeconds(), 2);
  var tenths;
  if (ctrl.data.showTenths && time < 10000) {
    tenths = Math.floor(date.getMilliseconds() / 100);
    return seconds + '.' + tenths;
  } else if (time >= 3600000) {
    var hours = prefixInteger(date.getUTCHours(), 2);
    return hours + ':' + minutes + ':' + seconds;
  } else {
    return minutes + ':' + seconds;
  }
}

module.exports = function(ctrl, color, runningColor) {
  var time = ctrl.data[color];
  return m('div', {
    class: 'clock ' + classSet({
      'outoftime': !time,
      'running': runningColor === color,
      'emerg': time < ctrl.data.emerg
    })
  }, [
    m('div.time', { id: 'clock_' + color }, formatClockTime(ctrl, time * 1000))
  ]);
};

module.exports.formatClockTime = formatClockTime;

},{"chessground":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/main.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/clock/index.js":[function(require,module,exports){
var ctrl = require('./clockCtrl');
var view = require('./clockView');

module.exports = {
  ctrl: ctrl,
  view: view
};

},{"./clockCtrl":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/clock/clockCtrl.js","./clockView":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/clock/clockView.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/data.js":[function(require,module,exports){
module.exports = function(old, cfg) {

  var data = cfg;

  if (data.clock) {
    data.clock.showTenths = data.pref.clockTenths;
    data.clock.showBar = data.pref.clockBar;
  }

  if (cfg.game.moves) data.game.moves = data.game.moves.split(' ');
  else data.game.moves = [];

  return data;
};

},{}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/ground.js":[function(require,module,exports){
var chessground = require('chessground');
var round = require('./round');
var sound = require('../sound');

function str2move(m) {
  return m ? [m.slice(0, 2), m.slice(2, 4)] : null;
}

function makeConfig(data, fen, flip) {
  return {
    fen: fen,
    orientation: flip ? data.opponent.color : data.player.color,
    turnColor: data.game.player,
    lastMove: str2move(data.game.lastMove),
    check: data.game.check,
    coordinates: data.pref.coords !== 0,
    highlight: {
      lastMove: data.pref.highlight,
      check: data.pref.highlight,
      dragOver: false
    },
    movable: {
      free: false,
      color: round.isPlayerPlaying(data) ? data.player.color : null,
      dests: round.parsePossibleMoves(data.possibleMoves),
      showDests: data.pref.destination
    },
    animation: {
      enabled: true,
      duration: data.pref.animationDuration
    },
    premovable: {
      enabled: data.pref.enablePremove,
      showDests: data.pref.destination,
      events: {
        set: m.redraw,
        unset: m.redraw
      }
    },
    draggable: {
      showGhost: data.pref.highlight,
      distance: 3,
      squareTarget: true
    },
    events: {
      capture: sound.capture
    }
  };
}

function make(data, fen, userMove) {
  var config = makeConfig(data, fen);
  config.movable.events = {
    after: userMove
  };
  config.viewOnly = data.player.spectator;
  return new chessground.controller(config);
}

function reload(ground, data, fen, flip) {
  ground.set(makeConfig(data, fen, flip));
}

function promote(ground, key, role) {
  var pieces = {};
  var piece = ground.data.pieces[key];
  if (piece && piece.role === 'pawn') {
    pieces[key] = {
      color: piece.color,
      role: role
    };
    ground.setPieces(pieces);
  }
}

function end(ground) {
  ground.stop();
}

module.exports = {
  make: make,
  reload: reload,
  promote: promote,
  end: end
};

},{"../sound":"/Users/renaudbressand/Work/v2/lichobile/src/js/sound.js","./round":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/round.js","chessground":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/main.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/hold.js":[function(require,module,exports){
// Register move hold times and send socket alerts

var holds = [];
var nb = 10;

var register = function(socket, hold) {
  if (!hold) return;
  holds.push(hold);
  if (holds.length > nb) {
    holds.shift();
    var mean = holds.reduce(function(a, b) {
      return a + b;
    }) / nb;
    if (mean > 3 && mean < 80) {
      var diffs = holds.map(function(a) {
        return Math.pow(a - mean, 2);
      });
      var sd = Math.sqrt(diffs.reduce(function(a, b) {
        return a + b;
      }) / nb);
      if (sd < 10) socket.send('hold', {
        mean: Math.round(mean),
        sd: Math.round(sd)
      });
    }
  }
};

module.exports = {
  register: register
};

},{}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/promotion.js":[function(require,module,exports){
var chessground = require('chessground');
var partial = chessground.util.partial;
var ground = require('./ground');
var xhr = require('./roundXhr');
var utils = require('../utils');

var promoting = false;

function start(ctrl, orig, dest, isPremove) {
  var piece = ctrl.chessground.data.pieces[dest];
  if (piece && piece.role === 'pawn' && (
    (dest[1] === '8' && ctrl.data.player.color === 'white') ||
    (dest[1] === '1' && ctrl.data.player.color === 'black'))) {
    if (ctrl.data.pref.autoQueen === 3 || (ctrl.data.pref.autoQueen === 2 && isPremove)) return false;
    m.startComputation();
    promoting = [orig, dest];
    m.endComputation();
    return true;
  }
  return false;
}

function finish(ctrl, role) {
  if (promoting) {
    ground.promote(ctrl.chessground, promoting[1], role);
    ctrl.sendMove(promoting[0], promoting[1], role);
  }
  promoting = false;
}

function cancel(ctrl) {
  if (promoting) xhr.reload(ctrl).then(ctrl.reload);
  promoting = false;
}

module.exports = {

  start: start,

  view: function(ctrl) {
    return promoting ? m('div.overlay', [m('div#promotion_choice', {
      config: utils.ontouchend(partial(cancel, ctrl)),
      style: { top: (utils.getViewportDims().vh - 100) / 2 + 'px' }
    }, ['queen', 'knight', 'rook', 'bishop'].map(function(role) {
      return m('div.cg-piece.' + role + '.' + ctrl.data.player.color, {
        config: utils.ontouchend(function(e) {
          e.stopPropagation();
          finish(ctrl, role);
        })
      });
    }))]) : null;
  }
};

},{"../utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js","./ground":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/ground.js","./roundXhr":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/roundXhr.js","chessground":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/main.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/replay/replayCtrl.js":[function(require,module,exports){
var Chess = require('chessli.js').Chess;
var round = require('../round');
var xhr = require('../roundXhr');

module.exports = function(root) {

  this.root = root;
  this.active = false;
  this.broken = false;
  this.ply = 0;

  var situationCache = {};

  var showFen = function() {
    try {
      var ply, move, cached, fen, lm, h = '', hash = '';
      for (ply = 1; ply <= this.ply; ply++) {
        move = root.data.game.moves[ply - 1];
        h += move;
        cached = situationCache[h];
        if (!cached) break;
        hash = h;
        fen = cached.fen;
      }
      if (!cached || ply < this.ply) {
        var chess = new Chess(
          fen || root.data.game.initialFen,
          root.data.game.variant.key === 'chess960' ? 1 : 0
        );
        for (ply = ply; ply <= this.ply; ply++) {
          move = root.data.game.moves[ply - 1];
          hash += move;
          lm = chess.move(move);
          situationCache[hash] = {
            fen: chess.fen(),
            check: chess.in_check(),
            lastMove: [lm.from, lm.to],
            turnColor: ply % 2 === 0 ? 'white' : 'black'
          };
        }
      }
      root.chessground.set(situationCache[hash]);
    } catch (e) {
      console.log(e);
      onBreak();
    }
  }.bind(this);

  var enable = function() {
    root.chessground.stop();
  }.bind(this);

  var disable = function() {
    root.chessground.set({
      movable: {
        color: round.isPlayerPlaying(root.data) ? root.data.player.color : null,
        dests: round.parsePossibleMoves(root.data.possibleMoves)
      }
    });
  }.bind(this);

  var onBreak = function() {
    disable();
    this.active = false;
    this.broken = true;
    xhr.reload(root).then(root.reload);
  }.bind(this);

  this.onReload = function(cfg) {
    if (this.active && cfg.game.moves.join() !== root.data.game.moves.join()) this.active = false;
  }.bind(this);

  this.jump = function(ply) {
    if (this.broken) return;
    if (this.ply === ply || ply < 1 || ply > root.data.game.moves.length) return;
    this.active = ply !== root.data.game.moves.length;
    this.ply = ply;
    if (this.active) enable();
    else disable();
    showFen();
  }.bind(this);
};

},{"../round":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/round.js","../roundXhr":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/roundXhr.js","chessli.js":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessli.js/chess.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/replay/replayView.js":[function(require,module,exports){
var utils = require('../../utils');

function renderBackwardButton(ctrl, curPly) {
  var prevPly = curPly - 1;
  var enabled = curPly !== prevPly && prevPly >= 1;
  return m('button.game_action[data-icon=I]', {
    config: utils.ontouchend(function() {
      var ply = ctrl.active ? ctrl.ply : ctrl.root.data.game.moves.length;
      ctrl.jump(ply - 1);
    }),
    class: utils.classSet({
      disabled: ctrl.broken || !enabled
    })
  });
}

function renderForwardButton(ctrl, curPly, nbMoves) {
  var nextPly = curPly + 1;
  var enabled = curPly !== nextPly && nextPly <= nbMoves;
  return m('button.game_action[data-icon=H]', {
    config: utils.ontouchend(function() {
      var ply = ctrl.active ? ctrl.ply : ctrl.root.data.game.moves.length;
      ctrl.jump(ply + 1);
    }),
    class: utils.classSet({
      disabled: ctrl.broken || !enabled
    })
  });
}

module.exports.renderButtons = function(ctrl) {
  var nbMoves = ctrl.root.data.game.moves.length;
  var curPly = ctrl.active ? ctrl.ply : nbMoves;
  return [
    renderBackwardButton(ctrl, curPly),
    renderForwardButton(ctrl, curPly, nbMoves)
  ];
};

},{"../../utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/round.js":[function(require,module,exports){
var mapValues = require('lodash-node/modern/objects/mapValues');
var status = require('./status');

function parsePossibleMoves(possibleMoves) {
  return mapValues(possibleMoves, function(moves) {
    return moves.match(/.{2}/g);
  });
}

function playable(data) {
  return data.game.status.id < status.ids.aborted;
}

function isPlayerPlaying(data) {
  return playable(data) && !data.player.spectator;
}

function isPlayerTurn(data) {
  return isPlayerPlaying(data) && data.game.player === data.player.color;
}

function mandatory(data) {
  return !!data.tournament;
}

function playedTurns(data) {
  return data.game.turns - data.game.startedAtTurn;
}

function abortable(data) {
  return playable(data) && playedTurns(data) < 2 && !mandatory(data);
}

function takebackable(data) {
  return playable(data) && data.takebackable && !data.tournament && playedTurns(data) > 1 && !data.player.proposingTakeback && !data.opponent.proposingTakeback;
}

function drawable(data) {
  return playable(data) && data.game.turns >= 2 && !data.player.offeringDraw && !data.opponent.ai;
}

function resignable(data) {
  return playable(data) && !abortable(data);
}

function moretimeable(data) {
  return data.clock && isPlayerPlaying(data) && !mandatory(data);
}

function replayable(data) {
  return data.source === 'import' || status.finished(data);
}

function getPlayer(data, color) {
  if (data.player.color === color) return data.player;
  if (data.opponent.color === color) return data.opponent;
  return null;
}

function setIsGone(data, color, isGone) {
  var player = getPlayer(data, color);
  isGone = isGone && !player.ai;
  player.isGone = isGone;
  if (!isGone && player.user) player.user.online = true;
}

function setOnGame(data, color, onGame) {
  var player = getPlayer(data, color);
  onGame = onGame || player.ai;
  player.onGame = onGame;
  if (onGame) setIsGone(data, color, false);
}

function nbMoves(data, color) {
  return Math.floor((data.game.turns + (color === 'white' ? 1 : 0)) / 2);
}

module.exports = {
  isPlayerPlaying: isPlayerPlaying,
  isPlayerTurn: isPlayerTurn,
  playable: playable,
  abortable: abortable,
  takebackable: takebackable,
  drawable: drawable,
  resignable: resignable,
  moretimeable: moretimeable,
  mandatory: mandatory,
  replayable: replayable,
  getPlayer: getPlayer,
  parsePossibleMoves: parsePossibleMoves,
  nbMoves: nbMoves,
  setOnGame: setOnGame,
  setIsGone: setIsGone
};

},{"./status":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/status.js","lodash-node/modern/objects/mapValues":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/objects/mapValues.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/roundCtrl.js":[function(require,module,exports){
var throttle = require('lodash-node/modern/functions/throttle');
var chessground = require('chessground');
var partial = chessground.util.partial;
var data = require('./data');
var round = require('./round');
var ground = require('./ground');
var socket = require('./socket');
var promotion = require('./promotion');
var hold = require('./hold');
var replayCtrl = require('./replay/replayCtrl');
var clockCtrl = require('./clock/clockCtrl');
var i18n = require('../i18n');
var status = require('./status');

module.exports = function(cfg, router, socketSend) {
  var clockIntervId;

  this.data = data({}, cfg);

  this.vm = {
    flip: false,
    reloading: false,
    redirecting: false,
    showingActions: false
  };

  this.socket = new socket(socketSend, this);

  this.flip = function() {
    this.vm.flip = !this.vm.flip;
    this.chessground.set({
      orientation: this.vm.flip ? this.data.opponent.color : this.data.player.color
    });
  }.bind(this);

  this.setTitle = function() {
    if (this.data.player.spectator) return;
    if (status.finished(this.data)) {
      this.title = i18n('gameOver');
    } else if (round.isPlayerTurn(this.data)) {
      this.title = i18n('yourTurn');
    } else {
      this.title = i18n('waitingForOpponent');
    }
  };
  this.setTitle();

  this.sendMove = function(orig, dest, prom) {
    var move = {
      from: orig,
      to: dest
    };
    if (prom) move.promotion = prom;
    this.socket.send('move', move, {
      ackable: true
    });
  }.bind(this);

  this.userMove = function(orig, dest, meta) {
    hold.register(this.socket, meta.holdTime);
    if (!promotion.start(this, orig, dest, meta.premove)) this.sendMove(orig, dest);
  }.bind(this);

  this.apiMove = function(o) {
    if (this.replay.active) this.replay.vm.late = true;
    else this.chessground.apiMove(o.from, o.to);
    if (this.data.game.threefold) this.data.game.threefold = false;
    this.data.game.moves.push(o.san);
    round.setOnGame(this.data, o.color, true);
    m.redraw();
  }.bind(this);

  this.chessground = ground.make(this.data, cfg.game.fen, this.userMove);

  this.reload = function(cfg) {
    this.replay.onReload(cfg);
    this.data = data(this.data, cfg);
    if (!this.replay.active) ground.reload(this.chessground, this.data, cfg.game.fen, this.vm.flip);
  }.bind(this);

  this.clock = this.data.clock ? new clockCtrl(
    this.data.clock,
    this.data.player.spectator ? function() {} : throttle(partial(this.socket.send, 'outoftime'), 500)
  ) : false;

  this.isClockRunning = function() {
    return this.data.clock && round.playable(this.data) &&
      ((this.data.game.turns - this.data.game.startedAtTurn) > 1 || this.data.clock.running);
  }.bind(this);

  this.clockTick = function() {
    if (this.isClockRunning()) this.clock.tick(this.data.game.player);
  }.bind(this);

  if (this.clock) clockIntervId = setInterval(this.clockTick, 100);

  this.replay = new replayCtrl(this);

  this.router = router;

  this.onunload = function() {
    if (clockIntervId) clearInterval(clockIntervId);
  };
};

},{"../i18n":"/Users/renaudbressand/Work/v2/lichobile/src/js/i18n.js","./clock/clockCtrl":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/clock/clockCtrl.js","./data":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/data.js","./ground":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/ground.js","./hold":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/hold.js","./promotion":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/promotion.js","./replay/replayCtrl":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/replay/replayCtrl.js","./round":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/round.js","./socket":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/socket.js","./status":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/status.js","chessground":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/main.js","lodash-node/modern/functions/throttle":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/throttle.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/roundXhr.js":[function(require,module,exports){
var utils = require('../utils');

var baseUrl = window.apiEndPoint;

function reload(ctrl) {
  ctrl.vm.reloading = true;
  m.redraw();
  var req = m.request({
    method: 'GET',
    url: baseUrl + ctrl.data.url.round,
    config: utils.xhrConfig
  });
  req.then(function() {
    ctrl.vm.reloading = false;
  }, function(err) {
    console.log(err);
  });
  return req;
}

module.exports = {
  reload: reload
};

},{"../utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/socket.js":[function(require,module,exports){
var round = require('./round');
var ground = require('./ground');
var xhr = require('./roundXhr');
var sound = require('../sound');

module.exports = function(send, ctrl) {

  this.send = send;

  var handlers = {
    possibleMoves: function(o) {
      ctrl.data.possibleMoves = o;
      if (!ctrl.replay.active) ctrl.chessground.set({
        movable: {
          dests: round.parsePossibleMoves(o)
        }
      });
    },
    state: function(o) {
      if (!ctrl.replay.active) ctrl.chessground.set({
        turnColor: o.color
      });
      ctrl.data.game.player = o.color;
      ctrl.data.game.turns = o.turns;
      m.redraw();
      ctrl.setTitle();
    },
    move: function(o) {
      ctrl.apiMove(o);
      sound.move();
    },
    premove: function() {
      ctrl.chessground.playPremove();
    },
    castling: function(o) {
      if (ctrl.replay.active) return;
      var pieces = {};
      pieces[o.king[0]] = null;
      pieces[o.rook[0]] = null;
      pieces[o.king[1]] = {
        role: 'king',
        color: o.color
      };
      pieces[o.rook[1]] = {
        role: 'rook',
        color: o.color
      };
      ctrl.chessground.setPieces(pieces);
    },
    check: function(o) {
      if (!ctrl.replay.active) ctrl.chessground.set({
        check: o
      });
    },
    enpassant: function(o) {
      var pieces = {};
      pieces[o] = null;
      if (!ctrl.replay.active) ctrl.chessground.setPieces(pieces);
      sound.capture();
    },
    reload: function() {
      xhr.reload(ctrl).then(ctrl.reload);
    },
    redirect: function() {
      ctrl.vm.redirecting = true;
      m.redraw();
    },
    threefoldRepetition: function() {
      ctrl.data.game.threefold = true;
      m.redraw();
    },
    promotion: function(o) {
      ground.promote(ctrl.chessground, o.key, o.pieceClass);
    },
    clock: function(o) {
      if (ctrl.clock) ctrl.clock.update(o.white, o.black);
    },
    end: function() {
      ground.end(ctrl.chessground);
      xhr.reload(ctrl).then(ctrl.reload);
      if (!ctrl.data.player.spectator) sound.dong();
    },
    gone: function(isGone) {
      // if (!ctrl.data.opponent.ai) {
      //   round.setIsGone(ctrl.data, ctrl.data.opponent.color, isGone);
      //   m.redraw();
      // }
    },
  };

  this.receive = function(type, data) {
    if (handlers[type]) {
      handlers[type](data);
      return true;
    }
    return false;
  }.bind(this);
};

},{"../sound":"/Users/renaudbressand/Work/v2/lichobile/src/js/sound.js","./ground":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/ground.js","./round":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/round.js","./roundXhr":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/roundXhr.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/status.js":[function(require,module,exports){
// https://github.com/ornicar/scalachess/blob/master/src/main/scala/Status.scala

var i18n = require('../i18n');

var ids = {
  created: 10,
  started: 20,
  aborted: 25,
  mate: 30,
  resign: 31,
  stalemate: 32,
  timeout: 33,
  draw: 34,
  outoftime: 35,
  cheat: 36,
  noStart: 37,
  variantEnd: 60
};

function started(data) {
  return data.game.status.id >= ids.started;
}

function finished(data) {
  return data.game.status.id >= ids.mate;
}

function aborted(data) {
  return data.game.status.id === ids.aborted;
}

function toLabel(data) {
  switch (data.game.status.name) {
    case 'started':
      return i18n('playingRightNow');
    case 'aborted':
      return i18n('gameAborted');
    case 'mate':
      return i18n('checkmate');
    case 'resign':
      return i18n(data.game.winner === 'white' ? 'blackResigned' : 'whiteResigned');
    case 'stalemate':
      return i18n('stalemate');
    case 'timeout':
      switch (data.game.winner) {
        case 'white':
          return i18n('blackLeftTheGame');
        case 'black':
          return i18n('whiteLeftTheGame');
        default:
          return i18n('draw');
      }
      break;
    case 'draw':
      return i18n('draw');
    case 'outoftime':
      return i18n('timeOut');
    case 'noStart':
      return (data.game.winner === 'white' ? 'Black' : 'White') + ' didn\'t move';
    case 'cheat':
      return 'Cheat detected';
    case 'variantEnd':
      switch (data.game.variant.key) {
        case 'kingOfTheHill':
          return 'King in the center';
        case 'threeCheck':
          return 'Three checks';
        default:
          return 'Variant ending';
      }
      break;
    default:
      return data.game.status.name;
  }
}

module.exports = {
  ids: ids,
  started: started,
  finished: finished,
  aborted: aborted,
  toLabel: toLabel
};

},{"../i18n":"/Users/renaudbressand/Work/v2/lichobile/src/js/i18n.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/view/buttons.js":[function(require,module,exports){
var round = require('../round');
var status = require('../status');
var utils = require('../../utils');
var throttle = require('lodash-node/modern/functions/throttle');

module.exports = {
  standard: function(ctrl, condition, icon, hint, socketMsg) {
    return condition(ctrl.data) ? m('button', {
      class: 'button hint--bottom ' + socketMsg,
      'data-hint': ctrl.trans(hint),
      config: utils.ontouchend(utils.partial(ctrl.socket.send, socketMsg, null))
    }, m('span[data-icon=' + icon + ']')) : null;
  },
  forceResign: function(ctrl) {
    if (!ctrl.data.opponent.ai && ctrl.data.clock && ctrl.data.opponent.isGone && round.resignable(ctrl.data))
      return m('div.force_resign_zone', [
        ctrl.trans('theOtherPlayerHasLeftTheGameYouCanForceResignationOrWaitForHim'),
        m('br'),
        m('a.button', {
          config: utils.ontouchend(utils.partial(ctrl.socket.send, 'resign-force', null)),
        }, ctrl.trans('forceResignation')),
        m('a.button', {
          config: utils.ontouchend(utils.partial(ctrl.socket.send, 'draw-force', null)),
        }, ctrl.trans('forceDraw'))
      ]);
  },
  threefoldClaimDraw: function(ctrl) {
    if (ctrl.data.game.threefold) return m('div#claim_draw_zone', [
      ctrl.trans('threefoldRepetition'),
      m.trust('&nbsp;'),
      m('a.button', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'draw-claim', null))
      }, ctrl.trans('claimADraw'))
    ]);
  },
  cancelDrawOffer: function(ctrl) {
    if (ctrl.data.player.offeringDraw) return m('div.negotiation', [
      ctrl.trans('drawOfferSent') + ' ',
      m('a', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'draw-no', null))
      }, ctrl.trans('cancel'))
    ]);
  },
  answerOpponentDrawOffer: function(ctrl) {
    if (ctrl.data.opponent.offeringDraw) return m('div.negotiation', [
      ctrl.trans('yourOpponentOffersADraw'),
      m('br'),
      m('a.button[data-icon=E]', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'draw-yes', null))
      }, ctrl.trans('accept')),
      m.trust('&nbsp;'),
      m('a.button[data-icon=L]', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'draw-no', null))
      }, ctrl.trans('decline')),
    ]);
  },
  cancelTakebackProposition: function(ctrl) {
    if (ctrl.data.player.proposingTakeback) return m('div.negotiation', [
      ctrl.trans('takebackPropositionSent') + ' ',
      m('a', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'takeback-no', null))
      }, ctrl.trans('cancel'))
    ]);
  },
  answerOpponentTakebackProposition: function(ctrl) {
    if (ctrl.data.opponent.proposingTakeback) return m('div.negotiation', [
      ctrl.trans('yourOpponentProposesATakeback'),
      m('br'),
      m('a.button[data-icon=E]', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'takeback-yes', null))
      }, ctrl.trans('accept')),
      m.trust('&nbsp;'),
      m('a.button[data-icon=L]', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'takeback-no', null))
      }, ctrl.trans('decline')),
    ]);
  },
  rematch: function(ctrl) {
    if ((status.finished(ctrl.data) || status.aborted(ctrl.data)) && !ctrl.data.tournament) {
      if (ctrl.data.opponent.onGame || ctrl.data.game.perf === 'correspondence') {
        return m('a.button.hint--bottom', {
          'data-hint': ctrl.trans('playWithTheSameOpponentAgain'),
          config: utils.ontouchend(utils.partial(ctrl.socket.send, 'rematch-yes', null))
        }, ctrl.trans('rematch'));
      } else {
        return m('a.button.disabled', ctrl.trans('rematch'));
      }
    }

  },
  answerOpponentRematch: function(ctrl) {
    if (ctrl.data.opponent.offeringRematch) return [
      ctrl.trans('yourOpponentWantsToPlayANewGameWithYou'),
      m('a.glowing.button.fat.hint--bottom', {
        'data-hint': ctrl.trans('playWithTheSameOpponentAgain'),
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'rematch-yes', null))
      }, ctrl.trans('joinTheGame')),
      m('a.declineInvitation.button', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'rematch-no', null))
      }, ctrl.trans('declineInvitation'))
    ];
  },
  cancelRematch: function(ctrl) {
    if (ctrl.data.player.offeringRematch) return [
      ctrl.trans('rematchOfferSent'),
      m('br'),
      ctrl.trans('waitingForOpponent'),
      m('a.button', {
        config: utils.ontouchend(utils.partial(ctrl.socket.send, 'rematch-no', null))
      }, ctrl.trans('cancelRematchOffer'))
    ];
  },
  viewRematch: function(ctrl) {
    if (ctrl.data.game.rematch) return m('a.viewRematch.button[data-icon=v]', {
      href: ctrl.router.Round.watcher(ctrl.data.game.rematch, ctrl.data.opponent.color).url
    }, ctrl.trans('viewRematch'));
  },
  joinRematch: function(ctrl) {
    if (ctrl.data.game.rematch) return [
      ctrl.trans('rematchOfferAccepted'),
      m('a.button.fat.hint--bottom', {
        'data-hint': ctrl.trans('playWithTheSameOpponentAgain'),
        href: ctrl.router.Round.watcher(ctrl.data.game.rematch, ctrl.data.opponent.color).url
      }, ctrl.trans('joinTheGame'))
    ];
  },
  backToTournament: function(ctrl) {
    if (ctrl.data.tournament && ctrl.data.tournament.running) return m('a[data-icon=G].button.strong.glowing', {
      href: '/tournament/' + ctrl.data.tournament.id
    }, ctrl.trans('backToTournament'));
  },
  viewTournament: function(ctrl) {
    if (ctrl.data.tournament) return m('a.viewTournament.button', {
      href: '/tournament/' + ctrl.data.tournament.id
    }, ctrl.trans('viewTournament'));
  },
  moretime: function(ctrl) {
    if (round.moretimeable(ctrl.data)) return m('a.moretime.hint--bottom-left', {
      'data-hint': ctrl.trans('giveNbSeconds', ctrl.data.clock.moretime),
      config: utils.ontouchend(throttle(utils.partial(ctrl.socket.send, 'moretime', null), 600))
    }, m('span[data-icon=O]'));
  },
  analysis: function(ctrl) {
    if (round.replayable(ctrl.data)) return m('a.button.replay_and_analyse', {
      config: utils.ontouchend(utils.partial(ctrl.socket.send, 'rematch-no', null)),
      href: ctrl.router.Round.watcher(ctrl.data.game.id, ctrl.data.player.color).url
    }, ctrl.trans('analysis'));
  }
};

},{"../../utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js","../round":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/round.js","../status":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/status.js","lodash-node/modern/functions/throttle":"/Users/renaudbressand/Work/v2/lichobile/node_modules/lodash-node/modern/functions/throttle.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/round/view/roundView.js":[function(require,module,exports){
var chessground = require('chessground');
var clock = require('../clock');
var renderPromotion = require('../promotion').view;
var utils = require('../../utils');
var i18n = require('../../i18n');
var buttons = require('./buttons');
var replayView = require('../replay/replayView');

function ratingDiff(player) {
  if (typeof player.ratingDiff === 'undefined') return null;
  if (player.ratingDiff === 0) return m('span.rp.null', 0);
  if (player.ratingDiff > 0) return m('span.rp.up', '+' + player.ratingDiff);
  if (player.ratingDiff < 0) return m('span.rp.down', player.ratingDiff);
}

function renderUser(ctrl, player) {
  return player.user ? (
    (player.user.title ? player.user.title + ' ' : '') + player.user.username
  ) : 'Anonymous';
}

function renderMaterial(ctrl, color) {
  var material = chessground.board.getMaterialDiff(ctrl.chessground.data)[color];
  var children = [];
  for (var role in material) {
    var piece = m('div.' + role);
    var count = material[role];
    var content;
    if (count === 1) content = piece;
    else {
      content = [];
      for (var i = 0; i < count; i++) content.push(piece);
    }
    children.push(m('div.tomb', content));
  }
  return m('div.material', children);
}

function renderAntagonist(ctrl, player) {
  return m('section.antagonist', [
    m('div.infos', [
      m('h2', player.ai ? i18n('aiNameLevelAiLevel', 'Stockfish', player.ai) : renderUser(ctrl, player)),
      m('div', [
        player.user ? m('h3.rating', [
          player.rating,
          ratingDiff(player)
        ]) : null,
        renderMaterial(ctrl, player.color)
      ])
    ]),
    ctrl.clock ? clock.view(ctrl.clock, player.color, ctrl.isClockRunning() ? ctrl.data.game.player : null) : null
  ]);
}

function renderPlayerActions(ctrl) {
  return m('div.overlay', {
    class: utils.classSet({
      hide: !ctrl.vm.showingActions
    })
  }, [
    m('div.overlay-close',
      { config: utils.ontouchend(function() { ctrl.vm.showingActions = false; }) },
    '+'),
    m('div#player_controls', [
      m('button.resign[data-icon=b]', 'Resign'),
      m('button.draw[data-icon=2]', 'Draw'),
      m('button.takeback[data-icon=i]', 'Takeback')
    ])
  ]);
}

function renderGameActions(ctrl) {
  var actions = [
    m('button.game_action[data-icon=O]', {
      config: utils.ontouchend(function() { ctrl.vm.showingActions = true; })
    }),
    m('button.game_action[data-icon=c].disabled'),
    replayView.renderButtons(ctrl.replay),
    renderPlayerActions(ctrl)
  ];

  return m('section#game_actions', [
    m('div', actions)
  ]);
}

function renderFooter(ctrl) {
  return [
    renderAntagonist(ctrl, ctrl.data.player),
    renderGameActions(ctrl)
  ];
}

function renderHeader(ctrl) {
  return renderAntagonist(ctrl, ctrl.data.opponent);
}

function renderBoard(ctrl) {
  var vw = utils.getViewportDims().vw;
  return m('section#board.grey.merida', {
    style: {
      height: vw + 'px'
    }
  }, [
    chessground.view(ctrl.chessground), renderPromotion(ctrl)
  ]);
}

module.exports = {
  renderBoard: renderBoard,
  renderFooter: renderFooter,
  renderHeader: renderHeader
};

},{"../../i18n":"/Users/renaudbressand/Work/v2/lichobile/src/js/i18n.js","../../utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js","../clock":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/clock/index.js","../promotion":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/promotion.js","../replay/replayView":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/replay/replayView.js","./buttons":"/Users/renaudbressand/Work/v2/lichobile/src/js/round/view/buttons.js","chessground":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/main.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/session.js":[function(require,module,exports){
var utils = require('./utils');

var session = null;

function isConnected() {
  return !!session;
}

function get() {
  return session;
}

function login(username, password) {
  return m.request({
    url: window.apiEndPoint + '/login',
    method: 'POST',
    config: utils.xhrConfig,
    data: {
      username: username,
      password: password
    }
  }).then(function(data) {
    session = data;
  }, function(error) {
    console.log(error);
  });
}

function logout() {
  return m.request({
    url: window.apiEndPoint + '/logout',
    method: 'GET',
    config: utils.xhrConfig,
    deserialize: function(value) { return value; }
  }).then(function() {
    session = null;
  }, function(error) {
    console.log(error);
  });
}

function refresh() {
  return m.request({
    url: window.apiEndPoint + '/account/info',
    method: 'GET',
    config: utils.xhrConfig
  }).then(function(data) {
    session = data;
  }, function(error) {
    console.log(error);
  });
}

module.exports = {
  isConnected: isConnected,
  login: login,
  logout: logout,
  refresh: refresh,
  get: get
};

},{"./utils":"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/settings.js":[function(require,module,exports){
var store = require('./storage');

function localstorageprop(key, initialValue) {
  function getset() {
    if (arguments.length) store.set(key, arguments[0]);
    var ret = store.get(key);
    if (ret !== null) return ret;
    else return initialValue;
  }

  return getset;
}

var settings = {
  general: [
    { label: "Disable sleep", active: localstorageprop('settings.disableSleep') },
    { label: "Show last move", active: localstorageprop('settings.showLastMove') },
    { label: "Show possible destinations", active: localstorageprop('settings.showDests') },
    { label: "Show coordinates", active: localstorageprop('settings.showCoords') },
    { label: "Threefold auto draw", active: localstorageprop('settings.threeFoldAutoDraw') },
    { label: "Sound", active: localstorageprop('settings.sound') }
  ],
  newGame: {
    selected: localstorageprop('settings.game.selected', 'human'),
    ai: {
      color: localstorageprop('settings.game.ai.color', 'random'),
      variant: localstorageprop('settings.game.ai.variant', '1'),
      timeMode: localstorageprop('settings.game.ai.clock', '1'),
      time: localstorageprop('settings.game.ai.time', '10'),
      increment: localstorageprop('settings.game.ai.increment', '0'),
      days: localstorageprop('settings.game.ai.days', '2'),
      level: localstorageprop('settings.game.ai.aiLevel', '3')
    },
    human: {
      color: localstorageprop('settings.game.human.color', 'random'),
      variant: localstorageprop('settings.game.human.variant', '1'),
      timeMode: localstorageprop('settings.game.human.clock', '1'),
      timePreset: localstorageprop('settings.game.human.timePreset', '5|0'),
      days: localstorageprop('settings.game.human.days', '2'),
      mode: localstorageprop('settings.game.human.mode', '0')
    }
  }
};

module.exports = settings;

},{"./storage":"/Users/renaudbressand/Work/v2/lichobile/src/js/storage.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/sound.js":[function(require,module,exports){
'use strict';

var settings = require('./settings');

function play(file, volume) {
  var a, soundsLoc;
  if (window.cordova) {
    soundsLoc = (window.device.platform === 'Android') ?
    '/android_asset/www/sounds' : 'sounds';
    a = new window.Media(soundsLoc + '/' + file, function() {
      a.release();
    }, function(err) {
      console.log(err);
    });
    a.setVolume(volume);
    a.play();
  } else {
    a = new window.Audio('sounds/' + file);
    a.volume = volume;
    a.play();
  }
}

var audio = {
  move: [ 'move.mp3', 1 ],
  capture: [ 'capture.mp3', 1 ],
  dong: [ 'dong.mp3', 1 ],
};

// var canPlay = window.cordova || (!!audio.move1.canPlayType && audio.move1.canPlayType('audio/mpeg'));

function shouldPlay() {
  // TODO
  // return settings.general.sound();
  return true;
}

module.exports = {
  move: function() {
    if (shouldPlay()) {
      play.apply(null, audio.move);
    }
  },
  capture: function() {
    if (shouldPlay()) play.apply(null, audio.capture);
  },
  dong: function() {
    if (shouldPlay) play.apply(null, audio.dong);
  }
};

},{"./settings":"/Users/renaudbressand/Work/v2/lichobile/src/js/settings.js"}],"/Users/renaudbressand/Work/v2/lichobile/src/js/storage.js":[function(require,module,exports){
function withStorage(f) {
  // can throw an exception when storage is full
  try {
    return !!window.localStorage ? f(window.localStorage) : null;
  } catch (e) {}
}

module.exports = {
  get: function(k) {
    return withStorage(function(s) {
      return JSON.parse(s.getItem(k));
    });
  },
  remove: function(k) {
    withStorage(function(s) {
      s.removeItem(k);
    });
  },
  set: function(k, v) {
    withStorage(function(s) {
      s.removeItem(k);
      s.setItem(k, JSON.stringify(v));
    });
  }
};

},{}],"/Users/renaudbressand/Work/v2/lichobile/src/js/utils.js":[function(require,module,exports){
'use strict';

var utils = {};
var mButton = require('mobile-button');
var chessground = require('chessground');

// softkeyboard
var hiddenA = document.createElement('a');
hiddenA.href = "#";
document.body.appendChild(hiddenA);

utils.hideKeyboard = function() {
  hiddenA.focus();
};

utils.lichessSri = Math.random().toString(36).substring(2);

utils.userFullNameToId = function(fullName) {
  var split = fullName.split(' ');
  var id = split.length === 1 ? split[0] : split[1];
  return id.toLowerCase();
};

utils.serializeQueryParameters = function(obj) {
  var str = "";
  for (var key in obj) {
    if (str !== "") {
      str += "&";
    }
    str += key + "=" + obj[key];
  }
  return str;
};

utils.xhrConfig = function(xhr) {
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Accept', 'application/vnd.lichess.v1+json');
};


function partialApply(fn, args) {
  return fn.bind.apply(fn, [null].concat(args));
}

utils.partial = function() {
  return partialApply(arguments[0], Array.prototype.slice.call(arguments, 1));
};

// convenience function to bind a button handler with mithril
utils.mbind = function(scrollable, handler) {
  return function(el, isUpdate, context) {
    if (!isUpdate) {
      var options = {
        el: el,
        f: function(e) {
          m.startComputation();
          handler(e);
          m.endComputation();
        },
        monotouchable: true,
        setActiveCls: false
      };
      if (scrollable) options.tolerance = 5;
      var constr = scrollable ? mButton.ScrollableX.Touchend : mButton.Touchend;
      var button = new constr(options);
    }

    context.onunload = function() {
      if (button) button.unbind();
    };
  };
};

utils.ontouchend = utils.partial(utils.mbind, false);
utils.ontouchendScroll = utils.partial(utils.mbind, true);


var viewPortDims = null;
utils.getViewportDims = function() {
  if (viewPortDims) return viewPortDims;
  var e = document.documentElement;
  viewPortDims = { vw: e.clientWidth, vh: e.clientHeight };
  return viewPortDims;
};

utils.viewOnlyBoard = function(fen, lastMove, orientation) {
  var ctrl = new chessground.controller({
    viewOnly: true,
    minimalDom: true,
    coordinates: false,
    fen: fen,
    lastMove: lastMove,
    orientation: orientation
  });
  return m('div.board.grey.merida', [
    chessground.view(ctrl)
  ]);
};

utils.classSet = function(classes) {
  var arr = [];
  for (var i in classes) {
    if (classes[i]) arr.push(i);
  }
  return arr.join(' ');
};

module.exports = utils;

},{"chessground":"/Users/renaudbressand/Work/v2/lichobile/node_modules/chessground/src/main.js","mobile-button":"/Users/renaudbressand/Work/v2/lichobile/node_modules/mobile-button/lib/index.js"}]},{},["./src/js/main.js"])