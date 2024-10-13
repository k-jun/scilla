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
  MANZU = 2,
  PINZU = 1,
  SOUZU = 0,
  JIHAI = 3,
}

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
    if (this.knd == PaiKind.JIHAI) {
      return 0;
    }
    if (this.val[1] == "r") {
      return 5;
    }
    return Number(this.val[1]);
  }

  get fmt(): string {
    return this.knd + this.num.toString();
  }

  isJihai(): boolean {
    return (this.knd == PaiKind.JIHAI) ? true : false;
  }
  isSuhai(): boolean {
    return !this.isJihai;
  }
}
