import { Router } from "express";
import { registerUser, verifyUser } from "../../models/account/index.js";
import { body, validationResult } from "express-validator";
import { requireAuth } from "../../utils/index.js";

const router = Router();

router.get("/register", async (req, res) => {
  res.locals.scripts.push('<script defer src="/js/registration.js"></script>');
  //console.log(res.locals.scripts);
  res.render("account/register", { title: "Register" });
});

// Build an array of validation checks for the registration route
const registrationValidation = [
  body("email").isEmail().withMessage("Invalid email format."),
  body("password")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol!!!!."
    ),
];

router.post("/register", registrationValidation, async (req, res) => {
  //checks if there are any validation errors
  const results = validationResult(req);
  if (results.errors.length > 0) {
    results.errors.forEach((error) => {
      req.flash("error", error.msg);
    });
    res.redirect("/account/register");
    return;
  }

  //registration process
  const { email, password } = req.body;
  await registerUser(email, password);
  req.flash("success", "Registration successful! Please log in.");
  res.redirect("/account/login");
});

router.get("/login", async (req, res) => {
  res.render("account/login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const verify = await verifyUser(email, password);
  if (!verify) {
    req.flash("error", "Invalid login credentials.");
    return res.redirect("/account/login");
  }
  req.session.user = verify;

  res.locals.session_user = req.session.user;
  console.log(res.locals.session_user);
  res.redirect("/account");
});

router.get("/", requireAuth, async (req, res) => {
  //console.log(requireAuth(req, res));
  res.render("account/index", { title: "Account" });
});
export default router;
