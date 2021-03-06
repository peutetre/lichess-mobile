var xhr = require('../../xhr');
var roundXhr = require('../round/roundXhr');
var roundCtrl = require('../round/roundCtrl');
var StrongSocket = require('../../StrongSocket');
var utils = require('../../utils');
var gamesMenu = require('../gamesMenu');
var signals = require('../../signals');
var session = require('../../session');

function makeGameSocket(ctrl, data) {
  return new StrongSocket(
    data.url.socket,
    data.player.version, {
      options: {
        name: "game",
        debug: true,
        ignoreUnknownMessages: true
      },
      receive: function(t, d) {
        // this function is still fired after ctrl has been unloaded
        // normally socket is destroyed, but check why
        if (ctrl.round) return ctrl.round.socket.receive(t, d);
      },
      events: {
        resync: function(nothing, socket) {
          roundXhr.reload(ctrl.round).then(function(data) {
            socket.reset(data.player.version);
            ctrl.round.reload(data);
          }, function(err) {
            utils.handleXhrError(err);
          });
        }
      }
    }
  );
}

function makeRound(ctrl, data) {
  return new roundCtrl(data, ctrl.gameSocket.send.bind(ctrl.gameSocket));
}

module.exports = function() {

  this.id = m.route.param('id');
  this.vm = {
    connectedWS: true // is connected to websocket
  };
  this.round = null;
  this.gameSocket = null;

  var resumeGame = function(id) {
    var self = this;
    xhr.game(id).then(function(data) {
      self.gameSocket = makeGameSocket(self, data);
      self.round = makeRound(self, data);
      window.plugins.insomnia.keepAwake();
      session.refresh(true);
    }, function(error) {
      utils.handleXhrError(error);
      m.route('/');
    });
  }.bind(this);

  resumeGame(this.id);

  var onConnected = function() {
    var wasOff = !this.vm.connectedWS;
    this.vm.connectedWS = true;
    if (wasOff) m.redraw();
  }.bind(this);

  var onDisconnected = function() {
    var wasOn = this.vm.connectedWS;
    this.vm.connectedWS = false;
    if (wasOn) setTimeout(function() {
      m.redraw();
    }, 1000);
  }.bind(this);

  var onPause = function() {
    if (this.gameSocket) this.gameSocket.destroy();
  }.bind(this);

  var onResume = function() {
    if (this.gameSocket) this.gameSocket.connect();
  }.bind(this);

  var onBackButton = function() {
    if (this.round.vm.showingActions) {
      this.round.hideActions();
      m.redraw();
    } else if (gamesMenu.isOpen()) {
      gamesMenu.close();
      m.redraw();
    } else if (this.round.chat && this.round.chat.showing) {
      this.round.chat.close();
      m.redraw();
    } else
      window.navigator.app.backHistory();
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
    signals.connected.remove(onConnected);
    signals.disconnected.remove(onDisconnected);
    document.removeEventListener('pause', onPause, false);
    document.removeEventListener('resume', onResume, false);
    document.removeEventListener('backbutton', onBackButton, false);
    window.plugins.insomnia.allowSleepAgain();
  }.bind(this);

  signals.connected.add(onConnected);
  signals.disconnected.add(onDisconnected);
  document.addEventListener('pause', onPause, false);
  document.addEventListener('resume', onResume, false);
  document.addEventListener('backbutton', onBackButton, false);

};
