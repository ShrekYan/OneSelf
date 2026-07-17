export interface Feature {
  id: string;
  title: string;
  description: string;
  iconKey: IconKey;
}

export interface Link {
  id: string;
  title: string;
  iconKey: IconKey;
}

export type IconKey =
  | 'discover'
  | 'recommend'
  | 'bookmark'
  | 'theme';