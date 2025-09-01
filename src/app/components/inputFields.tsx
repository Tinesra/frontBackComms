"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import styles from "../page.module.css";

export default function Users() {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    id: "",
    newUsername: "",
  });

  const [uiState, setUiState] = useState({
    method: "POST",
    idType: "username",
    updateIdType: "code",
    fetchAll: false,
    status: null as string | null,
    accountCode: null as string | null,
    isLoading: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setUiState((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (
      name === "method" || name === "idType" || name === "updateIdType"
    ) {
      setUiState((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUiState((prev) => ({
      ...prev,
      isLoading: true,
      status: "Processing...",
    }));

    try {
      const { method, idType, updateIdType, fetchAll } = uiState;
      const { username, password, id, newUsername } = formData;

      let endpoint = "/users";
      let payload = {};
      let params = undefined;

      if (method === "GET") {
        if (!fetchAll) {
          if (idType === "id" || idType === "code") {
            endpoint = `/users/${id}`;
          } else if (idType === "username") {
            params = { username: id };
          }
        }
      } else if (method === "POST") {
        payload = { username, password };
      } else if (["PUT", "PATCH", "DELETE"].includes(method)) {
        if (updateIdType === "code") {
          endpoint = `/users/${id}`;
        } else if (updateIdType === "id") {
          endpoint = `/users/${id}`;
        }

        if (method === "PUT" || method === "PATCH") {
          payload = { username: newUsername };
        }
      }

      const result = await api(endpoint, {
        method,
        params,
        json: method !== "GET" ? payload : undefined,
      });

      processResult(method, result);
    } catch (err: any) {
      setUiState((prev) => ({
        ...prev,
        status: `Error: ${err.message}`,
        accountCode: null,
        isLoading: false,
      }));
    }
  };

  const processResult = (method: string, result: any) => {
    if (method === "GET") {
      if (Array.isArray(result)) {
        setUiState((prev) => ({
          ...prev,
          status: `Found ${result.length} users: ${JSON.stringify(result)}`,
          accountCode: null,
          isLoading: false,
        }));
      } else if (result && typeof result === "object") {
        setUiState((prev) => ({
          ...prev,
          status: `Account found: ${JSON.stringify(result)}`,
          accountCode: result.code || null,
          isLoading: false,
        }));
      } else {
        setUiState((prev) => ({
          ...prev,
          status: "No results found",
          accountCode: null,
          isLoading: false,
        }));
      }
    } else if (method === "DELETE") {
      setUiState((prev) => ({
        ...prev,
        status: `Account deleted successfully: ${JSON.stringify(result)}`,
        accountCode: null,
        isLoading: false,
      }));
      setFormData((prev) => ({ ...prev, id: "" }));
    } else {
      const actionVerb =
        method === "POST"
          ? "Created"
          : method === "PUT"
          ? "Updated"
          : "Patched";

      setUiState((prev) => ({
        ...prev,
        status: `${actionVerb}: ${JSON.stringify(result)}`,
        accountCode: method === "POST" ? result.code || null : null,
        isLoading: false,
      }));

      if (method === "POST") {
        setFormData((prev) => ({ ...prev, username: "", password: "" }));
      } else {
        setFormData((prev) => ({ ...prev, newUsername: "" }));
      }
    }
  };

  const renderFormFields = () => {
    const { method, idType, fetchAll, updateIdType } = uiState;
    const { username, password, id, newUsername } = formData;

    if (method === "GET") {
      return (
        <>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="fetchAll"
              name="fetchAll"
              checked={fetchAll}
              onChange={handleInputChange}
            />
            <label htmlFor="fetchAll">Fetch all users</label>
          </div>
          <br />

          {!fetchAll && (
            <>
              <select
                className={styles.input}
                name="idType"
                value={idType}
                onChange={handleInputChange}
              >
                <option value="username">Username</option>
                <option value="id">ID</option>
                <option value="code">Code</option>
              </select>
              <br />
              <input
                className={styles.input}
                type="text"
                name="id"
                placeholder={`Enter ${idType}`}
                value={id}
                onChange={handleInputChange}
                required={!fetchAll}
              />
            </>
          )}
        </>
      );
    }

    if (method === "POST") {
      return (
        <>
          <input
            className={styles.input}
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
            required
          />
          <br />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </>
      );
    }

    return (
      <>
        <select
          className={styles.input}
          name="updateIdType"
          value={updateIdType}
          onChange={handleInputChange}
        >
          <option value="code">Code</option>
          <option value="id">ID</option>
        </select>
        <br />
        <input
          className={styles.input}
          type="text"
          name="id"
          placeholder={`Enter ${updateIdType} to identify account`}
          value={id}
          onChange={handleInputChange}
          required
        />

        {(method === "PUT" || method === "PATCH") && (
          <>
            <br />
            <input
              className={styles.input}
              type="text"
              name="newUsername"
              placeholder="New username"
              value={newUsername}
              onChange={handleInputChange}
              required
            />
          </>
        )}
      </>
    );
  };

  const getButtonText = () => {
    const { method, fetchAll } = uiState;
    switch (method) {
      case "GET":
        return fetchAll ? "Get All Users" : "Get User";
      case "POST":
        return "Create Account";
      case "PUT":
        return "Update Account";
      case "PATCH":
        return "Patch Account";
      case "DELETE":
        return "Delete Account";
      default:
        return "Submit";
    }
  };

  const { status, accountCode, method, isLoading } = uiState;

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 15 }}>
      <select
        className={styles.input}
        name="method"
        value={method}
        onChange={handleInputChange}
        required
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>
      <br />

      {renderFormFields()}

      <br />
      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : getButtonText()}
      </button>

      <div className="statusContainer">
        {status && <p className={styles.status}>{status}</p>}
        {accountCode && (
          <p className={styles.status}>
            <strong>Account Code:</strong> {accountCode}
            <br />
            <small>(Use this code for the next step)</small>
          </p>
        )}
      </div>
    </form>
  );
}
