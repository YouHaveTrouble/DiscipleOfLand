export enum Job {
  BOTANIST = "botanist",
  MINER = "miner",
}

export function jobFromString(str: string): Job | null {
  switch (str.toLowerCase()) {
    case "botanist":
      return Job.BOTANIST;
    case "miner":
      return Job.MINER;
    default:
      return null;
  }
}