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

        public DbSet<JobMatch> JobMatches => Set<JobMatch>();

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

            modelBuilder.Entity<JobMatch>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.JobTitle).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Company).HasMaxLength(200).IsRequired();
                entity.Property(e => e.MatchPercentage).HasPrecision(5, 2);
                entity.Property(e => e.Salary).HasMaxLength(100);
                entity.Property(e => e.Location).HasMaxLength(200);
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("New");
                entity.Property(e => e.ExternalJobId).HasMaxLength(100);
                entity.Property(e => e.JobUrl).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("datetime('now')");
            });
        }
    }
}
