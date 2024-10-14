import { expect } from "jsr:@std/expect";
import { Mentsu, MentsuKind, NewAgaris, Pai, PaiParse } from "../src/main.ts";

Deno.test("AgariKei", async () => {
  const paiStrs: Array<string> = [
    "m2",
    "m2",
    "m3",
    "m3",
    "m4",
    "m4",
    "m5",
    "m5",
    "p1",
    "p1",
    "p1",
    "s7",
    "s8",
    "s9",
  ];
  const pais = paiStrs.map((e) => PaiParse(e));
  const agaris = NewAgaris({ pais, mentsus: [], agariPai: PaiParse("s9") });
});
