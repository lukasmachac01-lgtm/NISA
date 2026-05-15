import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ user: null }, { status: 401 });
    }

    const rows = await sql`
      SELECT id, name, email, role FROM auth_users WHERE id = ${session.user.id} LIMIT 1
    `;

    const user = rows[0] || null;
    return Response.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// User-initiated account deletion
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    // Delete the user - foreign key constraints with ON DELETE CASCADE
    // will automatically delete related records (team, sessions, accounts, etc.)
    await sql`DELETE FROM auth_users WHERE id = ${userId}`;

    return Response.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return Response.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
