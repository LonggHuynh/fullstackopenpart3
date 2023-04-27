const mongoose = require('mongoose')
const { Schema } = mongoose
require('dotenv').config()

const url = process.env.MONGODB_URI


mongoose.connect(url, { useNewUrlParser: true })
    .then(() => { console.log('Connected to mongo') })
    .catch(err => { console.log(err) })


const personSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: (num) => {
                // Regular expression to validate phone numbers
                return /^(\d{2,3}-)?\d{5,}$/.test(num)

            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
