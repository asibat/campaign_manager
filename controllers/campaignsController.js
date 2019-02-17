const shortid = require('shortid')
const { isEmpty, omit } = require('lodash')
const { OK, NOT_FOUND, BAD_REQUEST, CREATED, NO_CONTENT } = require('http-status')

const {
  SOURCES,
  SHORT_ID_CHARACTERS,
  CAMPAIGN_STATUS,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE
} = require('../utils/constants')
const { API } = SOURCES
const { ACTIVE, ARCHIVED, PENDING } = CAMPAIGN_STATUS

const Campaign = require('../models/campaign')
const Product = require('../models/product')
const paginate = require('../helpers/paginate')

const campaignStatuses = [ACTIVE, ARCHIVED, PENDING]

class CampaignsController {
  constructor() {
    this.campaignsRepo = Campaign
    this.productsRepo = Product
    shortid.characters(SHORT_ID_CHARACTERS)
  }

  async index(ctx) {
    let campaigns = null
    let pagination = null
    let conditions = {}
    const { status, source } = ctx.query

    try {
      if (status) {
        if (!campaignStatuses.includes(status)) return this.badRequest(ctx, 'Invalid status')
        conditions['status'] = status
      }
      if (source) {
        if (!['api', 'import'].includes(source)) return this.badRequest(ctx, 'Invalid source filter')
        conditions['source'] = source
      }
      const page = parseInt(ctx.query.page) || DEFAULT_PAGE_NUMBER
      const pageSize = parseInt(ctx.query.pageSize) || DEFAULT_PAGE_SIZE

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
    let body = ctx.request.body
    let product = null
    let campaign = null

    if (!body || isEmpty(body)) return this.badRequest(ctx, 'request body is empty')

    const { product: productId, name, startDate, endDate } = body
    if (!productId || !startDate || !endDate || !name)
      return this.badRequest(ctx, 'mandatory fields are {name, product, startDate, endDate}')

    const campaignId = shortid.generate()

    try {
      body.source = API
      product = await this.productsRepo.getProductById(productId)

      if (product && !isEmpty(product)) {
        body = { campaignId, ...body }
        campaign = await this.campaignsRepo.createCampaign(body)
      } else {
        return this.badRequest(ctx, 'Product does not exist!')
      }
      ctx.body = { ...omit(campaign.toObject(), ['_id', '__v']) }
      ctx.status = CREATED
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }
  }

  async update(ctx) {
    const campaignId = ctx.params.id

    const campaignDoc = ctx.request.body

    if (!campaignDoc || isEmpty(campaignDoc)) return this.badRequest(ctx, 'request body is empty')

    try {
      if (!(await this.campaignsRepo.isDuplicate(campaignId))) return this.badRequest(ctx, 'Invalid Campaign Id')

      if (await this.campaignsRepo.isActive(campaignId)) {
        return this.badRequest(ctx, "Can't update active campaigns")
      }
      if (campaignDoc.hasOwnProperty('product')) {
        const { product: productId } = campaignDoc

        if (!(await this.productsRepo.isDuplicate(productId))) {
          return this.badRequest(ctx, 'Invalid Product Id')
        }
      }
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
      if (!(await this.campaignsRepo.isDuplicate(campaignId))) return this.badRequest(ctx, 'Invalid campaign id')
      const isActive = await this.campaignsRepo.isActive(campaignId)
      if (isActive) {
        return this.badRequest(ctx, "Can't delete active campaigns")
      }

      await this.campaignsRepo.deleteCampaign(campaignId)
    } catch (e) {
      ctx.body = e.message
      ctx.status = 500
    }
    ctx.status = NO_CONTENT
  }

  badRequest(ctx, errors = '') {
    ctx.status = BAD_REQUEST
    ctx.body = errors
  }
}

module.exports = CampaignsController
