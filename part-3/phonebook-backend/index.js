require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());

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

app.get('/api/persons', (req, res) => {
	Person.find({}).then((persons) => {
		res.json(persons);
	});
});

app.get('/api/persons/:id', (req, res) => {
	const id = req.params.id;
	const person = persons.find(p => p.id === id);

	if (person) {
		res.send(person);
	} else {
		res.status(404).end();
	}
});

app.post('/api/persons', (req, res) => {
	const body = req.body;

    if (!body.name) {
		return res.status(400).json({ error: 'No name' });
	}

    if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({ error: 'Name already exists' });
    }

	if (!body.number) {
		return res.status(400).json({ error: 'No number' });
	}
    

	const person = new Person({
		name: body.name,
		number: body.number,
	});


    person.save().then((savedPerson) => {
		res.json(savedPerson);
	});
});

app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params; 
    persons = persons.filter(user => user.id !== id); 
    res.status(200).send(`Person with ID ${id} has been deleted.`);
  });

app.get('/info', (req, res) => {
	const currentDate = new Date();

	res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDate.toString()}</p>`);
});

app.listen(port, () => {
	console.log(`App listening on port http://localhost:${port}`);
});
