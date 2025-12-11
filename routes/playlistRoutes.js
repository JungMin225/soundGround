// routes/playlistRoutes.js
const router = require('express').Router();
const { listCreators, viewByUsername } = require('../controllers/playlistController');

router.get('/', listCreators);
router.get('/:username', viewByUsername);

module.exports = router;
