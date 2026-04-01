export default function LoadingSpinner({
  size = 32,
  text = 'Loading...',
  fullScreen = false,
}: {
  size?: number;
  text?: string | null;
  fullScreen?: boolean;
}) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        className="animate-spin text-white"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12c0-4.418 3.582-8 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <div className="text-zinc-400 text-sm font-medium tracking-wide animate-pulse">{text}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white w-full">
        {content}
      </div>
    );
  }

  return content;
}
