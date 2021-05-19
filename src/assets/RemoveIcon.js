import React from 'react';

export default function RemoveIcon({ ...rest }) {
  return (
    <svg
      className="remove-icon"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="8.02588" cy="8" r="8" fill="#FF5F5F" />
      <path
        d="M4.82617 4.80029L11.2262 11.2002"
        stroke="#F8DDFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2262 4.80029L4.82617 11.2002"
        stroke="#F8DDFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
