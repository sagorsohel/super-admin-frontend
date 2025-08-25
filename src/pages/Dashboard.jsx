import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    shopName: "",
    email: "",
    password: "",
    subdomain: "",
  });
  const [message, setMessage] = useState("");
  const [tenants, setTenants] = useState([]);

  // Fetch tenants on page load
  useEffect(() => {
    const fetchTenants = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must login first!");
        return;
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/superadmin/tenants`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setTenants(res.data.tenants);
        }
      } catch (err) {
        setMessage("Error fetching tenants");
        console.log(err);
      }
    };

    fetchTenants();
  }, []);

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
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must login first!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/superadmin/tenants`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setLoading(false);

        setMessage("Customer created successfully ✅");
        setForm({
          name: "",
          shopName: "",
          email: "",
          password: "",
          subdomain: "",
        });

        // refresh tenant list
        setTenants((prev) => [res.data.tenant, ...prev]);
      }
    } catch (err) {
      setLoading(false);

      setMessage(err.response?.data?.message || "Error creating customer");
    }
  };
  console.log(tenants);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      {/* Create Tenant Form */}
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
           {loading ? "Creating..." : "Create Customer"}
        </button>
      </form>

      {message && <p className="mt-4 text-blue-600">{message}</p>}

      {/* Tenants Table */}
      <h2 className="text-xl font-semibold mt-8 mb-4">All Tenants</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Shop</th>
              <th className="border px-4 py-2">Subdomain</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length > 0 ? (
              tenants.map((t) => (
                <tr key={t._id}>
                  <td className="border px-4 py-2">{t.name}</td>
                  <td className="border px-4 py-2">{t.shopName}</td>
                  <td className="border px-4 py-2">
                    {t.subdomain && (
                      <a
                        href={
                          import.meta.env.DEV
                            ? `http://${t.subdomain}.localhost:5174`
                            : `https://${t.subdomain}.${
                                import.meta.env.VITE_LANDING_URL
                              }`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {import.meta.env.DEV
                          ? `http://${t.subdomain}.localhost:5174`
                          : `https://${t.subdomain}.${
                              import.meta.env.VITE_LANDING_URL
                            }`}
                      </a>
                    )}
                  </td>
                  <td className="border px-4 py-2">{t?.email}</td>
                  <td className="border px-4 py-2">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No tenants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
