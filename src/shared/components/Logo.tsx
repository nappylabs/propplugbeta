export const Logo = ({ variant = "full", size = "md" }: { variant?: "full" | "icon", size?: "sm" | "md" }) => (
  <div className="flex items-center gap-3">
    <div className={`relative ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} bg-prop-dark rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-prop-purple/20`}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-prop-purple to-transparent opacity-40" />
      <span className={`text-white font-black ${size === 'sm' ? 'text-lg' : 'text-xl'} z-10`}>P</span>
      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-prop-purple rounded-full animate-pulse" />
    </div>
    {variant === "full" && (
      <span className={`text-prop-dark font-black ${size === 'sm' ? 'text-xl' : 'text-2xl'} tracking-tighter`}>PropPlug</span>
    )}
  </div>
);