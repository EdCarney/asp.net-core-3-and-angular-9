using System;
using System.Linq.Dynamic.Core;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace WorldCities.Models.Data
{
	public class ApiResult<T>
	{
        public List<T> Data { get; private set; }

        public int PageIndex { get; private set; }

        public int PageSize { get; private set; }

		public int TotalCount { get; private set; }

        public int TotalPages { get; private set; }

        public string SortColumn { get; private set; }

        public string SortOrder { get; private set; }

        public string FilterColumn { get; private set; }

        public string FilterQuery { get; private set; }

        public bool HasPreviousPage => PageIndex > 0;

        public bool HasNextPage => PageIndex + 1 < TotalPages;

        public static async Task<ApiResult<T>> CreateAsync(
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            if (IsValidProperty(filterColumn))
            {
                source = GetFilteredSource(source, filterColumn, filterQuery);
            }

            if (IsValidProperty(sortColumn))
            {
                source = GetSortedSource(source, sortColumn, sortOrder);
            }

            List<T> data = await source
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            int count = await source.CountAsync();

            return new ApiResult<T>(data, count, pageIndex, pageSize, sortColumn, sortOrder, filterColumn, filterQuery);
        }

        private static bool IsValidProperty(string sortColumn)
        {
            if (string.IsNullOrEmpty(sortColumn))
            {
                return false;
            }

            var prop = typeof(T).GetProperty(
                sortColumn,
                BindingFlags.IgnoreCase |
                BindingFlags.Public |
                BindingFlags.Instance);

            if (prop is null)
            {
                throw new NotSupportedException($"Property {sortColumn} does not exist");
            }

            return true;
        }

        private static IQueryable<T> GetFilteredSource(IQueryable<T> source, string filterColumn, string filterQuery)
        {
            return source.Where($"{filterColumn}.Contains(@0)", filterQuery);
        }

        private static IQueryable<T> GetSortedSource(IQueryable<T> source, string sortColumn, string sortOrder)
        {
            sortOrder = !string.IsNullOrEmpty(sortOrder) && sortOrder.Equals("ASC", StringComparison.OrdinalIgnoreCase)
                ? "ASC"
                : "DESC";

            return source.OrderBy($"{sortColumn} {sortOrder}");
        }

        private ApiResult(List<T> data, int count, int pageIndex, int pageSize, string sortColumn, string sortOrder, string filterColumn, string filterQuery)
		{
            Data = data;
            PageIndex = pageIndex;
            PageSize = pageSize;
            SortColumn = sortColumn;
            SortOrder = sortOrder;
            FilterColumn = filterColumn;
            FilterQuery = filterQuery;
            TotalCount = count;
            TotalPages = (int)Math.Ceiling((double)TotalCount / (double)PageSize);
		}
	}
}

