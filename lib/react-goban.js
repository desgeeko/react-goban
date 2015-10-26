/**
 * react-goban
 * react-goban.jsx
 *
 */

/** @todo Split into multiple files (one per class)? */
/** @todo Add Pure Render Mixin or shouldComponentUpdate tests in order to minimize redraws */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactDOM = require('react-dom');
var SVGoban = require('svgoban');

/**
 * Converts shape list into React SVG elements.
 *
 * @param {Array} shape list
 * @returns {Array} React element list
 */
function toElem(shapes) {
	var typeofShape;
	var txt = null;
	var k = 0;
	for (var i = 0; i < shapes.length; i++) {
		typeofShape = shapes[i].type;
		if (typeofShape == "text") {
			txt = shapes[i].txt;
			delete shapes[i].txt;
		}
		if (shapes[i]['class']) {
			shapes[i].className = shapes[i]['class'];
			delete shapes[i]['class'];
		}
		delete shapes[i].type;
		shapes[i].key = k++;
		shapes[i] = React.createElement(typeofShape, shapes[i], txt);
	}
	return shapes;
}

var LabelsLayer = React.createClass({
	displayName: 'LabelsLayer',

	render: function render() {
		return React.createElement(
			'g',
			{ className: 'labels_layer' },
			toElem(SVGoban.shapeLabels(this.props.size))
		);
	}
});

var GridLayer = React.createClass({
	displayName: 'GridLayer',

	render: function render() {
		return React.createElement(
			'g',
			{ className: 'grid_layer' },
			toElem(SVGoban.shapeGrid(this.props.size))
		);
	}
});

var StarPointsLayer = React.createClass({
	displayName: 'StarPointsLayer',

	render: function render() {
		return React.createElement(
			'g',
			{ className: 'starpoints_layer' },
			toElem(SVGoban.shapeStarPoints(this.props.size))
		);
	}
});

var StonesLayer = React.createClass({
	displayName: 'StonesLayer',

	render: function render() {
		return React.createElement(
			'g',
			{ className: 'stones_layer' },
			toElem(SVGoban.shapeStones(this.props.size, this.props.set))
		);
	}
});

var Style = React.createClass({
	displayName: 'Style',

	render: function render() {
		return React.createElement(
			'style',
			null,
			SVGoban.Themes[this.props.theme]()
		);
	}
});

var Definitions = React.createClass({
	displayName: 'Definitions',

	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		return false;
	},
	render: function render() {
		var b = SVGoban.defineRadialColors("black");
		var w = SVGoban.defineRadialColors("white");
		return React.createElement(
			'defs',
			null,
			React.createElement(
				'radialgradient',
				_extends({ id: "blackgrad" }, b.gradient),
				React.createElement('stop', { offset: '0%', style: { "stop-color": b.a, "stop-opacity": "1" } }),
				React.createElement('stop', { offset: '100%', style: { "stop-color": b.z, "stop-opacity": "1" } })
			),
			React.createElement(
				'radialgradient',
				_extends({ id: "whitegrad" }, w.gradient),
				React.createElement('stop', { offset: '0%', style: { "stop-color": w.a, "stop-opacity": "1" } }),
				React.createElement('stop', { offset: '100%', style: { "stop-color": w.z, "stop-opacity": "1" } })
			)
		);
	}
});

/** @todo Add property to handle SVG className (next color to play) */

var Goban = React.createClass({
	displayName: 'Goban',

	render: function render() {
		var viewBox = SVGoban.shapeArea().join(" ");
		return React.createElement(
			'div',
			{ className: 'svgoban' },
			React.createElement(
				'svg',
				{ id: 'goban', className: 'board black', viewBox: viewBox, xmlns: 'http://www.w3.org/2000/svg', version: '1.1', height: '100%' },
				React.createElement(Style, { theme: this.props.theme }),
				React.createElement(Definitions, null),
				React.createElement('rect', { className: 'wood', height: '100%', width: '100%', y: '0', x: '0' }),
				React.createElement(GridLayer, { size: this.props.size }),
				React.createElement(StarPointsLayer, { size: this.props.size }),
				React.createElement(LabelsLayer, { size: this.props.size }),
				React.createElement(StonesLayer, { size: this.props.size, set: this.props.stones })
			)
		);
	}
});

exports.Goban = Goban;
