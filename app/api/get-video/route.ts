import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

type VideoService = 'cda' | 'vk' | 'sibnet' | 'gdrive' | 'mega';

const serviceHandlers: Record<VideoService, (url: string) => Promise<string | null> | string> = {
  cda: async (url: string) => {
    // Handle both /video/ and /ebd/ URLs
    const videoId = url.match(/\/(?:video|ebd)\/(?:[^\/]+\/)?([^\/]+)/)?.[1];
    if (!videoId) {
      console.log('CDA: Failed to extract video ID from URL:', url);
      return null;
    }

    try {
      console.log('CDA: Fetching video data for ID:', videoId);
      const response = await axios.get(`https://www.cda.pl/video/${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const html = response.data;
      
      const mediaDataMatch = html.match(/player_data='([^']+)'/);
      if (!mediaDataMatch) {
        console.log('CDA: No player data found in response');
        return null;
      }

      const playerData = JSON.parse(decodeURIComponent(mediaDataMatch[1]));
      console.log('CDA: Successfully extracted video URL');
      return playerData.video.file;
    } catch (error) {
      console.error('CDA extraction error:', error);
      if (error instanceof AxiosError) {
        console.error('CDA response status:', error.response?.status);
        console.error('CDA response data:', error.response?.data);
      }
      return null;
    }
  },

  vk: async (url: string) => {
    try {
      const params = new URL(url).searchParams;
      const videoId = `${params.get('oid')}_${params.get('id')}`;
      
      if (!process.env.VK_ACCESS_TOKEN) {
        console.error('VK: Missing access token');
        return null;
      }

      console.log('VK: Fetching video data for ID:', videoId);
      const response = await axios.get(
        `https://api.vk.com/method/video.get?videos=${videoId}&access_token=${process.env.VK_ACCESS_TOKEN}&v=5.131`
      );
      
      const files = response.data.response.items[0].files;
      if (!files) {
        console.log('VK: No video files found in response');
        return null;
      }

      const videoUrl = files?.mp4_1080 || files?.mp4_720 || files?.mp4_480;
      console.log('VK: Selected quality:', videoUrl ? 'Found' : 'Not found');
      return videoUrl;
    } catch (error) {
      console.error('VK API error:', error);
      if (error instanceof AxiosError) {
        console.error('VK response status:', error.response?.status);
        console.error('VK response data:', error.response?.data);
      }
      return null;
    }
  },

  sibnet: async (url: string) => {
    try {
      const videoId = new URL(url).searchParams.get('videoid');
      if (!videoId) {
        console.log('Sibnet: Failed to extract video ID from URL:', url);
        return null;
      }

      console.log('Sibnet: Fetching video data for ID:', videoId);
      const response = await axios.get(`https://video.sibnet.ru/shell.php?videoid=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const html = response.data;
      
      const urlMatch = html.match(/player\.src\(\s*{\s*src:\s*"([^"]+)"/);
      if (!urlMatch) {
        console.log('Sibnet: No video URL found in response');
        return null;
      }

      console.log('Sibnet: Successfully extracted video URL');
      return urlMatch[1];
    } catch (error) {
      console.error('Sibnet extraction error:', error);
      if (error instanceof AxiosError) {
        console.error('Sibnet response status:', error.response?.status);
        console.error('Sibnet response data:', error.response?.data);
      }
      return null;
    }
  },

  gdrive: async (url: string) => {
    const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1];
    if (!fileId) {
      console.log('Google Drive: Failed to extract file ID from URL:', url);
      return null;
    }

    try {
      console.log('Google Drive: Fetching video data for ID:', fileId);
      const response = await axios.head(
        `https://drive.google.com/uc?export=download&id=${fileId}`,
        { 
          maxRedirects: 0,
          validateStatus: (status) => status < 400 || status === 429
        }
      );
      
      if (response.headers.location) {
        console.log('Google Drive: Successfully got redirect URL');
        return response.headers.location;
      }
      
      console.log('Google Drive: No redirect URL found');
      return null;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.headers?.location) {
        console.log('Google Drive: Got redirect URL from error response');
        return error.response.headers.location;
      }
      console.error('Google Drive extraction error:', error);
      if (error instanceof AxiosError) {
        console.error('Google Drive response status:', error.response?.status);
        console.error('Google Drive response headers:', error.response?.headers);
      }
      return null;
    }
  },

  mega: (url: string) => {
    console.log('Mega: Processing URL:', url);
    const match = url.match(/\/embed[#!]?\/?([^\/]+)/);
    const result = match ? `https://mega.nz/file/${match[1]}` : url;
    console.log('Mega: Processed URL:', result);
    return result;
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    console.log('Received request for URL:', url);

    if (!url) {
      console.log('Error: No URL provided');
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Determine video service from URL
    const service = Object.keys(serviceHandlers).find(s => url.includes(s)) as VideoService;
    console.log('Detected service:', service || 'none');

    if (!service || !serviceHandlers[service]) {
      console.log('Error: Unsupported video service for URL:', url);
      return NextResponse.json(
        { 
          error: 'Unsupported video service',
          supportedServices: Object.keys(serviceHandlers)
        },
        { status: 400 }
      );
    }

    console.log(`Attempting to extract video URL using ${service} handler...`);
    const videoUrl = await serviceHandlers[service](url);

    if (!videoUrl) {
      console.log(`${service}: Failed to extract video URL`);
      return NextResponse.json(
        { 
          error: 'Failed to extract video URL',
          service,
          originalUrl: url
        },
        { status: 404 }
      );
    }

    console.log(`${service}: Successfully extracted video URL`);
    return NextResponse.json({ url: videoUrl });
  } catch (error) {
    console.error('Video extraction error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
} 