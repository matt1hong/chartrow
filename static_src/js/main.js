import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
import Home from './containers/HomePage'
import Admin from './containers/Admin'

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
injectTapEventPlugin();


function init () {
  let app = document.querySelector('section');
  const theme = getMuiTheme();
  ReactDOM.render(
  	<MuiThemeProvider muiTheme={theme}>
    	{ app.getAttribute('data-section') === 'admin' 
        ? <Admin/>
        : <Home/>
      }
    </MuiThemeProvider>,
	app
  );
}

// This would usually wait for the ready/DOMContentLoaded
// event, but we're loading this async, and it's up last
init();
