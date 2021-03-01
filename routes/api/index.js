
const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtsRoutes = require('./thoughts-routes');

router.use('/thoughts', thoughtsRoutes)
router.use('/users', userRoutes)

module.exports = router;