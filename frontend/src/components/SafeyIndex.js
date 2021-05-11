import React, { useState, useEffect } from 'react';
import { Tag, Table } from 'antd';
import { Spin } from 'antd';
import LocationDropdown from './LocationDropdown';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/Explore.css';
import getStatesCities from '../apis/getStatesCities';
import getRankBySafetyIndex from '../apis/getRankBySafetyIndex';

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function SafetyIndex() {
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [state, setState] = useState('State');
  const [city, setCity] = useState('City');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      const data = await getStatesCities();
      setStateData(data.states);
      setCityData(data.cities);
      const data2 = await getRankBySafetyIndex(state, city);
      console.log(data2);
      setData(data2);
    }
    fetch();
  }, [])

  async function handleSelection(s, c) {
    setLoading(true);
    console.log(s);
    console.log(c);
    const data = await getRankBySafetyIndex(s, c);
    await setData(data);
    setLoading(false);
  }

  return (
    <div id="safetyindex">

      {stateData.length !== 0 && cityData.length !== 0 &&
        <LocationDropdown 
          stateData={stateData} 
          cityData={cityData}
          setState={setState}
          setCity={setCity}
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

function Rank(props) {
  const { data } = props;
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
 
  function handleClick(e) {
    const id = e.target.id;
    let res;
    for (let i = 0; i < data.length; i++) {
      if (data[i].business_id === id) {
        res = data[i];
        break;
      }
    }
    localStorage.setItem('res', JSON.stringify(res));
    window.location.href = `/restaurant/${id}`;
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'business_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, row) => <a id={row.business_id} onClick={handleClick}>{text}</a>,
    },
    {
      title: 'Satey Index',
      dataIndex: 'safety_index',
    },
    {
      title: 'Stars',
      dataIndex: 'stars',
    },
    {
      title: 'Review Count',
      dataIndex: 'review_count',
    },
    {
      title: 'State',
      dataIndex: 'state',
    },
    {
      title: 'City',
      dataIndex: 'city',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      render: categories => (
        handleTags(categories)
      )
    },
  ];

  function handleTags(categories) {
    const tags = categories.split(',');
    colors.sort(()=>(0.5-Math.random()));
    return (
      <>
        {
        tags.map((tag, i)=>(
          <Tag color={colors[i%11]}>{tag}</Tag>
        ))
        }
      </>
    )
  }

  return (
    <div id="rank">
      <Table dataSource={data} columns={columns} />
    </div>
  )
}

export default SafetyIndex;