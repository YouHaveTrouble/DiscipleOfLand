export default class Aetheryte {

  readonly position: { x: number, y: number, zone: string };
  readonly name: {
    en: string,
  }

  constructor(
    data: any,
  ) {
    this.position = data.position;
    this.name = data.name.en;
  }


}