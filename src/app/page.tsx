"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Users from "./components/inputFields"; 
import styles from "./page.module.css";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api("/")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>fordemo Frontend</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className="preContainer">
        <div className={styles.pre}>
          {JSON.stringify(data, null, 2)}
        </div>
      </div>
      <Users />
    </main>
  );
}
