import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import Preview from './Preview';

import '../styles/Restaurant.css';
import getRecommendations from '../apis/getRecommendations';


function Recommendations(props) {
  const { business_id } = props;
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    async function fetch() {
      const data = await getRecommendations(business_id);
      setRestaurants(data);
    }
    fetch();
  }, [])


  return (
    <div id="recommendations">
      <Divider orientation="left">Recommended for You</Divider>
      {
      restaurants.map((res, i)=>(
        <Preview res={res} key={i}/>
      ))
      }

    </div>
  )
}

export default Recommendations;