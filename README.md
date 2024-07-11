# Team Simulation - Server

## Setting up

## API Spec

[TODO]: <Deploy and update the link below>
[Deployed API Spec](https://UPDATEME)

The API Spec is hosted by the server itself (i.e. this project), and the view/page is generated automatically by the SwaggerUI library.

To view it locally, you can just go to: [http://localhost:4000/api-docs](http://localhost:4000/api-docs).

Whenever you make any change to the API (e.g. adding a new route, changing the payload for an existing route, adding a new error), you must update the API Spec accordingly. To do this, you just need to update the `openapi.yaml` file -- guidance on the basic structure of the `openapi.yaml` file can be found [here](https://swagger.io/docs/specification/about/).

- **You should always verify these changes locally before committing your work.**
- If your server is already running when you changed the `openapi.yaml` file, you will need to stop and restart your server.
- Once verified, stage and commit the changes on the same branch where you changed the behaviour of the API.

## DATABASE ERD

[TODO]: <Update this with your ERD>
TODO
