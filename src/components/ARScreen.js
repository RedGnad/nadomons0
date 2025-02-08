// src/components/ARScreen.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ARScreen.css'; // Si vous souhaitez ajouter des styles spécifiques à ARScreen

const ARScreen = () => {
  const [score, setScore] = useState(0);

  // Ajoute un écouteur pour incrémenter le score lors d'un clic sur le modèle
  useEffect(() => {
    const model = document.getElementById('model');
    if (model) {
      const handleClick = () => {
        setScore(prevScore => prevScore + 1);
      };
      model.addEventListener('click', handleClick);
      return () => model.removeEventListener('click', handleClick);
    }
  }, []);

  return (
    <div>
      {/* Compteur de score */}
      <div id="score">Score: {score}</div>
      
      {/* Scène AR markerless via A-Frame */}
      <a-scene embedded xr="mode: ar; referenceSpaceType: local-floor">
        {/* Plan invisible servant de référence pour le sol */}
        <a-plane position="0 0 0" rotation="-90 0 0" width="10" height="10" color="#000" opacity="0"></a-plane>
        {/* Modèle 3D interactif : boîte rouge posée sur le sol */}
        <a-box id="model" position="0 0.15 -2" rotation="0 45 0" color="#ff0000" depth="0.3" height="0.3" width="0.3"></a-box>
        {/* Caméra AR avec curseur */}
        <a-entity camera look-controls>
          <a-cursor fuse="true" timeout="500"></a-cursor>
        </a-entity>
      </a-scene>

      {/* Lien pour revenir à la page de la carte */}
      <div className="back-link">
        <Link to="/">Retour à la carte</Link>
      </div>
    </div>
  );
};

export default ARScreen;
