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
    this.getBlockHeight().then((height) => {
      if (height > 0) {
        return this.getBlock(height - 1).then((previousBlock) => { 
          newBlock.height = height;
          // UTC timestamp
          newBlock.time = new Date().getTime().toString().slice(0,-3);
          // Block hash with SHA256 using newBlock and converting to a string
          newBlock.previousBlockHash = previousBlock.hash;
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          db.addDataToLevelDB(JSON.stringify(newBlock).toString()).then((block) => { console.log(block) });
          return console.log(newBlock);
        });
      } else {
        newBlock.height = 0;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        db.addDataToLevelDB(JSON.stringify(newBlock).toString()).then((block) => { console.log(block) });
        return console.log(newBlock);
      }
    });
  }

  // Get block height (returns the count);
  getBlockHeight(){ //modify this function to getBlockHeight by blockHeight from the db and not from the array
    return new Promise(function(resolve, reject) {
      db.getBlocksCount().then((height) => { 
        resolve(height); 
      }).catch(() => { 
        reject('Error');
      });
    })

  }

  // get block
  getBlock(blockHeight){ //modify this function to getBlock by blockHeight from the db and not from the array
    //return object as a single string
    return new Promise(function(resolve, reject) {
      db.getLevelDBData(blockHeight).
      then((block) => {
        resolve(JSON.parse(block));
      }).catch(() => { 
        reject('Error');
      });
    });
  }

  validateBlock(blockHeight){

    return new Promise(function(resolve, reject) {
      // get block object
      this.getBlock(blockHeight).then((block) => {
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        console.log('Block #:' + block.height);
        // Compare
        if (blockHash===validBlockHash) {
          console.log('is valid');
          return resolve(true);
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return resolve(false);
        }
      }).catch(() => {
        reject('Error');
      });
    }.bind(this));
  }

  //Validate blockchain
  validateChain(){
    let errorLog = [];

    return new Promise(function(resolve, reject) {
      this.getBlockHeight().then((height) => {
        console.log(height);
        for (var i = 0; i < height; i++) {
          // validate block
          this.validateBlock(i).then((result) => {
            console.log('validading block...');
            console.log('result: ' + result);
            if(!result) errorLog.push(i);
          }).catch(() => { 
            console.log('block:' + i + 'Error');
          });

          //compare blocks hash link
          if(i < height -1){
            this.getBlock(i).then((block) => {
              let blockHash = block.hash
              console.log(blockHash);

              this.getBlock(i+1).then((nextBlock) => {
                let previousHash = nextBlock.previousHash;
                if(blockHash!==previousHash) errorLog.push(i);
              }).catch(() => {
                return console.log('block not found ERROR2');
              });
              // console.log(blockHash);
            }).catch(() => {
              return console.log('block not found ERROR');
            }).bind(this);
          }
        }

        if (errorLog.length>0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: '+errorLog);
          return resolve('Invalid');
        } else {
          return resolve('No errors detected');
        }
      }).catch(() => { 
        reject('Error')
      });
    }.bind(this));
  }
}
