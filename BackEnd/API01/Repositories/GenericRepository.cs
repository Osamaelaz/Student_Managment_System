using API02.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API02.Repositories
{
    public class GenericRepository<T>(ITIContext db) : IGenericRepository<T> where T : class
    {
        protected readonly ITIContext _db = db;
        private readonly DbSet<T> _set = db.Set<T>();

        public IEnumerable<T> GetAll() => _set.ToList();
        public T? GetById(int id) => _set.Find(id);
        public void Add(T entity) => _set.Add(entity);
        public void Update(T entity) => _db.Entry(entity).State = EntityState.Modified;
        public void Delete(T entity) => _set.Remove(entity);
        public bool Any() => _set.Any();
        public int Max(Expression<Func<T, int>> selector) => _set.Max(selector);

    }
}