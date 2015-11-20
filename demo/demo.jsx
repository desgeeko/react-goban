
var React = require('react');
var ReactDOM = require('react-dom');
var Goban = require('..').Goban;

var DemoApp = React.createClass({
    getInitialState: function() {
	return {position: {}, 
		theme: "classic", 
		hideBorder: false,
		noMargin: false,
		intersection: "none yet", 
		nextToPlay: "black"};
    },
    handleIntersectionClick: function(intersection) {
	this.setState({intersection: intersection});
    },
    handleClickTheme: function(event) {
	var newTheme = (this.state.theme == "classic") ? "paper" : "classic";
	this.setState({theme: newTheme});
    },
    handleClickBorder: function(event) {
	var newBorder = (this.state.hideBorder == false) ? true : false;
	this.setState({hideBorder: newBorder});
    },
    handleClickMargin: function(event) {
	var newMargin = (this.state.noMargin == false) ? true : false;
	this.setState({noMargin: newMargin});
    },
    handleClick1: function(event) {
	var sample1 = {"P16": "black"};
	this.setState({position: sample1});
    },
    handleClick2: function(event) {
	var sample2 = {"P16": "black", "Q4": "white"};
	this.setState({position: sample2});
    },
    handleClick3: function(event) {
	var sample3 = {"P16": "black", "Q4": "white", "D4": "black"};
	this.setState({position: sample3});
    },
    handleClick4: function(event) {
	var sample4 = {"P16": "black", "Q4": "white", "D4": "black", "E16": "white"};
	this.setState({position: sample4});
    },
    handleClickBW: function(event) {
	var newColor = (this.state.nextToPlay == "black") ? "white" : "black";
	this.setState({nextToPlay: newColor});
    },
    render: function() {
	return (
		<div>
		  <div id="menu">
		    <p>Last click received from callback: <strong>{this.state.intersection}</strong></p>
		    <p>Init board content:</p>
		    <button onClick={this.handleClick2}>2 stones</button>
		    <button onClick={this.handleClick4}>4 stones</button>
		<br/>
		    <p>Toggle properties of stateless Goban:</p>
		    <button onClick={this.handleClickTheme}>theme</button>
		    <button onClick={this.handleClickMargin}>margin</button>
		    <button onClick={this.handleClickBorder}>border</button>
		    <button onClick={this.handleClickBW}>nextToPlay (B/W hover)</button>
		  </div>
		  <Goban theme={this.state.theme} stones={this.state.position} 
	                 nextToPlay={this.state.nextToPlay} onIntersectionClick={this.handleIntersectionClick}
	                 hideBorder={this.state.hideBorder} noMargin={this.state.noMargin}/>
		</div>
	);
    }
});


ReactDOM.render(
  <DemoApp />, document.getElementById('content')
);
