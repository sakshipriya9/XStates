import React, { useState, useEffect } from 'react';
import './LocationSelector.css';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://crio-location-selector.onrender.com/countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setError(error);
    }
  };

  const fetchStates = async (countryName) => {
    try {
      const response = await fetch(`https://crio-location-selector.onrender.com/country=${countryName}/states`);
      const data = await response.json();
      setStates(data);
      setShowStateDropdown(true);
    } catch (error) {
      console.error(`Error fetching states for ${countryName}:`, error);
      setError(error);
    }
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await fetch(`https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`);
      const data = await response.json();
      setCities(data);
      setShowCityDropdown(true);
    } catch (error) {
      console.error(`Error fetching cities for ${stateName}, ${countryName}:`, error);
      setError(error);
    }
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setSelectedState('');
    setSelectedCity('');
    setShowStateDropdown(false);
    setShowCityDropdown(false);
    fetchStates(countryName);
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedCity('');
    setShowCityDropdown(false);
    fetchCities(selectedCountry, stateName);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
  };

  return (
    <div className="location-selector">
      <h2>Location Selector</h2>
      {error && <div>Error fetching data. Please try again later.</div>}
      <div className="form-row">
        <label htmlFor="country">Country:</label>
        <select id="country" onChange={handleCountryChange} value={selectedCountry}>
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      {showStateDropdown && (
        <div className="form-row">
          <label htmlFor="state">State:</label>
          <select id="state" onChange={handleStateChange} value={selectedState}>
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      )}
      {showCityDropdown && (
        <div className="form-row">
          <label htmlFor="city">City:</label>
          <select id="city" onChange={handleCityChange} value={selectedCity}>
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      )}
      {selectedCity && (
        <p>You selected {selectedCity}, {selectedState}, {selectedCountry}</p>
      )}
    </div>
  );
};

export default LocationSelector;
