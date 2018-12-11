/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/
const level = require('level');
const hex2ascii = require('hex2ascii');

class LevelSandbox {

  constructor() {
    this.db = level('./chaindata');
  }

  // Add data to levelDB with value
  addDataToLevelDB(value) {
    let self = this;
    let i = 0;

    return new Promise(function(resolve, reject) {
      self.db.createReadStream().on('data', function(data) {
        i++;
      }).on('error', function(err) {
        return reject(err);
      }).on('close', function() {
        self.db.put(i, value, function (err) {
          if (err) return reject(err);
          return resolve(value);
        });
      });
    });
  }

  // Add data to levelDB with value
  getBlocksCount() {
    let self = this;
    let count = 0;

    return new Promise(function(resolve, reject) {
      self.db.createReadStream(count)
      .on('data', function (data) {
        count++;
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        return reject(err);
      })
      .on('close', function () {
        return resolve(count);
      });
    });
  }

  //3) Fetch by key
  getLevelDBData(key) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.get(key, function (err, value) {
        if (err) return reject(err);
        return resolve(value);
      })
    });
  }

  // Get block by hash
  getBlockByHeight(height) {
    let self = this;
    let block = null;
    return new Promise(function(resolve, reject){
        self.db.createReadStream()
        .on('data', function (data) {
            let blockdata = JSON.parse(data.value);
            if(blockdata.height == height) {
              block = blockdata;
              block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            }
        })
        .on('error', function (err) {
            reject(err)
        })
        .on('close', function () {
            resolve(block);
        });
    });
  }

  // Get block by hash
  getBlockByHash(hash) {
    let self = this;
    let block = null;
    return new Promise(function(resolve, reject){
        self.db.createReadStream()
        .on('data', function (data) {
            let blockdata = JSON.parse(data.value);
            if(blockdata.hash == hash) {
              console.log(blockdata);
              block = blockdata;
              block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            }
        })
        .on('error', function (err) {
            reject(err)
        })
        .on('close', function () {
            resolve(block);
        });
    });
  }

  // Get block by hash
  getBlockByWalletAddress(address) {
    let self = this;
    let blocks = [];
    return new Promise(function(resolve, reject){
        self.db.createReadStream()
        .on('data', function (data) {
            let blockdata = JSON.parse(data.value);
            console.log(blockdata);
            if(blockdata.body.address == address) {
              console.log(blockdata);
              blockdata.body.star.storyDecoded = hex2ascii(blockdata.body.star.story);
              blocks.push(blockdata);
            }
        })
        .on('error', function (err) {
            reject(err)
        })
        .on('close', function () {
            resolve(blocks);
        });
    });
  }
}

// Export the class
module.exports.LevelSandbox = LevelSandbox;