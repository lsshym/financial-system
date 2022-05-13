import Dexie, { Table } from 'dexie';

export interface BillDataType {
  id?: number;
  user_id: number;
  name: string;
  principal: number;
  rate: number;
  interest: number;
  settlement: number;
  begin_time: string;
  end_time: string;
  status: boolean;
  remark?: string;
}
export interface UsersDataType {
  user_id?: number;
  name?: string;
}
export class DealSysTableClass extends Dexie {
  billTable!: Table<BillDataType>;
  usersTable!: Table<UsersDataType>;
  constructor(name) {
    super(name);
    this.version(1).stores({
      localVersions: 'matadataid, content, lastversionid, date, time',
      billTable: `++id, user_id, begin_time, end_time`, // Primary key and indexed props
      //   `id, name, principal, rate, settlement,
      //   begin_time, end_time, remark`
      usersTable: '++user_id,&name',
    });
  }
}
const dealDataBase = new DealSysTableClass('bill_sys_database');
const billTable = dealDataBase.billTable;
const usersTable = dealDataBase.usersTable;
export { dealDataBase, billTable, usersTable };
