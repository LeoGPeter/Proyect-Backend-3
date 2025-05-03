import { PetModel } from '../dao/models/Pet.js';

export const getAllPets = async (req, res) => {
  const pets = await PetModel.find();
  res.status(200).json({ status: 'success', pets });
};

export const createPet = async (req, res) => {
  try {
    const { name, specie, age } = req.body;
    if (!name || !specie || !age) {
      return res.status(400).json({ status: 'error', message: 'Datos incompletos' });
    }

    const pet = await PetModel.create({ name, specie, age });
    res.status(201).json({ status: 'success', pet });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al crear la mascota' });
  }
};
