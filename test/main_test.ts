import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { AgariKei, Mentsu, MentsuKind, Pai } from "../src/main.ts";
import { parseNaki, parseYaku } from "./test.ts";

Deno.test("AgariKei", async () => {
  for await (const dirEntry of Deno.readDir("./test/fixtures/20220103/")) {
    const text = await Deno.readTextFile(
      `./test/fixtures/20220103/${dirEntry.name}`,
    );
    const dom = new JSDOM(text, { contentType: "text/xml" });

    const dfs = (n: Element) => {
      for (let i = 0; i < n.children.length; i++) {
        if (dfs(n.children[i])) break;
      }
      if (n.tagName == "GO") {
        const taku = Number(n.attributes.getNamedItem("type")?.value);
        if (
          // ありあり四麻
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

      const pais = n.attributes.getNamedItem("hai")?.value.split(",").map((e) =>
        new Pai(Number(e)).fmt
      ) ?? [];
      const nakis = parseNaki(n.attributes.getNamedItem("m")?.value);

      // TODO: exclude 七対子
      const yakus = parseYaku({
        yaku: n.attributes.getNamedItem("yaku")?.value ?? "",
      });

      if (!(yakus.includes("七対子")) && yakus.length != 0) {
        const agaris = AgariKei({ pais, mentsus: [] });
        expect(agaris.length != 0).toBe(true);
      }

      return false;
    };
    dfs(dom.window.document.documentElement);
  }
});
