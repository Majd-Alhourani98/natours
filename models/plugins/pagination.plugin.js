const pagination = schema => {
  schema.statics.getPaginationMetaData = async function (paginationInfo, mongoFilter) {
    const { page, limit } = paginationInfo;
    const totalDocs = await this.countDocuments(mongoFilter);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      totalDocs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
      limit,
    };
  };
};

module.exports = pagination;
