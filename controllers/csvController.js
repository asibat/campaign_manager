const shortid = require('shortid')
const parseCSV = require('csv-parse/lib/sync')
const fs = require('mz/fs')
const { isEmpty, get } = require('lodash')
const { NO_CONTENT, BAD_REQUEST } = require('http-status')

const { SOURCES, SHORT_ID_CHARACTERS } = require('../utils/constants')
const { IMPORT } = SOURCES

const Product = require('../models/product')
const Campaign = require('../models/campaign')

class CsvController {
  constructor() {
    this.productsRepo = Product
    this.campaignsRepo = Campaign
    shortid.characters(SHORT_ID_CHARACTERS)
  }
  async process(ctx) {
    if (!this.validateCsvParams(ctx)) return

    const files = ctx.request.files
    const csvData = {}

    for (let key in files) {
      csvData[key] = await this.getDataFromCSVFile(files[key].path)

      if (!this.validateCsvContent(ctx, csvData[key], key)) return
    }
    const transformedData = this.transformCsvData(csvData)
    const { products = [], campaigns = [] } = transformedData
    try {
      // products are written first, in order not to invalid campaigns import process
      if (products && !isEmpty(products)) {
        await this.productsRepo.bulkInsert(products)
      }
      if (campaigns && !isEmpty(campaigns)) {
        for (let campaign of campaigns) {
          const { product: productId } = campaign
          if (!(await this.productsRepo.isDuplicate(productId)))
            return this.badRequest(ctx, 'Campaign has Invalid ProductId')
        }
        await this.campaignsRepo.bulkInsert(campaigns)
      }
    } catch (e) {
      ctx.body = e.message
      return
    }

    ctx.status = NO_CONTENT
  }

  transformProductContent(products) {
    return products.reduce((transformedProducts, [name, company]) => {
      const productId = shortid.generate()
      const productObject = { name, company, productId }
      productObject['source'] = IMPORT
      transformedProducts.push(productObject)
      return transformedProducts
    }, [])
  }

  transformCampaignContent(campaigns) {
    return campaigns.reduce((transformedCampaigns, [name, product, startDate, endDate]) => {
      const campaignId = shortid.generate()
      const campaignObject = { name, product, campaignId, startDate, endDate }

      campaignObject['source'] = IMPORT
      transformedCampaigns.push(campaignObject)
      return transformedCampaigns
    }, [])
  }

  transformCsvData(csvData) {
    let transformedData = {}

    if (!isEmpty(csvData)) {
      if (csvData.hasOwnProperty('products')) {
        const products = csvData['products']
        products.splice(0, 1)
        transformedData['products'] = this.transformProductContent(products)
      }
      if (csvData.hasOwnProperty('campaigns')) {
        const campaigns = csvData['campaigns']
        campaigns.splice(0, 1)
        transformedData['campaigns'] = this.transformCampaignContent(campaigns)
      }
    }
    return transformedData
  }

  validateCsvContent(ctx, csvData, key) {
    const csvHeaders = csvData[0]
    let validHeader = true

    switch (key) {
      case 'products':
        validHeader = csvHeaders[0] === 'name' && csvHeaders[1] === 'company'
        break
      case 'campaigns':
        validHeader =
          csvHeaders[0] === 'name' &&
          csvHeaders[1] === 'product' &&
          csvHeaders[2] === 'startDate' &&
          csvHeaders[3] === 'endDate'
    }
    if (!(Array.isArray(csvHeaders) && validHeader)) {
      this.badRequest(ctx, 'Wrong or missing csv file headers row.')
      return false
    }

    return true
  }

  validateCsvParams(ctx) {
    if (
      !ctx.request.headers['content-type'] ||
      !ctx.request.headers['content-type'].startsWith('multipart/form-data')
    ) {
      this.badRequest(ctx, 'content-type must be multipart/form-data')
      return false
    }

    if (isEmpty(get(ctx.request, 'files'))) {
      this.badRequest(ctx, 'Could not find attached files')
      return false
    }

    return true
  }

  async getDataFromCSVFile(filePath) {
    let content = await fs.readFile(filePath, 'utf8')
    content = this.removeBOM(content)

    const parseOptions = {
      skip_empty_lines: true,
      skip_lines_with_empty_values: true
    }
    return parseCSV(content, parseOptions)
  }

  removeBOM(str) {
    return str.replace(/\uFEFF/g, '')
  }

  badRequest(ctx, errors = '') {
    ctx.status = BAD_REQUEST
    ctx.body = errors
  }
}

module.exports = CsvController
