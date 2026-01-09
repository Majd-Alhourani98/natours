const getPaginationMetaData = (schema) => {
  schema.statics.getPaginationMetaData = async function (
    filter = {},
    page = 1,
    limit = 12,
  ) {
    const totalDocs = await this.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);

    const hasNextPage = page * limit < totalDocs;
    const hasPrevPage = page > 1;

    return {
      totalDocs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      currentPage: page,
    };
  };
};

module.exports = getPaginationMetaData;
