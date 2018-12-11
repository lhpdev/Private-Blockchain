// const BlockClass = require('./Block.js');
// const BlockchainClass = require('./Blockchain');

// const bitcoin = require('bitcoinjs-lib');
// const bitcoinMessage = require('bitcoinjs-message');


/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class StarsController {
  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app 
   */
  constructor(app) {
    this.app = app;
    // this.initializeBlockchain();
    // this.getBlockByIndex();
    // this.postNewBlock();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */
  // getStarBlockByHash() {
  //   this.app.get("/stars/hash:[:index]", (req, res) => {
  //     // let index = req.params.index;
  //     // let blockchain = new BlockchainClass.Blockchain();
  //     // blockchain.getBlock(index).then((block) => {
  //     //   res.status(200).send(block);
        
  //     // }).catch(() => {
  //     //   res.status(404).send({ error: { message: 'Block #' + index + ' not found' } });
  //     // });
  //   });
  // }

    /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */
//   getStarBlockByWalletAddress() {
//     this.app.get("/stars/hash:[:index]", (req, res) => {
//       // let index = req.params.index;
//       // let blockchain = new BlockchainClass.Blockchain();
//       // blockchain.getBlock(index).then((block) => {
//       //   res.status(200).send(block);
        
//       // }).catch(() => {
//       //   res.status(404).send({ error: { message: 'Block #' + index + ' not found' } });
//       // });
//     });
//   }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new StarsController(app);}