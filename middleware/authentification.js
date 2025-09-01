// utils/auth.js
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // user is logged in, allow access
  }
  // Save the page the user tried to access
  req.session.returnTo = req.originalUrl;
  req.flash("notice", "You must be logged in to access this page.");
  return res.redirect("/account/login");
}

function isEmployee(req, res, next) {
  if (req.session.user && (req.session.user.role === "Admin" || req.session.user.role === "Employee")) {
    return next();
  }
  req.flash("notice", "You do not have permission to access this page.");
  return res.redirect("/");
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "Admin") {
    return next();
  }
  req.flash("notice", "You do not have permission to access this page.");
  return res.redirect("/");
}

module.exports = { isLoggedIn, isEmployee, isAdmin };

