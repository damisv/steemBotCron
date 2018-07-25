import {NextFunction, Response, Router} from 'express';
import {cronRouter, logsRouter} from './routes/';

let router = Router();
router.use('/cron', cronRouter);
router.use('/logs', logsRouter);


export let apiRouter = router;

