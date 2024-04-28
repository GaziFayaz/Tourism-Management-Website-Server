require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.udmqtzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    const userCollection = client.db("B9A10-tourism-management").collection("users");
    const countryCollection = client.db("B9A10-tourism-management").collection("countries");
    const touristSpotCollection = client.db("B9A10-tourism-management").collection("touristSpots")

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get("/user/:uid", async (req, res) => {
      const id = req.params.id;
      const query = {uid: uid}
      const result = await userCollection.findOne(query)
      res.send(result)
    })

    app.post("/user", async (req, res) => {
      const newUser = req.body
      console.log(newUser)
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })

    app.get("/tourist-spots", async (req, res) => {
      const cursor = touristSpotCollection.find()
      const result = await cursor.toArray()
      res.send()
    })

    app.get("/tourist-spot/:id", async (req, res) => {
      const _id = req.params.id;
      const query = {_id: new ObjectId(_id)}
      const result = await touristSpotCollection.findOne(query)
      res.send(result)
    })

    app.get("/countries", async (req, res) => {
      const cursor = countryCollection.find();
      const countries = await cursor.toArray();
      res.send(countries);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get(`/`, (req, res) => {
	res.send("Server is running"); 
});

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});