import React from 'react'

export default function Loading() {
  const delays = ['0s', '0.3s', '0.6s']
  const colors = ['bg-blobLavenderContrast', 'bg-blobIndigoContrast', 'bg-blobSteelContrast']

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="flex items-center justify-center gap-6">
        {delays.map((delay, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full ${colors[i]} animate-pulseBlur filter`}
            style={{ animationDelay: delay, animationFillMode: 'both' }}
          />
        ))}
      </div>
    </div>
  )
}
