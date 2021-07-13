const mongoose = require("mongoose");

const redis = require('redis');
const util = require('util');
const client = redis.createClient();
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.useCaching = async function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || 'default');
    return this;
}

mongoose.Query.prototype.exec = async function(){
    console.log("using caching: ", this.useCache)
    if (!this.useCache) {
        const result = await exec.apply(this, arguments);
        console.log('MONGO: ', result);
        return result;
    }
    const redisKey = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));
    const cachedValue = await client.hget(this.hashKey, redisKey)
    if (cachedValue) {
        const parsed = JSON.parse(cachedValue);
        console.log('CACHED: ', parsed)
        return Array.isArray(parsed)
            ? parsed.map(post => new this.model(post))
            : new this.model(parsed);
    }
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, redisKey, JSON.stringify(result));
    console.log('MONGO: ', result);
    return result;

}

module.exports = {
    clearCachedUserId: function(id){
        client.del(JSON.stringify(id));
    }
};
