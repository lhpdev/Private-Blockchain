/**
 * Controller Definition to encapsulate routes to work with stars
 */

class StarsController {

  /**
   * Constructor to create a new StarsController, you need to initialize here all your endpoints
   * @param {*} app 
   */

  constructor(app) {
    this.app = app;
    this.getStarBlockByHash();
    this.getBlockByWalletAddress();
  }

  /**
   * Implement a GET Endpoint to retrieve a star by hash, url: "/stars/hash:[HASH]"
   */

  getStarBlockByHash() {
    this.app.get("/stars/hash::index", (req, res) => {
      let hash = req.params.index;
      blockchain.getBlockByHash(hash).then((block) => {
        res.status(200).send(block);
      }).catch(() => {
        res.status(404).send({ error: { message: 'Block #' + index + ' not found' } });
      });
    });
  }

  /**
   * Implement a GET Endpoint to retrieve all stars by wallet address, url: "/stars/address:[ADDRESS]"
   */

  getBlockByWalletAddress() {
    this.app.get("/stars/address::index", (req, res) => {
      let address = req.params.index;
      blockchain.getBlockByWalletAddress(address).then((result) => {
        res.status(200).send(result);
      }).catch(() => {
        res.status(404).send({ error: { message: 'Block #' + index + ' not found' } });
      });
    });
  }
}

/**
 * Exporting the StarsController class
 * @param {*} app 
 */

module.exports = (app) => { return new StarsController(app);}