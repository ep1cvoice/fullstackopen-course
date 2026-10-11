const Persons = ({ filteredPersons, deletePerson }) => {
	return (
		<ul>
			{filteredPersons.map((contact) => (
				<li key={contact.name}>
					{contact.name},{contact.number} <button onClick={() => deletePerson(contact)}>delete</button>
				</li>
			))}
		</ul>
	);
};

export default Persons;
