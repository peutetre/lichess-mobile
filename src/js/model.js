'use strict';

var _ = require('lodash');
var ajax = require('./ajax');

// Object that holds game data and receives updates from server
var Game = function(data) {
  var game = {};
  var player = {};
  var opponent = {};
  var possibleMoves = {};
  var url = {};
  var clock = {};

  if (_.isObject(data)) {
    game = data.game;
    player = data.player;
    opponent = data.opponent;
    possibleMoves = data.possibleMoves;
    clock = data.clock;
    url = data.url;
  }

  function fullId() {
    if (player.id) return game.id + player.id;
    return game.id;
  }

  function updateState(state) {
    game.player = state.color;
    game.turns = state.turns;
  }

  function getFen() {
    return game.fen;
  }

  function getPossibleMoves() {
    return _.mapValues(possibleMoves, function(moves) {
      return moves.match(/.{1,2}/g);
    });
  }

  function setPossibleMoves(moves) {
    possibleMoves = moves;
  }

  function isMyTurn() {
    return game.player === player.color;
  }

  function isMoveAllowed(from, to) {
    var m = possibleMoves[from];
    return m && _.indexOf(m.match(/.{1,2}/g), to) !== -1;
  }

  function lastPlayer() {
    return (game.player === 'white') ? 'black' : 'white';
  }

  function currentPlayer() {
    return game.player;
  }

  function currentTurn() {
    return game.turns;
  }

  function startedAtTurn() {
    return game.startedAtTurn;
  }

  function lastMove() {
    return game.lastMove ? {
      from: game.lastMove.substr(0, 2),
      to: game.lastMove.substr(2, 2)
    } : null;
  }

  function hasClock() {
    return game.clock;
  }

  function finish() {
    game.finished = true;
  }

  function isFinished() {
    return game.finished;
  }

  function isStarted() {
    return game.started;
  }

  return {
    // public static properties
    url: url,
    player: player,
    opponent: opponent,
    clock: clock,
    speed: game.speed,
    perf: game.perf,
    variant: game.variant,

    // public methods
    updateState: updateState,
    finish: finish,

    fullId: fullId,
    getFen: getFen,
    getPossibleMoves: getPossibleMoves,
    setPossibleMoves: setPossibleMoves,
    isMyTurn: isMyTurn,
    isMoveAllowed: isMoveAllowed,
    startedAtTurn: startedAtTurn,
    currentTurn: currentTurn,
    currentPlayer: currentPlayer,
    lastPlayer: lastPlayer,
    lastMove: lastMove,
    hasClock: hasClock,
    isStarted: isStarted,
    isFinished: isFinished
  };
};

module.exports = {

  negate: function(color) {
    return ( color === "white" ? "black" : "white" );
  },

  aiGame: function() {
    return ajax({ url: '/setup/ai', method: 'POST', data: {
      variant: '1',
      clock: true,
      time: 5,
      increment: 3,
      level: 1,
      color: 'white'
    }}).then(function(data) {
      return Game(data);
    }, function(err) {
      console.log('post request to lichess failed', err);
    });
  },

  game: function (id) {
    return ajax({ url: id, method: 'GET'}).then(function(data) {
      return Game(data);
    }, function(err) {
      console.log('request to lichess failed', err);
    });
  }
};