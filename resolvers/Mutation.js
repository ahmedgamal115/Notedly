const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { AuthenticationError,
        ForbiddenError } = require('apollo-server-express')
require('dotenv').config()
const gravatar = require('gravatar');
const mongoose = require('mongoose')

module.exports = {
    newNote: async(parent,args,{models,user})=>{
        if(!user){
            throw new AuthenticationError('Must signIn first')
        }
        let Notes = new models.Notes({
            content: args.content,
            author: new mongoose.Types.ObjectId(user.id)
        })
        return await Notes.save()
    },
    updateNote: async(parent,args,{models,user})=>{
        if(!user){
            throw new AuthenticationError('Must signIn first')
        }
        const note = await models.Notes.findById({_id:args.id})
        if(note && note.author.toString() !== user.id){
            throw new ForbiddenError("You don't have premision to update that note")
        }
        return await models.Notes.findOneAndUpdate({_id:args.id},{$set:{content: args.content}},{new:true})
    },
    deleteNote: async(parent,args,{models,user})=>{
        if(!user){
            throw new AuthenticationError('Must signIn first')
        }
        const note = await models.Notes.findById({_id:args.id})
        if(note && note.author.toString() !== user.id){
            throw new ForbiddenError("You don't have premision to delete that note")
        }
        try {
            return await models.Notes.findById(args.id).then(async(note)=>{
                if(note){
                    await models.Notes.findOneAndDelete({_id:args.id})
                    return true
                }else{
                    return false
                }
            })
        } catch (error) {
            return error
        }
    },
    toggleFavorit: async(parent,{id},{models,user})=>{
        if(!user){
            throw new AuthenticationError('Must signIn first')
        }
        let currentNote = await models.Notes.findById(id)
        const hasUser = currentNote.favoritedBy.indexOf(user.id)
        if(hasUser >= 0){
            return await models.Notes.findByIdAndUpdate(id,{
                $pull:{
                    favoritedBy: new mongoose.Types.ObjectId(user.id)
                },
                $inc:{
                    favoriteCount: -1
                }
            },
            {
                new: true
            })
        }else{
            return await models.Notes.findByIdAndUpdate(id,{
                $push:{
                    favoritedBy: new mongoose.Types.ObjectId(user.id)
                },
                $inc:{
                    favoriteCount: 1
                }
            },
            {
                new: true
            })
        }
    },
    signUp: async(parent,{ fullname, username, email, password },{models})=>{
        email = email.trim().toLowerCase()
        const hashPassword = await bcrypt.hash(password,10)
        const avater = gravatar.url(email)
        try {
            let newUser = new models.users({
                fullname: fullname,
                username: username,
                email: email,
                password: hashPassword,
                avater
            })  
            let user =  await newUser.save()
            return jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1 days'})
        } catch (error) {
            console.log(error)
            throw new Error('Error creating account')
        }
    },
    signIn: async(parent,{ email,password },{models})=>{
        email = email.trim().toLowerCase()
        return await models.users.findOne({email})
            .then(async(user)=>{
                if(user){
                    let checkPassword = await bcrypt.compare(password,user.password)
                    if(checkPassword){
                        return jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1 days'})
                    }else{
                        throw new AuthenticationError('Invalid Email or Password')
                    }
                }else{
                    throw new AuthenticationError('Invalid Email or Password')
                }
            })
    }
}