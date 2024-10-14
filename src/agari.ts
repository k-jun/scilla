import { Pai } from "./pai.ts";
import { Mentsu, MentsuKind, MachiKind } from "./mentsu.ts";

export const NewAgaris = ({
  pais,
  mentsus = [],
  agariPai,
}: {
  pais: Array<Pai>;
  mentsus: Array<Mentsu>;
  agariPai: Pai;
}): Array<Agari> => {
  const agaris: Array<Agari> = [];

  const cnt = pais.reduce<{ [key: string]: number }>((mp, e) => {
    mp[e.fmt] = e.fmt in mp ? mp[e.fmt] + 1 : 1;
    return mp;
  }, {});

  // 七対子
  if (Object.values(cnt).every((e) => e == 2)) {
    agaris.push(new Chitoitsu({ pais, agariPai }));
  }

  // head
  const heads = Object.entries(cnt)
    .filter(([_, v]) => v >= 2)
    .map(([k, _]) => k);
  for (const head of heads) {
    const paisCopy = [...pais];
    const janto: Array<Pai> = [];
    janto.push(
      paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == head),
        1
      )[0]
    );
    janto.push(
      paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == head),
        1
      )[0]
    );
    const patterns = findMentsu({ pais: paisCopy });
    for (const anms of patterns) {
      const mentsusCopy = [...mentsus, ...anms];
      agaris.push(new Agari({ janto, mentsus: mentsusCopy, agariPai }));
    }
  }

  return agaris;
};

const findMentsu = ({ pais }: { pais: Array<Pai> }): Array<Array<Mentsu>> => {
  const result: Array<Array<Mentsu>> = [];
  const loop = ({ pais, done }: { pais: Array<Pai>; done: Array<Mentsu> }) => {
    if (pais.length == 0) {
      done = done.sort((a, b) => {
        return a.pais[0].fmt < b.pais[0].fmt ? -1 : 1;
      });
      const chkDone = done
        .map((e) => e.pais)
        .flat()
        .join(",");

      const chkRslt = result.map((e) =>
        e
          .map((e) => e.pais)
          .flat()
          .join(",")
      );

      if (!chkRslt.includes(chkDone)) {
        result.push(done);
      }
    }

    // 刻子
    const cnt = pais.reduce<{ [key: string]: number }>((mp, e) => {
      mp[e.fmt] = e.fmt in mp ? mp[e.fmt] + 1 : 1;
      return mp;
    }, {});
    let kotsu = "";
    for (const [k, v] of Object.entries(cnt)) {
      if (v >= 3) {
        kotsu = k;
        break;
      }
    }
    if (kotsu != "") {
      const paisCopy = [...pais];
      const doneCopy = [...done];
      const a = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == kotsu),
        1
      )[0];
      const b = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == kotsu),
        1
      )[0];
      const c = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == kotsu),
        1
      )[0];
      doneCopy.push(new Mentsu({ pais: [a, b, c], kind: MentsuKind.ANKO }));
      loop({ pais: paisCopy, done: doneCopy });
    }

    // 順子
    let shuntsu = "";
    const fmts = pais.map((e) => e.fmt);
    for (const p of pais) {
      if (p.isJihai() || p.num >= 8) {
        continue;
      }
      const pfmt = p.fmt;
      const pn = pfmt[0] + (Number(pfmt[1]) + 1).toString();
      const pnn = pfmt[0] + (Number(pfmt[1]) + 2).toString();
      if (fmts.includes(pn) && fmts.includes(pnn)) {
        shuntsu = p.fmt;
        break;
      }
    }
    if (shuntsu != "") {
      const paisCopy = [...pais];
      const doneCopy = [...done];
      const shuntsuNext = shuntsu[0] + (Number(shuntsu[1]) + 1).toString();
      const shuntsuNextNext = shuntsu[0] + (Number(shuntsu[1]) + 2).toString();
      const a = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == shuntsu),
        1
      )[0];
      const b = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == shuntsuNext),
        1
      )[0];
      const c = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == shuntsuNextNext),
        1
      )[0];
      doneCopy.push(new Mentsu({ pais: [a, b, c], kind: MentsuKind.ANSHUN }));
      loop({ pais: paisCopy, done: doneCopy });
    }
  };

  loop({ pais, done: [] });
  return result;
};

export class Agari {
  janto: Array<Pai>;
  mentsus: Array<Mentsu>;
  agariPai: Pai;
  constructor({
    janto,
    mentsus,
    agariPai,
  }: {
    janto: Array<Pai>;
    mentsus: Array<Mentsu>;
    agariPai: Pai;
  }) {
    this.janto = janto;
    this.mentsus = mentsus;
    this.agariPai = agariPai;
  }

  machi({ pai }: { pai: Pai }): Array<MachiKind> {
    const mks: Array<MachiKind> = [];
    if (this.janto.find((e) => e.fmt == pai.fmt)) {
      mks.push(MachiKind.TANKIMC);
    }
    for (const m of this.mentsus) {
      const k = m.machi({ pai });
      if (k != MachiKind.INVALID) {
        mks.push(k);
      }
    }
    return mks;
  }

  calcFu({
    params,
  }: {
    params: { isTsumo: boolean; bakazePai: Pai; jikazePai: Pai };
  }): [number, boolean] {
    let base = 20;

    // ピンフ判定
    const isPinhu =
      this.mentsus.every((e) => e.kind == MentsuKind.ANSHUN) &&
      !this.janto[0].isSangenHai() &&
      this.janto[0].fmt != params.bakazePai.fmt &&
      this.janto[0].fmt != params.jikazePai.fmt &&
      this.mentsus.some(
        (e) => e.machi({ pai: this.agariPai }) === MachiKind.RYANMEN
      );

    // ピンフツモ
    if (params.isTsumo && isPinhu) {
      return [20, isPinhu];
    }
    const isMenzen = this.mentsus.every((e) =>
      [MentsuKind.ANKAN, MentsuKind.ANKO, MentsuKind.ANSHUN].includes(e.kind)
    );

    // 待ち
    if (!isPinhu) {
      const machis = this.machi({ pai: this.agariPai });
      if (machis.includes(MachiKind.TANKIMC)) {
        base += 2;
      } else if (machis.includes(MachiKind.KANCHAN)) {
        base += 2;
      } else if (machis.includes(MachiKind.PENCHAN)) {
        base += 2;
      } else if (machis.includes(MachiKind.RYANMEN)) {
      } else if (machis.includes(MachiKind.SHANPON)) {
        const trg = this.mentsus.find(
          (e) => e.machi({ pai: this.agariPai }) == MachiKind.SHANPON
        );
        if (trg && !params.isTsumo) {
          trg.kind = MentsuKind.MINKO;
        }
      }
    }

    for (const m of this.mentsus) {
      let x = 0;
      switch (m.kind) {
        case MentsuKind.MINKO:
          x = 2;
          break;
        case MentsuKind.ANKO:
          x = 4;
          break;
        case MentsuKind.MINKAN:
        case MentsuKind.KAKAN:
          x = 8;
          break;
        case MentsuKind.ANKAN:
          x = 16;
          break;
      }
      if (m.pais[0].isYaochuHai()) {
        x *= 2;
      }
      base += x;
    }
    // 雀頭
    if (this.janto[0].isSangenHai()) {
      base += 2;
    }
    if (this.janto[0].fmt == params.bakazePai.fmt) {
      base += 2;
    }
    if (this.janto[0].fmt == params.jikazePai.fmt) {
      base += 2;
    }

    // 面前
    if (isMenzen && !params.isTsumo) {
      base += 10;
    }
    if (params.isTsumo) {
      base += 2;
    }

    const pnt = Math.floor(base / 10) * 10 + (base % 10 > 0 ? 10 : 0);
    return [Math.max(pnt, 30), isPinhu];
  }
}

class Chitoitsu extends Agari {
  pais: Array<Pai>;
  constructor({ pais, agariPai }: { pais: Array<Pai>; agariPai: Pai }) {
    super({ janto: [], mentsus: [], agariPai });
    this.pais = pais;
  }
  override calcFu({
    params,
  }: {
    params: {
      isTsumo: boolean;
      bakazePai: Pai;
      jikazePai: Pai;
    };
  }): [number, boolean] {
    return [25, false];
  }
}
