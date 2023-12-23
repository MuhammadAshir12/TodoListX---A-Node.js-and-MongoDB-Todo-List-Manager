const jwt = require('jsonwebtoken')
const secretKey = 'secrectKey'
const connection = require('../routes/db')

exports.isAuth = async(req,res,next)=>

{
    try
    {
        const authHeader = req.query.Authorization || req.get('Authorization')
        if (!authHeader)
            throw new Error('Not authenticated.')
        const token = authHeader.split(' ')[1]
        const decodedToken = jwt.verify(token, secretKey)
        if (!decodedToken)
            throw new Error('Not authenticated.')
        req.userId = decodedToken.userId
        var sql = "SELECT * FROM user WHERE id = ?";
        var sqlvalue = [decodedToken.userId];
        connection.query(sql, sqlvalue, function (err, result) 
        {
            if (err) throw err;

            console.log(result);
            if (result.length === 0) 
            {
            res.send("User not found");
            return;
            }
        });
        console.log("userId", req.userId)
        next()
    }
    catch(err)
    {
        next(err)
    }
}