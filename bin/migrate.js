var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.mysqlDs;
ds.automigrate('post', function(err) {
    if (err) throw err;
    ds.disconnect();
    console.log("Done");
});