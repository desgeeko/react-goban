/**
 * react-goban
 * react-goban.jsx
 *
 */

/** @todo Split into multiple files (one per class)? */


var React = require('react');
var ReactDOM = require('react-dom');
var SVGoban = require('svgoban');

/**
 * Converts shape list into React SVG elements.
 *
 * @param {Array} shape list
 * @returns {Array} React element list
 */
function toElem(shapes, callback) {
    var typeofShape;
    var txt = null;
    var k = 0;
    for (var i = 0; i < shapes.length; i++) {
	typeofShape = shapes[i].type;
	if (typeofShape == "text") {
	    txt = shapes[i].txt;
	    delete shapes[i].txt;
	}
	if (shapes[i].class) {
	    shapes[i].className = shapes[i].class
	    delete shapes[i].class;
	}
	delete shapes[i].type;
	shapes[i].key = shapes[i].key || k++;
	if (callback) shapes[i].onClick=callback.bind(null, shapes[i].key); // Replace this by null for React
	shapes[i] = React.createElement(typeofShape, shapes[i], txt);
    }
    return shapes;
}

var LabelsLayer = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
	return (nextProps.size !== this.props.size);
    },
    render: function() {
	var pseudoLabels = SVGoban.shapeLabels(this.props.size);
	return (
		<g className="labels_layer">{toElem(pseudoLabels)}</g>
	);
    }
});

var GridLayer = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
	return (nextProps.size !== this.props.size);
    },
    render: function() {
	var pseudoLines = SVGoban.shapeGrid(this.props.size);
	return (
		<g className="grid_layer">{toElem(pseudoLines)}</g>
	);
    }
});

var StarPointsLayer = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
	return (nextProps.size !== this.props.size);
    },
    render: function() {
	var pseudoStarPoints = SVGoban.shapeStarPoints(this.props.size);
	return (
		<g className="starpoints_layer">{toElem(pseudoStarPoints)}</g>
	);
    }
});


/**
 * 1st approach: bulk rendering of all stones/placeholders
 *
 */
var FlatStonesLayer = React.createClass({
    handleClick: function(intersection) {
	this.props.onIntersectionClick(intersection);
    },
    render: function() {
	var pseudoStones = SVGoban.shapeStones(this.props.size, this.props.set);
	return (
		<g className="stones_layer">{toElem(pseudoStones, this.handleClick)}</g>
	);
    }
});

/**
 * 2nd approach: stones/placeholders layer is a composite list of Stone components individually rendered
 *
 */
var CompositeStonesLayer = React.createClass({
    handleClick: function(intersection) {
	this.props.onIntersectionClick(intersection);
    },
    render: function() {
	var i, j, skipI, hletter, vnumber, coord, color;
	var size = +this.props.size;
	var items = [];

	for (i = 1; i <= size; i++) {
	    skipI = i >= 9 ? 1 : 0;
	    hletter = String.fromCharCode(64 + i + skipI);
	    for (j = 1; j <= size; j++) {
		vnumber = j.toString();
		coord = hletter + vnumber; 
		color = this.props.set[coord] || "placeholder";
		items.push(<Stone key={coord} size={this.props.size} intersection={coord} 
			   color={color} onIntersectionClick={this.handleClick} />);
	    }
	}
	var cls = "stones_layer " + this.props.nextToPlay;
	return (
		<g className={cls}>{items}</g>
	);
    }
});

var Stone = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
	var idem = (nextProps.size === this.props.size 
		    && nextProps.intersection === this.props.intersection 
		    && nextProps.color === this.props.color);
	return !idem;
    },
    render: function() {
	var pseudoStone = SVGoban.shapeStone(this.props.size, this.props.intersection, this.props.color);
	return (
		toElem(pseudoStone, this.props.onIntersectionClick)[0]
	);
    }
});

var Style = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
	return (nextProps.theme !== this.props.theme);
    },
    render: function() {
	return (
		<style>{SVGoban.Themes[this.props.theme]()}</style>
	);
    }
});

var Definitions = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
	return false;
    },
    render: function() {
	var b = SVGoban.defineRadialColors("black");
	var w = SVGoban.defineRadialColors("white");
	return (
		<defs>
		  <radialgradient id={"blackgrad"} {...b.gradient}>
		    <stop offset="0%" style={{"stop-color": b.a, "stop-opacity":"1"}}/>
		    <stop offset="100%" style={{"stop-color": b.z, "stop-opacity":"1"}}/>
		  </radialgradient>
		  <radialgradient id={"whitegrad"} {...w.gradient}>
		    <stop offset="0%" style={{"stop-color": w.a, "stop-opacity":"1"}}/>
		    <stop offset="100%" style={{"stop-color": w.z, "stop-opacity":"1"}}/>
		  </radialgradient>
		</defs>
	);
    }
});

/** @todo Add property to handle SVG className (next color to play) */

var Goban = React.createClass({
    getDefaultProps: function() {
	return {
	    size: "19",
	    theme: "classic"
	};
    },
    render: function() {
	var viewBox = SVGoban.shapeArea().join(" ");
	return (
		<div className="react-goban">
		  <svg className="svgoban" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" version="1.1" height="100%"> 
		    <Style theme={this.props.theme}/>
		    <Definitions/>
		    <rect className="wood" height="100%" width="100%" y="0" x="0" />
		    <GridLayer size={this.props.size}/>
		    <StarPointsLayer size={this.props.size}/>
		    <LabelsLayer size={this.props.size}/>
		    <CompositeStonesLayer size={this.props.size} set={this.props.stones} 
	               nextToPlay={this.props.nextToPlay} onIntersectionClick={this.props.onIntersectionClick}/>
		  </svg>
		</div>
	);
    }
});

exports.Goban = Goban;

