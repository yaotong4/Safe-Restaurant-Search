import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import '../styles/Explore.css';


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

export default Rank;