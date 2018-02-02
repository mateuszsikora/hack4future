import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import Wallet from './pages/Wallet';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" exact component={Home} />
          <Route path="/wallet" component={Wallet} />
        </div>
      </BrowserRouter>
    );
  }
}
