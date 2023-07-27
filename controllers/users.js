const User = require('../modeldata/user');
const passport = require('passport');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.register = async(req,res)=>{
    try{
        const {email,username,password} = req.body
        const user = new User({email,username})
        const userReg = await User.register(user,password)
        req.login(userReg,err =>{
            if(err) return next()
            req.flash('success','Welcome to YELP')
            res.redirect('/campgrounds')
        })
        }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    req.flash('success','Successfully Logged In')
    res.redirect('/campgrounds')

}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out');
        res.redirect('/campgrounds');
    });
}