const utilities = require("../utilities/index")
const accountModelSchema = require("../models/accountModelMongoose")
const accountModel = require("../models/accountModel")
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
    const userAvailable = await accountModelSchema.findOne({ account_email });
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
    const user = await accountModelSchema.create({
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

    const user = await accountModelSchema.findOne({ account_email });

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
      first_name: user.account_firstname,
      last_name: user.account_lastname,
      email: user.account_email,
      role: user.account_type
    };

    // If they had a saved URL, redirect them there
    if (req.session.redirectTo) {
    const redirectUrl = req.session.redirectTo;
    delete req.session.redirectTo; // clean up
    return res.redirect(redirectUrl);
    }

    // Role-based redirect
    if (user.account_type === "Admin" || user.account_type ==="Employee") {
      console.log("Super User Logged in!");
      return res.redirect("/account/management");
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

async function buildManagementView(req, res, next) {
   let nav = await utilities.getNav()
    res.render("account/management", {
      title: "Adminsitrative Management Portal",
      nav,
      errors: null,
    }) 
}

async function buildAccountUpgradeView(req, res, next) {
   let nav = await utilities.getNav()
    res.render("account/upgradeUser", {
      title: "User Upgrade Portal",
      nav,
      errors: null,
    }) 
}

async function upgradeAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, role } = req.body;

  try {
    if (!account_email || !role) {
      req.flash("notice", "Email and role are required.");
      return res.redirect("/account/upgrade");
    }

    const updatedUser = await accountModel.updateAccountTypeByEmail(account_email, role);

    if (!updatedUser) {
      req.flash("notice", "No user found with that email.");
      return res.redirect("/account/upgrade");
    }

    req.flash("success", `User ${updatedUser.account_email} upgraded to ${updatedUser.account_type}.`);
    return res.redirect("/account/upgrade");
  } catch (error) {
    console.error("Upgrade error:", error);
    req.flash("notice", "Something went wrong. Please try again.");
    return res.redirect("/account/upgrade");
  }
}

module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildManagementView, buildAccountUpgradeView, upgradeAccount}