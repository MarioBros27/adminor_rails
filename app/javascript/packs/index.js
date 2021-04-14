// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, {useState}from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { BrowserRouter as Router, Route ,Switch} from 'react-router-dom';
import Home from '../components/home/Home'
import Workspace from '../components/workspace/Workspace'
import App from '../App'
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Router>
       <Route path="/" component={App}/>   
    </Router>,
   
    document.body.appendChild(document.createElement('div')),
  );
});