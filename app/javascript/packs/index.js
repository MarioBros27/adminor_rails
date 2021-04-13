// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { BrowserRouter as Router, Route ,Switch} from 'react-router-dom';
import Home from '../components/home/Home'
import Workspace from '../components/workspace/Workspace'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/workspace" component={Workspace} />
      </Switch>
    </Router>,
    document.body.appendChild(document.createElement('div')),
  );
});