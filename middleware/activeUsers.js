const activeUsers = {};

function activeUsersMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    activeUsers[req.sessionID] = req.user;
  }
  req.on('logout', () => {
    delete activeUsers[req.sessionID];
  });

  /*req.session.regenerate(() => {
    req.session.on('sessionDestroyed', (sid) => {
      delete activeUsers[sid];
    });
  });*/

  next();
}

module.exports = { activeUsersMiddleware, activeUsers };
