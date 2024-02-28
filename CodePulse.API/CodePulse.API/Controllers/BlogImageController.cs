using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class BlogImageController : ControllerBase
{
    private readonly IBlogImageRepository blogImageRepository;

    public BlogImageController(IBlogImageRepository blogImageRepository)
    {
        this.blogImageRepository = blogImageRepository;
    }

    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] BlogImageRequestDto request)
    {
        ValidateFileUpload(request.File);
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var blogImage = new BlogImage()
        {
            FileName = request.FileName,
            FileExtension = Path.GetExtension(request.File.FileName).ToLower(),
            Title = request.Title,
            DateCreated = DateTime.UtcNow
        };

        return Ok(await blogImageRepository.Upload(request.File, blogImage));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await blogImageRepository.GetAll());
    }

    private void ValidateFileUpload(IFormFile file)
    {
        var allowedExtensions = new List<string> { ".jpg", ".jpeg", ".png" };

        if (!allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
        {
            ModelState.AddModelError("file", "Unsupported file format");
        }

        if (file.Length > 10485760) // 10MB
        {
            ModelState.AddModelError("file", "File size cannot be more than 10MB");
        }
    }
}
