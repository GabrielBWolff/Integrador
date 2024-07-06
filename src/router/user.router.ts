import express from 'express';

import { index, store, login, put } from '../controllers/user.controller.js';
import { UserLoginMidddleware } from '../middleware/user.midddleware.js';

const router = express.Router();

router.get('/', UserLoginMidddleware, index);
router.post('/', store);
router.post('/login', login);
router.put('/', UserLoginMidddleware, put);

export default router;
