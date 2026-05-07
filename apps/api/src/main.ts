import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'

const server = Fastify({
  logger: true,
})

server.register(helmet)
server.register(cors, { origin: '*' })
server.register(rateLimit, { max: 100, timeWindow: '1 minute' })

server.get('/health', async () => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }
})

server.get('/api/v1/items', async () => {
  return [
    { id: '1', name: 'Vintage Camera' },
    { id: '2', name: 'Film Roll' },
  ]
})

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' })
    console.log('API is running on http://localhost:3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
