var React = require('react');
var view = require('./views/main');

require('./views/header');
require('./views/content');

var app = React.createElement(view);
React.render(app, document.getElementById('app'));