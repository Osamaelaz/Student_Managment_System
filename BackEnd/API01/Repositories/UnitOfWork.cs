using API02.Models;
using API02.Repositories;

namespace API02.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ITIContext _db;
        public IGenericRepository<Student> Students { get; }
        public IGenericRepository<Department> Departments { get; }
        public UnitOfWork(ITIContext db)
        {
            _db = db;
            Students = new GenericRepository<Student>(db);
            Departments = new GenericRepository<Department>(db);
        }

        public int Complete() => _db.SaveChanges();

        public void Dispose() => _db.Dispose();
    }
}