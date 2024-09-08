import * as React from 'react';
import Switch from '@mui/material/Switch';

function CustomSwitch({ active, onToggle }) {
  const handleClick = () => {
    onToggle(!active);  
  };

  return (
    <Switch
      checked={active}
      onClick={handleClick}
      color="primary"
    />
  );
}

export default CustomSwitch;
