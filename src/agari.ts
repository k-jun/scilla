import { Pai } from "./pai.ts";
import { Mentsu } from "./mentsu.ts";

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
    console.log(`head: ${head}`);
    const paisCopy = [...pais];
    const paisDone = [];
    // mentsu({ m: mc, agari, agaris });
  }

  // const mentsu = (
  //   { pais, agari, agaris }: {
  //     pais: Array<string>;
  //     agari: Array<string>;
  //     agaris: Array<Array<string>>;
  //   },
  // ) => {
  //   if (Object.values(m).every((e) => e == 0)) {
  //     agaris.push(agari);
  //     return;
  //   }
  //
  //   // kotsu
  //   const kotsus = Object.entries(m).filter(([_, v]) => v >= 3).map(([k, _]) =>
  //     k
  //   );
  //   for (const k of kotsus) {
  //     const mc = { ...m };
  //     const ac = [...agari];
  //     ac.push(k, k, k);
  //     mc[k] -= 3;
  //     mentsu({ m: mc, agari: ac, agaris });
  //     break;
  //   }
  //   const shuntsukamo = Object.entries(m).filter(([k, _]) =>
  //     k[0] != "z" && Number(k[1]) <= 7
  //   ).map(([k, _]) => k);
  //   const shuntsu = shuntsukamo.filter((e) => {
  //     const nxt = e[0] + (Number(e[1]) + 1).toString();
  //     const nxt2 = e[0] + (Number(e[1]) + 2).toString();
  //     if (nxt in m && nxt2 in m) {
  //       if (m[e] >= 1 && m[nxt] >= 1 && m[nxt2] >= 1) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   });
  //   for (const s of shuntsu) {
  //     const nxt = s[0] + (Number(s[1]) + 1).toString();
  //     const nxt2 = s[0] + (Number(s[1]) + 2).toString();
  //     const mc = { ...m };
  //     const ac = [...agari];
  //     ac.push(s, nxt, nxt2);
  //     mc[s] -= 1;
  //     mc[nxt] -= 1;
  //     mc[nxt2] -= 1;
  //     mentsu({ m: mc, agari: ac, agaris });
  //     break;
  //   }
  return agaris;
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
}

class Chitoitsu extends Agari {
  pais: Array<Pai>;
  constructor({ pais, agariPai }: { pais: Array<Pai>; agariPai: Pai }) {
    super({ janto: [], mentsus: [], agariPai });
    this.pais = pais;
  }
}
