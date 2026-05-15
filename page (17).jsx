import sql from "@/app/api/utils/sql";

// Get leaderboard - calculate total points for each user's team
export async function GET() {
  try {
    const leaderboard = await sql`
      WITH player_totals AS (
        -- Sum each player's points ONLY from completed matches, pre-aggregated
        SELECT
          ms.player_id,
          SUM(ms.total_points) AS total_points
        FROM match_stats ms
        JOIN matches m ON ms.match_id = m.id
        WHERE m.is_completed = true
        GROUP BY ms.player_id
      ),
      user_points AS (
        SELECT
          ut.user_id,
          au.name AS user_name,
          COALESCE(pt1.total_points, 0) +
          COALESCE(pt2.total_points, 0) +
          COALESCE(pt3.total_points, 0) AS total_points
        FROM user_teams ut
        JOIN auth_users au ON ut.user_id = au.id
        LEFT JOIN player_totals pt1 ON ut.player1_id = pt1.player_id
        LEFT JOIN player_totals pt2 ON ut.player2_id = pt2.player_id
        LEFT JOIN player_totals pt3 ON ut.player3_id = pt3.player_id
      )
      SELECT
        user_id,
        user_name,
        total_points,
        RANK() OVER (ORDER BY total_points DESC) AS rank
      FROM user_points
      ORDER BY total_points DESC
    `;

    return Response.json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return Response.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
