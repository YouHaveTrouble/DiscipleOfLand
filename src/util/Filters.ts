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
        const jobData = data?.jobs || [Job.BOTANIST, Job.MINER];

        for (const job of jobData) {
            const parsedJob = jobFromString(job);
            if (!parsedJob) continue;
            this.jobs.add(parsedJob);
        }

        const nodeTypeData = data?.nodeTypes || [
            NodeType.UNSPOILED,
        ];

        for (const nodeType of nodeTypeData) {
            const parsedNodeType = nodeTypeFromString(nodeType);
            if (!parsedNodeType) continue;
            this.nodeTypes.add(parsedNodeType);
        }

    }

    serialize(): string {
        return JSON.stringify({
            minLevel: this.minLevel,
            maxLevel: this.maxLevel,
            jobs: Array.from(this.jobs).map(job => job),
            nodeTypes: Array.from(this.nodeTypes).map(nodeType => nodeType),
        });
    }

}
