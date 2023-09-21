import {fastify} from 'fastify'
// import {DatabaseMemory} from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify()
// const database = new DatabaseMemory()
const database = new DatabasePostgres()

server.get('/', () => {
    return 'Hello World!'
})

server.get('/node', () => {
    return 'Hello Node.js!'
})

server.get('/videos', (request) => {
    const search = request.query.search

    return database.list(search)
})

server.post('/videos', async (request, reply) => {
    const { title, description, duration} = request.body

    await database.create({
        title,
        description,
        duration
    })

    console.log(database.list())

    return reply.status(201).send()
})

server.put('/videos/:id', async (request, reply) => {
    const videoId = request.params.id
    const { title, description, duration} = request.body

    await database.update(videoId, {
        title,
        description,
        duration
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', (request, reply) => {
    const videoId = request.params.id

    database.delete(videoId)

    return reply.status(204).send()

})


server.listen({
    port: 3332
})