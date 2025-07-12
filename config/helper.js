const fs = require('fs');
const path = require('path');

const { HEADERS } = require('./config');

const LOG_FILE_PATH = path.resolve(__dirname, '../logs/api-test-log.jsonl');

// Append log to file
function writeLog(data) {
  const logLine = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  });
  fs.appendFileSync(LOG_FILE_PATH, logLine + '\n');
}

// Function to merge headers and handle debugging/logger before calling API
function prepareRequest({
  reqHeader = {},
  debug = false,
  logger = false,
  method,
  url,
  reqBody,
}) {
  const headers = { ...HEADERS, ...reqHeader };
  if (debug) {
    console.log('[DEBUG] Request Headers:', headers);
  }
  if (logger) {
    writeLog({ type: 'request', method, url, headers, body: reqBody });
  }
  return headers;
}

// Function to handle debugging/logger after receiving response from API
function handleResponse(response, debug, logger, method, url) {
  if (debug) {
    console.log('[DEBUG] Response:', {
      status: response.status,
      body: response.body,
    });
  }
  if (logger) {
    writeLog({
      type: 'response',
      method,
      url,
      status: response.status,
      body: response.body,
    });
  }
  return { body: response.body, status: response.status };
}

module.exports = { prepareRequest, handleResponse };
