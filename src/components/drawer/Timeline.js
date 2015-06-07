var d3 = require('d3');

function Timeline() {
  var data,
      size,
      padding = {top: 10, right: 10, bottom: 10, left: 10},
      svg;


  function _timeline(_svg) {
    if(!data.length) return;
    svg = _svg;
  }

  _timeline.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return _timeline;
  }

  _timeline.data = function(_) {
    if(!arguments.length) return data;
    data = _data;
    return _timeline;
  }

  return _timeline;
}

module.exports = Timeline;