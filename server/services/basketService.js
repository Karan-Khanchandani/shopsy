let client = null;

//  add
async function add(itemId, userId) {
  return new Promise((resolve, reject) => {
    client.hget(`basket:${userId}`, itemId, (err, obj) => {
      if (err) return reject(err);
      if (!obj) {
        return client.hset(`basket:${userId}`, itemId, 1, (hseterr, res) => {
          if (hseterr) return reject(hseterr);
          return resolve(res);
        });
      }

      return client.hincrby(`basket:${userId}`, itemId, 1, (incerr, res) => {
        if (incerr) return reject(incerr);
        return resolve(res);
      });
    });
  });
}
//  getAll
async function getAll(userId) {
  return new Promise((resolve, reject) => {
    client.hget(`basket:${userId}`, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}
//  removeItem
async function remove(itemId, userId) {
  return new Promise((resolve, reject) => {
    client.hdel(`basket:${userId}`, itemId, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

module.exports = (_client) => {
  if (!_client) {
    throw new Error('Missing Redis client object');
  }
  client = _client;

  return {
    add,
    getAll,
    remove,
  };
};
