import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'

const VERSION = process.env.npm_package_version ?? '0.0.1'

const server = Fastify({
  logger: true,
})

server.register(helmet)
server.register(cors, { origin: '*' })
server.register(rateLimit, { max: 100, timeWindow: '1 minute' })

// Health — liveness probe
server.get('/health', async () => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: VERSION,
  }
})

// Ready — readiness probe (checks downstream connectivity)
server.get('/ready', async (_, reply) => {
  // TODO: add real DB + Redis checks on day 8
  const checks = {
    db: 'ok',
    redis: 'ok',
  }
  const healthy = Object.values(checks).every((v) => v === 'ok')
  reply.status(healthy ? 200 : 503)
  return { status: healthy ? 'ready' : 'not ready', checks }
})

// Metrics — Prometheus instrumentation placeholder (day 15)
server.get('/metrics', async (_, reply) => {
  reply.header('Content-Type', 'text/plain; version=0.0.4')
  return '# Prometheus metrics endpoint — instrumentation coming on day 15\n'
})

// Items CRUD stub
server.get('/api/v1/items', async () => {
  return [
    { id: '1', name: 'Vintage Camera' },
    { id: '2', name: 'Film Roll' },
  ]
})

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
