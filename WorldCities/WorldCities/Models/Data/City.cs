using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace WorldCities.Models.Data
{
    public class City
    {
        /// <summary>
        /// Unique ID and primary key for the city
        /// </summary>
        [Key]
        [Required]
        public int Id { get; set; }

        /// <summary>
        /// City name (in UTF8 format)
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// City name (in ASCII format)
        /// </summary>
        public string Name_ASCII { get; set; } = string.Empty;

        /// <summary>
        /// City latitude
        /// </summary>
        [Column(TypeName = "decimal(7, 4)")]
        public decimal Lat { get; set; }

        /// <summary>
        /// City longitude
        /// </summary>
        [Column(TypeName = "decimal(7, 4)")]
        public decimal Lon { get; set; }

        /// <summary>
        /// Country ID (foreign key)
        /// </summary>
        [ForeignKey("Country")]
        public int CountryId { get; set; }

        /// <summary>
        /// The parent country related to this city
        /// </summary>
        [JsonIgnore]
        public virtual Country Country { get; set; } = new();

        /// <summary>
        /// Name of the parent country related to this city
        /// </summary>
        [NotMapped]
        public string CountryName { get; set; } = string.Empty;
    }
}
