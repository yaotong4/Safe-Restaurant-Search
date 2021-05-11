import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import 'antd/dist/antd.css'; 
import Main from './components/Main';
import Restaurant from './components/Restaurant';
import Search from './components/Search';
import Results from './components/Results';
import Explore from './components/Explore';


function App() {
  return (
    <Router>
      <Switch>
        
        <Route exact path='/'>
          <Main />
        </Route>

        <Route path='/search'>
          <Search />
        </Route>

        <Route exact path="/restaurant">
          <Restaurant />
        </Route>

        <Route path="/restaurant/:business_id">
          <Restaurant/>
        </Route>
        
        <Route path="/results">
          <Results />
        </Route>

        <Route path="/explore">
          <Explore />
        </Route>

      </Switch>
    </Router>

  )
}

export default App;