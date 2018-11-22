/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');

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
            console.log('Block #' + i);
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
    // Add your code here
    // return new Promise(function(resolve, reject) {
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
}

// Export the class
module.exports.LevelSandbox = LevelSandbox;


/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

// const db = new LevelSandbox();

// (function theLoop (i) {
//   setTimeout(function () {
//     db.addDataToLevelDB('Testing data');
//     if (--i) theLoop(i);
//   }, 100);
// })(10);
