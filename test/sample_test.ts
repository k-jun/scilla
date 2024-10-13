// import { expect } from "jsr:@std/expect";
// // @deno-types="npm:@types/jsdom"
// import { JSDOM } from "npm:jsdom";
// import { calcFu, Pai } from "../src/main.ts";
//
// Deno.test("calcFu", async () => {
//   for await (const dirEntry of Deno.readDir("./test/fixtures/20220101/")) {
//     const text = await Deno.readTextFile(
//       `./test/fixtures/20220101/${dirEntry.name}`,
//     );
//     const dom = new JSDOM(text, { contentType: "text/xml" });
//
//     const dfs = (n: Element) => {
//       for (let i = 0; i < n.children.length; i++) {
//         dfs(n.children[i]);
//       }
//       if (n.tagName != "AGARI") return;
//
//       const pais = n.attributes.getNamedItem("hai")?.value.split(",").map((e) =>
//         new Pai(Number(e))
//       ) ?? [];
//       const pai = new Pai(Number(n.attributes.getNamedItem("machi")?.value)) ??
//         new Pai(0);
//
//       console.log(n.attributes.item(1)?.name);
//
//       // const args: { pais: Array<Pai>; pai: Pai; is_tsumo: boolean } = {
//       //   pais,
//       //   pai,
//       //   is_tsumo: true,
//       // };
//       //
//       // const fu = Number(n.attributes.getNamedItem("ten")?.value.split(",")[0]);
//       // sm += 1;
//       // if (calcFu(args) == fu) {
//       //   ok += 1;
//       // }
//     };
//     dfs(dom.window.document.documentElement);
//   }
//   // console.log(`正答率: ${(ok / sm * 100).toFixed(2)}%`);
// });
