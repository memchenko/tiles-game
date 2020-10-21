const fs = require('fs');
const path = require('path');

const readFile = fs.readFileSync;
const readDir = fs.readdirSync;
const writeFile = fs.writeFileSync;

const getFileNameByIncludes = (includesString, dir) => {
    const files = readDir(dir);
    const file = files.find(file => file.includes(includesString));
    return path.join(dir, file);
};

const buildFolder = path.resolve(__dirname, 'build');
const assetManifestPath = path.join(buildFolder, 'asset-manifest.json');
const precacheManifestPath = getFileNameByIncludes('precache-manifest', buildFolder);

const [assetManifest, precacheManifest] = [
    readFile(assetManifestPath),
    readFile(precacheManifestPath),
];

const assetManifestJson = JSON.parse(assetManifest);
assetManifestJson.files['sounds/click.wav'] = '/sounds/click.wav';
assetManifestJson.files['sounds/success.flac'] = '/sounds/success.flac';

const newAssetManifest = JSON.stringify(assetManifestJson, null, 2);

writeFile(assetManifestPath, newAssetManifest, { encoding: 'utf8' });

const precacheManifestStr = precacheManifest.toString().match(/\[[^\]]+\]/);

const precacheManifestJson = JSON.parse(precacheManifestStr);
precacheManifestJson.push({
    revision: null,
    url: '/sounds/click.wav',
});
precacheManifestJson.push({
    revision: null,
    url: '/sounds/success.flac',
});

const newPrecacheManifest = precacheManifest
    .toString()
    .replace(
        /\[[^\]]+\]/,
        JSON.stringify(precacheManifestJson, null, 2)
    );

writeFile(precacheManifestPath, newPrecacheManifest, { encoding: 'utf8' });
