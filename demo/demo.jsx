
var React = require('react');
var ReactDOM = require('react-dom');
var Goban = require('..').Goban;

var DemoApp = React.createClass({
    getInitialState: function() {
	var sample1 = {"P16":"black"};
	var theme = "classic";
	var intersection = "none yet";
	return {position:sample1, theme:theme, intersection:intersection};
    },
    handleIntersectionClick: function(intersection) {
	this.setState({intersection:intersection});
    },
    handleClickClassic: function(event) {
	var theme = "classic";
	this.setState({theme:theme});
    },
    handleClickPaper: function(event) {
	var theme = "paper";
	this.setState({theme:theme});
    },
    handleClick1: function(event) {
	var sample1 = {"P16":"black"};
	this.setState({position:sample1});
    },
    handleClick2: function(event) {
	var sample2 = {"P16":"black","Q4":"white"};
	this.setState({position:sample2});
    },
    handleClick3: function(event) {
	var sample3 = {"P16":"black","Q4":"white","D4":"black"};
	this.setState({position:sample3});
    },
    handleClick4: function(event) {
	var sample4 = {"P16":"black","Q4":"white","D4":"black","E16":"white"};
	this.setState({position:sample4});
    },
    render: function() {
	return (
		<div>
		  <div id="menu">
		    <p>Last click received from callback: <strong>{this.state.intersection}</strong></p>
		    <p>Modify properties of stateless Goban:</p>
		    <button onClick={this.handleClickClassic}>classic</button>
		    <button onClick={this.handleClickPaper}>paper</button>
		    <button onClick={this.handleClick1}>1 stone</button>
		    <button onClick={this.handleClick2}>2 stones</button>
		    <button onClick={this.handleClick3}>3 stones</button>
		    <button onClick={this.handleClick4}>4 stones</button>
		  </div>
		  <Goban size="19" theme={this.state.theme} stones={this.state.position} onIntersectionClick={this.handleIntersectionClick}/>
		</div>
	);
    }
});


ReactDOM.render(
  <DemoApp />, document.getElementById('content')
);
