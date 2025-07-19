# API Test Template Model for FoodTrip API

## Template Structure

### Test Case Header

```markdown
# Test Cases for {{API_FEATURE_NAME}}

**Endpoint:** `{{HTTP_METHOD}} {{base_url}}{{ENDPOINT_PATH}}`
**Authentication:** {{AUTH_REQUIRED}}
**Content-Type:** {{CONTENT_TYPE}}
```

### Test Case Table Template

| No  | Test Case Description              | Method          | Request Body/Params      | Expected Response       | Status Code         |
| --- | ---------------------------------- | --------------- | ------------------------ | ----------------------- | ------------------- |
| 1   | {{POSITIVE_TEST_DESCRIPTION}}      | {{HTTP_METHOD}} | {{VALID_REQUEST_DATA}}   | {{SUCCESS_RESPONSE}}    | {{SUCCESS_STATUS}}  |
| 2   | {{NEGATIVE_TEST_DESCRIPTION}}      | {{HTTP_METHOD}} | {{INVALID_REQUEST_DATA}} | {{ERROR_RESPONSE}}      | {{ERROR_STATUS}}    |
| 3   | {{EDGE_CASE_DESCRIPTION}}          | {{HTTP_METHOD}} | {{EDGE_CASE_DATA}}       | {{EDGE_CASE_RESPONSE}}  | {{EDGE_STATUS}}     |
| 4   | {{SECURITY_TEST_DESCRIPTION}}      | {{HTTP_METHOD}} | {{SECURITY_TEST_DATA}}   | {{SECURITY_RESPONSE}}   | {{SECURITY_STATUS}} |
| 5   | {{AUTHORIZATION_TEST_DESCRIPTION}} | {{HTTP_METHOD}} | {{AUTH_TEST_DATA}}       | {{AUTH_ERROR_RESPONSE}} | {{AUTH_STATUS}}     |

---

## Standard Test Scenarios Template

### For Authentication Endpoints (POST)

1. ✅ **Valid credentials** → 200 OK / 201 Created
2. ❌ **Invalid email** → 401 Unauthorized
3. ❌ **Invalid password** → 401 Unauthorized
4. ❌ **Missing email** → 400 Bad Request
5. ❌ **Missing password** → 400 Bad Request
6. ❌ **Empty request body** → 400 Bad Request
7. ❌ **Malformed email** → 400 Bad Request
8. 🔒 **SQL injection attempt** → 401 Unauthorized
9. 🔒 **XSS attack attempt** → 400 Bad Request
10. ⚡ **Account locked** → 403 Forbidden

### For GET Endpoints (Retrieval)

1. ✅ **Successful retrieval** → 200 OK
2. ✅ **With pagination** → 200 OK
3. ❌ **Invalid pagination** → 400 Bad Request
4. ✅ **With filters** → 200 OK
5. ❌ **Invalid filters** → 400 Bad Request
6. ✅ **With search query** → 200 OK
7. ✅ **No results found** → 200 OK
8. ✅ **With sorting** → 200 OK
9. ❌ **Invalid sorting** → 400 Bad Request
10. 🔒 **Without authentication** → 401 Unauthorized

### For POST/PUT Endpoints (Creation/Update)

1. ✅ **Valid data** → 201 Created / 200 OK
2. ❌ **Missing required fields** → 400 Bad Request
3. ❌ **Invalid data format** → 400 Bad Request
4. ❌ **Invalid references (FK)** → 404 Not Found
5. ❌ **Duplicate data** → 409 Conflict
6. 🔒 **Without authentication** → 401 Unauthorized
7. 🔒 **Insufficient permissions** → 403 Forbidden
8. ❌ **Server error simulation** → 500 Internal Server Error

### For DELETE Endpoints

1. ✅ **Valid deletion** → 200 OK / 204 No Content
2. ❌ **Non-existent resource** → 404 Not Found
3. 🔒 **Without authentication** → 401 Unauthorized
4. 🔒 **Insufficient permissions** → 403 Forbidden
5. ❌ **Resource in use** → 409 Conflict

---

## Placeholder Definitions

### Basic Placeholders

- **{{API_FEATURE_NAME}}**: Feature name (e.g., "Login", "Create Dish", "User Management")
- **{{HTTP_METHOD}}**: GET, POST, PUT, DELETE, PATCH
- **{{base_url}}**: http://localhost:3600/api/v1
- **{{ENDPOINT_PATH}}**: Specific endpoint path (e.g., /home/login, /resto-admin/dish)
- **{{AUTH_REQUIRED}}**: Bearer Token Required / Public Access / Admin Only
- **{{CONTENT_TYPE}}**: application/json / multipart/form-data

### Test Case Placeholders

- **{{POSITIVE_TEST_DESCRIPTION}}**: Description for successful test case
- **{{NEGATIVE_TEST_DESCRIPTION}}**: Description for error test case
- **{{EDGE_CASE_DESCRIPTION}}**: Description for edge case scenario
- **{{SECURITY_TEST_DESCRIPTION}}**: Description for security test
- **{{AUTHORIZATION_TEST_DESCRIPTION}}**: Description for auth test

### Request/Response Placeholders

- **{{VALID_REQUEST_DATA}}**: Valid JSON/form data for success case
- **{{INVALID_REQUEST_DATA}}**: Invalid data for error case
- **{{SUCCESS_RESPONSE}}**: Expected successful response
- **{{ERROR_RESPONSE}}**: Expected error response
- **{{SUCCESS_STATUS}}**: Success HTTP status (200, 201, 204)
- **{{ERROR_STATUS}}**: Error HTTP status (400, 401, 403, 404, 409, 500)

---

## FoodTrip API Specific Templates

### Authentication Template (Login)

```markdown
# Test Cases for {{USER_TYPE}} Login

**Endpoint:** `POST {{base_url}}/api/v1/home/login`
**Authentication:** Public Access
**Content-Type:** application/json

| No  | Test Case Description                     | Method | Request Body                                                   | Expected Response                                  | Status Code      |
| --- | ----------------------------------------- | ------ | -------------------------------------------------------------- | -------------------------------------------------- | ---------------- |
| 1   | {{USER_TYPE}} login with valid data       | POST   | `{ "email_address": "{{EMAIL}}", "password": "{{PASSWORD}}" }` | `{ "message": "Login successful", "data": {...} }` | 200 OK           |
| 2   | {{USER_TYPE}} login with invalid email    | POST   | `{ "email_address": "wrong@email.com", "password": "..." }`    | `{ "error": "Invalid credentials" }`               | 401 Unauthorized |
| 3   | {{USER_TYPE}} login with invalid password | POST   | `{ "email_address": "{{EMAIL}}", "password": "wrongpass" }`    | `{ "error": "Invalid credentials" }`               | 401 Unauthorized |
```

### Registration Template

```markdown
# Test Cases for {{REGISTRATION_TYPE}} Registration

**Endpoint:** `POST {{base_url}}/api/v1/home/register/{{ENDPOINT_SUFFIX}}`
**Authentication:** Public Access
**Content-Type:** {{CONTENT_TYPE}}

| No  | Test Case Description           | Method | Request Body                | Expected Response                          | Status Code     |
| --- | ------------------------------- | ------ | --------------------------- | ------------------------------------------ | --------------- |
| 1   | Successfully register {{TYPE}}  | POST   | {{VALID_REGISTRATION_DATA}} | `{ "message": "Registration successful" }` | 201 Created     |
| 2   | Register with missing {{FIELD}} | POST   | {{MISSING_FIELD_DATA}}      | `{ "error": "{{FIELD}} is required" }`     | 400 Bad Request |
```

### CRUD Operations Template

```markdown
# Test Cases for {{RESOURCE_NAME}} {{OPERATION}}

**Endpoint:** `{{METHOD}} {{base_url}}/api/v1/{{ROLE}}/{{RESOURCE}}/{{PATH}}`
**Authentication:** Bearer Token Required
**Content-Type:** {{CONTENT_TYPE}}

| No  | Test Case Description                   | Method     | Request Body/Params | Expected Response                      | Status Code      |
| --- | --------------------------------------- | ---------- | ------------------- | -------------------------------------- | ---------------- |
| 1   | Successfully {{OPERATION}} {{RESOURCE}} | {{METHOD}} | {{VALID_DATA}}      | `{ "message": "{{SUCCESS_MESSAGE}}" }` | {{SUCCESS_CODE}} |
| 2   | {{OPERATION}} with invalid data         | {{METHOD}} | {{INVALID_DATA}}    | `{ "error": "{{ERROR_MESSAGE}}" }`     | 400 Bad Request  |
| 3   | {{OPERATION}} without authentication    | {{METHOD}} | {{VALID_DATA}}      | `{ "error": "Unauthorized" }`          | 401 Unauthorized |
```

---

## Usage Examples

### Example 1: Admin Login

- {{USER_TYPE}} = "Admin"
- {{EMAIL}} = "admin@foodtrip.com"
- {{PASSWORD}} = "Admin@123"

### Example 2: Create Dish

- {{RESOURCE_NAME}} = "Dish"
- {{OPERATION}} = "Create"
- {{METHOD}} = "POST"
- {{ROLE}} = "resto-admin"
- {{RESOURCE}} = "dish"
- {{CONTENT_TYPE}} = "multipart/form-data"

### Example 3: Customer Registration

- {{REGISTRATION_TYPE}} = "Customer"
- {{ENDPOINT_SUFFIX}} = "customer"
- {{CONTENT_TYPE}} = "application/json"
