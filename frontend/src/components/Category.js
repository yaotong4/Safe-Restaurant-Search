import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import Rank from './Rank';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/Explore.css';
import getCategories from '../apis/getCategories';
import getRankByCategory from '../apis/getRankByCategory';

const { Option } = Select;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function Category() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('Restaurant');
  const [order, setOrder] = useState('Stars');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      const cat = await getCategories();
      setCategories(cat);
      const data = await getRankByCategory('Restaurants');
      setData(data);
    }
    fetch();
  }, [])

  async function handleCategoryChange(value) {
    setLoading(true);
    setCategory(value);
    const data = await getRankByCategory(value, order);
    setData(data);
    setLoading(false);
  }

  async function handleOrderChange(value) {
    setLoading(true);
    setOrder(value);
    const data = await getRankByCategory(category, value);
    setData(data);
    setLoading(false);
  }
  

  return (
    <div id="category">

      {categories.length !== 0 &&
      <Select
        showSearch
        style={{ width: 220 }}
        value={category}
        onChange={handleCategoryChange}
      >
        {
        categories.map((category, i)=>(
          <Option value={category}>{category}</Option>
        ))
        }
      </Select>
      }

    <span className="order-by">Order by</span>
      <Select
        value={order}
        style={{ width: 120 }}
        onChange={handleOrderChange}
      >
        <Option key="Stars">Stars</Option>
        <Option key="Popularity">Popularity</Option>
      </Select>

      <Spin indicator={loadingIcon} style={{display: loading ? '' : 'none'}}/>

      <Rank data={data} />

    </div>
  )
}

export default Category;