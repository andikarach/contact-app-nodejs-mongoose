const express = require('express');
const app = express();
const port = 5000;
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//Connect to mongodb
const mongoose = require('mongoose')
// const uri = 'mongodb://localhost:27017/db_contact';
const uri = 'mongodb+srv://user:DcNaqPCcC4qAKIpE@cluster0.gwjwd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
	.then( result => { console.log('Database connected') })
	.catch( err => { console.log('Database Error') })


const contactRoutes = require('./routes/contactRoutes')

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

// load contact routes

app.use(contactRoutes)


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

