import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export function toPaginated<T, R>(
  page: PaginatedResponseDto<T>,
  mapItem: (item: T) => R,
) {
  return {
    data: page.data.map(mapItem),
    total: page.total,
    page: page.page,
    limit: page.limit,
    totalPages: page.totalPages,
    hasNextPage: page.hasNextPage,
  };
}
