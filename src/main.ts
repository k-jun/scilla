export { Pai } from "./pai.ts";
export { Naki, NakiKind } from "./naki.ts";
import { Pai } from "./pai.ts";

export const isAgari = (
  { pais }: {
    pais: Array<Pai>;
  },
): boolean => {
  const process = ({ pais }: { pais: { [key: string]: number } }): boolean => {
    let flag = false;
    // 刻子
    const kotsu = Object.entries(cnt).filter(([_, cnt]) => cnt >= 3).map((
      [key, _],
    ) => key);
    for (const k of kotsu) {
      const paisCopy = { ...pais };
      paisCopy[k] -= 3;
      if (process({ pais: paisCopy })) {
        flag = true;
      }
    }

    const shuntsukamo = Object.entries(cnt).filter((
      [key, cnt],
    ) => (["p", "m", "s"].includes(key[0]) && Number(key[1]) < 8 && cnt > 0))
      .map(([key, _]) => key);
    // const shuntsu = shuntsukamo.filter(e => )

    // 順子
    // if (process({ pais })) {
    //   flag = true;
    // }
    return flag;
  };
  // 雀頭候補
  const cnt: { [key: string]: number } = {};
  // for (const p of pais.map((e) => e.valNoAka)) {
  //   cnt[p] = (p in cnt) ? cnt[p] + 1 : 1;
  // }
  // const atama = Object.entries(cnt).filter(([_, cnt]) => cnt >= 2).map((
  //   [key, _],
  // ) => key);
  // console.log(atama);

  // for (const a of atama) {
  //   const cntCopy = { ...cnt };
  //   cntCopy[a] -= 2;
  //   return process({ pais: cntCopy });
  // }
  return false;
};
