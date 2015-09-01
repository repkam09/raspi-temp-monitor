var React = require('react');
var log = require('../util/utility');

var Template = React.createClass({
	
	/**
	 * componentDidMount - function is called when a component is
	 * mounted into the DOM.
	 */
    componentDidMount: function() {
        log.verbose('template.jsx - componentDidMount');
    },
	
	/**
	 * componentWillUnmount - function is called when a component is
	 * about to be unmounted from the DOM.
	 */
    componentWillUnmount: function() {
        log.verbose('template.jsx - componentWillUnmount');
    },
    
	
	/**
	 * This function is written in JSX syntax to provide an HTML-like
	 * view of the react component
	 */
    render: function() {
        log.verbose('template.jsx - render() ');
		
        return (
            <div>
            
			 </div>
    	);
    }
});

module.exports = Template;