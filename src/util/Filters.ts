import {Job, jobFromString} from "@/enums/Job";

export default class Filters {

    minLevel: number;
    maxLevel: number;
    jobs: Job[] = [];

    constructor(
        data?: {
            minLevel?: number,
            maxLevel?: number,
            jobs?: string[],
        },
    ) {
        this.minLevel = data?.minLevel || 91;
        this.maxLevel = data?.maxLevel || 100;
        const jobData = data?.jobs || [Job.BOTANIST, Job.MINER];

        for (const job of jobData) {
            const parsedJob = jobFromString(job);
            if (!parsedJob) continue;
            this.jobs.push(parsedJob);
        }

    }

}
