// this will be moved to the DB
// this is a

// export class Stressors {
//   static stresss = [
//     {
//       $key: "0",
//       stressname: "starvation",
//       proteinneed: "1.2",
//       coloricneed: "1.2",

//     }
//   ];
// }

export interface Stressors {
  $key: string;
  sortorder: number;
  stressname: string;
  proteinneed: string;
  coloricneed?: string;
  timestamp: number;
}

export class Stressorstable {
  static stress = {
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
      sortorder: {
        title: 'Sort Order',
        editable: true,
        addable: true
      },
      stressname: {
        title: 'Name',
        editable: true,
        addable: true
      },
      proteinneed: {
        title: 'protein need',
        editable: true,
        addable: true
      },
      coloricneed: {
        title: 'coloric need',
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
