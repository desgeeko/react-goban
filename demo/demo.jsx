
var React = require('react');
var ReactDOM = require('react-dom');
var Goban = require('..').Goban;

var DemoApp = React.createClass({
getInitialState: function() {
var sample = {"P16":"black","Q4":"white","D4":"black","E16":"white"};
    return {position:sample};
  },
  render: function() {
    return (
<div>
<Goban size="19" theme="classic" stones={this.state.position}/>
</div>
    );
  }
});


ReactDOM.render(
  <DemoApp />, document.getElementById('content')
);
