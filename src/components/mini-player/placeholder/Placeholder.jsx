import React, { useEffect, useState } from 'react';
import { hexToRgb } from '../utils';
import './Placeholder.css';

const Placeholder = (props) => {
  const { bgColor = '#000', spinnerColor = '#fff', loading } = props;

  const [gradientBg, setGradientBg] = useState('');

  const getRgba = (rgb, alpha) => {
    const [r, g, b] = rgb;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useEffect(() => {
    const rgb = hexToRgb(bgColor);

    setGradientBg(
      `linear-gradient(0deg, ${getRgba(rgb, 1)} 50%, ${getRgba(
        rgb,
        0.9,
      )} 100%), linear-gradient(90deg, ${getRgba(rgb, 0.9)} 0%, ${getRgba(
        rgb,
        0.6,
      )} 100%), linear-gradient(180deg, ${getRgba(rgb, 0.6)} 0%, ${getRgba(
        rgb,
        0.3,
      )} 100%), linear-gradient(360deg, ${getRgba(rgb, 0.3)} 0%, ${getRgba(
        rgb,
        0,
      )} 100%)`,
    );
  }, [bgColor]);

  return (
    <div className="Placeholder" style={{ background: bgColor }}>
      <div className="Placeholder-content">
        {loading && (
          <div
            className="Placeholder-spinner"
            style={{ background: spinnerColor }}
          >
            <div
              className="Placeholder-gradient"
              style={{ backgroundImage: gradientBg }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Placeholder;
