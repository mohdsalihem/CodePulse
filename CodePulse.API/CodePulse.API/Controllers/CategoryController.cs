using CodePulse.API.Helpers;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryRepository categoryRepository;

    public CategoryController(ICategoryRepository categoryRepository)
    {
        this.categoryRepository = categoryRepository;
    }

    [HttpPost]
    [Authorize(Roles = AuthRoles.Writer)]
    public async Task<IActionResult> Create(CategoryRequestDto requestDto)
    {
        // Map DTO to domain model
        var category = new Category
        {
            Name = requestDto.Name,
            UrlHandle = requestDto.UrlHandle
        };

        await categoryRepository.Create(category);

        // Domain model to DTO
        var response = new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            UrlHandle = category.UrlHandle
        };

        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAll()
    {
        return Ok(await categoryRepository.GetAll());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Category>> Get(Guid id)
    {
        var category = await categoryRepository.Get(id);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AuthRoles.Writer)]
    public async Task<IActionResult> Update(Guid id, CategoryRequestDto request)
    {
        // Convert DTO to Domain model
        var category = new Category
        {
            Id = id,
            Name = request.Name,
            UrlHandle = request.UrlHandle
        };

        category = await categoryRepository.Update(category);
        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AuthRoles.Writer)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var category = await categoryRepository.Delete(id);
        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }
}
