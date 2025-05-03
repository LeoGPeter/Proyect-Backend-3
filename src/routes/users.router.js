import { Router } from 'express';
import { uploader } from '../middlewares/multer.js';
import { uploadDocuments } from '../controllers/users.controller.js';

const router = Router();

router.post('/:uid/documents', uploader.array('documents'), uploadDocuments);

export default router;
