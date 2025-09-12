const API_URL = "https://api.spotify.com/v1/";
const AUTH_URL = "https://accounts.spotify.com/api/token";

const CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.SPOTIFY_CLIENT_SECRET;

const TOKEN_EXPIRATION = 3600; //seconds

/** @todo Fetch observed markets from Soundvertise API */
const MARKETS = Object.freeze({
  UnitedStates: "US",
  UnitedKingdom: "GB",
  Germany: "DE",
  Brazil: "BR",
  Argentina: "AR",
  Colombia: "CO",
  Mexico: "MX",
  Turkey: "TR",
  Italy: "IT",
});

const authorizeApp = async () => {
  return await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data["access_token"];
      } else {
        console.error("HTTP Error:", {
          status: response.status,
          message: data.error.message ?? JSON.stringify(data),
        });
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

const searchPlaylists = async (
  accessToken,
  query,
  market = MARKETS.UnitedStates,
  limit = 50,
  offset = 0
) => {
  return await fetch(
    API_URL +
      "search?" +
      new URLSearchParams({
        q: query,
        type: "playlist",
        market,
        limit,
        offset,
      }).toString(),
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  )
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data.playlists.items;
      } else {
        console.error("HTTP Error:", {
          status: response.status,
          message: data.error?.message ?? JSON.stringify(data),
        });
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

export default { MARKETS, authorizeApp, searchPlaylists };
