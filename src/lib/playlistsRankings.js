export const rankings = [];

export const headers = [
  "Keyword",
  "Market",
  "Position",
  "Playlist Spotify ID",
  "Playlist Name",
  "Owner Spotify ID",
];

export function init() {
  rankings.length = 0;
}

export function appendContent(playlists, keyword, market) {
  const newRankings = playlists
    .map((playlist, position) =>
      playlist
        ? {
            keyword: keyword,
            market: market,
            position: position + 1,
            playlistSpotifyId: playlist.id,
            playlistName: playlist.name,
            ownerSpotifyId: playlist.owner?.id || "",
          }
        : null
    )
    .filter((playlist) => playlist);

  rankings.push(...newRankings);
}

export function downloadCSV(name = "playlists_rankings") {
  const csvContent = [
    headers.join(","),
    ...rankings.map((row) =>
      [
        row.keyword,
        row.market,
        row.position,
        row.playlistSpotifyId,
        escapeCSVField(row.playlistName),
        row.ownerSpotifyId,
      ].join(",")
    ),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSVField(field) {
  const stringField = String(field || "");
  if (
    stringField.includes(",") ||
    stringField.includes('"') ||
    stringField.includes("\n")
  ) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}
