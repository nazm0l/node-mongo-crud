const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection

const uri =
  "mongodb+srv://crud:crud12@cluster0.m0aff.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const usersCollection = client.db("Crud").collection("user");

    // Add a new user

    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get all the user

    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    // Update a user

    app.put("/user/:id", async (req, res) => {
      const userID = req.params.id;
      const query = { _id: ObjectId(userID) };
      const newUser = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: newUser.name,
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // Delete a user

    app.delete("user/:id", async (req, res) => {
      const userID = req.params.id;
      const query = { _id: ObjectId(userID) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
