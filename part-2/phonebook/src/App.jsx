import { useState, useEffect } from 'react';
import contactService from './services/contacts';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
	const [newName, setNewName] = useState('');
	const [number, setNumber] = useState('');
	const [searchField, setSearchField] = useState('');
	const [persons, setPersons] = useState([]);
	const [notification, setNotification] = useState({
		message: null,
		type: 'success',
	});

	useEffect(() => {
		contactService.getAll().then((response) => {
			setPersons(response.data);
		});
	}, []);

	const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(searchField.toLowerCase()));

	const addNewName = (event) => {
		event.preventDefault();

		const personObject = {
			name: newName,
			number: number,
		};

		const existingPerson = persons.find((person) => person.name === newName);

		if (newName === '') {
			alert('field is empty');
			return;
		}
		if (existingPerson) {
			const confirmed = window.confirm(`${existingPerson.name} is already added to phonebook. Replace the old number?`);

			if (!confirmed) {
				return;
			}

			const updatedPerson = {
				...existingPerson,
				number: number,
			};

			contactService
				.update(existingPerson.id, updatedPerson)
				.then((response) => {
					setPersons(persons.map((person) => (person.id === existingPerson.id ? response.data : person)));

					setNotification({
						message: `Successfully updated a contact of ${existingPerson.name}`,
						type: 'success',
					});

					setTimeout(() => {
						setNotification({
							message: null,
							type: 'success',
						});
					}, 5000);

					setNewName('');
					setNumber('');
				})
				.catch((error) => {
					setNotification({
						message: `Failed to update a contact: ${error.message}`,
						type: 'error',
					});

					setTimeout(() => {
						setNotification({
							message: null,
							type: 'success',
						});
					}, 5000);
				});
		} else {
			contactService
				.create(personObject)
				.then((response) => {
					setPersons(persons.concat(response.data));

					setNotification({
						message: 'Successfully created a contact',
						type: 'success',
					});

					setTimeout(() => {
						setNotification({
							message: null,
							type: 'success',
						});
					}, 5000);

					setNewName('');
					setNumber('');
				})
				.catch((error) => {
					setNotification({
						message: `Failed to create a contact: ${error.message}`,
						type: 'error',
					});

					setTimeout(() => {
						setNotification({
							message: null,
							type: 'success',
						});
					}, 5000);
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
			<Notification message={notification.message} type={notification.type} />
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
