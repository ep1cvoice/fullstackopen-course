import { useState } from 'react';

const App = () => {
	const [newName, setNewName] = useState('');
	const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);

	const addNewName = (event) => {
		event.preventDefault();

		const userInput = newName;
		const personObject = { name: userInput };

		if (newName === '') {
			alert('field is empty');
		} else {
			persons.some((contact) => contact.name === newName)
				? alert('contact already exists')
				: setPersons(persons.concat(personObject), setNewName(''));
		}
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<form onSubmit={addNewName}>
				<div>
					name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
				</div>
				<div>
					<button type='submit'>add</button>
				</div>
			</form>
			<h2>Numbers</h2>

			<ul>
				{persons.map((contact) => (
					<li key={contact.name}>{contact.name}</li>
				))}
			</ul>
		</div>
	);
};

export default App;
