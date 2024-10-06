// import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";

Deno.test("fukeisan", async () => {
  for await (const dirEntry of Deno.readDir("./test/fixtures/20220101/")) {
    const text = await Deno.readTextFile(
      `./test/fixtures/20220101/${dirEntry.name}`,
    );
    const dom = new JSDOM(text, { contentType: "text/xml" });

    const dfs = (n: Element) => {
      if (n.tagName == "AGARI") {
        console.log(n);
      }
      for (let i = 0; i < n.children.length; i++) {
        dfs(n.children[i]);
      }
    };
    dfs(dom.window.document.documentElement);
  }
});
