import type { NumberKeys } from "../../declarations/types";
import type { Fetus } from "./fetus";

type FetusProps = Exclude<NumberKeys<Fetus>, undefined | "id" | "species">;
/**
 * A Pregnancy is simply a collection of fetuses conceived at the same time and allows be to apply effects equally to related fetuses.
 */
export class Pregnancy {
  fetuses: Map<number /* fetusId */, Fetus> = new Map();
  dateConceived = new Date();

  /**
   * Gets the sum of all stats of a specific fetus.
   *
   * Please be reasonable while using this
   */
  combinedStat(prop: FetusProps) {
    let sum = 0;

    this.fetuses.forEach((fetus) => (sum += fetus[prop]));

    return sum;
  }

  averageStat(prop: FetusProps) {
    const size = this.fetuses.size;
    if (!size) return 0;

    return this.combinedStat(prop) / this.fetuses.size;
  }
}
