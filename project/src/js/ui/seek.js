var utils = require('../utils');
var StrongSocket = require('../StrongSocket');
var layout = require('./layout');
var menu = require('./menu');
var widgets = require('./_commonWidgets');
var gamesMenu = require('./gamesMenu');
var xhr = require('../xhr');
var i18n = require('../i18n');

var nbPlaying = 0;

var seek = {};

function makeLobbySocket(lobbyVersion, onOpen) {
  return new StrongSocket(
    '/lobby/socket/v1',
    lobbyVersion, {
      options: {
        name: 'lobby',
        pingDelay: 2000,
        onOpen: onOpen
      },
      events: {
        redirect: function(data) {
          m.route('/play' + data.url);
        },
        n: function(n) {
          nbPlaying = n;
          m.redraw();
        },
        resync: function(nothing, socket) {
          xhr.lobby().then(function(data) {
            socket.reset(data.lobby.version);
          });
        }
      }
    }
  );
}

seek.controller = function() {

  var hookId;
  var lobbySocket;

  var createHook = function() {
    xhr.seekGame().then(function(data) {
      hookId = data.hook.id;
    }, function(error) {
      utils.handleXhrError(error);
      throw error;
    });
  };

  xhr.lobby().then(function(data) {
    lobbySocket = makeLobbySocket(data.lobby.version, createHook);
  });

  function cancel() {
    if (lobbySocket && hookId) lobbySocket.send('cancel', hookId);
    utils.backHistory();
  }

  document.addEventListener('backbutton', cancel, false);

  return {
    cancel: cancel,

    onunload: function() {
      if (lobbySocket) {
        lobbySocket.destroy();
        lobbySocket = null;
      }
      document.removeEventListener('backbutton', cancel, false);
    }
  };
};

seek.view = function(ctrl) {
  function overlays() {
    return [
      gamesMenu.view(),
      m('div.overlay', [
        m('div.overlay_content', [
          m('div', i18n('waitingForOpponent')),
          m('br'),
          m('div', i18n('nbConnectedPlayers', nbPlaying || '?')),
          m('br'),
          m('br'),
          m('button[data-icon=L]', {
            config: utils.ontouchend(ctrl.cancel),
          }, i18n('cancel'))
        ])
      ])
    ];
  }

  return layout.board(widgets.header, widgets.board, widgets.empty, menu.view, overlays);
};

module.exports = seek;
