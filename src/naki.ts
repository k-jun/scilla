import { Pai } from "./pai.ts";

export enum NakiKind {
  CHI = 0,
  PON = 1,
  KAN = 2,
  KAKAN = 3,
  ANKAN = 4,
  MINKAN = 5,
}

export class Naki {
  pais: Array<Pai>;
  kind: NakiKind;
  constructor({ pais, kind }: { pais: Array<Pai>; kind: NakiKind }) {
    this.pais = pais;
    this.kind = kind;
  }
}
