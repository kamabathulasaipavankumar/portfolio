import { contactLinks } from "../../data/contact";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {contactLinks.map(({ id, label, href, external, Icon }) => (
        <li key={id}>
          <a
            href={href}
            className="icon-btn"
            aria-label={label}
            title={label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
