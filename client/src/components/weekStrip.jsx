const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];


export default function WeekStrip({ booked = [], clashIndex = null, size = 'md' }) {
  const cellSize = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-9 w-9 text-xs';

  return (
    <div className="flex gap-1.5" role="img" aria-label="Weekly schedule strip">
      {DAYS.map((label, i) => {
        const isBooked = booked.includes(i);
        const isClash = clashIndex === i;

        return (
          <div
            key={i}
            className={`flex ${cellSize} items-center justify-center rounded font-mono font-medium ${
              isClash
                ? 'border border-warn bg-warn-light text-warn'
                : isBooked
                ? 'bg-accent text-white'
                : 'border border-line bg-surface text-muted'
            }`}
            style={
              isClash
                ? {
                    backgroundImage:
                      'repeating-linear-gradient(45deg, rgba(181,80,45,0.15) 0, rgba(181,80,45,0.15) 2px, transparent 2px, transparent 6px)',
                  }
                : undefined
            }
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
