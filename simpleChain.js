/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256');

const LevelSandboxClass = require('./levelSandbox.js');

const db = new LevelSandboxClass.LevelSandbox();

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    db.getBlocksCount().then((count) => {
      if(count < 1){
        this.addBlock(new Block("First block in the chain - Genesis block"));
      }
    });
  }

  // Add new block
  addBlock(newBlock){
    return new Promise((resolve, reject) => {
      this.getBlockHeight().then((height) => {
        if (height > 0) {
          this.getBlock(height - 1).then((previousBlock) => { 
            newBlock.height = height;
            // UTC timestamp
            newBlock.time = new Date().getTime().toString().slice(0,-3);
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.previousBlockHash = previousBlock.hash;
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            db.addDataToLevelDB(JSON.stringify(newBlock).toString()).then((block) => { 
              return resolve(block); 
            });
          }).catch((err) => { return reject(err) });
        } else {
          newBlock.height = 0;
          // UTC timestamp
          newBlock.time = new Date().getTime().toString().slice(0,-3);
          // Block hash with SHA256 using newBlock and converting to a string
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          db.addDataToLevelDB(JSON.stringify(newBlock).toString()).then((block) => { 
            return resolve(block); 
          });
        }
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  // Get block height (returns the count);
  getBlockHeight(){ //modify this function to getBlockHeight by blockHeight from the db and not from the array
    return new Promise((resolve, reject) => {
      db.getBlocksCount().then((count) => { 
        return resolve(count); 
      }).catch((err) => { 
        return reject(err);
      });
    });
  }

  // get block
  getBlock(blockHeight){ //modify this function to getBlock by blockHeight from the db and not from the array
    //return object as a single string
    return new Promise((resolve, reject) => {
      db.getLevelDBData(blockHeight).then((block) => {
        return resolve(JSON.parse(block));
      }).catch((err) => { 
        return reject(err);
      });
    });
  }

  validateBlock(blockHeight){

    return new Promise((resolve, reject) => {
      // get block object
      this.getBlock(blockHeight).then((block) => {
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash===validBlockHash) {
          return resolve(true);
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return resolve(false);
        }
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  //Validate blockchain
  validateChain(){
    let errorLog = [];
    return new Promise((resolve, reject) => {
      return this.getBlockHeight().then((height) => {
        for (var i = 0; i < height; i++) {
          // validate block
          this.validateBlock(i).then((result) => {
            if(!result) errorLog.push(i);
          }).catch(() => { 
            console.log('block:' + blockHeight + 'could not be validated');
          });
          //compare blocks hash link
          if(i < height -1){
            this.getBlock(i).then((block) => {
              let blockHash = block.hash
              this.getBlock(block.height + 1).then((nextBlock) => {
                let previousHash = nextBlock.previousBlockHash;
                if(blockHash!==previousHash){
                  errorLog.push(block.height);
                } 
              }).catch((err) => {
                return console.log(err);
              });
            }).catch(() => {
              return console.log(err);
            });
          }
        }
        if (errorLog.length>0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: '+errorLog);
          return resolve('Blockchain is Invalid');
        } else {
          return resolve('No errors detected. Blockchain is valid!');
        }
      }).catch((err) => { 
        return reject(err);
      });
    });
  }
}

let blockchain = new Blockchain();

(function theLoop (i) {
  setTimeout(function () {
      let blockTest = new Block("Test Block - " + (i + 1));
      blockchain.addBlock(blockTest).then((result) => {
          console.log(result);
          i++;
          if (i < 10) theLoop(i);
      });
  }, 10000);
})(0);

// blockchain.getBlockHeight().then((height) => { console.log(height) } );
// blockchain.getBlock(0).then((block) => { console.log(block) } );
// blockchain.getBlock(9).then((block) => { console.log(block) } );
// blockchain.validateBlock(0).then((isValid) => { console.log(isValid) } );
// blockchain.validateBlock(9).then((isValid) => { console.log(isValid) } );
// blockchain.validateChain().then((result) => { console.log(result) } );