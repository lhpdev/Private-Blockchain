const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockchainClass = require('./Blockchain');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {
  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app 
   */
  constructor(app) {
    this.app = app;
    // this.myBlockChain = new BlockchainClass.myBlockChain();
    // this.blocks = [];
    this.initializeBlockchain();
    this.getBlockByIndex();
    this.postNewBlock();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */
  getBlockByIndex() {
    this.app.get("/block/:index", (req, res) => {
      let index = req.params.index;
      let blockchain = new BlockchainClass.Blockchain();
      blockchain.getBlock(index).then((block) => {
        res.send(JSON.stringify(block).toString());
      });
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
    this.app.post("/block", (req, res) => {
      if(req.body ===''){
        res.send('No Block found to be added');
      } else {
        let block = req.body
        let blockchain = new BlockchainClass.Blockchain();
        blockchain.addBlock(block).then((block) => {
          res.send('The following block has been added: '+ JSON.stringify(block).toString());
        });
      }
    });
  }

  /**
   * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
   */
  initializeBlockchain() {
    let blockchain = new BlockchainClass.Blockchain();

    blockchain.getBlockHeight().then((height) => {
      if (height < 1) {
        (function theLoop (i) {
          setTimeout(function () {
            let blockTest = new BlockClass.Block("Test Block - " + (i + 1));
            blockchain.addBlock(blockTest).then((result) => {
              console.log(result);
              i++;
              if (i < 10) theLoop(i);
            });
          }, 100);
        })(0);
      } else {
        console.log('Initializing Blockchain...');
      }
    });
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}