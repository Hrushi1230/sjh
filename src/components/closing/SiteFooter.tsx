import React, { useCallback } from "react";
import { FOOTER_NAVIGATION, FOOTER_CONTACT, FOOTER_COPYRIGHT } from "../../data/footerNavigation";

interface SiteFooterProps {
  onOpenPlanner: () => void;
  onNavigateRoute?: (href: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onOpenPlanner,
  onNavigateRoute,
}) => {
  const handleLinkClick = useCallback(
    (e: React.MouseEvent, item: { href?: string; action?: string; isRoute?: boolean }) => {
      if (item.action === "open-planner") {
        e.preventDefault();
        const win = window as any;
        if (win.__SJH_PLANNER_SET_FIELD__) {
          win.__SJH_PLANNER_SET_FIELD__("source", "footer");
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
              <p className="sjhFooter__location">
                <span className="sjhFooter__locLabel">LOCATION</span>
                <span className="sjhFooter__locVal">{FOOTER_CONTACT.location}</span>
              </p>
              {/* Note: Unverified contact rows (phone/email/social) are omitted completely to adhere to data safety rules */}
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
