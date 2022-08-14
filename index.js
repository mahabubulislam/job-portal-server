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

        //  education info add api
        app.patch('/users/education/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const educations = req.body.education;
            const result = await userCollection.updateOne(filter, { $push: { educations } });
            res.send(result);
        })

        // course info add api
        app.patch('/users/courses/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const courses = req.body.courses;
            const result = await userCollection.updateOne(filter, { $push: { courses } });
            res.send(result);
        })
        // experience info add api
        app.patch('/users/experiences/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const experiences = req.body.experience;
            const result = await userCollection.updateOne(filter, { $push: { experiences } });
            res.send(result);
        })
        // project info add api
        app.patch('/users/projects/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const projects = req.body.project;
            const result = await userCollection.updateOne(filter, { $push: { projects } });
            res.send(result);
        })
        // project info add api
        app.patch('/users/links/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const links = req.body.link;
            const result = await userCollection.updateOne(filter, { $push: { links } });
            res.send(result);
        })
        // project info add api
        app.patch('/users/skills/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const skills = req.body.skill;
            const result = await userCollection.updateOne(filter, { $push: { skills } });
            res.send(result);
        })

        // delete experiences
        app.put('/users/experiences/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const experience = req.body.experience;
            const result = await userCollection.updateOne(filter, { $pull: { experiences: {company:experience} }});
            res.send(result);
        })
        // delete link
        app.put('/users/links/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const link = req.body.link;
            const result = await userCollection.updateOne(filter, { $pull: { links: {name:link} }});
            res.send(result);
        })
        // delete project
        app.put('/users/projects/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const project = req.body.project;
            const result = await userCollection.updateOne(filter, { $pull: { projects: {name:project} }});
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
        // delete course
        app.put('/users/courses/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const course = req.body.course;
            const result = await userCollection.updateOne(filter, { $pull: { courses: {name:course} }});
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