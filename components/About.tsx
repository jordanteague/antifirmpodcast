const hosts = ["Jordan", "George"];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-rule">
      <div className="container-page grid gap-4 py-14 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 md:py-16">
        <h2 id="about-title" className="label text-brand-lime">About the show</h2>
        <div className="grid gap-12">
          <p className="max-w-[60ch] text-[1.3rem] leading-normal">
            ANTIFIRM is a podcast about business, law, and other things that sound boring—until they’re your
            problem.
          </p>
          <div id="hosts" className="grid gap-8 sm:grid-cols-2">
            {hosts.map((name) => (
              <div key={name}>
                <h3 className="font-display text-5xl font-black uppercase leading-none [font-stretch:68%]">{name}</h3>
                <p className="mt-2 text-text-secondary">Host. Bio coming soon.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
