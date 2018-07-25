import { Router } from 'express';
import agenda from '../../agenda/agenda';
import {Error, StatusMessages} from "../error";
import logger from "../../util/logger";

let router = Router();

router.post('/', async (req: any, res) => {
    const acc = req.body.acc;
    try {
        const temp = await agenda.getUserJobs({"data.username": acc.user});
        if (temp) { res.status(200).send(temp[0]); return; }
        res.status(404).send(new Error(StatusMessages._404));
    } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

router.post('/create', async (req: any, res) => {
    const job = req.body.job;
    try {
        await agenda.addJob(job.interval, job.name, job.data);
        res.status(204).send();
    } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

router.post('/cancel', async (req: any, res) => {
    try {
        await agenda.cancelJobBy(req.body.id);
        res.status(204).send();
    } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

export let cronRouter = router;
