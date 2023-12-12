const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require('path');
const shortid = require('shortid'); // Import the 'shortid' package
const cors = require('cors');
const UserModel = require('./models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ChatHistory = require('./models/ChatHistory');
require('dotenv').config();
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

function generatePersonalEndpoint() {
    return shortid.generate();
}

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

app.get('/user/:personalEndpoint', (req, res) => {
    const { personalEndpoint } = req.params;

    UserModel.findOne({ personalEndpoint: personalEndpoint })
        .then(user => {
            if (user) {
                res.json(user); // Send the user information as JSON
            } else {
                res.status(404).json({ message: 'User not found' }); // User not found
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message }); // Server error
        });
});

app.post('/chat-history', (req, res) => {
    const { userName, userEndpoint, chat } = req.body;

    ChatHistory.findOneAndUpdate(
        { userEndpoint: userEndpoint },
        { $push: { chats: chat }, userName: userName },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).then(chatHistory => {
        res.json({ status: 'Success', chatHistory: chatHistory });
    }).catch(err => {
        res.json({ status: 'Error', message: err });
    });
});

app.get('/chat-histories/:personalEndpoint', (req, res) => {
    const { personalEndpoint } = req.params;

    ChatHistory.find({ userEndpoint: personalEndpoint })
        .then(chatHistories => {
            if (chatHistories) {
                res.json(chatHistories); // Send the chat histories as JSON
            } else {
                res.status(404).json({ message: 'Chat histories not found' }); // Chat histories not found
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message }); // Server error
        });
});

app.get('/chat-history/:personalEndpoint', (req, res) => {
    const { personalEndpoint } = req.params;

    ChatHistory.findOne({ userEndpoint: personalEndpoint })
        .then(chatHistory => {
            if (chatHistory) {
                res.json(chatHistory); // Send the chat history as JSON
            } else {
                res.status(404).json({ message: 'Chat history not found' }); // Chat history not found
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message }); // Server error
        });
});

/*app.post('/sign-up', (req, res) => {
    UserModel.create(req.body)
        .then(user => {
            if (user) {
                res.json({status: "Success", user: user})
            } else {
                res.json({status: "Error", message: "User was not created"})
            }
        })
        .catch(err => res.json({status: "Error", message: err}))
})*/

/*WORKING CODE*/



app.post('/sign-up', (req, res) => {
    const { name, secondName, phoneNumber, email, password } = req.body;

    // Generate a unique personal endpoint for the user
    const personalEndpoint = generatePersonalEndpoint();

    // Create a new user document with the personal endpoint
    const newUser = new UserModel({
        name,
        secondName,
        phoneNumber,
        email,
        password,
        personalEndpoint, // Save the personal endpoint
    });

    newUser
        .save()
        .then(() => {
            // Redirect the user to the login form after successful registration
            res.json({ status: 'Success', message: 'User registered successfully' });
        })
        .catch((err) => {
            console.error('Error during registration:', err);
            res.json({ status: 'Error', message: err });
        });
});

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

/*WORKING CODE*/

/*app.post('/google-login', async (req, res) => {
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
});*/

app.post('/google-login', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Generate a unique personal endpoint for the user
        const personalEndpoint = generatePersonalEndpoint();

        // Find or create user in your database with the personal endpoint
        const user = await UserModel.findOneAndUpdate(
            { email: payload['email'] },
            {
                email: payload['email'],
                name: payload['name'],
                personalEndpoint, // Save the personal endpoint
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ status: "Success", user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: error.message });
    }
});





app.listen(port, () => {
    console.log(`Server is up and running on port: ${port}`);
});