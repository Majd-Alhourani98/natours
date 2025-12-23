function paginationMeta(schema) {
  schema.statics.getPaginationMeta = async function ({ filter, page = 1, limit = 12 }) {
    page = Math.max(1, Number(page));
    limit = Math.min(Number(limit), 100);

    const totalDocs = await this.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit) || 1;

    return {
      totalDocs,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  };
}

module.exports = paginationMeta;
