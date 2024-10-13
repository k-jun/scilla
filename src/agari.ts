import { Pai } from "./pai.ts";
import { Mentsu } from "./mentsu.ts";

export const AgariKei = (
  { pais, mentsus = [] }: { pais: Array<string>; mentsus: Array<Mentsu> },
): Array<Array<string>> => {
  const agaris: Array<Array<string>> = [];

  // head
  const cnt = pais.reduce<{ [key: string]: number }>((mp, e) => {
    mp[e] = (e in mp) ? mp[e] + 1 : 1;
    return mp;
  }, {});

  const heads = Object.entries(cnt).filter(([_, v]) => v >= 2).map(([k, _]) =>
    k
  );
  for (const head of heads) {
    // mentsu({ m: mc, agari, agaris });
  }
  //
  return agaris;
};

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
// };

// class Agari {
//   constructor(
//     { janto, mentsus }: { janto: Array<string>; mentsus: Array<Mentsu> },
//   ) {
//   }
// }
