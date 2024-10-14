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

export enum MatchiKind {
  INVALID = 0,
  RYANMEN = 1,
  KANCHAN = 2,
  PENCHAN = 3,
  SHANPON = 4,
  // using in agari.ts
  TANKIMC = 5,
}

export class Mentsu {
  pais: Array<Pai>;
  kind: MentsuKind;
  constructor({ pais, kind }: { pais: Array<Pai>; kind: MentsuKind }) {
    this.pais = pais;
    this.kind = kind;
  }

  // 0: 待ち無し、1: 両面、2: 嵌張、3: 辺張
  machi({ pai }: { pai: Pai }): MatchiKind {
    if (
      [
        MentsuKind.KAKAN,
        MentsuKind.MINKAN,
        MentsuKind.MINKO,
        MentsuKind.MINSHUN,
        MentsuKind.ANKAN,
      ].includes(this.kind)
    ) {
      return MatchiKind.INVALID;
    }
    const idx = this.pais.findIndex((e) => e.fmt == pai.fmt);
    if (idx != -1 && this.kind == MentsuKind.ANKO) {
      return MatchiKind.SHANPON
    }
    switch (idx) {
      case 0:
        if (this.pais[1].num == 8 && this.pais[2].num == 9 && pai.num == 7) {
          return MatchiKind.PENCHAN;
        }
        return MatchiKind.RYANMEN;
      case 1:
        return MatchiKind.KANCHAN;
      case 2:
        if (pai.num == 3 && this.pais[0].num == 1 && this.pais[1].num == 2) {
          return MatchiKind.PENCHAN;
        }
        return MatchiKind.RYANMEN;
      default:
        return MatchiKind.INVALID;
    }
  }
}
