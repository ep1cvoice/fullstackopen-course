import { useState, useEffect } from 'react';
import contactService from './services/contacts';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
	const [newName, setNewName] = useState('');
	const [number, setNumber] = useState('');
	const [searchField, setSearchField] = useState('');
	const [persons, setPersons] = useState([]);

	useEffect(() => {
		contactService.getAll().then((response) => {
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
				: contactService.create(personObject).then((response) => {
						setPersons(persons.concat(response.data));
					});
		}
	};

	const deletePerson = (personObject) => {
		const confirmed = window.confirm(`Do you want to delete ${personObject.name}?`);

		if (!confirmed) {
			return;
		}

		contactService.remove(personObject.id).then(() => {
			setPersons(persons.filter((person) => person.id !== personObject.id));
		});
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
			<Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
		</div>
	);
};

export default App;
