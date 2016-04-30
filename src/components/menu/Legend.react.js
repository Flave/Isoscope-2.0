var React = require('react'),
    classNames = require('classnames'),
    Tooltip = require('app/components/common/Tooltip.react'),
    StateStore = require('app/stores/StateStore');

var infos = [
  "Traveling in this direction you would get the furthest by car, followed by the bike and public transport.",
  "Traveling in this direction you would get the furthest by bike, followed by the car and public transport."
]

var Legend = React.createClass({
  getInitialState: function() {
    return {
      hoveredInfo: null
    }
  },


  render: function() {
    return (
      <div className={classNames(
          'm-ui-panel__section', 
          'm-cluster-legend', 
          'm-ui-panel__section--collapsible',
          {'is-expanded': this.props.isExpanded})}>
        <h3 onClick={this.props.onToggle} className="m-ui-panel__section-title">Info</h3>
        {this.props.isExpanded ? (
          <div className='m-cluster-legend__inner'>
            <p>When you click on the map you will see the area you can reach within the given amount of time for different means of transportation. Every transport modality has it's own shape due to speed, traffic and underlying infrastructure. 
              <br/> <span onClick={this._handleMoreInfoClick} className="btn">More Info</span>
            </p>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="250px" height="250px" viewBox="0 0 250 250">
              <path fill="none" stroke="#FF5F85" strokeWidth="5" strokeLinecap="round" strokeMiterlimit="10" d="M26.346,173.399c-6.624,12.743-10.258,24.368-0.983,34.439C47.819,232.22,80.01,244.46,115.77,244.46c35.079,0,69.001-1.8,91.391-25.376c20.923-22.033,39.073-61.682,39.073-94.464c0-31.548-25.548-55.765-45.089-77.523C178.65,22.051,152.086,3.263,115.77,3.263c-31.346,0-59.952,10.22-81.659,29.54c-13.717,12.209-9.049,27.446-1.907,44.66"/>
              <path fill="none" stroke="#FF5F85" strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10" d="M26.346,173.399c7.773-14.953,19.665-31.447,19.665-48.779c0-16.707-7.784-32.636-13.809-47.156"/>
              <path fill="none" stroke="#5E94FA" strokeWidth="5" strokeLinecap="round" strokeMiterlimit="10" d="M32.203,77.463c-9.546,11.994-15.649,25.467-17.148,46.384c-1.581,22.067,0.842,37.036,11.291,49.551"/>
              <path fill="none" stroke="#5E94FA" strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10" d="M26.346,173.399c3.535,4.234,7.985,8.187,13.511,12.038c19.705,13.729,41.017,15.583,72.615,15.583c30.996,0,50.411-5.563,69.196-26.45c10.327-11.482,16.664-27.984,16.813-51.482c0.116-18.304-6.529-35.212-18.245-45.889c-17.029-15.518-28.785-14.487-47.524-13.097"/>
              <path fill="none" stroke="#5E94FA" strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10" d="M90.642,58.916c-13.429-7.223-22.619-16.825-35.787-4.59c-8.799,8.175-16.451,15.345-22.652,23.137"/>
              <path fill="none" stroke="#5E94FA" strokeWidth="0.75" strokeLinecap="round" strokeMiterlimit="10" d="M90.642,58.916c6.133,3.299,13.148,6.101,21.832,6.101c7.705,0,14.317-0.475,20.238-0.914"/>
              <path fill="none" stroke="#FAC25E" strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10" d="M132.712,64.103c-7.185-16.931-11.584-35.285-21.938-35.074c-11.426,0.233-16.768,14.444-20.132,29.888"/>
              <path fill="none" stroke="#FAC25E" strokeWidth="0.75" strokeLinecap="round" strokeMiterlimit="10" d="M90.642,58.916c-2.45,11.25-3.85,23.153-5.785,30.782c-4.233,16.684-32.056,51.829-25.872,78.333c6.183,26.503,37.216,21.156,51.789,18.702c21.8-3.67,42.206-4.511,52.386-18.864c6.231-8.785,10.786-15.692,8.39-34.329c-2.397-18.637-11.873-32.971-27.624-50.292c-4.668-5.134-8.189-12.013-11.214-19.144"/>
              <line fill="none" stroke="#303030" strokeMiterlimit="10" x1="119.395" y1="128.986" x2="206.39" y2="222.515"/>
              <line fill="none" stroke="#303030" strokeMiterlimit="10" x1="118.997" y1="129.456" x2="14.594" y2="129.456"/>
              <g id="info-01">
                <circle fill="#FF5F85" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" cx="205.219" cy="220.405" r="11.689"/>
                <path fill="#FFFFFF" d="M206.353,216.246c0,0.683-0.464,1.175-1.134,1.175c-0.668,0-1.134-0.492-1.134-1.175c0-0.683,0.465-1.175,1.134-1.175C205.889,215.072,206.353,215.564,206.353,216.246z M204.168,225.683v-7.348h2.103v7.348H204.168z"/>
              </g>
              <g id="info-02">
                <circle fill="#5E94FA" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" cx="14.284" cy="129.169" r="11.689"/>
                <path fill="#FFFFFF" d="M15.417,125.011c0,0.683-0.464,1.175-1.134,1.175c-0.668,0-1.134-0.492-1.134-1.175s0.465-1.174,1.134-1.174C14.953,123.837,15.417,124.328,15.417,125.011z M13.232,134.448v-7.348h2.103v7.348L13.232,134.448L13.232,134.448z"/>
              </g>
              <circle fill="#5E94FA" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" cx="171.142" cy="184.621" r="4.635"/>
              <circle fill="#FF5F85" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" cx="46.047" cy="129.127" r="4.635"/>
              <circle fill="#FAC25E" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" cx="158.915" cy="171.453" r="3.605"/>
              <circle fill="#FAC25E" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" cx="66.739" cy="129.127" r="3.605"/>
              <g>
                <path id="Oval-37-Copy-2" fill="#303030" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" d="M118.684,130.552c0,0,8.465-13.928,8.465-18.677c0-4.749-3.79-8.6-8.465-8.6s-8.465,3.85-8.465,8.6C110.219,116.624,118.684,130.552,118.684,130.552z"/>
                <circle fill="#FFFFFF" cx="118.684" cy="112.681" r="2.822"/>
              </g>
            </svg>
            <Tooltip
              for='#info-01'>
              {infos[0]}
            </Tooltip>
            <Tooltip
              for='#info-02'>
              {infos[1]}
            </Tooltip>
          </div>
          ) : undefined}
      </div>
    )
  },

  _handleMoreInfoClick: function() {
    StateStore.set({documentationIsOpen: true});
  }
});

module.exports = Legend;