export function JP(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 640 480" {...props}>
      <path fill="#fff" d="M0 0h640v480H0z"/>
      <circle cx="320" cy="240" r="94" fill="#bc002d"/>
    </svg>
  )
}

export function PL(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 640 480" {...props}>
      <g fillRule="evenodd">
        <path fill="#fff" d="M640 480H0V0h640z"/>
        <path fill="#dc143c" d="M640 480H0V240h640z"/>
      </g>
    </svg>
  )
} 