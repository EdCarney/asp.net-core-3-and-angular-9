using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using WorldCities.Models.Data;

namespace WorldCities.Controllers
{
    public class SeedController : Controller
    {
        private string DefaultSourcePath
            => Path.Combine(webHostEnvironment.ContentRootPath, "Source/worldcities.xlsx");

        private readonly ApplicationDbContext applicationDbContext;
        private readonly IWebHostEnvironment webHostEnvironment;

        public SeedController(ApplicationDbContext applicationDbContext,
            IWebHostEnvironment webHostEnvironment)
        {
            // set EPPlus license
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            this.applicationDbContext = applicationDbContext;
            this.webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> Import(string? filePath = null)
        {
            filePath = string.IsNullOrEmpty(filePath) ? DefaultSourcePath : filePath;
            using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                using (var excelPackage = new ExcelPackage(stream))
                {
                    ExcelWorksheet firstSheet = excelPackage.Workbook.Worksheets.FirstOrDefault()
                        ?? throw new InvalidDataException("No worksheets in source excel data file");

                    var cells = GetRowsWithoutHeader(firstSheet);
                    await ImportNewCountriesFromRows(cells);
                    await ImportNewCitiesFromRows(cells);
                }
            }

            return Ok();
        }

        public async Task<IActionResult> UpdateTotalCityCount()
        {
            var countries = applicationDbContext.Countries.Include(c => c.Cities);

            foreach (var country in countries)
            {
                country.TotalCities = country.Cities.Count();
            }

            await applicationDbContext.SaveChangesAsync();
            return Ok();
        }

        private List<ExcelRange> GetRowsWithoutHeader(ExcelWorksheet worksheet)
        {
            int startRow = 2; // skipping header row 1
            int startCol = 1;
            int endRow = worksheet.Dimension.End.Row;
            int endCol = worksheet.Dimension.End.Column;

            var rows = new List<ExcelRange>();

            for (int curRow = startRow; curRow <= endRow; curRow++)
                rows.Add(worksheet.Cells[curRow, startCol, curRow, endCol]);

            return rows;
        }

        private async Task ImportNewCountriesFromRows(IEnumerable<ExcelRange> rows)
        {
            var existingCountries = applicationDbContext.Countries.ToList();

            var uniqueRows = rows
                .GroupBy(row => row.GetCellValue<string>(0, 4))
                .Select(group => group.First())
                .ToList();

            foreach (var row in uniqueRows)
            {
                if (!CountryPresentInDb(row, existingCountries))
                {
                    AddCountryToDbFromRow(row);
                }
            }
            
            await applicationDbContext.SaveChangesAsync();
        }

        private async Task ImportNewCitiesFromRows(IEnumerable<ExcelRange> rows)
        {
            var existingCities = applicationDbContext.Cities.ToList();
            var existingCountries = applicationDbContext.Countries.ToList();

            foreach (var row in rows)
            {
                if (!CityPresentInDb(row, existingCities))
                {
                    AddCityToDbFromRow(row, existingCountries);
                }
            }

            await applicationDbContext.SaveChangesAsync();
        }

        private bool CountryPresentInDb(ExcelRange row, List<Country> existingCountries)
        {
            var countryName = row.GetCellValue<string>(0, 4);

            var dbCountriesWithName = from country in existingCountries
                                    where country.Name == countryName
                                    select country;

            return dbCountriesWithName.Any();
        }


        private bool CityPresentInDb(ExcelRange row, List<City> existingCities)
        {
            string cityName = row.GetCellValue<string>(0,0);

            var dbCitiesWithName = from city in existingCities
                                   where city.Name == cityName
                                   select city;

            return dbCitiesWithName.Any();
        }

        private void AddCountryToDbFromRow(ExcelRange row)
        {
            var country = new Country
            {
                Name = row.GetCellValue<string>(0, 4),
                ISO2 = row.GetCellValue<string>(0, 5),
                ISO3 = row.GetCellValue<string>(0, 6)
            };
            applicationDbContext.Countries.Add(country);
        }

        private void AddCityToDbFromRow(ExcelRange row, IEnumerable<Country> countries)
        {
            Country country = GetCountryForCity(row, countries);
            var city = new City
            {
                Name = row.GetCellValue<string>(0, 0),
                Name_ASCII = row.GetCellValue<string>(0, 1),
                Lat = row.GetCellValue<decimal>(0, 2),
                Lon = row.GetCellValue<decimal>(0, 3),
                Country = country,
                CountryId = country.Id
            };
            applicationDbContext.Cities.Add(city);
        }

        private Country GetCountryForCity(ExcelRange row, IEnumerable<Country> countries)
        {
            string countryName = row.GetCellValue<string>(0, 4);
            Country country = countries.First(c => c.Name == countryName);
            return country;
        }
    }
}

