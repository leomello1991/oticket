'use strict'

const Route = use('Route')

Route.post('passwords', 'ForgotPassword/ForgotPasswordController.store')

Route.put('passwords', 'ForgotPassword/ForgotPasswordController.update')

Route.get('passwords', 'ForgotPassword/ForgotPasswordController.testePassword')
