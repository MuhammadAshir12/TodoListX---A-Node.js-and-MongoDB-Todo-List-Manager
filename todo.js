const express = require('express')
const router = express.Router()
const connection = require('../routes/db')


exports.additems = async (req, res, next)=>
{
  const user_id=req.userId
  const title = req.body.title
  const description = req.body.description
  const duedate = req.body.duedate

  const insertItems = `INSERT INTO todo_items (user_id, title, description, duedate) VALUES (?, ?, ?, ?)`;
  const values = [user_id, title, description, duedate];
  connection.query(insertItems, values, (err, result) => 
  {
    if (err) 
    {
      console.error('Error adding todo item:', err);
      res.json({ error: 'Error adding todo item' });
    } 
    else 
    {
      console.log('Todo item added successfully!');
      res.json({ message: 'Todo item added successfully' });
    }
  });


}

exports.getitems = async (req, res)=>
{
   const selectitems = `Select * FROM todo_items`
   connection.query(selectitems,  (err, result)=>
   {
      if(err)
      {
        res.json({message: "ERROR"})
      }
      else 
      {
        console.log('Todo items retrieved successfully!');
        res.json({ items: result });
      }
   })
}


exports.deleteitems = async (req, res)=>
{
  let item_id = req.params.item_id


  const del = "DELETE FROM todo_items WHERE item_id = ?"
  const value = [item_id]
  connection.query(del, value, (err,result)=>
  {
    if (err)
    {
      console.log(err)
      res.json({message: "Can not delete user"})
    }
    else 
    {
      if (result.affectedRows > 0) 
      {
        console.log('Todo item deleted successfully!');
        res.json({ message: "Deleted successfully" });
      } 
      else 
      {
        console.log('Todo item not found!');
        res.json({ message: "Todo item not found" });
      }
    }
  })
}