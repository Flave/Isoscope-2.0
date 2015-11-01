var React = require('react');

var legend = React.createClass({
  render: function() {

    return (
      <div className='m-cluster-legend'>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="430px" height="430px" viewBox="0 0 450 450" enableBackground="new 0 0 450 450">
        <path fill="none" stroke="#FF5F85" strokeWidth="5" strokeLinecap="round" d="M128.658,272.219c-7.043,13.548-10.906,25.908-1.045,36.615c23.874,25.923,58.099,38.936,96.119,38.936c37.296,0,73.361-1.914,97.165-26.979c22.245-23.425,41.542-65.579,41.542-100.433c0-33.541-27.162-59.289-47.938-82.421c-23.916-26.628-52.159-46.604-90.769-46.604c-33.327,0-63.74,10.866-86.819,31.407c-14.584,12.98-9.621,29.18-2.028,47.482"/>
        <path fill="none" stroke="#FF5F85" strokeWidth="3" strokeLinecap="round" d="M128.658,272.219c8.264-15.898,20.908-33.434,20.908-51.861c0-17.763-8.276-34.698-14.681-50.136"/>
        <path fill="none" stroke="#5E94FA" strokeWidth="5" strokeLinecap="round" d="M134.885,170.222c-10.149,12.752-16.638,27.076-18.231,49.315c-1.681,23.461,0.895,39.376,12.004,52.682"/>
        <path fill="none" stroke="#5E94FA" strokeWidth="3" strokeLinecap="round" d="M128.658,272.219c3.758,4.501,8.489,8.704,14.365,12.799c20.95,14.597,43.609,16.568,77.203,16.568c32.954,0,53.596-5.915,73.568-28.121c10.98-12.207,17.717-29.752,17.875-54.735c0.123-19.461-6.941-37.437-19.398-48.788c-18.105-16.498-30.604-15.402-50.527-13.925"/>
        <path fill="none" stroke="#5E94FA" strokeWidth="3" strokeLinecap="round" d="M197.016,150.503c-14.277-7.679-24.048-17.888-38.048-4.88c-9.355,8.692-17.49,16.315-24.083,24.599"/>
        <path fill="none" stroke="#5E94FA" strokeWidth="0.75" strokeLinecap="round" d="M197.016,150.503c6.52,3.507,13.979,6.486,23.211,6.486c8.192,0,15.222-0.505,21.517-0.972"/>
        <path fill="none" stroke="#FAC25E" strokeWidth="3" strokeLinecap="round" d="M241.744,156.018c-7.639-18.001-12.316-37.515-23.324-37.29c-12.148,0.248-17.828,15.357-21.404,31.776"/>
        <path fill="none" stroke="#FAC25E" strokeWidth="0.75" strokeLinecap="round" d="M197.016,150.503c-2.605,11.961-4.093,24.616-6.15,32.727c-4.5,17.738-34.081,55.104-27.507,83.282c6.574,28.178,39.567,22.493,55.061,19.884c23.177-3.902,44.873-4.796,55.696-20.056c6.625-9.34,11.468-16.683,8.92-36.498c-2.548-19.815-12.623-35.054-29.369-53.47c-4.963-5.458-8.706-12.772-11.923-20.354"/>
        <path fill="none" stroke="#FAC25E" strokeWidth="5" strokeLinecap="round" d="M213.928,78.095c9.804,0.754,10.961-9.91,11.493-15.527c0.567-5.987-3.363-11.493-11.493-11.493c-8.13,0-10.686,4.977-10.686,13.106C203.241,72.311,206.046,77.489,213.928,78.095z"/>
        <g onMouseOver={this._handleMouseOver.bind(this, 0)}>
          <circle fill="#FF5F85" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" cx="318.833" cy="322.195" r="12.838"/>
          <g>
            <path fill="#FFFFFF" d="M320.077,317.628c0,0.75-0.51,1.29-1.245,1.29c-0.734,0-1.245-0.54-1.245-1.29s0.511-1.29,1.245-1.29C319.567,316.338,320.077,316.878,320.077,317.628z M317.678,327.993v-8.07h2.31v8.07H317.678z"/>
          </g>
        </g>
        <g onMouseOver={this._handleMouseOver.bind(this, 1)}>
          <circle fill="#FAC25E" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" cx="205.833" cy="125.195" r="12.838"/>
          <g>
            <path fill="#FFFFFF" d="M207.077,120.576c0,0.75-0.51,1.29-1.245,1.29c-0.734,0-1.245-0.54-1.245-1.29s0.511-1.29,1.245-1.29C206.567,119.286,207.077,119.826,207.077,120.576z M204.678,130.94v-8.07h2.31v8.07H204.678z"/>
          </g>
        </g>
        <g onMouseOver={this._handleMouseOver.bind(this, 2)}>
          <circle fill="#5E94FA" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" cx="221.833" cy="156.195" r="12.838"/>
          <g>
            <path fill="#FFFFFF" d="M223.077,151.209c0,0.75-0.51,1.29-1.245,1.29c-0.734,0-1.245-0.54-1.245-1.29s0.511-1.29,1.245-1.29C222.567,149.919,223.077,150.459,223.077,151.209z M220.678,161.574v-8.07h2.31v8.07H220.678z"/>
          </g>
        </g>
        </svg>
      </div>
    )
  },

  _handleMouseOver: function(index, theEvent) {
    console.log(theEvent.clientX, theEvent.pageX);
  }
});

module.exports = legend;