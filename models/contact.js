const mongoose 	= require('mongoose')
const Schema 	= mongoose.Schema

const contactsSchema = new Schema ({
	name: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	noHP: {
		type: String,
		require: true
	}
}, { timestamp: true })

const Contact = mongoose.model('Contact', contactsSchema)
module.exports = Contact