import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './ActionButtonStyle.css'; 

interface ActionButtonProps {
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="action-button">
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
};

export default ActionButton;

