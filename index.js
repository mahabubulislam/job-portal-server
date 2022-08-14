const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express()

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9kz3i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const userCollection = client.db('jobHaunt').collection('users')

        // user info save
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        // user info update
        app.patch('/users/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { address: req.body.address, phoneNumber: req.body.phoneNumber }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // user education info api
        app.patch('/users/education/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const education = req.body.education;
            const result = await userCollection.updateOne(filter, { $push: { education } });
            res.send(result);
        })

        // course info api
        app.patch('/users/courses/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const courses = req.body.courses;
            const result = await userCollection.updateOne(filter, { $push: { courses } });
            res.send(result);
        })

        // delete education
        app.put('/users/education/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const degree = req.body.degree;
            const result = await userCollection.updateOne(filter, { $pull: { education: {degree:degree} }});
            res.send(result);
        })

        // get user by email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);

        })
    }
    finally {

    }
}


app.get('/', (req, res) => {
    res.send('Hello From Server')
})

run().catch(console.dir);
app.listen(port, () => console.log('listening from', port))