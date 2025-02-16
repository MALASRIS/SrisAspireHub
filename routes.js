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

// ✅ Signup Route (Fixed Security Issues)
router.post('/signup', async (req, res) => {
    try {
        let { username, password, confirmPassword, classLevel } = req.body;

        if (!username || !password || !confirmPassword || !classLevel) {
            return res.send(`<script>alert('All fields are required'); window.location.href='/signup'</script>`);
        }

        username = username.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();

        if (password !== confirmPassword) {
            return res.send(`<script>alert('Passwords do not match'); window.location.href='/signup'</script>`);
        }

        if (!/^[a-zA-Z0-9._]+$/.test(username)) {
            return res.send(`<script>alert('Invalid username. Only letters, numbers, dot, and underscore allowed.'); window.location.href='/signup'</script>`);
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
            return res.send(`<script>alert('Password must be at least 6 characters, include letters and numbers'); window.location.href='/signup'</script>`);
        }

        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.send(`<script>alert('Username already exists'); window.location.href='/signup'</script>`);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = new collection({ name: username, password: hashedPassword, classLevel });
        await userData.save();

        console.log("✅ User Created:", userData);
        res.send("<script>alert('Signed up successfully'); window.location.href='/login'</script>");
    } catch (error) {
        console.error("❌ Signup Error:", error.message);
        res.status(500).send(`<script>alert('Signup failed: ${encodeURIComponent(error.message)}'); window.location.href='/signup'</script>`);
    }
});

module.exports = router;
