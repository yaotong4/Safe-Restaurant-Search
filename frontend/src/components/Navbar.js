import React, { useState, useEffect } from 'react';
import { Layout, Menu, Image } from 'antd';
import '../styles/Navbar.css';
import getRandRestaurant from '../apis/getRandRestaurant';

const { Header } = Layout;
const photo = '../../yelp.png'

function Navbar(props) {
  const { selected } = props;
  
  function handleClick() {
    window.location.href = '/';
  }

  async function handleItemClick(e) {
    const key = e.key;
    let path;
    if (key === 'results') {
      path = '/results';
    } else if (key === 'explore') {
      path = '/explore';
    } else if (key === 'lucky') {
      const res = await getRandRestaurant();
      const id = res.business_id;
      localStorage.setItem('res', JSON.stringify(res));
      path = `/restaurant/${id}`;
    }
    window.location.href = path;
  }

  return (
    <div id="header">
      <Header>
        <div className="logo" onClick={handleClick}>
          <img alt='logo' src={photo}/>
          <span className="text">Safétéria</span>
        </div>

        <Menu 
          theme="dark" 
          mode="horizontal" 
          defaultSelectedKeys={selected}
          onClick={handleItemClick}
        >
          <Menu.Item key="results">Results</Menu.Item>
          <Menu.Item key="explore">Explore</Menu.Item>
          <Menu.Item key="lucky">I'm Feeling Lucky</Menu.Item>
        </Menu>

      </Header>
    </div>
  )
}

export default Navbar;