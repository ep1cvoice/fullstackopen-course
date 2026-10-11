const Persons = ({ filteredPersons }) => {
	return (
		<ul>
			{filteredPersons.map((contact) => (
				<li key={contact.name}>
					{contact.name},{contact.number}
				</li>
			))}
		</ul>
	);
};

export default Persons;
