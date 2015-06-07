var React = require('react');

var SegmentedControl = React.createClass({
  getDefaultProps: function() {
    return {
      className: 'segmented-control',
      itemClassName: 'segmented-control__item',
      selectedClassName: 'segmented-control__item--active',
      onChange: function() {},
      items: []
    }
  },
  getInitialState: function() {
    return {
      selected: this.props.selected || this.props.items[0].value
    }
  },
  propTypes: {
    className: React.PropTypes.string,
    itemClassName: React.PropTypes.string,
    selectedClassName: React.PropTypes.string,
    onChange: React.PropTypes.func,
    items: React.PropTypes.array
  },
  render: function() {
    var that = this;
    var itemsMarkup = this.props.items.map(function(item, i) {
      var selectedClass = item.value === that.props.selected ? `${that.props.selectedClassName} ` : '';
      return (
          <span key={i} onClick={that.onChange.bind(that, item, i)} className={`${selectedClass}${that.props.itemClassName}`}>
            <span className='label'>{item.label}</span>
          </span>
        )

    });

    return (
        <div className={this.props.className}>
          {itemsMarkup}
        </div>
      )
  },

  onChange: function(item, i) {
    this.setState({selected: item.value}, function() {
      if(this.props.onChange) {
        this.props.onChange(item, i);
      }
    });

  }
})

module.exports = SegmentedControl;