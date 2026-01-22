require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

async function startServer() {
    try {
        // Authenticate Database
        await db.sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync Models (Create tables if not exist, don't drop)
        await db.sequelize.sync();

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

startServer();
