
## Cupcake Store 

This project is built upon the [Nest](https://github.com/nestjs/nest) NodeJS framework with [ScyllaDB](https://www.scylladb.com/) as a persitent storage.

## Installation
This application is supposed to run inside the Docker container. Please make sure you have Docker installed on your machine.

## Running the integration tests
```bash
$ scripts/up-test
```
Tests are ran against the real ScyllaDB database inside a separate Docket container. After tests are passed please exit the docker container (ctrl+c).

You can learn how to use this API by looking into `test/app.e2e-spec.ts`

## Running the server
```
$ scripts/up
```
> **_NOTE:_**  After running the `scripts/up` or `scripts/up-test` you may see **'ScyllaDB is unavailable - retrying in 5 seconds'** comming up several times. The application is waiting for the Scylla container to spin up Scylla cluster and it may take up to 1 minute. 
If this process takes more then 2 minutes you may want to try stopping the container (ctrl + c), run the `scripts/down` and than run `scripts/up-test` or `scripts/up` again. Alternatively you can delete all the containers and try again.

## Using Rest client
When the service is up and running you can access it by `https://localhost:3000/v2/cupcake`. This endpoint returns the list of all cupcakes and it should be empty on the first run ([]).

> **_NOTE:_**  The application is currently serving only **HTTPS** requests.

## Using Swagger UI
The application provides a convinient way to test its API by leveraging auto-generated Swagger UI at https://localhost:3000/api#/

## Updated OpenAPI spec
The original OpenAPI schema has been slightly updated to follow the best practises and now looks like this:

```yml
swagger: "2.0"
info:
  description: "A server for a Cupcake store"
  version: "1.0.0"
  title: "Cupcake Store"
  termsOfService: "https://8flow.ai/"
  contact:
    email: "apiteam@cupcakestore.com"
  license:
    name: "Apache 2.0"
    url: "http://www.apache.org/licenses/LICENSE-2.0.html"
basePath: "/v2"
tags:
- name: "cupcake"
  description: "Everything about your Cupcakes"
  externalDocs:
    description: "Find out more"
    url: "http://swagger.io"
schemes:
- "https"
servers:
  - url: https://localhost:3000
paths:
  /cupcake:
    post:
      tags:
      - "cupcake"
      summary: "Add a new cupcake to the store"
      description: ""
      operationId: "addCupcake"
      consumes:
      - "application/json"
      produces:
      - "application/json"
      parameters:
      - in: "body"
        name: "body"
        description: "Cupcake object that needs to be added to the store"
        required: true
        schema:
          $ref: "#/definitions/Cupcake"
      responses:
        400:
          description: "Invalid input"
    get:
      tags:
      - "cupcake"
      summary: "List all cupcakes"
      description: "Returns a list of available cupcakes"
      operationId: "listCupcakes"
      produces:
      - "application/json"
      parameters: []
      responses:
        200:
          description: "successful operation"
          schema:
            type: "array"
            items:
              $ref: "#/definitions/Cupcake"
  /cupcake/{cupcakeId}:
    get:
      tags:
      - "cupcake"
      summary: "Find cupcake by ID"
      description: "Returns a single cupcake"
      operationId: "getCupcakeById"
      produces:
      - "application/json"
      parameters:
      - name: "cupcakeId"
        in: "path"
        description: "ID of cupcake to return"
        required: true
        type: "string"
        format: "uuid"
      responses:
        200:
          description: "successful operation"
          schema:
            $ref: "#/definitions/Cupcake"
        400:
          description: "Invalid ID supplied"
        404:
          description: "Cupcake not found"
    put:
      tags:
      - "cupcake"
      summary: "Update an existing cupcake"
      description: ""
      operationId: "updateCupcake"
      consumes:
      - "application/json"
      produces:
      - "application/json"
      parameters:
      - name: "cupcakeId"
        in: "path"
        description: "ID of cupcake that needs to be updated"
        required: true
        type: "string"
        format: "uuid"
      - in: "body"
        name: "body"
        description: "Updated cupcake object"
        required: true
        schema:
          $ref: "#/definitions/Cupcake"
      responses:
        200:
          description: "successful operation"
          schema:
            $ref: "#/definitions/Cupcake"
        400:
          description: "Invalid ID supplied"
        404:
          description: "Cupcake not found"
        405:
          description: "Validation exception"
    delete:
      tags:
      - "cupcake"
      summary: "Deletes a cupcake"
      description: ""
      operationId: "deleteCupcake"
      produces:
      - "application/json"
      parameters:
      - name: "cupcakeId"
        in: "path"
        description: "Cupcake id to delete"
        required: true
        type: "string"
        format: "uuid"
      responses:
        204:
          description: "Cupcake deleted"
        400:
          description: "Invalid ID supplied"
        404:
          description: "Cupcake not found"
definitions:
  Cupcake:
    type: "object"
    required:
    - "name"
    - "price"
    properties:
      id:
        type: "string"
        format: "uuid"
      name:
        type: "string"
      description:
        type: "string"
      price:
        type: "number"
      ingredients:
        type: "array"
        items:
          type: "string"
externalDocs:
  description: "Find out more about Swagger"
  url: "http://swagger.io"

```