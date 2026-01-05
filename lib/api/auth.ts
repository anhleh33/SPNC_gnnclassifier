// lib/api/auth.ts
export async function login(payload: {
    identifier: string
    password: string
  }) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )
  
    const data = await res.json()
  
    if (!res.ok) {
      throw new Error(data.error || "Invalid credentials")
    }
  
    return data
  }
  