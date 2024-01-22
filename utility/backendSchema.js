const {gql} = require('apollo-server-express')

module.exports = gql`
    scalar DateTime
    
    type Query{
        notes: [Note!]!
        note(id: ID!): Note!
        users: [User]!
        user(username: String!): User
        me(id: ID!): User!
        noteFeed(cursor: String!): NoteFeed
    }
    type Note{
        id: ID!
        content: String!
        author: User!
        createdAt: DateTime!
        updatedAt: DateTime!
        favoriteCount: Int!
        favoritedBy: [User!]
    }
    type User{
        id: ID!
        fullname: String!
        username: String!
        email: String!
        avater: String!
        Note: [Note!]!
        favorites: [Note!]
    }
    type NoteFeed{
        notes: [Note!]!
        cursor: String!
        hasNextPage: Boolean!
    }
    type Mutation{
        newNote(content: String!): Note!
        updateNote(id:ID!,content:String!): Note!
        deleteNote(id:ID!): Boolean!
        signUp(fullname: String!,username: String!,email: String!,password:String!): String!
        signIn(email: String!,password:String!): String!
        toggleFavorit(id: ID!): Note! 
    }
`