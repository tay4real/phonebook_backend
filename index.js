const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

app.use(express.static('dist'));

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people<p><p>${new Date()}</p>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const data = persons.find((person) => person.id === id);

  if (data) {
    response.json(data);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateID = () => {
  return String(Math.floor(Math.random() * 10000 + 1));
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    response.status(400).json({ error: 'name or number is missing' });
  } else if (
    persons.filter(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    ).length > 0
  ) {
    response.status(400).json({ error: 'name must be unique' });
  } else {
    // respond to request
    const person = {
      id: generateID(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);
    response.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
