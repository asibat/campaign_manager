const { BAD_REQUEST } = require('http-status')
const { isEmpty } = require('lodash')

const { CAMPAIGN_STATUS, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } = require('../utils/constants')
const { ACTIVE, ARCHIVED, PENDING } = CAMPAIGN_STATUS

const campaignStatuses = [ACTIVE, ARCHIVED, PENDING]

const indexValidator = ctx => {
  let conditions = {}
  const { status, source } = ctx.query

  if (status) {
    if (!campaignStatuses.includes(status)) return badRequest(ctx, 'Invalid status')
    conditions['status'] = status
  }

  if (source) {
    if (!['api', 'import'].includes(source)) return badRequest(ctx, 'Invalid source filter')
    conditions['source'] = source
  }

  return conditions
}

const validateProductCreateRequest = ctx => {
  validateRequestBody(ctx)
  let body = ctx.request.body

  if (!body.hasOwnProperty('company') || !body.hasOwnProperty('name'))
    return badRequest(ctx, 'mandatory fields are {name, company}')
}

const validateRequestBody = ctx => {
  const body = ctx.request.body

  if (!body || isEmpty(body)) return badRequest(ctx, 'request body is empty')
}

const badRequest = (ctx, errors = '') => {
  ctx.status = BAD_REQUEST
  ctx.body = errors
}

const initPaginationValue = query => ({
  page: parseInt(query.page) || DEFAULT_PAGE_NUMBER,
  pageSize: parseInt(query.pageSize) || DEFAULT_PAGE_SIZE
})

module.exports = {
  indexValidator,
  initPaginationValue,
  validateRequestBody,
  validateProductCreateRequest,
  badRequest
}
