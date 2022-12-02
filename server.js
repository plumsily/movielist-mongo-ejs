const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const PORT = 2121;
require("dotenv").config();
const cors = require("cors");
app.use(cors());

const uri = process.env.DB_STRING;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let db,
  dbName = "movies-DB";

client.connect(async (err) => {
  if (err) {
    console.error(err);
    return false;
  }
  console.log(`Connected to ${dbName} Database!`);
  db = client.db(dbName);
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// client
//   .connect(dbConnectionStr, { useUnifiedTopology: true })
//   .then((client) => {
//     console.log(`Connected to ${dbName} Database!`);
//     db = client.db(dbName);
//     app.listen(process.env.PORT || PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => console.log(error));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  db.collection("movies-list")
    .find()
    .sort({ watched: 1 })
    .toArray()
    .then((data) => {
      res.render("index.ejs", { info: data });
    })
    .catch((error) => console.error(error));
});

app.post("/movies", (req, res) => {
  db.collection("movies-list")
    .insertOne({ movieName: req.body.name, watched: 0 })
    .then((result) => {
      console.log("Movie or show added.");
      res.redirect("/");
    })
    .catch((error) => {
      console.error(error);
    });
});

app.put("/updateWatched", (req, res) => {
  db.collection("movies-list")
    .updateOne(
      { movieName: req.body.nameS },
      {
        $set: {
          watched: 1,
        },
      },
      { sort: { _id: -1 }, upsert: true }
    )
    .then((result) => {
      console.log("Watched status updated");
      res.json("Watch status updated");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteMovie", (req, res) => {
  db.collection("movies-list")
    .deleteOne({ movieName: req.body.nameS })
    .then((result) => {
      console.log("Movie or show deleted from DB");
      res.json("Movie or show deleted");
    })
    .catch((error) => console.error(error));
});
