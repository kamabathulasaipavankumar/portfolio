// Lightweight (no three.js) so the chat button and loading states can use it without pulling in the 3D bundle.
export const AVATAR_PHOTO = "/images/myphoto.jpg";

/** Static stand-in used while loading and whenever 3D is unavailable. */
export function AvatarFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative">
        <img
          src={AVATAR_PHOTO}
          alt=""
          className={`size-24 rounded-full object-cover object-[50%_18%] ring-4 ring-brand-2/20 ${loading ? "opacity-60 blur-[1px]" : ""}`}
        />
        {loading && (
          <span
            aria-hidden="true"
            className="absolute -inset-1.5 animate-spin rounded-full border-2 border-transparent border-t-brand-2 motion-reduce:animate-none"
          />
        )}
      </div>
      {loading && <span className="sr-only">Loading 3D avatar…</span>}
    </div>
  );
}
