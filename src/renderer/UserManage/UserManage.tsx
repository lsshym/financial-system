import {
  Button,
  Col,
  DatePicker,
  Input,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import { usersTable, UsersDataType } from 'database/main';
import moment from 'moment';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import './UserManage.scss';
import { DefaultOptionType } from 'antd/lib/select';
import { dateFormat, defaultUser } from 'renderer/App';
interface UserManageProps {
  startTime: string;
  endTime: string;
  setStartTime: Function;
  setEndTime: Function;
  currentUserObj: { user_id: number; name: string };
  setCurrentUserObj: Function;
}
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserManage: FunctionComponent<UserManageProps> = (props) => {
  const { startTime, endTime, setStartTime, setEndTime } = props;
  const { currentUserObj, setCurrentUserObj } = props;

  const [usersArr, setUsersArr] = useState([]);

  const selectAllUsers = useCallback(() => {
    return new Promise((reslove) => {
      usersTable
        .toArray()
        .then((value) => {
          reslove(value);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, []);
  useEffect(() => {
    selectAllUsers().then((value: any) => {
      setUsersArr(value);
    });
  }, []);

  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const addUserHandle = useCallback(() => {
    if (newUserName === '') return;
    usersTable
      .add({
        name: newUserName,
      })
      .then(() => {
        message.success(`新增用户 ${newUserName} 成功`, 3);
        setNewUserName('');
        setAddUserModalVisible(false);
        selectAllUsers().then((value: any) => {
          setUsersArr(value);
        });
      });
  }, [newUserName]);
  // 删除用户
  const [deleteUserId, setDeleteUserId] = useState();
  const [deleteText, setDeleteText] = useState('确认删除??');
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
  const handleDeleteUserModalOk = useCallback(() => {
    if (deleteText !== '确认删除') return;
    setDeleteUserModalVisible(false);
    setDeleteText('确认删除??');
    deleteUserDataBaseById();
  }, [deleteText]);
  const handleDeleteUserModalCancel = useCallback(() => {
    setDeleteUserModalVisible(false);
    setDeleteText('确认删除??');
  }, []);
  const deleteUserDataBaseById = useCallback(() => {
    usersTable.delete(deleteUserId).then(() => {
      message.success(`删除用户成功`, 3);
    });
    selectAllUsers().then((value: any[]) => {
      setUsersArr(value);
      if (deleteUserId === currentUserObj.user_id) {
        setCurrentUserObj(defaultUser);
      }
    });
  }, [deleteUserId]);
  // 时间操作
  const changeTimeRange = useCallback((_, value) => {
    setStartTime(value[0]);
    setEndTime(value[1]);
  }, []);
  useEffect(() => {
    setStartTime(moment().subtract(7, 'days').format(dateFormat));
    setEndTime(moment().add(7, 'days').format(dateFormat));
  }, []);

  return (
    <div className="search-tools">
      <div className="user-search">
        <div className="search-name">
          <span> 按所属人查找：</span>
          <Select
            value={currentUserObj.user_id}
            onChange={(_, item: DefaultOptionType) => {
              setCurrentUserObj({
                name: item.children,
                user_id: item.value,
              });
            }}
            style={{ width: 150 }}
            size="large"
          >
            <Option value={0} key={'all'}>
              {'全部'}
            </Option>
            {usersArr.map((item: UsersDataType) => (
              <Option value={item.user_id} key={item.user_id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="search-time">
          <span> 按时间查找：</span>
          <RangePicker
            value={[moment(startTime), moment(endTime)]}
            onChange={changeTimeRange}
            style={{ width: 300 }}
            size="large"
          />
        </div>
      </div>
      <div className="user-control">
        <Button
          type="primary"
          onClick={() => {
            setAddUserModalVisible(true);
          }}
        >
          新增用户
        </Button>

        <Button
          onClick={() => {
            setDeleteUserId(usersArr[0].user_id);
            setDeleteUserModalVisible(true);
          }}
          type="primary"
          danger
        >
          删除用户
        </Button>
        <Modal
          title="新增用户"
          visible={addUserModalVisible}
          okText={'确定'}
          cancelText={'取消'}
          onOk={addUserHandle}
          onCancel={() => {
            setAddUserModalVisible(false);
            setNewUserName('');
          }}
        >
          <div className="add-new-user">
            <span>请输入用户名：</span>
            <Input
              value={newUserName}
              size="large"
              onChange={(evt) => {
                setNewUserName(evt.target.value);
              }}
              placeholder="新增用户名"
            ></Input>
          </div>
        </Modal>
        <Modal
          title="删除用户"
          visible={deleteUserModalVisible}
          onOk={handleDeleteUserModalOk}
          onCancel={handleDeleteUserModalCancel}
          className={'delete-user-modal'}
          okText={'确定'}
          cancelText={'取消'}
        >
          <div className="delete-div">
            <Row align="middle">
              <Col span={10}>
                <span className="span-name">选择用户：</span>
              </Col>
              <Col span={6}>
                <Select
                  value={deleteUserId}
                  onChange={(value) => {
                    setDeleteUserId(value);
                  }}
                  style={{ width: 200 }}
                  size="large"
                >
                  {usersArr.map((item: UsersDataType) => (
                    <Option value={item.user_id} key={item.user_id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
          <div className="delete-div confirm-delete">
            <Row align="middle">
              <Col span={10}>
                <span className="span-name">请输入“确认删除”：</span>
              </Col>
              <Col span={6}>
                <Input
                  style={{ width: 200 }}
                  size="large"
                  value={deleteText}
                  onChange={(evt) => {
                    setDeleteText(evt.target.value);
                  }}
                ></Input>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserManage;
