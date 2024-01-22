const Mutation = require('./Mutation')
const Query = require('./Query')
const Note = require('./note')
const User = require('./user')
const { GraphQLDateTime } = require('graphql-iso-date')

module.exports = {
    Mutation,
    Query,
    Note,
    User,
    DateTime: GraphQLDateTime
}