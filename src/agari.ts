import { Pai } from "./pai.ts";
import { Mentsu, MentsuKind } from "./mentsu.ts";

export const NewAgaris = (
  { pais, mentsus = [], agariPai }: {
    pais: Array<Pai>;
    mentsus: Array<Mentsu>;
    agariPai: Pai;
  },
): Array<Agari> => {
  const agaris: Array<Agari> = [];

  const cnt = pais.reduce<{ [key: string]: number }>((mp, e) => {
    mp[e.fmt] = (e.fmt in mp) ? mp[e.fmt] + 1 : 1;
    return mp;
  }, {});

  // 七対子
  if (Object.values(cnt).every((e) => e == 2)) {
    agaris.push(new Chitoitsu({ pais, agariPai }));
    return agaris;
  }

  // head
  const heads = Object.entries(cnt).filter(([_, v]) => v >= 2).map(([k, _]) =>
    k
  );
  for (const head of heads) {
    const paisCopy = [...pais];
    const janto = [];

    janto.push(
      paisCopy.splice(paisCopy.findIndex((e) => e.fmt == head), 1)[0],
    );
    janto.push(
      paisCopy.splice(paisCopy.findIndex((e) => e.fmt == head), 1)[0],
    );
    const patterns = findMentsu({ pais: paisCopy });
    for (const anms of patterns) {
      mentsus.push(...anms);
      agaris.push(new Agari({ janto, mentsus, agariPai }));
    }
  }

  return agaris;
};

const findMentsu = ({ pais }: {
  pais: Array<Pai>;
}): Array<Array<Mentsu>> => {
  const result: Array<Array<Mentsu>> = [];
  const loop = ({ pais, done }: { pais: Array<Pai>; done: Array<Mentsu> }) => {
    if (pais.length == 0) {
      done = done.sort((a, b) => {
        return a.pais[0].fmt < b.pais[0].fmt ? -1 : 1;
      });
      const chkDone = done.map((e) => e.pais).flat().join(",");

      const chkRslt = result.map((e) => e.map((e) => e.pais).flat().join(","));

      if (!chkRslt.includes(chkDone)) {
        result.push(done);
      }
    }

    // 刻子
    const cnt = pais.reduce<{ [key: string]: number }>((mp, e) => {
      mp[e.fmt] = (e.fmt in mp) ? mp[e.fmt] + 1 : 1;
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
        1,
      )[0];
      const b = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == kotsu),
        1,
      )[0];
      const c = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == kotsu),
        1,
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
        1,
      )[0];
      const b = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == shuntsuNext),
        1,
      )[0];
      const c = paisCopy.splice(
        paisCopy.findIndex((e) => e.fmt == shuntsuNextNext),
        1,
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
  constructor(
    { janto, mentsus, agariPai }: {
      janto: Array<Pai>;
      mentsus: Array<Mentsu>;
      agariPai: Pai;
    },
  ) {
    this.janto = janto;
    this.mentsus = mentsus;
    this.agariPai = agariPai;
  }

  clacFu(
    { params }: {
      params: { isTsumo: boolean; bakazePai: Pai; jikazePai: Pai };
    },
  ) {
    let base = 20;

    for (const m of this.mentsus) {
      let x = 0;
      switch (m.kind) {
        case MentsuKind.MINKO:
          x = 2;
          break;
        case MentsuKind.ANKO:
          x = 4;
          break;
        case MentsuKind.MINKAN || MentsuKind.KAKAN:
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
    if (
      this.mentsus.filter(
          (
            e,
          ) =>
            [
              MentsuKind.KAKAN,
              MentsuKind.MINKAN,
              MentsuKind.MINKO,
              MentsuKind.MINSHUN,
            ].includes(e.kind),
        ).length == 0 &&
      params.isTsumo == false
    ) {
      base += 10;
    }
    if (params.isTsumo) {
      base += 2;
    }
    return base;
  }
}

class Chitoitsu extends Agari {
  pais: Array<Pai>;
  constructor({ pais, agariPai }: { pais: Array<Pai>; agariPai: Pai }) {
    super({ janto: [], mentsus: [], agariPai });
    this.pais = pais;
  }
  override clacFu(
    { params }: {
      params: {
        isTsumo: boolean;
        bakazePai: Pai;
        jikazePai: Pai;
      };
    },
  ) {
    return 25;
  }
}
