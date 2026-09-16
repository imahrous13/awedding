export function WritingPen() {
  return (
    <div className="writing-pen" aria-hidden="true">
      <svg viewBox="0 0 180 100" role="presentation">
        <path
          className="writing-stroke"
          d="M151 78 C131 68 114 84 96 76 C78 68 61 69 43 77 C37 80 31 80 25 77"
        />
        <g className="writing-quill">
          <path
            className="writing-feather"
            d="M147 76 C140 63 139 42 146 17 C129 23 116 38 117 55 C120 67 133 75 147 76 Z"
          />
          <path className="writing-feather-shaft" d="M147 76 C138 55 132 39 125 28" />
          <path className="writing-nib" d="M147 76 L151 86 L142 79 Z" />
        </g>
      </svg>
    </div>
  );
}
