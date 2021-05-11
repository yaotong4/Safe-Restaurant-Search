import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { Divider, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { Typography, Space } from 'antd';
import '../styles/Restaurant.css';
import getReviews from '../apis/getReviews';

function Reviews(props) {
  const { business_id } = props;
  const [reviews, setReviews] = useState([]);
  const colors = ['#eb2f96', '#f5222d', '#fa541c', '#fa8c16', '#faad14', '#a0d911', '#52c41a', '#13c2c2', '#1890ff', '#2f54eb', '#722ed1'];
  colors.sort(()=>(0.5-Math.random()));

  useEffect(() => {
    async function fetch() {
      const data = await getReviews(business_id);
      setReviews(data);
    }
    fetch();
  }, [])

  return (
    <div id="reviews">
      <Divider orientation="left">Reviews</Divider>
      <Space direction="vertical" size={16}>
      {
        reviews.map((review, i)=>(
          <Row>
            <Review 
              review={review}
              color={colors[i%11]}
              key={i}
            />
          </Row>
        ))
      }
      </Space>
    </div>
  )
}

function Review(props) {
  const { review, color } = props;
  const { Text } = Typography;

  return (
    <div className="review">
      <Card
        hoverable
        title={
  
          <div className="review-title">
            <Avatar className="avatar"
              size={64}
              style={{ backgroundColor: color }} 
              icon={<UserOutlined />} 
            />
            
            <img className="stars" src={"../../stars/" + review.stars.toString() + ".png"} alt={review.stars}/>
            <div className="date">
              <Text>
                {review.date.slice(0, 10) + ' ' + review.date.slice(11, 16)}
              </Text>
            </div>
          </div>
        }
      >

      <Text className="text">
        {review.text}
      </Text>

      </Card>
  
    </div>

  )
}

export default Reviews;