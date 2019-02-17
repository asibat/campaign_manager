const router = require('koa-router')()
const ProductsController = require('./controllers/productsController')
const CampaignsController = require('./controllers/campaignsController')
const CsvController = require('./controllers/csvController')

const productsController = new ProductsController()
const campaignsController = new CampaignsController()
const csvController = new CsvController()

// DUMMY DATA
router.post('/dummyData', ctx => productsController.createDummyData(ctx))

// PRODUCTS
router.get('/products', ctx => productsController.index(ctx))
router.get('/products/:id', ctx => productsController.show(ctx))
router.get('/products/:id/campaigns', ctx => productsController.findCampaigns(ctx))

router.post('/products', ctx => productsController.create(ctx))
router.put('/products/:id', ctx => productsController.update(ctx))
router.del('/products/:id', ctx => productsController.destroy(ctx))

// CAMPAIGNS
router.get('/campaigns', ctx => campaignsController.index(ctx))
router.get('/campaigns/:id', ctx => campaignsController.show(ctx))

router.post('/campaigns', ctx => campaignsController.create(ctx))
router.put('/campaigns/:id', ctx => campaignsController.update(ctx))
router.del('/campaigns/:id', ctx => campaignsController.destroy(ctx))

// CSV IMPORT
router.post('/csv', ctx => csvController.process(ctx))

module.exports = router
