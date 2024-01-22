module.exports = {
    author:async(note,args,{models})=>{
        return await models.users.findById(note.author)
    },
    favoritedBy:async(note,args,{models})=>{
        return await models.users.find({_id: {$in: note.favoritedBy}})
    },
}