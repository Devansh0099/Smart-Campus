const jwt=require("jsonwebtoken")
const secret="$eret@$%^"
const createToken=(user)=>{
    const payload={
        id:user._id,
        email:user.email,
        role:user.role,
        name:user.name
    }
    const token=jwt.sign(payload,secret);
    return token
}

const validateToken=(cookie)=>{
    const token=jwt.verify(cookie,secret)
    return token
}

module.exports={createToken,validateToken}