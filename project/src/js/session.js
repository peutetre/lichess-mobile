var http = require('./http');
var utils = require('./utils');
var i18n = require('./i18n');

var session = null;

function isConnected() {
  return !!session;
}

function get() {
  return session;
}

function nowPlaying() {
  var supportedVariants = ['standard', 'chess960', 'antichess', 'fromPosition',
  'kingOfTheHill', 'threeCheck'];
  var np = session && session.nowPlaying || [];
  return np.filter(function(e) {
    return supportedVariants.indexOf(e.variant.key) !== -1;
  });
}

function login(username, password) {
  return http.request('/login', {
    method: 'POST',
    data: {
      username: username,
      password: password
    }
  }, true).then(function(data) {
    session = data;
    return session;
  });
}

function logout() {
  return http.request('/logout').then(function() {
    session = null;
  }, function(err) {
    utils.handleXhrError(err);
    throw err;
  });
}

function refresh(isBackground) {
  var p = http.request('/account/info', {
    background: isBackground
  }, !isBackground).then(function(data) {
    session = data;
    return session;
  });
  if (!isBackground) p.then(function() {
    window.plugins.toast.show(i18n('dataRefreshSuccessful'), 'short', 'center');
  }, function(err) {
    utils.handleXhrError(err);
    throw err;
  });

  return p;
}

module.exports = {
  isConnected: isConnected,
  login: login,
  logout: logout,
  refresh: refresh,
  get: get,
  nowPlaying: nowPlaying
};
