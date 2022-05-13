import { Button, Col, DatePicker, Form, InputNumber, Modal, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import Nzh from 'nzh';
import {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { dateFormat } from 'renderer/App';
import './UserDataManage.scss';
const nzhcn = Nzh.cn;
const { RangePicker } = DatePicker;

interface UserDataManageProps {
  currentUserObj: { user_id: number; name: string };
  setCurrentUserObj: Function;
  addNewDeal: Function;
}

const UserDataManage: FunctionComponent<UserDataManageProps> = (props) => {
  const { currentUserObj } = props;
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);

  // const { principal, interest, settlement, rate } = useMemo(() => {
  //   const { principal = 0, rate } = form.getFieldsValue(['principal', 'rate']);
  //   const interest = principal * (rate / 100) || 0,
  //     settlement = principal + interest || 0;
  //   return {
  //     principal,
  //     rate,
  //     interest,
  //     settlement,
  //   };
  // }, []);
  const handleModalOk = useCallback(() => {
    form
      .validateFields()
      .then((item) => {
        props.addNewDeal({
          currentUserObj,
          principal,
          rate,
          interest,
          settlement,
          newStartTime: item.timeRange[0].format(dateFormat),
          newEndTime: item.timeRange[1].format(dateFormat),
          remark: item.remark,
        });
        setIsModalVisible(false);
      })
      .catch(() => {});
  }, [interest, settlement]);
  return (
    <div className="user-data-manage">
      <div className="add-new-data">
        <Button
          type="primary"
          disabled={currentUserObj.user_id === 0}
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          新增交易
        </Button>
      </div>
      <Modal
        className="new-deal-modal"
        title="新增交易"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        okText={'确定'}
        cancelText={'取消'}
        forceRender={true}
        destroyOnClose={true}
        maskClosable={false}
        width={600}
      >
        <Form
          form={form}
          preserve={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14, offset: 1 }}
          size="large"
          // onValuesChange={(_, allValue) => {
          //   setAllFormData(allValue);
          // }}
        >
          <Form.Item label="用户名">
            <span className="user-name">{currentUserObj.name}</span>
          </Form.Item>
          <Form.Item
            label="本金"
            name="principal"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <InputNumber
              addonAfter="元"
              style={{
                width: '200px',
              }}
              className="principal-input"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              min={0}
              // parser={(value) => parseInt(value.replace(/\$\s?|(,*)/g, ''))}
            />
          </Form.Item>
          <span
            style={{
              display: 'inline-block',
              margin: '0 0 10px 100px',
            }}
          >
            {nzhcn.encodeS(principal || 0)}
          </span>
          <Form.Item
            label="利率"
            name={'rate'}
            rules={[{ required: true, message: '请输入利润' }]}
          >
            <InputNumber
              style={{
                width: '130px',
              }}
              min={0}
              addonAfter="%"
              className="principal-input"
            />
          </Form.Item>
          <Form.Item label="利润金额">
            <span>{`${interest}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}元</span>
            <span> {nzhcn.encodeS(interest || 0)}</span>
          </Form.Item>
          <Form.Item label="总金额">
            <span>
              {`${settlement}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}元
            </span>
            <span> {nzhcn.encodeS(settlement || 0)}</span>
          </Form.Item>
          <Form.Item
            label="结算金额"
            name={'timeRange'}
            rules={[{ required: true, message: '请选择时间' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item label="备注" name={'remark'}>
            <TextArea rows={4} placeholder="备注" maxLength={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDataManage;
