const request = require('supertest')
const { BASE_URL, HEADERS } = require('@config/config')

// helper to get token auth
async function login (username, password) {
  const response = await request(BASE_URL)
    .post('/auth/login')
    .set(HEADERS)
    .send({ username, password })
  return { body: response.body, status: response.status } // Return token from response api
}

// sample basic call api login
async function getTokenLogin () {
  const response = await request(BASE_URL)
    .post('/auth/login')
    .set(HEADERS)
    .send({
      username: 'mor_2314',
      password: '83r5^_'
    })
  return response.body.token // Return token from response api
}

module.exports = { login, getTokenLogin }
