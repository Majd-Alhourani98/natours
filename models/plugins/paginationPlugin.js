const paginationPlugin = (schema) => {
  // Prevent double-application of the plugin
  if (schema.statics.getPaginationMetadata) return;

  schema.statics.getPaginationMetadata = async function ({
    filter = {},
    page = 1,
    limit = 12,
    estimated = false,
  }) {
    // 1. Safety Guards (Prevent division by zero or negative pages)
    const safeLimit = Math.max(Number(limit) || 12, 1);
    const safePage = Math.max(Number(page) || 1, 1);

    // 2. Count Logic (Optimized for performance)
    // Use estimated count ONLY if there are no filters (search/filter/etc)
    const isFilterEmpty = Object.keys(filter).length === 0;

    let totalDocs;
    if (estimated && isFilterEmpty) {
      totalDocs = await this.estimatedDocumentCount();
    } else {
      totalDocs = await this.countDocuments(filter);
    }

    // 3. Calculation Logic
    const totalPages = Math.ceil(totalDocs / safeLimit) || 0;

    // UI Helpers: "Showing 13 - 24 of 100"
    const pagingCounter = totalDocs === 0 ? 0 : (safePage - 1) * safeLimit + 1;
    const toItem = totalDocs === 0 ? 0 : Math.min(safePage * safeLimit, totalDocs);

    return {
      totalDocs,
      totalPages,
      currentPage: safePage,
      limit: safeLimit,
      pagingCounter,
      toItem,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
      nextPage: safePage < totalPages ? safePage + 1 : null,
      prevPage: safePage > 1 ? safePage - 1 : null,
    };
  };
};

module.exports = paginationPlugin;
