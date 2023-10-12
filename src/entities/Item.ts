export default class Item {

  readonly id: string;
  readonly name: string;
  readonly level: number;
  readonly scripType: ScripType | null;

  constructor(id: string, data: {[key: string]: number | string | undefined}) {
    this.id = id;
    this.name = data?.name as string;
    this.level = data?.level as number;
    const scripType: string | undefined = data?.scripType as string;
    if (scripType != undefined) {
      this.scripType = typeof data?.scripType === "string" ? scripType.toUpperCase() as ScripType : null;
    } else {
      this.scripType = null;
    }
  }

}

enum ScripType {
  WHITE = 'white',
  PURPLE = 'purple',
}