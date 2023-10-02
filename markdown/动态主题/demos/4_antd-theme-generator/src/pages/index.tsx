import React from 'react';
import {
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  Rate,
  Space,
  Divider,
  Alert,
  Dropdown,
} from 'antd';

const { Option } = Select;
import './index.less';

const items = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

export default function IndexPage() {
  // 点击按钮切换主题
  const btnCallback = () => {
    less.modifyVars({
      '@primary-color': '#002766', // 全局主色
      '@link-color': '#002766', // 链接色
      '@success-color': '#092b00', // 成功色
      '@warning-color': '#613400', // 警告色
      '@error-color': '#5c0011', // 错误色
      '@font-size-base': '16px', // 主字号
      '@heading-color': 'rgba(0, 0, 0, 0.45)', // 标题色
      '@text-color': 'rgba(0, 0, 0, 0.35)', // 主文本色
      '@text-color-secondary': 'rgba(0, 0, 0, 0.25)', // 次文本色
      '@disabled-color': 'rgba(0, 0, 0, 0.15)', // 失效色
      '@border-radius-base': '4px', // 组件/浮层圆角
      '@border-color-base': '#8c8c8c', // 边框色
      '@box-shadow-base': '0 4px 8px -4px rgba(0, 0, 0, 0.22)', // 浮层阴影
    });
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  return (
    <div>
      <div className="contaienr_item">
        <Button type="primary" onClick={btnCallback}>
          点击按钮切换主题
        </Button>
        <Button type="link">Link Button</Button>
        <Button type="default">default Button</Button>
        <Button type="primary" disabled>
          disabled Button
        </Button>
      </div>

      <div>
        <Alert message="Success Text" type="success" />
        <Alert message="Info Text" type="info" />
        <Alert message="Warning Text" type="warning" />
        <Alert message="Error Text" type="error" />
      </div>

      <Dropdown menu={{ items }} trigger={['contextMenu']}>
        <div
          className="site-dropdown-context-menu"
          style={{
            textAlign: 'center',
            height: 200,
            lineHeight: '200px',
          }}
        >
          Right Click on here
        </div>
      </Dropdown>

      <Divider style={{ marginBottom: 60 }}>Form</Divider>

      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} onFinish={onFinish}>
        <Form.Item label="数字输入框">
          <InputNumber min={1} max={10} defaultValue={3} />
          <span className="ant-form-text"> 台机器</span>
          <a href="https://ant.design">链接文字</a>
        </Form.Item>
        <Form.Item label="开关">
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item label="滑动输入条">
          <Slider defaultValue={70} />
        </Form.Item>
        <Form.Item label="选择器">
          <Select defaultValue="lucy" style={{ width: 192 }}>
            <Option value="jack">jack</Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>
              disabled
            </Option>
            <Option value="yiminghe">yiminghe</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="日期选择框"
          name="time"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item label="日期范围选择框">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label="评分">
          <Rate defaultValue={5} />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
