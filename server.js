
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const port = 1234;


// Middleware Setup (Activity 3)
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON request bodies


// Start Server Listener (Activity 3)
app.listen(port, () => {
    console.log(`The server is running with port ${port}`);
});


// Database Connection Configuration (Activity 3)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gutibj' 
});

// Database Connection Initialization (Activity 3)
db.connect((err) => {
    if(err) {
        // FIX: Use console.error and fix typo
        console.error('Database Connection Error: ', err.message); 
        return;
    }
    // Correctly logging success inside the callback (Activity 3 Compliance)
    console.log('DB Connected successfully');
});


// =========================================================================
// CRUD ROUTES FOR /users RESOURCE
// =========================================================================

// GET all users (Activity 4)
// Route: GET /users
app.get('/users' , (req, res) => {
    db.query('SELECT * FROM newuser', (err, result) => {
        if(err) {
            // FIX: Use console.error and correctly reference 'err'
            console.error('Database query error (GET all):', err);
            // Specific 500 error message (plural)
            return res.status(500).json({error: 'Database error fetching users'});
        } 
        // Returns 200 OK
        res.json(result);
    });
})

// GET user by id (Activity 2)
// Route: GET /users/:id
app.get('/users/:id', (req,res) => {
    const user_id = req.params.id;
    
    db.query('SELECT * FROM newuser WHERE id = ?', [user_id], (err, result) => {
        if(err) {
            // FIX: Use console.error
            console.error('Database query error (GET by id):', err);
            // Specific 500 error message
            return res.status(500).json({error: 'Database error fetching user'});
        }

        // Correctly checks result.length for SELECT queries
        if(result.length === 0){
            // Returns 404 Not Found
            return res.status(404).json({error: 'User not found'})
        }

        // Returns the single result object
        res.json(result[0]);
    });
});

// POST (Create) a new user (Activity 5)
// Route: POST /users
app.post('/users', (req,res) => {
    const {name, address, gender} = req.body;

    // Input validation (400 Bad Request)
    if(!name || !address || !gender){
        // FIX: Specific 400 error message
        return res.status(400).json({error: 'Missing required fields: name, address, or gender'})
    }

    db.query('INSERT INTO newuser (name, address, gender) VALUES (?, ?, ?)',
        [name, address, gender],
        (err, result) => {
            if(err) {
                // FIX: Use console.error
                console.error('Database INSERT error:', err);
                // Specific 500 error message
                return res.status(500).json({error: 'Database error adding user'});
            }

            // Returns 201 Created 
            res.status(201).json({
                message: 'User added successfully',
                // FIX: Standardized key to 'userId'
                userId: result.insertId 
            });

        });
});

// PUT (Replace) an existing user (Activity 6)
// Route: PUT /users/:id
app.put('/users/:id', (req,res) =>{
    const user_id = req.params.id;
    const {name, address, gender} = req.body;

    // Validation (400 Bad Request)
    if(!name || !address || !gender) {
        // FIX: Use 'error' key and specific 400 message
        return res.status(400).json({error: 'All fields (name, address, gender) are required for a PUT request'});
    }

    db.query('UPDATE newuser SET name = ?, address = ?, gender = ? WHERE id = ?', [name, address, gender, user_id], (err, result) => {

        if(err){
            // FIX: Use console.error
            console.error('Database update error (PUT):', err);
            // Specific 500 error message
            return res.status(500).json({error: 'Database error during update'});
        }

        if(result.affectedRows === 0){
            // Returns 404 Not Found
            return res.status(404).json({error: 'User not found'});
        }

        // Returns 200 OK
        res.json({message: 'User updated successfully'})

    });
});

// DELETE a user (Activity 7)
// Route: DELETE /users/:id
app.delete('/users/:id', (req, res) => {
    const user_id = req.params.id;

    db.query('DELETE FROM newuser WHERE id = ?', [user_id], (err, result) =>{
        if(err) {
            // FIX: Use console.error
            console.error('Database delete error:', err);
            // Specific 500 error message
            return res.status(500).json({error: 'Database error during deletion'});
        }

        // Correctly checks affectedRows for DELETE queries
        if(result.affectedRows === 0){
            // Returns 404 Not Found
            return res.status(404).json({error: 'User not found'})
        }
        // Returns 200 OK, confirming the deleted ID
        res.json({message:'User deleted successfully', id: user_id})

    });

});
