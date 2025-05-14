import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="dark:bg-gray-dark relative z-10 overflow-hidden bg-white pt-[120px] pb-16 md:pt-[150px] md:pb-[120px] xl:pt-[180px] xl:pb-[160px] 2xl:pt-[210px] 2xl:pb-[200px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h1 className="mb-5 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight dark:text-white">
                  OPR² – Optimisation et Répartition des Ressources
                </h1>

                {/* Circle image container */}
                <div className="mx-auto mb-12 h-[120px] w-[120px] overflow-hidden rounded-full">
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    width={120}
                    height={120}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="text-body-color dark:text-body-color-dark mb-12 text-base leading-relaxed! sm:text-lg md:text-xl">
                  Ce projet de recherche opérationnelle propose deux solutions
                  d’optimisation :
                  <br />
                  Optimisation de la production : amélioration des performances
                  industrielles en tenant compte des contraintes de ressources.
                  <br />
                  Affectation de salles : allocation efficace des espaces selon
                  les demandes et disponibilités.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Background SVG */}
        <div className="absolute top-0 right-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="277"
              cy="63"
              r="225"
              fill="url(#paint0_linear_25:217)"
            />
            {/* More SVG code ... */}
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* More SVG paths */}
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
