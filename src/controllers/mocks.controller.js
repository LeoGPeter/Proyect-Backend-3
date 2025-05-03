import { generateMockPets, generateMockUsers } from '../mocks/mockGenerator.js';
import { UserModel } from '../dao/models/User.js';
import { PetModel } from '../dao/models/Pet.js';

export const getMockingPets = (req, res) => {
  try {
    const pets = generateMockPets(100);
    res.json({ status: 'success', payload: pets });
  } catch (err) {
    console.error(err); // temporal para depurar
    res.status(500).json({ status: 'error', message: 'Mocking failed' });
  }
};

export const getMockingUsers = async (req, res) => {
  try {
    const users = await generateMockUsers(50);
    res.json({ status: 'success', payload: users });
  } catch (err) {
    req.logger?.error('Error generando usuarios mockeados', err);
    res.status(500).json({ status: 'error', message: 'Mocking users failed' });
  }
};

export const postGenerateData = async (req, res) => {
    try {
      const { users = 0, pets = 0 } = req.body;
  
      const mockUsers = await generateMockUsers(Number(users));
      const mockPets = generateMockPets(Number(pets));
  
      const createdUsers = await UserModel.insertMany(mockUsers);
      const createdPets = await PetModel.insertMany(mockPets);
  
      res.status(201).json({
        status: 'success',
        inserted: {
          users: createdUsers.length,
          pets: createdPets.length,
        },
      });
    } catch (err) {
      req.logger?.error('Error generando data', err);
      res.status(500).json({ status: 'error', message: 'No se pudo generar data' });
    }
  };
