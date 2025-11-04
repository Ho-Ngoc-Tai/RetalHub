"use client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  // Hàm login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // quan trọng: để cookie từ server gửi về
      });

      if (!res.ok) throw new Error("Login failed");

      // Nếu login thành công → chuyển về dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  // Hàm logout
  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/"; // xóa cookie
    router.push("/login");
  };

  return { login, logout };
}
