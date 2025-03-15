// This script is used to notarize your macOS application
// You will need to set the following environment variables:
// - APPLE_ID: Your Apple ID
// - APPLE_APP_SPECIFIC_PASSWORD: An app-specific password for your Apple ID
// - TEAM_ID: Your Apple Developer Team ID

const { notarize } = require('@electron/notarize');
const { build } = require('../package.json');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  
  // Only notarize macOS builds
  if (electronPlatformName !== 'darwin') {
    return;
  }
  
  // Skip if not in a CI environment and environment variables aren't set
  if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD) {
    console.log('Skipping notarization: Required environment variables not set.');
    return;
  }
  
  // Get the app path
  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;
  
  console.log(`Notarizing ${appPath}...`);
  
  try {
    await notarize({
      tool: 'notarytool',
      appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.TEAM_ID || '',
    });
    
    console.log(`Notarization completed for ${appPath}`);
  } catch (error) {
    console.error('Notarization failed:', error);
    // Don't fail the build if notarization fails
  }
}; 