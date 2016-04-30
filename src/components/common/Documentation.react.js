var React = require('react'),
    classnames = require('classnames'),
    _ = require('lodash'),
    StateStore = require('app/stores/StateStore');

var StateStore = require('app/stores/StateStore');


var Documentation = React.createClass({
  handleCloseClick: function() {

    this.setState({expandedPanels: expandedPanels});
  },

  render: function() {
    return (
      <div className="m-documentation">
        <div className="m-documentation__inner">
          <div className="m-documentation__content">
            <h2>Isoscope 2.0</h2>
            <p>
              Isoscope Two maps the time-varying quality of mobility. A web-based tool displays reachable areas of different transport modes in a unified visualization with the help of layered isochrone maps. The visualization allows comparing how travel patterns change over time, and how spatio-temporal variations affect urban mobility. In contrast to conventional isochrone maps which display distances in regular intervals, this project tries out new ways of displaying multiple categories of overlapping isolines at the same time. 
              This work is based on <a href="http://isoscope.fh-potsdam.de/">Isoscope 1.0</a> by Flavio Gortana, Sebastian Kaim, and Martin von Lupin under supervision by Till Nagel.
            </p>
            <p>
              Created by <a href="http://flavio.is">Flavio Gortana</a> under supervision of <a href="http://streamsandtraces.com/en/people.php#tillnagel">Till Nagel</a> and <a href="http://mariandoerk.de/">Marian Dörk</a> in the <a href="http://uclab.fh-potsdam.de/">Urban Complexity Lab</a> of <a href="http://www.fh-potsdam.de/">FH Potsdam</a>.
            </p>
          </div>
          <span onClick={this._handleCloseClick} className="m-documentation__close">+</span>
            <div className="m-documentation__attributions">
              <a href="http://www.fh-potsdam.de/" target="_blank">
                <img className="m-documentation__attribution" src="/assets/logo-fhp.png"/>
              </a>
              <a href="http://motionintelligence.net/" target="_blank">
                <img className="m-documentation__attribution" src="/assets/logo-mi.png"/>
              </a>
              <a href="https://www.here.com" target="_blank">
                <img className="m-documentation__attribution" src="/assets/logo-here.png"/>
              </a>
            </div>
        </div>
      </div>
    )
  },

  _handleCloseClick: function() {
    StateStore.set({documentationIsOpen: false});
  }
});

module.exports = Documentation;