const express = require("express");
const app = express();
const expressGraphQL = require("express-graphql");
const { GraphQLSchema } = require("graphql");
const port = 3000;

const RootQueryType = require('./resolvers/querys')
const RootMutationType = require('./resolvers/mutation')

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});

app.use(
    "/graphql",
    expressGraphQL({
        schema: schema,
        graphiql: true,
        customFormatErrorFn: (error) => {
            return error;
        },
    })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
