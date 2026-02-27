import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Alert,
  Typography,
  Row,
  Col,
  message,
  Divider,
} from "antd";
import dayjs from "dayjs";
import {
  createEmployee,
  fetchEmployeeDataById,
  updateEmployee,
  fetchEmployees,
} from "../SharedComponents/services/EmployeeServices";
import { fetchCompanies } from "../SharedComponents/services/CompaniesServies";

const { Title } = Typography;
const { Option } = Select;

export default function EmployeeForm({ mode }) {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const [companies, setCompanies] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [navigation, setNavigation] = useState({
    previous: null,
    next: null,
  });
  const [error, setError] = useState(null);

  const [form] = Form.useForm();
  const isEditMode = mode === "edit";

  /* ================= FETCH COMPANIES ================= */
  useEffect(() => {
    const loadCompanies = async () => {
      const res = await fetchCompanies(0, 50);
      setCompanies(Array.isArray(res?.content) ? res.content : []);
    };
    loadCompanies();
  }, []);

  /* ================= FETCH ALL EMPLOYEES ================= */
  useEffect(() => {
    if (isEditMode) {
      const loadEmployees = async () => {
        const res = await fetchEmployees(0, 100);
        setAllEmployees(res?.content || []);
      };
      loadEmployees();
    }
  }, [isEditMode]);

  /* ================= FETCH EMPLOYEE ================= */
  useEffect(() => {
    if (isEditMode && employeeId) {
      const loadEmployee = async () => {
        const data = await fetchEmployeeDataById(employeeId);

        if (data?.current) {
          form.setFieldsValue({
            ...data.current,
            dob: data.current.dob ? dayjs(data.current.dob) : null,
            company: data.current?.company?.companyId
              ? String(data.current.company.companyId)
              : "",
          });

          setNavigation({
            previous: data.previous,
            next: data.next,
          });
        }
      };
      loadEmployee();
    }
  }, [isEditMode, employeeId, form]);

  /* ================= SUBMIT ================= */
  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        companyId: String(values.company),
      };

      delete payload.company;

      if (isEditMode) {
        const res = await updateEmployee(employeeId, payload);

        setNavigation({
          previous: res.previous,
          next: res.next,
        });

        message.success("Employee updated successfully");
      } else {
        await createEmployee(payload);
        message.success("Employee created successfully");
        navigate("/employees");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  /* ================= NAVIGATION ================= */
  const handlePrevious = () => {
    if (navigation.previous?.employeeID) {
      navigate(`/editemployee/${navigation.previous.employeeID}`);
    }
  };

  const handleNext = () => {
    if (navigation.next?.employeeID) {
      navigate(`/editemployee/${navigation.next.employeeID}`);
    }
  };

  const handleEmployeeSelect = (value) => {
    navigate(`/editemployee/${value}`);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      {/* ================= TOP NAVIGATION ================= */}
      {isEditMode && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Button
              onClick={handlePrevious}
              disabled={!navigation.previous}
            >
              ⬅ Previous
            </Button>

            <Button onClick={() => setShowSearchBar(!showSearchBar)}>
              {showSearchBar ? "Hide Search" : "Switch Employee"}
            </Button>

            <Button
              type="primary"
              onClick={handleNext}
              disabled={!navigation.next}
            >
              Next ➡
            </Button>
          </div>

          {showSearchBar && (
            <Select
              showSearch
              placeholder="Search Employee"
              style={{ width: "100%", marginBottom: 16 }}
              onChange={handleEmployeeSelect}
            >
              {allEmployees.map((emp) => (
                <Option key={emp.employeeID} value={emp.employeeID}>
                  {emp.firstName} {emp.lastName} ({emp.employeeID})
                </Option>
              ))}
            </Select>
          )}

          <Divider />

          {/* ================= EXTRA MODULE BUTTONS ================= */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={() =>
                navigate(`/editemployee/${employeeId}/visa-details`)
              }
            >
              Visa Details
            </Button>

            <Button
              onClick={() =>
                navigate(`/editemployee/${employeeId}/project-history`)
              }
            >
              Project History
            </Button>

            <Button
              onClick={() =>
                navigate(`/editemployee/${employeeId}/bank-details`)
              }
            >
              Direct Deposit
            </Button>

            <Button
              type="primary"
              onClick={() =>
                navigate(`/employee/${employeeId}/payroll`)
              }
            >
              Payroll
            </Button>
          </div>
        </>
      )}

      {/* ================= FORM TITLE ================= */}
      <Title level={3} style={{ textAlign: "center" }}>
        {isEditMode ? "Edit Employee" : "Add Employee"}
      </Title>

      {error && (
        <Alert
          message={error}
          type="error"
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      {/* ================= FORM ================= */}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Last Name" name="lastName">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="emailID"
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Phone"
              name="phoneNo"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Date of Birth"
              name="dob"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="College" name="clgOfGrad">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: true }]}
            >
              <Select>
                {companies.map((comp) => (
                  <Option
                    key={comp.companyId}
                    value={String(comp.companyId)}
                  >
                    {comp.companyName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Working Status"
              name="onBench"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="OnBench">On Bench</Option>
                <Option value="OnProject">On Project</Option>
                <Option value="OnVacation">On Vacation</Option>
                <Option value="OnSick">On Sick</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
          <Button
            onClick={() => navigate("/employees")}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>

          <Button type="primary" htmlType="submit">
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}