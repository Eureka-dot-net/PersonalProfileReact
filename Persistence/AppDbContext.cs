using Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<AboutMe> AboutMe => Set<AboutMe>();

        public DbSet<Experience> Experiences => Set<Experience>();

        public DbSet<SkillCategory> SkillCategories => Set<SkillCategory>();

        public DbSet<Skill> Skills => Set<Skill>();

        public DbSet<Project> Projects => Set<Project>();

        public DbSet<PromptTemplate> PromptTemplates => Set<PromptTemplate>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AboutMe>(entity =>
            {
                entity.OwnsOne(e => e.FullName);
                entity.OwnsOne(e => e.Bio);
                entity.OwnsOne(e => e.Location);
            });

            modelBuilder.Entity<SkillCategory>()
                .HasMany(sc => sc.Skills)
                .WithOne(s => s.SkillCategory)
                .HasForeignKey(s => s.SkillCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Experience>()
                .Property(e => e.Highlights)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null)!)
                .HasColumnType("TEXT");
        }
    }
}
