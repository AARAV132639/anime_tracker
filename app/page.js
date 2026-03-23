"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState("");

  const fetchAnime = async () => {
    const res = await fetch("/api/anime");
    const data = await res.json();
    setAnimeList(data);
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  const addAnime = async () => {
    if (!title) return;

    await fetch("/api/anime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, notes }),
    });

    setTitle("");
    setNotes("");
    fetchAnime();
  };

  const markWatched = async (id) => {
    await fetch("/api/anime", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchAnime();
  };

  const deleteAnime = async (id) => {
    await fetch("/api/anime", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchAnime();
  };

  const updateNotes = async (id) => {
  await fetch("/api/anime", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, notes: editNotes }),
  });

  setEditingId(null);
  setEditNotes("");
  fetchAnime();
};

 return (
  <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
    <h1 className="text-4xl font-bold mb-6">🎌 Anime Tracker</h1>

    {/* Input */}
    <div className="w-full max-w-md flex flex-col gap-3 mb-10">
      <input
        className="p-3 rounded bg-gray-800"
        placeholder="Anime name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="p-3 rounded bg-gray-800"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={addAnime}
        className="bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold"
      >
        Add Anime
      </button>
    </div>

    {/* Lists */}
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Plan */}
      <div>
        <h2 className="text-xl mb-4">📌 Plan to Watch</h2>

        {animeList.filter(a => a.status === "plan").length === 0 && (
          <p className="text-gray-500">No anime yet</p>
        )}

        {animeList
          .filter((a) => a.status === "plan")
          .map((a) => (
            <div
              key={a._id}
              className="bg-gray-900 p-4 rounded mb-3 shadow"
            >
              <p className="font-semibold">{a.title}</p>
              
              {editingId === a._id ? (
  <div className="mt-2 flex gap-2">
    <input
      value={editNotes}
      onChange={(e) => setEditNotes(e.target.value)}
      className="bg-gray-800 p-1 rounded text-sm"
      maxLength={200}
    />
    <button
      onClick={() => updateNotes(a._id)}
      className="bg-blue-600 px-2 rounded text-sm"
    >
      Save
    </button>
  </div>
) : (
  <>
    {a.notes && (
      <p className="text-sm text-gray-400">{a.notes}</p>
    )}

    <button
      onClick={() => {
        setEditingId(a._id);
        setEditNotes(a.notes || "");
      }}
      className="text-xs text-blue-400 mt-1"
    >
      Edit notes
    </button>
  </>
)}

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => markWatched(a._id)}
                  className="bg-green-600 px-3 py-1 rounded text-sm"
                >
                  ✔ Watched
                </button>
                <button
                  onClick={() => deleteAnime(a._id)}
                  className="bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Watched */}
      <div>
        <h2 className="text-xl mb-4">✅ Watched</h2>

        {animeList.filter(a => a.status === "watched").length === 0 && (
          <p className="text-gray-500">Nothing watched yet</p>
        )}

        {animeList
          .filter((a) => a.status === "watched")
          .map((a) => (
            <div
              key={a._id}
              className="bg-gray-900 p-4 rounded mb-3 shadow"
            >
              <p className="font-semibold">{a.title}</p>
              {a.notes && (
                <p className="text-sm text-gray-400">{a.notes}</p>
              )}

              <button
                onClick={() => deleteAnime(a._id)}
                className="mt-2 bg-red-600 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  </div>
);
}
