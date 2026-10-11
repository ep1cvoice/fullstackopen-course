import { useState, useEffect } from 'react';
import countryService from './services/countries';
import Filter from './components/Filter';
import Countries from './components/Countries';

const App = () => {
	const [countries, setCountries] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		countryService.getAll().then((response) => {
			setCountries(response.data);
		});
	}, []);

	const filteredCountries = countries.filter((country) =>
		country.name.common.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div>
			<Filter search={search} setSearch={setSearch} />
			{search && <Countries countries={filteredCountries} />}
		</div>
	);
};

export default App;
