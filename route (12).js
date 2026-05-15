import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const ADMIN_EMAIL = "lukymachac@seznam.cz";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const rows =
    await sql`SELECT role, email FROM auth_users WHERE id = ${session.user.id}`;
  const user = rows[0];
  if (!user || user.role !== "admin") return null;
  return session;
}

// GET all users with their team info and total points
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const users = await sql`
      SELECT
        au.id,
        au.name,
        au.email,
        au.role,
        ut.player1_id,
        ut.player2_id,
        ut.player3_id,
        ut.total_spent,
        p1.name as player1_name,
        p1.price as player1_price,
        p1.jersey_number as player1_jersey,
        p1.photo_url as player1_photo,
        p2.name as player2_name,
        p2.price as player2_price,
        p2.jersey_number as player2_jersey,
        p2.photo_url as player2_photo,
        p3.name as player3_name,
        p3.price as player3_price,
        p3.jersey_number as player3_jersey,
        p3.photo_url as player3_photo,
        COALESCE(SUM(ms1.total_points), 0) + COALESCE(SUM(ms2.total_points), 0) + COALESCE(SUM(ms3.total_points), 0) as total_points
      FROM auth_users au
      LEFT JOIN user_teams ut ON au.id = ut.user_id
      LEFT JOIN players p1 ON ut.player1_id = p1.id
      LEFT JOIN players p2 ON ut.player2_id = p2.id
      LEFT JOIN players p3 ON ut.player3_id = p3.id
      LEFT JOIN match_stats ms1 ON ut.player1_id = ms1.player_id
      LEFT JOIN match_stats ms2 ON ut.player2_id = ms2.player_id
      LEFT JOIN match_stats ms3 ON ut.player3_id = ms3.player_id
      WHERE au.role != 'admin'
      GROUP BY au.id, au.name, au.email, au.role,
               ut.player1_id, ut.player2_id, ut.player3_id, ut.total_spent,
               p1.name, p1.price, p1.jersey_number, p1.photo_url,
               p2.name, p2.price, p2.jersey_number, p2.photo_url,
               p3.name, p3.price, p3.jersey_number, p3.photo_url
      ORDER BY total_points DESC, au.name ASC
    `;

    return Response.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
