import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js'; // asegurate que esto exporte el app.listen correctamente
import { connectMongo } from '../src/config/mongo.js';

const requester = supertest(app);

before(async () => {
  await connectMongo();
});

describe('Pets API', () => {
  let petId;

  it('debería crear una nueva mascota', async () => {
    const res = await requester.post('/api/pets').send({
      name: 'Coco',
      specie: 'perro',
      age: 4
    });

    expect(res.status).to.equal(201);
    expect(res.body.pet).to.have.property('_id');
    petId = res.body.pet._id;
  });

  it('debería obtener todas las mascotas', async () => {
    const res = await requester.get('/api/pets');
    expect(res.status).to.equal(200);
    expect(res.body.pets).to.be.an('array');
  });
});

