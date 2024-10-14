import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { Mentsu, MentsuKind, NewAgaris, Pai } from "../src/main.ts";
import { parseNaki, parseYaku } from "./utils.ts";

Deno.test("calcHan", async () => {
  for await (const d of Deno.readDir("./test/fixtures/")) {
    for await (const f of Deno.readDir(`./test/fixtures/${d.name}`)) {
      const text = await Deno.readTextFile(
        `./test/fixtures/${d.name}/${f.name}`
      );
      const dom = new JSDOM(text, { contentType: "text/xml" });

      const kazes = [
        new Pai(4 * 3 * 9), // 東
        new Pai(4 * 3 * 9 + 4), // 南
        new Pai(4 * 3 * 9 + 8), // 西
        new Pai(4 * 3 * 9 + 12), // 北
      ];
      let kyoku = 0;
      let bakaze = kazes[0];
      let jikaze = kazes[0];
      const dfs = (n: Element) => {
        for (let i = 0; i < n.children.length; i++) {
          if (dfs(n.children[i])) break;
        }
        if (n.tagName == "GO") {
          const go = Number(n.attributes.getNamedItem("type")?.value);
          if (
            // 赤ドラ
            Boolean(go & (1 << 1)) ||
            // 喰いタン、後付け
            Boolean(go & (1 << 2)) ||
            // 四麻
            Boolean(go & (1 << 4))
          ) {
            return true;
          }
        }
        if (n.tagName == "INIT") {
          const attrs: { [key: string]: string } = {};
          for (let i = 0; i < n.attributes.length; i++) {
            const attr = n.attributes[i];
            attrs[attr.name] = attr.value;
          }
          kyoku = Number(attrs["seed"].split(",")[0]);
          return false;
        }

        if (n.tagName != "AGARI") return false;
        const attrs: { [key: string]: string } = {};
        for (let i = 0; i < n.attributes.length; i++) {
          const attr = n.attributes[i];
          attrs[attr.name] = attr.value;
        }

        const pais =
          attrs["hai"].split(",").map((e: string) => new Pai(Number(e))) ?? [];
        const mentsus = parseNaki(attrs["m"]);
        const agariPai = new Pai(Number(attrs["machi"]));
        const yakus = parseYaku({ yaku: attrs["yaku"] ?? attrs["yakuman"] });

        console.log(
          `pais: ${pais.map((e) => e.val)}, mentsu: ${mentsus
            .map((e) => e.pais)
            .flat().map(e => e.val)
          }, agariPai: ${agariPai.fmt}, yakus: ${yakus}`
        );
        const agaris = NewAgaris({ pais, mentsus, agariPai });
        console.log(agaris)

        const isTsumo = attrs["who"] == attrs["fromWho"];
        bakaze = kazes[Math.floor(kyoku / 4)];
        jikaze = kazes[(Number(attrs["who"]) - (kyoku % 4) + 4) % 4];
        
        const filteredYakus = yakus.filter((e) =>
          [
            "立直",
            "一発",
            "自風 東",
            "自風 南",
            "自風 西",
            "自風 北",
            "場風 東",
            "場風 南",
            "場風 西",
            "場風 北",
            // "役牌 白",
            // "役牌 發",
            // "役牌 中",
          ].includes(e)
        );
        
        if (attrs["yaku"]) {
          const calcYakus = agaris[0].calcHan({
            params: {
              isTsumo,
              isIppatsu: yakus.some((e) => e == "一発"),
              isRiichi: yakus.some((e) => e == "立直"),
              bakazePai: bakaze,
              jikazePai: jikaze,
            },
          });
          console.log(calcYakus, filteredYakus);
          expect(calcYakus.sort()).toEqual(filteredYakus.sort());
        }
        
      };
      dfs(dom.window.document.documentElement);
    }
  }
});
