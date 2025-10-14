import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);
  private readonly imagesDir = path.join(process.cwd(), 'public', 'images', 'pokemon');

  constructor() {
    this.ensureImageDirectoryExists();
  }

  /**
   * Ensure the images directory exists
   */
  private ensureImageDirectoryExists(): void {
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true });
      this.logger.log(`Created images directory: ${this.imagesDir}`);
    }
  }

  /**
   * Download a single image from URL and save it locally
   */
  async downloadImage(url: string, filename: string): Promise<string> {
    try {
      const filePath = path.join(this.imagesDir, filename);

      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        this.logger.debug(`Image already exists: ${filename}`);
        return `/images/pokemon/${filename}`;
      }

      // Download the image
      const response = await axios.get(url, {
        responseType: 'stream',
        timeout: 10000,
      });

      // Save to file
      await streamPipeline(response.data, fs.createWriteStream(filePath));
      this.logger.debug(`Downloaded image: ${filename}`);

      return `/images/pokemon/${filename}`;
    } catch (error) {
      this.logger.error(`Failed to download image from ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Download Pokemon sprites and return local paths
   */
  async downloadPokemonSprites(pokemonId: number, sprites: any): Promise<any> {
    const localSprites: any = {};

    // Define sprite types to download
    const spriteTypes = [
      'front_default',
      'front_shiny',
      'front_female',
      'front_shiny_female',
      'back_default',
      'back_shiny',
      'back_female',
      'back_shiny_female',
    ];

    // Download each sprite
    for (const spriteType of spriteTypes) {
      const spriteUrl = sprites[spriteType];
      
      if (spriteUrl && typeof spriteUrl === 'string') {
        const extension = path.extname(spriteUrl) || '.png';
        const filename = `${pokemonId}-${spriteType}${extension}`;
        const localPath = await this.downloadImage(spriteUrl, filename);
        localSprites[spriteType] = localPath;
      } else {
        localSprites[spriteType] = null;
      }
    }

    // Handle other sprites (like dream_world, official-artwork, etc.)
    if (sprites.other) {
      localSprites.other = {};

      // Official artwork
      if (sprites.other['official-artwork']?.front_default) {
        const url = sprites.other['official-artwork'].front_default;
        const filename = `${pokemonId}-official-artwork.png`;
        const localPath = await this.downloadImage(url, filename);
        localSprites.other['official-artwork'] = {
          front_default: localPath,
        };
      }

      // Dream world
      if (sprites.other.dream_world?.front_default) {
        const url = sprites.other.dream_world.front_default;
        const filename = `${pokemonId}-dream-world.svg`;
        const localPath = await this.downloadImage(url, filename);
        localSprites.other.dream_world = {
          front_default: localPath,
        };
      }

      // Home
      if (sprites.other.home?.front_default) {
        const url = sprites.other.home.front_default;
        const filename = `${pokemonId}-home.png`;
        const localPath = await this.downloadImage(url, filename);
        localSprites.other.home = {
          front_default: localPath,
        };
      }
    }

    return localSprites;
  }

  /**
   * Get the absolute path to an image file
   */
  getImagePath(filename: string): string {
    return path.join(this.imagesDir, filename);
  }

  /**
   * Check if an image exists
   */
  imageExists(filename: string): boolean {
    return fs.existsSync(this.getImagePath(filename));
  }

  /**
   * Delete an image file
   */
  async deleteImage(filename: string): Promise<boolean> {
    try {
      const filePath = this.getImagePath(filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted image: ${filename}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Failed to delete image ${filename}:`, error.message);
      return false;
    }
  }
}
