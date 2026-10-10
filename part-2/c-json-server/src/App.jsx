import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
	const [newName, setNewName] = useState('');
	const [number, setNumber] = useState('');
	const [searchField, setSearchField] = useState('');
	const [persons, setPersons] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:3001/persons').then((response) => {
			setPersons(response.data);
		});
	}, []);

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
