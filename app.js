const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const https = require('https');


const app = express();

// To access css files on server we have to use static method pf express
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
            },
        ],
        update_existing: true,
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/e53b90c72a";

    const options = {
        method: "POST",
        auth: "ahsan1:a297adcd0076a00a3ca806cf545874bb-us6"
    }

    // https.request(url,options,(reponse)=>{})
    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data))
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();


});


// For failure route
app.post("/failure", (req, res) => {
    res.redirect("/");
})

const port = 3000;
app.listen(process.env.PORT || port, () => {
    console.log(`Server is runnig on port ${port}`);
})

// API Key
// a297adcd0076a00a3ca806cf545874bb - us6

// List Id
// e53b90c72a

