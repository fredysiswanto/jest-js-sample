const testData = require('@dataTest/testData.json');
const { getTokenLogin } = require('@srcApi/auth.js');
const { loginss, addLogin, updateLogin, deleteLogin  } = require('@srcApi/food-trip-api/login.js');

describe('Test url api /logins', () => {
  let authToken = '';
  beforeAll(async () => {
    const res = await getTokenLogin();
    authToken = res
  });
  test('sample testing', async () => {
    const response = await loginss({
      reqHeader: { token: authToken },
      reqBody: {},
      params:'',
      debug:false
    });
    const {body} = response.body;
    expect(response.status).toBe(200);
    expect(body.xxx).toBe('xxx');
  });
})