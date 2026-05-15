import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Update player (admin only)
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { name, jersey_number, price, position } = await request.json();

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      setClauses.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (jersey_number !== undefined) {
      setClauses.push(`jersey_number = $${paramIndex++}`);
      values.push(jersey_number);
    }
    if (price !== undefined) {
      setClauses.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (position !== undefined) {
      setClauses.push(`position = $${paramIndex++}`);
      values.push(position);
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const query = `UPDATE players SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Player not found" }, { status: 404 });
    }

    return Response.json({ player: result[0] });
  } catch (error) {
    console.error("Error updating player:", error);
    return Response.json({ error: "Failed to update player" }, { status: 500 });
  }
}
