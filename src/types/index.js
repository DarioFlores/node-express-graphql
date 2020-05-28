const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInt,
    GraphQLString
} = require("graphql");
const courses = require("../data/courses.json");
const students = require("../data/students.json");
const grades = require("../data/grades.json");


const StudentType = new GraphQLObjectType({
    name: "Student",
    description: "Represent student",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        lastname: { type: GraphQLNonNull(GraphQLString) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        course: {
            type: CourseType,
            resolve: (student) =>
                courses.find((course) => course.id === student.courseId),
        },
    }),
});

const CourseType = new GraphQLObjectType({
    name: "Course",
    description: "Represent course",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        grades: {
            type: new GraphQLList(GradeType),
            resolve: (course) =>
                grades.filter((grade) => grade.courseId === course.id),
        },
        students: {
            type: new GraphQLList(StudentType),
            resolve: (course) =>
                students.filter((student) => student.courseId === course.id),
        },
    }),
});

const GradeType = new GraphQLObjectType({
    name: "Grade",
    description: "Represent grade",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        courseId: { type: GraphQLNonNull(GraphQLInt) },
        studentId: { type: GraphQLNonNull(GraphQLInt) },
        grade: { type: GraphQLNonNull(GraphQLString) },
        course: {
            type: CourseType,
            resolve: (grade) =>
                courses.find((course) => course.id === grade.courseId),
        },
        student: {
            type: StudentType,
            resolve: (grade) =>
                students.find((student) => student.id === grade.studentId),
        },
    }),
});


module.exports = {
    CourseType,
    StudentType,
    GradeType
}