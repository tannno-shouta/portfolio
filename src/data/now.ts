export type NowPlaying = {
  title: string;
  artist: string;
  cover: string; // public/ 以下のパス
};

export type CurrentlyReading = {
  title: string;
  author: string;
  cover: string;
};

export const nowPlaying: NowPlaying = {
  title: "（曲名を入力）",
  artist: "（アーティスト名）",
  cover: "/now/music-cover.jpg",
};

export const currentlyReading: CurrentlyReading = {
  title: "（書名を入力）",
  author: "（著者名）",
  cover: "/now/book-cover.jpg",
};
