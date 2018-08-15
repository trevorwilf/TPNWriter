



export interface ILipids {
  $key: string;

  sortorder: number;
  Name: string;
  default: number;
  percent: number;

  timestamp: number;
}


export class Lipidsngtable {
  static lipids = {
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
      sortorder: {title: 'Sort Order' , editable: true, addable: true},
      name: {title: 'Name' , editable: true, addable: true},
      default: {title: 'default' , editable: true, addable: true},
      percent: {title: 'percent' , editable: true, addable: true},

      timestamp: {
        title: 'timestamp',
        editable: false,
        addable: false
      }
    }
  };
}
