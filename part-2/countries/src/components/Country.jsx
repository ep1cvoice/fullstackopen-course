const Country = ({ country, weather }) => {
	return (
		<div>
			<h1>{country.name.common}</h1>
			<div>Capital {country.capital?.join(', ')}</div>
			<div>Area {country.area}</div>

			<h2>Languages</h2>
			<ul>
				{Object.values(country.languages ?? {}).map((language) => (
					<li key={language}>{language}</li>
				))}
			</ul>

			<img src={country.flags.png} alt={country.flags.alt ?? `flag of ${country.name.common}`} width="200" />

			<h2>Weather in {country.capital?.[0]}</h2>

			{weather ? (
				<div>
					<div>
						Temperature: {weather.main.temp} °C
					</div>

					<img
						src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
						alt={weather.weather[0].description}
					/>

					<div>
						{weather.weather[0].description}
					</div>

					<div>
						Wind speed: {weather.wind.speed} m/s
					</div>
				</div>
			) : (
				<p>Loading weather...</p>
			)}
		</div>
	);
};

export default Country;
