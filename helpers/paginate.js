module.exports = function pagination(page, pageSize, count) {
  pageSize = parseInt(pageSize) <= 100 ? parseInt(pageSize) : 100
  return {
    totalSize: parseInt(count),
    pageSize,
    pages: Math.ceil(count < pageSize ? 1 : count / pageSize),
    page: parseInt(page)
  }
}
