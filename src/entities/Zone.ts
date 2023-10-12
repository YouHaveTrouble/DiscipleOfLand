export default class Zone {

  name: {
    en: string,
  }

  constructor(data: {name: {en: string}}) {
    this.name = {
      en: data.name.en
    };
  }

}
