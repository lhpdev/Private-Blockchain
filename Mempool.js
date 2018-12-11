/* ===== Mempool Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/
const TimeoutRequestsWindowTime = 5*60*1000;
const TimeoutMessageValidateWindowTime = 30*60*1000;
const bitcoinMessage = require('bitcoinjs-message'); 

class Mempool {
	constructor(data) {
    this.mempool = [];
    this.timeoutRequests = [];
    this.mempoolValid = [];
    this.timeoutArray = [];
  }

  addARequestValidation(request) {
    this.mempool.push(request);
    this.timeoutRequests.push(request.walletAddress);
    setTimeout(() => { this.removeRequestValidation(request.walletAddress) }, TimeoutRequestsWindowTime );
  }

  removeRequestValidation(address) {
    let removedRequestValidation = this.getRequestValidation(address);
    this.timeoutRequests.push(removedRequestValidation);
    let mempoolupdated = this.mempool.filter((request) => {
      return request.walletAddress != address;
    });
    this.mempool = mempoolupdated.slice(0);
  }

  removeValidRequest(address) {
    let removedValidRequest = this.getValidRequest(address);
    this.timeoutArray.push(removedValidRequest);
    let updatedMempoolValid = this.mempoolValid.filter((request) => {
      return request.status.address != address;
    });
    this.mempoolValid = updatedMempoolValid;
  }

  checkRequestValidation(address){
    var found = this.mempool.some(function (requestObject) {
      return requestObject.walletAddress === address
    });
    return found;
  }

  checkValidRequest(address) {
    var found = this.mempoolValid.some(function (requestObject) {
      return requestObject.status.address === address
    });
    return found;
  }

  verifyAddressRequest(address) {
    let requestValidation = this.checkRequestValidation(address);
    let validRequest = this.checkValidRequest(address);
    if (requestValidation && validRequest ) { return true } else { return false }
  }

  getRequestValidation(address) {
    return this.mempool.filter( request => { return request.walletAddress === address })[0];
  }

  getValidRequest(address) {
    return this.mempoolValid.filter( request => { return request.status.address === address })[0];
  }

  validateRequestByWallet(message, walletAddress, signature){
    let isValid = bitcoinMessage.verify(message, walletAddress, signature);
    if (isValid) {
      let requestObject = this.getRequestValidation(walletAddress);
      let object = {
        registerStar: true,
        status: {
          address: requestObject.walletAddress,
          requestTimeStamp: requestObject.requestTimeStamp,
          message: message,
          validationWindow: requestObject.validationWindow,
          messageSignature: isValid
        }
      }
      this.mempoolValid.push(object);
      setTimeout(() => { this.removeValidRequest(walletAddress) }, TimeoutMessageValidateWindowTime );
    }
    return isValid;
  }
}

// Export the class
module.exports.Mempool = Mempool;