const pagination = schema => {
  schema.statics.getPaginateMetaData = async function (paginationInfo, mongoFilter) {
    const { page, limit } = paginationInfo;

    let totalDocs;

    if (Object.keys(mongoFilter).length > 0) {
      totalDocs = await this.countDocuments(mongoFilter);
    } else {
      totalDocs = await this.estimatedDocumentCount();
    }

    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      currentPage: page,
      totalPages,
      totalResults: totalDocs,
      resultsPerPage: limit,
      hasNextPage,
      hasPrevPage,
    };
  };
};

module.exports = pagination;
