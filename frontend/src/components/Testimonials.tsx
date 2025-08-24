"use client";
import React, { useState } from "react";
import HoverExpand from "./ui/hover-expand";

export const stories = [
  {
    id: 1,
    name: "Frontend Developer",
    role: "Web App Creator",
    quote:
      "With AuthKit, I can implement login, social sign-in, and Web3 wallets without struggling with complex services. Just change the Mongo URI and it works!",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
  },
  {
    id: 2,
    name: "Backend Engineer",
    role: "API Integrator",
    quote:
      "AuthKit’s backend is ready to go — JWT tokens, password reset, and OTP built-in. Full control over my database makes development so much easier.",
    image: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
  },
  {
    id: 3,
    name: "Startup Founder",
    role: "Product Owner",
    quote:
      "I no longer need to figure out complex auth providers. AuthKit saved us weeks of time and gives us full ownership of user data.",
    image: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  },
  {
    id: 4,
    name: "Full Stack Developer",
    role: "App Builder",
    quote:
      "Supporting multiple login methods is simple — Google, GitHub, MetaMask, WalletConnect — all integrated and beginner-friendly.",
    image: "https://cdn-icons-png.flaticon.com/512/2784/2784479.png",
  },
  {
    id: 5,
    name: "UX Designer",
    role: "Interface Expert",
    quote:
      "Prebuilt UI components in AuthKit let me create beautiful login flows quickly without worrying about backend complexity.",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995569.png",
  },
  {
    id: 6,
    name: "Security Specialist",
    role: "Authentication Auditor",
    quote:
      "AuthKit provides secure password handling, OTP, and JWT tokens while letting us store everything in our own database safely.",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    id: 7,
    name: "Web3 Enthusiast",
    role: "Decentralized App User",
    quote:
      "Logging in via MetaMask or WalletConnect is fast and secure. AuthKit makes it simple to integrate without losing control of data.",
    image: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },
  {
    id: 8,
    name: "Educator / Mentor",
    role: "App Teacher",
    quote:
      "Onboarding students is easier than ever. AuthKit supports multiple login options while giving me complete control over the database.",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
  },
];

export default function SuccessStories() {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <section className="relative p-16">
      <div className="container sm:mx-4 md:mx-auto md:px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Success Stories
        </h2>
        <p className="text-muted-foreground mb-4">
          Real developers and teams love how AuthKit gives full control, simplicity, and flexibility for authentication.
        </p>

        <HoverExpand
          images={stories.map((s) => s.image)}
          maxThumbnails={stories.length}
          thumbnailHeight={220}
          modalImageSize={420}
          onHover={(index) => setHoveredIndex(index)}
        />

        <div className="mt-6 max-w-2xl mx-auto">
          <p className="text-lg text-muted-foreground italic mb-4">
            “{stories[hoveredIndex].quote}”
          </p>
          <h3 className="text-foreground font-semibold">
            {stories[hoveredIndex].name}
          </h3>
          <span className="text-sm text-muted-foreground">
            {stories[hoveredIndex].role}
          </span>
        </div>
      </div>
    </section>
  );
}
