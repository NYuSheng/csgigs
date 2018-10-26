
exports.setup = function(mongoose){
    var dev_db_url = 'mongodb://test1:test123@ds031895.mlab.com:31895/projectgigstest';
    var mongoDB = process.env.MONGODB_URI || dev_db_url;
    mongoose.connect(mongoDB);
    mongoose.Promise = global.Promise;
}

exports.cleanUp = function(mongoose) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove({});
    }
    mongoose.disconnect();
}