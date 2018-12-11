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
      blockchain.getBlock(index).then((block) => {
        res.status(200).send(block);
      }).catch(() => {
        res.status(404).send({ error: { message: 'Block #' + index + ' not found' } });
      });
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
    this.app.post("/block", (req, res) => {
      if(((req.body.star).length > 1) || (req.body.constructor === Object && Object.keys(req.body).length === 0)){
        res.status(400).send({ error: { message: 'Please inform a addres and only one star' } });
      } else {
        let isValid = mempool.verifyAddressRequest(req.body.address);

        if(isValid){
          let body = {
            address: req.body.address,
            star: {
                    ra: req.body.star.ra,
                    dec: req.body.star.dec,
                    story: Buffer.from(req.body.star.story).toString('hex')
                  }
          };
          let block = new BlockClass.Block(body);

          blockchain.addBlock(block).then((block) => {
            res.status(201).send(block);
          });

        } else {
          res.status(400).send({ error: { message: 'Address is not valid' } });
        }
      }
    });
  }

  /**
   * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
   */
  initializeBlockchain() {
    console.log('Initializing Blockchain...');
    blockchain.getBlockHeight().then((height) => {
      if (height < 1) {
        (function theLoop (i) {
          setTimeout(function () {
            let blockTest = new BlockClass.Block("Test Block - " + (i + 1));
            blockchain.addBlock(blockTest).then(() => {
              i++;
              if (i < 10) theLoop(i);
            });
          }, 100);
        })(0);
      }
    });
    console.log('DONE');
    console.log('Ready to receive \'get\' and \'post\' requests on route \'/block\'');
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}