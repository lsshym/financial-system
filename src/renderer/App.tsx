import { Button, Table } from 'antd';
import { billTable, dealDataBase } from 'database/main';
import { useEffect, useState } from 'react';
import './App.scss';
import { billTableColumns } from '../database/BillTableConfig';
import UserDataManage from './UserDataManage/UserDataManage';
import UserManage from './UserManage/UserManage';
import moment from 'moment';

export const dateFormat = 'YYYY-MM-DD';

export const defaultUser = {
  user_id: 0,
  name: '全部',
};
export default function App() {
  // 时间
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [data, setData] = useState([]);
  console.log(data);
  // 用户
  const [currentUserObj, setCurrentUserObj] = useState(defaultUser);
  useEffect(() => {
    searchBillTableData().then((arr: []) => {
      setData(arr);
    });
  }, [currentUserObj, startTime, endTime]);
  const addNewDeal = (item) => {
    billTable
      .add({
        // id自动填入
        user_id: item.currentUserObj.user_id,
        name: item.currentUserObj.name,
        principal: item.principal,
        rate: item.rate,
        interest: item.interest,
        settlement: item.settlement,
        begin_time: item.newStartTime,
        end_time: item.newEndTime,
        remark: item.remark,
        status: false,
      })
      .then(() => {
        searchBillTableData().then((arr: []) => {
          setData(arr);
        });
      });
  };
  const searchBillTableData = () => {
    return new Promise((reslove) => {
      billTable
        .where('user_id')
        .equals(currentUserObj.user_id)
        .and((item) => {
          return (
            moment(item.end_time).isBefore(endTime) &&
            moment(item.begin_time).isAfter(startTime)
          );
        })
        .toArray()
        .then((value) => {
          reslove(value);
        });
    });
  };
  useEffect(() => {
    searchBillTableData().then((arr: []) => {
      setData(arr);
    });
  }, []);

  return (
    <div className="app">
      <div className="user-mange-wrap">
        <UserManage
          startTime={startTime}
          endTime={endTime}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          currentUserObj={currentUserObj}
          setCurrentUserObj={setCurrentUserObj}
        ></UserManage>
      </div>
      <div className="curd-wrap">
        <Button
          onClick={() => {
            dealDataBase.delete();
          }}
        >
          清理数据库
        </Button>
        <UserDataManage
          currentUserObj={currentUserObj}
          setCurrentUserObj={setCurrentUserObj}
          addNewDeal={addNewDeal}
        ></UserDataManage>
      </div>
      <Table
        columns={billTableColumns}
        rowKey={'id'}
        dataSource={data}
        scroll={{ y: 240 }}
      ></Table>
    </div>
  );
}
