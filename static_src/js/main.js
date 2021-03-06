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
  let debug = app.getAttribute('data-debug') === 'True' ? true : false;
  if (!debug) {
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
  }

  const theme = getMuiTheme();
  ReactDOM.render(
  	<MuiThemeProvider muiTheme={theme}>
      <div>
      { 
        app.getAttribute('data-section') === 'staging' ? <Home staging/> : null
      }
      { 
        app.getAttribute('data-section') === 'home' ? <Home/> : null
      }
      { 
        app.getAttribute('data-section') === 'admin' ? <Admin/> : null
      }
      </div>
    </MuiThemeProvider>,
	app
  );
}

// This would usually wait for the ready/DOMContentLoaded
// event, but we're loading this async, and it's up last
init();
