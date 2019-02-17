const { omit, cloneDeep } = require('lodash')
const { expect } = require('chai')
const chai = require('chai')

const campaigns = require('../fixtures/campaigns')
const campaign = campaigns[0]
const { campaignId } = campaign

const activeCampaigns = campaigns.slice(0, 1)
const pendingCampaigns = campaigns.slice(1, 2)
const archivedCampaigns = campaigns.slice(3, 5)

const products = require('../fixtures/products')
const product = products[0]

const endpoint = require('../../app.js')

const Campaign = require('../../models/campaign')
const Product = require('../../models/product')

chai.use(require('chai-http'))
chai.use(require('chai-subset'))

describe('CampaignsController', function() {
  beforeEach(async () => {
    await Campaign.deleteAll()
    await Product.deleteAll()
  })

  describe('SHOW /campaigns/:id', function() {
    it('returns 404 for none existing campaign', async () => {
      const res = await chai.request(endpoint).get('/campaigns/none-existing-id')

      expect(res).to.have.status(404)
    })

    it('returns the campaign', async () => {
      await Campaign.createCampaign(campaign)

      const res = await chai.request(endpoint).get(`/campaigns/${campaignId}`)

      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res.body).to.deep.equal(campaign)
    })
  })

  describe('INDEX /campaigns', function() {
    it('returns all campaigns', async () => {
      await Campaign.bulkInsert(campaigns)
      const res = await chai.request(endpoint).get('/campaigns')

      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res.body).to.be.an('array')
      expect(res.body).to.deep.equal(campaigns)
    })

    it('returns error if status is invalid query string', async () => {
      const res = await chai
        .request(endpoint)
        .get('/campaigns')
        .query({ status: 'amir' })

      expect(res).to.have.status(400)
      expect(res.text).to.equal('Invalid status')
    })

    it('returns all active campaigns', async () => {
      await Campaign.bulkInsert(campaigns)

      const res = await chai
        .request(endpoint)
        .get('/campaigns')
        .query({ status: 'active' })

      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res.body).to.be.an('array')
      expect(res.body).to.deep.equal(activeCampaigns)
    })

    it('returns all pending campaigns', async () => {
      await Campaign.bulkInsert(campaigns)

      const res = await chai
        .request(endpoint)
        .get('/campaigns')
        .query({ status: 'pending' })

      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res.body).to.be.an('array')
      expect(res.body).to.deep.equal(pendingCampaigns)
    })

    it('returns all archived campaigns', async () => {
      await Campaign.bulkInsert(campaigns)

      const res = await chai
        .request(endpoint)
        .get('/campaigns')
        .query({ status: 'archived' })

      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res.body).to.be.an('array')
      expect(res.body).to.containSubset(archivedCampaigns)
    })

    it('returns empty array when collection is empty', async () => {
      const res = await chai.request(endpoint).get('/campaigns')

      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.empty
    })
  })

  describe('CREATE /campaigns', function() {
    it('creates campaign', async () => {
      const { productId } = product
      const obj = {
        name: 'western union',
        product: '2250570',
        startDate: '2019-02-15T14:00:00.000Z',
        endDate: '2019-02-19T14:00:00.000Z'
      }
      await Product.createProduct(product)

      expect(
        await chai
          .request(endpoint)
          .post('/campaigns')
          .send(obj)
      ).to.have.status(201)

      const res = await Campaign.getCampaignByProductId(productId)

      expect(res[0].toObject()).to.containSubset({ name: obj.name, product: productId })
    })

    it('should return error if empty body', async () => {
      const res = await chai
        .request(endpoint)
        .post('/campaigns')
        .send({})

      expect(res).to.have.status(400)
      expect(res.text).to.equal('request body is empty')
    })

    it('should return error if no name provided', async () => {
      const campaignObject = { ...omit(campaign, ['name']) }

      const res = await chai
        .request(endpoint)
        .post('/campaigns')
        .send(campaignObject)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('mandatory fields are {name, product, startDate, endDate}')
    })

    it('should return error if no product provided', async () => {
      const campaignObject = { ...omit(campaign, ['product']) }

      const res = await chai
        .request(endpoint)
        .post('/campaigns')
        .send(campaignObject)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('mandatory fields are {name, product, startDate, endDate}')
    })

    it('should return error if no startDate and/or endDate provided', async () => {
      const campaignObject = { ...omit(campaign, ['endDate']) }

      const res = await chai
        .request(endpoint)
        .post('/campaigns')
        .send(campaignObject)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('mandatory fields are {name, product, startDate, endDate}')
    })

    it('should return error if provided product Does not exist', async () => {
      const campaignObject = { product: 'does-not-exits', ...omit(campaign, ['product']) }

      const res = await chai
        .request(endpoint)
        .post('/campaigns')
        .send(campaignObject)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('Product does not exist!')
    })
  })

  describe('PUT /campaigns', function() {
    it('updates campaign', async () => {
      campaign['startDate'] = '2018-05-15T07:00:00.000Z'
      campaign['endDate'] = '2018-06-15T07:00:00.000Z'

      await Product.createProduct(product)
      await Campaign.createCampaign(campaign)

      expect(
        await chai
          .request(endpoint)
          .put(`/campaigns/${campaignId}`)
          .send({ name: 'updated CampaignName' })
      ).to.have.status(204)

      const updatedProduct = await Campaign.getCampaignByProductId(campaign.product)
      expect(updatedProduct[0].toObject()).to.containSubset({ name: 'updated CampaignName' })
    })

    it('should return error if empty body', async () => {
      const res = await chai
        .request(endpoint)
        .put(`/campaigns/${campaignId}`)
        .send({})

      expect(res).to.have.status(400)
      expect(res.text).to.equal('request body is empty')
    })

    it('should return error if new provided product does not exist', async () => {
      campaign['startDate'] = '2018-05-15T07:00:00.000Z'
      campaign['endDate'] = '2018-06-15T07:00:00.000Z'
      campaign['name'] = 'test test'

      await Campaign.createCampaign(campaign)

      const res = await chai
        .request(endpoint)
        .put(`/campaigns/${campaignId}`)
        .send(campaign)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('Invalid Product Id')
    })
  })

  describe('DESTROY /campaigns', function() {
    const newCampaign = cloneDeep(campaign)

    it('deletes campaign', async () => {
      campaign['startDate'] = '2018-05-15T07:00:00.000Z'
      campaign['endDate'] = '2018-06-15T07:00:00.000Z'
      await Campaign.createCampaign(campaign)

      const res = await chai.request(endpoint).del(`/campaigns/${campaignId}`)

      expect(res).to.have.status(204)
    })
    it('returns 400 for not existing campaign', async () => {
      const res = await chai.request(endpoint).del(`/campaigns/${campaignId}`)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('Invalid campaign id')
    })

    it('returns bad request if campaign is active', async () => {
      await Campaign.createCampaign(newCampaign)

      const res = await chai.request(endpoint).del(`/campaigns/${campaignId}`)

      expect(res).to.have.status(400)
      expect(res.text).to.equal("Can't delete active campaigns")
    })
  })
})
