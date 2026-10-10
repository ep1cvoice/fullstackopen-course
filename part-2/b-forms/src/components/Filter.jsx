const Filter = ({searchField, setSearchField}) => {
	

	return (
		<div>
			<p>Search with a:</p>
			<input value={searchField} onChange={(event) => setSearchField(event.target.value)} />
		</div>
	);
};

export default Filter;
