export function SectionDivider() {
  return (
    <div className="relative h-32 md:h-48 w-full overflow-hidden flex items-center justify-center bg-blush-ivory mix-blend-multiply pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      >
        <source src="/media/Pearls_floating_through_space.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
