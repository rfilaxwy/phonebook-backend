const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

let persons = [
  {
    name: "Bing Crosby",
    number: "004-123456",
    id: 1,
  },
  {
    name: "HP Lovecraft",
    number: "004-123456",
    id: 2,
  },
  {
    name: "Stephen King",
    number: "004-123456",
    id: 3,
  },
  {
    name: "Bon Iver",
    number: "004-123456",
    id: 4,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.status(200).send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id) {
    const person = persons.filter((person) => person.id === id);

    if (person.length > 0) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  persons.filter((person) => person.id != id);
  res.status(204).end();
});

const generateId = () => {
  let id, repeatId;
  do {
    id = Math.floor(Math.random() * 20000);
    repeatId = persons.some((person) => person.id == id);
  } while (repeatId);
  return id;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "content missing" });
  }
  let repeatName = persons.some((person) => person.name == body.name);
  if (repeatName) {
    return res.status(409).json({ error: "Name already exists" });
  }
  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(newPerson);
  res.json(persons);
});

const port = 3001;

app.listen(port, console.log(`Listenting on port ${port}`));
