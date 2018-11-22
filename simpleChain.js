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
          console.log(newBlock);
        });
      } else {
        newBlock.height = 0;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0,-3);
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        db.addDataToLevelDB(JSON.stringify(newBlock).toString()).then((block) => { console.log(block) });
        console.log(newBlock);
      }
    });
  }

  // Get block height (returns the count);
  getBlockHeight(){ //modify this function to getBlockHeight by blockHeight from the db and not from the array
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
      db.getLevelDBData(blockHeight).
      then((block) => {
        resolve(JSON.parse(block));
      }).catch((err) => { 
        console.log(err);
        reject(err);
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
          return resolve(blockHeight, true);
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return resolve(blockHeight, false);
        }
      }).catch(() => {
        reject('Error');
      });
    });
  }

  //Validate blockchain
  validateChain(){
    let errorLog = [];

    return new Promise((resolve, reject) => {
      this.getBlockHeight().then((height) => {
        console.log(height);
        for (var i = 0; i < height; i++) {
          // validate block
          this.validateBlock(i).then((blockHeight, result) => {
            if(!result) errorLog.push(blockHeight);
          }).catch(() => { 
            console.log('block:' + blockHeight + 'Error');
          });

          //compare blocks hash link
          if(i < height -1){

            this.getBlock(i).then((block) => {
              let blockHash = block.hash
              console.log('blockHash');
              console.log(blockHash);

              this.getBlock(block.height + 1).then((nextBlock) => {
                let previousHash = nextBlock.previousBlockHash;
                console.log('previousHash:');
                console.log(previousHash);

                if(blockHash!==previousHash){
                  errorLog.push(block.height);
                } 
                
              }).catch(() => {
                return console.log('block not found ERROR2');
              });
              // console.log(blockHash);
            }).catch(() => {
              return console.log('block not found ERROR');
            });
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
    });
  }
}

let blockchain = new Blockchain();

blockchain.validateChain().then((result) => { console.log(result) } );