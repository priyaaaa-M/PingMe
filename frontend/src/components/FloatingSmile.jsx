import { useState, useEffect } from 'react';
import { SmileIcon } from 'lucide-react';

const FloatingSmile = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add trail effect
      setTrails(prev => [
        ...prev.slice(-3), // Keep only last 3 trails
        { x: e.clientX, y: e.clientY, id: Date.now() }
      ]);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail effects */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[9999] transition-transform duration-100"
          style={{
            left: trail.x - 8,
            top: trail.y - 8,
            opacity: 0.4 - (index * 0.1),
            transform: `scale(${0.7 - (index * 0.2)})`
          }}
        >
          <SmileIcon className="size-4 text-yellow-400" />
        </div>
      ))}
      
      {/* Main floating smile */}
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-150"
        style={{
          left: position.x - 12,
          top: position.y - 12,
        }}
      >
        <SmileIcon className="size-6 text-yellow-400 drop-shadow-lg" />
      </div>
    </>
  );
};

export default FloatingSmile;