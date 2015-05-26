var React = require('react');

var HtmlDocument = React.createClass({
  propTypes: {

  },

  render: function() {
    return (
        <html>
          <head>
            <title>React and Webpack Template</title>
            <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
          </head>
          <body>
            <div id="root" dangerouslySetInnerHTML={{ __html: this.props.markup }}/>
            <script src="http://localhost:3001/assets/bundle.js"/>
            <script dangerouslySetInnerHTML={{__html: this.props.state}} />
          </body>
        </html>
      )
  }
});

module.exports = HtmlDocument;