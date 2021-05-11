import React, { useState, useEffect } from 'react';
import '../styles/Results.css';
import Preview from '../components/Preview';
import { Row, Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import getSearchResults from '../apis/getSearchResults';

const loadingIcon = <LoadingOutlined style={{ fontSize: 75 }} spin />;
function Results() {
  const [displayEven, setDisplayEven] = useState([]);
  const [displayOdd, setDisplayOdd] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      let obj = await JSON.parse(localStorage.getItem('params'));
      if (obj === null) {
        obj = {
          keyword: '',
          near: '',
          rating: 3.5,
          categories: [],
          safe: true
        };
      }
    
      setLoading(true);
      const data = await getSearchResults(obj);
      setLoading(false);
      const temp = handleResults(data)
      setDisplayEven(temp[0]);
      setDisplayOdd(temp[1]);
    }
    fetch();
  }, [])
  

  function handleResults(results) {
    const firstColumn = [];
    const secondColumn = [];
    let i; 
    for (i = 0; i < results.length; i++) {
      if (i%2 === 0){
        firstColumn.push(results[i]);
      }
      else{
        secondColumn.push(results[i])
      }
      
    }
    return [firstColumn, secondColumn];
  }

  if (displayOdd.length !== 0){
    return (
      <div id="results">
        <Navbar selected="results"/>
        <div className="results-search-container">
          <Search />
        </div>
        <div className="loading-icon">
          <Spin indicator={loadingIcon} style={{display: loading ? '' : 'none'}}/>
        </div>
        <div className="results-container">       
        
          <Row gutter={[8, 8]}>
            <Col span={6} ></Col>
            <Col span={6} >
              {displayEven.map((res, i)=>(
                <Preview res={res} key={i} />)
              )}
                </Col>
              
            <Col span={6} >
              {displayOdd.map((res, i)=>(
                <Preview res={res} key={i} />)
              )}</Col>
            <Col span={6} ></Col>
          </Row>
        
    
        </div>

      </div>
    )
  }
  else{
    return (
      <div id="results">
        <Navbar selected="results"/>
        <div className="results-search-container">
          <Search />
        </div>
        <div className="loading-icon">
          <Spin indicator={loadingIcon} style={{display: loading ? '' : 'none'}}/>
        </div>
        <div className="results-container">      
        
          <Row gutter={[8, 8]}>
            <Col span={6} ></Col>
            <Col span={6} >
              {displayEven.map((res, i)=>(
                <Preview res={res} key={i} />)
              )}
                </Col>
            <Col span={6} ></Col>
          </Row>        
    
        </div>

      </div>
    )
  }
  
}

export default Results;