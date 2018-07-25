export interface Log {
  type: string;
  date: string;
  message: string;
}

export interface LogRun {
  _id: string;
  _jobId: string;
  date: Date;
  logs: Log[];
  errors: number;
  finished: boolean;
}
