export const calcFu = (
  { pais, pai, is_tsumo }: {
    pais: Array<Pai>;
    pai: Pai;
    is_tsumo: boolean;
  },
): number => {
  return 40;
};

export const isAgari = (
  { pais }: {
    pais: Array<Pai>;
  },
): boolean => {
  return false;
};

import { paiDsp, pais } from "./constants.ts";

export class Pai {
  id: number;
  val: string;

  constructor(id: number) {
    this.id = id;
    this.val = pais[id];
  }

  get dsp() {
    if (this.val[0] != "z") {
      return this.val;
    }
    return paiDsp[this.val];
  }

  get valNoAka() {
    return this.val[1] != "r" ? this.val : this.val[0] + "5";
  }

  get suit() {
    return this.val[0];
  }

  get num() {
    return (this.suit == "z"
      ? 0
      : (this.val[1] != "r" ? Number(this.val[1]) : 5));
  }
}

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
