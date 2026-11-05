import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo.jpg',
        'hero-banner.jpg',
        'vehicles/*.jpg',
        'tours/*.jpg'
      ],
      manifest: {
        name: 'Take It Easy Car Rentals & Tours',
        short_name: 'Take It Easy',
        description:
          'Direct airport car rentals, digital contracts, and guided Jamaican tours.',
        theme_color: '#203030',
        background_color: '#eef5f2',
        display: 'standalone',
        icons: [
          {
            src: '/logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2}'
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            // Explicitly cache all images and brand logos (including cache-busted ?v=* URLs)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)(\?.*)?$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'take-it-easy-images-logos',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache Google Fonts CSS stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'take-it-easy-google-fonts-css',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache Google Fonts & local font files (Playfair Display, Inter, Geist Mono)
            urlPattern:
              /^(?:https:\/\/fonts\.gstatic\.com\/.*|.*\.(?:woff|woff2|ttf|otf)(\?.*)?)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'take-it-easy-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Explicitly cache CSS stylesheets for instant visual rendering on spotty cellular
            urlPattern: /\.(?:css)(\?.*)?$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'take-it-easy-stylesheets',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
