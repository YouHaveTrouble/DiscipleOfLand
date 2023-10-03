export default class Item {

  readonly id: string;
  readonly name: string;
  readonly level: number;
  readonly scripType: ScripType;

  constructor(id: string, data: any) {
    this.id = id;
    this.name = data?.name;
    this.level = data?.level;
    this.scripType = data?.scripType ? ScripType[data.scripType.toUpperCase()] : null;
  }

}

enum ScripType {
  WHITE = 'white',
  PURPLE = 'purple',
}