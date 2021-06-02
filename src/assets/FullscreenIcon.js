import React from 'react';

export default function FullscreenIcon() {
  return (
    <svg
      className="fullscreen-icon"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_b)">
        <rect width="40" height="40" fill="url(#pattern0)" />
        {/* <rect x="0.5" y="0.5" width="39" height="39" stroke="white" /> */}
      </g>
      <defs>
        <filter
          id="filter0_b"
          x="-10"
          y="-10"
          width="60"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="5" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur" result="shape" />
        </filter>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0" transform="scale(0.00520833)" />
        </pattern>
        <image
          id="image0"
          width="192"
          height="192"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADAAQAAAAB6p1GqAAAAAnRSTlMAAHaTzTgAAAA1SURBVHgB7dYxCgAgDARB//9pxUbB2pDiZqqDrQMZIYC5ndEfhLt/BUEAHuU3KAhenP6QAVhq8v4QrqeW1wAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
}
