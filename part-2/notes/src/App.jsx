import { useState } from 'react';

const App = () => {
	const [newName, setNewName] = useState('');
	const [number, setNumber] = useState('');
	const [searchField, setSearchField] = useState('');
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas', number: '040-123456', id: 1 },
		{ name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
		{ name: 'Dan Abramov', number: '12-43-234345', id: 3 },
		{ name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
	]);

	const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(searchField.toLowerCase()));

	const addNewName = (event) => {
		event.preventDefault();

		const userNameInput = newName;
		const userPhoneInput = number;

		const personObject = {
			name: userNameInput,
			number: userPhoneInput,
		};

		if (newName === '') {
			alert('field is empty');
		} else {
			persons.some((contact) => contact.name === newName)
				? alert('contact already exists')
				: setPersons(persons.concat(personObject), setNewName(''), setNumber(''));
		}
	};

	return (
		<div>
			<h2>Phonebook</h2>
			Search with a: <input value={searchField} onChange={(event) => setSearchField(event.target.value)} />
			<br></br>
			<br></br>
			<form onSubmit={addNewName}>
				<div>
					name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
					<div>
						number: <input value={number} onChange={(event) => setNumber(event.target.value)} />
					</div>
				</div>
				<div>
					<button type='submit'>add</button>
				</div>
			</form>
			<h2>Numbers</h2>
			<ul>
				{filteredPersons.map((contact) => (
					<li key={contact.name}>
						{contact.name},{contact.number}
					</li>
				))}
			</ul>
		</div>
	);
};

export default App;
