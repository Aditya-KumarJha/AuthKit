import { Package, Settings, Rocket } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Setup Your Database",
      desc: "Simply change your Mongo URI and AuthKit is ready — full control over your user data without complex setup.",
      icon: <Package />,
    },
    {
      step: "2",
      title: "Configure Logins",
      desc: "Enable email, OTP, social logins, and Web3 wallets in minutes with prebuilt backend and UI components.",
      icon: <Settings />,
    },
    {
      step: "3",
      title: "Launch & Manage",
      desc: "Integrate seamlessly into your app and start managing users immediately, with complete flexibility and security.",
      icon: <Rocket />,
    },
  ];

  return (
    <section className="container mx-auto px-6 pb-10">
      <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="flex-1 flex flex-col items-start gap-4 p-6 rounded-xl border transition-transform duration-300
                       bg-white/50 border-gray-200 hover:shadow-lg hover:-translate-y-1
                       dark:bg-zinc-800 dark:border-zinc-700"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl text-indigo-600 dark:text-indigo-400">{s.icon}</div>
              <div className="text-2xl font-bold">{s.step}</div>
            </div>
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
