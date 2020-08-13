var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String,
    email:String
})
UserSchema.pre("save", async function save(next){
    if(!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password,10);
    next();
})

UserSchema.methods.verifyPassword = function(userInput){
    console.log("compare password",bcrypt.compareSync(userInput, this.password) )
    // return true;
    return bcrypt.compareSync(userInput, this.password );
}

module.exports = mongoose.model('User',UserSchema);