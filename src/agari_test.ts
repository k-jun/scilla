import { expect } from "jsr:@std/expect";
import { AgariKei, Mentsu, MentsuKind, Pai } from "../src/main.ts";

Deno.test("AgariKei", async () => {
  const pais = [
    "m1",
    "m2",
    "m3",
    "p5",
    "p5",
    "s3",
    "s4",
    "s5",
    "s6",
    "s6",
    "s6",
    "z5",
    "z5",
    "z5",
  ];
  const agaris = AgariKei({ pais, mentsus: [] });
  expect(agaris.length != 0).toBe(true);
});
