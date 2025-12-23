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

// Mental Model (Very Important)
// Plugin = schema extender: Plugin function → receives schema → attaches things to schema

// “A Mongoose plugin always receives the schema because its job is to extend it. The methods added by the plugin receive only their own arguments and use this to access the model.”

// Aggregation
// Use $ before field names only in aggregation expressions ($group, $project, $addFields, $expr).
// Do NOT use $ before field names in query stages ($match, $sort, find).

// response format:
// envelope pattern
