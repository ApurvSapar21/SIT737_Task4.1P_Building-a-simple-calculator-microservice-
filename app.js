const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Winston logger
const logger = winston.createLogger({
    level: 'info', // Log level (info and above)
    format: winston.format.json(), // Log format (JSON)
    defaultMeta: { service: 'calculator-microservice' }, // Default metadata
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }), // Log to console
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
        new winston.transports.File({ filename: 'logs/combined.log' }) // Log all messages to another file
    ]
});

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the index.html file on the root route
app.get('', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// POST /add
app.post('/add', (req, res) => {
    const num1 = Number(req.body.num1);
    const num2 = Number(req.body.num2);

    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input received for addition');
        return res.status(400).json({ error: 'Invalid input. Please provide numeric values.' });
    }

    logger.info(`New addition operation requested: ${num1} + ${num2}`);
    const result = num1 + num2;
    res.json({ message: `The added value of ${num1} and ${num2} is ${result}` });
});

// POST /subtract
app.post('/subtract', (req, res) => {
    const num1 = Number(req.body.num1);
    const num2 = Number(req.body.num2);

    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input received for subtraction');
        return res.status(400).json({ error: 'Invalid input. Please provide numeric values.' });
    }

    logger.info(`New subtraction operation requested: ${num1} - ${num2}`);
    const result = num1 - num2;
    res.json({ message: `The subtracted value of ${num1} and ${num2} is ${result}` });
});

// POST /multiply
app.post('/multiply', (req, res) => {
    const num1 = Number(req.body.num1);
    const num2 = Number(req.body.num2);

    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input received for multiplication');
        return res.status(400).json({ error: 'Invalid input. Please provide numeric values.' });
    }

    logger.info(`New multiplication operation requested: ${num1} * ${num2}`);
    const result = num1 * num2;
    res.json({ message: `The multiplied value of ${num1} and ${num2} is ${result}` });
});

// POST /divide
app.post('/division', (req, res) => {
    const num1 = Number(req.body.num1);
    const num2 = Number(req.body.num2);

    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input received for division');
        return res.status(400).json({ error: 'Invalid input. Please provide numeric values.' });
    }

    if (num2 === 0) {
        logger.error('Attempted to divide by zero');
        return res.status(400).json({ error: 'Cannot divide by zero.' });
    }

    logger.info(`New division operation requested: ${num1} / ${num2}`);
    const result = num1 / num2;
    res.json({ message: `The divided value of ${num1} by ${num2} is ${result}` });
});

// Error handling middleware for server errors
app.use((err, req, res, next) => {
    logger.error('Internal Server Error', { error: err.stack });
    res.status(500).json({ error: 'Internal Server Error' });
});

// 404 Not Found middleware
app.use((req, res, next) => {
    logger.warn('Route not found', { path: req.path });
    res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
