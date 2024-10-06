export const calcFu = (
  { pais, pai, is_tsumo }: { pais: Array<Pai>; pai: Pai; is_tsumo: boolean },
): number => {
  return 20;
};

import { pais } from "./constants.ts";

export class Pai {
  id: number;
  val: string;

  constructor(id: number) {
    this.id = id;
    this.val = pais[id];
  }
}
