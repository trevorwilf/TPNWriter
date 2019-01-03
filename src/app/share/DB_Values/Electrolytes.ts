// this will be moved to the DB
// this is a

// export class Electrolytes {
//   static electros = [
//     {
//       $key: '0',
//       electroname: 'PIV',
//       min: 'longterm',
//       max: '850'
//     }
//   ];
// }

export interface Electrolytedetail {
  $key: string;
  electroshortname: string;
  electroname: string;
  minage: number;
  maxmax: number;
  minval: number;
  maxval: number;
  unit: string;
  timestamp: number;
}

export interface IElectrolyte {
  sodium: number;
  totalsodium: number;
  withfeedssodium: number;
  sodiumunit: string;

  potassium: number;
  totalpotassium: number;
  withfeedspotassium: number;
  potassiumunit: string;

  calcium: number;
  totalcalcium: number;
  withfeedscalcium: number;
  calciumunit: string;

  phosphorus: number;
  totalphosphorus: number;
  withfeedsphosphorus: number;
  phosphorusunit: string;

  acetate: number;
  totalacetate: number;
  withfeedsacetate: number;
  maxacetatekg: number;
  maxacetatetotal: number;
  acetateunit: string;

  magnesium: number;
  totalmagnesium: number;
  withfeedsmagnesium: number;
  magnesiumunit: string;

  NaPhosphate: number;
  NaAcetate: number;
  NaChloride: number;

  KPhosphate: number;
  KAcetate: number;
  KChloride: number;

  notes: string;

  required: boolean;
}


export class Electrolytestable {
  static electros = {
    delete: {
      confirmDelete: true
    },
    add: {
      confirmCreate: true
    },
    edit: {
      confirmSave: true
    },
    columns: {
      $key: {
        title: 'key',
        editable: false,
        addable: false
      },
      electroname: {
        title: 'Name',
        editable: true,
        addable: true
      },
      electroshortname: {
        title: 'Abbreviation',
        editable: true,
        addable: true
      },
      minage: {
        title: 'Min Patient Age',
        editable: true,
        addable: true
      },
      maxage: {
        title: 'Max Patient Age',
        editable: true,
        addable: true
      },
      minval: {
        title: 'Min Normal Value',
        editable: true,
        addable: true
      },
      maxval: {
        title: 'Max Normal Value',
        editable: true,
        addable: true
      },
      timestamp: {
        title: 'timestamp',
        editable: false,
        addable: false
      }
    }
  };
}
