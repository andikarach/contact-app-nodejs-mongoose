const express = require('express');
const app = express();
const port = 5000;
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//Connect to mongodb
const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/db_contact';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
	.then( result => { console.log('Database connected') })
	.catch( err => { console.log('Database Error') })
const Contact =  require('./models/contact')


const { 
	body, 
	validationResult, 
	check
} = require('express-validator');

const { 
	loadContact, 
	findContact, 
	addContact, 
	deleteContact, 
	cekDuplikat,
	updateContact
} = require('./utility/contact');

//Use EJS
app.set('view engine', 'ejs');
//Use EJS Layouts
app.use(expressLayouts);	

//Build-in middleware
app.use(express.static('public'));

app.use(express.urlencoded({
  extended: true
}))


//konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
	cookie: {maxAge: 6000},
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(flash());

// app.get('/pushManual', (req, res) => {
// 	const contact = new Contact({
// 		name: 'Rizky Musthofa',
// 		email: 'rizkymusthofa@gmail.com',
// 		noHP: '0888'
// 	})
// 	contact.save()
// 		.then(result => { res.send(result) })
// 		.catch( err => { console.log(err) })
// })


app.get('/', (req, res) => {
	res.render('about', {
		title: 'Halaman About',
		layout: 'layouts/main-layout'
	})
});


app.get('/contact', (req, res) => {
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
})


app.get('/contact/add', (req, res) => {
	res.render('add', {
		title: 'Add Contact',
		layout: 'layouts/main-layout',
	})
})

app.post('/contact/add', 
	[
		body('email').custom( val => { return true }),
		check('email', 'Email tidak valid!').isEmail(),
		check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID')
	], (req, res) => {
	

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
})

app.get('/contact/update/:id', (req, res) => {
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
})

// app.get('/tes-update', (req, res) => {
// 	const data = {
// 		name: "Hasil coba update ke 3",
// 		email: 'tes@gmail.com',
// 		noHP: '087870634396'
// 	}

// 	Contact.findByIdAndUpdate('60c17710b1192162b2bd8f0f', data)
// 		.then( result => { res.send('berhasil')})
// 		.catch( err => { console.log(err)})
// })

app.get('/contact/delete/:id', (req, res) => {
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
})

// app.get('/contact/update/:email', (req, res) => {
// 	const contact = findContact(req.params.email);
// 	if (!contact) {
// 		res.status(404);
// 		res.send('<h1>404</h1>')
// 	}else{
// 		deleteContact(req.params.email);
// 		req.flash('msg', 'Data contact berhasil dihapus!');
// 		res.redirect('/contact');
// 	}
// })

// app.post('/contact/add', 
// 	[
// 		body('email').custom((value) => {
// 			const duplikat = cekDuplikat(value);
// 			if (duplikat) {
// 				throw new Error('Email sudah terdaftar');
// 			}

// 			return true;
// 		}),
// 		check('email', 'Email tidak valid!').isEmail(),
// 		check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID')
// 	], (req, res) => {
	

// 	const nama = req.body.nama;
// 	const noHP = req.body.noHP;
// 	const email = req.body.email;


// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
//       res.render('add', {
//       	 title: 'Add Contact',
//       	 layout: 'layouts/main-layout',
//       	 errors: errors.array()
//       })
//     } else {
// 		addContact(nama, noHP, email);
// 		req.flash('msg', 'Data contact berhasil ditambah');
//		res.redirect('/contact');
//     }
// })

// app.post('/contact/edit', 
// 	[
// 		body('email').custom((value, { req }) => {
// 			const duplikat = cekDuplikat(value);
// 			if (value !== req.body.oldEmail && duplikat) {
// 				throw new Error('Email sudah terdaftar');
// 			}

// 			return true;
// 		}),
// 		check('email', 'Email tidak valid!').isEmail(),
// 		check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID')
// 	], (req, res) => {
	

// 	const nama = req.body.nama;
// 	const noHP = req.body.noHP;
// 	const email = req.body.email;
// 	const oldEmail = req.body.oldEmail;


// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
//       res.render('update', {
//       	 title: 'Add Contact',
//       	 layout: 'layouts/main-layout',
//       	 errors: errors.array(),
//       	 contact: req.body,
//       })
//     } else {
// 		updateContact(nama, noHP, email, oldEmail);
// 		req.flash('msg', 'Data contact berhasil diubah');
// 		res.redirect('/contact');
//     }
// })



//jika mau menggunakan parameter get
//contoh /product/1?category=shoes
//gunakan req.query.categorys


//penggunaan use untuk default selain parameter yang telah dibuat 
app.use('/', (req, res) => {
	res.status(404);
	res.send('Not found !')
})


app.listen(port, () => {
	console.log('Server is running')
})

