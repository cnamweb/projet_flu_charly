// Get all products
module.exports = app => {
  const productsController = require('../controllers/productController');

  let router = require('express').Router();

  router.get('/', productsController.get);
  router.post('/', productsController.getFiltered);
  router.get('/categories', productsController.getAllCategories);

  app.use('/api/products', router);
};