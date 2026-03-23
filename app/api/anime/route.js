import { connectDB } from "@/lib/mongodb";
import Anime from "@/models/Anime";

// GET all anime
export async function GET() {
  try {
    await connectDB();
    const data = await Anime.find();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST new anime
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const anime = await Anime.create(body);
    return Response.json(anime);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE & PUT
// UPDATE
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    const updateFields = {};

    // if notes is provided → update notes
    if (body.notes !== undefined) {
      updateFields.notes = body.notes;
    }

    // if no notes → assume it's mark watched
    if (body.notes === undefined) {
      updateFields.status = "watched";
    }

    const updated = await Anime.findByIdAndUpdate(
      body.id,
      updateFields,
      { new: true }
    );

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req) {
  try {
    await connectDB();
    const body = await req.json();

    await Anime.findByIdAndDelete(body.id);

    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}