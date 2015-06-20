var React = require('react');


var LocationSearch = React.createClass({
  render: function() {
    return (
      <div className={'location-search'}>
        <input className="input" placeholder="Search for any Location" type="text" />
      </div>
    );
  }
});

module.exports = LocationSearch;