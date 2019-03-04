const shortid = require('shortid')
const { isEmpty, omit, get } = require('lodash')
const { OK, NOT_FOUND, CREATED, NO_CONTENT, BAD_REQUEST } = require('http-status')

const { PRODUCTS, CAMPAIGNS, SOURCES, SHORT_ID_CHARACTERS } = require('../utils/constants')
const {
  badRequest,
  indexValidator,
  initPaginationValue,
  validateProductCreateRequest,
  validateRequestBody
} = require('../helpers/helpers')
const paginate = require('../helpers/paginate')
const { API } = SOURCES

const Product = require('../models/product')
const Campaign = require('../models/campaign')

class ProductsController {
  constructor() {
    this.productsRepo = Product
    this.campaignsRepo = Campaign
    shortid.characters(SHORT_ID_CHARACTERS)
  }

  async createDummyData(ctx) {
    try {
      await this.productsRepo.createProductsDummy(PRODUCTS)
      await this.campaignsRepo.createCampaignsDummy(CAMPAIGNS)
    } catch (e) {
      ctx.body = e.message
      return
    }
    ctx.status = 204
  }

  async index(ctx) {
    let pagination = null
    let products
    const conditions = indexValidator(ctx)
    if (ctx.status === BAD_REQUEST) return

    const { page, pageSize } = initPaginationValue(ctx.query)

    try {
      products = await this.productsRepo.getAllProducts(page, pageSize, conditions)
      pagination = paginate(page, pageSize, products.count)
    } catch (e) {
      ctx.body = e.message
      return
    }

    if (products && !isEmpty(products)) {
      ctx.body = { docs: products, pagination }
      ctx.status = OK
    } else {
      ctx.body = []
    }
  }

  async show(ctx) {
    const { id } = ctx.params
    let product = null

    try {
      product = await this.productsRepo.getProductById(id)
    } catch (e) {
      ctx.body = e.message
    }

    if (!product) return (ctx.status = NOT_FOUND)

    ctx.body = product
  }

  async create(ctx) {
    let product = null
    let body = ctx.request.body
    const productId = shortid.generate()

    validateProductCreateRequest(ctx)
    if (ctx.status === BAD_REQUEST) return

    body = { productId, ...body }

    try {
      body.source = API
      product = await this.productsRepo.createProduct(body)

      ctx.body = { ...omit(product.toObject(), ['_id', '__v']) }
      ctx.status = CREATED
    } catch (e) {
      ctx.body = e.message
    }
  }

  async update(ctx) {
    const productId = ctx.params.id
    const productDoc = ctx.request.body

    validateRequestBody(productDoc)

    try {
      await this.validateUpdateOrDeleteRequest(ctx)
      if (ctx.status === BAD_REQUEST) return

      await this.productsRepo.updateProduct(productId, productDoc)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }
    ctx.status = NO_CONTENT
  }

  async destroy(ctx) {
    const productId = ctx.params.id

    try {
      await this.validateUpdateOrDeleteRequest(ctx)
      if (ctx.status === BAD_REQUEST) return

      await this.productsRepo.deleteProduct(productId)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }

    ctx.status = NO_CONTENT
  }

  async findCampaigns(ctx) {
    const { id } = ctx.params
    let campaign
    let status = null

    if (ctx.query.status) {
      status = ctx.query.status
    }

    try {
      campaign = await this.campaignsRepo.getCampaignByProductId(id, status)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }

    if (campaign && !isEmpty(campaign)) {
      ctx.body = campaign
      ctx.status = OK
    } else {
      ctx.status = NOT_FOUND
    }
  }

  async validateUpdateOrDeleteRequest(ctx) {
    const productId = ctx.params.id

    try {
      if (!(await this.productsRepo.isDuplicate(productId))) return badRequest(ctx, 'Invalid ProductId')
      if (!isEmpty(await this.campaignsRepo.getCampaignByProductId(productId, 'active')))
        return badRequest(ctx, "Can't update or delete a product with active campaign")
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }
  }
}

module.exports = ProductsController
