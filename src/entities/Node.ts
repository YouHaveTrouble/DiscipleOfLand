import {Job} from "../enums/Job";
import {NodeType} from "../enums/NodeType";
import Item from "./Item";
import Aetheryte from "./Aetheryte";
import TimeRange from "./TimeRange";
import EorzeaTime from "../util/EorzeaTime";

export default class Node {

  readonly job: Job;
  readonly nodeType: NodeType;
  readonly location: { x: number, y: number, zone: string };
  readonly times: Array<TimeRange>;
  readonly nearestAetheryte: Aetheryte;
  readonly items: Item[];

  constructor(
    job: Job,
    nodeType: NodeType,
    location: { x: number, y: number, zone: string },
    times: Array<TimeRange>,
    items: Item[],
    nearestAetheryte: Aetheryte,
  ) {
    this.job = job;
    this.nodeType = nodeType;
    this.location = location;
    this.times = times;
    this.items = items;
    this.nearestAetheryte = nearestAetheryte;
  }

  isActive(eorzeaTime: EorzeaTime): boolean {
    for (const timeRange of this.times) {
      if (timeRange.isWithinTimeFrame(eorzeaTime.getHours(), eorzeaTime.getMinutes())) return true;
    }
    return false;
  }

  getCountdownToActive(eorzeaTime: EorzeaTime): number {
    let countdown: number = Infinity;
    for (const timeRange of this.times) {
      const nextTimeFrame: number = timeRange.getNextTimeFrame(eorzeaTime);
      if (nextTimeFrame < countdown) countdown = nextTimeFrame;
    }
    return countdown;
  }

  getNextActiveTime(eorzeaTime: EorzeaTime): EorzeaTime {
    let countdownTimeStamp: number = Infinity;
    for (const timeRange of this.times) {
      const nextTimeFrame: number = timeRange.getNextTimeFrame(eorzeaTime);
      if (nextTimeFrame < countdownTimeStamp) countdownTimeStamp = nextTimeFrame;
    }
    return EorzeaTime.fromEorzeaTime(new Date(this.getCountdownToActive(eorzeaTime)));
  }

  getSecondsToNextActiveTime(eorzeaTime: EorzeaTime): number {
    return Math.floor((this.getNextActiveTime(eorzeaTime).realDate.getTime() - eorzeaTime.realDate.getTime()) / 1000);
  }

}