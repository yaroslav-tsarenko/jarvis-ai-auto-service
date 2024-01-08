const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require('path');
const shortid = require('shortid'); // Import the 'shortid' package
const cors = require('cors');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const UserModel = require('./models/User');
const ChatHistory = require('./models/ChatHistory');
const CommercialTruckLoad = require('./models/CommercialTruckLoad');
const CarOrLightTruckLoad = require('./models/CarOrLightTruckLoad');
const ConstructionEquipmentLoad = require('./models/ConstructionEquipmentLoad');
const MotoEquipmentLoad = require('./models/MotoEquipmentLoad');
const VehicleLoad = require('./models/VehicleLoad');
const HeavyEquipmentLoad = require('./models/HeavyEquipmentLoad');
const LTLDelivery = require('./models/LTLDelivery');
const FTLLoad = require('./models/FTLLoad');
const Other = require('./models/Other');
const BoatLoad = require('./models/BoatLoad');
const ExpediteLoad = require('./models/ExpediteLoad');
const FreeConsultation = require('./models/FreeConsultation');
const LocalMoving = require('./models/LocalMoving');
const LongDistanceMoving = require('./models/LongDistanceMoving');
const InternationalMoving = require('./models/InternationalMoving');
const CommercialBusinessMoving = require('./models/CommercialBusinessMoving');
const OfficeMoving = require('./models/OfficeMoving');
const HeavyLiftingAndMovingOnly = require('./models/HeavyLiftingAndMovingOnly');
const MovingAndStorageService = require('./models/MovingAndStorageService');
const AutoMotoBoatEquipment = require('./models/AutoMotoBoatEquipment');
const MilitaryMoving = require('./models/MilitaryMoving');
const CorporateMoving = require('./models/CorporateMoving');
const StudentMoving = require('./models/StudentMoving');
require('dotenv').config();
const nodemailer = require('nodemailer');
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
function generatePersonalEndpoint() {
    return shortid.generate();
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hauldepot@gmail.com',
        pass: 'cdpntmwrxqkjdhta'
    }
});

const mailOptions = {
    from: 'hauldepot@gmail.com',
    to: 'yaroslav7v@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'hauldepot@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

mongoose.connect('mongodb+srv://yaroslavdev:1234567890@haul-depot-db.7lk8rg9.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});
app.get('/all-user-loads', async (req, res) => {
    try {
        // Fetch all user loads from each schema
        const userLoads = await Promise.all([
            UserModel.find(),
            ChatHistory.find(),
            CommercialTruckLoad.find(),
            CarOrLightTruckLoad.find(),
            ConstructionEquipmentLoad.find(),
            MotoEquipmentLoad.find(),
            VehicleLoad.find(),
            HeavyEquipmentLoad.find(),
            LTLDelivery.find(),
            FTLLoad.find(),
            Other.find(),
            BoatLoad.find(),
            ExpediteLoad.find(),
            FreeConsultation.find(),
            LocalMoving.find(),
            LongDistanceMoving.find(),
            InternationalMoving.find(),
            CommercialBusinessMoving.find(),
            OfficeMoving.find(),
            HeavyLiftingAndMovingOnly.find(),
            MovingAndStorageService.find(),
            AutoMotoBoatEquipment.find(),
            MilitaryMoving.find(),
            CorporateMoving.find(),
            StudentMoving.find()
        ]);

        // Combine all user loads into a single array
        const allUserLoads = [].concat(...userLoads);

        // Send the array as the response
        res.status(200).json(allUserLoads);
    } catch (error) {
        console.error('Error fetching all user loads:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/update-commercial-truck-load/:id', (req, res) => {
    const id = req.params.id;
    const updatedLoad = req.body;

    CommercialTruckLoad.findByIdAndUpdate(id, updatedLoad, { new: true }, (error, load) => {
        if (error) {
            res.status(500).json({ error: 'There was an error updating the load.' });
        } else {
            res.status(200).json(load);
        }
    });
});

app.get('/schema-data/:schemaName', async (req, res) => {
    const { schemaName } = req.params;

    try {
        // Get the Mongoose model for the specified schema
        const Model = mongoose.model(schemaName);

        // Fetch all documents of the schema
        const documents = await Model.find();

        // Send the documents as the response
        res.status(200).json(documents);
    } catch (error) {
        console.error(`Error fetching documents of schema ${schemaName}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.post('/submit-office-moving', async (req, res) => {
    const movingData = req.body;
    const newMoving = new OfficeMoving(movingData);
    try {
        const savedMoving = await newMoving.save();
        res.json({ status: 'Success', moving: savedMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-student-moving', async (req, res) => {
    const movingData = req.body;
    const newMoving = new StudentMoving(movingData);
    try {
        await newMoving.save();
        res.status(200).json({ status: 'Success', data: newMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.get('/get-student-moving/:personalEndpoint', async (req, res) => {
    const { personalEndpoint } = req.params;
    try {
        const moving = await StudentMoving.find({ userEndpoint: personalEndpoint });
        res.status(200).json({ status: 'Success', data: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-military-moving', async (req, res) => {
    const movingData = req.body;
    const newMoving = new CarOrLightTruckLoad(movingData);
    try {
        await newMoving.save();
        res.status(200).json({ status: 'Success', data: newMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/user-loads', async (req, res) => {
    try {
        const userLoads = await MilitaryMoving.find(); // Replace LoadModel with your actual Mongoose model
        res.status(200).json(userLoads);
    } catch (error) {
        console.error('Error fetching user loads:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/get-military-moving/:personalEndpoint', async (req, res) => {
    const { personalEndpoint } = req.params;
    try {
        const moving = await MilitaryMoving.find({ userEndpoint: personalEndpoint });
        res.status(200).json({ status: 'Success', data: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-corporate-moving', async (req, res) => {
    const movingData = req.body;
    const newMoving = new CorporateMoving(movingData);
    try {
        await newMoving.save();
        res.status(200).json({ status: 'Success', data: newMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.get('/get-corporate-moving/:personalEndpoint', async (req, res) => {
    const { personalEndpoint } = req.params;
    try {
        const moving = await CorporateMoving.find({ userEndpoint: personalEndpoint });
        res.status(200).json({ status: 'Success', data: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-moving-and-storage-service', async (req, res) => {
    const movingData = req.body;
    const newMoving = new MovingAndStorageService(movingData);
    try {
        const savedMoving = await newMoving.save();
        res.json({ status: 'Success', moving: savedMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
// backend/server/mongodb.js

app.post('/submit-auto-moto-boat-equipment', async (req, res) => {
    const equipmentData = req.body;
    const newEquipment = new AutoMotoBoatEquipment(equipmentData);
    try {
        await newEquipment.save();
        res.status(200).json({ status: 'Success', data: newEquipment });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.get('/get-auto-moto-boat-equipment/:personalEndpoint', async (req, res) => {
    const { personalEndpoint } = req.params;
    try {
        const equipment = await AutoMotoBoatEquipment.find({ userEndpoint: personalEndpoint });
        res.status(200).json({ status: 'Success', data: equipment });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-moving-and-storage-service', async (req, res) => {
    try {
        const moving = await MovingAndStorageService.find();
        res.json({ status: 'Success', moving: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-heavy-lifting-and-moving-only', async (req, res) => {
    const movingData = req.body;
    const newMoving = new HeavyLiftingAndMovingOnly(movingData);
    try {
        const savedMoving = await newMoving.save();
        res.json({ status: 'Success', moving: savedMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.get('/get-heavy-lifting-and-moving-only', async (req, res) => {
    try {
        const moving = await HeavyLiftingAndMovingOnly.find();
        res.json({ status: 'Success', moving: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-office-moving', async (req, res) => {
    try {
        const moving = await OfficeMoving.find();
        res.json({ status: 'Success', moving: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-other', async (req, res) => {
    const otherData = req.body;
    const newOther = new Other(otherData);
    try {
        const savedOther = await newOther.save();
        res.json({ status: 'Success', other: savedOther });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-international-moving', async (req, res) => {
    const movingData = req.body;
    const newMoving = new InternationalMoving(movingData);
    try {
        const savedMoving = await newMoving.save();
        res.json({ status: 'Success', moving: savedMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-commercial-business-moving', async (req, res) => {
    const movingData = req.body;
    const newMoving = new CommercialBusinessMoving(movingData);
    try {
        const savedMoving = await newMoving.save();
        res.json({ status: 'Success', moving: savedMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.get('/get-commercial-business-moving', async (req, res) => {
    try {
        const moving = await CommercialBusinessMoving.find();
        res.json({ status: 'Success', moving: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-international-moving', async (req, res) => {
    try {
        const moving = await InternationalMoving.find();
        res.json({ status: 'Success', moving: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-other', async (req, res) => {
    try {
        const other = await Other.find();
        res.json({ status: 'Success', other: other });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-free-consultation', async (req, res) => {
    const consultationData = req.body;
    const newConsultation = new FreeConsultation(consultationData);
    try {
        const savedConsultation = await newConsultation.save();
        res.json({ status: 'Success', consultation: savedConsultation });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-long-distance-moving', async (req, res) => {
    const movingData = req.body;
    const newMoving = new LongDistanceMoving(movingData);
    try {
        const savedMoving = await newMoving.save();
        res.json({ status: 'Success', moving: savedMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.get('/get-long-distance-moving', async (req, res) => {
    try {
        const moving = await LongDistanceMoving.find();
        res.json({ status: 'Success', moving: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-free-consultations', async (req, res) => {
    try {
        const consultations = await FreeConsultation.find();
        res.json({ status: 'Success', consultations: consultations });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-ftl-load', async (req, res) => {
    const ftlLoad = new FTLLoad(req.body);
    try {
        await ftlLoad.save();
        res.status(200).send({ ftlLoad });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/get-ftl-load', async (req, res) => {
    try {
        const ftlLoad = await FTLLoad.find({});
        res.status(200).send({ ftlLoad });
    } catch (error) {
        res.status(500).send(error);
    }
});
app.get('/hello', (req, res) => {
    res.send('Express server is running');
});

app.get('/test', (req, res) => {
    res.send('testing endpoint');
});

app.post('/submit-moto-equipment-load', async (req, res) => {
    const motoEquipmentData = req.body;
    const newMotoEquipmentLoad = new MotoEquipmentLoad(motoEquipmentData);
    try {
        const savedMotoEquipmentLoad = await newMotoEquipmentLoad.save();
        res.json({ status: 'Success', load: savedMotoEquipmentLoad });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
// backend/server/mongodb.js
app.post('/submit-heavy-equipment-load', async (req, res) => {
    const heavyEquipmentData = req.body;
    const newHeavyEquipmentLoad = new HeavyEquipmentLoad(heavyEquipmentData);
    try {
        const savedHeavyEquipmentLoad = await newHeavyEquipmentLoad.save();
        res.json({ status: 'Success', load: savedHeavyEquipmentLoad });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-ltl-delivery', async (req, res) => {
    const ltlDeliveryData = req.body;
    const newLTLDelivery = new LTLDelivery(ltlDeliveryData);
    try {
        const savedLTLDelivery = await newLTLDelivery.save();
        res.json({ status: 'Success', delivery: savedLTLDelivery });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-local-moving', async (req, res) => {
    const movingData = req.body;
    const newMoving = new LocalMoving(movingData);
    try {
        const savedMoving = await newMoving.save();
        res.json({ status: 'Success', moving: savedMoving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.get('/get-local-moving', async (req, res) => {
    try {
        const moving = await LocalMoving.find();
        res.json({ status: 'Success', moving: moving });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-ltl-deliveries', async (req, res) => {
    try {
        const ltlDeliveries = await LTLDelivery.find();
        res.json({ status: 'Success', deliveries: ltlDeliveries });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-heavy-equipment-loads', async (req, res) => {
    try {
        const heavyEquipmentLoads = await HeavyEquipmentLoad.find();
        res.json({ status: 'Success', loads: heavyEquipmentLoads });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-construction-equipment-load', async (req, res) => {
    const constructionEquipmentData = req.body;
    const newConstructionEquipmentLoad = new ConstructionEquipmentLoad(constructionEquipmentData);
    try {
        const savedConstructionEquipmentLoad = await newConstructionEquipmentLoad.save();
        res.json({ status: 'Success', load: savedConstructionEquipmentLoad });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-construction-equipment-loads', async (req, res) => {
    try {
        const constructionEquipmentLoads = await ConstructionEquipmentLoad.find();
        res.json({ status: 'Success', loads: constructionEquipmentLoads });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

app.post('/submit-boat-load', async (req, res) => {
    const boatLoadData = req.body;
    const newBoatLoad = new BoatLoad(boatLoadData);
    try {
        const savedBoatLoad = await newBoatLoad.save();
        res.json({ status: 'Success', load: savedBoatLoad });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-expedite-load', async (req, res) => {
    const expediteLoadData = req.body;
    const newExpediteLoad = new ExpediteLoad(expediteLoadData);
    try {
        const savedExpediteLoad = await newExpediteLoad.save();
        res.json({ status: 'Success', load: savedExpediteLoad });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-expedite-loads', async (req, res) => {
    try {
        const expediteLoads = await ExpediteLoad.find();
        res.json({ status: 'Success', loads: expediteLoads });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
// backend/server/mongodb.js
app.get('/get-boat-loads', async (req, res) => {
    try {
        const boatLoads = await BoatLoad.find();
        res.json({ status: 'Success', loads: boatLoads });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/get-commercial-truck-loads', async (req, res) => {
    try {
        const commercialTruckLoads = await CommercialTruckLoad.find();
        res.json({ status: 'Success', loads: commercialTruckLoads });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.get('/user/:personalEndpoint', (req, res) => {
    const { personalEndpoint } = req.params;

    UserModel.findOne({ personalEndpoint: personalEndpoint })
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

app.get('/user-by-email/:email', (req, res) => {
    const { email } = req.params;

    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

app.get('/all-users', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/get-moto-equipment-loads', async (req, res) => {
    try {
        const motoEquipmentLoads = await MotoEquipmentLoad.find();
        res.json({ status: 'Success', loads: motoEquipmentLoads });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/submit-commercial-truck-load', async (req, res) => {
    const commercialTruckData = req.body;
    const newCommercialTruckLoad = new CommercialTruckLoad(commercialTruckData);
    try {
        const savedCommercialTruckLoad = await newCommercialTruckLoad.save();
        res.json({ status: 'Success', load: savedCommercialTruckLoad });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});
app.post('/create-chat-session', (req, res) => {
    const { userEndpoint } = req.body;
    const newChatSession = new ChatHistory({
        userEndpoint: userEndpoint,
        chatEndpoint: generatePersonalEndpoint(),
        chats: []
    });

    newChatSession.save()
        .then(chatSession => {
            res.json({ status: 'Success', chatEndpoint: chatSession.chatEndpoint });
        })
        .catch(err => {
            console.error('Error creating chat session:', err);
            res.status(500).json({ status: 'Error', message: err.message });
        });
});

app.post('/submit-vehicle-load', async (req, res) => {
    try {
        const newLoad = new CarOrLightTruckLoad(req.body); // Use the new model here
        await newLoad.save();
        res.status(200).json({ message: 'Vehicle load submitted successfully', load: newLoad });
    } catch (error) {
        console.error('Error submitting vehicle load:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/submit-vehicle-load/:personalEndpoint', async (req, res) => {
    const { personalEndpoint } = req.params;
    const vehicleLoads = await CarOrLightTruckLoad.find({ userEndpoint: personalEndpoint });
    if (vehicleLoads) {
        res.json(vehicleLoads);
    } else {
        res.status(404).json({ message: 'No vehicle loads found for this user.' });
    }
});

app.get('/vehicle-load/:personalEndpoint', async (req, res) => {
    const { personalEndpoint } = req.params;
    const vehicleLoads = await VehicleLoad.find({ userEndpoint: personalEndpoint });
    if (vehicleLoads) {
        res.json(vehicleLoads);
    } else {
        res.status(404).json({ message: 'No vehicle loads found for this user.' });
    }
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



app.get('/chat-session/:chatEndpoint', (req, res) => {
    const { chatEndpoint } = req.params;

    ChatHistory.findOne({ chatEndpoint: chatEndpoint })
        .then(chatSession => {
            if (chatSession) {
                res.json(chatSession);
            } else {
                res.status(404).json({ message: 'Chat session not found' });
            }
        })
        .catch(err => {
            console.error('Error fetching chat session:', err);
            res.status(500).json({ message: err.message });
        });
});

app.delete('/delete-all-chat-sessions/:personalEndpoint', (req, res) => {
    const { personalEndpoint } = req.params;

    ChatHistory.deleteMany({ userEndpoint: personalEndpoint })
        .then(() => {
            res.status(200).json({ message: 'All chat sessions deleted' });
        })
        .catch(err => {
            console.error('Error deleting chat sessions:', err);
            res.status(500).json({ message: err.message });
        });
});
app.get('/user-chat-sessions/:personalEndpoint', (req, res) => {
    const { personalEndpoint } = req.params;

    // Assuming ChatHistory model has a 'userEndpoint' field
    ChatHistory.find({ userEndpoint: personalEndpoint })
        .then(chatSessions => {
            res.json({ chatSessions: chatSessions });
        })
        .catch(err => {
            console.error('Error fetching chat sessions:', err);
            res.status(500).json({ message: err.message });
        });
});
app.post('/chat-message', (req, res) => {
    const { userEndpoint, chatEndpoint, chat } = req.body;
    ChatHistory.findOneAndUpdate(
        { userEndpoint: userEndpoint, chatEndpoint: chatEndpoint },
        { $push: { chats: chat } },
        { upsert: true, new: true }
    ).then(chatHistory => {
        res.json({ status: 'Success', chatHistory: chatHistory });
    }).catch(err => {
        res.status(500).json({ status: 'Error', message: err.message });
    });
});
app.get('/chat-session/:chatEndpoint', (req, res) => {
    const { chatEndpoint } = req.params;

    ChatHistory.findOne({ chatEndpoint: chatEndpoint })
        .then(chatSession => {
            if (chatSession) {
                res.json(chatSession);
            } else {
                res.status(404).json({ message: 'Chat session not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
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
app.post('/save-chat', (req, res) => {
    const { chatEndpoint, chat } = req.body;

    ChatHistory.findOneAndUpdate(
        { chatEndpoint: chatEndpoint },
        { $push: { chats: chat } },
        { new: true }
    ).then(updatedChatHistory => {
        res.json({ status: 'Success', updatedChatHistory });
    }).catch(err => {
        console.error('Error updating chat session:', err);
        res.status(500).json({ status: 'Error', message: err.message });
    });
});
app.post('/sign-up', (req, res) => {
    const { name, secondName, phoneNumber, email, password } = req.body;
    const personalEndpoint = generatePersonalEndpoint();
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
            // Send an email after successful registration
            sendEmail(email, 'Welcome to Our Service', 'Thank you for signing up!');
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

app.delete('/delete-commercial-truck-load/:id', (req, res) => {
    const id = req.params.id;

    CommercialTruckLoad.findByIdAndRemove(id, (error, result) => {
        if (error) {
            res.status(500).json({ error: 'There was an error deleting the load.' });
        } else {
            res.status(200).json({ message: 'Load deleted successfully', result: result });
        }
    });
});



module.exports = router;

app.listen(port, () => {
    console.log(`Server is up and running on port: ${port}`);
});