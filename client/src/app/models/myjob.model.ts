export class MyJob {
  constructor(public name: string = 'auto_follow',
              public interval : string = '1 hour',
              public data: MyJobData = new MyJobData()) {}
}

export class MyJobData {
  constructor(public username: string = null,
              public key: string = null,
              public jobName: string = null) {}
}
