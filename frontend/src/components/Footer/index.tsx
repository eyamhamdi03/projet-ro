"use client";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="dark:bg-gray-dark relative z-10 bg-white pt-16 md:pt-20 lg:pt-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block">
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    className="w-full dark:hidden"
                    width={30}
                    height={30}
                  />
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    className="hidden w-full dark:block"
                    width={30}
                    height={30}
                  />
                </Link>
                <p className="text-body-color dark:text-body-color-dark mb-9 text-base leading-relaxed">
                  Ce projet a été réalisé dans le cadre d’un apprentissage. Il
                  n’est pas destiné à un usage en production et doit être
                  utilisé à vos propres risques.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
