import React, { useEffect, useState, useRef } from 'react';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    return () => clearTimeout(fadeOutTimer);
  }, []);

  useEffect(() => {
    if (!isVisible && !isHovered) {
      timeoutRef.current = setTimeout(onClose, 300); // Wait for fade-out animation to complete
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible, isHovered, onClose]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
      }
    }, 2000);
  };

  return (
    <div
      className={`fixed top-4 right-4 bg-[#F4F6FF] text-[#536493] p-4 rounded-lg shadow-lg transition-opacity duration-300 border border-[#536493] inline-block ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {message}
    </div>
  );
};

export default SuccessPopup;