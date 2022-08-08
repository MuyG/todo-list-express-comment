// Import modules
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
// Allows us to use .env files to create environment variables
require('dotenv').config()

// Creates our database, database connection string, and database name variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connects to MongoDB database using the above variables
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // Once connected it will console log that it is connected
        console.log(`Connected to ${dbName} Database`)
        // Sets our db variable to our database
        db = client.db(dbName)
    })
    
// Allows us to use our view folder and our ejs document
app.set('view engine', 'ejs')
// Allows us to use the public folder for all other documents or assets
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
// Allows us to use JSON with Express
app.use(express.json())

// Gets all todo items
app.get('/',async (request, response)=>{
    // Sets variable todoItems to all todo items in our database
    const todoItems = await db.collection('todos').find().toArray()
    // Sets variable itemsLeft to all todo items in our database that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Sends response to our EJS file as JSON
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // The hard way to get all the itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Create a new todo list item
app.post('/addTodo', (request, response) => {
    // Insert a new todo list item into the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Then console log the result and refresh the page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // Catches any errors
    .catch(error => console.error(error))
})

// Update a todo list item as complete
app.put('/markComplete', (request, response) => {
    // Updates an item from the todo list
    db.collection('todos').updateOne(
    // Finds the item in the database by using the itemFromJS variable that was given from the fetch request
    {thing: request.body.itemFromJS},{
        // Sets completed to true
        $set: {
            completed: true
          }
    },{
        // Sort by id
        sort: {_id: -1},
        // Not inverse
        upsert: false
    })
    .then(result => {
        // Console log marked complete
        console.log('Marked Complete')
        // Respond to fetch request with marked complete
        response.json('Marked Complete')
    })
    // Catch errors
    .catch(error => console.error(error))

})

// Update a todo list item as incomplete
app.put('/markUnComplete', (request, response) => {
    // Finds and updates an item as incomplete
    db.collection('todos').updateOne(
    // Finds the item in the database by using the itemFromJS variable that was given from the fetch request 
    {thing: request.body.itemFromJS},{
        // Sets completed to false
        $set: {
            completed: false
          }
    },{
        // Sort by id
        sort: {_id: -1},
        // Not inverse
        upsert: false
    })
    .then(result => {
        // Console log marked complete
        console.log('Marked Complete')
        // Respond to fetch request with marked complete
        response.json('Marked Complete')
    })
    // Catch errors
    .catch(error => console.error(error))

})

// Delete an item from the database
app.delete('/deleteItem', (request, response) => {
    // Find and delete an item from the database
    db.collection('todos').deleteOne(
    // Finds the item in the database by using the itemFromJS variable that was given from the fetch request
    {thing: request.body.itemFromJS})
    .then(result => {
        // Console log marked complete
        console.log('Todo Deleted')
        // Respond to fetch request with marked complete
        response.json('Todo Deleted')
    })
    // Catch errors
    .catch(error => console.error(error))

})

// Server listening on default environmental port or the PORT variable that we manually set
app.listen(process.env.PORT || PORT, ()=>{
    // Console log that the server is running and on which port it is running on
    console.log(`Server running on port ${PORT}`)
})