# Private Blockchain Notary Service

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

This is a simple Express.js application where you can interact with a simple REST API over get and post request methods to get a block from your Blockchain by its Height or add one new block by informing its body content. The last feature added to the project was the Mempool component which validates the wallet address before submitting anything into the chain

The Project Features:

Blockchain dataset that allow you to store a Star
- The application persists the data (using LevelDB).
- The application allows users to identify the Star data with the owner.

Mempool component
- The mempool component stores temporal validation requests for 5 minutes (300 seconds).
- The mempool component stores temporal valid requests for 30 minutes (1800 seconds).
- The mempool component manages the validation time window.

REST API that allows users to interact with the application.
- The API allows users to submit a validation request.
- The API allows users to validate the request.
- The API encodes and decodes the star data.
- The API submits the Star data.
- The API looks up of Stars by hash, wallet address, and heigh

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

First Step: 
Blockchain ID validation routine:
- Web API POST endpoint to validate request with JSON response:

    Use the URL for the endpoint: http://localhost:8000/requestValidation
    The request should contain:
    ```
    { "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }
    ```
    This address should be a valid and active Bitcoin wallet address.
    The response should contain: walletAddress, requestTimeStamp, message and validationWindow.

- Web API POST endpoint validates message signature with JSON response:

    Use the URL for the endpoint:
    http://localhost:8000/message-signature/validate
    The request should contain:
    ```
    {
    "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
    }
    ```
    That address should be the same one passed over the first request. To get the signature value, you must to sign the message returned from the previously request by using the Electrum Bitcoin Wallet. To do that got to -> Tools -> Sign/verify message.

    That request returns an object with a validation window which expires in 5 minutes. 
    Upon validation, the user is granted access to register a single star.

Second Step:
Star registration Endpoint:
- Web API POST endpoint with JSON response that submits the Star information to be saved in the Blockchain:

    Use the Url for the endpoint: http://localhost:8000/block
    The request should contain:
    ```
    {
      "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
      "star": {
                  "dec": "68° 52' 56.9",
                  "ra": "16h 29m 1.0s",
                  "story": "Found star using https://www.google.com/sky/"
              }
    }
    ```
    The Star object and properties are stored within the body of the block of your Blockchain Dataset.
    If the Star has been successfully added to the blockchain the the response will look like:
    ```
    {
      "hash": "8098c1d7f44f4513ba1e7e8ba9965e013520e3652e2db5a7d88e51d7b99c3cc8",
      "height": 1,
      "body": {
          "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
          "star": {
              "ra": "16h 29m 1.0s",
              "dec": "68° 52' 56.9",
              "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
          }
      },
      "time": "1544455399",
      "previousBlockHash": "639f8e4c4519759f489fc7da607054f50b212b7d8171e7717df244da2f7f2394"
    }
    ```

Additional features:
Star Lookup:
- Get Star block by hash with JSON response:
  Use the URL: http://localhost:8000/stars/hash:[HASH]

  The response includes entire star block contents along with the addition of star story decoded to ASCII.

Get Star block by wallet address (blockchain identity) with JSON response:
- Use the URL: http://localhost:8000/stars/address:[ADDRESS]
  The response includes entire star block contents along with the addition of star story decoded to ASCII.
  This endpoint response contained a list of Stars because of one wallet address can be used to register multiple Stars.

Get Block:
- Get star block by star block height with JSON response:
  Use the URL: http://localhost:8000/block/[HEIGHT]

  The response includes entire star block contents along with the addition of star story decoded to ASCII.