import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Tag } from 'antd';
import { Image } from 'antd';
import { Skeleton } from 'antd';
import { Empty } from 'antd';
import Slider from "react-slick";
import { Row, Col, Divider } from 'antd';
import { Line } from '@ant-design/charts';

import Navbar from './Navbar';
import Hours from './Hours';
import Reviews from './Reviews';
import Tips from './Tips';
import Map from './Map';
import Recommendations from './Recommendations';

import '../styles/Restaurant.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import getCovidInfo from '../apis/getCovidInfo';
import getBusinessDetails from '../apis/getBusinessDetails';

const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

function Restaurant() {
  const { business_id } = useParams();
  const [res, setRes] = useState({});
  const [categories, setCategories] = useState([]);
  const [hours, setHours] = useState({});
  const [config, setConfig] = useState({});
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [stars, setStars] = useState(3.5);
 
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 400,
    autoplaySpeed: 4000
  };

  colors.sort(()=>(0.5-Math.random()));

  useEffect(() => {
    async function fetch() {
      const obj = await JSON.parse(localStorage.getItem('res'));
      setRes(obj);
      setStars(obj.stars);
      setCategories(obj.categories.split(','));
      setHours(JSON.parse(obj.hours));
      const data = await getCovidInfo(obj.business_id);
      const configuration = {
        data: data,
        xField: 'Date',
        yField: 'Count',
        seriesField: 'category',
        yAxis: {
          label: {
            formatter: function formatter(v) {
              return v;
            },
          },
        },
        legend: { position: 'top' },
        smooth: true,
        animation: {
          appear: {
            animation: 'path-in',
            duration: 2000,
          },
        },
      };
      await setConfig(configuration);

      const data2 = await getBusinessDetails(business_id || obj.business_id);
      setLat(data2.coordinates.latitude);
      setLng(data2.coordinates.longitude);
      setPhotos(data2.photos);
    }
    fetch();
  }, [])


  return (
    <div className="restaurant">

    <Navbar />

    <div className="upper">
    <Row gutter={[8, 8]}>
      <Col span={14}>

        <div id="info">
          <h1 id="name">{res.name}</h1>

          <img className="stars" src={"../../stars/" + stars.toString() + ".png"} alt={res.stars}/>
          <p className="address">{res.address}, {res.city}, {res.state} {res.postal_code}</p>
          <div id="cats">
          {
            categories.map((cat, i)=>(
              <Tag
                color={`${colors[i%11]}-inverse`}
                key={i}
              >
               {cat} 
              </Tag>
            ))
          }
          </div>

          <div className="hours-divider">
            <Divider orientation="left">Hours</Divider>
          </div>
          <Hours hours={hours} />
          
          <Map lat={lat} lng={lng} />
         
        </div>
      </Col>

      <Col span={8}>
        <div className="slider-container">
          {photos.length !== 0 ?
          <Slider {...settings}>
          {
            photos.map((photo, i)=>(
              <Image 
                src={photo} key={i}
              />
            ))
          } 
          </Slider>
          :
          <Skeleton active />
          }
        </div>

        
        {(config.data && config.data.length !== 0) ?
          <div className="chart-container">
            <Line {...config} />
            <Tag color="cyan">COVID-19 Statistics in {res.postal_code}</Tag>
          </div> 
          :
          <Empty 
            description={
            <span>
              No COVID-19 Statistics
            </span>
          }
          />
        }  

      </Col>
      
    </Row>
    </div>

    <Row gutter={[[8, 8]]}>
      <Col span={12}>
        <Reviews business_id={business_id} />
      </Col>

      <Col span={12}>
        <Tips business_id={business_id} />

        <Recommendations business_id={business_id} />

      </Col>
    </Row>

    </div>
  )
}

export default Restaurant;