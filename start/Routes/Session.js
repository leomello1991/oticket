'use strict'

const Route = use('Route')

Route.resource('sessions', 'Session/SessionController')
  .apiOnly()

Route.post('login', 'Session/SessionController.login')

Route.get('usersInformation', 'Session/SessionController.routeController')
