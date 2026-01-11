const pagination = schema => {
  schema.statics.getPaginationMetaData = async function (paginationInfo, mongoFilter) {
    const { page, limit } = paginationInfo;

    let totalDocs;
    if (Object.keys(mongoFilter) > 0) {
      totalDocs = await this.countDocuments(mongoFilter);
    } else {
      totalDocs = await this.estimatedDocumentCount(mongoFilter);
    }

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
