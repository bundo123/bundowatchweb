export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect x="21" y="1" width="6" height="4.5" rx="1.2" fill="#d4af37" />
      <circle cx="24" cy="26" r="19" stroke="#d4af37" strokeWidth="2.2" />
      <circle cx="24" cy="26" r="15.2" stroke="#d4af37" strokeOpacity="0.35" strokeWidth="0.8" />
      <g stroke="#d4af37" strokeWidth="1.6" strokeLinecap="round">
        <path d="M24 12.6v2.6M37.4 26h-2.6M24 39.4v-2.6M10.6 26h2.6" />
      </g>
      <path
        d="M24 16.5V26h8.5"
        stroke="#f5f5f5"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="26" r="1.7" fill="#d4af37" />
    </svg>
  );
}
