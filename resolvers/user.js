module.exports = {
    Note: async(user,args,{models})=>{
        return await models.Notes.find({author: user._id}).sort({_id:-1})
    },
    favorites: async(user,args,{models})=>{
        return await models.Notes.find({favoritedBy: user._id}).sort({_id:-1})
    },
}