"use client";

import { useEffect, useState } from "react";
import { PolicyView } from "@/components/PolicyView";
import { buildPolicy, POLICY_STORAGE_KEY, type PolicyInput } from "@/lib/policy";
import { POLICY_UI } from "@/lib/copy";

export default function PolicyPage() {
  const [input, setInput] = useState<PolicyInput | null | undefined>(undefined);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(POLICY_STORAGE_KEY) ?? localStorage.getItem(POLICY_STORAGE_KEY);
      setInput(raw ? (JSON.parse(raw) as PolicyInput) : null);
    } catch { setInput(null); }
  }, []);
  useEffect(() => {
    if (!input) return;
    document.documentElement.lang = input.lang;
    const id = setTimeout(() => window.print(), 600);
    return () => clearTimeout(id);
  }, [input]);

  if (input === undefined) return null;
  if (input === null) return <main className="policy-page"><p><a href="/">Phil Araujo</a></p></main>;
  return (
    <main className="policy-page">
      <div className="policy-toolbar">
        <button onClick={() => window.print()}>{POLICY_UI.print[input.lang]}</button>
      </div>
      <PolicyView blocks={buildPolicy(input)} />
    </main>
  );
}
