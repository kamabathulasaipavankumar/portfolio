import type { ReactElement } from "react";
import { Mail, Phone } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "../components/ui/BrandIcons";
import type { IconProps } from "../components/ui/BrandIcons";

export type ContactLink = {
  id: "linkedin" | "github" | "email" | "phone";
  label: string;
  href: string;
  value: string;
  external?: boolean;
  Icon: (props: IconProps) => ReactElement;
};

export const contactLinks: ContactLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saipavankumar-k",
    value: "saipavankumar-k",
    external: true,
    Icon: LinkedInIcon,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/kamabathulasaipavankumar",
    value: "kamabathulasaipavankumar",
    external: true,
    Icon: GitHubIcon,
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:saipavankumar8639@gmail.com",
    value: "saipavankumar8639@gmail.com",
    Icon: ({ size = 20, ...props }) => <Mail size={size} aria-hidden="true" {...props} />,
  },
  {
    id: "phone",
    label: "Phone",
    href: "tel:+918639711162",
    value: "+91 86397 11162",
    Icon: ({ size = 20, ...props }) => <Phone size={size} aria-hidden="true" {...props} />,
  },
];

export const getContact = (id: ContactLink["id"]) => contactLinks.find((link) => link.id === id)!;
