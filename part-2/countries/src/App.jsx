import axios from 'axios';
import { useState, useEffect } from 'react';
import countryService from './services/countries';
import Filter from './components/Filter';
import Countries from './components/Countries';
import Country from './components/Country';

const App = () => {
	const [countries, setCountries] = useState([]);
	const [search, setSearch] = useState('');
	const [chooseCountry, setChooseCountry] = useState(null);

	const filteredCountries = countries.filter((country) =>
		country.name.common.toLowerCase().includes(search.toLowerCase())
	);

	const showCountry = (country) => {
		setChooseCountry(country);
	}

	const selectedCountry =
		chooseCountry ?? (search && filteredCountries.length === 1 ? filteredCountries[0] : null);

	// weather
	const apiKey = import.meta.env.VITE_WEATHER_API_KEY
	const [weather, setWeather] = useState(null)

	useEffect(() => {
		countryService.getAll().then((response) => {
			setCountries(response.data);
		});
	}, []);

	const capital = selectedCountry?.capital?.[0];

	useEffect(() => {
		setWeather(null);
		if (!capital) {
			return;
		}

		let cancelled = false;
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric`
			)
			.then((response) => {
				if (!cancelled) setWeather(response.data);
			})
			.catch((error) => console.error('Weather fetch failed', error));
		return () => {
			cancelled = true;
		};
	}, [capital, apiKey]);

	return (
		<div>
			{selectedCountry ? (
				<>
					<button onClick={() => { setChooseCountry(null); setSearch(''); }}>Back</button>
					<Country country={selectedCountry} weather={weather} />
				</>
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
