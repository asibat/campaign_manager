const shortid = require('shortid')
const { isEmpty, omit } = require('lodash')
const { OK, NOT_FOUND, BAD_REQUEST, CREATED, NO_CONTENT } = require('http-status')

const { SOURCES, SHORT_ID_CHARACTERS } = require('../utils/constants')
const { badRequest, indexValidator, initPaginationValue, validateRequestBody } = require('../helpers/helpers')
const paginate = require('../helpers/paginate')
const { API } = SOURCES

const Campaign = require('../models/campaign')
const Product = require('../models/product')

class CampaignsController {
  constructor() {
    this.campaignsRepo = Campaign
    this.productsRepo = Product
    shortid.characters(SHORT_ID_CHARACTERS)
  }

  async index(ctx) {
    let campaigns, pagination
    const conditions = indexValidator(ctx)
    if (ctx.status === BAD_REQUEST) return

    const { page, pageSize } = initPaginationValue(ctx.query)

    try {
      campaigns = await this.campaignsRepo.getAllCampaigns(page, pageSize, conditions)
      pagination = paginate(page, pageSize, campaigns.count)
    } catch (e) {
      ctx.body = e.message
    }

    if (campaigns && !isEmpty(campaigns)) {
      ctx.body = { docs: campaigns, pagination }
      ctx.status = OK
    } else {
      ctx.body = []
    }
  }

  async show(ctx) {
    const { id } = ctx.params
    let campaign = null

    try {
      campaign = await this.campaignsRepo.getCampaignById(id)
    } catch (e) {
      ctx.body = e.message
    }

    if (!campaign) return (ctx.status = NOT_FOUND)

    ctx.body = campaign
  }

  async create(ctx) {
    let campaign
    const campaignId = shortid.generate()
    const body = await this.validateCampaignCreation(ctx, campaignId)
    if (ctx.status === BAD_REQUEST) return

    body.source = API
    try {
      campaign = await this.campaignsRepo.createCampaign(body)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }

    ctx.body = { ...omit(campaign.toObject(), ['_id', '__v']) }
    ctx.status = CREATED
  }

  async update(ctx) {
    const campaignId = ctx.params.id
    const campaignDoc = ctx.request.body

    validateRequestBody(campaignDoc)
    try {
      await this.validateUpdateOrDeleteRequest(ctx)
      if (ctx.status === BAD_REQUEST) return

      await this.campaignsRepo.updateCampaign(campaignId, campaignDoc)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }
    ctx.status = NO_CONTENT
  }

  async destroy(ctx) {
    const campaignId = ctx.params.id

    try {
      await this.validateUpdateOrDeleteRequest(ctx)
      if (ctx.status === BAD_REQUEST) return
      await this.campaignsRepo.deleteCampaign(campaignId)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }
    ctx.status = NO_CONTENT
  }

  async validateUpdateOrDeleteRequest(ctx) {
    const campaignId = ctx.params.id
    const campaignDoc = ctx.request.body

    try {
      if (!(await this.campaignsRepo.isDuplicate(campaignId))) {
        return badRequest(ctx, 'Invalid Campaign Id')
      }

      if (await this.campaignsRepo.isActive(campaignId)) {
        return badRequest(ctx, "Can't update or delete active campaigns")
      }
      if (campaignDoc && campaignDoc.hasOwnProperty('product')) {
        const { product: productId } = campaignDoc

        if (!(await this.productsRepo.isDuplicate(productId))) {
          return badRequest(ctx, 'Invalid Product Id')
        }
      }
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }
  }

  async validateCampaignCreation(ctx, campaignId) {
    let body = ctx.request.body
    let product

    validateRequestBody(ctx)

    const { product: productId, name, startDate, endDate } = body
    if (!productId || !startDate || !endDate || !name)
      return badRequest(ctx, 'mandatory fields are {name, product, startDate, endDate}')

    try {
      product = await this.productsRepo.getProductById(productId)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }

    if (product && !isEmpty(product)) {
      body = { campaignId, ...body }
    } else {
      return badRequest(ctx, 'Product does not exist!')
    }
    return body
  }
}

module.exports = CampaignsController
