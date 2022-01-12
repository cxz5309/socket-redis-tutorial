const redis = require('redis');
const client = redis.createClient();

(async () => {

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    await client.hSet('hKey', 'field', 'value');
    const value = await client.hGet('hKey');
    const type = await client.type('hKey')
    console.log(type);
    console.log(value);
})();