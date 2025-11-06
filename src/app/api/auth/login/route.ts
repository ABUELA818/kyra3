import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple validation - replace with actual database query
    if (!email || !password) {
      return NextResponse.json({ message: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // For demo purposes - accept any email/password combination
    // Replace this with actual database authentication
    const usuario = {
      id: 1,
      email: email,
      nombre: email.split("@")[0],
      token: `token_${Date.now()}`,
    }

    return NextResponse.json(usuario, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 })
  }
}
