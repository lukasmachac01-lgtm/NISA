import { useState } from "react";
import useAuth from "@/utils/useAuth";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !name) {
      setError("Vyplň všechna pole");
      setLoading(false);
      return;
    }

    try {
      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        EmailCreateAccount: "Tento email už je zaregistrovaný.",
        default: "Něco se pokazilo. Zkus to znovu.",
      };
      setError(errorMessages[err.message] || errorMessages.default);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-['Inter']">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8"
      >
        <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-gray-900">
          Registrace
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500">
              Jméno
            </label>
            <input
              required
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tvoje jméno"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500">
              Email
            </label>
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tvuj@email.cz"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500">
              Heslo
            </label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Registruji..." : "Zaregistrovat se"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Už máš účet?{" "}
            <a
              href="/account/signin"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Přihlas se
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
