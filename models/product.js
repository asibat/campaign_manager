const mongoose = require('mongoose')

const PRODUCT_VALIDATION_ERRORS = {
  productIdMustNotBeEmpty: 'Product ID cannot be empty',
  productIdMustNotContainUnderscores: 'Product ID cannot contain underscores',
  productNameMustNotBeEmpty: 'Product name must not be empty',
  productMustNameMustBeUnique: 'Product with that name already exists',
  productIdAlreadyTaken: 'Product must have a unique Id'
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2
    },
    productId: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    source: {
      type: String,
      trim: true,
      required: true
    },
    company: {
      type: String,
      trim: true,
      minlength: 2,
      required: true
    }
  },
  { collection: 'products' }
)

productSchema.index({ productId: 1 })

// Instance methods
productSchema.methods = {}

// Static methods
productSchema.statics = {
  createProductsDummy: async function(products) {
    return await this.create(products)
  },
  bulkInsert: async function(products) {
    return await this.insertMany(products)
  },
  createProduct: async function(product) {
    if (await this.isDuplicate(product.productId)) {
      throw new Error(PRODUCT_VALIDATION_ERRORS.productIdAlreadyTaken)
    }

    return await this.create(product)
  },
  getProductById: async function(productId, projection = { _id: 0 }) {
    return await this.findOne({ productId }, projection).select('-__v')
  },
  getAllProducts: async function(page = 1, pageSize = 2, conditions = {}) {
    const skip = (page - 1) * pageSize

    const products = await this.find(conditions, { _id: 0 })
      .skip(skip)
      .limit(pageSize)
      .sort('name')
      .select('-__v')

    const count = await this.find(conditions).count()
    return { products, count }
  },
  isDuplicate: async function(productId) {
    return !!(await this.findOne({ productId }))
  },
  updateProduct: async function(productId, productDoc) {
    return await this.updateOne({ productId }, productDoc)
  },
  deleteProduct: async function(productId) {
    return await this.deleteOne({ productId })
  },
  deleteAll: async function() {
    return await this.deleteMany({})
  }
}

const Product = mongoose.model('Product', productSchema)

module.exports = Product
