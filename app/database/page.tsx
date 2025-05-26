'use client';

import { useState } from 'react';

export default function DatabasePage() {
  const [form, setForm] = useState({ name: '', password: '', email: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/save-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus('User saved!');
      setForm({ name: '', password: '', email: '' });
    } else {
      setStatus('Failed to save user.');
    }
  };

  return (
    <main className="flex flex-col items-center p-8 gap-4">
      <h1 className="text-2xl font-bold">Save to Database</h1>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 rounded w-64"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border p-2 rounded w-64"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 rounded w-64"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
      {status && <p>{status}</p>}
    </main>
  );
}
