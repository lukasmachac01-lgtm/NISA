import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const rows =
    await sql`SELECT role FROM auth_users WHERE id = ${session.user.id}`;
  if (!rows[0] || rows[0].role !== "admin") return null;
  return session;
}

// Mark match as completed (admin only)
export async function PATCH(request, { params }) {
  try {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const { id } = params;
    const { is_completed } = await request.json();

    const result = await sql`
      UPDATE matches
      SET is_completed = ${is_completed}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Match not found" }, { status: 404 });
    }

    return Response.json({ match: result[0] });
  } catch (error) {
    console.error("Error updating match:", error);
    return Response.json({ error: "Failed to update match" }, { status: 500 });
  }
}

// Delete match permanently (admin only) – also removes all match_stats via CASCADE
export async function DELETE(request, { params }) {
  try {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const { id } = params;

    const result = await sql`
      DELETE FROM matches WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Match not found" }, { status: 404 });
    }

    return Response.json({ success: true, deleted_id: result[0].id });
  } catch (error) {
    console.error("Error deleting match:", error);
    return Response.json({ error: "Failed to delete match" }, { status: 500 });
  }
}
