import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { Mentsu, MentsuKind, NewAgaris, Pai } from "../src/main.ts";
import { parseNaki, parseYaku } from "./utils.ts";

Deno.test("Sample", async () => {
  for await (const d of Deno.readDir("./test/fixtures/")) {
    for await (const f of Deno.readDir(`./test/fixtures/${d.name}`)) {
      const text = await Deno.readTextFile(
        `./test/fixtures/${d.name}/${f.name}`,
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
        `./test/fixtures/${d.name}/${f.name}`,
      );
      const dom = new JSDOM(text, { contentType: "text/xml" });
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
        if (n.tagName != "AGARI") return false;
        const attributes: { [key: string]: string } = {};
        for (let i = 0; i < n.attributes.length; i++) {
          const attr = n.attributes[i];
          attributes[attr.name] = attr.value;
        }

        const pais = attributes["hai"].split(",").map((e: string) =>
          new Pai(Number(e))
        ) ?? [];
        const mentsus = parseNaki(attributes["m"]);
        const agariPai = new Pai(Number(attributes["machi"]));
        console.log(
          `pais: ${pais.map((e) => e.fmt)}, mentsus: ${
            mentsus.map((e) => e.pais.map((e) => e.fmt)).join(",")
          }, agariPai: ${agariPai.fmt}`,
        );

        const agaris = NewAgaris({ pais, mentsus, agariPai });
        console.log(agaris);
        //   expect(agaris.length != 0).toBe(true);
        // }
        //
        // return false;
      };
      dfs(dom.window.document.documentElement);
      break;
    }
  }
  // for await (const dirEntry of Deno.readDir("./test/fixtures/20220103/")) {
  //   const text = await Deno.readTextFile(
  //     `./test/fixtures/20220103/${dirEntry.name}`,
  //   );
  //   const dom = new JSDOM(text, { contentType: "text/xml" });
  //
  //   const dfs = (n: Element) => {
  //     for (let i = 0; i < n.children.length; i++) {
  //       if (dfs(n.children[i])) break;
  //     }
  //     if (n.tagName == "GO") {
  //       const taku = Number(n.attributes.getNamedItem("type")?.value);
  //       if (
  //         // ありあり四麻
  //         Boolean(taku & (1 << 4)) || Boolean(taku & (1 << 1)) ||
  //         Boolean(taku & (1 << 2))
  //       ) {
  //         return true;
  //       }
  //     }
  //     if (n.tagName != "AGARI") return false;
  //     const attributes: { [key: string]: string } = {};
  //     for (let i = 0; i < n.attributes.length; i++) {
  //       const attr = n.attributes[i];
  //       attributes[attr.name] = attr.value;
  //     }
  //
  //     const pais = n.attributes.getNamedItem("hai")?.value.split(",").map((e) =>
  //       new Pai(Number(e)).fmt
  //     ) ?? [];
  //     const nakis = parseNaki(n.attributes.getNamedItem("m")?.value);
  //
  //     // TODO: exclude 七対子
  //     const yakus = parseYaku({
  //       yaku: n.attributes.getNamedItem("yaku")?.value ?? "",
  //     });
  //
  //     if (!(yakus.includes("七対子")) && yakus.length != 0) {
  //       const agaris = AgariKei({ pais, mentsus: [] });
  //       expect(agaris.length != 0).toBe(true);
  //     }
  //
  //     return false;
  //   };
  //   dfs(dom.window.document.documentElement);
  // }
});
