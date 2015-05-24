# Webpack, React and Express Boilerplate

Barebones Boilerplate using the above mentioned technologies. Quite some stuff still has to be fixed...

To install run
```
npm install #some modules might be missing in package.json
```

To start development run
```
npm run dev
```
and visit http://localhost:3000

A development server serving and updating the transformed javascript and css runs on http://localhost:3001.


## Foler Structure
```
├── src
│   ├── assets/               # everything static like css, fonts and images
│   ├── components/           # jsx components
│   └── server/
│       ├── render.js         # middleware to intercept requests and render the complete html page
│       └── HtmlDocument.js   # Basic layout for the page, takes a markup param for the content
│   ├── App.js                # Root component for main content
│   ├── client.js             # Entrypoint for client side
│   ├── routes.js             # Routes, used by client as well as server side app
│   └── server.js             # Entrypoint for server side
├── webpack/                  # Webpack configuration as well as dev hot-load server
└── index.js                  # Entrypoint for running the server
```


## Todos
- Dynamic bundle.js loading
- Outsource css to head
- Flux integration
- State transfer
- Make ports configurable