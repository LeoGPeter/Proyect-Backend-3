import { AdoptionModel } from '../dao/models/Adoption.js';
import { PetModel } from '../dao/models/Pet.js';

export const getAdoptions = async (req, res) => {
  const adoptions = await AdoptionModel.find().populate('pet_id user_id');
  req.logger.http('GET /api/adoptions');
  res.status(200).json({ status: 'success', adoptions });
};

export const createAdoption = async (req, res) => {
  try {
    const { petId, userId } = req.body;

    if (!petId || !userId) {
      req.logger.warning('Adopción fallida: faltan datos');
      return res.status(400).json({ status: 'error', message: 'Faltan datos' });
    }

    const pet = await PetModel.findById(petId);
    if (!pet || pet.adopted) {
      req.logger.warning(`Adopción fallida: mascota no válida o ya adoptada (ID: ${petId})`);
      return res.status(400).json({ status: 'error', message: 'Mascota no válida o ya adoptada' });
    }

    await PetModel.findByIdAndUpdate(petId, { adopted: true });

    const adoption = await AdoptionModel.create({
      pet_id: petId,
      user_id: userId
    });

    req.logger.info(`Adopción registrada: mascota ${petId} por usuario ${userId}`);
    return res.status(201).json({ status: 'success', message: 'Adopción registrada', adoption });

  } catch (err) {
    req.logger.error('Error al registrar adopción', err);
    res.status(500).json({ status: 'error', message: 'Error al registrar adopción' });
  }
};

