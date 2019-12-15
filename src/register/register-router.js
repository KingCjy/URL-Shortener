import { Router } from 'express';

const router = Router();

import * as register from './register-controller';

router.get('/register.json', register.register);
router.get('/:url', register.redirectUrl);

module.exports = router;
