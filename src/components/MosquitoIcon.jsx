export default function MosquitoIcon({ active }) {
  return (
    <svg
      className={`mosquito ${active ? 'active' : ''}`}
      width="80" height="80" viewBox="0 0 80 80" aria-label="mosquito"
    >
      <circle cx="40" cy="40" r="8" fill="#333" />
      <ellipse cx="30" cy="40" rx="10" ry="4" fill="#444" />
      <ellipse cx="50" cy="40" rx="10" ry="4" fill="#444" />
      <line x1="40" y1="32" x2="40" y2="18" stroke="#222" strokeWidth="2"/>
      <line x1="35" y1="48" x2="25" y2="60" stroke="#555" strokeWidth="2"/>
      <line x1="45" y1="48" x2="55" y2="60" stroke="#555" strokeWidth="2"/>
      <line x1="42" y1="36" x2="60" y2="30" stroke="#222" strokeWidth="1"/>
      <line x1="38" y1="36" x2="20" y2="30" stroke="#222" strokeWidth="1"/>
    </svg>
  );
}

