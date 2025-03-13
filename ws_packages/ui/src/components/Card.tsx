import type React from 'react';

export interface CardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Card component for displaying content in a box
 */
export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  const cardStyles = `bg-white rounded-lg shadow-md p-4 ${className}`;

  return (
    <div className={cardStyles}>
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
