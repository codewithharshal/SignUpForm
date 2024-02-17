const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;


mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.zzexqd3.mongodb.net/rigistrationFormDB`, {
    // useNewUrlParser: true, 
    // useUnifiedTopology: true,
});


const registrationSchema = new mongoose.Schema ({
    username:String,
    email:String,
    password:String,
    confirm_password:String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async(req, res) => {
    try{
        const {username, email, password, confirm_password} = req.body;

        const existingUser = await Registration.findOne({email : email});
        if(!existingUser){
            const registrationData = new Registration({
                username,
                email,
                password,
                confirm_password,
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else {
            res.redirect("/error");
        }

        const registrationData = new Registration({
            username,
            email,
            password,
            confirm_password,
        })
        await registrationData.save();
        res.redirect("/success");
    }
    catch (error){
        console.log(error);
        res.redirect("/error");
    }
})


app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
})
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
})


app.listen(port, () => {
    console.log(`server is on ${port}`);
})