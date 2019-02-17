const { expect } = require('chai')
const chai = require('chai')

const products = require('../fixtures/products')
const product = products[0]

const Campaign = require('../../models/campaign')
const Product = require('../../models/product')

const endpoint = require('../../app.js')

chai.use(require('chai-http'))
chai.use(require('chai-subset'))

describe('CSVController', function() {
  beforeEach(async () => {
    await Campaign.deleteAll()
    await Product.deleteAll()
  })

  it('returns 400 for a none multipart/form-data content-type', async () => {
    const res = await chai.request(endpoint).post('/csv')

    expect(res).to.have.status(400)
    expect(res.text).to.equal('content-type must be multipart/form-data')
  })

  it('returns 400 when no file is uploaded', async () => {
    const res = await chai
      .request(endpoint)
      .post('/csv')
      .type('form')
      .set({ 'content-type': 'multipart/form-data' })

    expect(res).to.have.status(400)
    expect(res.text).to.equal('Could not find attached files')
  })

  it('returns 400 when the csv file has wrong or missing headers', async () => {
    const res = await chai
      .request(endpoint)
      .post('/csv')
      .type('form')
      .set({ 'content-type': 'multipart/form-data' })
      .attach('products', 'test/fixtures/data_files/bad_headers.csv', 'bad_headers.csv')

    expect(res).to.have.status(400)
    expect(res.text).to.equal('Wrong or missing csv file headers row.')
  })

  it('imports products', async () => {
    const res = await chai
      .request(endpoint)
      .post('/csv')
      .type('form')
      .set({ 'content-type': 'multipart/form-data' })
      .attach('products', 'test/fixtures/data_files/products/products.csv', 'products.csv')

    expect(res).to.have.status(204)

    const docs = await Product.getAllProducts()

    expect(docs.count).to.eq(3)
    expect(docs.products[0]).to.containSubset({ source: 'import' })
  })

  it('imports campaigns', async () => {
    await Product.bulkInsert(products)

    const res = await chai
      .request(endpoint)
      .post('/csv')
      .type('form')
      .set({ 'content-type': 'multipart/form-data' })
      .attach('campaigns', 'test/fixtures/data_files/campaigns/campaigns.csv', 'campaigns.csv')

    expect(res).to.have.status(204)

    const campaigns = await Campaign.getAllCampaigns()

    expect(campaigns.count).to.eq(3)
    expect(campaigns.campaigns[0]).to.containSubset({ source: 'import' })
  })

  it('campaigns csv file has invalid content', async () => {
    const res = await chai
      .request(endpoint)
      .post('/csv')
      .type('form')
      .set({ 'content-type': 'multipart/form-data' })
      .attach('campaigns', 'test/fixtures/data_files/campaigns/invalid_content.csv', 'invalid_content.csv')

    expect(res).to.have.status(400)
    expect(res.error.text).to.equal('Campaign has Invalid ProductId')
  })
})
