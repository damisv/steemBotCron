export interface Job {
  _id: any;
  name: string;
  data: {
    username: string,
    key: string,
    jobName: string
  },
  type: string;
  priority: number;
  nextRunAt: Date;
  repeatInterval: string;
  repeatTimezone: any;
  lastModifiedBy: any;
  lastFinishedAt: Date;
  lockedAt: any;
  lastRunAt: Date;
}
