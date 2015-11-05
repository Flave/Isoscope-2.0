var React = require('react'),
    classnames = require('classnames'),
    _ = require('lodash');


var Accordeon = React.createClass({
  render: function() {
    return (
      <div className="m-idle">
        <p>Click somewhere on the map to see how far you get by <span className="m-idle__highlight m-idle__highlight--car">car</span>, <span className="m-idle__highlight m-idle__highlight--public-transport">public transport</span> or by <span className="m-idle__highlight m-idle__highlight--bike">bike</span>.</p>
      </div>
    )
  }
});

module.exports = Accordeon;