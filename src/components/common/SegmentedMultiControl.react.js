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
      selected: this.props.selected,
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
          var isSelected = (this.props.selected.indexOf(segment.value) !== -1);
          return (
            <span 
              key={i}
              style={
                {
                  maxWidth: this.state.segmentWidth
                }
              }
              onClick={this.onChange.bind(this, segment, i)} 
              className={classnames({'is-selected': isSelected}, this.props.segmentClassName)}>
              <span className={`m-segmented-control__label icon icon-${segment.value}`}></span>
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
    var wasSelected = (this.props.selected.indexOf(segment.value) !== -1),
        selectedSegments = this.props.selected.slice();

    if(wasSelected) {
      _.remove(selectedSegments, function(selectedSegment) {
        return selectedSegment === segment.value;
      });
    } else {
      selectedSegments.push(segment.value)
    }

    if(this.props.onChange) {
      this.props.onChange(selectedSegments, segment.value, i);
    }
  }
})

module.exports = SegmentedControl;