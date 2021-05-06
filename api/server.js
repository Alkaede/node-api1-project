// BUILD YOUR SERVER HERE
// import
const express = require('express');
const Model = require('./users/model');   

// instance of express app
const server = express();

//middleware
server.use(express.json());

// GET to see if server is working
server.get('/', (req, res) => {
  res.status(200)
  res.send({message: 'Hello user!'})
})

// GET USERS
server.get('/api/users', async (req, res)=>{
  const users = await Model.find()
  if(!users){
    res.status(500).send({message: 'There was an error while saving the user to the database'})
  }else{
    res.status(200).send(users)
  }
})

// GET USERS ID
server.get('/api/users/:id', async (req, res)=>{
  // console.log(req)
  const { id } = req.params;
  // since im destructing id here i dont need to do req.params.id if I wasnt then i would do the .id at the end 
  console.log(id);
  const userId = await Model.findById(id);

  if(!userId){
    res.status(404).send({ message: "The user with the specified ID does not exist" });
  }else{
    res.status(200).send(userId);
  }
})

// POST take new user
server.post('/api/users', async (req, res)=>{
  const { name, bio } = req.body;
  // console.log(req)
  console.log('reqbody log:', req.body)

  if(!name || !bio){
    res.status(400).send({ message: "Please provide name and bio for the user" });
  }else{
    // API_NAME.POSTmethod_name({parameters}) to post the new info
    const newUser = await Model.insert({name,bio});
    console.log(newUser)
    res.status(200).send(newUser)
  }
})

// PUT to update user (following the example in the guided project w/ its notes)  updating user with :id using JSON payload
server.put('/api/users/:id', async (req, res)=>{
  // pull info from req
  const changes = req.body;
  const {id} = req.params;

  console.log(changes)
  console.log(id)
  // validation of req.body
  if(!changes.name || !changes.bio){
    res.status(400).json({ message: "Please provide name and bio for the user" })
  }else{
    // interact with db through helper
    //so this is how I can add multiple layers of errors 
    await Model.update(id, changes)
    // send appriopriate response
      .then(updatedUser => {
        if(updatedUser){
          console.log(updatedUser)
          res.status(200).json(updatedUser)
        }else{
          res.status(404).json({ message: "The user with the specified ID does not exist" })
        }
      })
      .catch(() => {
        res.status(500).json({ message: "The user information could not be modified" })
      })
  }
})

// DELETE user
server.delete('/api/users/:id', (req, res)=>{
  const { id } = req.params;
  console.log(id)

  // using the remove method from models to get rid of the item of the params of id
  Model.remove(id)
    .then(deleted => {
      if(deleted){
        res.status(200).json(deleted)
      }else{
        res.status(404).json({ message: "The user with the specified ID does not exist" })
      }
    })
    .catch(() => {
      res.status(500).json({ message: "The user could not be removed" })
    })
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
