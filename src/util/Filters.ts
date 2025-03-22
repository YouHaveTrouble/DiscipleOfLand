import {Job, jobFromString} from "@/enums/Job";
import {NodeType, nodeTypeFromString} from "@/enums/NodeType";

export default class Filters {

    minLevel: number;
    maxLevel: number;
    jobs: Set<Job> = new Set();
    nodeTypes: Set<NodeType> = new Set();

    constructor(
        data?: {
            minLevel?: number,
            maxLevel?: number,
            jobs?: string[],
            nodeTypes?: string[],
        },
    ) {
        this.minLevel = data?.minLevel || 91;
        this.maxLevel = data?.maxLevel || 100;
        let jobData = [
            Job.BOTANIST.toLowerCase(),
            Job.MINER.toLowerCase()
        ];
        if (data?.jobs && Array.isArray(data?.jobs) && data?.jobs?.length > 0) {
            jobData = data.jobs;
        }

        for (const job of jobData) {
            const parsedJob = jobFromString(job);
            if (!parsedJob) continue;
            this.jobs.add(parsedJob);
        }

        let nodeTypeData = [
            NodeType.UNSPOILED.toLowerCase(),
        ];
        if (data?.nodeTypes && Array.isArray(data?.nodeTypes) && data?.nodeTypes?.length > 0) {
            nodeTypeData = data.nodeTypes;
        }

        if (Array.isArray(nodeTypeData)) {
            for (const nodeType of nodeTypeData) {
                const parsedNodeType = nodeTypeFromString(nodeType);
                if (!parsedNodeType) continue;
                this.nodeTypes.add(parsedNodeType);
            }
        }


    }

    serialize(): string {
        const serializedJobs = Array.from(this.jobs);
        const serializedNodeTypes = Array.from(this.nodeTypes);

        return JSON.stringify({
            minLevel: this.minLevel,
            maxLevel: this.maxLevel,
            jobs: serializedJobs,
            nodeTypes: serializedNodeTypes,
        });
    }

}
