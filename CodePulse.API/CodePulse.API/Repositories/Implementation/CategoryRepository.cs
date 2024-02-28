using CodePulse.API.Models.Domain;
using CodePulse.API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Repositories.Implementation;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext dbContext;

    public CategoryRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    public async Task<Category> Create(Category category)
    {
        await dbContext.Categories.AddAsync(category);
        await dbContext.SaveChangesAsync();

        return category;
    }

    public async Task<Category?> Delete(Guid id)
    {
        var category = await dbContext.Categories.FirstOrDefaultAsync(x => x.Id == id);
        if (category is null)
        {
            return null;
        }

        dbContext.Categories.Remove(category);
        await dbContext.SaveChangesAsync();

        return category;
    }

    public async Task<Category?> Get(Guid id)
    {
        return await dbContext.Categories.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<Category>> GetAll()
    {
        return await dbContext.Categories.ToListAsync();
    }

    public async Task<Category?> Update(Category category)
    {
        var existingCategory = await dbContext.Categories.FirstOrDefaultAsync(x => x.Id == category.Id);
        if (existingCategory is null)
        {
            return null;
        }

        dbContext.Entry(existingCategory).CurrentValues.SetValues(category);
        await dbContext.SaveChangesAsync();

        return category;
    }
}
