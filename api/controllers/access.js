/**
 *  Express route middleware handlers
 */
module.exports = {
  /**
   * use for restict users and guests
   */
  AdminOnly(req, res, next) {
    if (req.user && req.user.role === 2) {
      next();
    } else {
      res.status(403).json({
        success: false,
      });
    }
  },
  /**
   * use for guests
   */
  AdminAndUsers(req, res, next) {
    if (req.user && (req.user.role === 2 || req.user.role === 1)) {
      next();
    } else {
      res.status(403).json({
        success: false,
      });
    }
  },
  /**
   * use for restict admins and guests
   */
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
