import { Router } from 'express';

const router = Router();

import * as register from './register-controller';

router.get('/register.json', register.register);

module.exports = router;
