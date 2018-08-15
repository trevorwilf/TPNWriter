// this will be moved to the DB
// this is a

export interface Additivedetail {
  $key: string;
  electroshortname: string;
  minage: number;
  maxmax: number;
  minval: number;
  maxval: number;
  timestamp: number;
}

export interface IAdditive {
  heparin: number;
  heparinunit: string;
  multiVitamin: boolean;
  traceelements: boolean;
  zinc: boolean;
  ironeDextran: number;
  ironeDextranunit: string;
  carnitine: number;
  carnitineunit: string;
  selenium: number;
  seleniumunit: string;
  famotidine: number;
  famotidineunit: string;
  notes: string;

  required: boolean;
}


export class Additivetable {
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
