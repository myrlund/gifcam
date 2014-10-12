/** @jsx React.DOM */

var React = require('react');

var App = require('./components/app');

React.renderComponent(
    <App />,
    document.getElementById('app')
);
