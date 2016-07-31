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
	return ((nextProps.size !== this.props.size) || (nextProps.coordSystem !== this.props.coordSystem));
    },
    render: function() {
	var pseudoLabels = SVGoban.shapeLabels(this.props.size, this.props.coordSystem);
	return (
		<g className="labels_layer">{toElem(pseudoLabels)}</g>
	);
    }
});

var BackgroundLayer = React.createClass({
    render: function() {
	var pseudoBackground = SVGoban.shapeBackground(this.props.noMargin);
	return (
		<g className="background_layer">{toElem(pseudoBackground)}</g>
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

var MarkersLayer = React.createClass({
    render: function() {
	var pseudoMarkers = SVGoban.shapeMarkers(this.props.size, this.props.markers, this.props.positions);
	return (
		<g className="markers_layer">{toElem(pseudoMarkers)}</g>
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
	var i, j, skipI, hA1, vA1, haa, vaa, coordA1, coordaa, color;
	var size = +this.props.size;
	var items = [];

	for (i = 1; i <= size; i++) {
	    skipI = i >= 9 ? 1 : 0;
	    hA1 = String.fromCharCode(64 + i + skipI);
	    haa = String.fromCharCode(96 + i);
	    for (j = 1; j <= size; j++) {
		vA1 = j.toString();
		vaa = String.fromCharCode(96 + size - j + 1);
		coordA1 = hA1 + vA1;
		coordaa = haa + vaa;
		color = this.props.set[coordA1] || this.props.set[coordaa] || "placeholder";
		items.push(<Stone key={coordA1} size={this.props.size} intersection={coordA1} 
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
		  <radialGradient id={"blackgrad"} {...b.gradient}>
		    <stop offset="0%" style={{"stop-color": b.a, "stop-opacity":"1"}}/>
		    <stop offset="100%" style={{"stop-color": b.z, "stop-opacity":"1"}}/>
		  </radialGradient>
		  <radialGradient id={"whitegrad"} {...w.gradient}>
		    <stop offset="0%" style={{"stop-color": w.a, "stop-opacity":"1"}}/>
		    <stop offset="100%" style={{"stop-color": w.z, "stop-opacity":"1"}}/>
		  </radialGradient>
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
	var viewBox = SVGoban.shapeArea(this.props.hideBorder).join(" ");
	return (
		<div className="react-goban">
		  <svg className="svgoban" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" version="1.1" height="100%"> 
		    <Style theme={this.props.theme}/>
		    <Definitions/>
		    <BackgroundLayer noMargin={this.props.noMargin}/>
		    <GridLayer size={this.props.size}/>
		    <StarPointsLayer size={this.props.size}/>
		    <LabelsLayer size={this.props.size} coordSystem={this.props.coordSystem}/>
		    <CompositeStonesLayer size={this.props.size} set={this.props.stones} 
	               nextToPlay={this.props.nextToPlay} onIntersectionClick={this.props.onIntersectionClick}/>
		    <MarkersLayer size={this.props.size} markers={this.props.markers} positions={this.props.stones}/>
		  </svg>
		</div>
	);
    }
});

exports.Goban = Goban;

