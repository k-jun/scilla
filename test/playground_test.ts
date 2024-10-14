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

