import React from 'react';
import { SvgIcon } from '@mui/material';

const Logo = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path 
        d="M12,2 L2,7 L12,12 L22,7 L12,2 Z" 
        fill="#ff9e1b" 
      />
      <path 
        d="M2,12 L12,17 L22,12" 
        fill="none" 
        stroke="#ff9e1b" 
        strokeWidth="2" 
      />
      <path 
        d="M2,17 L12,22 L22,17" 
        fill="none" 
        stroke="#ff9e1b" 
        strokeWidth="2" 
      />
      <path 
        d="M12,12 L12,22" 
        fill="none" 
        stroke="#ff9e1b" 
        strokeWidth="2" 
      />
    </SvgIcon>
  );
};

export default Logo;