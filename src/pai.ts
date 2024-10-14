const pais = [
  "m1",
  "m1",
  "m1",
  "m1",
  "m2",
  "m2",
  "m2",
  "m2",
  "m3",
  "m3",
  "m3",
  "m3",
  "m4",
  "m4",
  "m4",
  "m4",
  "mr",
  "m5",
  "m5",
  "m5",
  "m6",
  "m6",
  "m6",
  "m6",
  "m7",
  "m7",
  "m7",
  "m7",
  "m8",
  "m8",
  "m8",
  "m8",
  "m9",
  "m9",
  "m9",
  "m9",
  "p1",
  "p1",
  "p1",
  "p1",
  "p2",
  "p2",
  "p2",
  "p2",
  "p3",
  "p3",
  "p3",
  "p3",
  "p4",
  "p4",
  "p4",
  "p4",
  "pr",
  "p5",
  "p5",
  "p5",
  "p6",
  "p6",
  "p6",
  "p6",
  "p7",
  "p7",
  "p7",
  "p7",
  "p8",
  "p8",
  "p8",
  "p8",
  "p9",
  "p9",
  "p9",
  "p9",
  "s1",
  "s1",
  "s1",
  "s1",
  "s2",
  "s2",
  "s2",
  "s2",
  "s3",
  "s3",
  "s3",
  "s3",
  "s4",
  "s4",
  "s4",
  "s4",
  "sr",
  "s5",
  "s5",
  "s5",
  "s6",
  "s6",
  "s6",
  "s6",
  "s7",
  "s7",
  "s7",
  "s7",
  "s8",
  "s8",
  "s8",
  "s8",
  "s9",
  "s9",
  "s9",
  "s9",
  "z1", // 東
  "z1",
  "z1",
  "z1",
  "z2", // 南
  "z2",
  "z2",
  "z2",
  "z3", // 西
  "z3",
  "z3",
  "z3",
  "z4", // 北
  "z4",
  "z4",
  "z4",
  "z5", // 白
  "z5",
  "z5",
  "z5",
  "z6", // 発
  "z6",
  "z6",
  "z6",
  "z7", // 中
  "z7",
  "z7",
  "z7",
];

export enum PaiKind {
  MANZU = "m",
  PINZU = "p",
  SOUZU = "s",
  JIHAI = "z",
}

export const PaiParse = (str: string) => {
  const typ = str[0]
  const num = str[1] == "r" ? "5" : str[1]

  const typIdx = ["m", "p", "s", "z"].findIndex(e => e == typ)
  const numIdx = Number(num) -1
  return new Pai(4 * (typIdx * 9 + numIdx))
};

export class Pai {
  id: number;
  val: string;

  constructor(id: number) {
    this.id = id;
    this.val = pais[id];
  }

  get knd(): PaiKind {
    switch (this.val[0]) {
      case "m":
        return PaiKind.MANZU;
      case "p":
        return PaiKind.PINZU;
      case "s":
        return PaiKind.SOUZU;
      default:
        return PaiKind.JIHAI;
    }
  }
  get num(): number {
    if (this.val[1] == "r") {
      return 5;
    }
    return Number(this.val[1]);
  }

  get fmt(): string {
    return this.knd + this.num.toString();
  }

  get dsp(): string {
    if (this.knd != PaiKind.JIHAI) {
      return this.val
    }
    const mapper: {[key:string]: string} = {
      "z1": "東",
      "z2": "南",
      "z3": "西",
      "z4": "北",
      "z5": "白",
      "z6": "発",
      "z7": "中",
    }
    return mapper[this.val]
  }

  isJihai(): boolean {
    return this.knd == PaiKind.JIHAI ? true : false;
  }
  isSuhai(): boolean {
    return !this.isJihai;
  }
  isYaochuHai(): boolean {
    if (this.isJihai()) {
      return true;
    }
    if (this.num == 9 || this.num == 1) {
      return true;
    }
    return false;
  }
  isChunchanHai(): boolean {
    return !this.isYaochuHai();
  }
  isSangenHai(): boolean {
    if (["z5", "z6", "z7"].includes(this.val)) {
      return true;
    }
    return false;
  }
}
