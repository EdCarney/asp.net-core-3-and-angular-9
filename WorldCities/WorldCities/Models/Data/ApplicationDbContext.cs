using System;
using Microsoft.EntityFrameworkCore;

namespace WorldCities.Models.Data
{
	public class ApplicationDbContext : DbContext
	{
		public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }

        public ApplicationDbContext() : base()
        {
            if (Cities is null || Countries is null)
            {
                throw new ArgumentNullException("DbSets must be initialized");
            }   
        }

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
            if (Cities is null || Countries is null)
            {
                throw new ArgumentNullException("DbSets must be initialized");
            }
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

