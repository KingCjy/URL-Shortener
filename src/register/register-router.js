import { Router } from 'express';

const router = Router();

import * as register from './register-controller';

router.get('/register.json', register.register);
router.get('/:url/stats', register.stats);
router.get('/:url', register.redirectUrl);

module.exports = router;
