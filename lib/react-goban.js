/**
 * react-goban
 * react-goban.jsx
 *
 */

/** @todo Split into multiple files (one per class)? */

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
						if (shapes[i]['class']) {
									shapes[i].className = shapes[i]['class'];
									delete shapes[i]['class'];
						}
						delete shapes[i].type;
						shapes[i].key = shapes[i].key || k++;
						if (callback) shapes[i].onClick = callback.bind(null, shapes[i].key); // Replace this by null for React
						shapes[i] = React.createElement(typeofShape, shapes[i], txt);
			}
			return shapes;
}

var LabelsLayer = React.createClass({
			displayName: 'LabelsLayer',

			shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
						return nextProps.size !== this.props.size;
			},
			render: function render() {
						var pseudoLabels = SVGoban.shapeLabels(this.props.size);
						return React.createElement(
									'g',
									{ className: 'labels_layer' },
									toElem(pseudoLabels)
						);
			}
});

var BackgroundLayer = React.createClass({
			displayName: 'BackgroundLayer',

			render: function render() {
						var pseudoBackground = SVGoban.shapeBackground(this.props.noMargin);
						return React.createElement(
									'g',
									{ className: 'background_layer' },
									toElem(pseudoBackground)
						);
			}
});

var GridLayer = React.createClass({
			displayName: 'GridLayer',

			shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
						return nextProps.size !== this.props.size;
			},
			render: function render() {
						var pseudoLines = SVGoban.shapeGrid(this.props.size);
						return React.createElement(
									'g',
									{ className: 'grid_layer' },
									toElem(pseudoLines)
						);
			}
});

var StarPointsLayer = React.createClass({
			displayName: 'StarPointsLayer',

			shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
						return nextProps.size !== this.props.size;
			},
			render: function render() {
						var pseudoStarPoints = SVGoban.shapeStarPoints(this.props.size);
						return React.createElement(
									'g',
									{ className: 'starpoints_layer' },
									toElem(pseudoStarPoints)
						);
			}
});

/**
 * 1st approach: bulk rendering of all stones/placeholders
 *
 */
var FlatStonesLayer = React.createClass({
			displayName: 'FlatStonesLayer',

			handleClick: function handleClick(intersection) {
						this.props.onIntersectionClick(intersection);
			},
			render: function render() {
						var pseudoStones = SVGoban.shapeStones(this.props.size, this.props.set);
						return React.createElement(
									'g',
									{ className: 'stones_layer' },
									toElem(pseudoStones, this.handleClick)
						);
			}
});

/**
 * 2nd approach: stones/placeholders layer is a composite list of Stone components individually rendered
 *
 */
var CompositeStonesLayer = React.createClass({
			displayName: 'CompositeStonesLayer',

			handleClick: function handleClick(intersection) {
						this.props.onIntersectionClick(intersection);
			},
			render: function render() {
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
												items.push(React.createElement(Stone, { key: coord, size: this.props.size, intersection: coord,
															color: color, onIntersectionClick: this.handleClick }));
									}
						}
						var cls = "stones_layer " + this.props.nextToPlay;
						return React.createElement(
									'g',
									{ className: cls },
									items
						);
			}
});

var Stone = React.createClass({
			displayName: 'Stone',

			shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
						var idem = nextProps.size === this.props.size && nextProps.intersection === this.props.intersection && nextProps.color === this.props.color;
						return !idem;
			},
			render: function render() {
						var pseudoStone = SVGoban.shapeStone(this.props.size, this.props.intersection, this.props.color);
						return toElem(pseudoStone, this.props.onIntersectionClick)[0];
			}
});

var Style = React.createClass({
			displayName: 'Style',

			shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
						return nextProps.theme !== this.props.theme;
			},
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

			getDefaultProps: function getDefaultProps() {
						return {
									size: "19",
									theme: "classic"
						};
			},
			render: function render() {
						var viewBox = SVGoban.shapeArea(this.props.hideBorder).join(" ");
						return React.createElement(
									'div',
									{ className: 'react-goban' },
									React.createElement(
												'svg',
												{ className: 'svgoban', viewBox: viewBox, xmlns: 'http://www.w3.org/2000/svg', version: '1.1', height: '100%' },
												React.createElement(Style, { theme: this.props.theme }),
												React.createElement(Definitions, null),
												React.createElement(BackgroundLayer, { noMargin: this.props.noMargin }),
												React.createElement(GridLayer, { size: this.props.size }),
												React.createElement(StarPointsLayer, { size: this.props.size }),
												React.createElement(LabelsLayer, { size: this.props.size }),
												React.createElement(CompositeStonesLayer, { size: this.props.size, set: this.props.stones,
															nextToPlay: this.props.nextToPlay, onIntersectionClick: this.props.onIntersectionClick })
									)
						);
			}
});

exports.Goban = Goban;
