using CodePulse.API.Helpers;
using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers;


[ApiController]
[Route("api/[controller]/[action]")]
public class BlogPostController : ControllerBase
{
    private readonly IBlogPostRepository blogPostRepository;
    private readonly ICategoryRepository categoryRepository;

    public BlogPostController(IBlogPostRepository blogPostRepository, ICategoryRepository categoryRepository)
    {
        this.blogPostRepository = blogPostRepository;
        this.categoryRepository = categoryRepository;
    }

    [HttpPost]
    [Authorize(Roles = AuthRoles.Writer)]
    public async Task<IActionResult> Create(BlogPostRequestDto request)
    {
        // Convert DTO to Domain 
        var blogPost = new BlogPost
        {
            Author = request.Author,
            Content = request.Content,
            FeaturedImageUrl = request.FeaturedImageUrl,
            IsVisible = request.IsVisible,
            PublishedDate = request.PublishedDate,
            ShortDescription = request.ShortDescription,
            Title = request.Title,
            UrlHandle = request.UrlHandle,
            Categories = new List<Category>()
        };

        foreach (var category in request.Categories)
        {
            var existingCategory = await categoryRepository.Get(category);
            if (existingCategory is not null)
            {
                blogPost.Categories.Add(existingCategory);
            }
        }

        await blogPostRepository.Create(blogPost);
        return Ok(request);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var blogPosts = await blogPostRepository.GetAll();

        // Convert domain model to DTO
        var response = blogPosts.Select(blogPost => new BlogPostResponseDto()
        {
            Id = blogPost.Id,
            Author = blogPost.Author,
            Content = blogPost.Content,
            FeaturedImageUrl = blogPost.FeaturedImageUrl,
            IsVisible = blogPost.IsVisible,
            PublishedDate = blogPost.PublishedDate,
            ShortDescription = blogPost.ShortDescription,
            Title = blogPost.Title,
            UrlHandle = blogPost.UrlHandle,
            Categories = blogPost.Categories?.Select(x => new CategoryResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                UrlHandle = x.UrlHandle
            }).ToList()
        }).ToList();

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var blogPost = await blogPostRepository.Get(id);
        if (blogPost is null)
        {
            return NotFound();
        }

        var response = new BlogPostResponseDto
        {
            Id = blogPost.Id,
            Author = blogPost.Author,
            Content = blogPost.Content,
            FeaturedImageUrl = blogPost.FeaturedImageUrl,
            IsVisible = blogPost.IsVisible,
            PublishedDate = blogPost.PublishedDate,
            ShortDescription = blogPost.ShortDescription,
            Title = blogPost.Title,
            UrlHandle = blogPost.UrlHandle,
            Categories = blogPost.Categories?.Select(x => new CategoryResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                UrlHandle = x.UrlHandle
            }).ToList()
        };

        return Ok(response);
    }

    [HttpGet("{urlHandle}")]
    public async Task<IActionResult> Get(string urlHandle)
    {
        var blogPost = await blogPostRepository.Get(urlHandle);
        if (blogPost is null)
        {
            return NotFound();
        }

        var response = new BlogPostResponseDto
        {
            Id = blogPost.Id,
            Author = blogPost.Author,
            Content = blogPost.Content,
            FeaturedImageUrl = blogPost.FeaturedImageUrl,
            IsVisible = blogPost.IsVisible,
            PublishedDate = blogPost.PublishedDate,
            ShortDescription = blogPost.ShortDescription,
            Title = blogPost.Title,
            UrlHandle = blogPost.UrlHandle,
            Categories = blogPost.Categories?.Select(x => new CategoryResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                UrlHandle = x.UrlHandle
            }).ToList()
        };

        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = AuthRoles.Writer)]
    public async Task<IActionResult> Update(Guid id, BlogPostRequestDto request)
    {
        // Convert DTO to domain model
        var blogPost = new BlogPost
        {
            Id = id,
            Title = request.Title,
            ShortDescription = request.ShortDescription,
            Content = request.Content,
            FeaturedImageUrl = request.FeaturedImageUrl,
            UrlHandle = request.UrlHandle,
            PublishedDate = request.PublishedDate,
            Author = request.Author,
            IsVisible = request.IsVisible,
            Categories = new List<Category>()
        };

        foreach (var category in request.Categories)
        {
            var existingCategory = await categoryRepository.Get(category);
            if (existingCategory is not null)
            {
                blogPost.Categories.Add(existingCategory);
            }
        }
        var updatedBlogPost = await blogPostRepository.Update(blogPost);
        if (updatedBlogPost == null)
        {
            return NotFound();
        }
        return Ok(request);
    }


    [HttpDelete("{id:guid}")]
    [Authorize(Roles = AuthRoles.Writer)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deletedBlogPost = await blogPostRepository.Delete(id);
        if (deletedBlogPost is null)
        {
            return NotFound();
        }

        // Convert Domain model to DTO
        var response = new BlogPostResponseDto
        {
            Id = deletedBlogPost.Id,
            Author = deletedBlogPost.Author,
            Content = deletedBlogPost.Content,
            FeaturedImageUrl = deletedBlogPost.FeaturedImageUrl,
            IsVisible = deletedBlogPost.IsVisible,
            PublishedDate = deletedBlogPost.PublishedDate,
            ShortDescription = deletedBlogPost.ShortDescription,
            Title = deletedBlogPost.Title,
            UrlHandle = deletedBlogPost.UrlHandle,
        };
        return Ok(response);
    }
}
