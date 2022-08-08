// Creating variables for document elements
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creating a click event listener for each of the above listed elements that appear in the DOM
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Async delete item function
async function deleteItem(){
    // Set variable itemText to equal the innertext of the item being deleted
    const itemText = this.parentNode.childNodes[1].innerText
    // Try/Catch block for errors
    try{
        // Sending fetch request to our server at /deleteItem
        const response = await fetch('deleteItem', {
            // Tells our server the method
            method: 'delete',
            // Tells our server the headers to send
            headers: {'Content-Type': 'application/json'},
            // Tells our server which item to delete
            body: JSON.stringify({
              'itemFromJS': itemText
            })
        })
        // Waits for response from server
        const data = await response.json()
        // Console logs the response from the server
        console.log(data)
        // Reload page
        location.reload()

    // Catch any errors
    }catch(err){
        // Console log errors
        console.log(err)
    }
}

// Async markComplete function
async function markComplete(){
    // Set variable itemText to equal the innertext of the item being marked complete
    const itemText = this.parentNode.childNodes[1].innerText
    // Try/Catch block for errors
    try{
        // Sending fetch request to our server at /markComplete
        const response = await fetch('markComplete', {
            // Setting method to put
            method: 'put',
            // Setting headers for our server to send
            headers: {'Content-Type': 'application/json'},
            // Telling our server which item to mark complete
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Awaiting response from server
        const data = await response.json()
        // Console log data
        console.log(data)
        // Reload page
        location.reload()

    // Catch errors
    }catch(err){
        // Console log errors
        console.log(err)
    }
}

// Async function to mark tasks as incomplete
async function markUnComplete(){
    // Set variable itemText to equal the innertext of the item we want to mark as incomplete
    const itemText = this.parentNode.childNodes[1].innerText
    // Try/Catch block for errors
    try{
        // Fetch request to our server at /markUnComplete
        const response = await fetch('markUnComplete', {
            // Set method to put
            method: 'put',
            // Set headers for our server to send
            headers: {'Content-Type': 'application/json'},
            // Tell our server which item we want to mark as incomplete
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // Wait for response from server
        const data = await response.json()
        // Console log data
        console.log(data)
        // Reload page
        location.reload()

    // Catch errors
    }catch(err){
        // Console log errors
        console.log(err)
    }
}