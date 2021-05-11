import React, { useState, useEffect } from 'react';
import Search from './Search';
import Navbar from './Navbar';

import '../styles/Main.css';
const photo = '../../yelp.png';

function Main() {
  return (
    <div id="main">
      <Navbar />
      <div className="logo">
        <img alt='logo' src={photo}/>
        <span className="logoText">Safétéria</span>
      </div>
      <div className="search-container">
        <Search showCategories/>
      </div>

    </div>
  )
}

export default Main;