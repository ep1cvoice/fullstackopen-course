import { useState, useEffect } from 'react';
import countryService from './services/countries';
import Filter from './components/Filter';
import Countries from './components/Countries';
import Country from './components/Country';

const App = () => {
	const [countries, setCountries] = useState([]);
	const [search, setSearch] = useState('');
	const [chooseCountry, setChooseCountry] = useState(null);

	useEffect(() => {
		countryService.getAll().then((response) => {
			setCountries(response.data);
		});
	}, []);

	const filteredCountries = countries.filter((country) =>
		country.name.common.toLowerCase().includes(search.toLowerCase())
	);

	const showCountry = (country) => {
		setChooseCountry(country);
	}

	return (
		<div>
			{chooseCountry ? (
				<Country country={chooseCountry} />
			) : (
				<>
					<Filter search={search} setSearch={setSearch} />
					{search && (
						<Countries
							countries={filteredCountries}
							showCountry={showCountry}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default App;
