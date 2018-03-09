module.exports = {
  AdminOnly(req, res, next) {
    if (req.user && req.user.role === 2) {
      next();
    } else {
      res.status(403).json({
        success: false,
      });
    }
  },

  AdminAndUsers(req, res, next) {
    if (req.user && (req.user.role === 2 || req.user.role === 1)) {
      next();
    } else {
      res.status(403).json({
        success: false,
      });
    }
  },

  UsersOnly(req, res, next) {
    if (req.user && req.user.role === 1) {
      next();
    } else {
      res.status(403).json({
        success: false,
      });
    }
  },
};
