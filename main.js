const express = require('express');
const app = express();
const port = 5000;
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

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



app.get('/', (req, res) => {
	res.render('about', {
		title: 'Halaman About',
		layout: 'layouts/main-layout'
	})
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'Halaman About',
		layout: 'layouts/main-layout'
	})
})

app.get('/contact', (req, res) => {
	const contacts = loadContact();
	
	res.render('contact', {
		title: 'Halaman Contact',
		layout: 'layouts/main-layout',
		contacts,
		msg: req.flash('msg')
	})
})

app.get('/contact/add', (req, res) => {
	res.render('add', {
		title: 'Add Contact',
		layout: 'layouts/main-layout',
	})
})

app.get('/contact/update/:email', (req, res) => {
	const contact = findContact(req.params.email);
	res.render('update', {
		title: 'Update Contact',
		layout: 'layouts/main-layout',
		contact
	})
})

app.get('/contact/delete/:email', (req, res) => {
	const contact = findContact(req.params.email);
	if (!contact) {
		res.status(404);
		res.send('<h1>404</h1>')
	}else{
		deleteContact(req.params.email);
		req.flash('msg', 'Data contact berhasil dihapus!');
		res.redirect('/contact');
	}
})

app.get('/contact/update/:email', (req, res) => {
	const contact = findContact(req.params.email);
	if (!contact) {
		res.status(404);
		res.send('<h1>404</h1>')
	}else{
		deleteContact(req.params.email);
		req.flash('msg', 'Data contact berhasil dihapus!');
		res.redirect('/contact');
	}
})

app.post('/contact/add', 
	[
		body('email').custom((value) => {
			const duplikat = cekDuplikat(value);
			if (duplikat) {
				throw new Error('Email sudah terdaftar');
			}

			return true;
		}),
		check('email', 'Email tidak valid!').isEmail(),
		check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID')
	], (req, res) => {
	

	const nama = req.body.nama;
	const noHP = req.body.noHP;
	const email = req.body.email;


	const errors = validationResult(req);
	if (!errors.isEmpty()) {
      res.render('add', {
      	 title: 'Add Contact',
      	 layout: 'layouts/main-layout',
      	 errors: errors.array()
      })
    } else {
		addContact(nama, noHP, email);
		req.flash('msg', 'Data contact berhasil ditambah');
		res.redirect('/contact');
    }
})

app.post('/contact/edit', 
	[
		body('email').custom((value, { req }) => {
			const duplikat = cekDuplikat(value);
			if (value !== req.body.oldEmail && duplikat) {
				throw new Error('Email sudah terdaftar');
			}

			return true;
		}),
		check('email', 'Email tidak valid!').isEmail(),
		check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID')
	], (req, res) => {
	

	const nama = req.body.nama;
	const noHP = req.body.noHP;
	const email = req.body.email;
	const oldEmail = req.body.oldEmail;


	const errors = validationResult(req);
	if (!errors.isEmpty()) {
      res.render('update', {
      	 title: 'Add Contact',
      	 layout: 'layouts/main-layout',
      	 errors: errors.array(),
      	 contact: req.body,
      })
    } else {
		updateContact(nama, noHP, email, oldEmail);
		req.flash('msg', 'Data contact berhasil diubah');
		res.redirect('/contact');
    }
})

app.get('/contact/:email', (req, res) => {
	const contact = findContact(req.params.email);
	
	res.render('detail', {
		title: 'Halaman Contact',
		layout: 'layouts/main-layout',
		contact,
	})
})



app.get('/product/:id', (req, res) => {
	res.send(`ID = ${req.params.id}`)
})


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

