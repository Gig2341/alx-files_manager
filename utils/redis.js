const { promisify } = require('util');
const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        // Handle errors and display them in the console
        this.client.on('error', (err) => {
            console.error(`Redis client error: ${err}`);
        });

        // Promisify Redis functions for async/await usage
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        try {
            const value = await this.getAsync(key);
            return value;
        } catch (error) {
            console.error(`Error getting value from Redis: ${error}`);
            return null;
        }
    }

    async set(key, value, duration) {
        try {
            await this.setAsync(key, value, 'EX', duration);
            return true;
        } catch (error) {
            console.error(`Error setting value in Redis: ${error}`);
            return false;
        }
    }

    async del(key) {
        try {
            await this.delAsync(key);
            return true;
        } catch (error) {
            console.error(`Error deleting value from Redis: ${error}`);
            return false;
        }
    }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
