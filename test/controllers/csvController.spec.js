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

describe('CSVController', function() {})
