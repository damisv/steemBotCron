import app from './src';
import config from './src/config';
import logger from './src/util/logger';

import DBClient from './src/database/dbClient';
import { createServer } from 'http';
import * as socketIo from 'socket.io';
import {IOServer} from './src/socket';
import agenda from './src/agenda/agenda';

const server = createServer(app);
const io = socketIo(server, { serveClient: false});

server.listen(config.port, async () => {
    try {
        await DBClient.connect(); // Connecting DB
        logger.log(`server started at port ${config.port}`);
        agenda.init();
    } catch (error) { logger.error(error); }
});

const ioServer = new IOServer(io);
export {ioServer as ioServer};