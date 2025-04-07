import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function fetchMetadata(streamURL: string) {
  const duration = 20;
  const cmd = [
    'ffmpeg',
    '-y',
    '-i',
    streamURL,
    '-t',
    duration.toString(),
    '-f',
    'ffmetadata',
    '-',
  ].join(' ');

  try {
    const { stdout } = await execAsync(cmd, {
      encoding: 'buffer',
      timeout: (duration + 5) * 1000,
    });

    const ffmpegOutput = stdout.toString('utf-8');
    const metadata: Record<string, string> = {};
    ffmpegOutput.split('\n').forEach((line) => {
      if (line.includes('=')) {
        const [key, value] = line.split('=');
        if (value) {
          metadata[key.trim()] = value.trim();
        }
      }
    });

    const streamTitle: string = metadata['StreamTitle'] || '';
    let artistName: string | null = null;
    let songName: string | null = null;

    if (streamTitle) {
      const parts = streamTitle.split('-');
      if (parts.length === 2) {
        artistName = parts[0].trim();
        songName = parts[1].trim();
      } else {
        songName = streamTitle.trim();
      }
    }

    return {
      icyUrl: metadata['icy-url'] || '',
      icyGenre: metadata['icy-genre'] || '',
      streamTitle,
      artistName,
      songName,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(error);
    return { error: error };
  }
}
