// this will be moved to the DB
// this is a

export interface BabyFormula {
  $key: string;
  sortorder: number;
  Name: string;
  kcalperoz2: number;
  kcalperdL2: number;
  protein_gperdL: number;
  proteinpercentkcals: number;
  Fat_gperdL: number;
  Fatpercentkcals: number;
  CHO_gperdL: number;
  CHOpercentkcals: number;
  Sodium_mEqperdL: number;
  Sodium_mgperdL: number;
  Potassium_mEqperdL: number;
  Potassium_mgperdL: number;
  Calcium_mgperdL: number;
  Magnesium_mgperdL: number;
  Phosphorus_perdL: number;
  Chloride_mEqperdL: number;
  Chloride_mgperdL: number;
  Zinc_perdL: number;
  VitaminA_IUperdL: number;
  VitaminD_IUperdL: number;
  Iron_perdL: number;
  PotentialRenalSoluteLoadmOsmperdL: number;
  OsmolalitymOsmperKgperHO2: number;
  timestamp: number;
}

export class BabyFormulatable {
  static bformula = {
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
      Name: {title: 'Name' , editable: true, addable: true},
      kcalperoz2: {title: 'energy kcal/oz2' , editable: true, addable: true},
      kcalperdL2: {title: ' energy kcal/dL2' , editable: true, addable: true},
      protein_gperdL: {title: ' protein g/dL' , editable: true, addable: true},
      proteinpercentkcals: {title: ' protein %kcals' , editable: true, addable: true},
      Fat_gperdL: {title: ' Fat g/dL' , editable: true, addable: true},
      Fatpercentkcals: {title: ' Fat % kcals' , editable: true, addable: true},
      CHO_gperdL: {title: ' CHO g/dL' , editable: true, addable: true},
      CHOpercentkcals: {title: ' CHO % kcals' , editable: true, addable: true},
      Sodium_mEqperdL: {title: ' Sodium mEq/dL' , editable: true, addable: true},
      Sodium_mgperdL: {title: ' Sodium mg/dL' , editable: true, addable: true},
      Potassium_mEqperdL: {title: ' Potassium mEq/dL' , editable: true, addable: true},
      Potassium_mgperdL: {title: ' Potassium mg/dL' , editable: true, addable: true},
      Calcium_mgperdL: {title: ' Calcium mg/dL' , editable: true, addable: true},
      Magnesium_mgperdL: {title: ' Magnesium mg/dL' , editable: true, addable: true},
      Phosphorus_perdL: {title: ' Phosphorus mg/dL' , editable: true, addable: true},
      Chloride_mEqperdL: {title: ' Chloride mEq/dL' , editable: true, addable: true},
      Chloride_mgperdL: {title: ' Chloride mg/dL' , editable: true, addable: true},
      Zinc_perdL: {title: ' Zinc mg/dL' , editable: true, addable: true},
      VitaminA_IUperdL: {title: ' Vitamin A IU/dL' , editable: true, addable: true},
      VitaminD_IUperdL: {title: ' Vitamin D IU/dL' , editable: true, addable: true},
      Iron_perdL: {title: ' Iron mg/dL' , editable: true, addable: true},
      PotentialRenalSoluteLoadmOsmperdL: {title: ' Potential Renal Solute Load mOsm/dL' , editable: true, addable: true},
      OsmolalitymOsmperKgperHO2: {title: ' Osmolality mOsm/Kg/HO2' , editable: true, addable: true},
      timestamp: {
        title: 'timestamp',
        editable: false,
        addable: false
      }
    }
  };
}
