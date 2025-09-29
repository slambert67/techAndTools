const path = require('path');
const db = require('./db');
const app = require('./app');
const { createConfig } = require('./config/config');

async function execute() {

    console.log(`src/index.js - execute`);

    console.log(`creating app config`);
    const configPath = path.join(__dirname, '../configs/.env');
    const appConfig = createConfig(configPath);

    console.log(`connecting to db passing config`);
    await db.connect(appConfig);

    console.log(`starting node server`);
    const server = app.listen(appConfig.port, () => {
        console.log('account service started', { port: appConfig.port });
    });

    const closeServer = () => {
        if (server) {
            server.close(() => {
                console.log('server closed');
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedError = (error) => {
        console.log('unhandled error', { error });
        closeServer();
    };

    process.on('uncaughtException', unexpectedError);
    process.on('unhandledRejection', unexpectedError);
}

execute();
