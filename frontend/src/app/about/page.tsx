import AboutSectionOne from "@/components/About/AboutSectionOne";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Operations Research Project",
  description:
    "About page for the Operations Research project developed by GL3 students.",
};

const AboutPage = () => {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <AboutSectionOne />
    </>
  );
};

export default AboutPage;
