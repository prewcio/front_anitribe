import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const response = await fetch(`${process.env.LARAVEL_API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status })
  }

  const headers = new Headers()
  headers.append("Set-Cookie", `token=${data.token}; Path=/; HttpOnly`)

  return NextResponse.json(data, { headers })
}

