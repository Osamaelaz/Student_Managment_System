using API02.DTO;
using API02.Models;
using API02.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API02.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StudentsController(IUnitOfWork uow, IMapper mapper) : ControllerBase
    {

        /// <summary>
        /// Retrieves all students.
        /// </summary>
        /// <returns>A list of all students.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/students
        ///
        /// </remarks>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<StudentDTO>), 200)]
        public IActionResult GetAll()
        {
            var students = uow.Students.GetAll();
            var result = mapper.Map<IEnumerable<StudentDTO>>(students);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves a single student by their ID.
        /// </summary>
        /// <param name="id">The unique ID of the student.</param>
        /// <returns>The student that matches the given ID.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/students/1
        ///
        /// </remarks>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(StudentDTO), 200)]
        [ProducesResponseType(404)]
        public IActionResult GetById(int id)
        {
            var student = uow.Students.GetById(id);
            if (student == null) return NotFound();

            var result = mapper.Map<StudentDTO>(student);
            return Ok(result);
        }

        /// <summary>
        /// Adds a new student. Accepts and returns JSON only.
        /// </summary>
        /// <param name="dto">The student DTO to create.</param>
        /// <returns>The newly created student.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/students
        ///     {
        ///         "st_Fname": "Osama",
        ///         "st_Lname": "Elazab",
        ///         "st_Address": "Mansoura",
        ///         "st_Age": 22,
        ///         "dept_Id": 10,
        ///     }
        ///
        /// </remarks>
        [HttpPost]
        [Consumes("application/json")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(StudentDTO), 201)]
        [ProducesResponseType(400)]
        public IActionResult Add([FromBody] StudentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var student = mapper.Map<Student>(dto);

            student.St_Id = uow.Students.Any()
                ? uow.Students.Max(s => s.St_Id) + 1
                : 1;

            uow.Students.Add(student);
            uow.Complete();

            var result = mapper.Map<StudentDTO>(student);
            return CreatedAtAction(nameof(GetById), new { id = student.St_Id }, result);
        }

        /// <summary>
        /// Updates an existing student by their ID.
        /// </summary>
        /// <param name="id">The ID of the student to update.</param>
        /// <param name="dto">The updated student data.</param>
        /// <returns>No content on success.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /api/students/1
        ///     {
        ///         "st_Fname": "Elsaid",
        ///         "st_Lname": "Elazab",
        ///         "st_Address": "Alexandria",
        ///         "st_Age": 23,
        ///         "dept_Id": 10,
        ///     }
        ///
        /// </remarks>
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult Update(int id, [FromBody] StudentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existing = uow.Students.GetById(id);
            if (existing == null) return NotFound();

            mapper.Map(dto, existing);

            uow.Complete();
            return NoContent();
        }

        /// <summary>
        /// Deletes a student by their ID.
        /// </summary>
        /// <param name="id">The ID of the student to delete.</param>
        /// <returns>No content on success.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /api/students/1
        ///
        /// </remarks>
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult Delete(int id)
        {
            var student = uow.Students.GetById(id);
            if (student == null) return NotFound();

            uow.Students.Delete(student);
            uow.Complete();
            return NoContent();
        }
    }
}