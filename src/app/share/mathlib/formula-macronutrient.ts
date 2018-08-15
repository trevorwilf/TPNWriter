import { Component } from '@angular/core';
import { MathConversions } from './math-conversions';

export class MacroNutrient {

    //  Next determine goal energy needs. Upper end of the range for age is 90 kcal/ kg.Given that this infant is underweight,
    //  there is a good chance he will need more than this to gain well.Daily monitoring will be essential to ensure that his
    //  goal TPN is meeting his nutrition goals.Initial kcal goal is 450 kcal/ d.

    ///////////////
    //  generic functions
    static getmacrocal(macro:number, macrocalpergram:number) {
        // returns the calories of the macro
        // x = amount of macro (protein, carb, lipid)
        // y = cal per macro
        var macrocal = macro * macrocalpergram;
        return macrocal;
    }

    static getxgms(macro1:number, macro2:number, macro3cal:number, calgoal:number) {
        //  This is easily done by taking goal calories, subtracting calories provided from protein and lipid, and dividing the remaining calories by 3.4 kcal/gram to get g of dextrose.
        //  450 kcal - 40 kcal (amino acids) - 150 kcal (lipid) = 260 kcal from dextrose 260 kcal/ 3.4 kcal/ gram = 76 grams dextrose. 76 g/ 500 cc TPN = 15.3 %
        //  (can round to nearest .5%, so 15.5%) Start TPN at 10 - 12.5 % and advance by 2.5% qd to goal of 15.5%
        //
        //  x = could be protein, carb or fat
        //  y = could be protein, carb or fat (just not what ever x was)
        //  z = calories per gram of remaining macro (ie what ever x&y was not)
        var gms = (calgoal - macro1 - macro2) / macro3cal;
        return gms;
    }

    ///////////////
    //protein section
    static getproteingoal(weight:number, daysofLife:number, ageinyears: number) {
      // https://www.uptodate.com/contents/parenteral-nutrition-in-infants-and-children
      // Preterm neonate – 3 to 4 g/kg/day
      // Infants (1 to 12 months) – 2 to 3 g/kg/day
      // Children (>10 kg, or age 1 to 10 years) – 1 to 2 g/kg/day
      // Adolescents (11 to 17 years) – 0.8 to 1.5 g/kg/day
      // Adults – 0.83 g/kg/day
      let x = 0;
      if (ageinyears > 18) {
        x = weight * 0.83;
      } else {
        if (ageinyears > 11) {
          x = weight * 1.2;
        } else {
          if (ageinyears > 1) {
            x = weight * 1.5;
          } else {
            if (daysofLife > 31) {
              x = weight * 2.5;
            } else {
                x = weight * 3.5;
            }
          }
        }
      }
        return x;
    }

    static getproteingoalstresser(weight:number, stresser:number) {
        //  Goal for this (5 kg at birth) infant is 2 g/kg = 10 g; 10g/500 cc = 2 %. 10 grams x 4 kcal/g = 40 kcal. http://www.nutritioncare.org/NBPNS/Curriculum_Guide_for_Physician_Nutrition_Specialists/Curriculum_Guide_Table_of_Contents/Nutrition_Support/Pediatric/QUICK_REFERENCE_GUIDE_TO_WRITING_PEDIATRIC_TPN/
        //  Goal for this premature infant (1.5) is 3.5 g/kg = 5.25 g; 10g/500 cc = 1.05 %. 5.25 grams x 4 kcal/g = 21 kcal. https://www.uptodate.com/contents/parenteral-nutrition-in-premature-infants#H5
        //
        var proteingms = weight * stresser;
        return proteingms;
    }

    //  static getproteincal(proteingms, calspergramprotein) {
    //    var proteincal = proteingms * calspergramprotein;
    //    return proteincal;
    //}

    ///////////////
    //lipid section
    static getlipidgoal(weight:number, tolerance:number) {
        // expect all weights to be in grams coming in
        //  http://www.nutritioncare.org/NBPNS/Curriculum_Guide_for_Physician_Nutrition_Specialists/Curriculum_Guide_Table_of_Contents/Nutrition_Support/Pediatric/QUICK_REFERENCE_GUIDE_TO_WRITING_PEDIATRIC_TPN/
        //  Calculate a TPN solution for a 6 mo, 5 kg infant, w/ diarrhea, feeding intolerance, & moderately underweigh
        //  For our patient it is 3.0 g/kg. This is 15 grams
        //  15g x 10 kcal/ g = 150 kcal.
        //  Goal volume of 20% lipid needed is 75 cc.Start with 1g/ kg / day = 5 g/ .2 = 25 cc lipid.
        //  Advance by 1g/ kg daily as tolerated to 3 g/ kg / d.
        //
        //
        var lipidgms = weight * tolerance;
        return lipidgms;

    }


    ///////////////
    //carb section
    static getcarbgoal(calspergramcarb:number, proteincals:number, lipidcals:number, calgoal:number) {
        //  This is easily done by taking goal calories, subtracting calories provided from protein and lipid, and dividing the remaining calories by 3.4 kcal/gram to get g of dextrose.
        //  450 kcal - 40 kcal (amino acids) - 150 kcal (lipid) = 260 kcal from dextrose 260 kcal/ 3.4 kcal/ gram = 76 grams dextrose. 76 g/ 500 cc TPN = 15.3 %
        //  (can round to nearest .5%, so 15.5%) Start TPN at 10 - 12.5 % and advance by 2.5% qd to goal of 15.5%
        const carbsgms = (calgoal - proteincals - lipidcals) / calspergramcarb;
        return carbsgms;

    }


        ///////////////
    // Dextrose to GIR section
    // dextrose comes in as  % dextrose per 100 ml - so D13~ 13gm per 100 ml
    // so to get the gms dextrose per 100 ml, you divide dextrose by 100 then muliply by
    // the volume of fluid to be used.  This gives us the total grams of dextrose.  GIR
    // uses mg, so the value must be multiplied by 1000 to give us the mg.
    static dextrosetoGIR(vol: number, dextrose: number, dosingWeight: number, minutes: number = 1440) {
      const x = ( ((dextrose / 100) * vol * 1000 ) / dosingWeight) / minutes;
      return MathConversions.roundtoaccuracy(x);
      }

    // GIR * dosingWeight * min = (mg/kg/min) * (kg) * (min) =  mg of dextrose
    // (mg of dextrose) / vol = mg/ml  we since are interested in mg*100ml we multiply
    // * 100ml  ~  (mg/ml) * 100ml = 100*mg
    // lastly dextrose is in gm so we need to convert 100*mg to grams by dividing by 10000
    static GIRtoDextros(vol: number, GIR: number, dosingWeight: number, minutes: number = 1440) {
      // works
      const x = ((((GIR * dosingWeight * minutes) / vol) * 100 ) / 1000);
      return MathConversions.roundtoaccuracy(x);
      }

}
