# Blockchain Data and REST API

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

This is an application where you can interact with a simple REST API over get and post request methods to get a block from your Blockchain by its Height or add one new block by informing its body content.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to setup your project install project dependencies from package.json. At the directory folder on your terminal run the command: 
```
npm install

```

### Running your project

- User node command to start the application. At the directory folder on your terminal run the command: 
```
node app.js

```

## Testing

To test the application:
- For testing your requests after running the application, you can use POSTMAN or curl by following the instructions below:

To make a GET request, use the following route: '/block/{index}'
PS: {index} is the Height (number) of the block you want to get

To make a POST request, use the route '/block' and inform the body content over the body of your request. Ex:
```
{
  "body": "block body content"
}
```
- You should be able if a block was added to your blockchain if the request result is a block with the body from your request