var React = require('react'),
    path = require('path');


var scripts = [],
    csss = [];

if(process.env.NODE_ENV === "production") {
  const config = require('../../webpack/prod.config');
  const stats = require('../../static/dist/stats.json');

  scripts.push(`${process.env.BASE_URL}${config.output.publicPath}${stats.main}`);
  csss.push(`${process.env.BASE_URL}${config.output.publicPath}${stats.css}`);
} else {
  const config = require('../../webpack/dev.config');
  scripts.push(`${config.output.publicPath}${config.output.filename}`);
}

var HtmlDocument = React.createClass({
  propTypes: {

  },

  render: function() {
    return (
        <html>
          <head>
            <title>Isoscope Two</title>
            <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.css" />
            { csss.map((href, k) => <link key={ k } rel="stylesheet" type="text/css" href={ href } />) }
          </head>
          <body>
            <div id="root" dangerouslySetInnerHTML={{ __html: this.props.markup }}/>
            { scripts.map((src, i) => <script src={ src } key={ i } />) }
            <script dangerouslySetInnerHTML={{__html: this.props.state}} />
          </body>
        </html>
      )
  }
});

module.exports = HtmlDocument;