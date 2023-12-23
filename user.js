const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const connection = require('../routes/db')
const saltRounds = 10
const secrectKey = 'secrectKey'


exports.UserRegister = async (req, res, next)=>
{
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address;
    const password = req.body.password;


    if (!name || !email || !address || !password) 
    {
        res.send("You have inserted NULL value");
        return;
    }

    bcrypt.hash(password, saltRounds, function (err, hashedPassword) 
    {
        if (err) 
        {
          res.send({ message: 'Error hashing password.' });
          return;
        }

        const insert = "INSERT INTO user (name, email, address, password) VALUES (?, ?, ?, ?)"
        const values = [name, email, address, hashedPassword]
        connection.query(insert, values, (err,result)=>
        {
           if (err)
           {
            console.log(err)
            res.send({message: "INCORRECT DETAILS"})
           }
           else
           {
            res.send({message: "SIGNUP SUCESSFULLY"})
           }
        })
    })
}

exports.UserLogin = async (req, res, next)=>
{
    const email = req.body.email
    const password = req.body.password

    if (!email || !password)
    {
      console.log(err)
        res.send({message: "PLEASE ENTER email and password"})
    }

    var findemail = "SELECT * FROM user WHERE email = ?"
    var value = [email]
    connection.query(findemail, value,function (err,result)
    {
       if (err)
       {
         res.send({message: "USER WITH THIS EMAIL IS NOT FOUND"})
       }
       else
       {
         console.log(result)
         if (result.length === 0)
         {
            res.send({message: "USER NOT FOUND"})
         }
       }

       const storedHashedPassword = result[0].password
       const equal = bcrypt.compare(password, storedHashedPassword)

       if(!equal)
       {
        res.send({message: "INCORRECT PASSWORD"})
       }

       const token= jwt.sign({userId:result[0].id}, secrectKey,{expiresIn:'1h'})
       return res.json({success:true,token:token})
    })

}

exports.updateuser = async (req, res)=>
{
  let id =  req.params.id
  let name = req.body.name
  let email = req.body.email
  let address = req.body.address


  const update = "UPDATE user SET name = ?, email = ?, address = ? WHERE id = ?";
  const values = [name, email, address, id];

  connection.query(update, values, (err, result) => 
  {
    if (err) 
    {
      console.error(err);
      res.send({ message: "Error updating user data." });
    } 
    else 
    {
      console.log("Updated user data:", result);
      res.json({ success: true, message: "User data updated successfully." });
    }
  });
  
}


exports.deleteuser = async (req, res) =>
{
  let id = req.params.id


  const del = "DELETE FROM user WHERE id = ?"
  const value = [id]
  connection.query(del, value, function(err,result)
  {
    if (err)
    {
      res.json({message: "Can not delete user"})
    }
    else
    {
      res.json({message: "Deleted sucessfully"})
    }
  })
}




exports.patchuser = async (req,res) =>
{
  let id = req.params.id
  let address = req.body.address

  const patchupdate = 'UPDATE user SET address =? Where id =?'
  const value = [address, id]
  connection.query(patchupdate, value, function(err, result)
  {
    if (err)
    {
      console.log(err)
      res.json({message: "Can not patch"})
    }
    else
    {
      res.json({message: "patched sucessfully"})
    }
    
  })
}


