# FoodTrip API Test Template Model - User Guide

## Overview

This enhanced template model provides a comprehensive, reusable framework for generating API test cases based on your Postman collection. It includes automated test case generation, standard testing scenarios, and customizable templates for all types of API endpoints.

## Features

✅ **Automated Test Case Generation** - Generate test cases directly from Postman collections  
✅ **Standard Test Scenarios** - Pre-defined test scenarios for common API patterns  
✅ **Role-Based Testing** - Support for different user roles (Admin, Resto Admin, Customer)  
✅ **Security Testing** - Built-in security test scenarios (SQL injection, XSS, etc.)  
✅ **Comprehensive Coverage** - Covers success, error, edge cases, and authentication scenarios  
✅ **Reusable Templates** - Generic templates that work across all API endpoints  
✅ **Easy Customization** - Configurable via JSON configuration files

## Quick Start

### 1. Generate Test Cases from Postman Collection

```bash
# Generate test cases using default settings
npm run generate-tests

# Generate with custom output directory
npm run generate-tests -- --output ./my-test-cases

# Generate from specific collection file
npm run generate-tests -- --collection ./my-collection.json --output ./tests
```

### 2. Manual Template Usage

You can also manually create test cases using the template structure in `api_test_template_model.md`.

## Template Structure

### Basic Template Format

```markdown
# Test Cases for {{API_FEATURE_NAME}}

**Endpoint:** `{{HTTP_METHOD}} {{base_url}}{{ENDPOINT_PATH}}`
**Authentication:** {{AUTH_REQUIRED}}
**Content-Type:** {{CONTENT_TYPE}}

| No  | Test Case Description | Method     | Request Body/Params | Expected Response | Status Code |
| --- | --------------------- | ---------- | ------------------- | ----------------- | ----------- |
| 1   | {{TEST_DESCRIPTION}}  | {{METHOD}} | {{REQUEST_DATA}}    | {{RESPONSE}}      | {{STATUS}}  |
```

### Placeholder System

The template uses a comprehensive placeholder system:

#### Basic Placeholders

- `{{HTTP_METHOD}}` - GET, POST, PUT, DELETE, PATCH
- `{{base_url}}` - http://localhost:3600/api/v1
- `{{ENDPOINT_PATH}}` - Specific endpoint path
- `{{AUTH_REQUIRED}}` - Authentication requirements
- `{{CONTENT_TYPE}}` - application/json or multipart/form-data

#### Test Case Placeholders

- `{{POSITIVE_TEST_DESCRIPTION}}` - Successful scenario description
- `{{NEGATIVE_TEST_DESCRIPTION}}` - Error scenario description
- `{{EDGE_CASE_DESCRIPTION}}` - Edge case scenario description
- `{{SECURITY_TEST_DESCRIPTION}}` - Security test description

## Standard Test Scenarios

### Authentication Endpoints

1. ✅ Valid credentials → 200 OK
2. ❌ Invalid email → 401 Unauthorized
3. ❌ Invalid password → 401 Unauthorized
4. ❌ Missing email → 400 Bad Request
5. ❌ Missing password → 400 Bad Request
6. ❌ Empty request body → 400 Bad Request
7. ❌ Malformed email → 400 Bad Request
8. 🔒 SQL injection attempt → 401 Unauthorized
9. 🔒 XSS attack attempt → 400 Bad Request
10. ⚡ Account locked → 403 Forbidden

### GET Endpoints (Data Retrieval)

1. ✅ Successful retrieval → 200 OK
2. ✅ With pagination → 200 OK
3. ❌ Invalid pagination → 400 Bad Request
4. ✅ With filters → 200 OK
5. ❌ Invalid filters → 400 Bad Request
6. ✅ With search query → 200 OK
7. ✅ No results found → 200 OK
8. ✅ With sorting → 200 OK
9. ❌ Invalid sorting → 400 Bad Request
10. 🔒 Without authentication → 401 Unauthorized

### POST/PUT Endpoints (Create/Update)

1. ✅ Valid data → 201 Created / 200 OK
2. ❌ Missing required fields → 400 Bad Request
3. ❌ Invalid data format → 400 Bad Request
4. ❌ Invalid references → 404 Not Found
5. ❌ Duplicate data → 409 Conflict
6. 🔒 Without authentication → 401 Unauthorized
7. 🔒 Insufficient permissions → 403 Forbidden
8. ❌ Server error → 500 Internal Server Error

### DELETE Endpoints

1. ✅ Valid deletion → 200 OK / 204 No Content
2. ❌ Non-existent resource → 404 Not Found
3. 🔒 Without authentication → 401 Unauthorized
4. 🔒 Insufficient permissions → 403 Forbidden
5. ❌ Resource in use → 409 Conflict

## FoodTrip-Specific Templates

### Login Template Example

```markdown
# Test Cases for Admin Login

**Endpoint:** `POST {{base_url}}/api/v1/home/login`
**Authentication:** Public Access
**Content-Type:** application/json

| No  | Test Case Description          | Method | Request Body                                                         | Expected Response                                  | Status Code      |
| --- | ------------------------------ | ------ | -------------------------------------------------------------------- | -------------------------------------------------- | ---------------- |
| 1   | Admin login with valid data    | POST   | `{ "email_address": "admin@foodtrip.com", "password": "Admin@123" }` | `{ "message": "Login successful", "data": {...} }` | 200 OK           |
| 2   | Admin login with invalid email | POST   | `{ "email_address": "wrong@email.com", "password": "Admin@123" }`    | `{ "error": "Invalid credentials" }`               | 401 Unauthorized |
```

### CRUD Template Example

```markdown
# Test Cases for Create Dish

**Endpoint:** `POST {{base_url}}/api/v1/resto-admin/dish`
**Authentication:** Bearer Token Required
**Content-Type:** multipart/form-data

| No  | Test Case Description         | Method | Request Body                             | Expected Response                            | Status Code     |
| --- | ----------------------------- | ------ | ---------------------------------------- | -------------------------------------------- | --------------- |
| 1   | Successfully create dish      | POST   | `{ "dish_name": "Pizza", "price": 999 }` | `{ "message": "Dish created successfully" }` | 201 Created     |
| 2   | Create dish with missing name | POST   | `{ "price": 999 }`                       | `{ "error": "Dish name is required" }`       | 400 Bad Request |
```

## Configuration

### Test Generator Configuration

The test generator can be customized via `scripts/test-generator-config.json`:

```json
{
  "baseUrl": "http://localhost:3600/api/v1",
  "authenticationPatterns": {
    "public": ["home/login", "home/register"],
    "authenticated": ["resto-admin", "admin", "customer"]
  },
  "testScenarios": {
    "authentication": { "enabled": true },
    "crud": { "enabled": true },
    "retrieval": { "enabled": true }
  }
}
```

### Test Data Configuration

Pre-defined test data for consistent testing:

```json
{
  "users": {
    "admin": {
      "email_address": "admin@foodtrip.com",
      "password": "Admin@123"
    },
    "customer": {
      "email_address": "customer@foodtrip.com",
      "password": "Customer@123"
    }
  }
}
```

## File Structure

```
test-case/
├── api_test_template_model.md           # Main template model
├── FoodTrip.postman_collection.json     # Source Postman collection
├── Home/                                # Manual test cases
│   ├── Login.md
│   ├── Find All Dish.md
│   └── ...
├── Admin Resto/
│   ├── Create Dish.md
│   └── ...
└── generated-test-cases/                # Auto-generated test cases
    ├── Home/
    ├── Resto Admin/
    └── Admin/

scripts/
├── test-case-generator.js               # Main generator script
├── generate-tests.js                    # CLI interface
└── test-generator-config.json           # Configuration file
```

## Usage Examples

### Example 1: Generate All Test Cases

```bash
npm run generate-tests
```

This will:

1. Read `FoodTrip.postman_collection.json`
2. Generate test cases for all endpoints
3. Create organized folder structure
4. Output to `./generated-test-cases/`

### Example 2: Generate with Custom Output

```bash
npm run generate-tests -- --output ./api-tests
```

### Example 3: Manual Template Usage

1. Copy the template from `api_test_template_model.md`
2. Replace placeholders with your specific values
3. Add endpoint-specific test scenarios
4. Save as a new `.md` file

## Best Practices

### 1. Test Case Organization

- Group test cases by user role (Home, Admin, Resto Admin, Customer)
- Use descriptive file names (kebab-case recommended)
- Include both positive and negative test scenarios

### 2. Test Data Management

- Use realistic test data that matches production scenarios
- Include edge cases (empty strings, null values, boundary conditions)
- Implement data cleanup strategies for tests

### 3. Security Testing

- Always include authentication/authorization tests
- Test for common vulnerabilities (SQL injection, XSS)
- Validate input sanitization

### 4. Maintenance

- Keep test cases synchronized with API changes
- Regular review and update of test scenarios
- Use version control for test case documentation

## Integration with Testing Frameworks

The generated test cases can be easily integrated with various testing frameworks:

### Jest + Supertest

```javascript
// Example integration with Jest
describe('Admin Login API', () => {
  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/home/login')
      .send({ email_address: 'admin@foodtrip.com', password: 'Admin@123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });
});
```

### Postman/Newman

```bash
# Run generated test cases with Newman
newman run generated-collection.json
```

## Troubleshooting

### Common Issues

1. **Generator fails to read Postman collection**

   - Ensure the collection file path is correct
   - Verify the JSON file is valid

2. **Missing test scenarios**

   - Check the configuration file settings
   - Ensure the endpoint patterns match your API structure

3. **Template placeholders not replaced**
   - Verify placeholder syntax matches the template
   - Check for typos in placeholder names

### Getting Help

1. Run `npm run generate-tests:help` for CLI options
2. Check the template examples in `api_test_template_model.md`
3. Review existing test cases in the `test-case/` folders

## Contributing

To extend the template model:

1. Add new test scenarios to the configuration
2. Update placeholder definitions
3. Enhance the generator script for new patterns
4. Update documentation with examples

## Version History

- **v1.0** - Basic template structure
- **v2.0** - Enhanced with automated generation
- **v2.1** - Added security testing scenarios
- **v2.2** - Improved configuration and CLI interface
