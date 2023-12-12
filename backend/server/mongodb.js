const express = require('express');
const app = express();
app.use(express.json());
const port = 8080;
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const UserModel = require('./models/User');
app.use(cors());
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

mongoose.connect('mongodb+srv://yaroslavdev:1234567890@haul-depot-db.7lk8rg9.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

app.get('/hello', (req, res) => {
    res.send('Express server is running');
});

app.get('/test', (req, res) => {
    res.send('testing endpoint');
});

app.post('/sign-up', (req, res) => {
    UserModel.create(req.body)
        .then(user => {
            if (user) {
                res.json({status: "Success", user: user})
            } else {
                res.json({status: "Error", message: "User was not created"})
            }
        })
        .catch(err => res.json({status: "Error", message: err}))
})

app.post("/sign-in", (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({status: "Success", user: user});
                } else {
                    res.json({status: "Error", message: "Wrong password"});
                }
            } else {
                res.json("Not found")
            }
        })
})

app.post('/google-login', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });

        const payload = ticket.getPayload();

        // Find or create user in your database
        const user = await UserModel.findOneAndUpdate(
            { email: payload['email'] },
            {
                email: payload['email'],
                name: payload['name'], // or any other details you want to save
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ status: "Success", user: user });
    } catch (error) {
        console.error(error); // This will log the entire error to your server's console
        res.status(500).json({ status: "Error", message: error.message });
    }
});

/*app.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    UserModel.findById(userId)
        .then(user => {
            if (user) {
                // Return the user's details
                res.json({status: "Success", user: user});
            } else {
                res.json({status: "Error", message: "User not found"});
            }
        })
        .catch(err => res.json({status: "Error", message: err}));
});*/

app.listen(port, () => {
    console.log(`Server is up and running on port: ${port}`);
});