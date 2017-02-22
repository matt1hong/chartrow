import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, Redirect, IndexRoute} from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';
import Home from './containers/HomePage'
import Admin from './containers/Admin'

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
injectTapEventPlugin();


function init () {
  let app = document.querySelectorAll('[data-section="app"]')[0];
  ReactDOM.render(
		<Router history={hashHistory}>
    		<Route path="/" component={Home}></Route>
    		<Route path="admin" component={Admin}></Route>
    	</Router>,
	app
  );
}

// This would usually wait for the ready/DOMContentLoaded
// event, but we're loading this async, and it's up last
init();
