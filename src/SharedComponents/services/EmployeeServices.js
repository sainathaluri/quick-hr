import { get, post, put, remove } from "../httpClient ";

/* ================= FETCH EMPLOYEES (PAGINATED) ================= */
export async function fetchEmployees(
  currentPage = 0,
  pageSize = 1000,
  searchQuery = "",
  searchField = "",
  companyId = null
) {
  try {
    const searchParams = new URLSearchParams();

    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);

    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }

    if (companyId) {
      searchParams.append("companyId", companyId);
    }

    const response = await get(
      `/employees?${searchParams.toString()}`
    );

    if (response.status === 200) {
      const data = response.data;

      return {
        content: Array.isArray(data?.content)
          ? data.content
          : [],
        totalPages: data?.totalPages || 0,
      };
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
  }

  return { content: [], totalPages: 0 };
}

/* ================= DELETE ================= */
export async function deleteEmployee(employeeId) {
  try {
    const response = await remove(
      `/employees/${employeeId}`
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return false;
  }
}

/* ================= CREATE ================= */
export async function createEmployee(employee) {
  try {
    const employeeDTO = {
      employeeID: employee.employeeID || null,
      firstName: employee.firstName,
      middleName: employee.middleName || null,
      lastName: employee.lastName,
      emailID: employee.emailID,
      clgOfGrad: employee.clgOfGrad,
      phoneNo: employee.phoneNo,
      dob: employee.dob,
      onBench: employee.onBench,
      securityGroup: employee.securityGroup,
      companyId: Number(employee.companyId),
      password: employee.password,
    };

    const response = await post(
      `/employees`,
      employeeDTO
    );

    return response.status === 200 ||
      response.status === 201;
  } catch (error) {
    console.error("Error adding employee:", error);
    return false;
  }
}

/* ================= UPDATE (IMPORTANT FIX) ================= */
export async function updateEmployee(
  employeeId,
  employee
) {
  try {
    const employeeDTO = {
      ...employee,
      companyId: Number(employee.companyId),
    };

    const response = await put(
      `/employees/${employeeId}`,
      employeeDTO
    );

    if (response.status === 200) {
      return response.data; // 🔥 MUST return navigation object
    }
  } catch (error) {
    console.error("Error updating employee:", error);
  }

  return null;
}

/* ================= SEND LOGIN ================= */
export async function sendLoginDetails(emailID) {
  try {
    const response = await post(
      `/auth/resetPassword`,
      {
        email: emailID,
        category: "LOGIN_DETAILS",
      }
    );

    return (
      response.status === 200 ||
      response.status === 201
    );
  } catch (error) {
    console.error(
      "Error sending login details:",
      error
    );
    return false;
  }
}

/* ================= FETCH ONE (NAVIGATION READY) ================= */
export async function fetchEmployeeDataById(
  employeeId
) {
  try {
    const response = await get(
      `/employees/${employeeId}`
    );

    if (response.status === 200) {
      return response.data; // should return { current, previous, next }
    }
  } catch (error) {
    console.error(
      "Error fetching employee data:",
      error
    );
  }

  return null;
}