var React = require('react'),
    classnames = require('classnames');

var SegmentedControl = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    segmentClassName: React.PropTypes.string,
    selectedClassName: React.PropTypes.string,
    onChange: React.PropTypes.func,
    segments: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      className: 'm-segmented-control',
      segmentClassName: 'm-segmented-control__segment',
      selectedClassName: 'is-selected',
      onChange: function() {},
      segments: []
    }
  },

  getInitialState: function() {
    return {
      selected: this.props.selected || this.props.segments[0].value,
      segmentWidth: 5
    }
  },

  componentDidMount: function() {
    var rootElement = this.refs.root.getDOMNode(),
        rootWidth = rootElement.offsetWidth,
        segmentWidth = rootWidth / this.props.segments.length;

    this.setState({segmentWidth: segmentWidth});
  },

  render: function() {
    var segmentsMarkup = this.props.segments.map(function(segment, i) {
          var isSelected = (segment.value === this.props.selected);

          return (
            <span 
              key={i}
              style={
                {width: this.state.segmentWidth}
              }
              onClick={this.onChange.bind(this, segment, i)} 
              className={classnames({'is-selected': isSelected}, this.props.segmentClassName, `m-segmented-control__segment--${segment.value}`)}>
              <span className='m-segmented-control__label'>{segment.label}</span>
            </span>
          )
        }.bind(this));

    return (
        <div ref="root" className={this.props.className}>
          {segmentsMarkup}
        </div>
      )
  },

  onChange: function(segment, i) {
    this.setState({selected: segment.value}, function() {
      if(this.props.onChange) {
        this.props.onChange(segment.value, segment.label, i);
      }
    });

  }
})

module.exports = SegmentedControl;