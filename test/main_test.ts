import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { isAgari, Naki, NakiKind, Pai } from "../src/main.ts";
import { parseNaki, parseYaku } from "./utils.ts";

Deno.test("isAgari", async () => {
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

      let pais = n.attributes.getNamedItem("hai")?.value.split(",").map((e) =>
        new Pai(Number(e))
      ) ?? [];
      pais = pais.concat(
        parseNaki(n.attributes.getNamedItem("m")?.value).map((e) =>
          e.pais
        ).flat(),
      );
      expect(isAgari({ pais })).toBe(true);
      return false;
    };
    dfs(dom.window.document.documentElement);
  }
});
