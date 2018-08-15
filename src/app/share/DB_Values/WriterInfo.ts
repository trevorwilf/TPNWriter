// this will be moved to the DB
// this is a

// export class WriterInfoData {
//   static ivroutes = [
//     {
//       $key: '0',
//       fname: 'PIV',
//       lname: 'Peripheral',
//       phone: 'longterm'
//     },
//     {
//       $key: '1',
//       ivroutename: 'Low Line UVC',
//       ivroutetype: 'Peripheral',
//       duration: 'longterm',
//       mosmlimit: '850'
//     }
//   ];
//  }

export interface WriterInfo {
  $key: string;
  fname: number;
  lname: string;
  email: string;
  phone: string;
  timestamp: number;
}

export class WriterInfotable {
  static ivroutes = {
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
      fname: {
        title: 'Sort Order',
        editable: true,
        addable: true
      },
      lname: {
        title: 'Name',
        editable: true,
        addable: true
      },
      phone: {
        title: 'Type',
        editable: true,
        addable: true
      },
      email: {
        title: 'duration',
        editable: true,
        addable: true
      }
    }
  };
}
