const express = require("express");
const app = express();

const persons = [
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

const port = 3001;

app.listen(port, console.log(`Listenting on port ${port}`));
