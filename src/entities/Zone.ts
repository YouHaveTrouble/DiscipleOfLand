import Aetheryte from "@/entities/Aetheryte";

export default class Zone {

  name: {
    en: string,
  }

  aetherytes: Array<Aetheryte> = [];

  constructor(data: {name: {en: string}, aetherytes: Array<{position: {x: number, y: number, zone: string}, name: {en: string}}>}) {
    this.name = {
      en: data.name.en
    };
    if (!Array.isArray(data.aetherytes)) return;
    for (const aetheryte of data.aetherytes) {
      this.aetherytes.push(new Aetheryte(aetheryte));
    }
  }

}
