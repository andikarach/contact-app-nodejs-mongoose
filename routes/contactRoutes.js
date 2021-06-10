const express = require('express');
const router = express.Router()
const contactController = require('../controllers/contactController')
const { 
	body, 
	validationResult, 
	check
} = require('express-validator');

router.get('/contact', contactController.contact_index)

router.get('/contact/add', contactController.contact_add)

router.post('/contact/add', 
	[
		body('email').custom( val => { return true }),
		check('email', 'Email tidak valid!').isEmail(),
		check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID')
	], contactController.contact_add_proses)

router.get('/contact/update/:id', contactController.contact_update)

router.post('/contact/update/:id',
	[
		body('email').custom( val => { return true }),
		check('email', 'Email tidak valid!').isEmail(),
		check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID')
	], contactController.contact_update_proses)

router.get('/contact/delete/:id', contactController.contact_delete)



module.exports = router