import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import '../styles/Explore.css';

const { Option } = Select;

function LocationDropdown(props) {
  const { stateData, cityData, setState, setCity, setOrder, handleSelection } = props;
  const [cities, setCities] = useState(cityData[stateData[0]]);
  const [selectedCity, setSelectedCity] = useState(cityData[stateData[0]][0])
  const [selectedState, setSelectedState] = useState(stateData[0]);
  const [selectedOrder, setSelectedOrder] = useState('Stars');


  async function handleStateChange(value) {
    setCities(cityData[value]);
    setSelectedCity(cityData[value][0]);
    setSelectedState(value);
    setState(value);
    await handleSelection(value, cityData[value][0], selectedOrder);
  }

  async function handleCityChange(value) {
    setSelectedCity(value);
    setCity(value);
    await handleSelection(selectedState, value, selectedOrder);
  }

  async function handleOrderChange(value) {
    setSelectedOrder(value);
    setOrder(value);
    await handleSelection(selectedState, selectedCity, value);
  }

  return (
    <div id="location-dropdown">
    <Select 
        showSearch
        defaultValue={selectedState}
        style={{ width: 120 }}
        onChange={handleStateChange}
      >
        {
        stateData.map((state)=>(
          <Option key={state}>
            {state}
          </Option>
        ))
        }
      </Select>

      <Select
        showSearch
        value={selectedCity}
        style={{ width: 160 }}
        onChange={handleCityChange}
      >
        {
          cities.map((city)=>(
            <Option key={city}>
              {city}
            </Option>
          ))
        }
      </Select>

      <span className="order-by">Order by</span>
      <Select
        defaultValue={selectedOrder}
        style={{ width: 120 }}
        onChange={handleOrderChange}
      >
        <Option key="Stars">Stars</Option>
        <Option key="Popularity">Popularity</Option>
      </Select>

      </div>
  )
}

export default LocationDropdown;