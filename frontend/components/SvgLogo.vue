<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 300"
    width="100%"
    height="100%"
  >
    <defs>
      <linearGradient
        id="xGrad"
        x1="105"
        y1="235"
        x2="265"
        y2="55"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#FFD600" />
        <stop offset="45%" stop-color="#FF9500" />
        <stop offset="100%" stop-color="#FF6B00" />
      </linearGradient>

      <filter id="faintShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="1"
          stdDeviation="1.5"
          flood-color="#000000"
          flood-opacity="0.08"
        />
      </filter>
    </defs>

    <g
      filter="url(#faintShadow)"
      class="fill-theme-text transition-colors duration-300"
    >
      <text
        x="60"
        y="165"
        font-family="'Montserrat', 'Proxima Nova', 'Arial', sans-serif"
        font-size="95"
        font-weight="800"
      >
        e
      </text>

      <text
        x="280"
        y="165"
        font-family="'Montserrat', 'Proxima Nova', 'Arial', sans-serif"
        font-size="95"
        font-weight="800"
      >
        cellence
      </text>

      <text
        x="285"
        y="210"
        font-family="'Montserrat', 'Proxima Nova', 'Arial', sans-serif"
        font-size="20"
        font-weight="600"
        letter-spacing="0.45em"
      >
        CONFERENCE
      </text>
    </g>

    <g stroke="url(#xGrad)" stroke-width="26" stroke-linecap="round">
      <path d="M 140 65 L 250 185" />
      <path d="M 105 235 L 265 55" />
    </g>
  </svg>
</template>
