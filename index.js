require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");

//Middleware
app.use(express.static("build"));
app.use(cors());
app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/info", (req, res) => {
  res.status(200).send(`
        <p>Phonebook has info for ${1} people</p>
        <p>${new Date()}</p>
    `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  if (id) {
    Person.findById(id).then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  persons.filter((person) => person.id != id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "content missing" });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });
  console.log(newPerson);
  newPerson.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Listenting on port ${PORT}`));
