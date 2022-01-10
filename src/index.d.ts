export interface YoutubeSubtitle {
  begin: string;
  end: string;
  start: number;
  dur: number;
  text: string;
}

export interface GetSubtitleOptions {
  videoID: string;
  lang?: string;
}

declare interface YoutubeSubsJson {
  getSubtitles(params: GetSubtitleOptions): Promise<YoutubeSubtitle[]>;
}

declare const youtubeSubsJson: YoutubeSubsJson;

declare module 'youtube-subs-json' {
  export = youtubeSubsJson;
}