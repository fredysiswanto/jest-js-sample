// this file sample generate from cli
// node scripts/cli product --api

const request = require('supertest');
let { BASE_URL } = require('@config/config');
const { prepareRequest, handleResponse } = require('@config/helper');

const url = '/products';
// GET;
async function products({
  reqHeader = {},
  reqBody = {},
  params = '',
  debug = false,
  logger = false,
}) {
  const headers = prepareRequest({ reqHeader, debug, logger });
  const response = await request(BASE_URL).get(`${url}${params}`).set(headers);
  return handleResponse(response, debug, logger);
}

// POST
async function addProduct({
  reqHeader = {},
  reqBody = {},
  params = '',
  debug = false,
}) {
  const headers = prepareRequest({ reqHeader, debug });
  const response = await request(BASE_URL).post(url).set(headers).send(reqBody);
  return handleResponse(response, debug);
}

// PUT
async function updateProduct({
  reqHeader = {},
  reqBody = {},
  params = '',
  debug = false,
}) {
  const headers = prepareRequest({ reqHeader, debug });
  const response = await request(BASE_URL)
    .put(`${url}${params}`)
    .set(headers)
    .send(reqBody);
  return handleResponse(response, debug);
}

// DELETE
async function deleteProduct({
  reqHeader = {},
  reqBody = {},
  params = '',
  debug = false,
}) {
  const headers = prepareRequest({ reqHeader, debug });
  const response = await request(BASE_URL)
    .delete(`${url}${params}`)
    .set(headers)
    .send(reqBody);
  return handleResponse(response, debug);
}
module.exports = { products, addProduct, updateProduct, deleteProduct };
