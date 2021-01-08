import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import TitleBar from '../components/titleBar';
import Home from '../routes/home';

export default function App() {
  return (
    <>
      <TitleBar />
      <Router>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </>
  );
}
