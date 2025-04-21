// utils/validateYoloFolder.js

export function validateYoloZipFile(fileList, folderSet) {
    const errors = [];
    const requiredSplits = ['train', 'valid', 'test'];
    const structure = {};

    for (const file of fileList) {
        const path = file.webkitRelativePath || file.name;
        const parts = path.split('/');

        if (parts.length < 3) continue; // expect at least split/images/file

        const [split, type] = parts;
        if (!structure[split]) structure[split] = { images: [], labels: [] };

        if (type === 'images') structure[split].images.push(file);
        if (type === 'labels') structure[split].labels.push(file);
    }
    // 1. Check required folders
    for (const split of requiredSplits) {
        if (!folderSet.has(split)) {
            errors.push(`Missing folder: ${split}`);
        }
    }

    // 2. Check file types and matches
    for (const split of requiredSplits) {
        const { images, labels } = structure[split] || {};
        const imageNames = new Set(
            (images || [])
                .filter(f => /\.(jpe?g|png)$/i.test(f.name))
                .map(f => f.name.replace(/\.[^.]+$/, ''))
        );
        const labelNames = new Set(
            (labels || [])
                .filter(f => /\.txt$/i.test(f.name))
                .map(f => f.name.replace(/\.[^.]+$/, ''))
        );

        for (const name of imageNames) {
            if (!labelNames.has(name)) {
                errors.push(`Missing label for image: ${split}/images/${name}`);
            }
        }

        for (const name of labelNames) {
            if (!imageNames.has(name)) {
                errors.push(`Missing image for label: ${split}/labels/${name}`);
            }
        }
    }

    return errors;
}

export async function extractImagePreviews(files) {
    const imageFiles = files.filter(f =>
        f.webkitRelativePath.includes('train/images') && f.type.startsWith('image/')
    );

    const labelFiles = files.filter(f =>
        f.webkitRelativePath.includes('train/labels') && f.name.endsWith('.txt')
    );

    const previewPairs = [];

    for (let img of imageFiles.slice(0, 3)) {
        const baseName = img.name.replace(/\.[^/.]+$/, ''); // без расширения
        const label = labelFiles.find(
            lbl => lbl.name.replace('.txt', '') === baseName
        );

        if (label) {
            previewPairs.push({ img, label });
        }
    }

    return previewPairs;
}
