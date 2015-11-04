var React = require('react'),
    _ = require('lodash');

var Tooltip = React.createClass({
  getDefaultProps: function() {
    return {
      options: [],
      value: undefined,
      onChange: function() {}
    }
  },


  getInitialState: function() {
    return {
      value: undefined
    }
  },


  _handleChange: function(e) {
    var option = _.findWhere(this.props.options, {value: e.target.value});
    this.props.onChange(option);
  },
  render: function() {
    //var value = this.props.value !== undefined ? this.props.value : this.state.value || this.props.options[0].value;

    return (
      <div className='m-select'>
        <select 
          className='m-select__ui'
          defaultValue='berlin'
          onChange={this._handleChange}>

          {_.map(this.props.options, function(option, i) {
            return (
              <option 
                className='m-select__option'
                value={option.value}
                key={i} >
                {option.label}
              </option>
            )
          }.bind(this))}
        </select>
      </div>
    )

    return <div/>
  }
});

module.exports = Tooltip;