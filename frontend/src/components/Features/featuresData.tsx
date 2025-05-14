import { Feature } from "@/types/feature";
import { LuFactory } from "react-icons/lu";
import { FaNetworkWired } from "react-icons/fa";

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
      "Ce problème consiste à attribuer de manière optimale des chambres à différentes ressources, telles que des départements ou des classes, en fonction d'un emploi du temps prédéfini et des capacités des chambres. C'est un problème de programmation linéaire nombres entiers (PLNE).",
    link: "/rooms-allocation",
  },
  {
    id: 2,
    icon: <LuFactory size={30} color="black" />,
    title: "Problème de production",
    paragraph:
      "L'objectif de ce problème est de déterminer combien d'unités de chaque produit fabriquer. Ce problème est un problème de programmation linéaire (PL).",
    link: "/production-optimization",
  },
  {
    id: 3,
    icon: <FaNetworkWired size={30} color="black" />,
    title: "Problème de flot à coût minimum",
    paragraph:
      "Ce problème consiste à envoyer un flot d'une source à une destination à travers un réseau, de manière à minimiser le coût total d'acheminement tout en respectant les capacités des arcs et la demande. Il est couramment utilisé dans les domaines de la logistique et des télécommunications.",
    link: "/mcf",
  },
];

export default featuresData;
