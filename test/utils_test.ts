import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { Mentsu, MentsuKind, Pai } from "../src/main.ts";
import { parseNaki, parseYaku } from "./utils.ts";

const validPais = (
  { pais, nakis, yakus }: {
    pais: Array<Pai>;
    nakis: Array<Mentsu>;
    yakus: Array<string>;
  },
): boolean => {
  // dupcalited id of pais
  const ids = [...pais, ...nakis.map((e) => e.pais).flat()].map((e) => e.id);
  const idsSet = new Set(ids);
  if (ids.length != idsSet.size) {
    return false;
  }

  // must have yaku
  if (yakus.length == 0) {
    return false;
  }

  // count of pais and nakis
  const cnt = pais.length + nakis.length * 3;
  if (cnt != 14) {
    return false;
  }

  // richi without nakis
  if (yakus.includes("立直")) {
    if (nakis.filter((e) => e.kind != MentsuKind.ANKAN).length > 0) {
      return false;
    }
  }

  // tanyao without yaochu-pai
  if (yakus.includes("断幺九")) {
    const cnt = pais.filter((e) => e.val[1] == "1" || e.val[1] == "9").length;
    const nakicnt = nakis.map((e) =>
      e.pais
    ).flat().filter((e) => e.val[1] == "1" || e.val[1] == "9").length;
    if (cnt != 0 || nakicnt != 0) {
      return false;
    }
  }

  // kazeyaku
  const map = {
    "自風 東": "z1",
    "自風 南": "z2",
    "自風 西": "z3",
    "自風 北": "z4",
    "役牌 白": "z5",
    "役牌 發": "z6",
    "役牌 中": "z7",
  };
  for (const [k, v] of Object.entries(map)) {
    if (yakus.includes(k)) {
      const x = [...pais, ...nakis.map((e) => e.pais).flat()].map((e) => e.val);
      if (!(x.includes(v))) {
        return false;
      }
    }
  }
  // chitoitsu
  if (yakus.includes("七対子")) {
    const x: { [key: string]: number } = {};
    for (
      const e of pais.map((e) => e.val[0] + (e.val[1] == "r" ? 5 : e.val[1]))
    ) {
      if (e in x) {
        x[e]++;
      } else {
        x[e] = 1;
      }
    }
    for (const [_, v] of Object.entries(x)) {
      if (v != 2) {
        return false;
      }
    }
  }

  // chanta
  if (yakus.includes("混全帯幺九")) {
    const x = [...pais, ...nakis.map((e) => e.pais).flat()];
    if (
      x.filter((e) =>
        e.val[1] == "z" ? false : (e.num <= 3 || e.num >= 7) ? false : true
      ).length != 0
    ) {
      return false;
    }
  }

  // akadora
  if (yakus.includes("赤ドラ")) {
    const x = [...pais, ...nakis.map((e) => e.pais).flat()].map((e) => e.val);
    if (!x.includes("pr") && !x.includes("mr") && !x.includes("sr")) {
      return false;
    }
  }
  return true;
};

Deno.test("parseNaki", async () => {
  for await (const dirEntry of Deno.readDir("./test/fixtures/20220101/")) {
    const text = await Deno.readTextFile(
      `./test/fixtures/20220101/${dirEntry.name}`,
    );
    const dom = new JSDOM(text, { contentType: "text/xml" });

    const dfs = (n: Element) => {
      for (let i = 0; i < n.children.length; i++) {
        if (dfs(n.children[i])) break;
      }
      if (n.tagName == "GO") {
        const taku = Number(n.attributes.getNamedItem("type")?.value);
        // ありあり四麻
        if (
          Boolean(taku & (1 << 4)) || Boolean(taku & (1 << 1)) ||
          Boolean(taku & (1 << 2))
        ) {
          return true;
        }
      }
      if (n.tagName != "AGARI") return false;
      const attributes: { [key: string]: string } = {};
      for (let i = 0; i < n.attributes.length; i++) {
        const attr = n.attributes[i];
        attributes[attr.name] = attr.value;
      }
      let yaku = n.attributes.getNamedItem("yaku")?.value ?? "";
      yaku += n.attributes.getNamedItem("yakuman")?.value ?? "";
      const yakus = parseYaku({ yaku });

      const pais = n.attributes.getNamedItem("hai")?.value.split(",").map((e) =>
        new Pai(Number(e))
      ) ?? [];
      const nakis = parseNaki(n.attributes.getNamedItem("m")?.value ?? "") ??
        [];
      expect(validPais({ pais, nakis, yakus })).toBe(true);
      return false;
    };
    dfs(dom.window.document.documentElement);
  }
});
