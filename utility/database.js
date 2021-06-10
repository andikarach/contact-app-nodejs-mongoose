const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

// const uri = '';
// const dbName = 'db_contact';


const uri = 'mongodb://127.0.0.1:27017';

const dbName = 'db_belajar';

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

client.connect((error, result) => {
	if (error) {
		return console.log(error)
	}
})

const db = client.db(dbName);

const show = () => {
	db
	.collection('mahasiswa').find().toArray()
	.then(result => { return result})
	.catch(err => { return err })
}


module.exports = { show }