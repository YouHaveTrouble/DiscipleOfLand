export default class Item {

  readonly id: string;
  readonly name: string;
  readonly level: number;

  constructor(id: string, data: {[key: string]: number | string | undefined}) {
    this.id = id;
    this.name = data?.name as string;
    this.level = data?.level as number;
  }

}

