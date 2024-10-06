import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { calcFu, Pai } from "../src/main.ts";

Deno.test("calcFu", async () => {
  for await (const dirEntry of Deno.readDir("./test/fixtures/20220101/")) {
    const text = await Deno.readTextFile(
      `./test/fixtures/20220101/${dirEntry.name}`,
    );
    const dom = new JSDOM(text, { contentType: "text/xml" });

    const dfs = (n: Element) => {
      for (let i = 0; i < n.children.length; i++) {
        dfs(n.children[i]);
      }
      if (n.tagName != "AGARI") return;

      console.log(
        new Pai(Number(n.attributes.getNamedItem("machi")?.value)),
      );

      // const attributes: any = {};
      // for (let i = 0; i < n.attributes.length; i++) {
      //   const attr = n.attributes[i];
      //   attributes[attr.name] = attr.value;
      // }
      // console.log(attributes.hai, attributes.ten);

      const args: { pais: Array<Pai>; pai: Pai; is_tsumo: boolean } = {
        pais: n.attributes.getNamedItem("hai")?.value.split(",").map((e) =>
          new Pai(Number(e))
        ) ?? [],
        pai: new Pai(Number(n.attributes.getNamedItem("machi")?.value)) ??
          new Pai(0),
        is_tsumo: true,
      };

      const fu = Number(n.attributes.getNamedItem("ten")?.value.split(",")[0]);
      expect(calcFu(args)).toBe(fu);
    };
    dfs(dom.window.document.documentElement);
  }
});
