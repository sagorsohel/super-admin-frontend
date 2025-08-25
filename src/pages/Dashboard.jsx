import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [form, setForm] = useState({
    name: "",
    shopName: "",
    email: "",
    password: "",
    subdomain: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;

    // auto-generate subdomain from shopName
    if (name === "shopName") {
      const sub = value
        .toLowerCase()
        .replace(/\s+/g, "") // remove spaces
        .replace(/[^a-z0-9]/g, ""); // remove special chars
      setForm({ ...form, shopName: value, subdomain: sub });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must login first!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/superadmin/tenants",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setMessage("Customer created successfully ✅");
        setForm({ name: "", shopName: "", email: "", password: "", subdomain: "" });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating customer");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Customer Name"
          className="p-2 border rounded"
        />
        <input
          name="shopName"
          value={form.shopName}
          onChange={handleChange}
          placeholder="Shop Name"
          className="p-2 border rounded"
        />
        {/* Auto-complete subdomain */}
        <div className="relative">
          <input
            name="subdomain"
            value={form.subdomain}
            onChange={handleChange}
            placeholder="Subdomain"
            className="p-2 border rounded bg-gray-100 w-full"
            readOnly
          />
          <span className="absolute right-3 top-2 text-gray-500 text-sm">
            http://{form.subdomain || "yourshop"}.localhost:5174
          </span>
        </div>

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="p-2 border rounded"
        />

        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          Create Customer
        </button>
      </form>

      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
}
