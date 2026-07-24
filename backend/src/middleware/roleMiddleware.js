const { createError } = require("./errorMiddleware");

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          `Role ${req.user.role} is not authorized for this action`,
          403,
        ),
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };
