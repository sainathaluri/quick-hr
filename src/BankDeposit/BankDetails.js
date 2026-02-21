import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Typography,
} from "antd";
import { BsBank2 } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";

const { Title } = Typography;
const { Option } = Select;

const apiUrl = process.env.REACT_APP_API_URL;

export default function BankDetails() {
  const { employeeId } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/employees/${employeeId}/bank-details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      message.error("Failed to fetch bank accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!isEditMode && accounts.length >= 4) {
        return message.error("Maximum 4 bank accounts allowed");
      }

      setLoading(true);

      const url = isEditMode
        ? `${apiUrl}/employees/${employeeId}/bank-details/${editingId}`
        : `${apiUrl}/employees/${employeeId}/bank-details`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Operation failed");

      message.success(
        isEditMode
          ? "Bank account updated successfully"
          : "Bank account added successfully"
      );

      setVisible(false);
      form.resetFields();
      setIsEditMode(false);
      setEditingId(null);
      fetchAccounts();
    } catch (error) {
      message.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditingId(record.id);

    form.setFieldsValue({
      bankName: record.bankName,
      accountType: record.accountType,
      routingNumber: record.routingNumber,
      accountNumber: record.accountNumber,
      depositDistribution: record.depositDistribution,
      amount: record.amount,
      accountNickname: record.accountNickname,
    });

    setVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/employees/${employeeId}/bank-details/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      message.success("Deleted successfully");
      fetchAccounts();
    } catch (error) {
      message.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
    },
    {
      title: "Routing Number",
      dataIndex: "routingNumber",
    },
    {
      title: "Account Number",
      render: (record) =>
        record.accountNumber
          ? `****${record.accountNumber.slice(-4)}`
          : "",
    },
    {
      title: "Distribution",
      dataIndex: "depositDistribution",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (val, record) =>
        record.depositDistribution === "FULL_NET"
          ? "Full Net"
          : val
          ? `$${val}`
          : "-",
    },
    {
      title: "Actions",
      render: (record) => (
        <Space>
          <FiEdit2
            title="Edit"
            style={{ cursor: "pointer", color: "#4f46e5" }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete account?"
            onConfirm={() => handleDelete(record.id)}
          >
            <AiFillDelete
              title="Delete"
              style={{ cursor: "pointer", color: "red" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ borderRadius: 12 }}>
      <Title level={4} style={{ textAlign: "center", color: "#4f46e5" }}>
        <BsBank2 /> Direct Deposit
      </Title>

      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setIsEditMode(false);
            form.resetFields();
            setVisible(true);
          }}
          disabled={accounts.length >= 4}
        >
          Add Account
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={accounts}
        loading={loading}
        rowKey="id"
        bordered
      />

      <Modal
        title={isEditMode ? "Edit Bank Account" : "Add Bank Account"}
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="bankName"
            label="Bank Name"
            rules={[{ required: true, message: "Bank name required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="accountType"
            label="Account Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="CHECKING">Checking</Option>
              <Option value="SAVINGS">Savings</Option>
              <Option value="PAYCARD">Paycard</Option>
              <Option value="PRELOADED_DEBIT_CARD">
                Preloaded Debit Card
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="routingNumber"
            label="Routing Number"
            rules={[
              { required: true },
              { len: 9, message: "Routing number must be 9 digits" },
            ]}
          >
            <Input maxLength={9} />
          </Form.Item>

          <Form.Item
            name="accountNumber"
            label="Account Number"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="depositDistribution"
            label="Deposit Distribution"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="FULL_NET">Full Net</Option>
              <Option value="PARTIAL_DOLLAR">Partial $</Option>
              <Option value="PARTIAL_PERCENT">Partial %</Option>
              <Option value="REMAINDER">Remainder</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Amount (If Partial)">
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item name="accountNickname" label="Account Nickname">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            {isEditMode ? "Update Account" : "Save Account"}
          </Button>
        </Form>
      </Modal>
    </Card>
  );
}