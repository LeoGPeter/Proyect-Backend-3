import { AdoptionModel } from '../dao/models/Adoption.js';
import { PetModel } from '../dao/models/Pet.js';

export const getAdoptions = async (req, res) => {
  const adoptions = await AdoptionModel.find().populate('pet_id user_id');
  res.status(200).json({ status: 'success', adoptions });
};

export const createAdoption = async (req, res) => {
  try {
    const { pet_id, user_id } = req.body;

    if (!pet_id || !user_id) {
      return res.status(400).json({ status: 'error', message: 'Faltan datos' });
    }

    const pet = await PetModel.findById(pet_id);
    if (!pet || pet.adopted) {
      return res.status(400).json({ status: 'error', message: 'Mascota no válida o ya adoptada' });
    }

    await PetModel.findByIdAndUpdate(pet_id, { adopted: true });

    const adoption = await AdoptionModel.create({ pet_id, user_id });

    res.status(201).json({ status: 'success', adoption });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al registrar adopción' });
  }
};
