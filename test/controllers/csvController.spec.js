const { expect } = require('chai')
const chai = require('chai')

const endpoint = require('../../app.js')
const Campaign = require('../../models/campaign')
const Product = require('../../models/product')

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

  it('imports products and campaigns', async () => {
    const res = await chai
      .request(endpoint)
      .post('/csv')
      .type('form')
      .set({ 'content-type': 'multipart/form-data' })
      .attach('campaigns', 'test/fixtures/data_files/campaigns/campaigns.csv', 'campaigns.csv')
      .attach('products', 'test/fixtures/data_files/products/products.csv', 'products.csv')

    expect(res).to.have.status(204)

    const products = await Product.getAllProducts()
    const campaigns = await Campaign.getAllCampaigns()

    expect(products).to.have.length(3)
    expect(products).to.have.length(3)
    expect(campaigns[0].toObject()).to.containSubset({ source: 'import' })
    expect(products[0].toObject()).to.containSubset({ source: 'import' })
  })
})
