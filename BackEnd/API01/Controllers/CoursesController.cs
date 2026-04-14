using API02.DTO;
using API02.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API02.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly ITIContext _db;

        public CoursesController(ITIContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var courses = _db.Courses
                .Select(c => new CourseDTO
                {
                    Crs_Id = c.Crs_Id,
                    Crs_Name = c.Crs_Name,
                    Crs_Duration = c.Crs_Duration,
                    Top_Id = c.Top_Id
                })
                .ToList();

            return Ok(courses);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var course = _db.Courses
                .Where(c => c.Crs_Id == id)
                .Select(c => new CourseDTO
                {
                    Crs_Id = c.Crs_Id,
                    Crs_Name = c.Crs_Name,
                    Crs_Duration = c.Crs_Duration,
                    Top_Id = c.Top_Id
                })
                .FirstOrDefault();

            if (course == null)
            {
                return NotFound();
            }

            return Ok(course);
        }

        [HttpPost]
        public IActionResult Add([FromBody] CourseDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var course = new Course
            {
                Crs_Id = _db.Courses.Any() ? _db.Courses.Max(c => c.Crs_Id) + 1 : 1,
                Crs_Name = dto.Crs_Name,
                Crs_Duration = dto.Crs_Duration,
                Top_Id = dto.Top_Id
            };

            _db.Courses.Add(course);
            _db.SaveChanges();

            dto.Crs_Id = course.Crs_Id;
            return CreatedAtAction(nameof(GetById), new { id = course.Crs_Id }, dto);
        }

        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] CourseDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var course = _db.Courses.Find(id);
            if (course == null)
            {
                return NotFound();
            }

            course.Crs_Name = dto.Crs_Name;
            course.Crs_Duration = dto.Crs_Duration;
            course.Top_Id = dto.Top_Id;
            _db.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var course = _db.Courses.Find(id);
            if (course == null)
            {
                return NotFound();
            }

            var studentLinks = _db.Stud_Courses.Where(sc => sc.Crs_Id == id).ToList();
            if (studentLinks.Count > 0)
            {
                _db.Stud_Courses.RemoveRange(studentLinks);
            }

            var instructorLinks = _db.Ins_Courses.Where(ic => ic.Crs_Id == id).ToList();
            if (instructorLinks.Count > 0)
            {
                _db.Ins_Courses.RemoveRange(instructorLinks);
            }

            _db.Courses.Remove(course);
            _db.SaveChanges();

            return NoContent();
        }

        [HttpPost("department/{deptId:int}/courses/{courseId:int}")]
        public IActionResult AddCourseToDepartment(int deptId, int courseId)
        {
            var departmentExists = _db.Departments.Any(d => d.Dept_Id == deptId);
            var courseExists = _db.Courses.Any(c => c.Crs_Id == courseId);

            if (!departmentExists || !courseExists)
            {
                return NotFound("Department or course not found.");
            }

            var assignmentExists = _db.DepartmentCourseAssignments
                .Any(dc => dc.Dept_Id == deptId && dc.Crs_Id == courseId);

            if (!assignmentExists)
            {
                _db.DepartmentCourseAssignments.Add(new DepartmentCourseAssignment
                {
                    Dept_Id = deptId,
                    Crs_Id = courseId
                });
            }

            var studentIds = _db.Students
                .Where(s => s.Dept_Id == deptId)
                .Select(s => s.St_Id)
                .ToList();

            var added = 0;
            foreach (var studentId in studentIds)
            {
                var exists = _db.Stud_Courses.Any(sc => sc.Crs_Id == courseId && sc.St_Id == studentId);
                if (exists)
                {
                    continue;
                }

                _db.Stud_Courses.Add(new Stud_Course
                {
                    Crs_Id = courseId,
                    St_Id = studentId,
                    Grade = null
                });
                added++;
            }

            _db.SaveChanges();
            return Ok(new
            {
                courseId,
                deptId,
                assignmentCreated = !assignmentExists,
                added
            });
        }

        [HttpDelete("department/{deptId:int}/courses/{courseId:int}")]
        public IActionResult RemoveCourseFromDepartment(int deptId, int courseId)
        {
            var assignment = _db.DepartmentCourseAssignments
                .FirstOrDefault(dc => dc.Dept_Id == deptId && dc.Crs_Id == courseId);

            var assignmentRemoved = false;
            if (assignment != null)
            {
                _db.DepartmentCourseAssignments.Remove(assignment);
                assignmentRemoved = true;
            }

            var studentIds = _db.Students
                .Where(s => s.Dept_Id == deptId)
                .Select(s => s.St_Id)
                .ToList();

            var links = _db.Stud_Courses
                .Where(sc => sc.Crs_Id == courseId && studentIds.Contains(sc.St_Id))
                .ToList();

            if (links.Count > 0)
            {
                _db.Stud_Courses.RemoveRange(links);
            }

            if (!assignmentRemoved && links.Count == 0)
            {
                return Ok(new { courseId, deptId, removed = 0, assignmentRemoved });
            }

            _db.SaveChanges();

            return Ok(new { courseId, deptId, removed = links.Count, assignmentRemoved });
        }

        [HttpGet("department/{deptId:int}/courses-status")]
        public IActionResult GetDepartmentCoursesStatus(int deptId)
        {
            var departmentExists = _db.Departments.Any(d => d.Dept_Id == deptId);
            if (!departmentExists)
            {
                return NotFound("Department not found.");
            }

            var explicitlyAssignedCourseIds = _db.DepartmentCourseAssignments
                .Where(dc => dc.Dept_Id == deptId)
                .Select(dc => dc.Crs_Id)
                .ToHashSet();

            var studentIds = _db.Students
                .Where(s => s.Dept_Id == deptId)
                .Select(s => s.St_Id)
                .ToList();

            var assignedCountByCourse = _db.Stud_Courses
                .Where(sc => studentIds.Contains(sc.St_Id))
                .GroupBy(sc => sc.Crs_Id)
                .Select(g => new { Crs_Id = g.Key, Count = g.Count() })
                .ToList()
                .ToDictionary(x => x.Crs_Id, x => x.Count);

            var result = _db.Courses
                .AsNoTracking()
                .ToList()
                .Select(c => new DepartmentCourseStatusDTO
                {
                    Crs_Id = c.Crs_Id,
                    Crs_Name = c.Crs_Name,
                    Crs_Duration = c.Crs_Duration,
                    Top_Id = c.Top_Id,
                    IsAssigned = explicitlyAssignedCourseIds.Contains(c.Crs_Id)
                        || assignedCountByCourse.ContainsKey(c.Crs_Id),
                    AssignedStudentsCount = assignedCountByCourse.ContainsKey(c.Crs_Id)
                        ? assignedCountByCourse[c.Crs_Id]
                        : 0
                })
                .OrderBy(c => c.Crs_Name)
                .ToList();

            return Ok(result);
        }

        [HttpGet("department/{deptId:int}/courses/{courseId:int}/assigned-students")]
        public IActionResult GetAssignedStudentsForDepartmentCourse(int deptId, int courseId)
        {
            var departmentExists = _db.Departments.Any(d => d.Dept_Id == deptId);
            if (!departmentExists)
            {
                return NotFound("Department not found.");
            }

            var courseExists = _db.Courses.Any(c => c.Crs_Id == courseId);
            if (!courseExists)
            {
                return NotFound("Course not found.");
            }

            var studentIds = _db.Students
                .Where(s => s.Dept_Id == deptId)
                .Select(s => s.St_Id)
                .ToList();

            var assigned = _db.Stud_Courses
                .Where(sc => sc.Crs_Id == courseId && studentIds.Contains(sc.St_Id))
                .Select(sc => new
                {
                    sc.St_Id,
                    sc.Grade
                })
                .ToList();

            return Ok(assigned);
        }

        [HttpPut("department/{deptId:int}/courses/{courseId:int}/grade")]
        public IActionResult AddDegreeForDepartmentCourse(int deptId, int courseId, [FromBody] DepartmentCourseGradeDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var departmentExists = _db.Departments.Any(d => d.Dept_Id == deptId);
            if (!departmentExists)
            {
                return NotFound("Department not found.");
            }

            var courseExists = _db.Courses.Any(c => c.Crs_Id == courseId);
            if (!courseExists)
            {
                return NotFound("Course not found.");
            }

            var assignmentExists = _db.DepartmentCourseAssignments
                .Any(dc => dc.Dept_Id == deptId && dc.Crs_Id == courseId);

            if (!assignmentExists)
            {
                _db.DepartmentCourseAssignments.Add(new DepartmentCourseAssignment
                {
                    Dept_Id = deptId,
                    Crs_Id = courseId
                });
            }

            var studentIds = _db.Students
                .Where(s => s.Dept_Id == deptId)
                .Select(s => s.St_Id)
                .ToList();

            if (studentIds.Count == 0)
            {
                return BadRequest("No students found in this department.");
            }

            var existingLinks = _db.Stud_Courses
                .Where(sc => sc.Crs_Id == courseId && studentIds.Contains(sc.St_Id))
                .ToList();

            var existingByStudent = existingLinks.ToDictionary(sc => sc.St_Id);

            var added = 0;
            var updated = 0;

            foreach (var studentId in studentIds)
            {
                if (existingByStudent.TryGetValue(studentId, out var link))
                {
                    link.Grade = dto.Grade;
                    updated++;
                    continue;
                }

                _db.Stud_Courses.Add(new Stud_Course
                {
                    Crs_Id = courseId,
                    St_Id = studentId,
                    Grade = dto.Grade
                });
                added++;
            }

            _db.SaveChanges();

            return Ok(new
            {
                courseId,
                deptId,
                grade = dto.Grade,
                added,
                updated,
                affected = added + updated
            });
        }

        [HttpPut("{courseId:int}/students/{studentId:int}/grade")]
        public IActionResult AddDegreeForStudentCourse(int courseId, int studentId, [FromBody] DepartmentCourseGradeDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var courseExists = _db.Courses.Any(c => c.Crs_Id == courseId);
            if (!courseExists)
            {
                return NotFound("Course not found.");
            }

            var studentExists = _db.Students.Any(s => s.St_Id == studentId);
            if (!studentExists)
            {
                return NotFound("Student not found.");
            }

            var link = _db.Stud_Courses.FirstOrDefault(sc => sc.Crs_Id == courseId && sc.St_Id == studentId);
            var created = false;

            if (link == null)
            {
                link = new Stud_Course
                {
                    Crs_Id = courseId,
                    St_Id = studentId,
                    Grade = dto.Grade
                };
                _db.Stud_Courses.Add(link);
                created = true;
            }
            else
            {
                link.Grade = dto.Grade;
            }

            _db.SaveChanges();

            return Ok(new
            {
                courseId,
                studentId,
                grade = dto.Grade,
                created,
                updated = !created
            });
        }

        [HttpPost("assign-students")]
        public IActionResult AddCourseStudents([FromBody] AssignCourseStudentsDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!_db.Courses.Any(c => c.Crs_Id == dto.Crs_Id))
            {
                return NotFound("Course not found.");
            }

            if (!_db.Departments.Any(d => d.Dept_Id == dto.Dept_Id))
            {
                return NotFound("Department not found.");
            }

            var assignmentExists = _db.DepartmentCourseAssignments
                .Any(dc => dc.Dept_Id == dto.Dept_Id && dc.Crs_Id == dto.Crs_Id);

            if (!assignmentExists)
            {
                _db.DepartmentCourseAssignments.Add(new DepartmentCourseAssignment
                {
                    Dept_Id = dto.Dept_Id,
                    Crs_Id = dto.Crs_Id
                });
            }

            var validStudents = _db.Students
                .Where(s => s.Dept_Id == dto.Dept_Id && dto.Students.Contains(s.St_Id))
                .Select(s => s.St_Id)
                .ToList();

            var added = 0;
            foreach (var studentId in validStudents)
            {
                var exists = _db.Stud_Courses.Any(sc => sc.Crs_Id == dto.Crs_Id && sc.St_Id == studentId);
                if (exists)
                {
                    continue;
                }

                _db.Stud_Courses.Add(new Stud_Course
                {
                    Crs_Id = dto.Crs_Id,
                    St_Id = studentId,
                    Grade = null
                });
                added++;
            }

            _db.SaveChanges();
            return Ok(new { dto.Crs_Id, dto.Dept_Id, added });
        }
    }
}
