import { Router } from 'express';
import { getMockingPets, getMockingUsers, postGenerateData } from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingpets', getMockingPets);
router.get('/mockingusers', getMockingUsers);
router.post('/generateData', postGenerateData); // lo agregamos en el siguiente paso
router.get('/loggerTest', (req, res) => {
    req.logger.debug('⚙️ Debug log');
    req.logger.http('🌐 HTTP log');
    req.logger.info('ℹ️ Info log');
    req.logger.warning('⚠️ Warning log');
    req.logger.error('❌ Error log');
    req.logger.fatal('💀 Fatal log');
  
    res.send('Logs generados, revisá consola y archivo errors.log');
  });
  
export default router;

