import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './ActionButtonStyle.css';

interface ActionButtonProps {
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Agregar datos
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={renderTooltip}>
      <button onClick={onClick} className="action-button">
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </OverlayTrigger>
  );
};

export default ActionButton;
