//timeout for requestValidation
const TimeoutRequestsWindowTime = 5*60*1000;

/**
 * Controller Definition to encapsulate routes to work with requests validation
 */

class MempoolController {

  /**
   * Constructor to create a new MempoolController, you need to initialize here all your endpoints
   * @param {*} app
   */

  constructor(app) {
    this.app = app;
    this.submitValidationRequest();
    this.validateMessage();
  }

  /**
   * Implement a POST Endpoint to add a request validation, url: "/requestValitation/"
   */

  submitValidationRequest() {
    this.app.post("/requestValidation", (req, res) => {
      //check if all parameters were provided correctly
      if((req.body.address == "") || (req.body.constructor === Object && Object.keys(req.body).length === 0)) {
        res.status(400).send({ error: { message: 'It is not possible to validate your request without an address' } });
      } else {
        //checks if RequestionValidation is already at the Mempool
        if (mempool.checkRequestValidation(req.body.address)) {
          //if the request validation is already at the Mempool returns updated request validation
          let requestObject = mempool.getRequestValidation(req.body.address);
          let timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestObject.requestTimeStamp.slice(0,-3);
          let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
          requestObject.validationWindow = timeLeft;
          res.status(201).send(requestObject);
        } else {
          //if no request validation was found then add it to the Mempool
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
   * Implement a POST Endpoint to validate message-signature, url: "/message-signature/validate"
   */
  validateMessage() {
    this.app.post("/message-signature/validate", (req, res) => {
      if(((req.body.address == "") || (req.body.signature == "")) || (req.body.constructor === Object && Object.keys(req.body).length === 0)){
        res.status(400).send({ error: { message: 'It is not possible to validate message-signature without the wallet address and the message-signature' } });
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