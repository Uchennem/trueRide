const { constants } = require("../constants");
const utilities = require("../utilities/index")

const errorHandler = async (err, req, res, next) => {
  // Use statusCode if already set in controller, else 500
  const statusCode = res.statusCode || constants.SERVER_ERROR;

  let title;
  switch (statusCode) {
    case constants.VALIDATION_ERROR: title = "Validation Failed"; break;
    case constants.NOT_FOUND: title = "404 Not Found"; break;
    case constants.UNAUTHORIZED: title = "Unauthorized"; break;
    case constants.FORBIDDEN: title = "Forbidden"; break;
    case constants.SERVER_ERROR: title = "Server Error"; break;
    default: title = "Unknown Error"; break;
  }

  // Log for debugging
  console.error(err);

  let nav = await utilities.getNav();
  // Render EJS error page
  res.status(statusCode).render("./error/error", {
    title,
    nav,
    message: err.message
  });
};

module.exports = errorHandler;
