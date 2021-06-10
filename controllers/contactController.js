const Contact =  require('../models/contact')
const { 
	body, 
	validationResult, 
	check
} = require('express-validator');

const contact_index = (req, res) => {
	Contact.find()
		.then( result => {
			res.render('contact', {
				title: "Contacts",	
				layout: 'layouts/main-layout',
				contacts: result,
				msg: req.flash('msg')
			})
		})
		.catch( err => { console.log(err) })
}


const contact_add = (req, res) => {
	res.render('add', {
		title: 'Add Contact',
		layout: 'layouts/main-layout',
	})
}

const contact_add_proses = (req, res) => {
	const contact = new Contact({
		name: req.body.nama,
		email: req.body.email,
		noHP: req.body.noHP
	})



	const errors = validationResult(req);
	if (!errors.isEmpty()) {
      res.render('add', {
      	 title: 'Add Contact',
      	 layout: 'layouts/main-layout',
      	 errors: errors.array()
      })
    } else {
    	contact.save()
    		.then( result => {
    			req.flash('msg', 'Data contact berhasil ditambah');
				res.redirect('/contact');	
    		})
    		.catch( err => { res.send(err) })
    }
}


const contact_update_proses = (req, res) => {
	const data = {
		name: req.body.nama,
		email: req.body.email,
		noHP: req.body.noHP
	}

	const id = req.body.id

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
      res.render('update', {
      	 title: 'Add Contact',
      	 layout: 'layouts/main-layout',
      	 errors: errors.array(),
      	 contact: req.body
      })
    } else {
    	Contact.findOneAndUpdate(
    	{
    		_id:id
    	}, data, {
    		new:true,
			runValidators:true	
    	})
		.then( result => {
			req.flash('msg', 'Data contact berhasil diubah');
			res.redirect('/contact');	
		})
		.catch( err => { res.send(err) })
    }
}

const contact_delete = (req, res) => {
	const id = req.params.id;
	if (!id) {
		res.status(404);
		res.send('<h1>404</h1>')
	} else {
		Contact.findByIdAndDelete(id)
			.then( result => {
				req.flash('msg', 'Data contact berhasil dihapus!');
				res.redirect('/contact');
			})
			.catch( err => {
				res.send(err)
			})
	}
}

const contact_update = (req, res) => {
	Contact.findById(req.params.id)
		.then(result => {
			res.render('update', {
				title: 'Update Contact',
				layout: 'layouts/main-layout',
				contact: result
			})
		})
		.catch(err => {
			res.send(err)
		})
}



module.exports = {
	contact_index,
	contact_add,
	contact_add_proses,
	contact_delete,
	contact_update,
	contact_update_proses,
}