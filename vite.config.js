// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';
// import { visualizer } from 'rollup-plugin-visualizer'; // Make sure this is installed: npm install --save-dev rollup-plugin-visualizer

// // Note: For simplicity and direct application, we're hardcoding the repository name here.
// // A more dynamic approach (reading from package.json) is possible but adds complexity
// // to the vite.config.js itself, which runs in a Node.js environment.
// const REPO_NAME = 'Tech_Quanta_community_website'; // <-- Ensure this exactly matches your GitHub repository name

// export default defineConfig({
//   plugins: [
//     react(),
//     // Add the visualizer plugin to analyze your bundle size (optional, but useful)
//     visualizer({
//       open: false, // Set to true if you want it to open automatically after build
//       filename: 'bundle-analysis.html', // Output file for the report
//       gzipSize: true, // Show gzip sizes
//     }),
//   ],
//   // Set the base path for your application when deployed.
//   // This tells Vite to prepend '/Tech_Quanta_community_website/' to all asset URLs.
//   base: `/${REPO_NAME}/`, // <--- ADD THIS LINE
// });
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

const base = process.env.VERCEL === '1'
  ? '/'
  : '/Tech_Quanta_community_website/';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'bundle-analysis.html',
      gzipSize: true,
    }),
  ],
  base,
  envPrefix: [
    'VITE_',
    'GOOGLE_MACRO_API',
    'GITHUB_'
  ],
});