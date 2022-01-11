using Newtonsoft.Json;
namespace WorldCities.Models.DTOs
{
    public class CountryDTO
    {
        /// <summary>
        /// Unique ID and primary key for the country
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Country name (in UTF8 format)
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Country code (in ISO 3166-1 ALPHA-2 format)
        /// </summary>
        [JsonProperty("iso2")]
        public string ISO2 { get; set; } = string.Empty;

        /// <summary>
        /// Country code (in ISO 3166-1 ALPHA-3 format)
        /// </summary>
        [JsonProperty("iso3")]
        public string ISO3 { get; set; } = string.Empty;

        /// <summary>
        /// The number of cities in the country
        /// </summary>
        public int TotalCities { get; set; }
    }
}
