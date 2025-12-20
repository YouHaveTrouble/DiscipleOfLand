import EorzeaTime from "../util/EorzeaTime";

export default class TimeRange {

  private readonly from: [number, number];
  private readonly to: [number, number];

  constructor(fromHour: number, fromMinute: number, toHour: number, toMinute: number) {
    this.from = [fromHour, fromMinute];
    this.to = [toHour, toMinute];
  }

  public isWithinTimeFrame(hour: number, minute: number): boolean {
    return (
        this.from[0] < hour || this.from[0] == hour && this.from[1] <= minute)
        && (hour < this.to[0] || hour == this.to[0] && minute < this.to[1]
      );
  }

  /**
   * Returns a timestamp when the time range will be active again
   */
  public getNextTimeFrame(eorzeaTimeFrom: EorzeaTime): number {
    const targetDate = new Date(eorzeaTimeFrom.eorzeaDate.getTime());
    targetDate.setUTCHours(this.from[0], 0, 0, 0);
    if (eorzeaTimeFrom.getHours() >= this.to[0]) {
      targetDate.setUTCHours(this.from[0] + 24);
    }
    return targetDate.getTime();
  }

    /**
     * Returns the timestamp when the current time range will end
     * @param eorzeaTimeFrom
     */
  public getEndTimeFrame(eorzeaTimeFrom: EorzeaTime): number {
    const targetDate = new Date(eorzeaTimeFrom.eorzeaDate.getTime());
    targetDate.setUTCHours(this.to[0], 0, 0, 0);
    if (eorzeaTimeFrom.getHours() >= this.to[0]) {
      targetDate.setUTCHours(this.to[0] + 24);
    }
    return targetDate.getTime();
  }

}
