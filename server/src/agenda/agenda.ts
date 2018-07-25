import * as Agenda from 'agenda';
import logger from '../util/logger';
import {SteemController} from '../steem/steem';
import {JobData} from './agenda.model';
import DBClient from '../database/dbClient';
const ObjectID = require('mongodb').ObjectID;

class MyAgenda {
    private agenda!: Agenda;

    public init() {
        this.agenda = new Agenda({db: {address: 'mongodb://bot:golla1994@ds239071.mlab.com:39071/cronagenda'}});
        this.agenda.on('ready', () => {
            this.defineJobs();
            this.agenda.start();
            logger.log('Agenda Started');
        });
    }

    protected defineJobs() {
        this.agenda.define('auto_follow', {priority: 'high', concurrency: 10}, async (job, done) => {
            logger.log(`${job.attrs.data.username} has a cron schedule starting now.`);
            const steemController = new SteemController(job.attrs);
            await steemController.start();
            done();
        });
    }

    // basically agenda.every() but without setting the job type to "single" & multiple definition scheduling
    protected every = (interval: string, job: string, data: JobData, options: any = {}) => {
        return new Promise((resolve, reject) => {
            this.agenda.create(job, data)
                // .schedule('10 minutes')// if you don't want the job to run right away
                .repeatEvery(interval, options)
                .save((err) => err ? reject(err) : resolve());
        });
    };

    protected cancel = (query: any) => {
        return new Promise( (resolve, reject) => {
            this.agenda.cancel(query, () => resolve());
        });
    };

    protected jobs = (query: any) => {
        return new Promise<{}[]>( (resolve, reject) => {
            this.agenda.jobs(query, (err, job) => err ? reject(err): resolve(job));
        });
    };

    public async addJob(interval: string, job: string, data: JobData) {
        const query = {data: data};
        const temp = await this.jobs(query);
        if (temp.length > 0) {
            const previous = JSON.parse(JSON.stringify(temp[0]));
            await this.cancelJobBy(previous._id);
        }
        await this.every(interval, job, data);
    }

    public async getUserJobs(data: {}) {
        return await this.jobs(data);
    }

    public async cancelJobBy(id: string) {
        await this.cancel({_id: ObjectID(id)});
        // const exists = await DBClient.findOne({_id: ObjectID(id)}, 'logs');
        // if (exists !== null) { await DBClient.deleteOne({_id: ObjectID(id)}, 'logs'); }
    }
}

let agenda = new MyAgenda();
export default agenda;
