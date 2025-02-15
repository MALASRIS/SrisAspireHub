const express = require("express");
const path = require("path");
const mongoose = require('mongoose');

const bcrypt = require("bcryptjs");
const collection = require("./models/config");
const app = express();
const PORT = 3000;

//mongoDb
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/ejshome", (req, res) => {
    res.render("containers/ejshome", { title: "Home" });
});

app.get("/contact", (req, res) => {
    res.render("containers/contact", { title: "Contact" });
});

app.get("/about", (req, res) => {
    res.render("containers/about", { title: "About" });
})
app.get("/hscGuidance", (req, res) => {
    res.render("containers/hscGuidance", { title: "CareerGuidance" });
})

app.get("/sslcGuidance", (req, res) => {
    res.render("containers/sslcGuidance", { title: "CareerGuidance" });
})

app.get("/resource", (req, res) => {
    res.render("containers/resource", { title: "Resources" });
})

app.get("/", (req, res) => {
    res.render("containers/login", { title: "Login" });
});
app.get("/login", (req, res) => {
    res.redirect('/');
});

app.get("/signup", (req, res) => {
    res.render("containers/signup", { title: "Signup" });
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    const existingUser = await collection.findOne({name:data.name})
    if(existingUser){
        res.send("<script>alert('username already exists'); window.location.href='/signup'</script>");
    }
    const saltRound=10;
    const hashedPassword=await bcrypt.hash(data.password,saltRound);
    data.password=hashedPassword;
    const userData=await collection.insertMany(data);
    res.send("<script>alert('Signed in successfully'); window.location.href='/login'</script>");
    console.log(userData);
})

app.post('/login',async (req ,res)=>{
    try{
        const check=await collection.findOne({name:req.body.username})
        if(!check){
            return res.send("<script>alert('Username not found'); window.location.href='/'</script>");
        }
        const isPasswordMatch=await bcrypt.compare(req.body.password,check.password)
        if(isPasswordMatch){
            return res.redirect("/ejshome");
        }else{
            return res.send("<script>alert('wrong Password'); window.location.href='/'</script>");
        }
        
    }catch{
         return res.send("<script>alert('wrong Details'); window.location.href='/'</script>");
    }
})



app.use(express.static("public"));
app.use(express.static('views/assets'));
app.listen(PORT, () => {
    console.log(`Port listening on ${PORT}`);
});
app.use((req, res) => {
    res.sendFile("./views/404.html", { root: __dirname });
  });