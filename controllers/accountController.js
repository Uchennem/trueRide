const utilities = require("../utilities/index")
const accountModel = require("../models/accountModelMongoose")
const bcrypt = require("bcrypt")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      loginFailed: false, // Set to false by default
      formData: {}
    })
}
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      formData: {}
    })
}

async function registerAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // ==== Input validation ====
    const errors = [];
    if (!account_firstname || account_firstname.length < 2) {
      errors.push({ msg: "First name cannot be less than 2 letters." });
    }
    if (!account_lastname || account_lastname.length < 2) {
      errors.push({ msg: "Last name cannot be less than 2 letters." });
    }
    // Password: min 12 chars, 1 upper, 1 lower, 1 number, 1 special char
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/;
    if (!passwordPattern.test(account_password)) {
      errors.push({ msg: "Password must be at least 12 chars long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character." });
    }

    // ==== If validation errors, re-render with sticky form ====
    if (errors.length > 0) {
      return res.status(400).render("account/register", {
        title: "Register Account",
        nav,
        errors,
        formData: req.body   // 👈 keeps input sticky
      });
    }

    // ==== Check for existing email ====
    const userAvailable = await accountModel.findOne({ account_email });
    if (userAvailable) {
      return res.status(400).render("account/register", {
        title: "Register Account",
        nav,
        errors: [{ msg: "Email already exists!" }],
        formData: req.body
      });
    }

    // ==== Hash password ====
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // ==== Create user ====
    const user = await accountModel.create({
      account_firstname,
      account_lastname,
      account_email,
      account_password: hashedPassword
    });

    console.log("User created successfully:", user.account_email);
    req.flash("success", `User ${account_firstname} was successfully added.`);
    return res.redirect("/account/login");

  } catch (error) {
    console.error("Error Creating User:", error);

    return res.status(500).render("account/register", {
      title: "Register Account",
      nav,
      errors: [{ msg: "Something went wrong, please try again." }],
      formData: req.body
    });
  }
}

async function accountLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    if (!account_email || !account_password) {
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Email and password are required" }],
        formData: { account_email },
        loginFailed: true
      });
    }

    const user = await accountModel.findOne({ account_email });

    if (!user) {
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Email does not exist!" }],
        formData: { account_email },
        loginFailed: true
      });
    }

    const passwordMatch = await bcrypt.compare(account_password, user.account_password);

    if (!passwordMatch) {
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: [{ msg: "Password is incorrect" }],
        formData: { account_email },
        loginFailed: true
      });
    }

    // Save session
    req.session.user = {
      id: user._id,
      email: user.account_email,
      role: user.account_type
    };

    // Role-based redirect
    if (user.account_type === "Admin" || user.account_type ==="Employee") {
      console.log("Super User Logged in!");
      return res.render("account/management", 
        {title: "Home", nav, errors: null}
      );
    }

    console.log("Regular user logged in");
    return res.redirect("/");

  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: [],
      formData: { account_email }
    });
  }
}


module.exports = {buildLogin, buildRegister, registerAccount, accountLogin}