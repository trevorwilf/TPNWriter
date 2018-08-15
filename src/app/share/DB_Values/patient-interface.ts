// patient example fhir
// http://hl7.org/fhir/DSTU2/patient-example.xml.html
// http://hl7.org/fhir/patient-example.html
// http://hl7.org/fhir/patient-example.xml.html

export interface IPatient {
  id: string;
  MRN: string;
  CSN: string;
  roomnumber: string;
  given: string;
  family: string;
  birthTime?: string;
  birthDate: string;
  daysofLife: number;
  weeksofLife: number;
  monthsofLife: number;
  yearsofLife: number;
  gender: string;
  gestationalAge?: number;
  birthWeight?: number;
  bodyweightunits?: string;
  height?: number;
  heightunits?: string;
  stressers?: string;
  notes: string;
  required: boolean;
}
