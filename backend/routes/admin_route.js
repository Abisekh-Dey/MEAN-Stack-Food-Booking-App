const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin_controller');

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
