import 'antd/dist/antd.css';
import './index.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Login, Panel } from './views';
import { PrivateRoute } from './globalComponents';
import { render } from 'react-dom';
import React, { Component } from 'react';

// ROOT COMPONENT CON ROUTER
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} exact />
          <Route path='/' component={PrivateRoute(Panel)} />
        </Switch>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('root'));