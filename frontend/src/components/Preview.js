import React, { useState, useEffect } from 'react';
import '../styles/Results.css';
import { Card, Tag } from 'antd';
import { Skeleton } from 'antd';

function Preview(props) {
  const {res} = props;
  const [starImg, setStarImg] = useState('');
  const [long, setLong] = useState("");
  // const [tags, setTags] = useState('')
  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

  useEffect(() => {
    async function load() {
      const src = "../../stars/" + res.stars.toString() + ".png";
      await setStarImg(src);
      if (res.name.length > 36) {
        setLong('toooolong');
      } else if (res.name.length > 33) {
        setLong('toolong');
      } else if (res.name.length > 30) {
        setLong('verylong');
      } else if (res.name.length > 25) {
        setLong('long');
      }
    }
    load();
  })

  function handleClick() { 
    localStorage.setItem('res', JSON.stringify(res));
    window.location.href = `/restaurant/${res.business_id}`;
  }

  if (!starImg.includes('png')) {
    return (<Skeleton active />)
  } else {
    return (
      <div className="preview">
        <Card
          onClick={handleClick}
          hoverable
          title={
            <div className="preview-title">
              <span className={`name ${long}`}>{res.name}</span>
              <br/>
              <img className="stars" src={starImg} alt={res.stars}/>
              <span className="review-count">{res.review_count} reviews</span>
            </div>
          }
        
        >
          <p className="address-1">{res.address}</p>
          <p className="address-2">{res.city}, {res.state} {res.postal_code}</p>
          <div className="categories">
            {res.categories.split(',').map((tag, i)=>(
              <Tag key={i} color={colors.sort(()=>(0.5-Math.random()))[i%11]}>{tag}</Tag>
              ))
            }
          </div>

        </Card>

      </div>)
  }
}

export default Preview;