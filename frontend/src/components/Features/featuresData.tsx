import { Feature } from "@/types/feature";
import { LuFactory } from "react-icons/lu";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <img
        src="/images/features/house-plan.png"
        alt="Problème d'allocation des chambres"
        width={40}
        height={41}
      />
    ),
    title: "Problème d'allocation des chambres",
    paragraph:
      "Ce problème consiste à attribuer de manière optimale des chambres à différentes ressources, telles que des départements ou des classes, en fonction d'un emploi du temps prédéfini et des capacités des chambres. C'est un problème de programmation linéaire nombres entriers PLNE .",
  },
  {
    id: 2,
    icon: <LuFactory />,
    title: "Problème de production",
    paragraph:
      "L'objectif de ce problème est de déterminer combien d'unités de chaque produit fabriquer. Ce problème est un problème de programmation linéaire (PL)",
  },
];

export default featuresData;
