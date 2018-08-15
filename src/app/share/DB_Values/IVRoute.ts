// this will be moved to the DB
// this is a

// export class IVRoutes {
//   static ivroutes = [
//     {
//       $key: "0",
//       ivroutename: "PIV",
//       ivroutetype: "Peripheral",
//       duration: "longterm",
//       mosmlimit: "850"
//     },
//     {
//       $key: "1",
//       ivroutename: "Low Line UVC",
//       ivroutetype: "Peripheral",
//       duration: "longterm",
//       mosmlimit: "850"
//     },
//     {
//       $key: "3",
//       ivroutename: "UVC",
//       ivroutetype: "Central",
//       duration: "longterm",
//       mosmlimit: "3000"
//     },
//     {
//       $key: "4",
//       ivroutename: "PICC",
//       ivroutetype: "Central",
//       duration: "longterm",
//       mosmlimit: "3000"
//     },
//     {
//       $key: '5',
//       ivroutename: 'SubClavian',
//       ivroutetype: 'Central',
//       duration: 'longterm',
//       mosmlimit: '3000'
//     },
//     {
//       $key: '6',
//       ivroutename: 'Broviak',
//       ivroutetype: 'Central',
//       duration: 'longterm',
//       mosmlimit: '3000'
//     },
//     {
//       $key: '7',
//       ivroutename: 'UAC',
//       ivroutetype: 'Central',
//       duration: 'longterm',
//       mosmlimit: '3000'
//     }
//   ];
// }

export interface IIVRoutes {
  $key: string;

  sortorder: number;
  ivroutename: string;
  ivroutetype: string;
  duration?: string;
  mosmlimit: string;

  timestamp: number;
}

export class IVRoutesngtable {
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
      sortorder: {
        title: 'Sort Order',
        editable: true,
        addable: true
      },
      ivroutename: {
        title: 'Name',
        editable: true,
        addable: true
      },
      ivroutetype: {
        title: 'Type',
        editable: true,
        addable: true
      },
      duration: {
        title: 'duration',
        editable: true,
        addable: true
      },
      mosmlimit: {
        title: 'Osmolarity',
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
