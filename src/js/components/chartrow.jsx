import React from 'react';
import Home from './Home';
import Admin from './Admin';
import {hashHistory, Router, Route} from 'react-router'

export default React.createClass({
  render: function () {
    return (
    	<Router history={hashHistory}>
    		<Route path="/" component={Home}></Route>
    		<Route path="admin" component={Admin}></Route>
    	</Router>
    );
  }
});
