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
                grade: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                course = courses.find((course) => course.id === args.courseId)
                student = students.find((student) => student.id === args.studentId)
                if (course && student) {
                    const grade = {
                        id: grades.length + 1,
                        courseId: args.courseId,
                        studentId: args.studentId,
                        grade: args.grade,
                    };
                    grades.push(grade);
                    return grade;
                } else {
                    throw new GraphQLError(`No se encontro un course con id: ${args.courseId} o un student con id: ${args.studentId}`)
                }
            },
        },
        removeCourse: {
            type: CourseType,
            description: "remove a course",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const gradesCourse = grades.filter(
                    (grade) => grade.courseId === args.id
                );
                const studentsCourse = students.filter(
                    (student) => student.courseId === args.id
                );
                if (gradesCourse.length == 0 && studentsCourse == 0) {
                    _.remove(courses, (course) => course.id === args.id);
                } else {
                    throw new GraphQLError(
                        "No se puede eliminar course porque tiene grades y students"
                    );
                }
            },
        },
        removeStudent: {
            type: StudentType,
            description: "remove a student",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const gradesStudent = grades.filter(
                    (grade) => grade.studentId === args.id
                );
                if (gradesStudent.length == 0) {
                    _.remove(students, (student) => student.id === args.id);
                } else {
                    throw new GraphQLError(
                        "No se puede eliminar student porque tiene grades"
                    );
                }
            },
        },
        removeGrade: {
            type: GradeType,
            description: "remove a grade",
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                _.remove(grades, (grade) => grade.id === args.id);
            },
        },
    }),
});


module.exports = RootMutationType