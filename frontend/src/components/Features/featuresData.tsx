import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <img
        src="/images/features/house-plan.png"
        alt="Rooms Allocation"
        width={40}
        height={41}
      />
    ),
    title: "Rooms Allocation Problem",
    paragraph:
      "Optimally assigns rooms to resources such as departments or classes based on a predefined schedule and room capacities. This problem is modeled using linear programming techniques.",
  },
  {
    id: 2,
    icon: (
      <img
        src="/images/features/location.png"
        alt="Facility Location"
        width={40}
        height={40}
      />
    ),
    title: "Facility Location Problem",
    paragraph:
      "Determines the optimal placement of facilities to minimize transportation costs or maximize service coverage.",
  },
];

export default featuresData;
