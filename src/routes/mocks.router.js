import { Router } from 'express';
import { getMockingPets, getMockingUsers, postGenerateData } from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingpets', getMockingPets);
router.get('/mockingusers', getMockingUsers);
router.post('/generateData', postGenerateData); // lo agregamos en el siguiente paso

export default router;

