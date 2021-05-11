import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Tabs } from 'antd';
import Location from './Location';
import Category from './Category';
import Keywords from './Keywords';
import SafetyIndex from './SafeyIndex';
import '../styles/Explore.css';

const { TabPane } = Tabs;

function Explore() {
  const [key, setKey] = useState(localStorage.getItem('tab') || 'location');
   
  function handleTabChange(key) {
    setKey(key);
    localStorage.setItem('tab', key);
  }

  return (
    <div id="explore">
      <Navbar selected="explore" />

      <div className="card-container">
      
      <Tabs
        type="card"
        defaultActiveKey={key}
        onChange={handleTabChange}
      >
        <TabPane tab="By Location" key="location">
          <Location />
        </TabPane>

        <TabPane tab="By Category" key="category">
          <Category />
        </TabPane>

        <TabPane tab="By Reviews" key="reviews">
          <Keywords />
        </TabPane>

        <TabPane tab="By Safety Index" key="safetyindex">
          <SafetyIndex />
        </TabPane>

      </Tabs>

      </div>

    </div>
  )
}

export default Explore;