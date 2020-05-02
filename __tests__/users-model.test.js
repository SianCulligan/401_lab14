'use strict';

const app = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(app.server);

describe('user route work', () => {
  it('can GET (read) users', async () => {
    let response = await mockRequest.post('/user');
    console.log('GET status', response.status);
    expect(response.status).toBe(200);
  });
  
  it('can POST (create) products from the req.body', async () => {
    let newUserData = JSON.stringify({
      'username': 'Missy Medium',
      'password': 'Password',
      'email': 'test@email.com',
      'role': 'admin',
    });
    console.log('TO STRING', newUserData);
    let response = await mockRequest.create('/signup-body');
    let str = response.status;
    console.log('ADD USER RESPONSE', response.status);
    expect(str).toBe(201);
  });


  it('can POST (create) products from the req.headers.authorization', async () => {
    let newUserData = JSON.stringify({
      'username': 'Toby Tolerable',
      'password': 'Password',
      'email': 'testing@email.com',
      'role': 'user',
    });
    console.log('TO STRING', newUserData);
    let response = await mockRequest.create('/signup-headers');
    let str = response.status;
    console.log('USER FROM HEADERS RESPONSE', response.status);
    expect(str).toBe(201);
  });
          

  it('can PUT (update) users', async () => {
    let updatedUserData = JSON.stringify({
      'username': 'Nathan Neutral',
      'password': 'Password',
      'email': 'tester@email.com',
      'role': 'user',
    });
    console.log('PUT TO STRING', updatedUserData);
    let response = await mockRequest.put('/Users/1').send(updatedUserData);
    let str = response.status;
    console.log('PUT RESPONSE', response.status);
    expect(str).toBe(200);
  });
  it('can DELETE (delete, duh) products', async () => {
    let response = await mockRequest.delete('/products:1');
    let str = response.status;
    console.log('RESPONSE', str);
    expect(str).toBe(200);
  });
});
