import {Server} from "socket.io";
import logger from "../util/logger";

export class SocketServer {
    // MARK: Protected properties
    protected io: Server;

    // MARK: Private properties
    public onlineUsers: {[key: string]: any} = {};

    // MARK: Initialization
    constructor(io: Server) {
        this.io = io;
        this.listen();
    }

    protected listen() {
        this.io.on('connection', (socket: any) => {
            console.log('Connected client');
            socket.emit('connected');
            socket.on('online', (user: string) => {
                logger.log(`${user} connected with socket id: ${socket.id}`);
                this.onlineUsers[user] = socket.id;
            });
        });
    }
}

export interface Log {
    type: string;
    date: Date;
    message: string;
}