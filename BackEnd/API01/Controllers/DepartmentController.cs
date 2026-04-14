using API02.DTO;
using API02.Models;
using API02.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace API02.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly ITIContext _db;

        public DepartmentController(IUnitOfWork uow, IMapper mapper, ITIContext db)
        {
            _uow = uow;
            _mapper = mapper;
            _db = db;
        }

        [HttpGet]
        [SwaggerOperation(
            Summary = "Retrieve all departments",
            Description = "Returns a complete list of all departments in the system."
        )]
        [SwaggerResponse(200, "List of departments retrieved successfully.", typeof(IEnumerable<DepartmentDTO>))]
        public IActionResult GetAll()
        {
            var departments = _uow.Departments.GetAll();
            var result = _mapper.Map<IEnumerable<DepartmentDTO>>(departments);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Retrieve a department by ID",
            Description = "Returns a single department matching the provided ID."
        )]
        [SwaggerResponse(200, "Department found and returned.", typeof(DepartmentDTO))]
        [SwaggerResponse(404, "No department found with that ID.")]
        public IActionResult GetById(int id)
        {
            var dept = _uow.Departments.GetById(id);
            if (dept == null) return NotFound();

            var result = _mapper.Map<DepartmentDTO>(dept);
            return Ok(result);
        }

        [HttpPost]
        [SwaggerOperation(
            Summary = "Add a new department",
            Description = "Creates a new department and persists it to the database."
        )]
        [SwaggerResponse(201, "Department created successfully.", typeof(DepartmentDTO))]
        [SwaggerResponse(400, "Invalid department data supplied.")]
        public IActionResult Add([FromBody] DepartmentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var dept = _mapper.Map<Department>(dto);

            dept.Dept_Id = _uow.Departments.Any()
                ? _uow.Departments.Max(d => d.Dept_Id) + 10
                : 1;

            _uow.Departments.Add(dept);
            _uow.Complete();

            var result = _mapper.Map<DepartmentDTO>(dept);
            return CreatedAtAction(nameof(GetById), new { id = dept.Dept_Id }, result);
        }

        [HttpPut("{id}")]
        [SwaggerOperation(
            Summary = "Update an existing department",
            Description = "Finds the department by ID and overwrites its fields with the supplied data."
        )]
        [SwaggerResponse(204, "Department updated successfully.")]
        [SwaggerResponse(404, "No department found with that ID.")]
        public IActionResult Update(int id, [FromBody] DepartmentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = _uow.Departments.GetById(id);
            if (existing == null) return NotFound();

            _mapper.Map(dto, existing);

            _uow.Complete();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Delete a department by ID",
            Description = "Permanently removes the department matching the provided ID."
        )]
        [SwaggerResponse(204, "Department deleted successfully.")]
        [SwaggerResponse(404, "No department found with that ID.")]
        public IActionResult Delete(int id)
        {
            var dept = _uow.Departments.GetById(id);
            if (dept == null) return NotFound();

            using var tx = _db.Database.BeginTransaction();

            try
            {
                var assignmentLinks = _db.DepartmentCourseAssignments
                    .Where(link => link.Dept_Id == id)
                    .ToList();

                if (assignmentLinks.Count > 0)
                {
                    _db.DepartmentCourseAssignments.RemoveRange(assignmentLinks);
                }

                var students = _db.Students
                    .Where(student => student.Dept_Id == id)
                    .ToList();

                foreach (var student in students)
                {
                    student.Dept_Id = null;
                }

                var instructors = _db.Instructors
                    .Where(instructor => instructor.Dept_Id == id)
                    .ToList();

                foreach (var instructor in instructors)
                {
                    instructor.Dept_Id = null;
                }

                if (dept.Dept_Manager.HasValue)
                {
                    dept.Dept_Manager = null;
                    dept.Manager_hiredate = null;
                }

                _db.Departments.Remove(dept);
                _db.SaveChanges();
                tx.Commit();

                return NoContent();
            }
            catch (DbUpdateException)
            {
                tx.Rollback();
                return Conflict("Cannot delete department because it is still referenced by related records.");
            }
        }
    }
}