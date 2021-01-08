import React, { Component, Props } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import TitleBar from './components/titleBar';
import Home from './routes/home';
import Teleprompter from './routes/teleprompter';

type ViewOptions = {
  [key: string]: JSX.Element;
};

// used class component because it's easier to use static.
// adapted from https://medium.com/@ZoeDreams/multiple-electron-windows-using-a-view-manager-and-react-js-6d8b1e209faf
class ViewManager extends React.Component<Props<Component>> {
  static Views() {
    const viewOptions: ViewOptions = {
      main: <Home />,
      sub: <Teleprompter />,
    };
    return viewOptions;
  }

  static View(props: { location: { search: string } }) {
    const name = props.location.search.substr(1);
    const view = ViewManager.Views()[name];
    if (view == null) throw new Error(`View '${name}' is undefined`);
    return view;
  }

  render() {
    return (
      <>
        <TitleBar />
        <Router>
          <Switch>
            <Route path="/" component={ViewManager.View} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default ViewManager;
