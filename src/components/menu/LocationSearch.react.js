var React = require('react');


var LocationSearch = React.createClass({
  render: function() {
    return (
      <div className='m-search-bar'>
        <input className="m-search-bar__input" placeholder="Search for any Location" type="text" />
      </div>
    );
  }
});

module.exports = LocationSearch;