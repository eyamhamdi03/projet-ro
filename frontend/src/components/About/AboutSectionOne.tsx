import Image from "next/image";

// Define the team members list
const teamMembers = [
  {
    name: "Eya Mhamdi",
    image: "/images/eya.jpg",
  },
  {
    name: "Ahmed Amin Chabah",
    image: "/images/amin.jpg",
  },
  {
    name: "Moetez Souilem",
    image: "/images/moetez.jpg",
  },
  {
    name: "Nour Ayari",
    image: "/images/nour.jpg",
  },
  {
    name: "Mazen Ammar",
    image: "/images/mazen.jpg",
  },
];

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

        <p className="text-center text-lg text-gray-800 dark:text-gray-200">
          This project was created as part of a learning experience. It was
          created by gL3 Students as part of the Operations Research class.
        </p>

        <div className="mt-12 text-center">
          <h4 className="text-primary mb-6 text-2xl font-semibold">
            👨‍💻 Project Members
          </h4>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center"
              >
                <div className="h-[140px] w-[120px] overflow-hidden rounded-md shadow-md">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={120}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                  {member.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;
