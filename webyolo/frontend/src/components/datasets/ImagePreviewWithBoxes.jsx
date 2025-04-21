// components/layout/ImagePreviewWithBoxes.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

const ImagePreviewWithBoxes = ({ imageData }) => {
    console.log(imageData);
    const canvasRef = useRef(null);
    const [img, setImg] = useState(null);

    useEffect(() => {
        if (!imageData || !imageData.img || !imageData.label) return;

        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => setImg(image);
            image.src = reader.result;
        };
        reader.readAsDataURL(imageData.img);
    }, [imageData]);

    useEffect(() => {
        if (!img || !imageData.label) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Цвета по классам
        const classColors = [
            '#60a5fa', // голубой
            '#f472b6', // розовый
            '#facc15', // жёлтый
            '#34d399', // зелёный
            '#f87171', // красный
            '#c084fc', // фиолетовый
            '#fb923c', // оранжевый
        ];

        imageData.label.text().then(text => {
            const lines = text.split('\n').filter(Boolean);
            lines.forEach(line => {
                const [cls, x, y, w, h] = line.split(' ').map(Number);
                const color = classColors[cls % classColors.length];

                const boxX = (x - w / 2) * img.width;
                const boxY = (y - h / 2) * img.height;
                const boxW = w * img.width;
                const boxH = h * img.height;

                // Обводка
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.strokeRect(boxX, boxY, boxW, boxH);

                // Подложка
                ctx.fillStyle = hexToRgba(color, 0.85);
                ctx.fillRect(boxX, boxY, 70, 18);

                // Подпись
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 13px sans-serif';
                ctx.fillText(`Class ${cls}`, boxX + 4, boxY + 13);
            });
        });

        // Хелпер: hex → rgba
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    }, [img, imageData]);

    if (!imageData || !imageData.img || !imageData.label) return null;

    return (
        <Box
            sx={{
                border: '1px solid #334155',
                borderRadius: 2,
                overflow: 'hidden',
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                mb: 2,
                boxShadow: 3,
                backgroundColor: '#1e293b',
            }}
        >
            <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
        </Box>
    );
};

export default ImagePreviewWithBoxes;