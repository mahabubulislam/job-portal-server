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

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.patch('/users/:email', async (req, res) => {
            const email = req.params.email;
            const filter = {email:email}
            const updateDoc = {
                $set: { address: req.body.address, phoneNumber:req.body.phoneNumber }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result)
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