'use strict'

const Route = use('Route')

Route.get('filtersAdm', 'Filters/FilterAdmController.filter')

Route.get('filtersProdutor', 'Filters/FilterProdutorController.filter')

Route.get('filtersGroup', 'Filters/FilterGroupController.filter')

Route.get('filtersCategory', 'Filters/FilterCategoryController.filter')
