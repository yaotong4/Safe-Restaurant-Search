import React, { useState, useEffect } from 'react';
import '../styles/Restaurant.css';
import { Tag, Divider } from 'antd';
import getTips from '../apis/getTips';

function Tips(props) {
  const { business_id } = props;
  const [tips, setTips] = useState([]);
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  colors.sort(()=>(0.5-Math.random()));

  useEffect(() => {
    async function fetch() {
      const data = await getTips(business_id);
      setTips(data);
    }
    fetch();
  }, [])

  return (
    <div id="tips">
      <Divider orientation="left">Tips</Divider>
      {
        tips.map((tip, i)=>(
          <Tip 
            tip={tip} 
            color={colors[i%11]}
            key={i}
          />
        ))
      }
    </div>
  )
}

function Tip(props) {
  const { tip, color } = props;

  return (
    <div className="tip">
      <Tag 
        color={color}
      >
        <span className="text">
          {tip.text}
        </span>
        <br/>
        <span className="date">
          {tip.date.slice(0, 10) + ' ' + tip.date.slice(11, 16)}
        </span>
      </Tag>

    </div>
  )
}

export default Tips;