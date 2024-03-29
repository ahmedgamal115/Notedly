const { default: mongoose } = require("mongoose")

module.exports = {
    notes: async(parent,args,{models})=> {
        return await models.Notes.find().limit(100)
    },
    note: async(parent,args,{models})=>{
        return await models.Notes.findById(args.id)
    },
    users: async(parent,args,{ models, user })=>{
        return await models.users.find({})
    },
    user: async(parent,{ username },{ models, user })=>{
        return await models.users.findOne({username})
    },
    me: async(parent,args,{ models, user })=>{
        return await models.users.findById({_id: user.id})
    },
    noteFeed: async(parent,{ cursor },{ models })=>{
        const limit = 10
        let hasNextPage = false
        let cursorQuery = {}
        if(cursor){
            cursorQuery = {_id : {$lt: cursor}}
        }
        let notes = await models.Notes.find(cursorQuery)
        .sort({_id: -1})
        .limit(limit + 1)
        if(notes.length > limit){
            hasNextPage = true
            notes = notes.slice(0,-1)
        }
        const newCursor = notes[notes.length - 1]._id
        return{
            notes,
            cursor: newCursor,
            hasNextPage
        }
    },

}