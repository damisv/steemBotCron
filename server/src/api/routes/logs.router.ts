import { Router } from 'express';
import {ObjectID} from "bson";
import agenda from "../../agenda/agenda";
import logger from "../../util/logger";
import DBClient from "../../database/dbClient";
import {LogRun} from "../../models/log.model";
const ObjectId = require('mongodb').ObjectID;

let router = Router();

router.post('/', async (req, res) => {
    const acc = req.body.acc;
    let logRuns: {[key: string]: {}} = {};
    try {
        const logList = await DBClient.find({username: acc.user}, 'logs');
        logList.forEach((run: LogRun) => logRuns[run._id] = run);
        res.status(200).send(logRuns);
    } catch (error) { res.status(500).send({err: '500'}); }
});

export let logsRouter = router;
