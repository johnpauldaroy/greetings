import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const BURST_LIFETIME = 1400;

const photos = [
  {
    src: '/453011395_468493805958327_3683431124508147886_n.jpg',
    alt: 'ICT team member sitting outdoors',
  },
  {
    src: '/509357511_1781006582450261_2177714865220065087_n.jpg',
    alt: 'ICT team member smiling indoors',
  },
  {
    src: '/520943236_2185592215235152_4158265410574604132_n.jpg',
    alt: 'ICT team member in graduation attire',
  },
  {
    src: '/75302642_3156641784405981_3099963530028253184_n.jpg',
    alt: 'ICT team member on a scenic balcony',
  },
  {
    src: '/497590079_24372574748995942_165542481813090134_n.jpg',
    alt: 'ICT team member portrait',
  },
];

function App() {
  const [bursts, setBursts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const counterRef = useRef(0);
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: -(Math.random() * 6),
        duration: 6 + Math.random() * 4,
        size: 6 + Math.random() * 8,
        hue: Math.floor(Math.random() * 360),
      })),
    [],
  );

  const spawnBurst = (x, y, scale = 1) => {
    const id = counterRef.current++;
    const hue = Math.floor(Math.random() * 360);

    setBursts((prev) => [...prev, { id, x, y, hue, scale }]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((burst) => burst.id !== id));
    }, BURST_LIFETIME);
  };

  const launchRandom = () => {
    spawnBurst(20 + Math.random() * 60, 20 + Math.random() * 50, 0.9 + Math.random() * 0.9);
  };

  const handleLaunch = () => {
    launchRandom();
    setConfettiActive(true);
    setIsModalOpen(true);
  };

  const handleStageClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    spawnBurst(x, y);
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      return undefined;
    }

    const interval = setInterval(() => {
      const baseX = 10 + Math.random() * 80;
      const baseY = 12 + Math.random() * 55;
      spawnBurst(baseX, baseY, 0.8 + Math.random() * 1.2);
      if (Math.random() > 0.45) {
        spawnBurst(8 + Math.random() * 84, 12 + Math.random() * 55, 0.6 + Math.random() * 1.6);
      }
      if (Math.random() > 0.2) {
        spawnBurst(6 + Math.random() * 14, 18 + Math.random() * 45, 0.9 + Math.random() * 1.3);
        spawnBurst(80 + Math.random() * 14, 18 + Math.random() * 45, 0.9 + Math.random() * 1.3);
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  const nextYear = new Date().getFullYear() + 1;

  return (
    <div className="App">
      <div className="sky" onClick={handleStageClick} role="presentation">
        {confettiActive ? (
          <div className="confetti" aria-hidden="true">
            {confettiPieces.map((piece) => (
              <span
                key={piece.id}
                className="confetti-piece"
                style={{
                  left: `${piece.left}%`,
                  '--delay': `${piece.delay}s`,
                  '--duration': `${piece.duration}s`,
                  '--size': `${piece.size}px`,
                  '--hue': piece.hue,
                }}
              />
            ))}
          </div>
        ) : null}
        {bursts.map((burst) => (
          <span
            key={burst.id}
            className="firework"
            style={{
              left: `${burst.x}%`,
              top: `${burst.y}%`,
              '--hue': burst.hue,
              '--scale': burst.scale,
            }}
          />
        ))}
        <div className="content">
          <p className="eyebrow">Greetings from ICT Department</p>
          <h1 className="title">Happy New Year {nextYear}</h1>
          <p className="subtitle">
            Wishing you bright ideas, bold goals, and a year of shared success.
          </p>
          <div className="actions">
            <div className="button-row">
              <button className="launch-button" onClick={handleLaunch}>
                Launch Firework
              </button>
            </div>
            <span className="hint">Tap or click the sky to celebrate.</span>
          </div>
        </div>
        {isModalOpen ? (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)} role="presentation">
            <div className="modal" onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setIsModalOpen(false)} type="button">
                Close
              </button>
              <div className="modal-fireworks">
                {bursts.map((burst) => (
                  <span
                    key={`modal-${burst.id}`}
                    className="firework"
                    style={{
                      left: `${burst.x}%`,
                      top: `${burst.y}%`,
                      '--hue': burst.hue,
                      '--scale': burst.scale,
                    }}
                  />
                ))}
              </div>
              <div className="modal-content">
                <p className="gallery-title">ICT Team</p>
                <div className="gallery-grid">
                  {photos.map((photo) => (
                    <figure key={`modal-${photo.src}`} className="photo-card">
                      <img src={photo.src} alt={photo.alt} />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
