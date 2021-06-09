const fs = require('fs');

const dirPath = './file';
if (!fs.existsSync(dirPath)) {
	fs.mkdirSync(dirPath);
}

const dataPath = './file/contacts.json';
if (!fs.existsSync(dataPath)) {
	fs.writeFileSync('file/contacts.json', '[]', 'utf-8');
}

const loadContact = () => {
	const fileBuffer = fs.readFileSync('file/contacts.json', 'utf-8');
	const contacts = JSON.parse(fileBuffer);
	return contacts;
}

const findContact = (email) => {
	const contacts = loadContact();
	const contact = contacts.find(
		(contact) => contact.email.toLowerCase() === email.toLowerCase()
	);

	return contact;
}

const saveContacts = (contacts) => {
	fs.writeFileSync('file/contacts.json', JSON.stringify(contacts));
}

const addContact = (nama, noHP, email) => {
	const contact = {nama, noHP, email};
	const contacts = loadContact();

	contacts.push(contact);
	saveContacts(contacts);
}


const cekDuplikat = (email) => {
	const contacts = loadContact();
	return contacts.find((data) => data.email.toLowerCase() === email.toLowerCase());
}

const deleteContact = (email) => {
	const contacts = loadContact();
	const newContact = contacts.filter((data) => data.email.toLowerCase() != email.toLowerCase())

	saveContacts(newContact);
}

const updateContact = (nama, noHP, email, oldEmail) => {
	const contacts = loadContact();

	const filteredContacts = contacts.filter((data) => data.email.toLowerCase() != oldEmail.toLowerCase());

	const newContact = { nama, noHP, email};
	filteredContacts.push(newContact);
	saveContacts(filteredContacts);

}


module.exports = {
	loadContact, 
	findContact,
	addContact,
	deleteContact,
	cekDuplikat,
	updateContact
}