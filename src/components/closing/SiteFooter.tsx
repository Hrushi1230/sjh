import React, { useCallback } from "react";
import { FOOTER_NAVIGATION, FOOTER_CONTACT, FOOTER_COPYRIGHT, FooterLink } from "../../data/footerNavigation";
import { createWhatsAppUrl } from "../../utils/contact";

interface SiteFooterProps {
  onOpenPlanner: () => void;
  onNavigateRoute?: (href: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onOpenPlanner,
  onNavigateRoute,
}) => {
  const handleLinkClick = useCallback(
    (e: React.MouseEvent, item: FooterLink) => {
      if (item.action === "open-planner") {
        e.preventDefault();
        const win = window as any;
        if (win.__SJH_PLANNER_SET_FIELD__) {
          win.__SJH_PLANNER_SET_FIELD__("source", "footer");
          if (item.destinationHint) {
            win.__SJH_PLANNER_SET_FIELD__("destination", item.destinationHint);
          }
        }
        onOpenPlanner();
      } else if (item.href && item.isRoute && onNavigateRoute) {
        e.preventDefault();
        onNavigateRoute(item.href);
      }
    },
    [onOpenPlanner, onNavigateRoute]
  );

  return (
    <footer id="site-footer" data-section="phase12" className="sjhFooter" aria-label="Phase 12: Site Colophon & Footer">
      {/* Top colophon divider: horizontal footer rule with settled gold node */}
      <div className="sjhFooter__divider" aria-hidden="true">
        <div className="sjhFooter__dividerLine" />
        <div className="sjhFooter__dividerNode">●</div>
        <div className="sjhFooter__dividerLine" />
      </div>

      <div className="sjhFooter__container">
        {/* Brand Colophon Header */}
        <div className="sjhFooter__colophonHead">
          <span className="sjhFooter__monogram">SJH</span>
          <h3 className="sjhFooter__brandName">SHREE JAGANNATH<br />HOLIDAYS</h3>
          <p className="sjhFooter__tagline">JOURNEYS ACROSS INDIA</p>
        </div>

        {/* Editorial Navigation Columns */}
        <div className="sjhFooter__navGrid">
          {FOOTER_NAVIGATION.map((section) => (
            <div key={section.title} className="sjhFooter__col">
              <h4 className="sjhFooter__colTitle">{section.title}</h4>
              <ul className="sjhFooter__linkList">
                {section.links.map((link) => (
                  <li key={link.label} className="sjhFooter__linkItem">
                    {link.href ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link)}
                        className="sjhFooter__link"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleLinkClick(e, link)}
                        className="sjhFooter__link sjhFooter__link--btn"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section (Strict verified business info only) */}
          <div className="sjhFooter__col">
            <h4 className="sjhFooter__colTitle">CONTACT</h4>
            <div className="sjhFooter__contactDetails">
              {/* Phone */}
              <div className="sjhFooter__location">
                <span className="sjhFooter__locLabel">PHONE / BOOKING</span>
                <a
                  href={`tel:+${FOOTER_CONTACT.phone.raw}`}
                  className="sjhFooter__locVal sjhFooter__link"
                  aria-label="Call Shree Jagannath Holidays"
                  style={{ textDecoration: "none" }}
                >
                  {FOOTER_CONTACT.phone.display}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="sjhFooter__location">
                <span className="sjhFooter__locLabel">WHATSAPP</span>
                <a
                  href={createWhatsAppUrl("Hello Shree Jagannath Holidays,\n\nI would like to enquire about a journey.\n\nPlease help me with the details.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sjhFooter__locVal sjhFooter__link"
                  aria-label="Chat with Shree Jagannath Holidays on WhatsApp"
                  style={{ textDecoration: "none" }}
                >
                  {FOOTER_CONTACT.whatsapp.display} ↗
                </a>
              </div>

              {/* Email */}
              <div className="sjhFooter__location">
                <span className="sjhFooter__locLabel">EMAIL</span>
                <a
                  href={`mailto:${FOOTER_CONTACT.email}`}
                  className="sjhFooter__locVal sjhFooter__link"
                  aria-label="Email Shree Jagannath Holidays"
                  style={{ textDecoration: "none", wordBreak: "break-all" }}
                >
                  {FOOTER_CONTACT.email}
                </a>
              </div>

              {/* Location */}
              <div className="sjhFooter__location">
                <span className="sjhFooter__locLabel">LOCATION</span>
                <span className="sjhFooter__locVal">{FOOTER_CONTACT.location}</span>
              </div>

              {/* Social Follow */}
              <div className="sjhFooter__location" style={{ marginTop: "4px" }}>
                <span className="sjhFooter__locLabel">FOLLOW</span>
                <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                  <a
                    href={FOOTER_CONTACT.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sjhFooter__link"
                    style={{ fontSize: "12px" }}
                  >
                    Instagram ↗
                  </a>
                  <a
                    href={FOOTER_CONTACT.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sjhFooter__link"
                    style={{ fontSize: "12px" }}
                  >
                    Facebook ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Final Mark */}
        <div className="sjhFooter__bottom">
          <p className="sjhFooter__copyright">
            {FOOTER_COPYRIGHT.text} · {FOOTER_COPYRIGHT.subtext}
          </p>

          {/* Final quiet gold node closing the journey line */}
          <div className="sjhFooter__finalMark" aria-hidden="true">
            <div className="sjhFooter__finalLine" />
            <span className="sjhFooter__finalNode">●</span>
            <div className="sjhFooter__finalLine" />
          </div>
        </div>
      </div>
    </footer>
  );
};
