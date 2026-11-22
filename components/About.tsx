const hosts = [
  {
    name: "Jordan",
    bio: "Jordan Teague is a founding partner and Chief Strategy Officer at Campbell Teague. Professionally allergic to “that’s how we’ve always done it.”",
  },
  {
    name: "George",
    bio: "George Campbell is a founding partner and Managing Partner at Campbell Teague. When it comes to lawyers who mail it in, he’s got…thoughts.",
  },
];

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
            {hosts.map(({ name, bio }) => (
              <div key={name}>
                <h3 className="font-display text-5xl font-black uppercase leading-none [font-stretch:68%]">{name}</h3>
                <p className="mt-2 max-w-[42ch] text-text-secondary">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
