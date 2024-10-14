import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { Mentsu, MentsuKind, NewAgaris, Pai } from "../src/main.ts";
import { parseNaki, parseYaku } from "./utils.ts";

Deno.test("Sample", async () => {
  for await (const d of Deno.readDir("./test/fixtures/")) {
    for await (const f of Deno.readDir(`./test/fixtures/${d.name}`)) {
      const text = await Deno.readTextFile(
        `./test/fixtures/${d.name}/${f.name}`
      );
      const dom = new JSDOM(text, { contentType: "text/xml" });
      const dfs = (n: Element) => {
        expect(1 + 1).toBe(2);
      };
      dfs(dom.window.document.documentElement);
    }
  }
});

Deno.test("NewAgaris", async () => {
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
          console.log(`seed: ${attrs["seed"]}`);
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
        console.log(
          `pais: ${pais.map((e) => e.fmt)}, mentsus: ${mentsus
            .map((e) => e.pais.map((e) => e.fmt))
            .join(",")}, agariPai: ${agariPai.fmt}`
        );

        const agaris = NewAgaris({ pais, mentsus, agariPai });

        const fu = Number(attrs["ten"].split(",")[0]);
        const isTsumo = attrs["who"] == attrs["fromWho"];
        bakaze = kazes[Math.floor(kyoku / 4)];
        jikaze = kazes[(Number(attrs["who"]) - (kyoku % 4) + 4) % 4];

        const yakus = parseYaku({ yaku: attrs["yaku"] ?? attrs["yakuman"] });
        console.log(`yakus: ${yakus}`);

        const calcFuPinhuOk: Array<number> = [];
        const calcFuPinhuNg: Array<number> = [];
        agaris.forEach((e) => {
          const [pnt, isPinhu] = e.calcFu({
            params: {
              isTsumo,
              bakazePai: bakaze,
              jikazePai: jikaze,
            },
          });
          if (isPinhu) {
            calcFuPinhuOk.push(pnt);
          } else {
            calcFuPinhuNg.push(pnt);
          }
        });
        const calcFu = (calcFuPinhuOk.length > 0) ? Math.max(0, ...calcFuPinhuOk) : Math.max(0, ...calcFuPinhuNg)
        expect(calcFu).toBe(fu);
        // console.log(agaris);
        //   expect(agaris.length != 0).toBe(true);
        // }
        //
        // return false;
      };
      dfs(dom.window.document.documentElement);
    }
  }
});
