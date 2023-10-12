export default class EorzeaTime {

  /**
   * The real life date
   */
  readonly realDate: Date;

  /**
   * The Eorzean date
   * @private
   */
  readonly eorzeaDate: Date;

  public constructor(realDate: Date = new Date()) {
    this.realDate = realDate;
    this.eorzeaDate = new Date(realDate.getTime() * (3600 / 175));
  }

  /**
   * Returns Eorzean hours
   */
  getHours(): number {
    return this.eorzeaDate.getUTCHours();
  }

  /**
   * Returns Eorzean minutes
   */
  getMinutes(): number {
    return this.eorzeaDate.getUTCMinutes();
  }

  /**
   * Returns Eorzean seconds
   */
  getSeconds(): number {
    return this.eorzeaDate.getUTCSeconds();
  }

  /**
   * Returns Eorzean timestamp
   */
  getTime(): number {
    return this.eorzeaDate.getTime();
  }

  getPrettyTime(): string {
    const hours: string = this.getHours().toString();
    let minutes: string = this.getMinutes().toString();
    if (minutes.length === 1) minutes = '0' + minutes;
    return `${hours}:${minutes}`;
  }

  public static fromRealTime(realDate: Date): EorzeaTime {
    return new EorzeaTime(realDate);
  }

  public static fromEorzeaTime(eorzeaDate: Date): EorzeaTime {
    return new EorzeaTime(new Date(eorzeaDate.getTime() / (3600 / 175)));
  }

}
