// eslint-disable-next-line import/prefer-default-export
export function prepareVariables({
  query,
  pageInfo,
  totalCount,
  page,
  perPage,
  tags,
  start,
  next,
  previous,
  end,
}) {
  const newPage = page || query.page;
  const newPerPage = perPage || query.perPage;
  const newTags = tags || query.tags;
  if (start || tags || perPage) {
    return { page: 1, perPage: newPerPage, first: newPerPage, tags: newTags };
  }
  if (next) {
    const { endCursor: after } = pageInfo;
    return {
      page: newPage,
      perPage: newPerPage,
      first: newPerPage,
      after,
      tags: newTags,
    };
  }
  if (previous) {
    const { startCursor: before } = pageInfo;
    return {
      page: newPage,
      perPage: newPerPage,
      last: newPerPage,
      before,
      tags: newTags,
    };
  }
  if (end) {
    const remaining = totalCount % newPerPage;
    return {
      page: newPage,
      perPage: newPerPage,
      last: remaining,
      tags: newTags,
    };
  }
  return {
    page: newPage,
    perPage: newPerPage,
    first: newPerPage,
    tags: newTags,
  };
}
