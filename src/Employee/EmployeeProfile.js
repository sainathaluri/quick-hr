import React, { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Checkbox,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  DollarOutlined,
  BankOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Sider, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

export default function EmployeeProfile() {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("employee");

  const handleSave = (values) => {
    console.log(values);
    message.success("Employee profile saved successfully");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Sidebar */}
      <Sider width={250} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          style={{ height: "100%", borderRight: 0 }}
          onClick={(e) => setActiveTab(e.key)}
        >
          <Menu.Item key="employee" icon={<UserOutlined />}>
            Employee Info
          </Menu.Item>
          <Menu.Item key="payroll" icon={<DollarOutlined />}>
            Payroll Info
          </Menu.Item>
          <Menu.Item key="access" icon={<IdcardOutlined />}>
            Employee Access
          </Menu.Item>
          <Menu.Item key="deposit" icon={<BankOutlined />}>
            Direct Deposit
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout style={{ padding: "24px" }}>
        <Content>
          <Card style={{ borderRadius: 12 }}>
            <Title level={4} style={{ marginBottom: 20 }}>
              Employee Profile
            </Title>

            <Form layout="vertical" form={form} onFinish={handleSave}>
              {/* ================= EMPLOYEE INFO ================= */}
              {activeTab === "employee" && (
                <>
                  <Title level={5}>Legal Identity</Title>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item name="middleInitial" label="Middle Initial">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="gender"
                    label="Gender for insurance/compliance"
                  >
                    <Select>
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="ssn"
                    label="Social Security Number"
                    rules={[{ required: true }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="dob"
                    label="Date of Birth"
                    rules={[{ required: true }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </>
              )}

              {/* ================= PAYROLL INFO ================= */}
              {activeTab === "payroll" && (
                <>
                  <Title level={5}>Payroll Info</Title>

                  <Form.Item name="payType" label="Pay Type">
                    <Select>
                      <Option value="Salary">Salary</Option>
                      <Option value="Hourly">Hourly</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="paySchedule" label="Pay Schedule">
                    <Select>
                      <Option value="Monthly">Monthly</Option>
                      <Option value="BiWeekly">Bi-Weekly</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="employmentType"
                    label="Employment Type"
                  >
                    <Select>
                      <Option value="FullTime">Full Time</Option>
                      <Option value="PartTime">Part Time</Option>
                    </Select>
                  </Form.Item>

                  <Divider />

                  <Title level={5}>Pay Rate</Title>

                  <Form.Item name="payRateType">
                    <Radio.Group>
                      <Radio value="monthly">Monthly Salary</Radio>
                      <Radio value="annual">Annual Salary</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item name="salary" label="Salary">
                    <Input prefix="$" />
                  </Form.Item>

                  <Divider />

                  <Title level={5}>Workers Compensation</Title>

                  <Form.Item name="state" label="State">
                    <Select>
                      <Option value="Missouri">Missouri</Option>
                      <Option value="Texas">Texas</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="classification" label="Classification Code">
                    <Input />
                  </Form.Item>

                  <Form.Item name="employeeType" label="Employee Type">
                    <Select>
                      <Option value="Neither">Neither</Option>
                      <Option value="Officer">Officer</Option>
                      <Option value="Owner">Owner</Option>
                    </Select>
                  </Form.Item>
                </>
              )}

              {/* ================= EMPLOYEE ACCESS ================= */}
              {activeTab === "access" && (
                <>
                  <Title level={5}>Employee Access</Title>

                  <Form.Item
                    name="allowAccess"
                    valuePropName="checked"
                  >
                    <Checkbox>
                      Allow access to Employee Portal
                    </Checkbox>
                  </Form.Item>

                  <Form.Item name="username" label="User Name">
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="contactEmail"
                    label="Employee Access Contact Email"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="contactPhone"
                    label="Employee Access Contact Phone"
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              {/* ================= DIRECT DEPOSIT ================= */}
              {activeTab === "deposit" && (
                <>
                  <Title level={5}>Direct Deposit</Title>

                  <Form.Item name="bankName" label="Bank Name">
                    <Input />
                  </Form.Item>

                  <Form.Item name="accountType" label="Account Type">
                    <Select>
                      <Option value="Checking">Checking</Option>
                      <Option value="Savings">Savings</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="routingNumber" label="Routing Number">
                    <Input />
                  </Form.Item>

                  <Form.Item name="accountNumber" label="Account Number">
                    <Input.Password />
                  </Form.Item>
                </>
              )}

              <Divider />

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: 200 }}
              >
                Save
              </Button>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}