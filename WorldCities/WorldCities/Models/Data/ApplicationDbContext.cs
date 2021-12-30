using System;
using Microsoft.EntityFrameworkCore;

namespace WorldCities.Models.Data
{
	public class ApplicationDbContext : DbContext
	{
		public DbSet<City> Citites { get; set; }
        public DbSet<Country> Countries { get; set; }

        public ApplicationDbContext() : base()
        {
        }

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
			base.OnModelCreating(modelBuilder);

			// map entity names to DB table names
			modelBuilder.Entity<City>().ToTable("Cities");
			modelBuilder.Entity<Country>().ToTable("Countries");
        }
	}
}

