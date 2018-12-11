//Importing Express.js module
const express = require("express");
//Importing BodyParser.js module
const bodyParser = require("body-parser");

const MempoolClass = require('./Mempool.js');
const BlockchainClass = require('./Blockchain');

/**
 * Class Definition for the REST API
 */
class BlockAPI {
  /**
   * Constructor that allows initialize the class 
   */
  constructor() {
    this.app = express();
    global.mempool = new MempoolClass.Mempool();
    global.blockchain = new BlockchainClass.Blockchain();
    this.initExpress();
    this.initExpressMiddleWare();
    this.initControllers();
    this.start();
	}

  /**
   * Initilization of the Express framework
   */
	initExpress() {
		this.app.set("port", 8000);
	}

  /**
   * Initialization of the middleware modules
   */
	initExpressMiddleWare() {
		this.app.use(bodyParser.urlencoded({extended:true}));
		this.app.use(bodyParser.json());
	}

  /**
   * Initilization of all the controllers
   */
	initControllers() {
    require("./BlockController.js")(this.app);
    require("./MempoolController.js")(this.app);
	}

  /**
   * Starting the REST Api application
   */
	start() {
		let self = this;
		this.app.listen(this.app.get("port"), () => {
			console.log(`Server Listening for port: ${self.app.get("port")}`);
		});
	}
}

new BlockAPI();