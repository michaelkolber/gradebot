"use strict";
/**
 * The web server that sits between the database and the client.
 *
 * The server is an Express server. It communicates via JSON, exposing a RESTful API. It is
 * reachable via the '/api' path.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dbConnection = require("./dbConnection"); // The connection lives here and is `require`ed whenever needed. Relies on Node's module caching.
const helpers_1 = require("./helpers");
const app = express();
const port = process.env.PORT || 1900;
// Make sure JSON is parsed properly
app.use(express.json());
// Set up routes
const apiRouter = express.Router(); // Tie everything to this router so that we can run everything through '/api'
app.use('/api', apiRouter);
const classesRouter = require("./routes/classes");
apiRouter.use('/classes', classesRouter);
const searchRouter = require("./routes/search");
apiRouter.use('/search', searchRouter);
// Catch-all. Also serves as an easy way to make sure the API is up.
app.all('/', (req, res) => {
    const message = helpers_1.createErrorMessage("All requests must go through '/api'.");
    res.status(403).json(message);
});
// Connect to the database before starting up the server
dbConnection.client.connect()
    .then(() => {
    console.log('Successfully connected to database.');
    // Start the server
    app.listen(port, () => console.log(`API server ready on port ${port}.`));
})
    .catch((err) => {
    console.error('Error connecting to the database:');
    console.error(err);
});
//# sourceMappingURL=server.js.map