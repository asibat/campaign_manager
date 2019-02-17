const { omit, cloneDeep } = require('lodash')
const { expect } = require('chai')
const chai = require('chai')

const campaigns = require('../fixtures/campaigns')
const campaign = campaigns[0]

const products = require('../fixtures/products')
const product = products[0]
const { productId } = product

const endpoint = require('../../app.js')
const Campaign = require('../../models/campaign')
const Product = require('../../models/product')

chai.use(require('chai-http'))
chai.use(require('chai-subset'))

describe('ProductsController', function() {
  beforeEach(async () => {
    await Campaign.deleteAll()
    await Product.deleteAll()
  })

  describe('SHOW /products/:id', function() {
    it('returns 404 for none existing product', async () => {
      const res = await chai.request(endpoint).get('/products/none-existing-id')

      expect(res).to.have.status(404)
    })

    it('returns the product', async () => {
      await Product.createProduct(product)
      const res = await chai.request(endpoint).get(`/products/${productId}`)

      expect(res).to.have.status(200)
      expect(res.body).to.deep.equal(product)
    })
  })

  describe('INDEX /products', function() {
    it('returns all products', async () => {
      await Product.bulkInsert(products)

      const res = await chai.request(endpoint).get('/products')

      expect(res).to.have.status(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.equal(35)
    })

    it('returns empty array when collection is empty', async () => {
      const res = await chai.request(endpoint).get('/products')

      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res.body).to.be.an('array')
      expect(res.body).to.be.empty
    })
  })

  describe('CREATE /products', function() {
    it('creates product', async () => {
      const newProduct = { ...omit(product, ['productId']) }
      await Product.createProduct(product)

      const res = await chai
        .request(endpoint)
        .post('/products')
        .send(newProduct)

      expect(res).to.have.status(201)
      expect(res.body).to.containSubset(newProduct)
    })

    it('should return error if empty body', async () => {
      const res = await chai
        .request(endpoint)
        .post('/products')
        .send({})

      expect(res).to.have.status(400)
      expect(res.text).to.equal('request body is empty')
    })

    it('should return error if no name provided', async () => {
      const productWithNoName = { ...omit(product, ['name']) }

      const res = await chai
        .request(endpoint)
        .post('/products')
        .send(productWithNoName)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('mandatory fields are {name, company}')
    })

    it('should return error if no company Name provided', async () => {
      const productWithNoCompany = { ...omit(campaign, ['company']) }

      const res = await chai
        .request(endpoint)
        .post('/products')
        .send(productWithNoCompany)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('mandatory fields are {name, company}')
    })
  })

  describe('PUT /products', function() {
    it('updates product', async () => {
      await Product.createProduct(product)

      expect(
        await chai
          .request(endpoint)
          .put(`/products/${productId}`)
          .send({ name: 'updated ProductName' })
      ).to.have.status(204)

      const updatedProduct = await Product.getProductById(productId)
      expect(updatedProduct.toObject()).to.containSubset({ name: 'updated ProductName' })
    })

    it('should return error if empty body', async () => {
      await Product.createProduct(product)
      const res = await chai
        .request(endpoint)
        .put(`/products/${productId}`)
        .send({})

      expect(res).to.have.status(400)
      expect(res.text).to.equal('request body is empty')
    })

    it('should return error if productId does not exist', async () => {
      const res = await chai
        .request(endpoint)
        .put(`/products/${productId}`)
        .send({ name: 'bla bla' })

      expect(res).to.have.status(400)
      expect(res.text).to.equal('Invalid ProductId')
    })
  })

  describe('DESTROY /products', function() {
    const newProduct = cloneDeep(product)
    const newCampaign = cloneDeep(campaign)

    it('deletes product', async () => {
      await Product.createProduct(newProduct)

      const res = await chai.request(endpoint).del(`/products/${productId}`)

      expect(res).to.have.status(204)
    })

    it('returns 400 for not existing product', async () => {
      const res = await chai.request(endpoint).del(`/products/blabla`)

      expect(res).to.have.status(400)
      expect(res.text).to.equal('Invalid product id')
    })

    it('returns bad request if campaign is active', async () => {
      await Product.createProduct(newProduct)
      await Campaign.createCampaign(newCampaign)

      const res = await chai.request(endpoint).del(`/products/${productId}`)

      expect(res).to.have.status(400)
      expect(res.text).to.equal("Can't Delete a product with active campaign")
    })
  })
})
