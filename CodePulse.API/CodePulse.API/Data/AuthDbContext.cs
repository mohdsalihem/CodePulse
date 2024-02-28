using CodePulse.API.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Data;

public class AuthDbContext : IdentityDbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var readerRoleId = "c4936558-accd-47a5-a303-fe0b06a54f7f";
        var writerRoleId = "c977c316-a6c7-4a64-b23a-e401604c4b0d";

        // Create Reader and Writer Roles
        var roles = new List<IdentityRole>()
        {
            new()
            {
                Id = readerRoleId,
                Name = AuthRoles.Reader,
                NormalizedName = AuthRoles.Reader.ToUpper(),
                ConcurrencyStamp = readerRoleId
            },
            new()
            {
                Id = writerRoleId,
                Name = AuthRoles.Writer,
                NormalizedName = AuthRoles.Writer.ToUpper(),
                ConcurrencyStamp = writerRoleId
            }
        };
        builder.Entity<IdentityRole>().HasData(roles);

        // Create an Admin User
        var adminUserId = "fa93c87e-9517-4a53-937b-2b332440f900";
        var admin = new IdentityUser()
        {
            Id = adminUserId,
            UserName = "admin@codepulse.com",
            NormalizedUserName = "admin@codepulse.com".ToUpper(),
            Email = "admin@codepulse.com",
            NormalizedEmail = "admin@codepulse.com".ToUpper()
        };
        admin.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(admin, "admin@123");
        builder.Entity<IdentityUser>().HasData(admin);

        // Give roles to Admin
        var adminRoles = new List<IdentityUserRole<string>>()
        {
            new()
            {
                UserId = adminUserId,
                RoleId = readerRoleId
            },
            new()
            {
                UserId = adminUserId,
                RoleId = writerRoleId
            }
        };
        builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);
    }
}
