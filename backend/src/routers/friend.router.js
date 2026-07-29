const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controller');
const verifyToken = require('../middlewares/auth.js');

router.use(verifyToken);

router.get('/', friendController.getFriends);
router.get('/requests', friendController.getPendingRequests);
router.post('/add', friendController.sendRequest);
router.post('/accept/:id', friendController.acceptRequest);
router.delete('/:id', friendController.removeFriend);

module.exports = router;
