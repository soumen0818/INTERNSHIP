const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

// Temporary storage
const users = [];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Validation rules
const validationRules = [
    body('firstName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters')
        .isAlpha()
        .withMessage('First name must contain only letters'),
    
    body('lastName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters')
        .isAlpha()
        .withMessage('Last name must contain only letters'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(value => {
            const exists = users.some(user => user.email === value.toLowerCase());
            if (exists) {
                throw new Error('Email already registered');
            }
            return true;
        }),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    
    body('userType')
        .isIn(['student', 'professional', 'admin'])
        .withMessage('Please select a valid user type')
];

app.post('/register', validationRules, (req, res) => {
    console.log('Received request body:', req.body);
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array()
        });
    }

    // Create new user object
    const newUser = {
        id: Date.now(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email.toLowerCase(),
        userType: req.body.userType,
        createdAt: new Date().toISOString()
    };

    // Store user
    users.push(newUser);

    // Log registration
    console.log('New user registered:', newUser);
    console.log('Total users:', users.length);

    // Send success response
    res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        user: newUser
    });
});

// Get all users (for testing)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Registration system is ready to accept new users`);
});