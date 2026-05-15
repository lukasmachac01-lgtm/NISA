import sql from "@/app/api/utils/sql";

// Get the next upcoming (not completed) match - only future matches
export async function GET() {
  try {
    const matches = await sql`
      SELECT id, opponent, match_date, is_completed, created_at
      FROM matches
      WHERE is_completed = false
        AND match_date > NOW()
      ORDER BY match_date ASC
      LIMIT 1
    `;

    const upcoming = matches[0] || null;
    return Response.json({ match: upcoming });
  } catch (error) {
    console.error("Error fetching upcoming match:", error);
    return Response.json(
      { error: "Failed to fetch upcoming match" },
      { status: 500 },
    );
  }
}
