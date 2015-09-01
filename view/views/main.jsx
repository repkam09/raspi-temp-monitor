var React = require('react');
var log = require('../util/utility');

var HeaderView = require('./header');
var ContentView = require('./content');

var MainView = React.createClass({

	/**
	 * componentDidMount - function is called when a component is
	 * mounted into the DOM.
	 */
    componentDidMount: function() {
        log.verbose('main.jsx - componentDidMount');
    },

	/**
	 * componentWillUnmount - function is called when a component is
	 * about to be unmounted from the DOM.
	 */
    componentWillUnmount: function() {
        log.verbose('main.jsx - componentWillUnmount');
    },


	/**
	 * This function is written in JSX syntax to provide an HTML-like
	 * view of the react component
	 */
    render: function() {
        log.verbose('main.jsx - render() ');

        return (
            <div className="app-wrapper">
                <HeaderView />
				<ContentView />
			</div>
    	);
    }
});

module.exports = MainView;