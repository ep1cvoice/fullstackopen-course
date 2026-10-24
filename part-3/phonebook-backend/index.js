require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const errorHandler = (error, req, res, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'Bad id' });
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());


app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((persons) => {
			res.json(persons);
		})
		.catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
	const body = req.body;

	if (!body.name) {
		return res.status(400).json({ error: 'No name' });
	}

	if (!body.number) {
		return res.status(400).json({ error: 'No number' });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			res.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body;

	Person.findById(req.params.id)
		.then((person) => {
			if (!person) {
				return res.status(404).end();
			}

			person.name = name;
			person.number = number;

			return person.save().then((updatedPerson) => {
				res.json(updatedPerson);
			});
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
	const { id } = req.params;
	Person.findByIdAndDelete(id)
		.then(() => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

app.get('/info', (req, res, next) => {
	const currentDate = new Date();

	Person.countDocuments({})
		.then((count) => {
			res.send(`<p>Phonebook has info for ${count} people</p><p>${currentDate.toString()}</p>`);
		})
		.catch((error) => next(error));
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`App listening on port http://localhost:${port}`);
});
