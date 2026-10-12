import { useEffect, useRef, useState } from "react";

const SRC = "/images/page-bg.webp";
const WIDTH = 724;
const HEIGHT = 2172;

/**
 * One continuous background behind the whole page. The artwork is a tall 1:3 panel shown at full width;
 * it is repeated down the page with every other copy mirrored vertically, so the joins line up seamlessly
 * instead of the artwork being stretched (which would squash the orbs into ovals).
 */
export function PageBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const tileHeight = (el.clientWidth * HEIGHT) / WIDTH;
      setTiles(Math.max(1, Math.ceil(el.clientHeight / tileHeight)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="flex flex-col dark:opacity-[0.06]">
        {Array.from({ length: tiles }, (_, i) => (
          <img
            key={i}
            src={SRC}
            alt=""
            width={WIDTH}
            height={HEIGHT}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`block h-auto w-full shrink-0 ${i % 2 ? "-scale-y-100" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
