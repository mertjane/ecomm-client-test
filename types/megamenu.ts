
export interface MegamenuItem {
  id: number;
  title: string;
  url: string;               // API provides this
  slug?: string;             // optional, we can generate
  children: MegamenuItem[];
}

export interface MegamenuState {
  data: MegamenuItem[] | null;
  isLoading: boolean;
  error: string | null;
}


export interface MegamenuResponse {
  source: "origin" | "cache";
  data: MegamenuItem[];
}
