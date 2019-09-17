const fs = require("fs");
const unmock = require("./node_modules/unmock");

class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    console.log("Custom reporter output:");
    fs.writeFileSync("results.json", JSON.stringify(results, null, 2));
    const snapshots = unmock.utils.snapshotter
      .getOrUpdateSnapshotter()
      .readSnapshots();
    fs.writeFileSync("snapshots.json", JSON.stringify(snapshots, null, 2));
  }
}

module.exports = MyCustomReporter;
