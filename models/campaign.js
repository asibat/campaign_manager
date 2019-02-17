const mongoose = require('mongoose')
const { isEmpty } = require('lodash')

const Product = require('./product')

const { CAMPAIGN_STATUS } = require('../utils/constants')

const { ACTIVE, ARCHIVED, PENDING } = CAMPAIGN_STATUS

const generateFilterConditions = status => {
  let conditions = {}
  const now = new Date()

  switch (status) {
    case ACTIVE:
      conditions['startDate'] = { $lte: now }
      conditions['endDate'] = { $gt: now }
      break
    case ARCHIVED:
      conditions['endDate'] = { $lt: now }
      break
    case PENDING:
      conditions['startDate'] = { $gt: now }
  }
  return conditions
}

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3
    },
    campaignId: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    product: {
      type: String,
      ref: 'Product',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    source: {
      type: String,
      trim: true,
      required: true
    }
  },
  { collection: 'campaigns' }
)

campaignSchema.index({ campaignId: 1 })

campaignSchema.pre('validate', function(next) {
  if (this.startDate > this.endDate) next(new Error('End Date must be greater than Start Date'))

  next()
})

campaignSchema.statics = {
  isValidCondition(conditions) {
    return conditions && !isEmpty(conditions)
  },
  bulkInsert: async function(campaigns) {
    return await this.insertMany(campaigns)
  },
  createCampaignsDummy: async function(campaigns) {
    return await this.create(campaigns)
  },
  createCampaign: async function(campaign) {
    return await this.create(campaign)
  },
  isActive: async function(campaignId) {
    const conditions = { campaignId, ...generateFilterConditions(ACTIVE) }

    return !isEmpty(await this.find(conditions))
  },
  getAllCampaigns: async function(page = 1, pageSize = 2, status = null, projection = { _id: 0 }) {
    const conditions = generateFilterConditions(status)
    const skip = (page - 1) * pageSize

    const campaigns = await this.find(conditions, projection)
      .skip(skip)
      .limit(pageSize)
      .sort('startDate')
      .select('-__v')

    const count = await this.find(conditions, projection).count()
    return { campaigns, count }
  },
  getCampaignById: async function(campaignId, projection = { _id: 0 }) {
    return await this.findOne({ campaignId }, projection).select('-__v')
  },
  getCampaignByProductId: async function(productId, status = null, projection = { _id: 0 }) {
    let conditions = { product: productId }

    if (status) {
      const filterConditions = generateFilterConditions(status)

      if (this.isValidCondition(filterConditions)) conditions = { ...conditions, ...filterConditions }
    }
    return await this.find(conditions, projection)
  },
  updateCampaign: async function(campaignId, campaignDon) {
    return await this.updateOne({ campaignId }, campaignDon)
  },
  deleteCampaign: async function(campaignId) {
    return await this.deleteOne({ campaignId })
  },
  deleteAll: async function() {
    return await this.deleteMany({})
  },
  isDuplicate: async function(campaignId) {
    return !!(await this.findOne({ campaignId }))
  }
}
const Campaign = mongoose.model('Campaign', campaignSchema)

module.exports = Campaign
