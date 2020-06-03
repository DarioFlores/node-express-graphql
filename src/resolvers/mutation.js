const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
    GraphQLError,
} = require("graphql");
const _ = require("lodash");
const courses = require("../data/courses.json");
const students = require("../data/students.json");
const grades = require("../data/grades.json");
const { CourseType, GradeType, StudentType } = require('../types/index');


const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addCourse: {
            type: CourseType,
            description: "Add a course",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const course = {
                    id: courses.length + 1,
                    name: args.name,
                    description: args.description,
                };
                courses.push(course);
                return course;
            },
        },
        addStudent: {
            type: StudentType,
            description: "Add a student",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                lastname: { type: GraphQLNonNull(GraphQLString) },
                courseId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                course = courses.find((course) => course.id === args.courseId)
                if (course) {
                    const student = {
                        id: students.length + 1,
                        name: args.name,
                        lastname: args.lastname,
                        courseId: args.courseId,
                    };
                    students.push(student);
                    return student;
                } else {
                    throw new GraphQLError(`No se encontro un course con id: ${args.courseId}`)
                }
            },
        },
        addGrade: {
            type: GradeType,
            description: "Add a grade",
            args: {
                courseId: { type: GraphQLNonNull(GraphQLInt) },
                studentId: { type: GraphQLNonNull(GraphQLInt) },
                grade: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                student = students.find((student) => student.id === args.studentId)
                if (student) {
                    if (student.courseId === args.courseId) {
                        const grade = {
                            id: grades.length + 1,
                            courseId: args.courseId,
                            studentId: args.studentId,
                            grade: args.grade,
                        };
                        grades.push(grade);
                        return grade;
                    } else {
                        throw new GraphQLError(`El estudiante con id: ${args.studentId} no se encuentra en el curso con id: ${args.courseId}, por lo tanto no se puede asignar una nota`)
                    }
                } else {
                    throw new GraphQLError(`No se encontro un estudiante con id: ${args.studentId}`)
                }
            },
        },
        removeCourse: {
            type: GraphQLString,
            description: "remove a course",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const courseDelete = courses.find( course => course.id === args.id);
                if (courseDelete) {
                    const gradesCourse = grades.filter(
                        (grade) => grade.courseId === courseDelete.id
                    );
                    const studentsCourse = students.filter(
                        (student) => student.courseId === courseDelete.id
                    );
                    if (gradesCourse.length == 0 && studentsCourse == 0) {
                        _.remove(courses, (course) => course.id === courseDelete.id);
                        return 'Curso eliminado satisfactoriamente'
                    } else {
                        throw new GraphQLError(
                            "No se puede eliminar course porque tiene notas y estudiantes"
                        );
                    }
                } else {
                    throw new GraphQLError(
                        "No se encontro el curso"
                    );
                }
            },
        },
        removeStudent: {
            type: GraphQLString,
            description: "remove a student",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const studentDelete = students.find( student => student.id === args.id);
                if (studentDelete) {
                    const gradesStudent = grades.filter(
                        (grade) => grade.studentId === studentDelete.id
                    );
                    if (gradesStudent.length == 0) {
                        _.remove(students, (student) => student.id === args.id);
                        return 'Estudiante eliminado satisfactoriamente'
                    } else {
                        throw new GraphQLError(
                            "No se puede eliminar estudiante porque tiene notas"
                        );
                    }
                } else {
                    throw new GraphQLError(
                        "No se encontro el estudiante"
                    );
                }
            },
        },
        removeGrade: {
            type: GraphQLString,
            description: "remove a grade",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const gradeDelete = grades.find( grade => grade.id === args.id);
                if (gradeDelete) {
                    _.remove(grades, (grade) => grade.id === gradeDelete.id);
                    return 'Nota eliminada satisfactoriamente'
                } else {
                    throw new GraphQLError(
                        "No se encontro el nota"
                    );
                }
            },
        },
    }),
});


module.exports = RootMutationType