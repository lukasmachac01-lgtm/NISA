import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Save/update match statistics for a player (admin only)
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin only
    const userRows =
      await sql`SELECT role FROM auth_users WHERE id = ${session.user.id}`;
    if (!userRows[0] || userRows[0].role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: matchId } = params;
    const {
      player_id,
      goals = 0,
      assists = 0,
      was_on_field = false,
      goals_while_on_field = 0,
      goals_against_while_on_field = 0,
      own_goals = 0,
      penalties = 0,
    } = await request.json();

    if (!player_id) {
      return Response.json({ error: "player_id is required" }, { status: 400 });
    }

    // Calculate total points
    // 5 points for goal, 3 for assist, 1 for goal while on field,
    // -1 for goal against while on field, -5 for own goal, -2 for penalty
    const total_points =
      goals * 5 +
      assists * 3 +
      goals_while_on_field * 1 +
      goals_against_while_on_field * -1 +
      own_goals * -5 +
      penalties * -2;

    // Upsert match stats
    const result = await sql`
      INSERT INTO match_stats (
        match_id, player_id, goals, assists, was_on_field,
        goals_while_on_field, goals_against_while_on_field,
        own_goals, penalties, total_points
      )
      VALUES (
        ${matchId}, ${player_id}, ${goals}, ${assists}, ${was_on_field},
        ${goals_while_on_field}, ${goals_against_while_on_field},
        ${own_goals}, ${penalties}, ${total_points}
      )
      ON CONFLICT (match_id, player_id)
      DO UPDATE SET
        goals = EXCLUDED.goals,
        assists = EXCLUDED.assists,
        was_on_field = EXCLUDED.was_on_field,
        goals_while_on_field = EXCLUDED.goals_while_on_field,
        goals_against_while_on_field = EXCLUDED.goals_against_while_on_field,
        own_goals = EXCLUDED.own_goals,
        penalties = EXCLUDED.penalties,
        total_points = EXCLUDED.total_points
      RETURNING *
    `;

    return Response.json({ stat: result[0] });
  } catch (error) {
    console.error("Error saving match stats:", error);
    return Response.json(
      { error: "Failed to save match stats" },
      { status: 500 },
    );
  }
}

// Get all stats for a match
export async function GET(request, { params }) {
  try {
    const { id: matchId } = params;

    const stats = await sql`
      SELECT 
        ms.*,
        p.name as player_name,
        p.jersey_number
      FROM match_stats ms
      JOIN players p ON ms.player_id = p.id
      WHERE ms.match_id = ${matchId}
      ORDER BY p.name ASC
    `;

    return Response.json({ stats });
  } catch (error) {
    console.error("Error fetching match stats:", error);
    return Response.json(
      { error: "Failed to fetch match stats" },
      { status: 500 },
    );
  }
}
