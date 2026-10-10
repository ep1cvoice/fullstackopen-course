import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

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
			<Filter searchField={searchField} setSearchField={setSearchField} />
			<br></br>
			<br></br>


      <h2>Add new contact</h2>
			<PersonForm
				addNewName={addNewName}
				newName={newName}
				setNewName={setNewName}
				number={number}
				setNumber={setNumber}
			/>

			<h2>Contacts</h2>
			<Persons filteredPersons={filteredPersons} />
		</div>
	);
};

export default App;
