using System;
namespace HealthCheck.Models
{
    public class HeaderConfig
    {
        public string CacheControl { get; set; } = string.Empty;

        public string Pragma { get; set; } = string.Empty;

        public string Expires { get; set; } = string.Empty;
    }
}

