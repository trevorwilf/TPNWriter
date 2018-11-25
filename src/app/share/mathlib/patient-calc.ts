import { Component } from '@angular/core';
import { MathConversions } from './math-conversions'

export class patientdemographicscalc {

    static convertepicdatetojs(date:any) {
        //sample "2013-04-04T14:34:00+01:00"  <-- should be standard ISO format for time
        var dt = new Date(Date.parse(date));
        return dt;
    }

    static ageinhours(dob:any) {

        if (Object.prototype.toString.call(dob) === '[object Date]') {
            var dobdate = dob;
            var today = new Date();
            var timediff = Math.abs(dob.getTime() - today.getTime());
            var hours = Math.floor(timediff / (1000 * 3600));
        } else {
            hours = -1;
        }
        return hours;
    }


    static ageindays(dob: any) {
        if (Object.prototype.toString.call(dob) === '[object Date]') {
            var dobdate = dob;
            var today = new Date();
            var timediff = Math.abs(dob.getTime() - today.getTime());
            var days = Math.floor(timediff / (1000 * 3600 * 24));
        } else {
            var days = -1;
        }
        return days;
    }

    static ageinweeks(dob: any) {
      if (Object.prototype.toString.call(dob) === '[object Date]') {
          var dobdate = dob;
          var today = new Date();
          var timediff = Math.abs(dob.getTime() - today.getTime());
          var weeks = Math.floor(timediff / (1000 * 3600 * 24 * 52));
      } else {
        weeks = -1;
      }
      return weeks;
  }

  static ageinmonths(dob: any) {
    if (Object.prototype.toString.call(dob) === '[object Date]') {
        var dobdate = dob;
        var today = new Date();
        var timediff = Math.abs(dob.getMonth() - today.getMonth());
        var month = Math.floor(timediff / (1000 * 3600 * 24 * 52));
    } else {
      month = -1;
    }
    return month;
}

    static ageinyears(dob:any) {
        if (Object.prototype.toString.call(dob) === '[object Date]') {
            var dobdate = dob;
            var today = new Date();
            var timediff = Math.abs(dob.getTime() - today.getTime());
            var years = Math.floor(timediff / (1000 * 3600 * 24 * 365));
        } else {
            years = -1;
        }
        return years;
    }

    static mergeBirthTimeDate(dob:any, tob:any) {
      if (Object.prototype.toString.call(dob) === '[object Date]') {
        if (Object.prototype.toString.call(tob) === '[object Date]') {
          var dobtob = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate(), tob.getHours(), tob.getMinutes(), tob.getSeconds());
        } else {
          dobtob = new Date();
      }
      } else {
        dobtob = new Date();
      }
      return dobtob;
  }

    static reeenergyneeds(weight: number, cm: number = 0,
                          ageinyears: number, gender: string = 'male',
                          equation: number, accuracy: number) {
        // cm height in cm
        // weight in kg
        //  source https://www.uptodate.com/contents/parenteral-nutrition-in-premature-infants
        // premature infants  80 to 100 kcal/kg   <- should we list pramature as a stresser
        // console.log('age in years ', ageinyears)
        if (ageinyears >= 18) {
          switch (equation) {
              // option1: Harris-Benedict equation
              case 1:
                  if (gender === 'male') {
                      //patient is male
                      var ree = 66.5 + (13.75 * weight) + (5.003 * cm) - (6.755 * ageinyears);
                  } else {
                      //patient is female
                      var ree = 655.1 + (9.563 * weight) + (1.850 * cm) - (4.676 * ageinyears);
                  }
                  break;
              //Option2: Roza and Shizgal
              case 2:
                  if (gender == 'male') {
                      //patient is male
                      var ree = 88.362 + (13.397 * weight) + (4.799 * cm) - (5.677 * ageinyears);
                  } else {
                      //patient is female
                      var ree = 447.593 + (9.247 * weight) + (3.098 * cm) - (4.330 * ageinyears);
                  }
                  break;
              //Option3: Mifflin and St Jeor
              case 3:
                  if (gender == 'male') {
                      //patient is male
                      let ree = (10 * weight) + (6.25 * cm) - (5 * ageinyears) + 5;
                  } else {
                      //patient is female
                      let ree = (10 * weight) + (6.25 * cm) - (5 * ageinyears) - 161;
                  }
                  break;
                }
            } else {
                if (ageinyears >= 11) {
                  ree = weight * 40;
                } else {
                  if (ageinyears >= 7) {
                    ree = weight * 60;
                  } else {
                    if (ageinyears >= 1) {
                      ree = weight * 85;
                    } else {
                      // if (ageinyears <= 1) {
                        ree = weight * 110;
                       //}
                    }
                  }
                }
              }

        return MathConversions.roundtoaccuracy(ree, accuracy);

    }

    static calgoalperkg(ree: number, weight: number, accuracy:number = 2) {
      const tempreeperkg = ree / weight;
      return MathConversions.roundtoaccuracy(tempreeperkg, accuracy);
    }

    static reeenergyneedsstresser(ree:number, stresser:number, accuracy:number) {
        // stresserr source https://en.wikipedia.org/wiki/Harris%E2%80%93Benedict_equation
        // Little to no exercise	Daily kilocalories needed = BMR x 1.2
        // Light exercise (1–3 days per week)	Daily kilocalories needed = BMR x 1.375
        // Moderate exercise (3–5 days per week)	Daily kilocalories needed = BMR x 1.55
        // Heavy exercise (6–7 days per week)	Daily kilocalories needed = BMR x 1.725
        // Very heavy exercise (twice per day, extra heavy workouts)	Daily kilocalories needed = BMR x 1.9
        //
        // source https://health.csusb.edu/dchen/368%20stuff/TPN%20calculation.htm
        //  elective surgery  Daily kilocalories needed = BMR x 1.12
        //  severe injury Daily kilocalories needed = BMR x 1.2
        //  extensive trauma/ burn Daily kilocalories needed = BMR x 1.8
        //
        //  source https://www.uptodate.com/contents/parenteral-nutrition-in-premature-infants
        // premature infants
        let newree = ree*stresser;
        return MathConversions.roundtoaccuracy(ree, accuracy);
    }

}

