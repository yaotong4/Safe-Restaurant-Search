import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import Rank from './Rank';
import Tags from './Tags';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/Explore.css';
import getRankByLocation from '../apis/getRankByLocation';
import getRankByKeywords from '../apis/getRankByKeywords';

const { Option } = Select;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function Keywords() {
  const [keywords, setKeywords] = useState([]);
  const [order, setOrder] = useState('Stars');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      const data = await getRankByLocation('State', 'City', order);
      setData(data);
      const kw = await JSON.parse(localStorage.getItem('keywords'));
      console.log(kw);
      if (kw !== null) {
        setKeywords(kw);
      }
    }
    fetch();
  }, [])

  async function handleClick() {
    if (keywords.length === 0) {
      const data = await getRankByLocation('State', 'City', order);
      setData(data);
    } else {
      setLoading(true);
      localStorage.setItem('keywords', JSON.stringify(keywords));
      const data = await getRankByKeywords(keywords.join(','), order);
      setData(data);
      setLoading(false);
    }
  }

  function handleOrderChange(value) {
    setOrder(value);
  }

  return (
    <div id="keywords">

      <Tags 
        type="Keyword" 
        tags={keywords} 
        setTags={setKeywords} 
        showCategories={false} 
      />
      
      <span className="order-by">Order by</span>
      <Select
        value={order}
        style={{ width: 120 }}
        onChange={handleOrderChange}
      >
        <Option key="Stars">Stars</Option>
        <Option key="Popularity">Popularity</Option>
      </Select>
      
      <Button type="primary" onClick={handleClick}>Confirm</Button>
      <Spin indicator={loadingIcon} style={{display: loading ? '' : 'none'}}/>
      <Rank data={data} />

    </div>
  )
}

export default Keywords;