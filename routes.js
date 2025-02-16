const express = require("express");
const bcrypt = require("bcryptjs");
const collection = require("./models/config");

const router = express.Router();

// ✅ Render Pages
router.get("/", (req, res) => res.render("containers/login", { title: "Login" }));
router.get("/login", (req, res) => res.redirect('/'));
router.get("/signup", (req, res) => res.render("containers/signup", { title: "Signup" }));
router.get("/ejshome", (req, res) => res.render("containers/ejshome", { title: "Home" }));
router.get("/contact", (req, res) => res.render("containers/contact", { title: "Contact" }));
router.get("/about", (req, res) => res.render("containers/about", { title: "About" }));
router.get("/hscGuidance", (req, res) => res.render("containers/hscGuidance", { title: "Career Guidance" }));
router.get("/sslcGuidance", (req, res) => res.render("containers/sslcGuidance", { title: "Career Guidance" }));
router.get("/resource", (req, res) => res.render("containers/resource", { title: "Resources" }));

// ✅ Signup Route
router.post('/signup', async (req, res) => {
    try {
        let { username, password } = req.body;

        if (!username || !password) {
            return res.send("<script>alert('Username and password are required'); window.location.href='/signup'</script>");
        }

        username = username.trim();
        password = password.trim();

        if (!/^[a-zA-Z0-9._]+$/.test(username)) {
            return res.send("<script>alert('Invalid username. Only letters, numbers, dot, and underscore allowed.'); window.location.href='/signup'</script>");
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
            return res.send("<script>alert('Password must be at least 6 characters, include letters and numbers'); window.location.href='/signup'</script>");
        }

        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.send("<script>alert('Username already exists'); window.location.href='/signup'</script>");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = new collection({ name: username, password: hashedPassword });
        await userData.save();

        console.log("✅ User Created:", userData);
        res.send("<script>alert('Signed up successfully'); window.location.href='/login'</script>");
    } catch (error) {
        console.error("❌ Signup Error:", error.message);
        res.status(500).send(`<script>alert('Signup failed: ${escape(error.message)}'); window.location.href='/signup'</script>`);
    }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send("<script>alert('Username and password are required'); window.location.href='/';</script>");
        }

        const user = await collection.findOne({ name: username });

        if (!user) {
            return res.send("<script>alert('Username not found'); window.location.href='/';</script>");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            console.log("✅ Login successful for user:", username);
            return res.redirect("/ejshome");
        } else {
            return res.send("<script>alert('Wrong Password'); window.location.href='/';</script>");
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        return res.send(`<script>alert('Something went wrong: ${error.message.replace(/'/g, "\\'")}'); window.location.href='/';</script>`);
    }
});

module.exports = router;
