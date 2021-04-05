import { SessionController } from './session.controller.js'

class WsCookieParser {
  onConnection (socket, request) {
    if (request.cookies.session) {
      /**
       * Initializes a WebSocket socket with authenticated user.
       *
       * Parse session cookie content and assign user ID on to the socket.
       *
       * WARNING: This is DANGEROUS! We are using untrusted content from the browser.
       *
       * TODO: Use secure JWT payload instead of untrusted content.
       *
       * NOTE: Common 'cookie-parser' didn't parse the cookie and did not yet
       * investigate why.
       */
      const payload = JSON.parse(request.cookies.session)

      socket.user = payload.user
    } else {
      socket.user = null
    }
  }
}

export class SessionExtension {
  static services = {
    'session.cookie.parser': WsCookieParser
  }

  static listeners = {
    'session.cookie.parser': [
      ['connection', 'onConnection']
    ]
  }

  static routes = [
    {
      path: '/api/login',
      name: 'session.login',
      methods: ['POST']
    },
    {
      path: '/api/session',
      name: 'session.status',
      methods: ['GET']
    }
  ]

  static controllers = {
    session: SessionController
  }
}
