import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get all matches
export async function GET() {
  try {
    const matches = await sql`
      SELECT id, opponent, match_date, is_completed, created_at
      FROM matches
      ORDER BY match_date DESC
    `;
    return Response.json({ matches });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return Response.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}

// Create a new match (admin only)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    const userRows =
      await sql`SELECT role FROM auth_users WHERE id = ${userId}`;
    if (!userRows[0] || userRows[0].role !== "admin") {
      return Response.json(
        { error: "Forbidden – nemáš admin práva" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { opponent, match_date, match_time } = body;

    if (!opponent || !opponent.trim()) {
      return Response.json({ error: "Zadej název soupeře" }, { status: 400 });
    }
    if (!match_date) {
      return Response.json({ error: "Zadej datum zápasu" }, { status: 400 });
    }

    // Build a proper ISO timestamp from separate date + time
    const timeStr = match_time || "12:00";
    const isoString = `${match_date}T${timeStr}:00`;
    const parsedDate = new Date(isoString);
    if (isNaN(parsedDate.getTime())) {
      return Response.json(
        { error: "Neplatné datum nebo čas" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO matches (opponent, match_date)
      VALUES (${opponent.trim()}, ${parsedDate.toISOString()})
      RETURNING *
    `;

    return Response.json({ match: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return Response.json(
      { error: `Server chyba: ${error.message}` },
      { status: 500 },
    );
  }
}
