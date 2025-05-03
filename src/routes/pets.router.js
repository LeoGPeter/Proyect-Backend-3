import { Router } from 'express';
import { getAllPets, createPet } from '../controllers/pets.controller.js';

const router = Router();

router.get('/', getAllPets);
router.post('/', createPet);

export default router;
