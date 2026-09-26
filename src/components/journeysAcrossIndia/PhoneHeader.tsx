/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: PHONE HEADER BAR
 * Matches the top header bar in every frame of the storyboard:
 * Left: "SJH" brandmark
 * Right: Two-line editorial hamburger icon
 */

export function PhoneHeader() {
  return (
    <header className="p9-phoneHeader" aria-label="SJH Brand Header">
      <span className="p9-phoneHeader__brand">SJH</span>
      <div className="p9-phoneHeader__menu" aria-hidden="true">
        <span className="p9-phoneHeader__menuLine" />
        <span className="p9-phoneHeader__menuLine" />
      </div>
    </header>
  );
}
