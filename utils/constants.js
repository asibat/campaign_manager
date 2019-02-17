const SOURCES = {
  API: 'api',
  IMPORT: 'import'
}

const CAMPAIGN_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  ARCHIVED: 'archived'
}

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 2

const SHORT_ID_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~'
const MONGO_URL = 'mongodb://localhost:27017/manager'
const MONGO_TEST_URL = 'mongodb://localhost:27017/manager_test'

module.exports = {
  SOURCES,
  CAMPAIGN_STATUS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER,
  SHORT_ID_CHARACTERS,
  MONGO_URL,
  MONGO_TEST_URL
}
