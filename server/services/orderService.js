const Models = require('../models/sequelize');

let client = null;
let models = null;

async function inTransaction(work) {
  const t = await client.transaction();

  try {
    await work(t);
    return t.commit();
  } catch (error) {
    t.rollback();
    throw error;
  }
}

async function setStatus(orderId, status) {
  return models.Order.update({ status }, { where: { id: orderId } });
}
async function create(user, items, t) {
  const order = await models.Order.create({
    userId: user.id,
    email: user.email,
    status: 'Not Shipped',
  }, { transction: t });

  return Promise.all(items.map(async (item) => {
    const orderitem = await models.OrderItem.create({
      sku: item.sku,
      qty: item.quantity,
      price: item.price,
      name: item.name,
    });
    return order.addOrderItem(orderitem, { transaction: t });
  }));
}

async function getAll() {
  return models.Order.findAll({ where: {}, include: [models.OrderItem] });
}
module.exports = (_client) => {
  models = Models(_client);
  client = _client;

  return {
    create,
    inTransaction,
    getAll,
    setStatus,
  };
};
