import Image from "next/image";

const AboutSectionOne = () => {
  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-primary mb-4 text-3xl font-bold">
            About the Project
          </h2>
        </div>

        <div className="mb-10 flex justify-center">
          <Image
            src="/images/about/illustration.jpg"
            alt="Project Illustration"
            width={500}
            height={300}
            className="rounded-xl shadow-lg"
          />
        </div>
        <p>
          This project was created as part of a learning experience. It was
          created by gL3 Students as Part of Operation Research class{" "}
        </p>
        <br />
        <br />
        <div className="text-center">
          <h4 className="text-primary mb-2 text-xl font-semibold">
            👨‍💻 Project Members
          </h4>
          <ul className="space-y-1 text-lg text-gray-700 dark:text-gray-300">
            <li>Eya Mhamdi</li>
            <li>Ahmed Amin Chabah</li>
            <li>Moetez Souilem</li>
            <li>Nour Ayari</li>
            <li>Mazen Ammar</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
