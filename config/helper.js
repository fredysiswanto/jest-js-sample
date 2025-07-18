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

// Enhanced logging with different levels
function log(level, message, data = null) {
  const logEntry = {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (level === 'debug') {
    console.log(`[DEBUG] ${message}`, data || '');
  } else if (level === 'info') {
    console.log(`[INFO] ${message}`, data || '');
  } else if (level === 'error') {
    console.error(`[ERROR] ${message}`, data || '');
  }

  fs.appendFileSync(LOG_FILE_PATH, JSON.stringify(logEntry) + '\n');
}

// Function to merge headers and handle debugging/logger before calling API
function prepareRequest(options = {}) {
  const {
    reqHeader = {},
    debug = false,
    logger = false,
    method,
    url,
    reqBody,
  } = options;

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
function handleResponse(response, options = {}) {
  const { debug = false, logger = false, method, url } = options;

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

// Comprehensive API request handler - combines prepare and handle
function processApiRequest(requestOptions = {}) {
  const {
    reqHeader = {},
    reqBody = {},
    method = 'GET',
    url = '',
    debug = false,
    logger = false,
    params = '',
  } = requestOptions;

  // Prepare request
  const headers = prepareRequest({
    reqHeader,
    debug,
    logger,
    method,
    url: url + params,
    reqBody,
  });

  // Return a function that processes the response
  return (response) =>
    handleResponse(response, {
      debug,
      logger,
      method,
      url: url + params,
    });
}

// Utility function to create standardized API options
function createApiOptions(baseOptions = {}) {
  return (overrides = {}) => ({
    debug: false,
    logger: false,
    reqHeader: {},
    reqBody: {},
    params: '',
    ...baseOptions,
    ...overrides,
  });
}

module.exports = {
  prepareRequest,
  handleResponse,
  processApiRequest,
  createApiOptions,
  log,
  writeLog,
};
