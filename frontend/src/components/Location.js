import React, { useState, useEffect } from 'react';
import Rank from './Rank';
import LocationDropdown from './LocationDropdown';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/Explore.css';
import getStatesCities from '../apis/getStatesCities';
import getRankByLocation from '../apis/getRankByLocation';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function Location() {
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [state, setState] = useState('State');
  const [city, setCity] = useState('City');
  const [order, setOrder] = useState('Stars');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      const data = await getStatesCities();
      setStateData(data.states);
      setCityData(data.cities);
      const data2 = await getRankByLocation(state, city, order);
      setData(data2);
    }
    fetch();
  }, [])

  async function handleSelection(s, c, o) {
    setLoading(true);
    const data = await getRankByLocation(s, c, o);
    await setData(data);
    setLoading(false);
  }
  
  return (
    <div id="location">
      {stateData.length !== 0 && cityData.length !== 0 &&
        <LocationDropdown 
          stateData={stateData} 
          cityData={cityData}
          setState={setState}
          setCity={setCity}
          setOrder={setOrder}
          handleSelection={handleSelection}
      />
      }
      <Spin indicator={loadingIcon} style={{display: loading ? '' : 'none'}}/>

      <div className="rank-container"> 

        <Rank data={data} />

      </div>
    </div>
  )
}


export default Location;