const PersonForm = ({ addNewName, newName, setNewName, number, setNumber }) => {
	return (
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
	);
};

export default PersonForm;
