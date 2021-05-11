import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { Rate } from 'antd';
import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import Tags from './Tags';
import '../styles/Search.css';


function Search(props) {
  const { showCategories } = props;
  const [find, setFind] = useState('');
  const [near, setNear] = useState('');
  const [tags, setTags] = useState([]);
  const [rating, setRating] = useState(3.5);
  const [safe, setSafe] = useState(true);

  const { Search } = Input;

  useEffect(() => {
    async function load() {
      const obj = await JSON.parse(localStorage.getItem('params'));
      if (obj === null) {return;}
      await setFind(obj.keyword || '');
      console.log(find);
      await setNear(obj.near || '');
      await setTags(obj.categories || []);
      await setRating(obj.rating || 3.5);
      await setSafe(obj.safe === true ? true : false );
      console.log(safe);
    }
    load();
  }, [])
  
  function onSearch() {   
    const params = {
      keyword: find,
      near: near,
      rating: rating,
      categories: tags,
      safe: safe
    };
    console.log(params)
    localStorage.setItem('params', JSON.stringify(params));
    window.location.href = '/results';
  }
  
  function handleFindChange(e) {
    setFind(e.target.value);
  }

  function handleNearChange(e) {
    setNear(e.target.value);
  }

  function handleRatingChange(value) {
    setRating(value);
  }

  function handleSafeChange(checked) {
    setSafe(checked);
  }

  return (
    <>
    <div id="search">
      <div id="find">
        <Input 
          addonBefore="Find"
          placeholder={find || "Restaurants, Cuisines"}
          value={find || ''}
          size="large"
          onChange={handleFindChange}
        />
      </div>

      <div id="near">
        <Search 
          addonBefore="Near"
          placeholder={near || "Austin, TX 78741"}
          value={near || ''}
          size="large"
          onChange={handleNearChange}
          onSearch={onSearch}
        />
      </div>

    </div>

    <div id="rating">
      <span>Min Rating: </span>
      <Rate 
        allowHalf 
        defaultValue={rating || 3.5} 
        value={rating || 3.5}
        onChange={handleRatingChange}
      />
    </div>

    <div id="covid-safe">
      <span>COVID-Safe: </span>
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        defaultChecked={safe}
        checked={safe}
        onChange={handleSafeChange}
      />
    </div>

    <div id="tags-container">
      <Tags 
        type="Category" 
        tags={tags} 
        setTags={setTags} 
        showCategories={showCategories}
      />
    </div>

    </>
  )
}

export default Search;