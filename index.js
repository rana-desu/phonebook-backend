const express = require('express')
const morgan  = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (request, response) => (
    JSON.stringify(request.body)
))
app.use(morgan(':method :url :status :res[content-length] - : response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        return response.json(person)
    } else {
        return response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number for the person weren't provided."
        })
    } else if (alreadyExists(body.name)) {
        return response.status(400).json({
            error: "name already exists as an entry in the DB."
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateRandomId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    console.log('before delete', persons);
    
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    console.log('after delete:', persons)

    response.status(204).end()
})

app.get('/api/info', (request, response) => {
    const body = (
        `
        <p>Phonebook has info for: ${persons.length} people.</p>
        <p>At, ${new Date()}</p>
        `
    )

    response.send(body)
})

const alreadyExists = (personName) => {
    let exists = false

    persons.forEach(person => {
        if (person.name.toLowerCase().includes(personName.toLowerCase())) {
            exists = true
            return exists
        }
    })

    return exists
}

const generateRandomId = () => {
    const randomId = Math.floor(Math.random() * 1000)
    return randomId
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}

app.use(unknownEndpoint)

PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`)
})