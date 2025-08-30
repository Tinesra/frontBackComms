"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import styles from "../page.module.css";

export default function Users() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      const result = await api("/users", {
        method: "POST",
        json: { name, password },
      });
      setStatus(`Created: ${JSON.stringify(result)}`);
      setName("");
      setPassword("");
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <input className={styles.input}
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    <br />
      <input
        className={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button className={styles.button} type="submit">Create</button>
      <div className="statusContainer">
        <p className={styles.status}>{status}</p>
      </div>
    </form>
  );
}
