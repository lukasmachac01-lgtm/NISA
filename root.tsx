import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const BUDGET = 900;

// Get current user's team
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const team = await sql`
      SELECT 
        ut.*,
        p1.name as player1_name, p1.price as player1_price, p1.jersey_number as player1_jersey, p1.photo_url as player1_photo,
        p2.name as player2_name, p2.price as player2_price, p2.jersey_number as player2_jersey, p2.photo_url as player2_photo,
        p3.name as player3_name, p3.price as player3_price, p3.jersey_number as player3_jersey, p3.photo_url as player3_photo,
        COALESCE(SUM(ms1.total_points), 0) as player1_points,
        COALESCE(SUM(ms2.total_points), 0) as player2_points,
        COALESCE(SUM(ms3.total_points), 0) as player3_points
      FROM user_teams ut
      JOIN players p1 ON ut.player1_id = p1.id
      JOIN players p2 ON ut.player2_id = p2.id
      JOIN players p3 ON ut.player3_id = p3.id
      LEFT JOIN match_stats ms1 ON ut.player1_id = ms1.player_id
      LEFT JOIN match_stats ms2 ON ut.player2_id = ms2.player_id
      LEFT JOIN match_stats ms3 ON ut.player3_id = ms3.player_id
      WHERE ut.user_id = ${userId}
      GROUP BY ut.id, p1.name, p1.price, p1.jersey_number, p1.photo_url,
               p2.name, p2.price, p2.jersey_number, p2.photo_url,
               p3.name, p3.price, p3.jersey_number, p3.photo_url
    `;

    if (team.length === 0) {
      return Response.json({ team: null, budget: BUDGET });
    }

    return Response.json({ team: team[0], budget: BUDGET });
  } catch (error) {
    console.error("Error fetching team:", error);
    return Response.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

// Create or update user's team
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { player1_id, player2_id, player3_id } = await request.json();

    if (!player1_id || !player2_id || !player3_id) {
      return Response.json(
        { error: "All three players are required" },
        { status: 400 },
      );
    }

    // Check if players are unique
    if (
      player1_id === player2_id ||
      player1_id === player3_id ||
      player2_id === player3_id
    ) {
      return Response.json(
        { error: "Players must be unique" },
        { status: 400 },
      );
    }

    // Get player prices
    const players = await sql`
      SELECT id, price
      FROM players
      WHERE id IN (${player1_id}, ${player2_id}, ${player3_id})
    `;

    if (players.length !== 3) {
      return Response.json(
        { error: "One or more players not found" },
        { status: 404 },
      );
    }

    const total_spent = players.reduce((sum, p) => sum + p.price, 0);

    if (total_spent > BUDGET) {
      return Response.json(
        {
          error: `Celková cena ${total_spent} bodů přesahuje rozpočet ${BUDGET} bodů`,
        },
        { status: 400 },
      );
    }

    // Upsert team
    const result = await sql`
      INSERT INTO user_teams (user_id, player1_id, player2_id, player3_id, total_spent, updated_at)
      VALUES (${userId}, ${player1_id}, ${player2_id}, ${player3_id}, ${total_spent}, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        player1_id = EXCLUDED.player1_id,
        player2_id = EXCLUDED.player2_id,
        player3_id = EXCLUDED.player3_id,
        total_spent = EXCLUDED.total_spent,
        updated_at = NOW()
      RETURNING *
    `;

    return Response.json({ team: result[0] });
  } catch (error) {
    console.error("Error saving team:", error);
    return Response.json({ error: "Failed to save team" }, { status: 500 });
  }
}
