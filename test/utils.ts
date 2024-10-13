import { Mentsu, MentsuKind, Pai } from "../src/main.ts";

export const parseNaki = (m: string = ""): Array<Mentsu> => {
  const parser = (m: number): Mentsu => {
    const kui = m & 3;
    // 0: 鳴きなし、1: 下家、2: 対面、3: 上家。
    if (m & (1 << 2)) {
      // 順子
      let t = (m & 0xFC00) >> 10;
      const r = t % 3;
      t = Math.floor(t / 3);
      t = Math.floor(t / 7) * 9 + t % 7;
      t *= 4;
      const h = [
        t + 4 * 0 + ((m & 0x0018) >> 3),
        t + 4 * 1 + ((m & 0x0060) >> 5),
        t + 4 * 2 + ((m & 0x0180) >> 7),
      ];

      switch (r) {
        case 1:
          h.unshift(h.splice(1, 1)[0]);
          break;
        case 2:
          h.unshift(h.splice(2, 1)[0]);
          break;
      }
      const pais = h.map((e) => new Pai(e));
      return new Mentsu({ kind: MentsuKind.MINSHUN, pais });
    } else if (m & (1 << 3) || m & (1 << 4)) {
      // 刻子、加槓
      const extra = (m & 0x0060) >> 5;
      let t = (m & 0xFE00) >> 9;
      const r = t % 3;
      t = Math.floor(t / 3);
      t *= 4;
      const h = [t, t, t];
      switch (extra) {
        case 0:
          h[0] += 1;
          h[1] += 2;
          h[2] += 3;
          break;
        case 1:
          h[0] += 0;
          h[1] += 2;
          h[2] += 3;
          break;
        case 2:
          h[0] += 0;
          h[1] += 1;
          h[2] += 3;
          break;
        case 3:
          h[0] += 0;
          h[1] += 1;
          h[2] += 2;
          break;
      }
      switch (r) {
        case 1:
          h.unshift(h.splice(1, 1)[0]);
          break;
        case 2:
          h.unshift(h.splice(2, 1)[0]);
          break;
      }
      if (m & (1 << 3)) {
        // 刻子
        if (kui < 3) h.unshift(h.splice(2, 1)[0]);
        if (kui < 2) h.unshift(h.splice(2, 1)[0]);
        const pais = h.map((e) => new Pai(e));
        return new Mentsu({ kind: MentsuKind.MINKO, pais });
      } else {
        // 加槓
        if (kui < 3) h.unshift(h.splice(2, 1)[0]);
        if (kui < 2) h.unshift(h.splice(2, 1)[0]);
        h.unshift(t + extra);
        const pais = h.map((e) => new Pai(e));
        return new Mentsu({ kind: MentsuKind.KAKAN, pais });
      }
    } else {
      let hai0 = (m & 0xFF00) >> 8;
      const t = Math.floor(hai0 / 4) * 4;
      if (kui == 0) {
        const h = [t, t + 1, t + 2, t + 3];
        const pais = h.map((e) => new Pai(e));
        return new Mentsu({ kind: MentsuKind.ANKAN, pais });
        // 暗槓
      } else {
        // 大明槓
        const h = [t, t, t];
        switch (hai0 % 4) {
          case 0:
            h[0] += 1;
            h[1] += 2;
            h[2] += 3;
            break;
          case 1:
            h[0] += 0;
            h[1] += 2;
            h[2] += 3;
            break;
          case 2:
            h[0] += 0;
            h[1] += 1;
            h[2] += 3;
            break;
          case 3:
            h[0] += 0;
            h[1] += 1;
            h[2] += 2;
            break;
        }
        if (kui == 1) {
          const a = hai0;
          hai0 = h[2];
          h[2] = a;
        }
        if (kui == 2) {
          const a = hai0;
          hai0 = h[0];
          h[0] = a;
        }
        h.unshift(hai0);
        const pais = h.map((e) => new Pai(e));
        return new Mentsu({ kind: MentsuKind.MINKAN, pais });
      }
    }
  };
  if (m == "") {
    return [];
  }
  return m.split(",").map((e) => Number(e)).map((e) => parser(e));
};

const yakus = [
  "門前清自摸和",
  "立直",
  "一発",
  "槍槓",
  "嶺上開花",
  "海底摸月",
  "河底撈魚",
  "平和",
  "断幺九",
  "一盃口",
  "自風 東",
  "自風 南",
  "自風 西",
  "自風 北",
  "場風 東",
  "場風 南",
  "場風 西",
  "場風 北",
  "役牌 白",
  "役牌 發",
  "役牌 中",
  "両立直",
  "七対子",
  "混全帯幺九",
  "一気通貫",
  "三色同順",
  "三色同刻",
  "三槓子",
  "対々和",
  "三暗刻",
  "小三元",
  "混老頭",
  "二盃口",
  "純全帯幺九",
  "混一色",
  "清一色",
  "",
  "天和",
  "地和",
  "大三元",
  "四暗刻",
  "四暗刻単騎",
  "字一色",
  "緑一色",
  "清老頭",
  "九蓮宝燈",
  "純正九蓮宝燈",
  "国士無双",
  "国士無双１３面",
  "大四喜",
  "小四喜",
  "四槓子",
  "ドラ",
  "裏ドラ",
  "赤ドラ",
];

export const parseYaku = ({ yaku }: { yaku: string }): Array<string> => {
  if (yaku == "") {
    return [];
  }
  const ys = yaku.split(",");
  const vs = [];
  for (let i = 0; i < ys.length; i++) {
    if (i % 2 == 1) {
      continue;
    }
    vs.push(yakus[Number(ys[i])]);
  }

  return vs;
};
