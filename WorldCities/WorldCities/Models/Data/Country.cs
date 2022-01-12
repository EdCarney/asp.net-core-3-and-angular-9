using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
namespace WorldCities.Models.Data
{
    public class Country
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
        /// A list containing all citites related to the country
        /// </summary>
        [JsonIgnore]
        public virtual List<City> Cities { get; set; } = new();

        [NotMapped]
        public int TotalCities
        { 
            get => Cities.Any() ? Cities.Count() : _totalCities;
            set => _totalCities = value;
        }

        private int _totalCities = 0;
    }
}
