// const BlockClass = require('./Block.js');
// const BlockchainClass = require('./Blockchain');

// const bitcoin = require('bitcoinjs-lib');

const TimeoutRequestsWindowTime = 5*60*1000;
const TimeoutMessageValidateWindowTime = 30*60*1000;

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class MempoolController {
  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app
   */
  constructor(app) {
    this.app = app;
    this.submitValidationRequest();
    this.validateMessage();
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  submitValidationRequest() {
    this.app.post("/requestValidation", (req, res) => {
      if((req.body.address == "") || (req.body.constructor === Object && Object.keys(req.body).length === 0)) {
        res.status(400).send({ error: { message: 'It is not possible to validate your request without an address' } });
      } else {
        if (mempool.checkRequestValidation(req.body.address)) {
          let requestObject = mempool.getRequestValidation(req.body.address);
          let timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestObject.requestTimeStamp.slice(0,-3);
          let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
          requestObject.validationWindow = timeLeft;
          res.status(201).send(requestObject);
        } else {
          let timestamp = new Date().getTime();
          const requestObject = {
            walletAddress: req.body.address,
            requestTimeStamp: timestamp.toString(),
            message: [req.body.address] + ':' + [timestamp] + ':starRegistry',
            validationWindow: TimeoutRequestsWindowTime/1000
          }
          mempool.addARequestValidation(requestObject);
          res.status(201).send(requestObject);
        }
      }
    });
  }
  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  validateMessage() {
    this.app.post("/message-signature/validate", (req, res) => {
      if(((req.body.address == "") || (req.body.signature == "")) || (req.body.constructor === Object && Object.keys(req.body).length === 0)){
        res.status(400).send({ error: { message: 'It is not possible to validate a signature without an address and signature' } });
      } else {
        if (mempool.checkRequestValidation(req.body.address)) {
          if (mempool.checkValidRequest(req.body.address)) {
            let object = mempool.getValidRequest(req.body.address);
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - object.status.requestTimeStamp.slice(0,-3);
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
            object.status.validationWindow = timeLeft;
            res.status(201).send(object);
          } else {
            let requestValidation = mempool.getRequestValidation(req.body.address);
            let address = req.body.address
            let signature = req.body.signature;
            let message = requestValidation.message;
            let isValid = mempool.validateRequestByWallet(message, address, signature);
            if (isValid) {
              let object = mempool.getValidRequest(address);
              res.status(201).send(object);
            } else {
              res.status(404).send({ error: { message: 'The wallet address is not valid' } });
            }
          }
        } else {
          res.status(404).send({ error: { message: 'The wallet address is not valid' } });
        }
      }
    });
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new MempoolController(app);}