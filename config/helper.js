const { HEADERS } = require('./config');
// Function to marge header and handel debugging before call api
function prepareRequest({ reqHeader = {}, debug = false }) {
  const headers = { ...HEADERS, ...reqHeader };
  if (debug) {
    console.log({ headers });
  }
  return headers;
}

// Function to handle debugging after receiving response from api
function handleResponse(response, debug) {
  if (debug) {
    console.log({ body: response.body, status: response.status });
  }
  return { body: response.body, status: response.status };
}

module.exports = { prepareRequest, handleResponse };
