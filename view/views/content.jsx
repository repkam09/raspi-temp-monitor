var React = require('react');
var log = require('../util/utility');
var LineChart = require("react-chartjs").Line;

var ContentView = React.createClass({

    getInitialState: function() {
        return {chart : null };
    },

	/**
	 * componentDidMount - function is called when a component is
	 * mounted into the DOM.
	 */
    componentDidMount: function() {
        log.verbose('content.jsx - componentDidMount');
        updateChart();

        var chart = {
            labels: ["1441071006419", "1441071546125", "1441074607174", "1441076406619", "1441078207325", "1441080006740", "1441081806348"],
            datasets: [{
                label: "Home Temp Monitor",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [74.8, 74.6, 74.9, 74.9, 74.8, 74.9, 74.9]
            }]
        };

        //this.setState({chart: chart});
    },

	/**
	 * componentWillUnmount - function is called when a component is
	 * about to be unmounted from the DOM.
	 */
    componentWillUnmount: function() {
        log.verbose('content.jsx - componentWillUnmount');
    },

	/**
	 * This function is written in JSX syntax to provide an HTML-like
	 * view of the react component
	 */
    render: function() {
        log.verbose('content.jsx - render() ');

        var maybeChart = null;
        if (this.state.chart) {
            maybeChart = ( <LineChart data={this.state.chart} options={{}} width="600" height="250"/> );
        }

        return (
            <div>
                {maybeChart}
			</div>
    	);
    }
});

function updateChart() {
    var url = "https://repkam09.com/tools/raspi-temp-monitor/templogfile.txt";
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var file = xmlhttp.responseText;
            debugger;
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

module.exports = ContentView;