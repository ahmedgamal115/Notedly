const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const models = require('./models')
const dbconnect = require('./utility/dbconnection')
const typeDefs = require('./utility/backendSchema')
const resolvers = require('./resolvers')
const jwt = require('jsonwebtoken');
const hemlet = require('helmet')
const cors = require('cors')
const depthLimit = require('graphql-depth-limit')
const { createComplexityLimitRule } = require('graphql-validation-complexity')
const { ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core')


const app = express()
const port = process.env.port || 3000

// app.use(hemlet())
app.use(cors())

const getUser = (tokken)=>{
    if(tokken){
        try {
            return jwt.verify(tokken,process.env.JWT_SECRET_KEY)
        } catch (error) {
            console.log(error)
            throw new Error('Session invalid')
        }
    }
}

const serverGraph = async ()=>{
    const server = new ApolloServer({
        introspection: true,
        typeDefs,
        resolvers,
        validationRules: [depthLimit(5),createComplexityLimitRule(1000)],
        context: ({ req })=>{
            let tokken = req.headers.authorization
            let user = getUser(tokken)
            return {models,user}
        },
    })
    await server.start()
    server.applyMiddleware({ app, path: '/api' });
}

dbconnect()
serverGraph()


app.get('/', (req, res) =>{
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})