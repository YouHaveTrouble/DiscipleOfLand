export default class Zone {

  name: {
    en: string,
  }

  constructor(data: any) {
    this.name = data.name;
  }

}