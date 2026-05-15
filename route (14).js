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

// DELETE a user
export async function DELETE(request, { params }) {
  try {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const { id } = params;

    // Can't delete yourself
    if (String(id) === String(session.user.id)) {
      return Response.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    // Cascade deletes user_teams, auth_sessions, auth_accounts due to FK ON DELETE CASCADE
    await sql`DELETE FROM auth_users WHERE id = ${id}`;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
