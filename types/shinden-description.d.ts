declare module '@docchi/shinden-description' {
  interface ShindenResponse {
    status: number;
    message: string;
    shinden?: {
      data: {
        anime: string;
        slug: string;
      };
      description: string;
    };
  }

  export default function shindenDescription(title: string): Promise<ShindenResponse>;
} 