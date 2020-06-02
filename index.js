require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const Info = require("./models/info");
let count = 0;

//Middleware
app.use(express.static("build"));
app.use(cors());
app.use(express.json());
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((people) => {
      count = people.length;
      res.json(people);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((people) => {
      count = people.length;
    })
    .catch((error) => {
      next(error);
    });
  const newInfo = new Info({
    date: new Date(),
    size: count,
  });
  newInfo
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).send(
        `
        <p>Phonebook has info for ${count} people</p>
        <p>${result.date}</p>
    `
      );
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  if (id) {
    Person.findById(id)
      .then((person) => {
        if (person) {
          res.json(person);
        } else {
          res.status(404).end();
        }
      })
      .catch((error) => {
        next(error);
      });
  }
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
  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (req, res) => {
  const body = req.body;
  const person = {
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((response) => {
      res.status(204).end();
    })
    .catch((error) => {
      console.log("req.params");
      next(error);
    });
});

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Listenting on port ${PORT}`));
