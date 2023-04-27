const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })

    person.save()
        .then(() => { console.log(`added ${name} ${number} to phonebook`) })
        .catch(err => { console.error(err) })
        .finally(() => { mongoose.connection.close() })

}
else {

    Person.find({}).then(res => {
        res.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
    })
        .catch(err => { console.error(err) })
        .finally(() => { mongoose.connection.close() })

}