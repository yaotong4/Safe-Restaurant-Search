import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';

function Categories(props) {
  const { categories, tags, setTags } = props;
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

  function handleClick(e) {
    const tag = e.target.innerText;
    if (tags.indexOf(tag) === -1) {
      const newTags = [...tags, tag];
      setTags(newTags);
    }
  }

  return (
    <>
     {
       categories.map((category, i)=>(
        <Tag 
          color={colors[i%11]}
          onClick={handleClick}
          key={i}
        >
          {category}
        </Tag>
       ))
     }

    </>
  )
}

export default Categories;