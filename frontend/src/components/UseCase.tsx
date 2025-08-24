"use client";

import React from "react";
import MinimalCard, {
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from "../components/ui/minimal-card";
import BadgeButton from "../components/ui/badge-button";

const useCase = () => {
  const cards = [
    {
      title: "Frontend Developer",
      description:
        "AuthKit made it super easy to add email, social, and Web3 logins to my app without writing authentication logic from scratch.",
      src: "/giphy/giphy-1.gif",
      alt: "Image 1",
    },
    {
      title: "Backend Engineer",
      description:
        "Integrating JWT-based authentication and password resets was seamless with AuthKit's prebuilt backend.",
      src: "/giphy/giphy-2.gif",
      alt: "Image 2",
    },
    {
      title: "Startup Founder",
      description:
        "AuthKit saved our team weeks of development time while keeping user authentication secure and reliable.",
      src: "/giphy/giphy-3.gif",
      alt: "Image 3",
    },
  ];

  return (
    <div className="py-10">
      <div className="sm:w-[90%] md:w-[100%] lg:w-[75%] rounded-3xl shadow mx-auto">
        <div className="p-6 shadow rounded-3xl mx-auto">
          <BadgeButton>Templates</BadgeButton>

          <div className="flex flex-col md:flex-row justify-center items-start gap-6 mt-6">
            {cards.map((card, key) => (
              <MinimalCard
                key={key}
                className="w-full md:w-1/3 bg-[#2a2a2a] text-white rounded-2xl shadow-md"
              >
                <MinimalCardImage
                  className="h-[180px] w-full object-cover rounded-t-2xl"
                  src={card.src}
                  alt={card.alt}
                />
                <MinimalCardTitle>{card.title}</MinimalCardTitle>
                <MinimalCardDescription>
                  {card.description}
                </MinimalCardDescription>
              </MinimalCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default useCase;
