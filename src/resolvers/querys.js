const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt,
} = require("graphql");
const { CourseType, GradeType, StudentType } = require('../types/index');
const courses = require("../data/courses.json");
const students = require("../data/students.json");
const grades = require("../data/grades.json");

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Querys",
    fields: () => ({
        courses: {
            type: new GraphQLList(CourseType),
            description: "List of All Courses",
            resolve: () => courses,
        },
        students: {
            type: new GraphQLList(StudentType),
            description: "List of All Students",
            resolve: () => students,
        },
        grades: {
            type: new GraphQLList(GradeType),
            description: "List of All Grades",
            resolve: () => grades,
        },
        course: {
            type: CourseType,
            description: "Find by id a course",
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) =>
                courses.find((course) => course.id === args.id),
        },
        student: {
            type: StudentType,
            description: "Find by id a student",
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) =>
                students.find((student) => student.id === args.id),
        },
        grade: {
            type: GradeType,
            description: "Find by id a grade",
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) =>
                grades.find((grade) => grade.id === args.id),
        },
    }),
});


module.exports = RootQueryType;