const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const https = require("https");
const config = require('./config');

var mykey = config.myKey;
var listId = config.listID;


// refers to the static sheets and uses them under the folder called public
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get ('/', (req,res) => {
    res.sendFile(__dirname + "/signup.html");
});
app.get('/index.html', (req,res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get('/signup.html', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {
    

    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = 'https://us7.api.mailchimp.com/3.0/lists/96d2a4a9d4';

    const options = {
        method: "POST",
        auth: "Antonioo:cbf8eeece96d2a4a9d4ccb84cd8d409e22d71190a4-us7"
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();


});

app.post("/failure", (req, res) => {
    res.redirect('/');
});
app.listen(process.env.PORT || port, () => {
    console.log(`server is running on port ${port}`);
});
