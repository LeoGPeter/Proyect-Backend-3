import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';

const requester = supertest(app);

describe('Sessions API', () => {
  let createdUser;

  it('debería registrar un nuevo usuario', async () => {
    const res = await requester.post('/api/sessions/register').send({
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@mail.com',
      password: '123456',
    });

    expect(res.status).to.equal(201);
    expect(res.body.user).to.have.property('_id');
    createdUser = res.body.user;
  });

  it('debería hacer login correctamente', async () => {
    const res = await requester.post('/api/sessions/login').send({
      email: 'testuser@mail.com',
      password: '123456',
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login exitoso');
  });
});

