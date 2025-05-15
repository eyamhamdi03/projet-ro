import Link from "next/link";
import { Feature } from "@/types/feature";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph, link } = feature;

  return (
    <Link href={link}>
      <div className="hover:border-primary hover:shadow-lg-color w-full cursor-pointer rounded-lg border border-gray-300 p-6 transition duration-300">
        <div className="wow fadeInUp" data-wow-delay=".15s">
          <div className="bg-primary/10 text-primary mx-auto mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md text-center">
            {icon}
          </div>
          <h3 className="mb-5 text-center text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
            {title}
          </h3>
          <p className="text-body-color pr-[10px] text-center text-base leading-relaxed font-medium">
            {paragraph}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SingleFeature;
