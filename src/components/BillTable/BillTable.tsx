import { Button, Table } from 'antd';
import { dataBase } from 'database/main';
import { FunctionComponent } from 'react';
import './BillTable.scss';
import { billTableColumns } from '../../database/BillTableConfig';
interface BillTableProps {}
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
const BillTable: FunctionComponent<BillTableProps> = () => {
  console.log('db', dataBase);
  const btnClick = async () => {
    try {
      const id = await dataBase.billTable.add({
        id: '1',
        name: '张三',
        principal: 10000,
        rate: 0.1,
        settlement: 11000,
        begin_time: '1',
        end_time: '2',
      });
    } catch (error) {
      console.log(error)
    }
  };
  const selectClick = async () => {
    try {
      // const id = await dataBase.BILL_TABLE.
    } catch (error) {
      console.log(error)
    }
  };
  const deleteClick = async () => {
    try {
      const id = await dataBase.billTable.delete('1')
    } catch (error) {
      console.log(error)
    }
  };
  const getAllData = ()=>{
    dataBase.billTable.toArray().then((res)=>{
      console.log(res)
    })
  }
  return (
    <div>
      <Table
        columns={billTableColumns}
        dataSource={data}
        scroll={{ y: 240 }}
      ></Table>
      <Button onClick={btnClick}>Add</Button>
      <Button onClick={selectClick}>select</Button>
      <Button onClick={deleteClick}>delete</Button>
      <Button onClick={getAllData}>getAllData</Button>
    </div>
  );
};

export default BillTable;
