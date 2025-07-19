#!/usr/bin/env node

/**
 * FoodTrip API Test Case Generator
 * Generates test case templates from Postman collection
 */

const fs = require('fs');
const path = require('path');

class TestCaseGenerator {
  constructor(postmanCollectionPath, outputDir) {
    this.postmanCollectionPath = postmanCollectionPath;
    this.outputDir = outputDir;
    this.baseUrl = 'http://localhost:3600/api/v1';
  }

  /**
   * Load Postman collection from file
   */
  loadPostmanCollection() {
    try {
      const data = fs.readFileSync(this.postmanCollectionPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading Postman collection:', error.message);
      process.exit(1);
    }
  }

  /**
   * Extract endpoint information from Postman request
   */
  extractEndpointInfo(request) {
    const method = request.method;
    const url = request.url;
    let endpoint = '';
    let hasParams = false;

    if (typeof url === 'string') {
      endpoint = url.replace('{{base_url}}', '');
    } else if (url && url.path) {
      endpoint = '/' + url.path.join('/');
      hasParams = url.variable && url.variable.length > 0;
    }

    const contentType = this.getContentType(request);
    const hasAuth = this.hasAuthentication(request);

    return {
      method,
      endpoint,
      contentType,
      hasAuth,
      hasParams,
      requestBody: this.getRequestBody(request),
      pathVariables: this.getPathVariables(url),
    };
  }

  /**
   * Determine content type from request
   */
  getContentType(request) {
    if (request.body) {
      if (request.body.mode === 'formdata') {
        return 'multipart/form-data';
      } else if (request.body.mode === 'raw') {
        const options = request.body.options;
        if (options && options.raw && options.raw.language === 'json') {
          return 'application/json';
        }
      }
    }
    return 'application/json';
  }

  /**
   * Check if request requires authentication
   */
  hasAuthentication(request) {
    // Check if it's under authenticated sections like 'Resto Admin', 'Admin'
    return true; // Default to requiring auth, can be customized per endpoint
  }

  /**
   * Extract request body from Postman request
   */
  getRequestBody(request) {
    if (!request.body) return null;

    if (request.body.mode === 'raw') {
      try {
        return JSON.parse(request.body.raw.replace(/\r\n/g, ''));
      } catch (e) {
        return request.body.raw;
      }
    } else if (request.body.mode === 'formdata') {
      const formData = {};
      request.body.formdata.forEach((item) => {
        if (item.type === 'text') {
          formData[item.key] = item.value;
        } else if (item.type === 'file') {
          formData[item.key] = '[FILE]';
        }
      });
      return formData;
    }
    return null;
  }

  /**
   * Extract path variables from URL
   */
  getPathVariables(url) {
    if (!url || !url.variable) return [];
    return url.variable.map((v) => ({
      key: v.key,
      value: v.value,
    }));
  }

  /**
   * Generate standard test scenarios based on HTTP method
   */
  generateTestScenarios(endpointInfo) {
    const { method, endpoint, contentType, hasAuth } = endpointInfo;
    const scenarios = [];

    // Success case
    scenarios.push({
      description: `Successfully ${this.getOperationName(method, endpoint)}`,
      method,
      requestData: this.generateValidRequestData(endpointInfo),
      expectedResponse: this.generateSuccessResponse(method),
      statusCode: this.getSuccessStatusCode(method),
    });

    // Method-specific scenarios
    if (method === 'POST' || method === 'PUT') {
      scenarios.push(...this.generateCRUDScenarios(endpointInfo));
    } else if (method === 'GET') {
      scenarios.push(...this.generateGETScenarios(endpointInfo));
    } else if (method === 'DELETE') {
      scenarios.push(...this.generateDELETEScenarios(endpointInfo));
    }

    // Common scenarios for all authenticated endpoints
    if (hasAuth) {
      scenarios.push(...this.generateAuthScenarios(endpointInfo));
    }

    return scenarios;
  }

  /**
   * Generate CRUD operation test scenarios
   */
  generateCRUDScenarios(endpointInfo) {
    return [
      {
        description: 'Request with missing required fields',
        method: endpointInfo.method,
        requestData: '{{MISSING_REQUIRED_FIELDS}}',
        expectedResponse: '{ "error": "Required field is missing" }',
        statusCode: '400 Bad Request',
      },
      {
        description: 'Request with invalid data format',
        method: endpointInfo.method,
        requestData: '{{INVALID_DATA_FORMAT}}',
        expectedResponse: '{ "error": "Invalid data format" }',
        statusCode: '400 Bad Request',
      },
      {
        description: 'Request with non-existent references',
        method: endpointInfo.method,
        requestData: '{{INVALID_REFERENCE_DATA}}',
        expectedResponse: '{ "error": "Referenced resource not found" }',
        statusCode: '404 Not Found',
      },
    ];
  }

  /**
   * Generate GET operation test scenarios
   */
  generateGETScenarios(endpointInfo) {
    const scenarios = [];

    if (endpointInfo.hasParams) {
      scenarios.push({
        description: 'Request with invalid ID parameter',
        method: 'GET',
        requestData: '{{INVALID_ID}}',
        expectedResponse: '{ "error": "Resource not found" }',
        statusCode: '404 Not Found',
      });
    } else {
      scenarios.push({
        description: 'Request with pagination parameters',
        method: 'GET',
        requestData: '?page=1&limit=10',
        expectedResponse: '{ "message": "Success", "data": [...] }',
        statusCode: '200 OK',
      });
      scenarios.push({
        description: 'Request with invalid pagination',
        method: 'GET',
        requestData: '?page=-1&limit=abc',
        expectedResponse: '{ "error": "Invalid pagination parameters" }',
        statusCode: '400 Bad Request',
      });
    }

    return scenarios;
  }

  /**
   * Generate DELETE operation test scenarios
   */
  generateDELETEScenarios(endpointInfo) {
    return [
      {
        description: 'Delete non-existent resource',
        method: 'DELETE',
        requestData: '{{NON_EXISTENT_ID}}',
        expectedResponse: '{ "error": "Resource not found" }',
        statusCode: '404 Not Found',
      },
      {
        description: 'Delete resource that is in use',
        method: 'DELETE',
        requestData: '{{RESOURCE_IN_USE_ID}}',
        expectedResponse:
          '{ "error": "Resource cannot be deleted, it is in use" }',
        statusCode: '409 Conflict',
      },
    ];
  }

  /**
   * Generate authentication-related test scenarios
   */
  generateAuthScenarios(endpointInfo) {
    return [
      {
        description: 'Request without authentication token',
        method: endpointInfo.method,
        requestData: endpointInfo.requestData || '{{VALID_DATA}}',
        expectedResponse: '{ "error": "Unauthorized" }',
        statusCode: '401 Unauthorized',
      },
      {
        description: 'Request with insufficient permissions',
        method: endpointInfo.method,
        requestData: endpointInfo.requestData || '{{VALID_DATA}}',
        expectedResponse: '{ "error": "Forbidden" }',
        statusCode: '403 Forbidden',
      },
    ];
  }

  /**
   * Generate valid request data based on endpoint info
   */
  generateValidRequestData(endpointInfo) {
    if (endpointInfo.requestBody) {
      if (typeof endpointInfo.requestBody === 'object') {
        return (
          '`' +
          JSON.stringify(endpointInfo.requestBody, null, 2).replace(
            /"/g,
            '\\"'
          ) +
          '`'
        );
      }
      return '`' + endpointInfo.requestBody + '`';
    }
    return endpointInfo.hasParams ? '{{VALID_ID}}' : 'None';
  }

  /**
   * Generate success response based on method
   */
  generateSuccessResponse(method) {
    switch (method) {
      case 'POST':
        return '{ "message": "Created successfully", "data": {...} }';
      case 'PUT':
        return '{ "message": "Updated successfully", "data": {...} }';
      case 'DELETE':
        return '{ "message": "Deleted successfully" }';
      default:
        return '{ "message": "Success", "data": {...} }';
    }
  }

  /**
   * Get success status code based on method
   */
  getSuccessStatusCode(method) {
    switch (method) {
      case 'POST':
        return '201 Created';
      case 'DELETE':
        return '204 No Content';
      default:
        return '200 OK';
    }
  }

  /**
   * Get operation name for description
   */
  getOperationName(method, endpoint) {
    const parts = endpoint.split('/').filter((p) => p && !p.startsWith(':'));
    const resource = parts[parts.length - 1] || 'resource';

    switch (method) {
      case 'POST':
        return `create ${resource}`;
      case 'PUT':
        return `update ${resource}`;
      case 'DELETE':
        return `delete ${resource}`;
      default:
        return `retrieve ${resource}`;
    }
  }

  /**
   * Generate markdown test case file
   */
  generateTestCaseMarkdown(name, endpointInfo, scenarios) {
    const authRequired = endpointInfo.hasAuth
      ? 'Bearer Token Required'
      : 'Public Access';

    let markdown = `# Test Cases for ${name}\n\n`;
    markdown += `**Endpoint:** \`${endpointInfo.method} {{base_url}}${endpointInfo.endpoint}\`\n`;
    markdown += `**Authentication:** ${authRequired}\n`;
    markdown += `**Content-Type:** ${endpointInfo.contentType}\n\n`;

    markdown += `| No  | Test Case Description | Method | Request Body/Params | Expected Response | Status Code |\n`;
    markdown += `| --- | --------------------- | ------ | ------------------- | ----------------- | ----------- |\n`;

    scenarios.forEach((scenario, index) => {
      markdown += `| ${index + 1}   | ${scenario.description} | ${
        scenario.method
      } | ${scenario.requestData} | ${scenario.expectedResponse} | ${
        scenario.statusCode
      } |\n`;
    });

    return markdown;
  }

  /**
   * Process Postman collection and generate test cases
   */
  generateTestCases() {
    const collection = this.loadPostmanCollection();
    console.log(
      `Generating test cases from collection: ${collection.info.name}`
    );

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    this.processItems(collection.item, this.outputDir);
    console.log('Test case generation completed!');
  }

  /**
   * Recursively process Postman collection items
   */
  processItems(items, currentPath) {
    items.forEach((item) => {
      if (item.item) {
        // This is a folder
        const folderPath = path.join(currentPath, item.name);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
        this.processItems(item.item, folderPath);
      } else if (item.request) {
        // This is a request
        const endpointInfo = this.extractEndpointInfo(item.request);
        const scenarios = this.generateTestScenarios(endpointInfo);
        const markdown = this.generateTestCaseMarkdown(
          item.name,
          endpointInfo,
          scenarios
        );

        const filename = `${item.name.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
        const filepath = path.join(currentPath, filename);

        fs.writeFileSync(filepath, markdown);
        console.log(`Generated: ${filepath}`);
      }
    });
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      'Usage: node test-case-generator.js <postman-collection.json> <output-directory>'
    );
    console.log(
      'Example: node test-case-generator.js ../test-case/FoodTrip.postman_collection.json ../generated-test-cases'
    );
    process.exit(1);
  }

  const collectionPath = path.resolve(args[0]);
  const outputDir = path.resolve(args[1]);

  const generator = new TestCaseGenerator(collectionPath, outputDir);
  generator.generateTestCases();
}

module.exports = TestCaseGenerator;
