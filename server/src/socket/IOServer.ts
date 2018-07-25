import {Log, SocketServer} from "./socket.model";
import logger from "../util/logger";

export class IOServer extends SocketServer {
    listen() {
        super.listen();
        // this.io.on('newJob', () => {
        //     agenda.addJob()
        //         .then( () => this.io.emit('agenda', 'Done'))
        //         .catch( () => this.io.emit('agenda', 'ERROR'));
        // });
    }

    sendLog(user: string, log: Log, runID: any) {
        this.io.to(this.onlineUsers[user]).emit('logs', log, runID);
    }
    newRun(user: string, runID: any, logRun: any) {
        this.io.to(this.onlineUsers[user]).emit('newRun', runID, logRun);
    }
    endRun(user: string, runID: any, errors: number) {
        this.io.to(this.onlineUsers[user]).emit('endRun', runID, errors, new Date());
    }
}