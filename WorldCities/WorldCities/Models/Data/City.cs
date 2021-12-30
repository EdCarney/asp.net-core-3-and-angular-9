using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public string Name { get; set; }

        /// <summary>
        /// City name (in ASCII format)
        /// </summary>
        public string Name_ASCII { get; set; }

        /// <summary>
        /// City latitude
        /// </summary>
        public decimal Lat { get; set; }

        /// <summary>
        /// City longitude
        /// </summary>
        public decimal Lon { get; set; }

        /// <summary>
        /// Country ID (foreign key)
        /// </summary>
        [ForeignKey("Country")]
        public int CountryId { get; set; }

        /// <summary>
        /// The parent country related to this city
        /// </summary>
        public virtual Country Country { get; set; }
    }
}
