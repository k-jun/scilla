import { Pai } from "./pai.ts";

export enum MentsuKind {
  MINSHUN = 1,
  MINKO = 2,
  MINKAN = 3,

  ANSHUN = 4,
  ANKO = 5,
  ANKAN = 6,

  KAKAN = 7,
}

export class Mentsu {
  pais: Array<Pai>;
  kind: MentsuKind;
  constructor({ pais, kind }: { pais: Array<Pai>; kind: MentsuKind }) {
    this.pais = pais;
    this.kind = kind;
  }
}
