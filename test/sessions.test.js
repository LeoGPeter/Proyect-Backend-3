import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import { connectMongo } from '../src/config/mongo.js';

const requester = supertest(app);
let testEmail = `testuser_${Date.now()}@mail.com`;
let testPassword = '123456';

before(async () => {
  await connectMongo();
});

describe('Sessions API', () => {
  let createdUser;

  it('debería registrar un nuevo usuario', async () => {
    
    const res = await requester.post('/api/sessions/register').send({
      first_name: 'Test',
      last_name: 'User',
      email: testEmail,
      password: testPassword,
    });


    expect(res.status).to.equal(201);
    expect(res.body.user).to.have.property('_id');
    createdUser = res.body.user;
  });

  it('debería hacer login correctamente', async () => {
    const res = await requester.post('/api/sessions/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login exitoso');
  });

  it('no debería permitir registrar un usuario con un email ya existente', async () => {
    const res = await requester.post('/api/sessions/register').send({
      first_name: 'Test',
      last_name: 'User',
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).to.equal(409);
    expect(res.body).to.have.property('error').that.includes('email');
  });

  it('no debería permitir registrar con un email inválido', async () => {
    const res = await requester.post('/api/sessions/register').send({
      first_name: 'Invalid',
      last_name: 'Email',
      email: 'invalid-email',
      password: '123456',
    });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error').that.includes('email');
  });

  it('no debería permitir registrar sin password', async () => {
    const res = await requester.post('/api/sessions/register').send({
      first_name: 'No',
      last_name: 'Password',
      email: 'nopassword@mail.com'
    });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error').that.includes('password');
  });

  it('no debería permitir registrar sin nombre', async () => {
    const res = await requester.post('/api/sessions/register').send({
      last_name: 'NoName',
      email: 'noname@mail.com',
      password: '123456',
    });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error').that.includes('first_name');
  });
});

