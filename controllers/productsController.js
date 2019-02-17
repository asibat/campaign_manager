const shortid = require('shortid')
const { isEmpty, omit, get } = require('lodash')
const { OK, NOT_FOUND, BAD_REQUEST, CREATED, NO_CONTENT } = require('http-status')
const { SOURCES, SHORT_ID_CHARACTERS, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } = require('../utils/constants')

const PRODUCTS = require('../test/fixtures/products')
const CAMPAIGNS = require('../test/fixtures/campaigns')

const { API } = SOURCES

const Product = require('../models/product')
const Campaign = require('../models/campaign')
const paginate = require('../helpers/paginate')

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
    let products = null

    try {
      const page = parseInt(ctx.query.page) || DEFAULT_PAGE_NUMBER
      const pageSize = parseInt(ctx.query.pageSize) || DEFAULT_PAGE_SIZE

      products = await this.productsRepo.getAllProducts(page, pageSize)
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

    if (!body || isEmpty(body)) return this.badRequest(ctx, 'request body is empty')
    if (!body.hasOwnProperty('company') || !body.hasOwnProperty('name'))
      return this.badRequest(ctx, 'mandatory fields are {name, company}')
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

    if (!productId) return this.badRequest(ctx, 'A required input is missing: productId')
    if (!productDoc || isEmpty(productDoc)) return this.badRequest(ctx, 'request body is empty')

    try {
      if (!(await this.productsRepo.isDuplicate(productId))) return this.badRequest(ctx, 'Invalid ProductId')
      if (!isEmpty(await this.campaignsRepo.getCampaignByProductId(productId, 'active')))
        return this.badRequest(ctx, "Can't update a product with active campaign")
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
      if (!(await this.productsRepo.isDuplicate(productId))) return this.badRequest(ctx, 'Invalid product id')

      if (!isEmpty(await this.campaignsRepo.getCampaignByProductId(productId, 'active')))
        return this.badRequest(ctx, "Can't Delete a product with active campaign")

      await this.productsRepo.deleteProduct(productId)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }

    ctx.status = NO_CONTENT
  }

  async findCampaigns(ctx) {
    const { id } = ctx.params
    let campaign = null
    let status = null

    try {
      if (ctx.query.status) {
        status = ctx.query.status
      }
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

  badRequest(ctx, errors = '') {
    ctx.status = BAD_REQUEST
    ctx.body = errors
  }
}

module.exports = ProductsController
