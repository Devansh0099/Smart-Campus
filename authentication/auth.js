// const validateToken = require("../services/service");

const { validateToken } = require("../services/service");

function auth(cookieName) {
    return (req, res, next) => {
        const cookie = req.cookies[cookieName];
        
        if (!cookie || typeof cookie !== 'string') {
            console.log("no cookie")
            return next(); 
        }
        try {
            const payload = validateToken(cookie);
            req.user = payload;
            return next();
        } catch (err) {
            console.error('Error validating token:', err.message);
            return next(); 
        }
    };
}

function restrict(roles=[]){
    return function(req,res,next){
        if(!req.user){
            return res.redirect("/login")    
        }
        if(!roles.includes(req.user.role)){
            return res.end("Unauthorized")
        }
        next()
    }
}

module.exports={restrict,auth};