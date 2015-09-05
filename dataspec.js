/**
  Datastructure returned by APIs and stored by ClustersStrore. An array of isolines clustered to FeatureCollections by startLocation.
*/

[
  {
    type: "FeatureCollection",
    properties: {
      startLocation: [lat, lng],
      weekday: 3,
      travelTime: 55,
      travelMode: "publicTransport"
    },
    features: [
      {
        type: "Feature",
        properties: {
          departureTime: 0
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [52.43, 13.53],
              [52.23, 13.52]
            ]
          ]
        }
      }
    ]
  },
  {
    type: "FeatureCollection",
    properties: {
      startLocation: [lat, lng],
      weekday: 3,
      travelTime: 55,
      travelMode: "car"
    },
    features: [
      {
        type: "Feature",
        properties: {
          departureTime: 0
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [52.43, 13.53],
              [52.23, 13.52]
            ]
          ]
        }
      }
    ]
  }
]


/**
  Datastructure needed for d3 timeline generation. This structure will be returned by the ClustersStore .get() function. 
  An nested array of  FeatureCollections, one for every mode.
*/

[
  [
    {
      type: "FeatureCollection",
      properties: {
        startLocation: [lat, lng],
        weekday: 3,
        travelTime: 55,
        travelMode: "car"
      },
      features: [
        {
          type: "Feature",
          properties: {
            departureTime: 0
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [52.43, 13.53],
                [52.23, 13.52]
              ]
            ]
          }
        },
        {
          type: "Feature",
          properties: {
            departureTime: 1
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [52.43, 13.53],
                [52.23, 13.52]
              ]
            ]
          }
        }
      ]
    },
    {
      type: "FeatureCollection",
      properties: {
        startLocation: [lat, lng],
        weekday: 3,
        travelTime: 55,
        travelMode: "publicTransport"
      },
      features: [
        {
          type: "Feature",
          properties: {
            departureTime: 0
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [52.43, 13.53],
                [52.23, 13.52]
              ]
            ]
          }
        },
        {
          type: "Feature",
          properties: {
            departureTime: 1
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [52.43, 13.53],
                [52.23, 13.52]
              ]
            ]
          }
        }
      ]
    }
  ]
]


/**
  Datastructure needed for d3 shapes generation. This structure will be generated on the fly by a component to pass it down to the overlay component.
*/

{
  type: "FeatureCollection",
  properties: {
    startLocation: [lat, lng],
    departureTime: 22,
    weekday: 3,
    travelTime: 55
  },
  features: [
    {
      type: "Feature",
      properties: {
        travelMode: "car"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [52.43, 13.53],
            [52.23, 13.52]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        travelMode: "publicTransport"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [52.43, 13.53],
            [52.23, 13.52]
          ]
        ]
      }
    }
  ]
}