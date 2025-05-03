import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export function generateMockPets(count = 100) {
  const pets = [];

  for (let i = 0; i < count; i++) {
    pets.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.person.firstName(),
      specie: faker.animal.type(),
      age: faker.number.int({ min: 1, max: 15 }),
      adopted: false,
      owner: null
    });
  }

  return pets;
}


export async function generateMockUsers(count = 50) {
  const users = [];
  const hashedPassword = await bcrypt.hash('coder123', 10);

  for (let i = 0; i < count; i++) {
    users.push({
      _id: faker.database.mongodbObjectId(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: faker.helpers.arrayElement(['user', 'admin']),
      pets: [],
    });
  }

  return users;
}

