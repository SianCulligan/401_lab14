'use strict';

const app = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(app.server);

describe('Error middleware works', () => {
  it('gives a 404 error when accessing', async () => {
    let response = await mockRequest.delete('/notauser');
    let str = response.status;
    console.log('RESPONSE', response.status);
    expect(str).toBe(404);
  });

  it('gives a lets us know when a user is not authorized', async () => {
    let response = await mockRequest.get('/signin');
    let str = response.status;
    console.log('NOT AUTH', response.status);
    expect(str).toBe(404);
  });
});

describe('happy path', () => {
  it('can create a user', async () => {
    //post to /signup
    let response = await mockRequest.post('/signup-body').send ({
      'username': 'Missy Medium',
      'password': 'Password',
      'email': 'test@email.com',
      'role': 'admin',
    });
    let str = response.status;
    expect(str).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.password).toBeDefined();
    expect(response.body.password).not.toBe('Password');

    // let newUserData = JSON.stringify({
    //   });
    //   console.log('TO STRING', newUserData);
    //   let response = await 
    
    //send info from schema
  });

  it('can sign in a user (check video - :45ish in', async () => {
    //post to /signup
    let response = await mockRequest.post('/signin').set('Authorization', 'Basic (INSERT CODED PASSWORD HERE');
    let str = response.status;
    expect(str).toBe(200);

    expect(response.body.username).toBe('Missy Medium');
    expect(response.body.email).toBe('test@email.com');
    expect(response.body.rle).not.toBe('admin');

  });
});
