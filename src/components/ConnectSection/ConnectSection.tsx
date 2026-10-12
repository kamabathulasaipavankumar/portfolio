import React from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "../ui/motion";
import { EASE } from "../ui/motion-config";
import { contactLinks, getContact } from "../../data/contact";
import type { ContactLink } from "../../data/contact";

const brandTile: Partial<Record<ContactLink["id"], string>> = {
  linkedin: "bg-[#0a66c2] text-white",
  github: "bg-[#0d1117] text-white dark:bg-white dark:text-[#0d1117]",
};

const orbitIcon: Partial<Record<ContactLink["id"], string>> = {
  linkedin: "text-[#0a66c2]",
  github: "text-ink",
};

// Positions of the four contact bubbles around the orbit (percent of the orbit box)
const orbitSpots: Record<ContactLink["id"], string> = {
  email: "top-[4.6%] left-[4.6%]",
  phone: "top-[4.6%] right-[4.6%]",
  linkedin: "bottom-[4.6%] left-[4.6%]",
  github: "bottom-[4.6%] right-[4.6%]",
};

/** Decorative orbit of contact bubbles around a send icon (desktop only). */
function ContactOrbit() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[22rem]">
      <div className="absolute inset-0 rounded-full border border-dashed border-brand-2/30" />
      <div className="absolute inset-[13%] rounded-full border border-dashed border-brand-2/25" />
      <div className="absolute inset-[25%] rounded-full border border-dashed border-brand-2/20" />
      {/* Orbit dots */}
      <span className="absolute top-[12.5%] left-[54%] size-2.5 rounded-full bg-brand" />
      <span className="absolute top-1/2 left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-2" />
      <span className="absolute top-[54%] right-0 size-2.5 translate-x-1/2 rounded-full bg-brand-3" />
      <span className="absolute bottom-0 left-[40%] size-2.5 translate-y-1/2 rounded-full bg-brand-2" />

      {/* Centre */}
      <motion.div
        className="absolute inset-[34%] grid place-items-center rounded-[1.75rem] bg-gradient-to-br from-brand to-brand-3 text-white shadow-[0_24px_48px_-18px_rgb(79_70_229/0.8)]"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
      >
        <Send size={42} strokeWidth={1.75} />
      </motion.div>

      {/* Bubbles: mouse shortcuts to the same links (keyboard/AT users get the labelled links on the left) */}
      {contactLinks.map(({ id, href, external, Icon }, i) => (
        <motion.a
          key={id}
          href={href}
          tabIndex={-1}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={`absolute ${orbitSpots[id]}`}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.35 + i * 0.08 }}
        >
          <span
            className={`animate-float grid size-[4.4rem] place-items-center rounded-full border border-line bg-surface-strong shadow-[0_16px_32px_-16px_rgb(79_70_229/0.45)] transition-transform duration-300 hover:scale-105 ${
              orbitIcon[id] ?? "text-brand"
            }`}
            style={{ animationDelay: `${-i * 2.2}s` }}
          >
            <Icon size={28} />
          </span>
        </motion.a>
      ))}
    </div>
  );
}

const ConnectSection: React.FC = () => {
  const email = getContact("email");
  const phone = getContact("phone");
  const socials = contactLinks.filter((link) => link.external);

  return (
    <section id="connect" aria-labelledby="connect-title" className="relative isolate pt-12 pb-20 sm:pt-16 sm:pb-24">

      <motion.div
        className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface-strong/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl sm:rounded-[2.25rem] sm:p-12 lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-8 lg:p-14"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/3 -right-1/4 size-[36rem] rounded-full"
          style={{ background: "radial-gradient(closest-side, var(--glow-1), transparent)" }}
        />

        <div className="relative min-w-0">
          <Reveal delay={0.06}>
            <h2
              id="connect-title"
              className="text-[2.5rem] leading-[1.05] font-bold tracking-[-0.035em] text-ink sm:text-6xl lg:text-[3.5rem] xl:text-[4rem]"
            >
              Connect with <span className="text-gradient">Me</span>
            </h2>
          </Reveal>
          <motion.span
            aria-hidden="true"
            className="bg-brand-gradient mt-5 block h-1 w-16 origin-left rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          />

          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[30rem] text-base leading-relaxed text-muted sm:text-lg">
              Looking forward to collaborating on interesting projects, learning opportunities, or just having a tech
              chat!
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={email.href}
                className="btn btn-primary min-h-14 justify-start gap-2.5 px-5 text-[0.8125rem] min-[400px]:text-[0.9375rem] sm:justify-center sm:px-7"
              >
                <email.Icon size={18} />
                <span className="truncate">{email.value}</span>
                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                  className="btn-icon ml-auto hidden min-[400px]:block sm:ml-0"
                />
              </a>
              <a
                href={phone.href}
                className="btn btn-secondary min-h-14 justify-start bg-surface-strong! px-6 shadow-[var(--shadow-card)] sm:justify-center"
              >
                <phone.Icon size={18} className="text-brand" />
                Call Me
              </a>
            </div>
          </Reveal>

          <Stagger className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap" delay={0.2} stagger={0.07}>
            {socials.map(({ id, label, href, value, Icon }) => (
              <StaggerItem key={id} className="min-w-0">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label}: ${value}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-surface-strong py-3 pr-4 pl-3 shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[var(--line-accent)] hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:translate-y-0"
                >
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${brandTile[id]}`}>
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block font-semibold text-ink">{label}</span>
                    <span className="block truncate text-muted">{value}</span>
                  </span>
                  <ArrowUpRight
                    size={17}
                    aria-hidden="true"
                    className="shrink-0 text-ink-soft transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                  />
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="relative hidden lg:block">
          <ContactOrbit />
        </div>
      </motion.div>
    </section>
  );
};

export default ConnectSection;
