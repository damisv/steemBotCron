import {Db, MongoClient} from 'mongodb';
import logger from "../util/logger";

class DbClient {
    // MARK: Properties
    private url = 'mongodb://bot:golla1994@ds239071.mlab.com:39071/cronagenda';
    private dbName = 'cronagenda';

    public mongoClient!: MongoClient;
    public db!: Db;

    // MARK: Public methods
    public async connect() {
        try {
            this.mongoClient = await MongoClient.connect(this.url);
            logger.log('Connected successfully to database');
            this.db = this.mongoClient.db(this.dbName);
            await this.createCollections();
            return this.db;
        } catch (error) { console.log('MongoDB url host unreachable!'); }
    }

    // Scan/Query
    public findOne(query: any, collection: string) {
        return this.db.collection(collection).findOne(query);
    }
    public find(query: any, collection: string, projection = {}) {
        return this.db.collection(collection).find(query, projection).toArray();
    }
    // Insert
    public insertOne(data: any, collection: string) {
        return this.db.collection(collection).insertOne(data);
    }
    public insertMany(array: any[], collection: string) {
        return this.db.collection(collection).insertMany(array);
    }
    // Update
    public update(query: any, set: any, collection: string) {
        return this.db.collection(collection).update(query, set);
    }
    public updateOne(query: any, set: any, collection: string) {
        return this.db.collection(collection).updateOne(query, set);
    }
    // Save
    public save(data: any, collection: string) {
        return this.db.collection(collection).save(data);
    }
    // Delete
    public deleteOne(data: any, collection: string) {
        return this.db.collection(collection).deleteOne(data);
    }

    // MARK: Private methods
    private async createCollections() {
        await this.db.createCollection('logs',
            { validator: { $and:
                        [
                            {username: {$exists: true}},
                            {date: {$exists: true}},
                            {logs: {$exists: true}},
                            {errors: {$exists: true}},
                            {finished: {$exists: true}}
                        ]
                }
            });
        await this.db.collection('logs').createIndex({username: 1, date: 1});
    }
}
let DBClient = new DbClient();
export default DBClient;
