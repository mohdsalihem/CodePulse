using CodePulse.API.Data;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> userManager;
    private readonly AuthDbContext authDbContext;
    private readonly ITokenRepository tokenRepository;

    public AuthController(UserManager<IdentityUser> userManager, AuthDbContext authDbContext, ITokenRepository tokenRepository)
    {
        this.userManager = userManager;
        this.authDbContext = authDbContext;
        this.tokenRepository = tokenRepository;
    }

    [HttpPost]
    public async Task<IActionResult> Register(AuthRequestDto request)
    {
        // Create IdentityUser object
        var user = new IdentityUser
        {
            UserName = request.Email.Trim(),
            Email = request.Email.Trim(),
        };

        using var transaction = await authDbContext.Database.BeginTransactionAsync();
        try
        {
            var identityResult = await userManager.CreateAsync(user, request.Password);
            if (!identityResult.Succeeded)
            {
                if (identityResult.Errors.Any())
                {
                    identityResult.Errors.ToList().ForEach(error =>
                    {
                        ModelState.AddModelError("user", error.Description);
                    });

                }
                return ValidationProblem(ModelState);
            }

            // Add role to user (Reader role)
            identityResult = await userManager.AddToRoleAsync(user, "Reader");

            if (!identityResult.Succeeded)
            {
                if (identityResult.Errors.Any())
                {
                    identityResult.Errors.ToList().ForEach(error =>
                    {
                        ModelState.AddModelError("user", error.Description);
                    });

                }
                return ValidationProblem(ModelState);
            }
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

        return StatusCode(StatusCodes.Status201Created);
    }


    [HttpPost]
    public async Task<IActionResult> Login(AuthRequestDto request)
    {
        var identityUser = await userManager.FindByEmailAsync(request.Email);
        if (identityUser is null)
        {
            ModelState.AddModelError("", "Email or Password incorrect");
            return ValidationProblem(ModelState);
        }

        var checkPasswordResult = await userManager.CheckPasswordAsync(identityUser, request.Password);
        if (checkPasswordResult is false)
        {
            ModelState.AddModelError("", "Email or Password incorrect");
            return ValidationProblem(ModelState);
        }

        var roles = await userManager.GetRolesAsync(identityUser);
        var jwtToken = tokenRepository.CreateJwtToken(identityUser, roles.ToList());

        // Create Token and response
        var response = new AuthResponseDto
        {
            Email = request.Email,
            Roles = roles.ToList(),
            Token = jwtToken
        };
        return Ok(response);
    }
}
