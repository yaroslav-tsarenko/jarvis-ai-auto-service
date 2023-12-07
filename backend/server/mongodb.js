const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/User');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://yaroslavdev:1234567890@haul-depot-db.7lk8rg9.mongodb.net/')

app.post('/sign-up', (req, res) => {
    UserModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err))
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
                }else {
                    res.json("Not found")
                }
            }
        )
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});