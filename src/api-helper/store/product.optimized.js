// Optimized product API helper using new flexible parameter pattern
// Generated with improved CLI - shows new usage patterns

const request = require('supertest');
const { BASE_URL } = require('@config/config');
const { processApiRequest, createApiOptions } = require('@config/helper');

const url = '/products';

// Create base options factory for product API
const productApiOptions = createApiOptions({
  url,
  debug: false,
  logger: false,
});

// GET products - much cleaner parameter handling
async function products(options = {}) {
  const config = productApiOptions(options);
  const responseHandler = processApiRequest({ ...config, method: 'GET' });

  const response = await request(BASE_URL)
    .get(`${url}${config.params}`)
    .set(config.reqHeader);

  return responseHandler(response);
}

// POST - Add product
async function addProduct(options = {}) {
  const config = productApiOptions(options);
  const responseHandler = processApiRequest({ ...config, method: 'POST' });

  const response = await request(BASE_URL)
    .post(url)
    .set(config.reqHeader)
    .send(config.reqBody);

  return responseHandler(response);
}

// PUT - Update product
async function updateProduct(options = {}) {
  const config = productApiOptions(options);
  const responseHandler = processApiRequest({ ...config, method: 'PUT' });

  const response = await request(BASE_URL)
    .put(`${url}${config.params}`)
    .set(config.reqHeader)
    .send(config.reqBody);

  return responseHandler(response);
}

// DELETE - Delete product
async function deleteProduct(options = {}) {
  const config = productApiOptions(options);
  const responseHandler = processApiRequest({ ...config, method: 'DELETE' });

  const response = await request(BASE_URL)
    .delete(`${url}${config.params}`)
    .set(config.reqHeader)
    .send(config.reqBody);

  return responseHandler(response);
}

// Convenience function for common product operations
async function getProductById(id, options = {}) {
  return products({ ...options, params: `/${id}` });
}

async function getProductsByCategory(category, options = {}) {
  return products({ ...options, params: `/category/${category}` });
}

module.exports = {
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByCategory,
};
