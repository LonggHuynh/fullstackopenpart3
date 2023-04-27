const express = require('express')
const app = express()
const Person = require('./model/Person')
const cors = require('cors')
const morgan = require('morgan')

app.use(morgan('tiny'))


app.use(express.json())
app.use(express.static('build'))
app.use(cors())


morgan.token('payload', (req) => ((req.method === 'POST') ? JSON.stringify(req.body) : ''))



app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'))

app.get('/info', async (req, res, next) => {
    console.log('Hello')
    try {
        const len = await Person.find({}).then(result => result.length)
        const content = `
            <p>Phonebook has info for ${len} people</p>
            <p>${new Date()}</p>`
        res.end(content)
    } catch (err) {
        next(err)
    }
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(result => res.json(result))
        .catch(err => next(err))
})

app.get('/api/persons/:id', async (req, res, next) => {
    try {
        let { id } = req.params

        const person = await Person.findById(id)
        if (person)
            res.json(person)
        else
            res.status(404).json({ msg: 'Not found' })
    } catch (err) {
        next(err)
    }
})

app.delete('/api/persons/:id', async (req, res, next) => {
    let { id } = req.params

    try {
        const person = await Person.findByIdAndDelete(id)
        if (person)
            res.status(204).end()
        else
            res.status(404).json({ msg: 'Not found' })
    } catch (err) {
        next(err)
    }
})

app.put('/api/persons/:id', async (req, res, next) => {
    let { id } = req.params
    try {
        const updatedPerson = req.body

        const person = await Person.findByIdAndUpdate(id, updatedPerson, { new: true, runValidators: true })
        if (!person) {
            res.status(404).json({ msg: 'Not found' })
            return
        }

        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

app.post('/api/persons', async (req, res, next) => {
    try {
        console.log(req.body)
        const addedPerson = req.body
        if (!addedPerson.name || !addedPerson.number) {
            res.status(400).json({ msg: 'Something is missing' })
            return
        }

        const personInDb = await Person.findOne({ name: addedPerson.name })
        if (personInDb) {
            throw new Error('Person already added')
        }
        const person = new Person(addedPerson)
        const newPerson = await person.save()
        res.json(newPerson)
    } catch (err) {

        next(err)
    }
})

const errorHandler = (err, req, res, next) => {
    console.error(1)
    if (err.name === 'CastError' && err.kind === 'ObjectId')
        res.status(400).json({ msg: 'malformatted id' })
    else
        res.status(400).json({ msg: err.message })
    next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on ${PORT} `))
