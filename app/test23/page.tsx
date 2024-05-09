'use client';
import React, { useState, useEffect } from 'react';
import { ImageDatabase } from '@/Components/ImageUploaderDB';

const imageDB = new ImageDatabase();

const DisplayParticipantData = () => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesFromDB = await imageDB.images.toArray();
        setImages(imagesFromDB);
      } catch (error) {
        console.error('Error al obtener imágenes de la base de datos:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h2>Datos de participantes:</h2>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image.imageDataURL} alt={`Imagen ${index}`} />
        </div>
      ))}
    </div>
  );
};

export default DisplayParticipantData;
