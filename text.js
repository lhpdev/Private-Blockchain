const LevelSandboxClass = require('./levelSandbox.js');

const db = new LevelSandboxClass.LevelSandbox();

// (function theLoop (i) {
//   setTimeout(function () {
//     // console.log(i);
//     db.addDataToLevelDB('Testing data').then((resolve) => {
//       console.log('Block Added:' + resolve);
//     });
//     if (--i) theLoop(i);
//   }, 100);
// })(10);

// db.getData();
db.getBlocksHeight().then((resolve) => {
  console.log('Count:' + resolve);
});

// db.addDataToLevelDB('Different Data').then((resolve) => {
//   console.log('Block data: ' + resolve);
// });

db.getBlock(3).then((block) => {
  console.log('Block 3:' + block);
});
