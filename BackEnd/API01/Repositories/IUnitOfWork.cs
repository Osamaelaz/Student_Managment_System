using API02.Models;
using API02.Repositories;

namespace API02.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Student> Students { get; }
        IGenericRepository<Department> Departments { get; }
        int Complete();
    }
}