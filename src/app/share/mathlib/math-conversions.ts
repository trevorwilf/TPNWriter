import { Component } from '@angular/core';

export class MathConversions {

   static roundtoaccuracy(num: number, accuracy: number = 2) {
      const tempnum = Math.round(num *  Math.pow(10, accuracy));
      const w = Number(tempnum /  Math.pow(10, accuracy));
      return w;
    }

    static Milliequivalents(mg: number, valence: number, atomicweight: number) {

        let meq = (mg * valence) / atomicweight;
        return meq;
    }

    static millimoles(mg: number, atomicweight: number) {
        var mm = mg / atomicweight;
        return mm;
    }

    // weights - we convert everything to grams for
    // internal calc.
    static converttokgs(weight: number, fact: number) {
      return weight * fact;
    }

}

