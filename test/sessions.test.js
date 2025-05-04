import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js'; // Asegurate de exportar `app` en src/app.js
import { UserModel } from '../src/dao/models/User.js';

const requester = supertest(app);
const testEmail = `testuser_${Date.now()}@mail.com`;
const testPassword = '123456';

before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

after(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await UserModel.deleteMany({ email: /testuser_.*@mail\.com/ }); // Limpia los test
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
    // primero registrar para asegurar login
    await UserModel.create({
      first_name: 'Test',
      last_name: 'User',
      email: testEmail,
      password: await import('bcryptjs').then(b => b.hash(testPassword, 10)),
      role: 'user',
      pets: [],
    });

    const res = await requester.post('/api/sessions/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login exitoso');
  });

  it('no debería permitir registrar un email ya existente', async () => {
    await UserModel.create({
      first_name: 'Test',
      last_name: 'User',
      email: testEmail,
      password: testPassword,
      role: 'user',
    });

    const res = await requester.post('/api/sessions/register').send({
      first_name: 'Test',
      last_name: 'User',
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).to.equal(409);
    expect(res.body).to.have.property('error').that.includes('email');
  });

  it('no debería permitir registrar con email inválido', async () => {
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
      email: 'nopassword@mail.com',
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

