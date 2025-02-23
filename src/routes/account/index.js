import { Router } from "express";
import { registerUser, verifyUser } from "../../models/account/index.js";

const router = Router();

router.get("/register", async (req, res) => {
  res.render("account/register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  const { email, password, confirm_password } = req.body;

  if (!email || !password || !confirm_password) {
    req.flash("error", "Required fields must not be empty.");

    return res.redirect("/account/register");
  }

  if (password !== confirm_password) {
    req.flash("error", "Passwords do not match.");
    return res.redirect("/account/register");
  }

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

  flash("success", "Registration successful! Please log in.");
  res.redirect("/account");
});

router.get("/", async (req, res) => {
  res.render("account/index", { title: "Account" });
});
export default router;
